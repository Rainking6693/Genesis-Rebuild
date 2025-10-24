---
title: A2A Integration with Triple-Layer Orchestration
category: Architecture
dg-publish: true
publish: true
tags: []
source: docs/A2A_ORCHESTRATION_INTEGRATION.md
exported: '2025-10-24T22:05:26.939015'
---

# A2A Integration with Triple-Layer Orchestration

**Date:** October 19, 2025
**Status:** ANALYSIS COMPLETE - Integration Required
**Priority:** HIGH (Production deployment dependency)

---

## 🎯 EXECUTIVE SUMMARY

**Current State:**
- ✅ **A2A Service:** OPERATIONAL (FastAPI, 15 agents, 56 tools)
- ✅ **Triple-Layer Orchestration:** COMPLETE (HTDAG → HALO → AOP → DAAO)
- ❌ **Integration:** NOT CONNECTED (layers work independently)

**Gap:** The orchestration layer (HTDAG/HALO/AOP) does NOT communicate with agents via A2A protocol.

**Impact:** Without integration:
- Orchestrator cannot execute tasks on actual agents
- A2A agents run in isolation (no orchestration benefits)
- System cannot demonstrate end-to-end functionality

**Recommendation:** **YES, integration is REQUIRED** before production deployment.

---

## 📊 CURRENT ARCHITECTURE

### Layer 1: Triple-Layer Orchestration ✅ COMPLETE
```
User Request
    ↓
[HTDAG] Decompose into hierarchical DAG (infrastructure/htdag_planner.py)
    ↓
[HALO] Route tasks to agents (infrastructure/halo_router.py)
    ↓
[AOP] Validate plan (infrastructure/aop_validator.py)
    ↓
[DAAO] Optimize costs (infrastructure/daao_optimizer.py)
    ↓
[EXECUTION] ← **MISSING: No connection to A2A agents**
```

### Layer 3: A2A Protocol ✅ COMPLETE
```
FastAPI Service (http://127.0.0.1:8080)
    ↓
15 Agents Available:
- Marketing, Builder, Content, Deploy, Support
- QA, SEO, Email, Legal, Security
- Billing, Analyst, Maintenance, Onboarding, Spec
    ↓
56 Tools Exposed
```

### Current Problem
```
┌─────────────────────────────────┐
│   Orchestration Layer           │  ← Has routing plan
│   (HTDAG/HALO/AOP/DAAO)         │
└─────────────────────────────────┘
           ❌ NO CONNECTION
┌─────────────────────────────────┐
│   A2A Service                   │  ← Has agents ready
│   (15 agents via FastAPI)       │
└─────────────────────────────────┘
```

---

## 🔧 INTEGRATION ARCHITECTURE

### Proposed Solution: A2A Client Connector

Create `infrastructure/a2a_connector.py` that:
1. Takes routing plan from HALO
2. Calls A2A service endpoints for each agent
3. Returns execution results back to orchestrator
4. Tracks task status and handles failures

### Data Flow (After Integration)
```
User: "Build a SaaS app"
    ↓
[HTDAG] Decomposes into:
  - research_market (spec_agent)
  - design_architecture (spec_agent)
  - build_frontend (builder_agent)
  - build_backend (builder_agent)
  - deploy_app (deploy_agent)
    ↓
[HALO] Routes tasks to agents:
  {
    "research_market": "spec_agent",
    "design_architecture": "spec_agent",
    "build_frontend": "builder_agent",
    "build_backend": "builder_agent",
    "deploy_app": "deploy_agent"
  }
    ↓
[AOP] Validates:
  ✅ Solvability: All agents capable
  ✅ Completeness: All tasks covered
  ✅ Non-redundancy: No duplicate work
    ↓
[DAAO] Optimizes costs
    ↓
[A2A CONNECTOR] ← **NEW COMPONENT**
  - POST http://127.0.0.1:8080/a2a/invoke
  - tool: "spec.research_market"
  - arguments: {...}
    ↓
[A2A Service] Executes on SpecAgent
    ↓
[Result] Returns to orchestrator
```

---

## 📝 IMPLEMENTATION PLAN

### Phase 1: A2A Connector (2-3 hours)

**File:** `infrastructure/a2a_connector.py` (~300 lines)

