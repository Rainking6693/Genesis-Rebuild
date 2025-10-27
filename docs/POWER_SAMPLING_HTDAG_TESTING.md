# Power Sampling HTDAG Testing Guide

**Author:** Cora (AI Orchestration Architect)
**Date:** October 25, 2025
**Status:** Day 1 Complete - Testing Framework Ready
**Owner:** Alex (Integration Testing Specialist), Forge (E2E Testing)
**Reviewers:** Hudson (Code Review), Thon (Implementation), Cora (Architecture)

---

## 🎯 TESTING OBJECTIVES

### Primary Goals
1. **Validate Quality Improvement:** Confirm +15-25% decomposition quality vs baseline
2. **Ensure Zero Regressions:** All existing HTDAG tests pass with Power Sampling disabled
3. **Performance Validation:** P95 latency <5s, cost multiplier <15x
4. **Production Readiness:** 100% test coverage on new code, 0 P0 bugs

### Testing Philosophy
- **Automated First:** All tests run in CI/CD pipeline
- **Data-Driven:** Use 50 real benchmark scenarios (not mocks)
- **Statistical Rigor:** t-test validation (p<0.05) for quality claims
- **Incremental Rollout:** Feature flag testing at 0%, 10%, 25%, 50%, 75%, 90%, 100%

---

## 📚 TEST SUITE ARCHITECTURE

### Test Pyramid Structure

```
                    ┌─────────────────────┐
                    │   E2E Tests (10)    │  ← Production-like flows
                    │  Full orchestration │
                    └─────────────────────┘
                           ▲
                           │
                  ┌────────────────────────┐
                  │ Integration Tests (20) │  ← Component interactions
                  │  HTDAG + Power Sampling│
                  └────────────────────────┘
                           ▲
                           │
              ┌────────────────────────────────┐
              │     Unit Tests (50+)           │  ← Individual functions
              │  MCMC, Quality Metrics, etc.   │
              └────────────────────────────────┘
                           ▲
                           │
         ┌──────────────────────────────────────────┐
         │     Benchmark Tests (50 scenarios)       │  ← A/B quality validation
         │  Power Sampling vs Baseline comparison   │
         └──────────────────────────────────────────┘
```

### Test File Structure

```
tests/
├── test_power_sampling.py (50+ unit tests)
│   ├── MCMC iteration logic
│   ├── Block resampling correctness
│   ├── Quality evaluator integration
│   ├── Error handling (LLM failures, malformed JSON)
│   └── Performance tests (latency, token usage)
│
├── test_htdag_quality_metrics.py (40+ unit tests)
│   ├── Completeness scoring
│   ├── Coherence detection (duplicates, similarity)
│   ├── Feasibility validation
│   ├── Diversity measurement
│   └── Combined quality calculation
│
├── test_htdag_power_sampling_integration.py (20 integration tests)
│   ├── HTDAG integration (feature flag behavior)
│   ├── Fallback to baseline on failure
│   ├── Metrics recording (Prometheus)
│   ├── Configuration validation
│   └── Concurrent request handling
│
├── test_htdag_power_sampling_benchmark.py (50 benchmark scenarios)
│   ├── A/B comparison (25 Power Sampling, 25 baseline)
│   ├── Quality delta calculation
│   ├── Statistical significance (t-test)
│   └── Performance validation
│
└── test_htdag_power_sampling_e2e.py (10 E2E tests)
    ├── Full orchestration flow
    ├── Real user requests
    ├── Production-like load
    └── Monitoring dashboard validation
```

---

## 🧪 UNIT TESTS (50+ tests)

### File: `tests/test_power_sampling.py`

**Owner:** Thon (Day 2 Implementation)
**Coverage Target:** 95%+
**Test Count:** 50+ tests

#### Test Categories

**1. MCMC Iteration Logic (15 tests)**
```python
import pytest
from infrastructure.power_sampling import power_sample, resample_blocks, PowerSamplingConfig

class TestMCMCIterations:
    """Test MCMC exploration correctness"""

    @pytest.mark.asyncio
    async def test_mcmc_completes_all_iterations(self, mock_llm_client):
        """Verify MCMC runs exactly n_mcmc iterations"""
        result = await power_sample(
            model=mock_llm_client,
            system_prompt="Test prompt",
            user_prompt="Build a SaaS business",
            response_schema={"type": "object"},
            n_mcmc=10
        )

        assert result["metadata"]["num_iterations"] == 10

    @pytest.mark.asyncio
    async def test_mcmc_tracks_best_sample(self, mock_llm_client):
        """Verify best sample (highest quality) is returned"""
        # Mock quality scores: [0.5, 0.7, 0.6, 0.9, 0.8, ...]
        result = await power_sample(
            model=mock_llm_client,
            system_prompt="Test prompt",
            user_prompt="Test request",
            response_schema={"type": "object"},
            n_mcmc=5
        )

        # Best sample should have quality 0.9
        assert result["quality_score"] == 0.9

    @pytest.mark.asyncio
    async def test_mcmc_early_stopping_on_plateau(self, mock_llm_client):
        """Test early stopping when quality plateaus (3 consecutive iterations <1% improvement)"""
        # Mock quality scores: [0.5, 0.6, 0.65, 0.651, 0.652] ← plateau
        result = await power_sample(
            model=mock_llm_client,
            system_prompt="Test prompt",
            user_prompt="Test request",
            response_schema={"type": "object"},
            n_mcmc=10,
            early_stopping=True
        )

        # Should stop early (before 10 iterations)
        assert result["metadata"]["num_iterations"] < 10
        assert result["metadata"]["stop_reason"] == "quality_plateau"

    # ... 12 more MCMC tests (edge cases, failure modes, etc.)
```

