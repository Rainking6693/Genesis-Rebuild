"""
MONITORING AGENT - Tier 3 Specialized Agent
Version: 1.0 (Tier 3 - Specialized Memory Integration)
Last Updated: November 13, 2025

Agent for system monitoring and alerting with persistent memory learning.

MODEL: Gemini 2.5 Flash (372 tokens/sec, $0.03/1M tokens)

CAPABILITIES:
- System monitoring and alerting
- Pattern learning from alert histories
- User-specific monitoring configurations
- Cross-agent monitoring knowledge sharing
- Anomaly detection and trend analysis

MEMORY INTEGRATION (Tier 3 - Specialized):
1. store_alert_pattern() - Store alert patterns
2. recall_patterns() - Retrieve similar alert configurations
3. monitor_metrics() - Monitor with learned patterns
4. recall_user_configs() - Get user monitoring preferences

Memory Scopes:
- app: Cross-agent monitoring knowledge (shared patterns)
- user: User-specific monitoring configurations
"""

import asyncio
import json
import logging
import os
import uuid
from dataclasses import dataclass, asdict
from datetime import datetime, timezone, timedelta
from typing import Dict, List, Optional, Any

from infrastructure.memory_os_mongodb_adapter import (
    GenesisMemoryOSMongoDB,
    create_genesis_memory_mongodb
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@dataclass
class MonitoringConfig:
    """Configuration for monitoring"""
    monitor_name: str
    metric_type: str  # cpu, memory, latency, errors, custom
    threshold: float
    comparison: str = "greater_than"  # greater_than, less_than, equals
    alert_channel: str = "email"  # email, slack, pagerduty
    check_interval: int = 60  # seconds
    metadata: Optional[Dict[str, Any]] = None

    def __post_init__(self):
        if self.metadata is None:
            self.metadata = {}


@dataclass
class Alert:
    """Alert generated from monitoring"""
    alert_id: str
    monitor_name: str
    metric_type: str
    current_value: float
    threshold: float
    severity: str  # critical, warning, info
    message: str
    timestamp: str
    metadata: Dict[str, Any]


@dataclass
class MonitoringResult:
    """Result of monitoring operation"""
    success: bool
    monitor_name: Optional[str] = None
    alerts_triggered: Optional[List[Alert]] = None
    metrics_checked: Optional[int] = None
    anomalies_detected: Optional[int] = None
    error: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None

    def __post_init__(self):
        if self.alerts_triggered is None:
            self.alerts_triggered = []
        if self.metadata is None:
            self.metadata = {}


class MemoryTool:
    """MemoryTool wrapper for Monitoring Agent alert pattern memory."""

    def __init__(self, backend: GenesisMemoryOSMongoDB, agent_id: str = "monitoring_agent"):
        self.backend = backend
        self.agent_id = agent_id

    def store_memory(
        self,
        content: Dict[str, Any],
        scope: str = "app",
        provenance: Optional[Dict[str, Any]] = None,
        memory_type: str = "conversation"
    ) -> bool:
        try:
            user_id = self._build_user_id(scope, content.get("user_id"))
            user_input = self._build_user_input(content)
            agent_response = self._build_agent_response(content)

            stored_content = {
                "user_input": user_input,
                "agent_response": agent_response,
                "raw_content": content
            }

            self.backend.store(
                agent_id=self.agent_id,
                user_id=user_id,
                user_input=user_input,
                agent_response=json.dumps(stored_content),
                memory_type=memory_type
            )

            return True

        except Exception as e:
            logger.error(f"[Monitoring MemoryTool] Failed to store memory: {e}")
            return False

    def retrieve_memory(
        self,
        query: str,
        scope: str = "app",
        filters: Optional[Dict[str, Any]] = None,
        top_k: int = 5
    ) -> List[Dict[str, Any]]:
        try:
            user_id_filter = filters.get("user_id") if filters else None
            user_id = self._build_user_id(scope, user_id_filter)

            memories = self.backend.retrieve(
                agent_id=self.agent_id,
                user_id=user_id,
                query=query,
                memory_type=None,
                top_k=top_k * 2
            )

            parsed_memories = []
            for memory in memories:
                content = memory.get('content', {})
                if isinstance(content, dict):
                    agent_response = content.get('agent_response', '')
                    if isinstance(agent_response, str) and agent_response.startswith('{'):
                        try:
                            parsed_content = json.loads(agent_response)
                            memory['content'] = parsed_content
                        except json.JSONDecodeError:
                            pass
                parsed_memories.append(memory)

            if filters:
                parsed_memories = self._apply_filters(parsed_memories, filters)

            return parsed_memories[:top_k]

        except Exception as e:
            logger.error(f"[Monitoring MemoryTool] Failed to retrieve memory: {e}")
            return []

    def _build_user_id(self, scope: str, user_id: Optional[str] = None) -> str:
        if scope == "app":
            return "monitoring_global"
        elif scope == "user" and user_id:
            return f"monitoring_{user_id}"
        else:
            return "monitoring_default"

    def _build_user_input(self, content: Dict[str, Any]) -> str:
        monitor_name = content.get('monitor_name', 'unknown')
        metric_type = content.get('metric_type', 'unknown')
        return f"Monitor {metric_type}: {monitor_name}"

    def _build_agent_response(self, content: Dict[str, Any]) -> str:
        if "result" in content:
            alerts = content.get('alerts_triggered', 0)
            return f"Monitoring: {alerts} alerts triggered"
        return json.dumps(content, indent=2)

    def _apply_filters(
        self,
        memories: List[Dict[str, Any]],
        filters: Dict[str, Any]
    ) -> List[Dict[str, Any]]:
        filtered = []
        for memory in memories:
            content = memory.get('content', {})
            raw_content = content.get('raw_content', content)

            matches = True
            for key, value in filters.items():
                if key == "user_id":
                    continue
                if isinstance(raw_content, dict) and raw_content.get(key) != value:
                    matches = False
                    break

            if matches:
                filtered.append(memory)
        return filtered


class MonitoringAgent:
    """Monitoring Agent - Monitors systems with memory learning."""

    def __init__(
        self,
        business_id: str = "default",
        enable_memory: bool = True
    ):
        self.business_id = business_id
        self.agent_id = f"monitoring_agent_{business_id}"

        self.enable_memory = enable_memory
        self.memory: Optional[GenesisMemoryOSMongoDB] = None
        self.memory_tool: Optional[MemoryTool] = None
        if enable_memory:
            self._init_memory()

        self.checks_performed = 0
        self.alerts_triggered = 0

        logger.info(f"📊 Monitoring Agent initialized for business: {business_id}")
        logger.info(f"   Memory: {'Enabled' if self.enable_memory else 'Disabled'}")

    def _init_memory(self):
        try:
            mongodb_uri = os.getenv("MONGODB_URI", "mongodb://localhost:27017/")
            self.memory = create_genesis_memory_mongodb(
                mongodb_uri=mongodb_uri,
                database_name="genesis_memory_monitoring",
                short_term_capacity=10,
                mid_term_capacity=500,  # Higher capacity for alert history
                long_term_knowledge_capacity=100
            )

            self.memory_tool = MemoryTool(backend=self.memory, agent_id="monitoring_agent")

            logger.info("[MonitoringAgent] MemoryOS MongoDB initialized with MemoryTool integration")
        except Exception as e:
            logger.warning(f"[MonitoringAgent] Failed to initialize MemoryOS: {e}. Memory features disabled.")
            self.memory = None
            self.memory_tool = None
            self.enable_memory = False

    async def store_alert_pattern(
        self,
        monitor_name: str,
        metric_type: str,
        config: Dict[str, Any],
        result: Dict[str, Any],
        alerts_triggered: int,
        user_id: Optional[str] = None
    ) -> bool:
        """Store alert pattern for learning."""
        if not self.memory_tool:
            return False

        try:
            content = {
                "monitor_name": monitor_name,
                "metric_type": metric_type,
                "config": config,
                "result": result,
                "alerts_triggered": alerts_triggered,
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "user_id": user_id
            }

            stored = self.memory_tool.store_memory(
                content=content,
                scope="app",
                memory_type="conversation"
            )

            if stored:
                logger.info(f"[MonitoringAgent] Stored alert pattern: {monitor_name}")

            return stored

        except Exception as e:
            logger.error(f"[MonitoringAgent] Failed to store alert pattern: {e}")
            return False

    async def recall_patterns(
        self,
        metric_type: str,
        top_k: int = 5
    ) -> List[Dict[str, Any]]:
        """Recall successful monitoring patterns."""
        if not self.memory_tool:
            return []

        try:
            query = f"monitoring patterns for {metric_type}"

            memories = self.memory_tool.retrieve_memory(
                query=query,
                scope="app",
                filters={},
                top_k=top_k
            )

            patterns = []
            for memory in memories:
                content = memory.get('content', {})
                raw_content = content.get('raw_content', content)

                if isinstance(raw_content, dict):
                    patterns.append({
                        "monitor_name": raw_content.get('monitor_name'),
                        "metric_type": raw_content.get('metric_type'),
                        "config": raw_content.get('config', {}),
                        "alerts_triggered": raw_content.get('alerts_triggered', 0)
                    })

            logger.info(f"[MonitoringAgent] Recalled {len(patterns)} monitoring patterns")
            return patterns

        except Exception as e:
            logger.error(f"[MonitoringAgent] Failed to recall patterns: {e}")
            return []

    async def monitor_metrics(
        self,
        config: MonitoringConfig,
        current_metrics: Dict[str, float],
        user_id: Optional[str] = None
    ) -> MonitoringResult:
        """Monitor metrics with learned patterns."""
        self.checks_performed += 1

        try:
            logger.info(f"📊 Monitoring {config.metric_type}: {config.monitor_name}...")

            # Recall successful patterns
            if self.enable_memory:
                patterns = await self.recall_patterns(metric_type=config.metric_type, top_k=3)
                if patterns:
                    logger.info(f"✓ Using learned patterns from {len(patterns)} monitoring configs")

            # Check metrics against thresholds
            alerts = []
            anomalies_detected = 0

            for metric_name, current_value in current_metrics.items():
                # Check threshold
                is_alert = False
                if config.comparison == "greater_than" and current_value > config.threshold:
                    is_alert = True
                elif config.comparison == "less_than" and current_value < config.threshold:
                    is_alert = True
                elif config.comparison == "equals" and current_value == config.threshold:
                    is_alert = True

                if is_alert:
                    # Determine severity (handle zero threshold)
                    if config.threshold > 0:
                        severity = "critical" if current_value > config.threshold * 1.5 else "warning"
                    else:
                        severity = "warning"

                    alert = Alert(
                        alert_id=f"alert_{uuid.uuid4().hex[:8]}",
                        monitor_name=config.monitor_name,
                        metric_type=config.metric_type,
                        current_value=current_value,
                        threshold=config.threshold,
                        severity=severity,
                        message=f"{metric_name} {config.comparison} threshold: {current_value} vs {config.threshold}",
                        timestamp=datetime.now(timezone.utc).isoformat(),
                        metadata={"metric_name": metric_name}
                    )

                    alerts.append(alert)
                    anomalies_detected += 1

            # Detect anomalies using historical patterns
            if self.enable_memory and patterns:
                # Compare current alert count to historical average
                avg_alerts = sum(p.get('alerts_triggered', 0) for p in patterns) / len(patterns)
                if len(alerts) > avg_alerts * 2:
                    logger.warning(f"⚠️ Anomaly detected: {len(alerts)} alerts vs avg {avg_alerts:.1f}")
                    anomalies_detected += 1

            # Store monitoring result
            if self.enable_memory:
                await self.store_alert_pattern(
                    monitor_name=config.monitor_name,
                    metric_type=config.metric_type,
                    config=asdict(config),
                    result={"metrics_checked": len(current_metrics), "anomalies": anomalies_detected},
                    alerts_triggered=len(alerts),
                    user_id=user_id
                )

            self.alerts_triggered += len(alerts)

            logger.info(f"✅ Monitoring complete: {config.monitor_name} "
                       f"({len(alerts)} alerts, {anomalies_detected} anomalies)")

            return MonitoringResult(
                success=True,
                monitor_name=config.monitor_name,
                alerts_triggered=alerts,
                metrics_checked=len(current_metrics),
                anomalies_detected=anomalies_detected,
                metadata={
                    "metric_type": config.metric_type,
                    "threshold": config.threshold,
                    "timestamp": datetime.now(timezone.utc).isoformat()
                }
            )

        except Exception as e:
            error_msg = str(e)
            logger.error(f"Monitoring failed: {error_msg}")

            # Store failed monitoring
            if self.enable_memory:
                await self.store_alert_pattern(
                    monitor_name=config.monitor_name,
                    metric_type=config.metric_type,
                    config=asdict(config),
                    result={"error": error_msg},
                    alerts_triggered=0,
                    user_id=user_id
                )

            return MonitoringResult(
                success=False,
                error=error_msg
            )

    async def recall_user_configs(
        self,
        user_id: str
    ) -> List[Dict[str, Any]]:
        """Recall user-specific monitoring configurations."""
        if not self.memory_tool:
            return []

        try:
            query = f"user monitoring configurations"

            memories = self.memory_tool.retrieve_memory(
                query=query,
                scope="user",
                filters={"user_id": user_id},
                top_k=10
            )

            configs = []
            for memory in memories:
                content = memory.get('content', {})
                raw_content = content.get('raw_content', content)

                if isinstance(raw_content, dict):
                    configs.append({
                        "monitor_name": raw_content.get('monitor_name'),
                        "metric_type": raw_content.get('metric_type'),
                        "config": raw_content.get('config', {})
                    })

            logger.info(f"[MonitoringAgent] Recalled {len(configs)} user configs for {user_id}")
            return configs

        except Exception as e:
            logger.error(f"[MonitoringAgent] Failed to recall user configs: {e}")
            return []

    def get_statistics(self) -> Dict[str, Any]:
        """Get monitoring statistics."""
        if self.checks_performed > 0:
            alert_rate = self.alerts_triggered / self.checks_performed
        else:
            alert_rate = 0.0

        return {
            "agent_id": self.agent_id,
            "checks_performed": self.checks_performed,
            "alerts_triggered": self.alerts_triggered,
            "alert_rate": alert_rate,
            "memory_enabled": self.enable_memory
        }


async def get_monitoring_agent(
    business_id: str = "default",
    enable_memory: bool = True
) -> MonitoringAgent:
    """Factory function to create Monitoring Agent."""
    agent = MonitoringAgent(
        business_id=business_id,
        enable_memory=enable_memory
    )
    return agent
