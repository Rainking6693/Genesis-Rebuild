#!/usr/bin/env python3
"""
Multi-Suite Metrics Exporter - Fast + Slow Test Suites
Runs fast tests (WaltzRL) every 60s, slow tests (regression) every 6 hours
"""
import time
import subprocess
import sys
import os
from pathlib import Path
from datetime import datetime

# Add project root to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from prometheus_client import start_http_server, Gauge, Counter
import logging

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(message)s')
logger = logging.getLogger(__name__)

# ============================================================================
# FAST SUITE METRICS (WaltzRL - runs every 60s)
# ============================================================================
waltzrl_tests_total = Gauge('genesis_waltzrl_tests_total', 'Total WaltzRL tests')
waltzrl_tests_passed = Gauge('genesis_waltzrl_tests_passed', 'WaltzRL tests passed')
waltzrl_tests_failed = Gauge('genesis_waltzrl_tests_failed', 'WaltzRL tests failed')
waltzrl_pass_rate = Gauge('genesis_waltzrl_pass_rate', 'WaltzRL pass rate percentage')
waltzrl_last_run = Gauge('genesis_waltzrl_last_run_timestamp', 'WaltzRL last run timestamp')
waltzrl_run_duration = Gauge('genesis_waltzrl_run_duration_seconds', 'WaltzRL test run duration')

# ============================================================================
# SLOW SUITE METRICS (Regression - runs every 6 hours)
# ============================================================================
regression_tests_total = Gauge('genesis_regression_tests_total', 'Total regression tests')
regression_tests_passed = Gauge('genesis_regression_tests_passed', 'Regression tests passed')
regression_tests_failed = Gauge('genesis_regression_tests_failed', 'Regression tests failed')
regression_tests_errors = Gauge('genesis_regression_tests_errors', 'Regression tests with errors')
regression_tests_skipped = Gauge('genesis_regression_tests_skipped', 'Regression tests skipped')
regression_pass_rate = Gauge('genesis_regression_pass_rate', 'Regression pass rate percentage')
regression_last_run = Gauge('genesis_regression_last_run_timestamp', 'Regression last run timestamp')
regression_run_duration = Gauge('genesis_regression_run_duration_seconds', 'Regression test run duration')

# ============================================================================
# COMBINED METRICS (Overall system health)
# ============================================================================
total_tests_run = Counter('genesis_total_tests_run', 'Total tests executed (all suites)')
total_test_failures = Counter('genesis_total_test_failures', 'Total test failures (all suites)')
system_health = Gauge('genesis_system_health', 'Overall system health score (0-100)')

# ============================================================================
# FAST SUITE: WaltzRL Tests (50 tests, ~1s runtime)
# ============================================================================
def run_waltzrl_tests():
    """Run WaltzRL unit tests - fast suite"""
    start_time = time.time()
    try:
        logger.info("🚀 Running FAST suite (WaltzRL unit tests)...")

        result = subprocess.run(
            ['pytest', 'tests/test_waltzrl_modules.py', '-q', '--tb=no'],
            capture_output=True,
            text=True,
            timeout=120,
            cwd='/home/genesis/genesis-rebuild'
        )

        output = result.stdout + result.stderr
        duration = time.time() - start_time

        # Parse results
        if 'passed' in output:
            parts = output.split()
            passed = 0
            failed = 0

            for i, part in enumerate(parts):
                if part == 'passed':
                    passed = int(parts[i-1])
                if part == 'failed':
                    failed = int(parts[i-1])

            # Update metrics
            waltzrl_tests_total.set(50)
            waltzrl_tests_passed.set(passed)
            waltzrl_tests_failed.set(failed)
            waltzrl_pass_rate.set((passed / 50) * 100)
            waltzrl_last_run.set(time.time())
            waltzrl_run_duration.set(duration)

            # Update counters
            total_tests_run.inc(50)
            total_test_failures.inc(failed)

            logger.info(f"✅ WaltzRL: {passed}/50 passing ({(passed/50)*100:.1f}%) in {duration:.2f}s")
            return True

        logger.warning("⚠️  Could not parse WaltzRL test results")
        return False

    except subprocess.TimeoutExpired:
        logger.error("❌ WaltzRL tests timed out")
        duration = time.time() - start_time
        waltzrl_run_duration.set(duration)
        return False
    except Exception as e:
        logger.error(f"❌ Error running WaltzRL tests: {e}")
        return False

