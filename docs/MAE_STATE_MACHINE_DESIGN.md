# Multi-Agent Evolve: State Machine Design

**Date:** November 3, 2025
**Author:** Cora (Orchestration Specialist)
**Status:** Phase 1 - Draft Ready for Hudson Integration

## Executive Summary

This document defines the state machine for the Multi-Agent Evolve workflow, ready to be adapted once Hudson completes Phase 1 research on the MAE algorithm.

**Current Design:** Based on standard evolution patterns (solver-verifier-reward-convergence)
**Adaptation Point:** Will refine based on Hudson's MAE paper analysis
**Implementation Target:** LangGraph StateGraph (Python)

---

## 1. State Diagram

```
                    ┌─────────────────────────────────────┐
                    │          INIT                        │
                    │ ┌───────────────────────────────────┤
                    │ │ - Validate inputs                 │
                    │ │ - Initialize state                │
                    │ │ - Setup agents                    │
                    │ │ - Set iteration = 0               │
                    │ └───────────────────────────────────┤
                    └─────────────────────────────────────┘
                              │
                              │ (success)
                              ▼
    ┌─────────────────────────────────────────────────────────────┐
    │                    SOLVER_GENERATE                           │
    │ ┌───────────────────────────────────────────────────────────┤
    │ │ [PARALLEL WORKERS]                                        │
    │ │ For each solver_agent:                                    │
    │ │   - Generate solution candidate                           │
    │ │   - Add to solutions list (via reducer)                   │
    │ │                                                             │
    │ │ - Accumulates N solutions per iteration                   │
    │ │ - Each solution includes metadata (agent, timestamp)      │
    │ └───────────────────────────────────────────────────────────┤
    └─────────────────────────────────────────────────────────────┘
                              │
                              │ (all solutions generated)
                              ▼
    ┌─────────────────────────────────────────────────────────────┐
    │                    VERIFIER_VALIDATE                         │
    │ ┌───────────────────────────────────────────────────────────┤
    │ │ [PARALLEL WORKERS]                                        │
    │ │ For each solution in generated_solutions:                 │
    │ │   For each verifier_agent:                                │
    │ │     - Validate solution                                   │
    │ │     - Record verdict (pass/fail/partial)                  │
    │ │     - Collect feedback                                    │
    │ │                                                             │
    │ │ - verification_results[solution_id] = {status, feedback}  │
    │ │ - Invalid solutions marked for filtering                  │
    │ └───────────────────────────────────────────────────────────┤
    └─────────────────────────────────────────────────────────────┘
                              │
                              │ (all verifications complete)
                              ▼
    ┌─────────────────────────────────────────────────────────────┐
    │                    COMPUTE_REWARDS                           │
    │ ┌───────────────────────────────────────────────────────────┤
    │ │ Sequential: Aggregate verification results                │
    │ │                                                             │
    │ │ For each solution:                                        │
    │ │   - Extract verifier feedback scores                      │
    │ │   - Compute fitness = f(verification_results)            │
    │ │   - Handle multi-objective: quality + speed + cost        │
    │ │   - rewards[solution_id] = fitness_score                 │
    │ │                                                             │
    │ │ - Track best_solution and best_score                      │
    │ │ - convergence_scores.append(best_score)                   │
    │ │ - current_iteration += 1                                  │
    │ └───────────────────────────────────────────────────────────┤
    └─────────────────────────────────────────────────────────────┘
                              │
                              │ (rewards computed)
                              ▼
    ┌─────────────────────────────────────────────────────────────┐
    │                    CHECK_CONVERGENCE                         │
    │ ┌───────────────────────────────────────────────────────────┤
    │ │ Evaluate convergence criteria:                            │
    │ │                                                             │
    │ │ 1. Score threshold met?                                   │
    │ │    convergence_criteria_met = best_score >= threshold     │
    │ │                                                             │
    │ │ 2. Improvement plateau?                                   │
    │ │    recent_improvement = convergence_scores[-1] -          │
    │ │                         convergence_scores[-3]            │
    │ │    if recent_improvement < MIN_IMPROVEMENT:               │
    │ │      convergence_criteria_met = True                      │
    │ │                                                             │
    │ │ 3. Max iterations reached?                                │
    │ │    if current_iteration >= max_iterations:                │
    │ │      convergence_criteria_met = True                      │
    │ │                                                             │
    │ │ 4. Time budget exceeded?                                  │
    │ │    if execution_time > time_budget:                       │
    │ │      convergence_criteria_met = True                      │
    │ │                                                             │
    │ │ → Route based on convergence status                       │
    │ └───────────────────────────────────────────────────────────┤
    └─────────────────────────────────────────────────────────────┘
                              │
                 ┌────────────┴────────────┐
                 │                         │
         NOT CONVERGED            CONVERGED
                 │                         │
                 ▼                         ▼
    ┌────────────────────┐    ┌──────────────────────┐
    │  SOLVER_GENERATE   │    │   UPDATE_MEMORY      │
    │  (next iteration)  │    │ ┌──────────────────┤
    │                    │    │ │ - Archive elite  │
    │                    │    │ │   solutions      │
    │                    │    │ │ - Log iteration  │
    │                    │    │ │   history        │
    │                    │    │ │ - Store metrics  │
    │                    │    │ │ - Prepare result │
    │                    │    │ └──────────────────┤
    │                    │    └──────────────────────┘
    │                    │             │
    │                    │             ▼
    │                    │    ┌──────────────────────┐
    │                    │    │    COMPLETE          │
    │                    │    │ ┌──────────────────┤
    │                    │    │ │ Return:          │
    │                    │    │ │ - best_solution  │
    │                    │    │ │ - best_score     │
    │                    │    │ │ - metrics        │
    │                    │    │ │ - logs           │
    │                    │    │ └──────────────────┤
    │                    │    └──────────────────────┘
    │                    │
    └────────────────────┘
```

