# WaltzRL Architecture Overview

The WaltzRL deployment inside Genesis follows the collaborative safety design
presented in *The Alignment Waltz* paper.  Two cooperating agents deliver
nuanced moderation:

1. **Conversation Agent (`WaltzRLConversationAgent`)**
   - Drafts responses with self-assessed risk scores.
   - Provides rule-based revisions when the feedback agent identifies issues.
   - Supports self-correction through the generic QA loop.

2. **Feedback Agent (`WaltzRLFeedbackAgent`)**
   - Analyses request / response pairs and surfaces structured `FeedbackResult`
     objects describing safety issues, severity, and suggested mitigations.
   - Computes explainable metadata that feeds into audit reporting.

These agents are orchestrated by the **WaltzRL safety wrapper**, which feeds
responses through the feedback agent and optionally applies the conversation
agent's improvements.  The wrapper also captures metrics suitable for OTEL
instrumentation (analysis time, change list, block status).

## Integration Points

- **HALO Router:** `route_with_safety` registers WaltzRL as an execution guard.
  Callers provide an `execute` coroutine in the context, ensuring that WaltzRL
  can be adopted incrementally without modifying task execution code.

- **SE-Darwin Evolution:** `SafetyBenchmark` validates trajectories before they
  are stored in the trajectory pool.  Unsafe trajectories are skipped (or can be
  used to trigger circuit breakers if block-on-failure is enabled).

- **Compliance Layer:** All memory writes are scanned for PII.  The WaltzRL
  metadata is persisted alongside responses, creating a complete audit trail.

## Configuration

Environment variables control rollout:

| Variable | Purpose |
| -------- | ------- |
| `ENABLE_WALTZRL` | Master switch for HALO integration |
| `ENABLE_WALTZRL_SAFETY_BENCHMARKS` | Enable SE-Darwin safety regression checks |
| `WALTZRL_SAFETY_THRESHOLD` | Minimum acceptable safety score |
| `WALTZRL_BLOCK_ON_FAILURE` | Reject trajectories failing the benchmark |

## Extensibility

- Plug in Stage 2 (LLM-based) models by placing fine-tuned weights under
  `models/waltzrl_stage2/` and flipping `WALTZRL_STAGE=2`.
- Extend `SafetyBenchmark._load_safety_test_cases` with domain-specific
  scenarios.  Each case automatically contributes to per-category compliance
  metrics.
- Integrate additional telemetry sinks by consuming the `WrappedResponse`
  dictionary emitted by the safety wrapper.
