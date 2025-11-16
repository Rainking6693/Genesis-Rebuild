"""Reusable mixin that embeds agent payment workflows on top of the PaymentManager."""
from __future__ import annotations

import asyncio
import json
from pathlib import Path
from typing import Dict, Optional

from infrastructure.payments import get_payment_manager
from infrastructure.payments.budget_enforcer import BudgetEnforcer, BudgetExceeded


class AgentBudgetConfig:
    """Reloadable budget settings that agents can consult before spending."""

    CONFIG_PATH = Path("config/agent_payment_limits.json")

    def __init__(self):
        self._data: Dict[str, Dict[str, float]] = {}
        self._last_loaded = 0.0
        self.reload()

    def reload(self) -> None:
        if not self.CONFIG_PATH.exists():
            return
        mtime = self.CONFIG_PATH.stat().st_mtime
        if mtime <= self._last_loaded:
            return
        with self.CONFIG_PATH.open("r", encoding="utf-8") as fd:
            try:
                self._data = json.load(fd)
            except json.JSONDecodeError:
                self._data = {}
        self._last_loaded = mtime

    def get_limits(self, agent_name: str) -> Dict[str, float]:
        defaults = {"daily_limit_usdc": 50.0, "per_transaction_max_usdc": 10.0, "monthly_limit_usdc": 500.0}
        return {**defaults, **self._data.get(agent_name, {})}


class AgentPaymentMixin:
    def __init__(self, agent_id: str):
        self.agent_id = agent_id
        self.payment_manager = get_payment_manager()
        self.budget = BudgetEnforcer()
        self.config = AgentBudgetConfig()

    async def pay_for_api_call(
        self,
        url: str,
        cost_estimate_usdc: float,
        token: str = "USDC",
        vendor: Optional[str] = None,
        metadata: Optional[Dict[str, object]] = None,
    ):
        limits = self.config.get_limits(self.agent_id)
        if cost_estimate_usdc > limits["per_transaction_max_usdc"]:
            raise BudgetExceeded(f"{self.agent_id} attempted to pay ${cost_estimate_usdc:.2f}, limit {limits['per_transaction_max_usdc']:.2f}")
        if not self.budget.can_spend(self.agent_id, cost_estimate_usdc):
            raise BudgetExceeded(f"{self.agent_id} exceeded spend threshold for ${cost_estimate_usdc:.2f}")

        response = await asyncio.to_thread(
            self.payment_manager.pay,
            self.agent_id,
            url,
            cost_estimate_usdc,
            token,
            vendor or self.agent_id,
            metadata or {},
        )
        self.budget.record_spend(self.agent_id, cost_estimate_usdc)
        return response

    def reload_budget_settings(self) -> None:
        """Hot-reload budget limits without restarting the agent."""
        self.config.reload()
