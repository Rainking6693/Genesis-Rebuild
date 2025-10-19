# Genesis Monitoring Stack

Production monitoring infrastructure for Genesis orchestration system.

## Quick Start

### Deploy All Services (15 minutes)

```bash
cd /home/genesis/genesis-rebuild/monitoring
docker-compose up -d
```

### Verify Deployment

```bash
# Check all services running
docker-compose ps

# Check Prometheus
curl http://localhost:9090/api/v1/targets

# Check Grafana
curl http://localhost:3000/api/health

# Check Node Exporter
curl http://localhost:9100/metrics | head -20

# Check Alertmanager
curl http://localhost:9093/api/v2/status
```

### Access Dashboards

- **Prometheus**: http://localhost:9090
- **Grafana**: http://localhost:3000 (admin/admin)
- **Alertmanager**: http://localhost:9093
- **Node Exporter Metrics**: http://localhost:9100/metrics

## Services

### 1. Prometheus (Port 9090)
- Metrics collection from Genesis system
- Alert rule evaluation
- Data retention: 30 days
- Scrape interval: 15 seconds (5s for orchestration)

**Configuration**: `prometheus_config.yml`
**Alert Rules**: `alerts.yml` (18 rules across 4 groups)

### 2. Grafana (Port 3000)
- Visualization dashboards
- Real-time SLO monitoring
- 13-panel Genesis deployment dashboard

**Dashboard**: `grafana_dashboard.json`
**Default Credentials**: admin/admin (change on first login)

### 3. Node Exporter (Port 9100)
- System-level metrics (CPU, memory, disk, network)
- Prometheus scrapes from `/metrics` endpoint

### 4. Alertmanager (Port 9093)
- Alert routing and notification
- Webhook-based notifications (configurable for Slack/PagerDuty)

**Configuration**: `alertmanager_config.yml`

## Alert Rules

**18 alert rules** organized in 4 groups:

### Critical (P0-P1)
- TestPassRateLow: Pass rate <98% for 5m
- HighErrorRate: Error rate >0.1% for 2m
- HighLatencyP95: P95 latency >200ms for 5m
- GenesisServiceDown: Service down for 1m

### Warnings (P2-P3)
- TestPassRateDegrading: Pass rate <99% for 10m
- HighMemoryUsage: Memory >80% for 10m
- HighCPUUsage: CPU >80% for 10m
- HTDAGDecompositionSlow: Avg >150ms for 10m
- HALORoutingSlow: Avg >130ms for 10m
- SystemThroughputDegraded: <4 ops/sec for 10m

### Performance (P3)
- Component-specific performance degradation alerts

### Health (P2-P4)
- TestSuiteNotRunning: No metrics for 15m
- ObservabilityMetricsMissing: OTEL metrics absent for 5m
- IntermittentTestFailures: Known P4 performance test pattern

## Metrics Endpoints

Genesis system should expose metrics on these endpoints:

- **Orchestration**: http://localhost:8000/metrics
- **Python App**: http://localhost:8001/metrics (if applicable)
- **Test Suite**: http://localhost:8002/metrics (via test runner script)

## Service Level Objectives (SLOs)

| Metric | Target | Alert Threshold |
|--------|--------|-----------------|
| Test Pass Rate | ≥98% | <98% for 5 min |
| Error Rate | <0.1% | >0.1% for 2 min |
| P95 Latency | <200ms | >200ms for 5 min |
| Service Uptime | 99.9% | Down for 1 min |

## Management Commands

### Start All Services
```bash
docker-compose up -d
```

### Stop All Services
```bash
docker-compose down
```

### Restart Specific Service
```bash
docker-compose restart prometheus
docker-compose restart grafana
docker-compose restart alertmanager
docker-compose restart node-exporter
```

### View Logs
```bash
docker-compose logs -f prometheus
docker-compose logs -f grafana
docker-compose logs -f alertmanager
docker-compose logs -f node-exporter
```

### Update Configuration
```bash
# Edit config files, then reload
docker-compose restart prometheus
# Or use hot reload for Prometheus
curl -X POST http://localhost:9090/-/reload
```

