# x402 Payment System Architecture

This document describes the technical architecture of the Genesis x402 payment system.

## System Overview

The x402 system enables Genesis agents to make autonomous micro-payments for external API services using the A2A-x402 protocol on the Base blockchain.

```
┌─────────────────────────────────────────────────────────────────┐
│                        Genesis Agents                           │
│  (Builder, Research, Code Review, Support, etc.)                │
└───────────────┬────────────────────────────────────────────────┘
                │
┌───────────────▼────────────────────────────────────────────────┐
│              Payment Management Layer                           │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ AgentPaymentMixin (mixin for agent payment logic)        │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ A2AX402Service (HTTP client to facilitator)             │  │
│  └──────────────────────────────────────────────────────────┘  │
└───────────────┬────────────────────────────────────────────────┘
                │
┌───────────────▼────────────────────────────────────────────────┐
│              Policy & Enforcement Layer                         │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ BudgetTracker (daily/monthly/per-txn limits)            │  │
│  │ RetryHandler (exponential backoff + circuit breaker)    │  │
│  │ PaymentManager (authorize/capture/cancel)               │  │
│  └──────────────────────────────────────────────────────────┘  │
└───────────────┬────────────────────────────────────────────────┘
                │
┌───────────────▼────────────────────────────────────────────────┐
│              Data & Observability Layer                         │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ PaymentLedger (JSONL transaction log)                   │  │
│  │ FinanceLedger (consolidated ledger)                     │  │
│  │ Prometheus Metrics (counters, gauges)                   │  │
│  │ Discord Alerts (notifications + reports)                │  │
│  └──────────────────────────────────────────────────────────┘  │
└───────────────┬────────────────────────────────────────────────┘
                │
┌───────────────▼────────────────────────────────────────────────┐
│              External Services                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ A2A-x402 Facilitator (Google/Coinbase)                 │  │
│  │ Base Blockchain (payment settlement)                    │  │
│  │ Discord Webhooks (alerting)                             │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Core Components

### 1. A2AX402Service
**Location:** `infrastructure/payments/a2a_x402_service.py`

**Responsibility:** HTTP client for A2A-x402 facilitator

**Key Methods:**
- `pay_for_service(amount, token, vendor, metadata)` - Execute payment
- `health_check()` - Verify facilitator is available

**Configuration:**
```python
service = A2AX402Service(
    base_url="https://x402-facilitator.coinbase.com",  # or custom
    api_key=os.getenv("A2A_API_KEY"),
    wallet_address=os.getenv("X402_WALLET_ADDRESS")
)
```

**Request Flow:**
```
1. Build payload with amount, token, vendor
2. POST to /v1/x402/payments
3. Receive transaction_id, blockchain_tx_hash
4. Return A2APaymentResponse
```

---

### 2. BudgetTracker
**Location:** `infrastructure/payments/budget_tracker.py`

**Responsibility:** Enforce spending limits per agent

**Limits:**
- Per-transaction: $10 (max single payment)
- Daily: $100 (resets at midnight UTC)
- Monthly: $1000 (resets 1st of month UTC)

**State Storage:**
- Persisted to: `data/a2a-x402/budgets/state.json`
- Format: Agent → {daily_spent, monthly_spent, daily_limit, etc.}

**Key Methods:**
```python
tracker = BudgetTracker()

# Check if payment is allowed
can_spend = tracker.can_spend("builder_agent", 5.0)  # bool

# Record a successful spend
tracker.record_spend("builder_agent", 5.0)

# Get usage stats
usage = tracker.get_usage("builder_agent")
# Returns: {
#   "daily": 25.0,
#   "monthly": 150.0,
#   "per_txn": 10.0,
#   "daily_limit": 100.0,
#   "monthly_limit": 1000.0
# }
```

**Daily Reset Logic:**
- Tracked via `last_daily` timestamp in state
- Automatically resets `daily_spent` to 0 at midnight UTC
- Monthly reset happens on 1st of month UTC

---

### 3. RetryHandler
**Location:** `infrastructure/payments/retry_handler.py`

**Responsibility:** Implement resilient retry logic with exponential backoff

**Configuration:**
```python
handler = RetryHandler(
    max_attempts=5,
    base_delay=1.0,      # 1 second
    max_delay=60.0,      # 60 seconds
    exponent=2.0,        # 2^n backoff
    jitter=True          # Add ±20% randomness
)
```

**Retryable Errors:**
- `TimeoutError`
- `ConnectionError`

**Non-retryable (fail immediately):**
- `ValueError` (invalid input)
- `AuthenticationError` (invalid key)
- Most HTTP 4xx errors

**Backoff Calculation:**
```
Attempt 1: 1.0s * 2^0 = 1.0s
Attempt 2: 1.0s * 2^1 = 2.0s (±20% jitter)
Attempt 3: 1.0s * 2^2 = 4.0s (±20% jitter)
Attempt 4: 1.0s * 2^3 = 8.0s (±20% jitter)
Attempt 5: min(1.0s * 2^4, 60s) = 16.0s (capped)

