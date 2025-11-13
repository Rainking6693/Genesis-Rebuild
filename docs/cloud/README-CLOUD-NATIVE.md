# Genesis Cloud-Native Deployment

> “The best infrastructure is invisible infrastructure.”  
> This guide keeps databases, caches, and dashboards in the cloud so your local machine only runs stateless agents.

---

## Why Cloud-Native?

- **Zero localhost clutter:** No ports 27017/6379/3000 running on your laptop.
- **Prod parity:** The exact same configuration works on any VPS or workstation.
- **Resilience:** Managed backups, automatic failover, and TLS everywhere.
- **Focus:** Spend time on agents and businesses, not database babysitting.

---

## Architecture Overview

```
Windows / Linux / macOS Host
└── Podman Pod: genesis-system
    ├── genesis-main (orchestrator)
    ├── 25 specialized agents
    └── otel-collector (OTLP -> Grafana Cloud)

External Services (managed, TLS):
    MongoDB Atlas  – durable memory
    Upstash Redis  – messaging + cache
    Grafana Cloud  – metrics, traces, dashboards
    Better Stack   – log aggregation
```

All connections use HTTPS/TLS. No inbound ports are required on the host; outbound 443 is enough.

---

## Getting Started (TL;DR)

1. **Provision cloud services:** Follow `CLOUD_SERVICES_SETUP.md`.
2. **Fill environment file:** Edit `deploy/cloud/genesis-cloud.env` with your real credentials.
3. **Launch pod:**  
   ```powershell
   pwsh scripts/windows/setup-genesis-cloud.ps1
   ```
4. **Verify:**  
   ```powershell
   pwsh scripts/windows/test-cloud-connections.ps1
   ```
5. **Monitor:** Log into Grafana Cloud + Better Stack to watch agents in real time.

That’s it. One script, one dashboard, no local databases.

---

## Files You’ll Use

| File | Purpose |
|------|---------|
| `docs/cloud/CLOUD_SERVICES_SETUP.md` | Signup + configuration steps for Atlas, Upstash, Grafana, Better Stack |
| `deploy/cloud/genesis-cloud.env` | Canonical environment template (rename + populate for runtime) |
| `deploy/cloud/genesis-pod-cloud.yaml` | Pod manifest with orchestrator, 25 agents, OTLP sidecar, ConfigMap |
| `deploy/cloud/otel-config-cloud.yaml` | OpenTelemetry Collector config pointing to Grafana Cloud |
| `scripts/windows/setup-genesis-cloud.ps1` | End-to-end bootstrap script (prereqs, validation, deploy) |
| `scripts/windows/test-cloud-connections.ps1` | Connectivity smoke test |
| `infrastructure/examples/agent-cloud-instrumentation.py` | Reference implementation for connecting agents to cloud services |
| `docs/cloud/MIGRATION_GUIDE.md` | Steps to migrate from localhost docker compose |
| `docs/cloud/COST_CALCULATOR.md` | Quick pricing playbook |

---

## Troubleshooting

| Symptom | Likely Cause | Fix |
|---------|--------------|-----|
| `kubectl wait` times out | Podman Kubernetes API not running | Start Podman, ensure `podman machine start` |
| Mongo ping fails | Atlas IP whitelist missing host | Add your IP or `0.0.0.0/0` temporarily |
| Redis TLS error | Using `redis://` without `rediss://` | Ensure Upstash URI uses `rediss://` |
| Grafana rejects OTLP | Wrong API key scope | Re-issue Grafana Cloud API key with MetricsPublisher role |
| Better Stack shows no logs | Token missing or script not run | Set `BETTERSTACK_SOURCE_TOKEN` and restart agents |

---

## Scaling

- **Vertical:** Increase Podman pod resources (`memory`, `cpu` limits) or move to a beefier VPS.
- **Horizontal:** Duplicate pods (e.g., `genesis-system-2`) pointing to the same cloud services; use Redis streams for coordination.
- **Observability:** Add service-specific dashboards by importing more Grafana IDs or building custom panels.
- **Automation:** Integrate setup scripts into GitHub Actions or self-hosted runners to spin up ephemeral environments.

---

## Security Checklist

- Rotate API keys every 90 days; store them in Vault or 1Password.
- Replace the Atlas IP allow list with VPN or static production IPs once stable.
- Enable 2FA on every vendor portal (Atlas, Upstash, Grafana, Better Stack).
- Audit `genesis-cloud.env` access—treat it like other production secrets.

---

## FAQ

**Do I need Docker Desktop?**  
No. Podman + Podman Desktop provide a lighter, rootless experience on Windows.

**Can this run on Kubernetes proper?**  
Yes. `genesis-pod-cloud.yaml` is valid Kubernetes YAML; apply it to any cluster (`kubectl apply -f ...`).

**What about network egress costs?**  
MongoDB Atlas and Upstash include moderate egress in free tiers. Heavy data exports may incur fees—monitor vendor dashboards.

**How do I add more agents?**  
Clone one of the agent container blocks in `genesis-pod-cloud.yaml`, update `name`, `command`, and `SERVICE_ROLE`, then reapply.

---

## Ready to Move?

1. Walk through the migration guide.
2. Run `setup-genesis-cloud.ps1`.
3. Watch Grafana light up with live metrics.

Invisible infrastructure achieved. 🎯

