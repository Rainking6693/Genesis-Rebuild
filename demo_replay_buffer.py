"""
Replay Buffer Demo - Production Usage Example

Demonstrates how to use ReplayBuffer for agent learning:
1. Store agent trajectories (successes and failures)
2. Sample for training
3. Query best/worst examples
4. Track statistics
5. Prune old data

This shows the Darwin Gödel Machine learning loop foundation.
"""

import time
from datetime import datetime, timezone
from infrastructure.replay_buffer import (
    ReplayBuffer,
    Trajectory,
    ActionStep,
    OutcomeTag,
    get_replay_buffer
)


def create_example_trajectory(
    traj_id: str,
    agent_id: str,
    task: str,
    success: bool,
    steps_description: list
) -> Trajectory:
    """
    Create a realistic trajectory example

    Args:
        traj_id: Unique trajectory ID
        agent_id: Agent that performed the task
        task: Task description
        success: Whether task succeeded
        steps_description: List of (tool_name, reasoning) tuples
    """
    steps = []
    for i, (tool_name, reasoning) in enumerate(steps_description):
        step = ActionStep(
            timestamp=datetime.now(timezone.utc).isoformat(),
            tool_name=tool_name,
            tool_args={"step": i, "context": task},
            tool_result=f"Executed {tool_name} successfully" if success else f"{tool_name} failed",
            agent_reasoning=reasoning
        )
        steps.append(step)
        time.sleep(0.001)  # Small delay for realistic timestamps

    return Trajectory(
        trajectory_id=traj_id,
        agent_id=agent_id,
        task_description=task,
        initial_state={"task_queue": [task], "resources": "available"},
        steps=tuple(steps),
        final_outcome=OutcomeTag.SUCCESS.value if success else OutcomeTag.FAILURE.value,
        reward=1.0 if success else 0.2,
        metadata={
            "environment": "production",
            "user_priority": "high" if "urgent" in task.lower() else "normal"
        },
        created_at=datetime.now(timezone.utc).isoformat(),
        duration_seconds=len(steps_description) * 2.5
    )


def demo_basic_usage():
    """Demonstrate basic store and retrieve"""
    print("\n" + "="*70)
    print("DEMO 1: Basic Store and Retrieve")
    print("="*70)

    with ReplayBuffer(db_name="demo_replay_buffer") as buffer:
        # Create a successful trajectory
        success_traj = create_example_trajectory(
            traj_id="demo_success_1",
            agent_id="builder_agent",
            task="Build authentication module",
            success=True,
            steps_description=[
                ("read_spec", "First, I need to understand the requirements"),
                ("generate_code", "Based on spec, generate JWT authentication code"),
                ("run_tests", "Verify implementation with unit tests"),
                ("deploy", "Deploy to staging environment")
            ]
        )

        # Store trajectory
        traj_id = buffer.store_trajectory(success_traj)
        print(f"\nStored trajectory: {traj_id}")

        # Retrieve and display
        retrieved = buffer.get_trajectory(traj_id)
        print(f"\nRetrieved Trajectory:")
        print(f"  Agent: {retrieved.agent_id}")
        print(f"  Task: {retrieved.task_description}")
        print(f"  Outcome: {retrieved.final_outcome}")
        print(f"  Reward: {retrieved.reward}")
        print(f"  Steps: {len(retrieved.steps)}")
        print(f"  Duration: {retrieved.duration_seconds:.1f}s")


def demo_learning_from_success_and_failure():
    """Demonstrate contrastive learning (success vs failure)"""
    print("\n" + "="*70)
    print("DEMO 2: Learning from Success and Failure")
    print("="*70)

    with ReplayBuffer(db_name="demo_replay_buffer") as buffer:
        # Store successful deployment
        success_deploy = create_example_trajectory(
            traj_id="deploy_success_1",
            agent_id="deploy_agent",
            task="Deploy payment service",
            success=True,
            steps_description=[
                ("check_health", "Verify all dependencies are healthy"),
                ("run_migrations", "Apply database schema changes"),
                ("canary_deploy", "Deploy to 5% of traffic first"),
                ("monitor_metrics", "Watch error rates for 10 minutes"),
                ("full_rollout", "No errors detected, proceed to 100%")
            ]
        )
        buffer.store_trajectory(success_deploy)

        # Store failed deployment
        failed_deploy = create_example_trajectory(
            traj_id="deploy_failure_1",
            agent_id="deploy_agent",
            task="Deploy payment service",
            success=False,
            steps_description=[
                ("check_health", "Dependencies look good"),
                ("run_migrations", "Database migrations applied"),
                ("canary_deploy", "Deployed to 5% traffic"),
                ("monitor_metrics", "ERROR: 50% error rate detected!"),
                ("rollback", "Immediate rollback to previous version")
            ]
        )
        buffer.store_trajectory(failed_deploy)

        # Query successful patterns
        print("\nSuccessful deployment patterns:")
        successes = buffer.get_successful_trajectories(task_type="Deploy", top_n=5)
        for traj in successes:
            print(f"  - {traj.trajectory_id}: reward={traj.reward:.2f}, steps={len(traj.steps)}")
            print(f"    Final step: {traj.steps[-1].tool_name}")

        # Query failures to learn what NOT to do
        print("\nFailed deployments (for contrastive learning):")
        failures = buffer.get_failed_trajectories(task_type="Deploy", top_n=5)
        for traj in failures:
            print(f"  - {traj.trajectory_id}: reward={traj.reward:.2f}")
            # Find where it went wrong
            for step in traj.steps:
                if "ERROR" in step.tool_result or "error" in step.agent_reasoning.lower():
                    print(f"    Problem at: {step.tool_name} - {step.agent_reasoning}")


