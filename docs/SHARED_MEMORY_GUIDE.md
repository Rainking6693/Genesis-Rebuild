# Genesis Shared Memory Guide

**Context7 MCP Research Sources:**
- `/mongodb/mongo-python-driver`: MongoDB async patterns, connection handling, performance optimization
- `/pytest-dev/pytest`: Testing best practices, fixture patterns
- `/mongodb/motor`: Async MongoDB driver documentation

## 1. Overview

Genesis agents collaborate through a multilayer memory fabric that combines fast in-process caches with persistent stores. This guide explains how to work with the shared memory primitives exposed by `infrastructure.memory_store.GenesisMemoryStore`, TTL management (`LangMemTTL`), and higher-level RAG layers.

**Topics Covered:**
- Namespaces and how they map to product features
- Storing, retrieving, and searching memories
- Recommended TTLs and cleanup workflows
- Concurrency and cross-agent coordination patterns
- Troubleshooting common failure modes
- Advanced query patterns
- Security best practices
- Performance optimization
- Production deployment strategies

## 2. Memory Architecture

```text
Agent              ┐
 └─ LangGraph Store ─► InMemoryBackend (per-process)
                      │
                      └── MongoDBBackend (persistent, cross-session)
                            │
                            └── Analytics / RAG pipelines
```

### Architecture Layers

1. **LangGraph Store**: The API surface consumed by agents. Supports async CRUD, searching, tagging, and compression hooks.
2. **Backends**: `InMemoryBackend` for local caching; `MongoDBBackend` for durable storage. The default store uses the in-memory backend but can be constructed with the Mongo backend for persistence.
3. **TTL Manager**: `LangMemTTL` inspects memory metadata and expires entries according to namespace or custom policies.
4. **Agentic RAG**: Builds on the same Mongo backend to support hybrid vector-graph retrieval.

**Context7 Pattern**: /mongodb/mongo-python-driver - async connection architecture

## 3. Namespaces

Namespaces isolate memories and define TTL/caching policies. Genesis uses the following conventions:

| Namespace Type | Example ID       | Purpose                               | Default TTL | Use Case |
|----------------|------------------|---------------------------------------|-------------|----------|
| `agent`        | `qa_agent`       | Individual agent knowledge store      | 30 days     | Agent-specific learned patterns |
| `business`     | `saas_001`       | Cross-agent business context          | 180 days    | Business logic, workflows |
| `system`       | `global`         | System-wide permanent knowledge       | none        | Configuration, schemas |
| `short_term`   | `session_id`     | Scratchpad / ephemeral state          | 24 hours    | Temporary working memory |

### 3.1 Namespace Examples

```python
# Agent-specific memory (30-day TTL)
await memory.save_memory(("agent", "qa_agent"), "jwt_tests", {
    "patterns": ["bearer token", "refresh flow"],
    "last_run": "2025-10-25"
})

# Business-level memory (180-day TTL)
await memory.save_memory(("business", "saas_001"), "deploy_playbook", {
    "steps": ["build", "test", "stage", "prod"],
    "rollback_strategy": "blue-green"
})

# System-level memory (permanent)
await memory.save_memory(("system", "global"), "api_schemas", {
    "v1": {"endpoints": [...]},
    "v2": {"endpoints": [...]}
})

# Short-term session memory (24-hour TTL)
await memory.save_memory(("short_term", "session_abc123"), "user_context", {
    "user_id": "U123",
    "preferences": {"theme": "dark"}
})
```

**Context7 Pattern**: /mongodb/mongo-python-driver - document structure best practices

### 3.2 Custom TTLs

Override defaults via `LangMemTTL.ttl_config` before running cleanup:

```python
ttl = LangMemTTL(mongo_backend)
ttl.ttl_config["agent"] = 1440  # 60 days (minutes)
ttl.ttl_config["business"] = 2160  # 90 days
ttl.ttl_config["short_term"] = 1  # 1 minute for testing
```

## 4. Basic CRUD Operations

### 4.1 Save Memory

```python
store = GenesisMemoryStore()

# Simple save
await store.save_memory(
    namespace=("agent", "qa"),
    key="auth_flow",
    value={"steps": ["login", "verify", "token"]}
)

# With metadata tags (for better search)
await store.save_memory(
    namespace=("agent", "qa"),
    key="jwt_best_practices",
    value={
        "patterns": [...],
        "tags": ["security", "authentication", "jwt"]
    }
)
```

