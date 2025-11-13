"""
Workspace state synthesis and persistence utilities.

Implements long-horizon state tracking inspired by research on iterative
workspace synthesis. The manager keeps a Markovian state representation,
periodically synthesizes insights with an LLM, and persists snapshots to disk.
"""

from __future__ import annotations

import asyncio
import json
from collections import deque
from dataclasses import dataclass, field
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Awaitable, Callable, Deque, Dict, List, Optional


WorkspaceSummaryFn = Callable[[Dict[str, Any]], Awaitable[Dict[str, Any]]]


@dataclass
class WorkspaceSnapshot:
    """Persisted snapshot payload."""

    step: int
    timestamp: str
    state: Dict[str, Any]
    recent_events: List[Dict[str, Any]]
    insight: Dict[str, Any]
    used_force: bool = False

    def to_dict(self) -> Dict[str, Any]:
        return {
            "step": self.step,
            "timestamp": self.timestamp,
            "state": self.state,
            "recent_events": self.recent_events,
            "insight": self.insight,
            "used_force": self.used_force,
        }


@dataclass
class WorkspaceStateManager:
    """
    Tracks and synthesizes workspace state for long-horizon agent runs.

    Responsibilities:
      * Markovian state reconstruction (state depends only on previous state + event)
      * Periodic workspace synthesis every `summary_interval` steps
      * Optional LLM-driven insight extraction
      * Persistence of synthesized snapshots to disk
    """

    business_id: str
    persistence_root: Path
    summary_interval: int = 50
    llm_callback: Optional[WorkspaceSummaryFn] = None
    max_event_window: int = 200
    _step_count: int = field(init=False, default=0)
    _current_state: Dict[str, Any] = field(init=False, default_factory=dict)
    _recent_events: Deque[Dict[str, Any]] = field(init=False)
    _state_history: Deque[Dict[str, Any]] = field(init=False)
    _insight_history: Deque[Dict[str, Any]] = field(init=False)
    _persistence_dir: Path = field(init=False)
    _last_snapshot: Optional[WorkspaceSnapshot] = field(init=False, default=None)
    _lock: asyncio.Lock = field(init=False, default_factory=asyncio.Lock)

    def __post_init__(self) -> None:
        if self.summary_interval <= 0:
            raise ValueError("summary_interval must be positive")

        self._recent_events = deque(maxlen=self.max_event_window)
        self._state_history = deque(maxlen=10)
        self._insight_history = deque(maxlen=10)
        self._persistence_dir = self.persistence_root / "workspace_state"
        self._persistence_dir.mkdir(parents=True, exist_ok=True)

        # Initialize base Markovian state
        self._current_state = {
            "business_id": self.business_id,
            "total_cost": 0.0,
            "total_events": 0,
            "components_completed": 0,
            "components_failed": 0,
            "success_streak": 0,
            "failure_streak": 0,
            "last_component": None,
            "last_agent": None,
            "last_status": None,
            "last_updated": datetime.now(timezone.utc).isoformat(),
        }

    async def record_event(self, event: Dict[str, Any]) -> None:
        """
        Record a workspace event and trigger synthesis if required.

        Args:
            event: Structured event describing the latest agent action.
        """
        async with self._lock:
            self._step_count += 1
            self._recent_events.append(event)
            self._apply_markov_update(event)

            if self._step_count % self.summary_interval == 0:
                await self._synthesize(force=False)

    async def finalize(self) -> None:
        """Flush remaining state to disk at the end of a run."""
        async with self._lock:
            if self._step_count == 0:
                return
            # Force a final synthesis if we didn't land exactly on the interval
            if (
                self._step_count % self.summary_interval != 0
                or self._last_snapshot is None
                or self._last_snapshot.step != self._step_count
            ):
                await self._synthesize(force=True)

    def _apply_markov_update(self, event: Dict[str, Any]) -> None:
        """Update the Markovian state representation with the new event."""
        status = event.get("status", "unknown")
        cost_delta = float(event.get("cost", 0.0) or 0.0)

        if status == "success":
            self._current_state["components_completed"] += 1
            self._current_state["success_streak"] = self._current_state.get("success_streak", 0) + 1
            self._current_state["failure_streak"] = 0
        elif status == "failure":
            self._current_state["components_failed"] += 1
            self._current_state["failure_streak"] = self._current_state.get("failure_streak", 0) + 1
            self._current_state["success_streak"] = 0
        else:
            # Unknown status resets streaks to conservative baseline
            self._current_state["success_streak"] = 0
            self._current_state["failure_streak"] = 0

        self._current_state["total_cost"] = round(
            self._current_state.get("total_cost", 0.0) + cost_delta, 4
        )
        self._current_state["total_events"] = self._step_count
        self._current_state["last_component"] = event.get("component")
        self._current_state["last_agent"] = event.get("agent")
        self._current_state["last_status"] = status
        self._current_state["last_updated"] = event.get(
            "timestamp", datetime.now(timezone.utc).isoformat()
        )
        self._current_state["rolling_latency_avg_ms"] = self._update_latency_average(
            event.get("latency_ms")
        )
        self._current_state["notes"] = event.get("notes")

        # Keep history for future analysis
        self._state_history.append(dict(self._current_state))

    def _update_latency_average(self, latency_ms: Optional[float]) -> Optional[float]:
        """Recalculate rolling latency average if latency information is present."""
        if latency_ms is None:
            return self._current_state.get("rolling_latency_avg_ms")

        previous_avg = self._current_state.get("rolling_latency_avg_ms")
        if previous_avg is None:
            return round(float(latency_ms), 2)

        # Simple exponential moving average to keep Markovian
        new_avg = 0.8 * previous_avg + 0.2 * float(latency_ms)
        return round(new_avg, 2)

    async def _synthesize(self, force: bool) -> None:
        """Run synthesis step and persist snapshot."""
        payload = {
            "business_id": self.business_id,
            "step": self._step_count,
            "force": force,
            "current_state": self._current_state,
            "recent_events": list(self._recent_events)[-10:],
            "state_history": list(self._state_history),
            "insight_history": list(self._insight_history),
        }

        insight = await self._generate_insight(payload)
        snapshot = WorkspaceSnapshot(
            step=self._step_count,
            timestamp=datetime.now(timezone.utc).isoformat(),
            state=dict(self._current_state),
            recent_events=payload["recent_events"],
            insight=insight,
            used_force=force,
        )

        self._persist_snapshot(snapshot)
        self._insight_history.append(insight)
        self._last_snapshot = snapshot

    async def _generate_insight(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Invoke the LLM callback (if provided) to synthesize insights."""
        if not self.llm_callback:
            return self._default_insight(payload)

        try:
            response = await self.llm_callback(payload)
            if isinstance(response, dict):
                # Basic schema normalization
                return {
                    "workspace_summary": response.get("workspace_summary")
                    or response.get("summary")
                    or "No summary provided.",
                    "risks": response.get("risks", []),
                    "next_actions": response.get("next_actions", []),
                    "sources": response.get("sources", []),
                }
        except Exception as exc:  # pragma: no cover - defensive logging is external
            return {
                "workspace_summary": (
                    "Insight synthesis failed; using fallback."
                ),
                "risks": [f"LLM callback error: {exc}"],
                "next_actions": [],
                "sources": [],
            }

        return self._default_insight(payload)

    def _default_insight(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Fallback deterministic synthesis for offline mode."""
        state = payload["current_state"]
        summary = (
            f"At step {payload['step']}, "
            f"{state.get('components_completed', 0)} components completed, "
            f"{state.get('components_failed', 0)} failed. "
            f"Total cost so far: ${state.get('total_cost', 0.0):.4f}."
        )
        risks: List[str] = []
        if state.get("failure_streak", 0) >= 2:
            risks.append("Recent failure streak detected; consider pausing to investigate.")
        if state.get("rolling_latency_avg_ms") and state["rolling_latency_avg_ms"] > 120000:
            risks.append("Average component latency exceeds 2 minutes.")

        return {
            "workspace_summary": summary,
            "risks": risks,
            "next_actions": [],
            "sources": [],
        }

    def _persist_snapshot(self, snapshot: WorkspaceSnapshot) -> None:
        """Write snapshot JSON to disk and update latest pointer."""
        filename = f"workspace_snapshot_step_{snapshot.step:05d}.json"
        path = self._persistence_dir / filename
        path.write_text(json.dumps(snapshot.to_dict(), indent=2))

        latest_path = self._persistence_dir / "latest.json"
        latest_path.write_text(json.dumps(snapshot.to_dict(), indent=2))

