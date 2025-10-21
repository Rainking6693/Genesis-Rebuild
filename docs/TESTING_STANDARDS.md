# Genesis Testing Standards - MANDATORY Requirements

**Status:** Active Policy (October 21, 2025)
**Applies To:** ALL agents performing testing/validation
**Primary Enforcers:** Forge, Alex, Nova

---

## Critical Incident: Grafana Dashboard Failure (October 21, 2025)

### What Happened
Forge delivered "Production-Ready ✅" monitoring dashboard (October 18) that was completely broken:
- **Claimed:** 13 dashboard panels operational
- **Reality:** ALL panels showed "No Data" due to metric name typo
- **Root Cause:** Tested infrastructure exists, NOT that it works end-to-end
- **Impact:** User frustration, lost confidence, emergency fix required

### The Typo
```json
// WRONG (what Forge created):
"expr": "(genesis_tests_passed_total / genesis_tests_total_total) * 100"

// CORRECT:
"expr": "(genesis_tests_passed_total / genesis_tests_total) * 100"
```

### What Forge Tested
✅ Prometheus endpoint responds (infrastructure)
✅ Grafana endpoint responds (infrastructure)
✅ Docker containers running (infrastructure)

### What Forge DIDN'T Test
❌ Dashboard queries return data (functionality)
❌ Panels display correctly (user experience)
❌ Visual verification with screenshots (end-to-end)

---

## MANDATORY: The Three-Layer Testing Pyramid

### Layer 1: Infrastructure Tests ⚠️ NOT SUFFICIENT
**What:** Services are running, endpoints respond
**Examples:**
- `curl http://localhost:9090/api/v1/targets` returns 200
- `docker ps` shows containers Up
- Import statements don't crash

**Limitation:** Proves nothing works, only that it exists

### Layer 2: Functional Tests ✅ REQUIRED
**What:** Features actually work with real data
**Examples:**
- Query Prometheus: `curl 'http://localhost:9090/api/v1/query?query=genesis_tests_total'` returns actual metric value
- Test dashboard query: Verify each panel's PromQL returns non-empty result
- Run orchestration: Verify HTDAG decomposition produces valid DAG

**Requirements:**
- Test with REAL data, not mocks
- Verify output correctness, not just absence of errors
- Validate edge cases (empty data, missing metrics, etc.)

### Layer 3: End-to-End Visual Validation ✅✅ MANDATORY FOR UI
**What:** Human-verifiable proof that user sees correct output
**Examples:**
- Screenshot of Grafana dashboard showing all 13 panels with data
- Screenshot of Prometheus showing scraped targets
- Screenshot of metrics graph with actual time-series data

**How to Implement:**
1. **Manual Verification (Simple):**
   - Open browser to http://localhost:3000
   - Take screenshot of each dashboard panel
   - Verify each panel shows data (not "No Data")
   - Save screenshots to `docs/validation/YYYYMMDD_component_name/`

2. **Automated Verification (Advanced):**
   - Use Gemini Computer Use API for browser automation
   - Programmatically navigate to Grafana
   - Capture screenshots
   - Use vision model to verify "No Data" text absent

---

## UPDATED: Forge Agent Responsibilities

### Before This Incident
```
Forge: Test infrastructure exists, run pytest, report coverage ✅
```

### After This Incident (MANDATORY)
```
Forge MUST:
1. Test infrastructure exists (pytest, endpoints)
2. Test functionality works (real data flows, queries return results)
3. Test user experience (screenshots, visual validation)
4. Test EACH deliverable claim (if doc says "13 panels work", verify 13 panels)
5. Never claim "Production-Ready ✅" without E2E validation
```

---

## Validation Checklist for UI/Dashboard Components

### Pre-Delivery Checklist (MANDATORY)
- [ ] All infrastructure tests passing (pytest)
- [ ] All functional tests passing (query validation)
- [ ] Screenshot of main UI taken and saved
- [ ] Screenshot shows NO "No Data" / "No metrics" / error messages
- [ ] Each documented feature verified visually
- [ ] Screenshots attached to delivery report
- [ ] E2E test script created (if component critical)

