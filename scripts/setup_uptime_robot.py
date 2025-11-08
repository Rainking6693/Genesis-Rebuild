"""Utility to register Genesis health endpoints with UptimeRobot.

Usage
-----
python scripts/setup_uptime_robot.py --config monitoring/health_endpoints.json

Environment Variables
---------------------
UPTIME_ROBOT_API_KEY - required to authenticate with the UptimeRobot v2 API.

This script can run in dry-run mode to preview the API calls without creating
monitors.
"""
from __future__ import annotations

import argparse
import json
import os
from typing import Any, Dict, List

import requests

API_BASE = "https://api.uptimerobot.com/v2"
DEFAULT_INTERVAL = 300  # seconds


def load_config(path: str) -> List[Dict[str, Any]]:
    with open(path, "r", encoding="utf-8") as handle:
        data = json.load(handle)
    if not isinstance(data, list):
        raise ValueError("Config must be a list of monitor definitions")
    for idx, monitor in enumerate(data):
        if "name" not in monitor or "url" not in monitor:
            raise ValueError(f"Monitor entry #{idx+1} missing name/url")
    return data


def create_monitor(api_key: str, monitor: Dict[str, Any], dry_run: bool = False) -> Dict[str, Any]:
    payload = {
        "api_key": api_key,
        "type": monitor.get("type", 1),  # 1 = HTTP(s)
        "friendly_name": monitor["name"],
        "url": monitor["url"],
        "interval": monitor.get("interval", DEFAULT_INTERVAL),
    }
    if "alert_contact" in monitor:
        payload["alert_contacts"] = monitor["alert_contact"]

    if dry_run:
        return {"dry_run": True, "payload": payload}

    response = requests.post(f"{API_BASE}/newMonitor", data=payload, timeout=10)
    response.raise_for_status()
    return response.json()


def main() -> None:
    parser = argparse.ArgumentParser(description="Register UptimeRobot monitors")
    parser.add_argument("--config", default="monitoring/health_endpoints.json")
    parser.add_argument("--dry-run", action="store_true", help="Preview API calls")
    args = parser.parse_args()

    api_key = os.getenv("UPTIME_ROBOT_API_KEY")
    if not api_key:
        raise SystemExit("UPTIME_ROBOT_API_KEY must be set in the environment")

    monitors = load_config(args.config)

    results: List[Dict[str, Any]] = []
    for monitor in monitors:
        try:
            result = create_monitor(api_key, monitor, dry_run=args.dry_run)
        except Exception as exc:  # pragma: no cover
            result = {"error": str(exc), "monitor": monitor["name"]}
        results.append(result)

    print(json.dumps(results, indent=2))


if __name__ == "__main__":
    main()
