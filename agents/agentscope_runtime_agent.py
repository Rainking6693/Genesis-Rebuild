"""
AGENTSCOPE RUNTIME AGENT - Runtime Performance & Configuration Management
Version: 1.0 (Tier 2 - High Value Memory Integration)
Created: November 13, 2025

Manages runtime performance patterns and execution configurations for agent deployment,
with persistent memory for runtime metrics and optimization strategies.

MODEL: GPT-4o-mini ($0.15/1M input, $0.60/1M output)

CAPABILITIES:
- Runtime performance pattern recognition
- Sandbox execution optimization
- Resource allocation tracking
- Configuration learning and optimization
- Performance metric aggregation
- Persistent memory for runtime patterns

ARCHITECTURE:
- Microsoft Agent Framework for orchestration
- MemoryTool Integration (Tier 2 - High Value):
  * App scope: Cross-agent runtime optimization patterns
  * User scope: User-specific runtime configurations and preferences
  * Semantic search for similar runtime scenarios
  * 49% F1 improvement through persistent memory (MemoryOS benchmark)

MEMORY INTEGRATION (Tier 2 - High Value):
1. store_runtime_metrics() - Store runtime performance data
2. recall_performance_patterns() - Retrieve optimal runtime configurations
3. store_sandbox_config() - Persist sandbox setup strategies
4. recall_sandbox_patterns() - Learn from historical sandbox performance

Memory Scopes:
- app: Cross-agent runtime knowledge (all AgentScope agents share learnings)
- user: User-specific runtime configurations and resource preferences
"""

import asyncio
import json
import logging
import os
import re
import time
import uuid
from dataclasses import dataclass, asdict, field
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, List, Optional, Any, Tuple
from collections import defaultdict

# Microsoft Agent Framework imports
from agent_framework import ChatAgent
from agent_framework.azure import AzureAIAgentClient
from agent_framework.observability import setup_observability
from azure.identity.aio import AzureCliCredential

# MemoryOS MongoDB adapter for persistent runtime memory
from infrastructure.memory_os_mongodb_adapter import (
    GenesisMemoryOSMongoDB,
    create_genesis_memory_mongodb
)

# MemoryTool for structured memory operations
from infrastructure.memory.orchestrator_memory_tool import MemoryTool

# Setup observability
setup_observability(enable_sensitive_data=True)

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@dataclass
class RuntimeMetrics:
    """Runtime performance metrics"""
    metric_id: str
    agent_id: str
    execution_time_ms: float
    memory_used_mb: float
    cpu_usage_percent: float
    sandbox_type: str
    success: bool
    error_msg: Optional[str] = None
    created_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))
    metadata: Dict[str, Any] = field(default_factory=dict)


@dataclass
class SandboxConfig:
    """Sandbox configuration for agent execution"""
    config_id: str
    sandbox_type: str  # "base", "gui", "browser", "filesystem"
    timeout_seconds: int
    memory_limit_mb: int
    cpu_limit: float
    network_enabled: bool
    allowed_imports: List[str]
    created_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))
    metadata: Dict[str, Any] = field(default_factory=dict)


@dataclass
class PerformancePattern:
    """Learned performance pattern from runtime execution"""
    pattern_id: str
    pattern_name: str
    sandbox_type: str
    avg_execution_time_ms: float
    avg_memory_mb: float
    success_rate: float
    usage_count: int
    created_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))
    last_used: datetime = field(default_factory=lambda: datetime.now(timezone.utc))
    optimal_config: Dict[str, Any] = field(default_factory=dict)


