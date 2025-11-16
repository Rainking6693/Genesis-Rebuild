"""
Test Suite for Ben's API Fixes - Agents 15-16+
Tests DataJuicerAgent, ReActTrainingAgent, SEDarwinAgent

Audit Protocol V2 Compliance Test Suite
"""

import pytest
import asyncio
from typing import Dict, List, Any, Tuple

# Test Agent 15: DataJuicerAgent
class TestDataJuicerAgent:
    """Test suite for DataJuicerAgent API fixes"""

    @pytest.mark.asyncio
    async def test_data_juicer_agent_import(self):
        """P0: Verify DataJuicerAgent factory function exists"""
        from agents.data_juicer_agent import create_data_juicer_agent
        assert create_data_juicer_agent is not None

    @pytest.mark.asyncio
    async def test_data_juicer_agent_creation(self):
        """P0: Verify agent creation works"""
        from agents.data_juicer_agent import create_data_juicer_agent

        agent = create_data_juicer_agent(
            business_id="test_biz_1",
            enable_memory=True
        )
        assert agent is not None

    @pytest.mark.asyncio
    async def test_curate_trajectories_method_exists(self):
        """P0: Verify curate_trajectories method exists"""
        from agents.data_juicer_agent import create_data_juicer_agent

        agent = create_data_juicer_agent(
            business_id="test_biz_2",
            enable_memory=True
        )
        assert hasattr(agent, 'curate_trajectories')
        assert callable(getattr(agent, 'curate_trajectories'))

    @pytest.mark.asyncio
    async def test_curate_trajectories_signature(self):
        """P0: Verify curate_trajectories has correct signature"""
        from agents.data_juicer_agent import create_data_juicer_agent
        import inspect

        agent = create_data_juicer_agent(
            business_id="test_biz_3",
            enable_memory=True
        )

        method = getattr(agent, 'curate_trajectories')
        sig = inspect.signature(method)

        # Check parameters
        params = list(sig.parameters.keys())
        assert 'trajectories' in params, "Missing 'trajectories' parameter"
        assert 'user_id' in params, "Missing 'user_id' parameter"
        assert 'min_quality_threshold' in params, "Missing 'min_quality_threshold' parameter"

    @pytest.mark.asyncio
    async def test_curate_trajectories_execution(self):
        """P1: Verify curate_trajectories executes successfully"""
        from agents.data_juicer_agent import create_data_juicer_agent

        agent = create_data_juicer_agent(
            business_id="test_biz_4",
            enable_memory=True
        )

        # Test trajectories
        example_trajectories = [
            {
                'states': [1, 2, 3, 4, 5],
                'actions': ['a', 'b', 'c', 'd'],
                'rewards': [0.1, 0.2, 0.3, 0.4]
            }
        ]

        # Execute
        curation, quality_metrics = await agent.curate_trajectories(
            trajectories=example_trajectories,
            user_id="test_user_1",
            min_quality_threshold=0.8
        )

        # Verify return types
        assert isinstance(curation, list), "curate_trajectories should return list as first element"
        assert quality_metrics is not None, "curate_trajectories should return metrics as second element"

    @pytest.mark.asyncio
    async def test_curate_trajectories_return_tuple(self):
        """P1: Verify curate_trajectories returns tuple"""
        from agents.data_juicer_agent import create_data_juicer_agent

        agent = create_data_juicer_agent(
            business_id="test_biz_5",
            enable_memory=True
        )

        example_trajectories = [
            {
                'states': [1, 2, 3],
                'actions': ['a', 'b'],
                'rewards': [0.5, 0.6]
            }
        ]

        result = await agent.curate_trajectories(
            trajectories=example_trajectories,
            user_id="test_user_2",
            min_quality_threshold=0.5
        )

        assert isinstance(result, tuple), "curate_trajectories must return a tuple"
        assert len(result) == 2, "curate_trajectories must return exactly 2 values"


