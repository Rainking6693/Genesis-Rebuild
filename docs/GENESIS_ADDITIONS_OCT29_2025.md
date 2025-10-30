# Genesis Additions - October 29, 2025

**Date:** October 29, 2025
**Status:** Planning Phase
**Priority:** Post-Deployment Enhancements (Week 2-4)

---

## Executive Summary

7 new additions to enhance Genesis multi-agent system based on latest research and industry best practices. These additions focus on:
1. **API Reliability** (AI-Ready API contracts)
2. **Orchestration Robustness** (LangGraph migration)
3. **Research Intelligence** (Trend Radar pipeline)
4. **Quality Gates** (Multimodal eval harness)
5. **Learning Optimization** (DiscoRL integration)
6. **Knowledge Management** (Runbook publishing)
7. **Transparency** (Public demo page)

**Implementation Timeline:** 3-4 weeks (Post-deployment, Weeks 2-5)
**Estimated Effort:** ~180-220 hours total
**Expected ROI:** 40-60% reduction in tool failures, 30% faster learning convergence, 50% faster incident resolution

---

## Addition 1: AI-Ready API Contracts (Postman Guide)

### Problem Statement
- **Current Issue:** Flaky tool-calling, schema drift, silent failures
- **Impact:** A2A communication errors, poor recovery, debugging difficulty
- **Root Cause:** Ad-hoc API contracts, inconsistent error handling, no versioning

### Solution: Standardize All APIs with OpenAPI Specs

**Key Components:**
1. **OpenAPI 3.1 Specifications** for every tool/agent API
2. **Versioned Schemas** (semantic versioning: v1.0.0, v1.1.0, v2.0.0)
3. **Idempotent Endpoints** (POST/PUT with idempotency keys)
4. **Structured Error Payloads** (error.code, error.message, error.hint)

### Implementation Plan

#### Phase 1: Audit Existing APIs (Week 2, 8 hours)
```bash
# Identify all tool/agent APIs in codebase
find . -name "*.py" -path "*/tools/*" -o -path "*/agents/*" | grep -E "(tool_|agent_)"

# Expected APIs to document:
# - 15 agent APIs (analyst, support, qa, legal, security, content, etc.)
# - 20+ tool APIs (echo, search, code_execution, browser, etc.)
# - Infrastructure APIs (A2A connector, HALO router, HTDAG planner)
```

**Deliverables:**
- API inventory spreadsheet (35-40 APIs)
- Current schema documentation
- Error handling audit report

---

#### Phase 2: Create OpenAPI Specs (Week 2-3, 40 hours)

**Example OpenAPI Spec for Analyst Agent:**

```yaml
# /home/genesis/genesis-rebuild/specs/openapi/analyst_agent_v1.yaml

openapi: 3.1.0
info:
  title: Genesis Analyst Agent API
  version: 1.0.0
  description: Financial and data analysis agent with chart generation
  contact:
    name: Genesis Team
    url: https://github.com/genesis/genesis-rebuild

servers:
  - url: http://localhost:8000/agents/analyst
    description: Local development
  - url: https://api.genesis.ai/v1/agents/analyst
    description: Production

paths:
  /analyze:
    post:
      operationId: analyzeData
      summary: Analyze financial data and generate insights
      tags:
        - analysis
      parameters:
        - name: X-Idempotency-Key
          in: header
          required: true
          schema:
            type: string
            format: uuid
          description: Unique request identifier for idempotency
        - name: X-Schema-Version
          in: header
          required: true
          schema:
            type: string
            pattern: '^v\d+\.\d+\.\d+$'
          description: API schema version (e.g., v1.0.0)
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/AnalysisRequest'
      responses:
        '200':
          description: Analysis completed successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AnalysisResponse'
        '400':
          description: Invalid request
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
        '429':
          description: Rate limit exceeded
          headers:
            X-RateLimit-Limit:
              schema:
                type: integer
              description: Request limit per hour
            X-RateLimit-Remaining:
              schema:
                type: integer
              description: Requests remaining
            X-RateLimit-Reset:
              schema:
                type: integer
              description: Unix timestamp when limit resets
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
        '500':
          description: Internal server error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'

components:
  schemas:
    AnalysisRequest:
      type: object
      required:
        - data
        - analysis_type
      properties:
        data:
          type: object
          description: Data to analyze (CSV, JSON, or structured)
        analysis_type:
          type: string
          enum: [financial, trend, comparative, predictive]
          description: Type of analysis to perform
        options:
          type: object
          properties:
            include_charts:
              type: boolean
              default: true
            output_format:
              type: string
              enum: [json, markdown, html]
              default: json

    AnalysisResponse:
      type: object
      required:
        - status
        - results
        - metadata
      properties:
        status:
          type: string
          enum: [success]
        results:
          type: object
          properties:
            insights:
              type: array
              items:
                type: string
            charts:
              type: array
              items:
                type: object
                properties:
                  type:
                    type: string
                  data_url:
                    type: string
                    format: uri
        metadata:
          $ref: '#/components/schemas/ResponseMetadata'

    ErrorResponse:
      type: object
      required:
        - error
      properties:
        error:
          type: object
          required:
            - code
            - message
          properties:
            code:
              type: string
              description: Machine-readable error code
              example: INVALID_DATA_FORMAT
            message:
              type: string
              description: Human-readable error message
              example: "Data must be in CSV or JSON format"
            hint:
              type: string
              description: Suggested fix or next steps
              example: "Convert your data to JSON format using the /convert endpoint"
            details:
              type: object
              description: Additional error context
              additionalProperties: true

    ResponseMetadata:
      type: object
      required:
        - request_id
        - timestamp
        - processing_time_ms
      properties:
        request_id:
          type: string
          format: uuid
        timestamp:
          type: string
          format: date-time
        processing_time_ms:
          type: number
        agent_version:
          type: string
        schema_version:
          type: string
```

**Deliverables:**
- 40 OpenAPI specs (1 per API)
- Stored in `/specs/openapi/` directory
- Versioned with git tags

---

#### Phase 3: Implement Structured Error Handling (Week 3, 20 hours)

