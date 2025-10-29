"""
SGLang Multi-Token Prediction Throughput Benchmarks

Tests speculative decoding performance across various scenarios:
- Short prompts (< 512 tokens)
- Long prompts (2K-8K tokens)
- Batch inference (1, 8, 16, 32)

Measures:
- Tokens/second
- Latency P50/P95/P99
- GPU memory usage
- Speedup vs baseline

Author: Genesis AI System
Date: October 28, 2025
"""

import asyncio
import logging
import statistics
import time
from dataclasses import dataclass, asdict
from pathlib import Path
from typing import List, Dict, Any, Optional
import json

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@dataclass
class BenchmarkScenario:
    """Benchmark test scenario."""
    name: str
    prompt: str
    max_tokens: int
    batch_size: int
    expected_output_tokens: int
    category: str  # short, medium, long


@dataclass
class BenchmarkResult:
    """Results from a single benchmark run."""

    # Scenario info
    scenario_name: str
    batch_size: int
    prompt_length: int
    max_tokens: int

    # Throughput
    tokens_per_second: float
    requests_per_second: float

    # Latency (milliseconds)
    latency_p50: float
    latency_p95: float
    latency_p99: float
    latency_mean: float
    latency_min: float
    latency_max: float

    # Speculative decoding metrics
    acceptance_rate: float
    avg_draft_tokens: float
    speedup_vs_baseline: float

    # Resource usage
    gpu_memory_mb: float
    gpu_utilization_pct: float

    # Test metadata
    num_requests: int
    warmup_requests: int
    total_time_sec: float
    backend: str


