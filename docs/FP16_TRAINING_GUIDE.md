# FP16 Training Implementation Guide

This guide documents the FP16 (half-precision) training path implemented for the
Genesis rebuild. The work mirrors patterns from the Precision-RL project and is
built on top of PyTorch Automatic Mixed Precision (AMP).

## Overview

- **Impact targets:** 2–3× faster training, 40–50% VRAM reduction on CUDA hosts
- **Scope:** reusable FP16 trainer utility + WorldModel integration
- **Fallback behaviour:** automatically reverts to FP32 when CUDA/AMP is not
  available (e.g. CPU-only environments or CI sandboxes)

## Architecture

1. **`FP16Trainer`** (`infrastructure/training/fp16_trainer.py`)
   - Wraps PyTorch AMP autocast + `GradScaler`
   - Tracks overflow rate, loss scale, and training step counts
   - Provides checkpoint helpers that include the scaler state
2. **WorldModel integration** (`infrastructure/world_model.py`)
   - Respects `ENABLE_FP16_TRAINING` environment flag
   - Uses `FP16Trainer` when CUDA is available
   - Logs per-epoch overflow counts and exposes stats for benchmarks
3. **SE-Darwin toggle** (`agents/se_darwin_agent.py`)
   - Reads the feature flag and logs intent so downstream components (WorldModel,
     replay buffer training, etc.) stay in sync

## Usage

Enable FP16 training via environment variable:

```bash
# .env
ENABLE_FP16_TRAINING=true
```

Programmatic example:

```python
from infrastructure.training import FP16Trainer, FP16TrainingConfig

trainer = FP16Trainer(model, optimizer, FP16TrainingConfig())
for batch in dataloader:
    loss = trainer.training_step(batch, compute_loss)
    trainer.backward_and_step(loss)

print(trainer.get_stats())
```

The WorldModel adopts the same configuration automatically; simply call
`await world_model.train(...)`.

## Benchmarks

Use `scripts/benchmark_fp16_training.py` to compare FP16 vs FP32 timings. The
script generates deterministic synthetic trajectories and writes results to
`benchmark_results/fp16_vs_fp32_results.csv` (with a companion plot when
matplotlib is available).

Example output:

```
Benchmark results saved to benchmark_results/fp16_vs_fp32_results.csv
```

On CUDA-equipped hosts you should expect 2–3× speed-ups with <2% accuracy
variance. CPU-only runs will report identical timings, which is expected because
AMP is disabled in that scenario.

## Troubleshooting

| Issue | Mitigation |
| ----- | ---------- |
| `RuntimeError: CUDA error: no kernel image is available` | Ensure you are running on a CUDA-capable build of PyTorch or set `ENABLE_FP16_TRAINING=false` |
| High overflow rate (>10%) | Lower `loss_scale` to 32768 or increase `growth_interval` |
| Accuracy drop (>5%) | Stay in mixed-precision (do not call `cast_model_to_fp16`) and reduce learning rate |
| Checkpoint restore fails | Verify the new checkpoints are used; old FP32 checkpoints lack scaler state |

## References

- PyTorch AMP documentation — <https://pytorch.org/docs/stable/amp.html>
- Precision-RL project — <https://github.com/eric-haibin-lin/precision-rl>
- NVIDIA Apex mixed precision — <https://github.com/NVIDIA/apex>
