#!/usr/bin/env python3
"""
Performance Profiling Tool for Genesis Orchestration Pipeline

Profiles:
1. HTDAG task decomposition
2. HALO agent routing
3. AOP validation
4. TaskDAG operations

Uses cProfile, tracemalloc, and custom timing to identify bottlenecks.
"""

import asyncio
import cProfile
import io
import logging
import pstats
import sys
import time
import tracemalloc
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Callable, Dict, List, Optional

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from infrastructure.htdag_planner import HTDAGPlanner
from infrastructure.halo_router import HALORouter, AgentCapability, RoutingPlan
from infrastructure.aop_validator import AOPValidator
from infrastructure.task_dag import TaskDAG, Task

logging.basicConfig(level=logging.WARNING)
logger = logging.getLogger(__name__)


@dataclass
class ProfileResult:
    """Profiling result for a single operation"""
    operation_name: str
    execution_time: float  # seconds
    memory_peak: float  # MB
    memory_current: float  # MB
    call_count: int
    top_functions: List[tuple]  # [(function_name, time_spent, calls)]


@dataclass
class ProfilingReport:
    """Complete profiling report"""
    results: List[ProfileResult]
    total_time: float
    total_memory_peak: float

    def get_top_bottlenecks(self, n: int = 5) -> List[ProfileResult]:
        """Get top N slowest operations"""
        return sorted(self.results, key=lambda r: r.execution_time, reverse=True)[:n]

    def get_memory_intensive(self, n: int = 5) -> List[ProfileResult]:
        """Get top N memory-intensive operations"""
        return sorted(self.results, key=lambda r: r.memory_peak, reverse=True)[:n]


class OrchestrationProfiler:
    """Profiler for orchestration pipeline"""

    def __init__(self):
        self.results: List[ProfileResult] = []

    def profile_sync_function(
        self,
        func: Callable,
        operation_name: str,
        *args,
        **kwargs
    ) -> ProfileResult:
        """Profile synchronous function with cProfile and tracemalloc"""

        # Start memory tracking
        tracemalloc.start()

        # Start time tracking
        start_time = time.perf_counter()

        # Profile with cProfile
        profiler = cProfile.Profile()
        profiler.enable()

        # Execute function
        result = func(*args, **kwargs)

        # Stop profiling
        profiler.disable()

        # Stop timing
        execution_time = time.perf_counter() - start_time

        # Get memory stats
        current, peak = tracemalloc.get_traced_memory()
        tracemalloc.stop()

        # Extract top functions
        stats = pstats.Stats(profiler)
        stats.sort_stats('cumulative')

        # Get top 10 functions by cumulative time
        stream = io.StringIO()
        stats.stream = stream
        stats.print_stats(10)
        stats_text = stream.getvalue()

        # Parse top functions (simplified)
        top_functions = []
        for line in stats_text.split('\n')[5:15]:  # Skip header
            if line.strip():
                parts = line.split()
                if len(parts) >= 4:
                    try:
                        ncalls = parts[0]
                        tottime = float(parts[1])
                        func_name = ' '.join(parts[5:]) if len(parts) > 5 else parts[-1]
                        top_functions.append((func_name, tottime, ncalls))
                    except (ValueError, IndexError):
                        pass

        profile_result = ProfileResult(
            operation_name=operation_name,
            execution_time=execution_time,
            memory_peak=peak / 1024 / 1024,  # Convert to MB
            memory_current=current / 1024 / 1024,
            call_count=stats.total_calls,
            top_functions=top_functions[:5]
        )

        self.results.append(profile_result)
        return profile_result

    async def profile_async_function(
        self,
        func: Callable,
        operation_name: str,
        *args,
        **kwargs
    ) -> ProfileResult:
        """Profile async function with timing and tracemalloc"""

        # Start memory tracking
        tracemalloc.start()

        # Start time tracking
        start_time = time.perf_counter()

        # Execute async function
        result = await func(*args, **kwargs)

        # Stop timing
        execution_time = time.perf_counter() - start_time

        # Get memory stats
        current, peak = tracemalloc.get_traced_memory()
        tracemalloc.stop()

        profile_result = ProfileResult(
            operation_name=operation_name,
            execution_time=execution_time,
            memory_peak=peak / 1024 / 1024,  # Convert to MB
            memory_current=current / 1024 / 1024,
            call_count=0,  # Not available for async
            top_functions=[]
        )

        self.results.append(profile_result)
        return profile_result

    def generate_report(self) -> ProfilingReport:
        """Generate profiling report"""
        total_time = sum(r.execution_time for r in self.results)
        total_memory_peak = max((r.memory_peak for r in self.results), default=0)

        return ProfilingReport(
            results=self.results,
            total_time=total_time,
            total_memory_peak=total_memory_peak
        )


