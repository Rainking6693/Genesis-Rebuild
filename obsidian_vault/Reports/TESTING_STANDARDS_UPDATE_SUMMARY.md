---
title: Testing Standards Update - October 21, 2025
category: Reports
dg-publish: true
publish: true
tags: []
source: TESTING_STANDARDS_UPDATE_SUMMARY.md
exported: '2025-10-24T22:05:26.807698'
---

# Testing Standards Update - October 21, 2025

## What Happened: Grafana Dashboard Incident

**Problem:** Forge delivered "Production-Ready ✅" monitoring dashboard that was completely broken.
- ALL 13 panels showed "No Data"
- Root cause: Metric name typo (`genesis_tests_total_total` vs `genesis_tests_total`)
- Forge tested infrastructure exists, NOT that it works end-to-end

**Impact:** User frustration, lost confidence, emergency fix required by current Claude session.

---

## Root Cause Analysis

### What Forge Tested (Infrastructure Only)
✅ Prometheus endpoint responds
✅ Grafana endpoint responds
✅ Docker containers running

### What Forge DIDN'T Test (Functionality & User Experience)
❌ Dashboard queries return data
❌ Panels display correctly
❌ Visual verification with screenshots

**Conclusion:** Testing that services exist ≠ Testing that they work

---

## New Mandatory Requirements

### The Three-Layer Testing Pyramid

**ALL THREE LAYERS REQUIRED FOR UI/DASHBOARD COMPONENTS:**

#### Layer 1: Infrastructure Tests
- Services running, endpoints responding
- Example: `curl http://localhost:9090/-/healthy`
- ⚠️ **NOT SUFFICIENT ALONE**

#### Layer 2: Functional Tests
- Real data flows, queries return correct results
- Example: `curl 'http://localhost:9090/api/v1/query?query=genesis_tests_total'` returns actual value
- ✅ **REQUIRED**

#### Layer 3: Visual Validation
- Screenshot proof that user sees working features
- NO "No Data" / error messages visible
- ✅✅ **MANDATORY FOR ALL UI COMPONENTS**

---

## Files Created/Updated

### 1. NEW: `/home/genesis/genesis-rebuild/docs/TESTING_STANDARDS.md`
**Purpose:** Comprehensive testing policy for all agents
**Size:** ~450 lines
**Key Sections:**
- Grafana incident post-mortem
- Three-layer testing pyramid
- Mandatory screenshot requirements
- Agent-specific validation checklists
- Visual validation tools (Gemini Computer Use, Playwright, Selenium)
- Examples of proper vs improper validation

### 2. UPDATED: `/home/genesis/genesis-rebuild/.claude/agents/Forge.md`
**Added Critical Section:**
```markdown
**CRITICAL (Updated October 21, 2025):**
The Three-Layer Testing Pyramid (ALL REQUIRED):
1. Infrastructure Tests: Services running, endpoints responding
2. Functional Tests: Real data flows, queries return correct results
3. Visual Validation: MANDATORY for UI/dashboards - screenshot proof

**For ANY UI component:**
- MUST take screenshots showing data displayed correctly
- MUST save to docs/validation/YYYYMMDD_component_name/
- MUST include screenshot links in delivery report
- NEVER claim "Production-Ready ✅" without visual validation
```

---

## New Validation Checklist for UI Components

### Pre-Delivery Checklist (MANDATORY)
- [ ] All infrastructure tests passing (pytest)
- [ ] All functional tests passing (query validation)
- [ ] Screenshot of main UI taken and saved
- [ ] Screenshot shows NO "No Data" / "No metrics" / error messages
- [ ] Each documented feature verified visually
- [ ] Screenshots attached to delivery report
- [ ] E2E test script created (if component critical)

### Delivery Report Format
```markdown
## Forge Validation Report

### 1. Infrastructure Tests
- ✅ 36/36 pytest tests passing
- ✅ Coverage: 91%

### 2. Functional Tests
- ✅ Prometheus query returns 1044 tests
- ✅ All 13 dashboard queries return non-empty results

### 3. Visual Validation (NEW REQUIREMENT)
- ✅ Screenshot: docs/validation/20251021_grafana/dashboard_overview.png
- ✅ Screenshot: docs/validation/20251021_grafana/panel_test_pass_rate.png
- ✅ All panels showing data (NO "No Data" messages)

### 4. E2E Test Script
- ✅ scripts/validate_grafana_e2e.sh created
- ✅ Script exits 1 if any panel shows "No Data"
```

---

## Tools for Visual Validation

### Manual (Simple)
1. Open browser to component URL
2. Take screenshot (OS tool)
3. Save to docs/validation/YYYYMMDD_component/

### Automated (Recommended)
1. **Gemini Computer Use API** - Browser automation with screenshots
2. **Playwright** - Headless browser testing
3. **Selenium** - Web UI automation

See TESTING_STANDARDS.md for code examples.

---

## Enforcement

### Agents Affected
- **Forge:** Primary testing agent - MUST follow all three layers
- **Alex:** Integration testing - MUST provide screenshots for integrations
- **Nova:** Pipeline testing - MUST provide DAG visualizations

### Audit Requirements
- **Hudson/Oracle:** Must verify screenshots exist before approving
- **Atlas:** Must confirm visual validation before production deployment

### Non-Compliance
- Deliverables rejected
- Agents re-assigned
- "Production-Ready ✅" claims invalidated

---

## The Three Questions

Before claiming "Production-Ready ✅", answer:

1. **Does it exist?** (Infrastructure)
   - Are containers running?
   - Do endpoints respond?

2. **Does it work?** (Functional)
   - Do queries return real data?
   - Does data flow end-to-end?

3. **Can users see it working?** (Visual)
   - Does the UI show data?
   - Are there screenshots proving it?

**If you can't answer YES to all three, it's NOT production-ready.**

---

## Metrics for Success

### Before October 21, 2025
- Infrastructure tests: 100% ✅
- Functional tests: Sometimes ⚠️
- Visual validation: Never ❌
- **Result:** Broken dashboards in production

### After October 21, 2025 (NEW STANDARD)
- Infrastructure tests: 100% ✅
- Functional tests: 100% ✅
- Visual validation: MANDATORY ✅
- **Result:** Users see working features on first deployment

---

## Next Steps

### Immediate
1. ✅ TESTING_STANDARDS.md created
2. ✅ Forge agent definition updated
3. ⏳ Update CLAUDE.md with E2E validation requirements
4. ⏳ Update AGENT_PROJECT_MAPPING.md with Forge new responsibilities
5. ⏳ Update PROJECT_STATUS.md with new testing policy

### Future Deployments
- All UI components require screenshot validation
- All agents must follow three-layer pyramid
- Atlas enforces compliance before production approval

---

## Summary

**Problem:** Forge delivered broken dashboard claiming "Production-Ready ✅"
**Root Cause:** Only tested infrastructure, not functionality or user experience
**Solution:** Mandatory three-layer testing pyramid with screenshot requirements
**Enforcement:** Non-compliance = rejection, policy active immediately

**Key Document:** `/home/genesis/genesis-rebuild/docs/TESTING_STANDARDS.md`

---

**Document Status:** Complete
**Date:** October 21, 2025
**Effective Immediately:** All future testing deliverables
