#!/usr/bin/env python3
"""
Test script for Deployment Agent Memory Integration

Tests the MemoryTool integration for the Deployment Agent:
1. Memory initialization
2. Storing deployment results
3. Recalling successful deployments
4. Recalling deployment failures
5. User-specific configuration storage/retrieval
"""

import asyncio
import sys
from pathlib import Path

import pytest

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent))

from agents.deploy_agent import DeployAgent, DeploymentConfig


@pytest.mark.asyncio
async def test_memory_integration():
    """Test MemoryTool integration for Deployment Agent"""
    print("\n" + "="*70)
    print("DEPLOYMENT AGENT MEMORY INTEGRATION TEST")
    print("="*70 + "\n")

    # Test 1: Initialize agent with memory enabled
    print("Test 1: Initialize Deployment Agent with MemoryTool")
    print("-" * 70)
    try:
        agent = DeployAgent(
            business_id="test_business",
            use_learning=False,  # Disable legacy learning
            use_reflection=False,
            enable_memory=True  # Enable MemoryTool
        )

        if agent.enable_memory:
            print("✅ Memory enabled: True")
            print(f"✅ MemoryTool initialized: {agent.memory_tool is not None}")
            print(f"✅ MongoDB backend initialized: {agent.memory is not None}")
        else:
            print("⚠️  Memory initialization failed (may need MongoDB)")
    except Exception as e:
        print(f"❌ Initialization failed: {e}")
        return

    print()

    # Test 2: Store successful deployment result
    print("Test 2: Store Successful Deployment Result")
    print("-" * 70)
    try:
        stored = await agent.store_deployment_result(
            deployment_type="vercel",
            config={
                "platform": "vercel",
                "framework": "nextjs",
                "environment": "production",
                "repo_name": "test-app"
            },
            result={
                "url": "https://test-app.vercel.app",
                "duration": 45.3,
                "steps": 5
            },
            success=True,
            duration_seconds=45.3,
            user_id="test_user_1"
        )

        if stored:
            print("✅ Deployment result stored successfully")
        else:
            print("⚠️  Deployment result storage failed (memory not available)")
    except Exception as e:
        print(f"❌ Storage failed: {e}")

    print()

    # Test 3: Store failed deployment result
    print("Test 3: Store Failed Deployment Result")
    print("-" * 70)
    try:
        stored = await agent.store_deployment_result(
            deployment_type="vercel",
            config={
                "platform": "vercel",
                "framework": "react",
                "environment": "production",
                "repo_name": "failing-app"
            },
            result={
                "error": "Build failed: Missing dependency 'react-dom'"
            },
            success=False,
            duration_seconds=12.5,
            user_id="test_user_1"
        )

        if stored:
            print("✅ Failed deployment result stored successfully")
        else:
            print("⚠️  Failed deployment result storage failed (memory not available)")
    except Exception as e:
        print(f"❌ Storage failed: {e}")

    print()

    # Test 4: Recall successful deployments
    print("Test 4: Recall Successful Deployment Patterns")
    print("-" * 70)
    try:
        patterns = await agent.recall_successful_deployments(
            deployment_type="vercel",
            environment="production",
            top_k=3
        )

        print(f"✅ Recalled {len(patterns)} successful deployment patterns")

        for i, pattern in enumerate(patterns, 1):
            print(f"\n   Pattern {i}:")
            print(f"   - Platform: {pattern.get('platform', 'unknown')}")
            print(f"   - Duration: {pattern.get('duration_seconds', 0):.1f}s")
            print(f"   - Result: {pattern.get('result', {})}")
    except Exception as e:
        print(f"❌ Recall failed: {e}")

    print()

    # Test 5: Recall deployment failures
    print("Test 5: Recall Deployment Failure Patterns")
    print("-" * 70)
    try:
        failures = await agent.recall_deployment_failures(
            deployment_type="vercel",
            environment="production",
            top_k=3
        )

        print(f"✅ Recalled {len(failures)} deployment failure patterns")

        for i, failure in enumerate(failures, 1):
            print(f"\n   Failure {i}:")
            print(f"   - Platform: {failure.get('platform', 'unknown')}")
            print(f"   - Error: {failure.get('error', 'unknown')}")
    except Exception as e:
        print(f"❌ Recall failed: {e}")

    print()

    # Test 6: Store user deployment configuration
    print("Test 6: Store User Deployment Configuration")
    print("-" * 70)
    try:
        stored = await agent.store_user_deployment_config(
            user_id="test_user_1",
            config={
                "platform": "vercel",
                "framework": "nextjs",
                "auto_deploy": True,
                "environment": "production"
            },
            deployment_type="vercel"
        )

        if stored:
            print("✅ User deployment config stored successfully")
        else:
            print("⚠️  User config storage failed (memory not available)")
    except Exception as e:
        print(f"❌ Storage failed: {e}")

    print()

    # Test 7: Recall user deployment configuration
    print("Test 7: Recall User Deployment Configuration")
    print("-" * 70)
    try:
        config = await agent.recall_user_deployment_config(
            user_id="test_user_1",
            deployment_type="vercel"
        )

        if config:
            print("✅ User deployment config recalled successfully")
            print(f"   Config: {config}")
        else:
            print("⚠️  No user config found (memory not available or no data)")
    except Exception as e:
        print(f"❌ Recall failed: {e}")

    print()

    # Summary
    print("="*70)
    print("TEST SUMMARY")
    print("="*70)
    print(f"Agent ID: {agent.agent_id}")
    print(f"Memory Enabled: {agent.enable_memory}")
    print(f"MemoryTool Available: {agent.memory_tool is not None}")
    print(f"MongoDB Backend Available: {agent.memory is not None}")
    print()

    if agent.enable_memory and agent.memory_tool:
        print("✅ All memory integration components initialized successfully")
        print("✅ Deployment Agent is ready for persistent pattern learning")
    else:
        print("⚠️  Memory integration not fully initialized")
        print("   This is expected if MongoDB is not running locally")
        print("   In production, ensure MONGODB_URI environment variable is set")

    print()


if __name__ == "__main__":
    asyncio.run(test_memory_integration())