# ============================================================================
# HTDAG PROFILING
# ============================================================================

def profile_htdag_decomposition():
    """Profile HTDAG task decomposition operations"""
    print("\n" + "=" * 80)
    print("PROFILING HTDAG PLANNER")
    print("=" * 80 + "\n")

    profiler = OrchestrationProfiler()
    planner = HTDAGPlanner()

    # Test case 1: Simple task decomposition (no LLM)
    print("1. Simple task decomposition...")
    result = asyncio.run(
        profiler.profile_async_function(
            planner.decompose_task,
            "HTDAG: Simple decomposition",
            "Build a simple landing page"
        )
    )
    print(f"   Time: {result.execution_time*1000:.2f}ms, Memory: {result.memory_peak:.2f}MB")

    # Test case 2: Complex business task decomposition
    print("2. Complex business task decomposition...")
    result = asyncio.run(
        profiler.profile_async_function(
            planner.decompose_task,
            "HTDAG: Complex business decomposition",
            "Build a SaaS business with authentication, payments, and analytics"
        )
    )
    print(f"   Time: {result.execution_time*1000:.2f}ms, Memory: {result.memory_peak:.2f}MB")

    # Test case 3: DAG cycle detection
    print("3. DAG cycle detection...")
    dag = TaskDAG()
    for i in range(100):
        dag.add_task(Task(task_id=f"task_{i}", task_type="generic", description=f"Task {i}"))

    # Add linear dependencies
    for i in range(99):
        dag.add_dependency(f"task_{i}", f"task_{i+1}")

    def check_cycles():
        return dag.has_cycle()

    result = profiler.profile_sync_function(
        check_cycles,
        "HTDAG: Cycle detection (100 tasks)"
    )
    print(f"   Time: {result.execution_time*1000:.2f}ms, Memory: {result.memory_peak:.2f}MB")

    # Test case 4: Topological sort on large DAG
    print("4. Topological sort (100 tasks)...")
    def topo_sort():
        return dag.topological_sort()

    result = profiler.profile_sync_function(
        topo_sort,
        "HTDAG: Topological sort (100 tasks)"
    )
    print(f"   Time: {result.execution_time*1000:.2f}ms, Memory: {result.memory_peak:.2f}MB")

    return profiler


# ============================================================================
# HALO PROFILING
# ============================================================================

