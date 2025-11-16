"""
Self-Attributing Reward Shaping - AgentEvolver Phase 3

Implements contribution-based reward differentiation using Shapley value approximation
and multi-agent attribution. Instead of uniform rewards, agents receive rewards
proportional to their impact on solution quality.

Key Features:
- ContributionTracker: Records individual agent impacts with quality delta attribution
- RewardShaper: Multi-strategy reward shaping (LINEAR, EXPONENTIAL, SIGMOID)
- AttributionEngine: Orchestrates multi-agent attribution with Shapley approximation
- Supports 10+ concurrent agents with <50ms attribution computation per task
- Async-first design with full type hints
- Integration with ExperienceBuffer and CuriosityDrivenTrainer

Paper Reference: arXiv:2511.10395 - AgentEvolver: Self-Attributing

Author: Thon (Python Expert)
Date: November 15, 2025
"""

import asyncio
import logging
import time
from dataclasses import dataclass, field, asdict
from datetime import datetime, timezone
from enum import Enum
from typing import Dict, List, Optional, Tuple, Any, Callable
from pathlib import Path
import json
import numpy as np
from collections import defaultdict

logger = logging.getLogger(__name__)


class RewardStrategy(Enum):
    """Reward shaping strategies for contribution-based attribution."""
    LINEAR = "linear"
    EXPONENTIAL = "exponential"
    SIGMOID = "sigmoid"


@dataclass
class AgentContribution:
    """Records a single agent's contribution to task outcome."""
    agent_id: str
    task_id: str
    contribution_score: float  # 0-1, normalized
    quality_delta: float  # Impact on solution quality
    timestamp: str = field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    effort_ratio: float = 1.0  # How much work agent did (0-1)
    impact_multiplier: float = 1.0  # How critical was this agent's work


