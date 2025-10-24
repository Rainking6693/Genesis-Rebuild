---
title: Genesis Post-Deployment Monitoring Guide
category: Guides
dg-publish: true
publish: true
tags:
- monitoring
- genesis
- service
- quick
- manual
- overview
- troubleshooting
- alert
- handoff
- dashboards
- automated
source: docs/POST_DEPLOYMENT_MONITORING.md
exported: '2025-10-24T22:05:26.909720'
---

# Genesis Post-Deployment Monitoring Guide

**Version:** 1.0
**Last Updated:** October 18, 2025
**Status:** Production-ready
**Purpose:** Complete guide for 48-hour post-deployment monitoring

---

## Table of Contents

1. [Overview](#overview)
2. [Quick Start](#quick-start)
3. [Monitoring Infrastructure](#monitoring-infrastructure)
4. [Service Level Objectives (SLOs)](#service-level-objectives-slos)
5. [Dashboards & Visualization](#dashboards--visualization)
6. [Automated Monitoring](#automated-monitoring)
7. [Manual Checks](#manual-checks)
8. [Alert Response](#alert-response)
9. [Troubleshooting](#troubleshooting)
10. [Handoff to BAU](#handoff-to-bau)

---

## Overview

### Purpose

This guide provides comprehensive instructions for monitoring the Genesis system during the critical 48-hour post-deployment window. The system has been validated at **98.28% test pass rate** with **9.2/10 production readiness score**, meeting all deployment criteria.

### Scope

- **Duration:** 48 hours from production deployment
- **Coverage:** Full-stack monitoring (infrastructure, tests, performance, resources)
- **Goal:** Detect and resolve regressions within SLO thresholds

### Prerequisites

Before starting monitoring:

1. ✅ Deployment complete (Phase 4)
2. ✅ All services running (genesis-orchestration, prometheus, grafana)
3. ✅ Monitoring infrastructure configured
4. ✅ Baseline metrics captured (Phase 3 optimization)
5. ✅ Alert routing configured (Slack, PagerDuty)
6. ✅ Team trained on incident response procedures

---

## Quick Start

### Initial Setup (15 minutes)

1. **Start Monitoring Services**

   ```bash
   # Start Prometheus
   docker run -d \
     --name prometheus \
     -p 9090:9090 \
     -v /home/genesis/genesis-rebuild/monitoring/prometheus_config.yml:/etc/prometheus/prometheus.yml \
     prom/prometheus

   # Start Grafana
   docker run -d \
     --name grafana \
     -p 3000:3000 \
     grafana/grafana

   # Start Node Exporter (system metrics)
   docker run -d \
     --name node-exporter \
     -p 9100:9100 \
     prom/node-exporter
   ```

2. **Import Grafana Dashboard**

   ```bash
   # Access Grafana: http://localhost:3000 (admin/admin)
   # Import dashboard: /home/genesis/genesis-rebuild/monitoring/grafana_dashboard.json
   ```

3. **Run Initial Health Check**

   ```bash
   cd /home/genesis/genesis-rebuild
   ./scripts/health_check.sh
   ```

4. **Verify Baseline Metrics**

   ```bash
   # Run test suite to establish baseline
   ./scripts/run_monitoring_tests.sh

   # Check Prometheus metrics
   curl http://localhost:9090/api/v1/query?query=genesis_test_pass_rate
   ```

### First 6 Hours Checklist

Execute every 15 minutes:

```bash
# Quick health check (2 minutes)
./scripts/health_check.sh

# Review Grafana dashboard
# Open: http://localhost:3000/d/genesis-deployment

# Check for alerts
curl http://localhost:9090/api/v1/alerts | jq

# Review recent logs
tail -f logs/genesis.log | grep -E "ERROR|CRITICAL"
```

---

## Monitoring Infrastructure

### Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Genesis System                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   HTDAG      │  │     HALO     │  │     AOP      │     │
│  │   Planner    │──│    Router    │──│  Validator   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│         │                  │                  │             │
│         └──────────────────┴──────────────────┘             │
│                            │                                │
│                   ┌────────▼────────┐                       │
│                   │  Observability  │                       │
│                   │    (OTEL)       │                       │
│                   └────────┬────────┘                       │
└────────────────────────────┼──────────────────────────────┘
                             │
                             │ Metrics/Traces
                             │
                    ┌────────▼────────┐
                    │   Prometheus    │ ◄── Scrapes metrics (15s)
                    │   (Port 9090)   │
                    └────────┬────────┘
                             │
                             │ Query API
                             │
                    ┌────────▼────────┐
                    │    Grafana      │ ◄── Visualizes metrics
                    │   (Port 3000)   │
                    └────────┬────────┘
                             │
                             │ Alerts
                             │
                    ┌────────▼────────┐
                    │  Alertmanager   │ ◄── Routes alerts
                    │   (Port 9093)   │
                    └─────────────────┘
```

### Components

| Component | Purpose | Port | Location |
|-----------|---------|------|----------|
| Genesis System | Main application | 8000 | /home/genesis/genesis-rebuild |
| Prometheus | Metrics collection | 9090 | Docker container |
| Grafana | Visualization | 3000 | Docker container |
| Node Exporter | System metrics | 9100 | Docker container |
| Alertmanager | Alert routing | 9093 | Docker container |

### Configuration Files

| File | Purpose | Location |
|------|---------|----------|
| prometheus_config.yml | Prometheus scrape config | /home/genesis/genesis-rebuild/monitoring/ |
| alerts.yml | Alert rules | /home/genesis/genesis-rebuild/monitoring/ |
| grafana_dashboard.json | Grafana dashboard | /home/genesis/genesis-rebuild/monitoring/ |
| health_check.sh | Health validation script | /home/genesis/genesis-rebuild/scripts/ |
| run_monitoring_tests.sh | Automated test runner | /home/genesis/genesis-rebuild/scripts/ |

---

## Service Level Objectives (SLOs)

### Critical SLOs (P1)

These SLOs must be maintained at all times. Violations trigger immediate alerts.

#### 1. Test Pass Rate ≥98%

**Metric:** `genesis_test_pass_rate`
**Target:** ≥0.98 (98%)
**Measurement:** 5-minute rolling window
**Alert Threshold:** <0.98 for 5 minutes

**Why it matters:**
- Validates system correctness
- Detects regressions immediately
- Baseline: 1,026/1,044 tests (98.28%)

**How to check:**
```bash
# Prometheus query
curl -s 'http://localhost:9090/api/v1/query?query=genesis_test_pass_rate' | jq

# Manual test run
pytest tests/ -v --tb=short | grep "passed"
```

#### 2. Error Rate <0.1%

**Metric:** `genesis_errors_total`
**Target:** <0.001 (0.1%)
**Measurement:** 5-minute rate
**Alert Threshold:** >0.001 for 2 minutes

**Why it matters:**
- Indicates system stability
- Prevents error cascades
- Baseline: Phase 3 error handling (96% pass rate)

**How to check:**
```bash
# Prometheus query
curl -s 'http://localhost:9090/api/v1/query?query=rate(genesis_errors_total[5m])' | jq

# Review error logs
grep ERROR logs/genesis.log | tail -50
```

#### 3. P95 Latency <200ms

**Metric:** `genesis_operation_duration_seconds`
**Target:** <0.2 seconds (200ms)
**Measurement:** 95th percentile over 5 minutes
**Alert Threshold:** >0.2 for 5 minutes

**Why it matters:**
- Ensures responsive system
- Validates Phase 3 optimization (46.3% faster)
- Baseline: 131.57ms average (245.11ms pre-optimization)

**How to check:**
```bash
# Prometheus query
curl -s 'http://localhost:9090/api/v1/query?query=histogram_quantile(0.95,rate(genesis_operation_duration_seconds_bucket[5m]))' | jq

# Component breakdown
curl -s 'http://localhost:9090/api/v1/query?query=rate(genesis_htdag_decomposition_duration_seconds_sum[5m])/rate(genesis_htdag_decomposition_duration_seconds_count[5m])' | jq
```

#### 4. Service Uptime 99.9%

**Metric:** `up{job="genesis-orchestration"}`
**Target:** 1 (service up)
**Measurement:** Continuous
**Alert Threshold:** 0 for 1 minute

**Why it matters:**
- Critical for production availability
- Zero-downtime deployment validated
- Baseline: 100% during Phase 3

**How to check:**
```bash
# Prometheus query
curl -s 'http://localhost:9090/api/v1/query?query=up{job="genesis-orchestration"}' | jq

# Manual check
systemctl status genesis-orchestration
curl http://localhost:8000/health
```

### Performance SLOs (P3)

These SLOs indicate performance trends. Violations trigger warnings for investigation.

#### Component-Level SLOs

| Component | Baseline | Warning | Critical |
|-----------|----------|---------|----------|
| HTDAG Decomposition | ~110ms | >150ms | >200ms |
| HALO Routing | ~110ms | >140ms | >180ms |
| AOP Validation | ~50ms | >100ms | >150ms |
| Overall Throughput | 7.6 ops/sec | <6 ops/sec | <4 ops/sec |

**Phase 3 Optimization Results:**
- HTDAG: 51.2% faster (225.93ms → 110.18ms)
- HALO: 79.3% faster (130.45ms → 27.02ms)
- Overall: 46.3% faster (245.11ms → 131.57ms)

### Resource SLOs (P2)

Monitor for capacity planning and resource leaks.

| Resource | Normal | Warning | Critical |
|----------|--------|---------|----------|
| CPU Usage | <60% | >80% | >90% |
| Memory Usage | <70% | >80% | >90% |
| Disk Space | <70% | >80% | >90% |
| Network Bandwidth | <50 Mbps | >80 Mbps | >100 Mbps |

---

## Dashboards & Visualization

### Grafana Dashboard Overview

**Access:** http://localhost:3000/d/genesis-deployment
**Refresh:** 10 seconds
**Panels:** 13 (SLOs, trends, resources, alerts)

#### Panel Layout

```
┌─────────────────────────────────────────────────────────────┐
│  Panel 1          │  Panel 2          │  Panel 3          │ Panel 4    │
│  Test Pass Rate   │  Error Rate       │  P95 Latency      │ Service    │
│  (SLO: ≥98%)      │  (SLO: <0.1%)     │  (SLO: <200ms)    │ Health     │
├───────────────────────────────────────┴───────────────────────────────┤
│  Panel 5: Test Pass Rate Over Time (Graph)                            │
│  - Shows 48-hour trend                                                │
│  - Alert threshold at 98%                                             │
├────────────────────────────────────────────────────────────────────────┤
│  Panel 6: Error Rate Trend (Graph)      │  Panel 7: Latency         │
│  - 5-minute rate                         │  Percentiles (Graph)      │
│  - Alert threshold at 0.1%               │  - P50, P95, P99          │
├──────────────────────────────────────────┴───────────────────────────┤
│  Panel 8: System Resource Usage (Graph)                               │
│  - CPU %                                                              │
│  - Memory %                                                           │
├────────────────────┬────────────────────┬────────────────────────────┤
│  Panel 9:          │  Panel 10:         │  Panel 11:                │
│  HTDAG Performance │  HALO Routing      │  AOP Validation           │
│  (Graph)           │  Performance       │  Performance (Graph)      │
│                    │  (Graph)           │                           │
├────────────────────┴────────────────────┴────────────────────────────┤
│  Panel 12: Test Execution Details (Table)  │  Panel 13: Active      │
│  - Passed, Failed, Skipped counts           │  Alerts (List)        │
└─────────────────────────────────────────────┴────────────────────────┘
```

#### Key Panels to Watch

**Panel 1: Test Pass Rate (Stat)**
- **Green:** ≥99% (healthy)
- **Yellow:** 98-99% (acceptable, watch trend)
- **Red:** <98% (critical, investigate immediately)

**Panel 2: Error Rate (Stat)**
- **Green:** <0.05% (excellent)
- **Yellow:** 0.05-0.1% (acceptable)
- **Red:** >0.1% (critical, investigate)

**Panel 3: P95 Latency (Stat)**
- **Green:** <150ms (excellent)
- **Yellow:** 150-200ms (acceptable)
- **Red:** >200ms (critical, investigate)

**Panel 13: Active Alerts (Alert List)**
- Shows all firing alerts
- Priority: P0 (critical) → P4 (info)
- Click to view details + runbook

### Prometheus Queries

#### Essential Queries

**1. Test Pass Rate:**
```promql
(genesis_tests_passed_total / genesis_tests_total_total) * 100
```

**2. Error Rate:**
```promql
rate(genesis_errors_total[5m])
```

**3. P95 Latency:**
```promql
histogram_quantile(0.95, rate(genesis_operation_duration_seconds_bucket[5m]))
```

**4. Component Latency:**
```promql
# HTDAG
rate(genesis_htdag_decomposition_duration_seconds_sum[5m]) / rate(genesis_htdag_decomposition_duration_seconds_count[5m])

# HALO
rate(genesis_halo_routing_duration_seconds_sum[5m]) / rate(genesis_halo_routing_duration_seconds_count[5m])

# AOP
rate(genesis_aop_validation_duration_seconds_sum[5m]) / rate(genesis_aop_validation_duration_seconds_count[5m])
```

**5. System Resources:**
```promql
# CPU
100 - (avg(rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)

# Memory
(node_memory_MemTotal_bytes - node_memory_MemAvailable_bytes) / node_memory_MemTotal_bytes * 100

# Disk
(node_filesystem_size_bytes - node_filesystem_free_bytes) / node_filesystem_size_bytes * 100
```

---

## Automated Monitoring

### Continuous Monitoring (Real-Time)

#### Prometheus Scraping

**Configuration:** `/home/genesis/genesis-rebuild/monitoring/prometheus_config.yml`

```yaml
scrape_configs:
  - job_name: 'genesis-orchestration'
    scrape_interval: 5s      # Critical metrics every 5 seconds
    static_configs:
      - targets: ['localhost:8000']

  - job_name: 'node'
    scrape_interval: 15s     # System metrics every 15 seconds
    static_configs:
      - targets: ['localhost:9100']
```

**Metrics Collected:**
- Test suite metrics (pass/fail/skip counts)
- Error rates by category
- Operation latency histograms
- System resource usage
- Service health status

#### Alert Rules

**Configuration:** `/home/genesis/genesis-rebuild/monitoring/alerts.yml`

**Critical Alerts (P1):**
1. TestPassRateLow: Pass rate <98% for 5 minutes
2. HighErrorRate: Error rate >0.1% for 2 minutes
3. HighLatencyP95: P95 >200ms for 5 minutes
4. GenesisServiceDown: Service down for 1 minute

**Warning Alerts (P2-P3):**
5. TestPassRateDegrading: Pass rate <99% for 10 minutes
6. HighCPUUsage: CPU >80% for 10 minutes
7. HighMemoryUsage: Memory >80% for 10 minutes
8. Component performance alerts (HTDAG, HALO, AOP)

**Alert Routing:**
- **P0-P1:** Slack #genesis-alerts + PagerDuty (immediate)
- **P2-P3:** Slack #genesis-monitoring (within 1 hour)
- **P4:** Email + Slack #genesis-logs (next business day)

### Periodic Monitoring (Scheduled)

#### Health Check Script

**Script:** `/home/genesis/genesis-rebuild/scripts/health_check.sh`
**Schedule:**
- Hours 0-6: Every 15 minutes
- Hours 6-24: Every 1 hour
- Hours 24-48: Every 3 hours

**Cron Configuration:**
```bash
# Add to crontab
*/15 0-6 * * * /home/genesis/genesis-rebuild/scripts/health_check.sh >> /home/genesis/genesis-rebuild/logs/health_check.log 2>&1
0 7-24 * * * /home/genesis/genesis-rebuild/scripts/health_check.sh >> /home/genesis/genesis-rebuild/logs/health_check.log 2>&1
0 */3 * * * /home/genesis/genesis-rebuild/scripts/health_check.sh >> /home/genesis/genesis-rebuild/logs/health_check.log 2>&1
```

**Checks Performed:**
1. Python environment
2. Virtual environment
3. Dependencies
4. Infrastructure modules
5. Test suite integrity
6. Configuration files
7. Disk space
8. Memory availability
9. Quick smoke test

#### Automated Test Runner

**Script:** `/home/genesis/genesis-rebuild/scripts/run_monitoring_tests.sh`
**Schedule:** Every 6 hours

**Cron Configuration:**
```bash
0 */6 * * * /home/genesis/genesis-rebuild/scripts/run_monitoring_tests.sh >> /home/genesis/genesis-rebuild/logs/test_monitoring.log 2>&1
```

**Actions:**
1. Run full test suite with coverage
2. Parse results (pass/fail/skip counts)
3. Calculate pass rate
4. Generate Prometheus metrics
5. Push to Prometheus Pushgateway
6. Alert if pass rate <98%
7. Archive results

---

## Manual Checks

### Hourly Checks (Hours 0-6)

Execute these checks every hour during intensive monitoring:

```bash
cd /home/genesis/genesis-rebuild

# 1. Health check
./scripts/health_check.sh

# 2. Review Grafana dashboard
# Open: http://localhost:3000/d/genesis-deployment
# Check all 13 panels for anomalies

# 3. Check active alerts
curl -s http://localhost:9090/api/v1/alerts | jq '.data.alerts[] | select(.state=="firing")'

# 4. Review system logs
tail -n 100 logs/genesis.log | grep -E "ERROR|CRITICAL|WARNING"

# 5. Check test pass rate
pytest tests/test_production_health.py -v --tb=short

# 6. Verify service health
systemctl status genesis-orchestration
curl http://localhost:8000/health

# 7. Check system resources
htop  # CPU, memory
df -h  # Disk space
```

### Daily Summary (T+12h, T+24h, T+36h, T+48h)

Generate comprehensive summary report:

```bash
#!/bin/bash
# Generate daily summary

TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
SUMMARY_FILE="logs/summary_${TIMESTAMP}.md"

cat > "$SUMMARY_FILE" <<EOF
# Genesis Monitoring Summary - ${TIMESTAMP}

## Test Suite
- Pass Rate: $(curl -s 'http://localhost:9090/api/v1/query?query=genesis_test_pass_rate' | jq -r '.data.result[0].value[1]')
- Total Tests: $(curl -s 'http://localhost:9090/api/v1/query?query=genesis_tests_total_total' | jq -r '.data.result[0].value[1]')
- Failed Tests: $(curl -s 'http://localhost:9090/api/v1/query?query=genesis_tests_failed_total' | jq -r '.data.result[0].value[1]')

## Error Rate
- Current: $(curl -s 'http://localhost:9090/api/v1/query?query=rate(genesis_errors_total[5m])' | jq -r '.data.result[0].value[1]')
- 24h Average: $(curl -s 'http://localhost:9090/api/v1/query?query=rate(genesis_errors_total[24h])' | jq -r '.data.result[0].value[1]')

## Latency
- P50: $(curl -s 'http://localhost:9090/api/v1/query?query=histogram_quantile(0.50,rate(genesis_operation_duration_seconds_bucket[5m]))' | jq -r '.data.result[0].value[1]')
- P95: $(curl -s 'http://localhost:9090/api/v1/query?query=histogram_quantile(0.95,rate(genesis_operation_duration_seconds_bucket[5m]))' | jq -r '.data.result[0].value[1]')
- P99: $(curl -s 'http://localhost:9090/api/v1/query?query=histogram_quantile(0.99,rate(genesis_operation_duration_seconds_bucket[5m]))' | jq -r '.data.result[0].value[1]')

## Incidents
$(grep "Incident" logs/incidents.log 2>/dev/null || echo "None")

## Status
$(if [ $(curl -s 'http://localhost:9090/api/v1/query?query=genesis_test_pass_rate' | jq -r '.data.result[0].value[1]') > 0.98 ]; then echo "PASS"; else echo "FAIL"; fi)
EOF

cat "$SUMMARY_FILE"
```

---

## Alert Response

### Alert Severity Levels

| Level | Response Time | Escalation | Action |
|-------|---------------|------------|--------|
| P0 - Critical | Immediate | Incident Commander | Rollback |
| P1 - High | 15 minutes | On-call Engineer | Investigate + Fix or Rollback |
| P2 - Medium | 1 hour | On-call Engineer | Monitor + Plan Fix |
| P3 - Low | 4 hours | Engineering Team | Performance Tuning |
| P4 - Info | Next day | Engineering Team | Log Analysis |

### Response Procedures

**See full procedures in:** `/home/genesis/genesis-rebuild/docs/INCIDENT_RESPONSE.md`

#### Quick Response Guide

**Alert: TestPassRateLow (P1)**
```bash
# 1. Run tests
pytest tests/ -v --tb=short

# 2. Identify failures
grep FAILED logs/test_results.log

# 3. If >5 infrastructure tests fail → ROLLBACK
# 4. If intermittent (P4 test) → add retry
# 5. If new regression → hotfix or rollback
```

**Alert: HighErrorRate (P1)**
```bash
# 1. Check error category
curl -s http://localhost:9090/api/v1/query?query=genesis_errors_total | jq

# 2. Review logs
tail -100 logs/genesis.log | grep ERROR

# 3. If LLM errors → disable LLM, use fallback
# 4. If network errors → enable circuit breaker
# 5. If resource errors → restart service or scale
```

**Alert: HighLatencyP95 (P1)**
```bash
# 1. Identify slow component
curl -s http://localhost:9090/api/v1/query?query=rate(genesis_htdag_decomposition_duration_seconds_sum[5m])/rate(genesis_htdag_decomposition_duration_seconds_count[5m]) | jq

# 2. If HTDAG slow → enable cache
# 3. If HALO slow → verify optimizations
# 4. If system resources high → reduce concurrency or scale
```

**Alert: GenesisServiceDown (P0)**
```bash
# 1. IMMEDIATE: Notify incident commander
# 2. Attempt restart
systemctl restart genesis-orchestration

# 3. If fails → ROLLBACK
./scripts/rollback_deployment.sh

# 4. Verify service restored
curl http://localhost:8000/health
```

---

## Troubleshooting

### Common Issues

#### Issue: Intermittent Test Failures

**Symptom:** test_halo_routing_performance_large_dag fails in full suite, passes in isolation

**Diagnosis:**
```bash
# Run test in isolation
pytest tests/test_performance.py::test_halo_routing_performance_large_dag -v

# Run with full suite
pytest tests/ -v -k test_halo_routing_performance_large_dag
```

**Root Cause:** Resource contention in CI/CD environment

**Resolution:**
```python
# Add retry logic to pytest.ini
[pytest]
retries = 3
retries_delay = 1

# Or mark test as flaky
@pytest.mark.flaky(reruns=3)
def test_halo_routing_performance_large_dag():
    ...
```

#### Issue: Prometheus Metrics Not Updating

**Symptom:** Grafana shows stale metrics

**Diagnosis:**
```bash
# Check Prometheus scrape status
curl -s http://localhost:9090/api/v1/targets | jq

# Check target health
curl -s http://localhost:8000/metrics
```

**Resolution:**
```bash
# Restart Prometheus
docker restart prometheus

# Verify scrape config
cat /home/genesis/genesis-rebuild/monitoring/prometheus_config.yml

# Check Genesis metrics endpoint
curl http://localhost:8000/metrics | grep genesis_
```

#### Issue: High Memory Usage

**Symptom:** Memory >80%, system slow

**Diagnosis:**
```bash
# Check memory usage
free -h
ps aux --sort=-%mem | head -10

# Check for memory leaks
watch -n 5 'ps -p $(pgrep -f genesis) -o pid,vsz,rss,%mem,cmd'
```

**Resolution:**
```bash
# Restart service
systemctl restart genesis-orchestration

# If persistent, enable aggressive GC
export PYTHONMALLOC=malloc
export PYTHONFAULTHANDLER=1
systemctl restart genesis-orchestration

# Or scale up resources
```

#### Issue: Grafana Dashboard Not Loading

**Symptom:** Dashboard shows "No data"

**Diagnosis:**
```bash
# Check Grafana data source
curl -s http://localhost:3000/api/datasources | jq

# Check Prometheus connectivity
curl -s http://localhost:9090/api/v1/label/__name__/values | jq
```

**Resolution:**
```bash
# Re-import dashboard
# 1. Access Grafana: http://localhost:3000
# 2. Go to Dashboards → Import
# 3. Upload: /home/genesis/genesis-rebuild/monitoring/grafana_dashboard.json

# Or restart Grafana
docker restart grafana
```

### Diagnostic Commands

```bash
# Check service status
systemctl status genesis-orchestration

# View service logs
journalctl -u genesis-orchestration -f

# Check health endpoint
curl http://localhost:8000/health | jq

# Run health check
./scripts/health_check.sh

# Run full test suite
pytest tests/ -v --tb=short

# Check Prometheus metrics
curl http://localhost:9090/api/v1/targets | jq
curl http://localhost:9090/api/v1/alerts | jq

# Check system resources
htop
free -h
df -h
iostat -x 1 5

# Review logs
tail -f logs/genesis.log
tail -f logs/health_check.log
tail -f logs/test_monitoring.log
```

---

## Handoff to BAU

### Success Criteria

After 48 hours, deployment is successful if:

✅ **Test Pass Rate:** ≥98% sustained for 48 hours
✅ **Error Rate:** <0.1% sustained for 48 hours
✅ **P95 Latency:** <200ms sustained for 48 hours
✅ **Service Uptime:** 99.9% or higher
✅ **No P1 Incidents:** Zero unresolved P1 alerts
✅ **Performance Baseline:** Within 10% of Phase 3 (46.3% faster)
✅ **Resource Usage:** Stable (no leaks, no growth)
✅ **Zero Rollbacks:** No need to revert

### Handoff Process

1. **Final Review (T+48h)**

   ```bash
   # Generate 48-hour summary
   ./scripts/generate_deployment_report.sh

   # Review all incidents
   cat logs/incidents.log

   # Check final metrics
   curl -s 'http://localhost:9090/api/v1/query?query=genesis_test_pass_rate' | jq
   curl -s 'http://localhost:9090/api/v1/query?query=rate(genesis_errors_total[48h])' | jq
   ```

2. **Update Documentation**

   - Record new baseline metrics
   - Document any incidents + resolutions
   - Update known issues list
   - Archive deployment logs

3. **Adjust Monitoring**

   - Reduce alert sensitivity (if appropriate)
   - Extend metric retention to 30 days
   - Update Grafana dashboard with final baseline

4. **BAU Monitoring Schedule**

   - Daily health checks (automated via cron)
   - Weekly performance reviews (engineering team)
   - Monthly capacity planning (SRE team)
   - Quarterly optimization cycles (engineering + SRE)

5. **Sign-Off**

   - Engineering Lead: [Signature]
   - SRE Lead: [Signature]
   - Date: [Date]

### BAU Monitoring Configuration

```bash
# Update cron for BAU (less frequent)
crontab -e

# Daily health check at 6am
0 6 * * * /home/genesis/genesis-rebuild/scripts/health_check.sh

# Daily test suite at 2am
0 2 * * * /home/genesis/genesis-rebuild/scripts/run_monitoring_tests.sh

# Weekly full report on Monday at 8am
0 8 * * 1 /home/genesis/genesis-rebuild/scripts/generate_weekly_report.sh
```

---

## Quick Reference

### URLs

- **Grafana Dashboard:** http://localhost:3000/d/genesis-deployment
- **Prometheus UI:** http://localhost:9090
- **Prometheus Alerts:** http://localhost:9090/alerts
- **Genesis Health:** http://localhost:8000/health
- **Genesis Metrics:** http://localhost:8000/metrics

### Scripts

```bash
# Health check
/home/genesis/genesis-rebuild/scripts/health_check.sh

# Test runner
/home/genesis/genesis-rebuild/scripts/run_monitoring_tests.sh

# Rollback
/home/genesis/genesis-rebuild/scripts/rollback_deployment.sh
```

### Logs

```bash
# Application logs
tail -f /home/genesis/genesis-rebuild/logs/genesis.log

# Health check logs
tail -f /home/genesis/genesis-rebuild/logs/health_check.log

# Test logs
tail -f /home/genesis/genesis-rebuild/logs/test_monitoring.log

# System logs
journalctl -u genesis-orchestration -f
```

### Key Metrics

```bash
# Test pass rate
curl -s 'http://localhost:9090/api/v1/query?query=genesis_test_pass_rate' | jq

# Error rate
curl -s 'http://localhost:9090/api/v1/query?query=rate(genesis_errors_total[5m])' | jq

# P95 latency
curl -s 'http://localhost:9090/api/v1/query?query=histogram_quantile(0.95,rate(genesis_operation_duration_seconds_bucket[5m]))' | jq

# Service status
curl -s 'http://localhost:9090/api/v1/query?query=up{job="genesis-orchestration"}' | jq
```

### Alert Response

- **TestPassRateLow:** Run tests, identify failures, hotfix or rollback
- **HighErrorRate:** Check logs, enable fallback, restart service
- **HighLatencyP95:** Check component latency, enable cache, scale resources
- **GenesisServiceDown:** Restart service, rollback if fails

### Runbooks

- **Full Incident Response:** /home/genesis/genesis-rebuild/docs/INCIDENT_RESPONSE.md
- **Monitoring Plan:** /home/genesis/genesis-rebuild/docs/MONITORING_PLAN.md
- **Rollback Procedure:** (in INCIDENT_RESPONSE.md)

---

## Contact Information

**On-Call Engineer:** [Insert contact]
**Incident Commander:** [Insert contact]
**Engineering Lead:** [Insert contact]
**SRE Team:** #genesis-sre (Slack)

**Emergency Contacts:**
- Slack: #genesis-alerts (critical), #genesis-monitoring (warnings)
- PagerDuty: [Insert integration]
- Email: genesis-alerts@company.com

---

**Document Version:** 1.0
**Last Updated:** October 18, 2025
**Next Review:** After deployment completion
**Maintained By:** Genesis SRE Team

---

## Appendix A: Baseline Metrics (Phase 3)

**Pre-Optimization (Phase 2):**
- HTDAG decomposition: 225.93ms
- HALO routing: 130.45ms (rule matching: 130.45ms)
- Overall: 245.11ms

**Post-Optimization (Phase 3):**
- HTDAG decomposition: 110.18ms (51.2% faster)
- HALO routing: 110.18ms (51.2% faster, rule matching: 27.02ms - 79.3% faster)
- Overall: 131.57ms (46.3% faster)

**Test Suite (Final Validation):**
- Total tests: 1,044
- Passed: 1,026 (98.28%)
- Failed: 1 (0.10% - intermittent P4)
- Skipped: 17 (1.63% - environment-specific)
- Execution time: 89.56s

**Coverage:**
- Infrastructure: 85-100% (critical modules)
- Agents: 23-85% (integration-heavy)
- Combined: 67% (weighted average)

**Production Readiness:** 9.2/10

---

## Appendix B: Known Issues

**P4: test_halo_routing_performance_large_dag**
- **Symptom:** Fails in full suite due to resource contention
- **Impact:** None (performance test only, no functional impact)
- **Workaround:** Passes in isolation
- **Fix:** Add retry logic (1 hour)
- **Tracked:** [Internal ticket]

---

**End of Document**
