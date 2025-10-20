# A2A Security Fixes - Quick Action Checklist

**Engineer:** Alex (or assigned developer)
**Reviewer:** Hudson
**Due Date:** October 20, 2025 (P0 fixes for staging)

**Reference:** See full details in `docs/AUDIT_A2A_HUDSON.md`

---

## P0 CRITICAL FIXES (MUST FIX BEFORE STAGING - 5-6 hours)

### ✅ Fix 1: Add API Key Authentication (1 hour)

**File:** `infrastructure/a2a_connector.py`

**Changes:**
```python
# In __init__ method (line 170)
def __init__(
    self,
    base_url: str = "http://127.0.0.1:8080",
    timeout_seconds: float = 30.0,
    circuit_breaker: Optional[CircuitBreaker] = None,
    api_key: Optional[str] = None  # ADD THIS
):
    self.base_url = base_url.rstrip('/')
    self.timeout = aiohttp.ClientTimeout(total=timeout_seconds)

    # ADD THIS: API key authentication
    self.api_key = api_key or os.getenv("A2A_API_KEY")
    if not self.api_key:
        logger.warning("A2A_API_KEY not set - authentication disabled")

    # ... rest of init

# In invoke_agent_tool method (line 467)
async def invoke_agent_tool(...):
    url = f"{self.base_url}/a2a/invoke"
    payload = {"tool": ..., "arguments": ...}

    # ADD THIS: Authentication headers
    headers = {}
    if self.api_key:
        headers["Authorization"] = f"Bearer {self.api_key}"
        headers["X-Client-ID"] = "genesis-orchestrator"

    async with aiohttp.ClientSession(timeout=self.timeout) as session:
        async with session.post(url, json=payload, headers=headers) as response:
            # ... rest of method
```

**Test:**
```bash
# Add to tests/test_a2a_security.py
def test_authentication_headers():
    connector = A2AConnector(api_key="test-key-123")
    # Verify headers are added to requests
```

---

### ✅ Fix 2: Sanitize Tool Names (1 hour)

**File:** `infrastructure/a2a_connector.py`

**Changes:**
```python
# Add import at top
from infrastructure.security_utils import sanitize_agent_name
import re

# Add new method after _map_task_to_tool (around line 557)
def _sanitize_tool_name(self, tool_name: str) -> str:
    """Sanitize tool name to prevent injection"""
    # Remove path separators and special chars
    sanitized = re.sub(r'[/\\.]', '', tool_name)

    # Whitelist: alphanumeric, underscores only
    sanitized = re.sub(r'[^a-zA-Z0-9_]', '', sanitized)

    # Limit length
    sanitized = sanitized[:64]

    # Validate against whitelist
    ALLOWED_TOOLS = set(TASK_TYPE_TO_TOOL_MAPPING.values())
    if sanitized not in ALLOWED_TOOLS:
        logger.warning(f"Tool name '{tool_name}' not in whitelist, using fallback")
        return "generate_backend"

    return sanitized

# Modify _map_task_to_tool method (line 529)
def _map_task_to_tool(self, task: Task) -> str:
    # Check explicit tool hint in metadata
    if "a2a_tool" in task.metadata:
        tool_name = task.metadata["a2a_tool"]
        return self._sanitize_tool_name(tool_name)  # ADD THIS LINE

    # ... rest of method
```

**Test:**
```bash
# Add to tests/test_a2a_security.py
def test_tool_name_injection_prevention():
    connector = A2AConnector()
    task = Task(
        task_id="evil",
        task_type="generic",
        metadata={"a2a_tool": "../../admin/delete_all"}
    )
    tool_name = connector._map_task_to_tool(task)
    assert tool_name == "generate_backend"
    assert ".." not in tool_name
```

---

### ✅ Fix 3: Sanitize Agent Names (1 hour)

**File:** `infrastructure/a2a_connector.py`

**Changes:**
```python
# Add import at top (if not already added)
from infrastructure.security_utils import sanitize_agent_name

# Modify _map_agent_name method (line 505)
def _map_agent_name(self, halo_agent_name: str) -> str:
    """Map HALO agent name to A2A agent name"""
    # SANITIZE INPUT FIRST
    sanitized_halo_name = sanitize_agent_name(halo_agent_name)  # ADD THIS

    a2a_agent = HALO_TO_A2A_MAPPING.get(sanitized_halo_name)  # USE SANITIZED

    if not a2a_agent:
        if sanitized_halo_name.endswith("_agent"):  # USE SANITIZED
            a2a_agent = sanitized_halo_name[:-6]  # USE SANITIZED
        else:
            raise ValueError(f"Unknown HALO agent: {halo_agent_name}")

    # VALIDATE OUTPUT
    ALLOWED_AGENTS = {
        "spec", "builder", "qa", "security", "deploy",
        "maintenance", "marketing", "support", "analyst", "billing"
    }

    if a2a_agent not in ALLOWED_AGENTS:
        raise SecurityError(f"Invalid A2A agent: {a2a_agent}")

    return a2a_agent
```

