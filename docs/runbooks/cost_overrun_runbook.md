# Cost Overrun Runbook

**Severity:** Warning/Critical  
**Last Updated:** 2025-10-31  
**Owner:** DevOps Team

## Overview

This runbook guides you through detecting and mitigating cost overruns for fine-tuned models.

## Symptoms

- Cost alerts firing (>$5/hour warning, >$20/hour critical)
- Unexpected cost spikes in Mistral dashboard
- Monthly cost projection exceeding budget
- Cost per request higher than expected

## Immediate Actions

### 1. Check Current Costs (2 minutes)

```bash
# Check Prometheus metrics
curl "http://localhost:9090/api/v1/query?query=increase(model_cost_usd[1h])"

# Check analytics
python3 <<EOF
from infrastructure.analytics import AnalyticsTracker
tracker = AnalyticsTracker()
comparison = tracker.compare_variants(time_window_hours=24)

print(f"Baseline cost (24h): ${comparison['baseline'].get('total_cost_usd', 0):.2f}")
print(f"Fine-tuned cost (24h): ${comparison['finetuned'].get('total_cost_usd', 0):.2f}")
print(f"Total cost (24h): ${comparison['baseline'].get('total_cost_usd', 0) + comparison['finetuned'].get('total_cost_usd', 0):.2f}")
EOF
```

### 2. Check Request Volume (3 minutes)

```bash
# Check request count
curl "http://localhost:9090/api/v1/query?query=rate(model_requests[1h])"

# Check logs for unusual activity
grep -c "model.requests" logs/metrics.log | tail -10

# Check for bot/abuse patterns
grep -i "bot\|crawl\|scrape" logs/finetuning/*.log | tail -20
```

### 3. Calculate Cost Per Request (2 minutes)

```bash
python3 <<EOF
from infrastructure.analytics import AnalyticsTracker
tracker = AnalyticsTracker()
comparison = tracker.compare_variants(time_window_hours=1)

baseline = comparison['baseline']
finetuned = comparison['finetuned']

if baseline['total_requests'] > 0:
    baseline_cpr = baseline['total_cost_usd'] / baseline['total_requests']
    print(f"Baseline cost per request: ${baseline_cpr:.6f}")

if finetuned['total_requests'] > 0:
    finetuned_cpr = finetuned['total_cost_usd'] / finetuned['total_requests']
    print(f"Fine-tuned cost per request: ${finetuned_cpr:.6f}")
EOF
```

## Diagnostic Steps

### Step 1: Identify Cost Drivers

```bash
# Check cost by agent
python3 <<EOF
from infrastructure.analytics import AnalyticsTracker
import json

tracker = AnalyticsTracker()
data = tracker._load_data(time_window_hours=24)

# Aggregate by agent
agent_costs = {}
for entry in data:
    agent = entry.get('agent_name', 'unknown')
    cost = entry.get('cost_usd', 0)
    agent_costs[agent] = agent_costs.get(agent, 0) + cost

for agent, cost in sorted(agent_costs.items(), key=lambda x: x[1], reverse=True):
    print(f"{agent}: ${cost:.2f}")
EOF
```

### Step 2: Check for Anomalies

```bash
# Check for unusually high-cost requests
python3 <<EOF
from infrastructure.analytics import AnalyticsTracker

tracker = AnalyticsTracker()
data = tracker._load_data(time_window_hours=1)

# Find high-cost requests
high_cost = [d for d in data if d.get('cost_usd', 0) > 0.01]
print(f"Requests with cost > $0.01: {len(high_cost)}")

if high_cost:
    print("\nTop 10 highest cost requests:")
    for entry in sorted(high_cost, key=lambda x: x.get('cost_usd', 0), reverse=True)[:10]:
        print(f"  {entry.get('agent_name')}: ${entry.get('cost_usd', 0):.6f} "
              f"({entry.get('latency_ms', 0):.0f}ms)")
EOF
```

### Step 3: Check Token Usage

```bash
# Estimate token usage (if available in logs)
grep -i "tokens\|token_count" logs/finetuning/*.log | tail -20

# Mistral pricing: ~$0.25 per 1M input tokens, ~$0.25 per 1M output tokens
# Check if requests are using excessive tokens
```

## Root Cause Analysis

### Common Causes

