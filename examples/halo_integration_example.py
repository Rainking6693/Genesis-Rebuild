"""
HTDAG → HALO Integration Example
Demonstrates how TaskDAG flows into HALORouter for agent assignment

This example shows:
1. Creating a hierarchical task DAG (HTDAG)
2. Routing tasks to agents via HALO
3. Explainability of routing decisions
4. Workload tracking and load balancing
"""
import asyncio
import logging
from infrastructure.task_dag import TaskDAG, Task, TaskStatus
from infrastructure.halo_router import HALORouter
from infrastructure.routing_rules import get_genesis_15_agents, get_routing_rules

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


async def example_1_simple_saas_build():
    """
    Example 1: Simple SaaS build pipeline
    Demonstrates basic HTDAG → HALO flow
    """
    logger.info("=" * 80)
    logger.info("EXAMPLE 1: Simple SaaS Build Pipeline")
    logger.info("=" * 80)

    # Step 1: Create hierarchical task DAG
    dag = TaskDAG()

    # Create tasks
    design = Task(
        task_id="design_system",
        task_type="design",
        description="Design SaaS architecture"
    )
    implement = Task(
        task_id="implement_mvp",
        task_type="implement",
        description="Build MVP"
    )
    test = Task(
        task_id="test_mvp",
        task_type="test",
        description="Test MVP"
    )
    deploy = Task(
        task_id="deploy_production",
        task_type="deploy",
        description="Deploy to production"
    )

    # Add tasks to DAG
    dag.add_task(design)
    dag.add_task(implement)
    dag.add_task(test)
    dag.add_task(deploy)

    # Add dependencies (linear pipeline)
    dag.add_dependency("design_system", "implement_mvp")
    dag.add_dependency("implement_mvp", "test_mvp")
    dag.add_dependency("test_mvp", "deploy_production")

    logger.info(f"Created DAG: {dag}")
    logger.info(f"Topological order: {dag.topological_sort()}")

    # Step 2: Route tasks via HALO
    router = HALORouter()
    routing_plan = await router.route_tasks(dag)

    # Step 3: Display routing results
    logger.info("\n" + "=" * 80)
    logger.info("ROUTING RESULTS:")
    logger.info("=" * 80)

    for task_id, agent in routing_plan.assignments.items():
        explanation = routing_plan.explanations[task_id]
        logger.info(f"✓ {task_id} → {agent}")
        logger.info(f"  Reason: {explanation}")

    # Step 4: Display workload distribution
    workload = routing_plan.get_agent_workload()
    logger.info("\n" + "=" * 80)
    logger.info("WORKLOAD DISTRIBUTION:")
    logger.info("=" * 80)
    for agent, count in sorted(workload.items(), key=lambda x: x[1], reverse=True):
        if count > 0:
            logger.info(f"  {agent}: {count} tasks")

    return routing_plan


