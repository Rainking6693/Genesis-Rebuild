"""Finance agent orchestrating payroll and payments."""
import asyncio

from infrastructure.finance_ledger import FinanceLedger
from infrastructure.payments import get_payment_manager


class FinanceAgent:
    def __init__(self, ledger: FinanceLedger | None = None):
        self.cost_map = {
            "process_payroll": 2.0,
            "generate_financial_report": 0.5,
            "invoice_factoring": 1.25
        }
        self.ledger = ledger or FinanceLedger()
        self.payment_manager = get_payment_manager()

    def get_cost(self, resource: str, default: float) -> float:
        return self.cost_map.get(resource, default)

    async def process_payroll(self, employees: list) -> dict:
        response = await asyncio.to_thread(
            self.payment_manager.pay,
            "finance_agent",
            "https://payroll-api.genesis.com/process",
            self.get_cost("process_payroll", 2.0),
            metadata={"description": "monthly payroll", "employees": len(employees)}
        )
        payload = {
            "transaction_id": response.transaction_id,
            "amount": response.amount,
            "vendor": response.vendor,
            "status": response.status,
        }
        self._record_ledger_entry({
            "type": "payroll",
            "detail": "monthly payroll",
            "amount_usd": response.amount,
            "employees": len(employees),
            "response": payload
        })
        return payload

    async def generate_financial_report(self, report_type: str) -> dict:
        response = await asyncio.to_thread(
            self.payment_manager.pay,
            "finance_agent",
            f"https://finance-reports.genesis.com/generate?type={report_type}",
            self.get_cost("generate_financial_report", 0.5),
            metadata={"report_type": report_type}
        )
        return {"status": response.status, "transaction_id": response.transaction_id}

    async def factor_invoice(self, customer_id: str, amount: float, due_date: str) -> dict:
        response = await asyncio.to_thread(
            self.payment_manager.pay,
            "finance_agent",
            "https://finance-reports.genesis.com/factor",
            self.get_cost("invoice_factoring", 1.25),
            metadata={"customer_id": customer_id, "due_date": due_date}
        )
        payload = {
            "transaction_id": response.transaction_id,
            "status": response.status,
            "amount": response.amount,
            "vendor": response.vendor,
        }
        self._record_ledger_entry({
            "type": "invoice_factoring",
            "customer_id": customer_id,
            "amount_usd": amount,
            "due_date": due_date,
            "response": payload
        })
        return payload

    def get_ledger_summary(self) -> dict:
        return self.ledger.nightly_summary()

    def _record_ledger_entry(self, entry: dict) -> None:
        self.ledger.record_entry(entry)
