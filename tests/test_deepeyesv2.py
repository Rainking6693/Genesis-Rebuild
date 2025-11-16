"""
Comprehensive test suite for DeepEyesV2 Phase 1 & 2
Audit Protocol V2 compliance testing
"""

import asyncio
import json
import tempfile
import time
from pathlib import Path
from typing import Dict, Any

import pytest

from infrastructure.deepeyesv2 import (
    ToolStatus,
    ToolInvocation,
    ToolStats,
    BaselineTracker,
    ToolReliabilityMonitor,
    BaselineMeasurement,
    run_deepeyesv2_baseline,
)


class TestToolStatus:
    """Test ToolStatus enum (P0 - Critical)."""

    def test_tool_status_enum_values(self):
        """Verify all status enum values exist."""
        assert ToolStatus.SUCCESS.value == "success"
        assert ToolStatus.FAILURE.value == "failure"
        assert ToolStatus.TIMEOUT.value == "timeout"
        assert ToolStatus.PARTIAL.value == "partial"

    def test_tool_status_enum_count(self):
        """Verify enum has exactly 4 status types."""
        statuses = list(ToolStatus)
        assert len(statuses) == 4


class TestToolInvocation:
    """Test ToolInvocation dataclass (P0 - Critical)."""

    def test_tool_invocation_creation(self):
        """Test creating a basic ToolInvocation."""
        invocation = ToolInvocation(
            tool_name="test_tool",
            agent_name="TestAgent",
            parameters={"key": "value"},
            result="success_result",
            status=ToolStatus.SUCCESS,
            latency_ms=100.0,
        )
        assert invocation.tool_name == "test_tool"
        assert invocation.agent_name == "TestAgent"
        assert invocation.parameters == {"key": "value"}
        assert invocation.result == "success_result"
        assert invocation.status == ToolStatus.SUCCESS
        assert invocation.latency_ms == 100.0

    def test_tool_invocation_success_property(self):
        """Test success property."""
        inv_success = ToolInvocation(
            tool_name="test",
            agent_name="Agent",
            parameters={},
            result=None,
            status=ToolStatus.SUCCESS,
            latency_ms=10.0,
        )
        assert inv_success.success is True
        assert inv_success.is_successful() is True

        inv_failure = ToolInvocation(
            tool_name="test",
            agent_name="Agent",
            parameters={},
            result=None,
            status=ToolStatus.FAILURE,
            latency_ms=10.0,
            error_msg="Test error",
        )
        assert inv_failure.success is False
        assert inv_failure.is_successful() is False

    def test_tool_invocation_to_dict(self):
        """Test to_dict conversion."""
        invocation = ToolInvocation(
            tool_name="test_tool",
            agent_name="TestAgent",
            parameters={"key": "value"},
            result="result",
            status=ToolStatus.SUCCESS,
            latency_ms=50.0,
        )
        data = invocation.to_dict()
        assert data["tool_name"] == "test_tool"
        assert data["status"] == "success"
        assert data["latency_ms"] == 50.0
        assert "timestamp" in data
        assert "invocation_id" in data

    def test_tool_invocation_to_json(self):
        """Test JSON serialization."""
        invocation = ToolInvocation(
            tool_name="test_tool",
            agent_name="TestAgent",
            parameters={"key": "value"},
            result="result",
            status=ToolStatus.SUCCESS,
            latency_ms=50.0,
        )
        json_str = invocation.to_json()
        parsed = json.loads(json_str)
        assert parsed["tool_name"] == "test_tool"
        assert parsed["status"] == "success"

    def test_tool_invocation_all_status_types(self):
        """Test invocation with all status types."""
        for status in ToolStatus:
            invocation = ToolInvocation(
                tool_name="test",
                agent_name="Agent",
                parameters={},
                result=None if status != ToolStatus.SUCCESS else "result",
                status=status,
                latency_ms=10.0,
                error_msg=None if status == ToolStatus.SUCCESS else "error",
            )
            assert invocation.status == status
            assert invocation.success == (status == ToolStatus.SUCCESS)


