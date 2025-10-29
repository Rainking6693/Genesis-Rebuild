# Monitoring Quick Start Guide

**Created:** October 28, 2025
**For:** OSWorld + LangMem 2-Day Production Rollout
**By:** Cora (Orchestration Specialist)

---

## 🚨 CRITICAL: Read This BEFORE Deploying

**Previous Incident (Oct 20, 2025):** Grafana dashboards were completely broken despite containers running. This cost 26+ hours of broken monitoring.

**What went wrong:** Forge checked containers but NOT the actual Grafana UI.

**What you MUST do:** Open Grafana UI and verify dashboards are visible.

---

## ✅ Pre-Deployment Checklist (5 Minutes)

### Step 1: Run Automated Validation (30 seconds)

```bash
cd /home/genesis/genesis-rebuild
./scripts/validate_monitoring_stack.sh
```

**Expected:** "MONITORING STACK IS FULLY OPERATIONAL" (green)

**If you see failures:** Follow the fix instructions in the output.

---

### Step 2: Visual Verification (2 minutes) **MANDATORY**

**This is what Forge skipped in October 20, 2025 incident.**

1. **Open Grafana in your browser:**
   ```
   URL: http://localhost:3000
   Username: admin
   Password: admin
   ```

2. **Look at the left sidebar:**
   - Do you see a "Dashboards" icon (4 squares)?
   - Click "Dashboards"
   - Do you see "Genesis Dashboards" folder?
   - Do you see 3-4 dashboard names listed?

3. **Open a dashboard:**
   - Click "Genesis Multi-Suite" or "Genesis Orchestration"
   - Does the dashboard load without errors?
   - Do you see panels (graphs, numbers, stats)?
   - Panels may show "No data" if tests haven't run yet (that's OK)

**SUCCESS CRITERIA:**
- ✅ Grafana UI loads
- ✅ Dashboards folder visible in sidebar
- ✅ At least one dashboard opens successfully
- ✅ Panels are visible (even if showing "No data")

**FAILURE CRITERIA:**
- ❌ No dashboards in sidebar → **STOP - Dashboards not provisioned**
- ❌ "Dashboard not found" error → **STOP - Dashboard files missing**
- ❌ "Data source not found" error → **STOP - Prometheus not configured**

**If you see ANY failure criteria:** DO NOT DEPLOY. Report issue immediately.

---

### Step 3: Test Metrics Flow (2 minutes)

```bash
# Generate test metrics
cd /home/genesis/genesis-rebuild
pytest tests/test_waltzrl_modules.py -q

# Wait 15 seconds for Prometheus to scrape
sleep 15

# Check metrics in Grafana
# Refresh the dashboard (F5)
# You should now see actual data in panels (not "No data")
```

**Expected:** Panels show numbers (e.g., "Test Pass Rate: 100%", "50 tests passed")

**If still "No data":** Metrics are not flowing. Check:
```bash
curl http://localhost:8000/metrics | grep "genesis_test_pass_rate"
# Expected: genesis_test_pass_rate 100.0
```

---

## 📊 During Deployment: What to Watch

### Quick Health Check (30 Seconds)

**Every 30 minutes for first 12 hours, then every hour:**

```bash
# One-line status check:
tail -5 /home/genesis/genesis-rebuild/logs/continuous_monitoring.log | grep "Test Pass Rate"
```

**Expected Output:**
```
Test Pass Rate: 100.0% (SLO: ≥95%)
```

**Alert Thresholds:**
- 🟢 **98-100%** → All good, continue monitoring
- 🟡 **95-98%** → Warning, investigate within 30 min
- 🔴 **< 95%** → CRITICAL, rollback within 15 min

---

### Grafana Dashboard Check (2 Minutes)

**Open:** http://localhost:3000

**Check these panels:**

1. **Test Pass Rate** (top left)
   - Should show 98-100% (GREEN)
   - If < 98% → YELLOW warning
   - If < 95% → RED critical

2. **Error Rate** (top center)
   - Should show < 0.1% (GREEN)
   - If 0.1-0.5% → YELLOW warning
   - If > 0.5% → RED critical

3. **P95 Latency** (top right)
   - Should show < 200ms (GREEN)
   - If 200-500ms → YELLOW warning
   - If > 500ms → RED critical

4. **Active Alerts** (bottom right)
   - Should show "0 alerts" (GREEN)
   - If any CRITICAL alert → RED, investigate immediately

---

## 🚨 When to Rollback

**IMMEDIATE ROLLBACK (15-minute SLA):**

1. Test pass rate < 95% for 5+ minutes
2. Error rate > 0.5% for 5+ minutes
3. P95 latency > 500ms for 5+ minutes
4. Any service down for 2+ minutes
5. Any CRITICAL alert fires

