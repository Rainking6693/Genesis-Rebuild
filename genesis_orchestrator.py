"""
Genesis Meta-Agent Orchestrator
Enhanced with DAAO (Difficulty-Aware Agentic Orchestration) Router

Features:
- Intelligent model routing based on task difficulty
- Cost optimization (36-98% savings)
- Multi-agent task orchestration
- Production observability
"""

import asyncio
import logging
from typing import Dict, List, Optional

from agent_framework import ChatAgent
from agent_framework.azure import AzureAIAgentClient
from agent_framework.observability import setup_observability
from azure.identity.aio import AzureCliCredential

from infrastructure.daao_router import get_daao_router, RoutingDecision

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
        """Initialize Genesis orchestrator with DAAO router"""
        self.router = get_daao_router()
        logger.info("Genesis Orchestrator initialized with DAAO routing")

        # Model client mapping (to be populated with actual clients)
        self.model_clients = {}

        # Task execution history
        self.execution_history: List[Dict] = []

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
    """Main entry point - demonstrates DAAO-enhanced Genesis"""
    setup_observability(enable_sensitive_data=True)

    # Initialize orchestrator
    orchestrator = GenesisOrchestrator()
    logger.info("Genesis Orchestrator started with DAAO routing")

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
    print("GENESIS ORCHESTRATOR - DAAO ROUTING DEMONSTRATION")
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

    # Analyze cost savings
    print("\n" + "=" * 80)
    print("COST SAVINGS ANALYSIS")
    print("=" * 80)

    savings = await orchestrator.analyze_cost_savings(example_tasks)
    print(f"Tasks Analyzed: {savings['num_tasks']}")
    print(f"Baseline Cost (GPT-4o for all): ${savings['baseline_cost']:.6f}")
    print(f"DAAO Cost (optimized): ${savings['daao_cost']:.6f}")
    print(f"Savings: ${savings['savings']:.6f} ({savings['savings_percent']:.1f}%)")
    print(f"\nExpected from research: 36% cost reduction")
    print(f"Achieved in demo: {savings['savings_percent']:.1f}% cost reduction")

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
    print("GENESIS ORCHESTRATOR - DAAO INTEGRATION COMPLETE ✅")
    print("=" * 80)

if __name__ == "__main__":
    asyncio.run(main())
