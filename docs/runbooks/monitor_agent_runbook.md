# Monitor Agent Runbook

**Agent:** monitor_agent  
**Purpose:** System monitoring and alerting  
**Owner:** Forge (per AGENT_PROJECT_MAPPING.md)

## Common Issues

### Issue: Alerts not firing
**Symptoms:** Issues not detected  
**Diagnosis:**
```bash
curl http://localhost:9090/api/v1/alerts
curl http://localhost:3000/api/alerts  # Grafana
```
**Solution:**
1. Check Prometheus rule configuration
2. Verify alertmanager routing
3. Test alert rules manually

### Issue: False positives
**Symptoms:** Too many alerts  
**Diagnosis:**
```bash
curl 'http://localhost:9090/api/v1/query?query=genesis_alerts_firing_total'
```
**Solution:**
1. Adjust alert thresholds
2. Add alert grouping
3. Review alert rules

## Recovery Procedures

### Silence Alerts
```bash
curl -X POST http://localhost:9093/api/v2/silences -d @silence.json
```

### Restart Monitoring Stack
```bash
docker-compose restart prometheus grafana alertmanager
```

## Escalation

Contact Forge (monitoring owner) for monitoring issues.

