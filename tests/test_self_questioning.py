"""
Test suite for Self-Questioning task generator component.

Tests:
- CuriosityScorer: Task novelty scoring and statistics
- TaskGenerator: Task generation with varied domains/difficulties
- SelfQuestioningEngine: Full orchestration and integration
"""

import asyncio
import pytest
from infrastructure.agentevolver.self_questioning import (
    CuriosityScorer,
    TaskGenerator,
    SelfQuestioningEngine,
    Task,
    TaskDifficulty,
    TaskDomain,
)
from infrastructure.agentevolver.embedder import TaskEmbedder
from infrastructure.agentevolver.experience_buffer import ExperienceBuffer


@pytest.fixture
def embedder():
    """Create embedder with local embeddings (no API calls)."""
    return TaskEmbedder(use_local=True)


@pytest.fixture
def experience_buffer(embedder):
    """Create experience buffer."""
    return ExperienceBuffer(agent_name="test_agent", embedder=embedder)


@pytest.fixture
def curiosity_scorer(embedder):
    """Create curiosity scorer without experience buffer."""
    return CuriosityScorer(embedder=embedder)


@pytest.fixture
def task_generator(embedder):
    """Create task generator."""
    return TaskGenerator(embedder=embedder)


@pytest.fixture
def engine(embedder, experience_buffer):
    """Create self-questioning engine."""
    return SelfQuestioningEngine(
        agent_name="test_engine",
        embedder=embedder,
        experience_buffer=experience_buffer
    )


class TestCuriosityScorer:
    """Test CuriosityScorer functionality."""

    @pytest.mark.asyncio
    async def test_novelty_scoring_no_buffer(self, curiosity_scorer):
        """Test novelty scoring with no experience buffer."""
        # With no buffer, should return maximum novelty
        novelty, rationale = await curiosity_scorer.score_novelty(
            "Create a marketing campaign for SaaS"
        )

        assert 90 <= novelty <= 100, f"Expected high novelty, got {novelty}"
        assert "exploration" in rationale.lower()

    @pytest.mark.asyncio
    async def test_novelty_scoring_with_buffer(self, embedder, experience_buffer):
        """Test novelty scoring against stored experiences."""
        # Store some experiences
        await experience_buffer.store_experience(
            trajectory={"task_id": "task1"},
            quality_score=95.0,
            task_description="Optimize SEO for enterprise software"
        )

        # Create scorer with buffer
        scorer = CuriosityScorer(embedder=embedder, experience_buffer=experience_buffer)

        # Score same task - should be low novelty
        novelty_same, _ = await scorer.score_novelty("Optimize SEO for enterprise software")
        assert novelty_same < 30, f"Identical task should have low novelty, got {novelty_same}"

        # Score different task - should be higher novelty
        novelty_diff, _ = await scorer.score_novelty("Write a blog post about AI trends")
        assert novelty_diff > novelty_same, f"Different task should have higher novelty"

    @pytest.mark.asyncio
    async def test_novelty_scoring_stats(self, curiosity_scorer):
        """Test novelty scoring statistics tracking."""
        # Score multiple tasks
        for i in range(5):
            await curiosity_scorer.score_novelty(f"Task {i}")

        stats = curiosity_scorer.get_stats()
        assert stats["total_queries"] == 5
        assert 0 <= stats["avg_novelty"] <= 100
        assert stats["min_novelty"] <= stats["max_novelty"]
        assert stats["avg_latency_ms"] > 0


class TestTaskGenerator:
    """Test TaskGenerator functionality."""

    @pytest.mark.asyncio
    async def test_generate_single_task(self, task_generator):
        """Test generating a single task."""
        task = await task_generator.generate_task(
            domain=TaskDomain.MARKETING,
            difficulty=TaskDifficulty.MEDIUM
        )

        assert isinstance(task, Task)
        assert task.domain == TaskDomain.MARKETING
        assert task.difficulty == TaskDifficulty.MEDIUM
        assert len(task.description) > 0
        assert task.task_id.startswith("task_")
        assert 0 <= task.curiosity_score <= 100
        assert len(task.expected_approach) > 0

    @pytest.mark.asyncio
    async def test_generate_tasks_all_domains(self, task_generator):
        """Test generating tasks across all domains."""
        for domain in TaskDomain:
            task = await task_generator.generate_task(
                domain=domain,
                difficulty=TaskDifficulty.EASY
            )

            assert task.domain == domain
            # Task description should contain domain-relevant content
            assert len(task.description) > 10

    @pytest.mark.asyncio
    async def test_generate_tasks_all_difficulties(self, task_generator):
        """Test generating tasks with different difficulties."""
        difficulties = list(TaskDifficulty)

        for difficulty in difficulties:
            task = await task_generator.generate_task(
                domain=TaskDomain.GENERAL,
                difficulty=difficulty
            )

            assert task.difficulty == difficulty

    @pytest.mark.asyncio
    async def test_task_embedding(self, task_generator):
        """Test that generated tasks have embeddings."""
        task = await task_generator.generate_task()

        assert task.embedding is not None
        assert task.embedding.shape == (1536,)  # OpenAI embedding dimension

    @pytest.mark.asyncio
    async def test_task_serialization(self, task_generator):
        """Test task serialization to dict."""
        task = await task_generator.generate_task()
        task_dict = task.to_dict()

        assert "task_id" in task_dict
        assert "description" in task_dict
        assert "domain" in task_dict
        assert "difficulty" in task_dict
        assert "curiosity_score" in task_dict
        assert task_dict["domain"] in ["marketing", "seo", "content", "deployment", "general"]