**2. Block Resampling (12 tests)**
```python
class TestBlockResampling:
    """Test block-parallel resampling logic"""

    @pytest.mark.asyncio
    async def test_block_resampling_preserves_structure(self, mock_llm_client):
        """Verify resampled blocks maintain JSON structure"""
        original = '{"tasks": [{"id": "1"}, {"id": "2"}, {"id": "3"}]}'

        resampled = await resample_blocks(
            model=mock_llm_client,
            previous_sample=original,
            block_size=32,
            alpha=2.0,
            temperature=0.7
        )

        # Should still be valid JSON
        import json
        parsed = json.loads(resampled)
        assert "tasks" in parsed
        assert isinstance(parsed["tasks"], list)

    @pytest.mark.asyncio
    async def test_block_resampling_changes_content(self, mock_llm_client):
        """Verify resampling actually modifies content (exploration)"""
        original = '{"tasks": [{"id": "1"}]}'

        resampled = await resample_blocks(
            model=mock_llm_client,
            previous_sample=original,
            block_size=32,
            alpha=2.0,
            temperature=0.7
        )

        # Resampled should differ from original
        assert resampled != original

    def test_block_size_tokenization(self):
        """Verify block_size correctly divides text into token blocks"""
        text = "This is a test sentence with multiple words."

        from infrastructure.power_sampling import _tokenize_into_blocks
        blocks = _tokenize_into_blocks(text, block_size=4)

        # Each block should have ~4 tokens (±1 for encoding)
        for block in blocks:
            assert 3 <= len(block.split()) <= 5

    # ... 9 more block resampling tests
```

**3. Quality Evaluator Integration (8 tests)**
```python
class TestQualityEvaluator:
    """Test quality evaluation during MCMC"""

    @pytest.mark.asyncio
    async def test_custom_quality_evaluator_used(self, mock_llm_client):
        """Verify custom quality evaluator is called"""
        call_count = 0

        def custom_evaluator(decomposition):
            nonlocal call_count
            call_count += 1
            return 0.8

        await power_sample(
            model=mock_llm_client,
            system_prompt="Test",
            user_prompt="Test",
            response_schema={"type": "object"},
            n_mcmc=5,
            quality_evaluator=custom_evaluator
        )

        # Should call evaluator 5 times (once per MCMC iteration)
        assert call_count == 5

    @pytest.mark.asyncio
    async def test_default_quality_evaluator_fallback(self, mock_llm_client):
        """Verify default evaluator used when custom=None"""
        result = await power_sample(
            model=mock_llm_client,
            system_prompt="Test",
            user_prompt="Test",
            response_schema={"type": "object"},
            n_mcmc=3,
            quality_evaluator=None  # Use default
        )

        # Should still have quality score
        assert "quality_score" in result
        assert 0.0 <= result["quality_score"] <= 1.0

    # ... 6 more quality evaluator tests
```

**4. Error Handling (10 tests)**
```python
class TestErrorHandling:
    """Test graceful error handling"""

    @pytest.mark.asyncio
    async def test_llm_failure_during_mcmc(self, mock_llm_client_with_failures):
        """Verify graceful handling of LLM failures mid-MCMC"""
        # Mock LLM that fails on iteration 3
        result = await power_sample(
            model=mock_llm_client_with_failures,
            system_prompt="Test",
            user_prompt="Test",
            response_schema={"type": "object"},
            n_mcmc=5
        )

        # Should continue with remaining iterations
        assert result["metadata"]["num_iterations"] >= 2
        assert result["metadata"]["num_failures"] == 1

    @pytest.mark.asyncio
    async def test_malformed_json_handling(self, mock_llm_client_malformed):
        """Verify malformed JSON doesn't crash MCMC loop"""
        # Mock LLM returns invalid JSON
        result = await power_sample(
            model=mock_llm_client_malformed,
            system_prompt="Test",
            user_prompt="Test",
            response_schema={"type": "object"},
            n_mcmc=3
        )

        # Should return valid result (skip malformed samples)
        assert "tasks" in result
        assert isinstance(result["tasks"], list)

    @pytest.mark.asyncio
    async def test_timeout_fallback_to_baseline(self, mock_llm_client_slow):
        """Verify timeout triggers fallback to baseline"""
        with pytest.raises(TimeoutError):
            await power_sample(
                model=mock_llm_client_slow,
                system_prompt="Test",
                user_prompt="Test",
                response_schema={"type": "object"},
                n_mcmc=10,
                timeout_seconds=1  # 1 second timeout
            )

    # ... 7 more error handling tests
```

