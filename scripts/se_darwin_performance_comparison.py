"""SE-Darwin performance & convergence benchmark driven by AgentEvolver scenarios."""

from __future__ import annotations

import asyncio
import logging
import sys
import time
from pathlib import Path
from typing import Any, Dict, List

sys.path.append(str(Path(__file__).resolve().parents[1]))

from infrastructure.evolution.memory_aware_darwin import (
    EvolutionPattern,
    EvolutionResult,
    MemoryAwareDarwin,
)
from infrastructure.trajectory_pool import Trajectory, TrajectoryStatus

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")


class DummyStore:
    async def search(self, **_) -> List[Dict[str, Any]]:
        return []

    async def put(self, **_) -> None:
        return None


class BenchmarkMemoryAwareDarwin(MemoryAwareDarwin):
    """Lightweight wrapper that controls scenario injection for benchmarking."""

    def __init__(self, agent_type: str, include_scenarios: bool, pattern_id_prefix: str):
        super().__init__(
            agent_type=agent_type,
            memory_store=DummyStore(),
            se_darwin_agent=None,
            capability_tags=["benchmark"],
            max_memory_patterns=5,
            scenario_dir=Path("data/agentevolver/benchmark_scenarios"),
            scenario_limit=5,
        )
        self.include_scenarios = include_scenarios
        self._pattern_id_prefix = pattern_id_prefix

    async def _query_consensus_memory(self, task_type: str, task_description: str) -> List[EvolutionPattern]:
        return [
            EvolutionPattern(
                pattern_id=f"{self._pattern_id_prefix}_consensus",
                agent_type=self.agent_type,
                task_type=task_type,
                code_diff="consensus code",
                strategy_description=f"Consensus strategy for {task_type}",
                benchmark_score=0.85,
                success_rate=0.88,
                timestamp="2025-01-01T00:00:00Z",
            )
        ]

    async def _query_cross_agent_patterns(self, task_type: str) -> List[EvolutionPattern]:
        return []

    async def _query_business_patterns(self, business_id: str, task_type: str) -> List[EvolutionPattern]:
        return []

    def _load_agent_evolver_scenarios(self) -> List[Trajectory]:
        if not self.include_scenarios:
            return []
        return [
            self._create_dummy_trajectory(idx)
            for idx in range(3)
        ]

    def _create_dummy_trajectory(self, idx: int) -> Trajectory:
        return Trajectory(
            trajectory_id=f"ae_scenario_{idx}",
            generation=1,
            agent_name=self.agent_type,
            code_changes="",
            problem_diagnosis=f"scenario_{idx}",
            proposed_strategy="reuse AI idea",
            reasoning_pattern="agent_evolver scenario",
            status=TrajectoryStatus.SUCCESS.value,
            success_score=0.92,
        )


def format_result(label: str, result: EvolutionResult, duration: float) -> str:
    return (
        f"{label}: score={result.final_score:.3f}, "
        f"improvement={result.improvement_over_baseline:.3f}, "
        f"converged={result.converged}, duration={duration:.3f}s"
    )


async def compare_with_vs_without() -> None:
    task = {
        "description": "Optimize business analytics pipeline",
        "type": "optimization",
    }
    baseline = BenchmarkMemoryAwareDarwin("benchmark_agent", include_scenarios=False, pattern_id_prefix="baseline")
    scenarios = BenchmarkMemoryAwareDarwin("benchmark_agent", include_scenarios=True, pattern_id_prefix="scenarios")

    results = []
    for label, darwin in ("Baseline", baseline), ("With AgentEvolver scenarios", scenarios):
        start = time.time()
        result = await darwin.evolve_with_memory(
            task,
            business_id="benchmark_bus",
            max_iterations=5,
            convergence_threshold=0.82,
        )
        duration = time.time() - start
        logger.info(format_result(label, result, duration))
        results.append((label, result))

    improvement = results[1][1].final_score - results[0][1].final_score
    print("\nRelative improvement from AgentEvolver scenarios: {:+.2f}".format(improvement))


async def convergence_benchmark() -> None:
    task = {
        "description": "Validate multi-modal knowledge base",
        "type": "integration",
    }
    thresholds = [0.8, 0.85, 0.9]
    scenarios = BenchmarkMemoryAwareDarwin("benchmark_agent", include_scenarios=True, pattern_id_prefix="convergence")

    print("\nConvergence benchmark (AgentEvolver scenarios):")
    for threshold in thresholds:
        result = await scenarios.evolve_with_memory(
            task,
            business_id="convergence_bus",
            max_iterations=6,
            convergence_threshold=threshold,
        )
        status = "PASS" if result.converged else "FAIL"
        print(f" threshold {threshold:.2f}: score {result.final_score:.3f} -> {status}")


def main() -> None:
    asyncio.run(compare_with_vs_without())
    asyncio.run(convergence_benchmark())


if __name__ == "__main__":
    main()
