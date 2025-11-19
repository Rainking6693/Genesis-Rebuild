from pathlib import Path

import pytest

from infrastructure.agentevolver.ingestion import ScenarioIngestionPipeline, ScenarioValidationError
from infrastructure.trajectory_pool import TrajectoryPool


def test_ingestion_pipeline_stores_scenario(tmp_path):
    pool_dir = tmp_path / "trajectory_pool"
    pool = TrajectoryPool(agent_name="test-agent", storage_dir=pool_dir)
    pipeline = ScenarioIngestionPipeline(
        trajectory_pool=pool,
        storage_dir=tmp_path / "scenarios"
    )
    scenario = {
        "name": "Test Scenario",
        "description": "AI ecommerce analytics for niche retail",
        "business_type": "ecommerce",
        "mvp_features": ["Catalog", "Analytics", "Checkout"],
        "novelty_score": 92.0,
        "question": "What if we built a retail ops AI for indie stores?",
        "coverage": {"business_types": 50, "domains": 30},
        "domains": ["retail"],
        "generated_at": "2025-11-17T00:00:00Z"
    }
    traj = pipeline.ingest_scenario(scenario)
    assert pool.size() >= 1
    assert (tmp_path / "scenarios" / f"{traj.trajectory_id}.json").exists()


def test_quality_filter_rejects_low_novelty(tmp_path):
    pool_dir = tmp_path / "trajectory_pool_quality"
    pool = TrajectoryPool(agent_name="quality-test", storage_dir=pool_dir)
    pipeline = ScenarioIngestionPipeline(
        trajectory_pool=pool,
        storage_dir=tmp_path / "scenarios_quality",
        novelty_threshold=80.0
    )
    scenario = {
        "name": "Boring Idea",
        "description": "A generic SaaS tool",
        "business_type": "saas",
        "mvp_features": ["Dashboard"],
        "novelty_score": 50.0,
        "question": "What if we built another SaaS tool?",
        "coverage": {"business_types": 20, "domains": 10},
        "domains": ["enterprise"],
        "generated_at": "2025-11-17T00:00:00Z",
        "difficulty_score": 40.0
    }
    with pytest.raises(ScenarioValidationError):
        pipeline.ingest_scenario(scenario)
