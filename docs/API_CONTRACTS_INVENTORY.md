# Genesis API Contracts Inventory

**Author:** Hudson (Code Review & Quality Specialist)
**Created:** October 30, 2025
**Version:** 1.0.0
**Purpose:** Complete inventory of all Genesis APIs for OpenAPI 3.1 contract design

---

## Executive Summary

This document provides a comprehensive inventory of all API endpoints in the Genesis multi-agent system. The inventory is organized by category with current state assessment, priority ranking, and effort estimation for OpenAPI 3.1 specification creation.

### Total API Count: 47 Endpoints
- **Orchestration APIs:** 12 endpoints
- **Agent APIs:** 15 endpoints (15 agents)
- **Infrastructure APIs:** 12 endpoints
- **Vertex AI APIs:** 6 endpoints (tuned models)
- **A2A Protocol APIs:** 2 endpoints

### Current State Summary
- ✅ **Has OpenAPI Spec:** 0 endpoints (0%)
- ⚠️ **Partial Spec (A2A card only):** 2 endpoints (4%)
- ❌ **No Spec:** 45 endpoints (96%)

### Priority Distribution
- 🔴 **P0 (Critical):** 8 endpoints (Week 1 focus)
- 🟠 **P1 (High):** 12 endpoints (Week 2)
- 🟡 **P2 (Medium):** 17 endpoints (Week 3)
- 🟢 **P3 (Low):** 10 endpoints (Future)

### Total Effort Estimate
- **Week 1 (P0):** 24 hours
- **Week 2 (P1):** 36 hours
- **Week 3 (P2):** 48 hours
- **Future (P3):** 24 hours
- **Total:** 132 hours (~3 weeks for 3-person team)

---

## Category 1: Orchestration APIs (12 endpoints)

### 1.1 HTDAG Task Decomposition

#### POST /orchestrate/decompose
- **Purpose:** Decompose user request into hierarchical task DAG
- **Current State:** ❌ No spec
- **Priority:** 🔴 P0 (CRITICAL)
- **Source File:** `infrastructure/htdag_planner.py` (lines 143-200)
- **Key Features:**
  - Input sanitization (max 5000 chars)
  - Recursion depth limit (5 levels)
  - LLM-based decomposition with fallback
  - Test-time compute optimization support
- **Request Schema:**
  - `user_request: str` (max 5000 chars)
  - `context: Dict[str, Any]` (optional)
  - `enable_testtime_compute: bool` (default: false)
- **Response Schema:**
  - `dag_id: int`
  - `tasks: List[Task]`
  - `dependencies: Dict[str, List[str]]`
  - `metadata: Dict[str, Any]`
- **Error Codes:**
  - 400: Invalid request (too long, malformed)
  - 422: Decomposition failed (LLM error)
  - 500: Internal error
- **Effort:** 4 hours

#### POST /orchestrate/update_dag
- **Purpose:** Dynamically update DAG with new subtasks
- **Current State:** ❌ No spec
- **Priority:** 🟠 P1 (High)
- **Source File:** `infrastructure/htdag_planner.py` (lines 300-350)
- **Key Features:**
  - Dynamic task expansion
  - Update counter limits (max 10 per DAG)
  - Subtask fan-out limits (max 20)
- **Effort:** 3 hours

#### GET /orchestrate/dag/{dag_id}
- **Purpose:** Get current DAG state
- **Current State:** ❌ No spec
- **Priority:** 🟡 P2 (Medium)
- **Effort:** 2 hours

#### GET /orchestrate/dag/{dag_id}/tasks
- **Purpose:** List all tasks in DAG
- **Current State:** ❌ No spec
- **Priority:** 🟡 P2 (Medium)
- **Effort:** 2 hours

### 1.2 HALO Agent Routing

#### POST /orchestrate/route
- **Purpose:** Route tasks to appropriate agents
- **Current State:** ❌ No spec
- **Priority:** 🔴 P0 (CRITICAL)
- **Source File:** `infrastructure/halo_router.py` (lines 200-280)
- **Key Features:**
  - Logic-based declarative routing (30+ rules)
  - Capability-based matching
  - Load balancing across agents
  - Explainable agent selection
  - CaseBank integration (learning from history)
