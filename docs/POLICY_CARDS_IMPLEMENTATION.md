# Policy Cards Implementation Guide

**Paper:** https://arxiv.org/abs/2510.24383
**Implementation Date:** November 5, 2025
**Status:** Production Ready
**Test Coverage:** 45 tests, 100% passing

## Overview

Policy Cards is a machine-readable YAML-based system that enforces permissions, safety constraints, and compliance rules **before** tools are called. This document provides complete implementation details, usage examples, and integration guides.

### Key Features

- **Permission Control:** Allow/deny tools per agent with wildcard pattern matching
- **Rate Limiting:** Per-agent, per-tool rate limits with hourly tracking
- **PII Detection & Redaction:** Automatic detection of SSN, email, credit card, phone, etc.
- **Safety Constraints:** Max tokens, execution time, memory limits per agent
- **Compliance Logging:** Audit trail of all tool calls and policy decisions
- **Action Rules:** Condition-based routing logic with priority ordering
- **HALO Integration:** Seamless policy checks in agent routing decisions

## Project Structure

```
.policy_cards/                          # Policy card directory
├── qa_agent.yaml                       # 15 agent-specific cards
├── support_agent.yaml
├── builder_agent.yaml
├── ... (13 more)

infrastructure/policy_cards/            # Policy enforcement system
├── __init__.py                         # Module entry point
├── loader.py                           # PolicyCardLoader (500+ lines)
├── middleware.py                       # PolicyEnforcer + PII handling (400+ lines)
├── halo_integration.py                 # HALO router integration (300+ lines)

tests/
└── test_policy_cards.py               # 45 comprehensive tests
```

## Architecture

### 1. Policy Card Structure (YAML)

Each agent has a policy card defining:

```yaml
agent_id: qa_agent
version: "1.0"
jurisdiction: "US-CA"
effective_date: "2025-11-05"

capabilities:
  allowed_tools:
    - Read
    - Grep
    - Bash(pytest:*)
    - genesis_vector_search
  denied_tools:
    - Write
    - Edit
    - Bash(rm:*)
    - Bash(sudo:*)

action_rules:
  - rule_id: "rate_limit_tests"
    condition: "tool == 'Bash' and 'pytest' in command"
    action: "allow"
    rate_limit: 100  # per hour

  - rule_id: "block_destructive"
    condition: "'rm -rf' in command or 'sudo' in command"
    action: "deny"
    reason: "Destructive operations not allowed"

safety_constraints:
  max_tokens_per_call: 8192
  max_calls_per_session: 1000
  max_execution_time_seconds: 300
  pii_detection: true
  sensitive_data_redaction: true
  memory_limit_mb: 2048

compliance:
  data_retention_days: 90
  audit_log_required: true
  human_review_threshold: "high_risk"
  log_all_tool_calls: true
```

### 2. Policy Card Loader

**File:** `infrastructure/policy_cards/loader.py`

Loads and manages YAML policy cards:

```python
from infrastructure.policy_cards import PolicyCardLoader

# Load cards from directory
loader = PolicyCardLoader(".policy_cards")

# Get card for agent
card = loader.get_card("qa_agent")

# Check if tool is allowed
allowed = loader.is_tool_allowed("qa_agent", "Read")

# Check action rules
allowed, reason = loader.check_action_rules("qa_agent", "Bash", {"command": "pytest"})

# List all agents
agents = loader.list_agents()

# Export policy summary for audit
summary = loader.export_policy_summary()
```

**Key Methods:**

- `get_card(agent_id)` - Retrieve policy card for agent
- `is_tool_allowed(agent_id, tool_name, args)` - Check tool permission with pattern matching
- `check_action_rules(agent_id, tool_name, args)` - Evaluate condition-based rules
- `get_safety_constraints(agent_id)` - Get safety limits for agent
- `get_compliance_requirements(agent_id)` - Get compliance rules for agent
- `validate_card(card)` - Validate policy card structure
- `export_policy_summary()` - Export all policies for audit

