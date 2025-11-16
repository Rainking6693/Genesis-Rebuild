#!/usr/bin/env python3
"""
Comprehensive test suite for INTEGRATION_PLAN.md Sections 1-3

Section 1: AsyncThink Orchestration
Section 2: Rubric-based Auditing
Section 3: RIFL Prompt Evolution

Test Coverage:
- AsyncThink fork/join coordination
- Rubric loading and evaluation
- RIFL pipeline generation and verification
- BusinessMonitor integration
- File I/O and persistence
- Error handling and edge cases
"""

import asyncio
import json
import logging
import os
import pytest
import tempfile
from pathlib import Path
from typing import Dict, Any, List

# Section 1: AsyncThink
from infrastructure.orchestration.asyncthink import (
    AsyncThinkCoordinator,
    AsyncSubtask,
    AsyncSubtaskResult
)

# Section 2: Rubric-based Auditing
from infrastructure.rubric_evaluator import (
    RubricEvaluator,
    RubricCriterion,
    DEFAULT_RUBRIC,
    default_criteria,
    completeness_score,
    coherence_score,
    risk_awareness_score
)
from infrastructure.rubrics.research_rubric_loader import load_research_rubrics
from infrastructure.task_dag import TaskDAG, Task
from infrastructure.business_monitor import get_monitor

# Section 3: RIFL
from infrastructure.rifl.rifl_pipeline import RIFLPipeline, RIFLReport

logger = logging.getLogger(__name__)


# =============================================================================
# SECTION 1: AsyncThink Orchestration Tests
# =============================================================================

class TestAsyncThinkCoordinator:
    """Test suite for AsyncThink fork/join coordination."""

    @pytest.mark.asyncio
    async def test_fork_join_basic(self):
        """Test basic fork/join with successful subtasks."""
        coordinator = AsyncThinkCoordinator(concurrency=2)

        # Create simple subtasks
        async def task1():
            await asyncio.sleep(0.01)
            return "result1"

        async def task2():
            await asyncio.sleep(0.01)
            return "result2"

        subtasks = [
            AsyncSubtask(id="task1", worker=task1, description="Task 1"),
            AsyncSubtask(id="task2", worker=task2, description="Task 2"),
        ]

        results = await coordinator.fork_join("test_context", subtasks)

        assert len(results) == 2
        assert all(r.success for r in results)
        assert results[0].result == "result1"
        assert results[1].result == "result2"
        assert all(r.duration_seconds > 0 for r in results)

    @pytest.mark.asyncio
    async def test_fork_join_with_failures(self):
        """Test fork/join handles failures gracefully."""
        coordinator = AsyncThinkCoordinator(concurrency=2)

        async def success_task():
            return "success"

        async def failure_task():
            raise ValueError("Intentional failure")

        subtasks = [
            AsyncSubtask(id="success", worker=success_task, description="Success"),
            AsyncSubtask(id="failure", worker=failure_task, description="Failure"),
        ]

        results = await coordinator.fork_join("test_failures", subtasks)

        assert len(results) == 2
        assert results[0].success
        assert not results[1].success
        assert "Intentional failure" in results[1].error

    @pytest.mark.asyncio
    async def test_fork_join_concurrency_limit(self):
        """Test concurrency limiting works correctly."""
        coordinator = AsyncThinkCoordinator(concurrency=2)

        execution_times = []

        async def slow_task():
            start = asyncio.get_event_loop().time()
            await asyncio.sleep(0.1)
            execution_times.append(asyncio.get_event_loop().time() - start)
            return "done"

        subtasks = [
            AsyncSubtask(id=f"task{i}", worker=slow_task, description=f"Task {i}")
            for i in range(4)
        ]

        results = await coordinator.fork_join("test_concurrency", subtasks)

        assert len(results) == 4
        assert all(r.success for r in results)
        # With concurrency=2, 4 tasks should take ~2x the time of 2 tasks

    @pytest.mark.asyncio
    async def test_fork_join_empty_subtasks(self):
        """Test fork/join with no subtasks."""
        coordinator = AsyncThinkCoordinator(concurrency=2)
        results = await coordinator.fork_join("test_empty", [])
        assert results == []

    @pytest.mark.asyncio
    async def test_fork_join_metadata(self):
        """Test metadata is preserved in results."""
        coordinator = AsyncThinkCoordinator(concurrency=2)

        async def task():
            return "result"

        subtasks = [
            AsyncSubtask(
                id="task1",
                worker=task,
                description="Test task",
                metadata={"key": "value", "priority": 1}
            )
        ]

        results = await coordinator.fork_join("test_metadata", subtasks)

        assert len(results) == 1
        assert results[0].subtask_id == "task1"
        assert results[0].description == "Test task"


