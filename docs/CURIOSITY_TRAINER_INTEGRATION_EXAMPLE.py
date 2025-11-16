"""
Curiosity-Driven Trainer Integration Examples - Phase 1

This file demonstrates how to integrate the curiosity trainer with
real agents and the AgentEvolver ecosystem.

Author: Nova (Vertex AI Agent Specialist)
Date: November 15, 2025
"""

import asyncio
from infrastructure.agentevolver.curiosity_trainer import (
    CuriosityDrivenTrainer,
    TrainingOrchestrator,
    TrainingSession,
    TrainingMetrics
)
from infrastructure.agentevolver.self_questioning import SelfQuestioningEngine
from infrastructure.agentevolver.experience_buffer import ExperienceBuffer


# ============================================================================
# EXAMPLE 1: Single-Agent Training with Marketing Agent
# ============================================================================

async def example_single_agent_training():
    """
    Train a single marketing agent with curiosity-driven self-improvement.
    """
    print("=" * 70)
    print("EXAMPLE 1: Single-Agent Marketing Training")
    print("=" * 70)

    # Step 1: Define the agent executor (your actual agent logic)
    async def marketing_agent_executor(task_description: str) -> dict:
        """
        Example agent executor. In reality, this would call your MarketingAgent.
        """
        # Your agent implementation here
        return {
            "strategy": "Growth marketing for SaaS",
            "channels": ["email", "content", "partnership"],
            "budget": 10000,
            "timeline": "Q1 2025",
            "metrics": ["MRR growth", "CAC reduction"],
            "result": f"Generated strategy for: {task_description}"
        }

    # Step 2: Initialize experience buffer for reuse
    buffer = ExperienceBuffer(
        agent_name="marketing",
        max_size=1000,
        min_quality=75.0
    )

    # Step 3: Create trainer
    trainer = CuriosityDrivenTrainer(
        agent_type="marketing",
        agent_executor=marketing_agent_executor,
        experience_buffer=buffer,
        quality_threshold=75.0,
        early_stop_patience=5
    )

    # Step 4: Create self-questioning engine
    engine = SelfQuestioningEngine(agent_type="marketing", max_task_difficulty=0.8)

    # Step 5: Run training epoch
    print("\nStarting training epoch...")
    metrics, session = await trainer.train_epoch(
        num_tasks=25,
        agent_type="marketing",
        ap2_budget_remaining=50.0,
        cost_per_task=0.5,
        self_questioning_engine=engine
    )

    # Step 6: Analyze results
    print(f"\nTraining Complete:")
    print(f"  Session ID: {metrics.session_id}")
    print(f"  Tasks Executed: {metrics.tasks_executed}")
    print(f"  Success Rate: {metrics.success_rate:.0%}")
    print(f"  Avg Quality: {metrics.avg_quality_score:.1f}/100")
    print(f"  Cost Incurred: ${metrics.total_cost_incurred:.2f}")
    print(f"  Experiences Stored: {metrics.high_quality_experiences_stored}")
    print(f"  Novelty Score: {metrics.novelty_weighted_score:.1f}")
    print(f"  Improvement: {metrics.improvement_delta:+.1f} vs baseline")
    print(f"  Duration: {metrics.duration_seconds:.1f}s")

    return metrics, session


# ============================================================================
# EXAMPLE 2: Multi-Agent Orchestration
# ============================================================================