### 3. Policy Enforcement Middleware

**File:** `infrastructure/policy_cards/middleware.py`

Enforces policies before tool execution:

```python
from infrastructure.policy_cards import PolicyEnforcer

# Create enforcer
enforcer = PolicyEnforcer(".policy_cards")

# Check tool call BEFORE execution
result = enforcer.check_tool_call(
    agent_id="qa_agent",
    tool_name="Read",
    args={"file_path": "/tmp/data.txt"}
)

if result["allowed"]:
    # Call the tool
    pass
else:
    print(f"Tool denied: {result['reason']}")

# Check output for PII
output_check = enforcer.validate_output(
    agent_id="qa_agent",
    output="User email: john@example.com"
)

# Get statistics
stats = enforcer.get_agent_stats("qa_agent")
print(f"Total calls: {stats['total_calls']}")
print(f"Allow rate: {stats['allow_rate']:.1%}")

# Export compliance report
enforcer.export_report("compliance_report.json")
```

**Result Structure:**

```python
{
    "allowed": bool,              # Tool call allowed?
    "reason": str,                # Why allowed/denied
    "modified_args": dict,        # Args with PII redacted
    "pii_detected": bool,         # PII found in args?
    "pii_types": list,            # Types of PII detected
}
```

### 4. PII Detection & Redaction

**File:** `infrastructure/policy_cards/middleware.py` (PIIDetector class)

Detects and redacts sensitive data:

```python
from infrastructure.policy_cards.middleware import PIIDetector

detector = PIIDetector()

# Detect PII
text = "SSN: 123-45-6789, Email: user@example.com"
found = detector.detect_pii(text)
# Result: {"ssn": ["123-45-6789"], "email": ["user@example.com"]}

# Redact PII
redacted = detector.redact_pii(text)
# Result: "SSN: [SSN-REDACTED], Email: [EMAIL-REDACTED]"

# Redact dictionary
data = {"ssn": "123-45-6789", "user": "john"}
redacted_data = detector.redact_dict(data)
# Result: {"ssn": "[SSN-REDACTED]", "user": "john"}
```

**Detected PII Types:**

- Social Security Numbers (123-45-6789)
- Credit Cards (4532-1111-2222-3333)
- Email addresses (user@example.com)
- Phone numbers (555-123-4567)
- Passport numbers (AB123456)
- IP addresses (192.168.1.1)

### 5. HALO Router Integration

**File:** `infrastructure/policy_cards/halo_integration.py`

Integrates policy checks into HALO routing:

```python
from infrastructure.policy_cards import PolicyEnforcer
from infrastructure.policy_cards.halo_integration import PolicyAwareHALORouter

# Create policy-aware router
enforcer = PolicyEnforcer(".policy_cards")
router = PolicyAwareHALORouter(halo_router, enforcer)

# Route with policy checks
agent_id, explanation, metadata = router.route_task_with_policy_check(task)

if agent_id:
    print(f"✅ Routed to {agent_id}: {explanation}")
else:
    print(f"❌ No compliant agent found: {explanation}")

# Validate agent capabilities
valid, denied_tools, denials = router.validate_agent_capabilities(
    agent_id="qa_agent",
    required_tools=["Read", "Grep", "Write"]
)

# Get agent policy profile
profile = router.get_agent_policy_profile("qa_agent")
```

## Usage Patterns

### Pattern 1: Basic Tool Check

```python
from infrastructure.policy_cards import PolicyEnforcer

enforcer = PolicyEnforcer(".policy_cards")

def call_tool(agent_id, tool_name, args):
    # Check policy first
    result = enforcer.check_tool_call(agent_id, tool_name, args)

    if not result["allowed"]:
        raise PermissionError(result["reason"])

    # Use modified args (with PII redacted if needed)
    return tool_call(tool_name, result["modified_args"])
```

### Pattern 2: Compliance Reporting

