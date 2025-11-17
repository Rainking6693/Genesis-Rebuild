# x402 Troubleshooting Guide

This guide provides solutions for common payment system issues.

## Common Payment Errors

### Error: "402 Payment Required"

**Symptom:**
```
HTTPError: 402 Payment Required
```

**Causes:**
1. Wallet balance too low
2. Payment below minimum amount
3. Service configuration issue

**Resolution:**
```bash
# 1. Check wallet balance
python scripts/x402_monitor_alerts.py | grep "balance"

# 2. Check if balance is above minimum (typically $0.10)
# 3. Fund wallet if needed
# 4. Retry payment

# 5. Check service configuration
python -c "from infrastructure.payments.a2a_x402_service import A2AX402Service; print(A2AX402Service().health_check())"
```

---

### Error: "Budget Exceeded"

**Symptom:**
```
BudgetExceeded: Daily budget exceeded for agent
```

**Causes:**
1. Agent has used full daily allocation
2. Per-transaction limit exceeded
3. Monthly limit exceeded

**Resolution:**
```bash
# 1. Check budget usage
python -c "
from infrastructure.payments.budget_tracker import BudgetTracker
tracker = BudgetTracker()
usage = tracker.get_usage('builder_agent')
print(f'Daily: {usage[\"daily\"]}/{usage[\"daily_limit\"]}')
print(f'Monthly: {usage[\"monthly\"]}/{usage[\"monthly_limit\"]}')
print(f'Per Txn Limit: {usage[\"per_txn\"]}')
"

# 2. Wait for daily reset (happens at midnight UTC)
# 3. Or increase budget limits via environment variables
export X402_BUILDER_AGENT_DAILY_LIMIT_USDC=150.0
systemctl restart genesis

# 4. For emergency needs, file approval request to engineering
```

---

### Error: "Transaction Reverted"

**Symptom:**
```
TransactionRevertError: Transaction reverted on blockchain
```

**Causes:**
1. Insufficient gas
2. Nonce mismatch
3. Invalid transaction parameters

**Resolution:**
```bash
# 1. Check transaction details
python -c "
from infrastructure.payments.payment_ledger import PaymentLedger
ledger = PaymentLedger()
tx = ledger.get_transaction('tx_hash_here')
print(f'Status: {tx[\"status\"]}')
print(f'Error: {tx.get(\"error\")}')
print(f'Blockchain hash: {tx.get(\"blockchain_tx_hash\")}')
"

# 2. Verify on blockchain explorer
# Go to: https://basescan.org/tx/{blockchain_tx_hash}

# 3. Check wallet nonce
python -c "from infrastructure.payments.wallet_manager import WalletManager; print(WalletManager().get_nonce())"

# 4. If gas issue, wait for network to clear and retry
python -c "
from infrastructure.payments.retry_handler import RetryHandler
handler = RetryHandler(max_attempts=5)
# Retry logic will be invoked automatically
"

# 5. If persistent, escalate to engineering
```

---

### Error: "Insufficient Wallet Balance"

**Symptom:**
```
InsufficientBalance: Wallet does not have enough USDC
```

**Causes:**
1. Wallet empty or nearly empty
2. Other processes using wallet
3. Recent large transactions

**Resolution:**
```bash
# 1. Check wallet balance
python -c "
from infrastructure.payments.wallet_manager import WalletManager
wm = WalletManager()
print(f'Balance: \${wm.get_balance():.2f} USDC')
"

# 2. Fund wallet immediately
# Send USDC to: {X402_WALLET_ADDRESS} on Base network

# 3. Verify deposit arrived (wait 30 seconds)
python scripts/x402_monitor_alerts.py

# 4. Resume payments once balance is adequate
```

---

### Error: "Invalid Signature"

**Symptom:**
```
SignatureError: Transaction signature is invalid
```

**Causes:**
1. Wallet key corrupted
2. Key rotation in progress
3. Wallet address mismatch