**Functionality:**
```python
class A2AConnector:
    """
    Connects orchestration layer to A2A service

    Translates routing plan into A2A tool invocations
    """

    async def execute_routing_plan(
        self,
        routing_plan: RoutingPlan,
        dag: TaskDAG
    ) -> Dict[str, Any]:
        """
        Execute all tasks in routing plan via A2A protocol

        Args:
            routing_plan: HALO routing assignments
            dag: HTDAG task DAG

        Returns:
            Execution results for each task
        """

    async def invoke_agent_tool(
        self,
        agent_name: str,
        tool_name: str,
        arguments: Dict[str, Any]
    ) -> Any:
        """
        Call A2A service endpoint

        POST http://127.0.0.1:8080/a2a/invoke
        {
            "tool": "marketing.create_strategy",
            "arguments": {...}
        }
        """

    def map_agent_to_a2a_tool(
        self,
        agent_name: str,
        task: Task
    ) -> Tuple[str, str]:
        """
        Map HALO agent name to A2A tool

        Examples:
        - spec_agent + task_type=research → "spec.research_market"
        - builder_agent + task_type=frontend → "builder.generate_frontend"
        """
```

**Key Features:**
- HTTP client for A2A service
- Agent name → A2A tool mapping
- Task → Arguments translation
- Error handling and retries
- OTEL tracing integration
- Feature flag support

### Phase 2: Orchestrator Integration (1-2 hours)

**File:** `genesis_orchestrator.py` (modify existing)

**Changes:**
```python
class GenesisOrchestrator:
    def __init__(self):
        # ... existing code ...

        # Add A2A connector
        if is_feature_enabled('a2a_integration_enabled'):
            self.a2a_connector = A2AConnector(
                base_url="http://127.0.0.1:8080"
            )
        else:
            self.a2a_connector = None

    async def execute_orchestrated_request(
        self,
        user_request: str
    ) -> Dict:
        """
        Full end-to-end orchestration + execution

        1. HTDAG: Decompose request → DAG
        2. HALO: Route tasks → agents
        3. AOP: Validate plan
        4. DAAO: Optimize costs
        5. A2A: Execute via connector ← NEW
        """
        # 1. Decompose
        dag = await self.htdag.decompose(user_request)

        # 2. Route
        routing_plan = self.halo.route_tasks(dag)

        # 3. Validate
        validation = self.aop.validate(routing_plan, dag)
        if not validation.is_valid:
            raise ValidationError(validation.issues)

        # 4. Optimize costs
        optimized_plan = self.daao.optimize(routing_plan)

        # 5. Execute via A2A ← NEW
        if self.a2a_connector:
            results = await self.a2a_connector.execute_routing_plan(
                optimized_plan, dag
            )
            return results
        else:
            # Fallback: log only
            return {"status": "planned", "plan": optimized_plan}
```

### Phase 3: Testing (2-3 hours)

**Test File:** `tests/test_a2a_integration.py` (~400 lines)

**Test Scenarios:**
1. Simple request (1 agent, 1 task)
2. Complex request (5 agents, 10 tasks)
3. Parallel execution (independent tasks)
4. Sequential execution (dependent tasks)
5. Error handling (agent failures)
6. Timeout handling
7. Partial success scenarios

**Test Example:**
```python
async def test_simple_marketing_request():
    """Test orchestration → A2A → Marketing Agent"""

    orchestrator = GenesisOrchestrator()

    result = await orchestrator.execute_orchestrated_request(
        "Create a marketing strategy for a new SaaS product"
    )

    assert result['status'] == 'success'
    assert 'marketing' in result['agents_used']
    assert result['task_count'] >= 1
```

---

## 🚦 FEATURE FLAG CONFIGURATION

Add to `config/feature_flags.json`:

```json
{
  "a2a_integration_enabled": {
    "description": "Enable A2A connector for agent execution",
    "enabled": false,
    "category": "experimental",
    "rollout_percentage": 0
  }
}
```

**Deployment Strategy:**
- **Staging:** `enabled: true` (validate integration)
- **Production Day 1-2:** `enabled: false` (monitor orchestration only)
- **Production Day 3:** `rollout_percentage: 5` (gradual A2A enablement)
- **Production Day 7:** `rollout_percentage: 100` (full integration)

---

## 📊 AGENT NAME MAPPING

