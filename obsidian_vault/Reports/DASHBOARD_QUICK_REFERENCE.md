---
title: Phase 5.3/5.4 Rollout Dashboard - Quick Reference Card
category: Reports
dg-publish: true
publish: true
tags:
- genesis
source: monitoring/DASHBOARD_QUICK_REFERENCE.md
exported: '2025-10-24T22:05:26.844830'
---

# Phase 5.3/5.4 Rollout Dashboard - Quick Reference Card

**Dashboard URL:** http://localhost:3000/d/phase5-rollout
**Prometheus:** http://localhost:9090
**Alertmanager:** http://localhost:9093

---

## CRITICAL METRICS AT-A-GLANCE

| Metric | Target | Alert Threshold | Action if Red |
|--------|--------|-----------------|---------------|
| **Test Pass Rate** | ≥98% | <98% for 5min | Run full test suite, identify failures |
| **Error Rate** | <0.1% | >0.1% for 2min | Check logs, investigate error source |
| **System Health** | ≥95 | <95 for 30min | Review component metrics |
| **Hybrid RAG P95** | <100ms | >100ms for 5min | Check FAISS, Redis, MongoDB |
| **RAG Accuracy** | >90% | <90% for 10min | Validate embeddings, RRF logic |
| **Cost Reduction** | 80% | <75% for 30min | **P0 BLOCKER** - Check LLM usage |
| **Monthly Cost** | $99 | >$150 for 1hr | Investigate token spikes |

---

## 5-MINUTE CHECKPOINT PROCEDURE

Every checkpoint (~52 minutes), run this checklist:

### 1. Visual Dashboard Scan (30 seconds)
- [ ] All gauges showing GREEN
- [ ] No red/orange panels
- [ ] Trend lines stable (not spiking)

### 2. Critical KPI Check (60 seconds)
- [ ] Test pass rate: **______%** (target ≥98%)
- [ ] Active failures: **______** (target 0)
- [ ] Error rate: **______%** (target <0.1%)
- [ ] System health: **______** (target ≥95)

### 3. Phase 5.3 RAG Metrics (60 seconds)
- [ ] P95 latency: **______ms** (target <100ms)
- [ ] Top-3 accuracy: **______%** (target >90%)
- [ ] Cache hit rate: **______%** (target >70%)
- [ ] RAG error rate: **______%** (target <0.1%)

### 4. Phase 5.4 Cost Metrics (60 seconds)
- [ ] Cost reduction: **______%** (target 80%)
- [ ] Monthly projection: **$______** (target $99)
- [ ] Token usage: **NORMAL / SPIKE** (within ±20% baseline)

### 5. System Health (30 seconds)
- [ ] Memory usage: **______%** (target <80%)
- [ ] CPU usage: **______%** (target <80%)
- [ ] All services UP (Prometheus targets page)

### 6. Alert Review (30 seconds)
- [ ] Alertmanager: **______ active alerts**
- [ ] If >0 alerts: Document in monitoring log

**Total Time:** ~5 minutes
**Next Checkpoint:** T+52 minutes

---

## ALERT PRIORITY RESPONSE TIMES

| Priority | Severity | Acknowledge | Resolve | Examples |
|----------|----------|-------------|---------|----------|
| **P0** | Critical Blocker | <5 min | <30 min | Cost target missed |
| **P1** | Critical | <5 min | <1 hour | Service down, SLO breach |
| **P2** | Warning | <1 hour | <4 hours | Cache degradation |
| **P3** | Info | <4 hours | <24 hours | Performance trend |

---

## COMMON ISSUES & QUICK FIXES

### Dashboard Shows "No Data"
```bash
# Check Prometheus is scraping
curl http://localhost:9090/api/v1/targets | jq '.data.activeTargets[] | {job, health}'

# Restart metrics exporter
cd /home/genesis/genesis-rebuild/monitoring
docker compose restart genesis-metrics
```

### Metrics Stale/Not Updating
```bash
# Force Prometheus reload
curl -X POST http://localhost:9090/-/reload

# Check exporter logs
docker logs genesis-metrics --tail 50
```

### High Test Failure Rate
```bash
# Run full regression suite
cd /home/genesis/genesis-rebuild
python -m pytest tests/ -v --tb=short | tee /tmp/test_run.log

# Check specific failures
grep "FAILED" /tmp/test_run.log
```

### Cost Spike Detected
```bash
# Check token usage
curl -s http://localhost:8000/metrics | grep "llm.*tokens"

# Review recent LLM calls (if logged)
tail -100 /home/genesis/genesis-rebuild/logs/infrastructure.log | grep "LLM"
```