async def example_multi_agent_orchestration():
    """
    Train multiple agents in parallel with shared budget management.
    """
    print("\n" + "=" * 70)
    print("EXAMPLE 2: Multi-Agent Orchestration")
    print("=" * 70)

    # Define agent executors
    async def marketing_executor(task_desc: str) -> dict:
        return {"channels": ["email", "social"], "budget": 5000}

    async def seo_executor(task_desc: str) -> dict:
        return {
            "keywords": ["python", "async", "ml"],
            "recommendations": ["improve site speed", "add meta tags"],
            "seo_score_before": 45,
            "seo_score_after": 65
        }

    async def content_executor(task_desc: str) -> dict:
        return {
            "title": "Advanced Agent Training",
            "sections": ["Introduction", "Methods", "Results", "Conclusion"],
            "word_count": 2500
        }

    # Initialize trainer for each agent type
    marketing_trainer = CuriosityDrivenTrainer(
        agent_type="marketing",
        agent_executor=marketing_executor,
        quality_threshold=75.0
    )

    seo_trainer = CuriosityDrivenTrainer(
        agent_type="seo",
        agent_executor=seo_executor,
        quality_threshold=75.0
    )

    content_trainer = CuriosityDrivenTrainer(
        agent_type="content",
        agent_executor=content_executor,
        quality_threshold=75.0
    )

    # Create orchestrator with shared budget
    orchestrator = TrainingOrchestrator(
        max_concurrent_sessions=4,
        total_ap2_budget=200.0,  # $200 total budget
        max_budget_per_session=50.0,  # $50 per agent max
        cost_per_task=0.5
    )

    # Register all trainers
    orchestrator.register_trainer("marketing", marketing_trainer)
    orchestrator.register_trainer("seo", seo_trainer)
    orchestrator.register_trainer("content", content_trainer)

    # Create engines for each agent type
    engines = {
        "marketing": SelfQuestioningEngine("marketing"),
        "seo": SelfQuestioningEngine("seo"),
        "content": SelfQuestioningEngine("content")
    }

    # Run training round (all agents in parallel)
    print("\nStarting parallel training round...")
    results = await orchestrator.run_training_round(
        agent_types=["marketing", "seo", "content"],
        tasks_per_agent=25,
        self_questioning_engines=engines
    )

    # Analyze aggregated results
    print(f"\nTraining Round Complete:")
    print(f"  Agents Trained: {results['agents_trained']}")
    print(f"  Total Tasks: {results['total_tasks_executed']}")
    print(f"  Overall Success Rate: {results['overall_success_rate']:.0%}")
    print(f"  Overall Avg Quality: {results['overall_avg_quality']:.1f}/100")
    print(f"  Total Cost: ${results['total_cost']:.2f}")
    print(f"  Budget Remaining: ${results['budget_remaining']:.2f}")
    print(f"  Experiences Stored: {results['total_experiences_stored']}")
    print(f"  Throughput: {results['tasks_per_minute']:.1f} tasks/min")

    # Per-agent breakdown
    print(f"\nPer-Agent Breakdown:")
    for agent_type, agent_results in results['by_agent'].items():
        metrics = agent_results['metrics']
        print(f"  {agent_type.upper()}:")
        print(f"    - Tasks: {metrics['tasks_executed']}")
        print(f"    - Avg Quality: {metrics['avg_quality_score']:.1f}")
        print(f"    - Cost: ${metrics['total_cost_incurred']:.2f}")

    # Orchestrator status
    status = orchestrator.get_orchestrator_status()
    print(f"\nOrchestrator Status:")
    print(f"  Trainers Registered: {status['trainers_registered']}")
    print(f"  Sessions Run: {status['total_sessions_run']}")
    print(f"  Total Budget: ${status['total_budget']:.2f}")
    print(f"  Remaining: ${status['remaining_budget']:.2f}")
    print(f"  Uptime: {status['uptime_seconds']:.1f}s")

    return results


# ============================================================================
# EXAMPLE 3: Monitoring and Analysis
# ============================================================================

async def example_monitoring_and_analysis():
    """
    Monitor training progress and analyze session history.
    """
    print("\n" + "=" * 70)
    print("EXAMPLE 3: Monitoring and Analysis")
    print("=" * 70)

    # Setup simple trainer
    async def dummy_executor(task: str) -> dict:
        return {"result": task, "quality_score": 80.0}

    trainer = CuriosityDrivenTrainer(
        agent_type="marketing",
        agent_executor=dummy_executor,
        quality_threshold=75.0
    )

    # Get initial history
    history = trainer.get_session_history()
    print(f"\nInitial Session History:")
    print(f"  Agent Type: {history['agent_type']}")
    print(f"  Total Sessions: {history['total_sessions']}")
    print(f"  Quality Threshold: {history['quality_threshold']}")
    print(f"  Buffer Enabled: {history['buffer_enabled']}")
    print(f"  Best Quality Seen: {history['best_quality_seen']}")

    # Create training session for analysis
    session = TrainingSession(
        session_id="MONITOR-001",
        agent_type="marketing",
        start_time=__import__('datetime').datetime.now()
    )

    # Simulate training results
    scores = [72.0, 78.0, 85.0, 80.0, 88.0, 79.0]
    for score in scores:
        session.add_quality_score(score)

    session.mark_complete()

    # Analyze session
    print(f"\nSession Analysis:")
    print(f"  Session ID: {session.session_id}")
    print(f"  Status: {session.status}")
    print(f"  Quality Scores: {session.quality_scores}")
    print(f"  Success Rate (>=75): {session.success_rate:.0%}")
    print(f"  Improvement Delta: {session.improvement_delta:+.1f}")
    print(f"  Duration: {session.duration_seconds:.2f}s")

    # Serialize for storage
    session_data = session.to_dict()
    print(f"\nSession Serialization (sample fields):")
    print(f"  Keys available: {list(session_data.keys())}")

    return session_data


