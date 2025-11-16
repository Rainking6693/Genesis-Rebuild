# DeepEyesV2 Phase 2 - Cold-Start Supervised Fine-Tuning Integration Guide

## Overview

DeepEyesV2 Phase 2 implements cold-start supervised fine-tuning (SFT) from arXiv:2511.05271. This phase takes successful tool invocation trajectories from Phase 1 baseline measurements and uses them to train the language model to invoke tools more reliably.

**Module**: `infrastructure/deepeyesv2/cold_start_sft.py`

## Architecture

The Phase 2 module consists of four main components:

### 1. TrainingExample (Dataclass)
Captures individual SFT training examples with:
- **Task description**: Natural language description of what needs to be done
- **Tool sequence**: List of tools to invoke in order
- **Tool parameters**: Parameters for each tool
- **Expected result**: Expected output of the sequence
- **Success label**: Boolean indicating if the trajectory succeeded
- **Difficulty level**: 'easy', 'medium', or 'hard' based on sequence length

Methods:
- `to_dict()`: Convert to dictionary format
- `to_training_format()`: Convert to Claude-compatible training format with prompt caching hints
- `validate()`: Validate example integrity and return errors
- `sequence_length`: Property returning number of tools in sequence

### 2. TrajectoryCollector (Class)
Collects and filters successful tool invocation trajectories from Phase 1 BaselineTracker.

Key features:
- Configurable quality threshold (default 90% success rate)
- Groups invocations by agent to form trajectories
- Generates natural language task descriptions
- Validates all examples before returning

Methods:
- `collect_trajectories(baseline_tracker)`: Collect all trajectories from baseline data
- `filter_quality()`: Keep only trajectories with high success rates
- `generate_training_examples()`: Create TrainingExample objects from trajectories

### 3. SFTDataset (Class)
Organizes training examples into train/val/test splits with dataset balancing.

Key features:
- Stratified split by difficulty level (70/15/15 default)
- Tool type balancing across splits
- JSONL export for model training
- Comprehensive dataset statistics

Methods:
- `split_data()`: Create train/val/test splits with stratification
- `balance_dataset()`: Balance tool type distribution across splits
- `export_jsonl(split)`: Export to JSONL format for model training
- `export_all_splits()`: Export all splits to separate JSONL files
- `get_dataset_stats()`: Compute comprehensive statistics

### 4. ColdStartTrainer (Class)
Orchestrates the complete SFT training pipeline.

Key features:
- Integrates with Phase 1 BaselineTracker
- Generates model-specific prompts for Anthropic API
- Tracks training metrics (loss, accuracy improvements)
- Evaluates improvement before RL phase
- Exports comprehensive training reports

Methods:
- `prepare_training_data()`: Load and prepare data from baseline tracker
- `generate_prompts()`: Create Claude-compatible training prompts
- `train_model()`: Run SFT training (calls Anthropic API in production)
- `evaluate_improvement()`: Measure tool success rate improvement
- `export_training_report()`: Generate comprehensive report
- `run_full_pipeline()`: Execute complete SFT pipeline

## Integration with Phase 1

### Phase 1 Output
BaselineTracker produces:
- List of ToolInvocation objects with metadata
- Per-tool success rates and statistics
- Error distributions and latency metrics

### Phase 2 Usage
```python
from infrastructure.deepeyesv2 import (
    BaselineTracker,
    run_deepeyesv2_baseline,
    run_deepeyesv2_sft,
)

# Phase 1: Run baseline measurement
baseline_results = await run_deepeyesv2_baseline(
    invocations_per_tool=10,
    concurrent_tasks=5
)

# Phase 2: Run cold-start SFT
sft_results = await run_deepeyesv2_sft(
    baseline_tracker=baseline_results['tracker'],
    quality_threshold=0.90
)
```

## Usage Examples

