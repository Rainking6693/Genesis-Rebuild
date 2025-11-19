"""
RL refinement stage for DeepEyesV2 tool reliability.
"""

from __future__ import annotations

import asyncio
import json
from pathlib import Path
from typing import Dict, List


def compute_reward(success: bool, latency_ms: float, chain_depth: int) -> float:
    reward = 1.0 if success else -0.5
    reward += max(0.0, 0.2 - latency_ms / 1000.0)
    reward += 0.1 * max(chain_depth - 1, 0)
    return reward


async def refine_policy(dataset_path: Path, output_path: Path, iterations: int = 1000) -> Dict[str, float]:
    attempts = []
    if dataset_path.exists():
        with dataset_path.open("r") as fh:
            attempts = json.load(fh)
    stats = {"iterations": iterations, "reward": 0.0}
    for i in range(iterations):
        success = (i % 10) != 0
        reward = compute_reward(success, latency_ms=50 + (i % 5) * 10, chain_depth=1 + (i % 3))
        stats["reward"] += reward
        await asyncio.sleep(0)  # simulate async training
    stats["reward"] /= max(iterations, 1)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(stats, indent=2))
    return stats
