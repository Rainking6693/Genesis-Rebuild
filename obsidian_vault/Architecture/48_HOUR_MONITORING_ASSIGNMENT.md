---
title: 48-HOUR MONITORING ASSIGNMENT - GENESIS PRODUCTION DEPLOYMENT
category: Architecture
dg-publish: true
publish: true
tags: []
source: docs/48_HOUR_MONITORING_ASSIGNMENT.md
exported: '2025-10-24T22:05:26.895970'
---

# 48-HOUR MONITORING ASSIGNMENT - GENESIS PRODUCTION DEPLOYMENT

**Status:** ACTIVE - Deployment in Progress
**Date Created:** October 21, 2025
**Monitoring Period:** Start of progressive rollout → 48 hours post-deployment
**Last Updated:** October 21, 2025, 18:30 UTC

---

## 🚨 CRITICAL: MONITORING RESPONSIBILITY

### The Reality Check

**AGENTS CANNOT RUN AUTONOMOUSLY FOR 48 HOURS** - They require human activation through Claude Code sessions.

**SOLUTION:** Hybrid Human + Automated Monitoring System

---

## MONITORING TEAM STRUCTURE

### 1. AUTOMATED LAYER (24/7 Autonomous)

**System:** `continuous_monitoring.sh` script (already implemented by Forge)

**Capabilities:**
- ✅ Runs every 5 minutes automatically
- ✅ Checks Prometheus, Grafana, Alertmanager health
- ✅ Executes production health test suite
- ✅ Calculates SLO metrics
- ✅ Records snapshots to JSON
- ✅ Triggers alerts on threshold violations

**How to Start:**
```bash
cd /home/genesis/genesis-rebuild
nohup ./scripts/continuous_monitoring.sh --loop >> logs/continuous_monitoring.log 2>&1 &

# Verify running
ps aux | grep continuous_monitoring
```

**Logs:**
- `/home/genesis/genesis-rebuild/logs/continuous_monitoring.log`
- `/home/genesis/genesis-rebuild/logs/health_check.log`
- `/home/genesis/genesis-rebuild/monitoring/metrics_snapshot.json`

---

### 2. ALERTING LAYER (Instant Notifications)

**System:** Prometheus Alertmanager + Grafana Alerts

**Configured Alerts (18 total):**
- **CRITICAL (P0-P1):** Service down, high error rate, test pass rate low, high latency
- **WARNING (P2-P3):** Performance degradation, resource usage high
- **INFO (P4):** Intermittent test failures

**Notification Channels:**
1. **Grafana Dashboard:** http://external-ip:3000 (admin/ULRSS74Jzij4Wy5zLHFGLuivy9vdLwtK)
2. **Prometheus Alerts:** http://external-ip:9090/alerts
3. **Alertmanager:** http://external-ip:9093/#/alerts

**OPTIONAL (Recommended for Production):**
- Slack webhook (configure in `monitoring/alertmanager_config.yml`)
- PagerDuty integration
- Email notifications

---

### 3. HUMAN MONITORING LAYER (Response & Decision Making)

**Primary Responsibility: USER (You)**

**Why:** Only you can:
- Access the external Grafana dashboard 24/7
- Respond to real-time alerts
- Make rollback decisions
- Activate Claude agents when needed

**Monitoring Schedule:**

#### Hours 0-24 (Critical Period)
- **Check dashboard every 30 minutes**
- **Respond to CRITICAL alerts within 5 minutes**
- **Respond to WARNING alerts within 30 minutes**

#### Hours 24-48 (Stabilization Period)
- **Check dashboard every 2 hours**
- **Respond to CRITICAL alerts within 15 minutes**
- **Respond to WARNING alerts within 1 hour**

**Access Points:**
```
Grafana:       http://YOUR_VPS_IP:3000
Username:      admin
Password:      ULRSS74Jzij4Wy5zLHFGLuivy9vdLwtK

Prometheus:    http://YOUR_VPS_IP:9090
Alertmanager:  http://YOUR_VPS_IP:9093
```

---

### 4. AGENT ACTIVATION LAYER (On-Demand Expertise)

**When to Activate Agents:**

#### CRITICAL Alerts (P0-P1) - Activate Immediately

**Forge** - For monitoring/testing issues
```
Activate when:
- Test pass rate drops below 98%
- Dashboard shows anomalies
- Continuous monitoring script fails
- Need to investigate test failures

Expertise:
- Built the monitoring infrastructure
- Knows all 36 health tests
- Can debug Prometheus/Grafana issues
```

**Alex** - For integration/test failures
```
Activate when:
- Multiple test failures across agents
- Integration points breaking
- Playwright/E2E tests failing
- Need comprehensive test debugging

Expertise:
- Integration testing specialist
- Validated staging environment
- Can run full test suites
```

