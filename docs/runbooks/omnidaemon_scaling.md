# OmniDaemon Scaling Runbook

## When to Scale

- Monitor worker utilization via `omnidaemon metrics --topic genesis.meta.orchestrate`.
- Scale up when worker throughput falls below expected levels despite low queue depth.
- If latency spikes above 100ms for task submission, add capacity.

## How to Add Workers

1. Update `config/omnidaemon.yaml` if additional worker configuration is needed.
2. Run:
   ```bash
   scripts/start_omnidaemon_workers.sh 5
   ```
3. Watch `logs/omnidaemon_worker_*` for warm-up logs and confirm `omnidaemon health` shows the new workers.
4. Adjust systemd service `deploy/omnidaemon-genesis.service` to include `--worker-count` argument when necessary.

## Load Balancing Verification

- Trigger `scripts/load_test_omnidaemon.py` with 10 workers and compare throughput to baseline.
- Run `scripts/monitor_omnidaemon.sh` to see worker stats stabilize.
- Update runbook with measured throughput per worker count for future scaling decisions.
