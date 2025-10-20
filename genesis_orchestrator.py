"""
Genesis Meta-Agent Orchestrator
Enhanced with DAAO (Difficulty-Aware Agentic Orchestration) Router

Features:
- Intelligent model routing based on task difficulty
- Cost optimization (36-98% savings)
- Multi-agent task orchestration
- Production observability
- Feature flag system for safe deployment with rollback

Version: 2.0 (with v1.0 fallback capability)
"""

import asyncio
import logging
import os
from typing import Dict, List, Optional

from agent_framework import ChatAgent
from agent_framework.azure import AzureAIAgentClient
from agent_framework.observability import setup_observability
from azure.identity.aio import AzureCliCredential

from infrastructure.daao_router import get_daao_router, RoutingDecision
from infrastructure.feature_flags import is_feature_enabled, get_feature_flag_manager
from infrastructure.a2a_connector import A2AConnector
from infrastructure.htdag_planner import HTDAGPlanner
from infrastructure.halo_router import HALORouter
from infrastructure.aop_validator import AOPValidator
from infrastructure.observability import CorrelationContext

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class GenesisOrchestrator:
    """
    Genesis Meta-Agent Orchestrator with DAAO cost optimization

    Routes tasks to appropriate LLM models based on difficulty estimation.
    Manages multi-agent system and provides production observability.
    """

    def __init__(self):
        """Initialize Genesis orchestrator with feature flags and DAAO router"""
        # Load feature flags
        self.flag_manager = get_feature_flag_manager()

        # Check if v2.0 orchestration is enabled
        self.use_v2 = is_feature_enabled('orchestration_enabled')

        if self.use_v2:
            logger.info("Genesis Orchestrator v2.0 initialized (HTDAG+HALO+AOP+DAAO)")
            self.router = get_daao_router()

            # Initialize orchestration components
            self.htdag = HTDAGPlanner()
            self.halo = HALORouter()
            self.aop = AOPValidator()

            # Initialize A2A connector (if feature enabled)
            if is_feature_enabled('a2a_integration_enabled'):
                self.a2a_connector = A2AConnector(base_url="http://127.0.0.1:8080")
                logger.info("A2A integration ENABLED")
            else:
                self.a2a_connector = None
                logger.info("A2A integration DISABLED (planning-only mode)")

            # Initialize Darwin bridge if enabled
            if is_feature_enabled('darwin_integration_enabled'):
                try:
                    from infrastructure.darwin_orchestration_bridge import DarwinOrchestrationBridge
                    self.darwin_bridge = DarwinOrchestrationBridge(
                        htdag_planner=self.htdag,
                        halo_router=self.halo,
                        aop_validator=self.aop
                    )
                    logger.info("Darwin orchestration bridge ENABLED")
                except ImportError:
                    self.darwin_bridge = None
                    logger.warning("Darwin bridge not available (module not found)")
            else:
                self.darwin_bridge = None
                logger.info("Darwin integration DISABLED (feature flag)")
        else:
            logger.info("Genesis Orchestrator v1.0 fallback mode (basic routing)")
            self.router = None
            self.htdag = None
            self.halo = None
            self.aop = None
            self.a2a_connector = None
            self.darwin_bridge = None

        # Model client mapping (to be populated with actual clients)
        self.model_clients = {}

        # Task execution history
        self.execution_history: List[Dict] = []

        # Log feature flag status
        self._log_feature_status()

    def _log_feature_status(self):
        """Log current feature flag status"""
        logger.info("=" * 80)
        logger.info("FEATURE FLAGS STATUS")
        logger.info("=" * 80)

        # Get all flags
        all_flags = self.flag_manager.get_all_flags()

        # Log critical flags
        critical_flags = [
            'orchestration_enabled',
            'security_hardening_enabled',
            'llm_integration_enabled',
            'aatc_system_enabled',
            'error_handling_enabled',
            'otel_enabled',
            'performance_optimizations_enabled',
            'phase_4_deployment'
        ]

        for flag_name in critical_flags:
            if flag_name in all_flags:
                flag_info = all_flags[flag_name]
                status = "ENABLED" if flag_info['enabled'] else "DISABLED"
                logger.info(f"  {flag_name}: {status}")

        logger.info("=" * 80)

    async def route_and_execute_task(
        self,
        task: Dict,
        budget_conscious: bool = True
    ) -> Dict:
        """
        Route task to appropriate model and execute

        Args:
            task: Task dictionary with description, priority, etc.
            budget_conscious: Prefer cost savings over max quality

        Returns:
            Dictionary with routing decision and execution result
        """
        # Check if orchestration v2.0 is enabled
        if not self.use_v2 or self.router is None:
            logger.info("Using v1.0 fallback routing (no DAAO)")
            return self._fallback_route_v1(task)

        # Check emergency flags
        if is_feature_enabled('emergency_shutdown'):
            logger.error("EMERGENCY SHUTDOWN ACTIVE - Rejecting all tasks")
            return {
                'task': task,
                'status': 'rejected',
                'message': 'Emergency shutdown active'
            }

        if is_feature_enabled('maintenance_mode'):
            logger.warning("MAINTENANCE MODE ACTIVE - Rejecting new tasks")
            return {
                'task': task,
                'status': 'rejected',
                'message': 'Maintenance mode active'
            }

        # Route task using DAAO
        decision = self.router.route_task(task, budget_conscious=budget_conscious)

        logger.info(
            f"Task routed: {decision.reasoning}",
            extra={
                'task_id': task.get('id', 'unknown'),
                'model': decision.model,
                'difficulty': decision.difficulty.value,
                'estimated_cost': decision.estimated_cost,
                'confidence': decision.confidence
            }
        )

        # For now, log the routing decision (actual execution will be added later)
        result = {
            'task': task,
            'routing_decision': {
                'model': decision.model,
                'difficulty': decision.difficulty.value,
                'estimated_cost': decision.estimated_cost,
                'confidence': decision.confidence,
                'reasoning': decision.reasoning
            },
            'status': 'routed',
            'message': f"Task would be executed with {decision.model}"
        }

        # Store in execution history
        self.execution_history.append(result)

        return result

    async def execute_orchestrated_request(
        self,
        user_request: str
    ) -> Dict:
        """
        Full end-to-end orchestration + execution

        Pipeline:
        1. HTDAG: Decompose request into hierarchical DAG
        2. HALO: Route tasks to agents
        3. AOP: Validate plan (solvability, completeness, non-redundancy)
        4. DAAO: Optimize costs (if enabled)
        5. A2A: Execute via connector (if enabled)

        Args:
            user_request: Natural language user request

        Returns:
            Dictionary with orchestration results and execution status

        Raises:
            Exception: If critical errors occur during orchestration
        """
        if not self.use_v2:
            return {
                "status": "not_available",
                "message": "Full orchestration requires v2.0 (set orchestration_enabled=true)"
            }

        # Create correlation context for tracing
        ctx = CorrelationContext(user_request=user_request)

        logger.info(f"Starting orchestrated request (correlation_id={ctx.correlation_id})")

        try:
            # Step 1: HTDAG - Decompose request into DAG
            logger.info("Step 1: HTDAG decomposition")
            dag = await self.htdag.decompose_task(user_request)
            logger.info(f"HTDAG complete: {len(dag)} tasks generated")

            # Step 2: HALO - Route tasks to agents
            logger.info("Step 2: HALO routing")
            routing_plan = await self.halo.route_tasks(dag)
            logger.info(f"HALO complete: {len(routing_plan.assignments)} tasks routed")

            if not routing_plan.is_complete():
                logger.warning(f"Routing incomplete: {len(routing_plan.unassigned_tasks)} tasks unassigned")

            # Step 3: AOP - Validate plan
            logger.info("Step 3: AOP validation")
            validation_result = self.aop.validate_plan(routing_plan, dag)

            if not validation_result.is_valid:
                logger.error(f"AOP validation failed: {validation_result.issues}")
                return {
                    "status": "validation_failed",
                    "correlation_id": ctx.correlation_id,
                    "dag_size": len(dag),
                    "validation_issues": validation_result.issues,
                    "message": "Plan validation failed"
                }

            logger.info(f"AOP complete: validation passed (quality_score={validation_result.quality_score:.2f})")

            # Step 4: DAAO cost optimization (handled by HALO if enabled)
            # This is already integrated in HALO router

            # Step 5: A2A - Execute via connector (if enabled)
            if self.a2a_connector:
                logger.info("Step 5: A2A execution")
                execution_result = await self.a2a_connector.execute_routing_plan(
                    routing_plan,
                    dag,
                    correlation_context=ctx
                )

                logger.info(
                    f"A2A execution complete: {execution_result['successful']}/{execution_result['total_tasks']} "
                    f"tasks successful"
                )

                return {
                    "status": execution_result["status"],
                    "correlation_id": ctx.correlation_id,
                    "dag_size": len(dag),
                    "tasks_routed": len(routing_plan.assignments),
                    "validation_score": validation_result.quality_score,
                    "execution": execution_result,
                    "message": "Full orchestration + execution complete"
                }
            else:
                # Planning-only mode (no A2A execution)
                logger.info("A2A execution DISABLED - returning plan only")

                return {
                    "status": "planned",
                    "correlation_id": ctx.correlation_id,
                    "dag_size": len(dag),
                    "tasks_routed": len(routing_plan.assignments),
                    "validation_score": validation_result.quality_score,
                    "routing_plan": {
                        "assignments": routing_plan.assignments,
                        "explanations": routing_plan.explanations,
                        "unassigned_tasks": routing_plan.unassigned_tasks
                    },
                    "message": "Orchestration plan created (A2A execution disabled)"
                }

        except Exception as e:
            logger.error(f"Orchestration failed: {str(e)}", exc_info=True)

            return {
                "status": "failed",
                "correlation_id": ctx.correlation_id,
                "error": str(e),
                "message": "Orchestration failed"
            }

    async def improve_agent(
        self,
        agent_name: str,
        evolution_type: str = "improve_agent",
        context: Optional[Dict] = None
    ) -> Dict:
        """
        Improve an agent using Darwin evolution

        This method integrates with the SE-Darwin self-improvement system
        to evolve agent code based on performance metrics, errors, or
        optimization targets.

        Args:
            agent_name: Name of agent to improve (e.g., "marketing_agent")
            evolution_type: Type of evolution:
                - "improve_agent": General improvement
                - "fix_bug": Fix specific bug or error
                - "optimize_performance": Performance optimization
            context: Additional context:
                - success_rate: Current success rate (0.0-1.0)
                - target: Target success rate or metric
                - errors: List of errors to fix
                - metrics: Performance metrics

        Returns:
            Evolution result with improvement metrics:
                - success: Whether evolution succeeded
                - agent_name: Name of improved agent
                - metrics_before: Performance before improvement
                - metrics_after: Performance after improvement
                - improvement: Percentage improvement
                - new_version: Version identifier of improved agent
                - error: Error message if failed

        Example:
            result = await orchestrator.improve_agent(
                agent_name="marketing_agent",
                evolution_type="improve_agent",
                context={"success_rate": 0.65, "target": 0.80}
            )

        Raises:
            RuntimeError: If Darwin integration not enabled
        """
        if not self.darwin_bridge:
            raise RuntimeError(
                "Darwin integration not enabled. "
                "Set darwin_integration_enabled=true in feature flags."
            )

        logger.info(f"Improving {agent_name} via Darwin evolution ({evolution_type})")

        try:
            # Execute evolution through bridge
            from infrastructure.darwin_orchestration_bridge import EvolutionTaskType
            result = await self.darwin_bridge.evolve_agent(
                agent_name=agent_name,
                evolution_type=EvolutionTaskType(evolution_type),
                context=context or {}
            )

            # Log result
            if result.success:
                logger.info(
                    f"Evolution successful: {agent_name} improved by "
                    f"{result.improvement_delta}"
                )
            else:
                logger.warning(
                    f"Evolution failed: {agent_name} - {result.error_message}"
                )

            return {
                "success": result.success,
                "agent_name": result.agent_name,
                "metrics_before": result.metrics_before,
                "metrics_after": result.metrics_after,
                "improvement": result.improvement_delta,
                "new_version": result.new_version,
                "error": result.error_message
            }

        except Exception as e:
            logger.error(f"Darwin evolution error: {e}", exc_info=True)
            return {
                "success": False,
                "agent_name": agent_name,
                "error": str(e)
            }

    async def analyze_cost_savings(
        self,
        tasks: List[Dict],
        budget_conscious: bool = True
    ) -> Dict:
        """
        Analyze potential cost savings for a set of tasks

        Args:
            tasks: List of tasks to analyze
            budget_conscious: Use budget-conscious routing

        Returns:
            Dictionary with cost analysis
        """
        from infrastructure.daao_router import ModelTier

        savings = self.router.estimate_cost_savings(
            tasks,
            baseline_model=ModelTier.PREMIUM
        )

        logger.info(
            f"Cost savings analysis: {savings['savings_percent']:.1f}% reduction",
            extra={
                'num_tasks': savings['num_tasks'],
                'daao_cost': savings['daao_cost'],
                'baseline_cost': savings['baseline_cost'],
                'savings': savings['savings']
            }
        )

        return savings

    def _fallback_route_v1(self, task: Dict) -> Dict:
        """
        Fallback routing for v1.0 (no DAAO, simple routing)

        This provides instant rollback capability by using basic routing
        without HTDAG/HALO/AOP/DAAO complexity.

        Args:
            task: Task dictionary

        Returns:
            Dictionary with basic routing result
        """
        logger.info("v1.0 FALLBACK ROUTING")

        # Simple priority-based model selection
        priority = task.get('priority', 0.5)

        if priority > 0.7:
            model = 'gpt-4o'  # High priority = premium model
        elif priority > 0.3:
            model = 'gpt-4o-mini'  # Medium priority = standard model
        else:
            model = 'gemini-flash'  # Low priority = budget model

        result = {
            'task': task,
            'routing_decision': {
                'model': model,
                'difficulty': 'unknown',
                'estimated_cost': 0.0,
                'confidence': 0.5,
                'reasoning': f'v1.0 fallback: priority-based routing to {model}'
            },
            'status': 'routed_v1',
            'message': f"Task routed to {model} (v1.0 fallback mode)"
        }

        # Store in execution history
        self.execution_history.append(result)

        return result

    def get_execution_summary(self) -> Dict:
        """
        Get summary of execution history

        Returns:
            Dictionary with execution statistics
        """
        if not self.execution_history:
            return {
                'total_tasks': 0,
                'total_estimated_cost': 0.0,
                'model_distribution': {},
                'difficulty_distribution': {}
            }

        # Calculate statistics
        total_cost = sum(
            r['routing_decision']['estimated_cost']
            for r in self.execution_history
        )

        # Model distribution
        model_counts = {}
        for record in self.execution_history:
            model = record['routing_decision']['model']
            model_counts[model] = model_counts.get(model, 0) + 1

        # Difficulty distribution
        difficulty_counts = {}
        for record in self.execution_history:
            difficulty = record['routing_decision']['difficulty']
            difficulty_counts[difficulty] = difficulty_counts.get(difficulty, 0) + 1

        return {
            'total_tasks': len(self.execution_history),
            'total_estimated_cost': total_cost,
            'model_distribution': model_counts,
            'difficulty_distribution': difficulty_counts
        }


