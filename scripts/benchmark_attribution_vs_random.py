"""Compare attribution-guided scenario selection vs random sampling."""

from __future__ import annotations

import argparse
import json
import logging
import random
from pathlib import Path
from statistics import mean
from typing import Any, Dict, List, Optional

logger = logging.getLogger(__name__)

DEFAULT_LOG_DIR = Path("logs/business_generation")


def load_contribution_summary(log_dir: Path) -> Dict[str, Dict[str, Any]]:
    contributions_file = log_dir / "contributions.jsonl"
    if not contributions_file.exists():
        logger.warning("No contribution log at %s", contributions_file)
        return {}

    summary: Dict[str, Dict[str, Any]] = {}
    with contributions_file.open("r", encoding="utf-8") as handle:
        for line in handle:
            line = line.strip()
            if not line:
                continue
            entry = json.loads(line)
            business_id = entry.get("business_id")
            if not business_id:
                continue
            business = summary.setdefault(business_id, {
                "score": 0.0,
                "task_description": entry.get("task_description") or business_id,
            })
            delta = max(0.0, float(entry.get("delta", 0.0)))
            business["score"] += delta
            if not business.get("task_description") and entry.get("task_description"):
                business["task_description"] = entry.get("task_description")
    return summary


def enhance_with_summary_data(
    log_dir: Path,
    aggregated: Dict[str, Dict[str, Any]],
) -> List[Dict[str, Any]]:
    entries: List[Dict[str, Any]] = []
    for business_id, data in aggregated.items():
        row: Dict[str, Any] = {
            "business_id": business_id,
            "score": data.get("score", 0.0),
            "task_description": data.get("task_description") or business_id,
            "duration": None,
            "success_rate": None,
        }
        summary_path = log_dir / f"{business_id}_summary.json"
        if summary_path.exists():
            try:
                summary = json.loads(summary_path.read_text())
                row["duration"] = summary.get("duration_seconds")
                row["success_rate"] = summary.get("success_rate")
            except Exception as exc:  # pragma: no cover
                logger.debug("Failed to read summary %s: %s", summary_path, exc)
        entries.append(row)
    return entries


def describe_selection(name: str, tasks: List[Dict[str, Any]]) -> Dict[str, Optional[float]]:
    if not tasks:
        return {"avg_score": None, "avg_duration": None, "avg_success": None}
    avg_score = mean(task["score"] for task in tasks)
    durations = [task["duration"] for task in tasks if task.get("duration") is not None]
    successes = [task["success_rate"] for task in tasks if task.get("success_rate") is not None]
    return {
        "avg_score": avg_score,
        "avg_duration": mean(durations) if durations else None,
        "avg_success": mean(successes) if successes else None,
    }


def run_benchmark(log_dir: Path, sample_size: int, seed: Optional[int] = None) -> None:
    aggregated = load_contribution_summary(log_dir)
    dataset = enhance_with_summary_data(log_dir, aggregated)

    if not dataset:
        logger.error("No attribution data available in %s", log_dir)
        return

    dataset.sort(key=lambda row: row["score"], reverse=True)

    random.seed(seed)
    sample_size = min(sample_size, len(dataset))

    heuristic_set = dataset[:sample_size]
    random_set = random.sample(dataset, sample_size)

    heuristic_stats = describe_selection("heuristic", heuristic_set)
    random_stats = describe_selection("random", random_set)

    print("Benchmark: Attribution vs Random")
    print(f"Sample size: {sample_size}")
    for label, stats in (("Attribution", heuristic_stats), ("Random", random_stats)):
        print(f"\n{label} selection:")
        print(f"  Avg attribution score: {stats['avg_score']:.2f}")
        if stats["avg_duration"] is not None:
            print(f"  Avg duration (s): {stats['avg_duration']:.2f}")
        if stats["avg_success"] is not None:
            print(f"  Avg success rate (%): {stats['avg_success']:.2f}")
    delta = (heuristic_stats["avg_score"] or 0.0) - (random_stats["avg_score"] or 0.0)
    print(f"\nAttribution lift over random: {delta:.2f} (higher is better)")


def main() -> None:
    parser = argparse.ArgumentParser(description="Benchmark attribution-guided selection")
    parser.add_argument("--log-dir", type=Path, default=DEFAULT_LOG_DIR, help="Business log directory")
    parser.add_argument("--sample-size", type=int, default=5, help="Number of tasks to compare")
    parser.add_argument("--seed", type=int, default=42, help="Random seed for sampling")
    args = parser.parse_args()
    logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
    run_benchmark(args.log_dir, args.sample_size, args.seed)


if __name__ == "__main__":
    main()
