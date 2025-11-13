"""
Tests for ReAct Training Agent - Reinforcement Learning with Memory Integration
"""

import asyncio
import json
import pytest
from datetime import datetime, timezone
from typing import List, Dict, Any

from agents.react_training_agent import (
    ReActTrainingAgent,
    ReasoningStep,
    TrainingTrajectory,
    TrainingMetrics,
    TrainingConfig,
    create_react_training_agent
)


class TestReActTrainingAgent:
    """Test suite for ReAct Training Agent"""

    @pytest.fixture
    def agent(self):
        """Create test agent instance with memory disabled"""
        return create_react_training_agent(
            business_id="test",
            enable_memory=False  # Disable for unit tests
        )

    @pytest.fixture
    def agent_with_memory(self):
        """Create test agent instance with memory enabled"""
        return create_react_training_agent(
            business_id="test_memory",
            enable_memory=True
        )

    @pytest.fixture
    def custom_config(self) -> TrainingConfig:
        """Custom training configuration for testing"""
        return TrainingConfig(
            max_steps=5,
            learning_rate=0.01,
            discount_factor=0.95,
            exploration_rate=0.2,
            batch_size=16,
            update_frequency=50
        )

    @pytest.fixture
    def sample_tasks(self) -> List[str]:
        """Sample training tasks"""
        return [
            "Solve the math problem: 5 + 3 = ?",
            "Write a function to reverse a string",
            "Explain the concept of recursion",
            "Calculate the factorial of 5",
            "What is 2 to the power of 8?"
        ]

    def test_agent_initialization(self, agent):
        """Test agent initialization"""
        assert agent is not None
        assert agent.business_id == "test"
        assert agent.enable_memory is False
        assert agent.session_id is not None
        assert agent.episode_count == 0
        assert agent.training_config is not None

    def test_agent_initialization_with_custom_config(self, custom_config):
        """Test agent initialization with custom config"""
        agent = create_react_training_agent(
            business_id="test_config",
            enable_memory=False,
            training_config=custom_config
        )

        assert agent.training_config.max_steps == 5
        assert agent.training_config.learning_rate == 0.01
        assert agent.training_config.batch_size == 16

    def test_agent_initialization_with_memory(self, agent_with_memory):
        """Test agent initialization with memory enabled"""
        assert agent_with_memory is not None
        assert agent_with_memory.business_id == "test_memory"
        assert agent_with_memory.enable_memory is True

    def test_extract_task_type(self, agent, sample_tasks):
        """Test task type extraction"""
        # Math task
        task_type_1 = agent._extract_task_type(sample_tasks[0])
        assert task_type_1 == 'math'

        # Coding task
        task_type_2 = agent._extract_task_type(sample_tasks[1])
        assert task_type_2 == 'coding'

        # Reasoning task
        task_type_3 = agent._extract_task_type(sample_tasks[2])
        assert task_type_3 == 'reasoning'

        # General task
        task_type_4 = agent._extract_task_type("Tell me about the weather")
        assert task_type_4 == 'general'

    def test_calculate_reward(self, agent):
        """Test reward calculation"""
        # Success with answer
        reward_1 = agent._calculate_reward(
            task="test task",
            observation="ANSWER: 42",
            step_num=2,
            max_steps=5
        )
        assert reward_1 > 0.5  # Should have positive reward

        # Penalty for max steps
        reward_2 = agent._calculate_reward(
            task="test task",
            observation="processing",
            step_num=4,
            max_steps=5
        )
        assert reward_2 < 0.5  # Should have penalty

        # Normal step
        reward_3 = agent._calculate_reward(
            task="test task",
            observation="thinking",
            step_num=1,
            max_steps=5
        )
        assert reward_3 >= 0  # Small positive reward

    @pytest.mark.asyncio
    async def test_generate_thought(self, agent, sample_tasks):
        """Test thought generation"""
        thought_1 = await agent._generate_thought(
            task=sample_tasks[0],
            current_steps=[],
            past_trajectories=[]
        )
        assert isinstance(thought_1, str)
        assert len(thought_1) > 0

        # Generate thought at later step
        mock_step = ReasoningStep(
            step_id="step_1",
            thought="first thought",
            action="analyze",
            observation="analyzed",
            reward=0.1
        )
        thought_2 = await agent._generate_thought(
            task=sample_tasks[0],
            current_steps=[mock_step],
            past_trajectories=[]
        )
        assert isinstance(thought_2, str)
        assert len(thought_2) > 0

    @pytest.mark.asyncio
    async def test_generate_action(self, agent, sample_tasks):
        """Test action generation"""
        action = await agent._generate_action(
            task=sample_tasks[0],
            thought="I need to analyze",
            current_steps=[]
        )
        assert isinstance(action, str)
        assert len(action) > 0

    @pytest.mark.asyncio
    async def test_simulate_observation(self, agent):
        """Test observation simulation"""
        # Test different actions
        obs_1 = await agent._simulate_observation("test task", "analyze_task")
        assert isinstance(obs_1, str)
        assert "analyzed" in obs_1.lower() or "task" in obs_1.lower()

        obs_2 = await agent._simulate_observation("test task", "synthesize_answer")
        assert "ANSWER:" in obs_2.upper()

    @pytest.mark.asyncio
    async def test_generate_reasoning_steps(self, agent, sample_tasks):
        """Test reasoning steps generation"""
        steps = await agent._generate_reasoning_steps(
            task=sample_tasks[0],
            past_trajectories=[]
        )

        assert isinstance(steps, list)
        assert len(steps) > 0
        assert all(isinstance(step, ReasoningStep) for step in steps)

        # Verify step structure
        for step in steps:
            assert hasattr(step, 'thought')
            assert hasattr(step, 'action')
            assert hasattr(step, 'observation')
            assert hasattr(step, 'reward')

    @pytest.mark.asyncio
    async def test_train_episode_basic(self, agent, sample_tasks):
        """Test basic episode training"""
        trajectory = await agent.train_episode(
            task=sample_tasks[0],
            user_id="test_user",
            use_memory=False
        )

        assert isinstance(trajectory, TrainingTrajectory)
        assert trajectory.trajectory_id is not None
        assert trajectory.task_description == sample_tasks[0]
        assert len(trajectory.reasoning_steps) > 0
        assert isinstance(trajectory.success, bool)
        assert isinstance(trajectory.total_reward, float)
        assert trajectory.duration_seconds >= 0

    @pytest.mark.asyncio
    async def test_train_episode_increments_counter(self, agent, sample_tasks):
        """Test episode counter increments"""
        initial_count = agent.episode_count

        await agent.train_episode(
            task=sample_tasks[0],
            user_id="test_user",
            use_memory=False
        )

        assert agent.episode_count == initial_count + 1

    @pytest.mark.asyncio
    async def test_store_training_trajectory(self, agent):
        """Test storing training trajectory (without actual memory)"""
        # Create mock trajectory
        trajectory = TrainingTrajectory(
            trajectory_id="test_traj_1",
            task_description="test task",
            reasoning_steps=[
                ReasoningStep(
                    step_id="step_1",
                    thought="thinking",
                    action="analyze",
                    observation="analyzed",
                    reward=0.5
                )
            ],
            final_answer="test answer",
            success=True,
            total_reward=0.5,
            duration_seconds=1.0,
            created_at=datetime.now(timezone.utc)
        )

        await agent.store_training_trajectory(
            user_id="test_user",
            trajectory=trajectory
        )

        # Verify stats (without memory, storage is logged but skipped)
        stats = agent.get_stats()
        assert stats['business_id'] == "test"

    @pytest.mark.asyncio
    async def test_recall_training_trajectories(self, agent):
        """Test recalling training trajectories (without actual memory)"""
        trajectories = await agent.recall_training_trajectories(
            user_id="test_user",
            task_type="math",
            top_k=5
        )

        # Without memory, should return empty list
        assert isinstance(trajectories, list)
        assert len(trajectories) == 0

    @pytest.mark.asyncio
    async def test_store_performance_metrics(self, agent):
        """Test storing performance metrics"""
        metrics = TrainingMetrics(
            total_episodes=10,
            successful_episodes=7,
            failed_episodes=3,
            success_rate=0.7,
            avg_reward=0.65,
            avg_steps_per_episode=4.2,
            avg_training_time=1.5,
            best_reward=0.95,
            worst_reward=0.25
        )

        await agent.store_performance_metrics(
            user_id="test_user",
            metrics=metrics
        )

        # Verify stats
        stats = agent.get_stats()
        assert stats['session_id'] is not None

    @pytest.mark.asyncio
    async def test_recall_training_benchmarks(self, agent):
        """Test recalling training benchmarks"""
        benchmarks = await agent.recall_training_benchmarks(
            user_id="test_user",
            top_k=10
        )

        # Without memory, should return empty list
        assert isinstance(benchmarks, list)
        assert len(benchmarks) == 0

    @pytest.mark.asyncio
    async def test_train_batch(self, agent, sample_tasks):
        """Test batch training"""
        # Train on subset of tasks
        batch_tasks = sample_tasks[:3]

        trajectories, metrics = await agent.train_batch(
            tasks=batch_tasks,
            user_id="test_user",
            use_memory=False
        )

        # Verify trajectories
        assert isinstance(trajectories, list)
        assert len(trajectories) == len(batch_tasks)
        assert all(isinstance(t, TrainingTrajectory) for t in trajectories)

        # Verify metrics
        assert isinstance(metrics, TrainingMetrics)
        assert metrics.total_episodes == len(batch_tasks)
        assert metrics.successful_episodes + metrics.failed_episodes == metrics.total_episodes
        assert 0 <= metrics.success_rate <= 1.0
        assert metrics.avg_steps_per_episode >= 0

    def test_get_stats(self, agent):
        """Test getting agent statistics"""
        stats = agent.get_stats()

        assert 'session_id' in stats
        assert 'business_id' in stats
        assert 'memory_enabled' in stats
        assert 'episode_count' in stats
        assert 'config' in stats
        assert 'stats' in stats

        assert stats['business_id'] == "test"
        assert stats['memory_enabled'] is False
        assert stats['episode_count'] == 0

    @pytest.mark.asyncio
    async def test_end_to_end_training_workflow(self, agent, sample_tasks):
        """Test complete training workflow"""
        # Step 1: Train batch
        batch_tasks = sample_tasks[:2]
        trajectories, metrics = await agent.train_batch(
            tasks=batch_tasks,
            user_id="test_user",
            use_memory=False
        )

        # Verify training
        assert len(trajectories) == len(batch_tasks)

        # Step 2: Store metrics
        await agent.store_performance_metrics("test_user", metrics)

        # Step 3: Store successful trajectories
        for traj in trajectories:
            if traj.success:
                await agent.store_training_trajectory("test_user", traj)

        # Verify workflow completion
        final_stats = agent.get_stats()
        assert final_stats['episode_count'] == len(batch_tasks)


