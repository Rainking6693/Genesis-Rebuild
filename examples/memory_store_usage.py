"""
GenesisMemoryStore Usage Examples

Demonstrates real-world usage patterns for agents to leverage
persistent memory for collective learning and efficiency.

Examples:
1. Agent saves/retrieves personal memories
2. Cross-agent sharing via business namespace
3. System-wide knowledge accumulation
4. Memory search for reusing past solutions
"""

import asyncio

from infrastructure.memory_store import GenesisMemoryStore


async def example_1_agent_personal_memory():
    """
    Example 1: Agent Personal Memory

    QA Agent stores successful test patterns for future reuse.
    """
    print("\n=== Example 1: Agent Personal Memory ===")

    memory = GenesisMemoryStore()

    # QA Agent saves a successful test procedure
    await memory.save_memory(
        namespace=("agent", "qa_001"),
        key="test_procedure_auth",
        value={
            "steps": [
                "Create test user",
                "Attempt login with valid credentials",
                "Verify JWT token issued",
                "Attempt protected endpoint access",
                "Verify 200 response"
            ],
            "coverage": 95,
            "execution_time_ms": 234,
            "success_rate": 1.0
        },
        tags=["authentication", "verified", "high_coverage"]
    )

    print("✓ QA Agent saved test procedure")

    # Later, agent retrieves the procedure
    procedure = await memory.get_memory(
        namespace=("agent", "qa_001"),
        key="test_procedure_auth"
    )

    print(f"✓ Retrieved procedure with {procedure['coverage']}% coverage")
    print(f"  Steps: {len(procedure['steps'])} test steps")

    # Search for similar procedures
    similar = await memory.search_memories(
        namespace=("agent", "qa_001"),
        query="authentication",
        limit=5
    )

    print(f"✓ Found {len(similar)} similar procedures")


async def example_2_cross_agent_sharing():
    """
    Example 2: Cross-Agent Sharing

    Multiple agents collaborate via shared business namespace.

    NOTE: In Day 1-2, we're using InMemoryBackend, so each GenesisMemoryStore
    instance has its own storage. In Day 3-4, we'll implement MongoDB backend
    which enables TRUE cross-agent sharing with persistent storage.
    """
    print("\n=== Example 2: Cross-Agent Sharing ===")

    # Create shared backend (simulates MongoDB for Day 1-2 demo)
    from infrastructure.memory_store import InMemoryBackend
    shared_backend = InMemoryBackend()

    # All agents share the same backend
    deploy_memory = GenesisMemoryStore(backend=shared_backend)
    qa_memory = GenesisMemoryStore(backend=shared_backend)
    support_memory = GenesisMemoryStore(backend=shared_backend)

    # Deploy Agent saves verified deployment procedure
    await deploy_memory.save_memory(
        namespace=("business", "saas_001"),
        key="deploy_procedure_v2",
        value={
            "steps": [
                "Run test suite (qa_agent)",
                "Build Docker image",
                "Push to registry",
                "Update k8s deployment",
                "Run health checks",
                "Monitor for 5 minutes"
            ],
            "verified_by": ["qa_agent", "deploy_agent", "support_agent"],
            "success_rate": 0.96,
            "avg_duration_minutes": 8,
            "rollback_procedure": "deploy_rollback_v2"
        },
        tags=["verified", "production", "critical"]
    )

    print("✓ Deploy Agent saved procedure to business namespace")

    # QA Agent can access the same procedure
    procedure = await qa_memory.get_memory(
        namespace=("business", "saas_001"),
        key="deploy_procedure_v2"
    )

    print(f"✓ QA Agent retrieved procedure: {procedure['success_rate']*100}% success rate")
    print(f"  Verified by: {', '.join(procedure['verified_by'])}")

    # Support Agent can also access it for documentation
    support_view = await support_memory.get_memory(
        namespace=("business", "saas_001"),
        key="deploy_procedure_v2"
    )

    print(f"✓ Support Agent also sees procedure: {support_view['avg_duration_minutes']} min avg")
    print("\n  NOTE: Day 3-4 MongoDB backend will enable automatic cross-agent sharing!")


async def example_3_system_knowledge():
    """
    Example 3: System-Wide Knowledge

    Global knowledge accessible to all agents.
    """
    print("\n=== Example 3: System-Wide Knowledge ===")

    memory = GenesisMemoryStore()

    # Genesis Meta-Agent saves system-wide best practices
    await memory.save_memory(
        namespace=("system", "global"),
        key="best_practices_error_handling",
        value={
            "principles": [
                "Always use try-except for external API calls",
                "Log errors with correlation IDs",
                "Implement exponential backoff for retries",
                "Use circuit breakers for cascading failures",
                "Never expose sensitive data in error messages"
            ],
            "learned_from_businesses": ["saas_001", "ecommerce_002", "api_service_003"],
            "success_improvement": 0.35,  # 35% fewer production errors
            "last_updated": "2025-10-22"
        },
        tags=["best_practice", "error_handling", "production"]
    )

    print("✓ System saved global best practices")

    # Any agent can retrieve system knowledge
    best_practices = await memory.get_memory(
        namespace=("system", "global"),
        key="best_practices_error_handling"
    )

    print(f"✓ Retrieved {len(best_practices['principles'])} best practices")
    print(f"  Learned from {len(best_practices['learned_from_businesses'])} businesses")
    print(f"  Success improvement: {best_practices['success_improvement']*100}%")


