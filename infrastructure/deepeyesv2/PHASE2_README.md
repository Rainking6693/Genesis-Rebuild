# DeepEyesV2 Phase 2: Cold-Start Supervised Fine-Tuning

## Quick Start

```python
import asyncio
from infrastructure.deepeyesv2 import run_deepeyesv2_sft

# Run complete SFT pipeline from baseline data
results = await run_deepeyesv2_sft(
    baseline_tracker,  # From Phase 1
    quality_threshold=0.90,
    output_dir=Path("logs/deepeyesv2/sft")
)

print(f"Training examples: {results['training_examples_count']}")
print(f"Improvement: {results['evaluation']['improvement_pct']:.1f}%")
print(f"Ready for RL: {results['evaluation']['readiness_for_rl']}")
```

## What is Phase 2?

Phase 2 takes the tool reliability baseline from Phase 1 and creates a supervised fine-tuning (SFT) dataset to teach the language model how to invoke tools correctly. This improves tool invocation accuracy by 15-20% before RL refinement.

**Input**: Tool invocations from Phase 1 (100+ diverse invocations)
**Output**: SFT dataset (1000+ training examples) + trained model
**Time**: ~5 minutes for typical baseline (async/parallel)

## Key Classes

### TrainingExample
Individual training example with task, tools, parameters, and expected result.

```python
example = TrainingExample(
    task_description="Query database and cache results",
    tool_sequence=["database_query", "cache_set"],
    tool_parameters=[
        {"operation": "select", "timeout_seconds": 5},
        {"ttl_seconds": 3600, "value_size_kb": 100}
    ],
    expected_result="Results cached successfully",
    success_label=True,
    agent_name="AnalyticsAgent",
)

# Convert to training format
training_fmt = example.to_training_format()
# -> {"task_id", "prompt", "completion", "metadata"}

# Validate before training
is_valid, errors = example.validate()
```

### TrajectoryCollector
Collects and filters tool invocation sequences from Phase 1.

```python
collector = TrajectoryCollector(quality_threshold=0.90)

# Collect all trajectories from baseline tracker
trajectories = await collector.collect_trajectories(tracker)

# Filter to high-quality trajectories
filtered = await collector.filter_quality()

# Generate training examples
examples = await collector.generate_training_examples()
```

### SFTDataset
Organizes examples into train/val/test splits with balancing.

```python
dataset = SFTDataset(
    training_examples=examples,
    train_ratio=0.70,
    val_ratio=0.15,
    test_ratio=0.15,
)

# Split and balance
splits = await dataset.split_data()
await dataset.balance_dataset()

# Export to JSONL
train_file = await dataset.export_jsonl("train")
all_files = await dataset.export_all_splits()

# Get statistics
stats = await dataset.get_dataset_stats()
```

### ColdStartTrainer
Orchestrates complete training pipeline.

```python
trainer = ColdStartTrainer()

# Prepare data from Phase 1
dataset = await trainer.prepare_training_data(baseline_tracker)

# Generate model prompts
prompts = await trainer.generate_prompts()

# Train model
results = await trainer.train_model(
    model_id="claude-3-5-haiku-20241022",
    epochs=3,
    batch_size=8,
)

# Evaluate improvement
evaluation = await trainer.evaluate_improvement()

# Generate report
report_file = await trainer.export_training_report()

# Or run full pipeline at once
results = await trainer.run_full_pipeline(baseline_tracker)
```

## Training Data Format

Each JSONL line is a training example:

```json
{
  "task_id": "task_1763225842956",
  "prompt": "Task: Query the database and cache results for future use\n\nRequired tool sequence:\n1. database_query({...})\n2. cache_set({...})\n\nExpected result: Successful database query cached in distributed cache\n\nBased on the task description and required tools, generate the correct tool invocation sequence.",
  "completion": "Tool Invocation Sequence:\n1. database_query({...})\n2. cache_set({...})\n\nSuccess: Yes\n\nConfidence: high",
  "metadata": {
    "tool_sequence": ["database_query", "cache_set"],
    "difficulty": "medium",
    "agent": "AnalyticsAgent",
    "success": true,
    "timestamp": "2025-11-15T16:57:22.955990+00:00"
  }
}
```

## Dataset Metrics

Typical dataset from 1350 Phase 1 invocations → 5442 SFT examples:

| Split | Count | Success Rate | Avg Length | Tools |
|-------|-------|--------------|------------|-------|
| Train | 3807  | 100.0%       | 2.3        | 18    |
| Val   | 815   | 100.0%       | 2.2        | 18    |
| Test  | 820   | 100.0%       | 2.1        | 18    |
| Total | 5442  | 100.0%       | 2.3        | 18    |

## Configuration

### TrajectoryCollector
- `quality_threshold` (0.90): Minimum success rate for trajectory inclusion
- `min_trajectory_length` (1): Minimum tools in a trajectory
- `max_trajectory_length` (5): Maximum tools in a trajectory

### SFTDataset
- `train_ratio` (0.70): Training set proportion
- `val_ratio` (0.15): Validation set proportion
- `test_ratio` (0.15): Test set proportion
- `random_seed` (42): For reproducibility

### ColdStartTrainer
- `model_id`: Model to fine-tune
- `epochs` (3): Training epochs
- `learning_rate` (0.001): Learning rate
- `batch_size` (8): Batch size
- `quality_threshold` (0.90): Trajectory quality threshold
- `min_examples` (100): Minimum examples required

