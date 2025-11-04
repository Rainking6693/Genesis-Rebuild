# Vertex AI Integration - Detailed Issue Breakdown with Fixes

## Test Failure Analysis

Run at: 2025-11-04 14:18:22 UTC
Total Tests: 96
Pass: 6 (6.25%)
Fail: 23 (23.96%)
Errors: 67 (69.79%)

---

## ISSUE #1: monitoring_v3 Import/Export (25 test errors)

### Affected Tests (all 25 monitoring tests):
test_collect_performance_metrics_success, test_collect_performance_metrics_latency, test_collect_performance_metrics_throughput, test_calculate_cost_metrics_monthly, test_calculate_cost_metrics_by_model, test_collect_quality_metrics_success, test_collect_quality_metrics_accuracy, test_collect_quality_metrics_drift_detection, test_check_alerts_success, + 16 more

### Error Message:
```
AttributeError: <module 'infrastructure.vertex_ai.monitoring'> does not have the attribute 'monitoring_v3'
```

### Root Cause:
Tests do: `from infrastructure.vertex_ai import monitoring`
Then try: `monitoring.monitoring_v3`
But monitoring_v3 is imported inside try/except and not exposed.

### Fix: Add to __all__ in monitoring.py (after imports)
```python
try:
    from google.cloud import monitoring_v3
    from google.cloud.aiplatform import Model, Endpoint
    VERTEX_AI_AVAILABLE = True
except ImportError:
    VERTEX_AI_AVAILABLE = False
    logging.warning("Vertex AI SDK not available")

__all__ = ['monitoring_v3', 'VertexAIMonitoring', 'MetricType', 'AlertSeverity', 'ModelMetrics', 'CostMetrics', 'QualityMetrics', 'AlertRule']
```

---

## ISSUE #2: EndpointConfig Parameter Mismatch (10+ test errors)

### Affected Tests:
test_create_endpoint_success, test_deploy_model_success, test_deploy_model_with_autoscaling, test_predict_success, test_predict_batch, test_update_traffic_split_ab_testing, test_update_traffic_split_gradual_rollout, test_undeploy_model, test_delete_endpoint, test_list_endpoints, test_list_endpoints_with_filters, test_get_endpoint_stats, test_endpoint_config_initialization, test_predict_with_custom_parameters, test_create_endpoint_with_network

### Error:
```
TypeError: EndpointConfig.__init__() got an unexpected keyword argument 'name'
TypeError: EndpointConfig.__init__() got an unexpected keyword argument 'enable_request_logging'
```

### Current Code:
```python
@dataclass
class EndpointConfig:
    endpoint_name: str  # Test expects: name
    display_name: str
    description: str = ""
    machine_type: str = "n1-standard-4"
    accelerator_type: Optional[str] = None
    accelerator_count: int = 0
    auto_scaling: AutoScalingConfig = field(default_factory=AutoScalingConfig)
    traffic_split: Optional[TrafficSplit] = None
    enable_access_logging: bool = True  # Test expects: enable_request_logging (MISSING)
    enable_container_logging: bool = True
    dedicated_endpoint: bool = False
    spot_instance: bool = False
    labels: Dict[str, str] = field(default_factory=dict)
```

### Test Fixture:
```python
@pytest.fixture
def sample_endpoint_config():
    return EndpointConfig(
        name="test-endpoint",  # Code has: endpoint_name
        display_name="Test Endpoint",
        enable_request_logging=True,  # Not in code
        enable_access_logging=True
    )
```

### Fix: Update Dataclass Definition
In model_endpoints.py, update EndpointConfig:
```python
@dataclass
class EndpointConfig:
    name: str  # Changed from endpoint_name
    display_name: str
    description: str = ""
    machine_type: str = "n1-standard-4"
    accelerator_type: Optional[str] = None
    accelerator_count: int = 0
    auto_scaling: AutoScalingConfig = field(default_factory=AutoScalingConfig)
    traffic_split: Optional[TrafficSplit] = None
    enable_request_logging: bool = True  # New field
    enable_access_logging: bool = True  # Keep for compatibility
    enable_container_logging: bool = True
    dedicated_endpoint: bool = False
    spot_instance: bool = False
    labels: Dict[str, str] = field(default_factory=dict)

    def validate(self):
        """Validate endpoint configuration."""
        if not self.name:
            raise ValueError("name required")
        # ... rest of validation
```

---

## ISSUE #3: TrafficSplit Parameter Mismatch (5 test errors)

### Affected Tests:
test_traffic_split_initialization, test_update_traffic_split_ab_testing, test_update_traffic_split_gradual_rollout (+ 2 more)

### Error:
```
TypeError: TrafficSplit.__init__() got an unexpected keyword argument 'splits'
```

### Current Code:
```python
@dataclass
class TrafficSplit:
    deployed_model_ids: Dict[str, int] = field(default_factory=dict)  # Test expects: splits
    strategy: TrafficSplitStrategy = TrafficSplitStrategy.SINGLE
```

### Test Usage:
```python
traffic_split = TrafficSplit(
    strategy=TrafficSplitStrategy.CANARY,
    splits={"old_deployed_id": 90, "new_id": 10}  # Parameter name mismatch
)
```

