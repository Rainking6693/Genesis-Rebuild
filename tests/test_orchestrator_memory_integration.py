"""
Test Suite for AOP Orchestrator Memory Integration
===================================================

Tests the memory integration in GenesisOrchestrator including:
- MemoryTool workflow storage and retrieval
- CompactionService session management
- Workflow pattern learning
- Task success metrics tracking

Version: 1.0
Created: November 13, 2025
"""

import asyncio
import os
import tempfile
import uuid
import pytest
from datetime import datetime, timezone
from pathlib import Path

from infrastructure.memory.orchestrator_memory_tool import MemoryTool, get_memory_tool
from infrastructure.memory.compaction_service import CompactionService, get_compaction_service
from infrastructure.memory.memori_client import MemoriClient


class TestMemoryToolBasics:
    """Test basic MemoryTool functionality"""

    @pytest.mark.asyncio
    async def test_store_and_retrieve_workflow(self, isolated_memori_client, unique_namespace):
        """Test storing and retrieving workflow patterns"""
        memory = MemoryTool(client=isolated_memori_client, namespace=unique_namespace)

        # Store a successful workflow
        await memory.store_workflow(
            task_type="code_generation",
            workflow_steps=["decompose", "route", "validate", "execute"],
            success=True,
            duration=45.2,
            session_id="test_session_001"
        )

        # Retrieve workflow patterns
        patterns = await memory.retrieve_workflow_patterns(
            task_type="code_generation",
            min_success_rate=0.0
        )

        assert len(patterns) > 0, "Should retrieve at least one pattern"
        assert patterns[0].task_type == "code_generation"

    @pytest.mark.asyncio
    async def test_task_success_metrics(self, isolated_memori_client, unique_namespace):
        """Test task success metrics calculation"""
        memory = MemoryTool(client=isolated_memori_client, namespace=unique_namespace)

        # Store multiple workflow executions
        for i in range(10):
            success = i < 8  # 80% success rate
            await memory.store_workflow(
                task_type="data_analysis",
                workflow_steps=["load", "process", "analyze"],
                success=success,
                duration=30.0 + i,
                session_id=f"test_session_{i:03d}"
            )

        # Get metrics
        metrics = await memory.get_task_success_metrics("data_analysis")

        assert metrics.total_executions == 10
        assert metrics.successful_executions == 8
        assert metrics.success_rate == 0.8
        assert metrics.avg_duration > 0

    @pytest.mark.asyncio
    async def test_get_best_workflow(self, isolated_memori_client, unique_namespace):
        """Test retrieving best-performing workflow"""
        memory = MemoryTool(client=isolated_memori_client, namespace=unique_namespace)

        # Store workflows with different success rates
        for i in range(5):
            success = i >= 3  # Last 2 are successful
            await memory.store_workflow(
                task_type="testing",
                workflow_steps=["setup", "run", "teardown"],
                success=success,
                duration=20.0,
                session_id=f"test_session_{i:03d}"
            )

        # Get best workflow
        best = await memory.get_best_workflow_for_task(
            task_type="testing",
            optimization_target="success_rate"
        )

        assert best is not None
        assert best.task_type == "testing"


class TestCompactionService:
    """Test CompactionService functionality"""

    @pytest.mark.asyncio
    async def test_session_compaction(self, isolated_memori_client, unique_namespace):
        """Test session compaction and pattern extraction"""
        memory = MemoryTool(client=isolated_memori_client, namespace=unique_namespace)
        compaction = CompactionService(client=isolated_memori_client)

        session_id = "compaction_test_session_001"

        # Store multiple workflows in a session
        for i in range(5):
            await memory.store_workflow(
                task_type="deployment",
                workflow_steps=["build", "test", "deploy"],
                success=True,
                duration=60.0,
                session_id=session_id
            )

        # Compact session
        metrics = await compaction.compact_session(
            session_id=session_id,
            namespace=unique_namespace,
            extract_patterns=True
        )

        assert metrics.session_id == session_id
        assert metrics.num_memories == 5
        assert metrics.compression_ratio >= 0.0
        assert metrics.num_patterns_extracted >= 0

    @pytest.mark.asyncio
    async def test_pattern_extraction(self, isolated_memori_client, unique_namespace):
        """Test workflow pattern extraction from session"""
        memory = MemoryTool(client=isolated_memori_client, namespace=unique_namespace)
        compaction = CompactionService(client=isolated_memori_client)

        session_id = "pattern_test_session_001"

        # Store workflows with consistent patterns
        for i in range(10):
            await memory.store_workflow(
                task_type="code_generation",
                workflow_steps=["parse", "analyze", "generate", "validate"],
                success=True,
                duration=30.0,
                session_id=session_id
            )

        # Compact and extract patterns
        await compaction.compact_session(
            session_id=session_id,
            namespace=unique_namespace,
            extract_patterns=True
        )

        # Retrieve extracted patterns (BUG-005 FIX: pass matching namespace)
        patterns = await compaction.get_session_patterns(
            session_id=session_id,
            namespace=unique_namespace
        )

        assert len(patterns) > 0, "Should extract at least one pattern"
        assert patterns[0]["task_type"] == "code_generation"
        assert patterns[0]["success_rate"] == 1.0  # All successful


class TestOrchestratorIntegration:
    """Test integration with GenesisOrchestrator"""

    def test_orchestrator_initialization(self):
        """Test that orchestrator initializes with memory tools"""
        # Import here to avoid initialization issues
        from genesis_orchestrator import GenesisOrchestrator

        orchestrator = GenesisOrchestrator()

        # Verify memory tools are initialized
        assert orchestrator.memory is not None, "MemoryTool should be initialized"
        assert orchestrator.compaction is not None, "CompactionService should be initialized"

    def test_task_type_inference(self):
        """Test task type inference from user request"""
        from genesis_orchestrator import GenesisOrchestrator

        orchestrator = GenesisOrchestrator()

        # Test various request types
        assert orchestrator._infer_task_type("Write a function to calculate factorial") == "code_generation"
        assert orchestrator._infer_task_type("Analyze this dataset for trends") == "data_analysis"
        assert orchestrator._infer_task_type("Write unit tests for this module") == "testing"
        assert orchestrator._infer_task_type("Deploy the application to production") == "deployment"
        assert orchestrator._infer_task_type("Fix this bug in the authentication") == "debugging"
        assert orchestrator._infer_task_type("Design a scalable microservices architecture") == "system_design"
        assert orchestrator._infer_task_type("Create documentation for this API") == "documentation"
        assert orchestrator._infer_task_type("Optimize database query performance") == "optimization"
        assert orchestrator._infer_task_type("Hello world") == "general"


# Pytest fixtures
@pytest.fixture(scope="function")
def isolated_memori_client():
    """Create isolated MemoriClient for each test with unique database"""
    # Create temp directory for test database
    temp_dir = tempfile.mkdtemp(prefix="test_memori_")
    db_path = Path(temp_dir) / f"test_{uuid.uuid4().hex}.db"

    # Create isolated client
    client = MemoriClient(db_path=str(db_path))

    yield client

    # Cleanup: Close and delete database
    client.close()
    if db_path.exists():
        db_path.unlink()
    Path(temp_dir).rmdir()


@pytest.fixture(scope="function")
def unique_namespace():
    """Generate unique namespace for each test"""
    return f"test_{uuid.uuid4().hex[:8]}"


if __name__ == "__main__":
    # Run tests directly
    pytest.main([__file__, "-v", "-s"])
