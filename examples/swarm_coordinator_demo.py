"""
SwarmCoordinator Demo - Team-Based Task Execution

Demonstrates the integration of PSO-optimized team generation
with HALO routing for coordinated task execution.

Run with: python examples/swarm_coordinator_demo.py
"""

import asyncio
from infrastructure.orchestration import create_swarm_coordinator
from infrastructure.halo_router import HALORouter
from infrastructure.task_dag import Task


async def demo_team_optimization():
    """Demo 1: Optimize team for a specific task"""
    print("=" * 60)
    print("DEMO 1: Team Optimization for E-commerce Platform")
    print("=" * 60)

    # Initialize coordinator
    halo = HALORouter()
    coordinator = create_swarm_coordinator(
        halo,
        n_particles=30,
        max_iterations=50,
        random_seed=42
    )

    # Create task
    task = Task(
        task_id="ecommerce_build_001",
        task_type="business_creation",
        description="Build e-commerce platform with payment processing, testing, and deployment"
    )

    # Generate optimal team
    print(f"\nTask: {task.description}")
    print("\nOptimizing team using PSO with Inclusive Fitness...")
    team = await coordinator.generate_optimal_team(task, team_size=3)

    print(f"\nOptimal Team (size={len(team)}):")
    for agent in team:
        print(f"  - {agent}")

    # Get team metrics
    diversity = coordinator.swarm_bridge.get_team_genotype_diversity(team)
    cooperation = coordinator.swarm_bridge.get_team_cooperation_score(team)

    print(f"\nTeam Metrics:")
    print(f"  Genotype Diversity: {diversity:.2f}")
    print(f"  Cooperation Score: {cooperation:.2f}")

    return coordinator, task, team


async def demo_team_execution(coordinator, task, team):
    """Demo 2: Execute task with team coordination"""
    print("\n" + "=" * 60)
    print("DEMO 2: Team-Based Task Execution")
    print("=" * 60)

    print(f"\nExecuting task '{task.task_id}' with team...")
    result = await coordinator.execute_team_task(task, team)

    print(f"\nExecution Result:")
    print(f"  Status: {result.status}")
    print(f"  Team: {result.team}")
    print(f"  Execution Time: {result.execution_time:.3f}s")
    print(f"  Team Members Completed: {len(result.individual_results)}/{len(team)}")

    if result.errors:
        print(f"  Errors: {result.errors}")

    return result


async def demo_business_spawning(coordinator):
    """Demo 3: Business-specific team spawning"""
    print("\n" + "=" * 60)
    print("DEMO 3: Business-Specific Team Spawning")
    print("=" * 60)

    business_types = [
        ("ecommerce", "medium"),
        ("saas", "complex"),
        ("content_platform", "simple"),
    ]

    for business_type, complexity in business_types:
        print(f"\n{business_type.upper()} ({complexity} complexity):")
        team = await coordinator.spawn_dynamic_team_for_business(
            business_type,
            complexity=complexity
        )

        print(f"  Team (size={len(team)}): {', '.join(team)}")

        # Team metrics
        diversity = coordinator.swarm_bridge.get_team_genotype_diversity(team)
        cooperation = coordinator.swarm_bridge.get_team_cooperation_score(team)

        print(f"  Diversity: {diversity:.2f}, Cooperation: {cooperation:.2f}")


async def demo_performance_tracking(coordinator, task, team):
    """Demo 4: Performance tracking over multiple executions"""
    print("\n" + "=" * 60)
    print("DEMO 4: Performance Tracking")
    print("=" * 60)

    print(f"\nExecuting task 3 times with same team...")
    for i in range(3):
        result = await coordinator.execute_team_task(task, team)
        print(f"  Execution {i+1}: {result.status} ({result.execution_time:.3f}s)")

    # Check performance history
    history = coordinator.get_team_performance_history(team)

    print(f"\nTeam Performance History:")
    print(f"  Team: {', '.join(history['team'])}")
    print(f"  Total Executions: {history['execution_count']}")
    print(f"  Success Rate: {history['success_rate']:.1%}")
    print(f"  Performance Score: {history['performance']:.2f}")


async def demo_parallel_execution(coordinator):
    """Demo 5: Parallel team execution"""
    print("\n" + "=" * 60)
    print("DEMO 5: Parallel Team Execution")
    print("=" * 60)

    # Create 3 different tasks
    tasks = [
        Task(
            task_id=f"parallel_task_{i}",
            task_type="generic",
            description=f"Parallel task {i}"
        )
        for i in range(3)
    ]

    # Generate teams
    teams = []
    for task in tasks:
        team = await coordinator.generate_optimal_team(task, team_size=2)
        teams.append(team)
        print(f"\nTask {task.task_id}: {team}")

    # Execute all in parallel
    print(f"\nExecuting {len(tasks)} tasks in parallel...")
    import time
    start = time.time()

    results = await asyncio.gather(*[
        coordinator.execute_team_task(task, team)
        for task, team in zip(tasks, teams)
    ])

    elapsed = time.time() - start

    print(f"\nParallel Execution Complete:")
    print(f"  Total Time: {elapsed:.3f}s")
    print(f"  Tasks Completed: {sum(1 for r in results if r.status == 'completed')}/{len(results)}")
    print(f"  Average Time per Task: {elapsed/len(results):.3f}s")


async def main():
    """Run all demos"""
    print("\n" + "=" * 60)
    print("SWARM COORDINATOR DEMONSTRATION")
    print("PSO-Optimized Team Generation + HALO Routing")
    print("=" * 60)

    # Demo 1: Team optimization
    coordinator, task, team = await demo_team_optimization()

    # Demo 2: Team execution
    result = await demo_team_execution(coordinator, task, team)

    # Demo 3: Business-specific teams
    await demo_business_spawning(coordinator)

    # Demo 4: Performance tracking
    await demo_performance_tracking(coordinator, task, team)

    # Demo 5: Parallel execution
    await demo_parallel_execution(coordinator)

    print("\n" + "=" * 60)
    print("DEMONSTRATION COMPLETE")
    print("=" * 60)
    print("\nKey Takeaways:")
    print("  ✓ PSO generates optimal teams based on task requirements")
    print("  ✓ Genotype cooperation improves team coordination")
    print("  ✓ Business-specific teams adapt to complexity")
    print("  ✓ Performance tracking enables continuous improvement")
    print("  ✓ Parallel execution scales efficiently")


if __name__ == "__main__":
    asyncio.run(main())
