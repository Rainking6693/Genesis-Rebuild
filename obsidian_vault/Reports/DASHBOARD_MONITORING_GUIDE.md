---
title: Genesis Production Dashboard - 48-Hour Monitoring Guide
category: Reports
dg-publish: true
publish: true
tags: []
source: DASHBOARD_MONITORING_GUIDE.md
exported: '2025-10-24T22:05:26.838141'
---

# Genesis Production Dashboard - 48-Hour Monitoring Guide

**Created:** October 21, 2025, 20:00 UTC
**Status:** READY FOR DEPLOYMENT
**Monitoring Period:** 48 hours from deployment start

---

## 🚨 CRITICAL: Dashboard Data Source Issue

**IMPORTANT:** The Grafana dashboard currently shows **SIMULATION DATA** (not real metrics). Use this guide to monitor the REAL production data.

**Real Data Source:** `/home/genesis/genesis-rebuild/logs/continuous_monitoring.log`

---

## ✅ CURRENT PRODUCTION STATUS (Before Deployment)

**Last Check:** October 21, 2025, 19:57 UTC

| Metric | Current Value | SLO Target | Status |
|--------|---------------|------------|--------|
| **Test Pass Rate** | **100.0%** | ≥ 95% | ✅ **PASSING** |
| **Error Rate** | **0.0%** | < 0.1% | ✅ **PASSING** |
| **P95 Latency** | **< 200ms** | < 200ms | ✅ **PASSING** |
| **Service Health** | **All UP** | 99.9% | ✅ **PASSING** |

**All SLOs Met:** ✅ **READY FOR DEPLOYMENT**

---

## 📊 DASHBOARD PANELS - WHAT TO WATCH

### Panel 1: Test Pass Rate (Most Important)
**Location:** Top left, large stat panel
**What it shows:** Percentage of tests passing

| Display | Meaning | Your Action |
|---------|---------|-------------|
| **98-100%** (GREEN) | ✅ Excellent | Continue monitoring |
| **95-98%** (YELLOW) | ⚠️ Warning | Investigate within 30 min |
| **< 95%** (RED) | 🚨 CRITICAL | **ROLLBACK WITHIN 15 MIN** |

**Where to check REAL data:**
```bash
tail -f /home/genesis/genesis-rebuild/logs/continuous_monitoring.log | grep "Test Pass Rate"
# Expected output: "Test Pass Rate: 100.0% (SLO: ≥95%)"
```

---

### Panel 2: Error Rate
**Location:** Top center, stat panel
**What it shows:** Percentage of errors per operation

| Display | Meaning | Your Action |
|---------|---------|-------------|
| **< 0.1%** (GREEN) | ✅ Normal | Continue monitoring |
| **0.1-0.5%** (YELLOW) | ⚠️ Warning | Investigate within 30 min |
| **> 0.5%** (RED) | 🚨 CRITICAL | **ROLLBACK WITHIN 15 MIN** |

**Where to check REAL data:**
```bash
grep "Error Rate" /home/genesis/genesis-rebuild/logs/continuous_monitoring.log | tail -5
# Expected: "Error Rate: 0.0%" (or very low)
```

---

### Panel 3: P95 Latency
**Location:** Top right, stat panel
**What it shows:** 95th percentile operation latency in milliseconds

| Display | Meaning | Your Action |
|---------|---------|-------------|
| **< 200ms** (GREEN) | ✅ Fast | Continue monitoring |
| **200-500ms** (YELLOW) | ⚠️ Slow | Investigate within 30 min |
| **> 500ms** (RED) | 🚨 CRITICAL | **ROLLBACK WITHIN 15 MIN** |

**Where to check REAL data:**
```bash
# Check operation duration from continuous monitoring
grep "operation_duration" /home/genesis/genesis-rebuild/logs/continuous_monitoring.log | tail -5
```

---

### Panel 4: System Health
**Location:** Second row, left
**What it shows:** Service up/down status

| Display | Meaning | Your Action |
|---------|---------|-------------|
| **All services UP** (GREEN) | ✅ Healthy | Continue monitoring |
| **1 service DOWN** (YELLOW) | ⚠️ Degraded | Investigate within 5 min |
| **Multiple DOWN** (RED) | 🚨 CRITICAL | **ROLLBACK IMMEDIATELY** |

**Where to check REAL data:**
```bash
# Check A2A service
curl http://localhost:8080/health
# Expected: {"status":"healthy","agents_loaded":15}

# Check Prometheus
curl http://localhost:9090/-/healthy
# Expected: "Prometheus Server is Healthy."

# Check Grafana
curl http://localhost:3000/api/health
# Expected: {"database":"ok"}
```

---

### Panel 5-7: Test Pass Rate / Error Rate / Latency Over Time
**Location:** Row 2-3, time-series graphs
**What they show:** Historical trends over 48 hours

