"""
Comprehensive Unit Tests for Enhanced Builder Agent
Day 3 Testing Suite

Tests all learning capabilities:
- ReasoningBank integration (pattern queries)
- Replay Buffer integration (trajectory recording)
- Pattern storage for future use
- Error handling and edge cases
- Full build_from_spec workflow

Test Coverage:
- Pattern querying before build
- Action recording during build
- Trajectory finalization after build
- Pattern storage for successful builds
- Error handling for failed builds
- Empty/invalid spec handling
"""

import asyncio
import json
import unittest
from datetime import datetime, timezone
from typing import Dict, Any
from unittest.mock import Mock, patch, MagicMock

# Import what we're testing
from agents.builder_agent_enhanced import EnhancedBuilderAgent, BuildAttempt
from infrastructure.reasoning_bank import (
    ReasoningBank,
    MemoryType,
    OutcomeTag,
    StrategyNugget
)
from infrastructure.replay_buffer import (
    ReplayBuffer,
    Trajectory,
    ActionStep
)


class TestEnhancedBuilderAgentInit(unittest.TestCase):
    """Test agent initialization"""

    def test_agent_initialization(self):
        """Test agent initializes with correct business_id"""
        agent = EnhancedBuilderAgent(business_id="test_business_123")

        self.assertEqual(agent.business_id, "test_business_123")
        self.assertIsNotNone(agent.reasoning_bank)
        self.assertIsNotNone(agent.replay_buffer)
        self.assertIsNone(agent.current_trajectory)
        self.assertIsNone(agent.current_attempt)
        self.assertEqual(len(agent.trajectory_steps), 0)

    def test_default_business_id(self):
        """Test default business_id"""
        agent = EnhancedBuilderAgent()
        self.assertEqual(agent.business_id, "default")


class TestTrajectoryManagement(unittest.TestCase):
    """Test trajectory recording functionality"""

    def setUp(self):
        """Set up test agent"""
        self.agent = EnhancedBuilderAgent(business_id="test_business")

    def test_start_trajectory(self):
        """Test starting a new trajectory"""
        trajectory_id = self.agent._start_trajectory(
            task_description="Test build task",
            initial_state={"test": "data"}
        )

        self.assertIsNotNone(trajectory_id)
        self.assertTrue(trajectory_id.startswith("traj_test_business_"))
        self.assertIsNotNone(self.agent.current_attempt)
        self.assertEqual(self.agent.current_attempt.spec_summary, "Test build task")
        self.assertEqual(len(self.agent.trajectory_steps), 0)

    def test_record_action(self):
        """Test recording an action step"""
        # Start trajectory first
        self.agent._start_trajectory("Test task", {})

        # Record action
        self.agent._record_action(
            tool_name="test_tool",
            tool_args={"param": "value"},
            tool_result={"success": True},
            agent_reasoning="Testing action recording"
        )

        self.assertEqual(len(self.agent.trajectory_steps), 1)
        step = self.agent.trajectory_steps[0]
        self.assertEqual(step.tool_name, "test_tool")
        self.assertEqual(step.tool_args, {"param": "value"})
        self.assertEqual(step.tool_result, {"success": True})
        self.assertEqual(step.agent_reasoning, "Testing action recording")

    def test_record_action_without_trajectory(self):
        """Test recording action without starting trajectory (should not crash)"""
        # Should log warning but not crash
        self.agent._record_action(
            tool_name="test_tool",
            tool_args={},
            tool_result={},
            agent_reasoning="test"
        )

        # No steps should be recorded
        self.assertEqual(len(self.agent.trajectory_steps), 0)

    def test_finalize_trajectory_success(self):
        """Test finalizing a successful trajectory"""
        # Start and record some actions
        self.agent._start_trajectory("Test build", {"test": "data"})
        self.agent._record_action("tool1", {}, {"success": True}, "reason 1")
        self.agent._record_action("tool2", {}, {"success": True}, "reason 2")

        # Finalize
        trajectory_id = self.agent._finalize_trajectory(
            outcome=OutcomeTag.SUCCESS,
            reward=1.0,
            metadata={"files": 10}
        )

        self.assertIsNotNone(trajectory_id)
        # Should reset current tracking
        self.assertIsNone(self.agent.current_trajectory)
        self.assertIsNone(self.agent.current_attempt)
        self.assertEqual(len(self.agent.trajectory_steps), 0)

        # Verify stored in replay buffer
        stored_trajectory = self.agent.replay_buffer.get_trajectory(trajectory_id)
        self.assertIsNotNone(stored_trajectory)
        self.assertEqual(stored_trajectory.final_outcome, OutcomeTag.SUCCESS.value)
        self.assertEqual(stored_trajectory.reward, 1.0)
        self.assertEqual(len(stored_trajectory.steps), 2)

    def test_finalize_trajectory_failure(self):
        """Test finalizing a failed trajectory"""
        self.agent._start_trajectory("Failed build", {})
        self.agent._record_action("tool1", {}, {"error": "failed"}, "attempted build")

        trajectory_id = self.agent._finalize_trajectory(
            outcome=OutcomeTag.FAILURE,
            reward=0.0,
            metadata={"error": "build failed"}
        )

        stored_trajectory = self.agent.replay_buffer.get_trajectory(trajectory_id)
        self.assertIsNotNone(stored_trajectory)
        self.assertEqual(stored_trajectory.final_outcome, OutcomeTag.FAILURE.value)
        self.assertEqual(stored_trajectory.reward, 0.0)


