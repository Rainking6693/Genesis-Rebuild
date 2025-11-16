from types import SimpleNamespace

from infrastructure.payments.middleware import PaymentMiddleware


class FakeResponse(SimpleNamespace):
    def __init__(self, status_code: int, headers=None):
        super().__init__(status_code=status_code, headers=headers or {})


def test_get_without_payment(monkeypatch):
    middleware = PaymentMiddleware("research_agent")

    def fake_request(method, url, **kwargs):
        return FakeResponse(status_code=200)

    monkeypatch.setattr("infrastructure.payments.middleware.requests.request", fake_request)
    response = middleware.get("https://example.com/ok")
    assert response.status_code == 200


def test_get_with_402(monkeypatch):
    manager_calls = []

    class DummyManager:
        def pay(self, agent_name, url, amount, token="USDC", vendor=None, metadata=None):
            manager_calls.append((agent_name, url, amount, token, vendor, metadata))
            return SimpleNamespace(
                transaction_id="tx-123",
                blockchain_tx_hash="hash",
                status="completed",
                vendor=vendor,
                amount=amount,
            )

    monkeypatch.setattr(
        "infrastructure.payments.middleware.get_payment_manager",
        lambda: DummyManager(),
    )

    calls = {"count": 0}

    def fake_request(method, url, **kwargs):
        calls["count"] += 1
        if calls["count"] == 1:
            return FakeResponse(402, {"X-PAYMENT-AMOUNT": "0.5", "X-PAYMENT-ADDRESS": "0xdeadbeef"})
        return FakeResponse(200, {"X-TRANSACTION-HASH": "0xtxhash"})

    monkeypatch.setattr("infrastructure.payments.middleware.requests.request", fake_request)

    middleware = PaymentMiddleware("research_agent")
    response = middleware.get("https://example.com/paid")

    assert response.status_code == 200
    assert calls["count"] == 2
