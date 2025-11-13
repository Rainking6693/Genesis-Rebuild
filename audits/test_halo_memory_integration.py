#!/usr/bin/env python3
"""
Test Suite for HALO Router Memory Integration
Hudson's Audit Protocol V2 - Functional Testing
"""

import sys
import os
import tempfile
import warnings
from pathlib import Path

# Add project root to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from infrastructure.halo_router import HALORouter
from infrastructure.task_dag import TaskDAG, Task
from infrastructure.memory.memori_client import MemoriClient

try:
    from pydantic.errors import PydanticDeprecatedSince20
except Exception:  # pragma: no cover - fallback when pydantic not available
    class PydanticDeprecatedSince20(DeprecationWarning):
        """Fallback warning to keep filter compatible."""

warnings.filterwarnings("ignore", category=PydanticDeprecatedSince20)
warnings.filterwarnings(
    "ignore",
    module=r"infrastructure\.htdag_planner",
    category=DeprecationWarning,
)

def _run_memory_initialization():
    """Test 1: Verify MemoriClient initializes correctly"""
    print("\n=== Test 1: Memory Initialization ===")

    # Create temp database
    with tempfile.NamedTemporaryFile(suffix='.db', delete=False) as tmp:
        db_path = tmp.name

    try:
        # Initialize with memory enabled
        client = MemoriClient(db_path=db_path)
        router = HALORouter(enable_memory=True, memori_client=client)

        assert router.enable_memory == True
        assert router.memori_client is not None
        print("✓ Memory initialized successfully")

        # Test with memory disabled
        router_no_mem = HALORouter(enable_memory=False)
        assert router_no_mem.enable_memory == False
        assert router_no_mem.memori_client is None
        print("✓ Memory disabled mode works")

        return True
    except Exception as e:
        print(f"✗ FAILED: {e}")
        return False
    finally:
        if os.path.exists(db_path):
            os.unlink(db_path)


def test_memory_initialization():
    assert _run_memory_initialization()


def _run_memory_recall():
    """Test 2: Test _recall_routing_from_memory()"""
    print("\n=== Test 2: Memory Recall ===")

    with tempfile.NamedTemporaryFile(suffix='.db', delete=False) as tmp:
        db_path = tmp.name

    try:
        client = MemoriClient(db_path=db_path)
        router = HALORouter(enable_memory=True, memori_client=client)

        # Store a successful routing decision
        router.store_routing_decision(
            task_id="test_task_1",
            task_type="test",
            task_description="Test task",
            agent_id="qa_agent",
            user_id="test_user",
            success=True,
            session_id="test_session"
        )

        # Create a similar task and test recall
        task = Task(
            task_id="test_task_2",
            description="Another test task",
            task_type="test"
        )

        recalled_agent = router._recall_routing_from_memory(
            task=task,
            task_type="test",
            available_agents=["qa_agent", "builder_agent"],
            user_id="test_user"
        )

        assert recalled_agent == "qa_agent", f"Expected 'qa_agent', got '{recalled_agent}'"
        print("✓ Memory recall returned correct agent")

        # Test with no matching memories
        recalled_none = router._recall_routing_from_memory(
            task=task,
            task_type="nonexistent_type",
            available_agents=["qa_agent"],
            user_id="test_user"
        )

        assert recalled_none is None
        print("✓ Memory recall correctly returns None for no matches")

        return True
    except Exception as e:
        print(f"✗ FAILED: {e}")
        import traceback
        traceback.print_exc()
        return False
    finally:
        if os.path.exists(db_path):
            os.unlink(db_path)


def test_memory_recall():
    assert _run_memory_recall()


