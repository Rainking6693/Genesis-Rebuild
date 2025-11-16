# DeepEyesV2 Phase 1 - Integration Guide

## Quick Start

### 1. Basic Usage

```python
import asyncio
from infrastructure.deepeyesv2 import run_deepeyesv2_baseline

# Run baseline measurement with 10 invocations per tool
results = asyncio.run(run_deepeyesv2_baseline(invocations_per_tool=10))

print(f"Success Rate: {results['measurement_summary']['success_rate_pct']}%")
print(f"Report: {results['report_file']}")
```

### 2. Custom Measurement

```python
from infrastructure.deepeyesv2 import BaselineMeasurement

async def custom_baseline():
    measurement = BaselineMeasurement()

    # Run with custom parameters
    results = await measurement.run_baseline_measurement(
        invocations_per_tool=20,  # 20 calls per tool = 400+ total
        concurrent_tasks=10        # Run 10 in parallel
    )

    # Export detailed report
    report_file, report = await measurement.export_baseline_report()
    return results, report_file

results, report_file = asyncio.run(custom_baseline())
```

### 3. Real-Time Monitoring

```python
from infrastructure.deepeyesv2 import ToolReliabilityMonitor, ToolInvocation, ToolStatus
import time

monitor = ToolReliabilityMonitor(success_rate_threshold=85.0)

# In your agent code:
start = time.time()
try:
    result = my_tool_function()
    status = ToolStatus.SUCCESS
    error = None
except Exception as e:
    status = ToolStatus.FAILURE
    error = str(e)
    result = None

invocation = ToolInvocation(
    tool_name='my_tool',
    agent_name='MyAgent',
    parameters={'key': 'value'},
    result=result,
    status=status,
    latency_ms=(time.time() - start) * 1000,
    error_msg=error
)

monitor.tracker.record_invocation(invocation)

# Get reliability report
report = monitor.get_reliability_report()
print(report)
```

## Integration with Genesis Agents

### Pattern 1: Decorator-Based Wrapping

```python
import time
import functools
from infrastructure.deepeyesv2 import ToolInvocation, ToolStatus, BaselineTracker

tracker = BaselineTracker()

def track_tool_call(tool_name, agent_name):
    """Decorator to automatically track tool invocations."""
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            start = time.time()
            invocation = None
            try:
                result = func(*args, **kwargs)
                invocation = ToolInvocation(
                    tool_name=tool_name,
                    agent_name=agent_name,
                    parameters=kwargs,
                    result=result,
                    status=ToolStatus.SUCCESS,
                    latency_ms=(time.time() - start) * 1000
                )
                return result
            except Exception as e:
                invocation = ToolInvocation(
                    tool_name=tool_name,
                    agent_name=agent_name,
                    parameters=kwargs,
                    result=None,
                    status=ToolStatus.FAILURE,
                    latency_ms=(time.time() - start) * 1000,
                    error_msg=str(e)
                )
                raise
            finally:
                if invocation:
                    tracker.record_invocation(invocation)
        return wrapper
    return decorator

# Usage in agent:
@track_tool_call('api_call', 'MarketingAgent')
def call_anthropic_api(prompt):
    # Your API call here
    pass
```

### Pattern 2: Context Manager-Based Wrapping

```python
from contextlib import contextmanager
from infrastructure.deepeyesv2 import ToolInvocation, ToolStatus, BaselineTracker
import time

tracker = BaselineTracker()

@contextmanager
def track_invocation(tool_name, agent_name, parameters):
    """Context manager for tracking tool invocations."""
    start = time.time()
    result = None
    status = ToolStatus.SUCCESS
    error = None

    try:
        yield
    except Exception as e:
        status = ToolStatus.FAILURE
        error = str(e)
        raise
    finally:
        invocation = ToolInvocation(
            tool_name=tool_name,
            agent_name=agent_name,
            parameters=parameters,
            result=result,
            status=status,
            latency_ms=(time.time() - start) * 1000,
            error_msg=error
        )
        tracker.record_invocation(invocation)

# Usage:
with track_invocation('stripe_charge', 'BillingAgent', {'amount': 1000}):
    stripe_api.create_charge(amount=1000)
```

