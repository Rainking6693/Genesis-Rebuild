---
title: Phase 5.3/5.4 Production Rollout - 48-Hour Monitoring Guide
category: Guides
dg-publish: true
publish: true
tags:
- genesis
source: docs/PHASE_5_ROLLOUT_MONITORING_GUIDE.md
exported: '2025-10-24T22:05:26.951789'
---

# Phase 5.3/5.4 Production Rollout - 48-Hour Monitoring Guide

**Status:** ACTIVE MONITORING
**Dashboard:** http://localhost:3000/d/phase5-rollout
**Duration:** 48 hours (55 checkpoints every ~52 minutes)
**Start Time:** 2025-10-23 20:56 UTC
**End Time:** 2025-10-25 20:56 UTC

---

## EXECUTIVE SUMMARY

This guide documents the 48-hour production monitoring period for Phase 5.3 (Hybrid RAG) and Phase 5.4 (P2 enhancements) rollout. The monitoring infrastructure tracks:

1. **Hybrid RAG Performance:** Retrieval latency, accuracy, cache efficiency
2. **Cost Optimization:** 80% reduction target ($500→$99/month)
3. **System Health:** Test pass rates, error rates, resource utilization
4. **Regression Prevention:** Phase 1-4 baseline comparisons

---

## MONITORING INFRASTRUCTURE

### Stack Components

All services running via Docker Compose (`/home/genesis/genesis-rebuild/monitoring/docker-compose.yml`):

- **Prometheus** (localhost:9090): Metrics collection, 15s scrape interval, 30-day retention
- **Grafana** (localhost:3000): Visualization dashboard, 30s auto-refresh
- **Alertmanager** (localhost:9093): Alert routing and notifications
- **Node Exporter** (localhost:9100): System metrics (CPU, memory, disk)
- **Genesis Metrics Exporter** (localhost:8000): Test suite metrics

**Service Status Check:**
```bash
cd /home/genesis/genesis-rebuild/monitoring
docker compose ps
```

**Expected Output:**
```
NAME              STATUS
prometheus        Up 22 hours
grafana           Up 22 hours
alertmanager      Up 22 hours
node-exporter     Up 22 hours
genesis-metrics   Up 22 hours
```

---

## DASHBOARD ACCESS

### Grafana Login
- **URL:** http://localhost:3000
- **Username:** `admin`
- **Password:** `admin` (default, change on first login)

### Phase 5 Rollout Dashboard
- **Direct Link:** http://localhost:3000/d/phase5-rollout
- **Dashboard Name:** "Genesis Phase 5.3/5.4 Production Rollout - 48 Hour Dashboard"
- **UID:** `phase5-rollout`
- **Tags:** genesis, phase-5, hybrid-rag, rollout, production

### Dashboard Sections

#### 1. **Rollout Status Header**
- Live monitoring window (48-hour timeframe)
- SLO targets: Test ≥98%, Error <0.1%, Latency <200ms, Cost -80%

#### 2. **Critical KPIs (Top Row)**
- **Overall Test Pass Rate:** Gauge showing current pass rate vs 98% SLO
- **Active Test Failures:** Count of failed + errored tests
- **Error Rate:** Current error rate vs 0.1% SLO
- **System Health Score:** Overall health (0-100 scale)

#### 3. **Hybrid RAG Metrics**
- **Retrieval Latency (P50/P95/P99):** Target P95 <100ms (validated <50ms)
- **Cache Performance:** Redis + Vector DB cache hit rates
- **Query Throughput:** Hybrid RAG, Vector DB, Graph DB queries/sec
- **Retrieval Accuracy:** Top-3 accuracy (target >90%, validated 94.8%)
- **RAG Error Rate:** Memory system error rate

#### 4. **Cost Optimization Metrics**
- **Cost Breakdown:** LLM API, Memory Storage, Vector DB costs (stacked)
- **Cost Reduction %:** Current reduction vs 80% target
- **Token Usage Rate:** Input/output tokens per second
- **Monthly Projection:** Real-time cost projection

#### 5. **System Health**
- **Memory Usage:** System RAM utilization
- **CPU Usage:** System CPU utilization
- **Database Connections:** MongoDB, Redis, Vector DB active connections
- **Test Pass Rate Trend:** 48-hour trend line

---

## KEY METRICS REFERENCE

### Phase 5.3 Hybrid RAG Metrics

