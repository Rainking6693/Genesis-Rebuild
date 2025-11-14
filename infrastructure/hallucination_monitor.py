"""
Hallucination rate monitor
==========================

Tracks verification failures (binary RAR misses) and reports aggregated rates.
"""

from __future__ import annotations

import json
import logging
from pathlib import Path
from typing import Dict

logger = logging.getLogger(__name__)


class HallucinationMonitor:
    def __init__(self, log_dir: Path = Path("logs/hallucination")) -> None:
        self.log_dir = log_dir
        self.log_dir.mkdir(parents=True, exist_ok=True)
        self.stats = {"checked": 0, "failed": 0}

    def record(self, passed: bool) -> None:
        self.stats["checked"] += 1
        if not passed:
            self.stats["failed"] += 1
        self._write_snapshot()

    def rate(self) -> float:
        if self.stats["checked"] == 0:
            return 0.0
        return self.stats["failed"] / self.stats["checked"]

    def _write_snapshot(self) -> None:
        snapshot = {
            "checked": self.stats["checked"],
            "failed": self.stats["failed"],
            "hallucination_rate": round(self.rate(), 3),
        }
        path = self.log_dir / "metrics.json"
        with path.open("w", encoding="utf-8") as fd:
            json.dump(snapshot, fd)
