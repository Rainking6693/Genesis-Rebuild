"""
Integration tests for Redis failure fallback behavior in Nova agents.

Tests that agents gracefully degrade when Redis is unavailable and continue
to function without caching. Validates P1-1 requirement for production readiness.

Coverage:
- QA Agent fallback when Redis fails
- Code Review Agent fallback when Redis fails
- SE Darwin Agent fallback when Redis fails
- TokenCachedRAG graceful degradation
- Performance degradation monitoring
"""

import pytest
import asyncio
from unittest.mock import Mock, AsyncMock, patch
from typing import Any, Dict, List

from agents.qa_agent import QAAgent
from agents.code_review_agent import CodeReviewAgent
from agents.se_darwin_agent import SEDarwinAgent
from infrastructure.token_cached_rag import TokenCachedRAG


class MockRedisFailure:
    """Mock Redis client that simulates connection failures."""

    async def get(self, key: str):
        """Simulate Redis get failure."""
        raise ConnectionError("Redis connection failed")

    async def setex(self, key: str, ttl: int, value: str):
        """Simulate Redis set failure."""
        raise ConnectionError("Redis connection failed")

    async def delete(self, *keys):
        """Simulate Redis delete failure."""
        raise ConnectionError("Redis connection failed")

    async def scan_iter(self, match: str):
        """Simulate Redis scan failure."""
        raise ConnectionError("Redis connection failed")

    async def close(self):
        """Allow cleanup."""
        pass


class MockVectorDB:
    """Mock vector database for testing."""

    async def search(self, query: str, top_k: int = 5, namespace_filter=None) -> List[Dict[str, Any]]:
        return [
            {"id": f"doc_{i}", "content": f"Test document {i} for {query}"}
            for i in range(min(top_k, 3))
        ]


class MockLLM:
    """Mock LLM client for testing."""

    async def tokenize(self, text: str, return_ids: bool = True) -> List[int]:
        # Simple word-based tokenization
        return [hash(word) % 10000 for word in text.split()]

    async def generate_from_token_ids(
        self,
        prompt_token_ids: List[int],
        max_tokens: int = 1024,
        temperature: float = 0.7
    ) -> Dict[str, Any]:
        return {"text": f"Generated response from {len(prompt_token_ids)} tokens"}


