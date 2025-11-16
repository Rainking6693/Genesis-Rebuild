"""
Test suite for DeepEyesV2 Phase 2 - Cold-Start SFT

Tests TrainingExample, TrajectoryCollector, SFTDataset, and ColdStartTrainer classes.
Demonstrates integration with Phase 1 BaselineTracker.
"""

import asyncio
import json
import pytest
from pathlib import Path
from datetime import datetime, timezone

from infrastructure.deepeyesv2 import (
    BaselineTracker,
    ToolInvocation,
    ToolStatus,
    TrainingExample,
    TrajectoryCollector,
    SFTDataset,
    ColdStartTrainer,
    run_deepeyesv2_sft,
)


class TestTrainingExample:
    """Test TrainingExample dataclass."""

    def test_training_example_creation(self):
        """Test creating a valid training example."""
        example = TrainingExample(
            task_description="Query database and cache results",
            tool_sequence=["database_query", "cache_set"],
            tool_parameters=[
                {"operation": "select", "timeout_seconds": 5},
                {"ttl_seconds": 3600, "value_size_kb": 100},
            ],
            expected_result="Results cached successfully",
            success_label=True,
            agent_name="TestAgent",
            difficulty_level="medium",
        )

        assert example.sequence_length == 2
        assert example.success_label is True
        assert example.agent_name == "TestAgent"
        assert example.difficulty_level == "medium"

    def test_training_example_to_dict(self):
        """Test converting training example to dictionary."""
        example = TrainingExample(
            task_description="Test task",
            tool_sequence=["test_tool"],
            tool_parameters=[{"param": "value"}],
            expected_result="Expected output",
            success_label=True,
            agent_name="TestAgent",
        )

        data = example.to_dict()
        assert data["task_description"] == "Test task"
        assert data["tool_sequence"] == ["test_tool"]
        assert data["success_label"] is True

    def test_training_example_to_training_format(self):
        """Test converting to model training format."""
        example = TrainingExample(
            task_description="Call API and process response",
            tool_sequence=["anthropic_api"],
            tool_parameters=[{"model": "claude-3-5-haiku-20241022", "max_tokens": 100}],
            expected_result="API response received",
            success_label=True,
            agent_name="ContentAgent",
        )

        fmt = example.to_training_format()
        assert "task_id" in fmt
        assert "prompt" in fmt
        assert "completion" in fmt
        assert "metadata" in fmt
        assert fmt["metadata"]["success"] is True

    def test_training_example_validation_success(self):
        """Test validation of valid training example."""
        example = TrainingExample(
            task_description="Valid task description with sufficient length",
            tool_sequence=["tool1", "tool2"],
            tool_parameters=[{"a": 1}, {"b": 2}],
            expected_result="Expected output with sufficient detail",
            success_label=True,
            agent_name="ValidAgent",
        )

        is_valid, errors = example.validate()
        assert is_valid is True
        assert len(errors) == 0

    def test_training_example_validation_failure(self):
        """Test validation of invalid training example."""
        example = TrainingExample(
            task_description="",  # Invalid: empty
            tool_sequence=["tool1"],
            tool_parameters=[{"a": 1}, {"b": 2}],  # Mismatch: 1 tool, 2 params
            expected_result="",  # Invalid: empty
            success_label=True,
            agent_name="TestAgent",
        )

        is_valid, errors = example.validate()
        assert is_valid is False
        assert len(errors) > 0