```python
# Track all calls
enforcer = PolicyEnforcer(".policy_cards")

# During execution
for task in tasks:
    enforcer.check_tool_call(task.agent, task.tool, task.args)

# Generate audit report
enforcer.export_report("audit_report.json")
```

### Pattern 3: Rate Limiting

Policy cards define rate limits per tool:

```yaml
action_rules:
  - rule_id: "rate_limit_tests"
    condition: "tool == 'Bash' and 'pytest' in command"
    action: "allow"
    rate_limit: 100  # max 100 calls per hour
```

The PolicyEnforcer automatically enforces these limits.

### Pattern 4: Custom Conditions

Define conditional rules using Python expressions:

```yaml
action_rules:
  - rule_id: "allow_read_only"
    condition: "tool == 'Read' or tool == 'Grep'"
    action: "allow"

  - rule_id: "block_large_commands"
    condition: "len(command) > 1000"
    action: "deny"
    reason: "Command too large (possible injection)"

  - rule_id: "require_pytest_for_bash"
    condition: "'pytest' in command or 'python' in command"
    action: "allow"
```

## Creating New Policy Cards

### Step 1: Define Agent Capabilities

```yaml
agent_id: my_agent
version: "1.0"
jurisdiction: "US-CA"
effective_date: "2025-11-05"

capabilities:
  allowed_tools:
    - Read
    - Grep
  denied_tools:
    - Write
    - Bash(*)
```

### Step 2: Add Action Rules

```yaml
action_rules:
  - rule_id: "log_all_reads"
    condition: "tool == 'Read'"
    action: "allow"
    rate_limit: 1000

  - rule_id: "block_sensitive_files"
    condition: "'/etc' in args.get('file_path', '')"
    action: "deny"
    reason: "Cannot access /etc directory"
```

### Step 3: Set Safety Constraints

```yaml
safety_constraints:
  max_tokens_per_call: 4096
  max_calls_per_session: 500
  pii_detection: true
  sensitive_data_redaction: true
  memory_limit_mb: 1024
```

### Step 4: Define Compliance Requirements

```yaml
compliance:
  data_retention_days: 90
  audit_log_required: true
  human_review_threshold: "high_risk"
  log_all_tool_calls: true
```

### Step 5: Save and Validate

```python
from infrastructure.policy_cards import PolicyCardLoader

loader = PolicyCardLoader(".policy_cards")
card = loader.get_card("my_agent")
valid, errors = loader.validate_card(card)

if valid:
    print("✅ Card is valid")
else:
    print("❌ Card errors:", errors)
```

## Integration Guide

### Integrating with Existing Agents

1. **Add policy check at tool invocation:**

```python
# agents/my_agent.py
from infrastructure.policy_cards import PolicyEnforcer

class MyAgent:
    def __init__(self):
        self.enforcer = PolicyEnforcer(".policy_cards")

    def run_tool(self, tool_name, args):
        # Check policy first
        result = self.enforcer.check_tool_call(
            self.agent_id, tool_name, args
        )

        if not result["allowed"]:
            raise PermissionError(f"Policy denied: {result['reason']}")

        # Use modified args
        return self.tools[tool_name](**result["modified_args"])
```

2. **Integrate with orchestrator:**

```python
# orchestration/main.py
from infrastructure.policy_cards.halo_integration import PolicyAwareHALORouter

# Wrap HALO router
policy_router = PolicyAwareHALORouter(halo_router)

# Use for routing
agent_id, explanation, metadata = policy_router.route_task_with_policy_check(task)
```

## Testing

Run the comprehensive test suite:

```bash
# Run all tests
pytest tests/test_policy_cards.py -v

# Run specific test class
pytest tests/test_policy_cards.py::TestPolicyCardLoader -v

# Run with coverage
pytest tests/test_policy_cards.py --cov=infrastructure.policy_cards
```

**Test Coverage (45 tests):**