### Example: Grafana Dashboard Validation
```bash
# Infrastructure (NOT sufficient)
curl http://localhost:3000/api/health  # ✅ Grafana running

# Functional (REQUIRED)
curl -s 'http://localhost:9090/api/v1/query?query=genesis_tests_total' | jq '.data.result[0].value[1]'
# Expected: actual number (e.g., "1044")
# NOT Expected: empty array []

# Visual (MANDATORY for dashboards)
# 1. Open browser: http://localhost:3000
# 2. Navigate to dashboard
# 3. Screenshot each panel
# 4. Verify:
#    - Panel 1: Shows "98.28%" pass rate (not "No Data")
#    - Panel 2: Shows error rate value (not "No Data")
#    - Panel 3: Shows P95 latency (not "No Data")
#    - ... (all 13 panels)
# 5. Save screenshots to docs/validation/20251021_grafana_dashboard/
```

---

## Agent-Specific Requirements

### Forge (Testing & E2E Validation)
**MUST provide for every deliverable:**
1. Test coverage report (pytest --cov)
2. Functional test results (query validation, data flow)
3. **NEW:** Screenshots of UI components with data visible
4. **NEW:** E2E validation script for critical paths
5. **NEW:** Visual regression tests for dashboards

**Delivery Format:**
```
## Forge Validation Report

### 1. Infrastructure Tests
- ✅ 36/36 pytest tests passing
- ✅ Coverage: 91%

### 2. Functional Tests
- ✅ Prometheus query returns 1044 tests
- ✅ Grafana data source connected
- ✅ All 13 dashboard queries return non-empty results

### 3. Visual Validation
- ✅ Screenshot: docs/validation/20251021_grafana/dashboard_overview.png
- ✅ Screenshot: docs/validation/20251021_grafana/panel_test_pass_rate.png
- ✅ Screenshot: docs/validation/20251021_grafana/panel_error_rate.png
- ✅ All panels showing data (NO "No Data" messages)

### 4. E2E Test Script
- ✅ scripts/validate_grafana_e2e.sh created
- ✅ Script tests full data flow: metrics_server → Prometheus → Grafana
- ✅ Script exits 1 if any panel shows "No Data"
```

### Alex (Integration Testing)
**MUST validate for integrations:**
1. Each integration point works bidirectionally
2. Data flows in both directions
3. Error handling works for connection failures
4. **NEW:** Screenshot of integrated system showing data exchange

### Nova (Vertex AI Pipelines)
**MUST provide for pipelines:**
1. Pipeline DAG visualization screenshot
2. Each step's output verified
3. End-to-end run completion proof
4. **NEW:** Metrics dashboard showing pipeline performance

---

## Documentation Requirements

### CLAUDE.md Updates
Add to "Agent Development Patterns" section:

```markdown
### E2E Validation for UI Components

When creating dashboards, UIs, or visualizations:
1. Run infrastructure tests (pytest)
2. Run functional tests (query validation)
3. **MANDATORY:** Take screenshots showing data displayed correctly
4. Save screenshots to docs/validation/YYYYMMDD_component_name/
5. Include screenshot links in delivery report

Example:
- Dashboard created: ✅
- 13 panels configured: ✅
- Screenshot proof all panels work: ✅ (see docs/validation/20251021_grafana/)
```

### AGENT_PROJECT_MAPPING.md Updates
Add to Forge responsibilities:

```markdown
### Forge Testing Standards (Updated October 21, 2025)
**MUST provide for every deliverable:**
1. Infrastructure tests (pytest, coverage)
2. Functional tests (real data, query validation)
3. **Visual validation (screenshots of working UI)**
4. E2E validation script for critical paths
5. Never claim "Production-Ready" without Layer 3 validation
```

### PROJECT_STATUS.md Updates
Add new section:

