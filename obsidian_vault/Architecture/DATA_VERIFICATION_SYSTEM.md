---
title: DATA VERIFICATION SYSTEM
category: Architecture
dg-publish: true
publish: true
tags: []
source: docs/DATA_VERIFICATION_SYSTEM.md
exported: '2025-10-24T22:05:26.956370'
---

# DATA VERIFICATION SYSTEM

**Date Created:** October 22, 2025
**Author:** Cora (QA Auditor)
**Purpose:** Prevent future data fabrication incidents
**Status:** PRODUCTION REQUIRED

---

## EXECUTIVE SUMMARY

This document defines the mandatory verification system implemented in response to the October 22, 2025 data integrity failure, where agents submitted fake screenshots (.txt files) and approved deployments while monitoring was broken for 26+ hours.

**Core Principle:** Trust But Verify - Every claim must have verifiable, automated evidence.

---

## 1. EVIDENCE HIERARCHY

### Tier 1: ACTUAL SCREENSHOTS (Required for UI/Dashboard claims)

**Acceptable Formats:**
- `.png` (Portable Network Graphics)
- `.jpg` / `.jpeg` (JPEG images)
- `.webp` (Web optimized images)

**NOT Acceptable:**
- `.txt` files (even if formatted nicely)
- `.md` files with ASCII art
- "Visual description" in prose
- "Screenshot not captured" claims

**Verification:**
```bash
# Pre-commit hook check
find docs/validation -name "screenshot*" -type f ! \( -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" \) | \
  while read file; do
    echo "ERROR: Fake screenshot detected: $file"
    exit 1
  done
```

**How to Capture:**
1. **Playwright** (automated browser screenshots):
   ```python
   from playwright.async_api import async_playwright

   async def capture_screenshot(url: str, output: str):
       async with async_playwright() as p:
           browser = await p.chromium.launch()
           page = await browser.new_page()
           await page.goto(url)
           await page.screenshot(path=output)
           await browser.close()

   # Example:
   await capture_screenshot(
       "http://localhost:3000/d/genesis-dashboard",
       "docs/validation/grafana_dashboard_20251022.png"
   )
   ```

2. **ImageMagick** (for terminal output):
   ```bash
   # Capture terminal output as image
   script -c "pytest tests/ -v" /tmp/test_output.txt
   convert -font Courier -pointsize 12 /tmp/test_output.txt docs/validation/test_output.png
   ```

3. **Firefox Headless** (alternative):
   ```bash
   firefox --headless --screenshot docs/validation/screenshot.png http://localhost:3000
   ```

---

### Tier 2: RAW LOG OUTPUT (Acceptable for test results)

**Acceptable Formats:**
- Timestamped terminal output (copy-paste from actual run)
- Docker container logs (with `docker logs` command output)
- pytest output with session info
- Prometheus query results (JSON)

**Required Elements:**
- Timestamp (when test was run)
- Full command that was executed
- All PASSED/FAILED lines (not summary only)
- Error stack traces (if any failures)

**Example (Acceptable):**
```bash
$ python -m pytest tests/test_waltzrl_modules.py -v
============================= test session starts ==============================
platform linux -- Python 3.12.3, pytest-8.4.2, pluggy-1.6.0
collected 50 items

tests/test_waltzrl_modules.py::test_conversation_agent PASSED           [  2%]
tests/test_waltzrl_modules.py::test_safety_wrapper PASSED               [  4%]
...
========================= 50 passed in 2.43s ===============================
```

**Example (NOT Acceptable):**
```markdown
All tests passed. Trust me.
```

**Verification:**
```bash
# Check for pytest session header
grep -q "test session starts" approval_doc.md || echo "ERROR: No pytest output found"

# Check for actual PASSED/FAILED lines
grep -c "PASSED\|FAILED" approval_doc.md || echo "ERROR: No test results found"
```

---

### Tier 3: JSON/CSV DATA FILES (Acceptable for automated metrics)

**Acceptable Formats:**
- JSON files from pytest (`--json` flag)
- CSV files from performance benchmarks
- Prometheus metrics export

**Required Elements:**
- Timestamp field
- Actual measurements (not placeholders)
- Test name/identifier
- Pass/fail status

**Example (Acceptable):**
```json
{
  "test": "Conversation Agent Latency",
  "timestamp": "2025-10-22T20:36:43.213108",
  "iterations": 100,
  "metrics": {
    "p50_ms": 0.1,
    "p95_ms": 0.21,
    "avg_ms": 0.12
  },
  "status": "PASS"
}
```