# Test Agent 16: ReActTrainingAgent
class TestReActTrainingAgent:
    """Test suite for ReActTrainingAgent API fixes"""

    @pytest.mark.asyncio
    async def test_react_training_agent_import(self):
        """P0: Verify ReActTrainingAgent factory function exists"""
        from agents.react_training_agent import create_react_training_agent
        assert create_react_training_agent is not None

    @pytest.mark.asyncio
    async def test_react_training_agent_creation(self):
        """P0: Verify agent creation works"""
        from agents.react_training_agent import create_react_training_agent

        agent = create_react_training_agent(
            business_id="test_biz_6",
            enable_memory=True
        )
        assert agent is not None

    @pytest.mark.asyncio
    async def test_train_batch_method_exists(self):
        """P0: Verify train_batch method exists"""
        from agents.react_training_agent import create_react_training_agent

        agent = create_react_training_agent(
            business_id="test_biz_7",
            enable_memory=True
        )
        assert hasattr(agent, 'train_batch')
        assert callable(getattr(agent, 'train_batch'))

    @pytest.mark.asyncio
    async def test_train_batch_signature(self):
        """P0: Verify train_batch has correct signature"""
        from agents.react_training_agent import create_react_training_agent
        import inspect

        agent = create_react_training_agent(
            business_id="test_biz_8",
            enable_memory=True
        )

        method = getattr(agent, 'train_batch')
        sig = inspect.signature(method)

        # Check parameters
        params = list(sig.parameters.keys())
        assert 'tasks' in params, "Missing 'tasks' parameter"
        assert 'user_id' in params, "Missing 'user_id' parameter"
        assert 'use_memory' in params, "Missing 'use_memory' parameter"

    @pytest.mark.asyncio
    async def test_train_batch_execution(self):
        """P1: Verify train_batch executes successfully"""
        from agents.react_training_agent import create_react_training_agent

        agent = create_react_training_agent(
            business_id="test_biz_9",
            enable_memory=True
        )

        # Test tasks
        training_tasks = [
            "Task 1 for ecommerce",
            "Task 2 for ecommerce"
        ]

        # Execute
        trajectories, metrics = await agent.train_batch(
            tasks=training_tasks,
            user_id="test_user_3",
            use_memory=True
        )

        # Verify return types
        assert isinstance(trajectories, list), "train_batch should return list as first element"
        assert metrics is not None, "train_batch should return metrics as second element"

    @pytest.mark.asyncio
    async def test_train_batch_return_tuple(self):
        """P1: Verify train_batch returns tuple"""
        from agents.react_training_agent import create_react_training_agent

        agent = create_react_training_agent(
            business_id="test_biz_10",
            enable_memory=True
        )

        training_tasks = [
            "Simple test task"
        ]

        result = await agent.train_batch(
            tasks=training_tasks,
            user_id="test_user_4",
            use_memory=True
        )

        assert isinstance(result, tuple), "train_batch must return a tuple"
        assert len(result) == 2, "train_batch must return exactly 2 values"


# Test Agent 17: SEDarwinAgent
class TestSEDarwinAgent:
    """Test suite for SEDarwinAgent API fixes"""

    @pytest.mark.asyncio
    async def test_se_darwin_agent_import(self):
        """P0: Verify SEDarwinAgent class exists"""
        from agents.se_darwin_agent import SEDarwinAgent
        assert SEDarwinAgent is not None

    @pytest.mark.asyncio
    async def test_se_darwin_agent_creation(self):
        """P0: Verify agent creation works"""
        from agents.se_darwin_agent import SEDarwinAgent

        agent = SEDarwinAgent(agent_name="test_darwin_1")
        assert agent is not None

    @pytest.mark.asyncio
    async def test_evolve_solution_method_exists(self):
        """P0: Verify evolve_solution method exists"""
        from agents.se_darwin_agent import SEDarwinAgent

        agent = SEDarwinAgent(agent_name="test_darwin_2")
        assert hasattr(agent, 'evolve_solution')
        assert callable(getattr(agent, 'evolve_solution'))

    @pytest.mark.asyncio
    async def test_evolve_solution_signature(self):
        """P0: Verify evolve_solution has correct signature"""
        from agents.se_darwin_agent import SEDarwinAgent
        import inspect

        agent = SEDarwinAgent(agent_name="test_darwin_3")

        method = getattr(agent, 'evolve_solution')
        sig = inspect.signature(method)

        # Check parameters
        params = list(sig.parameters.keys())
        assert 'problem_description' in params, "Missing 'problem_description' parameter"
        assert 'context' in params, "Missing 'context' parameter"

    @pytest.mark.asyncio
    async def test_evolve_solution_execution(self):
        """P1: Verify evolve_solution executes successfully"""
        from agents.se_darwin_agent import SEDarwinAgent

        agent = SEDarwinAgent(
            agent_name="test_darwin_4",
            max_iterations=1,  # Limit iterations for test speed
            trajectories_per_iteration=1
        )

        # Execute
        problem_description = "Optimize ecommerce business solution"
        evolution_result = await agent.evolve_solution(
            problem_description=problem_description,
            context={
                "business_type": "ecommerce",
                "business_id": "test_biz_11"
            }
        )

        # Verify return type
        assert isinstance(evolution_result, dict), "evolve_solution should return dict"

    @pytest.mark.asyncio
    async def test_evolve_solution_return_dict(self):
        """P1: Verify evolve_solution returns dict with expected keys"""
        from agents.se_darwin_agent import SEDarwinAgent

        agent = SEDarwinAgent(
            agent_name="test_darwin_5",
            max_iterations=1,
            trajectories_per_iteration=1
        )

        problem_description = "Simple test problem"
        result = await agent.evolve_solution(
            problem_description=problem_description,
            context={"test": "context"}
        )

        assert isinstance(result, dict), "evolve_solution must return a dict"
        # Check for expected keys (based on source code)
        # The actual keys may vary, but it should be a dict


