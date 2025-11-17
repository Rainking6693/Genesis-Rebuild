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
        self.config = config or OmniDaemonBridgeConfig()
        if OmniDaemonSDK is None:
            raise RuntimeError("OmniDaemon SDK is not installed")
        self.sdk = OmniDaemonSDK(event_bus=self.config.event_bus_type)
        self.registered: List[str] = []

    async def _register(
        self,
        topic: str,
        callback: ConfigCallable,
        timeout_seconds: int,
    ) -> None:
        agent_config = AgentConfig(
            topic=topic,
            callback=callback,
            max_retries=self.config.max_retries,
            retry_delay_seconds=self.config.retry_delay_seconds,
            timeout_seconds=timeout_seconds,
        )
        await self.sdk.register_agent(agent_config)
        self.registered.append(topic)
        logger.info("Registered OmniDaemon agent for topic=%s", topic)

    async def register_business_idea_generator(self) -> None:
        async def idea_callback(message: Dict[str, Any]) -> Dict[str, Any]:
            generator = get_idea_generator()
            business_type = message["content"].get("business_type", "saas")
            min_score = float(message["content"].get("min_score", 70.0))
            idea = await generator.generate_idea(business_type=business_type, min_score=min_score)
            return {
                "status": "success",
                "idea": idea.to_dict(),
                "score": idea.quality_score,
            }

        await self._register("genesis.idea.generate", idea_callback, timeout_seconds=300)

    async def register_builder_agent(self, callback: ConfigCallable) -> None:
        await self._register("genesis.build", callback, timeout_seconds=600)

    async def register_deploy_agent(self, callback: ConfigCallable) -> None:
        await self._register("genesis.deploy", callback, timeout_seconds=1200)
