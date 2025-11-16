"""
Comprehensive test suite for AgentEvolver Phase 3: Self-Attributing

Tests all three core components:
1. ContributionTracker: Individual agent contribution tracking
2. RewardShaper: Multi-strategy reward shaping
3. AttributionEngine: Multi-agent Shapley-based attribution

Run with: pytest tests/test_self_attributing_phase3.py -v
"""

import asyncio
import pytest
from typing import Dict
import numpy as np

from infrastructure.agentevolver import (
    ContributionTracker,
    RewardShaper,
    AttributionEngine,
    AgentContribution,
    AttributionReport,
    RewardStrategy,
    create_attribution_engine,
)


class TestContributionTracker:
    """Tests for ContributionTracker class."""

    @pytest.mark.asyncio
    async def test_record_single_contribution(self):
        """Test recording a single agent contribution."""
        tracker = ContributionTracker()

        score = await tracker.record_contribution(
            agent_id="agent_1",
            task_id="task_001",
            quality_before=70.0,
            quality_after=80.0,
            effort_ratio=1.0,
            impact_multiplier=1.0,
        )

        assert isinstance(score, float)
        assert 0.0 <= score <= 1.0
        assert score > 0.0  # Should have positive contribution

    @pytest.mark.asyncio
    async def test_get_contribution_score(self):
        """Test retrieving contribution scores."""
        tracker = ContributionTracker()

        # Record contributions
        await tracker.record_contribution(
            agent_id="agent_1",
            task_id="task_001",
            quality_before=70.0,
            quality_after=85.0,
        )

        # Retrieve score
        score = await tracker.get_contribution_score("agent_1", task_id="task_001")
        assert score > 0.0

    @pytest.mark.asyncio
    async def test_contribution_history(self):
        """Test getting contribution history."""
        tracker = ContributionTracker()

        # Record multiple contributions
        for i in range(5):
            await tracker.record_contribution(
                agent_id="agent_1",
                task_id=f"task_{i:03d}",
                quality_before=70.0 + i,
                quality_after=75.0 + i,
            )

        # Get history
        history = await tracker.get_contribution_history("agent_1", limit=10)
        assert len(history) == 5
        assert all(isinstance(c, AgentContribution) for c in history)

    @pytest.mark.asyncio
    async def test_effort_and_impact_weighting(self):
        """Test that effort and impact multipliers affect contribution."""
        tracker = ContributionTracker()

        # Contribution with low effort
        low_effort_score = await tracker.record_contribution(
            agent_id="agent_low",
            task_id="task_001",
            quality_before=70.0,
            quality_after=80.0,
            effort_ratio=0.5,  # 50% effort
            impact_multiplier=1.0,
        )

        # Contribution with high effort
        high_effort_score = await tracker.record_contribution(
            agent_id="agent_high",
            task_id="task_002",
            quality_before=70.0,
            quality_after=80.0,
            effort_ratio=1.0,  # 100% effort
            impact_multiplier=1.0,
        )

        # High effort should yield higher contribution
        assert high_effort_score > low_effort_score

    @pytest.mark.asyncio
    async def test_concurrent_contributions(self):
        """Test concurrent recording from multiple agents."""
        tracker = ContributionTracker()

        async def record_agent(agent_id: str, count: int):
            for i in range(count):
                await tracker.record_contribution(
                    agent_id=agent_id,
                    task_id=f"task_{i:03d}",
                    quality_before=70.0,
                    quality_after=75.0,
                )

        # Run 4 agents concurrently
        await asyncio.gather(
            record_agent("agent_1", 10),
            record_agent("agent_2", 10),
            record_agent("agent_3", 10),
            record_agent("agent_4", 10),
        )

        # Verify all recorded
        scores = await tracker.get_all_agents_scores()
        assert len(scores) == 4
        assert all(score > 0.0 for score in scores.values())