- **Request Schema:**
  - `dag_id: int`
  - `tasks: List[Task]`
  - `enable_casebank: bool` (default: true)
- **Response Schema:**
  - `routing_plan: RoutingPlan`
  - `assignments: Dict[str, str]` (task_id -> agent_name)
  - `explanations: Dict[str, str]` (reasoning)
  - `unassigned_tasks: List[str]`
  - `workload: Dict[str, int]` (agent load)
- **Error Codes:**
  - 400: Invalid DAG
  - 404: No suitable agent found
  - 429: Agent overloaded
  - 500: Routing error
- **Effort:** 4 hours

#### GET /orchestrate/route/rules
- **Purpose:** List all routing rules
- **Current State:** ❌ No spec
- **Priority:** 🟡 P2 (Medium)
- **Effort:** 2 hours

#### GET /orchestrate/agents
- **Purpose:** List available agents with capabilities
- **Current State:** ❌ No spec
- **Priority:** 🟠 P1 (High)
- **Effort:** 2 hours

### 1.3 AOP Validation

#### POST /orchestrate/validate
- **Purpose:** Validate routing plan (3-principle validation)
- **Current State:** ❌ No spec
- **Priority:** 🔴 P0 (CRITICAL)
- **Source File:** `infrastructure/aop_validator.py` (lines 128-200)
- **Key Features:**
  - Solvability check (agent capabilities match tasks)
  - Completeness check (all tasks assigned)
  - Non-redundancy check (no duplicate work)
  - Quality scoring (reward model)
  - Optional WaltzRL DIR validation
- **Request Schema:**
  - `routing_plan: RoutingPlan`
  - `dag: TaskDAG`
  - `max_budget: float` (optional, USD)
  - `dir_report: Dict[str, Any]` (optional, WaltzRL)
- **Response Schema:**
  - `passed: bool`
  - `solvability_passed: bool`
  - `completeness_passed: bool`
  - `redundancy_passed: bool`
  - `quality_score: float` (0.0-1.0)
  - `issues: List[str]`
  - `warnings: List[str]`
  - `dir_validation_passed: bool` (optional)
- **Error Codes:**
  - 400: Invalid plan/DAG
  - 422: Validation failed
  - 500: Internal error
- **Effort:** 4 hours

### 1.4 DAAO Cost Optimization

#### POST /orchestrate/optimize
- **Purpose:** Optimize task routing for cost
- **Current State:** ❌ No spec
- **Priority:** 🟠 P1 (High)
- **Source File:** `infrastructure/daao_router.py` (lines 200-280)
- **Key Features:**
  - Difficulty estimation (5 factors)
  - Model tier selection (5 tiers: $0.03-$5/1M)
  - 48% cost reduction validated
  - Context linting integration
  - WaltzRL safety wrapper
- **Effort:** 3 hours

#### GET /orchestrate/optimize/estimate
- **Purpose:** Estimate cost for routing plan
- **Current State:** ❌ No spec
- **Priority:** 🟠 P1 (High)
- **Effort:** 2 hours

### 1.5 A2A Execution

#### POST /orchestrate/execute
- **Purpose:** Execute routing plan via A2A
- **Current State:** ❌ No spec
- **Priority:** 🔴 P0 (CRITICAL)
- **Source File:** `infrastructure/a2a_connector.py` (lines 300-450)
- **Key Features:**
  - Circuit breaker pattern
  - Retry with exponential backoff
  - OTEL distributed tracing
  - Feature flag support
  - TOON compression (80% token reduction)
- **Effort:** 4 hours

#### GET /orchestrate/execute/{execution_id}/status
- **Purpose:** Get execution status
- **Current State:** ❌ No spec
- **Priority:** 🟠 P1 (High)
- **Effort:** 2 hours

---

## Category 2: Agent APIs (15 endpoints)

All 15 Genesis agents expose similar API patterns via the A2A service.

