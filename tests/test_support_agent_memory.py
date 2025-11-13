"""
Test Suite for Support Agent Memory Integration (Tier 1 - Critical)

Tests comprehensive memory integration including:
- Customer interaction history storage/retrieval
- Common solution knowledge base
- Multimodal screenshot processing with memory
- Integration with respond_to_ticket workflow
"""

import pytest
import asyncio
import json
from datetime import datetime, timezone
from unittest.mock import Mock, AsyncMock, patch, MagicMock

# Import support agent
from agents.support_agent import SupportAgent, MemoryTool


class TestSupportAgentMemoryIntegration:
    """Test Support Agent memory integration features."""

    @pytest.fixture
    def mock_memory_backend(self):
        """Create mock MemoryOS MongoDB backend."""
        mock = Mock()
        mock.store = Mock(return_value="mem_support_test123")
        mock.retrieve = Mock(return_value=[])
        return mock

    @pytest.fixture
    def mock_multimodal_pipeline(self):
        """Create mock MultimodalMemoryPipeline."""
        mock = AsyncMock()
        mock.process_image = AsyncMock(return_value=Mock(
            uri="test.png",
            attachment_type=Mock(value="image"),
            processed_content="Error message detected: Connection timeout",
            error=None,
            processing_time_ms=150.0
        ))
        return mock

    @pytest.fixture
    def support_agent(self, mock_memory_backend, mock_multimodal_pipeline):
        """Create Support Agent with mocked memory components."""
        agent = SupportAgent(business_id="test")

        # Mock memory backend
        agent.memory = mock_memory_backend

        # Mock multimodal pipeline
        agent.multimodal_pipeline = mock_multimodal_pipeline

        # Mock memory tool
        agent.memory_tool = MemoryTool(backend=mock_memory_backend, agent_id="support")

        return agent

    @pytest.mark.asyncio
    async def test_store_customer_interaction(self, support_agent):
        """Test storing customer interaction in memory."""
        # Store customer interaction
        memory_id = await support_agent.store_customer_interaction(
            customer_id="customer_001",
            interaction_type="ticket",
            issue_description="Login failure on mobile app",
            resolution="Reset password and cleared cache",
            satisfaction_score=4.5,
            session_id="session_123"
        )

        # Verify memory was stored
        assert memory_id == "mem_support_test123"

        # Verify store was called with correct parameters
        support_agent.memory.store.assert_called_once()
        call_args = support_agent.memory.store.call_args

        assert call_args.kwargs["agent_id"] == "support"
        assert call_args.kwargs["user_id"] == "customer_001"

        # Verify content structure
        agent_response = call_args.kwargs["agent_response"]
        content = json.loads(agent_response)

        assert content["interaction_type"] == "ticket"
        assert content["issue_description"] == "Login failure on mobile app"
        assert content["resolution"] == "Reset password and cleared cache"
        assert content["satisfaction_score"] == 4.5
        assert content["session_id"] == "session_123"
        assert content["resolved"] is True

    @pytest.mark.asyncio
    async def test_recall_customer_history(self, support_agent):
        """Test recalling customer interaction history."""
        # Mock memory retrieval
        mock_memories = [
            {
                "memory_id": "mem_001",
                "type": "short_term",
                "content": {
                    "agent_response": json.dumps({
                        "interaction_type": "ticket",
                        "issue_description": "Payment failed",
                        "resolution": "Updated payment method",
                        "satisfaction_score": 5.0
                    })
                },
                "heat_score": 2.5,
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "memory_id": "mem_002",
                "type": "mid_term",
                "content": {
                    "agent_response": json.dumps({
                        "interaction_type": "chat",
                        "issue_description": "Feature request",
                        "resolution": "Forwarded to product team",
                        "satisfaction_score": 4.0
                    })
                },
                "heat_score": 1.8,
                "created_at": datetime.now(timezone.utc).isoformat()
            }
        ]

        support_agent.memory.retrieve = Mock(return_value=mock_memories)

        # Recall customer history
        history = await support_agent.recall_customer_history(
            customer_id="customer_001",
            limit=10
        )

        # Verify retrieval
        assert len(history) == 2

        # Check first interaction
        assert history[0]["interaction_type"] == "ticket"
        assert history[0]["issue_description"] == "Payment failed"
        assert history[0]["satisfaction_score"] == 5.0
        assert "memory_id" in history[0]
        assert "heat_score" in history[0]

        # Check second interaction
        assert history[1]["interaction_type"] == "chat"
        assert history[1]["issue_description"] == "Feature request"

    @pytest.mark.asyncio
    async def test_store_common_solution(self, support_agent):
        """Test storing common solution in knowledge base."""
        # Store common solution
        memory_id = await support_agent.store_common_solution(
            issue_type="login_failure",
            solution="1. Clear browser cache\n2. Reset password\n3. Check network connection",
            success_rate=0.87
        )

        # Verify memory was stored
        assert memory_id == "mem_support_test123"

        # Verify store was called
        call_args = support_agent.memory.store.call_args

        assert call_args.kwargs["agent_id"] == "support"
        assert call_args.kwargs["user_id"] == "support_app"  # App scope

        # Verify content
        agent_response = call_args.kwargs["agent_response"]
        content = json.loads(agent_response)

        assert content["issue_type"] == "login_failure"
        assert content["success_rate"] == 0.87
        assert "Clear browser cache" in content["solution"]
        assert content["usage_count"] == 1

    @pytest.mark.asyncio
    async def test_recall_common_solutions(self, support_agent):
        """Test recalling common solutions from knowledge base."""
        # Mock memory retrieval
        mock_solutions = [
            {
                "memory_id": "sol_001",
                "content": {
                    "agent_response": json.dumps({
                        "issue_type": "login_failure",
                        "solution": "Clear cache and cookies",
                        "success_rate": 0.92
                    })
                },
                "heat_score": 5.2
            },
            {
                "memory_id": "sol_002",
                "content": {
                    "agent_response": json.dumps({
                        "issue_type": "login_failure",
                        "solution": "Reset password",
                        "success_rate": 0.85
                    })
                },
                "heat_score": 4.1
            },
            {
                "memory_id": "sol_003",
                "content": {
                    "agent_response": json.dumps({
                        "issue_type": "login_failure",
                        "solution": "Check account status",
                        "success_rate": 0.65  # Below threshold
                    })
                },
                "heat_score": 2.3
            }
        ]

        support_agent.memory.retrieve = Mock(return_value=mock_solutions)

        # Recall common solutions
        solutions = await support_agent.recall_common_solutions(
            issue_type="login_failure",
            min_success_rate=0.7
        )

        # Verify filtering and sorting
        assert len(solutions) == 2  # One filtered out by success rate

        # Check sorting by success rate (highest first)
        assert solutions[0]["success_rate"] == 0.92
        assert solutions[1]["success_rate"] == 0.85

        # Verify content
        assert solutions[0]["solution"] == "Clear cache and cookies"
        assert solutions[1]["solution"] == "Reset password"

    @pytest.mark.asyncio
    async def test_process_customer_screenshot(self, support_agent):
        """Test processing customer screenshot with multimodal pipeline."""
        # Process screenshot
        result = await support_agent.process_customer_screenshot(
            screenshot_uri="/tmp/customer_error.png",
            customer_id="customer_001",
            session_id="session_123",
            store_in_memory=True
        )

        # Verify processing
        assert result["uri"] == "/tmp/customer_error.png"
        assert result["type"] == "image"
        assert result["content"] == "Error message detected: Connection timeout"
        assert result["processing_time_ms"] > 0
        assert result["error"] is None

        # Verify multimodal pipeline was called
        support_agent.multimodal_pipeline.process_image.assert_called_once()
        call_args = support_agent.multimodal_pipeline.process_image.call_args

        assert call_args.kwargs["image_uri"] == "/tmp/customer_error.png"
        assert call_args.kwargs["user_id"] == "customer_001"
        assert "customer support screenshot" in call_args.kwargs["prompt"].lower()

    @pytest.mark.asyncio
    async def test_respond_to_ticket_with_memory_integration(self, support_agent):
        """Test respond_to_ticket with full memory integration."""
        # Mock customer history
        mock_history = [
            {
                "memory_id": "mem_001",
                "content": {
                    "agent_response": json.dumps({
                        "issue_description": "Previous login issue",
                        "resolution": "Password reset",
                        "satisfaction_score": 4.5
                    })
                },
                "heat_score": 2.0
            }
        ]

        # Mock common solutions
        mock_solutions = [
            {
                "memory_id": "sol_001",
                "content": {
                    "agent_response": json.dumps({
                        "issue_type": "login_failure",
                        "solution": "Standard reset procedure",
                        "success_rate": 0.89
                    })
                },
                "heat_score": 4.5
            }
        ]

        support_agent.memory.retrieve = Mock(side_effect=[mock_history, mock_solutions, []])

        # Respond to ticket
        response_json = await support_agent.respond_to_ticket(
            ticket_id="TICKET-20251113001",
            response="Reset your password using the link sent to your email",
            resolution_type="resolved",
            customer_id="customer_001",
            issue_type="login_failure",
            session_id="session_123"
        )

        # Parse response
        response = json.loads(response_json)

        # Verify basic response structure
        assert response["ticket_id"] == "TICKET-20251113001"
        assert response["status"] == "resolved"

        # Verify memory context
        memory_context = response["memory_context"]
        assert memory_context["customer_history_count"] == 1
        assert memory_context["common_solutions_count"] == 1

        # Verify customer previous issues
        assert len(memory_context["customer_previous_issues"]) == 1
        assert memory_context["customer_previous_issues"][0]["issue"] == "Previous login issue"

        # Verify recommended solutions
        assert len(memory_context["recommended_solutions"]) == 1
        assert memory_context["recommended_solutions"][0]["success_rate"] == 0.89

        # Verify memory storage flags
        assert response.get("customer_memory_stored") is True
        assert response.get("solution_knowledge_stored") is True

    @pytest.mark.asyncio
    async def test_memory_tool_store_and_recall(self, mock_memory_backend):
        """Test MemoryTool store and recall operations."""
        memory_tool = MemoryTool(backend=mock_memory_backend, agent_id="support")

        # Test store with user scope
        memory_id = memory_tool.store_memory(
            content={"test": "data"},
            scope="user",
            user_id="customer_001",
            provenance={"source": "test"}
        )

        assert memory_id == "mem_support_test123"

        # Test store with app scope
        memory_id = memory_tool.store_memory(
            content={"shared": "knowledge"},
            scope="app"
        )

        assert memory_id == "mem_support_test123"

        # Test recall with user scope
        mock_memory_backend.retrieve = Mock(return_value=[
            {
                "memory_id": "mem_001",
                "content": {
                    "agent_response": json.dumps({"test": "data"})
                },
                "heat_score": 1.5,
                "created_at": datetime.now(timezone.utc).isoformat()
            }
        ])

        results = memory_tool.recall_memory(
            query="test query",
            scope="user",
            user_id="customer_001",
            top_k=5
        )

        assert len(results) == 1
        assert results[0]["content"]["test"] == "data"

    @pytest.mark.asyncio
    async def test_memory_disabled_graceful_degradation(self):
        """Test graceful degradation when memory is disabled."""
        agent = SupportAgent(business_id="test")
        agent.memory = None
        agent.memory_tool = None
        agent.multimodal_pipeline = None

        # Test store_customer_interaction
        memory_id = await agent.store_customer_interaction(
            customer_id="customer_001",
            interaction_type="ticket",
            issue_description="Test issue",
            resolution="Test resolution",
            satisfaction_score=4.0,
            session_id="session_123"
        )

        assert memory_id == "memory_disabled"

        # Test recall_customer_history
        history = await agent.recall_customer_history(
            customer_id="customer_001",
            limit=10
        )

        assert history == []

        # Test store_common_solution
        solution_id = await agent.store_common_solution(
            issue_type="test_issue",
            solution="Test solution",
            success_rate=0.8
        )

        assert solution_id == "memory_disabled"

        # Test recall_common_solutions
        solutions = await agent.recall_common_solutions(
            issue_type="test_issue",
            min_success_rate=0.7
        )

        assert solutions == []


