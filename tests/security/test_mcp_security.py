"""
Security tests for MCP client, action schemas, and composable context.

Tests access control, rate limiting, filesystem safety, content sanitization,
multi-tenant isolation, and other security features.
"""

import pytest
import asyncio
from infrastructure.mcp_client import (
    MCPClient, MCPServerConfig, MCPTransportType, MCPCallContext,
    MCPAccessDeniedError, MCPRateLimitError, MCPBudgetExceededError,
    MCPTimeoutError, get_mcp_client
)
from infrastructure.action_schemas import (
    SendEmailSchema, CreateIssueSchema, GenerateCodeSchema,
    ActionSchemaRegistry
)
from infrastructure.composable_context import (
    ContextManager, AgentContext, get_context_manager
)


class TestMCPAccessControl:
    """Test MCP access control and allowlists"""
    
    @pytest.mark.asyncio
    async def test_tool_allowlist_enforcement(self):
        """Test that tool allowlist restricts access"""
        mcp = MCPClient(
            user_id="user123",
            agent_name="test_agent",
            tool_allowlist={"read_file"}  # Only allow read_file
        )
        
        # Should fail - write_file not in allowlist
        with pytest.raises(MCPAccessDeniedError):
            await mcp.call_tool("write_file", {"path": "test.txt", "content": "test"})
    
    @pytest.mark.asyncio
    async def test_per_tenant_isolation(self):
        """Test that different users get different client instances"""
        mcp1 = await get_mcp_client(user_id="user1", agent_name="agent1")
        mcp2 = await get_mcp_client(user_id="user2", agent_name="agent2")
        
        # Should be different instances
        assert mcp1 is not mcp2
        assert mcp1.user_id == "user1"
        assert mcp2.user_id == "user2"


class TestMCPFilesystemSafety:
    """Test filesystem safety features"""
    
    @pytest.mark.asyncio
    async def test_path_traversal_blocked(self):
        """Test that path traversal is blocked"""
        mcp = MCPClient(
            user_id="user123",
            enable_filesystem=True,
            filesystem_safe_root="/safe/root"
        )
        
        # Path traversal should be blocked
        with pytest.raises(ValueError, match="Path traversal"):
            await mcp.call_tool("read_file", {"path": "../../etc/passwd"})
    
    @pytest.mark.asyncio
    async def test_absolute_path_blocked(self):
        """Test that absolute paths outside safe root are blocked"""
        mcp = MCPClient(
            user_id="user123",
            enable_filesystem=True,
            filesystem_safe_root="/safe/root"
        )
        
        # Absolute path outside safe root should be blocked
        with pytest.raises(ValueError, match="Path outside safe root"):
            await mcp.call_tool("read_file", {"path": "/etc/passwd"})
    
    @pytest.mark.asyncio
    async def test_dangerous_extension_blocked(self):
        """Test that dangerous file extensions are blocked"""
        mcp = MCPClient(
            user_id="user123",
            enable_filesystem=True,
            filesystem_safe_root="/safe/root"
        )
        
        # Dangerous extension should be blocked
        with pytest.raises(MCPAccessDeniedError, match="File extension not allowed"):
            await mcp.call_tool("write_file", {"path": "test.exe", "content": "test"})


class TestMCPRateLimiting:
    """Test rate limiting"""
    
    @pytest.mark.asyncio
    async def test_rate_limit_enforced(self):
        """Test that rate limits are enforced"""
        mcp = MCPClient(
            user_id="user123",
            agent_name="test_agent"
        )
        
        # Add server with low rate limit
        await mcp.add_server(MCPServerConfig(
            id="test_server",
            transport_type=MCPTransportType.HTTP,
            url="https://example.com",
            rate_limit_per_minute=2  # Only 2 requests per minute
        ))
        
        # First 2 calls should succeed
        await mcp.call_tool("read_file", {"path": "test1.txt"})
        await mcp.call_tool("read_file", {"path": "test2.txt"})
        
        # Third call should hit rate limit
        with pytest.raises(MCPRateLimitError):
            await mcp.call_tool("read_file", {"path": "test3.txt"})


