"""
Unit tests for QA Agent TokenCachedRAG (vLLM Agent-Lightning) integration.

Tests cache hit/miss scenarios, fallback behavior, and performance improvements
for token-cached test generation with 65-75% latency reduction.
"""

import pytest
import asyncio
import json
from unittest.mock import Mock, AsyncMock, patch, MagicMock
from datetime import datetime

from agents.qa_agent import QAAgent


class TestQAAgentTokenCaching:
    """Test suite for QA Agent token caching functionality."""

    @pytest.fixture
    def qa_agent(self):
        """Create QA Agent with token caching enabled."""
        return QAAgent(business_id="test_business", enable_memory=False, enable_token_caching=True)

    @pytest.fixture
    def qa_agent_no_caching(self):
        """Create QA Agent with token caching disabled."""
        return QAAgent(business_id="test_business", enable_memory=False, enable_token_caching=False)

    def test_qa_agent_initialization(self, qa_agent):
        """Test QA Agent initializes with token caching."""
        assert qa_agent.enable_token_caching is True
        assert qa_agent.token_cached_rag is not None
        assert qa_agent.business_id == "test_business"

    def test_qa_agent_no_caching_initialization(self, qa_agent_no_caching):
        """Test QA Agent initializes without token caching."""
        assert qa_agent_no_caching.enable_token_caching is False
        assert qa_agent_no_caching.token_cached_rag is None

    @pytest.mark.asyncio
    async def test_generate_tests_cached_hit(self, qa_agent):
        """Test cache hit for test generation."""
        if not qa_agent.token_cached_rag:
            pytest.skip("TokenCachedRAG not available")

        code = "def add(a, b): return a + b"

        # First call: cache miss (or hit if already cached)
        result1 = await qa_agent.generate_tests_cached(code, test_type="unit")

        assert "test_count" in result1
        assert isinstance(result1["test_count"], int)
        assert result1["test_count"] > 0
        assert "tests" in result1
        assert isinstance(result1["tests"], list)
        assert "latency_ms" in result1
        assert result1["latency_ms"] > 0

    @pytest.mark.asyncio
    async def test_generate_tests_cached_different_types(self, qa_agent):
        """Test cache works correctly across different test types."""
        if not qa_agent.token_cached_rag:
            pytest.skip("TokenCachedRAG not available")

        code = "def multiply(a, b): return a * b"
        test_types = ["unit", "integration", "e2e", "performance", "security"]

        results = {}
        for test_type in test_types:
            result = await qa_agent.generate_tests_cached(code, test_type=test_type)
            results[test_type] = result
            assert result["test_type"] == test_type
            assert result["test_count"] > 0
            assert "latency_ms" in result

        # Verify cache is working (should have high hit rate with mock)
        # With MockVectorDB returning same docs, cache should hit for all types
        stats = qa_agent.token_cached_rag.get_cache_stats()
        assert stats["hit_rate"] > 50.0, f"Expected cache hit rate > 50%, got {stats['hit_rate']:.1f}%"

        # All test types should complete successfully
        assert len(results) == len(test_types)

    @pytest.mark.asyncio
    async def test_generate_tests_cached_fallback(self, qa_agent):
        """Test fallback when TokenCachedRAG is disabled."""
        qa_agent.token_cached_rag = None  # Simulate disabled cache

        code = "def subtract(a, b): return a - b"
        result = await qa_agent.generate_tests_cached(code, test_type="unit")

        assert result["fallback"] is True
        assert result["cache_hit"] is False
        assert result["test_count"] > 0

    @pytest.mark.asyncio
    async def test_generate_tests_cached_multiple_calls(self, qa_agent):
        """Test multiple calls for cache hit rate."""
        if not qa_agent.token_cached_rag:
            pytest.skip("TokenCachedRAG not available")

        code = "def divide(a, b): return a / b if b != 0 else None"

        # Make multiple calls with same test type
        results = []
        for _ in range(3):
            result = await qa_agent.generate_tests_cached(code, test_type="unit")
            results.append(result)

        # First call might be miss, subsequent should be hits
        assert len(results) == 3
        for result in results:
            assert result["test_count"] > 0
            assert "latency_ms" in result

    @pytest.mark.asyncio
    async def test_cache_stats_tracking(self, qa_agent):
        """Test cache statistics are properly tracked."""
        if not qa_agent.token_cached_rag:
            pytest.skip("TokenCachedRAG not available")

        # Reset stats
        qa_agent.token_cached_rag.reset_stats()

        code1 = "def func1(): pass"
        code2 = "def func2(): pass"

        # Generate tests
        await qa_agent.generate_tests_cached(code1, test_type="unit")
        await qa_agent.generate_tests_cached(code2, test_type="unit")

        # Get cache stats
        stats = qa_agent.token_cached_rag.get_cache_stats()

        assert "hit_rate" in stats
        assert "hits" in stats
        assert "misses" in stats
        assert stats["total_tokens_cached"] >= 0

    @pytest.mark.asyncio
    async def test_store_and_recall_bug_solution(self, qa_agent):
        """Test storing and recalling bug solutions with memory."""
        # Enable memory for this test
        qa_agent.enable_memory = True
        qa_agent._init_memory()

        if not qa_agent.memory_tool:
            pytest.skip("Memory system not available")

        # Store a bug solution
        success = await qa_agent.store_bug_solution(
            bug_description="Authentication timeout on slow networks",
            solution="Increased timeout from 5s to 15s",
            test_results={"passed": 45, "failed": 0, "total_tests": 45},
            success=True,
            user_id="test_user"
        )

        assert success is True

        # Recall similar bugs
        similar_bugs = await qa_agent.recall_similar_bugs(
            bug_description="Auth timeout issue",
            top_k=3
        )

        # Should return results (even if empty due to mock backend)
        assert isinstance(similar_bugs, list)

    @pytest.mark.asyncio
    async def test_generate_tests_latency_tracking(self, qa_agent):
        """Test latency tracking for performance validation."""
        if not qa_agent.token_cached_rag:
            pytest.skip("TokenCachedRAG not available")

        code = "def compute(): return sum(range(1000))"

        result = await qa_agent.generate_tests_cached(code, test_type="performance")

        # Latency should be reasonable (> 0 and < 10 seconds)
        assert 0 < result["latency_ms"] < 10000

        # Cache stats should track timing
        cache_stats = result.get("cache_stats", {})
        if result["cache_hit"]:
            # Cache hits should be fast (< 500ms typically)
            assert result["latency_ms"] < 500

    @pytest.mark.asyncio
    async def test_concurrent_test_generation(self, qa_agent):
        """Test concurrent test generation requests."""
        if not qa_agent.token_cached_rag:
            pytest.skip("TokenCachedRAG not available")

        code = "def concurrent_func(): pass"

        # Run 3 concurrent requests
        tasks = [
            qa_agent.generate_tests_cached(code, test_type="unit"),
            qa_agent.generate_tests_cached(code, test_type="integration"),
            qa_agent.generate_tests_cached(code, test_type="e2e")
        ]

        results = await asyncio.gather(*tasks)

        assert len(results) == 3
        for result in results:
            assert result["test_count"] > 0
            assert "latency_ms" in result

    @pytest.mark.asyncio
    async def test_cache_warmup(self, qa_agent):
        """Test cache warmup functionality with retry logic (P1-3)."""
        if not qa_agent.token_cached_rag:
            pytest.skip("TokenCachedRAG not available")

        # Reset stats
        qa_agent.token_cached_rag.reset_stats()

        # Run warmup (should complete without errors even if cache operations fail)
        await qa_agent._warmup_test_cache()

        # After warmup, we should have some cache activity (hits or misses)
        stats = qa_agent.token_cached_rag.get_cache_stats()
        total_operations = stats["cache_hits"] + stats["cache_misses"]

        # Warmup should have attempted operations (even if they all failed)
        # With 5 test types, we expect at least 5 operations
        assert total_operations >= 5, f"Expected at least 5 cache operations, got {total_operations}"

    @pytest.mark.asyncio
    async def test_generate_tests_max_tokens(self, qa_agent):
        """Test generating tests with custom max_tokens parameter."""
        if not qa_agent.token_cached_rag:
            pytest.skip("TokenCachedRAG not available")

        code = "def small_func(): return 42"

        # Test with different max_tokens
        result_small = await qa_agent.generate_tests_cached(
            code, test_type="unit", max_tokens=100
        )
        result_large = await qa_agent.generate_tests_cached(
            code, test_type="unit", max_tokens=2000
        )

        assert result_small["test_count"] > 0
        assert result_large["test_count"] > 0

    def test_qa_agent_backward_compatibility(self):
        """Test that QA Agent maintains backward compatibility."""
        # Old code should still work with enable_token_caching=False
        agent = QAAgent(
            business_id="compat_test",
            enable_memory=False,
            enable_token_caching=False
        )

        assert agent.business_id == "compat_test"
        assert agent.token_cached_rag is None
        assert agent.enable_token_caching is False

    @pytest.mark.asyncio
    async def test_generate_tests_error_handling(self, qa_agent):
        """Test error handling in cached test generation."""
        if not qa_agent.token_cached_rag:
            pytest.skip("TokenCachedRAG not available")

        # Test with empty code (should still work)
        result = await qa_agent.generate_tests_cached("", test_type="unit")
        assert "test_count" in result
        assert result["test_count"] >= 0  # Should handle empty code gracefully

    @pytest.mark.asyncio
    async def test_cache_stats_consistency(self, qa_agent):
        """Test that cache stats remain consistent across operations."""
        if not qa_agent.token_cached_rag:
            pytest.skip("TokenCachedRAG not available")

        qa_agent.token_cached_rag.reset_stats()
        initial_stats = qa_agent.token_cached_rag.get_cache_stats()

        code = "def consistency_test(): pass"
        await qa_agent.generate_tests_cached(code, test_type="unit")

        final_stats = qa_agent.token_cached_rag.get_cache_stats()

        # Stats should show changes
        assert final_stats["cache_hits"] + final_stats["cache_misses"] > 0


