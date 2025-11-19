"""EDR Configuration - Minimal Implementation."""

from dataclasses import dataclass


@dataclass
class Configuration:
    """EDR Configuration (stub)."""
    max_depth: int = 3
    max_sources: int = 10
    confidence_threshold: float = 0.7
    enable_caching: bool = True