---

## 2. State Definitions

### INIT State

**Entry Condition:** Workflow invocation

**Actions:**
```python
async def init(state: MAEWorkflowState) -> Dict:
    """Initialize workflow"""
    return {
        "current_iteration": 0,
        "convergence_scores": [],
        "iteration_history": [],
        "generated_solutions": [],  # Will accumulate
        "verification_results": {},
        "rewards": {},
        "best_solution": None,
        "best_score": -float('inf'),
        "convergence_criteria_met": False,
        "execution_start_time": time.time()
    }
```

**Exit Condition:** Initialization complete, move to SOLVER_GENERATE

**Error Handling:**
- Invalid task: Raise ValidationError
- Agents unavailable: Raise AgentNotFoundError
- Feature flag disabled: Raise FeatureFlagError

---

### SOLVER_GENERATE State

**Entry Condition:** Initialization complete OR not converged

**Purpose:** Generate solution candidates using solver agents

**Actions:**
```python
async def solver_generate(state: MAEWorkflowState) -> Dict:
    """
    Parallel generation phase
    Each solver agent generates one solution
    """
    solutions = []

    # Create parallel tasks (one per solver agent)
    tasks = [
        solver_agent.generate_solution(
            task_description=state["task_description"],
            iteration=state["current_iteration"],
            context={
                "previous_best": state["best_solution"],
                "previous_score": state["best_score"],
                "feedback": state["verification_results"]
            }
        )
        for solver_agent in state["solver_agents"]
    ]

    # Execute in parallel
    results = await asyncio.gather(*tasks, return_exceptions=True)

    # Process results
    for agent_name, result in zip(state["solver_agents"], results):
        if isinstance(result, Exception):
            logger.warning(f"Solver {agent_name} failed: {result}")
            solutions.append({
                "status": "failed",
                "agent": agent_name,
                "error": str(result)
            })
        else:
            solutions.append({
                "id": f"sol_{state['current_iteration']}_{agent_name}",
                "content": result.content,
                "agent": agent_name,
                "iteration": state["current_iteration"],
                "timestamp": datetime.now(),
                "status": "generated"
            })

    # Return accumulated solutions (reducer will combine)
    return {
        "generated_solutions": solutions
    }
```

