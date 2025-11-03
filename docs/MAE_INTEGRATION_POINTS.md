# Multi-Agent Evolve: Genesis System Integration Points

**Date:** November 3, 2025
**Author:** Cora (Orchestration Specialist)
**Status:** Phase 1 - Analysis Complete

## Executive Summary

This document identifies the specific integration points between the Multi-Agent Evolve orchestration layer and the existing Genesis system (HTDAG, HALO Router, Swarm Coordinator, A2A).

**Key Finding:** MAE integrates at **Layer 2.5** in the Genesis orchestration stack, positioned between HALO routing decisions and task execution.

---

## 1. Current Genesis Orchestration Stack

### Layer 1: HTDAG (Hierarchical Task Decomposition)

**File:** `/home/genesis/genesis-rebuild/infrastructure/htdag_decomposer.py`

**Purpose:** Breaks down complex tasks into dependency graphs (DAGs)

**Output Structure:**
```python
from infrastructure.task_dag import Task, TaskStatus

@dataclass
class Task:
    id: str
    description: str
    agent: Optional[str]  # Can be assigned by HALO
    dependencies: List[str]  # Task IDs this depends on
    status: TaskStatus  # pending, running, complete, failed
    result: Optional[Any]
```

**Integration Point #1: Input to MAE**
```
HTDAG Output (Task DAG)
    ↓
HALO Router (assign agents)
    ↓
MAE Workflow ← Input: task + assigned agents
```

---

### Layer 2: HALO Router (Agent Selection)

**File:** `/home/genesis/genesis-rebuild/infrastructure/halo_router.py`

**Purpose:** Route tasks to appropriate agents based on declarative rules and capabilities

**Key Classes:**
```python
@dataclass
class RoutingRule:
    """Declarative IF-THEN rule for agent selection"""
    rule_id: str
    condition: Dict[str, Any]  # Task properties to match
    target_agent: str
    priority: int
    explanation: str

@dataclass
class RoutingPlan:
    """Complete routing assignment"""
    assignments: Dict[str, str]  # task_id -> agent_name
    explanations: Dict[str, str]  # task_id -> reasoning
    unassigned_tasks: List[str]
    metadata: Dict[str, Any]  # For optimization

class HALORouter:
    def plan_routing(self, task_dag: TaskDAG) -> RoutingPlan:
        """Assign agents to all tasks in DAG"""
        # 1. Apply declarative rules (priority order)
        # 2. Fall back to capability-based matching
        # 3. Load balancing across agents
        # Returns RoutingPlan with full assignments
```

**Key Integration Methods:**
```python
class HALORouter:
    async def route_task(self, task: Task) -> str:
        """Route single task, return agent name"""

    async def plan_routing(self, dag: TaskDAG) -> RoutingPlan:
        """Plan routing for entire DAG"""

    def validate_team(self, agents: List[str]) -> TeamValidationResult:
        """Validate proposed agent team"""

    async def execute_routing(self, plan: RoutingPlan) -> ExecutionResult:
        """Execute routing plan (optional)"""
```

**CaseBank Integration:**
- HALO can learn from past routing decisions
- MAE results should feed back to CaseBank
- Pattern: "solver + verifier agents → high convergence"

**Integration Point #2: Agent Assignment**
```
Task + assigned agents → MAE Workflow
```

---

### Layer 2.5: Multi-Agent Evolve (NEW)

**Proposed File:** `/home/genesis/genesis-rebuild/infrastructure/evolution/multi_agent_evolve_workflow.py`

**Purpose:** Iteratively improve solutions through parallel solver/verifier agents

**Proposed Architecture:**
```python
class MAEWorkflowState(TypedDict):
    """Shared state for evolution"""
    task_id: str
    solver_agents: List[str]  # Agents that generate solutions
    verifier_agents: List[str]  # Agents that validate solutions
    generated_solutions: Annotated[list, add_messages]
    verification_results: dict
    rewards: dict
    best_solution: Optional[dict]
    best_score: float
    convergence_criteria_met: bool

async def build_mae_graph() -> CompiledGraph:
    """Build LangGraph StateGraph for evolution"""
    # Nodes: init, solver_generate, verifier_validate, compute_rewards, check_convergence
    # Edges: state transitions with routing based on convergence

async def execute_mae(
    task: Task,
    solver_agents: List[str],
    verifier_agents: List[str],
    max_iterations: int = 5
) -> Dict[str, Any]:
    """Execute evolution workflow"""
```

**Integration Point #3: Data Flow**
- Input: HALO-assigned agents
- Output: Evolved solution + metrics
- Callback: Results → CaseBank (learning)
- Error handling: Fallback to single-pass execution

