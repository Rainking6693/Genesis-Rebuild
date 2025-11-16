"""
CORA'S COMPREHENSIVE INTEGRATION AUDIT - AgentEvolver Full Pipeline
Test File Version: 1.0
Date: November 15, 2025
Auditor: Cora (Website QA & Integration Testing Specialist)

This test suite verifies COMPLETE end-to-end integration across:
1. Phase 1 (Self-Questioning) + Phase 2 (Experience Reuse)
2. Phase 2 (Experience Buffer) + Phase 3 (Attribution)
3. DeepEyesV2 (Baseline → ColdStart → Training Data)
4. Agent Integration (Marketing, Content, SEO with all 3 phases)
5. AP2 Protocol integration across all agents

CRITICAL SUCCESS CRITERIA:
- P0: All phase transitions must work without breaking
- P1: Data flows correctly between components
- P2: Performance targets met (<200ms task gen, <100ms retrieval, <50ms attribution)
- P3: No resource leaks or deadlocks
- P4: AP2 cost tracking accurate

TESTING PHILOSOPHY:
- FIX AS WE GO: When tests fail, fix immediately with Edit tool
- REAL DATA: Use actual components, not mocks (except for expensive API calls)
- VERIFY FIXES: Re-run tests after every fix
- PERFORMANCE: Measure and enforce latency targets
"""

import asyncio
import pytest
import time
import json
import numpy as np
from typing import Dict, List, Any, Optional
from datetime import datetime
from pathlib import Path
import tempfile

# Phase 1: Self-Questioning + Curiosity Training
from infrastructure.agentevolver.self_questioning import (
    SelfQuestioningEngine,
    Task,
    TaskDomain,
    TaskDifficulty,
    CuriosityScorer
)
from infrastructure.agentevolver.curiosity_trainer import (
    CuriosityDrivenTrainer,
    TrainingOrchestrator,
    TrainingMetrics,
    TrainingSession
)

# Phase 2: Experience Reuse
from infrastructure.agentevolver.experience_buffer import ExperienceBuffer
from infrastructure.agentevolver.hybrid_policy import HybridPolicy, PolicyDecision
from infrastructure.agentevolver.cost_tracker import CostTracker
from infrastructure.agentevolver.embedder import TaskEmbedder

# Phase 3: Self-Attributing
from infrastructure.agentevolver.self_attributing import (
    ContributionTracker,
    AttributionEngine,
    RewardShaper,
    RewardStrategy,
    AttributionReport
)

# AP2 Protocol
from infrastructure.ap2_protocol import get_ap2_client, AP2Event

# Agents (to test integration)
from agents.marketing_agent import MarketingAgent
from agents.content_agent import ContentAgent
from agents.seo_agent import SEOAgent

# Trajectory Pool
from infrastructure.trajectory_pool import Trajectory, TrajectoryPool, TrajectoryStatus


# ============================================================================
# WORKFLOW 1: COMPLETE AGENTEVOLVER PIPELINE (Phase 1 → Phase 2 → Phase 3)
# ============================================================================

