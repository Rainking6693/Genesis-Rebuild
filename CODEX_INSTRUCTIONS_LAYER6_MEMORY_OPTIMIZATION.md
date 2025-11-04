# CODEX INSTRUCTIONS: Layer 6 Memory Optimization
**Assignment Date:** November 3, 2025
**Agent:** Codex (Memory Engineering Specialist)
**Timeline:** 8 hours
**Priority:** HIGH
**Tools:** Context7 MCP + Haiku 4.5 where possible

---

## 🎯 MISSION

Implement DeepSeek-OCR memory compression and memory analytics dashboard for Genesis shared memory system (Layer 6).

**Context:** WaltzRL Safety and Local LLM P1 fixes are complete. Next priority is optimizing the shared memory system with compression and visualization before full Genesis Meta-Agent deployment.

---

## 📋 TASKS

### Task 1: DeepSeek-OCR Memory Compression (5 hours)

**Goal:** Implement 71% memory cost reduction using DeepSeek-OCR compression techniques.

**Research Reference (Use Context7 MCP):**
- Paper: "DeepSeek-OCR: Efficient Memory Compression for Multi-Agent Systems" (Wei et al., 2025)
- Key technique: Optimal context retention with selective compression
- Target: 71% memory reduction without accuracy loss

**Files to Create:**

#### 1. `infrastructure/memory/deepseek_compression.py` (400 lines)
```python
"""
DeepSeek-OCR Memory Compression

Implements optimal context retention with 71% memory reduction.
Based on Wei et al., 2025 research.
"""

class DeepSeekCompressor:
    """
    Compress agent memories using DeepSeek-OCR algorithm.

    Features:
    - Semantic importance scoring
    - Hierarchical compression (keep critical, compress secondary, discard tertiary)
    - Query-aware decompression
    - 71% storage reduction target
    """

    def __init__(self, compression_ratio: float = 0.71):
        """Initialize with target compression ratio."""
        pass

    async def compress_memory(
        self,
        memory_text: str,
        metadata: Dict[str, Any]
    ) -> CompressedMemory:
        """
        Compress memory with OCR (Optimal Context Retention).

        Steps:
        1. Semantic chunking (split into meaningful segments)
        2. Importance scoring (critical/secondary/tertiary)
        3. Hierarchical compression:
           - Critical: Keep verbatim
           - Secondary: Compress with summarization
           - Tertiary: Discard or extreme compression
        4. Store compressed version + compression metadata
        """
        pass

    async def decompress_for_query(
        self,
        compressed_memory: CompressedMemory,
        query: str
    ) -> str:
        """
        Query-aware decompression (expand only relevant parts).
        """
        pass
```

**Key Features:**
- Semantic importance scoring (LLM-based or embedding similarity)
- 3-tier compression (critical/secondary/tertiary)
- Query-aware selective decompression
- Compression metadata tracking

**Integration Points:**
- `infrastructure/memory/langgraph_store.py` (compress before storage)
- `infrastructure/memory/agentic_rag.py` (decompress during retrieval)

---

#### 2. `infrastructure/memory/compression_metrics.py` (150 lines)
```python
"""
Memory Compression Metrics Tracking

Track compression ratios, retrieval accuracy, cost savings.
"""

from prometheus_client import Counter, Gauge, Histogram

memory_compression_ratio = Gauge(
    'memory_compression_ratio',
    'Current memory compression ratio (0-1)',
    ['namespace']
)

memory_storage_bytes_saved = Counter(
    'memory_storage_bytes_saved_total',
    'Total bytes saved through compression',
    ['namespace']
)

memory_retrieval_accuracy = Histogram(
    'memory_retrieval_accuracy',
    'Accuracy of decompressed memory retrieval',
    ['namespace']
)
```

**Metrics to Track:**
- Compression ratio by namespace (agent/business/evolution/consensus)
- Storage bytes saved
- Retrieval accuracy (compare to uncompressed baseline)
- Decompression latency

---

#### 3. `tests/memory/test_deepseek_compression.py` (200 lines)
```python
"""
Tests for DeepSeek-OCR memory compression.
"""

import pytest

class TestDeepSeekCompression:
    """Test suite for memory compression."""

    @pytest.mark.asyncio
    async def test_compression_ratio_target(self):
        """Validate 71% compression ratio achieved."""
        pass

    @pytest.mark.asyncio
    async def test_critical_information_preserved(self):
        """Ensure critical information never lost."""
        pass

    @pytest.mark.asyncio
    async def test_query_aware_decompression(self):
        """Validate query-aware decompression accuracy."""
        pass

    @pytest.mark.asyncio
    async def test_compression_metadata_tracking(self):
        """Validate metadata correctly stored."""
        pass

    # ... 15+ more tests
```

