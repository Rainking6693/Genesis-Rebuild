import asyncio
import numpy as np

from pathlib import Path

from infrastructure.agentevolver.experience_manager import ExperienceManager
from infrastructure.agentevolver.experience_buffer import ExperienceBuffer
from infrastructure.trajectory_pool import TrajectoryPool, Trajectory, TrajectoryStatus


class DummyEmbedder:
    async def embed(self, text: str):
        return [0.0] * 1536

    def compute_similarity_batch(self, query, embeddings):
        return np.zeros(len(embeddings) if embeddings is not None else 0)


class DummyTrajectory(Trajectory):
    pass


def build_trajectory():
    return Trajectory(
        trajectory_id="test",
        generation=0,
        agent_name="builder_agent",
        parent_trajectories=[],
        operator_applied="baseline",
        code_changes="code",
        problem_diagnosis="diag",
        proposed_strategy="strategy",
        status=TrajectoryStatus.SUCCESS.value,
        success_score=0.95,
    )


def test_hit_rate_and_sharing(tmp_path):
    pool = TrajectoryPool(agent_name="test-hit", storage_dir=Path(tmp_path / "pool"))
    buffer = ExperienceBuffer(
        agent_name="hit-agent",
        trajectory_pool=pool,
        embedder=DummyEmbedder()
    )
    manager = ExperienceManager(agent_name="hit-agent", embedder=DummyEmbedder())
    manager.buffer = buffer

    trajectory = build_trajectory()
    asyncio.run(buffer.store_experience(trajectory, quality_score=95.0, task_description="task"))
    entries = list(buffer.experiences.keys())
    assert entries

    decision = asyncio.run(manager.decide("task"))
    assert isinstance(decision.policy.should_exploit, bool)
    if decision.policy.should_exploit:
        assert manager.hit_count > 0

    shared = manager.share_template_with_agent(entries[0], target_agent="marketing_agent")
    assert shared
