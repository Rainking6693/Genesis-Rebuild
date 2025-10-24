---
title: HTDAG IMPLEMENTATION GUIDE
category: Architecture
dg-publish: true
publish: true
tags:
- '9'
source: docs/HTDAG_IMPLEMENTATION_GUIDE.md
exported: '2025-10-24T22:05:26.859527'
---

# HTDAG IMPLEMENTATION GUIDE
**Date:** October 17, 2025
**Architecture Lead:** Cora
**Implementation Lead:** Thon
**Purpose:** Complete technical specification for HTDAGPlanner implementation

---

## 🎯 EXECUTIVE SUMMARY

This guide provides complete implementation specifications for HTDAGPlanner, the hierarchical task decomposition component of Genesis orchestration v2.0.

**Research Foundation:** arXiv:2502.07056 (Deep Agent with HTDAG)
**Target:** ~200 lines of production-ready Python
**Timeline:** Days 8-9 (1-2 days)
**Integration:** HALO router → AOP validator → DAAO optimizer

**Key Features:**
- Hierarchical task decomposition into directed acyclic graph (DAG)
- Dynamic graph updates based on execution feedback
- Cycle detection and validation
- AATC tool creation (future enhancement)

---

## 📚 RESEARCH FIDELITY

### Paper: Deep Agent (arXiv:2502.07056)

**Core Algorithm (Section 3.2):**
1. **Input:** High-level user request
2. **Decomposition:** Recursive breakdown into subtasks
3. **Dependency Mapping:** Create parent-child relationships
4. **Validation:** Ensure acyclic structure
5. **Output:** Hierarchical TaskDAG

**Dynamic Updates (Section 3.3):**
- Tasks complete → analyze results
- New information → generate additional subtasks
- Insert subtasks → maintain DAG properties
- Rollback on validation failure

**Key Innovation:**
> "Unlike traditional linear decomposition, HTDAG maintains a directed acyclic graph where subtasks can have multiple dependencies and parallel execution paths."

**Expected Impact:**
- 30-40% faster execution (better parallelization)
- 20-30% cost reduction (smarter resource allocation)
- Fewer failures (dependency-aware planning)

---

## 🏗️ ARCHITECTURE OVERVIEW

### Component Hierarchy

```
GenesisOrchestratorV2
    ↓
HTDAGPlanner (this component)
    ├── TaskDAG (data structure)
    │   ├── Task (node)
    │   └── Edges (dependencies)
    ├── decompose_task() (core algorithm)
    ├── update_dag_dynamic() (dynamic updates)
    └── Helper methods (validation, insertion)
    ↓
HALORouter (next component)
```

### Data Flow

```
User Request
    ↓
[HTDAGPlanner.decompose_task()]
    ├── Classify request type
    ├── Generate initial DAG structure
    ├── Recursive refinement (depth=0-3)
    └── Validate acyclicity
    ↓
TaskDAG (hierarchical graph)
    ├── Root task (user request)
    ├── Subtasks (level 1)
    ├── Sub-subtasks (level 2)
    └── Atomic tasks (level 3)
    ↓
[HALORouter] (agent assignments)
```

---

## 📦 DATA STRUCTURES

### 1. Task Class

```python
from dataclasses import dataclass, field
from typing import List, Dict, Any, Optional
from enum import Enum
from datetime import datetime

class TaskStatus(Enum):
    """Task execution status"""
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    FAILED = "failed"
    BLOCKED = "blocked"  # Waiting on dependencies

class TaskType(Enum):
    """Task type categories"""
    ROOT = "root"           # Top-level user request
    RESEARCH = "research"   # Market/user/tech research
    DESIGN = "design"       # Architecture/schema/UI design
    BUILD = "build"         # Code implementation
    DEPLOY = "deploy"       # Infrastructure deployment
    TEST = "test"           # QA validation
    MARKET = "market"       # Marketing/sales activities
    SUPPORT = "support"     # Customer support
    ANALYSIS = "analysis"   # Data/metrics analysis
    GENERIC = "generic"     # Uncategorized

@dataclass
class Task:
    """
    Single task node in HTDAG

    Attributes:
        id: Unique task identifier (e.g., "task-001", "task-001.1")
        description: Human-readable task description
        task_type: Category of task (research, build, deploy, etc.)
        status: Current execution status
        dependencies: List of task IDs this task depends on
        parent: Parent task ID (None for root)
        children: List of child task IDs
        priority: Execution priority (0.0-1.0, higher=more urgent)
        estimated_complexity: Difficulty estimate (0.0-1.0)
        metadata: Additional task-specific data
        created_at: Task creation timestamp
        updated_at: Last modification timestamp
        result: Execution result (populated after completion)
    """
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

    def to_dict(self) -> Dict[str, Any]:
        """Serialize task to dictionary"""
        return {
            'id': self.id,
            'description': self.description,
            'task_type': self.task_type.value,
            'status': self.status.value,
            'dependencies': self.dependencies,
            'parent': self.parent,
            'children': self.children,
            'priority': self.priority,
            'estimated_complexity': self.estimated_complexity,
            'metadata': self.metadata,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
            'result': self.result
        }
```