| Metric | Target | Alert Threshold | Current Baseline |
|--------|--------|-----------------|------------------|
| P95 Retrieval Latency | <100ms | >100ms (P1) | ~50ms (validated) |
| Top-3 Accuracy | >90% | <90% (P1) | 94.8% (validated) |
| Cache Hit Rate | >70% | <70% (P2) | TBD (monitoring) |
| RAG Error Rate | <0.1% | >0.1% (P1) | TBD (monitoring) |
| Vector DB P95 Latency | <50ms | >50ms (P2) | TBD (monitoring) |

### Phase 5.4 Cost Optimization Metrics

| Metric | Target | Alert Threshold | Current Baseline |
|--------|--------|-----------------|------------------|
| Total Monthly Cost | $99/month | >$150/mo (P1) | $500/mo (pre-Phase 5) |
| Cost Reduction % | 80% | <75% (P0) | 52% (Phase 4 DAAO+TUMIX) |
| LLM Token Usage | Baseline ±20% | +100% spike (P2) | TBD (monitoring) |
| Memory Storage Cost | Part of total | Trending up (P3) | TBD (monitoring) |

### System-Wide SLOs

| Metric | SLO | Alert Threshold | Phase 4 Baseline |
|--------|-----|-----------------|------------------|
| Test Pass Rate | ≥98% | <98% (P1) | 98.28% (1,026/1,044) |
| Error Rate | <0.1% | >0.1% (P1) | ~0.1% (validated) |
| P95 Latency | <200ms | >200ms (P1) | 131.57ms (46.3% faster) |
| System Health | ≥95 | <95 (P2) | 98.62 (current) |
| Memory Usage | <80% | >85% (P2) | TBD (monitoring) |
| CPU Usage | <80% | >85% (P2) | TBD (monitoring) |

---

## 48-HOUR CHECKPOINT SCHEDULE

**Total Checkpoints:** 55 (every 52 minutes 8 seconds)
**Calculation:** 48 hours = 2,880 minutes ÷ 55 checkpoints = 52.36 minutes/checkpoint

### Checkpoint Actions (Every 52 Minutes)

1. **Review Dashboard:** Check all panels for anomalies
2. **Verify SLOs:** Confirm pass rate ≥98%, error rate <0.1%, latency <200ms
3. **Cost Validation:** Check cost reduction trending toward 80%
4. **Alert Review:** Check Alertmanager for active alerts
5. **Log Spot Check:** Sample `/home/genesis/genesis-rebuild/logs/` for errors
6. **Document Findings:** Note any deviations in monitoring log

### Critical Checkpoints (Manual Review Required)

- **Checkpoint 1 (T+0:52):** Initial rollout validation
- **Checkpoint 14 (T+12:00):** Half-day review
- **Checkpoint 28 (T+24:00):** Mid-rollout review (CRITICAL)
- **Checkpoint 42 (T+36:00):** Three-quarter review
- **Checkpoint 55 (T+48:00):** Final rollout validation (GO/NO-GO decision)

---

## ALERT RULES & RESPONSE

### Critical Alerts (P0/P1) - IMMEDIATE ACTION REQUIRED

#### Hybrid RAG Alerts

| Alert | Condition | Response |
|-------|-----------|----------|
| **HybridRAGLatencyHigh** | P95 >100ms for 5min | Check FAISS index size, Redis cache, MongoDB queries |
| **HybridRAGAccuracyLow** | Top-3 <90% for 10min | Validate vector embeddings, check RRF scoring logic |
| **HybridRAGErrorRateHigh** | Error rate >0.1% for 3min | Check MongoDB/Redis/FAISS connectivity, review logs |

#### Cost Alerts

| Alert | Condition | Response |
|-------|-----------|----------|
| **CostReductionTargetMissed** | Reduction <75% for 30min | **P0 BLOCKER** - Investigate LLM usage, memory compression |
| **MonthlyCostProjectionHigh** | Projected cost >$150/mo for 1hr | Check token usage spikes, cache efficiency, compression ratios |

#### System Health Alerts

| Alert | Condition | Response |
|-------|-----------|----------|
| **MemoryStoreServiceDown** | Service down for 1min | Restart memory_store.py, check logs |
| **VectorDBServiceDown** | FAISS service down for 1min | Restart vector_database.py, check FAISS index integrity |
| **GraphDBServiceDown** | MongoDB down for 1min | Restart MongoDB, check connection pool |
| **TestPassRateLow** | Pass rate <98% for 5min | Run full test suite, identify failing tests |

### Warning Alerts (P2/P3) - INVESTIGATE WITHIN 1 HOUR

