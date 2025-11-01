# Rogue Testing Framework - Quick Reference Guide

**Date:** November 1, 2025
**Author:** Forge (Testing Agent)
**Purpose:** Quick navigation for Rogue research documents

---

## Research Documents Overview

### 1. ROGUE_RESEARCH_EXECUTIVE_SUMMARY.md (17 KB, 451 lines)
**READ THIS FIRST** - High-level overview of entire research effort

**Contents:**
- Overview of all deliverables
- Key metrics and ROI ($3.20 per 1,500-scenario run!)
- Implementation roadmap (Week 3-4)
- Risk assessment
- Success criteria

**When to use:** Team briefings, stakeholder updates, project planning

---

### 2. ROGUE_TESTING_ANALYSIS.md (53 KB, 1,437 lines)
**Comprehensive framework analysis**

**Contents:**
- Section 1: What is Rogue? (framework overview)
- Section 2: How Rogue Works (architecture, A2A integration, execution)
- Section 3: Genesis Integration Strategy (architecture diagram, integration points)
- Section 4: Test Scenario Structure (templates, field specs)
- Section 5: Generating 1,500 Scenarios (coverage plan, per-agent breakdown)
- Section 6: CI/CD Pipeline Design (preview)

**When to use:**
- Understanding Rogue framework architecture
- Designing scenario structures
- Planning A2A integration
- Estimating costs and timelines

---

### 3. ROGUE_SCENARIO_TEMPLATES.md (51 KB, 1,504 lines)
**Complete 100-scenario templates for all 15 agents**

**Contents:**
- Template format documentation
- Agent 1: QA Agent (100 scenarios - fully detailed)
  - 30 success cases, 30 edge cases, 20 error cases, 10 performance, 10 integration
- Agent 2: Support Agent (100 scenarios - fully detailed)
  - Same breakdown as QA Agent
- Agents 3-15: Structured templates (capabilities, categories)
- Implementation priority plan
- Automation guidance

**When to use:**
- Implementing new test scenarios
- Understanding scenario categories
- Planning scenario coverage
- Estimating implementation time

**Quick scenario counts:**
```
QA Agent: 100 scenarios (23 existing + 77 new P2)
Support Agent: 100 scenarios (23 existing + 77 new P2)
Legal Agent: 100 scenarios (13 existing + 87 new P2)
... (13 more agents, same pattern)
Total: 1,500 scenarios
```

---

### 4. CI_CD_INTEGRATION_DESIGN.md (46 KB, 1,443 lines)
**Production-ready CI/CD pipeline design**

**Contents:**
- Section 1: GitHub Actions Setup (complete workflow file)
- Section 2: Local Testing Commands (developer workflow)
- Section 3: Monitoring & Alerts (Prometheus/Grafana/Alertmanager)
- Section 4: Deployment Integration (progressive rollout)
- Section 5: Helper Scripts (3 production-ready scripts)

**When to use:**
- Implementing CI/CD pipeline
- Setting up monitoring dashboards
- Configuring quality gates
- Troubleshooting test failures

**Key files to implement:**
- `.github/workflows/rogue-tests.yml` (main workflow)
- `scripts/check_rogue_results.py` (quality gate)
- `scripts/aggregate_rogue_results.py` (multi-run aggregation)
- `scripts/export_rogue_metrics.py` (Prometheus export)

---

## Quick Commands

### Run Rogue Tests Locally

```bash
# P0 critical tests only (fast feedback, ~5 min)
python infrastructure/testing/rogue_runner.py \
  --scenarios tests/rogue/scenarios/ \
  --priority P0 \
  --output reports/local_p0_results.json

# P0 + P1 (full quality check, ~20 min)
python infrastructure/testing/rogue_runner.py \
  --scenarios tests/rogue/scenarios/ \
  --priority P0,P1 \
  --output reports/local_results.json

# Single agent testing
python infrastructure/testing/rogue_runner.py \
  --scenarios tests/rogue/scenarios/qa_agent_p1.yaml \
  --output reports/qa_results.json

# Dry run (validate scenarios without execution)
python infrastructure/testing/rogue_runner.py \
  --scenarios tests/rogue/scenarios/ \
  --dry-run
```

### Check Test Results

```bash
# Check pass rate (blocks if <95%)
python scripts/check_rogue_results.py \
  --results reports/local_results.json \
  --threshold 95 \
  --fail-on-p0

# Generate HTML report
python scripts/generate_html_report.py \
  --results reports/local_results.json \
  --output reports/test_report.html
```

### Generate New Scenarios

```bash
# Use automated generator with Claude Haiku 4.5
python scripts/generate_rogue_scenarios.py \
  --agent qa_agent \
  --category P2 \
  --count 87 \
  --template templates/agent_scenario_template.yaml \
  --output tests/rogue/scenarios/qa_agent_p2.yaml
```

---

## Key Metrics Summary

