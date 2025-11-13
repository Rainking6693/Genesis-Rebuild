"""
Test Suite for SE-Darwin Memory Integration
Audit Protocol V2 - Functional Testing
"""

import asyncio
import sys
import os
from pathlib import Path

# Add project root to path
sys.path.insert(0, str(Path(__file__).parent.parent))

import pytest
from datetime import datetime, timezone
from unittest.mock import Mock, MagicMock, patch

# Import SE-Darwin components
from agents.se_darwin_agent import MemoryTool, MutationSuccessTracker
from infrastructure.memory_os_mongodb_adapter import GenesisMemoryOSMongoDB


class TestMemoryTool:
    """Test MemoryTool class functionality"""

    def setup_method(self):
        """Setup test fixtures"""
        # Mock MongoDB backend
        self.mock_backend = Mock(spec=GenesisMemoryOSMongoDB)
        self.memory_tool = MemoryTool(backend=self.mock_backend, agent_id="se_darwin")

    def test_initialization(self):
        """Test MemoryTool initialization"""
        assert self.memory_tool.backend == self.mock_backend
        assert self.memory_tool.agent_id == "se_darwin"

    def test_store_memory_basic(self):
        """Test basic memory storage"""
        content = {
            "agent_id": "builder",
            "mutation": "add_logging",
            "fitness_before": 0.5,
            "fitness_after": 0.8,
            "fitness_improvement": 0.3
        }

        # Mock backend store method
        self.mock_backend.store = Mock(return_value="mem_123")

        result = self.memory_tool.store_memory(
            content=content,
            scope="app",
            provenance={"agent_id": "se_darwin"}
        )

        assert result == True
        assert self.mock_backend.store.called

        # Verify call arguments
        call_args = self.mock_backend.store.call_args
        assert call_args[1]["agent_id"] == "se_darwin"
        assert "darwin_global" in call_args[1]["user_id"]

    def test_store_memory_scope_isolation(self):
        """Test scope isolation in memory storage"""
        content = {"agent_id": "builder", "mutation": "test"}

        self.mock_backend.store = Mock(return_value="mem_123")

        # Test app scope
        self.memory_tool.store_memory(content, scope="app")
        assert "darwin_global" in self.mock_backend.store.call_args[1]["user_id"]

        # Test agent scope
        content["agent_id"] = "builder"
        self.memory_tool.store_memory(content, scope="agent")
        assert "darwin_builder" in self.mock_backend.store.call_args[1]["user_id"]

    def test_store_memory_error_handling(self):
        """Test error handling in store_memory"""
        content = {"agent_id": "builder"}

        # Simulate backend failure
        self.mock_backend.store = Mock(side_effect=Exception("Connection failed"))

        result = self.memory_tool.store_memory(content, scope="app")

        assert result == False  # Should return False on error

    def test_retrieve_memory_basic(self):
        """Test basic memory retrieval"""
        mock_memories = [
            {
                "memory_id": "mem_1",
                "content": {
                    "user_input": "Evolve builder: add_logging",
                    "agent_response": "Evolution attempt: add_logging\nFitness: 0.500 -> 0.800 (improvement: +0.300)"
                }
            }
        ]

        self.mock_backend.retrieve = Mock(return_value=mock_memories)

        result = self.memory_tool.retrieve_memory(
            query="evolution of builder",
            scope="app",
            top_k=5
        )

        assert len(result) == 1
        assert result[0]["memory_id"] == "mem_1"
        assert self.mock_backend.retrieve.called

    def test_retrieve_memory_with_filters(self):
        """Test memory retrieval with custom filters"""
        mock_memories = [
            {
                "memory_id": "mem_1",
                "content": {
                    "agent_id": "builder",
                    "agent_response": "improvement: +0.300"
                }
            },
            {
                "memory_id": "mem_2",
                "content": {
                    "agent_id": "builder",
                    "agent_response": "improvement: +0.050"
                }
            }
        ]

        self.mock_backend.retrieve = Mock(return_value=mock_memories)

        result = self.memory_tool.retrieve_memory(
            query="builder evolution",
            scope="app",
            filters={"agent_id": "builder", "fitness_improvement": ">0.1"},
            top_k=5
        )

        # Should filter out mem_2 (improvement < 0.1)
        assert len(result) == 1
        assert result[0]["memory_id"] == "mem_1"

    def test_build_user_id_scopes(self):
        """Test _build_user_id for different scopes"""
        # App scope
        user_id = self.memory_tool._build_user_id("app", None)
        assert user_id == "darwin_global"

        # Agent scope
        user_id = self.memory_tool._build_user_id("agent", "builder")
        assert user_id == "darwin_builder"

        # Session scope (should be unique)
        user_id1 = self.memory_tool._build_user_id("session", None)
        user_id2 = self.memory_tool._build_user_id("session", None)
        assert user_id1.startswith("darwin_session_")
        assert user_id1 != user_id2  # Should be unique

    def test_extract_fitness_improvement(self):
        """Test fitness improvement extraction from memory content"""
        content = {
            "agent_response": "Evolution attempt: test\nFitness: 0.500 -> 0.800 (improvement: +0.300)"
        }

        improvement = self.memory_tool._extract_fitness_improvement(content)
        assert improvement == 0.3

        # Test with invalid format
        content = {"agent_response": "No improvement data"}
        improvement = self.memory_tool._extract_fitness_improvement(content)
        assert improvement == 0.0


