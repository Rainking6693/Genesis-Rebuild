# Swarm-HALO Integration Audit: Action Items for Team

**Audit Completed:** November 2, 2025, 18:15 UTC
**Score:** 8.1/10 | **Status:** CONDITIONAL APPROVAL
**Time to Production:** 2.5 hours (fixes) + validation

---

## IMMEDIATE ACTION ITEMS (TODAY - November 2)

### For Cora (3 P1 Fixes) - Estimated 2.5 hours

#### FIX #1: Implement HALO Router Integration (1 hour)
**File:** `infrastructure/orchestration/swarm_coordinator.py`
**Method:** `route_to_team()` (lines 146-175)

**What to do:**
1. Open the file and navigate to the `route_to_team()` method
2. Replace the direct assignment loop with real HALO routing
3. Handle the RoutingPlan return value correctly
4. Add try/except with fallback behavior

**Code changes needed:**
```python
# BEFORE (line 166-173):
for agent_name, sub_task in zip(team, sub_tasks):
    assignments[agent_name] = sub_task.task_id
    logger.debug(...)

# AFTER:
try:
    routing_plan = await self.halo_router.route_tasks(
        dag_or_tasks=sub_tasks,
        available_agents=team
    )

    assignments = {}
    for sub_task in sub_tasks:
        assigned_agent = routing_plan.assignments.get(sub_task.task_id)
        if assigned_agent:
            assignments[assigned_agent] = sub_task.task_id

    return assignments

except Exception as e:
    logger.warning(f"HALO routing failed: {e}, using fallback assignment")
    # Fallback: direct assignment
    return {agent: st.task_id for agent, st in zip(team, sub_tasks)}
```

**Acceptance Criteria:**
- [ ] Code compiles without errors
- [ ] Tests still pass (41/41)
- [ ] HALO router is actually called (can verify via logging)
- [ ] Fallback works if HALO fails

**Testing command:**
```bash
pytest tests/integration/test_swarm_halo_integration.py::test_swarm_routes_to_team_via_halo -v
```

---

#### FIX #2: Add Timeout to Async Execution (30 min)
**File:** `infrastructure/orchestration/swarm_coordinator.py`
**Method:** `execute_team_task()` (line 200)

**What to do:**
1. Import asyncio if not already imported (already is)
2. Replace `asyncio.gather()` with `asyncio.wait_for(asyncio.gather(...), timeout=300)`
3. Add exception handling for TimeoutError

**Code changes needed:**
```python
# BEFORE (line 200-203):
results = await asyncio.gather(*[
    self._execute_agent_subtask(agent, sub_task_id)
    for agent, sub_task_id in assignments.items()
], return_exceptions=True)

# AFTER:
try:
    results = await asyncio.wait_for(
        asyncio.gather(*[
            self._execute_agent_subtask(agent, sub_task_id)
            for agent, sub_task_id in assignments.items()
        ], return_exceptions=True),
        timeout=300  # 5-minute timeout
    )
except asyncio.TimeoutError:
    logger.error(f"Team execution timeout for task {task.task_id} after 300s")
    return TeamExecutionResult(
        task_id=task.task_id,
        team=team,
        status="failed",
        errors=["Execution timeout after 300 seconds"],
        execution_time=time.time() - start_time
    )
```

**Acceptance Criteria:**
- [ ] Timeout is enforced (300 seconds)
- [ ] TimeoutError is caught and handled gracefully
- [ ] Returns failed TeamExecutionResult on timeout
- [ ] Tests still pass (41/41)

**Testing command:**
```bash
pytest tests/integration/test_swarm_halo_integration.py::test_swarm_executes_team_task -v
```

---

#### FIX #3: Add Error Handling in Async Execution (1 hour)
**File:** `infrastructure/orchestration/swarm_coordinator.py`
**Method:** `execute_team_task()` (lines 177-251)

**What to do:**
1. Wrap the entire method body in try/except
2. Catch exceptions from `route_to_team()` call
3. Catch unexpected exceptions from gathering
4. Return failed TeamExecutionResult on any error

