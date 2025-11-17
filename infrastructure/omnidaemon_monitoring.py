"""Business Monitor bridge for OmniDaemon events."""

from __future__ import annotations

import asyncio
import json
import logging
from typing import Dict, Any, Optional

from infrastructure.business_monitor import get_monitor
from infrastructure.casebank import CaseBank
from infrastructure.iterresearch_workspace_manager import IterResearchWorkspaceManager
from infrastructure.mamr_attribution import MamrAttributionLayer
from infrastructure.omnidaemon_prometheus import record_event as record_prometheus_event

logger = logging.getLogger(__name__)


class OmniDaemonMonitorHandler:
    """Stateful handler that routes OmniDaemon events into observability subsystems."""

    def __init__(self):
        self.monitor = get_monitor()
        self.casebank = CaseBank()
        self.workspace_manager = IterResearchWorkspaceManager()
        self.attribution_layer = MamrAttributionLayer()

    async def handle_event(self, topic: str, message: Dict[str, Any]) -> Dict[str, Any]:
        payload = message.get("content", {})
        await self.workspace_manager.record_event(topic, payload)
        await self.attribution_layer.record_event(topic, payload)
        self.monitor.record_monitor_event(topic, payload)
        record_prometheus_event(topic, payload)
        await self._record_casebank_failure(topic, payload)
        return {"status": "recorded", "topic": topic}

    async def _record_casebank_failure(self, topic: str, payload: Dict[str, Any]) -> None:
        if "failed" not in topic:
            return
        state = payload.get("component") or payload.get("task") or json.dumps(payload)
        action = payload.get("result") or "failed_component"
        reward = 0.1
        metadata = {
            "agent": payload.get("agent", "unknown"),
            "topic": topic,
            "business_id": payload.get("business_id"),
        }
        try:
            await self.casebank.add_case(state=state, action=action, reward=reward, metadata=metadata)
        except Exception as exc:  # pragma: no cover
            logger.warning("CaseBank ingestion failed: %s", exc)


_handler: Optional[OmniDaemonMonitorHandler] = None


def get_monitor_handler() -> OmniDaemonMonitorHandler:
    global _handler
    if _handler is None:
        _handler = OmniDaemonMonitorHandler()
    return _handler
