# Genesis Agent Runbooks

**Purpose:** Internal troubleshooting checklists for all 15 Genesis agents  
**Last Updated:** October 31, 2025  
**Status:** ✅ Complete (15 runbooks)

## Overview

These runbooks provide step-by-step troubleshooting procedures for each Genesis agent. Each runbook includes:
- Common issues and solutions
- Diagnostic commands
- Recovery procedures
- Escalation paths

## Agent Runbooks

1. [Builder Agent](./builder_agent_runbook.md)
2. [Deploy Agent](./deploy_agent_runbook.md)
3. [Marketing Agent](./marketing_agent_runbook.md)
4. [Support Agent](./support_agent_runbook.md)
5. [Monitor Agent](./monitor_agent_runbook.md)
6. [Analyst Agent](./analyst_agent_runbook.md)
7. [Spec Agent](./spec_agent_runbook.md)
8. [QA Agent](./qa_agent_runbook.md)
9. [Security Agent](./security_agent_runbook.md)
10. [Design Agent](./design_agent_runbook.md)
11. [Content Agent](./content_agent_runbook.md)
12. [SEO Agent](./seo_agent_runbook.md)
13. [Sales Agent](./sales_agent_runbook.md)
14. [HR Agent](./hr_agent_runbook.md)
15. [Finance Agent](./finance_agent_runbook.md)

## Quick Reference

### Check Agent Health
```bash
curl http://localhost:8000/agents/{agent_name}/health
```

### View Agent Logs
```bash
tail -f logs/{agent_name}.log
```

### Restart Agent
```bash
systemctl restart genesis-{agent_name}
```

### Check Agent Metrics
```bash
curl http://localhost:9090/api/v1/query?query=genesis_agent_requests_total{agent="{agent_name}"}
```

## Escalation

If an issue persists after following the runbook:
1. Check PROJECT_STATUS.md for known issues
2. Review AGENT_PROJECT_MAPPING.md for agent assignments
3. Contact the assigned agent owner (per AGENT_PROJECT_MAPPING.md)

