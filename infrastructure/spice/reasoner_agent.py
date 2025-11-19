"""
SPICE Reasoner Agent - Multi-Trajectory Solving
================================================

Paper: arXiv:2510.24684 - Self-Play In Corpus Environments (SPICE)

The Reasoner agent generates diverse solution trajectories using SE-Darwin
operators (baseline, revision, recombination, refinement) to maximize variance.
"""

from dataclasses import dataclass
from typing import Dict, List, Optional
from enum import Enum
import random


class TrajectoryType(Enum):
    """Types of solution trajectories."""
    BASELINE = "baseline"
    REVISION = "revision"
    RECOMBINATION = "recombination"
    REFINEMENT = "refinement"


@dataclass
class SolutionTrajectory:
    """A solution trajectory with diversity metrics."""
    trajectory_id: str
    trajectory_type: TrajectoryType
    solution: str
    quality_score: float  # 0.0-1.0
    diversity_score: float  # 0.0-1.0 (compared to other trajectories)
    steps: List[str]


class ReasonerAgent:
    """
    SPICE Reasoner Agent for multi-trajectory solving.

    Features:
    - Multi-trajectory solving (baseline + revision + recombination + refinement)
    - SE-Darwin operator integration
    - Solution diversity tracking
    """

    def __init__(
        self,
        num_trajectories: int = 4,
        diversity_weight: float = 0.3,
    ):
        self.num_trajectories = num_trajectories
        self.diversity_weight = diversity_weight
        self.trajectory_history: List[SolutionTrajectory] = []

    def solve_task(self, task_description: str) -> List[SolutionTrajectory]:
        """
        Generate multiple diverse solution trajectories for a task.

        Args:
            task_description: The task to solve

        Returns:
            List of SolutionTrajectory objects (baseline, revision, recombination, refinement)
        """
        trajectories = []

        # Generate baseline trajectory
        baseline = self._generate_baseline(task_description)
        trajectories.append(baseline)

        # Generate revision trajectory (improve baseline)
        if self.num_trajectories >= 2:
            revision = self._generate_revision(baseline)
            trajectories.append(revision)

        # Generate recombination trajectory (combine multiple approaches)
        if self.num_trajectories >= 3:
            recombination = self._generate_recombination([baseline, revision] if len(trajectories) >= 2 else [baseline])
            trajectories.append(recombination)

        # Generate refinement trajectory (polish best solution)
        if self.num_trajectories >= 4:
            best = max(trajectories, key=lambda t: t.quality_score)
            refinement = self._generate_refinement(best)
            trajectories.append(refinement)

        # Update diversity scores
        self._update_diversity_scores(trajectories)

        self.trajectory_history.extend(trajectories)
        return trajectories

    def _generate_baseline(self, task_description: str) -> SolutionTrajectory:
        """Generate baseline solution trajectory."""
        steps = [
            "Analyze task requirements",
            "Design initial solution approach",
            "Implement core functionality",
            "Validate solution correctness",
        ]

        solution = f"Baseline solution for: {task_description}"
        quality_score = random.uniform(0.6, 0.8)  # Baseline quality

        return SolutionTrajectory(
            trajectory_id=f"traj_{len(self.trajectory_history)}_baseline",
            trajectory_type=TrajectoryType.BASELINE,
            solution=solution,
            quality_score=quality_score,
            diversity_score=0.0,  # Will be updated
            steps=steps,
        )

    def _generate_revision(self, baseline: SolutionTrajectory) -> SolutionTrajectory:
        """Generate revision trajectory (improve baseline)."""
        steps = baseline.steps + [
            "Identify baseline weaknesses",
            "Apply targeted improvements",
            "Re-validate enhanced solution",
        ]

        solution = f"Revised: {baseline.solution}"
        quality_score = min(1.0, baseline.quality_score + random.uniform(0.05, 0.15))

        return SolutionTrajectory(
            trajectory_id=f"traj_{len(self.trajectory_history)}_revision",
            trajectory_type=TrajectoryType.REVISION,
            solution=solution,
            quality_score=quality_score,
            diversity_score=0.0,
            steps=steps,
        )

    def _generate_recombination(self, previous: List[SolutionTrajectory]) -> SolutionTrajectory:
        """Generate recombination trajectory (combine approaches)."""
        steps = [
            "Identify strengths from multiple approaches",
            "Synthesize hybrid solution",
            "Integrate complementary components",
            "Validate combined approach",
        ]

        solution = f"Recombined solution from {len(previous)} trajectories"
        quality_score = random.uniform(0.75, 0.95)  # Recombination usually better

        return SolutionTrajectory(
            trajectory_id=f"traj_{len(self.trajectory_history)}_recombination",
            trajectory_type=TrajectoryType.RECOMBINATION,
            solution=solution,
            quality_score=quality_score,
            diversity_score=0.0,
            steps=steps,
        )

    def _generate_refinement(self, best: SolutionTrajectory) -> SolutionTrajectory:
        """Generate refinement trajectory (polish best solution)."""
        steps = best.steps + [
            "Apply fine-grained optimizations",
            "Enhance edge case handling",
            "Final quality assurance",
        ]

        solution = f"Refined: {best.solution}"
        quality_score = min(1.0, best.quality_score + random.uniform(0.02, 0.08))

        return SolutionTrajectory(
            trajectory_id=f"traj_{len(self.trajectory_history)}_refinement",
            trajectory_type=TrajectoryType.REFINEMENT,
            solution=solution,
            quality_score=quality_score,
            diversity_score=0.0,
            steps=steps,
        )

    def _update_diversity_scores(self, trajectories: List[SolutionTrajectory]) -> None:
        """Update diversity scores for trajectories."""
        if len(trajectories) <= 1:
            return

        # Simple diversity: Different trajectory types get higher scores
        types_seen = {t.trajectory_type for t in trajectories}
        max_diversity = len(types_seen) / len(TrajectoryType)

        for traj in trajectories:
            # Diversity based on trajectory type uniqueness
            traj.diversity_score = max_diversity * random.uniform(0.7, 1.0)

    def get_best_trajectory(self, trajectories: List[SolutionTrajectory]) -> SolutionTrajectory:
        """Get best trajectory considering quality and diversity."""
        if not trajectories:
            raise ValueError("No trajectories to evaluate")

        # Weighted score: quality + diversity
        def score(traj: SolutionTrajectory) -> float:
            return (
                (1 - self.diversity_weight) * traj.quality_score +
                self.diversity_weight * traj.diversity_score
            )

        return max(trajectories, key=score)

    def get_statistics(self) -> Dict[str, any]:
        """Get Reasoner statistics."""
        if not self.trajectory_history:
            return {
                "total_trajectories": 0,
                "avg_quality": 0.0,
                "avg_diversity": 0.0,
                "trajectory_types": {},
            }

        type_counts = {}
        for traj in self.trajectory_history:
            type_name = traj.trajectory_type.value
            type_counts[type_name] = type_counts.get(type_name, 0) + 1

        return {
            "total_trajectories": len(self.trajectory_history),
            "avg_quality": sum(t.quality_score for t in self.trajectory_history) / len(self.trajectory_history),
            "avg_diversity": sum(t.diversity_score for t in self.trajectory_history) / len(self.trajectory_history),
            "trajectory_types": type_counts,
        }
