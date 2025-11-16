"""
Negative testing and edge case validation for AgentEvolver Phase 2.

Tests cover:
- Empty experience buffer (no experiences available)
- All experiences below quality threshold
- Corrupted experience data
- Agent type mismatch in transfer
- Concurrent access and race conditions
- Buffer overflow handling
"""

import pytest
import asyncio
from datetime import datetime
from infrastructure.agentevolver.hybrid_policy import HybridPolicy
from infrastructure.agentevolver.experience_transfer import (
    ExperienceTransfer,
    ExperienceType,
    Experience,
    ExperienceBuffer
)
from infrastructure.agentevolver.agent_mixin import ExperienceReuseMixinAsync


class TestEmptyExperienceBuffer:
    """Test behavior with empty experience buffers"""

    @pytest.mark.asyncio
    async def test_find_similar_with_empty_buffer(self):
        """Test finding similar experiences in empty buffer"""
        transfer = ExperienceTransfer()
        await transfer.register_agent_type("empty_agent")

        similar = await transfer.find_similar_experiences(
            "empty_agent",
            "Any task description",
            limit=10
        )

        assert similar == []

    @pytest.mark.asyncio
    async def test_get_successes_with_empty_buffer(self):
        """Test getting successes from empty buffer"""
        transfer = ExperienceTransfer()

        successes = await transfer.get_successful_experiences("new_agent")
        assert successes == []

    @pytest.mark.asyncio
    async def test_mixin_with_no_experiences(self):
        """Test mixin behavior when no experiences available"""
        mixin = ExperienceReuseMixinAsync()
        mixin.agent_type = "test"
        mixin.set_experience_transfer(ExperienceTransfer())

        async def generate():
            return "Generated result"

        result, decision = await mixin.with_experience_reuse(
            task_description="Test task",
            generate_fn=generate
        )

        # Should explore and generate new result
        assert result == "Generated result"
        assert not decision.should_exploit
        assert "No similar past experiences" in decision.reason


class TestLowQualityExperiences:
    """Test behavior with low quality experiences"""

    @pytest.mark.asyncio
    async def test_all_experiences_below_threshold(self):
        """Test when all available experiences have low quality"""
        transfer = ExperienceTransfer()

        # Add low-confidence experiences
        for i in range(5):
            await transfer.share_experience(
                agent_type="low_quality",
                task_description=f"Task {i}",
                approach="Method",
                result="Result",
                success=True,
                confidence=0.3  # Low confidence = low quality
            )

        mixin = ExperienceReuseMixinAsync()
        mixin.agent_type = "low_quality"
        mixin.set_experience_transfer(transfer)

        async def generate():
            return "New result"

        result, decision = await mixin.with_experience_reuse(
            task_description="Task 0",
            generate_fn=generate
        )

        # Should explore due to low quality (30% -> 30.0 quality score < 80.0 threshold)
        assert not decision.should_exploit
        assert result == "New result"

    def test_policy_with_zero_quality(self):
        """Test policy decision with zero quality score"""
        policy = HybridPolicy(quality_threshold=80.0)

        decision = policy.make_decision(
            has_experience=True,
            best_experience_quality=0.0
        )

        assert not decision.should_exploit
        assert "below threshold" in decision.reason

    def test_policy_with_negative_quality(self):
        """Test policy handles negative quality scores gracefully"""
        policy = HybridPolicy()

        decision = policy.make_decision(
            has_experience=True,
            best_experience_quality=-10.0
        )

        # Should handle gracefully and explore
        assert not decision.should_exploit


