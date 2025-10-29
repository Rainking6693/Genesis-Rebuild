# ReasoningBank Migration Plan - SE-Darwin Integration

**Date:** October 27, 2025
**Timeline:** Week 2-3 of Phase 5 (post-MemoryOS deployment)
**Owner:** SE-Darwin team (Layer 2)
**Reviewers:** Hudson (code), Alex (E2E), Forge (performance)

---

## Executive Summary

Integrate ReasoningBank's 5-stage closed-loop learning with SE-Darwin agent evolution to enable test-time learning from both successful and failed evolution attempts.

**Expected Impact:**
- 20-30% faster convergence (fewer evolution iterations)
- Learn from failures (currently only archives successes)
- Test-time scaling via MaTTS (parallel/sequential)
- Transparent reasoning (ReAct format trajectory tracking)

**Complexity:** 7/10 (medium-high) - Requires TrajectoryPool refactoring

**Timeline:** 2 weeks (10 business days)

---

## Current State: TrajectoryPool

**File:** `/home/genesis/genesis-rebuild/infrastructure/trajectory_pool.py` (19,528 bytes)

**Architecture:**
```python
class TrajectoryPool:
    def __init__(self):
        self.trajectories = []  # List of trajectory dicts
        self.archive = {}       # Best trajectories by task_id

    def add(self, trajectory):
        """Store trajectory (success only archived)"""

    def get_best(self, task_id):
        """Retrieve best archived trajectory"""

    def get_all(self):
        """Get all trajectories"""
```

**Limitations:**
1. No learning from failures (only successful trajectories archived)
2. No semantic similarity search (linear lookup by task_id)
3. No test-time learning (static archive)
4. No reasoning strategy extraction

---

## Target State: ReasoningBank Integration

**Architecture:**
```python
class ReasoningBankTrajectoryPool:
    def __init__(self, reasoningbank_agent):
        self.rb_agent = reasoningbank_agent  # ReasoningBankAgent instance
        self.archive = {}  # Backward compatibility

    def add_with_learning(self, trajectory, task_query, success):
        """
        5-Stage Closed-Loop Learning:
        1. RETRIEVE: Already done (memories used in evolution)
        2. ACT: Trajectory execution (SE-Darwin operators)
        3. JUDGE: Success/failure from benchmark validation
        4. EXTRACT: Mine strategies (success) or lessons (failure)
        5. CONSOLIDATE: Add to ReasoningBank memory
        """

    def retrieve_relevant(self, task_query, top_k=5):
        """Embedding-based retrieval (not task_id lookup)"""

    def execute_with_matts_sequential(self, task_query, k=3):
        """Progressive refinement: M1 → M1+M2 → M1+M2+M3"""
```

---

## Migration Roadmap (10 Days)

### Day 1-2: Install and Study ReasoningBank

**Tasks:**
- [x] Clone ReasoningBank repo (COMPLETE)
- [ ] Study 5-stage architecture (ARCHITECTURE.md)
- [ ] Understand MaTTS parallel/sequential scaling
- [ ] Identify integration points with SE-Darwin

**Deliverables:**
- Architecture understanding document
- Integration point mapping (SE-Darwin ↔ ReasoningBank)

### Day 3-4: Create Adapter Layer

**File:** `/home/genesis/genesis-rebuild/infrastructure/reasoningbank_adapter.py` (new)

**Class:** `ReasoningBankAdapter`