**State Updates (via Reducer):**
```python
# In MAEWorkflowState
generated_solutions: Annotated[list, add_messages]  # Accumulates
```

**Exit Condition:** All solver agents have produced output (or timeout)

**Next State:** VERIFIER_VALIDATE

**Parallelism:** Up to `len(solver_agents)` concurrent tasks

---

### VERIFIER_VALIDATE State

**Entry Condition:** Solutions generated

**Purpose:** Validate all generated solutions

**Actions:**
```python
async def verifier_validate(state: MAEWorkflowState) -> Dict:
    """
    Parallel validation phase
    Each verifier agent validates all solutions
    """
    verification_results = {}

    # For each solution, validate with all verifier agents
    for solution in state["generated_solutions"]:
        solution_id = solution["id"]
        verification_results[solution_id] = {}

        # Parallel verification (one per verifier agent)
        tasks = [
            verifier_agent.validate_solution(
                solution=solution["content"],
                task_description=state["task_description"],
                context={
                    "solver_agent": solution["agent"],
                    "iteration": solution["iteration"]
                }
            )
            for verifier_agent in state["verifier_agents"]
        ]

        results = await asyncio.gather(*tasks, return_exceptions=True)

        # Aggregate verifier feedback
        for agent_name, result in zip(state["verifier_agents"], results):
            if isinstance(result, Exception):
                verification_results[solution_id][agent_name] = {
                    "status": "failed",
                    "error": str(result)
                }
            else:
                verification_results[solution_id][agent_name] = {
                    "status": result.status,  # pass, fail, partial
                    "score": result.confidence,  # 0-1 confidence in verdict
                    "feedback": result.feedback,
                    "issues": result.issues
                }

    return {
        "verification_results": verification_results
    }
```

**Output Structure:**
```python
verification_results = {
    "sol_0_solver_a": {
        "qa_agent": {"status": "pass", "score": 0.95, "feedback": "..."},
        "security_agent": {"status": "fail", "score": 0.3, "feedback": "..."}
    },
    "sol_0_solver_b": {
        "qa_agent": {"status": "pass", "score": 0.88, ...},
        "security_agent": {"status": "pass", "score": 0.92, ...}
    }
}
```

**Exit Condition:** All solutions verified (or timeout)

**Next State:** COMPUTE_REWARDS

**Parallelism:** Up to `len(solutions) * len(verifier_agents)` concurrent tasks

---

### COMPUTE_REWARDS State

**Entry Condition:** Verification complete

**Purpose:** Aggregate feedback and compute fitness scores

**Actions:**
```python
def compute_rewards(state: MAEWorkflowState) -> Dict:
    """
    Sequential reward computation
    Multi-objective fitness based on verification feedback
    """
    rewards = {}

    # Multi-objective optimization weights
    weights = {
        "quality": 0.5,      # Verification pass rate
        "efficiency": 0.3,   # Resource usage
        "novelty": 0.2       # Uniqueness vs best
    }

    for solution_id, verifications in state["verification_results"].items():
        # 1. Quality score (from verifier verdicts)
        pass_count = sum(
            1 for v in verifications.values()
            if v.get("status") == "pass"
        )
        quality_score = pass_count / len(verifications)

        # 2. Efficiency score (agent feedback)
        efficiency_scores = []
        for v in verifications.values():
            if "performance" in v:
                efficiency_scores.append(v["performance"])
        efficiency_score = mean(efficiency_scores) if efficiency_scores else 0.5

        # 3. Novelty score (relative to best known)
        if state["best_solution"] is None:
            novelty_score = 1.0  # First iteration
        else:
            # Penalize solutions similar to best
            similarity = compute_similarity(
                state["best_solution"],
                solution_id
            )
            novelty_score = 1.0 - (0.5 * similarity)  # 0.5x novelty weight

        # 4. Compute weighted fitness
        fitness = (
            weights["quality"] * quality_score +
            weights["efficiency"] * efficiency_score +
            weights["novelty"] * novelty_score
        )

        rewards[solution_id] = {
            "fitness": fitness,
            "components": {
                "quality": quality_score,
                "efficiency": efficiency_score,
                "novelty": novelty_score
            },
            "verifications": verifications
        }

    # 5. Track best solution
    best_solution_id = max(rewards, key=lambda k: rewards[k]["fitness"])
    best_solution = next(
        s for s in state["generated_solutions"]
        if s["id"] == best_solution_id
    )

    # 6. Update tracking
    return {
        "rewards": rewards,
        "best_solution": best_solution,
        "best_score": rewards[best_solution_id]["fitness"],
        "current_iteration": state["current_iteration"] + 1,
        "convergence_scores": state["convergence_scores"] + [
            rewards[best_solution_id]["fitness"]
        ]
    }
```