### 2. TaskDAG Class

```python
import networkx as nx
from typing import List, Set, Optional, Dict
import logging

logger = logging.getLogger(__name__)

class TaskDAG:
    """
    Hierarchical Task Directed Acyclic Graph

    Uses networkx DiGraph for efficient graph operations:
    - Topological sorting for execution order
    - Cycle detection via topological_sort exceptions
    - Path finding for dependency analysis
    - Subgraph extraction for parallel execution

    Invariants:
    1. Must be acyclic (enforced by validation)
    2. Single root task (user request)
    3. All tasks reachable from root
    4. Dependencies must point to existing tasks
    """

    def __init__(self, root_task: Task):
        """
        Initialize DAG with root task

        Args:
            root_task: Top-level task (user request)
        """
        self.graph = nx.DiGraph()
        self.tasks: Dict[str, Task] = {}
        self.root_id = root_task.id

        # Add root task
        self.add_task(root_task)

        logger.info(f"TaskDAG initialized with root: {root_task.id}")

    def add_task(self, task: Task) -> None:
        """
        Add task to DAG

        Args:
            task: Task to add

        Raises:
            ValueError: If task ID already exists
        """
        if task.id in self.tasks:
            raise ValueError(f"Task {task.id} already exists in DAG")

        self.tasks[task.id] = task
        self.graph.add_node(task.id, task=task)

        logger.debug(f"Added task: {task.id}")

    def add_edge(self, parent_id: str, child_id: str) -> None:
        """
        Add dependency edge (parent → child)

        Args:
            parent_id: Parent task ID
            child_id: Child task ID

        Raises:
            ValueError: If either task doesn't exist
        """
        if parent_id not in self.tasks:
            raise ValueError(f"Parent task {parent_id} not found")
        if child_id not in self.tasks:
            raise ValueError(f"Child task {child_id} not found")

        # Add edge to graph
        self.graph.add_edge(parent_id, child_id)

        # Update task relationships
        parent_task = self.tasks[parent_id]
        child_task = self.tasks[child_id]

        if child_id not in parent_task.children:
            parent_task.children.append(child_id)

        if parent_id not in child_task.dependencies:
            child_task.dependencies.append(parent_id)

        logger.debug(f"Added edge: {parent_id} → {child_id}")

    def get_task(self, task_id: str) -> Task:
        """Get task by ID"""
        if task_id not in self.tasks:
            raise ValueError(f"Task {task_id} not found")
        return self.tasks[task_id]

    def get_all_tasks(self) -> List[Task]:
        """Get all tasks in DAG"""
        return list(self.tasks.values())

    def get_all_task_ids(self) -> Set[str]:
        """Get all task IDs"""
        return set(self.tasks.keys())

    def get_children(self, task_id: str) -> List[Task]:
        """Get immediate children of task"""
        task = self.get_task(task_id)
        return [self.get_task(child_id) for child_id in task.children]

    def get_downstream_tasks(self, task_id: str) -> List[str]:
        """
        Get all downstream tasks (children, grandchildren, etc.)

        Uses networkx descendants for efficient traversal
        """
        return list(nx.descendants(self.graph, task_id))

    def topological_sort(self) -> List[str]:
        """
        Get execution order (topological sort)

        Returns:
            List of task IDs in execution order

        Raises:
            ValueError: If graph contains cycle (not a DAG)
        """
        try:
            return list(nx.topological_sort(self.graph))
        except nx.NetworkXError as e:
            raise ValueError(f"DAG contains cycle: {e}")

    def mark_complete(self, task_id: str) -> None:
        """Mark task as completed"""
        task = self.get_task(task_id)
        task.status = TaskStatus.COMPLETED
        task.updated_at = datetime.now()
        logger.info(f"Task {task_id} marked complete")

    def copy(self) -> 'TaskDAG':
        """
        Create deep copy of DAG

        Used for rollback on validation failure
        """
        import copy
        new_dag = TaskDAG(copy.deepcopy(self.tasks[self.root_id]))

        # Copy all tasks except root (already added)
        for task_id, task in self.tasks.items():
            if task_id != self.root_id:
                new_dag.add_task(copy.deepcopy(task))

        # Copy all edges
        for parent_id, child_id in self.graph.edges():
            if parent_id != self.root_id or child_id not in new_dag.tasks:
                new_dag.add_edge(parent_id, child_id)

        return new_dag

    def to_dict(self) -> Dict[str, Any]:
        """Serialize DAG to dictionary"""
        return {
            'root_id': self.root_id,
            'tasks': {task_id: task.to_dict() for task_id, task in self.tasks.items()},
            'edges': list(self.graph.edges()),
            'task_count': len(self.tasks)
        }
```

