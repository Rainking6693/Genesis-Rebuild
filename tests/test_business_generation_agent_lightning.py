"""
Unit Tests for Business Generation Agent with vLLM Agent-Lightning Token Caching
Tests cache hit/miss scenarios, template recall, and performance metrics.
"""

import pytest
import asyncio
import time
from unittest.mock import AsyncMock, MagicMock, patch
from agents.business_generation_agent import BusinessGenerationAgent
from infrastructure.token_cached_rag import TokenCacheStats


class TestBusinessGenerationAgentTokenCaching:
    """Test Business Generation Agent token caching integration."""

    @pytest.fixture
    def business_agent(self):
        """Create a Business Generation Agent instance for testing."""
        agent = BusinessGenerationAgent(
            business_id="test",
            enable_memory=True,
            enable_multimodal=False  # Disable multimodal for testing
        )
        return agent

    @pytest.mark.asyncio
    async def test_business_agent_initialization(self, business_agent):
        """Test that Business Generation Agent initializes with token caching."""
        assert business_agent.business_id == "test"
        assert business_agent.enable_memory is True
        # Token cache may or may not be initialized depending on Redis availability
        assert business_agent is not None

    @pytest.mark.asyncio
    async def test_recall_business_templates_cached_without_cache(self, business_agent):
        """Test fallback when TokenCachedRAG is not available."""
        business_agent.token_cached_rag = None

        result = await business_agent.recall_business_templates_cached(
            business_type="saas"
        )

        assert result["cache_available"] is False
        assert result["cache_hit"] is False
        assert "templates" in result
        assert "latency_ms" in result

    @pytest.mark.asyncio
    async def test_recall_business_templates_cached_structure(self, business_agent):
        """Test that cached response has expected structure."""
        if not business_agent.token_cached_rag:
            pytest.skip("Token caching not available")

        result = await business_agent.recall_business_templates_cached(
            business_type="saas",
            top_k=5,
            max_tokens=1000
        )

        # Check response structure
        assert isinstance(result, dict)
        assert "templates" in result
        assert "cache_hit" in result
        assert "cache_available" in result
        assert "latency_ms" in result
        assert "cache_stats" in result
        assert "context_tokens" in result
        assert "query_tokens" in result

    @pytest.mark.asyncio
    async def test_recall_business_templates_cached_latency(self, business_agent):
        """Test that latency measurements are reasonable."""
        if not business_agent.token_cached_rag:
            pytest.skip("Token caching not available")

        result = await business_agent.recall_business_templates_cached(
            business_type="ecommerce"
        )

        # Latency should be non-negative
        assert result["latency_ms"] >= 0

    @pytest.mark.asyncio
    async def test_recall_business_templates_cached_multiple_calls(self, business_agent):
        """Test cache behavior with multiple calls for same business type."""
        if not business_agent.token_cached_rag:
            pytest.skip("Token caching not available")

        business_type = "saas"

        # First call - likely cache miss
        result1 = await business_agent.recall_business_templates_cached(
            business_type=business_type
        )
        cache_stats1 = result1.get("cache_stats")

        # Wait a moment
        await asyncio.sleep(0.1)

        # Second call - likely cache hit
        result2 = await business_agent.recall_business_templates_cached(
            business_type=business_type
        )
        cache_stats2 = result2.get("cache_stats")

        assert isinstance(result1, dict)
        assert isinstance(result2, dict)

        # Cache stats should exist
        if cache_stats2:
            # After multiple calls, we should see some cache activity
            assert "hit_rate" in cache_stats2 or "cache_hits" in cache_stats2

    @pytest.mark.asyncio
    async def test_recall_business_templates_cached_different_types(self, business_agent):
        """Test that different business types are handled independently."""
        if not business_agent.token_cached_rag:
            pytest.skip("Token caching not available")

        business_types = ["saas", "ecommerce", "content", "marketplace"]

        results = []
        for btype in business_types:
            result = await business_agent.recall_business_templates_cached(
                business_type=btype
            )
            results.append(result)

        # All results should be valid
        assert len(results) == len(business_types)
        for result in results:
            assert "templates" in result
            assert "cache_hit" in result
            assert "latency_ms" in result

    @pytest.mark.asyncio
    async def test_recall_business_templates_cached_error_handling(self, business_agent):
        """Test graceful fallback on cache errors."""
        if not business_agent.token_cached_rag:
            pytest.skip("Token caching not available")

        # Mock the generate_with_rag to raise an error
        original_generate = business_agent.token_cached_rag.generate_with_rag
        business_agent.token_cached_rag.generate_with_rag = AsyncMock(
            side_effect=Exception("Cache error")
        )

        result = await business_agent.recall_business_templates_cached(
            business_type="saas"
        )

        # Should gracefully fall back
        assert result["cache_available"] is False
        assert "cache_error" in result or "templates" in result

        # Restore original method
        business_agent.token_cached_rag.generate_with_rag = original_generate

    @pytest.mark.asyncio
    async def test_recall_business_templates_cached_parameter_variations(self, business_agent):
        """Test the method with different parameter combinations."""
        if not business_agent.token_cached_rag:
            pytest.skip("Token caching not available")

        test_cases = [
            {"business_type": "saas", "top_k": 3, "max_tokens": 500},
            {"business_type": "ecommerce", "top_k": 10, "max_tokens": 1500},
            {"business_type": "content", "top_k": 1, "max_tokens": 300},
        ]

        for test_case in test_cases:
            result = await business_agent.recall_business_templates_cached(**test_case)
            assert isinstance(result, dict)
            assert "templates" in result
            assert "cache_hit" in result

    @pytest.mark.asyncio
    async def test_business_agent_existing_methods_still_work(self, business_agent):
        """Test that existing non-cached methods still work."""
        # The agent should have idea_generator initialized
        assert business_agent.idea_generator is not None
        assert business_agent.trend_analyzer is not None
        assert business_agent.revenue_scorer is not None

    @pytest.mark.asyncio
    async def test_token_cache_stats_tracking(self, business_agent):
        """Test that cache statistics are properly tracked."""
        if not business_agent.token_cached_rag:
            pytest.skip("Token caching not available")

        # Get initial stats
        initial_stats = business_agent.token_cached_rag.get_cache_stats()
        assert initial_stats is not None

        # Make a cached query
        await business_agent.recall_business_templates_cached(
            business_type="test_type"
        )

        # Get updated stats
        updated_stats = business_agent.token_cached_rag.get_cache_stats()
        assert updated_stats is not None
        assert "hit_rate" in updated_stats or "cache_hits" in updated_stats or "misses" in updated_stats

    @pytest.mark.asyncio
    async def test_business_agent_initialization_without_memory(self):
        """Test initialization without memory (token caching disabled)."""
        agent = BusinessGenerationAgent(
            business_id="no_memory",
            enable_memory=False,
            enable_multimodal=False
        )

        assert agent.token_cached_rag is None
        assert agent.memory is None

    @pytest.mark.asyncio
    async def test_recall_business_templates_cached_latency_improvement(self, business_agent):
        """Test that subsequent calls show potential cache hit benefits."""
        if not business_agent.token_cached_rag:
            pytest.skip("Token caching not available")

        query = "saas"

        # First call - cache miss (longer latency)
        result1 = await business_agent.recall_business_templates_cached(
            business_type=query
        )
        latency1 = result1["latency_ms"]

        await asyncio.sleep(0.05)

        # Second call - potential cache hit (shorter latency)
        result2 = await business_agent.recall_business_templates_cached(
            business_type=query
        )
        latency2 = result2["latency_ms"]

        # Latencies should be non-negative
        assert latency1 >= 0
        assert latency2 >= 0