async def example_4_memory_search_reuse():
    """
    Example 4: Memory Search & Reuse

    Agent searches for past solutions to avoid re-computation.
    """
    print("\n=== Example 4: Memory Search & Reuse ===")

    memory = GenesisMemoryStore()

    # Save multiple test procedures
    await memory.save_memory(
        namespace=("agent", "qa_001"),
        key="test_api_endpoint_users",
        value={"endpoint": "/api/users", "method": "GET", "coverage": 92}
    )
    await memory.save_memory(
        namespace=("agent", "qa_001"),
        key="test_api_endpoint_posts",
        value={"endpoint": "/api/posts", "method": "GET", "coverage": 88}
    )
    await memory.save_memory(
        namespace=("agent", "qa_001"),
        key="test_api_endpoint_auth",
        value={"endpoint": "/api/auth", "method": "POST", "coverage": 95}
    )

    print("✓ Saved 3 API test procedures")

    # New task: Test /api/products endpoint
    # Search for similar API test patterns
    similar_tests = await memory.search_memories(
        namespace=("agent", "qa_001"),
        query="api endpoint",
        limit=5
    )

    print(f"✓ Found {len(similar_tests)} similar API tests")

    # Reuse best pattern (highest coverage)
    best_pattern = max(similar_tests, key=lambda x: x.get("coverage", 0))
    print(f"✓ Reusing pattern from {best_pattern['endpoint']} ({best_pattern['coverage']}% coverage)")
    print("  → Saves 5-10 minutes of test generation time")


async def example_5_namespace_stats():
    """
    Example 5: Namespace Statistics

    Monitor memory usage and access patterns.
    """
    print("\n=== Example 5: Namespace Statistics ===")

    memory = GenesisMemoryStore()

    # Create some test data
    for i in range(10):
        await memory.save_memory(
            namespace=("agent", "qa_001"),
            key=f"test_case_{i}",
            value={"index": i, "data": "x" * 100}
        )

    # Get statistics
    stats = await memory.get_namespace_stats(("agent", "qa_001"))

    print(f"✓ Namespace stats for ('agent', 'qa_001'):")
    print(f"  Total entries: {stats['total_entries']}")
    print(f"  Total size: {stats['total_size_bytes']} bytes")
    print(f"  Average size: {stats['avg_size_bytes']:.1f} bytes/entry")
    print(f"  Total accesses: {stats['total_accesses']}")
    print(f"  Compressed entries: {stats['compressed_entries']}")


async def example_6_cost_optimization():
    """
    Example 6: Cost Optimization via Memory

    Demonstrates 15x token multiplier reduction through memory reuse.
    """
    print("\n=== Example 6: Cost Optimization (Token Savings) ===")

    memory = GenesisMemoryStore()

    # Scenario: Generate deployment script (expensive LLM call)
    # First time: Must generate from scratch (uses LLM)
    deploy_script = {
        "script": """
#!/bin/bash
docker build -t myapp .
docker push registry.com/myapp:latest
kubectl apply -f deployment.yml
kubectl rollout status deployment/myapp
        """,
        "tokens_used": 1500,
        "llm_cost_dollars": 0.045,
        "generation_time_seconds": 3.2
    }

    # Save for future reuse
    await memory.save_memory(
        namespace=("business", "saas_001"),
        key="deploy_script_docker_k8s",
        value=deploy_script,
        tags=["deployment", "docker", "kubernetes", "verified"]
    )

    print("✓ First generation (LLM required):")
    print(f"  Tokens: {deploy_script['tokens_used']}")
    print(f"  Cost: ${deploy_script['llm_cost_dollars']}")
    print(f"  Time: {deploy_script['generation_time_seconds']}s")

    # Second time: Retrieve from memory (NO LLM call)
    cached_script = await memory.get_memory(
        namespace=("business", "saas_001"),
        key="deploy_script_docker_k8s"
    )

    retrieval_cost = 0.0001  # Negligible memory retrieval cost
    retrieval_time = 0.01    # ~10ms retrieval

    print("\n✓ Second generation (Memory reuse):")
    print(f"  Tokens: 0 (retrieved from memory)")
    print(f"  Cost: ${retrieval_cost} (99.7% savings!)")
    print(f"  Time: {retrieval_time}s (99.7% faster!)")

    # Over 100 businesses, this compounds
    businesses_count = 100
    total_savings = (deploy_script['llm_cost_dollars'] - retrieval_cost) * businesses_count

    print(f"\n✓ Scaled to {businesses_count} businesses:")
    print(f"  Without memory: ${deploy_script['llm_cost_dollars'] * businesses_count:.2f}")
    print(f"  With memory: ${retrieval_cost * businesses_count:.4f}")
    print(f"  TOTAL SAVINGS: ${total_savings:.2f} (99.7% reduction)")
    print(f"  → This is how we target 75% total cost reduction in Phase 5!")


async def main():
    """Run all examples"""
    print("=" * 60)
    print("GenesisMemoryStore Usage Examples")
    print("=" * 60)

    await example_1_agent_personal_memory()
    await example_2_cross_agent_sharing()
    await example_3_system_knowledge()
    await example_4_memory_search_reuse()
    await example_5_namespace_stats()
    await example_6_cost_optimization()

    print("\n" + "=" * 60)
    print("All examples completed successfully!")
    print("=" * 60)


if __name__ == "__main__":
    asyncio.run(main())
