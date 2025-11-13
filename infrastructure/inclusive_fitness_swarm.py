"""
INCLUSIVE FITNESS SWARM OPTIMIZER - Layer 5
Version: 1.0
Last Updated: October 16, 2025

Based on research paper: "Inclusive Fitness as a Key Step Towards More Advanced Social Behaviors"
(Rosseau et al., 2025)

Key Innovation: Genotype-based cooperation using Hamilton's rule (rB > C)
Expected Impact: +15-20% team performance improvement

This module implements:
1. Genotype assignment based on agent roles (shared "genes"/modules)
2. Inclusive fitness reward calculation (direct + indirect fitness)
3. PSO-based team optimization with kin selection
4. Emergent cooperation/competition dynamics

Genotype Groups:
- customer_interaction: Marketing, Support, Onboarding
- infrastructure: Builder, Deploy, Maintenance
- content: Content, SEO, Email
- finance: Billing, Legal
- analysis: Analyst, QA, Security, Spec
"""

import os
import random
from dataclasses import dataclass, field
from datetime import datetime, timezone
from enum import Enum
from typing import Dict, List, Optional, Tuple, Any

import numpy as np


class GenotypeGroup(Enum):
    """Genotype groups representing shared code modules/capabilities"""
    CUSTOMER_INTERACTION = "customer_interaction"
    INFRASTRUCTURE = "infrastructure"
    CONTENT = "content"
    FINANCE = "finance"
    ANALYSIS = "analysis"


@dataclass
class Agent:
    """Agent representation for swarm optimization"""
    name: str
    role: str
    genotype: GenotypeGroup
    capabilities: List[str]
    current_fitness: float = 0.0
    metadata: Dict = None

    def __post_init__(self):
        if self.metadata is None:
            self.metadata = {}


@dataclass
class TaskRequirement:
    """Task requirements for team composition"""
    task_id: str
    required_capabilities: List[str]
    team_size_range: Tuple[int, int]  # (min, max)
    priority: float = 1.0
    metadata: Dict = None

    def __post_init__(self):
        if self.metadata is None:
            self.metadata = {}

        # Validate team_size_range
        min_size, max_size = self.team_size_range
        if min_size < 0:
            raise ValueError(f"team_size_range min must be >= 0, got {min_size}")
        if max_size < min_size:
            raise ValueError(f"team_size_range max ({max_size}) must be >= min ({min_size})")

        # Validate priority
        if self.priority < 0:
            raise ValueError(f"priority must be >= 0, got {self.priority}")


@dataclass
class TeamOutcome:
    """Outcome of a team executing a task"""
    team: List[Agent]
    task: TaskRequirement
    success: bool
    overall_reward: float
    individual_contributions: Dict[str, float]  # agent_name -> contribution
    execution_time: float
    timestamp: datetime = None
    metadata: Dict[str, Any] = field(default_factory=dict)

    def __post_init__(self):
        if self.timestamp is None:
            self.timestamp = datetime.now(timezone.utc)

    def get_benefit(self, agent: Agent) -> float:
        """Get benefit received by specific agent"""
        return self.individual_contributions.get(agent.name, 0.0)


