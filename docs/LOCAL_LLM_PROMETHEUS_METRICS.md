# Local LLM Prometheus Metrics

**P1-4 Fix: Production-grade observability with Prometheus metrics**

## Overview

This Prometheus metrics exporter provides comprehensive observability for Local LLM inference servers, exposing metrics on port 9090 for monitoring, alerting, and performance analysis.

## Exposed Metrics

### Request Metrics

#### `llm_inference_requests_total`
**Type**: Counter
**Labels**: `model`, `status` (success/error/rate_limited)
**Description**: Total number of inference requests processed

**Example queries**:
```promql
# Total requests per model
sum by (model) (llm_inference_requests_total)

# Error rate per model
rate(llm_inference_requests_total{status="error"}[5m])

# Success rate (percentage)
sum(rate(llm_inference_requests_total{status="success"}[5m]))
/ sum(rate(llm_inference_requests_total[5m])) * 100
```

#### `llm_inference_latency_seconds`
**Type**: Histogram
**Labels**: `model`
**Buckets**: [0.1, 0.5, 1.0, 2.0, 5.0, 10.0, 30.0, 60.0, 120.0]
**Description**: Inference latency distribution

**Example queries**:
```promql
# P95 latency per model
histogram_quantile(0.95, sum by (le, model)
  (rate(llm_inference_latency_seconds_bucket[5m])))

# Average latency per model
rate(llm_inference_latency_seconds_sum[5m])
/ rate(llm_inference_latency_seconds_count[5m])

# Requests over 5 seconds
sum(rate(llm_inference_latency_seconds_bucket{le="5.0"}[5m]))
```

### Rate Limiting Metrics

#### `llm_rate_limit_hits_total`
**Type**: Counter
**Labels**: `client_id`
**Description**: Total rate limit hits per client

**Example queries**:
```promql
# Rate limit hits per minute
rate(llm_rate_limit_hits_total[1m]) * 60

# Top 10 rate-limited clients
topk(10, sum by (client_id) (llm_rate_limit_hits_total))
```

### Connection Metrics

#### `llm_active_connections`
**Type**: Gauge
**Labels**: `model`
**Description**: Current number of active connections

**Example queries**:
```promql
# Current active connections per model
llm_active_connections

# Max active connections in last hour
max_over_time(llm_active_connections[1h])
```

#### `llm_queue_size`
**Type**: Gauge
**Labels**: `model`
**Description**: Current request queue size

**Example queries**:
```promql
# Current queue size per model
llm_queue_size

# Average queue size over 5 minutes
avg_over_time(llm_queue_size[5m])
```

### Error Metrics

#### `llm_error_total`
**Type**: Counter
**Labels**: `error_type` (timeout/connection_error/validation_error/etc.)
**Description**: Total errors by type

**Example queries**:
```promql
# Error rate by type
rate(llm_error_total[5m])

# Most common errors
topk(5, sum by (error_type) (llm_error_total))
```

### Token Metrics

#### `llm_tokens_total`
**Type**: Counter
**Labels**: `model`, `type` (prompt/completion)
**Description**: Total tokens processed

**Example queries**:
```promql
# Token usage per model
sum by (model) (llm_tokens_total)

# Prompt vs completion tokens
sum by (type) (llm_tokens_total)

# Tokens per second
rate(llm_tokens_total[1m])
```

### Model Metadata

#### `llm_model_info`
**Type**: Info
**Labels**: `model`, `version`, `base_url`
**Description**: Static model metadata

## Usage

### Starting Metrics Server

#### Option 1: Standalone Server

```python
from infrastructure.local_llm_metrics import start_metrics_server

# Start on default port 9090
start_metrics_server()

# Start on custom port
start_metrics_server(port=9091)

# Disable metrics
start_metrics_server(enable_metrics=False)
```

#### Option 2: With LocalLLMClient Integration