**Test:**
```bash
# Add to tests/test_a2a_security.py
def test_agent_name_injection_prevention():
    connector = A2AConnector()
    malicious_name = "../../../etc/passwd_agent"

    with pytest.raises(Exception):  # Should raise SecurityError
        connector._map_agent_name(malicious_name)
```

---

### ✅ Fix 4: Redact Credentials in OTEL Traces (1 hour)

**File:** `infrastructure/a2a_connector.py`

**Changes:**
```python
# Add import at top (if not already added)
from infrastructure.security_utils import redact_credentials

# Modify invoke_agent_tool method (line 431)
async def invoke_agent_tool(
    self,
    agent_name: str,
    tool_name: str,
    arguments: Dict[str, Any]
) -> Any:
    """Call A2A service endpoint to invoke agent tool"""

    # Check circuit breaker
    if not self.circuit_breaker.can_attempt():
        raise Exception("Circuit breaker OPEN: A2A service unavailable")

    url = f"{self.base_url}/a2a/invoke"
    payload = {
        "tool": f"{agent_name}.{tool_name}",
        "arguments": arguments
    }

    # REDACT CREDENTIALS FOR LOGGING (ADD THIS SECTION)
    safe_arguments_for_logging = {}
    for key, value in arguments.items():
        if isinstance(value, str):
            safe_arguments_for_logging[key] = redact_credentials(value)
        elif isinstance(value, dict):
            safe_arguments_for_logging[key] = {
                k: redact_credentials(str(v)) if isinstance(v, str) else v
                for k, v in value.items()
            }
        else:
            safe_arguments_for_logging[key] = value

    # Log with redacted arguments
    logger.info(
        f"Invoking A2A: {agent_name}.{tool_name}",
        extra={
            "agent": agent_name,
            "tool": tool_name,
            "argument_count": len(arguments),
            "argument_keys": list(arguments.keys())[:5]  # First 5 keys only
            # DO NOT LOG: "arguments": arguments  # Contains credentials!
        }
    )

    # ... rest of method (use original 'arguments' for actual request)
```

**Test:**
```bash
# Add to tests/test_a2a_security.py
def test_otel_no_credential_leakage():
    """Test that OTEL traces don't contain credentials"""
    connector = A2AConnector()

    # Mock logging to capture log output
    with patch('infrastructure.a2a_connector.logger') as mock_logger:
        arguments = {
            "api_key": "sk-1234567890abcdef",
            "description": "Test task"
        }

        await connector.invoke_agent_tool("marketing", "create_strategy", arguments)

        # Check that logged data doesn't contain credential
        for call in mock_logger.info.call_args_list:
            log_message = str(call)
            assert "sk-1234567890" not in log_message
```

---

### ✅ Fix 5: Change Default to HTTPS (0.5 hours)

**File:** `infrastructure/a2a_connector.py`

**Changes:**
```python
# Modify __init__ method (line 170)
def __init__(
    self,
    base_url: str = "https://127.0.0.1:8443",  # CHANGE FROM http to https
    timeout_seconds: float = 30.0,
    circuit_breaker: Optional[CircuitBreaker] = None,
    api_key: Optional[str] = None,
    verify_ssl: bool = True  # ADD THIS
):
    # ADD THIS: Validate HTTPS in production
    if os.getenv("ENVIRONMENT") == "production" and not base_url.startswith("https://"):
        raise ValueError("HTTPS required in production environment")
    elif not base_url.startswith("https://"):
        logger.warning(
            f"Using HTTP in {os.getenv('ENVIRONMENT', 'development')} environment - "
            f"this is insecure!"
        )

    self.base_url = base_url.rstrip('/')
    self.verify_ssl = verify_ssl
    self.timeout = aiohttp.ClientTimeout(total=timeout_seconds)

    # ... rest of init
```