```markdown
## Testing Standards (October 21, 2025)

**Critical Change:** All UI/dashboard components now require screenshot validation.

**Reason:** Grafana dashboard delivered as "Production-Ready ✅" but all panels showed "No Data" due to untested metric name typo.

**New Requirement:** Forge (and all testing agents) must provide visual proof of functionality, not just infrastructure tests.
```

---

## Enforcement

### When Delivering
**Agents MUST include in reports:**
1. "Infrastructure Tests: ✅ X/Y passing"
2. "Functional Tests: ✅ All queries return data"
3. **"Visual Validation: ✅ Screenshots attached (see docs/validation/...)"**

### When Auditing
**Hudson/Oracle/Alex MUST verify:**
1. Screenshots exist in docs/validation/
2. Screenshots show actual data (not error messages)
3. Each documented feature visible in screenshots
4. Reject deliverables missing Layer 3 validation for UI components

### When Approving for Production
**Atlas MUST confirm:**
1. All three testing layers completed
2. Visual validation screenshots reviewed
3. No "No Data" / error messages in screenshots
4. E2E test script exists for critical components

---

## Examples of Proper Validation

### Good: Grafana Dashboard (Post-Fix)
```
✅ Infrastructure: Prometheus/Grafana containers up
✅ Functional: curl query returns genesis_tests_total=1044
✅ Visual: Screenshot shows "98.01% pass rate" in Panel 1
✅ E2E Script: scripts/validate_grafana.sh tests full flow
```

### Bad: Grafana Dashboard (Original Forge Delivery)
```
✅ Infrastructure: Prometheus/Grafana containers up
❌ Functional: Did NOT test if queries return data
❌ Visual: No screenshots provided
❌ E2E: No validation script
Result: "Production-Ready ✅" but completely broken
```

---

## Tools Available

### For Manual Screenshots
1. Open browser to component URL
2. Screenshot tool (macOS: Cmd+Shift+4, Linux: gnome-screenshot)
3. Save to docs/validation/YYYYMMDD_component/

### For Automated Screenshots
1. **Gemini Computer Use API:**
   - Can navigate browser
   - Can take screenshots
   - Can verify UI elements
   - See: https://ai.google.dev/gemini-api/docs/computer-use

2. **Playwright (Python):**
   ```python
   from playwright.sync_api import sync_playwright

   with sync_playwright() as p:
       browser = p.chromium.launch()
       page = browser.new_page()
       page.goto('http://localhost:3000')
       page.screenshot(path='grafana_dashboard.png')
       browser.close()
   ```

3. **Selenium:**
   ```python
   from selenium import webdriver

   driver = webdriver.Chrome()
   driver.get('http://localhost:3000')
   driver.save_screenshot('grafana_dashboard.png')
   driver.quit()
   ```

---

## Metrics for Success

### Pre-October 21, 2025
- Infrastructure tests: 100% passing ✅
- Functional tests: Sometimes ⚠️
- Visual validation: Never ❌
- Result: Broken dashboards in production

### Post-October 21, 2025 (NEW STANDARD)
- Infrastructure tests: 100% passing ✅
- Functional tests: 100% passing ✅
- Visual validation: MANDATORY ✅
- Result: User sees working features on first deployment

---

## Summary: The Three Questions

Before claiming "Production-Ready ✅", answer these:

1. **Does it exist?** (Infrastructure tests)
   - Are containers running?
   - Do endpoints respond?

2. **Does it work?** (Functional tests)
   - Do queries return real data?
   - Does data flow end-to-end?

3. **Can users see it working?** (Visual validation)
   - Does the UI show data (not "No Data")?
   - Are there screenshots proving it?

**If you can't answer YES to all three, it's NOT production-ready.**

---

**Document Version:** 1.0.0
**Effective Date:** October 21, 2025
**Mandatory For:** All agents performing testing/validation
**Non-Compliance:** Deliverables rejected, agents re-assigned
