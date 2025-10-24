---
title: Production Deployment Smoke Test Checklist
category: Testing
dg-publish: true
publish: true
tags: []
source: docs/PRODUCTION_SMOKE_TEST_CHECKLIST.md
exported: '2025-10-24T22:05:26.945391'
---

# Production Deployment Smoke Test Checklist

**Purpose:** Quick validation checklist to run immediately after production deployment
**Time Required:** 5-10 minutes
**Frequency:** After every deployment, 3x daily for 48 hours

---

## Quick Start

```bash
# Run all smoke tests
pytest tests/test_smoke.py -v --tb=short

# Run staging validation tests
pytest tests/test_staging_validation.py -v --tb=short

# Run only critical smoke tests (fastest)
pytest tests/test_smoke.py -m critical -v
```

---

## Manual Health Checks (2 minutes)

### 1. Service Health
```bash
# A2A Service
curl http://localhost:8080/health
# Expected: {"status":"healthy","agents_loaded":15}

# Prometheus
curl http://localhost:9090/-/healthy
# Expected: "Prometheus Server is Healthy."

# Grafana
curl http://localhost:3000/api/health
# Expected: {"database":"ok","version":"12.2.0"}
```

**✅ PASS CRITERIA:** All 3 services return healthy status

---

### 2. Docker Containers
```bash
docker ps --format "table {{.Names}}\t{{.Status}}"
```

**✅ PASS CRITERIA:** All 4 containers showing "Up" status:
- prometheus
- grafana
- node-exporter
- alertmanager

---

### 3. Monitoring Dashboards (Visual Check)
```bash
# Open Grafana
xdg-open http://localhost:3000 2>/dev/null || echo "Open http://localhost:3000 manually"

# Open Prometheus
xdg-open http://localhost:9090 2>/dev/null || echo "Open http://localhost:9090 manually"
```

**✅ PASS CRITERIA:**
- Grafana UI loads
- Prometheus UI loads
- Metrics visible in Prometheus (query: `up`)

---

## Automated Smoke Tests (3 minutes)

### Run Critical Tests Only
```bash
pytest tests/test_smoke.py::TestInfrastructure -v
pytest tests/test_smoke.py::TestComponentInitialization -v
pytest tests/test_smoke.py::TestBasicOrchestration::test_simple_orchestration_flow -v
```

**✅ PASS CRITERIA:** All tests pass

---

### Run Full Smoke Suite
```bash
pytest tests/test_smoke.py -v --tb=short -k "not slow"
```

**✅ PASS CRITERIA:** >95% pass rate (21+/25 tests)

---

## Performance Validation (2 minutes)

### Quick Performance Check
```bash
pytest tests/test_staging_validation.py::TestPerformanceBaseline -v
```

**✅ PASS CRITERIA:** All 4 performance tests pass:
- HTDAG decomposition <200ms P95
- HALO routing <100ms P95
- AOP validation <50ms P95
- System resources adequate

---

### System Resource Check
```bash
# Memory usage
free -h | grep "Mem:"

# CPU usage
top -bn1 | grep "Cpu(s)"

# Disk usage
df -h /home/genesis/genesis-rebuild
```

**✅ PASS CRITERIA:**
- Memory used <80%
- CPU usage <70%
- Disk used <85%

---

## Feature Flag Validation (1 minute)

### Check Critical Flags
```python
python3 -c "
from infrastructure.feature_flags import get_feature_flag_manager

manager = get_feature_flag_manager()

critical_flags = [
    'orchestration_enabled',
    'security_hardening_enabled',
    'error_handling_enabled',
    'otel_enabled',
    'performance_optimizations_enabled'
]

print('Critical Feature Flags:')
for flag in critical_flags:
    enabled = manager.is_enabled(flag)
    status = '✅ ENABLED' if enabled else '❌ DISABLED'
    print(f'{status:15} {flag}')

print(f'\nPhase 4 Deployment Rollout:')
rollout = manager.get_rollout_status('phase_4_deployment')
print(f'  Strategy: {rollout[\"strategy\"]}')
print(f'  Phase: {rollout.get(\"phase\", \"unknown\")}')
print(f'  Current %: {rollout.get(\"current_percentage\", 0):.1f}%')
"
```

**✅ PASS CRITERIA:** All 5 critical flags enabled, Phase 4 rollout active

---

## Security Validation (1 minute)

### Quick Security Check
```bash
pytest tests/test_staging_validation.py::TestSecurityControls -v
```

**✅ PASS CRITERIA:** All 4 security tests pass:
- Prompt injection protection active
- Credential redaction working
- DAG cycle detection functional
- Code validation rejecting dangerous code

---

## Error Handling Validation (1 minute)

### Quick Error Handling Check
```bash
pytest tests/test_staging_validation.py::TestErrorHandling -v
```

**✅ PASS CRITERIA:** All 4 error handling tests pass:
- Error categorization working
- Circuit breaker functional
- Graceful degradation active
- Retry mechanism available

---

## Observability Validation (1 minute)

### Check OTEL Stack
```bash
pytest tests/test_staging_validation.py::TestObservability -v
```

**✅ PASS CRITERIA:** All 4 observability tests pass

### Verify Metrics Collection
```bash
# Check Prometheus for Genesis metrics
curl -s 'http://localhost:9090/api/v1/query?query=up' | jq '.data.result | length'
# Expected: >0 (metrics being collected)
```

---

## End-to-End Integration Test (2 minutes)

