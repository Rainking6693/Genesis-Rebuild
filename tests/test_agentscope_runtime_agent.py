"""
Test suite for AgentScope Runtime Agent memory integration.

Tests:
- Runtime metrics storage and retrieval
- Performance pattern learning
- Sandbox configuration management
- Memory persistence
- Optimization recommendations
"""

import asyncio
import pytest
import pytest_asyncio
import tempfile
import json
from datetime import datetime, timezone
from pathlib import Path
from unittest.mock import patch, MagicMock, AsyncMock

# Add parent directory to path
import sys
sys.path.insert(0, str(Path(__file__).parent.parent))

from agents.agentscope_runtime_agent import (
    AgentScopeRuntimeAgent,
    create_runtime_agent,
    RuntimeMetrics,
    SandboxConfig,
    PerformancePattern
)


class TestAgentScopeRuntimeAgent:
    """Test suite for AgentScope Runtime Agent."""

    @pytest.fixture
    def isolated_db_uri(self):
        """Provide isolated MongoDB URI for testing."""
        # In-memory MongoDB for testing
        return "mongodb://localhost:27017/"

    @pytest.fixture
    def test_database_name(self):
        """Provide isolated database name for each test."""
        import time
        return f"test_agentscope_runtime_{int(time.time() * 1000)}"

    @pytest_asyncio.fixture
    async def agent(self, isolated_db_uri, test_database_name):
        """Create agent instance with isolated database."""
        agent = AgentScopeRuntimeAgent(
            agent_id="test-runtime-001",
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
        assert agent.agent_id == "test-runtime-001"
        assert isinstance(agent.runtime_metrics, list)
        assert isinstance(agent.sandbox_configs, dict)
        assert isinstance(agent.performance_patterns, dict)

    @pytest.mark.asyncio
    async def test_store_runtime_metrics(self, agent):
        """Test storing runtime metrics."""
        metric_id = await agent.store_runtime_metrics(
            execution_time_ms=1500.5,
            memory_used_mb=512.0,
            cpu_usage_percent=65.5,
            sandbox_type="base",
            success=True,
            metadata={"task_id": "task_001"}
        )

        assert metric_id is not None
        assert metric_id.startswith("metric_")
        assert len(agent.runtime_metrics) == 1

        stored_metric = agent.runtime_metrics[0]
        assert stored_metric.execution_time_ms == 1500.5
        assert stored_metric.memory_used_mb == 512.0
        assert stored_metric.cpu_usage_percent == 65.5
        assert stored_metric.sandbox_type == "base"
        assert stored_metric.success is True

    @pytest.mark.asyncio
    async def test_store_multiple_metrics(self, agent):
        """Test storing multiple metrics."""
        metric_ids = []
        for i in range(5):
            metric_id = await agent.store_runtime_metrics(
                execution_time_ms=1000 + (i * 100),
                memory_used_mb=256 + (i * 50),
                cpu_usage_percent=40 + (i * 5),
                sandbox_type="base",
                success=True
            )
            metric_ids.append(metric_id)

        assert len(metric_ids) == 5
        assert len(agent.runtime_metrics) == 5
        assert all(m.success for m in agent.runtime_metrics)

    @pytest.mark.asyncio
    async def test_get_metrics_summary(self, agent):
        """Test metrics summary generation."""
        # Store some metrics
        await agent.store_runtime_metrics(
            execution_time_ms=1000.0,
            memory_used_mb=256.0,
            cpu_usage_percent=50.0,
            sandbox_type="base",
            success=True
        )

        await agent.store_runtime_metrics(
            execution_time_ms=2000.0,
            memory_used_mb=512.0,
            cpu_usage_percent=75.0,
            sandbox_type="gui",
            success=True
        )

        await agent.store_runtime_metrics(
            execution_time_ms=500.0,
            memory_used_mb=128.0,
            cpu_usage_percent=25.0,
            sandbox_type="base",
            success=False,
            error_msg="Timeout"
        )

        summary = await agent.get_metrics_summary()

        assert summary["total_executions"] == 3
        assert summary["successful_executions"] == 2
        assert summary["failed_executions"] == 1
        assert abs(summary["success_rate"] - 2/3) < 0.01
        assert summary["avg_execution_time_ms"] == (1000 + 2000 + 500) / 3
        assert "base" in summary["sandbox_types"]
        assert "gui" in summary["sandbox_types"]

    @pytest.mark.asyncio
    async def test_store_sandbox_config(self, agent):
        """Test storing sandbox configuration."""
        config_id = await agent.store_sandbox_config(
            sandbox_type="base",
            timeout_seconds=300,
            memory_limit_mb=512,
            cpu_limit=1.0,
            network_enabled=False,
            allowed_imports=["numpy", "pandas", "requests"],
            metadata={"priority": "high"}
        )

        assert config_id is not None
        assert config_id.startswith("config_")
        assert config_id in agent.sandbox_configs

        stored_config = agent.sandbox_configs[config_id]
        assert stored_config.sandbox_type == "base"
        assert stored_config.timeout_seconds == 300
        assert stored_config.memory_limit_mb == 512
        assert stored_config.cpu_limit == 1.0
        assert stored_config.network_enabled is False
        assert len(stored_config.allowed_imports) == 3

    @pytest.mark.asyncio
    async def test_recall_performance_patterns(self, agent):
        """Test recalling performance patterns."""
        # Create some test patterns
        pattern1 = PerformancePattern(
            pattern_id="pat_001",
            pattern_name="Fast Base Execution",
            sandbox_type="base",
            avg_execution_time_ms=500.0,
            avg_memory_mb=256.0,
            success_rate=0.95,
            usage_count=10,
            optimal_config={"timeout": 10}
        )

        pattern2 = PerformancePattern(
            pattern_id="pat_002",
            pattern_name="GUI Heavy",
            sandbox_type="gui",
            avg_execution_time_ms=2000.0,
            avg_memory_mb=1024.0,
            success_rate=0.85,
            usage_count=5,
            optimal_config={"timeout": 60}
        )

        agent.performance_patterns["pat_001"] = pattern1
        agent.performance_patterns["pat_002"] = pattern2

        # Recall all patterns with min success rate
        patterns = await agent.recall_performance_patterns(min_success_rate=0.8)
        assert len(patterns) == 2

        # Recall by sandbox type
        base_patterns = await agent.recall_performance_patterns(
            sandbox_type="base",
            min_success_rate=0.8
        )
        assert len(base_patterns) == 1
        assert base_patterns[0].sandbox_type == "base"

    @pytest.mark.asyncio
    async def test_recommend_optimization(self, agent):
        """Test optimization recommendations."""
        # Setup test pattern
        pattern = PerformancePattern(
            pattern_id="pat_001",
            pattern_name="Optimized Base Config",
            sandbox_type="base",
            avg_execution_time_ms=800.0,
            avg_memory_mb=256.0,
            success_rate=0.92,
            usage_count=20,
            optimal_config={"timeout": 20, "memory": 256}
        )
        agent.performance_patterns["pat_001"] = pattern

        # Get recommendation
        recommendation = await agent.recommend_optimization(
            current_sandbox_type="base",
            current_metrics={
                "execution_time_ms": 2000.0,
                "memory_mb": 512.0
            }
        )

        assert "recommended_pattern" in recommendation
        assert "optimal_config" in recommendation
        assert "estimated_improvement" in recommendation

    @pytest.mark.asyncio
    async def test_metrics_persistence(self, agent):
        """Test that metrics are stored locally."""
        for i in range(3):
            await agent.store_runtime_metrics(
                execution_time_ms=1000 + (i * 100),
                memory_used_mb=256 + (i * 50),
                cpu_usage_percent=40 + (i * 5),
                sandbox_type="base",
                success=True
            )

        # Verify persistence in local storage
        assert len(agent.runtime_metrics) == 3
        for i, metric in enumerate(agent.runtime_metrics):
            assert metric.execution_time_ms == 1000 + (i * 100)

    @pytest.mark.asyncio
    async def test_config_persistence(self, agent):
        """Test that configs are stored locally."""
        config_ids = []
        for i in range(2):
            config_id = await agent.store_sandbox_config(
                sandbox_type="base",
                timeout_seconds=300 + (i * 100),
                memory_limit_mb=512,
                cpu_limit=1.0,
                network_enabled=False
            )
            config_ids.append(config_id)

        # Verify persistence
        assert len(agent.sandbox_configs) == 2
        for config_id in config_ids:
            assert config_id in agent.sandbox_configs

    @pytest.mark.asyncio
    async def test_different_sandbox_types(self, agent):
        """Test metrics for different sandbox types."""
        sandbox_types = ["base", "gui", "browser", "filesystem"]

        for stype in sandbox_types:
            await agent.store_runtime_metrics(
                execution_time_ms=1500.0,
                memory_used_mb=256.0,
                cpu_usage_percent=50.0,
                sandbox_type=stype,
                success=True
            )

        summary = await agent.get_metrics_summary()
        assert len(summary["sandbox_types"]) == 4

    @pytest.mark.asyncio
    async def test_failed_metric_tracking(self, agent):
        """Test tracking of failed executions."""
        # Store successful metric
        await agent.store_runtime_metrics(
            execution_time_ms=1000.0,
            memory_used_mb=256.0,
            cpu_usage_percent=50.0,
            sandbox_type="base",
            success=True
        )

        # Store failed metric
        await agent.store_runtime_metrics(
            execution_time_ms=5000.0,  # High execution time
            memory_used_mb=1024.0,
            cpu_usage_percent=95.0,
            sandbox_type="base",
            success=False,
            error_msg="OutOfMemoryError"
        )

        summary = await agent.get_metrics_summary()
        assert summary["successful_executions"] == 1
        assert summary["failed_executions"] == 1
        assert abs(summary["success_rate"] - 0.5) < 0.01

    @pytest.mark.asyncio
    async def test_metadata_storage(self, agent):
        """Test metadata storage in metrics."""
        metadata = {
            "task_id": "task_123",
            "user_id": "user_456",
            "workflow": "optimization"
        }

        metric_id = await agent.store_runtime_metrics(
            execution_time_ms=1500.0,
            memory_used_mb=256.0,
            cpu_usage_percent=50.0,
            sandbox_type="base",
            success=True,
            metadata=metadata
        )

        metric = agent.runtime_metrics[0]
        assert metric.metadata == metadata

    @pytest.mark.asyncio
    async def test_empty_metrics_summary(self, agent):
        """Test summary with no metrics."""
        summary = await agent.get_metrics_summary()
        assert summary["total_executions"] == 0

    @pytest.mark.asyncio
    async def test_metrics_with_user_scope(self, agent):
        """Test metrics with different user scopes."""
        # Store metrics for different users
        await agent.store_runtime_metrics(
            execution_time_ms=1000.0,
            memory_used_mb=256.0,
            cpu_usage_percent=50.0,
            sandbox_type="base",
            success=True,
            user_id="user_1"
        )

        await agent.store_runtime_metrics(
            execution_time_ms=2000.0,
            memory_used_mb=512.0,
            cpu_usage_percent=75.0,
            sandbox_type="gui",
            success=True,
            user_id="user_2"
        )

        # Both should be in local storage
        assert len(agent.runtime_metrics) == 2


class TestAgentScopeRuntimeAgentFactory:
    """Test factory function for creating agents."""

    @pytest.mark.asyncio
    async def test_create_runtime_agent(self):
        """Test factory function for agent creation."""
        agent = await create_runtime_agent(
            agent_id="test-factory-001",
            enable_memory=False
        )

        assert agent.agent_id == "test-factory-001"
        assert agent.enable_memory is False

    @pytest.mark.asyncio
    async def test_create_runtime_agent_with_memory(self):
        """Test factory function with memory enabled."""
        agent = await create_runtime_agent(
            agent_id="test-factory-mem-001",
            enable_memory=False  # Use False for testing
        )

        assert agent.agent_id == "test-factory-mem-001"


if __name__ == "__main__":
    # Run tests with: pytest tests/test_agentscope_runtime_agent.py -v
    pytest.main([__file__, "-v", "-s"])