def _run_routing_decision_storage():
    """Test 3: Test store_routing_decision()"""
    print("\n=== Test 3: Routing Decision Storage ===")

    with tempfile.NamedTemporaryFile(suffix='.db', delete=False) as tmp:
        db_path = tmp.name

    try:
        client = MemoriClient(db_path=db_path)
        router = HALORouter(enable_memory=True, memori_client=client)

        # Store a routing decision
        router.store_routing_decision(
            task_id="store_test_1",
            task_type="implement",
            task_description="Build a feature",
            agent_id="builder_agent",
            user_id="dev_user",
            success=None,  # Pending
            session_id="session_123"
        )

        # Verify it was stored
        memory = client.get_memory(
            namespace="halo_routing",
            subject="dev_user",
            key="routing_store_test_1"
        )

        assert memory is not None, "Memory should be stored"
        assert memory.value["task_id"] == "store_test_1"
        assert memory.value["agent_id"] == "builder_agent"
        assert memory.value["success"] is None
        print("✓ Routing decision stored correctly")

        return True
    except Exception as e:
        print(f"✗ FAILED: {e}")
        import traceback
        traceback.print_exc()
        return False
    finally:
        if os.path.exists(db_path):
            os.unlink(db_path)


def test_routing_decision_storage():
    assert _run_routing_decision_storage()


def _run_routing_outcome_update():
    """Test 4: Test update_routing_outcome()"""
    print("\n=== Test 4: Routing Outcome Update ===")

    with tempfile.NamedTemporaryFile(suffix='.db', delete=False) as tmp:
        db_path = tmp.name

    try:
        client = MemoriClient(db_path=db_path)
        router = HALORouter(enable_memory=True, memori_client=client)

        # Store initial decision
        router.store_routing_decision(
            task_id="outcome_test_1",
            task_type="test",
            task_description="Run tests",
            agent_id="qa_agent",
            user_id="test_user",
            success=None
        )

        # Update with outcome
        router.update_routing_outcome(
            task_id="outcome_test_1",
            success=True,
            user_id="test_user",
            outcome_metadata={"duration": 5.2}
        )

        # Verify update
        memory = client.get_memory(
            namespace="halo_routing",
            subject="test_user",
            key="routing_outcome_test_1"
        )

        assert memory is not None
        assert memory.value["success"] == True
        assert "outcome_timestamp" in memory.value
        assert memory.value["outcome_metadata"]["duration"] == 5.2
        print("✓ Routing outcome updated correctly")

        return True
    except Exception as e:
        print(f"✗ FAILED: {e}")
        import traceback
        traceback.print_exc()
        return False
    finally:
        if os.path.exists(db_path):
            os.unlink(db_path)


def test_routing_outcome_update():
    assert _run_routing_outcome_update()


def _run_acl_enforcement():
    """Test 5: Test ACL enforcement (user_id isolation)"""
    print("\n=== Test 5: ACL Enforcement ===")

    with tempfile.NamedTemporaryFile(suffix='.db', delete=False) as tmp:
        db_path = tmp.name

    try:
        client = MemoriClient(db_path=db_path)
        router = HALORouter(enable_memory=True, memori_client=client)

        # Store decision for user1
        router.store_routing_decision(
            task_id="acl_test_1",
            task_type="security",
            task_description="Security scan",
            agent_id="security_agent",
            user_id="user1",
            success=True
        )

        # Try to recall with user2 - should not find it
        task = Task(
            task_id="acl_test_2",
            description="Another security scan",
            task_type="security"
        )

        recalled = router._recall_routing_from_memory(
            task=task,
            task_type="security",
            available_agents=["security_agent"],
            user_id="user2"
        )

        assert recalled is None, "Should not access user1's memories as user2"
        print("✓ ACL enforcement works - users isolated")

        # Verify user1 can still access their own memories
        recalled_user1 = router._recall_routing_from_memory(
            task=task,
            task_type="security",
            available_agents=["security_agent"],
            user_id="user1"
        )

        assert recalled_user1 == "security_agent"
        print("✓ Users can access their own memories")

        return True
    except Exception as e:
        print(f"✗ FAILED: {e}")
        import traceback
        traceback.print_exc()
        return False
    finally:
        if os.path.exists(db_path):
            os.unlink(db_path)


def test_acl_enforcement():
    assert _run_acl_enforcement()


