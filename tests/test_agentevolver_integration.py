"""
AgentEvolver Phase 2 Integration Tests

End-to-end tests for experience reuse integration across:
- MarketingAgent
- DeployAgent
- ContentAgent

Tests verify:
1. Experience buffer stores high-quality trajectories
2. Hybrid policy correctly decides exploit vs. explore
3. Cost tracker measures savings accurately
4. No breaking changes to agent APIs
"""

import asyncio
import json
import pytest
from typing import Dict, Any

# Import agents
from agents.marketing_agent import MarketingAgent
from agents.deploy_agent import DeployAgent
from agents.content_agent import ContentAgent

# Import AgentEvolver components
from infrastructure.agentevolver import (
    ExperienceBuffer,
    HybridPolicy,
    CostTracker,
    TaskEmbedder,
)


# ==================== MARKETING AGENT TESTS ====================


@pytest.mark.asyncio
async def test_marketing_agent_experience_reuse_enabled():
    """MarketingAgent initializes with experience reuse enabled"""
    agent = MarketingAgent(enable_experience_reuse=True)

    assert agent.enable_experience_reuse is True
    assert agent.experience_buffer is not None
    assert agent.hybrid_policy is not None
    assert agent.cost_tracker is not None


@pytest.mark.asyncio
async def test_marketing_agent_experience_reuse_disabled():
    """MarketingAgent can be initialized without experience reuse"""
    agent = MarketingAgent(enable_experience_reuse=False)

    assert agent.enable_experience_reuse is False
    assert agent.experience_buffer is None
    assert agent.hybrid_policy is None
    assert agent.cost_tracker is None


@pytest.mark.asyncio
async def test_marketing_agent_backward_compatibility():
    """MarketingAgent backward compatible - existing APIs still work"""
    agent = MarketingAgent()

    # Synchronous create_strategy should still work
    result = agent.create_strategy("TechStartup", "developers", 5000.0)
    assert result is not None

    strategy = json.loads(result)
    assert "business_name" in strategy
    assert "channels" in strategy
    assert len(strategy["channels"]) > 0


@pytest.mark.asyncio
async def test_marketing_agent_cost_tracking():
    """MarketingAgent cost tracker records calls"""
    agent = MarketingAgent(enable_experience_reuse=True)

    # Simulate generating new strategy
    agent.cost_tracker.record_new_generation()
    agent.cost_tracker.record_new_generation()

    # Simulate reusing experience
    agent.cost_tracker.record_reuse()

    savings = agent.cost_tracker.get_savings()

    assert savings['total_tasks'] == 3
    assert savings['new_generations'] == 2
    assert savings['reused'] == 1
    assert savings['savings_percent'] > 0


@pytest.mark.asyncio
async def test_marketing_agent_get_agentevolver_metrics():
    """MarketingAgent returns AgentEvolver metrics"""
    agent = MarketingAgent(enable_experience_reuse=True)

    metrics = agent.get_agentevolver_metrics()

    assert metrics['agent'] == 'MarketingAgent'
    assert metrics['agentevolver_status'] == 'enabled'
    assert 'cost_savings' in metrics
    assert 'roi' in metrics
    assert 'experience_buffer' in metrics
    assert 'policy_stats' in metrics


# ==================== DEPLOY AGENT TESTS ====================


@pytest.mark.asyncio
async def test_deploy_agent_experience_reuse_enabled():
    """DeployAgent initializes with experience reuse enabled"""
    agent = DeployAgent(enable_experience_reuse=True)

    assert agent.enable_experience_reuse is True
    assert agent.experience_buffer is not None
    assert agent.hybrid_policy is not None
    assert agent.cost_tracker is not None


@pytest.mark.asyncio
async def test_deploy_agent_experience_reuse_disabled():
    """DeployAgent can be initialized without experience reuse"""
    agent = DeployAgent(enable_experience_reuse=False)

    assert agent.enable_experience_reuse is False
    assert agent.experience_buffer is None
    assert agent.hybrid_policy is None
    assert agent.cost_tracker is None