| Alert | Condition | Response |
|-------|-----------|----------|
| **CacheHitRateLow** | Redis hit rate <70% for 10min | Check cache TTL policies, memory eviction |
| **VectorDBSlowQueries** | Vector P95 >50ms for 10min | Check FAISS index fragmentation, consider rebuild |
| **LLMTokenUsageSpike** | Tokens 2x baseline for 15min | Review prompt engineering, check for inefficient retrieval |
| **SystemHealthScoreDegrading** | Health <95 for 30min | Review component metrics, check resource utilization |

---

## INCIDENT RESPONSE WORKFLOW

### P0 Alerts (Cost Blocker)
1. **Acknowledge:** Post in #genesis-alerts (if Slack integrated)
2. **Investigate:** Check Prometheus metrics, review logs
3. **Mitigate:** Apply immediate fix (e.g., throttle LLM calls)
4. **Escalate:** If not resolved in 30min, consider rollback
5. **Document:** Update incident log with RCA

### P1 Alerts (Critical)
1. **Acknowledge:** Within 5 minutes
2. **Investigate:** Check dashboard panels, review relevant logs
3. **Mitigate:** Apply fix or workaround
4. **Validate:** Confirm alert clears after fix
5. **Document:** Note incident in monitoring log

### P2/P3 Alerts (Warnings)
1. **Acknowledge:** Within 1 hour
2. **Investigate:** Review trends, check for patterns
3. **Schedule Fix:** Add to Phase 5.5 backlog if non-urgent
4. **Monitor:** Continue tracking metric

---

## PROMETHEUS QUERY EXAMPLES

Access Prometheus at http://localhost:9090 for ad-hoc queries.

### Hybrid RAG Queries

```promql
# P95 retrieval latency (milliseconds)
histogram_quantile(0.95, rate(hybrid_rag_retrieval_latency_seconds_bucket[5m])) * 1000

# Cache hit rate (Redis)
rate(redis_cache_hits_total[5m]) /
(rate(redis_cache_hits_total[5m]) + rate(redis_cache_misses_total[5m])) * 100

# Top-3 retrieval accuracy
hybrid_rag_top3_accuracy_percent

# Hybrid RAG queries per second
rate(hybrid_rag_queries_total[1m])
```

### Cost Optimization Queries

```promql
# Projected monthly cost
rate(total_system_cost[1h]) * 730

# Cost reduction percentage
(1 - (rate(total_system_cost[1h]) * 730 / 500)) * 100

# LLM token usage rate
rate(llm_input_tokens_total[5m])

# Memory storage cost trend
deriv(rate(memory_storage_cost_total[1h])[30m:1m])
```

### System Health Queries

```promql
# Test pass rate
genesis_regression_pass_rate

# Active test failures
genesis_regression_tests_failed + genesis_regression_tests_errors

# System health score
genesis_system_health

# Memory usage percentage
(1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)) * 100

# CPU usage percentage
100 - (avg by(instance) (rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)
```

---

## ROLLBACK CRITERIA

### GO/NO-GO Decision (Checkpoint 55, T+48h)

**GO Criteria (Proceed to Production):**
- ✅ Test pass rate ≥98% sustained for 48 hours
- ✅ Error rate <0.1% sustained
- ✅ P95 latency <200ms sustained
- ✅ Cost reduction ≥75% validated (target 80%)
- ✅ Zero P0/P1 alerts in final 12 hours
- ✅ System health score ≥95

**NO-GO Criteria (Rollback Required):**
- ❌ Cost reduction <75% (P0 blocker)
- ❌ Test pass rate <98% for >1 hour
- ❌ Hybrid RAG P95 latency >200ms sustained
- ❌ Critical service down >5 minutes
- ❌ Memory/CPU usage >90% sustained
- ❌ >5 P1 alerts in 48-hour window

### Rollback Procedure

If NO-GO decision made:

1. **Stop Rollout:** Disable Phase 5.3/5.4 features via feature flags
2. **Restore Baseline:** Revert to Phase 4 configuration
3. **Validate:** Confirm Phase 4 tests pass (1,026/1,044)
4. **Root Cause Analysis:** Identify failure reason
5. **Fix Forward:** Plan Phase 5.5 with fixes
6. **Re-Test:** Full regression suite before retry

---

## LOG FILE LOCATIONS

All logs stored in `/home/genesis/genesis-rebuild/logs/`:

