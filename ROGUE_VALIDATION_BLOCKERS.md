# Rogue Validation Blockers - Action Items

**Date:** October 30, 2025
**Status:** BLOCKED - 2 Critical Issues Preventing Baseline Validation

---

## BLOCKER #1: A2A Service Instability (P0 - CRITICAL)

**Owner:** Hudson (infrastructure) or Cora (implementation)
**Impact:** Cannot test ANY agents - validation completely blocked
**Timeline:** 1-2 hours to fix

### Symptoms
- Service crashes during initialization
- 100%+ CPU usage indicates blocking operations
- Process eventually dies without serving requests
- No /health endpoint response
- No /docs endpoint response

### Root Cause
Heavy agent initialization blocking event loop:
- 15 agents × multiple tools = significant startup time
- Azure AI client initialization may be synchronous
- Agent imports trigger heavy dependencies (Playwright, OpenAI Gym) at import time
- These environments should be lazy-loaded

### Required Fixes

**Immediate (Quick Fix):**
- [ ] Add startup time limit (max 30 seconds for initialization)
- [ ] Lazy-load agent dependencies (don't initialize at import)
- [ ] Move Playwright/OpenAI Gym env init to agent first-use
- [ ] Test: `curl -s -m 5 http://localhost:8080/health` should respond

**Short-Term (Proper Fix):**
- [ ] Implement async agent initialization
- [ ] Add agent health checks endpoint (`/agents/{agent_id}/health`)
- [ ] Add startup progress logging
- [ ] Implement graceful degradation (start with 0 agents, load on-demand)

**Code Locations:**
- Service: `/home/genesis/genesis-rebuild/a2a_service.py`
- Logs: `/tmp/a2a_service.log`
- Command: `uvicorn a2a_service:app --host 0.0.0.0 --port 8080`

**Validation Test:**
```bash
# Start service
./scripts/start_a2a_service.sh

# Should respond within 5 seconds
curl -s -m 5 http://localhost:8080/health
# Expected: {"status": "healthy", "agents": 15}

# Check docs endpoint
curl -s http://localhost:8080/docs
# Expected: FastAPI documentation page
```

---

## BLOCKER #2: Missing P1 Scenarios (P0 - BLOCKING)

**Owner:** Cora (per AGENT_PROJECT_MAPPING.md)
**Impact:** Cannot run full 500-scenario baseline validation
**Timeline:** 2-4 hours to generate

### Current Status
- **P0 Scenarios:** 260 ready ✅
  - orchestration_p0.yaml: 110 scenarios
  - agents_p0_core.yaml: 150 scenarios
- **P1 Scenarios:** 0 found ❌
  - Expected: 240 scenarios (16 files)
  - Impact: Can only run 260/500 scenarios (52%)

### Required Files (16 total)

**Orchestration Integration (1 file):**
- [ ] `orchestration_p1_integration.yaml` - ~20 scenarios
  - Cross-component integration (HTDAG + HALO + AOP + DAAO)
  - Multi-agent workflows
  - End-to-end orchestration tests

**Agent-Specific Specialized Tests (15 files, ~16 scenarios each):**
- [ ] `qa_agent_p1_specialized.yaml` - Advanced pytest, complex mocking
- [ ] `support_agent_p1_specialized.yaml` - Multi-language, escalation workflows
- [ ] `legal_agent_p1_specialized.yaml` - Complex contracts, multi-jurisdiction
- [ ] `analyst_agent_p1_specialized.yaml` - Advanced charts, forecasting
- [ ] `content_agent_p1_specialized.yaml` - SEO optimization, A/B testing
- [ ] `security_agent_p1_specialized.yaml` - Penetration testing, threat modeling
- [ ] `builder_agent_p1_specialized.yaml` - Microservices, complex architectures
- [ ] `deploy_agent_p1_specialized.yaml` - Multi-environment, rollback scenarios
- [ ] `spec_agent_p1_specialized.yaml` - Technical design docs, API specs
- [ ] `reflection_agent_p1_specialized.yaml` - Meta-learning, pattern recognition
- [ ] `se_darwin_agent_p1_specialized.yaml` - Multi-trajectory, convergence
- [ ] `waltzrl_conversation_p1_specialized.yaml` - Multi-turn safety dialogues
- [ ] `waltzrl_feedback_p1_specialized.yaml` - Collaborative training, DIR
- [ ] `marketing_agent_p1_specialized.yaml` - Campaign planning, analytics
- [ ] `email_agent_p1_specialized.yaml` - Email campaigns, template management

### Scenario Format (Follow P0 Structure)

**File Template:**
```yaml
# Rogue Test Scenarios - [Component] P1 Specialized Tests
# 16 scenarios: [description of test areas]

scenarios:
  - id: "[component]_p1_specialized_001"
    priority: "P1"
    category: "specialized"
    tags: ["[component]", "[capability]", "advanced"]
    description: "[Clear description of specialized test]"
    input:
      task: "[Task description]"
      requirements: ["[Requirement 1]", "[Requirement 2]"]
    expected_output:
      status: "success"
      [component_specific_outputs]: "[expected values]"
      response_time: "<5s"
    policy_checks:
      - "[Check 1]"
      - "[Check 2]"
      - "[Check 3]"
    cost_estimate: "$0.03"
```

**Reference Examples:**
- P0 orchestration: `tests/rogue/scenarios/orchestration_p0.yaml`
- P0 agents: `tests/rogue/scenarios/agents_p0_core.yaml`

### Validation Checklist

Once files are created:
- [ ] All 16 files exist in `tests/rogue/scenarios/`
- [ ] Total P1 scenario count: 240 (verify with scenario loader)
- [ ] All scenarios have valid YAML syntax
- [ ] All scenarios follow P1 format (priority="P1", category="specialized")
- [ ] Scenario IDs are unique across all files
- [ ] Cost estimates are realistic ($0.02-0.05 per scenario)

**Validation Command:**
```bash
python3 << 'EOF'
import yaml
from pathlib import Path

scenarios_dir = Path('tests/rogue/scenarios')
p1_files = list(scenarios_dir.glob('*_p1_*.yaml'))

total_p1 = 0
for f in p1_files:
    with open(f) as fp:
        data = yaml.safe_load(fp)
        count = len(data['scenarios'])
        total_p1 += count
        print(f'{f.name}: {count} scenarios')

print(f'\nTotal P1: {total_p1}')
assert total_p1 == 240, f"Expected 240 P1 scenarios, found {total_p1}"
print("✅ P1 scenario validation passed!")
EOF
```

---

## Once Blockers Are Resolved

### Run P0-Only Baseline Validation (Immediate)

```bash
# Start A2A service
./scripts/start_a2a_service.sh

# Verify service is healthy
curl -s http://localhost:8080/health

# Run P0-only validation (260 scenarios)
python infrastructure/testing/rogue_runner.py \
  --scenarios-dir tests/rogue/scenarios/ \
  --priority P0 \
  --parallel 5 \
  --output-dir reports/rogue/p0_baseline/ \
  --verbose

# Expected runtime: 10-15 minutes
# Expected cost: ~$7.80 (260 × $0.03)
# Target pass rate: ≥90% (234/260 scenarios)
```

### Run Full Baseline Validation (Once P1 Ready)

```bash
# Run P0+P1 validation (500 scenarios)
python infrastructure/testing/rogue_runner.py \
  --scenarios-dir tests/rogue/scenarios/ \
  --priority P0,P1 \
  --parallel 5 \
  --output-dir reports/rogue/full_baseline/ \
  --verbose

# Expected runtime: 20-25 minutes
# Expected cost: ~$15.00 (500 × $0.03)
# Target pass rate: ≥85% overall (425/500 scenarios)
# Target P0 pass rate: ≥90% (234/260 scenarios)
# Target P1 pass rate: ≥80% (192/240 scenarios)
```

---

## Alternative Approaches (If Blockers Persist)

### Option A: P0-Only Validation (Recommended)
- Run 260 P0 scenarios only
- Establish P0 baseline (target: ≥90% pass rate)
- Document P1 as future work
- Timeline: ~2 hours (once A2A stable)

### Option B: Mock Agent Testing
- Create mock A2A service with stubbed responses
- Validate Rogue framework end-to-end
- Test reporting and cost tracking
- Timeline: ~3 hours

### Option C: Direct Agent Testing
- Bypass A2A service, call agents directly
- Modify rogue_runner.py for direct agent instantiation
- Validate agent functionality without protocol
- Timeline: ~4 hours (requires code changes)

---

## Success Criteria (Once Unblocked)

**Minimum Requirements:**
- ✅ All P0 scenarios execute successfully (260 scenarios)
- ✅ P0 pass rate ≥90% (234/260 passing)
- ✅ Runtime <15 minutes for P0-only
- ✅ Cost <$10 for P0-only
- ✅ No infrastructure failures
- ✅ Comprehensive report generated

**Full Requirements (P0 + P1):**
- ✅ All 500 scenarios execute successfully
- ✅ Overall pass rate ≥85% (425/500 passing)
- ✅ P0 pass rate ≥90% (234/260 passing)
- ✅ P1 pass rate ≥80% (192/240 passing)
- ✅ Runtime <30 minutes
- ✅ Cost <$15
- ✅ No infrastructure failures
- ✅ Comprehensive report generated

---

## Contact

**A2A Service Issues:**
- Hudson (Infrastructure Lead)
- Cora (Implementation Lead)

**P1 Scenario Generation:**
- Cora (per AGENT_PROJECT_MAPPING.md)

**Validation Questions:**
- Forge (Testing Specialist)
- Alex (E2E Testing Lead)

---

**Last Updated:** October 30, 2025, 20:45 UTC
**Status:** BLOCKED - Awaiting fixes
**Next Action:** Fix blockers → Run P0-only validation
