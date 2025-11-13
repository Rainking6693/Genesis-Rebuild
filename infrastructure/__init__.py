"""Lightweight infrastructure package initialization."""

from __future__ import annotations

import logging
from typing import Dict

__all__ = ["get_logger"]

_logger_cache: Dict[str, logging.Logger] = {}


def get_logger(name: str = "infrastructure", level: int = logging.INFO) -> logging.Logger:
    """Return a cached logger without importing heavier modules."""
    if name in _logger_cache:
        logger = _logger_cache[name]
        logger.setLevel(level)
        return logger

    logger = logging.getLogger(name)
    logger.setLevel(level)

    if not logger.handlers:
        handler = logging.StreamHandler()
        formatter = logging.Formatter(
            "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
        )
        handler.setFormatter(formatter)
        logger.addHandler(handler)
        logger.propagate = False

    _logger_cache[name] = logger
    return logger
