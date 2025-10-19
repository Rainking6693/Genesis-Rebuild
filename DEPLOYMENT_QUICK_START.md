# Genesis Deployment - Quick Start Guide

**Status:** READY FOR DEPLOYMENT
**Deployment Infrastructure:** 100% COMPLETE
**System Health:** 5/5 checks passing (98.28% test pass rate)

---

## TL;DR - Deploy Now

### Option 1: Staging Deployment (Recommended First)

```bash
# Set environment
export GENESIS_ENV=staging

# Run health check
python scripts/health_check.py

# Execute deployment
python scripts/deploy.py deploy --strategy safe

# Monitor status
python scripts/deploy.py status
```

**Duration:** 30 minutes
**Result:** Staging at 100% rollout

---

### Option 2: Production Deployment (After Staging Validated)

```bash
# Set environment
export GENESIS_ENV=production

# Pre-deployment health check
python scripts/health_check.py

# Dry-run first (review output)
python scripts/deploy.py deploy --strategy safe --dry-run

# Execute production deployment
python scripts/deploy.py deploy --strategy safe

# Monitor deployment
watch -n 60 'python scripts/deploy.py status'
```

**Duration:** 7 days (progressive rollout: 0% → 5% → 10% → 25% → 50% → 75% → 100%)
**Monitoring:** Auto-rollback on error rate > 1% or P95 > 500ms

---

## Deployment Strategies

### SAFE (Default - Recommended for Production)
- **Steps:** 0% → 5% → 10% → 25% → 50% → 75% → 100%
- **Duration:** 7 days
- **Monitoring:** 5 minutes per step
- **Use Case:** First production deployment

```bash
python scripts/deploy.py deploy --strategy safe
```

### FAST (For Experienced Teams)
- **Steps:** 0% → 25% → 50% → 100%
- **Duration:** 3 days
- **Monitoring:** 5 minutes per step
- **Use Case:** After successful safe deployment

```bash
python scripts/deploy.py deploy --strategy fast
```

### CUSTOM (Advanced)
- **Steps:** User-defined
- **Duration:** Variable
- **Use Case:** Specific rollout requirements

```bash
python scripts/deploy.py deploy --strategy custom --steps "0,10,50,100"
```

---

## Monitoring Commands

### Check Deployment Status
```bash
python scripts/deploy.py status
```

### Run Health Check
```bash
python scripts/health_check.py
```

### Check Feature Flag Rollout
```bash
python -c "from infrastructure.feature_flags import get_feature_flag_manager; \
manager = get_feature_flag_manager(); \
import json; print(json.dumps(manager.get_rollout_status('phase_4_deployment'), indent=2))"
```

### Continuous Monitoring (Every 5 Minutes)
```bash
while true; do
    echo "=== $(date) ==="
    python scripts/health_check.py
    python scripts/deploy.py status | jq '.current_percentage'
    sleep 300
done
```

---

## Emergency Procedures

### Emergency Rollback
```bash
python scripts/deploy.py rollback
```

**Result:** System returned to 0% (safe mode) instantly

### Emergency Shutdown
```bash
python -c "from infrastructure.feature_flags import get_feature_flag_manager; \
manager = get_feature_flag_manager(); \
manager.set_flag('emergency_shutdown', True); \
manager.save_to_file('/home/genesis/genesis-rebuild/config/feature_flags.json'); \
print('⛔ EMERGENCY SHUTDOWN ACTIVATED')"
```

---

## Current System Status

**Health Checks:** 5/5 PASSING

```
✅ Test Pass Rate: 98.28% (1,026/1,044 tests passing)
✅ Code Coverage: 67% total (85-100% infrastructure)
✅ Feature Flags: 15 configured and validated
✅ Configuration Files: All 4 required files present
✅ Python Environment: Python 3.12.3, all dependencies installed
```

**Feature Flags:**
- **Enabled (12):** All critical features (orchestration, security, error handling, OTEL, performance)
- **Staged (2):** AATC system (Oct 20-27), Phase 4 deployment (Oct 18-25)
- **Safety (3):** Emergency shutdown, read-only mode, maintenance mode (all OFF)

**Deployment Readiness:** 9.2/10 (PRODUCTION READY)

---

## Pre-Deployment Checklist