class TestToolStats:
    """Test ToolStats dataclass (P0 - Critical)."""

    def test_tool_stats_creation(self):
        """Test creating ToolStats."""
        stats = ToolStats(tool_name="test_tool")
        assert stats.tool_name == "test_tool"
        assert stats.total_calls == 0
        assert stats.successful_calls == 0
        assert stats.latencies_ms == []

    def test_tool_stats_success_rate(self):
        """Test success rate calculation (P1 - Important)."""
        stats = ToolStats(tool_name="test_tool")
        assert stats.success_rate == 0.0  # No calls yet

        stats.total_calls = 10
        stats.successful_calls = 8
        assert stats.success_rate == 80.0

        stats.successful_calls = 10
        assert stats.success_rate == 100.0

    def test_tool_stats_failure_rate(self):
        """Test failure rate calculation."""
        stats = ToolStats(tool_name="test_tool")
        stats.total_calls = 10
        stats.successful_calls = 7
        assert stats.failure_rate == 30.0

    def test_tool_stats_latency_percentiles(self):
        """Test latency percentile calculation (P1 - Important)."""
        stats = ToolStats(tool_name="test_tool")
        stats.latencies_ms = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]

        p50 = stats.get_latency_percentile(50)
        assert p50 > 0
        p95 = stats.get_latency_percentile(95)
        assert p95 > p50
        p99 = stats.get_latency_percentile(99)
        assert p99 >= p95

    def test_tool_stats_mean_latency(self):
        """Test mean latency calculation."""
        stats = ToolStats(tool_name="test_tool")
        stats.latencies_ms = [10, 20, 30]
        mean = stats.get_mean_latency()
        assert mean == 20.0

    def test_tool_stats_stdev_latency(self):
        """Test standard deviation calculation."""
        stats = ToolStats(tool_name="test_tool")
        stats.latencies_ms = [10, 20, 30]
        stdev = stats.get_stdev_latency()
        assert stdev > 0

    def test_tool_stats_to_dict(self):
        """Test stats export to dictionary."""
        stats = ToolStats(tool_name="test_tool")
        stats.total_calls = 10
        stats.successful_calls = 8
        stats.latencies_ms = [50, 60, 70]
        stats.errors = {"timeout": 2}

        data = stats.to_dict()
        assert data["tool_name"] == "test_tool"
        assert data["total_calls"] == 10
        assert data["success_rate_pct"] == 80.0
        assert "latency_p50_ms" in data
        assert "top_errors" in data


class TestBaselineTracker:
    """Test BaselineTracker class (P1 - Critical)."""

    def test_baseline_tracker_creation(self):
        """Test BaselineTracker initialization."""
        with tempfile.TemporaryDirectory() as tmpdir:
            tracker = BaselineTracker(output_dir=Path(tmpdir))
            assert tracker.output_dir == Path(tmpdir)
            assert tracker.invocations == []
            assert tracker.tool_stats == {}

    def test_baseline_tracker_record_invocation(self):
        """Test recording invocations."""
        with tempfile.TemporaryDirectory() as tmpdir:
            tracker = BaselineTracker(output_dir=Path(tmpdir))

            invocation = ToolInvocation(
                tool_name="test_tool",
                agent_name="TestAgent",
                parameters={},
                result="success",
                status=ToolStatus.SUCCESS,
                latency_ms=50.0,
            )
            tracker.record_invocation(invocation)

            assert len(tracker.invocations) == 1
            assert "test_tool" in tracker.tool_stats

    def test_baseline_tracker_stats_aggregation(self):
        """Test stats aggregation (P1 - Important)."""
        with tempfile.TemporaryDirectory() as tmpdir:
            tracker = BaselineTracker(output_dir=Path(tmpdir))

            # Record successful invocations
            for i in range(8):
                invocation = ToolInvocation(
                    tool_name="test_tool",
                    agent_name="Agent",
                    parameters={},
                    result="success",
                    status=ToolStatus.SUCCESS,
                    latency_ms=50.0 + i,
                )
                tracker.record_invocation(invocation)

            # Record failures
            for i in range(2):
                invocation = ToolInvocation(
                    tool_name="test_tool",
                    agent_name="Agent",
                    parameters={},
                    result=None,
                    status=ToolStatus.FAILURE,
                    latency_ms=100.0,
                    error_msg="Test error",
                )
                tracker.record_invocation(invocation)

            stats = tracker.get_tool_stats("test_tool")
            assert stats.total_calls == 10
            assert stats.successful_calls == 8
            assert stats.failed_calls == 2
            assert stats.success_rate == 80.0

    def test_baseline_tracker_get_success_rate(self):
        """Test getting tool success rate."""
        with tempfile.TemporaryDirectory() as tmpdir:
            tracker = BaselineTracker(output_dir=Path(tmpdir))

            invocation = ToolInvocation(
                tool_name="test_tool",
                agent_name="Agent",
                parameters={},
                result="success",
                status=ToolStatus.SUCCESS,
                latency_ms=50.0,
            )
            tracker.record_invocation(invocation)

            rate = tracker.get_success_rate("test_tool")
            assert rate == 100.0

    def test_baseline_tracker_get_summary(self):
        """Test getting summary statistics."""
        with tempfile.TemporaryDirectory() as tmpdir:
            tracker = BaselineTracker(output_dir=Path(tmpdir))

            for i in range(5):
                invocation = ToolInvocation(
                    tool_name=f"tool_{i % 2}",
                    agent_name="Agent",
                    parameters={},
                    result="success",
                    status=ToolStatus.SUCCESS,
                    latency_ms=50.0,
                )
                tracker.record_invocation(invocation)

            summary = tracker.get_summary()
            assert summary["total_invocations"] == 5
            assert summary["successful_invocations"] == 5
            assert summary["unique_tools"] == 2
            assert "invocations_per_second" in summary

    def test_baseline_tracker_save_stats(self):
        """Test saving stats to file (P1 - File I/O)."""
        with tempfile.TemporaryDirectory() as tmpdir:
            tracker = BaselineTracker(output_dir=Path(tmpdir))

            invocation = ToolInvocation(
                tool_name="test_tool",
                agent_name="Agent",
                parameters={},
                result="success",
                status=ToolStatus.SUCCESS,
                latency_ms=50.0,
            )
            tracker.record_invocation(invocation)

            output_file = tracker.save_stats("test_stats.json")
            assert output_file.exists()

            with open(output_file, "r") as f:
                data = json.load(f)
                assert "summary" in data
                assert "tools" in data

    def test_baseline_tracker_jsonl_log(self):
        """Test JSONL logging to file (P1 - File I/O)."""
        with tempfile.TemporaryDirectory() as tmpdir:
            tracker = BaselineTracker(output_dir=Path(tmpdir))

            for i in range(3):
                invocation = ToolInvocation(
                    tool_name="test_tool",
                    agent_name="Agent",
                    parameters={},
                    result="success",
                    status=ToolStatus.SUCCESS,
                    latency_ms=50.0,
                )
                tracker.record_invocation(invocation)

            log_file = tracker.output_dir / "invocations.jsonl"
            assert log_file.exists()

            # Verify JSONL format
            with open(log_file, "r") as f:
                lines = f.readlines()
                assert len(lines) == 3
                for line in lines:
                    data = json.loads(line)
                    assert "tool_name" in data
                    assert "status" in data