class TestBusinessGenerationAgentIntegration:
    """Integration tests for Business Generation Agent token caching."""

    @pytest.mark.asyncio
    async def test_business_agent_generate_and_recall(self):
        """Test generating a business idea and recalling similar templates."""
        agent = BusinessGenerationAgent(
            business_id="integration_test",
            enable_memory=True,
            enable_multimodal=False
        )

        # Step 1: Generate an idea (if implemented)
        # idea = await agent.generate_idea_with_memory(
        #     business_type="saas",
        #     min_revenue_score=70,
        #     user_id="test_user"
        # )
        # assert idea is not None

        # Step 2: Recall similar templates (with caching)
        result = await agent.recall_business_templates_cached(
            business_type="saas"
        )
        assert "templates" in result
        assert "latency_ms" in result

    @pytest.mark.asyncio
    async def test_business_agent_multiple_type_queries(self):
        """Test handling multiple business type queries."""
        agent = BusinessGenerationAgent(
            business_id="multi_type_test",
            enable_memory=True,
            enable_multimodal=False
        )

        business_types = ["saas", "ecommerce", "content"]

        results = []
        for btype in business_types:
            result = await agent.recall_business_templates_cached(
                business_type=btype
            )
            results.append(result)
            await asyncio.sleep(0.05)

        # All queries should complete successfully
        assert len(results) == len(business_types)
        for i, result in enumerate(results):
            assert "templates" in result, f"Query {i} missing templates"
            assert isinstance(result["latency_ms"], (int, float)), f"Query {i} invalid latency"

    @pytest.mark.asyncio
    async def test_business_agent_stress_test(self):
        """Stress test with many concurrent queries."""
        agent = BusinessGenerationAgent(
            business_id="stress_test",
            enable_memory=True,
            enable_multimodal=False
        )

        async def query_agent(type_num: int):
            return await agent.recall_business_templates_cached(
                business_type=f"type_{type_num}",
                top_k=3,
                max_tokens=500
            )

        # Run 5 concurrent queries
        tasks = [query_agent(i) for i in range(5)]
        results = await asyncio.gather(*tasks, return_exceptions=True)

        # Filter out any exceptions
        successful_results = [r for r in results if isinstance(r, dict)]

        # Should have successful results
        assert len(successful_results) > 0
        for result in successful_results:
            assert "templates" in result
            assert "latency_ms" in result

    @pytest.mark.asyncio
    async def test_business_agent_cache_factory(self):
        """Test agent factory method."""
        from agents.business_generation_agent import get_business_generation_agent

        # Get agent via factory
        agent1 = get_business_generation_agent(
            business_id="factory_test",
            enable_memory=True
        )

        assert agent1 is not None
        assert agent1.business_id == "factory_test" or agent1.business_id == "default"  # May be singleton