---

## 🧠 CORE ALGORITHM: decompose_task()

### Algorithm Overview

**Goal:** Convert high-level user request into hierarchical task DAG

**Steps:**
1. **Classify:** Determine request type (build SaaS, research market, deploy app, etc.)
2. **Generate:** Create initial DAG structure via LLM decomposition
3. **Refine:** Recursively decompose complex subtasks (depth 0-3)
4. **Validate:** Ensure acyclic structure and valid dependencies
5. **Return:** Complete TaskDAG ready for routing

### Pseudocode

```
FUNCTION decompose_task(user_request: str, context: Dict) -> TaskDAG:
    // Step 1: Classify request
    request_type = classify_request(user_request)

    // Step 2: Generate initial DAG
    root_task = create_root_task(user_request, request_type)
    dag = TaskDAG(root_task)

    initial_subtasks = generate_subtasks_llm(user_request, request_type, depth=0)

    FOR each subtask IN initial_subtasks:
        dag.add_task(subtask)
        dag.add_edge(root_task.id, subtask.id)

    // Step 3: Recursive refinement (depth 0 → 3)
    FOR depth FROM 0 TO max_depth:
        FOR each task IN dag.get_all_tasks():
            IF task.estimated_complexity > 0.6 AND task has no children:
                child_subtasks = generate_subtasks_llm(task.description, task.type, depth+1)

                FOR each child IN child_subtasks:
                    dag.add_task(child)
                    dag.add_edge(task.id, child.id)

    // Step 4: Validate DAG properties
    IF has_cycle(dag):
        RAISE ValueError("Generated DAG contains cycle")

    IF NOT all_tasks_reachable(dag):
        RAISE ValueError("DAG has disconnected components")

    // Step 5: Return validated DAG
    RETURN dag
```

### LLM Prompt Template (generate_subtasks_llm)

```python
DECOMPOSITION_PROMPT = """
You are a task decomposition expert. Break down the following task into 3-5 concrete subtasks.

Task: {task_description}
Task Type: {task_type}
Complexity: {complexity}
Current Depth: {depth}/3

Requirements:
1. Each subtask must be a distinct, actionable step
2. Subtasks should be ordered by dependencies (what must come first)
3. Be specific - avoid vague descriptions
4. Consider: research, design, implementation, testing, deployment
5. For depth 0: Create high-level phases
6. For depth 1-2: Break phases into concrete steps
7. For depth 3: Create atomic actions (no further decomposition)

Output Format (JSON):
{{
    "subtasks": [
        {{
            "description": "Specific task description",
            "task_type": "research|design|build|deploy|test|market|support|analysis",
            "estimated_complexity": 0.0-1.0,
            "priority": 0.0-1.0,
            "metadata": {{}}
        }},
        ...
    ]
}}

Example for "Build SaaS for project management":
{{
    "subtasks": [
        {{
            "description": "Research market and identify target users",
            "task_type": "research",
            "estimated_complexity": 0.4,
            "priority": 0.9,
            "metadata": {{"requires_tools": ["web_search", "reddit_api"]}}
        }},
        {{
            "description": "Design database schema and API architecture",
            "task_type": "design",
            "estimated_complexity": 0.7,
            "priority": 0.8,
            "metadata": {{"requires_tools": ["database", "api_design"]}}
        }},
        {{
            "description": "Implement backend API with authentication",
            "task_type": "build",
            "estimated_complexity": 0.9,
            "priority": 0.7,
            "metadata": {{"requires_tools": ["code", "auth", "database"]}}
        }},
        {{
            "description": "Deploy infrastructure and CI/CD pipeline",
            "task_type": "deploy",
            "estimated_complexity": 0.6,
            "priority": 0.6,
            "metadata": {{"requires_tools": ["docker", "vercel", "github_actions"]}}
        }}
    ]
}}

Now decompose this task:
"""
```

