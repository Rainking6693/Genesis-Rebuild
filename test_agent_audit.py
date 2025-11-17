#!/usr/bin/env python3
"""
Audit test for agent method calls - verify train_epoch() compatibility
"""
import asyncio
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))


async def test_agent_imports():
    """Test that agents can be imported and have the right structure."""
    print("[TEST 1] Testing agent imports and structure...")

    try:
        from agents.seo_agent import SEOAgent
        from agents.marketing_agent import MarketingAgent
        from agents.content_agent import ContentAgent

        print("  ✓ All agents imported successfully")

        # Check that self_improve method exists
        for agent_class, name in [(SEOAgent, "SEO"), (MarketingAgent, "Marketing"), (ContentAgent, "Content")]:
            if hasattr(agent_class, 'self_improve'):
                print(f"  ✓ {name}Agent has self_improve() method")
            else:
                print(f"  ✗ {name}Agent missing self_improve() method")
                return False

    except ImportError as e:
        print(f"  ✗ Import error: {e}")
        return False

    return True


async def test_curiosity_trainer_signature():
    """Test that CuriosityDrivenTrainer has the correct method signature."""
    print("\n[TEST 2] Testing CuriosityDrivenTrainer method signature...")

    try:
        from infrastructure.agentevolver.curiosity_trainer import CuriosityDrivenTrainer
        import inspect

        # Check train_epoch signature
        sig = inspect.signature(CuriosityDrivenTrainer.train_epoch)
        params = list(sig.parameters.keys())

        print(f"  train_epoch parameters: {params}")

        expected_params = ['self', 'num_tasks', 'agent_type', 'ap2_budget_remaining', 'cost_per_task', 'self_questioning_engine']
        if params == expected_params:
            print(f"  ✓ train_epoch has correct parameter signature")
        else:
            print(f"  ✗ Parameter mismatch!")
            print(f"    Expected: {expected_params}")
            print(f"    Got:      {params}")
            return False

        # Check return type
        return_annotation = sig.return_annotation
        print(f"  Return type: {return_annotation}")

    except Exception as e:
        print(f"  ✗ Error: {e}")
        return False

    return True


async def test_method_call_analysis():
    """Analyze how agents are calling train_epoch()."""
    print("\n[TEST 3] Analyzing agent method calls...")

    try:
        # Read the actual agent code to see how they're calling train_epoch
        import re

        files_to_check = [
            "/home/genesis/genesis-rebuild/agents/seo_agent.py",
            "/home/genesis/genesis-rebuild/agents/marketing_agent.py",
            "/home/genesis/genesis-rebuild/agents/content_agent.py"
        ]

        for file_path in files_to_check:
            with open(file_path, 'r') as f:
                content = f.read()

            # Find all train_epoch calls - look for the parameter list (may have self_questioning_engine)
            pattern = r'await\s+self\.curiosity_trainer\.train_epoch\s*\((.*?)\s*\)'
            matches = re.findall(pattern, content, re.DOTALL)

            agent_name = Path(file_path).stem.replace('_agent', '').title()

            if matches:
                print(f"\n  {agent_name}Agent train_epoch call:")
                for match in matches:
                    # Clean up the match for display
                    call_args = match.strip()
                    lines = call_args.split('\n')
                    for line in lines:
                        print(f"    {line.strip()}")

                    # Analyze arguments (excluding comments)
                    clean_args = call_args.split('#')[0]  # Remove comments

                    # Check for invalid 'tasks=' parameter (not cost_per_task or other names)
                    if re.search(r'\btasks\s*=', clean_args):
                        print(f"  ✗ ISSUE: Passing 'tasks=' parameter (doesn't exist in signature)")
                    if 'num_tasks=' not in clean_args:
                        print(f"  ✗ ISSUE: Missing 'num_tasks' parameter")
                    else:
                        print(f"  ✓ Correctly passing 'num_tasks'")
                    if 'agent_type=' not in clean_args:
                        print(f"  ✗ ISSUE: Missing 'agent_type' parameter")
                    else:
                        print(f"  ✓ Correctly passing 'agent_type'")
                    if 'ap2_budget_remaining=' in clean_args:
                        print(f"  ✓ Correctly passing 'ap2_budget_remaining'")
                    if 'cost_per_task=' in clean_args:
                        print(f"  ✓ Correctly passing 'cost_per_task'")
                    if 'self_questioning_engine=' in clean_args:
                        print(f"  ✓ Correctly passing 'self_questioning_engine'")
            else:
                print(f"  ✗ No train_epoch calls found in {agent_name}Agent")

    except Exception as e:
        print(f"  ✗ Error: {e}")
        import traceback
        traceback.print_exc()
        return False

    return True


async def main():
    """Run all audit tests."""
    print("=" * 80)
    print("AGENT METHOD AUDIT - CuriosityDrivenTrainer Compatibility")
    print("=" * 80)

    results = []

    results.append(await test_agent_imports())
    results.append(await test_curiosity_trainer_signature())
    results.append(await test_method_call_analysis())

    print("\n" + "=" * 80)
    if all(results):
        print("AUDIT RESULT: PASS - All tests passed")
        print("=" * 80)
        return 0
    else:
        print("AUDIT RESULT: FAIL - Issues detected")
        print("=" * 80)
        return 1


if __name__ == "__main__":
    exit_code = asyncio.run(main())
    sys.exit(exit_code)
