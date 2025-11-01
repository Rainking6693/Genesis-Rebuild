# QA Agent Runbook

**Agent:** qa_agent  
**Purpose:** Quality assurance and testing  
**Owner:** Alex (per AGENT_PROJECT_MAPPING.md)

## Common Issues

### Issue: Tests failing
**Symptoms:** High failure rate  
**Diagnosis:**
```bash
curl http://localhost:8000/qa/test-results/recent
pytest tests/ --tb=short
```
**Solution:**
1. Review test logs
2. Check test environment
3. Verify test data

### Issue: Low test coverage
**Symptoms:** Coverage <85%  
**Diagnosis:**
```bash
pytest --cov=. --cov-report=html
```
**Solution:**
1. Generate missing tests
2. Review coverage gaps
3. Add edge case tests

## Recovery Procedures

### Rerun Failed Tests
```bash
pytest tests/ --lf  # Last failed
pytest tests/ --ff  # Failed first
```

## Escalation

Contact Alex (QA owner) for testing issues.

