"""
SE-Darwin AgentEvolver Integration Test

Tests that AgentEvolver scenarios flow correctly into SE-Darwin training.
"""

import asyncio
import json
import pytest
from pathlib import Path
from unittest.mock import Mock, patch

from infrastructure.agentevolver.ingestion import ScenarioIngestionPipeline, scenario_to_trajectory
from infrastructure.trajectory_pool import TrajectoryPool, Trajectory
from infrastructure.evolution.memory_aware_darwin import MemoryAwareDarwin


@pytest.fixture
def scenario_dir(tmp_path):
    """Create temporary scenario directory."""
    dir_path = tmp_path / "scenarios"
    dir_path.mkdir()
    return dir_path


@pytest.fixture
def sample_scenario():
    """Create a sample valid scenario."""
    return {
        "name": "Test SaaS Platform",
        "description": "Build a SaaS platform for task management",
        "business_type": "saas",
        "mvp_features": ["User authentication", "Task creation", "Dashboard"],
        "novelty_score": 75.0,
        "difficulty_score": 60.0,
        "generated_at": "2025-01-01T00:00:00Z"
    }


@pytest.fixture
def ingestion_pipeline(tmp_path, scenario_dir):
    """Create ingestion pipeline for testing."""
    pool = TrajectoryPool(agent_name="test-agent", max_trajectories=100)
    return ScenarioIngestionPipeline(
        trajectory_pool=pool,
        storage_dir=scenario_dir,
        novelty_threshold=70.0,
        difficulty_range=(30.0, 90.0)
    )


def test_scenario_ingestion_creates_trajectory(ingestion_pipeline, sample_scenario):
    """Test that scenario ingestion creates a trajectory in pool."""
    traj = ingestion_pipeline.ingest_scenario(sample_scenario)
    
    assert traj is not None
    assert traj.trajectory_id is not None
    assert traj.agent_name == "agentevolver-scenarios"
    assert traj.problem_diagnosis == sample_scenario["description"]
    assert traj.success_score > 0


def test_scenario_persisted_to_disk(ingestion_pipeline, sample_scenario, scenario_dir):
    """Test that scenario is persisted to disk."""
    traj = ingestion_pipeline.ingest_scenario(sample_scenario)
    
    scenario_file = scenario_dir / f"{traj.trajectory_id}.json"
    assert scenario_file.exists()
    
    loaded = json.loads(scenario_file.read_text())
    assert loaded["trajectory_id"] == traj.trajectory_id
    assert loaded["name"] == sample_scenario["name"]


def test_trajectory_in_pool(ingestion_pipeline, sample_scenario):
    """Test that trajectory is added to TrajectoryPool."""
    traj = ingestion_pipeline.ingest_scenario(sample_scenario)
    
    retrieved = ingestion_pipeline.pool.get_trajectory(traj.trajectory_id)
    assert retrieved is not None
    assert retrieved.trajectory_id == traj.trajectory_id


def test_archival_policy_enforced(ingestion_pipeline, scenario_dir):
    """Test that archival policy keeps only last 10k scenarios."""
    # Create pipeline with small max_scenarios for testing
    small_pipeline = ScenarioIngestionPipeline(
        trajectory_pool=ingestion_pipeline.pool,
        storage_dir=scenario_dir,
        max_scenarios=5  # Small limit for testing
    )
    
    # Ingest more than max_scenarios
    for i in range(10):
        scenario = {
            "name": f"Scenario {i}",
            "description": f"Test scenario {i}",
            "business_type": "saas",
            "mvp_features": ["Feature 1"],
            "novelty_score": 75.0,
            "difficulty_score": 60.0
        }
        small_pipeline.ingest_scenario(scenario)
    
    # Check that only last 5 are kept
    scenario_files = list(scenario_dir.glob("*.json"))
    assert len(scenario_files) <= 5, f"Expected <=5 files, got {len(scenario_files)}"


@pytest.mark.asyncio
async def test_memory_aware_darwin_loads_scenarios(tmp_path, scenario_dir):
    """Test that MemoryAwareDarwin can load AgentEvolver scenarios."""
    # Create some scenarios
    for i in range(3):
        scenario = {
            "name": f"Test Scenario {i}",
            "description": f"Test description {i}",
            "business_type": "saas",
            "mvp_features": ["Feature 1", "Feature 2"],
            "novelty_score": 75.0,
            "difficulty_score": 60.0
        }
        scenario_file = scenario_dir / f"scenario_{i}.json"
        scenario_file.write_text(json.dumps({"trajectory_id": f"traj_{i}", **scenario}))
    
    # Create MemoryAwareDarwin with scenario directory
    with patch('infrastructure.evolution.memory_aware_darwin.Path') as mock_path:
        mock_path.return_value = scenario_dir
        darwin = MemoryAwareDarwin(
            agent_type="test_agent",
            memory_store=Mock()
        )
        darwin.scenario_dir = scenario_dir
        darwin.scenario_limit = 10
        
        # Load scenarios
        trajectories = darwin._load_agent_evolver_scenarios()
        
        assert len(trajectories) == 3
        assert all(isinstance(t, Trajectory) for t in trajectories)


def test_difficulty_filtering_tunable(ingestion_pipeline):
    """Test that difficulty range filtering is tunable."""
    # Test with custom difficulty range
    custom_pipeline = ScenarioIngestionPipeline(
        trajectory_pool=ingestion_pipeline.pool,
        difficulty_range=(40.0, 80.0)  # Narrower range
    )
    
    # Scenario with difficulty 35 (below range) should be rejected
    low_difficulty = {
        "name": "Low Difficulty",
        "description": "Test",
        "business_type": "saas",
        "mvp_features": ["Feature"],
        "novelty_score": 75.0,
        "difficulty_score": 35.0
    }
    
    with pytest.raises(Exception):  # Should raise ScenarioValidationError
        custom_pipeline.ingest_scenario(low_difficulty)
    
    # Scenario with difficulty 70 (in range) should be accepted
    valid_difficulty = {
        "name": "Valid Difficulty",
        "description": "Test",
        "business_type": "saas",
        "mvp_features": ["Feature"],
        "novelty_score": 75.0,
        "difficulty_score": 70.0
    }
    
    traj = custom_pipeline.ingest_scenario(valid_difficulty)
    assert traj is not None

