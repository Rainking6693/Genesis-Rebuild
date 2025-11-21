# Agent MCP Integration Guide

**Date:** December 2024  
**Status:** ✅ READY

## Overview

This guide shows how to integrate secure MCP patterns into Genesis agents.

---

## Quick Start

### 1. Import Secure MCP Helper

```python
from infrastructure.secure_mcp_helper import SecureMCPHelper, get_secure_mcp_helper
```

### 2. Initialize in Agent __init__

```python
class MyAgent:
    def __init__(self, business_id: str = "default", user_id: Optional[str] = None):
        self.business_id = business_id
        self.user_id = user_id or f"user_{business_id}"
        self.agent_name = "my_agent"
        
        # Initialize secure MCP helper
        self.enable_mcp = True
        self.mcp_helper = None
        try:
            from infrastructure.secure_mcp_helper import SecureMCPHelper
            self._mcp_helper_class = SecureMCPHelper
        except ImportError:
            logger.warning("SecureMCPHelper not available")
            self.enable_mcp = False
            self._mcp_helper_class = None
```

### 3. Initialize in Agent initialize() Method

```python
async def initialize(self):
    # ... existing initialization code ...
    
    # Initialize secure MCP helper
    if self.enable_mcp and self._mcp_helper_class:
        try:
            self.mcp_helper = self._mcp_helper_class(
                user_id=self.user_id,
                agent_name=self.agent_name,
                business_id=self.business_id,
                enable_filesystem=False,  # Set to True if needed
                filesystem_safe_root="/safe/path" if enable_filesystem else None,
            )
            logger.info("✅ Secure MCP helper initialized")
        except Exception as e:
            logger.warning(f"Secure MCP helper initialization failed: {e}")
            self.enable_mcp = False
```

### 4. Use Secure MCP Methods

```python
async def my_method(self):
    if not self.enable_mcp or not self.mcp_helper:
        # Fallback to non-MCP implementation
        return await self._fallback_method()
    
    try:
        # Read file securely
        result = await self.mcp_helper.read_file("README.md")
        
        # Create GitHub issue securely
        issue = await self.mcp_helper.create_github_issue(
            repo="owner/repo",
            title="Bug fix",
            body="Description"
        )
        
        # Create GitHub repo securely
        repo = await self.mcp_helper.create_github_repo(
            name="my-repo",
            description="My repository",
            private=False
        )
        
        return result
    except Exception as e:
        logger.error(f"MCP operation failed: {e}")
        # Fallback to non-MCP implementation
        return await self._fallback_method()
```

---

## Agent-Specific Tool Allowlists

The `SecureMCPHelper` includes pre-configured tool allowlists for common agent types:

- **deploy_agent**: `read_file`, `write_file`, `list_directory`, `create_repo`, `create_issue`, `create_pr`
- **marketing_agent**: `send_message`, `create_issue`
- **research_discovery_agent**: `read_file`, `query`, `insert`
- **analyst_agent**: `read_file`, `query`, `analyze_data`
- **builder_agent**: `read_file`, `write_file`, `list_directory`, `create_repo`, `create_issue`
- **default**: `read_file` (minimal safe set)

### Custom Allowlist

```python
self.mcp_helper = SecureMCPHelper(
    user_id=self.user_id,
    agent_name="custom_agent",
    tool_allowlist={"read_file", "write_file", "custom_tool"},  # Custom allowlist
)
```

---

## Available Secure Methods

### File Operations

```python
# Read file (path validated and normalized)
result = await mcp_helper.read_file("path/to/file.txt")

# Write file (requires enable_filesystem=True)
result = await mcp_helper.write_file("path/to/file.txt", "content")

# List directory
result = await mcp_helper.list_directory("path/to/dir")
```

### GitHub Operations

```python
# Create repository (validated and sanitized)
repo = await mcp_helper.create_github_repo(
    name="my-repo",
    description="Description",
    private=False
)

# Create issue (validated and sanitized)
issue = await mcp_helper.create_github_issue(
    repo="owner/repo",
    title="Issue title",
    body="Issue body",
    labels=["bug", "urgent"]
)
```

### Email Operations

