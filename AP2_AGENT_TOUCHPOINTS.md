# AP2 Agent Touchpoints

This document captures the specific integration points per "spending" agent where AP2 metadata must be attached and emitted.

| Agent | AP2 Actions | Relevant APIs | Notes |
|-------|-------------|---------------|-------|
| Support Agent | Wrap `answer_support_query` and `escalate_ticket`; emit AP2 events for each ticket response, cost per query, budget tags from `customer_support_channel`. | `agents/support_agent.py` (`answer_support_query`, `load_customer_context`) | Attach `TokenCachedRAG` cache stats to AP2 events for latency/backpressure reporting. |
| Documentation Agent | Annotate doc retrieval/generation routines with AP2 context (document ID + budget). Emit events when drawing from static knowledge base. | `agents/documentation_agent.py` (`generate_document`, `retrieve_section`) | Include `context_metadata={"doc_id": ...}` so the billing log can trace per-doc spend. |
| Business Generation Agent | Tag business plan generation requests with budgets; wrap template retrieval + meta-agent execution events. | `agents/business_generation_agent.py` (`generate_business_stream`, `deploy_business_plan`) | Emit AP2 events after key checkpoints (spec creation, deployment). |
| QA Agent | Wrap `generate_test_suite`, `assess_bug` flows; include budget/per-attempt metrics for QA-specific billing. | `agents/qa_agent.py` (`run_tests`, `evaluate_bug`) | Attach test coverage info to AP2 metadata. |
| Code Review Agent | Wrap review loops, record per-review cost and compliance verdict. | `agents/code_review_agent.py` (`review_code`, `highlight_findings`) | Use AP2 to flag high-cost threads and escalate if budgets exceed thresholds. |
| SE-Darwin Agent | Emit AP2 events for each evolution iteration, especially when calling HGM/Judge or recording new trajectories. | `agents/se_darwin_agent.py` (`_execute_integrated`, `_archive_trajectories_async`) | Combine AP2 spend with RIFL reports and AuditLLM compliance checks for auditing. |

Each integration should:
* Use the shared `AP2Client` to wrap events (include `context={"budget": ..., "env":"prod"}`).
* Log the event to `logs/ap2/events.jsonl` and trigger alerts when spent >= 80% of the budget.
* Store relevant metadata in `BusinessMonitor.record_ap2_event` (or a new log channel) so dashboards can expose spend + compliance ratios.