**Context7 Pattern**: /mongodb/mongo-python-driver - async save operations

### 4.2 Get Memory

```python
# Basic retrieval
value = await store.get_memory(("agent", "qa"), "auth_flow")
if value:
    print(value["steps"])
else:
    print("Memory not found")

# With default value
value = await store.get_memory(
    ("agent", "qa"),
    "missing_key",
    default={"steps": []}
)
```

### 4.3 Delete Memory

```python
await store.delete_memory(("agent", "qa"), "auth_flow")
```

### 4.4 Search Memories

```python
# Search within namespace
results = await store.search_memories(
    namespace=("agent", "qa"),
    query="jwt",
    limit=10
)

for memory in results:
    print(memory.key, memory.value)
```

**Operations Summary:**
- `save_memory` validates namespaces and dict payloads, attaches metadata, and emits OTEL spans.
- `get_memory` returns the stored dict or `None`/default if missing.
- `search_memories` performs substring search in the in-memory backend.

## 5. Concurrency Patterns

### 5.1 Multiple Writers (Shared Backend)

Use a shared backend instance when multiple stores must operate on the same dataset:

```python
backend = InMemoryBackend()
store_a = GenesisMemoryStore(backend=backend)
store_b = GenesisMemoryStore(backend=backend)

# Both stores share the same data
await store_a.save_memory(("agent", "qa"), "shared", {"value": 1})
result = await store_b.get_memory(("agent", "qa"), "shared")
assert result["value"] == 1
```

All async writes occur under an internal lock, ensuring atomic updates even when `asyncio.gather` is used.

**Context7 Pattern**: /pytest-dev/pytest - asyncio.gather for concurrent operations

### 5.2 Distributed Agents (MongoDB Backend)

In production, instantiate `MongoDBBackend` and pass it into each store. Genesis prefers environment-driven configuration via `MONGODB_URI` or `/config/mongodb_config.yml`.

```python
# Production pattern
from infrastructure.mongodb_backend import MongoDBBackend

backend = MongoDBBackend(
    connection_uri=os.getenv("MONGODB_URI", "mongodb://localhost:27017"),
    database_name="genesis_prod"
)
await backend.connect()

# All agents use same backend
qa_store = GenesisMemoryStore(backend=backend)
builder_store = GenesisMemoryStore(backend=backend)
```

**Context7 Pattern**: /mongodb/mongo-python-driver - connection pooling

### 5.3 Concurrent Read/Write Pattern

```python
import asyncio

async def reader_agent(store, namespace, key):
    """Agent reading data"""
    for _ in range(100):
        data = await store.get_memory(namespace, key)
        await asyncio.sleep(0.01)

async def writer_agent(store, namespace, key):
    """Agent updating data"""
    for i in range(100):
        await store.save_memory(namespace, key, {"iteration": i})
        await asyncio.sleep(0.01)

# Run concurrently
await asyncio.gather(
    reader_agent(store, ("agent", "qa"), "shared_state"),
    writer_agent(store, ("agent", "qa"), "shared_state")
)
```

**Context7 Pattern**: /pytest-dev/pytest - concurrent async patterns

## 6. TTL Management

### 6.1 Basic Cleanup

```python
ttl = LangMemTTL(store.backend)
stats = await ttl.cleanup_expired()
print(f"{stats['deleted_count']} entries removed")
```

### 6.2 Background Cleanup

```python
# Start background cleanup (runs every hour)
ttl = LangMemTTL(store.backend)
await ttl.start_background_cleanup(interval_seconds=3600)

# Stop when shutting down
await ttl.stop_background_cleanup()
```

### 6.3 Custom TTL Policies

```python
# Configure different TTLs per namespace
ttl.ttl_config = {
    "agent": 30 * 24 * 60,     # 30 days
    "business": 180 * 24 * 60,  # 180 days
    "system": None,             # Never expire
    "short_term": 24 * 60       # 24 hours
}

stats = await ttl.cleanup_expired()
```

**TTL Implementation Details:**
- TTL uses metadata timestamps (`created_at`).
- Default policies can be overridden per namespace.
- Background cleanup is started with `await ttl.start_background_cleanup(interval_seconds=3600)` and stopped with `await ttl.stop_background_cleanup()`.