class InclusiveFitnessSwarm:
    """
    Inclusive Fitness-based Swarm Optimizer

    Implements Hamilton's rule for cooperation:
    - Cooperate with genetic kin (same genotype)
    - Compete with non-kin (different genotype)
    - rB > C: Help when relatedness × benefit > cost

    Expected Results (from paper):
    - 15% cooperation stability improvement
    - Emergent autocurriculum via arms race
    - Non-team dynamics (spectrum of cooperation)
    """

    def __init__(self, agents: List[Agent], random_seed: Optional[int] = None):
        """
        Initialize Inclusive Fitness Swarm

        Args:
            agents: List of agents to form swarm
            random_seed: Random seed for reproducibility (None = non-deterministic)

        Raises:
            ValueError: If agents list is empty or has duplicate names
        """
        # Input validation
        if not agents:
            raise ValueError("agents list cannot be empty")
        if len(agents) != len(set(a.name for a in agents)):
            raise ValueError("agent names must be unique")

        self.agents = agents
        self.genotype_mapping = self._assign_genotypes()
        self.cooperation_history: List[TeamOutcome] = []

        # Initialize instance-specific RNG for reproducibility
        self.rng = random.Random(random_seed)
        self.causal_influence_weight = float(os.getenv("SWARM_CAUSAL_INFLUENCE_WEIGHT", "0.5"))
        self.agent_credit: Dict[str, Dict[str, float]] = {
            agent.name: {"influence": 0.0, "appearances": 0.0} for agent in agents
        }

    def _assign_genotypes(self) -> Dict[str, GenotypeGroup]:
        """
        Assign genotypes based on agent roles

        Genotype represents shared "genetic" material (code modules, capabilities)
        Agents with same genotype are "kin" and cooperate more strongly
        """
        genotype_rules = {
            GenotypeGroup.CUSTOMER_INTERACTION: [
                "marketing", "support", "onboarding", "customer"
            ],
            GenotypeGroup.INFRASTRUCTURE: [
                "builder", "deploy", "deployment", "maintenance", "infra"
            ],
            GenotypeGroup.CONTENT: [
                "content", "seo", "email", "writer", "copy"
            ],
            GenotypeGroup.FINANCE: [
                "billing", "legal", "payment", "finance", "accounting"
            ],
            GenotypeGroup.ANALYSIS: [
                "analyst", "qa", "quality", "security", "spec", "specification"
            ],
        }

        mapping = {}
        for agent in self.agents:
            assigned = False
            agent_role_lower = agent.role.lower()

            for genotype, keywords in genotype_rules.items():
                if any(keyword in agent_role_lower for keyword in keywords):
                    mapping[agent.name] = genotype
                    agent.genotype = genotype
                    assigned = True
                    break

            # Default to ANALYSIS if no match
            if not assigned:
                mapping[agent.name] = GenotypeGroup.ANALYSIS
                agent.genotype = GenotypeGroup.ANALYSIS

        return mapping

    def calculate_relatedness(self, agent1: Agent, agent2: Agent) -> float:
        """
        Calculate genetic relatedness coefficient (r in Hamilton's rule)

        Returns:
        - 1.0: Same genotype (full genetic kin)
        - 0.0: Different genotype (unrelated)

        Future enhancement: Could use fractional relatedness based on
        shared capabilities (0.0 to 1.0 spectrum)
        """
        if agent1.genotype == agent2.genotype:
            return 1.0
        return 0.0

    def inclusive_fitness_reward(
        self,
        agent: Agent,
        action: str,
        outcome: TeamOutcome,
        team: List[Agent]
    ) -> float:
        """
        Calculate inclusive fitness reward using Hamilton's rule

        Fitness = Direct fitness + Indirect fitness

        Direct fitness: Agent's own reward from task
        Indirect fitness: Sum of (relatedness × benefit to kin)

        Hamilton's rule: Help kin when rB > C
        where r = relatedness, B = benefit to recipient, C = cost to actor

        Args:
            agent: The agent receiving the reward
            action: The action taken
            outcome: The task outcome
            team: All agents in the team

        Returns:
            Total inclusive fitness (direct + weighted indirect)
        """
        # Direct fitness: Agent's own contribution reward
        direct_reward = outcome.get_benefit(agent)

        # Indirect fitness: Help genetic kin
        indirect_reward = 0.0
        for teammate in team:
            if teammate.name != agent.name:
                # Calculate relatedness
                relatedness = self.calculate_relatedness(agent, teammate)

                # Get benefit teammate received
                teammate_benefit = outcome.get_benefit(teammate)

                # Weight by relatedness (Hamilton's rule)
                indirect_reward += relatedness * teammate_benefit

        influence_bonus = self.causal_influence_weight * outcome.metadata.get("causal_influence", {}).get(agent.name, 0.0)

        # Total inclusive fitness with participation fairness
        total_fitness = direct_reward + indirect_reward + influence_bonus
        total_fitness *= self._compute_participation_modifier(agent.name)

        return total_fitness

    def _estimate_success_probability(
        self,
        team: List[Agent],
        task: TaskRequirement,
        has_all_capabilities: Optional[bool] = None,
    ) -> float:
        """Deterministically estimate team success probability."""
        if has_all_capabilities is None:
            required_caps = set(task.required_capabilities)
            team_caps = set()
            for agent in team:
                team_caps.update(agent.capabilities)
            has_all_capabilities = required_caps.issubset(team_caps)

        if not has_all_capabilities:
            success_prob = 0.3
        else:
            success_prob = 0.7
            genotype_diversity = len(set(agent.genotype for agent in team)) / len(GenotypeGroup)
            success_prob += 0.2 * genotype_diversity

            genotype_counts: Dict[GenotypeGroup, int] = {}
            for agent in team:
                genotype_counts[agent.genotype] = genotype_counts.get(agent.genotype, 0) + 1
            for count in genotype_counts.values():
                if 2 <= count <= 3:
                    success_prob += 0.1

        return min(success_prob, 0.95)

    def _compute_causal_influence_scores(
        self,
        team: List[Agent],
        task: TaskRequirement,
        base_success_prob: float,
    ) -> Dict[str, float]:
        """Approximate each agent's causal influence on success."""
        influence: Dict[str, float] = {}
        for agent in team:
            reduced_team = [a for a in team if a.name != agent.name]
            if not reduced_team:
                reduced_prob = 0.0
            else:
                reduced_prob = self._estimate_success_probability(reduced_team, task)
            delta = max(0.0, base_success_prob - reduced_prob)
            influence[agent.name] = delta * task.priority
        return influence

    def _update_agent_credit(self, team: List[Agent], influence: Dict[str, float]) -> None:
        """Track per-agent influence and participation for fairness adjustments."""
        for agent in team:
            stats = self.agent_credit.setdefault(agent.name, {"influence": 0.0, "appearances": 0.0})
            stats["influence"] += influence.get(agent.name, 0.0)
            stats["appearances"] += 1.0

    def _compute_participation_modifier(self, agent_name: str) -> float:
        """Reduce reward for chronic low-influence contributors."""
        stats = self.agent_credit.get(agent_name)
        if not stats or stats["appearances"] == 0:
            return 1.0
        agent_avg = stats["influence"] / max(1.0, stats["appearances"])
        global_avg = self._global_average_influence()
        if global_avg <= 0:
            return 1.0
        if agent_avg >= global_avg:
            return 1.0
        ratio = agent_avg / global_avg
        return max(0.6, 0.8 * ratio + 0.2)

    def _global_average_influence(self) -> float:
        total_influence = sum(stats["influence"] for stats in self.agent_credit.values())
        total_appearances = sum(stats["appearances"] for stats in self.agent_credit.values())
        if total_appearances <= 0:
            return 0.0
        return total_influence / total_appearances

    def evaluate_team(
        self,
        team: List[Agent],
        task: TaskRequirement,
        simulate: bool = True
    ) -> TeamOutcome:
        """
        Evaluate team performance on a task

        Args:
            team: List of agents in the team
            task: Task requirements
            simulate: If True, simulate outcome (for optimization)
                     If False, actually execute (for production)

        Returns:
            TeamOutcome with success, rewards, contributions
        """
        # Check if team has required capabilities
        team_capabilities = set()
        for agent in team:
            team_capabilities.update(agent.capabilities)

        required_caps = set(task.required_capabilities)
        has_all_capabilities = required_caps.issubset(team_capabilities)

        success_prob = self._estimate_success_probability(
            team=team,
            task=task,
            has_all_capabilities=has_all_capabilities,
        )

        if simulate:
            # Simulated outcome
            success = self.rng.random() < success_prob
            overall_reward = task.priority * (1.0 if success else 0.3)

            # Distribute rewards based on capabilities
            individual_contributions = {}
            total_capability_count = sum(
                len(set(agent.capabilities) & required_caps)
                for agent in team
            )

            for agent in team:
                capability_match = len(set(agent.capabilities) & required_caps)
                if total_capability_count > 0:
                    contribution = overall_reward * (capability_match / total_capability_count)
                else:
                    contribution = overall_reward / len(team)
                individual_contributions[agent.name] = contribution

            execution_time = self.rng.uniform(1.0, 5.0)

        else:
            # TODO: Actual execution (future implementation)
            raise NotImplementedError("Actual team execution not yet implemented")

        outcome = TeamOutcome(
            team=team,
            task=task,
            success=success,
            overall_reward=overall_reward,
            individual_contributions=individual_contributions,
            execution_time=execution_time,
            metadata={}
        )
        outcome.metadata["success_probability"] = success_prob

        causal_influence = self._compute_causal_influence_scores(team, task, success_prob)
        outcome.metadata["causal_influence"] = causal_influence
        self._update_agent_credit(team, causal_influence)

        # Reward share adjusted to discourage free-riding
        for agent in team:
            name = agent.name
            outcome.individual_contributions[name] = (
                outcome.individual_contributions.get(name, 0.0)
                + 0.25 * causal_influence.get(name, 0.0)
            )

        return outcome