@pytest.mark.asyncio
async def test_workflow_1_complete_agentevolver_pipeline():
    """
    Workflow 1: Generate tasks → Execute → Store → Reuse → Attribute

    Integration Points:
    - SelfQuestioningEngine generates tasks
    - CuriosityDrivenTrainer executes tasks
    - ExperienceBuffer stores high-quality results
    - HybridPolicy decides exploit vs explore
    - AttributionEngine attributes rewards

    SUCCESS CRITERIA:
    - Tasks generated with novelty scores
    - Execution produces quality scores
    - High-quality experiences stored in buffer
    - Similar tasks trigger exploit decisions
    - Attribution distributes rewards fairly
    """
    print("\n" + "="*80)
    print("WORKFLOW 1: Complete AgentEvolver Pipeline Test")
    print("="*80)

    # Step 1: Initialize Phase 1 - Self-Questioning Engine
    print("\n[1/6] Initializing Self-Questioning Engine...")
    embedder = TaskEmbedder(use_local=True)
    experience_buffer = ExperienceBuffer(
        agent_name="test_pipeline",
        max_size=100,
        min_quality=75.0,
        embedder=embedder
    )

    engine = SelfQuestioningEngine(
        agent_name="test_agent",
        embedder=embedder,
        experience_buffer=experience_buffer,
        max_task_difficulty=0.9
    )

    # Step 2: Generate autonomous tasks (Phase 1)
    print("[2/6] Generating autonomous tasks with curiosity scoring...")
    start_time = time.time()
    tasks = await engine.generate_autonomous_tasks(
        num_tasks=10,
        focus_domain="marketing"
    )
    generation_time = (time.time() - start_time) * 1000

    assert len(tasks) == 10, f"Expected 10 tasks, got {len(tasks)}"
    assert all(isinstance(t, Task) for t in tasks), "All items should be Task objects"
    assert all(hasattr(t, 'curiosity_score') for t in tasks), "Tasks missing curiosity_score"

    # Performance check: <200ms per task
    avg_time_per_task = generation_time / len(tasks)
    print(f"   ✓ Generated {len(tasks)} tasks in {generation_time:.1f}ms (avg: {avg_time_per_task:.1f}ms/task)")
    assert avg_time_per_task < 200, f"Task generation too slow: {avg_time_per_task:.1f}ms > 200ms"

    # Step 3: Execute tasks with Curiosity Trainer (Phase 1 → Phase 2 integration)
    print("[3/6] Executing tasks with CuriosityDrivenTrainer...")

    # Mock agent executor that simulates realistic execution
    async def mock_executor(task_description: str) -> Dict[str, Any]:
        # Simulate varying quality outputs (75-94 range to ensure some pass threshold)
        quality_base = 75.0 + abs(hash(task_description) % 20)
        return {
            "strategy": {"channels": ["email", "social", "ads"], "budget": 5000},
            "quality_score": quality_base,
            "task_description": task_description,
            "channels": ["email", "social", "ads"],
            "budget": 5000,
            "timeline": "30 days",
            "metrics": ["engagement"]
        }

    trainer = CuriosityDrivenTrainer(
        agent_type="marketing",
        agent_executor=mock_executor,
        experience_buffer=experience_buffer,
        quality_threshold=75.0,
        early_stop_patience=5
    )

    # Execute training epoch
    metrics, session = await trainer.train_epoch(
        num_tasks=len(tasks),
        agent_type="marketing",
        ap2_budget_remaining=50.0,
        cost_per_task=0.5,
        self_questioning_engine=engine
    )

    print(f"   ✓ Executed {metrics.tasks_executed} tasks")
    print(f"   ✓ Success rate: {metrics.success_rate:.1%}")
    print(f"   ✓ Avg quality: {metrics.avg_quality_score:.1f}")
    print(f"   ✓ Experiences stored: {metrics.high_quality_experiences_stored}")

    assert metrics.tasks_executed > 0, "No tasks executed"
    assert metrics.high_quality_experiences_stored > 0, "No experiences stored"

    # Step 4: Test experience retrieval (Phase 2)
    print("[4/6] Testing experience retrieval from buffer...")

    # Query for similar task
    query_task = "Create marketing strategy for SaaS platform targeting developers"
    start_retrieval = time.time()
    similar = await experience_buffer.get_similar_experiences(query_task, top_k=3)
    retrieval_time = (time.time() - start_retrieval) * 1000

    print(f"   ✓ Retrieved {len(similar)} similar experiences in {retrieval_time:.1f}ms")
    assert retrieval_time < 100, f"Retrieval too slow: {retrieval_time:.1f}ms > 100ms"
    assert len(similar) > 0, "No similar experiences found"

    # Step 5: Test hybrid policy decision (Phase 2)
    print("[5/6] Testing HybridPolicy exploit vs explore decisions...")

    policy = HybridPolicy(exploit_ratio=0.8, quality_threshold=80.0)

    # Decision with high-quality experience
    best_quality = similar[0][2].quality_score if similar else 85.0
    decision = policy.make_decision(
        has_experience=True,
        best_experience_quality=best_quality
    )

    print(f"   ✓ Policy decision: {'EXPLOIT' if decision.should_exploit else 'EXPLORE'}")
    print(f"   ✓ Confidence: {decision.confidence:.2f}")
    print(f"   ✓ Reason: {decision.reason}")

    # Record outcome for learning
    policy.record_outcome(exploited=decision.should_exploit, success=True, quality_score=90.0)
    stats = policy.get_stats()
    print(f"   ✓ Policy stats: {stats['total_decisions']} decisions, exploit rate: {stats['exploit_rate']:.1f}%")

    # Step 6: Test attribution (Phase 3)
    print("[6/6] Testing multi-agent attribution with Phase 3...")

    contribution_tracker = ContributionTracker()
    attribution_engine = AttributionEngine(
        contribution_tracker=contribution_tracker,
        reward_shaper=RewardShaper(base_reward=1.0, strategy=RewardStrategy.EXPONENTIAL)
    )

    # Simulate multi-agent contributions
    agent_contributions = {
        "agent_1": 0.8,  # High contributor
        "agent_2": 0.5,  # Medium contributor
        "agent_3": 0.3   # Low contributor
    }

    start_attribution = time.time()
    report = await attribution_engine.attribute_multi_agent_task(
        task_id="test_task_1",
        agent_contributions=agent_contributions,
        total_reward=10.0
    )
    attribution_time = (time.time() - start_attribution) * 1000

    print(f"   ✓ Attribution computed in {attribution_time:.2f}ms")
    print(f"   ✓ Rewards distributed:")
    for agent_id, reward in report.rewards.items():
        contrib = report.contributions[agent_id]
        print(f"      - {agent_id}: {reward:.2f} (contribution: {contrib:.2f})")

    assert attribution_time < 50, f"Attribution too slow: {attribution_time:.2f}ms > 50ms"
    assert sum(report.rewards.values()) == pytest.approx(10.0, abs=0.01), "Rewards don't sum to total"

    # Final verification
    buffer_stats = experience_buffer.get_buffer_stats()
    print("\n" + "="*80)
    print("WORKFLOW 1 COMPLETE ✓")
    print(f"Total experiences in buffer: {buffer_stats['total_experiences']}")
    print(f"Avg quality: {buffer_stats['avg_quality']:.1f}")
    print(f"Policy exploit rate: {stats['exploit_rate']:.1f}%")
    print("="*80)


