from infrastructure.payments.a2a_x402_service import A2APaymentResponse
from infrastructure.payments.manager import PaymentManager


class DummyLedger:
    def __init__(self):
        self.entries = []

    def log_transaction(self, record):
        self.entries.append(record)


class DummyBudgetTracker:
    def can_spend(self, agent, amount):
        return True

    def record_spend(self, agent, amount):
        pass


class DummyRetry:
    def retry_with_backoff(self, func, *args, **kwargs):
        return func(*args, **kwargs)


class DummyService:
    def __init__(self):
        self.calls = []

    def pay_for_service(self, amount, token, vendor, metadata):
        self.calls.append((amount, token, vendor, metadata))
        return A2APaymentResponse(
            transaction_id="tx-123",
            amount=amount,
            token=token,
            vendor=vendor,
            status="completed",
            blockchain_tx_hash="hash",
            message="ok",
            metadata=metadata,
        )


def test_payment_manager_records_transactions():
    service = DummyService()
    ledger = DummyLedger()
    manager = PaymentManager(service=service, ledger=ledger, budget=DummyBudgetTracker(), retry=DummyRetry())

    response = manager.pay("test_agent", "https://example.com/pay", 0.5, vendor="vendor")

    assert isinstance(response, A2APaymentResponse)
    assert ledger.entries
    assert ledger.entries[0].price_usdc == 0.5
    assert service.calls[0][2] == "vendor"


def test_payment_manager_raises_when_budget_exceeded():
    class BlockingBudget(DummyBudgetTracker):
        def can_spend(self, agent, amount):
            return False

    manager = PaymentManager(service=DummyService(), ledger=DummyLedger(), budget=BlockingBudget(), retry=DummyRetry())

    try:
        manager.pay("test_agent", "https://example.com/pay", 0.5)
        assert False, "Expected RuntimeError"
    except RuntimeError as exc:
        assert "Budget exceeded" in str(exc)
