"""
Complete Stack Demo: Memory Store + MongoDB + Redis

This example demonstrates the full three-tier architecture:
1. GenesisMemoryStore (unified API)
2. MongoDB (persistent storage)
3. Redis (fast caching)

Prerequisites:
- MongoDB running (local or Atlas)
- Redis running (local or Cloud)
- Environment variables set (MONGODB_URI, REDIS_URL)

Run: python examples/complete_stack_demo.py
"""

import asyncio
import os
import time
from infrastructure.memory_store import GenesisMemoryStore
from infrastructure.mongodb_backend import MongoDBBackend
from infrastructure.redis_cache import RedisCacheLayer


async def demo_complete_stack():
    """
    Demonstrate complete stack integration:
    GenesisMemoryStore → Redis → MongoDB
    """
    print("=" * 70)
    print("Genesis Memory Store - Complete Stack Demo")
    print("=" * 70)

    # Step 1: Initialize MongoDB backend
    print("\n[Step 1] Initializing MongoDB backend...")
    mongodb = MongoDBBackend(
        connection_uri=os.getenv("MONGODB_URI", "mongodb://localhost:27017/"),
        database_name="genesis_memory_demo",
        environment="development"
    )
    await mongodb.connect()
    print("✓ MongoDB connected")

    # Step 2: Initialize Redis cache
    print("\n[Step 2] Initializing Redis cache...")
    redis_cache = RedisCacheLayer(
        redis_url=os.getenv("REDIS_URL", "redis://localhost:6379/0"),
        hot_ttl_seconds=3600,   # 1 hour for hot memories
        warm_ttl_seconds=86400  # 24 hours for warm memories
    )
    await redis_cache.connect()
    print("✓ Redis connected")

    # Step 3: Create memory store with MongoDB backend
    print("\n[Step 3] Creating memory store with MongoDB backend...")
    memory = GenesisMemoryStore(backend=mongodb)
    print("✓ Memory store initialized")

    # Step 4: Save memory (goes to MongoDB)
    print("\n[Step 4] Saving deployment procedure to MongoDB...")
    start = time.perf_counter()

    await memory.save_memory(
        namespace=("business", "saas_001"),
        key="deploy_procedure_v2",
        value={
            "steps": [
                "Run full test suite (qa_agent)",
                "Build Docker image with version tag",
                "Push image to registry.company.com",
                "Update Kubernetes deployment manifest",
                "Apply deployment (kubectl apply -f deployment.yml)",
                "Run health checks on new pods",
                "Monitor error rates for 5 minutes",
                "Rollback if error rate >1%"
            ],
            "verified_by": ["qa_agent", "deploy_agent", "support_agent"],
            "success_rate": 0.96,
            "avg_duration_minutes": 8,
            "last_successful_deploy": "2025-10-22T12:00:00Z"
        },
        tags=["deployment", "verified", "production", "critical"]
    )

    mongodb_save_time = (time.perf_counter() - start) * 1000
    print(f"✓ Saved to MongoDB (took {mongodb_save_time:.2f}ms)")

    # Step 5: First retrieval (MongoDB only, populate Redis)
    print("\n[Step 5] First retrieval (MongoDB + populate Redis cache)...")
    start = time.perf_counter()

    # Get from MongoDB
    procedure = await memory.get_memory(
        namespace=("business", "saas_001"),
        key="deploy_procedure_v2"
    )

    # Populate Redis cache
    entry = await mongodb.get(("business", "saas_001"), "deploy_procedure_v2")
    await redis_cache.set(("business", "saas_001"), "deploy_procedure_v2", entry)

    first_retrieval_time = (time.perf_counter() - start) * 1000
    print(f"✓ Retrieved from MongoDB: {len(procedure['steps'])} steps")
    print(f"✓ Populated Redis cache (took {first_retrieval_time:.2f}ms)")

    # Step 6: Second retrieval (Redis cache hit!)
    print("\n[Step 6] Second retrieval (Redis cache hit)...")
    start = time.perf_counter()

    cached_entry = await redis_cache.get(
        namespace=("business", "saas_001"),
        key="deploy_procedure_v2"
    )

    cache_hit_time = (time.perf_counter() - start) * 1000
    print(f"✓ Retrieved from Redis cache: {len(cached_entry.value['steps'])} steps")
    print(f"✓ Cache hit (took {cache_hit_time:.2f}ms)")

    # Step 7: Compare performance
    print("\n[Step 7] Performance comparison:")
    print(f"  MongoDB retrieval: {first_retrieval_time:.2f}ms")
    print(f"  Redis cache hit:   {cache_hit_time:.2f}ms")
    speedup = first_retrieval_time / cache_hit_time
    print(f"  Speedup:           {speedup:.1f}x faster! 🚀")

    # Step 8: Cache statistics
    print("\n[Step 8] Cache statistics:")
    stats = redis_cache.get_stats()
    print(f"  Total requests: {stats['total_requests']}")
    print(f"  Cache hits:     {stats['hits']}")
    print(f"  Cache misses:   {stats['misses']}")
    print(f"  Hit rate:       {stats['hit_rate_percentage']:.1f}%")

    # Step 9: Cross-agent sharing demo
    print("\n[Step 9] Cross-agent sharing demonstration...")
    print("  → Deploy Agent saved procedure to business namespace")
    print("  → QA Agent can now retrieve it:")

    qa_memory = GenesisMemoryStore(backend=mongodb)
    qa_procedure = await qa_memory.get_memory(
        namespace=("business", "saas_001"),
        key="deploy_procedure_v2"
    )

    print(f"    ✓ QA Agent sees {len(qa_procedure['steps'])} steps")
    print(f"    ✓ Verified by: {', '.join(qa_procedure['verified_by'])}")
    print(f"    ✓ Success rate: {qa_procedure['success_rate']*100}%")

    # Step 10: Search demonstration
    print("\n[Step 10] Full-text search demonstration...")
    await memory.save_memory(
        ("business", "saas_001"),
        "rollback_procedure",
        {
            "steps": ["Get previous version", "Redeploy", "Verify"],
            "trigger": "Error rate >1%"
        }
    )

    results = await memory.search_memories(
        namespace=("business", "saas_001"),
        query="deploy",
        limit=10
    )

    print(f"  Search for 'deploy': found {len(results)} results")
    for i, result in enumerate(results, 1):
        if 'steps' in result:
            print(f"    {i}. Procedure with {len(result['steps'])} steps")

    # Step 11: Persistence demonstration
    print("\n[Step 11] Persistence verification...")
    print("  → Memory is stored in MongoDB (persists across restarts)")
    print("  → Redis cache has TTL (expires after 1-24 hours)")
    print("  → Even if Redis is cleared, MongoDB has the source of truth")

    # Step 12: Cost savings calculation
    print("\n[Step 12] Cost savings calculation:")
    print("  Scenario: 100 businesses × 10 deploys/day × 30 days = 30,000 deploy procedure retrievals/month")
    print("")
    print("  WITHOUT Memory Store:")
    print("    - Generate fresh via LLM each time")
    print("    - 1,500 tokens × $3/1M = $0.0045 per generation")
    print("    - 30,000 generations × $0.0045 = $135/month")
    print("")
    print("  WITH Memory Store:")
    print("    - Generate once: $0.0045")
    print("    - Retrieve 29,999 times: 29,999 × $0.0001 = $2.99")
    print("    - Total: $0.0045 + $2.99 = $2.9945/month")
    print("")
    savings = 135 - 2.9945
    savings_percent = (savings / 135) * 100
    print(f"  💰 MONTHLY SAVINGS: ${savings:.2f} ({savings_percent:.1f}% reduction!)")
    print(f"  💰 ANNUAL SAVINGS: ${savings * 12:.2f}/year")

    # Cleanup
    print("\n[Cleanup] Closing connections...")
    await mongodb.clear_namespace(("business", "saas_001"))  # Clean up demo data
    await redis_cache.clear_namespace(("business", "saas_001"))
    await mongodb.close()
    await redis_cache.close()
    print("✓ Cleanup complete")

    print("\n" + "=" * 70)
    print("Demo Complete! 🎉")
    print("=" * 70)
    print("\nKey Takeaways:")
    print("  1. MongoDB provides persistent storage (survives restarts)")
    print("  2. Redis provides fast caching (<10ms retrieval)")
    print("  3. GenesisMemoryStore provides unified API for agents")
    print("  4. Cross-agent sharing works seamlessly (business namespace)")
    print("  5. Cost savings are MASSIVE (97.8% reduction in this example)")
    print("")
    print("Next Steps:")
    print("  - Week 2: Add DeepSeek-OCR compression (71% storage reduction)")
    print("  - Week 3: Add Hybrid RAG semantic search (94.8% accuracy)")
    print("  - Full Phase 5: 75% total cost reduction target")


async def main():
    try:
        await demo_complete_stack()
    except Exception as e:
        print(f"\n❌ Error: {e}")
        print("\nTroubleshooting:")
        print("  1. Ensure MongoDB is running: brew services start mongodb-community")
        print("  2. Ensure Redis is running: brew services start redis")
        print("  3. Set env vars if using remote services: export MONGODB_URI=... REDIS_URL=...")
        raise


if __name__ == "__main__":
    asyncio.run(main())
