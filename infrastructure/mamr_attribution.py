"""Dr. MAMR attribution layer for OmniDaemon events."""

from __future__ import annotations

import asyncio
import json
from collections import defaultdict
from pathlib import Path
from typing import Dict, Any

from infrastructure.agentevolver.self_attributing import AttributionEngine
from infrastructure.agentevolver.self_attributing import AttributionReport


class MamrAttributionLayer:
    """Attribution layer that converts OmniDaemon events into multi-agent reports."""

    def __init__(
        self,
        report_path: Path = Path("logs/omnidaemon/mamr_reports.jsonl"),
    ):
        self.engine = AttributionEngine()
        self._pending: Dict[str, Dict[str, float]] = defaultdict(dict)
        self._report_path = report_path
        self._report_path.parent.mkdir(parents=True, exist_ok=True)
        self._lock = asyncio.Lock()

    async def record_event(self, topic: str, payload: Dict[str, Any]) -> None:
        """Record contributions for an OmniDaemon task event."""
        task_id = self._extract_task_id(payload, topic)
        agent_id = payload.get("agent") or payload.get("target_agent") or "unknown_agent"
        status = payload.get("status", "pending")
        score = self._derive_quality(payload, status)
        async with self._lock:
            self._pending[task_id][agent_id] = max(score, self._pending[task_id].get(agent_id, 0.0))
            if status in {"success", "failure", "completed"}:
                contributions = dict(self._pending.pop(task_id, {}))
                if contributions:
                    report = await self.engine.attribute_multi_agent_task(
                        task_id=task_id,
                        agent_contributions=contributions,
                        total_reward=score or 1.0,
                    )
                    await self._write_report(report)

    def _derive_quality(self, payload: Dict[str, Any], status: str) -> float:
        candidate = payload.get("quality_score")
        if candidate is not None:
            try:
                return float(candidate)
            except (TypeError, ValueError):
                pass
        if status == "success":
            return 0.95
        if status == "failure":
            return 0.2
        return 0.5

    def _extract_task_id(self, payload: Dict[str, Any], topic: str) -> str:
        return payload.get("task_id") or payload.get("component") or f"{topic}:{payload.get('business_id', 'unknown')}"

    async def _write_report(self, report: AttributionReport) -> None:
        await asyncio.to_thread(self._sync_write_report, report)

    def _sync_write_report(self, report: AttributionReport) -> None:
        with self._report_path.open("a", encoding="utf-8") as fd:
            fd.write(json.dumps(report.to_dict()) + "\n")
