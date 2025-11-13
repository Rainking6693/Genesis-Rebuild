"""
Tests for Data Juicer Agent - Trajectory Data Curation with Memory Integration
"""

import asyncio
import json
import pytest
from datetime import datetime, timezone
from typing import List, Dict, Any

from agents.data_juicer_agent import (
    DataJuicerAgent,
    TrajectoryData,
    CurationPattern,
    QualityMetrics,
    create_data_juicer_agent
)


class TestDataJuicerAgent:
    """Test suite for Data Juicer Agent"""

    @pytest.fixture
    def agent(self):
        """Create test agent instance with memory disabled"""
        return create_data_juicer_agent(
            business_id="test",
            enable_memory=False  # Disable for unit tests
        )

    @pytest.fixture
    def agent_with_memory(self):
        """Create test agent instance with memory enabled"""
        return create_data_juicer_agent(
            business_id="test_memory",
            enable_memory=True
        )

    @pytest.fixture
    def sample_trajectories(self) -> List[Dict[str, Any]]:
        """Sample trajectory data for testing"""
        return [
            {
                'trajectory_id': 'traj_1',
                'states': [1, 2, 3, 4, 5],
                'actions': ['a', 'b', 'c', 'd'],
                'rewards': [0.1, 0.2, 0.3, 0.4]
            },
            {
                'trajectory_id': 'traj_2',
                'states': [1, 2, 3],
                'actions': ['a', 'b'],
                'rewards': [0.5, 0.6]
            },
            {
                'trajectory_id': 'traj_3',
                'states': [1, 2],
                'actions': ['a'],
                'rewards': None  # Poor quality - should be filtered
            },
            {
                'trajectory_id': 'traj_4',
                'states': None,  # Missing data
                'actions': ['a', 'b', 'c'],
                'rewards': [0.1, 0.2, 0.3]
            }
        ]

    def test_agent_initialization(self, agent):
        """Test agent initialization"""
        assert agent is not None
        assert agent.business_id == "test"
        assert agent.enable_memory is False
        assert agent.session_id is not None

    def test_agent_initialization_with_memory(self, agent_with_memory):
        """Test agent initialization with memory enabled"""
        assert agent_with_memory is not None
        assert agent_with_memory.business_id == "test_memory"
        assert agent_with_memory.enable_memory is True

    def test_quality_assessment(self, agent, sample_trajectories):
        """Test trajectory quality assessment"""
        # Good quality trajectory
        quality1 = agent._assess_quality(sample_trajectories[0])
        assert 0.5 <= quality1 <= 1.0

        # Medium quality trajectory
        quality2 = agent._assess_quality(sample_trajectories[1])
        assert 0.3 <= quality2 <= 0.9

        # Poor quality trajectory (null rewards)
        quality3 = agent._assess_quality(sample_trajectories[2])
        assert quality3 < 0.7

        # Poor quality trajectory (missing states)
        quality4 = agent._assess_quality(sample_trajectories[3])
        assert quality4 < 0.7

    @pytest.mark.asyncio
    async def test_curate_trajectories_basic(self, agent, sample_trajectories):
        """Test basic trajectory curation without memory"""
        curated, metrics = await agent.curate_trajectories(
            trajectories=sample_trajectories,
            user_id="test_user",
            min_quality_threshold=0.5
        )

        # Should filter out poor quality trajectories
        assert len(curated) < len(sample_trajectories)
        assert metrics.total_trajectories == len(sample_trajectories)
        assert metrics.curated_trajectories == len(curated)
        assert 0 <= metrics.avg_quality_before <= 1.0
        assert 0 <= metrics.avg_quality_after <= 1.0

    @pytest.mark.asyncio
    async def test_curate_trajectories_with_patterns(self, agent, sample_trajectories):
        """Test curation with patterns applied"""
        # Create a mock curation pattern
        pattern = CurationPattern(
            pattern_id="pattern_1",
            pattern_name="filter_null_rewards",
            criteria={
                'filter_null_rewards': True,
                'min_trajectory_length': 3
            },
            success_rate=0.85,
            avg_quality_improvement=0.15,
            usage_count=10,
            created_at=datetime.now(timezone.utc),
            last_used=datetime.now(timezone.utc)
        )

        # Apply pattern manually
        for traj in sample_trajectories:
            curated_traj, quality = await agent._apply_curation_patterns(
                trajectory=traj,
                patterns=[pattern]
            )

            # Verify pattern application
            if traj['rewards'] is None:
                # Should have low quality after pattern application
                assert quality < 0.5

    @pytest.mark.asyncio
    async def test_store_curation_pattern(self, agent):
        """Test storing curation pattern (without actual memory)"""
        await agent.store_curation_pattern(
            user_id="test_user",
            pattern_name="test_pattern",
            criteria={'filter_null': True},
            success_rate=0.9,
            quality_improvement=0.2
        )

        # Verify stats updated
        stats = agent.get_stats()
        # Note: Without memory, storage is skipped but logged
        assert stats['business_id'] == "test"

    @pytest.mark.asyncio
    async def test_recall_curation_patterns(self, agent):
        """Test recalling curation patterns (without actual memory)"""
        patterns = await agent.recall_curation_patterns(
            user_id="test_user",
            top_k=5
        )

        # Without memory, should return empty list
        assert isinstance(patterns, list)
        assert len(patterns) == 0

    @pytest.mark.asyncio
    async def test_store_quality_metrics(self, agent, sample_trajectories):
        """Test storing quality metrics"""
        metrics = QualityMetrics(
            total_trajectories=len(sample_trajectories),
            curated_trajectories=2,
            avg_quality_before=0.6,
            avg_quality_after=0.8,
            quality_improvement=0.2,
            curation_time_seconds=1.5
        )

        await agent.store_quality_metrics(
            user_id="test_user",
            metrics=metrics
        )

        # Verify stats
        stats = agent.get_stats()
        assert stats['session_id'] is not None

    @pytest.mark.asyncio
    async def test_recall_quality_benchmarks(self, agent):
        """Test recalling quality benchmarks"""
        benchmarks = await agent.recall_quality_benchmarks(
            user_id="test_user",
            top_k=10
        )

        # Without memory, should return empty list
        assert isinstance(benchmarks, list)
        assert len(benchmarks) == 0

    def test_get_stats(self, agent):
        """Test getting agent statistics"""
        stats = agent.get_stats()

        assert 'session_id' in stats
        assert 'business_id' in stats
        assert 'memory_enabled' in stats
        assert 'stats' in stats

        assert stats['business_id'] == "test"
        assert stats['memory_enabled'] is False

    @pytest.mark.asyncio
    async def test_end_to_end_curation_workflow(self, agent, sample_trajectories):
        """Test complete curation workflow"""
        # Step 1: Curate trajectories
        curated, metrics = await agent.curate_trajectories(
            trajectories=sample_trajectories,
            user_id="test_user",
            min_quality_threshold=0.4
        )

        # Verify curation results
        assert len(curated) > 0
        assert metrics.total_trajectories == len(sample_trajectories)

        # Step 2: Store quality metrics
        await agent.store_quality_metrics("test_user", metrics)

        # Step 3: Store successful pattern
        if metrics.quality_improvement > 0:
            await agent.store_curation_pattern(
                user_id="test_user",
                pattern_name="successful_curation",
                criteria={'min_quality': 0.4},
                success_rate=metrics.curated_trajectories / metrics.total_trajectories,
                quality_improvement=metrics.quality_improvement
            )

        # Verify workflow completion
        final_stats = agent.get_stats()
        assert final_stats['session_id'] is not None


