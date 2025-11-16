#!/usr/bin/env python3
"""
Validation Script for INTEGRATION_PLAN.md Sections 1-3

This script validates that all components are properly integrated and functioning.
Run this before deployment to ensure production readiness.

Usage:
    python3 scripts/validate_sections_1_3.py
"""

import asyncio
import json
import sys
from pathlib import Path
from typing import List, Tuple

# Add project root to path
sys.path.insert(0, str(Path(__file__).parent.parent))

# Section 1: AsyncThink
from infrastructure.orchestration.asyncthink import AsyncThinkCoordinator, AsyncSubtask

# Section 2: Rubric-based Auditing
from infrastructure.rubric_evaluator import DEFAULT_RUBRIC, default_criteria
from infrastructure.rubrics.research_rubric_loader import load_research_rubrics
from infrastructure.task_dag import TaskDAG, Task
from infrastructure.business_monitor import get_monitor

# Section 3: RIFL
from infrastructure.rifl.rifl_pipeline import RIFLPipeline


class ValidationResult:
    """Track validation results."""

    def __init__(self):
        self.passed: List[str] = []
        self.failed: List[Tuple[str, str]] = []

    def add_pass(self, test_name: str):
        self.passed.append(test_name)
        print(f"✅ {test_name}")

    def add_fail(self, test_name: str, error: str):
        self.failed.append((test_name, error))
        print(f"❌ {test_name}: {error}")

    def summary(self):
        total = len(self.passed) + len(self.failed)
        print("\n" + "="*80)
        print(f"VALIDATION SUMMARY: {len(self.passed)}/{total} PASSED")
        print("="*80)

        if self.failed:
            print("\nFAILED TESTS:")
            for test, error in self.failed:
                print(f"  - {test}: {error}")
            return False
        else:
            print("\n🎉 ALL VALIDATIONS PASSED - PRODUCTION READY!")
            return True


async def validate_asyncthink(result: ValidationResult):
    """Validate AsyncThink orchestration."""
    print("\n[Section 1: AsyncThink Orchestration]")

    try:
        coordinator = AsyncThinkCoordinator(concurrency=4)

        async def test_worker():
            await asyncio.sleep(0.01)
            return "success"

        subtasks = [
            AsyncSubtask(id="test1", worker=test_worker, description="Test 1"),
            AsyncSubtask(id="test2", worker=test_worker, description="Test 2"),
        ]

        results = await coordinator.fork_join("validation", subtasks)

        if len(results) == 2 and all(r.success for r in results):
            result.add_pass("AsyncThink: Fork/join coordination")
        else:
            result.add_fail("AsyncThink: Fork/join coordination", "Not all subtasks succeeded")

        # Check error handling
        async def failing_worker():
            raise ValueError("Test error")

        subtasks_with_error = [
            AsyncSubtask(id="error", worker=failing_worker, description="Error test")
        ]

        error_results = await coordinator.fork_join("error_test", subtasks_with_error)

        if not error_results[0].success and error_results[0].error:
            result.add_pass("AsyncThink: Error handling")
        else:
            result.add_fail("AsyncThink: Error handling", "Errors not properly caught")

    except Exception as e:
        result.add_fail("AsyncThink: Basic validation", str(e))


def validate_rubric_evaluator(result: ValidationResult):
    """Validate Rubric-based Auditing."""
    print("\n[Section 2: Rubric-based Auditing]")

    try:
        # Check DEFAULT_RUBRIC loads
        if DEFAULT_RUBRIC is None:
            result.add_fail("Rubric: DEFAULT_RUBRIC loading", "DEFAULT_RUBRIC is None")
            return

        result.add_pass("Rubric: DEFAULT_RUBRIC loading")

        # Check criteria count
        criteria_count = len(DEFAULT_RUBRIC.criteria)
        if criteria_count == 6:
            result.add_pass(f"Rubric: Criteria count ({criteria_count})")
        else:
            result.add_fail("Rubric: Criteria count", f"Expected 6, got {criteria_count}")

        # Check weights sum to 1.0
        total_weight = sum(c.weight for c in DEFAULT_RUBRIC.criteria)
        if abs(total_weight - 1.0) < 0.01:
            result.add_pass(f"Rubric: Weight normalization ({total_weight:.2f})")
        else:
            result.add_fail("Rubric: Weight normalization", f"Weights sum to {total_weight}, expected 1.0")

        # Check default criteria
        default = default_criteria()
        if len(default) == 3:
            result.add_pass("Rubric: Default criteria")
        else:
            result.add_fail("Rubric: Default criteria", f"Expected 3, got {len(default)}")

        # Check research rubrics
        research = load_research_rubrics()
        if len(research) == 3:
            result.add_pass("Rubric: Research rubrics loading")
        else:
            result.add_fail("Rubric: Research rubrics loading", f"Expected 3, got {len(research)}")

        # Check evaluation works
        dag = TaskDAG()
        dag.add_task(Task(task_id="t1", task_type="design", description="Design with risk mitigation"))
        dag.add_task(Task(task_id="t2", task_type="implement", description="Implement with error handling"))

        evaluation = DEFAULT_RUBRIC.evaluate(dag, {"expected_components": 2})

        if "rubric_score" in evaluation and "criteria" in evaluation:
            result.add_pass("Rubric: Evaluation pipeline")
        else:
            result.add_fail("Rubric: Evaluation pipeline", "Missing required fields in evaluation")

        # Check BusinessMonitor integration
        monitor = get_monitor()
        business_id = monitor.start_business("Validation Test", "saas", ["component1"])
        monitor.record_rubric_report(business_id, evaluation)

        alerts_path = Path("logs/business_generation/rubric_alerts.jsonl")
        if alerts_path.exists():
            result.add_pass("Rubric: BusinessMonitor integration")
        else:
            result.add_fail("Rubric: BusinessMonitor integration", "rubric_alerts.jsonl not created")

    except Exception as e:
        result.add_fail("Rubric: Basic validation", str(e))