class ParticleSwarmOptimizer:
    """
    Particle Swarm Optimization for team composition

    Each particle represents a candidate team composition
    PSO explores the space of possible teams to find optimal composition
    using inclusive fitness as the fitness function
    """

    def __init__(
        self,
        swarm: InclusiveFitnessSwarm,
        n_particles: int = 20,
        max_iterations: int = 50,
        w: float = 0.7,  # Inertia weight
        c1: float = 1.5,  # Cognitive parameter
        c2: float = 1.5,  # Social parameter
        random_seed: Optional[int] = None,
        restart_patience: int = 12,
        restart_fraction: float = 0.5,
    ):
        """
        Initialize Particle Swarm Optimizer

        Args:
            swarm: InclusiveFitnessSwarm instance
            n_particles: Number of particles (candidate teams)
            max_iterations: Maximum PSO iterations
            w: Inertia weight (0-1)
            c1: Cognitive parameter (>=0)
            c2: Social parameter (>=0)
            random_seed: Random seed for reproducibility (None = non-deterministic)

        Raises:
            ValueError: If parameters are out of valid ranges
        """
        # Input validation
        if n_particles < 1:
            raise ValueError(f"n_particles must be >= 1, got {n_particles}")
        if max_iterations < 1:
            raise ValueError(f"max_iterations must be >= 1, got {max_iterations}")
        if not (0 <= w <= 1):
            raise ValueError(f"inertia weight w must be in [0,1], got {w}")
        if c1 < 0 or c2 < 0:
            raise ValueError(f"PSO parameters c1, c2 must be >= 0, got c1={c1}, c2={c2}")
        if restart_patience < 0:
            raise ValueError(f"restart_patience must be >= 0, got {restart_patience}")
        if not (0.0 < restart_fraction <= 1.0):
            raise ValueError(f"restart_fraction must be in (0,1], got {restart_fraction}")

        self.swarm = swarm
        self.n_particles = n_particles
        self.max_iterations = max_iterations
        self.w = w
        self.c1 = c1
        self.c2 = c2
        self.restart_patience = restart_patience
        self.restart_fraction = restart_fraction

        # Initialize instance-specific RNG for reproducibility
        self.rng = random.Random(random_seed)

        self.global_best_team: Optional[List[Agent]] = None
        self.global_best_fitness: float = -float('inf')
        self.restart_events: int = 0

    def _initialize_particle(self, task: TaskRequirement) -> List[Agent]:
        """Initialize random team composition"""
        min_size, max_size = task.team_size_range
        team_size = self.rng.randint(min_size, max_size)
        # Handle edge case: can't sample more agents than available
        available = len(self.swarm.agents)
        actual_size = min(team_size, available)
        return self.rng.sample(self.swarm.agents, actual_size)

    def optimize_team(
        self,
        task: TaskRequirement,
        verbose: bool = False
    ) -> Tuple[List[Agent], float]:
        """
        Optimize team composition using PSO with inclusive fitness

        Args:
            task: Task requirements
            verbose: Print optimization progress

        Returns:
            (best_team, best_fitness)
        """
        # Initialize particles (candidate teams)
        particles = [
            self._initialize_particle(task)
            for _ in range(self.n_particles)
        ]

        # Track personal best for each particle
        personal_best_teams = particles.copy()
        personal_best_fitness = [
            self._evaluate_team_fitness(team, task)
            for team in particles
        ]

        # Track global best
        best_idx = np.argmax(personal_best_fitness)
        self.global_best_team = personal_best_teams[best_idx].copy()
        self.global_best_fitness = personal_best_fitness[best_idx]

        stagnation_counter = 0

        # PSO iterations
        for iteration in range(self.max_iterations):
            improved = False
            for i, team in enumerate(particles):
                # Evaluate current team
                current_fitness = self._evaluate_team_fitness(team, task)

                # Update personal best
                if current_fitness > personal_best_fitness[i]:
                    personal_best_fitness[i] = current_fitness
                    personal_best_teams[i] = team.copy()
                    improved = True

                # Update global best
                if current_fitness > self.global_best_fitness:
                    self.global_best_fitness = current_fitness
                    self.global_best_team = team.copy()
                    improved = True

                # PSO update: Move towards personal best and global best
                new_team = self._update_particle(
                    current_team=team,
                    personal_best=personal_best_teams[i],
                    global_best=self.global_best_team,
                    task=task
                )
                particles[i] = new_team

            if improved:
                stagnation_counter = 0
            else:
                stagnation_counter += 1
                if self.restart_patience and stagnation_counter >= self.restart_patience:
                    self._apply_restart_token(
                        particles=particles,
                        personal_best_teams=personal_best_teams,
                        personal_best_fitness=personal_best_fitness,
                        task=task,
                    )
                    stagnation_counter = 0
                    self.restart_events += 1

            if verbose and (iteration % 10 == 0 or iteration == self.max_iterations - 1):
                print(f"Iteration {iteration}: Best fitness = {self.global_best_fitness:.3f}")

        return self.global_best_team, self.global_best_fitness

    def _apply_restart_token(
        self,
        particles: List[List[Agent]],
        personal_best_teams: List[List[Agent]],
        personal_best_fitness: List[float],
        task: TaskRequirement,
    ) -> None:
        """Reinitialize a portion of particles to escape stagnation."""
        restart_count = max(1, int(len(particles) * self.restart_fraction))
        indices = self.rng.sample(range(len(particles)), restart_count)
        for idx in indices:
            new_team = self._initialize_particle(task)
            particles[idx] = new_team
            personal_best_teams[idx] = new_team.copy()
            personal_best_fitness[idx] = self._evaluate_team_fitness(new_team, task)

    def _evaluate_team_fitness(self, team: List[Agent], task: TaskRequirement) -> float:
        """
        Evaluate team fitness using inclusive fitness

        Returns average inclusive fitness across all team members
        """
        outcome = self.swarm.evaluate_team(team, task, simulate=True)

        total_inclusive_fitness = 0.0
        for agent in team:
            inclusive_fitness = self.swarm.inclusive_fitness_reward(
                agent=agent,
                action="team_task",
                outcome=outcome,
                team=team
            )
            total_inclusive_fitness += inclusive_fitness

        # Average inclusive fitness (normalized by team size)
        avg_fitness = total_inclusive_fitness / len(team)

        # Bonus for success
        if outcome.success:
            avg_fitness *= 1.5

        return avg_fitness

    def _update_particle(
        self,
        current_team: List[Agent],
        personal_best: List[Agent],
        global_best: List[Agent],
        task: TaskRequirement
    ) -> List[Agent]:
        """
        Update particle (team composition) using PSO dynamics

        PSO formula adapted for discrete team composition:
        - Keep some current team members (inertia)
        - Add some from personal best (cognitive)
        - Add some from global best (social)
        """
        min_size, max_size = task.team_size_range

        # Calculate number of agents to take from each source
        # These probabilities implement the PSO update equation
        n_from_current = int(len(current_team) * self.w)
        n_from_personal = int(max_size * self.c1 * self.rng.random())
        n_from_global = int(max_size * self.c2 * self.rng.random())

        new_team = []

        # Add from current team (inertia)
        if n_from_current > 0 and current_team:
            new_team.extend(self.rng.sample(current_team, min(n_from_current, len(current_team))))

        # Add from personal best (cognitive)
        if n_from_personal > 0 and personal_best:
            candidates = [a for a in personal_best if a not in new_team]
            if candidates:
                new_team.extend(self.rng.sample(candidates, min(n_from_personal, len(candidates))))

        # Add from global best (social)
        if n_from_global > 0 and global_best:
            candidates = [a for a in global_best if a not in new_team]
            if candidates:
                new_team.extend(self.rng.sample(candidates, min(n_from_global, len(candidates))))

        # Ensure team size is within bounds
        if len(new_team) < min_size:
            # Add random agents to meet minimum
            candidates = [a for a in self.swarm.agents if a not in new_team]
            needed = min_size - len(new_team)
            if candidates:
                new_team.extend(self.rng.sample(candidates, min(needed, len(candidates))))
        elif len(new_team) > max_size:
            # Remove random agents to meet maximum
            new_team = self.rng.sample(new_team, max_size)

        # If still empty (edge case), ensure minimum team size is respected
        if not new_team:
            needed = max(min_size, 1)
            available = len(self.swarm.agents)
            new_team = self.rng.sample(self.swarm.agents, min(needed, available))

        return new_team