class ThroughputBenchmark:
    """
    Comprehensive throughput benchmarks for SGLang MTP.

    Tests various scenarios and compares against baseline.
    """

    def __init__(self, results_dir: str = "benchmarks/results"):
        """
        Initialize benchmark suite.

        Args:
            results_dir: Directory to save results
        """
        self.results_dir = Path(results_dir)
        self.results_dir.mkdir(parents=True, exist_ok=True)

        self.scenarios = self._create_scenarios()
        self.results: List[BenchmarkResult] = []

    def _create_scenarios(self) -> List[BenchmarkScenario]:
        """Create benchmark scenarios."""
        scenarios = []

        # Short prompts (< 512 tokens)
        scenarios.append(BenchmarkScenario(
            name="short_qa",
            prompt="What is the capital of France?",
            max_tokens=100,
            batch_size=1,
            expected_output_tokens=10,
            category="short"
        ))

        scenarios.append(BenchmarkScenario(
            name="short_batch_8",
            prompt="Explain quantum computing in simple terms.",
            max_tokens=200,
            batch_size=8,
            expected_output_tokens=150,
            category="short"
        ))

        scenarios.append(BenchmarkScenario(
            name="short_batch_32",
            prompt="Write a Python function to calculate factorial.",
            max_tokens=256,
            batch_size=32,
            expected_output_tokens=200,
            category="short"
        ))

        # Medium prompts (512-2048 tokens)
        medium_prompt = """
        You are a software engineer reviewing code. Analyze the following Python function
        and provide detailed feedback on:
        1. Code quality and readability
        2. Performance optimizations
        3. Security considerations
        4. Best practices adherence
        5. Testing recommendations

        def process_data(items):
            result = []
            for item in items:
                if item > 0:
                    result.append(item * 2)
            return result

        Provide comprehensive analysis with specific examples and code improvements.
        """

        scenarios.append(BenchmarkScenario(
            name="medium_code_review",
            prompt=medium_prompt,
            max_tokens=512,
            batch_size=1,
            expected_output_tokens=400,
            category="medium"
        ))

        scenarios.append(BenchmarkScenario(
            name="medium_batch_16",
            prompt=medium_prompt,
            max_tokens=512,
            batch_size=16,
            expected_output_tokens=400,
            category="medium"
        ))

        # Long prompts (2K-8K tokens)
        long_prompt = " ".join([
            "Analyze the architectural patterns in modern distributed systems.",
            "Consider microservices, event-driven architectures, CQRS, saga patterns,",
            "service mesh, API gateways, circuit breakers, distributed tracing, and",
            "cloud-native design principles. Provide detailed examples, trade-offs,",
            "implementation strategies, and real-world case studies."
        ] * 50)  # ~500 tokens * 50 = ~25K chars = ~6K tokens

        scenarios.append(BenchmarkScenario(
            name="long_architecture",
            prompt=long_prompt,
            max_tokens=1024,
            batch_size=1,
            expected_output_tokens=800,
            category="long"
        ))

        scenarios.append(BenchmarkScenario(
            name="long_batch_8",
            prompt=long_prompt,
            max_tokens=1024,
            batch_size=8,
            expected_output_tokens=800,
            category="long"
        ))

        # Code generation (high token output)
        scenarios.append(BenchmarkScenario(
            name="code_generation",
            prompt="Write a complete Python web scraper using BeautifulSoup and requests with error handling, retries, rate limiting, and data persistence. Include comprehensive documentation and unit tests.",
            max_tokens=2048,
            batch_size=1,
            expected_output_tokens=1500,
            category="long"
        ))

        scenarios.append(BenchmarkScenario(
            name="code_generation_batch_4",
            prompt="Implement a RESTful API using FastAPI with authentication, database integration, and comprehensive error handling.",
            max_tokens=1536,
            batch_size=4,
            expected_output_tokens=1200,
            category="long"
        ))

        return scenarios

    async def run_scenario_sglang(
        self,
        scenario: BenchmarkScenario,
        sglang_inference,
        num_runs: int = 10,
        warmup_runs: int = 3
    ) -> BenchmarkResult:
        """
        Run benchmark scenario with SGLang MTP.

        Args:
            scenario: Benchmark scenario
            sglang_inference: SGLangInference instance
            num_runs: Number of test runs
            warmup_runs: Number of warmup runs

        Returns:
            BenchmarkResult
        """
        logger.info(f"Running scenario: {scenario.name} (SGLang MTP)")

        # Create prompts for batch
        prompts = [scenario.prompt] * scenario.batch_size

        # Warmup
        for _ in range(warmup_runs):
            await sglang_inference.batch_inference(
                prompts,
                batch_size=scenario.batch_size,
                max_tokens=scenario.max_tokens
            )

        # Benchmark runs
        latencies = []
        acceptance_rates = []
        total_tokens = 0
        start_time = time.time()

        for _ in range(num_runs):
            run_start = time.time()

            results = await sglang_inference.batch_inference(
                prompts,
                batch_size=scenario.batch_size,
                max_tokens=scenario.max_tokens
            )

            run_latency = (time.time() - run_start) * 1000
            latencies.append(run_latency)

            # Collect metrics
            for result in results:
                total_tokens += len(result.text.split())
                if result.acceptance_rate > 0:
                    acceptance_rates.append(result.acceptance_rate)

        total_time = time.time() - start_time

        # Calculate metrics
        latencies.sort()
        tokens_per_sec = total_tokens / total_time
        requests_per_sec = (num_runs * scenario.batch_size) / total_time

        avg_acceptance = statistics.mean(acceptance_rates) if acceptance_rates else 0.0

        return BenchmarkResult(
            scenario_name=scenario.name,
            batch_size=scenario.batch_size,
            prompt_length=len(scenario.prompt),
            max_tokens=scenario.max_tokens,
            tokens_per_second=tokens_per_sec,
            requests_per_second=requests_per_sec,
            latency_p50=statistics.median(latencies),
            latency_p95=latencies[int(len(latencies) * 0.95)],
            latency_p99=latencies[int(len(latencies) * 0.99)],
            latency_mean=statistics.mean(latencies),
            latency_min=min(latencies),
            latency_max=max(latencies),
            acceptance_rate=avg_acceptance,
            avg_draft_tokens=scenario.expected_output_tokens * avg_acceptance,
            speedup_vs_baseline=0.0,  # Calculated later
            gpu_memory_mb=0.0,  # Would require GPU monitoring
            gpu_utilization_pct=0.0,
            num_requests=num_runs * scenario.batch_size,
            warmup_requests=warmup_runs * scenario.batch_size,
            total_time_sec=total_time,
            backend="sglang_mtp"
        )

    async def run_scenario_baseline(
        self,
        scenario: BenchmarkScenario,
        baseline_inference_fn,
        num_runs: int = 10,
        warmup_runs: int = 3
    ) -> BenchmarkResult:
        """
        Run benchmark scenario with baseline (standard API).

        Args:
            scenario: Benchmark scenario
            baseline_inference_fn: Baseline inference function
            num_runs: Number of test runs
            warmup_runs: Number of warmup runs

        Returns:
            BenchmarkResult
        """
        logger.info(f"Running scenario: {scenario.name} (Baseline)")

        prompts = [scenario.prompt] * scenario.batch_size

        # Warmup
        for _ in range(warmup_runs):
            for prompt in prompts:
                await asyncio.to_thread(
                    baseline_inference_fn,
                    prompt,
                    max_tokens=scenario.max_tokens
                )

        # Benchmark runs
        latencies = []
        total_tokens = 0
        start_time = time.time()

        for _ in range(num_runs):
            run_start = time.time()

            # Sequential inference (simulating standard API)
            for prompt in prompts:
                result = await asyncio.to_thread(
                    baseline_inference_fn,
                    prompt,
                    max_tokens=scenario.max_tokens
                )
                total_tokens += len(result.split())

            run_latency = (time.time() - run_start) * 1000
            latencies.append(run_latency)

        total_time = time.time() - start_time

        # Calculate metrics
        latencies.sort()
        tokens_per_sec = total_tokens / total_time
        requests_per_sec = (num_runs * scenario.batch_size) / total_time

        return BenchmarkResult(
            scenario_name=scenario.name,
            batch_size=scenario.batch_size,
            prompt_length=len(scenario.prompt),
            max_tokens=scenario.max_tokens,
            tokens_per_second=tokens_per_sec,
            requests_per_second=requests_per_sec,
            latency_p50=statistics.median(latencies),
            latency_p95=latencies[int(len(latencies) * 0.95)],
            latency_p99=latencies[int(len(latencies) * 0.99)],
            latency_mean=statistics.mean(latencies),
            latency_min=min(latencies),
            latency_max=max(latencies),
            acceptance_rate=0.0,
            avg_draft_tokens=0.0,
            speedup_vs_baseline=1.0,
            gpu_memory_mb=0.0,
            gpu_utilization_pct=0.0,
            num_requests=num_runs * scenario.batch_size,
            warmup_requests=warmup_runs * scenario.batch_size,
            total_time_sec=total_time,
            backend="baseline"
        )

    def calculate_speedup(
        self,
        sglang_result: BenchmarkResult,
        baseline_result: BenchmarkResult
    ) -> BenchmarkResult:
        """Calculate speedup vs baseline."""
        speedup = baseline_result.tokens_per_second / sglang_result.tokens_per_second

        # Update SGLang result with speedup
        sglang_result.speedup_vs_baseline = speedup
        return sglang_result

    async def run_all_scenarios(
        self,
        sglang_inference,
        baseline_inference_fn,
        categories: List[str] = None
    ):
        """
        Run all benchmark scenarios.

        Args:
            sglang_inference: SGLangInference instance
            baseline_inference_fn: Baseline inference function
            categories: List of categories to test (or None for all)
        """
        if categories is None:
            categories = ["short", "medium", "long"]

        for scenario in self.scenarios:
            if scenario.category not in categories:
                continue

            # Run SGLang
            sglang_result = await self.run_scenario_sglang(scenario, sglang_inference)

            # Run baseline
            baseline_result = await self.run_scenario_baseline(scenario, baseline_inference_fn)

            # Calculate speedup
            sglang_result = self.calculate_speedup(sglang_result, baseline_result)

            # Store results
            self.results.append(sglang_result)
            self.results.append(baseline_result)

            # Log summary
            logger.info(
                f"Scenario {scenario.name}: SGLang={sglang_result.tokens_per_second:.1f} tok/s, "
                f"Baseline={baseline_result.tokens_per_second:.1f} tok/s, "
                f"Speedup={sglang_result.speedup_vs_baseline:.2f}x"
            )

    def generate_report(self) -> Dict[str, Any]:
        """Generate comprehensive benchmark report."""
        # Group by backend
        sglang_results = [r for r in self.results if r.backend == "sglang_mtp"]
        baseline_results = [r for r in self.results if r.backend == "baseline"]

        # Calculate aggregate metrics
        avg_speedup = statistics.mean([r.speedup_vs_baseline for r in sglang_results])
        avg_acceptance = statistics.mean([r.acceptance_rate for r in sglang_results if r.acceptance_rate > 0])

        # Latency improvements
        sglang_p95_avg = statistics.mean([r.latency_p95 for r in sglang_results])
        baseline_p95_avg = statistics.mean([r.latency_p95 for r in baseline_results])
        latency_reduction = ((baseline_p95_avg - sglang_p95_avg) / baseline_p95_avg) * 100

        report = {
            "summary": {
                "total_scenarios": len(self.scenarios),
                "avg_speedup": avg_speedup,
                "avg_acceptance_rate": avg_acceptance,
                "latency_reduction_p95_pct": latency_reduction,
                "sglang_avg_throughput": statistics.mean([r.tokens_per_second for r in sglang_results]),
                "baseline_avg_throughput": statistics.mean([r.tokens_per_second for r in baseline_results]),
            },
            "by_category": {},
            "detailed_results": [asdict(r) for r in self.results]
        }

        # Group by category
        for category in ["short", "medium", "long"]:
            cat_sglang = [r for r in sglang_results if any(s.category == category and s.name == r.scenario_name for s in self.scenarios)]
            cat_baseline = [r for r in baseline_results if any(s.category == category and s.name == r.scenario_name for s in self.scenarios)]

            if cat_sglang:
                report["by_category"][category] = {
                    "avg_speedup": statistics.mean([r.speedup_vs_baseline for r in cat_sglang]),
                    "sglang_throughput": statistics.mean([r.tokens_per_second for r in cat_sglang]),
                    "baseline_throughput": statistics.mean([r.tokens_per_second for r in cat_baseline]),
                    "sglang_latency_p95": statistics.mean([r.latency_p95 for r in cat_sglang]),
                    "baseline_latency_p95": statistics.mean([r.latency_p95 for r in cat_baseline]),
                }

        return report

    def save_report(self, report: Dict[str, Any], filename: str = "sglang_benchmark_report.json"):
        """Save report to file."""
        output_path = self.results_dir / filename
        with open(output_path, 'w') as f:
            json.dump(report, f, indent=2)

        logger.info(f"Report saved to {output_path}")

    def print_summary(self, report: Dict[str, Any]):
        """Print benchmark summary."""
        print("\n" + "=" * 80)
        print("SGLang Multi-Token Prediction Benchmark Results")
        print("=" * 80)

        summary = report["summary"]
        print(f"\nOverall Performance:")
        print(f"  Average Speedup: {summary['avg_speedup']:.2f}x")
        print(f"  Acceptance Rate: {summary['avg_acceptance_rate']:.1f}%")
        print(f"  Latency Reduction (P95): {summary['latency_reduction_p95_pct']:.1f}%")
        print(f"  SGLang Throughput: {summary['sglang_avg_throughput']:.1f} tokens/sec")
        print(f"  Baseline Throughput: {summary['baseline_avg_throughput']:.1f} tokens/sec")

        print(f"\nBy Category:")
        for category, metrics in report["by_category"].items():
            print(f"\n  {category.upper()}:")
            print(f"    Speedup: {metrics['avg_speedup']:.2f}x")
            print(f"    SGLang: {metrics['sglang_throughput']:.1f} tok/s ({metrics['sglang_latency_p95']:.1f}ms P95)")
            print(f"    Baseline: {metrics['baseline_throughput']:.1f} tok/s ({metrics['baseline_latency_p95']:.1f}ms P95)")

        print("\n" + "=" * 80)


# Mock inference functions for testing without actual servers
def mock_baseline_inference(prompt: str, max_tokens: int = 512) -> str:
    """Mock baseline inference (for testing)."""
    # Simulate processing time
    time.sleep(0.05 + len(prompt) * 0.0001)
    return " ".join(["word"] * min(max_tokens, 100))


async def run_benchmark_suite():
    """Run complete benchmark suite (example)."""
    logger.info("Starting SGLang MTP benchmark suite")

    benchmark = ThroughputBenchmark()

    # Note: In production, replace these with actual SGLang and baseline instances
    logger.warning("Running with mock inference - replace with actual SGLang for real benchmarks")

    # Mock baseline
    baseline_fn = mock_baseline_inference

    # Would need actual SGLang instance:
    # from infrastructure.sglang_inference import SGLangInference
    # sglang = SGLangInference("meta-llama/Llama-3.1-8B-Instruct", enable_mtp=True)
    # sglang.initialize()

    logger.info("Benchmark suite requires actual SGLang server to run")
    logger.info("See tests/test_sglang_mtp.py for integration tests")


if __name__ == "__main__":
    asyncio.run(run_benchmark_suite())
