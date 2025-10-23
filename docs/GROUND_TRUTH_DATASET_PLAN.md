# GROUND TRUTH DATASET CREATION PLAN - PHASE 5.3 DAY 3

**Owner:** Thon (Data Creation) + Hudson (Review) + Alex (Validation)
**Date:** October 23, 2025
**Status:** PLAN READY FOR EXECUTION
**Purpose:** Enable precision@10 validation for Hybrid RAG system (94.8% accuracy target)

---

## EXECUTIVE SUMMARY

**Goal:** Create 100-query ground truth dataset with human-labeled expected results to validate Hybrid RAG retrieval accuracy.

**Why Critical:** Alex's test strategy review identified this as a CRITICAL BLOCKER. Without ground truth:
- Cannot validate 94.8% accuracy claim (theoretical, not implementable)
- Cannot approve Day 3 completion (no acceptance test)
- Cannot prove agents can successfully use hybrid search

**Timeline:** Day 3 (parallel with implementation)
- Morning (2 hours): Thon creates 100 queries + labels (pass 1)
- Afternoon (1 hour): Hudson reviews labels, flags disagreements (pass 2)
- Evening (1 hour): Alex validates with actual retrieval, resolves conflicts (pass 3)

**Acceptance Criteria:** test_hybrid_search_precision_at_10() passes with ≥90% precision

---

## 1. DATASET SPECIFICATION

### 1.1 Size & Distribution

**Total Queries:** 100

**Category Breakdown:**
```
Technical (40 queries):  Semantic similarity queries
  - API errors, bugs, performance issues
  - Code snippets, stack traces, error messages
  - Vector search should excel here

Procedural (30 queries): Step-by-step workflow queries
  - Deployment procedures, test sequences, configuration steps
  - Graph traversal should excel here (follow relationship chains)

Relational (30 queries): Entity relationship queries
  - Cross-agent collaboration, memory references
  - Graph traversal critical (discover connections)
```

### 1.2 Query Sources

**Real Agent Logs (70 queries):**
- Extract from production agent interactions (Phase 1-4)
- QA Agent: Test procedure lookups (15 queries)
- Support Agent: Ticket searches (15 queries)
- Builder Agent: Deployment lookups (15 queries)
- Marketing Agent: Campaign history (10 queries)
- Legal Agent: Contract clause searches (10 queries)
- Cross-agent: Knowledge sharing (5 queries)

**Synthetic Edge Cases (30 queries):**
- Hand-crafted to test specific retrieval challenges
- Ambiguous queries (5 queries)
- Multi-hop relationships (5 queries)
- Keyword mismatch scenarios (5 queries)
- Time-based queries (5 queries)
- Negative queries ("NOT X") (5 queries)
- Zero-result queries (5 queries)

### 1.3 Query Complexity Distribution

**Simple (30%):** Single-concept queries, clear keywords
- Example: "password reset test procedure"
- Expected: 95%+ precision@10

**Medium (50%):** Multi-concept, moderate ambiguity
- Example: "Find billing tickets from last month with payment failures"
- Expected: 90-95% precision@10

**Hard (20%):** Multi-hop, implicit relationships, ambiguous
- Example: "Which agents contributed to user authentication feature?"
- Expected: 80-90% precision@10

---

## 2. LABELING PROCESS (TRIPLE-PASS CONSENSUS)

### 2.1 Pass 1: Thon (Initial Labeling) - 2 hours

**Objective:** Create 100 queries with initial expected_memory_ids labels

**Steps:**
1. **Extract real queries from logs**
   ```bash
   # Search agent interaction logs for actual memory retrieval queries
   grep "semantic_search\|memory_store.search" logs/agents.log* | \
     awk '{print $NF}' | sort | uniq | head -70 > data/raw_queries.txt
   ```

2. **Manually populate test memories**
   - Create 200-300 test memories across 5 agent namespaces
   - Ensure coverage of all query categories
   - Include both relevant and irrelevant memories (test precision)

3. **Label expected results**
   - For each query, manually identify 5-10 expected memory IDs
   - Use namespace structure from memory_store.py:
     - ("agent", "qa_001")
     - ("agent", "support_001")
     - ("business", "saas_001")
   - Document labeling rationale in comments

