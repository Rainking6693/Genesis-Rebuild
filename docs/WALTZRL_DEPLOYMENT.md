# WaltzRL Deployment Checklist

This document summarises the steps required to enable WaltzRL safely across
Genesis environments.

## 1. Prerequisites

- Ensure `.env` contains the WaltzRL configuration block (master enable,
  thresholds, model identifiers).
- Verify that the compliance layer is enabled (see `MemoryComplianceLayer`) so
  that safety metadata is persisted and auditable.
- Deploy WaltzRL Stage 1 models (pattern-based heuristics) – these ship with the
  repository.  Stage 2 fine-tuned weights can be dropped into
  `models/waltzrl_stage2/` when available.

## 2. Application Rollout

1. **HALO Router:** call `route_with_safety` instead of invoking the executor
   directly.  The method accepts the legacy executor via the `context` dict,
   keeping the integration non-invasive.
2. **SE-Darwin:** set `ENABLE_WALTZRL_SAFETY_BENCHMARKS=true` in environments
   where trajectory validation should guard against regressions.  Monitor logs
   for warnings when safety thresholds are not met.
3. **CI Pipelines:** add `PYTEST_DISABLE_PLUGIN_AUTOLOAD=1 ./venv/bin/pytest
   tests/safety` to smoke-test WaltzRL behaviour alongside the compliance suite.

## 3. Observability

- The safety wrapper returns a dictionary via the `WrappedResponse.to_dict`
  helper.  Forward this payload to your logging/metrics stack to track trends in
  harmful-content detections, revision rates, and overall latency.
- `SafetyBenchmark` stores the last evaluation result; polling this object makes
  it easy to export scores to dashboards.

## 4. Incident Response

- If the safety wrapper experiences repeated failures, it will trip a circuit
  breaker and bypass itself.  Monitor logs for warnings about the circuit
  breaker state and consider enabling `WALTZRL_BLOCK_ON_FAILURE=true` in
  high-assurance environments.
- Unsafe trajectories resurfacing in production should trigger a review of new
  benchmarks and potential adjustments to the threshold.

## 5. Future Enhancements

- Swap the default thresholds once empirical data is collected from Stage 2 LLM
  models.
- Integrate the WaltzRL audit data with the compliance reporting pipeline to
  maintain traceability across releases.
