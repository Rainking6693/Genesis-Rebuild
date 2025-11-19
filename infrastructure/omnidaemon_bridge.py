"""Bridge between Genesis agents and the OmniDaemon event runtime."""
from __future__ import annotations

import asyncio
import logging
import os
from dataclasses import dataclass
from typing import Any, Awaitable, Callable, Dict, List, Optional

try:
    from omnidaemon import AgentConfig, OmniDaemonSDK
except ImportError:  # pragma: no cover
    OmniDaemonSDK = None
    AgentConfig = None

from infrastructure.business_idea_generator import get_idea_generator
from infrastructure.omnidaemon_callbacks import (
    business_marketing_callback,
    builder_callback,
    core_agent_callback,
    deploy_callback,
    finance_special_callback,
    qa_callback,
    research_callback,
    meta_agent_callback,
)
from infrastructure.omnidaemon_monitoring import get_monitor_handler
from infrastructure.omnidaemon_tracing import trace_callback

logger = logging.getLogger(__name__)


ConfigCallable = Callable[[Dict[str, Any]], Awaitable[Dict[str, Any]]]


@dataclass
class OmniDaemonBridgeConfig:
    redis_url: str = os.getenv("REDIS_URL", "redis://localhost:6379")
    event_bus_type: str = os.getenv("EVENT_BUS_TYPE", "redis_stream")
    storage_backend: str = os.getenv("STORAGE_BACKEND", "redis")
    log_level: str = os.getenv("LOG_LEVEL", "INFO")
    max_retries: int = int(os.getenv("OMNIDAEMON_MAX_RETRIES", "3"))
    retry_delay_seconds: int = int(os.getenv("OMNIDAEMON_RETRY_DELAY", "5"))