### Before Deploying to Staging:
- [x] Tests >= 95% passing (current: 98.28%)
- [x] Coverage >= 65% (current: 67%)
- [x] Feature flags validated (15 flags, 42/42 tests)
- [x] Health check passing (5/5)
- [x] Documentation complete (12 files)

### Before Deploying to Production:
- [ ] Staging deployed successfully
- [ ] Staging validated for 24-48 hours (recommended)
- [ ] Stakeholders notified
- [ ] On-call engineer assigned
- [ ] Monitoring dashboards prepared
- [ ] Rollback plan reviewed

---

## Auto-Rollback Triggers

The deployment system automatically rolls back on:

1. **Error Rate > 1.0%** sustained for 5 minutes
2. **P95 Latency > 500ms** sustained for 5 minutes
3. **P99 Latency > 1000ms** sustained for 5 minutes
4. **5+ consecutive health check failures**

**No manual intervention required** - system automatically returns to safe mode (0%)

---

## Rollout Timeline (Production)

| Day | Date | Rollout % | Monitoring Frequency |
|-----|------|-----------|----------------------|
| 1   | Oct 19 | 0% → 5%   | Every 1 hour         |
| 2   | Oct 20 | 5% → 10%  | Every 2 hours        |
| 3   | Oct 21 | 10% → 25% | Every 4 hours        |
| 4   | Oct 22 | 25% → 50% | Every 6 hours        |
| 5   | Oct 23 | 50% → 75% | Every 8 hours        |
| 6   | Oct 24 | 75% → 100%| Every 12 hours       |
| 7+  | Oct 25+| 100%      | Every 24 hours       |

---

## Key Metrics to Monitor

### Error Rate
- **Target:** < 0.1%
- **Warning:** 0.5%
- **Critical:** 1.0% (triggers auto-rollback)

### P95 Latency
- **Target:** < 100ms
- **Warning:** 200ms
- **Critical:** 500ms (triggers auto-rollback)

### Test Pass Rate
- **Target:** >= 98%
- **Warning:** < 98%
- **Critical:** < 95%

---

## Troubleshooting

### Deployment Fails Pre-Validation
```bash
# Check health status
python scripts/health_check.py

# Common fixes:
# - Test failures: pytest -x
# - Coverage low: Add tests
# - Feature flags: Check config/feature_flags.json
# - Dependencies: pip install -r requirements_infrastructure.txt
```

### High Error Rate After Deployment
```bash
# Check error logs
tail -f logs/*.log

# If critical, rollback immediately
python scripts/deploy.py rollback
```

### Feature Flag Not Working
```bash
# Reload feature flags
python -c "from infrastructure.feature_flags import get_feature_flag_manager; \
manager = get_feature_flag_manager(); \
manager.reload(); \
print('Flags reloaded')"
```

---

## Documentation

For detailed information, see:

1. **DEPLOYMENT_RUNBOOK.md** - Complete step-by-step procedures
2. **PRODUCTION_DEPLOYMENT_PLAN.md** - 7-day rollout plan
3. **STAGING_DEPLOYMENT_REPORT.md** - Staging validation results
4. **PHASE4_DEPLOYMENT_COMPLETE_SUMMARY.md** - This session's deliverables

---

## Support

**Deployment Lead:** Cora (QA Auditor)
**On-Call Engineer:** [TBD]
**Security Lead:** Hudson

**Emergency Contact:** See DEPLOYMENT_RUNBOOK.md for escalation path

---

## Quick Commands Reference

```bash
# Staging deployment
export GENESIS_ENV=staging && python scripts/deploy.py deploy --strategy safe

# Production deployment (dry-run)
export GENESIS_ENV=production && python scripts/deploy.py deploy --strategy safe --dry-run

# Production deployment (execute)
export GENESIS_ENV=production && python scripts/deploy.py deploy --strategy safe

# Check status
python scripts/deploy.py status

# Health check
python scripts/health_check.py

# Emergency rollback
python scripts/deploy.py rollback

# Emergency shutdown
python -c "from infrastructure.feature_flags import get_feature_flag_manager; manager = get_feature_flag_manager(); manager.set_flag('emergency_shutdown', True); manager.save_to_file('/home/genesis/genesis-rebuild/config/feature_flags.json')"
```

---

**Version:** 1.0.0
**Date:** October 19, 2025
**Status:** READY FOR DEPLOYMENT
**Deployment Infrastructure:** 100% COMPLETE

---

END OF QUICK START GUIDE
