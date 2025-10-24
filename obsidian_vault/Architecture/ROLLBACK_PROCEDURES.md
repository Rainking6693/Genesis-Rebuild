---
title: Genesis Production Rollback Procedures
category: Architecture
dg-publish: true
publish: true
tags:
- '2'
- '3'
- '4'
- '6'
- '1'
- '5'
source: docs/ROLLBACK_PROCEDURES.md
exported: '2025-10-24T22:05:26.889927'
---

# Genesis Production Rollback Procedures

**Status:** Production-Ready
**Author:** Forge (Testing & Validation Specialist)
**Date:** 2025-10-18
**Version:** 1.0.0
**SLA:** 15-minute complete rollback time

---

## Executive Summary

This document provides step-by-step procedures for rolling back Genesis Phase 4 deployments. The rollback SLA is **15 minutes** from decision to fully restored service.

**Rollback Triggers:**
- **CRITICAL (Auto-rollback):** Error rate > 1%, Pass rate < 95%, P95 latency > 500ms, Service down > 2 min
- **MANUAL (Team decision):** Security vulnerability, data corruption, customer-impacting bugs

**Success Criteria After Rollback:**
- Service health: UP
- Pass rate: > 98%
- Error rate: < 0.1%
- P95 latency: < 200ms
- All smoke tests passing

---

## Table of Contents

