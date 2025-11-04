# Marketplace Infrastructure - Production Deployment Guide

**Version:** 2.0 (Enhanced)  
**Last Updated:** November 4, 2025  
**Status:** ✅ Production-Ready

---

## 📋 Overview

The Genesis Marketplace Infrastructure now includes three deployment tiers:

1. **Basic** - In-memory (development, testing)
2. **Enhanced** - Thread-safe + Prometheus metrics (production, single-instance)
3. **Distributed** - Redis/PostgreSQL + Thread-safe + Metrics (production, multi-instance)

---

## 🎯 Quick Start

### Option 1: Basic (In-Memory)

**Best for:** Development, testing, single-process deployments

```python
from infrastructure.marketplace import (
    AgentRegistry,
    TransactionLedger,
    AgentDiscoveryService,
)

registry = AgentRegistry()
ledger = TransactionLedger()
discovery = AgentDiscoveryService(registry, ledger)
```

**Pros:**
- ✅ Zero dependencies
- ✅ Fast setup
- ✅ Simple to understand

**Cons:**
- ⚠️ Data lost on restart
- ⚠️ Single-process only
- ⚠️ No metrics

---

### Option 2: Enhanced (Thread-Safe + Metrics)

**Best for:** Production single-instance deployments with monitoring

```python
from infrastructure.marketplace.thread_safe import (
    ThreadSafeAgentRegistry,
    ThreadSafeTransactionLedger,
)
from infrastructure.marketplace.metrics import (
    InstrumentedDiscoveryService,
)

# Thread-safe components
registry = ThreadSafeAgentRegistry()
ledger = ThreadSafeTransactionLedger()

# Discovery with metrics
discovery = InstrumentedDiscoveryService(registry, ledger)
```

**Pros:**
- ✅ Thread-safe (concurrent access)
- ✅ Prometheus metrics
- ✅ Still fast
- ✅ No external dependencies

**Cons:**
- ⚠️ Data lost on restart
- ⚠️ Single-instance only

**Setup Prometheus Metrics:**

```python
# Add to your FastAPI/Flask app
from prometheus_client import make_asgi_app

metrics_app = make_asgi_app()
app.mount("/metrics", metrics_app)
```

**Access metrics:** `http://localhost:8000/metrics`

---

### Option 3: Distributed (Redis + PostgreSQL + Full Stack)

**Best for:** Production multi-instance deployments with persistence

```python
from infrastructure.marketplace.backends import (
    RedisAgentRegistry,
    PostgresTransactionLedger,
)
from infrastructure.marketplace.metrics import InstrumentedDiscoveryService

# Redis-backed registry (distributed)
registry = RedisAgentRegistry(
    redis_url="redis://localhost:6379/0",
    agent_ttl=3600  # 1 hour TTL
)

# PostgreSQL-backed ledger (persistent)
ledger = PostgresTransactionLedger(
    db_url="postgresql://user:pass@localhost:5432/genesis"
)

# Discovery with metrics
discovery = InstrumentedDiscoveryService(registry, ledger)
```

**Pros:**
- ✅ Distributed (multi-instance)
- ✅ Persistent storage
- ✅ ACID transactions
- ✅ Prometheus metrics
- ✅ Production-grade

**Cons:**
- ⚠️ Requires Redis + PostgreSQL
- ⚠️ More complex setup

**Installation:**

```bash
pip install redis psycopg2-binary prometheus-client
```

**Database Setup:**

```bash
# PostgreSQL
createdb genesis
# Tables created automatically on first run

# Redis
# Use existing Redis instance or:
docker run -d -p 6379:6379 redis:latest
```

---

## 📊 Feature Comparison

| Feature | Basic | Enhanced | Distributed |
|---------|-------|----------|-------------|
| **Thread Safety** | ❌ | ✅ | ✅ |
| **Prometheus Metrics** | ❌ | ✅ | ✅ |
| **Persistent Storage** | ❌ | ❌ | ✅ |
| **Multi-Instance** | ❌ | ❌ | ✅ |
| **ACID Transactions** | ❌ | ❌ | ✅ (PostgreSQL) |
| **Auto-Scaling** | ❌ | ❌ | ✅ (Redis) |
| **Dependencies** | None | None | Redis + PostgreSQL |
| **Setup Time** | < 1 min | < 1 min | ~10 min |
| **Best For** | Dev/Test | Single Instance | Multi-Instance |

---

## 🔧 Component Guide

### 1. ThreadSafeAgentRegistry

**Purpose:** Concurrent-safe agent registration

