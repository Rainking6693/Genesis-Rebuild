# Monitoring & Uptime

This guide explains how to wire the production observability story for Genesis now that the dashboard consumes real metrics and the `/health` endpoints expose meaningful signals.

## Health Endpoints

- `GET /health` — aggregates environment sanity, recent autonomous activity, Prometheus readiness, and backlog depth. Returns HTTP 200 only when everything is green.
- `GET /ready` — identical payload to `/health`; intended for load balancers / uptime monitors.

Run the health service from the project root:

```bash
uvicorn infrastructure.health_check:app --host 0.0.0.0 --port 8080
```

Environment variables required for a clean health report:

- `GEMINI_API_KEY`
- `ANTHROPIC_API_KEY`
- `OPENAI_API_KEY`
- `GOOGLE_APPLICATION_CREDENTIALS_JSON`
- `PROMETHEUS_ENDPOINT` (optional but recommended)

## Observability Stack (Coolify, Netdata, Grafana, Prometheus, OTEL)

1. **Install Coolify** on the target VPS (root shell):
   ```bash
   curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash
   ```
   Complete the web bootstrap at `http://<vps-ip>:8000` (admin user + domain).

2. **Install Netdata** for node-level metrics:
   ```bash
   bash <(curl -SsL https://my-netdata.io/kickstart.sh)
   ```
   Default dashboard lives at `http://<vps-ip>:19999`.

