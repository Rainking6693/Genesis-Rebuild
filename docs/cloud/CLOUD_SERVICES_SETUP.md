---
title: Genesis Cloud Services Setup
description: Step-by-step guide for provisioning managed services for the cloud-native Genesis agent stack.
---

# Genesis Cloud Services Setup

Follow this playbook to provision every external dependency the Genesis agents need. The entire flow is beginner-friendly—stick to the order below and check off each verification step as you go.

> ✅ **Goal:** Run the Genesis agent pod anywhere (Windows, Linux, macOS, VPS) while keeping all stateful services in the cloud.  
> ⏱️ **Time:** ~45 minutes end-to-end.  
> 💰 **Cost:** $0/month on free tiers when running light workloads.

---

## 1. MongoDB Atlas (Managed Database)

### Sign up
1. Open <https://www.mongodb.com/cloud/atlas/register>.
2. Create a free account (Google, GitHub, or email login all work).
3. Choose the **Free Shared** plan when prompted.

### Create the Cluster
1. In the Atlas UI, click **Build a Database**.
2. Select:
   - **Plan:** Shared (Free) `M0`.
   - **Cloud Provider:** AWS (stable network + widest region coverage).
   - **Region:** `us-east-1` (or closest to your users).
3. Name the cluster `genesis-cluster`.
4. Click **Create Cluster** (provisioning takes ~2 minutes).

### Configure Network Access
1. In the left sidebar, open **Security → Network Access**.
2. Click **Add IP Address**.
3. Choose **Allow Access From Anywhere** and confirm (`0.0.0.0/0`).
   - You can tighten this later by adding specific office or VPS IPs.

### Create a Database User
1. Navigate to **Security → Database Access**.
2. Click **Add New Database User**.
3. Fill in:
   - **Username:** `genesis`.
   - **Password:** generate a strong password (e.g., via password manager).
   - **Database User Privileges:** Built-in Role → **Atlas admin** (needed for schema migrations).
4. Save the user.

> **Store the credentials:** You’ll need the username + password when filling in `genesis-cloud.env`.

### Grab the Connection String
1. Go back to the **Database** view.
2. Click the **Connect** button on your cluster.
3. Choose **Connect your application**.
4. Select:
   - **Driver:** `Python`.
   - **Version:** `3.12 or later`.
5. Copy the URI. It looks like:
   ```
   mongodb+srv://genesis:<PASSWORD>@genesis-cluster.abcd123.mongodb.net/?retryWrites=true&w=majority&appName=genesis-cluster
   ```
6. Replace `<PASSWORD>` with your real password and append `genesis` as the default database:
   ```
   mongodb+srv://genesis:MySuperStrongPass!@genesis-cluster.abcd123.mongodb.net/genesis?retryWrites=true&w=majority
   ```

### Verify Connectivity
Run this from any machine with Python 3.12+:

```bash
python - <<'PY'
from pymongo import MongoClient
import os

uri = os.getenv("MONGODB_URI", "mongodb+srv://genesis:MySuperStrongPass!@genesis-cluster.abcd123.mongodb.net/genesis?retryWrites=true&w=majority")
client = MongoClient(uri, tls=True, tlsAllowInvalidCertificates=False)
print(client.admin.command("ping"))
PY
```

You should see `{'ok': 1.0}`. If not, double-check IP allow list and credentials.

---

## 2. Upstash Redis (Serverless Redis)

### Sign up
1. Visit <https://upstash.com/login>.
2. Register using GitHub, Google, or email.

### Create a Redis Database
1. In the Upstash console, click **Create Database**.
2. Configure:
   - **Name:** `genesis-redis`.
   - **Type:** Redis.
   - **Region:** `us-east-1` (matches Atlas for low latency).
   - **Read Replicas:** Keep default (disabled).
   - **Eviction Policy:** `Volatile-LRU`.
3. Click **Create** (ready in seconds).

