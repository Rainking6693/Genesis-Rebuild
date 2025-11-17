#!/usr/bin/env python3
"""
Integration test for agent self_improve() method compatibility
Tests that agents can call train_epoch with correct parameters
"""
import asyncio
import sys
from pathlib import Path
from unittest.mock import AsyncMock, MagicMock, patch

sys.path.insert(0, str(Path(__file__).parent))


async def test_seo_agent_self_improve():
    """Test SEOAgent.self_improve() method execution."""
    print("\n[TEST] SEOAgent.self_improve() execution...")

    try:
        from agents.seo_agent import SEOAgent
        from infrastructure.agentevolver.curiosity_trainer import TrainingMetrics, TrainingSession
        from datetime import datetime

        # Create agent with self-questioning enabled
        agent = SEOAgent(enable_self_questioning=True)

        # Mock the curiosity_trainer.train_epoch method
        mock_metrics = TrainingMetrics(
            session_id="TEST-001",
            agent_type="seo",
            tasks_executed=5,
            tasks_succeeded=4,
            success_rate=0.8,
            avg_quality_score=75.5,
            total_cost_incurred=1.5,
            cost_per_task=0.3,
            improvement_delta=25.5,
            high_quality_experiences_stored=3,
            timestamp=datetime.now().isoformat(),
            duration_seconds=10.5
        )
        mock_session = TrainingSession(
            session_id="TEST-001",
            agent_type="seo",
            start_time=datetime.now()
        )

        # Patch the actual method call
        agent.curiosity_trainer.train_epoch = AsyncMock(
            return_value=(mock_metrics, mock_session)
        )

        # Call self_improve
        result = await agent.self_improve(num_tasks=5)

        # Verify the call succeeded
        assert result.tasks_executed == 5, f"Expected 5 tasks executed, got {result.tasks_executed}"
        assert result.tasks_succeeded == 4, f"Expected 4 tasks succeeded, got {result.tasks_succeeded}"
        assert result.agent_type == "seo", f"Expected agent_type='seo', got {result.agent_type}"

        # Verify train_epoch was called with correct parameters
        agent.curiosity_trainer.train_epoch.assert_called_once()
        call_kwargs = agent.curiosity_trainer.train_epoch.call_args[1]

        assert "num_tasks" in call_kwargs, "Missing 'num_tasks' parameter in train_epoch call"
        assert "agent_type" in call_kwargs, "Missing 'agent_type' parameter in train_epoch call"
        assert call_kwargs["agent_type"] == "seo", f"Expected agent_type='seo', got {call_kwargs['agent_type']}"
        assert "ap2_budget_remaining" in call_kwargs, "Missing 'ap2_budget_remaining' parameter"
        assert "cost_per_task" in call_kwargs, "Missing 'cost_per_task' parameter"
        assert call_kwargs["cost_per_task"] == 0.3, f"Expected cost_per_task=0.3, got {call_kwargs['cost_per_task']}"
        assert "self_questioning_engine" in call_kwargs, "Missing 'self_questioning_engine' parameter"

        print("  ✓ SEOAgent.self_improve() executed successfully")
        print(f"    - Called train_epoch with: {list(call_kwargs.keys())}")
        print(f"    - Metrics returned: {result.tasks_executed} tasks executed, {result.tasks_succeeded} succeeded")
        return True

    except Exception as e:
        print(f"  ✗ Error: {e}")
        import traceback
        traceback.print_exc()
        return False