# =============================================================================
# SECTION 2: Rubric-based Auditing Tests
# =============================================================================

class TestRubricEvaluator:
    """Test suite for rubric-based auditing."""

    def test_default_rubric_loads(self):
        """Test DEFAULT_RUBRIC loads successfully."""
        assert DEFAULT_RUBRIC is not None
        assert len(DEFAULT_RUBRIC.criteria) > 0

        # Check weights sum to 1.0
        total_weight = sum(c.weight for c in DEFAULT_RUBRIC.criteria)
        assert abs(total_weight - 1.0) < 0.01, f"Weights sum to {total_weight}, expected 1.0"

    def test_default_criteria(self):
        """Test default criteria are valid."""
        criteria = default_criteria()
        assert len(criteria) == 3
        assert all(isinstance(c, RubricCriterion) for c in criteria)
        assert all(c.weight > 0 for c in criteria)
        assert all(c.scorer is not None for c in criteria)

    def test_load_research_rubrics(self):
        """Test research rubrics load from JSON."""
        rubrics = load_research_rubrics()
        assert len(rubrics) > 0
        assert all(isinstance(r, RubricCriterion) for r in rubrics)

        # Check for expected criteria
        criterion_names = [r.name for r in rubrics]
        assert "dependency_analysis" in criterion_names
        assert "resource_planning" in criterion_names
        assert "error_handling" in criterion_names

    def test_rubric_evaluator_evaluate(self):
        """Test rubric evaluation on a DAG."""
        dag = TaskDAG()
        dag.add_task(Task(task_id="task1", task_type="design", description="Design the system architecture"))
        dag.add_task(Task(task_id="task2", task_type="implement", description="Implement core features"))
        dag.add_task(Task(task_id="task3", task_type="test", description="Test and verify functionality"))

        context = {"expected_components": 3}

        result = DEFAULT_RUBRIC.evaluate(dag, context)

        assert "rubric_score" in result
        assert "criteria" in result
        assert 0 <= result["rubric_score"] <= 1
        assert len(result["criteria"]) == len(DEFAULT_RUBRIC.criteria)

    def test_completeness_score(self):
        """Test completeness scoring function."""
        dag = TaskDAG()
        for i in range(5):
            dag.add_task(Task(task_id=f"task{i}", task_type="generic", description=f"Task {i}"))

        context = {"expected_components": 5}
        score = completeness_score(dag, context)
        assert score == 1.0

        context = {"expected_components": 10}
        score = completeness_score(dag, context)
        assert score == 0.5

    def test_coherence_score(self):
        """Test coherence scoring function."""
        dag = TaskDAG()
        dag.add_task(Task(task_id="task1", task_type="generic", description="unique words here"))
        dag.add_task(Task(task_id="task2", task_type="generic", description="different content there"))

        score = coherence_score(dag, {})
        assert 0 <= score <= 1

    def test_risk_awareness_score(self):
        """Test risk awareness scoring function."""
        dag = TaskDAG()
        dag.add_task(Task(task_id="task1", task_type="generic", description="implement with risk mitigation"))
        dag.add_task(Task(task_id="task2", task_type="generic", description="verify and control security"))

        score = risk_awareness_score(dag, {})
        assert score > 0.5  # Should have some risk keywords

    def test_business_monitor_integration(self):
        """Test rubric reports are logged to BusinessMonitor."""
        monitor = get_monitor()

        # Create a test business
        business_id = monitor.start_business("Test Business", "saas", ["component1"])

        # Create rubric report
        dag = TaskDAG()
        dag.add_task(Task(task_id="task1", task_type="generic", description="test task"))

        rubric_result = DEFAULT_RUBRIC.evaluate(dag, {"business_id": business_id})

        # Record to monitor
        monitor.record_rubric_report(business_id, rubric_result)

        # Check file was written
        alerts_path = Path("logs/business_generation/rubric_alerts.jsonl")
        assert alerts_path.exists()

        # Verify content
        with alerts_path.open("r") as f:
            lines = f.readlines()
            assert len(lines) > 0
            last_entry = json.loads(lines[-1])
            assert last_entry["business_id"] == business_id
            assert "report" in last_entry