1. **High Request Volume**
   - Unusual traffic spike
   - Bot/scraper activity
   - Solution: Implement rate limiting

2. **Long Prompts/Responses**
   - Excessive token usage per request
   - Solution: Optimize prompts, reduce max_tokens

3. **Fine-Tuned Model Costs**
   - Fine-tuned models cost more than baseline
   - Solution: Reduce rollout percentage, optimize model

4. **Inefficient Batching**
   - Too many individual requests
   - Solution: Implement request batching

5. **Error Retries**
   - Retries causing duplicate costs
   - Solution: Fix root cause, limit retries

## Resolution Steps

### Solution 1: Reduce Rollout Percentage

```bash
# Reduce to lower percentage
python scripts/rollout_models.py --percentage 5

# Or disable fine-tuned models temporarily
python scripts/rollout_models.py --percentage 0
```

### Solution 2: Implement Rate Limiting

```python
# Add rate limiting to ModelRegistry
from ratelimit import limits, RateLimitException
import time

class ModelRegistry:
    @limits(calls=100, period=60)  # 100 requests per minute
    def chat(self, agent_name, messages):
        # Existing implementation
        pass
```

### Solution 3: Optimize Token Usage

```python
# Reduce max_tokens in ModelConfig
from infrastructure.model_registry import ModelConfig

# Update configs to use fewer tokens
config = ModelConfig(
    fine_tuned_id="...",
    max_tokens=2048,  # Reduce from 4096
    temperature=0.7
)
```

### Solution 4: Implement Request Batching

```python
# Batch multiple requests together
async def batch_chat(requests: List[Tuple[str, List[Dict]]]):
    """Batch multiple chat requests"""
    # Implement batching logic
    pass
```

### Solution 5: Add Cost Budgets

```python
# Add daily cost budget
class CostBudget:
    def __init__(self, daily_budget_usd: float = 50.0):
        self.daily_budget = daily_budget_usd
        self.daily_spent = 0.0
    
    def check_budget(self, estimated_cost: float) -> bool:
        if self.daily_spent + estimated_cost > self.daily_budget:
            return False
        return True
```

## Emergency Actions

### If Costs Exceed $100/hour:

1. **IMMEDIATE:** Disable fine-tuned models
   ```bash
   python scripts/rollout_models.py --percentage 0
   ```

2. **IMMEDIATE:** Enable strict rate limiting
   ```python
   # Set max requests per minute to 10
   ```

3. **IMMEDIATE:** Check for abuse/bots
   ```bash
   # Block suspicious IPs/patterns
   ```

### If Costs Exceed Monthly Budget:

1. **STOP:** All fine-tuned model usage
2. **SWITCH:** To baseline models only
3. **INVESTIGATE:** Root cause of overrun
4. **REVIEW:** Budget and cost projections

## Monitoring

### Key Metrics to Watch

1. **Hourly Cost:** Should be < $5/hour (warning) or < $20/hour (critical)
2. **Cost Per Request:** Compare baseline vs fine-tuned
3. **Request Volume:** Monitor for spikes
4. **Token Usage:** Track average tokens per request

### Alerts

- **Warning:** Cost > $5/hour for 1 hour
- **Critical:** Cost > $20/hour for 30 minutes
- **Emergency:** Cost > $100/hour (immediate action)

## Prevention

1. **Budget Alerts:** Set up daily/weekly budget alerts
2. **Rate Limiting:** Implement per-user/IP rate limits
3. **Cost Monitoring:** Dashboard showing real-time costs
4. **Token Optimization:** Regularly review and optimize prompts
5. **Cost Reviews:** Weekly cost analysis and optimization

## Cost Optimization Tips

1. **Use Baseline When Possible:** Baseline models are cheaper
2. **Cache Common Requests:** Reduce redundant API calls
3. **Batch Requests:** Combine multiple requests when possible
4. **Optimize Prompts:** Shorter prompts = lower costs
5. **Monitor Usage:** Regular cost reviews

## Escalation

If cost overrun persists:

1. **Finance Team:** Review budget and projections
2. **Engineering Lead:** Review architecture and optimization opportunities
3. **Mistral Support:** Check for billing issues or optimization tips

## Related Runbooks

- [Model Failure Runbook](model_failure_runbook.md)
- [High Latency Runbook](high_latency_runbook.md)