**Code Sketch:**
```python
from reasoningbank import ReasoningBankAgent, ReasoningBankConfig

class ReasoningBankAdapter:
    """Adapter for ReasoningBank integration with SE-Darwin"""

    def __init__(self, llm_api_key: str):
        config = ReasoningBankConfig(
            llm_provider="anthropic",  # Claude for code generation
            llm_model="claude-3-5-sonnet-20241022",
            agent_temperature=0.7,
            judge_temperature=0.0,  # Deterministic judging
            extractor_temperature=1.0,  # Creative extraction
            memory_bank_path="./data/reasoning_bank.json"
        )
        self.agent = ReasoningBankAgent(config)

    def learn_from_trajectory(self, trajectory_dict: dict):
        """
        Map SE-Darwin trajectory to ReasoningBank format.

        SE-Darwin trajectory:
        {
            "task_query": "Fix login bug",
            "operator": "Revision",
            "code_before": "...",
            "code_after": "...",
            "benchmark_result": {"passed": 10, "failed": 2},
            "success": False
        }

        ReasoningBank format:
        {
            "query": task_query,
            "full_trajectory": f"Operator: {operator}\n{code_before}\n→\n{code_after}",
            "success": bool,
            "memory_items": extracted_strategies_or_lessons
        }
        """
        query = trajectory_dict["task_query"]
        trajectory = self._format_trajectory(trajectory_dict)
        success = trajectory_dict.get("success", False)

        # Stages 3-5: Judge → Extract → Consolidate
        # (Stages 1-2 already done: Retrieve → Act in SE-Darwin)
        is_success = self.agent.judge.judge_trajectory(query, trajectory)
        memory_items = self.agent.extractor.extract_from_trajectory(
            query, trajectory, is_success
        )
        entry_id = self.agent.consolidator.add_to_memory_bank(
            query, trajectory, is_success, memory_items
        )

        return entry_id

    def retrieve_relevant_strategies(self, task_query: str, top_k: int = 5):
        """Retrieve relevant memories from ReasoningBank"""
        memories = self.agent.retriever.retrieve(
            query=task_query,
            memory_bank=self.agent.consolidator.memory_bank,
            top_k=top_k
        )
        return memories

    def _format_trajectory(self, trajectory_dict: dict) -> str:
        """Format SE-Darwin trajectory for ReasoningBank"""
        lines = [
            f"Task: {trajectory_dict['task_query']}",
            f"Operator: {trajectory_dict['operator']}",
            f"\nCode Before:\n{trajectory_dict['code_before']}",
            f"\nCode After:\n{trajectory_dict['code_after']}",
            f"\nBenchmark: {trajectory_dict['benchmark_result']}"
        ]
        return "\n".join(lines)
```

**Deliverables:**
- `reasoningbank_adapter.py` (300-400 lines)
- Unit tests: `tests/test_reasoningbank_adapter.py`

### Day 5-6: Refactor TrajectoryPool

**File:** `/home/genesis/genesis-rebuild/infrastructure/trajectory_pool.py` (modify)

**Changes:**
```python
from infrastructure.reasoningbank_adapter import ReasoningBankAdapter

class TrajectoryPool:
    """
    Trajectory storage with optional ReasoningBank learning.

    Backward compatible: Existing SE-Darwin code still works.
    New feature: Enable test-time learning with `use_reasoningbank=True`.
    """

    def __init__(self, use_reasoningbank: bool = False, llm_api_key: str = None):
        # Existing attributes
        self.trajectories = []
        self.archive = {}

        # New: ReasoningBank integration
        self.use_reasoningbank = use_reasoningbank
        if use_reasoningbank:
            if not llm_api_key:
                raise ValueError("llm_api_key required for ReasoningBank")
            self.rb_adapter = ReasoningBankAdapter(llm_api_key)
        else:
            self.rb_adapter = None

    def add(self, trajectory: dict, learn: bool = True):
        """
        Add trajectory with optional learning.

        Args:
            trajectory: SE-Darwin trajectory dict
            learn: If True and use_reasoningbank, trigger 5-stage learning
        """
        # Existing logic
        self.trajectories.append(trajectory)
        if trajectory.get("success"):
            task_id = trajectory.get("task_id")
            self.archive[task_id] = trajectory

        # New: ReasoningBank learning
        if self.use_reasoningbank and learn:
            self.rb_adapter.learn_from_trajectory(trajectory)

    def get_relevant(self, task_query: str, top_k: int = 5):
        """
        Get relevant trajectories (embedding-based if ReasoningBank enabled).

        Backward compatible: Falls back to task_id lookup if not using ReasoningBank.
        """
        if self.use_reasoningbank:
            memories = self.rb_adapter.retrieve_relevant_strategies(task_query, top_k)
            # Convert ReasoningBank MemoryItem to trajectory dict
            return [self._memory_to_trajectory(m) for m in memories]
        else:
            # Existing logic: lookup by task_id
            return [self.archive.get(task_query)] if task_query in self.archive else []

    def _memory_to_trajectory(self, memory_item):
        """Convert ReasoningBank MemoryItem to trajectory dict"""
        return {
            "task_query": memory_item.task_query,
            "strategy": memory_item.content,
            "source": "reasoningbank"
        }
```