**Code changes needed:**
```python
async def execute_team_task(self, task: Task, team: List[str]) -> TeamExecutionResult:
    """Execute task with team coordination"""
    import time
    start_time = time.time()

    try:
        # Route to team with error handling
        try:
            assignments = await self.route_to_team(task, team)
        except Exception as e:
            logger.error(f"Failed to route task {task.task_id}: {e}")
            return TeamExecutionResult(
                task_id=task.task_id,
                team=team,
                status="failed",
                errors=[f"Routing failed: {str(e)}"],
                execution_time=time.time() - start_time
            )

        # Execute with timeout (see FIX #2 above)
        try:
            results = await asyncio.wait_for(
                asyncio.gather(*[
                    self._execute_agent_subtask(agent, sub_task_id)
                    for agent, sub_task_id in assignments.items()
                ], return_exceptions=True),
                timeout=300
            )
        except asyncio.TimeoutError:
            logger.error(f"Team execution timeout for task {task.task_id}")
            return TeamExecutionResult(
                task_id=task.task_id,
                team=team,
                status="failed",
                errors=["Execution timeout after 300 seconds"],
                execution_time=time.time() - start_time
            )

        # Process results (existing logic)
        individual_results = []
        errors = []
        successful_count = 0

        for i, result in enumerate(results):
            if isinstance(result, Exception):
                errors.append(f"Agent {team[i]} failed: {str(result)}")
            else:
                individual_results.append(result)
                if result.get("status") == "completed":
                    successful_count += 1

        # ... rest of existing code ...

    except Exception as e:
        logger.exception(f"Unexpected error in execute_team_task for {task.task_id}: {e}")
        return TeamExecutionResult(
            task_id=task.task_id,
            team=team,
            status="failed",
            errors=[f"Unexpected error: {str(e)}"],
            execution_time=time.time() - start_time
        )
```

**Acceptance Criteria:**
- [ ] All exceptions caught at top level
- [ ] route_to_team() failures handled
- [ ] asyncio.gather() failures handled
- [ ] All errors logged at ERROR or higher level
- [ ] Graceful degradation to failed status
- [ ] Tests still pass (41/41)

**Testing command:**
```bash
pytest tests/integration/test_swarm_halo_integration.py -v
```

---

### For Hudson (Re-audit) - Estimated 30 min
**Time:** After Cora completes fixes

**What to do:**
1. Review Cora's code changes against requirements
2. Run full test suite to verify no regressions
3. Check HALO router is actually being called
4. Verify error handling works correctly
5. Update audit status document

