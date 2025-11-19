"""Nightly ES training scheduler that keeps the SE-Darwin agent optimized."""

from __future__ import annotations

import argparse
import asyncio
import json
import logging
import random
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, List, Optional

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


DEFAULT_LOG_DIR = Path("logs/business_generation")


def _contributions_log_path(log_dir: Path) -> Path:
    log_dir.mkdir(parents=True, exist_ok=True)
    return log_dir / "contributions.jsonl"


def _load_contribution_scores(log_dir: Path) -> Dict[str, Dict[str, float]]:
    path = _contributions_log_path(log_dir)
    if not path.exists():
        return {}

    aggregated: Dict[str, Dict[str, float]] = {}
    with path.open("r", encoding="utf-8") as fd:
        for line in fd:
            if not line.strip():
                continue
            payload = json.loads(line)
            business_id = payload.get("business_id")
            if not business_id:
                continue

            record = aggregated.setdefault(business_id, {
                "score": 0.0,
                "components": set(),
                "task_description": payload.get("task_description") or "",
            })
            delta = max(0.0, float(payload.get("delta", 0.0)))
            record["score"] += delta
            record["components"].add(payload.get("component"))
            if not record["task_description"] and payload.get("task_description"):
                record["task_description"] = payload.get("task_description")

    return {
        k: {
            "score": v["score"],
            "task_description": v["task_description"],
            "components": len(v["components"]),
        }
        for k, v in aggregated.items()
    }


def _select_problem_descriptions_by_contributions(
    log_dir: Path,
    limit: int,
) -> List[str]:
    scores = _load_contribution_scores(log_dir)
    if not scores:
        return []

    sorted_entries = sorted(scores.items(), key=lambda kv: kv[1]["score"], reverse=True)
    selections = []
    seen: set[str] = set()
    for _, data in sorted_entries:
        if len(selections) >= limit:
            break
        task = data.get("task_description")
        if not task:
            continue
        if task in seen:
            continue
        selections.append(task)
        seen.add(task)
    return selections[:limit]


def _log_es_selection(log_dir: Path, method: str, descriptions: List[str]):
    selection_file = log_dir / "es_training_selection.jsonl"
    log_dir.mkdir(parents=True, exist_ok=True)
    entry = {
        "method": method,
        "selected": descriptions,
        "count": len(descriptions),
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
    with selection_file.open("a", encoding="utf-8") as fd:
        fd.write(json.dumps(entry) + "\n")


async def _run_scheduler(iterations: int, delay_seconds: int) -> None:
    agent = SEDarwinAgent(agent_name="es_training_scheduler")
    pool = get_trajectory_pool(agent_name="es_training_scheduler")
    bridge = get_bridge()
    log_dir = DEFAULT_LOG_DIR

    descriptions = _select_problem_descriptions_by_contributions(log_dir, iterations)
    if descriptions:
        selection_method = "contribution_heuristics"
    else:
        descriptions = _select_problem_descriptions(pool, iterations)
        selection_method = "trajectory_pool"

    if descriptions:
        _log_es_selection(log_dir, selection_method, descriptions)

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
