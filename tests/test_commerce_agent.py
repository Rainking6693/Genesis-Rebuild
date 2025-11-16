import pytest
from types import SimpleNamespace

from agents.commerce_agent import CommerceAgent


@pytest.mark.asyncio
async def test_register_domain(monkeypatch):
    agent = CommerceAgent()
    def fake_pay(agent_id, url, amount, **kwargs):
        assert "register" in url
        return SimpleNamespace(transaction_id="tx", status="registered", amount=amount, vendor="commerce")
    monkeypatch.setattr(agent.payment_manager, "pay", fake_pay)
    result = await agent.register_domain("example.com")
    assert result["status"] == "registered"


@pytest.mark.asyncio
async def test_setup_gateway(monkeypatch):
    agent = CommerceAgent()
    def fake_pay(agent_id, url, amount, **kwargs):
        assert "payment-gateway" in url
        return SimpleNamespace(transaction_id="tx", status="gateway", amount=amount, vendor="commerce")
    monkeypatch.setattr(agent.payment_manager, "pay", fake_pay)
    result = await agent.setup_payment_gateway("stripe")
    assert result["status"] == "gateway"


@pytest.mark.asyncio
async def test_staged_purchase(monkeypatch):
    agent = CommerceAgent()
    calls = []

    def fake_authorize(agent_id, vendor, amount):
        calls.append("authorize")
        return {"authorization_id": "AUTH123", "status": "authorized"}

    def fake_capture(authorization_id, amount=None):
        calls.append("capture")
        return {"authorization_id": authorization_id, "status": "captured"}

    monkeypatch.setattr(agent.payment_manager, "authorize", fake_authorize)
    monkeypatch.setattr(agent.payment_manager, "capture", fake_capture)
    result = await agent.staged_purchase("vendorX", 2.5)
    assert result["authorization"]["authorization_id"] == "AUTH123"
    assert result["capture"]["status"] == "captured"
    assert calls == ["authorize", "capture"]