class TestToolReliabilityMonitor:
    """Test ToolReliabilityMonitor class (P1 - Critical)."""

    def test_monitor_creation(self):
        """Test monitor initialization."""
        monitor = ToolReliabilityMonitor(success_rate_threshold=85.0)
        assert monitor.success_rate_threshold == 85.0
        assert isinstance(monitor.tracker, BaselineTracker)
        assert monitor.alerts == []

    def test_monitor_reliability_report(self):
        """Test reliability report generation."""
        monitor = ToolReliabilityMonitor(success_rate_threshold=80.0)

        # Add successful tool
        for i in range(10):
            invocation = ToolInvocation(
                tool_name="healthy_tool",
                agent_name="Agent",
                parameters={},
                result="success",
                status=ToolStatus.SUCCESS,
                latency_ms=50.0,
            )
            monitor.tracker.record_invocation(invocation)

        # Add at-risk tool
        for i in range(10):
            status = ToolStatus.SUCCESS if i < 8 else ToolStatus.FAILURE
            invocation = ToolInvocation(
                tool_name="at_risk_tool",
                agent_name="Agent",
                parameters={},
                result="success" if status == ToolStatus.SUCCESS else None,
                status=status,
                latency_ms=50.0,
                error_msg=None if status == ToolStatus.SUCCESS else "error",
            )
            monitor.tracker.record_invocation(invocation)

        report = monitor.get_reliability_report()
        assert "healthy_tools" in report
        assert "at_risk_tools" in report
        assert "critical_tools" in report
        assert len(report["healthy_tools"]) > 0

    def test_monitor_identify_problematic_tools(self):
        """Test problem identification."""
        monitor = ToolReliabilityMonitor(success_rate_threshold=80.0)

        # Add problematic tool
        for i in range(10):
            status = ToolStatus.FAILURE
            invocation = ToolInvocation(
                tool_name="bad_tool",
                agent_name="Agent",
                parameters={},
                result=None,
                status=status,
                latency_ms=50.0,
                error_msg="Connection timeout",
            )
            monitor.tracker.record_invocation(invocation)

        problematic = monitor.identify_problematic_tools(min_calls=5)
        assert len(problematic) > 0
        assert problematic[0]["tool_name"] == "bad_tool"
        assert problematic[0]["severity"] > 0

    @pytest.mark.asyncio
    async def test_monitor_async_monitor_tools(self):
        """Test async monitoring (P1 - Async operations)."""
        monitor = ToolReliabilityMonitor(success_rate_threshold=80.0)

        # Add some invocations to monitor
        for i in range(5):
            invocation = ToolInvocation(
                tool_name="test_tool",
                agent_name="Agent",
                parameters={},
                result="success",
                status=ToolStatus.SUCCESS,
                latency_ms=50.0,
            )
            monitor.tracker.record_invocation(invocation)

        # Run brief monitoring (1 second)
        results = await monitor.monitor_tools(
            check_interval_seconds=0.1,
            duration_seconds=0.5
        )

        assert "total_alerts" in results
        assert "monitoring_duration_seconds" in results
        assert "alerts" in results
        assert "final_stats" in results


