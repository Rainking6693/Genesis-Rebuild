# SPICE + SE-Darwin Integration Benchmark Plan

**Date:** November 2, 2025
**Target Impact:** +9-11% evolution accuracy (8.15/10 → 8.88-9.05/10)
**Research:** arXiv:2510.24684 (SPICE - Self-Play In Corpus Environments)
**Integration:** Layer 2 enhancement for SE-Darwin multi-trajectory evolution

---

## 1. BASELINE METRICS

### Current SE-Darwin Performance (Without SPICE)
- **QA Agent Evolution Accuracy:** 8.15/10
- **Support Agent Evolution Accuracy:** 7.98/10
- **Analyst Agent Evolution Accuracy:** 8.22/10
- **Builder Agent Evolution Accuracy:** 7.85/10
- **Average:** 8.05/10

### Success Definition
- Trajectory success rate: ≥70%
- Code quality validation: AST parsing + import validation
- Benchmark pass rate: ≥80% on test scenarios
- Execution time: <300 seconds per iteration

---

## 2. TEST SCENARIOS

### Test Set Configuration
- **Total Scenarios:** 30 per agent type (120 total)
- **Distribution:**
  - Basic (30%): Simple implementations, edge cases
  - Intermediate (40%): Multi-step problems, moderate complexity
  - Advanced (30%): Complex logic, optimization challenges

### Scenario Sources
1. **Genesis Benchmarks** (50% weight)
   - Existing 270 benchmark scenarios
   - Categorized by agent role and difficulty

2. **Corpus-Grounded Frontier Tasks** (50% weight)
   - Generated via SPICE Challenger Agent
   - Grounded in real datasets (Nemotron-CC-Math, OpenWebText)
   - Difficulty curriculum: 0.3 (easy) → 0.95 (expert)

### Agent Types Under Test
1. **QA Agent** (primary focus)
   - Evolution metric: Code quality + test pass rate
   - Baseline: 8.15/10
   - Target: 8.88-9.05/10 (+9-11%)

2. **Support Agent**
   - Evolution metric: Response quality + customer satisfaction simulation
   - Baseline: 7.98/10
   - Target: 8.78-8.88/10

3. **Analyst Agent**
   - Evolution metric: Analysis depth + accuracy
   - Baseline: 8.22/10
   - Target: 8.96-9.12/10

4. **Builder Agent**
   - Evolution metric: Code generation + compilation success
   - Baseline: 7.85/10
   - Target: 8.54-8.71/10

---

## 3. METRICS & EVALUATION

### Primary Metrics

#### 3.1 Evolution Accuracy
- **Definition:** Percentage of evolved solutions that meet success criteria
- **Measurement:** (Successful trajectories / Total trajectories) × 100
- **Target:**
  - Baseline: ~70% (from 8.15/10 scoring)
  - With SPICE: ~78-81% (from 8.88-9.05/10)

#### 3.2 Trajectory Quality Score
- **Definition:** CMP (Coherent Multi-Perspective) scoring combining:
  - Code correctness (40%): AST validation, unit test pass rate
  - Code quality (30%): Complexity, maintainability, documentation
  - Coherence (20%): Logic flow, readability
  - Domain relevance (10%): Matches problem requirements

- **Measurement:** Average CMP score across all trajectories
- **Target:** ≥8.5/10 with SPICE (vs. 7.5/10 baseline)

#### 3.3 Trajectory Diversity
- **Definition:** Cosine similarity between solution code vectors
- **Measurement:** Average pairwise dissimilarity
- **Target:**
  - Baseline diversity: 0.65 (65% different)
  - SPICE diversity: ≥0.72 (72% different)
  - **Why:** SPICE frontier tasks create more diverse solution space

#### 3.4 Initial Solution Quality
- **Definition:** Quality of first-generation trajectories
- **Measurement:** Average quality_score of generation-0 solutions
- **Target:**
  - Baseline: 6.2/10 (baseline trajectories only)
  - SPICE: 7.1-7.4/10 (SPICE + baseline mix)
  - **Impact:** Better starting point → faster convergence

### Secondary Metrics

#### 3.5 Convergence Speed
- **Definition:** Iterations to reach success threshold (7.0 CMP score)
- **Measurement:** Median iterations across all test runs
- **Target:**
  - Baseline: 2.8 iterations
  - SPICE: 2.0-2.3 iterations (28-35% faster)
  - **Hypothesis:** SPICE trajectories reduce iteration count via TUMIX early stopping

#### 3.6 Memory Efficiency
- **Definition:** Trajectory pool size needed for convergence
- **Measurement:** Total trajectories stored before success
- **Target:**
  - Baseline: ~45 trajectories per problem
  - SPICE: ~38-40 trajectories (12-15% reduction)