### Example 1: Simple Integration
```python
import asyncio
from pathlib import Path
from infrastructure.deepeyesv2 import (
    BaselineTracker,
    ToolInvocation,
    ToolStatus,
    ColdStartTrainer,
)

async def main():
    # Phase 1: Collect baseline data
    tracker = BaselineTracker(output_dir=Path("logs/deepeyesv2"))

    # Simulate some invocations
    for i in range(100):
        inv = ToolInvocation(
            tool_name="database_query",
            agent_name="Agent1",
            parameters={"query": f"SELECT * FROM table_{i}"},
            result={"rows": i},
            status=ToolStatus.SUCCESS if i % 10 != 0 else ToolStatus.FAILURE,
            latency_ms=50.0 + i,
        )
        tracker.record_invocation(inv)

    # Phase 2: Run SFT
    trainer = ColdStartTrainer(output_dir=Path("logs/sft"))
    dataset = await trainer.prepare_training_data(tracker)
    training_results = await trainer.train_model(epochs=3)
    evaluation = await trainer.evaluate_improvement()

    print(f"Improvement: {evaluation['improvement_pct']:.1f}%")
    print(f"Ready for RL: {evaluation['readiness_for_rl']}")

asyncio.run(main())
```

### Example 2: Full Pipeline
```python
import asyncio
from pathlib import Path
from infrastructure.deepeyesv2 import run_deepeyesv2_sft

async def main():
    # Assuming Phase 1 baseline already collected
    from infrastructure.deepeyesv2 import BaselineTracker

    tracker = BaselineTracker(output_dir=Path("logs/deepeyesv2/baseline"))

    # Load existing invocations from baseline phase
    # (In practice, would read from stored data)

    # Run complete SFT pipeline
    results = await run_deepeyesv2_sft(
        baseline_tracker=tracker,
        quality_threshold=0.90,
        output_dir=Path("logs/deepeyesv2/sft")
    )

    print(f"Status: {results['status']}")
    print(f"Training Examples: {results['training_examples_count']}")
    print(f"Improvement: {results['evaluation']['improvement_pct']:.1f}%")
    print(f"Report: {results['report_file']}")

asyncio.run(main())
```

### Example 3: Manual Control with TrajectoryCollector
```python
import asyncio
from pathlib import Path
from infrastructure.deepeyesv2 import (
    TrajectoryCollector,
    SFTDataset,
    ColdStartTrainer,
)

async def main():
    # Load baseline tracker
    tracker = BaselineTracker()

    # Collect and filter trajectories
    collector = TrajectoryCollector(quality_threshold=0.95)
    trajectories = await collector.collect_trajectories(tracker)
    filtered = await collector.filter_quality()
    examples = await collector.generate_training_examples()

    print(f"Collected: {len(trajectories)}")
    print(f"Filtered: {len(filtered)}")
    print(f"Generated: {len(examples)} training examples")

    # Create and split dataset
    dataset = SFTDataset(
        training_examples=examples,
        train_ratio=0.70,
        val_ratio=0.15,
        test_ratio=0.15,
    )

    splits = await dataset.split_data()
    stats = await dataset.get_dataset_stats()

    print(f"Train: {stats['train']['count']}")
    print(f"Val: {stats['val']['count']}")
    print(f"Test: {stats['test']['count']}")

    # Export JSONL files
    files = await dataset.export_all_splits()
    for split, path in files.items():
        print(f"Exported {split}: {path}")

asyncio.run(main())
```

## Training Data Format

### Input Format (from TrainingExample)
```json
{
  "task_id": "task_1763225842956",
  "prompt": "Task: Query database and cache results...",
  "completion": "Tool Invocation Sequence:\n1. database_query(...)\n2. cache_set(...)",
  "metadata": {
    "tool_sequence": ["database_query", "cache_set"],
    "difficulty": "medium",
    "agent": "AnalyticsAgent",
    "success": true,
    "timestamp": "2025-11-15T16:57:22.955990+00:00"
  }
}
```

### Complete Training Example
```json
{
  "task_id": "task_1763225842956",
  "prompt": "Task: Query the database and cache the results for future use\n\nRequired tool sequence:\n1. database_query({\"operation\": \"select\", \"timeout_seconds\": 5})\n2. cache_set({\"ttl_seconds\": 3600, \"value_size_kb\": 100})\n\nExpected result: Successful database query cached in distributed cache\n\nBased on the task description and required tools, generate the correct tool invocation sequence.",
  "completion": "Tool Invocation Sequence:\n1. database_query({\"operation\": \"select\", \"timeout_seconds\": 5})\n2. cache_set({\"ttl_seconds\": 3600, \"value_size_kb\": 100})\n\nSuccess: Yes\n\nConfidence: high",
  "metadata": {
    "tool_sequence": ["database_query", "cache_set"],
    "difficulty": "medium",
    "agent": "AnalyticsAgent",
    "success": true,
    "timestamp": "2025-11-15T16:57:22.955990+00:00"
  }
}
```

