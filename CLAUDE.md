## Payment Monitoring & Ledger Updates

- Added `scripts/x402_monitor_alerts.py` to check wallet balances and vendor failure streaks hourly; use `PAYMENTS_USE_FAKE=true` to avoid Discord alerting during tests.
- Added `scripts/x402_stale_payments.py` to detect stalled authorizations and notify `@engineering`.
- Added `scripts/x402_daily_ledger_sync.py` for nightly reconciliation between `data/a2a-x402/transactions/transactions.jsonl` and `logs/finance_ledger.jsonl`.
- Added `scripts/x402_weekly_report.py` to aggregate spend summaries (stored in `data/a2a-x402/spend_summaries.jsonl`) and post to Discord weekly.
- Added `scripts/x402_prometheus_exporter.py` plus `monitoring/payment_metrics.py` to expose Prom counters (`payments_total`, `payment_spend_usd`) and gauges.