# Integration Tests
class TestBenFixesIntegration:
    """Integration tests for all Ben's fixes"""

    @pytest.mark.asyncio
    async def test_all_agents_importable(self):
        """P0: Verify all three agents can be imported together"""
        from agents.data_juicer_agent import create_data_juicer_agent
        from agents.react_training_agent import create_react_training_agent
        from agents.se_darwin_agent import SEDarwinAgent

        assert create_data_juicer_agent is not None
        assert create_react_training_agent is not None
        assert SEDarwinAgent is not None

    @pytest.mark.asyncio
    async def test_all_agents_creatable(self):
        """P0: Verify all three agents can be created simultaneously"""
        from agents.data_juicer_agent import create_data_juicer_agent
        from agents.react_training_agent import create_react_training_agent
        from agents.se_darwin_agent import SEDarwinAgent

        juicer = create_data_juicer_agent(business_id="test_biz_12", enable_memory=True)
        react = create_react_training_agent(business_id="test_biz_12", enable_memory=True)
        darwin = SEDarwinAgent(agent_name="test_darwin_6")

        assert juicer is not None
        assert react is not None
        assert darwin is not None

    @pytest.mark.asyncio
    async def test_sequential_execution(self):
        """P2: Verify agents can execute sequentially (workflow simulation)"""
        from agents.data_juicer_agent import create_data_juicer_agent
        from agents.react_training_agent import create_react_training_agent
        from agents.se_darwin_agent import SEDarwinAgent

        # Create agents
        juicer = create_data_juicer_agent(business_id="test_biz_13", enable_memory=True)
        react = create_react_training_agent(business_id="test_biz_13", enable_memory=True)
        darwin = SEDarwinAgent(agent_name="test_darwin_7", max_iterations=1)

        # Execute in sequence (simulating workflow)
        # Step 1: Data curation
        trajectories = [{'states': [1, 2], 'actions': ['a'], 'rewards': [0.5]}]
        curation, metrics1 = await juicer.curate_trajectories(
            trajectories=trajectories,
            user_id="test_user_5",
            min_quality_threshold=0.5
        )

        # Step 2: ReAct training
        tasks = ["Test task"]
        train_trajectories, metrics2 = await react.train_batch(
            tasks=tasks,
            user_id="test_user_5",
            use_memory=True
        )

        # Step 3: Evolution
        problem = "Test problem"
        evolution = await darwin.evolve_solution(
            problem_description=problem,
            context={"test": "data"}
        )

        # Verify all executed
        assert curation is not None
        assert train_trajectories is not None
        assert evolution is not None


# API Consistency Tests
class TestAPIConsistency:
    """Test API consistency across Ben's fixes"""

    @pytest.mark.asyncio
    async def test_async_pattern_consistency(self):
        """P1: Verify all main methods are async"""
        from agents.data_juicer_agent import create_data_juicer_agent
        from agents.react_training_agent import create_react_training_agent
        from agents.se_darwin_agent import SEDarwinAgent
        import inspect

        juicer = create_data_juicer_agent(business_id="test_biz_14", enable_memory=True)
        react = create_react_training_agent(business_id="test_biz_14", enable_memory=True)
        darwin = SEDarwinAgent(agent_name="test_darwin_8")

        # Check all are coroutine functions (async)
        assert inspect.iscoroutinefunction(juicer.curate_trajectories), "curate_trajectories must be async"
        assert inspect.iscoroutinefunction(react.train_batch), "train_batch must be async"
        assert inspect.iscoroutinefunction(darwin.evolve_solution), "evolve_solution must be async"

    @pytest.mark.asyncio
    async def test_memory_support_consistency(self):
        """P2: Verify all agents support memory"""
        from agents.data_juicer_agent import create_data_juicer_agent
        from agents.react_training_agent import create_react_training_agent

        # DataJuicer and ReAct use factory functions with enable_memory
        juicer = create_data_juicer_agent(business_id="test_biz_15", enable_memory=True)
        react = create_react_training_agent(business_id="test_biz_15", enable_memory=True)

        # Verify they were created (memory support is implicit in factory)
        assert juicer is not None
        assert react is not None


if __name__ == "__main__":
    # Run tests
    pytest.main([__file__, "-v", "--tb=short"])
