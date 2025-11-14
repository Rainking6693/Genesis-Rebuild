"""
Baseline BM25-style retriever for language verification.
"""

from __future__ import annotations

import math
from typing import Iterable, List


class BM25Retriever:
    def __init__(self, documents: Iterable[str]):
        self.documents = [doc.strip() for doc in documents if doc.strip()]
        self.avgdl = sum(len(doc.split()) for doc in self.documents) / max(1, len(self.documents))
        self.term_freqs = [self._term_frequency(doc) for doc in self.documents]

    def _term_frequency(self, text: str) -> dict[str, int]:
        freq: dict[str, int] = {}
        for token in text.lower().split():
            freq[token] = freq.get(token, 0) + 1
        return freq

    def retrieve(self, prompt: str, top_k: int = 3) -> List[str]:
        scores: List[tuple[float, str]] = []
        prompt_tokens = prompt.lower().split()
        prompt_freq = {}
        for token in prompt_tokens:
            prompt_freq[token] = prompt_freq.get(token, 0) + 1

        for doc, tf in zip(self.documents, self.term_freqs):
            score = 0.0
            dl = len(doc.split())
            for token, qf in prompt_freq.items():
                if token not in tf:
                    continue
                df = tf[token]
                k1 = 1.2
                b = 0.75
                numerator = df * (k1 + 1)
                denominator = df + k1 * (1 - b + b * dl / max(1, self.avgdl))
                score += (numerator / denominator) * qf
            scores.append((score, doc))

        scores.sort(reverse=True)
        return [doc for _, doc in scores[:top_k]]