async def example_2_full_saas_lifecycle():
    """
    Example 2: Full SaaS business lifecycle
    Demonstrates parallel tasks, complex dependencies, and diverse agent types
    """
    logger.info("\n\n" + "=" * 80)
    logger.info("EXAMPLE 2: Full SaaS Business Lifecycle")
    logger.info("=" * 80)

    dag = TaskDAG()

    # Phase 1: Research & Planning (parallel)
    research_market = Task(
        task_id="research_market",
        task_type="research",
        description="Research market opportunities"
    )
    design_architecture = Task(
        task_id="design_architecture",
        task_type="architecture",
        description="Design system architecture"
    )
    plan_budget = Task(
        task_id="plan_budget",
        task_type="finance",
        description="Plan budget and pricing"
    )

    # Phase 2: Implementation (parallel frontend/backend)
    build_frontend = Task(
        task_id="build_frontend",
        task_type="frontend",
        description="Build React frontend"
    )
    build_backend = Task(
        task_id="build_backend",
        task_type="backend",
        description="Build API and database"
    )

    # Phase 3: Testing (parallel)
    qa_testing = Task(
        task_id="qa_testing",
        task_type="test",
        description="QA testing"
    )
    security_audit = Task(
        task_id="security_audit",
        task_type="security",
        description="Security audit"
    )

    # Phase 4: Launch (sequential)
    deploy_infra = Task(
        task_id="deploy_infrastructure",
        task_type="deploy",
        description="Deploy to cloud"
    )
    setup_monitoring = Task(
        task_id="setup_monitoring",
        task_type="monitor",
        description="Setup monitoring and alerts"
    )
    launch_marketing = Task(
        task_id="launch_marketing",
        task_type="marketing",
        description="Launch marketing campaign"
    )

    # Phase 5: Operations (parallel)
    sales_outreach = Task(
        task_id="sales_outreach",
        task_type="sales",
        description="Sales outreach to prospects"
    )
    customer_support = Task(
        task_id="customer_support",
        task_type="support",
        description="Setup customer support"
    )
    analytics_dashboard = Task(
        task_id="analytics_dashboard",
        task_type="analytics",
        description="Create analytics dashboard"
    )

    # Add all tasks
    all_tasks = [
        research_market, design_architecture, plan_budget,
        build_frontend, build_backend,
        qa_testing, security_audit,
        deploy_infra, setup_monitoring, launch_marketing,
        sales_outreach, customer_support, analytics_dashboard
    ]
    for task in all_tasks:
        dag.add_task(task)

    # Add dependencies (complex DAG structure)
    # Phase 1 → Phase 2
    dag.add_dependency("research_market", "build_frontend")
    dag.add_dependency("design_architecture", "build_frontend")
    dag.add_dependency("design_architecture", "build_backend")

    # Phase 2 → Phase 3
    dag.add_dependency("build_frontend", "qa_testing")
    dag.add_dependency("build_backend", "qa_testing")
    dag.add_dependency("build_backend", "security_audit")

    # Phase 3 → Phase 4
    dag.add_dependency("qa_testing", "deploy_infrastructure")
    dag.add_dependency("security_audit", "deploy_infrastructure")
    dag.add_dependency("deploy_infrastructure", "setup_monitoring")
    dag.add_dependency("deploy_infrastructure", "launch_marketing")

    # Phase 4 → Phase 5
    dag.add_dependency("launch_marketing", "sales_outreach")
    dag.add_dependency("setup_monitoring", "customer_support")
    dag.add_dependency("setup_monitoring", "analytics_dashboard")

    logger.info(f"Created complex DAG: {dag}")
    logger.info(f"DAG depth: {dag.max_depth()}")

    # Route tasks
    router = HALORouter()
    routing_plan = await router.route_tasks(dag)

    # Display results grouped by phase
    phases = {
        "Phase 1: Research & Planning": ["research_market", "design_architecture", "plan_budget"],
        "Phase 2: Implementation": ["build_frontend", "build_backend"],
        "Phase 3: Testing": ["qa_testing", "security_audit"],
        "Phase 4: Launch": ["deploy_infrastructure", "setup_monitoring", "launch_marketing"],
        "Phase 5: Operations": ["sales_outreach", "customer_support", "analytics_dashboard"]
    }

    logger.info("\n" + "=" * 80)
    logger.info("ROUTING RESULTS BY PHASE:")
    logger.info("=" * 80)

    for phase_name, task_ids in phases.items():
        logger.info(f"\n{phase_name}:")
        for task_id in task_ids:
            if task_id in routing_plan.assignments:
                agent = routing_plan.assignments[task_id]
                explanation = routing_plan.explanations[task_id]
                logger.info(f"  ✓ {task_id} → {agent}")
                logger.info(f"    Reason: {explanation}")

    # Display workload distribution
    workload = routing_plan.get_agent_workload()
    logger.info("\n" + "=" * 80)
    logger.info("WORKLOAD DISTRIBUTION:")
    logger.info("=" * 80)
    for agent, count in sorted(workload.items(), key=lambda x: x[1], reverse=True):
        if count > 0:
            capability = router.agent_registry[agent]
            logger.info(f"  {agent}: {count} tasks (cost_tier={capability.cost_tier}, success_rate={capability.success_rate:.2f})")

    # Verify no unassigned tasks
    if routing_plan.unassigned_tasks:
        logger.warning(f"\n⚠️  Unassigned tasks: {routing_plan.unassigned_tasks}")
    else:
        logger.info(f"\n✅ All {len(routing_plan.assignments)} tasks successfully assigned!")

    return routing_plan


async def example_3_explainability_demo():
    """
    Example 3: Explainability demonstration
    Shows how to get human-readable explanations for routing decisions
    """
    logger.info("\n\n" + "=" * 80)
    logger.info("EXAMPLE 3: Explainability Demonstration")
    logger.info("=" * 80)

    dag = TaskDAG()

    # Create tasks with metadata for specialized routing
    task1 = Task(
        task_id="cloud_deployment",
        task_type="deploy",
        description="Deploy to AWS",
        metadata={"platform": "cloud"}
    )
    task2 = Task(
        task_id="ml_model_training",
        task_type="implement",
        description="Train ML model",
        metadata={"domain": "ml"}
    )
    task3 = Task(
        task_id="generic_testing",
        task_type="test",
        description="Run tests"
    )

    for task in [task1, task2, task3]:
        dag.add_task(task)

    router = HALORouter()
    routing_plan = await router.route_tasks(dag)

    logger.info("\n" + "=" * 80)
    logger.info("EXPLAINABILITY ANALYSIS:")
    logger.info("=" * 80)

    for task_id in ["cloud_deployment", "ml_model_training", "generic_testing"]:
        explanation = router.get_routing_explanation(task_id, routing_plan)
        logger.info(f"\n{explanation}")

    return routing_plan


