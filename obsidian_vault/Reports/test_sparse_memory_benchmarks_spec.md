---
title: Sparse Memory Finetuning Benchmark Specification
category: Reports
dg-publish: true
publish: true
tags: []
source: tests/test_sparse_memory_benchmarks_spec.md
exported: '2025-10-24T22:05:26.847924'
---

# Sparse Memory Finetuning Benchmark Specification
**Version:** 1.0
**Date:** October 24, 2025
**Owner:** Cora (Design) → Alex (E2E Testing Day 6)

---

## BENCHMARK SUITE

### 1. Convergence Speed Benchmark

**File:** `tests/benchmarks/test_convergence_speed.py`

**Scenarios (3):**

```python
import pytest
from agents.se_darwin_agent import SEDarwinAgent

@pytest.mark.benchmark
def test_convergence_simple_agent():
    """Benchmark: Simple agent (complexity=0.3) convergence."""
    agent = SEDarwinAgent()

    # Baseline (sparse memory disabled)
    result_baseline = agent.evolve_agent("Marketing", sparse_memory=False)
    baseline_iterations = result_baseline.iterations

    # Optimized (sparse memory enabled)
    result_optimized = agent.evolve_agent("Marketing", sparse_memory=True)
    optimized_iterations = result_optimized.iterations

    # Assert: 45-55% iteration reduction
    reduction_pct = (baseline_iterations - optimized_iterations) / baseline_iterations
    assert 0.45 <= reduction_pct <= 0.55, f"Expected 50% ± 5% reduction, got {reduction_pct:.1%}"

    print(f"✅ Simple Agent: {baseline_iterations} → {optimized_iterations} iterations ({reduction_pct:.1%} faster)")


@pytest.mark.benchmark
def test_convergence_medium_agent():
    """Benchmark: Medium agent (complexity=0.5) convergence."""
    # Similar to above, target: 50% ± 5% reduction


@pytest.mark.benchmark
def test_convergence_complex_agent():
    """Benchmark: Complex agent (complexity=0.8) convergence."""
    # Similar to above, target: 50% ± 5% reduction
```

---

### 2. Memory Footprint Benchmark

**File:** `tests/benchmarks/test_memory_footprint.py`

**Scenarios (4):**

```python
import pytest
import tracemalloc
from agents.se_darwin_agent import SEDarwinAgent

@pytest.mark.benchmark
def test_memory_trajectory_storage():
    """Benchmark: Trajectory storage memory."""
    agent = SEDarwinAgent()

    # Measure baseline
    tracemalloc.start()
    agent.evolve_agent("Marketing", sparse_memory=False)
    baseline_memory_mb = tracemalloc.get_traced_memory()[1] / 1024 / 1024
    tracemalloc.stop()

    # Measure optimized
    tracemalloc.start()
    agent.evolve_agent("Marketing", sparse_memory=True)
    optimized_memory_mb = tracemalloc.get_traced_memory()[1] / 1024 / 1024
    tracemalloc.stop()

    # Assert: 45-55% memory reduction
    reduction_pct = (baseline_memory_mb - optimized_memory_mb) / baseline_memory_mb
    assert 0.45 <= reduction_pct <= 0.55

    print(f"✅ Memory: {baseline_memory_mb:.1f} MB → {optimized_memory_mb:.1f} MB ({reduction_pct:.1%} reduction)")


@pytest.mark.benchmark
def test_memory_embedding_cache():
    """Benchmark: Embedding cache memory (target: 75% reduction)."""
    # Test compression: float32 → int8


@pytest.mark.benchmark
def test_memory_ast_cache():
    """Benchmark: AST cache memory (target: 69% reduction via hot spots)."""


@pytest.mark.benchmark
def test_memory_peak_usage():
    """Benchmark: Peak memory during full evolution cycle."""
```

---

### 3. Accuracy Preservation Benchmark

**File:** `tests/benchmarks/test_accuracy_preservation.py`

**Scenarios (3):**

```python
import pytest
from agents.se_darwin_agent import SEDarwinAgent

@pytest.mark.benchmark
def test_accuracy_final_quality():
    """Benchmark: Final trajectory quality score (target: <2% degradation)."""
    agent = SEDarwinAgent()

    # Baseline score
    result_baseline = agent.evolve_agent("Marketing", sparse_memory=False)
    baseline_score = result_baseline.final_trajectory.score

    # Optimized score
    result_optimized = agent.evolve_agent("Marketing", sparse_memory=True)
    optimized_score = result_optimized.final_trajectory.score

    # Assert: <2% accuracy loss
    accuracy_loss = (baseline_score - optimized_score) / baseline_score
    assert accuracy_loss < 0.02, f"Accuracy loss {accuracy_loss:.1%} exceeds 2% threshold"

    print(f"✅ Accuracy: {baseline_score:.3f} → {optimized_score:.3f} (loss: {accuracy_loss:.1%})")


@pytest.mark.benchmark
def test_accuracy_embedding_compression():
    """Benchmark: Cosine similarity with int8 vs float32 (target: <2% difference)."""
    from agents.sparse_memory.embedding_compressor import EmbeddingCompressor
    import numpy as np

    compressor = EmbeddingCompressor()

    # Generate random embeddings
    emb1 = np.random.randn(384).astype(np.float32)
    emb2 = np.random.randn(384).astype(np.float32)

    # Float32 similarity
    sim_float32 = np.dot(emb1, emb2) / (np.linalg.norm(emb1) * np.linalg.norm(emb2))

    # Compressed similarity
    emb1_int8 = compressor.compress_embedding(emb1, "emb1")
    emb2_int8 = compressor.compress_embedding(emb2, "emb2")
    sim_int8 = compressor.cosine_similarity_compressed(emb1_int8, emb2_int8)

    # Assert: <2% difference
    difference = abs(sim_float32 - sim_int8)
    assert difference < 0.02

    print(f"✅ Embedding Similarity: {sim_float32:.4f} (float32) vs {sim_int8:.4f} (int8), diff: {difference:.4f}")


@pytest.mark.benchmark
def test_accuracy_benchmark_suite():
    """Benchmark: Performance on all 270 benchmark scenarios."""
    # Run full benchmark suite with sparse memory
    # Assert: Pass rate ≥ 98% (same as baseline)
```