```python
# Send email (validated and sanitized)
result = await mcp_helper.send_email(
    to="user@example.com",
    subject="Email subject",
    body="Email body",
    from_email="sender@example.com"
)
```

### Database Operations

```python
# Execute query
result = await mcp_helper.execute_query("SELECT * FROM users")
```

---

## Error Handling

All MCP methods raise exceptions that should be caught:

```python
from infrastructure.mcp_client import (
    MCPAccessDeniedError,
    MCPRateLimitError,
    MCPBudgetExceededError,
    MCPTimeoutError,
    MCPError
)

try:
    result = await self.mcp_helper.read_file("file.txt")
except MCPAccessDeniedError:
    logger.error("Access denied - tool not in allowlist")
    # Fallback logic
except MCPRateLimitError:
    logger.warning("Rate limit exceeded - retry later")
    # Retry logic
except MCPBudgetExceededError:
    logger.error("Budget exceeded")
    # Budget management
except MCPTimeoutError:
    logger.error("Operation timed out")
    # Timeout handling
except MCPError as e:
    logger.error(f"MCP error: {e}")
    # General error handling
```

---

## Example: Deploy Agent Integration

See `agents/deploy_agent.py` for a complete example:

```python
class DeployAgent:
    def __init__(self, business_id: str = "default", user_id: Optional[str] = None):
        self.business_id = business_id
        self.user_id = user_id or f"user_{business_id}"
        # ... MCP initialization ...
    
    async def initialize(self):
        # ... existing initialization ...
        # Initialize secure MCP helper
        if self.enable_mcp and self._mcp_helper_class:
            self.mcp_helper = self._mcp_helper_class(
                user_id=self.user_id,
                agent_name="deploy_agent",
                business_id=self.business_id,
                enable_filesystem=True,
                filesystem_safe_root=os.getcwd(),
            )
    
    async def create_github_repo_secure(self, repo_name: str, ...):
        """Securely create GitHub repo using MCP"""
        if not self.enable_mcp or not self.mcp_helper:
            raise Exception("Secure MCP not enabled")
        return await self.mcp_helper.create_github_repo(...)
```

---

## Security Best Practices

1. **Always provide user_id**: Required for multi-tenant isolation
2. **Use agent_name**: Helps with access control and audit logging
3. **Set tool allowlists**: Restrict access to only needed tools
4. **Enable filesystem only when needed**: Disabled by default for security
5. **Set filesystem_safe_root**: Required if filesystem is enabled
6. **Handle errors gracefully**: Always have fallback logic
7. **Log security events**: All MCP operations are automatically audited

---

## Migration Checklist

- [ ] Add `user_id` parameter to agent `__init__`
- [ ] Import `SecureMCPHelper` in agent file
- [ ] Initialize MCP helper in `__init__` (set `_mcp_helper_class`)
- [ ] Initialize MCP helper instance in `initialize()` method
- [ ] Add secure MCP methods to agent class
- [ ] Update existing methods to use secure MCP when available
- [ ] Add error handling for MCP exceptions
- [ ] Add fallback logic for when MCP is disabled
- [ ] Test with secure MCP enabled
- [ ] Test with secure MCP disabled (fallback)

---

## Troubleshooting

### "Secure MCP is not enabled or initialized"

- Check that `enable_mcp=True` in `__init__`
- Check that MCP helper is initialized in `initialize()` method
- Check that `SecureMCPHelper` import succeeded

### "Access denied - tool not in allowlist"

- Check agent's tool allowlist in `SecureMCPHelper.AGENT_TOOL_ALLOWLISTS`
- Provide custom `tool_allowlist` if needed
- Verify tool name matches registered MCP tool

### "Filesystem operations disabled"

- Set `enable_filesystem=True` when creating MCP helper
- Provide `filesystem_safe_root` path
- Ensure path is absolute and within safe root

---

## Next Steps

1. Review `docs/examples/secure_mcp_agent_usage.py` for complete examples
2. Review `infrastructure/secure_mcp_helper.py` for API reference
3. Update your agents following this guide
4. Test with security monitoring enabled
5. Review audit logs regularly

---

**Status:** ✅ PRODUCTION READY

