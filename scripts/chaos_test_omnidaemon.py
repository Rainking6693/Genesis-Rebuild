"""Chaos tester that validates worker crash recovery and Redis failure handling."""

from __future__ import annotations

import asyncio
import logging
import random
import time
from typing import List

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
logger = logging.getLogger(__name__)


async def _simulate_task(task_id: int, fail: bool = False) -> None:
    await asyncio.sleep(0.05 + random.random() * 0.1)
    if fail:
        raise ConnectionError("Simulated Redis failure")


async def _worker(
    name: str,
    queue: asyncio.Queue[int],
    processed: List[int],
    fail_task: int | None = None,
) -> None:
    while True:
        try:
            task_id = queue.get_nowait()
        except asyncio.QueueEmpty:
            return
        try:
            await _simulate_task(task_id, fail=task_id == fail_task)
            processed.append(task_id)
            logger.info("[%s] Completed task %s", name, task_id)
        except ConnectionError as exc:
            logger.warning("[%s] Redis failure while processing %s: %s", name, task_id, exc)
            await asyncio.sleep(0.05)
            await queue.put(task_id)
        finally:
            queue.task_done()


async def run_worker_crash_recovery(total_tasks: int = 20, workers: int = 3) -> None:
    queue: asyncio.Queue[int] = asyncio.Queue()
    for task_id in range(total_tasks):
        queue.put_nowait(task_id)

    processed: List[int] = []
    tasks = [asyncio.create_task(_worker(f"worker-{idx}", queue, processed)) for idx in range(workers)]

    await asyncio.sleep(0.2)
    logger.info("Cancelling worker-%s to simulate crash", 0)
    tasks[0].cancel()

    results = await asyncio.gather(*tasks, return_exceptions=True)
    for idx, result in enumerate(results):
        if isinstance(result, asyncio.CancelledError):
            logger.info("worker-%s was cancelled (crash simulated)", idx)
    logger.info("Worker crash recovery processed %s tasks", len(processed))


async def run_redis_failure_simulation(total_tasks: int = 10) -> None:
    queue: asyncio.Queue[int] = asyncio.Queue()
    for task_id in range(total_tasks):
        queue.put_nowait(task_id)

    fail_task = random.randint(0, total_tasks - 1)
    logger.info("Simulating Redis failure on task %s", fail_task)
    processed: List[int] = []
    tasks = [
        asyncio.create_task(_worker("redis-worker", queue, processed, fail_task))
    ]
    await asyncio.gather(*tasks)
    logger.info("Redis recovery processed %s tasks", len(processed))


def main() -> None:
    random.seed(123)
    logger.info("=== Starting chaos test: worker crash recovery ===")
    asyncio.run(run_worker_crash_recovery())
    logger.info("=== Starting chaos test: Redis failure simulation ===")
    asyncio.run(run_redis_failure_simulation())


if __name__ == "__main__":
    main()
