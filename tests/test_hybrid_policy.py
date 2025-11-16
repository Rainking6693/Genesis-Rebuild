"""
Test suite for AgentEvolver Hybrid Policy Phase 2.

Tests cover:
- Exploit/explore decision making
- Quality feedback integration
- Experience transfer across agents
- Agent mixin integration
"""

import pytest
import asyncio
from typing import Optional

from infrastructure.agentevolver.hybrid_policy import (
    HybridPolicy,
    PolicyDecision
)
from infrastructure.agentevolver.experience_transfer import (
    ExperienceTransfer,
    ExperienceType,
    Experience,
    ExperienceBuffer
)
from infrastructure.agentevolver.agent_mixin import (
    ExperienceReuseMixin,
    ExperienceReuseMixinAsync
)


class TestHybridPolicyBasic:
    """Test basic hybrid policy functionality"""

    def test_policy_initialization(self):
        """Test policy initializes with correct parameters"""
        policy = HybridPolicy(exploit_ratio=0.8)
        assert policy.exploit_ratio == 0.8
        assert policy.quality_threshold == 80.0
        assert policy.success_threshold == 0.7

    def test_policy_forces_explore_when_no_experience(self):
        """When no experience available, must always explore"""
        policy = HybridPolicy(exploit_ratio=0.95)

        decision = policy.make_decision(has_experience=False)
        assert not decision.should_exploit, "Must explore when no experience"
        assert "No similar past experiences" in decision.reason

    def test_policy_exploits_with_good_quality(self):
        """With good quality experience, policy should exploit (probabilistically)"""
        policy = HybridPolicy(exploit_ratio=0.8, quality_threshold=80.0)

        # With 80% ratio, should exploit at least once in 20 tries
        exploited = False
        for _ in range(20):
            decision = policy.make_decision(
                has_experience=True,
                best_experience_quality=90.0
            )
            if decision.should_exploit:
                exploited = True
                break

        assert exploited, "Should exploit at least once with good quality (80% ratio, 20 tries)"

    def test_policy_explores_with_low_quality(self):
        """With low quality experience, policy should explore"""
        policy = HybridPolicy(exploit_ratio=0.8, quality_threshold=80.0)

        decision = policy.make_decision(
            has_experience=True,
            best_experience_quality=60.0
        )
        assert not decision.should_exploit, "Should explore with low quality"

    def test_policy_explores_with_low_success_rate(self):
        """With low recent success rate, policy should explore"""
        policy = HybridPolicy(
            exploit_ratio=0.8,
            quality_threshold=80.0,
            success_threshold=0.7
        )

        decision = policy.make_decision(
            has_experience=True,
            best_experience_quality=90.0,
            recent_exploit_success_rate=0.5
        )
        assert not decision.should_exploit, "Should explore with low success rate"

    def test_policy_decision_has_reasoning(self):
        """Test that policy decisions include clear reasoning"""
        policy = HybridPolicy()

        # No experience
        decision = policy.make_decision(has_experience=False)
        assert len(decision.reason) > 0
        assert "No similar past experiences" in decision.reason

        # With experience
        decision = policy.make_decision(
            has_experience=True,
            best_experience_quality=90.0
        )
        assert len(decision.reason) > 0

    def test_policy_confidence_scores(self):
        """Test that confidence scores are set correctly"""
        policy = HybridPolicy()

        # High confidence for forced explore
        decision = policy.make_decision(has_experience=False)
        assert decision.confidence == 1.0

        # Lower confidence for quality-based decisions
        decision = policy.make_decision(
            has_experience=True,
            best_experience_quality=90.0
        )
        assert decision.confidence > 0


