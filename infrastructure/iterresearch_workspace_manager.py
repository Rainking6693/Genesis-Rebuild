"""IterResearch workspace manager for long-horizon OmniDaemon flows."""

from __future__ import annotations

import asyncio
import json
from pathlib import Path
from typing import Dict, Any, Optional

from infrastructure.workspace_state_manager import WorkspaceStateManager


class IterResearchWorkspaceManager:
    """Tracks workspace state for business generations and emits insights."""

    def __init__(
        self,
        persistence_root: Optional[Path] = None,
        summary_interval: int = 25,
    ):
        self.persistence_root = (persistence_root or Path("logs/workspace_insights")).resolve()
        self.persistence_root.mkdir(parents=True, exist_ok=True)
        self.summary_interval = summary_interval
        self._managers: Dict[str, WorkspaceStateManager] = {}
        self._lock = asyncio.Lock()

    def _ensure_manager(self, business_id: str) -> WorkspaceStateManager:
        manager = self._managers.get(business_id)
        if manager is None:
            manager = WorkspaceStateManager(
                business_id=business_id,
                persistence_root=self.persistence_root,
                summary_interval=self.summary_interval,
            )
            self._managers[business_id] = manager
        return manager

    async def record_event(self, topic: str, payload: Dict[str, Any]) -> None:
        """Record an event snippet in the workspace state manager."""
        business_id = self._extract_business_id(payload)
        if not business_id:
            return
        manager = self._ensure_manager(business_id)
        event = self._build_event(topic, payload)
        async with self._lock:
            await manager.record_event(event)
            if "business_completed" in topic or payload.get("status") == "completed":
                await manager.finalize()
                self._emit_summary(business_id, manager)

    def _build_event(self, topic: str, payload: Dict[str, Any]) -> Dict[str, Any]:
        return {
            "topic": topic,
            "timestamp": payload.get("timestamp"),
            "agent": payload.get("agent"),
            "component": payload.get("component"),
            "status": payload.get("status"),
            "latency_ms": payload.get("latency_ms"),
            "cost": payload.get("cost"),
            "notes": payload.get("notes"),
        }

    def _extract_business_id(self, payload: Dict[str, Any]) -> Optional[str]:
        return payload.get("business_id") or payload.get("business_name")

    def _emit_summary(self, business_id: str, manager: WorkspaceStateManager) -> None:
        summary_path = self.persistence_root / f"{business_id}_workspace_summary.json"
        snapshot = manager._last_snapshot
        if snapshot:
            with summary_path.open("w", encoding="utf-8") as fd:
                json.dump(snapshot.to_dict(), fd, indent=2)

