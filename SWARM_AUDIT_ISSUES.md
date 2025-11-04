# Swarm-HALO Integration Audit: Issue Tracker

**Audit Date:** November 2, 2025
**Auditor:** Hudson
**Overall Score:** 8.1/10
**Status:** CONDITIONAL APPROVAL

---

## CRITICAL P1 ISSUES (MUST FIX BEFORE PRODUCTION)

### Issue #1: HALO Router Not Integrated
**Severity:** P1 BLOCKER
**File:** `infrastructure/orchestration/swarm_coordinator.py`
**Lines:** 146-175
**Component:** `route_to_team()` method

**Problem:**
The async `route_to_team()` method completely bypasses the HALO router. Instead of calling `self.halo_router.route_tasks()`, it directly assigns sub-tasks to agents without using any HALO routing logic.

```python
# CURRENT (WRONG)
async def route_to_team(self, task: Task, team: List[str]) -> Dict[str, str]:
    sub_tasks = self._decompose_for_team(task, team)

    assignments = {}
    for agent_name, sub_task in zip(team, sub_tasks):
        # Direct assignment - NO HALO ROUTING!
        assignments[agent_name] = sub_task.task_id
    return assignments
```

**Impact:**
- HALO routing logic not applied (cost optimization, load balancing, etc.)
- Tests pass because they're mocked, not testing real integration
- Defeats the entire purpose of HALO router in team coordination

**Why This Happened:**
Line 169 comment: "For now, directly assign (HALO validation in future integration)"
This is a TODO that was left incomplete.

**Required Fix:**
```python
async def route_to_team(self, task: Task, team: List[str]) -> Dict[str, str]:
    """Route task to team via HALO router"""
    sub_tasks = self._decompose_for_team(task, team)

    try:
        # USE HALO ROUTER - THIS IS THE KEY FIX
        routing_plan = await self.halo_router.route_tasks(
            dag_or_tasks=sub_tasks,
            available_agents=team
        )

        # Extract assignments from routing plan
        assignments = {}
        for sub_task in sub_tasks:
            assigned_agent = routing_plan.assignments.get(sub_task.task_id)
            if assigned_agent:
                assignments[assigned_agent] = sub_task.task_id
            else:
                # Fallback: assign to team member if HALO doesn't assign
                idx = sub_tasks.index(sub_task)
                if idx < len(team):
                    assignments[team[idx]] = sub_task.task_id

        return assignments

    except Exception as e:
        logger.warning(f"HALO routing failed: {e}, using fallback assignment")
        # Fallback: direct assignment
        return {
            agent: sub_task.task_id
            for agent, sub_task in zip(team, sub_tasks)
        }
```

**Validation:**
```python
# After fix, test should use real HALO router:
@pytest.mark.asyncio
async def test_swarm_routes_to_team_via_halo_real(swarm_coordinator, sample_task):
    """Verify HALO router is actually called"""
    team = ["qa_agent", "builder_agent", "deploy_agent"]

    # This should call real HALO router
    assignments = await swarm_coordinator.route_to_team(sample_task, team)

    # Verify assignments match HALO routing
    assert all(agent in team for agent in assignments.keys())
```

**Timeline:** 1 hour (30 min implement + 30 min test)

---

### Issue #2: Missing Timeout in Async Execution
**Severity:** P1 BLOCKER
**File:** `infrastructure/orchestration/swarm_coordinator.py`
**Lines:** 200-203
**Component:** `execute_team_task()` method

**Problem:**
`asyncio.gather()` has no timeout, so if agents hang, the entire task execution hangs forever.

```python
# CURRENT (UNSAFE)
results = await asyncio.gather(*[
    self._execute_agent_subtask(agent, sub_task_id)
    for agent, sub_task_id in assignments.items()
], return_exceptions=True)  # No timeout!
```

**Impact:**
- Single hanging agent blocks entire team execution
- No SLA enforcement
- Tasks can hang indefinitely
- Orchestrator blocked until timeout occurs at higher level