**What to watch for:**
- ✅ **Stable horizontal lines** = Good
- ⚠️ **Gradual decline** = Warning (investigate)
- 🚨 **Sudden drop/spike** = Critical (rollback)

**Trends to watch:**
- Test pass rate should stay **≥ 98%** (green zone)
- Error rate should stay **< 0.1%** (green zone)
- P95 latency should stay **< 200ms** (green zone)

---

### Panel 8: System Resource Usage
**Location:** Middle row, graph
**What it shows:** CPU and Memory usage

| Display | Meaning | Your Action |
|---------|---------|-------------|
| **< 80%** (GREEN) | ✅ Normal | Continue monitoring |
| **80-90%** (YELLOW) | ⚠️ High | Monitor closely |
| **> 90%** (RED) | 🚨 Exhausted | Investigate immediately |

---

### Panel 9-11: HTDAG / HALO / AOP Performance
**Location:** Bottom rows
**What they show:** Individual component performance

**Benchmarks (from Phase 3):**
- HTDAG decomposition: **< 120ms** (target: 110ms avg)
- HALO routing: **< 30ms** (target: 27ms avg)
- AOP validation: **< 55ms** (target: 50ms avg)

**If any component exceeds 2X benchmark:**
- ⚠️ Investigate performance degradation
- 🚨 If 5X benchmark → rollback

---

### Panel 12: Test Execution Details
**Location:** Bottom left, table
**What it shows:** Breakdown of passed/failed/skipped tests

**Normal state:**
- Passed: **35-36** (out of 36 total)
- Failed: **0**
- Skipped: **0-1** (feature flags test may skip)

**Alert if:**
- Failed > 0 (investigate immediately)
- Passed < 34 (investigate immediately)

---

### Panel 13: Active Alerts
**Location:** Bottom right
**What it shows:** Prometheus alerts currently firing

**Normal state:** **0 alerts** (green)

**If alerts appear:**
1. Check severity (CRITICAL, WARNING, INFO)
2. Follow response procedure (see below)

---

## 🚨 ALERT RESPONSE PROCEDURES

### CRITICAL Alerts (P0-P1) - Response Time: 5 Minutes

| Alert | Trigger | Action |
|-------|---------|--------|
| **TestPassRateLow** | < 95% for 10 min | **ROLLBACK IMMEDIATELY** |
| **HighErrorRate** | > 0.5% for 5 min | **ROLLBACK IMMEDIATELY** |
| **GenesisServiceDown** | Service down 2+ min | Investigate 1 min, then **ROLLBACK** |
| **HighLatencyP95** | > 500ms for 10 min | **ROLLBACK IMMEDIATELY** |

### WARNING Alerts (P2-P3) - Response Time: 30 Minutes

| Alert | Trigger | Action |
|-------|---------|--------|
| **TestPassRateDegrading** | 95-98% for 15 min | Activate Forge agent, investigate |
| **HighMemoryUsage** | > 80% for 10 min | Activate Vanguard agent, investigate |
| **HTDAGDecompositionSlow** | > 150ms for 10 min | Monitor, log issue |
| **HALORoutingSlow** | > 130ms for 10 min | Monitor, log issue |

### INFO Alerts (P4) - Response Time: Next Day

| Alert | Trigger | Action |
|-------|---------|--------|
| **IntermittentTestFailures** | Known flaky tests | Log, review post-deployment |

---

## 🔄 5-MINUTE CHECK-IN PROCEDURE

**Your continuous monitoring script runs every 5 minutes.** Here's what it does:

1. ✅ Runs 36 production health tests
2. ✅ Calculates Test Pass Rate, Error Rate, Latency
3. ✅ Records results to `/home/genesis/genesis-rebuild/logs/continuous_monitoring.log`
4. ✅ Checks for threshold violations
5. ✅ Triggers alerts if needed

**Your Job (Every 30 Minutes for First 24h):**

```bash
# Quick health check (30 seconds)
tail -20 /home/genesis/genesis-rebuild/logs/continuous_monitoring.log

# Look for:
# ✅ "Test Pass Rate: 100.0% (SLO: ≥95%)" - GOOD
# ⚠️ "Test Pass Rate: 97.5% (SLO: ≥95%)" - WARNING
# 🚨 "Test Pass Rate: 93.0% (SLO: ≥95%)" - ROLLBACK

# Check service health
curl -s http://localhost:8080/health | jq
# Expected: {"status":"healthy","agents_loaded":15}
```

**If everything shows GREEN/PASSING:**
- Record timestamp
- Continue monitoring

**If anything shows YELLOW/WARNING:**
- Investigate within 30 minutes
- Check specific failing tests
- Activate appropriate agent (Forge/Alex/Hudson)

**If anything shows RED/CRITICAL:**
- **EXECUTE ROLLBACK IMMEDIATELY** (15-minute SLA)
- See `/home/genesis/genesis-rebuild/docs/ROLLBACK_PROCEDURES.md`