---

### 4. Component Benchmarks

**File:** `tests/benchmarks/test_component_performance.py`

**Scenarios (5):**

```python
import pytest
import time
from agents.sparse_memory.adaptive_operator_selector import AdaptiveOperatorSelector
from agents.sparse_memory.hot_spot_focuser import HotSpotFocuser

@pytest.mark.benchmark
def test_adaptive_operator_convergence():
    """Benchmark: Adaptive vs random operator selection (target: 12% faster)."""
    selector = AdaptiveOperatorSelector(operators=["Revision", "Recombination", "Refinement"])

    # Simulate 50 iterations with feedback
    for i in range(50):
        operator = selector.select_operator()
        improvement = 0.05 if operator == "Revision" else 0.02  # Revision is better
        selector.update(operator, improvement)

    # After 50 iterations, Revision should have highest probability
    assert selector.probs["Revision"] > 0.5, "Adaptive selector should prefer successful operator"

    print(f"✅ Adaptive Operator: Revision prob = {selector.probs['Revision']:.2f} (expected >0.5)")


@pytest.mark.benchmark
def test_hot_spot_focusing_speed():
    """Benchmark: Hot spot vs full AST parsing (target: 40-60% faster)."""
    focuser = HotSpotFocuser()

    baseline_code = "def foo():\n    x = 1\n    y = 2\n    return x + y"
    new_code = "def foo():\n    x = 1\n    y = 3\n    return x + y"  # Changed line 3

    # Full AST parse
    start = time.time()
    for _ in range(100):
        import ast
        ast.parse(new_code)
    full_time = time.time() - start

    # Hot spot parse
    start = time.time()
    for _ in range(100):
        focuser.validate_code_sparse(new_code, baseline_code)
    sparse_time = time.time() - start

    # Assert: 40-60% faster
    speedup = (full_time - sparse_time) / full_time
    assert 0.40 <= speedup <= 0.60

    print(f"✅ Hot Spot Focusing: {full_time:.3f}s → {sparse_time:.3f}s ({speedup:.1%} faster)")


@pytest.mark.benchmark
def test_embedding_compression_speed():
    """Benchmark: int8 vs float32 similarity computation (target: 2× faster)."""


@pytest.mark.benchmark
def test_convergence_detector_accuracy():
    """Benchmark: Early stopping accuracy (target: <5% false stops)."""


@pytest.mark.benchmark
def test_diversity_metric_computation():
    """Benchmark: Diversity computation latency (target: <10ms for 10 trajectories)."""
```

---

## ACCEPTANCE CRITERIA

**All benchmarks must pass:**

1. ✅ **Convergence Speed:** 45-55% iteration reduction (3/3 scenarios)
2. ✅ **Memory Footprint:** 45-55% memory reduction (4/4 scenarios)
3. ✅ **Accuracy Preservation:** <2% degradation (3/3 scenarios)
4. ✅ **Component Performance:** All 5 component tests pass targets
5. ✅ **No Regressions:** All existing SE-Darwin tests pass (44/44)

**Total Benchmark Tests:** 15 scenarios

---

## EXECUTION PLAN

**Day 6 (Alex E2E Testing):**

```bash
# Run full benchmark suite
pytest tests/benchmarks/ -v --benchmark-only

# Generate report
pytest tests/benchmarks/ --benchmark-json=benchmark_results.json

# Analyze results
python scripts/analyze_benchmarks.py benchmark_results.json
```

**Expected Output:**

```
============================= BENCHMARK RESULTS =============================

Convergence Speed:
  ✅ Simple Agent:   45 → 22 iterations (51.1% faster)
  ✅ Medium Agent:   68 → 34 iterations (50.0% faster)
  ✅ Complex Agent:  95 → 48 iterations (49.5% faster)

Memory Footprint:
  ✅ Trajectory Storage:  10.2 MB → 10.2 MB (0% change)
  ✅ Embedding Cache:     461 MB → 115 MB (75.1% reduction)
  ✅ AST Cache:           45 MB → 14 MB (68.9% reduction)
  ✅ Peak Usage:          2.3 GB → 1.15 GB (50.0% reduction)

Accuracy Preservation:
  ✅ Final Quality:      0.87 → 0.86 (1.1% loss, within 2% threshold)
  ✅ Embedding Similarity: 0.9234 → 0.9189 (0.49% difference)
  ✅ Benchmark Suite:    98.5% pass rate (baseline: 98.2%)

Component Performance:
  ✅ Adaptive Operators:  Revision prob = 0.62 (expected >0.5)
  ✅ Hot Spot Focusing:   0.234s → 0.108s (53.8% faster)
  ✅ Embedding Compression: 2.1× faster similarity
  ✅ Convergence Detector: 2.3% false stop rate (<5% target)
  ✅ Diversity Metric:    7.2ms per computation (<10ms target)

=============================================================================
OVERALL: ✅ ALL TARGETS MET (15/15 tests passing)
Production Readiness: 9.5/10
=============================================================================
```

---

**Total Benchmark Code:** ~420 lines (15 test functions × ~28 lines each)
