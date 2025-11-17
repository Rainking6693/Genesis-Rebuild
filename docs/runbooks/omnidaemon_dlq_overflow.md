# OmniDaemon DLQ Overflow Runbook

## Detection

- Monitor `omnidaemon dlq` depth via `omnidaemon metrics --topic genesis.build`.
- Alert when DLQ depth > 10 or rising faster than processed tasks.
- Watch `logs/business_generation/events.jsonl` for repeated failure events.

## Recovery

1. Inspect failing tasks via:
   ```bash
   omnidaemon dlq tail genesis.build
   ```
2. Identify common failure reasons (missing dependencies, validation errors).
3. Fix the root issue, then requeue:
   ```bash
   omnidaemon dlq retry --topic genesis.build --count 5
   ```
4. If failures persist, move problematic tasks to a quarantine topic for manual review:
   ```bash
   omnidaemon dlq move --topic genesis.build --target genesis.build.quarantine
   ```

## Prevention & Analysis

- Ensure evaluation scripts (SE-Darwin, DreamGym) log structured errors.
- Feed failure cases into `scripts/omnidaemon_casebank_ingest.py` for future recall.
- Document recurring failure patterns in `docs/runbooks/omnidaemon_dlq_overflow.md`.
