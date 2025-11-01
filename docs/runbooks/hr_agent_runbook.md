# HR Agent Runbook

**Agent:** hr_agent  
**Purpose:** Human resources and recruitment  
**Owner:** HR team (per AGENT_PROJECT_MAPPING.md)

## Common Issues

### Issue: Resume parsing fails
**Symptoms:** Incorrect candidate data  
**Diagnosis:**
```bash
curl http://localhost:8000/agents/hr_agent/health
```
**Solution:**
1. Check OCR service availability
2. Verify resume format support
3. Review parsing rules

### Issue: Low match quality
**Symptoms:** Poor candidate-job matching  
**Diagnosis:**
```bash
curl 'http://localhost:9090/api/v1/query?query=genesis_hr_match_quality_score'
```
**Solution:**
1. Update job descriptions
2. Improve matching algorithm
3. Add more candidate signals

## Recovery Procedures

### Manual Candidate Review
```bash
curl http://localhost:8000/hr/candidates/{candidate_id}/review
```

## Escalation

Contact HR team for recruitment issues.

