"""
Tool Chain Tracker
===================

Tracks usage of tool sequences (OCR -> text -> code) for monitoring & alerts.
"""

from __future__ import annotations

import logging
from typing import List, Dict

logger = logging.getLogger(__name__)


class ToolChainTracker:
    def __init__(self):
        self.chains: Dict[str, int] = {}

    def record_chain(self, chain: List[str]) -> None:
        key = "->".join(chain)
        self.chains[key] = self.chains.get(key, 0) + 1
        logger.info("Tool chain recorded: %s (count=%d)", key, self.chains[key])

    def get_stats(self) -> Dict[str, int]:
        return dict(self.chains)