### Fix: Rename Parameter
```python
@dataclass
class TrafficSplit:
    splits: Dict[str, int] = field(default_factory=dict)  # Changed from deployed_model_ids
    strategy: TrafficSplitStrategy = TrafficSplitStrategy.SINGLE

    def validate(self):
        """Validate traffic split."""
        if not self.splits:
            raise ValueError("splits cannot be empty")
        total = sum(self.splits.values())
        if total != 100:
            raise ValueError(f"Traffic percentages must sum to 100, got {total}")
```

Then update all references to `deployed_model_ids` in ModelEndpoints class to use `splits`.

---

## ISSUE #4: TrafficSplitStrategy Enum Missing Values (1 test failure)

### Affected Test:
test_traffic_split_strategy_enum

### Error:
```
AttributeError: type object 'TrafficSplitStrategy' has no attribute 'BLUE_GREEN'
```

### Test Expectations:
```python
def test_traffic_split_strategy_enum():
    assert TrafficSplitStrategy.SINGLE.value == "single"
    assert TrafficSplitStrategy.CANARY.value == "canary"
    assert TrafficSplitStrategy.GRADUAL.value == "gradual"  # Code has GRADUAL_ROLLOUT
    assert TrafficSplitStrategy.BLUE_GREEN.value == "blue_green"  # Missing
```

### Current Code:
```python
class TrafficSplitStrategy(Enum):
    SINGLE = "single"
    CANARY = "canary"
    AB_TEST = "ab_test"
    GRADUAL_ROLLOUT = "gradual"  # Wrong name (should be GRADUAL)
```

### Fix: Update Enum
```python
class TrafficSplitStrategy(Enum):
    SINGLE = "single"
    CANARY = "canary"
    AB_TEST = "ab_test"
    GRADUAL = "gradual"  # Changed from GRADUAL_ROLLOUT
    BLUE_GREEN = "blue_green"  # New value

    # Optional backward compatibility alias
    GRADUAL_ROLLOUT = "gradual"
```

---

## ISSUE #5: TuningJobConfig Missing 'name' Parameter (8 test errors)

### Affected Tests:
test_submit_tuning_job_supervised, test_submit_tuning_job_rlhf, test_submit_tuning_job_distillation, test_submit_tuning_job_parameter_efficient, test_tuning_job_config_initialization, test_tuning_with_custom_hyperparameters, test_register_tuned_model_success, test_register_tuned_model_with_metadata

### Error:
```
TypeError: TuningJobConfig.__init__() got an unexpected keyword argument 'name'
```

### Test Usage:
```python
config = TuningJobConfig(
    name="test-tuning-job",  # Missing in code
    tuning_type=TuningType.SUPERVISED,
    base_model="gemini-1.5-pro",
    training_dataset=TrainingDataset(...),
    hyperparameters=HyperparameterConfig(...)
)
```

### Fix: Add 'name' Parameter to TuningJobConfig
In fine_tuning_pipeline.py:
```python
@dataclass
class TuningJobConfig:
    name: str  # NEW FIELD - job name identifier
    tuning_type: TuningType
    base_model: str
    training_dataset: TrainingDataset
    hyperparameters: HyperparameterConfig = field(default_factory=HyperparameterConfig)
    # ... rest of existing fields
```

---

## ISSUE #6: TuningJobResult Missing 'job_id' Parameter (1 test failure)

### Affected Test:
test_tuning_job_result_initialization

### Error:
```
TypeError: TuningJobResult.__init__() got an unexpected keyword argument 'job_id'
```

### Test Usage:
```python
result = TuningJobResult(
    job_id="job-123",  # Missing in code
    status=TuningJobStatus.SUCCEEDED,
    # ... other fields
)
```

### Fix: Add 'job_id' Parameter to TuningJobResult
In fine_tuning_pipeline.py:
```python
@dataclass
class TuningJobResult:
    job_id: str  # NEW FIELD - Vertex AI job identifier
    status: TuningJobStatus
    # ... rest of existing fields
```

---

## ISSUE #7: FineTuningPipeline.prepare_se_darwin_dataset() Missing Parameter (2 test failures)

### Affected Tests:
test_prepare_se_darwin_dataset_success, test_prepare_se_darwin_dataset_filtering

### Error:
```
TypeError: FineTuningPipeline.prepare_se_darwin_dataset() got an unexpected keyword argument 'min_test_pass_rate'
```

### Test Usage:
```python
dataset = await pipeline.prepare_se_darwin_dataset(
    trajectory_data=trajectory_data,
    min_test_pass_rate=0.8,  # Missing parameter
    max_trajectories=100
)
```

### Fix: Update Method Signature
In fine_tuning_pipeline.py, update the prepare_se_darwin_dataset method:
```python
async def prepare_se_darwin_dataset(
    self,
    trajectory_data: Dict[str, Any],
    min_test_pass_rate: float = 0.7,  # NEW PARAMETER
    max_trajectories: Optional[int] = None
) -> TrainingDataset:
    """Prepare dataset from SE-Darwin evolution trajectories.

    Args:
        trajectory_data: Evolution trajectories from SE-Darwin
        min_test_pass_rate: Minimum test pass rate to include trajectory (0-1)
        max_trajectories: Maximum number of trajectories to use

    Returns:
        TrainingDataset ready for fine-tuning
    """
    # ... implementation
```