**Exit Condition:** All rewards computed

**Next State:** CHECK_CONVERGENCE

**Complexity:** O(num_solutions × num_verifiers)

---

### CHECK_CONVERGENCE State

**Entry Condition:** Rewards computed

**Purpose:** Determine if evolution has converged

**Actions:**
```python
def check_convergence(state: MAEWorkflowState) -> str:
    """
    Evaluate convergence criteria
    Returns routing decision: "continue" or "converged"
    """
    max_iterations = state.get("max_iterations", 5)
    convergence_threshold = state.get("convergence_threshold", 0.95)
    min_improvement = state.get("min_improvement", 0.02)

    # Criterion 1: Score threshold
    if state["best_score"] >= convergence_threshold:
        logger.info(f"Convergence: Score threshold met ({state['best_score']:.3f})")
        return "converged"

    # Criterion 2: Improvement plateau
    if len(state["convergence_scores"]) >= 3:
        recent_scores = state["convergence_scores"][-3:]
        improvement = recent_scores[-1] - recent_scores[0]

        if improvement < min_improvement:
            logger.info(f"Convergence: Plateau detected (improvement: {improvement:.3f})")
            return "converged"

    # Criterion 3: Max iterations
    if state["current_iteration"] >= max_iterations:
        logger.info(f"Convergence: Max iterations ({max_iterations}) reached")
        return "converged"

    # Criterion 4: Time budget
    elapsed_ms = (time.time() - state["execution_start_time"]) * 1000
    time_budget_ms = state.get("time_budget_ms", 300000)  # 5 minutes

    if elapsed_ms > time_budget_ms:
        logger.warning(f"Convergence: Time budget exceeded ({elapsed_ms:.0f}ms)")
        return "converged"

    # No convergence yet
    logger.info(f"No convergence yet (iteration {state['current_iteration']}/{max_iterations})")
    return "continue"
```

**Routing Logic:**
```python
def route_after_convergence(state: MAEWorkflowState) -> str:
    """
    Conditional routing based on convergence check
    """
    result = check_convergence(state)

    if result == "converged":
        return "update_memory"  # Exit evolution
    else:
        return "solver_generate"  # Continue evolution
```

**Exit Condition:** Convergence decision made

**Next States:**
- "continue" → SOLVER_GENERATE (next iteration)
- "converged" → UPDATE_MEMORY (finalize)

---

### UPDATE_MEMORY State

**Entry Condition:** Convergence achieved

**Purpose:** Archive results and log evolution history

**Actions:**
```python
async def update_memory(state: MAEWorkflowState) -> Dict:
    """
    Finalize evolution and prepare output
    """
    # 1. Archive elite solutions (top 10%)
    elite_count = max(1, len(state["generated_solutions"]) // 10)
    elite_solutions = sorted(
        [
            (sol_id, state["rewards"][sol_id]["fitness"])
            for sol_id in state["rewards"]
        ],
        key=lambda x: x[1],
        reverse=True
    )[:elite_count]

    # 2. Log iteration history
    iteration_entry = {
        "iteration": state["current_iteration"],
        "num_solutions": len(state["generated_solutions"]),
        "best_score": state["best_score"],
        "best_solution_id": state["best_solution"]["id"],
        "elite_solutions": [sol_id for sol_id, _ in elite_solutions],
        "timestamp": datetime.now(),
        "convergence_scores": state["convergence_scores"]
    }

    # 3. Log to CaseBank (for learning)
    await self.casebank.log_evolution(
        task_id=state["task_id"],
        solver_agents=state["solver_agents"],
        verifier_agents=state["verifier_agents"],
        iterations=state["current_iteration"],
        final_score=state["best_score"],
        execution_time_ms=(time.time() - state["execution_start_time"]) * 1000,
        elite_solutions=elite_solutions,
        metadata={
            "convergence_criteria": check_convergence(state),
            "total_solutions_generated": len(state["generated_solutions"]),
            "verification_pass_rate": compute_pass_rate(state["verification_results"])
        }
    )

    # 4. Prepare final output
    return {
        "archive": [sol_id for sol_id, _ in elite_solutions],
        "iteration_history": state["iteration_history"] + [iteration_entry]
    }
```

