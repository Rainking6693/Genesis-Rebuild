#!/usr/bin/env python3
"""
Production Metrics Exporter - ACTUALLY RUNS ON HOST
Reports real test results to Prometheus
"""
import time
import subprocess
import sys
import os
from pathlib import Path

# Add project root to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from prometheus_client import start_http_server, Gauge
import logging

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(message)s')
logger = logging.getLogger(__name__)

# Prometheus metrics
tests_total = Gauge('genesis_tests_total', 'Total number of tests')
tests_passed = Gauge('genesis_tests_passed_total', 'Number of tests passed')
tests_failed = Gauge('genesis_tests_failed_total', 'Number of tests failed')
test_pass_rate = Gauge('genesis_test_pass_rate', 'Test pass rate percentage')
waltzrl_tests_passing = Gauge('genesis_waltzrl_tests_passing', 'WaltzRL tests passing')

def run_waltzrl_tests():
    """Run WaltzRL tests and report metrics"""
    try:
        logger.info("Running WaltzRL unit tests...")

        # Run tests from project root
        result = subprocess.run(
            ['pytest', 'tests/test_waltzrl_modules.py', '-q', '--tb=no'],
            capture_output=True,
            text=True,
            timeout=120,
            cwd='/home/genesis/genesis-rebuild'
        )

        output = result.stdout + result.stderr

        # Parse results
        if 'passed' in output:
            parts = output.split()
            for i, part in enumerate(parts):
                if part == 'passed':
                    passed = int(parts[i-1])
                    tests_passed.set(passed)
                    tests_total.set(50)
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

                    logger.info(f"✅ WaltzRL: {passed}/50 passing ({pass_rate:.1f}%)")
                    return True

        logger.warning("⚠️  Could not parse test results")
        return False

    except subprocess.TimeoutExpired:
        logger.error("❌ Tests timed out")
        return False
    except Exception as e:
        logger.error(f"❌ Error running tests: {e}")
        return False

def main():
    """Run metrics exporter"""
    logger.info("=" * 60)
    logger.info("PRODUCTION METRICS EXPORTER STARTED")
    logger.info("Running on host (not in container)")
    logger.info("Port: 8000")
    logger.info("=" * 60)

    # Start Prometheus HTTP server
    start_http_server(8000)
    logger.info("✅ Prometheus endpoint ready at http://localhost:8000/metrics")

    # Run tests every 60 seconds
    iteration = 0
    while True:
        iteration += 1
        logger.info(f"\n{'='*60}")
        logger.info(f"ITERATION {iteration}")
        logger.info(f"{'='*60}")

        success = run_waltzrl_tests()
        if not success:
            logger.warning("Tests failed to run, metrics may be stale")

        logger.info(f"Sleeping 60 seconds until next run...")
        time.sleep(60)

if __name__ == '__main__':
    main()
