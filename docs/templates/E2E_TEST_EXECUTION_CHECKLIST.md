# E2E Test Execution Checklist Template

**Feature:** _________________
**Date:** _________________
**Agent:** Alex (E2E Testing & Integration)
**Estimated Time:** _____ hours

---

## Pre-Test Verification

- [ ] **Read prior audit documents for this feature**
  - Search command: `find /home/genesis/genesis-rebuild -name "*audit*.md" -type f | grep -i <feature>`
  - Documents reviewed: _________________
  - Known issues documented: _________________

- [ ] **Verify test environment matches deployment environment**
  - Test environment: _________________
  - Deployment environment: _________________
  - Differences: _________________

- [ ] **Confirm latest code is checked out**
  - Branch: _________________
  - Commit: `git log -1 --oneline`
  - Output: _________________

- [ ] **Install required dependencies**
  - Dependencies installed: _________________
  - CLI tools available: _________________
  - Verification commands: _________________

---

## Test Execution

### E2E Test Suite

- [ ] **Run E2E tests**
  ```bash
  pytest tests/e2e/test_<feature>_e2e.py -v --tb=short
  ```
  - **Result:** ___/___passed, ___skipped, ___failed
  - **Timestamp:** _________________
  - **Output saved to:** _________________
  - **Notes:** _________________

### Integration Test Suite

- [ ] **Run integration tests**
  ```bash
  pytest tests/integration/test_<feature>_*.py -v --tb=short
  ```
  - **Result:** ___/___passed, ___skipped, ___failed
  - **Timestamp:** _________________
  - **Output saved to:** _________________
  - **Notes:** _________________

### Combined E2E Test Suite

- [ ] **Run combined E2E tests**
  ```bash
  pytest tests/e2e/test_combined_e2e.py -v --tb=short
  ```
  - **Result:** ___/___passed, ___skipped, ___failed
  - **Timestamp:** _________________
  - **Output saved to:** _________________
  - **Notes:** _________________

### Baseline Regression Tests

- [ ] **Run baseline tests to ensure no regressions**
  ```bash
  pytest tests/<baseline_dir>/ -v --tb=short
  ```
  - **Result:** ___/___passed, ___skipped, ___failed
  - **Timestamp:** _________________
  - **Output saved to:** _________________
  - **Notes:** _________________

---

## Test Investigation

### Skipped Tests

**For EVERY skipped test, fill out:**

1. **Test name:** _________________
   - **Skip reason:** _________________
   - **Is this a bug?** YES / NO
   - **Priority:** P0 / P1 / P2 / ACCEPTABLE
   - **Action required:** _________________

2. **Test name:** _________________
   - **Skip reason:** _________________
   - **Is this a bug?** YES / NO
   - **Priority:** P0 / P1 / P2 / ACCEPTABLE
   - **Action required:** _________________

3. **Test name:** _________________
   - **Skip reason:** _________________
   - **Is this a bug?** YES / NO
   - **Priority:** P0 / P1 / P2 / ACCEPTABLE
   - **Action required:** _________________

### Failed Tests

**For EVERY failed test, fill out:**

1. **Test name:** _________________
   - **Failure reason:** _________________
   - **Is this expected?** YES / NO
   - **Priority:** P0 / P1 / P2 / TEST BUG
   - **Action required:** _________________

2. **Test name:** _________________
   - **Failure reason:** _________________
   - **Is this expected?** YES / NO
   - **Priority:** P0 / P1 / P2 / TEST BUG
   - **Action required:** _________________

3. **Test name:** _________________
   - **Failure reason:** _________________
   - **Is this expected?** YES / NO
   - **Priority:** P0 / P1 / P2 / TEST BUG
   - **Action required:** _________________

---

## Coverage Verification

### Line Coverage

- [ ] **Run coverage analysis**
  ```bash
  pytest tests/e2e/test_<feature>_e2e.py tests/integration/test_<feature>_*.py \
    --cov=<module_path> --cov-report=term-missing
  ```
  - **Overall coverage:** ____%
  - **Coverage output verified (no "No data collected" warning):** YES / NO
  - **Coverage report saved to:** _________________

- [ ] **Document uncovered lines**
  - **Lines uncovered:** _________________
  - **Why uncovered (intentional/oversight):** _________________
  - **Action required:** _________________

### Functional Coverage Matrix

**For EVERY integration point, fill out:**

