"""
Demonstration of HTDAGPlanner capabilities
Shows hierarchical task decomposition and DAG features
"""
import asyncio
import logging
from infrastructure.task_dag import TaskDAG, Task, TaskStatus
from infrastructure.htdag_planner import HTDAGPlanner

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)


async def demo_basic_dag():
    """Demo 1: Basic TaskDAG operations"""
    print("\n" + "="*80)
    print("DEMO 1: Basic TaskDAG Operations")
    print("="*80)

    dag = TaskDAG()

    # Create a simple workflow: Design -> Implement -> Test -> Deploy
    tasks = [
        Task(task_id="design", task_type="design", description="Design system architecture"),
        Task(task_id="implement", task_type="implement", description="Implement core features"),
        Task(task_id="test", task_type="test_run", description="Run test suite"),
        Task(task_id="deploy", task_type="deploy", description="Deploy to production"),
    ]

    for task in tasks:
        dag.add_task(task)

    # Add dependencies (linear workflow)
    dag.add_dependency("design", "implement")
    dag.add_dependency("implement", "test")
    dag.add_dependency("test", "deploy")

    print(f"\nDAG Structure: {dag}")
    print(f"Root tasks: {dag.get_root_tasks()}")
    print(f"Leaf tasks: {dag.get_leaf_tasks()}")
    print(f"Max depth: {dag.max_depth()}")
    print(f"\nExecution order (topological sort):")
    for i, task_id in enumerate(dag.topological_sort(), 1):
        print(f"  {i}. {task_id}: {dag.tasks[task_id].description}")


async def demo_parallel_tasks():
    """Demo 2: DAG with parallel execution paths"""
    print("\n" + "="*80)
    print("DEMO 2: Parallel Task Execution")
    print("="*80)

    dag = TaskDAG()

    # Create a workflow with parallel branches
    tasks = [
        Task(task_id="init", task_type="api_call", description="Initialize project"),
        Task(task_id="frontend", task_type="implement", description="Build frontend"),
        Task(task_id="backend", task_type="implement", description="Build backend"),
        Task(task_id="database", task_type="implement", description="Setup database"),
        Task(task_id="integrate", task_type="test_run", description="Integration testing"),
    ]

    for task in tasks:
        dag.add_task(task)

    # Parallel branches from init
    dag.add_dependency("init", "frontend")
    dag.add_dependency("init", "backend")
    dag.add_dependency("init", "database")

    # All converge to integration
    dag.add_dependency("frontend", "integrate")
    dag.add_dependency("backend", "integrate")
    dag.add_dependency("database", "integrate")

    print(f"\nDAG Structure: {dag}")
    print(f"Children of 'init': {dag.get_children('init')}")
    print(f"Parents of 'integrate': {dag.get_parents('integrate')}")
    print(f"\nExecution order (respects dependencies):")
    for i, task_id in enumerate(dag.topological_sort(), 1):
        print(f"  {i}. {task_id}: {dag.tasks[task_id].description}")


async def demo_cycle_detection():
    """Demo 3: Cycle detection in DAG"""
    print("\n" + "="*80)
    print("DEMO 3: Cycle Detection")
    print("="*80)

    dag = TaskDAG()

    tasks = [
        Task(task_id="A", task_type="test", description="Task A"),
        Task(task_id="B", task_type="test", description="Task B"),
        Task(task_id="C", task_type="test", description="Task C"),
    ]

    for task in tasks:
        dag.add_task(task)

    # Create a cycle: A -> B -> C -> A
    dag.add_dependency("A", "B")
    dag.add_dependency("B", "C")
    dag.add_dependency("C", "A")  # Creates cycle!

    print(f"\nDAG has cycle: {dag.has_cycle()}")
    try:
        order = dag.topological_sort()
        print(f"Topological sort succeeded: {order}")
    except ValueError as e:
        print(f"Topological sort failed (expected): {e}")


async def demo_htdag_decomposition():
    """Demo 4: HTDAGPlanner hierarchical decomposition"""
    print("\n" + "="*80)
    print("DEMO 4: HTDAGPlanner Hierarchical Decomposition")
    print("="*80)

    planner = HTDAGPlanner()

    # Test 1: Simple task
    print("\nTest 1: Simple task")
    dag1 = await planner.decompose_task("Create a landing page")
    print(f"Result: {dag1}")
    print(f"Tasks: {list(dag1.tasks.keys())}")

    # Test 2: Business task (triggers multi-level decomposition)
    print("\nTest 2: Business creation task")
    dag2 = await planner.decompose_task("Build a SaaS business")
    print(f"Result: {dag2}")
    print(f"Max depth: {dag2.max_depth()}")
    print(f"\nTask hierarchy:")
    for task_id, task in dag2.tasks.items():
        indent = "  " * len(dag2.get_parents(task_id))
        print(f"{indent}{task_id} ({task.task_type}): {task.description}")