class TestHybridPolicyOutcomeTracking:
    """Test outcome recording and statistics"""

    def test_record_outcome_exploit_success(self):
        """Test recording successful exploitation"""
        policy = HybridPolicy()
        initial_exploit_successes = policy.exploit_successes

        policy.record_outcome(exploited=True, success=True)

        assert policy.exploit_successes > initial_exploit_successes

    def test_record_outcome_explore_success(self):
        """Test recording successful exploration"""
        policy = HybridPolicy()
        initial_explore_successes = policy.explore_successes

        policy.record_outcome(exploited=False, success=True)

        assert policy.explore_successes > initial_explore_successes

    def test_record_outcome_exploit_failure(self):
        """Test recording failed exploitation"""
        policy = HybridPolicy()

        initial = policy.exploit_successes
        policy.record_outcome(exploited=True, success=False)
        policy.record_outcome(exploited=True, success=True)

        # Verify that successes increased by 1
        assert policy.exploit_successes == initial + 1

    def test_stats_comprehensive(self):
        """Test comprehensive statistics"""
        policy = HybridPolicy()

        # Make decisions and record outcomes
        for i in range(20):
            decision = policy.make_decision(
                has_experience=True,
                best_experience_quality=85.0
            )
            success = (i % 2) == 0
            policy.record_outcome(decision.should_exploit, success)

        stats = policy.get_stats()
        assert "total_decisions" in stats
        assert "exploit_count" in stats
        assert "explore_count" in stats
        assert "exploit_success_rate" in stats
        assert "explore_success_rate" in stats
        assert stats["total_decisions"] > 0

    def test_get_statistics_values(self):
        """Test specific statistic values"""
        policy = HybridPolicy()

        policy.record_outcome(exploited=True, success=True)
        policy.record_outcome(exploited=True, success=True)
        policy.record_outcome(exploited=False, success=False)

        stats = policy.get_stats()
        # Verify stats are returned correctly
        assert "total_decisions" in stats
        assert "exploit_success_rate" in stats

    def test_reset_stats(self):
        """Test resetting statistics"""
        policy = HybridPolicy()

        # Record some outcomes
        for i in range(10):
            policy.record_outcome(exploited=i % 2 == 0, success=True)

        stats_before = policy.get_stats()
        # Verify stats were recorded
        assert "total_decisions" in stats_before

        # Reset
        policy.reset_stats()

        stats_after = policy.get_stats()
        # After reset, stats should be zeroed out
        assert stats_after["total_decisions"] == 0


class TestExperienceTransfer:
    """Test cross-agent experience sharing"""

    @pytest.mark.asyncio
    async def test_share_experience_stores_correctly(self):
        """Test that shared experiences are stored"""
        transfer = ExperienceTransfer()

        added = await transfer.share_experience(
            agent_type="code_review",
            task_description="Review Python function",
            approach="Static analysis",
            result="Found 2 bugs",
            success=True
        )

        assert added is True

    @pytest.mark.asyncio
    async def test_share_experience_prevents_duplicates(self):
        """Test that duplicate experiences are not added"""
        transfer = ExperienceTransfer()

        # Add experience
        await transfer.share_experience(
            agent_type="qa",
            task_description="Test login flow",
            approach="Manual testing",
            result="All cases passed",
            success=True
        )

        # Add identical experience
        added_duplicate = await transfer.share_experience(
            agent_type="qa",
            task_description="Test login flow",
            approach="Manual testing",
            result="All cases passed",
            success=True
        )

        assert added_duplicate is False

    @pytest.mark.asyncio
    async def test_get_agent_experiences(self):
        """Test retrieving experiences for an agent type"""
        transfer = ExperienceTransfer()

        # Share multiple experiences
        for i in range(5):
            await transfer.share_experience(
                agent_type="documentation",
                task_description=f"Write docs for feature {i}",
                approach="Template-based",
                result="Generated markdown",
                success=True
            )

        experiences = await transfer.get_agent_experiences("documentation", limit=3)
        assert len(experiences) <= 3

    @pytest.mark.asyncio
    async def test_get_successful_experiences(self):
        """Test filtering for successful experiences"""
        transfer = ExperienceTransfer()

        # Mix of success and failure
        await transfer.share_experience(
            agent_type="testing", task_description="Test A", approach="Method 1",
            result="OK", success=True
        )
        await transfer.share_experience(
            agent_type="testing", task_description="Test B", approach="Method 2",
            result="Failed", success=False
        )
        await transfer.share_experience(
            agent_type="testing", task_description="Test C", approach="Method 3",
            result="OK", success=True
        )

        successes = await transfer.get_successful_experiences("testing")
        assert len(successes) >= 2

    @pytest.mark.asyncio
    async def test_find_similar_experiences(self):
        """Test similarity-based experience retrieval"""
        transfer = ExperienceTransfer()

        # Add similar experiences
        await transfer.share_experience(
            agent_type="analysis",
            task_description="Analyze code quality issues",
            approach="AST parsing", result="Found issues", success=True
        )
        await transfer.share_experience(
            agent_type="analysis",
            task_description="Analyze code performance",
            approach="Profiling", result="Found bottlenecks", success=True
        )

        similar = await transfer.find_similar_experiences(
            "analysis",
            "Analyze code quality",
            min_similarity=0.2
        )

        assert len(similar) > 0

    @pytest.mark.asyncio
    async def test_hub_statistics(self):
        """Test hub-level statistics"""
        transfer = ExperienceTransfer()

        # Add experiences for agent
        for i in range(3):
            await transfer.share_experience(
                agent_type="agent_a",
                task_description=f"Task {i}",
                approach="Method", result="Result", success=True
            )

        stats = await transfer.get_hub_stats()
        assert stats["total_agents"] >= 1
        assert "agent_a" in stats["agents"]

    @pytest.mark.asyncio
    async def test_export_import_experiences(self):
        """Test experience export and import"""
        transfer = ExperienceTransfer()

        # Add experience
        await transfer.share_experience(
            agent_type="worker",
            task_description="Do work",
            approach="Method A",
            result="Completed",
            success=True
        )

        # Export
        exported = await transfer.export_experiences("worker")
        assert len(exported) > 0

        # Create new transfer and import
        transfer2 = ExperienceTransfer()
        imported_count = await transfer2.import_experiences("worker", exported)
        assert imported_count > 0


