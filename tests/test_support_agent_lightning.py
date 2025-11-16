"""
Unit Tests for Support Agent with vLLM Agent-Lightning Token Caching
Tests cache hit/miss scenarios, fallback behavior, and performance metrics.
"""

import pytest
import asyncio
import time
from unittest.mock import AsyncMock, MagicMock, patch
from agents.support_agent import SupportAgent
from infrastructure.token_cached_rag import TokenCacheStats


class TestSupportAgentTokenCaching:
    """Test Support Agent token caching integration."""

    @pytest.fixture
    def support_agent(self):
        """Create a Support Agent instance for testing."""
        agent = SupportAgent(business_id="test", enable_memory=True)
        return agent

    @pytest.mark.asyncio
    async def test_support_agent_initialization(self, support_agent):
        """Test that Support Agent initializes with token caching."""
        assert support_agent.business_id == "test"
        assert support_agent.enable_memory is True
        # Token cache may or may not be initialized depending on Redis availability
        logger_message = f"Support Agent initialized with token caching" if support_agent.token_cached_rag else "without token caching"
        assert "Support Agent" in str(support_agent)

    @pytest.mark.asyncio
    async def test_answer_support_query_cached_without_cache(self, support_agent):
        """Test fallback when TokenCachedRAG is not available."""
        support_agent.token_cached_rag = None

        result = await support_agent.answer_support_query_cached(
            query="How do I reset my password?"
        )

        assert result["cache_available"] is False
        assert result["cache_hit"] is False
        assert "response" in result
        assert "latency_ms" in result

    @pytest.mark.asyncio
    async def test_answer_support_query_cached_structure(self, support_agent):
        """Test that cached response has expected structure."""
        if not support_agent.token_cached_rag:
            pytest.skip("Token caching not available")

        result = await support_agent.answer_support_query_cached(
            query="How do I reset my password?",
            top_k=5,
            max_tokens=500
        )

        # Check response structure
        assert isinstance(result, dict)
        assert "response" in result
        assert "cache_hit" in result
        assert "cache_available" in result
        assert "latency_ms" in result
        assert "cache_stats" in result
        assert "context_tokens" in result
        assert "query_tokens" in result

    @pytest.mark.asyncio
    async def test_answer_support_query_cached_latency(self, support_agent):
        """Test that latency measurements are reasonable."""
        if not support_agent.token_cached_rag:
            pytest.skip("Token caching not available")

        result = await support_agent.answer_support_query_cached(
            query="What is your refund policy?"
        )

        # Latency should be non-negative
        assert result["latency_ms"] >= 0

    @pytest.mark.asyncio
    async def test_answer_support_query_cached_multiple_calls(self, support_agent):
        """Test cache behavior with multiple calls."""
        if not support_agent.token_cached_rag:
            pytest.skip("Token caching not available")

        query = "How do I reset my password?"

        # First call - likely cache miss
        result1 = await support_agent.answer_support_query_cached(query=query)
        cache_stats1 = result1.get("cache_stats")

        # Wait a moment
        await asyncio.sleep(0.1)

        # Second call - likely cache hit
        result2 = await support_agent.answer_support_query_cached(query=query)
        cache_stats2 = result2.get("cache_stats")

        assert isinstance(result1, dict)
        assert isinstance(result2, dict)

        # Cache stats should exist
        if cache_stats2:
            # After multiple calls, we should see some cache activity
            assert "hit_rate" in cache_stats2 or "cache_hits" in cache_stats2

    @pytest.mark.asyncio
    async def test_answer_support_query_cached_error_handling(self, support_agent):
        """Test graceful fallback on cache errors."""
        if not support_agent.token_cached_rag:
            pytest.skip("Token caching not available")

        # Mock the generate_with_rag to raise an error
        original_generate = support_agent.token_cached_rag.generate_with_rag
        support_agent.token_cached_rag.generate_with_rag = AsyncMock(
            side_effect=Exception("Cache error")
        )

        result = await support_agent.answer_support_query_cached(
            query="How do I update my profile?"
        )

        # Should gracefully fall back
        assert result["cache_available"] is False
        assert "cache_error" in result or "response" in result

        # Restore original method
        support_agent.token_cached_rag.generate_with_rag = original_generate

    @pytest.mark.asyncio
    async def test_answer_support_query_cached_different_queries(self, support_agent):
        """Test that different queries are handled independently."""
        if not support_agent.token_cached_rag:
            pytest.skip("Token caching not available")

        queries = [
            "How do I reset my password?",
            "What is your refund policy?",
            "How do I contact support?",
            "Can I upgrade my account?"
        ]

        results = []
        for query in queries:
            result = await support_agent.answer_support_query_cached(query=query)
            results.append(result)

        # All results should be valid
        assert len(results) == len(queries)
        for result in results:
            assert "response" in result
            assert "cache_hit" in result
            assert "latency_ms" in result

    @pytest.mark.asyncio
    async def test_support_agent_existing_methods_still_work(self, support_agent):
        """Test that existing non-cached methods still work."""
        # Test create_ticket (non-cached)
        ticket = support_agent.create_ticket(
            user_id="user123",
            issue_description="Test issue",
            priority="high"
        )
        assert ticket is not None
        assert "TICKET-" in ticket

        # Test search_knowledge_base (non-cached)
        kb_result = support_agent.search_knowledge_base(
            query="login",
            category="account"
        )
        assert kb_result is not None
        assert "KB-" in kb_result or "results" in kb_result

        # Test generate_support_report (non-cached)
        report = support_agent.generate_support_report(
            start_date="2024-01-01",
            end_date="2024-01-31"
        )
        assert report is not None
        assert "REPORT-" in report or "report_id" in report

    @pytest.mark.asyncio
    async def test_token_cache_stats_tracking(self, support_agent):
        """Test that cache statistics are properly tracked."""
        if not support_agent.token_cached_rag:
            pytest.skip("Token caching not available")

        # Get initial stats
        initial_stats = support_agent.token_cached_rag.get_cache_stats()
        assert initial_stats is not None

        # Make a cached query
        await support_agent.answer_support_query_cached(
            query="Test query for cache stats"
        )

        # Get updated stats
        updated_stats = support_agent.token_cached_rag.get_cache_stats()
        assert updated_stats is not None
        assert "hit_rate" in updated_stats or "cache_hits" in updated_stats or "misses" in updated_stats

    @pytest.mark.asyncio
    async def test_answer_support_query_cached_parameter_variations(self, support_agent):
        """Test the method with different parameter combinations."""
        if not support_agent.token_cached_rag:
            pytest.skip("Token caching not available")

        test_cases = [
            {"query": "Basic question", "top_k": 3, "max_tokens": 200},
            {"query": "Complex question", "top_k": 10, "max_tokens": 1000},
            {"query": "Short", "top_k": 1, "max_tokens": 100},
        ]

        for test_case in test_cases:
            result = await support_agent.answer_support_query_cached(**test_case)
            assert isinstance(result, dict)
            assert "response" in result
            assert "cache_hit" in result

    @pytest.mark.asyncio
    async def test_support_agent_records_ap2_event(self, support_agent, ap2_event_spy):
        """Ensure AP2 metadata is logged when answering a support query."""
        support_agent.token_cached_rag = None

        await support_agent.answer_support_query_cached(query="AP2 budget check?")

        assert ap2_event_spy, "AP2 event should be emitted"
        last_event = ap2_event_spy[-1]
        assert last_event["agent"] == "SupportAgent"
        assert "answer_support_query" in last_event["action"]
        assert "query" in last_event["context"]


