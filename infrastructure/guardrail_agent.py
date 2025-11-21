"""
LLM-inspired guardrail pre-screening agent.

Lightweight heuristic detector to supplement WaltzRL and regex filters.
Designed to be cheap and dependency-free; plug in a real LLM scorer when available.
"""

import re
import logging
from dataclasses import dataclass
from typing import List, Tuple

logger = logging.getLogger(__name__)


@dataclass
class GuardrailResult:
    blocked: bool
    reasons: List[str]
    confidence: float  # 0.0-1.0 heuristic score


class GuardrailAgent:
    """
    Heuristic guardrail that flags common and obfuscated jailbreak attempts.
    """

    def __init__(self, block_on_match: bool = True):
        self.block_on_match = block_on_match
        # Simple patterns (can be expanded / replaced with LLM scoring)
        self.patterns: List[Tuple[re.Pattern, float, str]] = [
            (re.compile(r"(?i)ignore previous instructions"), 0.8, "instruction override"),
            (re.compile(r"(?i)system prompt"), 0.6, "system prompt disclosure"),
            (re.compile(r"(?i)jailbreak"), 0.7, "jailbreak keyword"),
            (re.compile(r"(?i)\\u007d\\u007d|\\u007b\\u007b"), 0.4, "unicode brace obfuscation"),
            (re.compile(r"(?i)(base64|rot13)"), 0.5, "encoding hint"),
            (re.compile(r"(?i)http://169\\.254\\."), 0.9, "metadata service access"),
        ]

    def evaluate(self, text: str) -> GuardrailResult:
        hits = []
        max_conf = 0.0
        for pattern, score, reason in self.patterns:
            if pattern.search(text):
                hits.append(reason)
                max_conf = max(max_conf, score)

        blocked = self.block_on_match and bool(hits)
        if blocked:
            logger.warning(f"GuardrailAgent blocked text for reasons: {hits}")

        return GuardrailResult(blocked=blocked, reasons=hits, confidence=max_conf)


_guardrail_agent: GuardrailAgent | None = None


def get_guardrail_agent() -> GuardrailAgent:
    global _guardrail_agent
    if _guardrail_agent is None:
        _guardrail_agent = GuardrailAgent()
    return _guardrail_agent
