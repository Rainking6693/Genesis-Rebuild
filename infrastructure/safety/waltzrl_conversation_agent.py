"""Compatibility shim exposing the WaltzRL conversation agent via infrastructure.safety."""

from __future__ import annotations

from importlib import import_module
from typing import TYPE_CHECKING, Any

__all__ = [
    "CoachingContext",
    "ConversationResponse",
    "SafeResponse",
    "WaltzRLConversationAgent",
    "get_waltzrl_conversation_agent",
]

_TARGET_MODULE = "infrastructure.waltzrl.conversation_agent"
_cached_module = None


def _load() -> Any:
    global _cached_module  # noqa: PLW0603 - intentional module cache
    if _cached_module is None:
        _cached_module = import_module(_TARGET_MODULE)
    return _cached_module


def __getattr__(name: str) -> Any:  # pragma: no cover - exercised during imports
    if name in __all__:
        return getattr(_load(), name)
    raise AttributeError(f"module '{__name__}' has no attribute '{name}'")


def __dir__() -> list[str]:  # pragma: no cover
    return sorted(list(__all__) + list(globals().keys()))


if TYPE_CHECKING:  # pragma: no cover - hints only
    from infrastructure.waltzrl.conversation_agent import (
        CoachingContext,
        ConversationResponse,
        SafeResponse,
        WaltzRLConversationAgent,
        get_waltzrl_conversation_agent,
    )
