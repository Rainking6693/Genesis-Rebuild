"""
Experience Buffer for AgentEvolver Phase 2

Stores and retrieves successful agent experiences for reuse.
Implements semantic search for finding similar past experiences.

Key Features:
- Reuses existing TrajectoryPool infrastructure
- Semantic search via embeddings (<100ms retrieval)
- Quality filtering (only store top 10% trajectories, score > 90)
- Fast vector similarity search
- Cost reduction via experience reuse (target: 50% cost savings)

Performance Targets:
- Store operation: <50ms
- Similarity search: <100ms for top-k retrieval
- Memory: <1GB for 10,000 experiences with embeddings

Author: Thon (Python Expert)
Date: November 15, 2025
"""

import asyncio
import hashlib
import logging
import time
from dataclasses import dataclass, field
from pathlib import Path
from typing import Dict, List, Optional, Tuple, Any
import numpy as np
from datetime import datetime, timezone

from infrastructure.trajectory_pool import TrajectoryPool, Trajectory
from infrastructure.agentevolver.embedder import TaskEmbedder

logger = logging.getLogger(__name__)


@dataclass
class ExperienceMetadata:
    """Metadata for stored experience."""

    experience_id: str
    trajectory_id: str
    quality_score: float
    task_description: str
    embedding: Optional[np.ndarray] = None
    stored_at: str = field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    reuse_count: int = 0
    last_reused_at: Optional[str] = None

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for serialization."""
        return {
            "experience_id": self.experience_id,
            "trajectory_id": self.trajectory_id,
            "quality_score": self.quality_score,
            "task_description": self.task_description,
            "stored_at": self.stored_at,
            "reuse_count": self.reuse_count,
            "last_reused_at": self.last_reused_at,
        }


class ExperienceBuffer:
    """
    Stores and retrieves successful agent experiences for reuse.

    Implements semantic search for finding similar experiences based on
    task embeddings. Only stores high-quality trajectories (score > 90).
    """

    def __init__(
        self,
        agent_name: str,
        max_size: int = 10000,
        min_quality: float = 90.0,
        embedder: Optional[TaskEmbedder] = None,
        trajectory_pool: Optional[TrajectoryPool] = None
    ):
        """
        Initialize ExperienceBuffer.

        Args:
            agent_name: Name of agent using this buffer
            max_size: Maximum number of experiences to store (default: 10000)
            min_quality: Minimum quality score for storage (default: 90.0, top 10%)
            embedder: TaskEmbedder instance (creates new if not provided)
            trajectory_pool: TrajectoryPool instance (creates new if not provided)
        """
        self.agent_name = agent_name
        self.max_size = max_size
        self.min_quality = min_quality

        # Initialize embedder
        self.embedder = embedder or TaskEmbedder()

        # Initialize trajectory pool
        self.pool = trajectory_pool or TrajectoryPool(
            agent_name=agent_name,
            max_trajectories=max_size
        )

        # Experience storage
        self.experiences: Dict[str, ExperienceMetadata] = {}
        self.embeddings: Optional[np.ndarray] = None  # Shape: (n_experiences, 1536)
        self.experience_ids: List[str] = []  # Parallel list for indexing
        self._trajectory_data: Dict[str, Any] = {}  # Store non-Trajectory objects

        # Statistics
        self.total_stored = 0
        self.total_reused = 0
        self.total_attempts = 0

        logger.info(
            f"ExperienceBuffer initialized for {agent_name}",
            extra={
                "max_size": max_size,
                "min_quality": min_quality
            }
        )

    async def store_experience(
        self,
        trajectory: Any,  # Can be Trajectory object or dict/any serializable data
        quality_score: float,
        task_description: str
    ) -> bool:
        """
        Store high-quality trajectory for reuse.

        Args:
            trajectory: Trajectory to store (Trajectory object or dict/serializable data)
            quality_score: Quality score of trajectory (0-100)
            task_description: Description of the task for semantic search

        Returns:
            True if stored, False if quality threshold not met
        """
        self.total_attempts += 1

        # Check quality threshold
        if quality_score < self.min_quality:
            # Get trajectory ID if available
            traj_id = getattr(trajectory, 'trajectory_id', 'unknown')
            logger.debug(
                f"Trajectory {traj_id} not stored: "
                f"quality {quality_score} < threshold {self.min_quality}"
            )
            return False

        # Check if already at capacity
        if len(self.experiences) >= self.max_size:
            logger.debug(f"ExperienceBuffer at capacity ({self.max_size}), skipping store")
            return False

        # Generate embedding for task
        try:
            embedding = await self.embedder.embed(task_description)
        except Exception as e:
            logger.error(f"Failed to embed task description: {e}")
            return False

        # Generate trajectory ID (use existing or create new)
        if isinstance(trajectory, Trajectory):
            trajectory_id = trajectory.trajectory_id
            trajectory.success_score = quality_score
            self.pool.add_trajectory(trajectory)
        else:
            # For non-Trajectory objects, generate ID from hash
            trajectory_str = str(trajectory)
            trajectory_id = hashlib.md5(trajectory_str.encode()).hexdigest()[:16]

        # Create experience metadata
        experience_id = f"{trajectory_id}_{int(time.time() * 1000)}"  # Use milliseconds for uniqueness
        metadata = ExperienceMetadata(
            experience_id=experience_id,
            trajectory_id=trajectory_id,
            quality_score=quality_score,
            task_description=task_description,
            embedding=embedding
        )

        # Store experience and trajectory data
        self.experiences[experience_id] = metadata
        self.experience_ids.append(experience_id)

        # Store trajectory data in a parallel dict if not in pool
        if not hasattr(self, '_trajectory_data'):
            self._trajectory_data = {}
        self._trajectory_data[trajectory_id] = trajectory

        self._update_embeddings_index()

        self.total_stored += 1

        logger.info(
            f"Stored experience {experience_id}",
            extra={
                "quality_score": quality_score,
                "trajectory_id": trajectory_id,
                "total_stored": self.total_stored
            }
        )

        return True

    async def get_similar_experiences(
        self,
        task_description: str,
        top_k: int = 5
    ) -> List[Tuple[Trajectory, float, ExperienceMetadata]]:
        """
        Retrieve most relevant experiences for a task using semantic search.

        Args:
            task_description: Description of the task to find experiences for
            top_k: Number of top results to return (default: 5)

        Returns:
            List of (trajectory, similarity_score, metadata) tuples
            sorted by similarity descending
        """
        if not self.experiences:
            logger.debug("No experiences in buffer")
            return []

        if top_k <= 0:
            raise ValueError("top_k must be positive")

        # Embed query task
        try:
            query_embedding = await self.embedder.embed(task_description)
        except Exception as e:
            logger.error(f"Failed to embed query: {e}")
            return []

        # Compute similarities
        start_time = time.time()
        similarities = self._compute_similarities(query_embedding)
        elapsed_ms = (time.time() - start_time) * 1000

        if elapsed_ms > 100:
            logger.warning(f"Similarity search took {elapsed_ms:.1f}ms (target: <100ms)")
        else:
            logger.debug(f"Similarity search completed in {elapsed_ms:.1f}ms")

        # Get top-k indices
        top_indices = np.argsort(similarities)[-top_k:][::-1]

        results = []
        for idx in top_indices:
            if idx < 0 or idx >= len(self.experience_ids):
                continue

            experience_id = self.experience_ids[idx]
            metadata = self.experiences[experience_id]

            # Try to get from pool first, then from _trajectory_data
            trajectory = self.pool.get_trajectory(metadata.trajectory_id)
            if trajectory is None and hasattr(self, '_trajectory_data'):
                trajectory = self._trajectory_data.get(metadata.trajectory_id)

            if trajectory is None:
                logger.warning(f"Trajectory {metadata.trajectory_id} not found in pool or data store")
                continue

            similarity = float(similarities[idx])
            results.append((trajectory, similarity, metadata))

        return results

    async def mark_experience_reused(self, experience_id: str) -> None:
        """
        Update reuse count and timestamp for an experience.

        Args:
            experience_id: ID of experience that was reused
        """
        if experience_id in self.experiences:
            metadata = self.experiences[experience_id]
            metadata.reuse_count += 1
            metadata.last_reused_at = datetime.now(timezone.utc).isoformat()
            self.total_reused += 1
            logger.debug(f"Marked experience {experience_id} as reused (count: {metadata.reuse_count})")

    def get_buffer_stats(self) -> Dict[str, Any]:
        """
        Return buffer statistics for monitoring.

        Returns:
            Dictionary with buffer statistics
        """
        if not self.experiences:
            return {
                "total_experiences": 0,
                "avg_quality": 0.0,
                "total_stored": self.total_stored,
                "total_reused": self.total_reused,
                "total_attempts": self.total_attempts,
                "storage_capacity_pct": 0.0,
                "reuse_efficiency": 0.0,
            }

        quality_scores = [m.quality_score for m in self.experiences.values()]
        avg_quality = sum(quality_scores) / len(quality_scores) if quality_scores else 0.0

        reuse_efficiency = (
            (self.total_reused / self.total_attempts * 100)
            if self.total_attempts > 0 else 0.0
        )

        return {
            "total_experiences": len(self.experiences),
            "avg_quality": avg_quality,
            "min_quality": min(quality_scores) if quality_scores else 0.0,
            "max_quality": max(quality_scores) if quality_scores else 0.0,
            "total_stored": self.total_stored,
            "total_reused": self.total_reused,
            "total_attempts": self.total_attempts,
            "storage_capacity_pct": (len(self.experiences) / self.max_size * 100),
            "reuse_efficiency": reuse_efficiency,
            "pool_stats": self.pool.get_statistics()
        }

    def get_high_value_experiences(self, top_n: int = 10) -> List[Tuple[ExperienceMetadata, Trajectory]]:
        """
        Get highest quality and most reused experiences.

        Args:
            top_n: Number of experiences to return

        Returns:
            List of (metadata, trajectory) tuples sorted by value
        """
        experiences_list = [
            (metadata, self.pool.get_trajectory(metadata.trajectory_id))
            for metadata in self.experiences.values()
        ]

        # Filter out None trajectories
        experiences_list = [
            (m, t) for m, t in experiences_list if t is not None
        ]

        # Sort by value: quality_score * (1 + reuse_count)
        experiences_list.sort(
            key=lambda x: x[0].quality_score * (1 + x[0].reuse_count),
            reverse=True
        )

        return experiences_list[:top_n]

    def _compute_similarities(self, query_embedding: np.ndarray) -> np.ndarray:
        """
        Compute cosine similarities between query and all stored experiences.

        Args:
            query_embedding: Query embedding vector

        Returns:
            Numpy array of similarity scores
        """
        if self.embeddings is None or self.embeddings.size == 0:
            return np.array([])

        return self.embedder.compute_similarity_batch(query_embedding, self.embeddings)

    def _update_embeddings_index(self) -> None:
        """
        Rebuild embeddings index from stored experiences.

        Called when experiences are added/removed to maintain parallel
        embeddings array for fast similarity search.
        """
        embeddings_list = []

        for experience_id in self.experience_ids:
            metadata = self.experiences.get(experience_id)
            if metadata and metadata.embedding is not None:
                embeddings_list.append(metadata.embedding)

        if embeddings_list:
            self.embeddings = np.vstack(embeddings_list)
        else:
            self.embeddings = None

    def clear(self) -> None:
        """Clear all stored experiences and statistics."""
        self.experiences.clear()
        self.experience_ids.clear()
        self._trajectory_data.clear()
        self.embeddings = None
        self.total_stored = 0
        self.total_reused = 0
        self.total_attempts = 0
        logger.info(f"Cleared experience buffer for {self.agent_name}")
