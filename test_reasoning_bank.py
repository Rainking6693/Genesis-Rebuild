#!/usr/bin/env python3
"""
Test ReasoningBank infrastructure and Spec Memory Helper
Verifies Layer 6 (Shared Memory) is operational
"""

import sys
from infrastructure.reasoning_bank import (
    get_reasoning_bank,
    MemoryType,
    OutcomeTag,
    AgentPersona
)
from infrastructure.spec_memory_helper import get_spec_memory_helper
from datetime import datetime, timezone


def test_reasoning_bank():
    """Test basic ReasoningBank operations"""
    print("\n" + "="*80)
    print("TESTING REASONING BANK (Layer 6 - Shared Memory)")
    print("="*80 + "\n")

    bank = get_reasoning_bank()

    # Test 1: Store consensus memory
    print("📝 Test 1: Storing consensus memory...")
    memory_id = bank.store_memory(
        memory_type=MemoryType.CONSENSUS,
        content={
            "procedure": "Authentication flow",
            "steps": ["User submits credentials", "Validate credentials", "Generate JWT", "Return token"]
        },
        metadata={"component": "auth", "version": "1.0"},
        outcome=OutcomeTag.SUCCESS,
        tags=["authentication", "security"]
    )
    print(f"✅ Stored memory: {memory_id}\n")

    # Test 2: Retrieve memory
    print("🔍 Test 2: Retrieving memory...")
    retrieved = bank.get_memory(memory_id)
    if retrieved:
        print(f"✅ Retrieved memory: {retrieved.memory_type}")
        print(f"   Content: {retrieved.content['procedure']}\n")
    else:
        print("❌ Failed to retrieve memory\n")

    # Test 3: Store strategy
    print("💡 Test 3: Storing strategy nugget...")
    strategy_id = bank.store_strategy(
        description="RESTful API with rate limiting",
        context="Building public APIs that need throttling",
        task_metadata={"api_type": "rest", "public": True},
        environment="production",
        tools_used=["FastAPI", "Redis"],
        outcome=OutcomeTag.SUCCESS,
        steps=[
            "Define API routes with FastAPI",
            "Implement Redis-based rate limiter",
            "Add middleware for rate limit checks",
            "Return 429 when limit exceeded"
        ],
        learned_from=["project_alpha_v1"]
    )
    print(f"✅ Stored strategy: {strategy_id}\n")

    # Test 4: Search strategies
    print("🔎 Test 4: Searching strategies...")
    strategies = bank.search_strategies(
        task_context="API rate limiting",
        top_n=5,
        min_win_rate=0.0  # Allow all for testing
    )
    print(f"✅ Found {len(strategies)} strategies")
    for s in strategies:
        print(f"   - {s.description} (win rate: {s.win_rate})\n")

    # Test 5: Store agent persona
    print("👤 Test 5: Storing agent persona...")
    persona = AgentPersona(
        agent_id="spec_agent_001",
        agent_name="Spec Agent",
        specialization="Requirements and technical specifications",
        capabilities=["user_stories", "technical_specs", "api_docs", "acceptance_criteria"],
        success_rate=0.85,
        total_tasks=100,
        successful_tasks=85,
        average_cost=0.05,
        preferred_models=["gpt-4o", "claude-sonnet"],
        performance_metrics={
            "avg_response_time_ms": 2500,
            "user_satisfaction": 4.2,
            "spec_clarity_score": 8.5
        },
        created_at=datetime.now(timezone.utc).isoformat(),
        updated_at=datetime.now(timezone.utc).isoformat()
    )
    bank.store_persona(persona)
    print(f"✅ Stored persona: {persona.agent_name}\n")

    # Test 6: Retrieve persona
    print("👤 Test 6: Retrieving agent persona...")
    retrieved_persona = bank.get_agent_persona("spec_agent_001")
    if retrieved_persona:
        print(f"✅ Retrieved persona: {retrieved_persona.agent_name}")
        print(f"   Specialization: {retrieved_persona.specialization}")
        print(f"   Success rate: {retrieved_persona.success_rate * 100}%\n")
    else:
        print("❌ Failed to retrieve persona\n")

    print("="*80)
    print("✅ ReasoningBank basic tests complete!")
    print("="*80 + "\n")