**Resolution:**
```bash
# 1. Verify wallet configuration
python -c "import os; print(f'Address: {os.getenv(\"X402_WALLET_ADDRESS\")}')"

# 2. Check if signature key is correct
# (Cannot directly print private keys for security)
# Verify via: systemctl status genesis | grep wallet

# 3. If recently rotated keys, verify new key is deployed
# Check deployment logs: journalctl -u genesis | grep -i "key\|wallet"

# 4. If corrupted, perform key rotation:
# a) Generate new wallet
# b) Update X402_WALLET_ADDRESS in secrets
# c) Restart Genesis
# d) Test with small payment
# e) Monitor for issues

# 5. If issue persists, escalate to security team
```

---

## Retry Exhausted Scenarios

### Error: "Max Retries Exceeded"

**Symptom:**
```
RetryExhausted: Payment failed after 5 attempts
```

**Causes:**
1. Network connectivity issue
2. A2A-x402 service down
3. Blockchain congestion (high gas prices)

**Resolution:**
```bash
# 1. Check network connectivity
ping 8.8.8.8

# 2. Check A2A-x402 service status
python -c "from infrastructure.payments.a2a_x402_service import A2AX402Service; print(A2AX402Service().health_check())"

# 3. Check blockchain status and gas prices
# Go to: https://gwei.io (for gas prices on Base)

# 4. Review retry logs
tail -50 logs/genesis.log | grep -i "retry"

# 5. If network issue is temporary, retry payment later (automatic retry in next business cycle)

# 6. If service is down, contact A2A-x402 support or wait for recovery

# 7. For manual retry
python -c "
from infrastructure.payments.a2a_x402_service import A2AX402Service
from infrastructure.payments.retry_handler import RetryHandler

service = A2AX402Service()
handler = RetryHandler(max_attempts=3, base_delay=2.0)

# Will retry with exponential backoff
try:
    result = handler.retry_with_backoff(
        service.pay_for_service,
        1.5, 'USDC', 'openai'
    )
    print(f'Success: {result.transaction_id}')
except Exception as e:
    print(f'Failed: {e}')
"
```

---

## Budget Exceeded Scenarios

### Scenario: Single Agent Exceeds Daily Budget

**Symptoms:**
- Agent fails to make payments
- Budget exceeded errors in logs
- Dashboard shows agent at 100% daily utilization

**Steps to Resolve:**

1. **Review actual spend:**
   ```bash
   python -c "
   from infrastructure.payments.payment_ledger import PaymentLedger
   ledger = PaymentLedger()
   today_txs = [tx for tx in ledger.get_agent_transactions('builder_agent')
                if 'today' in tx.get('timestamp', '')]
   total = sum(float(tx['price_usdc']) for tx in today_txs)
   print(f'builder_agent spent today: \${total:.2f}')
   "
   ```

2. **Determine if legitimate or anomalous:**
   - Check against historical spend
   - Review transaction details (which services?)
   - Verify no duplicate charges

3. **If legitimate, increase limit:**
   ```bash
   export X402_BUILDER_AGENT_DAILY_LIMIT_USDC=200.0
   systemctl restart genesis

   # Verify
   python -c "
   from infrastructure.payments.budget_tracker import BudgetTracker
   tracker = BudgetTracker()
   limits = tracker._get_limits('builder_agent')
   print(f'Daily limit: \${limits[\"daily\"]}')
   "
   ```

4. **If anomalous, investigate:**
   - Check for repeated failed attempts
   - Look for service errors or crashes
   - Review agent logs: `logs/builder_agent.log`
   - File incident ticket

5. **Monitor next 24 hours:**
   - Check daily spend patterns
   - Verify limit is sufficient
   - Adjust if needed

---

### Scenario: Multiple Agents Hit Monthly Limits

**Symptoms:**
- Multiple agents failing to pay
- Monthly budget exhausted across fleet
- Dashboard shows high monthly utilization

**Steps to Resolve:**

1. **Get aggregate spend:**
   ```bash
   python -c "
   from infrastructure.payments.payment_ledger import PaymentLedger
   ledger = PaymentLedger()
   from datetime import datetime
   month = datetime.utcnow().strftime('%Y-%m')
   total = ledger.get_monthly_total(month)
   print(f'Total monthly spend: \${total:.2f}')
   "
   ```