### Implementation Code

```python
from typing import Dict, Any, List
import logging
from openai import AsyncOpenAI  # or Anthropic client

logger = logging.getLogger(__name__)

class HTDAGPlanner:
    """Hierarchical Task DAG Planner"""

    MAX_DECOMPOSITION_DEPTH = 3
    COMPLEXITY_THRESHOLD_FOR_DECOMPOSITION = 0.6

    def __init__(self, llm_client):
        """
        Initialize planner

        Args:
            llm_client: LLM client (OpenAI, Anthropic, etc.)
        """
        self.llm_client = llm_client
        self.task_registry = {}  # Store task templates for reuse

    async def decompose_task(
        self,
        user_request: str,
        context: Dict[str, Any] = None
    ) -> TaskDAG:
        """
        Decompose high-level request into HTDAG

        Args:
            user_request: High-level user goal
            context: Additional context (budget, deadline, etc.)

        Returns:
            TaskDAG with hierarchical structure

        Raises:
            ValueError: If decomposition fails or creates invalid DAG
        """
        if not user_request or not user_request.strip():
            raise ValueError("User request cannot be empty")

        context = context or {}

        logger.info(f"Starting task decomposition: {user_request[:100]}...")

        # Step 1: Classify request
        request_type = self._classify_request(user_request)
        logger.debug(f"Classified as: {request_type}")

        # Step 2: Create root task
        root_task = Task(
            id="root",
            description=user_request,
            task_type=request_type,
            priority=1.0,
            estimated_complexity=0.9,  # High-level requests are complex
            metadata={'context': context}
        )

        dag = TaskDAG(root_task)

        # Step 3: Generate initial decomposition
        initial_subtasks = await self._generate_subtasks_llm(
            task_description=user_request,
            task_type=request_type,
            depth=0,
            max_subtasks=5
        )

        logger.info(f"Generated {len(initial_subtasks)} initial subtasks")

        for i, subtask_data in enumerate(initial_subtasks):
            subtask = Task(
                id=f"root.{i+1}",
                description=subtask_data['description'],
                task_type=TaskType(subtask_data.get('task_type', 'generic')),
                parent="root",
                priority=subtask_data.get('priority', 0.5),
                estimated_complexity=subtask_data.get('estimated_complexity', 0.5),
                metadata=subtask_data.get('metadata', {})
            )

            dag.add_task(subtask)
            dag.add_edge("root", subtask.id)

        # Step 4: Recursive refinement
        dag = await self._refine_dag_recursive(dag, depth=0, max_depth=self.MAX_DECOMPOSITION_DEPTH)

        # Step 5: Validate final DAG
        self._validate_dag(dag)

        logger.info(f"Decomposition complete: {len(dag.tasks)} total tasks")

        return dag

    def _classify_request(self, request: str) -> TaskType:
        """
        Classify user request into task type

        Simple keyword matching (could be enhanced with LLM)
        """
        request_lower = request.lower()

        if any(kw in request_lower for kw in ['research', 'analyze', 'investigate', 'study']):
            return TaskType.RESEARCH
        elif any(kw in request_lower for kw in ['design', 'architect', 'schema', 'plan']):
            return TaskType.DESIGN
        elif any(kw in request_lower for kw in ['build', 'implement', 'code', 'create', 'develop']):
            return TaskType.BUILD
        elif any(kw in request_lower for kw in ['deploy', 'launch', 'ship', 'release']):
            return TaskType.DEPLOY
        elif any(kw in request_lower for kw in ['test', 'qa', 'validate', 'verify']):
            return TaskType.TEST
        elif any(kw in request_lower for kw in ['market', 'advertise', 'promote', 'seo']):
            return TaskType.MARKET
        elif any(kw in request_lower for kw in ['support', 'help', 'assist', 'customer']):
            return TaskType.SUPPORT
        else:
            return TaskType.GENERIC

    async def _generate_subtasks_llm(
        self,
        task_description: str,
        task_type: TaskType,
        depth: int,
        max_subtasks: int = 5
    ) -> List[Dict[str, Any]]:
        """
        Generate subtasks using LLM decomposition

        Returns list of subtask dictionaries
        """
        prompt = DECOMPOSITION_PROMPT.format(
            task_description=task_description,
            task_type=task_type.value,
            complexity=0.8 if depth == 0 else 0.5,
            depth=depth
        )

        # Call LLM (example with OpenAI - adapt for your client)
        response = await self.llm_client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You are a task decomposition expert."},
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"},
            temperature=0.3  # Low temperature for consistent decomposition
        )

        import json
        result = json.loads(response.choices[0].message.content)

        subtasks = result.get('subtasks', [])

        # Limit to max_subtasks
        return subtasks[:max_subtasks]

    async def _refine_dag_recursive(
        self,
        dag: TaskDAG,
        depth: int,
        max_depth: int
    ) -> TaskDAG:
        """
        Recursively refine complex tasks

        Decompose tasks with complexity > threshold
        """
        if depth >= max_depth:
            logger.debug(f"Reached max depth {max_depth}, stopping refinement")
            return dag

        tasks_to_refine = [
            task for task in dag.get_all_tasks()
            if task.estimated_complexity > self.COMPLEXITY_THRESHOLD_FOR_DECOMPOSITION
            and len(task.children) == 0  # No children yet
            and task.id != "root"  # Don't re-decompose root
        ]

        logger.debug(f"Depth {depth}: Refining {len(tasks_to_refine)} complex tasks")

        for task in tasks_to_refine:
            subtasks_data = await self._generate_subtasks_llm(
                task_description=task.description,
                task_type=task.task_type,
                depth=depth + 1,
                max_subtasks=4  # Fewer subtasks at deeper levels
            )

            for i, subtask_data in enumerate(subtasks_data):
                subtask = Task(
                    id=f"{task.id}.{i+1}",
                    description=subtask_data['description'],
                    task_type=TaskType(subtask_data.get('task_type', task.task_type.value)),
                    parent=task.id,
                    priority=subtask_data.get('priority', task.priority * 0.9),
                    estimated_complexity=subtask_data.get('estimated_complexity', 0.5),
                    metadata=subtask_data.get('metadata', {})
                )

                dag.add_task(subtask)
                dag.add_edge(task.id, subtask.id)

        # Continue recursion
        return await self._refine_dag_recursive(dag, depth + 1, max_depth)

    def _validate_dag(self, dag: TaskDAG) -> None:
        """
        Validate DAG properties

        Raises ValueError if invalid
        """
        # Check 1: Acyclic
        try:
            dag.topological_sort()
        except ValueError as e:
            raise ValueError(f"DAG validation failed: {e}")

        # Check 2: All tasks reachable from root
        reachable = set(nx.descendants(dag.graph, dag.root_id))
        reachable.add(dag.root_id)

        all_tasks = dag.get_all_task_ids()

        unreachable = all_tasks - reachable
        if unreachable:
            raise ValueError(f"Unreachable tasks: {unreachable}")

        logger.info("DAG validation passed")
```

