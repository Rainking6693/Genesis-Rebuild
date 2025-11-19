"""
Test suite for AgentEvolver Phase 2 - Experience Buffer

Tests cover:
- Experience storage with quality filtering
- Semantic search retrieval and performance
- Buffer statistics and monitoring
- Integration with TrajectoryPool

Author: Thon (Python Expert)
Date: November 15, 2025
"""

import asyncio
import pytest
import time
import numpy as np
from unittest.mock import AsyncMock, patch, MagicMock

from infrastructure.trajectory_pool import Trajectory, TrajectoryPool, TrajectoryStatus
from infrastructure.agentevolver import ExperienceBuffer, TaskEmbedder, ExperienceMetadata


@pytest.fixture
def mock_embedder():
    """Create a TaskEmbedder wrapper for testing (local vector only)."""
    delegate = TaskEmbedder(use_local=True)

    class LocalEmbedder:
        def __init__(self, delegate):
            self._delegate = delegate

        async def embed(self, text: str) -> np.ndarray:
            return await self._delegate.embed(text)

        def compute_similarity_batch(self, query_embedding, embeddings):
            return TaskEmbedder.compute_similarity_batch(query_embedding, embeddings)

        def get_embedding_dimension(self):
            return self._delegate.get_embedding_dimension()

    return LocalEmbedder(delegate)


@pytest.fixture
def trajectory_pool(tmp_path):
    """Create a TrajectoryPool for testing."""
    return TrajectoryPool(
        agent_name="test_agent",
        max_trajectories=100,
        storage_dir=tmp_path
    )


@pytest.fixture
def experience_buffer(mock_embedder, trajectory_pool):
    """Create an ExperienceBuffer with mock embedder for testing."""
    return ExperienceBuffer(
        agent_name="test_agent",
        max_size=100,
        min_quality=90.0,
        embedder=mock_embedder,
        trajectory_pool=trajectory_pool
    )


def create_test_trajectory(
    trajectory_id: str,
    generation: int = 1,
    success_score: float = 95.0
) -> Trajectory:
    """Helper to create test trajectories."""
    return Trajectory(
        trajectory_id=trajectory_id,
        generation=generation,
        agent_name="test_agent",
        code_changes="test code",
        problem_diagnosis="test diagnosis",
        proposed_strategy="test strategy",
        status=TrajectoryStatus.SUCCESS.value,
        success_score=success_score,
    )


@pytest.mark.asyncio
class TestExperienceBufferStorage:
    """Test experience storage functionality."""

    async def test_store_high_quality_experience(self, experience_buffer):
        """Test storing trajectory with quality > threshold."""
        trajectory = create_test_trajectory("test_1", success_score=95.0)
        
        stored = await experience_buffer.store_experience(
            trajectory=trajectory,
            quality_score=95.0,
            task_description="Fix authentication bug"
        )
        
        assert stored is True
        assert len(experience_buffer.experiences) == 1
        assert experience_buffer.total_stored == 1

    async def test_reject_low_quality_experience(self, experience_buffer):
        """Test that trajectories below quality threshold are rejected."""
        trajectory = create_test_trajectory("test_low", success_score=85.0)
        
        stored = await experience_buffer.store_experience(
            trajectory=trajectory,
            quality_score=85.0,  # Below default 90.0 threshold
            task_description="Low quality task"
        )
        
        assert stored is False
        assert len(experience_buffer.experiences) == 0
        assert experience_buffer.total_stored == 0

    async def test_respect_quality_threshold(self, experience_buffer):
        """Test that quality threshold is enforced."""
        # Test at threshold boundary
        trajectory_at = create_test_trajectory("test_at", success_score=90.0)
        stored_at = await experience_buffer.store_experience(
            trajectory=trajectory_at,
            quality_score=90.0,
            task_description="At threshold"
        )
        # Exactly at threshold should store
        assert stored_at is True

    async def test_capacity_limit(self, experience_buffer):
        """Test that buffer respects max_size limit."""
        experience_buffer.max_size = 2  # Set small limit
        
        # Store first experience
        traj1 = create_test_trajectory("test_1", success_score=95.0)
        result1 = await experience_buffer.store_experience(
            traj1, 95.0, "Task 1"
        )
        assert result1 is True
        
        # Store second experience
        traj2 = create_test_trajectory("test_2", success_score=95.0)
        result2 = await experience_buffer.store_experience(
            traj2, 95.0, "Task 2"
        )
        assert result2 is True
        
        # Third experience should be rejected (at capacity)
        traj3 = create_test_trajectory("test_3", success_score=95.0)
        result3 = await experience_buffer.store_experience(
            traj3, 95.0, "Task 3"
        )
        assert result3 is False
        assert len(experience_buffer.experiences) == 2


