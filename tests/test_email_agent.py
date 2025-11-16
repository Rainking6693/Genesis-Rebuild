import pytest
from types import SimpleNamespace

from agents.email_agent import EmailAgent


@pytest.mark.asyncio
async def test_send_transactional_email(monkeypatch):
    agent = EmailAgent()

    async def fake_pay(method, url, cost, **kwargs):
        assert "email-api" in url
        return SimpleNamespace(json=lambda: {"status": "sent"}, headers={})

    monkeypatch.setattr(agent.payment_base, "_pay", fake_pay)
    result = await agent.send_transactional_email({"to": "user@example.com"})
    assert result["status"] == "sent"


@pytest.mark.asyncio
async def test_validate_email(monkeypatch):
    agent = EmailAgent()

    async def fake_pay(method, url, cost, **kwargs):
        assert "email-validation" in url
        return SimpleNamespace(json=lambda: {"status": "valid"}, headers={})

    monkeypatch.setattr(agent.payment_base, "_pay", fake_pay)
    result = await agent.validate_email("user@example.com")
    assert result["status"] == "valid"


@pytest.mark.asyncio
async def test_validate_bulk_emails_records_context(monkeypatch):
    agent = EmailAgent()
    calls = []

    async def fake_pay(method, url, cost, **kwargs):
        assert "bulk" in url
        calls.append((method, cost))
        return SimpleNamespace(json=lambda: {"status": "bulk-verified"}, headers={})

    monkeypatch.setattr(agent.payment_base, "_pay", fake_pay)
    result = await agent.validate_bulk_emails(["one@example.com", "two@example.com"])
    assert result["status"] == "bulk-verified"
    assert agent.payment_contexts
    assert calls[0][1] == pytest.approx(0.2)
