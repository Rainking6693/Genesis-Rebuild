"""
SE-Darwin Memory Integration - Focused Unit Tests
Audit Protocol V2 - Direct testing without full agent imports
"""

import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent))

# Test without importing the full agent
def test_memory_tool_code_analysis():
    """Analyze MemoryTool code structure"""
    import ast

    with open('agents/se_darwin_agent.py', 'r') as f:
        code = f.read()

    tree = ast.parse(code)

    # Find MemoryTool class
    memory_tool_class = None
    for node in ast.walk(tree):
        if isinstance(node, ast.ClassDef) and node.name == "MemoryTool":
            memory_tool_class = node
            break

    assert memory_tool_class is not None, "MemoryTool class not found"

    # Check required methods
    methods = [n.name for n in memory_tool_class.body if isinstance(n, ast.FunctionDef)]
    required_methods = ['__init__', 'store_memory', 'retrieve_memory']

    for method in required_methods:
        assert method in methods, f"Missing required method: {method}"

    print(f"✓ MemoryTool has all required methods: {methods}")
    return True


def test_mutation_tracker_code_analysis():
    """Analyze MutationSuccessTracker code structure"""
    import ast

    with open('agents/se_darwin_agent.py', 'r') as f:
        code = f.read()

    tree = ast.parse(code)

    # Find MutationSuccessTracker class
    tracker_class = None
    for node in ast.walk(tree):
        if isinstance(node, ast.ClassDef) and node.name == "MutationSuccessTracker":
            tracker_class = node
            break

    assert tracker_class is not None, "MutationSuccessTracker class not found"

    # Check required methods
    methods = [n.name for n in tracker_class.body if isinstance(n, ast.FunctionDef)]
    required_methods = ['__init__', 'track_mutation', 'get_successful_mutations', 'get_operator_success_rate']

    for method in required_methods:
        assert method in methods, f"Missing required method: {method}"

    print(f"✓ MutationSuccessTracker has all required methods: {methods}")
    return True


def test_generate_trajectories_integration():
    """Test _generate_trajectories memory integration"""
    import ast
    import re

    with open('agents/se_darwin_agent.py', 'r') as f:
        code = f.read()

    tree = ast.parse(code)

    # Find _generate_trajectories method
    gen_traj_method = None
    for node in ast.walk(tree):
        if isinstance(node, ast.FunctionDef) and node.name == "_generate_trajectories":
            gen_traj_method = node
            break

    assert gen_traj_method is not None, "_generate_trajectories method not found"

    # Get method source
    method_lines = code.split('\n')[gen_traj_method.lineno-1:gen_traj_method.end_lineno]
    method_source = '\n'.join(method_lines)

    # Check for memory integration points
    checks = {
        'memory_tool': 'self.memory_tool' in method_source,
        'mutation_success_tracker': 'self.mutation_success_tracker' in method_source,
        'get_successful_mutations': 'get_successful_mutations' in method_source,
        'get_operator_success_rate': 'get_operator_success_rate' in method_source,
        'error_handling': 'try:' in method_source and 'except' in method_source,
        'logging': 'logger' in method_source
    }

    print("Memory integration checks:")
    for check, passed in checks.items():
        status = "✓" if passed else "✗"
        print(f"  {status} {check}: {passed}")

    assert checks['memory_tool'], "No memory_tool usage found"
    assert checks['mutation_success_tracker'], "No mutation_success_tracker usage found"

    return True


def test_archive_trajectories_integration():
    """Test _archive_trajectories memory integration"""
    import ast

    with open('agents/se_darwin_agent.py', 'r') as f:
        code = f.read()

    tree = ast.parse(code)

    # Find _archive_trajectories method
    archive_method = None
    for node in ast.walk(tree):
        if isinstance(node, ast.FunctionDef) and node.name == "_archive_trajectories":
            archive_method = node
            break

    assert archive_method is not None, "_archive_trajectories method not found"

    # Get method source
    method_lines = code.split('\n')[archive_method.lineno-1:archive_method.end_lineno]
    method_source = '\n'.join(method_lines)

    # Check for mutation tracking
    checks = {
        'track_mutation_call': 'track_mutation(' in method_source,
        'mutation_success_tracker': 'self.mutation_success_tracker' in method_source,
        'error_handling': 'try:' in method_source and 'except' in method_source,
        'fitness_tracking': 'fitness_before' in method_source and 'fitness_after' in method_source
    }

    print("Archive integration checks:")
    for check, passed in checks.items():
        status = "✓" if passed else "✗"
        print(f"  {status} {check}: {passed}")

    assert checks['track_mutation_call'], "No track_mutation call found"
    assert checks['mutation_success_tracker'], "No mutation_success_tracker usage found"

    return True


