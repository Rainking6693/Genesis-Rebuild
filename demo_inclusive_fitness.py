"""
Inclusive Fitness Swarm Optimization - Live Demo

Demonstrates:
1. Creating swarm with 15 Genesis agents
2. Optimizing team composition using PSO
3. Detecting emergent strategies
4. Comparing with random baseline

Run: python demo_inclusive_fitness.py
"""

import numpy as np
from infrastructure.swarm import (
    Agent,
    GenotypeGroup,
    TaskRequirement,
    get_inclusive_fitness_swarm,
    get_pso_optimizer,
)


def create_genesis_agents():
    """Create all 15 Genesis agents."""
    return [
        Agent(
            name="qa_agent",
            role="Quality Assurance",
            genotype=GenotypeGroup.ANALYSIS,
            capabilities=["testing", "quality_assurance", "debugging", "validation"],
            current_fitness=0.85
        ),
        Agent(
            name="builder_agent",
            role="Builder",
            genotype=GenotypeGroup.INFRASTRUCTURE,
            capabilities=["coding", "architecture", "implementation", "refactoring"],
            current_fitness=0.88
        ),
        Agent(
            name="support_agent",
            role="Support",
            genotype=GenotypeGroup.CUSTOMER_INTERACTION,
            capabilities=["customer_service", "troubleshooting", "documentation"],
            current_fitness=0.82
        ),
        Agent(
            name="deploy_agent",
            role="Deployment",
            genotype=GenotypeGroup.INFRASTRUCTURE,
            capabilities=["deployment", "ci_cd", "monitoring", "infrastructure"],
            current_fitness=0.90
        ),
        Agent(
            name="marketing_agent",
            role="Marketing",
            genotype=GenotypeGroup.CUSTOMER_INTERACTION,
            capabilities=["ads", "social_media", "analytics", "growth"],
            current_fitness=0.80
        ),
        Agent(
            name="analyst_agent",
            role="Analyst",
            genotype=GenotypeGroup.ANALYSIS,
            capabilities=["data_analysis", "reporting", "metrics", "insights"],
            current_fitness=0.87
        ),
        Agent(
            name="billing_agent",
            role="Billing",
            genotype=GenotypeGroup.FINANCE,
            capabilities=["payments", "invoicing", "subscriptions"],
            current_fitness=0.92
        ),
        Agent(
            name="legal_agent",
            role="Legal",
            genotype=GenotypeGroup.FINANCE,
            capabilities=["contracts", "compliance", "privacy"],
            current_fitness=0.95
        ),
        Agent(
            name="content_agent",
            role="Content",
            genotype=GenotypeGroup.CONTENT,
            capabilities=["writing", "copywriting", "content_strategy"],
            current_fitness=0.83
        ),
        Agent(
            name="seo_agent",
            role="SEO",
            genotype=GenotypeGroup.CONTENT,
            capabilities=["seo", "keywords", "optimization"],
            current_fitness=0.81
        ),
        Agent(
            name="email_agent",
            role="Email",
            genotype=GenotypeGroup.CONTENT,
            capabilities=["email_marketing", "campaigns", "automation"],
            current_fitness=0.84
        ),
        Agent(
            name="maintenance_agent",
            role="Maintenance",
            genotype=GenotypeGroup.INFRASTRUCTURE,
            capabilities=["monitoring", "debugging", "optimization", "uptime"],
            current_fitness=0.89
        ),
        Agent(
            name="onboarding_agent",
            role="Onboarding",
            genotype=GenotypeGroup.CUSTOMER_INTERACTION,
            capabilities=["user_training", "documentation", "tutorials"],
            current_fitness=0.86
        ),
        Agent(
            name="security_agent",
            role="Security",
            genotype=GenotypeGroup.ANALYSIS,
            capabilities=["security_audit", "penetration_testing", "compliance"],
            current_fitness=0.93
        ),
        Agent(
            name="spec_agent",
            role="Specification",
            genotype=GenotypeGroup.ANALYSIS,
            capabilities=["requirements", "specifications", "design"],
            current_fitness=0.88
        ),
    ]


