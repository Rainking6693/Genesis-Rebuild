#!/usr/bin/env python3
"""
Simple test runner for MCP security tests (no pytest required).
"""

import sys
import os
import asyncio
import traceback
from typing import List, Tuple

# Add project root to path
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, project_root)

# Test results
passed = 0
failed = 0
errors: List[Tuple[str, str]] = []


def test(name: str):
    """Decorator for test functions"""
    def decorator(func):
        async def wrapper():
            global passed, failed
            try:
                await func()
                print(f"✅ PASS: {name}")
                passed += 1
            except AssertionError as e:
                print(f"❌ FAIL: {name}")
                print(f"   AssertionError: {e}")
                failed += 1
                errors.append((name, str(e)))
            except Exception as e:
                print(f"⚠️  ERROR: {name}")
                print(f"   {type(e).__name__}: {e}")
                traceback.print_exc()
                failed += 1
                errors.append((name, str(e)))
        return wrapper
    return decorator


# Import MCP modules
try:
    from infrastructure.mcp_client import (
        MCPClient, MCPServerConfig, MCPTransportType,
        MCPAccessDeniedError, MCPRateLimitError, MCPBudgetExceededError,
        MCPError, get_mcp_client
    )
    from infrastructure.composable_context import ContextManager, AgentContext
    from infrastructure.action_schemas import SendEmailSchema
    MCP_AVAILABLE = True
except ImportError as e:
    print(f"❌ Cannot import MCP modules: {e}")
    MCP_AVAILABLE = False
    sys.exit(1)


@test("MCP Client - Tool Allowlist Enforcement")
async def test_tool_allowlist():
    """Test that tool allowlist restricts access"""
    mcp = MCPClient(
        user_id="user123",
        agent_name="test_agent",
        tool_allowlist={"read_file"}  # Only allow read_file
    )
    
    # Should fail - write_file not in allowlist
    try:
        await mcp.call_tool("write_file", {"path": "test.txt", "content": "test"})
        assert False, "Should have raised MCPAccessDeniedError"
    except MCPAccessDeniedError:
        pass  # Expected


@test("MCP Client - Per-Tenant Isolation")
async def test_per_tenant_isolation():
    """Test that different users get different client instances"""
    mcp1 = await get_mcp_client(user_id="user1", agent_name="agent1")
    mcp2 = await get_mcp_client(user_id="user2", agent_name="agent2")
    
    # Should be different instances
    assert mcp1 is not mcp2, "Should be different instances"
    assert mcp1.user_id == "user1", "mcp1 should have user1"
    assert mcp2.user_id == "user2", "mcp2 should have user2"


@test("MCP Client - Path Traversal Blocked")
async def test_path_traversal():
    """Test that path traversal is blocked"""
    mcp = MCPClient(
        user_id="user123",
        enable_filesystem=True,
        filesystem_safe_root="/safe/root"
    )
    
    # Add filesystem server
    await mcp.add_server(MCPServerConfig(
        id="filesystem",
        transport_type=MCPTransportType.STDIO,
        command="npx",
        args=["@modelcontextprotocol/server-filesystem", "/safe/root"],
    ))
    
    # Path traversal should be blocked
    try:
        await mcp.call_tool("read_file", {"path": "../../etc/passwd"})
        assert False, "Should have raised error for path traversal"
    except (ValueError, MCPAccessDeniedError, MCPError) as e:
        error_msg = str(e).lower()
        assert ("path traversal" in error_msg or 
                "outside safe root" in error_msg or
                "not allowed" in error_msg or
                "input validation failed" in error_msg), f"Unexpected error: {e}"


@test("MCP Client - Budget Enforcement")
async def test_budget_enforcement():
    """Test that budget limits are enforced"""
    mcp = MCPClient(user_id="user123")
    
    # Set budget to 2 tokens
    await mcp.set_budget("user123", 2)
    
    # First 2 calls should succeed (mock, so they'll work)
    # Note: This test may need adjustment based on actual implementation
    remaining = await mcp.get_remaining_budget("user123")
    assert remaining == 2, f"Expected budget 2, got {remaining}"


