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

## Pytest Configuration and Plugin Management

### Plugin Autoload: Disabled by Default Pattern

**Context:** Third-party pytest plugins (e.g., pytest-asyncio, pytest-rerunfailures) can cause test failures with "asyncio marker" or similar errors when not available in CI/sandbox environments.

**Solution:** Genesis uses a plugin-disabled-by-default pattern:
- Plugins are **disabled by default** via pytest.ini configuration (-p no:asyncio -p no:rerunfailures)
- Markers are **registered** in pytest.ini to prevent "unknown marker" errors
- Tests run **without plugin dependencies** ensuring CI/sandbox compatibility
- Plugins can be **optionally enabled** for specific test runs if needed (advanced use cases)

### Configuration Files

#### pytest.ini
```ini
[pytest]
# Register markers to prevent "unknown marker" errors when plugins disabled
markers =
    asyncio: Mark test as async (plugin disabled, marker only for compatibility)
    flaky: Tests that may occasionally fail (plugin disabled, marker only for compatibility)
    # ... other markers ...

# Plugin management: Disable autoload by default for CI/sandbox compatibility
addopts =
    # ... other options ...
    -p no:asyncio
    -p no:rerunfailures

# asyncio_mode = auto (configured but plugin disabled by -p no:asyncio above)
asyncio_mode = auto
```

#### pyproject.toml
```toml
# NOTE: Plugins DISABLED by default via pytest.ini (-p no:asyncio -p no:rerunfailures)
#       Markers registered in pytest.ini to prevent "unknown marker" errors
#       Tests run without plugin dependencies for CI/sandbox compatibility
#       Use pytest -p asyncio to enable specific plugins if needed (advanced)
[tool.pytest.ini_options]
minversion = "7.0"
testpaths = ["tests"]
```

### Test Runner Script

Use the provided test runner script for consistent behavior:

```bash
# Run all tests (plugins disabled by default via pytest.ini)
./scripts/run_tests.sh

# Run specific tests
./scripts/run_tests.sh tests/test_orchestration_e2e.py

# Run with coverage
./scripts/run_tests.sh --cov

# Run tests matching a pattern
./scripts/run_tests.sh -k test_htdag

# Enable specific plugins for advanced use cases (override pytest.ini)
pytest -p asyncio tests/test_async_specific.py
pytest -p rerunfailures --reruns 3 tests/test_flaky_specific.py
```

The script sets `PYTEST_DISABLE_PLUGIN_AUTOLOAD=1` by default and provides a consistent test execution environment across all platforms.

### Plugin Management in Different Environments

**Default Behavior (Recommended):**
Plugins are disabled by default via pytest.ini configuration. This ensures tests work in all environments:

```bash
# Plugins disabled automatically via pytest.ini
pytest

# Or use the test runner script (sets PYTEST_DISABLE_PLUGIN_AUTOLOAD=1)
./scripts/run_tests.sh
```

**Enabling Plugins for Specific Tests (Advanced):**
If you need plugin functionality for specific tests, you can override the pytest.ini configuration:

```bash
# Enable asyncio plugin for async-heavy tests
pytest -p asyncio tests/test_async_heavy.py

# Enable rerunfailures for flaky tests
pytest -p rerunfailures --reruns 3 tests/test_network_calls.py

# Enable multiple plugins
pytest -p asyncio -p rerunfailures tests/
```

**Environment Variables:**
The test runner script respects these environment variables:

```bash
# Explicitly disable plugins (default behavior)
export PYTEST_DISABLE_PLUGIN_AUTOLOAD=1
./scripts/run_tests.sh

# Legacy alias (still supported)
export SANDBOX_MODE=1
./scripts/run_tests.sh
```

**Note:** The default configuration (plugins disabled) ensures compatibility across all environments including CI/CD, sandboxes, and local development.

### CI/CD Integration

In CI/CD pipelines (GitHub Actions, Jenkins, etc.), the default configuration (plugins disabled) works out of the box:

```yaml
# GitHub Actions example - plugins disabled by default via pytest.ini
- name: Install dependencies
  run: |
    pip install -r requirements.txt  # pytest and other dependencies

- name: Run tests (plugins disabled by default)
  run: ./scripts/run_tests.sh --maxfail=5

# Alternative: Run directly with pytest (plugins still disabled via pytest.ini)
- name: Run tests
  run: pytest --maxfail=5

# Advanced: Enable plugins for specific test suites if needed
- name: Run async tests with plugin enabled
  run: pytest -p asyncio tests/test_async_specific.py
  if: ${{ env.ENABLE_ASYNC_PLUGIN == 'true' }}
```

### Why This Matters

1. **Universal Compatibility:** Tests work in all environments (CI/CD, sandboxes, local) without plugin dependencies
2. **Sandbox Compatibility:** Claude Code sandboxes can run tests without installing third-party plugins
3. **CI/CD Reliability:** No "asyncio marker" or plugin-related errors in automated pipelines
4. **Consistent Behavior:** Same test behavior across all environments (no plugin-specific variations)
5. **Simplified Dependencies:** No need to install pytest-asyncio or pytest-rerunfailures
6. **Faster Test Setup:** Fewer dependencies to install, faster CI/CD pipeline setup

### Troubleshooting

**Error: "PytestUnknownMarkWarning: Unknown pytest.mark.asyncio"**
- **Cause:** Marker not registered in pytest.ini
- **Solution:** Already fixed - asyncio marker registered in pytest.ini line 44
- **Current Genesis Setting:** Marker registered, plugin disabled by default

**Error: "async def functions are not natively supported"**
- **Cause:** pytest-asyncio plugin disabled but async tests are being run
- **Solution:** This should NOT occur - asyncio plugin is disabled and not required
- **Current Genesis Setting:** Plugin disabled via -p no:asyncio in pytest.ini
- **If you need async support:** Enable plugin explicitly: `pytest -p asyncio tests/test_async.py`

**Error: "pytest: error: unrecognized arguments: --reruns"**
- **Cause:** pytest-rerunfailures plugin disabled but --reruns flag used
- **Solution:** Remove --reruns flag OR enable plugin: `pytest -p rerunfailures --reruns 3`
- **Current Genesis Setting:** Plugin disabled via -p no:rerunfailures in pytest.ini

**Tests still show plugin errors:**
- **Verify:** Check pytest.ini has `-p no:asyncio` and `-p no:rerunfailures` in addopts section (lines 65-66)
- **Verify:** Run tests via `./scripts/run_tests.sh` which sets PYTEST_DISABLE_PLUGIN_AUTOLOAD=1
- **Debug:** Run `pytest --version` to check pytest installation
- **Debug:** Run `pytest --markers` to see registered markers

### Best Practices

1. **Register all markers** in pytest.ini to prevent "unknown marker" warnings
2. **Use the test runner script** (`./scripts/run_tests.sh`) for consistent behavior across environments
3. **Disable plugins by default** in pytest.ini for universal compatibility (-p no:asyncio -p no:rerunfailures)
4. **Enable plugins explicitly** only when needed for specific test suites (advanced use cases)
5. **Document plugin requirements** if tests need specific plugins to function correctly
6. **Test in CI/sandbox environments** to verify tests work without plugin dependencies

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
