"""
RIFL prompt evolution pipeline
==============================

Provides lightweight rubric generation and ternary reward verification for
HTDAG/DreamGym evolution loops.
"""

from __future__ import annotations

import logging
import random
from dataclasses import dataclass
from typing import List

logger = logging.getLogger(__name__)


@dataclass
class RIFLReport:
    rubric: str
    verdict: str  # positive / neutral / negative
    score: float
    rationale: str


class RIFLPipeline:
    def __init__(self, rubrics: List[str]):
        self.rubrics = rubrics

    def generate_rubric(self, prompt: str) -> str:
        choice = random.choice(self.rubrics)
        logger.debug("RIFL generated rubric '%s' for prompt", choice)
        return choice

    def verify(self, rubric: str, candidate: str) -> RIFLReport:
        score = min(1.0, len(set(rubric.split()) & set(candidate.split())) / max(1, len(rubric.split())))
        if score > 0.7:
            verdict = "positive"
        elif score > 0.4:
            verdict = "neutral"
        else:
            verdict = "negative"
        rationale = f"Shared tokens: {score * 100:.1f}%"
        logger.debug("RIFL verify verdict=%s score=%.3f", verdict, score)
        return RIFLReport(rubric=rubric, verdict=verdict, score=score, rationale=rationale)