---

## 🔄 DYNAMIC UPDATES: update_dag_dynamic()

### Algorithm Overview

**Goal:** Adapt DAG based on task execution feedback

**Triggers:**
- Task completes with unexpected results
- New requirements discovered during execution
- Dependencies change (e.g., API unavailable, need workaround)

**Safety:**
- Validate acyclicity after updates
- Validate depth limits (prevent resource exhaustion)
- Rollback on validation failure

### Implementation

```python
def _build_adjacency_list(self, dag: TaskDAG) -> dict:
    """
    Build adjacency list for cycle detection

    Returns dict mapping task_id → [child_ids]
    """
    adjacency = {}
    for task_id in dag.get_all_task_ids():
        task = dag.get_task(task_id)
        adjacency[task_id] = task.children
    return adjacency

async def update_dag_dynamic(
    self,
    dag: TaskDAG,
    completed_tasks: List[str],
    new_info: Dict[str, Any]
) -> TaskDAG:
    """
    Update DAG based on execution feedback

    Algorithm:
    1. Mark completed tasks as DONE
    2. Analyze results for new subtask requirements
    3. Generate and insert new subtasks
    4. Validate acyclicity (SECURITY: prevents infinite loops)
    5. Validate depth (SECURITY: prevents resource exhaustion)
    6. Rollback if validation fails

    Args:
        dag: Current task DAG
        completed_tasks: List of task IDs that just completed
        new_info: Execution results and discovered requirements

    Returns:
        Updated DAG (or original if validation fails)

    Example:
        >>> dag = planner.decompose_task("Build SaaS")
        >>> # After "design_schema" completes...
        >>> new_info = {"requires_migration": True}
        >>> dag = planner.update_dag_dynamic(
        ...     dag,
        ...     completed_tasks=["root.2.1"],  # design_schema
        ...     new_info=new_info
        ... )
        >>> # DAG now includes "setup_migration" task
    """
    original_dag = dag.copy()

    try:
        # Step 1: Mark completed
        for task_id in completed_tasks:
            dag.mark_complete(task_id)
            logger.info(f"Marked task {task_id} as complete")

        # Step 2-3: Generate and insert new subtasks
        for task_id in completed_tasks:
            new_subtasks = await self._generate_subtasks_from_results(
                task_id,
                new_info
            )

            if new_subtasks:
                logger.info(f"Task {task_id} discovered {len(new_subtasks)} new subtasks")
                dag = self._insert_subtasks(dag, task_id, new_subtasks)

        # Step 4: Validate acyclicity (CRITICAL SECURITY CHECK)
        # ISSUE #9 FIX: Cycle detection prevents resource exhaustion
        from infrastructure.security_utils import detect_dag_cycle

        adjacency_list = self._build_adjacency_list(dag)
        has_cycle, cycle_path = detect_dag_cycle(adjacency_list)

        if has_cycle:
            logger.error(f"DAG update created cycle: {' → '.join(cycle_path)}")
            return original_dag

        # Step 5: Validate depth (SECURITY: prevents excessive recursion)
        # ISSUE #9 FIX: Depth validation prevents resource exhaustion
        from infrastructure.security_utils import validate_dag_depth

        is_depth_ok, actual_depth = validate_dag_depth(adjacency_list, max_depth=10)

        if not is_depth_ok:
            logger.error(f"DAG depth ({actual_depth}) exceeds limit (10) - rejecting update")
            return original_dag

        # Step 6: Validate dependencies
        if not self._validate_dependencies(dag):
            logger.error("DAG update has invalid dependencies - rejecting")
            return original_dag

        logger.info(f"DAG updated successfully: {len(dag.tasks)} total tasks")
        return dag

    except Exception as e:
        logger.error(f"DAG update failed: {e}")
        return original_dag  # Rollback

def _validate_dependencies(self, dag: TaskDAG) -> bool:
    """Ensure all dependencies point to existing nodes"""
    all_task_ids = dag.get_all_task_ids()

    for task in dag.get_all_tasks():
        for dep_id in task.dependencies:
            if dep_id not in all_task_ids:
                logger.error(f"Task {task.id} has invalid dependency: {dep_id}")
                return False

    return True

async def _generate_subtasks_from_results(
    self,
    task_id: str,
    new_info: Dict[str, Any]
) -> List[Task]:
    """
    Use LLM to determine if completed task results suggest new subtasks

    Returns empty list if no new subtasks needed
    """
    task = self.task_registry.get(task_id)
    if not task:
        return []

    # Ask LLM: "Given this task result, are new subtasks needed?"
    prompt = f"""
    Task completed: {task.description}
    Results: {new_info}

    Analyze the results. Do they reveal:
    - Missing prerequisites that should have been done first?
    - New requirements discovered during execution?
    - Additional work needed before downstream tasks?

    If yes, generate 1-3 subtask descriptions. If no, return empty list.

    Output Format (JSON):
    {{
        "needs_subtasks": true/false,
        "reasoning": "Why new subtasks are needed",
        "subtasks": [
            {{
                "description": "Specific subtask",
                "task_type": "research|design|build|deploy|test",
                "priority": 0.0-1.0,
                "estimated_complexity": 0.0-1.0
            }}
        ]
    }}
    """

    response = await self.llm_client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "You are a task planning expert."},
            {"role": "user", "content": prompt}
        ],
        response_format={"type": "json_object"},
        temperature=0.3
    )

    import json
    result = json.loads(response.choices[0].message.content)

    if not result.get('needs_subtasks', False):
        return []

    # Convert descriptions to Task objects
    subtasks = []
    for i, subtask_data in enumerate(result.get('subtasks', [])):
        subtask = Task(
            id=f"{task_id}_discovered_{i}",
            description=subtask_data['description'],
            task_type=TaskType(subtask_data.get('task_type', 'generic')),
            parent=task_id,
            priority=subtask_data.get('priority', task.priority + 0.1),
            estimated_complexity=subtask_data.get('estimated_complexity', 0.5)
        )
        subtasks.append(subtask)

    return subtasks

def _insert_subtasks(
    self,
    dag: TaskDAG,
    parent_id: str,
    subtasks: List[Task]
) -> TaskDAG:
    """
    Insert new subtasks into DAG structure

    Inserts between parent and its downstream dependencies
    """
    parent_task = dag.get_task(parent_id)

    for subtask in subtasks:
        # Add subtask to DAG
        dag.add_task(subtask)

        # Connect parent → subtask
        dag.add_edge(parent_id, subtask.id)

        # If parent has downstream tasks, connect subtask → downstream
        # This ensures new work happens before proceeding
        downstream_tasks = dag.get_downstream_tasks(parent_id)
        for downstream_id in downstream_tasks:
            dag.add_edge(subtask.id, downstream_id)

    return dag
```

