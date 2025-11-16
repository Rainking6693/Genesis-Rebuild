"""Helper for agent media payments that records purchases."""
from __future__ import annotations

import json
from dataclasses import dataclass
from pathlib import Path
from typing import Dict, Any

from infrastructure.business_monitor import BusinessMonitor
from infrastructure.payments import get_payment_manager
from infrastructure.payments.budget_enforcer import BudgetEnforcer, BudgetExceeded

_monitor_instance: BusinessMonitor | None = None


def get_monitor() -> BusinessMonitor:
    global _monitor_instance
    if _monitor_instance is None:
        _monitor_instance = BusinessMonitor()
    return _monitor_instance


@dataclass
class MediaPurchaseResult:
    amount_usd: float
    transaction_id: str
    status: str
    vendor: str
    metadata: Dict[str, Any]


class CreativeAssetRegistry:
    def __init__(self, path: Path):
        self.path = path
        self.path.parent.mkdir(parents=True, exist_ok=True) if self.path.parent else None
        self._data: Dict[str, Dict[str, Any]] = {}
        if self.path.exists():
            try:
                import json
                self._data = json.loads(self.path.read_text())
            except Exception:
                self._data = {}

    def register(self, asset_id: str, metadata: Dict[str, Any]) -> bool:
        if asset_id in self._data:
            return False
        self._data[asset_id] = metadata
        self._persist()
        return True

    def exists(self, asset_id: str) -> bool:
        return asset_id in self._data

    def _persist(self) -> None:
        import json
        self.path.write_text(json.dumps(self._data))


class MediaPaymentHelper:
    def __init__(self, agent_name: str, vendor_name: str, budget: BudgetEnforcer | None = None):
        self.agent_name = agent_name
        self.vendor_name = vendor_name
        self.payment_manager = get_payment_manager()
        self.budget = budget or BudgetEnforcer()

    def purchase(self, resource: str, amount: float, metadata: Dict[str, Any] | None = None) -> MediaPurchaseResult:
        if not self.budget.can_spend(self.agent_name, amount):
            raise BudgetExceeded("Budget exceeded for media purchase")
        response = self.payment_manager.pay(
            self.agent_name,
            f"https://media.genesis.com/{resource}",
            amount,
            vendor=self.vendor_name,
            metadata=metadata or {"resource": resource}
        )
        monitor = get_monitor()
        monitor.log_payment(
            agent_name=self.agent_name,
            payment_type="media",
            amount_usd=amount,
            transaction_hash=response.blockchain_tx_hash,
            resource=resource,
            metadata=metadata or {}
        )
        return MediaPurchaseResult(
            amount_usd=amount,
            transaction_id=response.transaction_id,
            status=response.status,
            vendor=self.vendor_name,
            metadata=metadata or {}
        )
