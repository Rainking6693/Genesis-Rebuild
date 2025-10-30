# COMPLETE GENESIS ROADMAP: PHASES 7 & 8 (14 Strategic Systems)

**Date:** October 30, 2025
**Status:** Research Complete, Ready for Implementation
**Timeline:** 4-5 weeks (November 4 - December 6, 2025)
**Total Systems:** 14 (7 from Oct 30 + 7 from Oct 29)

---

## EXECUTIVE SUMMARY

**Consolidated 14 cutting-edge systems** across two implementation phases:
- **Phase 7 (Nov 4-22, HIGH PRIORITY):** 7 systems for training data, PII compliance, testing, monitoring
- **Phase 8 (Nov 25-Dec 6, MEDIUM PRIORITY):** 7 systems for API reliability, orchestration, research intelligence

**Strategic Focus:**
1. **Training & Data** (4 systems): DeepResearch, ADP, Socratic-Zero, Memento
2. **Compliance & Safety** (2 systems): SAE PII Probes, API Contracts
3. **Orchestration & Reliability** (2 systems): LangGraph Migration, shadcn/ui Dashboard
4. **DevOps & Testing** (2 systems): Rogue, Multimodal Eval Harness
5. **Intelligence & Knowledge** (4 systems): Research Radar, DiscoRL, Runbooks, Demo Page

**Total Effort:** ~412 hours (Phase 7: 180h, Phase 8: 232h)
**Expected ROI:**
- 88-92% cost reduction (Phase 6) + 60% API reliability (Phase 8)
- 96% PII detection + 70% research efficiency
- 95% orchestration resilience + 50% incident resolution speed

---

## PRIORITIZATION FRAMEWORK

### Tier 1: CRITICAL (Week 1-2, Nov 4-15)
**Must-have for production stability and compliance**

1. **shadcn/ui Dashboard** (Phase 7) - 8-12 hours
   - **Why:** Immediate visibility into 227/229 passing tests, OTEL traces, agent status
   - **Impact:** Real-time monitoring, human-in-loop approvals, production readiness dashboard
   - **Priority:** ⚠️ **HIGHEST** - Deploy Oct 30-31 sprint

2. **SAE PII Probes** (Phase 7) - 3 weeks
   - **Why:** GDPR/CCPA compliance requirement, 96% F1 detection
   - **Impact:** 10-500x cheaper than LLM judges, enterprise-ready PII detection
   - **Priority:** ⚠️ **CRITICAL** - Legal/regulatory compliance

3. **AI-Ready API Contracts** (Phase 8) - 3 weeks
   - **Why:** 60% of tool failures from schema drift, flaky tool-calling
   - **Impact:** 60% reduction in A2A failures, structured error handling, idempotency
   - **Priority:** ⚠️ **CRITICAL** - Production stability

### Tier 2: HIGH PRIORITY (Week 2-3, Nov 11-22)
**High-value enhancements for training and testing**

4. **Rogue Automated Testing** (Phase 7) - 3 weeks
   - **Why:** Replace 100% manual testing with 1,500+ automated scenarios
   - **Impact:** CI/CD blocking, ≥95% compliance, zero manual overhead
   - **Priority:** ⭐⭐⭐ **HIGH** - DevOps automation

5. **DeepResearch Data Pipeline** (Phase 7) - 3 weeks
   - **Why:** Solve data scarcity with 20,000+ synthetic examples
   - **Impact:** ≥90% quality training data for all 15 agents
   - **Priority:** ⭐⭐⭐ **HIGH** - Training data automation

6. **Agent Data Protocol (ADP)** (Phase 7) - 3 weeks
   - **Why:** Enable cross-agent learning (Legal ← Support)
   - **Impact:** ~20% performance improvement from unified data
   - **Priority:** ⭐⭐⭐ **HIGH** - Cross-agent learning

7. **LangGraph Migration** (Phase 8) - 3 weeks
   - **Why:** 95% reduction in progress loss on crashes, state persistence
   - **Impact:** Long-horizon task support, resumability, full OTEL tracing
   - **Priority:** ⭐⭐⭐ **HIGH** - Orchestration resilience

### Tier 3: MEDIUM PRIORITY (Week 3-4, Nov 18-29)
**Valuable enhancements for intelligence and optimization**

