---
title: CI Eval Harness Architecture
category: Architecture
dg-publish: true
publish: true
tags: []
source: docs/CI_EVAL_HARNESS_ARCHITECTURE.md
exported: '2025-10-24T22:05:26.894776'
---

# CI Eval Harness Architecture

## Overview

Automated benchmark evaluation infrastructure for continuous validation of agent improvements. Runs comprehensive benchmark suites on every PR, detects regressions, and blocks merges if performance degrades.

**Target Impact:** <5 min full benchmark execution, 95% confidence regression detection, zero false negatives

## Core Principles

1. **Automated Execution:** Runs on every PR automatically via GitHub Actions
2. **Regression Detection:** Compares results vs. baseline (main branch)
3. **Fast Feedback:** <5 minutes for full suite (270 scenarios)
4. **Clear Reporting:** Markdown reports posted directly to PRs
5. **Merge Protection:** Blocks merge if regressions >5% threshold

## Key Components

### 1. Benchmark Registry

**Purpose:** Central registry of all benchmarks across 15 agents.

**Structure:**
```python
{
    "agent_name": {
        "scenarios": [
            {
                "id": "scenario_1",
                "description": "Test description",
                "input": {...},
                "expected_output": {...},
                "timeout_ms": 5000
            }
        ]
    }
}
```

**Integration:** Uses existing `BenchmarkScenarioLoader` from SE-Darwin

### 2. Evaluation Runner

**Purpose:** Executes benchmarks in parallel with timeout protection.