class TestTrajectoryCollector:
    """Test TrajectoryCollector class."""

    @pytest.fixture
    def baseline_tracker(self):
        """Create a tracker with sample invocations."""
        tracker = BaselineTracker(output_dir=Path("/tmp/test_deepeyesv2"))

        # Add successful invocations
        for i in range(5):
            inv = ToolInvocation(
                tool_name="database_query",
                agent_name="TestAgent",
                parameters={"operation": "select"},
                result={"rows": 10},
                status=ToolStatus.SUCCESS,
                latency_ms=50.0,
            )
            tracker.record_invocation(inv)

        # Add some failures
        for i in range(2):
            inv = ToolInvocation(
                tool_name="stripe_payment",
                agent_name="TestAgent",
                parameters={"action": "charge"},
                result=None,
                status=ToolStatus.FAILURE,
                latency_ms=100.0,
                error_msg="Invalid card",
            )
            tracker.record_invocation(inv)

        return tracker

    @pytest.mark.asyncio
    async def test_collect_trajectories(self, baseline_tracker):
        """Test collecting trajectories from tracker."""
        collector = TrajectoryCollector(output_dir=Path("/tmp/test_sft"))
        trajectories = await collector.collect_trajectories(baseline_tracker)

        assert len(trajectories) > 0
        assert all("tool_sequence" in t for t in trajectories)
        assert all("agent_name" in t for t in trajectories)

    @pytest.mark.asyncio
    async def test_filter_quality(self, baseline_tracker):
        """Test filtering high-quality trajectories."""
        collector = TrajectoryCollector(
            quality_threshold=0.80,
            output_dir=Path("/tmp/test_sft"),
        )
        await collector.collect_trajectories(baseline_tracker)
        filtered = await collector.filter_quality()

        # Filtered should have fewer trajectories
        assert len(filtered) <= len(collector.collected_trajectories)

    @pytest.mark.asyncio
    async def test_generate_training_examples(self, baseline_tracker):
        """Test generating training examples from trajectories."""
        collector = TrajectoryCollector(output_dir=Path("/tmp/test_sft"))
        await collector.collect_trajectories(baseline_tracker)
        await collector.filter_quality()
        examples = await collector.generate_training_examples()

        assert len(examples) > 0
        assert all(isinstance(ex, TrainingExample) for ex in examples)
        assert all(ex.agent_name == "TestAgent" for ex in examples)


class TestSFTDataset:
    """Test SFTDataset class."""

    @pytest.fixture
    def training_examples(self):
        """Create sample training examples."""
        examples = []
        for i in range(100):
            examples.append(
                TrainingExample(
                    task_description=f"Task {i}: Perform tool sequence",
                    tool_sequence=["tool_a", "tool_b"] if i % 2 == 0 else ["tool_c"],
                    tool_parameters=[{"param": f"value_{j}"} for j in range(i % 3 + 1)],
                    expected_result=f"Result {i}",
                    success_label=(i % 10) != 0,  # 90% success
                    agent_name="TestAgent",
                    difficulty_level=["easy", "medium", "hard"][i % 3],
                )
            )
        return examples

    @pytest.mark.asyncio
    async def test_split_data(self, training_examples):
        """Test splitting dataset into train/val/test."""
        dataset = SFTDataset(
            training_examples=training_examples,
            train_ratio=0.70,
            val_ratio=0.15,
            test_ratio=0.15,
        )

        splits = await dataset.split_data()

        assert "train" in splits
        assert "val" in splits
        assert "test" in splits
        assert len(splits["train"]) > len(splits["val"])
        assert len(splits["train"]) > len(splits["test"])

    @pytest.mark.asyncio
    async def test_balance_dataset(self, training_examples):
        """Test balancing dataset across tool types."""
        dataset = SFTDataset(training_examples=training_examples)
        await dataset.split_data()
        balanced = await dataset.balance_dataset()

        assert "train" in balanced
        assert "val" in balanced
        assert "test" in balanced

    @pytest.mark.asyncio
    async def test_export_jsonl(self, training_examples):
        """Test exporting dataset to JSONL."""
        dataset = SFTDataset(
            training_examples=training_examples,
            output_dir=Path("/tmp/test_sft"),
        )
        await dataset.split_data()

        export_file = await dataset.export_jsonl(split="train")

        assert export_file.exists()
        assert export_file.suffix == ".jsonl"

        # Verify JSONL format
        with export_file.open("r") as f:
            lines = f.readlines()
            assert len(lines) > 0
            # Parse first line as JSON
            data = json.loads(lines[0])
            assert "task_id" in data
            assert "prompt" in data

    @pytest.mark.asyncio
    async def test_get_dataset_stats(self, training_examples):
        """Test computing dataset statistics."""
        dataset = SFTDataset(training_examples=training_examples)
        await dataset.split_data()

        stats = await dataset.get_dataset_stats()

        assert "total_examples" in stats
        assert stats["total_examples"] == len(training_examples)
        assert "train" in stats
        assert "val" in stats
        assert "test" in stats
        assert "count" in stats["train"]