**5. Performance Tests (5 tests)**
```python
class TestPerformance:
    """Test latency and token usage"""

    @pytest.mark.asyncio
    async def test_latency_within_slo(self, mock_llm_client):
        """Verify P95 latency <5s for n_mcmc=10"""
        import time

        start = time.time()
        await power_sample(
            model=mock_llm_client,
            system_prompt="Test",
            user_prompt="Test",
            response_schema={"type": "object"},
            n_mcmc=10
        )
        elapsed = time.time() - start

        # Should complete within 5 seconds
        assert elapsed < 5.0

    @pytest.mark.asyncio
    async def test_token_usage_tracked(self, mock_llm_client):
        """Verify token usage is tracked correctly"""
        result = await power_sample(
            model=mock_llm_client,
            system_prompt="Test",
            user_prompt="Test",
            response_schema={"type": "object"},
            n_mcmc=5
        )

        # Should track total tokens consumed
        assert "metadata" in result
        assert "token_usage" in result["metadata"]
        assert result["metadata"]["token_usage"] > 0

    # ... 3 more performance tests
```

---

### File: `tests/test_htdag_quality_metrics.py`

**Owner:** Thon (Day 2 Implementation)
**Coverage Target:** 100% (deterministic code)
**Test Count:** 40+ tests

#### Test Categories

**1. Completeness Scoring (10 tests)**
```python
from infrastructure.htdag_quality_metrics import (
    evaluate_decomposition_quality,
    _evaluate_completeness,
    _evaluate_coherence,
    _evaluate_feasibility,
    _evaluate_diversity
)
from infrastructure.task_dag import Task

class TestCompletenessScoring:
    """Test completeness dimension (40% weight)"""

    def test_perfect_completeness(self):
        """All tasks have required fields → score 1.0"""
        tasks = [
            Task(task_id="task1", task_type="design", description="Design architecture"),
            Task(task_id="task2", task_type="implement", description="Implement backend"),
            Task(task_id="task3", task_type="test", description="Write tests")
        ]

        score = _evaluate_completeness(tasks)
        assert score == 1.0

    def test_missing_task_ids(self):
        """Missing task_id → lower score"""
        tasks = [
            Task(task_id="", task_type="design", description="Design"),  # Missing ID
            Task(task_id="task2", task_type="implement", description="Implement")
        ]

        score = _evaluate_completeness(tasks)
        assert score == 0.5  # 1/2 tasks complete

    def test_missing_descriptions(self):
        """Missing descriptions → lower score"""
        tasks = [
            Task(task_id="task1", task_type="design", description=""),  # Empty
            Task(task_id="task2", task_type="implement", description="Build API")
        ]

        score = _evaluate_completeness(tasks)
        assert score == 0.5

    def test_short_descriptions_penalized(self):
        """Descriptions <10 chars considered incomplete"""
        tasks = [
            Task(task_id="task1", task_type="design", description="Design"),  # 6 chars
            Task(task_id="task2", task_type="implement", description="Implement backend API")
        ]

        score = _evaluate_completeness(tasks)
        assert score == 0.5

    # ... 6 more completeness tests
```

**2. Coherence Detection (12 tests)**
```python
class TestCoherenceScoring:
    """Test coherence dimension (30% weight)"""

    def test_no_duplicate_task_ids(self):
        """Unique task IDs → high coherence"""
        tasks = [
            Task(task_id="task1", task_type="design", description="Design"),
            Task(task_id="task2", task_type="implement", description="Implement"),
            Task(task_id="task3", task_type="test", description="Test")
        ]

        score = _evaluate_coherence(tasks)
        assert score >= 0.9

    def test_duplicate_task_ids_penalty(self):
        """Duplicate task IDs → penalty"""
        tasks = [
            Task(task_id="task1", task_type="design", description="Design"),
            Task(task_id="task1", task_type="implement", description="Implement"),  # Duplicate
        ]

        score = _evaluate_coherence(tasks)
        assert score <= 0.7  # 0.3 penalty for duplicates

    def test_duplicate_descriptions_penalty(self):
        """Exact duplicate descriptions → penalty"""
        tasks = [
            Task(task_id="task1", task_type="design", description="Build backend API"),
            Task(task_id="task2", task_type="implement", description="Build backend API"),  # Duplicate
        ]

        score = _evaluate_coherence(tasks)
        assert score <= 0.8  # 0.2 penalty

    def test_similar_descriptions_penalty(self):
        """Similar descriptions (>70% Jaccard) → penalty"""
        tasks = [
            Task(task_id="task1", task_type="design", description="Build backend API for users"),
            Task(task_id="task2", task_type="implement", description="Build backend API for customers"),  # 80% similar
        ]

        score = _evaluate_coherence(tasks)
        assert score <= 0.9  # 0.1 penalty

    # ... 8 more coherence tests
```