# ============================================================================
# EXAMPLE 4: Budget Management and Early Stopping
# ============================================================================

async def example_budget_management():
    """
    Demonstrate budget enforcement and early stopping behavior.
    """
    print("\n" + "=" * 70)
    print("EXAMPLE 4: Budget Management and Early Stopping")
    print("=" * 70)

    call_count = [0]
    low_quality_count = [0]

    # Executor that returns varying quality
    async def variable_executor(task: str) -> dict:
        call_count[0] += 1

        # First 3 tasks: good quality
        if call_count[0] <= 3:
            quality = 85.0
        # Next 3 tasks: declining quality
        elif call_count[0] <= 6:
            quality = 70.0
            low_quality_count[0] += 1
        # Further tasks: still low quality
        else:
            quality = 65.0
            low_quality_count[0] += 1

        return {"quality_score": quality, "result": f"Task {call_count[0]}"}

    trainer = CuriosityDrivenTrainer(
        agent_type="marketing",
        agent_executor=variable_executor,
        quality_threshold=75.0,
        early_stop_patience=3  # Stop after 3 tasks without improvement
    )

    # Create mock engine that returns empty task list
    class MockEngine:
        async def generate_tasks(self, n: int):
            from unittest.mock import MagicMock
            tasks = []
            for i in range(n):
                task = MagicMock()
                task.task_id = f"TASK-{i}"
                task.description = f"Test task {i}"
                task.novelty_score = 50.0 + (i % 10) * 5
                task.expected_quality_metric = "quality_score"
                tasks.append(task)
            return tasks

    engine = MockEngine()

    print(f"\nRunning training with early stopping (patience=3)...")
    metrics, session = await trainer.train_epoch(
        num_tasks=20,
        agent_type="marketing",
        ap2_budget_remaining=100.0,  # High budget to test early stopping
        cost_per_task=0.5,
        self_questioning_engine=engine
    )

    print(f"\nBudget Management Results:")
    print(f"  Target Tasks: 20")
    print(f"  Actual Tasks Executed: {metrics.tasks_executed}")
    print(f"  Budget Remaining: ${100.0 - metrics.total_cost_incurred:.2f}")
    print(f"  Cost Incurred: ${metrics.total_cost_incurred:.2f}")
    print(f"  Reason for Stopping: Early stopping (no improvement)")

    return metrics


# ============================================================================
# Main Entry Point
# ============================================================================

async def main():
    """
    Run all examples.
    """
    print("\n")
    print("*" * 70)
    print("CURIOSITY-DRIVEN TRAINER - INTEGRATION EXAMPLES")
    print("*" * 70)

    # Run examples
    metrics1, session1 = await example_single_agent_training()
    results2 = await example_multi_agent_orchestration()
    session_data3 = await example_monitoring_and_analysis()
    metrics4 = await example_budget_management()

    print("\n" + "=" * 70)
    print("ALL EXAMPLES COMPLETED SUCCESSFULLY")
    print("=" * 70)
    print()


if __name__ == "__main__":
    # Run examples (note: this is for demonstration)
    # In practice, you'd integrate these with your actual agents
    print("These are reference examples for integrating curiosity_trainer.")
    print("Run them with: python docs/CURIOSITY_TRAINER_INTEGRATION_EXAMPLE.py")
    print()
    print("Key takeaways:")
    print("1. Single-agent training: CuriosityDrivenTrainer for one agent type")
    print("2. Multi-agent training: TrainingOrchestrator for parallel execution")
    print("3. Monitoring: TrainingSession captures all relevant metrics")
    print("4. Budget management: Automatic enforcement stops when limit reached")
    print("5. Early stopping: Prevents wasted budget with configurable patience")