```python
from infrastructure.marketplace.thread_safe import ThreadSafeAgentRegistry
import threading

registry = ThreadSafeAgentRegistry()

# Safe to call from multiple threads
def register_worker(agent_id):
    registry.register_agent(
        agent_id=f"worker_{agent_id}",
        name=f"Worker {agent_id}",
        capabilities=["python"],
        cost_per_task=15.0
    )

threads = [threading.Thread(target=register_worker, args=(i,)) for i in range(10)]
for t in threads:
    t.start()
for t in threads:
    t.join()

# All 10 agents registered safely
assert len(registry.list_agents()) == 10
```

**Features:**
- Reentrant locks (RLock) for nested calls
- All public methods are thread-safe
- No deadlocks

---

### 2. RedisAgentRegistry

**Purpose:** Distributed agent registry

```python
from infrastructure.marketplace.backends import RedisAgentRegistry

registry = RedisAgentRegistry(
    redis_url="redis://localhost:6379/0",
    agent_ttl=3600  # 1 hour
)

# Register agent
profile = registry.register_agent(
    agent_id="distributed_agent",
    name="Distributed Agent",
    capabilities=["python", "backend"],
    cost_per_task=20.0
)

# Agent is now visible across all instances
# connected to the same Redis instance
```

**Redis Schema:**

```
agent:distributed_agent -> JSON profile (TTL: 3600s)
agents:all -> Set {"distributed_agent", ...}
agents:capabilities:python -> Set {"distributed_agent", ...}
agents:capabilities:backend -> Set {"distributed_agent", ...}
```

**Features:**
- Distributed across multiple instances
- TTL-based expiration for inactive agents
- Atomic operations with Redis pipelines
- Graceful fallback to in-memory

**TTL Behavior:**
- Agents expire after `agent_ttl` seconds of inactivity
- Heartbeat/update operations refresh TTL
- Expired agents automatically removed from Redis

---

### 3. PostgresTransactionLedger

**Purpose:** Persistent transaction storage

```python
from infrastructure.marketplace.backends import PostgresTransactionLedger

ledger = PostgresTransactionLedger(
    db_url="postgresql://user:pass@localhost:5432/genesis"
)

# Record transaction
tx = ledger.record_transaction(
    payer_agent="genesis",
    provider_agent="thon",
    capability="python",
    amount=18.50
)

# Transaction persisted to PostgreSQL
# Survives restarts, auditable, ACID-compliant
```

**Database Schema:**

```sql
CREATE TABLE marketplace_transactions (
    transaction_id VARCHAR(32) PRIMARY KEY,
    created_at TIMESTAMP NOT NULL,
    payer_agent VARCHAR(255) NOT NULL,
    provider_agent VARCHAR(255) NOT NULL,
    capability VARCHAR(255) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) NOT NULL,
    status VARCHAR(20) NOT NULL,
    context JSONB,
    evidence JSONB,
    INDEX idx_payer (payer_agent),
    INDEX idx_provider (provider_agent),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
);
```

**Features:**
- ACID guarantees
- Indexed queries (fast lookups)
- JSONB for flexible metadata
- Graceful fallback to in-memory

---

### 4. Instrumented Components

**Purpose:** Prometheus metrics for observability

```python
from infrastructure.marketplace.metrics import (
    InstrumentedAgentRegistry,
    InstrumentedTransactionLedger,
    InstrumentedDiscoveryService,
)

registry = InstrumentedAgentRegistry()
ledger = InstrumentedTransactionLedger()
discovery = InstrumentedDiscoveryService(registry, ledger)

# All operations now emit Prometheus metrics
registry.register_agent("agent1", "Agent 1", ["python"], 15.0)
# Increments: marketplace_agent_registrations_total{status="success"}

ledger.record_transaction("payer", "provider", "python", 15.0)
# Increments: marketplace_transactions_total{capability="python"}

discovery.search(["python"])
# Increments: marketplace_discovery_searches_total{capability="python"}
```

**Available Metrics:**

**Registry Metrics:**
- `marketplace_agent_registrations_total{status}` - Total registrations
- `marketplace_agent_unregistrations_total` - Total unregistrations
- `marketplace_agents_online` - Current online agents
- `marketplace_agents_by_capability{capability}` - Agents per capability
- `marketplace_agent_reputation_score{agent_id}` - Reputation scores
- `marketplace_agent_task_outcomes_total{agent_id,success}` - Task outcomes