### 2.1 Agent List
1. **QA Agent** - Quality assurance, testing
2. **Support Agent** - Customer support, documentation
3. **Analyst Agent** - Data analysis, insights
4. **Legal Agent** - Legal compliance, contracts
5. **Content Agent** - Content writing, blogs
6. **Security Agent** - Security audits, scanning
7. **Marketing Agent** - Marketing strategy, campaigns
8. **Builder Agent** - Code generation (frontend/backend/DB)
9. **Deploy Agent** - Deployment, infrastructure
10. **SEO Agent** - SEO optimization
11. **Email Agent** - Email campaigns
12. **Billing Agent** - Billing, invoicing
13. **Maintenance Agent** - System maintenance
14. **Onboarding Agent** - User onboarding
15. **Spec Agent** - Requirements specification

### 2.2 Common Agent Endpoints

#### POST /agents/{agent_name}/invoke
- **Purpose:** Invoke agent with task
- **Current State:** ❌ No spec (partial A2A card)
- **Priority:** 🔴 P0 (CRITICAL) - Template for all agents
- **Source File:** `genesis_a2a_service.py` (lines 251-298)
- **Key Features:**
  - Tool-based execution
  - Authentication (X-API-Key)
  - Structured logging
  - Error handling with hints
- **Request Schema:**
  - `tool: str` (tool name)
  - `arguments: Dict[str, Any]`
- **Response Schema:**
  - `result: Any`
  - `execution_time: float`
  - `tokens_used: int`
- **Error Codes:**
  - 400: Invalid arguments
  - 401: Missing API key
  - 403: Invalid API key
  - 404: Tool/agent not found
  - 429: Rate limit exceeded
  - 500: Execution error
- **Effort:** 5 hours (template + 15 agents)

#### GET /agents/{agent_name}/capabilities
- **Purpose:** Get agent capabilities
- **Current State:** ❌ No spec
- **Priority:** 🟠 P1 (High)
- **Effort:** 2 hours

#### GET /agents/{agent_name}/tools
- **Purpose:** List agent tools
- **Current State:** ❌ No spec
- **Priority:** 🟡 P2 (Medium)
- **Effort:** 1 hour

---

## Category 3: Infrastructure APIs (12 endpoints)

### 3.1 Observability

#### POST /observability/trace
- **Purpose:** Submit OTEL trace
- **Current State:** ❌ No spec
- **Priority:** 🟠 P1 (High)
- **Source File:** `infrastructure/observability.py` (lines 200-250)
- **Effort:** 2 hours

#### GET /observability/metrics
- **Purpose:** Get system metrics
- **Current State:** ❌ No spec
- **Priority:** 🟡 P2 (Medium)
- **Effort:** 2 hours

#### GET /observability/health
- **Purpose:** Health check with detailed status
- **Current State:** ❌ No spec
- **Priority:** 🔴 P0 (CRITICAL)
- **Source File:** `genesis_a2a_service.py` (line 322)
- **Effort:** 2 hours

### 3.2 Memory Systems

#### POST /memory/casebank/store
- **Purpose:** Store case in CaseBank
- **Current State:** ❌ No spec
- **Priority:** 🟡 P2 (Medium)
- **Source File:** `infrastructure/casebank.py`
- **Effort:** 2 hours

#### GET /memory/casebank/retrieve
- **Purpose:** Retrieve similar cases
- **Current State:** ❌ No spec
- **Priority:** 🟡 P2 (Medium)
- **Effort:** 2 hours

#### POST /memory/vector/search
- **Purpose:** Vector similarity search
- **Current State:** ❌ No spec
- **Priority:** 🟡 P2 (Medium)
- **Effort:** 2 hours

### 3.3 Security

#### POST /security/validate
- **Purpose:** Security validation (AST, credentials)
- **Current State:** ❌ No spec
- **Priority:** 🟠 P1 (High)
- **Source File:** `infrastructure/security_utils.py`
- **Effort:** 3 hours

