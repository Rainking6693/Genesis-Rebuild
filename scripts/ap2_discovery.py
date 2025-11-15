#!/usr/bin/env python3
"""
AP2 Discovery & Scope helper.

Parses the Agent-Lightning plan to enumerate the revenue-generating agents
that need AP2 protocol instrumentation.
"""

from __future__ import annotations

import pathlib
import re
from typing import List

PLAN_PATH = pathlib.Path("AGENT_LIGHTNING_INTEGRATION_PLAN.md")


def extract_agents(text: str) -> List[str]:
    pattern = re.compile(r"##\s+Priority\s+\d+:\s+(.+)\n(?:[^#]+?)(?:Target Agents:|Target Agents)\n(.+?)(?=\n##|$)", re.IGNORECASE | re.DOTALL)
    agents = []
    for match in pattern.finditer(text):
        block = match.group(2)
        for line in block.splitlines():
            if "(" in line and "`" in line:
                name = line.split("`")[1]
            else:
                name = line.strip().split(" ")[0]
            if name:
                agents.append(name)
    return agents


def main() -> None:
    agents = []
    if PLAN_PATH.exists():
        text = PLAN_PATH.read_text(encoding="utf-8")
        agents = extract_agents(text)

    if not agents:
        agents = [
            "Support Agent",
            "Documentation Agent",
            "Business Generation Agent",
            "QA Agent",
            "Code Review Agent",
            "SE-Darwin Agent",
        ]

    unique = sorted(set(agents))
    print("AP2 Target Agents:")
    for agent in unique:
        print(f"- {agent}")


if __name__ == "__main__":
    main()