**Create Error Response Helper:**

```python
# /home/genesis/genesis-rebuild/infrastructure/api_helpers.py

from dataclasses import dataclass
from typing import Optional, Dict, Any
from enum import Enum
import json

class ErrorCode(Enum):
    """Standard error codes across all Genesis APIs"""

    # Client Errors (4xx)
    INVALID_REQUEST = "INVALID_REQUEST"
    INVALID_DATA_FORMAT = "INVALID_DATA_FORMAT"
    MISSING_REQUIRED_FIELD = "MISSING_REQUIRED_FIELD"
    AUTHENTICATION_FAILED = "AUTHENTICATION_FAILED"
    AUTHORIZATION_FAILED = "AUTHORIZATION_FAILED"
    RATE_LIMIT_EXCEEDED = "RATE_LIMIT_EXCEEDED"
    RESOURCE_NOT_FOUND = "RESOURCE_NOT_FOUND"

    # Server Errors (5xx)
    INTERNAL_ERROR = "INTERNAL_ERROR"
    SERVICE_UNAVAILABLE = "SERVICE_UNAVAILABLE"
    TIMEOUT = "TIMEOUT"
    AGENT_FAILURE = "AGENT_FAILURE"
    TOOL_EXECUTION_FAILED = "TOOL_EXECUTION_FAILED"

@dataclass
class ErrorResponse:
    """Structured error response for all Genesis APIs"""
    code: str  # Machine-readable error code
    message: str  # Human-readable error message
    hint: Optional[str] = None  # Suggested fix
    details: Optional[Dict[str, Any]] = None  # Additional context

    def to_dict(self) -> Dict[str, Any]:
        """Convert to JSON-serializable dict"""
        result = {
            "error": {
                "code": self.code,
                "message": self.message
            }
        }
        if self.hint:
            result["error"]["hint"] = self.hint
        if self.details:
            result["error"]["details"] = self.details
        return result

    def to_json(self) -> str:
        """Convert to JSON string"""
        return json.dumps(self.to_dict(), indent=2)

def create_error_response(
    code: ErrorCode,
    message: str,
    hint: Optional[str] = None,
    details: Optional[Dict[str, Any]] = None
) -> ErrorResponse:
    """Factory function to create structured error responses"""
    return ErrorResponse(
        code=code.value,
        message=message,
        hint=hint,
        details=details
    )

# Example usage in agent code:
"""
from infrastructure.api_helpers import create_error_response, ErrorCode

def analyze_data(request):
    try:
        # Validate request
        if not request.get('data'):
            error = create_error_response(
                code=ErrorCode.MISSING_REQUIRED_FIELD,
                message="Missing required field: 'data'",
                hint="Include 'data' field in your request body",
                details={"required_fields": ["data", "analysis_type"]}
            )
            return error.to_dict(), 400

        # Process data
        result = perform_analysis(request['data'])
        return {"status": "success", "results": result}, 200

    except ValueError as e:
        error = create_error_response(
            code=ErrorCode.INVALID_DATA_FORMAT,
            message=str(e),
            hint="Convert data to CSV or JSON format"
        )
        return error.to_dict(), 400
"""
```

**Deliverables:**
- Error response helper module
- Update all 40 APIs to use structured errors
- Error code documentation

---

#### Phase 4: Add Contract Tests + Mock Servers (Week 3, 16 hours)

**Contract Test Example:**

```python
# /home/genesis/genesis-rebuild/tests/contract/test_analyst_agent_contract.py

import pytest
import requests
from openapi_spec_validator import validate_spec
import yaml

def test_analyst_agent_openapi_spec_is_valid():
    """Verify OpenAPI spec is valid"""
    with open('specs/openapi/analyst_agent_v1.yaml') as f:
        spec = yaml.safe_load(f)

    # Validate spec against OpenAPI 3.1 schema
    validate_spec(spec)

def test_analyst_agent_returns_structured_errors():
    """Verify API returns structured error responses"""
    response = requests.post(
        'http://localhost:8000/agents/analyst/analyze',
        json={},  # Invalid: missing required fields
        headers={
            'X-Idempotency-Key': 'test-123',
            'X-Schema-Version': 'v1.0.0'
        }
    )

    assert response.status_code == 400
    error = response.json()

    # Verify error structure
    assert 'error' in error
    assert 'code' in error['error']
    assert 'message' in error['error']
    assert error['error']['code'] == 'MISSING_REQUIRED_FIELD'

    # Verify hint is provided
    assert 'hint' in error['error']

def test_analyst_agent_respects_idempotency():
    """Verify idempotent behavior"""
    request_data = {
        'data': {'revenue': [100, 200, 300]},
        'analysis_type': 'trend'
    }
    idempotency_key = 'test-idempotent-456'

    # Make first request
    response1 = requests.post(
        'http://localhost:8000/agents/analyst/analyze',
        json=request_data,
        headers={
            'X-Idempotency-Key': idempotency_key,
            'X-Schema-Version': 'v1.0.0'
        }
    )

    # Make second request with same idempotency key
    response2 = requests.post(
        'http://localhost:8000/agents/analyst/analyze',
        json=request_data,
        headers={
            'X-Idempotency-Key': idempotency_key,
            'X-Schema-Version': 'v1.0.0'
        }
    )

    assert response1.status_code == 200
    assert response2.status_code == 200

    # Should return same result
    assert response1.json()['results'] == response2.json()['results']

def test_analyst_agent_enforces_rate_limits():
    """Verify rate limiting headers"""
    response = requests.post(
        'http://localhost:8000/agents/analyst/analyze',
        json={'data': {'test': 1}, 'analysis_type': 'financial'},
        headers={
            'X-Idempotency-Key': 'test-rate-789',
            'X-Schema-Version': 'v1.0.0'
        }
    )

    # Check rate limit headers
    assert 'X-RateLimit-Limit' in response.headers
    assert 'X-RateLimit-Remaining' in response.headers
    assert 'X-RateLimit-Reset' in response.headers
```

**Mock Server Setup:**

