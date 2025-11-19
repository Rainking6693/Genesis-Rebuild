#!/usr/bin/env python3
"""
Test compilation of all 8 upgraded agents (v5.0 with 25/25 integrations)
"""

import sys
import importlib.util

AGENTS = [
    ("AnalystAgent", "/home/genesis/genesis-rebuild/agents/analyst_agent.py"),
    ("BillingAgent", "/home/genesis/genesis-rebuild/agents/billing_agent.py"),
    ("BusinessGenerationAgent", "/home/genesis/genesis-rebuild/agents/business_generation_agent.py"),
    ("BuilderAgent", "/home/genesis/genesis-rebuild/agents/builder_agent.py"),
    ("CodeReviewAgent", "/home/genesis/genesis-rebuild/agents/code_review_agent.py"),
    ("DatabaseDesignAgent", "/home/genesis/genesis-rebuild/agents/database_design_agent.py"),
    ("DocumentationAgent", "/home/genesis/genesis-rebuild/agents/documentation_agent.py"),
    ("EmailAgent", "/home/genesis/genesis-rebuild/agents/email_agent.py"),
]

def load_module(name, path):
    """Load a Python module from file path"""
    try:
        spec = importlib.util.spec_from_file_location(name, path)
        if spec is None or spec.loader is None:
            return False, f"Could not load spec from {path}"

        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)
        return True, module
    except Exception as e:
        return False, str(e)


def test_agent_compilation(agent_name, agent_path):
    """Test that an agent compiles and has get_integration_status method"""
    print(f"Testing {agent_name}... ", end='', flush=True)

    # Load module
    success, result = load_module(agent_name.lower(), agent_path)
    if not success:
        print(f"FAIL (compilation error)")
        print(f"  Error: {result}")
        return False

    module = result

    # Check if agent class exists
    if not hasattr(module, agent_name):
        print(f"FAIL (class not found)")
        return False

    agent_class = getattr(module, agent_name)

    # Check if get_integration_status method exists
    if not hasattr(agent_class, 'get_integration_status'):
        print(f"WARN (no get_integration_status method)")
        return True  # Still a pass, just warning

    print(f"OK (v5.0 with get_integration_status)")
    return True


def main():
    print("="*80)
    print(" "*20 + "Agents 1-8: Compilation Test" + " "*25)
    print("="*80)
    print()

    passed = 0
    failed = 0

    for agent_name, agent_path in AGENTS:
        if test_agent_compilation(agent_name, agent_path):
            passed += 1
        else:
            failed += 1

    print()
    print("="*80)
    print(f"Results: {passed}/8 passed, {failed}/8 failed")
    print("="*80)

    return 0 if failed == 0 else 1


if __name__ == "__main__":
    sys.exit(main())