**3. Feasibility Validation (10 tests)**
```python
class TestFeasibilityScoring:
    """Test feasibility dimension (20% weight)"""

    def test_reasonable_task_count(self):
        """3-10 tasks → high feasibility"""
        tasks = [
            Task(task_id=f"task{i}", task_type="design", description=f"Task {i}")
            for i in range(5)
        ]

        score = _evaluate_feasibility(tasks)
        assert score >= 0.9

    def test_too_few_tasks_penalty(self):
        """<2 tasks → underspecified penalty"""
        tasks = [
            Task(task_id="task1", task_type="generic", description="Do everything")
        ]

        score = _evaluate_feasibility(tasks)
        assert score <= 0.7  # 0.3 penalty

    def test_too_many_tasks_penalty(self):
        """>15 tasks → over-decomposed penalty"""
        tasks = [
            Task(task_id=f"task{i}", task_type="generic", description=f"Task {i}")
            for i in range(20)
        ]

        score = _evaluate_feasibility(tasks)
        assert score <= 0.8  # 0.2 penalty

    def test_abstract_task_types_penalty(self):
        """>50% abstract types (generic, research) → penalty"""
        tasks = [
            Task(task_id="task1", task_type="generic", description="Research"),
            Task(task_id="task2", task_type="generic", description="Analyze"),
            Task(task_id="task3", task_type="implement", description="Build")
        ]

        score = _evaluate_feasibility(tasks)
        assert score <= 0.7  # 0.3 penalty (2/3 abstract)

    # ... 6 more feasibility tests
```

**4. Diversity Measurement (8 tests)**
```python
class TestDiversityScoring:
    """Test diversity dimension (10% weight)"""

    def test_varied_task_types(self):
        """Multiple unique task types → high diversity"""
        tasks = [
            Task(task_id="task1", task_type="design", description="Design"),
            Task(task_id="task2", task_type="implement", description="Implement"),
            Task(task_id="task3", task_type="test", description="Test"),
            Task(task_id="task4", task_type="deploy", description="Deploy")
        ]

        score = _evaluate_diversity(tasks)
        assert score >= 0.9  # 4/4 unique types + major phases bonus

    def test_all_same_type_low_diversity(self):
        """All tasks same type → low diversity"""
        tasks = [
            Task(task_id="task1", task_type="generic", description="Task 1"),
            Task(task_id="task2", task_type="generic", description="Task 2"),
            Task(task_id="task3", task_type="generic", description="Task 3")
        ]

        score = _evaluate_diversity(tasks)
        assert score <= 0.5  # 1/3 unique types = 0.33 + no major phases

    # ... 6 more diversity tests
```

---

## 🔗 INTEGRATION TESTS (20 tests)

### File: `tests/test_htdag_power_sampling_integration.py`

**Owner:** Alex (Integration Testing Specialist)
**Coverage Target:** 90%+
**Test Count:** 20 tests

#### Test Categories

**1. HTDAG Integration (8 tests)**
```python
import pytest
from infrastructure.htdag_planner import HTDAGPlanner
from infrastructure.power_sampling import power_sample

class TestHTDAGIntegration:
    """Test HTDAG + Power Sampling integration"""

    @pytest.mark.asyncio
    async def test_feature_flag_enabled(self, mock_llm_client):
        """Verify Power Sampling used when feature flag enabled"""
        planner = HTDAGPlanner(llm_client=mock_llm_client)
        planner.config = {"use_power_sampling": True}

        dag = await planner.decompose_task("Build a SaaS business")

        # Verify Power Sampling was called (check metrics)
        assert mock_llm_client.call_count >= 10  # MCMC iterations

    @pytest.mark.asyncio
    async def test_feature_flag_disabled(self, mock_llm_client):
        """Verify baseline used when feature flag disabled"""
        planner = HTDAGPlanner(llm_client=mock_llm_client)
        planner.config = {"use_power_sampling": False}

        dag = await planner.decompose_task("Build a SaaS business")

        # Verify baseline was called (single-shot)
        assert mock_llm_client.call_count == 1

    @pytest.mark.asyncio
    async def test_fallback_to_baseline_on_power_sampling_failure(self, mock_llm_client_failing):
        """Verify fallback to baseline if Power Sampling fails"""
        planner = HTDAGPlanner(llm_client=mock_llm_client_failing)
        planner.config = {"use_power_sampling": True}

        # Should not raise exception
        dag = await planner.decompose_task("Build a SaaS business")

        # Should return valid DAG (from baseline fallback)
        assert len(dag) > 0
        assert dag.has_cycle() == False

    # ... 5 more HTDAG integration tests
```