class AgentScopeRuntimeAgent:
    """
    AgentScope Runtime Agent - Manages runtime performance and configurations.

    Tracks runtime metrics, learns optimal sandbox configurations, and
    provides recommendations for runtime optimization across deployments.
    """

    def __init__(
        self,
        agent_id: str = "agentscope-runtime-001",
        mongodb_uri: str = "mongodb://localhost:27017/",
        database_name: str = "genesis_memory",
        enable_memory: bool = True
    ):
        """
        Initialize AgentScope Runtime Agent.

        Args:
            agent_id: Unique agent identifier
            mongodb_uri: MongoDB connection URI
            database_name: Database name for memory storage
            enable_memory: Enable persistent memory integration
        """
        self.agent_id = agent_id
        self.enable_memory = enable_memory

        # Initialize memory system
        if self.enable_memory:
            try:
                self.memory = create_genesis_memory_mongodb(
                    mongodb_uri=mongodb_uri,
                    database_name=database_name
                )
                self.memory_tool = MemoryTool(namespace=f"{agent_id}_runtime")
                logger.info(f"Memory system initialized for {agent_id}")
            except Exception as e:
                logger.warning(f"Failed to initialize memory: {e}. Running in memory-disabled mode.")
                self.enable_memory = False
                self.memory = None
                self.memory_tool = None

        # Initialize Agent Framework client
        self.client: Optional[AzureAIAgentClient] = None
        self.agent: Optional[ChatAgent] = None

        # Local runtime metrics storage
        self.runtime_metrics: List[RuntimeMetrics] = []
        self.sandbox_configs: Dict[str, SandboxConfig] = {}
        self.performance_patterns: Dict[str, PerformancePattern] = {}

    async def initialize_agent(self):
        """Initialize Azure AI Agent Framework."""
        try:
            credentials = AzureCliCredential()
            self.client = AzureAIAgentClient(
                endpoint=os.getenv("AZURE_AGENT_ENDPOINT", ""),
                credential=credentials
            )

            self.agent = ChatAgent(
                name=self.agent_id,
                model="gpt-4o-mini",
                instructions="You are a runtime performance optimization agent. Analyze runtime metrics and provide optimization recommendations."
            )
            logger.info(f"Agent Framework initialized for {self.agent_id}")
        except Exception as e:
            logger.error(f"Failed to initialize Agent Framework: {e}")

    async def store_runtime_metrics(
        self,
        execution_time_ms: float,
        memory_used_mb: float,
        cpu_usage_percent: float,
        sandbox_type: str,
        success: bool,
        error_msg: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None,
        user_id: str = "default_user"
    ) -> str:
        """
        Store runtime metrics in memory.

        Args:
            execution_time_ms: Execution time in milliseconds
            memory_used_mb: Memory usage in MB
            cpu_usage_percent: CPU usage percentage (0-100)
            sandbox_type: Type of sandbox used
            success: Whether execution was successful
            error_msg: Optional error message if failed
            metadata: Optional additional metadata
            user_id: User identifier for memory scope

        Returns:
            Metric ID
        """
        metric_id = f"metric_{uuid.uuid4().hex[:12]}"

        metrics = RuntimeMetrics(
            metric_id=metric_id,
            agent_id=self.agent_id,
            execution_time_ms=execution_time_ms,
            memory_used_mb=memory_used_mb,
            cpu_usage_percent=cpu_usage_percent,
            sandbox_type=sandbox_type,
            success=success,
            error_msg=error_msg,
            metadata=metadata or {}
        )

        # Store in local cache
        self.runtime_metrics.append(metrics)

        # Store in persistent memory if enabled
        if self.enable_memory and self.memory_tool:
            try:
                memory_data = {
                    "metric_type": "runtime_metrics",
                    "execution_time_ms": execution_time_ms,
                    "memory_used_mb": memory_used_mb,
                    "cpu_usage_percent": cpu_usage_percent,
                    "sandbox_type": sandbox_type,
                    "success": success,
                    "error_msg": error_msg
                }

                if metadata:
                    memory_data.update(metadata)

                # Store with semantic searchability
                await self.memory_tool.store_workflow(
                    task_type="runtime_metrics",
                    workflow_steps=[sandbox_type, "metrics_recorded"],
                    success=success,
                    duration=execution_time_ms / 1000.0,
                    session_id=user_id,
                    metadata=memory_data
                )
                logger.info(f"Stored runtime metrics: {metric_id}")
            except Exception as e:
                logger.warning(f"Failed to store metrics in memory: {e}")

        return metric_id

    async def recall_performance_patterns(
        self,
        sandbox_type: Optional[str] = None,
        min_success_rate: float = 0.8,
        user_id: str = "default_user"
    ) -> List[PerformancePattern]:
        """
        Retrieve performance patterns from memory.

        Args:
            sandbox_type: Filter by sandbox type (optional)
            min_success_rate: Minimum success rate threshold
            user_id: User identifier for memory scope

        Returns:
            List of matching performance patterns
        """
        patterns = []

        # Retrieve from local cache
        for pattern in self.performance_patterns.values():
            if pattern.success_rate >= min_success_rate:
                if sandbox_type is None or pattern.sandbox_type == sandbox_type:
                    patterns.append(pattern)

        # Retrieve from persistent memory if enabled
        if self.enable_memory and self.memory_tool:
            try:
                memory_patterns = await self.memory_tool.retrieve_workflow_patterns(
                    task_type="runtime_metrics",
                    min_success_rate=min_success_rate
                )
                logger.info(f"Retrieved {len(memory_patterns)} patterns from persistent memory")
            except Exception as e:
                logger.warning(f"Failed to retrieve patterns from memory: {e}")

        return sorted(patterns, key=lambda p: p.success_rate, reverse=True)

    async def store_sandbox_config(
        self,
        sandbox_type: str,
        timeout_seconds: int,
        memory_limit_mb: int,
        cpu_limit: float,
        network_enabled: bool,
        allowed_imports: Optional[List[str]] = None,
        metadata: Optional[Dict[str, Any]] = None,
        user_id: str = "default_user"
    ) -> str:
        """
        Store sandbox configuration in memory.

        Args:
            sandbox_type: Type of sandbox
            timeout_seconds: Timeout in seconds
            memory_limit_mb: Memory limit in MB
            cpu_limit: CPU limit as fraction of cores
            network_enabled: Whether network is enabled
            allowed_imports: List of allowed Python imports
            metadata: Optional additional metadata
            user_id: User identifier for memory scope

        Returns:
            Configuration ID
        """
        config_id = f"config_{uuid.uuid4().hex[:12]}"

        config = SandboxConfig(
            config_id=config_id,
            sandbox_type=sandbox_type,
            timeout_seconds=timeout_seconds,
            memory_limit_mb=memory_limit_mb,
            cpu_limit=cpu_limit,
            network_enabled=network_enabled,
            allowed_imports=allowed_imports or [],
            metadata=metadata or {}
        )

        # Store in local cache
        self.sandbox_configs[config_id] = config

        # Store in persistent memory if enabled
        if self.enable_memory and self.memory_tool:
            try:
                config_data = {
                    "config_type": "sandbox_config",
                    "sandbox_type": sandbox_type,
                    "timeout_seconds": timeout_seconds,
                    "memory_limit_mb": memory_limit_mb,
                    "cpu_limit": cpu_limit,
                    "network_enabled": network_enabled,
                    "allowed_imports": allowed_imports or []
                }

                if metadata:
                    config_data.update(metadata)

                await self.memory_tool.store_workflow(
                    task_type="sandbox_config",
                    workflow_steps=[sandbox_type, "config_stored"],
                    success=True,
                    duration=0.0,
                    session_id=user_id,
                    metadata=config_data
                )
                logger.info(f"Stored sandbox config: {config_id}")
            except Exception as e:
                logger.warning(f"Failed to store config in memory: {e}")

        return config_id

    async def get_metrics_summary(self) -> Dict[str, Any]:
        """
        Get summary of runtime metrics.

        Returns:
            Dictionary with runtime metrics summary
        """
        if not self.runtime_metrics:
            return {"total_executions": 0}

        successful = [m for m in self.runtime_metrics if m.success]
        failed = [m for m in self.runtime_metrics if not m.success]

        metrics_count = len(self.runtime_metrics)
        avg_time = sum(m.execution_time_ms for m in self.runtime_metrics) / metrics_count if metrics_count > 0 else 0
        avg_memory = sum(m.memory_used_mb for m in self.runtime_metrics) / metrics_count if metrics_count > 0 else 0
        avg_cpu = sum(m.cpu_usage_percent for m in self.runtime_metrics) / metrics_count if metrics_count > 0 else 0

        return {
            "total_executions": metrics_count,
            "successful_executions": len(successful),
            "failed_executions": len(failed),
            "success_rate": len(successful) / metrics_count if metrics_count > 0 else 0,
            "avg_execution_time_ms": avg_time,
            "avg_memory_mb": avg_memory,
            "avg_cpu_percent": avg_cpu,
            "sandbox_types": list(set(m.sandbox_type for m in self.runtime_metrics))
        }

    async def recommend_optimization(
        self,
        current_sandbox_type: str,
        current_metrics: Dict[str, float]
    ) -> Dict[str, Any]:
        """
        Recommend runtime optimization based on learned patterns.

        Args:
            current_sandbox_type: Current sandbox type
            current_metrics: Current performance metrics

        Returns:
            Optimization recommendations
        """
        patterns = await self.recall_performance_patterns(
            sandbox_type=current_sandbox_type,
            min_success_rate=0.75
        )

        if not patterns:
            return {"recommendation": "Insufficient historical data for optimization"}

        best_pattern = patterns[0]

        # Calculate safe improvement percentages
        exec_time_ms = current_metrics.get("execution_time_ms", 0)
        exec_time_reduction = 0
        if exec_time_ms > 0:
            exec_time_reduction = (
                (exec_time_ms - best_pattern.avg_execution_time_ms) / exec_time_ms * 100
            )

        memory_mb = current_metrics.get("memory_mb", 0)
        memory_reduction = 0
        if memory_mb > 0:
            memory_reduction = (
                (memory_mb - best_pattern.avg_memory_mb) / memory_mb * 100
            )

        recommendations = {
            "recommended_pattern": best_pattern.pattern_name,
            "optimal_config": best_pattern.optimal_config,
            "estimated_improvement": {
                "execution_time_reduction_percent": exec_time_reduction,
                "memory_reduction_percent": memory_reduction,
                "success_rate_improvement": best_pattern.success_rate
            }
        }

        return recommendations

    async def run(self):
        """Execute agent workflow."""
        try:
            await self.initialize_agent()
            logger.info(f"AgentScope Runtime Agent {self.agent_id} is running")

            # Keep agent running
            while True:
                await asyncio.sleep(60)
        except asyncio.CancelledError:
            logger.info(f"AgentScope Runtime Agent {self.agent_id} was cancelled")
            raise
        except Exception as e:
            logger.error(f"Error in agent run: {e}", exc_info=True)

    def __del__(self):
        """Cleanup resources."""
        if self.enable_memory and self.memory:
            try:
                self.memory.cleanup()
            except Exception as e:
                logger.warning(f"Error during cleanup: {e}")