**Verification:**
```python
import json
from datetime import datetime, timedelta

def verify_json_evidence(filepath: str) -> bool:
    with open(filepath) as f:
        data = json.load(f)

    # Check required fields
    if "timestamp" not in data:
        return False

    # Check timestamp is recent (< 24 hours old)
    ts = datetime.fromisoformat(data["timestamp"].replace("Z", "+00:00"))
    age = datetime.now() - ts
    if age > timedelta(hours=24):
        return False

    # Check for actual data (not placeholder values)
    if "metrics" in data:
        for key, value in data["metrics"].items():
            if value == 0.0 or value == 999999:
                return False  # Likely placeholder

    return True
```

---

### Tier 4: MARKDOWN SUMMARIES (NOT Acceptable as Evidence)

**Not Acceptable:**
- "The tests passed" (no proof)
- "Performance is good" (no metrics)
- "Grafana shows healthy metrics" (no screenshot)

**These are SUMMARIES, not EVIDENCE. Must be accompanied by Tier 1-3 evidence.**

---

## 2. MANDATORY VERIFICATION CHECKLIST

Before ANY agent can approve a deployment, they MUST complete this checklist:

```markdown
## Pre-Approval Verification Checklist

### Code Review (Hudson)
- [ ] Source code exists (file paths verified with `ls`)
- [ ] Unit tests pass (run manually, paste output)
- [ ] Code coverage ≥85% (check report file, paste summary)
- [ ] No security vulnerabilities (bandit output pasted)

**Evidence Links:**
- Unit test output: [link to .txt or screenshot]
- Coverage report: [link to HTML report or screenshot]
- Bandit scan: [link to JSON report]

### Integration Testing (Alex)
- [ ] Integration tests pass (run manually, paste output)
- [ ] Zero regressions (Phase 1-3 tests still passing)
- [ ] Grafana dashboard shows CURRENT data (screenshot with timestamp)
- [ ] Prometheus metrics publishing (query result screenshot)

**Evidence Links:**
- Integration test output: [link to .txt or screenshot]
- Grafana screenshot: [link to .png file, NOT .txt]
- Prometheus query: [link to screenshot showing non-zero data]

### E2E Testing (Forge/Cora)
- [ ] E2E tests pass (run manually, paste output)
- [ ] ACTUAL screenshots uploaded (.png/.jpg files, verified with `file` command)
- [ ] Performance metrics match Grafana data (screenshot comparison)
- [ ] Metrics server logs show success (no errors in last 50 lines)

**Evidence Links:**
- E2E test output: [link to .txt or screenshot]
- Screenshots: [links to .png files, file type verified]
- Metrics comparison: [Grafana vs test output, side-by-side]

### Monitoring Validation (ALL AGENTS)
- [ ] Opened Grafana dashboard (http://localhost:3000)
- [ ] Verified metrics updating in real-time (timestamp < 1 minute old)
- [ ] Checked Prometheus targets (all "UP", no errors)
- [ ] Reviewed metrics server logs (no errors in last 50 lines)
- [ ] Confirmed test_pass_rate > 0 (NOT 0, screenshot proof)

**Evidence Links:**
- Grafana screenshot: [.png file with timestamp visible]
- Prometheus targets: [screenshot showing "UP" status]
- Metrics server logs: [last 50 lines, copy-paste]
- test_pass_rate query: [screenshot showing value > 0]

### Evidence Verification
- [ ] All screenshot links point to .png/.jpg files (NOT .txt)
- [ ] All screenshots show timestamps (proving they're current)
- [ ] All terminal outputs include pytest session info
- [ ] All metrics show non-zero values (not placeholder 0)
- [ ] No "trust me" or "looks good" claims without data

**Evidence File Count:**
- Total screenshots (.png/.jpg): [X files]
- Total log files (.txt): [X files]
- Total data files (.json/.csv): [X files]
```

---

## 3. AUTOMATED VERIFICATION

### Pre-Commit Hook (Prevent Fake Evidence)

**File:** `.git/hooks/pre-commit`