**Context7 Pattern**: /mongodb/mongo-python-driver - TTL index patterns

## 7. Agentic RAG Integration

### 7.1 Setup

`AgenticRAG` expects an embedding service and Mongo backend. During tests we supply fakes, but production runs require:

```python
from infrastructure.memory.embedding_service import EmbeddingService
from infrastructure.memory.agentic_rag import AgenticRAG

embedding = EmbeddingService()
mongo_backend = MongoDBBackend()
rag = AgenticRAG(embedding_service=embedding, mongodb_backend=mongo_backend)
await rag.connect()
```

### 7.2 Retrieval Modes

- `VECTOR_ONLY`: Pure semantic similarity using embeddings
- `GRAPH_ONLY`: Traverses relationships in knowledge graph
- `HYBRID`: Merges both via Reciprocal Rank Fusion (best accuracy)

```python
# Vector-only retrieval
results = await rag.retrieve(
    query="How do I implement JWT authentication?",
    mode="VECTOR_ONLY",
    top_k=5
)

# Hybrid retrieval (recommended)
results = await rag.retrieve(
    query="JWT best practices",
    mode="HYBRID",
    top_k=10
)
```

**Context7 Pattern**: /mongodb/mongo-python-driver - vector search integration

## 8. Advanced Query Patterns

### 8.1 Filtering by Tags

```python
# Save with tags
await store.save_memory(
    ("agent", "qa"),
    "security_audit_2025",
    {
        "findings": [...],
        "metadata": {"tags": ["security", "2025", "high-priority"]}
    }
)

# Search with tag filter (implementation dependent on backend)
results = await store.search_memories(
    namespace=("agent", "qa"),
    query="security",
    limit=50
)
```

### 8.2 Range Queries (MongoDB Only)

```python
# For MongoDB backend, you can use direct queries
if isinstance(store.backend, MongoDBBackend):
    collection = store.backend._db["memories"]
    recent_memories = await collection.find({
        "namespace": ["agent", "qa"],
        "metadata.created_at": {"$gte": "2025-10-01T00:00:00Z"}
    }).to_list(length=100)
```

### 8.3 Aggregation Patterns

```python
# Count memories per namespace (MongoDB)
if isinstance(store.backend, MongoDBBackend):
    collection = store.backend._db["memories"]
    pipeline = [
        {"$group": {
            "_id": "$namespace",
            "count": {"$sum": 1}
        }}
    ]
    results = await collection.aggregate(pipeline).to_list(length=None)
```

**Context7 Pattern**: /mongodb/mongo-python-driver - aggregation framework

## 9. Security Best Practices

### 9.1 Credential Handling

```python
# ✅ GOOD: Use environment variables
mongo_uri = os.getenv("MONGODB_URI")
backend = MongoDBBackend(connection_uri=mongo_uri, database_name="genesis")

# ❌ BAD: Hardcoded credentials
backend = MongoDBBackend(
    connection_uri="mongodb://user:password@host:27017",
    database_name="genesis"
)
```

### 9.2 Input Validation

```python
# Always validate namespace structure
def validate_namespace(namespace):
    if not isinstance(namespace, tuple):
        raise ValueError("Namespace must be a tuple")
    if len(namespace) != 2:
        raise ValueError("Namespace must have exactly 2 elements")
    if not all(isinstance(x, str) for x in namespace):
        raise ValueError("Namespace elements must be strings")

# Always validate value is a dict
def validate_value(value):
    if not isinstance(value, dict):
        raise ValueError("Value must be a dictionary")
```

### 9.3 Access Control

```python
# Namespace-based access control pattern
AGENT_PERMISSIONS = {
    "qa_agent": [("agent", "qa"), ("system", "global")],
    "builder_agent": [("agent", "builder"), ("business", "saas_001")],
}

async def save_memory_with_auth(agent_id, namespace, key, value):
    """Save memory with permission check"""
    if namespace not in AGENT_PERMISSIONS.get(agent_id, []):
        raise PermissionError(f"{agent_id} cannot access {namespace}")
    await store.save_memory(namespace, key, value)
```

**Context7 Pattern**: /mongodb/mongo-python-driver - authentication patterns

