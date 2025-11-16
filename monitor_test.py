#!/usr/bin/env python3
"""
Real-time monitor for 1-hour business building test
Watches for errors/warnings and reports them immediately
"""

import re
import sys
import time
from pathlib import Path
from collections import defaultdict

def monitor_log_file():
    """Monitor log file in real-time"""
    log_file = Path("logs/one_hour_live_output.log")

    # Wait for file to be created
    while not log_file.exists():
        print("⏳ Waiting for log file to be created...")
        time.sleep(1)

    print("="*80)
    print("🔍 MONITORING ONE-HOUR TEST - Real-time Error/Warning Detection")
    print("="*80)

    stats = {
        "errors": 0,
        "warnings": 0,
        "businesses": 0,
        "components": 0,
        "api_calls": defaultdict(int)
    }

    with open(log_file, 'r') as f:
        # Start at the beginning
        while True:
            line = f.readline()
            if not line:
                time.sleep(0.5)  # Wait for new content
                continue

            line = line.strip()
            if not line:
                continue

            # Detect errors
            if "ERROR" in line or "❌" in line:
                stats["errors"] += 1
                print(f"\n🚨 ERROR DETECTED ({stats['errors']}): {line}")

            # Detect warnings
            elif "WARNING" in line or "⚠️" in line:
                stats["warnings"] += 1
                print(f"\n⚠️  WARNING ({stats['warnings']}): {line}")

            # Track progress
            elif "Business completed" in line:
                stats["businesses"] += 1
                print(f"✅ Business #{stats['businesses']} completed")

            elif "Creating" in line and "component" in line:
                stats["components"] += 1

            # Track API calls
            elif "Gemini Flash" in line:
                stats["api_calls"]["gemini_flash"] += 1
            elif "Gemini Lite" in line:
                stats["api_calls"]["gemini_lite"] += 1
            elif "DeepSeek" in line:
                stats["api_calls"]["deepseek"] += 1
            elif "Anthropic" in line:
                stats["api_calls"]["anthropic"] += 1
                print(f"\n💰 EXPENSIVE API CALL: Anthropic used")

            # Print progress reports
            elif "PROGRESS REPORT" in line:
                print(f"\n📊 {line}")
                print(f"   Errors: {stats['errors']} | Warnings: {stats['warnings']}")
                print(f"   Businesses: {stats['businesses']} | Components: {stats['components']}")

            # Check if test is done
            elif "1-HOUR TEST COMPLETED" in line:
                print(f"\n{'='*80}")
                print("🎉 TEST COMPLETED!")
                print(f"{'='*80}")
                print(f"Final Stats:")
                print(f"  Businesses: {stats['businesses']}")
                print(f"  Components: {stats['components']}")
                print(f"  Errors: {stats['errors']}")
                print(f"  Warnings: {stats['warnings']}")
                print(f"  API Calls: {dict(stats['api_calls'])}")
                break

if __name__ == "__main__":
    try:
        monitor_log_file()
    except KeyboardInterrupt:
        print("\n\n⚠️  Monitoring stopped by user")
        sys.exit(0)
