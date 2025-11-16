#!/usr/bin/env python3
"""
AP2 simulation utilities.

Provides helpers for driving budget warnings and high-cost events so that the monitoring
stack can be exercised without running full agent workloads.
"""

from __future__ import annotations

import argparse
import logging
import random
import time
from typing import Iterable

from infrastructure.ap2_helpers import record_ap2_event
from infrastructure.ap2_protocol import ALERT_THRESHOLD, get_ap2_client

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)


def _emit_event(agent: str, action: str, cost: float, context: dict[str, str]) -> None:
    record_ap2_event(agent=agent, action=action, cost=cost, context=context)


def simulate_budget_warning(
    agent: str = "SimulationAgent",
    budget: float = 5.0,
    step_costs: Iterable[float] = (0.8, 0.6, 1.0, 0.7, 0.9),
) -> float:
    """
    Emit events until the configured budget alert threshold is reached.

    Returns:
        The total spent after the simulation.
    """
    client = get_ap2_client()
    client.budget = budget
    client.spent = 0.0
    logger.info("Starting budget warning simulation (budget=%.2f)", budget)

    for idx, cost in enumerate(step_costs, start=1):
        _emit_event(
            agent=agent,
            action="simulated_budget_step",
            cost=cost,
            context={
                "step": str(idx),
                "budget": str(budget),
                "phase": "warning"
            }
        )
        ratio = client.spent / max(1.0, client.budget)
        logger.info("Step %d: spent=%.2f ratio=%.2f (threshold=%.2f)", idx, client.spent, ratio, ALERT_THRESHOLD)
        if ratio >= ALERT_THRESHOLD:
            logger.warning("Simulated budget threshold reached at step %d", idx)
            break
        time.sleep(0.1)

    return client.spent


def simulate_high_cost_run(
    agent: str = "SimulationAgent",
    high_cost: float = 15.0,
    budget: float = 10.0
) -> None:
    """Emit a single high-cost AP2 event that exceeds the budget."""
    client = get_ap2_client()
    client.budget = budget
    client.spent = 0.0
    logger.info("Starting high-cost simulation (budget=%.2f cost=%.2f)", budget, high_cost)

    _emit_event(
        agent=agent,
        action="simulated_high_cost",
        cost=high_cost,
        context={
            "budget": str(budget),
            "phase": "high_cost_run"
        }
    )


def main() -> None:
    parser = argparse.ArgumentParser("AP2 simulation utilities")
    parser.add_argument("--mode", choices=["warning", "high-cost"], required=True)
    parser.add_argument("--agent", default="SimulationAgent")
    parser.add_argument("--budget", type=float, default=10.0)
    parser.add_argument("--sequence", nargs="+", type=float, default=[0.8, 0.6, 1.0, 0.9, 0.7])
    parser.add_argument("--high-cost", dest="high_cost", type=float, default=15.0)

    args = parser.parse_args()

    if args.mode == "warning":
        simulate_budget_warning(agent=args.agent, budget=args.budget, step_costs=args.sequence)
    else:
        simulate_high_cost_run(agent=args.agent, high_cost=args.high_cost, budget=args.budget)


if __name__ == "__main__":
    main()
