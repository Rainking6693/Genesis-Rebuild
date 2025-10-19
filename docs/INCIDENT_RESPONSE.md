# Genesis Incident Response Playbook

**Purpose:** Step-by-step procedures for responding to production incidents
**Audience:** On-call engineers, incident commanders, SRE team
**Status:** Production-ready

---

## General Incident Response Process

### Phase 1: Detection (0-2 minutes)
1. Alert fires via Prometheus
2. Notification sent to Slack/PagerDuty
3. On-call engineer acknowledges

### Phase 2: Assessment (2-5 minutes)
1. Review Grafana dashboard
2. Check system logs
3. Determine severity (P0-P4)
4. Decide: investigate or escalate

### Phase 3: Response (5-30 minutes)
1. Apply immediate mitigation
2. Monitor metrics for improvement
3. Document actions in incident log
4. Communicate status updates

### Phase 4: Resolution (varies)
1. Verify metrics returned to SLO
2. Root cause analysis
3. Update runbooks
4. Post-mortem (for P0-P1)

---

## Incident: TestPassRateLow

**Alert:** `TestPassRateLow`
**Severity:** P1 - Critical
**SLO:** Test pass rate ≥98%
**Trigger:** Pass rate <98% for 5 minutes

### Symptoms
- Grafana panel 1 shows pass rate <98%
- Prometheus alert: TestPassRateLow firing
- Multiple test failures in suite

### Diagnosis Steps

1. **Check Current Status**
   ```bash
   cd /home/genesis/genesis-rebuild
   python3 -m pytest tests/ -v --tb=short | tee logs/incident_test_run.log
   ```

2. **Identify Failing Tests**
   ```bash
   grep "FAILED" logs/incident_test_run.log
   ```

3. **Categorize Failures**
   - Infrastructure tests (test_htdag, test_halo, test_aop)?
   - Agent tests (test_darwin, test_reflection)?
   - Integration tests (test_orchestration)?
   - Performance tests (test_performance)?

4. **Check for Common Patterns**
   ```bash
   # Check for environment issues
   ./scripts/health_check.sh

   # Check system resources
   htop
   df -h
   free -h
   ```

### Response Actions

**Scenario A: Infrastructure Test Failures (>5 failures)**

```bash
# 1. Check critical modules
python3 -c "from infrastructure import htdag_planner, halo_router, aop_validator"

# 2. Review recent code changes
git log --oneline --since="24 hours ago" infrastructure/

# 3. Check for dependency issues
pip list | grep -E "opentelemetry|pytest|prometheus"

# 4. If imports fail or deps missing - ROLLBACK
./scripts/rollback_deployment.sh
```

**Scenario B: Intermittent Test Failures (P4 performance test)**

```bash
# 1. Check if it's the known test_halo_routing_performance_large_dag
grep "test_halo_routing_performance_large_dag" logs/incident_test_run.log

# 2. Run test in isolation
python3 -m pytest tests/test_performance.py::test_halo_routing_performance_large_dag -v

# 3. If passes in isolation - add retry logic
# 4. If fails in isolation - investigate resource contention
```

**Scenario C: New Regression (tests that previously passed)**

```bash
# 1. Compare with baseline
diff logs/deployment_baseline_tests.log logs/incident_test_run.log

# 2. Identify newly failing tests
# 3. Review code changes for those modules
# 4. Apply hotfix or rollback

# Hotfix example:
git diff HEAD~1 infrastructure/htdag_planner.py
# If obvious bug, fix and redeploy
# If unclear, rollback
```

### Mitigation Options

1. **Immediate (0-5 min):** Add test retries for intermittent failures
   ```python
   # Add to pytest.ini
   [pytest]
   flaky = true
   max-runs = 3
   ```

2. **Short-term (5-15 min):** Disable non-critical failing tests
   ```bash
   # Mark as xfail temporarily
   @pytest.mark.xfail(reason="P4 intermittent, tracked in #123")
   ```

3. **Medium-term (15-30 min):** Apply hotfix
   ```bash
   # Fix code, run tests, redeploy
   git checkout -b hotfix/test-failures
   # Apply fix
   pytest tests/ -v
   git commit -m "fix: resolve test failures"
   ./scripts/deploy.sh
   ```

4. **Rollback (if unresolved after 30 min):**
   ```bash
   ./scripts/rollback_deployment.sh
   ```

### Verification