class TestRewardShaper:
    """Tests for RewardShaper class."""

    def test_linear_shaping(self):
        """Test linear reward shaping."""
        shaper = RewardShaper(base_reward=100.0, strategy=RewardStrategy.LINEAR)

        reward_low = shaper.compute_shaped_reward("agent_1", 0.2)
        reward_mid = shaper.compute_shaped_reward("agent_2", 0.5)
        reward_high = shaper.compute_shaped_reward("agent_3", 0.9)

        # Linear: reward = base * contribution
        assert reward_low == pytest.approx(20.0)
        assert reward_mid == pytest.approx(50.0)
        assert reward_high == pytest.approx(90.0)

    def test_exponential_shaping(self):
        """Test exponential reward shaping."""
        shaper = RewardShaper(base_reward=100.0, strategy=RewardStrategy.EXPONENTIAL)

        reward_low = shaper.compute_shaped_reward("agent_1", 0.2)
        reward_high = shaper.compute_shaped_reward("agent_2", 0.9)

        # Exponential emphasizes high contributors
        assert reward_high > reward_low * 10  # Much higher ratio

    def test_sigmoid_shaping(self):
        """Test sigmoid reward shaping."""
        shaper = RewardShaper(
            base_reward=100.0,
            strategy=RewardStrategy.SIGMOID,
            sigmoid_midpoint=0.5,
        )

        reward_low = shaper.compute_shaped_reward("agent_1", 0.1)
        reward_mid = shaper.compute_shaped_reward("agent_2", 0.5)
        reward_high = shaper.compute_shaped_reward("agent_3", 0.9)

        # Sigmoid should have S-curve properties
        assert reward_low < reward_mid < reward_high
        assert abs(reward_mid - 50.0) < 5.0  # Midpoint near 50%

    def test_reward_distribution(self):
        """Test reward distribution across agents."""
        shaper = RewardShaper(base_reward=1.0, strategy=RewardStrategy.LINEAR)

        contributions = {
            "agent_1": 0.2,
            "agent_2": 0.5,
            "agent_3": 0.3,
        }

        distribution = shaper.get_reward_distribution(contributions, total_reward_pool=100.0)

        # Should sum to total pool
        assert sum(distribution.values()) == pytest.approx(100.0)
        # Proportional to contributions
        assert distribution["agent_2"] > distribution["agent_1"]

    def test_strategy_stats(self):
        """Test strategy statistics tracking."""
        shaper = RewardShaper(base_reward=100.0)

        # Generate some rewards
        for contribution in [0.2, 0.5, 0.9]:
            shaper.compute_shaped_reward(f"agent_{contribution}", contribution)

        stats = shaper.get_strategy_stats()
        assert stats["count"] == 3
        assert stats["strategy"] == "linear"
        assert stats["avg_reward"] > 0