**Test Coverage:**
- Compression ratio validation (target: 71%)
- Information preservation (no critical data loss)
- Query-aware decompression accuracy (95%+ target)
- Performance benchmarks (compression/decompression speed)
- Edge cases (very short memories, very long memories, empty)

---

### Task 2: Memory Analytics Dashboard (3 hours)

**Goal:** Build interactive memory knowledge graph and analytics visualization.

**Files to Create:**

#### 1. `public_demo/dashboard/components/MemoryKnowledgeGraph.tsx` (300 lines)
```typescript
/**
 * Memory Knowledge Graph Visualization
 *
 * Interactive graph showing:
 * - Agent memory interconnections
 * - Business lineage tree (which businesses learned from which)
 * - Consensus patterns heatmap
 * - Memory usage metrics
 */

import React from 'react';
import ReactFlow, { Node, Edge } from 'react-flow-renderer';

interface MemoryGraphNode {
  id: string;
  type: 'agent' | 'business' | 'consensus';
  label: string;
  memoryCount: number;
  connections: string[];
}

export const MemoryKnowledgeGraph: React.FC = () => {
  // Fetch memory graph data from API
  // Render interactive graph with react-flow-renderer
  // Show metrics: most connected nodes, memory clusters, retrieval frequency

  return (
    <div className="memory-graph-container">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        // ... configuration
      />
      <MemoryMetricsPanel />
    </div>
  );
};
```

**Visualization Requirements:**
- Interactive node graph (react-flow-renderer or vis.js)
- Color-coded by memory type (agent=blue, business=green, consensus=gold)
- Node size = memory count
- Edge thickness = connection strength (retrieval frequency)
- Hover tooltips with memory summaries
- Click to expand memory details

---

#### 2. `scripts/analyze_memory_patterns.py` (200 lines)
```python
"""
Memory Pattern Analytics

Analyze memory usage patterns, knowledge graph clustering,
and memory effectiveness scoring.
"""

import networkx as nx
from collections import Counter
from typing import Dict, List, Tuple

class MemoryPatternAnalyzer:
    """Analyze memory patterns and generate insights."""

    async def analyze_retrieval_patterns(self) -> Dict[str, Any]:
        """
        Analyze most-retrieved memory patterns.

        Returns:
        - Top 10 most-retrieved memories
        - Retrieval frequency by namespace
        - Hot vs cold memories (usage heatmap)
        """
        pass

    async def detect_knowledge_communities(self) -> List[List[str]]:
        """
        Detect communities of related agents/businesses using graph clustering.

        Algorithm: Louvain community detection on memory connection graph
        """
        pass

    async def score_memory_effectiveness(self) -> Dict[str, float]:
        """
        Score memory effectiveness per namespace.

        Metrics:
        - Retrieval success rate (found vs not found)
        - Average retrieval accuracy
        - Memory freshness (age distribution)
        - Compression effectiveness (ratio vs accuracy)
        """
        pass
```

**Analytics Reports:**
- Most-retrieved patterns
- Knowledge graph communities (related agents/businesses)
- Memory effectiveness scoring
- Compression impact analysis

---

#### 3. API Endpoint for Dashboard Data
**File:** `public_demo/dashboard/api/memory/graph.ts` (100 lines)
```typescript
/**
 * API endpoint to fetch memory graph data for visualization.
 *
 * GET /api/memory/graph
 * Returns: { nodes: Node[], edges: Edge[], metrics: MemoryMetrics }
 */

export async function GET(request: Request) {
  // Query LangGraph Store for memory connections
  // Build graph structure (nodes + edges)
  // Calculate metrics (compression ratio, retrieval frequency)
  // Return JSON
}
```

---

## 📊 SUCCESS CRITERIA

### Task 1: DeepSeek-OCR Compression
- ✅ Compression ratio: 71% ± 5% (target range: 66-76%)
- ✅ Retrieval accuracy: 95%+ (no critical information loss)
- ✅ All 15+ tests passing (pytest)
- ✅ Compression metadata tracked in Prometheus
- ✅ Integration with LangGraph Store validated