Total time: ~31 seconds for max retries
```

**Usage:**
```python
handler = RetryHandler()

result = handler.retry_with_backoff(
    service.pay_for_service,
    1.5,
    "USDC",
    "openai",
    metadata={"trace_id": "xyz"}
)
```

---

### 4. PaymentLedger
**Location:** `infrastructure/payments/payment_ledger.py`

**Responsibility:** Append-only transaction log

**Storage:**
- File: `data/a2a-x402/transactions/transactions.jsonl`
- Format: One JSON transaction per line (JSONL)
- Immutable (append-only)

**Transaction Record:**
```python
@dataclass
class PaymentRecord:
    transaction_id: str           # Unique ID from facilitator
    timestamp: str                # ISO format (UTC)
    agent_id: str                 # Which agent made payment
    service_url: str              # API endpoint (for debugging)
    price_usdc: float             # Amount in USDC
    status: str                   # completed|pending|failed
    blockchain_tx_hash: str       # On-chain tx hash (if confirmed)
    facilitator_receipt: Dict     # Response from facilitator
    vendor: str                   # Service name (openai, anthropic, etc.)
    error: Optional[str]          # Error message if failed
```

**Key Methods:**
```python
ledger = PaymentLedger()

# Log transaction
ledger.log_transaction(record)

# Retrieve by transaction ID
tx = ledger.get_transaction("tx_123")

# Get all transactions for agent
txs = ledger.get_agent_transactions("builder_agent")

# Calculate daily/monthly totals
daily_total = ledger.get_daily_total("2025-11-16")
monthly_total = ledger.get_monthly_total("2025-11")

# Detect blockchain discrepancies
discrepancies = ledger.reconcile_blockchain()
```

---

### 5. PaymentManager
**Location:** `infrastructure/payments/manager.py`

**Responsibility:** Orchestrate payment flow with budget enforcement

**Key Methods:**
```python
manager = PaymentManager()

# Simple payment (all-in-one)
result = manager.pay_for_service(
    agent_id="builder_agent",
    amount=5.0,
    token="USDC",
    vendor="openai"
)

# Staged payment (for long operations)
auth_id = manager.authorize(
    agent_id="builder_agent",
    amount=10.0,
    vendor="deploy"
)
# ... perform operation ...
manager.capture(auth_id)  # Confirm
# OR
manager.cancel(auth_id)   # Abort
```

**Flow:**
```
pay_for_service()
  ├─ Check budget (BudgetTracker.can_spend)
  ├─ Make payment (RetryHandler.retry_with_backoff)
  ├─ Record to ledger (PaymentLedger.log_transaction)
  ├─ Emit metrics (Prometheus)
  └─ Return result
```

---

## Data Flow

### Complete Payment Flow

```
Agent calls: pay_for_service(amount, vendor)
    │
    ├─ BudgetTracker.can_spend()
    │  └─ Check: per_txn < limit?
    │  └─ Check: daily_spent + amount < daily_limit?
    │  └─ Check: monthly_spent + amount < monthly_limit?
    │
    ├─ (if budget ok) RetryHandler.retry_with_backoff()
    │  └─ A2AX402Service.pay_for_service()
    │     ├─ Build payload
    │     ├─ POST to facilitator
    │     └─ Return A2APaymentResponse
    │
    ├─ (if success) PaymentLedger.log_transaction()
    │  └─ Write to transactions.jsonl
    │
    ├─ BudgetTracker.record_spend()
    │  └─ Update state.json
    │
    ├─ Emit Prometheus metrics
    │  ├─ payments_total counter +1
    │  ├─ payment_spend_usd counter +amount
    │  └─ payment_latency histogram
    │
    ├─ (if critical) Send Discord alert
    │  └─ Genesis Discord client
    │
    └─ Return PaymentResponse to agent