@pytest.mark.asyncio
class TestExperienceBufferRetrieval:
    """Test experience retrieval and similarity search."""

    async def test_retrieve_similar_experiences(self, experience_buffer):
        """Test semantic search retrieval of similar experiences."""
        # Store some experiences
        traj1 = create_test_trajectory("auth_1", success_score=95.0)
        await experience_buffer.store_experience(
            traj1, 95.0, "Fix authentication bug in login module"
        )
        
        traj2 = create_test_trajectory("auth_2", success_score=92.0)
        await experience_buffer.store_experience(
            traj2, 92.0, "Implement OAuth2 authentication system"
        )
        
        traj3 = create_test_trajectory("database_1", success_score=93.0)
        await experience_buffer.store_experience(
            traj3, 93.0, "Optimize database query performance"
        )
        
        # Query for similar experiences
        results = await experience_buffer.get_similar_experiences(
            task_description="Fix auth token validation",
            top_k=2
        )
        
        assert len(results) <= 2
        assert all(len(r) == 3 for r in results)  # (trajectory, similarity, metadata)

    async def test_retrieve_from_empty_buffer(self, experience_buffer):
        """Test retrieval from empty buffer returns empty list."""
        results = await experience_buffer.get_similar_experiences(
            "Any task",
            top_k=5
        )
        
        assert results == []

    async def test_top_k_parameter(self, experience_buffer):
        """Test that top_k parameter limits results."""
        # Store 5 experiences
        for i in range(5):
            traj = create_test_trajectory(f"task_{i}", success_score=95.0)
            await experience_buffer.store_experience(
                traj, 95.0, f"Task {i}"
            )
        
        # Request only top 2
        results = await experience_buffer.get_similar_experiences(
            "Query task", top_k=2
        )
        
        assert len(results) <= 2

    async def test_retrieval_speed_under_100ms(self, experience_buffer):
        """Test that retrieval is <100ms (success criteria)."""
        # Store 50 experiences for realistic test
        for i in range(50):
            traj = create_test_trajectory(f"speed_test_{i}", success_score=95.0)
            await experience_buffer.store_experience(
                traj, 95.0, f"Task {i} description"
            )
        
        # Measure retrieval time
        start = time.time()
        results = await experience_buffer.get_similar_experiences(
            "Query for similarity search test",
            top_k=5
        )
        elapsed_ms = (time.time() - start) * 1000
        
        assert elapsed_ms < 100, f"Retrieval took {elapsed_ms:.1f}ms (target: <100ms)"
        assert len(results) <= 5

    async def test_semantic_search_accuracy_over_80_percent(self, experience_buffer):
        """Test semantic search retrieves relevant experiences with >80% accuracy."""
        # Store experiences with clear semantic categories
        auth_tasks = [
            ("Fix authentication bug in login", "auth_1"),
            ("Implement OAuth2 authentication", "auth_2"),
            ("Add JWT token validation", "auth_3"),
            ("Fix session management", "auth_4"),
            ("Implement password reset", "auth_5"),
        ]
        
        database_tasks = [
            ("Optimize database query performance", "db_1"),
            ("Fix slow SQL query", "db_2"),
            ("Add database indexing", "db_3"),
            ("Optimize connection pooling", "db_4"),
            ("Fix database deadlock", "db_5"),
        ]
        
        ui_tasks = [
            ("Design responsive dashboard", "ui_1"),
            ("Fix mobile layout issues", "ui_2"),
            ("Improve button styling", "ui_3"),
            ("Add dark mode support", "ui_4"),
            ("Fix CSS grid layout", "ui_5"),
        ]
        
        # Store all experiences
        all_tasks = auth_tasks + database_tasks + ui_tasks
        for desc, traj_id in all_tasks:
            traj = create_test_trajectory(traj_id, success_score=95.0)
            await experience_buffer.store_experience(traj, 95.0, desc)
        
        # Test queries for each category
        test_queries = [
            ("Fix login authentication issue", "auth", auth_tasks),
            ("Optimize slow database queries", "database", database_tasks),
            ("Improve UI responsiveness", "ui", ui_tasks),
        ]
        
        correct_retrievals = 0
        total_queries = 0
        
        for query_text, category, expected_tasks in test_queries:
            results = await experience_buffer.get_similar_experiences(
                query_text, top_k=3
            )
            total_queries += 1
            
            # Check if at least 2 of top 3 results are from correct category
            retrieved_ids = [r[0].trajectory_id for r in results]
            expected_ids = [tid for _, tid in expected_tasks]
            matches = sum(1 for rid in retrieved_ids if rid in expected_ids)
            
            if matches >= 2:  # At least 2/3 correct = 67%, but we want >80% overall
                correct_retrievals += 1
        
        accuracy = correct_retrievals / total_queries if total_queries > 0 else 0.0
        assert accuracy >= 0.80, \
            f"Semantic search accuracy {accuracy:.1%} below target 80% (got {correct_retrievals}/{total_queries} correct)"