---

## ISSUE #8: Model Registry Google Cloud API Failures (10 test failures)

### Affected Tests:
test_upload_model_success, test_upload_model_with_parent_version, test_get_model_success, test_list_models_filtered, test_promote_model, test_update_performance_metrics, test_update_cost_metrics, test_delete_model, test_compare_versions, test_concurrent_model_access

### Error:
```
RuntimeError: Model resource has not been created.
    self = <google.cloud.aiplatform.models.Model object> is waiting for upstream dependencies
```

### Root Cause:
Tests instantiate real Google Cloud aiplatform.Model objects which require:
1. Valid GCP credentials
2. Existing model in Vertex AI
3. Completed asynchronous resource creation

Tests try to access `model.resource_name` on objects that don't exist.

### Location:
model_registry.py line ~346:
```python
metadata.vertex_ai_resource_name = model.resource_name  # <-- Fails
```

### Fix: Mock Google Cloud Objects (Recommended for Unit Tests)
Update test fixtures to mock responses. Add to test_model_registry.py:

```python
import pytest
from unittest.mock import MagicMock, AsyncMock, patch

@pytest.fixture
def mock_vertex_model():
    """Mock Google Cloud Model object"""
    model = MagicMock()
    model.resource_name = "projects/123/locations/us-central1/models/abc123"
    model.display_name = "Test Model"
    model.create_version = AsyncMock(return_value="v1.0.0")
    model.update = MagicMock()
    model.delete = MagicMock()
    return model

@pytest.fixture
def mock_aiplatform(mocker, mock_vertex_model):
    """Mock aiplatform module"""
    mock = mocker.patch('infrastructure.vertex_ai.model_registry.aiplatform')
    mock.init = MagicMock()
    mock.Model = MagicMock(return_value=mock_vertex_model)
    mock.Model.list = MagicMock(return_value=[mock_vertex_model])
    return mock

@pytest.fixture
def model_registry(mock_aiplatform):
    """ModelRegistry with mocked Vertex AI"""
    registry = ModelRegistry(project_id="test-project", location="us-central1")
    return registry

# Then in tests:
async def test_upload_model_success(model_registry):
    """Test model upload"""
    metadata = ModelMetadata(...)
    result = await model_registry.upload_model(metadata)
    assert result.vertex_ai_resource_name == "projects/123/locations/us-central1/models/abc123"
```

---

## Summary Table: All Issues

| ID | Component | Issue | Type | Tests | Fix Time | Priority |
|----|-----------|-------|------|-------|----------|----------|
| 1 | monitoring.py | monitoring_v3 not exported | Import | 25 | 15 min | CRITICAL |
| 2 | model_endpoints.py | EndpointConfig param names | Dataclass | 10 | 30 min | CRITICAL |
| 3 | model_endpoints.py | TrafficSplit param names | Dataclass | 5 | 15 min | HIGH |
| 4 | model_endpoints.py | TrafficSplitStrategy enum | Enum | 1 | 10 min | MEDIUM |
| 5 | fine_tuning_pipeline.py | TuningJobConfig missing 'name' | Dataclass | 8 | 20 min | CRITICAL |
| 6 | fine_tuning_pipeline.py | TuningJobResult missing 'job_id' | Dataclass | 1 | 10 min | MEDIUM |
| 7 | fine_tuning_pipeline.py | prepare_se_darwin_dataset param | Method | 2 | 10 min | MEDIUM |
| 8 | model_registry.py | Google Cloud API mocking | Testing | 10 | 60 min | HIGH |

**Total Estimated Fix Time:** 2.5 hours
**Expected Pass Rate After Fixes:** 90%+ (86-96 tests)
**Expected Coverage After Fixes:** >80%

---

## Implementation Checklist

- [ ] Issue 1: Add __all__ to monitoring.py (15 min)
- [ ] Issue 2: Update EndpointConfig dataclass (30 min)
- [ ] Issue 3: Rename TrafficSplit.deployed_model_ids to splits (15 min)
- [ ] Issue 4: Add BLUE_GREEN and GRADUAL to enum (10 min)
- [ ] Issue 5: Add 'name' parameter to TuningJobConfig (20 min)
- [ ] Issue 6: Add 'job_id' parameter to TuningJobResult (10 min)
- [ ] Issue 7: Add min_test_pass_rate to method signature (10 min)
- [ ] Issue 8: Add mock fixtures for Google Cloud (60 min)
- [ ] Re-run tests: `pytest tests/vertex/ -v` (30 min)
- [ ] Verify coverage: >80% across all modules
- [ ] Resume E2E validation with Forge

Total implementation time: 3 hours including testing

---

**Report Prepared By:** Forge (E2E Testing Agent)
**Date:** November 4, 2025
**Status:** BLOCKERS IDENTIFIED - Awaiting Implementation Fixes
