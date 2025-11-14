"""
Research Rubric loader
======================

Loads rubric definitions from structured JSON and exposes them as criteria.
"""

from __future__ import annotations

import json
from pathlib import Path
from typing import Dict, List
from infrastructure.rubric_evaluator import RubricCriterion
from infrastructure.task_dag import TaskDAG


def load_research_rubrics(dataset: Path = Path("data/research_rubrics_sample.json")) -> List[RubricCriterion]:
    if not dataset.exists():
        return []
    with dataset.open("r", encoding="utf-8") as fd:
        definitions = json.load(fd)

    criteria = []
    for entry in definitions:
        criteria.append(
            RubricCriterion(
                name=entry.get("criterion", "unnamed"),
                description=entry.get("description", ""),
                weight=float(entry.get("weight", 0.0)),
                scorer=lambda dag, context, keywords=entry.get("keywords", []): _keyword_score(dag, keywords),
            )
        )
    return criteria


def _keyword_score(dag: TaskDAG, keywords: List[str]) -> float:
    text = " ".join(task.description or "" for task in dag.get_all_tasks()).lower()
    hits = sum(text.count(kw.lower()) for kw in keywords)
    return min(1.0, hits / max(1, len(keywords)))
