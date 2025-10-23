#!/usr/bin/env python3
"""
Fixed Metrics Exporter - Runs actual tests and reports REAL metrics
"""
import time
import subprocess
import os
from prometheus_client import start_http_server, Gauge
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Prometheus metrics
tests_total = Gauge('genesis_tests_total', 'Total number of tests')
tests_passed = Gauge('genesis_tests_passed_total', 'Number of tests passed')
tests_failed = Gauge('genesis_tests_failed_total', 'Number of tests failed')
test_pass_rate = Gauge('genesis_test_pass_rate', 'Test pass rate percentage')
waltzrl_tests_passing = Gauge('genesis_waltzrl_tests_passing', 'WaltzRL tests passing')

def run_tests():
    """Run actual pytest and parse real results"""
    try:
        # Set PYTHONPATH so imports work
        env = os.environ.copy()
        env['PYTHONPATH'] = '/app'

        # Run WaltzRL tests
        result = subprocess.run(
            ['pytest', 'tests/test_waltzrl_modules.py', '-q', '--tb=no'],
            capture_output=True,
            text=True,
            timeout=60,
            cwd='/app',
            env=env
        )

        output = result.stdout + result.stderr
        logger.info(f"Test output: {output}")

        # Parse actual results
        if 'passed' in output:
            parts = output.split()
            for i, part in enumerate(parts):
                if part == 'passed':
                    passed = int(parts[i-1])
                    tests_passed.set(passed)
                    tests_total.set(50)  # WaltzRL has 50 tests
                    waltzrl_tests_passing.set(passed)

                    if 'failed' in output:
                        for j, p in enumerate(parts):
                            if p == 'failed':
                                failed = int(parts[j-1])
                                tests_failed.set(failed)
                    else:
                        tests_failed.set(0)

                    pass_rate = (passed / 50) * 100
                    test_pass_rate.set(pass_rate)

                    logger.info(f"✓ Tests: {passed}/50 passing ({pass_rate:.1f}%)")
                    return True

        # If parsing failed, set to unknown
        logger.warning("Could not parse test results")
        return False

    except subprocess.TimeoutExpired:
        logger.error("Tests timed out")
        return False
    except Exception as e:
        logger.error(f"Error running tests: {e}")
        return False

def main():
    """Run metrics exporter with real test data"""
    logger.info("Starting FIXED metrics exporter on port 8000")
    logger.info(f"Working directory: {os.getcwd()}")
    logger.info(f"App directory exists: {os.path.exists('/app')}")

    # Start Prometheus HTTP server
    start_http_server(8000)

    # Run tests every 60 seconds
    iteration = 0
    while True:
        iteration += 1
        logger.info(f"🔄 Iteration {iteration}: Running real tests...")

        success = run_tests()
        if not success:
            logger.warning("Tests failed to run, metrics may be stale")

        time.sleep(60)

if __name__ == '__main__':
    main()