**Deliverables:**
- Refactored `trajectory_pool.py` (backward compatible)
- Integration tests: `tests/test_trajectory_pool_reasoningbank.py`

### Day 7-8: Update SE-Darwin Agent

**File:** `/home/genesis/genesis-rebuild/agents/se_darwin_agent.py` (modify)

**Changes:**
```python
class SEDarwinAgent:
    def __init__(self, ..., use_reasoningbank: bool = False, llm_api_key: str = None):
        # Existing attributes
        self.trajectory_pool = TrajectoryPool(
            use_reasoningbank=use_reasoningbank,
            llm_api_key=llm_api_key
        )

    def evolve(self, task: dict):
        """
        Multi-trajectory evolution with ReasoningBank learning.

        Flow:
        1. Retrieve relevant strategies from ReasoningBank (Stage 1)
        2. Generate trajectories with operators (Stage 2: ACT)
        3. Validate with benchmarks (Stage 3: JUDGE)
        4. Extract strategies/lessons (Stage 4: EXTRACT)
        5. Consolidate into memory (Stage 5: CONSOLIDATE)
        """
        # Stage 1: RETRIEVE
        if self.trajectory_pool.use_reasoningbank:
            relevant_memories = self.trajectory_pool.get_relevant(
                task_query=task["description"],
                top_k=5
            )
            # Augment evolution prompt with memories
            task["context"] = self._format_memories(relevant_memories)

        # Stage 2: ACT (existing SE-Darwin logic)
        trajectories = self.generate_trajectories(task)

        # Stage 3-5: JUDGE → EXTRACT → CONSOLIDATE (via TrajectoryPool.add)
        for traj in trajectories:
            benchmark_result = self.run_benchmark(traj)
            traj["success"] = benchmark_result["passed"] == benchmark_result["total"]
            traj["benchmark_result"] = benchmark_result

            # Add with learning (triggers Stages 3-5 if ReasoningBank enabled)
            self.trajectory_pool.add(traj, learn=True)

        return self.select_best(trajectories)

    def _format_memories(self, memories: list) -> str:
        """Format ReasoningBank memories for evolution prompt"""
        lines = ["Relevant past strategies:"]
        for i, mem in enumerate(memories, 1):
            lines.append(f"{i}. {mem['strategy']}")
        return "\n".join(lines)
```

**Deliverables:**
- Updated `se_darwin_agent.py` (backward compatible)
- Feature flag: `use_reasoningbank` (default: False for gradual rollout)

### Day 9: E2E Testing

**Test Scenarios:**

1. **Backward Compatibility:** SE-Darwin without ReasoningBank (existing 44/44 tests)
2. **Learning from Success:** Evolution succeeds → strategy extracted → memory grows
3. **Learning from Failure:** Evolution fails → lesson extracted → avoid repeat mistakes
4. **Embedding Retrieval:** Retrieve relevant strategies (not exact task_id match)
5. **MaTTS Sequential:** Progressive refinement (M1 → M1+M2 → M1+M2+M3)

**Test File:** `/home/genesis/genesis-rebuild/tests/test_se_darwin_reasoningbank_e2e.py`

**Code Sketch:**
```python
import pytest
from agents.se_darwin_agent import SEDarwinAgent

@pytest.fixture
def darwin_with_rb():
    """SE-Darwin agent with ReasoningBank enabled"""
    return SEDarwinAgent(
        use_reasoningbank=True,
        llm_api_key=os.getenv("ANTHROPIC_API_KEY")
    )

def test_learn_from_success(darwin_with_rb):
    """Test strategy extraction from successful evolution"""
    task = {
        "description": "Fix login authentication bug",
        "code": "def login(user, pwd): return user == pwd"
    }

    # Run evolution
    result = darwin_with_rb.evolve(task)

    # Check memory bank grew
    memory_bank = darwin_with_rb.trajectory_pool.rb_adapter.agent.consolidator.memory_bank
    assert len(memory_bank.entries) > 0

    # Check strategy extracted
    latest_entry = memory_bank.entries[-1]
    assert latest_entry.success == True
    assert len(latest_entry.memory_items) > 0
    assert "strategy" in latest_entry.memory_items[0].content.lower()

def test_learn_from_failure(darwin_with_rb):
    """Test lesson extraction from failed evolution"""
    task = {
        "description": "Optimize database query (intentionally fails)",
        "code": "def query(): return db.execute('SELECT * FROM users')"
    }

    # Mock benchmark failure
    with patch.object(darwin_with_rb, 'run_benchmark', return_value={"passed": 0, "total": 10}):
        result = darwin_with_rb.evolve(task)

    # Check memory bank grew with failure lesson
    memory_bank = darwin_with_rb.trajectory_pool.rb_adapter.agent.consolidator.memory_bank
    latest_entry = memory_bank.entries[-1]
    assert latest_entry.success == False
    assert "lesson" in latest_entry.memory_items[0].content.lower() or \
           "avoid" in latest_entry.memory_items[0].content.lower()

def test_embedding_retrieval(darwin_with_rb):
    """Test semantic similarity retrieval (not exact match)"""
    # Add memory for "authentication bug"
    darwin_with_rb.trajectory_pool.add({
        "task_query": "Fix user authentication issue",
        "strategy": "Use bcrypt for password hashing",
        "success": True
    })

    # Retrieve with similar query (not exact match)
    memories = darwin_with_rb.trajectory_pool.get_relevant(
        task_query="Login security problem",  # Different wording
        top_k=5
    )

    assert len(memories) > 0
    assert "authentication" in memories[0]["strategy"].lower() or \
           "password" in memories[0]["strategy"].lower()
```

