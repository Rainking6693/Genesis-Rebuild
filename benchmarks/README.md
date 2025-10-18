# Benchmarks Directory

This directory stores performance benchmark data for Genesis orchestration.

## Files

- `metrics.json` - Historical benchmark results (created automatically)

## Quick Commands

```bash
# Run all benchmarks
pytest tests/test_performance_benchmarks.py -v

# Run manual benchmark report
python -c "
import asyncio, sys
sys.path.insert(0, '.')
from tests.test_performance_benchmarks import run_full_benchmark_suite
asyncio.run(run_full_benchmark_suite())
"

# View historical metrics
python -c "
from infrastructure.benchmark_recorder import get_benchmark_recorder
recorder = get_benchmark_recorder()
print(recorder.generate_report(['v1.0', 'v2.0']))
"
```

## Data Format

```json
{
  "metrics": [
    {
      "timestamp": "2025-10-17T13:22:14.479473Z",
      "version": "v1.0",
      "git_commit": "abc123",
      "task_id": "7d8a3f2b1c9e",
      "task_description": "Create landing page",
      "execution_time": 3.456,
      "success": true,
      "agent_selected": "builder_agent",
      "cost_estimated": 0.000120,
      "difficulty": 0.2,
      "metadata": {}
    }
  ]
}
```

## Documentation

See `/home/genesis/genesis-rebuild/docs/BENCHMARKING_GUIDE.md` for complete documentation.
