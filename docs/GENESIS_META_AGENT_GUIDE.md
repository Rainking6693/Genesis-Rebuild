# Genesis Meta-Agent Guide

**Version:** 2.0  
**Last Updated:** November 3, 2025  
**Maintainer:** Codex (Genesis Engineering)

---

## 1. Introduction

The Genesis Meta-Agent is the Layer 1 orchestrator that autonomously creates, launches, and iterates on AI-built businesses. It coordinates seven specialised subsystems:

1. **HTDAG Planner** – hierarchical task decomposition.
2. **HALO Router** – agent routing with difficulty-aware cost optimisation.
3. **Inclusive Fitness Swarm** – capability-based team composition.
4. **WaltzRL Safety** – collaborative safety gating and policy enforcement.
5. **LangGraph Memory** – long-term knowledge retention across namespaces.
6. **A2A Connector** – asynchronous agent-to-agent protocol.
7. **SE-Darwin Bridge** – evolutionary improvement for failing trajectories.

This guide explains the architecture, operational flow, business templates, monitoring hooks, and troubleshooting strategies required to operate the Meta-Agent in production.

---

## 2. System Architecture Overview

### 2.1 Layered View

| Layer | Component | Responsibility | Primary Inputs | Primary Outputs |
|-------|-----------|----------------|----------------|-----------------|
| L0    | Genesis CLI / API | User requests, automation triggers | Business intent payload | Orchestration command |
| L1    | Genesis Meta-Agent | Autonomous orchestration | Business intent, historical context | Team & plan artefacts |
| L2    | SE-Darwin | Evolutionary improvement | Failed plans, metrics | Improved blueprints |
| L3    | A2A Bus | Agent communication fabric | Task messages | Execution results |
| L4    | WaltzRL Safety | Policy enforcement | Task prompt, agent assignment | Allow/block decision |
| L5    | Inclusive Fitness Swarm | Team composition | Capabilities catalogue | Team roster |
| L6    | LangGraph Store | Memory persistence | Outcomes, lessons | Retrieval context |

### 2.2 Orchestration Flow

1. **Intent Intake** – The Meta-Agent receives a business request containing a type (`saas_tool`, `ecommerce_store`, etc.) and optional constraints.
2. **Idea Generation** – GPT-4o generates structured requirements; memory templates are injected when available.
3. **Context Retrieval** – LangGraph memory fetches similar successful runs to seed best practices.
4. **Team Composition** – Inclusive Fitness Swarm selects agents based on required capabilities and kin-cooperation scoring.
5. **Task Decomposition** – HTDAG builds a dependency-aware task graph.
6. **Task Routing** – HALO matches tasks to agents using difficulty-aware routing (DAAO) and case bank heuristics.
7. **Safety Validation** – WaltzRL filters each task; unsafe instructions are blocked or escalated for human approval.
8. **Execution** – Tasks are executed via A2A or simulated in local mode.
9. **Revenue Projection** – A deterministic heuristic estimates revenue and payback period.
10. **Memory Update** – Success patterns are stored for future runs; failures trigger SE-Darwin experiments.

---

## 3. Business Creation Lifecycle

### 3.1 State Machine

```
INITIALIZING → GENERATING_IDEA → COMPOSING_TEAM → DECOMPOSING_TASKS
        ↓                              ↓
     FAILED ← EXECUTING ← ROUTING ← VALIDATING
        ↓
     SUCCESS
```

### 3.2 Key State Transitions

- **GENERATING_IDEA → COMPOSING_TEAM**  
  Triggered when requirements are finalised. Memory context is cached for downstream steps.

- **EXECUTING → VALIDATING**  
  Occurs after all tasks emit terminal statuses. Safety violations or critical failures revert to `FAILED`.

- **VALIDATING → SUCCESS**  
  Requires completion rate ≥ 80%, no blocked tasks, and deployment URL detection.

---

## 4. Business Type Templates

Ten archetypes are currently supported. Each archetype defines default tech stacks, monetisation models, and required agent capabilities.