class TestMemoryTool:
    """Test MemoryTool wrapper functionality."""

    @pytest.fixture
    def mock_backend(self):
        """Create mock MongoDB backend."""
        mock = Mock()
        mock.store = Mock(return_value="mem_test_123")
        mock.retrieve = Mock(return_value=[])
        return mock

    def test_memory_tool_initialization(self, mock_backend):
        """Test MemoryTool initialization."""
        memory_tool = MemoryTool(backend=mock_backend, agent_id="support")

        assert memory_tool.backend == mock_backend
        assert memory_tool.agent_id == "support"

    def test_store_memory_user_scope(self, mock_backend):
        """Test storing memory with user scope."""
        memory_tool = MemoryTool(backend=mock_backend, agent_id="support")

        memory_id = memory_tool.store_memory(
            content={"issue": "test"},
            scope="user",
            user_id="customer_001"
        )

        assert memory_id == "mem_test_123"

        # Verify backend was called with correct parameters
        call_args = mock_backend.store.call_args
        assert call_args.kwargs["agent_id"] == "support"
        assert call_args.kwargs["user_id"] == "customer_001"

    def test_store_memory_app_scope(self, mock_backend):
        """Test storing memory with app scope."""
        memory_tool = MemoryTool(backend=mock_backend, agent_id="support")

        memory_id = memory_tool.store_memory(
            content={"solution": "test"},
            scope="app"
        )

        assert memory_id == "mem_test_123"

        # Verify backend was called with app-scoped user_id
        call_args = mock_backend.store.call_args
        assert call_args.kwargs["user_id"] == "support_app"

    def test_store_memory_requires_user_id_for_user_scope(self, mock_backend):
        """Test that user scope requires user_id."""
        memory_tool = MemoryTool(backend=mock_backend, agent_id="support")

        with pytest.raises(ValueError, match="user_id required"):
            memory_tool.store_memory(
                content={"test": "data"},
                scope="user"  # Missing user_id
            )

    def test_recall_memory_parsing(self, mock_backend):
        """Test memory recall with JSON parsing."""
        mock_backend.retrieve = Mock(return_value=[
            {
                "memory_id": "mem_001",
                "content": {
                    "agent_response": json.dumps({"key": "value"})
                },
                "heat_score": 2.5,
                "created_at": datetime.now(timezone.utc).isoformat()
            }
        ])

        memory_tool = MemoryTool(backend=mock_backend, agent_id="support")

        results = memory_tool.recall_memory(
            query="test",
            scope="user",
            user_id="customer_001"
        )

        assert len(results) == 1
        assert results[0]["content"]["key"] == "value"
        assert results[0]["memory_id"] == "mem_001"
        assert results[0]["heat_score"] == 2.5


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
