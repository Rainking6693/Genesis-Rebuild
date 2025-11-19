from pathlib import Path

from infrastructure.evolution.memory_aware_darwin import MemoryAwareDarwin


class DummyMemory:
    async def put(self, namespace, key, value):
        pass


def test_loads_agent_evolver_scenarios(tmp_path):
    scenario_dir = tmp_path / "scenarios"
    scenario_dir.mkdir()
    scenario_file = scenario_dir / "scenario.json"
    scenario_file.write_text(
        """{
            "name": "Test Scenario",
            "description": "Curiosity-driven retail ops tool",
            "business_type": "ecommerce",
            "mvp_features": ["Catalog", "Analytics"],
            "novelty_score": 88.0,
            "difficulty_score": 55.0,
            "question": "What if we built AI for indie retailers?",
            "coverage": {"business_types": 40, "domains": 22},
            "domains": ["retail"],
            "generated_at": "2025-11-17T00:00:00Z"
        }"""
    )

    darwin = MemoryAwareDarwin(
        agent_type="qa_agent",
        memory_store=DummyMemory(),
        scenario_dir=scenario_dir
    )
    trajectories = darwin._load_agent_evolver_scenarios()

    assert len(trajectories) == 1
    assert trajectories[0].agent_name == "qa_agent"
