# PHASE 5 ROADMAP - Layer 6 Shared Memory Integration

**Status:** 🚀 IN PROGRESS (Started October 22, 2025)
**Timeline:** 3 weeks (Oct 22 - Nov 12, 2025)
**Goal:** 75% total cost reduction via intelligent memory system
**Lead:** River (memory engineering), Cora (architecture)

---

## 🎯 OBJECTIVES

**Primary Goals:**
1. **Memory Compression:** DeepSeek-OCR integration (71% memory cost reduction)
2. **Persistent Storage:** LangGraph Store API + MongoDB + Redis
3. **Semantic Retrieval:** Hybrid RAG (vector + graph) for agent memory
4. **Cross-Business Learning:** Business #100 learns from businesses #1-99

**Success Metrics:**
- ✅ 75% total cost reduction ($500/month → $125/month)
- ✅ 10-20x memory compression (text → visual tokens)
- ✅ <100ms memory retrieval latency
- ✅ 94.8% retrieval accuracy (Agentic RAG benchmark)
- ✅ Zero capability degradation

---

## 📊 CURRENT STATE (October 22, 2025)

**What's Already Working:**
- ✅ Layer 1-3: Orchestration complete (HTDAG + HALO + AOP)
- ✅ Layer 2: SE-Darwin evolution (50% → 80% SWE-bench target)
- ✅ Layer 5: Swarm optimization (261.8% improvement validated)
- ✅ Cost optimization: 52% reduction (DAAO 48% + TUMIX 15%)
- ✅ OTEL observability with correlation IDs

**What's Missing (Layer 6):**
- ❌ Persistent memory (MongoDB/Redis not integrated)
- ❌ Vector DB for semantic retrieval
- ❌ Memory compression (DeepSeek-OCR)
- ❌ Cross-business learning mechanisms
- ❌ Consensus memory (verified procedures)

---

## 📅 3-WEEK IMPLEMENTATION PLAN

### **WEEK 1: LangGraph Store + MongoDB Integration (Oct 22-28)**

**Owner:** River (lead), Orion (Microsoft Framework support)

**Deliverables:**
1. **LangGraph Store API Setup** (Days 1-2)
   - Install langgraph with Store support
   - Create BaseAgent.memory_store pattern
   - Implement namespace structure: `("agent", agent_id)`, `("business", business_id)`
   - Test basic put/get/search operations

2. **MongoDB Integration** (Days 3-4)
   - Setup MongoDB Atlas (or local instance)
   - Create memory schemas:
     - `consensus_memory`: Verified team procedures
     - `persona_libraries`: Agent characteristics
     - `whiteboard_methods`: Shared working spaces
   - Implement MongoDB Store backend for LangGraph
   - Test persistence across agent restarts

3. **Redis Caching Layer** (Day 5)
   - Setup Redis for hot memory cache
   - Implement cache-aside pattern (check Redis → fallback to MongoDB)
   - Set TTL policies (hot cache: 1 hour, warm cache: 1 day)

4. **Integration Testing** (Days 6-7)
   - Test agent memory save/retrieve
   - Test cross-agent memory sharing
   - Benchmark retrieval latency (<100ms target)
   - Documentation + code review (Hudson)

**Expected Output:**
- 3 files created: `infrastructure/memory_store.py`, `infrastructure/mongodb_backend.py`, `infrastructure/redis_cache.py`
- 20+ tests passing
- <100ms memory retrieval validated

**Success Criteria:**
- ✅ Agents can save/retrieve memories
- ✅ Memory persists across restarts
- ✅ <100ms P95 latency

---

### **WEEK 2: DeepSeek-OCR Memory Compression (Oct 29 - Nov 4)**

**Owner:** Thon (Python implementation), Cora (compression strategy)

**Deliverables:**
1. **DeepSeek-OCR Integration** (Days 1-2)
   - Install deepseek-ocr + dependencies
   - Create `MemoryCompressor` class with 4 modes:
     - Text (0 days old): Full text, no compression
     - Base (1-7 days): 256 visual tokens (71% compression)
     - Small (8-30 days): 100 visual tokens (90% compression)
     - Tiny (30+ days): 64 visual tokens (95% compression)
   - Implement text-to-image rendering (PIL/Cairo)

2. **Age-Based Compression Pipeline** (Days 3-4)
   - Create background job: `compress_old_memories.py`
   - Scan MongoDB for memories >1 day old
   - Apply compression based on age
   - Store compressed memories with metadata
   - Test OCR precision (97% target)

3. **Decompression & Retrieval** (Day 5)
   - Implement transparent decompression on read
   - Cache decompressed results in Redis
   - Benchmark end-to-end: compress → store → retrieve → decompress

4. **Cost Validation** (Days 6-7)
   - Run 100-business simulation
   - Measure token usage before/after compression
   - Validate 71% reduction target
   - Document compression ratios by age
   - Code review (Hudson) + E2E test (Alex)

**Expected Output:**
- 2 files created: `infrastructure/memory_compressor.py`, `scripts/compress_old_memories.py`
- 15+ tests passing
- 71% memory cost reduction validated

**Success Criteria:**
- ✅ 10-20x compression ratio
- ✅ 97% OCR precision
- ✅ 71% cost reduction measured
- ✅ <100ms decompression latency

---

### **WEEK 3: Hybrid RAG for Semantic Retrieval (Nov 5-11)**

**Owner:** River (RAG architecture), Nova (Vertex AI integration)

