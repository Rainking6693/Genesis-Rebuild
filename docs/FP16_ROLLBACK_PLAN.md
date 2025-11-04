# FP16 Training: Emergency Rollback Plan

**Version:** 1.0  
**Last Updated:** November 3, 2025  
**Criticality:** HIGH - Production Safety

---

## Overview

This document provides **immediate action procedures** for rolling back FP16 training if production issues arise.

### When to Rollback

Execute rollback if any of the following occur:

| Severity | Condition | Action Time | Procedure |
|----------|-----------|-------------|-----------|
| **P0 - Critical** | Training failures >50% | <5 min | Emergency Rollback |
| **P0 - Critical** | NaN/Inf losses consistently | <5 min | Emergency Rollback |
| **P1 - High** | Overflow rate >30% | <15 min | Emergency Rollback |
| **P1 - High** | Loss divergence >20% vs baseline | <15 min | Emergency Rollback |
| **P2 - Medium** | Performance regression <0.8x | <30 min | Gradual Rollback |
| **P2 - Medium** | Overflow rate 10-30% | <30 min | Gradual Rollback |

---

## Emergency Rollback (P0 - Critical)

**Target Time:** <5 minutes  
**Use Case:** Production is broken, immediate action required

### Step 1: Disable FP16 Globally (30 seconds)

```bash
# SSH into production servers
ssh production-orchestrator

# Disable FP16 immediately
export ENABLE_FP16_TRAINING=false

# Persist to environment file
echo "ENABLE_FP16_TRAINING=false" >> /etc/genesis/environment

# Alternative: Update Docker/k8s config
kubectl set env deployment/genesis-orchestrator ENABLE_FP16_TRAINING=false
```

### Step 2: Kill In-Flight Training Jobs (1 minute)

```bash
# Option A: Graceful termination (if time allows)
pkill -SIGTERM -f "world_model.train"

# Option B: Force kill (if critical)
pkill -SIGKILL -f "world_model.train"

# Kubernetes
kubectl delete pods -l app=genesis-training --force --grace-period=0
```

### Step 3: Restart Services (2 minutes)

```bash
# Docker Compose
docker-compose restart genesis-orchestrator genesis-workers

# Systemd
sudo systemctl restart genesis-orchestrator
sudo systemctl restart genesis-worker@*

# Kubernetes
kubectl rollout restart deployment/genesis-orchestrator
kubectl rollout restart deployment/genesis-workers
```

### Step 4: Verify FP32 Mode (1 minute)

```bash
# Check logs for confirmation
tail -f /var/log/genesis/orchestrator.log | grep -i "fp16\|fp32"

# Expected output:
# "FP16 training disabled - using FP32"
# "fp16_enabled: False"
```

### Step 5: Monitor Recovery (Ongoing)

```bash
# Watch for successful training
watch -n 5 'tail -20 /var/log/genesis/orchestrator.log | grep "training complete"'

# Check Grafana dashboard
# - Training success rate should recover to >95%
# - Loss values should stabilize
# - No more overflow warnings
```

---

## Gradual Rollback (P1/P2)

**Target Time:** <30 minutes  
**Use Case:** Issues detected but not critical, staged rollback preferred

### Phase 1: Stop New FP16 Training (5 minutes)

```bash
# Prevent new jobs from using FP16
export ENABLE_FP16_TRAINING=false

# Update deployment config (but don't restart yet)
kubectl set env deployment/genesis-orchestrator ENABLE_FP16_TRAINING=false --dry-run=client -o yaml | kubectl apply -f -

# Jobs already running will complete with FP16
# New jobs will use FP32
```

### Phase 2: Wait for In-Flight Jobs (10-20 minutes)

```bash
# Monitor running training jobs
watch -n 10 'ps aux | grep world_model.train | wc -l'

# Check completion status
curl http://localhost:8080/api/training/status

# Expected: Count decreases to 0 as jobs complete
```

### Phase 3: Deploy FP32 Configuration (3 minutes)

```bash
# Rolling restart (zero downtime)
kubectl rollout restart deployment/genesis-orchestrator
kubectl rollout status deployment/genesis-orchestrator

# Wait for rollout to complete
# All new pods will use FP32
```

