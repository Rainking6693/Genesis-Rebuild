# MCP Security Monitoring Guide

**Date:** December 2024  
**Status:** ✅ READY

## Overview

This guide explains how to monitor MCP security features in production, including audit logs, Prometheus metrics, and security alerts.

---

## 1. Audit Logging

### Log Format

MCP audit logs are written in structured JSON format:

```json
{
  "event": "mcp_tool_call",
  "tool_name": "read_file",
  "server_id": "filesystem",
  "user_id": "user123",
  "agent_name": "deploy_agent",
  "params_hash": "a1b2c3d4e5f6",
  "success": true,
  "latency_ms": 45.2,
  "timestamp": "2024-12-19T10:30:00Z"
}
```

### Event Types

1. **`mcp_tool_call`** - Tool execution (success or failure)
2. **`mcp_access_denied`** - Access control violation
3. **`mcp_rate_limit`** - Rate limit exceeded
4. **`mcp_budget_exceeded`** - Budget limit exceeded

### Viewing Audit Logs

```bash
# View all MCP audit events
grep "MCP_AUDIT:" autonomous_run.log

# View access denied events
grep "mcp_access_denied" autonomous_run.log

# View rate limit events
grep "mcp_rate_limit" autonomous_run.log

# View budget exceeded events
grep "mcp_budget_exceeded" autonomous_run.log
```

### Log Analysis

Use the monitoring script:

```bash
python3 infrastructure/monitoring/mcp_metrics.py
```

Or use the shell script:

```bash
./scripts/monitor_mcp_security.sh
```

---

## 2. Prometheus Metrics

### Available Metrics

#### Tool Call Metrics

- **`mcp_tool_calls_total`** - Total tool calls (by tool, server, status, user)
- **`mcp_tool_call_duration_seconds`** - Tool call duration histogram
- **`mcp_tool_call_errors_total`** - Total errors (by tool, error type)

#### Security Metrics

- **`mcp_rate_limit_hits_total`** - Rate limit hits (by tool, user)
- **`mcp_budget_exceeded_total`** - Budget exceeded events (by user)
- **`mcp_active_connections`** - Active MCP connections (by server)

### Querying Metrics

```promql
# Total tool calls in last hour
sum(rate(mcp_tool_calls_total[1h]))

# Error rate by tool
sum(rate(mcp_tool_call_errors_total[5m])) by (tool_name)

# Rate limit hits by user
sum(mcp_rate_limit_hits_total) by (user_id)

# Average latency by tool
avg(mcp_tool_call_duration_seconds) by (tool_name)

# Budget exceeded events
sum(mcp_budget_exceeded_total) by (user_id)
```

### Grafana Dashboards

Create dashboards with:

1. **Tool Call Volume** - Line chart of `mcp_tool_calls_total`
2. **Error Rate** - Line chart of error rate percentage
3. **Latency** - Histogram of `mcp_tool_call_duration_seconds`
4. **Security Events** - Bar chart of access denied, rate limits, budget exceeded
5. **Top Users** - Table of users by tool call count
6. **Top Tools** - Table of tools by call count

---

## 3. Security Alerts

### Alert Thresholds

Default thresholds (configurable):

- **Access Denied**: >10 per hour
- **Rate Limit Hits**: >20 per hour
- **Budget Exceeded**: >5 per hour
- **Error Rate**: >10%

### Setting Up Alerts

#### Prometheus Alert Rules

```yaml
groups:
  - name: mcp_security
    rules:
      - alert: HighAccessDeniedRate
        expr: rate(mcp_access_denied_total[1h]) > 10
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High MCP access denied rate"
          description: "{{ $value }} access denied events in last hour"

      - alert: HighErrorRate
        expr: |
          (
            sum(rate(mcp_tool_call_errors_total[5m])) /
            sum(rate(mcp_tool_calls_total[5m]))
          ) * 100 > 10
        for: 5m
        labels:
          severity: error
        annotations:
          summary: "High MCP error rate"
          description: "Error rate is {{ $value }}%"

      - alert: BudgetExceeded
        expr: rate(mcp_budget_exceeded_total[1h]) > 5
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High budget exceeded rate"
          description: "{{ $value }} budget exceeded events in last hour"
```

#### Python Monitoring

```python
from infrastructure.monitoring.mcp_metrics import monitor_mcp_security

# Generate security report
report = monitor_mcp_security("autonomous_run.log")

# Check for alerts
if report["alerts"]:
    for alert in report["alerts"]:
        print(f"ALERT: {alert['message']}")
```

---

## 4. Monitoring Best Practices