```

---

### Budget State Lifecycle

```
Time: 2025-11-16 10:00:00 UTC
├─ Agent: builder_agent
├─ State:
│  ├─ daily_spent: 0
│  ├─ monthly_spent: 0
│  ├─ last_daily: "2025-11-16"
│  └─ last_monthly: "2025-11"

Payment 1: $5.00
├─ can_spend(builder_agent, 5.0) → YES
├─ record_spend(builder_agent, 5.0)
├─ State:
│  ├─ daily_spent: 5.0
│  └─ monthly_spent: 5.0

Time: 2025-11-17 00:00:00 UTC (next day)
├─ _reset_if_needed() called
├─ last_daily != today, so reset:
│  ├─ daily_spent: 0 (RESET)
│  ├─ monthly_spent: 5.0 (UNCHANGED)
│  └─ last_daily: "2025-11-17"

Payment 2: $3.00
├─ can_spend(builder_agent, 3.0) → YES
├─ State:
│  ├─ daily_spent: 3.0 (new day)
│  └─ monthly_spent: 8.0 (cumulative)
```

---

## Monitoring & Observability

### Prometheus Metrics

**Counters:**
```
payments_total{agent, vendor, chain, status}
  - Counts total payment attempts
  - Status: completed, pending, failed

payment_spend_usd{agent, vendor}
  - Cumulative USD spent
  - Increments by amount for each payment
```

**Gauges:**
```
payment_wallet_balance{agent}
  - Current wallet balance per agent
  - Updated on each balance check

payment_vendor_failure_streak{vendor}
  - Consecutive failures for a vendor
  - Resets on successful payment

payment_stale_authorizations
  - Count of pending authorizations >15 min old
  - Updated hourly
```

**Example Queries:**
```promql
# Total payments yesterday
rate(payments_total[1d] offset 1d)

# Payment success rate (5 min average)
rate(payments_total{status="completed"}[5m]) / rate(payments_total[5m])

# Spend by agent (24h)
sum by (agent) (rate(payment_spend_usd[24h]))

# Wallet balance for builder_agent
payment_wallet_balance{agent="builder_agent"}
```

---

### Discord Integration

**Channels:**
- `#genesis-dashboard` - Daily summaries, weekly reports
- `#genesis-errors` - Payment failures, critical alerts
- `#genesis-metrics` - Weekly spend analysis

**Notification Types:**

1. **Budget Alert:**
   ```
   ⚠️ builder_agent budget alert
   Used: 90% of daily ($90/$100)
   Remaining: $10
   ```

2. **Payment Failure:**
   ```
   ❌ Payment failed
   Agent: builder_agent
   Amount: $5.00 USDC
   Vendor: openai
   Error: Insufficient balance
   ```

3. **Wallet Low:**
   ```
   🪶 Wallet balance low
   Current: $25.50
   Threshold: $50
   Action: Fund immediately
   ```

---

## Deployment Architecture

### File Structure
```
├── infrastructure/
│   └── payments/
│       ├── __init__.py
│       ├── a2a_x402_service.py      # Facilitator client
│       ├── budget_tracker.py          # Budget enforcement
│       ├── budget_enforcer.py         # Budget executor
│       ├── retry_handler.py           # Retry logic
│       ├── payment_ledger.py          # Transaction log
│       ├── manager.py                 # Orchestrator
│       ├── agent_payment_mixin.py     # Agent integration
│       ├── wallet_manager.py          # Wallet operations
│       ├── vendor_cache.py            # Service cache
│       ├── research_helper.py         # Research services
│       ├── media_helper.py            # Media services
│       └── middleware.py              # HTTP middleware
├── data/
│   └── a2a-x402/
│       ├── transactions/
│       │   └── transactions.jsonl     # All transactions
│       ├── budgets/
│       │   └── state.json             # Budget state
│       ├── audit_reports/             # Audit reports
│       ├── reconciliation_reports/    # Reconciliation reports
│       └── spend_summaries.jsonl      # Spend summaries
├── scripts/
│   ├── x402_prometheus_exporter.py    # Metrics exporter
│   ├── x402_monitor_alerts.py         # Alert monitor
│   ├── x402_stale_payments.py         # Stale check
│   ├── x402_daily_ledger_sync.py      # Daily sync
│   ├── x402_weekly_report.py          # Weekly report
│   ├── reconcile_x402_ledger.py       # Blockchain reconciliation
│   └── audit_x402_budgets.py          # Budget audit
├── monitoring/
│   ├── __init__.py
│   └── payment_metrics.py             # Metric definitions
├── docs/
│   ├── x402_playbook.md              # Operational playbook
│   ├── x402_operations_guide.md      # Operations guide
│   ├── x402_troubleshooting.md       # Troubleshooting guide
│   └── x402_architecture.md          # This file
└── tests/
    ├── payments/
    │   └── test_a2a_x402_service.py   # Payment tests
    └── test_x402_*.py                 # Integration tests
```