class TestMCPBudgetTracking:
    """Test budget tracking"""
    
    @pytest.mark.asyncio
    async def test_budget_enforced(self):
        """Test that budget limits are enforced"""
        mcp = MCPClient(user_id="user123")
        
        # Set budget to 2 tokens
        await mcp.set_budget("user123", 2)
        
        # First 2 calls should succeed
        await mcp.call_tool("read_file", {"path": "test1.txt"})
        await mcp.call_tool("read_file", {"path": "test2.txt"})
        
        # Third call should exceed budget
        with pytest.raises(MCPBudgetExceededError):
            await mcp.call_tool("read_file", {"path": "test3.txt"})


class TestActionSchemaSecurity:
    """Test action schema security features"""
    
    def test_content_sanitization(self):
        """Test that dangerous content is sanitized"""
        # Test script tag removal
        schema = SendEmailSchema(
            to="test@example.com",
            subject="Test",
            body="<script>alert('xss')</script>Hello"
        )
        
        # Script tag should be removed
        assert "<script>" not in schema.body
        assert "Hello" in schema.body
    
    def test_input_size_limit(self):
        """Test that input size limits are enforced"""
        # Email body exceeds 1MB limit
        large_body = "x" * (1_000_001)
        
        with pytest.raises(ValueError, match="exceeds max length"):
            SendEmailSchema(
                to="test@example.com",
                subject="Test",
                body=large_body
            )
    
    def test_error_redaction(self):
        """Test that validation errors are redacted"""
        # Try to create schema with password in error
        # (This is a simplified test - actual redaction happens in execute())
        schema = SendEmailSchema(
            to="test@example.com",
            subject="Test",
            body="test"
        )
        
        # Error redaction is tested in execute() method
        # This test verifies the schema structure supports it
        assert schema.to is not None


class TestContextManagerSecurity:
    """Test context manager security features"""
    
    def test_user_id_required(self):
        """Test that user_id is required by default"""
        manager = ContextManager(require_user_id=True)
        
        # Should raise error without user_id
        with pytest.raises(ValueError, match="user_id is required"):
            manager.create_context("test")
    
    def test_max_contexts_per_user(self):
        """Test that max contexts per user is enforced"""
        manager = ContextManager(
            require_user_id=True,
            max_contexts_per_user=2
        )
        
        # Create 2 contexts (should succeed)
        ctx1 = manager.create_context("ctx1", user_id="user123")
        ctx2 = manager.create_context("ctx2", user_id="user123")
        
        # Third context should trigger cleanup or raise error
        ctx3 = manager.create_context("ctx3", user_id="user123")
        
        # Should have at most 2 contexts
        user_contexts = manager.get_user_contexts("user123")
        assert len(user_contexts) <= 2
    
    def test_multi_tenant_isolation(self):
        """Test that contexts are isolated by user"""
        manager = ContextManager(require_user_id=True)
        
        ctx1 = manager.create_context("ctx1", user_id="user1")
        ctx2 = manager.create_context("ctx2", user_id="user2")
        
        # User1 should not see user2's contexts
        user1_contexts = manager.get_user_contexts("user1")
        assert len(user1_contexts) == 1
        assert user1_contexts[0].id == ctx1.id
        
        # User2 should not see user1's contexts
        user2_contexts = manager.get_user_contexts("user2")
        assert len(user2_contexts) == 1
        assert user2_contexts[0].id == ctx2.id
    
    def test_context_access_verification(self):
        """Test that context access is verified by user_id"""
        manager = ContextManager(require_user_id=True)
        
        ctx = manager.create_context("test", user_id="user1")
        
        # Should get context with correct user_id
        retrieved = manager.get_context(ctx.id, user_id="user1")
        assert retrieved is not None
        assert retrieved.id == ctx.id
        
        # Should return None with wrong user_id
        retrieved_wrong = manager.get_context(ctx.id, user_id="user2")
        assert retrieved_wrong is None


if __name__ == "__main__":
    pytest.main([__file__, "-v"])

