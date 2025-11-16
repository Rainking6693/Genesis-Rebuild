"""Budget guard that exposes simple spend controls."""
from __future__ import annotations

from typing import Dict

from infrastructure.payments.budget_tracker import BudgetTracker


class BudgetExceeded(Exception):
    """Raised when budget limits would be exceeded."""
    pass


class BudgetEnforcer:
    def __init__(self, tracker: BudgetTracker | None = None):
        self.tracker = tracker or BudgetTracker()

    def can_spend(self, agent: str, amount: float) -> bool:
        return self.tracker.can_spend(agent, amount)

    def record_spend(self, agent: str, amount: float, resource: str, metadata: Dict[str, str] | None = None) -> None:
        if not self.can_spend(agent, amount):
            raise BudgetExceeded(f"Budget exceeded for {agent}: ${amount:.2f}")
        self.tracker.record_spend(agent, amount)

    def get_usage(self, agent: str) -> Dict[str, float]:
        return self.tracker.get_usage(agent)