**Deliverables:**
- E2E test suite (10-15 tests)
- Performance benchmarks (memory retrieval latency)

### Day 10: Documentation and Handoff

**Deliverables:**

1. **User Guide:** "How to Use ReasoningBank with SE-Darwin"
   - Enable/disable feature flag
   - Interpret memory bank growth
   - Debug learning failures

2. **Performance Report:**
   - Convergence improvement (baseline vs. ReasoningBank)
   - Memory retrieval latency (embedding search)
   - Compute overhead (5-stage cycle)

3. **Migration Checklist:**
   - [ ] Adapter layer tested (100% pass)
   - [ ] TrajectoryPool backward compatible
   - [ ] SE-Darwin integration tested
   - [ ] E2E scenarios passing (≥90%)
   - [ ] Performance benchmarks meet targets
   - [ ] Documentation complete
   - [ ] Handoff to production team

---

## Integration Points: SE-Darwin ↔ ReasoningBank

### Mapping Table

| SE-Darwin Component | ReasoningBank Stage | Integration Point |
|---------------------|---------------------|-------------------|
| `TrajectoryPool.get_best()` | 1. RETRIEVE | Embedding-based retrieval (not task_id) |
| `SEDarwinAgent.generate_trajectories()` | 2. ACT | Memory-augmented evolution prompts |
| `BenchmarkValidator.validate()` | 3. JUDGE | Success/failure signal |
| `SEDarwinAgent.archive_success()` | 4. EXTRACT | Strategy mining (success) |
| (NEW) `SEDarwinAgent.learn_from_failure()` | 4. EXTRACT | Lesson mining (failure) |
| `TrajectoryPool.add()` | 5. CONSOLIDATE | Memory bank update |

### Data Flow

```
SE-Darwin Evolution Loop:
    │
    ├──► 1. RETRIEVE (ReasoningBank.retriever)
    │    • Query: task_description
    │    • Output: List[MemoryItem] (top-k strategies)
    │    • Integration: TrajectoryPool.get_relevant()
    │
    ├──► 2. ACT (SE-Darwin operators)
    │    • Input: task + retrieved_strategies
    │    • Operators: Revision, Recombination, Refinement
    │    • Output: trajectory (code_before → code_after)
    │
    ├──► 3. JUDGE (BenchmarkValidator)
    │    • Input: trajectory
    │    • Benchmark: 270 scenarios (Genesis)
    │    • Output: success (bool)
    │
    ├──► 4. EXTRACT (ReasoningBank.extractor)
    │    • Input: trajectory + success
    │    • Dual-prompt:
    │      - Success → "What strategy worked?"
    │      - Failure → "What went wrong? How to avoid?"
    │    • Output: List[MemoryItem]
    │
    └──► 5. CONSOLIDATE (ReasoningBank.consolidator)
         • Input: query + trajectory + success + memory_items
         • Storage: reasoning_bank.json (→ MongoDB in Phase 5)
         • Output: entry_id
```

---

## MaTTS Sequential for Multi-Trajectory Evolution

**Current:** Parallel generation (3 trajectories, pick best)

**New:** Sequential refinement (M1 → M1+M2 → M1+M2+M3)