def get_inclusive_fitness_swarm(
    agents: List[Agent],
    random_seed: Optional[int] = None
) -> InclusiveFitnessSwarm:
    """
    Factory function to create InclusiveFitnessSwarm

    Args:
        agents: List of agents to form swarm
        random_seed: Random seed for reproducibility (None = non-deterministic)

    Returns:
        InclusiveFitnessSwarm instance
    """
    return InclusiveFitnessSwarm(agents, random_seed=random_seed)


def get_pso_optimizer(
    swarm: InclusiveFitnessSwarm,
    n_particles: int = 20,
    max_iterations: int = 50,
    random_seed: Optional[int] = None,
    restart_patience: int = 12,
    restart_fraction: float = 0.5,
) -> ParticleSwarmOptimizer:
    """
    Factory function to create PSO optimizer

    Args:
        swarm: InclusiveFitnessSwarm instance
        n_particles: Number of particles (candidate teams)
        max_iterations: Maximum PSO iterations
        random_seed: Random seed for reproducibility (None = non-deterministic)

    Returns:
        ParticleSwarmOptimizer instance
    """
    return ParticleSwarmOptimizer(
        swarm=swarm,
        n_particles=n_particles,
        max_iterations=max_iterations,
        random_seed=random_seed,
        restart_patience=restart_patience,
        restart_fraction=restart_fraction,
    )
