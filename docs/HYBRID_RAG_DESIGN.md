# HYBRID RAG DESIGN - PHASE 5.3 DAY 3

**Status:** Design Document - Implementation Pending
**Date:** October 23, 2025
**Owner:** Cora (Architecture) + Thon (Implementation)
**Approved By:** Pending (Required for Day 3 start)

---

## EXECUTIVE SUMMARY

**Goal:** Combine vector similarity search (FAISS) + graph relationship traversal (NetworkX) into unified Hybrid RAG system achieving 94.8% retrieval accuracy (Hariharan et al., 2025 target).

**Key Innovation:** Reciprocal Rank Fusion (RRF) algorithm to merge results from two fundamentally different retrieval systems while preserving both semantic similarity AND relationship context.

**Expected Impact:**
- 94.8% retrieval accuracy (vs 72% vector-only baseline)
- 35% cost savings via better context relevance
- 85% efficiency gain (fewer irrelevant retrievals)
- Zero performance degradation (<200ms P95 target maintained)

---

## 1. ARCHITECTURE OVERVIEW

```
┌─────────────────────────────────────────────────────────────┐
│                    Agent Query                               │
│              "Find all customer support                      │
│               tickets related to billing"                    │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              HybridRAGRetriever                              │
│         (Entry Point for All Agents)                         │
└──────────────┬───────────────────┬──────────────────────────┘
               │                   │
               │                   │
      ┬────────▼────────┬   ┬─────▼──────┬
      │ Vector Search   │   │ Graph      │
      │ (FAISS)         │   │ Traversal  │
      │                 │   │ (NetworkX) │
      │ Semantic        │   │ Relational │
      │ Similarity      │   │ Context    │
      └────────┬────────┘   └─────┬──────┘
               │                   │
               │  Parallel Exec    │
               │  (asyncio.gather) │
               │                   │
               ▼                   ▼
      ┌────────────────┐   ┌──────────────┐
      │ Vector Results │   │ Graph Results│
      │ [mem_1, mem_5, │   │ [mem_1, mem_3│
      │  mem_7, mem_2] │   │  mem_9, mem_4│
      └────────┬───────┘   └──────┬───────┘
               │                   │
               └───────┬───────────┘
                       │
                       ▼
         ┌─────────────────────────┐
         │ Reciprocal Rank Fusion  │
         │ (RRF Algorithm)         │
         │                         │
         │ Score = Σ 1/(k + rank)  │
         │ k = 60 (tunable)        │
         └─────────┬───────────────┘
                   │
                   ▼
         ┌─────────────────────────┐
         │ Re-Ranking + Filtering  │
         │ - De-duplicate          │
         │ - Apply namespace filter│
         │ - Sort by RRF score     │
         │ - Return top_k          │
         └─────────┬───────────────┘
                   │
                   ▼
         ┌─────────────────────────┐
         │ Enriched Results        │
         │ [                       │
         │   {                     │
         │     "memory": {...},    │
         │     "score": 0.95,      │
         │     "sources": ["vector"│
         │                 "graph"]│
         │   }                     │
         │ ]                       │
         └─────────────────────────┘
```

---

## 2. RECIPROCAL RANK FUSION (RRF) ALGORITHM

### 2.1 Mathematical Foundation

**Paper Reference:** "Reciprocal Rank Fusion outperforms Condorcet and individual rank learning methods" (Cormack et al., SIGIR 2009)

**Formula:**
```
RRF_score(memory_id) = Σ (1 / (k + rank_i))
                       i∈systems

Where:
- k = constant (typically 60, prevents high-ranked items from dominating)
- rank_i = position of memory_id in system i's results (1-indexed)
- systems = {vector_search, graph_traversal}
```

**Why RRF Works:**
1. **Rank-based (not score-based)**: Avoids normalization issues between FAISS distances and graph PageRank scores
2. **Reciprocal weighting**: Heavily favors top-ranked results (1st place >> 10th place)
3. **k parameter smoothing**: Prevents single system from dominating fusion
4. **Proven superior**: Outperforms weighted averaging, Borda count, and other fusion methods

### 2.2 Example Calculation

**Query:** "Find customer support tickets about billing issues"

**Vector Search Results (FAISS):**
1. memory_001 (distance: 0.15) → rank 1
2. memory_003 (distance: 0.22) → rank 2
3. memory_007 (distance: 0.31) → rank 3
4. memory_005 (distance: 0.45) → rank 4

**Graph Traversal Results (NetworkX BFS from seed nodes):**
1. memory_003 (1-hop from seed) → rank 1
2. memory_009 (1-hop from seed) → rank 2
3. memory_001 (2-hop from seed) → rank 3
4. memory_004 (2-hop from seed) → rank 4

**RRF Scores (k=60):**

```python
# memory_001:
RRF = 1/(60+1) + 1/(60+3) = 1/61 + 1/63 = 0.0164 + 0.0159 = 0.0323

# memory_003:
RRF = 1/(60+2) + 1/(60+1) = 1/62 + 1/61 = 0.0161 + 0.0164 = 0.0325  # HIGHEST

# memory_007:
RRF = 1/(60+3) + 0 (not in graph) = 1/63 = 0.0159

# memory_009:
RRF = 0 (not in vector) + 1/(60+2) = 1/62 = 0.0161

# memory_005:
RRF = 1/(60+4) + 0 = 1/64 = 0.0156

# memory_004:
RRF = 0 + 1/(60+4) = 1/64 = 0.0156
```

**Final Ranking:**
1. memory_003 (0.0325) ← Appears in BOTH vector and graph (synergy!)
2. memory_001 (0.0323) ← Appears in both, high in vector, lower in graph
3. memory_009 (0.0161) ← Graph-only discovery
4. memory_007 (0.0159) ← Vector-only discovery
5. memory_005 (0.0156) ← Vector-only, low rank
6. memory_004 (0.0156) ← Graph-only, low rank

**Key Insight:** memory_003 wins because it's strong in BOTH systems, demonstrating RRF's ability to find consensus across retrieval methods.

---

## 3. VECTOR-GRAPH WEIGHT BALANCING

### 3.1 Default Strategy: Equal Weighting (Production Start)

**Decision:** Start with equal weight (50% vector, 50% graph) for production launch.

**Rationale:**
1. **RRF naturally balances** via rank positions (no explicit weights needed)
2. **Hariharan et al. (2025) validation:** Equal weighting achieved 94.8% accuracy
3. **Simplicity:** Avoids premature optimization
4. **Observability:** Monitor which system contributes most to final results

**Implementation:**
```python
async def hybrid_search(
    self,
    query: str,
    top_k: int = 10,
    vector_weight: float = 0.5,  # Not used in pure RRF, reserved for future
    graph_weight: float = 0.5,   # Not used in pure RRF, reserved for future
    rrf_k: int = 60
) -> List[Dict[str, Any]]:
    """
    Pure RRF implementation (weights reserved for future weighted RRF).
    """
    pass
```

### 3.2 Future: Adaptive Weighting (Post-Production Monitoring)

**When to Implement:** After 1-2 weeks of production data collection

**Adaptive Strategy:**
```python
# Monitor which system produces better results per query type
vector_precision_by_query_type = {
    "technical": 0.85,      # Vector excels at technical similarity
    "procedural": 0.72,     # Vector struggles with procedures
    "relational": 0.65      # Vector misses relationships
}

graph_precision_by_query_type = {
    "technical": 0.68,      # Graph misses semantic similarity
    "procedural": 0.91,     # Graph excels at step-by-step flows
    "relational": 0.93      # Graph excels at relationships
}

# Adjust RRF via query-type-specific k values
k_by_query_type = {
    "technical": 45,    # Lower k = vector results dominate
    "procedural": 75,   # Higher k = graph results dominate
    "relational": 80    # Highest k = graph results dominate
}
```

**Implementation Timeline:** Phase 5.4 (Post-Production Optimization)

---

## 4. DE-DUPLICATION STRATEGY

### 4.1 Problem Statement

**Scenario:** memory_003 appears in BOTH vector search results (rank 2) AND graph traversal results (rank 1).

**Without De-duplication:** memory_003 would appear twice in final results, wasting slots.

**With De-duplication:** memory_003 appears once with COMBINED RRF score (0.0325 in example above).

### 4.2 Implementation Strategy

**Phase 1: Collection (Parallel Execution)**
```python
# Execute in parallel
vector_results, graph_results = await asyncio.gather(
    self.vector_db.search(query_embedding, top_k=top_k*2),  # Fetch 2x for fusion
    self.graph_db.traverse(seed_nodes, max_hops=2)
)
```

**Phase 2: RRF Scoring with De-duplication**
```python
# Build RRF score map
rrf_scores: Dict[str, float] = {}
sources: Dict[str, List[str]] = {}  # Track which systems contributed

# Process vector results
for rank, result in enumerate(vector_results, start=1):
    memory_id = result["id"]
    rrf_scores[memory_id] = rrf_scores.get(memory_id, 0.0) + 1 / (rrf_k + rank)
    sources.setdefault(memory_id, []).append("vector")

# Process graph results
for rank, node_id in enumerate(graph_results, start=1):
    rrf_scores[node_id] = rrf_scores.get(node_id, 0.0) + 1 / (rrf_k + rank)
    sources.setdefault(node_id, []).append("graph")

# Sort by RRF score (descending)
ranked_ids = sorted(rrf_scores.keys(), key=lambda x: rrf_scores[x], reverse=True)
```

