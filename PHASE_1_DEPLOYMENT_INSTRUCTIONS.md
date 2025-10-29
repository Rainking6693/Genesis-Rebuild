# PHASE 1 DEPLOYMENT INSTRUCTIONS
**Date:** October 28, 2025
**Status:** ✅ READY TO START
**Duration:** 2-3 days (48-72 hours baseline capture)

---

## 📋 PHASE 1 OVERVIEW

**Goal:** Establish stable baseline metrics before enabling new features

**What's Running:**
- COMPUTER_USE_BACKEND=gemini (baseline Gemini, not Agent-S)
- USE_DOM_PARSING=false (vision-only, no DOM enhancement)
- USE_OPENHANDS=false (no OpenHands integration)
- All other core systems operational (HTDAG, HALO, AOP, DAAO, Error Handling, OTEL)

**Success Criteria:**
- Capture 48+ hours of stable metrics
- Establish baseline success rates for all 15 agents
- Document baseline P50/P95/P99 latencies
- Confirm error rate < 1%
- Verify cost per task < $0.01

---

## ✅ PRE-FLIGHT CHECKLIST

### 1. Environment Configuration
- [x] All 4 AI API keys configured (Anthropic, OpenAI, Gemini, DeepSeek)
- [x] MongoDB running (localhost:27017, version 7.0.25)
- [x] Redis running (localhost:6379/0)
- [x] Feature flags set to baseline values
- [x] All 9 Week 1-2-3 systems installed

### 2. Test Validation
- [x] 95/102 tests passing (93%)
- [x] OCR Regression: 26/26 passing (100%)
- [x] DOM Parsing: 11/11 passing (100%)
- [x] MemoryOS: 30/35 passing (86%)
- [x] OSWorld/WebArena: 28/30 passing (93%)

### 3. Services Operational
```bash
# MongoDB
python3 -c "from pymongo import MongoClient; print('MongoDB:', MongoClient('mongodb://localhost:27017').server_info()['version'])"
# Expected: MongoDB: 7.0.25

# Redis
python3 -c "import redis; print('Redis:', redis.from_url('redis://localhost:6379/0').ping())"
# Expected: Redis: True

# Smoke Tests
python3 -m pytest tests/test_smoke.py -v
# Expected: 22-25 passing (some skips OK)
```

---

## 📊 BASELINE METRICS TO CAPTURE

### Primary Metrics (Monitor Over 48-72 Hours)

**1. Success Rates (by agent)**
```python
# Track these for each of 15 agents:
- QA Agent success rate
- Support Agent success rate
- Analyst Agent success rate
- Security Agent success rate
- Legal Agent success rate
- Content Agent success rate
- Builder Agent success rate
- Deploy Agent success rate
- Monitor Agent success rate
- Design Agent success rate
- Marketing Agent success rate
- Sales Agent success rate
- Finance Agent success rate
- Ops Agent success rate
- Spec Agent success rate

# Target: 50-70% baseline (before optimizations)
# This will improve to 85-95% with Agent-S + DOM parsing
```

**2. Latency (milliseconds)**
```
- P50 (median): Expected ~200-400ms
- P95: Expected ~800-1200ms
- P99: Expected ~1500-2500ms

# These will improve 30-40% with Phase 6 optimizations
```

**3. Error Rate**
```
- Target: < 1%
- Categorize: Decomposition, Routing, Validation, LLM, Network
- Circuit breaker should activate at 5+ failures
```

**4. Cost Per Task**
```
- Baseline: ~$0.001-0.005 per task
- Expected after Phase 6: ~$0.0001-0.0006 (88-92% reduction)
```

### How to Monitor

**Option 1: Manual Testing**
```bash
# Run smoke tests periodically
python3 -m pytest tests/test_smoke.py -v

# Run orchestration tests
python3 -m pytest tests/test_orchestration_e2e.py -v

# Check logs for errors
tail -f logs/genesis.log
```

**Option 2: Automated Monitoring (If Prometheus/Grafana Available)**
```bash
# Check if monitoring stack is running
curl -s http://localhost:9090/api/v1/status/config  # Prometheus
curl -s http://localhost:3000/api/health            # Grafana

# If not running, start monitoring stack:
docker-compose up -d prometheus grafana alertmanager
```

**Option 3: MongoDB Metrics Collection**
```python
# Simple script to track task outcomes
from pymongo import MongoClient
import datetime

client = MongoClient('mongodb://localhost:27017')
db = client['genesis_rebuild']

# Query recent tasks
recent_tasks = db.tasks.find({
    'created_at': {'$gte': datetime.datetime.utcnow() - datetime.timedelta(hours=24)}
})

# Calculate success rate
total = 0
successful = 0
for task in recent_tasks:
    total += 1
    if task.get('status') == 'completed':
        successful += 1

print(f"Success Rate: {successful}/{total} ({100*successful/total:.1f}%)")
```

---

## 🎯 PHASE 1 DAILY CHECKLIST

