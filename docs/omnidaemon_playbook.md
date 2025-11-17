# OmniDaemon Playbook

## Quick Start

### Starting OmniDaemon Workers

#### Development (Local)
```bash
# Start 5 workers locally
scripts/start_omnidaemon_workers.sh 5

# Verify workers are running
omnidaemon health
# Expected: status=healthy, active_workers=5, queue_depth=0
```

#### Production (Systemd)
```bash
# Copy service file to systemd
sudo cp deploy/omnidaemon-genesis.service /etc/systemd/system/

# Enable and start
sudo systemctl enable omnidaemon-genesis
sudo systemctl start omnidaemon-genesis

# Check status
sudo systemctl status omnidaemon-genesis
journalctl -u omnidaemon-genesis -f  # Follow logs
```

#### Kubernetes (Future)
```yaml
# deploy/k8s/omnidaemon-worker.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: omnidaemon-workers
spec:
  replicas: 5
  selector:
    matchLabels:
      app: omnidaemon
  template:
    metadata:
      labels:
        app: omnidaemon
    spec:
      containers:
      - name: worker
        image: genesis:omnidaemon-latest
        env:
        - name: REDIS_URL
          valueFrom:
            secretKeyRef:
              name: genesis-secrets
              key: redis-url
```

---

## Publishing Tasks

### Python SDK

#### Business Generation (Meta Agent)
```python
import asyncio
from infrastructure.omnidaemon_bridge import get_bridge

async def generate_business():
    bridge = get_bridge()

    task_id = await bridge.publish_event(
        topic="genesis.meta.orchestrate",
        payload={
            "spec": {
                "name": "nextgen-crm",
                "business_type": "saas",
                "description": "Next-generation CRM for SMBs",
                "components": [
                    "dashboard_ui",
                    "rest_api",
                    "analytics",
                    "email_integration"
                ],
                "output_dir": "businesses/nextgen-crm"
            }
        }
    )

    print(f"Task submitted: {task_id}")

    # Poll for result
    for attempt in range(60):
        result = await bridge.get_task_result(task_id)
        if result:
            print(f"Business generated: {result}")
            return result
        await asyncio.sleep(10)  # Check every 10 seconds

    print("Task still processing...")

asyncio.run(generate_business())
```

#### Code Component Generation
```python
# Direct to builder agent
task_id = await bridge.publish_event(
    topic="genesis.build",
    payload={
        "components": ["dashboard_ui", "payment_form"],
        "business_type": "ecommerce"
    }
)
```

#### Deployment
```python
# Direct to deploy agent
task_id = await bridge.publish_event(
    topic="genesis.deploy",
    payload={
        "platform": "vercel",
        "repo_url": "https://github.com/user/business"
    }
)
```

#### Quality Assurance
```python
# Direct to QA agent
task_id = await bridge.publish_event(
    topic="genesis.qa",
    payload={
        "tests": ["unit", "integration", "e2e"],
        "coverage_target": 80
    }
)
```

### FastAPI REST Endpoints

#### Asynchronous (Recommended)
```bash
# Submit task - returns immediately
curl -X POST http://localhost:8000/invoke/async \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "genesis.meta.orchestrate",
    "payload": {
      "spec": {
        "name": "my-app",
        "business_type": "saas",
        "components": ["dashboard"]
      }
    }
  }'

# Response:
# {
#   "task_id": "task_abc123xyz",
#   "status": "queued",
#   "poll_url": "/task/task_abc123xyz"
# }

# Poll for result
curl http://localhost:8000/task/task_abc123xyz

# If still processing:
# {"status": "processing"}

# When complete:
# {
#   "status": "completed",
#   "result": {...business generation results...}
# }
```

#### Synchronous (Legacy)
```bash
# Submit task - waits up to 10 seconds for result
curl -X POST http://localhost:8000/invoke \
  -H "Content-Type: application/json" \
  -d '{...payload...}'

# Returns immediately with result if available, otherwise task_id
```

### CLI Command

```bash
# Publish via omnidaemon CLI
omnidaemon task publish \
  --topic genesis.meta.orchestrate \
  --payload '{"spec":{"name":"cli-app","business_type":"saas"}}'
```

