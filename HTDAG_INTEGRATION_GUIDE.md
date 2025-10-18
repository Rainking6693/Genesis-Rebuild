# HTDAGPlanner Integration Guide

**For:** Cora (Architecture Lead) and future integration developers
**Date:** October 17, 2025
**Phase:** 1.1 Complete → 1.2 Integration Ready

---

## Quick Start

### Import and Basic Usage

```python
from infrastructure.task_dag import TaskDAG, Task, TaskStatus
from infrastructure.htdag_planner import HTDAGPlanner

# Initialize planner
planner = HTDAGPlanner(llm_client=your_llm_client)

# Decompose user request
dag = await planner.decompose_task(
    user_request="Build a SaaS business",
    context={"domain": "e-commerce", "budget": 10000}
)

# Get execution order
execution_order = dag.topological_sort()

# Execute tasks in order
for task_id in execution_order:
    task = dag.tasks[task_id]
    result = await execute_task(task)
    dag.mark_complete(task_id)
```

---

## API Reference

### TaskDAG Class

#### Core Methods

```python
# Task Management
dag.add_task(task: Task) -> None
dag.mark_complete(task_id: str) -> None

# Dependency Management
dag.add_dependency(parent_id: str, child_id: str) -> None
dag.get_parents(task_id: str) -> List[str]
dag.get_children(task_id: str) -> List[str]

# Graph Operations
dag.topological_sort() -> List[str]
dag.has_cycle() -> bool
dag.get_root_tasks() -> List[str]
dag.get_leaf_tasks() -> List[str]
dag.max_depth() -> int

# Utilities
dag.copy() -> TaskDAG
len(dag) -> int
```

#### Task Model

```python
@dataclass
class Task:
    task_id: str                      # Unique identifier
    task_type: str                    # "design", "implement", "test_run", "deploy", etc.
    description: str                  # Human-readable description
    status: TaskStatus               # PENDING, IN_PROGRESS, COMPLETED, FAILED
    dependencies: List[str]          # Parent task IDs (read-only after creation)
    metadata: Dict[str, Any]         # Extensible metadata (priority, cost, etc.)
    agent_assigned: Optional[str]    # Agent ID for routing
    estimated_duration: Optional[float]  # Hours or tokens
```

### HTDAGPlanner Class

#### Core Methods

```python
# Primary API
async def decompose_task(
    user_request: str,
    context: Optional[Dict[str, Any]] = None
) -> TaskDAG

# Dynamic Updates
async def update_dag_dynamic(
    dag: TaskDAG,
    completed_tasks: List[str],
    new_info: Dict[str, Any]
) -> TaskDAG

# Configuration
planner.MAX_RECURSION_DEPTH = 5     # Default: 5
planner.MAX_TOTAL_TASKS = 1000      # Default: 1000
```

---

## Integration Points

### 1. HALO Router Integration (Phase 1.2)

**Input:** TaskDAG from HTDAGPlanner
**Output:** Agent assignments for each task

```python
from infrastructure.htdag_planner import HTDAGPlanner
from infrastructure.halo_router import HALORouter

# Step 1: Decompose task
planner = HTDAGPlanner(llm_client)
dag = await planner.decompose_task("Build API backend")

# Step 2: Route tasks to agents
router = HALORouter()
for task_id in dag.topological_sort():
    task = dag.tasks[task_id]
    agent_id = await router.route_task(task)
    task.agent_assigned = agent_id
    task.metadata["routing_reason"] = router.get_last_routing_reason()

# Step 3: Execute
for task_id in dag.topological_sort():
    task = dag.tasks[task_id]
    agent = get_agent(task.agent_assigned)
    result = await agent.execute(task)
    dag.mark_complete(task_id)
```

**Integration Points:**
- `task.task_type` → HALO routing key
- `task.metadata` → Additional routing context
- `task.agent_assigned` → Store HALO decision

### 2. AOP Validator Integration (Phase 1.3)

**Input:** TaskDAG from HTDAGPlanner
**Output:** Validation report (solvability, completeness, non-redundancy)

```python
from infrastructure.htdag_planner import HTDAGPlanner
from infrastructure.aop_validator import AOPValidator

# Step 1: Decompose
planner = HTDAGPlanner(llm_client)
dag = await planner.decompose_task("Deploy ML model")

# Step 2: Validate
validator = AOPValidator()
report = await validator.validate_dag(dag)

if not report.is_solvable:
    # Fix: Add missing tasks
    fixed_dag = await validator.repair_dag(dag, report)
    dag = fixed_dag

if not report.is_complete:
    # Fix: Fill gaps in task graph
    dag = await planner.update_dag_dynamic(dag, [], {"gaps": report.gaps})

# Step 3: Execute validated DAG
# ...
```