**Features:**
- Parallel execution (max 5 concurrent)
- Per-scenario timeout (default 5s)
- Error isolation (one failure doesn't stop suite)
- Progress tracking
- Resource monitoring

**Flow:**
```
Load Benchmarks → Parallel Execution → Collect Results → Aggregate
```

### 3. Results Aggregator

**Purpose:** Collects and aggregates benchmark results.

**Metrics Tracked:**
- Task success rate (%)
- Avg execution time (ms)
- Cost per task ($)
- Quality score (0.0-1.0)
- Memory usage (MB)

**Output Format:**
```json
{
    "total_scenarios": 270,
    "passed": 260,
    "failed": 10,
    "avg_execution_time_ms": 234.5,
    "avg_quality_score": 0.87,
    "total_cost_usd": 0.45,
    "by_agent": {
        "builder_agent": {
            "passed": 17,
            "failed": 1,
            ...
        }
    }
}
```

### 4. Regression Detector

**Purpose:** Detects performance regressions vs. baseline.

**Regression Criteria:**
- Success rate drop >5%
- Execution time increase >20%
- Quality score drop >5%
- Cost increase >25%

**Comparison Logic:**
```python
regression_detected = (
    (current_score - baseline_score) / baseline_score < -threshold
)
```

**Confidence Intervals:**
- 95% confidence using t-test
- Minimum 10 samples per scenario
- Accounts for variance in LLM responses

### 5. Report Generator

**Purpose:** Generates comprehensive markdown reports.

**Report Sections:**
1. **Summary:** Overall pass/fail, key metrics
2. **Regressions:** Detailed list of any regressions
3. **Improvements:** Notable improvements
4. **Details:** Per-agent breakdowns

**Example Report:**
```markdown
## CI Evaluation Report

**Overall Results:**
- Total Scenarios: 270
- Passed: 265 (98.1%)
- Failed: 5 (1.9%)

**Performance Metrics:**
- Avg Execution Time: 234ms
- Avg Quality Score: 0.87
- Total Cost: $0.45

**Regressions Detected:** 2

### ⚠️ Regressions:
- `builder_agent/scenario_5`: Quality score regressed by 8.3%
- `deploy_agent/scenario_12`: Execution time increased by 45%

### ✅ Improvements:
- `qa_agent/scenario_3`: Quality score improved by 12%
```

## Architecture Diagram

```
GitHub PR Created/Updated
            ↓
┌───────────────────────────────┐
│   GitHub Actions CI Trigger   │
└───────────┬───────────────────┘
            ↓
┌───────────────────────────────┐
│   Load Baseline Results       │ ← From main branch artifact
└───────────┬───────────────────┘
            ↓
┌───────────────────────────────┐
│   Benchmark Registry          │
│   - 270 scenarios             │
│   - 15 agents                 │
└───────────┬───────────────────┘
            ↓
┌───────────────────────────────┐
│   Evaluation Runner           │
│   - Parallel execution (5x)   │
│   - Timeout protection        │
│   - Error isolation           │
└───────────┬───────────────────┘
            ↓
┌───────────────────────────────┐
│   Results Aggregator          │
│   - Collect metrics           │
│   - Calculate statistics      │
└───────────┬───────────────────┘
            ↓
┌───────────────────────────────┐
│   Regression Detector         │
│   - Compare vs baseline       │
│   - 95% confidence intervals  │
│   - Threshold checks          │
└───────────┬───────────────────┘
            ↓
┌───────────────────────────────┐
│   Report Generator            │
│   - Markdown formatting       │
│   - Per-agent breakdowns      │
└───────────┬───────────────────┘
            ↓
┌───────────────────────────────┐
│   Post Report to PR           │
│   - GitHub Actions bot        │
│   - Comment on PR             │
└───────────┬───────────────────┘
            ↓
      Pass/Fail Gate
            ↓
    ┌───────┴────────┐
    ↓                ↓
  PASS             FAIL
(Allow merge)   (Block merge)
```

## Integration Points

### GitHub Actions

**Workflow Triggers:**
- `pull_request` (on every PR)
- `workflow_dispatch` (manual trigger)
- `schedule` (nightly on main)

**Artifacts:**
- Baseline results (from main branch)
- Current PR results (for comparison)
- Full evaluation reports (for history)

### Benchmark Scenario Loader

**Integration:**
```python
from infrastructure.benchmark_scenario_loader import BenchmarkScenarioLoader

loader = BenchmarkScenarioLoader()
benchmarks = loader.load_all_benchmarks(agent_names=None)  # All 15 agents
```

**Existing Integration:**
- 270 scenarios already defined
- JSON format validated
- Ready for CI execution

### Observability (OTEL)

**Metrics Tracked:**
- `ci_eval.total_time_seconds`: Full suite execution time
- `ci_eval.scenarios_run`: Number of scenarios executed
- `ci_eval.pass_rate`: Overall pass rate
- `ci_eval.regressions_detected`: Number of regressions

**Tracing:**
- Distributed tracing for each scenario execution
- Correlation IDs for debugging failures

## Performance Targets

### Execution Speed
- **<5 minutes:** Full suite (270 scenarios) execution
- **<1 second:** Per-scenario average execution time
- **<10 seconds:** Report generation + posting

### Accuracy
- **95% confidence:** Regression detection (no false positives)
- **100% recall:** Catch all real regressions (no false negatives)
- **±2%:** Variance tolerance for success rates

### Reliability
- **99% uptime:** CI workflow availability
- **<1% failure rate:** Due to infrastructure issues
- **100% isolation:** One failing scenario doesn't affect others

## Regression Detection Algorithm

### Statistical Approach

```python
def detect_regression(
    baseline_results: List[float],
    current_results: List[float],
    threshold: float = 0.05  # 5%
) -> bool:
    """
    Detect regression using t-test with 95% confidence.

    Returns:
        True if significant regression detected
    """
    from scipy import stats

    # Calculate means
    baseline_mean = np.mean(baseline_results)
    current_mean = np.mean(current_results)

    # Calculate relative change
    relative_change = (current_mean - baseline_mean) / baseline_mean

    # If below threshold, check statistical significance
    if relative_change < -threshold:
        # Two-sample t-test
        t_stat, p_value = stats.ttest_ind(baseline_results, current_results)

        # Significant if p < 0.05 (95% confidence)
        return p_value < 0.05

    return False
```

### Threshold Configuration

```yaml
regression_thresholds:
  success_rate: 0.05      # 5% drop
  execution_time: 0.20    # 20% increase
  quality_score: 0.05     # 5% drop
  cost: 0.25              # 25% increase
  memory: 0.30            # 30% increase
```

## CI Workflow Configuration

### GitHub Actions YAML

```yaml
name: CI Evaluation Harness

on:
  pull_request:
    branches: [main]
  workflow_dispatch:
  schedule:
    - cron: '0 0 * * *'  # Nightly

jobs:
  evaluate:
    runs-on: ubuntu-latest
    timeout-minutes: 10

    steps:
      - uses: actions/checkout@v4

      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.12'

      - name: Install dependencies
        run: pip install -r requirements.txt

      - name: Download baseline results
        uses: actions/download-artifact@v4
        with:
          name: baseline-results
          path: baseline/
        continue-on-error: true

      - name: Run Evaluation Harness
        run: python scripts/run_eval_harness.py --output results.json

      - name: Generate Report
        run: python scripts/generate_eval_report.py results.json baseline/results.json > report.md

      - name: Post Report to PR
        uses: actions/github-script@v7
        with:
          script: |
            const fs = require('fs');
            const report = fs.readFileSync('report.md', 'utf8');

            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: report
            });

      - name: Check for Regressions
        run: python scripts/check_regressions.py results.json --fail-on-regression

      - name: Upload results as artifact
        uses: actions/upload-artifact@v4
        with:
          name: eval-results
          path: results.json
```

## Error Handling

### Scenario Execution Failures

**Strategies:**
1. **Timeout Protection:** Kill scenarios after max timeout
2. **Error Isolation:** Continue suite even if one scenario fails
3. **Detailed Logging:** Capture stack traces for debugging
4. **Retry Logic:** Retry failed scenarios once (LLM variance)

### Infrastructure Failures

**Strategies:**
1. **Graceful Degradation:** Return partial results if possible
2. **Clear Error Messages:** Explain what failed and why
3. **Auto-retry:** Retry CI workflow once on infrastructure failure
4. **Alerts:** Notify team if CI is consistently failing

## Optimization Strategies

### Parallel Execution

```python
async def run_benchmarks_parallel(
    benchmarks: List[Benchmark],
    max_concurrent: int = 5
) -> List[Result]:
    """
    Run benchmarks in parallel with concurrency limit.

    Target: 5X speedup over sequential execution
    """
    semaphore = asyncio.Semaphore(max_concurrent)

    async def run_with_semaphore(benchmark):
        async with semaphore:
            return await execute_benchmark(benchmark)

    tasks = [run_with_semaphore(b) for b in benchmarks]
    return await asyncio.gather(*tasks)
```

### Caching

**What to Cache:**
- Benchmark definitions (static)
- Baseline results (per commit)
- LLM responses (deterministic scenarios)

**Cache Invalidation:**
- Benchmark definitions: On file changes
- Baseline results: On main branch updates
- LLM responses: Never (variance is expected)

### Early Termination

**Criteria for Early Exit:**
- Critical regression detected (>10% drop)
- >50% scenarios failing
- Infrastructure errors (can't continue)

**Benefits:**
- Faster feedback (don't wait 5min for obvious failures)
- Cost savings (don't run full suite if broken)

## Future Enhancements

### Phase 1 (Current)
- ✅ Basic benchmark execution
- ✅ Regression detection
- ✅ Markdown reporting
- ✅ GitHub Actions integration

### Phase 2 (Q4 2025)
- 🔲 Historical trend analysis
- 🔲 Performance dashboards (Grafana)
- 🔲 Flaky test detection
- 🔲 Per-agent regression reports

### Phase 3 (Q1 2026)
- 🔲 Adaptive threshold tuning
- 🔲 Machine learning-based anomaly detection
- 🔲 Automatic root cause analysis
- 🔲 Benchmark auto-generation

## Metrics Dashboard

Production deployment should track:

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| Suite Execution Time | ≤5 min | TBD | 🟡 Pending |
| Pass Rate | ≥98% | TBD | 🟡 Pending |
| Regression Detection Accuracy | ≥95% | TBD | 🟡 Pending |
| False Positive Rate | ≤5% | TBD | 🟡 Pending |
| CI Uptime | ≥99% | TBD | 🟡 Pending |

## References

1. **Benchmark Infrastructure:** SE-Darwin (`BenchmarkScenarioLoader`)
2. **GitHub Actions:** https://docs.github.com/en/actions
3. **Statistical Testing:** scipy.stats.ttest_ind
4. **OTEL Metrics:** OpenTelemetry Python SDK

---

**Status:** Architecture defined, ready for implementation
**Owner:** Nova (Agent specialist)
**Phase:** Phase 6 Day 7
**Date:** October 24, 2025