4. **Record confidence scores**
   - High confidence (0.9-1.0): Clear expected results
   - Medium confidence (0.7-0.9): Some ambiguity
   - Low confidence (0.5-0.7): Multiple valid interpretations

**Output:** `data/retrieval_validation_v1.jsonl` (100 queries, Thon-labeled)

### 2.2 Pass 2: Hudson (Review & Validation) - 1 hour

**Objective:** Validate Thon's labels for correctness and consistency

**Steps:**
1. **Load Thon's labels**
   ```python
   # Hudson's review script
   for entry in load_dataset("data/retrieval_validation_v1.jsonl"):
       print(f"\nQuery: {entry['query']}")
       print(f"Category: {entry['category']}")
       print(f"Expected IDs: {entry['expected_memory_ids']}")
       print(f"Thon confidence: {entry['confidence']}")

       # Manual review questions:
       # 1. Are expected IDs actually relevant to query?
       # 2. Are there obvious missing IDs?
       # 3. Are there incorrect IDs (false positives)?
       # 4. Is category classification correct?

       if needs_revision:
           flag_for_discussion(entry)
   ```

2. **Flag disagreements**
   - Record queries where Hudson disagrees with Thon
   - Document rationale for disagreement
   - Suggest alternative expected_memory_ids

3. **Check for labeling biases**
   - Are technical queries over-represented in expected results?
   - Are certain agents under-represented?
   - Are relationships (graph-based) adequately labeled?

**Output:**
- `data/retrieval_validation_v2.jsonl` (Hudson-revised)
- `data/labeling_disagreements.md` (discussion log)

### 2.3 Pass 3: Alex (Actual Retrieval Validation) - 1 hour

**Objective:** Validate labels using ACTUAL retrieval (ground truth must be achievable)

**Steps:**
1. **Run test retrieval for each query**
   ```python
   # Alex's validation script
   for entry in load_dataset("data/retrieval_validation_v2.jsonl"):
       query = entry["query"]
       expected_ids = set(entry["expected_memory_ids"])

       # Simulate hybrid search (using current implementation)
       vector_results = await vector_search_simulation(query, top_k=20)
       graph_results = await graph_search_simulation(query, top_k=20)

       # Check if expected IDs are findable by EITHER system
       vector_ids = {r["id"] for r in vector_results}
       graph_ids = {r["id"] for r in graph_results}
       combined_ids = vector_ids | graph_ids

       # Validate: Are expected IDs actually retrievable?
       retrievable = expected_ids & combined_ids
       unreachable = expected_ids - combined_ids

       if unreachable:
           # CRITICAL: Expected IDs that NO system can find
           logger.error(f"Query '{query}' has unreachable expected IDs: {unreachable}")
           flag_for_revision(entry, unreachable_ids=unreachable)
   ```

2. **Identify unreachable expectations**
   - If expected_memory_id is NOT findable by vector OR graph:
     - Either the memory doesn't exist (fix test data)
     - Or the expected ID is wrong (fix label)

3. **Finalize ground truth**
   - Remove or fix unreachable expectations
   - Ensure every expected_memory_id is discoverable
   - Final inter-rater agreement check

**Output:** `data/retrieval_validation.jsonl` (final, triple-validated)

---

## 3. STORAGE FORMAT

### 3.1 File Format: JSON Lines (.jsonl)

**Why JSONL:**
- Easy to stream and parse (one query per line)
- Human-readable for debugging
- Standard format for ML datasets

**Location:** `/home/genesis/genesis-rebuild/data/retrieval_validation.jsonl`

### 3.2 Schema (per line)

```json
{
  "query_id": "qa_001",
  "query": "How do we test authentication after password changes?",
  "category": "technical",
  "difficulty": "medium",
  "namespace": ["agent", "qa_001"],
  "expected_memory_ids": [
    "agent:qa_001:test_auth_flow",
    "agent:qa_001:password_validation",
    "agent:qa_001:session_management"
  ],
  "requires_vector": true,
  "requires_graph": true,
  "labeler": "thon",
  "reviewer": "hudson",
  "validator": "alex",
  "confidence": 0.95,
  "labeling_rationale": "Query requires both semantic match (password, auth) and procedural steps (test flow)",
  "created_at": "2025-10-23T10:30:00Z",
  "validation_status": "approved"
}
```