### 1. Regular Monitoring

- **Daily**: Review security events summary
- **Weekly**: Analyze tool usage patterns
- **Monthly**: Review and adjust rate limits and budgets

### 2. Key Metrics to Watch

- **Tool call success rate** - Should be >95%
- **Average latency** - Should be <1s for most tools
- **Access denied rate** - Should be low (<1% of calls)
- **Rate limit hits** - Indicates need for limit adjustment
- **Budget exceeded** - Indicates need for budget adjustment

### 3. Anomaly Detection

Watch for:
- Sudden spikes in tool calls
- Unusual error patterns
- Access denied from specific users/agents
- Budget exceeded from specific users

### 4. Log Retention

- **Audit logs**: Retain for 90 days minimum
- **Metrics**: Retain for 1 year (Prometheus)
- **Alerts**: Retain for 30 days

---

## 5. Troubleshooting

### High Access Denied Rate

**Symptoms**: Many `mcp_access_denied` events

**Causes**:
- Tool allowlist too restrictive
- User/agent permissions misconfigured

**Solutions**:
1. Review tool allowlists for agents
2. Check user_id and agent_name are set correctly
3. Verify tool names match registered tools

### High Error Rate

**Symptoms**: Many `mcp_tool_call_errors_total`

**Causes**:
- MCP server connection issues
- Invalid parameters
- Timeout issues

**Solutions**:
1. Check MCP server connectivity
2. Review parameter validation
3. Increase timeout if needed
4. Check circuit breaker status

### High Rate Limit Hits

**Symptoms**: Many `mcp_rate_limit_hits_total`

**Causes**:
- Rate limits too low
- Burst traffic patterns

**Solutions**:
1. Review rate limit configuration
2. Adjust per-server or per-tool limits
3. Consider burst allowance

### Budget Exceeded

**Symptoms**: Many `mcp_budget_exceeded_total`

**Causes**:
- Budget too low
- High tool usage

**Solutions**:
1. Review budget allocation
2. Adjust per-user budgets
3. Monitor tool usage patterns

---

## 6. Example Monitoring Script

```python
#!/usr/bin/env python3
"""Daily MCP security monitoring report"""

import json
from infrastructure.monitoring.mcp_metrics import monitor_mcp_security

def main():
    report = monitor_mcp_security("autonomous_run.log")
    
    print("MCP Security Report")
    print("=" * 60)
    print(f"Timestamp: {report['timestamp']}")
    print()
    
    # Tool call stats
    stats = report["tool_call_stats"]
    print(f"Total Calls: {stats['total_calls']}")
    print(f"Successful: {stats['successful']}")
    print(f"Failed: {stats['failed']}")
    print(f"Avg Latency: {stats['avg_latency_ms']:.2f}ms")
    print()
    
    # Security events
    security = report["security_events"]
    print("Security Events:")
    print(f"  Access Denied: {security['access_denied']['count']}")
    print(f"  Rate Limits: {security['rate_limits']['count']}")
    print(f"  Budget Exceeded: {security['budget_exceeded']['count']}")
    print()
    
    # Alerts
    if report["alerts"]:
        print("ALERTS:")
        for alert in report["alerts"]:
            print(f"  [{alert['severity'].upper()}] {alert['message']}")
    else:
        print("No alerts")
    
    # Save report
    with open("mcp_security_report.json", "w") as f:
        json.dump(report, f, indent=2)

if __name__ == "__main__":
    main()
```

---

## 7. Integration with Existing Monitoring

### Health Check Endpoint

Add MCP metrics to health check:

```python
from infrastructure.monitoring.mcp_metrics import MCPMetricsCollector

metrics = MCPMetricsCollector()

@app.get("/health/mcp")
async def mcp_health():
    return {
        "status": "healthy",
        "metrics": metrics.get_summary()
    }
```

### Prometheus Endpoint

Expose metrics:

```python
from fastapi import FastAPI
from prometheus_client import generate_latest
from infrastructure.monitoring.mcp_metrics import MCPMetricsCollector

app = FastAPI()
metrics = MCPMetricsCollector()

@app.get("/metrics")
async def prometheus_metrics():
    return Response(
        content=metrics.export_metrics(),
        media_type="text/plain"
    )
```

---

## Conclusion

Regular monitoring of MCP security features is essential for:
- Detecting security issues early
- Optimizing rate limits and budgets
- Understanding usage patterns
- Ensuring compliance

Use the provided tools and scripts to maintain visibility into MCP security.

---

**Generated:** December 2024  
**Status:** ✅ PRODUCTION READY

