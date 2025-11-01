# Spec Agent Runbook

**Agent:** spec_agent  
**Purpose:** Technical specification generation  
**Owner:** Cora (per AGENT_PROJECT_MAPPING.md)

## Common Issues

### Issue: Specs incomplete
**Symptoms:** Missing sections  
**Diagnosis:**
```bash
curl http://localhost:8000/agents/spec_agent/health
```
**Solution:**
1. Check input requirements completeness
2. Review spec templates
3. Validate against schema

### Issue: Specs not detailed enough
**Symptoms:** Vague specifications  
**Diagnosis:**
Review generated specs manually  
**Solution:**
1. Use Claude Sonnet 4 for complex specs
2. Add more context to requests
3. Enable detailed mode

## Recovery Procedures

### Regenerate Spec
```bash
curl -X POST http://localhost:8000/specs/regenerate -d '{"spec_id": "xyz"}'
```

## Escalation

Contact Cora (spec agent owner) for specification issues.

