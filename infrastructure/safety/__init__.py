"""Safety utilities shared across Genesis agents."""

from importlib import import_module
from typing import Any

__all__ = ["lazy_import"]


def lazy_import(module_name: str) -> Any:
    """Import a safety helper lazily to keep import times low."""
    return import_module(module_name)