### Pattern 3: Direct Integration in Agents

Example for MarketingAgent:

```python
# In agents/marketing_agent.py

from infrastructure.deepeyesv2 import ToolInvocation, ToolStatus, BaselineTracker
import time

class MarketingAgent:
    def __init__(self):
        self.tracker = BaselineTracker()

    def call_api(self, api_name, parameters):
        """Call an API with automatic tracking."""
        start = time.time()
        try:
            # Your API call
            result = api_call(api_name, **parameters)
            self.tracker.record_invocation(ToolInvocation(
                tool_name=api_name,
                agent_name='MarketingAgent',
                parameters=parameters,
                result=result,
                status=ToolStatus.SUCCESS,
                latency_ms=(time.time() - start) * 1000
            ))
            return result
        except Exception as e:
            self.tracker.record_invocation(ToolInvocation(
                tool_name=api_name,
                agent_name='MarketingAgent',
                parameters=parameters,
                result=None,
                status=ToolStatus.FAILURE,
                latency_ms=(time.time() - start) * 1000,
                error_msg=str(e)
            ))
            raise
```

## Recommended Agent Integrations

### 1. MarketingAgent
- Track: Anthropic API calls, database queries, Stripe billing lookups
- Purpose: Measure content generation reliability and cost

### 2. ContentAgent
- Track: Vector embeddings, database operations, webhook deliveries
- Purpose: Monitor content processing pipeline

### 3. AnalyticsAgent
- Track: Analytics API calls, cache operations, database queries
- Purpose: Ensure metrics collection reliability

### 4. CodeReviewAgent
- Track: Code analysis tools, GitHub API calls, database storage
- Purpose: Measure code review quality and latency

### 5. DatabaseDesignAgent
- Track: Database schema operations, validation checks, storage operations
- Purpose: Monitor database design tool reliability

### 6. StripeIntegrationAgent
- Track: Stripe API calls, payment processing, database updates
- Purpose: Critical path reliability monitoring

### 7. SupportAgent
- Track: Ticket management, email delivery, database operations
- Purpose: Customer-facing service reliability

### 8. DeployAgent
- Track: Deployment commands, health checks, logging operations
- Purpose: Infrastructure reliability tracking

## Performance Tuning

### Concurrency Optimization

```python
# For I/O bound tools (API calls, network requests)
results = await measurement.run_baseline_measurement(
    invocations_per_tool=20,
    concurrent_tasks=10  # Higher concurrency safe for I/O
)

# For CPU bound tools (embeddings, analysis)
results = await measurement.run_baseline_measurement(
    invocations_per_tool=20,
    concurrent_tasks=3   # Lower concurrency to avoid contention
)

# For mixed workloads
results = await measurement.run_baseline_measurement(
    invocations_per_tool=20,
    concurrent_tasks=5   # Balanced approach
)
```

### Storage Optimization

```python
# Enable periodic stats cleanup for long-running services
import json
from pathlib import Path

def cleanup_old_invocations(keep_hours=24):
    """Archive old invocation logs."""
    from datetime import datetime, timedelta, timezone

    log_file = Path("logs/deepeyesv2/baseline/invocations.jsonl")
    cutoff = datetime.now(timezone.utc) - timedelta(hours=keep_hours)

    with log_file.open('r') as f:
        recent = [
            line for line in f
            if json.loads(line)['timestamp'] > cutoff.isoformat()
        ]

    with log_file.open('w') as f:
        f.writelines(recent)
```

## Monitoring and Alerting

### Health Check Endpoint