```yaml
# /home/genesis/genesis-rebuild/tests/mocks/analyst_agent_mock.yaml

# Prism mock server config (https://github.com/stoplightio/prism)
# Usage: prism mock -d specs/openapi/analyst_agent_v1.yaml
```

**Deliverables:**
- Contract tests for all 40 APIs
- Mock servers for CI/CD integration
- CI pipeline integration (GitHub Actions)

---

### Success Criteria

- [ ] ✅ 40 OpenAPI specs created (1 per API)
- [ ] ✅ All APIs return structured errors (error.code/message/hint)
- [ ] ✅ Idempotency keys supported on POST/PUT endpoints
- [ ] ✅ Rate limiting headers on all responses
- [ ] ✅ 40 contract test suites (1 per API)
- [ ] ✅ Mock servers integrated in CI pipeline
- [ ] ✅ Schema version tracked in all requests
- [ ] ✅ Documentation published to internal wiki

### Expected Impact

- **Reliability:** 60% reduction in tool-calling failures
- **Debugging:** 70% faster error diagnosis (structured errors)
- **A2A Communication:** 50% improvement in inter-agent reliability
- **Developer Experience:** 40% faster API integration

### Resources

- **Reference:** [Postman AI-Ready APIs Guide](https://voyager.postman.com/pdf/developers-guide-to-ai-ready-apis.pdf)
- **Tool:** OpenAPI Generator (https://github.com/OpenAPITools/openapi-generator)
- **Tool:** Prism Mock Server (https://github.com/stoplightio/prism)
- **Tool:** openapi-spec-validator (Python library)

---

## Addition 2: Migrate Orchestrator to LangGraph Harness

### Problem Statement
- **Current Issue:** Brittle chains, long-horizon instability, no persistence
- **Impact:** Crashes lose all progress, hard to debug, no resumability
- **Root Cause:** Linear orchestration, no state management, weak retry logic

### Solution: Graph-Based Orchestration with State Persistence

**Key Components:**
1. **LangGraph Graph Definition** (explicit state nodes)
2. **LangGraph Store** (SQLite/S3 for cross-run memory)
3. **Node-Level Retry Policies** (per-node backoff/circuit breakers)
4. **Distributed Tracing** (spans/metrics for each node)

### Current Architecture vs. Target

**Current (Linear Chain):**
```
Query → HTDAG → HALO → Execute → Response
        ↓       ↓       ↓
       (No persistence, no retry, crashes lose progress)
```

**Target (LangGraph State Machine):**
```
                  ┌─────────────┐
                  │ Query Input │
                  └──────┬──────┘
                         ↓
                  ┌──────────────┐
                  │ HTDAG Planner│ ← Retry: 3x, backoff: exp
                  └──────┬───────┘
                         ↓
                  ┌──────────────┐
                  │ HALO Router  │ ← Retry: 2x, backoff: linear
                  └──────┬───────┘
                         ↓
            ┌────────────┴────────────┐
            ↓                         ↓
    ┌──────────────┐          ┌──────────────┐
    │ Execute Task │          │ Safety Check │
    └──────┬───────┘          └──────┬───────┘
           ↓                         ↓
    ┌──────────────┐          ┌──────────────┐
    │ Critic Agent │          │ WaltzRL      │
    └──────┬───────┘          └──────┬───────┘
           ↓                         ↓
           └────────────┬────────────┘
                        ↓
                 ┌──────────────┐
                 │ Final Output │
                 └──────────────┘

[State persisted at each node transition]
[Resumable from any node on crash]
[Full trace in OTEL]
```

### Implementation Plan

#### Phase 1: Install LangGraph + Setup (Week 2, 4 hours)

```bash
# Install LangGraph
pip install langgraph langchain-core

# Install LangGraph Store dependencies
pip install sqlalchemy aiosqlite  # For SQLite backend
# OR
pip install boto3  # For S3 backend
```

**Configuration:**

```python
# /home/genesis/genesis-rebuild/config/langgraph_config.py

from langgraph.store import SQLiteStore, S3Store
import os

def get_langgraph_store():
    """Get configured LangGraph Store based on environment"""
    env = os.environ.get('ENVIRONMENT', 'development')

    if env == 'production':
        # Use S3 for production (persistent, scalable)
        return S3Store(
            bucket_name='genesis-langgraph-state',
            region='us-east-1'
        )
    else:
        # Use SQLite for development (local, fast)
        return SQLiteStore(
            db_path='/home/genesis/genesis-rebuild/data/langgraph_state.db'
        )
```

---

#### Phase 2: Define LangGraph for 19 Agents (Week 2-3, 32 hours)

**Example LangGraph Definition:**

```python
# /home/genesis/genesis-rebuild/infrastructure/langgraph_orchestrator.py

from langgraph.graph import StateGraph, END
from langgraph.checkpoint import MemorySaver, SqliteSaver
from langgraph.prebuilt import ToolExecutor
from typing import TypedDict, Annotated, Sequence
from operator import add
import logging

logger = logging.getLogger(__name__)

# Define state schema
class AgentState(TypedDict):
    """State passed between nodes in the graph"""
    query: str
    decomposed_tasks: list[dict]
    routed_agents: list[str]
    execution_results: Annotated[Sequence[dict], add]
    safety_checks: list[dict]
    critic_feedback: list[str]
    final_output: str
    error_count: int
    retry_count: int
    metadata: dict

# Node functions
def htdag_planner_node(state: AgentState) -> AgentState:
    """
    HTDAG decomposition node with retry logic.

    Retry Policy: 3 attempts, exponential backoff
    Circuit Breaker: 5 failures → 60s timeout
    """
    from infrastructure.htdag_planner import HTDAGPlanner

    logger.info(f"HTDAG Planner: Decomposing query: {state['query']}")

    try:
        planner = HTDAGPlanner()
        tasks = planner.decompose(state['query'])

        state['decomposed_tasks'] = tasks
        state['metadata']['htdag_duration_ms'] = tasks.get('duration_ms', 0)

        logger.info(f"HTDAG Planner: Decomposed into {len(tasks['dag'])} tasks")
        return state

    except Exception as e:
        logger.error(f"HTDAG Planner failed: {e}")
        state['error_count'] += 1
        raise  # LangGraph will retry

def halo_router_node(state: AgentState) -> AgentState:
    """
    HALO routing node with retry logic.

    Retry Policy: 2 attempts, linear backoff
    """
    from infrastructure.halo_router import HALORouter

    logger.info(f"HALO Router: Routing {len(state['decomposed_tasks'])} tasks")

    try:
        router = HALORouter()
        routed = router.route_tasks(state['decomposed_tasks'])

        state['routed_agents'] = routed
        state['metadata']['halo_duration_ms'] = routed.get('duration_ms', 0)

        logger.info(f"HALO Router: Assigned {len(routed['assignments'])} agents")
        return state

    except Exception as e:
        logger.error(f"HALO Router failed: {e}")
        state['error_count'] += 1
        raise

def execute_task_node(state: AgentState) -> AgentState:
    """
    Execute tasks with assigned agents.

    Retry Policy: Per-task retry (3 attempts)
    Parallelization: Up to 5 concurrent tasks
    """
    from infrastructure.task_executor import TaskExecutor

    logger.info(f"Task Executor: Running {len(state['routed_agents'])} tasks")

    try:
        executor = TaskExecutor(max_parallel=5)
        results = executor.execute_all(state['routed_agents'])

        state['execution_results'] = results
        state['metadata']['execution_duration_ms'] = sum(
            r.get('duration_ms', 0) for r in results
        )

        logger.info(f"Task Executor: Completed {len(results)} tasks")
        return state

    except Exception as e:
        logger.error(f"Task Executor failed: {e}")
        state['error_count'] += 1
        raise

def safety_check_node(state: AgentState) -> AgentState:
    """
    WaltzRL safety check node.

    Retry Policy: No retry (safety is critical)
    Blocking: Critical issues block execution
    """
    from infrastructure.safety.waltzrl_wrapper import get_waltzrl_safety_wrapper

    logger.info("Safety Check: Analyzing execution results")

    try:
        wrapper = get_waltzrl_safety_wrapper()

        checks = []
        for result in state['execution_results']:
            check = wrapper.wrap_agent_response(
                agent_name=result['agent'],
                query=state['query'],
                response=result['output']
            )
            checks.append({
                'agent': result['agent'],
                'safety_score': check.safety_score,
                'blocked': check.blocked,
                'issues': len(check.feedback.issues_found)
            })

        state['safety_checks'] = checks

        # Block if any critical issues
        if any(c['blocked'] for c in checks):
            logger.warning("Safety Check: BLOCKED due to critical issues")
            state['final_output'] = "Response blocked due to safety concerns."
            return state

        logger.info(f"Safety Check: All {len(checks)} checks passed")
        return state

    except Exception as e:
        logger.error(f"Safety Check failed: {e}")
        state['error_count'] += 1
        # Don't raise - fail gracefully for safety checks
        return state

def critic_agent_node(state: AgentState) -> AgentState:
    """
    Critic agent provides feedback on results.

    Retry Policy: 1 attempt (critic is optional)
    """
    logger.info("Critic Agent: Reviewing execution results")

    try:
        # TODO: Implement critic agent logic
        state['critic_feedback'] = [
            "Results meet quality standards",
            "All tasks completed successfully"
        ]

        logger.info(f"Critic Agent: Generated {len(state['critic_feedback'])} feedback items")
        return state

    except Exception as e:
        logger.warning(f"Critic Agent failed (non-critical): {e}")
        state['critic_feedback'] = []
        return state

def finalize_output_node(state: AgentState) -> AgentState:
    """
    Aggregate results and generate final output.

    No retry policy (final step)
    """
    logger.info("Finalizing output from execution results")

    try:
        # Aggregate results
        outputs = [r['output'] for r in state['execution_results']]
        state['final_output'] = "\n\n".join(outputs)

        logger.info(f"Finalized output: {len(state['final_output'])} chars")
        return state

    except Exception as e:
        logger.error(f"Output finalization failed: {e}")
        state['final_output'] = "Error: Unable to finalize output"
        return state

# Build LangGraph
def build_genesis_graph():
    """Build LangGraph for Genesis orchestration"""

    # Create graph
    graph = StateGraph(AgentState)

    # Add nodes
    graph.add_node("htdag_planner", htdag_planner_node)
    graph.add_node("halo_router", halo_router_node)
    graph.add_node("execute_tasks", execute_task_node)
    graph.add_node("safety_check", safety_check_node)
    graph.add_node("critic_agent", critic_agent_node)
    graph.add_node("finalize_output", finalize_output_node)

    # Add edges (flow)
    graph.set_entry_point("htdag_planner")
    graph.add_edge("htdag_planner", "halo_router")
    graph.add_edge("halo_router", "execute_tasks")
    graph.add_edge("execute_tasks", "safety_check")
    graph.add_edge("safety_check", "critic_agent")
    graph.add_edge("critic_agent", "finalize_output")
    graph.add_edge("finalize_output", END)

    # Add conditional edges (error handling)
    def check_errors(state: AgentState) -> str:
        """Route to error handler if too many errors"""
        if state['error_count'] > 5:
            return "error_handler"
        return "continue"

    # TODO: Add error handling node

    # Compile graph with persistence
    from config.langgraph_config import get_langgraph_store

    checkpointer = SqliteSaver.from_conn_string(
        "/home/genesis/genesis-rebuild/data/langgraph_checkpoints.db"
    )

    compiled_graph = graph.compile(checkpointer=checkpointer)

    logger.info("LangGraph compiled successfully")
    return compiled_graph

# Usage
def run_genesis_orchestration(query: str, thread_id: str):
    """
    Run Genesis orchestration with LangGraph.

    Args:
        query: User query to process
        thread_id: Unique thread ID for resumability
    """
    graph = build_genesis_graph()

    # Initial state
    initial_state = {
        "query": query,
        "decomposed_tasks": [],
        "routed_agents": [],
        "execution_results": [],
        "safety_checks": [],
        "critic_feedback": [],
        "final_output": "",
        "error_count": 0,
        "retry_count": 0,
        "metadata": {}
    }

    # Run graph with checkpointing
    config = {"configurable": {"thread_id": thread_id}}

    try:
        for state in graph.stream(initial_state, config):
            logger.info(f"Graph state: {state}")

        # Get final state
        final_state = graph.get_state(config)
        return final_state.values['final_output']

    except Exception as e:
        logger.error(f"Graph execution failed: {e}")

        # Resume from checkpoint
        logger.info(f"Resuming from checkpoint for thread {thread_id}")
        final_state = graph.get_state(config)

        # Continue from last successful node
        for state in graph.stream(None, config):
            logger.info(f"Resumed state: {state}")

        return graph.get_state(config).values['final_output']
```

**Deliverables:**
- LangGraph orchestrator module
- State schema definitions
- Node retry policies
- Checkpoint persistence setup

---

#### Phase 3: Add OTEL Tracing for Each Node (Week 3, 8 hours)

```python
# Add to each node function:

from infrastructure.observability import ObservabilityManager, SpanType

def htdag_planner_node(state: AgentState) -> AgentState:
    obs_manager = ObservabilityManager()

    with obs_manager.span(
        "langgraph.htdag_planner",
        SpanType.ORCHESTRATION,
        attributes={
            "query": state['query'][:100],
            "retry_count": state['retry_count']
        }
    ):
        # ... existing code ...
```

**Deliverables:**
- OTEL tracing for all nodes
- Grafana dashboard for LangGraph execution
- Performance metrics per node

---

### Success Criteria

- [ ] ✅ LangGraph graph defined for all 19 agents
- [ ] ✅ State persistence with SQLite/S3
- [ ] ✅ Node-level retry policies configured
- [ ] ✅ Checkpoint resumability tested
- [ ] ✅ OTEL tracing for all nodes
- [ ] ✅ Grafana dashboard showing graph execution
- [ ] ✅ 95% reduction in progress loss on crashes

### Expected Impact

- **Resilience:** 95% reduction in progress loss on crashes
- **Debuggability:** 80% faster root cause analysis
- **Long-Horizon Tasks:** Support for multi-hour/multi-day orchestrations
- **Observability:** Full visibility into graph execution

### Resources

- **Reference:** [LangChain DeepAgents Blog](https://blog.langchain.com/doubling-down-on-deepagents/)
- **Documentation:** https://langchain-ai.github.io/langgraph/
- **LangGraph Store:** https://langchain-ai.github.io/langgraph/reference/store/

---

## Addition 3: Research & Trend Radar Pipeline (RDR)

### Problem Statement
- **Current Issue:** Noisy research landscape, random upgrade decisions
- **Impact:** Wasted time on irrelevant papers, missed critical innovations
- **Root Cause:** No systematic research filtering/prioritization

### Solution: Automated Research Pipeline with Perspective Embeddings

**Key Components:**
1. **Weekly Crawl** (arXiv, Papers with Code, GitHub trending)
2. **Filter by Relevance** (Genesis-specific keywords)
3. **Embed with Perspective Schema** (I-M-O-W-R framework)
4. **Cluster & Rank** (identify trends, prioritize for prototyping)

### RDR Perspective Schema (arXiv:2510.20809)

**I-M-O-W-R Framework:**
- **I (Input):** What data/inputs does the method require?
- **M (Method):** What algorithm/approach does it use?
- **O (Output):** What does it produce?
- **W (Why):** What problem does it solve?
- **R (Results):** What performance gains does it show?

### Implementation Plan

#### Phase 1: Research Crawler Setup (Week 3, 12 hours)

```python
# /home/genesis/genesis-rebuild/infrastructure/research_radar/crawler.py

import arxiv
import requests
from datetime import datetime, timedelta
from typing import List, Dict
import logging

logger = logging.getLogger(__name__)

class ResearchCrawler:
    """Crawl arXiv and Papers with Code for relevant papers"""

    GENESIS_KEYWORDS = [
        "multi-agent systems",
        "agent orchestration",
        "self-improving agents",
        "agent communication",
        "agent safety",
        "reinforcement learning agents",
        "tool-augmented agents",
        "agent reasoning",
        "collaborative agents"
    ]

    def crawl_arxiv(self, days_back: int = 7) -> List[Dict]:
        """
        Crawl arXiv for papers matching Genesis keywords.

        Args:
            days_back: How many days to look back

        Returns:
            List of papers with metadata
        """
        logger.info(f"Crawling arXiv for papers from last {days_back} days")

        papers = []
        cutoff_date = datetime.now() - timedelta(days=days_back)

        for keyword in self.GENESIS_KEYWORDS:
            search = arxiv.Search(
                query=keyword,
                max_results=50,
                sort_by=arxiv.SortCriterion.SubmittedDate
            )

            for result in search.results():
                if result.published >= cutoff_date:
                    papers.append({
                        'title': result.title,
                        'abstract': result.summary,
                        'authors': [a.name for a in result.authors],
                        'published': result.published.isoformat(),
                        'url': result.entry_id,
                        'keywords': [keyword],
                        'source': 'arxiv'
                    })

        logger.info(f"Found {len(papers)} papers from arXiv")
        return papers

    def crawl_papers_with_code(self) -> List[Dict]:
        """
        Crawl Papers with Code trending page.

        Returns:
            List of papers with code implementations
        """
        logger.info("Crawling Papers with Code trending")

        response = requests.get(
            'https://paperswithcode.com/api/v1/papers/',
            params={'ordering': '-github_stars'}
        )

        if response.status_code != 200:
            logger.error(f"Papers with Code API failed: {response.status_code}")
            return []

        data = response.json()
        papers = []

        for item in data.get('results', [])[:50]:
            # Filter for Genesis-relevant papers
            abstract = item.get('abstract', '').lower()
            title = item.get('title', '').lower()

            if any(kw.lower() in abstract or kw.lower() in title
                   for kw in self.GENESIS_KEYWORDS):
                papers.append({
                    'title': item.get('title'),
                    'abstract': item.get('abstract'),
                    'authors': [],  # Not available in API
                    'published': item.get('published'),
                    'url': item.get('url_abs'),
                    'code_url': item.get('official_url'),
                    'github_stars': item.get('github_stars', 0),
                    'source': 'paperswithcode'
                })

        logger.info(f"Found {len(papers)} papers from Papers with Code")
        return papers

    def crawl_github_trending(self) -> List[Dict]:
        """
        Crawl GitHub trending repos related to agents.

        Returns:
            List of trending repos
        """
        logger.info("Crawling GitHub trending repos")

        # Use GitHub Search API
        response = requests.get(
            'https://api.github.com/search/repositories',
            params={
                'q': 'agent OR agents OR multi-agent',
                'sort': 'stars',
                'order': 'desc',
                'per_page': 50
            },
            headers={'Accept': 'application/vnd.github.v3+json'}
        )

        if response.status_code != 200:
            logger.error(f"GitHub API failed: {response.status_code}")
            return []

        data = response.json()
        repos = []

        for item in data.get('items', []):
            repos.append({
                'title': item['name'],
                'description': item.get('description', ''),
                'url': item['html_url'],
                'stars': item['stargazers_count'],
                'language': item.get('language'),
                'topics': item.get('topics', []),
                'source': 'github'
            })

        logger.info(f"Found {len(repos)} trending repos from GitHub")
        return repos

    def crawl_all(self) -> Dict[str, List[Dict]]:
        """
        Crawl all sources and return aggregated results.

        Returns:
            Dict with papers/repos from each source
        """
        return {
            'arxiv': self.crawl_arxiv(),
            'paperswithcode': self.crawl_papers_with_code(),
            'github': self.crawl_github_trending()
        }
```

**Deliverables:**
- Research crawler module
- Weekly cron job setup
- Crawled data stored in CaseBank

---

#### Phase 2: RDR Perspective Embeddings (Week 3, 16 hours)

```python
# /home/genesis/genesis-rebuild/infrastructure/research_radar/embedder.py

from sentence_transformers import SentenceTransformer
from typing import List, Dict
import numpy as np
import logging

logger = logging.getLogger(__name__)

class RDRPerspectiveEmbedder:
    """
    Embed research papers using RDR perspective schema.

    RDR Perspectives (I-M-O-W-R):
    - Input: What data/inputs are required?
    - Method: What algorithm/approach is used?
    - Output: What does it produce?
    - Why: What problem does it solve?
    - Results: What performance gains?
    """

    def __init__(self, model_name: str = 'all-MiniLM-L6-v2'):
        """Initialize embedder with sentence transformer"""
        self.model = SentenceTransformer(model_name)
        logger.info(f"Loaded embedding model: {model_name}")

    def extract_perspectives(self, paper: Dict) -> Dict[str, str]:
        """
        Extract RDR perspectives from paper abstract using LLM.

        Args:
            paper: Paper dict with title/abstract

        Returns:
            Dict with I-M-O-W-R perspectives
        """
        from infrastructure.llm_client import LLMClient

        llm = LLMClient()

        prompt = f"""
        Analyze this research paper and extract the following perspectives:

        Title: {paper['title']}
        Abstract: {paper['abstract']}

        Extract:
        1. INPUT: What data or inputs does this method require?
        2. METHOD: What algorithm or approach does it use?
        3. OUTPUT: What does it produce?
        4. WHY: What problem does it solve?
        5. RESULTS: What performance gains does it show?

        Return as JSON with keys: input, method, output, why, results
        Each value should be 1-2 sentences.
        """

        response = llm.generate(
            prompt=prompt,
            model="gpt-4o-mini",  # Cheap model for extraction
            response_format={"type": "json_object"}
        )

        return response

    def embed_perspectives(self, perspectives: Dict[str, str]) -> np.ndarray:
        """
        Embed RDR perspectives into vector space.

        Args:
            perspectives: Dict with I-M-O-W-R perspectives

        Returns:
            512-dim embedding vector
        """
        # Concatenate all perspectives
        text = " ".join([
            f"Input: {perspectives.get('input', '')}",
            f"Method: {perspectives.get('method', '')}",
            f"Output: {perspectives.get('output', '')}",
            f"Why: {perspectives.get('why', '')}",
            f"Results: {perspectives.get('results', '')}"
        ])

        # Generate embedding
        embedding = self.model.encode(text, normalize_embeddings=True)
        return embedding

    def process_paper(self, paper: Dict) -> Dict:
        """
        Process paper through full RDR pipeline.

        Args:
            paper: Paper dict from crawler

        Returns:
            Paper dict with perspectives and embedding
        """
        logger.info(f"Processing paper: {paper['title'][:50]}...")

        # Extract perspectives
        perspectives = self.extract_perspectives(paper)

        # Generate embedding
        embedding = self.embed_perspectives(perspectives)

        # Add to paper dict
        paper['perspectives'] = perspectives
        paper['embedding'] = embedding.tolist()

        return paper

    def process_batch(self, papers: List[Dict]) -> List[Dict]:
        """
        Process batch of papers.

        Args:
            papers: List of paper dicts

        Returns:
            List of processed papers with perspectives/embeddings
        """
        logger.info(f"Processing {len(papers)} papers...")

        processed = []
        for paper in papers:
            try:
                processed_paper = self.process_paper(paper)
                processed.append(processed_paper)
            except Exception as e:
                logger.error(f"Failed to process paper '{paper['title']}': {e}")

        logger.info(f"Successfully processed {len(processed)}/{len(papers)} papers")
        return processed
```

**Deliverables:**
- RDR perspective extraction
- Embedding generation
- Processed papers stored in CaseBank

---

#### Phase 3: Clustering & Trend Detection (Week 4, 12 hours)

```python
# /home/genesis/genesis-rebuild/infrastructure/research_radar/clusterer.py

from sklearn.cluster import DBSCAN, KMeans
from sklearn.decomposition import PCA
import numpy as np
from typing import List, Dict
import logging

logger = logging.getLogger(__name__)

class ResearchClusterer:
    """Cluster research papers and detect trends"""

    def cluster_papers(
        self,
        papers: List[Dict],
        method: str = 'dbscan',
        n_clusters: int = 10
    ) -> Dict[int, List[Dict]]:
        """
        Cluster papers based on embeddings.

        Args:
            papers: List of papers with embeddings
            method: Clustering method ('dbscan' or 'kmeans')
            n_clusters: Number of clusters (for kmeans)

        Returns:
            Dict mapping cluster_id to list of papers
        """
        logger.info(f"Clustering {len(papers)} papers with {method}")

        # Extract embeddings
        embeddings = np.array([p['embedding'] for p in papers])

        # Cluster
        if method == 'dbscan':
            clusterer = DBSCAN(eps=0.3, min_samples=2, metric='cosine')
        else:
            clusterer = KMeans(n_clusters=n_clusters, random_state=42)

        labels = clusterer.fit_predict(embeddings)

        # Group papers by cluster
        clusters = {}
        for paper, label in zip(papers, labels):
            if label not in clusters:
                clusters[label] = []
            clusters[label].append(paper)

        logger.info(f"Found {len(clusters)} clusters")
        return clusters

    def detect_trends(self, clusters: Dict[int, List[Dict]]) -> List[Dict]:
        """
        Detect trending research topics.

        Args:
            clusters: Dict of clustered papers

        Returns:
            List of trend dicts with metadata
        """
        trends = []

        for cluster_id, papers in clusters.items():
            if len(papers) < 2:
                continue

            # Analyze cluster
            trend = {
                'cluster_id': cluster_id,
                'paper_count': len(papers),
                'trend_score': self._calculate_trend_score(papers),
                'keywords': self._extract_common_keywords(papers),
                'representative_papers': papers[:3],  # Top 3 papers
                'relevance_to_genesis': self._score_genesis_relevance(papers)
            }

            trends.append(trend)

        # Sort by relevance
        trends.sort(key=lambda t: t['relevance_to_genesis'], reverse=True)

        logger.info(f"Detected {len(trends)} research trends")
        return trends

    def _calculate_trend_score(self, papers: List[Dict]) -> float:
        """Calculate trend momentum score"""
        # Recent papers = higher score
        recent_count = sum(1 for p in papers
                          if 'published' in p and
                          (datetime.now() - datetime.fromisoformat(p['published'])).days < 30)

        # GitHub stars (if available)
        total_stars = sum(p.get('github_stars', 0) for p in papers)

        # Combine metrics
        score = (recent_count * 2) + (total_stars / 100)
        return score

    def _extract_common_keywords(self, papers: List[Dict]) -> List[str]:
        """Extract most common keywords across cluster"""
        from collections import Counter

        all_keywords = []
        for paper in papers:
            if 'keywords' in paper:
                all_keywords.extend(paper['keywords'])
            if 'topics' in paper:
                all_keywords.extend(paper['topics'])

        # Get top 5 most common
        counter = Counter(all_keywords)
        return [kw for kw, _ in counter.most_common(5)]

    def _score_genesis_relevance(self, papers: List[Dict]) -> float:
        """Score how relevant this cluster is to Genesis"""
        # Check for Genesis-specific keywords
        genesis_terms = [
            'multi-agent', 'orchestration', 'self-improving',
            'agent communication', 'agent safety', 'tool-augmented'
        ]

        relevance = 0
        for paper in papers:
            text = f"{paper.get('title', '')} {paper.get('abstract', '')}".lower()
            relevance += sum(1 for term in genesis_terms if term in text)

        # Normalize by cluster size
        return relevance / len(papers)
```

**Deliverables:**
- Clustering algorithm
- Trend detection logic
- "What to Prototype Next" dashboard

---

#### Phase 4: Weekly Automation + Dashboard (Week 4, 8 hours)

```bash
# /home/genesis/genesis-rebuild/scripts/run_research_radar.sh

#!/bin/bash
# Weekly research radar pipeline

set -e

echo "🔬 Genesis Research Radar - $(date)"

# 1. Crawl research sources
echo "📡 Crawling research sources..."
python3 -m infrastructure.research_radar.crawler

# 2. Extract perspectives and embed
echo "🧠 Extracting RDR perspectives..."
python3 -m infrastructure.research_radar.embedder

# 3. Cluster and detect trends
echo "📊 Clustering and detecting trends..."
python3 -m infrastructure.research_radar.clusterer

# 4. Generate dashboard
echo "📈 Generating dashboard..."
python3 -m infrastructure.research_radar.dashboard

echo "✅ Research Radar complete!"
```

**Cron Job:**
```bash
# Run every Monday at 9 AM
0 9 * * 1 /home/genesis/genesis-rebuild/scripts/run_research_radar.sh >> /home/genesis/genesis-rebuild/logs/research_radar.log 2>&1
```

**Dashboard Output:**
```markdown
# Genesis Research Radar - Week of Oct 29, 2025

## 🔥 Top Trends This Week

### Trend 1: Multi-Agent Reinforcement Learning (Relevance: 9.2/10)
- **Papers:** 12 papers this week
- **Momentum:** ⬆️ High (8 papers in last 30 days)
- **Keywords:** multi-agent RL, cooperative agents, emergent behavior
- **Top Papers:**
  1. "Scalable Multi-Agent RL with Emergent Communication" (arXiv:2510.xxxxx)
  2. "Cooperative Multi-Agent Learning via Shared Rewards" (arXiv:2510.xxxxx)
  3. "Multi-Agent RL for Distributed Systems" (arXiv:2510.xxxxx)
- **Prototype Priority:** HIGH ⭐⭐⭐
- **Integration Point:** Layer 5 (Swarm Optimization)

### Trend 2: Agent Safety Frameworks (Relevance: 8.7/10)
- **Papers:** 8 papers this week
- **Momentum:** ⬆️ Medium
- **Keywords:** agent safety, alignment, jailbreak prevention
- **Top Papers:**
  1. "Adversarial Robustness in Multi-Agent Systems" (arXiv:2510.xxxxx)
  2. "Safe Agent Communication Protocols" (arXiv:2510.xxxxx)
- **Prototype Priority:** MEDIUM ⭐⭐
- **Integration Point:** WaltzRL enhancement

### Trend 3: Tool-Augmented Agents (Relevance: 8.1/10)
- **Papers:** 6 papers this week
- **Momentum:** → Stable
- **Keywords:** tool learning, API integration, external tools
- **Top Papers:**
  1. "Adaptive Tool Selection for LLM Agents" (arXiv:2510.xxxxx)
- **Prototype Priority:** LOW ⭐
- **Integration Point:** Current AATC system

## 📅 Next Week Action Items
1. Prototype multi-agent RL for Swarm layer (Trend 1)
2. Read top 3 papers from Trend 1 for implementation details
3. Evaluate safety frameworks from Trend 2 for WaltzRL integration
```

**Deliverables:**
- Weekly automation script
- Cron job setup
- Dashboard generation
- Integration with Grafana (optional)

---

### Success Criteria

- [ ] ✅ Weekly crawl of arXiv, Papers with Code, GitHub
- [ ] ✅ RDR perspective extraction (I-M-O-W-R)
- [ ] ✅ Clustering and trend detection
- [ ] ✅ "What to Prototype Next" dashboard
- [ ] ✅ Automated weekly reports
- [ ] ✅ Integration with CaseBank for memory
- [ ] ✅ 70% reduction in irrelevant research noise

### Expected Impact

- **Research Efficiency:** 70% reduction in time spent on irrelevant papers
- **Prioritization:** Clear "what to prototype next" guidance
- **Trend Awareness:** Automated detection of emerging techniques
- **ROI:** 50% better research-to-implementation conversion

### Resources

- **Reference:** [RDR Paper (arXiv:2510.20809)](https://arxiv.org/pdf/2510.20809)
- **Tool:** sentence-transformers (embeddings)
- **Tool:** scikit-learn (clustering)
- **Tool:** arxiv Python library

---

## Addition 4-7: Quick Overview

### Addition 4: Multimodal Eval Harness
**Timeline:** Week 4, 16 hours
**Goal:** Gate VLM/video/model changes with eval runs
**Impact:** Prevent regressions in screenshot/UI/video loops

### Addition 5: DiscoRL Integration
**Timeline:** Week 4-5, 20 hours
**Goal:** Auto-discover optimal learning loop update rules
**Impact:** 30% faster learning convergence

### Addition 6: Runbook Publishing
**Timeline:** Week 4, 12 hours
**Goal:** Publish internal checklists for agent citation
**Impact:** 50% faster incident resolution

### Addition 7: Public Demo Page
**Timeline:** Week 5, 8 hours (optional)
**Goal:** Transparent research trace publishing
**Impact:** External stakeholder visibility

---

## Overall Timeline

### Week 2 (Nov 4-8):
- Addition 1 Phase 1-2: API audit + OpenAPI specs (48 hours)
- Addition 2 Phase 1: LangGraph setup (4 hours)
- Addition 3 Phase 1: Research crawler (12 hours)

### Week 3 (Nov 11-15):
- Addition 1 Phase 3-4: Error handling + contract tests (36 hours)
- Addition 2 Phase 2: LangGraph implementation (32 hours)
- Addition 3 Phase 2-3: RDR embeddings + clustering (28 hours)

### Week 4 (Nov 18-22):
- Addition 2 Phase 3: OTEL tracing (8 hours)
- Addition 3 Phase 4: Automation + dashboard (8 hours)
- Addition 4: Multimodal eval harness (16 hours)
- Addition 6: Runbook publishing (12 hours)

### Week 5 (Nov 25-29):
- Addition 5: DiscoRL integration (20 hours)
- Addition 7: Public demo page (8 hours, optional)
- Buffer for testing and documentation

---

## Total Effort Estimate

| Addition | Effort (Hours) | Priority | Week |
|----------|----------------|----------|------|
| 1. AI-Ready APIs | 84 | HIGH | 2-3 |
| 2. LangGraph Migration | 44 | HIGH | 2-4 |
| 3. Research Radar | 48 | MEDIUM | 2-4 |
| 4. Eval Harness | 16 | MEDIUM | 4 |
| 5. DiscoRL | 20 | LOW | 4-5 |
| 6. Runbooks | 12 | MEDIUM | 4 |
| 7. Demo Page | 8 | LOW | 5 |
| **Total** | **232** | | **2-5** |

**Team Size:** 1-2 developers
**Timeline:** 4-5 weeks (post-deployment)
**Dependencies:** None (all additions are independent)

---

## Success Metrics

### Technical Metrics:
- **API Reliability:** 60% reduction in tool-calling failures
- **Orchestration Resilience:** 95% reduction in progress loss
- **Research Efficiency:** 70% reduction in irrelevant research time
- **Eval Coverage:** 100% multimodal tasks covered
- **Learning Speed:** 30% faster convergence
- **Incident Resolution:** 50% faster fixes

### Business Metrics:
- **Developer Productivity:** 40% faster API integration
- **System Uptime:** 99.5% → 99.9%
- **Research ROI:** 50% better paper-to-prototype conversion
- **Support Efficiency:** 50% faster incident resolution

---

## Risk Assessment

### High Risk:
- **LangGraph Migration:** May require significant refactoring (mitigate: incremental adoption)
- **RDR Embedding Costs:** LLM calls for 50-100 papers/week (mitigate: use GPT-4o-mini)

### Medium Risk:
- **API Contract Tests:** May find many existing issues (mitigate: prioritize by severity)
- **DiscoRL Complexity:** Single-agent focused, may not apply well (mitigate: start small)

### Low Risk:
- **Runbook Publishing:** Straightforward documentation task
- **Demo Page:** Optional, no production impact

---

## Next Steps

1. **Review this document** with team
2. **Prioritize additions** based on immediate needs
3. **Assign owners** for each addition
4. **Create tracking tickets** in project management tool
5. **Start with Addition 1** (AI-Ready APIs) - highest ROI

---

## Questions?

Contact:
- **Technical Lead:** [Your Name]
- **Project Manager:** [PM Name]
- **Documentation:** This file + linked resources

**Last Updated:** October 29, 2025
**Status:** Ready for team review
