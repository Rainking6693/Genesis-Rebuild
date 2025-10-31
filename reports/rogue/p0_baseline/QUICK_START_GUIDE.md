# P0 Baseline Validation - Quick Start Guide

**For:** Forge (Testing Agent)
**When:** After Hudson confirms A2A service is stable
**Time:** Execute immediately upon confirmation

## Quick Start (Copy-Paste Commands)

### Step 1: Final Verification (2 minutes)

```bash
cd /home/genesis/genesis-rebuild

# Verify A2A service health
curl -s http://localhost:8080/health | jq '.'

# Verify scenarios count
python3 -c "
from infrastructure.testing.scenario_loader import ScenarioLoader
loader = ScenarioLoader()
s1 = loader.load_from_yaml('tests/rogue/scenarios/orchestration_p0.yaml')
s2 = loader.load_from_yaml('tests/rogue/scenarios/agents_p0_core.yaml')
print(f'Total P0 scenarios: {len(s1) + len(s2)}')
"

# Verify Rogue runner
python infrastructure/testing/rogue_runner.py --help | head -10
```

**Expected:** All commands succeed, 260 scenarios confirmed

### Step 2: Execute P0 Validation (10-15 minutes)

```bash
cd /home/genesis/genesis-rebuild

# Create timestamp for this run
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
echo "P0 Validation Run: $TIMESTAMP"

# Execute P0 validation with full logging
python infrastructure/testing/rogue_runner.py \
  --scenarios-dir tests/rogue/scenarios/ \
  --output-dir reports/rogue/p0_baseline/ \
  --priority P0 \
  --parallel 5 \
  --use-cache \
  --verbose \
  2>&1 | tee reports/rogue/p0_baseline/execution_${TIMESTAMP}.log

# Save exit code
EXIT_CODE=$?
echo "Exit code: $EXIT_CODE" | tee -a reports/rogue/p0_baseline/execution_${TIMESTAMP}.log
```

**Expected:**
- Runtime: 10-15 minutes
- Cost: ~$5-8
- Exit code: 0 (success)

### Step 3: Quick Results Check (1 minute)

```bash
cd /home/genesis/genesis-rebuild

# Check if results file exists
ls -lh reports/rogue/p0_baseline/results.json

# Extract summary
cat reports/rogue/p0_baseline/results.json | jq '.summary'

# Calculate pass rate
python3 -c "
import json
with open('reports/rogue/p0_baseline/results.json') as f:
    data = json.load(f)
total = data['summary']['total']
passed = data['summary']['passed']
failed = data['summary']['failed']
pass_rate = (passed / total) * 100

print(f'\n========== P0 VALIDATION RESULTS ==========')
print(f'Total Scenarios: {total}')
print(f'Passed: {passed}')
print(f'Failed: {failed}')
print(f'Pass Rate: {pass_rate:.1f}%')
print(f'Target: ≥90.0% (234/260)')
print(f'\nStatus: {"✓ PASS" if pass_rate >= 90 else "✗ FAIL"}')
print(f'===========================================\n')

if pass_rate >= 90:
    print('✓ P0 BASELINE APPROVED')
    print('✓ Ready for full 500-scenario validation')
else:
    print('✗ P0 BASELINE BLOCKED')
    print('✗ Fix failing scenarios before proceeding')
"
```

**Expected:** Pass rate ≥90%

### Step 4: Generate Full Report (20-30 minutes)

```bash
cd /home/genesis/genesis-rebuild

# Analyze results and generate comprehensive report
python3 << 'EOF'
import json
from pathlib import Path
from datetime import datetime

# Load results
with open('reports/rogue/p0_baseline/results.json') as f:
    results = json.load(f)

# Extract key metrics
summary = results['summary']
scenarios = results.get('scenarios', [])

# Generate report
report = f"""# Rogue P0 Baseline Validation Report

**Generated:** {datetime.utcnow().isoformat()}Z
**Status:** {"APPROVED" if summary.get('pass_rate', 0) >= 90 else "BLOCKED"}

## Executive Summary

Pass Rate: {summary.get('pass_rate', 0):.1f}% ({summary.get('passed', 0)}/{summary.get('total', 0)})
Runtime: {summary.get('runtime_seconds', 0):.1f}s ({summary.get('runtime_seconds', 0) / 60:.1f} minutes)
Cost: ${summary.get('total_cost', 0):.2f}

Target Pass Rate: ≥90.0% (234/260)
Result: {"✓ PASS" if summary.get('pass_rate', 0) >= 90 else "✗ FAIL"}

## Detailed Results

### Orchestration Layer
- HTDAG: [Results pending full report generation]
- HALO: [Results pending full report generation]
- AOP: [Results pending full report generation]
- DAAO: [Results pending full report generation]

### Agent Core
- 15 agents × 10 tests each
- [Results pending full report generation]

## Failure Analysis

[To be populated with failure patterns]

## Performance Metrics

Runtime Distribution:
- P50: [Pending calculation]
- P90: [Pending calculation]
- P99: [Pending calculation]

Cost per Scenario: ${summary.get('total_cost', 0) / summary.get('total', 260):.4f}

## Recommendations

[Based on pass rate and failure patterns]

## Go/No-Go Decision

{"✓ APPROVED: Ready for full 500-scenario validation" if summary.get('pass_rate', 0) >= 90 else "✗ BLOCKED: Fix P0 failures before proceeding"}
"""

# Save report
report_path = Path('docs/ROGUE_P0_BASELINE_REPORT.md')
report_path.write_text(report)
print(f'Report saved to: {report_path}')
print(f'Report size: {len(report)} bytes')

EOF
```