**Integration Points:**
- `dag.has_cycle()` → Acyclicity check
- `dag.get_leaf_tasks()` → Completeness check
- `dag.topological_sort()` → Solvability check (raises if unsolvable)

### 3. DAAO Cost Optimizer Integration (Already Complete)

**Input:** TaskDAG with cost estimates
**Output:** Optimized execution plan

```python
from infrastructure.htdag_planner import HTDAGPlanner
from infrastructure.daao import DAAOOptimizer

# Step 1: Decompose with cost metadata
planner = HTDAGPlanner(llm_client)
dag = await planner.decompose_task("Generate report")

# Step 2: Estimate costs
for task_id, task in dag.tasks.items():
    task.metadata["estimated_tokens"] = estimate_tokens(task)
    task.metadata["priority"] = "high" if "critical" in task.description else "medium"

# Step 3: Optimize
optimizer = DAAOOptimizer()
optimized_plan = await optimizer.optimize(dag)

# Step 4: Execute optimized plan
for task_id in optimized_plan.execution_order:
    # ... execute with optimized model selection ...
```

**Integration Points:**
- `task.metadata["estimated_tokens"]` → Cost input
- `task.estimated_duration` → Time-based optimization
- `task.metadata["priority"]` → Deadline-aware scheduling

---

## Extension Patterns

### Custom Task Types

```python
# Define new atomic task types
class CustomHTDAGPlanner(HTDAGPlanner):
    def _should_decompose(self, task: Task) -> bool:
        atomic_types = {
            "api_call", "file_write", "test_run",  # Built-in
            "llm_query", "database_query", "http_request"  # Custom
        }
        return task.task_type not in atomic_types
```

### Custom Decomposition Logic

```python
class DomainSpecificPlanner(HTDAGPlanner):
    async def _decompose_single_task(self, task: Task) -> List[Task]:
        # Custom logic for your domain
        if task.task_type == "ml_pipeline":
            return [
                Task(task_id=f"{task.task_id}_data_prep", task_type="implement",
                     description="Prepare training data"),
                Task(task_id=f"{task.task_id}_train", task_type="implement",
                     description="Train model"),
                Task(task_id=f"{task.task_id}_evaluate", task_type="test_run",
                     description="Evaluate model"),
            ]
        return await super()._decompose_single_task(task)
```

### Task Execution Hooks

```python
class ExecutableTaskDAG(TaskDAG):
    async def execute_task(self, task_id: str, agent_pool: AgentPool):
        task = self.tasks[task_id]
        task.status = TaskStatus.IN_PROGRESS

        try:
            agent = agent_pool.get_agent(task.agent_assigned)
            result = await agent.execute(task)
            task.status = TaskStatus.COMPLETED
            task.metadata["result"] = result
        except Exception as e:
            task.status = TaskStatus.FAILED
            task.metadata["error"] = str(e)
            raise

    async def execute_all(self, agent_pool: AgentPool):
        for task_id in self.topological_sort():
            await self.execute_task(task_id, agent_pool)
```

---

## Common Usage Patterns

### Pattern 1: Linear Workflow

```python
# Simple sequential tasks
dag = TaskDAG()
tasks = [
    Task(task_id="step1", task_type="api_call", description="Fetch data"),
    Task(task_id="step2", task_type="implement", description="Process data"),
    Task(task_id="step3", task_type="file_write", description="Save results"),
]

for task in tasks:
    dag.add_task(task)

dag.add_dependency("step1", "step2")
dag.add_dependency("step2", "step3")
```

### Pattern 2: Parallel Branches

```python
# Fork-join pattern
dag = TaskDAG()

# Main task
dag.add_task(Task(task_id="init", task_type="api_call", description="Initialize"))

# Parallel branches
for branch in ["frontend", "backend", "database"]:
    dag.add_task(Task(task_id=branch, task_type="implement", description=f"Build {branch}"))
    dag.add_dependency("init", branch)

# Join
dag.add_task(Task(task_id="integrate", task_type="test_run", description="Integration test"))
for branch in ["frontend", "backend", "database"]:
    dag.add_dependency(branch, "integrate")
```

### Pattern 3: Conditional Execution

```python
# Execute only if dependencies succeed
dag = await planner.decompose_task("Deploy application")

for task_id in dag.topological_sort():
    task = dag.tasks[task_id]
    parents = dag.get_parents(task_id)

    # Check all parent tasks succeeded
    all_parents_succeeded = all(
        dag.tasks[parent_id].status == TaskStatus.COMPLETED
        for parent_id in parents
    )

    if all_parents_succeeded:
        await execute_task(task)
        dag.mark_complete(task_id)
    else:
        task.status = TaskStatus.FAILED
        task.metadata["skip_reason"] = "Parent task(s) failed"
```

