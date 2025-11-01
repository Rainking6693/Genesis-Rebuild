# Finance Agent Runbook

**Agent:** finance_agent  
**Purpose:** Financial analysis and reporting  
**Owner:** Finance team (per AGENT_PROJECT_MAPPING.md)

## Common Issues

### Issue: Financial calculations incorrect
**Symptoms:** Wrong totals, formula errors  
**Diagnosis:**
```bash
curl http://localhost:8000/agents/finance_agent/health
curl http://localhost:8000/finance/reports/recent | jq '.errors'
```
**Solution:**
1. Validate calculation formulas
2. Check data sources
3. Review rounding rules

### Issue: Report generation fails
**Symptoms:** Timeout, missing data  
**Diagnosis:**
```bash
tail -n 100 logs/finance_agent.log | grep ERROR
```
**Solution:**
1. Check database connectivity
2. Verify data permissions
3. Review report templates

## Recovery Procedures

### Regenerate Report
```bash
curl -X POST http://localhost:8000/finance/reports/regenerate -d '{"report_id": "xyz"}'
```

### Manual Calculation Check
```bash
./scripts/finance_validate.sh {report_id}
```

## Escalation

**CRITICAL:** Contact Finance team immediately for financial discrepancies.