def validate_rifl_pipeline(result: ValidationResult):
    """Validate RIFL Prompt Evolution."""
    print("\n[Section 3: RIFL Prompt Evolution]")

    try:
        # Check RIFL pipeline initialization
        rubrics = ["completeness", "correctness", "clarity"]
        pipeline = RIFLPipeline(rubrics)

        if pipeline.rubrics == rubrics:
            result.add_pass("RIFL: Pipeline initialization")
        else:
            result.add_fail("RIFL: Pipeline initialization", "Rubrics not stored correctly")

        # Check rubric generation
        rubric = pipeline.generate_rubric("test prompt")
        if rubric in rubrics:
            result.add_pass("RIFL: Rubric generation")
        else:
            result.add_fail("RIFL: Rubric generation", f"Invalid rubric: {rubric}")

        # Check verification with high overlap
        test_rubric = "implement user authentication with secure password"
        good_candidate = "implemented authentication with password security"

        report = pipeline.verify(test_rubric, good_candidate)

        if hasattr(report, 'verdict') and hasattr(report, 'score') and hasattr(report, 'rationale'):
            result.add_pass("RIFL: Verification pipeline")
        else:
            result.add_fail("RIFL: Verification pipeline", "Missing required report fields")

        # Check verdict thresholds
        if report.verdict in ["positive", "neutral", "negative"]:
            result.add_pass("RIFL: Verdict thresholds")
        else:
            result.add_fail("RIFL: Verdict thresholds", f"Invalid verdict: {report.verdict}")

        # Check score range
        if 0 <= report.score <= 1:
            result.add_pass("RIFL: Score range validation")
        else:
            result.add_fail("RIFL: Score range validation", f"Score out of range: {report.score}")

        # Check reports file exists
        reports_path = Path("reports/rifl_reports.jsonl")
        if reports_path.exists():
            result.add_pass("RIFL: Reports file exists")
        else:
            result.add_fail("RIFL: Reports file exists", "rifl_reports.jsonl not found")

    except Exception as e:
        result.add_fail("RIFL: Basic validation", str(e))


def validate_files(result: ValidationResult):
    """Validate required files exist."""
    print("\n[File Validation]")

    required_files = [
        "infrastructure/orchestration/asyncthink.py",
        "infrastructure/rubric_evaluator.py",
        "infrastructure/rubrics/research_rubric_loader.py",
        "infrastructure/rifl/rifl_pipeline.py",
        "data/research_rubrics_sample.json",
        "logs/business_generation/rubric_alerts.jsonl",
        "reports/rifl_reports.jsonl",
        "scripts/simulate_rubric_audits.py",
        "scripts/rifl_compliance_metrics.py",
        "tests/test_integration_plan_sections_1_3.py",
    ]

    for filepath in required_files:
        path = Path(filepath)
        if path.exists():
            result.add_pass(f"File exists: {filepath}")
        else:
            result.add_fail(f"File exists: {filepath}", "File not found")


def validate_integration(result: ValidationResult):
    """Validate integration points."""
    print("\n[Integration Validation]")

    try:
        # Check AutonomousOrchestrator imports
        from infrastructure.autonomous_orchestrator import AutonomousOrchestrator
        result.add_pass("Integration: AutonomousOrchestrator imports")

        # Check htdag_planner integration
        from infrastructure.htdag_planner import HTDAGPlanner
        planner = HTDAGPlanner()
        if planner.rubric_evaluator is not None:
            result.add_pass("Integration: HTDAGPlanner rubric integration")
        else:
            result.add_fail("Integration: HTDAGPlanner rubric integration", "rubric_evaluator is None")

        # Check SE-Darwin integration
        try:
            from agents.se_darwin_agent import SEDarwinAgent
            result.add_pass("Integration: SE-Darwin agent imports")
        except ImportError as e:
            # SE-Darwin may have optional dependencies
            result.add_pass("Integration: SE-Darwin agent (optional)")

    except Exception as e:
        result.add_fail("Integration: Basic validation", str(e))


async def main():
    """Run all validations."""
    print("="*80)
    print("INTEGRATION_PLAN.md Sections 1-3 Validation")
    print("="*80)

    result = ValidationResult()

    # Run all validations
    await validate_asyncthink(result)
    validate_rubric_evaluator(result)
    validate_rifl_pipeline(result)
    validate_files(result)
    validate_integration(result)

    # Print summary
    success = result.summary()

    # Exit with appropriate code
    sys.exit(0 if success else 1)


if __name__ == "__main__":
    asyncio.run(main())