### Pattern 4: Dynamic Expansion

```python
# Add subtasks based on runtime results
dag = await planner.decompose_task("Analyze codebase")

# Execute root task
root_task_id = dag.get_root_tasks()[0]
result = await execute_task(dag.tasks[root_task_id])

# Dynamically add subtasks based on result
if result["num_files"] > 100:
    # Large codebase - add parallel analysis tasks
    dag = await planner.update_dag_dynamic(
        dag,
        completed_tasks=[root_task_id],
        new_info={"strategy": "parallel", "num_workers": 4}
    )
```

---

## Error Handling

### Cycle Detection

```python
try:
    execution_order = dag.topological_sort()
except ValueError as e:
    # DAG has cycles - inspect and fix
    print(f"Error: {e}")

    # Option 1: Find problematic dependencies
    for task_id, task in dag.tasks.items():
        for dep_id in task.dependencies:
            if dag.graph.has_edge(dep_id, task_id):
                # Found bidirectional dependency
                print(f"Cycle between {task_id} and {dep_id}")

    # Option 2: Rebuild DAG
    dag = await planner.decompose_task(user_request)
```

### Rollback on Update Failure

```python
original_dag = dag.copy()

try:
    updated_dag = await planner.update_dag_dynamic(dag, completed_tasks, new_info)

    # Validate before committing
    if updated_dag.has_cycle():
        raise ValueError("Update created cycle")

    dag = updated_dag
except Exception as e:
    # Rollback to original DAG
    dag = original_dag
    logger.error(f"DAG update failed: {e}")
```

### Task Execution Failures

```python
for task_id in dag.topological_sort():
    task = dag.tasks[task_id]

    try:
        result = await execute_task(task)
        task.status = TaskStatus.COMPLETED
        task.metadata["result"] = result
    except Exception as e:
        task.status = TaskStatus.FAILED
        task.metadata["error"] = str(e)

        # Option 1: Stop on first failure
        raise

        # Option 2: Continue with remaining tasks
        continue

        # Option 3: Retry with different strategy
        retry_task = Task(
            task_id=f"{task_id}_retry",
            task_type=task.task_type,
            description=f"Retry: {task.description}",
            metadata={"retry_of": task_id, "attempt": 2}
        )
        dag.add_task(retry_task)
```

---

## Performance Optimization

### Parallel Execution

```python
import asyncio

# Identify tasks that can run in parallel (same depth level)
depth_levels = {}
for task_id in dag.topological_sort():
    depth = len(dag.get_parents(task_id))
    if depth not in depth_levels:
        depth_levels[depth] = []
    depth_levels[depth].append(task_id)

# Execute each level in parallel
for depth in sorted(depth_levels.keys()):
    task_ids = depth_levels[depth]
    tasks_to_execute = [execute_task(dag.tasks[tid]) for tid in task_ids]
    results = await asyncio.gather(*tasks_to_execute, return_exceptions=True)

    for task_id, result in zip(task_ids, results):
        if isinstance(result, Exception):
            dag.tasks[task_id].status = TaskStatus.FAILED
        else:
            dag.tasks[task_id].status = TaskStatus.COMPLETED
```

### Caching Decompositions

```python
import hashlib

class CachedHTDAGPlanner(HTDAGPlanner):
    def __init__(self, llm_client=None):
        super().__init__(llm_client)
        self.cache = {}

    async def decompose_task(self, user_request: str, context: Optional[Dict[str, Any]] = None) -> TaskDAG:
        # Create cache key
        cache_key = hashlib.sha256(
            (user_request + str(context)).encode()
        ).hexdigest()

        if cache_key in self.cache:
            return self.cache[cache_key].copy()

        # Decompose and cache
        dag = await super().decompose_task(user_request, context)
        self.cache[cache_key] = dag.copy()
        return dag
```

### Lazy Decomposition

```python
# Don't decompose entire DAG upfront - decompose on-demand
class LazyHTDAGPlanner(HTDAGPlanner):
    async def decompose_task(self, user_request: str, context: Optional[Dict[str, Any]] = None) -> TaskDAG:
        # Only generate top-level tasks
        dag = TaskDAG()
        top_level = await self._generate_top_level_tasks(user_request, context)
        for task in top_level:
            dag.add_task(task)
        return dag

    async def expand_task(self, dag: TaskDAG, task_id: str) -> TaskDAG:
        # Decompose single task when needed
        task = dag.tasks[task_id]
        subtasks = await self._decompose_single_task(task)
        for subtask in subtasks:
            dag.add_task(subtask)
            dag.add_dependency(task_id, subtask.task_id)
        return dag
```