### Day 1 (Today, October 28)
- [x] Verify all feature flags set to baseline
- [x] Validate services operational (MongoDB, Redis)
- [x] Run initial smoke tests
- [ ] Start collecting baseline metrics (manual or automated)
- [ ] Document initial observations

### Day 2 (October 29)
- [ ] Review 24-hour metrics
- [ ] Check for any P0 incidents (none expected)
- [ ] Verify stability (no crashes, no circuit breaker trips)
- [ ] Document baseline success rates

### Day 3 (October 30)
- [ ] Review 48-hour metrics
- [ ] Confirm stable baseline established
- [ ] Calculate average success rate, P50/P95/P99 latency
- [ ] Decision: Proceed to Phase 2 or extend baseline?

---

## 📈 EXPECTED BASELINE RESULTS

Based on system design and previous testing:

| Metric | Expected Baseline | Target (Post-Phase 2) |
|--------|------------------|----------------------|
| Overall Success Rate | 50-70% | 85-95% |
| P95 Latency | 800-1200ms | 500-800ms |
| Error Rate | 0.5-1% | < 0.1% |
| Cost Per Task | $0.001-0.005 | $0.0001-0.0006 |

**Key Insights:**
- Baseline represents Gemini-only Computer Use (no Agent-S)
- Vision-only observations (no DOM parsing)
- No OpenHands code generation assistance
- DAAO cost optimization active (48% reduction already applied)

---

## 🚨 ROLLBACK TRIGGERS (Automatic)

If any of these occur during Phase 1, investigate immediately:

```
❌ Success rate < 40% for 5+ consecutive minutes
❌ Error rate > 5% for 2+ consecutive minutes
❌ P95 latency > 3000ms for 5+ consecutive minutes
❌ Circuit breaker opens on critical path
❌ MongoDB/Redis connection failures
```

**Rollback is NOT needed for Phase 1** (we're already at baseline).
These triggers apply to Phase 2-4 when we enable new features.

---

## 📝 WHAT TO DOCUMENT

Create a baseline report after 48-72 hours with:

1. **Success Rate Summary**
   - Overall: X%
   - By agent (15 agents)
   - By task type (code, analysis, support, etc.)

2. **Latency Summary**
   - P50: Xms
   - P95: Xms
   - P99: Xms

3. **Error Analysis**
   - Total errors: X
   - By category (decomposition, routing, LLM, network)
   - Any patterns or recurring issues

4. **Cost Analysis**
   - Average cost per task: $X
   - Total 48-hour cost: $X
   - Projected monthly: $X

5. **Stability Assessment**
   - Any crashes? (none expected)
   - Circuit breaker activations? (none expected)
   - P0 incidents? (none expected)

---

## ✅ PHASE 1 COMPLETION CRITERIA

Phase 1 is complete when ALL of these are met:

- [ ] 48+ hours of continuous operation
- [ ] Baseline success rate documented (target: 50-70%)
- [ ] Baseline latency (P50/P95/P99) documented
- [ ] Error rate < 1% confirmed
- [ ] Zero P0 incidents
- [ ] All 15 agents tested and baselined
- [ ] MongoDB metrics collection working
- [ ] Baseline report created

**Once complete, proceed to:**
→ `PHASE_2_AB_TESTING_INSTRUCTIONS.md` (10% traffic split)

---

## 🔧 TROUBLESHOOTING

### Issue: MongoDB Connection Failures
```bash
# Check service status
sudo systemctl status mongod

# Restart if needed
sudo systemctl restart mongod

# Verify connection
python3 -c "from pymongo import MongoClient; print(MongoClient('mongodb://localhost:27017').server_info())"
```

### Issue: Redis Connection Failures
```bash
# Check service status
sudo systemctl status redis

# Restart if needed
sudo systemctl restart redis

# Verify connection
redis-cli ping
```

### Issue: High Error Rate (>1%)
```bash
# Check logs for patterns
grep ERROR logs/genesis.log | tail -50

# Check if circuit breaker is opening
grep "circuit_breaker_open" logs/genesis.log
```

### Issue: API Rate Limits
```bash
# Check if hitting rate limits
grep "rate_limit" logs/genesis.log

# Temporarily reduce test frequency
# Add delays between test runs
```

---

## 📞 SUPPORT CONTACTS

- **Primary:** Genesis Team
- **Escalation:** Technical Lead
- **Critical:** Page all hands

---

## 📚 RELATED DOCUMENTATION

- `PRODUCTION_DEPLOYMENT_SUMMARY.md` - Overall deployment plan
- `WEEK_1_2_INTEGRATION_VALIDATION_REPORT.md` - System validation
- `PROJECT_STATUS.md` - Current status tracking
- `CLAUDE.md` - Development guidelines

---

**Document Version:** 1.0
**Last Updated:** October 28, 2025
**Status:** ✅ READY FOR PHASE 1 EXECUTION
**Next Review:** After 48-72 hours baseline capture