## Dataset Statistics Output

```json
{
  "total_examples": 1250,
  "train": {
    "count": 875,
    "success_rate_pct": 92.5,
    "avg_sequence_length": 2.3,
    "max_sequence_length": 5,
    "min_sequence_length": 1,
    "unique_tools": 18,
    "top_tools": {
      "database_query": 150,
      "cache_set": 125,
      "anthropic_api": 110
    }
  },
  "val": {
    "count": 187,
    "success_rate_pct": 91.2,
    ...
  },
  "test": {
    "count": 188,
    "success_rate_pct": 90.5,
    ...
  }
}
```

## Training Metrics

The trainer tracks:
- **Epoch-level metrics**: Loss per epoch, accuracy per epoch
- **Training metrics**: Total steps, total tokens
- **Baseline metrics**: Phase 1 success rates per tool
- **Improvement metrics**: Success rate delta, improvement percentage
- **Tool-specific improvements**: Per-tool accuracy before/after

## Output Files

The Phase 2 pipeline generates:

1. **Training Data**
   - `sft_train.jsonl`: Training split (70%)
   - `sft_val.jsonl`: Validation split (15%)
   - `sft_test.jsonl`: Test split (15%)

2. **Reports**
   - `training_report_YYYYMMDD_HHMMSS.json`: Comprehensive training report with metrics

3. **Logs**
   - Standard Python logging with metrics and progress

## Configuration Parameters

### TrajectoryCollector
- `quality_threshold` (float): Min success rate for trajectory inclusion (default: 0.90)
- `min_trajectory_length` (int): Minimum tools in trajectory (default: 1)
- `max_trajectory_length` (int): Maximum tools in trajectory (default: 5)

### SFTDataset
- `train_ratio` (float): Proportion for training (default: 0.70)
- `val_ratio` (float): Proportion for validation (default: 0.15)
- `test_ratio` (float): Proportion for testing (default: 0.15)
- `random_seed` (int): For reproducibility (default: 42)

### ColdStartTrainer
- `model_id` (str): Model to fine-tune (default: "claude-3-5-haiku-20241022")
- `epochs` (int): Training epochs (default: 3)
- `learning_rate` (float): Learning rate (default: 0.001)
- `batch_size` (int): Batch size (default: 8)
- `quality_threshold` (float): Min trajectory quality (default: 0.90)
- `min_examples` (int): Minimum examples required (default: 100)

## Target Metrics

- **Training Examples**: 1000+ from baseline data
- **Success Rate Improvement**: 15-20% gain from SFT
- **Tool Coverage**: All 18+ tools represented in training data
- **Readiness for RL**: >85% post-training success rate

## Next Steps

After Phase 2 completion:
1. Review evaluation metrics and readiness assessment
2. If `readiness_for_rl == true`: Proceed to Phase 3 RL refinement
3. If `readiness_for_rl == false`: Consider additional SFT or data collection
4. Monitor per-tool improvements for targeted fixes

## Troubleshooting

### Few training examples generated
- Check baseline data quality and quantity
- Lower `quality_threshold` to include more trajectories
- Ensure Phase 1 collected sufficient diverse invocations

### Training stalled or not improving
- Verify dataset has sufficient diversity (check tool_improvements)
- Ensure examples span full difficulty range
- Check for data quality issues in validation split

### Tool-specific low accuracy
- Review tool-specific parameters in training data
- Consider collecting more tool-specific invocations in Phase 1
- Check if tool needs special handling or validation

## References

- Paper: "DeepEyes: Towards Reliable Tool Invocation through Multi-stage Training" (arXiv:2511.05271)
- Phase 1: Tool Baseline Measurement
- Phase 3: RL Refinement (future)

## API Reference

See docstrings in `infrastructure/deepeyesv2/cold_start_sft.py` for complete API documentation.
