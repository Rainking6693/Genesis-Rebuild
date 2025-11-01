# Model Failure Runbook

**Severity:** Critical  
**Last Updated:** 2025-10-31  
**Owner:** DevOps Team

## Overview

This runbook guides you through responding to fine-tuned model failures in production.

## Symptoms

- Model API errors (4xx/5xx responses)
- High error rate alerts (>5%)
- Fallback rate spikes (>10%)
- Health check endpoint returns errors
- Users reporting "model unavailable" errors

## Immediate Actions

### 1. Verify Scope (2 minutes)

```bash
# Check health endpoint
curl http://localhost:8080/health

# Check specific agent
curl http://localhost:8080/health/qa_agent

# Check logs
tail -f logs/finetuning/*.log | grep -i error
```

**Determine:**
- Single agent affected or all agents?
- Complete failure or degraded performance?
- Recent deployment or config change?

### 2. Check Model Registry Status (3 minutes)

```bash
# Verify model IDs are correct
python3 -c "
from infrastructure.model_registry import ModelRegistry
registry = ModelRegistry()
for agent in ['qa_agent', 'support_agent', 'legal_agent', 'analyst_agent', 'content_agent']:
    print(f'{agent}: {registry.get_model(agent)}')
"

# Test model connectivity
python3 -c "
from infrastructure.model_registry import ModelRegistry
registry = ModelRegistry()
try:
    response = registry.chat('qa_agent', [{'role': 'user', 'content': 'test'}])
    print('✅ Model accessible')
except Exception as e:
    print(f'❌ Model error: {e}')
"
```

### 3. Enable Fallback (1 minute)

If fine-tuned models are failing, ensure fallback is enabled:

```python
# Fallback should be automatic, but verify config
from infrastructure.model_registry import ModelRegistry
registry = ModelRegistry()

# Fallback happens automatically when use_fallback=True (default)
response = registry.chat(
    agent_name='qa_agent',
    messages=[{'role': 'user', 'content': 'test'}],
    use_finetuned=True,
    use_fallback=True  # Should be True by default
)
```

### 4. Check API Credentials (2 minutes)

```bash
# Verify Mistral API key is set
echo $MISTRAL_API_KEY | cut -c1-10

# Test API access
python3 -c "
from mistralai import Mistral
import os
client = Mistral(api_key=os.getenv('MISTRAL_API_KEY'))
response = client.chat.complete(
    model='open-mistral-7b',
    messages=[{'role': 'user', 'content': 'test'}]
)
print('✅ API accessible')
"
```

## Diagnostic Steps

### Step 1: Check Error Patterns

```bash
# Look for error patterns in logs
grep -i "error\|exception\|failed" logs/finetuning/*.log | tail -20

# Check for rate limiting
grep -i "rate limit\|429\|quota" logs/finetuning/*.log

# Check for authentication errors
grep -i "401\|403\|unauthorized" logs/finetuning/*.log
```

### Step 2: Verify Model Availability

```bash
# Check if model IDs are still valid
# (Mistral models should persist, but verify)

# Check Prometheus metrics
curl http://localhost:9090/api/v1/query?query=rate\(model_errors\[5m\]\)
```

### Step 3: Test Fallback Mechanism

```bash
# Manually test fallback
python3 <<EOF
from infrastructure.model_registry import ModelRegistry
registry = ModelRegistry()

# Force fallback by using invalid model ID temporarily
# (Don't do this in production, just verify fallback works)

print("Testing fallback mechanism...")
try:
    # Should fallback to baseline on error
    response = registry.chat(
        'qa_agent',
        [{'role': 'user', 'content': 'test'}],
        use_finetuned=True,
        use_fallback=True
    )
    print(f"✅ Fallback working: {len(response)} chars")
except Exception as e:
    print(f"❌ Fallback failed: {e}")
EOF
```

## Resolution Steps

### Scenario 1: API Credentials Issue

**Symptom:** 401/403 errors

**Fix:**
```bash
# Verify API key
export MISTRAL_API_KEY="your-api-key-here"

# Restart orchestrator
systemctl restart genesis-orchestrator
# OR
pkill -f genesis_orchestrator && nohup python genesis_orchestrator.py &
```

### Scenario 2: Rate Limiting

**Symptom:** 429 errors, "rate limit exceeded"

**Fix:**
1. Check API quota/limits in Mistral dashboard
2. Implement request throttling
3. Consider reducing rollout percentage temporarily:
   ```bash
   python scripts/rollout_models.py --percentage 5
   ```

### Scenario 3: Model Unavailable

**Symptom:** Model ID not found, 404 errors

**Fix:**
1. Verify model IDs in `infrastructure/model_registry.py`
2. Check Mistral dashboard for model status
3. If model deleted, regenerate fine-tuned model or use baseline

### Scenario 4: Complete System Failure

**Symptom:** All agents failing, no fallback working

**Fix:**
1. **IMMEDIATE:** Switch to baseline models:
   ```python
   # Update config to disable fine-tuned models
   # Set use_finetuned=False in all ModelRegistry calls
   ```
2. Rollback deployment if recent change
3. Check infrastructure (network, API endpoints)

## Rollback Procedure

If fine-tuned models are causing issues:

### Option 1: Disable Fine-Tuned Models

```bash
# Update production config
python3 <<EOF
import yaml
with open('infrastructure/config/production.yaml') as f:
    config = yaml.safe_load(f)

config['models']['use_finetuned'] = False

with open('infrastructure/config/production.yaml', 'w') as f:
    yaml.dump(config, f)

print("✅ Fine-tuned models disabled")
EOF

# Restart orchestrator
systemctl restart genesis-orchestrator
```

### Option 2: Reduce Rollout to 0%

```bash
python scripts/rollout_models.py --percentage 0
```

## Prevention

1. **Monitor metrics:** Set up alerts for error rate, latency, cost
2. **Health checks:** Run `/health` endpoint checks every 5 minutes
3. **Graceful degradation:** Always enable fallback (`use_fallback=True`)
4. **Testing:** Test model connectivity before deployment
5. **Rate limiting:** Implement request throttling to avoid API limits

## Escalation

If issue persists after following runbook:

1. **On-call engineer:** Check system logs and metrics
2. **DevOps lead:** Review infrastructure and API status
3. **Model team:** Verify fine-tuned model training and deployment

## Related Runbooks

- [High Latency Runbook](high_latency_runbook.md)
- [Cost Overrun Runbook](cost_overrun_runbook.md)

