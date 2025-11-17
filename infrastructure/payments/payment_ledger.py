"""Persist payment events for the A2A-x402 service."""
from __future__ import annotations

import json
from dataclasses import asdict, dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, Iterable, List, Optional


@dataclass
class PaymentRecord:
    transaction_id: str
    timestamp: str
    agent_id: str
    service_url: str
    price_usdc: float
    status: str
    blockchain_tx_hash: str
    facilitator_receipt: Dict[str, object]
    vendor: str
    error: Optional[str] = None

    def to_dict(self) -> Dict[str, object]:
        return asdict(self)


class PaymentLedger:
    """Append-only ledger for capturing payment events."""

    def __init__(self, root: Optional[Path] = None):
        self.root = root or Path("data/a2a-x402/transactions")
        self.root.mkdir(parents=True, exist_ok=True)
        self.log_path = self.root / "transactions.jsonl"
        self.log_path.touch(exist_ok=True)

    def log_transaction(self, record: PaymentRecord) -> None:
        with self.log_path.open("a", encoding="utf-8") as fd:
            fd.write(json.dumps(record.to_dict()) + "\n")

    def read_transactions(self) -> Iterable[Dict[str, object]]:
        with self.log_path.open("r", encoding="utf-8") as fd:
            for line in fd:
                if line.strip():
                    yield json.loads(line)

    def get_transaction(self, transaction_id: str) -> Optional[Dict[str, object]]:
        for tx in self.read_transactions():
            if tx.get("transaction_id") == transaction_id:
                return tx
        return None

    def get_agent_transactions(self, agent_id: str) -> List[Dict[str, object]]:
        return [tx for tx in self.read_transactions() if tx.get("agent_id") == agent_id]

    def get_daily_total(self, date: Optional[str] = None) -> float:
        date = date or datetime.now(timezone.utc).strftime("%Y-%m-%d")
        return sum(tx.get("price_usdc", 0.0) for tx in self.read_transactions() if tx.get("timestamp", "").startswith(date))

    def get_monthly_total(self, month: Optional[str] = None) -> float:
        month = month or datetime.now(timezone.utc).strftime("%Y-%m")
        return sum(tx.get("price_usdc", 0.0) for tx in self.read_transactions() if tx.get("timestamp", "").startswith(month))

    def reconcile_blockchain(self) -> List[Dict[str, object]]:
        # Placeholder for later on-chain reconciliation logic
        discrepancies = []
        for tx in self.read_transactions():
            if tx.get("status") not in {"completed", "pending", "failed"}:
                discrepancies.append(tx)
        return discrepancies
