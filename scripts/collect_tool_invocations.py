#!/usr/bin/env python3
"""
Collect successful tool invocations into dataset for Supervised Fine-Tuning.
"""

import json
from pathlib import Path


def collect(root: Path, output: Path):
    output.parent.mkdir(parents=True, exist_ok=True)
    records = []
    for file in sorted(root.glob("*.jsonl")):
        for line in file.read_text().splitlines():
            if not line.strip():
                continue
            payload = json.loads(line)
            if payload.get("status") == "success":
                records.append({
                    "task": payload.get("task"),
                    "tool": payload.get("tool"),
                    "params": payload.get("params", {}),
                    "result": payload.get("result")
                })
    output.write_text(json.dumps(records, indent=2))
    print(f"Collected {len(records)} successful tool invocations to {output}")


if __name__ == "__main__":
    root = Path("logs/tool_invocations")
    output = Path("data/tool_invocations/tool_dataset.json")
    collect(root, output)