**2. Metrics Recording (5 tests)**
```python
class TestMetricsRecording:
    """Test Prometheus metrics integration"""

    @pytest.mark.asyncio
    async def test_power_sampling_call_counter(self, mock_llm_client, prometheus_registry):
        """Verify call counter increments"""
        planner = HTDAGPlanner(llm_client=mock_llm_client)
        planner.config = {"use_power_sampling": True}

        await planner.decompose_task("Test request")

        # Check Prometheus counter
        from infrastructure.metrics import htdag_power_sampling_calls_total
        assert htdag_power_sampling_calls_total.labels(method="power_sampling")._value.get() == 1

    @pytest.mark.asyncio
    async def test_quality_score_gauge(self, mock_llm_client, prometheus_registry):
        """Verify quality score recorded"""
        planner = HTDAGPlanner(llm_client=mock_llm_client)
        planner.config = {"use_power_sampling": True}

        await planner.decompose_task("Test request")

        # Check Prometheus gauge
        from infrastructure.metrics import htdag_decomposition_quality_score
        quality = htdag_decomposition_quality_score.labels(method="power_sampling")._value.get()
        assert 0.0 <= quality <= 1.0

    # ... 3 more metrics tests
```

**3. Concurrent Request Handling (7 tests)**
```python
class TestConcurrentRequests:
    """Test handling of concurrent HTDAG decompositions"""

    @pytest.mark.asyncio
    async def test_concurrent_power_sampling_calls(self, mock_llm_client):
        """Verify correct handling of 10 concurrent requests"""
        import asyncio

        planner = HTDAGPlanner(llm_client=mock_llm_client)
        planner.config = {"use_power_sampling": True}

        # Run 10 concurrent decompositions
        requests = [
            planner.decompose_task(f"Build business {i}")
            for i in range(10)
        ]

        results = await asyncio.gather(*requests)

        # All should succeed
        assert len(results) == 10
        assert all(len(dag) > 0 for dag in results)

    # ... 6 more concurrency tests
```

---

## 📊 BENCHMARK TESTS (50 scenarios)

### File: `tests/test_htdag_power_sampling_benchmark.py`

**Owner:** Alex (Integration Testing), Cora (Design)
**Coverage Target:** N/A (end-to-end validation)
**Test Count:** 50 scenarios + 1 aggregation test

#### Test Structure

