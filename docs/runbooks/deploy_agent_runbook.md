# Deploy Agent Runbook

**Agent:** deploy_agent  
**Purpose:** Infrastructure deployment and configuration  
**Owner:** Thon (per AGENT_PROJECT_MAPPING.md)

## Common Issues

### Issue: Deployment fails
**Symptoms:** Deployment timeout, API errors  
**Diagnosis:**
```bash
curl http://localhost:8000/agents/deploy_agent/health
kubectl get pods -n genesis | grep deploy
```
**Solution:**
1. Check cloud provider credentials
2. Verify network connectivity
3. Review deployment logs: `kubectl logs -n genesis deploy-agent-*`

### Issue: Rollback needed
**Symptoms:** Production issues after deployment  
**Diagnosis:**
```bash
curl http://localhost:8000/deployments/recent
```
**Solution:**
1. Execute rollback: `curl -X POST http://localhost:8000/deployments/{id}/rollback`
2. Verify previous version restored
3. Check monitoring dashboard

### Issue: Resource exhaustion
**Symptoms:** Out of memory, CPU limits  
**Diagnosis:**
```bash
kubectl top pods -n genesis
```
**Solution:**
1. Scale up resources
2. Review resource requests/limits
3. Check for memory leaks

## Recovery Procedures

### Emergency Rollback
```bash
./scripts/emergency_rollback.sh {deployment_id}
```

### Restart Deploy Agent
```bash
kubectl rollout restart deployment/genesis-deploy-agent -n genesis
```

## Escalation

If issue persists:
1. Check infrastructure status
2. Review Phase 4 deployment logs
3. Contact Thon (deploy agent owner)