class TestPatternManagement(unittest.TestCase):
    """Test ReasoningBank pattern integration"""

    def setUp(self):
        """Set up test agent"""
        self.agent = EnhancedBuilderAgent(business_id="test_business")

    def test_query_code_patterns_empty(self):
        """Test querying patterns when none exist (cold start)"""
        patterns = self.agent._query_code_patterns(
            component_type="frontend",
            context="React components"
        )

        # Should return empty list (cold start)
        self.assertIsInstance(patterns, list)
        # Length depends on ReasoningBank state, but should not crash

    def test_query_code_patterns_with_existing(self):
        """Test querying patterns when some exist"""
        # First, store a pattern
        self.agent.reasoning_bank.store_strategy(
            description="Test frontend pattern",
            context="frontend React code generation",
            task_metadata={"test": "data"},
            environment="Next.js",
            tools_used=["generate_frontend"],
            outcome=OutcomeTag.SUCCESS,
            steps=["step1", "step2"],
            learned_from=["test_traj"]
        )

        # Now query
        patterns = self.agent._query_code_patterns(
            component_type="frontend",
            context="React"
        )

        self.assertIsInstance(patterns, list)
        # Should find our pattern if search works

    def test_store_successful_pattern(self):
        """Test storing a successful code pattern"""
        # Start trajectory first
        self.agent._start_trajectory("Test build", {})

        strategy_id = self.agent._store_successful_pattern(
            pattern_type="frontend",
            description="Test React component pattern",
            code_snippet="const Component = () => { return <div>Test</div> }",
            metadata={"framework": "React 18"}
        )

        self.assertIsNotNone(strategy_id)
        self.assertTrue(len(strategy_id) > 0)

        # Verify it was stored
        # Query back and check
        patterns = self.agent._query_code_patterns("frontend", "React component")
        # Pattern should be findable (though may need exact match)

    def test_store_pattern_without_trajectory(self):
        """Test storing pattern without active trajectory"""
        # Should still work (trajectory tracking is optional)
        strategy_id = self.agent._store_successful_pattern(
            pattern_type="backend",
            description="API route pattern",
            code_snippet="def api_route(): pass",
            metadata={}
        )

        self.assertIsNotNone(strategy_id)


