"""
AgentEvolver Phase 3 Integration Example

Demonstrates Self-Attributing reward shaping integrated with CuriosityDrivenTrainer
and ExperienceBuffer from Phase 1-2.

Shows:
1. Tracking individual agent contributions to tasks
2. Shaping rewards using multiple strategies (LINEAR, EXPONENTIAL, SIGMOID)
3. Computing fair Shapley-based attribution for multi-agent tasks
4. Integration with existing training infrastructure

Run with: python examples/agentevolver_phase3_integration.py
"""

import asyncio
import logging
from typing import Dict, List
import numpy as np

from infrastructure.agentevolver import (
    ContributionTracker,
    RewardShaper,
    AttributionEngine,
    RewardStrategy,
    ExperienceBuffer,
    CuriosityDrivenTrainer,
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class SimpleAgent:
    """Minimal agent for demonstration."""

    def __init__(self, agent_id: str, specialization: str = "general"):
        self.agent_id = agent_id
        self.specialization = specialization

    async def execute_task(self, task_description: str, effort: float = 1.0) -> float:
        """Execute task and return quality score (0-100)."""
        # Simulate task execution with some variance
        base_quality = np.random.uniform(60, 80)
        specialization_bonus = (10 if self.specialization in task_description else 0)
        return base_quality + specialization_bonus + np.random.normal(0, 2)


async def example_1_contribution_tracking():
    """Example 1: Track individual agent contributions."""
    logger.info("Example 1: Contribution Tracking")
    logger.info("=" * 60)

    tracker = ContributionTracker(max_history_size=1000)

    # Simulate contributions from 3 agents on a task
    task_id = "task_001_llm_optimization"
    baseline_quality = 75.0

    agents = ["agent_analyzer", "agent_optimizer", "agent_validator"]

    for i, agent_id in enumerate(agents):
        # Each agent improves quality slightly
        quality_improvement = (i + 1) * 3  # 3, 6, 9 points
        contribution_score = await tracker.record_contribution(
            agent_id=agent_id,
            task_id=task_id,
            quality_before=baseline_quality + (i * 3),
            quality_after=baseline_quality + (i + 1) * 3,
            effort_ratio=0.9 + (i * 0.05),  # Increasing effort
            impact_multiplier=1.0 + (i * 0.1),  # Increasing criticality
        )
        logger.info(f"  {agent_id}: contribution_score={contribution_score:.3f}")

    # Query contribution scores
    logger.info("\nContribution scores after task:")
    for agent_id in agents:
        score = await tracker.get_contribution_score(agent_id, task_id=task_id)
        logger.info(f"  {agent_id}: {score:.3f}")

    logger.info("")


async def example_2_reward_shaping():
    """Example 2: Reward shaping with different strategies."""
    logger.info("Example 2: Reward Shaping Strategies")
    logger.info("=" * 60)

    # Test all three strategies
    strategies = [
        RewardStrategy.LINEAR,
        RewardStrategy.EXPONENTIAL,
        RewardStrategy.SIGMOID,
    ]

    contribution_scores = {
        "agent_analyzer": 0.2,
        "agent_optimizer": 0.5,
        "agent_validator": 0.9,
    }

    for strategy in strategies:
        logger.info(f"\nStrategy: {strategy.value.upper()}")
        logger.info("-" * 40)

        shaper = RewardShaper(base_reward=100.0, strategy=strategy)

        for agent_id, contribution in contribution_scores.items():
            reward = shaper.compute_shaped_reward(agent_id, contribution)
            logger.info(f"  {agent_id} (contrib={contribution:.2f}): reward={reward:.2f}")

    # Demonstrate reward distribution
    logger.info("\nReward distribution (LINEAR strategy, 1000 total pool):")
    logger.info("-" * 40)

    shaper = RewardShaper(base_reward=1.0, strategy=RewardStrategy.LINEAR)
    distribution = shaper.get_reward_distribution(contribution_scores, total_reward_pool=1000.0)

    for agent_id, reward in distribution.items():
        logger.info(f"  {agent_id}: ${reward:.2f}")

    stats = shaper.get_strategy_stats()
    logger.info(f"\nStrategy stats: {stats}")
    logger.info("")


async def example_3_multi_agent_attribution():
    """Example 3: Multi-agent task attribution with Shapley values."""
    logger.info("Example 3: Multi-Agent Shapley Attribution")
    logger.info("=" * 60)

    # Create agents with different strengths
    agents_list = [
        SimpleAgent("analyzer", specialization="analysis"),
        SimpleAgent("optimizer", specialization="optimization"),
        SimpleAgent("validator", specialization="validation"),
        SimpleAgent("documenter", specialization="documentation"),
    ]

    # Create attribution engine
    engine = AttributionEngine(shapley_iterations=50)  # Fewer iterations for demo

    # Execute task with all agents
    task_id = "task_002_llm_analysis"
    task_description = "Analyze and optimize LLM inference pipeline with validation"

    logger.info(f"\nTask: {task_description}")
    logger.info(f"Agents: {[a.agent_id for a in agents_list]}")

    # Collect contributions
    agent_contributions = {}
    baseline = 70.0

    for i, agent in enumerate(agents_list):
        quality = await agent.execute_task(task_description, effort=0.95)
        # Quality delta represents contribution
        contribution = (quality - baseline) / 10.0  # Normalize to 0-1 scale
        contribution = max(0.0, min(1.0, contribution))
        agent_contributions[agent.agent_id] = contribution
        logger.info(f"  {agent.agent_id}: quality={quality:.1f}, contribution={contribution:.3f}")

    # Compute fair attribution
    logger.info("\nComputing Shapley-based attribution...")
    report = await engine.attribute_multi_agent_task(
        task_id=task_id,
        agent_contributions=agent_contributions,
        total_reward=100.0,  # $100 total reward
        strategy=RewardStrategy.LINEAR,
    )

    logger.info(f"\nAttribution Report (computed in {report.computation_time_ms:.2f}ms):")
    logger.info(f"  Strategy: {report.strategy_used}")
    logger.info("  Shapley values:")
    for agent_id, shapley_value in report.contributions.items():
        reward = report.rewards.get(agent_id, 0.0)
        logger.info(f"    {agent_id}: shapley={shapley_value:.3f}, reward=${reward:.2f}")

    # Get agent rankings
    ranking = await engine.get_agent_ranking(window_size=50)
    logger.info("\nAgent rankings by average Shapley value:")
    for rank, (agent_id, avg_value) in enumerate(ranking, 1):
        logger.info(f"  {rank}. {agent_id}: {avg_value:.3f}")

    logger.info("")


async def example_4_concurrent_multi_task():
    """Example 4: Concurrent multi-task attribution with performance."""
    logger.info("Example 4: Concurrent Multi-Task Attribution (Performance)")
    logger.info("=" * 60)

    tracker = ContributionTracker()
    shaper = RewardShaper(base_reward=1.0, strategy=RewardStrategy.EXPONENTIAL)
    engine = AttributionEngine(
        contribution_tracker=tracker,
        reward_shaper=shaper,
        shapley_iterations=100,  # More iterations for accuracy
    )

    agents = [f"agent_{i}" for i in range(12)]  # 12 agents
    num_tasks = 20

    logger.info(f"Processing {num_tasks} tasks with {len(agents)} concurrent agents...")

    import time

    start = time.perf_counter()

    # Process tasks concurrently
    tasks = []
    for task_idx in range(num_tasks):
        task_id = f"task_{task_idx:03d}"

        # Simulate contributions with some variance
        contributions = {
            agent: np.random.uniform(0.3, 0.95) for agent in agents
        }

        tasks.append(
            engine.attribute_multi_agent_task(
                task_id=task_id,
                agent_contributions=contributions,
                total_reward=100.0,
                strategy=RewardStrategy.EXPONENTIAL,
            )
        )

    # Wait for all to complete
    reports = await asyncio.gather(*tasks)
    elapsed = time.perf_counter() - start

    avg_time = (elapsed * 1000) / num_tasks  # Convert to ms per task
    logger.info(f"Completed {num_tasks} tasks in {elapsed:.2f}s")
    logger.info(f"Average time per task: {avg_time:.2f}ms (target: <50ms)")
    logger.info(f"Throughput: {num_tasks / elapsed:.1f} tasks/second")

    # Show statistics
    logger.info("\nComputation time distribution:")
    times = [r.computation_time_ms for r in reports]
    logger.info(f"  Min: {min(times):.2f}ms")
    logger.info(f"  Max: {max(times):.2f}ms")
    logger.info(f"  Mean: {np.mean(times):.2f}ms")
    logger.info(f"  P95: {np.percentile(times, 95):.2f}ms")

    logger.info("")


async def example_5_integration_with_trainer():
    """Example 5: Integration with CuriosityDrivenTrainer (Phase 2)."""
    logger.info("Example 5: Integration with CuriosityDrivenTrainer")
    logger.info("=" * 60)

    logger.info("This demonstrates how Phase 3 Self-Attributing integrates with Phase 2:")
    logger.info("")

    example_code = '''
    from infrastructure.agentevolver import (
        CuriosityDrivenTrainer,
        ExperienceBuffer,
        ContributionTracker,
        AttributionEngine,
    )

    # Initialize Phase 2 components
    trainer = CuriosityDrivenTrainer(agent_name="specialist_agent")
    buffer = ExperienceBuffer(agent_name="specialist_agent")

    # Initialize Phase 3 components
    tracker = ContributionTracker()
    engine = AttributionEngine(contribution_tracker=tracker)

    # In training loop:
    for task in generated_tasks:
        # Phase 2: Execute task with curiosity-driven selection
        output, quality = await trainer.execute_task(task)

        # Phase 3: Track contribution
        await tracker.record_contribution(
            agent_id=trainer.agent_name,
            task_id=task.id,
            quality_before=baseline,
            quality_after=quality,
        )

        # Phase 3: Shape reward based on contribution
        contribution = await tracker.get_contribution_score(
            trainer.agent_name,
            task.id
        )
        shaped_reward = engine.shaper.compute_shaped_reward(
            trainer.agent_name,
            contribution,
        )

        # Phase 2: Store in buffer if high quality
        if quality > 90:
            await buffer.store_experience(output, quality)

        # Update trainer with shaped reward
        await trainer.update_with_reward(shaped_reward)
    '''

    logger.info(example_code)
    logger.info("")


async def main():
    """Run all examples."""
    logger.info("\nAgentEvolver Phase 3 Integration Examples")
    logger.info("==========================================\n")

    await example_1_contribution_tracking()
    await example_2_reward_shaping()
    await example_3_multi_agent_attribution()
    await example_4_concurrent_multi_task()
    await example_5_integration_with_trainer()

    logger.info("All examples completed successfully!")


if __name__ == "__main__":
    asyncio.run(main())
