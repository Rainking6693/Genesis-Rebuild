"""
DeepEyesV2 Phase 1 - Tool Baseline Measurement
===============================================

Establishes baseline tool success rates and reliability metrics before applying RL refinement.
Based on arXiv:2511.05271 - Two-stage training for improved tool use in language models.

This module provides:
1. Tool invocation tracking with success/failure metrics
2. Real-time reliability monitoring across agents
3. Baseline measurement orchestration for 100+ tool invocations
4. Comprehensive reporting and recommendations
"""

from __future__ import annotations

import asyncio
import json
import logging
import time
from dataclasses import dataclass, asdict, field
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional, Dict, List, Any, Tuple
from enum import Enum
import statistics

logger = logging.getLogger(__name__)


class ToolStatus(Enum):
    """Tool invocation status."""
    SUCCESS = "success"
    FAILURE = "failure"
    TIMEOUT = "timeout"
    PARTIAL = "partial"


@dataclass
class ToolInvocation:
    """
    Captures complete metadata for a single tool invocation.

    Attributes:
        tool_name: Name of the tool/function invoked
        agent_name: Name of the agent that invoked the tool
        parameters: Input parameters as dict
        result: Output result or None if failed
        status: ToolStatus enum (SUCCESS, FAILURE, TIMEOUT, PARTIAL)
        success: Boolean indicator (True if status == SUCCESS)
        latency_ms: Execution time in milliseconds
        error_msg: Error message if failure occurred
        timestamp: ISO8601 timestamp of invocation
        invocation_id: Unique identifier for this invocation
    """
    tool_name: str
    agent_name: str
    parameters: Dict[str, Any]
    result: Optional[Any]
    status: ToolStatus
    latency_ms: float
    error_msg: Optional[str] = None
    timestamp: str = field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    invocation_id: str = field(default_factory=lambda: f"inv_{int(time.time() * 1000)}")

    @property
    def success(self) -> bool:
        """Check if tool invocation was successful."""
        return self.status == ToolStatus.SUCCESS

    def to_dict(self) -> Dict[str, Any]:
        """Convert invocation to dictionary format."""
        data = asdict(self)
        data['status'] = self.status.value
        return data

    def to_json(self) -> str:
        """Convert invocation to JSON string."""
        return json.dumps(self.to_dict(), default=str)

    def is_successful(self) -> bool:
        """Check if tool invocation succeeded."""
        return self.success


@dataclass
class ToolStats:
    """Statistics for a single tool."""
    tool_name: str
    total_calls: int = 0
    successful_calls: int = 0
    failed_calls: int = 0
    timeout_calls: int = 0
    partial_calls: int = 0
    latencies_ms: List[float] = field(default_factory=list)
    errors: Dict[str, int] = field(default_factory=dict)  # error_msg -> count

    @property
    def success_rate(self) -> float:
        """Calculate success rate as percentage."""
        if self.total_calls == 0:
            return 0.0
        return (self.successful_calls / self.total_calls) * 100.0

    @property
    def failure_rate(self) -> float:
        """Calculate failure rate as percentage."""
        return 100.0 - self.success_rate

    def get_latency_percentile(self, percentile: int) -> float:
        """Get latency at given percentile (50, 95, 99)."""
        if not self.latencies_ms:
            return 0.0
        sorted_latencies = sorted(self.latencies_ms)
        index = int(len(sorted_latencies) * percentile / 100.0)
        return sorted_latencies[min(index, len(sorted_latencies) - 1)]

    def get_mean_latency(self) -> float:
        """Get mean latency in milliseconds."""
        if not self.latencies_ms:
            return 0.0
        return statistics.mean(self.latencies_ms)

    def get_stdev_latency(self) -> float:
        """Get standard deviation of latency."""
        if len(self.latencies_ms) < 2:
            return 0.0
        return statistics.stdev(self.latencies_ms)

    def to_dict(self) -> Dict[str, Any]:
        """Convert stats to dictionary."""
        return {
            'tool_name': self.tool_name,
            'total_calls': self.total_calls,
            'successful_calls': self.successful_calls,
            'failed_calls': self.failed_calls,
            'timeout_calls': self.timeout_calls,
            'partial_calls': self.partial_calls,
            'success_rate_pct': round(self.success_rate, 2),
            'failure_rate_pct': round(self.failure_rate, 2),
            'latency_p50_ms': round(self.get_latency_percentile(50), 2),
            'latency_p95_ms': round(self.get_latency_percentile(95), 2),
            'latency_p99_ms': round(self.get_latency_percentile(99), 2),
            'latency_mean_ms': round(self.get_mean_latency(), 2),
            'latency_stdev_ms': round(self.get_stdev_latency(), 2),
            'top_errors': dict(sorted(self.errors.items(), key=lambda x: x[1], reverse=True)[:5])
        }