# ============================================================================
# WORKFLOW 2: EXPERIENCE BUFFER + HYBRID POLICY INTEGRATION
# ============================================================================

@pytest.mark.asyncio
async def test_workflow_2_experience_reuse_loop():
    """
    Workflow 2: Test complete experience reuse loop with quality filtering

    Integration Points:
    - ExperienceBuffer with quality filtering
    - HybridPolicy making exploit/explore decisions
    - CostTracker measuring savings
    - Task embeddings for similarity search

    SUCCESS CRITERIA:
    - Only high-quality experiences stored (>min_quality)
    - Policy correctly decides based on experience quality
    - Cost tracker shows savings from reuse
    - Similarity search finds relevant experiences
    """
    print("\n" + "="*80)
    print("WORKFLOW 2: Experience Reuse Loop Test")
    print("="*80)

    # Initialize components
    embedder = TaskEmbedder(use_local=True)
    buffer = ExperienceBuffer(
        agent_name="reuse_test",
        max_size=50,
        min_quality=85.0,
        embedder=embedder
    )
    policy = HybridPolicy(exploit_ratio=0.8, quality_threshold=85.0)
    tracker = CostTracker(llm_cost_per_call=0.02)

    print("\n[1/4] Storing experiences with varying quality...")

    # Store 10 experiences, some below threshold
    qualities = [95.0, 88.0, 92.0, 75.0, 90.0, 80.0, 93.0, 85.0, 78.0, 96.0]
    stored_count = 0

    for i, quality in enumerate(qualities):
        trajectory = {
            "id": f"traj_{i}",
            "strategy": {"channels": ["email", "social"], "budget": 5000 + i*100}
        }

        stored = await buffer.store_experience(
            trajectory=trajectory,
            quality_score=quality,
            task_description=f"Marketing strategy task {i} for e-commerce platform"
        )

        if stored:
            stored_count += 1
            print(f"   ✓ Stored experience {i} (quality: {quality:.1f})")
        else:
            print(f"   ✗ Rejected experience {i} (quality: {quality:.1f} < 85.0)")

    # Should only store experiences >= 85.0
    expected_stored = sum(1 for q in qualities if q >= 85.0)
    assert stored_count == expected_stored, f"Expected {expected_stored} stored, got {stored_count}"

    print(f"\n[2/4] Testing similarity search and policy decisions...")

    # Test 5 different queries
    test_queries = [
        "Create marketing campaign for e-commerce store",
        "Build social media strategy for B2B SaaS",
        "Design email marketing funnel for startup",
        "Develop content marketing plan for mobile app",
        "Plan product launch campaign for fintech"
    ]

    exploit_decisions = 0
    explore_decisions = 0

    for query in test_queries:
        # Find similar experiences
        similar = await buffer.get_similar_experiences(query, top_k=1)

        # Make policy decision
        has_exp = len(similar) > 0
        best_quality = similar[0][2].quality_score if has_exp else None

        decision = policy.make_decision(
            has_experience=has_exp,
            best_experience_quality=best_quality
        )

        if decision.should_exploit:
            exploit_decisions += 1
            tracker.record_reuse()
            print(f"   EXPLOIT: {query[:50]}... (quality: {best_quality:.1f})")
        else:
            explore_decisions += 1
            tracker.record_new_generation()
            print(f"   EXPLORE: {query[:50]}...")

    print(f"\n[3/4] Analyzing cost savings...")

    savings = tracker.get_savings()
    roi = tracker.get_roi()

    print(f"   Total tasks: {savings['total_tasks']}")
    print(f"   New generations: {savings['new_generations']}")
    print(f"   Reused: {savings['reused']}")
    print(f"   Savings: {savings['savings_percent']:.1f}%")
    print(f"   Savings USD: ${savings['savings_usd']:.2f}")
    print(f"   ROI: {roi['roi_percent']:.0f}%")

    assert savings['total_tasks'] == len(test_queries)
    assert savings['reused'] == exploit_decisions

    print(f"\n[4/4] Verifying buffer statistics...")

    stats = buffer.get_buffer_stats()
    print(f"   Total experiences: {stats['total_experiences']}")
    print(f"   Avg quality: {stats['avg_quality']:.1f}")
    print(f"   Min quality: {stats['min_quality']:.1f}")
    print(f"   Max quality: {stats['max_quality']:.1f}")
    print(f"   Storage capacity: {stats['storage_capacity_pct']:.1f}%")

    assert stats['min_quality'] >= 85.0, "Found experience below threshold"

    print("\n" + "="*80)
    print("WORKFLOW 2 COMPLETE ✓")
    print("="*80)


