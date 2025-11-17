"""Nightly ES training scheduler that keeps the SE-Darwin agent optimized."""

from __future__ import annotations

import argparse
import asyncio
import logging
import random
import time
from typing import List

from agents.se_darwin_agent import SEDarwinAgent
from infrastructure.omnidaemon_bridge import get_bridge
from infrastructure.trajectory_pool import get_trajectory_pool

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")


def _select_problem_descriptions(pool, limit: int) -> List[str]:
    candidates = [
        traj.problem_diagnosis or traj.proposed_strategy or traj.agent_response or ""
        for traj in pool.get_successful_trajectories()
        if traj.success_score >= 0.7
    ]
    if not candidates:
        candidates = [
            "Optimize multi-tenant billing pipeline",
            "Scale marketing site to support parallel agents",
            "Design responsive analytics dashboard with feature flags",
        ]
    random.shuffle(candidates)
    return [candidate for candidate in candidates if candidate][:limit]


async def _run_scheduler(iterations: int, delay_seconds: int) -> None:
    agent = SEDarwinAgent(agent_name="es_training_scheduler")
    pool = get_trajectory_pool(agent_name="es_training_scheduler")
    descriptions = _select_problem_descriptions(pool, iterations)
    bridge = get_bridge()

    for idx, problem in enumerate(descriptions, start=1):
        logger.info("ES scheduler iteration %s for problem: %s", idx, problem[:80])
        start = time.time()
        result = await agent.evolve_solution(problem_description=problem[:400])
        duration = time.time() - start
        best_score = result.get("metrics", {}).get("best_score") or result.get("success_score") or 0.0
        await bridge.publish_event(
            topic="genesis.system.es_training",
            payload={
                "iteration": idx,
                "problem": problem,
                "score": best_score,
                "duration_seconds": round(duration, 2),
                "timestamp": time.time(),
            },
        )
        logger.info(
            "Published iteration %s (score=%.3f, duration=%.2fs)",
            idx,
            best_score,
            duration,
        )
        await asyncio.sleep(delay_seconds)


def main() -> None:
    parser = argparse.ArgumentParser(description="ES training scheduler")
    parser.add_argument("--iterations", type=int, default=3, help="Iterations to run")
    parser.add_argument("--delay", type=int, default=15, help="Delay between iterations (seconds)")
    args = parser.parse_args()
    asyncio.run(_run_scheduler(args.iterations, args.delay))


if __name__ == "__main__":
    main()