**Rollback Procedure:**
```bash
cd /home/genesis/genesis-rebuild
./scripts/rollback_deployment.sh
```

---

## 🛠️ Troubleshooting

### Issue: "No dashboards in Grafana"

**This is the October 20, 2025 incident repeating.**

**Diagnosis:**
```bash
# Check if dashboard files exist:
ls -la /home/genesis/genesis-rebuild/monitoring/dashboards/*.json

# Check if Grafana sees them:
docker exec grafana ls -la /etc/grafana/provisioning/dashboards/
```

**Fix:**
```bash
# Restart Grafana to reload dashboards:
cd /home/genesis/genesis-rebuild/monitoring
docker-compose restart grafana

# Wait 10 seconds, then check UI again
```

**If still not working:** Contact Cora immediately. DO NOT PROCEED.

---

### Issue: "Panels show 'No data'"

**Diagnosis:**
```bash
# Check if metrics exporter is running:
ps aux | grep production_metrics_exporter.py

# Check if metrics are being exposed:
curl http://localhost:8000/metrics | grep "genesis_test_pass_rate"
```

**Fix:**
```bash
# Start metrics exporter if not running:
cd /home/genesis/genesis-rebuild
nohup python3 monitoring/production_metrics_exporter.py > logs/metrics_exporter.log 2>&1 &

# Generate test metrics:
pytest tests/test_waltzrl_modules.py -q

# Wait 15 seconds, then refresh Grafana
```

---

### Issue: "Prometheus target is DOWN"

**Diagnosis:**
```bash
# Check Prometheus targets:
curl http://localhost:9090/api/v1/targets | jq '.data.activeTargets[] | {job: .labels.job, health: .health}'
```

**Fix:**
```bash
# If genesis-orchestration is DOWN:
# 1. Check if port 8000 is accessible:
curl http://localhost:8000/metrics

# 2. If not accessible, restart metrics exporter:
pkill -f production_metrics_exporter.py
cd /home/genesis/genesis-rebuild
nohup python3 monitoring/production_metrics_exporter.py > logs/metrics_exporter.log 2>&1 &
```

---

## 📞 Emergency Contacts

**If you see ANY of these:**
- No dashboards in Grafana UI
- Critical alert fires
- Test pass rate < 95%
- Service down for >2 minutes

**DO THIS:**
1. Take screenshot of the issue
2. Run: `./scripts/validate_monitoring_stack.sh > monitoring_error.txt 2>&1`
3. Contact deployment team immediately with screenshot + monitoring_error.txt

---

## ✅ Success Criteria (After 48 Hours)

**To proceed to 100% traffic, ALL must be true:**

- [ ] Test pass rate ≥ 98% for entire 48h period
- [ ] Error rate < 0.1% for entire 48h period
- [ ] P95 latency < 200ms for entire 48h period
- [ ] Zero CRITICAL alerts fired
- [ ] Zero rollbacks executed
- [ ] All services maintained 99.9%+ uptime

**If ALL checked:** ✅ Deployment successful, scale to 100%

**If ANY unchecked:** ⚠️ Extend monitoring by 48 hours, fix issues

---

## 📝 Monitoring Journal

**Create a monitoring journal to track checks:**

```bash
# Initialize journal
echo "=== Deployment Start $(date) ===" > /home/genesis/monitoring_journal.txt

# Every 30 minutes, log status:
echo "=== $(date) ===" >> /home/genesis/monitoring_journal.txt
tail -5 /home/genesis/genesis-rebuild/logs/continuous_monitoring.log >> /home/genesis/monitoring_journal.txt
curl -s http://localhost:9090/api/v1/alerts | jq '.data.alerts | length' >> /home/genesis/monitoring_journal.txt
echo "" >> /home/genesis/monitoring_journal.txt

# Review journal:
cat /home/genesis/monitoring_journal.txt
```

---

## 🔗 Quick Links

- **Grafana Dashboard:** http://localhost:3000
- **Prometheus UI:** http://localhost:9090
- **Prometheus Alerts:** http://localhost:9090/alerts
- **Alertmanager:** http://localhost:9093
- **Full Audit Report:** `/home/genesis/genesis-rebuild/docs/audits/CORA_MONITORING_ORCHESTRATION_AUDIT.md`

---

## 🎯 Remember

**The October 20, 2025 incident happened because:**
- Forge checked containers but NOT the Grafana UI
- Dashboards were broken for 26+ hours
- User had to manually fix everything

**YOU must verify:**
- ✅ Containers running (automated check)
- ✅ Grafana UI shows dashboards (MANUAL visual check)
- ✅ Dashboards display data (MANUAL visual check)

**If you skip the visual check, you WILL have broken monitoring.**

---

**DO NOT DEPLOY without completing ALL 3 steps in the Pre-Deployment Checklist.**

**Good luck!**
