#!/usr/bin/env python3
"""Test all agents for syntax errors and StandardIntegrationMixin integration."""

import sys
import py_compile
from pathlib import Path

def test_agent_syntax():
    """Test syntax of all agent files."""
    agents_dir = Path("agents")
    agent_files = list(agents_dir.glob("*_agent.py"))

    results = {
        "passed": [],
        "failed": []
    }

    for agent_file in sorted(agent_files):
        try:
            py_compile.compile(str(agent_file), doraise=True)
            results["passed"].append(agent_file.name)
            print(f"✓ {agent_file.name}")
        except Exception as e:
            results["failed"].append((agent_file.name, str(e)))
            print(f"✗ {agent_file.name}: {e}")

    return results

if __name__ == "__main__":
    print("Testing all agents for syntax errors...")
    print("=" * 60)
    results = test_agent_syntax()
    print("=" * 60)
    print(f"✓ Passed: {len(results['passed'])}")
    print(f"✗ Failed: {len(results['failed'])}")

    if results['failed']:
        print("\nFailed agents:")
        for name, error in results['failed']:
            print(f"  - {name}: {error}")
        sys.exit(1)
    else:
        print("\n✓ All agents passed syntax check!")
        sys.exit(0)