#### POST /security/auth
- **Purpose:** Agent authentication
- **Current State:** ❌ No spec
- **Priority:** 🟠 P1 (High)
- **Source File:** `infrastructure/agent_auth_registry.py`
- **Effort:** 2 hours

### 3.4 OCR/Vision

#### POST /ocr/compress
- **Purpose:** DeepSeek OCR compression
- **Current State:** ❌ No spec
- **Priority:** 🟡 P2 (Medium)
- **Source File:** `infrastructure/deepseek_ocr_compressor.py`
- **Effort:** 2 hours

### 3.5 Feature Flags

#### GET /features/flags
- **Purpose:** Get feature flag states
- **Current State:** ❌ No spec
- **Priority:** 🟠 P1 (High)
- **Source File:** `infrastructure/feature_flags.py`
- **Effort:** 2 hours

#### POST /features/flags/{flag_name}
- **Purpose:** Update feature flag
- **Current State:** ❌ No spec
- **Priority:** 🟡 P2 (Medium)
- **Effort:** 2 hours

### 3.6 Error Handling

#### GET /errors/categories
- **Purpose:** List error categories
- **Current State:** ❌ No spec
- **Priority:** 🟢 P3 (Low)
- **Effort:** 1 hour

---

## Category 4: Vertex AI APIs (6 endpoints)

### 4.1 Tuned Model Invocation

#### POST /agents/ask
- **Purpose:** Call tuned Gemini model by role
- **Current State:** ❌ No spec
- **Priority:** 🔴 P0 (CRITICAL)
- **Source File:** `api/routes/agents.py` (lines 17-30)
- **Key Features:**
  - 6 tuned models (qa/support/analyst/legal/content/security)
  - Fallback to base model on error
  - Role-based routing
- **Request Schema:**
  - `role: str` (qa|support|analyst|legal|content|security)
  - `prompt: str` (user question)
- **Response Schema:**
  - `role: str`
  - `answer: str`
  - `model_used: str` (tuned vs base)
  - `tokens_used: int`
- **Error Codes:**
  - 400: Invalid role
  - 422: Prompt validation failed
  - 429: Quota exceeded
  - 500: Model error
- **Effort:** 3 hours

#### GET /agents/models
- **Purpose:** List available tuned models
- **Current State:** ❌ No spec
- **Priority:** 🟡 P2 (Medium)
- **Effort:** 1 hour

#### GET /agents/models/{role}/config
- **Purpose:** Get model configuration
- **Current State:** ❌ No spec
- **Priority:** 🟢 P3 (Low)
- **Effort:** 1 hour

#### POST /agents/models/{role}/tune
- **Purpose:** Fine-tune model for role
- **Current State:** ❌ No spec
- **Priority:** 🟢 P3 (Low)
- **Effort:** 3 hours

#### GET /agents/models/{role}/metrics
- **Purpose:** Get model performance metrics
- **Current State:** ❌ No spec
- **Priority:** 🟡 P2 (Medium)
- **Effort:** 2 hours

#### POST /agents/models/{role}/benchmark
- **Purpose:** Benchmark model performance
- **Current State:** ❌ No spec
- **Priority:** 🟢 P3 (Low)
- **Effort:** 2 hours

---

## Category 5: A2A Protocol APIs (2 endpoints)

### 5.1 Protocol Endpoints

#### GET /a2a/card
- **Purpose:** Return A2A agent card
- **Current State:** ⚠️ Partial spec (A2A card format)
- **Priority:** 🔴 P0 (CRITICAL)
- **Source File:** `genesis_a2a_service.py` (lines 197-249)
- **Key Features:**
  - Lists 15 agents + 58 tools
  - Infrastructure tools (extract_intent, validate_intent)
  - Agent-specific tools
- **Response Schema:**
  - `name: str`
  - `version: str`
  - `description: str`
  - `protocol: str` ("A2A")
  - `total_tools: int`
  - `tools: List[ToolCard]`
- **Effort:** 2 hours