**Field Descriptions:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| query_id | str | Yes | Unique ID (agent_XXX or edge_XXX) |
| query | str | Yes | Natural language query |
| category | enum | Yes | "technical", "procedural", "relational" |
| difficulty | enum | Yes | "simple", "medium", "hard" |
| namespace | list | No | Optional namespace filter [type, id] |
| expected_memory_ids | list[str] | Yes | Ground truth memory IDs (5-10 per query) |
| requires_vector | bool | Yes | True if query needs semantic search |
| requires_graph | bool | Yes | True if query needs graph traversal |
| labeler | str | Yes | Who created initial label (thon) |
| reviewer | str | Yes | Who reviewed (hudson) |
| validator | str | Yes | Who validated retrievability (alex) |
| confidence | float | Yes | Labeling confidence (0.0-1.0) |
| labeling_rationale | str | No | Why these expected IDs? |
| created_at | str | Yes | ISO timestamp |
| validation_status | enum | Yes | "approved", "needs_revision", "rejected" |

### 3.3 Validation Rules

**Schema Validation (automatic):**
```python
# tests/fixtures/dataset_validator.py

def validate_entry(entry: dict) -> List[str]:
    """Validate single dataset entry, return list of errors"""
    errors = []

    # Required fields
    required = ["query_id", "query", "category", "expected_memory_ids"]
    for field in required:
        if field not in entry:
            errors.append(f"Missing required field: {field}")

    # Category validation
    if entry.get("category") not in ["technical", "procedural", "relational"]:
        errors.append(f"Invalid category: {entry.get('category')}")

    # Difficulty validation
    if entry.get("difficulty") not in ["simple", "medium", "hard"]:
        errors.append(f"Invalid difficulty: {entry.get('difficulty')}")

    # Expected IDs format
    expected_ids = entry.get("expected_memory_ids", [])
    if not isinstance(expected_ids, list) or len(expected_ids) < 1:
        errors.append("expected_memory_ids must be non-empty list")

    for mem_id in expected_ids:
        # Format: "namespace_type:namespace_id:key"
        if mem_id.count(":") != 2:
            errors.append(f"Invalid memory ID format: {mem_id}")

    # Confidence range
    confidence = entry.get("confidence", 0.0)
    if not (0.0 <= confidence <= 1.0):
        errors.append(f"Confidence must be 0.0-1.0, got: {confidence}")

    return errors
```

---

## 4. QUALITY CRITERIA

### 4.1 Dataset Quality Metrics

**Inter-Rater Agreement (Thon vs Hudson):**
- **Target:** ≥85% agreement on expected_memory_ids
- **Calculation:** Jaccard similarity between Thon's and Hudson's labels
- **Action if <85%:** Third-party tie-breaker (Cora)

**Retrievability Rate (Alex validation):**
- **Target:** 100% of expected_memory_ids are findable by vector OR graph
- **Calculation:** % of expected IDs that appear in top-20 results of either system
- **Action if <100%:** Fix test data or revise labels

**Category Balance:**
- **Target:** 40% technical, 30% procedural, 30% relational (±5% tolerance)
- **Calculation:** Count queries per category
- **Action if imbalanced:** Add/remove queries to rebalance

**Difficulty Distribution:**
- **Target:** 30% simple, 50% medium, 20% hard (±5% tolerance)
- **Calculation:** Count queries per difficulty
- **Action if imbalanced:** Adjust query complexity

### 4.2 Precision@10 Validation Test

