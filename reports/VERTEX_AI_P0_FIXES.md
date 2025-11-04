# Vertex AI P0 Blockers - Fix Guide

**Date:** November 4, 2025
**Status:** BLOCKING PRODUCTION
**Required By:** Before staging validation

---

## P0 Blocker 1: Import Errors

### Problem
The vertex_ai modules import observability functions that don't exist.

### Current Code (BROKEN)
```python
# infrastructure/vertex_ai/model_registry.py:40-41
from infrastructure.observability import get_tracer, trace_operation  # ❌ DOES NOT EXIST

logger = logging.getLogger("vertex_ai.model_registry")
tracer = get_tracer("vertex_ai.model_registry")  # ❌ THIS WILL CRASH

# Usage:
@trace_operation("model_registry.upload_model")  # ❌ NOT A DECORATOR
def upload_model(self, ...):
    ...
```

### What Actually Exists
```bash
$ grep "^def " infrastructure/observability.py
traced_operation  # This is what exists (NOT trace_operation)
get_observability_manager()  # This is what exists (NOT get_tracer)
```

### Solution

**Option A: Remove the tracer variable (Quick Fix)**
```python
# infrastructure/vertex_ai/model_registry.py:40-41
import logging
from infrastructure.observability import traced_operation

logger = logging.getLogger("vertex_ai.model_registry")
# Remove this line: tracer = get_tracer("vertex_ai.model_registry")
```

**Option B: Use the correct observability API (Proper Fix)**
```python
# infrastructure/vertex_ai/model_registry.py:40-41
import logging
from infrastructure.observability import get_observability_manager, traced_operation

logger = logging.getLogger("vertex_ai.model_registry")
observability = get_observability_manager()

# Keep @traced_operation decorator, it works
@traced_operation("model_registry.upload_model")
def upload_model(self, ...):
    ...
```

### Files to Fix (32 occurrences total)

| File | Lines | Occurrences | Fix Type |
|------|-------|-------------|----------|
| model_registry.py | 41, 44, 250, 365 | 4 | Import + Remove tracer |
| model_endpoints.py | 41, 45, 241, 307, 392, 460, 509, 549, 587, 630 | 10 | Import + Remove tracer |
| fine_tuning_pipeline.py | 40, 49, 356, 473, 581, 844 | 6 | Import + Remove tracer |
| monitoring.py | Similar | ~12 | Import + Remove tracer |

### Implementation Steps

1. **Fix model_registry.py:**
```bash
cd /home/genesis/genesis-rebuild
# Replace lines 40-41
sed -i '40,41d' infrastructure/vertex_ai/model_registry.py
sed -i '39a import logging\nfrom infrastructure.observability import traced_operation' infrastructure/vertex_ai/model_registry.py
# Remove line 44: tracer = get_tracer(...)
sed -i '/^tracer = get_tracer/d' infrastructure/vertex_ai/model_registry.py
```

2. **Repeat for other 3 files**

3. **Verify imports work:**
```bash
python -c "from infrastructure.vertex_ai import ModelRegistry; print('✅ ModelRegistry imports')"
python -c "from infrastructure.vertex_ai import ModelEndpoints; print('✅ ModelEndpoints imports')"
python -c "from infrastructure.vertex_ai import FineTuningPipeline; print('✅ FineTuningPipeline imports')"
python -c "from infrastructure.vertex_ai import VertexAIMonitoring; print('✅ VertexAIMonitoring imports')"
```

4. **Run tests to verify no regression:**
```bash
python -m pytest tests/vertex/test_vertex_integration.py -v
```

---

## P0 Blocker 2: Test Coverage

### Problem
Only 4 tests exist for 3,981 lines of code (2.4% coverage).
Audit Protocol V2 requires minimum 5 tests per module.

### Required Tests

#### 1. tests/vertex/test_vertex_client.py (NEW FILE)
Need 5 tests minimum:
```python
def test_vertex_client_imports():
    """Verify vertex_client module imports."""
    from infrastructure.vertex_client import ask_agent
    assert callable(ask_agent)

def test_ask_agent_fallback_when_env_missing():
    """Test fallback when GENESIS_QA_MODEL env var is missing."""
    # Mock os.getenv to return None for tuned model
    # Verify it falls back to base model

def test_ask_agent_with_tuned_model():
    """Test when tuned model is configured."""
    # Mock GenerativeModel to return response
    # Verify tuned model is used

def test_ask_agent_with_empty_response():
    """Test handling of empty responses."""
    # Mock GenerativeModel to return empty response
    # Verify proper fallback

def test_role_model_resolution():
    """Test _resolve_model_name function."""
    # Test all 6 roles map to correct models
```

#### 2. tests/vertex/test_fine_tuning_pipeline.py (NEW FILE)
Need 5+ tests:
```python
def test_fine_tuning_pipeline_initialization():
    """Verify pipeline initializes in mock mode."""

def test_tuning_dataset_validation():
    """Verify dataset validation catches invalid GCS paths."""

def test_training_dataset_config_validation():
    """Test TrainingDataset.validate() method."""

def test_tuning_job_status_enum():
    """Verify all TuningJobStatus enum values."""

def test_tuning_type_enum():
    """Verify all TuningType enum values."""
```

