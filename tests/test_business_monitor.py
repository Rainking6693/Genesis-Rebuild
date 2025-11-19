"""Tests for BusinessMonitor tracking contributions."""

import json
from pathlib import Path

from infrastructure.business_monitor import BusinessMonitor


def test_component_contribution_logged(tmp_path):
    log_dir = tmp_path / "monitor"
    monitor = BusinessMonitor(log_dir=log_dir)
    business_id = monitor.start_business("TestBiz", "saas", ["component_a"])

    monitor.record_component_complete(
        business_id,
        component_name="component_a",
        lines_of_code=50,
        cost=0.0,
        used_vertex=False,
        agent_name="builder_agent",
        quality_score=85.0,
        problem_description="Test business problem",
    )

    contributions_file = log_dir / "contributions.jsonl"
    assert contributions_file.exists()
    lines = contributions_file.read_text().strip().splitlines()
    assert len(lines) == 1
    entry = json.loads(lines[0])
    assert entry["business_id"].startswith("saas_testbiz")
    assert entry["component"] == "component_a"
    assert entry["task_description"] == "Test business problem"
    assert entry["delta"] == 85.0
