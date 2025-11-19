"""
Scenario Ingestion Pipeline for AgentEvolver Phase 4
=====================================================

Processes self-questioning scenarios and feeds them into SE-Darwin via TrajectoryPool.
Performs schema validation, duplication prevention, and logging for observability.
"""

from __future__ import annotations

import json
import logging
from dataclasses import asdict
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, Iterable, List, Optional, Tuple
from uuid import uuid4

from infrastructure.trajectory_pool import TrajectoryPool, Trajectory, TrajectoryStatus

logger = logging.getLogger(__name__)

REQUIRED_SCENARIO_FIELDS = {"name", "description", "business_type", "mvp_features"}


class ScenarioValidationError(Exception):
    pass


def validate_scenario_schema(scenario: Dict[str, Any]) -> Dict[str, Any]:
    missing = [field for field in REQUIRED_SCENARIO_FIELDS if field not in scenario]
    if missing:
        raise ScenarioValidationError(f"Missing fields: {', '.join(missing)}")
    return scenario


def scenario_quality_ok(
    scenario: Dict[str, Any],
    novelty_threshold: float,
    difficulty_range: Tuple[float, float],
) -> bool:
    novelty = scenario.get("novelty_score", 0.0)
    difficulty = scenario.get("difficulty_score", 50.0)
    return (
        novelty >= novelty_threshold
        and difficulty_range[0] <= difficulty <= difficulty_range[1]
    )


def scenario_to_trajectory(
    scenario: Dict[str, Any],
    agent_name: str,
    generation: int = 0,
) -> Trajectory:
    quality_score = min(100.0, max(0.0, scenario.get("novelty_score", 70.0)))
    description = scenario.get("description", "")
    signature = scenario.get("business_type", "unknown")

    return Trajectory(
        trajectory_id=str(uuid4()),
        generation=generation,
        agent_name=agent_name,
        parent_trajectories=[],
        code_changes=json.dumps(scenario),
        problem_diagnosis=description,
        proposed_strategy=scenario.get("mvp_features", [])[:3],
        status=TrajectoryStatus.SUCCESS.value,
        success_score=quality_score / 100.0,
        reasoning_pattern=f"Scenario: {signature}",
        key_insights=scenario.get("insights", []),
        created_at=scenario.get("generated_at") or datetime.now(timezone.utc).isoformat(),
        execution_time_seconds=0.0,
        cost_dollars=0.0,
    )


class ScenarioIngestionPipeline:
    """Ingests AgentEvolver scenarios into the Genesis evolution pipeline."""

    def __init__(
        self,
        trajectory_pool: Optional[TrajectoryPool] = None,
        storage_dir: Optional[Path] = None,
        novelty_threshold: float = 70.0,
        difficulty_range: Tuple[float, float] = (30.0, 90.0),
        max_scenarios: int = 10000,
    ) -> None:
        self.pool = trajectory_pool if trajectory_pool is not None else TrajectoryPool(
            agent_name="agentevolver-scenarios"
        )
        self.storage_dir = storage_dir or Path("data/agentevolver/scenarios")
        self.storage_dir.mkdir(parents=True, exist_ok=True)
        self.novelty_threshold = novelty_threshold
        self.difficulty_range = difficulty_range
        self.max_scenarios = max_scenarios

    def ingest_scenario(self, scenario: Dict[str, Any]) -> Trajectory:
        """Validate and ingest a single scenario."""
        normalized = validate_scenario_schema(scenario)
        if not scenario_quality_ok(normalized, self.novelty_threshold, self.difficulty_range):
            raise ScenarioValidationError("Scenario failed quality filter")

        traj = scenario_to_trajectory(normalized, self.pool.agent_name or "agentevolver")
        self.pool.add_trajectory(traj)
        self._persist_scenario(normalized, traj.trajectory_id)
        logger.info(
            "Ingested scenario %s -> trajectory %s",
            normalized["name"],
            traj.trajectory_id,
        )
        return traj

    def ingest_from_file(self, source: Path) -> List[Trajectory]:
        """Read JSONL or JSON file of scenarios and ingest them."""
        trajectories: List[Trajectory] = []
        if not source.exists():
            raise FileNotFoundError(f"Scenario source missing: {source}")

        with source.open("r", encoding="utf-8") as fh:
            for line in fh:
                line = line.strip()
                if not line:
                    continue
                data = json.loads(line)
                trajectories.append(self.ingest_scenario(data))

        return trajectories

    def _persist_scenario(self, scenario: Dict[str, Any], trajectory_id: str) -> None:
        record_path = self.storage_dir / f"{trajectory_id}.json"
        record_path.write_text(json.dumps({"trajectory_id": trajectory_id, **scenario}, indent=2))
        self._enforce_archival_policy()

    def _enforce_archival_policy(self) -> None:
        """Enforce archival policy: keep only last max_scenarios (default 10k)."""
        scenario_files = sorted(
            self.storage_dir.glob("*.json"),
            key=lambda p: p.stat().st_mtime,
            reverse=True
        )
        
        if len(scenario_files) > self.max_scenarios:
            # Remove oldest scenarios beyond max_scenarios
            to_remove = scenario_files[self.max_scenarios:]
            for old_file in to_remove:
                try:
                    old_file.unlink()
                    logger.debug(f"Archived (removed) old scenario: {old_file.name}")
                except Exception as e:
                    logger.warning(f"Failed to archive scenario {old_file.name}: {e}")
            
            logger.info(
                f"Archived {len(to_remove)} old scenarios, keeping last {self.max_scenarios}"
            )