8. **Socratic-Zero Bootstrapping** (Phase 7) - 3 weeks
   - **Why:** 50x data expansion from 100 seeds, +20.2pp improvement
   - **Impact:** Bootstrap reasoning-heavy agents (Analyst, QA, Legal)
   - **Priority:** ⭐⭐ **MEDIUM** - Data bootstrapping

9. **Research Radar Pipeline (RDR)** (Phase 8) - 3 weeks
   - **Why:** 70% reduction in irrelevant research time, automated trend detection
   - **Impact:** "What to Prototype Next" dashboard, RDR perspective embeddings
   - **Priority:** ⭐⭐ **MEDIUM** - Research intelligence

10. **Multimodal Eval Harness** (Phase 8) - 2 weeks
    - **Why:** Gate VLM/video/model changes, prevent regressions
    - **Impact:** 100% multimodal task coverage (screenshots, UI, video loops)
    - **Priority:** ⭐⭐ **MEDIUM** - Quality gates

11. **Runbook Publishing** (Phase 8) - 1.5 weeks
    - **Why:** 50% faster incident resolution, agent-citable checklists
    - **Impact:** Internal documentation for troubleshooting
    - **Priority:** ⭐⭐ **MEDIUM** - Knowledge management

### Tier 4: LOW PRIORITY / RESEARCH (Week 4-5, Nov 25-Dec 6)
**Exploratory systems or optional enhancements**

12. **DiscoRL Integration** (Phase 8) - 2.5 weeks
    - **Why:** Auto-discover optimal learning loop update rules
    - **Impact:** 30% faster learning convergence
    - **Priority:** ⭐ **LOW** - Optimization

13. **Public Demo Page** (Phase 8) - 1 week (optional)
    - **Why:** External stakeholder visibility, transparent research
    - **Impact:** Marketing and transparency
    - **Priority:** ⭐ **LOW** - Optional

14. **Orra Coordination Layer** (Phase 7) - 3 weeks (research-first)
    - **Why:** Potential HTDAG enhancement, Plan Engine evaluation
    - **Impact:** Unknown (research required)
    - **Priority:** ⭐ **RESEARCH** - Conditional integration

---

## DETAILED PHASE 7 PLAN (November 4-22, 2025)

### Week 1 (Nov 4-8): Setup & High-Priority Foundation

**shadcn/ui Dashboard (Alex, Cora, Thon) - 8-12 hours** ⚠️ **URGENT - Oct 30-31**
- Day 1: Dashboard scaffolding + 6 core views (4h)
- Day 2: Data integration (Prometheus, OTEL, CaseBank) (4h)
- Day 3: Visual validation + security audit (2-4h)
- **Deliverables:** 6 views, real-time updates, 10+ screenshots

**SAE PII Probes Setup (Sentinel, Nova, Thon) - Week 1**
- Custom SAE implementation + classifier training
- Test on synthetic PII datasets (English + multilingual)
- **Deliverables:** SAE encoder, classifiers, test dataset

**Rogue Installation (Forge, Alex) - Week 1**
- Install Rogue (`uvx rogue-ai`)
- Configure Genesis A2A endpoints (15 agents)
- Generate test scenarios for 1 agent (QA pilot)
- **Deliverables:** Rogue environment, pilot test suite

**DeepResearch Setup (Vanguard, Nova, Thon) - Week 1**
- Install dependencies + configure APIs (Serper, Jina, Dashscope)
- Test ReAct + IterResearch modes
- Design 15 agent-specific prompt templates
- **Deliverables:** DeepResearch environment, prompt templates

**ADP Format Specification (Cora, River, Thon) - Week 1**
- Study arXiv:2510.24702 specification
- Map Genesis CaseBank schema to ADP format
- Design cross-agent learning experiments (Legal ← Support)
- **Deliverables:** ADP schema mapping, experiment design

**Socratic-Zero Setup (Vanguard, Cora) - Week 1**
- Install Socratic-Zero environment
- Create 100 seed examples for Analyst agent
- Test 3-agent loop (Solver → Teacher → Generator)
- **Deliverables:** Environment, 100 seeds, pilot test

### Week 2 (Nov 11-15): Implementation & Integration