```python
import pytest
import json
from pathlib import Path
from scipy import stats
from infrastructure.htdag_planner import HTDAGPlanner
from infrastructure.htdag_quality_metrics import evaluate_decomposition_quality

class TestPowerSamplingBenchmark:
    """A/B test: Power Sampling vs Baseline quality comparison"""

    @pytest.fixture(scope="class")
    def benchmark_scenarios(self):
        """Load 50 benchmark scenarios from JSON"""
        benchmark_file = Path(__file__).parent / "benchmarks" / "htdag_power_sampling_benchmark.json"
        with open(benchmark_file) as f:
            data = json.load(f)
        return data["scenarios"]

    @pytest.mark.asyncio
    @pytest.mark.slow  # Mark as slow test (runs all 50 scenarios)
    async def test_all_benchmark_scenarios(self, benchmark_scenarios, llm_client):
        """Run all 50 scenarios and collect quality scores"""
        planner = HTDAGPlanner(llm_client=llm_client)

        power_sampling_scores = []
        baseline_scores = []

        for scenario in benchmark_scenarios:
            # Set feature flag based on scenario method
            use_power_sampling = scenario["method"] == "power_sampling"
            planner.config = {"use_power_sampling": use_power_sampling}

            # Decompose task
            dag = await planner.decompose_task(
                user_request=scenario["user_request"],
                context=scenario.get("context", {})
            )

            # Evaluate quality
            tasks = list(dag.tasks.values())
            quality = evaluate_decomposition_quality(tasks)

            # Record score
            if use_power_sampling:
                power_sampling_scores.append(quality)
            else:
                baseline_scores.append(quality)

        # Aggregate results
        power_sampling_avg = sum(power_sampling_scores) / len(power_sampling_scores)
        baseline_avg = sum(baseline_scores) / len(baseline_scores)
        quality_delta = (power_sampling_avg - baseline_avg) / baseline_avg * 100

        # Statistical significance test
        t_stat, p_value = stats.ttest_ind(power_sampling_scores, baseline_scores)

        # Assertions
        assert quality_delta >= 15.0, f"Quality improvement below +15% target: {quality_delta:.1f}%"
        assert p_value < 0.05, f"Result not statistically significant: p={p_value:.4f}"

        # Print summary report
        print("\n" + "="*80)
        print("POWER SAMPLING BENCHMARK RESULTS")
        print("="*80)
        print(f"Power Sampling Avg Quality: {power_sampling_avg:.3f}")
        print(f"Baseline Avg Quality:       {baseline_avg:.3f}")
        print(f"Quality Delta:              +{quality_delta:.1f}%")
        print(f"Statistical Significance:   p={p_value:.4f} ({'PASS' if p_value < 0.05 else 'FAIL'})")
        print(f"Total Scenarios:            {len(benchmark_scenarios)}")
        print(f"Power Sampling Scenarios:   {len(power_sampling_scores)}")
        print(f"Baseline Scenarios:         {len(baseline_scores)}")
        print("="*80 + "\n")

    @pytest.mark.asyncio
    @pytest.mark.parametrize("scenario_id", [
        "business_001", "business_003", "business_005",  # High-priority business
        "technical_001", "technical_003", "technical_005",  # High-priority technical
        "complex_001", "complex_003", "complex_005"  # Complex multi-phase
    ])
    async def test_individual_high_priority_scenarios(self, scenario_id, benchmark_scenarios, llm_client):
        """Test critical scenarios individually for detailed analysis"""
        scenario = next(s for s in benchmark_scenarios if s["id"] == scenario_id)

        planner = HTDAGPlanner(llm_client=llm_client)
        planner.config = {"use_power_sampling": scenario["method"] == "power_sampling"}

        dag = await planner.decompose_task(
            user_request=scenario["user_request"],
            context=scenario.get("context", {})
        )

        # Quality evaluation
        tasks = list(dag.tasks.values())
        quality = evaluate_decomposition_quality(tasks)

        # Expected quality threshold (based on complexity)
        if scenario["complexity"] == "very_high":
            min_quality = 0.70
        elif scenario["complexity"] == "high":
            min_quality = 0.75
        else:
            min_quality = 0.80

        assert quality >= min_quality, f"Quality {quality:.3f} below threshold {min_quality} for {scenario_id}"
```

---

## 🚀 E2E TESTS (10 tests)

### File: `tests/test_htdag_power_sampling_e2e.py`

**Owner:** Forge (E2E Testing Specialist)
**Coverage Target:** Production readiness validation
**Test Count:** 10 tests

#### Test Categories

**1. Full Orchestration Flow (4 tests)**
```python
import pytest
from infrastructure.htdag_planner import HTDAGPlanner
from infrastructure.halo_router import HALORouter
from infrastructure.aop_validator import AOPValidator

class TestE2EOr chestration:
    """Test full HTDAG → HALO → AOP flow with Power Sampling"""

    @pytest.mark.asyncio
    async def test_full_orchestration_with_power_sampling(self, llm_client, agent_registry):
        """End-to-end: User request → HTDAG decomposition (Power Sampling) → HALO routing → AOP validation"""
        # Step 1: HTDAG decomposition with Power Sampling
        planner = HTDAGPlanner(llm_client=llm_client)
        planner.config = {"use_power_sampling": True}

        dag = await planner.decompose_task(
            user_request="Build a SaaS invoicing platform with Stripe integration",
            context={"timeline": "3 months"}
        )

        # Verify DAG created
        assert len(dag) >= 5
        assert dag.has_cycle() == False

        # Step 2: HALO routing
        router = HALORouter(agent_registry=agent_registry)
        routing_plan = await router.route_tasks(dag)

        # Verify all tasks assigned
        assert len(routing_plan) == len(dag)

        # Step 3: AOP validation
        validator = AOPValidator()
        validation_result = validator.validate_plan(dag, routing_plan)

        # Verify plan is valid
        assert validation_result["solvable"] == True
        assert validation_result["complete"] == True
        assert validation_result["non_redundant"] == True

    # ... 3 more full orchestration tests
```

**2. Production Load Simulation (3 tests)**
```python
class TestProductionLoad:
    """Test under production-like load"""

    @pytest.mark.asyncio
    @pytest.mark.slow
    async def test_100_concurrent_requests_with_power_sampling(self, llm_client):
        """Simulate 100 concurrent user requests"""
        import asyncio
        import time

        planner = HTDAGPlanner(llm_client=llm_client)
        planner.config = {"use_power_sampling": True}

        # Generate 100 diverse requests
        requests = [
            planner.decompose_task(f"User request {i}: Build SaaS business")
            for i in range(100)
        ]

        # Run concurrently and measure latency
        start = time.time()
        results = await asyncio.gather(*requests, return_exceptions=True)
        elapsed = time.time() - start

        # Verify all succeeded
        failures = [r for r in results if isinstance(r, Exception)]
        success_rate = (100 - len(failures)) / 100 * 100

        assert success_rate >= 95, f"Success rate {success_rate}% below 95% SLO"
        assert elapsed < 60, f"Total time {elapsed:.1f}s exceeded 60s budget"

    # ... 2 more load tests
```