2. **Calculate burn rate:**
   ```bash
   # Total spent / Days elapsed = Daily burn
   # Days remaining = 30 - days_elapsed
   # Projected = burn_rate * days_remaining
   ```

3. **Decide on action:**
   - **If sustainable:** Wait for month reset
   - **If overspend:** Increase budget for next month
   - **If concerning:** Implement cost reduction measures (Phase 10)

4. **File approval request:**
   - Document current spend and projections
   - Provide business justification
   - Get approval from product/finance
   - Update budget limits once approved

5. **Prevent next month:**
   - Review agent spending patterns
   - Optimize expensive operations (see Phase 10)
   - Consider tiered fallback strategies

---

## Wallet Balance Low Scenarios

### Scenario: Wallet Balance Drops Below $50

**Alert:**
```
⚠️ Payment Wallet Balance Low
Current: $25.50
Threshold: $50.00
Status: CRITICAL
```

**Steps to Resolve:**

1. **Verify alert is real:**
   ```bash
   python scripts/x402_monitor_alerts.py | grep -i "balance"
   ```

2. **Fund immediately:**
   - Open Coinbase Wallet
   - Send USDC to X402_WALLET_ADDRESS (on Base network)
   - Recommended amount: $500-$1000 (buffer)

3. **Wait for confirmation:**
   - Wait 30 seconds to 2 minutes for on-chain confirmation
   - Verify deposit appeared: `python scripts/x402_monitor_alerts.py`

4. **Resume operations:**
   - Genesis agents will automatically resume payments
   - Check logs to ensure no missed transactions
   - Run reconciliation: `python scripts/reconcile_x402_ledger.py`

5. **Prevent future alerts:**
   - Set up automatic low-balance alerts
   - Schedule weekly funding reviews
   - Maintain minimum $100 buffer

6. **Monitor unusual drain:**
   - If balance drops quickly, check for:
     - Increased agent activity
     - Service cost spikes
     - Unauthorized transactions
   - Review transaction ledger: `grep "transaction_id" data/a2a-x402/transactions/transactions.jsonl`

---

## Network Connectivity Issues

### Error: "Connection Refused" or "Connection Timeout"

**Symptom:**
```
ConnectionError: [Errno 111] Connection refused
TimeoutError: Connection to x402-facilitator timed out
```

**Causes:**
1. A2A-x402 facilitator service down
2. Network connectivity issue
3. Firewall blocking outbound traffic
4. DNS resolution failure

**Resolution:**
```bash
# 1. Check local network
ping 8.8.8.8
# If fails, check internet connection

# 2. Check DNS resolution
nslookup x402-facilitator.coinbase.com
# If fails, check /etc/resolv.conf

# 3. Check A2A-x402 service status
curl -v https://x402-facilitator.coinbase.com/v1/health
# Look for HTTP 200 response

# 4. Check firewall
sudo iptables -L | grep -i "443\|x402"

# 5. Check if behind proxy
python -c "
import os
print(f'HTTP_PROXY: {os.getenv(\"HTTP_PROXY\")}')
print(f'HTTPS_PROXY: {os.getenv(\"HTTPS_PROXY\")}')
"

# 6. Test with direct curl
curl -H "Authorization: Bearer {A2A_API_KEY}" https://x402-facilitator.coinbase.com/v1/health

# 7. Review retry logs
tail -100 logs/genesis.log | grep -i "timeout\|connection"

# 8. Retry logic should automatically handle temporary outages
# Monitor logs and check if payments resume automatically
```

---

## Performance Issues

### Issue: Payment Latency >5 seconds

**Symptom:**
```
Payment took 8.5 seconds (expected <2 seconds)
Multiple slow payments in Grafana dashboard
```

**Causes:**
1. High blockchain congestion
2. Network latency to facilitator
3. Resource contention on server
4. Large batch operations