1. [Pre-Rollback Preparation](#1-pre-rollback-preparation)
2. [Rollback Execution (15-Minute SLA)](#2-rollback-execution-15-minute-sla)
3. [Rollback Verification](#3-rollback-verification)
4. [Post-Rollback Actions](#4-post-rollback-actions)
5. [Rollback Types](#5-rollback-types)
6. [Troubleshooting Failed Rollbacks](#6-troubleshooting-failed-rollbacks)

---

## 1. Pre-Rollback Preparation

### 1.1 Decision Checklist

Before initiating rollback, verify:

- [ ] Alert confirmed and validated (not false positive)
- [ ] Impact severity assessed (customer-facing? data loss risk?)
- [ ] Quick fix not possible within 10 minutes
- [ ] Rollback decision approved by Tech Lead (for manual triggers)
- [ ] Team notified via Slack/PagerDuty

### 1.2 Document Rollback Reason

```bash
# Create incident directory
INCIDENT_DIR="/home/genesis/genesis-rebuild/incidents/incident-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$INCIDENT_DIR"

# Log rollback initiation
cat <<EOF > "$INCIDENT_DIR/rollback_reason.md"
# Rollback Incident - $(date +"%Y-%m-%d %H:%M:%S")

## Trigger
- Alert: [Alert name]
- Metric value: [Current value]
- SLO threshold: [Threshold]
- Duration: [How long threshold exceeded]

## Impact
- User-facing: [Yes/No]
- Affected services: [List]
- Estimated affected users: [Number or %]

## Decision
- Decided by: [Name]
- Quick fix attempted: [Yes/No - describe]
- Rollback authorized: [Yes]
- Time: $(date -u +"%Y-%m-%dT%H:%M:%SZ")
EOF
```

### 1.3 Capture Pre-Rollback State

```bash
# Capture current metrics
cd /home/genesis/genesis-rebuild

# Save Prometheus snapshot
curl http://localhost:9090/api/v1/query?query=up > "$INCIDENT_DIR/prometheus_pre_rollback.json"

# Save Grafana snapshot
curl -H "Accept: application/json" \
  http://localhost:3000/api/dashboards/uid/genesis-48h > "$INCIDENT_DIR/grafana_pre_rollback.json"

# Save current logs
cp logs/*.log "$INCIDENT_DIR/"

# Save current metrics snapshot
cp monitoring/metrics_snapshot.json "$INCIDENT_DIR/"

# Save Git commit info
git log -1 --format="%H %s" > "$INCIDENT_DIR/current_commit.txt"
git diff HEAD~1 > "$INCIDENT_DIR/deployment_diff.txt"
```

---

## 2. Rollback Execution (15-Minute SLA)

### 2.1 Stage 1: Announcement (1 minute)

**Target:** Complete in 60 seconds

```bash
# Start timer
ROLLBACK_START=$(date +%s)

# Log rollback start
echo "$(date -u +"%Y-%m-%dT%H:%M:%SZ") [ROLLBACK-START] Initiating rollback" \
  | tee -a logs/continuous_monitoring.log

# Notify team via Slack (if configured)
curl -X POST "${SLACK_WEBHOOK_URL}" \
  -H 'Content-Type: application/json' \
  -d "{
    \"text\": \":rotating_light: ROLLBACK INITIATED\",
    \"attachments\": [{
      \"color\": \"danger\",
      \"fields\": [
        {\"title\": \"Reason\", \"value\": \"${ROLLBACK_REASON}\", \"short\": false},
        {\"title\": \"Started\", \"value\": \"$(date)\", \"short\": true},
        {\"title\": \"SLA\", \"value\": \"15 minutes\", \"short\": true}
      ]
    }]
  }" || true

# Notify PagerDuty (if configured)
curl -X POST https://events.pagerduty.com/v2/enqueue \
  -H 'Content-Type: application/json' \
  -d "{
    \"routing_key\": \"${PAGERDUTY_ROUTING_KEY}\",
    \"event_action\": \"trigger\",
    \"payload\": {
      \"summary\": \"Genesis Rollback Initiated: ${ROLLBACK_REASON}\",
      \"severity\": \"critical\",
      \"source\": \"genesis-orchestrator\"
    }
  }" || true

echo "✅ Stage 1 complete (Announcement)"
```

### 2.2 Stage 2: Traffic Drain (2 minutes)

**Target:** Complete in 120 seconds

```bash
# Reduce feature flag to 0% to stop new traffic
cd /home/genesis/genesis-rebuild

# Option 1: Update feature flag config
cat > config/feature_flags_override.json <<EOF
{
  "phase_4_deployment": {
    "enabled": false,
    "rollout_percentage": 0
  }
}
EOF

# Option 2: Use API endpoint (if implemented)
curl -X POST http://localhost:8000/api/feature-flags/phase_4_deployment \
  -H 'Content-Type: application/json' \
  -d '{"enabled": false, "rollout_percentage": 0}' || true

# Wait for in-flight requests to complete
echo "⏳ Waiting for in-flight requests to complete (30 seconds)..."
sleep 30

# Verify traffic drained
ACTIVE_REQUESTS=$(curl -s http://localhost:8000/metrics | grep -c 'genesis_active_requests{.*} [1-9]' || echo 0)
echo "Active requests remaining: ${ACTIVE_REQUESTS}"

if [ "$ACTIVE_REQUESTS" -gt 10 ]; then
  echo "⚠️  WARNING: ${ACTIVE_REQUESTS} active requests still in progress"
  echo "Waiting additional 30 seconds..."
  sleep 30
fi

echo "✅ Stage 2 complete (Traffic drain)"
```

### 2.3 Stage 3: Service Rollback (5 minutes)

**Target:** Complete in 300 seconds

#### Option A: Git-based Rollback (Recommended)

```bash
cd /home/genesis/genesis-rebuild

# Stop current services
echo "⏳ Stopping current services..."
docker-compose down || true

# Rollback to previous commit
CURRENT_COMMIT=$(git rev-parse HEAD)
echo "Current commit: ${CURRENT_COMMIT}" | tee -a "$INCIDENT_DIR/rollback.log"

git checkout HEAD~1
ROLLBACK_COMMIT=$(git rev-parse HEAD)
echo "Rolled back to: ${ROLLBACK_COMMIT}" | tee -a "$INCIDENT_DIR/rollback.log"

# Reinstall dependencies (if needed)
if git diff ${ROLLBACK_COMMIT} ${CURRENT_COMMIT} --name-only | grep -q "requirements"; then
  echo "⏳ Reinstalling dependencies..."
  pip install -r requirements_infrastructure.txt
fi

# Restart services
echo "⏳ Restarting services with previous version..."
docker-compose up -d

# Wait for services to be ready
sleep 10

echo "✅ Stage 3 complete (Service rollback)"
```

#### Option B: Backup-based Rollback (If Git rollback fails)

```bash
cd /home/genesis/genesis-rebuild

# Stop current services
docker-compose down || true

# Find most recent backup
BACKUP_DIR=$(ls -dt /home/genesis/genesis-rebuild-backup-* 2>/dev/null | head -1)

if [ -z "$BACKUP_DIR" ]; then
  echo "❌ ERROR: No backup found! Attempting emergency recovery..."
  # See Section 6: Troubleshooting
  exit 1
fi

echo "⏳ Restoring from backup: ${BACKUP_DIR}"

# Restore files (excluding logs and data)
rsync -av --exclude='logs/' --exclude='monitoring/metrics_snapshot.json' \
  "${BACKUP_DIR}/" /home/genesis/genesis-rebuild/

# Restart services
docker-compose up -d

echo "✅ Stage 3 complete (Backup restore)"
```

### 2.4 Stage 4: Service Verification (5 minutes)

**Target:** Complete in 300 seconds

```bash
# Wait for services to initialize
echo "⏳ Waiting for services to initialize (30 seconds)..."
sleep 30

# Check service health
echo "🔍 Checking service health..."

# 1. Check HTTP endpoint
MAX_RETRIES=10
for i in $(seq 1 $MAX_RETRIES); do
  if curl -sf http://localhost:8000/health > /dev/null 2>&1; then
    echo "✅ Service is responding (attempt $i)"
    break
  else
    echo "⏳ Service not ready yet (attempt $i/$MAX_RETRIES)..."
    sleep 10
  fi

  if [ $i -eq $MAX_RETRIES ]; then
    echo "❌ ERROR: Service failed to start after rollback!"
    # See Section 6: Troubleshooting
    exit 1
  fi
done

# 2. Run smoke tests
echo "🔍 Running smoke tests..."
if pytest tests/test_smoke.py -v --tb=short; then
  echo "✅ Smoke tests passed"
else
  echo "❌ WARNING: Some smoke tests failed - investigating..."
  pytest tests/test_smoke.py -vv --tb=short | tee "$INCIDENT_DIR/smoke_test_failures.log"
fi

# 3. Check critical metrics
echo "🔍 Checking critical metrics..."

# Wait for metrics to populate
sleep 10

# Check Prometheus targets
TARGETS_UP=$(curl -s http://localhost:9090/api/v1/targets | jq -r '.data.activeTargets[] | select(.health=="up") | .job' | wc -l)
echo "Prometheus targets UP: ${TARGETS_UP}"

if [ "$TARGETS_UP" -lt 2 ]; then
  echo "⚠️  WARNING: Only ${TARGETS_UP} Prometheus targets are UP"
fi

echo "✅ Stage 4 complete (Service verification)"
```

### 2.5 Stage 5: SLO Validation (2 minutes)

**Target:** Complete in 120 seconds

```bash
# Run production health tests
echo "🔍 Running production health tests..."

if pytest tests/test_production_health.py::TestProductionSLOs -v --tb=no; then
  echo "✅ All SLOs met after rollback"
else
  echo "⚠️  WARNING: Some SLO tests failed - system may need additional recovery time"
  echo "Waiting 60 seconds for metrics to stabilize..."
  sleep 60

  # Retry
  if pytest tests/test_production_health.py::TestProductionSLOs -v --tb=no; then
    echo "✅ SLOs met on second check"
  else
    echo "❌ ERROR: SLOs still not met - escalate to emergency recovery"
    # See Section 6: Troubleshooting
  fi
fi

# Calculate rollback duration
ROLLBACK_END=$(date +%s)
ROLLBACK_DURATION=$((ROLLBACK_END - ROLLBACK_START))

echo ""
echo "=========================================="
echo "ROLLBACK COMPLETED"
echo "Duration: ${ROLLBACK_DURATION} seconds (SLA: 900 seconds)"
echo "=========================================="

if [ $ROLLBACK_DURATION -le 900 ]; then
  echo "✅ Rollback completed within 15-minute SLA"
else
  echo "⚠️  WARNING: Rollback took longer than 15-minute SLA"
fi

echo "✅ Stage 5 complete (SLO validation)"
```

---

## 3. Rollback Verification

### 3.1 Automated Verification

```bash
cd /home/genesis/genesis-rebuild

# Run comprehensive verification
cat > /tmp/verify_rollback.sh <<'EOF'
#!/bin/bash
set -e

echo "Running rollback verification..."

# 1. Service health
if ! curl -sf http://localhost:8000/health > /dev/null; then
  echo "❌ FAIL: Service health check failed"
  exit 1
fi
echo "✅ PASS: Service is healthy"

# 2. Smoke tests
if ! pytest tests/test_smoke.py -q --tb=no; then
  echo "❌ FAIL: Smoke tests failed"
  exit 1
fi
echo "✅ PASS: Smoke tests passed"

# 3. Test pass rate
PASS_RATE=$(pytest tests/test_production_health.py -q --tb=no 2>&1 | \
  grep -oP '\d+(?=% passed)' || echo "0")

if [ "$PASS_RATE" -lt 95 ]; then
  echo "❌ FAIL: Pass rate ${PASS_RATE}% below 95% SLO"
  exit 1
fi
echo "✅ PASS: Pass rate ${PASS_RATE}% meets SLO"

# 4. Check Prometheus metrics
if ! curl -sf http://localhost:9090/api/v1/query?query=up > /dev/null; then
  echo "⚠️  WARNING: Cannot verify Prometheus metrics"
else
  UP_STATUS=$(curl -s http://localhost:9090/api/v1/query?query=up | \
    jq -r '.data.result[0].value[1]' 2>/dev/null || echo "0")

  if [ "$UP_STATUS" != "1" ]; then
    echo "❌ FAIL: Service shows as DOWN in Prometheus"
    exit 1
  fi
  echo "✅ PASS: Service shows as UP in Prometheus"
fi

# 5. Check for errors in logs
RECENT_ERRORS=$(tail -100 logs/infrastructure.log | grep -c ERROR || echo 0)

if [ "$RECENT_ERRORS" -gt 10 ]; then
  echo "⚠️  WARNING: ${RECENT_ERRORS} errors in recent logs"
else
  echo "✅ PASS: Low error count in recent logs (${RECENT_ERRORS})"
fi

echo ""
echo "=========================================="
echo "ROLLBACK VERIFICATION: SUCCESS"
echo "=========================================="
EOF

chmod +x /tmp/verify_rollback.sh
/tmp/verify_rollback.sh
```

### 3.2 Manual Verification Checklist

- [ ] Service health endpoint returns 200 OK
- [ ] Grafana dashboard shows green metrics
- [ ] No active critical alerts in Prometheus
- [ ] Smoke tests all passing
- [ ] Test pass rate > 98%
- [ ] Error rate < 0.1%
- [ ] P95 latency < 200ms
- [ ] No ERROR lines in recent logs (last 5 minutes)
- [ ] Feature flag at 0% (no new Phase 4 traffic)
- [ ] All Docker containers running (`docker-compose ps`)

---

## 4. Post-Rollback Actions

### 4.1 Notify Stakeholders (Immediate)

```bash
# Send success notification
ROLLBACK_DURATION=$((ROLLBACK_END - ROLLBACK_START))

curl -X POST "${SLACK_WEBHOOK_URL}" \
  -H 'Content-Type: application/json' \
  -d "{
    \"text\": \":white_check_mark: ROLLBACK COMPLETED\",
    \"attachments\": [{
      \"color\": \"good\",
      \"fields\": [
        {\"title\": \"Duration\", \"value\": \"${ROLLBACK_DURATION}s (SLA: 900s)\", \"short\": true},
        {\"title\": \"Status\", \"value\": \"System stabilized\", \"short\": true},
        {\"title\": \"Pass Rate\", \"value\": \"${PASS_RATE}%\", \"short\": true},
        {\"title\": \"Version\", \"value\": \"$(git rev-parse --short HEAD)\", \"short\": true}
      ]
    }]
  }" || true
```

### 4.2 Continue Monitoring (30 minutes)

```bash
# Run continuous monitoring for 30 minutes post-rollback
echo "⏳ Starting 30-minute post-rollback monitoring..."

for i in {1..6}; do
  echo "Monitoring cycle $i/6 ($(date))"

  ./scripts/continuous_monitoring.sh

  # Check for new alerts
  NEW_ALERTS=$(curl -s http://localhost:9093/api/v2/alerts | \
    jq '[.[] | select(.status.state=="active")] | length')

  if [ "$NEW_ALERTS" -gt 0 ]; then
    echo "⚠️  WARNING: ${NEW_ALERTS} new alerts detected after rollback"
    curl -s http://localhost:9093/api/v2/alerts | \
      jq -r '.[] | select(.status.state=="active") | .labels.alertname' | \
      tee -a "$INCIDENT_DIR/post_rollback_alerts.log"
  fi

  sleep 300  # 5 minutes
done

echo "✅ 30-minute post-rollback monitoring complete"
```

### 4.3 Create Incident Report (Within 24 hours)

```bash
# Generate incident report
cat > "$INCIDENT_DIR/incident_report.md" <<EOF
# Incident Report - $(date +"%Y-%m-%d")

## Summary
- **Incident ID:** $(basename $INCIDENT_DIR)
- **Severity:** $(cat $INCIDENT_DIR/rollback_reason.md | grep -A1 "Alert:" | tail -1)
- **Duration:** ${ROLLBACK_DURATION} seconds
- **Impact:** [Describe user impact]

## Timeline
- **Detection:** $(head -1 logs/continuous_monitoring.log | grep -oP '\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}')
- **Rollback Initiated:** $(date -d @$ROLLBACK_START -u +"%Y-%m-%dT%H:%M:%SZ")
- **Rollback Completed:** $(date -d @$ROLLBACK_END -u +"%Y-%m-%dT%H:%M:%SZ")
- **System Stabilized:** $(date -u +"%Y-%m-%dT%H:%M:%SZ")

## Root Cause
[To be determined - analyze logs and metrics]

## Resolution
- Rolled back deployment from commit $(cat $INCIDENT_DIR/current_commit.txt | cut -d' ' -f1) to $(git rev-parse HEAD)
- Feature flag set to 0%
- All SLOs restored within 15-minute SLA

## Preventive Measures
1. [Action item 1]
2. [Action item 2]
3. [Action item 3]

## Lessons Learned
1. [Lesson 1]
2. [Lesson 2]

## Follow-Up Tasks
- [ ] Root cause analysis completed
- [ ] Fix deployed and tested in staging
- [ ] Re-deployment plan approved
- [ ] Runbooks updated
- [ ] Team retrospective scheduled
EOF

echo "📝 Incident report created: $INCIDENT_DIR/incident_report.md"
```

---

## 5. Rollback Types

### 5.1 Feature Flag Rollback (Fastest - 2 minutes)

**When to use:** Issue isolated to Phase 4 features, base system stable

```bash
# Simply disable feature flag
curl -X POST http://localhost:8000/api/feature-flags/phase_4_deployment \
  -H 'Content-Type: application/json' \
  -d '{"enabled": false, "rollout_percentage": 0}'

# Verify traffic shifted to old code paths
curl http://localhost:8000/metrics | grep 'phase_4_traffic_percentage'
# Expected: 0
```

**Pros:** Very fast, no service restart
**Cons:** Only works if base system is stable

### 5.2 Git Rollback (Standard - 10 minutes)

**When to use:** Phase 4 deployment introduced bugs, need full code rollback

```bash
# See Section 2.3 Stage 3 - Option A
git checkout HEAD~1
docker-compose restart
```

**Pros:** Clean rollback to known-good state
**Cons:** Requires service restart

### 5.3 Backup Rollback (Contingency - 15 minutes)

**When to use:** Git rollback failed, emergency recovery needed

```bash
# See Section 2.3 Stage 3 - Option B
rsync -av /home/genesis/genesis-rebuild-backup-TIMESTAMP/ .
docker-compose up -d
```

**Pros:** Guaranteed working state from backup
**Cons:** Slowest option

### 5.4 Database Rollback (Critical - 30 minutes)

**When to use:** Database schema changes need reversal

```bash
# STOP: Consult database administrator before proceeding

# Export current database state
mongodump --out="$INCIDENT_DIR/mongodb_dump_before_rollback"

# Restore previous database backup
mongorestore --drop /home/genesis/genesis-rebuild-backup-TIMESTAMP/mongodb_dump/

# Verify database integrity
mongo genesis --eval "db.stats()" | tee "$INCIDENT_DIR/db_stats_after_restore.json"
```

**WARNING:** Database rollbacks can cause data loss. Always consult DBA.

---

## 6. Troubleshooting Failed Rollbacks

### 6.1 Service Won't Start After Rollback

**Symptoms:**
- `docker-compose up -d` fails
- Health endpoint returns 500/502/503

**Investigation:**
```bash
# Check container status
docker-compose ps

# Check logs
docker-compose logs --tail=100

# Check for port conflicts
netstat -tuln | grep -E ':(8000|9090|3000|9093)'

# Check disk space
df -h

# Check for orphaned processes
ps aux | grep genesis
```

**Solutions:**
1. **Port already in use:**
   ```bash
   # Find and kill process using port
   lsof -ti:8000 | xargs kill -9
   docker-compose up -d
   ```

2. **Disk full:**
   ```bash
   # Clean up logs
   find logs/ -name "*.log.*" -mtime +7 -delete

   # Clean up Docker
   docker system prune -af

   # Retry
   docker-compose up -d
   ```

3. **Configuration error:**
   ```bash
   # Restore config from backup
   cp /home/genesis/genesis-rebuild-backup-TIMESTAMP/config/* config/

   docker-compose up -d
   ```

### 6.2 SLOs Not Met After Rollback

**Symptoms:**
- Service is up but tests still failing
- Metrics still showing degradation

**Investigation:**
```bash
# Run detailed health tests
pytest tests/test_production_health.py -vv --tb=short

# Check which specific SLOs are failing
pytest tests/test_production_health.py::TestProductionSLOs -v

# Check resource usage
htop
docker stats
```

**Solutions:**
1. **High resource usage:**
   ```bash
   # Restart services to clear memory
   docker-compose restart

   # Wait 2 minutes
   sleep 120

   # Re-check
   pytest tests/test_production_health.py::TestProductionSLOs -v
   ```

2. **Database connection issues:**
   ```bash
   # Check database is reachable
   mongo genesis --eval "db.stats()"

   # Restart database container
   docker-compose restart mongodb

   # Restart application
   docker-compose restart genesis-orchestration
   ```

3. **Still failing after 10 minutes:**
   ```bash
   # ESCALATE: Emergency recovery needed
   # Contact: DevOps Lead, Tech Lead
   # See: Section 6.4 Emergency Recovery
   ```

### 6.3 No Backup Available

**Symptoms:**
- Backup directory doesn't exist
- Backup is corrupted

**Emergency Recovery:**
```bash
# 1. Check for Git history
git reflog
git log --all --oneline | head -20

# 2. Find last known-good commit
LAST_GOOD=$(git log --all --oneline | grep -i "production-ready" | head -1 | cut -d' ' -f1)

if [ -n "$LAST_GOOD" ]; then
  echo "Found last known-good commit: $LAST_GOOD"
  git checkout $LAST_GOOD
  docker-compose up -d
else
  echo "❌ CRITICAL: No known-good state found"
  # Escalate immediately
fi

# 3. If Git history lost, restore from version control
git clone https://github.com/YOUR_ORG/genesis-rebuild.git genesis-rebuild-emergency
cd genesis-rebuild-emergency
git checkout $(cat PRODUCTION_VERSION.txt)  # If this file exists
docker-compose up -d
```

### 6.4 Emergency Recovery (Last Resort)

**When:** All rollback attempts failed, system completely down

**Contact:** Immediately page entire DevOps + Leadership team

**Actions:**
1. **Isolate failed system:**
   ```bash
   docker-compose down
   # DO NOT DELETE FILES - preserve for investigation
   ```

2. **Deploy fresh instance:**
   ```bash
   cd /home/genesis
   git clone https://github.com/YOUR_ORG/genesis-rebuild.git genesis-rebuild-emergency
   cd genesis-rebuild-emergency
   git checkout [last-known-production-tag]
   docker-compose up -d
   ```

3. **Restore data from backups:**
   ```bash
   # Database
   mongorestore --drop [latest-backup]

   # Files
   # Copy any user-generated data from failed system
   ```

4. **Verify recovery:**
   ```bash
   pytest tests/test_smoke.py -v
   ./scripts/continuous_monitoring.sh
   ```

5. **Document incident:**
   - Exact timeline
   - All commands executed
   - Why standard rollback failed
   - Data loss (if any)

---

## Rollback Decision Matrix

| Metric | Current | Action |
|--------|---------|--------|
| Error rate | < 0.1% | ✅ Monitor only |
| Error rate | 0.1% - 1% | ⚠️ Prepare for rollback |
| Error rate | > 1% | 🚨 **ROLLBACK NOW** |
| Pass rate | > 98% | ✅ Monitor only |
| Pass rate | 95% - 98% | ⚠️ Investigate + prepare rollback |
| Pass rate | < 95% | 🚨 **ROLLBACK NOW** |
| P95 latency | < 200ms | ✅ Monitor only |
| P95 latency | 200ms - 500ms | ⚠️ Investigate + prepare rollback |
| P95 latency | > 500ms | 🚨 **ROLLBACK NOW** |
| Service down | 0 - 1 min | ⚠️ Attempt restart |
| Service down | 1 - 2 min | ⚠️ Prepare for rollback |
| Service down | > 2 min | 🚨 **ROLLBACK NOW** |

---

## Appendix: Rollback Checklist

### Pre-Rollback
- [ ] Alert validated (not false positive)
- [ ] Quick fix ruled out (<10 min)
- [ ] Rollback decision approved
- [ ] Team notified
- [ ] Pre-rollback state captured
- [ ] Incident directory created

### During Rollback
- [ ] Announcement sent (Slack/PagerDuty)
- [ ] Traffic drained (feature flag → 0%)
- [ ] Services stopped
- [ ] Code rolled back (Git or backup)
- [ ] Services restarted
- [ ] Health check passed
- [ ] Smoke tests passed
- [ ] SLOs met

### Post-Rollback
- [ ] Success notification sent
- [ ] 30-min monitoring completed
- [ ] No new alerts
- [ ] Incident report drafted
- [ ] Root cause analysis assigned
- [ ] Follow-up tasks created
- [ ] Team retrospective scheduled

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2025-10-18 | Forge | Initial rollback procedures |

---

**For assistance, contact:**
- On-Call Engineer: [Contact info]
- Tech Lead: [Contact info]
- DevOps Lead: [Contact info]