**3. Monitoring Dashboard Validation (3 tests)**
```python
class TestMonitoringDashboard:
    """Test Grafana dashboard displays correct data"""

    @pytest.mark.asyncio
    async def test_grafana_panels_display_data(self, llm_client, grafana_api):
        """Verify all 9 Grafana panels show data after Power Sampling calls"""
        planner = HTDAGPlanner(llm_client=llm_client)
        planner.config = {"use_power_sampling": True}

        # Make 10 decomposition calls
        for i in range(10):
            await planner.decompose_task(f"Test request {i}")

        # Wait for Prometheus scrape (30s interval)
        import asyncio
        await asyncio.sleep(35)

        # Query Grafana API for dashboard data
        dashboard_uid = "htdag-power-sampling"
        panels = await grafana_api.get_dashboard_panels(dashboard_uid)

        # Verify all 9 panels have data
        assert len(panels) == 9
        for panel in panels:
            assert panel["has_data"] == True, f"Panel {panel['title']} has no data"

    # ... 2 more dashboard tests
```

---

## 🔧 TEST EXECUTION

### Running Tests Locally

```bash
# 1. Install test dependencies
pip install -r requirements-test.txt

# 2. Run unit tests only (fast, ~2 minutes)
pytest tests/test_power_sampling.py tests/test_htdag_quality_metrics.py -v

# 3. Run integration tests (medium, ~5 minutes)
pytest tests/test_htdag_power_sampling_integration.py -v

# 4. Run benchmark tests (slow, ~30 minutes)
pytest tests/test_htdag_power_sampling_benchmark.py -v --tb=short

# 5. Run E2E tests (very slow, ~45 minutes)
pytest tests/test_htdag_power_sampling_e2e.py -v -m slow

# 6. Run all Power Sampling tests (full suite, ~90 minutes)
pytest tests/test_*power_sampling*.py tests/test_htdag_quality_metrics.py -v

# 7. Generate coverage report
pytest --cov=infrastructure/power_sampling --cov=infrastructure/htdag_quality_metrics --cov-report=html

# 8. Run specific test by name
pytest tests/test_power_sampling.py::TestMCMCIterations::test_mcmc_completes_all_iterations -v
```

### CI/CD Integration (GitHub Actions)

**File:** `.github/workflows/test_power_sampling.yml`

```yaml
name: Power Sampling Test Suite

on:
  pull_request:
    paths:
      - 'infrastructure/power_sampling.py'
      - 'infrastructure/htdag_quality_metrics.py'
      - 'infrastructure/htdag_planner.py'
      - 'tests/test_*power_sampling*.py'
      - 'tests/test_htdag_quality_metrics.py'

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    timeout-minutes: 10
    steps:
      - uses: actions/checkout@v3
      - name: Set up Python 3.12
        uses: actions/setup-python@v4
        with:
          python-version: '3.12'
      - name: Install dependencies
        run: |
          pip install -r requirements.txt
          pip install -r requirements-test.txt
      - name: Run unit tests
        run: pytest tests/test_power_sampling.py tests/test_htdag_quality_metrics.py -v --tb=short
      - name: Check coverage
        run: pytest tests/test_power_sampling.py tests/test_htdag_quality_metrics.py --cov=infrastructure --cov-report=term --cov-fail-under=90

  integration-tests:
    runs-on: ubuntu-latest
    timeout-minutes: 15
    needs: unit-tests
    steps:
      - uses: actions/checkout@v3
      - name: Set up Python 3.12
        uses: actions/setup-python@v4
        with:
          python-version: '3.12'
      - name: Install dependencies
        run: |
          pip install -r requirements.txt
          pip install -r requirements-test.txt
      - name: Run integration tests
        run: pytest tests/test_htdag_power_sampling_integration.py -v --tb=short

  benchmark-tests:
    runs-on: ubuntu-latest
    timeout-minutes: 45
    needs: integration-tests
    if: github.event.pull_request.labels.contains('benchmark')
    steps:
      - uses: actions/checkout@v3
      - name: Set up Python 3.12
        uses: actions/setup-python@v4
        with:
          python-version: '3.12'
      - name: Install dependencies
        run: |
          pip install -r requirements.txt
          pip install -r requirements-test.txt
      - name: Run benchmark tests
        run: pytest tests/test_htdag_power_sampling_benchmark.py -v --tb=short
      - name: Upload benchmark results
        uses: actions/upload-artifact@v3
        with:
          name: benchmark-results
          path: test-results/benchmark_*.json

  e2e-tests:
    runs-on: ubuntu-latest
    timeout-minutes: 60
    needs: benchmark-tests
    if: github.event.pull_request.labels.contains('e2e')
    steps:
      - uses: actions/checkout@v3
      - name: Set up Python 3.12
        uses: actions/setup-python@v4
        with:
          python-version: '3.12'
      - name: Install dependencies
        run: |
          pip install -r requirements.txt
          pip install -r requirements-test.txt
      - name: Run E2E tests
        run: pytest tests/test_htdag_power_sampling_e2e.py -v -m slow
```

