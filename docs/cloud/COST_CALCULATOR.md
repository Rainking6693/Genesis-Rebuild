# Genesis Cloud Stack Cost Calculator

Use this cheat sheet to estimate monthly spend as you scale from hobby projects to production fleets. All prices are USD and based on public rate cards (November 2025). Always double-check the vendors’ pricing pages before committing.

---

## Baseline Assumptions

- Agents generate an average of **3 GB logs/month** at 100 businesses.
- Each business stores **10 MB** of structured data in MongoDB.
- Redis handles **25,000 commands/day** by 100 businesses.
- Metrics/traces ingestion roughly **1.5 million samples/day** at scale.

---

## Quick Reference Table

| Tier | Businesses | MongoDB Atlas | Upstash Redis | Grafana Cloud | Better Stack Logs | Total |
|------|------------|----------------|---------------|---------------|-------------------|-------|
| Dev  | 1          | $0 (M0)        | $0 (free)     | $0 (free)     | $0 (1 GB)         | **$0** |
| Team | 10         | $0 (M0)        | $0 (free)     | $0 (free)     | $7 (3 GB)         | **$7** |
| Pro  | 50         | $9 (M2)        | $10 (Standard)| $8 (100GB)    | $15 (5 GB)        | **$42** |
| Scale| 100        | $25 (M30)      | $25 (Plus)    | $18 (200GB)   | $29 (10 GB)       | **$97** |

---

## Component Breakdown

### MongoDB Atlas
- **Free tier (M0)**: 512 MB storage, shared cluster, 100 max connections.
- **When to upgrade:** sustained usage above 500 MB or >100 connections → move to **M2 ($9/mo)** or **M5 ($25/mo)**.
- **Backup costs:** daily snapshots included in paid tiers; no additional fees for basic usage.

### Upstash Redis
- **Serverless free tier:** 10,000 commands/day, 256 MB data, TLS included.
- **Standard plan ($10/mo):** 100,000 commands/day, 512 MB data.
- **Plus plan ($25/mo):** 1,000,000 commands/day, 1 GB data.
- Billing is usage-based—idle time is free.

### Grafana Cloud
- Free stack includes:
  - 10,000 metrics series
  - 50 GB logs
  - 50 GB traces
- Upgrades (per 2025 pricing):
  - +$8/mo for 100 GB metrics.
  - +$10/mo for 100 GB traces.
  - +$25/mo for 100 GB logs.
- For the Genesis stack, metrics+traces are the main drivers; logs often remain below 10 GB if you rely on Better Stack.

### Better Stack Logs
- Free tier: 1 GB logs/month, 30-day retention.
- Paid tiers scale by ingestion volume:
  - **Startup ($7/mo):** 3 GB.
  - **Growth ($15/mo):** 5 GB.
  - **Scale ($29/mo):** 10 GB.

---

## Cost Projection Worksheet

Fill in your own estimations:

```text
Businesses: ____________
Avg Mongo data/business (MB): ____________
Redis commands/day/business: ____________
Log volume/business/month (GB): ____________
```

1. **MongoDB required storage**  
   `Businesses × Avg data` → compare with Atlas tiers (512 MB, 2 GB, 10 GB, etc.).

2. **Redis commands/day**  
   `Businesses × commands` → match to Upstash tier (10k, 100k, 1M).

3. **Logs volume**  
   Determine if Better Stack free tier suffices; otherwise pick a paid plan.

4. **Metrics ingestion**  
   Agents emit roughly 60 metrics/minute each.  
   `Businesses × Agents × 60 × 1440` ≈ daily samples.  
   Compare with Grafana free quota (10k series) or paid add-ons.

---

## Optimization Tips

- **TTL everything in Redis.** Upstash charges per command, so avoid chatty polling.
- **Prune MongoDB history.** Use TTL indexes on transient collections (e.g., job queue events).
- **Sample telemetry.** The OpenTelemetry Collector can downsample metrics to stay inside free tier.
- **Streamline logs.** Ship only structured JSON with severity levels; filter debug noise before sending to Better Stack.
- **Set spend alerts.** Grafana Cloud and Upstash both support usage webhooks—route them into Alertmanager or email.

---

## Example: 250 Businesses

1. **MongoDB:** 250 × 10 MB = 2.5 GB → Atlas `M30` ($25/mo).
2. **Redis:** 250 × 250 commands/day = 62,500 → Upstash `Standard` ($10/mo).
3. **Grafana:** ~15M metrics samples/day → need +200 GB metrics add-on ~$18/mo.
4. **Better Stack:** 7500 MB logs/month → `Scale` plan $29/mo.

**Estimated total:** `$25 + $10 + $18 + $29 = $82/month`.

Still far cheaper than self-hosting once you factor ops time and cloud egress.

---

## Next Steps

1. Monitor free-tier dashboards weekly.
2. Automate cost reports via vendor APIs.
3. Re-run this calculator whenever you onboard a large customer or add new agents.