1. **Confirm pass rate restored:**
   ```bash
   python3 -m pytest tests/ -v --tb=no | grep "passed"
   # Should show ≥98% pass rate
   ```

2. **Check Grafana panel 1:** Pass rate ≥98%

3. **Wait 10 minutes:** Ensure sustained improvement

4. **Document incident:**
   ```bash
   echo "Incident: TestPassRateLow - Resolved via [action]" >> logs/incidents.log
   ```

---

## Incident: HighErrorRate

**Alert:** `HighErrorRate`
**Severity:** P1 - Critical
**SLO:** Error rate <0.1%
**Trigger:** Error rate >0.1% for 2 minutes

### Symptoms
- Grafana panel 2 shows error rate >0.1%
- System logs show repeated errors
- User-facing operations failing

### Diagnosis Steps

1. **Check Error Categories**
   ```bash
   # View error distribution
   curl -s http://localhost:9090/api/v1/query?query=genesis_errors_total | jq
   ```

2. **Review Recent Errors**
   ```bash
   tail -n 100 /home/genesis/genesis-rebuild/logs/genesis.log | grep ERROR
   ```

3. **Identify Error Type**
   - Decomposition errors (HTDAG failures)
   - Routing errors (HALO failures)
   - Validation errors (AOP failures)
   - LLM errors (API timeouts, rate limits)
   - Network errors (connectivity issues)
   - Resource errors (memory, CPU exhaustion)
   - Security errors (blocked tasks, auth failures)

### Response Actions

**Scenario A: LLM API Errors (rate limits, timeouts)**

```bash
# 1. Check LLM client metrics
curl -s http://localhost:9090/api/v1/query?query=genesis_llm_errors_total

# 2. Enable fallback to heuristic-based decomposition
# Edit config:
cat > /home/genesis/genesis-rebuild/config/llm_fallback.yaml <<EOF
llm:
  enabled: false  # Temporarily disable LLM
  fallback_mode: heuristic
EOF

# 3. Restart service
systemctl restart genesis-orchestration

# 4. Monitor error rate - should drop immediately
```

**Scenario B: Network Errors**

```bash
# 1. Check connectivity
ping -c 5 api.openai.com
curl -I https://api.anthropic.com

# 2. Check DNS resolution
nslookup api.openai.com

# 3. Enable circuit breaker (if not already)
# Circuit breaker should auto-activate after 5 failures
# Check status:
curl -s http://localhost:8000/health | jq .circuit_breaker

# 4. If circuit breaker open, wait 60s for auto-recovery
```

**Scenario C: Resource Exhaustion**

```bash
# 1. Check system resources
htop
free -h
df -h

# 2. Identify resource hog
ps aux --sort=-%mem | head -10
ps aux --sort=-%cpu | head -10

# 3. If memory >90%, restart service
systemctl restart genesis-orchestration

# 4. If persistent, scale up resources
```

**Scenario D: Validation Errors (AOP failures)**

```bash
# 1. Check AOP validator logs
grep "AOP" /home/genesis/genesis-rebuild/logs/genesis.log | tail -50

# 2. Identify validation issue (solvability, completeness, redundancy)

# 3. Temporarily relax validation
# Edit config:
cat > /home/genesis/genesis-rebuild/config/aop_relaxed.yaml <<EOF
aop:
  solvability_threshold: 0.5  # Reduced from 0.7
  completeness_threshold: 0.5  # Reduced from 0.7
EOF

# 4. Restart service
systemctl restart genesis-orchestration
```

### Mitigation Options

1. **Immediate (0-2 min):** Enable graceful degradation
   - Disable LLM, use heuristics
   - Circuit breaker activation
   - Error handler automatic retry

2. **Short-term (2-10 min):** Restart service
   ```bash
   systemctl restart genesis-orchestration
   ```

3. **Medium-term (10-30 min):** Scale resources or relax constraints

4. **Rollback (if unresolved after 30 min):**
   ```bash
   ./scripts/rollback_deployment.sh
   ```

### Verification

1. **Confirm error rate dropped:**
   ```bash
   curl -s http://localhost:9090/api/v1/query?query=rate(genesis_errors_total[5m]) | jq
   # Should show <0.001 (0.1%)
   ```

2. **Check Grafana panel 2:** Error rate <0.1%

3. **Wait 10 minutes:** Ensure sustained improvement

---

## Incident: HighLatencyP95

**Alert:** `HighLatencyP95`
**Severity:** P1 - Critical
**SLO:** P95 latency <200ms
**Trigger:** P95 >200ms for 5 minutes