---

## 📋 TEST CHECKLIST (Day 2 - Thon)

### Pre-Implementation Checklist
- [ ] Read `POWER_SAMPLING_HTDAG_INTEGRATION.md` specification
- [ ] Review `htdag_power_sampling_benchmark.json` scenarios
- [ ] Understand quality metrics framework (`htdag_quality_metrics.py`)
- [ ] Set up test environment (pytest, mocks, fixtures)

### Implementation Checklist (Unit Tests)
- [ ] Implement `test_power_sampling.py` (50+ tests)
  - [ ] MCMC iteration logic (15 tests)
  - [ ] Block resampling (12 tests)
  - [ ] Quality evaluator integration (8 tests)
  - [ ] Error handling (10 tests)
  - [ ] Performance tests (5 tests)
- [ ] Implement `test_htdag_quality_metrics.py` (40+ tests)
  - [ ] Completeness scoring (10 tests)
  - [ ] Coherence detection (12 tests)
  - [ ] Feasibility validation (10 tests)
  - [ ] Diversity measurement (8 tests)
- [ ] Achieve 95%+ coverage on `power_sampling.py`
- [ ] Achieve 100% coverage on `htdag_quality_metrics.py`

### Integration Checklist (Alex)
- [ ] Implement `test_htdag_power_sampling_integration.py` (20 tests)
  - [ ] HTDAG integration (8 tests)
  - [ ] Metrics recording (5 tests)
  - [ ] Concurrent request handling (7 tests)
- [ ] Implement `test_htdag_power_sampling_benchmark.py` (50 scenarios + aggregation)
- [ ] Validate all existing HTDAG tests pass (zero regressions)
- [ ] Run full test suite in CI/CD

### E2E Checklist (Forge)
- [ ] Implement `test_htdag_power_sampling_e2e.py` (10 tests)
  - [ ] Full orchestration flow (4 tests)
  - [ ] Production load simulation (3 tests)
  - [ ] Monitoring dashboard validation (3 tests)
- [ ] Run under production-like load (100+ concurrent requests)
- [ ] Validate Grafana dashboard shows correct metrics
- [ ] Take screenshots of dashboard panels (visual validation)

### Code Review Checklist (Hudson)
- [ ] Review all test code for security issues
- [ ] Verify no sensitive data in test fixtures
- [ ] Check error handling completeness
- [ ] Validate mock LLM clients don't expose real API keys
- [ ] Approve code quality (8.5/10+ required)

### Final Validation Checklist (All)
- [ ] All 120+ tests passing (100% pass rate)
- [ ] 90%+ code coverage on new code
- [ ] Zero P0 bugs, <3 P1 bugs
- [ ] Benchmark validates +15-25% quality improvement (p<0.05)
- [ ] Performance within SLOs (P95 latency <5s, cost <15x)
- [ ] Grafana dashboard operational
- [ ] Documentation complete

---

## 🎯 SUCCESS CRITERIA SUMMARY

| Criteria | Target | Measurement | Owner |
|----------|--------|-------------|-------|
| **Quality Improvement** | +15-25% | Benchmark A/B test (p<0.05) | Alex |
| **Test Coverage** | 90%+ | pytest-cov report | Thon |
| **Pass Rate** | 100% | All 120+ tests passing | All |
| **Zero Regressions** | 0 failures | Existing HTDAG tests | Alex |
| **Performance** | P95 <5s | E2E latency tests | Forge |
| **Cost** | <15x baseline | Token usage tracking | Forge |
| **Code Quality** | 8.5/10+ | Hudson review score | Hudson |
| **Integration** | 9/10+ | Alex approval | Alex |
| **E2E** | 9.5/10+ | Forge approval | Forge |

---

**END OF TESTING GUIDE**

**Next Steps:**
1. Thon implements unit tests during Day 2 implementation
2. Alex runs integration + benchmark tests after Thon completion
3. Forge runs E2E tests after integration validation
4. Hudson reviews all test code for security and quality
5. All approvals required before PR merge to main

**Total Estimated Testing Effort:** ~12 hours (4 hours unit tests + 4 hours integration + 4 hours E2E)
**Total Test Count:** 120+ tests
**Expected Coverage:** 90%+ on new code, 100% on quality metrics