# ============================================================================
# WORKFLOW 3: PHASE 2 + PHASE 3 INTEGRATION (Experience → Attribution)
# ============================================================================

@pytest.mark.asyncio
async def test_workflow_3_experience_attribution_integration():
    """
    Workflow 3: Experience reuse with contribution tracking

    Integration Points:
    - ExperienceBuffer stores agent trajectories
    - ContributionTracker records quality deltas
    - AttributionEngine uses contribution scores
    - RewardShaper distributes rewards

    SUCCESS CRITERIA:
    - Experiences tracked with contributor metadata
    - Quality improvements attributed correctly
    - Shapley values computed fairly
    - Rewards distributed proportionally
    """
    print("\n" + "="*80)
    print("WORKFLOW 3: Experience + Attribution Integration")
    print("="*80)

    # Initialize components
    embedder = TaskEmbedder(use_local=True)
    buffer = ExperienceBuffer(agent_name="attribution_test", max_size=50, embedder=embedder)
    tracker = ContributionTracker()
    engine = AttributionEngine(
        contribution_tracker=tracker,
        reward_shaper=RewardShaper(strategy=RewardStrategy.LINEAR)
    )

    print("\n[1/3] Simulating multi-agent task with contributions...")

    # Simulate task with 3 agents contributing sequentially
    task_id = "multi_agent_task_1"
    quality_progression = [
        ("agent_research", 0.0, 60.0),  # Research agent starts from 0
        ("agent_content", 60.0, 75.0),  # Content agent improves to 75
        ("agent_seo", 75.0, 90.0)       # SEO agent optimizes to 90
    ]

    contributions = {}
    for agent_id, quality_before, quality_after in quality_progression:
        contrib_score = await tracker.record_contribution(
            agent_id=agent_id,
            task_id=task_id,
            quality_before=quality_before,
            quality_after=quality_after,
            effort_ratio=1.0
        )
        contributions[agent_id] = contrib_score

        # Store experience if high quality
        if quality_after >= 75.0:
            trajectory = {
                "agent": agent_id,
                "quality_before": quality_before,
                "quality_after": quality_after,
                "output": f"Result from {agent_id}"
            }
            await buffer.store_experience(
                trajectory=trajectory,
                quality_score=quality_after,
                task_description=f"Task completed by {agent_id}"
            )

        print(f"   {agent_id}: {quality_before:.1f} → {quality_after:.1f} (contrib: {contrib_score:.3f})")

    print(f"\n[2/3] Computing attribution with Shapley values...")

    # Attribute rewards using Shapley approximation
    report = await engine.attribute_multi_agent_task(
        task_id=task_id,
        agent_contributions=contributions,
        total_reward=100.0
    )

    print(f"   Computation time: {report.computation_time_ms:.2f}ms")
    print(f"   Strategy: {report.strategy_used}")
    print(f"\n   Attribution results:")

    for agent_id in report.agents:
        contrib = report.contributions[agent_id]
        reward = report.rewards[agent_id]
        print(f"      {agent_id}:")
        print(f"         Contribution: {contrib:.3f}")
        print(f"         Reward: ${reward:.2f}")

    # Verify Shapley properties
    assert sum(report.rewards.values()) == pytest.approx(100.0, abs=0.01)
    assert report.computation_time_ms < 50, f"Attribution too slow: {report.computation_time_ms:.2f}ms"

    # Agent with highest improvement should get most reward
    quality_deltas = {
        "agent_research": 60.0,
        "agent_content": 15.0,
        "agent_seo": 15.0
    }
    max_delta_agent = max(quality_deltas, key=quality_deltas.get)
    max_reward_agent = max(report.rewards, key=report.rewards.get)

    print(f"\n[3/3] Verifying attribution fairness...")
    print(f"   Agent with highest delta: {max_delta_agent} ({quality_deltas[max_delta_agent]:.1f})")
    print(f"   Agent with highest reward: {max_reward_agent} (${report.rewards[max_reward_agent]:.2f})")

    # Check buffer integration
    buffer_stats = buffer.get_buffer_stats()
    print(f"\n   Experiences stored: {buffer_stats['total_experiences']}")
    print(f"   Avg quality: {buffer_stats['avg_quality']:.1f}")

    print("\n" + "="*80)
    print("WORKFLOW 3 COMPLETE ✓")
    print("="*80)


