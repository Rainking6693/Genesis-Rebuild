# Precision-RL FP16 Training Analysis

This note captures the relevant patterns pulled from the Precision-RL project and
related mixed-precision training guidance. The goal is to inform the Genesis
integration for SE-Darwin evolution training.

## Key References

- Precision-RL repository (`eric-haibin-lin/precision-rl`) – VeRL and OAT mixed
  precision patches (`patches/verl_fp16.patch`, `patches/oat_fp16.patch`).
- PyTorch AMP documentation – automatic casting APIs and gradient scaling
  semantics.
- NVIDIA Apex mixed precision guide – recommendations on loss scaling and
  numerical safeguards.

## Core Patterns Observed

1. **Gradient Scaler Lifecycle**
   - Initialise `GradScaler` once per optimizer with high initial loss scale
     (Precision-RL defaults to 2^16) and dynamic growth/backoff factors.
   - Call `scaler.scale(loss).backward()` and `scaler.step(optimizer)`; always
     `scaler.update()` afterwards.
   - Detect overflow via `scaler._get_overflow_buffer()`; skip optimizer step
     when overflow occurs and increment overflow counters.

2. **Autocast Usage**
   - Wrap forward pass inside `with autocast(dtype=torch.float16):` to cast
     model parameters and activations on-the-fly.
   - Keep loss tensors in FP32 to preserve gradient precision (PyTorch AMP
     handles this automatically when loss originates outside the autocast
     block).

3. **Optimizer State Management**
   - Optimizer states stay in FP32; Precision-RL explicitly casts model
     parameters to FP16 but retains master weights (PyTorch AMP handles this
     internally via GradScaler).

4. **Numerical Stability Guards**
   - Gradient clipping (`torch.nn.utils.clip_grad_norm_`) still occurs on scaled
     gradients prior to `scaler.step`.
   - Optional anomaly detection for debugging; Precision-RL toggles `amp_autocast` via config.

5. **Logging and Metrics**
   - Track current loss scale, overflow frequency, and throughput improvements.
   - Expose statistics for dashboards (Precision-RL logs to TensorBoard / W&B).

## Configuration Defaults (Precision-RL)

| Parameter        | Value  | Notes                                  |
|------------------|--------|----------------------------------------|
| loss_scale       | 65,536 | High initial scale to maximise mantissa |
| growth_factor    | 2.0    | Double scale after `growth_interval`    |
| backoff_factor   | 0.5    | Halve scale on overflow                 |
| growth_interval  | 2000   | Steps without overflow before growth    |

## Recommended Integration Steps

1. Abstract FP16 helper that receives `(model, optimizer)` and wraps training loop.
2. Expose configuration through dataclass and environment variable toggle.
3. Instrument SE-Darwin training (world model) to use helper when FP16 enabled.
4. Add regression tests simulating simple MLP training to confirm scaler logic.
5. Provide benchmark script to log FP32 vs FP16 throughput for reproducibility.

## Notes

- AMP is preferred to manual `.half()` conversions because it preserves master
  weights and automatically casts operations with high-precision requirements.
- Gradient scaling is essential when using FP16; skipping `GradScaler` visibly
  destabilises the Precision-RL training loops.
- Logging overflow counts helps tune `loss_scale` and `growth_interval` for new
  workloads.