**Config Update:**
```bash
# Update genesis_orchestrator.py (line 68)
if is_feature_enabled('a2a_integration_enabled'):
    self.a2a_connector = A2AConnector(
        base_url=os.getenv("A2A_BASE_URL", "https://127.0.0.1:8443"),  # CHANGE THIS
        api_key=os.getenv("A2A_API_KEY")  # ADD THIS
    )
```

---

### ✅ Fix 6: Sanitize Task Arguments (0.5 hours)

**File:** `infrastructure/a2a_connector.py`

**Changes:**
```python
# Add imports at top (if not already added)
from infrastructure.security_utils import sanitize_for_prompt, redact_credentials
import json

# Modify _prepare_arguments method (line 558)
def _prepare_arguments(
    self,
    task: Task,
    dependency_results: Dict[str, Any]
) -> Dict[str, Any]:
    """Prepare tool arguments from task and dependency results"""
    arguments = {}

    # Sanitize and add dependency results
    if dependency_results:
        sanitized_deps = {}
        for dep_id, result in dependency_results.items():
            if isinstance(result, dict):
                sanitized_result = {
                    k: redact_credentials(str(v)) if isinstance(v, str) else v
                    for k, v in result.items()
                }
                sanitized_deps[dep_id] = sanitized_result
            else:
                sanitized_deps[dep_id] = redact_credentials(str(result))

        arguments["dependency_results"] = sanitized_deps

    # Sanitize task metadata
    if task.metadata:
        sanitized_metadata = {}
        for key, value in task.metadata.items():
            # Sanitize keys (prevent injection)
            safe_key = re.sub(r'[^a-zA-Z0-9_]', '', key)[:64]

            # Sanitize values
            if isinstance(value, str):
                safe_value = sanitize_for_prompt(value, max_length=500)
            else:
                safe_value = value

            sanitized_metadata[safe_key] = safe_value

        arguments["context"] = sanitized_metadata

    # Sanitize task description (prevent prompt injection)
    safe_description = sanitize_for_prompt(task.description, max_length=1000)
    arguments["description"] = safe_description

    # Add task_id for tracing
    arguments["task_id"] = task.task_id

    # Validate total payload size (prevent DoS)
    payload_json = json.dumps(arguments)
    if len(payload_json) > 100_000:  # 100KB limit
        raise ValueError(f"Argument payload too large: {len(payload_json)} bytes")

    return arguments
```

---

## P1 HIGH FIXES (MUST FIX BEFORE PRODUCTION - 8-10 hours)

### ⏳ Fix 7: Integrate with AgentAuthRegistry (2 hours)

**File:** `infrastructure/a2a_connector.py`

**Changes:**
```python
# Add import
from infrastructure.agent_auth_registry import AgentAuthRegistry, SecurityError

# Modify __init__ method
def __init__(
    self,
    base_url: str = "https://127.0.0.1:8443",
    timeout_seconds: float = 30.0,
    circuit_breaker: Optional[CircuitBreaker] = None,
    api_key: Optional[str] = None,
    verify_ssl: bool = True,
    auth_registry: Optional[AgentAuthRegistry] = None  # ADD THIS
):
    # ... existing init code ...

    # ADD THIS: Agent authentication
    self.auth_registry = auth_registry
    if self.auth_registry:
        # Register orchestrator as agent
        self.orchestrator_id, self.orchestrator_token = auth_registry.register_agent(
            agent_name="genesis_orchestrator",
            permissions=["invoke:*", "read:*"]
        )
        logger.info(f"Orchestrator registered with auth registry: {self.orchestrator_id[:8]}...")

# Modify _execute_single_task method (line 360)
async def _execute_single_task(self, task, agent_name, dependency_results, correlation_context):
    # ADD THIS: Authorization check
    if self.auth_registry:
        # Check if agent is registered
        if not self.auth_registry.is_registered(agent_name):
            raise SecurityError(f"Agent '{agent_name}' not registered in auth registry")

        # Check if orchestrator has permission
        permission = f"invoke:{agent_name}"
        if not self.auth_registry.has_permission(self.orchestrator_token, permission):
            raise SecurityError(
                f"Orchestrator not authorized to invoke '{agent_name}' "
                f"(missing permission: {permission})"
            )

    # ... rest of method
```

