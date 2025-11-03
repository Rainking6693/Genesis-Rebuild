# LangGraph Store Integration Guide

**Version:** 1.0
**Date:** November 3, 2025
**Target Audience:** Genesis Agent Developers
**Prerequisites:** Python 3.12+, MongoDB 7.0+, LangGraph v1.0+

---

## Table of Contents

1. [Overview](#overview)
2. [Quick Start](#quick-start)
3. [Namespace Design Patterns](#namespace-design-patterns)
4. [CRUD Operations](#crud-operations)
5. [Integration with Orchestration](#integration-with-orchestration)
6. [Compression and TTL](#compression-and-ttl)
7. [Performance Optimization](#performance-optimization)
8. [Troubleshooting](#troubleshooting)
9. [API Reference](#api-reference)

---

## Overview

The **GenesisLangGraphStore** provides persistent memory storage for multi-agent systems with:

- **Cross-session persistence** - Memories survive agent restarts
- **Namespace isolation** - Agents/businesses/evolution have separate memory spaces
- **TTL policies** - Automatic expiration for temporary memories
- **Compression** - 71% memory reduction via DeepSeek-OCR
- **Compliance** - PII detection and access logging
- **Vector search** - Semantic similarity queries (with Atlas Vector Search)

**Research Foundation:**
- LangGraph Store API v1.0 (LangChain, Sept 2025)
- Agentic RAG (Hariharan et al., 2025) - 94.8% retrieval accuracy
- DeepSeek-OCR compression (Wei et al., 2025) - 71% memory reduction

---

## Quick Start

### Installation

```bash
# Install dependencies
pip install motor pymongo langgraph

# Start MongoDB (Docker)
docker run -d -p 27017:27017 --name genesis-mongo mongo:7.0
```

### Basic Usage

```python
from infrastructure.langgraph_store import GenesisLangGraphStore

# Initialize store
store = GenesisLangGraphStore(
    mongodb_uri="mongodb://localhost:27017/",
    database_name="genesis_memory"
)

# Setup TTL indexes (one-time initialization)
await store.setup_indexes()

# Store agent preferences
await store.put(
    namespace=("agent", "qa_agent"),
    key="preferences",
    value={
        "threshold": 0.95,
        "model": "gpt-4o",
        "max_retries": 3
    }
)

# Retrieve preferences
preferences = await store.get(
    namespace=("agent", "qa_agent"),
    key="preferences"
)

print(preferences)
# Output: {"threshold": 0.95, "model": "gpt-4o", "max_retries": 3}
```

---

## Namespace Design Patterns

Namespaces organize memories into logical groups with different TTL policies.

### Namespace Types

| Type | Format | TTL | Use Case | Example |
|------|--------|-----|----------|---------|
| **agent** | `("agent", agent_name)` | 7 days | Agent configs, learned patterns | `("agent", "qa_agent")` |
| **business** | `("business", business_id)` | 90 days | Business context, customer data | `("business", "ecommerce_001")` |
| **evolution** | `("evolution", generation_id)` | 365 days | SE-Darwin logs, trajectories | `("evolution", "gen_042")` |
| **consensus** | `("consensus", procedure_id)` | Permanent | Verified procedures, best practices | `("consensus", "test_protocol")` |

### Example: Agent Preferences

```python
# Store QA agent preferences (7-day TTL)
await store.put(
    namespace=("agent", "qa_agent"),
    key="test_config",
    value={
        "coverage_threshold": 0.95,
        "timeout_seconds": 300,
        "parallel_workers": 4,
        "preferred_frameworks": ["pytest", "unittest"]
    },
    metadata={
        "created_by": "admin",
        "tags": ["testing", "configuration"]
    }
)
```

### Example: Business Context

```python
# Store business customer data (90-day TTL)
await store.put(
    namespace=("business", "saas_product_001"),
    key="customer_interactions",
    value={
        "total_tickets": 147,
        "avg_resolution_time_hours": 4.2,
        "satisfaction_score": 0.92,
        "top_issues": ["login", "billing", "performance"]
    },
    metadata={
        "business_type": "saas",
        "industry": "fintech"
    }
)
```

### Example: Evolution Trajectories

```python
# Store SE-Darwin evolution trajectory (365-day TTL)
await store.put(
    namespace=("evolution", "generation_42"),
    key="best_trajectory",
    value={
        "code": "def optimize_query(sql): ...",
        "benchmark_score": 0.87,
        "iterations": 15,
        "operators_used": ["revision", "refinement"],
        "convergence_reason": "excellent_score"
    },
    metadata={
        "agent": "qa_agent",
        "task": "optimize_sql_queries",
        "timestamp": "2025-11-03T19:00:00Z"
    }
)
```

### Example: Consensus Memory

```python
# Store verified team procedure (permanent, never expires)
await store.put(
    namespace=("consensus", "deployment_protocol"),
    key="production_checklist",
    value={
        "steps": [
            "Run all tests (95%+ pass rate)",
            "Review code with Cora/Hudson",
            "Validate in staging environment",
            "Get approval from Alex (E2E tests)",
            "Deploy via feature flags (progressive rollout)"
        ],
        "approvers": ["hudson", "cora", "alex"],
        "required_approvals": 3,
        "last_updated": "2025-11-03"
    },
    metadata={
        "verified_by": ["hudson", "cora", "alex"],
        "confidence": 1.0,
        "usage_count": 42
    }
)
```

---

## CRUD Operations

### Put (Create/Update)

```python
# Create new entry or update existing
await store.put(
    namespace=("agent", "builder_agent"),
    key="tech_stack",
    value={
        "backend": "FastAPI",
        "database": "MongoDB",
        "cache": "Redis",
        "deployment": "Docker"
    },
    metadata={
        "last_verified": "2025-11-03",
        "tags": ["architecture", "infrastructure"]
    }
)
```

**Returns:** `None` (no return value, raises exception on error)

**Performance:** <50ms P95 (target)

### Get (Read)

```python
# Retrieve entry by key
tech_stack = await store.get(
    namespace=("agent", "builder_agent"),
    key="tech_stack"
)

if tech_stack:
    print(f"Backend: {tech_stack['backend']}")
else:
    print("Entry not found")
```

**Returns:** `Dict[str, Any]` or `None` if not found

**Performance:** <30ms P95 (target)

### Delete

```python
# Delete entry by key
deleted = await store.delete(
    namespace=("agent", "old_agent"),
    key="deprecated_config"
)

if deleted:
    print("Entry deleted successfully")
else:
    print("Entry not found")
```

**Returns:** `bool` (True if deleted, False if not found)

**Performance:** <50ms P95 (target)

### Search

```python
# Search all entries in namespace
results = await store.search(
    namespace=("agent", "qa_agent"),
    limit=10
)

for entry in results:
    print(f"{entry['key']}: {entry['value']}")

# Search with MongoDB query
results = await store.search(
    namespace=("business", "ecommerce_001"),
    query={"value.satisfaction_score": {"$gt": 0.9}},
    limit=5
)
```

**Returns:** `List[Dict[str, Any]]` with keys: `key`, `value`, `metadata`, `created_at`, `updated_at`

**Performance:** <100ms P95 (target)

### Batch Operations

```python
# Execute multiple operations in parallel
operations = [
    {
        "op": "put",
        "namespace": ("agent", "qa_agent"),
        "key": "config_1",
        "value": {"timeout": 300}
    },
    {
        "op": "get",
        "namespace": ("agent", "qa_agent"),
        "key": "config_2"
    },
    {
        "op": "delete",
        "namespace": ("agent", "old_agent"),
        "key": "deprecated"
    }
]

results = await store.abatch(operations)
# Returns: [None, {...}, True]
```

---

## Integration with Orchestration

### HTDAG (Hierarchical Task Decomposition)

**Use Case:** Persist task DAGs for replay and analysis

```python
from infrastructure.htdag_orchestrator import HTDAGOrchestrator
from infrastructure.langgraph_store import get_store

# Initialize orchestrator with store
store = get_store()
orchestrator = HTDAGOrchestrator()

# Decompose task
task = "Build ecommerce platform with payment integration"
dag = await orchestrator.decompose_task(task)

# Persist DAG to LangGraph Store
await store.put(
    namespace=("evolution", f"htdag_{task[:10]}"),
    key="task_dag",
    value={
        "root_task": task,
        "nodes": [
            {"id": "1", "task": "Setup FastAPI backend", "dependencies": []},
            {"id": "2", "task": "Design MongoDB schema", "dependencies": ["1"]},
            {"id": "3", "task": "Implement Stripe API", "dependencies": ["1", "2"]},
            ...
        ],
        "total_nodes": len(dag.nodes),
        "decomposition_time_ms": 245
    },
    metadata={
        "orchestrator": "htdag",
        "complexity": "high",
        "created_at": "2025-11-03T19:00:00Z"
    }
)

# Retrieve DAG for replay
stored_dag = await store.get(
    namespace=("evolution", f"htdag_{task[:10]}"),
    key="task_dag"
)

print(f"DAG has {stored_dag['total_nodes']} nodes")
```

**Benefits:**
- Replay decomposition without re-running LLM
- Analyze decomposition patterns over time
- Share DAGs across agent instances

### HALO (Logic-Based Routing)

**Use Case:** Store agent preferences and routing decisions

```python
from infrastructure.halo_router import HALORouter
from infrastructure.langgraph_store import get_store

# Initialize router with store
store = get_store()
router = HALORouter(store=store)

# Store agent routing preferences
await store.put(
    namespace=("agent", "qa_agent"),
    key="routing_config",
    value={
        "priority_keywords": ["test", "validation", "qa", "coverage"],
        "expertise_domains": ["pytest", "unittest", "selenium"],
        "load_limit": 10,  # Max concurrent tasks
        "availability": True
    },
    metadata={
        "agent_type": "qa",
        "specialization": "automated_testing"
    }
)

# Route task with stored preferences
task = "Run integration tests for authentication module"
agent = await router.route_task(task)

# Store routing decision for analysis
await store.put(
    namespace=("evolution", "halo_routing"),
    key=f"decision_{task[:10]}",
    value={
        "task": task,
        "selected_agent": agent.name,
        "score": 0.92,
        "alternatives": [
            {"agent": "security_agent", "score": 0.78},
            {"agent": "builder_agent", "score": 0.45}
        ],
        "routing_time_ms": 110
    },
    metadata={
        "router": "halo",
        "routing_mode": "logic_based"
    }
)
```

**Benefits:**
- Persistent agent configurations
- Routing decision history for analysis
- Load balancing based on stored limits

### SE-Darwin (Self-Improving Evolution)

**Use Case:** Archive best trajectories and evolution logs

```python
from agents.se_darwin_agent import SEDarwinAgent
from infrastructure.langgraph_store import get_store

# Initialize agent with store
store = get_store()
darwin = SEDarwinAgent(store=store)

# Run evolution
task = "Optimize SQL query performance"
result = await darwin.evolve(
    task=task,
    initial_code="SELECT * FROM users WHERE ...",
    benchmark_scenarios=[...]
)

# Store best trajectory
await store.put(
    namespace=("evolution", f"darwin_gen_{result.generation}"),
    key="best_trajectory",
    value={
        "code": result.best_code,
        "benchmark_score": result.score,
        "iterations": result.iterations,
        "operators": result.operators_used,
        "convergence": result.convergence_reason,
        "quality_score": result.quality_score
    },
    metadata={
        "task": task,
        "agent": "se_darwin",
        "timestamp": "2025-11-03T19:00:00Z"
    }
)

# Retrieve best trajectories for learning
past_trajectories = await store.search(
    namespace=("evolution", "darwin_gen_*"),
    query={"value.benchmark_score": {"$gt": 0.8}},
    limit=10
)

# Learn from past successes
for traj in past_trajectories:
    print(f"Task: {traj['metadata']['task']}")
    print(f"Score: {traj['value']['benchmark_score']}")
    print(f"Operators: {traj['value']['operators']}")
```

**Benefits:**
- Archive best solutions for reuse
- Learn from past evolution patterns
- Avoid re-evolving solved problems

### SwarmCoordinator (Team Optimization)

**Use Case:** Store team compositions and consensus procedures

```python
from infrastructure.swarm_coordinator import SwarmCoordinator
from infrastructure.langgraph_store import get_store

# Initialize coordinator with store
store = get_store()
coordinator = SwarmCoordinator(store=store)

# Optimize team for task
task = "Build and deploy SaaS product"
team = await coordinator.optimize_team(task)

# Store optimal composition
await store.put(
    namespace=("consensus", "team_compositions"),
    key=f"saas_product_team",
    value={
        "task_type": "saas_product",
        "agents": [
            {"name": "builder_agent", "role": "backend"},
            {"name": "designer_agent", "role": "frontend"},
            {"name": "qa_agent", "role": "testing"},
            {"name": "devops_agent", "role": "deployment"}
        ],
        "cooperation_score": 0.89,
        "success_rate": 0.94,
        "avg_completion_time_hours": 48
    },
    metadata={
        "coordinator": "swarm_pso",
        "verified_by": ["hudson", "cora"],
        "usage_count": 15
    }
)

# Retrieve consensus team for reuse
optimal_team = await store.get(
    namespace=("consensus", "team_compositions"),
    key="saas_product_team"
)

print(f"Optimal team: {[a['name'] for a in optimal_team['agents']]}")
```

**Benefits:**
- Reuse proven team compositions
- Avoid redundant optimization
- Build institutional knowledge

---

## Compression and TTL

### Compression (DeepSeek-OCR)

**Automatic compression for large values (>1000 bytes)**

```python
# Store large value (will be compressed automatically)
large_value = {
    "code": "def complex_function(): ...",  # 5KB of code
    "documentation": "This function implements...",  # 3KB of docs
    "test_results": [...],  # 2KB of test data
}

await store.put(
    namespace=("evolution", "generation_42"),
    key="large_trajectory",
    value=large_value,  # 10KB total
    metadata={"size": "large"}
)

# Retrieval is transparent (automatic decompression)
retrieved = await store.get(
    namespace=("evolution", "generation_42"),
    key="large_trajectory"
)

# Check compression metadata
compression_info = await store.get(
    namespace=("evolution", "generation_42"),
    key="large_trajectory"
)

print(f"Original: {compression_info['metadata']['compression']['original_bytes']} bytes")
print(f"Compressed: {compression_info['metadata']['compression']['compressed_bytes']} bytes")
print(f"Ratio: {compression_info['metadata']['compression']['ratio']:.2f}")
# Output: Original: 10240 bytes, Compressed: 2970 bytes, Ratio: 0.71 (71% reduction)
```

**Configuration:**

```python
import os

# Set compression threshold (default: 1000 bytes)
os.environ["MEMORY_COMPRESSION_MIN_BYTES"] = "1500"

# Disable compression (not recommended)
os.environ["ENABLE_MEMORY_COMPRESSION"] = "false"
```

### TTL (Time-To-Live)

**Automatic expiration based on namespace type**

```python
# Agent config expires after 7 days
await store.put(
    namespace=("agent", "qa_agent"),
    key="temp_config",
    value={"timeout": 300}
)
# MongoDB will auto-delete after 7 days

# Business data expires after 90 days
await store.put(
    namespace=("business", "ecommerce_001"),
    key="customer_data",
    value={"satisfaction": 0.92}
)
# MongoDB will auto-delete after 90 days

# Evolution logs expire after 365 days
await store.put(
    namespace=("evolution", "gen_42"),
    key="trajectory",
    value={"score": 0.87}
)
# MongoDB will auto-delete after 365 days

# Consensus memory NEVER expires
await store.put(
    namespace=("consensus", "deployment_protocol"),
    key="checklist",
    value={"steps": [...]}
)
# Permanent storage
```

**TTL Policy Table:**

| Namespace Type | TTL | Rationale |
|----------------|-----|-----------|
| `agent` | 7 days | Short-term config, high churn |
| `business` | 90 days | Seasonal patterns, quarterly reviews |
| `evolution` | 365 days | Long-term learning, annual analysis |
| `consensus` | Permanent | Institutional knowledge, verified procedures |

---

## Performance Optimization

### Vector Search (MongoDB Atlas)

**For semantic similarity queries (requires Atlas Vector Search index)**

```python
# Setup vector index (one-time)
await store.setup_vector_index(
    namespace=("agent", "qa_agent"),
    embedding_dim=1536,  # OpenAI text-embedding-3-small
    similarity_metric="cosine"
)

# Store memory with embedding
from infrastructure.memory.embedding_service import get_embedding_service

embedding_service = get_embedding_service()
text = "Optimize SQL query for user authentication"
embedding = await embedding_service.embed_text(text)

await store.put(
    namespace=("agent", "qa_agent"),
    key="memory_001",
    value={
        "text": text,
        "embedding": embedding  # 1536-dim vector
    }
)

# Semantic search (finds similar memories)
query = "How to speed up login queries?"
query_embedding = await embedding_service.embed_text(query)

# MongoDB $vectorSearch aggregation
results = await store.vector_search(
    namespace=("agent", "qa_agent"),
    query_embedding=query_embedding,
    top_k=5
)

for result in results:
    print(f"Score: {result['score']:.2f} - {result['value']['text']}")
```

**Performance:** <100ms P95 (with vector index)

### Caching Strategy

```python
# Cache frequently accessed memories in Redis
import redis.asyncio as redis

cache = redis.from_url("redis://localhost:6379")

async def get_with_cache(namespace, key):
    # Check cache first
    cache_key = f"{namespace}:{key}"
    cached = await cache.get(cache_key)

    if cached:
        return json.loads(cached)

    # Fallback to LangGraph Store
    value = await store.get(namespace, key)

    if value:
        # Cache for 5 minutes
        await cache.setex(cache_key, 300, json.dumps(value))

    return value
```

**Benefits:**
- 90%+ cache hit rate for hot data
- <10ms latency for cached reads
- Reduces MongoDB load

### Batch Operations

```python
# Batch put for bulk inserts (faster than individual puts)
operations = [
    {
        "op": "put",
        "namespace": ("agent", f"agent_{i}"),
        "key": "config",
        "value": {"threshold": 0.95}
    }
    for i in range(100)
]

# Execute in parallel (10x faster than sequential)
results = await store.abatch(operations)
```

**Performance:** 100 operations in ~500ms (vs 5s sequential)

---

## Troubleshooting

### Issue: MongoDB Connection Refused

**Symptom:**
```
pymongo.errors.ServerSelectionTimeoutError: localhost:27017: [Errno 111] Connection refused
```

**Solution:**
```bash
# Start MongoDB
docker run -d -p 27017:27017 --name genesis-mongo mongo:7.0

# Verify connection
docker ps | grep genesis-mongo

# Check logs
docker logs genesis-mongo
```

### Issue: Slow Query Performance

**Symptom:** Queries taking >1s

**Diagnosis:**
```python
# Check collection size
stats = await store.db.command("dbStats")
print(f"Database size: {stats['dataSize'] / (1024*1024):.2f} MB")

# Check index usage
collection = store._get_collection(("agent", "qa_agent"))
indexes = await collection.index_information()
print(f"Indexes: {indexes}")
```

**Solution:**
```python
# Create missing indexes
await store.setup_indexes()

# For vector search, create Atlas Vector Search index
await store.setup_vector_index(
    namespace=("agent", "qa_agent"),
    embedding_dim=1536
)
```

### Issue: Memory Bloat

**Symptom:** MongoDB using >10GB RAM

**Diagnosis:**
```python
# Check namespace sizes
namespaces = await store.list_namespaces()

for ns in namespaces:
    collection = store._get_collection(ns)
    count = await collection.count_documents({})
    print(f"{ns}: {count} documents")
```

**Solution:**
```python
# Clear old namespaces
await store.clear_namespace(("agent", "old_agent"))

# Verify TTL indexes are active
await store.setup_indexes()

# Manually expire old data
from datetime import datetime, timedelta, timezone

cutoff = datetime.now(timezone.utc) - timedelta(days=7)
collection = store._get_collection(("agent", "qa_agent"))

result = await collection.delete_many({
    "created_at": {"$lt": cutoff}
})

print(f"Deleted {result.deleted_count} old documents")
```

### Issue: Compression Not Working

**Symptom:** Large values not being compressed

**Diagnosis:**
```python
# Check compression config
print(f"Compression enabled: {store.enable_compression}")
print(f"Compression threshold: {store.compression_min_bytes} bytes")

# Check if DeepSeek compressor is available
print(f"Compressor: {store.compressor}")
```

**Solution:**
```bash
# Ensure DeepSeek compression is installed
pip install infrastructure/memory/deepseek_compression

# Enable compression via environment variable
export ENABLE_MEMORY_COMPRESSION=true
export MEMORY_COMPRESSION_MIN_BYTES=1000
```

---

## API Reference

### GenesisLangGraphStore

#### Constructor

```python
GenesisLangGraphStore(
    mongodb_uri: str = "mongodb://localhost:27017/",
    database_name: str = "genesis_memory",
    connection_pool_size: int = 100,
    timeout_ms: int = 5000
)
```

**Parameters:**
- `mongodb_uri`: MongoDB connection string
- `database_name`: Database name for memory storage
- `connection_pool_size`: Max concurrent connections (default: 100)
- `timeout_ms`: Operation timeout in milliseconds (default: 5000)

#### Methods

##### `put(namespace, key, value, metadata=None) -> None`

Store or update a memory.

**Parameters:**
- `namespace`: Tuple (e.g., `("agent", "qa_agent")`)
- `key`: Unique key within namespace
- `value`: Data to store (dict)
- `metadata`: Optional metadata dict

**Raises:** `ValueError`, `TimeoutError`

---

##### `get(namespace, key) -> Optional[Dict[str, Any]]`

Retrieve a memory.

**Parameters:**
- `namespace`: Tuple
- `key`: Key to retrieve

**Returns:** Memory value or `None` if not found

**Raises:** `TimeoutError`

---

##### `delete(namespace, key) -> bool`

Delete a memory.

**Parameters:**
- `namespace`: Tuple
- `key`: Key to delete

**Returns:** `True` if deleted, `False` if not found

**Raises:** `TimeoutError`

---

##### `search(namespace, query=None, limit=100) -> List[Dict[str, Any]]`

Search memories in namespace.

**Parameters:**
- `namespace`: Tuple
- `query`: Optional MongoDB query dict
- `limit`: Max results (default: 100)

**Returns:** List of memory dicts with keys: `key`, `value`, `metadata`, `created_at`, `updated_at`

**Raises:** `TimeoutError`

---

##### `setup_indexes() -> Dict[str, Any]`

Create TTL indexes (one-time initialization).

**Returns:** Index creation results per namespace type

---

##### `health_check() -> Dict[str, Any]`

Check MongoDB connection health.

**Returns:** Health status dict with `status`, `database`, `collections`, `size_mb`, `connected`

---

##### `close() -> None`

Close MongoDB connection (call during shutdown).

---

### Helper Functions

##### `get_store(mongodb_uri="mongodb://localhost:27017/", **kwargs) -> GenesisLangGraphStore`

Get or create singleton store instance.

**Parameters:**
- `mongodb_uri`: MongoDB connection string
- `**kwargs`: Additional arguments for GenesisLangGraphStore

**Returns:** Singleton store instance

---

## Best Practices

### 1. Use Namespaces Wisely

```python
# GOOD: Specific namespace per agent
await store.put(("agent", "qa_agent"), "config", {...})

# BAD: Generic namespace for all agents
await store.put(("agent", "all"), "qa_config", {...})
```

### 2. Choose Correct TTL

```python
# GOOD: Permanent for verified procedures
await store.put(("consensus", "deployment"), "checklist", {...})

# BAD: Permanent for temporary config
await store.put(("consensus", "temp_config"), {...})  # Will never expire!
```

### 3. Add Meaningful Metadata

```python
# GOOD: Rich metadata for debugging
await store.put(
    ("agent", "qa_agent"),
    "test_run_001",
    {"passed": 95, "failed": 5},
    metadata={
        "commit": "abc123",
        "branch": "main",
        "timestamp": "2025-11-03T19:00:00Z",
        "triggered_by": "hudson"
    }
)

# BAD: No metadata
await store.put(("agent", "qa_agent"), "test_run_001", {"passed": 95})
```

### 4. Handle Errors Gracefully

```python
# GOOD: Try-catch with fallback
try:
    value = await store.get(("agent", "qa_agent"), "config")
    if value is None:
        # Use default config
        value = {"threshold": 0.95}
except TimeoutError:
    # Fallback to cached config
    value = get_cached_config()
except Exception as e:
    logger.error(f"Store error: {e}")
    value = get_default_config()

# BAD: No error handling
value = await store.get(("agent", "qa_agent"), "config")  # May raise!
threshold = value["threshold"]  # May be None!
```

### 5. Use Batch Operations for Bulk Inserts

```python
# GOOD: Batch put (10x faster)
operations = [
    {"op": "put", "namespace": ("agent", f"agent_{i}"), "key": "config", "value": {...}}
    for i in range(100)
]
await store.abatch(operations)

# BAD: Sequential puts (slow)
for i in range(100):
    await store.put(("agent", f"agent_{i}"), "config", {...})
```

---

## Examples

### Example 1: Agent Memory Lifecycle

```python
from infrastructure.langgraph_store import get_store
from datetime import datetime, timezone

store = get_store()

# Agent learns a pattern
await store.put(
    namespace=("agent", "qa_agent"),
    key="test_pattern_001",
    value={
        "pattern": "authentication_tests",
        "success_rate": 0.92,
        "avg_time_seconds": 4.5,
        "last_used": datetime.now(timezone.utc).isoformat()
    },
    metadata={
        "learned_from": "test_run_042",
        "confidence": 0.89
    }
)

# Agent retrieves pattern for reuse
pattern = await store.get(("agent", "qa_agent"), "test_pattern_001")

if pattern and pattern["success_rate"] > 0.9:
    print(f"Using high-success pattern: {pattern['pattern']}")
else:
    print("Pattern not reliable, using default")

# Agent updates pattern after use
pattern["success_rate"] = 0.94  # Improved after refinement
pattern["last_used"] = datetime.now(timezone.utc).isoformat()

await store.put(
    namespace=("agent", "qa_agent"),
    key="test_pattern_001",
    value=pattern
)

# After 7 days, pattern auto-expires (TTL policy)
```

### Example 2: Cross-Agent Memory Sharing

```python
# QA agent stores test results
await store.put(
    namespace=("consensus", "test_results"),
    key="auth_module_v2_3",
    value={
        "coverage": 0.96,
        "passing_tests": 147,
        "failing_tests": 6,
        "critical_issues": ["session_timeout_race_condition"],
        "tested_by": "qa_agent",
        "approved_for_production": False
    },
    metadata={
        "module": "authentication",
        "version": "2.3",
        "timestamp": "2025-11-03T19:00:00Z"
    }
)

# Security agent retrieves test results before approval
test_results = await store.get(
    namespace=("consensus", "test_results"),
    key="auth_module_v2_3"
)

if test_results["critical_issues"]:
    print(f"BLOCK deployment: {test_results['critical_issues']}")
else:
    print("APPROVE deployment")

# DevOps agent checks test approval before deployment
approval = await store.get(
    namespace=("consensus", "test_results"),
    key="auth_module_v2_3"
)

if approval and approval["approved_for_production"]:
    print("Deploying to production...")
else:
    print("Deployment blocked by QA/Security")
```

### Example 3: Evolution Archive

```python
# SE-Darwin archives best solution
best_trajectory = {
    "task": "Optimize database query for user search",
    "code": "def optimized_search(query): ...",
    "benchmark_score": 0.91,
    "iterations": 12,
    "operators": ["revision", "refinement"],
    "baseline_score": 0.54,
    "improvement": "68%"
}

await store.put(
    namespace=("evolution", "query_optimization"),
    key="best_solution_2025_11_03",
    value=best_trajectory,
    metadata={
        "agent": "se_darwin",
        "verified_by": "qa_agent",
        "production_ready": True
    }
)

# Future task retrieves archived solution for reuse
query = "How to optimize user search?"
past_solutions = await store.search(
    namespace=("evolution", "query_optimization"),
    query={"value.benchmark_score": {"$gt": 0.85}},
    limit=5
)

if past_solutions:
    best = max(past_solutions, key=lambda s: s["value"]["benchmark_score"])
    print(f"Reusing solution with {best['value']['benchmark_score']:.2f} score")
else:
    print("No archived solutions found, starting from scratch")
```

---

## Next Steps

1. **Setup MongoDB:** `docker run -d -p 27017:27017 mongo:7.0`
2. **Initialize store:** `await store.setup_indexes()`
3. **Store first memory:** Use agent namespace with 7-day TTL
4. **Integrate with orchestration:** Connect HTDAG, HALO, SE-Darwin
5. **Monitor performance:** Check compression ratio and query latency
6. **Scale to production:** Add Redis caching and Atlas Vector Search

**Questions?** Contact River (Memory Engineering Specialist) or consult:
- `/docs/LANGGRAPH_STORE_HYBRID_RAG_ASSESSMENT.md` (full assessment)
- `/infrastructure/langgraph_store.py` (source code)
- LangGraph Store API docs (Context7 MCP: `/langchain-ai/langgraph`)