### Current State (Week 2 Complete)
- Scenarios: 506 (263 P0 + 243 P1)
- Load rate: 100%
- A2A compliance: 100% (15 agents)
- Infrastructure: Production-ready

### Target State (Week 3-4)
- Scenarios: 1,500+ (263 P0 + 243 P1 + 994 P2)
- Cost per run: $3.20 (Gemini Flash optimization)
- Runtime: 30-90 minutes (parallel)
- Pass rate target: ≥95%

### Cost Optimization
**Original estimate:** $72-90 per 1,500 scenarios (all GPT-4o)
**Optimized cost:** $3.20 per 1,500 scenarios (Gemini Flash for P1/P2)
**Savings:** 96% cost reduction

**Breakdown:**
- P0 (263 scenarios): $3.16 @ $0.012/scenario (GPT-4o)
- P1 (243 scenarios): $0.01 @ $0.00003/scenario (Gemini Flash)
- P2 (994 scenarios): $0.03 @ $0.00003/scenario (Gemini Flash)

---

## Implementation Checklist

### Week 3 (November 4-8)
**Scenario Generation:**
- [ ] QA Agent: 87 new P2 scenarios
- [ ] Support Agent: 87 new P2 scenarios
- [ ] Security Agent: 87 new P2 scenarios
- [ ] Builder Agent: 87 new P2 scenarios
- [ ] Deploy Agent: 87 new P2 scenarios
- [ ] 10 remaining agents: 87 each (870 total)

**CI/CD Implementation:**
- [ ] Create `.github/workflows/rogue-tests.yml`
- [ ] Implement `scripts/check_rogue_results.py`
- [ ] Implement `scripts/aggregate_rogue_results.py`
- [ ] Implement `scripts/export_rogue_metrics.py`
- [ ] Configure Prometheus/Grafana dashboards
- [ ] Set up Alertmanager rules
- [ ] Test pipeline on feature branch

### Week 4 (November 11-15)
**Validation:**
- [ ] Alex E2E testing (target: 9/10+ approval)
- [ ] Hudson security audit (target: 8.5/10+ approval)
- [ ] Performance benchmarking (<2s avg response)

**Production Deployment:**
- [ ] Progressive rollout (0% → 25% → 50% → 100%)
- [ ] Post-deployment smoke tests
- [ ] Monitoring validation

---

## Troubleshooting

### Common Issues

**Issue:** Scenario fails to load
**Solution:** Validate YAML syntax, ensure all required fields present (id, description, priority, category, input, expected_output, policy_checks)

**Issue:** Low pass rate (<95%)
**Solution:** Review failed scenarios in reports/rogue_results.json, check policy_violations array for root cause

**Issue:** High cost (>$100)
**Solution:** Verify P1/P2 scenarios using Gemini Flash (not GPT-4o), check --max-workers setting (default: 5)

**Issue:** Slow execution (>2 hours)
**Solution:** Enable caching (--cache-enabled), increase workers (--max-workers 10), run priority subsets separately

**Issue:** A2A service unavailable
**Solution:** Check `python a2a_service.py` running on port 8000, verify all 15 agent cards accessible at `/a2a/agents/{agent}/card`

---

## Resource Links

### Internal Documentation
- ROGUE_TESTING_ANALYSIS.md - Framework deep dive
- ROGUE_SCENARIO_TEMPLATES.md - Scenario templates
- CI_CD_INTEGRATION_DESIGN.md - CI/CD implementation
- ROGUE_RESEARCH_EXECUTIVE_SUMMARY.md - High-level overview

### External Resources
- Rogue GitHub: https://github.com/qualifire-dev/rogue
- Rogue Documentation: https://dev.to/drorivry/testing-ai-agents-like-a-pro-a-complete-guide-to-rogue-4npb
- A2A Protocol: https://developers.googleblog.com/en/a2a-a-new-era-of-agent-interoperability
- Genesis Codebase: /home/genesis/genesis-rebuild/

### Support Contacts
- **Rogue Framework:** Forge (Testing Agent)
- **Scenario Generation:** Cora (Scenario Agent) + Alex (E2E Testing)
- **CI/CD Implementation:** Hudson (Security) + Forge
- **A2A Integration:** Already complete (a2a_service.py)

---

## Success Criteria

### Week 3 Deliverables
✅ 1,500+ scenarios implemented (100 per agent × 15)
✅ CI/CD pipeline operational (GitHub Actions)
✅ Quality gates enforced (95% pass rate)
✅ Monitoring configured (Prometheus/Grafana)
✅ Documentation complete

### Production Readiness
✅ Pass rate ≥95% across all agents
✅ Zero P0 failures
✅ Average response time <2s
✅ Zero security violations
✅ Cost within budget ($3.20 per run)
✅ Alex approval ≥9/10
✅ Hudson approval ≥8.5/10

---

**Status:** ✅ Research Complete - Ready for Week 3 Implementation
**Next Step:** Team review and approval to begin scenario generation + CI/CD deployment
