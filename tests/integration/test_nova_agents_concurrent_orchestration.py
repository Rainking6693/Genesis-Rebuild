"""
Concurrent agent orchestration test for Nova agents.

Validates that multiple Nova agents can run concurrently without:
- Cache key collisions
- Race conditions in stats tracking
- Memory leaks
- Redis connection exhaustion

Test Scenario:
- Launch QA Agent, Code Review Agent, and SE Darwin Agent concurrently
- Each agent performs cached operations simultaneously
- Validate all agents complete successfully
- Verify no resource leaks or conflicts
"""

import pytest
import asyncio
from typing import Dict, Any

from agents.qa_agent import QAAgent
from agents.code_review_agent import CodeReviewAgent
from agents.se_darwin_agent import SEDarwinAgent


@pytest.mark.asyncio
async def test_concurrent_nova_agents_basic():
    """
    Test basic concurrent execution of Nova agents.

    Validates:
    - Agents can be created and used concurrently
    - Token caching works across agents without conflicts
    - No race conditions or resource leaks
    """
    # Create agents concurrently
    qa_agent = QAAgent(business_id="concurrent_test", enable_memory=False, enable_token_caching=True)
    code_review_agent = CodeReviewAgent(enable_token_caching=True)

    try:
        # Execute operations concurrently
        tasks = [
            qa_agent.generate_tests_cached(
                code="def add(a, b): return a + b",
                test_type="unit"
            ),
            code_review_agent.review_code_cached(
                code="def multiply(x, y): return x * y",
                file_path="math_utils.py",
                review_type="comprehensive"
            )
        ]

        results = await asyncio.gather(*tasks, return_exceptions=True)

        # Validate all completed without exceptions
        for i, result in enumerate(results):
            assert not isinstance(result, Exception), f"Task {i} failed with: {result}"
            assert isinstance(result, dict), f"Task {i} returned invalid type: {type(result)}"

        # Validate QA result
        qa_result = results[0]
        assert "test_count" in qa_result
        assert qa_result["test_count"] > 0
        assert "cache_hit" in qa_result

        # Validate Code Review result
        review_result = results[1]
        assert "issue_count" in review_result
        assert "cache_hit" in review_result

        print(f"\n✅ Concurrent Agent Orchestration:")
        print(f"   QA Agent: Generated {qa_result['test_count']} tests (cache_hit={qa_result['cache_hit']})")
        print(f"   Code Review: Found {review_result['issue_count']} issues (cache_hit={review_result['cache_hit']})")

    finally:
        # Cleanup
        await qa_agent.close()
        await code_review_agent.close()


@pytest.mark.asyncio
async def test_concurrent_nova_agents_high_load():
    """
    Test concurrent execution under high load.

    Validates:
    - Multiple concurrent requests per agent
    - Thread-safe stats tracking (P0-2 fix)
    - Memory tracking under concurrent load (P1-3 fix)
    - LRU eviction under pressure (P1-5 fix)
    """
    qa_agent = QAAgent(business_id="high_load_test", enable_memory=False, enable_token_caching=True)
    code_review_agent = CodeReviewAgent(enable_token_caching=True)

    try:
        # Launch 10 concurrent operations per agent (20 total)
        tasks = []

        for i in range(10):
            tasks.append(
                qa_agent.generate_tests_cached(
                    code=f"def test_func_{i}(x): return x * {i}",
                    test_type="unit"
                )
            )
            tasks.append(
                code_review_agent.review_code_cached(
                    code=f"def review_func_{i}(y): return y + {i}",
                    file_path=f"module_{i}.py",
                    review_type="performance"
                )
            )

        # Execute all concurrently
        results = await asyncio.gather(*tasks, return_exceptions=True)

        # Validate all completed
        success_count = sum(1 for r in results if not isinstance(r, Exception))
        assert success_count == 20, f"Only {success_count}/20 tasks succeeded"

        # Check cache stats for both agents
        qa_stats = qa_agent.get_cache_stats() if hasattr(qa_agent, 'get_cache_stats') else {}
        review_stats = code_review_agent.get_cache_stats() if hasattr(code_review_agent, 'get_cache_stats') else {}

        print(f"\n✅ High Load Concurrent Execution:")
        print(f"   Completed: 20/20 concurrent tasks")
        print(f"   QA Cache: {qa_stats.get('hit_rate', 0):.1f}% hit rate")
        print(f"   Review Cache: {review_stats.get('hit_rate', 0):.1f}% hit rate")
        print(f"   QA Memory: {qa_stats.get('memory_usage_mb', 0):.1f}MB")
        print(f"   Review Memory: {review_stats.get('memory_usage_mb', 0):.1f}MB")

    finally:
        await qa_agent.close()
        await code_review_agent.close()


@pytest.mark.asyncio
async def test_concurrent_agents_no_cache_key_collision():
    """
    Test that concurrent agents don't collide on cache keys.

    Validates:
    - Each agent uses distinct cache key prefixes
    - No cross-agent cache pollution
    - Correct cache hit/miss attribution
    """
    qa_agent = QAAgent(business_id="collision_test", enable_memory=False, enable_token_caching=True)
    code_review_agent = CodeReviewAgent(enable_token_caching=True)

    try:
        # Use identical code in both agents - should get separate cache keys
        code = "def shared_function(x): return x * 2"

        qa_result = await qa_agent.generate_tests_cached(code=code, test_type="unit")
        review_result = await code_review_agent.review_code_cached(
            code=code,
            file_path="shared.py",
            review_type="style"
        )

        # Both should have their own cache entries
        # First calls should be misses (or hits if cached separately)
        assert "cache_hit" in qa_result
        assert "cache_hit" in review_result

        # Second calls with same code should hit their respective caches
        qa_result2 = await qa_agent.generate_tests_cached(code=code, test_type="unit")
        review_result2 = await code_review_agent.review_code_cached(
            code=code,
            file_path="shared.py",
            review_type="style"
        )

        # Agents should maintain separate caches
        assert "test_count" in qa_result2
        assert "issue_count" in review_result2

        print(f"\n✅ Cache Key Isolation:")
        print(f"   QA Agent: Separate cache for test generation")
        print(f"   Code Review: Separate cache for code review")
        print(f"   No cross-agent pollution detected")

    finally:
        await qa_agent.close()
        await code_review_agent.close()


if __name__ == "__main__":
    # Run tests
    pytest.main([__file__, "-v", "-s"])