| Type | Description | Default Monetisation | Signature Features | Critical Agents |
|------|-------------|----------------------|--------------------|-----------------|
| `saas_tool` | Subscription web app | Freemium, $19/mo | Auth, dashboard, billing | builder, deploy, qa, growth |
| `content_website` | SEO-focused content hub | Ad, affiliate | CMS integration, newsletter | builder, content, seo |
| `ecommerce_store` | D2C storefront | Transaction fee | Catalog, checkout, fulfilment | builder, payments, support |
| `landing_page_waitlist` | Single-page lead capture | Waitlist → upsell | Hero copy, CTA, analytics | builder, copywriter |
| `saas_dashboard` | Analytics dashboard | Seat-based | Charts, data ingests | builder, data, qa |
| `marketplace` | Two-sided platform | Commission | Listings, matchmaking, payments | builder, product, payments |
| `ai_chatbot_service` | Chat automation | Usage-based | Intent detection, fallback | builder, ml, support |
| `api_service` | Developer API | Tiered usage | API gateway, docs, keys | builder, devrel, infra |
| `newsletter_automation` | Lifecycle email automation | Subscription | Sequencing, segmentation | builder, marketing, data |
| `no_code_tool` | Workflow builder | Seat-based | Blocks, integrations | builder, integrations, ux |

Each archetype exposes:

- `typical_features`: canonical features to scaffold MVP.
- `tech_stack`: curated stack components.
- `required_agents`: minimum agent roles to cover all capabilities.
- `success_metrics`: target KPIs such as activation rate, revenue, or user acquisition.

---

## 5. Revenue Projection Heuristic

### 5.1 Why a Heuristic?

The Meta-Agent operates offline during simulation and cannot call external finance APIs. Instead, it returns a deterministic projection used by:

- Business dashboards to display expected MRR.
- Test suites to validate revenue scenarios.
- Future SE-Darwin runs to prioritise experiments.

### 5.2 Calculation Inputs

- **Feature count** – Each MVP feature adds $120 to baseline MRR.
- **Tech stack diversity** – Unique technologies add $85 each.
- **Completion rate** – Ratio of completed tasks to total tasks yields up to +$600.
- **Team size** – Slightly increases confidence (1.5% per agent).
- **Execution time** – Included in assumptions but not in base revenue.

### 5.3 Output Structure

```jsonc
{
  "projected_monthly_revenue": 1955,
  "confidence": 0.78,
  "payback_period_days": 90,
  "status": "projected",
  "assumptions": [
    "5 MVP features at launch",
    "4 core technologies",
    "Team size of 4",
    "Execution time 14.52s"
  ],
  "completion_rate": 0.92
}
```

- **projected_monthly_revenue** – Deterministic USD estimate (baseline $750).
- **confidence** – 0.55–0.95 range based on completion rate & team size.
- **payback_period_days** – Estimated days to recover a notional $5k investment.
- **status** – `projected` for success, `unavailable` for failed runs.
- **completion_rate** – Included for downstream analytics.

---

## 6. Team Composition

### 6.1 Capability Extraction

`GenesisMetaAgent._extract_required_capabilities` scans MVP features and tech stack for keywords:

- `"python"`, `"stripe"`, `"react"`, `"llm"`, `"analytics"`, `"commerce"`, etc.
- Maps keywords to agent capabilities uniquely keyed in HALO.

### 6.2 Swarm Orchestration

Inclusive Fitness Swarm:

1. Creates an initial population of candidate teams.
2. Scores teams on:
   - Capability coverage (must cover all extracted requirements).
   - Kin cooperation (previous successful collaborations).
   - Cost (penalty for overstaffing).
3. Evolves teams through selection, crossover, mutation.
4. Returns the fittest roster (≥3 agents).

### 6.3 Team Validation Checklist

- Contains at least builder, deploy, and QA roles.
- Payments capability if Stripe/commerce keywords detected.
- Support/social agent for customer-facing products.
- Growth agent for go-to-market heavy archetypes (e.g., newsletter).

---

## 7. Task Decomposition & Routing

### 7.1 HTDAG Planner

- Generates hierarchical DAG with dependencies.
- Each node includes description, expected outputs, and required capability tags.
- Supports up to 200 tasks; large DAGs are chunked with dependency grouping.