---

## ✅ VALIDATION & SECURITY

### Cycle Detection (CRITICAL)

**Why:** Cycles cause infinite loops and resource exhaustion
**How:** DFS-based cycle detection
**Integration:** Use `infrastructure/security_utils.py::detect_dag_cycle()`

**Algorithm:**
1. Build adjacency list from DAG
2. Run DFS with recursion stack tracking
3. If node visited while in recursion stack → cycle detected
4. Return cycle path for debugging

**Security Impact:**
- Prevents DoS via malicious task graphs
- Protects against LLM hallucination creating cycles
- Enables safe rollback on validation failure

### Depth Validation (SECURITY)

**Why:** Deep DAGs cause excessive recursion and memory usage
**How:** Calculate maximum depth from root nodes
**Limit:** 10 levels (configurable)

**Security Impact:**
- Prevents resource exhaustion
- Limits attack surface for deep task injection
- Maintains system responsiveness

### Dependency Validation

**Why:** Invalid dependencies cause runtime failures
**How:** Check all dependency IDs exist in DAG
**Rollback:** Restore original DAG if validation fails

---

## 🧪 TEST CASES FOR THON

### Test 1: Simple Decomposition

```python
async def test_simple_decomposition():
    """Test decomposition of simple request"""
    planner = HTDAGPlanner(llm_client)

    dag = await planner.decompose_task(
        "Fix typo in README.md",
        context={}
    )

    assert len(dag.tasks) >= 2  # Root + at least 1 subtask
    assert dag.root_id == "root"

    # Should be executable (no cycles)
    execution_order = dag.topological_sort()
    assert execution_order[0] == "root"
```

