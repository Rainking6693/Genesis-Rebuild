import pytest
from types import SimpleNamespace

from agents.support_agent import SupportAgent


@pytest.mark.asyncio
async def test_create_helpdesk_ticket(monkeypatch):
    agent = SupportAgent(enable_memory=False)

    def fake_pay(agent_id, url, amount, **kwargs):
        assert "create-ticket" in url
        return SimpleNamespace(
            transaction_id="tx",
            status="created",
            amount=amount,
            vendor="support_ops_vendor",
            blockchain_tx_hash="hash",
            metadata={},
        )

    monkeypatch.setattr(agent.payment_manager, "pay", fake_pay)
    result = await agent.create_helpdesk_ticket({"subject": "issue"})
    assert result["status"] == "created"


@pytest.mark.asyncio
async def test_transcribe_voice_call(monkeypatch):
    agent = SupportAgent(enable_memory=False)

    def fake_pay(agent_id, url, amount, **kwargs):
        assert "transcribe" in url
        return SimpleNamespace(
            transaction_id="tx",
            status="transcribed",
            amount=amount,
            vendor="support_ops_vendor",
            blockchain_tx_hash="hash",
            metadata={},
        )

    monkeypatch.setattr(agent.payment_manager, "pay", fake_pay)
    result = await agent.transcribe_voice_call("https://audio")
    assert result["status"] == "transcribed"


def test_escalate_ticket_triggers_media_purchase(monkeypatch):
    agent = SupportAgent(enable_memory=False)

    class DummyPurchase:
        vendor = "support_escalation_api"

    called = []

    def fake_purchase(resource=None, amount_usd=None, vendor=None, **kwargs):
        called.append((resource, amount_usd, vendor))
        return DummyPurchase()

    monkeypatch.setattr(agent.media_helper, "purchase", fake_purchase)
    response = agent.escalate_ticket("ticket-1", "need expertise", "Tier-2")
    assert "escalated_to" in response
    assert len(called) == 1
    assert agent.payment_contexts
    ctx = agent.payment_contexts[-1]
    assert ctx["context"]["ticket_id"] == "ticket-1"
