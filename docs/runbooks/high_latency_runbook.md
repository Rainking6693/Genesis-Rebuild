# High Latency Runbook

**Severity:** Warning  
**Last Updated:** 2025-10-31  
**Owner:** DevOps Team

## Overview

This runbook guides you through debugging and resolving high latency issues with fine-tuned models.

## Symptoms

- P95 latency > 5 seconds (warning)
- P95 latency > 10 seconds (critical)
- User complaints about slow responses
- Timeout errors increasing
- Prometheus alerts firing

## Immediate Actions

### 1. Check Current Latency (2 minutes)

```bash
# Check health endpoint latency
time curl http://localhost:8080/health

# Check Prometheus metrics
curl "http://localhost:9090/api/v1/query?query=histogram_quantile(0.95,rate(model_latency_ms_bucket[5m]))"

# Check logs for slow requests
grep -i "slow\|timeout\|latency" logs/finetuning/*.log | tail -20
```

### 2. Identify Affected Agents (3 minutes)

```bash
# Check latency per agent
python3 <<EOF
from infrastructure.analytics import AnalyticsTracker
tracker = AnalyticsTracker()
comparison = tracker.compare_variants(time_window_hours=1)

for agent in ['qa_agent', 'support_agent', 'legal_agent', 'analyst_agent', 'content_agent']:
    # Filter by agent (if analytics supports it)
    print(f"Checking {agent}...")
EOF
```

**Determine:**
- Which agents are slow?
- Is it all agents or specific ones?
- Is it fine-tuned models or baseline too?

## Diagnostic Steps

### Step 1: Check Model Response Times

```bash
# Test individual model latency
python3 <<EOF
import time
from infrastructure.model_registry import ModelRegistry

registry = ModelRegistry()
agents = ['qa_agent', 'support_agent', 'legal_agent', 'analyst_agent', 'content_agent']

for agent in agents:
    start = time.time()
    try:
        response = registry.chat(
            agent,
            [{'role': 'user', 'content': 'test'}],
            use_finetuned=True
        )
        latency = (time.time() - start) * 1000
        print(f"{agent}: {latency:.0f}ms")
    except Exception as e:
        print(f"{agent}: ERROR - {e}")
EOF
```

### Step 2: Check Network Latency

```bash
# Check API endpoint latency
time curl -X POST https://api.mistral.ai/v1/chat/completions \
  -H "Authorization: Bearer $MISTRAL_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"open-mistral-7b","messages":[{"role":"user","content":"test"}]}'

# Check DNS resolution
time nslookup api.mistral.ai
```

### Step 3: Check System Resources

```bash
# Check CPU usage
top -n 1 | head -20

# Check memory usage
free -h

# Check network usage
iftop -t -s 5

# Check disk I/O
iostat -x 1 5
```

### Step 4: Check Request Patterns

```bash
# Check request volume
grep -c "model.requests" logs/metrics.log | tail -10

# Check for concurrent requests
grep "concurrent\|parallel" logs/finetuning/*.log | tail -20

# Check for retries
grep -i "retry\|attempt" logs/finetuning/*.log | tail -20
```

## Root Cause Analysis

### Common Causes

1. **API Rate Limiting**
   - Mistral API throttling requests
   - Solution: Implement request queuing/throttling

2. **Network Issues**
   - High latency to Mistral API
   - Solution: Check network, use CDN/proxy if available

3. **Model Complexity**
   - Fine-tuned models slower than baseline
   - Solution: Profile model, optimize prompts

4. **Request Queue Buildup**
   - Too many concurrent requests
   - Solution: Implement request batching/queuing

5. **System Resource Constraints**
   - CPU/memory bottlenecks
   - Solution: Scale infrastructure

## Resolution Steps

### Solution 1: Implement Request Throttling

```python
# Add to ModelRegistry
import asyncio
from asyncio import Semaphore

class ModelRegistry:
    def __init__(self, max_concurrent: int = 10):
        self.semaphore = Semaphore(max_concurrent)
    
    async def chat_async(self, agent_name, messages):
        async with self.semaphore:
            return await self._chat_impl(agent_name, messages)
```

### Solution 2: Reduce Rollout Percentage

If latency is due to high load:

```bash
# Reduce to 5% temporarily
python scripts/rollout_models.py --percentage 5
```

### Solution 3: Switch to Baseline Models

If fine-tuned models are consistently slower:

```bash
# Temporarily disable fine-tuned models
python3 <<EOF
import yaml
with open('infrastructure/config/production.yaml') as f:
    config = yaml.safe_load(f)

config['models']['use_finetuned'] = False

with open('infrastructure/config/production.yaml', 'w') as f:
    yaml.dump(config, f)
EOF

# Restart orchestrator
systemctl restart genesis-orchestrator
```

### Solution 4: Optimize Prompts

If latency is due to long prompts/responses:

```python
# Reduce max_tokens in ModelConfig
from infrastructure.model_registry import ModelConfig

config = ModelConfig(
    fine_tuned_id="...",
    max_tokens=2048,  # Reduce from 4096
    temperature=0.7
)
```

### Solution 5: Implement Caching

Cache common requests:

```python
from functools import lru_cache
import hashlib

@lru_cache(maxsize=1000)
def cached_chat(agent_name, messages_hash):
    # Cache based on message content hash
    pass
```

## Monitoring

### Key Metrics to Watch

1. **P95 Latency:** Should be < 5 seconds
2. **P99 Latency:** Should be < 10 seconds
3. **Request Rate:** Monitor for spikes
4. **Error Rate:** Ensure errors aren't causing timeouts

### Alerts

- **Warning:** P95 > 5 seconds for 5 minutes
- **Critical:** P95 > 10 seconds for 2 minutes

## Prevention

1. **Load Testing:** Test latency under expected load
2. **Monitoring:** Set up latency dashboards
3. **Throttling:** Implement request rate limiting
4. **Caching:** Cache common requests
5. **Optimization:** Profile and optimize slow paths

## Escalation

If latency issues persist:

1. **Check API status:** Mistral status page
2. **Review recent changes:** Check deployment history
3. **Scale infrastructure:** Add more workers/instances
4. **Contact Mistral support:** If API-side issues

## Related Runbooks

- [Model Failure Runbook](model_failure_runbook.md)
- [Cost Overrun Runbook](cost_overrun_runbook.md)