### 7.2 HALO Router

- Supports difficulty scoring (Easy, Standard, Hard, Critical).
- Applies DAAO algorithm to balance cost vs. quality.
- Provides reasoned explanations for each assignment (for observability dashboards).
- Outputs `RoutingPlan` with:
  - `assignments`: task → agent id
  - `explanations`: human-readable justification
  - `unassigned_tasks`: fallback for manual routing

---

## 8. Safety & Compliance

### 8.1 WaltzRL Integration

- `filter_unsafe_query` returns `(is_safe, safety_score, message)`.
- Autonomous mode: Blocks unsafe tasks automatically.
- Supervised mode: Escalates to `_request_human_approval`.
- Safety score contains helpfulness vs. harmfulness metrics; logged with OTEL.

### 8.2 Safety Scenarios

| Scenario | Response |
|----------|----------|
| Deploying destructive scripts | Block & log violation |
| Accessing PII without consent | Block & record policy reference |
| Requesting manual approval | Logged with reason, returns `False` by default |
| External service unavailable | Fallback to conservative path; continue with safe tasks |

---

## 9. Memory & Pattern Learning

### 9.1 Storage Workflow

On successful runs:

1. `_store_success_pattern` writes to LangGraph namespace `("business", business_type)`.
2. Stored document includes requirements, team, task summaries, deployment URL, and `success=True`.

### 9.2 Retrieval Workflow

- `_query_similar_businesses` fetches up to 3 memory entries.
- Used to seed GPT prompt with proven features and pitfalls.
- Falls back gracefully if LangGraph is unavailable (tests ensure exceptions are handled).

### 9.3 Namespaces

- `("business", business_type)` – archetype-specific learnings.
- `("consensus", "best_practices")` – canonical operations guides.
- `("agent", agent_name)` – personalised learnings per agent.

---

## 10. Execution Engine

### 10.1 Simulated Execution

`_simulate_task_execution` currently:

- Awaits `0.1s` to mimic processing.
- Returns deterministic success payload with timestamp.
- Future integration will replace this with actual A2A calls.

### 10.2 Success Criteria

`_is_successful` validates:

- Completion rate ≥ 0.8.
- No tasks with status `blocked`.
- `critical=True` failures trigger immediate failure.

### 10.3 Deployment URL Extraction

`_extract_deployment_url` scans task results for:

- `deployment_url`
- `preview_url`
- Strings containing `https://` + known hosts (Vercel, Render, Netlify).

---

## 11. Monitoring & Observability

### 11.1 Logging

- `logger.info` at each major step with business id context.
- Warnings for safety blocks, unassigned tasks, missing deployment URLs.
- Errors include stack traces for debugging.

### 11.2 Metrics

| Metric | Description | Source |
|--------|-------------|--------|
| `meta_agent.businesses.created_total` | Counter incremented per run | `create_business` |
| `meta_agent.businesses.success_rate` | Gauge (success / total) | `_is_successful` |
| `meta_agent.execution.duration_seconds` | Histogram | Execution timing |
| `meta_agent.revenue.projected_mrr` | Gauge | `_simulate_revenue_projection` |

> Prometheus instrumentation is integrated with the shared metrics collector. Enable by setting `ENABLE_MEMORY_COMPRESSION=true` and `OTEL_EXPORTER_PROMETHEUS_PORT`.

### 11.3 Tracing

- Each major method emits an OTEL span when observability is enabled.
- Trace context is propagated via `CorrelationContext`.

---

## 12. Configuration & Feature Flags

| Flag | Default | Description |
|------|---------|-------------|
| `orchestration_enabled` | `true` | Enables v2.0 orchestration flow |
| `llm_integration_enabled` | `true` | Allows GPT-4o idea generation |
| `a2a_integration_enabled` | `false` | Use real agent network instead of simulation |
| `darwin_integration_enabled` | `false` | Enables SE-Darwin evolution |
| `security_hardening_enabled` | `true` | Enforces strict safety responses |
| `performance_optimizations_enabled` | `true` | Activates DAAO routing heuristics |
| `emergency_shutdown` | `false` | Rejects new tasks immediately |
| `maintenance_mode` | `false` | Rejects tasks but allows safe completion |