### Phase 5.3 Infrastructure Logs
- `infrastructure_memory_store.log`: Memory store operations
- `infrastructure_hybrid_rag_retriever.log`: Hybrid RAG queries
- `infrastructure_vector_database.log`: Vector DB operations
- `infrastructure_graph_database.log`: MongoDB graph queries
- `infrastructure_redis_cache.log`: Redis cache operations
- `infrastructure_embedding_generator.log`: Embedding generation

### System Logs
- `agents.log`: Agent orchestration logs
- `infrastructure.log`: General infrastructure logs
- `benchmark_runner.log`: Benchmark execution logs

### Test Logs
- `tests_test_hybrid_rag_retriever.log`: Hybrid RAG test output
- `tests_test_memory_store.log`: Memory store test output
- `tests_test_visual_memory_compressor.log`: Visual compression tests

### Monitoring Logs
- `metrics_exporter.log`: Prometheus metrics exporter logs
- `continuous_monitoring.log`: Continuous test monitoring

---

## METRICS EXPORTER INTEGRATION

The Genesis Metrics Exporter (`monitoring/production_metrics_exporter.py`) runs continuously:

**Service:** `genesis-metrics` (Docker container)
**Port:** 8002 (mapped to container port 8000)
**Endpoint:** http://localhost:8000/metrics
**Scrape Interval:** 5 seconds (Prometheus)

### Exported Metrics (Phase 5 Specific)

**Note:** Some Phase 5.3 metrics may not be available until instrumentation is added. Current exports:

- `genesis_regression_tests_total`: Total regression tests
- `genesis_regression_tests_passed`: Passed tests
- `genesis_regression_tests_failed`: Failed tests
- `genesis_regression_tests_errors`: Tests with errors
- `genesis_regression_pass_rate`: Pass rate percentage
- `genesis_system_health`: Overall health score
- `genesis_waltzrl_tests_total`: WaltzRL tests
- `genesis_waltzrl_pass_rate`: WaltzRL pass rate

**TODO (Phase 5.5):** Add Phase 5.3-specific metric exporters:
- `hybrid_rag_retrieval_latency_seconds_bucket`: Retrieval latency histogram
- `hybrid_rag_top3_accuracy_percent`: Top-3 accuracy
- `redis_cache_hits_total`, `redis_cache_misses_total`: Cache metrics
- `total_system_cost`: Aggregated cost metric
- `llm_input_tokens_total`, `llm_output_tokens_total`: Token usage

---

## SUCCESS VALIDATION CHECKLIST

At Checkpoint 55 (T+48h), validate:

### Phase 5.3 Hybrid RAG
- [ ] P95 retrieval latency <100ms (target: <50ms validated)
- [ ] Top-3 accuracy >90% (target: 94.8% validated)
- [ ] Cache hit rate >70%
- [ ] Hybrid RAG error rate <0.1%
- [ ] Zero P1 alerts related to memory system
- [ ] 55/55 Hybrid RAG tests passing

### Phase 5.4 Cost Optimization
- [ ] Total monthly cost ≤$125 (target: $99, 80% reduction)
- [ ] Cost reduction ≥75% validated
- [ ] LLM token usage within expected range
- [ ] Memory compression working (DeepSeek-OCR)
- [ ] No cost-related P0 alerts

### System-Wide Health
- [ ] Test pass rate ≥98% sustained
- [ ] Error rate <0.1% sustained
- [ ] P95 latency <200ms sustained
- [ ] System health score ≥95
- [ ] Memory usage <80%
- [ ] CPU usage <80%
- [ ] Zero service downtime >5 minutes

### Regression Prevention
- [ ] Phase 1-3 orchestration tests passing (169/169)
- [ ] Phase 5.2 WaltzRL tests passing (50/50)
- [ ] No performance degradation vs Phase 4 baseline
- [ ] HTDAG decomposition <150ms
- [ ] HALO routing <130ms

---

## TROUBLESHOOTING GUIDE

### Dashboard Not Loading

**Symptom:** Grafana dashboard empty or shows "No Data"

**Resolution:**
1. Check Prometheus is scraping metrics: http://localhost:9090/targets
2. Verify genesis-metrics exporter is running: `curl http://localhost:8000/metrics`
3. Check Grafana datasource: Settings → Data Sources → Prometheus
4. Restart Grafana: `docker compose restart grafana`

### Metrics Not Updating

**Symptom:** Dashboard panels show stale data