**Exit Condition:** Memory updated

**Next State:** COMPLETE

---

### COMPLETE State

**Entry Condition:** Memory updated

**Purpose:** Return final results

**Return Value:**
```python
result = {
    "status": "success",
    "best_solution": state["best_solution"],
    "best_score": state["best_score"],
    "converged": True,  # Always True at this state
    "iterations": state["current_iteration"],
    "execution_time_ms": (time.time() - state["execution_start_time"]) * 1000,
    "metrics": {
        "total_solutions_generated": len(state["generated_solutions"]),
        "total_verifications": sum(
            len(v) for v in state["verification_results"].values()
        ),
        "verification_pass_rate": compute_pass_rate(state["verification_results"]),
        "convergence_score_history": state["convergence_scores"],
        "elite_archive": state.get("archive", [])
    },
    "execution_log": state.get("iteration_history", [])
}
```

---

## 3. State Transitions Map

| Current | Event | Next | Condition |
|---------|-------|------|-----------|
| INIT | success | SOLVER_GENERATE | Always |
| INIT | error | ERROR | Validation failed |
| SOLVER_GENERATE | timeout | SOLVER_GENERATE | Retry (limited) |
| SOLVER_GENERATE | partial_failure | SOLVER_GENERATE | Continue with available results |
| SOLVER_GENERATE | complete | VERIFIER_VALIDATE | All agents returned |
| VERIFIER_VALIDATE | complete | COMPUTE_REWARDS | All verifications done |
| COMPUTE_REWARDS | complete | CHECK_CONVERGENCE | Always |
| CHECK_CONVERGENCE | threshold_met | UPDATE_MEMORY | Score ≥ threshold |
| CHECK_CONVERGENCE | plateau_detected | UPDATE_MEMORY | No improvement in 3 iterations |
| CHECK_CONVERGENCE | max_iterations | UPDATE_MEMORY | Iteration limit reached |
| CHECK_CONVERGENCE | time_budget | UPDATE_MEMORY | Time exceeded |
| CHECK_CONVERGENCE | continue | SOLVER_GENERATE | None of above |
| UPDATE_MEMORY | complete | COMPLETE | Always |

---

## 4. Error Handling Strategy

### Error States

```python
class MAEError(Exception):
    """Base class for MAE errors"""
    pass

class SolverError(MAEError):
    """Solution generation failed"""
    pass

class VerifierError(MAEError):
    """Verification failed"""
    pass

class ConvergenceError(MAEError):
    """Evolution failed to converge"""
    pass

class TimeoutError(MAEError):
    """Execution exceeded time budget"""
    pass
```

### Error Handling Flow

```
┌─────────────────────────────────────────┐
│ Error occurs in any state               │
└─────────────────────────────────────────┘
         │
         ▼
    Log error details
         │
         ▼
    Check retry budget
    /          \
   /            \
 YES             NO
  │              │
  ▼              ▼
Retry          Fallback
(limited)      to single-pass
               execution
  │
  ▼
Success?
/   \
Y     N
│     │
└──┐┌─┘
   ││
   └┼─ Continue or Fail
```

### Graceful Degradation Levels