**Update genesis_orchestrator.py:**
```python
# In __init__ method (line 49)
if self.use_v2:
    logger.info("Genesis Orchestrator v2.0 initialized")
    self.router = get_daao_router()

    # Initialize orchestration components
    self.htdag = HTDAGPlanner()
    self.halo = HALORouter()
    self.aop = AOPValidator()

    # ADD THIS: Agent auth registry
    from infrastructure.agent_auth_registry import AgentAuthRegistry
    self.auth_registry = AgentAuthRegistry()

    # Register all HALO agents
    for agent_name in HALO_TO_A2A_MAPPING.keys():
        self.auth_registry.register_agent(
            agent_name=agent_name,
            permissions=["execute:tasks"]
        )

    # Initialize A2A connector (if feature enabled)
    if is_feature_enabled('a2a_integration_enabled'):
        self.a2a_connector = A2AConnector(
            base_url=os.getenv("A2A_BASE_URL", "https://127.0.0.1:8443"),
            api_key=os.getenv("A2A_API_KEY"),
            auth_registry=self.auth_registry  # PASS THIS
        )
```

---

### ⏳ Fix 8: Add JSON Schema Validation (1 hour)

**File:** `infrastructure/a2a_connector.py`

**Changes:**
```python
# Add import at top
from pydantic import BaseModel, ValidationError, Field
from typing import Any, Optional

# ADD THIS: Response schema (after imports)
class A2AResponse(BaseModel):
    """A2A service response schema"""
    result: Any
    status: str = Field(default="success", pattern="^(success|failed|partial)$")
    error: Optional[str] = None
    execution_time_ms: Optional[float] = None

# Modify invoke_agent_tool method (line 469)
async def invoke_agent_tool(...):
    # ... HTTP request code ...

    if response.status == 200:
        data = await response.json()

        # ADD THIS: Validate response schema
        try:
            validated_response = A2AResponse(**data)
            result = validated_response.result
        except ValidationError as e:
            raise ValueError(f"Invalid A2A response schema: {e}")

        # Record success
        self.circuit_breaker.record_success()

        return result
```

---

### ⏳ Fix 9: Implement Rate Limiting (2 hours)

**File:** `infrastructure/a2a_connector.py`

**Changes:**
```python
# Add import at top
from collections import defaultdict
from datetime import datetime, timedelta

# Add to class definition (after line 169)
class A2AConnector:
    # Rate limiting constants
    MAX_REQUESTS_PER_MINUTE = 100
    MAX_REQUESTS_PER_AGENT_PER_MINUTE = 20

    def __init__(self, ...):
        # ... existing init code ...

        # ADD THIS: Rate limiting state
        self.request_timestamps: List[datetime] = []
        self.agent_request_timestamps: Dict[str, List[datetime]] = defaultdict(list)

    # ADD THIS: Rate limiting methods
    def _check_rate_limit(self, agent_name: str) -> bool:
        """Check if request is within rate limits"""
        now = datetime.now()
        one_minute_ago = now - timedelta(minutes=1)

        # Global rate limit
        self.request_timestamps = [
            ts for ts in self.request_timestamps if ts > one_minute_ago
        ]
        if len(self.request_timestamps) >= self.MAX_REQUESTS_PER_MINUTE:
            logger.warning(f"Global rate limit exceeded: {len(self.request_timestamps)}/min")
            return False

        # Per-agent rate limit
        self.agent_request_timestamps[agent_name] = [
            ts for ts in self.agent_request_timestamps[agent_name]
            if ts > one_minute_ago
        ]
        if len(self.agent_request_timestamps[agent_name]) >= self.MAX_REQUESTS_PER_AGENT_PER_MINUTE:
            logger.warning(
                f"Agent rate limit exceeded for '{agent_name}': "
                f"{len(self.agent_request_timestamps[agent_name])}/min"
            )
            return False

        return True

    def _record_request(self, agent_name: str):
        """Record request for rate limiting"""
        now = datetime.now()
        self.request_timestamps.append(now)
        self.agent_request_timestamps[agent_name].append(now)

# Modify invoke_agent_tool method (line 431)
async def invoke_agent_tool(self, agent_name, tool_name, arguments):
    # ADD THIS: Rate limiting check (BEFORE circuit breaker)
    if not self._check_rate_limit(agent_name):
        raise Exception(
            f"Rate limit exceeded for agent '{agent_name}' "
            f"(max {self.MAX_REQUESTS_PER_AGENT_PER_MINUTE} requests/minute)"
        )

    # Check circuit breaker
    if not self.circuit_breaker.can_attempt():
        raise Exception("Circuit breaker OPEN: A2A service unavailable")

    # ... rest of method ...

    # ADD THIS: Record successful request (after circuit breaker success)
    if response.status == 200:
        # ... existing code ...
        self.circuit_breaker.record_success()
        self._record_request(agent_name)  # ADD THIS LINE
        return result
```

---

