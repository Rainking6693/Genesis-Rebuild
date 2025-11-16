"""
Binary RAR reward integration for DreamGym/evolution.
These helpers ensure outputs are verified against retrieved documents before acceptance.
"""

from __future__ import annotations

import logging
from dataclasses import dataclass
from typing import List, Optional

logger = logging.getLogger(__name__)


@dataclass
class VerificationResult:
    passed: bool
    score: float
    evidence: List[str]
    error: Optional[str] = None


class BinaryRarVerifier:
    def __init__(self, retriever: "BinaryRarRetriever", threshold: float = 0.6):
        self.retriever = retriever
        self.threshold = threshold

    def verify(self, prompt: str, candidate: str) -> VerificationResult:
        documents = self.retriever.retrieve(prompt)
        if not documents:
            return VerificationResult(False, 0.0, [], error="no retrieval candidates")

        matches = []
        score = 0.0
        for doc in documents:
            if doc in candidate:
                matches.append(doc)
                score += 1.0

        normalized = score / max(1, len(documents))
        passed = normalized >= self.threshold
        return VerificationResult(passed=passed, score=normalized, evidence=matches)


class BinaryRarRetriever:
    def __init__(self, index: Optional[List[str]] = None):
        self.index = index or []

    def retrieve(self, prompt: str) -> List[str]:
        prompt_lower = prompt.lower()
        # Return documents that contain any words from the prompt
        prompt_words = set(prompt_lower.split())
        matches = []
        for doc in self.index:
            doc_words = set(doc.lower().split())
            if prompt_words.intersection(doc_words):
                matches.append(doc)
        return matches
