"""EDR State Management - Minimal Implementation."""

from dataclasses import dataclass, field
from typing import Dict, List, Any


@dataclass
class SummaryState:
    """EDR Summary State (stub)."""
    topic: str = ""
    findings: List[str] = field(default_factory=list)
    sources: List[str] = field(default_factory=list)
    metadata: Dict[str, Any] = field(default_factory=dict)