```python
DEGRADATION_LEVELS = {
    "FULL_EVOLUTION": {
        "solver_phase": "full",
        "verifier_phase": "full",
        "iterations": max_iterations
    },
    "QUICK_VERIFY": {
        "solver_phase": "single_pass",
        "verifier_phase": "full",
        "iterations": 1
    },
    "SINGLE_AGENT": {
        "solver_phase": "best_agent_only",
        "verifier_phase": "none",
        "iterations": 1
    },
    "HALO_FALLBACK": {
        "use_halo_router": True,
        "skip_evolution": True
    }
}
```

---

## 5. TypedDict State Definition

```python
from typing import Annotated, Optional, List, Dict, Any
from typing_extensions import TypedDict
from langgraph.graph.message import add_messages
from datetime import datetime

class MAEWorkflowState(TypedDict):
    """Complete state for Multi-Agent Evolve workflow"""

    # ========== TASK CONTEXT ==========
    task_id: str
    task_description: str
    solver_agents: List[str]
    verifier_agents: List[str]

    # ========== EXECUTION PARAMETERS ==========
    max_iterations: int
    convergence_threshold: float
    min_improvement: float
    time_budget_ms: float

    # ========== GENERATION PHASE ==========
    current_iteration: int
    generated_solutions: Annotated[list, add_messages]  # Accumulates

    # ========== VERIFICATION PHASE ==========
    verification_results: Dict[str, Dict[str, Any]]

    # ========== EVALUATION PHASE ==========
    rewards: Dict[str, Dict[str, Any]]
    best_solution: Optional[Dict[str, Any]]
    best_score: float
    convergence_scores: List[float]

    # ========== CONVERGENCE TRACKING ==========
    convergence_criteria_met: bool

    # ========== HISTORY & MEMORY ==========
    iteration_history: List[Dict[str, Any]]
    archive: List[str]

    # ========== TIMING ==========
    execution_start_time: float
```

---

## 6. Parallel Execution Model

### Solver Generation Parallelism

```
Iteration N:
  Solver agents operate in parallel:

  Time →
  |
  | solver_a:  [----GENERATE----]
  | solver_b:  [----GENERATE----]
  | solver_c:  [----GENERATE----]
  |
  └─────→ Wait for all to complete (or timeout)
          ▼
          All solutions available for verification
```

### Verification Parallelism

```
For each solution:
  Verifier agents work in parallel:

  Time →
  |
  | sol_1: verifier_qa:  [--VERIFY--]
  |        verifier_sec: [--VERIFY--]
  |
  | sol_2: verifier_qa:  [--VERIFY--]
  |        verifier_sec: [--VERIFY--]
  |
  └─────→ Wait for all (can pipeline across solutions)
```

### Overall Timeline

```
Iteration 1:
┌─ SOLVER_GENERATE ────────────┐  (parallel, ~2s)
│ solver_a, b, c               │
└──────────────────────────────┘
┌─ VERIFIER_VALIDATE ──────────┐  (parallel, ~3s)
│ 3 solutions × 2 verifiers    │
└──────────────────────────────┘
┌─ COMPUTE_REWARDS ────────────┐  (sequential, ~0.5s)
└──────────────────────────────┘
┌─ CHECK_CONVERGENCE ──────────┐  (instant, <0.1s)
└──────────────────────────────┘

Per iteration: ~5.6s

5 iterations: ~28s
10 iterations: ~56s
```

---

## 7. Convergence Criteria Details

### Criterion 1: Quality Threshold
```python
# Success when solution quality exceeds threshold
convergence_criteria_met = best_score >= convergence_threshold
# Default: 0.95 (95% of maximum quality)
```

### Criterion 2: Improvement Plateau
```python
# Success when improvement rate slows below threshold
recent_scores = convergence_scores[-3:]  # Last 3 iterations
improvement = recent_scores[-1] - recent_scores[0]
convergence_criteria_met = improvement < min_improvement
# Default: 0.02 (2% improvement over 3 iterations)
```

### Criterion 3: Max Iterations
```python
# Success when iteration limit reached
convergence_criteria_met = current_iteration >= max_iterations
# Default: 5 iterations
```

### Criterion 4: Time Budget
```python
# Success when execution time exceeded
elapsed_ms = (time.time() - execution_start_time) * 1000
convergence_criteria_met = elapsed_ms > time_budget_ms
# Default: 300,000 ms (5 minutes)
```