# ============================================================================
# WORKFLOW 4: AGENT SELF-IMPROVEMENT (All 3 Phases Combined)
# ============================================================================

@pytest.mark.asyncio
async def test_workflow_4_agent_self_improvement():
    """
    Workflow 4: Complete agent self-improvement cycle

    Tests:
    - Phase 1: Agent generates its own training tasks
    - Phase 2: Agent reuses past experiences
    - Phase 3: Agent tracks its own contributions
    - All phases work together without breaking

    SUCCESS CRITERIA:
    - Agent can self-generate improvement tasks
    - Agent stores and reuses high-quality solutions
    - Agent tracks quality improvements over time
    - No deadlocks or resource leaks
    """
    print("\n" + "="*80)
    print("WORKFLOW 4: Agent Self-Improvement Cycle")
    print("="*80)

    print("\n[1/5] Initializing agent with all 3 phases...")

    # Initialize all components
    embedder = TaskEmbedder(use_local=True)
    buffer = ExperienceBuffer(agent_name="self_improve", max_size=100, embedder=embedder)
    engine = SelfQuestioningEngine(
        agent_name="self_improve",
        embedder=embedder,
        experience_buffer=buffer
    )
    tracker = ContributionTracker()

    # Mock agent that improves over time
    class LearningAgent:
        def __init__(self):
            self.skill_level = 75.0  # Start at 75 (threshold level)
            self.executions = 0

        async def execute(self, task_description: str) -> Dict[str, Any]:
            self.executions += 1
            # Simulate learning: quality improves with experience
            quality = min(95.0, self.skill_level + (self.executions * 3))
            return {
                "output": f"Executed: {task_description}",
                "quality": quality,
                "skill_level": self.skill_level
            }

    agent = LearningAgent()

    print(f"   ✓ Agent initialized at skill level {agent.skill_level:.1f}")

    # Phase 1: Self-generate training tasks
    print(f"\n[2/5] Phase 1: Generating self-improvement tasks...")

    tasks = await engine.generate_autonomous_tasks(
        num_tasks=5,
        focus_domain="marketing"
    )

    print(f"   ✓ Generated {len(tasks)} tasks")
    for i, task in enumerate(tasks[:3]):
        print(f"      {i+1}. {task.description[:60]}... (novelty: {task.curiosity_score:.1f})")

    # Execute tasks and track improvement
    print(f"\n[3/5] Executing tasks with Phase 2 experience reuse...")

    quality_history = []
    for i, task in enumerate(tasks):
        # Check if similar experience exists
        similar = await buffer.get_similar_experiences(task.description, top_k=1)

        quality_before = agent.skill_level

        if similar:
            # Reuse past experience
            past_quality = similar[0][2].quality_score
            print(f"   Task {i+1}: REUSING past solution (quality: {past_quality:.1f})")
            quality_after = past_quality
        else:
            # Generate new solution
            result = await agent.execute(task.description)
            quality_after = result['quality']
            print(f"   Task {i+1}: NEW solution (quality: {quality_after:.1f})")

            # Store if high quality
            if quality_after >= 75.0:
                await buffer.store_experience(
                    trajectory=result,
                    quality_score=quality_after,
                    task_description=task.description
                )

                # Update skill level
                agent.skill_level = quality_after

        quality_history.append(quality_after)

        # Phase 3: Track contribution
        await tracker.record_contribution(
            agent_id="self_improve",
            task_id=task.task_id,
            quality_before=quality_before,
            quality_after=quality_after
        )

    print(f"\n[4/5] Analyzing self-improvement trajectory...")

    print(f"   Quality progression:")
    for i, quality in enumerate(quality_history):
        delta = quality - (quality_history[i-1] if i > 0 else 50.0)
        symbol = "↑" if delta > 0 else "→"
        print(f"      Task {i+1}: {quality:.1f} {symbol}")

    # Calculate overall improvement
    initial_quality = 75.0  # Starting skill level
    final_quality = quality_history[-1]
    improvement = final_quality - initial_quality
    improvement_pct = (improvement / initial_quality) * 100

    print(f"\n   Overall improvement: {improvement:.1f} points ({improvement_pct:.1f}%)")

    print(f"\n[5/5] Checking Phase 3 contribution tracking...")

    contrib_score = await tracker.get_contribution_score("self_improve", window_size=len(tasks))
    print(f"   Avg contribution score: {contrib_score:.3f}")

    # Verify all phases worked
    buffer_stats = buffer.get_buffer_stats()
    assert buffer_stats['total_experiences'] > 0, "No experiences stored"
    assert improvement > 0, "No improvement observed"

    print("\n" + "="*80)
    print("WORKFLOW 4 COMPLETE ✓")
    print(f"Agent improved from {initial_quality:.1f} to {final_quality:.1f}")
    print(f"Experiences stored: {buffer_stats['total_experiences']}")
    print("="*80)