**Test Implementation:**
```python
# tests/test_hybrid_rag_accuracy.py

@pytest.mark.asyncio
async def test_hybrid_search_precision_at_10(memory_store, ground_truth_dataset):
    """
    PRIMARY ACCEPTANCE TEST: Validate ≥90% precision@10

    This test MUST PASS for Day 3 completion approval.
    """
    precision_scores = []

    for entry in ground_truth_dataset:
        query = entry["query"]
        expected_ids = set(entry["expected_memory_ids"])

        # Execute hybrid search
        results = await memory_store.hybrid_search(query, top_k=10)
        retrieved_ids = {r["id"] for r in results}

        # Calculate precision@10
        true_positives = len(retrieved_ids & expected_ids)
        precision = true_positives / 10 if len(retrieved_ids) > 0 else 0.0

        precision_scores.append({
            "query_id": entry["query_id"],
            "query": query,
            "category": entry["category"],
            "precision": precision,
            "expected_count": len(expected_ids),
            "retrieved_count": len(retrieved_ids),
            "true_positives": true_positives
        })

    # Overall precision@10
    avg_precision = sum(s["precision"] for s in precision_scores) / len(precision_scores)

    # Category breakdown
    for category in ["technical", "procedural", "relational"]:
        cat_scores = [s["precision"] for s in precision_scores if s["category"] == category]
        cat_avg = sum(cat_scores) / len(cat_scores) if cat_scores else 0.0
        print(f"Precision@10 ({category}): {cat_avg:.1%}")

    print(f"\nOverall Precision@10: {avg_precision:.1%}")
    print(f"Target: 90.0%")
    print(f"Paper Target: 94.8%")

    # ACCEPTANCE CRITERION: ≥90% precision
    assert avg_precision >= 0.90, (
        f"Precision@10 {avg_precision:.1%} below 90% target. "
        f"Review failing queries and tune RRF parameters."
    )
```

**Debugging Failed Queries:**
```python
# If precision@10 <90%, run this to diagnose
def analyze_failed_queries(precision_scores: List[Dict]):
    """Identify patterns in low-precision queries"""

    failed = [s for s in precision_scores if s["precision"] < 0.5]

    print(f"\n=== FAILED QUERIES ({len(failed)}) ===")
    for score in failed:
        print(f"\nQuery: {score['query']}")
        print(f"Category: {score['category']}")
        print(f"Precision: {score['precision']:.1%}")
        print(f"Expected: {score['expected_count']} memories")
        print(f"Retrieved: {score['retrieved_count']} memories")
        print(f"True Positives: {score['true_positives']}")

    # Pattern analysis
    failed_by_category = {}
    for s in failed:
        cat = s["category"]
        failed_by_category[cat] = failed_by_category.get(cat, 0) + 1

    print(f"\n=== FAILURE PATTERNS ===")
    print(f"By Category: {failed_by_category}")

    # Recommendations
    if failed_by_category.get("procedural", 0) > 5:
        print("RECOMMENDATION: Graph traversal may need tuning (procedural failures)")
    if failed_by_category.get("technical", 0) > 5:
        print("RECOMMENDATION: Vector search may need tuning (technical failures)")
```

---

## 5. TIMELINE & OWNERSHIP

### 5.1 Day 3 Morning (8:00 AM - 10:00 AM) - Thon

**Task:** Create 100 queries + initial labels (Pass 1)

**Subtasks:**
1. **8:00-8:30:** Extract 70 real queries from agent logs
2. **8:30-9:00:** Create 30 synthetic edge case queries
3. **9:00-9:30:** Populate 200-300 test memories in memory store
4. **9:30-10:00:** Label expected_memory_ids for all 100 queries

**Deliverables:**
- `data/retrieval_validation_v1.jsonl` (100 queries, Thon-labeled)
- `data/test_memories.json` (test memory population script)

### 5.2 Day 3 Afternoon (2:00 PM - 3:00 PM) - Hudson

**Task:** Review Thon's labels, flag disagreements (Pass 2)

**Subtasks:**
1. **2:00-2:30:** Review 100 labels for correctness
2. **2:30-2:45:** Flag disagreements, document rationale
3. **2:45-3:00:** Produce revised dataset v2

**Deliverables:**
- `data/retrieval_validation_v2.jsonl` (Hudson-revised)
- `data/labeling_disagreements.md` (discussion log)

### 5.3 Day 3 Evening (5:00 PM - 6:00 PM) - Alex

**Task:** Validate retrievability, finalize dataset (Pass 3)