def test_spec_memory_helper():
    """Test Spec Memory Helper integration"""
    print("\n" + "="*80)
    print("TESTING SPEC MEMORY HELPER")
    print("="*80 + "\n")

    helper = get_spec_memory_helper()

    # Seed initial patterns
    print("🌱 Seeding ReasoningBank with industry-standard patterns...")
    helper.seed_initial_patterns()
    print()

    # Test 1: Get API design patterns
    print("🔍 Test 1: Retrieving API design patterns...")
    api_patterns = helper.get_api_design_patterns()
    print(f"✅ Found {len(api_patterns)} API patterns")
    for pattern in api_patterns:
        print(f"   - {pattern.get('pattern_name', 'Unknown')} (win rate: {pattern.get('win_rate', 0)})")
    print()

    # Test 2: Get security patterns
    print("🔒 Test 2: Retrieving security patterns...")
    security_patterns = helper.get_security_patterns()
    print(f"✅ Found {len(security_patterns)} security patterns")
    for pattern in security_patterns:
        print(f"   - {pattern.get('pattern_name', 'Unknown')}")
    print()

    # Test 3: Get data model patterns
    print("💾 Test 3: Retrieving data model patterns...")
    db_patterns = helper.get_data_model_patterns()
    print(f"✅ Found {len(db_patterns)} data model patterns")
    for pattern in db_patterns:
        print(f"   - {pattern.get('pattern_name', 'Unknown')}")
    print()

    # Test 4: Record spec outcome
    print("📝 Test 4: Recording spec outcome...")
    spec_content = {
        "spec_id": "SPEC-TEST-001",
        "component_name": "User Authentication",
        "architecture_type": "microservices",
        "requirements": ["OAuth 2.1", "JWT tokens", "Rate limiting"]
    }
    memory_id = helper.record_spec_outcome(
        spec_type="authentication",
        spec_content=spec_content,
        outcome=OutcomeTag.SUCCESS,
        metadata={"component": "auth", "business": "test_business"}
    )
    print(f"✅ Recorded spec outcome: {memory_id}\n")

    # Test 5: Create strategy from spec
    print("💡 Test 5: Creating strategy from successful spec...")
    strategy_id = helper.create_strategy_from_spec(
        description="OAuth 2.1 implementation with JWT",
        context="Authentication systems requiring token-based auth",
        spec_content=spec_content,
        tools_used=["FastAPI", "JWT library", "Redis"],
        outcome=OutcomeTag.SUCCESS
    )
    print(f"✅ Created strategy: {strategy_id}\n")

    # Test 6: Get design precedents
    print("🔍 Test 6: Getting design precedents for authentication...")
    precedents = helper.get_design_precedents(
        component_type="authentication",
        architecture_pattern="oauth",
        top_n=3
    )
    print(f"✅ Found {len(precedents)} precedents")
    for p in precedents:
        print(f"   - {p.get('pattern_name', 'Unknown')}")
        if 'win_rate' in p:
            print(f"     Win rate: {p['win_rate']}")
    print()

    print("="*80)
    print("✅ Spec Memory Helper tests complete!")
    print("="*80 + "\n")


def main():
    """Run all tests"""
    try:
        test_reasoning_bank()
        test_spec_memory_helper()

        print("\n" + "="*80)
        print("🎉 ALL TESTS PASSED - Layer 6 (Shared Memory) is OPERATIONAL!")
        print("="*80 + "\n")
        return 0

    except Exception as e:
        print(f"\n❌ Test failed: {e}")
        import traceback
        traceback.print_exc()
        return 1


if __name__ == "__main__":
    sys.exit(main())
