"""Synthetic load tester for the OmniDaemon queue."""

from __future__ import annotations

import argparse
import asyncio
import random
import statistics
import time


async def _simulate_task(task_id: int) -> float:
    """Emulate an OmniDaemon agent call with slight jitter."""
    duration = random.uniform(0.04, 0.15)
    await asyncio.sleep(duration)
    return duration


async def _worker(name: str, queue: asyncio.Queue[int], durations: list[float]) -> None:
    while True:
        try:
            task_id = queue.get_nowait()
        except asyncio.QueueEmpty:
            return
        start = time.perf_counter()
        await _simulate_task(task_id)
        elapsed = time.perf_counter() - start
        durations.append(elapsed)


async def _run_benchmark(total_tasks: int, workers: int) -> dict:
    queue: asyncio.Queue[int] = asyncio.Queue()
    for task_id in range(total_tasks):
        queue.put_nowait(task_id)

    durations: list[float] = []
    tasks = [
        asyncio.create_task(_worker(f"worker-{idx}", queue, durations))
        for idx in range(workers)
    ]
    start = time.perf_counter()
    await asyncio.gather(*tasks)
    elapsed = time.perf_counter() - start
    throughput = total_tasks / elapsed if elapsed else float("inf")
    avg_latency = statistics.mean(durations) if durations else 0.0
    return {
        "workers": workers,
        "total_tasks": total_tasks,
        "elapsed": elapsed,
        "throughput": throughput,
        "avg_latency": avg_latency,
    }


def main() -> None:
    parser = argparse.ArgumentParser(description="Load test OmniDaemon worker concurrency")
    parser.add_argument("--tasks", type=int, default=100, help="Total task count to simulate")
    parser.add_argument(
        "--workers",
        type=int,
        nargs="+",
        default=[1, 5, 10],
        help="Worker counts to benchmark (space-separated)",
    )
    parser.add_argument("--seed", type=int, default=42, help="Random seed for reproducibility")
    args = parser.parse_args()

    random.seed(args.seed)
    results = []
    for count in args.workers:
        print(f"--> Running load test with {count} worker(s)")
        stats = asyncio.run(_run_benchmark(args.tasks, count))
        results.append(stats)
        print(
            f"    elapsed={stats['elapsed']:.2f}s throughput={stats['throughput']:.1f} tasks/s "
            f"avg_latency={stats['avg_latency']:.3f}s"
        )

    baseline = results[0]["throughput"] if results else 0.0
    if baseline:
        for stats in results:
            multiplier = stats["throughput"] / baseline if baseline else 0
            print(f"    workers={stats['workers']} -> {multiplier:.2f}x baseline throughput")


if __name__ == "__main__":
    main()