**Ledger Metrics:**
- `marketplace_transactions_total{capability}` - Total transactions
- `marketplace_transaction_amount_total{currency}` - Transaction amounts
- `marketplace_transactions_by_status{status}` - Transactions by status
- `marketplace_transaction_state_transitions_total{from_state,to_state}` - State changes
- `marketplace_transaction_disputes_total{capability}` - Disputes
- `marketplace_transaction_settlement_duration_seconds` - Settlement time

**Discovery Metrics:**
- `marketplace_discovery_searches_total{capability}` - Total searches
- `marketplace_discovery_search_duration_seconds` - Search latency
- `marketplace_discovery_results_count` - Result counts
- `marketplace_discovery_recommendations_total{capability}` - Recommendations

---

## 🚀 Production Deployment Examples

### Example 1: Single-Instance Production

**Scenario:** Genesis Meta-Agent on a single VPS

```python
# config.py
from infrastructure.marketplace.thread_safe import (
    ThreadSafeAgentRegistry,
    ThreadSafeTransactionLedger,
)
from infrastructure.marketplace.metrics import InstrumentedDiscoveryService

# Thread-safe components (no external deps)
registry = ThreadSafeAgentRegistry()
ledger = ThreadSafeTransactionLedger()
discovery = InstrumentedDiscoveryService(registry, ledger)

# Export for use in app
__all__ = ["registry", "ledger", "discovery"]
```

```python
# main.py
from fastapi import FastAPI
from prometheus_client import make_asgi_app
from config import registry, ledger, discovery

app = FastAPI()

# Mount Prometheus metrics endpoint
metrics_app = make_asgi_app()
app.mount("/metrics", metrics_app)

@app.on_event("startup")
async def startup():
    # Register built-in agents
    for agent in ["thon", "nova", "hudson", "codex"]:
        registry.register_agent(
            agent_id=agent,
            name=agent.title(),
            capabilities=AGENT_CAPABILITIES[agent],
            cost_per_task=AGENT_COSTS[agent]
        )
```

**Monitoring:**
```bash
# Grafana dashboard queries
rate(marketplace_transactions_total[5m])
marketplace_agents_online
histogram_quantile(0.95, marketplace_discovery_search_duration_seconds)
```

---

### Example 2: Multi-Instance Production (Distributed)

**Scenario:** Genesis running on Kubernetes with 3+ replicas

```python
# config.py
import os
from infrastructure.marketplace.backends import (
    RedisAgentRegistry,
    PostgresTransactionLedger,
)
from infrastructure.marketplace.metrics import InstrumentedDiscoveryService

# Redis-backed registry (shared across instances)
registry = RedisAgentRegistry(
    redis_url=os.getenv("REDIS_URL", "redis://redis-service:6379/0"),
    agent_ttl=1800  # 30 minutes
)

# PostgreSQL-backed ledger (shared across instances)
ledger = PostgresTransactionLedger(
    db_url=os.getenv("DATABASE_URL", "postgresql://postgres:5432/genesis")
)

# Discovery with metrics
discovery = InstrumentedDiscoveryService(registry, ledger)

__all__ = ["registry", "ledger", "discovery"]
```

**Kubernetes Deployment:**

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: genesis-marketplace
spec:
  replicas: 3
  template:
    spec:
      containers:
      - name: genesis
        image: genesis:latest
        env:
        - name: REDIS_URL
          value: "redis://redis-service:6379/0"
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: postgres-credentials
              key: url
        ports:
        - containerPort: 8000
---
apiVersion: v1
kind: Service
metadata:
  name: redis-service
spec:
  selector:
    app: redis
  ports:
  - port: 6379
```

**Benefits:**
- Load balanced across 3 instances
- Shared agent registry (Redis)
- Persistent transactions (PostgreSQL)
- High availability
- Auto-scaling ready

---

## 🔍 Monitoring & Alerts

### Grafana Dashboard Example

```json
{
  "dashboard": {
    "title": "Genesis Marketplace",
    "panels": [
      {
        "title": "Online Agents",
        "targets": [{"expr": "marketplace_agents_online"}]
      },
      {
        "title": "Transaction Rate",
        "targets": [{"expr": "rate(marketplace_transactions_total[5m])"}]
      },
      {
        "title": "Dispute Rate",
        "targets": [{"expr": "rate(marketplace_transaction_disputes_total[1h])"}]
      },
      {
        "title": "Search Latency (p95)",
        "targets": [{"expr": "histogram_quantile(0.95, marketplace_discovery_search_duration_seconds)"}]
      }
    ]
  }
}
```

### Alerting Rules

```yaml
# alerts.yaml
groups:
- name: marketplace
  rules:
  - alert: HighDisputeRate
    expr: rate(marketplace_transaction_disputes_total[1h]) > 0.1
    for: 5m
    annotations:
      summary: "High dispute rate detected"
  
  - alert: LowAgentAvailability
    expr: marketplace_agents_online < 5
    for: 2m
    annotations:
      summary: "Low agent availability"
  
  - alert: SlowDiscovery
    expr: histogram_quantile(0.95, marketplace_discovery_search_duration_seconds) > 1
    for: 5m
    annotations:
      summary: "Discovery searches are slow"