Set feature flags via `infrastructure.feature_flags`.

---

### 12.1 Environment Variables

When running the full autonomous flow (deployments + payments), set the following environment variables before launching the orchestration layer:

```bash
# Enable end-to-end mode
export RUN_GENESIS_FULL_E2E=true

# Vercel REST API credentials (required for live deployments)
export VERCEL_TOKEN="qRbJRorD2kfr8A2lrs9aYA9Y"
export VERCEL_TEAM_ID="team_RWhuisUTeew8ZnTctqTZSyfF"

# Stripe (use test keys only – live keys are intentionally rejected)
export STRIPE_SECRET_KEY="sk_test_51SPUxvAiF1G2UE7CAnC4XOzrmP6NPYA7YtjITxDM5e3LQooyTElWwOSFg1FvduCRYqIKisQ22T8wAiunTk5YV7bh00lB6j2oWL"
export STRIPE_PUBLISHABLE_KEY="pk_test_51SPUxvAiF1G2UE7CwIk8nzi7HA8fZgzo8nyyNj4YDbw4qQLLhvXE1be2I2uNyGncBbRPKjY1AeB4Snj1EmpFLEMJ00azs7kDle"
```

> **Security note:** keep these variables in a secure `.env` file or secret manager in production. The Meta-Agent only enables real deployments when `RUN_GENESIS_FULL_E2E=true` _and_ the corresponding credentials are present.

When the variables are omitted, the system falls back to simulation mode (no network calls or external dependencies required).

---

## 13. Running the Test Suite

### 13.1 Prerequisites

- Python 3.12 virtual environment.
- Install dev dependencies (`pip install -r requirements_infrastructure.txt`).
- Ensure environment variables are set for optional integrations when running targeted tests.

### 13.2 Commands

```bash
# Run business creation suite (requires pytest-asyncio)
PYTEST_DISABLE_PLUGIN_AUTOLOAD=1 ./venv/bin/pytest -p pytest_asyncio.plugin tests/genesis/test_meta_agent_business_creation.py

# Run edge-case suite
PYTEST_DISABLE_PLUGIN_AUTOLOAD=1 ./venv/bin/pytest -p pytest_asyncio.plugin tests/genesis/test_meta_agent_edge_cases.py

# Run focussed revenue projection tests
PYTEST_DISABLE_PLUGIN_AUTOLOAD=1 ./venv/bin/pytest -k revenue_projection tests/genesis
```

### 13.3 Coverage Highlights

- **Business Creation Suite**  
  - Idea generation (LLM + memory).
  - Team composition heuristics.
  - Task decomposition and routing.
  - Revenue projection (`status="projected"`).
  - Success detection, deployment URL extraction.

- **Edge Case Suite**  
  - Invalid business types.
  - Agent unavailability and partial teams.
  - Deployment failure rollback.
  - Safety violations (multiple blocked tasks).
  - Memory failure resilience.
  - Concurrent business creation (async gather).
  - Resource exhaustion (100-task DAG).

---

## 14. Monitoring Guide

### 14.1 Dashboards

1. **Business Success Overview** – success rate vs. failure reason.
2. **Revenue Projection Trends** – aggregated projected MRR, confidence intervals.
3. **Safety Violations** – blocked task counts by category.
4. **Team Composition Analytics** – agent utilisation, capability coverage.
5. **Latency Heatmap** – decomposition, routing, execution durations.

### 14.2 Alerts

| Alert | Condition | Recommended Action |
|-------|-----------|--------------------|
| `META_AGENT_SUCCESS_RATE_LOW` | Success rate < 65% over 50 runs | Inspect WaltzRL blocks, rerun memory fetch |
| `META_AGENT_DEPLOYMENT_URL_MISSING` | 3+ consecutive successes without URL | Verify deployment agent and monitoring integration |
| `META_AGENT_REVENUE_PROJECTION_ZERO` | >10% projections returning 0 | Investigate execution failures or capability gaps |
| `META_AGENT_MEMORY_ERRORS` | Memory search/put exceptions > threshold | Check MongoDB connectivity or compression config |

