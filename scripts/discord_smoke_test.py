#!/usr/bin/env python3
"""
Send a sanitized smoke-test message to every configured Discord webhook.

Usage:
    python scripts/discord_smoke_test.py
"""

import argparse
import asyncio
import logging

from infrastructure.load_env import load_genesis_env
from infrastructure.genesis_discord import get_discord_client, close_discord_client

logging.basicConfig(level=logging.INFO, format="%(levelname)s %(message)s")


async def main() -> None:
    parser = argparse.ArgumentParser(description="Send smoke-test embeds to Discord webhooks.")
    parser.add_argument("--channels", nargs="+", help="Limit smoke test to specific channels (dashboard, alerts, etc.)")
    parser.add_argument("--note", default="This is a sanitized observability smoke test.")
    args = parser.parse_args()

    load_genesis_env()
    discord = get_discord_client()
    try:
        results = await discord.smoke_test(note=args.note, channels=args.channels)
        for channel, ok in results.items():
            logging.info("Smoke test -> %-18s %s", channel, "sent" if ok else "skipped/failed")
    finally:
        await close_discord_client()


if __name__ == "__main__":
    asyncio.run(main())