class TestMutationSuccessTracker:
    """Test MutationSuccessTracker class functionality"""

    def setup_method(self):
        """Setup test fixtures"""
        self.mock_memory_tool = Mock(spec=MemoryTool)
        self.tracker = MutationSuccessTracker(memory_tool=self.mock_memory_tool)

    def test_initialization(self):
        """Test tracker initialization"""
        assert self.tracker.memory_tool == self.mock_memory_tool
        assert self.tracker._success_cache == {}

    def test_track_mutation_basic(self):
        """Test basic mutation tracking"""
        self.mock_memory_tool.store_memory = Mock(return_value=True)

        self.tracker.track_mutation(
            agent_id="builder",
            mutation_type="add_logging",
            operator_type="revision",
            fitness_before=0.5,
            fitness_after=0.8,
            success=True
        )

        assert self.mock_memory_tool.store_memory.called

        # Verify cache update
        cache_key = "builder::add_logging"
        assert cache_key in self.tracker._success_cache

        stats = self.tracker._success_cache[cache_key]
        assert stats["total"] == 1
        assert stats["successful"] == 1
        assert abs(stats["avg_improvement"] - 0.3) < 0.01

    def test_track_mutation_multiple_attempts(self):
        """Test tracking multiple mutation attempts"""
        self.mock_memory_tool.store_memory = Mock(return_value=True)

        # Track 3 attempts
        self.tracker.track_mutation("builder", "add_logging", "revision", 0.5, 0.8, True)
        self.tracker.track_mutation("builder", "add_logging", "revision", 0.6, 0.7, True)
        self.tracker.track_mutation("builder", "add_logging", "revision", 0.5, 0.4, False)

        cache_key = "builder::add_logging"
        stats = self.tracker._success_cache[cache_key]

        assert stats["total"] == 3
        assert stats["successful"] == 2

        # Average improvement: (0.3 + 0.1 + (-0.1)) / 3 = 0.1
        assert abs(stats["avg_improvement"] - 0.1) < 0.01

    def test_get_successful_mutations(self):
        """Test retrieval of successful mutations"""
        mock_memories = [
            {
                "content": {
                    "agent_id": "builder",
                    "agent_response": "Evolution attempt: add_logging\nimprovement: +0.300"
                }
            },
            {
                "content": {
                    "agent_id": "builder",
                    "agent_response": "Evolution attempt: refactor_code\nimprovement: +0.150"
                }
            }
        ]

        self.mock_memory_tool.retrieve_memory = Mock(return_value=mock_memories)

        result = self.tracker.get_successful_mutations(
            agent_id="builder",
            min_improvement=0.1,
            top_k=5
        )

        assert len(result) == 2
        # Should be sorted by improvement (descending)
        assert result[0]["improvement"] >= result[1]["improvement"]

    def test_get_operator_success_rate_from_cache(self):
        """Test operator success rate calculation from cache"""
        # Populate cache
        self.tracker._success_cache["builder::mutation1"] = {
            "total": 10,
            "successful": 8,
            "avg_improvement": 0.2
        }
        self.tracker._success_cache["builder::mutation2"] = {
            "total": 5,
            "successful": 2,
            "avg_improvement": 0.1
        }

        success_rate = self.tracker.get_operator_success_rate("builder", "revision")

        # (8 + 2) / (10 + 5) = 10/15 = 0.666...
        assert abs(success_rate - 0.666) < 0.01

    def test_get_operator_success_rate_from_memory(self):
        """Test operator success rate calculation from memory backend"""
        # Empty cache, should query memory
        self.tracker._success_cache = {}

        mock_memories = [
            {"content": {"agent_response": "improvement: +0.300"}},
            {"content": {"agent_response": "improvement: +0.150"}},
            {"content": {"agent_response": "improvement: -0.050"}}
        ]

        self.mock_memory_tool.retrieve_memory = Mock(return_value=mock_memories)

        success_rate = self.tracker.get_operator_success_rate("builder", "revision")

        # 2 successful out of 3 = 0.666...
        assert abs(success_rate - 0.666) < 0.01

    def test_get_operator_success_rate_default(self):
        """Test default success rate when no data available"""
        self.tracker._success_cache = {}
        self.mock_memory_tool.retrieve_memory = Mock(return_value=[])

        success_rate = self.tracker.get_operator_success_rate("builder", "revision")

        # Should return default neutral rate
        assert success_rate == 0.5