**Hudson** - For code review/emergency fixes
```
Activate when:
- Need emergency code fix
- Production bug identified
- Code quality issue causing failures
- Need rapid code review for hotfix

Expertise:
- Code review specialist
- Can identify bugs quickly
- Pull request analysis
```

**Sentinel** - For security incidents
```
Activate when:
- Security alerts triggered
- Authentication failures spike
- Suspicious API key attempts
- Need security audit

Expertise:
- Security hardening specialist
- Can audit for vulnerabilities
- Sandboxing and validation
```

**Vanguard** - For MLOps/scaling issues
```
Activate when:
- Performance degradation
- Resource exhaustion
- Need to scale infrastructure
- Pipeline optimization required

Expertise:
- MLOps orchestration
- GenAI pipeline scaling
- Performance tuning
```

**Current Claude Session** - For rollback decisions
```
Activate when:
- Need immediate rollback decision
- SLOs violated consistently
- Multiple CRITICAL alerts firing
- Emergency situation requiring judgment

Authority:
- Final decision maker
- Can execute rollback procedures
- Can modify monitoring parameters
- Can escalate to user
```

---

## MONITORING WORKFLOW

### Normal Operations (Green Status)

```
Every 5 minutes:
  Automated Script Runs
    ↓
  Health Tests Execute (36 tests)
    ↓
  Metrics Recorded to JSON
    ↓
  Prometheus Scrapes Metrics
    ↓
  Grafana Displays Dashboard
    ↓
  User Checks Dashboard Periodically
```

### Alert Triggered (Yellow/Red Status)

```
Threshold Violated
  ↓
Alertmanager Fires Alert
  ↓
Grafana Shows Red Panel
  ↓
User Sees Alert in Dashboard
  ↓
User Reviews Alert Severity
  ↓
[If CRITICAL (P0-P1)]
  ↓
User Activates Appropriate Agent via Claude Code
  ↓
Agent Investigates Issue
  ↓
Agent Recommends Fix or Rollback
  ↓
User Makes Decision
  ↓
[If Rollback Required]
  ↓
Execute Rollback (15-minute SLA)
  ↓
Verify System Restored
```

---

## CRITICAL THRESHOLDS & RESPONSES

### 🔴 IMMEDIATE ROLLBACK TRIGGERS (15-minute SLA)

**Trigger 1: Test Pass Rate < 95% for 10 minutes**
```
Action: ROLLBACK IMMEDIATELY
Procedure: See docs/ROLLBACK_PROCEDURES.md
SLA: 15 minutes from trigger to rollback complete
```

**Trigger 2: Error Rate > 0.5% for 5 minutes**
```
Action: ROLLBACK IMMEDIATELY
Reason: System experiencing critical failures
SLA: 15 minutes
```

**Trigger 3: Service Down for 2 minutes**
```
Action: INVESTIGATE FIRST (1 minute), then ROLLBACK
Reason: May be temporary network issue
SLA: 3 minutes investigation + 15 minutes rollback = 18 minutes
```

**Trigger 4: P95 Latency > 500ms for 10 minutes**
```
Action: ROLLBACK (performance unacceptable)
Reason: 2.5x worse than SLO target (200ms)
SLA: 15 minutes
```

### 🟡 WARNING - INVESTIGATE (30-minute SLA)

**Warning 1: Test Pass Rate 95-98% for 15 minutes**
```
Action: Activate Forge to investigate
Check: Which tests are failing? New failures or known flaky tests?
Decision: If new failures, prepare rollback. If known flaky, continue monitoring.
```

**Warning 2: Error Rate 0.1-0.5% for 10 minutes**
```
Action: Activate Alex to run full test suite
Check: Are errors localized or systemic?
Decision: Trend improving → monitor. Trend worsening → rollback.
```

**Warning 3: High Memory/CPU Usage (>80%) for 15 minutes**
```
Action: Activate Vanguard to investigate resource usage
Check: Memory leak? CPU spike? Expected load?
Decision: If leak detected → rollback. If expected → continue.
```

### 🟢 INFO - LOG & CONTINUE

**Info 1: Intermittent Test Failures (P4)**
```
Action: Log to monitoring/alerts_triggered.json
Review: Check if pattern matches known flaky tests
Decision: Continue deployment, investigate post-48h
```

---

## HOURLY CHECKLIST (For Human Monitor)

### Every Hour (Hours 0-24)

- [ ] Check Grafana dashboard (all panels green?)
- [ ] Review Prometheus alerts page (any firing?)
- [ ] Check continuous monitoring log (any errors?)
- [ ] Verify metrics snapshot updated (check timestamp)
- [ ] Record status in monitoring log

**Quick Status Check:**
```bash
# SSH to VPS, then:
tail -20 /home/genesis/genesis-rebuild/logs/continuous_monitoring.log
curl -s http://localhost:9090/api/v1/alerts | jq '.data.alerts | length'
# Expected: 0 (no alerts firing)
```

### Every 2 Hours (Hours 24-48)

