# Sales Agent Runbook

**Agent:** sales_agent  
**Purpose:** Sales pipeline management and lead qualification  
**Owner:** Sales team (per AGENT_PROJECT_MAPPING.md)

## Common Issues

### Issue: Lead qualification fails
**Symptoms:** Wrong lead scoring  
**Diagnosis:**
```bash
curl http://localhost:8000/sales/leads/stats
```
**Solution:**
1. Review qualification criteria
2. Update lead scoring model
3. Check CRM integration

### Issue: Low conversion rate
**Symptoms:** Poor sales performance  
**Diagnosis:**
```bash
curl 'http://localhost:9090/api/v1/query?query=genesis_sales_conversion_rate'
```
**Solution:**
1. Analyze successful deals
2. Update sales scripts
3. Improve lead targeting

## Recovery Procedures

### Manual Lead Review
```bash
curl http://localhost:8000/sales/leads/{lead_id}/review
```

## Escalation

Contact Sales team for sales issues.