---

## 📈 HOURLY SUMMARY CHECKLIST

### Every Hour (Hours 0-24)

- [ ] Check `/home/genesis/genesis-rebuild/logs/continuous_monitoring.log`
- [ ] Verify Test Pass Rate ≥ 98%
- [ ] Verify Error Rate < 0.1%
- [ ] Verify all services healthy
- [ ] Check for any Prometheus alerts
- [ ] Record status in monitoring journal

**Quick Command:**
```bash
echo "=== $(date) ===" >> /home/genesis/monitoring_journal.txt
tail -10 /home/genesis/genesis-rebuild/logs/continuous_monitoring.log | grep "Test Pass Rate" >> /home/genesis/monitoring_journal.txt
curl -s http://localhost:8080/health >> /home/genesis/monitoring_journal.txt
echo "" >> /home/genesis/monitoring_journal.txt
```

### Every 2 Hours (Hours 24-48)

Same as above, but less frequent (system should be stable by then).

---

## 🎯 SUCCESS CRITERIA (After 48 Hours)

**To proceed to 100% traffic, ALL must be true:**

- [ ] Test Pass Rate ≥ 98% for entire 48h period
- [ ] Error Rate < 0.1% for entire 48h period
- [ ] P95 Latency < 200ms for entire 48h period
- [ ] Service uptime ≥ 99.9%
- [ ] Zero CRITICAL alerts triggered
- [ ] Zero rollbacks executed

**If ALL criteria met:**
- ✅ Scale to 100% traffic
- ✅ Continue monitoring for 24 more hours
- ✅ Generate success report

**If ANY criteria violated:**
- ⚠️ Extend monitoring by 48 hours
- ⚠️ Fix issues before scaling
- ⚠️ Document failures and root causes

---

## 🛠️ QUICK COMMAND REFERENCE

### Check Real Metrics (Log-Based)
```bash
# Test pass rate (most important)
tail -f /home/genesis/genesis-rebuild/logs/continuous_monitoring.log | grep "Test Pass Rate"

# Latest full status
tail -50 /home/genesis/genesis-rebuild/logs/continuous_monitoring.log

# Count test runs in last hour
grep "Test Pass Rate" /home/genesis/genesis-rebuild/logs/continuous_monitoring.log | tail -12
```

### Check Service Health
```bash
# A2A service
curl http://localhost:8080/health

# Prometheus
curl http://localhost:9090/-/healthy

# Grafana
curl http://localhost:3000/api/health

# All services
docker ps --format "table {{.Names}}\t{{.Status}}"
```

### Check Active Alerts
```bash
# Prometheus alerts
curl -s http://localhost:9090/api/v1/alerts | jq '.data.alerts | length'
# Expected: 0

# View alert details
curl -s http://localhost:9090/api/v1/alerts | jq '.data.alerts'
```

### Emergency Rollback
```bash
# See full procedure in:
cat /home/genesis/genesis-rebuild/docs/ROLLBACK_PROCEDURES.md

# Quick rollback (feature flag to 0%)
# Follow 15-minute SLA procedure
```

---

## 📞 ESCALATION PATH

1. **You** (Primary Monitor) - Check dashboard every 30 min (0-24h), every 2h (24-48h)
2. **Continuous Monitoring Script** (Automated) - Runs every 5 minutes, logs results
3. **Prometheus Alertmanager** (Automated) - Fires alerts on threshold violations
4. **Claude Agents** (On-Demand) - Activate via Claude Code when investigation needed:
   - **Forge** - For monitoring/test issues
   - **Alex** - For integration failures
   - **Hudson** - For code fixes
   - **Sentinel** - For security incidents
   - **Vanguard** - For performance/scaling

---

## 📊 DASHBOARD ACCESS

**Grafana:** http://YOUR_VPS_IP:3000
**Username:** admin
**Password:** ULRSS74Jzij4Wy5zLHFGLuivy9vdLwtK

**Prometheus:** http://YOUR_VPS_IP:9090
**Alertmanager:** http://YOUR_VPS_IP:9093

---

## ✅ FINAL PRE-DEPLOYMENT CHECKLIST

Before starting the 48-hour monitoring period:

- [x] Security fixes deployed (authentication active)
- [x] GENESIS_ENV=production set
- [x] All 36 security tests passing
- [x] Continuous monitoring script running
- [x] Test pass rate: 100.0% ✅
- [x] Error rate: 0.0% ✅
- [x] All services healthy ✅
- [ ] User has read this guide
- [ ] User knows how to check logs
- [ ] User knows rollback procedure
- [ ] User has set calendar reminders (every 30 min first 24h)

---

**Status:** ✅ **READY FOR PRODUCTION DEPLOYMENT**
**Date:** October 21, 2025, 20:00 UTC
**Next Action:** Begin progressive rollout (0% → 25% → 50% → 100%)
