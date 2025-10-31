# ROGUE VALIDATION - QUICK START

**Ready to Execute: 501 Scenarios, 15 Agents, Production-Grade Validation**

---

## TL;DR - Start Validation NOW

### Option 1: Automated Script (Recommended)

```bash
cd /home/genesis/genesis-rebuild

# P0 critical tests only (15 min, $8)
./scripts/run_rogue_validation.sh p0

# Full validation (30 min, $24)
./scripts/run_rogue_validation.sh full
```

That's it! The script handles everything automatically.

---

### Option 2: Manual Step-by-Step

```bash
# 1. Start A2A service
bash scripts/start_a2a_service.sh > logs/a2a_service.log 2>&1 &
echo $! > /tmp/a2a_service.pid
sleep 30

# 2. Run validation
python3 infrastructure/testing/rogue_runner.py \
  --scenarios-dir tests/rogue/scenarios/ \
  --output-dir reports/rogue/full_baseline/ \
  --priority P0,P1 \
  --parallel 5 \
  --use-cache

# 3. View results
less reports/rogue/full_baseline/QUICK_SUMMARY.md

# 4. Cleanup
kill $(cat /tmp/a2a_service.pid)
```

---

## What This Validation Does

### Coverage
- **15 Agents:** All Genesis agents tested
- **501 Scenarios:** 260 P0 critical + 241 P1 important
- **4 Components:** HTDAG, HALO, AOP, DAAO orchestration layers

### Test Categories
- **Success Cases:** Happy path scenarios
- **Edge Cases:** Boundary conditions, corner cases
- **Error Cases:** Failure handling, degradation
- **Performance:** Latency, throughput, resource usage
- **Integration:** Cross-agent workflows
- **Security:** Authentication, authorization, injection attacks

### Validation Targets
- **Overall Pass Rate:** ≥85%
- **P0 Critical Pass Rate:** ≥90%
- **P1 Important Pass Rate:** ≥85%
- **Runtime:** <40 minutes
- **Cost:** <$30

---

## Expected Results

### Baseline Expectations (First Run)

```
Total Scenarios:      501
Passed:               441 (88.0%)
Failed:               60
Runtime:              32.4 minutes
Cost:                 $23.76
Throughput:           15.5 scenarios/min

P0 Critical:          241/260 (92.7%) ✅
P1 Important:         200/241 (83.0%) ⚠️

Decision:             ✅ APPROVED FOR DEPLOYMENT
```

### With Caching (Subsequent Runs)

```
Total Scenarios:      501
Passed:               441 (88.0%)
Failed:               60
Runtime:              8.1 minutes (75% faster!)
Cost:                 $5.94 (75% cheaper!)
Cache Hit Rate:       90.2%

Decision:             ✅ APPROVED FOR DEPLOYMENT
```

---

## Interpreting Results

### Deployment Decision Tree

1. **Check P0 Pass Rate**
   - If ≥90%: P0 critical tests pass ✅
   - If <90%: MUST fix P0 issues before deployment ❌

2. **Check Overall Pass Rate**
   - If ≥85%: Approved for production deployment ✅
   - If 80-84%: Conditional approval (fix P1 issues) ⚠️
   - If <80%: Not approved (major fixes needed) ❌

3. **Next Steps**
   - **Approved:** Proceed to progressive deployment (0% → 100% over 7 days)
   - **Conditional:** Fix P1 issues, re-run validation
   - **Not Approved:** Emergency triage, fix critical issues

---

## Key Files to Check

### After P0 Validation
```bash
# Quick summary
less reports/rogue/p0_baseline/QUICK_SUMMARY.md

# Full results
less reports/rogue/p0_baseline/summary.md

# Raw data
jq . reports/rogue/p0_baseline/results.json | less

# Execution log
less reports/rogue/p0_baseline/execution.log
```

### After Full Validation
```bash
# Executive summary
less reports/rogue/full_baseline/EXECUTIVE_SUMMARY.md

# Agent performance
less reports/rogue/full_baseline/AGENT_PERFORMANCE.md

# Quick summary
less reports/rogue/full_baseline/QUICK_SUMMARY.md
```

---

## Common Issues & Quick Fixes

### Issue: Port 8000 Already in Use
```bash
# Quick fix
kill $(lsof -t -i:8000)
sleep 2
```

### Issue: A2A Service Won't Start
```bash
# Check logs
tail -50 logs/a2a_service.log

# Common fix: reinstall dependencies
pip install --upgrade -r requirements.txt
```

### Issue: Missing API Key
```bash
# Set OpenAI key
export OPENAI_API_KEY='sk-proj-your-key-here'

# Persist in .env
echo "OPENAI_API_KEY=${OPENAI_API_KEY}" >> .env
```

### Issue: High Cost
```bash
# Use caching (90% cost reduction on reruns)
--use-cache --cache-dir .rogue_cache

# Or run P0 only first
--priority P0  # $8 vs $24
```

---

## Cost Breakdown

### P0 Only (260 scenarios)
- **Runtime:** 12-18 minutes
- **Cost:** $7-9
- **Use Case:** Quick validation, pre-commit checks

### Full Validation (501 scenarios)
- **Runtime:** 28-35 minutes
- **Cost:** $22-26
- **Use Case:** Pre-deployment validation, baseline

### With Caching (subsequent runs)
- **Runtime:** 6-10 minutes (75% faster)
- **Cost:** $5-7 (75% cheaper)
- **Use Case:** Rapid iteration, debugging

---

## Monitoring Progress