### Task 2: Memory Analytics Dashboard
- ✅ Interactive knowledge graph rendering live memory data
- ✅ Graph shows 100+ nodes (agent + business + consensus memories)
- ✅ Metrics panel displays compression ratio, retrieval stats, memory freshness
- ✅ Analytics script generates comprehensive report (PDF/markdown)
- ✅ Community detection identifies 5+ knowledge clusters

---

## 🔗 INTEGRATION POINTS

### Integrate With:
1. **LangGraph Store** (`infrastructure/memory/langgraph_store.py`)
   - Compress memories before storage
   - Decompress on retrieval
   - Track compression metadata

2. **Agentic RAG** (`infrastructure/memory/agentic_rag.py`)
   - Query-aware decompression during retrieval
   - Hybrid vector-graph search with compressed memories

3. **Prometheus Metrics** (`infrastructure/local_llm_metrics.py`)
   - Export compression metrics to existing metrics server
   - Track cost savings from compression

4. **Dashboard API** (`public_demo/dashboard/api/`)
   - Add `/api/memory/graph` endpoint
   - Add `/api/memory/metrics` endpoint

---

## 🛠️ DEVELOPMENT WORKFLOW

### Step 1: Research (30 min)
- Use Context7 MCP to fetch DeepSeek-OCR paper
- Review Wei et al., 2025 compression algorithm
- Study semantic importance scoring techniques

### Step 2: Implementation (4 hours)
- Implement `DeepSeekCompressor` class
- Add compression metrics
- Write comprehensive tests (15+ tests)
- Validate 71% compression ratio

### Step 3: Dashboard (2.5 hours)
- Build `MemoryKnowledgeGraph` React component
- Create analytics script
- Add API endpoints for dashboard data
- Test with live memory data

### Step 4: Integration (1 hour)
- Integrate with LangGraph Store
- Integrate with Agentic RAG
- Integrate with Prometheus metrics
- Validate end-to-end flow

---

## 📚 RESOURCES

### Use Context7 MCP for:
- DeepSeek-OCR paper (Wei et al., 2025)
- Memory compression techniques
- Semantic importance scoring algorithms
- React Flow visualization library
- NetworkX graph algorithms

### Use Haiku 4.5 for:
- Code generation (compression algorithm)
- Test generation
- Documentation
- Analytics script implementation

### Use Sonnet 4 only for:
- Complex architectural decisions
- Semantic importance scoring algorithm design

---

## 🚨 CRITICAL NOTES

### From Previous Work:
1. **LangGraph Store is already built** - Located in `infrastructure/memory/langgraph_store.py`
2. **4 namespaces configured** - agent, business, evolution, consensus
3. **MongoDB connection ready** - `MONGODB_URI` in `.env`
4. **Prometheus metrics server operational** - Port 9090

### Watch Out For:
- **Don't break existing memory retrieval** - Compression is additive, not destructive
- **Test with large memories** - Validate compression works with 10KB+ texts
- **Monitor decompression latency** - Target <50ms for typical queries
- **Handle MongoDB failures gracefully** - Fallback to uncompressed if compression fails

---

## 📝 DELIVERABLES CHECKLIST

- [ ] `infrastructure/memory/deepseek_compression.py` (400 lines)
- [ ] `infrastructure/memory/compression_metrics.py` (150 lines)
- [ ] `tests/memory/test_deepseek_compression.py` (200 lines, 15+ tests)
- [ ] `public_demo/dashboard/components/MemoryKnowledgeGraph.tsx` (300 lines)
- [ ] `scripts/analyze_memory_patterns.py` (200 lines)
- [ ] `public_demo/dashboard/api/memory/graph.ts` (100 lines)
- [ ] **Tests passing:** 15/15 compression tests (100%)
- [ ] **Compression ratio validated:** 71% ± 5%
- [ ] **Dashboard operational:** Live knowledge graph with 100+ nodes
- [ ] **Analytics report:** Generated PDF/markdown with insights
- [ ] **Documentation:** Update `docs/SHARED_MEMORY_GUIDE.md` with compression section

---

## 🎯 NEXT STEPS AFTER COMPLETION

Once this task is complete:
1. **Report to:** Claude Code (Lead Orchestrator)
2. **Hand off to:** Cora (for Genesis Meta-Agent integration with compressed memory)
3. **Validation:** Hudson security audit of compression (PII leakage risks)

---

**Created:** November 3, 2025
**Owner:** Codex
**Status:** READY TO START
**Estimated Completion:** 8 hours
**Dependencies:** LangGraph Store (already complete), MongoDB (operational)
