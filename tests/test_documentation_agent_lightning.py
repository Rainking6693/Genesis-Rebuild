"""
Unit Tests for Documentation Agent with vLLM Agent-Lightning Token Caching
Tests cache hit/miss scenarios, documentation retrieval, and performance metrics.
"""

import pytest
import asyncio
import time
from unittest.mock import AsyncMock, MagicMock, patch
from agents.documentation_agent import DocumentationAgent, get_documentation_agent
from infrastructure.token_cached_rag import TokenCacheStats


class TestDocumentationAgentTokenCaching:
    """Test Documentation Agent token caching integration."""

    @pytest.fixture
    def doc_agent(self):
        """Create a Documentation Agent instance for testing."""
        agent = DocumentationAgent(business_id="test", enable_memory=True)
        return agent

    @pytest.mark.asyncio
    async def test_documentation_agent_initialization(self, doc_agent):
        """Test that Documentation Agent initializes with token caching."""
        assert doc_agent.business_id == "test"
        assert doc_agent.enable_memory is True
        # Token cache may or may not be initialized depending on Redis availability
        assert doc_agent is not None

    @pytest.mark.asyncio
    async def test_lookup_documentation_cached_without_cache(self, doc_agent):
        """Test fallback when TokenCachedRAG is not available."""
        doc_agent.token_cached_rag = None

        result = await doc_agent.lookup_documentation_cached(
            query="How to use the API?"
        )

        assert result["cache_available"] is False
        assert result["cache_hit"] is False
        assert "documentation" in result
        assert "latency_ms" in result

    @pytest.mark.asyncio
    async def test_lookup_documentation_cached_structure(self, doc_agent):
        """Test that cached response has expected structure."""
        if not doc_agent.token_cached_rag:
            pytest.skip("Token caching not available")

        result = await doc_agent.lookup_documentation_cached(
            query="How to authenticate?",
            top_k=5,
            max_tokens=1000,
            section="api"
        )

        # Check response structure
        assert isinstance(result, dict)
        assert "documentation" in result
        assert "cache_hit" in result
        assert "cache_available" in result
        assert "latency_ms" in result
        assert "cache_stats" in result
        assert "context_tokens" in result
        assert "query_tokens" in result

    @pytest.mark.asyncio
    async def test_lookup_documentation_cached_latency(self, doc_agent):
        """Test that latency measurements are reasonable."""
        if not doc_agent.token_cached_rag:
            pytest.skip("Token caching not available")

        result = await doc_agent.lookup_documentation_cached(
            query="Installation guide"
        )

        # Latency should be non-negative
        assert result["latency_ms"] >= 0

    @pytest.mark.asyncio
    async def test_lookup_documentation_cached_with_section_filter(self, doc_agent):
        """Test documentation lookup with section filtering."""
        if not doc_agent.token_cached_rag:
            pytest.skip("Token caching not available")

        sections = ["api", "guide", "tutorial", "reference"]

        for section in sections:
            result = await doc_agent.lookup_documentation_cached(
                query="How to start?",
                section=section
            )

            assert isinstance(result, dict)
            assert "documentation" in result
            assert "cache_hit" in result

    @pytest.mark.asyncio
    async def test_lookup_documentation_cached_multiple_calls(self, doc_agent):
        """Test cache behavior with multiple calls for same query."""
        if not doc_agent.token_cached_rag:
            pytest.skip("Token caching not available")

        query = "How to authenticate?"

        # First call - likely cache miss
        result1 = await doc_agent.lookup_documentation_cached(query=query)
        cache_stats1 = result1.get("cache_stats")

        # Wait a moment
        await asyncio.sleep(0.1)

        # Second call - likely cache hit
        result2 = await doc_agent.lookup_documentation_cached(query=query)
        cache_stats2 = result2.get("cache_stats")

        assert isinstance(result1, dict)
        assert isinstance(result2, dict)

        # Cache stats should exist
        if cache_stats2:
            # After multiple calls, we should see some cache activity
            assert "hit_rate" in cache_stats2 or "cache_hits" in cache_stats2

    @pytest.mark.asyncio
    async def test_lookup_documentation_cached_different_queries(self, doc_agent):
        """Test that different queries are handled independently."""
        if not doc_agent.token_cached_rag:
            pytest.skip("Token caching not available")

        queries = [
            "How to install?",
            "How to configure?",
            "How to deploy?",
            "How to troubleshoot?",
            "How to update?"
        ]

        results = []
        for query in queries:
            result = await doc_agent.lookup_documentation_cached(query=query)
            results.append(result)

        # All results should be valid
        assert len(results) == len(queries)
        for result in results:
            assert "documentation" in result
            assert "cache_hit" in result
            assert "latency_ms" in result

    @pytest.mark.asyncio
    async def test_lookup_documentation_cached_error_handling(self, doc_agent):
        """Test graceful fallback on cache errors."""
        if not doc_agent.token_cached_rag:
            pytest.skip("Token caching not available")

        # Mock the generate_with_rag to raise an error
        original_generate = doc_agent.token_cached_rag.generate_with_rag
        doc_agent.token_cached_rag.generate_with_rag = AsyncMock(
            side_effect=Exception("Cache error")
        )

        result = await doc_agent.lookup_documentation_cached(
            query="Test query"
        )

        # Should gracefully fall back
        assert result["cache_available"] is False
        assert "cache_error" in result or "documentation" in result

        # Restore original method
        doc_agent.token_cached_rag.generate_with_rag = original_generate

    @pytest.mark.asyncio
    async def test_generate_documentation(self, doc_agent):
        """Test documentation generation."""
        result = await doc_agent.generate_documentation(
            topic="REST API",
            doc_type="api",
            specifications="RESTful API specification"
        )

        assert result["success"] is True
        assert "doc_id" in result
        assert "documentation" in result

    @pytest.mark.asyncio
    async def test_update_documentation(self, doc_agent):
        """Test documentation update with cache invalidation."""
        # First generate a document
        gen_result = await doc_agent.generate_documentation(
            topic="Test Topic",
            doc_type="guide"
        )

        if gen_result["success"]:
            doc_id = gen_result["doc_id"]

            # Update the documentation
            update_result = await doc_agent.update_documentation(
                doc_id=doc_id,
                content="Updated documentation content",
                invalidate_cache=True
            )

            assert update_result["success"] is True
            assert update_result["doc_id"] == doc_id

    @pytest.mark.asyncio
    async def test_search_documentation(self, doc_agent):
        """Test documentation search."""
        # Generate some docs first
        await doc_agent.generate_documentation(
            topic="Installation Guide",
            doc_type="guide"
        )

        await doc_agent.generate_documentation(
            topic="API Reference",
            doc_type="api"
        )

        # Search for docs
        results = await doc_agent.search_documentation(query="Installation")

        assert isinstance(results, list)
        # Should find at least the generated docs

    @pytest.mark.asyncio
    async def test_token_cache_stats_tracking(self, doc_agent):
        """Test that cache statistics are properly tracked."""
        if not doc_agent.token_cached_rag:
            pytest.skip("Token caching not available")

        # Get initial stats
        initial_stats = doc_agent.token_cached_rag.get_cache_stats()
        assert initial_stats is not None

        # Make a cached query
        await doc_agent.lookup_documentation_cached(
            query="Test query for cache stats"
        )

        # Get updated stats
        updated_stats = doc_agent.token_cached_rag.get_cache_stats()
        assert updated_stats is not None
        assert "hit_rate" in updated_stats or "cache_hits" in updated_stats or "misses" in updated_stats

    @pytest.mark.asyncio
    async def test_get_cache_stats(self, doc_agent):
        """Test cache stats retrieval."""
        stats = doc_agent.get_cache_stats()

        if doc_agent.token_cached_rag:
            assert stats is not None
            assert isinstance(stats, dict)
        else:
            assert stats is None

    @pytest.mark.asyncio
    async def test_clear_cache(self, doc_agent):
        """Test cache clearing."""
        if not doc_agent.token_cached_rag:
            pytest.skip("Token caching not available")

        cleared = await doc_agent.clear_cache()

        # Should return a count (even if 0)
        assert isinstance(cleared, int)
        assert cleared >= 0

    @pytest.mark.asyncio
    async def test_lookup_documentation_cached_parameter_variations(self, doc_agent):
        """Test the method with different parameter combinations."""
        if not doc_agent.token_cached_rag:
            pytest.skip("Token caching not available")

        test_cases = [
            {"query": "Basic question", "top_k": 3, "max_tokens": 500, "section": "guide"},
            {"query": "Complex question", "top_k": 10, "max_tokens": 1500, "section": "api"},
            {"query": "Short", "top_k": 1, "max_tokens": 300, "section": None},
        ]

        for test_case in test_cases:
            result = await doc_agent.lookup_documentation_cached(**test_case)
            assert isinstance(result, dict)
            assert "documentation" in result
            assert "cache_hit" in result

    @pytest.mark.asyncio
    async def test_documentation_agent_factory(self):
        """Test agent factory method."""
        agent1 = get_documentation_agent(business_id="factory_test", enable_memory=True)
        assert agent1 is not None
        assert agent1.business_id == "factory_test" or agent1.business_id == "default"

    @pytest.mark.asyncio
    async def test_documentation_agent_initialization_without_memory(self):
        """Test initialization without memory (token caching disabled)."""
        agent = DocumentationAgent(business_id="no_memory", enable_memory=False)

        assert agent.token_cached_rag is None
        assert agent.enable_memory is False


