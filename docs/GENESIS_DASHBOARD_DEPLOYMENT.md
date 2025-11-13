# Genesis Dashboard Deployment Guide

This document explains how to generate the executive metrics payload, ship the
static dashboard assets, and keep the public PythonAnywhere deployment in sync
with the live Genesis run logs.

## Overview

The dashboard is a static site backed by the existing
`infrastructure.health_check.HealthCheckService` metrics builders. A helper
script exports the latest JSON payload and a deployment script uploads
`index.html`, `style.css`, `dashboard.js`, and `dashboard-data.json` to the
PythonAnywhere account (`rainking632`). The PythonAnywhere webapp is configured
as a static site so you can access the telemetry via a regular browser without
SSH.

Live URL: **https://rainking632.pythonanywhere.com/**

## Prerequisites

1. Ensure the Genesis autonomous loop is running so the log files contain fresh
   events (`logs/business_generation/events.jsonl`, `logs/infrastructure.log`,
   etc.).
2. Activate the local virtual environment (`source ./venv/bin/activate` in the
   repo root).
3. Export the PythonAnywhere credentials (or rely on the defaults baked into
   the deployment script):

   ```bash
   export PYTHONANYWHERE_USERNAME=rainking632
   export PYTHONANYWHERE_TOKEN=d96e5e35ee2070fd3d41f83ddb856859a7f4ea7d
   ```

## 1. Generate the Metrics Snapshot

The dashboard consumes a JSON snapshot that mirrors the `/metrics/dashboard`
FastAPI endpoint. Regenerate it any time you want to refresh the public site:

```bash
./venv/bin/python scripts/export_dashboard_metrics.py
```

This writes `monitoring/dashboard_static/dashboard-data.json` (git-ignored).
The exporter uses the same business-generation logs as the Streamlit dashboard,
and now includes the expanded sections (executive KPIs, agent latency/cost,
orchestration, SE-Darwin/ATLAS, safety/oversight, and cost-optimization).

## 2. Deploy to PythonAnywhere

The deployment helper uploads the four static assets and reloads the webapp. It
will create the webapp and static mapping automatically if they do not exist.

```bash
./venv/bin/python scripts/deploy_pythonanywhere_dashboard.py
```

Flags:

- `--assets` – change the local asset directory (defaults to
  `monitoring/dashboard_static`).
- `--remote-dir` – change the remote directory (defaults to
  `/home/<user>/genesis_dashboard`).
- `--upload-only` – skip webapp creation/reload if you just want to push files.

### What the script does

1. Uploads `index.html`, `style.css`, `dashboard.js`, `dashboard-data.json` to
   the remote directory via the PythonAnywhere Files API.
2. Ensures the `rainking632.pythonanywhere.com` webapp exists (Python 3.12).
3. Creates a static mapping from `/` → `/home/<user>/genesis_dashboard`.
4. Reloads the webapp so the new files are served immediately.

You can verify the deployment with:

```bash
curl -I https://rainking632.pythonanywhere.com/
curl -s https://rainking632.pythonanywhere.com/dashboard-data.json | jq .
```

## 3. Keeping the Dashboard Fresh

- Re-run `scripts/export_dashboard_metrics.py` whenever new activity has been
  logged.
- Re-run the deployment script to push the refreshed JSON/HTML/CSS/JS bundle.
- The site is static, so consider scheduling a cron or always-on task (see
  `scripts/deploy_pythonanywhere_dashboard.py --help`) if you want automatic
  hourly refreshes. The script is idempotent and safe to run repeatedly.

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| `RuntimeError ... files/path` | Ensure the API token is valid and has not been regenerated. |
| Dashboard shows stale data | Re-run the exporter, then redeploy. |
| `403 Forbidden` when opening the site | Confirm the domain is enabled in the PythonAnywhere dashboard. |
| Charts empty | Check that the log files exist locally (`logs/business_generation/events.jsonl`) before exporting. |

---

Maintainer: Codex (Genesis dashboard task force) – update this guide if the
deployment target or credentials change.