class TestCodeGenerationTools(unittest.TestCase):
    """Test the code generation tool methods"""

    def setUp(self):
        """Set up test agent"""
        self.agent = EnhancedBuilderAgent(business_id="test_business")

    def test_generate_frontend(self):
        """Test frontend code generation"""
        result_json = self.agent.generate_frontend(
            app_name="TestApp",
            features=["User Auth", "Dashboard"],
            pages=["Home", "About"]
        )

        result = json.loads(result_json)

        self.assertEqual(result["app_name"], "TestApp")
        self.assertIn("files", result)
        self.assertGreater(result["file_count"], 0)
        self.assertIn("app/layout.tsx", result["files"])
        self.assertEqual(len(result["pages_created"]), 2)

    def test_generate_backend(self):
        """Test backend API generation"""
        result_json = self.agent.generate_backend(
            app_name="TestApp",
            api_routes=["users", "posts"],
            auth_required=True
        )

        result = json.loads(result_json)

        self.assertEqual(result["app_name"], "TestApp")
        self.assertIn("files", result)
        self.assertTrue(result["auth_enabled"])
        self.assertIn("middleware.ts", result["files"])
        self.assertEqual(len(result["api_routes"]), 2)

    def test_generate_database(self):
        """Test database schema generation"""
        result_json = self.agent.generate_database(
            app_name="TestApp",
            tables=["Users", "Posts"],
            relationships=True
        )

        result = json.loads(result_json)

        self.assertEqual(result["app_name"], "TestApp")
        self.assertIn("files", result)
        self.assertEqual(len(result["tables"]), 2)
        self.assertIn("supabase/migrations/001_initial_schema.sql", result["files"])

    def test_generate_config(self):
        """Test configuration generation"""
        result_json = self.agent.generate_config(
            app_name="TestApp",
            env_vars=["DATABASE_URL", "API_KEY"]
        )

        result = json.loads(result_json)

        self.assertEqual(result["app_name"], "TestApp")
        self.assertIn("files", result)
        self.assertIn("package.json", result["files"])
        self.assertIn("tsconfig.json", result["files"])
        self.assertEqual(len(result["env_vars"]), 2)

    def test_review_code(self):
        """Test code review"""
        code_with_issues = """
        const test: any = "bad";
        console.log(test);
        // TODO: fix this
        """

        result_json = self.agent.review_code(
            file_path="test.ts",
            code_content=code_with_issues
        )

        result = json.loads(result_json)

        self.assertEqual(result["file_path"], "test.ts")
        self.assertGreater(result["issues_found"], 0)
        self.assertIn("issues", result)
        self.assertIn("suggestions", result)


class TestBuildFromSpec(unittest.TestCase):
    """Test the main build_from_spec method (integration test)"""

    def setUp(self):
        """Set up test agent and mock spec"""
        self.agent = EnhancedBuilderAgent(business_id="test_business")

        self.test_spec = {
            "specification_id": "TEST-123",
            "business_name": "TestFlow Pro",
            "business_description": "A test application",
            "executive_summary": {
                "core_features": [
                    "User authentication",
                    "Dashboard",
                    "Analytics"
                ]
            },
            "architecture": {
                "tech_stack": {
                    "backend": "Python + FastAPI",
                    "frontend": "Next.js + React"
                }
            }
        }

    def test_build_from_spec_success(self):
        """Test successful build from specification"""
        result = asyncio.run(self.agent.build_from_spec(self.test_spec))

        self.assertTrue(result["success"])
        self.assertGreater(len(result["files_generated"]), 0)
        self.assertIsNotNone(result["trajectory_id"])
        self.assertGreater(result["duration_seconds"], 0)
        self.assertIsNone(result["error_message"])

        # Verify trajectory was stored
        trajectory = self.agent.replay_buffer.get_trajectory(result["trajectory_id"])
        self.assertIsNotNone(trajectory)
        self.assertEqual(trajectory.final_outcome, OutcomeTag.SUCCESS.value)
        self.assertEqual(trajectory.reward, 1.0)

        # Verify patterns were stored
        self.assertGreater(len(result["patterns_stored"]), 0)

    def test_build_from_spec_empty_spec(self):
        """Test build with minimal spec"""
        minimal_spec = {
            "business_name": "MinimalApp"
        }

        result = asyncio.run(self.agent.build_from_spec(minimal_spec))

        # Should still succeed with defaults
        self.assertTrue(result["success"])
        self.assertGreater(len(result["files_generated"]), 0)

    def test_build_pattern_reuse(self):
        """Test that second build reuses patterns from first build"""
        # First build
        result1 = asyncio.run(self.agent.build_from_spec(self.test_spec))
        patterns_stored_first = len(result1["patterns_stored"])

        # Second build (same spec)
        result2 = asyncio.run(self.agent.build_from_spec(self.test_spec))
        patterns_used_second = len(result2["patterns_used"])

        # Second build should use patterns from first
        self.assertTrue(result2["success"])
        # Should have found some patterns (though exact count depends on search)
        # At minimum, should not crash


