---
title: Grafana & Prometheus Setup Guide - Step-by-Step
category: Reports
dg-publish: true
publish: true
tags:
- genesis
source: GRAFANA_PROMETHEUS_SETUP_GUIDE.md
exported: '2025-10-24T22:05:26.759923'
---

# Grafana & Prometheus Setup Guide - Step-by-Step

**Created:** October 20, 2025
**For:** Genesis Phase 4 Production Deployment
**User:** Step-by-step instructions for accessing and using monitoring dashboards

---

## 🎯 WHAT YOU NEED TO KNOW

**Current Status:** All monitoring services are ALREADY RUNNING (2+ days uptime)
- ✅ Prometheus running on port 9090
- ✅ Grafana running on port 3000
- ✅ Alertmanager running on port 9093
- ✅ Node Exporter running on port 9100

**You do NOT need to deploy anything.** This guide shows you how to ACCESS and USE the existing dashboards.

---

## STEP 1: Verify Services Are Running

Open your terminal and run:

```bash
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
```

**Expected Output:**
```
NAMES              STATUS              PORTS
prometheus         Up 2 days           0.0.0.0:9090->9090/tcp
grafana            Up 2 days           0.0.0.0:3000->3000/tcp
alertmanager       Up 2 days           0.0.0.0:9093->9093/tcp
node-exporter      Up 2 days           0.0.0.0:9100->9100/tcp
```

✅ **If you see this, all services are running correctly.**

---

## STEP 2: Access Grafana (Main Dashboard)

### 2.1 Open Grafana in Browser

**URL:** http://localhost:3000

**Login Credentials:**
- **Username:** `admin`
- **Password:** `admin`

⚠️ **SECURITY NOTE:** Hudson's audit flagged this default password as a security risk (P2). You should change it after logging in.

### 2.2 First Login - Change Password (RECOMMENDED)

After first login, Grafana will prompt you to change the password:
1. Enter new password (8+ characters recommended)
2. Click "Submit"
3. You'll be redirected to the Grafana home page

### 2.3 Navigate to Genesis Dashboard

**Option A: Direct Link**
1. Click "Dashboards" in left sidebar
2. Click "Browse"
3. Look for "Genesis 48-Hour Post-Deployment Monitoring"
4. Click to open

**Option B: Create New Dashboard**
If the Genesis dashboard doesn't exist yet, you can create it:
1. Click "+" in top-right corner
2. Click "New Dashboard"
3. Click "Add visualization"
4. Select "Prometheus" as data source
5. Follow Step 3 below to add panels

---

## STEP 3: Add Monitoring Panels to Grafana

### Panel 1: Test Pass Rate (Target: ≥98%)

**Purpose:** Monitor the percentage of tests passing in production

**How to Add:**
1. Click "Add panel" → "Add visualization"
2. Select data source: "Prometheus"
3. In query box, enter:
   ```promql
   (genesis_tests_passed / genesis_tests_total) * 100
   ```
4. Panel settings:
   - **Title:** "Test Pass Rate"
   - **Unit:** "percent (0-100)"
   - **Thresholds:** Red <95%, Yellow 95-98%, Green ≥98%
5. Click "Apply"

**What it shows:** Current test pass rate (should be ≥98%)

---

### Panel 2: Error Rate (Target: <0.1%)

**Purpose:** Monitor the percentage of requests resulting in errors

**How to Add:**
1. Click "Add panel" → "Add visualization"
2. Select data source: "Prometheus"
3. In query box, enter:
   ```promql
   (rate(genesis_errors_total[5m]) / rate(genesis_requests_total[5m])) * 100
   ```
4. Panel settings:
   - **Title:** "Error Rate"
   - **Unit:** "percent (0-100)"
   - **Thresholds:** Red >1%, Yellow 0.1-1%, Green <0.1%
5. Click "Apply"

**What it shows:** Error rate over last 5 minutes (should be <0.1%)

---

### Panel 3: P95 Latency (Target: <200ms)

**Purpose:** Monitor the 95th percentile response time (95% of requests complete in this time or less)

**How to Add:**
1. Click "Add panel" → "Add visualization"
2. Select data source: "Prometheus"
3. In query box, enter:
   ```promql
   histogram_quantile(0.95, rate(genesis_request_duration_seconds_bucket[5m])) * 1000
   ```
