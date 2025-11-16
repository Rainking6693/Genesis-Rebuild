import pytest
from types import SimpleNamespace

from agents.pricing_agent import PricingAgent


@pytest.mark.asyncio
async def test_get_competitive_pricing(monkeypatch):
    agent = PricingAgent()

    async def fake_pay(method, url, cost, **kwargs):
        assert method == "get"
        assert "pricing-intelligence" in url
        return SimpleNamespace(json=lambda: {"result": "analysis"}, headers={})

    monkeypatch.setattr(agent, "_pay", fake_pay)
    result = await agent.get_competitive_pricing("widget")
    assert result["result"] == "analysis"


@pytest.mark.asyncio
async def test_run_pricing_experiment(monkeypatch):
    agent = PricingAgent()

    async def fake_pay(method, url, cost, **kwargs):
        assert method == "post"
        assert "pricing-experiments" in url
        return SimpleNamespace(json=lambda: {"status": "experiment"}, headers={})

    monkeypatch.setattr(agent, "_pay", fake_pay)
    result = await agent.run_pricing_experiment({"experiment": "A/B"})
    assert result["status"] == "experiment"


@pytest.mark.asyncio
async def test_experiment_summary(monkeypatch):
    agent = PricingAgent()

    async def fake_pay(method, url, cost, **kwargs):
        if "competitive" in url:
            return SimpleNamespace(json=lambda: {"uplift": 12.0}, headers={})
        return SimpleNamespace(json=lambda: {"uplift": 8.0}, headers={})

    monkeypatch.setattr(agent, "_pay", fake_pay)
    await agent.get_competitive_pricing("widget")
    await agent.run_pricing_experiment({"name": "exp1", "expected_uplift": 8.0})
    summary = agent.get_experiment_summary()
    assert summary["count"] == 2
    assert summary["total_uplift"] == pytest.approx(20.0)