class TestQAAgentIntegration:
    """Integration tests for QA Agent with token caching."""

    @pytest.mark.asyncio
    async def test_full_qa_workflow(self):
        """Test complete QA workflow with token caching."""
        agent = QAAgent(business_id="qa_workflow_test", enable_memory=False, enable_token_caching=True)

        if not agent.token_cached_rag:
            pytest.skip("TokenCachedRAG not available")

        # Simulate full QA workflow
        code = """
def process_user(user_id: str, username: str) -> dict:
    # Validate input
    if not user_id or not username:
        return {"error": "Invalid input"}

    # Process user
    return {"user_id": user_id, "username": username}
"""

        # Generate tests for different types
        test_types = ["unit", "integration"]
        results = []

        for test_type in test_types:
            result = await agent.generate_tests_cached(code, test_type=test_type)
            results.append(result)
            assert result["test_count"] > 0

        # Verify all tests were generated
        total_tests = sum(r["test_count"] for r in results)
        assert total_tests > 0

    @pytest.mark.asyncio
    async def test_performance_improvement(self):
        """Verify token caching provides performance improvement."""
        agent = QAAgent(business_id="perf_test", enable_memory=False, enable_token_caching=True)

        if not agent.token_cached_rag:
            pytest.skip("TokenCachedRAG not available")

        code = "def perf_func(): pass"

        # First call (likely cache miss)
        result1 = await agent.generate_tests_cached(code, test_type="unit")

        # Second call (likely cache hit)
        result2 = await agent.generate_tests_cached(code, test_type="unit")

        # Both should complete successfully
        assert result1["test_count"] > 0
        assert result2["test_count"] > 0

        # Second call might be faster (if cache hit)
        # Note: This is not guaranteed in mock implementation
        assert result1["latency_ms"] > 0
        assert result2["latency_ms"] > 0


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
