# Grafana Monitoring Setup for Genesis Agents

**Purpose:** Real-time dashboard for monitoring 15 agents + 3 business generation tasks  
**Timeline:** 30-45 minutes setup  
**Cost:** $0 (self-hosted on your VPS)

---

## Prerequisites

- Docker installed (you already have this)
- Prometheus running (from Phase 4 monitoring)
- Port 3000 available for Grafana

---

## Step 1: Install Grafana (5 minutes)

### Option A: Docker (Recommended)

```bash
# Create Grafana data directory
mkdir -p ~/grafana/data
chmod 777 ~/grafana/data

# Run Grafana container
docker run -d \
  --name=grafana \
  -p 3000:3000 \
  -v ~/grafana/data:/var/lib/grafana \
  -e "GF_SECURITY_ADMIN_PASSWORD=admin" \
  -e "GF_SERVER_ROOT_URL=http://localhost:3000" \
  grafana/grafana:latest

# Verify running
docker ps | grep grafana
```

### Option B: Direct Install

```bash
# Add Grafana repository
wget -q -O - https://packages.grafana.com/gpg.key | sudo apt-key add -
echo "deb https://packages.grafana.com/oss/deb stable main" | sudo tee /etc/apt/sources.list.d/grafana.list

# Install
sudo apt update
sudo apt install grafana -y

# Start service
sudo systemctl start grafana-server
sudo systemctl enable grafana-server
```

---

## Step 2: Access Grafana (2 minutes)

