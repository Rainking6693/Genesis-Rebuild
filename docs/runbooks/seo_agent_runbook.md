# SEO Agent Runbook

**Agent:** seo_agent  
**Purpose:** SEO optimization and keyword research  
**Owner:** Marketing team (per AGENT_PROJECT_MAPPING.md)

## Common Issues

### Issue: SEO analysis fails
**Symptoms:** API errors, missing data  
**Diagnosis:**
```bash
curl http://localhost:8000/agents/seo_agent/health
```
**Solution:**
1. Check SEO API credentials
2. Verify API rate limits
3. Review keyword research tools

### Issue: Low ranking scores
**Symptoms:** Poor SEO metrics  
**Diagnosis:**
```bash
curl 'http://localhost:9090/api/v1/query?query=genesis_seo_ranking_score'
```
**Solution:**
1. Update optimization strategies
2. Review competitor analysis
3. Improve content optimization

## Recovery Procedures

### Manual SEO Check
```bash
./scripts/seo_check.sh {url}
```

## Escalation

Contact Marketing team for SEO issues.