async def example_4_load_balancing():
    """
    Example 4: Load balancing demonstration
    Shows how HALO handles agent overload
    """
    logger.info("\n\n" + "=" * 80)
    logger.info("EXAMPLE 4: Load Balancing Demonstration")
    logger.info("=" * 80)

    # Create many test tasks to trigger load balancing
    dag = TaskDAG()

    for i in range(25):
        task = Task(
            task_id=f"test_task_{i}",
            task_type="test",
            description=f"Test task {i}"
        )
        dag.add_task(task)

    logger.info(f"Created {len(dag)} test tasks")

    router = HALORouter()
    routing_plan = await router.route_tasks(dag)

    # Display how load was distributed
    workload = routing_plan.get_agent_workload()

    logger.info("\n" + "=" * 80)
    logger.info("LOAD BALANCING RESULTS:")
    logger.info("=" * 80)

    agents_used = {agent: count for agent, count in workload.items() if count > 0}
    for agent, count in sorted(agents_used.items(), key=lambda x: x[1], reverse=True):
        capability = router.agent_registry[agent]
        utilization = (count / capability.max_concurrent_tasks) * 100
        logger.info(f"  {agent}: {count}/{capability.max_concurrent_tasks} tasks ({utilization:.1f}% utilized)")

    if len(agents_used) > 1:
        logger.info("\n✅ Load was balanced across multiple agents!")
    else:
        logger.info("\n📊 All tasks handled by single agent (within capacity)")

    return routing_plan


async def example_5_adaptive_routing():
    """
    Example 5: Adaptive routing with capability updates
    Shows how HALO adapts to changing agent capabilities
    """
    logger.info("\n\n" + "=" * 80)
    logger.info("EXAMPLE 5: Adaptive Routing")
    logger.info("=" * 80)

    dag = TaskDAG()

    # Create multiple implementation tasks
    for i in range(5):
        task = Task(
            task_id=f"implement_feature_{i}",
            task_type="implement",
            description=f"Implement feature {i}"
        )
        dag.add_task(task)

    router = HALORouter()

    # Initial routing
    logger.info("\nROUND 1: Initial routing")
    plan1 = await router.route_tasks(dag)
    workload1 = plan1.get_agent_workload()
    logger.info(f"Builder agent workload: {workload1.get('builder_agent', 0)} tasks")

    # Simulate builder_agent having high success rate
    logger.info("\n📈 Updating builder_agent success rate: 0.82 → 0.95")
    router.update_agent_capability("builder_agent", success_rate=0.95)

    # Route again (should prefer builder_agent even more)
    logger.info("\nROUND 2: After capability update")
    dag2 = TaskDAG()  # Fresh DAG
    for i in range(5):
        task = Task(
            task_id=f"implement_feature_{i}",
            task_type="implement",
            description=f"Implement feature {i}"
        )
        dag2.add_task(task)

    plan2 = await router.route_tasks(dag2)
    workload2 = plan2.get_agent_workload()
    logger.info(f"Builder agent workload: {workload2.get('builder_agent', 0)} tasks")

    logger.info("\n✅ Router adapted to updated agent capabilities!")

    return plan2


async def main():
    """Run all examples"""
    logger.info("Starting HTDAG → HALO Integration Examples\n")

    # Run examples
    await example_1_simple_saas_build()
    await example_2_full_saas_lifecycle()
    await example_3_explainability_demo()
    await example_4_load_balancing()
    await example_5_adaptive_routing()

    logger.info("\n\n" + "=" * 80)
    logger.info("ALL EXAMPLES COMPLETED SUCCESSFULLY!")
    logger.info("=" * 80)
    logger.info("\nKey Takeaways:")
    logger.info("1. HTDAG decomposes tasks into hierarchical DAG")
    logger.info("2. HALO routes tasks to optimal agents via logic rules")
    logger.info("3. Every routing decision is explainable and traceable")
    logger.info("4. Load balancing prevents agent overload")
    logger.info("5. Adaptive routing responds to capability changes")
    logger.info("\nNext steps:")
    logger.info("- Integrate with AOP validator for validation layer")
    logger.info("- Add DAAO for cost optimization")
    logger.info("- Connect to real agent execution")


if __name__ == "__main__":
    asyncio.run(main())
