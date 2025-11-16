"""Alerting utilities for payment monitoring (wallets, failures)."""

from __future__ import annotations

import asyncio
import json
import logging
import os
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, List, Tuple

from infrastructure.genesis_discord import get_discord_client, close_discord_client
from infrastructure.payments.wallet_manager import WalletManager
from monitoring.payment_metrics import record_wallet_balance, set_failure_streak

logger = logging.getLogger(__name__)
EVENT_LOG = Path("logs/ap2/events.jsonl")


def should_send_discord() -> bool:
    return os.getenv("PAYMENTS_USE_FAKE", "false").lower() != "true"


def load_events(limit: int = 200) -> List[Dict[str, any]]:
    events: List[Dict[str, any]] = []
    if not EVENT_LOG.exists():
        return events
    with EVENT_LOG.open() as fd:
        for line in fd:
            try:
                event = json.loads(line.strip())
            except json.JSONDecodeError:
                continue
            data = event.get("data", {}) or {}
            events.append(data)
    return events[-limit:]


def detect_failure_streaks(events: List[Dict[str, any]], threshold: int = 5) -> Dict[str, int]:
    streaks: Dict[str, int] = {}
    results: Dict[str, int] = {}
    for event in reversed(events):
        action = (event.get("action") or "").lower()
        vendor = event.get("context", {}).get("vendor") or event.get("agent") or "unknown"
        failure = any(token in action for token in ("error", "fail", "denied"))
        if failure:
            streaks[vendor] = streaks.get(vendor, 0) + 1
            if streaks[vendor] >= threshold:
                results[vendor] = streaks[vendor]
        else:
            streaks[vendor] = 0
    for vendor, count in results.items():
        set_failure_streak(vendor, count)
    return results


def check_wallet_balances(threshold: float = 50.0) -> List[Tuple[str, float]]:
    manager = WalletManager()
    low_agents = []
    for agent, balance in manager.get_all_balances().items():
        record_wallet_balance(agent, balance)
        if balance < threshold:
            low_agents.append((agent, balance))
    return low_agents


async def run_alerts():
    discord = get_discord_client()
    try:
        low_agents = check_wallet_balances()
        if low_agents:
            for agent, balance in low_agents:
                if should_send_discord():
                    await discord.wallet_low_balance(agent, balance)
        events = load_events()
        streaks = detect_failure_streaks(events)
        if streaks:
            for vendor, count in streaks.items():
                if should_send_discord():
                    await discord.payment_budget_warning(vendor, count * 10)
    finally:
        await close_discord_client()


def main():
    logging.basicConfig(level=logging.INFO)
    asyncio.run(run_alerts())


if __name__ == "__main__":
    main()