## 10. Performance Optimization

### 10.1 Batch Operations

```python
# ✅ GOOD: Batch writes
async def batch_save(store, namespace, items):
    """Save multiple items efficiently"""
    tasks = [
        store.save_memory(namespace, key, value)
        for key, value in items.items()
    ]
    await asyncio.gather(*tasks)

# ❌ BAD: Sequential writes
async def sequential_save(store, namespace, items):
    for key, value in items.items():
        await store.save_memory(namespace, key, value)
```

### 10.2 Connection Pooling (MongoDB)

```python
# Configure connection pool size
backend = MongoDBBackend(
    connection_uri="mongodb://localhost:27017/?maxPoolSize=50&minPoolSize=10",
    database_name="genesis"
)
```

### 10.3 Indexing Strategy (MongoDB)

```python
# Create indexes for frequently queried fields
if isinstance(backend, MongoDBBackend):
    collection = backend._db["memories"]
    await collection.create_index([("namespace", 1), ("key", 1)], unique=True)
    await collection.create_index([("metadata.created_at", 1)])
    await collection.create_index([("metadata.tags", 1)])
```

**Context7 Pattern**: /mongodb/mongo-python-driver - index optimization

## 11. Monitoring and Observability

### 11.1 OTEL Integration

All memory operations emit OpenTelemetry spans automatically:

```python
# Spans are emitted for:
# - save_memory (duration, size)
# - get_memory (hit/miss rate)
# - search_memories (query time, result count)
# - cleanup_expired (deleted count)
```

### 11.2 Metrics to Track

**Key Performance Indicators:**
- **Hit Rate**: Percentage of successful `get_memory` calls
- **Average Latency**: P50, P95, P99 for each operation
- **Memory Growth**: Total bytes stored over time
- **TTL Efficiency**: Percentage of expired entries cleaned up
- **Connection Pool Utilization**: For MongoDB backend

### 11.3 Health Checks

```python
async def memory_health_check(store):
    """Verify memory store is healthy"""
    try:
        # Test write
        await store.save_memory(
            ("system", "health"),
            "ping",
            {"timestamp": datetime.now().isoformat()}
        )

        # Test read
        result = await store.get_memory(("system", "health"), "ping")

        # Test cleanup
        await store.delete_memory(("system", "health"), "ping")

        return {"status": "healthy", "latency_ms": 10}
    except Exception as e:
        return {"status": "unhealthy", "error": str(e)}
```

**Context7 Pattern**: /mongodb/mongo-python-driver - health check patterns

## 12. Production Deployment

### 12.1 Environment Configuration

```yaml
# config/mongodb_config.yml
production:
  connection_uri: ${MONGODB_URI}
  database_name: genesis_prod
  max_pool_size: 100
  min_pool_size: 20
  server_selection_timeout_ms: 5000

staging:
  connection_uri: mongodb://localhost:27017
  database_name: genesis_staging
  max_pool_size: 50
  min_pool_size: 10
```

### 12.2 Migration Strategy

```python
async def migrate_inmemory_to_mongodb(inmemory_backend, mongo_backend):
    """Migrate data from InMemory to MongoDB"""
    # Connect to MongoDB
    await mongo_backend.connect()

    # Iterate through all namespaces
    for namespace in inmemory_backend._storage.keys():
        for key, memory_item in inmemory_backend._storage[namespace].items():
            await mongo_backend.save_memory(
                namespace,
                key,
                memory_item.value
            )
            print(f"Migrated {namespace}/{key}")
```

### 12.3 Disaster Recovery

```python
# Backup strategy
async def backup_memories(backend, backup_path):
    """Export all memories to JSON for backup"""
    if isinstance(backend, MongoDBBackend):
        collection = backend._db["memories"]
        memories = await collection.find({}).to_list(length=None)

        with open(backup_path, 'w') as f:
            json.dump(memories, f, default=str, indent=2)

# Restore strategy
async def restore_memories(backend, backup_path):
    """Restore memories from JSON backup"""
    with open(backup_path, 'r') as f:
        memories = json.load(f)

    if isinstance(backend, MongoDBBackend):
        collection = backend._db["memories"]
        if memories:
            await collection.insert_many(memories)
```

**Context7 Pattern**: /mongodb/mongo-python-driver - backup and restore patterns