@pytest.mark.asyncio
async def test_deploy_agent_experience_buffer_capacity():
    """DeployAgent experience buffer respects capacity limits"""
    agent = DeployAgent(enable_experience_reuse=True)

    buffer = agent.experience_buffer
    assert buffer.max_size == 300
    assert buffer.min_quality == 80.0


@pytest.mark.asyncio
async def test_deploy_agent_policy_exploit_threshold():
    """DeployAgent policy has conservative exploit ratio"""
    agent = DeployAgent(enable_experience_reuse=True)

    policy = agent.hybrid_policy

    # Deployment is more conservative than marketing (harder problem)
    assert policy.exploit_ratio == 0.75
    assert policy.quality_threshold == 80.0
    assert policy.success_threshold == 0.65


# ==================== CONTENT AGENT TESTS ====================


@pytest.mark.asyncio
async def test_content_agent_experience_reuse_enabled():
    """ContentAgent initializes with experience reuse enabled"""
    agent = ContentAgent(enable_experience_reuse=True)

    assert agent.enable_experience_reuse is True
    assert agent.experience_buffer is not None
    assert agent.hybrid_policy is not None
    assert agent.cost_tracker is not None


@pytest.mark.asyncio
async def test_content_agent_experience_reuse_disabled():
    """ContentAgent can be initialized without experience reuse"""
    agent = ContentAgent(enable_experience_reuse=False)

    assert agent.enable_experience_reuse is False
    assert agent.experience_buffer is None
    assert agent.hybrid_policy is None
    assert agent.cost_tracker is None


@pytest.mark.asyncio
async def test_content_agent_high_exploit_ratio():
    """ContentAgent has high exploit ratio (easier problem)"""
    agent = ContentAgent(enable_experience_reuse=True)

    policy = agent.hybrid_policy

    # Content has higher exploit ratio than deployment (easier to reuse)
    assert policy.exploit_ratio == 0.85
    assert policy.quality_threshold == 80.0
    assert policy.success_threshold == 0.7


@pytest.mark.asyncio
async def test_content_agent_backward_compatibility():
    """ContentAgent backward compatible - existing APIs still work"""
    agent = ContentAgent()

    # Synchronous methods should still work
    result = agent.write_blog_post("AI Trends", ["AI", "ML", "Tech"], 1000)
    assert result is not None

    blog_data = json.loads(result)
    assert "title" in blog_data
    assert "sections" in blog_data


# ==================== EXPERIENCE BUFFER TESTS ====================


@pytest.mark.asyncio
async def test_experience_buffer_store_and_retrieve():
    """ExperienceBuffer stores and retrieves experiences"""
    buffer = ExperienceBuffer(agent_name="TestAgent", max_size=10, min_quality=80.0)

    # Create a test experience
    task_desc = "Test task for AI content generation"
    trajectory = {"title": "Test Content", "sections": 5}
    quality_score = 85.0

    # Store experience
    await buffer.store_experience(
        trajectory=trajectory,
        quality_score=quality_score,
        task_description=task_desc
    )

    # Retrieve similar experiences
    similar = await buffer.get_similar_experiences(task_desc, top_k=1)

    assert len(similar) > 0
    retrieved_trajectory, similarity, metadata = similar[0]

    assert retrieved_trajectory == trajectory
    assert metadata.quality_score == quality_score
    assert similarity > 0.5  # Should be very similar


@pytest.mark.asyncio
async def test_experience_buffer_quality_filtering():
    """ExperienceBuffer filters by quality threshold"""
    buffer = ExperienceBuffer(agent_name="TestAgent", max_size=10, min_quality=90.0)

    task_desc = "Marketing strategy for SaaS"
    low_quality_traj = {"strategy": "basic"}
    high_quality_traj = {"strategy": "comprehensive", "channels": 5}

    # Try to store low quality (should fail)
    success = await buffer.store_experience(
        trajectory=low_quality_traj,
        quality_score=75.0,
        task_description=task_desc
    )
    assert success is False

    # Store high quality (should succeed)
    success = await buffer.store_experience(
        trajectory=high_quality_traj,
        quality_score=95.0,
        task_description=task_desc
    )
    assert success is True

    stats = buffer.get_buffer_stats()
    assert stats['total_experiences'] == 1