### Memory/CPU High
```bash
# Check Docker resource usage
docker stats --no-stream

# Check host resources
htop  # (or top if htop not installed)

# Check Prometheus retention
docker compose exec prometheus df -h /prometheus
```

---

## GO/NO-GO DECISION TREE (Checkpoint 55)

```
START: Is test pass rate ≥98%?
  ├─ NO → ROLLBACK (SLO failure)
  └─ YES → Continue

Is cost reduction ≥75%?
  ├─ NO → ROLLBACK (P0 blocker)
  └─ YES → Continue

Is error rate <0.1%?
  ├─ NO → ROLLBACK (SLO failure)
  └─ YES → Continue

Are all critical services UP?
  ├─ NO → ROLLBACK (Infrastructure failure)
  └─ YES → Continue

Zero P0/P1 alerts in last 12 hours?
  ├─ NO → REVIEW (Investigate alerts)
  └─ YES → Continue

System health ≥95?
  ├─ NO → REVIEW (Check components)
  └─ YES → GO TO PRODUCTION ✅
```

---

## KEY PROMETHEUS QUERIES (Copy-Paste Ready)

### Test Pass Rate
```promql
genesis_regression_pass_rate
```

### Error Rate
```promql
(genesis_regression_tests_failed + genesis_regression_tests_errors) / genesis_regression_tests_total
```

### Hybrid RAG P95 Latency (ms)
```promql
histogram_quantile(0.95, rate(hybrid_rag_retrieval_latency_seconds_bucket[5m])) * 1000
```

### Cache Hit Rate
```promql
rate(redis_cache_hits_total[5m]) / (rate(redis_cache_hits_total[5m]) + rate(redis_cache_misses_total[5m])) * 100
```

### Cost Reduction %
```promql
(1 - (rate(total_system_cost[1h]) * 730 / 500)) * 100
```

### Monthly Cost Projection
```promql
rate(total_system_cost[1h]) * 730
```

### System Health Score
```promql
genesis_system_health
```

---

## ROLLBACK COMMAND SEQUENCE

If NO-GO decision made at Checkpoint 55:

```bash
# 1. Stop monitoring
cd /home/genesis/genesis-rebuild/monitoring
docker compose down

# 2. Disable Phase 5 features (if feature flags exist)
# export ENABLE_HYBRID_RAG=false
# export ENABLE_PHASE5_FEATURES=false

# 3. Revert to Phase 4 baseline
git checkout main  # Or specific Phase 4 commit

# 4. Validate Phase 4 tests pass
python -m pytest tests/ -v --tb=short

# 5. Document rollback reason
echo "Rollback reason: [FILL IN]" >> docs/PHASE_5_ROLLBACK_LOG.md

# 6. Notify team
# Post to #genesis-rollout with RCA
```

---

## CONTACT ESCALATION PATH

1. **First Response:** Forge (Testing Agent) - Check dashboard, run diagnostics
2. **Technical Escalation:** Alex (E2E Testing) - Full integration validation
3. **Code Review:** Hudson (Code Review) - Identify code-level issues
4. **Architecture:** Cora (Architecture Audit) - System-level design review
5. **Final Approval:** User (Product Owner) - GO/NO-GO decision

---

## CHECKPOINT LOG TEMPLATE

```
=== CHECKPOINT [NUMBER]/55 - T+[TIME] ===
Timestamp: [YYYY-MM-DD HH:MM:SS]
Reviewer: [NAME]

KPIs:
- Test Pass Rate: ____%
- Error Rate: ____%
- System Health: ____
- RAG P95 Latency: ____ms
- Cost Reduction: ____%
- Monthly Cost: $____

Active Alerts: ____
Issues Found: [NONE / LIST]
Action Taken: [NONE / DESCRIPTION]
Status: [GREEN / YELLOW / RED]

Notes:
[Any observations, trends, or concerns]

Next Checkpoint: T+[TIME]
===================================
```

---

## USEFUL LINKS

- **Full Monitoring Guide:** `/home/genesis/genesis-rebuild/docs/PHASE_5_ROLLOUT_MONITORING_GUIDE.md`
- **Dashboard Config:** `/home/genesis/genesis-rebuild/monitoring/dashboards/phase_5_rollout_dashboard.json`
- **Alert Rules:** `/home/genesis/genesis-rebuild/monitoring/alerts_phase5.yml`
- **Incident Runbook:** `/home/genesis/genesis-rebuild/docs/INCIDENT_RESPONSE.md` (if exists)
- **Phase 5 Roadmap:** `/home/genesis/genesis-rebuild/docs/PHASE_5_ROADMAP.md`

---

**PRINT THIS CARD AND KEEP NEAR YOUR WORKSTATION**

Last Updated: 2025-10-23 by Forge (Testing Agent)
