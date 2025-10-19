# Genesis 48-Hour Post-Deployment Monitoring Protocol

**Status:** Production-Ready
**Author:** Forge (Testing & Validation Specialist)
**Date:** 2025-10-18
**Version:** 1.0.0

---

## Executive Summary

This document defines the comprehensive monitoring protocol for the 48-hour observation period following Genesis Phase 4 production deployment. Continuous automated health checks run every 5 minutes to ensure system stability and detect issues before they impact users.

**Critical SLO Thresholds:**
- Test Pass Rate: >= 95% (WARNING: <98%, CRITICAL: <95%)
- Error Rate: < 0.1% (WARNING: <0.1%, CRITICAL: >1%)
- P95 Latency: < 200ms (WARNING: >200ms, CRITICAL: >500ms)
- Service Uptime: 99.9% (CRITICAL: Down >1 minute)

**Rollback Triggers (Automatic):**
- Error rate > 1% for 5+ minutes
- Pass rate < 95% for 5+ minutes
- P95 latency > 500ms for 5+ minutes
- Service down for 2+ minutes

---

## Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Monitoring Infrastructure](#monitoring-infrastructure)
3. [Continuous Health Checks](#continuous-health-checks)
4. [Alert Response Procedures](#alert-response-procedures)
5. [Rollback Procedures](#rollback-procedures)
6. [Post-Monitoring Actions](#post-monitoring-actions)
7. [Troubleshooting Guide](#troubleshooting-guide)

---

## 1. Pre-Deployment Checklist

### 1.1 Verify Monitoring Stack is Running

```bash
cd /home/genesis/genesis-rebuild/monitoring
docker-compose up -d

# Verify all services are running
docker-compose ps

# Expected output:
# - prometheus (port 9090)
# - grafana (port 3000)
# - alertmanager (port 9093)
# - node-exporter (port 9100)
```

### 1.2 Verify Endpoints Are Accessible

```bash
# Prometheus
curl http://localhost:9090/api/v1/targets
# Expected: HTTP 200, shows scrape targets

# Grafana
curl http://localhost:3000/api/health
# Expected: {"commit": "...", "database": "ok", "version": "..."}

# Alertmanager
curl http://localhost:9093/api/v2/status
# Expected: {"cluster": {...}, "versionInfo": {...}}

# Node Exporter
curl http://localhost:9100/metrics | head -20
# Expected: Prometheus metrics output
```

### 1.3 Configure Alert Notifications (Optional)

Edit `/home/genesis/genesis-rebuild/monitoring/alertmanager_config.yml` to add Slack/PagerDuty webhooks:

```yaml
receivers:
  - name: 'critical'
    slack_configs:
      - api_url: 'https://hooks.slack.com/services/YOUR/WEBHOOK/URL'
        channel: '#genesis-critical'
    pagerduty_configs:
      - service_key: YOUR_PAGERDUTY_KEY
```

Then restart Alertmanager:
```bash
docker-compose restart alertmanager
```

### 1.4 Verify Baseline Test Suite Passes

```bash
cd /home/genesis/genesis-rebuild

# Run production health tests
python3 -m pytest tests/test_production_health.py -v

# Expected: >= 95% pass rate
```

### 1.5 Start Continuous Monitoring

```bash
# Option 1: Run once manually
./scripts/continuous_monitoring.sh

# Option 2: Run continuously every 5 minutes (recommended)
./scripts/continuous_monitoring.sh --loop

# Option 3: Run in background (production)
nohup ./scripts/continuous_monitoring.sh --loop > /dev/null 2>&1 &
```

---

## 2. Monitoring Infrastructure

### 2.1 Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Genesis System                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Orchestrator │  │ HTDAG/HALO   │  │ Test Suite   │      │
│  │   (8000)     │  │   (8001)     │  │   (8002)     │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                  │                  │               │
│         └──────────────────┴──────────────────┘               │
│                            │                                  │
└────────────────────────────┼──────────────────────────────────┘
                             │ /metrics endpoints
                             ▼
                    ┌────────────────┐
                    │  Prometheus    │◄────┐
                    │    (9090)      │     │
                    └────────┬───────┘     │
                             │             │
                ┌────────────┼─────────────┼──────────┐
                │            ▼             │          │
                │    ┌──────────────┐     │          │
                │    │  Grafana     │     │          │
                │    │   (3000)     │     │          │
                │    └──────────────┘     │          │
                │                         │          │
                │    ┌──────────────┐     │          │
                │    │ Alertmanager │◄────┘          │
                │    │   (9093)     │                │
                │    └──────┬───────┘                │
                │           │                        │
                │           ▼                        │
                │  ┌──────────────────┐              │
                │  │ Notifications    │              │
                │  │ (Slack/PagerDuty)│              │
                │  └──────────────────┘              │
                │                                    │
                │    ┌──────────────┐                │
                │    │ Node Exporter│────────────────┘
                │    │   (9100)     │
                │    └──────────────┘
                │
                └─────────────────────────────────────
```

### 2.2 Key Metrics Collected

| Metric Name | Type | Description | SLO Target |
|-------------|------|-------------|------------|
| `genesis_tests_passed_total` / `genesis_tests_total_total` | Gauge | Test pass rate | >= 98% |
| `genesis_errors_total` | Counter | Total errors | Rate < 0.1% |
| `genesis_operation_duration_seconds` | Histogram | Operation latency | P95 < 200ms |
| `up{job="genesis-orchestration"}` | Gauge | Service health | 1 (up) |
| `genesis_htdag_decomposition_duration_seconds` | Histogram | HTDAG performance | Avg < 150ms |
| `genesis_halo_routing_duration_seconds` | Histogram | HALO performance | Avg < 130ms |
| `node_memory_MemAvailable_bytes` | Gauge | Available memory | > 20% |
| `node_cpu_seconds_total` | Counter | CPU usage | < 80% |

### 2.3 Dashboard Access

- **Grafana Dashboard:** http://localhost:3000
  - Username: `admin`
  - Password: `admin` (change on first login)
  - Dashboard: "Genesis 48-Hour Post-Deployment Monitoring"

- **Prometheus UI:** http://localhost:9090
  - Query metrics directly
  - View alert rules and status

- **Alertmanager UI:** http://localhost:9093
  - View active alerts
  - Silence alerts if needed

---

## 3. Continuous Health Checks

### 3.1 Automated Test Execution

The continuous monitoring script (`scripts/continuous_monitoring.sh`) runs every 5 minutes and executes:

1. **Service Health Checks**
   - Prometheus endpoint reachability
   - Grafana endpoint reachability
   - Alertmanager endpoint reachability

2. **Production Health Test Suite**
   ```bash
   pytest tests/test_production_health.py -v
   ```
   - Critical module imports
   - Observability manager functionality
   - System resource adequacy
   - Error handler operations
   - Security utilities
   - HTDAG/HALO/AOP component operations

3. **SLO Metric Calculation**
   - Test pass rate from JUnit XML results
   - System resource usage (CPU, memory, disk)
   - Alert triggering for threshold violations

4. **Metric Snapshots**
   - Recorded to `monitoring/metrics_snapshot.json`
   - Contains timestamp, metrics count, resource usage
   - Retained for 1000 snapshots (48 hours at 5-min intervals)

### 3.2 Health Check Logs

All health check activity is logged to:
- **Main log:** `/home/genesis/genesis-rebuild/logs/continuous_monitoring.log`
- **Health snapshot:** `/home/genesis/genesis-rebuild/logs/health_check.log`

Example log entry:
```
2025-10-18T15:32:00Z [INFO] Starting health check cycle...
2025-10-18T15:32:01Z [INFO] ✓ Prometheus is running
2025-10-18T15:32:01Z [INFO] ✓ Grafana is running
2025-10-18T15:32:01Z [INFO] ✓ Alertmanager is running
2025-10-18T15:32:15Z [INFO] ✓ All health tests passed
2025-10-18T15:32:16Z [INFO] Test Pass Rate: 98.5% (SLO: ≥95%)
2025-10-18T15:32:16Z [INFO] System Resources: CPU 12.3%, Memory 45.2%, Disk 38%
2025-10-18T15:32:16Z [INFO] Health check cycle completed
```

### 3.3 Manual Test Execution

To run health checks manually:

```bash
# Run full production health suite
pytest tests/test_production_health.py -v

# Run specific test classes
pytest tests/test_production_health.py::TestProductionHealth -v
pytest tests/test_production_health.py::TestContinuousMonitoring -v
pytest tests/test_production_health.py::TestRollbackTriggers -v

# Run with detailed output
pytest tests/test_production_health.py -vv --tb=short

# Run and generate HTML report
pytest tests/test_production_health.py --html=monitoring/health_report.html
```

---

## 4. Alert Response Procedures

### 4.1 Alert Severity Levels

| Severity | Priority | Response Time | Action Required |
|----------|----------|---------------|-----------------|
| **CRITICAL** | P0-P1 | Immediate (< 5 min) | Investigate immediately, may trigger rollback |
| **WARNING** | P2-P3 | 30 minutes | Monitor, investigate if persists |
| **INFO** | P4 | Next business day | Informational, no action required |

### 4.2 Critical Alert Response Flowchart

```
CRITICAL ALERT RECEIVED
         │
         ▼
    Check Grafana Dashboard
    (http://localhost:3000)
         │
         ├─► Error Rate > 1%? ──► Check logs for error patterns
         │                         │
         │                         ├─► Known issue? ──► Apply hotfix
         │                         │
         │                         └─► Unknown? ──► Rollback (Section 5)
         │
         ├─► Pass Rate < 95%? ──► Run: pytest -vv to identify failures
         │                         │
         │                         ├─► Infra issue? ──► Restart services
         │                         │
         │                         └─► Code regression? ──► Rollback
         │
         ├─► P95 Latency > 500ms? ──► Check system resources
         │                             │
         │                             ├─► High CPU/memory? ──► Scale up
         │                             │
         │                             └─► Slow queries? ──► Rollback
         │
         └─► Service Down? ──► Check: docker-compose ps
                               │
                               ├─► Container crashed? ──► docker-compose restart
                               │
                               └─► Can't recover? ──► Rollback
```

### 4.3 Alert-Specific Procedures

#### 4.3.1 TestPassRateLow (CRITICAL)

**Trigger:** Pass rate < 98% for 5 minutes

**Investigation:**
```bash
# Identify failing tests
pytest tests/test_production_health.py -vv --tb=short | grep FAILED

# Check recent changes
git log -n 10 --oneline

# Review error logs
tail -100 logs/infrastructure.log
```

**Resolution:**
- If < 95%: **ROLLBACK IMMEDIATELY**
- If 95-98%: Monitor for 10 more minutes, rollback if degrading

#### 4.3.2 HighErrorRate (CRITICAL)

**Trigger:** Error rate > 0.1% for 2 minutes

**Investigation:**
```bash
# Check error logs
tail -200 logs/infrastructure.log | grep ERROR

# Query Prometheus for error breakdown
# http://localhost:9090/graph
# Query: rate(genesis_errors_total[5m]) by (component)

# Check circuit breaker status
grep -i "circuit.*open" logs/infrastructure.log
```

**Resolution:**
- If error rate > 1%: **ROLLBACK IMMEDIATELY**
- If 0.1-1%: Identify error source, apply hotfix if possible

#### 4.3.3 HighLatencyP95 (CRITICAL)

**Trigger:** P95 latency > 200ms for 5 minutes

**Investigation:**
```bash
# Check system resources
htop
free -h
df -h

# Check for slow operations
grep "duration.*ms" logs/infrastructure.log | tail -50

# Query Prometheus for latency breakdown
# Query: histogram_quantile(0.95, rate(genesis_operation_duration_seconds_bucket[5m])) by (operation)
```

**Resolution:**
- If P95 > 500ms: **ROLLBACK IMMEDIATELY**
- If 200-500ms: Check for resource bottlenecks, scale if needed

#### 4.3.4 GenesisServiceDown (CRITICAL)

**Trigger:** Service down for 1 minute

**Investigation:**
```bash
# Check service status
docker-compose ps

# Check logs
docker-compose logs genesis-orchestration | tail -100

# Try restart
docker-compose restart genesis-orchestration
```

**Resolution:**
- If service won't start: **ROLLBACK IMMEDIATELY**
- If restart successful: Monitor closely for 30 minutes

### 4.4 Silencing False Positive Alerts

If an alert is firing but determined to be a false positive:

```bash
# Silence alert in Alertmanager
curl -XPOST http://localhost:9093/api/v1/silences \
  -d '{
    "matchers": [
      {"name": "alertname", "value": "AlertName", "isRegex": false}
    ],
    "startsAt": "2025-10-18T15:00:00Z",
    "endsAt": "2025-10-18T17:00:00Z",
    "createdBy": "your-name",
    "comment": "Known issue, tracking in ticket #123"
  }'
```

**IMPORTANT:** Document all silenced alerts in the monitoring log.

---

## 5. Rollback Procedures

### 5.1 Rollback Decision Criteria

**Automatic Rollback Triggers (No approval needed):**
- Error rate > 1% sustained for 5+ minutes
- Test pass rate < 95% sustained for 5+ minutes
- P95 latency > 500ms sustained for 5+ minutes
- Service down for 2+ consecutive minutes (and can't restart)

**Manual Rollback Triggers (Team decision):**
- Critical security vulnerability discovered
- Data corruption detected
- Customer-impacting bug with no quick fix
- Unforeseen production behavior (even if metrics are OK)

### 5.2 Rollback Execution (15-Minute SLA)

#### Step 1: Announce Rollback (1 minute)

```bash
# Log rollback initiation
echo "$(date -u +"%Y-%m-%dT%H:%M:%SZ") [ROLLBACK] Initiating rollback due to: [REASON]" \
  >> logs/continuous_monitoring.log

# Notify team (if Slack configured)
curl -X POST https://hooks.slack.com/services/YOUR/WEBHOOK \
  -H 'Content-Type: application/json' \
  -d '{"text": "🚨 ROLLBACK INITIATED: [REASON]"}'
```

#### Step 2: Execute Rollback (5 minutes)

```bash
cd /home/genesis/genesis-rebuild

# Option 1: Rollback via Git (if using deployment script)
git checkout HEAD~1
./scripts/deploy.sh rollback

# Option 2: Manual rollback
# Stop current services
docker-compose down

# Restore previous version from backup
cp -r /home/genesis/genesis-rebuild-backup-TIMESTAMP/* .

# Restart services
docker-compose up -d

# Restart monitoring
./scripts/continuous_monitoring.sh --loop &
```

#### Step 3: Verify Rollback Success (5 minutes)

```bash
# Check service health
curl http://localhost:8000/health
# Expected: HTTP 200

# Run smoke tests
pytest tests/test_smoke.py -v
# Expected: All pass

# Check metrics stabilize
# Open Grafana: http://localhost:3000
# Verify:
# - Pass rate returns to > 98%
# - Error rate drops below 0.1%
# - P95 latency below 200ms
```

#### Step 4: Post-Rollback Actions (4 minutes)

```bash
# Log rollback completion
echo "$(date -u +"%Y-%m-%dT%H:%M:%SZ") [ROLLBACK] Rollback completed successfully" \
  >> logs/continuous_monitoring.log

# Capture metrics snapshot
./scripts/continuous_monitoring.sh

# Notify team
curl -X POST https://hooks.slack.com/services/YOUR/WEBHOOK \
  -H 'Content-Type: application/json' \
  -d '{"text": "✅ Rollback completed. System stabilized."}'
```

### 5.3 Post-Rollback Investigation

1. **Preserve Evidence**
   ```bash
   # Create incident directory
   mkdir -p incidents/incident-$(date +%Y%m%d-%H%M%S)

   # Copy logs
   cp logs/*.log incidents/incident-*/

   # Copy metrics
   cp monitoring/metrics_snapshot.json incidents/incident-*/
   cp monitoring/alerts_triggered.json incidents/incident-*/

   # Copy test results
   cp monitoring/health_test_results.xml incidents/incident-*/
   ```

2. **Root Cause Analysis**
   - Review deployment diff: `git diff HEAD~1`
   - Analyze error patterns in logs
   - Identify which component failed
   - Document timeline of events

3. **Create Incident Report**
   - Use template: `docs/INCIDENT_RESPONSE.md`
   - Document trigger, timeline, resolution
   - Identify preventive measures
   - Update runbooks if needed

---

## 6. Post-Monitoring Actions

### 6.1 48-Hour Checkpoint (After 48 hours)

**If all SLOs met for 48 hours:**

1. **Declare Deployment Success**
   ```bash
   echo "$(date -u +"%Y-%m-%dT%H:%M:%SZ") [SUCCESS] 48-hour monitoring period completed successfully" \
     >> logs/continuous_monitoring.log
   ```

2. **Generate Final Report**
   ```bash
   # Run final health check
   ./scripts/continuous_monitoring.sh

   # Generate summary
   cat <<EOF > monitoring/48hour_report.md
   # 48-Hour Monitoring Report - $(date +%Y-%m-%d)

   ## Summary
   - Start: $(head -1 logs/continuous_monitoring.log | cut -d' ' -f1)
   - End: $(tail -1 logs/continuous_monitoring.log | cut -d' ' -f1)
   - Status: ✅ SUCCESS

   ## Metrics
   - Average Pass Rate: [Check Grafana]
   - Average Error Rate: [Check Grafana]
   - Average P95 Latency: [Check Grafana]
   - Uptime: [Check Grafana]

   ## Alerts Triggered
   $(cat monitoring/alerts_triggered.json | jq -r '.[] | "- [\(.severity)] \(.alert): \(.description)"')

   ## Conclusion
   Phase 4 deployment is stable and ready for full production traffic.
   EOF
   ```

3. **Scale to 100% Traffic**
   ```bash
   # Update feature flag
   # In infrastructure/feature_flags.py:
   # phase_4_deployment: 100

   # Restart services
   docker-compose restart
   ```

4. **Reduce Monitoring Frequency**
   ```bash
   # Stop 5-minute continuous monitoring
   pkill -f continuous_monitoring.sh

   # Switch to hourly monitoring (cron)
   crontab -e
   # Add: 0 * * * * /home/genesis/genesis-rebuild/scripts/continuous_monitoring.sh
   ```

**If SLOs violated during 48 hours:**

1. **Extend Monitoring Period**
   - Continue 5-minute checks for additional 24 hours
   - Investigate all SLO violations
   - Apply fixes and re-test

2. **Consider Rollback**
   - If violations are severe or recurring
   - If root cause cannot be quickly identified

---

## 7. Troubleshooting Guide

### 7.1 Common Issues

#### Issue: "Prometheus not scraping metrics"

**Symptoms:**
- Grafana shows "No data"
- Prometheus /targets shows endpoints as DOWN

**Solution:**
```bash
# Check if Genesis services are exposing /metrics
curl http://localhost:8000/metrics
curl http://localhost:8001/metrics
curl http://localhost:8002/metrics

# If 404, verify observability integration:
grep -r "prometheus" infrastructure/

# Restart Prometheus
docker-compose restart prometheus
```

#### Issue: "Alerts not routing to Slack/PagerDuty"

**Symptoms:**
- Alerts firing in Prometheus
- Not appearing in external channels

**Solution:**
```bash
# Verify Alertmanager config
docker exec alertmanager cat /etc/alertmanager/alertmanager.yml

# Test webhook manually
curl -X POST https://hooks.slack.com/services/YOUR/WEBHOOK \
  -H 'Content-Type: application/json' \
  -d '{"text": "Test alert"}'

# Check Alertmanager logs
docker-compose logs alertmanager | tail -50

# Reload config
docker-compose restart alertmanager
```

#### Issue: "High memory usage"

**Symptoms:**
- Memory > 80% sustained
- OOM kills in logs

**Solution:**
```bash
# Check for memory leaks
pytest tests/test_production_health.py::TestContinuousMonitoring::test_memory_leak_detection -v

# Check Docker container limits
docker stats

# Increase memory limit in docker-compose.yml:
# services:
#   prometheus:
#     mem_limit: 2g

# Restart services
docker-compose up -d
```

#### Issue: "Test pass rate fluctuating"

**Symptoms:**
- Pass rate 95-99%, not stable
- Intermittent failures

**Solution:**
```bash
# Identify flaky tests
pytest tests/test_production_health.py --count=10 -v | grep FAILED

# Check for known flaky tests (P4 performance test)
grep "test_halo_routing_performance_large_dag" logs/*.log

# Mark flaky tests with @pytest.mark.flaky decorator
# Or increase retry count in pytest.ini
```

### 7.2 Emergency Contacts

| Role | Contact | Responsibility |
|------|---------|----------------|
| On-Call Engineer | [Your team's contact] | First responder for critical alerts |
| Tech Lead | [Your team's contact] | Rollback decision authority |
| DevOps Lead | [Your team's contact] | Infrastructure issues |
| Security Lead | [Your team's contact] | Security vulnerabilities |

### 7.3 Useful Commands Reference

```bash
# Check all services status
docker-compose ps

# View logs (all services)
docker-compose logs -f --tail=100

# View logs (specific service)
docker-compose logs -f prometheus
docker-compose logs -f grafana
docker-compose logs -f alertmanager

# Restart specific service
docker-compose restart prometheus

# Restart all services
docker-compose restart

# Stop all monitoring
docker-compose down

# Check Prometheus scrape targets
curl http://localhost:9090/api/v1/targets | jq .

# Check active alerts
curl http://localhost:9090/api/v1/alerts | jq .

# Query metric
curl "http://localhost:9090/api/v1/query?query=up" | jq .

# Check system resources
htop
free -h
df -h
docker stats

# Run health tests
pytest tests/test_production_health.py -v

# Run continuous monitoring once
./scripts/continuous_monitoring.sh

# Run continuous monitoring loop
./scripts/continuous_monitoring.sh --loop
```

---

## Appendix A: Metric Definitions

| Metric | Formula | Interpretation |
|--------|---------|----------------|
| **Pass Rate** | `(passed / total) * 100` | Percentage of tests passing |
| **Error Rate** | `rate(errors[5m]) * 100` | Errors per second over 5 minutes |
| **P50 Latency** | `histogram_quantile(0.50, latency_bucket)` | Median response time |
| **P95 Latency** | `histogram_quantile(0.95, latency_bucket)` | 95th percentile response time |
| **P99 Latency** | `histogram_quantile(0.99, latency_bucket)` | 99th percentile response time |
| **Uptime** | `avg_over_time(up[24h]) * 100` | % of time service is up |
| **CPU Usage** | `100 - idle_cpu_percent` | % of CPU in use |
| **Memory Usage** | `(total - available) / total * 100` | % of memory in use |

---

## Appendix B: Deployment Timeline Template

| Time | Phase | Status | Notes |
|------|-------|--------|-------|
| T+0 | Deployment starts | ⏳ | Feature flag at 0% |
| T+15m | Health checks pass | ✅ | Baseline established |
| T+1h | Feature flag 25% | ⏳ | Monitoring closely |
| T+6h | Feature flag 50% | ⏳ | No issues detected |
| T+24h | Feature flag 75% | ⏳ | SLOs met |
| T+48h | Feature flag 100% | ✅ | Deployment complete |

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2025-10-18 | Forge | Initial 48-hour monitoring protocol |

---

**For questions or issues, refer to:**
- Incident Response Plan: `/home/genesis/genesis-rebuild/docs/INCIDENT_RESPONSE.md`
- Monitoring Plan: `/home/genesis/genesis-rebuild/docs/MONITORING_PLAN.md`
- Rollout Plan: `/home/genesis/genesis-rebuild/docs/PRODUCTION_ROLLOUT_PLAN.md`
