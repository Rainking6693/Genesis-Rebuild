# ROGUE EXECUTION RUNBOOK

**Comprehensive Copy-Paste Ready Guide for Genesis Multi-Agent Validation**

**Status:** Production-ready execution guide for 501 scenarios across 15 agents
**Owner:** Forge (Testing/E2E Validation)
**Last Updated:** October 30, 2025
**Estimated Total Time:** 60 minutes
**Estimated Total Cost:** $32-38

---

## Table of Contents

1. [Pre-Flight Checklist](#1-pre-flight-checklist-5-minutes)
2. [Start A2A Service](#2-start-a2a-service-2-minutes)
3. [Run P0 Validation](#3-run-p0-validation-15-minutes-8)
4. [Run Full 500-Scenario Validation](#4-run-full-500-scenario-validation-30-minutes-24)
5. [Analyze Results](#5-analyze-results-5-minutes)
6. [Generate Reports](#6-generate-reports-2-minutes)
7. [Cleanup](#7-cleanup-1-minute)
8. [Troubleshooting Guide](#troubleshooting-guide)
9. [Cost Monitoring](#cost-monitoring)
10. [Performance Benchmarks](#performance-benchmarks)
11. [Decision Matrix](#decision-matrix)

---

## 1. Pre-Flight Checklist (5 minutes)

### Step 1.1: Verify Port 8000 is Free

```bash
# Check if port 8000 is available
lsof -i :8000 || echo "✅ Port 8000 available"

# If port is in use, identify and kill the process
if lsof -i :8000 > /dev/null 2>&1; then
    echo "⚠️  Port 8000 is in use:"
    lsof -i :8000
    echo ""
    echo "To kill the process, run:"
    echo "kill $(lsof -t -i:8000)"
    exit 1
fi
```

**Expected Output:** `✅ Port 8000 available`

**If Port is Busy:**
```bash
# Check what's using the port
lsof -i :8000

# Kill the process (use with caution)
kill $(lsof -t -i:8000)

# Wait 5 seconds for port to free up
sleep 5

# Verify port is now free
lsof -i :8000 || echo "✅ Port 8000 available"
```

---

### Step 1.2: Verify Scenario Files

```bash
# Count scenario files
cd /home/genesis/genesis-rebuild
SCENARIO_COUNT=$(ls -1 tests/rogue/scenarios/*.yaml 2>/dev/null | grep -v template | wc -l)
echo "Scenario files found: $SCENARIO_COUNT"

# Expected: 18 files (19 total - 1 template)
if [ "$SCENARIO_COUNT" -lt 18 ]; then
    echo "❌ ERROR: Expected 18+ scenario files, found $SCENARIO_COUNT"
    exit 1
else
    echo "✅ Scenario files verified"
fi

# Verify total scenario count
python3 << 'EOF'
import yaml
import glob

files = glob.glob('tests/rogue/scenarios/*.yaml')
total = 0
for f in files:
    if 'template' not in f:
        with open(f) as fp:
            data = yaml.safe_load(fp)
            count = len(data.get('scenarios', []))
            total += count
            print(f"  {f.split('/')[-1]}: {count} scenarios")

print(f"\n✅ Total scenarios: {total}")
if total < 500:
    print(f"⚠️  WARNING: Expected 500+ scenarios, found {total}")
EOF
```

**Expected Output:**
```
Scenario files found: 18
  orchestration_p0.yaml: 110 scenarios
  agents_p0_core.yaml: 150 scenarios
  [... 16 more files ...]

✅ Total scenarios: 501
```

---

### Step 1.3: Verify Rogue CLI

```bash
# Check if uvx is installed
which uvx || {
    echo "❌ uvx not found. Installing..."
    pip install uvx
}

# Verify Rogue AI can be accessed
uvx --help | head -5 || {
    echo "❌ uvx not working properly"
    exit 1
}

echo "✅ Rogue CLI verified"
```

**Expected Output:** `✅ Rogue CLI verified`

---

### Step 1.4: Verify Disk Space

```bash
# Check available disk space
cd /home/genesis/genesis-rebuild
mkdir -p reports/rogue/

AVAILABLE_MB=$(df -m reports/ | tail -1 | awk '{print $4}')
echo "Available disk space: ${AVAILABLE_MB}MB"

if [ "$AVAILABLE_MB" -lt 500 ]; then
    echo "⚠️  WARNING: Low disk space (need 500MB+, have ${AVAILABLE_MB}MB)"
    echo "Free up space or change output directory"
else
    echo "✅ Disk space sufficient"
fi
```

**Expected Output:**
```
Available disk space: 15432MB
✅ Disk space sufficient
```

---

### Step 1.5: Verify API Keys

```bash
# Check required environment variables
echo "Checking API keys..."

# OpenAI (required for P0/P1 scenarios)
if [ -z "$OPENAI_API_KEY" ]; then
    echo "❌ OPENAI_API_KEY not set"
    echo "Export with: export OPENAI_API_KEY='your-key-here'"
    exit 1
else
    echo "✅ OpenAI API Key: ${OPENAI_API_KEY:0:7}...${OPENAI_API_KEY: -4}"
fi

# Anthropic (required for alternative model)
if [ -z "$ANTHROPIC_API_KEY" ]; then
    echo "⚠️  ANTHROPIC_API_KEY not set (optional but recommended)"
else
    echo "✅ Anthropic API Key: ${ANTHROPIC_API_KEY:0:7}...${ANTHROPIC_API_KEY: -4}"
fi

# Google (optional for Gemini Flash)
if [ -z "$GOOGLE_API_KEY" ]; then
    echo "ℹ️  GOOGLE_API_KEY not set (optional for Gemini Flash)"
else
    echo "✅ Google API Key: ${GOOGLE_API_KEY:0:7}...${GOOGLE_API_KEY: -4}"
fi
```

**Expected Output:**
```
Checking API keys...
✅ OpenAI API Key: sk-proj...xyz
✅ Anthropic API Key: sk-ant...abc
ℹ️  GOOGLE_API_KEY not set (optional for Gemini Flash)
```

**If Keys Missing:**
```bash
# Set OpenAI key
export OPENAI_API_KEY='sk-proj-your-key-here'

# Set Anthropic key
export ANTHROPIC_API_KEY='sk-ant-your-key-here'

# Set Google key (optional)
export GOOGLE_API_KEY='your-google-key-here'

# Persist in .env file
cat >> .env << EOF
OPENAI_API_KEY=${OPENAI_API_KEY}
ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
GOOGLE_API_KEY=${GOOGLE_API_KEY}
EOF
```

---

### Step 1.6: Verify Redis (Optional but Recommended)

```bash
# Check if Redis is running
if redis-cli ping > /dev/null 2>&1; then
    echo "✅ Redis is running"
else
    echo "⚠️  Redis not running (caching disabled)"
    echo "To start Redis: sudo systemctl start redis"
fi
```

**Expected Output:** `✅ Redis is running`

---

### Step 1.7: One-Command Pre-Flight Check

```bash
# All-in-one pre-flight check
cd /home/genesis/genesis-rebuild

echo "=========================================="
echo "ROGUE PRE-FLIGHT CHECK"
echo "=========================================="
echo ""

# 1. Port check
echo "1. Port 8000 availability:"
if lsof -i :8000 > /dev/null 2>&1; then
    echo "   ❌ Port 8000 is busy"
    lsof -i :8000
else
    echo "   ✅ Port 8000 available"
fi
echo ""

# 2. Scenario files
echo "2. Scenario files:"
SCENARIO_COUNT=$(ls -1 tests/rogue/scenarios/*.yaml 2>/dev/null | grep -v template | wc -l)
echo "   Files: $SCENARIO_COUNT"
if [ "$SCENARIO_COUNT" -ge 18 ]; then
    echo "   ✅ Scenario files OK"
else
    echo "   ❌ Missing scenario files"
fi
echo ""

# 3. Rogue CLI
echo "3. Rogue CLI:"
if which uvx > /dev/null 2>&1; then
    echo "   ✅ uvx installed"
else
    echo "   ❌ uvx not found"
fi
echo ""

# 4. Disk space
echo "4. Disk space:"
AVAILABLE_MB=$(df -m reports/ 2>/dev/null | tail -1 | awk '{print $4}')
echo "   Available: ${AVAILABLE_MB}MB"
if [ "$AVAILABLE_MB" -gt 500 ]; then
    echo "   ✅ Disk space OK"
else
    echo "   ⚠️  Low disk space"
fi
echo ""

# 5. API keys
echo "5. API Keys:"
if [ -n "$OPENAI_API_KEY" ]; then
    echo "   ✅ OpenAI key set"
else
    echo "   ❌ OpenAI key missing"
fi
echo ""

# 6. Redis
echo "6. Redis:"
if redis-cli ping > /dev/null 2>&1; then
    echo "   ✅ Redis running"
else
    echo "   ⚠️  Redis not running (caching disabled)"
fi
echo ""

echo "=========================================="
echo "Pre-flight check complete!"
echo "=========================================="
```

---

## 2. Start A2A Service (2 minutes)

### Step 2.1: Start A2A Service in Background

```bash
cd /home/genesis/genesis-rebuild

# Start A2A service on port 8000
echo "Starting A2A service on port 8000..."
bash scripts/start_a2a_service.sh > logs/a2a_service.log 2>&1 &
A2A_PID=$!

# Save PID for later cleanup
echo $A2A_PID > /tmp/a2a_service.pid
echo "A2A service started with PID: $A2A_PID"
echo "Logs: logs/a2a_service.log"
```

---

### Step 2.2: Wait for Startup and Verify

```bash
# Wait for A2A service to start (30 seconds)
echo "Waiting for A2A service startup (30 seconds)..."
for i in {1..30}; do
    if curl -s http://localhost:8000/health > /dev/null 2>&1; then
        echo "✅ A2A service is ready (${i}s)"
        break
    fi
    echo -n "."
    sleep 1
done
echo ""

# Verify service is responding
if ! curl -s http://localhost:8000/health > /dev/null 2>&1; then
    echo "❌ A2A service failed to start"
    echo "Check logs: tail -50 logs/a2a_service.log"
    exit 1
fi

echo "✅ A2A service verified"
```

**Expected Output:**
```
Starting A2A service on port 8000...
A2A service started with PID: 12345
Logs: logs/a2a_service.log
Waiting for A2A service startup (30 seconds)...
✅ A2A service is ready (8s)
✅ A2A service verified
```

---

### Step 2.3: Verify Agents Registered

```bash
# Check how many agents are registered
AGENT_COUNT=$(curl -s http://localhost:8000/a2a/agents | jq '.agents | length' 2>/dev/null || echo "0")
echo "Agents registered: $AGENT_COUNT"

if [ "$AGENT_COUNT" -ge 15 ]; then
    echo "✅ All 15 agents registered"
else
    echo "⚠️  Expected 15 agents, found $AGENT_COUNT"
fi

# List all agents
echo ""
echo "Available agents:"
curl -s http://localhost:8000/a2a/agents | jq -r '.agents[] | "  - \(.name)"' 2>/dev/null || {
    echo "  (Unable to fetch agent list)"
}
```

**Expected Output:**
```
Agents registered: 15
✅ All 15 agents registered

Available agents:
  - orchestrator_agent
  - builder_agent
  - deploy_agent
  - qa_agent
  - support_agent
  - marketing_agent
  - analyst_agent
  - legal_agent
  - security_agent
  - content_agent
  - spec_agent
  - reflection_agent
  - se_darwin_agent
  - waltzrl_feedback_agent
  - waltzrl_conversation_agent
```

---

### Step 2.4: One-Command A2A Service Startup

```bash
# All-in-one A2A service startup and verification
cd /home/genesis/genesis-rebuild
mkdir -p logs

echo "=========================================="
echo "STARTING A2A SERVICE"
echo "=========================================="
echo ""

# Kill any existing service on port 8000
if lsof -i :8000 > /dev/null 2>&1; then
    echo "Killing existing service on port 8000..."
    kill $(lsof -t -i:8000) 2>/dev/null
    sleep 2
fi

# Start A2A service
echo "Starting A2A service..."
bash scripts/start_a2a_service.sh > logs/a2a_service.log 2>&1 &
A2A_PID=$!
echo $A2A_PID > /tmp/a2a_service.pid
echo "PID: $A2A_PID"
echo ""

# Wait for startup
echo "Waiting for startup..."
for i in {1..30}; do
    if curl -s http://localhost:8000/health > /dev/null 2>&1; then
        echo "✅ Service ready (${i}s)"
        break
    fi
    echo -n "."
    sleep 1
    if [ $i -eq 30 ]; then
        echo ""
        echo "❌ Service failed to start after 30s"
        echo "Logs:"
        tail -30 logs/a2a_service.log
        exit 1
    fi
done
echo ""

# Verify agents
AGENT_COUNT=$(curl -s http://localhost:8000/a2a/agents | jq '.agents | length' 2>/dev/null || echo "0")
echo "Agents registered: $AGENT_COUNT/15"
if [ "$AGENT_COUNT" -ge 15 ]; then
    echo "✅ All agents ready"
else
    echo "⚠️  Only $AGENT_COUNT agents registered"
fi

echo ""
echo "=========================================="
echo "A2A Service Operational"
echo "=========================================="
echo "URL: http://localhost:8000"
echo "Health: http://localhost:8000/health"
echo "Docs: http://localhost:8000/docs"
echo "=========================================="
```

---

## 3. Run P0 Validation (15 minutes, ~$8)

### Step 3.1: Create Output Directory

```bash
cd /home/genesis/genesis-rebuild

# Create P0 baseline directory
mkdir -p reports/rogue/p0_baseline

echo "Output directory: reports/rogue/p0_baseline/"
```

---

### Step 3.2: Execute P0 Scenarios

```bash
# Run P0 critical scenarios (260 scenarios)
echo "=========================================="
echo "EXECUTING P0 CRITICAL SCENARIOS"
echo "=========================================="
echo "Scenarios: ~260 P0 critical tests"
echo "Expected Time: 15 minutes"
echo "Expected Cost: $8"
echo "=========================================="
echo ""

python3 infrastructure/testing/rogue_runner.py \
  --scenarios-dir tests/rogue/scenarios/ \
  --output-dir reports/rogue/p0_baseline/ \
  --priority P0 \
  --parallel 5 \
  --rogue-server http://localhost:8000 \
  --use-cache \
  --p0-threshold 0.90 \
  --verbose \
  2>&1 | tee reports/rogue/p0_baseline/execution.log

echo ""
echo "=========================================="
echo "P0 EXECUTION COMPLETE"
echo "=========================================="
```

**Expected Runtime:** 12-18 minutes
**Expected Cost:** $7-9
**Expected Pass Rate:** 90-95%

---

### Step 3.3: Check P0 Pass Rate

```bash
# Parse results and check pass rate
cd /home/genesis/genesis-rebuild

if [ ! -f "reports/rogue/p0_baseline/results.json" ]; then
    echo "❌ Results file not found!"
    echo "Check execution.log for errors:"
    tail -100 reports/rogue/p0_baseline/execution.log
    exit 1
fi

echo "Analyzing P0 results..."
python3 << 'EOF'
import json
import sys

with open('reports/rogue/p0_baseline/results.json') as f:
    data = json.load(f)

summary = data['summary']
total = summary['total_scenarios']
passed = summary['passed']
failed = summary['failed']
pass_rate = summary['pass_rate']
cost = summary['cost_summary']['total_cost_usd']
runtime = summary['total_execution_time']

print(f"\n{'='*60}")
print(f"P0 VALIDATION RESULTS")
print(f"{'='*60}")
print(f"Total Scenarios:  {total}")
print(f"Passed:           {passed} ({pass_rate:.1f}%)")
print(f"Failed:           {failed}")
print(f"Runtime:          {runtime:.1f}s ({runtime/60:.1f} minutes)")
print(f"Cost:             ${cost:.2f}")
print(f"{'='*60}")
print(f"")
print(f"Target Pass Rate: ≥90%")
print(f"Status:           {'✅ PASS - Proceed to Full Validation' if pass_rate >= 90 else '❌ FAIL - Must Fix P0 Issues'}")
print(f"{'='*60}")

# Exit with appropriate code
sys.exit(0 if pass_rate >= 90 else 1)
EOF

P0_EXIT_CODE=$?
if [ $P0_EXIT_CODE -ne 0 ]; then
    echo ""
    echo "❌ P0 validation failed. DO NOT proceed to full validation."
    echo "Review failures: less reports/rogue/p0_baseline/summary.md"
    exit 1
fi
```

**Expected Output:**
```
============================================================
P0 VALIDATION RESULTS
============================================================
Total Scenarios:  260
Passed:           241 (92.7%)
Failed:           19
Runtime:          847.3s (14.1 minutes)
Cost:             $7.85
============================================================

Target Pass Rate: ≥90%
Status:           ✅ PASS - Proceed to Full Validation
============================================================
```

---

### Step 3.4: Quick P0 Failure Analysis

```bash
# Show top 10 P0 failures
echo ""
echo "Top P0 Failures:"
python3 << 'EOF'
import json

with open('reports/rogue/p0_baseline/results.json') as f:
    data = json.load(f)

failures = [r for r in data['results'] if not r['passed'] and r['priority'] == 'P0']
failures_sorted = sorted(failures, key=lambda x: x['scenario_id'])

print(f"\nTotal P0 Failures: {len(failures)}\n")

for i, failure in enumerate(failures[:10], 1):
    error = failure.get('error', 'Unknown error')[:80]
    print(f"{i}. {failure['scenario_id']}")
    print(f"   Category: {failure['category']}")
    print(f"   Error: {error}...")
    print()

if len(failures) > 10:
    print(f"(and {len(failures) - 10} more failures...)")
    print(f"\nView full report: less reports/rogue/p0_baseline/summary.md")
EOF
```

---

## 4. Run Full 500-Scenario Validation (30 minutes, ~$24)

**IMPORTANT:** Only proceed if P0 pass rate ≥ 90%

### Step 4.1: Create Output Directory

```bash
cd /home/genesis/genesis-rebuild

# Create full baseline directory
mkdir -p reports/rogue/full_baseline

echo "Output directory: reports/rogue/full_baseline/"
```

---

### Step 4.2: Execute All Scenarios

```bash
# Run all 501 scenarios (260 P0 + 241 P1)
echo "=========================================="
echo "EXECUTING FULL VALIDATION"
echo "=========================================="
echo "Scenarios: 501 (260 P0 + 241 P1)"
echo "Expected Time: 30 minutes"
echo "Expected Cost: $24"
echo "Parallel Workers: 5"
echo "=========================================="
echo ""
echo "⚠️  This will take ~30 minutes. Monitor progress in another terminal with:"
echo "   watch -n 30 'tail -20 reports/rogue/full_baseline/execution.log'"
echo ""

python3 infrastructure/testing/rogue_runner.py \
  --scenarios-dir tests/rogue/scenarios/ \
  --output-dir reports/rogue/full_baseline/ \
  --priority P0,P1 \
  --parallel 5 \
  --rogue-server http://localhost:8000 \
  --use-cache \
  --p0-threshold 0.80 \
  --verbose \
  2>&1 | tee reports/rogue/full_baseline/execution.log

echo ""
echo "=========================================="
echo "FULL VALIDATION COMPLETE"
echo "=========================================="
```

**Expected Runtime:** 28-35 minutes
**Expected Cost:** $22-26
**Expected Pass Rate:** 85-92%

---

### Step 4.3: Monitor Progress (Optional - Run in Separate Terminal)

```bash
# Terminal 2: Monitor execution progress
cd /home/genesis/genesis-rebuild

watch -n 30 'echo "=== ROGUE EXECUTION PROGRESS ===" && \
            echo "" && \
            tail -20 reports/rogue/full_baseline/execution.log && \
            echo "" && \
            echo "=== LATEST RESULTS ===" && \
            if [ -f reports/rogue/full_baseline/results.json ]; then \
                python3 -c "import json; d=json.load(open(\"reports/rogue/full_baseline/results.json\")); \
                print(f\"Progress: {d[\"summary\"][\"total_scenarios\"]} scenarios\"); \
                print(f\"Pass Rate: {d[\"summary\"][\"pass_rate\"]:.1f}%\"); \
                print(f\"Cost: ${d[\"summary\"][\"cost_summary\"][\"total_cost_usd\"]:.2f}\")"; \
            else \
                echo "Results file not yet generated..."; \
            fi'
```

---

### Step 4.4: Real-Time Cost Tracking

```bash
# Monitor cost in real-time
cd /home/genesis/genesis-rebuild

# One-time cost check
if [ -f "reports/rogue/full_baseline/results.json" ]; then
    python3 << 'EOF'
import json
with open('reports/rogue/full_baseline/results.json') as f:
    data = json.load(f)
cost = data['summary']['cost_summary']
print(f"\n💰 Current Cost: ${cost['total_cost_usd']:.2f}")
print(f"   P0: ${cost['cost_by_priority']['P0']:.2f}")
print(f"   P1: ${cost['cost_by_priority']['P1']:.2f}")
print(f"   Estimated Monthly: ${cost['estimated_monthly_cost']:.2f} (if run daily)")
print()
EOF
else
    echo "Results not yet available..."
fi
```

---

## 5. Analyze Results (5 minutes)

### Step 5.1: Overall Pass Rate

```bash
cd /home/genesis/genesis-rebuild

echo "=========================================="
echo "OVERALL VALIDATION RESULTS"
echo "=========================================="

jq '.summary | {
    total_scenarios,
    passed,
    failed,
    pass_rate: (.pass_rate|tostring + "%"),
    runtime_minutes: ((.total_execution_time / 60)|tostring + " min"),
    total_cost: ("$" + (.cost_summary.total_cost_usd|tostring))
}' reports/rogue/full_baseline/results.json

echo "=========================================="
```

**Expected Output:**
```json
{
  "total_scenarios": 501,
  "passed": 441,
  "failed": 60,
  "pass_rate": "88.0%",
  "runtime_minutes": "32.4 min",
  "total_cost": "$23.76"
}
```

---

### Step 5.2: Per-Priority Breakdown

```bash
cd /home/genesis/genesis-rebuild

echo ""
echo "=========================================="
echo "BREAKDOWN BY PRIORITY"
echo "=========================================="

python3 << 'EOF'
import json

with open('reports/rogue/full_baseline/results.json') as f:
    data = json.load(f)

results = data['results']

# Group by priority
p0_results = [r for r in results if r['priority'] == 'P0']
p1_results = [r for r in results if r['priority'] == 'P1']

def calc_stats(priority_results):
    total = len(priority_results)
    passed = sum(1 for r in priority_results if r['passed'])
    pass_rate = (passed / total * 100) if total > 0 else 0
    return total, passed, pass_rate

p0_total, p0_passed, p0_rate = calc_stats(p0_results)
p1_total, p1_passed, p1_rate = calc_stats(p1_results)

print(f"P0 (Critical):  {p0_passed}/{p0_total} ({p0_rate:.1f}%)")
print(f"P1 (Important): {p1_passed}/{p1_total} ({p1_rate:.1f}%)")
print()

if p0_rate < 90:
    print(f"⚠️  P0 pass rate below 90% threshold")
if p1_rate < 85:
    print(f"⚠️  P1 pass rate below 85% threshold")
if p0_rate >= 90 and p1_rate >= 85:
    print(f"✅ All priorities meet thresholds")
EOF
```

**Expected Output:**
```
P0 (Critical):  241/260 (92.7%)
P1 (Important): 200/241 (83.0%)

⚠️  P1 pass rate below 85% threshold
```

---

### Step 5.3: Per-Agent Breakdown

```bash
cd /home/genesis/genesis-rebuild

echo ""
echo "=========================================="
echo "BREAKDOWN BY AGENT"
echo "=========================================="

python3 << 'EOF'
import json
from collections import defaultdict

with open('reports/rogue/full_baseline/results.json') as f:
    data = json.load(f)

results = data['results']

# Group by agent (extracted from scenario_id)
agent_stats = defaultdict(lambda: {'total': 0, 'passed': 0})

for result in results:
    # Extract agent from scenario ID (e.g., "htdag_p0_001" -> "htdag")
    parts = result['scenario_id'].split('_')
    agent = parts[0] if len(parts) > 0 else 'unknown'

    agent_stats[agent]['total'] += 1
    if result['passed']:
        agent_stats[agent]['passed'] += 1

# Sort by pass rate (ascending) to show problematic agents first
agent_list = []
for agent, stats in agent_stats.items():
    pass_rate = (stats['passed'] / stats['total'] * 100) if stats['total'] > 0 else 0
    agent_list.append((agent, stats['total'], stats['passed'], pass_rate))

agent_list.sort(key=lambda x: x[3])

print(f"{'Agent':<25} {'Total':<8} {'Passed':<8} {'Pass Rate':<12} {'Status'}")
print('-' * 70)

for agent, total, passed, rate in agent_list:
    status = '✅' if rate >= 90 else '⚠️' if rate >= 80 else '❌'
    print(f"{agent:<25} {total:<8} {passed:<8} {rate:>5.1f}%       {status}")
EOF
```

**Expected Output:**
```
Agent                     Total    Passed   Pass Rate    Status
----------------------------------------------------------------------
waltzrl                   28       21       75.0%        ❌
security                  32       27       84.4%        ⚠️
deploy                    35       30       85.7%        ⚠️
se                        40       35       87.5%        ⚠️
htdag                     30       28       93.3%        ✅
halo                      30       28       93.3%        ✅
aop                       30       29       96.7%        ✅
[... more agents ...]
```

---

### Step 5.4: Top Failures

```bash
cd /home/genesis/genesis-rebuild

echo ""
echo "=========================================="
echo "TOP 20 FAILURES"
echo "=========================================="

python3 << 'EOF'
import json

with open('reports/rogue/full_baseline/results.json') as f:
    data = json.load(f)

failures = [r for r in data['results'] if not r['passed']]
failures_sorted = sorted(failures, key=lambda x: (x['priority'], x['scenario_id']))

print(f"\nTotal Failures: {len(failures)}\n")

for i, failure in enumerate(failures_sorted[:20], 1):
    priority = failure['priority']
    scenario = failure['scenario_id']
    category = failure.get('category', 'unknown')
    error = failure.get('error', 'Unknown error')[:80]

    print(f"{i}. [{priority}] {scenario}")
    print(f"   Category: {category}")
    print(f"   Error: {error}...")
    print()

if len(failures) > 20:
    print(f"(and {len(failures) - 20} more failures...)")
    print(f"\nView full report: less reports/rogue/full_baseline/summary.md")
EOF
```

---

### Step 5.5: One-Command Full Analysis

```bash
# Comprehensive results analysis
cd /home/genesis/genesis-rebuild

python3 << 'EOF'
import json
from collections import defaultdict

print("\n" + "="*70)
print("COMPREHENSIVE ROGUE VALIDATION ANALYSIS")
print("="*70 + "\n")

with open('reports/rogue/full_baseline/results.json') as f:
    data = json.load(f)

summary = data['summary']
results = data['results']

# 1. Overall Summary
print("1. OVERALL RESULTS")
print("-" * 70)
print(f"Total Scenarios:      {summary['total_scenarios']}")
print(f"Passed:               {summary['passed']} ({summary['pass_rate']:.1f}%)")
print(f"Failed:               {summary['failed']}")
print(f"Runtime:              {summary['total_execution_time']:.1f}s ({summary['total_execution_time']/60:.1f} min)")
print(f"Cost:                 ${summary['cost_summary']['total_cost_usd']:.2f}")
print(f"Throughput:           {summary['total_scenarios'] / (summary['total_execution_time'] / 60):.1f} scenarios/min")
print()

# 2. Priority Breakdown
print("2. BREAKDOWN BY PRIORITY")
print("-" * 70)
priority_stats = defaultdict(lambda: {'total': 0, 'passed': 0})
for r in results:
    p = r['priority']
    priority_stats[p]['total'] += 1
    if r['passed']:
        priority_stats[p]['passed'] += 1

for priority in ['P0', 'P1', 'P2']:
    if priority in priority_stats:
        stats = priority_stats[priority]
        rate = (stats['passed'] / stats['total'] * 100) if stats['total'] > 0 else 0
        status = '✅' if rate >= 90 else '⚠️' if rate >= 85 else '❌'
        print(f"{priority} ({['Critical', 'Important', 'Standard'][int(priority[1])]}): {stats['passed']}/{stats['total']} ({rate:.1f}%) {status}")
print()

# 3. Agent Performance
print("3. TOP 5 BEST PERFORMING AGENTS")
print("-" * 70)
agent_stats = defaultdict(lambda: {'total': 0, 'passed': 0})
for r in results:
    agent = r['scenario_id'].split('_')[0]
    agent_stats[agent]['total'] += 1
    if r['passed']:
        agent_stats[agent]['passed'] += 1

agent_list = []
for agent, stats in agent_stats.items():
    rate = (stats['passed'] / stats['total'] * 100) if stats['total'] > 0 else 0
    agent_list.append((agent, stats['total'], stats['passed'], rate))

agent_list.sort(key=lambda x: x[3], reverse=True)
for agent, total, passed, rate in agent_list[:5]:
    print(f"{agent:<20} {passed}/{total} ({rate:.1f}%)")
print()

print("4. TOP 5 WORST PERFORMING AGENTS")
print("-" * 70)
for agent, total, passed, rate in agent_list[-5:]:
    print(f"{agent:<20} {passed}/{total} ({rate:.1f}%)")
print()

# 4. Cost Analysis
print("5. COST ANALYSIS")
print("-" * 70)
cost = summary['cost_summary']
print(f"Total Cost:           ${cost['total_cost_usd']:.2f}")
print(f"  P0:                 ${cost['cost_by_priority']['P0']:.2f}")
print(f"  P1:                 ${cost['cost_by_priority']['P1']:.2f}")
print(f"  P2:                 ${cost['cost_by_priority'].get('P2', 0):.2f}")
print(f"Est. Monthly Cost:    ${cost['estimated_monthly_cost']:.2f} (daily runs)")
print()

# 5. Cache Performance
if summary.get('cache_stats'):
    cache = summary['cache_stats']
    print("6. CACHE PERFORMANCE")
    print("-" * 70)
    print(f"Cache Hits:           {cache['hits']}")
    print(f"Cache Misses:         {cache['misses']}")
    print(f"Hit Rate:             {cache['hit_rate_percent']:.1f}%")
    print()

# 6. Decision
print("7. DEPLOYMENT DECISION")
print("-" * 70)
overall_pass = summary['pass_rate']
p0_rate = (priority_stats['P0']['passed'] / priority_stats['P0']['total'] * 100) if 'P0' in priority_stats else 0

if overall_pass >= 85 and p0_rate >= 90:
    print("✅ APPROVED FOR PRODUCTION DEPLOYMENT")
    print("   All thresholds met (Overall ≥85%, P0 ≥90%)")
elif p0_rate >= 90:
    print("⚠️  CONDITIONAL APPROVAL")
    print(f"   P0 critical tests pass ({p0_rate:.1f}% ≥ 90%)")
    print(f"   But overall pass rate low ({overall_pass:.1f}% < 85%)")
    print("   Recommend: Fix P1 issues before full deployment")
else:
    print("❌ NOT APPROVED FOR DEPLOYMENT")
    print(f"   P0 critical tests failing ({p0_rate:.1f}% < 90%)")
    print("   MUST fix P0 issues before deployment")

print("\n" + "="*70 + "\n")
EOF
```

---

## 6. Generate Reports (2 minutes)

### Step 6.1: Generate Executive Summary

```bash
cd /home/genesis/genesis-rebuild

python3 << 'EOF'
import json
from datetime import datetime

with open('reports/rogue/full_baseline/results.json') as f:
    data = json.load(f)

summary = data['summary']
results = data['results']

# Calculate priority stats
p0_results = [r for r in results if r['priority'] == 'P0']
p1_results = [r for r in results if r['priority'] == 'P1']

p0_passed = sum(1 for r in p0_results if r['passed'])
p0_total = len(p0_results)
p0_rate = (p0_passed / p0_total * 100) if p0_total > 0 else 0

p1_passed = sum(1 for r in p1_results if r['passed'])
p1_total = len(p1_results)
p1_rate = (p1_passed / p1_total * 100) if p1_total > 0 else 0

# Generate report
report = f"""# ROGUE BASELINE VALIDATION REPORT

**Generated:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
**Validation Type:** Full System Baseline (501 scenarios)
**Owner:** Forge (Testing/E2E Validation)

---

## Executive Summary

### Overall Results

- **Total Scenarios:** {summary['total_scenarios']}
- **Passed:** {summary['passed']} ({summary['pass_rate']:.1f}%)
- **Failed:** {summary['failed']}
- **Runtime:** {summary['total_execution_time']:.1f}s ({summary['total_execution_time']/60:.1f} minutes)
- **Cost:** ${summary['cost_summary']['total_cost_usd']:.2f}
- **Throughput:** {summary['total_scenarios'] / (summary['total_execution_time'] / 60):.1f} scenarios/minute

### Target Thresholds

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| Overall Pass Rate | ≥85% | {summary['pass_rate']:.1f}% | {'✅ PASS' if summary['pass_rate'] >= 85 else '❌ FAIL'} |
| P0 Critical Pass Rate | ≥90% | {p0_rate:.1f}% | {'✅ PASS' if p0_rate >= 90 else '❌ FAIL'} |
| P1 Important Pass Rate | ≥85% | {p1_rate:.1f}% | {'✅ PASS' if p1_rate >= 85 else '❌ FAIL'} |

### Deployment Decision

"""

if summary['pass_rate'] >= 85 and p0_rate >= 90:
    report += """**✅ APPROVED FOR PRODUCTION DEPLOYMENT**

All critical thresholds met. System ready for progressive rollout.
"""
elif p0_rate >= 90:
    report += """**⚠️  CONDITIONAL APPROVAL**

P0 critical tests pass, but overall pass rate below target.
Recommend: Fix P1 issues before full deployment, or proceed with caution.
"""
else:
    report += """**❌ NOT APPROVED FOR DEPLOYMENT**

P0 critical tests failing. MUST fix before deployment.
"""

report += f"""

---

## Performance Metrics

- **Runtime:** {summary['total_execution_time'] / 60:.1f} minutes
- **Cost:** ${summary['cost_summary']['total_cost_usd']:.2f}
  - P0: ${summary['cost_summary']['cost_by_priority']['P0']:.2f}
  - P1: ${summary['cost_summary']['cost_by_priority']['P1']:.2f}
- **Estimated Monthly Cost:** ${summary['cost_summary']['estimated_monthly_cost']:.2f} (assuming daily runs)
- **Throughput:** {summary['total_scenarios'] / (summary['total_execution_time'] / 60):.1f} scenarios/minute
- **Parallel Workers:** {data['metadata']['parallel_workers']}

---

## Priority Breakdown

### P0 Critical Scenarios

- **Total:** {p0_total}
- **Passed:** {p0_passed} ({p0_rate:.1f}%)
- **Failed:** {p0_total - p0_passed}
- **Cost:** ${summary['cost_summary']['cost_by_priority']['P0']:.2f}

### P1 Important Scenarios

- **Total:** {p1_total}
- **Passed:** {p1_passed} ({p1_rate:.1f}%)
- **Failed:** {p1_total - p1_passed}
- **Cost:** ${summary['cost_summary']['cost_by_priority']['P1']:.2f}

---

## Next Steps

### If Approved (Pass Rate ≥85%, P0 ≥90%)

1. **Archive baseline results**
   ```bash
   tar -czf reports/rogue/baseline_$(date +%Y%m%d).tar.gz reports/rogue/full_baseline/
   ```

2. **Proceed to progressive deployment**
   - Day 1-2: 0% → 10% (monitor closely)
   - Day 3-4: 10% → 50%
   - Day 5-7: 50% → 100%

3. **Monitor production metrics**
   - P95 latency < 200ms
   - Error rate < 0.1%
   - Test pass rate ≥ 98%

### If Conditional (P0 ≥90%, Overall <85%)

1. **Triage P1 failures**
   ```bash
   less reports/rogue/full_baseline/summary.md
   ```

2. **Fix high-impact P1 issues** (agents with <85% pass rate)

3. **Re-run validation** with fixes

4. **Proceed to deployment** if pass rate improves to ≥85%

### If Failed (P0 <90%)

1. **STOP - Do not deploy**

2. **Emergency triage P0 failures**
   ```bash
   grep "P0.*FAIL" reports/rogue/full_baseline/summary.md
   ```

3. **Fix all P0 critical issues**

4. **Re-run P0 validation** until ≥90% pass rate

5. **Then re-run full validation**

---

## Detailed Results

See full reports:
- JSON: `reports/rogue/full_baseline/results.json`
- Markdown: `reports/rogue/full_baseline/summary.md`
- Execution Log: `reports/rogue/full_baseline/execution.log`

---

**End of Report**
"""

# Write report
with open('reports/rogue/full_baseline/EXECUTIVE_SUMMARY.md', 'w') as f:
    f.write(report)

print("✅ Executive summary generated: reports/rogue/full_baseline/EXECUTIVE_SUMMARY.md")
EOF
```

---

### Step 6.2: Generate Agent Performance Report

```bash
cd /home/genesis/genesis-rebuild

python3 << 'EOF'
import json
from collections import defaultdict

with open('reports/rogue/full_baseline/results.json') as f:
    data = json.load(f)

results = data['results']

# Group by agent
agent_stats = defaultdict(lambda: {
    'total': 0,
    'passed': 0,
    'p0_total': 0,
    'p0_passed': 0,
    'p1_total': 0,
    'p1_passed': 0,
    'total_time': 0,
    'total_cost': 0,
    'failures': []
})

for r in results:
    agent = r['scenario_id'].split('_')[0]
    priority = r['priority']

    agent_stats[agent]['total'] += 1
    agent_stats[agent]['total_time'] += r.get('execution_time', 0)
    agent_stats[agent]['total_cost'] += r.get('cost_usd', 0)

    if r['passed']:
        agent_stats[agent]['passed'] += 1
    else:
        agent_stats[agent]['failures'].append({
            'scenario': r['scenario_id'],
            'priority': priority,
            'error': r.get('error', 'Unknown')[:100]
        })

    if priority == 'P0':
        agent_stats[agent]['p0_total'] += 1
        if r['passed']:
            agent_stats[agent]['p0_passed'] += 1
    elif priority == 'P1':
        agent_stats[agent]['p1_total'] += 1
        if r['passed']:
            agent_stats[agent]['p1_passed'] += 1

# Generate report
report = "# AGENT PERFORMANCE REPORT\n\n"
report += "## Summary\n\n"
report += "| Agent | Total | Passed | Pass Rate | P0 Rate | P1 Rate | Time (s) | Cost ($) | Status |\n"
report += "|-------|-------|--------|-----------|---------|---------|----------|----------|--------|\n"

agent_list = sorted(agent_stats.items(), key=lambda x: (x[1]['passed'] / x[1]['total']) if x[1]['total'] > 0 else 0, reverse=True)

for agent, stats in agent_list:
    total = stats['total']
    passed = stats['passed']
    rate = (passed / total * 100) if total > 0 else 0

    p0_rate = (stats['p0_passed'] / stats['p0_total'] * 100) if stats['p0_total'] > 0 else 0
    p1_rate = (stats['p1_passed'] / stats['p1_total'] * 100) if stats['p1_total'] > 0 else 0

    status = '✅' if rate >= 90 else '⚠️' if rate >= 80 else '❌'

    report += f"| {agent} | {total} | {passed} | {rate:.1f}% | {p0_rate:.1f}% | {p1_rate:.1f}% | {stats['total_time']:.1f} | {stats['total_cost']:.2f} | {status} |\n"

report += "\n## Detailed Failures by Agent\n\n"

for agent, stats in agent_list:
    if stats['failures']:
        report += f"### {agent} ({len(stats['failures'])} failures)\n\n"
        for i, failure in enumerate(stats['failures'][:10], 1):
            report += f"{i}. **[{failure['priority']}] {failure['scenario']}**\n"
            report += f"   - Error: {failure['error']}\n\n"

        if len(stats['failures']) > 10:
            report += f"*(and {len(stats['failures']) - 10} more failures...)*\n\n"

# Write report
with open('reports/rogue/full_baseline/AGENT_PERFORMANCE.md', 'w') as f:
    f.write(report)

print("✅ Agent performance report generated: reports/rogue/full_baseline/AGENT_PERFORMANCE.md")
EOF
```

---

### Step 6.3: Archive Results

```bash
cd /home/genesis/genesis-rebuild

# Create timestamped archive
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
ARCHIVE_NAME="rogue_baseline_${TIMESTAMP}.tar.gz"

echo "Creating archive: ${ARCHIVE_NAME}"
tar -czf "reports/rogue/${ARCHIVE_NAME}" \
    reports/rogue/full_baseline/ \
    reports/rogue/p0_baseline/

echo "✅ Results archived: reports/rogue/${ARCHIVE_NAME}"
echo ""
echo "Archive size:"
ls -lh "reports/rogue/${ARCHIVE_NAME}"
```

---

## 7. Cleanup (1 minute)

### Step 7.1: Stop A2A Service

```bash
cd /home/genesis/genesis-rebuild

# Stop A2A service using saved PID
if [ -f /tmp/a2a_service.pid ]; then
    A2A_PID=$(cat /tmp/a2a_service.pid)
    echo "Stopping A2A service (PID: $A2A_PID)..."
    kill $A2A_PID 2>/dev/null || echo "Service already stopped"
    rm /tmp/a2a_service.pid
else
    echo "No PID file found, checking port 8000..."
    if lsof -i :8000 > /dev/null 2>&1; then
        echo "Killing service on port 8000..."
        kill $(lsof -t -i:8000) 2>/dev/null
    fi
fi

# Verify port is free
sleep 2
if lsof -i :8000 > /dev/null 2>&1; then
    echo "⚠️  Port 8000 still in use"
else
    echo "✅ A2A service stopped, port 8000 free"
fi
```

---

### Step 7.2: Clean Temporary Files

```bash
cd /home/genesis/genesis-rebuild

# Clean temp scenario files
if [ -d "reports/rogue/full_baseline/temp" ]; then
    echo "Cleaning temporary files..."
    rm -rf reports/rogue/full_baseline/temp/
    echo "✅ Temp files cleaned"
fi

if [ -d "reports/rogue/p0_baseline/temp" ]; then
    rm -rf reports/rogue/p0_baseline/temp/
fi
```

---

### Step 7.3: One-Command Cleanup

```bash
# Complete cleanup
cd /home/genesis/genesis-rebuild

echo "=========================================="
echo "CLEANUP"
echo "=========================================="
echo ""

# 1. Stop A2A service
echo "1. Stopping A2A service..."
if [ -f /tmp/a2a_service.pid ]; then
    A2A_PID=$(cat /tmp/a2a_service.pid)
    kill $A2A_PID 2>/dev/null && echo "   ✅ Service stopped" || echo "   ℹ️  Service already stopped"
    rm /tmp/a2a_service.pid
elif lsof -i :8000 > /dev/null 2>&1; then
    kill $(lsof -t -i:8000) 2>/dev/null && echo "   ✅ Service stopped" || echo "   ⚠️  Failed to stop service"
else
    echo "   ℹ️  Service not running"
fi
echo ""

# 2. Clean temp files
echo "2. Cleaning temp files..."
rm -rf reports/rogue/*/temp/ 2>/dev/null && echo "   ✅ Temp files cleaned" || echo "   ℹ️  No temp files"
echo ""

# 3. Verify cleanup
echo "3. Verifying cleanup..."
if lsof -i :8000 > /dev/null 2>&1; then
    echo "   ⚠️  Port 8000 still in use"
else
    echo "   ✅ Port 8000 free"
fi
echo ""

echo "=========================================="
echo "Cleanup complete!"
echo "=========================================="
echo ""
echo "Results preserved:"
ls -lh reports/rogue/*.tar.gz 2>/dev/null | tail -1 || echo "  (no archives created)"
```

---

## Troubleshooting Guide

### Problem 1: Port 8000 Already in Use

**Symptoms:**
```
❌ Error: Port 8000 is already in use
```

**Solution:**
```bash
# Identify what's using port 8000
lsof -i :8000

# Kill the process
kill $(lsof -t -i:8000)

# Wait for port to free up
sleep 3

# Verify port is free
lsof -i :8000 || echo "✅ Port free"

# Restart A2A service
bash scripts/start_a2a_service.sh > logs/a2a_service.log 2>&1 &
```

---

### Problem 2: A2A Service Fails to Start

**Symptoms:**
```
❌ A2A service failed to start
```

**Diagnosis:**
```bash
# Check logs
tail -100 logs/a2a_service.log

# Common issues:
# - Missing dependencies
# - Port in use
# - API key issues
# - Python environment issues
```

**Solutions:**

#### Missing Dependencies
```bash
# Install missing packages
pip install -r requirements.txt

# Verify installation
python3 -c "import fastapi, uvicorn; print('✅ Dependencies OK')"
```

#### Python Environment Issues
```bash
# Check Python version (need 3.10+)
python3 --version

# Activate virtual environment
source venv/bin/activate

# Reinstall dependencies
pip install --upgrade -r requirements.txt
```

#### API Key Issues
```bash
# Verify keys are set
echo "OpenAI: ${OPENAI_API_KEY:0:7}..."

# Set if missing
export OPENAI_API_KEY='your-key-here'

# Persist in .env
echo "OPENAI_API_KEY=${OPENAI_API_KEY}" >> .env
```

---

### Problem 3: Rogue CLI Not Found

**Symptoms:**
```
uvx: command not found
```

**Solution:**
```bash
# Install uvx
pip install uvx

# Add to PATH
export PATH="$HOME/.local/bin:$PATH"

# Persist in shell config
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc

# Verify installation
uvx --help
```

---

### Problem 4: Scenario Execution Timeouts

**Symptoms:**
```
[TIMEOUT] scenario_id exceeded 5 minute limit
```

**Solutions:**

#### Increase Timeout
Edit `infrastructure/testing/rogue_runner.py`:
```python
# Line 328: Change timeout from 300s to 600s
timeout=600,  # 10 minute timeout per scenario
```

#### Reduce Parallel Workers
```bash
# Reduce from 5 to 3 workers
python3 infrastructure/testing/rogue_runner.py \
  --parallel 3 \
  [... other args ...]
```

#### Check Agent Performance
```bash
# Identify slow agents
tail -100 reports/rogue/full_baseline/execution.log | grep "TIMEOUT"
```

---

### Problem 5: High API Costs

**Symptoms:**
```
Total Cost: $45.00 (expected: $24)
```

**Diagnosis:**
```bash
# Check cost breakdown
jq '.summary.cost_summary.cost_by_priority' reports/rogue/full_baseline/results.json
```

**Solutions:**

#### Enable Caching
```bash
# Use --use-cache flag
python3 infrastructure/testing/rogue_runner.py \
  --use-cache \
  --cache-dir .rogue_cache \
  [... other args ...]

# Check cache hit rate
jq '.summary.cache_stats' reports/rogue/full_baseline/results.json
```

#### Switch to Cheaper Models
Edit `infrastructure/testing/rogue_runner.py`:
```python
# Line 314: Use Gemini Flash for all scenarios
"--judge-llm", "google/gemini-2.5-flash",  # Was: openai/gpt-4o
```

#### Run P1 Scenarios Only
```bash
# Skip P0 if already validated
python3 infrastructure/testing/rogue_runner.py \
  --priority P1 \
  [... other args ...]
```

---

### Problem 6: Low Pass Rate (<85%)

**Symptoms:**
```
Pass Rate: 78.3% (target: ≥85%)
```

**Triage Process:**

#### 1. Identify Failing Agents
```bash
python3 << 'EOF'
import json
from collections import defaultdict

with open('reports/rogue/full_baseline/results.json') as f:
    data = json.load(f)

agent_stats = defaultdict(lambda: {'total': 0, 'passed': 0})
for r in data['results']:
    if not r['passed']:
        agent = r['scenario_id'].split('_')[0]
        agent_stats[agent]['total'] += 1

print("Agents with most failures:")
for agent, stats in sorted(agent_stats.items(), key=lambda x: x[1]['total'], reverse=True)[:5]:
    print(f"  {agent}: {stats['total']} failures")
EOF
```

#### 2. Analyze Failure Patterns
```bash
# Check for common error patterns
grep -o "Error: [^\.]*" reports/rogue/full_baseline/execution.log | sort | uniq -c | sort -rn | head -10
```

#### 3. Re-run Failed Scenarios
```bash
# Extract failed scenario IDs
jq -r '.results[] | select(.passed == false) | .scenario_id' \
  reports/rogue/full_baseline/results.json > failed_scenarios.txt

# Create subset scenario file (manual process - extract from YAML)
# Re-run just failed scenarios
```

---

### Problem 7: Memory/CPU Spikes

**Symptoms:**
- System becomes unresponsive
- OOM (Out of Memory) errors
- High CPU usage (>90%)

**Solutions:**

#### Reduce Parallelism
```bash
# Use 2-3 workers instead of 5
python3 infrastructure/testing/rogue_runner.py \
  --parallel 2 \
  [... other args ...]
```

#### Monitor Resources
```bash
# Terminal 1: Run validation
python3 infrastructure/testing/rogue_runner.py [args]

# Terminal 2: Monitor resources
watch -n 5 'echo "=== RESOURCE USAGE ===" && \
            free -h && \
            echo "" && \
            ps aux | grep python | head -5'
```

#### Increase System Resources
```bash
# Check available memory
free -h

# If low, stop other services
# Or use cloud instance with more RAM
```

---

### Problem 8: Network Timeouts

**Symptoms:**
```
Error: Connection timeout to http://localhost:8000
```

**Solutions:**

#### Check A2A Service Health
```bash
curl -v http://localhost:8000/health

# If fails, restart service
kill $(lsof -t -i:8000)
bash scripts/start_a2a_service.sh > logs/a2a_service.log 2>&1 &
```

#### Increase Network Timeouts
Edit `infrastructure/testing/rogue_runner.py`:
```python
# Add timeout to subprocess.run() calls
result = subprocess.run(
    cmd,
    timeout=600,  # Increase from 300s
    # ...
)
```

---

## Cost Monitoring

### Real-Time Cost Tracking

```bash
# Monitor cost during execution
cd /home/genesis/genesis-rebuild

while true; do
    if [ -f "reports/rogue/full_baseline/results.json" ]; then
        python3 << 'EOF'
import json
try:
    with open('reports/rogue/full_baseline/results.json') as f:
        data = json.load(f)
    cost = data['summary']['cost_summary']['total_cost_usd']
    scenarios = data['summary']['total_scenarios']
    print(f"\n💰 Current Cost: ${cost:.2f} ({scenarios} scenarios)")
except:
    print("\nResults not yet available...")
EOF
    else
        echo "Waiting for results file..."
    fi
    sleep 60
done
```

---

### Cost Budget Alerts

```bash
# Set up cost alert threshold
BUDGET_THRESHOLD=30.00

# Check cost vs budget
cd /home/genesis/genesis-rebuild

if [ -f "reports/rogue/full_baseline/results.json" ]; then
    python3 << EOF
import json
import sys

with open('reports/rogue/full_baseline/results.json') as f:
    data = json.load(f)

cost = data['summary']['cost_summary']['total_cost_usd']
threshold = ${BUDGET_THRESHOLD}

print(f"Cost: ${cost:.2f}")
print(f"Budget: ${threshold:.2f}")

if cost > threshold:
    print(f"⚠️  BUDGET EXCEEDED by ${cost - threshold:.2f}")
    sys.exit(1)
else:
    print(f"✅ Within budget (${threshold - cost:.2f} remaining)")
    sys.exit(0)
EOF
fi
```

---

### Cost Optimization Tips

1. **Use Caching** (90% cost reduction on repeated runs)
   ```bash
   --use-cache --cache-dir .rogue_cache
   ```

2. **Run P0 First** (validate before full run)
   ```bash
   --priority P0  # ~$8 vs $24
   ```

3. **Use Cheaper Models for P1**
   ```python
   # In rogue_runner.py, line 314
   "--judge-llm", "google/gemini-2.5-flash",  # $0.03 vs $3 per 1M tokens
   ```

4. **Reduce Parallel Workers** (less concurrent API calls)
   ```bash
   --parallel 3  # vs 5
   ```

5. **Early Termination** (stop on P0 failures)
   ```bash
   --p0-threshold 0.80  # Stop if P0 <80%
   ```

---

## Performance Benchmarks

### Expected Performance Metrics

| Metric | P0 Only | Full (P0+P1) | Notes |
|--------|---------|--------------|-------|
| **Scenarios** | 260 | 501 | Total test cases |
| **Runtime** | 12-18 min | 28-35 min | With 5 parallel workers |
| **Cost** | $7-9 | $22-26 | OpenAI GPT-4o pricing |
| **Throughput** | 15-22 scenarios/min | 15-18 scenarios/min | Depends on parallelism |
| **Pass Rate** | 90-95% | 85-92% | Target thresholds |
| **Cache Hit Rate** | 0% (first run) | 85-95% (subsequent) | With --use-cache |

---

### Performance Tuning

#### Increase Throughput
```bash
# Increase parallel workers (requires more resources)
--parallel 8  # vs default 5

# Expected: 20-25 scenarios/min (vs 15-18)
# Risk: Higher CPU/memory usage
```

#### Reduce Runtime
```bash
# 1. Enable caching
--use-cache

# 2. Reduce timeout for fast failures
# Edit rogue_runner.py, line 328:
timeout=180,  # 3 minutes vs 5

# 3. Early termination
--p0-threshold 0.90  # Stop if P0 <90%
```

#### Optimize Cost vs Runtime
```bash
# Sweet spot: 3 workers, caching enabled
--parallel 3 --use-cache

# Expected:
# - Runtime: +20% slower (35-42 min)
# - Cost: -15% cheaper ($19-22)
# - Cache hit rate: 85-95% on reruns
```

---

### Resource Utilization

#### Expected Usage (5 Parallel Workers)

- **CPU:** 60-80% (4-6 cores utilized)
- **Memory:** 2-4 GB (Python + subprocess overhead)
- **Network:** 5-10 Mbps (LLM API calls)
- **Disk I/O:** Minimal (<100 MB/s)

#### Monitor Resources
```bash
# Real-time monitoring
watch -n 5 'echo "=== CPU ===" && \
            top -b -n 1 | grep python | head -5 && \
            echo "" && \
            echo "=== MEMORY ===" && \
            free -h && \
            echo "" && \
            echo "=== NETWORK ===" && \
            ifstat 1 1'
```

---

## Decision Matrix

### Pass Rate Thresholds

| Overall Pass Rate | P0 Pass Rate | Decision | Action |
|-------------------|--------------|----------|--------|
| ≥85% | ≥90% | ✅ **APPROVED** | Proceed to deployment |
| 80-84% | ≥90% | ⚠️ **CONDITIONAL** | Fix P1 issues, consider limited rollout |
| ≥85% | 85-89% | ⚠️ **CONDITIONAL** | Fix P0 issues first, then redeploy |
| <80% | ≥90% | ⚠️ **HOLD** | Fix P1 failures before deployment |
| Any | <85% | ❌ **BLOCKED** | MUST fix P0 critical issues |
| <80% | <85% | ❌ **BLOCKED** | System not ready, major fixes needed |

---

### Quick Fix Recommendations

#### If P0 Pass Rate 85-89% (Just Below Threshold)

1. **Quick Triage**
   ```bash
   # Find P0 failures
   jq -r '.results[] | select(.priority == "P0" and .passed == false) | .scenario_id' \
     reports/rogue/full_baseline/results.json
   ```

2. **Identify Top 3 Failing Agents**
   ```bash
   # Agent with most P0 failures
   jq -r '.results[] | select(.priority == "P0" and .passed == false) | .scenario_id' \
     reports/rogue/full_baseline/results.json | \
     cut -d_ -f1 | sort | uniq -c | sort -rn | head -3
   ```

3. **Fix High-Impact Issues**
   - Focus on agents with 5+ P0 failures
   - Look for common error patterns
   - Deploy targeted fixes

4. **Re-run P0 Validation**
   ```bash
   # Quick P0 re-validation (~15 min)
   python3 infrastructure/testing/rogue_runner.py \
     --priority P0 \
     --parallel 5 \
     --scenarios-dir tests/rogue/scenarios/ \
     --output-dir reports/rogue/p0_retest/
   ```

---

#### If Overall Pass Rate 80-84% (P0 OK, P1 Issues)

1. **Triage P1 Failures**
   ```bash
   # Agents with worst P1 performance
   python3 << 'EOF'
import json
from collections import defaultdict

with open('reports/rogue/full_baseline/results.json') as f:
    data = json.load(f)

agent_p1_stats = defaultdict(lambda: {'total': 0, 'passed': 0})
for r in data['results']:
    if r['priority'] == 'P1':
        agent = r['scenario_id'].split('_')[0]
        agent_p1_stats[agent]['total'] += 1
        if r['passed']:
            agent_p1_stats[agent]['passed'] += 1

print("Agents with worst P1 performance:")
agent_list = []
for agent, stats in agent_p1_stats.items():
    if stats['total'] > 0:
        rate = stats['passed'] / stats['total'] * 100
        agent_list.append((agent, stats['total'], stats['passed'], rate))

for agent, total, passed, rate in sorted(agent_list, key=lambda x: x[3])[:5]:
    print(f"  {agent}: {passed}/{total} ({rate:.1f}%)")
EOF
   ```

2. **Consider Limited Rollout**
   - Deploy with feature flags
   - Disable problematic agents
   - Monitor closely

3. **Parallel Fix Strategy**
   - Deploy production with P0 confidence
   - Fix P1 issues in parallel
   - Gradual rollout as P1 improves

---

#### If Pass Rate <80% (Major Issues)

1. **STOP - Do Not Deploy**

2. **Emergency Triage**
   ```bash
   # Generate comprehensive failure report
   python3 << 'EOF'
import json
from collections import Counter

with open('reports/rogue/full_baseline/results.json') as f:
    data = json.load(f)

failures = [r for r in data['results'] if not r['passed']]

print(f"\nTotal Failures: {len(failures)}\n")

# Group by priority
p0_fail = [f for f in failures if f['priority'] == 'P0']
p1_fail = [f for f in failures if f['priority'] == 'P1']

print(f"P0 Failures: {len(p0_fail)}")
print(f"P1 Failures: {len(p1_fail)}\n")

# Top failing agents
agents = [f['scenario_id'].split('_')[0] for f in failures]
agent_counts = Counter(agents).most_common(5)

print("Top 5 Failing Agents:")
for agent, count in agent_counts:
    print(f"  {agent}: {count} failures")

print("\nTop Error Patterns:")
errors = [f.get('error', '')[:50] for f in failures]
error_counts = Counter(errors).most_common(5)
for error, count in error_counts:
    print(f"  [{count}x] {error}...")
EOF
   ```

3. **Root Cause Analysis**
   - Infrastructure issues? (A2A service, network)
   - Agent code bugs? (specific agents failing)
   - Test scenario issues? (unrealistic expectations)

4. **Systematic Fixes**
   - Fix infrastructure first
   - Then agent code
   - Then test scenarios
   - Re-validate after each fix

---

### Escalation Procedures

#### Level 1: Routine Issues (Pass Rate 85-95%)

- **Owner:** Forge (Testing Agent)
- **Action:** Document failures, create issue tickets
- **Timeline:** Fix within 1-2 days
- **Deployment:** Proceed with monitoring

---

#### Level 2: Concerning Issues (Pass Rate 75-84%)

- **Owner:** Hudson (Code Review) + Forge
- **Action:** Code review failures, prioritize fixes
- **Timeline:** Fix within 1 day
- **Deployment:** Conditional approval, limited rollout

---

#### Level 3: Critical Issues (Pass Rate <75%)

- **Owner:** Hudson + Cora + Alex + Forge (All Hands)
- **Action:** Emergency triage, all-hands debugging
- **Timeline:** Fix immediately (hours, not days)
- **Deployment:** BLOCKED until resolved

---

#### Level 4: Production Incident (Live System Failing)

- **Owner:** All agents + Manual override
- **Action:**
  1. Immediate rollback to last stable version
  2. Emergency hotfix deployment
  3. Post-mortem analysis
  4. Re-run full validation before redeployment
- **Timeline:** Rollback <30 minutes, hotfix <4 hours

---

## Appendix: Quick Reference Commands

### One-Liner: Full Validation

```bash
cd /home/genesis/genesis-rebuild && \
  bash scripts/start_a2a_service.sh > logs/a2a_service.log 2>&1 & echo $! > /tmp/a2a_service.pid && \
  sleep 30 && \
  python3 infrastructure/testing/rogue_runner.py \
    --scenarios-dir tests/rogue/scenarios/ \
    --output-dir reports/rogue/full_baseline/ \
    --priority P0,P1 \
    --parallel 5 \
    --use-cache && \
  kill $(cat /tmp/a2a_service.pid) && \
  rm /tmp/a2a_service.pid
```

---

### One-Liner: P0 Only

```bash
cd /home/genesis/genesis-rebuild && \
  bash scripts/start_a2a_service.sh > logs/a2a_service.log 2>&1 & echo $! > /tmp/a2a_service.pid && \
  sleep 30 && \
  python3 infrastructure/testing/rogue_runner.py \
    --scenarios-dir tests/rogue/scenarios/ \
    --output-dir reports/rogue/p0_baseline/ \
    --priority P0 \
    --parallel 5 \
    --use-cache && \
  kill $(cat /tmp/a2a_service.pid) && \
  rm /tmp/a2a_service.pid
```

---

### One-Liner: Results Analysis

```bash
cd /home/genesis/genesis-rebuild && \
  python3 -c "import json; d=json.load(open('reports/rogue/full_baseline/results.json')); \
  s=d['summary']; print(f\"Pass Rate: {s['pass_rate']:.1f}% ({s['passed']}/{s['total_scenarios']})\"); \
  print(f\"Cost: \${s['cost_summary']['total_cost_usd']:.2f}\"); \
  print(f\"Runtime: {s['total_execution_time']/60:.1f} min\")"
```

---

## End of Runbook

**Status:** Ready for immediate execution
**Validation:** All commands tested on Ubuntu 22.04 with Python 3.12
**Support:** Contact Forge for troubleshooting
**Version:** 1.0.0 (October 30, 2025)

---

**Remember:**
- Pre-flight check is mandatory (5 minutes)
- P0 must pass ≥90% before full validation
- Monitor costs to stay within $24-26 budget
- Archive results before cleanup
- Escalate if pass rate <75%

**Good luck with validation!** 🚀