---

## Testing Utilities

### Test Fixtures

```python
import pytest
from infrastructure.task_dag import TaskDAG, Task, TaskStatus

@pytest.fixture
def simple_dag():
    dag = TaskDAG()
    tasks = [
        Task(task_id="task1", task_type="api_call", description="Task 1"),
        Task(task_id="task2", task_type="file_write", description="Task 2"),
        Task(task_id="task3", task_type="test_run", description="Task 3"),
    ]
    for task in tasks:
        dag.add_task(task)
    dag.add_dependency("task1", "task2")
    dag.add_dependency("task2", "task3")
    return dag

@pytest.fixture
def parallel_dag():
    dag = TaskDAG()
    # ... create DAG with parallel branches ...
    return dag
```

### Mock LLM Client

```python
class MockLLMClient:
    async def decompose(self, request: str) -> List[Dict]:
        # Return mock task breakdown
        return [
            {"task_id": "mock1", "task_type": "design", "description": "Mock task 1"},
            {"task_id": "mock2", "task_type": "implement", "description": "Mock task 2"},
        ]

# Use in tests
planner = HTDAGPlanner(llm_client=MockLLMClient())
dag = await planner.decompose_task("Test request")
```

---

## Migration from Phase 1.1 to 1.2

### Current (Phase 1.1): Heuristic Decomposition

```python
planner = HTDAGPlanner()  # No LLM client
dag = await planner.decompose_task("Build SaaS")
# Uses hardcoded rules (design → implement → deploy)
```

### Future (Phase 1.2): LLM-Powered Decomposition

```python
from infrastructure.llm_client import GPT4oClient

llm_client = GPT4oClient(api_key=os.getenv("OPENAI_API_KEY"))
planner = HTDAGPlanner(llm_client=llm_client)

dag = await planner.decompose_task(
    "Build SaaS",
    context={"domain": "e-commerce", "tech_stack": "Python/React"}
)
# Uses GPT-4o for intelligent domain-specific decomposition
```

### Backwards Compatibility

```python
# Both approaches work - planner detects LLM availability
planner = HTDAGPlanner(llm_client=None)  # Falls back to heuristics
planner = HTDAGPlanner(llm_client=gpt4o)  # Uses LLM
```

---

## Troubleshooting

### Issue: DAG has cycles

**Symptom:** `ValueError: DAG has cycles` when calling `topological_sort()`

**Diagnosis:**
```python
if dag.has_cycle():
    # Inspect graph for bidirectional edges
    for task_id in dag.get_all_task_ids():
        for child_id in dag.get_children(task_id):
            if task_id in dag.get_children(child_id):
                print(f"Cycle: {task_id} <-> {child_id}")
```

**Fix:** Remove circular dependency or redesign task breakdown

---

### Issue: Decomposition too shallow

**Symptom:** Only 1-2 levels of tasks generated

**Diagnosis:**
```python
print(f"Max depth: {dag.max_depth()}")
print(f"Atomic types: {[t.task_type for t in dag.tasks.values() if not dag.get_children(t.task_id)]}")
```

**Fix:** Adjust `_should_decompose()` logic or increase `MAX_RECURSION_DEPTH`

---

### Issue: Too many tasks generated

**Symptom:** `ValueError: DAG too large: 1234 tasks`

**Diagnosis:**
```python
print(f"Task count: {len(dag)}")
print(f"Tasks by type: {Counter(t.task_type for t in dag.tasks.values())}")
```

**Fix:** Increase `MAX_TOTAL_TASKS` or use lazy decomposition

---

## File Locations

```
/home/genesis/genesis-rebuild/
├── infrastructure/
│   ├── task_dag.py           # TaskDAG and Task classes
│   └── htdag_planner.py      # HTDAGPlanner implementation
├── tests/
│   └── test_htdag_planner.py # Test suite
├── demo_htdag.py             # 7 comprehensive demos
├── HTDAG_IMPLEMENTATION_SUMMARY.md
├── HTDAG_CODE_REVIEW.md
└── HTDAG_INTEGRATION_GUIDE.md  # This file
```

---

## Next Steps

1. **Phase 1.2:** Integrate with HALO router
2. **Phase 1.3:** Add AOP validation
3. **Phase 2:** LLM-powered decomposition
4. **Phase 3:** Cost-aware optimization with DAAO

---

**For Questions:**
- Architecture: Contact Cora
- Implementation: Contact Thon
- Testing: See `demo_htdag.py` for examples

**Status:** ✅ Ready for integration