**SAE PII Probes Integration (Sentinel, Nova, Thon)**
- Sidecar service on port 8003
- WaltzRL integration (6 privacy patterns → 5 SAE categories)
- HALO router pre-processing pipeline
- **Deliverables:** Sidecar service, WaltzRL integration

**Rogue Test Generation (Forge, Alex)**
- Generate 1,500 test scenarios (15 agents × 100 tests)
- Run Rogue evaluation on all 15 agents
- Capture baseline pass rates
- **Deliverables:** 1,500 scenarios, baseline metrics

**DeepResearch Data Generation (Vanguard, Nova, Thon)**
- Generate 20,000 examples (15 agents × 1,333 examples)
- Quality validation: Hudson reviews 10% sample (2,000 examples)
- **Deliverables:** 20,000 examples, quality report

**ADP CaseBank Migration (Cora, River, Thon)**
- Convert casebank.jsonl to ADP format (backward compatible)
- Update trajectory_pool.py to log in ADP format
- Test with 1,000 existing trajectories
- **Deliverables:** Converted CaseBank, updated trajectory_pool.py

**Socratic-Zero Data Generation (Vanguard, Cora)**
- Generate 5,000 examples from 100 seeds (50x expansion)
- Quality check: Hudson reviews 10% sample (500 examples)
- **Deliverables:** 5,000 examples, quality report

### Week 3 (Nov 18-22): Validation & CI/CD Integration

**SAE PII Probes Validation (Sentinel, Hudson, Alex)**
- Test dataset validation (100 examples with known PII)
- Compare SAE probes vs. WaltzRL pattern matching
- Visual validation: Screenshots of PII detection
- **Deliverables:** Test results (≥95% F1), visual proof

**Rogue CI/CD Integration (Forge, Cora)**
- Add Rogue CLI to `.github/workflows/ci.yml`
- Configure automated reports (markdown → GitHub Issues)
- Set pass threshold: ≥95% compliance required
- **Deliverables:** CI/CD integration, automated blocking

**DeepResearch Fine-Tuning Integration (Vanguard, Nova)**
- Convert generated data to Unsloth format (JSON/JSONL)
- Merge with existing Phase 5 agent training data
- Run test fine-tuning on 1 agent (QA) to validate
- **Deliverables:** Unsloth pipeline integration, validation

**ADP Cross-Agent Training (Cora, Vanguard, Nova)**
- Fine-tune Legal agent on Support + Legal data (ADP unified)
- Benchmark: Legal-only vs. Legal+Support training
- Expected: ≥5% improvement from cross-agent learning
- **Deliverables:** Benchmark results, cross-learning validation

**Socratic-Zero Fine-Tuning (Vanguard, Nova, Thon)**
- Fine-tune Analyst agent: baseline vs. Socratic-Zero data
- Benchmark on business reasoning tasks (revenue analysis, trends)
- Expected: ≥10% improvement from bootstrapped data
- **Deliverables:** Benchmark results, improvement validation

**Orra Research (Oracle, Cora, Nexus) - Week 3**
- Deep research: Papers, GitHub, technical blogs
- If resources found: Proof-of-concept benchmark (HTDAG vs. Orra)
- Decision: Integrate/complement/skip
- **Deliverables:** Technical understanding OR skip decision

---

## DETAILED PHASE 8 PLAN (November 25 - December 6, 2025)

### Week 4 (Nov 25-29): API Reliability & Orchestration

**AI-Ready API Contracts Phase 1-2 (Hudson, Thon) - 16 hours**
- Audit existing APIs (40 APIs: 15 agents + 20 tools + 5 infrastructure)
- Create OpenAPI 3.1 specs for all 40 APIs
- Implement structured error handling (ErrorCode enum, ErrorResponse helper)
- **Deliverables:** 40 OpenAPI specs, error response module

**LangGraph Migration Phase 1-2 (Cora, Thon) - 20 hours**
- Install LangGraph + setup SQLite/S3 store
- Define LangGraph for 15 agents (StateGraph, nodes, edges)
- Implement node retry policies (HTDAG: 3x exp, HALO: 2x linear)
- **Deliverables:** LangGraph orchestrator, state schema, retry policies

**Research Radar Phase 1-2 (Oracle, Cora) - 16 hours**
- Install crawler (arXiv, Papers with Code, GitHub trending)
- Implement RDR perspective extraction (I-M-O-W-R framework)
- Generate embeddings with sentence-transformers
- **Deliverables:** Crawler module, RDR embedder, processed papers

