# Support Agent Runbook

**Agent:** support_agent  
**Purpose:** Customer support and issue resolution  
**Owner:** Support team (per AGENT_PROJECT_MAPPING.md)

## Common Issues

### Issue: Support tickets not resolved
**Symptoms:** High ticket volume, slow response  
**Diagnosis:**
```bash
curl http://localhost:8000/support/tickets/stats
```
**Solution:**
1. Check knowledge base completeness
2. Review common ticket patterns
3. Update FAQ responses

### Issue: Low resolution rate
**Symptoms:** Many escalations to human  
**Diagnosis:**
```bash
curl 'http://localhost:9090/api/v1/query?query=genesis_support_resolution_rate'
```
**Solution:**
1. Train on resolved tickets
2. Update response templates
3. Improve context understanding

## Recovery Procedures

### Escalate to Human
```bash
curl -X POST http://localhost:8000/support/tickets/{id}/escalate
```

## Escalation

For critical support issues, escalate to human support team.