class TestAttributionEngine:
    """Tests for AttributionEngine class."""

    @pytest.mark.asyncio
    async def test_single_agent_attribution(self):
        """Test attribution with single agent."""
        engine = AttributionEngine()

        report = await engine.attribute_multi_agent_task(
            task_id="task_001",
            agent_contributions={"agent_1": 0.8},
            total_reward=100.0,
        )

        assert isinstance(report, AttributionReport)
        assert report.task_id == "task_001"
        assert report.contributions["agent_1"] == pytest.approx(1.0)  # 100% of Shapley value
        assert report.rewards["agent_1"] == pytest.approx(100.0)  # Gets all reward (sole agent)

    @pytest.mark.asyncio
    async def test_multi_agent_attribution(self):
        """Test Shapley attribution with multiple agents."""
        engine = AttributionEngine(shapley_iterations=50)

        contributions = {
            "agent_1": 0.3,
            "agent_2": 0.5,
            "agent_3": 0.2,
        }

        report = await engine.attribute_multi_agent_task(
            task_id="task_002",
            agent_contributions=contributions,
            total_reward=100.0,
        )

        # Shapley values should sum approximately to 1.0
        total_shapley = sum(report.contributions.values())
        assert total_shapley == pytest.approx(1.0, abs=0.05)

        # Rewards should sum to total pool
        assert sum(report.rewards.values()) == pytest.approx(100.0)

    @pytest.mark.asyncio
    async def test_attribution_computation_time(self):
        """Test that attribution computation is fast (<50ms)."""
        engine = AttributionEngine(shapley_iterations=100)

        contributions = {f"agent_{i}": np.random.uniform(0.3, 0.95) for i in range(10)}

        report = await engine.attribute_multi_agent_task(
            task_id="task_perf",
            agent_contributions=contributions,
            total_reward=100.0,
        )

        # Should be well under 50ms target
        assert report.computation_time_ms < 50.0

    @pytest.mark.asyncio
    async def test_different_strategies(self):
        """Test attribution with different reward strategies."""
        engine = AttributionEngine()

        contributions = {"agent_1": 0.5, "agent_2": 0.9}

        # Test each strategy
        for strategy in [RewardStrategy.LINEAR, RewardStrategy.EXPONENTIAL, RewardStrategy.SIGMOID]:
            report = await engine.attribute_multi_agent_task(
                task_id=f"task_{strategy.value}",
                agent_contributions=contributions,
                total_reward=100.0,
                strategy=strategy,
            )

            assert report.strategy_used == strategy.value
            assert sum(report.rewards.values()) == pytest.approx(100.0)

    @pytest.mark.asyncio
    async def test_get_attribution_report(self):
        """Test retrieving attribution reports."""
        engine = AttributionEngine()

        # Create multiple reports
        for i in range(3):
            await engine.attribute_multi_agent_task(
                task_id=f"task_{i:03d}",
                agent_contributions={"agent_1": 0.5},
                total_reward=100.0,
            )

        # Retrieve specific report
        report = await engine.get_attribution_report("task_001")
        assert report is not None
        assert report.task_id == "task_001"

        # Retrieve most recent
        latest = await engine.get_attribution_report()
        assert latest.task_id == "task_002"

    @pytest.mark.asyncio
    async def test_agent_ranking(self):
        """Test getting agent rankings by contribution."""
        engine = AttributionEngine(shapley_iterations=50)

        # Create tasks with varying contributions
        contributions_list = [
            {"agent_1": 0.3, "agent_2": 0.8, "agent_3": 0.5},
            {"agent_1": 0.4, "agent_2": 0.7, "agent_3": 0.6},
            {"agent_1": 0.2, "agent_2": 0.9, "agent_3": 0.4},
        ]

        for i, contributions in enumerate(contributions_list):
            await engine.attribute_multi_agent_task(
                task_id=f"task_{i:03d}",
                agent_contributions=contributions,
                total_reward=100.0,
            )

        # Get rankings
        ranking = await engine.get_agent_ranking(window_size=10)

        assert len(ranking) > 0
        # First should have highest average
        assert ranking[0][1] >= ranking[-1][1]

    @pytest.mark.asyncio
    async def test_concurrent_multi_task_attribution(self):
        """Test concurrent attribution across multiple tasks."""
        engine = AttributionEngine()

        num_tasks = 20
        num_agents = 10

        tasks = []
        for task_idx in range(num_tasks):
            contributions = {
                f"agent_{i}": np.random.uniform(0.3, 0.95)
                for i in range(num_agents)
            }

            tasks.append(
                engine.attribute_multi_agent_task(
                    task_id=f"task_{task_idx:03d}",
                    agent_contributions=contributions,
                    total_reward=100.0,
                )
            )

        # Run all concurrently
        reports = await asyncio.gather(*tasks)

        assert len(reports) == num_tasks
        # All should complete successfully
        assert all(isinstance(r, AttributionReport) for r in reports)

    @pytest.mark.asyncio
    async def test_export_attribution_history(self):
        """Test exporting attribution history."""
        engine = AttributionEngine()

        # Create multiple reports
        for i in range(5):
            await engine.attribute_multi_agent_task(
                task_id=f"task_{i:03d}",
                agent_contributions={"agent_1": 0.5, "agent_2": 0.7},
                total_reward=100.0,
            )

        # Export history
        history = await engine.export_attribution_history(limit=10)

        assert len(history) == 5
        assert all(isinstance(h, dict) for h in history)
        assert all("task_id" in h for h in history)
        assert all("contributions" in h for h in history)


