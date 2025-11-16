import pytest
from types import SimpleNamespace

from agents.analyst_agent import AnalystAgent

@pytest.mark.asyncio
async def test_run_funnel_analysis(monkeypatch):
    agent = AnalystAgent()

    def fake_pay(agent_id, url, amount, **kwargs):
        assert "funnel-analysis" in url
        return SimpleNamespace(
            transaction_id="tx",
            status="completed",
            amount=amount,
            vendor="analyst",
            blockchain_tx_hash="hash",
            metadata={},
        )

    monkeypatch.setattr(agent.payment_manager, "pay", fake_pay)
    result = await agent.run_funnel_analysis({"goal": "acquisition"})
    assert result["status"] == "completed"

@pytest.mark.asyncio
async def test_query_data_warehouse(monkeypatch):
    agent = AnalystAgent()

    def fake_pay(agent_id, url, amount, **kwargs):
        assert "data-warehouse" in url
        return SimpleNamespace(
            transaction_id="tx",
            status="completed",
            amount=amount,
            vendor="analyst",
            blockchain_tx_hash="hash",
            metadata={},
        )

    monkeypatch.setattr(agent.payment_manager, "pay", fake_pay)
    result = await agent.query_data_warehouse("SELECT 1")
    assert result["status"] == "completed"

@pytest.mark.asyncio
async def test_export_insights_records_context(monkeypatch):
    agent = AnalystAgent()

    def fake_pay(agent_id, url, amount, **kwargs):
        assert "analytics-export" in url
        return SimpleNamespace(
            transaction_id="tx",
            status="completed",
            amount=amount,
            vendor="analyst",
            blockchain_tx_hash="hash",
            metadata={},
        )

    monkeypatch.setattr(agent.payment_manager, "pay", fake_pay)
    result = await agent.export_insights("revenue", "csv")
    assert result["status"] == "completed"
    assert agent.payment_contexts[-1]["context"]["dataset"] == "revenue"