class TestCorruptedExperienceData:
    """Test handling of corrupted or invalid experience data"""

    def test_experience_hash_consistency(self):
        """Test that experience hash is consistent"""
        exp1 = Experience(
            agent_type="test",
            task_description="Task A",
            approach="Method",
            result="Result",
            success=True,
            experience_type=ExperienceType.SUCCESS
        )

        hash1 = exp1.get_hash()
        hash2 = exp1.get_hash()

        assert hash1 == hash2

    def test_experience_to_dict_from_dict_roundtrip(self):
        """Test serialization roundtrip preserves data"""
        original = Experience(
            agent_type="test",
            task_description="Task",
            approach="Method",
            result="Result",
            success=True,
            experience_type=ExperienceType.SUCCESS,
            confidence=0.95
        )

        # Roundtrip
        exp_dict = original.to_dict()
        restored = Experience.from_dict(exp_dict)

        assert restored.agent_type == original.agent_type
        assert restored.task_description == original.task_description
        assert restored.approach == original.approach
        assert restored.result == original.result
        assert restored.success == original.success
        assert restored.experience_type == original.experience_type
        assert restored.confidence == original.confidence

    @pytest.mark.asyncio
    async def test_import_malformed_experience(self):
        """Test importing experiences with missing fields"""
        transfer = ExperienceTransfer()

        # Valid experience
        valid_exp = {
            "agent_type": "test",
            "task_description": "Task",
            "approach": "Method",
            "result": "Result",
            "success": True,
            "experience_type": "success",
            "confidence": 1.0,
            "timestamp": datetime.now().isoformat(),
            "metadata": {},
            "hash": "test123"
        }

        # Malformed experience (missing timestamp)
        malformed_exp = {
            "agent_type": "test",
            "task_description": "Task",
            "approach": "Method",
            "result": "Result",
            "success": True,
            "experience_type": "success"
        }

        # Import valid one should work
        count = await transfer.import_experiences("test", [valid_exp])
        assert count == 1

        # Import malformed should fail gracefully
        with pytest.raises(KeyError):
            await transfer.import_experiences("test", [malformed_exp])


class TestAgentTypeMismatch:
    """Test handling of agent type mismatches"""

    @pytest.mark.asyncio
    async def test_get_experiences_from_different_agent_type(self):
        """Test getting experiences from wrong agent type"""
        transfer = ExperienceTransfer()

        # Agent A shares
        await transfer.share_experience(
            agent_type="agent_a",
            task_description="Task",
            approach="Method",
            result="Result",
            success=True
        )

        # Agent B tries to get Agent A's experiences
        # (Should get empty list since they're in different buffers)
        b_experiences = await transfer.get_agent_experiences("agent_b")
        assert len(b_experiences) == 0

    @pytest.mark.asyncio
    async def test_mixin_without_agent_type_set(self):
        """Test mixin raises error if agent_type not set"""
        mixin = ExperienceReuseMixinAsync()
        mixin.set_experience_transfer(ExperienceTransfer())

        async def generate():
            return "Result"

        # Should raise RuntimeError
        with pytest.raises(RuntimeError, match="agent_type must be set"):
            await mixin.with_experience_reuse(
                task_description="Task",
                generate_fn=generate
            )

    @pytest.mark.asyncio
    async def test_record_outcome_without_agent_type(self):
        """Test recording outcome without agent_type set"""
        mixin = ExperienceReuseMixinAsync()
        mixin.set_experience_transfer(ExperienceTransfer())

        with pytest.raises(RuntimeError, match="agent_type must be set"):
            await mixin.record_task_outcome(
                task_description="Task",
                approach="Method",
                result="Result",
                success=True
            )


