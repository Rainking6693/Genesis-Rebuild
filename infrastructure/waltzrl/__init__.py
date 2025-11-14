"""
WaltzRL - Collaborative Multi-Agent Safety Framework
====================================================

Two-stage reinforcement learning for safety alignment without capability degradation.

Research: arXiv:2510.08240v1 (Meta Superintelligence Labs + Johns Hopkins)
Results: 89% unsafe reduction, 78% over-refusal reduction

Architecture:
- Conversation Agent: Generates responses with safety awareness
- Feedback Agent: Provides nuanced safety feedback (not binary blocking)
- Dynamic Improvement Reward (DIR): Joint training objective
- Stage 1: Train feedback agent on safety datasets
- Stage 2: Joint training with DIR optimization

Components:
- conversation_agent: Main LLM wrapped with safety awareness
- feedback_agent: Evaluates safety without over-refusing
- safety_wrapper: Integration layer for Genesis agents
- trainer: RL training pipeline (Stage 1 + Stage 2)
"""

from __future__ import annotations

from importlib import import_module
from typing import Any, Dict

__all__ = [
    "WaltzRLConversationAgent",
    "WaltzRLFeedbackAgent",
    "WaltzRLSafetyWrapper",
    "WaltzRLTrainer",
    "Stage1Trainer",
    "Stage2Trainer",
]

__version__ = "1.0.0"

_ATTR_TO_MODULE: Dict[str, str] = {
    "WaltzRLConversationAgent": "infrastructure.waltzrl.conversation_agent",
    "WaltzRLFeedbackAgent": "infrastructure.waltzrl.feedback_agent",
    "WaltzRLSafetyWrapper": "infrastructure.waltzrl.safety_wrapper",
    "WaltzRLTrainer": "infrastructure.waltzrl.trainer",
    "Stage1Trainer": "infrastructure.waltzrl.trainer",
    "Stage2Trainer": "infrastructure.waltzrl.trainer",
}


def __getattr__(name: str) -> Any:  # pragma: no cover - exercised during imports
    module_name = _ATTR_TO_MODULE.get(name)
    if not module_name:
        raise AttributeError(f"module '{__name__}' has no attribute '{name}'")
    module = import_module(module_name)
    return getattr(module, name)


def __dir__() -> list[str]:  # pragma: no cover - cosmetic helper
    return sorted(list(__all__) + list(globals().keys()))