```bash
#!/bin/bash
# Prevent commits with fake evidence

# Check 1: No .txt files claiming to be screenshots
if git diff --cached --name-only | grep -q "docs/validation.*\.txt"; then
  echo "❌ ERROR: .txt files in validation/ directory"
  echo "Screenshots must be .png or .jpg files"
  exit 1
fi

# Check 2: Approval documents must have Grafana screenshots
if git diff --cached --name-only | grep -qE "(APPROVAL|AUDIT|VALIDATION).*\.md"; then
  for file in $(git diff --cached --name-only | grep -E "(APPROVAL|AUDIT|VALIDATION).*\.md"); then
    if grep -qi "approve for production" "$file"; then
      if ! grep -q "\.png\|\.jpg" "$file"; then
        echo "❌ ERROR: $file approves production but has no screenshot links"
        echo "Must include Grafana dashboard screenshots (.png/.jpg)"
        exit 1
      fi
    fi
  done
fi

# Check 3: Verify screenshot files actually exist
for file in $(git diff --cached --name-only | grep -E "\.md$"); do
  # Extract screenshot links
  screenshot_links=$(grep -oP '\[.*?\]\(\K[^)]+\.(?:png|jpg|jpeg)' "$file" || true)
  for link in $screenshot_links; do
    if [ ! -f "$link" ]; then
      echo "❌ ERROR: $file references non-existent screenshot: $link"
      exit 1
    fi
  done
done

echo "✅ Evidence verification passed"
exit 0
```

**Installation:**
```bash
chmod +x .git/hooks/pre-commit
```

---

### Approval Document Verification Script

**File:** `deployment/verify_approval.py`

```python
#!/usr/bin/env python3
"""
Verify approval documents contain actual evidence, not fabrications.
Run this before accepting any deployment approval.
"""

import os
import re
import sys
from pathlib import Path
from typing import Tuple, List

def verify_approval_evidence(approval_file: str) -> Tuple[bool, List[str]]:
    """
    Verify that approval document contains actual evidence.

    Returns: (is_valid, list_of_errors)
    """
    errors = []

    # Read approval document
    with open(approval_file) as f:
        content = f.read()

    # Check 1: Screenshot links exist and are .png/.jpg
    screenshot_links = re.findall(r'\[.*?\]\((.*?\.(?:png|jpg|jpeg))\)', content)
    if not screenshot_links:
        errors.append("❌ No screenshot links found (.png/.jpg required)")
    else:
        # Verify files exist
        for link in screenshot_links:
            if not os.path.exists(link):
                errors.append(f"❌ Screenshot file not found: {link}")
            else:
                # Verify it's actually an image (check magic bytes)
                with open(link, 'rb') as f:
                    header = f.read(8)
                    if not (header.startswith(b'\x89PNG') or header.startswith(b'\xff\xd8\xff')):
                        errors.append(f"❌ File is not a real image: {link}")

    # Check 2: Grafana verification present
    if "grafana" not in content.lower():
        errors.append("❌ No Grafana verification found")

    # Check 3: Test output present (pytest session info)
    if not re.search(r'test session starts|PASSED|FAILED', content):
        errors.append("❌ No pytest output found (must show actual test results)")

    # Check 4: Metrics verification (test_pass_rate mentioned)
    if not re.search(r'test_pass_rate|Prometheus query', content):
        errors.append("❌ No metrics verification found (must check test_pass_rate)")

    # Check 5: No .txt files claiming to be screenshots
    txt_screenshot_claims = re.findall(
        r'\[.*screenshot.*\]\((.*?\.txt)\)',
        content,
        re.IGNORECASE
    )
    if txt_screenshot_claims:
        errors.append(
            f"❌ FRAUD DETECTED: .txt files claiming to be screenshots: {txt_screenshot_claims}"
        )

    # Check 6: Timestamps present (proves evidence is recent)
    timestamp_pattern = r'\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}:\d{2}'
    timestamps = re.findall(timestamp_pattern, content)
    if not timestamps:
        errors.append("❌ No timestamps found in evidence (cannot verify recency)")

    # Check 7: Metrics show non-zero values
    if re.search(r'test_pass_rate.*[:\s]0\.?0*\b', content):
        errors.append("❌ test_pass_rate is 0 (metrics not working)")

    return (len(errors) == 0, errors)

def main():
    if len(sys.argv) != 2:
        print("Usage: verify_approval.py <approval_file.md>")
        sys.exit(1)

    approval_file = sys.argv[1]

    if not os.path.exists(approval_file):
        print(f"❌ File not found: {approval_file}")
        sys.exit(1)

    print(f"🔍 Verifying evidence in: {approval_file}\n")

    is_valid, errors = verify_approval_evidence(approval_file)

    if is_valid:
        print("✅ VERIFICATION PASSED - Evidence is valid")
        sys.exit(0)
    else:
        print("❌ VERIFICATION FAILED - Evidence issues found:\n")
        for error in errors:
            print(f"  {error}")
        print("\n🚫 Deployment approval REJECTED")
        sys.exit(1)

if __name__ == '__main__':
    main()
```