| Integration Point | Automated Test | Manual Test | Coverage % | Status |
|------------------|---------------|-------------|------------|--------|
| [Integration 1] | [Test name or NONE] | [Command/function or NONE] | [0-100]% | [VALIDATED/PARTIAL/NOT TESTED] |
| [Integration 2] | [Test name or NONE] | [Command/function or NONE] | [0-100]% | [VALIDATED/PARTIAL/NOT TESTED] |
| [Integration 3] | [Test name or NONE] | [Command/function or NONE] | [0-100]% | [VALIDATED/PARTIAL/NOT TESTED] |
| [Integration 4] | [Test name or NONE] | [Command/function or NONE] | [0-100]% | [VALIDATED/PARTIAL/NOT TESTED] |
| [Integration 5] | [Test name or NONE] | [Command/function or NONE] | [0-100]% | [VALIDATED/PARTIAL/NOT TESTED] |
| [Integration 6] | [Test name or NONE] | [Command/function or NONE] | [0-100]% | [VALIDATED/PARTIAL/NOT TESTED] |
| [Integration 7] | [Test name or NONE] | [Command/function or NONE] | [0-100]% | [VALIDATED/PARTIAL/NOT TESTED] |

**Scoring:**
- **100%** = Fully validated (automated + manual)
- **50-99%** = Partially validated (automated OR manual)
- **0-49%** = Insufficient validation
- **0%** = Not tested

**Average Functional Coverage:** ____%

**Pass Threshold:** 80% required for "production ready"

**Result:** PASS / FAIL

---

## Manual Validation

### CLI Testing

- [ ] **Run relevant CLI commands**
  - **Command 1:** `_________________`
    - **Output:** _________________
    - **Result:** PASS / FAIL
  - **Command 2:** `_________________`
    - **Output:** _________________
    - **Result:** PASS / FAIL
  - **Command 3:** `_________________`
    - **Output:** _________________
    - **Result:** PASS / FAIL

### API Testing

- [ ] **Test critical APIs directly**
  - **Function 1:** `_________________`
    - **Input:** _________________
    - **Output:** _________________
    - **Result:** PASS / FAIL
  - **Function 2:** `_________________`
    - **Input:** _________________
    - **Output:** _________________
    - **Result:** PASS / FAIL

### File Inspection

- [ ] **Inspect critical files**
  - **File 1:** `_________________`
    - **What to check:** _________________
    - **Result:** PASS / FAIL / ISSUE
  - **File 2:** `_________________`
    - **What to check:** _________________
    - **Result:** PASS / FAIL / ISSUE

### Staging Smoke Test

- [ ] **Run smoke test in staging environment**
  - **Environment:** _________________
  - **Test steps:** _________________
  - **Result:** PASS / FAIL
  - **Issues found:** _________________

---

## Cross-Validation

### Prior Audits

- [ ] **Search for prior audits**
  ```bash
  find /home/genesis/genesis-rebuild -name "*<feature>*audit*.md"
  ```
  - **Documents found:** _________________
  - **Key findings from prior audits:** _________________
  - **Alignment with current findings:** _________________

### Test Comparison

- [ ] **Compare to historical test results**
  ```bash
  git log --all --grep="<feature>" --oneline | head -10
  ```
  - **Prior test pass rate:** ___/___
  - **Current test pass rate:** ___/___
  - **Regression detected:** YES / NO
  - **Details:** _________________

### Claims Verification

- [ ] **Verify ALL claims with evidence**

**For EVERY claim in the report, provide evidence:**

1. **Claim:** "_________________"
   - **Evidence:** _________________
   - **Verified:** YES / NO

2. **Claim:** "_________________"
   - **Evidence:** _________________
   - **Verified:** YES / NO

3. **Claim:** "_________________"
   - **Evidence:** _________________
   - **Verified:** YES / NO

### Agent Consultation

- [ ] **Consult agent who did original work**
  - **Agent:** _________________
  - **Question:** "_________________"
  - **Response:** _________________
  - **Action:** _________________

### Environment Documentation

- [ ] **Document test environment**
  - **OS:** _________________
  - **Python version:** `python3 --version`
  - **Key dependencies:** _________________
  - **Environment variables:** _________________
  - **Differences from production:** _________________

---

## Report Writing

### Test Pass Rate Section

- [ ] **Include explanation of ALL non-passing tests**
  - Format: "20/22 tests (90.9%), 2 skipped, 0 failed"
  - Skipped tests explained: YES / NO
  - Failed tests explained: YES / NO
  - Baseline vs. new tests distinguished: YES / NO
  - Timestamp included: YES / NO

### Coverage Section

- [ ] **Include both line AND functional coverage**
  - Line coverage percentage: ____%
  - Functional coverage percentage: ____%
  - Functional coverage matrix included: YES / NO
  - Uncovered lines documented: YES / NO
  - Intentional vs. unintentional gaps explained: YES / NO

### Functional Coverage Matrix

