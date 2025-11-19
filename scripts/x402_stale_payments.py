"""Detect stale payment authorizations."""

from __future__ import annotations

import json
import logging
import os
from datetime import datetime, timezone
from pathlib import Path

from infrastructure.genesis_discord import get_discord_client, close_discord_client
from monitoring.payment_metrics import set_stale_payments

logger = logging.getLogger(__name__)
TRANSACTION_LOG = Path("data/a2a-x402/transactions/transactions.jsonl")


def should_notify() -> bool:
    return os.getenv("PAYMENTS_USE_FAKE", "false").lower() != "true"


def load_transactions() -> list[dict]:
    transactions = []
    if not TRANSACTION_LOG.exists():
        return transactions
    with TRANSACTION_LOG.open() as fd:
        for line in fd:
            try:
                transactions.append(json.loads(line.strip()))
            except json.JSONDecodeError:
                continue
    return transactions


def detect_stale_authorizations(transactions: list[dict], stale_seconds: int = 900) -> int:
    now_ts = datetime.now(timezone.utc).timestamp()
    pending = sum(
        1
        for entry in transactions
        if entry.get("status") not in {"success", "captured", "cancelled"} and entry.get("transaction_hash") in (None, "")
        and (now_ts - datetime.fromisoformat(entry["timestamp"]).timestamp()) > stale_seconds
    )
    set_stale_payments(float(pending))
    return pending


async def main():
    logging.basicConfig(level=logging.INFO)
    discord = get_discord_client()
    try:
        transactions = load_transactions()
        pending = detect_stale_authorizations(transactions)
        logger.info("Stale payments detected: %d", pending)
        if pending >= 1 and should_notify():
            await discord.stale_payment_alert(pending)
    finally:
        await close_discord_client()


if __name__ == "__main__":
    import asyncio
    asyncio.run(main())