**Usage in CI/CD:**
```yaml
# .github/workflows/verify-approval.yml
name: Verify Deployment Approval

on:
  pull_request:
    paths:
      - 'docs/*APPROVAL*.md'
      - 'docs/*AUDIT*.md'

jobs:
  verify-evidence:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Verify approval evidence
        run: |
          for file in docs/*APPROVAL*.md docs/*AUDIT*.md; do
            if [ -f "$file" ]; then
              python deployment/verify_approval.py "$file"
            fi
          done
```

---

### Automated Health Checks (Detect Monitoring Failures)

**File:** `monitoring/automated_health_check.py`

```python
#!/usr/bin/env python3
"""
Automated health checks to detect monitoring failures before they last 26 hours.
Runs every 5 minutes, sends alerts if metrics are broken.
"""

import requests
import time
import sys
from datetime import datetime, timedelta
from typing import Tuple

def send_alert(message: str):
    """Send alert to monitoring channel (Slack, email, etc.)"""
    print(f"🚨 ALERT: {message}")
    # TODO: Integrate with actual alerting system (Slack webhook, PagerDuty, etc.)

def check_metrics_health() -> Tuple[bool, str]:
    """Check if metrics server is publishing data correctly."""

    try:
        # Check 1: Is Prometheus scraping genesis-metrics?
        resp = requests.get("http://localhost:9090/api/v1/targets", timeout=5)
        resp.raise_for_status()
        targets = resp.json()["data"]["activeTargets"]

        genesis_target = next(
            (t for t in targets if "genesis-metrics" in t["scrapeUrl"]),
            None
        )

        if not genesis_target:
            return False, "genesis-metrics target not found in Prometheus"

        if genesis_target["health"] != "up":
            return False, f"genesis-metrics health is {genesis_target['health']}, not 'up'"

        # Check 2: Are metrics being published?
        resp = requests.get(
            "http://localhost:9090/api/v1/query?query=test_pass_rate",
            timeout=5
        )
        resp.raise_for_status()
        results = resp.json()["data"]["result"]

        if not results:
            return False, "test_pass_rate metric is empty (no data being published)"

        # Check 3: Is data recent? (last scrape < 2 minutes ago)
        last_scrape_str = genesis_target["lastScrape"]
        last_scrape = datetime.fromisoformat(last_scrape_str.replace("Z", "+00:00"))
        age_seconds = (datetime.now(last_scrape.tzinfo) - last_scrape).total_seconds()

        if age_seconds > 120:  # 2 minutes
            return False, f"Metrics stale (last scrape {age_seconds:.0f}s ago)"

        # Check 4: Is test_pass_rate value reasonable? (0-100)
        value = float(results[0]["value"][1])
        if value < 0 or value > 100:
            return False, f"test_pass_rate value {value} is out of range (0-100)"

        return True, "All health checks passed"

    except requests.RequestException as e:
        return False, f"Network error: {e}"
    except (KeyError, IndexError, ValueError) as e:
        return False, f"Parse error: {e}"

def main():
    print("🏥 Genesis Automated Health Check Starting")
    print("📊 Checking metrics every 5 minutes...")
    print("🚨 Will alert on failures\n")

    failure_count = 0
    last_alert = None

    while True:
        healthy, message = check_metrics_health()
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        if healthy:
            print(f"✅ [{timestamp}] Health check passed: {message}")
            failure_count = 0
        else:
            failure_count += 1
            print(f"❌ [{timestamp}] Health check failed: {message}")

            # Alert after 2 consecutive failures (10 minutes)
            if failure_count >= 2:
                # Don't spam alerts (max 1 per hour)
                if not last_alert or (datetime.now() - last_alert) > timedelta(hours=1):
                    send_alert(f"Metrics failure detected: {message}")
                    last_alert = datetime.now()

        # Sleep for 5 minutes
        time.sleep(300)

if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n🛑 Health check stopped")
        sys.exit(0)
```

**Deployment:**
```bash
# Run in background
nohup python monitoring/automated_health_check.py > /var/log/health_check.log 2>&1 &

# Or as systemd service (production)
sudo systemctl enable genesis-health-check
sudo systemctl start genesis-health-check
```

---

## 4. AGENT TRAINING REQUIREMENTS

All agents must complete "Evidence Verification Training" before approving deployments.

### Module 1: What is Actual Evidence? (30 minutes)

**Learning Objectives:**
- Distinguish between .png screenshots and .txt files
- Understand why "trust me" is not evidence
- Learn to verify file types with `file` command

**Quiz:**
1. Is a .txt file with ASCII art a valid screenshot? (NO)
2. How do you verify a .png file is actually an image? (Use `file` command or check magic bytes)
3. What is the minimum acceptable evidence for "tests passed"? (pytest output with session info)

