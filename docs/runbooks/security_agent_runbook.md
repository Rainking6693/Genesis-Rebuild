# Security Agent Runbook

**Agent:** security_agent  
**Purpose:** Security scanning and vulnerability detection  
**Owner:** Sentinel (per AGENT_PROJECT_MAPPING.md)

## Common Issues

### Issue: Security scan fails
**Symptoms:** Scan timeout, errors  
**Diagnosis:**
```bash
curl http://localhost:8000/agents/security_agent/health
tail -n 100 logs/security_agent.log | grep ERROR
```
**Solution:**
1. Check scan tool availability
2. Verify permissions
3. Review scan configuration

### Issue: False positives
**Symptoms:** Many non-critical alerts  
**Diagnosis:**
```bash
curl http://localhost:8000/security/vulnerabilities | jq '.false_positives'
```
**Solution:**
1. Update rule filters
2. Adjust severity thresholds
3. Whitelist known safe patterns

## Recovery Procedures

### Manual Security Scan
```bash
./scripts/security_scan.sh --full
```

### Emergency Security Review
```bash
curl -X POST http://localhost:8000/security/emergency-scan
```

## Escalation

**CRITICAL:** Contact Sentinel immediately for security issues.