**Implementation:**
```python
def evolve_with_matts_sequential(self, task: dict, k: int = 3):
    """
    Progressive refinement with accumulating memory.

    Round 1: Generate trajectory T1 → Extract M1
    Round 2: Generate trajectory T2 with M1 → Extract M1+M2
    Round 3: Generate trajectory T3 with M1+M2 → Extract M1+M2+M3

    Expected: Each round builds on previous learnings.
    """
    memories = []
    trajectories = []

    for round_i in range(1, k+1):
        # Retrieve accumulated memories
        if round_i > 1:
            memories = self.trajectory_pool.get_relevant(
                task_query=task["description"],
                top_k=5 * round_i  # More memories each round
            )

        # Augment prompt with memories
        task["context"] = self._format_memories(memories)

        # Generate trajectory (ACT)
        traj = self.generate_single_trajectory(task)

        # Validate (JUDGE)
        benchmark_result = self.run_benchmark(traj)
        traj["success"] = benchmark_result["passed"] == benchmark_result["total"]

        # Extract + Consolidate
        self.trajectory_pool.add(traj, learn=True)

        trajectories.append(traj)

        # Early stopping (TUMIX)
        if traj["success"] and round_i >= 2:
            print(f"[MaTTS Sequential] Early success at round {round_i}")
            break

    return self.select_best(trajectories)
```

**Expected Benefit:** 20-30% faster convergence (fewer rounds to success)

---

## Performance Targets

### Convergence Speed

**Baseline:** SE-Darwin without ReasoningBank
- Avg iterations to success: 8-12 (empirical)

**Target:** SE-Darwin with ReasoningBank
- Avg iterations to success: 5-8 (30% reduction)

**Measurement:**
- Run 100 evolution tasks (balanced: 50 seen, 50 unseen)
- Track iterations to convergence
- Compare distributions (t-test, p<0.05)

### Memory Retrieval Latency

**Target:** <100ms per retrieval (embedding search)

**Benchmark:**
- Memory bank size: 100, 500, 1000 entries
- Query: "Fix authentication bug"
- Measure: embedding generation + FAISS search + top-k ranking

**Expected:**
- 100 entries: 20-30ms
- 500 entries: 40-60ms
- 1000 entries: 80-100ms

### Compute Overhead

**5-Stage Cycle Overhead:**
- RETRIEVE: 20-30ms (embedding search)
- ACT: 0ms (existing SE-Darwin)
- JUDGE: 0ms (existing BenchmarkValidator)
- EXTRACT: 500-1000ms (LLM call, Claude Sonnet)
- CONSOLIDATE: 10-20ms (JSON write)

**Total Overhead:** ~500-1000ms per trajectory

**Target:** <10% total evolution time overhead

---

## Risk Mitigation

### Risk 1: ReasoningBank Doesn't Improve Convergence

**Probability:** Medium (research code, unproven on SE-Darwin)

**Mitigation:**
- A/B testing: 50% traffic with ReasoningBank, 50% without
- Measure convergence improvement (target: ≥20%)
- Fallback: Disable feature flag if no improvement

**Rollback Plan:**
- Keep `use_reasoningbank=False` as default
- TrajectoryPool backward compatible
- Zero impact on existing SE-Darwin functionality

### Risk 2: Integration Breaks Existing Tests

**Probability:** Low (backward compatible design)

**Mitigation:**
- All changes behind feature flag
- Existing 44/44 SE-Darwin tests must pass
- New tests isolated (test doubles for ReasoningBank)

### Risk 3: Memory Bank Grows Too Large

**Probability:** Medium (no deduplication in ReasoningBank)

**Mitigation:**
- Phase 5 Week 3: Migrate to MongoDB
- Implement LRU eviction (keep top-k most relevant)
- Monitor memory bank size (alert at >10,000 entries)

---

## Success Criteria

### Week 2-3 Milestones

**Day 1-2:**
- [ ] ReasoningBank architecture understood
- [ ] Integration points mapped

**Day 3-4:**
- [ ] Adapter layer created (100% test pass)
- [ ] Unit tests passing

**Day 5-6:**
- [ ] TrajectoryPool refactored (backward compatible)
- [ ] Integration tests passing

**Day 7-8:**
- [ ] SE-Darwin updated (feature flag)
- [ ] 44/44 existing tests still passing