def profile_halo_routing():
    """Profile HALO router operations"""
    print("\n" + "=" * 80)
    print("PROFILING HALO ROUTER")
    print("=" * 80 + "\n")

    profiler = OrchestrationProfiler()
    router = HALORouter()

    # Test case 1: Small DAG routing (5 tasks)
    print("1. Small DAG routing (5 tasks)...")
    dag = TaskDAG()
    for i in range(5):
        task_type = ["design", "implement", "test", "deploy", "monitor"][i]
        dag.add_task(Task(task_id=f"task_{i}", task_type=task_type, description=f"Task {i}"))

    result = asyncio.run(
        profiler.profile_async_function(
            router.route_tasks,
            "HALO: Small DAG routing (5 tasks)",
            dag
        )
    )
    print(f"   Time: {result.execution_time*1000:.2f}ms, Memory: {result.memory_peak:.2f}MB")

    # Test case 2: Medium DAG routing (50 tasks)
    print("2. Medium DAG routing (50 tasks)...")
    dag = TaskDAG()
    task_types = ["design", "implement", "test", "deploy", "monitor", "security", "analytics"]
    for i in range(50):
        task_type = task_types[i % len(task_types)]
        dag.add_task(Task(task_id=f"task_{i}", task_type=task_type, description=f"Task {i}"))

    result = asyncio.run(
        profiler.profile_async_function(
            router.route_tasks,
            "HALO: Medium DAG routing (50 tasks)",
            dag
        )
    )
    print(f"   Time: {result.execution_time*1000:.2f}ms, Memory: {result.memory_peak:.2f}MB")

    # Test case 3: Large DAG routing (200 tasks)
    print("3. Large DAG routing (200 tasks)...")
    dag = TaskDAG()
    for i in range(200):
        task_type = task_types[i % len(task_types)]
        dag.add_task(Task(task_id=f"task_{i}", task_type=task_type, description=f"Task {i}"))

    result = asyncio.run(
        profiler.profile_async_function(
            router.route_tasks,
            "HALO: Large DAG routing (200 tasks)",
            dag
        )
    )
    print(f"   Time: {result.execution_time*1000:.2f}ms, Memory: {result.memory_peak:.2f}MB")

    # Test case 4: Rule matching benchmark
    print("4. Rule matching (1000 iterations)...")
    task = Task(task_id="test", task_type="implement", description="Test task")

    def rule_matching_benchmark():
        for _ in range(1000):
            router._apply_routing_logic(task, list(router.agent_registry.keys()))

    result = profiler.profile_sync_function(
        rule_matching_benchmark,
        "HALO: Rule matching (1000 iterations)"
    )
    print(f"   Time: {result.execution_time*1000:.2f}ms, Memory: {result.memory_peak:.2f}MB")
    print(f"   Avg per match: {result.execution_time*1000/1000:.3f}ms")

    return profiler


# ============================================================================
# AOP PROFILING
# ============================================================================

def profile_aop_validation():
    """Profile AOP validator operations"""
    print("\n" + "=" * 80)
    print("PROFILING AOP VALIDATOR")
    print("=" * 80 + "\n")

    profiler = OrchestrationProfiler()

    # Create validator with agent registry
    router = HALORouter()
    validator = AOPValidator(agent_registry=router.agent_registry)

    # Test case 1: Small routing plan validation (5 tasks)
    print("1. Small routing plan validation (5 tasks)...")
    dag = TaskDAG()
    for i in range(5):
        task_type = ["design", "implement", "test", "deploy", "monitor"][i]
        dag.add_task(Task(task_id=f"task_{i}", task_type=task_type, description=f"Task {i}"))

    routing_plan = RoutingPlan(
        assignments={f"task_{i}": ["spec_agent", "builder_agent", "qa_agent", "deploy_agent", "monitoring_agent"][i] for i in range(5)}
    )

    result = asyncio.run(
        profiler.profile_async_function(
            validator.validate_routing_plan,
            "AOP: Small plan validation (5 tasks)",
            routing_plan,
            dag
        )
    )
    print(f"   Time: {result.execution_time*1000:.2f}ms, Memory: {result.memory_peak:.2f}MB")

    # Test case 2: Medium routing plan validation (50 tasks)
    print("2. Medium routing plan validation (50 tasks)...")
    dag = TaskDAG()
    task_types = ["design", "implement", "test", "deploy", "monitor", "security", "analytics"]
    agents = ["spec_agent", "builder_agent", "qa_agent", "deploy_agent", "monitoring_agent", "security_agent", "analytics_agent"]

    for i in range(50):
        task_type = task_types[i % len(task_types)]
        dag.add_task(Task(task_id=f"task_{i}", task_type=task_type, description=f"Task {i}"))

    routing_plan = RoutingPlan(
        assignments={f"task_{i}": agents[i % len(agents)] for i in range(50)}
    )

    result = asyncio.run(
        profiler.profile_async_function(
            validator.validate_routing_plan,
            "AOP: Medium plan validation (50 tasks)",
            routing_plan,
            dag
        )
    )
    print(f"   Time: {result.execution_time*1000:.2f}ms, Memory: {result.memory_peak:.2f}MB")

    # Test case 3: Quality score calculation
    print("3. Quality score calculation (100 tasks)...")
    dag = TaskDAG()
    for i in range(100):
        task_type = task_types[i % len(task_types)]
        dag.add_task(Task(task_id=f"task_{i}", task_type=task_type, description=f"Task {i}"))

    routing_plan = RoutingPlan(
        assignments={f"task_{i}": agents[i % len(agents)] for i in range(100)}
    )

    result = asyncio.run(
        profiler.profile_async_function(
            validator._calculate_quality_score,
            "AOP: Quality score (100 tasks)",
            routing_plan,
            dag
        )
    )
    print(f"   Time: {result.execution_time*1000:.2f}ms, Memory: {result.memory_peak:.2f}MB")

    # Test case 4: Solvability check
    print("4. Solvability check (100 tasks)...")
    result = asyncio.run(
        profiler.profile_async_function(
            validator._check_solvability,
            "AOP: Solvability check (100 tasks)",
            routing_plan,
            dag
        )
    )
    print(f"   Time: {result.execution_time*1000:.2f}ms, Memory: {result.memory_peak:.2f}MB")

    return profiler