---

## Monitoring

### Health Dashboard

```bash
# Real-time monitoring every 5 seconds
scripts/monitor_omnidaemon.sh
```

**Output**:
```
=== OmniDaemon Monitoring ===

Health Status:
  Status: healthy
  Active Workers: 5
  Queue Depth: 3
  Uptime: 24h 15m

Bus Statistics:
  Total Tasks Processed: 1,247
  Successful: 1,225 (98.2%)
  Failed: 22 (1.8%)
  Avg Processing Time: 45.3s

Agent Metrics (genesis.meta.orchestrate):
  Received: 1,247
  Processed: 1,225
  Failed: 22
  Avg Duration: 45.3s
```

### Prometheus Metrics

#### Available Metrics
```
# Task counts
omnidaemon_tasks_received_total{topic="genesis.meta.orchestrate"}
omnidaemon_tasks_processed_total{topic="genesis.meta.orchestrate"}
omnidaemon_tasks_failed_total{topic="genesis.meta.orchestrate"}

# Performance
omnidaemon_processing_duration_seconds{topic="..."}
omnidaemon_queue_depth{topic="..."}

# Worker status
omnidaemon_workers_active
omnidaemon_workers_crashed_total
```

#### Grafana Dashboard

1. Add Prometheus datasource: `http://localhost:9090`
2. Import dashboard from `grafana_dashboard.json`
3. View metrics:
   - Throughput (tasks/s)
   - Success rate (%)
   - Average latency (ms)
   - Worker utilization (%)
   - Queue depth over time

### OpenTelemetry Tracing

```bash
# View traces from Jaeger UI
# http://localhost:16686

# Each task shows:
# - Task ID + correlation ID
# - Start/end times
# - All sub-task spans
# - Agent execution traces
# - Error details if failed
```

### Business Monitoring

```bash
# Real-time business generation metrics
curl http://localhost:8000/metrics

# Shows:
# - Businesses generated (today/week/month)
# - Avg generation time
# - Success rate
# - Cost per business
# - Revenue potential (aggregate)
```

---

## Troubleshooting

### Common Issues

#### Issue: Workers Not Starting
```bash
# Check configuration
cat config/omnidaemon.yaml

# Check logs
tail -f logs/omnidaemon_worker_*.log

# Verify Redis connectivity
redis-cli -u $REDIS_URL ping
# Expected: PONG

# Check port availability
lsof -i :6379  # Redis
netstat -an | grep LISTEN
```

#### Issue: Tasks Timing Out
```bash
# Increase timeout for specific topic
# Edit omnidaemon_bridge.py, adjust timeout_seconds:
await self._register(
    "genesis.meta.orchestrate",
    meta_agent_callback,
    timeout_seconds=7200  # Increase to 2 hours
)

# Restart workers
systemctl restart omnidaemon-genesis
```

#### Issue: Redis Connection Failures
```bash
# Verify connection string
echo $REDIS_URL
# Should be: redis://[user:password@]host:port[/db]

# Test connection manually
redis-cli -u $REDIS_URL --ping

# Check Redis memory usage
redis-cli -u $REDIS_URL INFO memory
# Ensure sufficient memory available

# Check for connection limits
redis-cli -u $REDIS_URL CONFIG GET maxclients
```

#### Issue: Tasks in Dead Letter Queue (DLQ)
```bash
# Inspect failed tasks
omnidaemon bus dlq --topic genesis.meta.orchestrate

# View detailed error
omnidaemon bus dlq --topic genesis.meta.orchestrate --format json | jq .

# Reprocess specific task
omnidaemon bus dlq reprocess --task-id abc123
```

#### Issue: Worker Process Crashes
```bash
# Check systemd journal
journalctl -u omnidaemon-genesis --since today
journalctl -u omnidaemon-genesis -n 100  # Last 100 lines

# Check individual worker log
tail -f logs/omnidaemon_worker_1.log

# Look for OOM killer
dmesg | grep "Out of memory"

# Check disk space
df -h
```

### Performance Degradation