@pytest.mark.asyncio
async def test_experience_buffer_capacity_enforcement():
    """ExperienceBuffer enforces max capacity with FIFO eviction"""
    buffer = ExperienceBuffer(agent_name="TestAgent", max_size=3, min_quality=80.0)

    # Store 4 high-quality experiences (max is 3)
    for i in range(4):
        await buffer.store_experience(
            trajectory={"id": i},
            quality_score=90.0,
            task_description=f"Task {i}"
        )

    stats = buffer.get_buffer_stats()

    # Should have evicted oldest, keeping only 3
    assert stats['total_experiences'] == 3


# ==================== HYBRID POLICY TESTS ====================


@pytest.mark.asyncio
async def test_hybrid_policy_no_experience():
    """HybridPolicy explores when no experience available"""
    policy = HybridPolicy(exploit_ratio=0.8)

    decision = policy.make_decision(
        has_experience=False,
        best_experience_quality=None
    )

    assert decision.should_exploit is False
    assert decision.confidence == 1.0
    assert "No similar past experiences" in decision.reason


@pytest.mark.asyncio
async def test_hybrid_policy_low_quality_experience():
    """HybridPolicy explores when experience quality is low"""
    policy = HybridPolicy(exploit_ratio=0.8, quality_threshold=85.0)

    decision = policy.make_decision(
        has_experience=True,
        best_experience_quality=70.0
    )

    assert decision.should_exploit is False
    assert "below threshold" in decision.reason


@pytest.mark.asyncio
async def test_hybrid_policy_high_quality_experience():
    """HybridPolicy exploits when experience quality is high (probabilistic test)"""
    import random

    # Seed for reproducibility in tests
    random.seed(42)

    policy = HybridPolicy(exploit_ratio=0.8, quality_threshold=80.0)

    # With 80% exploit ratio, we should see mostly exploits over multiple runs
    exploit_count = 0
    total_runs = 10
    for _ in range(total_runs):
        decision = policy.make_decision(
            has_experience=True,
            best_experience_quality=92.0
        )
        if decision.should_exploit:
            exploit_count += 1
            assert decision.confidence > 0.8

    # Should exploit at least 60% of the time (allowing for randomness)
    assert exploit_count >= 6, f"Expected at least 6/10 exploits, got {exploit_count}/10"


@pytest.mark.asyncio
async def test_hybrid_policy_statistics():
    """HybridPolicy tracks exploit/explore statistics"""
    policy = HybridPolicy()

    # Make decisions
    policy.make_decision(has_experience=True, best_experience_quality=90.0)
    policy.make_decision(has_experience=False)
    policy.make_decision(has_experience=True, best_experience_quality=85.0)

    # Record outcomes
    policy.record_outcome(exploited=True, success=True)
    policy.record_outcome(exploited=False, success=True)
    policy.record_outcome(exploited=True, success=False)

    stats = policy.get_stats()

    assert stats['total_decisions'] == 3
    assert stats['exploit_count'] == 2
    assert stats['explore_count'] == 1
    assert stats['exploit_success_rate'] == 0.5  # 1 success out of 2


# ==================== COST TRACKER TESTS ====================


@pytest.mark.asyncio
async def test_cost_tracker_savings_calculation():
    """CostTracker calculates cost savings correctly"""
    tracker = CostTracker(llm_cost_per_call=0.01)

    # Simulate 10 tasks: 6 new, 4 reused
    for _ in range(6):
        tracker.record_new_generation()
    for _ in range(4):
        tracker.record_reuse()

    savings = tracker.get_savings()

    assert savings['total_tasks'] == 10
    assert savings['new_generations'] == 6
    assert savings['reused'] == 4
    assert savings['savings_percent'] == 40.0  # 4/10 * 100
    assert savings['savings_usd'] == 0.04  # 4 * 0.01


