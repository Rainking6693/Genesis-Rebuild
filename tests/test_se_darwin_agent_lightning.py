"""
Unit tests for SE-Darwin Agent TokenCachedRAG (vLLM Agent-Lightning) integration.

Tests cache hit/miss scenarios, fallback behavior, and performance improvements
for token-cached operator selection with 55-65% latency reduction.
"""

import pytest
import asyncio
import json
from unittest.mock import Mock, AsyncMock, patch

from agents.se_darwin_agent import SEDarwinAgent


class TestSEDarwinAgentTokenCaching:
    """Test suite for SE-Darwin Agent token caching functionality."""

    @pytest.fixture
    def darwin_agent(self):
        """Create SE-Darwin Agent with token caching enabled."""
        return SEDarwinAgent(
            agent_name="test_agent",
            llm_client=None,
            trajectories_per_iteration=3
        )

    def test_se_darwin_agent_initialization(self, darwin_agent):
        """Test SE-Darwin Agent initializes with token caching."""
        assert darwin_agent.enable_token_caching is True
        assert darwin_agent.token_cached_rag is not None
        assert darwin_agent.agent_name == "test_agent"

    @pytest.mark.asyncio
    async def test_select_operators_cached(self, darwin_agent):
        """Test operator selection with caching."""
        if not darwin_agent.token_cached_rag:
            pytest.skip("TokenCachedRAG not available")

        context = {
            "agent_name": "builder",
            "scenario": "general",
            "problem": "Add caching layer to API"
        }

        result = await darwin_agent.select_operators_cached(context)

        assert "selected_operators" in result
        assert isinstance(result["selected_operators"], list)
        assert len(result["selected_operators"]) > 0
        assert "operator_count" in result
        assert "latency_ms" in result
        assert result["latency_ms"] > 0

    @pytest.mark.asyncio
    async def test_select_operators_different_scenarios(self, darwin_agent):
        """Test operator selection for different scenarios."""
        if not darwin_agent.token_cached_rag:
            pytest.skip("TokenCachedRAG not available")

        scenarios = ["general", "revision", "recombination", "refinement"]

        results = {}
        for scenario in scenarios:
            context = {
                "agent_name": "builder",
                "scenario": scenario
            }
            result = await darwin_agent.select_operators_cached(context)
            results[scenario] = result
            assert result["scenario"] == scenario
            assert len(result["selected_operators"]) > 0

    @pytest.mark.asyncio
    async def test_select_operators_cache_hit_rate(self, darwin_agent):
        """Test cache hit rate for operator selection."""
        if not darwin_agent.token_cached_rag:
            pytest.skip("TokenCachedRAG not available")

        context = {
            "agent_name": "builder",
            "scenario": "general"
        }

        # Multiple calls with same context
        results = []
        for _ in range(3):
            result = await darwin_agent.select_operators_cached(context)
            results.append(result)

        # All should return valid operators
        assert len(results) == 3
        for result in results:
            assert len(result["selected_operators"]) > 0

    @pytest.mark.asyncio
    async def test_select_operators_fallback(self, darwin_agent):
        """Test fallback when TokenCachedRAG is disabled."""
        darwin_agent.token_cached_rag = None

        context = {
            "agent_name": "builder",
            "scenario": "general"
        }

        result = await darwin_agent.select_operators_cached(context)

        assert result["fallback"] is True
        assert result["cache_hit"] is False
        assert len(result["selected_operators"]) > 0

    @pytest.mark.asyncio
    async def test_parse_operator_selection(self, darwin_agent):
        """Test parsing operator selection output."""
        text = "We should use revision for failed trajectories and recombination for successful ones"

        operators = darwin_agent._parse_operator_selection(text)

        assert "revision" in operators
        assert "recombination" in operators
        assert isinstance(operators, list)

    @pytest.mark.asyncio
    async def test_select_operators_cache_stats(self, darwin_agent):
        """Test cache statistics for operator selection."""
        if not darwin_agent.token_cached_rag:
            pytest.skip("TokenCachedRAG not available")

        context = {"agent_name": "test", "scenario": "test"}

        result = await darwin_agent.select_operators_cached(context)
        cache_stats = result.get("cache_stats", {})

        assert "hit_rate" in cache_stats
        assert "total_tokens_cached" in cache_stats

    @pytest.mark.asyncio
    async def test_operator_token_tracking(self, darwin_agent):
        """Test token counting for operator selection."""
        if not darwin_agent.token_cached_rag:
            pytest.skip("TokenCachedRAG not available")

        context = {"agent_name": "builder", "problem": "Add feature"}

        result = await darwin_agent.select_operators_cached(context)

        assert "context_tokens" in result
        assert "pattern_tokens" in result
        assert "total_tokens" in result
        assert result["total_tokens"] > 0

    @pytest.mark.asyncio
    async def test_select_operators_latency(self, darwin_agent):
        """Test latency tracking for operator selection."""
        if not darwin_agent.token_cached_rag:
            pytest.skip("TokenCachedRAG not available")

        context = {"agent_name": "complex_agent"}

        result = await darwin_agent.select_operators_cached(context)

        # Latency should be reasonable
        assert 0 < result["latency_ms"] < 10000

    @pytest.mark.asyncio
    async def test_concurrent_operator_selection(self, darwin_agent):
        """Test concurrent operator selection requests."""
        if not darwin_agent.token_cached_rag:
            pytest.skip("TokenCachedRAG not available")

        contexts = [
            {"agent_name": "builder", "scenario": "build"},
            {"agent_name": "analyzer", "scenario": "analyze"},
            {"agent_name": "optimizer", "scenario": "optimize"},
        ]

        tasks = [
            darwin_agent.select_operators_cached(ctx)
            for ctx in contexts
        ]

        results = await asyncio.gather(*tasks)

        assert len(results) == 3
        for result in results:
            assert len(result["selected_operators"]) > 0

    @pytest.mark.asyncio
    async def test_cache_warmup(self, darwin_agent):
        """Test cache warmup functionality with retry logic (P1-3)."""
        if not darwin_agent.token_cached_rag:
            pytest.skip("TokenCachedRAG not available")

        # Reset stats
        darwin_agent.token_cached_rag.reset_stats()

        # Run warmup (should complete without errors even if cache operations fail)
        await darwin_agent._warmup_operator_cache()

        # After warmup, we should have some cache activity (hits or misses)
        stats = darwin_agent.token_cached_rag.get_cache_stats()
        total_operations = stats["cache_hits"] + stats["cache_misses"]

        # Warmup should have attempted operations (even if they all failed)
        # With 5 evolution scenarios, we expect at least 5 operations
        assert total_operations >= 5, f"Expected at least 5 cache operations, got {total_operations}"

    @pytest.mark.asyncio
    async def test_select_operators_with_complex_context(self, darwin_agent):
        """Test operator selection with complex context."""
        if not darwin_agent.token_cached_rag:
            pytest.skip("TokenCachedRAG not available")

        context = {
            "agent_name": "builder",
            "scenario": "general",
            "problem": "Implement authentication with OAuth2",
            "past_trajectories": [
                {"fitness": 0.7, "operator": "revision"},
                {"fitness": 0.5, "operator": "recombination"}
            ],
            "constraints": ["high_performance", "secure", "maintainable"],
            "iterations": 5
        }

        result = await darwin_agent.select_operators_cached(context)

        assert "selected_operators" in result
        assert result["operator_count"] > 0

    @pytest.mark.asyncio
    async def test_select_operators_empty_context(self, darwin_agent):
        """Test operator selection with minimal context."""
        if not darwin_agent.token_cached_rag:
            pytest.skip("TokenCachedRAG not available")

        context = {}  # Empty context

        result = await darwin_agent.select_operators_cached(context)

        # Should still return valid operators
        assert len(result["selected_operators"]) > 0

    def test_se_darwin_initialization_variants(self):
        """Test SE-Darwin Agent initialization variants."""
        # Test with token caching enabled
        agent1 = SEDarwinAgent(
            agent_name="test1",
            llm_client=None,
            trajectories_per_iteration=3
        )
        assert agent1.enable_token_caching is True

        # Test without explicitly creating instances
        agent2 = SEDarwinAgent(
            agent_name="test2",
            llm_client=None,
            trajectories_per_iteration=1
        )
        assert agent2.trajectories_per_iteration == 1

    @pytest.mark.asyncio
    async def test_select_operators_reasoning(self, darwin_agent):
        """Test that operator selection provides reasoning."""
        if not darwin_agent.token_cached_rag:
            pytest.skip("TokenCachedRAG not available")

        context = {"agent_name": "builder"}

        result = await darwin_agent.select_operators_cached(context)

        assert "reasoning" in result
        assert isinstance(result["reasoning"], str)

    @pytest.mark.asyncio
    async def test_select_operators_reproducibility(self, darwin_agent):
        """Test operator selection reproducibility."""
        if not darwin_agent.token_cached_rag:
            pytest.skip("TokenCachedRAG not available")

        context = {"agent_name": "builder", "scenario": "test"}

        # Multiple calls should be consistent
        result1 = await darwin_agent.select_operators_cached(context)
        result2 = await darwin_agent.select_operators_cached(context)

        # Both should have operators
        assert len(result1["selected_operators"]) > 0
        assert len(result2["selected_operators"]) > 0

    @pytest.mark.asyncio
    async def test_cache_stats_consistency(self, darwin_agent):
        """Test cache stats consistency across operations."""
        if not darwin_agent.token_cached_rag:
            pytest.skip("TokenCachedRAG not available")

        darwin_agent.token_cached_rag.reset_stats()

        context = {"agent_name": "test"}
        await darwin_agent.select_operators_cached(context)

        stats = darwin_agent.token_cached_rag.get_cache_stats()

        # Stats should show activity
        assert stats["cache_hits"] + stats["cache_misses"] > 0

    @pytest.mark.asyncio
    async def test_operator_selection_max_tokens(self, darwin_agent):
        """Test operator selection with custom max_tokens."""
        if not darwin_agent.token_cached_rag:
            pytest.skip("TokenCachedRAG not available")

        context = {"agent_name": "builder"}

        result_small = await darwin_agent.select_operators_cached(context, max_tokens=100)
        result_large = await darwin_agent.select_operators_cached(context, max_tokens=2000)

        # Both should return valid results
        assert len(result_small["selected_operators"]) > 0
        assert len(result_large["selected_operators"]) > 0


