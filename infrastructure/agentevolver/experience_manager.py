"""
Experience Manager
==================

Coordinates the AgentEvolver experience buffer, hybrid policy, and reuse logic
so Genesis can exploit high-quality past trajectories while still exploring.
"""

from __future__ import annotations

import asyncio
import logging
from dataclasses import dataclass
from typing import Any, Dict, List, Optional, Tuple

from infrastructure.agentevolver.experience_buffer import ExperienceBuffer, ExperienceMetadata
from infrastructure.agentevolver.hybrid_policy import HybridPolicy, PolicyDecision
from infrastructure.trajectory_pool import Trajectory

logger = logging.getLogger(__name__)


@dataclass
class ExperienceCandidate:
    trajectory: Trajectory
    similarity: float
    metadata: ExperienceMetadata


@dataclass
class ExperienceDecision:
    policy: PolicyDecision
    candidates: List[ExperienceCandidate]


class ExperienceManager:
    """Wraps OmniDaemon experience reuse primitives for Genesis tasks."""

    def __init__(
        self,
        agent_name: str,
        buffer_max_size: int = 10000,
        buffer_quality: float = 90.0,
        embedder=None,
    ):
        self.buffer = ExperienceBuffer(
            agent_name=agent_name,
            max_size=buffer_max_size,
            min_quality=buffer_quality,
            embedder=embedder,
        )
        self.policy = HybridPolicy()
        self._lock = asyncio.Lock()
        self.total_decisions = 0
        self.hit_count = 0

    async def decide(self, task_description: str) -> ExperienceDecision:
        """Decide whether to exploit a prior experience for this task."""
        candidates_raw = await self.buffer.get_similar_experiences(task_description, top_k=5)
        candidates = [
            ExperienceCandidate(trajectory=traj, similarity=sim, metadata=meta)
            for traj, sim, meta in candidates_raw
        ]
        self.total_decisions += 1
        best_quality = candidates[0].metadata.quality_score if candidates else None
        stats = self.policy.get_stats()
        policy_decision = self.policy.make_decision(
            has_experience=bool(candidates),
            best_experience_quality=best_quality,
            recent_exploit_success_rate=stats.get("exploit_success_rate"),
        )
        if policy_decision.should_exploit and candidates:
            self.hit_count += 1
        return ExperienceDecision(policy=policy_decision, candidates=candidates)

    async def record_outcome(
        self,
        task_description: str,
        trajectory: Any,
        quality_score: float,
        success: bool,
        exploited: bool,
        experience_id: Optional[str] = None,
    ) -> None:
        """Record the outcome of a task, storing the experience if successful."""
        async with self._lock:
            if success:
                stored = await self.buffer.store_experience(
                    trajectory=trajectory,
                    quality_score=quality_score,
                    task_description=task_description,
                )
                if stored:
                    logger.debug(f"Experience stored for {task_description} (quality={quality_score})")
            self.policy.record_outcome(exploited=exploited, success=success, quality_score=quality_score)
            if exploited and experience_id:
                await self.buffer.mark_experience_reused(experience_id)

    def stats(self) -> Dict[str, Any]:
        """Return combined experience + policy stats."""
        stats = self.buffer.get_buffer_stats()
        stats.update({"policy": self.policy.get_stats()})
        stats["hit_rate_pct"] = round(100 * self.hit_count / self.total_decisions, 2) if self.total_decisions else 0.0
        return stats

    def share_template_with_agent(self, source_experience_id: str, target_agent: str) -> bool:
        metadata = self.buffer.experiences.get(source_experience_id)
        if not metadata:
            return False
        trajectory = self.buffer._trajectory_data.get(metadata.trajectory_id)
        if not trajectory:
            return False
        self.buffer.pool.add_trajectory(trajectory)
        logger.info("Shared experience %s with %s", source_experience_id, target_agent)
        return True