#### GET /a2a/version
- **Purpose:** Return service version
- **Current State:** ⚠️ Partial spec (basic response)
- **Priority:** 🟢 P3 (Low)
- **Source File:** `genesis_a2a_service.py` (lines 178-187)
- **Effort:** 1 hour

---

## Priority Breakdown

### Week 1: P0 Endpoints (8 endpoints, 24 hours)

1. **POST /orchestrate/decompose** (4h) - Task decomposition
2. **POST /orchestrate/route** (4h) - Agent routing
3. **POST /orchestrate/validate** (4h) - Plan validation
4. **POST /orchestrate/execute** (4h) - Plan execution
5. **POST /agents/ask** (3h) - Vertex AI tuned models
6. **POST /agents/{agent_name}/invoke** (5h) - Agent invocation (template)
7. **GET /a2a/card** (2h) - A2A protocol card
8. **GET /observability/health** (2h) - Health check

**Total:** 28 hours (~7 hours/day for 4-day week)

### Week 2: P1 Endpoints (12 endpoints, 36 hours)

- HTDAG updates, DAAO optimization
- Agent capabilities, tools
- Security, authentication
- Observability, feature flags

### Week 3: P2 Endpoints (17 endpoints, 48 hours)

- DAG queries, task lists
- Memory systems (CaseBank, vector)
- OCR/vision, model metrics
- Routing rules, agent tools

### Future: P3 Endpoints (10 endpoints, 24 hours)

- Model tuning, benchmarking
- Error categories, version info
- Model configs, extended metrics

---

## Common API Patterns

All Genesis APIs should follow these patterns:

### 1. Authentication
- Header: `X-API-Key: <key>`
- Environment-based (dev/staging/prod)
- Production requires valid key

### 2. Idempotency
- Header: `X-Idempotency-Key: <uuid>`
- Required for POST/PUT/PATCH
- Stored in Redis (24-hour TTL)

### 3. Versioning
- Header: `X-Schema-Version: v1.0.0`
- Semantic versioning (major.minor.patch)
- Breaking changes increment major version

### 4. Rate Limiting
- Headers:
  - `X-RateLimit-Limit: 100`
  - `X-RateLimit-Remaining: 95`
  - `X-RateLimit-Reset: 1730332800`
- Algorithm: Token bucket (100 req/min per user)