class TestColdStartTrainer:
    """Test ColdStartTrainer class."""

    @pytest.fixture
    def baseline_tracker(self):
        """Create tracker with sample data."""
        tracker = BaselineTracker(output_dir=Path("/tmp/test_deepeyesv2"))

        tools = ["api_call", "database_query", "cache_set", "cache_get"]
        agents = ["Agent1", "Agent2", "Agent3"]

        for tool in tools:
            for agent in agents:
                for i in range(10):
                    status = ToolStatus.SUCCESS if i < 9 else ToolStatus.FAILURE
                    inv = ToolInvocation(
                        tool_name=tool,
                        agent_name=agent,
                        parameters={"param": f"value_{i}"},
                        result={"success": True} if status == ToolStatus.SUCCESS else None,
                        status=status,
                        latency_ms=50.0 + i,
                    )
                    tracker.record_invocation(inv)

        return tracker

    @pytest.mark.asyncio
    async def test_prepare_training_data(self, baseline_tracker):
        """Test preparing training data from baseline tracker."""
        trainer = ColdStartTrainer(output_dir=Path("/tmp/test_sft"))
        dataset = await trainer.prepare_training_data(baseline_tracker)

        assert dataset is not None
        assert len(dataset.training_examples) > 0

    @pytest.mark.asyncio
    async def test_generate_prompts(self, baseline_tracker):
        """Test generating model-specific prompts."""
        trainer = ColdStartTrainer(output_dir=Path("/tmp/test_sft"))
        await trainer.prepare_training_data(baseline_tracker)

        prompts = await trainer.generate_prompts()

        assert "train" in prompts
        assert "val" in prompts
        assert "test" in prompts
        assert len(prompts["train"]) > 0

    @pytest.mark.asyncio
    async def test_train_model(self, baseline_tracker):
        """Test model training (simulated)."""
        trainer = ColdStartTrainer(output_dir=Path("/tmp/test_sft"))
        await trainer.prepare_training_data(baseline_tracker)

        results = await trainer.train_model(epochs=2)

        assert "model_id" in results
        assert "training_steps" in results
        assert results["training_steps"] > 0

    @pytest.mark.asyncio
    async def test_evaluate_improvement(self, baseline_tracker):
        """Test evaluating training improvement."""
        trainer = ColdStartTrainer(output_dir=Path("/tmp/test_sft"))
        await trainer.prepare_training_data(baseline_tracker)
        await trainer.train_model(epochs=1)

        evaluation = await trainer.evaluate_improvement()

        assert "baseline_success_rate" in evaluation
        assert "post_training_success_rate" in evaluation
        assert "improvement_pct" in evaluation
        assert "readiness_for_rl" in evaluation

    @pytest.mark.asyncio
    async def test_full_pipeline(self, baseline_tracker):
        """Test complete SFT pipeline."""
        trainer = ColdStartTrainer(output_dir=Path("/tmp/test_sft"))
        results = await trainer.run_full_pipeline(baseline_tracker)

        assert results["status"] == "success"
        assert "dataset_size" in results
        assert "training_results" in results
        assert "evaluation" in results
        assert "report_file" in results

    @pytest.mark.asyncio
    async def test_export_training_report(self, baseline_tracker):
        """Test exporting training report."""
        trainer = ColdStartTrainer(output_dir=Path("/tmp/test_sft"))
        await trainer.prepare_training_data(baseline_tracker)
        await trainer.train_model()

        report_file = await trainer.export_training_report()

        assert report_file.exists()
        assert report_file.suffix == ".json"

        with report_file.open("r") as f:
            report = json.load(f)
            assert "timestamp" in report
            assert "phase" in report
            assert report["phase"] == "Phase 2 - Cold-Start SFT"


class TestIntegration:
    """Integration tests for Phase 1 + Phase 2 pipeline."""

    @pytest.mark.asyncio
    async def test_baseline_to_sft_pipeline(self):
        """Test complete pipeline from baseline measurement to SFT."""
        from infrastructure.deepeyesv2 import run_deepeyesv2_baseline

        # Create baseline tracker with test data
        tracker = BaselineTracker(output_dir=Path("/tmp/test_integration"))

        # Simulate baseline invocations
        for tool_name in ["api_call", "database_query", "cache_set"]:
            for i in range(10):
                inv = ToolInvocation(
                    tool_name=tool_name,
                    agent_name="TestAgent",
                    parameters={"param": "value"},
                    result={"data": "result"},
                    status=ToolStatus.SUCCESS if i < 9 else ToolStatus.FAILURE,
                    latency_ms=50.0,
                )
                tracker.record_invocation(inv)

        # Run SFT pipeline
        results = await run_deepeyesv2_sft(tracker, output_dir=Path("/tmp/test_sft"))

        assert results["status"] == "success"
        assert results["dataset_size"] > 0
        assert "training_results" in results
        assert "evaluation" in results


if __name__ == "__main__":
    # Run tests with: pytest tests/test_deepeyesv2_sft.py -v
    pytest.main([__file__, "-v"])