@pytest.mark.asyncio
class TestExperienceBufferMetadata:
    """Test metadata and statistics functionality."""

    async def test_experience_reuse_tracking(self, experience_buffer):
        """Test tracking of experience reuse counts."""
        traj = create_test_trajectory("reuse_test", success_score=95.0)
        stored = await experience_buffer.store_experience(
            traj, 95.0, "Task for reuse tracking"
        )
        assert stored
        
        # Get experience ID
        experience_id = list(experience_buffer.experiences.keys())[0]
        metadata = experience_buffer.experiences[experience_id]
        
        # Reuse should be zero initially
        assert metadata.reuse_count == 0
        assert experience_buffer.total_reused == 0
        
        # Mark as reused
        await experience_buffer.mark_experience_reused(experience_id)
        
        # Check reuse count increased
        assert metadata.reuse_count == 1
        assert experience_buffer.total_reused == 1
        assert metadata.last_reused_at is not None
        
        # Reuse again
        await experience_buffer.mark_experience_reused(experience_id)
        assert metadata.reuse_count == 2
        assert experience_buffer.total_reused == 2

    async def test_buffer_statistics(self, experience_buffer):
        """Test buffer statistics calculation."""
        # Empty buffer stats
        stats = experience_buffer.get_buffer_stats()
        assert stats["total_experiences"] == 0
        assert stats["avg_quality"] == 0.0
        assert stats["reuse_efficiency"] == 0.0
        
        # Add some experiences
        for i in range(3):
            traj = create_test_trajectory(f"stat_test_{i}", success_score=92.0 + i)
            await experience_buffer.store_experience(
                traj, 92.0 + i, f"Task {i}"
            )
        
        # Check stats
        stats = experience_buffer.get_buffer_stats()
        assert stats["total_experiences"] == 3
        assert stats["total_stored"] == 3
        assert stats["avg_quality"] == pytest.approx(93.0, abs=0.1)
        assert stats["storage_capacity_pct"] == pytest.approx(3.0, abs=0.1)

    async def test_high_value_experiences(self, experience_buffer):
        """Test retrieval of high-value experiences."""
        # Add experiences with varying quality
        qualities = [91.0, 92.0, 93.0, 94.0, 95.0]
        for i, quality in enumerate(qualities):
            traj = create_test_trajectory(f"value_{i}", success_score=quality)
            await experience_buffer.store_experience(
                traj, quality, f"Task {i}"
            )
        
        # Mark some as reused to increase value
        exp_ids = list(experience_buffer.experiences.keys())
        await experience_buffer.mark_experience_reused(exp_ids[0])
        await experience_buffer.mark_experience_reused(exp_ids[0])
        await experience_buffer.mark_experience_reused(exp_ids[1])
        
        # Get high-value experiences
        high_value = experience_buffer.get_high_value_experiences(top_n=3)
        
        assert len(high_value) <= 3
        # Should be sorted by value (quality * (1 + reuse_count))
        values = [m.quality_score * (1 + m.reuse_count) for m, _ in high_value]
        assert values == sorted(values, reverse=True)