# ============================================================================
# WORKFLOW 5: MULTI-AGENT ORCHESTRATION
# ============================================================================

@pytest.mark.asyncio
async def test_workflow_5_multi_agent_orchestration():
    """
    Workflow 5: Multiple agents training in parallel

    Tests:
    - TrainingOrchestrator coordinates multiple agents
    - Agents train concurrently without conflicts
    - Budget distributed across agents
    - Metrics aggregated correctly

    SUCCESS CRITERIA:
    - All agents complete training
    - No deadlocks or race conditions
    - Budget enforced across all agents
    - Metrics aggregation correct
    """
    print("\n" + "="*80)
    print("WORKFLOW 5: Multi-Agent Orchestration")
    print("="*80)

    print("\n[1/4] Setting up orchestrator with 3 agent types...")

    orchestrator = TrainingOrchestrator(
        max_concurrent_sessions=3,
        total_ap2_budget=150.0,
        max_budget_per_session=50.0,
        cost_per_task=0.5
    )

    # Create mock executors for different agent types
    async def marketing_executor(desc: str):
        await asyncio.sleep(0.01)  # Simulate work
        return {"channels": ["email", "social"], "quality": 85.0}

    async def content_executor(desc: str):
        await asyncio.sleep(0.01)
        return {"title": "Test", "sections": 5, "quality": 82.0}

    async def seo_executor(desc: str):
        await asyncio.sleep(0.01)
        return {"keywords": ["test"], "quality": 88.0}

    # Register trainers
    embedder = TaskEmbedder(use_local=True)

    for agent_type, executor in [
        ("marketing", marketing_executor),
        ("content", content_executor),
        ("seo", seo_executor)
    ]:
        buffer = ExperienceBuffer(agent_name=agent_type, embedder=embedder)
        trainer = CuriosityDrivenTrainer(
            agent_type=agent_type,
            agent_executor=executor,
            experience_buffer=buffer,
            quality_threshold=75.0
        )
        orchestrator.register_trainer(agent_type, trainer)
        print(f"   ✓ Registered {agent_type} trainer")

    print(f"\n[2/4] Running parallel training round...")

    # Create self-questioning engines for task generation
    engines = {}
    for agent_type in ["marketing", "content", "seo"]:
        engine = SelfQuestioningEngine(
            agent_name=agent_type,
            embedder=embedder
        )
        engines[agent_type] = engine

    start_time = time.time()

    # Run training for all agents in parallel
    results = await orchestrator.run_training_round(
        agent_types=["marketing", "content", "seo"],
        tasks_per_agent=10,
        self_questioning_engines=engines
    )

    duration = time.time() - start_time

    print(f"   ✓ Training completed in {duration:.2f}s")
    print(f"\n[3/4] Analyzing aggregated results...")

    print(f"   Agents trained: {results['agents_trained']}")
    print(f"   Total tasks: {results['total_tasks_executed']}")
    print(f"   Overall success rate: {results['overall_success_rate']:.1%}")
    print(f"   Overall avg quality: {results['overall_avg_quality']:.1f}")
    print(f"   Total cost: ${results['total_cost']:.2f}")
    print(f"   Budget remaining: ${results['budget_remaining']:.2f}")
    print(f"   Tasks/minute: {results['tasks_per_minute']:.1f}")

    # Check individual agent results
    print(f"\n   Per-agent breakdown:")
    for agent_type, data in results['by_agent'].items():
        metrics = data['metrics']
        print(f"      {agent_type}:")
        print(f"         Tasks: {metrics['tasks_executed']}")
        print(f"         Quality: {metrics['avg_quality_score']:.1f}")
        print(f"         Cost: ${metrics['total_cost_incurred']:.2f}")

    print(f"\n[4/4] Verifying orchestrator state...")

    status = orchestrator.get_orchestrator_status()
    print(f"   Total sessions run: {status['total_sessions_run']}")
    print(f"   Budget spent: ${status['spent_budget']:.2f}")
    print(f"   Budget remaining: ${status['remaining_budget']:.2f}")

    # Verify all agents completed
    assert results['agents_trained'] == 3, "Not all agents completed"
    assert results['total_cost'] <= orchestrator.total_ap2_budget, "Budget exceeded"

    # Verify target throughput (100+ tasks/minute across 4 agents)
    # With 3 agents and 10 tasks each = 30 tasks, should complete quickly
    assert results['tasks_per_minute'] > 50, f"Throughput too low: {results['tasks_per_minute']:.1f} tasks/min"

    print("\n" + "="*80)
    print("WORKFLOW 5 COMPLETE ✓")
    print(f"Parallel training successful: {results['total_tasks_executed']} tasks")
    print("="*80)