---

## Error Handling & Recovery

### Payment Failure Scenarios

```
Payment Failure
  ├─ Non-retryable (immediate fail)
  │  ├─ AuthenticationError
  │  ├─ ValidationError
  │  ├─ BudgetExceeded
  │  └─ Fallback to free tier
  │
  ├─ Retryable (exponential backoff)
  │  ├─ TimeoutError
  │  ├─ ConnectionError
  │  ├─ TemporaryServiceError
  │  └─ Retry up to 5 times (31 seconds total)
  │
  └─ After exhaustion
     ├─ Log error to ledger
     ├─ Emit failure metric
     ├─ Send Discord alert
     └─ Agent falls back to graceful degradation
```

---

## Performance Characteristics

### Payment Latency

**Typical:**
- p50: <500ms (local checks + API call)
- p95: <2s (with network latency)
- p99: <10s (with minor retries)

**Under Load:**
- Linear up to ~100 concurrent payments
- Rate limit: ~50 payments/second
- Queuing behavior after saturation

### Resource Usage

**Memory:**
- Base: ~50MB (Python + dependencies)
- Per 1000 cached transactions: ~5MB
- State file: <1MB

**Disk:**
- Transactions log: ~2KB per transaction
- State file: <10KB
- Reports: ~10KB per reconciliation
- 100,000 transactions: ~200MB

**Network:**
- Per payment: 1 outbound HTTPS request (~5KB)
- Per second: Rate-limited to ~50 requests
- Bandwidth: ~250KB/s at saturation

---

## Security Considerations

### Private Key Management

**Production Best Practices:**
1. Store in AWS Secrets Manager or similar
2. Use hardware wallet (Ledger/Trezor) for signing
3. Implement key rotation (quarterly)
4. Never log or commit private keys
5. Audit all key access

### Budget Enforcement

**Hard Limits:**
- Per-transaction maximum enforced before API call
- Daily/monthly limits checked before processing
- No exceptions (must modify config + restart)

**Soft Alerts:**
- 80%, 90%, 95% threshold notifications
- Allows for graceful degradation
- Can be overridden by on-call engineer (with approval)

### API Security

**Authentication:**
- Bearer token in Authorization header
- A2A_API_KEY environment variable
- Rotated regularly (best practice)

**Rate Limiting:**
- Facilitator imposes limits (typically 100 req/min)
- Our retry handler respects this
- Circuit breaker triggers after repeated 429 responses

---

## Scaling Considerations

### Horizontal Scaling

**Shared State:**
- Budget state: Shared file system or database
- Ledger: Append-only log (OK with multiple writers)
- Metrics: Prometheus scrapes all instances

**Considerations:**
- File locking needed for budget state updates
- Ledger writes must be atomic
- Clock synchronization required (NTP)

### High Volume (1000+ payments/day)

**Bottlenecks:**
1. Facilitator rate limit (~100 req/min)
2. Blockchain confirmation time (~12 seconds)
3. Budget tracker file I/O (mitigate with batching)

**Optimizations:**
1. Batch small payments (Phase 10)
2. Implement local caching layer
3. Move to database backend for state
4. Consider sharded wallets

---

## Future Enhancements

### Phase 10+ Roadmap

1. **Connection Pooling**
   - Reuse HTTP connections to facilitator
   - Expected: 20-30% latency reduction

2. **Response Caching**
   - Cache facilitator responses (5 min TTL)
   - For idempotent operations
   - Expected: 40% reduction in API calls

3. **Payment Batching**
   - Group small payments into single transaction
   - Reduces blockchain settlement costs
   - Expected: 80% cost reduction for micro-payments

4. **Database Backend**
   - Replace JSON files with PostgreSQL
   - Better for horizontal scaling
   - Better performance for large datasets

5. **Multi-Network Support**
   - Add Ethereum L2 (Optimism, Arbitrum)
   - Fallback if Base congested
   - Better price discovery

---

**Last updated:** 2025-11-16
**Author:** Engineering team
**Version:** 1.0
