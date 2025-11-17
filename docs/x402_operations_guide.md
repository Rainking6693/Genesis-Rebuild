# x402 Operations Guide

This guide provides operational procedures for managing the Genesis x402 payment system in production.

## Table of Contents
1. [Wallet Management](#wallet-management)
2. [Budget Management](#budget-management)
3. [Payment Monitoring](#payment-monitoring)
4. [Ledger & Reconciliation](#ledger--reconciliation)
5. [Alerts & Notifications](#alerts--notifications)
6. [Troubleshooting](#troubleshooting)

## Wallet Management

### How to Fund Wallet

The production wallet must be funded with USDC on the Base network.

1. **Get wallet address:**
   ```bash
   python -c "import os; print(os.getenv('X402_WALLET_ADDRESS'))"
   ```

2. **Fund via Coinbase Wallet:**
   - Open Coinbase Wallet
   - Send USDC to the wallet address (ensure Base network is selected)
   - Wait for transaction confirmation (typically 2-3 blocks)

3. **Verify funding:**
   ```bash
   python -c "from infrastructure.payments.wallet_manager import WalletManager; print(WalletManager().get_balance())"
   ```

### How to Check Wallet Balance

**Real-time check:**
```bash
python scripts/x402_monitor_alerts.py
```

**Via dashboard:**
- Open Grafana at `http://localhost:3000`
- View "Payment Wallet Balance" gauge
- Check per-agent balance in dashboard

**Via API (if exposed):**
```bash
curl http://localhost:8000/api/payments/wallet-balance
```

### Wallet Security Best Practices

1. **Use hardware wallet** (Ledger/Trezor) for production
2. **Store private key** in secrets manager, NOT in .env file
3. **Enable key rotation** quarterly
4. **Monitor for unauthorized activity** (run `x402_monitor_alerts.py` hourly)
5. **Set up alerts** for low balance (<$50)

## Budget Management

### How to View Agent Budgets

**Check current usage:**
```bash
python -c "
from infrastructure.payments.budget_tracker import BudgetTracker
tracker = BudgetTracker()
for agent in ['builder_agent', 'research_agent', 'code_review_agent']:
    usage = tracker.get_usage(agent)
    print(f'{agent}: {usage}')
"
```

**View via Grafana:**
- Open Grafana dashboard
- Panel: "Budget Utilization by Agent"
- Shows real-time usage vs limits

### How to Adjust Budget Limits

Budget limits are controlled via environment variables. Update your `.env` file or deployment configuration:

**Format:**
```
X402_{AGENT_NAME}_{LIMIT_TYPE}_USDC={VALUE}
```

**Example:**
```bash
# Set builder_agent daily limit to $150
export X402_BUILDER_AGENT_DAILY_LIMIT_USDC=150.0

# Set research_agent per-transaction limit to $5
export X402_RESEARCH_AGENT_PER_TRANSACTION_MAX_USDC=5.0

# Set code_review_agent monthly limit to $2000
export X402_CODE_REVIEW_AGENT_MONTHLY_LIMIT_USDC=2000.0
```

**Default limits (if not specified):**
- Daily limit: $100
- Monthly limit: $1000
- Per-transaction limit: $10

**To apply changes:**
1. Update environment variables
2. Restart Genesis process: `systemctl restart genesis`
3. Verify via `x402_monitor_alerts.py`

### How to Handle Budget Exhaustion

**If agent hits daily limit:**
1. Check actual spend: `tracker.get_usage(agent_name)`
2. Review transactions: Filter ledger by agent and date
3. Increase daily limit if justified
4. Monitor for abuse or unusual patterns

**If agent hits monthly limit:**
1. File ticket to adjust monthly budget (requires approval)
2. Provide justification based on historical spend
3. Once approved, update environment and restart

## Payment Monitoring

### Viewing Payment Transactions

**Check recent payments:**
```bash
# Last 10 payments
python -c "
from infrastructure.payments.payment_ledger import PaymentLedger
ledger = PaymentLedger()
for tx in list(ledger.read_transactions())[-10:]:
    print(f\"{tx['transaction_id']}: {tx['agent_id']} -> {tx['vendor']} ({tx['price_usdc']} USDC)\")
"
```

**Filter by agent:**
```bash
python -c "
from infrastructure.payments.payment_ledger import PaymentLedger
ledger = PaymentLedger()
for tx in ledger.get_agent_transactions('builder_agent'):
    print(f\"{tx['timestamp']}: {tx['price_usdc']} USDC - {tx['status']}\")
"
```

**Filter by date:**
```bash
python -c "
from infrastructure.payments.payment_ledger import PaymentLedger
ledger = PaymentLedger()
total = ledger.get_daily_total('2025-11-16')
print(f'Total spend on 2025-11-16: \${total:.2f}')
"
```

### Payment Success Rate

**View in Grafana:**
- Panel: "Payment Success Rate (%)"
- Shows 5-minute rolling average
- Alert triggers at <95% success rate

**Calculate manually:**
```bash
python -c "
from infrastructure.payments.payment_ledger import PaymentLedger
ledger = PaymentLedger()
all_txs = list(ledger.read_transactions())
completed = sum(1 for tx in all_txs if tx['status'] == 'completed')
print(f'Success rate: {completed}/{len(all_txs)} = {100*completed/len(all_txs):.1f}%')
"
```

### Payment Latency

**View in Grafana:**
- Panel: "Payment Latency (p50, p95, p99)"
- Shows distribution of payment completion times
- Typical: p50 <2s, p99 <10s

## Ledger & Reconciliation

### Running Reconciliation Manually

**Check blockchain reconciliation:**
```bash
python scripts/reconcile_x402_ledger.py
```

**Output:**
- Report saved to `data/a2a-x402/reconciliation_reports/`
- Checks for:
  - Missing blockchain hashes
  - Amount mismatches (>5%)
  - Transaction discrepancies
- Status: PASS/FAIL

**Dry-run (no report saved):**
```bash
python scripts/reconcile_x402_ledger.py --dry-run
```

### Running Budget Audit Manually

**Run comprehensive budget audit:**
```bash
python scripts/audit_x402_budgets.py
```

**Report includes:**
- Ledger vs budget consistency
- Budget overrun detection
- Daily/monthly rollup accuracy
- Data integrity checks
- Spending anomalies

**Output:** `data/a2a-x402/audit_reports/audit_{timestamp}.json`

### Reviewing Ledger Files

**Transactions ledger:**
- Location: `data/a2a-x402/transactions/transactions.jsonl`
- Format: One JSON transaction per line
- Fields: transaction_id, timestamp, agent_id, price_usdc, status, blockchain_tx_hash, etc.

**View sample transactions:**
```bash
head -5 data/a2a-x402/transactions/transactions.jsonl | python -m json.tool
```

**Search for specific transaction:**
```bash
grep "tx_12345" data/a2a-x402/transactions/transactions.jsonl | python -m json.tool
```

### Reconciliation Schedule

**Automated jobs:**
- Daily sync: 3 AM UTC (`scripts/x402_daily_ledger_sync.py`)
- Weekly report: 4 AM UTC Monday (`scripts/x402_weekly_report.py`)
- Blockchain reconciliation: Scheduled as needed (`scripts/reconcile_x402_ledger.py`)
- Budget audit: Scheduled weekly (`scripts/audit_x402_budgets.py`)

**View cron jobs:**
```bash
crontab -l | grep x402
```

## Alerts & Notifications

### Configured Alerts

**Critical alerts (immediate notification):**
1. Wallet balance <$50
2. Payment failure rate >5%
3. Budget exhausted
4. Vendor failure streak (5+ consecutive failures)

**Warning alerts (daily digest):**
1. Vendor failure streak (3+ failures)
2. High retry rate (>10%)
3. Unusual spending patterns

### Interpreting Discord Alerts

**Wallet Low Balance:**
```
⚠️ Payment Wallet Balance Low
Current: $25.50
Threshold: $50.00
Action: Fund wallet immediately
```

**High Payment Failure Rate:**
```
❌ Payment Failure Rate High
Current: 8.5% (threshold: 5%)
Failed: 5 payments in last 5 minutes
Action: Check logs and service status
```

**Budget Alert:**
```
💰 Agent Budget Alert
Agent: builder_agent
Used: 95% of daily budget ($95/$100)
Remaining: $5.00
```

### Configuring Alert Thresholds

Edit `infrastructure/payments/budget_enforcer.py` for budget enforcement:
```python
# Hard limit - payments will be rejected
HARD_LIMIT = 10.0  # Per transaction in USDC

# Alert thresholds
ALERT_DAILY_80 = 80    # Alert at 80% of daily
ALERT_DAILY_90 = 90    # Alert at 90% of daily
ALERT_DAILY_95 = 95    # Alert at 95% of daily
```

Or set via environment:
```bash
export X402_ALERT_THRESHOLD_PCT=80  # Alert at 80%
```

## Troubleshooting

### Payment Failures

**Step 1: Check payment status**
```bash
python -c "
from infrastructure.payments.payment_ledger import PaymentLedger
ledger = PaymentLedger()
tx = ledger.get_transaction('tx_id_here')
print(f'Status: {tx[\"status\"]}')
print(f'Error: {tx.get(\"error\", \"None\")}')
"
```

**Step 2: Check wallet balance**
```bash
python scripts/x402_monitor_alerts.py
# Look for: "Wallet balance: $XX.XX"
```

**Step 3: Check budget**
```bash
python -c "
from infrastructure.payments.budget_tracker import BudgetTracker
tracker = BudgetTracker()
usage = tracker.get_usage('agent_name')
print(f'Daily: {usage[\"daily\"]}/{usage[\"daily_limit\"]}')
print(f'Monthly: {usage[\"monthly\"]}/{usage[\"monthly_limit\"]}')
"
```

**Step 4: Check logs**
```bash
# Recent Genesis logs
tail -100 logs/genesis.log | grep -i "payment\|error"

# A2A-x402 service logs
tail -50 logs/a2a_x402.log
```

**Common causes:**
- Wallet balance too low
- Daily/monthly budget exceeded
- Network connectivity issues (retry logic should handle)
- Service temporarily unavailable

### High Retry Rates

**Check retry metrics:**
```bash
curl http://localhost:9100/metrics | grep retry_
```

**If rate >10%:**
1. Check network connectivity
2. Check A2A-x402 facilitator status
3. Review error logs for patterns
4. Consider increasing retry delays (Phase 10 optimization)

### Discrepancies in Reconciliation

**If reconciliation fails:**
1. Run audit: `python scripts/audit_x402_budgets.py`
2. Check for orphaned transactions
3. Verify blockchain transaction hashes
4. Contact engineering if issues persist

### Stale Payments

**Check for stale authorizations:**
```bash
python scripts/x402_stale_payments.py
```

**If stale payments detected:**
1. Review authorization timeout settings
2. Check network logs for dropped packets
3. Consider decreasing timeout threshold
4. Manually capture/cancel if necessary

### Dashboard Not Showing Data

**Prometheus not working:**
```bash
# Check if Prometheus is running
curl http://localhost:9090/-/healthy

# Check metrics endpoint
curl http://localhost:9100/metrics
```

**Grafana not showing panels:**
1. Verify Prometheus data source is configured
2. Check time range selector
3. Verify metrics are being scraped (Prometheus admin UI)
4. Check dashboard JSON for correct metric names

## Emergency Procedures

### Pause All Payments (Emergency Kill Switch)

```bash
# Set environment variable to block all payments
export X402_PAYMENTS_DISABLED=true

# Restart Genesis
systemctl restart genesis

# Verify (this should fail)
python -c "from infrastructure.payments.a2a_x402_service import A2AX402Service; A2AX402Service().pay_for_service(1.0, 'USDC', 'test')"
```

### Rotate Wallet Keys

1. Generate new wallet (hardware wallet)
2. Update `X402_WALLET_ADDRESS` in secrets manager
3. Update private key reference
4. Test with small payment
5. Monitor for issues
6. Deprecate old wallet

### Full System Rollback

```bash
# Stop Genesis
systemctl stop genesis

# Restore from backup
rsync -av ~/genesis-backups/latest-x402-backup/ /var/genesis/

# Restore database backup
pg_restore -d genesis_db ~/genesis-backups/latest.backup

# Restart
systemctl start genesis

# Verify
python scripts/x402_monitor_alerts.py
```

## Support & Escalation

- **For operational questions:** Check this guide first
- **For bugs in payment logic:** File GitHub issue with `[x402]` tag
- **For urgent issues:** Ping @engineering in Discord
- **For security issues:** Contact security@team.internal

---

**Last updated:** 2025-11-16
**Maintainers:** Engineering team
**Version:** 1.0
