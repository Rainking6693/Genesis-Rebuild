# Builder Agent Runbook

**Agent:** builder_agent  
**Purpose:** Code generation and software development  
**Owner:** Cora (per AGENT_PROJECT_MAPPING.md)

## Common Issues

### Issue: Code generation fails
**Symptoms:** Timeout errors, empty responses  
**Diagnosis:**
```bash
curl http://localhost:8000/agents/builder_agent/health
tail -n 100 logs/builder_agent.log | grep ERROR
```
**Solution:**
1. Check LLM API quota/limits
2. Verify code context size (max 8K tokens)
3. Review last successful build

### Issue: Generated code has syntax errors
**Symptoms:** Python/TypeScript syntax errors in output  
**Diagnosis:**
```bash
python -m py_compile generated_code.py  # For Python
npx tsc --noEmit generated_code.ts  # For TypeScript
```
**Solution:**
1. Enable syntax validation in builder config
2. Use AST parsing before accepting code
3. Run linter integration

### Issue: Slow code generation
**Symptoms:** >30s response time  
**Diagnosis:**
```bash
curl 'http://localhost:9090/api/v1/query?query=genesis_builder_agent_response_time_seconds'
```
**Solution:**
1. Check model routing (use Gemini Flash for simple tasks)
2. Reduce context window
3. Enable caching for repeated patterns

## Recovery Procedures

### Restart Builder Agent
```bash
systemctl restart genesis-builder-agent
# Or via Docker:
docker restart genesis-builder-agent
```

### Clear Cache
```bash
redis-cli FLUSHDB  # Clear code pattern cache
```

### Emergency Fallback
Use cached templates from `data/builder_templates/` if LLM unavailable.

## Escalation

If issue persists:
1. Check PROJECT_STATUS.md for known builder issues
2. Review HTDAG/HALO routing logs
3. Contact Cora (builder agent owner)