**Required Fix:**
```python
try:
    results = await asyncio.wait_for(
        asyncio.gather(*[
            self._execute_agent_subtask(agent, sub_task_id)
            for agent, sub_task_id in assignments.items()
        ], return_exceptions=True),
        timeout=300  # 5 minute timeout per team
    )
except asyncio.TimeoutError:
    logger.error(f"Team execution timeout for task {task.task_id}")
    return TeamExecutionResult(
        task_id=task.task_id,
        team=team,
        status="failed",
        errors=[f"Execution timeout after 300s with {len(team)} agents"],
        execution_time=time.time() - start_time
    )
```

**Timeline:** 30 minutes

---

### Issue #3: No Error Handling in Async Execution
**Severity:** P1 BLOCKER
**File:** `infrastructure/orchestration/swarm_coordinator.py`
**Lines:** 177-251
**Component:** `execute_team_task()` method

**Problem:**
While individual task exceptions are caught via `return_exceptions=True`, there's no top-level error handling for the entire parallel execution or sub-task setup.

```python
# CURRENT
results = await asyncio.gather(*[...], return_exceptions=True)

# Process results - catches exceptions but only at iteration level
for i, result in enumerate(results):
    if isinstance(result, Exception):
        errors.append(f"Agent {team[i]} failed: {str(result)}")
```