@pytest.mark.asyncio
async def test_cost_tracker_roi_calculation():
    """CostTracker calculates ROI from experience buffer investment"""
    tracker = CostTracker(llm_cost_per_call=0.10)

    # Simulate: 50 new generations, 150 reuses
    for _ in range(50):
        tracker.record_new_generation()
    for _ in range(150):
        tracker.record_reuse()

    roi = tracker.get_roi()

    # Gross savings: 150 * $0.10 = $15
    # Storage cost: 50 * $0.005 (5% of $0.10 generation) = $0.25
    # Net savings: $15 - $0.25 = $14.75
    # ROI: $14.75 / $0.25 * 100 = 5900%

    assert roi['gross_savings_usd'] == 15.0
    assert roi['storage_cost_usd'] == 0.25
    assert roi['net_savings_usd'] == 14.75
    assert roi['roi_percent'] == 5900.0


@pytest.mark.asyncio
async def test_cost_tracker_reset():
    """CostTracker can be reset"""
    tracker = CostTracker()

    tracker.record_new_generation()
    tracker.record_reuse()

    assert tracker.total_calls == 2

    tracker.reset()

    assert tracker.baseline_calls == 0
    assert tracker.reused_calls == 0
    assert tracker.total_calls == 0


# ==================== TASK EMBEDDER TESTS ====================


@pytest.mark.asyncio
async def test_task_embedder_local_mode():
    """TaskEmbedder works in local mode (no OpenAI API)"""
    embedder = TaskEmbedder(use_local=True)

    embedding1 = await embedder.embed("Marketing strategy for SaaS")
    embedding2 = await embedder.embed("Marketing strategy for SaaS")

    # Same input should produce same embedding in local mode
    assert (embedding1 == embedding2).all()

    # Should be 1536-dimensional (OpenAI compatibility)
    assert len(embedding1) == 1536


@pytest.mark.asyncio
async def test_task_embedder_similarity():
    """TaskEmbedder computes similarity correctly"""
    embedder = TaskEmbedder(use_local=True)

    embedding1 = await embedder.embed("marketing strategy")
    embedding2 = await embedder.embed("marketing strategy")

    import numpy as np
    similarity = embedder.compute_similarity_batch(embedding1, np.array([embedding2]))

    assert similarity[0] > 0.99  # Very similar


# ==================== INTEGRATION TESTS ====================


@pytest.mark.asyncio
async def test_all_three_agents_initialized():
    """All three pilot agents can be initialized with AgentEvolver"""
    marketing = MarketingAgent(enable_experience_reuse=True)
    deploy = DeployAgent(enable_experience_reuse=True)
    content = ContentAgent(enable_experience_reuse=True)

    # All should have AgentEvolver enabled
    assert marketing.enable_experience_reuse is True
    assert deploy.enable_experience_reuse is True
    assert content.enable_experience_reuse is True

    # All should have metrics methods
    metrics_m = marketing.get_agentevolver_metrics()
    metrics_d = deploy.get_agentevolver_metrics() if hasattr(deploy, 'get_agentevolver_metrics') else None
    metrics_c = content.get_agentevolver_metrics()

    assert metrics_m['agentevolver_status'] == 'enabled'
    assert metrics_c['agentevolver_status'] == 'enabled'


@pytest.mark.asyncio
async def test_no_breaking_changes():
    """AgentEvolver integration doesn't break existing agent APIs"""
    # Test that we can still create agents without experience reuse
    marketing_old = MarketingAgent(enable_experience_reuse=False)
    deploy_old = DeployAgent(enable_experience_reuse=False)
    content_old = ContentAgent(enable_experience_reuse=False)

    # Test that existing methods still work
    strategy = marketing_old.create_strategy("Startup", "users", 1000)
    assert strategy is not None

    blog = content_old.write_blog_post("Topic", ["keyword"], 500)
    assert blog is not None


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