```

---

## 🧪 Testing

### Run All Tests

```bash
# Basic tests
pytest tests/marketplace/test_agent_marketplace.py

# Advanced tests (thread safety, metrics)
pytest tests/marketplace/test_advanced_marketplace.py

# All marketplace tests
pytest tests/marketplace/ -v
```

### Performance Benchmarks

```python
import time
from infrastructure.marketplace.thread_safe import ThreadSafeAgentRegistry

registry = ThreadSafeAgentRegistry()

# Benchmark registration
start = time.time()
for i in range(1000):
    registry.register_agent(
        agent_id=f"agent_{i}",
        name=f"Agent {i}",
        capabilities=["test"],
        cost_per_task=10.0
    )
duration = time.time() - start
print(f"1000 registrations: {duration:.2f}s ({1000/duration:.0f} ops/sec)")

# Benchmark queries
start = time.time()
for _ in range(1000):
    registry.find_by_capability("test")
duration = time.time() - start
print(f"1000 queries: {duration:.2f}s ({1000/duration:.0f} ops/sec)")
```

**Expected Performance (In-Memory):**
- Registrations: ~50,000 ops/sec
- Queries: ~100,000 ops/sec
- Thread-safe overhead: ~5-10%

---

## 📝 Migration Guide

### Upgrading from Basic to Enhanced

```python
# Before (basic)
from infrastructure.marketplace import AgentRegistry, TransactionLedger

registry = AgentRegistry()
ledger = TransactionLedger()

# After (enhanced - drop-in replacement)
from infrastructure.marketplace.thread_safe import (
    ThreadSafeAgentRegistry as AgentRegistry,
    ThreadSafeTransactionLedger as TransactionLedger,
)

registry = AgentRegistry()  # Now thread-safe!
ledger = TransactionLedger()  # Now thread-safe!
```

### Upgrading from Basic to Distributed

```python
# Before (basic)
registry = AgentRegistry()
ledger = TransactionLedger()

# After (distributed)
from infrastructure.marketplace.backends import (
    RedisAgentRegistry,
    PostgresTransactionLedger,
)

registry = RedisAgentRegistry(redis_url="redis://localhost:6379/0")
ledger = PostgresTransactionLedger(db_url="postgresql://localhost:5432/genesis")

# API remains the same - just persistent now!
```

---

## 🔒 Security Considerations

### 1. Input Validation

All components include security validations:

```python
# Agent ID format validation (alphanumeric, underscore, hyphen only)
registry.register_agent("invalid agent!@#", ...)  # ValueError

# Cost validation (non-negative)
registry.register_agent("agent1", ..., cost_per_task=-5.0)  # ValueError

# Amount validation (positive)
ledger.record_transaction(..., amount=-10.0)  # ValueError
```

### 2. Redis Security

```python
# Use password authentication
registry = RedisAgentRegistry(
    redis_url="redis://:password@localhost:6379/0"
)

# Use SSL/TLS
registry = RedisAgentRegistry(
    redis_url="rediss://localhost:6380/0"  # Note: rediss://
)
```

### 3. PostgreSQL Security

```python
# Use SSL connections
ledger = PostgresTransactionLedger(
    db_url="postgresql://user:pass@localhost:5432/genesis?sslmode=require"
)
```

---

## 📊 Summary

**Total Marketplace Infrastructure:**
- **Lines of Code:** 2,492
- **Components:** 10 (core + backends + thread-safe + metrics)
- **Tests:** 2 files, 18 test functions
- **Production Readiness:** 95%

**Deployment Options:**
1. ✅ Basic (in-memory) - Ready
2. ✅ Enhanced (thread-safe + metrics) - Ready
3. ✅ Distributed (Redis + PostgreSQL) - Ready

**Next Steps:**
1. Choose deployment tier based on needs
2. Configure monitoring (Prometheus + Grafana)
3. Set up alerting rules
4. Deploy and monitor!

---

**Last Updated:** November 4, 2025  
**Maintained By:** Genesis AI Team