**Acceptance Criteria:**
- [ ] All 3 P1 fixes implemented correctly
- [ ] All 41/41 tests passing
- [ ] HALO router integration verified (logging shows it's called)
- [ ] Error handling tested and working
- [ ] No new issues introduced
- [ ] Ready to pass to Alex for E2E testing

**Commands to run:**
```bash
# Run tests
pytest tests/integration/test_swarm_halo_integration.py tests/swarm/test_swarm_halo_bridge.py -v

# Check coverage
pytest tests/integration/test_swarm_halo_integration.py tests/swarm/test_swarm_halo_bridge.py \
        --cov=infrastructure.orchestration.swarm_coordinator \
        --cov=infrastructure.swarm.swarm_halo_bridge \
        --cov-report=term-missing
```

---

### For Alex (E2E Testing) - Estimated 1-2 hours
**Time:** After Hudson re-audit

**What to do:**
1. Write integration test using real HALO router (not mocked)
2. Test full flow: team generation → routing → execution
3. Test error scenarios (timeout, failures)
4. Verify swarm coordinator works with real HALO router
5. Document test results

**Test to write:**
```python
@pytest.mark.asyncio
async def test_swarm_coordinator_with_real_halo_router():
    """End-to-end test with real HALO router"""
    # Create real HALO router
    halo_router = HALORouter()

    # Create coordinator
    coordinator = create_swarm_coordinator(
        halo_router=halo_router,
        n_particles=20,
        max_iterations=30,
        random_seed=42
    )

    # Create task
    task = Task(
        task_id="e2e_test_001",
        task_type="ecommerce",
        description="Build e-commerce platform with testing and deployment"
    )

    # Execute full pipeline
    team = await coordinator.generate_optimal_team(task, team_size=3)
    result = await coordinator.execute_team_task(task, team)

    # Verify
    assert result.status in ["completed", "partial", "failed"]
    assert result.execution_time > 0
    assert len(result.team) > 0

    # Verify HALO was actually used
    # (Can check via logging or mock verification)
```

**Acceptance Criteria:**
- [ ] E2E test passes with real HALO router
- [ ] Team generation works
- [ ] HALO routing integration works
- [ ] Execution completes or times out gracefully
- [ ] Error handling works
- [ ] Ready for production deployment

---

## POST-FIX VALIDATION (SAME DAY)

After all 3 P1 fixes are implemented and tested:

```bash
# 1. Run full test suite
pytest tests/ -v

# 2. Check coverage
pytest tests/ --cov=infrastructure --cov-report=term-missing | grep -E "TOTAL|swarm"

# 3. Verify no regressions
# Compare coverage before/after (should be ≥ 91.25%)

# 4. Check code quality
# Type hints, docstrings, imports should still be clean
```

---

## NEXT DAY ACTIONS (November 3)

### Deploy to Staging
1. Merge fixes to main branch
2. Deploy to staging environment
3. Run smoke tests in staging
4. Verify HALO integration works in staging
5. Get approval from all 3 agents before production

### Prepare for Production Deployment
1. Update deployment checklist
2. Prepare Phase 4 rollout plan (7-day progressive)
3. Set up monitoring and alerting
4. Prepare rollback plan

---

## OPTIONAL P2 FIXES (Can be done after initial deployment)

If time permits after P1 fixes, consider:

### Optional Fix #4: Team Evolution Logic (2 hours)
**File:** `infrastructure/orchestration/swarm_coordinator.py`
**Lines:** 369-400

Currently just returns the same team. Should actually re-optimize using PSO.

### Optional Fix #5: Execution History Size Limit (30 min)
**File:** `infrastructure/orchestration/swarm_coordinator.py`
**Lines:** 91, 244

Add maxlen to deque or trim list to prevent unbounded growth.

### Optional Fix #6: Move Configuration to YAML (2 hours)
**File:** `config/production.yml`

Move hardcoded values to configuration:
- PSO parameters (particles, iterations)
- Smoothing factor (0.3)
- Evolution threshold (0.7)
- Business templates

---

## SIGN-OFF CHECKLIST

### Cora (Code Implementation)
- [ ] Fix #1: HALO router integration (route_to_team)
- [ ] Fix #2: Timeout protection (asyncio.wait_for)
- [ ] Fix #3: Error handling (try/except blocks)
- [ ] Commit changes to git
- [ ] Notify Hudson for re-audit

### Hudson (Code Review)
- [ ] Review all 3 fixes
- [ ] Verify 41/41 tests passing
- [ ] Verify 91%+ coverage maintained
- [ ] Verify HALO router is actually called
- [ ] Sign off on production readiness
- [ ] Notify Alex for E2E testing

### Alex (E2E Validation)
- [ ] Write E2E test with real HALO router
- [ ] Test team generation → routing → execution
- [ ] Test timeout and error scenarios
- [ ] Verify no regressions in existing tests
- [ ] Sign off on production readiness

### Deployment
- [ ] All 3 sign-offs complete
- [ ] Merge to main branch
- [ ] Deploy to staging
- [ ] Run staging validation suite
- [ ] Production deployment via Phase 4 rollout

---

## TIMELINE SUMMARY

| Step | Owner | Estimated Time | Status |
|------|-------|-----------------|--------|
| P1 Fix #1: HALO integration | Cora | 1 hour | TODO |
| P1 Fix #2: Timeout | Cora | 30 min | TODO |
| P1 Fix #3: Error handling | Cora | 1 hour | TODO |
| Re-audit | Hudson | 30 min | TODO |
| E2E testing | Alex | 1-2 hours | TODO |
| Deploy to staging | DevOps | 1-2 hours | TODO |
| **Total to Production** | **All** | **5-7 hours** | **→ Nov 3** |

---

## ROLLBACK PLAN

If production issues arise:

1. **Disable via Feature Flag** (immediate, <1 min)
   - Set `FEATURE_SWARM_COORDINATOR=false` in production config
   - Returns to previous behavior

2. **Rollback Code** (if needed, ~5 min)
   - Revert commits to previous working state
   - Redeploy

3. **Escalation**
   - Contact Hudson for emergency support
   - Contact Cora for code issues
   - Contact Forge for infrastructure issues

---

## QUESTIONS?

Refer to:
- **Full Audit:** `/home/genesis/genesis-rebuild/AUDIT_SWARM_HALO_INTEGRATION.md`
- **Issue Details:** `/home/genesis/genesis-rebuild/SWARM_AUDIT_ISSUES.md`
- **Quick Ref:** `/home/genesis/genesis-rebuild/SWARM_AUDIT_QUICK_REFERENCE.md`

---

**Document Created:** November 2, 2025, 18:30 UTC
**Status:** Ready for Cora to begin P1 fixes
**Expected Completion:** November 3, 2025 (next day)