### Test 2: Complex Hierarchical Decomposition

```python
async def test_complex_decomposition():
    """Test decomposition of complex multi-step request"""
    planner = HTDAGPlanner(llm_client)

    dag = await planner.decompose_task(
        "Build and deploy a SaaS application for project management",
        context={'budget': 1000, 'deadline': '30 days'}
    )

    # Should have multiple levels
    assert len(dag.tasks) > 5

    # Should have tasks at different depths
    depths = {task.id: len(task.id.split('.')) for task in dag.get_all_tasks()}
    assert max(depths.values()) >= 2  # At least 2 levels deep

    # Should be acyclic
    execution_order = dag.topological_sort()
    assert len(execution_order) == len(dag.tasks)
```

### Test 3: Cycle Detection

```python
def test_cycle_detection():
    """Test that cycle detection prevents invalid DAGs"""
    from infrastructure.security_utils import detect_dag_cycle

    # Create cyclic adjacency list
    adjacency = {
        'A': ['B'],
        'B': ['C'],
        'C': ['A']  # Cycle!
    }

    has_cycle, cycle_path = detect_dag_cycle(adjacency)

    assert has_cycle is True
    assert 'A' in cycle_path
    assert 'B' in cycle_path
    assert 'C' in cycle_path
```

### Test 4: Dynamic Update with Rollback

```python
async def test_dynamic_update_rollback():
    """Test that invalid updates are rolled back"""
    planner = HTDAGPlanner(llm_client)

    dag = await planner.decompose_task("Simple task", context={})
    original_task_count = len(dag.tasks)

    # Simulate update that would create cycle
    # (Implementation would need to mock LLM to return cyclic subtasks)

    updated_dag = await planner.update_dag_dynamic(
        dag,
        completed_tasks=["root.1"],
        new_info={"creates_cycle": True}
    )

    # Should rollback to original
    assert len(updated_dag.tasks) == original_task_count
```

### Test 5: Depth Validation

```python
def test_depth_validation():
    """Test that excessive depth is rejected"""
    from infrastructure.security_utils import validate_dag_depth

    # Create deep DAG (11 levels)
    adjacency = {f'level_{i}': [f'level_{i+1}'] for i in range(11)}

    is_valid, actual_depth = validate_dag_depth(adjacency, max_depth=10)

    assert is_valid is False
    assert actual_depth > 10
```

---

## 🔗 INTEGRATION POINTS

### With HALO Router

```python
# HTDAGPlanner output → HALORouter input
dag = await htdag_planner.decompose_task(user_request)

# HALORouter takes DAG and assigns agents
routing_plan = await halo_router.route_tasks(dag, available_agents)
```

### With AOP Validator