## 13. Best Practices Summary

### Storage Best Practices

1. ✅ Store normalized documents with descriptive keys.
2. ✅ Tag memories (`metadata.tags`) to aid TTL and search.
3. ✅ Record lineage in `relationships` so graph traversal works.
4. ✅ For large blobs, enable compression or store references to external systems.
5. ✅ Monitor metrics emitted by observability spans (duration, hit-rate).

### Concurrency Best Practices

1. ✅ Use shared backend for multiple stores in same process
2. ✅ Use MongoDB backend for distributed agents
3. ✅ Always use `asyncio.gather` for parallel operations
4. ✅ Implement retries for transient failures
5. ✅ Use connection pooling for high-throughput scenarios

### Security Best Practices

1. ✅ Never hardcode credentials
2. ✅ Validate all inputs (namespaces, keys, values)
3. ✅ Implement namespace-based access control
4. ✅ Use TLS for MongoDB connections in production
5. ✅ Regularly rotate credentials

## 14. Troubleshooting

| Symptom                         | Cause                                    | Remedy                                      |
|--------------------------------|------------------------------------------|---------------------------------------------|
| Mongo `ServerSelectionTimeout` | Network issues, wrong URI                | Verify `MONGODB_URI`, network, credentials  |
| TTL not deleting entries       | Invalid metadata timestamps              | Ensure metadata timestamps are ISO strings  |
| Duplicate keys                 | Expected behavior                        | `save_memory` overwrites existing entries   |
| Stale data in RAG              | TTL cleanup not running                  | Run `cleanup_expired()` before retrieval    |
| High memory usage              | No TTL cleanup                           | Enable background cleanup                   |
| Slow queries                   | Missing indexes                          | Create indexes on frequently queried fields |
| Connection pool exhausted      | Too many concurrent operations           | Increase `maxPoolSize` in connection URI    |
| Permission denied              | Wrong credentials or auth mechanism      | Verify MongoDB authentication configuration |

### Common Error Patterns

**ConnectionFailure:**
```python
try:
    await backend.connect()
except ConnectionFailure as e:
    logger.error(f"MongoDB connection failed: {e}")
    # Fall back to InMemory backend
    backend = InMemoryBackend()
```

**ValueError (invalid payload):**
```python
try:
    await store.save_memory(namespace, key, value)
except ValueError as e:
    logger.error(f"Invalid memory payload: {e}")
    # Validate and retry
```

**Context7 Pattern**: /mongodb/mongo-python-driver - error handling patterns

## 15. Testing Checklist

### Unit Tests
- ✅ **Persistence**: Save, recreate store with shared backend, load.
- ✅ **Concurrency**: `asyncio.gather` writing to different keys.
- ✅ **TTL**: Modify `created_at` metadata and run cleanup.
- ✅ **Edge Cases**: Non-dict payloads raise `ValueError`; invalid namespaces are rejected.

### Integration Tests
- ✅ Test with real MongoDB instance
- ✅ Test backend switching (InMemory → MongoDB)
- ✅ Test concurrent pagination
- ✅ Test TTL cleanup during active operations

### Performance Tests
- ✅ Measure latency for 1000 concurrent writes
- ✅ Benchmark search with 100K memories
- ✅ Test memory growth over 24 hours
- ✅ Validate connection pool behavior under load

**Context7 Pattern**: /pytest-dev/pytest - comprehensive testing strategies

## 16. Sample Test Matrix

| Scenario                    | Module/Fixture                        | Purpose |
|-----------------------------|---------------------------------------|---------|
| Cross-session persistence   | `tests/memory/test_memory_persistence.py::test_memory_persists_across_instances` | Verify persistence |
| Concurrent writes           | `test_concurrent_writes_are_isolated` | Test isolation |
| TTL cleanup                 | `test_ttl_cleanup_removes_expired_entries` | Validate TTL |
| MongoDB failure             | `tests/memory/test_memory_edge_cases.py::test_mongodb_connection_failure` | Error handling |
| Concurrent read/write       | `test_concurrent_read_write_isolation` | Race conditions |
| Namespace isolation         | `test_namespace_isolation` | Multi-tenancy |
| Large memory storage        | `test_large_memory_storage_performance` | Performance |
| Backend switching           | `test_backend_switching_resilience` | Migration |