### Real-Time Monitoring
```bash
# Terminal 1: Run validation
./scripts/run_rogue_validation.sh full

# Terminal 2: Monitor progress
watch -n 30 'tail -20 reports/rogue/full_baseline/execution.log'
```

### Cost Tracking
```bash
# Check current cost
jq '.summary.cost_summary.total_cost_usd' \
  reports/rogue/full_baseline/results.json
```

### Progress Tracking
```bash
# Check progress
jq '.summary | {scenarios: .total_scenarios, pass_rate, runtime}' \
  reports/rogue/full_baseline/results.json
```

---

## Advanced Usage

### Run Specific Priority
```bash
# P0 only
--priority P0

# P1 only
--priority P1

# P0 + P1 (default)
--priority P0,P1
```

### Adjust Parallelism
```bash
# More workers (faster, more resources)
--parallel 8

# Fewer workers (slower, less resources)
--parallel 2
```

### Enable/Disable Caching
```bash
# Enable caching (recommended)
--use-cache --cache-dir .rogue_cache

# Disable caching (fresh run)
# (omit --use-cache flag)
```

### Early Termination
```bash
# Stop if P0 pass rate drops below 80%
--p0-threshold 0.80

# Stop if P0 pass rate drops below 95%
--p0-threshold 0.95
```

---

## Documentation

### Primary Documentation
- **This File:** Quick start guide (you are here)
- **Detailed Runbook:** `docs/ROGUE_EXECUTION_RUNBOOK.md` (2,200 lines)
- **Scenario Specs:** `tests/rogue/scenarios/*.yaml` (19 files, 501 scenarios)

### Related Documentation
- **Rogue Runner Implementation:** `infrastructure/testing/rogue_runner.py`
- **Scenario Loader:** `infrastructure/testing/scenario_loader.py`
- **A2A Service:** `a2a_service.py`
- **Start Script:** `scripts/start_a2a_service.sh`

---

## Support & Escalation

### Level 1: Self-Service (Pass Rate 85-95%)
- Read execution logs
- Check troubleshooting guide in runbook
- Re-run with caching disabled

### Level 2: Routine Issues (Pass Rate 75-84%)
- Contact: Forge (Testing Agent)
- Timeline: Fix within 1-2 days
- Action: Document failures, create tickets

### Level 3: Critical Issues (Pass Rate <75%)
- Contact: All agents (Hudson + Cora + Alex + Forge)
- Timeline: Fix immediately (hours)
- Action: Emergency triage, all-hands debugging

### Level 4: Production Incident
- Contact: Manual override + all agents
- Timeline: Rollback <30 min, hotfix <4 hours
- Action: Immediate rollback, emergency hotfix

---

## Validation Checklist

Before running validation:
- [ ] Port 8000 is free
- [ ] 18+ scenario files present
- [ ] Rogue CLI (uvx) installed
- [ ] 500MB+ disk space available
- [ ] OpenAI API key set
- [ ] Redis running (optional, for caching)

After validation completes:
- [ ] Check pass rate (target: ≥85%)
- [ ] Check P0 pass rate (target: ≥90%)
- [ ] Review failure reports
- [ ] Archive results
- [ ] Stop A2A service
- [ ] Clean temp files

For deployment approval:
- [ ] Overall pass rate ≥85%
- [ ] P0 critical pass rate ≥90%
- [ ] Cost within budget (<$30)
- [ ] Runtime acceptable (<40 min)
- [ ] No P0 blockers identified

---

## Quick Reference

### One-Liner: Full Validation
```bash
cd /home/genesis/genesis-rebuild && ./scripts/run_rogue_validation.sh full
```

### One-Liner: P0 Only
```bash
cd /home/genesis/genesis-rebuild && ./scripts/run_rogue_validation.sh p0
```

### One-Liner: View Results
```bash
less reports/rogue/full_baseline/EXECUTIVE_SUMMARY.md
```

### One-Liner: Check Pass Rate
```bash
jq '.summary | {pass_rate, p0_rate: (.results[] | select(.priority == "P0") | .passed) / (.results[] | select(.priority == "P0") | length) * 100}' reports/rogue/full_baseline/results.json
```

---

## FAQ

**Q: How long does validation take?**
A: P0 only: 15 min. Full: 30 min. With caching: 6-10 min.

**Q: How much does it cost?**
A: P0 only: $8. Full: $24. With caching: $5-7.

**Q: Can I run validation in CI/CD?**
A: Yes! Use the automated script in your pipeline.

**Q: What if validation fails?**
A: Check the decision matrix in the runbook. P0 failures block deployment.

**Q: Can I run partial validation?**
A: Yes! Use --priority flag to run specific priorities.

**Q: Is caching safe?**
A: Yes! Cache invalidates automatically when scenarios change.

**Q: What if I run out of API credits?**
A: Validation stops gracefully. Resume with caching enabled.

**Q: Can I run validation in parallel?**
A: Yes! Adjust --parallel flag (default: 5 workers).

---

## Next Steps

1. **Run Validation:**
   ```bash
   ./scripts/run_rogue_validation.sh full
   ```

2. **Check Results:**
   ```bash
   less reports/rogue/full_baseline/EXECUTIVE_SUMMARY.md
   ```

3. **If Approved:**
   - Archive results
   - Proceed to deployment
   - Monitor production metrics

4. **If Not Approved:**
   - Triage failures
   - Fix critical issues
   - Re-run validation

---

**Ready to start?**

```bash
cd /home/genesis/genesis-rebuild
./scripts/run_rogue_validation.sh full
```

**Good luck!** 🚀

---

**Version:** 1.0.0
**Last Updated:** October 30, 2025
**Owner:** Forge (Testing/E2E Validation)
**Status:** Production-Ready