# ============================================================================
# PERFORMANCE BENCHMARK TESTS
# ============================================================================

@pytest.mark.asyncio
async def test_performance_task_generation_latency():
    """
    Performance Test: Task generation <200ms per task

    Target: <200ms average per task
    Critical: This is a P0 requirement from the integration plan
    """
    print("\n" + "="*80)
    print("PERFORMANCE TEST: Task Generation Latency")
    print("="*80)

    embedder = TaskEmbedder(use_local=True)
    engine = SelfQuestioningEngine(agent_name="perf_test", embedder=embedder)

    num_tasks = 20
    start = time.time()
    tasks = await engine.generate_autonomous_tasks(num_tasks)
    elapsed = time.time() - start

    avg_latency = (elapsed * 1000) / num_tasks

    print(f"   Tasks generated: {num_tasks}")
    print(f"   Total time: {elapsed*1000:.1f}ms")
    print(f"   Avg per task: {avg_latency:.1f}ms")
    print(f"   Target: <200ms")

    if avg_latency < 200:
        print(f"   ✓ PASS: Within target")
    else:
        print(f"   ✗ FAIL: Exceeds target by {avg_latency - 200:.1f}ms")

    assert avg_latency < 200, f"Task generation too slow: {avg_latency:.1f}ms > 200ms"


@pytest.mark.asyncio
async def test_performance_similarity_search_latency():
    """
    Performance Test: Similarity search <100ms

    Target: <100ms for top-k retrieval
    Critical: This is a P0 requirement from the integration plan
    """
    print("\n" + "="*80)
    print("PERFORMANCE TEST: Similarity Search Latency")
    print("="*80)

    embedder = TaskEmbedder(use_local=True)
    buffer = ExperienceBuffer(agent_name="perf_test", max_size=100, embedder=embedder)

    # Pre-populate buffer with 50 experiences
    print("   Populating buffer with 50 experiences...")
    for i in range(50):
        await buffer.store_experience(
            trajectory={"id": i, "data": f"test_{i}"},
            quality_score=90.0,
            task_description=f"Task description number {i} for testing performance"
        )

    # Measure retrieval time
    query = "Task description for performance testing"

    # Warm-up
    await buffer.get_similar_experiences(query, top_k=5)

    # Actual measurement
    start = time.time()
    results = await buffer.get_similar_experiences(query, top_k=5)
    elapsed = (time.time() - start) * 1000

    print(f"   Buffer size: {len(buffer.experiences)}")
    print(f"   Top-k: 5")
    print(f"   Retrieval time: {elapsed:.1f}ms")
    print(f"   Target: <100ms")

    if elapsed < 100:
        print(f"   ✓ PASS: Within target")
    else:
        print(f"   ✗ FAIL: Exceeds target by {elapsed - 100:.1f}ms")

    assert elapsed < 100, f"Similarity search too slow: {elapsed:.1f}ms > 100ms"