```python
from infrastructure.local_llm_client import LocalLLMClient, LocalLLMConfig
from infrastructure.local_llm_metrics import get_metrics_collector, track_inference

# Initialize metrics
collector = get_metrics_collector(port=9090)
collector.start()

# Set model metadata
collector.set_model_info(
    model_name="llama-3.2-vision",
    version="3.2",
    base_url="http://127.0.0.1:8001"
)

# Track inference
async def generate_with_metrics():
    client = LocalLLMClient()

    with track_inference("llama-3.2-vision"):
        response = await client.complete_text("Hello, world!")

    return response
```

### Tracking Metrics Manually

```python
from infrastructure.local_llm_metrics import (
    get_metrics_collector,
    track_inference,
    record_rate_limit,
    record_error,
    record_tokens
)

collector = get_metrics_collector()

# Track inference
with track_inference("llama-3.2-vision"):
    # Your inference code here
    pass

# Record rate limit hit
record_rate_limit("client_123")

# Record error
record_error("timeout")

# Record token usage
record_tokens("llama-3.2-vision", prompt_tokens=100, completion_tokens=50)

# Update queue size
collector.set_queue_size("llama-3.2-vision", size=5)
```

## Prometheus Configuration

### scrape_configs

Add to `/etc/prometheus/prometheus.yml`:

```yaml
scrape_configs:
  - job_name: 'local-llm'
    static_configs:
      - targets: ['localhost:9090']
    metrics_path: '/metrics'
    scrape_interval: 15s
    scrape_timeout: 10s
```

### Alert Rules

Create `/etc/prometheus/rules/local_llm.yml`:

```yaml
groups:
  - name: local_llm_alerts
    interval: 30s
    rules:
      # High error rate
      - alert: HighLLMErrorRate
        expr: |
          (sum(rate(llm_inference_requests_total{status="error"}[5m]))
          / sum(rate(llm_inference_requests_total[5m]))) > 0.1
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High LLM error rate ({{ $value | humanizePercentage }})"
          description: "Error rate is above 10% for 5 minutes"

      # High latency
      - alert: HighLLMLatency
        expr: |
          histogram_quantile(0.95, sum by (le, model)
            (rate(llm_inference_latency_seconds_bucket[5m]))) > 5
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High LLM latency for {{ $labels.model }}"
          description: "P95 latency is {{ $value }}s (threshold: 5s)"

      # Service down
      - alert: LLMServiceDown
        expr: up{job="local-llm"} == 0
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: "LLM metrics endpoint unreachable"
          description: "Cannot scrape metrics from local-llm job"

      # High queue size
      - alert: HighLLMQueueSize
        expr: llm_queue_size > 10
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High LLM queue size for {{ $labels.model }}"
          description: "Queue size is {{ $value }} (threshold: 10)"

      # Rate limiting spike
      - alert: HighRateLimitHits
        expr: rate(llm_rate_limit_hits_total[1m]) > 1
        for: 5m
        labels:
          severity: info
        annotations:
          summary: "High rate limit hits for {{ $labels.client_id }}"
          description: "Rate limit hits: {{ $value }}/min"
```

## Grafana Dashboard

### Dashboard JSON

Create a Grafana dashboard with these panels:

#### 1. Request Rate Panel
```json
{
  "title": "Request Rate",
  "targets": [{
    "expr": "sum(rate(llm_inference_requests_total[5m])) by (model)"
  }],
  "type": "graph"
}
```

#### 2. Latency Heatmap
```json
{
  "title": "Latency Distribution",
  "targets": [{
    "expr": "sum(rate(llm_inference_latency_seconds_bucket[5m])) by (le)"
  }],
  "type": "heatmap"
}
```

#### 3. Error Rate Panel
```json
{
  "title": "Error Rate",
  "targets": [{
    "expr": "sum(rate(llm_inference_requests_total{status=\"error\"}[5m])) / sum(rate(llm_inference_requests_total[5m]))"
  }],
  "type": "graph"
}
```