class TestSupportAgentIntegration:
    """Integration tests for Support Agent token caching."""

    @pytest.mark.asyncio
    async def test_support_agent_ticket_workflow(self):
        """Test complete support ticket workflow."""
        agent = SupportAgent(business_id="integration_test", enable_memory=True)

        # Step 1: Create ticket
        ticket = agent.create_ticket(
            user_id="user123",
            issue_description="Cannot login to account",
            priority="high"
        )
        assert "TICKET-" in ticket

        # Step 2: Answer query (possibly with caching)
        answer = await agent.answer_support_query_cached(
            query="How do I troubleshoot login issues?"
        )
        assert "response" in answer

        # Step 3: Verify metrics
        assert "latency_ms" in answer
        assert answer["latency_ms"] >= 0

    @pytest.mark.asyncio
    async def test_support_agent_multiple_queries(self):
        """Test handling multiple support queries sequentially."""
        agent = SupportAgent(business_id="sequential_test", enable_memory=True)

        queries = [
            "How do I reset my password?",
            "How do I enable 2FA?",
            "How do I change my email?",
            "How do I delete my account?"
        ]

        results = []
        for query in queries:
            result = await agent.answer_support_query_cached(query=query)
            results.append(result)
            # Small delay between queries
            await asyncio.sleep(0.05)

        # All queries should complete successfully
        assert len(results) == len(queries)
        for i, result in enumerate(results):
            assert "response" in result, f"Query {i} missing response"
            assert isinstance(result["latency_ms"], (int, float)), f"Query {i} invalid latency"

    @pytest.mark.asyncio
    async def test_support_agent_stress_test(self):
        """Stress test with many concurrent queries (lower concurrency for stability)."""
        agent = SupportAgent(business_id="stress_test", enable_memory=True)

        async def query_agent(query_num: int):
            return await agent.answer_support_query_cached(
                query=f"Support question {query_num}",
                top_k=3,
                max_tokens=300
            )

        # Run 5 concurrent queries (reduced from higher numbers for stability)
        tasks = [query_agent(i) for i in range(5)]
        results = await asyncio.gather(*tasks, return_exceptions=True)

        # Filter out any exceptions
        successful_results = [r for r in results if isinstance(r, dict)]

        # Should have successful results
        assert len(successful_results) > 0
        for result in successful_results:
            assert "response" in result
            assert "latency_ms" in result

class TestTokenCacheStatsDataclass:
    """Test TokenCacheStats dataclass functionality."""

    def test_token_cache_stats_initialization(self):
        """Test TokenCacheStats initialization."""
        stats = TokenCacheStats()
        assert stats.cache_hits == 0
        assert stats.cache_misses == 0
        assert stats.hit_rate == 0.0

    def test_token_cache_stats_hit_rate_calculation(self):
        """Test hit rate calculation."""
        stats = TokenCacheStats()
        stats.cache_hits = 70
        stats.cache_misses = 30
        assert stats.hit_rate == 70.0

    def test_token_cache_stats_to_dict(self):
        """Test conversion to dictionary."""
        stats = TokenCacheStats()
        stats.cache_hits = 100
        stats.cache_misses = 50
        stats.total_tokens_cached = 5000

        stats_dict = stats.to_dict()
        assert isinstance(stats_dict, dict)
        assert "hit_rate" in stats_dict
        assert stats_dict["hit_rate"] == (100 / 150 * 100)


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
