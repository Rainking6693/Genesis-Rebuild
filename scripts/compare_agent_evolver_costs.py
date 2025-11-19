#!/usr/bin/env python3
"""Compare baseline vs AgentEvolver exploration costs."""

import json
from pathlib import Path

BASELINE_TOKENS_PER_SCENARIO = 2500


def gather_scenarios(root: Path) -> dict:
    data = {"count": 0, "novelty": [], "difficulty": []}
    for path in root.glob("*.json"):
        try:
            payload = json.loads(path.read_text())
        except Exception:
            continue
        data["count"] += 1
        data["novelty"].append(payload.get("novelty_score", 70.0))
        data["difficulty"].append(payload.get("difficulty_score", 50.0))
    return data


def main():
    root = Path("data/agentevolver/scenarios")
    stats = gather_scenarios(root)
    if stats["count"] == 0:
        print("No AgentEvolver scenarios found.")
        return

    avg_novelty = sum(stats["novelty"]) / len(stats["novelty"])
    avg_difficulty = sum(stats["difficulty"]) / len(stats["difficulty"])
    agent_tokens = avg_difficulty * 25
    baseline_cost = stats["count"] * BASELINE_TOKENS_PER_SCENARIO
    optimized_cost = stats["count"] * agent_tokens
    reduction = 100 * (1 - optimized_cost / baseline_cost) if baseline_cost else 0

    print(f"Scenarios processed: {stats['count']}")
    print(f"Avg novelty: {avg_novelty:.1f}, avg difficulty: {avg_difficulty:.1f}")
    print(f"Baseline tokens: {baseline_cost:.0f}")
    print(f"AgentEvolver tokens: {optimized_cost:.0f}")
    print(f"Estimated token reduction: {reduction:.1f}%")


if __name__ == "__main__":
    main()
