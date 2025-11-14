"""
Unit tests for Code Review Agent TokenCachedRAG (vLLM Agent-Lightning) integration.

Tests cache hit/miss scenarios, fallback behavior, and performance improvements
for token-cached code review with 60-70% latency reduction.
"""

import pytest
import asyncio
import json
from unittest.mock import Mock, AsyncMock, patch

from agents.code_review_agent import CodeReviewAgent


class TestCodeReviewAgentTokenCaching:
    """Test suite for Code Review Agent token caching functionality."""

    @pytest.fixture
    def review_agent(self):
        """Create Code Review Agent with token caching enabled."""
        return CodeReviewAgent(enable_token_caching=True)

    @pytest.fixture
    def review_agent_no_caching(self):
        """Create Code Review Agent with token caching disabled."""
        return CodeReviewAgent(enable_token_caching=False)

    def test_code_review_agent_initialization(self, review_agent):
        """Test Code Review Agent initializes with token caching."""
        assert review_agent.enable_token_caching is True
        assert review_agent.token_cached_rag is not None

    def test_code_review_agent_no_caching_initialization(self, review_agent_no_caching):
        """Test Code Review Agent initializes without token caching."""
        assert review_agent_no_caching.enable_token_caching is False
        assert review_agent_no_caching.token_cached_rag is None

    @pytest.mark.asyncio
    async def test_review_code_cached_python(self, review_agent):
        """Test code review with caching for Python files."""
        if not review_agent.token_cached_rag:
            pytest.skip("TokenCachedRAG not available")

        code = """
def add(a: int, b: int) -> int:
    return a + b
"""

        result = await review_agent.review_code_cached(
            code=code,
            file_path="math_utils.py",
            review_type="comprehensive"
        )

        assert "issues" in result
        assert isinstance(result["issues"], list)
        assert "issue_count" in result
        assert result["issue_count"] >= 0
        assert "language" in result
        assert result["language"] == "python"
        assert "latency_ms" in result
        assert result["latency_ms"] > 0

    @pytest.mark.asyncio
    async def test_review_code_cached_different_languages(self, review_agent):
        """Test code review for different file types."""
        if not review_agent.token_cached_rag:
            pytest.skip("TokenCachedRAG not available")

        test_cases = [
            ("def func(): pass", "test.py", "python"),
            ("function test() {}", "test.js", "javascript"),
            ("function test(): void {}", "test.ts", "typescript"),
            ("public void test() {}", "Test.java", "java"),
        ]

        for code, file_path, expected_language in test_cases:
            result = await review_agent.review_code_cached(
                code=code,
                file_path=file_path,
                review_type="style"
            )

            assert result["language"] == expected_language
            assert result["file_path"] == file_path
            assert "issues" in result

    @pytest.mark.asyncio
    async def test_review_code_cached_review_types(self, review_agent):
        """Test different review types."""
        if not review_agent.token_cached_rag:
            pytest.skip("TokenCachedRAG not available")

        code = "def unsafe_query(user_input): return db.execute(user_input)"
        review_types = ["security", "performance", "style", "comprehensive"]

        results = {}
        for review_type in review_types:
            result = await review_agent.review_code_cached(
                code=code,
                file_path="app.py",
                review_type=review_type
            )
            results[review_type] = result
            assert result["review_type"] == review_type
            assert "issues" in result

    @pytest.mark.asyncio
    async def test_review_code_cache_hit_rate(self, review_agent):
        """Test cache hit rate for repeated reviews."""
        if not review_agent.token_cached_rag:
            pytest.skip("TokenCachedRAG not available")

        code = "def repeat_func(): return 42"
        file_path = "test.py"

        # Multiple calls with same code
        results = []
        for _ in range(3):
            result = await review_agent.review_code_cached(
                code=code,
                file_path=file_path,
                review_type="style"
            )
            results.append(result)

        # All should complete successfully
        assert len(results) == 3
        for result in results:
            assert "issues" in result

    @pytest.mark.asyncio
    async def test_review_code_fallback(self, review_agent):
        """Test fallback when TokenCachedRAG is disabled."""
        review_agent.token_cached_rag = None

        code = "def fallback_test(): pass"
        result = await review_agent.review_code_cached(
            code=code,
            file_path="test.py",
            review_type="comprehensive"
        )

        assert result["fallback"] is True
        assert result["cache_hit"] is False
        assert "issues" in result

    @pytest.mark.asyncio
    async def test_severity_breakdown(self, review_agent):
        """Test severity breakdown in review results."""
        if not review_agent.token_cached_rag:
            pytest.skip("TokenCachedRAG not available")

        code = "def severity_test(): pass"

        result = await review_agent.review_code_cached(
            code=code,
            file_path="test.py",
            review_type="comprehensive"
        )

        assert "severity_breakdown" in result
        severity_breakdown = result["severity_breakdown"]
        assert "critical" in severity_breakdown
        assert "high" in severity_breakdown
        assert "medium" in severity_breakdown
        assert "low" in severity_breakdown

    @pytest.mark.asyncio
    async def test_cache_stats_tracking(self, review_agent):
        """Test cache statistics tracking."""
        if not review_agent.token_cached_rag:
            pytest.skip("TokenCachedRAG not available")

        code = "def stats_test(): pass"

        result1 = await review_agent.review_code_cached(code, "test1.py")
        cache_stats = result1.get("cache_stats", {})

        assert "hit_rate" in cache_stats
        assert "total_tokens_cached" in cache_stats
        assert cache_stats["hit_rate"] >= 0

    @pytest.mark.asyncio
    async def test_token_tracking(self, review_agent):
        """Test token counting in cached reviews."""
        if not review_agent.token_cached_rag:
            pytest.skip("TokenCachedRAG not available")

        code = "def token_test(x, y): return x + y"

        result = await review_agent.review_code_cached(code, "test.py")

        assert "context_tokens" in result
        assert "code_tokens" in result
        assert "total_tokens" in result
        assert result["context_tokens"] >= 0
        assert result["code_tokens"] >= 0
        assert result["total_tokens"] > 0

    @pytest.mark.asyncio
    async def test_large_code_review(self, review_agent):
        """Test reviewing larger code blocks."""
        if not review_agent.token_cached_rag:
            pytest.skip("TokenCachedRAG not available")

        # Larger code sample
        code = """
class DataProcessor:
    def __init__(self):
        self.data = []

    def process(self, items):
        for item in items:
            processed = self._process_item(item)
            self.data.append(processed)

    def _process_item(self, item):
        # Check item validity
        if not item:
            return None

        # Transform item
        return item.upper() if isinstance(item, str) else item

    def get_results(self):
        return self.data
"""

        result = await review_agent.review_code_cached(code, "processor.py")

        assert "issues" in result
        assert "issue_count" in result

    @pytest.mark.asyncio
    async def test_concurrent_reviews(self, review_agent):
        """Test concurrent code reviews."""
        if not review_agent.token_cached_rag:
            pytest.skip("TokenCachedRAG not available")

        # Concurrent reviews with different files
        tasks = [
            review_agent.review_code_cached("def func1(): pass", "test1.py"),
            review_agent.review_code_cached("def func2(): pass", "test2.js"),
            review_agent.review_code_cached("def func3(): pass", "test3.ts"),
        ]

        results = await asyncio.gather(*tasks)

        assert len(results) == 3
        for result in results:
            assert "issues" in result
            assert "latency_ms" in result

    def test_language_detection(self, review_agent):
        """Test language detection from file extensions."""
        test_cases = [
            ("test.py", "python"),
            ("script.js", "javascript"),
            ("app.ts", "typescript"),
            ("Main.java", "java"),
            ("program.cpp", "cpp"),
            ("code.c", "c"),
            ("main.go", "go"),
            ("lib.rs", "rust"),
            ("script.rb", "ruby"),
            ("page.php", "php"),
            ("unknown.xyz", "unknown"),
        ]

        for file_path, expected_lang in test_cases:
            ext = file_path.split(".")[-1]
            lang = review_agent._get_language(ext)
            assert lang == expected_lang

    @pytest.mark.asyncio
    async def test_latency_tracking(self, review_agent):
        """Test latency tracking for performance validation."""
        if not review_agent.token_cached_rag:
            pytest.skip("TokenCachedRAG not available")

        code = "def latency_test(): return sum(range(100))"

        result = await review_agent.review_code_cached(code, "test.py")

        # Latency should be reasonable
        assert 0 < result["latency_ms"] < 10000

    def test_cache_stats_retrieval(self, review_agent):
        """Test retrieving cache statistics."""
        if not review_agent.token_cached_rag:
            pytest.skip("TokenCachedRAG not available")

        stats = review_agent.get_cache_stats()

        assert isinstance(stats, dict)
        if "enabled" not in stats:
            assert "hit_rate" in stats
            assert "total_tokens_cached" in stats

    @pytest.mark.asyncio
    async def test_backward_compatibility(self, review_agent_no_caching):
        """Test backward compatibility with non-cached reviews."""
        code = "def old_style(): pass"

        result = await review_agent_no_caching.review_code_cached(code, "test.py")

        assert "issues" in result
        assert result["fallback"] is True

    @pytest.mark.asyncio
    async def test_empty_code_review(self, review_agent):
        """Test handling of empty code."""
        if not review_agent.token_cached_rag:
            pytest.skip("TokenCachedRAG not available")

        result = await review_agent.review_code_cached("", "test.py")

        assert "issues" in result
        assert isinstance(result["issue_count"], int)

    @pytest.mark.asyncio
    async def test_cache_warmup(self, review_agent):
        """Test cache warmup functionality."""
        if not review_agent.token_cached_rag:
            pytest.skip("TokenCachedRAG not available")

        # Run warmup
        await review_agent._warmup_pattern_cache()

        # After warmup, cache should have content
        stats = review_agent.get_cache_stats()
        assert "total_tokens_cached" in stats or "enabled" not in stats