class TestDocumentationAgentIntegration:
    """Integration tests for Documentation Agent token caching."""

    @pytest.mark.asyncio
    async def test_documentation_agent_complete_workflow(self):
        """Test complete documentation workflow."""
        agent = DocumentationAgent(business_id="workflow_test", enable_memory=True)

        # Step 1: Generate documentation
        gen_result = await agent.generate_documentation(
            topic="Getting Started",
            doc_type="guide",
            specifications="Quick start guide"
        )
        assert gen_result["success"] is True

        # Step 2: Look up documentation (with caching)
        lookup_result = await agent.lookup_documentation_cached(
            query="Getting started",
            section="guide"
        )
        assert "documentation" in lookup_result
        assert "latency_ms" in lookup_result

        # Step 3: Search documentation
        search_results = await agent.search_documentation("Getting")
        assert isinstance(search_results, list)

    @pytest.mark.asyncio
    async def test_documentation_agent_multiple_lookups(self):
        """Test handling multiple documentation lookups."""
        agent = DocumentationAgent(business_id="multi_lookup_test", enable_memory=True)

        queries = [
            "How to install?",
            "How to configure?",
            "How to use?",
            "How to deploy?"
        ]

        results = []
        for query in queries:
            result = await agent.lookup_documentation_cached(query=query)
            results.append(result)
            await asyncio.sleep(0.05)

        # All queries should complete successfully
        assert len(results) == len(queries)
        for i, result in enumerate(results):
            assert "documentation" in result, f"Query {i} missing documentation"
            assert isinstance(result["latency_ms"], (int, float)), f"Query {i} invalid latency"

    @pytest.mark.asyncio
    async def test_documentation_agent_stress_test(self):
        """Stress test with many concurrent queries."""
        agent = DocumentationAgent(business_id="stress_test", enable_memory=True)

        async def query_agent(query_num: int):
            return await agent.lookup_documentation_cached(
                query=f"Documentation query {query_num}",
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
            assert "documentation" in result
            assert "latency_ms" in result

    @pytest.mark.asyncio
    async def test_documentation_agent_cache_invalidation(self):
        """Test cache invalidation on documentation update."""
        agent = DocumentationAgent(business_id="cache_inv_test", enable_memory=True)

        # Generate a document
        gen_result = await agent.generate_documentation(
            topic="Test Document",
            doc_type="guide"
        )

        if gen_result["success"]:
            doc_id = gen_result["doc_id"]

            # Get cache stats before update
            stats_before = agent.get_cache_stats()

            # Update document with cache invalidation
            update_result = await agent.update_documentation(
                doc_id=doc_id,
                content="Updated content",
                invalidate_cache=True
            )

            assert update_result["success"] is True

            # Cache should have been cleared
            if agent.token_cached_rag:
                assert "cache_cleared" in update_result


class TestDocumentationAgentEdgeCases:
    """Test edge cases and error handling."""

    @pytest.mark.asyncio
    async def test_update_nonexistent_document(self):
        """Test updating a nonexistent document."""
        agent = DocumentationAgent(business_id="edge_test", enable_memory=True)

        result = await agent.update_documentation(
            doc_id="nonexistent_id",
            content="New content"
        )

        assert result["success"] is False
        assert "error" in result

    @pytest.mark.asyncio
    async def test_empty_search_query(self):
        """Test search with empty query."""
        agent = DocumentationAgent(business_id="edge_test", enable_memory=True)

        results = await agent.search_documentation(query="")
        assert isinstance(results, list)

    @pytest.mark.asyncio
    async def test_very_long_query(self):
        """Test with very long query."""
        agent = DocumentationAgent(business_id="edge_test", enable_memory=True)

        long_query = "This is a very long query " * 50

        result = await agent.lookup_documentation_cached(query=long_query)
        assert isinstance(result, dict)
        assert "documentation" in result


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