---

### Layer 3: Swarm Coordinator (Team Optimization)

**File:** `/home/genesis/genesis-rebuild/infrastructure/orchestration/swarm_coordinator.py`

**Purpose:** Optimize team composition using PSO (Particle Swarm Optimization)

**Key Classes:**
```python
class SwarmCoordinator:
    async def generate_optimal_team(self, task: Task) -> List[str]:
        """PSO-optimized team for task"""
        # Uses Inclusive Fitness model
        # Returns ordered list of agents

    async def execute_team(self, team: List[str], task: Task) -> TeamExecutionResult:
        """Execute task with optimized team"""

@dataclass
class TeamExecutionResult:
    task_id: str
    team: List[str]
    status: str  # "completed", "failed", "partial"
    individual_results: List[Dict]
    combined_output: Dict
    execution_time: float
    errors: List[str]
```

**Integration Point #4: Post-Evolution**
```
MAE Output → Swarm Coordinator
    ↓
Optimal team for execution
    ↓
Execute refined task
```

---

### Layer 4: Agent-to-Agent Communication (A2A)

**File:** `/home/genesis/genesis-rebuild/infrastructure/a2a_connector.py`

**Purpose:** Enable agents to discover and communicate with each other

**Key Functions:**
```python
class A2AConnector:
    async def discover_agents(self) -> List[AgentCard]:
        """Find available agents"""

    async def send_message(self, from_agent: str, to_agent: str, message: dict) -> dict:
        """Send structured message between agents"""

    async def call_agent(self, agent_name: str, task: dict, tools: List) -> str:
        """Invoke agent with task and tools"""
```

**Integration Point #5: Agent Discovery**
- MAE needs to verify solver/verifier agents are available
- A2A used for inter-agent verification communication
- Pattern: Verifier agent calls other agents for dependency checks

---

## 2. Integration Architecture Diagram

```
User Request
    ↓
[Layer 1] HTDAG Decomposer
    ├─ Decompose task into DAG
    ├─ Detect dependencies & cycles
    └─ Output: Task DAG
    ↓
[Layer 2] HALO Router
    ├─ Load routing rules (30+ rules)
    ├─ Capability-based matching
    ├─ Load balancing
    └─ Output: RoutingPlan (task_id → agent)
    ↓
[Feature Flag Check]
    └─ ENABLE_MULTI_AGENT_EVOLVE?
         ├─ YES → Continue to MAE
         └─ NO → Skip to Layer 3
    ↓
[Layer 2.5] Multi-Agent Evolve (NEW)
    ├─ Input: Task + assigned agents
    ├─ Solver phase: Generate solutions (parallel workers)
    ├─ Verifier phase: Validate solutions (parallel)
    ├─ Compute rewards: Fitness evaluation
    ├─ Check convergence: Loop or exit
    ├─ Update memory: Archive elite solutions
    └─ Output: Evolved solution + metrics
    ↓
[Layer 3] Swarm Coordinator
    ├─ Generate optimal team (PSO)
    ├─ Execute refined task
    └─ Output: TeamExecutionResult
    ↓
[Layer 4] A2A Communication
    ├─ Agent discovery
    ├─ Inter-agent coordination
    └─ Result aggregation
    ↓
Response
```

---

## 3. Specific Integration Points

### 3.1 Input Interface: HALO Router → MAE

**When MAE is enabled:**
```python
class HALORouter:
    async def route_task(self, task: Task) -> Union[str, Dict]:
        """
        Route task to agent or MAE workflow

        Returns:
            - If MAE eligible: {"type": "mae", "workflow": ..., "agents": [...]}
            - Otherwise: agent_name (string)
        """
        # Check if task benefits from evolution
        if self._should_evolve(task):
            # Determine solver agents (generate solutions)
            solver_agents = self._select_solver_agents(task)

            # Determine verifier agents (validate solutions)
            verifier_agents = self._select_verifier_agents(task)

            # Create MAE workflow
            mae_result = await self._execute_mae_workflow(
                task=task,
                solver_agents=solver_agents,
                verifier_agents=verifier_agents
            )

            return {
                "type": "mae",
                "evolved_solution": mae_result["best_solution"],
                "score": mae_result["best_score"],
                "iterations": mae_result["iterations"],
                "metrics": mae_result["metrics"]
            }

        # Fall through to normal routing
        return await self._route_to_agent(task)
```

