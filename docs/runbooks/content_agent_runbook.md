# Content Agent Runbook

**Agent:** content_agent  
**Purpose:** Content creation and editing  
**Owner:** Content team (per AGENT_PROJECT_MAPPING.md)

## Common Issues

### Issue: Content generation slow
**Symptoms:** >20s response time  
**Diagnosis:**
```bash
curl 'http://localhost:9090/api/v1/query?query=genesis_content_agent_response_time_seconds'
```
**Solution:**
1. Use Gemini Flash for simple content
2. Enable content caching
3. Reduce content length

### Issue: Content quality issues
**Symptoms:** Grammatical errors, tone mismatch  
**Diagnosis:**
Review generated content manually  
**Solution:**
1. Update style guide
2. Enable grammar checking
3. Fine-tune on high-quality examples

## Recovery Procedures

### Use Content Templates
```bash
curl http://localhost:8000/content/templates/{template_id}
```

## Escalation

Contact Content team for content issues.

