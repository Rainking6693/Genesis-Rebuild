# A2A Agent Cards - Quick Start Guide

## What Was Fixed

The Rogue validation framework requires per-agent card endpoints at `/a2a/agents/{agent_name}/card`. Genesis now provides these endpoints for all 15 agents, fully compliant with the A2A protocol.

**Status:** ✅ READY FOR ROGUE VALIDATION

## Quick Validation

### 1. Start the A2A Service

```bash
cd /home/genesis/genesis-rebuild
python a2a_service.py
```

Expected output:
```
================================================================================
GENESIS A2A SERVICE - LAZY LOADING MODE
ENVIRONMENT: development (ENVIRONMENT=development, DEBUG=true)
⚠️  WARNING: Running in development mode
📋 Registered Agents: 16
⚡ Lazy loading enabled - agents initialized on first use
⏱️  Agent initialization timeout: 30s
================================================================================
```

### 2. Test Individual Agent Cards

In another terminal:

```bash
# Test QA Agent
curl http://localhost:8000/a2a/agents/qa/card | jq .

# Test all agents at once
for agent in qa support legal analyst content security builder deploy spec reflection se_darwin waltzrl_conversation waltzrl_feedback marketing orchestrator; do
  echo -n "$agent: "
  curl -s http://localhost:8000/a2a/agents/$agent/card | jq -r '.name'
done
```

Expected output:
```
qa: QA Agent
support: Support Agent
legal: Legal Agent
analyst: Analyst Agent
content: Content Agent
security: Security Agent
builder: Builder Agent
deploy: Deploy Agent
spec: Spec Agent
reflection: Reflection Agent
se_darwin: SE-Darwin Agent
waltzrl_conversation: WaltzRL Conversation Agent
waltzrl_feedback: WaltzRL Feedback Agent
marketing: Marketing Agent
orchestrator: Genesis Orchestrator
```

### 3. Run Complete Test Suite

```bash
python /home/genesis/genesis-rebuild/test_a2a_agent_cards.py
```

Expected result:
```
✅ PASS - Agent Card Definitions
✅ PASS - Endpoint Accessibility
✅ PASS - Error Handling
✅ PASS - Unified Card Backward Compatibility
✅ PASS - A2A Protocol Compliance

Total: 5/5 tests passed

🎉 All tests passed! Ready for Rogue validation.
```

### 4. Test Error Handling

```bash
# Should return 404 for unknown agent
curl http://localhost:8000/a2a/agents/unknown_agent/card

# Should still work for valid agent
curl http://localhost:8000/a2a/agents/qa/card | jq '.name'
```

## What Each Endpoint Returns

All endpoints return A2A-compliant AgentCard JSON with these fields:

```json
{
  "name": "Agent Display Name",
  "version": "1.0.0",
  "description": "Clear description of agent purpose",
  "capabilities": ["capability1", "capability2"],
  "skills": ["skill1", "skill2"],
  "defaultInputModes": ["text", "json"],
  "defaultOutputModes": ["text", "json", "markdown"]
}
```

## Available Agents (15 Total)

1. **qa** - Quality assurance and testing
2. **support** - Customer support automation
3. **legal** - Legal document generation
4. **analyst** - Business analytics
5. **content** - Content generation
6. **security** - Security auditing
7. **builder** - Full-stack development
8. **deploy** - Deployment automation
9. **spec** - Specification writing
10. **reflection** - Self-improvement
11. **se_darwin** - Self-evolving code agent
12. **waltzrl_conversation** - Safety conversation agent
13. **waltzrl_feedback** - Safety feedback agent
14. **marketing** - Marketing automation
15. **orchestrator** - Genesis orchestrator

## Running Rogue Validation

Once the A2A service is running:

```bash
python infrastructure/testing/rogue_runner.py \
  --scenarios-dir tests/rogue/scenarios/ \
  --output-dir reports/rogue/ \
  --priority P0
```

**Expected:** All scenarios should execute (may pass or fail on agent logic, but NOT on HTTP 404 for card endpoints).

## Key Improvements

| Aspect | Before | After |
|--------|--------|-------|
| Agent Card Endpoints | ❌ None | ✅ 15 (one per agent) |
| Rogue Pass Rate | 0% (0/265) | Unblocked |
| A2A Compliance | ❌ No | ✅ Yes (7 required fields) |
| Error Handling | ❌ Generic 404 | ✅ Helpful messages |
| Backward Compatibility | N/A | ✅ Unified endpoint still works |

## Verification Checklist

- [x] Per-agent card endpoint: `GET /a2a/agents/{agent_name}/card`
- [x] A2A schema compliance: All 7 required fields present
- [x] 15 agents covered: qa, support, legal, analyst, content, security, builder, deploy, spec, reflection, se_darwin, waltzrl_conversation, waltzrl_feedback, marketing, orchestrator
- [x] Error handling: Graceful 404 for unknown agents
- [x] Backward compatibility: Original `/a2a/card` still works
- [x] Security: Input sanitization, no dynamic code execution
- [x] Testing: 5/5 test suites passing

## Support

For detailed information, see:
- Full report: `/home/genesis/genesis-rebuild/docs/A2A_ENDPOINT_FIX_REPORT.md`
- Test suite: `/home/genesis/genesis-rebuild/test_a2a_agent_cards.py`
- Implementation: `/home/genesis/genesis-rebuild/a2a_service.py` (lines 557-605)

## Next Steps

1. **Verify:** Run test suite and check endpoints
2. **Deploy:** Push changes to production
3. **Validate:** Run Rogue framework on live service
4. **Monitor:** Watch for any agent-specific issues

**Expected Outcome:** 265 Rogue scenarios no longer fail with HTTP 404, unblocking validation of actual agent behavior.