def demo_random_sampling():
    """Demonstrate random sampling for training"""
    print("\n" + "="*70)
    print("DEMO 3: Random Sampling for Training")
    print("="*70)

    with ReplayBuffer(db_name="demo_replay_buffer") as buffer:
        # Store diverse trajectories
        tasks = [
            ("Build login form", True),
            ("Fix database bug", True),
            ("Deploy to production", False),
            ("Write unit tests", True),
            ("Optimize query performance", True),
            ("Update documentation", True),
            ("Fix broken link", False),
            ("Refactor legacy code", True),
        ]

        for i, (task, success) in enumerate(tasks):
            traj = create_example_trajectory(
                traj_id=f"sample_{i}",
                agent_id=f"agent_{i % 3}",
                task=task,
                success=success,
                steps_description=[
                    ("analyze", f"Analyzing task: {task}"),
                    ("execute", f"Executing: {task}"),
                    ("verify", f"Verifying result")
                ]
            )
            buffer.store_trajectory(traj)

        # Random sample (not biased to recent)
        print("\nRandom sample of 5 trajectories for training batch:")
        random_batch = buffer.sample_trajectories(n=5)
        for traj in random_batch:
            print(f"  - {traj.task_description} ({traj.final_outcome})")

        # Sample only successes
        print("\nSample only successful trajectories:")
        success_batch = buffer.sample_trajectories(n=3, outcome=OutcomeTag.SUCCESS)
        for traj in success_batch:
            print(f"  - {traj.task_description} (reward={traj.reward})")


def demo_statistics():
    """Demonstrate comprehensive statistics tracking"""
    print("\n" + "="*70)
    print("DEMO 4: Statistics and Monitoring")
    print("="*70)

    with ReplayBuffer(db_name="demo_replay_buffer") as buffer:
        # Store trajectories from multiple agents
        agents = ["builder", "deploy", "qa", "analyst"]
        for agent in agents:
            for i in range(5):
                success = i < 4  # 80% success rate
                traj = create_example_trajectory(
                    traj_id=f"{agent}_traj_{i}",
                    agent_id=f"{agent}_agent",
                    task=f"{agent} task {i}",
                    success=success,
                    steps_description=[
                        ("step1", "First step"),
                        ("step2", "Second step")
                    ]
                )
                buffer.store_trajectory(traj)

        # Get comprehensive stats
        stats = buffer.get_statistics()
        print(f"\nOverall Statistics:")
        print(f"  Total trajectories: {stats['total_trajectories']}")
        print(f"  Storage backend: {stats['storage_backend']}")
        print(f"  Average reward: {stats['avg_reward']:.2f}")
        print(f"  Average duration: {stats['avg_duration_seconds']:.1f}s")

        print(f"\nBy Outcome:")
        for outcome, count in stats['by_outcome'].items():
            print(f"  {outcome}: {count}")

        print(f"\nBy Agent:")
        for agent_id, agent_stats in stats['by_agent'].items():
            print(f"  {agent_id}:")
            print(f"    Total tasks: {agent_stats['total']}")
            print(f"    Successes: {agent_stats['successes']}")
            print(f"    Success rate: {agent_stats['success_rate']:.1%}")
            print(f"    Avg reward: {agent_stats['avg_reward']:.2f}")


def demo_singleton_pattern():
    """Demonstrate thread-safe singleton"""
    print("\n" + "="*70)
    print("DEMO 5: Thread-Safe Singleton Pattern")
    print("="*70)

    # Get singleton instance
    buffer1 = get_replay_buffer()
    buffer2 = get_replay_buffer()

    print(f"\nBuffer 1 ID: {id(buffer1)}")
    print(f"Buffer 2 ID: {id(buffer2)}")
    print(f"Same instance: {buffer1 is buffer2}")

    # Store in one, retrieve from other (same instance)
    traj = create_example_trajectory(
        traj_id="singleton_test",
        agent_id="test_agent",
        task="Test singleton pattern",
        success=True,
        steps_description=[("test", "Testing singleton")]
    )

    buffer1.store_trajectory(traj)
    retrieved = buffer2.get_trajectory("singleton_test")

    print(f"Stored via buffer1, retrieved via buffer2: {retrieved is not None}")
    print(f"Task: {retrieved.task_description if retrieved else 'N/A'}")


def main():
    """Run all demos"""
    print("\n" + "="*70)
    print("REPLAY BUFFER DEMONSTRATION")
    print("Production-Ready Agent Learning System")
    print("="*70)

    # Run demos
    demo_basic_usage()
    demo_learning_from_success_and_failure()
    demo_random_sampling()
    demo_statistics()
    demo_singleton_pattern()

    print("\n" + "="*70)
    print("DEMONSTRATION COMPLETE")
    print("="*70)
    print("\nKey Takeaways:")
    print("1. ReplayBuffer captures all agent actions for learning")
    print("2. Supports contrastive learning (success vs failure)")
    print("3. Random sampling prevents recency bias")
    print("4. Comprehensive statistics for monitoring")
    print("5. Thread-safe singleton for production use")
    print("6. Graceful degradation when backends unavailable")
    print("\nIntegration Point:")
    print("- Darwin Gödel Machine uses this for self-improvement")
    print("- Agents learn from past trajectories")
    print("- ReasoningBank distills trajectories into strategy nuggets")
    print("="*70 + "\n")


if __name__ == "__main__":
    main()