4. Panel settings:
   - **Title:** "P95 Latency"
   - **Unit:** "milliseconds (ms)"
   - **Thresholds:** Red >500ms, Yellow 200-500ms, Green <200ms
5. Click "Apply"

**What it shows:** 95th percentile latency in milliseconds (should be <200ms)

---

### Panel 4: System Uptime (Target: 99.9%)

**Purpose:** Monitor whether the Genesis system is up and responding

**How to Add:**
1. Click "Add panel" → "Add visualization"
2. Select data source: "Prometheus"
3. In query box, enter:
   ```promql
   up{job="genesis"}
   ```
4. Panel settings:
   - **Title:** "System Uptime"
   - **Visualization:** "Stat"
   - **Value mappings:** 0 = "Down", 1 = "Up"
   - **Thresholds:** Red = 0, Green = 1
5. Click "Apply"

**What it shows:** 1 = system is up, 0 = system is down

---

### Panel 5: Feature Flag Status

**Purpose:** Monitor which feature flags are enabled in production

**How to Add:**
1. Click "Add panel" → "Add visualization"
2. Select data source: "Prometheus"
3. In query box, enter:
   ```promql
   genesis_feature_flag_enabled{environment="production"}
   ```
4. Panel settings:
   - **Title:** "Feature Flags (Production)"
   - **Visualization:** "Table"
   - **Columns:** flag_name, enabled
5. Click "Apply"

**What it shows:** List of all feature flags and their current status

---

### Panel 6: Memory Usage

**Purpose:** Monitor system memory usage to detect memory leaks

**How to Add:**
1. Click "Add panel" → "Add visualization"
2. Select data source: "Prometheus"
3. In query box, enter:
   ```promql
   node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes * 100
   ```
4. Panel settings:
   - **Title:** "Memory Available"
   - **Unit:** "percent (0-100)"
   - **Thresholds:** Red <10%, Yellow 10-30%, Green >30%
5. Click "Apply"

**What it shows:** Percentage of system memory available (should be >30%)

---

### Panel 7: CPU Usage

**Purpose:** Monitor CPU utilization to detect performance issues

**How to Add:**
1. Click "Add panel" → "Add visualization"
2. Select data source: "Prometheus"
3. In query box, enter:
   ```promql
   100 - (avg by (instance) (rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)
   ```
4. Panel settings:
   - **Title:** "CPU Usage"
   - **Unit:** "percent (0-100)"
   - **Thresholds:** Red >80%, Yellow 60-80%, Green <60%
5. Click "Apply"

**What it shows:** Percentage of CPU in use (should be <60% normally)

---

## STEP 4: Access Prometheus (Advanced Users)

**URL:** http://localhost:9090

### 4.1 View Active Targets

**Purpose:** See what services Prometheus is monitoring

**Steps:**
1. Open http://localhost:9090/targets
2. You should see a list of targets with their health status
3. All targets should show "UP" in green

### 4.2 View Alert Rules

**Purpose:** See all configured alerts and their current state

**Steps:**
1. Open http://localhost:9090/alerts
2. You should see 13 alert rules
3. Healthy system = all alerts in "Inactive" state (green)
4. If any alert is "Pending" (yellow) or "Firing" (red), investigate

### 4.3 Query Metrics Directly

**Purpose:** Run custom queries to investigate specific metrics

**Steps:**
1. Open http://localhost:9090/graph
2. In the query box, enter a PromQL query (examples below)
3. Click "Execute"
4. View results in table or graph format

**Example Queries:**
```promql
# Current test pass rate
(genesis_tests_passed / genesis_tests_total) * 100

# Error rate over last 15 minutes
rate(genesis_errors_total[15m])

# Memory usage
node_memory_MemAvailable_bytes / 1024 / 1024 / 1024

# CPU usage per core
rate(node_cpu_seconds_total{mode!="idle"}[5m])
```

---

## STEP 5: Access Alertmanager (Alert Management)

**URL:** http://localhost:9093

### 5.1 View Active Alerts

**Steps:**
1. Open http://localhost:9093/#/alerts
2. You should see all active alerts
3. Healthy system = no active alerts

### 5.2 Silence an Alert

**Purpose:** Temporarily disable alerts during maintenance