**Conditions for MAE eligibility:**
```python
def _should_evolve(self, task: Task) -> bool:
    """Determine if task benefits from evolution"""
    # Criteria:
    # 1. Task is complex (multiple subtasks)
    # 2. Quality matters more than speed
    # 3. Solver + verifier agents available
    # 4. Feature flag enabled
    # 5. Previous similar task benefited from MAE (CaseBank)

    return (
        self.feature_flags["ENABLE_MULTI_AGENT_EVOLVE"] and
        task.complexity_score > 0.6 and
        self._has_solver_agents(task) and
        self._has_verifier_agents(task) and
        not self.feature_flags.get("MAE_DISABLE_FOR_TASK_TYPE", {}).get(task.type)
    )
```

**Key parameters from HALO:**
- `task`: Complete task description and metadata
- `solver_agents`: Pre-selected agents for generation
- `verifier_agents`: Pre-selected agents for validation
- `execution_constraints`: Max time, budget, etc.

### 3.2 State Synchronization: Shared WorkflowState

**LangGraph State Integration:**
```python
# MAE workflow state
from typing import Annotated
from langgraph.graph.message import add_messages
from typing_extensions import TypedDict

class MAEWorkflowState(TypedDict):
    # Task context (from HALO)
    task_id: str
    task_description: str
    solver_agents: List[str]  # From HALO assignment
    verifier_agents: List[str]  # From HALO assignment

    # Evolution progress
    current_iteration: int
    max_iterations: int

    # Solutions (accumulated via reducer)
    generated_solutions: Annotated[list, add_messages]
    verification_results: dict  # solution_id → {agent, status, feedback}

    # Fitness tracking
    rewards: dict  # solution_id → score
    best_solution: Optional[dict]
    best_score: float

    # Convergence
    convergence_scores: list  # Score per iteration
    convergence_criteria_met: bool

    # History for CaseBank
    iteration_history: list  # [{iteration, solutions, best_score}, ...]
```

**Integration with HALO's RoutingPlan:**
```python
# HALO produces RoutingPlan with metadata
plan = RoutingPlan(
    assignments={"task1": "solver_a", "task2": "verifier_b"},
    explanations={...},
    metadata={
        "mae_eligible": True,
        "solver_agents": ["solver_a", "solver_b"],
        "verifier_agents": ["verifier_b", "verifier_c"],
        "quality_focus": True,
        "max_time_ms": 300000
    }
)

# MAE uses this metadata to initialize workflow
state = MAEWorkflowState(
    task_id=plan.metadata["task_id"],
    solver_agents=plan.metadata["solver_agents"],
    verifier_agents=plan.metadata["verifier_agents"],
    ...
)
```

### 3.3 Error Handling: Fallback to HALO

**Circuit Breaker Pattern:**
```python
class MAECircuitBreaker:
    """
    Monitors MAE health, falls back to HALO if needed
    """

    async def execute_with_fallback(
        self,
        task: Task,
        solver_agents: List[str],
        verifier_agents: List[str],
        halo_router: HALORouter
    ) -> Dict:
        """
        Try MAE, fall back to standard routing
        """
        try:
            # Attempt MAE
            result = await self._execute_mae(
                task, solver_agents, verifier_agents
            )
            self.success_count += 1
            return result

        except CircuitBreakerOpen:
            # Too many failures, use fallback
            logger.warning(f"MAE circuit breaker open for {task.id}")
            return await halo_router.route_task(task)

        except TimeoutError:
            # Evolution took too long, fallback
            logger.warning(f"MAE timeout for {task.id}")
            return await halo_router.route_task(task)
```

**Graceful Degradation:**
```
MAE Phases (in order of degradation):
1. FULL_EVOLUTION: Full solver + verifier iterations
2. QUICK_VERIFY: Single solver pass + verification
3. SINGLE_AGENT: Route to best solver agent only
4. HALO_FALLBACK: Use standard HALO routing
```

### 3.4 Learning Integration: CaseBank Feedback