### Symptoms
- Grafana panel 3 shows P95 >200ms
- Operations taking noticeably longer
- Possible timeout errors

### Diagnosis Steps

1. **Check Component Latency**
   ```bash
   # HTDAG decomposition
   curl -s http://localhost:9090/api/v1/query?query=rate(genesis_htdag_decomposition_duration_seconds_sum[5m])/rate(genesis_htdag_decomposition_duration_seconds_count[5m])

   # HALO routing
   curl -s http://localhost:9090/api/v1/query?query=rate(genesis_halo_routing_duration_seconds_sum[5m])/rate(genesis_halo_routing_duration_seconds_count[5m])

   # AOP validation
   curl -s http://localhost:9090/api/v1/query?query=rate(genesis_aop_validation_duration_seconds_sum[5m])/rate(genesis_aop_validation_duration_seconds_count[5m])
   ```

2. **Identify Slow Component**
   - Grafana panels 9-11 show component breakdown
   - Compare to Phase 3 baseline:
     - HTDAG: ~110ms baseline
     - HALO: ~110ms baseline
     - AOP: ~50ms baseline

3. **Check System Resources**
   ```bash
   # CPU usage
   mpstat 1 5

   # Memory usage
   vmstat 1 5

   # Disk I/O
   iostat -x 1 5
   ```

### Response Actions

**Scenario A: HTDAG Decomposition Slow**

```bash
# 1. Check LLM API latency
curl -w "@curl-format.txt" -o /dev/null -s https://api.openai.com/v1/chat/completions

# 2. If LLM slow, use cached decompositions
# Enable decomposition cache:
cat > /home/genesis/genesis-rebuild/config/htdag_cache.yaml <<EOF
htdag:
  cache_enabled: true
  cache_ttl_seconds: 3600
EOF

# 3. Restart service
systemctl restart genesis-orchestration
```

**Scenario B: HALO Routing Slow**

```bash
# 1. Check routing rule indexing
# HALO should use optimized rule matching (79.3% faster)

# 2. Verify optimizations active
curl -s http://localhost:8000/health | jq .halo_optimizations

# 3. If not optimized, enable:
cat > /home/genesis/genesis-rebuild/config/halo_perf.yaml <<EOF
halo:
  rule_indexing: true
  agent_pool_enabled: true
  batch_routing: true
EOF

# 4. Restart service
systemctl restart genesis-orchestration
```

**Scenario C: System Resource Bottleneck**

```bash
# 1. If CPU >80%, reduce concurrent operations
cat > /home/genesis/genesis-rebuild/config/concurrency.yaml <<EOF
orchestration:
  max_concurrent_tasks: 5  # Reduced from 10
  worker_threads: 4  # Reduced from 8
EOF

# 2. If memory >80%, enable aggressive garbage collection
export PYTHONMALLOC=malloc
systemctl restart genesis-orchestration

# 3. If disk I/O high, reduce logging verbosity
sed -i 's/level=DEBUG/level=INFO/' /home/genesis/genesis-rebuild/config/logging.yaml
```

### Mitigation Options

1. **Immediate (0-5 min):** Enable caching and batching
2. **Short-term (5-15 min):** Reduce concurrent operations
3. **Medium-term (15-30 min):** Scale up resources (more CPU/memory)
4. **Rollback (if unresolved after 30 min):** Revert to previous version

### Verification

1. **Confirm P95 latency improved:**
   ```bash
   curl -s http://localhost:9090/api/v1/query?query=histogram_quantile(0.95,rate(genesis_operation_duration_seconds_bucket[5m])) | jq
   # Should show <0.2 (200ms)
   ```

2. **Check Grafana panel 3:** P95 <200ms

3. **Wait 10 minutes:** Ensure sustained improvement

---

## Incident: GenesisServiceDown

**Alert:** `GenesisServiceDown`
**Severity:** P0 - Critical
**SLO:** 99.9% uptime
**Trigger:** Service down for 1 minute

### Symptoms
- Grafana panel 4 shows service status: DOWN
- All operations failing
- Service unresponsive

### Diagnosis Steps

1. **Check Service Status**
   ```bash
   systemctl status genesis-orchestration
   ```

2. **Review Crash Logs**
   ```bash
   journalctl -u genesis-orchestration --since "5 minutes ago" | tail -100
   ```

3. **Identify Crash Reason**
   - Segmentation fault
   - Unhandled exception
   - Out of memory (OOM killer)
   - Dependency missing
   - Configuration error

