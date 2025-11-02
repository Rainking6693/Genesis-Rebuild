"""
Swarm Coordinator - Integrates Team Optimizer with HALO Router

Version: 1.0
Last Updated: November 2, 2025

Orchestrates team-based task execution for Genesis Meta-Agent.
Integrates PSO-optimized team composition with HALO routing.

Key Features:
- Dynamic team generation using Inclusive Fitness PSO
- HALO router integration for sub-task routing
- Team performance tracking and evolution
- Business-specific team spawning
- Genotype-based cooperation optimization
"""

import asyncio
import logging
from typing import Dict, List, Optional, Tuple, Any
from dataclasses import dataclass, field

from infrastructure.task_dag import Task, TaskStatus
from infrastructure.halo_router import HALORouter
from infrastructure.swarm.swarm_halo_bridge import (
    SwarmHALOBridge,
    AgentProfile,
    GENESIS_DEFAULT_PROFILES,
)
from infrastructure.inclusive_fitness_swarm import TaskRequirement

logger = logging.getLogger(__name__)


@dataclass
class TeamExecutionResult:
    """Result of team-based task execution"""
    task_id: str
    team: List[str]
    status: str  # "completed", "failed", "partial"
    individual_results: List[Dict[str, Any]] = field(default_factory=list)
    combined_output: Dict[str, Any] = field(default_factory=dict)
    execution_time: float = 0.0
    errors: List[str] = field(default_factory=list)