**Pattern Capture for CaseBank:**
```python
class MAECaseBankBridge:
    """
    Captures evolution patterns for learning
    """

    async def log_evolution_result(
        self,
        task: Task,
        solver_agents: List[str],
        verifier_agents: List[str],
        iterations: int,
        best_score: float,
        convergence_time_ms: float
    ):
        """
        Log pattern: solver_agents + verifier_agents → convergence
        """
        case = {
            "type": "mae_evolution",
            "task_type": task.type,
            "task_complexity": task.complexity_score,
            "solver_agents": sorted(solver_agents),
            "verifier_agents": sorted(verifier_agents),
            "iterations_to_convergence": iterations,
            "final_score": best_score,
            "execution_time_ms": convergence_time_ms,
            "success": convergence_time_ms < MAX_EVOLUTION_TIME,
            "timestamp": datetime.now(),
            "metadata": {
                "mae_version": "1.0",
                "algorithm": "multi_agent_evolve",
                "feature_flags": self.feature_flags
            }
        }

        # Store in CaseBank
        await self.casebank.store_case(case)

        # Update HALO routing rules if pattern repeats
        if self.casebank.case_frequency(case) > 5:
            # Create specialized routing rule for this pattern
            rule = RoutingRule(
                rule_id=f"mae_pattern_{hash(case)}",
                condition={
                    "task_type": task.type,
                    "complexity": task.complexity_score,
                    "solver_agents": solver_agents
                },
                target_agent="mae_workflow",
                priority=15,  # High priority (after explicit rules)
                explanation=f"Evolution pattern observed {self.casebank.case_frequency(case)} times"
            )
            await halo_router.add_routing_rule(rule)
```

### 3.5 Monitoring Integration: OTEL Spans

**Trace Hierarchy:**
```
Request Span (HALO routing decision)
├─ Span: "halo.route_decision"
│  ├─ Attribute: should_evolve=true
│  ├─ Attribute: solver_agents=[...]
│  └─ Child: "mae.workflow.execute"
│     ├─ Span: "mae.iteration"
│     │  ├─ Span: "mae.solver.generate"
│     │  ├─ Span: "mae.verifier.validate"
│     │  ├─ Span: "mae.rewards.compute"
│     │  └─ Span: "mae.convergence.check"
│     ├─ Span: "mae.iteration"
│     └─ [repeat for each iteration]
│  └─ Attributes: iterations, convergence_score, execution_time
└─ Execution span (if non-MAE fallback)
```

**Key Metrics to Propagate:**
```python
# From MAE workflow
metrics = {
    "mae_iterations": result["iterations"],
    "mae_final_score": result["best_score"],
    "mae_convergence_achieved": result["converged"],
    "mae_execution_time_ms": result["execution_time_ms"],
    "mae_solver_agent_count": len(solver_agents),
    "mae_verifier_agent_count": len(verifier_agents)
}

# Add to trace context for downstream handlers
span.set_attributes(metrics)
```

---

## 4. API Contract Between HALO and MAE

### HALO → MAE Input Signature

```python
async def execute_mae(
    task: Task,
    solver_agents: List[str],
    verifier_agents: List[str],
    execution_constraints: Optional[ExecutionConstraints] = None,
    feature_flags: Optional[Dict[str, Any]] = None
) -> MAEResult:
    """
    Execute Multi-Agent Evolve workflow

    Args:
        task: Task to evolve solutions for
        solver_agents: Agent names that generate solutions
        verifier_agents: Agent names that validate solutions
        execution_constraints: Max time, budget, iterations
        feature_flags: Runtime flags (convergence_threshold, etc)

    Returns:
        MAEResult: {
            "best_solution": {...},
            "best_score": float,
            "converged": bool,
            "iterations": int,
            "execution_time_ms": float,
            "metrics": {...},
            "execution_log": [...]
        }
    """
```

### MAE → HALO Output Signature

```python
@dataclass
class MAEResult:
    """Result of evolution workflow"""
    best_solution: dict  # Evolved solution
    best_score: float  # Fitness score
    converged: bool  # Convergence achieved?
    iterations: int  # Iterations to convergence
    execution_time_ms: float

    # For CaseBank learning
    solver_agents_used: List[str]
    verifier_agents_used: List[str]

    # For monitoring
    metrics: dict  # execution metrics
    iteration_history: list  # Evolution progress per iteration
    execution_log: list  # Detailed execution log
```

---

## 5. Feature Flag Configuration

### Required Flags (in config)

```python
# config/feature_flags.py or environment variables
FEATURE_FLAGS = {
    # Master enable/disable
    "ENABLE_MULTI_AGENT_EVOLVE": {
        "default": False,
        "env_var": "GENESIS_MAE_ENABLED",
        "per_environment": {
            "local": True,
            "staging": True,
            "production": False  # Gradual rollout
        }
    },

    # Agent selection
    "MAE_SOLVER_AGENTS": {
        "default": ["analyst", "builder"],
        "env_var": "GENESIS_MAE_SOLVERS"
    },
    "MAE_VERIFIER_AGENTS": {
        "default": ["qa", "security"],
        "env_var": "GENESIS_MAE_VERIFIERS"
    },

    # Convergence
    "MAE_MAX_ITERATIONS": {
        "default": 5,
        "env_var": "GENESIS_MAE_MAX_ITERATIONS"
    },
    "MAE_CONVERGENCE_THRESHOLD": {
        "default": 0.95,
        "env_var": "GENESIS_MAE_CONVERGENCE_THRESHOLD"
    },

    # Fallback
    "MAE_ENABLE_FALLBACK": {
        "default": True,
        "env_var": "GENESIS_MAE_FALLBACK_ENABLED"
    },
    "MAE_CIRCUIT_BREAKER_THRESHOLD": {
        "default": 5,  # failures before triggering
        "env_var": "GENESIS_MAE_CIRCUIT_THRESHOLD"
    }
}
```