#### Slow Task Processing
```bash
# Check worker load
omnidaemon health --detailed
# If workers have high CPU/memory, add more workers

# Check queue depth
omnidaemon metrics --topic genesis.meta.orchestrate
# If queue_depth > 100, scale up immediately

# Add workers dynamically
scripts/start_omnidaemon_workers.sh 3  # Add 3 more

# Check Redis latency
redis-cli -u $REDIS_URL --latency
```

#### High Memory Usage
```bash
# Check worker memory
ps aux | grep "omnidaemon runner"
# Look for workers consuming >1GB each

# Check Redis memory
redis-cli -u $REDIS_URL INFO memory
# Used memory should be <80% of total

# Clear old task results
redis-cli -u $REDIS_URL DEL "task:*"  # WARNING: Loses history

# Implement result TTL in config
export OMNIDAEMON_RESULT_TTL=3600  # 1 hour
```

---

## Scaling

### When to Scale Up

**Scale UP when:**
- Queue depth > 50 tasks
- Worker CPU > 80%
- Average task latency > 100ms
- Task failure rate > 5%

**Scale DOWN when:**
- Queue depth < 10 tasks
- Worker CPU < 30%
- Average task latency < 50ms

### Adding Workers

#### Manual (Development)
```bash
# Add 3 new workers
scripts/start_omnidaemon_workers.sh 3

# Verify
omnidaemon health
# Check active_workers increased
```

#### Automated (Production - Systemd)
```bash
# Update service configuration
sudo systemctl edit omnidaemon-genesis

# Add:
# [Service]
# Environment="WORKER_COUNT=10"

# Reload and restart
sudo systemctl daemon-reload
sudo systemctl restart omnidaemon-genesis
```

#### Kubernetes Auto-scaling
```bash
# Set horizontal pod autoscaler
kubectl autoscale deployment omnidaemon-workers \
  --min=5 --max=50 \
  --cpu-percent=80
```

### Load Balancing Verification

```bash
# Run load test after scaling
python scripts/load_test_omnidaemon.py --tasks 500 --workers 5 10 15

# Expected scaling results:
# 5 workers: ~50 tasks/s
# 10 workers: ~100 tasks/s
# 15 workers: ~150 tasks/s
# (Near-linear improvement indicates good load balancing)

# Check worker utilization is balanced
omnidaemon metrics --detailed
# Should show similar task counts per worker
```

### Cost Optimization

```bash
# Measure cost per task
redis_memory_gb=$(redis-cli -u $REDIS_URL INFO memory | grep used_memory_human)
worker_count=$(omnidaemon health | grep active_workers)
tasks_per_hour=$(($(omnidaemon metrics | grep processed) / 24))

cost_per_task=$((redis_monthly_cost + worker_monthly_cost) / tasks_per_month)

# If cost > target:
# 1. Increase workers to improve throughput efficiency
# 2. Optimize task processing (reduce avg duration)
# 3. Consider Redis cluster mode for better memory efficiency
```

---

## Maintenance

### Daily Checks (Morning)

```bash
# 1. Health check
omnidaemon health
# All workers healthy? Queue depth normal?

# 2. Overnight task review
omnidaemon metrics --topic genesis.meta.orchestrate
# Failure rate < 1%? No DLQ backlog?

# 3. Resource utilization
ps aux | grep omnidaemon | awk '{print $6}' | paste -sd+ | bc
# Total memory reasonable?
```

### Weekly Checks

```bash
# 1. Performance trend analysis
# Compare weekly metrics to baseline
omnidaemon metrics --format json > metrics_week$(date +%U).json

# 2. DLQ audit
omnidaemon bus dlq --topic genesis.meta.orchestrate --count
# Should be < 10 tasks

# 3. Redis health check
redis-cli -u $REDIS_URL INFO stats
# Connection count normal?
# Memory fragmentation < 1.5?

# 4. Backup task history (optional)
redis-cli -u $REDIS_URL BGSAVE
```

### Monthly Maintenance