#### 3. tests/vertex/test_model_registry.py (NEW FILE)
Need 5+ tests:
```python
def test_model_registry_initialization():
    """Verify ModelRegistry initializes."""

def test_model_metadata_creation():
    """Verify ModelMetadata dataclass creation."""

def test_deployment_stage_enum():
    """Verify all DeploymentStage enum values."""

def test_model_source_enum():
    """Verify all ModelSource enum values."""

def test_model_versioning():
    """Test model version tracking."""
```

#### 4. tests/vertex/test_model_endpoints.py (NEW FILE)
Need 5+ tests:
```python
def test_model_endpoints_initialization():
    """Verify ModelEndpoints initializes."""

def test_endpoint_config_creation():
    """Verify EndpointConfig dataclass."""

def test_traffic_split_strategy_enum():
    """Verify TrafficSplitStrategy enum values."""

def test_auto_scaling_config():
    """Verify AutoScalingConfig dataclass."""

def test_endpoint_state_transitions():
    """Test valid endpoint state transitions."""
```

#### 5. tests/vertex/test_monitoring.py (NEW FILE)
Need 5+ tests:
```python
def test_monitoring_initialization():
    """Verify VertexAIMonitoring initializes."""

def test_model_metrics_creation():
    """Verify ModelMetrics dataclass creation."""

def test_cost_tracker_initialization():
    """Verify CostTracker initializes."""

def test_quality_monitor_initialization():
    """Verify QualityMonitor initializes."""

def test_metrics_recording():
    """Test recording of metrics."""
```

### Test Creation Timeline

**Estimated effort:** 8-12 hours
- Reading/understanding modules: 2-3 hours
- Writing test fixtures: 1-2 hours
- Writing test cases: 4-5 hours
- Running and fixing tests: 1-2 hours

**Assigned to:** Thon (test specialist)

### Minimum Viable Coverage

For urgent deployment, minimum targets (still falls short of 80%):

| Module | Lines | Min Tests | Status |
|--------|-------|-----------|--------|
| vertex_client.py | 85 | 3 | ❌ 0/3 |
| fine_tuning_pipeline.py | 910 | 5 | ❌ 0/5 |
| model_registry.py | 766 | 5 | ❌ 0/5 |
| model_endpoints.py | 705 | 5 | ❌ 0/5 |
| monitoring.py | 710 | 5 | ❌ 0/5 |
| **TOTAL** | **3,176** | **23** | **❌ 0/23** |

---

## Verification Steps

### Step 1: Fix Imports (2-4 hours)
```bash
# After fixing observability imports:
python -c "from infrastructure.vertex_ai import ModelRegistry, FineTuningPipeline, ModelEndpoints, VertexAIMonitoring"
echo "✅ All modules import successfully"
```

Expected output:
```
✅ All modules import successfully
```

### Step 2: Run Existing Tests (5 minutes)
```bash
python -m pytest tests/vertex/test_vertex_integration.py -v
```

Expected output:
```
======================== 4 passed in 3.08s =========================
```

### Step 3: Run Full Test Suite (After tests created)
```bash
python -m pytest tests/vertex/ -v --cov=infrastructure/vertex --cov-report=term-missing
```

Expected output:
```
======================== 30+ passed ========================
coverage: 50%+ of vertex_ai modules
```

### Step 4: Security Check
```bash
# Verify no hardcoded secrets introduced
grep -r "password\|secret\|api_key" tests/vertex/ || echo "✅ No secrets found"

# Verify environment variables used correctly
grep -r "os.getenv\|environ" tests/vertex/ | wc -l
```

---

## Audit Re-Run Criteria

After fixes applied, Hudson will re-audit and approve IF:

1. ✅ All vertex_ai modules import without error
2. ✅ All existing tests still pass (4/4)
3. ✅ New test suite created (23+ tests)
4. ✅ Test pass rate: 100%
5. ✅ Code coverage: >50% minimum (target: >80%)
6. ✅ No P0 blockers remain

---

## Timeline

```
T+0h: Start (NOW)
  ├─ Fix observability imports (2-4 hours)
  │   └─ Estimated completion: T+4h
  │
T+4h: Imports fixed
  ├─ Create test files (8-12 hours)
  │   └─ Estimated completion: T+12h
  │
T+12h: Tests created & passing
  ├─ Hudson re-audit (1-2 hours)
  │   └─ Estimated completion: T+13h
  │
T+13h: Re-audit complete
  └─ IF PASS: Ready for staging validation ✅
     IF FAIL: Iterate on P2 issues
```

**Estimated Total:** 13 hours of work
**Target Completion:** November 5, 2025 (next business day)

---

## Contact & Escalation

**Question about imports?**
- Check: infrastructure/observability.py for available functions
- Call: get_observability_manager() not get_tracer()
- Decorator: @traced_operation() not @trace_operation()

**Need help with tests?**
- Reference: tests/vertex/test_vertex_integration.py (existing tests)
- Pattern: Use pytest fixtures for setup
- Mock: Use unittest.mock for Google Cloud dependencies

**Blocked?**
- Slack: #genesis-rebuild channel
- Escalation: Hudson (audit authority) or Cora (orchestration)
- Timeline: 2-hour SLA for blocker resolution

---

**Report Generated:** November 4, 2025
**Severity:** P0 (PRODUCTION BLOCKING)
**Owner:** Nova (imports), Thon (tests)