class TestFactoryFunction:
    """Tests for factory functions."""

    @pytest.mark.asyncio
    async def test_create_attribution_engine(self):
        """Test factory function for creating engine."""
        engine = await create_attribution_engine(
            contribution_tracker=None,
            reward_shaper=None,
            shapley_iterations=100,
        )

        assert isinstance(engine, AttributionEngine)
        assert engine.shapley_iterations == 100

        # Should work immediately
        report = await engine.attribute_multi_agent_task(
            task_id="task_001",
            agent_contributions={"agent_1": 0.5},
            total_reward=100.0,
        )

        assert report is not None


class TestIntegration:
    """Integration tests combining multiple components."""

    @pytest.mark.asyncio
    async def test_full_workflow(self):
        """Test complete workflow: track -> shape -> attribute."""
        # Initialize all components
        tracker = ContributionTracker()
        shaper = RewardShaper(base_reward=1.0, strategy=RewardStrategy.EXPONENTIAL)
        engine = AttributionEngine(
            contribution_tracker=tracker,
            reward_shaper=shaper,
            shapley_iterations=100,
        )

        # Simulate task execution by 3 agents
        agents = ["analyzer", "optimizer", "validator"]
        task_id = "task_001"

        for i, agent_id in enumerate(agents):
            # Record contribution
            contribution_score = await tracker.record_contribution(
                agent_id=agent_id,
                task_id=task_id,
                quality_before=70.0 + (i * 3),
                quality_after=75.0 + (i * 3),
            )
            assert contribution_score > 0.0

        # Get contribution scores
        contributions = {}
        for agent_id in agents:
            score = await tracker.get_contribution_score(agent_id, window_size=10)
            contributions[agent_id] = score

        # Compute attribution with engine
        report = await engine.attribute_multi_agent_task(
            task_id=task_id,
            agent_contributions=contributions,
            total_reward=100.0,
        )

        # Verify all components worked together
        assert len(report.rewards) == len(agents)
        assert sum(report.rewards.values()) == pytest.approx(100.0)
        assert report.strategy_used == "exponential"

    @pytest.mark.asyncio
    async def test_multi_round_improvement(self):
        """Test that contributions improve over multiple rounds."""
        tracker = ContributionTracker()

        agent_id = "learning_agent"
        improvements = []

        # Simulate learning over rounds
        for round_num in range(5):
            quality_improvement = 5 + (round_num * 2)  # Improving over time

            score = await tracker.record_contribution(
                agent_id=agent_id,
                task_id=f"task_{round_num:03d}",
                quality_before=70.0,
                quality_after=70.0 + quality_improvement,
            )
            improvements.append(score)

        # Contributions should be improving
        assert improvements[-1] > improvements[0]

        # Average should show improvement
        recent_avg = await tracker.get_contribution_score(agent_id, window_size=5)
        assert recent_avg > 0.0


# Performance benchmarks
class TestPerformance:
    """Performance and scalability tests."""

    @pytest.mark.asyncio
    async def test_large_scale_attribution(self):
        """Test attribution with many agents."""
        engine = AttributionEngine(shapley_iterations=100)

        # 20 agents
        contributions = {f"agent_{i}": np.random.uniform(0.3, 0.95) for i in range(20)}

        report = await engine.attribute_multi_agent_task(
            task_id="task_large",
            agent_contributions=contributions,
            total_reward=100.0,
        )

        # Should still be fast
        assert report.computation_time_ms < 50.0


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