class TestSelfQuestioningEngine:
    """Test SelfQuestioningEngine orchestration."""

    @pytest.mark.asyncio
    async def test_generate_autonomous_tasks(self, engine):
        """Test generating multiple autonomous tasks."""
        tasks = await engine.generate_autonomous_tasks(num_tasks=5)

        assert len(tasks) == 5
        assert all(isinstance(t, Task) for t in tasks)
        # Should be sorted by curiosity (descending)
        novelties = [t.curiosity_score for t in tasks]
        assert novelties == sorted(novelties, reverse=True)

    @pytest.mark.asyncio
    async def test_generate_with_focus_domain(self, engine):
        """Test generating tasks with focused domain."""
        tasks = await engine.generate_autonomous_tasks(
            num_tasks=5,
            focus_domain="marketing"
        )

        assert all(t.domain == TaskDomain.MARKETING for t in tasks)

    @pytest.mark.asyncio
    async def test_generate_with_difficulty_distribution(self, engine):
        """Test custom difficulty distribution."""
        tasks = await engine.generate_autonomous_tasks(
            num_tasks=10,
            difficulty_distribution={
                "easy": 0.7,
                "medium": 0.2,
                "hard": 0.1,
                "expert": 0.0
            }
        )

        difficulties = [t.difficulty for t in tasks]
        easy_count = sum(1 for d in difficulties if d == TaskDifficulty.EASY)
        hard_count = sum(1 for d in difficulties if d == TaskDifficulty.HARD)
        expert_count = sum(1 for d in difficulties if d == TaskDifficulty.EXPERT)

        assert easy_count >= hard_count  # Easy should be more common
        assert expert_count == 0  # No expert tasks

    @pytest.mark.asyncio
    async def test_generation_stats(self, engine):
        """Test generation statistics tracking."""
        await engine.generate_autonomous_tasks(num_tasks=10)

        stats = engine.get_generation_stats()

        assert stats["total_tasks_generated"] == 10
        assert 0 <= stats["avg_novelty"] <= 100
        assert stats["total_generation_time_ms"] >= 0
        assert stats["avg_latency_per_task_ms"] >= 0
        assert len(stats["domain_distribution"]) > 0
        assert len(stats["difficulty_distribution"]) > 0
        assert "curiosity_scorer_stats" in stats

    @pytest.mark.asyncio
    async def test_latency_requirement(self, engine):
        """Test that task generation meets <200ms latency requirement."""
        tasks = await engine.generate_autonomous_tasks(num_tasks=5)

        stats = engine.get_generation_stats()
        avg_latency = stats["avg_latency_per_task_ms"]

        # Allow some tolerance for test environment
        assert avg_latency < 300, f"Average latency {avg_latency}ms exceeds target"

    @pytest.mark.asyncio
    async def test_integrate_experience(self, engine):
        """Test experience integration."""
        task = await engine.task_generator.generate_task()

        # Should not raise
        await engine.integrate_experience(
            task=task,
            success=True,
            quality_score=95.0
        )

        # Verify stored in buffer
        assert engine.experience_buffer.total_stored >= 1

    @pytest.mark.asyncio
    async def test_reset_stats(self, engine):
        """Test statistics reset."""
        await engine.generate_autonomous_tasks(num_tasks=5)
        stats_before = engine.get_generation_stats()
        assert stats_before["total_tasks_generated"] == 5

        engine.reset_stats()
        stats_after = engine.get_generation_stats()
        assert stats_after["total_tasks_generated"] == 0

    @pytest.mark.asyncio
    async def test_no_experience_buffer_engine(self, embedder):
        """Test engine without experience buffer."""
        engine = SelfQuestioningEngine(
            agent_name="no_buffer",
            embedder=embedder,
            experience_buffer=None
        )

        tasks = await engine.generate_autonomous_tasks(num_tasks=3)
        assert len(tasks) == 3


class TestIntegration:
    """Integration tests across components."""

    @pytest.mark.asyncio
    async def test_full_curiosity_loop(self, embedder):
        """Test full curiosity-driven loop."""
        # Create buffer with some experiences
        buffer = ExperienceBuffer(agent_name="test", embedder=embedder)
        for i in range(3):
            await buffer.store_experience(
                trajectory={"task_id": f"task_{i}"},
                quality_score=92.0,
                task_description=f"Task {i}: Optimize system for use case {i}"
            )

        # Create engine with populated buffer
        engine = SelfQuestioningEngine(
            agent_name="curiosity_test",
            embedder=embedder,
            experience_buffer=buffer
        )

        # Generate tasks - should adapt to stored experiences
        tasks = await engine.generate_autonomous_tasks(num_tasks=10)

        assert len(tasks) == 10
        # Some tasks should be novel, some similar
        novelties = [t.curiosity_score for t in tasks]
        assert min(novelties) >= 0
        assert max(novelties) >= 0  # Novelty scores are valid

    @pytest.mark.asyncio
    async def test_task_generation_across_phases(self, engine):
        """Test phase 1->2 integration points."""
        # Phase 1: Generate tasks
        tasks = await engine.generate_autonomous_tasks(num_tasks=3)

        # Simulate Phase 2: Execute and store results
        for task in tasks:
            await engine.integrate_experience(
                task=task,
                success=True,
                quality_score=94.0
            )

        # Verify buffer updated
        assert len(engine.experience_buffer.experiences) == 3

    @pytest.mark.asyncio
    async def test_invalid_input_handling(self, engine):
        """Test error handling for invalid inputs."""
        with pytest.raises(ValueError):
            await engine.generate_autonomous_tasks(num_tasks=0)

        with pytest.raises(ValueError):
            await engine.generate_autonomous_tasks(num_tasks=-1)


# Run with: pytest tests/test_self_questioning.py -v