# ============================================================================
# MAIN PROFILING RUNNER
# ============================================================================

def main():
    """Run all profiling tests and generate report"""
    print("\n" + "=" * 80)
    print("GENESIS ORCHESTRATION PERFORMANCE PROFILING")
    print("=" * 80)

    # Profile each component
    htdag_profiler = profile_htdag_decomposition()
    halo_profiler = profile_halo_routing()
    aop_profiler = profile_aop_validation()

    # Combine all results
    all_results = (
        htdag_profiler.results +
        halo_profiler.results +
        aop_profiler.results
    )

    # Generate summary report
    print("\n" + "=" * 80)
    print("PROFILING SUMMARY")
    print("=" * 80 + "\n")

    # Top 10 slowest operations
    sorted_by_time = sorted(all_results, key=lambda r: r.execution_time, reverse=True)
    print("TOP 10 SLOWEST OPERATIONS:")
    for i, result in enumerate(sorted_by_time[:10], 1):
        print(f"{i:2}. {result.operation_name:50} {result.execution_time*1000:8.2f}ms  {result.memory_peak:6.2f}MB")

    # Top 10 memory-intensive operations
    print("\nTOP 10 MEMORY-INTENSIVE OPERATIONS:")
    sorted_by_memory = sorted(all_results, key=lambda r: r.memory_peak, reverse=True)
    for i, result in enumerate(sorted_by_memory[:10], 1):
        print(f"{i:2}. {result.operation_name:50} {result.memory_peak:6.2f}MB  {result.execution_time*1000:8.2f}ms")

    # Component breakdown
    print("\nCOMPONENT BREAKDOWN:")
    htdag_time = sum(r.execution_time for r in htdag_profiler.results)
    halo_time = sum(r.execution_time for r in halo_profiler.results)
    aop_time = sum(r.execution_time for r in aop_profiler.results)
    total_time = htdag_time + halo_time + aop_time

    print(f"  HTDAG:  {htdag_time*1000:8.2f}ms ({htdag_time/total_time*100:5.1f}%)")
    print(f"  HALO:   {halo_time*1000:8.2f}ms ({halo_time/total_time*100:5.1f}%)")
    print(f"  AOP:    {aop_time*1000:8.2f}ms ({aop_time/total_time*100:5.1f}%)")
    print(f"  TOTAL:  {total_time*1000:8.2f}ms")

    print("\n" + "=" * 80)
    print("PROFILING COMPLETE")
    print("=" * 80 + "\n")

    return all_results


if __name__ == "__main__":
    results = main()
