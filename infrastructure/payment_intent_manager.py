from __future__ import annotations

import dataclasses
import json
import logging
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional

from infrastructure.ap2_protocol import AP2Client, get_ap2_client

logger = logging.getLogger(__name__)
APPROVAL_LOG = Path("data/x402/approval_log.jsonl")


@dataclasses.dataclass
class PaymentIntent:
    agent: str
    component: str
    cost_usd: float
    budget_usd: float
    strategy: str
    approved: bool
    reason: str
    metadata: Dict[str, Any] = dataclasses.field(default_factory=dict)
    timestamp: str = dataclasses.field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

    def to_dict(self) -> Dict[str, Any]:
        return dataclasses.asdict(self)


class PaymentIntentManager:
    """Tracks and evaluates payment intents for Genesis Meta Agent."""

    STRATEGY_BUFFERS = {
        "growth": 1.1,
        "conservative": 1.0,
        "balanced": 1.05,
    }

    def __init__(self, ap2_client: Optional[AP2Client] = None):
        self._client = ap2_client or get_ap2_client()
        self.intents: List[PaymentIntent] = []
        APPROVAL_LOG.parent.mkdir(parents=True, exist_ok=True)

    def evaluate(
        self,
        agent_name: str,
        component: str,
        cost_usd: float,
        metadata: Optional[Dict[str, Any]] = None,
        override_approved: Optional[bool] = None,
        override_reason: Optional[str] = None,
    ) -> PaymentIntent:
        metadata = metadata or {}
        strategy = metadata.get("budget_strategy", "balanced")
        budget_usd = float(metadata.get("budget_usd", self._client.budget))
        projected = self._client.spent + cost_usd
        buffer = self.STRATEGY_BUFFERS.get(strategy, 1.0)
        approved = projected <= budget_usd * buffer
        reason = (
            "Within budget"
            if approved
            else f"Projected spend {projected:.2f} exceeds budget cap {budget_usd * buffer:.2f} (strategy={strategy})"
        )
        if override_approved is not None:
            approved = override_approved
            reason = override_reason or reason
        intent = PaymentIntent(
            agent=agent_name,
            component=component,
            cost_usd=cost_usd,
            budget_usd=budget_usd,
            strategy=strategy,
            approved=approved,
            reason=reason,
            metadata=metadata,
        )
        self.intents.append(intent)
        self._log_decision(intent)
        logger.debug(
            "Payment intent evaluated: agent=%s comp=%s cost=%.2f approved=%s reason=%s",
            agent_name,
            component,
            cost_usd,
            approved,
            reason,
        )
        return intent

    def _log_decision(self, intent: PaymentIntent) -> None:
        with APPROVAL_LOG.open("a", encoding="utf-8") as fd:
            fd.write(json.dumps(intent.to_dict()) + "\n")

    def get_business_intents(self, business_id: str) -> List[PaymentIntent]:
        return [
            intent
            for intent in self.intents
            if intent.metadata.get("business_id") == business_id
        ]
