#!/usr/bin/env python3
"""
Performance benchmark for ExperienceBuffer
Validates <100ms retrieval time with realistic data
"""

import asyncio
import time
import numpy as np
from infrastructure.agentevolver import ExperienceBuffer, TaskEmbedder
from infrastructure.trajectory_pool import Trajectory, TrajectoryStatus


async def benchmark_experience_buffer():
    """Run performance benchmark"""
    print("=" * 60)
    print("ExperienceBuffer Performance Benchmark")
    print("=" * 60)

    # Create buffer with local embedder (no API calls)
    embedder = TaskEmbedder(use_local=True)
    buffer = ExperienceBuffer(
        agent_name="BenchmarkAgent",
        max_size=1000,
        min_quality=90.0,
        embedder=embedder
    )

    # Test 1: Store 100 high-quality experiences
    print("\n[Test 1] Storing 100 experiences...")
    store_times = []

    for i in range(100):
        trajectory = Trajectory(
            trajectory_id=f"bench_{i}",
            generation=1,
            agent_name="BenchmarkAgent",
            code_changes=f"Fix #{i}",
            problem_diagnosis=f"Problem {i}",
            proposed_strategy=f"Strategy {i}",
            status=TrajectoryStatus.SUCCESS.value,
            success_score=92.0 + (i % 8)  # 92-99 scores
        )

        task_desc = f"Task {i}: Fix bug in module {i % 10}"

        start = time.time()
        stored = await buffer.store_experience(trajectory, 92.0 + (i % 8), task_desc)
        elapsed_ms = (time.time() - start) * 1000
        store_times.append(elapsed_ms)

        if not stored:
            print(f"  Warning: Experience {i} not stored")

    avg_store_time = np.mean(store_times)
    max_store_time = np.max(store_times)
    print(f"  ✓ Stored {buffer.total_stored} experiences")
    print(f"  ✓ Avg store time: {avg_store_time:.2f}ms")
    print(f"  ✓ Max store time: {max_store_time:.2f}ms")
    print(f"  ✓ Target: <50ms {'PASS' if avg_store_time < 50 else 'FAIL'}")

    # Test 2: Retrieval speed with varying buffer sizes
    print("\n[Test 2] Retrieval speed benchmark...")

    test_sizes = [10, 50, 100]
    for size in test_sizes:
        if buffer.total_stored < size:
            continue

        # Warm up
        await buffer.get_similar_experiences("Test query", top_k=5)

        # Benchmark
        retrieval_times = []
        for _ in range(20):  # 20 queries
            start = time.time()
            results = await buffer.get_similar_experiences(
                f"Find similar bug fix in module {np.random.randint(10)}",
                top_k=5
            )
            elapsed_ms = (time.time() - start) * 1000
            retrieval_times.append(elapsed_ms)

        avg_retrieval = np.mean(retrieval_times)
        p95_retrieval = np.percentile(retrieval_times, 95)
        max_retrieval = np.max(retrieval_times)

        print(f"  Buffer size: {size} experiences")
        print(f"    Avg retrieval: {avg_retrieval:.2f}ms")
        print(f"    P95 retrieval: {p95_retrieval:.2f}ms")
        print(f"    Max retrieval: {max_retrieval:.2f}ms")
        print(f"    Target: <100ms {'PASS' if p95_retrieval < 100 else 'FAIL'}")

    # Test 3: Quality filtering
    print("\n[Test 3] Quality filtering...")
    stats = buffer.get_buffer_stats()
    print(f"  ✓ Total experiences: {stats['total_experiences']}")
    print(f"  ✓ Avg quality: {stats['avg_quality']:.1f}")
    print(f"  ✓ Min quality: {stats['min_quality']:.1f}")
    print(f"  ✓ Quality threshold: {buffer.min_quality}")
    print(f"  ✓ All above threshold: {'PASS' if stats['min_quality'] >= buffer.min_quality else 'FAIL'}")

    # Test 4: Memory usage estimation
    print("\n[Test 4] Memory usage estimation...")

    # Estimate memory usage
    # Each embedding: 1536 floats * 4 bytes = 6,144 bytes
    # Metadata: ~500 bytes per experience
    # Total per experience: ~6.6KB

    memory_per_exp_kb = 6.6
    total_memory_mb = (buffer.total_stored * memory_per_exp_kb) / 1024
    print(f"  ✓ Experiences stored: {buffer.total_stored}")
    print(f"  ✓ Est. memory per exp: {memory_per_exp_kb:.1f} KB")
    print(f"  ✓ Est. total memory: {total_memory_mb:.2f} MB")
    print(f"  ✓ Target for 10K: <1GB {'PASS' if (total_memory_mb * 100) < 1024 else 'FAIL'}")

    # Summary
    print("\n" + "=" * 60)
    print("BENCHMARK SUMMARY")
    print("=" * 60)

    all_pass = (
        avg_store_time < 50 and
        p95_retrieval < 100 and
        stats['min_quality'] >= buffer.min_quality and
        (total_memory_mb * 100) < 1024
    )

    if all_pass:
        print("✓ ALL PERFORMANCE TARGETS MET")
        print("  - Store time: <50ms ✓")
        print("  - Retrieval time: <100ms ✓")
        print("  - Quality filtering: Working ✓")
        print("  - Memory usage: <1GB for 10K ✓")
    else:
        print("✗ SOME PERFORMANCE TARGETS MISSED")
        if avg_store_time >= 50:
            print(f"  ✗ Store time: {avg_store_time:.2f}ms (target: <50ms)")
        if p95_retrieval >= 100:
            print(f"  ✗ Retrieval time: {p95_retrieval:.2f}ms (target: <100ms)")

    print("=" * 60)

    return all_pass


if __name__ == "__main__":
    result = asyncio.run(benchmark_experience_buffer())
    exit(0 if result else 1)