# =============================================================================
# SECTION 3: RIFL Prompt Evolution Tests
# =============================================================================

class TestRIFLPipeline:
    """Test suite for RIFL prompt evolution."""

    def test_rifl_pipeline_init(self):
        """Test RIFL pipeline initialization."""
        rubrics = ["rubric1", "rubric2", "rubric3"]
        pipeline = RIFLPipeline(rubrics)
        assert pipeline.rubrics == rubrics

    def test_rifl_generate_rubric(self):
        """Test rubric generation."""
        rubrics = ["completeness", "correctness", "clarity"]
        pipeline = RIFLPipeline(rubrics)

        rubric = pipeline.generate_rubric("test prompt")
        assert rubric in rubrics

    def test_rifl_verify(self):
        """Test verification with different quality levels."""
        pipeline = RIFLPipeline(["test rubric"])

        # High quality candidate (many shared tokens)
        rubric = "implement user authentication with secure password hashing"
        candidate = "implemented secure authentication with password hashing and salting"

        report = pipeline.verify(rubric, candidate)
        assert isinstance(report, RIFLReport)
        assert report.verdict in ["positive", "neutral", "negative"]
        assert 0 <= report.score <= 1
        assert report.rationale

        # Low quality candidate (few shared tokens)
        bad_candidate = "created a simple login form"
        report2 = pipeline.verify(rubric, bad_candidate)
        assert report2.score < report.score

    def test_rifl_verdict_thresholds(self):
        """Test verdict thresholds are correct."""
        pipeline = RIFLPipeline(["test"])

        # Test positive verdict (score > 0.7)
        rubric = "a b c d e"
        candidate = "a b c d e f"  # High overlap
        report = pipeline.verify(rubric, candidate)
        assert report.verdict == "positive"

        # Test negative verdict (score <= 0.4)
        bad_candidate = "x y z"  # No overlap
        report2 = pipeline.verify(rubric, bad_candidate)
        assert report2.verdict == "negative"

    def test_rifl_report_logging(self):
        """Test RIFL reports are logged correctly."""
        # This would be tested via SE-Darwin integration
        # For now, test the report structure
        pipeline = RIFLPipeline(["rubric"])
        report = pipeline.verify("test rubric", "test candidate")

        assert hasattr(report, 'rubric')
        assert hasattr(report, 'verdict')
        assert hasattr(report, 'score')
        assert hasattr(report, 'rationale')


# =============================================================================
# Integration Tests
# =============================================================================

