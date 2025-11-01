# Design Agent Runbook

**Agent:** design_agent  
**Purpose:** UI/UX design generation  
**Owner:** Design team (per AGENT_PROJECT_MAPPING.md)

## Common Issues

### Issue: Design generation fails
**Symptoms:** Empty designs, API errors  
**Diagnosis:**
```bash
curl http://localhost:8000/agents/design_agent/health
```
**Solution:**
1. Check vision model availability (Gemini Vision)
2. Verify design guidelines loaded
3. Review input requirements

### Issue: Designs not meeting requirements
**Symptoms:** Wrong style, missing elements  
**Diagnosis:**
Review generated designs manually  
**Solution:**
1. Update design brief
2. Refine style guidelines
3. Add more examples

## Recovery Procedures

### Regenerate Design
```bash
curl -X POST http://localhost:8000/designs/regenerate -d '{"design_id": "xyz"}'
```

## Escalation

Contact Design team for design issues.