**Multimodal Eval Harness (Alex, Forge) - 8 hours**
- Design eval suite for VLM/screenshot/video tasks
- Implement benchmark runners
- **Deliverables:** Eval harness, baseline metrics

### Week 5 (Dec 2-6): Completion & Integration

**AI-Ready API Contracts Phase 3-4 (Hudson, Thon, Alex) - 20 hours**
- Update all 40 APIs to use structured errors
- Add contract tests + mock servers (Prism)
- CI/CD integration (GitHub Actions)
- **Deliverables:** Contract tests, mock servers, CI integration

**LangGraph Migration Phase 3 (Cora, Thon) - 8 hours**
- Add OTEL tracing for each node
- Grafana dashboard for LangGraph execution
- Performance metrics per node
- **Deliverables:** OTEL tracing, Grafana dashboard

**Research Radar Phase 3-4 (Oracle, Cora) - 12 hours**
- Clustering and trend detection (DBSCAN/KMeans)
- "What to Prototype Next" dashboard generation
- Weekly automation script + cron job
- **Deliverables:** Clusterer, trend dashboard, automation

**Runbook Publishing (Cora, River) - 12 hours**
- Document internal checklists for all 15 agents
- Publish to internal wiki / Notion
- **Deliverables:** 15 agent runbooks, published documentation

**DiscoRL Integration (Vanguard, Nova) - 20 hours (optional)**
- Research DiscoRL methodology
- Implement learning loop auto-discovery
- **Deliverables:** DiscoRL integration, learning optimization

**Public Demo Page (Alex, Cora) - 8 hours (optional)**
- Design demo page with research trace publishing
- Deploy to public URL
- **Deliverables:** Demo page, public visibility

---

## AGENT ASSIGNMENTS (ALL 14 SYSTEMS)

### Phase 7 (7 Systems)

| System | Lead | Support | Audit/Review | Timeline |
|--------|------|---------|--------------|----------|
| shadcn/ui Dashboard | Alex | Cora, Thon | Hudson (security), Cora (UX) | 8-12h (Oct 30-31) |
| SAE PII Probes | Sentinel | Nova, Thon | Hudson (security), Alex (E2E) | 3 weeks |
| Rogue Testing | Forge | Alex | Hudson (compliance), Cora (scenarios) | 3 weeks |
| DeepResearch | Vanguard | Nova, Thon | Hudson (quality), Cora (prompts) | 3 weeks |
| ADP | Cora | River, Thon | Vanguard (training), Nova (fine-tuning) | 3 weeks |
| Socratic-Zero | Vanguard | Cora, Nova, Thon | Hudson (quality) | 3 weeks |
| Orra (research) | Oracle | Cora, Nexus | Hudson (conditional) | 3 weeks |

### Phase 8 (7 Systems)

| System | Lead | Support | Audit/Review | Timeline |
|--------|------|---------|--------------|----------|
| API Contracts | Hudson | Thon | Forge (tests), Alex (E2E) | 3 weeks |
| LangGraph Migration | Cora | Thon | Hudson (architecture), Forge (testing) | 3 weeks |
| Research Radar | Oracle | Cora | Vanguard (validation) | 3 weeks |
| Multimodal Eval | Alex | Forge | Hudson (quality gates) | 2 weeks |
| Runbooks | Cora | River | Hudson (accuracy) | 1.5 weeks |
| DiscoRL | Vanguard | Nova | Cora (design review) | 2.5 weeks (optional) |
| Demo Page | Alex | Cora | N/A | 1 week (optional) |

---

## SUCCESS METRICS (ALL 14 SYSTEMS)

### Phase 7 Success Criteria

**Training & Data:**
- ✅ 20,000+ synthetic examples (DeepResearch)
- ✅ 100% CaseBank converted to ADP
- ✅ ≥5% cross-agent improvement (ADP)
- ✅ 5,000+ bootstrapped examples (Socratic-Zero)

**Compliance & Safety:**
- ✅ ≥95% F1 PII detection (SAE Probes)
- ✅ <100ms latency, 10x cost reduction
- ✅ Zero critical PII false negatives