3. **Deploy monitoring compose via Coolify**  
   Our root `docker-compose.yml` now ships with:
   - `otel-collector` (OTLP gRPC/HTTP receiver → Prometheus exporter)
   - `prometheus` (scrapes the collector + the new `/metrics` endpoint on `genesis-health`)
   - `grafana` (pre-provisioned Prometheus datasource and Genesis dashboard)
   - Core backing services (MongoDB, Redis, health API)

   In Coolify:
   - *Create Project → Add Resource → Docker Compose*.
   - Point to the repo (or paste the compose file) and deploy.
   - Populate secrets (`OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `GEMINI_API_KEY`, `GOOGLE_AI_STUDIO_KEY`, `GOOGLE_APPLICATION_CREDENTIALS_JSON`, etc.) via the resource’s **Environment** tab before hitting **Deploy**.
   - The `genesis-health` service now exposes Prometheus metrics at `http://genesis-health:8080/metrics`, so no host port binding is required.

4. **Expose dashboards**
   - Coolify → Services → Grafana → Domains → e.g. `https://grafana.<domain>`.
   - Add another generic service proxied to `http://localhost:19999` to publish Netdata (protect with basic auth).

5. **Instrument Genesis**
   - Ensure runtime exports `OTEL_ENABLED=true` and `OTEL_EXPORTER_OTLP_ENDPOINT=http://otel-collector:4317`.
   - The health check service now emits Prometheus metrics at `/metrics` (executive KPIs, agent stats, orchestration, safety and cost data). Prometheus scrapes this automatically via the `genesis-health` job in `monitoring/prometheus.yml`.
   - The orchestration, memory and evolution subsystems emit OTEL counters via `infrastructure/observability.py` and `infrastructure/*/metrics.py`, which flow through the collector.

6. **Build Grafana dashboards**
   - Grafana auto-provisions the `Genesis Observability` dashboard from `monitoring/grafana/provisioning/dashboards/json/genesis_observability.json` (panels for KPIs, agent performance, orchestration, evolution, safety, cost).
   - Update alerts once real data arrives (e.g., spending thresholds at $5/$15/$25 using `genesis_cost_current_usd`).
   - Additional dashboards can be dropped into the same `json/` folder; Grafana picks them up automatically.

7. **Netdata integration**
   - Under Coolify, create a *Generic Service* reverse proxy for Netdata.
   - Netdata auto-discovers Docker containers, providing CPU/RAM/disk views for Genesis pods.

8. **Optional staging**
   - Use Coolify’s *Clone* or *Redeploy* features to spin up staging vs production Compose stacks with separate environment sets.

## Alerting

Alerting is provisioned automatically through Grafana’s unified alerting engine. Populate the following environment variables in Coolify → Grafana → Environment to wire notification channels:

```
ALERT_SMS_WEBHOOK_URL     # Twilio/other SMS webhook endpoint
ALERT_SMS_AUTH_HEADER     # Optional bearer/basic header for the SMS webhook
ALERT_SLACK_CRITICAL_WEBHOOK
ALERT_SLACK_WARNING_WEBHOOK
ALERT_SLACK_INFO_WEBHOOK
GENESIS_MONTHLY_BUDGET_USD   # e.g. 5000
```

Then redeploy Grafana so it picks up the provisioning bundles:

```
docker compose up -d --force-recreate grafana
```

### What ships out-of-the-box

Critical (SMS + Slack):
1. Website Down – sustained 5xx responses (`Website Down - 5xx errors > 5m`)
2. Agent Crash Loop – restart storms detected via `kube_pod_container_status_restarts_total`
3. MongoDB Connection Lost – `up{job="genesis-mongodb"} == 0`
4. API Cost Spike – current spend >3× 24 h moving average
5. Security Breach – `genesis_security_critical_events_total` increments
6. Mass Churn Event – cancellations exceed 20 % of active customers in 24 h
7. Deployment Total Failure – no successful deploys in 30 m window

Warnings (Slack):
1. Monthly budget usage >80 %
2. API rate limit hit 10+ times/hour
3. Free tier utilisation >85 %
4. Deployment failures in the last 15 m
5. Revenue down 50 % vs 7‑day average
6. Agent success rate <70 %
7. Redis exporter reports instance down
8. Node memory pressure >80 %
9. Zero traffic for 24 h
10. Error rate >5 %

Info (Slack log channel):
1. Business hits $1 K monthly revenue
2. Traffic spike (>3× hourly baseline)
3. Growth milestone (+100 active customers in 7 d)
4. Normal operations heartbeat (success >90 %, errors <2 %)

Grafana folders:
- `Genesis Observability` dashboard (`monitoring/grafana/provisioning/dashboards/json/genesis_observability.json`)
- `Genesis Alerts` folder with Critical/Warning/Info rule files

### Step-by-step to verify alerts

1. **Set secrets**  
   In Coolify, open the Grafana service → Environment. Paste the Slack/Twilio webhook URLs and monthly budget variable listed above. Redeploy Grafana.

2. **Confirm contact points**  
   Log into Grafana → Alerting → Contact points. You should see:
   - `sms-critical`
   - `slack-critical`
   - `slack-warning`
   - `slack-info`

3. **Review notification policy**  
   Grafana → Alerting → Notification policies. Ensure severity routes map as:
   - `critical` → SMS + critical Slack channel
   - `warning` → warning Slack channel
   - `info` → info Slack channel

4. **Validate rules**  
   Grafana → Alerting → Alert rules (folder *Genesis Alerts*). You’ll see three groups (Critical, Warning, Informational). Each rule links to the PromQL expression described earlier.

5. **Test fire**  
   Use Prometheus UI or `promtool` to push sample series. Example to simulate a crash loop:
   ```
   docker exec -it prometheus promtool tsdb create-blocks-from openmetrics /tmp/test-block <<'OM'
   # TYPE kube_pod_container_status_restarts_total counter
   kube_pod_container_status_restarts_total{pod="agent-marketing-0"} 5
   OM
   ```
   Reload Prometheus, wait 1‑2 minutes, observe notification in Slack/SMS.

6. **Reset test data**  
   Remove the scratch block (`rm -rf /prometheus/synthetic*`) or restart Prometheus to clear test samples.

## UptimeRobot Automation
## UptimeRobot Automation

1. Populate `monitoring/health_endpoints.json` with the fully-qualified URLs for `/health`, `/ready`, and any auxiliary services (A2A, judge, etc.).
2. Export your API key: `export UPTIME_ROBOT_API_KEY=...`.
3. Dry-run to validate payloads:
   ```bash
   python scripts/setup_uptime_robot.py --dry-run
   ```
4. Execute for real (removes `--dry-run`). The script calls the UptimeRobot v2 API and prints the JSON response for each monitor.

**Note:** The script will raise if the API key is missing or if the config file is malformed, so CI/CD can gate on successful registration if desired.

## Prometheus scrape configuration

`monitoring/prometheus.yml` already includes the `genesis-health` job:

```yaml
scrape_configs:
  - job_name: otel-collector
    metrics_path: /metrics
    static_configs:
      - targets: [otel-collector:9464]

  - job_name: genesis-health
    metrics_path: /metrics
    static_configs:
      - targets: [genesis-health:8080]
```

If you add Netdata or other exporters, append additional jobs:

```yaml
  - job_name: netdata
    metrics_path: /api/v1/allmetrics
    params:
      format: [prometheus]
    static_configs:
      - targets: [host.docker.internal:19999]
```
