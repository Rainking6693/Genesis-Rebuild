"""Tests for ES training scheduler helpers."""

import json
import sys
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parents[1]))

from scripts.es_training_scheduler import (
    _log_es_selection,
    _select_problem_descriptions_by_contributions,
)


def _write_contribution_entry(path: Path, entry: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("a", encoding="utf-8") as fd:
        fd.write(json.dumps(entry) + "\n")


def test_select_problem_descriptions_by_contributions(tmp_path):
    log_dir = tmp_path
    contributions_path = log_dir / "contributions.jsonl"
    entries = [
        {
            "business_id": "biz_alpha",
            "delta": 10.0,
            "component": "component_a",
            "task_description": "Solve alpha",
        },
        {
            "business_id": "biz_beta",
            "delta": 5.0,
            "component": "component_b",
            "task_description": "Solve beta",
        },
        {
            "business_id": "biz_alpha",
            "delta": 2.0,
            "component": "component_c",
            "task_description": "Solve alpha",
        },
    ]
    for entry in entries:
        _write_contribution_entry(contributions_path, entry)

    descriptions = _select_problem_descriptions_by_contributions(log_dir, limit=2)
    assert descriptions == ["Solve alpha", "Solve beta"]

    _log_es_selection(log_dir, "test_method", descriptions)
    selection_file = log_dir / "es_training_selection.jsonl"
    assert selection_file.exists()
    payloads = [json.loads(line) for line in selection_file.read_text().splitlines() if line.strip()]
    assert payloads[-1]["method"] == "test_method"
    assert payloads[-1]["selected"] == descriptions
