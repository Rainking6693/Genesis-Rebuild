"""Compatibility shim for the WaltzRL feedback agent.

The full implementation lives under :mod:`infrastructure.waltzrl.feedback_agent`,
but several subsystems historically imported it from the ``infrastructure.safety``
namespace.  Importing the heavy feedback agent eagerly during package import
introduces circular import problems, so we expose the public API via lazy
attribute lookups that resolve to the canonical implementation on demand.
"""

from __future__ import annotations

from importlib import import_module
from typing import TYPE_CHECKING, Any

__all__ = [
    "FeedbackEvaluation",
    "FeedbackResult",
    "SafetyAnalysis",
    "SafetyCategory",
    "SafetyIssue",
    "WaltzRLFeedbackAgent",
    "get_waltzrl_feedback_agent",
]

_TARGET_MODULE = "infrastructure.waltzrl.feedback_agent"
_cached_module = None


def _load() -> Any:
    """Import the canonical WaltzRL feedback agent lazily."""
    global _cached_module  # noqa: PLW0603 - module level cache is intentional
    if _cached_module is None:
        _cached_module = import_module(_TARGET_MODULE)
    return _cached_module


def __getattr__(name: str) -> Any:  # pragma: no cover - exercised during imports
    if name in __all__:
        return getattr(_load(), name)
    raise AttributeError(f"module '{__name__}' has no attribute '{name}'")


def __dir__() -> list[str]:  # pragma: no cover - cosmetic helper
    return sorted(list(__all__) + list(globals().keys()))


if TYPE_CHECKING:  # pragma: no cover - hints only
    from infrastructure.waltzrl.feedback_agent import (
        FeedbackEvaluation,
        FeedbackResult,
        SafetyAnalysis,
        SafetyCategory,
        SafetyIssue,
        WaltzRLFeedbackAgent,
        get_waltzrl_feedback_agent,
    )