---

## 6. Data Flow Example

### Concrete Scenario: API Performance Optimization

```
1. User Request
   "Optimize our REST API for latency and throughput"

2. HTDAG Decomposition
   Output: DAG with tasks
   - analyze_current_performance
   - identify_bottlenecks
   - design_optimizations
   - validate_changes

3. HALO Routing
   - analyze_current_performance → analyst
   - identify_bottlenecks → performance_engineer
   - design_optimizations → architect
   - validate_changes → qa

   Checks if MAE eligible:
   ✓ Complex task (multiple subtasks)
   ✓ Quality focus (performance matters)
   ✓ Solver + verifier available
   → Verdict: ENABLE MAE

4. MAE Execution
   Iteration 1:
   - Solvers (analyst, architect):
     Generate 3 optimization strategies
   - Verifiers (qa, performance_engineer):
     Validate each strategy
   - Compute rewards: score each
   - Result: strategy B scores highest (0.78)

   Iteration 2:
   - Solvers refine strategy B
   - Verifiers validate refinements
   - Compute rewards: score = 0.92

   Convergence Check:
   - Score improved by 18% → continue

   Iteration 3:
   - Solvers refine further
   - Verifiers validate
   - Compute rewards: score = 0.94

   Convergence Check:
   - Score improved by 2% → converging
   - Iteration 3/5
   → CONVERGED

   Result: Evolved optimization strategy (score: 0.94)

5. Swarm Coordinator (optional)
   Optimize team for implementation phase

6. Execution
   Execute evolved strategy

7. CaseBank Learning
   Pattern: {analyst, architect} + {qa, perf_eng} → 0.94 score
   → Create routing rule for similar tasks
```

---

## 7. Integration Checklist

### Phase 1 (Research & Design)
- [x] Research orchestration patterns (Context7 MCP)
- [x] Identify integration points
- [x] Design state machine
- [ ] (Waiting) Hudson Phase 1: Research MAE paper
- [ ] (Waiting) Review Hudson's architecture doc

### Phase 2 (Implementation)
- [ ] Implement MAE LangGraph workflow
- [ ] Integrate HALO router callback
- [ ] Add feature flags
- [ ] Implement circuit breaker
- [ ] Add OTEL instrumentation

### Phase 3 (Testing & Validation)
- [ ] Unit tests (workflow nodes)
- [ ] Integration tests (HALO + MAE)
- [ ] E2E tests (full pipeline)
- [ ] Performance benchmarks
- [ ] Error handling validation

### Phase 4 (Deployment)
- [ ] Staging deployment (MAE enabled)
- [ ] Monitoring & alerting
- [ ] Gradual production rollout (0% → 100%)
- [ ] CaseBank feedback collection
- [ ] Performance metrics validation

---

## 8. Key Files to Modify/Create

### New Files to Create
```
infrastructure/evolution/
├── __init__.py
├── multi_agent_evolve_workflow.py      [400 lines]
├── multi_agent_evolve_telemetry.py     [200 lines]
└── multi_agent_evolve_error_handler.py [150 lines]
```

### Files to Modify
```
infrastructure/halo_router.py
├── Add method: async route_task_with_evolution()
├── Add method: async _execute_mae_workflow()
├── Add method: _should_evolve()
└── Add method: _select_solver_agents()

infrastructure/casebank.py
├── Add case type: "mae_evolution"
├── Add pattern matching for MAE cases
└── Add auto-rule generation

config/feature_flags.py
├── Add ENABLE_MULTI_AGENT_EVOLVE
├── Add MAE_SOLVER_AGENTS
├── Add MAE_VERIFIER_AGENTS
└── Add MAE_*_THRESHOLD flags
```

---

## Document Metadata

- **Word Count:** ~2,200 words
- **Diagrams:** 2 (architecture, data flow)
- **Code Examples:** 20+
- **Integration Points:** 5 major
- **Status:** Complete, ready for implementation
- **Next Review:** After Hudson Phase 1

**Generated by Cora | Haiku 4.5 | November 3, 2025**