**Steps:**
1. Click "Silences" in top menu
2. Click "New Silence"
3. Fill in:
   - **Matchers:** `alertname="YourAlertName"`
   - **Duration:** How long to silence (e.g., "2h")
   - **Creator:** Your name
   - **Comment:** Reason for silencing
4. Click "Create"

---

## STEP 6: View System Metrics (Node Exporter)

**URL:** http://localhost:9100/metrics

### 6.1 Raw Metrics

**Purpose:** See all raw system metrics being collected

**Steps:**
1. Open http://localhost:9100/metrics
2. You'll see a text file with hundreds of metrics
3. Search for specific metrics (Ctrl+F):
   - `node_memory_` - Memory metrics
   - `node_cpu_` - CPU metrics
   - `node_disk_` - Disk metrics
   - `node_network_` - Network metrics

**Common Metrics:**
```
# Memory
node_memory_MemTotal_bytes        # Total RAM
node_memory_MemAvailable_bytes    # Available RAM
node_memory_MemFree_bytes         # Free RAM

# CPU
node_cpu_seconds_total            # CPU time by mode (idle, user, system)

# Disk
node_disk_io_time_seconds_total   # Disk I/O time
node_filesystem_avail_bytes       # Disk space available
```

---

## STEP 7: Set Up Alerts (Optional)

### 7.1 Configure Email Alerts

**Edit Alertmanager config:**
```bash
nano /home/genesis/genesis-rebuild/monitoring/alertmanager_config.yml
```

**Add email receiver:**
```yaml
receivers:
  - name: 'email-alerts'
    email_configs:
      - to: 'your-email@example.com'
        from: 'alertmanager@genesis.com'
        smarthost: 'smtp.gmail.com:587'
        auth_username: 'your-email@example.com'
        auth_password: 'your-app-password'
```

**Restart Alertmanager:**
```bash
docker restart alertmanager
```

### 7.2 Configure Slack Alerts

**Add Slack webhook URL:**
```yaml
receivers:
  - name: 'slack-alerts'
    slack_configs:
      - api_url: 'https://hooks.slack.com/services/YOUR/WEBHOOK/URL'
        channel: '#genesis-alerts'
        title: 'Genesis Alert: {{ .GroupLabels.alertname }}'
        text: '{{ range .Alerts }}{{ .Annotations.description }}{{ end }}'
```

**Restart Alertmanager:**
```bash
docker restart alertmanager
```

---

## STEP 8: During 7-Day Rollout - What to Monitor

### Day 1 (0% → 5% → 10%)
**Monitor every 15 minutes:**
- ✅ Test Pass Rate ≥98%
- ✅ Error Rate <0.1%
- ✅ P95 Latency <200ms
- ✅ No alerts firing

**Grafana URL:** http://localhost:3000
**Set auto-refresh:** Top-right corner → 15s refresh

### Days 2-3 (10% → 25%)
**Monitor every 1 hour:**
- Same metrics as Day 1
- Watch for degradation trends

**Set auto-refresh:** 1m refresh

### Days 4-6 (25% → 100%)
**Monitor every 3-6 hours:**
- Same metrics
- Focus on sustained performance

**Set auto-refresh:** 5m refresh

### Days 7-8 (100% validation)
**Monitor every 24 hours:**
- Final validation of 48-hour stability
- Confirm all SLOs met

---

## STEP 9: Troubleshooting

### Problem: Can't access Grafana (Connection refused)

**Solution:**
```bash
# Check if Grafana is running
docker ps | grep grafana

# If not running, start it
docker start grafana

# Check logs for errors
docker logs grafana
```

### Problem: Grafana shows "Data source not found"

**Solution:**
1. Go to Configuration (gear icon) → Data Sources
2. Click "Add data source"
3. Select "Prometheus"
4. Set URL: `http://localhost:9090`
5. Click "Save & Test"

### Problem: Prometheus shows no data

**Solution:**
```bash
# Check Prometheus targets
curl -s http://localhost:9090/api/v1/targets | jq .

# Check Prometheus is scraping
docker logs prometheus | grep -i scrape

# Restart Prometheus
docker restart prometheus
```

### Problem: Alerts not firing when they should