### 5. Error Response Structure
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request parameters",
    "hint": "Check that 'role' is one of: qa, support, analyst, legal, content, security",
    "details": {
      "field": "role",
      "value": "invalid",
      "allowed": ["qa", "support", "analyst", "legal", "content", "security"]
    },
    "request_id": "uuid",
    "timestamp": "2025-10-30T12:00:00Z"
  }
}
```

### 6. Success Response Structure
```json
{
  "data": { /* response payload */ },
  "metadata": {
    "request_id": "uuid",
    "timestamp": "2025-10-30T12:00:00Z",
    "execution_time_ms": 123,
    "tokens_used": 456
  }
}
```

---

## Dependencies Between APIs

### Orchestration Flow Dependencies
1. `/orchestrate/decompose` → produces DAG
2. `/orchestrate/route` → consumes DAG, produces routing plan
3. `/orchestrate/validate` → consumes DAG + routing plan, validates
4. `/orchestrate/optimize` → consumes routing plan, optimizes costs
5. `/orchestrate/execute` → consumes routing plan, executes via A2A

### Agent Invocation Dependencies
1. `/orchestrate/execute` → calls `/agents/{agent}/invoke`
2. `/agents/{agent}/invoke` → may call `/agents/ask` (Vertex AI)

### Memory/Learning Dependencies
1. `/orchestrate/route` → reads `/memory/casebank/retrieve`
2. `/orchestrate/execute` → writes `/memory/casebank/store` (success/failure)

---

## Testing Requirements

For each API endpoint, we need:

1. **Unit Tests**
   - Request validation (valid/invalid inputs)
   - Response serialization
   - Error handling

2. **Integration Tests**
   - End-to-end flow (decompose → route → validate → execute)
   - Cross-service communication
   - Database/cache interactions

3. **Security Tests**
   - Authentication bypass attempts
   - SQL injection, XSS, CSRF
   - Rate limiting enforcement
   - Idempotency key reuse

4. **Performance Tests**
   - Latency targets (P95 < 200ms for routing, < 2s for decomposition)
   - Throughput targets (100 req/min sustained)
   - Concurrent request handling

---

## Migration Strategy

### Phase 1: Core Orchestration (Week 1)
- Implement specs for P0 orchestration endpoints
- Deploy to staging with validation
- Run E2E tests (Alex)

### Phase 2: Agent APIs (Week 2)
- Implement agent invocation template
- Apply to all 15 agents
- Deploy to staging, validate A2A integration

### Phase 3: Infrastructure (Week 3)
- Implement memory, security, observability APIs
- Full system integration testing
- Production deployment readiness

### Rollback Plan
- Feature flags control API contract enforcement
- Gradual rollout: 0% → 10% → 25% → 50% → 100%
- Auto-rollback on error rate > 1%

---

## Success Metrics

### Technical Metrics
- **60% reduction in tool-calling failures** (target from AGENT_PROJECT_MAPPING.md)
- **95%+ schema validation pass rate**
- **<50ms overhead for validation**
- **100% API coverage with OpenAPI specs**

### Quality Metrics
- **Zero breaking changes** during migration
- **8.5/10+ Forge audit score** (Week 1 target)
- **9.0/10+ Alex E2E validation** (Week 2 target)

### Operational Metrics
- **<1% error rate increase** during rollout
- **<5% latency increase** due to validation
- **100% idempotency enforcement** for mutation operations

---

## Next Steps

1. **Week 1 (This Session):**
   - Create OpenAPI template with common components
   - Design 3 example specs (agents_ask, orchestrate_task, halo_route)
   - Implement validator stub (OpenAPIValidator class)
   - Document design decisions and Week 2-3 roadmap

2. **Week 2 (Thon + Hudson):**
   - Implement validators for all P0/P1 endpoints
   - FastAPI middleware integration
   - Redis idempotency store
   - E2E testing with Alex

3. **Week 3 (Team + Forge):**
   - Complete P2 specs
   - Performance testing
   - Production deployment with progressive rollout
   - Forge final audit

---

## Appendix A: File Locations

### API Route Files
- `api/routes/agents.py` - Vertex AI tuned models endpoint
- `genesis_a2a_service.py` - Full A2A service with all 15 agents
- `a2a_service.py` - Simple A2A service (orchestrator only)

### Orchestration Components
- `infrastructure/htdag_planner.py` - Task decomposition
- `infrastructure/halo_router.py` - Agent routing
- `infrastructure/aop_validator.py` - Plan validation
- `infrastructure/daao_router.py` - Cost optimization
- `infrastructure/a2a_connector.py` - A2A execution

### Infrastructure Components
- `infrastructure/observability.py` - OTEL tracing/metrics
- `infrastructure/error_handler.py` - Error handling
- `infrastructure/feature_flags.py` - Feature flags
- `infrastructure/security_utils.py` - Security validation
- `infrastructure/agent_auth_registry.py` - Authentication

### Memory Systems
- `infrastructure/casebank.py` - Memento CaseBank
- `infrastructure/vector_database.py` - Vector search
- `infrastructure/graph_database.py` - Graph queries

### Agents
- `agents/*.py` - 15 agent implementations

---

## Appendix B: Glossary

- **HTDAG:** Hierarchical Task Decomposition into DAG
- **HALO:** Hierarchical Agent Logic Orchestration
- **AOP:** Agent-Oriented Planning (3-principle validation)
- **DAAO:** Difficulty-Aware Agentic Orchestration (cost optimization)
- **A2A:** Agent-to-Agent protocol (universal agent communication)
- **OTEL:** OpenTelemetry (observability standard)
- **CaseBank:** Memento case-based reasoning system
- **WaltzRL:** Collaborative multi-agent safety framework
- **Idempotency:** Request can be safely repeated without duplicating effects
- **Circuit Breaker:** Resilience pattern for service failures

---

**End of API Inventory**