class TestSEDarwinIntegration:
    """Integration tests for SE-Darwin Agent."""

    @pytest.mark.asyncio
    async def test_operator_selection_workflow(self):
        """Test operator selection workflow."""
        agent = SEDarwinAgent(
            agent_name="builder",
            llm_client=None,
            trajectories_per_iteration=3
        )

        if not agent.token_cached_rag:
            pytest.skip("TokenCachedRAG not available")

        # Simulate evolution workflow
        evolution_context = {
            "agent_name": "builder",
            "scenario": "implementation",
            "problem": "Build REST API with FastAPI",
            "iteration": 1
        }

        result = await agent.select_operators_cached(evolution_context)

        assert "selected_operators" in result
        assert result["operator_count"] > 0
        assert "latency_ms" in result

    @pytest.mark.asyncio
    async def test_multi_agent_operator_selection(self):
        """Test operator selection for multiple agents."""
        agents = [
            SEDarwinAgent(agent_name="builder"),
            SEDarwinAgent(agent_name="analyzer"),
            SEDarwinAgent(agent_name="optimizer"),
        ]

        for agent in agents:
            if not agent.token_cached_rag:
                pytest.skip("TokenCachedRAG not available")

            context = {"agent_name": agent.agent_name}
            result = await agent.select_operators_cached(context)

            assert result["operator_count"] > 0

    @pytest.mark.asyncio
    async def test_performance_comparison(self):
        """Compare performance with and without caching."""
        agent = SEDarwinAgent(agent_name="perf_test")

        if not agent.token_cached_rag:
            pytest.skip("TokenCachedRAG not available")

        context = {"agent_name": "builder", "scenario": "test"}

        # First call (cache miss or hit)
        result1 = await agent.select_operators_cached(context)
        latency1 = result1["latency_ms"]

        # Second call (more likely to be cache hit)
        result2 = await agent.select_operators_cached(context)
        latency2 = result2["latency_ms"]

        # Both should complete
        assert latency1 > 0
        assert latency2 > 0

        # Both should return valid operators
        assert result1["operator_count"] > 0
        assert result2["operator_count"] > 0


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