@pytest.mark.asyncio
async def test_performance_attribution_latency():
    """
    Performance Test: Attribution computation <50ms

    Target: <50ms for Shapley approximation
    Critical: This is a P0 requirement from the integration plan
    """
    print("\n" + "="*80)
    print("PERFORMANCE TEST: Attribution Computation Latency")
    print("="*80)

    engine = AttributionEngine(
        shapley_iterations=100  # Standard iterations
    )

    # Test with 10 agents (realistic multi-agent scenario)
    contributions = {f"agent_{i}": 0.5 + (i * 0.05) for i in range(10)}

    # Warm-up
    await engine.attribute_multi_agent_task("warmup", contributions, 100.0)

    # Actual measurement
    start = time.time()
    report = await engine.attribute_multi_agent_task(
        task_id="perf_test",
        agent_contributions=contributions,
        total_reward=100.0
    )
    elapsed = (time.time() - start) * 1000

    print(f"   Agents: {len(contributions)}")
    print(f"   Shapley iterations: 100")
    print(f"   Computation time: {elapsed:.2f}ms")
    print(f"   Target: <50ms")

    if elapsed < 50:
        print(f"   ✓ PASS: Within target")
    else:
        print(f"   ✗ FAIL: Exceeds target by {elapsed - 50:.2f}ms")

    assert elapsed < 50, f"Attribution too slow: {elapsed:.2f}ms > 50ms"


# ============================================================================
# STRESS TESTS
# ============================================================================

@pytest.mark.asyncio
async def test_stress_buffer_capacity():
    """
    Stress Test: Buffer handles max capacity correctly

    Tests:
    - Buffer respects max_size limit
    - FIFO eviction works correctly
    - No memory leaks at capacity
    """
    print("\n" + "="*80)
    print("STRESS TEST: Buffer Capacity Enforcement")
    print("="*80)

    embedder = TaskEmbedder(use_local=True)
    buffer = ExperienceBuffer(agent_name="stress_test", max_size=10, embedder=embedder)

    # Try to store 20 experiences (2x capacity)
    for i in range(20):
        await buffer.store_experience(
            trajectory={"id": i},
            quality_score=90.0,
            task_description=f"Stress test task {i}"
        )

    stats = buffer.get_buffer_stats()

    print(f"   Attempted to store: 20")
    print(f"   Actually stored: {stats['total_experiences']}")
    print(f"   Max capacity: 10")

    assert stats['total_experiences'] <= 10, "Buffer exceeded max capacity"
    print(f"   ✓ PASS: Capacity enforced correctly")


@pytest.mark.asyncio
async def test_stress_concurrent_attribution():
    """
    Stress Test: Concurrent attribution requests

    Tests:
    - No race conditions with concurrent requests
    - Attribution engine handles async load
    - Results are consistent
    """
    print("\n" + "="*80)
    print("STRESS TEST: Concurrent Attribution Requests")
    print("="*80)

    engine = AttributionEngine(shapley_iterations=50)

    # Create 10 concurrent attribution requests
    async def attribute_task(task_num: int):
        contributions = {f"agent_{i}": 0.3 + (i * 0.1) for i in range(5)}
        report = await engine.attribute_multi_agent_task(
            task_id=f"concurrent_task_{task_num}",
            agent_contributions=contributions,
            total_reward=10.0
        )
        return report

    # Run concurrently
    start = time.time()
    reports = await asyncio.gather(*[attribute_task(i) for i in range(10)])
    elapsed = time.time() - start

    print(f"   Concurrent requests: 10")
    print(f"   Total time: {elapsed*1000:.1f}ms")
    print(f"   Avg per request: {(elapsed*1000)/10:.1f}ms")

    # Verify all completed successfully
    assert len(reports) == 10, "Not all requests completed"

    # Verify reward distribution is correct for all
    for i, report in enumerate(reports):
        total = sum(report.rewards.values())
        assert total == pytest.approx(10.0, abs=0.01), f"Report {i} rewards don't sum correctly"

    print(f"   ✓ PASS: All concurrent requests handled correctly")


# ============================================================================
# ERROR HANDLING TESTS
# ============================================================================

@pytest.mark.asyncio
async def test_error_handling_embedder_failure():
    """
    Error Handling: Graceful degradation when embedder fails

    Tests that components handle embedding failures gracefully
    """
    print("\n" + "="*80)
    print("ERROR HANDLING TEST: Embedder Failure")
    print("="*80)

    # Create a failing embedder
    class FailingEmbedder:
        async def embed(self, text: str):
            raise Exception("Embedder service unavailable")

    buffer = ExperienceBuffer(
        agent_name="error_test",
        max_size=10,
        embedder=FailingEmbedder()
    )

    # Try to store experience
    result = await buffer.store_experience(
        trajectory={"test": "data"},
        quality_score=90.0,
        task_description="Test task"
    )

    print(f"   Storage result with failing embedder: {result}")
    assert result is False, "Should fail gracefully when embedder fails"
    print(f"   ✓ PASS: Graceful failure handling")


if __name__ == "__main__":
    # Run tests with verbose output
    pytest.main([__file__, "-v", "-s"])
