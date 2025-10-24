---
title: Genesis Rebuild - Production Deployment Runbook
category: Guides
dg-publish: true
publish: true
tags:
- monitoring
- genesis
- overview
- troubleshooting
- emergency
- production
- post
- incident
- staging
- rollback
- prerequisites
- pre
source: docs/DEPLOYMENT_RUNBOOK.md
exported: '2025-10-24T22:05:26.880946'
---

# Genesis Rebuild - Production Deployment Runbook

**Last Updated:** October 18, 2025  
**Version:** 1.0.0  
**Owner:** DevOps/Platform Team  
**Reviewer:** Cora (QA Auditor)

---

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Pre-Deployment Checklist](#pre-deployment-checklist)
4. [Staging Deployment](#staging-deployment)
5. [Production Deployment](#production-deployment)
6. [Post-Deployment Validation](#post-deployment-validation)
7. [Monitoring & Alerts](#monitoring--alerts)
8. [Rollback Procedures](#rollback-procedures)
9. [Troubleshooting](#troubleshooting)
10. [Emergency Contacts](#emergency-contacts)

---

## Overview

This runbook documents the complete deployment process for Genesis Rebuild orchestration system from staging to production.

### System Components

- **Orchestration Layer:** HTDAG + HALO + AOP (Phase 1-3 complete)
- **Security:** Authentication, prompt shields, DoS prevention
- **Observability:** OpenTelemetry tracing and metrics
- **Performance:** 46.3% faster than baseline, 48% cost reduction
- **Error Handling:** Circuit breaker, graceful degradation, auto-retry

### Deployment Strategy

- **Staging First:** All changes deployed to staging for validation
- **Gradual Rollout:** Production deployment using progressive rollout (0% → 100% over 7 days)
- **Feature Flags:** Critical features ON by default, experimental features staged
- **Auto-Rollback:** Automated rollback on error rate > 1% or P95 latency > 500ms

---

## Prerequisites

### Access Requirements

- [ ] GitHub repository access (read/write)
- [ ] Production server SSH access
- [ ] Feature flag admin access
- [ ] Monitoring dashboard access (OpenTelemetry/Grafana)
- [ ] Incident management system access (PagerDuty/Slack)

### System Requirements

- [ ] Python 3.12+ installed
- [ ] Virtual environment activated
- [ ] All dependencies installed (`pip install -r requirements_infrastructure.txt`)
- [ ] Git repository on `main` branch (for production) or `staging` (for staging)
- [ ] Clean git status (no uncommitted changes for production)

### Validation Requirements

- [ ] Test pass rate >= 95% (Current: 98.28%)
- [ ] Infrastructure coverage >= 85% (Current: 85-100%)
- [ ] All critical feature flags validated
- [ ] Health check script passing (5/5 checks)

---

## Pre-Deployment Checklist

### 1. Code Review

- [ ] All PRs merged to target branch
- [ ] Code review approved by at least 2 reviewers
- [ ] All CI/CD checks passing
- [ ] No known P1/P2 issues in backlog

### 2. Testing Validation

Run comprehensive test suite:

```bash
# Full test suite
pytest --tb=short -v

# Expected: 1,026/1,044 passing (98.28%)
# Threshold: >= 95% pass rate
```

- [ ] Test pass rate >= 95%
- [ ] Zero P1 test failures
- [ ] All critical infrastructure tests passing

### 3. Coverage Validation

```bash
# Generate coverage report
pytest --cov=infrastructure --cov=agents --cov-report=json --cov-report=term

# Check coverage thresholds
python scripts/calculate_coverage.py
```

- [ ] Total coverage >= 65%
- [ ] Infrastructure coverage >= 85%
- [ ] No critical modules below threshold

### 4. Feature Flag Configuration

```bash
# Validate feature flags
python -c "from infrastructure.feature_flags import get_feature_flag_manager; \
manager = get_feature_flag_manager(); \
print(f'Flags configured: {len(manager.flags)}'); \
for name, flag in manager.flags.items(): \
    print(f'  {name}: {\"ENABLED\" if flag.enabled else \"DISABLED\"}')"
```

- [ ] All critical flags validated
- [ ] Experimental flags configured for staged rollout
- [ ] Emergency shutdown flags OFF

### 5. Health Check

```bash
# Run system health check
python scripts/health_check.py
```

- [ ] All health checks passing (5/5)
- [ ] No critical warnings
- [ ] System ready for deployment

---

## Staging Deployment

### Step 1: Pre-Deployment Validation

```bash
# Set environment
export GENESIS_ENV=staging

# Run health check
python scripts/health_check.py

# Validate feature flags
python -c "from infrastructure.feature_flags import get_feature_flag_manager; \
manager = get_feature_flag_manager(); \
print('Staging feature flags validated')"
```

**Expected:**
- ✅ Health check: 5/5 passing
- ✅ Feature flags: All configured
- ✅ No blocking errors

### Step 2: Execute Staging Deployment

```bash
# Deploy to staging
python scripts/deploy.py --environment staging

# Or use dry-run first
python scripts/deploy.py --environment staging --dry-run
```

**Expected Output:**
```
================================================================================
Genesis Rebuild - STAGING Deployment
================================================================================
Environment: staging
Dry Run: False
================================================================================

[DEPLOY_START] Starting staging deployment
[VALIDATION_COMPLETE] Validation checks completed
  ✅ Git Status passed
  ✅ Test Pass Rate passed
  ✅ Code Coverage passed
  ✅ Feature Flags passed
  ✅ Dependencies passed
  ✅ Configuration Files passed
  ✅ Health Check Script passed
✅ All validation checks passed
[DEPLOY_STAGING] Staging deployment complete
[DEPLOY_SUCCESS] staging deployment completed successfully

================================================================================
✅ STAGING DEPLOYMENT SUCCESSFUL
================================================================================
```

### Step 3: Post-Deployment Validation

```bash
# Run post-deployment health check
python scripts/health_check.py

# Verify feature flags
python -c "from infrastructure.feature_flags import get_feature_flag_manager; \
manager = get_feature_flag_manager(); \
status = manager.get_all_flags(); \
enabled_count = sum(1 for s in status.values() if s['enabled']); \
print(f'Enabled flags: {enabled_count}/{len(status)}')"
```

**Expected:**
- ✅ Health check: 5/5 passing
- ✅ Feature flags operational
- ✅ No errors in logs

### Step 4: Staging Validation Period

**Duration:** 24-48 hours minimum

**Validation Tasks:**
- [ ] Run automated test suite every 6 hours
- [ ] Monitor error rates (target: < 0.1%)
- [ ] Monitor P95 latency (target: < 200ms)
- [ ] Verify OTEL traces appear in observability dashboard
- [ ] Test error handling (inject test failures)
- [ ] Test circuit breaker (simulate LLM failures)
- [ ] Verify graceful degradation works

**Approval Criteria:**
- [ ] Error rate < 0.1% for 24 hours
- [ ] P95 latency < 200ms for 24 hours
- [ ] No critical incidents
- [ ] All features operational
- [ ] Sign-off from QA team

---

## Production Deployment

### Step 1: Final Pre-Production Checklist

- [ ] Staging deployed successfully
- [ ] Staging validation period complete (24-48 hours)
- [ ] All staging approval criteria met
- [ ] Production deployment window scheduled
- [ ] Stakeholders notified
- [ ] Rollback plan reviewed
- [ ] Monitoring dashboards prepared
- [ ] On-call engineer assigned

### Step 2: Create Production Backup

```bash
# Automated backup (included in deployment script)
# Manual backup (optional)
timestamp=$(date +%Y%m%d_%H%M%S)
mkdir -p backups
tar -czf backups/genesis_backup_$timestamp.tar.gz \
    --exclude=venv --exclude=__pycache__ --exclude=.git \
    agents infrastructure config scripts

echo "Backup created: backups/genesis_backup_$timestamp.tar.gz"
```

### Step 3: Execute Production Deployment

```bash
# Set environment
export GENESIS_ENV=production

# Dry-run first (HIGHLY RECOMMENDED)
python scripts/deploy.py --environment production --dry-run

# Review dry-run output, then execute real deployment
python scripts/deploy.py --environment production
```

**Confirmation Required:**
```
⚠️  Are you sure you want to deploy to PRODUCTION? (type 'yes' to confirm):
```

Type `yes` and press Enter to proceed.

**Expected Output:**
```
================================================================================
Genesis Rebuild - PRODUCTION Deployment
================================================================================
Environment: production
Dry Run: False
================================================================================

[DEPLOY_START] Starting production deployment
[VALIDATION_COMPLETE] Validation checks completed
✅ All validation checks passed
[BACKUP_CREATED] Backup created: genesis_backup_20251018_233500.tar.gz
[DEPLOY_PRODUCTION] Production deployment complete
[DEPLOY_SUCCESS] production deployment completed successfully

================================================================================
✅ PRODUCTION DEPLOYMENT SUCCESSFUL
================================================================================
```

### Step 4: Progressive Rollout Monitoring

**Rollout Schedule (7-day progressive rollout):**

| Day | Percentage | Users Affected | Monitoring Frequency |
|-----|------------|----------------|----------------------|
| 1   | 0% → 5%    | ~5%            | Every 1 hour         |
| 2   | 5% → 10%   | ~10%           | Every 2 hours        |
| 3   | 10% → 25%  | ~25%           | Every 4 hours        |
| 4   | 25% → 50%  | ~50%           | Every 6 hours        |
| 5   | 50% → 75%  | ~75%           | Every 8 hours        |
| 6   | 75% → 100% | ~100%          | Every 12 hours       |
| 7   | 100%       | 100%           | Every 24 hours       |

**Monitoring Commands:**

```bash
# Check rollout status
python -c "from infrastructure.feature_flags import get_feature_flag_manager; \
manager = get_feature_flag_manager(); \
status = manager.get_rollout_status('phase_4_deployment'); \
print(f\"Phase: {status['phase']}\"); \
print(f\"Current %: {status['current_percentage']:.1f}%\")"

# Check health metrics
python scripts/health_check.py
```

**Rollout Thresholds (Auto-Rollback Triggers):**

- Error rate > 1.0% for 5 minutes
- P95 latency > 500ms for 5 minutes
- P99 latency > 1000ms for 5 minutes
- 5+ consecutive health check failures

### Step 5: Rollout Decision Points

At each rollout stage, validate:

```bash
# Health check
python scripts/health_check.py

# Feature flag status
python -c "from infrastructure.feature_flags import get_feature_flag_manager; \
manager = get_feature_flag_manager(); \
print(manager.get_rollout_status('phase_4_deployment'))"
```

**Go/No-Go Criteria:**
- [ ] Error rate < 0.1%
- [ ] P95 latency < 200ms
- [ ] No critical alerts
- [ ] User feedback positive
- [ ] No rollback requests

**If criteria NOT met:** Execute rollback (see Rollback Procedures below)

---

## Post-Deployment Validation

### Immediate Checks (0-1 hour)

```bash
# Run health check
python scripts/health_check.py

# Check deployment report
cat docs/deployment_production_*.json | jq '.events[] | select(.type == "DEPLOY_SUCCESS")'

# Verify feature flags
python -c "from infrastructure.feature_flags import get_feature_flag_manager; \
manager = get_feature_flag_manager(); \
print('Critical flags:', [name for name in manager.flags if manager.is_enabled(name) and 'critical' in str(manager.flags[name].to_dict())])"
```

### 24-Hour Validation

- [ ] Run full test suite
- [ ] Review error logs
- [ ] Check observability metrics
- [ ] Verify no user reports of issues
- [ ] Confirm rollout percentage progressing as scheduled

### 48-Hour Sign-Off

- [ ] Error rate trend stable
- [ ] Latency metrics within SLA
- [ ] No rollback triggered
- [ ] User feedback reviewed
- [ ] Deployment declared successful

---

## Monitoring & Alerts

### Key Metrics

1. **Error Rate**
   - Target: < 0.1%
   - Warning: 0.5%
   - Critical: 1.0%

2. **P95 Latency**
   - Target: < 100ms
   - Warning: 200ms
   - Critical: 500ms

3. **P99 Latency**
   - Target: < 200ms
   - Warning: 500ms
   - Critical: 1000ms

4. **Test Pass Rate**
   - Target: >= 98%
   - Warning: < 98%
   - Critical: < 95%

### Monitoring Commands

```bash
# Continuous monitoring (every 5 minutes)
while true; do
    echo "=== $(date) ==="
    python scripts/health_check.py
    sleep 300
done

# Check OTEL traces (if available)
# Access your observability dashboard (e.g., Grafana, Jaeger)
```

### Alert Channels

- **Slack:** #genesis-alerts (real-time)
- **PagerDuty:** On-call escalation
- **Email:** devops@genesis.ai (summary reports)

---

## Rollback Procedures

### Automated Rollback

The deployment script includes automated rollback on critical failures. No manual intervention required unless auto-rollback fails.

### Manual Rollback

**When to Rollback:**
- Error rate > 1% sustained
- P95 latency > 500ms sustained
- Critical security vulnerability discovered
- Data corruption detected
- Stakeholder decision

**Step 1: Initiate Rollback**

```bash
# Emergency rollback command
python scripts/rollback_production.sh

# Or manual rollback
latest_backup=$(ls -t backups/genesis_backup_*.tar.gz | head -1)
echo "Rolling back to: $latest_backup"
tar -xzf $latest_backup
```

**Step 2: Disable Failed Feature Flags**

```bash
# Disable problematic flags
python -c "from infrastructure.feature_flags import get_feature_flag_manager; \
manager = get_feature_flag_manager(); \
manager.set_flag('phase_4_deployment', False); \
manager.set_flag('aatc_system_enabled', False)"
```

**Step 3: Verify Rollback**

```bash
# Run health check
python scripts/health_check.py

# Verify system stability
python scripts/health_check.py
```

**Expected:**
- ✅ Health check: 5/5 passing
- ✅ Error rate returned to normal
- ✅ Latency returned to baseline

**Step 4: Post-Rollback Actions**

- [ ] Notify stakeholders
- [ ] Create incident report
- [ ] Root cause analysis
- [ ] Fix identified issues
- [ ] Re-test in staging
- [ ] Schedule re-deployment

---

## Troubleshooting

### Deployment Fails Validation

**Symptom:** `python scripts/deploy.py` fails pre-deployment checks

**Solution:**
```bash
# Identify failing check
python scripts/health_check.py

# Common fixes:
# - Test failures: pytest -x to find first failure
# - Coverage low: Add tests for uncovered modules
# - Feature flags: Validate config/feature_flags.json
# - Dependencies: pip install -r requirements_infrastructure.txt
```

### High Error Rate After Deployment

**Symptom:** Error rate > 1% in production

**Solution:**
1. Check error logs: `tail -f logs/*.log`
2. Identify error category (decomposition, routing, LLM, network, etc.)
3. If critical: Initiate rollback
4. If non-critical: Monitor for 15 minutes
5. If persists: Rollback

### High Latency After Deployment

**Symptom:** P95 latency > 500ms

**Solution:**
1. Check OTEL traces for slow operations
2. Verify HALO router performance (target: 110ms)
3. Check LLM API response times
4. If > 500ms sustained: Rollback
5. Investigate caching, indexing, batching

### Feature Flag Not Working

**Symptom:** Feature flag changes not taking effect

**Solution:**
```bash
# Reload feature flags
python -c "from infrastructure.feature_flags import get_feature_flag_manager; \
manager = get_feature_flag_manager(); \
manager.reload(); \
print('Flags reloaded')"

# Verify flag state
python -c "from infrastructure.feature_flags import get_feature_flag_manager; \
manager = get_feature_flag_manager(); \
print(manager.get_flag_status('your_flag_name'))"
```

---

## Emergency Contacts

| Role | Name | Contact | Availability |
|------|------|---------|--------------|
| Deployment Lead | Cora (QA Auditor) | cora@genesis.ai | 24/7 |
| On-Call Engineer | [TBD] | [TBD] | 24/7 |
| Platform Lead | [TBD] | [TBD] | Business hours |
| Security Lead | Hudson | hudson@genesis.ai | On-call |

### Escalation Path

1. **L1:** On-call engineer (response: 15 min)
2. **L2:** Deployment lead (response: 30 min)
3. **L3:** Platform lead (response: 1 hour)
4. **L4:** Executive team (response: 2 hours)

### Emergency Procedures

**Critical Incident (P0):**
1. Immediately initiate rollback
2. Page on-call engineer
3. Create incident channel (#incident-YYYY-MM-DD)
4. Start incident log
5. Notify stakeholders

**Emergency Shutdown:**
```bash
# Enable emergency shutdown flag
python -c "from infrastructure.feature_flags import get_feature_flag_manager; \
manager = get_feature_flag_manager(); \
manager.set_flag('emergency_shutdown', True); \
print('⛔ EMERGENCY SHUTDOWN ACTIVATED')"
```

---

## Appendix

### A. Deployment Checklist (Quick Reference)

**Pre-Deployment:**
- [ ] Tests >= 95% passing
- [ ] Coverage >= 85% (infrastructure)
- [ ] Feature flags validated
- [ ] Health check passing
- [ ] Staging approved

**During Deployment:**
- [ ] Backup created
- [ ] Deployment script executed
- [ ] Health check post-deployment passing
- [ ] Monitoring active

**Post-Deployment:**
- [ ] Rollout progressing on schedule
- [ ] Metrics within thresholds
- [ ] No critical alerts
- [ ] Stakeholders updated

### B. Feature Flag Reference

| Flag Name | Default | Production | Description |
|-----------|---------|------------|-------------|
| orchestration_enabled | ON | ON | Master orchestration switch |
| security_hardening_enabled | ON | ON | Security features |
| error_handling_enabled | ON | ON | Error handling & circuit breaker |
| otel_enabled | ON | ON | Observability tracing |
| aatc_system_enabled | OFF | STAGED | Dynamic tool/agent creation |
| phase_4_deployment | OFF | PROGRESSIVE | Production deployment flag |

### C. Performance Baselines

| Metric | Baseline | Target | Threshold |
|--------|----------|--------|-----------|
| HALO Routing | 225ms | 110ms | 200ms |
| Rule Matching | 130ms | 27ms | 50ms |
| Total Orchestration | 245ms | 132ms | 200ms |
| Error Rate | 0% | < 0.1% | < 1% |

---

**Document Version:** 1.0.0  
**Last Reviewed:** October 18, 2025  
**Next Review:** November 18, 2025  
**Approved By:** Cora (QA Auditor)

---

END OF RUNBOOK
