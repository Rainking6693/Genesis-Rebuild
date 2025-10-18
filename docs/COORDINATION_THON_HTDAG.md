# COORDINATION: THON - HTDAG IMPLEMENTATION
**Date:** October 17, 2025
**From:** Cora (Architecture Lead)
**To:** Thon (Python Implementation Lead)
**Subject:** HTDAGPlanner Implementation Specifications Ready

---

## 🎯 MISSION BRIEF

You are implementing **HTDAGPlanner**, the hierarchical task decomposition component of Genesis orchestration v2.0.

**Timeline:** Days 8-9 (October 17-18, 2025)
**Target:** ~200 lines of production-ready Python
**Status:** Architecture approved, specifications complete

---

## 📚 DOCUMENTATION YOU NEED

### Primary Reference
**File:** `/home/genesis/genesis-rebuild/docs/HTDAG_IMPLEMENTATION_GUIDE.md` (7,500+ words)

**Contains:**
- Complete algorithm specifications
- Step-by-step pseudocode
- Full Python class definitions
- LLM prompt templates
- 5 comprehensive test cases
- Integration points with HALO/AOP/DAAO

### Architecture Review
**File:** `/home/genesis/genesis-rebuild/docs/HTDAG_ARCHITECTURE_REVIEW.md` (4,000+ words)

**Contains:**
- Design decision rationale
- Security review and threat model
- Performance analysis
- Architecture diagrams
- ADRs (Architecture Decision Records)

### Original Design
**File:** `/home/genesis/genesis-rebuild/ORCHESTRATION_DESIGN.md` (Lines 305-550)

