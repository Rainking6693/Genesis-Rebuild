import json
import pytest
from types import SimpleNamespace

from agents.finance_agent import FinanceAgent
from infrastructure.finance_ledger import FinanceLedger


@pytest.mark.asyncio
async def test_process_payroll(monkeypatch, tmp_path):
    ledger = FinanceLedger(tmp_path / "finance_ledger.jsonl")
    agent = FinanceAgent(ledger=ledger)

    async def fake_pay(method, url, cost, **kwargs):
        assert method == "post"
        assert "payroll" in url
        return SimpleNamespace(json=lambda: {"status": "paid"}, headers={})

    monkeypatch.setattr(agent, "_pay", fake_pay)
    result = await agent.process_payroll([{"name": "Alice"}])
    assert result["status"] == "paid"


@pytest.mark.asyncio
async def test_generate_financial_report(monkeypatch, tmp_path):
    agent = FinanceAgent(ledger=FinanceLedger(tmp_path / "finance_ledger.jsonl"))

    async def fake_pay(method, url, cost, **kwargs):
        assert method == "get"
        assert "finance-reports" in url
        return SimpleNamespace(json=lambda: {"status": "report"}, headers={})

    monkeypatch.setattr(agent, "_pay", fake_pay)
    result = await agent.generate_financial_report("cash-flow")
    assert result["status"] == "report"


@pytest.mark.asyncio
async def test_factor_invoice_and_ledger(monkeypatch, tmp_path):
    ledger = FinanceLedger(tmp_path / "finance_ledger.jsonl")
    agent = FinanceAgent(ledger=ledger)

    async def fake_pay(method, url, cost, **kwargs):
        assert "factor" in url
        return SimpleNamespace(json=lambda: {"status": "factored", "authorization": "A1"}, headers={})

    monkeypatch.setattr(agent, "_pay", fake_pay)
    result = await agent.factor_invoice("cust-123", 1200.0, "2025-04-01")
    assert result["status"] == "factored"

    summary = agent.get_ledger_summary()
    assert summary["total_transactions"] == 1
    assert "invoice_factoring" in summary["totals_by_type"]