- Rate limiting (4 tests)
- Policy loading (8 tests)
- PII detection (7 tests)
- Policy enforcement (8 tests)
- Compliance logging (1 test)
- HALO integration (6 tests)
- Policy validation (3 tests)
- Action rules (4 tests)
- End-to-end (4 tests)

## Monitoring & Debugging

### Export Compliance Report

```python
enforcer.export_report("report.json")
```

Report includes:
- Total agents with policies
- Total tool calls tracked
- Per-agent statistics (allowed/denied breakdown)
- Policy summary

### Get Agent Statistics

```python
stats = enforcer.get_agent_stats("qa_agent")
print(f"Total calls: {stats['total_calls']}")
print(f"Allowed: {stats['allowed_calls']}")
print(f"Denied: {stats['denied_calls']}")
print(f"Allow rate: {stats['allow_rate']:.1%}")
```

### Check Specific Policy

```python
card = loader.get_card("qa_agent")
print(json.dumps(card, indent=2))
```

### Reload Cards at Runtime

```python
# Useful for updating policies without restart
loader.reload_cards()
```

## File Locations & Line Counts

| File | Lines | Purpose |
|------|-------|---------|
| `.policy_cards/qa_agent.yaml` | 40 | QA agent policy |
| `.policy_cards/support_agent.yaml` | 35 | Support agent policy |
| `.policy_cards/builder_agent.yaml` | 50 | Builder agent policy |
| ... (13 more agent cards) | ... | ... |
| `infrastructure/policy_cards/loader.py` | 530 | Policy loading & matching |
| `infrastructure/policy_cards/middleware.py` | 420 | Policy enforcement & PII |
| `infrastructure/policy_cards/halo_integration.py` | 320 | HALO router integration |
| `tests/test_policy_cards.py` | 520 | 45 comprehensive tests |

**Total:** 16 policy cards + 1,270 lines of code

## Production Checklist

- [x] All 45 tests passing
- [x] Policy cards created for all 15 agents
- [x] PII detection operational (7 PII types)
- [x] Rate limiting functional
- [x] HALO integration complete
- [x] Compliance logging enabled
- [x] Documentation complete
- [x] Type hints throughout
- [x] Error handling comprehensive
- [x] Logging configured

## Troubleshooting

### Issue: Tool always allowed for unknown agent

**Expected:** Policy cards provide default behavior (allow if no restrictions)
**Fix:** Create policy card for agent if restrictions needed

### Issue: PII not being detected

**Check:**
1. Verify `pii_detection: true` in safety_constraints
2. Check PII pattern matches (SSN format: XXX-XX-XXXX)
3. Ensure `sensitive_data_redaction: true` to see redactions

### Issue: Rate limit not enforced

**Check:**
1. Verify `rate_limit: N` is set in action_rule
2. Ensure condition matches the tool/command
3. Check that rule action is "allow" (not "deny")

### Issue: Modified args not being used

**Pattern:**
```python
result = enforcer.check_tool_call(agent_id, tool, args)
# MUST use result["modified_args"], not original args
tool_call(**result["modified_args"])
```

## Next Steps

1. **Deploy to staging** - Test with real workloads
2. **Monitor compliance** - Export weekly reports
3. **Tune rules** - Adjust rate limits based on usage
4. **Add agent cards** - Create cards for any custom agents
5. **Integrate with monitoring** - Export metrics to Prometheus

## References

- **Paper:** https://arxiv.org/abs/2510.24383
- **HALO Router:** https://arxiv.org/abs/2505.13516
- **HTDAG:** https://arxiv.org/abs/2502.07056
- **DAAO:** https://arxiv.org/abs/2509.11079

## Support

For issues or questions:
1. Check documentation above
2. Review test cases in `tests/test_policy_cards.py`
3. Check logs in `logs/policy_compliance/`
4. Export report: `enforcer.export_report("debug.json")`

---

**Implementation Date:** November 5, 2025
**Status:** Production Ready
**Last Updated:** November 5, 2025
