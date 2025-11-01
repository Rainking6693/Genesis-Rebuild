# Analyst Agent Runbook

**Agent:** analyst_agent  
**Purpose:** Data analysis and business intelligence  
**Owner:** Vanguard (per AGENT_PROJECT_MAPPING.md)

## Common Issues

### Issue: Analysis timeout
**Symptoms:** Long-running queries fail  
**Diagnosis:**
```bash
curl http://localhost:8000/agents/analyst_agent/health
tail -n 100 logs/analyst_agent.log | grep TIMEOUT
```
**Solution:**
1. Increase query timeout
2. Optimize data queries
3. Use Socratic-Zero bootstrapped data for faster reasoning

### Issue: Inaccurate analysis
**Symptoms:** Wrong conclusions  
**Diagnosis:**
```bash
curl 'http://localhost:9090/api/v1/query?query=genesis_analyst_accuracy_score'
```
**Solution:**
1. Review data sources
2. Check reasoning chain
3. Validate with baseline models

## Recovery Procedures

### Use Cached Analysis
```bash
curl http://localhost:8000/analyst/cache/{analysis_id}
```

## Escalation

Contact Vanguard (analyst owner) for analysis issues.

