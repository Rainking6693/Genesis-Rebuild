#!/usr/bin/env python3
"""
Simulate streaming of 100+ rubric audit events to keep the BusinessMonitor dashboard warm.
"""

from __future__ import annotations

import json
import random
import time
from pathlib import Path


def main() -> None:
    log_dir = Path("logs/business_generation")
    log_dir.mkdir(parents=True, exist_ok=True)
    stream_file = log_dir / "rubric_audit_stream.jsonl"
    criteria = ["coverage", "clarity", "risk_awareness"]
    with stream_file.open("a", encoding="utf-8") as fd:
        for i in range(120):
            payload = {
                "timestamp": time.time(),
                "business": f"simulated_business_{i}",
                "score": round(random.uniform(0.4, 1.0), 3),
                "criterion": random.choice(criteria),
                "status": "pass" if random.random() > 0.2 else "fail"
            }
            fd.write(json.dumps(payload) + "\n")
    print(f"Wrote 120 rubric audit events to {stream_file}")


if __name__ == "__main__":
    main()