**DevOps & Monitoring:**
- ✅ 1,500+ test scenarios (Rogue)
- ✅ ≥95% pass rate, CI/CD blocking
- ✅ 6 dashboard views, 10+ screenshots (shadcn/ui)
- ✅ Real-time updates <5s latency

**Research:**
- ✅ Orra technical understanding OR skip decision

### Phase 8 Success Criteria

**API Reliability:**
- ✅ 40 OpenAPI specs created
- ✅ All APIs return structured errors
- ✅ Idempotency keys on POST/PUT
- ✅ 60% reduction in tool failures

**Orchestration:**
- ✅ LangGraph graph defined for 15 agents
- ✅ State persistence (SQLite/S3)
- ✅ Node-level retry policies
- ✅ 95% reduction in progress loss

**Research Intelligence:**
- ✅ Weekly arXiv/PWC/GitHub crawl
- ✅ RDR perspective extraction (I-M-O-W-R)
- ✅ "What to Prototype Next" dashboard
- ✅ 70% reduction in irrelevant research time

**Quality & Knowledge:**
- ✅ 100% multimodal task coverage (Eval Harness)
- ✅ 15 agent runbooks published
- ✅ 50% faster incident resolution

**Optional:**
- ✅ 30% faster learning convergence (DiscoRL)
- ✅ Public demo page deployed

### Overall Success (Phases 7 + 8)

- ✅ 14/14 systems integrated (or 12/14 if Orra + DiscoRL skipped)
- ✅ Zero regressions on Phase 1-6 (maintain 227/229 = 99.1%)
- ✅ Hudson approval ≥9/10 for all critical systems
- ✅ All HIGH/CRITICAL systems operational by Nov 22

---

## TIMELINE SUMMARY

```
Week 1 (Nov 4-8): SETUP & FOUNDATION
- shadcn/ui Dashboard (8-12h sprint Oct 30-31) ⚠️ URGENT
- SAE PII, Rogue, DeepResearch, ADP, Socratic-Zero: Setup phase
- Orra: Research phase

Week 2 (Nov 11-15): IMPLEMENTATION
- SAE PII, Rogue, DeepResearch, ADP, Socratic-Zero: Implementation
- Orra: Proof-of-concept (if resources found)

Week 3 (Nov 18-22): VALIDATION (END OF PHASE 7)
- SAE PII, Rogue, DeepResearch, ADP, Socratic-Zero: Validation
- Orra: Integrate/complement/skip decision
- MILESTONE: Phase 7 Complete

Week 4 (Nov 25-29): API & ORCHESTRATION (START OF PHASE 8)
- API Contracts Phase 1-2
- LangGraph Migration Phase 1-2
- Research Radar Phase 1-2
- Multimodal Eval Harness

Week 5 (Dec 2-6): COMPLETION (END OF PHASE 8)
- API Contracts Phase 3-4
- LangGraph Migration Phase 3
- Research Radar Phase 3-4
- Runbooks, DiscoRL (optional), Demo Page (optional)
- MILESTONE: Phase 8 Complete
```

---

## EFFORT BREAKDOWN

### Phase 7 (7 Systems) - ~180 hours
- shadcn/ui: 8-12 hours
- SAE PII Probes: 3 weeks (120h / 3 people = 40h effective)
- Rogue: 3 weeks (120h / 2 people = 60h effective)
- DeepResearch: 3 weeks (120h / 3 people = 40h effective)
- ADP: 3 weeks (120h / 3 people = 40h effective)
- Socratic-Zero: 3 weeks (120h / 4 people = 30h effective)
- Orra: 3 weeks research (0h if skipped)

### Phase 8 (7 Systems) - ~232 hours
- API Contracts: 84 hours (3 weeks)
- LangGraph Migration: 44 hours (3 weeks)
- Research Radar: 48 hours (3 weeks)
- Multimodal Eval: 16 hours (2 weeks)
- Runbooks: 12 hours (1.5 weeks)
- DiscoRL: 20 hours (2.5 weeks, optional)
- Demo Page: 8 hours (1 week, optional)

**Total: ~412 hours over 5 weeks**

---

## DEPENDENCIES & CRITICAL PATH

