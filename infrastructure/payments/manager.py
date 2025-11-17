"""High-level payment manager tying budgets, ledger, and A2A service together."""
from __future__ import annotations

from datetime import datetime, timezone
from functools import lru_cache
from typing import Any, Dict, Optional

from .a2a_x402_service import A2AX402Service, A2APaymentResponse
from .budget_tracker import BudgetTracker
from .payment_ledger import PaymentLedger, PaymentRecord
from .retry_handler import RetryHandler


class PaymentManager:
    """Encapsulates payment workflows for agents."""

    def __init__(self,
                 service: Optional[A2AX402Service] = None,
                 ledger: Optional[PaymentLedger] = None,
                 budget: Optional[BudgetTracker] = None,
                 retry: Optional[RetryHandler] = None):
        self.service = service or A2AX402Service()
        self.ledger = ledger or PaymentLedger()
        self.budget = budget or BudgetTracker()
        self.retry = retry or RetryHandler()

    def _record(self, agent_id: str, url: str, response: A2APaymentResponse, status: str) -> None:
        record = PaymentRecord(
            transaction_id=response.transaction_id,
            timestamp=datetime.now(timezone.utc).isoformat(),
            agent_id=agent_id,
            service_url=url,
            price_usdc=response.amount,
            status=status,
            blockchain_tx_hash=response.blockchain_tx_hash,
            facilitator_receipt={"metadata": response.metadata, "message": response.message},
            vendor=response.vendor,
        )
        self.ledger.log_transaction(record)

    def pay(self,
            agent_id: str,
            url: str,
            amount: float,
            token: str = "USDC",
            vendor: Optional[str] = None,
            metadata: Optional[Dict[str, Any]] = None,
            ) -> A2APaymentResponse:
        if not self.budget.can_spend(agent_id, amount):
            raise RuntimeError(f"Budget exceeded for {agent_id}: ${amount:.2f}")
        vendor_name = vendor or agent_id
        response = self.retry.retry_with_backoff(
            self.service.pay_for_service,
            amount,
            token,
            vendor_name,
            metadata or {},
        )
        self._record(agent_id, url, response, response.status)
        self.budget.record_spend(agent_id, amount)
        return response

    def authorize(self, agent_id: str, vendor: str, amount: float) -> Dict[str, Any]:
        return {"agent": agent_id, "vendor": vendor, "amount": amount, "status": "authorized"}

    def capture(self, authorization_id: str, amount: Optional[float] = None) -> Dict[str, Any]:
        return {"authorization_id": authorization_id, "amount": amount or 0.0, "status": "captured"}

    def cancel(self, authorization_id: str) -> bool:
        return True


@lru_cache(maxsize=1)
def get_payment_manager() -> PaymentManager:
    return PaymentManager()