class TestConcurrentAccess:
    """Test concurrent access and thread safety"""

    @pytest.mark.asyncio
    async def test_concurrent_experience_sharing(self):
        """Test multiple agents sharing experiences concurrently"""
        transfer = ExperienceTransfer()

        async def share_many(agent_id: str, count: int):
            for i in range(count):
                await transfer.share_experience(
                    agent_type="concurrent_test",
                    task_description=f"Task {agent_id}-{i}",
                    approach=f"Method {i}",
                    result=f"Result {i}",
                    success=True
                )

        # Run 10 agents concurrently, each sharing 10 experiences
        tasks = [share_many(f"agent_{i}", 10) for i in range(10)]
        await asyncio.gather(*tasks)

        # Verify all experiences stored (100 total)
        experiences = await transfer.get_agent_experiences("concurrent_test", limit=1000)
        assert len(experiences) == 100

    @pytest.mark.asyncio
    async def test_concurrent_read_write(self):
        """Test concurrent reads and writes"""
        transfer = ExperienceTransfer()

        async def writer():
            for i in range(20):
                await transfer.share_experience(
                    agent_type="rw_test",
                    task_description=f"Task {i}",
                    approach="Method",
                    result="Result",
                    success=True
                )
                await asyncio.sleep(0.001)

        async def reader():
            results = []
            for _ in range(20):
                exps = await transfer.get_agent_experiences("rw_test")
                results.append(len(exps))
                await asyncio.sleep(0.001)
            return results

        # Run writer and multiple readers concurrently
        write_task = asyncio.create_task(writer())
        read_tasks = [asyncio.create_task(reader()) for _ in range(3)]

        await write_task
        read_results = await asyncio.gather(*read_tasks)

        # Verify no crashes or data corruption
        for results in read_results:
            assert all(r >= 0 for r in results)

    @pytest.mark.asyncio
    async def test_concurrent_policy_decisions(self):
        """Test multiple agents making policy decisions concurrently"""
        async def make_decisions(policy: HybridPolicy, count: int):
            decisions = []
            for i in range(count):
                decision = policy.make_decision(
                    has_experience=True,
                    best_experience_quality=85.0
                )
                decisions.append(decision.should_exploit)
            return decisions

        policy = HybridPolicy(exploit_ratio=0.8)

        # Run 5 agents concurrently
        tasks = [make_decisions(policy, 100) for _ in range(5)]
        results = await asyncio.gather(*tasks)

        # Verify all completed successfully
        total_decisions = sum(len(r) for r in results)
        assert total_decisions == 500


class TestBufferOverflow:
    """Test buffer overflow and size limit handling"""

    def test_buffer_respects_max_size(self):
        """Test that buffer doesn't exceed max size"""
        buffer = ExperienceBuffer("overflow_test", max_size=100)

        # Add 200 experiences
        for i in range(200):
            exp = Experience(
                agent_type="overflow_test",
                task_description=f"Task {i}",
                approach=f"Method {i}",
                result=f"Result {i}",
                success=True,
                experience_type=ExperienceType.SUCCESS
            )
            buffer.add(exp)

        # Verify buffer size is capped at 100
        assert len(buffer.get_all()) == 100

    def test_buffer_keeps_newest_experiences(self):
        """Test that buffer keeps newest experiences when full"""
        buffer = ExperienceBuffer("newest_test", max_size=10)

        # Add 20 experiences
        for i in range(20):
            exp = Experience(
                agent_type="newest_test",
                task_description=f"Task {i}",
                approach="Method",
                result="Result",
                success=True,
                experience_type=ExperienceType.SUCCESS
            )
            buffer.add(exp)

        experiences = buffer.get_all()

        # Should have tasks 10-19 (newest 10)
        assert len(experiences) == 10
        assert experiences[0].task_description == "Task 10"
        assert experiences[-1].task_description == "Task 19"

    @pytest.mark.asyncio
    async def test_transfer_hub_handles_large_scale(self):
        """Test transfer hub with very large number of experiences"""
        transfer = ExperienceTransfer()

        # Add 10,000 experiences
        for i in range(10000):
            await transfer.share_experience(
                agent_type="large_scale",
                task_description=f"Task {i}",
                approach=f"Method {i % 100}",
                result="Result",
                success=(i % 3 == 0)
            )

        # Verify hub handles this gracefully
        stats = await transfer.get_hub_stats()
        assert "large_scale" in stats["agents"]

        # Verify buffer is capped at max_size (default 1000)
        experiences = await transfer.get_agent_experiences("large_scale", limit=10000)
        assert len(experiences) == 1000