### Remove All Services and Data
```bash
docker-compose down -v
```

## Grafana Dashboard Import

1. Access Grafana: http://localhost:3000
2. Login (admin/admin)
3. Navigate to Dashboards → Import
4. Upload `grafana_dashboard.json`
5. Select Prometheus data source
6. Import

**Dashboard Panels (13 total)**:
1. Test Pass Rate (SLO: ≥98%)
2. Error Rate (SLO: <0.1%)
3. P95 Latency (SLO: <200ms)
4. Service Health (Uptime)
5. HTDAG Decomposition Time
6. HALO Routing Time
7. AOP Validation Time
8. System Throughput
9. CPU Usage
10. Memory Usage
11. Disk Usage
12. Active Alerts
13. Recent Alert History

## Alert Configuration

### Webhook Notifications (Default)
Alertmanager sends alerts to `http://localhost:5001/alerts/*`

### Configure Slack Notifications
Edit `alertmanager_config.yml`:

```yaml
global:
  slack_api_url: 'https://hooks.slack.com/services/YOUR/WEBHOOK/URL'

receivers:
  - name: 'critical'
    slack_configs:
      - channel: '#genesis-critical'
        username: 'Genesis Alerts'
```

Then restart:
```bash
docker-compose restart alertmanager
```

### Configure PagerDuty
Edit `alertmanager_config.yml`:

```yaml
receivers:
  - name: 'critical'
    pagerduty_configs:
      - service_key: YOUR_PAGERDUTY_SERVICE_KEY
```

## Troubleshooting

### Prometheus can't scrape targets
- Ensure Genesis orchestration service is running on port 8000
- Check `/metrics` endpoint is exposed
- Verify network connectivity: `curl http://localhost:8000/metrics`

### Grafana dashboard shows "No data"
- Verify Prometheus data source is configured
- Check Prometheus is scraping targets successfully
- Ensure metrics names match dashboard queries

### Alerts not firing
- Validate alert rules: `docker exec prometheus promtool check rules /etc/prometheus/alerts.yml`
- Check alert evaluation: http://localhost:9090/alerts
- Verify metrics exist in Prometheus: http://localhost:9090/graph

### Alertmanager not routing alerts
- Check Alertmanager config: `docker-compose config alertmanager`
- View Alertmanager status: http://localhost:9093/#/status
- Check webhook endpoint is reachable

## Files

- `docker-compose.yml` - Service orchestration
- `prometheus_config.yml` - Prometheus configuration
- `alerts.yml` - Prometheus alert rules (18 rules)
- `grafana_dashboard.json` - Grafana dashboard definition
- `alertmanager_config.yml` - Alertmanager routing configuration
- `README.md` - This file

## Production Deployment

For production deployment:

1. **Change Grafana password**:
   ```bash
   docker exec grafana grafana-cli admin reset-admin-password NEW_PASSWORD
   ```

2. **Configure alert notifications**: Update `alertmanager_config.yml` with Slack/PagerDuty

3. **Enable HTTPS**: Use reverse proxy (nginx/traefik) for TLS termination

4. **Set up data persistence**: Volumes are already configured in docker-compose.yml

5. **Configure monitoring retention**:
   - Prometheus: `--storage.tsdb.retention.time=30d` (already set)
   - Adjust based on disk space availability

6. **Set resource limits** (optional):
   ```yaml
   services:
     prometheus:
       deploy:
         resources:
           limits:
             cpus: '2'
             memory: 2G
   ```

## Support

- **Documentation**: `/home/genesis/genesis-rebuild/docs/POST_DEPLOYMENT_MONITORING.md`
- **Monitoring Plan**: `/home/genesis/genesis-rebuild/docs/MONITORING_PLAN.md`
- **Incident Response**: `/home/genesis/genesis-rebuild/docs/INCIDENT_RESPONSE.md`

## Version

- **Docker Compose**: v3.8
- **Prometheus**: latest
- **Grafana**: latest
- **Node Exporter**: latest
- **Alertmanager**: latest

**Created**: October 18, 2025
**Author**: Forge (Testing & Validation Specialist)