class TestBaselineMeasurement:
    """Test BaselineMeasurement orchestration (P1 - Critical)."""

    def test_measurement_creation(self):
        """Test BaselineMeasurement initialization."""
        with tempfile.TemporaryDirectory() as tmpdir:
            measurement = BaselineMeasurement(output_dir=Path(tmpdir))
            assert measurement.monitor is not None
            assert measurement.tracker is not None
            assert len(measurement.tools_to_measure) > 0

    def test_measurement_tools_definition(self):
        """Test tool definitions."""
        measurement = BaselineMeasurement()
        tools = measurement.tools_to_measure

        # Verify we have 20+ tools
        assert len(tools) >= 20

        # Verify tool structure
        for tool_name, tool_info in tools.items():
            assert "category" in tool_info
            assert "description" in tool_info
            assert "test_params" in tool_info

    @pytest.mark.asyncio
    async def test_measurement_create_test_invocation(self):
        """Test creating test invocations."""
        measurement = BaselineMeasurement()

        tool_info = {
            "category": "test",
            "description": "Test tool",
            "test_params": {"key": "value"}
        }

        invocation = await measurement._create_test_invocation(
            tool_name="test_tool",
            agent_name="TestAgent",
            tool_info=tool_info
        )

        assert invocation.tool_name == "test_tool"
        assert invocation.agent_name == "TestAgent"
        assert invocation.status == ToolStatus.SUCCESS

    @pytest.mark.asyncio
    async def test_measurement_execute_invocation(self):
        """Test executing invocations."""
        measurement = BaselineMeasurement()

        invocation = ToolInvocation(
            tool_name="test",
            agent_name="Agent",
            parameters={},
            result="success",
            status=ToolStatus.SUCCESS,
            latency_ms=50.0,
        )

        result = await measurement._execute_invocation(invocation)
        assert result.tool_name == invocation.tool_name

    @pytest.mark.asyncio
    async def test_measurement_run_baseline(self):
        """Test running full baseline measurement (P1 - Critical)."""
        with tempfile.TemporaryDirectory() as tmpdir:
            measurement = BaselineMeasurement(output_dir=Path(tmpdir))

            results = await measurement.run_baseline_measurement(
                invocations_per_tool=5,
                concurrent_tasks=2
            )

            assert "measurement_summary" in results
            assert "tool_statistics" in results
            assert "reliability_report" in results

            summary = results["measurement_summary"]
            assert summary["total_invocations"] == 100  # 20 tools * 5 invocations
            assert summary["success_rate_pct"] > 0
            assert "invocations_per_second" in summary

    @pytest.mark.asyncio
    async def test_measurement_export_baseline_report(self):
        """Test exporting baseline report (P1 - File I/O)."""
        with tempfile.TemporaryDirectory() as tmpdir:
            measurement = BaselineMeasurement(output_dir=Path(tmpdir))

            # Run measurement first
            await measurement.run_baseline_measurement(
                invocations_per_tool=2,
                concurrent_tasks=1
            )

            # Export report
            report_file, report = await measurement.export_baseline_report()

            assert report_file.exists()
            assert "timestamp" in report
            assert "phase" in report
            assert "summary" in report
            assert "tool_statistics" in report
            assert "recommendations" in report


class TestConvenienceFunctions:
    """Test convenience functions (P1 - Integration)."""

    @pytest.mark.asyncio
    async def test_run_deepeyesv2_baseline(self):
        """Test run_deepeyesv2_baseline function (P1 - Critical)."""
        with tempfile.TemporaryDirectory() as tmpdir:
            results = await run_deepeyesv2_baseline(
                invocations_per_tool=3,
                concurrent_tasks=2,
                output_dir=Path(tmpdir)
            )

            assert "measurement_summary" in results
            assert "tool_statistics" in results
            assert "report_file" in results

            # Verify report file exists
            report_path = Path(results["report_file"])
            assert report_path.exists()


