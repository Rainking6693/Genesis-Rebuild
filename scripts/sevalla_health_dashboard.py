#!/usr/bin/env python3
"""
Simple Sevalla dashboard that pulls deployment status and runtime metrics.

Usage:
  SEVALLA_API_KEY=... SEVALLA_APP_ID=... python scripts/sevalla_health_dashboard.py

The script writes a lightweight HTML snapshot to reports/sevalla-dashboard.html.
"""

from __future__ import annotations

import json
import os
import sys
from datetime import datetime, timedelta, timezone

import requests

API_BASE = os.environ.get("SEVALLA_API_BASE", "https://api.sevalla.com/v2")


def fetch_application(app_id: str, token: str) -> dict:
    resp = requests.get(
        f"{API_BASE}/applications/{app_id}",
        headers={
            "Authorization": f"Bearer {token}",
            "Accept": "application/json",
        },
        timeout=15,
    )
    resp.raise_for_status()
    return resp.json()


def fetch_deployments(app_id: str, token: str) -> list[dict]:
    resp = requests.get(
        f"{API_BASE}/applications/{app_id}/deployments",
        headers={
            "Authorization": f"Bearer {token}",
            "Accept": "application/json",
        },
        timeout=15,
    )
    resp.raise_for_status()
    return resp.json().get("deployments", [])


def summarize(deployments: list[dict]) -> dict:
    now = datetime.now(timezone.utc)
    window = now - timedelta(hours=24)
    recent = [d for d in deployments if parse_datetime(d.get("started_at")) >= window]
    success = [d for d in deployments if d.get("status") == "success"]
    latest = deployments[0] if deployments else {}
    return {
        "total_deployments_24h": len(recent),
        "success_rate_5": round(len([d for d in deployments[:5] if d.get("status") == "success"]) / max(1, min(5, len(deployments))), 2),
        "latest_status": latest.get("status"),
        "latest_id": latest.get("id"),
        "latest_duration": latest.get("duration_seconds"),
    }


def parse_datetime(value: str | None) -> datetime:
    if not value:
        return datetime.fromtimestamp(0, timezone.utc)
    return datetime.fromisoformat(value.replace("Z", "+00:00"))


def render_html(app: dict, metrics: dict, deployments: list[dict]) -> str:
    name = app.get("name", "Langflow")
    slug = app.get("slug", "sevalla-app")
    latest = metrics["latest_status"]
    table_rows = "\n".join(
        f"<tr><td>{d.get('id')}</td><td>{d.get('status')}</td><td>{d.get('started_at')}</td><td>{d.get('duration_seconds', 'n/a')}s</td></tr>"
        for d in deployments[:5]
    )
    return f"""\
<html>
  <head>
    <title>Sevalla Health · {name}</title>
    <style>
      body {{ font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif; margin: 2rem; }}
      table {{ border-collapse: collapse; width: 100%; }}
      td, th {{ border: 1px solid #ddd; padding: 0.5rem; }}
      th {{ background: #f5f5f5; text-align: left; }}
      .status {{ font-weight: bold; color: {"green" if latest == "success" else "orangered"}; }}
    </style>
  </head>
  <body>
    <h1>Sevalla · {name} Health</h1>
    <p>Application slug: <code>{slug}</code></p>
    <p>Latest deployment: <span class="status">{latest}</span> (ID: {metrics["latest_id"]})</p>
    <p>Deployments in last 24h: {metrics["total_deployments_24h"]}</p>
    <p>Success rate (most recent 5): {metrics["success_rate_5"] * 100:.0f}%</p>
    <h2>Recent deployments</h2>
    <table>
      <thead><tr><th>ID</th><th>Status</th><th>Started at</th><th>Duration</th></tr></thead>
      <tbody>
        {table_rows or "<tr><td colspan='4'>No deployments yet.</td></tr>"}
      </tbody>
    </table>
  </body>
</html>
"""


def main() -> None:
    app_id = os.environ.get("SEVALLA_APP_ID")
    token = os.environ.get("SEVALLA_API_KEY")
    if not app_id or not token:
        print("SEVALLA_APP_ID and SEVALLA_API_KEY must be set", file=sys.stderr)
        sys.exit(1)

    app_info = fetch_application(app_id, token)
    deployments = fetch_deployments(app_id, token)
    metrics = summarize(deployments)
    html = render_html(app_info.get("application", {}), metrics, deployments)
    out_dir = os.path.join(os.getcwd(), "reports")
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, "sevalla-dashboard.html")
    with open(out_path, "w", encoding="utf-8") as fd:
        fd.write(html)

    print(f"Dashboard written to {out_path}")


if __name__ == "__main__":
    main()