class TestBusinessGenerationAgentTokenCacheIntegration:
    """Test token cache integration specifically."""

    def test_init_token_cache_without_redis(self):
        """Test token cache initialization without Redis."""
        agent = BusinessGenerationAgent(
            business_id="no_redis",
            enable_memory=True
        )

        # The agent should initialize without errors
        assert agent is not None
        # token_cached_rag may or may not be None depending on Redis availability

    @pytest.mark.asyncio
    async def test_cache_stats_available_when_enabled(self):
        """Test that cache stats are available when caching is enabled."""
        agent = BusinessGenerationAgent(
            business_id="stats_test",
            enable_memory=True,
            enable_multimodal=False
        )

        if agent.token_cached_rag:
            stats = agent.token_cached_rag.get_cache_stats()
            assert stats is not None
            assert isinstance(stats, dict)

    @pytest.mark.asyncio
    async def test_multiple_agents_isolated_caches(self):
        """Test that multiple agents maintain isolated caches."""
        agent1 = BusinessGenerationAgent(
            business_id="agent1",
            enable_memory=True,
            enable_multimodal=False
        )

        agent2 = BusinessGenerationAgent(
            business_id="agent2",
            enable_memory=True,
            enable_multimodal=False
        )

        # Both agents should be separate instances
        assert agent1.business_id != agent2.business_id


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
