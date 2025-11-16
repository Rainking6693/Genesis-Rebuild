"""
Statistical validation of HybridPolicy 80/20 ratio enforcement.

This test validates that the HybridPolicy correctly enforces the
exploit_ratio parameter with statistical rigor.
"""

import pytest
from infrastructure.agentevolver.hybrid_policy import HybridPolicy


class TestPolicyRatioValidation:
    """Validate 80/20 ratio enforcement with statistical rigor"""

    def test_80_20_ratio_1000_decisions(self):
        """Test 80/20 ratio over 1000 decisions"""
        policy = HybridPolicy(exploit_ratio=0.8)

        decisions = []
        for i in range(1000):
            decision = policy.make_decision(
                has_experience=True,
                best_experience_quality=90.0
            )
            decisions.append(decision.should_exploit)

        exploit_rate = sum(decisions) / len(decisions)

        # Allow 5% tolerance (75%-85%)
        assert 0.75 <= exploit_rate <= 0.85, f"Exploit rate {exploit_rate:.2%} outside acceptable range (75%-85%)"

        print(f"\n80/20 Ratio Test PASSED:")
        print(f"  Expected: 80% exploit")
        print(f"  Actual: {exploit_rate:.2%} exploit")
        print(f"  Decisions: {len(decisions)}")

    def test_90_10_ratio_1000_decisions(self):
        """Test 90/10 ratio over 1000 decisions"""
        policy = HybridPolicy(exploit_ratio=0.9)

        decisions = []
        for i in range(1000):
            decision = policy.make_decision(
                has_experience=True,
                best_experience_quality=85.0
            )
            decisions.append(decision.should_exploit)

        exploit_rate = sum(decisions) / len(decisions)

        # Allow 5% tolerance (85%-95%)
        assert 0.85 <= exploit_rate <= 0.95, f"Exploit rate {exploit_rate:.2%} outside acceptable range (85%-95%)"

        print(f"\n90/10 Ratio Test PASSED:")
        print(f"  Expected: 90% exploit")
        print(f"  Actual: {exploit_rate:.2%} exploit")

    def test_50_50_ratio_1000_decisions(self):
        """Test 50/50 ratio over 1000 decisions"""
        policy = HybridPolicy(exploit_ratio=0.5)

        decisions = []
        for i in range(1000):
            decision = policy.make_decision(
                has_experience=True,
                best_experience_quality=95.0
            )
            decisions.append(decision.should_exploit)

        exploit_rate = sum(decisions) / len(decisions)

        # Allow 5% tolerance (45%-55%)
        assert 0.45 <= exploit_rate <= 0.55, f"Exploit rate {exploit_rate:.2%} outside acceptable range (45%-55%)"

        print(f"\n50/50 Ratio Test PASSED:")
        print(f"  Expected: 50% exploit")
        print(f"  Actual: {exploit_rate:.2%} exploit")

    def test_ratio_not_affected_by_quality_variance(self):
        """Test that ratio holds even with varying quality scores"""
        policy = HybridPolicy(exploit_ratio=0.8)

        decisions = []
        for i in range(500):
            # Vary quality between 80-100
            quality = 80.0 + (i % 20)
            decision = policy.make_decision(
                has_experience=True,
                best_experience_quality=quality
            )
            decisions.append(decision.should_exploit)

        exploit_rate = sum(decisions) / len(decisions)

        # Allow 6% tolerance due to quality variance
        assert 0.74 <= exploit_rate <= 0.86, f"Exploit rate {exploit_rate:.2%} outside acceptable range"

        print(f"\nQuality Variance Test PASSED:")
        print(f"  Exploit rate with varying quality: {exploit_rate:.2%}")

    def test_forced_explore_overrides_ratio(self):
        """Test that forced exploration (no experience) overrides ratio"""
        policy = HybridPolicy(exploit_ratio=0.99)  # 99% exploit normally

        decisions = []
        for i in range(100):
            decision = policy.make_decision(has_experience=False)
            decisions.append(decision.should_exploit)

        exploit_rate = sum(decisions) / len(decisions)

        # Should be 0% exploit when no experience
        assert exploit_rate == 0.0, f"Should never exploit when no experience, got {exploit_rate:.2%}"

        print(f"\nForced Explore Test PASSED:")
        print(f"  Exploit rate with no experience: {exploit_rate:.2%}")

    def test_low_quality_overrides_ratio(self):
        """Test that low quality overrides ratio"""
        policy = HybridPolicy(exploit_ratio=0.99, quality_threshold=80.0)

        decisions = []
        for i in range(100):
            decision = policy.make_decision(
                has_experience=True,
                best_experience_quality=60.0  # Below threshold
            )
            decisions.append(decision.should_exploit)

        exploit_rate = sum(decisions) / len(decisions)

        # Should be 0% exploit when quality too low
        assert exploit_rate == 0.0, f"Should never exploit when quality too low, got {exploit_rate:.2%}"

        print(f"\nLow Quality Test PASSED:")
        print(f"  Exploit rate with low quality: {exploit_rate:.2%}")

    def test_low_success_rate_overrides_ratio(self):
        """Test that low success rate overrides ratio"""
        policy = HybridPolicy(exploit_ratio=0.99, success_threshold=0.7)

        decisions = []
        for i in range(100):
            decision = policy.make_decision(
                has_experience=True,
                best_experience_quality=90.0,
                recent_exploit_success_rate=0.5  # Below threshold
            )
            decisions.append(decision.should_exploit)

        exploit_rate = sum(decisions) / len(decisions)

        # Should be 0% exploit when success rate too low
        assert exploit_rate == 0.0, f"Should never exploit when success rate too low, got {exploit_rate:.2%}"

        print(f"\nLow Success Rate Test PASSED:")
        print(f"  Exploit rate with low success rate: {exploit_rate:.2%}")

    def test_ratio_consistency_across_multiple_runs(self):
        """Test that ratio is consistent across multiple independent runs"""
        exploit_rates = []

        for run in range(10):
            policy = HybridPolicy(exploit_ratio=0.8)
            decisions = []

            for i in range(100):
                decision = policy.make_decision(
                    has_experience=True,
                    best_experience_quality=85.0
                )
                decisions.append(decision.should_exploit)

            exploit_rate = sum(decisions) / len(decisions)
            exploit_rates.append(exploit_rate)

        # All runs should be within acceptable range
        for rate in exploit_rates:
            assert 0.70 <= rate <= 0.90, f"Run had rate {rate:.2%} outside acceptable range"

        avg_rate = sum(exploit_rates) / len(exploit_rates)
        print(f"\nConsistency Test PASSED:")
        print(f"  Average exploit rate across 10 runs: {avg_rate:.2%}")
        print(f"  Min: {min(exploit_rates):.2%}, Max: {max(exploit_rates):.2%}")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "-s"])
