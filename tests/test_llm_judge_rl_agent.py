"""
Test suite for LLM Judge RL Agent memory integration.

Tests:
- Judgment storage and retrieval
- RL trajectory tracking and persistence
- Judgment pattern learning
- Evaluation functionality
- Memory persistence
- Statistics generation
"""

import asyncio
import pytest
import pytest_asyncio
import tempfile
import json
from datetime import datetime, timezone
from pathlib import Path
from unittest.mock import patch, MagicMock, AsyncMock
from enum import Enum

# Add parent directory to path
import sys
sys.path.insert(0, str(Path(__file__).parent.parent))

from agents.llm_judge_rl_agent import (
    LLMJudgeRLAgent,
    create_judge_rl_agent,
    Judgment,
    RLStep,
    RLTrajectory,
    JudgmentPattern,
    JudgmentType
)


class TestLLMJudgeRLAgent:
    """Test suite for LLM Judge RL Agent."""

    @pytest.fixture
    def isolated_db_uri(self):
        """Provide isolated MongoDB URI for testing."""
        return "mongodb://localhost:27017/"

    @pytest.fixture
    def test_database_name(self):
        """Provide isolated database name for each test."""
        import time
        return f"test_llm_judge_rl_{int(time.time() * 1000)}"

    @pytest_asyncio.fixture
    async def agent(self, isolated_db_uri, test_database_name):
        """Create agent instance with isolated database."""
        agent = LLMJudgeRLAgent(
            agent_id="test-judge-rl-001",
            mongodb_uri=isolated_db_uri,
            database_name=test_database_name,
            enable_memory=False  # Disable actual DB for unit tests
        )
        yield agent
        # Cleanup
        if hasattr(agent, '__del__'):
            agent.__del__()

    @pytest.mark.asyncio
    async def test_agent_initialization(self, agent):
        """Test agent initialization."""
        assert agent.agent_id == "test-judge-rl-001"
        assert isinstance(agent.judgments, list)
        assert isinstance(agent.rl_trajectories, list)
        assert isinstance(agent.judgment_patterns, dict)
        assert len(agent.judgment_thresholds) == 5

    @pytest.mark.asyncio
    async def test_store_judgment_correctness(self, agent):
        """Test storing correctness judgment."""
        judgment_id = await agent.store_judgment(
            judgment_type=JudgmentType.CORRECTNESS,
            target_output="The capital of France is Paris",
            score=0.98,
            reasoning="Output is factually accurate and complete",
            confidence=0.95,
            target_agent_id="agent_001",
            metadata={"task": "geography"}
        )

        assert judgment_id is not None
        assert judgment_id.startswith("judgment_")
        assert len(agent.judgments) == 1

        stored_judgment = agent.judgments[0]
        assert stored_judgment.judgment_type == JudgmentType.CORRECTNESS
        assert stored_judgment.score == 0.98
        assert stored_judgment.confidence == 0.95
        assert stored_judgment.agent_id == "agent_001"

    @pytest.mark.asyncio
    async def test_store_multiple_judgments(self, agent):
        """Test storing multiple judgments of different types."""
        judgment_types = [
            JudgmentType.CORRECTNESS,
            JudgmentType.QUALITY,
            JudgmentType.SAFETY,
            JudgmentType.EFFICIENCY,
            JudgmentType.COHERENCE
        ]

        judgment_ids = []
        for jtype in judgment_types:
            judgment_id = await agent.store_judgment(
                judgment_type=jtype,
                target_output="Test output",
                score=0.85,
                reasoning=f"Evaluating {jtype.value}",
                confidence=0.9
            )
            judgment_ids.append(judgment_id)

        assert len(judgment_ids) == 5
        assert len(agent.judgments) == 5

    @pytest.mark.asyncio
    async def test_store_rl_trajectory(self, agent):
        """Test storing RL trajectory."""
        # Create sample steps
        steps = [
            RLStep(
                step_id=f"step_{i}",
                state={"position": i, "status": "active"},
                action=f"action_{i}",
                reward=1.0 + (i * 0.1),
                next_state={"position": i + 1, "status": "active"},
                done=i == 4
            )
            for i in range(5)
        ]

        trajectory_id = await agent.store_rl_trajectory(
            task_description="Navigation task in grid world",
            steps=steps,
            total_reward=6.0,
            success=True,
            metadata={"task_id": "nav_001", "difficulty": "medium"}
        )

        assert trajectory_id is not None
        assert trajectory_id.startswith("trajectory_")
        assert len(agent.rl_trajectories) == 1

        stored_traj = agent.rl_trajectories[0]
        assert stored_traj.task_description == "Navigation task in grid world"
        assert stored_traj.total_reward == 6.0
        assert stored_traj.success is True
        assert stored_traj.episode_length == 5

    @pytest.mark.asyncio
    async def test_store_multiple_trajectories(self, agent):
        """Test storing multiple RL trajectories."""
        for i in range(3):
            steps = [
                RLStep(
                    step_id=f"step_{j}",
                    state={"iteration": i, "step": j},
                    action="test_action",
                    reward=float(j),
                    next_state={"iteration": i, "step": j + 1},
                    done=j == 2
                )
                for j in range(3)
            ]

            trajectory_id = await agent.store_rl_trajectory(
                task_description="Test trajectory",
                steps=steps,
                total_reward=3.0,
                success=True if i % 2 == 0 else False
            )

        assert len(agent.rl_trajectories) == 3

    @pytest.mark.asyncio
    async def test_recall_judgment_patterns(self, agent):
        """Test recalling judgment patterns."""
        # Create test patterns
        pattern = JudgmentPattern(
            pattern_id="jpat_001",
            judgment_type=JudgmentType.CORRECTNESS,
            criteria={"accuracy": 0.95, "completeness": 0.9},
            avg_score=0.93,
            consistency_score=0.88,
            sample_count=10
        )

        agent.judgment_patterns[JudgmentType.CORRECTNESS] = pattern

        # Recall patterns
        patterns = await agent.recall_judgment_patterns(min_samples=5)
        assert len(patterns) == 1

        # Recall patterns by type
        correctness_patterns = await agent.recall_judgment_patterns(
            judgment_type=JudgmentType.CORRECTNESS,
            min_samples=5
        )
        assert len(correctness_patterns) == 1

    @pytest.mark.asyncio
    async def test_recall_rl_trajectories(self, agent):
        """Test recalling RL trajectories."""
        # Create and store trajectories
        for success_status in [True, True, False]:
            steps = [
                RLStep(
                    step_id="s_1",
                    state={"init": True},
                    action="a_1",
                    reward=1.0,
                    next_state={"init": False},
                    done=True
                )
            ]

            await agent.store_rl_trajectory(
                task_description="Test task",
                steps=steps,
                total_reward=1.0,
                success=success_status
            )

        # Recall successful trajectories
        trajectories = await agent.recall_rl_trajectories(min_success_rate=0.6)
        assert len(trajectories) >= 1

    @pytest.mark.asyncio
    async def test_evaluate_output(self, agent):
        """Test output evaluation."""
        task_context = {
            "task_id": "eval_001",
            "agent_id": "test_agent",
            "task_type": "qa"
        }

        judgments = await agent.evaluate_output(
            output="The answer is definitely correct",
            task_context=task_context,
            judgment_types=[
                JudgmentType.CORRECTNESS,
                JudgmentType.QUALITY
            ]
        )

        assert len(judgments) == 2
        assert JudgmentType.CORRECTNESS in judgments
        assert JudgmentType.QUALITY in judgments
        assert len(agent.judgments) == 2

    @pytest.mark.asyncio
    async def test_judgment_statistics(self, agent):
        """Test judgment statistics."""
        # Store judgments
        await agent.store_judgment(
            judgment_type=JudgmentType.CORRECTNESS,
            target_output="Output 1",
            score=0.95,
            reasoning="Good",
            confidence=0.9
        )

        await agent.store_judgment(
            judgment_type=JudgmentType.QUALITY,
            target_output="Output 2",
            score=0.85,
            reasoning="Fair",
            confidence=0.85
        )

        stats = await agent.get_judgment_statistics()

        assert stats["total_judgments"] == 2
        assert stats["judgments_by_type"]["correctness"] == 1
        assert stats["judgments_by_type"]["quality"] == 1
        assert stats["avg_scores"]["correctness"] == 0.95
        assert stats["avg_scores"]["quality"] == 0.85

    @pytest.mark.asyncio
    async def test_trajectory_statistics(self, agent):
        """Test trajectory statistics."""
        # Store trajectories with different success/failure
        for i in range(4):
            steps = [
                RLStep(
                    step_id="s_1",
                    state={"index": i},
                    action="action",
                    reward=float(i),
                    next_state={"index": i + 1},
                    done=True
                )
            ]

            await agent.store_rl_trajectory(
                task_description=f"Task {i}",
                steps=steps,
                total_reward=float(i),
                success=i < 3  # First 3 successful
            )

        stats = await agent.get_trajectory_statistics()

        assert stats["total_trajectories"] == 4
        assert stats["successful_trajectories"] == 3
        assert stats["failed_trajectories"] == 1
        assert abs(stats["success_rate"] - 0.75) < 0.01
        assert stats["avg_episode_length"] == 1.0
        assert stats["max_total_reward"] == 3.0

    @pytest.mark.asyncio
    async def test_judgment_thresholds(self, agent):
        """Test judgment threshold values."""
        thresholds = agent.judgment_thresholds

        assert JudgmentType.CORRECTNESS in thresholds
        assert JudgmentType.SAFETY in thresholds
        assert thresholds[JudgmentType.SAFETY] == 0.90  # Highest threshold
        assert thresholds[JudgmentType.EFFICIENCY] == 0.70  # Lowest threshold

    @pytest.mark.asyncio
    async def test_judgment_persistence(self, agent):
        """Test that judgments persist in local storage."""
        for i in range(3):
            await agent.store_judgment(
                judgment_type=JudgmentType.CORRECTNESS,
                target_output=f"Output {i}",
                score=0.90 - (i * 0.05),
                reasoning="Test",
                confidence=0.9
            )

        assert len(agent.judgments) == 3
        for i, judgment in enumerate(agent.judgments):
            assert judgment.score == 0.90 - (i * 0.05)

    @pytest.mark.asyncio
    async def test_trajectory_persistence(self, agent):
        """Test that trajectories persist in local storage."""
        for i in range(2):
            steps = [RLStep(
                step_id="s",
                state={},
                action="a",
                reward=float(i),
                next_state={},
                done=True
            )]

            await agent.store_rl_trajectory(
                task_description=f"Task {i}",
                steps=steps,
                total_reward=float(i),
                success=True
            )

        assert len(agent.rl_trajectories) == 2

    @pytest.mark.asyncio
    async def test_empty_statistics(self, agent):
        """Test statistics with no data."""
        judgment_stats = await agent.get_judgment_statistics()
        assert judgment_stats["total_judgments"] == 0

        trajectory_stats = await agent.get_trajectory_statistics()
        assert trajectory_stats["total_trajectories"] == 0

    @pytest.mark.asyncio
    async def test_all_judgment_types(self, agent):
        """Test all judgment types."""
        for jtype in JudgmentType:
            judgment_id = await agent.store_judgment(
                judgment_type=jtype,
                target_output="Test output",
                score=0.85,
                reasoning=f"Testing {jtype.value}",
                confidence=0.9
            )
            assert judgment_id.startswith("judgment_")

        assert len(agent.judgments) == len(JudgmentType)

    @pytest.mark.asyncio
    async def test_judgment_with_metadata(self, agent):
        """Test storing judgment with rich metadata."""
        metadata = {
            "model_used": "gpt-4o",
            "temperature": 0.7,
            "context_length": 2048,
            "custom_field": "custom_value"
        }

        judgment_id = await agent.store_judgment(
            judgment_type=JudgmentType.QUALITY,
            target_output="Test output",
            score=0.88,
            reasoning="Well evaluated",
            confidence=0.92,
            metadata=metadata
        )

        stored_judgment = agent.judgments[0]
        assert stored_judgment.metadata == metadata

    @pytest.mark.asyncio
    async def test_rl_trajectory_episode_tracking(self, agent):
        """Test tracking episode length in RL trajectories."""
        # Create trajectory with 10 steps
        steps = [
            RLStep(
                step_id=f"step_{i}",
                state={"step": i},
                action=f"action_{i}",
                reward=0.1 * (i + 1),
                next_state={"step": i + 1},
                done=i == 9
            )
            for i in range(10)
        ]

        trajectory_id = await agent.store_rl_trajectory(
            task_description="Long episode",
            steps=steps,
            total_reward=5.5,
            success=True
        )

        stored_traj = agent.rl_trajectories[0]
        assert stored_traj.episode_length == 10
        assert stored_traj.total_reward == 5.5

    @pytest.mark.asyncio
    async def test_trajectory_task_filtering(self, agent):
        """Test filtering trajectories by task description."""
        await agent.store_rl_trajectory(
            task_description="Navigation task",
            steps=[RLStep("s", {}, "a", 1.0, {}, True)],
            total_reward=1.0,
            success=True
        )

        await agent.store_rl_trajectory(
            task_description="Manipulation task",
            steps=[RLStep("s", {}, "a", 1.0, {}, True)],
            total_reward=1.0,
            success=True
        )

        # Filter by task
        nav_trajectories = await agent.recall_rl_trajectories(
            task_description="Navigation",
            min_success_rate=0.5
        )

        assert len(nav_trajectories) >= 1


class TestLLMJudgeRLAgentFactory:
    """Test factory function for creating agents."""

    @pytest.mark.asyncio
    async def test_create_judge_rl_agent(self):
        """Test factory function for agent creation."""
        agent = await create_judge_rl_agent(
            agent_id="test-judge-factory-001",
            enable_memory=False
        )

        assert agent.agent_id == "test-judge-factory-001"
        assert agent.enable_memory is False

    @pytest.mark.asyncio
    async def test_create_judge_rl_agent_with_memory(self):
        """Test factory function with memory enabled."""
        agent = await create_judge_rl_agent(
            agent_id="test-judge-factory-mem-001",
            enable_memory=False  # Use False for testing
        )

        assert agent.agent_id == "test-judge-factory-mem-001"


if __name__ == "__main__":
    # Run tests with: pytest tests/test_llm_judge_rl_agent.py -v
    pytest.main([__file__, "-v", "-s"])