### Response Actions

**IMMEDIATE: Activate Incident Commander**

```bash
# 1. Page incident commander
# 2. Notify stakeholders
# 3. Begin rollback procedure
```

**Step 1: Attempt Service Restart (0-2 minutes)**

```bash
# Try simple restart first
systemctl restart genesis-orchestration

# Wait 30 seconds
sleep 30

# Check if service came up
systemctl is-active genesis-orchestration
```

**Step 2: If Restart Fails, Rollback (2-5 minutes)**

```bash
# Rollback to last known good version
cd /home/genesis/genesis-rebuild
./scripts/rollback_deployment.sh

# Verify rollback successful
systemctl status genesis-orchestration
curl http://localhost:8000/health
```

**Step 3: Verify Service Restored (5-10 minutes)**

```bash
# Run health check
./scripts/health_check.sh

# Run smoke tests
python3 -m pytest tests/test_production_health.py::TestProductionHealth::test_observability_manager_functional -v
```

**Step 4: Root Cause Analysis (Offline)**

```bash
# Collect crash dump
mkdir -p /home/genesis/genesis-rebuild/logs/crash_$(date +%Y%m%d_%H%M%S)
cp /var/log/syslog logs/crash_*/
journalctl -u genesis-orchestration --since "1 hour ago" > logs/crash_*/service.log
dmesg | tail -100 > logs/crash_*/dmesg.log

# Analyze offline - DO NOT BLOCK SERVICE RESTORATION
```

### Mitigation Options

1. **Immediate (0-2 min):** Restart service
2. **Rollback (2-5 min):** Revert to last known good version
3. **Incident Commander:** Activate if unresolved after 5 min

### Verification

1. **Service is up:**
   ```bash
   curl http://localhost:8000/health
   # Should return 200 OK
   ```

2. **Grafana panel 4:** Service status: UP

3. **Run full health check:**
   ```bash
   ./scripts/health_check.sh
   # Should exit with code 0
   ```

---

## Rollback Procedure

### When to Rollback

Rollback immediately if:
- Service is down and won't restart
- Test pass rate <95%
- Error rate >1%
- P95 latency >500ms (2.5x SLO)
- Unresolved P1 incident after 30 minutes

### Rollback Steps

```bash
#!/bin/bash
# /home/genesis/genesis-rebuild/scripts/rollback_deployment.sh

set -euo pipefail

echo "=== GENESIS ROLLBACK PROCEDURE ==="
echo "Timestamp: $(date)"

# 1. Stop current service
echo "Stopping service..."
systemctl stop genesis-orchestration

# 2. Revert code to last known good version
echo "Reverting code..."
cd /home/genesis/genesis-rebuild
git fetch origin
git reset --hard origin/deployment-stable
git clean -fd

# 3. Restore configuration
echo "Restoring configuration..."
cp /home/genesis/genesis-rebuild/config/backup/*.yaml /home/genesis/genesis-rebuild/config/

# 4. Restart service
echo "Starting service..."
systemctl start genesis-orchestration

# 5. Verify
echo "Verifying rollback..."
sleep 10
systemctl is-active genesis-orchestration || {
    echo "ERROR: Service failed to start after rollback"
    exit 1
}

# 6. Run health check
echo "Running health check..."
./scripts/health_check.sh

echo "=== ROLLBACK COMPLETE ==="
echo "Service restored to stable version"
echo "Investigate incident offline"
```

---

## Post-Incident Checklist

After resolving any P0-P1 incident:

- [ ] Verify all SLOs restored (pass rate, error rate, latency)
- [ ] Document incident in `/home/genesis/genesis-rebuild/logs/incidents.log`
- [ ] Update monitoring alerts (if false positive)
- [ ] Create post-mortem (for P0-P1)
- [ ] Update runbooks with lessons learned
- [ ] Test rollback procedure (if not already tested)
- [ ] Communicate resolution to stakeholders

---

## Contact Information

**Emergency Contacts:**
- On-Call Engineer: [Insert contact]
- Incident Commander: [Insert contact]
- Engineering Lead: [Insert contact]
- CTO: [Insert contact]

**Slack Channels:**
- #genesis-alerts (critical)
- #genesis-monitoring (warnings)
- #genesis-incidents (incident coordination)

**PagerDuty:** [Insert integration]

---

**Document Version:** 1.0
**Last Updated:** October 18, 2025
**Next Review:** After first incident