**Deliverables:**
1. **Vector Database Setup** (Days 1-2)
   - Choose vector DB (Pinecone free tier OR Weaviate local)
   - Install embeddings model (OpenAI text-embedding-3-small OR local SBERT)
   - Create vector indices for:
     - Agent memories (past successful solutions)
     - Business procedures (verified workflows)
     - Evolution trajectories (Darwin improvements)

2. **Hybrid RAG Implementation** (Days 3-4)
   - **Vector search:** Similarity-based retrieval (e.g., "similar bug fixes")
   - **Graph search:** Relationship-based retrieval (e.g., "agents who worked on this business")
   - Combine results with reciprocal rank fusion
   - Implement Agentic RAG pattern:
     ```python
     async def retrieve_relevant_memories(query):
         # Vector search
         similar = await vector_db.search(embed(query), top_k=5)

         # Graph search
         related = await mongodb.find({
             "$or": [
                 {"business_id": current_business},
                 {"agent_id": {"$in": collaborators}}
             ]
         })

         # Fusion
         return reciprocal_rank_fusion(similar, related)
     ```

3. **Cross-Business Learning** (Day 5)
   - Implement memory sharing between businesses
   - Privacy controls (only share consensus memories, not raw data)
   - Test: Business #100 retrieves solutions from Business #1-99

4. **Benchmarking & Optimization** (Days 6-7)
   - Benchmark retrieval accuracy (94.8% target)
   - Benchmark retrieval speed (<100ms target)
   - Optimize with caching, batching
   - Final E2E test (Alex) + performance validation (Forge)

**Expected Output:**
- 3 files created: `infrastructure/vector_store.py`, `infrastructure/hybrid_rag.py`, `infrastructure/cross_business_learning.py`
- 25+ tests passing
- 94.8% retrieval accuracy validated
- 35% retrieval cost savings validated

**Success Criteria:**
- ✅ 94.8% retrieval accuracy
- ✅ <100ms retrieval latency
- ✅ Cross-business learning operational
- ✅ 35% cost savings from RAG

---

## 💰 COST PROJECTIONS

### **Current State (After Phase 4):**
```
Monthly costs (10 businesses):
- LLM API calls: $500/month
- After DAAO (48% reduction): $260/month
- After TUMIX (15% additional): $240/month
```

### **After Week 1 (Persistent Memory):**
```
Savings from avoiding re-fetching: -10%
New cost: $240 × 0.9 = $216/month
```

### **After Week 2 (DeepSeek-OCR Compression):**
```
Memory cost before: $90/month (30M tokens)
Memory cost after: $26/month (8.6M tokens, 71% reduction)
Savings: $64/month
New cost: $216 - $64 = $152/month
```

### **After Week 3 (Hybrid RAG):**
```
RAG retrieval savings: -35%
New cost: $152 × 0.65 = $99/month
```

### **Total Phase 5 Impact:**
```
Before: $500/month
After: $99/month
Reduction: 80% ($401/month savings)

At scale (1000 businesses):
Before: $50,000/month
After: $9,900/month
Annual savings: $481,200/year
```

**Note:** Conservative estimate is 75% reduction ($125/month), we're targeting 80%.

---

## 🧪 TESTING STRATEGY

### **Week 1 Tests:**
- Unit tests: Memory store CRUD operations
- Integration tests: MongoDB + Redis persistence
- Performance tests: <100ms latency
- E2E tests: Agent save → restart → retrieve

### **Week 2 Tests:**
- Unit tests: Compression modes (Base/Small/Tiny)
- Precision tests: OCR accuracy (97% target)
- Cost tests: 71% reduction validation
- E2E tests: Compress → store → retrieve → decompress

### **Week 3 Tests:**
- Unit tests: Vector search, graph search, fusion
- Accuracy tests: 94.8% retrieval target
- Performance tests: <100ms latency
- E2E tests: Cross-business learning scenarios

**Overall Target:** 60+ new tests, 95%+ pass rate

---

## 📦 DEPENDENCIES

**New Python Packages:**
```bash
pip install langgraph
pip install deepseek-ocr transformers==4.46.3 torch==2.6.0
pip install pymongo redis
pip install pinecone-client  # OR weaviate-client
pip install sentence-transformers  # For embeddings
```

**Infrastructure:**
- MongoDB Atlas (free tier) OR local MongoDB
- Redis (local instance OR Redis Cloud free tier)
- Pinecone (free tier: 1M vectors) OR Weaviate (local/self-hosted)

---

## 🎯 SUCCESS CRITERIA (PHASE 5 COMPLETE)

**Code Metrics:**
- ✅ 6+ new files created (~1,500 lines production code)
- ✅ 60+ tests passing (95%+ pass rate)
- ✅ 85%+ code coverage
- ✅ Hudson code review: 8.5+/10
- ✅ Alex integration test: 8.5+/10
- ✅ Forge performance validation: 8.5+/10

**Performance Metrics:**
- ✅ <100ms memory retrieval (P95)
- ✅ 94.8% retrieval accuracy
- ✅ 10-20x compression ratio
- ✅ 97% OCR precision

**Cost Metrics:**
- ✅ 75-80% total cost reduction ($500 → $99-125/month)
- ✅ 71% memory cost reduction
- ✅ 35% RAG retrieval savings

**Functional Metrics:**
- ✅ Agents can save/retrieve memories
- ✅ Memory persists across restarts
- ✅ Cross-business learning operational
- ✅ Compression transparent to agents

---

## 🚀 KICKOFF - WEEK 1 STARTS NOW

**Assigned:** River (lead), Orion (support)
**Task:** LangGraph Store + MongoDB + Redis integration
**Timeline:** October 22-28, 2025 (7 days)
**Deliverables:** Persistent memory system with <100ms retrieval

Let's build the foundation for 80% cost savings! 🎯