async def main():
    """Main entry point - demonstrates feature-flag-controlled Genesis"""
    # Enable observability if feature flag is set
    if is_feature_enabled('otel_enabled'):
        setup_observability(enable_sensitive_data=True)
        logger.info("OpenTelemetry observability ENABLED")
    else:
        logger.info("OpenTelemetry observability DISABLED")

    # Initialize orchestrator (will check feature flags internally)
    orchestrator = GenesisOrchestrator()

    # Determine version mode
    version = "v2.0 (HTDAG+HALO+AOP+DAAO)" if orchestrator.use_v2 else "v1.0 (Fallback)"
    logger.info(f"Genesis Orchestrator started in {version} mode")

    # Example tasks to demonstrate routing
    example_tasks = [
        {
            'id': 'task-001',
            'description': 'Fix typo in README.md',
            'priority': 0.1,
            'required_tools': []
        },
        {
            'id': 'task-002',
            'description': 'Design and implement a scalable microservices architecture with authentication, database integration, and deployment pipeline',
            'priority': 0.9,
            'required_tools': ['docker', 'kubernetes', 'database', 'auth', 'ci/cd']
        },
        {
            'id': 'task-003',
            'description': 'Write a function to calculate factorial',
            'priority': 0.3,
            'required_tools': []
        },
        {
            'id': 'task-004',
            'description': 'Optimize database queries and implement caching for performance',
            'priority': 0.7,
            'required_tools': ['database', 'redis', 'profiler']
        }
    ]

    print("=" * 80)
    print(f"GENESIS ORCHESTRATOR - {version}")
    print("=" * 80)
    print(f"Feature Flag Mode: {'ENABLED' if orchestrator.use_v2 else 'FALLBACK v1.0'}")
    print("=" * 80)

    # Route and execute each task
    for task in example_tasks:
        result = await orchestrator.route_and_execute_task(task, budget_conscious=True)

        print(f"\nTask {task['id']}: {task['description'][:60]}...")
        print(f"  → Model: {result['routing_decision']['model']}")
        print(f"  → Difficulty: {result['routing_decision']['difficulty']}")
        print(f"  → Estimated Cost: ${result['routing_decision']['estimated_cost']:.6f}")
        print(f"  → Confidence: {result['routing_decision']['confidence']:.2f}")
        print(f"  → Reasoning: {result['routing_decision']['reasoning']}")

    # Analyze cost savings (only if v2.0 enabled)
    if orchestrator.use_v2:
        print("\n" + "=" * 80)
        print("COST SAVINGS ANALYSIS (DAAO)")
        print("=" * 80)

        savings = await orchestrator.analyze_cost_savings(example_tasks)
        print(f"Tasks Analyzed: {savings['num_tasks']}")
        print(f"Baseline Cost (GPT-4o for all): ${savings['baseline_cost']:.6f}")
        print(f"DAAO Cost (optimized): ${savings['daao_cost']:.6f}")
        print(f"Savings: ${savings['savings']:.6f} ({savings['savings_percent']:.1f}%)")
        print(f"\nExpected from research: 36% cost reduction")
        print(f"Achieved in demo: {savings['savings_percent']:.1f}% cost reduction")
    else:
        print("\n" + "=" * 80)
        print("COST SAVINGS ANALYSIS")
        print("=" * 80)
        print("DAAO cost optimization DISABLED (v1.0 fallback mode)")
        print("Enable 'orchestration_enabled' flag to use DAAO routing")

    # Execution summary
    print("\n" + "=" * 80)
    print("EXECUTION SUMMARY")
    print("=" * 80)

    summary = orchestrator.get_execution_summary()
    print(f"Total Tasks: {summary['total_tasks']}")
    print(f"Total Estimated Cost: ${summary['total_estimated_cost']:.6f}")
    print(f"\nModel Distribution:")
    for model, count in summary['model_distribution'].items():
        print(f"  - {model}: {count} tasks")
    print(f"\nDifficulty Distribution:")
    for difficulty, count in summary['difficulty_distribution'].items():
        print(f"  - {difficulty}: {count} tasks")

    print("\n" + "=" * 80)
    if orchestrator.use_v2:
        print("GENESIS ORCHESTRATOR v2.0 - FEATURE FLAG SYSTEM ACTIVE ✅")
    else:
        print("GENESIS ORCHESTRATOR v1.0 - FALLBACK MODE (Safe Mode)")
    print("=" * 80)
    print("\nTo toggle between v1.0 and v2.0:")
    print("  1. Edit config/feature_flags.json")
    print("  2. Set 'orchestration_enabled' to true/false")
    print("  3. Restart orchestrator")
    print("\nFor instant rollback:")
    print("  export ORCHESTRATION_ENABLED=false")
    print("=" * 80)

if __name__ == "__main__":
    asyncio.run(main())