async def test_marketing_agent_self_improve():
    """Test MarketingAgent.self_improve() method execution."""
    print("\n[TEST] MarketingAgent.self_improve() execution...")

    try:
        from agents.marketing_agent import MarketingAgent
        from infrastructure.agentevolver.curiosity_trainer import TrainingMetrics, TrainingSession
        from datetime import datetime

        # Create agent with self-questioning enabled
        agent = MarketingAgent(enable_self_questioning=True)

        # Mock the curiosity_trainer.train_epoch method
        mock_metrics = TrainingMetrics(
            session_id="TEST-002",
            agent_type="marketing",
            tasks_executed=5,
            tasks_succeeded=4,
            success_rate=0.8,
            avg_quality_score=78.0,
            total_cost_incurred=2.5,
            cost_per_task=0.5,
            improvement_delta=28.0,
            high_quality_experiences_stored=3,
            timestamp=datetime.now().isoformat(),
            duration_seconds=12.0
        )
        mock_session = TrainingSession(
            session_id="TEST-002",
            agent_type="marketing",
            start_time=datetime.now()
        )

        # Patch the actual method call
        agent.curiosity_trainer.train_epoch = AsyncMock(
            return_value=(mock_metrics, mock_session)
        )

        # Call self_improve
        result = await agent.self_improve(num_tasks=5)

        # Verify the call succeeded
        assert result.agent_type == "marketing", f"Expected agent_type='marketing', got {result.agent_type}"

        # Verify train_epoch was called with correct parameters
        agent.curiosity_trainer.train_epoch.assert_called_once()
        call_kwargs = agent.curiosity_trainer.train_epoch.call_args[1]

        assert call_kwargs["agent_type"] == "marketing", f"Expected agent_type='marketing', got {call_kwargs['agent_type']}"
        assert call_kwargs["cost_per_task"] == 0.5, f"Expected cost_per_task=0.5, got {call_kwargs['cost_per_task']}"

        print("  ✓ MarketingAgent.self_improve() executed successfully")
        print(f"    - Called train_epoch with agent_type='marketing', cost_per_task=0.5")
        print(f"    - Metrics returned: {result.tasks_executed} tasks executed")
        return True

    except Exception as e:
        print(f"  ✗ Error: {e}")
        import traceback
        traceback.print_exc()
        return False


async def test_content_agent_self_improve():
    """Test ContentAgent.self_improve() method execution."""
    print("\n[TEST] ContentAgent.self_improve() execution...")

    try:
        from agents.content_agent import ContentAgent
        from infrastructure.agentevolver.curiosity_trainer import TrainingMetrics, TrainingSession
        from datetime import datetime

        # Create agent with self-questioning enabled
        agent = ContentAgent(enable_self_questioning=True)

        # Mock the curiosity_trainer.train_epoch method
        mock_metrics = TrainingMetrics(
            session_id="TEST-003",
            agent_type="content",
            tasks_executed=5,
            tasks_succeeded=4,
            success_rate=0.8,
            avg_quality_score=76.5,
            total_cost_incurred=2.0,
            cost_per_task=0.4,
            improvement_delta=26.5,
            high_quality_experiences_stored=3,
            timestamp=datetime.now().isoformat(),
            duration_seconds=11.0
        )
        mock_session = TrainingSession(
            session_id="TEST-003",
            agent_type="content",
            start_time=datetime.now()
        )

        # Patch the actual method call
        agent.curiosity_trainer.train_epoch = AsyncMock(
            return_value=(mock_metrics, mock_session)
        )

        # Call self_improve
        result = await agent.self_improve(num_tasks=5)

        # Verify the call succeeded
        assert result.agent_type == "content", f"Expected agent_type='content', got {result.agent_type}"

        # Verify train_epoch was called with correct parameters
        agent.curiosity_trainer.train_epoch.assert_called_once()
        call_kwargs = agent.curiosity_trainer.train_epoch.call_args[1]

        assert call_kwargs["agent_type"] == "content", f"Expected agent_type='content', got {call_kwargs['agent_type']}"
        assert call_kwargs["cost_per_task"] == 0.4, f"Expected cost_per_task=0.4, got {call_kwargs['cost_per_task']}"

        print("  ✓ ContentAgent.self_improve() executed successfully")
        print(f"    - Called train_epoch with agent_type='content', cost_per_task=0.4")
        print(f"    - Metrics returned: {result.tasks_executed} tasks executed")
        return True

    except Exception as e:
        print(f"  ✗ Error: {e}")
        import traceback
        traceback.print_exc()
        return False


async def main():
    """Run all integration tests."""
    print("=" * 80)
    print("AGENT SELF_IMPROVE() INTEGRATION TEST")
    print("=" * 80)

    results = []
    results.append(await test_seo_agent_self_improve())
    results.append(await test_marketing_agent_self_improve())
    results.append(await test_content_agent_self_improve())

    print("\n" + "=" * 80)
    if all(results):
        print("INTEGRATION TEST RESULT: PASS - All agents can call self_improve()")
        print("=" * 80)
        return 0
    else:
        print("INTEGRATION TEST RESULT: FAIL - Some tests failed")
        print("=" * 80)
        return 1


if __name__ == "__main__":
    exit_code = asyncio.run(main())
    sys.exit(exit_code)
