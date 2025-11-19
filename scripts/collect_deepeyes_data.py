#!/usr/bin/env python3
"""
DeepEyes Tool Reliability Data Collection
==========================================

Collect tool invocation data for DeepEyes reliability tracking.
Monitors tool success rates, latency, and error patterns.
"""

import json
from datetime import datetime
from pathlib import Path


def collect_tool_data():
    """Collect DeepEyes tool reliability data."""
    print("=" * 80)
    print("DEEPEYES TOOL RELIABILITY DATA COLLECTION")
    print("=" * 80)
    print(f"Collection Time: {datetime.now().isoformat()}")
    print()

    # Initialize data directory
    data_dir = Path("data/deepeyes")
    data_dir.mkdir(parents=True, exist_ok=True)

    # Check for existing tool invocation logs
    tool_logs = list(data_dir.glob("tool_invocations_*.jsonl"))
    print(f"📊 Existing Tool Logs: {len(tool_logs)} file(s)")

    if tool_logs:
        # Aggregate statistics
        total_invocations = 0
        success_count = 0
        error_count = 0

        for log_file in tool_logs:
            with open(log_file, 'r') as f:
                for line in f:
                    if line.strip():
                        record = json.loads(line)
                        total_invocations += 1
                        if record.get('success', False):
                            success_count += 1
                        else:
                            error_count += 1

        success_rate = (success_count / total_invocations * 100) if total_invocations > 0 else 0.0

        print()
        print("📈 Aggregated Statistics:")
        print(f"  Total Invocations: {total_invocations}")
        print(f"  Successful: {success_count}")
        print(f"  Failed: {error_count}")
        print(f"  Success Rate: {success_rate:.2f}%")
    else:
        print()
        print("⚠️  No tool invocation logs found")
        print("   Tool data will be collected during production usage")

    # Create data collection template
    template_path = data_dir / "tool_invocation_template.json"
    template = {
        "timestamp": datetime.now().isoformat(),
        "tool_name": "example_tool",
        "success": True,
        "latency_ms": 150,
        "error": None,
        "metadata": {}
    }

    with open(template_path, 'w') as f:
        json.dump(template, f, indent=2)

    print()
    print(f"✅ Template created: {template_path}")
    print()
    print("=" * 80)
    print("Data collection setup complete")


if __name__ == "__main__":
    collect_tool_data()
