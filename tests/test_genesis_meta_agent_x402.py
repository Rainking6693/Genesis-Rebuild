import pytest
from types import SimpleNamespace

from infrastructure.genesis_meta_agent import GenesisMetaAgent


@pytest.mark.asyncio
async def test_call_premium_llm(monkeypatch):
    agent = GenesisMetaAgent(discord_client=None)

    async def fake_pay(method, url, cost, **kwargs):
        assert "llm-api" in url
        return SimpleNamespace(json=lambda: {"status": "llm"}, headers={})

    monkeypatch.setattr(agent.payment_base, "_pay", fake_pay)
    result = await agent.call_premium_llm([{"role": "user", "content": "hi"}])
    assert result["status"] == "llm"


@pytest.mark.asyncio
async def test_optimize_prompt(monkeypatch):
    agent = GenesisMetaAgent(discord_client=None)

    async def fake_pay(method, url, cost, **kwargs):
        assert "prompt-optimizer" in url
        return SimpleNamespace(json=lambda: {"status": "optimized"}, headers={})

    monkeypatch.setattr(agent.payment_base, "_pay", fake_pay)
    result = await agent.optimize_prompt("Hello")
    assert result["status"] == "optimized"