async def demo_dag_updates():
    """Demo 5: Dynamic DAG updates"""
    print("\n" + "="*80)
    print("DEMO 5: Dynamic DAG Updates")
    print("="*80)

    planner = HTDAGPlanner()

    # Start with initial decomposition
    dag = await planner.decompose_task("Build a SaaS business")
    print(f"\nInitial DAG: {dag}")

    # Simulate task completion
    completed_tasks = ["spec"]
    new_info = {"requirements": "Additional security features needed"}

    print(f"\nCompleting tasks: {completed_tasks}")
    updated_dag = await planner.update_dag_dynamic(dag, completed_tasks, new_info)

    print(f"Updated DAG: {updated_dag}")
    print(f"Status of 'spec': {updated_dag.tasks['spec'].status}")


async def demo_task_properties():
    """Demo 6: Task metadata and properties"""
    print("\n" + "="*80)
    print("DEMO 6: Task Metadata and Properties")
    print("="*80)

    # Create a task with full metadata
    task = Task(
        task_id="auth_feature",
        task_type="implement",
        description="Implement OAuth2 authentication",
        status=TaskStatus.PENDING,
        dependencies=["design_auth"],
        metadata={
            "priority": "high",
            "assigned_to": "SecurityAgent",
            "estimated_hours": 8,
            "tags": ["security", "authentication"]
        },
        agent_assigned="SecurityAgent",
        estimated_duration=8.0
    )

    print(f"\nTask: {task.task_id}")
    print(f"  Type: {task.task_type}")
    print(f"  Description: {task.description}")
    print(f"  Status: {task.status.value}")
    print(f"  Dependencies: {task.dependencies}")
    print(f"  Assigned to: {task.agent_assigned}")
    print(f"  Estimated duration: {task.estimated_duration}h")
    print(f"  Metadata: {task.metadata}")


async def demo_complex_workflow():
    """Demo 7: Complex real-world workflow"""
    print("\n" + "="*80)
    print("DEMO 7: Complex Real-World Workflow")
    print("="*80)

    dag = TaskDAG()

    # E-commerce platform development workflow
    tasks = [
        # Planning
        Task(task_id="requirements", task_type="design", description="Gather requirements"),
        Task(task_id="architecture", task_type="design", description="Design architecture"),

        # Parallel development
        Task(task_id="user_auth", task_type="implement", description="User authentication"),
        Task(task_id="product_catalog", task_type="implement", description="Product catalog"),
        Task(task_id="shopping_cart", task_type="implement", description="Shopping cart"),
        Task(task_id="payment", task_type="implement", description="Payment processing"),

        # Testing
        Task(task_id="unit_tests", task_type="test_run", description="Unit tests"),
        Task(task_id="integration_tests", task_type="test_run", description="Integration tests"),

        # Deployment
        Task(task_id="staging_deploy", task_type="deploy", description="Deploy to staging"),
        Task(task_id="prod_deploy", task_type="deploy", description="Deploy to production"),
    ]

    for task in tasks:
        dag.add_task(task)

    # Dependencies
    dag.add_dependency("requirements", "architecture")

    # Architecture leads to parallel development
    for impl_task in ["user_auth", "product_catalog", "shopping_cart", "payment"]:
        dag.add_dependency("architecture", impl_task)

    # All implementations must complete before testing
    for impl_task in ["user_auth", "product_catalog", "shopping_cart", "payment"]:
        dag.add_dependency(impl_task, "unit_tests")

    dag.add_dependency("unit_tests", "integration_tests")
    dag.add_dependency("integration_tests", "staging_deploy")
    dag.add_dependency("staging_deploy", "prod_deploy")

    print(f"\nE-commerce Platform DAG: {dag}")
    print(f"Max depth: {dag.max_depth()}")
    print(f"\nExecution order:")
    for i, task_id in enumerate(dag.topological_sort(), 1):
        task = dag.tasks[task_id]
        deps = f" (depends on: {', '.join(dag.get_parents(task_id))})" if dag.get_parents(task_id) else ""
        print(f"  {i}. {task_id}{deps}")
        print(f"      -> {task.description}")


async def main():
    """Run all demos"""
    await demo_basic_dag()
    await demo_parallel_tasks()
    await demo_cycle_detection()
    await demo_htdag_decomposition()
    await demo_dag_updates()
    await demo_task_properties()
    await demo_complex_workflow()

    print("\n" + "="*80)
    print("All demos completed successfully!")
    print("="*80)


if __name__ == "__main__":
    asyncio.run(main())