### Phase 7 Dependencies
- DeepResearch → Unsloth (generated data feeds fine-tuning)
- ADP → CaseBank (unified format enables cross-learning)
- SAE Probes → WaltzRL (PII detection enhances safety)
- Rogue → CI/CD (automated testing blocks unsafe merges)
- shadcn/ui → Monitoring (dashboard visualizes all Phase 1-6 systems)

### Phase 8 Dependencies
- API Contracts → A2A Protocol (OpenAPI specs improve reliability)
- LangGraph → HTDAG/HALO (state persistence for orchestration)
- Research Radar → Weekly automation (cron job for continuous intelligence)
- Multimodal Eval → VLM/OCR (quality gates for visual tasks)
- Runbooks → All 15 agents (documentation for troubleshooting)

### Cross-Phase Dependencies
- Phase 8 LangGraph requires Phase 1-3 orchestration (already complete)
- Phase 8 API Contracts improve Phase 7 Rogue testing reliability
- Phase 7 shadcn/ui visualizes Phase 8 Research Radar trends

---

## RISK ASSESSMENT

### HIGH RISK
1. **LangGraph Migration** (Phase 8): Significant refactoring required
   - **Mitigation:** Incremental adoption, keep existing orchestration as fallback
2. **SAE PII Probes** (Phase 7): Custom implementation (Goodfire library not public)
   - **Mitigation:** Implement based on Rakuten methodology, validate on test dataset
3. **RDR Embedding Costs** (Phase 8): 50-100 LLM calls per week
   - **Mitigation:** Use GPT-4o-mini ($0.03/1M tokens), batch processing

### MEDIUM RISK
4. **API Contract Tests** (Phase 8): May find many existing issues
   - **Mitigation:** Prioritize by severity, fix high-priority issues first
5. **DeepResearch API Costs** (Phase 7): Serper, Jina, Dashscope APIs expensive at scale
   - **Mitigation:** Set daily quotas, monitor spend, use IterResearch Heavy sparingly
6. **Orra Information Gap** (Phase 7): Insufficient technical details
   - **Mitigation:** Oracle leads research Week 1, skip if no resources found

### LOW RISK
7. **Runbooks** (Phase 8): Straightforward documentation task
8. **shadcn/ui** (Phase 7): Well-documented framework, clear examples
9. **Demo Page** (Phase 8): Optional, no production impact

---

## REFERENCES & RESOURCES

### Phase 7 References
- DeepResearch: https://github.com/Alibaba-NLP/DeepResearch
- SAE PII Probes: https://www.goodfire.ai/research/rakuten-sae-probes-for-pii-detection
- Agent Data Protocol (ADP): https://arxiv.org/abs/2510.24702
- Rogue: https://github.com/qualifire-dev/rogue
- shadcn/ui: https://ui.shadcn.com/docs
- Socratic-Zero: https://arxiv.org/abs/2509.24726

### Phase 8 References
- Postman AI-Ready APIs: https://voyager.postman.com/pdf/developers-guide-to-ai-ready-apis.pdf
- LangChain DeepAgents: https://blog.langchain.com/doubling-down-on-deepagents/
- LangGraph Documentation: https://langchain-ai.github.io/langgraph/
- RDR Paper: https://arxiv.org/pdf/2510.20809

---

## NEXT STEPS

### Immediate (Oct 30-31, 2025)
1. **shadcn/ui Dashboard Sprint** - Alex, Cora, Thon (8-12 hours) ⚠️ **URGENT**
2. Review this roadmap with team
3. Assign final owners for each system
4. Create tracking tickets in project management tool

### Week 1 (Nov 4-8, 2025)
5. Kick off Phase 7 (6 systems in parallel: SAE PII, Rogue, DeepResearch, ADP, Socratic-Zero, Orra)
6. Daily standups to track progress
7. Hudson/Cora code reviews for all implementations

### Week 3 (Nov 18-22, 2025)
8. Phase 7 validation and approval
9. Phase 7 completion report
10. Kick off Phase 8

### Week 5 (Dec 2-6, 2025)
11. Phase 8 validation and approval
12. Phase 8 completion report
13. Celebrate 14-system integration! 🎉

---

**Document Created:** October 30, 2025
**Next Review:** November 1, 2025 (Phase 7 kickoff)
**Owner:** Cora (Phase 7 Lead), Hudson (Phase 8 Lead), Oracle (Research Lead)
**Status:** ✅ **READY FOR IMPLEMENTATION**
