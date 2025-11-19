#!/usr/bin/env python3
"""
Send daily/weekly analytics summaries to Discord.

Usage:
    python scripts/daily_discord_report.py --period daily
    python scripts/daily_discord_report.py --period weekly
"""

from __future__ import annotations

import argparse
import asyncio
import json
import logging
from datetime import datetime, timezone, timedelta
from pathlib import Path
from typing import Dict, Set, Tuple

from infrastructure.load_env import load_genesis_env
from infrastructure.genesis_discord import get_discord_client, close_discord_client

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(message)s",
    handlers=[logging.FileHandler("logs/discord_reports.log"), logging.StreamHandler()],
)
logger = logging.getLogger(__name__)

SUMMARY_DIR = Path("logs/business_generation")
AP2_COMPLIANCE_FILE = Path("reports/ap2_compliance.jsonl")
AP2_METRICS_FILE = Path("logs/ap2/ap2_metrics.json")
BUSINESS_EVENTS_FILE = SUMMARY_DIR / "events.jsonl"


def collect_statistics(days: int) -> Dict[str, float]:
    cutoff = datetime.now(timezone.utc).timestamp() - days * 86400
    total = 0
    successes = 0
    quality_sum = 0.0
    quality_count = 0
    revenue_total = 0.0

    for summary_file in SUMMARY_DIR.glob("*_summary.json"):
        try:
            data = json.loads(summary_file.read_text())
        except (json.JSONDecodeError, OSError):
            continue

        end_time = data.get("end_time")
        if not end_time or end_time < cutoff:
            continue

        total += 1
        if data.get("status") == "completed":
            successes += 1
        quality = data.get("quality_score")
        if isinstance(quality, (int, float)):
            quality_sum += quality
            quality_count += 1
        elif isinstance(quality, str):
            try:
                parsed_quality = float(quality)
            except ValueError:
                parsed_quality = None
            if parsed_quality is not None:
                quality_sum += parsed_quality
                quality_count += 1

        revenue_value = data.get("total_revenue")
        if isinstance(revenue_value, (int, float)):
            revenue_total += revenue_value
        elif isinstance(revenue_value, str):
            try:
                revenue_total += float(revenue_value)
            except ValueError:
                pass

    revenue_total += _collect_revenue(cutoff)
    stats = {
        "businesses_built": total,
        "success_rate": round((successes / total * 100) if total else 0.0, 2),
        "avg_quality_score": round((quality_sum / quality_count) if quality_count else 0.0, 2),
        "total_revenue": round(revenue_total, 2),
        "active_businesses": _count_active_businesses(),
    }
    stats["x402_spend_usd"] = round(_collect_x402_spend(cutoff), 2)
    logger.info("Collected %d summaries for %d-day window", total, days)
    return stats


def _iso_to_timestamp(value: str) -> float:
    if value.endswith("Z"):
        value = value[:-1] + "+00:00"
    return datetime.fromisoformat(value).timestamp()


def _collect_revenue(cutoff_ts: float) -> float:
    if not AP2_COMPLIANCE_FILE.exists():
        return 0.0

    revenue_by_period: Dict[Tuple[str, str, str], Tuple[float, float]] = {}

    with AP2_COMPLIANCE_FILE.open() as fd:
        for line in fd:
            line = line.strip()
            if not line:
                continue
            try:
                entry = json.loads(line)
            except json.JSONDecodeError:
                continue
            if entry.get("action") != "generate_revenue_report":
                continue
            timestamp = entry.get("timestamp")
            if not timestamp:
                continue
            try:
                event_ts = _iso_to_timestamp(timestamp)
            except (ValueError, TypeError):
                continue
            if event_ts < cutoff_ts:
                continue

            context = entry.get("context", {}) or {}
            revenue_value = context.get("total_revenue")
            if revenue_value is None:
                continue
            try:
                revenue_float = float(revenue_value)
            except (ValueError, TypeError):
                continue

            key = (
                context.get("start_date"),
                context.get("end_date"),
                context.get("breakdown_by"),
            )
            previous = revenue_by_period.get(key)
            if not previous or event_ts > previous[1]:
                revenue_by_period[key] = (revenue_float, event_ts)

    return sum(value for value, _ in revenue_by_period.values())


def _count_active_businesses() -> int:
    if not BUSINESS_EVENTS_FILE.exists():
        return 0

    active: Set[str] = set()

    with BUSINESS_EVENTS_FILE.open() as fd:
        for line in fd:
            line = line.strip()
            if not line:
                continue
            try:
                event = json.loads(line)
            except json.JSONDecodeError:
                continue
            event_type = event.get("event_type")
            data = event.get("data") or {}
            business_id = data.get("business_id")
            if not business_id:
                continue
            if event_type == "business_started":
                active.add(business_id)
            elif event_type == "business_completed":
                active.discard(business_id)

    return len(active)


def _collect_x402_spend(cutoff_ts: float) -> float:
    if not AP2_METRICS_FILE.exists():
        return 0.0

    total = 0.0
    with AP2_METRICS_FILE.open() as fd:
        for line in fd:
            entry = line.strip()
            if not entry:
                continue
            try:
                record = json.loads(entry)
            except json.JSONDecodeError:
                continue
            timestamp = record.get("timestamp")
            if timestamp is None:
                continue
            try:
                ts = float(timestamp)
            except (TypeError, ValueError):
                continue
            if ts < cutoff_ts:
                continue
            total += float(record.get("cost_usd", 0.0))
    return total if total else 0.0


async def dispatch_report(period: str, stats: Dict[str, float]) -> None:
    discord = get_discord_client()
    try:
        if period == "weekly":
            await discord.weekly_summary(stats)
        else:
            await discord.daily_report(stats)
    finally:
        await close_discord_client()


async def main() -> None:
    parser = argparse.ArgumentParser(description="Send Discord analytics summary")
    parser.add_argument("--period", choices=["daily", "weekly"], default="daily")
    parser.add_argument("--days", type=int, help="Override lookback window in days")
    parser.add_argument("--dry-run", action="store_true", help="Print stats instead of sending to Discord")
    args = parser.parse_args()

    load_genesis_env()
    days = args.days or (1 if args.period == "daily" else 7)
    stats = collect_statistics(days)

    if args.dry_run:
        print(json.dumps({"period": args.period, "days": days, "statistics": stats}, indent=2))
        return

    await dispatch_report(args.period, stats)


if __name__ == "__main__":
    asyncio.run(main())