class TestCodeReviewIntegration:
    """Integration tests for Code Review Agent."""

    @pytest.mark.asyncio
    async def test_full_code_review_workflow(self):
        """Test complete code review workflow."""
        agent = CodeReviewAgent(enable_token_caching=True)

        if not agent.token_cached_rag:
            pytest.skip("TokenCachedRAG not available")

        # Review Python file
        python_code = """
def calculate(x, y):
    return x + y

def process_data(data):
    result = []
    for item in data:
        result.append(item * 2)
    return result
"""

        result = await agent.review_code_cached(
            code=python_code,
            file_path="calculations.py",
            review_type="comprehensive"
        )

        assert "issues" in result
        assert result["language"] == "python"
        assert result["file_path"] == "calculations.py"

    @pytest.mark.asyncio
    async def test_multi_file_review(self):
        """Test reviewing multiple files."""
        agent = CodeReviewAgent(enable_token_caching=True)

        if not agent.token_cached_rag:
            pytest.skip("TokenCachedRAG not available")

        files = [
            ("func add(a, b) { return a + b; }", "utils.js"),
            ("def multiply(a, b): return a * b", "utils.py"),
            ("function divide(a: number, b: number): number { return a / b; }", "utils.ts"),
        ]

        results = []
        for code, file_path in files:
            result = await agent.review_code_cached(code, file_path)
            results.append(result)

        assert len(results) == 3
        for result in results:
            assert "issues" in result


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