**Day 9:**
- [ ] E2E tests passing (≥90% pass rate)
- [ ] Performance benchmarks meet targets

**Day 10:**
- [ ] Documentation complete
- [ ] Handoff to production team

### Production Validation (Week 3)

- [ ] Convergence improvement measured (≥20% faster)
- [ ] Memory bank growth monitored (healthy growth rate)
- [ ] Zero regressions on SE-Darwin benchmarks
- [ ] Feature flag enabled for 10% traffic (canary deployment)
- [ ] Full rollout if metrics positive

---

## Appendix A: ReasoningBank API

### Key Classes

**`ReasoningBankAgent`:**
```python
from reasoningbank import ReasoningBankAgent, ReasoningBankConfig

config = ReasoningBankConfig(
    llm_provider="anthropic",
    llm_model="claude-3-5-sonnet-20241022",
    memory_bank_path="./data/reasoning_bank.json"
)
agent = ReasoningBankAgent(config)

# Full closed-loop execution
result = agent.execute(query="Fix login bug", max_steps=10)
```

**`Retriever`:**
```python
memories = agent.retriever.retrieve(
    query="authentication issue",
    memory_bank=agent.consolidator.memory_bank,
    top_k=5
)
# Returns: List[MemoryItem]
```

**`Judge`:**
```python
success = agent.judge.judge_trajectory(
    query="Fix login bug",
    trajectory="...code execution trace..."
)
# Returns: bool
```

**`Extractor`:**
```python
memory_items = agent.extractor.extract_from_trajectory(
    query="Fix login bug",
    trajectory="...execution trace...",
    success=True  # or False
)
# Returns: List[MemoryItem] (strategies if success, lessons if failure)
```

**`Consolidator`:**
```python
entry_id = agent.consolidator.add_to_memory_bank(
    query="Fix login bug",
    trajectory="...trace...",
    success=True,
    memory_items=[...]
)
# Returns: str (UUID)
```

---

## Appendix B: Testing Checklist

### Unit Tests (Day 3-4)

- [ ] `ReasoningBankAdapter.__init__()` - Config validation
- [ ] `ReasoningBankAdapter.learn_from_trajectory()` - Stages 3-5
- [ ] `ReasoningBankAdapter.retrieve_relevant_strategies()` - Top-k retrieval
- [ ] `ReasoningBankAdapter._format_trajectory()` - SE-Darwin → RB format
- [ ] Error handling: Invalid trajectory, LLM failures

### Integration Tests (Day 5-6)

- [ ] `TrajectoryPool.add()` with ReasoningBank enabled
- [ ] `TrajectoryPool.get_relevant()` - Embedding retrieval
- [ ] Backward compatibility: ReasoningBank disabled
- [ ] Memory bank persistence (JSON save/load)
- [ ] Concurrent access (thread safety)

### E2E Tests (Day 9)

- [ ] Learn from success - Strategy extraction
- [ ] Learn from failure - Lesson extraction
- [ ] Embedding retrieval - Semantic similarity
- [ ] MaTTS Sequential - Progressive refinement
- [ ] Feature flag - Enable/disable seamlessly
- [ ] Performance - Convergence improvement measured
- [ ] Regression - 44/44 SE-Darwin tests passing

---

## Appendix C: References

- **ReasoningBank Paper:** "ReasoningBank: Scaling Agent Self-Evolving with Reasoning Memory" (Google Cloud AI + UIUC, Sept 2025)
- **ReasoningBank GitHub:** https://github.com/budprat/ReasoningBank
- **SE-Darwin Implementation:** `/home/genesis/genesis-rebuild/agents/se_darwin_agent.py`
- **TrajectoryPool:** `/home/genesis/genesis-rebuild/infrastructure/trajectory_pool.py`
- **Memory Systems Comparison:** `/home/genesis/genesis-rebuild/docs/MEMORY_SYSTEMS_COMPARISON.md`

---

**Next Steps:**
1. ⏭️ Day 1-2: Study ReasoningBank architecture
2. ⏭️ Day 3-4: Build adapter layer
3. ⏭️ Day 5-6: Refactor TrajectoryPool
4. ⏭️ Day 7-8: Update SE-Darwin
5. ⏭️ Day 9: E2E testing
6. ⏭️ Day 10: Documentation and handoff

**Approval Required:** Hudson (Day 4), Alex (Day 9), Forge (Day 9)