class TestExperienceAdaptation:
    """Test experience adaptation and failure handling"""

    @pytest.mark.asyncio
    async def test_adaptation_failure_falls_back_to_generate(self):
        """Test that failed adaptation falls back to generation"""
        transfer = ExperienceTransfer()

        # Share an experience
        await transfer.share_experience(
            agent_type="adapt_test",
            task_description="Task",
            approach="Method",
            result="Original result",
            success=True
        )

        mixin = ExperienceReuseMixinAsync()
        mixin.agent_type = "adapt_test"
        mixin.set_experience_transfer(transfer)

        # Adaptation function that raises error
        def bad_adapter(exp_dict):
            raise ValueError("Adaptation failed")

        async def generate():
            return "Generated fallback"

        result, decision = await mixin.with_experience_reuse(
            task_description="Task",
            generate_fn=generate,
            adapt_experience=bad_adapter
        )

        # Should fall back to generate
        assert result == "Generated fallback"

    @pytest.mark.asyncio
    async def test_successful_adaptation(self):
        """Test successful experience adaptation"""
        transfer = ExperienceTransfer()

        await transfer.share_experience(
            agent_type="adapt_test2",
            task_description="Original task",
            approach="Method",
            result="Original result",
            success=True,
            confidence=0.95  # High quality
        )

        mixin = ExperienceReuseMixinAsync()
        mixin.agent_type = "adapt_test2"
        mixin.set_experience_transfer(transfer)

        def adapter(exp_dict):
            return f"Adapted: {exp_dict['result']}"

        async def generate():
            return "Generated"

        result, decision = await mixin.with_experience_reuse(
            task_description="Original task",
            generate_fn=generate,
            adapt_experience=adapter
        )

        # May exploit (probabilistic), if it does, result should be adapted
        # Run multiple times to catch exploitation
        exploited_once = False
        for _ in range(50):
            result, decision = await mixin.with_experience_reuse(
                task_description="Original task",
                generate_fn=generate,
                adapt_experience=adapter
            )
            if decision.should_exploit:
                assert "Adapted:" in result
                exploited_once = True
                break

        # With 80% ratio and 50 attempts, should exploit at least once
        assert exploited_once


class TestSimilarityEdgeCases:
    """Test similarity search edge cases"""

    def test_similarity_with_empty_task(self):
        """Test similarity calculation with empty task descriptions"""
        buffer = ExperienceBuffer("empty_test")

        exp = Experience(
            agent_type="empty_test",
            task_description="Normal task",
            approach="Method",
            result="Result",
            success=True,
            experience_type=ExperienceType.SUCCESS
        )
        buffer.add(exp)

        # Search with empty string - similarity is 0.0, but min_similarity=0.0 includes it
        # Use min_similarity > 0.0 to exclude zero-similarity results
        similar = buffer.find_similar("", min_similarity=0.1)
        assert len(similar) == 0  # Should exclude 0.0 similarity results

    def test_similarity_with_identical_tasks(self):
        """Test similarity with identical task descriptions"""
        buffer = ExperienceBuffer("identical_test")

        exp = Experience(
            agent_type="identical_test",
            task_description="Exact same task",
            approach="Method",
            result="Result",
            success=True,
            experience_type=ExperienceType.SUCCESS
        )
        buffer.add(exp)

        similar = buffer.find_similar("Exact same task", min_similarity=0.5)
        assert len(similar) == 1
        # Jaccard similarity should be 1.0 for identical tasks

    def test_similarity_with_completely_different_tasks(self):
        """Test similarity with completely different tasks"""
        buffer = ExperienceBuffer("different_test")

        exp = Experience(
            agent_type="different_test",
            task_description="apple banana orange",
            approach="Method",
            result="Result",
            success=True,
            experience_type=ExperienceType.SUCCESS
        )
        buffer.add(exp)

        similar = buffer.find_similar("zebra elephant giraffe", min_similarity=0.3)
        assert len(similar) == 0  # No overlap in words


if __name__ == "__main__":
    pytest.main([__file__, "-v", "-s"])
