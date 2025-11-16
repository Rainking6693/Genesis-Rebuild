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
from typing import Any, Dict, Optional

import requests

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

    def to_dict(self) -> Dict:
        return asdict(self)

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
            "context": event.context,
        }
        path = self.log_dir / "alerts.jsonl"
        with path.open("a", encoding="utf-8") as fd:
            fd.write(json.dumps(alert) + "\n")
        logger.warning("AP2 budget alert for %s (spent %.2f/%.2f)", event.agent, self.spent, self.budget)
        _send_sevalla_alert(alert)

    def wrap(self, agent: str, action: str, cost: float, context: Dict[str, str]) -> AP2Event:
        budget = context.get("budget", self.budget)
        return AP2Event(agent=agent, action=action, cost_usd=cost, budget_usd=float(budget), context=context)


_GLOBAL_AP2_CLIENT: Optional[AP2Client] = None


def _get_sevalla_config() -> Dict[str, Optional[str]]:
    return {
        "url": os.environ.get("AP2_SEVALLA_ALERT_URL") or os.environ.get("SEVALLA_ALERT_URL"),
        "api_key": os.environ.get("AP2_SEVALLA_API_KEY") or os.environ.get("SEVALLA_API_KEY"),
        "app_id": os.environ.get("AP2_SEVALLA_APP_ID") or os.environ.get("SEVALLA_APP_ID"),
    }


def _build_sevalla_payload(alert: Dict[str, Any], config: Dict[str, Optional[str]]) -> Dict[str, Any]:
    return {
        "title": f"AP2 budget alert · {alert.get('agent')}",
        "description": (
            f"{alert.get('agent')} exceeded its budget ({alert.get('budget')}) "
            f"during `{alert.get('action')}` with spend={alert.get('spent')}"
        ),
        "metadata": {
            "agent": alert.get("agent"),
            "action": alert.get("action"),
            "cost_usd": alert.get("spent"),
            "budget_usd": alert.get("budget"),
            "ratio": round(alert.get("spent", 0.0) / (alert.get("budget") or 1.0), 3) if alert.get("budget") else None,
            "context": alert.get("context"),
            "timestamp": alert.get("timestamp"),
            "app_id": config.get("app_id"),
        },
    }


def _send_sevalla_alert(alert: Dict[str, Any]) -> None:
    config = _get_sevalla_config()
    url = config.get("url")
    api_key = config.get("api_key")
    if not url or not api_key:
        return

    payload = _build_sevalla_payload(alert, config)
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }

    try:
        response = requests.post(url, json=payload, headers=headers, timeout=8)
        response.raise_for_status()
        logger.info("AP2 Sevalla alert posted (agent=%s action=%s)", alert.get("agent"), alert.get("action"))
    except Exception as exc:
        logger.warning("AP2 Sevalla alert failed: %s", exc)


def get_ap2_client() -> AP2Client:
    global _GLOBAL_AP2_CLIENT
    if _GLOBAL_AP2_CLIENT is None:
        _GLOBAL_AP2_CLIENT = AP2Client()
    return _GLOBAL_AP2_CLIENT
