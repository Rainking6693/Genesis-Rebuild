# OmniDaemon Worker Crash Runbook

## Detection

- Monitor `omnidaemon health` for worker heartbeat failures.
- Alert when `omnidaemon` reports fewer running workers than expected.
- Check systemd logs: `journalctl -u omnidaemon-genesis.service` for repeated crashes.

## Recovery

1. Restart crashed worker(s) immediately:
   ```bash
   scripts/start_omnidaemon_workers.sh 1
   ```
2. Inspect `logs/omnidaemon_worker_X.log` for stack traces/fan-out errors.
3. If worker keeps failing, drain queue by pausing incoming tasks (`omnidaemon pause`) before restarting.
4. After recovery, run `scripts/monitor_omnidaemon.sh` for a few minutes to confirm stability.

## Post-Mortem

- Capture failure marker, stack trace, and `last_processed_task` from worker log.
- Determine whether resource exhaustion (CPU, GPU, memory) or dependency (Redis) caused crash.
- Check new `logs/omnidaemon_worker_${i}.log` for `Killed` or `OutOfMemoryError`.
- Document root cause in `docs/runbooks/omnidaemon_worker_crash.md` for future reference.
