# CRITICAL: SwarmHALOBridge Initialization Bug

**Priority:** P0 (BLOCKER)
**Impact:** 21 tests blocked (18 existing + 3 new)
**Time to Fix:** 4-6 hours
**Assigned:** Cora (swarm infrastructure owner)

---

## Problem

`SwarmHALOBridge.__init__` has an **initialization order bug**:

```python
# CURRENT CODE (BROKEN)
def __init__(self, agent_profiles, n_particles=50, max_iterations=100, random_seed=None):
    # Line 132: Calls _convert_to_swarm_agents FIRST
    self.swarm_agents = self._convert_to_swarm_agents(agent_profiles)

    # Line 135: Initializes fitness_audit SECOND
    self.fitness_audit = FitnessAuditLog()
    # ...

def _convert_to_swarm_agents(self, profiles):
    # Line 182: USES self.fitness_audit (but it doesn't exist yet!)
    self.fitness_audit.log_update(...)
    # AttributeError: 'SwarmHALOBridge' object has no attribute 'fitness_audit'
```

---

## Solution

**Fix:** Move `self.fitness_audit` initialization BEFORE `_convert_to_swarm_agents` call.

```python
# FIXED CODE
def __init__(self, agent_profiles, n_particles=50, max_iterations=100, random_seed=None):
    """
    Initialize Swarm-HALO Bridge

    Args:
        agent_profiles: List of agent profiles from HALO registry
        n_particles: Number of PSO particles
        max_iterations: Maximum PSO iterations
        random_seed: Random seed for reproducibility
    """
    # FIX: Initialize fitness_audit FIRST
    self.fitness_audit = FitnessAuditLog()

    # NOW safe to convert (uses self.fitness_audit)
    self.swarm_agents = self._convert_to_swarm_agents(agent_profiles)

    # Create swarm
    self.swarm = get_inclusive_fitness_swarm(self.swarm_agents, random_seed=random_seed)

    # Create PSO optimizer
    self.pso = get_pso_optimizer(
        self.swarm,
        n_particles=n_particles,
        max_iterations=max_iterations,
        random_seed=random_seed
    )

    logger.info(
        f"SwarmHALOBridge initialized with {len(self.swarm_agents)} agents, "
        f"{n_particles} particles, {max_iterations} iterations"
    )
```

---

## Impact

### Tests Affected

**Existing Tests (18 blocked):**
- `test_swarm_halo_bridge.py::TestAgentProfileConversion::*` (4 tests)
- `test_swarm_halo_bridge.py::TestTeamOptimization::*` (3 tests)
- `test_swarm_halo_bridge.py::TestGenotypeDiversity::*` (4 tests)
- `test_swarm_halo_bridge.py::TestCooperationScore::*` (4 tests)
- `test_swarm_halo_bridge.py::TestFactoryFunction::*` (2 tests)
- `test_swarm_halo_bridge.py::TestIntegration::*` (2 tests)

**New Tests (3 blocked):**
- `test_team_evolution.py::test_team_generation_business_types`
- `test_team_evolution.py::test_performance_benchmark_latency`
- `test_edge_cases.py::test_edge_swarm_bridge_single_profile`

**Total:** 21 tests blocked

### Expected Results After Fix

**Before Fix:**
- `test_swarm_halo_bridge.py`: 0/18 passing (0%)
- `test_team_evolution.py`: 13/15 passing (86.7%)
- `test_edge_cases.py`: 18/20 passing (90.0%)
- **Total:** 31/53 passing (58.5%)

**After Fix:**
- `test_swarm_halo_bridge.py`: 18/18 passing (100%)
- `test_team_evolution.py`: 15/15 passing (100%)
- `test_edge_cases.py`: 18/20 passing (90.0%) - 1 separate test design issue
- **Total:** 51/53 passing (96.2%)

---

## Testing

After applying fix, run:

```bash
# Test SwarmHALOBridge
python -m pytest tests/swarm/test_swarm_halo_bridge.py -v

# Test team evolution
python -m pytest tests/swarm/test_team_evolution.py -v

# Test edge cases
python -m pytest tests/swarm/test_edge_cases.py -v

# All swarm tests
python -m pytest tests/swarm/ -v
```

**Expected:** 51/53 passing (96.2%)

---

## Root Cause Analysis

**When Introduced:** Commit 53b5d777 ("Swarm Optimization Complete - Inclusive Fitness + HALO Integration")

**Why It Wasn't Caught:**
1. Existing tests may have been passing before (fitness_audit usage may have been added later)
2. `create_swarm_halo_bridge()` factory function may have worked around the issue
3. Integration tests may not have exercised this code path

**Why Augment's Tests Exposed It:**
- Augment's tests use `create_swarm_halo_bridge()` factory function extensively
- Factory function creates SwarmHALOBridge instances directly
- High test coverage triggered the bug

---

## Verification Checklist

After applying fix:

- [ ] All 18 existing `test_swarm_halo_bridge.py` tests pass
- [ ] `test_team_generation_business_types` passes
- [ ] `test_performance_benchmark_latency` passes
- [ ] `test_edge_swarm_bridge_single_profile` passes
- [ ] No new test failures introduced
- [ ] `pytest tests/swarm/ -v` shows 51/53 passing (96.2%)

---

## Timeline

**Estimated Fix Time:** 4-6 hours (including testing)

1. Apply fix (30 min)
2. Run all swarm tests (15 min)
3. Fix any regressions (2-3 hours)
4. Full regression testing (1-2 hours)
5. Update audit report (30 min)

---

**Priority:** P0 BLOCKER
**Assigned:** Cora
**Deadline:** Before Phase 4 production deployment
**Tracked In:** Hudson Audit (HUDSON_AUDIT_AUGMENT_SWARM_TESTING.md)