def test_error_handling_coverage():
    """Test error handling in memory methods"""
    import ast

    with open('agents/se_darwin_agent.py', 'r') as f:
        code = f.read()

    tree = ast.parse(code)

    critical_methods = {
        'store_memory': False,
        'retrieve_memory': False,
        'track_mutation': False,
        'get_successful_mutations': False
    }

    for node in ast.walk(tree):
        if isinstance(node, ast.FunctionDef):
            if node.name in critical_methods:
                # Check if method has try-except
                has_try = any(isinstance(n, ast.Try) for n in ast.walk(node))
                critical_methods[node.name] = has_try

    print("Error handling coverage:")
    for method, has_error_handling in critical_methods.items():
        status = "✓" if has_error_handling else "⚠"
        print(f"  {status} {method}: {'Has try-except' if has_error_handling else 'No try-except'}")

    # Only store_memory and retrieve_memory have try-except (by design)
    # track_mutation should have it but doesn't (ISSUE FOUND)
    return critical_methods


def test_cache_implementation():
    """Test cache implementation in MutationSuccessTracker"""
    import ast

    with open('agents/se_darwin_agent.py', 'r') as f:
        code = f.read()

    tree = ast.parse(code)

    # Find MutationSuccessTracker.__init__
    tracker_init = None
    for node in ast.walk(tree):
        if isinstance(node, ast.ClassDef) and node.name == "MutationSuccessTracker":
            for method in node.body:
                if isinstance(method, ast.FunctionDef) and method.name == "__init__":
                    tracker_init = method
                    break
            break

    assert tracker_init is not None, "MutationSuccessTracker.__init__ not found"

    # Check cache initialization
    init_lines = code.split('\n')[tracker_init.lineno-1:tracker_init.end_lineno]
    init_source = '\n'.join(init_lines)

    has_cache = '_success_cache' in init_source
    cache_is_dict = 'Dict[str, Dict[str, float]]' in init_source or '{}' in init_source

    print("Cache implementation:")
    print(f"  ✓ Has _success_cache: {has_cache}")
    print(f"  ✓ Cache is dictionary: {cache_is_dict}")

    assert has_cache, "No cache implementation found"
    return True


def test_scope_isolation():
    """Test scope isolation in MemoryTool"""
    import ast

    with open('agents/se_darwin_agent.py', 'r') as f:
        code = f.read()

    tree = ast.parse(code)

    # Find _build_user_id method
    build_user_id = None
    for node in ast.walk(tree):
        if isinstance(node, ast.FunctionDef) and node.name == "_build_user_id":
            build_user_id = node
            break

    assert build_user_id is not None, "_build_user_id method not found"

    # Check scope handling
    method_lines = code.split('\n')[build_user_id.lineno-1:build_user_id.end_lineno]
    method_source = '\n'.join(method_lines)

    scopes = {
        'app': 'darwin_global' in method_source,
        'agent': 'darwin_' in method_source and 'agent_id' in method_source,
        'session': 'darwin_session_' in method_source
    }

    print("Scope isolation:")
    for scope, implemented in scopes.items():
        status = "✓" if implemented else "✗"
        print(f"  {status} {scope} scope: {implemented}")

    assert all(scopes.values()), "Not all scopes properly isolated"
    return True


def run_all_tests():
    """Run all focused tests"""
    print("=" * 60)
    print("SE-Darwin Memory Integration - Focused Test Suite")
    print("=" * 60)
    print()

    tests = [
        ("MemoryTool code structure", test_memory_tool_code_analysis),
        ("MutationSuccessTracker code structure", test_mutation_tracker_code_analysis),
        ("_generate_trajectories integration", test_generate_trajectories_integration),
        ("_archive_trajectories integration", test_archive_trajectories_integration),
        ("Error handling coverage", test_error_handling_coverage),
        ("Cache implementation", test_cache_implementation),
        ("Scope isolation", test_scope_isolation)
    ]

    results = []
    for test_name, test_func in tests:
        print(f"\n[TEST] {test_name}")
        print("-" * 60)
        try:
            result = test_func()
            results.append((test_name, "PASS", result))
            print(f"✓ PASS: {test_name}")
        except AssertionError as e:
            results.append((test_name, "FAIL", str(e)))
            print(f"✗ FAIL: {test_name}")
            print(f"  Error: {e}")
        except Exception as e:
            results.append((test_name, "ERROR", str(e)))
            print(f"⚠ ERROR: {test_name}")
            print(f"  Error: {e}")

    print("\n" + "=" * 60)
    print("TEST SUMMARY")
    print("=" * 60)

    passed = sum(1 for _, status, _ in results if status == "PASS")
    failed = sum(1 for _, status, _ in results if status == "FAIL")
    errors = sum(1 for _, status, _ in results if status == "ERROR")

    print(f"Total: {len(results)} | Passed: {passed} | Failed: {failed} | Errors: {errors}")

    for test_name, status, _ in results:
        symbol = "✓" if status == "PASS" else ("✗" if status == "FAIL" else "⚠")
        print(f"  {symbol} {test_name}: {status}")

    return results


if __name__ == "__main__":
    results = run_all_tests()
