"""Nightly ledger reconciliation for x402 vs Finance Ledger."""

from __future__ import annotations

import argparse
import json
import logging
import os
from pathlib import Path
from typing import Dict

from infrastructure.finance_ledger import FinanceLedger
from infrastructure.genesis_discord import get_discord_client, close_discord_client

logger = logging.getLogger(__name__)
TRANSACTIONS_LOG = Path("data/a2a-x402/transactions/transactions.jsonl")
LEDGER_PATH = Path("logs/finance_ledger.jsonl")


def load_transactions() -> Dict[str, float]:
    totals: Dict[str, float] = {}
    if not TRANSACTIONS_LOG.exists():
        return totals
    with TRANSACTIONS_LOG.open() as fd:
        for line in fd:
            try:
                entry = json.loads(line.strip())
            except json.JSONDecodeError:
                continue
            key = entry.get("resource") or entry.get("metadata", {}).get("vendor") or "unknown"
            totals[key] = totals.get(key, 0.0) + float(entry.get("amount_usd", 0.0))
    return totals


def load_ledger_totals(ledger: FinanceLedger) -> Dict[str, float]:
    totals: Dict[str, float] = {}
    for entry in ledger.load_entries():
        entry_type = entry.get("type", "transaction")
        totals[entry_type] = totals.get(entry_type, 0.0) + float(entry.get("amount_usd", entry.get("amount", 0.0)))
    return totals


def reconcile(transactions: Dict[str, float], ledger_totals: Dict[str, float]) -> Dict[str, float]:
    diffs: Dict[str, float] = {}
    for key, amount in transactions.items():
        diff = amount - ledger_totals.get(key, 0.0)
        if abs(diff) > 0.01:
            diffs[key] = diff
    return diffs


def format_summary(transactions: Dict[str, float], ledger_totals: Dict[str, float], diffs: Dict[str, float]) -> Dict[str, object]:
    return {
        "timestamp": Path(TRANSACTIONS_LOG).stat().st_mtime,
        "transactions_total": sum(transactions.values()),
        "ledger_total": sum(ledger_totals.values()),
        "discrepancies": diffs,
    }


async def send_summary(summary: Dict[str, object]):
    discord = get_discord_client()
    try:
        description = (
            f"Total recorded x402 spend: ${summary['transactions_total']:.2f}\n"
            f"Finance ledger total: ${summary['ledger_total']:.2f}\n"
            f"Discrepancies: {len(summary['discrepancies'])}"
        )
        await discord.daily_report({
            "businesses_built": 0,
            "success_rate": 100,
            "avg_quality_score": 0,
            "total_revenue": summary['transactions_total'],
            "active_businesses": 0,
            "x402_spend_usd": summary['transactions_total'],
            "discrepancies": summary['discrepancies'],
        })
    finally:
        await close_discord_client()


def main():
    logging.basicConfig(level=logging.INFO)
    parser = argparse.ArgumentParser(description="Reconcile x402 ledger entries nightly.")
    parser.add_argument("--dry-run", action="store_true", help="Do not send Discord alert.")
    args = parser.parse_args()

    ledger = FinanceLedger(LEDGER_PATH)
    transactions = load_transactions()
    ledger_totals = load_ledger_totals(ledger)
    diffs = reconcile(transactions, ledger_totals)
    summary = format_summary(transactions, ledger_totals, diffs)
    logger.info("Ledger summary: %s", summary)
    if not args.dry_run and should_send_notifications():
        import asyncio
        asyncio.run(send_summary(summary))


def should_send_notifications() -> bool:
    return os.getenv("PAYMENTS_USE_FAKE", "false").lower() != "true"


if __name__ == "__main__":
    main()
