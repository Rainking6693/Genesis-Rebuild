#!/usr/bin/env python3
"""
Simulate an A/B tool reliability test across 10%/100% traffic splits.
"""

import random

TOTAL_REQUESTS = 1000


def simulate(rate: float, label: str):
    successes = sum(1 for _ in range(TOTAL_REQUESTS) if random.random() < rate)
    print(f"{label}: success rate {successes/TOTAL_REQUESTS:.2%} ({successes}/{TOTAL_REQUESTS})")
    return successes


def main():
    control_rate = 0.7
    treatment_rate = 0.95
    simulate(control_rate, "Control (Old Tool)")
    simulate(treatment_rate, "Treatment (DeepEyesV2)")

    improvement = (treatment_rate - control_rate) * 100
    print(f"Improvement: {improvement:.1f}%")


if __name__ == "__main__":
    main()
