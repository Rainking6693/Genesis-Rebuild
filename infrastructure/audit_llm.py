"""
AuditLLM-style continuous auditor
=================================

Autonomous agent that reviews orchestration traces/logs to ensure compliance
with core operational rules (QA tests executed, support tickets logged, etc.).
"""

from __future__ import annotations

import asyncio
import json
import logging
from collections import deque
from dataclasses import dataclass, field
from pathlib import Path
from typing import Dict, List, Optional

logger = logging.getLogger(__name__)


@dataclass
class AuditRequirement:
    name: str
    keywords: List[str]
    min_count: int = 1
    description: str = ""


@dataclass
class AuditOutcome:
    requirement: str
    satisfied: bool
    count: int
    details: Optional[str] = None


class AuditLLMAgent:
    DEFAULT_REQUIREMENTS = [
        AuditRequirement(
            name="QA tests executed",
            keywords=["QA TEST", "test suite", "pytest", "unit test", "integration test"],
            min_count=1,
            description="Ensure QA agents executed their test suite before release.",
        ),
        AuditRequirement(
            name="Support ticket logged",
            keywords=["ticket logged", "support_ticket", "support update", "customer support"],
            min_count=1,
            description="Verify Support team documented issues or follow-ups.",
        ),
        AuditRequirement(
            name="Compliance review noted",
            keywords=["compliance check", "audit review", "legal review"],
            min_count=1,
            description="Record that compliance or legal review occurred.",
        ),
    ]

    def __init__(self, log_path: Optional[Path] = None, stream_recent: int = 500):
        self.log_path = log_path or Path("logs/agents.log")
        self.recent_lines = deque(maxlen=stream_recent)
        self.requirements = list(self.DEFAULT_REQUIREMENTS)

    def load_recent(self) -> List[str]:
        if not self.log_path.exists():
            logger.warning("Audit logs not found at %s", self.log_path)
            return []
        lines: List[str] = []
        with self.log_path.open("r", encoding="utf-8", errors="ignore") as fd:
            fd.seek(0, 2)
            size = fd.tell()
            chunk_size = 4096
            data = ""
            pos = size
            while pos > 0 and len(lines) < self.recent_lines.maxlen:
                read_size = min(chunk_size, pos)
                pos -= read_size
                fd.seek(pos)
                data = fd.read(read_size) + data
                while "\n" in data and len(lines) < self.recent_lines.maxlen:
                    idx = data.rfind("\n")
                    line = data[idx + 1 :]
                    data = data[:idx]
                    lines.insert(0, line)
                if pos == 0 and data:
                    lines.insert(0, data)
                    break
        self.recent_lines.extend(lines)
        return list(self.recent_lines)

    def evaluate(self, lines: Optional[List[str]] = None) -> List[AuditOutcome]:
        lines = lines or self.load_recent()
        text = " ".join(lines).lower()
        results: List[AuditOutcome] = []
        for requirement in self.requirements:
            count = sum(text.count(keyword.lower()) for keyword in requirement.keywords)
            satisfied = count >= requirement.min_count
            results.append(
                AuditOutcome(
                    requirement=requirement.name,
                    satisfied=satisfied,
                    count=count,
                    details=f"Found {count} matches for keywords {requirement.keywords}",
                )
            )
        return results

    async def audit_async(self) -> List[AuditOutcome]:
        return await asyncio.to_thread(self.evaluate)