**Missing Protections:**
1. No timeout (see Issue #2)
2. No protection if `route_to_team()` fails
3. No protection if gathering itself fails
4. No circuit breaker for cascading failures

**Required Fix:**
```python
async def execute_team_task(self, task: Task, team: List[str]) -> TeamExecutionResult:
    import time
    start_time = time.time()
    errors = []

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

        # Execute with timeout
        try:
            results = await asyncio.wait_for(
                asyncio.gather(*[
                    self._execute_agent_subtask(agent, sub_task_id)
                    for agent, sub_task_id in assignments.items()
                ], return_exceptions=True),
                timeout=300
            )
        except asyncio.TimeoutError:
            errors.append("Team execution timeout after 300s")
            results = []

        # Process results...
        return TeamExecutionResult(...)

    except Exception as e:
        logger.exception(f"Unexpected error in execute_team_task: {e}")
        return TeamExecutionResult(
            task_id=task.task_id,
            team=team,
            status="failed",
            errors=[f"Unexpected error: {str(e)}"],
            execution_time=time.time() - start_time
        )
```

**Timeline:** 1 hour

---

## HIGH PRIORITY P2 ISSUES

### Issue #4: Team Evolution Logic is Placeholder
**Severity:** P2 HIGH
**File:** `infrastructure/orchestration/swarm_coordinator.py`
**Lines:** 369-400
**Component:** `evolve_team()` method

**Problem:**
The method claims to evolve teams but just returns the same team:

```python
def evolve_team(self, current_team: List[str], performance_feedback: float) -> List[str]:
    if performance_feedback >= 0.7:
        return current_team  # OK - good performer

    logger.info("Triggering re-optimization")
    return current_team  # BUG - returns same team anyway!
```

**Impact:**
- Poor-performing teams never evolve
- Business deadlock if team underperforms
- Log message is misleading

**Status:** Not blocking production (team evolution is enhancement), but misleading code

**Fix:**
```python
async def evolve_team(
    self,
    current_team: List[str],
    performance_feedback: float,
    task_requirements: Optional[Dict[str, float]] = None
) -> List[str]:
    """Evolve team based on performance feedback"""

    if performance_feedback >= 0.7:
        logger.info(f"Team {current_team} performing well, keeping composition")
        return current_team

    logger.info(f"Team underperforming ({performance_feedback:.2f}), re-optimizing")

    # Re-optimize with adjusted parameters
    if task_requirements is None:
        task_requirements = self._infer_team_capabilities(current_team)

    # Use higher particle count for poor performers
    adjusted_particles = min(100, int(50 * (2.0 - performance_feedback)))

    new_team, new_fitness, _ = self.swarm_bridge.optimize_team(
        task_id=f"evolved_{current_team[0]}_{time.time()}",
        required_capabilities=list(task_requirements.keys()),
        team_size_range=(max(1, len(current_team) - 1), len(current_team) + 1),
        priority=2.0,  # Higher priority for re-optimization
        verbose=False
    )

    logger.info(f"Evolved team: {current_team} -> {new_team} (fitness: {new_fitness:.3f})")
    return new_team
```

**Timeline:** 2 hours (implement + test + validate)

---

### Issue #5: Execution History Unbounded Growth
**Severity:** P2 MEDIUM
**File:** `infrastructure/orchestration/swarm_coordinator.py`
**Lines:** 91, 244
**Component:** `self.execution_history`

**Problem:**
```python
self.execution_history: List[TeamExecutionResult] = []  # Line 91
# ...
self.execution_history.append(result)  # Line 244 - no limit!
```

**Impact:**
- Memory leak over time
- Linear memory growth with number of tasks
- No cleanup mechanism
- Could cause OOM in long-running production systems

**Fix:**
```python
def _track_execution_result(self, result: TeamExecutionResult):
    """Track execution result with size limit"""
    self.execution_history.append(result)

    # Keep only last 1000 executions (configurable)
    MAX_HISTORY = 1000
    if len(self.execution_history) > MAX_HISTORY:
        self.execution_history = self.execution_history[-MAX_HISTORY:]
        logger.debug(f"Trimmed execution history to {MAX_HISTORY} entries")
```

**Alternative:** Use collections.deque for automatic size limiting:
```python
from collections import deque

def __init__(self, ...):
    self.execution_history = deque(maxlen=1000)  # Auto-evicts old entries
```

**Timeline:** 30 minutes

---

### Issue #6: Hardcoded Configuration Values
**Severity:** P2 MEDIUM
**File:** `infrastructure/orchestration/swarm_coordinator.py`
**Lines:** 64, 84, 127, 270-286, 294-299, 385, 547

**Problem:**
Multiple hardcoded values scattered throughout code:

```python
# Line 64: n_particles default
n_particles: int = 50  # Hardcoded

# Line 84: max_iterations default
max_iterations: int = 100  # Hardcoded

# Line 127: PSO range adjustment
team_size_range=(max(1, team_size - 1), team_size + 1)  # Hardcoded ± 1

# Lines 270-286: Business requirements hardcoded
business_requirements = {
    "ecommerce": [...],  # Hardcoded list
    ...
}

# Line 547: Exponential smoothing factor
alpha = 0.3  # Hardcoded

# Line 385: Performance threshold
if performance_feedback >= 0.7:  # Hardcoded 0.7
```

**Impact:**
- Difficult to tune without code changes
- No environment-based configuration
- Inconsistent with production patterns (config.yml exists)
- Can't adjust behavior in staging vs. production

**Fix:**
Move to `config/production.yml`:
```yaml
swarm_coordinator:
  pso:
    default_particles: 50
    default_iterations: 100
    default_team_size_range_margin: 1  # ± this value
  performance_tracking:
    smoothing_factor: 0.3  # exponential smoothing
    evolution_threshold: 0.7  # re-optimize if < this
    history_max_size: 1000
  business_templates:
    ecommerce:
      required_capabilities: [coding, deployment, testing, ads, payments]
    saas:
      required_capabilities: [coding, deployment, testing, security_audit, data_analysis, subscriptions]
    # ... etc
```

**Timeline:** 2 hours (move to config + update code to load)

---

## MEDIUM PRIORITY P3 ISSUES

### Issue #7: Requirement Inference Too Simple
**Severity:** P3 IMPROVEMENT
**File:** `infrastructure/orchestration/swarm_coordinator.py`
**Lines:** 404-442
**Component:** `_infer_requirements_from_task()`

**Problem:**
Only keyword matching. Complex tasks might not match any keywords, defaulting to just ["coding"].

**Examples:**
- "Optimize our infrastructure for 10x scale" -> No match -> defaults to coding (wrong)
- "Create a dashboard for analyzing user churn" -> Matches "analyze" but misses "dashboard" requirement
- "Implement GDPR compliance" -> No match -> defaults to coding (should infer legal+security)

**Current Keyword Coverage:**
```python
"testing": ["test", "qa", "quality", "validation"]  # Good
"coding": ["build", "create", "implement", "code", "develop"]  # Good
"deployment": ["deploy", "launch", "release"]  # Missing: "scale", "infrastructure"
"data_analysis": ["analyze", "analytics", "metrics", "data"]  # Missing: "dashboard"
"security_audit": ["security", "audit", "vulnerability"]  # Missing: "compliance", "privacy"
"writing": ["content", "write", "copy"]  # Missing: "documentation", "guide"
"ads": ["marketing", "advertis", "campaign"]  # Missing: "growth", "promotion"
```

**Fix:** Expand keyword mapping + add LLM fallback for complex tasks

**Priority:** Low (current behavior acceptable, enhancement for Phase 2)

**Timeline:** 3 hours (keyword expansion + LLM integration + testing)

---

### Issue #8: No Performance Metrics Export
**Severity:** P3 OBSERVABILITY
**File:** `infrastructure/orchestration/swarm_coordinator.py`
**Lines:** 523-558
**Component:** `_track_team_performance()`

**Problem:**
Performance is tracked but never exported to observability system.

```python
def _track_team_performance(self, team: List[str], result: TeamExecutionResult):
    team_hash = "_".join(sorted(team))
    # ... performance calculation ...
    self.team_performance[team_hash] = new_perf
    # Missing: send to OTEL/Prometheus
```

**Impact:**
- Can't monitor team performance in production dashboards
- No alerting on poor-performing teams
- Can't analyze team evolution trends
- Missed opportunity for cost optimization

**Fix:** Export as OTEL metrics
```python
def _track_team_performance(self, team: List[str], result: TeamExecutionResult):
    team_hash = "_".join(sorted(team))

    # Calculate performance
    if result.status == "completed":
        performance = 1.0
    elif result.status == "partial":
        performance = 0.5
    else:
        performance = 0.0

    # Update rolling average
    if team_hash in self.team_performance:
        alpha = 0.3
        self.team_performance[team_hash] = (
            alpha * performance +
            (1 - alpha) * self.team_performance[team_hash]
        )
    else:
        self.team_performance[team_hash] = performance

    # Export metrics to observability
    from infrastructure.observability import metrics

    metrics.histogram(
        "swarm.team_performance",
        self.team_performance[team_hash],
        attributes={
            "team": team_hash,
            "team_size": len(team),
            "execution_status": result.status
        }
    )

    metrics.counter(
        "swarm.team_execution",
        1,
        attributes={
            "team": team_hash,
            "status": result.status
        }
    )
```

**Priority:** Low (nice-to-have, not blocking)

**Timeline:** 2 hours

---

## LOW PRIORITY P4 ISSUES

### Issue #9: Unused halo_router Variable
**Severity:** P4 MINOR
**File:** `infrastructure/orchestration/swarm_coordinator.py`
**Line:** 77
**Component:** Constructor

**Problem:**
```python
self.halo_router = halo_router  # Initialized but not used!
```

Will be used once Issue #1 is fixed.

**Status:** Not a problem once HALO integration is completed.

---

### Issue #10: Missing Edge Case in Cooperation Score
**Severity:** P4 MINOR
**File:** `infrastructure/swarm/swarm_halo_bridge.py`
**Lines:** 271-289
**Component:** `get_team_cooperation_score()`

**Problem:**
Empty team returns 1.0 (perfect cooperation), which is semantically wrong.

```python
def get_team_cooperation_score(self, agent_names: List[str]) -> float:
    agents = [a for a in self.swarm_agents if a.name in agent_names]
    if len(agents) < 2:
        return 1.0  # BUG: empty team should be 0.0 or raise error
```

**Impact:** Minimal - tests check for this and pass anyway

**Fix:**
```python
def get_team_cooperation_score(self, agent_names: List[str]) -> float:
    agents = [a for a in self.swarm_agents if a.name in agent_names]

    if len(agents) == 0:
        return 0.0  # No agents = no cooperation
    if len(agents) == 1:
        return 1.0  # Single agent = perfect self-cooperation

    # ... rest of calculation ...
```

**Timeline:** 15 minutes

---

## TESTING GAPS

### Gap #1: No Real HALO Router Integration Test
**Severity:** CRITICAL for testing
**File:** `tests/integration/test_swarm_halo_integration.py`

**Current State:**
- 23 integration tests
- All test with mocked SwarmCoordinator
- No test of real HALO router interaction

**Required Test:**
```python
@pytest.mark.asyncio
async def test_swarm_uses_real_halo_router(swarm_coordinator, sample_task):
    """Verify swarm coordinator actually uses HALO router"""
    team = ["qa_agent", "builder_agent", "deploy_agent"]

    # This should call real HALO router, not mock
    assignments = await swarm_coordinator.route_to_team(sample_task, team)

    # Verify HALO routing was used (not direct assignment)
    # Can verify by checking that assignments respect HALO rules
    assert all(agent in team for agent in assignments.keys())

    # Add spying/mocking to verify router.route_tasks was called
    with patch.object(swarm_coordinator.halo_router, 'route_tasks') as mock_route:
        mock_route.return_value = RoutingPlan(...)
        await swarm_coordinator.route_to_team(sample_task, team)
        mock_route.assert_called_once()
```

**Timeline:** 2 hours to write comprehensive integration tests

---

## SUMMARY OF ISSUES

| ID | Severity | Title | Status | Timeline | Blocking |
|----|----------|-------|--------|----------|----------|
| #1 | P1 | HALO Router Not Integrated | MUST FIX | 1h | YES |
| #2 | P1 | Missing Timeout in Async | MUST FIX | 0.5h | YES |
| #3 | P1 | No Error Handling in Async | MUST FIX | 1h | YES |
| #4 | P2 | Team Evolution is Placeholder | SHOULD FIX | 2h | NO |
| #5 | P2 | Execution History Unbounded | SHOULD FIX | 0.5h | NO |
| #6 | P2 | Hardcoded Configuration | SHOULD FIX | 2h | NO |
| #7 | P3 | Requirement Inference Too Simple | NICE | 3h | NO |
| #8 | P3 | No Performance Metrics Export | NICE | 2h | NO |
| #9 | P4 | Unused halo_router Variable | MINOR | - | NO |
| #10 | P4 | Edge Case in Cooperation Score | MINOR | 0.25h | NO |

**Total Time to Fix P1 Issues:** 2.5 hours
**Total Time to Fix All Issues:** 13.75 hours

---

## DEPLOYMENT RECOMMENDATIONS

### Current Status: NOT READY
- P1 blockers must be fixed
- Cannot deploy to production with HALO router bypassed

### After P1 Fixes: READY FOR STAGING
- Can deploy to staging for E2E testing
- Alex to validate with real HALO routing

### After P1+P2 Fixes: READY FOR PRODUCTION
- Can deploy to production with confidence
- Feature flag can be fully enabled

### Suggested Timeline:
1. **Today (Nov 2):** Cora fixes P1 issues (2.5h)
2. **Today:** Hudson re-audits (30 min)
3. **Today:** Alex E2E tests (1h)
4. **Day 2 (Nov 3):** Deploy to staging (2h validation)
5. **Day 3 (Nov 4):** Production deployment via Phase 4 rollout (7-day progressive)

---

**Report Generated:** November 2, 2025
**Next Step:** Cora to begin P1 fixes
