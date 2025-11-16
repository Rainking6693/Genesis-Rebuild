# Payment Operational Playbook

This playbook describes the Genesis payment operations, monitoring, and safety guardrails.

## Approval Workflow
- All payment intents are evaluated by `GenesisMetaAgent` before execution.
- Intent decisions are persisted to `data/a2a-x402/approval_log.jsonl` for auditing.
- Approvals/denials are logged with metadata (`vendor`, `component`, `strategy`, `cost_usd`).
- Denied intents halt execution; approved intents proceed.

## Summaries
- After each business generation, `GenesisMetaAgent` writes spend summaries to `data/a2a-x402/spend_summaries.jsonl` and the summary is posted to `#genesis-dashboard` via `GenesisDiscord.payment_business_summary`.
- Weekly summaries are produced by `scripts/x402_weekly_report.py` (now operating on the new ledger) which aggregates the last 7 days of spend data.

## Vendor Capability Cache
- `infrastructure/payments/vendor_cache.py` stores pricing, tokens, chains, and capabilities per vendor in `data/a2a-x402/vendor_capabilities.json`.
- Cache entries refresh every 24 hours or when `PAYMENTS_USE_FAKE` toggles request.
- `MediaPaymentHelper` checks the cache before spending and persists metadata after each purchase.

## Staged Payments
- `PaymentManager` exposes `authorize`, `capture`, and `cancel` helpers backed by the A2A-x402 service.
- `DeployAgent` now uses these calls around long-running deployments (authorize before automation, capture after success, cancel on failure).

## Ledger Sync
- `data/a2a-x402/transactions/transactions.jsonl` stores every payment logged through `BusinessMonitor.log_payment`.
- `FinanceLedger` writes to `logs/finance_ledger.jsonl`.
- `scripts/x402_daily_ledger_sync.py` runs nightly to reconcile both sources and alert via Discord on discrepancies.

## Monitoring & Alerts
- Prometheus exporter: `scripts/x402_prometheus_exporter.py` (port default `9100`) exposes:
  * `payments_total` counter (`agent`, `vendor`, `chain`, `status`)
  * `payment_spend_usd` counter (`agent`, `vendor`)
  * `payment_wallet_balance` gauge per agent
  * `payment_vendor_failure_streak` gauge to capture repeated failures
  * `payment_stale_authorizations` gauge for pending authorizations
- `scripts/x402_monitor_alerts.py` runs hourly to:
  * Alert when wallet balances drop below 50 USDC.
  * Alert when 5+ consecutive failures happen per vendor.
- `scripts/x402_stale_payments.py` checks `data/a2a-x402/transactions/transactions.jsonl` for stale authorizations (>15 min) and posts alerts.
- All alert scripts respect `PAYMENTS_USE_FAKE=true` to avoid hitting real Discord webhooks during testing.

## Ledger & Monitoring Jobs
- Schedule `scripts/x402_prometheus_exporter.py` as a background service (e.g., via systemd, Docker sidecar, or `python -m scripts.x402_prometheus_exporter`).
- Cron jobs:
  * `0 * * * * python scripts/x402_monitor_alerts.py`
  * `0 * * * * python scripts/x402_stale_payments.py`
  * `0 3 * * * python scripts/x402_daily_ledger_sync.py`
  * `0 4 * * 1 python scripts/x402_weekly_report.py`

## Testing & Verification
- Unit tests exist for vendor cache, staged payments, and the monitor scripts. Run `./venv/bin/python -m pytest tests/test_x402_*` when updating.
- For Discord/HopX smoke tests, set `PAYMENTS_USE_FAKE=true` to prevent hitting production webhooks.

## Documentation
- Add new scripts to `CLAUDE.md` and update the runbooks to mention the new cron jobs.