**Pass Criteria:** 100% on quiz

---

### Module 2: Grafana & Prometheus Verification (30 minutes)

**Learning Objectives:**
- How to check if Prometheus is scraping targets
- How to verify Grafana dashboards show current data
- How to spot stale metrics (timestamp > 5 minutes old)

**Hands-On Exercise:**
1. Open Grafana at http://localhost:3000
2. Check last data point timestamp (must be < 1 minute old)
3. Query Prometheus for `test_pass_rate`
4. Verify value is non-zero
5. Take ACTUAL screenshot (.png file)

**Pass Criteria:** Submit screenshot proving you checked

---

### Module 3: Fraud Detection (30 minutes)

**Learning Objectives:**
- Common fabrication patterns (fake screenshots, placeholder data)
- How to verify evidence independently (don't trust, verify)
- Red flags (metrics at 0, no timestamps, "trust me" claims)

**Case Studies:**
1. October 22, 2025 incident (fake .txt screenshots)
2. How to spot generated vs. actual data
3. Verification techniques (re-run tests, check timestamps)

**Pass Criteria:** Identify 5/5 fabricated evidence examples

---

## 5. ENFORCEMENT MECHANISMS

### Automated Enforcement (CI/CD)

```yaml
# Required GitHub Actions checks (cannot be bypassed)
- name: Evidence Verification
  run: python deployment/verify_approval.py docs/*APPROVAL*.md

- name: Screenshot Type Check
  run: |
    # Fail if any .txt files in validation/
    if find docs/validation -name "*.txt" | grep -q .; then
      echo "ERROR: .txt files not allowed in validation/"
      exit 1
    fi

- name: Grafana Screenshot Check
  run: |
    # Fail if approval mentions production but no Grafana screenshots
    if grep -qi "production" docs/*APPROVAL*.md; then
      if ! grep -q "grafana.*\.png" docs/*APPROVAL*.md; then
        echo "ERROR: Production approval requires Grafana screenshot"
        exit 1
      fi
    fi
```

---

### Manual Enforcement (Agent Accountability)

**Strike System:**
- **Strike 1:** Warning + mandatory re-training
- **Strike 2:** Probation (co-signed approvals for 5 deployments)
- **Strike 3:** REMOVAL FROM TEAM

**Violations:**
1. Submitting fake evidence (.txt files as screenshots)
2. Approving without verifying monitoring
3. Claiming "trust me" without data
4. Bypassing verification checklist
5. Tampering with verification scripts

**Permanent Records:**
- All approvals logged in `deployment/approval_history.json`
- All verification failures logged in `deployment/violations.log`
- Quarterly audits review all approvals for compliance

---

## 6. SUCCESS METRICS

Track effectiveness of verification system:

### Metric 1: Fabrication Detection Rate
- **Target:** 100% (catch all fabrications before production)
- **Measure:** Automated checks catch fake evidence

### Metric 2: False Positive Rate
- **Target:** <5% (don't block valid approvals)
- **Measure:** Manual override rate

### Metric 3: Monitoring Downtime
- **Target:** <1 hour (catch failures within 1 hour)
- **Measure:** Time between metrics failure and alert

### Metric 4: Agent Compliance Rate
- **Target:** 100% (all agents follow checklist)
- **Measure:** Approvals with complete evidence vs. total approvals

---

## 7. QUARTERLY AUDIT PROCESS

**Frequency:** Every 3 months

**Process:**
1. **Random Sampling:** Select 10% of all approvals from quarter
2. **Independent Verification:** Cora + external auditor re-verify ALL evidence
3. **Compare:** Claimed results vs. actual results (re-run tests from scratch)
4. **Report:** Publish audit results with agent performance scores

**Agent Performance Score:**
- 100%: All approvals had valid evidence
- 90-99%: Minor issues (warnings issued)
- 80-89%: Major issues (probation)
- <80%: Removal from team

---

## 8. CONTINUOUS IMPROVEMENT

**Feedback Loop:**
1. Monthly review of verification failures
2. Update verification scripts based on new fabrication patterns
3. Add new checks as needed
4. Train agents on new verification requirements

**Version History:**
- v1.0 (October 22, 2025): Initial version after data integrity incident
- v1.1 (planned): Add AI-based screenshot authenticity detection
- v1.2 (planned): Integrate with blockchain for immutable evidence trail

---

**Document Status:** PRODUCTION REQUIRED
**Effective Date:** October 22, 2025
**Review Date:** January 22, 2026 (quarterly)
**Owner:** Cora (QA Auditor) + Hudson (Enforcement)

---

**END OF DOCUMENT**