#### 3.7 Execution Time
- **Definition:** Total runtime per evolution cycle
- **Measurement:** Wall-clock time from start → best solution found
- **Target:**
  - Per iteration: <300 seconds (no regression)
  - SPICE overhead: <5% additional time

---

## 4. VALIDATION METHODOLOGY

### 4.1 A/B Testing Setup

**Test Configuration:**
```python
# Condition A: Baseline SE-Darwin (SPICE disabled)
agent_a = SEDarwinAgent(
    agent_name="QA",
    max_iterations=3,
    trajectories_per_iteration=3
)
agent_a.spice_enabled = False

# Condition B: SE-Darwin + SPICE (SPICE enabled)
agent_b = SEDarwinAgent(
    agent_name="QA",
    max_iterations=3,
    trajectories_per_iteration=3
)
agent_b.spice_enabled = True  # Activates Challenger + Reasoner
```

**Test Execution:**
1. Run each agent on same 30 scenarios (randomized order)
2. Record metrics for each scenario
3. Compute statistical significance (t-test, p<0.05)
4. Validate no regressions on existing benchmark suite

### 4.2 Statistical Validation

**Null Hypothesis (H₀):**
> Evolution accuracy with SPICE ≤ Evolution accuracy without SPICE

**Alternative Hypothesis (H₁):**
> Evolution accuracy with SPICE > Evolution accuracy without SPICE

**Test Method:**
- Paired t-test (30 scenario pairs)
- Significance level: α = 0.05
- **Target:** p-value < 0.05 (statistically significant improvement)

**Effect Size:**
- Cohen's d should indicate medium-to-large effect (d > 0.5)

### 4.3 Regression Testing

**Must Pass:**
1. All existing SE-Darwin unit tests (418 tests)
2. All existing trajectory pool tests (37 tests)
3. Existing operator tests (49 tests)
4. No memory leaks (valgrind/pympler check)
5. No performance degradation on baseline benchmarks

---

## 5. EXPECTED OUTCOMES

### 5.1 Success Criteria (All Must Pass)

✅ **Accuracy Improvement:**
- [ ] QA agent: 8.15/10 → 8.88-9.05/10 (+9-11%)
- [ ] Average across 4 agents: ≥8.5/10 (up from 8.05/10)
- [ ] Statistical significance: p < 0.05

✅ **Quality Metrics:**
- [ ] CMP scores: ≥8.5/10 with SPICE
- [ ] Trajectory diversity: ≥0.72 (72% dissimilar)
- [ ] Initial quality (gen-0): ≥7.1/10

✅ **Efficiency:**
- [ ] Convergence speedup: 28-35% (2.8 → 2.0-2.3 iterations)
- [ ] Memory reduction: 12-15% (45 → 38-40 trajectories)
- [ ] No execution time regression (<5% overhead)

✅ **Backward Compatibility:**
- [ ] All existing tests pass (418+ tests)
- [ ] Graceful fallback when SPICE disabled
- [ ] No crashes or exceptions in production code

---

## 6. TEST EXECUTION TIMELINE

### Phase 1: Unit Test Validation (Week 1)
- [ ] Run 10 integration tests (test_spice_darwin.py)
- [ ] Validate feature flag functionality
- [ ] Verify trajectory conversion logic
- **Target:** 10/10 tests passing

### Phase 2: Benchmark Validation (Week 2)
- [ ] A/B test on 30 scenarios per agent (120 total)
- [ ] Collect metrics: accuracy, diversity, convergence time
- [ ] Statistical significance testing (t-test)
- **Target:** p < 0.05, Cohen's d > 0.5

### Phase 3: Regression Testing (Week 3)
- [ ] Run full test suite (418 existing + 10 new = 428)
- [ ] Memory profiling (trajectory pool)
- [ ] Performance profiling (execution time)
- **Target:** 428/428 tests passing, <5% overhead

### Phase 4: Production Deployment (Week 4)
- [ ] Deploy with feature flag: `USE_SPICE=true`
- [ ] Monitor evolution metrics in production
- [ ] Validate impact on agent performance
- [ ] Document results and lessons learned

---

## 7. MONITORING & OBSERVABILITY

### 7.1 Key Metrics to Track (OTEL)

```python
# Challenger metrics
spice.challenger.tasks_generated  # Counter
spice.challenger.grounding_score  # Histogram (0.0-1.0)

# Reasoner metrics
spice.reasoner.solutions_generated  # Counter
spice.reasoner.trajectory_diversity  # Histogram

# SE-Darwin integration metrics
se_darwin.spice.frontier_tasks_per_iteration  # Histogram
se_darwin.spice.solution_quality_distribution  # Histogram
se_darwin.spice.trajectory_archiving_rate  # Counter
```

### 7.2 Dashboards