@pytest.mark.asyncio
class TestRedisFailureFallback:
    """Test suite for Redis failure fallback behavior."""

    async def test_token_cached_rag_fallback_on_get_failure(self):
        """Test TokenCachedRAG gracefully handles Redis get failures."""
        # Create TokenCachedRAG with failing Redis
        rag = TokenCachedRAG(
            vector_db=MockVectorDB(),
            llm_client=MockLLM(),
            redis_client=MockRedisFailure(),
            cache_ttl=300,
            enable_caching=True
        )

        # Should not raise exception despite Redis failure
        token_ids, metadata = await rag.retrieve_tokens(
            query="test query",
            top_k=3
        )

        # Should function without cache
        assert isinstance(token_ids, list)
        assert len(token_ids) > 0
        assert metadata["cache_hit"] is False
        assert metadata["doc_count"] > 0

        # Stats should record cache miss
        stats = rag.get_cache_stats()
        assert stats["cache_misses"] >= 1

        # Cleanup
        await rag.redis.close()

    async def test_token_cached_rag_fallback_on_set_failure(self):
        """Test TokenCachedRAG gracefully handles Redis set failures."""
        rag = TokenCachedRAG(
            vector_db=MockVectorDB(),
            llm_client=MockLLM(),
            redis_client=MockRedisFailure(),
            cache_ttl=300,
            enable_caching=True
        )

        # Should not raise exception when storing fails
        token_ids, metadata = await rag.retrieve_tokens(
            query="test store failure",
            top_k=3
        )

        # Should still return valid results
        assert isinstance(token_ids, list)
        assert len(token_ids) > 0
        assert metadata["cache_hit"] is False

        # Cleanup
        await rag.redis.close()

    async def test_token_cached_rag_generate_with_redis_failure(self):
        """Test generate_with_rag continues to work without Redis."""
        rag = TokenCachedRAG(
            vector_db=MockVectorDB(),
            llm_client=MockLLM(),
            redis_client=MockRedisFailure(),
            cache_ttl=300,
            enable_caching=True
        )

        # Should generate response despite Redis failure
        result = await rag.generate_with_rag(
            query="test generation without redis",
            top_k=3,
            max_tokens=100
        )

        # Validate response structure
        assert "response" in result
        assert "context_tokens" in result
        assert "query_tokens" in result
        assert "cache_hit" in result
        assert result["cache_hit"] is False  # No cache due to Redis failure

        # Cleanup
        await rag.redis.close()

    async def test_qa_agent_fallback_without_redis(self):
        """Test QA Agent continues to function without Redis."""
        # Create QA Agent with failing Redis
        with patch('redis.asyncio.from_url') as mock_redis:
            mock_redis.return_value = MockRedisFailure()

            qa_agent = QAAgent(
                business_id="test_redis_fallback",
                enable_memory=False,
                enable_token_caching=True
            )

            # Should initialize despite Redis issues
            assert qa_agent.token_cached_rag is not None

            # Test generation falls back gracefully
            result = await qa_agent.generate_tests_cached(
                code="def test_function(): pass",
                test_type="unit"
            )

            # Should return results (may use fallback method)
            assert "test_count" in result
            assert result["test_count"] > 0

            # Cleanup
            await qa_agent.close()

    async def test_code_review_agent_fallback_without_redis(self):
        """Test Code Review Agent continues to function without Redis."""
        with patch('redis.asyncio.from_url') as mock_redis:
            mock_redis.return_value = MockRedisFailure()

            code_review_agent = CodeReviewAgent(enable_token_caching=True)

            # Should initialize
            assert code_review_agent.token_cached_rag is not None

            # Should handle cache operations gracefully
            stats = code_review_agent.get_cache_stats()
            assert stats is not None

            # Cleanup
            await code_review_agent.close()

    async def test_se_darwin_agent_fallback_without_redis(self):
        """Test SE Darwin Agent continues to function without Redis."""
        with patch('redis.asyncio.from_url') as mock_redis:
            mock_redis.return_value = MockRedisFailure()

            se_agent = SEDarwinAgent(
                agent_name="test_agent",
                llm_client=MockLLM()
            )

            # Should initialize successfully even without Redis
            assert se_agent.agent_name == "test_agent"
            assert se_agent.llm_client is not None

    async def test_performance_degradation_monitoring(self):
        """Test that performance degradation is tracked when Redis fails."""
        rag = TokenCachedRAG(
            vector_db=MockVectorDB(),
            llm_client=MockLLM(),
            redis_client=MockRedisFailure(),
            cache_ttl=300,
            enable_caching=True
        )

        # Execute multiple requests
        for i in range(5):
            token_ids, metadata = await rag.retrieve_tokens(
                query=f"test query {i}",
                top_k=3
            )

            # All should be cache misses
            assert metadata["cache_hit"] is False
            assert "latency_ms" in metadata

        # Check stats
        stats = rag.get_cache_stats()
        assert stats["cache_misses"] >= 5
        assert stats["cache_hits"] == 0
        assert stats["hit_rate"] == 0.0

        # Cleanup
        await rag.redis.close()

    async def test_redis_failure_does_not_crash_concurrent_operations(self):
        """Test multiple concurrent operations handle Redis failures gracefully."""
        rag = TokenCachedRAG(
            vector_db=MockVectorDB(),
            llm_client=MockLLM(),
            redis_client=MockRedisFailure(),
            cache_ttl=300,
            enable_caching=True
        )

        # Launch concurrent operations
        tasks = [
            rag.retrieve_tokens(query=f"concurrent query {i}", top_k=3)
            for i in range(10)
        ]

        # All should complete without exceptions
        results = await asyncio.gather(*tasks, return_exceptions=True)

        # Check all succeeded
        for result in results:
            if isinstance(result, Exception):
                pytest.fail(f"Concurrent operation raised exception: {result}")

            token_ids, metadata = result
            assert isinstance(token_ids, list)
            assert metadata["cache_hit"] is False

        # Cleanup
        await rag.redis.close()

    async def test_clear_cache_handles_redis_failure(self):
        """Test clear_cache doesn't crash when Redis fails."""
        rag = TokenCachedRAG(
            vector_db=MockVectorDB(),
            llm_client=MockLLM(),
            redis_client=MockRedisFailure(),
            cache_ttl=300,
            enable_caching=True
        )

        # Should not raise exception
        deleted_count = await rag.clear_cache()

        # Should return 0 (couldn't delete anything)
        assert deleted_count == 0

        # Cleanup
        await rag.redis.close()

    async def test_redis_disabled_works_correctly(self):
        """Test TokenCachedRAG with caching disabled (redis_client=None)."""
        rag = TokenCachedRAG(
            vector_db=MockVectorDB(),
            llm_client=MockLLM(),
            redis_client=None,  # No Redis at all
            cache_ttl=300,
            enable_caching=True  # Will be overridden to False due to None redis
        )

        # Should work fine without Redis
        assert rag.enable_caching is False

        token_ids, metadata = await rag.retrieve_tokens(
            query="test without redis",
            top_k=3
        )

        # Should function normally
        assert isinstance(token_ids, list)
        assert len(token_ids) > 0
        assert metadata["cache_hit"] is False

        # Generate should also work
        result = await rag.generate_with_rag(
            query="test generation",
            top_k=3
        )

        assert "response" in result
        assert result["cache_hit"] is False


if __name__ == "__main__":
    # Run tests
    pytest.main([__file__, "-v", "-s"])