```python
# After routing, validate plan
validation = await aop_validator.validate_routing_plan(routing_plan, dag)

if not validation.is_valid():
    # Adjust plan based on validation feedback
    routing_plan = await adjust_plan(routing_plan, validation)
```

### With DAAO Optimizer

```python
# After validation, optimize costs
optimized_plan = await daao_optimizer.optimize_routing(routing_plan)
```

---

## 📊 EXPECTED RESULTS

### Performance Metrics

| Metric | Target | Validation Method |
|--------|--------|-------------------|
| Decomposition Time | <5 seconds for typical request | Timing tests |
| Task Count | 5-50 tasks depending on complexity | Count assertions |
| Max Depth | ≤10 levels | Depth validation |
| Cycle Detection | 0 false negatives | Cycle test cases |
| Memory Usage | <100MB for typical DAG | Memory profiling |

### Research Fidelity

✅ Hierarchical decomposition (not linear chains)
✅ Dynamic updates based on execution feedback
✅ Acyclic validation with rollback
✅ Multi-level refinement (depth 0-3)
✅ Task type classification
✅ Complexity-based decomposition threshold

---

## 🚀 IMPLEMENTATION CHECKLIST FOR THON

### Day 8: Core Implementation

- [ ] Create `infrastructure/orchestration/` directory
- [ ] Implement `Task` dataclass with all fields
- [ ] Implement `TaskDAG` class with networkx
- [ ] Implement `HTDAGPlanner.__init__()`
- [ ] Implement `HTDAGPlanner.decompose_task()` core logic
- [ ] Implement `_classify_request()` helper
- [ ] Implement `_generate_subtasks_llm()` with LLM integration
- [ ] Implement `_refine_dag_recursive()` refinement loop
- [ ] Implement `_validate_dag()` validation

### Day 9: Dynamic Updates & Testing

- [ ] Implement `update_dag_dynamic()` core logic
- [ ] Implement `_generate_subtasks_from_results()` LLM call
- [ ] Implement `_insert_subtasks()` graph modification
- [ ] Implement `_validate_dependencies()` check
- [ ] Implement `_build_adjacency_list()` helper
- [ ] Integrate `security_utils` cycle detection
- [ ] Integrate `security_utils` depth validation
- [ ] Write Test 1: Simple decomposition
- [ ] Write Test 2: Complex decomposition
- [ ] Write Test 3: Cycle detection
- [ ] Write Test 4: Dynamic update rollback
- [ ] Write Test 5: Depth validation
- [ ] Run all tests and verify 100% pass rate

### Documentation

- [ ] Add docstrings to all methods
- [ ] Add type hints to all parameters
- [ ] Add usage examples in module docstring
- [ ] Create `docs/HTDAG_USAGE_EXAMPLES.md`

---

## 📝 CODE QUALITY STANDARDS

### Type Hints

```python
async def decompose_task(
    self,
    user_request: str,
    context: Dict[str, Any] = None
) -> TaskDAG:
```

### Docstrings

```python
def add_task(self, task: Task) -> None:
    """
    Add task to DAG

    Args:
        task: Task to add

    Raises:
        ValueError: If task ID already exists
    """
```

### Error Handling

```python
try:
    dag.topological_sort()
except ValueError as e:
    logger.error(f"Cycle detected: {e}")
    raise ValueError(f"DAG validation failed: {e}")
```

### Logging

```python
logger.info(f"Decomposition complete: {len(dag.tasks)} total tasks")
logger.debug(f"Classified as: {request_type}")
logger.error(f"DAG update created cycle: {cycle_path}")
```

---

## 🎯 SUCCESS CRITERIA

### Functional

✅ Decomposes user requests into hierarchical DAGs
✅ Supports 3 levels of refinement (depth 0-3)
✅ Detects and prevents cycles
✅ Validates depth limits (max 10)
✅ Dynamically updates DAGs based on execution feedback
✅ Rolls back invalid updates

### Non-Functional

✅ ~200 lines of production-ready code
✅ 100% test coverage on critical paths
✅ Type hints on all public methods
✅ Docstrings on all classes and methods
✅ Logging at INFO, DEBUG, ERROR levels
✅ Integration-ready for HALO router

### Research Fidelity

✅ Follows arXiv:2502.07056 algorithm faithfully
✅ Hierarchical (not linear) decomposition
✅ Dynamic updates with validation
✅ Security-first design (cycle/depth checks)

---

**Document Complete**
**Ready for Implementation by Thon**
**Architecture Approved by Cora**

**Next:** Thon implements HTDAGPlanner over Days 8-9