**Resolution:**
1. Check Prometheus scrape interval: `prometheus_config.yml` (should be 5-15s)
2. Verify metrics exporter logs: `docker logs genesis-metrics`
3. Force dashboard refresh: Click refresh icon (top-right)
4. Check time range: Ensure "Last 48 hours" or "now-48h to now" selected

### Alerts Not Firing

**Symptom:** Known issue but no alert in Alertmanager

**Resolution:**
1. Check alert rules loaded: http://localhost:9090/rules
2. Verify Alertmanager config: `monitoring/alertmanager_config.yml`
3. Check alert evaluation: Prometheus → Alerts tab
4. Restart Alertmanager: `docker compose restart alertmanager`

### High Memory/CPU Usage

**Symptom:** Node metrics showing >80% utilization

**Resolution:**
1. Identify top processes: `docker stats` (on host)
2. Check Prometheus retention: Default 30 days, consider reducing
3. Check test suite concurrency: May need to throttle parallel tests
4. Scale vertically: Upgrade host if sustained high load

---

## POST-ROLLOUT ACTIONS

After successful 48-hour monitoring (GO decision):

1. **Archive Dashboard Config:**
   - Export dashboard JSON: Grafana → Dashboards → Export
   - Save to `monitoring/dashboards/phase_5_rollout_dashboard_final.json`
   - Commit to git with rollout summary

2. **Generate Rollout Report:**
   - Summary metrics (pass rate, cost reduction, latency)
   - Alert count by severity (P0/P1/P2/P3)
   - Key findings and anomalies
   - Lessons learned
   - Recommendations for Phase 5.5

3. **Update Documentation:**
   - Mark Phase 5.3/5.4 as COMPLETE in `PROJECT_STATUS.md`
   - Update `CLAUDE.md` with final metrics
   - Document known issues in `docs/PHASE_5_KNOWN_ISSUES.md`

4. **Transition to Steady-State Monitoring:**
   - Reduce dashboard refresh to 5 minutes
   - Adjust alert thresholds based on observed baselines
   - Archive 48-hour checkpoint logs

5. **Plan Phase 5.5:**
   - Review P2/P3 backlog items
   - Add Phase 5.3-specific metric instrumentation
   - Schedule performance optimization tasks

---

## CONTACTS & ESCALATION

**On-Call Engineer:** Forge (Testing Agent)
**Backup:** Alex (E2E Testing Agent)
**Escalation:** Hudson (Code Review) → Cora (Architecture)

**Slack Channels (if configured):**
- `#genesis-alerts`: Critical alerts (P0/P1)
- `#genesis-monitoring`: Dashboard updates, checkpoint reviews
- `#genesis-rollout`: General rollout discussion

**Runbook Location:**
`/home/genesis/genesis-rebuild/docs/INCIDENT_RESPONSE.md`

---

## APPENDIX: DASHBOARD PANEL REFERENCE

### Panel IDs (for troubleshooting)

| Panel ID | Title | Metric |
|----------|-------|--------|
| 1 | Overall Test Pass Rate | `genesis_regression_pass_rate` |
| 2 | Active Test Failures | `genesis_regression_tests_failed + genesis_regression_tests_errors` |
| 3 | Error Rate | Calculated from failed/total |
| 4 | Overall System Health | `genesis_system_health` |
| 10 | Hybrid RAG Retrieval Latency | `hybrid_rag_retrieval_latency_seconds_bucket` |
| 11 | Memory Cache Performance | `redis_cache_hits_total`, `vector_db_cache_hits_total` |
| 12 | Query Throughput | `hybrid_rag_queries_total`, `vector_db_searches_total` |
| 13 | Retrieval Accuracy Top-3 | `hybrid_rag_top3_accuracy_percent` |
| 14 | Hybrid RAG Error Rate | `hybrid_rag_errors_total` |
| 20 | Cost Breakdown | `llm_api_cost_total`, `memory_storage_cost_total` |
| 21 | Cost Reduction % | Calculated from `total_system_cost` |
| 22 | Token Usage Rate | `llm_input_tokens_total`, `llm_output_tokens_total` |
| 30 | System Memory Usage | `node_memory_MemAvailable_bytes` |
| 31 | System CPU Usage | `node_cpu_seconds_total` |
| 32 | Active Database Connections | `mongodb_connections_active`, `redis_connections_active` |
| 33 | Test Pass Rate Trend | `genesis_regression_pass_rate` (48h timeseries) |

---

## REVISION HISTORY

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-10-23 | Forge | Initial 48-hour monitoring guide |

---

**END OF DOCUMENT**