### Full Pipeline Test
```bash
pytest tests/test_staging_validation.py::TestComponentIntegration -v
```

**✅ PASS CRITERIA:** All 3 integration tests pass:
- Full orchestration pipeline works
- Error handling integrated
- Observability integrated

---

## Post-Deployment Checklist

After running all smoke tests, verify:

- [ ] All critical services healthy (A2A, Prometheus, Grafana)
- [ ] All 4 Docker containers running
- [ ] Smoke tests >95% pass rate (21+/25)
- [ ] Performance baselines met (P95 <200ms)
- [ ] Feature flags operational
- [ ] Security controls active
- [ ] Error handling functional
- [ ] Observability collecting metrics
- [ ] No critical errors in logs

---

## Troubleshooting

### If A2A Service Unhealthy
```bash
# Check service status
systemctl status genesis-a2a  # if using systemd

# Check logs
journalctl -u genesis-a2a -n 50

# Restart service
systemctl restart genesis-a2a
```

### If Monitoring Containers Not Running
```bash
# Check container status
docker ps -a | grep -E "prometheus|grafana|node-exporter|alertmanager"

# Restart containers
docker-compose -f monitoring/docker-compose.yml up -d

# Check logs
docker logs prometheus
docker logs grafana
```

### If Performance Tests Failing
```bash
# Check system resources
htop  # or top

# Check for high CPU processes
ps aux --sort=-%cpu | head -n 10

# Check for high memory processes
ps aux --sort=-%mem | head -n 10

# Consider scaling up resources if consistently failing
```

### If Feature Flags Not Loading
```bash
# Check config file exists
ls -la /home/genesis/genesis-rebuild/config/feature_flags.json

# Regenerate config if missing
python3 -c "
from infrastructure.feature_flags import FeatureFlagManager
from pathlib import Path
manager = FeatureFlagManager()
manager.save_to_file(Path('/home/genesis/genesis-rebuild/config/feature_flags.json'))
"
```

---

## Rollback Procedure

**Trigger Rollback If:**
- Smoke test pass rate <95%
- P95 latency >500ms
- Error rate >1%
- Critical security incident
- Data corruption detected

**Rollback Steps:**
```bash
# 1. Enable emergency shutdown flag
python3 -c "
from infrastructure.feature_flags import get_feature_flag_manager
manager = get_feature_flag_manager()
manager.set_flag('emergency_shutdown', True)
manager.set_flag('phase_4_deployment', False)
"

# 2. Git revert to previous version
cd /home/genesis/genesis-rebuild
git log --oneline -n 5  # Find previous commit
git revert <commit-hash> --no-edit

# 3. Restart services
systemctl restart genesis-a2a  # or your deployment method

# 4. Verify rollback
pytest tests/test_smoke.py -v

# 5. Document incident
echo "ROLLBACK: $(date) - Reason: <reason>" >> logs/rollback.log
```

**Rollback Time Target:** <15 minutes

---

## Success Metrics (48-Hour Monitoring)

Track these metrics every 8 hours:

### Test Health
- Smoke test pass rate: ≥95%
- Staging validation pass rate: ≥98%
- Full test suite pass rate: ≥98%

### Performance
- P95 latency HTDAG: <200ms
- P95 latency HALO: <100ms
- P95 latency AOP: <50ms
- Overall system: 46.3% faster than baseline

### Reliability
- Error rate: <0.1%
- Circuit breaker trips: <5 per day
- Successful retries: >95%

### Observability
- Metrics collected: >1000/hour
- Traces generated: >100/hour
- Logs structured: 100%

### Feature Rollout
- Phase 4 deployment: Progressive (0% → 100% over 7 days)
- Current rollout %: Track daily
- Incidents during rollout: 0

---

## Automated Monitoring Script

Create this script for continuous monitoring:

```bash
#!/bin/bash
# /home/genesis/genesis-rebuild/scripts/production_health_check.sh

echo "==================== PRODUCTION HEALTH CHECK ===================="
echo "Timestamp: $(date)"
echo

# Service health
echo "1. Service Health:"
curl -s http://localhost:8080/health | jq '.status' || echo "❌ A2A UNHEALTHY"
curl -s http://localhost:9090/-/healthy > /dev/null && echo "✅ Prometheus healthy" || echo "❌ Prometheus unhealthy"
curl -s http://localhost:3000/api/health | jq -r '.database' | grep -q ok && echo "✅ Grafana healthy" || echo "❌ Grafana unhealthy"
echo

# Quick smoke test
echo "2. Running smoke tests..."
pytest tests/test_smoke.py -q --tb=no | tail -n 1
echo

# Performance check
echo "3. Running performance validation..."
pytest tests/test_staging_validation.py::TestPerformanceBaseline -q --tb=no | tail -n 1
echo

# System resources
echo "4. System Resources:"
free -h | grep Mem | awk '{print "   Memory: " $3 "/" $2 " (" int($3/$2*100) "%)"}'
top -bn1 | grep "Cpu(s)" | awk '{print "   CPU: " $2}'
df -h /home/genesis/genesis-rebuild | tail -n 1 | awk '{print "   Disk: " $3 "/" $2 " (" $5 ")"}'
echo

echo "=============================================================="
```

Run every 8 hours:
```bash
chmod +x scripts/production_health_check.sh
./scripts/production_health_check.sh | tee -a logs/production_health.log
```

---

**Last Updated:** October 18, 2025
**Version:** 1.0
**Maintained By:** Alex (Full-Stack Integration Specialist)