## 17. API Reference

### GenesisMemoryStore

```python
class GenesisMemoryStore:
    async def save_memory(
        self,
        namespace: tuple[str, str],
        key: str,
        value: dict
    ) -> None:
        """Save a memory to the store."""

    async def get_memory(
        self,
        namespace: tuple[str, str],
        key: str,
        default: Optional[dict] = None
    ) -> Optional[dict]:
        """Retrieve a memory from the store."""

    async def delete_memory(
        self,
        namespace: tuple[str, str],
        key: str
    ) -> None:
        """Delete a memory from the store."""

    async def search_memories(
        self,
        namespace: tuple[str, str],
        query: str,
        limit: int = 10
    ) -> list[Memory]:
        """Search memories within a namespace."""
```

### LangMemTTL

```python
class LangMemTTL:
    ttl_config: dict[str, int]  # Namespace -> TTL (minutes)

    async def cleanup_expired(self) -> dict:
        """Remove expired memories, return stats."""

    async def start_background_cleanup(
        self,
        interval_seconds: int = 3600
    ) -> None:
        """Start background TTL cleanup task."""

    async def stop_background_cleanup(self) -> None:
        """Stop background cleanup task."""
```

## 18. DeepSeek-OCR Compression

### 18.1 Compression Pipeline
- ✅ DeepSeek-OCR compressor integrated in `infrastructure/memory/deepseek_compression.py` (Nov 3 2025)
- ✅ LangGraph Store and Agentic RAG automatically compress values above 600 bytes
- ✅ Prometheus metrics (`memory_compression_ratio`, `memory_storage_bytes_saved_total`, `memory_decompression_latency_ms`, `memory_retrieval_accuracy`) exposed for dashboards

```
Incoming JSON → Semantic chunking → Importance scoring → Hierarchical compression
   │               │                      │
   │               │                      ├─ Critical   → full text stored verbatim (zlib+base64)
   │               │                      ├─ Secondary  → summarised to 120 chars
   │               │                      └─ Tertiary   → summarised to 80 chars (shrink-to-fit)
   │               └─ Keyword/length scores (Critical, Secondary, Tertiary heuristics)
   └─ Namespace-aware pass-through for payloads <128 bytes
```

### 18.2 Query-aware Decompression
- Critical chunks are always returned during retrieval even when the query tokens miss.
- Secondary/tertiary summaries are expanded on-demand when token overlap is detected.
- Pass-through mode labels metadata with `mode=pass_through` so downstream agents can skip recompression.

### 18.3 Metadata & Stored Bytes
- `metadata.compression` now includes `algorithm`, `ratio`, `original_bytes`, `compressed_bytes`, `stored_bytes`, and `saved_bytes`.
- Stored bytes track the actual payload written to Mongo vs. raw compressed bytes (used for ROI analysis).
- `saved_bytes` feeds analytics dashboards and the `scripts/analyze_memory_patterns.py` cost-savings report.

### 18.4 Integration Checklist
1. `AgenticRAG._vector_search` decompresses before embedding to maintain semantic fidelity.
2. `GenesisLangGraphStore` compresses values during `put` and transparently decompresses during `get/search`.
3. Dashboard API (`/api/memory/analytics`) reports compression ratio per namespace for the React Flow visualisation.

---

## 19. Future Enhancements

### Planned Features
- ✅ Integrate Redis as a shared hot cache.
- ✅ Expose pagination helpers for Mongo-backed searches.
- ✅ Add metric dashboards for TTL efficiency and memory hit-rates.
- ✅ Strengthen schema validation using Pydantic models.
- ✅ DeepSeek-OCR compression for large values (71% reduction target validated)
- ⏳ Add multi-region replication support
- ⏳ Implement memory quotas per namespace

### Research Integration
- **DeepSeek-OCR**: 71% memory compression (Wei et al., 2025)
- **Agentic RAG**: 94.8% retrieval accuracy (Hariharan et al., 2025)
- **LangGraph Store API**: Persistent memory optimization

---

**Last Updated**: 2025-11-03  
**Maintainers**: Genesis Platform Team  
**Context7 MCP Research**: /mongodb/mongo-python-driver, /pytest-dev/pytest  
**Version**: 2.0 (Enhanced with advanced patterns and production guidance)
