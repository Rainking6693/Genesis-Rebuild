#!/usr/bin/env python3
"""
Compute simple RIFL compliance metrics from the generated report stream.
"""

from __future__ import annotations

import json
from pathlib import Path


def main() -> None:
    path = Path("reports/rifl_reports.jsonl")
    if not path.exists():
        print("No RIFL reports found.")
        return

    total = 0
    positive = 0
    scores = []
    for line in path.read_text().splitlines():
        if not line.strip():
            continue
        record = json.loads(line)
        total += 1
        if record.get("verdict") == "positive":
            positive += 1
        scores.append(record.get("score", 0.0))

    avg_score = sum(scores) / total if total else 0.0
    print(f"RIFL compliance: {positive}/{total} positive verdicts ({avg_score*100:.1f}% average score)")


if __name__ == "__main__":
    main()
