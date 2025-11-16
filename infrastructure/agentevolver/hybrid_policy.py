"""
Hybrid Policy - Exploit/Explore decision making with feedback loops

Uses quality feedback to learn when to exploit past experiences
vs. explore new solutions.
"""

import logging
from dataclasses import dataclass
from typing import Dict, Any, Optional

logger = logging.getLogger(__name__)


@dataclass
class PolicyDecision:
    """Decision from hybrid policy on whether to exploit or explore"""

    should_exploit: bool
    confidence: float  # 0-1 confidence in the decision
    reason: str  # Explanation of the decision


class HybridPolicy:
    """
    Hybrid exploit/explore policy with quality feedback

    Decides whether to reuse a past experience (exploit) or generate
    a new solution (explore) based on:
    1. Availability of similar past experiences
    2. Quality of past experiences
    3. Success rates of exploit vs. explore
    """

    def __init__(
        self,
        exploit_ratio: float = 0.8,
        quality_threshold: float = 80.0,
        success_threshold: float = 0.7
    ):
        """
        Initialize hybrid policy

        Args:
            exploit_ratio: Target ratio of exploitations (0-1)
            quality_threshold: Minimum quality score to consider for exploitation
            success_threshold: Success rate threshold for learning
        """
        self.exploit_ratio = exploit_ratio
        self.quality_threshold = quality_threshold
        self.success_threshold = success_threshold

        # Stats for learning
        self.total_decisions = 0
        self.exploit_count = 0
        self.explore_count = 0
        self.exploit_successes = 0
        self.explore_successes = 0

        logger.info(
            f"[HybridPolicy] Initialized: exploit_ratio={exploit_ratio:.2f}, "
            f"quality_threshold={quality_threshold:.1f}, "
            f"success_threshold={success_threshold:.2f}"
        )

    def make_decision(
        self,
        has_experience: bool,
        best_experience_quality: Optional[float] = None,
        recent_exploit_success_rate: Optional[float] = None
    ) -> PolicyDecision:
        """
        Make exploit vs. explore decision

        Args:
            has_experience: Whether similar past experiences exist
            best_experience_quality: Quality score of best available experience
            recent_exploit_success_rate: Success rate of recent exploitations

        Returns:
            PolicyDecision with should_exploit flag and reasoning
        """
        import random

        # If no experience available, must explore
        if not has_experience:
            reason = "No similar past experiences available"
            confidence = 1.0
            should_exploit = False

        # If experience quality is below threshold, explore
        elif best_experience_quality is None or best_experience_quality < self.quality_threshold:
            reason = f"Past experience quality ({best_experience_quality or 0:.1f}) below threshold ({self.quality_threshold})"
            confidence = 0.9
            should_exploit = False

        # If recent exploitations have low success rate, explore
        elif recent_exploit_success_rate is not None and recent_exploit_success_rate < self.success_threshold:
            reason = f"Recent exploit success rate ({recent_exploit_success_rate:.2f}) below threshold ({self.success_threshold:.2f})"
            confidence = 0.8
            should_exploit = False

        # Otherwise, exploit with probability exploit_ratio (80/20 enforcement)
        else:
            # Use random sampling to enforce the exploit_ratio
            should_exploit = random.random() < self.exploit_ratio
            if should_exploit:
                reason = f"High quality experience available (quality={best_experience_quality:.1f}) - exploiting"
                confidence = min(0.95, (best_experience_quality / 100.0) * 0.95)
            else:
                reason = f"Quality experience available (quality={best_experience_quality:.1f}) but exploring for diversity"
                confidence = 0.7

        self.total_decisions += 1
        if should_exploit:
            self.exploit_count += 1
        else:
            self.explore_count += 1

        return PolicyDecision(
            should_exploit=should_exploit,
            confidence=confidence,
            reason=reason
        )

    def record_outcome(
        self,
        exploited: bool,
        success: bool,
        quality_score: Optional[float] = None
    ) -> None:
        """
        Record outcome of a decision for learning

        Args:
            exploited: Whether this was an exploitation or exploration
            success: Whether the outcome was successful
            quality_score: Optional quality score of the outcome
        """
        if exploited:
            self.exploit_successes += 1 if success else 0
        else:
            self.explore_successes += 1 if success else 0

        logger.info(
            f"[HybridPolicy] Recorded outcome: "
            f"action={'exploit' if exploited else 'explore'}, "
            f"success={success}, "
            f"quality={quality_score or 'N/A'}"
        )

    def get_stats(self) -> Dict[str, Any]:
        """Get policy statistics"""
        exploit_rate = (self.exploit_count / self.total_decisions * 100) if self.total_decisions > 0 else 0
        explore_rate = (self.explore_count / self.total_decisions * 100) if self.total_decisions > 0 else 0

        exploit_success_rate = (self.exploit_successes / self.exploit_count) if self.exploit_count > 0 else 0
        explore_success_rate = (self.explore_successes / self.explore_count) if self.explore_count > 0 else 0

        return {
            "total_decisions": self.total_decisions,
            "exploit_count": self.exploit_count,
            "exploit_rate": exploit_rate,
            "exploit_success_rate": exploit_success_rate,
            "explore_count": self.explore_count,
            "explore_rate": explore_rate,
            "explore_success_rate": explore_success_rate,
            "exploit_threshold": self.quality_threshold,
            "success_threshold": self.success_threshold
        }

    def reset_stats(self) -> None:
        """Reset statistics"""
        self.total_decisions = 0
        self.exploit_count = 0
        self.explore_count = 0
        self.exploit_successes = 0
        self.explore_successes = 0
        logger.info("[HybridPolicy] Statistics reset")