**Subtasks:**
1. **5:00-5:30:** Run actual retrieval for all 100 queries
2. **5:30-5:45:** Identify unreachable expected IDs, fix
3. **5:45-6:00:** Finalize dataset, run schema validation

**Deliverables:**
- `data/retrieval_validation.jsonl` (final, triple-validated)
- `data/retrieval_validation_report.md` (validation summary)

### 5.4 Day 4 Morning (8:00 AM - 9:00 AM) - Alex

**Task:** Run acceptance test, generate approval report

**Subtasks:**
1. **8:00-8:30:** Run `test_hybrid_search_precision_at_10()`
2. **8:30-8:45:** Generate category breakdown, failure analysis
3. **8:45-9:00:** Document results in approval report

**Deliverables:**
- `docs/HYBRID_RAG_ACCURACY_VALIDATION.md` (test results)
- Screenshot evidence showing precision@10 ≥90%

---

## 6. FAILURE TRIAGE PROCESS

### 6.1 If Precision@10 <90% (Day 4)

**Step 1: Analyze Failures (30 minutes)**
```python
# Run failure analysis
analyze_failed_queries(precision_scores)

# Output:
# === FAILED QUERIES (15) ===
# Query: "Find billing tickets from Q3"
# Category: procedural
# Precision: 40%  (4/10 correct)
# Expected: 8 memories, Retrieved: 10 memories
# Pattern: Time-based queries failing (graph needs temporal edges)
```

**Step 2: Root Cause Identification (30 minutes)**

**Common Failure Patterns:**

| Pattern | Root Cause | Fix |
|---------|-----------|-----|
| Procedural queries <70% | Graph traversal depth insufficient | Increase max_hops to 3 |
| Technical queries <80% | Vector embeddings not capturing semantics | Try different embedding model |
| RRF scores inverted | k parameter too high/low | Tune k (try 45, 75) |
| Zero results | Memories not indexed | Run re-indexing script |
| All low precision | Test data doesn't match expectations | Revise labels or test memories |

**Step 3: Parameter Tuning (1 hour)**

**Tunable Parameters:**
```python
# RRF k parameter (controls vector/graph balance)
rrf_k_values = [45, 60, 75]  # Lower = favor vector, higher = favor graph

# Top-k multiplier (how many results to fetch before fusion)
top_k_multipliers = [2, 3, 4]  # Fetch 2x/3x/4x before RRF

# Graph traversal depth
max_hops_values = [2, 3, 4]  # How far to traverse relationships

# Test each combination
for k in rrf_k_values:
    for mult in top_k_multipliers:
        for hops in max_hops_values:
            precision = await test_precision_with_params(k, mult, hops)
            print(f"k={k}, mult={mult}, hops={hops} → {precision:.1%}")
```

**Step 4: Re-test (30 minutes)**
```bash
# Run acceptance test with tuned parameters
pytest tests/test_hybrid_rag_accuracy.py::test_hybrid_search_precision_at_10 -v

# Expected: Precision@10 ≥90%
```

**Step 5: Escalate if Still <90% (1 hour)**
- Document failure analysis in `docs/HYBRID_RAG_TUNING_REPORT.md`
- Request Cora architecture review (is RRF the right algorithm?)
- Request Hudson code review (are vector/graph implementations correct?)
- DECISION: Deploy with known limitation OR delay until fixed

### 6.2 If Inter-Rater Agreement <85% (Day 3)

**Step 1: Identify Disagreements**
```python
# Calculate Jaccard similarity
thon_ids = set(thon_labels)
hudson_ids = set(hudson_labels)

agreement = len(thon_ids & hudson_ids) / len(thon_ids | hudson_ids)
print(f"Inter-rater agreement: {agreement:.1%}")

# If <85%, find specific queries with disagreement
for query_id in disagreements:
    print(f"\nQuery: {query_id}")
    print(f"Thon expected: {thon_labels[query_id]}")
    print(f"Hudson expected: {hudson_labels[query_id]}")
    print(f"Disagreement IDs: {thon_ids ^ hudson_ids}")
```