### 14.3 Prometheus Spot Checks

After every simulation run, confirm counters moved:

```bash
# Deployment attempts/success/failure
curl "http://localhost:9090/api/v1/query?query=genesis_meta_agent_vercel_deployments_total"

# Stripe payment intents (test mode)
curl "http://localhost:9090/api/v1/query?query=genesis_meta_agent_stripe_payment_intents_total"

# Auth + quota protection
curl "http://localhost:9090/api/v1/query?query=genesis_meta_agent_auth_failures_total"
curl "http://localhost:9090/api/v1/query?query=genesis_meta_agent_quota_denied_total"

# Cost tracking by deployment type
curl "http://localhost:9090/api/v1/query?query=genesis_meta_agent_deployment_costs_total_usd"
```

Prometheus + Grafana stack lives under `monitoring/docker-compose.yml`.  
Bring it up with `docker compose up -d` and visit:
- Prometheus: http://localhost:9090  
- Grafana: http://localhost:3000 (admin / admin)

### 14.4 Dashboard & Webhook Integration

1. **Backend API**  
   ```
   export ENVIRONMENT=development
   cd genesis-dashboard/backend
   uvicorn genesis-dashboard.backend.api:app --host 0.0.0.0 --port 8080
   ```
   Test with `curl http://localhost:8080/api/health`.

2. **Webhook Target** – Set `GENESIS_DASHBOARD_URL` so the meta-agent posts lifecycle events:
   ```
   export GENESIS_DASHBOARD_URL="http://localhost:8080"
   ```
   Optional stub (until a full handler is implemented):
   ```python
   @app.post("/api/businesses/{business_id}/events")
   async def ingest_business_event(business_id: str, payload: Dict[str, Any]):
       logger.info("dashboard event %s → %s", business_id, payload.get("update_type"))
       return {"status": "ok"}
   ```

3. **Next.js UI (shadcn/ui)**  
   ```
   cd public_demo/dashboard
   npm install
   DASHBOARD_API_ORIGIN=http://localhost:8080 \
   PROMETHEUS_ORIGIN=http://localhost:9090 \
   npm run dev
   ```
   Open http://localhost:3000 to view Agent Overview, Business Overview, OTEL traces, HALO analytics, etc.  
   shadcn/ui supplies the reusable React primitives (Tabs, Cards, Tables) that style the dashboard.

---

## 15. Troubleshooting

### 15.1 Common Issues

| Symptom | Likely Cause | Resolution |
|---------|-------------|------------|
| Business creation returns `FAILED` with no error | Routing plan missing assignments | Verify HALO feature flags, ensure capability extraction matches agent catalogue |
| Safety blocking all tasks | WaltzRL returning `UNSAFE` for prompts | Review task descriptions, enable human-in-loop for high-risk tasks |
| Deployment succeeded but no URL | Execution results missing `deployment_url` | Update deploy agent to emit URL, or extend `_extract_deployment_url` patterns |
| Revenue projection `status=unavailable` for successful run | Execution completion rate < 0.8 | Investigate failed tasks; consider reducing MVP scope |
| Memory queries throwing exceptions | MongoDB unavailable or compression misconfigured | Check `MONGODB_URI`, ensure DeepSeek-OCR compression is enabled only when library available |

### 15.2 Debug Checklist

1. Enable debug logging: `export GENESIS_LOG_LEVEL=DEBUG`.
2. Re-run failing scenario with `autonomous=False` for manual oversight.
3. Inspect `task_results` within `BusinessCreationResult`.
4. For safety issues, log `safety_score.to_dict()` to confirm classification.
5. Validate feature flags via `flag_manager.get_all_flags()`.

---

## 16. Extending the Meta-Agent

### 16.1 Adding New Business Types

1. Update `infrastructure/genesis_business_types.py` with archetype data.
2. Add capability mappings for new tech stack keywords.
3. Extend tests in `test_meta_agent_business_creation.py` (parametrised list).
4. Document new template in Section 4.

