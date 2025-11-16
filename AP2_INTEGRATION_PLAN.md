# AP2 Protocol Integration Plan

This plan focuses on the agents driving revenue ("spending" agents) and aligns them with the AP2 organizer/communication protocol so each can carry cost, compliance, and budget context through their multi-step workflows.

## 1. Discovery & Scope (Day 1)
- [x] Enumerate the target spending agents (Support, Business Generation, Documentation, QA, Code Review, SE-Darwin).  
- [x] Document AP2 touchpoints per agent (billing interactions, paid tool calls, dashboards) via `AP2_AGENT_TOUCHPOINTS.md`.  
- [x] Capture the API/entrypoint surface that AP2 will wrap (tool calls, logging hooks); details mirror the touchpoints table.

## 2. AP2 Core Library
- [x] Create `infrastructure/ap2_protocol.py` with request/response schema, pricing metadata, and event helpers.  
- [x] Build a reusable AP2 client for agents to attach budgets/costs and emit tagged traces.  
- [x] Add config/env wiring (budget thresholds, Sevalla alert hooks).

## 3. Agent Integrations
Implement AP2 within each spending agent:
- [x] **Support Agent** (`agents/support_agent.py`): Wrap dialogue streams, report ticket spend, send AP2 events for billing dashboards.  
- [x] **Business Generation Agent** (`agents/business_generation_agent.py`): Tag business specs with budgets, emit completion + AP2 trace events.  
- [x] **Documentation Agent** (`agents/documentation_agent.py`): Attach AP2 metadata to RAG outputs so the billing engine can trace documentation costs.  
- [x] **QA Agent** (`agents/qa_agent.py`): Annotate test runs with AP2 budgets, emit compliance markers.  
- [x] **Code Review Agent** (`agents/code_review_agent.py`): Stream AP2 context during code evaluations for auditing.  
- [x] **SE-Darwin Agent** (`agents/se_darwin_agent.py`): Log per-iteration spend/RIFL verdicts with AP2 metadata; include AP2 event emission after each evolution batch.
- [x] Ensure AP2 data flows into `logs/ap2/` and exposes `BusinessMonitor.record_ap2_event`.
- [x] Emit alerts (via Sevalla/monitor) when budgets approach thresholds.

## 4. Testing & Verification
- [x] Add `tests/test_ap2_protocol.py` (unit tests for schema/client).  
- [x] Extend the existing lightning tests to assert AP2 metadata/logging per agent integration.  
- [x] Simulate a high-cost run to trigger budget alerts and validate fallback behavior (see `scripts/ap2_simulation.py`).

## 5. Monitoring & Audit
- [x] Extend `BusinessMonitor` to ingest AP2 events, update dashboards, and export `logs/ap2/ap2_metrics.json`.  
- [x] Feed AP2 keywords/events into AuditLLM (e.g., `AP2 budget`, `AP2 policy`) so violations raise alerts.  
- [x] Export `reports/ap2_compliance.jsonl` summarizing budget usage, alerts, and agent-level spend per hour.

## References
- Align schema with the new `BusinessMonitor.record_ap2_event` hook and existing `logs` structure.  
- Reuse the AsyncThink/AuditLLM reporting stack for dashboards/alerts.  
