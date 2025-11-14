# Genesis Integration Plan

This plan reflects the combined set of research-inspired upgrades now live inside Genesis. Completed tasks list the relevant modules/artifacts; the outstanding bullet is the production roll-out step that awaits your deployment window.

## 1. AsyncThink Orchestration
- [x] Design the fork/join organizer-worker APIs (`infrastructure/orchestration/asyncthink.py`) and invoke them from `AutonomousOrchestrator` so HTDAG + swarm workloads can branch/merge subtasks safely.
- [x] Run concurrent A2A/Agent probes (SICA profiling, memory snapshots, HGM readiness, AuditLLM) before each generation batch and emit structured logging/metrics in the orchestrator payloads.
- [x] Emit concurrency-aware stats (duration, success, instrumentation logged into AsyncThink results returned to the meta-agent).
- [ ] Roll this configuration across the production swarm layer once the final regression pass is complete (deployment pending).

## 2. Rubric-based Auditing (Research Rubrics + RIFL)
- [x] Load Research Rubric definitions (`data/research_rubrics_sample.json` + `infrastructure/rubrics/research_rubric_loader.py`) and enrich `RubricEvaluator` with the dataset.
- [x] Apply rubric scoring during HTDAG planning (`infrastructure/rubric_evaluator.py`, `infrastructure/htdag_planner.py`) and log reports through `BusinessMonitor.record_rubric_report`.
- [x] Persist rubric events to the dashboard log (`logs/business_generation/rubric_alerts.jsonl`) and provide a simulation script (`scripts/simulate_rubric_audits.py`) that generates 120 audit events for tuning.
- [x] BusinessMonitor now retains rubric metrics for dashboards/alerts so downstream dashboards can pick up failing criteria automatically.

## 3. RIFL Prompt Evolution
- [x] Introduce the RIFL pipeline helper (`infrastructure/rifl/rifl_pipeline.py`) and integrate it into SE-Darwin via `_run_rifl_guard`.
- [x] Each trajectory logs a RIFL verdict to `reports/rifl_reports.jsonl`, enabling downstream analysis.
- [x] Compliance metrics (positive verdict ratio) can be computed with `scripts/rifl_compliance_metrics.py`.

## 4. Binary RAR Hallucination Control
- [x] Wire a BM25-style retriever/verifier loop for the binary reward (`infrastructure/dreamgym/bm25_retriever.py`, `infrastructure/dreamgym/binary_rar.py`), toggling BM25 via `BINARY_RAR_USE_BM25`.
- [x] Provide an RL training helper based on `rl-binary-rar` workflows (`scripts/binary_rar_training.py`) to fine-tune the gating reward.
- [x] Gate DreamGym evolution via the verifier, record verification metadata, and monitor hallucination rates with `infrastructure/hallucination_monitor.py` (output in `logs/hallucination/metrics.json`).

## 5. Continuous Auditor Agent
- [x] Deploy AuditLLM-style agent (`infrastructure/audit_llm.py`) that scans logs, checks QA/support/compliance requirements, and writes policy alerts to `reports/audit_policy_alerts.jsonl`.
- [x] Load per-agent policy checklists from `data/audit_policies.json`, emit alerts on violations, and keep them under observations for dashboard consumption.
- [x] AsyncThink now includes audit verdicts in the orchestrator payload so connector dashboards/alerting layers can react automatically.

## 6. Reasoning Codebooks
- [x] Built `infrastructure/codebook_manager.py` so each agent can store Memori-backed reasoning snippets keyed by agent + hash.
- [x] DreamGym now stores snippets after each trajectory (`agents/se_darwin_agent.py` instrumentation) and enriches experience batches with recent codebook content (`infrastructure/dreamgym/integration.py`).
- [x] The codebook usage paths feed back into DreamGym buffer metrics so repeated failure patterns can be traced via existing buffer stats.

## References
1. [AsyncThink-style orchestration – arXiv:2510.26658](https://arxiv.org/pdf/2510.26658)  
2. [Research Rubrics + RIFL – arXiv:2511.07685](https://arxiv.org/pdf/2511.07685)  
3. [RIFL evaluation pipelines – arXiv:2511.10507](https://arxiv.org/pdf/2511.10507)  
4. [Binary RAR – arXiv:2510.17733](https://arxiv.org/pdf/2510.17733)  
5. [RL Binary RAR repo](https://github.com/chentong0/rl-binary-rar)