- [ ] **Matrix included in report:** YES / NO
- [ ] **All integration points listed:** YES / NO
- [ ] **Coverage percentages calculated:** YES / NO
- [ ] **Average coverage computed:** YES / NO

### Manual Validation Section

- [ ] **Manual validation section included:** YES / NO
- [ ] **CLI commands documented:** YES / NO
- [ ] **API testing documented:** YES / NO
- [ ] **File inspection documented:** YES / NO
- [ ] **Staging smoke test documented:** YES / NO

### Cross-Validation Section

- [ ] **Cross-validation section included:** YES / NO
- [ ] **Prior audits reviewed:** YES / NO
- [ ] **Test comparison documented:** YES / NO
- [ ] **Claims verified with evidence:** YES / NO
- [ ] **Agents consulted:** YES / NO
- [ ] **Environment documented:** YES / NO

### Scoring Section

- [ ] **Use updated rubric (10-point scale):** YES / NO
- [ ] **All categories scored:** YES / NO
- [ ] **Deductions documented:** YES / NO
- [ ] **Final score calculated:** ___/10
- [ ] **Recommendation clear (GO/BLOCK/CONDITIONAL):** YES / NO

---

## Final Verification

### Re-Run Tests

- [ ] **Re-run ALL tests after writing report**
  ```bash
  pytest tests/e2e/test_<feature>_e2e.py tests/integration/test_<feature>_*.py -v
  ```
  - **Result:** ___/___passed, ___skipped, ___failed
  - **Matches report claims:** YES / NO
  - **Discrepancies:** _________________

### Claim Verification

- [ ] **Compare report claims to actual test output**
  - **Claim 1:** _________________ - **Verified:** YES / NO
  - **Claim 2:** _________________ - **Verified:** YES / NO
  - **Claim 3:** _________________ - **Verified:** YES / NO
  - **Discrepancies found:** YES / NO
  - **Action:** _________________

### Peer Review

- [ ] **Ask another agent to review report**
  - **Reviewer:** Hudson / Cora / Forge / Other
  - **Feedback:** _________________
  - **Changes made:** _________________
  - **Final approval:** YES / NO

### Documentation Update

- [ ] **Update PROJECT_STATUS.md with findings**
  - **Section updated:** _________________
  - **Status changed:** YES / NO
  - **Next steps documented:** YES / NO

### Final Checklist

- [ ] **ALL checkboxes in this template are checked:** YES / NO
- [ ] **Report includes all required sections:** YES / NO
- [ ] **All claims have evidence:** YES / NO
- [ ] **Scoring uses updated rubric:** YES / NO
- [ ] **Peer review complete:** YES / NO
- [ ] **PROJECT_STATUS.md updated:** YES / NO

---

## Sign-Off

**I certify that:**
- ✓ All tests have been executed as documented above
- ✓ All skipped/failed tests have been investigated
- ✓ Coverage metrics have been verified
- ✓ Manual validation has been performed
- ✓ Cross-validation has been completed
- ✓ All claims have supporting evidence
- ✓ Peer review has been conducted
- ✓ This report accurately reflects the state of the feature

**Agent Signature:** _________________
**Date:** _________________
**Time Spent:** _____ hours

---

## Appendix: Quick Reference

### Scoring Rubric

| Category | Max | Criteria |
|----------|-----|----------|
| Implementation Quality | 2.0 | Code structure, error handling, types, docs |
| Integration Completeness | 1.5 | All integration points implemented |
| Test Coverage | 1.5 | Functional ≥80%, line ≥70% |
| Test Pass Rate | 2.0 | 100%=2.0, 95%=1.5, 90%=1.0, <90%=0.5 |
| Documentation | 1.0 | Accurate, comprehensive, no false claims |
| Production Readiness | 1.5 | Zero P0, manual validation complete |
| Deployment Safety | 0.5 | Rollback, monitoring, feature flags |
| **TOTAL** | **10.0** | |

### Pass Thresholds

- **9.0-10.0:** PRODUCTION READY (immediate deployment)
- **8.0-8.9:** CONDITIONAL GO (minor fixes, <1 day)
- **7.0-7.9:** APPROVE WITH FIXES (P1 issues, 1-2 days)
- **6.0-6.9:** BLOCK WITH PLAN (P0 issues, 3-5 days)
- **<6.0:** BLOCK (major rework, >1 week)

### Deductions

- **-0.5** per skipped test (unless justified)
- **-1.0** per P0 issue
- **-0.5** per P1 issue
- **-0.5** per false claim
- **-1.0** if coverage verification fails

---

**Template Version:** 1.0
**Created:** November 2, 2025
**Author:** Alex (E2E Testing & Integration)
**Purpose:** Ensure comprehensive, accurate E2E validation reports