**Contains:**
- Research foundation (arXiv:2502.07056)
- Integration with existing DAAO router
- Security fixes (ISSUE #9 cycle/depth detection)

---

## 🏗️ WHAT YOU'RE BUILDING

### Component Hierarchy

```
HTDAGPlanner (your implementation)
    ├── Task (dataclass)
    │   └── 15 fields: id, description, type, status, dependencies, etc.
    ├── TaskDAG (graph wrapper)
    │   ├── networkx.DiGraph backend
    │   └── Methods: add_task, add_edge, topological_sort, etc.
    └── HTDAGPlanner (core class)
        ├── decompose_task() - Main algorithm
        ├── update_dag_dynamic() - Dynamic updates
        └── Helper methods - Validation, insertion, etc.
```

### Key Files to Create

1. **`infrastructure/orchestration/__init__.py`**
   - Empty (makes it a package)

2. **`infrastructure/orchestration/htdag.py`** (~200 lines)
   - Task dataclass (30 lines)
   - TaskDAG class (80 lines)
   - HTDAGPlanner class (90 lines)

3. **`tests/test_htdag.py`** (~150 lines)
   - Test 1: Simple decomposition
   - Test 2: Complex hierarchical decomposition
   - Test 3: Cycle detection
   - Test 4: Dynamic update with rollback
   - Test 5: Depth validation

---

## 🔑 CRITICAL SPECIFICATIONS

### 1. Data Structures (Copy These)

```python
from dataclasses import dataclass, field
from typing import List, Dict, Any, Optional
from enum import Enum
from datetime import datetime

class TaskStatus(Enum):
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    FAILED = "failed"
    BLOCKED = "blocked"

class TaskType(Enum):
    ROOT = "root"
    RESEARCH = "research"
    DESIGN = "design"
    BUILD = "build"
    DEPLOY = "deploy"
    TEST = "test"
    MARKET = "market"
    SUPPORT = "support"
    ANALYSIS = "analysis"
    GENERIC = "generic"

@dataclass
class Task:
    id: str
    description: str
    task_type: TaskType = TaskType.GENERIC
    status: TaskStatus = TaskStatus.PENDING
    dependencies: List[str] = field(default_factory=list)
    parent: Optional[str] = None
    children: List[str] = field(default_factory=list)
    priority: float = 0.5
    estimated_complexity: float = 0.5
    metadata: Dict[str, Any] = field(default_factory=dict)
    created_at: datetime = field(default_factory=datetime.now)
    updated_at: datetime = field(default_factory=datetime.now)
    result: Optional[Dict[str, Any]] = None
```

### 2. Core Algorithm (decompose_task)

**See:** HTDAG_IMPLEMENTATION_GUIDE.md, Section "CORE ALGORITHM"

**Steps:**
1. Classify request type (research/design/build/deploy/etc.)
2. Create root task + TaskDAG
3. Generate 3-5 initial subtasks via LLM
4. Recursive refinement (depth 0→3, only for complex tasks)
5. Validate (cycles, depth, dependencies)
6. Return validated DAG

**LLM Integration:**
- Use OpenAI client (or Anthropic)
- Model: GPT-4o
- Temperature: 0.3 (consistency)
- Response format: JSON mode
- Prompt template: See guide (Section "LLM Prompt Template")

### 3. Dynamic Updates (update_dag_dynamic)

**See:** HTDAG_IMPLEMENTATION_GUIDE.md, Section "DYNAMIC UPDATES"

**Steps:**
1. Mark completed tasks
2. LLM analyzes results → generate new subtasks if needed
3. Insert subtasks between parent and downstream dependencies
4. Validate: cycles (CRITICAL), depth, dependencies
5. Rollback to original DAG if validation fails

**Security Integration:**
```python
from infrastructure.security_utils import detect_dag_cycle, validate_dag_depth

# After inserting subtasks
adjacency_list = self._build_adjacency_list(dag)

# Check 1: Cycles
has_cycle, cycle_path = detect_dag_cycle(adjacency_list)
if has_cycle:
    logger.error(f"Cycle: {cycle_path}")
    return original_dag  # Rollback!

# Check 2: Depth
is_valid, depth = validate_dag_depth(adjacency_list, max_depth=10)
if not is_valid:
    logger.error(f"Depth {depth} exceeds 10")
    return original_dag  # Rollback!
```

---

## ✅ TEST CASES (MANDATORY)

### Test 1: Simple Decomposition
```python
async def test_simple_decomposition():
    planner = HTDAGPlanner(llm_client)
    dag = await planner.decompose_task("Fix typo in README.md")
    assert len(dag.tasks) >= 2
    assert dag.root_id == "root"
    execution_order = dag.topological_sort()
    assert execution_order[0] == "root"
```

### Test 2: Complex Hierarchical
```python
async def test_complex_decomposition():
    dag = await planner.decompose_task(
        "Build and deploy a SaaS for project management"
    )
    assert len(dag.tasks) > 5
    depths = {task.id: len(task.id.split('.')) for task in dag.get_all_tasks()}
    assert max(depths.values()) >= 2  # At least 2 levels
```

### Test 3: Cycle Detection
```python
def test_cycle_detection():
    from infrastructure.security_utils import detect_dag_cycle
    adjacency = {'A': ['B'], 'B': ['C'], 'C': ['A']}
    has_cycle, path = detect_dag_cycle(adjacency)
    assert has_cycle is True
    assert 'A' in path
```

### Test 4: Dynamic Update Rollback
```python
async def test_update_rollback():
    dag = await planner.decompose_task("Simple task")
    original_count = len(dag.tasks)

    # Simulate update that creates cycle
    updated_dag = await planner.update_dag_dynamic(
        dag, ["root.1"], {"creates_cycle": True}
    )

    # Should rollback
    assert len(updated_dag.tasks) == original_count
```

### Test 5: Depth Validation
```python
def test_depth_validation():
    from infrastructure.security_utils import validate_dag_depth
    adjacency = {f'L{i}': [f'L{i+1}'] for i in range(11)}
    is_valid, depth = validate_dag_depth(adjacency, max_depth=10)
    assert is_valid is False
    assert depth > 10
```

**ALL 5 TESTS MUST PASS BEFORE CLAIMING COMPLETION**

---

## 🔒 SECURITY REQUIREMENTS (NON-NEGOTIABLE)

### 1. Cycle Detection (CRITICAL)
- **Why:** Prevents infinite loops and system hang
- **How:** `detect_dag_cycle()` from security_utils
- **When:** After every DAG update
- **Action:** Rollback if cycle detected

### 2. Depth Validation (CRITICAL)
- **Why:** Prevents resource exhaustion
- **How:** `validate_dag_depth()` from security_utils
- **Limit:** Max 10 levels
- **Action:** Rollback if depth exceeded

### 3. Rollback Mechanism (CRITICAL)
- **Why:** Preserves system integrity
- **How:** `original_dag = dag.copy()` before updates
- **When:** Any validation failure
- **Action:** Return original_dag

**VIOLATION OF SECURITY REQUIREMENTS = IMPLEMENTATION REJECTED**

---

## 📊 CODE QUALITY STANDARDS

### Type Hints (Required)
```python
async def decompose_task(
    self,
    user_request: str,
    context: Dict[str, Any] = None
) -> TaskDAG:
```

### Docstrings (Required)
```python
"""
Decompose high-level request into HTDAG

Args:
    user_request: High-level user goal
    context: Additional context (budget, deadline, etc.)

Returns:
    TaskDAG with hierarchical structure

Raises:
    ValueError: If decomposition fails
"""
```

### Logging (Required)
```python
logger.info(f"Decomposition complete: {len(dag.tasks)} tasks")
logger.debug(f"Classified as: {request_type}")
logger.error(f"Cycle detected: {cycle_path}")
```

### Error Handling (Required)
```python
try:
    dag.topological_sort()
except ValueError as e:
    logger.error(f"Validation failed: {e}")
    raise
```

---

## 🚀 IMPLEMENTATION WORKFLOW

### Day 8: Core Implementation

**Morning (4 hours):**
1. Create directory structure
2. Implement Task + TaskDAG classes (80 lines)
3. Test basic graph operations (add_task, add_edge)

**Afternoon (4 hours):**
4. Implement HTDAGPlanner.__init__() (10 lines)
5. Implement decompose_task() (50 lines)
6. Implement helper methods (30 lines)
7. Test simple decomposition

**Evening:**
- Code review with Cora
- Address feedback

### Day 9: Dynamic Updates & Testing

**Morning (4 hours):**
1. Implement update_dag_dynamic() (40 lines)
2. Implement update helpers (30 lines)
3. Integrate security_utils validation
4. Test dynamic updates

**Afternoon (4 hours):**
5. Write all 5 test cases (100 lines)
6. Run tests, debug failures
7. Verify 100% pass rate
8. Code review with Cora

**Evening:**
- Final approval
- Merge to main

---

## 🎯 SUCCESS CRITERIA

### Functional (All Required)
- [ ] Decomposes user requests into hierarchical DAGs
- [ ] 3 levels of refinement (depth 0-3)
- [ ] Detects and prevents cycles
- [ ] Validates depth limits (max 10)
- [ ] Dynamically updates DAGs based on feedback
- [ ] Rolls back invalid updates

### Technical (All Required)
- [ ] ~200 lines of code
- [ ] Type hints on all public methods
- [ ] Docstrings on all classes/methods
- [ ] Logging (INFO/DEBUG/ERROR)
- [ ] 5/5 test cases pass (100%)
- [ ] Integration-ready for HALO router

### Security (All Required)
- [ ] Cycle detection via security_utils
- [ ] Depth validation via security_utils
- [ ] Rollback on validation failure
- [ ] No security violations

**FAILURE TO MEET ANY CRITERIA = REWORK REQUIRED**

---

## 🔗 DEPENDENCIES

### External Libraries
```bash
pip install networkx openai
```

### Internal Imports
```python
from infrastructure.security_utils import detect_dag_cycle, validate_dag_depth
from infrastructure.daao_router import get_daao_router  # Optional
```

---

## 📞 COORDINATION

### Questions?
1. Check HTDAG_IMPLEMENTATION_GUIDE.md first
2. Check HTDAG_ARCHITECTURE_REVIEW.md second
3. Ask Cora if still unclear

### Code Review Schedule
- **Day 8 Evening:** Review core implementation
- **Day 9 Afternoon:** Review tests and integration
- **Day 9 Evening:** Final approval

### Reporting
Update PROJECT_STATUS.md after:
- Core implementation complete (Day 8)
- Tests passing (Day 9)
- Final approval (Day 9)

---

## ⚠️ COMMON PITFALLS (AVOID THESE)

### 1. NetworkX Usage
❌ **Wrong:** `dag.graph.nodes[task_id] = task`
✅ **Right:** `dag.graph.add_node(task_id, task=task)`

### 2. Cycle Detection
❌ **Wrong:** Only check after full decomposition
✅ **Right:** Check after every update_dag_dynamic() call

### 3. LLM Parsing
❌ **Wrong:** Parse raw text response
✅ **Right:** Use `response_format={"type": "json_object"}`

### 4. Task IDs
❌ **Wrong:** Random UUIDs
✅ **Right:** Hierarchical IDs (root.1.2.3)

### 5. Validation
❌ **Wrong:** Continue on validation failure
✅ **Right:** Rollback immediately

---

## 🎯 FINAL CHECKLIST BEFORE CLAIMING DONE

- [ ] Task dataclass implemented (15 fields)
- [ ] TaskDAG class implemented (networkx wrapper)
- [ ] HTDAGPlanner.decompose_task() implemented
- [ ] HTDAGPlanner.update_dag_dynamic() implemented
- [ ] All helper methods implemented
- [ ] Security_utils integration complete
- [ ] Test 1 passes (simple decomposition)
- [ ] Test 2 passes (complex hierarchy)
- [ ] Test 3 passes (cycle detection)
- [ ] Test 4 passes (update rollback)
- [ ] Test 5 passes (depth validation)
- [ ] Type hints on all methods
- [ ] Docstrings on all classes/methods
- [ ] Logging at 3 levels
- [ ] Code review approved by Cora
- [ ] PROJECT_STATUS.md updated

**ONLY CLAIM COMPLETION WHEN ALL BOXES CHECKED**

---

**GOOD LUCK, THON!**

**You've got this. The specifications are complete. Just follow the guide.**

**- Cora (Architecture Lead)**