async def create_runtime_agent(
    agent_id: str = "agentscope-runtime-001",
    mongodb_uri: str = "mongodb://localhost:27017/",
    database_name: str = "genesis_memory",
    enable_memory: bool = True
) -> AgentScopeRuntimeAgent:
    """
    Factory function to create and initialize an AgentScope Runtime Agent.

    Args:
        agent_id: Unique agent identifier
        mongodb_uri: MongoDB connection URI
        database_name: Database name for memory storage
        enable_memory: Enable persistent memory integration

    Returns:
        Initialized AgentScopeRuntimeAgent instance
    """
    agent = AgentScopeRuntimeAgent(
        agent_id=agent_id,
        mongodb_uri=mongodb_uri,
        database_name=database_name,
        enable_memory=enable_memory
    )
    await agent.initialize_agent()
    return agent


if __name__ == "__main__":
    # Example usage
    async def main():
        agent = await create_runtime_agent(enable_memory=True)

        # Store some runtime metrics
        metric_id = await agent.store_runtime_metrics(
            execution_time_ms=1250.5,
            memory_used_mb=256.3,
            cpu_usage_percent=45.2,
            sandbox_type="base",
            success=True,
            metadata={"task": "code_execution"}
        )
        print(f"Stored metric: {metric_id}")

        # Get metrics summary
        summary = await agent.get_metrics_summary()
        print(f"Metrics summary: {summary}")

    asyncio.run(main())