class TestExperienceBuffer:
    """Test experience buffer functionality"""

    def test_buffer_deduplication(self):
        """Test that buffer prevents duplicate experiences"""
        buffer = ExperienceBuffer("test_agent")

        exp1 = Experience(
            agent_type="test_agent",
            task_description="Task A",
            approach="Method 1",
            result="Result X",
            success=True,
            experience_type=ExperienceType.SUCCESS
        )

        added1 = buffer.add(exp1)
        added2 = buffer.add(exp1)  # Same experience

        assert added1 is True
        assert added2 is False
        assert len(buffer.get_all()) == 1

    def test_buffer_max_size(self):
        """Test that buffer respects max size limit"""
        buffer = ExperienceBuffer("test", max_size=5)

        for i in range(10):
            exp = Experience(
                agent_type="test",
                task_description=f"Task {i}",
                approach=f"Method {i}",
                result=f"Result {i}",
                success=True,
                experience_type=ExperienceType.SUCCESS
            )
            buffer.add(exp)

        assert len(buffer.get_all()) <= 5

    def test_buffer_similarity_search(self):
        """Test similarity-based search"""
        buffer = ExperienceBuffer("search_test")

        for i, task in enumerate(["code review", "code testing"]):
            exp = Experience(
                agent_type="search_test",
                task_description=task,
                approach="Method", result="Result", success=True,
                experience_type=ExperienceType.SUCCESS
            )
            buffer.add(exp)

        similar = buffer.find_similar("code analysis", min_similarity=0.1)
        assert len(similar) > 0

    def test_buffer_get_successes(self):
        """Test getting successful experiences"""
        buffer = ExperienceBuffer("success_test")

        # Add mix of successful and failed experiences
        exp_success = Experience(
            agent_type="success_test",
            task_description="Task 1",
            approach="Method",
            result="Success",
            success=True,
            experience_type=ExperienceType.SUCCESS
        )
        exp_failure = Experience(
            agent_type="success_test",
            task_description="Task 2",
            approach="Method",
            result="Failure",
            success=False,
            experience_type=ExperienceType.FAILURE
        )

        buffer.add(exp_success)
        buffer.add(exp_failure)

        successes = buffer.get_successes()
        assert len(successes) >= 1


class TestAgentMixin:
    """Test agent mixin integration"""

    def test_mixin_initialization(self):
        """Test mixin initializes correctly"""
        class TestAgent(ExperienceReuseMixin):
            def __init__(self):
                super().__init__()
                self.agent_type = "test"

        agent = TestAgent()
        assert agent.hybrid_policy is not None
        assert agent.experience_transfer is None

    def test_mixin_set_experience_transfer(self):
        """Test setting experience transfer"""
        class TestAgent(ExperienceReuseMixin):
            def __init__(self):
                super().__init__()
                self.agent_type = "test"

        agent = TestAgent()
        transfer = ExperienceTransfer()
        agent.set_experience_transfer(transfer)

        assert agent.experience_transfer is transfer

    def test_mixin_get_policy_stats(self):
        """Test policy stats retrieval through mixin"""
        class TestAgent(ExperienceReuseMixin):
            def __init__(self):
                super().__init__()
                self.agent_type = "test"

        agent = TestAgent()
        stats = agent.get_policy_stats()

        assert "total_decisions" in stats
        assert "exploit_count" in stats

    def test_mixin_policy_summary(self):
        """Test policy summary through mixin"""
        class TestAgent(ExperienceReuseMixin):
            def __init__(self):
                super().__init__()
                self.agent_type = "test"

        agent = TestAgent()
        summary = agent.get_policy_summary()

        # Verify summary is a string and contains expected content
        assert isinstance(summary, str)
        assert "HybridPolicy Summary" in summary