**Note:** This is a simplified report generator. Full report will be created manually with detailed analysis.

### Step 5: Final Decision (Immediate)

```bash
cd /home/genesis/genesis-rebuild

# Print final decision
python3 -c "
import json
with open('reports/rogue/p0_baseline/results.json') as f:
    data = json.load(f)
pass_rate = data['summary'].get('pass_rate', 0)

print('\n' + '='*60)
print('P0 BASELINE VALIDATION - FINAL DECISION')
print('='*60)

if pass_rate >= 90:
    print('\n✓✓✓ P0 BASELINE APPROVED ✓✓✓\n')
    print('Ready to proceed with:')
    print('  1. Full 500-scenario validation (P0 + P1)')
    print('  2. Week 3 CI/CD integration')
    print('  3. Automated nightly runs')
else:
    print('\n✗✗✗ P0 BASELINE BLOCKED ✗✗✗\n')
    print('Action required:')
    print('  1. Analyze failure patterns')
    print('  2. Implement fixes')
    print('  3. Re-run P0 validation')
    print('  4. DO NOT proceed to full validation')

print('\n' + '='*60 + '\n')
"
```

## Execution Checklist

Use this checklist during execution:

- [ ] **Pre-Validation**
  - [ ] Hudson confirmed A2A service is stable
  - [ ] A2A health check passes
  - [ ] 260 scenarios loaded successfully
  - [ ] Rogue runner operational

- [ ] **Execution**
  - [ ] P0 validation command launched
  - [ ] Real-time monitoring started
  - [ ] Logs captured to file
  - [ ] No infrastructure failures observed

- [ ] **Results**
  - [ ] results.json file generated
  - [ ] Pass rate calculated (≥90% target)
  - [ ] Failure patterns analyzed
  - [ ] Performance metrics extracted

- [ ] **Reporting**
  - [ ] Execution log saved
  - [ ] JSON results validated
  - [ ] Markdown summary created
  - [ ] Comprehensive report generated (~1,000 lines)

- [ ] **Decision**
  - [ ] Pass rate evaluated
  - [ ] Go/No-Go decision made
  - [ ] Next steps documented

## Troubleshooting

### If execution fails:

1. **Check A2A service:**
   ```bash
   curl http://localhost:8080/health
   ps aux | grep a2a_service
   ```

2. **Check Rogue runner logs:**
   ```bash
   tail -100 reports/rogue/p0_baseline/execution_*.log
   ```

3. **Check scenario files:**
   ```bash
   ls -lh tests/rogue/scenarios/
   ```

4. **Re-run with debug mode:**
   ```bash
   python infrastructure/testing/rogue_runner.py \
     --scenarios-dir tests/rogue/scenarios/ \
     --priority P0 \
     --parallel 1 \
     --verbose
   ```

### If pass rate <90%:

1. **Identify failure patterns:**
   ```bash
   cat reports/rogue/p0_baseline/results.json | \
     jq '.scenarios[] | select(.status == "failed") | .error_category' | \
     sort | uniq -c | sort -rn
   ```

2. **List top 10 failures:**
   ```bash
   cat reports/rogue/p0_baseline/results.json | \
     jq '.scenarios[] | select(.status == "failed") | {id, error}' | \
     head -20
   ```

3. **Focus on P0 critical failures first**

## Expected Timeline

| Phase | Duration | Status |
|-------|----------|--------|
| Final Verification | 2 min | Pending |
| P0 Execution | 10-15 min | Pending |
| Quick Results Check | 1 min | Pending |
| Full Report Generation | 20-30 min | Pending |
| Final Decision | Immediate | Pending |
| **Total** | **~35-50 min** | **Pending Hudson** |

## Success Criteria Reminder

P0 validation MUST meet ALL criteria:

- [ ] All 260 scenarios executed
- [ ] Pass rate ≥90% (234/260)
- [ ] Runtime <20 minutes
- [ ] Cost <$10
- [ ] Zero infrastructure failures
- [ ] Comprehensive reports generated
- [ ] Clear Go/No-Go decision

## Next Steps After P0

### If Approved (Pass Rate ≥90%):

1. **Week 3 Tasks:**
   - Full 500-scenario validation (P0 + P1)
   - CI/CD integration
   - Automated nightly runs
   - Performance baseline establishment

2. **Documentation:**
   - Update PROJECT_STATUS.md
   - Document lessons learned
   - Share report with team

### If Blocked (Pass Rate <90%):

1. **Immediate Actions:**
   - Analyze top 3-5 failure patterns
   - Implement fixes
   - Re-test failing scenarios
   - Re-run full P0 validation

2. **Do NOT proceed to:**
   - Full 500-scenario validation
   - CI/CD integration
   - Production deployment

## Summary

This guide provides copy-paste commands for immediate execution once Hudson confirms A2A service is stable.

**Current Status:** READY - Awaiting Hudson Confirmation

**Estimated Time:** 35-50 minutes from Hudson confirmation to final decision

**Expected Outcome:** ≥90% pass rate, comprehensive report, Go/No-Go decision

**Contact:** Forge (Testing Agent) ready to execute immediately