## TESTING CHECKLIST

### Create New Test File: `tests/test_a2a_security.py`

```python
"""
Security Tests for A2A Connector
Tests authentication, authorization, input validation, and injection prevention
"""
import pytest
from unittest.mock import Mock, patch
from infrastructure.a2a_connector import A2AConnector
from infrastructure.task_dag import Task
from infrastructure.agent_auth_registry import AgentAuthRegistry, SecurityError

# Test 1: Authentication headers
@pytest.mark.asyncio
async def test_authentication_headers():
    """Test that API key is added to request headers"""
    connector = A2AConnector(api_key="test-key-123")

    # Mock the HTTP call
    with patch('aiohttp.ClientSession.post') as mock_post:
        mock_response = Mock()
        mock_response.status = 200
        mock_response.json.return_value = {"result": "success"}
        mock_post.return_value.__aenter__.return_value = mock_response

        await connector.invoke_agent_tool("marketing", "create_strategy", {})

        # Verify Authorization header was sent
        call_args = mock_post.call_args
        headers = call_args[1].get('headers', {})
        assert "Authorization" in headers
        assert headers["Authorization"] == "Bearer test-key-123"

# Test 2: Tool name injection prevention
def test_tool_name_injection_prevention():
    """Test that malicious tool names are sanitized"""
    connector = A2AConnector()

    task = Task(
        task_id="evil",
        task_type="generic",
        description="Evil task",
        metadata={"a2a_tool": "../../admin/delete_all"}
    )

    tool_name = connector._map_task_to_tool(task)

    # Should fall back to safe default
    assert tool_name == "generate_backend"
    assert ".." not in tool_name
    assert "/" not in tool_name

# Test 3: Agent name injection prevention
def test_agent_name_injection_prevention():
    """Test that malicious agent names are rejected"""
    connector = A2AConnector()

    malicious_name = "../../../etc/passwd_agent"

    # Should raise error (not in whitelist)
    with pytest.raises((ValueError, SecurityError)):
        connector._map_agent_name(malicious_name)

# Test 4: Credential redaction in logs
@pytest.mark.asyncio
async def test_otel_no_credential_leakage():
    """Test that credentials are not logged in OTEL traces"""
    connector = A2AConnector()

    with patch('infrastructure.a2a_connector.logger') as mock_logger:
        with patch.object(connector, 'invoke_agent_tool') as mock_invoke:
            mock_invoke.return_value = {"result": "success"}

            arguments = {
                "api_key": "sk-1234567890abcdef",
                "password": "super_secret_pass",
                "description": "Test task"
            }

            await connector.invoke_agent_tool("marketing", "create_strategy", arguments)

            # Check all log calls
            for call in mock_logger.info.call_args_list:
                log_message = str(call)
                assert "sk-1234567890" not in log_message
                assert "super_secret_pass" not in log_message

# Test 5: Rate limiting
@pytest.mark.asyncio
async def test_rate_limiting():
    """Test that rate limits are enforced"""
    connector = A2AConnector()

    # Simulate 100 requests (global limit)
    from datetime import datetime
    now = datetime.now()
    connector.request_timestamps = [now] * 100

    # 101st request should be blocked
    assert not connector._check_rate_limit("marketing")

    # Reset and test per-agent limit
    connector.request_timestamps = []
    connector.agent_request_timestamps["marketing"] = [now] * 20

    # 21st request to same agent should be blocked
    assert not connector._check_rate_limit("marketing")

# Test 6: HTTPS enforcement in production
def test_https_enforcement_in_production():
    """Test that HTTP is rejected in production"""
    import os
    os.environ["ENVIRONMENT"] = "production"

    with pytest.raises(ValueError, match="HTTPS required"):
        connector = A2AConnector(base_url="http://127.0.0.1:8080")

    # HTTPS should work
    connector = A2AConnector(base_url="https://127.0.0.1:8443")
    assert connector.base_url.startswith("https://")

    # Cleanup
    del os.environ["ENVIRONMENT"]

# Test 7: Authorization checks
@pytest.mark.asyncio
async def test_authorization_checks():
    """Test that orchestrator authorization is enforced"""
    auth_registry = AgentAuthRegistry()

    # Register agent without permissions
    agent_id, token = auth_registry.register_agent(
        agent_name="restricted_agent",
        permissions=["read:only"]  # No invoke permission
    )

    connector = A2AConnector(auth_registry=auth_registry)

    # Should raise SecurityError (no invoke permission)
    with pytest.raises(SecurityError, match="not authorized"):
        await connector._execute_single_task(
            task=Mock(task_id="test", description="test"),
            agent_name="restricted_agent",
            dependency_results={},
            correlation_context=Mock()
        )

# Test 8: Payload size limits
def test_payload_size_limits():
    """Test that oversized payloads are rejected"""
    connector = A2AConnector()

    # Create task with huge metadata
    task = Task(
        task_id="huge",
        task_type="generic",
        description="x" * 1_000_000,  # 1MB description
        metadata={"huge_field": "y" * 1_000_000}
    )

    # Should raise ValueError (payload too large)
    with pytest.raises(ValueError, match="Argument payload too large"):
        connector._prepare_arguments(task, {})

# Run all tests
if __name__ == "__main__":
    pytest.main([__file__, "-v"])
```