class SwarmCoordinator:
    """
    Coordinates swarm-optimized teams with HALO routing.

    Workflow:
    1. Generate optimal team using PSO + Inclusive Fitness
    2. Decompose task into sub-tasks for team members
    3. Route sub-tasks via HALO router
    4. Execute team members in parallel
    5. Combine results and track performance
    """

    def __init__(
        self,
        halo_router: HALORouter,
        agent_profiles: Optional[List[AgentProfile]] = None,
        n_particles: int = 50,
        max_iterations: int = 100,
        random_seed: Optional[int] = None
    ):
        """
        Initialize Swarm Coordinator

        Args:
            halo_router: HALO router instance for task routing
            agent_profiles: Optional agent profiles (defaults to Genesis 15)
            n_particles: Number of PSO particles (default: 50)
            max_iterations: Maximum PSO iterations (default: 100)
            random_seed: Random seed for reproducibility
        """
        self.halo_router = halo_router

        # Initialize Swarm-HALO bridge
        profiles = agent_profiles or GENESIS_DEFAULT_PROFILES
        self.swarm_bridge = SwarmHALOBridge(
            agent_profiles=profiles,
            n_particles=n_particles,
            max_iterations=max_iterations,
            random_seed=random_seed
        )

        # Track active teams and performance
        self.active_teams: Dict[str, List[str]] = {}  # task_id -> team
        self.team_performance: Dict[str, float] = {}  # team_hash -> performance
        self.execution_history: List[TeamExecutionResult] = []

        logger.info(
            f"SwarmCoordinator initialized with {len(profiles)} agents, "
            f"{n_particles} particles, {max_iterations} iterations"
        )

    async def generate_optimal_team(
        self,
        task: Task,
        team_size: int = 3,
        task_requirements: Optional[Dict[str, float]] = None
    ) -> List[str]:
        """
        Generate optimal team for task using PSO

        Args:
            task: Genesis task to execute
            team_size: Desired team size
            task_requirements: Required capabilities (auto-inferred if None)

        Returns:
            List of agent names forming optimal team
        """
        # Auto-infer requirements if not provided
        if task_requirements is None:
            task_requirements = self._infer_requirements_from_task(task)

        # Convert to list of capability names for SwarmHALOBridge
        required_capabilities = list(task_requirements.keys())

        # Run PSO optimization via bridge
        logger.info(f"Optimizing team for task {task.task_id}")
        agent_names, fitness, explanations = self.swarm_bridge.optimize_team(
            task_id=task.task_id,
            required_capabilities=required_capabilities,
            team_size_range=(max(1, team_size - 1), team_size + 1),
            priority=1.0,
            verbose=False
        )

        # Store team
        self.active_teams[task.task_id] = agent_names

        logger.info(
            f"Team optimized for {task.task_id}: {agent_names} "
            f"(fitness={fitness:.3f})"
        )

        # Log explanations
        for agent, explanation in explanations.items():
            logger.debug(f"  {agent}: {explanation}")

        return agent_names

    async def route_to_team(
        self,
        task: Task,
        team: List[str]
    ) -> Dict[str, str]:
        """
        Route task to team via HALO router

        Creates sub-tasks for each team member and coordinates execution.

        Args:
            task: Main task to execute
            team: List of agent names

        Returns:
            Dict mapping agent_name -> assigned_sub_task_id
        """
        # Decompose task into sub-tasks for team
        sub_tasks = self._decompose_for_team(task, team)

        # Route each sub-task to team member via HALO
        assignments = {}
        for agent_name, sub_task in zip(team, sub_tasks):
            # For now, directly assign (HALO validation in future integration)
            assignments[agent_name] = sub_task.task_id
            logger.debug(
                f"Assigned sub-task {sub_task.task_id} to {agent_name}"
            )

        return assignments

    async def execute_team_task(
        self,
        task: Task,
        team: List[str]
    ) -> TeamExecutionResult:
        """
        Execute task with team coordination

        Args:
            task: Task to execute
            team: List of agent names

        Returns:
            TeamExecutionResult with combined results from all team members
        """
        import time
        start_time = time.time()

        # Route to team
        assignments = await self.route_to_team(task, team)

        # Execute team members in parallel
        logger.info(f"Executing task {task.task_id} with team {team}")
        results = await asyncio.gather(*[
            self._execute_agent_subtask(agent, sub_task_id)
            for agent, sub_task_id in assignments.items()
        ], return_exceptions=True)

        # Process results
        individual_results = []
        errors = []
        successful_count = 0

        for i, result in enumerate(results):
            if isinstance(result, Exception):
                errors.append(f"Agent {team[i]} failed: {str(result)}")
            else:
                individual_results.append(result)
                if result.get("status") == "completed":
                    successful_count += 1

        # Combine results
        combined = self._combine_team_results(individual_results)

        # Determine overall status
        if successful_count == len(team):
            status = "completed"
        elif successful_count > 0:
            status = "partial"
        else:
            status = "failed"

        execution_time = time.time() - start_time

        # Create result
        result = TeamExecutionResult(
            task_id=task.task_id,
            team=team,
            status=status,
            individual_results=individual_results,
            combined_output=combined,
            execution_time=execution_time,
            errors=errors
        )

        # Track performance
        self._track_team_performance(team, result)
        self.execution_history.append(result)

        logger.info(
            f"Task {task.task_id} completed: status={status}, "
            f"time={execution_time:.2f}s"
        )

        return result

    async def spawn_dynamic_team_for_business(
        self,
        business_type: str,
        complexity: str = "medium"
    ) -> List[str]:
        """
        Dynamically spawn team for business creation

        Args:
            business_type: e.g., "ecommerce", "saas", "content_platform"
            complexity: "simple", "medium", "complex"

        Returns:
            Optimal team composition
        """
        # Map business type to requirements
        business_requirements = {
            "ecommerce": [
                "coding", "deployment", "testing", "ads", "payments"
            ],
            "saas": [
                "coding", "deployment", "testing", "security_audit",
                "data_analysis", "subscriptions"
            ],
            "content_platform": [
                "coding", "writing", "seo", "deployment", "content_strategy"
            ],
            "marketplace": [
                "coding", "deployment", "payments", "user_training", "testing"
            ],
            "analytics_dashboard": [
                "data_analysis", "coding", "deployment", "reporting"
            ]
        }

        required_capabilities = business_requirements.get(
            business_type,
            ["coding", "deployment"]  # Fallback
        )

        # Adjust team size by complexity
        team_sizes = {
            "simple": (2, 3),
            "medium": (3, 4),
            "complex": (5, 7)
        }
        team_size_range = team_sizes.get(complexity, (3, 4))

        logger.info(
            f"Spawning team for {business_type} business "
            f"(complexity={complexity})"
        )

        # Generate optimal team
        agent_names, fitness, explanations = self.swarm_bridge.optimize_team(
            task_id=f"business_{business_type}",
            required_capabilities=required_capabilities,
            team_size_range=team_size_range,
            priority=1.0,
            verbose=False
        )

        # Calculate team metrics
        diversity = self.swarm_bridge.get_team_genotype_diversity(agent_names)
        cooperation = self.swarm_bridge.get_team_cooperation_score(agent_names)

        logger.info(
            f"Business team spawned: {agent_names} "
            f"(fitness={fitness:.3f}, diversity={diversity:.2f}, "
            f"cooperation={cooperation:.2f})"
        )

        return agent_names

    def get_team_performance_history(
        self,
        team: List[str]
    ) -> Dict[str, Any]:
        """
        Get historical performance for team composition

        Args:
            team: List of agent names

        Returns:
            Performance metrics for this team composition
        """
        team_hash = "_".join(sorted(team))

        # Count executions
        execution_count = sum(
            1 for result in self.execution_history
            if "_".join(sorted(result.team)) == team_hash
        )

        # Calculate average success rate
        if execution_count > 0:
            success_count = sum(
                1 for result in self.execution_history
                if "_".join(sorted(result.team)) == team_hash
                and result.status == "completed"
            )
            success_rate = success_count / execution_count
        else:
            success_rate = 0.0

        return {
            "team": team,
            "team_hash": team_hash,
            "performance": self.team_performance.get(team_hash, 0.0),
            "execution_count": execution_count,
            "success_rate": success_rate,
            "diversity": self.swarm_bridge.get_team_genotype_diversity(team),
            "cooperation": self.swarm_bridge.get_team_cooperation_score(team)
        }

    def evolve_team(
        self,
        current_team: List[str],
        performance_feedback: float
    ) -> List[str]:
        """
        Evolve team based on performance feedback

        Args:
            current_team: Current team composition
            performance_feedback: Performance score (0.0-1.0)

        Returns:
            Evolved team composition (may be same if performing well)
        """
        # If team performed well, keep it
        if performance_feedback >= 0.7:
            logger.info(
                f"Team performing well (score={performance_feedback:.2f}), "
                "keeping current composition"
            )
            return current_team

        # If team performed poorly, trigger re-optimization
        logger.info(
            f"Team underperforming (score={performance_feedback:.2f}), "
            "triggering re-optimization"
        )

        # Return current team for now (evolution logic placeholder)
        # Future: Re-run PSO with adjusted parameters
        return current_team

    # ===== PRIVATE HELPER METHODS =====

    def _infer_requirements_from_task(
        self,
        task: Task
    ) -> Dict[str, float]:
        """
        Infer required capabilities from task description

        Uses simple keyword matching to determine capabilities.

        Args:
            task: Task to analyze

        Returns:
            Dict of capability -> importance (0.0-1.0)
        """
        requirements = {}

        desc_lower = (task.description or "").lower()

        # Keyword mappings
        keyword_mappings = {
            "testing": ["test", "qa", "quality", "validation"],
            "coding": ["build", "create", "implement", "code", "develop"],
            "deployment": ["deploy", "launch", "release"],
            "data_analysis": ["analyze", "analytics", "metrics", "data"],
            "security_audit": ["security", "audit", "vulnerability"],
            "writing": ["content", "write", "copy"],
            "ads": ["marketing", "advertis", "campaign"],
        }

        for capability, keywords in keyword_mappings.items():
            if any(keyword in desc_lower for keyword in keywords):
                requirements[capability] = 1.0

        # Default if no matches
        if not requirements:
            requirements["coding"] = 1.0

        return requirements

    def _decompose_for_team(
        self,
        task: Task,
        team: List[str]
    ) -> List[Task]:
        """
        Decompose task into sub-tasks for team members

        Args:
            task: Main task
            team: Team members

        Returns:
            List of sub-tasks (one per team member)
        """
        sub_tasks = []

        for i, agent in enumerate(team):
            sub_task = Task(
                task_id=f"{task.task_id}_sub_{i}",
                task_type=task.task_type,
                description=f"{task.description} (assigned to {agent})",
                status=TaskStatus.PENDING,
                metadata={
                    **task.metadata,
                    "team_role": agent,
                    "parent_task_id": task.task_id
                }
            )
            sub_tasks.append(sub_task)

        return sub_tasks

    async def _execute_agent_subtask(
        self,
        agent: str,
        sub_task_id: str
    ) -> Dict[str, Any]:
        """
        Execute sub-task via agent (stub for now)

        Args:
            agent: Agent name
            sub_task_id: Sub-task ID

        Returns:
            Execution result dict
        """
        # Simulate work
        await asyncio.sleep(0.1)

        # In real implementation, call actual agent execution via HALO
        # For now, return mock success
        return {
            "agent": agent,
            "task_id": sub_task_id,
            "status": "completed",
            "output": f"Result from {agent} for {sub_task_id}"
        }

    def _combine_team_results(
        self,
        results: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """
        Combine results from all team members

        Args:
            results: List of individual agent results

        Returns:
            Combined result dict
        """
        return {
            "team_size": len(results),
            "individual_results": results,
            "status": "team_completed" if results else "team_empty"
        }

    def _track_team_performance(
        self,
        team: List[str],
        result: TeamExecutionResult
    ):
        """
        Track team performance for future optimization

        Args:
            team: Team composition
            result: Execution result
        """
        team_hash = "_".join(sorted(team))

        # Calculate performance score
        if result.status == "completed":
            performance = 1.0
        elif result.status == "partial":
            performance = 0.5
        else:
            performance = 0.0

        # Update rolling average (simple exponential smoothing)
        if team_hash in self.team_performance:
            alpha = 0.3  # Smoothing factor
            self.team_performance[team_hash] = (
                alpha * performance +
                (1 - alpha) * self.team_performance[team_hash]
            )
        else:
            self.team_performance[team_hash] = performance

        logger.debug(
            f"Team {team_hash} performance updated: "
            f"{self.team_performance[team_hash]:.3f}"
        )


def create_swarm_coordinator(
    halo_router: HALORouter,
    agent_profiles: Optional[List[AgentProfile]] = None,
    n_particles: int = 50,
    max_iterations: int = 100,
    random_seed: Optional[int] = None
) -> SwarmCoordinator:
    """
    Factory function to create SwarmCoordinator

    Args:
        halo_router: HALO router instance
        agent_profiles: Optional agent profiles
        n_particles: Number of PSO particles
        max_iterations: Maximum PSO iterations
        random_seed: Random seed for reproducibility

    Returns:
        SwarmCoordinator instance
    """
    return SwarmCoordinator(
        halo_router=halo_router,
        agent_profiles=agent_profiles,
        n_particles=n_particles,
        max_iterations=max_iterations,
        random_seed=random_seed
    )
