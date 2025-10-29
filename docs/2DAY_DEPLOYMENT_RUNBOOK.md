# Genesis 2-Day Production Deployment Runbook

**Version:** 2.0.0 (Compressed Timeline)
**Last Updated:** October 27, 2025
**Owner:** Hudson (Code Review & Deployment Specialist)
**Approved By:** Cora (QA Auditor), Alex (Integration Specialist)

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [2-Day Timeline Overview](#2-day-timeline-overview)
3. [Pre-Deployment Checklist](#pre-deployment-checklist)
4. [Hour-by-Hour Deployment Plan](#hour-by-hour-deployment-plan)
5. [Monitoring & Validation](#monitoring--validation)
6. [Auto-Rollback Triggers](#auto-rollback-triggers)
7. [Manual Rollback Procedures](#manual-rollback-procedures)
8. [Success Criteria](#success-criteria)
9. [Emergency Contacts](#emergency-contacts)
10. [Commands Reference](#commands-reference)

---

## Executive Summary

This runbook compresses the original 7-day progressive rollout to **48 hours** while maintaining all safety guarantees through:

- **Accelerated early stages**: Hour-level increments (not day-level)
- **Aggressive monitoring**: 1-minute metric aggregation (down from 5 minutes)
- **Automated validation**: Real-time SLO tracking with instant alerts
- **Fast rollback**: <30 seconds to disable any flag, <2 minutes full system rollback

**Key Differences from 7-Day Plan:**
- Timeline: 7 days → 48 hours (85.7% time reduction)
- Monitoring frequency: Every 6 hours → Every 15 minutes
- Validation windows: 24 hours → 8 hours (at critical stages)
- Alert sensitivity: Increased 5x for early detection

**Risk Mitigation:**
- Phase 1-4 systems are battle-tested (1,026/1,044 tests passing)
- Phase 6 optimizations validated (227/229 tests passing)
- Auto-rollback on any SLO violation
- Human oversight at every stage gate

---

## 2-Day Timeline Overview

### HYBRID Plan (RECOMMENDED)

**Rationale:** Balances speed with safety. Accelerates through well-tested systems (Phase 1-4), cautious with cutting-edge optimizations (Phase 6).

```
┌─────────────────────────────────────────────────────────────────┐
│                    2-DAY ROLLOUT TIMELINE                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  DAY 1 (0-24 hours):                                            │
│  ├─ Hour 0-8:   30% traffic (8h validation)                    │
│  │   Focus: Phase 1-4 systems (orchestration core)             │
│  │   Flags: HTDAG, HALO, AOP, DAAO → 100%                      │
│  │   Monitoring: Every 15 minutes                               │
│  │                                                              │
│  ├─ Hour 8-16:  60% traffic (8h validation)                    │
│  │   Focus: Phase 5 systems (Darwin, A2A, WaltzRL)            │
│  │   Flags: darwin → 50%, a2a → 50%, waltzrl → 25%            │
│  │   Monitoring: Every 15 minutes                               │
│  │                                                              │
│  └─ Hour 16-24: 85% traffic (8h validation)                    │
│      Focus: Phase 6 tier 1-2 (SGLang, CaseBank, vLLM)         │
│      Flags: sglang → 50%, casebank → 50%, vllm → 50%          │
│      Monitoring: Every 10 minutes                               │
│                                                                  │
│  DAY 2 (24-48 hours):                                           │
│  ├─ Hour 24-32: 100% traffic (8h validation)                   │
│  │   Focus: Phase 6 tier 3 (OpenEnv, Long-Context)            │
│  │   Flags: openenv → 25%, longcontext → 25%                  │
│  │   Monitoring: Every 10 minutes                               │
│  │                                                              │
│  ├─ Hour 32-40: 100% traffic (8h validation)                   │
│  │   Focus: All flags → 100% (full system)                    │
│  │   Flags: ALL Phase 6 → 100%                                 │
│  │   Monitoring: Every 5 minutes                                │
│  │                                                              │
│  └─ Hour 40-48: 100% traffic (8h observation)                  │
│      Focus: Final validation + reporting                        │
│      Monitoring: Every 15 minutes                               │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Key Metrics Tracked:**
- Test pass rate (target: ≥98%)
- Error rate (target: <0.1%)
- P95 latency (target: <200ms)
- Cost per request (validate Phase 6 savings)
- Memory usage (stable)

**Stage Gates (Go/No-Go):**
1. Hour 8: Phase 1-4 stability confirmed
2. Hour 16: Phase 5 integration validated
3. Hour 24: Phase 6 tier 1-2 performance confirmed
4. Hour 32: Phase 6 tier 3 safety validated
5. Hour 40: Full system 100% approved

---

## Pre-Deployment Checklist

### Infrastructure Ready (30 minutes)

- [ ] **Monitoring Stack Running**
  ```bash
  cd /home/genesis/genesis-rebuild/monitoring
  docker-compose ps
  # Expected: prometheus, grafana, alertmanager all "Up"
  ```

- [ ] **Health Tests Passing**
  ```bash
  pytest tests/test_production_health.py -v
  # Expected: ≥35/36 passing (97.2%+)
  ```

- [ ] **Feature Flags Validated**
  ```bash
  python3 -c "from infrastructure.feature_flags import get_feature_flag_manager; \
  manager = get_feature_flag_manager(); \
  print(f'{len(manager.flags)} flags configured')"
  # Expected: 17+ flags
  ```

- [ ] **Continuous Monitoring Started**
  ```bash
  nohup ./scripts/continuous_monitoring.sh --loop > /dev/null 2>&1 &
  ps aux | grep continuous_monitoring
  # Expected: Process running
  ```

### Team Ready (15 minutes)

- [ ] **On-call engineer assigned** (Response time: <5 minutes)
- [ ] **Deployment lead available** (Hudson)
- [ ] **Incident channel created** (#deployment-2025-10-27)
- [ ] **Stakeholders notified** (Email sent)

### System Ready (15 minutes)

- [ ] **Git status clean** (no uncommitted changes)
- [ ] **Backups created** (last 24 hours)
- [ ] **Rollback tested** (dry-run successful)
- [ ] **Alert routing configured** (Slack/PagerDuty)

---

## Hour-by-Hour Deployment Plan

### DAY 1: Hours 0-8 (Phase 1-4 Rollout)

**Target:** 30% traffic on battle-tested orchestration core

**Stage 1.1: Hour 0-2 (Initialize)**
```bash
# Start 2-day rollout (HYBRID plan)
./scripts/deploy_2day_rollout.sh hybrid

# Verify initial state
python3 -c "from infrastructure.feature_flags import get_feature_flag_manager; \
manager = get_feature_flag_manager(); \
print('Orchestration:', manager.is_enabled('orchestration_enabled'))"

# Expected output:
# 🚀 Starting 2-day progressive rollout: hybrid
# 📊 Deploying to 30% traffic for 8h
```

**Flags Updated:**
- `orchestration_enabled`: 100% ✅
- `htdag_enabled`: 100% ✅
- `halo_enabled`: 100% ✅
- `aop_enabled`: 100% ✅
- `daao_enabled`: 100% ✅
- `error_handling_enabled`: 100% ✅
- `otel_enabled`: 100% ✅

**Validation (Every 15 minutes):**
```bash
# Check metrics
curl -s http://localhost:9090/api/v1/query?query=test_pass_rate | jq '.data.result[0].value[1]'
# Expected: "98" or higher

# Check health
pytest tests/test_production_health.py::TestProductionSLOs -v
# Expected: All passing
```

**Go/No-Go Criteria (Hour 8):**
- [ ] Test pass rate ≥98% for 6+ consecutive checks
- [ ] Error rate <0.1% for entire period
- [ ] P95 latency <200ms average
- [ ] Zero critical alerts
- [ ] HTDAG/HALO/AOP operational

**Stage 1.2: Hour 2-4 (Stabilization)**
- Continue monitoring every 15 minutes
- Validate DAAO cost routing (should see cheaper model usage)
- Check OTEL traces (distributed tracing working)

**Stage 1.3: Hour 4-6 (Performance Validation)**
- Validate 46.3% performance improvement
- Check HALO routing speed (target: 110ms avg)
- Verify circuit breaker operational

**Stage 1.4: Hour 6-8 (Final Phase 1-4 Validation)**
- Run full test suite: `pytest --tb=short -v`
- Check error handler logs
- Validate security hardening active

---

### DAY 1: Hours 8-16 (Phase 5 Rollout)

**Target:** 60% traffic on self-improving agents + A2A + WaltzRL

**Stage 2.1: Hour 8-10 (Darwin Integration)**
```bash
# Enable Darwin (self-improving agents)
python3 -c "from infrastructure.feature_flags import get_feature_flag_manager; \
manager = get_feature_flag_manager(); \
manager.set_flag('darwin_integration_enabled', True); \
manager.update_rollout_percentage('darwin_integration_enabled', 50)"
```

**Flags Updated:**
- `darwin_integration_enabled`: 0% → 50%
- Traffic: 30% → 45%

**Validation:**
```bash
# Check Darwin metrics
pytest tests/test_se_darwin_comprehensive_e2e.py -v
# Expected: 31/31 passing

# Verify trajectory pool operational
pytest tests/test_trajectory_pool.py -v
# Expected: 37/37 passing
```

**Stage 2.2: Hour 10-12 (A2A Integration)**
```bash
# Enable A2A protocol
python3 -c "from infrastructure.feature_flags import get_feature_flag_manager; \
manager = get_feature_flag_manager(); \
manager.set_flag('a2a_integration_enabled', True); \
manager.update_rollout_percentage('a2a_integration_enabled', 50)"
```

**Flags Updated:**
- `a2a_integration_enabled`: 0% → 50%
- Traffic: 45% → 52.5%

**Validation:**
```bash
# Check A2A connectivity
pytest tests/test_a2a_integration.py -v
# Expected: 24/24 passing

# Verify agent registry
pytest tests/test_a2a_advanced.py -v
# Expected: 28/28 passing
```

**Stage 2.3: Hour 12-14 (WaltzRL Safety)**
```bash
# Increase WaltzRL rollout
python3 -c "from infrastructure.feature_flags import get_feature_flag_manager; \
manager = get_feature_flag_manager(); \
manager.set_flag('waltzrl_safety_enabled', True); \
manager.update_rollout_percentage('waltzrl_safety_enabled', 25)"
```

**Flags Updated:**
- `waltzrl_safety_enabled`: 10% → 25%
- Traffic: 52.5% → 60%

**Validation:**
```bash
# Check WaltzRL safety
pytest tests/test_waltzrl_modules.py -v
# Expected: 44/44 passing

# Verify refusal rewriting
pytest tests/test_waltzrl_refusal_rewriting.py -v
# Expected: 16/16 passing
```

**Go/No-Go Criteria (Hour 16):**
- [ ] Darwin evolution functional (trajectory pool operational)
- [ ] A2A agent communication working (54/56 tests passing)
- [ ] WaltzRL safety active (89% unsafe reduction validated)
- [ ] No performance regression
- [ ] Error rate still <0.1%

**Stage 2.4: Hour 14-16 (Phase 5 Validation)**
- Validate all Phase 5 systems integrated
- Check for memory leaks
- Verify self-improvement metrics

---

### DAY 1: Hours 16-24 (Phase 6 Tier 1-2 Rollout)

**Target:** 85% traffic on cost optimizations (SGLang, CaseBank, vLLM)

**Stage 3.1: Hour 16-18 (SGLang Router)**
```bash
# Enable SGLang intelligent routing
python3 -c "from infrastructure.feature_flags import get_feature_flag_manager; \
manager = get_feature_flag_manager(); \
manager.set_flag('sglang_router_enabled', True); \
manager.update_rollout_percentage('sglang_router_enabled', 50)"
```

**Flags Updated:**
- `sglang_router_enabled`: 0% → 50%
- Traffic: 60% → 70%

**Expected Impact:**
- 74.8% cost reduction should become visible
- Vision detection active (8 keywords → Gemini)
- Critical agent protection (7 agents → Sonnet)

**Validation:**
```bash
# Check SGLang routing
pytest tests/test_sglang_router.py -v
# Expected: 29/29 passing

# Verify cost reduction
# Check logs for "Model routed: gemini-2.5-flash" (should increase)
tail -100 logs/sglang_router.log | grep "gemini-2.5-flash" | wc -l
# Expected: >50% of requests
```

**Stage 3.2: Hour 18-20 (CaseBank Memory)**
```bash
# Enable Memento CaseBank
python3 -c "from infrastructure.feature_flags import get_feature_flag_manager; \
manager = get_feature_flag_manager(); \
manager.set_flag('casebank_memory_enabled', True); \
manager.update_rollout_percentage('casebank_memory_enabled', 50)"
```

**Flags Updated:**
- `casebank_memory_enabled`: 0% → 50%
- Traffic: 70% → 77.5%

**Expected Impact:**
- 15-25% accuracy boost
- Zero fine-tuning cost
- K=4 case retrieval active

**Validation:**
```bash
# Check CaseBank memory
pytest tests/test_casebank_memory.py -v
# Expected: 38/38 passing

# Verify retrieval active
# Check for case retrievals in logs
tail -100 logs/casebank.log | grep "Retrieved cases" | wc -l
# Expected: >0
```

**Stage 3.3: Hour 20-22 (vLLM Token Caching)**
```bash
# Enable vLLM Agent-Lightning
python3 -c "from infrastructure.feature_flags import get_feature_flag_manager; \
manager = get_feature_flag_manager(); \
manager.set_flag('vllm_caching_enabled', True); \
manager.update_rollout_percentage('vllm_caching_enabled', 50)"
```

**Flags Updated:**
- `vllm_caching_enabled`: 0% → 50%
- Traffic: 77.5% → 85%

**Expected Impact:**
- 84% RAG latency reduction (500ms → 81ms)
- Token cache hit rate >60%

**Validation:**
```bash
# Check vLLM caching
pytest tests/test_vllm_caching.py -v
# Expected: 26/26 passing

# Verify cache hits
curl -s http://localhost:9090/api/v1/query?query=vllm_cache_hit_rate | jq '.data.result[0].value[1]'
# Expected: >0.6 (60%+)
```

**Go/No-Go Criteria (Hour 24):**
- [ ] Cost reduction visible (74.8% from SGLang)
- [ ] Accuracy improvement confirmed (15-25% from CaseBank)
- [ ] Latency reduced (84% from vLLM)
- [ ] No system instability
- [ ] All Phase 6 Tier 1-2 tests passing

**Stage 3.4: Hour 22-24 (Tier 1-2 Validation)**
- Monitor cost metrics (should see dramatic reduction)
- Validate cache hit rates
- Check memory usage (should be stable)

---

### DAY 2: Hours 24-32 (Phase 6 Tier 3 Rollout)

**Target:** 100% traffic with final optimizations (OpenEnv, Long-Context)

**Stage 4.1: Hour 24-26 (OpenEnv External-Tool)**
```bash
# Enable OpenEnv integration reliability
python3 -c "from infrastructure.feature_flags import get_feature_flag_manager; \
manager = get_feature_flag_manager(); \
manager.set_flag('openenv_enabled', True); \
manager.update_rollout_percentage('openenv_enabled', 25)"
```

**Flags Updated:**
- `openenv_enabled`: 0% → 25%
- Traffic: 85% → 88.75%

**Expected Impact:**
- 60% integration reliability improvement
- Docker-based external tool execution

**Validation:**
```bash
# Check OpenEnv integration
pytest tests/test_se_darwin_docker_scenarios.py -v
# Expected: Tests passing

# Verify Docker execution
docker ps | grep openenv
# Expected: Containers running
```

**Stage 4.2: Hour 26-28 (Long-Context Profiles)**
```bash
# Enable context profile optimization
python3 -c "from infrastructure.feature_flags import get_feature_flag_manager; \
manager = get_feature_flag_manager(); \
manager.set_flag('longcontext_profiles_enabled', True); \
manager.update_rollout_percentage('longcontext_profiles_enabled', 25)"
```

**Flags Updated:**
- `longcontext_profiles_enabled`: 0% → 25%
- Traffic: 88.75% → 92.2%

**Expected Impact:**
- 40-60% memory cost reduction
- Context compression active

**Stage 4.3: Hour 28-30 (Increase to 100%)**
```bash
# Increase all Phase 6 flags to 100%
./scripts/update_phase6_flags.sh 100
```

**Flags Updated:**
- ALL Phase 6 flags: 50%/25% → 100%
- Traffic: 92.2% → 100%

**Go/No-Go Criteria (Hour 32):**
- [ ] OpenEnv integration stable (60% reliability confirmed)
- [ ] Context profiles reducing memory costs (40-60%)
- [ ] Combined system metrics healthy
- [ ] 100% traffic handling without issues

**Stage 4.4: Hour 30-32 (100% Traffic Validation)**
- Monitor full system under 100% load
- Validate ALL optimizations active
- Check combined cost reduction (88-92% target)

---

### DAY 2: Hours 32-40 (Full System Validation)

**Target:** 100% traffic on complete optimized system

**Stage 5.1: Hour 32-36 (Stability Check)**

**Monitoring (Every 5 minutes):**
```bash
# Comprehensive health check
./scripts/continuous_monitoring.sh

# Check all metrics
curl -s http://localhost:9090/api/v1/query?query=test_pass_rate | jq
curl -s http://localhost:9090/api/v1/query?query=error_rate | jq
curl -s http://localhost:9090/api/v1/query?query=p95_latency | jq
```

**Validation:**
- [ ] Test pass rate ≥98%
- [ ] Error rate <0.1%
- [ ] P95 latency <200ms
- [ ] Cost reduction 88-92% confirmed
- [ ] Memory usage stable

**Stage 5.2: Hour 36-40 (Performance Validation)**

Run comprehensive test suite:
```bash
# Full system tests
pytest --tb=short -v

# Expected: 227/229 tests passing (99.1%)

# Performance benchmarks
pytest tests/test_performance.py -v

# Integration tests
pytest tests/test_orchestration_e2e.py -v
```

**Go/No-Go Criteria (Hour 40):**
- [ ] ALL tests passing (≥99%)
- [ ] Cost reduction validated ($500 → $40-60/month)
- [ ] Latency improvements confirmed (84% RAG reduction)
- [ ] Zero critical incidents
- [ ] Stakeholder approval received

---

### DAY 2: Hours 40-48 (Final Observation)

**Target:** Continuous monitoring + reporting

**Stage 6.1: Hour 40-44 (Observation)**

Continue monitoring with reduced frequency (every 15 minutes):
```bash
# Monitor logs
tail -f logs/continuous_monitoring.log

# Check Grafana dashboard
# URL: http://localhost:3000
```

**Stage 6.2: Hour 44-48 (Reporting)**

Generate deployment report:
```bash
# Create 48-hour report
./scripts/generate_deployment_report.sh

# Output: docs/DEPLOYMENT_REPORT_2025-10-27.md
```

**Final Checklist:**
- [ ] 48-hour monitoring complete
- [ ] All SLOs met continuously
- [ ] Cost savings confirmed
- [ ] Performance improvements validated
- [ ] Deployment declared successful
- [ ] Documentation updated

---

## Monitoring & Validation

### Real-Time Metrics Dashboard

**Grafana URL:** http://localhost:3000
**Username:** admin
**Password:** admin

**Key Panels:**
1. Test Pass Rate (SLO: ≥98%)
2. Error Rate (SLO: <0.1%)
3. P95 Latency (SLO: <200ms)
4. Cost Per Request (Track reduction)
5. System Resource Usage
6. Active Alerts

### Automated Monitoring Script

**Location:** `/home/genesis/genesis-rebuild/scripts/continuous_monitoring.sh`

**Run in background:**
```bash
nohup ./scripts/continuous_monitoring.sh --loop >> logs/continuous_monitoring.log 2>&1 &
```

**Check status:**
```bash
tail -f logs/continuous_monitoring.log
```

### Metric Aggregation Windows

**Compressed from 7-day plan:**
- Prometheus scrape interval: 5s (was 15s)
- Metric aggregation: 1min (was 5min)
- Alert evaluation: 15s (was 60s)

**Rationale:** 5x faster feedback loops enable early detection during compressed timeline.

---

## Auto-Rollback Triggers

### Critical Triggers (Immediate Rollback)

**Trigger 1: Test Pass Rate Drop**
```yaml
alert: TestPassRateCritical
expr: test_pass_rate < 95
for: 2m
severity: critical
action: IMMEDIATE_ROLLBACK
```

**Trigger 2: High Error Rate**
```yaml
alert: ErrorRateSpike
expr: error_rate > 1.0
for: 1m
severity: critical
action: IMMEDIATE_ROLLBACK
```

**Trigger 3: Extreme Latency**
```yaml
alert: LatencyExtreme
expr: p95_latency > 500
for: 2m
severity: critical
action: IMMEDIATE_ROLLBACK
```

**Trigger 4: Service Down**
```yaml
alert: ServiceDown
expr: up{job="genesis"} == 0
for: 1m
severity: critical
action: IMMEDIATE_ROLLBACK
```

### Automated Rollback Process

**Step 1: Alert Detected**
- Prometheus evaluates alert rules every 15 seconds
- Alert fires if condition met for threshold duration
- Alertmanager receives alert

**Step 2: Rollback Initiated**
```bash
# Automated rollback script triggered
./scripts/emergency_rollback.sh

# Actions performed:
# 1. Disable all Phase 6 flags (instant)
# 2. Reduce traffic to safe state (30%)
# 3. Notify on-call engineer (Slack/PagerDuty)
# 4. Create incident report
```

**Step 3: Verification**
```bash
# Health check after rollback
pytest tests/test_production_health.py -v

# Expected: System stable at 30% traffic
```

**Timeline:** <2 minutes from alert to safe state

---

## Manual Rollback Procedures

### Scenario 1: Partial Rollback (Single Flag)

**When:** Single feature causing issues, others healthy

**Steps:**
```bash
# 1. Identify problematic flag
# Example: vLLM caching causing memory issues

# 2. Disable flag
python3 -c "from infrastructure.feature_flags import get_feature_flag_manager; \
manager = get_feature_flag_manager(); \
manager.set_flag('vllm_caching_enabled', False)"

# 3. Verify system stable
pytest tests/test_production_health.py -v

# 4. Continue with other flags enabled
```

**Timeline:** <1 minute

### Scenario 2: Phase Rollback (Tier Rollback)

**When:** Entire phase (e.g., Phase 6) needs rollback

**Steps:**
```bash
# 1. Rollback Phase 6
./scripts/rollback_phase.sh phase_6

# 2. System returns to Phase 5 state
# 3. Verify stability
pytest --tb=short -v

# 4. Investigate issues
tail -100 logs/deployment.log
```

**Timeline:** <5 minutes

### Scenario 3: Full Rollback (Emergency)

**When:** Critical system instability

**Steps:**
```bash
# 1. Emergency shutdown
python3 -c "from infrastructure.feature_flags import get_feature_flag_manager; \
manager = get_feature_flag_manager(); \
manager.set_flag('emergency_shutdown', True)"

# 2. All new requests rejected
# 3. Drain existing requests (60s)

# 4. Restore from backup
tar -xzf backups/genesis_backup_$(date +%Y%m%d)*.tar.gz

# 5. Restart services
./scripts/restart_services.sh
```

**Timeline:** <15 minutes (guaranteed)

---

## Success Criteria

### Stage Gates (5 Total)

**Gate 1 (Hour 8): Phase 1-4 Stability**
- [ ] Test pass rate ≥98% for 6+ consecutive checks (90 min total)
- [ ] Error rate <0.1% for entire 8-hour period
- [ ] P95 latency <200ms average
- [ ] HTDAG/HALO/AOP operational (verified by tests)
- [ ] DAAO cost routing active (logs confirm cheaper models used)

**Gate 2 (Hour 16): Phase 5 Integration**
- [ ] Darwin evolution functional (trajectory pool operational)
- [ ] A2A connectivity established (54/56 tests passing)
- [ ] WaltzRL safety active (89% unsafe reduction in metrics)
- [ ] No performance regression from baseline
- [ ] Memory usage stable (<80%)

**Gate 3 (Hour 24): Phase 6 Tier 1-2 Performance**
- [ ] Cost reduction visible (SGLang 74.8% confirmed in metrics)
- [ ] Accuracy improvement (CaseBank 15-25% validated)
- [ ] Latency reduced (vLLM 84% confirmed)
- [ ] Cache hit rate >60%
- [ ] System handling 85% traffic smoothly

**Gate 4 (Hour 32): Phase 6 Tier 3 Safety**
- [ ] OpenEnv integration stable (60% reliability confirmed)
- [ ] Context profiles reducing costs (40-60% validated)
- [ ] 100% traffic handling without issues
- [ ] Combined cost reduction 88-92% confirmed
- [ ] All Phase 6 tests passing (227/229)

**Gate 5 (Hour 40): Full System Approval**
- [ ] Continuous stability for 8+ hours at 100%
- [ ] Cost savings validated ($500 → $40-60/month)
- [ ] Performance improvements confirmed (84% latency reduction)
- [ ] Zero critical incidents
- [ ] Stakeholder sign-off received

### Final Deployment Success

**Criteria:**
- [ ] 48-hour monitoring complete (no rollbacks)
- [ ] All SLOs met continuously (≥98%, <0.1%, <200ms)
- [ ] Cost reduction achieved (88-92%)
- [ ] Latency improvements validated (84% RAG, 48% system)
- [ ] Accuracy improvements confirmed (53% combined)
- [ ] Zero data loss or corruption
- [ ] All stakeholders approve
- [ ] Documentation updated

---

## Emergency Contacts

### On-Call Rotation

| Role | Name | Contact | Availability | Response Time |
|------|------|---------|--------------|---------------|
| Deployment Lead | Hudson | hudson@genesis.ai | 24/7 | 5 min |
| QA Auditor | Cora | cora@genesis.ai | 24/7 | 5 min |
| Integration Lead | Alex | alex@genesis.ai | Business hours | 15 min |
| Platform Engineer | Forge | forge@genesis.ai | Business hours | 15 min |
| Security Lead | Zenith | zenith@genesis.ai | On-call | 30 min |

### Escalation Path

**Level 1:** On-call engineer (Hudson/Cora)
**Level 2:** Integration + Platform (Alex/Forge)
**Level 3:** Security + Executive (Zenith/Executive team)

### Communication Channels

**Primary:** #deployment-2025-10-27 (Slack)
**Alerts:** #genesis-alerts (Slack)
**PagerDuty:** genesis-production (critical only)
**Email:** devops@genesis.ai (summaries)

### Emergency Decision Authority

**Rollback Decision:** Hudson (Deployment Lead) - Unilateral authority
**Abort Deployment:** Hudson + Cora (joint decision)
**Emergency Shutdown:** Any on-call engineer

---

## Commands Reference

### Deployment Control

```bash
# Start 2-day rollout
./scripts/deploy_2day_rollout.sh hybrid

# Check deployment status
./scripts/deploy_2day_rollout.sh status

# Pause deployment (at current stage)
./scripts/deploy_2day_rollout.sh pause

# Resume deployment
./scripts/deploy_2day_rollout.sh resume

# Abort deployment (emergency)
./scripts/deploy_2day_rollout.sh abort
```

### Monitoring

```bash
# Check all metrics
curl -s http://localhost:9090/api/v1/query?query=test_pass_rate | jq
curl -s http://localhost:9090/api/v1/query?query=error_rate | jq
curl -s http://localhost:9090/api/v1/query?query=p95_latency | jq

# Run health tests
pytest tests/test_production_health.py -v

# Check continuous monitoring
tail -f logs/continuous_monitoring.log

# View metrics snapshot
jq '.[-10:]' monitoring/metrics_snapshot.json
```

### Feature Flag Management

```bash
# Check flag status
python3 -c "from infrastructure.feature_flags import get_feature_flag_manager; \
manager = get_feature_flag_manager(); \
print(manager.get_all_flags())"

# Update single flag
python3 -c "from infrastructure.feature_flags import get_feature_flag_manager; \
manager = get_feature_flag_manager(); \
manager.set_flag('FLAG_NAME', True)"

# Update rollout percentage
python3 -c "from infrastructure.feature_flags import get_feature_flag_manager; \
manager = get_feature_flag_manager(); \
manager.update_rollout_percentage('FLAG_NAME', 50)"
```

### Rollback

```bash
# Emergency full rollback
./scripts/emergency_rollback.sh

# Phase-specific rollback
./scripts/rollback_phase.sh phase_6

# Single flag rollback
python3 -c "from infrastructure.feature_flags import get_feature_flag_manager; \
manager = get_feature_flag_manager(); \
manager.set_flag('FLAG_NAME', False)"
```

### Reporting

```bash
# Generate deployment report
./scripts/generate_deployment_report.sh

# Check deployment metrics
./scripts/calculate_deployment_metrics.sh

# Export logs
tar -czf deployment_logs_$(date +%Y%m%d).tar.gz logs/
```

---

## Risk Assessment

### High-Risk Stages

**Stage 3 (Hours 16-24): Phase 6 Tier 1-2**
- Risk: Major architecture changes (SGLang routing, CaseBank memory)
- Mitigation: Extended validation (8 hours), increased monitoring (every 10 min)
- Rollback ready: <1 minute to disable flags

**Stage 4 (Hours 24-32): Phase 6 Tier 3 + 100% Traffic**
- Risk: Untested at full scale (OpenEnv, long-context profiles)
- Mitigation: Gradual 25% → 100%, continuous monitoring (every 5 min)
- Rollback ready: <2 minutes full system rollback

### Risk Comparison: 7-Day vs 2-Day

| Risk Factor | 7-Day Plan | 2-Day Plan | Mitigation |
|-------------|------------|------------|------------|
| Detection Speed | 6-24h | 15min-8h | 5x faster monitoring |
| Validation Time | 24h/stage | 8h/stage | Automated health checks |
| Rollback Speed | <15min | <2min | Instant flag disable |
| User Impact | Lower (gradual) | Moderate (faster) | Auto-rollback on issues |
| Engineering Effort | Lower (passive) | Higher (active) | Dedicated on-call |

**Overall Risk:** MODERATE (acceptable with proper monitoring)

---

## Post-Deployment Actions

### Hour 48: Deployment Complete

1. **Generate Final Report**
   ```bash
   ./scripts/generate_deployment_report.sh
   ```

2. **Stakeholder Update**
   - Send completion email
   - Post to #announcements
   - Update PROJECT_STATUS.md

3. **Reduce Monitoring Frequency**
   ```bash
   # Stop 5-minute monitoring
   pkill -f continuous_monitoring.sh

   # Add hourly cron job
   crontab -e
   # Add: 0 * * * * /home/genesis/genesis-rebuild/scripts/continuous_monitoring.sh
   ```

4. **Schedule Post-Mortem**
   - Review incidents (if any)
   - Document lessons learned
   - Update runbooks

5. **Plan Next Steps**
   - Monitor cost reduction weekly
   - Validate performance improvements
   - Prepare for next optimization phase

---

**Document Version:** 2.0.0
**Last Reviewed:** October 27, 2025
**Next Review:** November 27, 2025
**Approved By:** Hudson (Deployment Lead), Cora (QA Auditor)

---

END OF RUNBOOK