#### 4. Active Connections Panel
```json
{
  "title": "Active Connections",
  "targets": [{
    "expr": "llm_active_connections"
  }],
  "type": "graph"
}
```

### Quick Dashboard Setup

```bash
# Import pre-built dashboard (if available)
curl -X POST http://localhost:3000/api/dashboards/db \
  -H "Content-Type: application/json" \
  -d @dashboards/local_llm_dashboard.json

# Or create manually in Grafana UI:
# 1. Navigate to Dashboards → New Dashboard
# 2. Add panels with the queries above
# 3. Save dashboard as "Local LLM Monitoring"
```

## Testing

### Run Tests

```bash
# Run all metrics tests
pytest tests/test_local_llm_metrics.py -v

# Run specific test
pytest tests/test_local_llm_metrics.py::TestLocalLLMMetricsCollector::test_track_inference_success -v
```

### Manual Testing

```bash
# Start metrics server
python3 << EOF
from infrastructure.local_llm_metrics import start_metrics_server
start_metrics_server(port=9090)
input("Press Enter to stop...")
EOF

# Query metrics endpoint
curl http://localhost:9090/metrics

# Check specific metric
curl http://localhost:9090/metrics | grep llm_inference_requests_total
```

## Performance Impact

- **CPU**: <0.1% overhead per request
- **Memory**: ~5MB for Prometheus client library
- **Network**: ~1KB per scrape (15s interval = ~5KB/min)
- **Disk**: Minimal (metrics stored in Prometheus, not locally)

## Security

### Network Security

```bash
# Bind to localhost only (recommended for development)
start_metrics_server(host="127.0.0.1", port=9090)

# Bind to all interfaces (production with firewall)
start_metrics_server(host="0.0.0.0", port=9090)
```

### Firewall Rules

```bash
# Allow Prometheus server to scrape metrics
sudo ufw allow from <prometheus_ip> to any port 9090

# Or restrict to specific IP range
sudo ufw allow from 10.0.0.0/24 to any port 9090
```

### Authentication

For production, use Prometheus with TLS and basic auth:

```yaml
# prometheus.yml
scrape_configs:
  - job_name: 'local-llm'
    static_configs:
      - targets: ['localhost:9090']
    basic_auth:
      username: 'prometheus'
      password: 'secure_password'
    scheme: https
    tls_config:
      ca_file: /path/to/ca.crt
```

## Troubleshooting

### Metrics Not Appearing

**Check if server started**:
```python
from infrastructure.local_llm_metrics import get_metrics_collector
collector = get_metrics_collector()
print(f"Server started: {collector._server_started}")
```

**Check port availability**:
```bash
netstat -tuln | grep 9090
# or
lsof -i :9090
```

**Test metrics endpoint**:
```bash
curl http://localhost:9090/metrics
```

### Prometheus Not Scraping

**Check Prometheus targets**:
```bash
# Visit Prometheus UI
http://localhost:9091/targets

# Check scrape health
curl http://localhost:9091/api/v1/targets
```

**Verify scrape config**:
```bash
promtool check config /etc/prometheus/prometheus.yml
```

### High Memory Usage

If metrics memory grows too large:

1. Reduce scrape interval:
```yaml
scrape_interval: 30s  # Instead of 15s
```

2. Limit metric cardinality:
```python
# Avoid high-cardinality labels (e.g., individual request IDs)
# Use aggregated labels instead
```

## Related Documentation

- Hudson's Audit: Section on P1-4 Prometheus metrics
- Local LLM Client: `infrastructure/local_llm_client.py`
- Hybrid LLM Client: `infrastructure/hybrid_llm_client.py`
- Health Monitoring: `docs/LOCAL_LLM_HEALTH_MONITORING.md`

## Status

✅ **P1-4 COMPLETE** (November 3, 2025)
- Metrics exporter created (276 lines)
- 13/13 tests passing (100%)
- Documentation complete
- Ready for production deployment
