# SHADCN/UI Dashboard - Screenshot Validation Guide

**Date:** November 4, 2025  
**Purpose:** Visual validation of all 6 core dashboard views with real data  
**Requirement:** 10+ screenshots showing operational dashboard

---

## Screenshots Required

### 1. Overview Dashboard (2 screenshots)
- **File:** `01_overview_dashboard_full.png`
- **Description:** Full overview dashboard showing system health metrics
- **Data:** Real-time agent status, system metrics, health indicators

- **File:** `02_overview_dashboard_metrics.png`
- **Description:** Close-up of key metrics (agent count, success rate, uptime)
- **Data:** Real metrics from backend API

### 2. Agent Status Grid (2 screenshots)
- **File:** `03_agent_status_grid_full.png`
- **Description:** Full grid showing all 15 agents
- **Data:** Real agent statuses (busy/idle/error), last activity timestamps

- **File:** `04_agent_status_grid_detail.png`
- **Description:** Close-up of individual agent cards
- **Data:** Agent-specific metrics (tasks completed, success rate)

### 3. HALO Routes (2 screenshots)
- **File:** `05_halo_routes_table.png`
- **Description:** Routing decision table
- **Data:** Real routing decisions from HALO router

- **File:** `06_halo_routes_analytics.png`
- **Description:** Routing analytics and charts
- **Data:** Time-series routing patterns

### 4. CaseBank Memory (2 screenshots)
- **File:** `07_casebank_memory_entries.png`
- **Description:** Memory entries table
- **Data:** Real CaseBank entries from casebank.jsonl (10,879 entries)

- **File:** `08_casebank_memory_stats.png`
- **Description:** Memory statistics and performance
- **Data:** Hit rate, entry count, category breakdown

### 5. OTEL Traces (2 screenshots)
- **File:** `09_otel_traces_list.png`
- **Description:** Distributed tracing list
- **Data:** Real OTEL traces (trace_id, span_name, duration_ms)

- **File:** `10_otel_traces_detail.png`
- **Description:** Trace detail view
- **Data:** Span hierarchy, timing breakdown

### 6. Human Approvals (2 screenshots)
- **File:** `11_human_approvals_queue.png`
- **Description:** Approval queue table
- **Data:** Pending high-risk operations

- **File:** `12_human_approvals_detail.png`
- **Description:** Approval detail view
- **Data:** Operation details, risk level, approval status

---

## How to Capture Screenshots

### Step 1: Start Backend
```bash
cd /home/genesis/genesis-rebuild/genesis-dashboard
./start-backend.sh
```

Wait for: `INFO:     Uvicorn running on http://0.0.0.0:8000`

### Step 2: Start Frontend
```bash
cd /home/genesis/genesis-rebuild/genesis-dashboard
./start-frontend.sh
```

Wait for: `✓ Ready in 981ms`

### Step 3: Open Browser
Navigate to: `http://localhost:3001`

### Step 4: Capture Screenshots
1. Click each view in the sidebar (Overview, Agents, HALO, Memory, Traces, Approvals)
2. Wait 5 seconds for data to load
3. Take full-page screenshot
4. Take close-up screenshot of key features
5. Save to `docs/validation/20251030_shadcn_dashboard/`

### Step 5: Verify Data
Ensure screenshots show:
- ✅ Real data (not "Loading..." or empty states)
- ✅ Proper formatting (tables, charts, cards)
- ✅ No console errors (check browser DevTools)
- ✅ Responsive layout (desktop view)

---

## Screenshot Checklist

- [ ] `01_overview_dashboard_full.png` - Overview full view
- [ ] `02_overview_dashboard_metrics.png` - Overview metrics close-up
- [ ] `03_agent_status_grid_full.png` - Agent grid full view
- [ ] `04_agent_status_grid_detail.png` - Agent card close-up
- [ ] `05_halo_routes_table.png` - HALO routes table
- [ ] `06_halo_routes_analytics.png` - HALO analytics
- [ ] `07_casebank_memory_entries.png` - CaseBank entries
- [ ] `08_casebank_memory_stats.png` - CaseBank stats
- [ ] `09_otel_traces_list.png` - OTEL traces list
- [ ] `10_otel_traces_detail.png` - OTEL trace detail
- [ ] `11_human_approvals_queue.png` - Approvals queue
- [ ] `12_human_approvals_detail.png` - Approval detail

**Total:** 12 screenshots (exceeds 10+ requirement)

---

## Validation Criteria

Each screenshot must show:
1. ✅ **Real Data:** Actual data from backend API (not mock/placeholder)
2. ✅ **Proper Rendering:** No layout issues, broken images, or missing components
3. ✅ **Functional UI:** Interactive elements visible (buttons, tables, charts)
4. ✅ **No Errors:** No console errors, no error messages in UI
5. ✅ **Responsive Design:** Proper layout on desktop (1920px width)

---

## Post-Capture Validation

After capturing all screenshots:

1. **Review Each Screenshot:**
   - Verify data is real (not "Loading..." or empty)
   - Check for visual issues (layout, formatting)
   - Ensure all UI elements are visible

2. **Update Audit Report:**
   - Mark screenshot requirement as ✅ COMPLETE
   - Update success criteria validation
   - Increase overall score if applicable

3. **Create Screenshot Index:**
   - List all screenshots with descriptions
   - Include file sizes and dimensions
   - Document any issues or notes

---

## Expected Outcomes

**Before Screenshots:**
- ⚠️ Screenshot requirement: MISSING
- ⚠️ Visual validation: INCOMPLETE
- Overall score: 8.8/10

**After Screenshots:**
- ✅ Screenshot requirement: COMPLETE (12/10 screenshots)
- ✅ Visual validation: COMPLETE
- Overall score: 9.2/10 (expected increase)

---

**Created:** November 4, 2025  
**Purpose:** Guide for capturing dashboard screenshots  
**Status:** Ready for execution  
**Estimated Time:** 30 minutes