### 16.2 Integrating Real Agents

1. Implement `_simulate_task_execution` replacement using A2A connector.
2. Ensure HALO returns agent IDs matching A2A endpoints.
3. Update tests to mock network calls (use `responses` or `pytest_httpserver`).

### 16.3 Custom Revenue Logic

- Replace `_simulate_revenue_projection` with ML or finance model.
- Keep tests deterministic by seeding pseudo-random functions.
- Update this guide with new fields to maintain alignment.

---

## 17. Data Contracts

### 17.1 `BusinessRequirements` (Inbound)

| Field | Type | Description |
|-------|------|-------------|
| `name` | str | Business name or codename |
| `description` | str | One-paragraph summary |
| `target_audience` | str | Intended user segment |
| `monetization` | str | Strategy (freemium, subscription, ads, etc.) |
| `mvp_features` | list[str] | Must-have features for launch |
| `tech_stack` | list[str] | Tech components required |
| `success_metrics` | dict[str, str] | KPI targets |
| `business_type` | str | Archetype identifier |
| `estimated_time` | str | Expected build time |

### 17.2 `BusinessCreationResult` (Outbound)

| Field | Type | Description |
|-------|------|-------------|
| `business_id` | str | UUID of run |
| `status` | enum | `SUCCESS`, `FAILED`, or `BLOCKED` |
| `requirements` | BusinessRequirements | Finalised requirements |
| `team_composition` | list[str] | Agents assigned |
| `task_results` | list[dict] | Per-task outcomes |
| `deployment_url` | Optional[str] | Production URL |
| `error_message` | Optional[str] | Failure reason |
| `execution_time_seconds` | float | Duration |
| `metadata` | dict | Additional context (team size, similar business count) |
| `revenue_projection` | dict | Deterministic projection |

---

## 18. API Usage Examples

### 18.1 Minimal Business Creation

```python
from infrastructure.genesis_meta_agent import GenesisMetaAgent

meta_agent = GenesisMetaAgent(autonomous=True, enable_memory=True)
result = await meta_agent.create_business("saas_tool")

if result.success:
    print("Deployment:", result.deployment_url)
    print("Projected MRR:", result.revenue_projection["projected_monthly_revenue"])
else:
    print("Failure:", result.error_message)
```

### 18.2 Custom Requirements

```python
requirements = BusinessRequirements(
    name="AI Finance Copilot",
    description="Automated CFO assistant for SMBs",
    target_audience="Small business owners",
    monetization="Subscription $49/mo",
    mvp_features=[
        "Expense categorisation",
        "Cashflow forecasting",
        "Revenue anomaly detection"
    ],
    tech_stack=["Next.js", "Python", "Stripe", "Postgres", "LangChain"],
    success_metrics={"activation_rate": "> 30%", "payback_period": "< 60 days"}
)

result = await meta_agent.create_business(
    business_type="saas_dashboard",
    requirements=requirements
)
```

### 18.3 Inspecting Revenue Projection

```python
projection = result.revenue_projection
print(f"Projected MRR: ${projection['projected_monthly_revenue']}")
print(f"Confidence: {projection['confidence'] * 100:.1f}%")
print(f"Assumptions: {projection['assumptions']}")
```

---

## 19. Frequently Asked Questions

1. **Does the Meta-Agent require external APIs to function?**  
   No. All components degrade gracefully to local simulations. Enable A2A or external services when environments are ready.

2. **How do I force human oversight?**  
   Instantiate with `autonomous=False` or pass `autonomous=False` to `create_business`. Unsafe tasks will prompt `_request_human_approval`.

3. **Can I disable revenue projections?**  
   Set `ENABLE_REVENUE_SIMULATION=false` (future flag) or override `_simulate_revenue_projection` to return zeros.

4. **Where are business artefacts stored?**  
   Successful runs upload instructions to LangGraph (`("business", business_type)` namespace). Deployment URLs can be mirrored in CaseBank.

5. **How are agents mapped to capabilities?**  
   HALO uses `AgentCapability` enumerations. Update `infrastructure/routing_rules.py` to add new mappings.

---

## 20. Glossary