### Phase 4: Validate FP32 Operation (5 minutes)

```python
# Test script: verify_fp32_mode.py
from infrastructure.world_model import WorldModel
import os

os.environ["ENABLE_FP16_TRAINING"] = "false"

model = WorldModel()
model.replay_buffer = create_test_replay_buffer(50)

await model.train(num_epochs=1, batch_size=16)

# Verify FP32 mode
assert model.fp16_enabled == False, "FP16 should be disabled"
assert model._fp16_stats is None or model._fp16_stats.get("fp16_enabled_runtime") == False

print("✅ FP32 mode verified")
```

---

## Canary Rollback

**Target Time:** Variable (2-24 hours)  
**Use Case:** Testing rollback on subset of traffic

### Step 1: Identify Canary Nodes

```bash
# Tag 10% of nodes for canary rollback
kubectl label nodes worker-1 worker-2 fp16=disabled

# Update deployment to respect labels
kubectl patch deployment genesis-orchestrator --patch '
spec:
  template:
    spec:
      affinity:
        nodeAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
            nodeSelectorTerms:
            - matchExpressions:
              - key: fp16
                operator: NotIn
                values:
                - disabled
'
```

### Step 2: Deploy FP32 to Canary

```bash
# Create canary deployment with FP32
kubectl create deployment genesis-orchestrator-canary \
  --image=genesis:latest \
  --replicas=2 \
  --env="ENABLE_FP16_TRAINING=false"

# Route 10% traffic to canary
kubectl apply -f canary-service.yaml
```

### Step 3: Monitor Canary Performance

```promql
# Grafana queries to compare canary vs main

# Training success rate
rate(genesis_training_success_total{deployment="canary"}[5m]) /
rate(genesis_training_total{deployment="canary"}[5m])

# Training duration (should increase for FP32)
histogram_quantile(0.95, 
  rate(genesis_training_duration_seconds_bucket{deployment="canary"}[5m]))
```

### Step 4: Decision Point

After 2-4 hours of monitoring:

```bash
# If canary is healthy: Promote to 100%
kubectl scale deployment genesis-orchestrator --replicas=0
kubectl scale deployment genesis-orchestrator-canary --replicas=10
kubectl delete deployment genesis-orchestrator
kubectl rename deployment genesis-orchestrator-canary genesis-orchestrator

# If canary has issues: Investigate further (don't rollback yet)
# If main has issues: Expedite full rollback
```

---

## Rollback Verification Checklist

After executing any rollback procedure:

### Immediate Checks (0-5 minutes)

- [ ] **Services restarted** - All pods/containers running
- [ ] **FP16 disabled in logs** - Confirm "FP32" in recent logs
- [ ] **No FP16 stats** - `fp16_enabled_runtime=False` or absent
- [ ] **Training jobs starting** - New jobs picking up work

### Short-term Checks (5-30 minutes)

- [ ] **Training completion rate** - >95% success
- [ ] **Loss convergence** - Matches historical FP32 baseline
- [ ] **No overflow warnings** - Zero overflow errors
- [ ] **Performance baseline** - Training times match FP32 historical data

### Long-term Checks (30 minutes - 2 hours)

- [ ] **System stability** - No crashes or anomalies
- [ ] **Model accuracy** - Validation metrics within normal range
- [ ] **Throughput** - Expected reduction to FP32 baseline (2-3x slower on CUDA)
- [ ] **VRAM usage** - Increased to FP32 levels (acceptable)

---

## Checkpoint Recovery

### FP16 → FP32 Checkpoint Migration

**Good news:** No migration needed! Checkpoints are fully compatible.

```python
# Load FP16 checkpoint in FP32 mode
os.environ["ENABLE_FP16_TRAINING"] = "false"

model = WorldModel()
model.load_checkpoint("/data/checkpoints/world_model_fp16.pt")

# Continue training in FP32
await model.train(num_epochs=5, batch_size=32)

# Save FP32 checkpoint
model.save_checkpoint("/data/checkpoints/world_model_fp32.pt")
```

### Verify Checkpoint Integrity