class TestIntegrationWithSEDarwin:
    """Test integration with SE-Darwin agent"""

    @patch('agents.se_darwin_agent.create_genesis_memory_mongodb')
    def test_memory_initialization_in_agent(self, mock_create_memory):
        """Test memory initialization in SEDarwinAgent"""
        mock_memory = Mock(spec=GenesisMemoryOSMongoDB)
        mock_create_memory.return_value = mock_memory

        from agents.se_darwin_agent import SEDarwinAgent

        agent = SEDarwinAgent(
            agent_name="builder",
            llm_client=None,
            trajectories_per_iteration=2,
            max_iterations=2
        )

        # Verify memory was initialized
        assert agent.memory_tool is not None
        assert agent.mutation_success_tracker is not None
        assert mock_create_memory.called

    @patch('agents.se_darwin_agent.create_genesis_memory_mongodb')
    def test_memory_disabled_on_error(self, mock_create_memory):
        """Test graceful fallback when memory initialization fails"""
        mock_create_memory.side_effect = Exception("MongoDB connection failed")

        from agents.se_darwin_agent import SEDarwinAgent

        agent = SEDarwinAgent(
            agent_name="builder",
            llm_client=None,
            trajectories_per_iteration=2,
            max_iterations=2
        )

        # Memory should be disabled
        assert agent.memory_tool is None
        assert agent.mutation_success_tracker is None


class TestPerformance:
    """Performance tests for memory operations"""

    def test_cache_effectiveness(self):
        """Test that cache reduces backend queries"""
        mock_memory_tool = Mock(spec=MemoryTool)
        mock_memory_tool.retrieve_memory = Mock(return_value=[])

        tracker = MutationSuccessTracker(memory_tool=mock_memory_tool)

        # First call should query backend
        tracker.get_operator_success_rate("builder", "revision")
        first_call_count = mock_memory_tool.retrieve_memory.call_count

        # Populate cache
        tracker._success_cache["builder::mutation1"] = {
            "total": 10,
            "successful": 8,
            "avg_improvement": 0.2
        }

        # Second call should use cache
        tracker.get_operator_success_rate("builder", "revision")
        second_call_count = mock_memory_tool.retrieve_memory.call_count

        # Should not have made additional backend call
        assert second_call_count == first_call_count

    def test_filter_performance(self):
        """Test filter performance with large datasets"""
        mock_backend = Mock(spec=GenesisMemoryOSMongoDB)
        memory_tool = MemoryTool(backend=mock_backend, agent_id="se_darwin")

        # Generate 1000 mock memories
        mock_memories = []
        for i in range(1000):
            mock_memories.append({
                "memory_id": f"mem_{i}",
                "content": {
                    "agent_id": "builder",
                    "agent_response": f"improvement: +{i/1000.0:.3f}"
                }
            })

        mock_backend.retrieve = Mock(return_value=mock_memories)

        import time
        start = time.time()

        result = memory_tool.retrieve_memory(
            query="builder",
            scope="app",
            filters={"agent_id": "builder", "fitness_improvement": ">0.5"},
            top_k=10
        )

        duration = time.time() - start

        # Should complete in under 1 second
        assert duration < 1.0

        # Should filter correctly (500+ memories have improvement > 0.5)
        assert len(result) >= 500


def run_tests():
    """Run all tests"""
    print("=" * 60)
    print("SE-Darwin Memory Integration Test Suite")
    print("=" * 60)

    # Run pytest
    pytest.main([
        __file__,
        "-v",
        "--tb=short",
        "-k", "test_"
    ])


if __name__ == "__main__":
    run_tests()