1. **Open browser:** http://localhost:3000
2. **Login:**
   - Username: `admin`
   - Password: `admin` (you'll be prompted to change)
3. **Change password** to something secure

---

## Step 3: Add Prometheus Data Source (5 minutes)

1. **Navigate:** Configuration (⚙️) → Data Sources
2. **Click:** "Add data source"
3. **Select:** Prometheus
4. **Configure:**
   ```yaml
   Name: Genesis Prometheus
   URL: http://localhost:9090
   Access: Server (default)
   Scrape interval: 15s
   ```
5. **Click:** "Save & Test"
6. **Expected:** ✅ "Data source is working"

---

## Step 4: Import Genesis Dashboard (10 minutes)

### Create Dashboard JSON

Save this to `grafana_genesis_dashboard.json`:

```json
{
  "dashboard": {
    "title": "Genesis Agent Monitoring",
    "tags": ["genesis", "agents", "production"],
    "timezone": "browser",
    "panels": [
      {
        "id": 1,
        "title": "Active Agents",
        "type": "stat",
        "targets": [{
          "expr": "count(genesis_agent_active{status='running'})",
          "legendFormat": "Active Agents"
        }],
        "gridPos": {"h": 4, "w": 6, "x": 0, "y": 0}
      },
      {
        "id": 2,
        "title": "Task Success Rate",
        "type": "gauge",
        "targets": [{
          "expr": "rate(genesis_task_completed_total[5m]) / rate(genesis_task_started_total[5m]) * 100",
          "legendFormat": "Success %"
        }],
        "gridPos": {"h": 4, "w": 6, "x": 6, "y": 0}
      },
      {
        "id": 3,
        "title": "LLM Inference Latency (P95)",
        "type": "graph",
        "targets": [{
          "expr": "histogram_quantile(0.95, genesis_llm_inference_duration_seconds_bucket)",
          "legendFormat": "{{agent_name}}"
        }],
        "gridPos": {"h": 8, "w": 12, "x": 0, "y": 4}
      },
      {
        "id": 4,
        "title": "Business Generation Progress",
        "type": "table",
        "targets": [{
          "expr": "genesis_business_generation_status",
          "legendFormat": "{{business_name}} - {{status}}"
        }],
        "gridPos": {"h": 8, "w": 12, "x": 12, "y": 4}
      },
      {
        "id": 5,
        "title": "Error Rate by Agent",
        "type": "heatmap",
        "targets": [{
          "expr": "rate(genesis_agent_errors_total[5m])",
          "legendFormat": "{{agent_name}}"
        }],
        "gridPos": {"h": 8, "w": 24, "x": 0, "y": 12}
      }
    ],
    "refresh": "5s",
    "time": {"from": "now-1h", "to": "now"}
  }
}
```

### Import Dashboard

1. **Navigate:** Dashboards (📊) → Import
2. **Upload JSON file** OR paste JSON
3. **Select:** "Genesis Prometheus" as data source
4. **Click:** Import
5. **Expected:** Dashboard appears with 5 panels

---

## Step 5: Configure Alerts (10 minutes)

### Alert Rule 1: High Error Rate

1. **Navigate:** Alerting (🔔) → Alert rules → New alert rule
2. **Configure:**
   ```yaml
   Name: High Agent Error Rate
   Query: rate(genesis_agent_errors_total[5m]) > 0.1
   Condition: IS ABOVE 0.1
   For: 2m
   Annotations:
     summary: "Agent {{ $labels.agent_name }} has high error rate"
   ```
3. **Click:** Save

### Alert Rule 2: Business Generation Stalled

```yaml
Name: Business Generation Stalled
Query: increase(genesis_business_generation_status{status='in_progress'}[10m]) == 0
Condition: IS EQUAL 0
For: 5m
Annotations:
  summary: "Business generation hasn't progressed in 10 minutes"
```

### Alert Rule 3: LLM Inference Slow

```yaml
Name: Slow LLM Inference
Query: histogram_quantile(0.95, genesis_llm_inference_duration_seconds_bucket) > 5
Condition: IS ABOVE 5
For: 3m
Annotations:
  summary: "LLM inference P95 latency exceeds 5 seconds"
```

---

## Step 6: Create Business Generation Dashboard (8 minutes)

### Panel Configuration

**Panel 1: Business 1 Progress**
```yaml
Title: E-Commerce Store Progress
Type: Bar gauge
Query: genesis_business_1_completion_percentage
Range: 0-100
Color: Green gradient
```

**Panel 2: Business 2 Progress**
```yaml
Title: Content Platform Progress
Type: Bar gauge
Query: genesis_business_2_completion_percentage
Range: 0-100
Color: Blue gradient
```

**Panel 3: Business 3 Progress**
```yaml
Title: SaaS Product Progress
Type: Bar gauge
Query: genesis_business_3_completion_percentage
Range: 0-100
Color: Purple gradient
```

**Panel 4: Agent Activity Timeline**
```yaml
Title: Agent Activity (Last Hour)
Type: Timeline
Query: genesis_agent_task_duration_seconds
Group by: agent_name
```

---

## Step 7: Configure Notification Channels (Optional, 5 minutes)

### Slack Integration

1. **Navigate:** Alerting (🔔) → Contact points → New contact point
2. **Select:** Slack
3. **Configure:**
   ```yaml
   Name: Genesis Slack Alerts
   Webhook URL: [Your Slack webhook URL]
   Channel: #genesis-alerts
   ```
4. **Test:** Send test notification

### Email Integration

```yaml
Name: Genesis Email Alerts
Email addresses: your-email@example.com
SMTP settings: [Configure your SMTP server]
```

---

## Step 8: Verify Metrics Collection (5 minutes)

```bash
# Check Prometheus is scraping Genesis metrics
curl http://localhost:9090/api/v1/query?query=genesis_agent_active | jq

# Expected output:
{
  "status": "success",
  "data": {
    "result": [
      {"metric": {"agent_name": "qa_agent"}, "value": [timestamp, "1"]},
      {"metric": {"agent_name": "support_agent"}, "value": [timestamp, "1"]},
      ...
    ]
  }
}
```

---

## Complete Grafana Configuration Summary

**What You'll See:**

1. **Main Dashboard (http://localhost:3000/d/genesis-main)**
   - Active agents count
   - Task success rate (real-time)
   - LLM inference latency per agent
   - Business generation progress (3 businesses)
   - Error heatmap (detect failing agents)

2. **Business Dashboard (http://localhost:3000/d/genesis-business)**
   - 3 progress bars (0-100%)
   - Agent activity timeline
   - SE-Darwin evolution metrics
   - Cost tracking ($0 for local LLM)

3. **Alerts (Configured)**
   - High error rate (>10% errors/5min)
   - Business stalled (no progress 10min)
   - Slow inference (P95 >5sec)

**Refresh Rate:** 5 seconds (real-time monitoring)

---

## Troubleshooting

### Issue: Grafana can't connect to Prometheus

**Solution:**
```bash
# Check Prometheus is running
curl http://localhost:9090/-/healthy

# Check Grafana can reach Prometheus (from container)
docker exec -it grafana curl http://host.docker.internal:9090/-/healthy
```

### Issue: No metrics appearing

**Solution:**
```bash
# Verify Genesis is exporting metrics
curl http://localhost:8000/metrics | grep genesis_

# Check Prometheus scrape config
cat ~/prometheus/prometheus.yml
```

### Issue: Dashboard shows "No data"

**Solution:**
1. Verify data source is working (Configuration → Data Sources → Test)
2. Check time range (last 1 hour by default)
3. Run a test query in Explore tab

---

## Next Steps

✅ Grafana installed and configured  
✅ Genesis dashboard created  
✅ Alerts configured  
✅ Real-time monitoring ready

**Now:** Proceed to shadcn UI setup for frontend dashboard
**Timeline:** Ready for Friday business generation monitoring
