---
title: SE-Darwin Sparse Memory Integration Specification
category: Architecture
dg-publish: true
publish: true
tags: []
source: docs/SE_DARWIN_SPARSE_MEMORY_INTEGRATION.md
exported: '2025-10-24T22:05:26.911479'
---

# SE-Darwin Sparse Memory Integration Specification
**Version:** 1.0
**Date:** October 24, 2025
**Owner:** Cora → Thon (Implementation Day 5-6)

---

## INTEGRATION POINTS

### 1. se_darwin_agent.py Modifications

**File:** `/home/genesis/genesis-rebuild/agents/se_darwin_agent.py`

**Changes Required:**

```python
# Line 1: Add imports
from agents.sparse_memory.adaptive_operator_selector import AdaptiveOperatorSelector
from agents.sparse_memory.hot_spot_focuser import HotSpotFocuser
from agents.sparse_memory.embedding_compressor import EmbeddingCompressor
from agents.sparse_memory.convergence_detector import ConvergenceDetector
from agents.sparse_memory.diversity_metric import DiversityMetric

# Line 45: Initialize sparse memory modules in __init__
class SEDarwinAgent:
    def __init__(self, ...):
        # Existing initialization...

        # NEW: Sparse memory modules
        self.operator_selector = AdaptiveOperatorSelector(
            operators=["Revision", "Recombination", "Refinement"]
        )
        self.hot_spot_focuser = HotSpotFocuser()
        self.embedding_compressor = EmbeddingCompressor(quantization_bits=8)
        self.convergence_detector = ConvergenceDetector(base_threshold=0.85)
        self.diversity_metric = DiversityMetric(min_diversity=0.3)

# Line 180: Modify _evolution_loop to use adaptive operators
async def _evolution_loop(self, agent_name: str) -> EvolutionResult:
    baseline_trajectory = self._generate_baseline_trajectory(agent_name)
    best_trajectory = baseline_trajectory
    iteration = 0

    while iteration < self.max_iterations:
        # NEW: Adaptive operator selection (replace random.choice)
        operator_name = self.operator_selector.select_operator()  # Was: random.choice(["Revision", ...])
        operator = self.operators[operator_name]

        # Generate trajectory
        new_trajectory = await operator.apply(best_trajectory)

        # NEW: Hot spot validation (replace full AST parse)
        quality = self.hot_spot_focuser.validate_code_sparse(
            code=new_trajectory.code,
            baseline_code=best_trajectory.code
        )

        # Run benchmarks (with compressed embeddings)
        score = await self._run_benchmarks(new_trajectory, use_compressed=True)

        # NEW: Update operator success (for adaptive selection)
        improvement = score - best_trajectory.score
        self.operator_selector.update(operator_name, improvement)

        if score > best_trajectory.score:
            best_trajectory = new_trajectory
            logger.info(f"Iteration {iteration}: New best score {score:.3f}")

        # NEW: Check convergence with adaptive detector
        converged, reason = self.convergence_detector.check_convergence(
            current_score=best_trajectory.score,
            agent_complexity=self._estimate_complexity(),
            iteration=iteration
        )

        if converged:
            logger.info(f"Convergence detected: {reason}")
            break

        # NEW: Check diversity and restart if needed
        all_codes = [t.code for t in self.trajectory_pool.trajectories]
        diversity = self.diversity_metric.compute_diversity(all_codes)

        if self.diversity_metric.should_restart(diversity, iteration):
            logger.info("Restarting with diverse seed...")
            best_trajectory = self._generate_diverse_seed()

        iteration += 1

    return EvolutionResult(
        agent_name=agent_name,
        final_trajectory=best_trajectory,
        iterations=iteration,
        score=best_trajectory.score
    )

# Line 320: Modify _run_benchmarks to use compressed embeddings
async def _run_benchmarks(self, trajectory: Trajectory, use_compressed: bool = True) -> float:
    scores = []

    for benchmark in self.benchmarks:
        # Generate embedding for trajectory
        embedding = self._generate_embedding(trajectory.code)

        # NEW: Compress embedding if enabled
        if use_compressed:
            embedding = self.embedding_compressor.compress_embedding(
                embedding=embedding,
                embedding_id=trajectory.id
            )

        # Compare with benchmark embedding
        benchmark_embedding = self._get_benchmark_embedding(benchmark.id, use_compressed)
        similarity = self.embedding_compressor.cosine_similarity_compressed(
            embedding, benchmark_embedding
        ) if use_compressed else self._cosine_similarity(embedding, benchmark_embedding)

        scores.append(similarity)

    return np.mean(scores)
```

---

## 2. MODIFIED METHODS

### Method: `_generate_baseline_trajectory`
**Change:** No change needed (baseline generation unchanged)

### Method: `_estimate_complexity`
**Change:** No change needed (complexity estimation unchanged)

### Method: `_generate_diverse_seed`
**New Method:** Generate trajectory with high Hamming distance from current population

```python
def _generate_diverse_seed(self) -> Trajectory:
    """Generate diverse trajectory for restart."""
    current_codes = [t.code for t in self.trajectory_pool.trajectories]

    # Generate 5 random mutations
    candidates = [self._mutate_code(self.baseline_code) for _ in range(5)]

    # Select most diverse
    best_diversity = 0
    best_candidate = candidates[0]

    for candidate in candidates:
        avg_distance = np.mean([
            self.diversity_metric._hamming_distance(candidate, code)
            for code in current_codes
        ])
        if avg_distance > best_diversity:
            best_diversity = avg_distance
            best_candidate = candidate

    return Trajectory(code=best_candidate, score=0.0)
```

---

## 3. CONFIGURATION

**Feature Flag:** `config/features.yaml`

```yaml
sparse_memory_finetuning:
  enabled: true
  adaptive_operators: true
  hot_spot_focusing: true
  embedding_compression: true
  aggressive_stopping: true
  diversity_restart: true
  quantization_bits: 8  # 8 or 16
  early_stop_threshold: 0.85
  min_diversity: 0.3
```

---

## 4. PERFORMANCE MONITORING

**New Metrics (OTEL):**

```python
from opentelemetry import metrics

meter = metrics.get_meter(__name__)

# Sparse memory metrics
iterations_counter = meter.create_counter("se_darwin_iterations")
memory_gauge = meter.create_gauge("se_darwin_memory_mb")
operator_success_counter = meter.create_counter("se_darwin_operator_success")
convergence_time_histogram = meter.create_histogram("se_darwin_convergence_time_seconds")
```

---

## 5. TESTING STRATEGY

**File:** `tests/test_sparse_memory_integration.py`

**Test Cases:**
1. ✅ Adaptive operator selection improves over random
2. ✅ Hot spot focusing faster than full AST parse
3. ✅ Compressed embeddings <2% accuracy loss
4. ✅ Early stopping reduces iterations by 20%+
5. ✅ Diversity restart prevents local optima

---

## 6. ROLLBACK PLAN

If issues detected:

```python
# Disable via feature flag
sparse_memory_finetuning:
  enabled: false  # Reverts to baseline SE-Darwin
```

---

## 7. DEPLOYMENT TIMELINE

- **Day 5:** Implementation (Thon)
- **Day 6:** Integration testing (Thon + Alex)
- **Day 7:** Production rollout (7-day progressive 0% → 100%)

---

**Total Changes:** 5 new imports, 3 modified methods, 1 new method, ~200 lines integration code