**Phase 3: Hydration + Return**
```python
# Fetch full memories for top-k unique IDs
final_results = []
for memory_id in ranked_ids[:top_k]:
    memory = await self._hydrate_memory(memory_id)
    if memory:
        memory["_rrf_score"] = rrf_scores[memory_id]
        memory["_sources"] = sources[memory_id]  # ["vector", "graph"] or ["vector"] or ["graph"]
        final_results.append(memory)

return final_results
```

**Key Benefits:**
1. **No duplicate memories** in final results
2. **Consensus bonus:** Memories appearing in both systems get higher scores
3. **Transparency:** `_sources` field shows which systems contributed
4. **Debugging-friendly:** Easy to see if vector/graph/both contributed

---

## 5. PAGERANK INTEGRATION

### 5.1 PageRank Role: SECONDARY RANKING (Not Primary Retrieval)

**Decision:** PageRank is NOT used in primary hybrid search. It's an OPTIONAL post-processing step for relationship-heavy queries.

**Why Secondary Only:**
1. **Performance:** PageRank on 10K+ nodes = 200-500ms (blocks event loop per Hudson's Day 2 audit)
2. **Semantic mismatch:** PageRank identifies "important" nodes, not "relevant" nodes
3. **Query-specific:** Only useful for "show me the most referenced/central memories"

### 5.2 When to Use PageRank

**Use Case 1: "Most Important Memories" Query**
```python
# Agent: "What are the most critical procedures for deployment?"
results = await memory_store.hybrid_search(
    query="deployment procedures",
    top_k=50  # Get broader set
)

# Apply PageRank as secondary filter
important_results = await graph_db.rank_by_centrality(
    node_ids=[r["id"] for r in results],
    metric="pagerank"
)

return important_results[:10]  # Top 10 by importance
```

**Use Case 2: "Expert Discovery"**
```python
# Agent: "Which agent has the most expertise in customer support?"
# Strategy: Find agent with highest PageRank in support-related subgraph
support_memories = await memory_store.hybrid_search(
    query="customer support",
    namespace_filter=("agent", None),  # All agents
    top_k=100
)

# Extract agent subgraph
agent_ids = {m["namespace"][1] for m in support_memories}

# Rank agents by centrality in support domain
expert_agents = await graph_db.rank_by_centrality(
    node_ids=list(agent_ids),
    metric="pagerank"
)
```

### 5.3 Implementation: Async-Wrapped PageRank

**Per Hudson's Day 2 P2 finding**, PageRank MUST be wrapped if used in production:

```python
async def calculate_pagerank(
    self,
    alpha: float = 0.85,
    max_iterations: int = 100
) -> Dict[str, float]:
    """
    Calculate PageRank scores (async-wrapped for production use).

    WARNING: O(n²) complexity. Only use on subgraphs <10K nodes.
    """
    async with self._lock:
        # Wrap NetworkX PageRank (uses numpy internally)
        pagerank_scores = await asyncio.to_thread(
            nx.pagerank,
            self.graph,
            alpha=alpha,
            max_iter=max_iterations
        )

        return pagerank_scores
```

**Performance Target:** <500ms for subgraphs up to 5K nodes

---

## 6. FALLBACK MODES

### 6.1 Graceful Degradation Strategy

**Philosophy:** Never fail the entire search if one system fails. Always return SOME results to the agent.

### 6.2 Fallback Hierarchy

```
┌────────────────────────────────────┐
│ Primary: Hybrid Search (Vector+Graph)│
│ Target: 94.8% accuracy             │
└─────────────┬──────────────────────┘
              │
              ▼
         ┌────────────┐
         │ FAISS Down?│
         │ Graph Down?│
         └─────┬──────┘
               │
       ┌───────┴───────┐
       │               │
       ▼               ▼
┌──────────────┐  ┌──────────────┐
│ Vector-Only  │  │ Graph-Only   │
│ (FAISS OK,   │  │ (Graph OK,   │
│  Graph Down) │  │  FAISS Down) │
│              │  │              │
│ Accuracy:    │  │ Accuracy:    │
│ 72% (baseline)│ │ ~60% (est.)  │
└──────┬───────┘  └──────┬───────┘
       │                 │
       └────────┬────────┘
                │
                ▼
       ┌────────────────┐
       │ Both Systems   │
       │ Down?          │
       └────────┬───────┘
                │
                ▼
       ┌────────────────┐
       │ MongoDB Direct │
       │ Search (Regex) │
       │                │
       │ Accuracy: ~40% │
       │ (Last Resort)  │
       └────────────────┘
```

### 6.3 Implementation

```python
async def hybrid_search(
    self,
    query: str,
    top_k: int = 10,
    fallback_mode: str = "auto"  # "auto", "vector_only", "graph_only", "none"
) -> List[Dict[str, Any]]:
    """
    Hybrid search with automatic fallback.
    """
    try:
        # PRIMARY: Try hybrid search
        return await self._hybrid_search_primary(query, top_k)

    except VectorDatabaseError as e:
        if fallback_mode == "none":
            raise

        logger.warning(f"FAISS unavailable, falling back to graph-only: {e}")
        obs_manager.record_metric("hybrid_search.fallback", 1, labels={"type": "graph_only"})

        return await self._graph_only_search(query, top_k)

    except GraphDatabaseError as e:
        if fallback_mode == "none":
            raise

        logger.warning(f"Graph unavailable, falling back to vector-only: {e}")
        obs_manager.record_metric("hybrid_search.fallback", 1, labels={"type": "vector_only"})

        return await self._vector_only_search(query, top_k)

    except Exception as e:
        if fallback_mode == "none":
            raise

        logger.error(f"Both systems unavailable, falling back to MongoDB regex: {e}")
        obs_manager.record_metric("hybrid_search.fallback", 1, labels={"type": "mongodb_direct"})

        return await self._mongodb_regex_search(query, top_k)


async def _vector_only_search(self, query: str, top_k: int) -> List[Dict[str, Any]]:
    """Fallback: Vector search only."""
    query_embedding = await self.embedding_gen.generate_embedding(query)
    results = await self.vector_db.search(query_embedding, top_k=top_k)

    memories = []
    for result in results:
        memory = await self._hydrate_memory(result["id"])
        if memory:
            memory["_rrf_score"] = 1.0 - result["distance"]  # Convert distance to score
            memory["_sources"] = ["vector"]
            memory["_fallback_mode"] = "vector_only"
            memories.append(memory)

    return memories


async def _graph_only_search(self, query: str, top_k: int) -> List[Dict[str, Any]]:
    """Fallback: Graph traversal only (requires seed nodes from MongoDB)."""
    # Find seed nodes via MongoDB text search
    seed_memories = await self.backend.search(
        namespace=("agent", None),  # All agents
        query=query,
        limit=5  # Use top 5 as seeds
    )

    if not seed_memories:
        # No seeds found, fall back to MongoDB
        return await self._mongodb_regex_search(query, top_k)

    # Traverse graph from seeds
    seed_ids = [m.key for m in seed_memories]
    related_ids = await self.graph_db.traverse(
        start_nodes=seed_ids,
        max_hops=2
    )

    # Hydrate results
    memories = []
    for node_id in list(related_ids)[:top_k]:
        memory = await self._hydrate_memory(node_id)
        if memory:
            memory["_rrf_score"] = 1.0 / (len(memories) + 1)  # Simple rank-based score
            memory["_sources"] = ["graph"]
            memory["_fallback_mode"] = "graph_only"
            memories.append(memory)

    return memories


async def _mongodb_regex_search(self, query: str, top_k: int) -> List[Dict[str, Any]]:
    """Last resort: MongoDB text search (regex-based)."""
    results = await self.backend.search(
        namespace=("agent", None),
        query=query,
        limit=top_k
    )

    memories = []
    for entry in results:
        memory = {
            "namespace": entry.namespace,
            "key": entry.key,
            "value": entry.value,
            "metadata": entry.metadata.to_dict(),
            "_rrf_score": 0.5,  # Neutral score
            "_sources": ["mongodb"],
            "_fallback_mode": "mongodb_direct"
        }
        memories.append(memory)

    return memories
```

### 6.4 Observability for Fallbacks

**Metrics to Track:**
```python
# Fallback frequency
hybrid_search.fallback{type="vector_only"}     # Count
hybrid_search.fallback{type="graph_only"}      # Count
hybrid_search.fallback{type="mongodb_direct"}  # Count

# Fallback accuracy (requires feedback loop)
hybrid_search.fallback_accuracy{type="vector_only"}  # 0.0-1.0
hybrid_search.fallback_accuracy{type="graph_only"}   # 0.0-1.0
```

**Alert Rules:**
```yaml
# Alert if fallback rate exceeds 5%
- alert: HighFallbackRate
  expr: rate(hybrid_search_fallback_total[5m]) / rate(hybrid_search_total[5m]) > 0.05
  for: 10m
  labels:
    severity: warning
  annotations:
    summary: "Hybrid search fallback rate exceeds 5%"
```

---

## 7. PERFORMANCE TARGETS

### 7.1 Latency Targets (P95)

```
Component              Target P95    Allocation
─────────────────────  ──────────   ───────────
Query Embedding        50ms         (OpenAI API)
Vector Search (FAISS)  30ms         (10K vectors)
Graph Traversal (BFS)  40ms         (2-hop from seeds)
RRF Fusion             10ms         (merge 20 results)
Memory Hydration       50ms         (Redis/MongoDB)
────────────────────────────────────────────────
Total Hybrid Search    180ms        (P95 target: <200ms)
```

**Monitoring:**
```python
obs_manager.record_metric(
    "hybrid_search.latency",
    duration_ms,
    unit="ms",
    labels={
        "component": "total",  # or "vector", "graph", "fusion", "hydration"
        "fallback_mode": "none"  # or "vector_only", "graph_only"
    }
)
```

### 7.2 Accuracy Targets

**Primary Metric:** Retrieval Precision@10

```
Mode              Target    Baseline    Improvement
────────────────  ────────  ──────────  ───────────
Vector-Only       72%       72%         (baseline)
Graph-Only        60%       N/A         (est.)
Hybrid (RRF)      94.8%     72%         +22.8 pp
```

**Validation Method:**
```python
# Human-labeled ground truth dataset (100 queries)
ground_truth = load_ground_truth("data/retrieval_validation.json")

# Measure precision@10
precision_at_10 = 0.0
for query, expected_memory_ids in ground_truth:
    results = await hybrid_search(query, top_k=10)
    retrieved_ids = {r["id"] for r in results}

    # Precision = |retrieved ∩ expected| / |retrieved|
    precision = len(retrieved_ids & expected_memory_ids) / 10
    precision_at_10 += precision

precision_at_10 /= len(ground_truth)
print(f"Precision@10: {precision_at_10:.1%}")
```

**Acceptance Criteria:** ≥90% precision@10 (allows 4.8pp margin below 94.8% target)

### 7.3 Cost Targets

**Current (Vector-Only):** $152/month (70% reduction from $500 baseline)

**Target (Hybrid):** $125/month (75% total reduction)

**Cost Breakdown:**
```
Component                  Current    Target    Savings
─────────────────────────  ─────────  ────────  ───────
OpenAI Embeddings          $82/mo     $50/mo    -39% (better caching)
MongoDB Storage            $28/mo     $28/mo    0%
Redis Cache                $42/mo     $42/mo    0%
Compute (VPS)              $0/mo      $5/mo     +$5 (graph processing)
─────────────────────────────────────────────────────
Total                      $152/mo    $125/mo   -18%
```

**Cost Optimization Strategy:**
1. **Embedding cache hit rate:** 40% → 65% (via intelligent seed node selection)
2. **Fewer irrelevant retrievals:** 35% cost savings (Hariharan et al. validated)
3. **Graph-based context reuse:** Traverse once, reuse for multiple queries

---

## 8. IMPLEMENTATION PLAN (DAY 3)

### 8.1 File Structure

```
infrastructure/
├── hybrid_rag_retriever.py          (NEW - 600-700 lines)
│   ├── HybridRAGRetriever class
│   │   ├── __init__()
│   │   ├── hybrid_search()          (main agent-facing API)
│   │   ├── _hybrid_search_primary() (vector + graph fusion)
│   │   ├── _calculate_rrf_scores()  (RRF algorithm)
│   │   ├── _vector_only_search()    (fallback)
│   │   ├── _graph_only_search()     (fallback)
│   │   ├── _mongodb_regex_search()  (last resort)
│   │   ├── _hydrate_memory()        (fetch full memory)
│   │   └── get_stats()              (performance metrics)
│
├── memory_store.py                  (MODIFY - add hybrid_search wrapper)
│   └── async def hybrid_search()    (delegates to HybridRAGRetriever)
│
├── vector_database.py               (EXISTING - no changes)
├── graph_database.py                (EXISTING - no changes)
└── embedding_generator.py           (EXISTING - no changes)

tests/
├── test_hybrid_rag_retriever.py     (NEW - 800-900 lines)
│   ├── TestRRFAlgorithm (8 tests)
│   ├── TestHybridSearch (10 tests)
│   ├── TestFallbackModes (6 tests)
│   ├── TestDeduplication (4 tests)
│   ├── TestPerformance (4 tests)
│   └── TestIntegration (8 tests)
│
└── test_memory_store_hybrid.py      (NEW - 300-400 lines)
    ├── TestAgentFacingAPI (6 tests)
    └── TestEndToEnd (4 tests)

docs/
├── HYBRID_RAG_USAGE.md              (NEW - 500-600 lines)
│   ├── Quick Start
│   ├── API Reference
│   ├── Real-World Examples
│   └── Troubleshooting
│
└── HYBRID_RAG_DESIGN.md             (THIS FILE)
```

### 8.2 Implementation Checklist

**Phase 1: Core Implementation (3-4 hours)**
- [ ] Create `infrastructure/hybrid_rag_retriever.py`
- [ ] Implement `HybridRAGRetriever` class
- [ ] Implement RRF algorithm (`_calculate_rrf_scores`)
- [ ] Implement primary hybrid search path
- [ ] Implement 3 fallback modes
- [ ] Add OTEL observability spans

**Phase 2: Integration (1-2 hours)**
- [ ] Add `hybrid_search()` to `GenesisMemoryStore`
- [ ] Update `memory_store.py` to delegate to retriever
- [ ] Ensure backward compatibility (semantic_search still works)

### 8.2.5 Agent API Specification

**PURPOSE:** This section provides the complete agent-facing API for Hybrid RAG, enabling agents to integrate without reading implementation details.

**AUDIENCE:** All 15 Genesis agents (QA, Support, Builder, Marketing, Legal, Analyst, Deploy, Security, Ops, Admin, Data, ML, Finance, HR, General)

---

#### Complete API: `hybrid_search()`

```python
async def hybrid_search(
    self,
    query: str,
    namespace_filter: Optional[Tuple[str, Optional[str]]] = None,
    top_k: int = 10,
    rrf_k: int = 60,
    fallback_mode: str = "auto"
) -> List[Dict[str, Any]]:
    """
    Search memories using hybrid vector + graph retrieval with RRF fusion.

    This is the PRIMARY agent-facing API for memory retrieval in Phase 5.3+.
    Combines semantic similarity (FAISS vector search) with relationship context
    (NetworkX graph traversal) using Reciprocal Rank Fusion (RRF) algorithm.

    Args:
        query (str, REQUIRED):
            Natural language search query. Can be:
            - Questions: "How do we test authentication after password changes?"
            - Keywords: "billing issues customer support tickets"
            - Descriptions: "Find deployment procedures for microservices"

            Best Practice: Use descriptive queries (5-15 words) for best results.

        namespace_filter (Tuple[str, Optional[str]], optional):
            Filter results to specific namespace:
            - ("agent", "qa_001") = QA agent's memories only
            - ("agent", None) = All agent memories
            - ("business", "saas_001") = Specific business memories
            - None (default) = Search across ALL namespaces

        top_k (int, default: 10):
            Number of results to return. Valid range: 1-1000.
            - Use 1-5 for "find exact match" scenarios
            - Use 5-10 for typical searches
            - Use 10-50 for "broad exploration"
            - Use 50+ for comprehensive analysis

        rrf_k (int, default: 60):
            RRF smoothing parameter. Controls vector/graph balance:
            - Lower k (30-50): Vector results dominate
            - Default k (60): Balanced (proven in literature)
            - Higher k (70-80): Graph results dominate

            NOTE: Most agents should use default. Only tune after production data.

        fallback_mode (str, default: "auto"):
            Fallback behavior when systems fail:
            - "auto": Automatic graceful degradation (RECOMMENDED)
            - "vector_only": Force vector-only search
            - "graph_only": Force graph-only search
            - "none": Raise exception on any failure

    Returns:
        List[Dict[str, Any]]: List of memory dictionaries, sorted by relevance.

        Each result dictionary contains:

        CORE FIELDS (always present):
        - namespace: Tuple[str, str] - Memory namespace
        - key: str - Memory key
        - value: Dict[str, Any] - Full memory value (from backend)
        - metadata: Dict[str, Any] - Memory metadata (created_at, tags, etc.)

        SEARCH METADATA (always present):
        - _rrf_score: float - Relevance score (0.0-1.0, higher = more relevant)
        - _sources: List[str] - Which systems contributed: ["vector", "graph"] or ["vector"] or ["graph"]
        - _search_rank: int - Result ranking (1 = best match, 2 = second, etc.)

        FALLBACK METADATA (present only if fallback used):
        - _fallback_mode: str - Which fallback was used: "vector_only", "graph_only", "mongodb_direct"

    Raises:
        ValueError: If query is empty or top_k is invalid
        VectorDatabaseError: If vector DB fails and fallback_mode="none"
        GraphDatabaseError: If graph DB fails and fallback_mode="none"

    Performance Characteristics:
        - P95 Latency: <200ms (target) for typical queries
        - Concurrency: 100+ concurrent searches supported (non-blocking asyncio)
        - Scale: Tested on 10K-100K memories
        - Cost: ~$0.0000002 per search (OpenAI embeddings)

    Error Handling:
        - Automatic fallback: Vector fails → Graph-only search
        - Automatic fallback: Graph fails → Vector-only search
        - Automatic fallback: Both fail → MongoDB regex search (last resort)
        - Observability: All fallbacks logged + metrics recorded

    Examples:
        See "Real Agent Usage Examples" section below for complete workflows.

    Migration from semantic_search():
        # OLD (Phase 5.1):
        results = await memory_store.semantic_search(
            query="Find bugs",
            agent_id="qa_001",
            top_k=5
        )

        # NEW (Phase 5.3):
        results = await memory_store.hybrid_search(
            query="Find bugs",
            namespace_filter=("agent", "qa_001"),
            top_k=5
        )

        # API changes:
        # - agent_id parameter → namespace_filter=("agent", agent_id)
        # - Return format enhanced with _sources and _rrf_score fields
        # - Backward compatible: semantic_search() still works (logs deprecation warning)
    """
    pass
```

---

#### Migration Guide: `semantic_search()` → `hybrid_search()`

**Phase 5.1 (Vector-Only) → Phase 5.3 (Hybrid):**

**What Changed:**

1. **Retrieval Strategy:**
   - **Old:** Vector-only search (FAISS semantic similarity)
   - **New:** Hybrid search (FAISS vector + NetworkX graph + RRF fusion)

2. **API Signature:**
   ```python
   # OLD
   semantic_search(query: str, agent_id: Optional[str], top_k: int)

   # NEW
   hybrid_search(query: str, namespace_filter: Optional[Tuple[str, Optional[str]]], top_k: int, rrf_k: int, fallback_mode: str)
   ```

3. **Return Format:**
   ```python
   # OLD (semantic_search)
   {
       "namespace": ("agent", "qa_001"),
       "key": "bug_123",
       "value": {...},
       "_search_score": 0.234,  # L2 distance (lower = more similar)
       "_search_rank": 1
   }

   # NEW (hybrid_search)
   {
       "namespace": ("agent", "qa_001"),
       "key": "bug_123",
       "value": {...},
       "metadata": {...},           # NEW: Full metadata included
       "_rrf_score": 0.0325,         # NEW: RRF score (higher = more relevant)
       "_sources": ["vector", "graph"],  # NEW: Contributing systems
       "_search_rank": 1,
       "_fallback_mode": None        # NEW: Only present if fallback used
   }
   ```

**Backward Compatibility:**

✅ **`semantic_search()` still works** and will be maintained for backward compatibility.

```python
async def semantic_search(
    self,
    query: str,
    agent_id: Optional[str] = None,
    namespace_filter: Optional[Tuple[str, str]] = None,
    top_k: int = 5
) -> List[Dict[str, Any]]:
    """
    DEPRECATED: Use hybrid_search() instead.

    This method delegates to hybrid_search() in vector-only fallback mode.
    A deprecation warning is logged but functionality is preserved.
    """
    logger.warning(
        "semantic_search() is deprecated. Use hybrid_search() for better results.",
        extra={"query": query, "top_k": top_k}
    )

    # Convert agent_id to namespace_filter
    if agent_id:
        namespace_filter = ("agent", agent_id)

    # Call hybrid_search with vector-only fallback
    return await self.hybrid_search(
        query=query,
        namespace_filter=namespace_filter,
        top_k=top_k,
        fallback_mode="vector_only"  # Force vector-only for backward compat
    )
```

**Migration Steps (For Agent Developers):**

1. **Immediate Action:** NONE (semantic_search still works)
2. **Week 1 (Optional):** Update to hybrid_search for better results
3. **Week 2-4:** Monitor performance, tune parameters if needed
4. **Post-Production:** Phase out semantic_search once hybrid_search proven

**When to Use Which API:**

| Scenario | Use `semantic_search()` | Use `hybrid_search()` |
|----------|------------------------|----------------------|
| Agent code written before Phase 5.3 | ✅ YES (still works) | ⚠️ Migrate when ready |
| New agent code (Phase 5.3+) | ❌ NO (deprecated) | ✅ YES (recommended) |
| Need relationship context | ❌ NO (vector-only) | ✅ YES (vector + graph) |
| Need fallback modes | ❌ NO (fails on error) | ✅ YES (automatic fallback) |
| Performance critical (<100ms) | ✅ MAYBE (slightly faster) | ⚠️ Test first (200ms target) |

---

#### Real Agent Usage Examples

**Example 1: QA Agent - Find Test Procedures**

```python
"""
Scenario: QA Agent needs to find test procedures for "authentication after password change"
Expected: Hybrid search returns BOTH exact procedure AND related prerequisite tests
"""

from infrastructure.memory_store import GenesisMemoryStore

class QAAgent:
    def __init__(self, memory_store: GenesisMemoryStore):
        self.memory_store = memory_store
        self.namespace = ("agent", "qa_001")

    async def find_test_procedure(self, feature: str) -> Dict[str, Any]:
        """
        Find test procedure for a feature, including prerequisites.

        Returns:
            {
                "main_procedure": {...},
                "prerequisites": [...],
                "related_tests": [...]
            }
        """
        # 1. Search for test procedures
        query = f"How do we test {feature}?"
        results = await self.memory_store.hybrid_search(
            query=query,
            namespace_filter=self.namespace,
            top_k=10
        )

        if not results:
            return {
                "main_procedure": None,
                "prerequisites": [],
                "related_tests": [],
                "error": f"No test procedures found for '{feature}'"
            }

        # 2. Parse results
        main_procedure = results[0]  # Best match

        # 3. Identify prerequisites (from graph relationships)
        prerequisites = [
            r for r in results[1:6]
            if "graph" in r["_sources"]  # Found via graph traversal
            and "prerequisite" in r["value"].get("test_type", "").lower()
        ]

        # 4. Identify related tests (from vector similarity)
        related_tests = [
            r for r in results[1:6]
            if "vector" in r["_sources"]  # Found via semantic similarity
            and r["key"] != main_procedure["key"]
        ]

        # 5. Log search quality
        logger.info(
            f"Found test procedure for '{feature}'",
            extra={
                "feature": feature,
                "main_procedure_score": main_procedure["_rrf_score"],
                "sources": main_procedure["_sources"],
                "prerequisites_count": len(prerequisites),
                "related_tests_count": len(related_tests)
            }
        )

        return {
            "main_procedure": main_procedure["value"],
            "prerequisites": [p["value"] for p in prerequisites],
            "related_tests": [t["value"] for t in related_tests],
            "search_metadata": {
                "query": query,
                "total_results": len(results),
                "rrf_score": main_procedure["_rrf_score"],
                "sources": main_procedure["_sources"]
            }
        }

# USAGE EXAMPLE:
async def test_qa_agent_workflow():
    memory_store = GenesisMemoryStore(...)
    qa_agent = QAAgent(memory_store)

    # QA agent searches for test procedure
    result = await qa_agent.find_test_procedure("password reset flow")

    # Agent uses retrieved context
    assert result["main_procedure"] is not None
    assert len(result["prerequisites"]) > 0  # Graph found dependencies
    assert len(result["related_tests"]) > 0  # Vector found similar tests

    print(f"Main Procedure: {result['main_procedure']['title']}")
    print(f"Prerequisites: {[p['title'] for p in result['prerequisites']]}")
    print(f"Related Tests: {[t['title'] for t in result['related_tests']]}")
```

**Example 2: Support Agent - Find Related Customer Tickets**

```python
"""
Scenario: Support Agent receives ticket "Customer can't complete payment"
Expected: Hybrid search finds similar tickets + resolution procedures
"""

from infrastructure.memory_store import GenesisMemoryStore
from datetime import datetime, timedelta

class SupportAgent:
    def __init__(self, memory_store: GenesisMemoryStore):
        self.memory_store = memory_store
        self.namespace = ("agent", "support_001")

    async def find_similar_tickets(
        self,
        new_ticket_description: str,
        max_age_days: int = 90
    ) -> Dict[str, Any]:
        """
        Find similar historical tickets with successful resolutions.

        Returns:
            {
                "similar_tickets": [...],
                "recommended_solution": {...},
                "confidence": float
            }
        """
        # 1. Search for similar tickets
        query = f"Customer tickets about: {new_ticket_description}"
        results = await self.memory_store.hybrid_search(
            query=query,
            namespace_filter=self.namespace,
            top_k=20  # Get more results for filtering
        )

        if not results:
            return {
                "similar_tickets": [],
                "recommended_solution": None,
                "confidence": 0.0,
                "note": "No similar tickets found"
            }

        # 2. Filter by age and resolution status
        cutoff_date = datetime.now() - timedelta(days=max_age_days)

        similar_tickets = []
        for result in results:
            ticket = result["value"]
            ticket_date = datetime.fromisoformat(ticket["created_at"])

            # Filter: Recent + Resolved + High CSAT
            if (
                ticket_date >= cutoff_date
                and ticket.get("status") == "resolved"
                and ticket.get("csat_score", 0) >= 4.0
            ):
                similar_tickets.append({
                    "ticket": ticket,
                    "relevance_score": result["_rrf_score"],
                    "sources": result["_sources"]
                })

        if not similar_tickets:
            return {
                "similar_tickets": [],
                "recommended_solution": None,
                "confidence": 0.0,
                "note": "No recent successful resolutions found"
            }

        # 3. Recommend best solution (highest relevance + CSAT)
        best_ticket = max(
            similar_tickets,
            key=lambda t: (
                t["relevance_score"] * 0.7 +  # Relevance weight
                t["ticket"]["csat_score"] / 5.0 * 0.3  # CSAT weight
            )
        )

        # 4. Calculate confidence based on relevance and consensus
        avg_relevance = sum(t["relevance_score"] for t in similar_tickets[:5]) / min(5, len(similar_tickets))
        consensus_count = len(similar_tickets)
        confidence = min(1.0, avg_relevance * 0.7 + (consensus_count / 10) * 0.3)

        logger.info(
            f"Found {len(similar_tickets)} similar tickets",
            extra={
                "query": new_ticket_description,
                "similar_count": len(similar_tickets),
                "confidence": confidence,
                "best_ticket_csat": best_ticket["ticket"]["csat_score"]
            }
        )

        return {
            "similar_tickets": [t["ticket"] for t in similar_tickets[:5]],
            "recommended_solution": best_ticket["ticket"]["solution"],
            "confidence": confidence,
            "metadata": {
                "total_results": len(results),
                "filtered_results": len(similar_tickets),
                "best_relevance": best_ticket["relevance_score"],
                "sources": best_ticket["sources"]
            }
        }

# USAGE EXAMPLE:
async def test_support_agent_workflow():
    memory_store = GenesisMemoryStore(...)
    support_agent = SupportAgent(memory_store)

    # New ticket comes in
    new_ticket = "Customer unable to complete payment due to card decline"

    # Agent searches for similar cases
    result = await support_agent.find_similar_tickets(new_ticket)

    # Agent uses recommended solution
    if result["confidence"] > 0.7:
        print(f"High confidence solution found: {result['recommended_solution']}")
        print(f"Based on {len(result['similar_tickets'])} similar tickets")
    else:
        print(f"Low confidence ({result['confidence']:.1%}), escalating to human")
```

**Example 3: Builder Agent - Retrieve Deployment Procedures**

```python
"""
Scenario: Builder Agent needs to deploy microservice with specific configuration
Expected: Hybrid search finds deployment procedure + dependency context
"""

from infrastructure.memory_store import GenesisMemoryStore

class BuilderAgent:
    def __init__(self, memory_store: GenesisMemoryStore):
        self.memory_store = memory_store
        self.namespace = ("agent", "builder_001")

    async def retrieve_deployment_procedure(
        self,
        service_name: str,
        environment: str = "production"
    ) -> Dict[str, Any]:
        """
        Retrieve deployment procedure with dependency context.

        Returns:
            {
                "procedure": {...},
                "dependencies": [...],
                "previous_deployments": [...]
            }
        """
        # 1. Search for deployment procedures
        query = f"Deploy {service_name} to {environment} environment"
        results = await self.memory_store.hybrid_search(
            query=query,
            namespace_filter=self.namespace,
            top_k=15
        )

        if not results:
            # Fallback: Search across all agents (maybe QA or Ops has context)
            logger.warning(f"No deployment procedure in Builder namespace, searching globally")
            results = await self.memory_store.hybrid_search(
                query=query,
                namespace_filter=("agent", None),  # All agents
                top_k=15
            )

        if not results:
            raise ValueError(f"No deployment procedure found for {service_name}")

        # 2. Identify main procedure
        main_procedure = results[0]

        # 3. Extract dependencies (from graph relationships)
        dependencies = []
        for result in results[1:]:
            if "graph" in result["_sources"]:
                dep = result["value"]
                if dep.get("type") == "dependency":
                    dependencies.append(dep)

        # 4. Find previous successful deployments (from vector similarity)
        previous_deployments = []
        for result in results[1:]:
            if "vector" in result["_sources"]:
                deployment = result["value"]
                if (
                    deployment.get("type") == "deployment_record"
                    and deployment.get("status") == "success"
                ):
                    previous_deployments.append(deployment)

        # 5. Check for fallback indicators
        if main_procedure.get("_fallback_mode"):
            logger.warning(
                f"Deployment procedure retrieved via fallback mode: {main_procedure['_fallback_mode']}",
                extra={
                    "service": service_name,
                    "fallback_mode": main_procedure["_fallback_mode"]
                }
            )

        logger.info(
            f"Retrieved deployment procedure for {service_name}",
            extra={
                "service": service_name,
                "environment": environment,
                "dependencies_count": len(dependencies),
                "previous_deployments_count": len(previous_deployments),
                "sources": main_procedure["_sources"]
            }
        )

        return {
            "procedure": main_procedure["value"],
            "dependencies": dependencies[:5],  # Top 5 dependencies
            "previous_deployments": previous_deployments[:3],  # 3 recent successful
            "metadata": {
                "rrf_score": main_procedure["_rrf_score"],
                "sources": main_procedure["_sources"],
                "fallback_mode": main_procedure.get("_fallback_mode")
            }
        }

# USAGE EXAMPLE:
async def test_builder_agent_workflow():
    memory_store = GenesisMemoryStore(...)
    builder_agent = BuilderAgent(memory_store)

    # Builder needs to deploy
    result = await builder_agent.retrieve_deployment_procedure(
        service_name="auth-service",
        environment="production"
    )

    # Agent validates dependencies before deployment
    assert result["procedure"] is not None
    assert len(result["dependencies"]) > 0  # Graph found dependencies

    print(f"Deployment Procedure: {result['procedure']['title']}")
    print(f"Dependencies: {[d['name'] for d in result['dependencies']]}")
    print(f"Success Rate: {len(result['previous_deployments'])}/3 recent deployments")
```

**Example 4: Marketing Agent - Find Campaign Memories**

```python
"""
Scenario: Marketing Agent plans new campaign, needs historical context
Expected: Hybrid search finds similar campaigns + performance metrics + cross-agent insights
"""

from infrastructure.memory_store import GenesisMemoryStore

class MarketingAgent:
    def __init__(self, memory_store: GenesisMemoryStore):
        self.memory_store = memory_store
        self.namespace = ("agent", "marketing_001")

    async def find_campaign_insights(
        self,
        campaign_goal: str,
        target_audience: str
    ) -> Dict[str, Any]:
        """
        Find historical campaign insights for planning.

        Returns:
            {
                "similar_campaigns": [...],
                "best_strategies": [...],
                "cross_agent_insights": [...]
            }
        """
        # 1. Search for similar campaigns
        query = f"Marketing campaigns for {campaign_goal} targeting {target_audience}"
        results = await self.memory_store.hybrid_search(
            query=query,
            namespace_filter=self.namespace,
            top_k=20
        )

        # 2. Also search cross-agent (maybe Support/QA have customer insights)
        cross_agent_results = await self.memory_store.hybrid_search(
            query=f"Customer insights about {campaign_goal}",
            namespace_filter=("agent", None),  # All agents
            top_k=10
        )

        # 3. Filter campaigns by ROI
        high_roi_campaigns = [
            r for r in results
            if r["value"].get("roi", 0) >= 2.0  # 2x ROI threshold
        ]

        # 4. Extract best strategies (from high-performing campaigns)
        best_strategies = []
        for result in high_roi_campaigns:
            campaign = result["value"]
            strategy = {
                "name": campaign["name"],
                "strategy": campaign["strategy"],
                "roi": campaign["roi"],
                "relevance": result["_rrf_score"]
            }
            best_strategies.append(strategy)

        # Sort by ROI * relevance
        best_strategies.sort(
            key=lambda s: s["roi"] * s["relevance"],
            reverse=True
        )

        # 5. Extract cross-agent insights (exclude Marketing namespace)
        cross_agent_insights = [
            {
                "agent": r["namespace"][1],
                "insight": r["value"],
                "relevance": r["_rrf_score"]
            }
            for r in cross_agent_results
            if r["namespace"][1] != "marketing_001"  # Not from Marketing
        ]

        logger.info(
            f"Found campaign insights for '{campaign_goal}'",
            extra={
                "campaign_goal": campaign_goal,
                "similar_campaigns": len(results),
                "high_roi_count": len(high_roi_campaigns),
                "cross_agent_insights": len(cross_agent_insights)
            }
        )

        return {
            "similar_campaigns": [r["value"] for r in results[:10]],
            "best_strategies": best_strategies[:5],
            "cross_agent_insights": cross_agent_insights[:5],
            "metadata": {
                "total_results": len(results),
                "avg_roi": sum(c["value"].get("roi", 0) for c in results) / len(results) if results else 0,
                "cross_agent_count": len(cross_agent_insights)
            }
        }

# USAGE EXAMPLE:
async def test_marketing_agent_workflow():
    memory_store = GenesisMemoryStore(...)
    marketing_agent = MarketingAgent(memory_store)

    # Marketing plans new campaign
    result = await marketing_agent.find_campaign_insights(
        campaign_goal="increase mobile app engagement",
        target_audience="millennials"
    )

    # Agent uses insights to design campaign
    print(f"Found {len(result['similar_campaigns'])} similar campaigns")
    print(f"Best strategies: {[s['name'] for s in result['best_strategies'][:3]]}")
    print(f"Cross-agent insights from: {set(i['agent'] for i in result['cross_agent_insights'])}")
```

**Example 5: Legal Agent - Search Contract Clauses**

```python
"""
Scenario: Legal Agent needs to find contract clauses related to "data retention policies"
Expected: Hybrid search finds exact clauses + related legal precedents + cross-references
"""

from infrastructure.memory_store import GenesisMemoryStore

class LegalAgent:
    def __init__(self, memory_store: GenesisMemoryStore):
        self.memory_store = memory_store
        self.namespace = ("agent", "legal_001")

    async def search_contract_clauses(
        self,
        topic: str,
        contract_type: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Search contract clauses with relationship discovery.

        Returns:
            {
                "primary_clauses": [...],
                "related_clauses": [...],
                "legal_precedents": [...]
            }
        """
        # 1. Build query with contract type filter
        if contract_type:
            query = f"Contract clauses about {topic} in {contract_type} agreements"
        else:
            query = f"Contract clauses about {topic}"

        # 2. Search for contract clauses
        results = await self.memory_store.hybrid_search(
            query=query,
            namespace_filter=self.namespace,
            top_k=20
        )

        if not results:
            return {
                "primary_clauses": [],
                "related_clauses": [],
                "legal_precedents": [],
                "note": f"No contract clauses found for '{topic}'"
            }

        # 3. Separate primary clauses (high relevance) vs related (lower relevance)
        threshold = 0.025  # RRF score threshold

        primary_clauses = [
            r for r in results
            if r["_rrf_score"] >= threshold
            and r["value"].get("clause_type") in ["primary", "mandatory"]
        ]

        related_clauses = [
            r for r in results
            if r["_rrf_score"] < threshold
            or r["value"].get("clause_type") in ["optional", "related"]
        ]

        # 4. Find legal precedents (from graph relationships)
        legal_precedents = [
            r for r in results
            if "graph" in r["_sources"]
            and r["value"].get("type") == "legal_precedent"
        ]

        # 5. Analyze graph vs vector contributions
        vector_only_count = sum(1 for r in results if r["_sources"] == ["vector"])
        graph_only_count = sum(1 for r in results if r["_sources"] == ["graph"])
        both_count = sum(1 for r in results if len(r["_sources"]) == 2)

        logger.info(
            f"Found contract clauses for '{topic}'",
            extra={
                "topic": topic,
                "contract_type": contract_type,
                "primary_count": len(primary_clauses),
                "related_count": len(related_clauses),
                "precedents_count": len(legal_precedents),
                "vector_only": vector_only_count,
                "graph_only": graph_only_count,
                "both_systems": both_count
            }
        )

        return {
            "primary_clauses": [c["value"] for c in primary_clauses],
            "related_clauses": [c["value"] for c in related_clauses[:10]],
            "legal_precedents": [p["value"] for p in legal_precedents[:5]],
            "search_analysis": {
                "total_results": len(results),
                "vector_only": vector_only_count,
                "graph_only": graph_only_count,
                "both_systems": both_count,
                "avg_rrf_score": sum(r["_rrf_score"] for r in results) / len(results)
            }
        }

# USAGE EXAMPLE:
async def test_legal_agent_workflow():
    memory_store = GenesisMemoryStore(...)
    legal_agent = LegalAgent(memory_store)

    # Legal agent searches for clauses
    result = await legal_agent.search_contract_clauses(
        topic="data retention policies",
        contract_type="SaaS"
    )

    # Agent analyzes results
    print(f"Primary Clauses: {len(result['primary_clauses'])}")
    print(f"Related Clauses: {len(result['related_clauses'])}")
    print(f"Legal Precedents: {len(result['legal_precedents'])}")
    print(f"Search Analysis: {result['search_analysis']}")

    # Agent validates graph contribution
    assert result['search_analysis']['graph_only'] > 0, "Graph should find relationships"
    assert result['search_analysis']['both_systems'] > 0, "Hybrid fusion should find consensus"
```

---

#### Error Handling Best Practices

```python
"""
How agents should handle hybrid_search() errors and edge cases.
"""

from infrastructure.memory_store import GenesisMemoryStore
from infrastructure.exceptions import VectorDatabaseError, GraphDatabaseError

async def agent_search_with_error_handling(memory_store: GenesisMemoryStore):
    """
    Comprehensive error handling for hybrid search.
    """
    try:
        # 1. Normal search
        results = await memory_store.hybrid_search(
            query="Find deployment procedures",
            namespace_filter=("agent", "builder_001"),
            top_k=10
        )

        # 2. Check for fallback mode (degraded service)
        if results and results[0].get("_fallback_mode"):
            logger.warning(
                f"Search completed via fallback mode: {results[0]['_fallback_mode']}",
                extra={
                    "fallback_mode": results[0]["_fallback_mode"],
                    "results_count": len(results)
                }
            )
            # Agent may want to notify user of degraded results

        # 3. Check for empty results
        if not results:
            logger.info("No results found, trying broader search")
            # Fallback strategy: Remove namespace filter
            results = await memory_store.hybrid_search(
                query="deployment procedures",  # Broader query
                namespace_filter=None,  # Search all namespaces
                top_k=10
            )

        # 4. Validate result quality
        if results:
            avg_score = sum(r["_rrf_score"] for r in results) / len(results)
            if avg_score < 0.01:  # Low relevance threshold
                logger.warning(
                    f"Low relevance results: avg_score={avg_score:.4f}",
                    extra={"avg_score": avg_score}
                )
                # Agent may want to ask user for clarification

        return results

    except ValueError as e:
        # Invalid input (empty query, negative top_k, etc.)
        logger.error(f"Invalid search parameters: {e}")
        raise

    except VectorDatabaseError as e:
        # Vector DB failed, but should have auto-fallback
        logger.error(f"Vector DB error (fallback should have triggered): {e}")
        # Retry with explicit graph-only mode
        return await memory_store.hybrid_search(
            query="deployment procedures",
            fallback_mode="graph_only"
        )

    except GraphDatabaseError as e:
        # Graph DB failed, but should have auto-fallback
        logger.error(f"Graph DB error (fallback should have triggered): {e}")
        # Retry with explicit vector-only mode
        return await memory_store.hybrid_search(
            query="deployment procedures",
            fallback_mode="vector_only"
        )

    except Exception as e:
        # Unexpected error
        logger.error(f"Unexpected error in hybrid_search: {e}", exc_info=True)
        # Last resort: Fall back to old semantic_search
        return await memory_store.semantic_search(
            query="deployment procedures",
            agent_id="builder_001",
            top_k=10
        )
```

---

#### Performance Optimization Tips

```python
"""
How agents can optimize hybrid_search() performance.
"""

# TIP 1: Use appropriate top_k values
# ✅ GOOD: Request only what you need
results = await memory_store.hybrid_search(query="...", top_k=5)

# ❌ BAD: Over-requesting wastes resources
results = await memory_store.hybrid_search(query="...", top_k=1000)


# TIP 2: Use namespace filters to reduce search space
# ✅ GOOD: Filter to agent's own memories
results = await memory_store.hybrid_search(
    query="...",
    namespace_filter=("agent", "qa_001")  # Reduces search space by 90%
)

# ❌ BAD: Search all namespaces when you only need one
results = await memory_store.hybrid_search(query="...", namespace_filter=None)


# TIP 3: Use descriptive queries (5-15 words)
# ✅ GOOD: Descriptive query
results = await memory_store.hybrid_search(
    query="Find customer support tickets about billing payment failures"
)

# ❌ BAD: Too short (poor semantic matching)
results = await memory_store.hybrid_search(query="billing")


# TIP 4: Cache results for repeated queries
from functools import lru_cache

@lru_cache(maxsize=100)
async def cached_search(query: str, namespace: Tuple[str, str]):
    return await memory_store.hybrid_search(
        query=query,
        namespace_filter=namespace,
        top_k=10
    )


# TIP 5: Use concurrent searches for parallel workflows
results = await asyncio.gather(
    memory_store.hybrid_search("query 1", top_k=5),
    memory_store.hybrid_search("query 2", top_k=5),
    memory_store.hybrid_search("query 3", top_k=5)
)
# All 3 searches run in parallel (non-blocking)
```

---

#### Testing Integration (For Agent Developers)

```python
"""
How to test agent integration with hybrid_search().
"""

import pytest
from infrastructure.memory_store import GenesisMemoryStore

@pytest.fixture
async def memory_store_with_test_data():
    """Fixture: Memory store with pre-populated test data"""
    memory_store = GenesisMemoryStore(...)

    # Populate test memories
    await memory_store.save_memory(
        namespace=("agent", "qa_001"),
        key="test_proc_001",
        value={
            "content": "Test procedure for authentication flow",
            "type": "test_procedure",
            "coverage": 95
        },
        index_for_search=True
    )

    # Add more test data...

    return memory_store


@pytest.mark.asyncio
async def test_agent_can_search_memories(memory_store_with_test_data):
    """Test: Agent can successfully search and retrieve memories"""
    memory_store = memory_store_with_test_data

    # Agent performs search
    results = await memory_store.hybrid_search(
        query="How do we test authentication?",
        namespace_filter=("agent", "qa_001"),
        top_k=5
    )

    # Validate results
    assert len(results) > 0, "Should find at least one result"
    assert results[0]["namespace"] == ("agent", "qa_001")
    assert "test_proc_001" in [r["key"] for r in results]

    # Validate result format
    first_result = results[0]
    assert "_rrf_score" in first_result
    assert "_sources" in first_result
    assert "_search_rank" in first_result
    assert first_result["_sources"] in [["vector"], ["graph"], ["vector", "graph"]]


@pytest.mark.asyncio
async def test_agent_handles_empty_results(memory_store_with_test_data):
    """Test: Agent gracefully handles empty results"""
    memory_store = memory_store_with_test_data

    # Search for non-existent topic
    results = await memory_store.hybrid_search(
        query="nonexistent topic xyz123",
        namespace_filter=("agent", "qa_001"),
        top_k=5
    )

    # Validate empty results handling
    assert results == [] or len(results) == 0
    # Agent should not crash, should handle gracefully
```

---

**END OF SECTION 8.2.5**

**Phase 3: Testing (4-5 hours)**
- [ ] Unit tests for RRF algorithm (8 tests)
- [ ] Integration tests for hybrid search (10 tests)
- [ ] Fallback mode tests (6 tests)
- [ ] De-duplication tests (4 tests)
- [ ] Performance benchmarks (4 tests)
- [ ] End-to-end agent tests (10 tests)
- [ ] **Target:** 42 tests, 90%+ coverage

**Phase 4: Documentation (2 hours)**
- [ ] Create `HYBRID_RAG_USAGE.md` with 5 real-world examples
- [ ] Update `SEMANTIC_SEARCH_USAGE.md` to reference hybrid search
- [ ] Add migration guide (semantic → hybrid)

**Phase 5: Validation (2-3 hours)**
- [ ] Run full test suite (expect 133/133 passing)
- [ ] Performance validation (<200ms P95)
- [ ] Accuracy validation (>90% precision@10 on test set)
- [ ] Request Hudson code review
- [ ] Request Cora architecture review

**Total Estimated Time:** 12-16 hours (Day 3 + early Day 4)

---

## 9. TESTING STRATEGY

### 9.1 Unit Tests: RRF Algorithm

```python
class TestRRFAlgorithm:
    """Test Reciprocal Rank Fusion algorithm correctness."""

    def test_rrf_single_system(self):
        """RRF with one system should equal simple ranking."""
        vector_results = [("mem_1", 1), ("mem_2", 2), ("mem_3", 3)]
        graph_results = []

        scores = calculate_rrf(vector_results, graph_results, k=60)

        # mem_1 should have highest score
        assert scores["mem_1"] > scores["mem_2"] > scores["mem_3"]

    def test_rrf_consensus_bonus(self):
        """Memory in both systems should score higher than single-system."""
        vector_results = [("mem_1", 1), ("mem_2", 2)]
        graph_results = [("mem_2", 1), ("mem_3", 2)]

        scores = calculate_rrf(vector_results, graph_results, k=60)

        # mem_2 appears in both → should beat mem_1 (vector-only rank 1)
        assert scores["mem_2"] > scores["mem_1"]

    def test_rrf_k_parameter_effect(self):
        """Lower k should favor top-ranked items more strongly."""
        vector_results = [("mem_1", 1), ("mem_2", 10)]
        graph_results = []

        scores_k30 = calculate_rrf(vector_results, graph_results, k=30)
        scores_k90 = calculate_rrf(vector_results, graph_results, k=90)

        # With k=30, gap between rank 1 and rank 10 should be larger
        gap_k30 = scores_k30["mem_1"] - scores_k30["mem_2"]
        gap_k90 = scores_k90["mem_1"] - scores_k90["mem_2"]

        assert gap_k30 > gap_k90
```

### 9.2 Integration Tests: Hybrid Search

```python
class TestHybridSearch:
    """Test end-to-end hybrid search functionality."""

    @pytest.mark.asyncio
    async def test_hybrid_search_combines_results(self, memory_store):
        """Hybrid search should return results from both vector and graph."""
        # Setup: Populate memories with relationships
        await memory_store.put(("agent", "support_001"), "ticket_123",
                              {"issue": "billing error"})
        await memory_store.put(("agent", "support_001"), "ticket_456",
                              {"issue": "payment failed"})

        # Create relationship: ticket_456 referenced ticket_123
        await memory_store.graph_db.add_edge(
            "agent:support_001:ticket_456",
            "agent:support_001:ticket_123",
            relationship="references"
        )

        # Search
        results = await memory_store.hybrid_search(
            query="billing issues",
            namespace_filter=("agent", "support_001"),
            top_k=5
        )

        # Should find both tickets
        ticket_ids = {r["key"] for r in results}
        assert "ticket_123" in ticket_ids
        assert "ticket_456" in ticket_ids

        # Should have sources metadata
        for r in results:
            assert "_sources" in r
            assert "_rrf_score" in r

    @pytest.mark.asyncio
    async def test_hybrid_search_deduplicates(self, memory_store):
        """Memory in both systems should appear only once."""
        # ... setup ...

        results = await memory_store.hybrid_search("test", top_k=10)

        # Check no duplicate IDs
        result_ids = [r["id"] for r in results]
        assert len(result_ids) == len(set(result_ids))
```

### 9.3 Performance Tests

```python
class TestPerformance:
    """Validate performance targets."""

    @pytest.mark.asyncio
    async def test_hybrid_search_latency_p95(self, memory_store):
        """P95 latency should be <200ms."""
        # Populate 1000 memories
        # ... setup ...

        latencies = []
        for i in range(100):
            start = time.perf_counter()
            await memory_store.hybrid_search("test query", top_k=10)
            latencies.append((time.perf_counter() - start) * 1000)

        p95 = sorted(latencies)[94]
        print(f"Hybrid Search P95: {p95:.2f}ms")

        assert p95 < 200, f"P95 {p95:.2f}ms exceeds 200ms target"

    @pytest.mark.asyncio
    async def test_concurrent_hybrid_searches_nonblocking(self, memory_store):
        """100 concurrent searches should not block event loop."""
        start = time.time()

        tasks = [
            memory_store.hybrid_search(f"query {i}", top_k=5)
            for i in range(100)
        ]
        results = await asyncio.gather(*tasks)

        elapsed = time.time() - start

        # If blocking: ~20s (100 * 200ms sequential)
        # If non-blocking: <5s (parallel execution)
        assert elapsed < 5.0, f"Searches blocked: {elapsed:.2f}s"
        assert len(results) == 100
```

---

## 10. ACCEPTANCE CRITERIA (DAY 3 COMPLETION)

### 10.1 Code Quality (Hudson Approval)

- [ ] **Score Target:** ≥8.5/10
- [ ] All FAISS/NetworkX operations wrapped in `asyncio.to_thread()`
- [ ] File I/O uses `aiofiles`
- [ ] Comprehensive type hints (≥90% coverage)
- [ ] OTEL observability spans on all critical paths
- [ ] Graceful error handling (no bare exceptions)
- [ ] Zero P0 blockers

### 10.2 Architecture Quality (Cora Approval)

- [ ] **Score Target:** ≥9.0/10
- [ ] Agent-facing API is 1-line simple (`hybrid_search()`)
- [ ] RRF algorithm correctly implemented per SIGIR 2009 paper
- [ ] Fallback modes gracefully degrade
- [ ] Observability enables debugging
- [ ] Integration with existing memory store seamless
- [ ] Zero P0 blockers

### 10.3 Test Coverage

- [ ] **Target:** 42 tests, 90%+ coverage
- [ ] RRF algorithm: 8 unit tests
- [ ] Hybrid search: 10 integration tests
- [ ] Fallback modes: 6 tests
- [ ] De-duplication: 4 tests
- [ ] Performance: 4 benchmarks
- [ ] End-to-end: 10 agent tests
- [ ] All tests passing (42/42)

### 10.4 Performance Validation

- [ ] P95 latency: <200ms (validated via performance tests)
- [ ] Concurrency: 100 searches in <5s (non-blocking proof)
- [ ] Precision@10: ≥90% (validated on test dataset)
- [ ] No event loop blocking under load

### 10.5 Documentation

- [ ] `HYBRID_RAG_USAGE.md` created (500+ lines)
- [ ] 5 real-world examples with complete code
- [ ] Migration guide from semantic_search to hybrid_search
- [ ] Troubleshooting section
- [ ] Performance tuning guide

---

## 11. RISKS & MITIGATION

### Risk 1: RRF Parameter Tuning

**Risk:** k=60 may not be optimal for Genesis workload

**Mitigation:**
1. Start with k=60 (validated in literature)
2. Monitor precision@10 in production
3. A/B test k values (45, 60, 75) after 1 week
4. Implement query-type-specific k values in Phase 5.4

**Likelihood:** Medium
**Impact:** Low (can tune post-launch)

### Risk 2: Graph Traversal Performance

**Risk:** BFS on large graphs (100K+ nodes) may exceed 40ms target

**Mitigation:**
1. Implement max_nodes limit in traversal (cap at 1K nodes)
2. Add early termination (stop at target count)
3. Monitor P95 latency, alert if >40ms
4. Consider GraphDB optimization (pre-computed neighborhoods)

**Likelihood:** Medium
**Impact:** Medium (degrades to vector-only fallback)

### Risk 3: Memory Hydration Bottleneck

**Risk:** Fetching 20 full memories from MongoDB may exceed 50ms

**Mitigation:**
1. Redis cache should handle hot memories (<10ms)
2. Batch MongoDB queries (1 query for N memories)
3. Implement partial hydration (metadata-only for lower-ranked results)

**Likelihood:** Low
**Impact:** Low (already optimized in Phase 5.1)

### Risk 4: Accuracy Below 90% Target

**Risk:** Real-world precision@10 may be lower than 94.8% paper result

**Mitigation:**
1. Create ground truth dataset (100 queries, human-labeled)
2. Measure precision@10 before deployment
3. If <90%, adjust k parameter or implement weighted RRF
4. Iterate until target achieved

**Likelihood:** Medium
**Impact:** High (blocks Phase 5.3 completion)

**Action Plan:**
- Build ground truth dataset in parallel with implementation
- Run validation before requesting final audits

---

## 12. SUCCESS METRICS (POST-DEPLOYMENT)

### 12.1 Technical Metrics (Week 1-2)

```
Metric                        Target         Baseline      Status
────────────────────────────  ─────────────  ────────────  ──────
Hybrid Search P95 Latency     <200ms         N/A           TBD
Precision@10                  ≥90%           72% (vector)  TBD
Fallback Rate                 <5%            0%            TBD
Cache Hit Rate (Embeddings)   ≥65%           40%           TBD
Cost per 1K Searches          $0.50          $0.75         TBD
```

### 12.2 Business Metrics (Week 3-4)

```
Metric                        Target         Baseline      Status
────────────────────────────  ─────────────  ────────────  ──────
Agent Query Success Rate      ≥85%           ~70%          TBD
Average Retrieval Relevance   ≥4.0/5.0       3.2/5.0       TBD
Cross-Agent Memory Reuse      ≥30%           0%            TBD
Total Memory System Cost      $125/mo        $152/mo       TBD
```

### 12.3 Monitoring Dashboard

**Grafana Dashboard: "Hybrid RAG Performance"**

**Panel 1: Latency Breakdown (Stacked Area Chart)**
- Query Embedding: 50ms
- Vector Search: 30ms
- Graph Traversal: 40ms
- RRF Fusion: 10ms
- Hydration: 50ms
- **Total: 180ms (target line at 200ms)**

**Panel 2: Accuracy Trend (Line Chart)**
- Precision@10 over time
- Target line at 90%
- Alert threshold at 85%

**Panel 3: Fallback Rate (Gauge)**
- Current fallback rate: X%
- Target: <5%
- Color coding: Green <2%, Yellow 2-5%, Red >5%

**Panel 4: Cost Tracking (Line Chart)**
- Daily cost projection
- Target: $125/month ($4.17/day)

---

## 13. NEXT STEPS (POST-DAY 3)

### Phase 5.3 Days 4-5: Benchmarks + Validation

**Day 4 Tasks:**
1. Create ground truth dataset (100 queries, human-labeled expected results)
2. Run precision@10 validation on test set
3. Performance benchmarking (1K, 10K, 100K memory scales)
4. Cost analysis (projected monthly cost)
5. Request Alex E2E testing with screenshots

**Day 5 Tasks:**
1. Address any findings from Alex's E2E tests
2. Production deployment preparation
3. Monitoring dashboard creation (Grafana)
4. Runbook documentation (incident response)
5. Final approval from Hudson, Cora, Alex

### Phase 5.4: Production Agent Integration

**Timeline:** Week 4 (November 2025)

**Agents to Integrate:**
1. QA Agent (test procedure retrieval)
2. Support Agent (customer ticket context)
3. Builder Agent (deployment procedure lookup)
4. Marketing Agent (campaign memory)
5. Legal Agent (contract clause search)

**Validation Per Agent:**
- 5 real-world queries per agent
- Measure precision@10 per agent
- User acceptance testing
- Performance validation (<200ms P95)

---

## 14. REFERENCES

### Academic Papers

1. **Hariharan et al. (2025):** "Agentic RAG: Turbocharging Retrieval-Augmented Generation Through Multi-Agent Orchestration"
   - arXiv:2504.15228
   - Source: Hybrid vector-graph architecture, 94.8% accuracy target

2. **Cormack et al. (2009):** "Reciprocal Rank Fusion outperforms Condorcet and individual rank learning methods"
   - SIGIR 2009
   - Source: RRF algorithm, k=60 default

3. **Wei et al. (2025):** "DeepSeek-OCR: A Memory-Efficient Visual Compression Model"
   - Source: Memory cost reduction techniques (Phase 5.2)

4. **Pauloski et al. (2025):** "Agentic Discovery: Multi-Agent Collective Learning"
   - Source: Cross-agent memory reuse patterns

### Implementation References

1. **LangGraph Store API:** https://langchain-ai.github.io/langgraph/cloud/reference/store/
2. **FAISS Documentation:** https://github.com/facebookresearch/faiss/wiki
3. **NetworkX Algorithms:** https://networkx.org/documentation/stable/reference/algorithms/
4. **OpenAI Embeddings API:** https://platform.openai.com/docs/guides/embeddings

### Genesis Internal Documentation

1. `ASYNC_WRAPPER_PATTERN.md` - Mandatory async patterns
2. `SEMANTIC_SEARCH_USAGE.md` - Vector-only search guide
3. `PHASE_5_ROADMAP.md` - Complete Phase 5 timeline
4. `HUDSON_CODE_REVIEW_PHASE_5_3_DAY2.md` - Day 2 audit results
5. `CORA_ARCHITECTURE_AUDIT_PHASE_5_3_DAY2.md` - Day 2 architecture review

---

## APPENDIX A: RRF ALGORITHM PSEUDOCODE

```python
def reciprocal_rank_fusion(
    vector_results: List[Tuple[str, int]],  # (memory_id, rank)
    graph_results: List[Tuple[str, int]],   # (memory_id, rank)
    k: int = 60
) -> Dict[str, float]:
    """
    Reciprocal Rank Fusion algorithm.

    Args:
        vector_results: List of (memory_id, rank) from vector search
        graph_results: List of (memory_id, rank) from graph traversal
        k: Constant to prevent top-ranked items from dominating (default: 60)

    Returns:
        Dict mapping memory_id to RRF score (higher = better)
    """
    rrf_scores = {}

    # Process vector results
    for memory_id, rank in vector_results:
        rrf_scores[memory_id] = rrf_scores.get(memory_id, 0.0) + 1 / (k + rank)

    # Process graph results
    for memory_id, rank in graph_results:
        rrf_scores[memory_id] = rrf_scores.get(memory_id, 0.0) + 1 / (k + rank)

    return rrf_scores


def rank_by_rrf(rrf_scores: Dict[str, float]) -> List[str]:
    """
    Sort memory IDs by RRF score (descending).

    Returns:
        List of memory IDs sorted by relevance
    """
    return sorted(rrf_scores.keys(), key=lambda x: rrf_scores[x], reverse=True)
```

---

## APPENDIX B: EXAMPLE QUERIES

### Example 1: Customer Support (Benefits from Graph Relationships)

**Query:** "Find all support tickets related to billing issues in the last month"

**Expected Behavior:**
1. **Vector search:** Finds tickets with "billing", "invoice", "payment" keywords
2. **Graph traversal:** Finds related tickets via "duplicates", "references", "escalated_to" edges
3. **RRF fusion:** Prioritizes tickets that appear in BOTH (consensus)

**Why Hybrid Wins:**
- Vector might miss tickets that say "charge" instead of "billing"
- Graph finds related tickets even if keywords differ
- Combined: Comprehensive coverage of billing issue cluster

### Example 2: QA Test Procedures (Benefits from Semantic Similarity)

**Query:** "How do we test authentication after password changes?"

**Expected Behavior:**
1. **Vector search:** Finds procedures semantically similar to "authentication testing"
2. **Graph traversal:** Finds related procedures via "depends_on", "similar_to" edges
3. **RRF fusion:** Returns both direct matches AND related context

**Why Hybrid Wins:**
- Vector finds exact procedure for password change testing
- Graph finds prerequisite tests (login validation, session management)
- Combined: Complete test workflow, not just single procedure

### Example 3: Cross-Agent Knowledge (Benefits from Relationship Discovery)

**Query:** "Which agents have worked on the user registration feature?"

**Expected Behavior:**
1. **Vector search:** Finds memories mentioning "user registration"
2. **Graph traversal:** Follows "created_by", "modified_by" edges to find all contributors
3. **RRF fusion:** Ranks agents by contribution frequency

**Why Hybrid Wins:**
- Vector finds feature-related memories
- Graph discovers agent collaboration network
- Combined: Complete picture of who knows what

---

## DOCUMENT APPROVAL

**Created By:** Cora (Architecture Lead)
**Reviewed By:** Pending
**Approved By:** Pending

**Approval Criteria:**
- [ ] Hudson (Code Review): Confirm implementation feasibility
- [ ] Thon (Implementation): Confirm design is implementable in 12-16 hours
- [ ] Alex (E2E Testing): Confirm test strategy is comprehensive

**Once approved, proceed to Phase 5.3 Day 3 implementation.**

---

**END OF DESIGN DOCUMENT**