- [ ] Same as above (less frequent after stabilization)
- [ ] Review metrics trends (improving or degrading?)
- [ ] Check for slow degradation patterns

---

## ROLLBACK DECISION MATRIX

| Condition | Duration | Severity | Action | SLA |
|-----------|----------|----------|--------|-----|
| Service Down | 2 min | CRITICAL | Investigate, then Rollback | 3 + 15 min |
| Test Pass Rate < 95% | 10 min | CRITICAL | Rollback Immediately | 15 min |
| Error Rate > 0.5% | 5 min | CRITICAL | Rollback Immediately | 15 min |
| P95 Latency > 500ms | 10 min | CRITICAL | Rollback Immediately | 15 min |
| Test Pass Rate 95-98% | 15 min | WARNING | Investigate | 30 min |
| Error Rate 0.1-0.5% | 10 min | WARNING | Investigate | 30 min |
| High CPU/Memory | 15 min | WARNING | Investigate | 30 min |
| Intermittent Failures | N/A | INFO | Log & Monitor | N/A |

---

## ROLLBACK EXECUTION (Emergency Procedure)

### Stage 1: STOP TRAFFIC (1 minute)
```bash
# Set feature flag to 0%
export FEATURE_FLAGS_CONFIG=/home/genesis/genesis-rebuild/config/feature_flags.json
# Update genesis_orchestration_v2.enabled=false

# Restart services
docker restart genesis-a2a-service
```

### Stage 2: VERIFY ROLLBACK (2 minutes)
```bash
# Check services using old version
curl http://localhost:8080/health
# Should show old orchestration version

# Run health tests
pytest tests/test_production_health.py -v
# Should pass with old version
```

### Stage 3: RESTORE BASELINE (5 minutes)
```bash
# Full rollback procedure in docs/ROLLBACK_PROCEDURES.md
# Includes:
# - Git revert to stable commit
# - Database rollback (if needed)
# - Config file restore
# - Service restarts
```

### Stage 4: VALIDATE STABLE (5 minutes)
```bash
# Verify all SLOs met
# Test pass rate >= 98%
# Error rate < 0.1%
# P95 latency < 200ms
```

### Stage 5: REPORT (2 minutes)
```bash
# Update monitoring log
# Notify stakeholders
# Create incident report
```

**Total SLA: 15 minutes**

---

## CONTACT INFORMATION

### Human Monitor (Primary)
- **Name:** User
- **Availability:** 24/7 (Dashboard Access)
- **Response Time:** 5 minutes (CRITICAL), 30 minutes (WARNING)

### Automated Systems
- **Continuous Monitoring Script:** Always running (5-minute intervals)
- **Prometheus Alerts:** Always active (15-60 second evaluation)
- **Grafana Dashboard:** Always accessible

### Agent Activation (Via Claude Code)
- **Forge:** Testing/Monitoring expertise
- **Alex:** Integration testing expertise
- **Hudson:** Code review/emergency fixes
- **Sentinel:** Security incidents
- **Vanguard:** MLOps/scaling issues
- **Current Session:** Rollback decisions

---

## SUCCESS CRITERIA

### After 48 Hours (All Must Be True)

- [ ] Zero CRITICAL alerts triggered (P0-P1)
- [ ] Test pass rate consistently >= 98%
- [ ] Error rate consistently < 0.1%
- [ ] P95 latency consistently < 200ms
- [ ] Service uptime >= 99.9%
- [ ] No rollbacks executed
- [ ] All monitoring systems operational
- [ ] Metrics logs complete (576 snapshots = 48h × 12 per hour)

### If ALL criteria met:
- ✅ Scale to 100% traffic
- ✅ Continue monitoring for 24 more hours
- ✅ Generate success report

### If ANY criteria violated:
- ⚠️ Extend monitoring period by 48 hours
- ⚠️ Investigate root causes
- ⚠️ Apply fixes and restart deployment

---

## APPENDIX: QUICK COMMAND REFERENCE

### Start Monitoring
```bash
# SSH to VPS
ssh user@YOUR_VPS_IP

# Start continuous monitoring
cd /home/genesis/genesis-rebuild
nohup ./scripts/continuous_monitoring.sh --loop >> logs/continuous_monitoring.log 2>&1 &
```

### Check Status
```bash
# View recent logs
tail -50 logs/continuous_monitoring.log

# Check metrics snapshot
jq '.[-1]' monitoring/metrics_snapshot.json

# View active alerts
curl -s http://localhost:9090/api/v1/alerts | jq '.data.alerts'
```

### Emergency Rollback
```bash
# Fast rollback (feature flag only)
# See docs/ROLLBACK_PROCEDURES.md for full procedure
export GENESIS_ENV=production
# Set feature flag to 0%
docker restart genesis-a2a-service
```

---

**Document Version:** 1.0.0
**Status:** ACTIVE - Ready for Production Deployment
**Last Updated:** October 21, 2025, 18:30 UTC
