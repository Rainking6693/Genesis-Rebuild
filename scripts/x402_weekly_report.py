"""Weekly spend summary for payments, piped to Discord."""

from __future__ import annotations

import asyncio
import json
import logging
import os
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Dict

from infrastructure.genesis_discord import get_discord_client, close_discord_client

SUMMARY_LOG = Path("data/a2a-x402/spend_summaries.jsonl")

logger = logging.getLogger(__name__)


def collect_recent_summaries(days: int = 7) -> Dict[str, float]:
    cutoff = datetime.now(timezone.utc) - timedelta(days=days)
    total = 0.0
    vendor_breakdown: Dict[str, float] = {}
    if not SUMMARY_LOG.exists():
        return {"total": 0.0, "vendors": vendor_breakdown}
    with SUMMARY_LOG.open() as fd:
        for line in fd:
            try:
                entry = json.loads(line.strip())
            except json.JSONDecodeError:
                continue
            timestamp_str = entry.get("timestamp")
            if not timestamp_str:
                continue
            timestamp = datetime.fromisoformat(timestamp_str)
            if timestamp < cutoff:
                continue
            amount = float(entry.get("total_spent", 0.0))
            total += amount
            for vendor, vendor_amount in entry.get("vendor_breakdown", {}).items():
                vendor_breakdown[vendor] = vendor_breakdown.get(vendor, 0.0) + float(vendor_amount)
    return {"total": total, "vendors": vendor_breakdown}


def should_notify() -> bool:
    return os.getenv("PAYMENTS_USE_FAKE", "false").lower() != "true"


async def main():
    logging.basicConfig(level=logging.INFO)
    summary = collect_recent_summaries()
    discord = get_discord_client()
    try:
        if not should_notify():
            logging.info("Skipping weekly Discord report (PAYMENTS_USE_FAKE=true)")
            return
        stats = {
            "businesses_built": 0,
            "success_rate": 100,
            "avg_quality_score": 0,
            "total_revenue": summary["total"],
            "active_businesses": 0,
            "payment_spend_usd": summary["total"],
        }
        await discord.weekly_summary(stats)
    finally:
        await close_discord_client()


if __name__ == "__main__":
    asyncio.run(main())