### HALO Router → A2A Service

| HALO Agent Name | A2A Agent | Example Tools |
|-----------------|-----------|---------------|
| spec_agent | spec | research_market, design_architecture |
| architect_agent | spec | design_system_architecture |
| builder_agent | builder | generate_frontend, generate_backend |
| frontend_agent | builder | create_react_component |
| backend_agent | builder | create_api_endpoint |
| qa_agent | qa | run_tests, generate_test_cases |
| security_agent | security | audit_code, check_vulnerabilities |
| deploy_agent | deploy | deploy_to_vercel, setup_ci_cd |
| monitoring_agent | maintenance | setup_logging, create_alerts |
| marketing_agent | marketing | create_strategy, launch_campaign |
| sales_agent | marketing | generate_sales_funnel |
| support_agent | support | create_kb_article |
| analytics_agent | analyst | track_metrics |
| research_agent | analyst | research_market |
| finance_agent | billing | setup_billing |

**Implementation:**
```python
HALO_TO_A2A_MAPPING = {
    "spec_agent": "spec",
    "architect_agent": "spec",
    "builder_agent": "builder",
    "frontend_agent": "builder",
    "backend_agent": "builder",
    "qa_agent": "qa",
    "security_agent": "security",
    "deploy_agent": "deploy",
    "monitoring_agent": "maintenance",
    "marketing_agent": "marketing",
    "sales_agent": "marketing",
    "support_agent": "support",
    "analytics_agent": "analyst",
    "research_agent": "analyst",
    "finance_agent": "billing"
}
```

---

## 🔄 DEPENDENCY EXECUTION

### Sequential Tasks (Respect DAG Dependencies)

```python
async def execute_with_dependencies(dag: TaskDAG, routing_plan: RoutingPlan):
    """Execute tasks in topological order"""

    # Get execution order from DAG
    execution_order = dag.topological_sort()

    results = {}

    for task_id in execution_order:
        task = dag.get_task(task_id)
        agent = routing_plan.assignments[task_id]

        # Wait for dependencies to complete
        dependency_results = {}
        for dep_id in task.dependencies:
            if dep_id not in results:
                raise Exception(f"Dependency {dep_id} not completed")
            dependency_results[dep_id] = results[dep_id]

        # Execute task with dependency results as input
        result = await invoke_agent_tool(
            agent_name=agent,
            tool_name=infer_tool_name(task),
            arguments={
                **task.parameters,
                "dependency_results": dependency_results
            }
        )

        results[task_id] = result

    return results
```

---

## 🛡️ ERROR HANDLING

### Circuit Breaker Pattern

```python
class A2AConnector:
    def __init__(self):
        self.circuit_breaker = CircuitBreaker(
            failure_threshold=5,
            timeout=60,
            recovery_timeout=300
        )

    async def invoke_agent_tool(self, ...):
        if self.circuit_breaker.is_open:
            raise CircuitBreakerOpen("A2A service unavailable")

        try:
            result = await self._http_call(...)
            self.circuit_breaker.record_success()
            return result
        except Exception as e:
            self.circuit_breaker.record_failure()
            raise
```

### Graceful Degradation

```python
async def execute_with_fallback(task, agent):
    """Try A2A, fall back to local execution"""

    if is_feature_enabled('a2a_integration_enabled'):
        try:
            return await a2a_connector.invoke_agent_tool(agent, task)
        except A2AError as e:
            log_error(e)
            if is_feature_enabled('a2a_fallback_enabled'):
                return await local_agent_executor.execute(agent, task)
            raise
    else:
        return await local_agent_executor.execute(agent, task)
```

---

## 📈 MONITORING & OBSERVABILITY

### OTEL Tracing

```python
from opentelemetry import trace

tracer = trace.get_tracer(__name__)

async def execute_routing_plan(routing_plan, dag):
    with tracer.start_as_current_span("a2a.execute_routing_plan") as span:
        span.set_attribute("task_count", len(routing_plan.assignments))
        span.set_attribute("agent_count", len(set(routing_plan.assignments.values())))

        for task_id, agent in routing_plan.assignments.items():
            with tracer.start_as_current_span(f"a2a.task.{task_id}") as task_span:
                task_span.set_attribute("agent", agent)
                task_span.set_attribute("task_id", task_id)

                result = await self.invoke_agent_tool(...)

                task_span.set_attribute("status", "success")
                task_span.set_attribute("execution_time_ms", ...)
```