class TestIntegrationPhase1Phase2:
    """Test Phase 1 ↔ Phase 2 integration (P1 - Critical)."""

    def test_phase1_output_format(self):
        """Test that Phase 1 output is compatible with Phase 2."""
        with tempfile.TemporaryDirectory() as tmpdir:
            tracker = BaselineTracker(output_dir=Path(tmpdir))

            # Create sample data
            for i in range(10):
                invocation = ToolInvocation(
                    tool_name="test_tool",
                    agent_name="Agent",
                    parameters={"param": "value"},
                    result="success",
                    status=ToolStatus.SUCCESS,
                    latency_ms=50.0 + i,
                )
                tracker.record_invocation(invocation)

            # Export stats in format expected by Phase 2
            stats = tracker.export_stats()

            # Verify format
            assert "summary" in stats
            assert "tools" in stats
            assert "test_tool" in stats["tools"]

            tool_stats = stats["tools"]["test_tool"]
            assert "total_calls" in tool_stats
            assert "success_rate_pct" in tool_stats
            assert "latency_p50_ms" in tool_stats
            assert "latency_p95_ms" in tool_stats

    def test_phase1_data_persistence(self):
        """Test that Phase 1 data persists for Phase 2 consumption."""
        with tempfile.TemporaryDirectory() as tmpdir:
            output_dir = Path(tmpdir)

            # Phase 1: Create and record data
            tracker = BaselineTracker(output_dir=output_dir)
            for i in range(5):
                invocation = ToolInvocation(
                    tool_name="tool_a",
                    agent_name="Agent",
                    parameters={"id": i},
                    result=f"result_{i}",
                    status=ToolStatus.SUCCESS,
                    latency_ms=50.0 + i,
                )
                tracker.record_invocation(invocation)

            # Save stats
            stats_file = tracker.save_stats("phase1_baseline.json")
            assert stats_file.exists()

            # Phase 2 would read this:
            with open(stats_file, "r") as f:
                phase2_input = json.load(f)
                assert "summary" in phase2_input
                assert phase2_input["summary"]["total_invocations"] == 5


class TestErrorHandling:
    """Test error handling and edge cases (P1 - Robustness)."""

    def test_empty_latencies_percentile(self):
        """Test latency percentile with empty list."""
        stats = ToolStats(tool_name="test")
        percentile = stats.get_latency_percentile(50)
        assert percentile == 0.0

    def test_empty_latencies_mean(self):
        """Test mean latency with empty list."""
        stats = ToolStats(tool_name="test")
        mean = stats.get_mean_latency()
        assert mean == 0.0

    def test_empty_latencies_stdev(self):
        """Test stdev with fewer than 2 latencies."""
        stats = ToolStats(tool_name="test")
        stdev = stats.get_stdev_latency()
        assert stdev == 0.0

    def test_single_latency_stdev(self):
        """Test stdev with single latency."""
        stats = ToolStats(tool_name="test")
        stats.latencies_ms = [50.0]
        stdev = stats.get_stdev_latency()
        assert stdev == 0.0

    def test_success_rate_with_zero_calls(self):
        """Test success rate with no calls."""
        stats = ToolStats(tool_name="test")
        assert stats.success_rate == 0.0
        assert stats.failure_rate == 100.0

    def test_invocation_with_missing_optional_fields(self):
        """Test invocation creation with minimal fields."""
        invocation = ToolInvocation(
            tool_name="test",
            agent_name="Agent",
            parameters={},
            result=None,
            status=ToolStatus.FAILURE,
            latency_ms=0.0,
        )
        assert invocation.error_msg is None
        assert invocation.timestamp is not None
        assert invocation.invocation_id is not None


class TestPerformance:
    """Test performance requirements (P1 - Performance)."""

    @pytest.mark.asyncio
    async def test_baseline_measurement_performance(self):
        """Test that baseline measurement meets performance target (<60s for 100+ invocations)."""
        with tempfile.TemporaryDirectory() as tmpdir:
            measurement = BaselineMeasurement(output_dir=Path(tmpdir))

            start = time.time()
            results = await measurement.run_baseline_measurement(
                invocations_per_tool=10,
                concurrent_tasks=5
            )
            elapsed = results["measurement_summary"]["elapsed_seconds"]

            # Should complete 200 invocations in under 60 seconds
            assert elapsed < 60.0

            # Calculate throughput
            throughput = results["measurement_summary"]["invocations_per_second"]
            assert throughput > 10.0  # At least 10 invocations/second


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
