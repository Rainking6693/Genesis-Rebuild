from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional


class FinanceLedger:
    """Simple ledger storing finance transactions for reconciliation and nightly summaries."""

    def __init__(self, ledger_path: Optional[Path] = None):
        self.path = ledger_path or Path("logs/finance_ledger.jsonl")
        self.path.parent.mkdir(parents=True, exist_ok=True)

    def record_entry(self, entry: Dict[str, Any]) -> None:
        payload = {
            **entry,
            "recorded_at": datetime.now(timezone.utc).isoformat()
        }
        with self.path.open("a", encoding="utf-8") as fd:
            fd.write(json.dumps(payload) + "\n")

    def load_entries(self) -> List[Dict[str, Any]]:
        if not self.path.exists():
            return []
        entries: List[Dict[str, Any]] = []
        with self.path.open("r", encoding="utf-8") as fd:
            for line in fd:
                line = line.strip()
                if not line:
                    continue
                try:
                    entries.append(json.loads(line))
                except json.JSONDecodeError:
                    continue
        return entries

    def nightly_summary(self) -> Dict[str, Any]:
        entries = self.load_entries()
        totals: Dict[str, float] = {}
        for entry in entries:
            amount = float(entry.get("amount_usd", entry.get("amount", 0.0)))
            entry_type = entry.get("type", "transaction")
            totals[entry_type] = totals.get(entry_type, 0.0) + amount
        return {
            "total_transactions": len(entries),
            "totals_by_type": totals,
            "updated_at": datetime.now(timezone.utc).isoformat()
        }