class OmniDaemonBridge:
    def __init__(self, config: Optional[OmniDaemonBridgeConfig] = None):
        from omnidaemon.event_bus import RedisStreamEventBus
        from omnidaemon.storage import RedisStore

        self.config = config or OmniDaemonBridgeConfig()
        if OmniDaemonSDK is None:
            raise RuntimeError("OmniDaemon SDK is not installed")

        # Initialize Redis event bus and store
        event_bus = RedisStreamEventBus(redis_url=self.config.redis_url)
        store = RedisStore(redis_url=self.config.redis_url)

        # Initialize SDK with actual event bus objects, not strings
        self.sdk = OmniDaemonSDK(event_bus=event_bus, store=store)
        self.registered: List[str] = []

    async def _register(
        self,
        topic: str,
        callback: ConfigCallable,
        timeout_seconds: int,
    ) -> None:
        traced = trace_callback(topic, callback)
        agent_config = AgentConfig(
            topic=topic,
            callback=traced,
            max_retries=self.config.max_retries,
            retry_delay_seconds=self.config.retry_delay_seconds,
            timeout_seconds=timeout_seconds,
        )
        await self.sdk.register_agent(agent_config)
        self.registered.append(topic)
        logger.info("Registered OmniDaemon agent for topic=%s", topic)

    async def publish_event(
        self,
        topic: str,
        payload: Dict[str, Any],
        correlation_id: Optional[str] = None,
    ) -> Any:
        import json
        from omnidaemon.schemas import EventEnvelope, PayloadBase

        if not hasattr(self.sdk, "publish_task"):
            raise RuntimeError("OmniDaemon SDK does not support publish_task()")

        # Convert payload dict to JSON string for PayloadBase.content
        payload_content = json.dumps(payload)
        envelope = EventEnvelope(
            topic=topic,
            payload=PayloadBase(content=payload_content),
            correlation_id=correlation_id,
        )
        return await self.sdk.publish_task(envelope)

    async def get_task_result(self, task_id: str) -> Any:
        if not hasattr(self.sdk, "get_result"):
            return None
        return await self.sdk.get_result(task_id)

    async def register_business_idea_generator(self) -> None:
        async def idea_callback(message: Dict[str, Any]) -> Dict[str, Any]:
            import json
            generator = get_idea_generator()

            # Extract actual content from the message - it's a JSON string in OmniDaemon
            content_str = message.get("content", "{}")
            try:
                payload = json.loads(content_str) if isinstance(content_str, str) else content_str
            except (json.JSONDecodeError, TypeError):
                payload = {}

            business_type = payload.get("business_type", "saas")
            min_score = float(payload.get("min_score", 70.0))
            idea = await generator.generate_idea(business_type=business_type, min_score=min_score)
            return {
                "status": "success",
                "idea": idea.to_dict(),
                "score": idea.quality_score,
            }

        await self._register("genesis.idea.generate", idea_callback, timeout_seconds=300)

    async def register_builder_agent(self) -> None:
        await self._register("genesis.build", builder_callback, timeout_seconds=600)

    async def register_deploy_agent(self) -> None:
        await self._register("genesis.deploy", deploy_callback, timeout_seconds=1200)

    async def register_qa_agent(self) -> None:
        await self._register("genesis.qa", qa_callback, timeout_seconds=900)

    async def register_research_agent(self) -> None:
        await self._register("genesis.research", research_callback, timeout_seconds=300)

    async def register_core_development_agents(self) -> None:
        topics = {
            "genesis.spec": 300,
            "genesis.architect": 300,
            "genesis.frontend": 450,
            "genesis.backend": 450,
            "genesis.security": 400,
            "genesis.monitoring": 200,
        }
        for topic, timeout in topics.items():
            await self._register(topic, lambda msg, t=topic: core_agent_callback(t, msg), timeout_seconds=timeout)

    async def register_business_marketing_agents(self) -> None:
        topics = {
            "genesis.seo": 200,
            "genesis.content": 250,
            "genesis.marketing": 250,
            "genesis.sales": 220,
            "genesis.support": 300,
        }
        for topic, timeout in topics.items():
            await self._register(topic, lambda msg, t=topic: business_marketing_callback(t, msg), timeout_seconds=timeout)

    async def register_finance_special_agents(self) -> None:
        topics = {
            "genesis.finance": 300,
            "genesis.pricing": 250,
            "genesis.analytics": 250,
            "genesis.email": 200,
            "genesis.commerce": 220,
            "genesis.darwin": 360,
        }
        for topic, timeout in topics.items():
            await self._register(topic, lambda msg, t=topic: finance_special_callback(t, msg), timeout_seconds=timeout)

    async def register_meta_agent(self) -> None:
        await self._register("genesis.meta.orchestrate", meta_agent_callback, timeout_seconds=3600)

    async def register_monitoring_agents(self) -> None:
        topics = {
            "genesis.monitoring.business_created": 300,
            "genesis.monitoring.component_started": 120,
            "genesis.monitoring.component_completed": 120,
            "genesis.monitoring.component_failed": 120,
            "genesis.monitoring.business_completed": 300,
        }
        handler = get_monitor_handler()
        for topic, timeout in topics.items():
            await self._register(topic, lambda msg, t=topic: handler.handle_event(t, msg), timeout_seconds=timeout)

    async def register_all_agents(self) -> None:
        """Register all Genesis agents with OmniDaemon"""
        logger.info("Registering all Genesis agents with OmniDaemon...")
        await self.register_business_idea_generator()
        await self.register_builder_agent()
        await self.register_deploy_agent()
        await self.register_qa_agent()
        await self.register_research_agent()
        await self.register_core_development_agents()
        await self.register_business_marketing_agents()
        await self.register_finance_special_agents()
        await self.register_meta_agent()
        await self.register_monitoring_agents()
        logger.info(f"✅ Successfully registered {len(self.registered)} agents")


_bridge_instance: Optional[OmniDaemonBridge] = None


def get_bridge() -> OmniDaemonBridge:
    global _bridge_instance
    if _bridge_instance is None:
        _bridge_instance = OmniDaemonBridge()
    return _bridge_instance