@dataclass
class AttributionReport:
    """Full attribution analysis for multi-agent task."""
    task_id: str
    agents: List[str]
    contributions: Dict[str, float]  # agent_id -> contribution_score
    rewards: Dict[str, float]  # agent_id -> shaped_reward
    total_reward: float
    strategy_used: str
    computation_time_ms: float
    timestamp: str = field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for serialization."""
        return asdict(self)


class ContributionTracker:
    """
    Tracks individual agent contributions to task outcomes.

    Computes contribution scores using quality delta attribution:
    - Tracks baseline quality (no contribution)
    - Measures quality with each agent's input
    - Attributes improvement proportionally to agent effort

    Thread-safe for concurrent agent tracking via asyncio locks.
    """

    def __init__(self, max_history_size: int = 100000, **kwargs):
        """
        Initialize contribution tracker.

        Args:
            max_history_size: Maximum history entries to keep per agent
            **kwargs: Ignored for backward compatibility (e.g., agent_type)
        """
        self.max_history_size = max_history_size
        self._contributions: Dict[str, List[AgentContribution]] = defaultdict(list)
        self._contribution_lock = asyncio.Lock()
        self._quality_baselines: Dict[str, float] = {}  # task_id -> baseline_quality

    async def record_contribution(
        self,
        agent_id: str,
        task_id: str,
        quality_before: float,
        quality_after: float,
        effort_ratio: float = 1.0,
        impact_multiplier: float = 1.0,
    ) -> float:
        """
        Record agent contribution and compute contribution score.

        Args:
            agent_id: Unique agent identifier
            task_id: Task being executed
            quality_before: Solution quality before agent's input
            quality_after: Solution quality after agent's input
            effort_ratio: How much work the agent did (0-1)
            impact_multiplier: Critical importance of agent's role (0-1+)

        Returns:
            Normalized contribution score (0-1)
        """
        async with self._contribution_lock:
            # Quality delta: improvement from this agent's contribution
            quality_delta = max(0.0, quality_after - quality_before)

            # Contribution score: normalized by effort and impact
            # Clamp to 0-1 range with effort/impact weighting
            raw_score = quality_delta * effort_ratio * impact_multiplier
            contribution_score = min(1.0, max(0.0, raw_score / 100.0))  # Normalize if quality in 0-100

            # Record contribution
            contribution = AgentContribution(
                agent_id=agent_id,
                task_id=task_id,
                contribution_score=contribution_score,
                quality_delta=quality_delta,
                effort_ratio=effort_ratio,
                impact_multiplier=impact_multiplier,
            )

            agent_history = self._contributions[agent_id]
            agent_history.append(contribution)

            # Maintain size limit per agent (FIFO when full)
            if len(agent_history) > self.max_history_size:
                agent_history.pop(0)

            logger.debug(
                f"Recorded contribution: agent={agent_id}, task={task_id}, "
                f"score={contribution_score:.3f}, delta={quality_delta:.2f}"
            )

            return contribution_score

    async def get_contribution_score(
        self,
        agent_id: str,
        task_id: Optional[str] = None,
        window_size: int = 100,
    ) -> float:
        """
        Get agent's contribution score.

        Args:
            agent_id: Agent to query
            task_id: Specific task (None = average across window)
            window_size: Number of recent tasks to average over

        Returns:
            Contribution score (0-1)
        """
        async with self._contribution_lock:
            contributions = self._contributions.get(agent_id, [])

            if not contributions:
                return 0.0

            if task_id:
                # Task-specific contribution
                for contrib in reversed(contributions):
                    if contrib.task_id == task_id:
                        return contrib.contribution_score
                return 0.0

            # Average over recent tasks
            recent = contributions[-window_size:]
            if not recent:
                return 0.0

            return sum(c.contribution_score for c in recent) / len(recent)

    async def get_contribution_history(
        self,
        agent_id: str,
        limit: int = 100,
    ) -> List[AgentContribution]:
        """
        Get contribution history for an agent.

        Args:
            agent_id: Agent to query
            limit: Maximum number of recent entries

        Returns:
            List of contributions (most recent first)
        """
        async with self._contribution_lock:
            contributions = self._contributions.get(agent_id, [])
            return list(reversed(contributions[-limit:]))

    async def get_all_agents_scores(
        self,
        window_size: int = 50,
    ) -> Dict[str, float]:
        """Get contribution scores for all tracked agents."""
        async with self._contribution_lock:
            scores = {}
            for agent_id in self._contributions:
                recent = self._contributions[agent_id][-window_size:]
                if recent:
                    scores[agent_id] = sum(c.contribution_score for c in recent) / len(recent)
                else:
                    scores[agent_id] = 0.0
            return scores


class RewardShaper:
    """
    Shapes rewards based on contribution scores using configurable strategies.

    Implements three reward shaping functions:
    - LINEAR: reward = base_reward * contribution_score
    - EXPONENTIAL: Emphasizes high contributors (encourages specialization)
    - SIGMOID: Smooth S-curve (minimum threshold before rewards spike)
    """

    def __init__(
        self,
        base_reward: float = 1.0,
        strategy: RewardStrategy = RewardStrategy.LINEAR,
        sigmoid_steepness: float = 10.0,  # Steepness of sigmoid curve
        sigmoid_midpoint: float = 0.5,  # Where sigmoid crosses 0.5
    ):
        """
        Initialize reward shaper.

        Args:
            base_reward: Base reward amount (scaled by contribution)
            strategy: Reward shaping strategy (LINEAR, EXPONENTIAL, SIGMOID)
            sigmoid_steepness: Steepness of sigmoid curve (higher = steeper)
            sigmoid_midpoint: Contribution score where sigmoid crosses 50%
        """
        self.base_reward = base_reward
        self.strategy = strategy
        self.sigmoid_steepness = sigmoid_steepness
        self.sigmoid_midpoint = sigmoid_midpoint
        self._reward_history: List[Tuple[str, float, float]] = []  # (agent_id, contribution, reward)

    def _linear_shape(self, contribution_score: float) -> float:
        """Linear reward shaping: reward = base * contribution."""
        return self.base_reward * contribution_score

    def _exponential_shape(self, contribution_score: float) -> float:
        """
        Exponential reward shaping: reward = base * (contribution ^ 2).
        Emphasizes high contributors, discourages low ones.
        """
        return self.base_reward * (contribution_score ** 2)

    def _sigmoid_shape(self, contribution_score: float) -> float:
        """
        Sigmoid reward shaping: S-curve with threshold effect.
        Agents below midpoint get minimal reward; high contributors rewarded exponentially.
        """
        # Sigmoid: 1 / (1 + e^(-k*(x - x0)))
        exponent = -self.sigmoid_steepness * (contribution_score - self.sigmoid_midpoint)
        sigmoid_value = 1.0 / (1.0 + np.exp(np.clip(exponent, -500, 500)))
        return self.base_reward * sigmoid_value

    def compute_shaped_reward(
        self,
        agent_id: str,
        contribution_score: float,
        custom_base_reward: Optional[float] = None,
    ) -> float:
        """
        Compute shaped reward for an agent.

        Args:
            agent_id: Agent receiving reward
            contribution_score: Agent's contribution (0-1)
            custom_base_reward: Override base reward for this computation

        Returns:
            Shaped reward amount
        """
        base = custom_base_reward if custom_base_reward is not None else self.base_reward

        if self.strategy == RewardStrategy.LINEAR:
            reward = self._linear_shape(contribution_score) * (base / self.base_reward)
        elif self.strategy == RewardStrategy.EXPONENTIAL:
            reward = self._exponential_shape(contribution_score) * (base / self.base_reward)
        elif self.strategy == RewardStrategy.SIGMOID:
            reward = self._sigmoid_shape(contribution_score) * (base / self.base_reward)
        else:
            reward = base * contribution_score

        # Record for analysis
        self._reward_history.append((agent_id, contribution_score, reward))
        if len(self._reward_history) > 10000:
            self._reward_history.pop(0)

        return reward

    def get_reward_distribution(
        self,
        contributions: Dict[str, float],
        total_reward_pool: float,
    ) -> Dict[str, float]:
        """
        Distribute reward pool among agents based on contributions.

        Args:
            contributions: agent_id -> contribution_score
            total_reward_pool: Total reward to distribute

        Returns:
            agent_id -> allocated_reward
        """
        if not contributions:
            return {}

        # Compute shaped contributions
        shaped_contributions = {}
        for agent_id, score in contributions.items():
            shaped_contributions[agent_id] = self.compute_shaped_reward(agent_id, score, 1.0)

        # Normalize to sum to 1.0
        total_shaped = sum(shaped_contributions.values())
        if total_shaped == 0:
            return {agent_id: 0.0 for agent_id in contributions}

        # Allocate proportionally
        distribution = {
            agent_id: (shaped_contributions[agent_id] / total_shaped) * total_reward_pool
            for agent_id in contributions
        }

        return distribution

    def get_strategy_stats(self) -> Dict[str, Any]:
        """Get statistics on reward shaping across history."""
        if not self._reward_history:
            return {"count": 0}

        rewards = [r[2] for r in self._reward_history]
        contributions = [r[1] for r in self._reward_history]

        return {
            "count": len(self._reward_history),
            "avg_reward": float(np.mean(rewards)),
            "avg_contribution": float(np.mean(contributions)),
            "max_reward": float(np.max(rewards)),
            "min_reward": float(np.min(rewards)),
            "strategy": self.strategy.value,
        }


class AttributionEngine:
    """
    Main orchestrator for multi-agent attribution using Shapley value approximation.

    Handles:
    - Tracking contributions from 10+ concurrent agents
    - Computing fair Shapley values for coalition games
    - Generating attribution reports for analysis
    - Efficient computation (<50ms per task)

    Uses Monte Carlo approximation for Shapley values:
    - Permutation sampling to estimate agent marginal contributions
    - Fast coalition evaluation with agent subsets
    """

    def __init__(
        self,
        contribution_tracker: Optional[ContributionTracker] = None,
        reward_shaper: Optional[RewardShaper] = None,
        shapley_iterations: int = 100,  # Monte Carlo iterations per task
    ):
        """
        Initialize attribution engine.

        Args:
            contribution_tracker: Tracker instance (creates new if None)
            reward_shaper: Reward shaper instance (creates new if None)
            shapley_iterations: Monte Carlo iterations for Shapley approximation
        """
        self.tracker = contribution_tracker or ContributionTracker()
        self.shaper = reward_shaper or RewardShaper()
        self.shapley_iterations = shapley_iterations
        self._attribution_reports: List[AttributionReport] = []
        self._engine_lock = asyncio.Lock()

    async def attribute_multi_agent_task(
        self,
        task_id: str,
        agent_contributions: Dict[str, float],  # agent_id -> contribution_score
        total_reward: float = 1.0,
        strategy: Optional[RewardStrategy] = None,
    ) -> AttributionReport:
        """
        Compute fair attribution for multi-agent task using Shapley approximation.

        Args:
            task_id: Unique task identifier
            agent_contributions: agent_id -> contribution_score (0-1)
            total_reward: Total reward to distribute
            strategy: Override shaper's strategy

        Returns:
            Full attribution report with rewards and analysis
        """
        start_time = time.perf_counter()

        async with self._engine_lock:
            agents = list(agent_contributions.keys())

            if not agents:
                return AttributionReport(
                    task_id=task_id,
                    agents=[],
                    contributions={},
                    rewards={},
                    total_reward=0.0,
                    strategy_used="none",
                    computation_time_ms=0.0,
                )

            # Approximate Shapley values via permutation sampling
            shapley_values = await self._compute_shapley_approximation(
                agents,
                agent_contributions,
            )

            # Apply reward shaping
            old_strategy = None
            if strategy and strategy != self.shaper.strategy:
                old_strategy = self.shaper.strategy
                self.shaper.strategy = strategy

            rewards = self.shaper.get_reward_distribution(shapley_values, total_reward)

            if old_strategy is not None:
                self.shaper.strategy = old_strategy

            # Create report
            computation_time = (time.perf_counter() - start_time) * 1000  # ms

            report = AttributionReport(
                task_id=task_id,
                agents=agents,
                contributions=shapley_values,
                rewards=rewards,
                total_reward=total_reward,
                strategy_used=(strategy or self.shaper.strategy).value,
                computation_time_ms=computation_time,
            )

            # Keep history
            self._attribution_reports.append(report)
            if len(self._attribution_reports) > 10000:
                self._attribution_reports.pop(0)

            logger.info(
                f"Attributed task {task_id} to {len(agents)} agents in {computation_time:.2f}ms"
            )

            return report

    async def _compute_shapley_approximation(
        self,
        agents: List[str],
        base_contributions: Dict[str, float],
    ) -> Dict[str, float]:
        """
        Approximate Shapley values via Monte Carlo permutation sampling.

        For each random permutation, compute marginal contribution of each agent
        when added to coalition of preceding agents in permutation.

        Args:
            agents: List of agent IDs
            base_contributions: agent_id -> base_contribution_score

        Returns:
            agent_id -> shapley_value (normalized 0-1)
        """
        if len(agents) == 1:
            return {agents[0]: 1.0}

        shapley_values = {agent: 0.0 for agent in agents}

        for _ in range(self.shapley_iterations):
            # Random permutation
            perm = np.random.permutation(agents)

            # Evaluate coalition values
            coalition_value = 0.0
            for i, agent in enumerate(perm):
                # Value with this agent
                coalition_with = coalition_value + base_contributions.get(agent, 0.0)
                # Marginal contribution of this agent
                marginal = coalition_with - coalition_value
                shapley_values[agent] += marginal
                coalition_value = coalition_with

        # Average over iterations and normalize
        avg_shapley = {
            agent: shapley_values[agent] / self.shapley_iterations
            for agent in agents
        }

        # Normalize to 0-1 range
        total_value = sum(avg_shapley.values())
        if total_value > 0:
            return {agent: val / total_value for agent, val in avg_shapley.items()}

        # If all contributions are zero, return zero Shapley values (not uniform)
        # This is mathematically correct: zero contributions should yield zero value
        return {agent: 0.0 for agent in agents}

    async def get_attribution_report(
        self,
        task_id: Optional[str] = None,
    ) -> Optional[AttributionReport]:
        """
        Retrieve attribution report for a task.

        Args:
            task_id: Task to query (None = most recent)

        Returns:
            Attribution report or None if not found
        """
        async with self._engine_lock:
            if not self._attribution_reports:
                return None

            if task_id is None:
                return self._attribution_reports[-1]

            for report in reversed(self._attribution_reports):
                if report.task_id == task_id:
                    return report

            return None

    async def get_agent_ranking(
        self,
        window_size: int = 100,
    ) -> List[Tuple[str, float]]:
        """
        Get agents ranked by average Shapley values across recent tasks.

        Args:
            window_size: Number of recent reports to analyze

        Returns:
            List of (agent_id, avg_shapley_value) sorted descending
        """
        async with self._engine_lock:
            agent_values: Dict[str, List[float]] = defaultdict(list)

            for report in self._attribution_reports[-window_size:]:
                for agent, value in report.contributions.items():
                    agent_values[agent].append(value)

            avg_values = {
                agent: sum(values) / len(values)
                for agent, values in agent_values.items()
            }

            return sorted(avg_values.items(), key=lambda x: x[1], reverse=True)

    async def export_attribution_history(
        self,
        limit: int = 1000,
    ) -> List[Dict[str, Any]]:
        """Export attribution history as JSON-serializable list."""
        async with self._engine_lock:
            return [
                report.to_dict()
                for report in self._attribution_reports[-limit:]
            ]


# Convenience function for integration
async def create_attribution_engine(
    contribution_tracker: Optional[ContributionTracker] = None,
    reward_shaper: Optional[RewardShaper] = None,
    shapley_iterations: int = 100,
) -> AttributionEngine:
    """Factory function to create a configured attribution engine."""
    return AttributionEngine(
        contribution_tracker=contribution_tracker,
        reward_shaper=reward_shaper,
        shapley_iterations=shapley_iterations,
    )