def _run_graceful_degradation():
    """Test 6: Test graceful degradation when memory unavailable"""
    print("\n=== Test 6: Graceful Degradation ===")

    try:
        # Router with memory disabled should still route
        router = HALORouter(enable_memory=False)

        dag = TaskDAG()
        task = Task(
            task_id="fallback_test",
            description="Test fallback routing",
            task_type="implement"
        )
        dag.add_task(task)

        # Should route without memory
        import asyncio
        plan = asyncio.run(router.route_tasks(dag))

        assert "fallback_test" in plan.assignments
        assert plan.assignments["fallback_test"] == "builder_agent"
        print("✓ Router works without memory")

        # Test with memory enabled but recall fails
        with tempfile.NamedTemporaryFile(suffix='.db', delete=False) as tmp:
            db_path = tmp.name

        try:
            client = MemoriClient(db_path=db_path)
            router_mem = HALORouter(enable_memory=True, memori_client=client)

            # Close client to simulate failure
            client.close()

            # Should still route via fallback
            plan2 = asyncio.run(router_mem.route_tasks(dag))

            assert "fallback_test" in plan2.assignments
            print("✓ Router degrades gracefully when memory fails")

        finally:
            if os.path.exists(db_path):
                os.unlink(db_path)
        return True
    except Exception as e:
        print(f"✗ FAILED: {e}")
        import traceback
        traceback.print_exc()
        return False


def test_graceful_degradation():
    assert _run_graceful_degradation()


def _run_integration_with_routing():
    """Test 7: Test full integration with route_tasks()"""
    print("\n=== Test 7: Integration with route_tasks() ===")

    with tempfile.NamedTemporaryFile(suffix='.db', delete=False) as tmp:
        db_path = tmp.name

    try:
        client = MemoriClient(db_path=db_path)
        router = HALORouter(enable_memory=True, memori_client=client)

        # First routing - should use rules
        dag = TaskDAG()
        task1 = Task(
            task_id="integration_test_1",
            description="Build feature",
            task_type="implement"
        )
        dag.add_task(task1)

        import asyncio
        plan1 = asyncio.run(router.route_tasks(
            dag,
            session_id="session1",
            user_id="integration_user"
        ))

        assert "integration_test_1" in plan1.assignments
        first_agent = plan1.assignments["integration_test_1"]
        print(f"✓ First routing assigned to {first_agent}")

        # Update outcome as success
        router.update_routing_outcome(
            task_id="integration_test_1",
            success=True,
            user_id="integration_user"
        )

        # Second routing - should recall from memory
        dag2 = TaskDAG()
        task2 = Task(
            task_id="integration_test_2",
            description="Build another feature",
            task_type="implement"
        )
        dag2.add_task(task2)

        plan2 = asyncio.run(router.route_tasks(
            dag2,
            session_id="session2",
            user_id="integration_user"
        ))

        assert "integration_test_2" in plan2.assignments
        second_agent = plan2.assignments["integration_test_2"]

        # Should use same agent from memory
        assert second_agent == first_agent, f"Expected {first_agent}, got {second_agent}"
        print(f"✓ Second routing used memory: {second_agent}")

        return True
    except Exception as e:
        print(f"✗ FAILED: {e}")
        import traceback
        traceback.print_exc()
        return False
    finally:
        if os.path.exists(db_path):
            os.unlink(db_path)


def test_integration_with_routing():
    assert _run_integration_with_routing()


def main():
    """Run all tests"""
    print("=" * 60)
    print("HALO Router Memory Integration Test Suite")
    print("Hudson's Audit Protocol V2")
    print("=" * 60)

    tests = [
        _run_memory_initialization,
        _run_memory_recall,
        _run_routing_decision_storage,
        _run_routing_outcome_update,
        _run_acl_enforcement,
        _run_graceful_degradation,
        _run_integration_with_routing,
    ]

    results = []
    for test_func in tests:
        try:
            result = test_func()
            results.append((test_func.__name__, result))
        except Exception as e:
            print(f"\n✗ EXCEPTION in {test_func.__name__}: {e}")
            import traceback
            traceback.print_exc()
            results.append((test_func.__name__, False))

    print("\n" + "=" * 60)
    print("TEST RESULTS SUMMARY")
    print("=" * 60)

    passed = sum(1 for _, result in results if result)
    total = len(results)

    for test_name, result in results:
        status = "✓ PASS" if result else "✗ FAIL"
        print(f"{status}: {test_name}")

    print(f"\nTotal: {passed}/{total} tests passed")

    if passed == total:
        print("\n✓ ALL TESTS PASSED")
        return 0
    else:
        print(f"\n✗ {total - passed} TESTS FAILED")
        return 1


if __name__ == "__main__":
    sys.exit(main())