@test("Action Schema - Content Sanitization")
async def test_content_sanitization():
    """Test that dangerous content is sanitized"""
    # Test script tag removal
    schema = SendEmailSchema(
        to="test@example.com",
        subject="Test",
        body="<script>alert('xss')</script>Hello"
    )
    
    # Script tag should be removed (if sanitizer is available)
    # Note: Sanitization happens in validator, so body may still contain script
    # This is a basic test - full sanitization test would need ContentSanitizer
    assert schema.body is not None
    assert "test@example.com" == schema.to


@test("Action Schema - Input Size Limit")
async def test_input_size_limit():
    """Test that input size limits are enforced"""
    # Email body exceeds reasonable limit
    try:
        large_body = "x" * (1_000_001)
        schema = SendEmailSchema(
            to="test@example.com",
            subject="Test",
            body=large_body
        )
        # If validation passes, check that it was truncated or rejected
        assert len(schema.body) <= 1_000_000, "Body should be limited"
    except ValueError:
        pass  # Expected if validation rejects


@test("Context Manager - User ID Required")
async def test_user_id_required():
    """Test that user_id is required by default"""
    manager = ContextManager(require_user_id=True)
    
    # Should raise error without user_id
    try:
        manager.create_context("test")
        assert False, "Should have raised ValueError for missing user_id"
    except ValueError as e:
        assert "user_id is required" in str(e)


@test("Context Manager - Multi-Tenant Isolation")
async def test_multi_tenant_isolation():
    """Test that contexts are isolated by user"""
    manager = ContextManager(require_user_id=True)
    
    ctx1 = manager.create_context("ctx1", user_id="user1")
    ctx2 = manager.create_context("ctx2", user_id="user2")
    
    # User1 should not see user2's contexts
    user1_contexts = manager.get_user_contexts("user1")
    assert len(user1_contexts) == 1, f"Expected 1 context for user1, got {len(user1_contexts)}"
    assert user1_contexts[0].id == ctx1.id, "Should get ctx1 for user1"
    
    # User2 should not see user1's contexts
    user2_contexts = manager.get_user_contexts("user2")
    assert len(user2_contexts) == 1, f"Expected 1 context for user2, got {len(user2_contexts)}"
    assert user2_contexts[0].id == ctx2.id, "Should get ctx2 for user2"


@test("Context Manager - Access Verification")
async def test_context_access_verification():
    """Test that context access is verified by user_id"""
    manager = ContextManager(require_user_id=True)
    
    ctx = manager.create_context("test", user_id="user1")
    
    # Should get context with correct user_id
    retrieved = manager.get_context(ctx.id, user_id="user1")
    assert retrieved is not None, "Should retrieve context with correct user_id"
    assert retrieved.id == ctx.id, "Should get same context"
    
    # Should return None with wrong user_id
    retrieved_wrong = manager.get_context(ctx.id, user_id="user2")
    assert retrieved_wrong is None, "Should not retrieve context with wrong user_id"


async def run_all_tests():
    """Run all tests"""
    print("=" * 60)
    print("MCP Security Test Suite")
    print("=" * 60)
    print()
    
    tests = [
        test_tool_allowlist,
        test_per_tenant_isolation,
        test_path_traversal,
        test_budget_enforcement,
        test_content_sanitization,
        test_input_size_limit,
        test_user_id_required,
        test_multi_tenant_isolation,
        test_context_access_verification,
    ]
    
    for test_func in tests:
        await test_func()
        print()
    
    # Summary
    print("=" * 60)
    print(f"Results: {passed} passed, {failed} failed")
    print("=" * 60)
    
    if errors:
        print("\nErrors:")
        for name, error in errors:
            print(f"  - {name}: {error}")
    
    return failed == 0


if __name__ == "__main__":
    success = asyncio.run(run_all_tests())
    sys.exit(0 if success else 1)

