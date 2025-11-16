"""
Cost Tracker - Track LLM cost savings from experience reuse

Measures the cost reduction achieved by reusing past experiences
instead of making new LLM calls.
"""

import logging
from typing import Dict, Any

logger = logging.getLogger(__name__)


class CostTracker:
    """
    Track LLM cost savings from experience reuse

    Records:
    - When new solutions are generated (baseline_calls)
    - When past experiences are reused (reused_calls)
    - Cost savings achieved
    """

    def __init__(self, llm_cost_per_call: float = 0.01):
        """
        Initialize cost tracker

        Args:
            llm_cost_per_call: Average LLM cost per API call in USD
        """
        self.llm_cost_per_call = llm_cost_per_call
        self.baseline_calls = 0  # New generations (with LLM calls)
        self.reused_calls = 0    # Experiences reused (no LLM call)
        self.total_calls = 0
        logger.info(
            f"[CostTracker] Initialized with cost_per_call=${llm_cost_per_call:.4f}"
        )

    def record_new_generation(self, tokens_used: int = 1000) -> None:
        """
        Record an LLM call made for new generation

        Args:
            tokens_used: Approximate tokens used in the call
        """
        self.baseline_calls += 1
        self.total_calls += 1
        logger.debug(
            f"[CostTracker] Recorded new generation: "
            f"baseline={self.baseline_calls}, reused={self.reused_calls}"
        )

    def record_reuse(self) -> None:
        """
        Record an experience reused (no LLM call)
        """
        self.reused_calls += 1
        self.total_calls += 1
        logger.debug(
            f"[CostTracker] Recorded experience reuse: "
            f"baseline={self.baseline_calls}, reused={self.reused_calls}"
        )

    def get_savings(self) -> Dict[str, Any]:
        """
        Calculate cost savings from experience reuse

        Returns:
            Dictionary with:
            - total_tasks: Total tasks executed
            - baseline_cost: Cost if all were new generations
            - actual_cost: Cost with experience reuse
            - reused: Number of experiences reused
            - savings_percent: Percentage reduction
            - savings_usd: Dollar amount saved
        """
        if self.total_calls == 0:
            return {
                "total_tasks": 0,
                "baseline_cost": 0.0,
                "actual_cost": 0.0,
                "reused": 0,
                "savings_percent": 0.0,
                "savings_usd": 0.0,
                "status": "no_data"
            }

        # Baseline: all tasks are new generations
        baseline_cost = self.total_calls * self.llm_cost_per_call

        # Actual: only new generations incur cost
        actual_cost = self.baseline_calls * self.llm_cost_per_call

        # Savings
        savings_usd = baseline_cost - actual_cost
        savings_percent = (self.reused_calls / self.total_calls * 100) if self.total_calls > 0 else 0

        return {
            "total_tasks": self.total_calls,
            "baseline_cost": round(baseline_cost, 4),
            "actual_cost": round(actual_cost, 4),
            "new_generations": self.baseline_calls,
            "reused": self.reused_calls,
            "savings_percent": round(savings_percent, 2),
            "savings_usd": round(savings_usd, 4),
            "cost_per_call": self.llm_cost_per_call
        }

    def get_roi(self) -> Dict[str, Any]:
        """
        Calculate ROI from experience buffer investment

        Assumes storing an experience costs 5% of a generation LLM call.

        Returns:
            Dictionary with ROI metrics
        """
        savings = self.get_savings()

        if savings["total_tasks"] == 0:
            return {"status": "no_data", "roi_percent": 0.0}

        # Cost to store each experience: 5% of an LLM call
        storage_cost_per_exp = self.llm_cost_per_call * 0.05

        # Total storage cost
        total_storage_cost = self.baseline_calls * storage_cost_per_exp

        # Net savings after storage cost
        net_savings = savings["savings_usd"] - total_storage_cost

        # ROI percentage
        roi_percent = (net_savings / total_storage_cost * 100) if total_storage_cost > 0 else 0

        return {
            "gross_savings_usd": savings["savings_usd"],
            "storage_cost_usd": round(total_storage_cost, 4),
            "net_savings_usd": round(net_savings, 4),
            "roi_percent": round(roi_percent, 2),
            "storage_cost_per_experience": round(storage_cost_per_exp, 4),
            "total_experiences_stored": self.baseline_calls
        }

    def reset(self) -> None:
        """Reset all counters"""
        self.baseline_calls = 0
        self.reused_calls = 0
        self.total_calls = 0
        logger.info("[CostTracker] Reset all counters")

    def get_summary(self) -> str:
        """Get human-readable summary"""
        savings = self.get_savings()
        roi = self.get_roi()

        summary = f"""
[CostTracker Summary]
- Total tasks: {savings['total_tasks']}
- New generations: {savings['new_generations']}
- Experience reuses: {savings['reused']}
- Reuse rate: {savings['savings_percent']:.1f}%
- Cost savings: ${savings['savings_usd']:.4f} ({savings['savings_percent']:.1f}% reduction)
- ROI from experience buffer: {roi['roi_percent']:.1f}%
"""
        return summary