---

## 8. Integration with LangGraph

### Graph Building Pattern

```python
from langgraph.graph import StateGraph, START, END

def build_mae_graph() -> CompiledGraph:
    """Construct LangGraph state machine"""

    builder = StateGraph(MAEWorkflowState)

    # Add nodes
    builder.add_node("init", init)
    builder.add_node("solver_generate", solver_generate)
    builder.add_node("verifier_validate", verifier_validate)
    builder.add_node("compute_rewards", compute_rewards)
    builder.add_node("check_convergence", check_convergence)
    builder.add_node("update_memory", update_memory)

    # Add edges
    builder.add_edge(START, "init")
    builder.add_edge("init", "solver_generate")
    builder.add_edge("solver_generate", "verifier_validate")
    builder.add_edge("verifier_validate", "compute_rewards")
    builder.add_edge("compute_rewards", "check_convergence")

    # Conditional edge for convergence routing
    builder.add_conditional_edges(
        "check_convergence",
        route_after_convergence,
        {
            "continue": "solver_generate",      # Loop back
            "converged": "update_memory"        # Exit
        }
    )

    builder.add_edge("update_memory", END)

    # Compile with checkpointing for persistence
    return builder.compile(checkpointer=InMemorySaver())
```

### Execution Pattern

```python
async def execute_mae(task: Task, config: dict) -> dict:
    """Execute evolution workflow"""

    graph = build_mae_graph()

    initial_state = MAEWorkflowState(
        task_id=task.id,
        task_description=task.description,
        solver_agents=config["solver_agents"],
        verifier_agents=config["verifier_agents"],
        max_iterations=config.get("max_iterations", 5),
        convergence_threshold=config.get("convergence_threshold", 0.95),
        min_improvement=config.get("min_improvement", 0.02),
        time_budget_ms=config.get("time_budget_ms", 300000),
        current_iteration=0,
        generated_solutions=[],
        verification_results={},
        rewards={},
        best_solution=None,
        best_score=-float('inf'),
        convergence_scores=[],
        iteration_history=[],
        archive=[],
        execution_start_time=time.time()
    )

    # Execute workflow
    result = await graph.ainvoke(initial_state)

    return {
        "best_solution": result["best_solution"],
        "best_score": result["best_score"],
        "iterations": result["current_iteration"],
        "metrics": {...},
        "status": "success"
    }
```

---

## 9. Metrics Collection Points

```python
# INIT
- workflow_start_time

# SOLVER_GENERATE
- solver_latency_per_agent
- solver_success_rate
- solver_error_types

# VERIFIER_VALIDATE
- verifier_latency_per_agent
- verifier_pass_rate
- verifier_consensus

# COMPUTE_REWARDS
- fitness_score_distribution
- best_score_per_iteration
- novelty_score_distribution

# CHECK_CONVERGENCE
- convergence_iteration
- convergence_reason
- improvement_rate

# UPDATE_MEMORY
- elite_solution_count
- total_execution_time_ms
- casebank_update_status
```

---

## 10. Next Steps: Hudson Integration

**After Hudson completes Phase 1:**

1. **Adapt solver/verifier definitions** based on MAE paper details
2. **Refine reward computation** based on MAE fitness function
3. **Adjust convergence criteria** if MAE specifies different heuristics
4. **Update state schema** if additional tracking needed
5. **Implement multi-objective optimization** if MAE requires it

**Current draft is ready for:**
- ✅ LangGraph implementation
- ✅ HALO router integration
- ✅ OTEL instrumentation
- ⏳ Algorithm-specific refinements (post-Hudson)

---

## Document Metadata

- **Word Count:** ~3,000 words
- **Diagrams:** 6 (state machine, transitions, parallelism, timeline)
- **Code Examples:** 30+
- **State Count:** 7 major states
- **Status:** Ready for implementation with Hudson refinements
- **Next Update:** After Hudson Phase 1 completion

**Generated by Cora | Haiku 4.5 | November 3, 2025**
