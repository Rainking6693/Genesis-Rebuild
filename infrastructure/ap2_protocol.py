"""
AP2 protocol helpers
=====================

AP2 wraps agent events with budget/cost metadata and emits compliance-ready traces.
"""

from __future__ import annotations

import json
import logging
import os
from dataclasses import dataclass, asdict
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, Optional

logger = logging.getLogger(__name__)

DEFAULT_BUDGET = float(os.getenv("AP2_DEFAULT_BUDGET_USD", "100.0"))
ALERT_THRESHOLD = float(os.getenv("AP2_ALERT_THRESHOLD", "0.8"))


@dataclass
class AP2Event:
    agent: str
    action: str
    cost_usd: float
    budget_usd: float
    context: Dict[str, str]
    timestamp: str = datetime.now(timezone.utc).isoformat()

    def to_json(self) -> str:
        return json.dumps(asdict(self))


class AP2Client:
    def __init__(self, log_dir: Optional[Path] = None):
        self.log_dir = log_dir or Path("logs/ap2")
        self.log_dir.mkdir(parents=True, exist_ok=True)
        self.budget = DEFAULT_BUDGET
        self.spent = 0.0

    def record_event(self, event: AP2Event) -> None:
        self.spent += event.cost_usd
        path = self.log_dir / "events.jsonl"
        with path.open("a", encoding="utf-8") as fd:
            fd.write(event.to_json() + "\n")
        logger.info(
            "AP2 event: %s spent=%.2f/%.2f (action=%s)",
            event.agent,
            self.spent,
            self.budget,
            event.action,
        )
        if self.spent / max(1.0, self.budget) >= ALERT_THRESHOLD:
            self._emit_alert(event)

    def _emit_alert(self, event: AP2Event) -> None:
        alert = {
            "type": "ap2_budget",
            "agent": event.agent,
            "action": event.action,
            "spent": round(self.spent, 2),
            "budget": self.budget,
            "timestamp": event.timestamp,
        }
        path = self.log_dir / "alerts.jsonl"
        with path.open("a", encoding="utf-8") as fd:
            fd.write(json.dumps(alert) + "\n")
        logger.warning("AP2 budget alert for %s (spent %.2f/%.2f)", event.agent, self.spent, self.budget)

    def wrap(self, agent: str, action: str, cost: float, context: Dict[str, str]) -> AP2Event:
        budget = context.get("budget", self.budget)
        return AP2Event(agent=agent, action=action, cost_usd=cost, budget_usd=float(budget), context=context)