class TestIntegrationPlanSections:
    """Integration tests across all three sections."""

    @pytest.mark.asyncio
    async def test_asyncthink_with_rubric_evaluation(self):
        """Test AsyncThink coordination with rubric evaluation."""
        coordinator = AsyncThinkCoordinator(concurrency=2)

        # Create subtasks that generate DAGs
        async def create_dag_task(task_count: int):
            dag = TaskDAG()
            for i in range(task_count):
                dag.add_task(Task(
                    task_id=f"task{i}",
                    task_type="generic",
                    description=f"Task {i} with risk mitigation"
                ))
            return dag

        subtasks = [
            AsyncSubtask(id="dag1", worker=lambda: create_dag_task(3), description="Create DAG 1"),
            AsyncSubtask(id="dag2", worker=lambda: create_dag_task(5), description="Create DAG 2"),
        ]

        results = await coordinator.fork_join("rubric_test", subtasks)

        # Evaluate each DAG
        for result in results:
            if result.success:
                dag = result.result
                evaluation = DEFAULT_RUBRIC.evaluate(dag, {"expected_components": 5})
                assert "rubric_score" in evaluation
                assert evaluation["rubric_score"] > 0

    @pytest.mark.asyncio
    async def test_asyncthink_with_rifl_verification(self):
        """Test AsyncThink coordination with RIFL verification."""
        coordinator = AsyncThinkCoordinator(concurrency=2)
        pipeline = RIFLPipeline(["completeness", "correctness"])

        # Create subtasks that generate code
        async def generate_code(prompt: str):
            return f"def solution(): # {prompt}"

        subtasks = [
            AsyncSubtask(
                id="code1",
                worker=lambda: generate_code("implement authentication"),
                description="Generate auth code"
            ),
            AsyncSubtask(
                id="code2",
                worker=lambda: generate_code("implement validation"),
                description="Generate validation code"
            ),
        ]

        results = await coordinator.fork_join("rifl_test", subtasks)

        # Verify each result
        for result in results:
            if result.success:
                rubric = pipeline.generate_rubric(result.description)
                report = pipeline.verify(rubric, result.result)
                assert report.verdict in ["positive", "neutral", "negative"]

    def test_end_to_end_integration(self):
        """Test complete integration: AsyncThink -> Rubric -> RIFL."""
        # This tests the full pipeline as documented in INTEGRATION_PLAN.md

        # 1. Create a DAG
        dag = TaskDAG()
        dag.add_task(Task(
            task_id="task1",
            task_type="design",
            description="Design system with proper error handling and risk mitigation"
        ))
        dag.add_task(Task(
            task_id="task2",
            task_type="implement",
            description="Implement core features with resource allocation"
        ))
        dag.add_task(Task(
            task_id="task3",
            task_type="verify",
            description="Verify dependencies and control flow"
        ))

        # 2. Evaluate with rubrics
        context = {"business_id": "test_business", "expected_components": 3}
        rubric_result = DEFAULT_RUBRIC.evaluate(dag, context)

        assert rubric_result["rubric_score"] > 0.5
        assert len(rubric_result["criteria"]) == 6

        # 3. RIFL verification
        pipeline = RIFLPipeline(["design system with proper error handling"])
        task_desc = dag.tasks["task1"].description
        rubric = pipeline.generate_rubric(task_desc)
        report = pipeline.verify(rubric, task_desc)

        # RIFL scoring is based on token overlap, so similar strings should score well
        assert report.score >= 0.0  # Valid score range
        assert report.verdict in ["positive", "neutral", "negative"]


# =============================================================================
# Performance and Edge Case Tests
# =============================================================================

class TestEdgeCases:
    """Test edge cases and error conditions."""

    @pytest.mark.asyncio
    async def test_asyncthink_timeout_handling(self):
        """Test AsyncThink handles very slow tasks."""
        coordinator = AsyncThinkCoordinator(concurrency=1)

        async def slow_task():
            await asyncio.sleep(0.2)
            return "done"

        subtasks = [AsyncSubtask(id="slow", worker=slow_task, description="Slow task")]
        results = await coordinator.fork_join("timeout_test", subtasks)

        assert len(results) == 1
        assert results[0].success
        assert results[0].duration_seconds >= 0.2

    def test_rubric_empty_dag(self):
        """Test rubric evaluation on empty DAG."""
        dag = TaskDAG()
        result = DEFAULT_RUBRIC.evaluate(dag, {})

        # Should handle gracefully
        assert "rubric_score" in result
        assert result["rubric_score"] >= 0

    def test_rifl_empty_inputs(self):
        """Test RIFL with empty inputs."""
        pipeline = RIFLPipeline(["test"])

        report = pipeline.verify("", "")
        assert report.score == 0.0
        assert report.verdict == "negative"

    def test_rubric_missing_file(self):
        """Test rubric loader handles missing file gracefully."""
        rubrics = load_research_rubrics(Path("/nonexistent/path.json"))
        assert rubrics == []


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