```python
from flask import Flask, jsonify
from infrastructure.deepeyesv2 import ToolReliabilityMonitor

app = Flask(__name__)
monitor = ToolReliabilityMonitor()

@app.route('/health/tools')
def tool_health():
    """Return current tool reliability status."""
    report = monitor.get_reliability_report()
    problematic = monitor.identify_problematic_tools()

    return jsonify({
        'status': 'degraded' if problematic else 'healthy',
        'healthy_tools': len(report['healthy_tools']),
        'at_risk_tools': len(report['at_risk_tools']),
        'critical_tools': len(report['critical_tools']),
        'problematic_tools': [
            {
                'name': t['tool_name'],
                'severity': t['severity'],
                'issues': t['issues']
            } for t in problematic[:10]
        ]
    })
```

### Alerting Integration

```python
# Alert on degradation
from infrastructure.deepeyesv2 import ToolReliabilityMonitor
import logging

monitor = ToolReliabilityMonitor(success_rate_threshold=80.0)

def check_tool_health():
    """Periodic health check."""
    problematic = monitor.identify_problematic_tools(min_calls=10)

    for tool in problematic:
        if tool['severity'] >= 2:
            # Send alert (Slack, PagerDuty, etc.)
            alert_message = f"ALERT: {tool['tool_name']} reliability critical"
            send_alert(alert_message)
```

## Testing Integration

### Unit Test Example

```python
import pytest
from infrastructure.deepeyesv2 import ToolInvocation, ToolStatus, BaselineTracker

def test_tool_tracking():
    """Test tool invocation tracking."""
    tracker = BaselineTracker()

    # Create test invocation
    inv = ToolInvocation(
        tool_name='test_api',
        agent_name='TestAgent',
        parameters={'key': 'value'},
        result={'success': True},
        status=ToolStatus.SUCCESS,
        latency_ms=42.5
    )

    # Record it
    tracker.record_invocation(inv)

    # Verify
    assert tracker.get_success_rate('test_api') == 100.0
    stats = tracker.get_tool_stats('test_api')
    assert stats.total_calls == 1
    assert stats.successful_calls == 1
    assert stats.get_mean_latency() == 42.5
```

### Integration Test Example

```python
import asyncio
import pytest
from infrastructure.deepeyesv2 import BaselineMeasurement

@pytest.mark.asyncio
async def test_baseline_measurement():
    """Test full baseline measurement."""
    measurement = BaselineMeasurement()

    # Run small baseline
    results = await measurement.run_baseline_measurement(
        invocations_per_tool=5,
        concurrent_tasks=2
    )

    # Verify results
    assert results['measurement_summary']['total_invocations'] == 100  # 5 * 20 tools
    assert results['measurement_summary']['success_rate_pct'] > 90.0
    assert len(results['tool_statistics']['tools']) == 20
```

## Troubleshooting

### Issue: Low throughput

**Solution**: Increase concurrent_tasks if tools are I/O-bound

```python
# Before: 50 inv/sec
results = await measurement.run_baseline_measurement(
    concurrent_tasks=2
)

# After: 200+ inv/sec
results = await measurement.run_baseline_measurement(
    concurrent_tasks=10
)
```

### Issue: High memory usage with many invocations

**Solution**: Use periodic stat export and archival

```python
# Export stats to file every 1000 invocations
if len(tracker.invocations) % 1000 == 0:
    tracker.save_stats(f"stats_{int(time.time())}.json")
    tracker.invocations.clear()  # Clear memory
```

### Issue: Missing tool metrics

**Solution**: Verify tool names match defined tools

```python
measurement = BaselineMeasurement()

# Show all defined tools
for tool_name in measurement.tools_to_measure.keys():
    print(tool_name)

# Verify your tool matches exactly
assert 'anthropic_api' in measurement.tools_to_measure
```

## Next Steps

1. **Integrate with Agents**: Add tracking to MarketingAgent, ContentAgent, etc.
2. **Set Baselines**: Run measurement campaign on existing workloads
3. **Monitor Continuously**: Deploy real-time monitoring
4. **Refine Tools**: Use recommendations to improve tool reliability
5. **Phase 2 Prep**: Prepare for RL refinement based on baseline metrics

## References

- DeepEyesV2 Paper: arXiv:2511.05271
- Architecture: infrastructure/deepeyesv2/ARCHITECTURE.md
- API Reference: docs/AGENT_API_REFERENCE.md
