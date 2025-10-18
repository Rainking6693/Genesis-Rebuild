# Deployment Testing Protocol

**Purpose:** Ensure system works in actual deployment environment
**When:** At completion of every phase (Day 1, 2, 3, 4, etc.)
**Agent:** Alex (Deployment Testing Specialist)
**Created:** October 15, 2025

---

## Why This Is Needed

**Problem Discovered:** Day 3 audits (Cora, Hudson, Alex E2E) all passed with 92-98/100 scores, BUT when user tried to run the system:
- pytest wasn't installed
- Command-line issues with long commands
- Class name mismatch (BuilderAgentEnhanced vs EnhancedBuilderAgent)

**These issues were NOT caught by code audits because:**
- Audits tested Python code quality, not deployment
- Audits ran in development environment, not fresh server
- Audits didn't test actual user commands

---

## Deployment Testing Agent: Alex

**Agent:** Alex (already used for E2E testing, now also does deployment testing)
**Expertise:** Full-stack testing, deployment, integration, real-world scenarios

**Responsibilities:**
1. Test on fresh environment (simulate user's actual server)
2. Install all dependencies from scratch
3. Run actual user commands (not just unit tests)
4. Verify test scripts work
5. Catch missing packages, command issues, naming mismatches

---

## Deployment Testing Checklist

At the END of every phase, Alex must perform these tests:

### 1. Fresh Environment Setup
- [ ] Create clean virtual environment
- [ ] Install dependencies: `pip install -r requirements.txt`
- [ ] Verify all packages installed successfully

### 2. Dependency Verification
- [ ] Install pytest: `pip install pytest`
- [ ] Install any testing tools needed
- [ ] Check for missing imports

### 3. Run All Unit Tests
```bash
python -m pytest test_*.py -v
```
- [ ] Verify all tests pass
- [ ] Check for import errors
- [ ] Verify test count matches expected

### 4. Component Load Test
Create and run `test_components.py`:
```python
from infrastructure.replay_buffer import ReplayBuffer
from infrastructure.reasoning_bank import get_reasoning_bank
from agents.builder_agent_enhanced import EnhancedBuilderAgent
print('All components loaded successfully')
```
- [ ] No import errors
- [ ] All components load
- [ ] Graceful degradation works (MongoDB/Redis warnings OK)

### 5. System Health Check
Create and run `test_health.py`:
```python
from infrastructure.replay_buffer import ReplayBuffer
rb = ReplayBuffer()
stats = rb.get_statistics()
print('System Status:', stats)
```
- [ ] System initializes
- [ ] Statistics returned
- [ ] In-memory fallback works

### 6. Documentation Accuracy
- [ ] Test commands from docs work exactly as written
- [ ] Expected outputs match actual outputs
- [ ] User instructions are clear and correct

### 7. Common User Errors
- [ ] Test with long commands (PowerShell line wrapping)
- [ ] Test copy/paste of commands
- [ ] Test Windows vs Linux path differences
- [ ] Verify class names match imports

---

## Expected Outputs (Reference)

### Test 1: All Unit Tests
```
============================== test session starts ==============================
...
test_replay_buffer.py::test_store_trajectory PASSED
... (29 tests)
test_builder_enhanced.py::test_initialization PASSED
... (23 tests)
test_fixes_integration.py::test_pattern_retrieval PASSED
... (7 tests)

========== XX passed, XXXX warnings in X.XXs ===========
```

### Test 2: Component Load
```
2025-10-15 XX:XX:XX - infrastructure.reasoning_bank - WARNING - MongoDB not available - using in-memory storage
WARNING:infrastructure.reasoning_bank:MongoDB not available - using in-memory storage
2025-10-15 XX:XX:XX - infrastructure.replay_buffer - WARNING - MongoDB not available - using in-memory trajectory storage
WARNING:infrastructure.replay_buffer:MongoDB not available - using in-memory trajectory storage
All components loaded successfully
```

### Test 3: System Health
```
2025-10-15 XX:XX:XX - infrastructure.reasoning_bank - WARNING - MongoDB not available - using in-memory storage
WARNING:infrastructure.reasoning_bank:MongoDB not available - using in-memory storage
2025-10-15 XX:XX:XX - infrastructure.replay_buffer - WARNING - MongoDB not available - using in-memory trajectory storage
WARNING:infrastructure.replay_buffer:MongoDB not available - using in-memory trajectory storage
2025-10-15 XX:XX:XX - infrastructure.replay_buffer - WARNING - Redis connection failed: Error 111 connecting to localhost:6379. Connection refused.
WARNING:infrastructure.replay_buffer:Redis connection failed: Error 111 connecting to localhost:6379. Connection refused.
2025-10-15 XX:XX:XX - infrastructure.replay_buffer - INFO - Real-time streaming disabled
INFO:infrastructure.replay_buffer:Real-time streaming disabled
System Status: {'total_trajectories': 0, 'by_outcome': {}, 'by_agent': {}, 'avg_reward': 0.0, 'avg_duration_seconds': 0.0, 'task_types': {}, 'storage_backend': 'in-memory'}
```

---

## Issues Found During Day 3 Deployment Testing

### Issue 1: Missing pytest
**Problem:** `No module named pytest`
**Fix:** Added `pip install pytest` to deployment instructions
**Prevention:** Include in requirements.txt OR in deployment checklist

### Issue 2: Long Command Line Wrapping
**Problem:** PowerShell auto-wraps long commands, causing syntax errors
**Fix:** Created short test scripts instead of long one-liners
**Prevention:** Always provide script files for complex commands

### Issue 3: Class Name Mismatch
**Problem:** Test imported `BuilderAgentEnhanced` but actual class is `EnhancedBuilderAgent`
**Fix:** Corrected import in test_components.py
**Root Cause:** Test written before checking actual class name
**Prevention:** Alex must verify all class names match imports

---

## Integration with Existing Audit Process

**Current Audit Flow:**
1. Cora (Architecture Audit) - Reviews design, integration, Darwin readiness
2. Hudson (Code Review) - Reviews code quality, security, best practices
3. Alex (E2E Testing) - Tests functionality, integration, performance

**NEW Audit Flow (includes deployment):**
1. Cora (Architecture Audit)
2. Hudson (Code Review)
3. Alex (E2E Testing)
4. **Alex (Deployment Testing)** ← NEW STEP
5. Final approval only after ALL 4 pass

---

## Deployment Test Report Template

```markdown
# Deployment Test Report - Day X

**Date:** YYYY-MM-DD
**Tester:** Alex (Deployment Testing Agent)
**Phase:** Day X - [Phase Name]

## Environment
- OS: Ubuntu 24.04 / Windows 11
- Python: 3.12.x
- Virtual Environment: Clean install

## Test Results

### 1. Fresh Environment Setup
- [ ] PASS/FAIL - Virtual environment created
- [ ] PASS/FAIL - Dependencies installed

### 2. Dependency Verification
- [ ] PASS/FAIL - pytest installed
- [ ] PASS/FAIL - All imports work

### 3. Unit Tests
- [ ] PASS/FAIL - XX/XX tests passed
- Issues: [List any issues]

### 4. Component Load Test
- [ ] PASS/FAIL - All components loaded
- Issues: [List any issues]

### 5. System Health Check
- [ ] PASS/FAIL - System initialized
- Issues: [List any issues]

### 6. Documentation Accuracy
- [ ] PASS/FAIL - Commands work as documented
- Issues: [List any issues]

### 7. Common User Errors
- [ ] PASS/FAIL - Long commands tested
- [ ] PASS/FAIL - Copy/paste tested
- Issues: [List any issues]

## Issues Found
1. [Issue description]
   - Severity: Critical/High/Medium/Low
   - Fix: [How it was fixed]

## Deployment Readiness
- [ ] APPROVED FOR DEPLOYMENT
- [ ] NEEDS FIXES BEFORE DEPLOYMENT

**Overall Status:** PASS/FAIL

---

**Approval:** Alex (Deployment Testing Agent)
**Date:** YYYY-MM-DD
```

---

## Mandatory for All Future Phases

**Starting with Day 4 and beyond:**
- Every phase MUST include deployment testing
- Alex runs deployment tests AFTER E2E tests pass
- Deployment test report required for final approval
- NO phase is complete until deployment tests pass

---

## Success Criteria

**Deployment testing passes when:**
1. Fresh virtual environment works ✅
2. All dependencies install without errors ✅
3. All unit tests pass ✅
4. Component load test passes ✅
5. System health check passes ✅
6. User commands work EXACTLY as documented ✅
7. No import errors, no class name mismatches ✅

**If ANY test fails:**
- Mark phase as "NEEDS DEPLOYMENT FIXES"
- Document issues in deployment test report
- Fix issues
- Re-run deployment tests
- Only approve after all tests pass

---

**Document Status:** ACTIVE
**Effective Date:** October 15, 2025 (retroactive to Day 3)
**Next Review:** After Day 4 completion
