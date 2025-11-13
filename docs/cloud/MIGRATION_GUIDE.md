# Migration Guide: Localhost ➜ Cloud-Native Genesis

This handbook shows how to graduate an existing localhost Genesis deployment to the new cloud-native stack. The migration leaves your agents unchanged while moving every stateful dependency (database, cache, observability) into managed services.

---

## 1. Snapshot Current State

1. **Freeze agents:** Stop any running `docker compose` or `podman` sessions.
2. **Export MongoDB data:**
   ```bash
   mongodump --uri="mongodb://localhost:27017/genesis" --out=backup/genesis-$(date +%Y%m%d)
   ```
3. **Export Redis data (optional):**
   ```bash
   redis-cli --rdb backup/genesis-redis.rdb
   ```
4. Store both backups in version-controlled storage (private repo or encrypted archive).

---

## 2. Provision Cloud Services

Follow `CLOUD_SERVICES_SETUP.md` to create:
- MongoDB Atlas cluster (`M0`, username `genesis`)
- Upstash Redis database (serverless)
- Grafana Cloud stack (OTLP endpoint + API key)
- Better Stack log source (optional but recommended)

Record all connection strings inside `deploy/cloud/genesis-cloud.env`.

---

## 3. Import Data into Atlas

1. Unzip the MongoDB dump if needed.
2. Use `mongorestore`:
   ```bash
   mongorestore --uri="mongodb+srv://genesis:PASS@genesis-cluster.abcd123.mongodb.net/genesis?retryWrites=true&w=majority" backup/genesis-YYYYMMDD
   ```
3. Validate counts:
   ```bash
   python - <<'PY'
   from pymongo import MongoClient
   client = MongoClient("mongodb+srv://genesis:PASS@genesis-cluster.abcd123.mongodb.net/genesis")
   print(client.genesis["trajectories"].count_documents({}))
   PY
   ```

Redis exports are optional; if you want to preload keys, convert `genesis-redis.rdb` into `SET` commands and use Upstash's bulk import utility. Most workloads can start fresh since Redis holds transient state.

---

## 4. Update Environment Variables

1. Copy `deploy/cloud/genesis-cloud.env` to your runtime location (e.g., `%USERPROFILE%\genesis\.env` on Windows).
2. Replace existing `.env` or configuration files with the new values:
   - `MONGODB_URI`
   - `REDIS_URL`
   - `GRAFANA_OTLP_ENDPOINT`
   - `GRAFANA_API_KEY`
   - Any API keys that differ between environments
3. Remove references to `localhost`, `127.0.0.1`, `27017`, `6379`, or `3000`.

---

## 5. Deploy the Cloud Pod

1. Ensure Podman + kubectl are installed.
2. Run:
   ```powershell
   pwsh scripts/windows/setup-genesis-cloud.ps1
   ```
3. Wait for the script to report success. It will:
   - Verify Atlas/Upstash/Grafana credentials
   - Apply `deploy/cloud/genesis-pod-cloud.yaml`
   - Confirm the `genesis-system` pod is ready

---

## 6. Validate Connectivity

1. Execute the connectivity check:
   ```powershell
   pwsh scripts/windows/test-cloud-connections.ps1
   ```
2. Inspect pod health:
   ```bash
   kubectl get pod genesis-system -o wide
   ```
3. Tail logs for an agent:
   ```bash
   podman logs genesis-system-agent-builder
   ```
4. Visit Grafana Cloud → Explore. Query `{service_name="genesis-agents"}` to see live spans/metrics.
5. Check Better Stack for incoming log events.

---

## 7. Decommission Local Services

Once the cloud stack is stable for 48 hours:

1. Stop local containers:
   ```bash
   docker compose down
   podman pod stop genesis
   ```
2. Disable local services from autostart (systemd, services.msc, or Docker Desktop).
3. Archive or delete local MongoDB / Redis data directories.
4. Update documentation to emphasize the cloud-first workflow.

---

## 8. Ongoing Operations

- **Secrets management:** Store the cloud `.env` in a password manager or secret vault.
- **Scaling:** To scale agents on a VPS, reuse the same manifests and scripts—no code changes needed.
- **Incident response:** Grafana Cloud (metrics/traces) + Better Stack (logs) remain the single source of truth; no local dashboards to troubleshoot.

---

## FAQ

**Q:** *Can I still run a single agent locally for debugging?*  
**A:** Yes. As long as the agent's environment variables point to Atlas/Upstash, it can run outside the pod.

**Q:** *Do I need Prometheus or Grafana locally?*  
**A:** No. Every telemetry signal goes to Grafana Cloud via OTLP.

**Q:** *What about network restrictions?*  
**A:** Start with Atlas allowing `0.0.0.0/0`. Once you know your office IP or VPS static IP, tighten the allow list for additional security.

**Q:** *How do I roll back?*  
**A:** Restore the MongoDB dump to localhost, point `.env` back to localhost URIs, and start the old docker compose stack. Keep your backups for at least 30 days during the transition.

