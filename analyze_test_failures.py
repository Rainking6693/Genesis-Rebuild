#!/usr/bin/env python3
"""Analyze test failures from pytest output."""
import re
import json
from collections import defaultdict
from pathlib import Path

# Read the test results
with open('/home/genesis/genesis-rebuild/final_test_results.txt', 'r') as f:
    content = f.read()

# Extract summary line
summary_match = re.search(r'= (\d+) failed, (\d+) passed, (\d+) skipped, (\d+) warnings, (\d+) errors in ([\d.]+)s', content)
if summary_match:
    failed, passed, skipped, warnings, errors, time = summary_match.groups()
    total = int(failed) + int(passed) + int(skipped) + int(errors)
    
    print("=" * 80)
    print("TEST SUITE SUMMARY")
    print("=" * 80)
    print(f"Total Tests:    {total}")
    print(f"Passed:         {passed} ({int(passed)/total*100:.2f}%)")
    print(f"Failed:         {failed} ({int(failed)/total*100:.2f}%)")
    print(f"Errors:         {errors} ({int(errors)/total*100:.2f}%)")
    print(f"Skipped:        {skipped} ({int(skipped)/total*100:.2f}%)")
    print(f"Execution Time: {time}s")
    print()

# Categorize failures
failures_by_module = defaultdict(list)
errors_by_module = defaultdict(list)

# Extract FAILED tests
for match in re.finditer(r'^FAILED (tests/test_(\w+)\.py::.+)$', content, re.MULTILINE):
    full_name = match.group(1)
    module = match.group(2)
    failures_by_module[module].append(full_name)

# Extract ERROR tests
for match in re.finditer(r'^ERROR (tests/test_(\w+)\.py::.+)$', content, re.MULTILINE):
    full_name = match.group(1)
    module = match.group(2)
    errors_by_module[module].append(full_name)

print("=" * 80)
print("FAILURES BY MODULE")
print("=" * 80)
for module, tests in sorted(failures_by_module.items(), key=lambda x: len(x[1]), reverse=True):
    print(f"\n{module}: {len(tests)} failures")
    for test in tests[:3]:  # Show first 3
        print(f"  - {test.split('::')[-1]}")
    if len(tests) > 3:
        print(f"  ... and {len(tests) - 3} more")

print("\n" + "=" * 80)
print("ERRORS BY MODULE")
print("=" * 80)
for module, tests in sorted(errors_by_module.items(), key=lambda x: len(x[1]), reverse=True):
    print(f"\n{module}: {len(tests)} errors")
    for test in tests[:3]:  # Show first 3
        print(f"  - {test.split('::')[-1]}")
    if len(tests) > 3:
        print(f"  ... and {len(tests) - 3} more")

# Output JSON for further analysis
output = {
    'summary': {
        'total': total,
        'passed': int(passed),
        'failed': int(failed),
        'errors': int(errors),
        'skipped': int(skipped),
        'pass_rate': round(int(passed)/total*100, 2),
        'execution_time': float(time)
    },
    'failures_by_module': {k: len(v) for k, v in failures_by_module.items()},
    'errors_by_module': {k: len(v) for k, v in errors_by_module.items()}
}

with open('/home/genesis/genesis-rebuild/test_analysis.json', 'w') as f:
    json.dump(output, f, indent=2)

print("\n" + "=" * 80)
print("Analysis saved to test_analysis.json")
print("=" * 80)