class TestReActMemoryIntegration:
    """Test memory integration features"""

    @pytest.fixture
    def agent_memory(self):
        """Create agent with memory for integration tests"""
        return create_react_training_agent(
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
    async def test_train_with_memory_guidance(self, agent_memory):
        """Test training with memory-guided approach"""
        if not agent_memory.memory:
            pytest.skip("Memory not available")

        # Train episode with memory
        trajectory = await agent_memory.train_episode(
            task="Solve 10 + 5",
            user_id="integration_user",
            use_memory=True
        )

        assert isinstance(trajectory, TrainingTrajectory)
        assert trajectory.trajectory_id is not None

    @pytest.mark.asyncio
    @pytest.mark.integration
    async def test_store_and_recall_trajectory_with_memory(self, agent_memory):
        """Test storing and recalling trajectories with actual memory"""
        if not agent_memory.memory:
            pytest.skip("Memory not available")

        # Create and store trajectory
        trajectory = TrainingTrajectory(
            trajectory_id="integration_test_traj",
            task_description="integration test task",
            reasoning_steps=[
                ReasoningStep(
                    step_id="step_1",
                    thought="test thought",
                    action="test_action",
                    observation="test observation",
                    reward=0.8
                )
            ],
            final_answer="test answer",
            success=True,
            total_reward=0.8,
            duration_seconds=1.0,
            created_at=datetime.now(timezone.utc)
        )

        await agent_memory.store_training_trajectory(
            user_id="integration_user",
            trajectory=trajectory
        )

        # Recall trajectories
        trajectories = await agent_memory.recall_training_trajectories(
            user_id="integration_user",
            top_k=5
        )

        # Verify recall (may be empty if memory backend not available)
        assert isinstance(trajectories, list)

    @pytest.mark.asyncio
    @pytest.mark.integration
    async def test_full_workflow_with_memory(self, agent_memory):
        """Test complete workflow with memory integration"""
        if not agent_memory.memory:
            pytest.skip("Memory not available")

        # Sample tasks
        tasks = [
            "Calculate 7 * 8",
            "Write a function to add two numbers"
        ]

        # Train with memory
        trajectories, metrics = await agent_memory.train_batch(
            tasks=tasks,
            user_id="integration_user",
            use_memory=True
        )

        # Store metrics
        await agent_memory.store_performance_metrics("integration_user", metrics)

        # Recall benchmarks
        benchmarks = await agent_memory.recall_training_benchmarks(
            user_id="integration_user",
            top_k=5
        )

        # Verify workflow
        assert isinstance(trajectories, list)
        assert len(trajectories) == len(tasks)
        assert isinstance(benchmarks, list)


def test_import():
    """Test that agent can be imported"""
    from agents.react_training_agent import ReActTrainingAgent
    assert ReActTrainingAgent is not None


if __name__ == "__main__":
    # Run basic tests
    pytest.main([__file__, "-v", "-m", "not integration"])