**Grafana Dashboard: SPICE Integration**
- Evolution accuracy trend (SPICE vs. baseline)
- Frontier task generation success rate
- Trajectory quality distribution
- Convergence speed comparison
- Memory usage over time

---

## 8. RISK MITIGATION

### Potential Issues & Mitigations

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|-----------|
| SPICE overhead slows evolution | Medium | High | Feature flag allows instant rollback |
| Frontier tasks hallucinate | Low | Medium | Grounding validation (threshold ≥0.7) |
| Poor quality variance rewards | Low | Medium | Quality threshold (≥0.6) + manual review |
| Memory bloat from archiving | Low | High | Trajectory pool pruning enabled |
| Convergence regression | Low | High | Full regression test suite pre-deploy |

### Rollback Plan
If metrics show regression (accuracy drops >5%):
1. Disable SPICE via `USE_SPICE=false`
2. Rollback to previous SE-Darwin agent version
3. Investigate root cause (SPICE generation quality, grounding validation)
4. Fix and retry in staging before production re-deployment

---

## 9. SUCCESS DEFINITION

### Minimum Viable Improvement
- [ ] QA agent: ≥8.70/10 (7.8% improvement from 8.15)
- [ ] Statistically significant (p < 0.05)
- [ ] Zero regressions on existing tests
- [ ] Execution time < 5% overhead

### Stretch Goal
- [ ] QA agent: 8.88-9.05/10 (9-11% improvement)
- [ ] All 4 agents improve by ≥8%
- [ ] Convergence speedup 28-35%
- [ ] Memory reduction 12-15%

---

## 10. DELIVERABLES

### Code Artifacts
- ✅ `agents/se_darwin_agent.py` - SPICE integration (completed)
- ✅ `tests/integration/test_spice_darwin.py` - 10 integration tests (completed)
- ✅ `docs/specs/SPICE_DARWIN_BENCHMARK_PLAN.md` - This document

### Test Results
- [ ] Integration test results (10/10 passing)
- [ ] Benchmark results (120 scenarios, A/B comparison)
- [ ] Statistical significance report
- [ ] Regression test report

### Documentation
- [ ] Architecture diagram: SPICE ↔ SE-Darwin integration
- [ ] User guide: Enable/disable SPICE via `USE_SPICE` env var
- [ ] Performance report: Metrics, comparisons, recommendations

---

## 11. REFERENCES

### Research Papers
- **SPICE (arXiv:2510.24684):** Self-Play In Corpus Environments
  - Challenger generates corpus-grounded frontier tasks
  - Reasoner solves ungrounded for diversity
  - Variance rewards guide trajectory selection

- **SE-Agent (arXiv:2508.02085):** Multi-trajectory evolution with revision/recombination/refinement

- **TUMIX (Implied):** Early termination optimization (51% compute savings)

### Genesis Benchmarks
- 270 scenarios (15 agents × 18 scenarios)
- Agent roles: QA, Support, Analyst, Builder, Designer, Architect, Manager, Reviewer, etc.
- Difficulty spectrum: Basic → Intermediate → Advanced

### External Datasets (Corpus)
- Nemotron-CC-Math (mathematical reasoning)
- OpenWebText (general knowledge)
- Genesis custom benchmarks (agent-specific)

---

## 12. SIGN-OFF

**Owner:** Cora (QA Auditor)
**Author:** Claude (Implementation)
**Date:** November 2, 2025

**Status:** Ready for Phase 2 Benchmark Validation

---

## Appendix A: Difficulty Curriculum

```python
# Task difficulty levels used in SPICE frontier task generation

DIFFICULTY_LEVELS = {
    0.3: "Basic",      # Simple implementations, single-step
    0.5: "Intermediate", # Multi-step, moderate complexity
    0.7: "Advanced",    # Complex logic, optimization
    0.95: "Expert"      # Specialized domain knowledge required
}
```

## Appendix B: SPICE Integration Feature Flag

```bash
# Enable SPICE self-play trajectory bootstrapping
export USE_SPICE=true

# Disable SPICE (revert to baseline SE-Darwin)
export USE_SPICE=false

# Check if SPICE is enabled in logs
# Look for: "[SEDarwinAgent] SPICE self-play trajectory bootstrapping enabled"
```

## Appendix C: Expected Output

```json
{
  "agent": "QA",
  "metric": "evolution_accuracy",
  "baseline": 8.15,
  "with_spice": 8.95,
  "improvement_percentage": 9.8,
  "statistical_significance": {
    "p_value": 0.018,
    "cohens_d": 0.64,
    "significant": true
  },
  "convergence_speed": {
    "baseline_iterations": 2.8,
    "spice_iterations": 2.1,
    "speedup_percentage": 25
  }
}
```