**Solution:**
```bash
# Check alert rules are loaded
curl -s http://localhost:9090/api/v1/rules | jq '.data.groups[].rules[] | select(.type=="alerting") | .name'

# Validate alert rules syntax
docker exec prometheus promtool check rules /etc/prometheus/alerts.yml

# Check Alertmanager is connected
curl -s http://localhost:9090/api/v1/alertmanagers
```

---

## STEP 10: Quick Reference Commands

### Check all monitoring services
```bash
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep -E "prometheus|grafana|alertmanager|node"
```

### View Prometheus targets
```bash
curl -s http://localhost:9090/api/v1/targets | jq '.data.activeTargets[] | {job, health, scrapeUrl}'
```

### View active alerts
```bash
curl -s http://localhost:9090/api/v1/alerts | jq '.data.alerts[] | {labels: .labels.alertname, state, value}'
```

### View Grafana health
```bash
curl -s http://localhost:3000/api/health | jq .
```

### Stop all monitoring services
```bash
docker stop prometheus grafana alertmanager node-exporter
```

### Start all monitoring services
```bash
docker start prometheus grafana alertmanager node-exporter
```

### View logs
```bash
docker logs prometheus
docker logs grafana
docker logs alertmanager
docker logs node-exporter
```

---

## APPENDIX A: Dashboard URLs

| Service | URL | Purpose |
|---------|-----|---------|
| Grafana | http://localhost:3000 | Main monitoring dashboard |
| Prometheus | http://localhost:9090 | Metrics and queries |
| Prometheus Targets | http://localhost:9090/targets | Monitor scrape health |
| Prometheus Alerts | http://localhost:9090/alerts | View alert status |
| Alertmanager | http://localhost:9093 | Manage alerts |
| Node Exporter | http://localhost:9100/metrics | System metrics |

---

## APPENDIX B: SLO Thresholds (Production)

| Metric | Target | Warning | Critical |
|--------|--------|---------|----------|
| Test Pass Rate | ≥98% | <98% | <95% |
| Error Rate | <0.1% | 0.1-1% | >1% |
| P95 Latency | <200ms | 200-500ms | >500ms |
| System Uptime | 99.9% | <99.9% | <99% |
| Memory Available | >30% | 10-30% | <10% |
| CPU Usage | <60% | 60-80% | >80% |

---

## APPENDIX C: Alert Rules Summary

**13 Alert Rules Configured:**

1. **HighErrorRate** - Error rate >1% for 5 minutes
2. **TestFailureRate** - Test pass rate <95% for 10 minutes
3. **HighLatency** - P95 latency >500ms for 5 minutes
4. **ServiceDown** - Service down for 1 minute
5. **HighMemoryUsage** - Memory usage >90% for 5 minutes
6. **HighCPUUsage** - CPU usage >80% for 10 minutes
7. **DiskSpaceLow** - Disk space <10% available
8. **TooManyHealthCheckFailures** - 5+ failures in 5 minutes
9. **FeatureFlagFlapping** - Flag toggled 3+ times in 1 minute
10. **OrchestrationErrors** - HTDAG/HALO errors >10/minute
11. **OTELTracingDown** - OTEL tracing unavailable for 5 minutes
12. **DatabaseConnectionFailed** - DB connection errors >5/minute
13. **DeploymentRollbackTriggered** - Auto-rollback activated

---

## APPENDIX D: Grafana Tips

### Keyboard Shortcuts
- `d` + `n` - New dashboard
- `d` + `s` - Save dashboard
- `f` - Open search
- `Ctrl` + `S` - Save
- `Esc` - Exit edit mode

### Auto-Refresh
- Top-right corner dropdown
- Options: 5s, 10s, 30s, 1m, 5m, 15m, 30m, 1h
- Recommended during rollout: 15s (Day 1), 1m (Days 2-6)

### Time Range
- Top-right corner clock icon
- Options: Last 5m, 15m, 1h, 6h, 12h, 24h, 7d, 30d
- Recommended: Last 1h (real-time), Last 24h (trends)

### Dashboard Snapshots
- Click "Share" → "Snapshot"
- Creates shareable static version of current dashboard state
- Useful for incident reports

---

**END OF GUIDE**

**Questions?** Contact deployment lead (Cora) or on-call engineer (Thon)

**Last Updated:** October 20, 2025