---

## VERIFICATION SCRIPT

```bash
#!/bin/bash
# verify_security_fixes.sh

echo "=== A2A Security Fixes Verification ==="
echo ""

echo "1. Running security tests..."
python -m pytest tests/test_a2a_security.py -v

echo ""
echo "2. Checking for security imports..."
grep -n "from infrastructure.security_utils import" infrastructure/a2a_connector.py

echo ""
echo "3. Checking for authentication..."
grep -n "Authorization" infrastructure/a2a_connector.py

echo ""
echo "4. Checking for HTTPS default..."
grep -n "https://" infrastructure/a2a_connector.py

echo ""
echo "5. Checking for rate limiting..."
grep -n "check_rate_limit" infrastructure/a2a_connector.py

echo ""
echo "6. Checking for credential redaction..."
grep -n "redact_credentials" infrastructure/a2a_connector.py

echo ""
echo "7. Running full A2A integration tests..."
python -m pytest tests/test_a2a_integration.py -v

echo ""
echo "=== Verification Complete ==="
```

---

## COMPLETION CRITERIA

### P0 Fixes (Required for Staging):
- [ ] API key authentication implemented
- [ ] Tool name sanitization implemented
- [ ] Agent name sanitization implemented
- [ ] Credential redaction in OTEL traces
- [ ] HTTPS default + enforcement
- [ ] Task argument sanitization
- [ ] All 8 security tests passing

### P1 Fixes (Required for Production):
- [ ] AgentAuthRegistry integration
- [ ] JSON schema validation
- [ ] Rate limiting implementation
- [ ] Connection pooling
- [ ] Granular timeouts
- [ ] Security test suite (20+ tests)

### Code Review:
- [ ] Hudson review of P0 fixes (1 hour)
- [ ] Hudson review of P1 fixes (1-2 hours)
- [ ] Security scan passed (no critical vulnerabilities)

### Documentation:
- [ ] Update A2A_INTEGRATION_COMPLETE.md with security section
- [ ] Add security best practices to README
- [ ] Document authentication configuration

---

## QUICK REFERENCE

**Security Utils Available:**
- `sanitize_agent_name(name)` - Remove path traversal
- `sanitize_for_prompt(text)` - Remove prompt injection
- `redact_credentials(text)` - Redact API keys, passwords
- `validate_generated_code(code)` - Check for dangerous code
- `detect_dag_cycle(adj_list)` - Prevent infinite loops

**Import Statement:**
```python
from infrastructure.security_utils import (
    sanitize_agent_name,
    sanitize_for_prompt,
    redact_credentials,
    validate_generated_code
)
```

**AgentAuthRegistry:**
```python
from infrastructure.agent_auth_registry import AgentAuthRegistry, SecurityError

# Create registry
registry = AgentAuthRegistry()

# Register agent
agent_id, token = registry.register_agent("my_agent", permissions=["invoke:*"])

# Verify agent
is_valid = registry.verify_agent("my_agent", token)

# Check permission
has_perm = registry.has_permission(token, "invoke:marketing")
```

---

## QUESTIONS?

**Contact:**
- Security Issues: Hudson (Code Review & Security Specialist)
- Implementation Help: Alex (Full-Stack Integration Specialist)
- Deployment Issues: Thon (Deployment Automation Specialist)

**References:**
- Full Audit: `docs/AUDIT_A2A_HUDSON.md`
- Security Utils: `infrastructure/security_utils.py`
- Auth Registry: `infrastructure/agent_auth_registry.py`
- A2A Integration: `docs/A2A_INTEGRATION_COMPLETE.md`

---

**Last Updated:** October 19, 2025
**Status:** P0 fixes in progress
**Next Review:** October 20, 2025 (after P0 fixes)
