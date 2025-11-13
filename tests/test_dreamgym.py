import math

from infrastructure.dreamgym import (
    DreamGymCurriculumGenerator,
    DreamGymExperience,
    DreamGymExperienceModel,
    DreamGymTrainer,
    HybridReplayBuffer,
)
from infrastructure.trajectory_pool import Trajectory


def test_experience_model_generates_rewardful_episode():
    model = DreamGymExperienceModel(seed=42)
    episode = model.generate_episode("build_api", "novice", "use-sse")
    assert 0.5 < episode.reward < 1.0
    assert episode.synthetic is True
    assert "build_api" in episode.observation


def test_curriculum_advances_stage():
    curriculum = DreamGymCurriculumGenerator()
    for _ in range(5):
        curriculum.record_outcome("task", reward=0.9, novelty_score=0.8)
    assert curriculum.next_stage("task") in {"intermediate", "expert"}


def test_hybrid_buffer_sampling_balances_sources():
    buffer = HybridReplayBuffer(max_real=2, max_synthetic=2)
    real_exp = DreamGymExperience(
        task_signature="task",
        difficulty="real",
        synthetic=False,
        observation="obs",
        action="act",
        reward=0.8,
        novelty_score=0.7,
        generated_at="2025-01-01T00:00:00Z",
        metadata={},
    )
    buffer.add(real_exp, "real")
    model = DreamGymExperienceModel(seed=1)
    buffer.add(model.generate_episode("task", "novice"), "synthetic")
    batch = buffer.sample(batch_size=2, synthetic_ratio=0.5)
    assert len(batch) == 2
    assert any(exp.synthetic for exp in batch)
    assert any(not exp.synthetic for exp in batch)


def test_trainer_pipeline_produces_batches():
    trainer = DreamGymTrainer(agent_name="builder_agent")
    trajectory = Trajectory(
        trajectory_id="traj-1",
        generation=1,
        agent_name="builder_agent",
        operator_applied="revision",
        success_score=0.82,
        code_changes="console.log('hi')",
        problem_diagnosis="bug fix",
    )
    trainer.record_real_trajectory(trajectory)
    synthetic = trainer.generate_synthetic_batch("component_x", batch_size=3)
    assert len(synthetic) == 3
    batch = trainer.prepare_evolution_batch("component_x", batch_size=4)
    assert len(batch) == 4
    assert all("reward" in item for item in batch)