@pytest.mark.asyncio
class TestExperienceBufferIntegration:
    """Test integration with TrajectoryPool."""

    async def test_trajectory_pool_integration(self, experience_buffer):
        """Test that experiences are properly stored in TrajectoryPool."""
        traj = create_test_trajectory("pool_test", success_score=95.0)
        
        stored = await experience_buffer.store_experience(
            traj, 95.0, "Pool integration test"
        )
        
        assert stored
        
        # Verify trajectory is in pool
        retrieved = experience_buffer.pool.get_trajectory(traj.trajectory_id)
        assert retrieved is not None
        assert retrieved.trajectory_id == traj.trajectory_id
        assert retrieved.success_score == 95.0

    async def test_buffer_clear(self, experience_buffer):
        """Test clearing buffer."""
        # Add experiences
        for i in range(3):
            traj = create_test_trajectory(f"clear_{i}", success_score=95.0)
            await experience_buffer.store_experience(
                traj, 95.0, f"Task {i}"
            )
        
        assert len(experience_buffer.experiences) == 3
        assert experience_buffer.total_stored == 3
        
        # Clear buffer
        experience_buffer.clear()
        
        assert len(experience_buffer.experiences) == 0
        assert experience_buffer.experience_ids == []
        assert experience_buffer.embeddings is None
        assert experience_buffer.total_stored == 0
        assert experience_buffer.total_reused == 0
        assert experience_buffer.total_attempts == 0


class TestEmbedderFunctionality:
    """Test TaskEmbedder basic functionality."""

    def test_embedding_dimension(self, mock_embedder):
        """Test embedding dimension."""
        assert mock_embedder.get_embedding_dimension() == 1536

    def test_cosine_similarity_computation(self):
        """Test cosine similarity calculation."""
        emb1 = np.array([1.0, 0.0, 0.0], dtype=np.float32)
        emb2 = np.array([1.0, 0.0, 0.0], dtype=np.float32)
        
        similarity = TaskEmbedder.compute_similarity(emb1, emb2)
        assert similarity == pytest.approx(1.0)  # Identical vectors

    def test_cosine_similarity_orthogonal(self):
        """Test cosine similarity of orthogonal vectors."""
        emb1 = np.array([1.0, 0.0, 0.0], dtype=np.float32)
        emb2 = np.array([0.0, 1.0, 0.0], dtype=np.float32)
        
        similarity = TaskEmbedder.compute_similarity(emb1, emb2)
        assert similarity == pytest.approx(0.0, abs=0.001)

    def test_batch_similarity_computation(self):
        """Test batch similarity computation."""
        query = np.array([1.0, 0.0], dtype=np.float32)
        docs = np.array([
            [1.0, 0.0],  # Identical
            [0.0, 1.0],  # Orthogonal
            [1.0, 1.0],  # Different
        ], dtype=np.float32)
        
        similarities = TaskEmbedder.compute_similarity_batch(query, docs)
        
        assert len(similarities) == 3
        assert similarities[0] == pytest.approx(1.0)
        assert similarities[1] == pytest.approx(0.0, abs=0.001)
        assert similarities[2] > 0 and similarities[2] < 1.0


@pytest.mark.asyncio
class TestErrorHandling:
    """Test error handling and edge cases."""

    async def test_invalid_top_k(self, experience_buffer):
        """Test invalid top_k parameter."""
        traj = create_test_trajectory("error_test", success_score=95.0)
        await experience_buffer.store_experience(traj, 95.0, "Task")

        with pytest.raises(ValueError):
            await experience_buffer.get_similar_experiences("Query", top_k=0)

        with pytest.raises(ValueError):
            await experience_buffer.get_similar_experiences("Query", top_k=-1)


class TestEmbedderEdgeCases:
    """Test error handling in embedder."""

    def test_similarity_with_empty_embeddings(self):
        """Test similarity computation with empty embeddings."""
        query = np.array([1.0, 2.0], dtype=np.float32)
        docs = np.array([], dtype=np.float32).reshape(0, 2)

        similarities = TaskEmbedder.compute_similarity_batch(query, docs)
        assert len(similarities) == 0

    def test_similarity_shape_mismatch(self):
        """Test error when embedding dimensions don't match."""
        emb1 = np.array([1.0, 0.0, 0.0], dtype=np.float32)
        emb2 = np.array([1.0, 0.0], dtype=np.float32)

        with pytest.raises(ValueError):
            TaskEmbedder.compute_similarity(emb1, emb2)


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