## Output Files

```
logs/deepeyesv2/sft/
├── datasets/
│   ├── sft_train.jsonl      (70% of examples)
│   ├── sft_val.jsonl        (15% of examples)
│   └── sft_test.jsonl       (15% of examples)
└── training/
    └── training_report_*.json  (comprehensive metrics)
```

## Integration with Phase 1

```python
from infrastructure.deepeyesv2 import (
    BaselineTracker,
    run_deepeyesv2_baseline,
    run_deepeyesv2_sft,
)

# Phase 1: Baseline measurement
baseline_results = await run_deepeyesv2_baseline(
    invocations_per_tool=10,
    concurrent_tasks=5
)

# Phase 2: Cold-start SFT
sft_results = await run_deepeyesv2_sft(
    baseline_tracker=baseline_results['tracker'],
    quality_threshold=0.90
)

# Check readiness for Phase 3
if sft_results['evaluation']['readiness_for_rl']:
    print("Ready for RL refinement!")
```

## Performance Targets

- Training Examples: 1000+ from baseline
- Success Rate Improvement: 15-20% from SFT
- Tool Coverage: All tools in dataset
- Readiness Threshold: 85%+ post-training success rate
- Training Time: 5-10 minutes (async)

## Async/Await

All major methods are async for concurrent execution:

```python
# Collect trajectories asynchronously
trajectories = await collector.collect_trajectories(tracker)

# Train with async support
results = await trainer.train_model(epochs=3)

# Evaluate improvements
evaluation = await trainer.evaluate_improvement()
```

## Logging

Comprehensive logging throughout:

```python
import logging
logging.basicConfig(level=logging.INFO)

# Logs include:
# - Collection: "Collected 5442 total trajectories"
# - Filtering: "Filtered to 5442 high-quality trajectories"
# - Dataset: "Split: train=3807, val=815, test=820"
# - Training: "Epoch 1/3: loss=1.0000, accuracy=0.6000"
# - Evaluation: "Improvement: 92.89% -> 100.00% (7.11%)"
```

## Error Handling

Training examples are validated before inclusion:

```python
example = TrainingExample(...)
is_valid, errors = example.validate()

# Errors include:
# - "task_description too short or empty"
# - "tool_sequence cannot be empty"
# - "tool_sequence and tool_parameters length mismatch"
# - "expected_result too short or empty"
# - "invalid difficulty_level"
```

## Testing

Complete test suite in `tests/test_deepeyesv2_sft.py`:

```bash
# Run all Phase 2 tests
pytest tests/test_deepeyesv2_sft.py -v

# Run specific test class
pytest tests/test_deepeyesv2_sft.py::TestTrainingExample -v

# Run with coverage
pytest tests/test_deepeyesv2_sft.py --cov=infrastructure.deepeyesv2
```

## Common Tasks

### Generate training examples from Phase 1 data
```python
collector = TrajectoryCollector()
await collector.collect_trajectories(tracker)
await collector.filter_quality()
examples = await collector.generate_training_examples()
```

### Create balanced dataset splits
```python
dataset = SFTDataset(examples)
await dataset.split_data()
await dataset.balance_dataset()
```

### Export training data for model fine-tuning
```python
files = await dataset.export_all_splits()
print(files)  # {'train': Path(...), 'val': Path(...), 'test': Path(...)}
```

### Train and evaluate
```python
trainer = ColdStartTrainer()
await trainer.prepare_training_data(tracker)
results = await trainer.train_model(epochs=3)
evaluation = await trainer.evaluate_improvement()
print(f"Improvement: {evaluation['improvement_pct']:.1f}%")
```

### Run complete pipeline
```python
results = await trainer.run_full_pipeline(baseline_tracker)
print(f"Status: {results['status']}")
print(f"Examples: {results['training_examples_count']}")
print(f"Ready for RL: {results['evaluation']['readiness_for_rl']}")
```

## Troubleshooting

### Few training examples generated
- Ensure Phase 1 collected diverse invocations (100+)
- Lower `quality_threshold` if filtering too aggressively
- Check tool success rates in Phase 1 baseline

### Dataset imbalanced across tools
- SFTDataset.balance_dataset() handles this
- Check tool distribution with get_dataset_stats()
- May need more Phase 1 data for certain tools

### Training not improving
- Verify dataset has sufficient diversity
- Check for data quality issues in validation split
- Ensure prompts are well-formatted
- Review per-tool improvements in evaluation

## Next Phase

After Phase 2 completion and positive evaluation:
1. Export trained model from fine-tuning API
2. Set as baseline for Phase 3 RL refinement
3. Run RL training to optimize beyond supervised learning

## References

- **Paper**: arXiv:2511.05271 - DeepEyes
- **Phase 1**: Tool Baseline Measurement
- **Integration**: `/docs/DEEPEYESV2_PHASE2_INTEGRATION.md`
- **Summary**: `/docs/DEEPEYESV2_PHASE2_SUMMARY.md`
- **Examples**: `/examples/deepeyesv2_phase2_example.py`

## API Reference

Full API documentation in docstrings:

```python
from infrastructure.deepeyesv2 import (
    TrainingExample,      # SFT example with task/tools/results
    TrajectoryCollector,  # Collect/filter trajectories
    SFTDataset,          # Create/split/export datasets
    ColdStartTrainer,    # Orchestrate training pipeline
    run_deepeyesv2_sft,  # Convenience function
)
```

See module docstrings for complete parameter documentation.