### Metrics

Track:
- `a2a.requests.total` (counter)
- `a2a.requests.duration` (histogram)
- `a2a.requests.errors` (counter)
- `a2a.agent.invocations` (counter by agent)
- `a2a.circuit_breaker.state` (gauge: open/closed)

---

## ✅ ACCEPTANCE CRITERIA

### Integration Complete When:

1. **A2A Connector Built:**
   - [ ] `infrastructure/a2a_connector.py` implemented
   - [ ] HTTP client for A2A service
   - [ ] Agent name mapping complete
   - [ ] Error handling with circuit breaker
   - [ ] OTEL tracing integrated

2. **Orchestrator Updated:**
   - [ ] `genesis_orchestrator.py` uses A2A connector
   - [ ] Feature flag support
   - [ ] End-to-end execution method
   - [ ] Graceful degradation

3. **Testing Complete:**
   - [ ] `tests/test_a2a_integration.py` (30+ tests)
   - [ ] Simple request works
   - [ ] Complex multi-agent works
   - [ ] Error handling validated
   - [ ] Performance acceptable (<500ms overhead)

4. **Documentation Updated:**
   - [ ] AGENT_BRIEFING.md includes A2A integration
   - [ ] PROJECT_STATUS.md updated
   - [ ] Deployment runbook includes A2A validation

5. **Production Ready:**
   - [ ] Staging tests pass (31/31)
   - [ ] Feature flag configured
   - [ ] Monitoring dashboards show A2A metrics
   - [ ] Rollback plan documented

---

## 🎯 DEPLOYMENT TIMELINE

**Immediate (October 19, 3-4 hours):**
- Build A2A connector
- Update orchestrator
- Write integration tests

**Staging Validation (October 19-20, 1 day):**
- Deploy to staging
- Run 31 validation tests
- Monitor for errors

**Production Rollout (October 21-25, 5 days):**
- Day 1-2: `a2a_integration_enabled: false` (orchestration only)
- Day 3: `rollout_percentage: 5` (5% traffic via A2A)
- Day 5: `rollout_percentage: 50` (half traffic)
- Day 7: `rollout_percentage: 100` (full integration)

---

## 🚨 RISKS & MITIGATION

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| A2A service down | High | Low | Circuit breaker, fallback |
| Agent timeout | Medium | Medium | Timeout configuration, retry |
| Mapping errors | High | Low | Comprehensive tests, validation |
| Performance degradation | Medium | Medium | Async execution, monitoring |
| Integration bugs | High | Medium | Progressive rollout, feature flags |

---

## 📞 NEXT STEPS

### Immediate Actions Required:

1. **Build A2A Connector** (3 hours)
   - Create `infrastructure/a2a_connector.py`
   - Implement HTTP client
   - Add agent mapping logic
   - Integrate OTEL tracing

2. **Update Orchestrator** (2 hours)
   - Modify `genesis_orchestrator.py`
   - Add A2A connector initialization
   - Create end-to-end execution method

3. **Write Tests** (2 hours)
   - Create `tests/test_a2a_integration.py`
   - 30+ test scenarios
   - Validate all integration points

4. **Staging Deployment** (1 day)
   - Deploy integrated system
   - Run validation suite
   - Monitor metrics

**Total Effort:** ~8 hours coding + 1 day validation = **Ready by October 20**

---

## 🎓 CONCLUSION

**Answer:** **YES, A2A integration with triple-layer orchestration IS REQUIRED.**

**Current State:**
- Orchestration layer works (HTDAG/HALO/AOP/DAAO)
- A2A service works (15 agents, 56 tools)
- **But they don't talk to each other**

**Integration Needed:**
- A2A Connector component (~300 lines)
- Orchestrator updates (~100 lines)
- Integration tests (~400 lines)
- **Total: ~8 hours work**

**Deployment:**
- Build TODAY (October 19)
- Validate in staging (October 19-20)
- Progressive production rollout (October 21-25)

**Priority:** **HIGH** - Without this, orchestration can plan but not execute.

---

**Status:** Ready to implement immediately using Haiku 4.5 for cost efficiency.