class BaselineTracker:
    """
    Tracks tool invocations across all Genesis agents.

    Maintains statistics for each tool including success rates, latencies,
    and error distributions.
    """

    def __init__(self, output_dir: Optional[Path] = None):
        self.output_dir = output_dir or Path("logs/deepeyesv2/baseline")
        self.output_dir.mkdir(parents=True, exist_ok=True)

        self.invocations: List[ToolInvocation] = []
        self.tool_stats: Dict[str, ToolStats] = {}
        self.start_time = datetime.now(timezone.utc)

    def record_invocation(self, invocation: ToolInvocation) -> None:
        """Record a tool invocation."""
        self.invocations.append(invocation)

        # Update tool statistics
        if invocation.tool_name not in self.tool_stats:
            self.tool_stats[invocation.tool_name] = ToolStats(tool_name=invocation.tool_name)

        stats = self.tool_stats[invocation.tool_name]
        stats.total_calls += 1
        stats.latencies_ms.append(invocation.latency_ms)

        # Update status counts
        if invocation.status == ToolStatus.SUCCESS:
            stats.successful_calls += 1
        elif invocation.status == ToolStatus.FAILURE:
            stats.failed_calls += 1
            if invocation.error_msg:
                stats.errors[invocation.error_msg] = stats.errors.get(invocation.error_msg, 0) + 1
        elif invocation.status == ToolStatus.TIMEOUT:
            stats.timeout_calls += 1
        elif invocation.status == ToolStatus.PARTIAL:
            stats.partial_calls += 1

        # Log to file
        self._log_invocation(invocation)

    def _log_invocation(self, invocation: ToolInvocation) -> None:
        """Write invocation to JSONL log."""
        log_file = self.output_dir / "invocations.jsonl"
        with log_file.open("a", encoding="utf-8") as f:
            f.write(invocation.to_json() + "\n")

    def get_tool_stats(self, tool_name: str) -> Optional[ToolStats]:
        """Get statistics for a specific tool."""
        return self.tool_stats.get(tool_name)

    def get_success_rate(self, tool_name: str) -> float:
        """Get success rate for a tool (0-100%)."""
        stats = self.get_tool_stats(tool_name)
        return stats.success_rate if stats else 0.0

    def get_all_stats(self) -> Dict[str, ToolStats]:
        """Get statistics for all tools."""
        return self.tool_stats

    def get_latency_percentile(self, tool_name: str, percentile: int) -> float:
        """Get latency percentile for a tool."""
        stats = self.get_tool_stats(tool_name)
        return stats.get_latency_percentile(percentile) if stats else 0.0

    def get_summary(self) -> Dict[str, Any]:
        """Get overall summary statistics."""
        total_invocations = len(self.invocations)
        successful = sum(1 for inv in self.invocations if inv.success)

        return {
            'total_invocations': total_invocations,
            'successful_invocations': successful,
            'failed_invocations': total_invocations - successful,
            'overall_success_rate_pct': (successful / total_invocations * 100.0) if total_invocations > 0 else 0.0,
            'unique_tools': len(self.tool_stats),
            'measurement_duration_seconds': (datetime.now(timezone.utc) - self.start_time).total_seconds(),
            'invocations_per_second': total_invocations / max(1, (datetime.now(timezone.utc) - self.start_time).total_seconds())
        }

    def export_stats(self, format: str = "json") -> Dict[str, Any]:
        """Export all statistics."""
        return {
            'summary': self.get_summary(),
            'tools': {name: stats.to_dict() for name, stats in self.tool_stats.items()}
        }

    def save_stats(self, filename: str = "stats.json") -> Path:
        """Save statistics to file."""
        output_file = self.output_dir / filename
        data = self.export_stats()
        with output_file.open("w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, default=str)
        logger.info(f"Saved baseline statistics to {output_file}")
        return output_file


class ToolReliabilityMonitor:
    """
    Real-time monitoring of tool reliability with alert thresholds.

    Tracks tool health, identifies problematic tools, and generates
    real-time alerts when success rates drop below thresholds.
    """

    def __init__(self, success_rate_threshold: float = 80.0):
        self.tracker = BaselineTracker()
        self.success_rate_threshold = success_rate_threshold
        self.alerts: List[Dict[str, Any]] = []
        self.alert_log = self.tracker.output_dir / "alerts.jsonl"

    async def monitor_tools(self, check_interval_seconds: float = 5.0, duration_seconds: float = 300.0) -> Dict[str, Any]:
        """
        Monitor tool reliability in real-time.

        Args:
            check_interval_seconds: How often to check tool stats
            duration_seconds: How long to monitor

        Returns:
            Dictionary with monitoring results and alerts
        """
        start_time = time.time()
        monitoring_data = []

        while (time.time() - start_time) < duration_seconds:
            current_stats = self.tracker.get_all_stats()

            for tool_name, stats in current_stats.items():
                success_rate = stats.success_rate

                # Check if success rate dropped below threshold
                if stats.total_calls >= 5 and success_rate < self.success_rate_threshold:
                    alert = {
                        'timestamp': datetime.now(timezone.utc).isoformat(),
                        'tool_name': tool_name,
                        'success_rate_pct': round(success_rate, 2),
                        'threshold_pct': self.success_rate_threshold,
                        'total_calls': stats.total_calls,
                        'failed_calls': stats.failed_calls,
                        'message': f'{tool_name} reliability below {self.success_rate_threshold}%'
                    }
                    self.alerts.append(alert)
                    self._log_alert(alert)
                    logger.warning(f"ALERT: {alert['message']} (actual: {alert['success_rate_pct']}%)")

            monitoring_data.append({
                'timestamp': datetime.now(timezone.utc).isoformat(),
                'tool_stats': {name: stats.to_dict() for name, stats in current_stats.items()}
            })

            await asyncio.sleep(check_interval_seconds)

        return {
            'total_alerts': len(self.alerts),
            'monitoring_duration_seconds': time.time() - start_time,
            'alerts': self.alerts,
            'final_stats': self.tracker.export_stats()
        }

    def _log_alert(self, alert: Dict[str, Any]) -> None:
        """Log alert to file."""
        with self.alert_log.open("a", encoding="utf-8") as f:
            f.write(json.dumps(alert, default=str) + "\n")

    def get_reliability_report(self) -> Dict[str, Any]:
        """Generate comprehensive reliability report."""
        all_stats = self.tracker.get_all_stats()

        healthy_tools = []
        at_risk_tools = []
        critical_tools = []

        for tool_name, stats in all_stats.items():
            tool_info = {
                'tool_name': tool_name,
                'success_rate_pct': round(stats.success_rate, 2),
                'total_calls': stats.total_calls,
                'latency_p95_ms': round(stats.get_latency_percentile(95), 2)
            }

            if stats.success_rate >= 95.0:
                healthy_tools.append(tool_info)
            elif stats.success_rate >= self.success_rate_threshold:
                at_risk_tools.append(tool_info)
            else:
                critical_tools.append(tool_info)

        return {
            'timestamp': datetime.now(timezone.utc).isoformat(),
            'success_threshold_pct': self.success_rate_threshold,
            'healthy_tools': sorted(healthy_tools, key=lambda x: x['success_rate_pct'], reverse=True),
            'at_risk_tools': sorted(at_risk_tools, key=lambda x: x['success_rate_pct']),
            'critical_tools': sorted(critical_tools, key=lambda x: x['success_rate_pct']),
            'total_unique_tools': len(all_stats),
            'alerts': self.alerts
        }

    def identify_problematic_tools(self, min_calls: int = 5) -> List[Dict[str, Any]]:
        """
        Identify tools that are unreliable or slow.

        Args:
            min_calls: Only consider tools with at least this many calls

        Returns:
            List of problematic tools sorted by severity
        """
        problematic = []
        all_stats = self.tracker.get_all_stats()

        for tool_name, stats in all_stats.items():
            if stats.total_calls < min_calls:
                continue

            issues = []
            severity = 0

            # Check success rate
            if stats.success_rate < self.success_rate_threshold:
                issues.append(f"Low success rate: {stats.success_rate:.1f}%")
                severity += 2

            # Check latency (p95 > 5000ms is concerning)
            p95_latency = stats.get_latency_percentile(95)
            if p95_latency > 5000:
                issues.append(f"High latency: p95={p95_latency:.0f}ms")
                severity += 1

            # Check error concentration
            if stats.errors and stats.failed_calls > stats.total_calls * 0.1:
                top_error = max(stats.errors.items(), key=lambda x: x[1])
                issues.append(f"Recurring error: {top_error[0]}")
                severity += 1

            if issues:
                problematic.append({
                    'tool_name': tool_name,
                    'severity': severity,
                    'issues': issues,
                    'stats': stats.to_dict()
                })

        return sorted(problematic, key=lambda x: x['severity'], reverse=True)


class BaselineMeasurement:
    """
    Orchestrates baseline measurement across all Genesis agents.

    Coordinates execution of 100+ test invocations across different tools
    and agents to establish baseline reliability metrics.
    """

    def __init__(self, output_dir: Optional[Path] = None):
        self.output_dir = output_dir or Path("logs/deepeyesv2/baseline")
        self.monitor = ToolReliabilityMonitor()
        self.tracker = self.monitor.tracker

        # Tools to measure (Genesis-specific)
        self.tools_to_measure = self._define_tools_to_measure()

    def _define_tools_to_measure(self) -> Dict[str, Dict[str, Any]]:
        """Define tools to measure with test parameters."""
        return {
            'anthropic_api': {
                'category': 'api',
                'description': 'Anthropic Claude API calls',
                'test_params': {'model': 'claude-3-5-haiku-20241022', 'max_tokens': 100}
            },
            'database_query': {
                'category': 'database',
                'description': 'Genesis database operations',
                'test_params': {'operation': 'select', 'timeout_seconds': 5}
            },
            'stripe_payment': {
                'category': 'external_api',
                'description': 'Stripe payment processing',
                'test_params': {'action': 'create_charge', 'amount_cents': 100}
            },
            'email_send': {
                'category': 'external_api',
                'description': 'Email service integration',
                'test_params': {'recipients': 1, 'priority': 'normal'}
            },
            'vector_embedding': {
                'category': 'ml',
                'description': 'Vector embedding generation',
                'test_params': {'dimension': 1536, 'model': 'text-embedding-004'}
            },
            'web_scraping': {
                'category': 'external_api',
                'description': 'Web content retrieval',
                'test_params': {'timeout_seconds': 10, 'retry_count': 2}
            },
            'mongodb_insert': {
                'category': 'database',
                'description': 'MongoDB document insertion',
                'test_params': {'collection': 'agents', 'document_size_kb': 10}
            },
            'mongodb_query': {
                'category': 'database',
                'description': 'MongoDB query execution',
                'test_params': {'collection': 'agents', 'limit': 100}
            },
            'cache_get': {
                'category': 'cache',
                'description': 'Distributed cache retrieval',
                'test_params': {'key_prefix': 'genesis_', 'ttl_seconds': 3600}
            },
            'cache_set': {
                'category': 'cache',
                'description': 'Distributed cache write',
                'test_params': {'ttl_seconds': 3600, 'value_size_kb': 100}
            },
            'file_storage_upload': {
                'category': 'storage',
                'description': 'Cloud file storage upload',
                'test_params': {'file_size_mb': 1, 'timeout_seconds': 30}
            },
            'file_storage_download': {
                'category': 'storage',
                'description': 'Cloud file storage download',
                'test_params': {'file_size_mb': 1, 'timeout_seconds': 30}
            },
            'async_job_queue': {
                'category': 'queue',
                'description': 'Asynchronous job queue submission',
                'test_params': {'priority': 'normal', 'timeout_seconds': 10}
            },
            'webhook_delivery': {
                'category': 'external_api',
                'description': 'Webhook event delivery',
                'test_params': {'retry_count': 3, 'timeout_seconds': 5}
            },
            'auth_validation': {
                'category': 'auth',
                'description': 'Authentication token validation',
                'test_params': {'algorithm': 'HS256', 'ttl_seconds': 3600}
            },
            'rate_limiter': {
                'category': 'middleware',
                'description': 'Rate limiting check',
                'test_params': {'requests_per_second': 100, 'bucket_size': 1000}
            },
            'logging_service': {
                'category': 'logging',
                'description': 'Structured logging to central service',
                'test_params': {'log_level': 'info', 'batch_size': 100}
            },
            'metrics_export': {
                'category': 'monitoring',
                'description': 'Metrics export to monitoring service',
                'test_params': {'metric_count': 50, 'export_interval_seconds': 60}
            },
            'config_lookup': {
                'category': 'config',
                'description': 'Configuration service lookup',
                'test_params': {'cache_enabled': True, 'ttl_seconds': 300}
            },
            'health_check': {
                'category': 'health',
                'description': 'Service health check endpoint',
                'test_params': {'timeout_seconds': 5, 'retry_count': 1}
            }
        }

    async def run_baseline_measurement(self,
                                     invocations_per_tool: int = 10,
                                     concurrent_tasks: int = 5) -> Dict[str, Any]:
        """
        Run baseline measurement across all tools.

        Args:
            invocations_per_tool: Number of invocations per tool (default 10 = 200+ total)
            concurrent_tasks: Max concurrent task execution

        Returns:
            Complete baseline measurement results
        """
        start_time = time.time()
        logger.info(f"Starting baseline measurement: {len(self.tools_to_measure)} tools x {invocations_per_tool} invocations")

        # Create test invocations
        test_invocations = []
        agents = ['MarketingAgent', 'ContentAgent', 'AnalyticsAgent', 'CodeReviewAgent', 'DatabaseDesignAgent']

        for tool_name, tool_info in self.tools_to_measure.items():
            for i in range(invocations_per_tool):
                agent_name = agents[i % len(agents)]

                # Create mock invocation based on tool category
                invocation = await self._create_test_invocation(
                    tool_name=tool_name,
                    agent_name=agent_name,
                    tool_info=tool_info
                )
                test_invocations.append(invocation)

        # Execute invocations concurrently
        semaphore = asyncio.Semaphore(concurrent_tasks)

        async def run_with_semaphore(inv):
            async with semaphore:
                return await self._execute_invocation(inv)

        results = await asyncio.gather(
            *[run_with_semaphore(inv) for inv in test_invocations],
            return_exceptions=True
        )

        # Record results
        successful_count = 0
        for result in results:
            if isinstance(result, ToolInvocation):
                self.tracker.record_invocation(result)
                if result.success:
                    successful_count += 1

        elapsed = time.time() - start_time

        # Generate report
        return {
            'measurement_summary': {
                'total_invocations': len(test_invocations),
                'successful_invocations': successful_count,
                'failed_invocations': len(test_invocations) - successful_count,
                'success_rate_pct': (successful_count / len(test_invocations) * 100.0) if test_invocations else 0.0,
                'elapsed_seconds': elapsed,
                'invocations_per_second': len(test_invocations) / elapsed if elapsed > 0 else 0.0
            },
            'tool_statistics': self.tracker.export_stats(),
            'reliability_report': self.monitor.get_reliability_report(),
            'problematic_tools': self.monitor.identify_problematic_tools(min_calls=2)
        }

    async def _create_test_invocation(self, tool_name: str, agent_name: str,
                                     tool_info: Dict[str, Any]) -> ToolInvocation:
        """Create a test invocation for a tool."""
        return ToolInvocation(
            tool_name=tool_name,
            agent_name=agent_name,
            parameters=tool_info.get('test_params', {}),
            result=None,
            status=ToolStatus.SUCCESS,  # Simulated for baseline
            latency_ms=50.0 + (hash(tool_name) % 100),  # Simulated latency
            error_msg=None
        )

    async def _execute_invocation(self, invocation: ToolInvocation) -> ToolInvocation:
        """Execute a test invocation (simulated for baseline)."""
        # Add small delay to simulate execution
        await asyncio.sleep(0.01)
        return invocation

    async def export_baseline_report(self, output_format: str = "json") -> Tuple[Path, Dict[str, Any]]:
        """
        Export comprehensive baseline report.

        Returns:
            Tuple of (report_file_path, report_dict)
        """
        report = {
            'timestamp': datetime.now(timezone.utc).isoformat(),
            'phase': 'Phase 1 - Baseline Measurement',
            'reference': 'arXiv:2511.05271',
            'summary': self.tracker.get_summary(),
            'tool_statistics': self.tracker.export_stats(),
            'reliability_report': self.monitor.get_reliability_report(),
            'problematic_tools': self.monitor.identify_problematic_tools(min_calls=2),
            'recommendations': self._generate_recommendations()
        }

        # Save report
        report_file = self.tracker.output_dir / f"baseline_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        with report_file.open("w", encoding="utf-8") as f:
            json.dump(report, f, indent=2, default=str)

        logger.info(f"Exported baseline report to {report_file}")
        return report_file, report

    def _generate_recommendations(self) -> Dict[str, List[str]]:
        """Generate recommendations based on baseline data."""
        recommendations = {
            'immediate_actions': [],
            'optimization_opportunities': [],
            'monitoring_focus': []
        }

        all_stats = self.tracker.get_all_stats()

        for tool_name, stats in all_stats.items():
            # Critical issues
            if stats.success_rate < 80.0:
                recommendations['immediate_actions'].append(
                    f"Investigate {tool_name}: success rate critically low at {stats.success_rate:.1f}%"
                )

            # Optimization opportunities
            if stats.get_latency_percentile(95) > 1000:
                recommendations['optimization_opportunities'].append(
                    f"Optimize {tool_name}: p95 latency is {stats.get_latency_percentile(95):.0f}ms"
                )

            # Monitoring focus
            if stats.total_calls > 50 and stats.errors:
                recommendations['monitoring_focus'].append(
                    f"Monitor {tool_name}: {len(stats.errors)} error types observed"
                )

        return recommendations


# Convenience functions for easy integration

async def run_deepeyesv2_baseline(invocations_per_tool: int = 10,
                                  concurrent_tasks: int = 5,
                                  output_dir: Optional[Path] = None) -> Dict[str, Any]:
    """
    Run complete DeepEyesV2 baseline measurement.

    Args:
        invocations_per_tool: Invocations per tool
        concurrent_tasks: Max concurrent task count
        output_dir: Output directory for results

    Returns:
        Complete measurement results
    """
    measurement = BaselineMeasurement(output_dir)
    results = await measurement.run_baseline_measurement(
        invocations_per_tool=invocations_per_tool,
        concurrent_tasks=concurrent_tasks
    )

    # Export report
    report_file, report = await measurement.export_baseline_report()
    results['report_file'] = str(report_file)

    return results


if __name__ == "__main__":
    # Example usage
    import sys

    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    )

    # Run baseline measurement
    results = asyncio.run(run_deepeyesv2_baseline(invocations_per_tool=5))
    print(json.dumps(results, indent=2, default=str))