**Resolution:**
```bash
# 1. Check blockchain status
# High gas prices indicate congestion
curl https://api.basescan.org/api?module=gastracker&action=gasoracle

# 2. Check network latency
python -c "
import time
import httpx
start = time.time()
httpx.get('https://x402-facilitator.coinbase.com/v1/health', timeout=5)
elapsed = time.time() - start
print(f'Latency: {elapsed:.3f}s')
"

# 3. Check server resources
top -b -n 1 | head -20  # CPU/Memory
df -h  # Disk space
free -h  # RAM available

# 4. Check for resource contention
ps aux | grep genesis  # Check process list

# 5. If blockchain congestion, payments will eventually succeed
# Retry logic has exponential backoff up to 60 seconds

# 6. For persistent slowness, consider Phase 10 optimizations:
# - Connection pooling
# - Response caching
# - Batch payment processing
```

---

## Data Integrity Issues

### Issue: Ledger Missing Transactions

**Symptom:**
```
Reconciliation detects orphaned payments
Ledger total < actual spend
```

**Causes:**
1. Transaction logging failure
2. Ledger file corruption
3. Race condition in concurrent writes
4. Unhandled exceptions during logging

**Resolution:**
```bash
# 1. Check ledger file integrity
head data/a2a-x402/transactions/transactions.jsonl | python -m json.tool
# If errors, file is corrupted

# 2. Check for recent write errors in logs
tail -200 logs/genesis.log | grep -i "error\|fail" | grep "ledger\|transaction"

# 3. Verify all payments are in ledger
python -c "
from infrastructure.payments.payment_ledger import PaymentLedger
ledger = PaymentLedger()
txs = list(ledger.read_transactions())
print(f'Total transactions in ledger: {len(txs)}')
print(f'Total spend: \${sum(float(tx[\"price_usdc\"]) for tx in txs):.2f}')
"

# 4. Compare to budget tracker
python -c "
from infrastructure.payments.budget_tracker import BudgetTracker
tracker = BudgetTracker()
print(tracker._state)
"

# 5. Run audit to identify discrepancies
python scripts/audit_x402_budgets.py

# 6. If corruption detected:
# a) Stop Genesis: systemctl stop genesis
# b) Restore from backup: rsync -av ~/backups/ledger-backup/ data/a2a-x402/
# c) Restart: systemctl start genesis
# d) Run reconciliation: python scripts/reconcile_x402_ledger.py
# e) File incident ticket

# 7. Implement file locking to prevent race conditions
# (This is handled in BudgetTracker._persist_state())
```

---

## Getting Help

### Check These Resources First
1. This troubleshooting guide (you are here)
2. Operations guide: `docs/x402_operations_guide.md`
3. Architecture guide: `docs/x402_architecture.md`
4. Playbook: `docs/x402_playbook.md`

### Gather Information for Support
```bash
#!/bin/bash
# Collect diagnostic information

echo "=== System Status ==="
python scripts/x402_monitor_alerts.py

echo "=== Recent Errors ==="
tail -50 logs/genesis.log | grep -i "error\|fail"

echo "=== Payment Metrics ==="
python -c "
from infrastructure.payments.payment_ledger import PaymentLedger
ledger = PaymentLedger()
txs = list(ledger.read_transactions())[-20:]
for tx in txs:
    print(f\"{tx['timestamp']}: {tx['agent_id']} - {tx['status']} ({tx['price_usdc']} USDC)\")
"

echo "=== Budget Status ==="
python -c "
from infrastructure.payments.budget_tracker import BudgetTracker
tracker = BudgetTracker()
for agent in ['builder_agent', 'research_agent', 'code_review_agent']:
    usage = tracker.get_usage(agent)
    print(f\"{agent}: {usage['daily']}/{usage['daily_limit']} daily, {usage['monthly']}/{usage['monthly_limit']} monthly\")
"

echo "=== Service Health ==="
python -c "from infrastructure.payments.a2a_x402_service import A2AX402Service; print(A2AX402Service().health_check())"
```

### Escalation Path
1. **Self-service:** Check this guide
2. **Logs review:** Check `logs/genesis.log` and `logs/x402.log`
3. **Team Slack:** Post in `#payment-operations` channel
4. **Engineering ticket:** File in GitHub with `[x402]` tag
5. **Urgent issues:** Ping `@engineering` in Discord

---

**Last updated:** 2025-11-16
**Maintainers:** Engineering team
**Version:** 1.0
