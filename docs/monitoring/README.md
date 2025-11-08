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

## Prometheus & Grafana

1. Launch Prometheus (port `9090`) with the scrape config pointing at the Genesis metrics exporter (see `infrastructure/local_llm_metrics.py`).
2. Export `PROMETHEUS_ENDPOINT=http://localhost:9090` before starting `uvicorn` so the health check can probe readiness.
3. Point Grafana panels at the same Prometheus host; the Streamlit dashboard now reads real data and no longer displays seeded placeholder numbers.

## UptimeRobot Automation

1. Populate `monitoring/health_endpoints.json` with the fully-qualified URLs for `/health`, `/ready`, and any auxiliary services (A2A, judge, etc.).
2. Export your API key: `export UPTIME_ROBOT_API_KEY=...`.
3. Dry-run to validate payloads:
   ```bash
   python scripts/setup_uptime_robot.py --dry-run
   ```
4. Execute for real (removes `--dry-run`). The script calls the UptimeRobot v2 API and prints the JSON response for each monitor.

**Note:** The script will raise if the API key is missing or if the config file is malformed, so CI/CD can gate on successful registration if desired.