class TestExperienceReuseMixinAsync:
    """Test async variant of experience reuse mixin"""

    @pytest.mark.asyncio
    async def test_async_mixin_with_experience_reuse(self):
        """Test with_experience_reuse on async mixin"""
        mixin = ExperienceReuseMixinAsync()
        mixin.agent_type = "test"
        mixin.set_experience_transfer(ExperienceTransfer())

        async def generate_result():
            return "Generated result"

        result, decision = await mixin.with_experience_reuse(
            task_description="Test task",
            generate_fn=generate_result
        )

        assert result == "Generated result"
        assert isinstance(decision, PolicyDecision)

    @pytest.mark.asyncio
    async def test_async_mixin_record_task_outcome(self):
        """Test recording outcomes on async mixin"""
        mixin = ExperienceReuseMixinAsync()
        mixin.agent_type = "test"
        mixin.set_experience_transfer(ExperienceTransfer())

        await mixin.record_task_outcome(
            task_description="Test",
            approach="Method",
            result="Success",
            success=True
        )

        # Should not raise

    @pytest.mark.asyncio
    async def test_async_mixin_learn_from_experience(self):
        """Test learning loop on async mixin"""
        mixin = ExperienceReuseMixinAsync()
        mixin.agent_type = "test"
        mixin.set_experience_transfer(ExperienceTransfer())

        async def generate():
            return "New result"

        result, decision, success = await mixin.learn_from_experience(
            task_description="Learn test",
            generate_fn=generate
        )

        assert result == "New result"
        assert isinstance(decision, PolicyDecision)
        assert isinstance(success, bool)


class TestIntegrationScenarios:
    """Test realistic integration scenarios"""

    @pytest.mark.asyncio
    async def test_agent_learning_loop(self):
        """Test complete agent learning loop"""
        # Setup
        transfer = ExperienceTransfer()

        class SmartAgent(ExperienceReuseMixinAsync):
            async def solve_task(self, task_desc: str):
                return f"Solution for: {task_desc}"

        agent = SmartAgent()
        agent.agent_type = "solver"
        agent.set_experience_transfer(transfer)

        # Run learning loop multiple times
        for i in range(5):
            task = f"Solve problem {i}"

            async def solve():
                return await agent.solve_task(task)

            result, decision = await agent.with_experience_reuse(
                task_description=task,
                generate_fn=solve
            )

            success = "Solution" in str(result)
            await agent.record_policy_outcome(decision.should_exploit, success)

        # Verify learning
        stats = agent.get_policy_stats()
        assert stats["total_decisions"] >= 5

    @pytest.mark.asyncio
    async def test_multi_agent_knowledge_sharing(self):
        """Test multiple agents sharing experiences"""
        transfer = ExperienceTransfer()

        class Agent(ExperienceReuseMixinAsync):
            async def work(self, task: str):
                return f"Result for {task}"

        # Agent 1 does work and shares
        agent1 = Agent()
        agent1.agent_type = "type_a"
        agent1.set_experience_transfer(transfer)

        await agent1.record_task_outcome(
            task_description="Analyze data",
            approach="Statistical analysis",
            result="Found correlation",
            success=True
        )

        # Agent 2 tries similar task and learns from agent 1
        agent2 = Agent()
        agent2.agent_type = "type_a"  # Same type
        agent2.set_experience_transfer(transfer)

        experiences = await agent2.get_successful_experiences(limit=1)
        assert len(experiences) > 0

    @pytest.mark.asyncio
    async def test_policy_with_experience_transfer(self):
        """Test policy decisions with actual experience transfer"""
        transfer = ExperienceTransfer()

        # Register agent and add experiences
        await transfer.share_experience(
            agent_type="analyzer",
            task_description="Analyze code",
            approach="AST parsing",
            result="Identified issues",
            success=True
        )

        # Create agent and get experiences
        mixin = ExperienceReuseMixinAsync()
        mixin.agent_type = "analyzer"
        mixin.set_experience_transfer(transfer)

        experiences = await mixin.get_agent_experiences()
        assert len(experiences) > 0


# Performance and stress tests

class TestPerformance:
    """Performance and stress testing"""

    def test_policy_performance_large_scale(self):
        """Test policy performance with large number of decisions"""
        policy = HybridPolicy()

        # 1000 decisions
        for i in range(1000):
            decision = policy.make_decision(
                has_experience=True,
                best_experience_quality=85.0
            )
            policy.record_outcome(decision.should_exploit, success=(i % 2 == 0))

        assert policy.total_decisions == 1000

    @pytest.mark.asyncio
    async def test_experience_transfer_large_scale(self):
        """Test experience transfer with many experiences"""
        transfer = ExperienceTransfer()

        # Add 100 experiences
        for i in range(100):
            await transfer.share_experience(
                agent_type="bulk_test",
                task_description=f"Task {i}",
                approach=f"Method {i % 5}",
                result=f"Result {i}",
                success=(i % 3 == 0)
            )

        experiences = await transfer.get_agent_experiences("bulk_test")
        assert len(experiences) > 0


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