### Capture Credentials
On the database detail page, note:
- **REST URL** (not needed for normal Redis clients).
- **REDIS URL** – copy the standard connection string, which resembles:
  ```
  rediss://default:AKh8s9kLmnoPqRS_tUVwxYZ12345@us1-gentle-eel-36277.upstash.io:6379
  ```
Upstash auto-generates the strong password.

### Test the Connection
With `redis-py`:

```bash
python - <<'PY'
import os, redis
url = os.getenv("REDIS_URL", "rediss://default:AKh8s9kLmnoPqRS_tUVwxYZ12345@us1-gentle-eel-36277.upstash.io:6379")
client = redis.from_url(url, ssl=True)
client.set("genesis:test", "ok", ex=30)
print(client.get("genesis:test"))
PY
```

Expected output: `b'ok'`.

---

## 3. Grafana Cloud (Metrics & Dashboards)

### Sign up
1. Open <https://grafana.com/signup>.
2. Choose **Grafana Cloud** → Free tier.
3. Pick an organization name (e.g., `genesis-observability`).
4. Grafana provisions three services: Metrics (Prometheus), Logs (Loki), and Traces (Tempo). We mainly use the OTLP gateway for both metrics and traces.

### Collect Endpoints & Credentials
1. In the Grafana Cloud portal, open **Connections → Agent**.
2. On the **OTLP** tab, note:
   - **Endpoint:** `https://otlp-gateway-prod-us-east-0.grafana.net/otlp`
3. Click **Generate API Key**:
   - Name: `genesis-otel`.
   - Role: **MetricsPublisher** (covers both metrics + traces).
4. Copy the token that starts with `glc_...`—store securely.

### Import Dashboards
1. Log into Grafana (`https://<your-stack>.grafana.net`).
2. Go to **Dashboards → + Import**.
3. Recommended dashboard IDs to punch in:
   - `1860` – Kubernetes / Pod overview (adapts well to Podman stats via OTLP metadata).
   - `15172` – Redis monitoring (binds to Upstash metrics once routed).
   - `13187` – MongoDB overview (works with Atlas metrics if you connect MongoDB Atlas metrics integration later).
4. For each dashboard, select your Grafana Cloud Prometheus data source (likely `grafanacloud-<org>-prom`).

### Verify OTLP Ingestion
After you deploy the OpenTelemetry Collector:
1. Go to **Explore** in Grafana.
2. Choose the **Prometheus** data source.
3. Run the query `{service_name="genesis-agents"}` (will show once agents emit data).

---

## 4. Better Stack (Log Aggregation)

### Sign up
1. Visit <https://betterstack.com/signup>.
2. Choose **Logs** (free plan covers 1 GB/month).

### Create a Source
1. In the Better Stack dashboard, click **Add Source**.
2. Name it `genesis-agents`.
3. Select **HTTP** ingestion.
4. Copy the **Source token**—a string like `bt-logs-1-abc123def456`.

### Optional: Create a Dashboard
1. Inside the source, click **Dashboards → Create**.
2. Add widgets for:
   - Log volume (bar chart).
   - Error rate (query `level = "error"`).
   - Agent activity (query `agent_name:*`).

### Send a Test Log

```bash
curl -X POST \
  https://in.logs.betterstack.com/ingest \
  -H "Authorization: Bearer bt-logs-1-abc123def456" \
  -H "Content-Type: application/json" \
  -d '{"message":"Genesis logging pipeline online","level":"info","service":"genesis-main"}'
```

Within a few seconds you should see the log entry in the Better Stack UI.

---

## Final Checklist

| Service          | Action Completed? | Notes |
|------------------|-------------------|-------|
| MongoDB Atlas    | ☐ Cluster created, user added, URI verified | |
| Upstash Redis    | ☐ Database created, ping tested | |
| Grafana Cloud    | ☐ API key issued, dashboards imported | |
| Better Stack Logs| ☐ Source created, test log delivered | |

Once every box is ticked, populate `deploy/cloud/genesis-cloud.env` with the gathered values and continue to the pod + script setup.