**Step 2: Third-Party Tie-Breaker (Cora)**
- Cora reviews disagreement cases
- Decides which labeling is correct
- Updates dataset with Cora's decision

**Step 3: Document Labeling Guidelines**
- Record which IDs were controversial and why
- Update labeling guidelines to prevent future disagreements
- Example: "For procedural queries, include prerequisite steps in expected IDs"

---

## 7. ACCEPTANCE CRITERIA (DAY 4 APPROVAL GATE)

### 7.1 Dataset Quality

- [ ] **100 queries created** (40 technical, 30 procedural, 30 relational)
- [ ] **Triple-pass labeling complete** (Thon → Hudson → Alex)
- [ ] **Inter-rater agreement ≥85%** (Thon vs Hudson labels)
- [ ] **Retrievability rate 100%** (all expected IDs findable)
- [ ] **Schema validation passing** (all entries conform to schema)
- [ ] **File location correct** (`data/retrieval_validation.jsonl`)

### 7.2 Validation Test

- [ ] **test_hybrid_search_precision_at_10() implemented**
- [ ] **Test passes with ≥90% precision@10** (CRITICAL GATE)
- [ ] **Category breakdown documented** (technical/procedural/relational)
- [ ] **Failure analysis generated** (if any queries <50% precision)
- [ ] **Screenshot evidence captured** (test output, Grafana metrics)

### 7.3 Documentation

- [ ] **Labeling rationale documented** (why these expected IDs?)
- [ ] **Disagreement resolution logged** (`data/labeling_disagreements.md`)
- [ ] **Validation report generated** (`data/retrieval_validation_report.md`)
- [ ] **Tuning parameters recorded** (if precision@10 tuning required)

---

## 8. DELIVERABLE CHECKLIST

### 8.1 Data Files

- [ ] `data/retrieval_validation.jsonl` (100 queries, final)
- [ ] `data/retrieval_validation_schema.json` (JSON schema for validation)
- [ ] `data/test_memories.json` (test memory population script)
- [ ] `data/labeling_disagreements.md` (Thon-Hudson discussion log)
- [ ] `data/retrieval_validation_report.md` (Alex's validation summary)

### 8.2 Test Files

- [ ] `tests/test_hybrid_rag_accuracy.py` (precision@10 validation test)
- [ ] `tests/fixtures/dataset_validator.py` (schema validation utility)
- [ ] `tests/fixtures/test_memory_loader.py` (populate test memories)

### 8.3 Documentation

- [ ] `docs/GROUND_TRUTH_DATASET_PLAN.md` (this document)
- [ ] `docs/HYBRID_RAG_ACCURACY_VALIDATION.md` (test results, Day 4)
- [ ] `docs/HYBRID_RAG_TUNING_REPORT.md` (if tuning required)

---

## 9. REFERENCES

### 9.1 Genesis Documentation

- `docs/HYBRID_RAG_DESIGN.md` - Section 7.2: Accuracy Targets
- `docs/ALEX_TEST_STRATEGY_REVIEW_HYBRID_RAG.md` - Section 6: Accuracy Validation
- `infrastructure/memory_store.py` - Namespace structure reference

### 9.2 Research Papers

- **Hariharan et al. (2025):** "Agentic RAG: Turbocharging Retrieval-Augmented Generation"
  - arXiv:2504.15228
  - Target: 94.8% retrieval accuracy (our baseline)

- **Cormack et al. (2009):** "Reciprocal Rank Fusion outperforms Condorcet"
  - SIGIR 2009
  - Ground truth dataset methodology

---

## SIGNATURE

**Plan Created By:** Thon (Python Expert)
**Date:** October 23, 2025
**Status:** READY FOR EXECUTION

**Next Steps:**
1. Thon executes Pass 1 (Day 3 morning)
2. Hudson reviews Pass 2 (Day 3 afternoon)
3. Alex validates Pass 3 (Day 3 evening)
4. Alex runs acceptance test (Day 4 morning)

**Approval Required From:**
- [ ] Hudson: Dataset creation process is sound
- [ ] Alex: Validation methodology is comprehensive
- [ ] Cora: Aligns with Hybrid RAG design doc

---

**END OF PLAN**
