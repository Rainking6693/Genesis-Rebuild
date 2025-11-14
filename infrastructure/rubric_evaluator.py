"""
Rubric-based auditing (Research Rubrics + RIFL inspired)
========================================================

Provides explicit criteria to score HTDAG planning results. Each DualPlan
execution is graded against completeness, coherence, and risk-awareness.
The evaluator exposes RIFL-style confidence scores and textual rationale.
"""

from __future__ import annotations

import logging
from dataclasses import dataclass, field
from typing import Callable, Dict, List, Any

from infrastructure.task_dag import TaskDAG, Task

logger = logging.getLogger(__name__)


RubricScoreFn = Callable[[TaskDAG, Dict[str, Any]], float]


@dataclass
class RubricCriterion:
    name: str
    description: str
    weight: float
    scorer: RubricScoreFn


@dataclass
class RubricResult:
    criterion: str
    score: float
    weight: float
    description: str
    insights: str


class RubricEvaluator:
    def __init__(self, criteria: List[RubricCriterion]):
        total_weight = sum(c.weight for c in criteria)
        if not 0.99 < total_weight < 1.01:
            logger.warning("Rubric weights sum to %.2f (expected 1.0)", total_weight)
        self.criteria = criteria

    def evaluate(self, dag: TaskDAG, context: Dict[str, Any]) -> Dict[str, Any]:
        results: List[RubricResult] = []
        for criterion in self.criteria:
            raw_score = max(0.0, min(1.0, criterion.scorer(dag, context)))
            insights = self._describe_insights(criterion.name, raw_score)
            results.append(
                RubricResult(
                    criterion=criterion.name,
                    score=raw_score,
                    weight=criterion.weight,
                    description=criterion.description,
                    insights=insights,
                )
            )

        aggregate = sum(r.score * r.weight for r in results)
        metadata = {
            "rubric_score": round(aggregate, 3),
            "criteria": [
                {
                    "criterion": r.criterion,
                    "score": round(r.score, 3),
                    "weight": r.weight,
                    "insights": r.insights,
                }
                for r in results
            ],
        }
        return metadata

    def _describe_insights(self, name: str, score: float) -> str:
        if score >= 0.85:
            return f"{name} strongly satisfied."
        if score >= 0.65:
            return f"{name} mostly satisfied with minor gaps."
        if score >= 0.4:
            return f"{name} partially met—needs richer detail."
        return f"{name} poorly met; revisit the plan."


def completeness_score(dag: TaskDAG, context: Dict[str, Any]) -> float:
    if dag is None or len(dag.get_all_tasks()) == 0:
        return 0.0
    needed = context.get("expected_components", 5)
    total = len(dag.get_all_tasks())
    return min(1.0, total / max(needed, 1))


def coherence_score(dag: TaskDAG, context: Dict[str, Any]) -> float:
    task_text = " ".join(t.description for t in dag.get_all_tasks())
    duplication = len(set(task_text.split())) / max(1, len(task_text.split()))
    return min(1.0, duplication)


def risk_awareness_score(dag: TaskDAG, context: Dict[str, Any]) -> float:
    keywords = ["risk", "mitigate", "control", "verify", "secure"]
    count = sum(1 for kw in keywords if any(kw in (t.description or "").lower() for t in dag.get_all_tasks()))
    return min(1.0, count / len(keywords))


DEFAULT_RUBRIC = RubricEvaluator(
    criteria=[
        RubricCriterion(
            name="completeness",
            description="Plan covers sufficient components and sub-steps.",
            weight=0.4,
            scorer=completeness_score,
        ),
        RubricCriterion(
            name="coherence",
            description="Task descriptions remain aligned and non-redundant.",
            weight=0.3,
            scorer=coherence_score,
        ),
        RubricCriterion(
            name="risk_awareness",
            description="Plan explicitly calls out mitigation/verification tasks.",
            weight=0.3,
            scorer=risk_awareness_score,
        ),
    ]
)