# ============================================================================
# SLOW SUITE: Regression Tests (1,489 tests, ~34 min runtime)
# ============================================================================
def run_regression_tests():
    """Run full regression test suite - slow suite"""
    start_time = time.time()
    try:
        logger.info("🐢 Running SLOW suite (full regression tests)...")
        logger.info("   Expected runtime: 30-40 minutes")

        result = subprocess.run(
            ['pytest', 'tests/', '-k', 'not waltzrl and not performance',
             '--tb=no', '-q', '--junitxml=results/regression_latest.xml'],
            capture_output=True,
            text=True,
            timeout=3600,  # 1 hour timeout
            cwd='/home/genesis/genesis-rebuild'
        )

        output = result.stdout + result.stderr
        duration = time.time() - start_time

        # Parse results from output line like:
        # "= 5 failed, 1431 passed, 27 skipped, 171 deselected, 10 warnings, 26 errors, 1 rerun in 2039.81s ="
        passed = failed = errors = skipped = 0

        for line in output.split('\n'):
            if 'passed' in line and 'failed' in line:
                parts = line.split()
                for i, part in enumerate(parts):
                    if part == 'passed,':
                        passed = int(parts[i-1])
                    elif part == 'failed,':
                        failed = int(parts[i-1])
                    elif part == 'skipped,':
                        skipped = int(parts[i-1])
                    elif part == 'errors,':
                        errors = int(parts[i-1])

        if passed > 0:  # Valid results
            total = passed + failed + errors

            # Update metrics
            regression_tests_total.set(total)
            regression_tests_passed.set(passed)
            regression_tests_failed.set(failed)
            regression_tests_errors.set(errors)
            regression_tests_skipped.set(skipped)
            regression_pass_rate.set((passed / total * 100) if total > 0 else 0)
            regression_last_run.set(time.time())
            regression_run_duration.set(duration)

            # Update counters
            total_tests_run.inc(total)
            total_test_failures.inc(failed + errors)

            logger.info(f"✅ Regression: {passed}/{total} passing ({(passed/total)*100:.1f}%) in {duration/60:.1f} min")
            logger.info(f"   Failed: {failed}, Errors: {errors}, Skipped: {skipped}")
            return True
        else:
            logger.warning("⚠️  Could not parse regression test results")
            return False

    except subprocess.TimeoutExpired:
        logger.error("❌ Regression tests timed out (>1 hour)")
        duration = time.time() - start_time
        regression_run_duration.set(duration)
        return False
    except Exception as e:
        logger.error(f"❌ Error running regression tests: {e}")
        return False

# ============================================================================
# SYSTEM HEALTH CALCULATION
# ============================================================================
def calculate_system_health():
    """Calculate overall system health score (0-100)"""
    try:
        # Get current metric values
        waltzrl_rate = waltzrl_pass_rate._value.get() if waltzrl_pass_rate._value._value is not None else 0
        regression_rate = regression_pass_rate._value.get() if regression_pass_rate._value._value is not None else 0

        # Weighted average: WaltzRL 30%, Regression 70% (regression more comprehensive)
        health = (waltzrl_rate * 0.3) + (regression_rate * 0.7)

        system_health.set(health)
        return health
    except Exception as e:
        logger.error(f"Error calculating system health: {e}")
        return 0

# ============================================================================
# MAIN LOOP
# ============================================================================
def main():
    """Run multi-suite metrics exporter"""
    logger.info("=" * 80)
    logger.info("MULTI-SUITE METRICS EXPORTER STARTED")
    logger.info("=" * 80)
    logger.info("FAST Suite (WaltzRL):    50 tests, every 60 seconds")
    logger.info("SLOW Suite (Regression): ~1,489 tests, every 6 hours")
    logger.info("Port: 8000")
    logger.info("=" * 80)

    # Start Prometheus HTTP server
    start_http_server(8000)
    logger.info("✅ Prometheus endpoint ready at http://localhost:8000/metrics")

    # Initialize counters
    fast_iteration = 0
    slow_iteration = 0
    last_regression_run = 0

    # Regression interval: 6 hours = 21,600 seconds
    REGRESSION_INTERVAL = 6 * 60 * 60

    while True:
        fast_iteration += 1
        current_time = time.time()

        # ====================================================================
        # FAST SUITE: Run every iteration (60s)
        # ====================================================================
        logger.info(f"\n{'='*80}")
        logger.info(f"FAST ITERATION {fast_iteration} - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        logger.info(f"{'='*80}")

        waltzrl_success = run_waltzrl_tests()
        if not waltzrl_success:
            logger.warning("⚠️  WaltzRL tests failed to run")

        # ====================================================================
        # SLOW SUITE: Run every 6 hours
        # ====================================================================
        time_since_regression = current_time - last_regression_run

        if time_since_regression >= REGRESSION_INTERVAL or last_regression_run == 0:
            slow_iteration += 1
            logger.info(f"\n{'='*80}")
            logger.info(f"SLOW ITERATION {slow_iteration} - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
            logger.info(f"{'='*80}")
            logger.info(f"⏰ Running regression tests (6-hour interval reached)")

            regression_success = run_regression_tests()
            if regression_success:
                last_regression_run = current_time
            else:
                logger.warning("⚠️  Regression tests failed to run, will retry next cycle")

        # ====================================================================
        # CALCULATE SYSTEM HEALTH
        # ====================================================================
        health = calculate_system_health()
        logger.info(f"\n📊 System Health: {health:.1f}/100")

        # Next regression info
        next_regression_in = REGRESSION_INTERVAL - time_since_regression
        if next_regression_in > 0:
            logger.info(f"⏳ Next regression run in: {next_regression_in/3600:.1f} hours")

        # Sleep until next fast iteration
        logger.info(f"\n💤 Sleeping 60 seconds until next fast iteration...")
        time.sleep(60)

if __name__ == '__main__':
    main()