```python
import torch

checkpoint = torch.load("world_model_fp16.pt", map_location="cpu")

# Check for corruption
assert "model_state_dict" in checkpoint
assert "optimizer_state_dict" in checkpoint

# Verify dtypes (should be FP32 for model weights)
for key, tensor in checkpoint["model_state_dict"].items():
    print(f"{key}: {tensor.dtype}")
    assert tensor.dtype == torch.float32, f"Unexpected dtype for {key}"

print("✅ Checkpoint valid")
```

---

## Communication Templates

### P0 Incident Alert

```
SUBJECT: [P0] Genesis FP16 Training Rollback - Action Required

IMPACT: FP16 training causing production failures
STATUS: Rollback in progress
ETA: 5 minutes

ACTIONS TAKEN:
1. FP16 disabled globally (ENABLE_FP16_TRAINING=false)
2. In-flight jobs terminated
3. Services restarting with FP32

NEXT STEPS:
1. Monitor training success rate (target >95%)
2. Verify loss convergence matches baseline
3. Post-mortem scheduled for [TIME]

CURRENT STATUS: [Link to dashboard]
```

### P1/P2 Rollback Notice

```
SUBJECT: [P1] Genesis FP16 Gradual Rollback

IMPACT: FP16 showing elevated overflow rates
STATUS: Gradual rollback initiated
ETA: 30 minutes

ACTIONS TAKEN:
1. New training jobs using FP32
2. In-flight FP16 jobs completing normally
3. Rolling restart scheduled for [TIME]

EXPECTED IMPACT:
- Training throughput will decrease 2-3x (acceptable)
- VRAM usage will increase 40-50% (within capacity)
- System stability will improve

MONITORING: [Link to Grafana]
```

### All-Clear Notification

```
SUBJECT: [RESOLVED] Genesis FP16 Rollback Complete

STATUS: FP32 mode confirmed and stable
DURATION: Rollback completed in [X] minutes

VERIFICATION:
✅ Training success rate: 98.5%
✅ Loss convergence: Within 1% of baseline
✅ Zero overflow errors
✅ System stability: Normal

PERFORMANCE:
- Training time: +2.1x (expected for FP32)
- VRAM usage: +45% (within capacity)
- Throughput: 245 samples/s (FP32 baseline)

ROOT CAUSE: [Brief description]
FOLLOW-UP: Post-mortem scheduled for [TIME]
```

---

## Post-Rollback Investigation

### Data to Collect

```bash
# 1. System logs
tar -czf rollback-logs-$(date +%Y%m%d).tar.gz \
  /var/log/genesis/*.log \
  /var/log/syslog

# 2. Training metrics
curl http://localhost:8080/api/metrics/export > metrics-$(date +%Y%m%d).json

# 3. FP16 statistics
sqlite3 /var/lib/genesis/metrics.db \
  "SELECT * FROM fp16_stats WHERE timestamp > datetime('now', '-24 hours')" \
  > fp16-stats-$(date +%Y%m%d).csv

# 4. GPU telemetry (if applicable)
nvidia-smi dmon -s pucvmet -c 100 > gpu-stats-$(date +%Y%m%d).log
```

### Root Cause Analysis Questions

1. **What triggered the rollback?**
   - Training failures
   - High overflow rate
   - Loss divergence
   - Performance regression

2. **Was FP16 working initially?**
   - Yes → Environment change (new model, data, hardware)
   - No → Configuration issue or hardware incompatibility

3. **What changed recently?**
   - Model architecture updates
   - Batch size changes
   - Learning rate adjustments
   - Hardware upgrades

4. **Were there warning signs?**
   - Gradual increase in overflow rate
   - Slow loss divergence
   - Intermittent training failures

5. **Can FP16 be re-enabled safely?**
   - With configuration changes
   - With architecture modifications
   - Only on specific hardware
   - Not recommended (stay on FP32)

---

## Re-Enabling FP16 After Rollback

### Pre-Requisites

Before attempting to re-enable FP16:

- [ ] **Root cause identified** - Understand what went wrong
- [ ] **Fix implemented** - Configuration or code changes applied
- [ ] **Staging tested** - Validated on non-production environment
- [ ] **Monitoring enhanced** - Additional alerts configured
- [ ] **Team notified** - All stakeholders aware of re-enablement
- [ ] **Rollback plan ready** - Can rollback again if needed

### Staged Re-Enablement

```bash
# Week 1: Staging environment
export ENABLE_FP16_TRAINING=true  # on staging only
# Monitor for 3-5 days

# Week 2: Canary (10% production traffic)
kubectl label nodes worker-1 worker-2 fp16=enabled
# Monitor for 3-5 days

# Week 3: Gradual rollout (25% → 50% → 100%)
# Increase percentage if metrics look good
# Rollback immediately if issues recur
```

### Success Criteria for Re-Enablement

- Training success rate >98% (comparable to FP32)
- Overflow rate <5% (ideally <2%)
- Loss convergence within 5% of FP32
- No stability issues for 7 days
- Performance improvement 2-3x on CUDA

---

## Contacts & Escalation

### On-Call Rotation

| Role | Primary | Backup |
|------|---------|--------|
| **DevOps** | [Name] | [Name] |
| **ML Engineer** | [Name] | [Name] |
| **SRE** | [Name] | [Name] |

### Escalation Path

1. **Detect issue** → On-call engineer
2. **>15 min unresolved** → Escalate to ML lead
3. **>30 min unresolved** → Escalate to CTO
4. **Critical production impact** → Immediate rollback (don't wait)

### Emergency Commands

```bash
# Quick reference for on-call

# 1. Check if FP16 is enabled
echo $ENABLE_FP16_TRAINING
kubectl get configmap genesis-config -o yaml | grep FP16

# 2. Disable FP16 immediately
export ENABLE_FP16_TRAINING=false
kubectl set env deployment/genesis-orchestrator ENABLE_FP16_TRAINING=false

# 3. Restart services
docker-compose restart
# or
kubectl rollout restart deployment/genesis-orchestrator

# 4. Verify FP32 mode
tail -f /var/log/genesis/orchestrator.log | grep -i "fp32"

# 5. Check training success
curl http://localhost:8080/api/training/stats
```

---

## Appendix: Rollback Scenarios

### Scenario A: High Overflow Rate

**Symptoms:** 30% overflow rate, training still completing  
**Severity:** P1 (High)  
**Action:** Gradual rollback

```bash
# Increase loss scale first (try to fix without rollback)
export FP16_LOSS_SCALE=131072  # Double the default

# If still >20% overflow after 30 min, rollback
if [ $(check_overflow_rate) -gt 20 ]; then
  execute_gradual_rollback
fi
```

### Scenario B: Loss Divergence

**Symptoms:** Final loss 15% higher than FP32 baseline  
**Severity:** P1 (High)  
**Action:** Emergency rollback

```bash
# Loss divergence indicates numerical instability
# Immediate rollback required
execute_emergency_rollback

# Investigate:
# - Was gradient clipping disabled?
# - Is learning rate too high?
# - Model architecture changes?
```

### Scenario C: Training Failures

**Symptoms:** >50% training jobs failing with NaN losses  
**Severity:** P0 (Critical)  
**Action:** Emergency rollback

```bash
# System is broken, rollback immediately
execute_emergency_rollback

# Check for:
# - Invalid model weights (corrupted checkpoint?)
# - Data pipeline issues
# - Hardware problems (faulty GPU?)
```

### Scenario D: Performance Regression

**Symptoms:** FP16 slower than FP32 (0.8x speedup)  
**Severity:** P2 (Medium)  
**Action:** Investigate, then gradual rollback

```bash
# Performance issue, not correctness issue
# Can take time to investigate

# Check:
# 1. Are tensor cores being used?
nvidia-smi dmon -s pucvmet

# 2. Is batch size aligned (multiple of 8)?
check_batch_size_alignment

# 3. Is CPU bottleneck?
top -p $(pgrep python)

# If can't fix within 1 hour, rollback
```

---

**Document Version:** 1.0  
**Last Updated:** November 3, 2025  
**Status:** ✅ Production Ready  
**Review Cycle:** Quarterly or after each rollback event

