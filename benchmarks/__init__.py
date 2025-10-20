"""
Benchmark Framework for Agent Evolution Validation
Version: 1.0
Date: October 19, 2025

This module provides real benchmark execution for validating agent evolution
improvements. Replaces mocked benchmarks in Darwin agent.
"""

from .agent_benchmarks import (
    AgentBenchmark,
    BenchmarkResult,
    MarketingAgentBenchmark,
    BuilderAgentBenchmark,
    QAAgentBenchmark,
    get_benchmark_for_agent
)

__all__ = [
    "AgentBenchmark",
    "BenchmarkResult",
    "MarketingAgentBenchmark",
    "BuilderAgentBenchmark",
    "QAAgentBenchmark",
    "get_benchmark_for_agent"
]