- **DAAO** – Difficulty-Aware Agentic Orchestration (cost-aware routing).
- **HTDAG** – Hierarchical Task Directed Acyclic Graph planner.
- **HALO** – Heuristic Agent Load Optimiser.
- **Inclusive Fitness Swarm** – Genetic algorithm balancing cooperative teams.
- **LangGraph Store** – Namespace-aware MongoDB-backed memory module.
- **WaltzRL** – RLHF-based safety classifier.
- **SE-Darwin** – Evolutionary self-improvement pipeline.
- **BusinessCreationStatus** – Enum tracking lifecycle stages.
- **Revenue Projection** – Deterministic heuristic for projected MRR.

---

## 21. Change Log

| Date | Version | Changes |
|------|---------|---------|
| 2025-11-03 | 2.0 | Added revenue projection heuristic, updated test strategy, expanded troubleshooting |
| 2025-10-30 | 1.5 | Integrated WaltzRL feedback mode, memory compression |
| 2025-10-20 | 1.0 | Initial release with HTDAG + HALO orchestration |

---

## 22. Contacts & Ownership

- **Product Lead:** Cora – Meta-Agent Orchestration  
- **Safety Lead:** Hudson – WaltzRL & compliance  
- **Infrastructure Lead:** Thon – Business Execution Engine  
- **Testing Lead:** Codex – Test automation & documentation  
- **Analytics Lead:** Alex – KPI dashboards, revenue telemetry

Please create a ticket in `#genesis-meta-agent` Slack channel for questions or incidents.

---

## 23. Operational Runbooks

### 23.1 Warm Start Checklist

1. Validate feature flags (`orchestration_enabled`, `llm_integration_enabled`).
2. Ensure LangGraph has write permissions (`genesis_memory` database).
3. Confirm WaltzRL keys are loaded (if running outside mock mode).
4. Seed CaseBank with at least 3 playbooks per archetype.
5. Run smoke tests:
   - `pytest -k "create_business_autogenerate_idea"`
   - `pytest -k "concurrent_business_creation"`

### 23.2 Cold Start Recovery

When recovering from a full outage:

1. Flush in-flight orchestration tasks (set `maintenance_mode=true`).
2. Replay failed business requests from queue.
3. Re-enable `maintenance_mode=false` once memory store is writable.
4. Review revenue projections flagged as `status="unavailable"` to prioritise relaunch.

---

## 24. Example Metrics Payload

```json
{
  "meta_agent.businesses.created_total": 128,
  "meta_agent.businesses.success_rate": 0.76,
  "meta_agent.execution.duration_seconds": {
    "p50": 18.4,
    "p95": 33.7,
    "max": 48.1
  },
  "meta_agent.revenue.projected_mrr": {
    "avg": 1820,
    "p95": 3420
  },
  "meta_agent.safety.violations": 3
}
```

Use the above schema when integrating with external dashboards or data warehouses.

---

## 25. Future Roadmap

- **Real Agent Integration:** Replace `_simulate_task_execution` with A2A microservice calls.
- **Adaptive Revenue Models:** Train regression models using production telemetry.
- **Human-in-the-Loop UI:** Provide approver interface for safety escalations.
- **Self-Tuning Swarm:** Allow Inclusive Fitness parameters to evolve during SE-Darwin runs.
- **Cost Optimisation Feedback:** Close loop between HALO DAAO decisions and actual spend.

---

## 26. Reference Implementations

- [Genesis Business Execution Engine](./BUSINESS_EXECUTION_ENGINE_AUDIT.md) – downstream executor.
- [WaltzRL Safety Integration Guide](./WALTZRL_TRAINING_ACTIVE.md) – safety model training.
- [Memory Compression Strategy](./SHARED_MEMORY_GUIDE.md) – DeepSeek-OCR compression details.
- [Swarm Optimisation Report](./SWARM_COORDINATOR_INTEGRATION_COMPLETE.md) – team composition internals.
- [A2A Protocol Specification](./A2A_SERVICE_README.md) – agent messaging schema.

Consult these documents to align adjacent systems with the Meta-Agent.

---

*End of Document.*
