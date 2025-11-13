#!/usr/bin/env python3
"""
Generate a static JSON payload with the latest Genesis dashboard metrics.

The output is consumed by the static PythonAnywhere dashboard as well as any
other external reporting surfaces. Metrics are sourced from the same helpers
used by the FastAPI health service so the numbers stay consistent across the
CLI, dashboards, and monitoring endpoints.
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path

from infrastructure.health_check import HealthCheckService


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--output",
        type=Path,
        default=Path("monitoring/dashboard_static/dashboard-data.json"),
        help="Destination path for the metrics JSON file.",
    )
    parser.add_argument(
        "--month-hours",
        type=float,
        default=None,
        help="Optional override for the month aggregation window (in hours).",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    service = HealthCheckService()

    if args.month_hours is not None:
        # Allow ad-hoc overrides without changing env variables.
        import os

        os.environ["GENESIS_DASHBOARD_MONTH_HOURS"] = str(args.month_hours)

    payload = service.build_dashboard_metrics()
    args.output.parent.mkdir(parents=True, exist_ok=True)
    with args.output.open("w", encoding="utf-8") as handle:
        json.dump(payload, handle, indent=2)
        handle.write("\n")

    print(f"Dashboard metrics written to {args.output}")


if __name__ == "__main__":
    main()