class TestDataJuicerMemoryIntegration:
    """Test memory integration features"""

    @pytest.fixture
    def agent_memory(self):
        """Create agent with memory for integration tests"""
        return create_data_juicer_agent(
            business_id="test_integration",
            enable_memory=True
        )

    @pytest.mark.asyncio
    @pytest.mark.integration
    async def test_memory_initialization(self, agent_memory):
        """Test memory system initialization"""
        # Memory should be initialized
        if agent_memory.memory:
            assert agent_memory.memory is not None
            assert agent_memory.memory_tool is not None

    @pytest.mark.asyncio
    @pytest.mark.integration
    async def test_store_and_recall_pattern_with_memory(self, agent_memory):
        """Test storing and recalling patterns with actual memory"""
        if not agent_memory.memory:
            pytest.skip("Memory not available")

        # Store pattern
        await agent_memory.store_curation_pattern(
            user_id="integration_user",
            pattern_name="integration_test_pattern",
            criteria={'test': True, 'filter_null': True},
            success_rate=0.95,
            quality_improvement=0.25
        )

        # Recall pattern
        patterns = await agent_memory.recall_curation_patterns(
            user_id="integration_user",
            top_k=5
        )

        # Verify recall (may be empty if memory backend not available)
        assert isinstance(patterns, list)

    @pytest.mark.asyncio
    @pytest.mark.integration
    async def test_full_workflow_with_memory(self, agent_memory):
        """Test complete workflow with memory integration"""
        if not agent_memory.memory:
            pytest.skip("Memory not available")

        # Sample trajectories
        trajectories = [
            {'trajectory_id': 'mem_1', 'states': [1, 2, 3], 'actions': ['a', 'b'], 'rewards': [0.1, 0.2]},
            {'trajectory_id': 'mem_2', 'states': [1, 2, 3, 4], 'actions': ['a', 'b', 'c'], 'rewards': [0.2, 0.3, 0.4]}
        ]

        # Curate with memory
        curated, metrics = await agent_memory.curate_trajectories(
            trajectories=trajectories,
            user_id="integration_user",
            min_quality_threshold=0.5
        )

        # Store metrics
        await agent_memory.store_quality_metrics("integration_user", metrics)

        # Recall benchmarks
        benchmarks = await agent_memory.recall_quality_benchmarks(
            user_id="integration_user",
            top_k=5
        )

        # Verify workflow
        assert isinstance(curated, list)
        assert isinstance(benchmarks, list)


def test_import():
    """Test that agent can be imported"""
    from agents.data_juicer_agent import DataJuicerAgent
    assert DataJuicerAgent is not None


if __name__ == "__main__":
    # Run basic tests
    pytest.main([__file__, "-v", "-m", "not integration"])
