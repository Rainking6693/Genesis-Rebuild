"""Memori-backed reasoning codebook manager for Genesis agents."""

from __future__ import annotations

import hashlib
import logging
from dataclasses import dataclass
from typing import List, Optional

from infrastructure.memory.memori_client import MemoriClient

logger = logging.getLogger(__name__)


@dataclass
class CodebookEntry:
    id: str
    snippet: str
    tags: List[str]
    agent_id: str
    timestamp: str


class CodebookManager:
    def __init__(self, namespace: str = "codebook") -> None:
        self.namespace = namespace
        self.client = MemoriClient()

    def _make_key(self, agent_id: str, snippet: str) -> str:
        digest = hashlib.sha256(snippet.encode("utf-8")).hexdigest()
        return f"codebook::{agent_id}::{digest}"

    def store_snippet(self, agent_id: str, snippet: str, tags: Optional[List[str]] = None) -> CodebookEntry:
        tags = tags or []
        key = self._make_key(agent_id, snippet)
        record = self.client.upsert_memory(
            namespace=self.namespace,
            subject=agent_id,
            key=key,
            value={"snippet": snippet, "tags": tags},
            metadata={"tags": tags},
        )
        logger.debug("Stored codebook snippet %s for %s", key, agent_id)
        return CodebookEntry(
            id=key,
            snippet=snippet,
            tags=tags,
            agent_id=agent_id,
            timestamp=record.created_at.isoformat(),
        )

    def retrieve_snippets(self, agent_id: str, tags: Optional[List[str]] = None, limit: int = 3) -> List[CodebookEntry]:
        records = self.client.list_memory(self.namespace, subject=agent_id)
        filtered: List[CodebookEntry] = []
        tag_set = set((tag or "").lower() for tag in (tags or []))
        for record in records:
            payload = record.value or {}
            snippet = payload.get("snippet", "")
            entry_tags = [t.lower() for t in (payload.get("tags") or [])]
            if tag_set and not tag_set.intersection(entry_tags):
                continue
            filtered.append(
                CodebookEntry(
                    id=record.key,
                    snippet=snippet,
                    tags=payload.get("tags", []),
                    agent_id=agent_id,
                    timestamp=record.created_at.isoformat(),
                )
            )
            if len(filtered) >= limit:
                break
        return filtered
