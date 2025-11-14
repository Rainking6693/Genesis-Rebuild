"""
AsyncThink Coordinator
======================

Provides the fork/join organizer→worker protocol inspired by AsyncThink-style
orchestration so the swarm layer can trigger multiple sub-tasks concurrently and
gather their outcomes.
"""

from __future__ import annotations

import asyncio
import logging
import time
from dataclasses import dataclass, field
from typing import Any, Awaitable, Callable, Dict, List, Optional

logger = logging.getLogger(__name__)


AsyncWorker = Callable[[], Awaitable[Any]]


@dataclass
class AsyncSubtask:
    """Represents a single worker job in the fork/join pipeline."""

    id: str
    worker: AsyncWorker
    description: str = ""
    metadata: Dict[str, Any] = field(default_factory=dict)


@dataclass
class AsyncSubtaskResult:
    """Describes the outcome of executing an AsyncSubtask."""

    subtask_id: str
    description: str
    success: bool
    result: Any = None
    error: Optional[str] = None
    duration_seconds: float = 0.0


class AsyncThinkCoordinator:
    """Fork/join organizer-worker protocol for the swarm layer."""

    def __init__(self, concurrency: int = 4) -> None:
        self._semaphore = asyncio.Semaphore(concurrency)
        self.concurrency = concurrency

    async def fork_join(self, context: str, subtasks: List[AsyncSubtask]) -> List[AsyncSubtaskResult]:
        """
        Run all subtasks concurrently up to the configured concurrency and return their results.
        """
        if not subtasks:
            return []

        logger.info(f"[AsyncThink] Fork/join | context={context} | concurrency={self.concurrency} | subtasks={len(subtasks)}")

        tasks = [asyncio.create_task(self._run_subtask(subtask)) for subtask in subtasks]
        results = await asyncio.gather(*tasks)
        logger.info(f"[AsyncThink] Join complete | context={context} | completed={len(results)}")
        return results

    async def _run_subtask(self, subtask: AsyncSubtask) -> AsyncSubtaskResult:
        start = time.perf_counter()
        async with self._semaphore:
            try:
                result = await subtask.worker()
                duration = time.perf_counter() - start
                logger.debug(f"[AsyncThink] Subtask {subtask.id} succeeded in {duration:.3f}s")
                return AsyncSubtaskResult(
                    subtask_id=subtask.id,
                    description=subtask.description,
                    success=True,
                    result=result,
                    duration_seconds=duration,
                )
            except Exception as exc:
                duration = time.perf_counter() - start
                logger.warning(f"[AsyncThink] Subtask {subtask.id} failed: {exc}")
                return AsyncSubtaskResult(
                    subtask_id=subtask.id,
                    description=subtask.description,
                    success=False,
                    error=str(exc),
                    duration_seconds=duration,
                )