def main():
    print("=" * 80)
    print("INCLUSIVE FITNESS SWARM OPTIMIZATION - LIVE DEMO")
    print("=" * 80)
    print()

    # Create agents
    print("Step 1: Creating 15 Genesis agents...")
    agents = create_genesis_agents()
    print(f"✅ Created {len(agents)} agents")
    print()

    # Create swarm
    print("Step 2: Building Inclusive Fitness Swarm...")
    swarm = get_inclusive_fitness_swarm(agents, random_seed=42)
    print("✅ Swarm initialized with 15x15 compatibility matrix")
    print()

    # Show compatibility matrix sample
    matrix = swarm.get_compatibility_matrix()
    print("Sample Compatibility Scores:")
    print(f"  QA ↔ Analyst (same genotype):     {matrix[0, 5]:.3f}")
    print(f"  QA ↔ Builder (different genotype): {matrix[0, 1]:.3f}")
    print(f"  Builder ↔ Deploy (same genotype):  {matrix[1, 3]:.3f}")
    print()

    # Create task
    print("Step 3: Defining optimization task...")
    task = TaskRequirement(
        task_id="complex_deployment_task",
        required_capabilities=["coding", "testing", "deployment", "monitoring"],
        team_size_range=(3, 6),
        priority=1.5
    )
    print("✅ Task: Build + test + deploy + monitor (team size: 3-6)")
    print()

    # Create PSO optimizer
    print("Step 4: Initializing PSO optimizer...")
    pso = get_pso_optimizer(swarm, n_particles=30, max_iterations=100, random_seed=42)
    print("✅ PSO: 30 particles, 100 max iterations")
    print()

    # Optimize team
    print("Step 5: Running PSO optimization...")
    print("-" * 80)
    best_team, best_fitness = pso.optimize_team(task, verbose=True)
    print("-" * 80)
    print()

    # Show results
    print("OPTIMIZATION RESULTS:")
    print(f"  Best fitness: {best_fitness:.3f}")
    print(f"  Team size: {len(best_team)}")
    print(f"  Team members:")
    for agent in best_team:
        print(f"    - {agent.name} ({agent.genotype.value})")
    print()

    # Calculate random baseline
    print("Step 6: Comparing with random baseline...")
    random_fitness_scores = []
    np.random.seed(42)

    for _ in range(50):
        team_size = np.random.randint(3, 7)
        random_indices = np.random.choice(len(agents), size=team_size, replace=False)
        random_team = [agents[i] for i in random_indices]
        random_fitness = swarm.evaluate_team_fitness(random_team, task)
        random_fitness_scores.append(random_fitness)

    avg_random_fitness = np.mean(random_fitness_scores)
    improvement = (best_fitness - avg_random_fitness) / avg_random_fitness * 100

    print(f"  PSO fitness:      {best_fitness:.3f}")
    print(f"  Random baseline:  {avg_random_fitness:.3f}")
    print(f"  Improvement:      {improvement:.1f}%")
    print(f"  Target:           15-20%")
    print(f"  Status:           {'✅ EXCEEDED' if improvement >= 15 else '❌ BELOW TARGET'}")
    print()

    # Detect emergent strategies
    print("Step 7: Detecting emergent strategies...")
    strategies = pso.detect_emergent_strategies()
    if strategies:
        print("  Emergent strategies detected:")
        for strategy in strategies:
            print(f"    - {strategy}")
    else:
        print("  No emergent strategies detected (need >5 teams in history)")
    print()

    # Get optimization stats
    stats = pso.get_optimization_stats()
    print("OPTIMIZATION STATISTICS:")
    print(f"  Iterations: {stats['iterations']}")
    print(f"  Final fitness: {stats['final_fitness']:.3f}")
    print(f"  Convergence: Iteration {stats['convergence_iteration']}")
    print()

    # Show genotype distribution
    genotype_counts = {}
    for agent in best_team:
        genotype = agent.genotype.value
        genotype_counts[genotype] = genotype_counts.get(genotype, 0) + 1

    print("TEAM GENOTYPE DISTRIBUTION:")
    for genotype, count in sorted(genotype_counts.items()):
        print(f"  {genotype}: {count} agent(s)")
    print()

    print("=" * 80)
    print("DEMO COMPLETE - Inclusive Fitness Swarm Optimization Working!")
    print("=" * 80)


if __name__ == "__main__":
    main()
