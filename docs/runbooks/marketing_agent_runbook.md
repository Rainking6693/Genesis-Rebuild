# Marketing Agent Runbook

**Agent:** marketing_agent  
**Purpose:** Marketing content generation and campaign management  
**Owner:** Content Agent team (per AGENT_PROJECT_MAPPING.md)

## Common Issues

### Issue: Content generation fails
**Symptoms:** Empty responses, API errors  
**Diagnosis:**
```bash
curl http://localhost:8000/agents/marketing_agent/health
```
**Solution:**
1. Check LLM API quota
2. Verify brand guidelines are loaded
3. Review content templates

### Issue: Low engagement rates
**Symptoms:** Poor campaign performance  
**Diagnosis:**
```bash
curl 'http://localhost:9090/api/v1/query?query=genesis_marketing_campaign_engagement'
```
**Solution:**
1. Review A/B test results
2. Update content templates
3. Check target audience alignment

## Recovery Procedures

### Regenerate Content
```bash
curl -X POST http://localhost:8000/marketing/regenerate -d '{"campaign_id": "xyz"}'
```

## Escalation

Contact Content Agent team for marketing issues.