```bash
# 1. Full system test
python scripts/load_test_omnidaemon.py --tasks 1000 --workers 1 5 10 15
# Verify throughput hasn't degraded

# 2. Disaster recovery test
# Kill a worker, verify recovery
kill $(pgrep -f "omnidaemon runner" | head -1)
sleep 5
omnidaemon health
# Should show worker recovered

# 3. Database cleanup
# Archive old task results to cold storage
redis-cli -u $REDIS_URL KEYS "task:*" | \
  xargs redis-cli -u $REDIS_URL DEL  # WARNING: Remove with caution

# 4. Certificate renewal (if using TLS)
# Renew Redis TLS certs if expiring soon
```

---

## Disaster Recovery

### Worker Complete Failure

**If all workers down:**

```bash
# 1. Check systemd service
sudo systemctl status omnidaemon-genesis

# 2. Restart service
sudo systemctl restart omnidaemon-genesis

# 3. Monitor recovery
journalctl -u omnidaemon-genesis -f
omnidaemon health --watch

# 4. Tasks in queue will be reprocessed automatically
# (unless DLQ limit exceeded)
```

### Redis Failure

**If Redis unavailable:**

```bash
# 1. Identify root cause
redis-cli -u $REDIS_URL ping
# If no response, Redis is down

# 2. Check Redis status
redis-cli --ldb INFO
# Or check systemd status
sudo systemctl status redis-server

# 3. Restart Redis
sudo systemctl restart redis-server

# 4. Resume OmniDaemon
sudo systemctl restart omnidaemon-genesis

# Note: Tasks are persisted in Redis Streams,
# so no data loss on restart
```

### Data Loss Prevention

```bash
# Enable Redis persistence
redis-cli -u $REDIS_URL CONFIG SET save "60 1000"
# Save every 60 seconds if 1000 keys changed

# Or RDB snapshot
redis-cli -u $REDIS_URL BGSAVE

# Or AOF (Append-Only File) for durability
redis-cli -u $REDIS_URL CONFIG SET appendonly yes
```

---

## Rollout Strategy

### Phase 1: Canary (Day 1)
```bash
# Run 1 OmniDaemon worker alongside existing sync API
# Route 10% of traffic to async endpoint:

# In a2a_fastapi.py, modify /invoke endpoint:
import random
if random.random() < 0.10:  # 10% traffic
    return await invoke_async(request)
else:
    return await invoke_sync(request)

# Monitor error rate + latency
omnidaemon metrics --watch
```

### Phase 2: Ramp (Days 2-3)
```bash
# Increase traffic gradually
# Day 2: 25% traffic to OmniDaemon
if random.random() < 0.25:
    return await invoke_async(request)

# Day 3: 50% traffic
if random.random() < 0.50:
    return await invoke_async(request)
```

### Phase 3: Full Cutover (Day 4)
```bash
# 100% traffic to OmniDaemon
# Deprecate synchronous endpoint
@app.post("/invoke")
async def invoke(request):
    """Deprecated: Use /invoke/async instead"""
    logger.warning("Sync endpoint called; redirecting to async")
    return await invoke_async(request)
```

### Phase 4: Deprecation (Week 2)
```bash
# Remove synchronous endpoint entirely
# Update all clients to use /invoke/async + polling
# Document deprecation in API changelog
```

---

## FAQ

**Q: Can OmniDaemon handle long-running tasks?**
A: Yes! Default timeout is 3600s (1 hour) for meta agent. Adjust in `omnidaemon_bridge.py` as needed.

**Q: What happens if a worker crashes mid-task?**
A: Task is redistributed to another worker automatically. No loss of work.

**Q: Is there a limit on task queue depth?**
A: No hard limit, but Redis memory becomes constraint. Monitor with `omnidaemon health`.

**Q: Can I use OmniDaemon with multiple regions?**
A: Yes! Use Redis Sentinel or Cluster mode for geo-distributed setup.

**Q: How do I monitor costs?**
A: Check `scripts/x402_weekly_report.py` for spend summaries. Integrate with cost tracking.

**Q: Can I run OmniDaemon on Kubernetes?**
A: Yes! See Kubernetes example in "Starting Workers" section above.

---

**Last Updated**: 2025-11-17
**Maintained By**: Genesis DevOps Team
**Status**: PRODUCTION
