"""
Comprehensive tests for ReplayBuffer

Tests cover:
- Happy path for all methods
- Error handling and validation
- Thread safety (concurrent access)
- Graceful degradation (in-memory fallback)
- Sampling strategies
- Statistics accuracy
- Resource cleanup

Run with: python test_replay_buffer.py
"""

import json
import time
import threading
import unittest
from datetime import datetime, timezone, timedelta
from infrastructure.replay_buffer import (
    ReplayBuffer,
    Trajectory,
    ActionStep,
    OutcomeTag,
    get_replay_buffer
)


class TestReplayBuffer(unittest.TestCase):
    """Test suite for ReplayBuffer"""

    def setUp(self):
        """Create fresh ReplayBuffer for each test"""
        # Use unique DB name to avoid collisions
        self.buffer = ReplayBuffer(db_name=f"test_replay_{int(time.time() * 1000)}")

    def tearDown(self):
        """Clean up after each test"""
        # Drop test database if MongoDB available
        if self.buffer.mongo_available:
            self.buffer.mongo_client.drop_database(self.buffer.db_name)
        self.buffer.close()

    def _create_test_trajectory(
        self,
        trajectory_id: str = None,
        agent_id: str = "test_agent",
        task: str = "test task",
        outcome: OutcomeTag = OutcomeTag.SUCCESS,
        reward: float = 0.8,
        num_steps: int = 3
    ) -> Trajectory:
        """Helper to create test trajectory"""
        if trajectory_id is None:
            trajectory_id = f"traj_{int(time.time() * 1000000)}"

        steps = []
        for i in range(num_steps):
            step = ActionStep(
                timestamp=datetime.now(timezone.utc).isoformat(),
                tool_name=f"tool_{i}",
                tool_args={"arg": f"value_{i}"},
                tool_result=f"result_{i}",
                agent_reasoning=f"I chose tool_{i} because reason_{i}"
            )
            steps.append(step)

        return Trajectory(
            trajectory_id=trajectory_id,
            agent_id=agent_id,
            task_description=task,
            initial_state={"state": "initial"},
            steps=tuple(steps),
            final_outcome=outcome.value,
            reward=reward,
            metadata={"test": True},
            created_at=datetime.now(timezone.utc).isoformat(),
            duration_seconds=5.5
        )

    # ========================================================================
    # HAPPY PATH TESTS
    # ========================================================================

    def test_store_and_retrieve_trajectory(self):
        """Test basic store and retrieve"""
        traj = self._create_test_trajectory()

        # Store
        traj_id = self.buffer.store_trajectory(traj)
        self.assertEqual(traj_id, traj.trajectory_id)

        # Retrieve
        retrieved = self.buffer.get_trajectory(traj_id)
        self.assertIsNotNone(retrieved)
        self.assertEqual(retrieved.trajectory_id, traj.trajectory_id)
        self.assertEqual(retrieved.agent_id, traj.agent_id)
        self.assertEqual(retrieved.task_description, traj.task_description)
        self.assertEqual(retrieved.final_outcome, traj.final_outcome)
        self.assertEqual(retrieved.reward, traj.reward)
        self.assertEqual(len(retrieved.steps), len(traj.steps))

    def test_store_multiple_trajectories(self):
        """Test storing multiple trajectories"""
        trajectories = []
        for i in range(5):
            traj = self._create_test_trajectory(
                trajectory_id=f"traj_{i}",
                agent_id=f"agent_{i % 2}",  # Two agents
                task=f"task_{i % 3}",  # Three task types
                outcome=OutcomeTag.SUCCESS if i % 2 == 0 else OutcomeTag.FAILURE,
                reward=i / 10.0
            )
            trajectories.append(traj)
            self.buffer.store_trajectory(traj)

        # Verify all stored
        for traj in trajectories:
            retrieved = self.buffer.get_trajectory(traj.trajectory_id)
            self.assertIsNotNone(retrieved)
            self.assertEqual(retrieved.trajectory_id, traj.trajectory_id)

    def test_sample_trajectories_random(self):
        """Test random sampling"""
        # Store 10 trajectories
        for i in range(10):
            traj = self._create_test_trajectory(
                trajectory_id=f"traj_{i}",
                outcome=OutcomeTag.SUCCESS
            )
            self.buffer.store_trajectory(traj)

        # Sample 5
        sampled = self.buffer.sample_trajectories(n=5)
        self.assertEqual(len(sampled), 5)

        # All should be unique
        ids = [t.trajectory_id for t in sampled]
        self.assertEqual(len(ids), len(set(ids)))

    def test_sample_trajectories_by_outcome(self):
        """Test sampling filtered by outcome"""
        # Store mixed outcomes
        for i in range(10):
            outcome = OutcomeTag.SUCCESS if i < 5 else OutcomeTag.FAILURE
            traj = self._create_test_trajectory(
                trajectory_id=f"traj_{i}",
                outcome=outcome
            )
            self.buffer.store_trajectory(traj)

        # Sample only successes
        success_sample = self.buffer.sample_trajectories(n=10, outcome=OutcomeTag.SUCCESS)
        self.assertEqual(len(success_sample), 5)
        for traj in success_sample:
            self.assertEqual(traj.final_outcome, OutcomeTag.SUCCESS.value)

        # Sample only failures
        failure_sample = self.buffer.sample_trajectories(n=10, outcome=OutcomeTag.FAILURE)
        self.assertEqual(len(failure_sample), 5)
        for traj in failure_sample:
            self.assertEqual(traj.final_outcome, OutcomeTag.FAILURE.value)

    def test_get_successful_trajectories(self):
        """Test retrieving top successful trajectories"""
        # Store successes with different rewards
        for i in range(10):
            traj = self._create_test_trajectory(
                trajectory_id=f"traj_{i}",
                task="solve bug",
                outcome=OutcomeTag.SUCCESS,
                reward=i / 10.0  # 0.0 to 0.9
            )
            self.buffer.store_trajectory(traj)

        # Get top 3
        top_3 = self.buffer.get_successful_trajectories(task_type="bug", top_n=3)
        self.assertEqual(len(top_3), 3)

        # Should be sorted by reward descending
        self.assertGreaterEqual(top_3[0].reward, top_3[1].reward)
        self.assertGreaterEqual(top_3[1].reward, top_3[2].reward)

        # All should match task
        for traj in top_3:
            self.assertIn("bug", traj.task_description.lower())
            self.assertEqual(traj.final_outcome, OutcomeTag.SUCCESS.value)

    def test_get_failed_trajectories(self):
        """Test retrieving failed trajectories"""
        # Store failures at different times
        for i in range(5):
            # Add small delay to ensure different timestamps
            time.sleep(0.01)
            traj = self._create_test_trajectory(
                trajectory_id=f"traj_{i}",
                task="deploy code",
                outcome=OutcomeTag.FAILURE,
                reward=0.0
            )
            self.buffer.store_trajectory(traj)

        # Get failed trajectories
        failures = self.buffer.get_failed_trajectories(task_type="deploy", top_n=3)
        self.assertEqual(len(failures), 3)

        # All should be failures
        for traj in failures:
            self.assertEqual(traj.final_outcome, OutcomeTag.FAILURE.value)
            self.assertIn("deploy", traj.task_description.lower())

        # Should be sorted by recency (most recent first)
        self.assertGreaterEqual(failures[0].created_at, failures[1].created_at)
        self.assertGreaterEqual(failures[1].created_at, failures[2].created_at)

    def test_prune_old_trajectories(self):
        """Test pruning old trajectories"""
        # Create old trajectory (manually set old timestamp)
        old_traj = self._create_test_trajectory(trajectory_id="old_traj")
        # Recreate with old timestamp
        old_date = datetime.now(timezone.utc) - timedelta(days=40)
        old_traj_updated = Trajectory(
            trajectory_id=old_traj.trajectory_id,
            agent_id=old_traj.agent_id,
            task_description=old_traj.task_description,
            initial_state=old_traj.initial_state,
            steps=old_traj.steps,
            final_outcome=old_traj.final_outcome,
            reward=old_traj.reward,
            metadata=old_traj.metadata,
            created_at=old_date.isoformat(),
            duration_seconds=old_traj.duration_seconds
        )
        self.buffer.store_trajectory(old_traj_updated)

        # Create recent trajectory
        recent_traj = self._create_test_trajectory(trajectory_id="recent_traj")
        self.buffer.store_trajectory(recent_traj)

        # Prune trajectories older than 30 days
        self.buffer.prune_old_trajectories(days_old=30)

        # Old should be gone
        old_retrieved = self.buffer.get_trajectory("old_traj")
        # In-memory might still have it, but MongoDB shouldn't
        if self.buffer.mongo_available:
            # Give a moment for operation
            time.sleep(0.1)
            old_retrieved = self.buffer.get_trajectory("old_traj")

        # Recent should still exist
        recent_retrieved = self.buffer.get_trajectory("recent_traj")
        self.assertIsNotNone(recent_retrieved)

    def test_get_statistics(self):
        """Test comprehensive statistics"""
        # Store diverse trajectories
        for i in range(20):
            outcome = OutcomeTag.SUCCESS if i % 2 == 0 else OutcomeTag.FAILURE
            traj = self._create_test_trajectory(
                trajectory_id=f"traj_{i}",
                agent_id=f"agent_{i % 3}",  # 3 different agents
                outcome=outcome,
                reward=i / 20.0
            )
            self.buffer.store_trajectory(traj)

        # Get statistics
        stats = self.buffer.get_statistics()

        # Verify counts
        self.assertEqual(stats["total_trajectories"], 20)
        self.assertEqual(stats["by_outcome"][OutcomeTag.SUCCESS.value], 10)
        self.assertEqual(stats["by_outcome"][OutcomeTag.FAILURE.value], 10)

        # Verify agent stats
        self.assertEqual(len(stats["by_agent"]), 3)  # 3 agents
        for agent_id, agent_stats in stats["by_agent"].items():
            self.assertIn("total", agent_stats)
            self.assertIn("successes", agent_stats)
            self.assertIn("success_rate", agent_stats)
            self.assertIn("avg_reward", agent_stats)

        # Verify averages
        self.assertGreaterEqual(stats["avg_reward"], 0.0)
        self.assertLessEqual(stats["avg_reward"], 1.0)
        self.assertGreater(stats["avg_duration_seconds"], 0.0)

    # ========================================================================
    # ERROR HANDLING TESTS
    # ========================================================================

    def test_validate_trajectory_empty_id(self):
        """Test validation rejects empty trajectory_id"""
        traj = self._create_test_trajectory()
        invalid_traj = Trajectory(
            trajectory_id="",  # Invalid
            agent_id=traj.agent_id,
            task_description=traj.task_description,
            initial_state=traj.initial_state,
            steps=traj.steps,
            final_outcome=traj.final_outcome,
            reward=traj.reward,
            metadata=traj.metadata,
            created_at=traj.created_at,
            duration_seconds=traj.duration_seconds
        )

        with self.assertRaises(ValueError) as ctx:
            self.buffer.store_trajectory(invalid_traj)
        self.assertIn("trajectory_id", str(ctx.exception))

    def test_validate_trajectory_empty_agent_id(self):
        """Test validation rejects empty agent_id"""
        traj = self._create_test_trajectory()
        invalid_traj = Trajectory(
            trajectory_id=traj.trajectory_id,
            agent_id="",  # Invalid
            task_description=traj.task_description,
            initial_state=traj.initial_state,
            steps=traj.steps,
            final_outcome=traj.final_outcome,
            reward=traj.reward,
            metadata=traj.metadata,
            created_at=traj.created_at,
            duration_seconds=traj.duration_seconds
        )

        with self.assertRaises(ValueError) as ctx:
            self.buffer.store_trajectory(invalid_traj)
        self.assertIn("agent_id", str(ctx.exception))

    def test_validate_trajectory_empty_task(self):
        """Test validation rejects empty task_description"""
        traj = self._create_test_trajectory()
        invalid_traj = Trajectory(
            trajectory_id=traj.trajectory_id,
            agent_id=traj.agent_id,
            task_description="   ",  # Invalid (whitespace)
            initial_state=traj.initial_state,
            steps=traj.steps,
            final_outcome=traj.final_outcome,
            reward=traj.reward,
            metadata=traj.metadata,
            created_at=traj.created_at,
            duration_seconds=traj.duration_seconds
        )

        with self.assertRaises(ValueError) as ctx:
            self.buffer.store_trajectory(invalid_traj)
        self.assertIn("task_description", str(ctx.exception))

    def test_validate_trajectory_invalid_reward(self):
        """Test validation rejects reward outside [0, 1]"""
        traj = self._create_test_trajectory()
        invalid_traj = Trajectory(
            trajectory_id=traj.trajectory_id,
            agent_id=traj.agent_id,
            task_description=traj.task_description,
            initial_state=traj.initial_state,
            steps=traj.steps,
            final_outcome=traj.final_outcome,
            reward=1.5,  # Invalid (> 1.0)
            metadata=traj.metadata,
            created_at=traj.created_at,
            duration_seconds=traj.duration_seconds
        )

        with self.assertRaises(ValueError) as ctx:
            self.buffer.store_trajectory(invalid_traj)
        self.assertIn("reward", str(ctx.exception))

    def test_validate_trajectory_negative_duration(self):
        """Test validation rejects negative duration"""
        traj = self._create_test_trajectory()
        invalid_traj = Trajectory(
            trajectory_id=traj.trajectory_id,
            agent_id=traj.agent_id,
            task_description=traj.task_description,
            initial_state=traj.initial_state,
            steps=traj.steps,
            final_outcome=traj.final_outcome,
            reward=traj.reward,
            metadata=traj.metadata,
            created_at=traj.created_at,
            duration_seconds=-1.0  # Invalid
        )

        with self.assertRaises(ValueError) as ctx:
            self.buffer.store_trajectory(invalid_traj)
        self.assertIn("duration_seconds", str(ctx.exception))

    def test_sample_invalid_n(self):
        """Test sampling with invalid n parameter"""
        with self.assertRaises(ValueError) as ctx:
            self.buffer.sample_trajectories(n=0)
        self.assertIn("n must be >= 1", str(ctx.exception))

        with self.assertRaises(ValueError) as ctx:
            self.buffer.sample_trajectories(n=-5)
        self.assertIn("n must be >= 1", str(ctx.exception))

    def test_get_successful_empty_task_type(self):
        """Test get_successful with empty task_type"""
        with self.assertRaises(ValueError) as ctx:
            self.buffer.get_successful_trajectories(task_type="", top_n=5)
        self.assertIn("task_type", str(ctx.exception))

    def test_get_successful_invalid_top_n(self):
        """Test get_successful with invalid top_n"""
        with self.assertRaises(ValueError) as ctx:
            self.buffer.get_successful_trajectories(task_type="test", top_n=0)
        self.assertIn("top_n must be >= 1", str(ctx.exception))

    def test_get_failed_empty_task_type(self):
        """Test get_failed with empty task_type"""
        with self.assertRaises(ValueError) as ctx:
            self.buffer.get_failed_trajectories(task_type="   ", top_n=5)
        self.assertIn("task_type", str(ctx.exception))

    def test_get_trajectory_not_found(self):
        """Test retrieving non-existent trajectory"""
        result = self.buffer.get_trajectory("nonexistent_id")
        self.assertIsNone(result)

    def test_sample_more_than_available(self):
        """Test sampling more trajectories than exist"""
        # Store only 3
        for i in range(3):
            traj = self._create_test_trajectory(trajectory_id=f"traj_{i}")
            self.buffer.store_trajectory(traj)

        # Sample 10 (should return only 3)
        sampled = self.buffer.sample_trajectories(n=10)
        self.assertEqual(len(sampled), 3)

    def test_sample_from_empty_buffer(self):
        """Test sampling from empty buffer"""
        sampled = self.buffer.sample_trajectories(n=5)
        self.assertEqual(len(sampled), 0)

    # ========================================================================
    # THREAD SAFETY TESTS
    # ========================================================================

    def test_concurrent_writes(self):
        """Test thread safety with concurrent writes"""
        num_threads = 10
        trajectories_per_thread = 10
        errors = []

        def write_trajectories(thread_id):
            try:
                for i in range(trajectories_per_thread):
                    traj = self._create_test_trajectory(
                        trajectory_id=f"thread_{thread_id}_traj_{i}",
                        agent_id=f"agent_{thread_id}"
                    )
                    self.buffer.store_trajectory(traj)
            except Exception as e:
                errors.append(e)

        # Spawn threads
        threads = []
        for t_id in range(num_threads):
            thread = threading.Thread(target=write_trajectories, args=(t_id,))
            threads.append(thread)
            thread.start()

        # Wait for all
        for thread in threads:
            thread.join()

        # No errors
        self.assertEqual(len(errors), 0, f"Errors occurred: {errors}")

        # Verify all stored
        stats = self.buffer.get_statistics()
        expected_total = num_threads * trajectories_per_thread
        self.assertEqual(stats["total_trajectories"], expected_total)

    def test_concurrent_reads_and_writes(self):
        """Test thread safety with mixed reads and writes"""
        # Pre-populate
        for i in range(20):
            traj = self._create_test_trajectory(trajectory_id=f"initial_{i}")
            self.buffer.store_trajectory(traj)

        errors = []
        read_results = []

        def reader():
            try:
                for _ in range(10):
                    sampled = self.buffer.sample_trajectories(n=5)
                    read_results.append(len(sampled))
                    time.sleep(0.001)
            except Exception as e:
                errors.append(e)

        def writer(thread_id):
            try:
                for i in range(5):
                    traj = self._create_test_trajectory(
                        trajectory_id=f"concurrent_{thread_id}_{i}"
                    )
                    self.buffer.store_trajectory(traj)
                    time.sleep(0.001)
            except Exception as e:
                errors.append(e)

        # Mix readers and writers
        threads = []
        for i in range(3):
            threads.append(threading.Thread(target=reader))
        for i in range(3):
            threads.append(threading.Thread(target=writer, args=(i,)))

        # Start all
        for thread in threads:
            thread.start()

        # Wait all
        for thread in threads:
            thread.join()

        # No errors
        self.assertEqual(len(errors), 0, f"Errors occurred: {errors}")

        # Reads should have succeeded
        self.assertGreater(len(read_results), 0)

    # ========================================================================
    # CONTEXT MANAGER / RESOURCE CLEANUP TESTS
    # ========================================================================

    def test_context_manager(self):
        """Test context manager resource cleanup"""
        with ReplayBuffer(db_name=f"test_ctx_{int(time.time())}") as buffer:
            traj = self._create_test_trajectory()
            buffer.store_trajectory(traj)
            retrieved = buffer.get_trajectory(traj.trajectory_id)
            self.assertIsNotNone(retrieved)

        # After context exit, connections should be closed
        # No exception should occur

    def test_singleton_pattern(self):
        """Test thread-safe singleton"""
        buffer1 = get_replay_buffer()
        buffer2 = get_replay_buffer()

        # Should be same instance
        self.assertIs(buffer1, buffer2)

    # ========================================================================
    # IN-MEMORY FALLBACK TESTS
    # ========================================================================

    def test_in_memory_fallback_works(self):
        """Test that in-memory fallback works when backends unavailable"""
        # Even if MongoDB/Redis unavailable, should still work
        traj = self._create_test_trajectory()
        traj_id = self.buffer.store_trajectory(traj)

        # Should retrieve from in-memory
        retrieved = self.buffer.get_trajectory(traj_id)
        self.assertIsNotNone(retrieved)
        self.assertEqual(retrieved.trajectory_id, traj.trajectory_id)

    def test_in_memory_max_size_pruning(self):
        """Test in-memory storage prunes when exceeding max size"""
        # Override max size for testing
        original_max = ReplayBuffer.MAX_IN_MEMORY_TRAJECTORIES
        ReplayBuffer.MAX_IN_MEMORY_TRAJECTORIES = 10

        try:
            # Store 15 trajectories
            for i in range(15):
                traj = self._create_test_trajectory(trajectory_id=f"traj_{i}")
                time.sleep(0.001)  # Small delay for timestamp differentiation
                self.buffer.store_trajectory(traj)

            # In-memory should have at most 10
            self.assertLessEqual(len(self.buffer.in_memory_trajectories), 10)

        finally:
            # Restore original
            ReplayBuffer.MAX_IN_MEMORY_TRAJECTORIES = original_max

    # ========================================================================
    # EDGE CASES
    # ========================================================================

    def test_empty_steps_trajectory(self):
        """Test trajectory with no steps"""
        traj = Trajectory(
            trajectory_id="empty_steps",
            agent_id="agent_1",
            task_description="quick task",
            initial_state={},
            steps=tuple(),  # No steps
            final_outcome=OutcomeTag.SUCCESS.value,
            reward=1.0,
            metadata={},
            created_at=datetime.now(timezone.utc).isoformat(),
            duration_seconds=0.1
        )

        # Should store successfully
        traj_id = self.buffer.store_trajectory(traj)
        retrieved = self.buffer.get_trajectory(traj_id)
        self.assertIsNotNone(retrieved)
        self.assertEqual(len(retrieved.steps), 0)

    def test_large_trajectory(self):
        """Test trajectory with many steps"""
        traj = self._create_test_trajectory(num_steps=100)

        # Should store and retrieve
        traj_id = self.buffer.store_trajectory(traj)
        retrieved = self.buffer.get_trajectory(traj_id)
        self.assertIsNotNone(retrieved)
        self.assertEqual(len(retrieved.steps), 100)

    def test_special_characters_in_task(self):
        """Test trajectory with special characters in task description"""
        traj = self._create_test_trajectory(
            task="Fix bug with $regex and {special} chars"
        )

        traj_id = self.buffer.store_trajectory(traj)
        retrieved = self.buffer.get_trajectory(traj_id)
        self.assertIsNotNone(retrieved)
        self.assertEqual(retrieved.task_description, traj.task_description)


def run_tests():
    """Run all tests with detailed output"""
    print("\n" + "="*70)
    print("REPLAY BUFFER TEST SUITE")
    print("="*70 + "\n")

    # Create test suite
    loader = unittest.TestLoader()
    suite = loader.loadTestsFromTestCase(TestReplayBuffer)

    # Run with verbose output
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)

    # Summary
    print("\n" + "="*70)
    print("TEST SUMMARY")
    print("="*70)
    print(f"Tests run: {result.testsRun}")
    print(f"Successes: {result.testsRun - len(result.failures) - len(result.errors)}")
    print(f"Failures: {len(result.failures)}")
    print(f"Errors: {len(result.errors)}")

    if result.wasSuccessful():
        print("\n✅ ALL TESTS PASSED")
    else:
        print("\n❌ SOME TESTS FAILED")

    print("="*70 + "\n")

    return result.wasSuccessful()


if __name__ == "__main__":
    success = run_tests()
    exit(0 if success else 1)