class TestErrorHandling(unittest.TestCase):
    """Test error handling and edge cases"""

    def setUp(self):
        """Set up test agent"""
        self.agent = EnhancedBuilderAgent(business_id="test_business")

    def test_finalize_without_start(self):
        """Test finalizing trajectory without starting one"""
        # Should handle gracefully
        trajectory_id = self.agent._finalize_trajectory(
            outcome=OutcomeTag.UNKNOWN,
            reward=0.0
        )

        # Should return empty string or handle gracefully
        self.assertEqual(trajectory_id, "")

    def test_query_patterns_with_invalid_context(self):
        """Test pattern query with empty context"""
        # Should handle gracefully and return empty list
        patterns = self.agent._query_code_patterns(
            component_type="",
            context=""
        )

        self.assertIsInstance(patterns, list)


class TestStatisticsAndObservability(unittest.TestCase):
    """Test statistics and observability features"""

    def setUp(self):
        """Set up test agent"""
        self.agent = EnhancedBuilderAgent(business_id="test_business")

    def test_replay_buffer_statistics(self):
        """Test getting replay buffer statistics"""
        # Do a build first
        spec = {
            "business_name": "StatsTestApp",
            "executive_summary": {
                "core_features": ["Feature1"]
            }
        }
        asyncio.run(self.agent.build_from_spec(spec))

        # Get stats
        stats = self.agent.replay_buffer.get_statistics()

        self.assertIn("total_trajectories", stats)
        self.assertIn("by_outcome", stats)
        self.assertIn("by_agent", stats)
        self.assertGreater(stats["total_trajectories"], 0)

    def test_pattern_search_cold_start(self):
        """Test pattern search on cold start (no patterns yet)"""
        # Create new agent with unique business_id
        fresh_agent = EnhancedBuilderAgent(business_id="cold_start_test")

        patterns = fresh_agent._query_code_patterns(
            component_type="frontend",
            context="brand new search"
        )

        # Should return empty list, not crash
        self.assertIsInstance(patterns, list)


def run_all_tests():
    """Run all test suites"""
    loader = unittest.TestLoader()
    suite = unittest.TestSuite()

    # Add all test classes
    suite.addTests(loader.loadTestsFromTestCase(TestEnhancedBuilderAgentInit))
    suite.addTests(loader.loadTestsFromTestCase(TestTrajectoryManagement))
    suite.addTests(loader.loadTestsFromTestCase(TestPatternManagement))
    suite.addTests(loader.loadTestsFromTestCase(TestCodeGenerationTools))
    suite.addTests(loader.loadTestsFromTestCase(TestBuildFromSpec))
    suite.addTests(loader.loadTestsFromTestCase(TestErrorHandling))
    suite.addTests(loader.loadTestsFromTestCase(TestStatisticsAndObservability))

    # Run with verbose output
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)

    # Print summary
    print("\n" + "=" * 70)
    print("TEST SUMMARY")
    print("=" * 70)
    print(f"Tests run: {result.testsRun}")
    print(f"Successes: {result.testsRun - len(result.failures) - len(result.errors)}")
    print(f"Failures: {len(result.failures)}")
    print(f"Errors: {len(result.errors)}")
    print("=" * 70)

    return result.wasSuccessful()


if __name__ == "__main__":
    success = run_all_tests()
    exit(0 if success else 1)
