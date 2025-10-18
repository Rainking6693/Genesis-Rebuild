#!/usr/bin/env python3
"""
Test Validation Script
Version: 1.0
Last Updated: October 17, 2025

Quick validation script to run test suite and generate reports.
Use this after implementing fixes to track progress.
"""

import subprocess
import sys
import time
from pathlib import Path
from datetime import datetime

def run_command(cmd, description):
    """Run command and return success status"""
    print(f"\n{'='*80}")
    print(f"Running: {description}")
    print(f"Command: {' '.join(cmd)}")
    print(f"{'='*80}\n")

    start_time = time.time()
    result = subprocess.run(cmd, capture_output=False)
    elapsed = time.time() - start_time

    print(f"\n{'='*80}")
    print(f"Completed in {elapsed:.2f} seconds")
    print(f"Exit code: {result.returncode}")
    print(f"{'='*80}\n")

    return result.returncode == 0

def main():
    """Run test validation"""
    print(f"\n{'='*80}")
    print("TEST VALIDATION SCRIPT")
    print(f"Started: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"{'='*80}\n")

    # Change to project directory
    project_dir = Path(__file__).parent
    print(f"Project directory: {project_dir}")

    # Determine pytest path
    pytest_path = project_dir / "venv" / "bin" / "pytest"
    if not pytest_path.exists():
        print(f"ERROR: pytest not found at {pytest_path}")
        print("Please ensure virtual environment is set up correctly")
        sys.exit(1)

    results = {}

    # 1. Quick test count
    print("\n" + "="*80)
    print("STEP 1: Collecting tests")
    print("="*80)
    result = subprocess.run(
        [str(pytest_path), "tests/", "--collect-only", "-q"],
        capture_output=True,
        text=True,
        cwd=project_dir
    )
    test_count_line = [line for line in result.stdout.split('\n') if 'test' in line and 'collected' in line]
    if test_count_line:
        print(f"Found: {test_count_line[-1]}")

    # 2. Run tests with coverage
    success = run_command(
        [
            str(pytest_path),
            "tests/",
            "--cov=infrastructure",
            "--cov=agents",
            "--cov-report=term-missing",
            "--cov-report=html",
            "-v",
            "--tb=short",
            "--maxfail=200"
        ],
        "Full test suite with coverage"
    )
    results['full_suite'] = success

    # 3. Generate summary
    print("\n" + "="*80)
    print("STEP 2: Generating summary")
    print("="*80)

    # Run quiet mode to get just the summary
    result = subprocess.run(
        [str(pytest_path), "tests/", "-q", "--tb=no"],
        capture_output=True,
        text=True,
        cwd=project_dir
    )

    # Extract summary line
    summary_lines = [line for line in result.stdout.split('\n') if 'passed' in line or 'failed' in line]
    if summary_lines:
        print(f"\nTest Summary: {summary_lines[-1]}")

    # 4. Print results location
    print("\n" + "="*80)
    print("VALIDATION COMPLETE")
    print("="*80)
    print(f"\nReports generated:")
    print(f"  - Coverage HTML: {project_dir}/htmlcov/index.html")
    print(f"  - Full Report: {project_dir}/TEST_VALIDATION_REPORT.md")
    print(f"  - Quick Summary: {project_dir}/TEST_VALIDATION_SUMMARY.md")

    print(f"\nTo view coverage:")
    print(f"  firefox {project_dir}/htmlcov/index.html")

    print(f"\nTo view detailed report:")
    print(f"  cat {project_dir}/TEST_VALIDATION_REPORT.md")

    print(f"\n{'='*80}")
    print(f"Finished: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"{'='*80}\n")

    # Exit with appropriate code
    sys.exit(0 if results['full_suite'] else 1)

if __name__ == "__main__":
    main()
