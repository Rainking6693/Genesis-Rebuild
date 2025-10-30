# PHASE 7: SEVEN STRATEGIC ADDITIONS (October 30, 2025)

**Status:** Research Complete, Ready for Implementation
**Timeline:** 3-4 weeks (7 parallel work streams)
**Impact:** Training data automation, PII compliance, unified data format, automated testing, monitoring UI, data bootstrapping, enhanced orchestration

---

## EXECUTIVE SUMMARY

Seven cutting-edge systems identified for Genesis integration, focusing on three strategic pillars:

1. **Training & Data Infrastructure** (4 systems): DeepResearch, ADP, Socratic-Zero, Memento CaseBank
2. **Compliance & Safety** (1 system): SAE PII Probes
3. **DevOps & Monitoring** (2 systems): Rogue Testing, shadcn/ui Dashboard

**Expected ROI:**
- 96% PII detection compliance (GDPR/CCPA ready)
- 20,000+ synthetic training examples per agent
- 20% average performance improvement from unified data
- Zero manual testing overhead (100% automated)
- Professional monitoring dashboard (8-12 hours to build)
- 20.2pp reasoning improvement from data bootstrapping

---

## 1. DEEPRESEARCH DATA PIPELINE - SYNTHETIC TRAINING DATA

### Overview
Alibaba's 30.5B MoE model with automated synthetic data generation pipeline solving data scarcity for all 15 Genesis agents.

### Key Capabilities (from research)
- **Architecture**: 30.5B params (3.3B activated per token), 128K context
- **Pipeline**: Fully automatic pre-training + fine-tuning + RL workflows
- **Training**: Continual pre-training + Group Relative Policy Optimization (GRPO)
- **Inference Modes**: ReAct (core abilities) + IterResearch 'Heavy' (max performance)

### Genesis Integration
**Purpose:** Generate 20,000+ high-quality training examples for all 15 agents without manual data collection

**Technical Requirements:**
- Python 3.10.0
- Required APIs: Serper.dev (web/Scholar), Jina.ai (page reading), OpenAI endpoints, Dashscope (file parsing), SandboxFusion (Python execution)
- HuggingFace/ModelScope model download or OpenRouter API access

**Implementation Plan:**
1. **Week 1 (Vanguard + Nova):** Set up DeepResearch environment
   - Install dependencies: `git clone https://github.com/Alibaba-NLP/DeepResearch external/DeepResearch`
   - Configure API keys (Serper, Jina, Dashscope, SandboxFusion)
   - Test model inference (ReAct + IterResearch modes)

2. **Week 2 (Vanguard + Thon):** Create agent-specific data generation prompts
   - Design 15 agent-specific prompt templates (QA, Support, Legal, etc.)
   - Generate 1,000 examples per agent (15,000 total)
   - Quality validation: Hudson reviews random sample (10% = 1,500 examples)

3. **Week 3 (Nova + Cora):** Integrate with Unsloth fine-tuning pipeline
   - Convert generated data to Unsloth format (JSON/JSONL)
   - Merge with existing Phase 5 agent training data
   - Run test fine-tuning on 1 agent (QA) to validate pipeline

**Success Criteria:**
- 20,000+ synthetic examples generated
- ≥90% quality score from Hudson's review
- Zero API failures in production
- Integration with existing Unsloth workflow

**Assigned:**
- **Vanguard (Lead):** MLOps orchestration, pipeline setup, data validation
- **Nova (Support):** Vertex AI integration, API configuration, model inference
- **Thon (Support):** Python implementation, data format conversion
- **Cora (Review):** Agent prompt design, data quality standards
- **Hudson (Audit):** Quality review of generated examples

---

## 2. SAE PII PROBES - 96% PII DETECTION

### Overview
Goodfire + Rakuten's Sparse Autoencoder probes achieving 96% F1 PII detection on Llama 3.1 8B activations. White-box interpretability 10-500x cheaper than LLM judges.

### Key Capabilities (from research)
- **Performance**: 96% F1 (exact match) vs. 51% for black-box LLM approaches
- **Architecture**: SAE on layer 12 (expansion factor 8, 32,768 latents) + classifier heads
- **Categories**: 5-class token-level (personal_name, address, phone, email, none)
- **Generalization**: Superior across distribution shifts (synthetic → real production data)
- **Cost**: 10-500x cheaper than GPT-4 Mini/Claude Opus
- **Deployment**: "First known enterprise application of SAEs for language model guardrails"

### Genesis Integration
**Purpose:** GDPR/CCPA compliance for all 15 agents with interpretable, low-cost PII detection

**Technical Requirements:**
- Llama 3.1 8B running as sidecar model
- SAE encoder (32,768 latents, frozen)
- Lightweight classifiers (logistic regression, random forests, or XGBoost)
- 128-token max chunks with 32-token overlap

**Implementation Plan:**
1. **Week 1 (Sentinel + Nova):** Research & SAE implementation
   - Implement SAE encoder (based on Rakuten methodology)
   - Train classifiers on synthetic PII datasets
   - Test on 1,000 examples (English + Japanese if applicable)

2. **Week 2 (Sentinel + Thon):** Genesis agent integration
   - Create sidecar PII detection service (port 8003)
   - Integrate with WaltzRL safety wrapper (6 privacy patterns → 5 SAE categories)
   - Add to HALO router pre-processing pipeline

3. **Week 3 (Hudson + Alex):** Validation & benchmarking
   - Generate test dataset with known PII (100 examples)
   - Compare SAE probes vs. existing WaltzRL pattern matching
   - Visual validation: Screenshots of PII detection in action

**Success Criteria:**
- ≥95% F1 score on Genesis test dataset
- <100ms inference latency (sidecar model)
- 10x cost reduction vs. LLM judge baseline
- Zero false negatives on critical PII (SSN, credit cards)

**Assigned:**
- **Sentinel (Lead):** Security implementation, SAE probe architecture, PII detection
- **Nova (Support):** Llama 3.1 8B deployment, Vertex AI integration
- **Thon (Support):** Python classifier training, sidecar service
- **Hudson (Audit):** Security review, false negative analysis
- **Alex (E2E):** Visual validation with PII test cases

**Note:** Goodfire library not yet public. Implement custom SAE methodology based on Rakuten research.

---

## 3. AGENT DATA PROTOCOL (ADP) - UNIFIED TRAINING FORMAT

### Overview
Universal format for agent training data acting as "interlingua" enabling cross-agent learning. Legal agent learns from Support examples.

### Key Capabilities (from research)
- **Scope**: Captures API/tool usage, web browsing, coding, SWE, general workflows
- **Integration**: Unified 13 existing agent datasets into single format
- **Performance**: ~20% average improvement over base models post-SFT
- **Accessibility**: "Simple to parse and train on without engineering at a per-dataset level"
- **Release**: All code and data released publicly

### Genesis Integration
**Purpose:** Standardize CaseBank data collection and enable cross-agent learning (e.g., Legal learns from Support)

**Technical Requirements:**
- Python package: `pip install agent-data-protocol`
- GitHub repo: `git clone https://github.com/agent-data-protocol/adp`
- Integration with existing CaseBank JSONL format

**Implementation Plan:**
1. **Week 1 (Cora + River):** ADP format definition
   - Study ADP specification (arXiv:2510.24702)
   - Map Genesis CaseBank schema to ADP format
   - Design cross-agent learning experiments (Legal ← Support, QA ← Analyst)

2. **Week 2 (River + Thon):** CaseBank migration
   - Convert existing casebank.jsonl to ADP format (backward compatible)
   - Update trajectory_pool.py to log in ADP format
   - Test with 1,000 existing trajectories

3. **Week 3 (Vanguard + Nova):** Cross-agent training validation
   - Fine-tune Legal agent on Support + Legal data (ADP unified)
   - Benchmark: Legal-only vs. Legal+Support training
   - Expected: ≥5% improvement from cross-agent learning

**Success Criteria:**
- 100% CaseBank data converted to ADP format
- ≥5% performance improvement on cross-agent training
- Zero data loss during format migration
- Compatible with Unsloth fine-tuning pipeline

**Assigned:**
- **Cora (Lead):** Agent design, cross-agent learning experiments, ADP schema mapping
- **River (Support):** Memory engineering, CaseBank migration, ADP integration
- **Thon (Support):** Python implementation, trajectory_pool.py updates
- **Vanguard (Validation):** Cross-agent training benchmarks
- **Nova (Validation):** Vertex AI fine-tuning integration

---

## 4. ROGUE - AUTOMATED AGENT TESTING

### Overview
Automated evaluation framework for agent performance/compliance/reliability. Replaces manual testing with automated compliance verification.

### Key Capabilities (from research)
- **Dynamic Test Generation**: LLM-powered scenario creation from business context
- **Protocol Support**: A2A (HTTP-based) + MCP (Server-Sent Events, HTTP transports)
- **CI/CD Integration**: Non-interactive CLI mode with JSON config files
- **Compliance Verification**: Policy compliance testing via dynamic evaluator agent
- **Reporting**: Detailed markdown reports with pass/fail rates, findings, recommendations

### Genesis Integration
**Purpose:** Replace manual testing of all 15 agents with automated compliance verification + CI/CD integration

**Technical Requirements:**
- Python 3.10+
- API keys: OpenAI, Google, Anthropic (already configured)
- Rogue server (default: localhost:8000)
- Genesis agents exposed via A2A protocol (already implemented)

**Implementation Plan:**
1. **Week 1 (Forge + Alex):** Rogue installation & Genesis integration
   - Install: `uvx rogue-ai` or `git clone https://github.com/qualifire-dev/rogue && uv sync`
   - Configure Genesis A2A endpoints (15 agents on localhost:8000)
   - Generate test scenarios for 1 agent (QA) using Rogue LLM

2. **Week 2 (Forge + Hudson):** Compliance test suite creation
   - Define policy compliance rules (WaltzRL safety, GDPR, error handling)
   - Generate 100+ test scenarios per agent (15 agents × 100 = 1,500 tests)
   - Run Rogue evaluation on all 15 agents, capture baseline

3. **Week 3 (Forge + Cora):** CI/CD pipeline integration
   - Add Rogue CLI to `.github/workflows/ci.yml`
   - Configure automated reports (markdown → GitHub Issues on failure)
   - Set pass threshold: ≥95% compliance required for merge

**Success Criteria:**
- 1,500+ automated test scenarios generated
- ≥95% pass rate across all 15 agents
- CI/CD integration blocks PRs on <95% compliance
- Zero manual testing overhead (100% automated)

**Assigned:**
- **Forge (Lead):** Testing automation, Rogue integration, CI/CD pipeline
- **Alex (Support):** E2E test validation, visual checks
- **Hudson (Review):** Compliance rule definition, security policies
- **Cora (Design):** Test scenario design, policy standards

---

## 5. SHADCN/UI DASHBOARD - AGENT MONITORING UI

### Overview
Copy-paste React components (Radix UI + Tailwind) for building professional admin dashboard in 8-12 hours.

### Key Capabilities (from research)
- **Architecture**: "Open Code" flat-file schema, not npm library
- **Foundation**: Radix UI primitives + Tailwind CSS utilities
- **Workflow**: Copy-paste component installation with full customization control
- **AI-Ready**: LLMs can read, understand, and generate new components
- **Design System**: Unified, composable interface with clean defaults

### Genesis Integration
**Purpose:** Monitor 15 agents in real-time with professional UI for OTEL traces, HALO routing, CaseBank logs, human-in-the-loop approvals

**Technical Requirements:**
- Next.js + TypeScript + Tailwind CSS
- shadcn/ui components: chart, table, sidebar, command, toast, dialog
- Integration with existing monitoring stack (Prometheus, Grafana, OTEL)

**Implementation Plan:**
1. **Day 1 (Alex + Cora):** Dashboard scaffolding (4 hours)
   - `npx create-next-app@latest genesis-dashboard --typescript --tailwind --app`
   - `cd genesis-dashboard && npx shadcn-ui@latest init`
   - Install components: `npx shadcn-ui@latest add chart table sidebar command toast dialog`
   - Design 6 core views: Overview, Agent Status, HALO Routes, CaseBank, OTEL Traces, Human Approvals

2. **Day 2 (Alex + Thon):** Data integration (4 hours)
   - Connect to Prometheus API (agent metrics)
   - Connect to OTEL traces (observability data)
   - Connect to CaseBank JSONL (trajectory logs)
   - Real-time updates via WebSocket or polling

3. **Day 3 (Alex + Hudson):** Visual validation (2-4 hours)
   - Take 10+ screenshots (all 6 views with real data)
   - Save to `docs/validation/20251030_shadcn_dashboard/`
   - Hudson audit: Security review (auth, input sanitization)
   - Cora audit: UX review (information architecture)

**Success Criteria:**
- 6 core dashboard views operational
- Real-time updates (<5s latency)
- 10+ screenshots showing real data
- ≥9/10 UX score from Cora
- Zero security vulnerabilities (Hudson audit)

**Assigned:**
- **Alex (Lead):** Frontend development, Next.js implementation, visual validation
- **Cora (Design):** UX design, information architecture, component selection
- **Thon (Backend):** API integration, WebSocket/polling, data pipelines
- **Hudson (Security):** Auth implementation, security audit, input sanitization

**Timeline:** 8-12 hours over 2-3 days (high priority for October 30-31 sprint)

---

## 6. SOCRATIC-ZERO - DATA BOOTSTRAPPING

### Overview
3-agent system (Solver/Teacher/Generator) creating training data from 100 seed examples. +20.2pp improvement on math benchmarks.

### Key Capabilities (from research)
- **Architecture**: Solver (refines reasoning) + Teacher (designs questions) + Generator (scales curriculum)
- **Seed Requirements**: Only 100 seed questions needed
- **Performance**: +20.2pp average gain over prior data synthesis methods
- **Scale**: Student models match/exceed larger commercial LLMs
- **Domains**: AMC23, AIME24-25, Olympiad, MATH-500, Minerva, GSM8K

### Genesis Integration
**Purpose:** Bootstrap training data for new agents or improve reasoning-heavy agents (Analyst, QA, Legal)

**Technical Requirements:**
- Python environment
- GitHub: `git clone https://github.com/Frostlinx/Socratic-Zero`
- Install: `cd Socratic-Zero && pip install -r requirements.txt`
- 100 seed examples per agent (manually created or from CaseBank)

**Implementation Plan:**
1. **Week 1 (Vanguard + Cora):** Socratic-Zero setup
   - Install Socratic-Zero environment
   - Create 100 seed examples for Analyst agent (business reasoning)
   - Test 3-agent loop: Solver → Teacher → Generator

2. **Week 2 (Vanguard + Nova):** Data generation & validation
   - Generate 5,000 examples from 100 seeds (50x expansion)
   - Quality check: Hudson reviews 500 examples (10% sample)
   - Expected: ≥80% high-quality examples

3. **Week 3 (Vanguard + Thon):** Fine-tuning & benchmarking
   - Fine-tune Analyst agent: baseline vs. Socratic-Zero data
   - Benchmark on business reasoning tasks (revenue analysis, trend detection)
   - Expected: ≥10% improvement from bootstrapped data

**Success Criteria:**
- 5,000+ bootstrapped examples from 100 seeds
- ≥80% quality score from Hudson review
- ≥10% performance improvement on target agent
- Replicable workflow for all 15 agents

**Assigned:**
- **Vanguard (Lead):** MLOps orchestration, data generation, quality validation
- **Cora (Support):** Seed example design, reasoning patterns
- **Nova (Support):** Fine-tuning integration, Vertex AI deployment
- **Thon (Support):** Python implementation, data pipelines
- **Hudson (Audit):** Quality review of bootstrapped examples

---

## 7. ORRA COORDINATION LAYER - ENHANCED ORCHESTRATION

### Overview
Multi-agent orchestration "Plan Engine" from TheUnwindAI research. Potential enhancement to HTDAG task decomposition.

### Research Status
**⚠️ LIMITED INFORMATION:** TheUnwindAI website does not contain detailed technical specifications for Orra coordination layer. Further research required.

### Preliminary Understanding
- **Source**: Mentioned in TheUnwindAI newsletter/blog content
- **Purpose**: Enhanced multi-agent coordination beyond current HTDAG approach
- **Status**: Research phase - requires additional investigation

### Next Steps (Research Phase)
1. **Week 1 (Oracle + Cora):** Deep research on Orra
   - Search for academic papers, GitHub repos, technical blogs
   - Analyze potential improvements over existing HTDAG (arXiv:2502.07056)
   - Compare to current Genesis orchestration (HTDAG + HALO + AOP)

2. **Week 2 (Oracle + Nexus):** Proof-of-concept evaluation
   - If Orra resources found: Implement minimal proof-of-concept
   - Benchmark: HTDAG vs. Orra on 10 complex tasks
   - Decision: Integrate, complement, or skip based on results

3. **Week 3 (Cora + Hudson):** Integration design (if approved)
   - Design Orra integration with existing HTDAG/HALO/AOP
   - Identify synergies or conflicts
   - Plan migration strategy (if needed)

**Success Criteria (Conditional):**
- Detailed technical understanding of Orra
- Proof-of-concept benchmark results
- Clear integration plan OR decision to skip

**Assigned:**
- **Oracle (Lead):** Hypothesis-driven research, proof-of-concept experiments
- **Cora (Support):** Agent design analysis, orchestration patterns
- **Nexus (Support):** A2A protocol compatibility, coordination mechanisms
- **Hudson (Review):** Security audit if integration approved

**Status:** Research phase - investigate first, decide later

---

## PHASE 7 TIMELINE & DEPENDENCIES

### Week 1 (Nov 4-8, 2025): Setup & Research
- **Parallel Track A (Data):** DeepResearch (Vanguard), ADP (Cora), Socratic-Zero (Vanguard)
- **Parallel Track B (Safety):** SAE PII Probes (Sentinel)
- **Parallel Track C (DevOps):** Rogue (Forge), shadcn/ui (Alex - 8-12 hours sprint)
- **Research:** Orra deep dive (Oracle)

### Week 2 (Nov 11-15, 2025): Implementation & Integration
- **Data Track:** Generate synthetic examples, convert CaseBank to ADP, bootstrap data
- **Safety Track:** Integrate SAE probes with WaltzRL
- **DevOps Track:** Generate test scenarios, complete dashboard

### Week 3 (Nov 18-22, 2025): Validation & Benchmarking
- **Data Track:** Fine-tuning validation, cross-agent learning benchmarks
- **Safety Track:** PII detection E2E testing
- **DevOps Track:** CI/CD integration, visual validation
- **Orra Decision:** Integrate, complement, or skip

### Dependencies
- **DeepResearch → Unsloth:** Generated data feeds existing fine-tuning pipeline
- **ADP → CaseBank:** Unified format enables cross-agent learning
- **SAE Probes → WaltzRL:** PII detection enhances existing safety wrapper
- **Rogue → CI/CD:** Automated testing blocks unsafe merges
- **shadcn/ui → Monitoring:** Dashboard visualizes all Phase 1-6 systems

---

## AGENT ASSIGNMENTS SUMMARY

| System | Lead | Support | Audit/Review |
|--------|------|---------|--------------|
| 1. DeepResearch | Vanguard | Nova, Thon | Hudson (quality), Cora (prompts) |
| 2. SAE PII Probes | Sentinel | Nova, Thon | Hudson (security), Alex (E2E) |
| 3. ADP | Cora | River, Thon | Vanguard (training), Nova (fine-tuning) |
| 4. Rogue | Forge | Alex | Hudson (compliance), Cora (scenarios) |
| 5. shadcn/ui | Alex | Cora, Thon | Hudson (security), Cora (UX) |
| 6. Socratic-Zero | Vanguard | Cora, Nova, Thon | Hudson (quality) |
| 7. Orra | Oracle | Cora, Nexus | Hudson (security if approved) |

---

## SUCCESS METRICS

### Training & Data (4 systems)
- ✅ 20,000+ synthetic examples generated (DeepResearch)
- ✅ 100% CaseBank converted to ADP format
- ✅ ≥5% cross-agent learning improvement (ADP)
- ✅ 5,000+ bootstrapped examples from 100 seeds (Socratic-Zero)

### Compliance & Safety (1 system)
- ✅ ≥95% F1 PII detection score (SAE Probes)
- ✅ <100ms inference latency
- ✅ 10x cost reduction vs. LLM judges

### DevOps & Monitoring (2 systems)
- ✅ 1,500+ automated test scenarios (Rogue)
- ✅ ≥95% pass rate across all agents
- ✅ 6 dashboard views operational (shadcn/ui)
- ✅ 10+ screenshots with real data

### Overall Phase 7
- ✅ 7/7 systems integrated (or 6/7 if Orra skipped)
- ✅ Zero regressions on Phase 1-6 systems
- ✅ All tests passing: 227/229 (99.1%) → maintain or improve
- ✅ Hudson approval ≥9/10 for all critical systems

---

## ADDITIONAL INSIGHTS FROM RESEARCH

### 🔍 MISSED OPPORTUNITIES & RECOMMENDATIONS

Based on deep research, here are valuable insights not explicitly mentioned:

#### 1. **DeepResearch Inference Modes**
The system has **two inference modes** that should be strategically used:
- **ReAct Mode**: Fast, for core abilities testing → Use for real-time Genesis responses
- **IterResearch 'Heavy' Mode**: Slow, maximum performance → Use for CaseBank data generation only

**Recommendation:** Implement mode-switching logic in `ask_agent()` based on context (real-time vs. batch).

#### 2. **SAE Multilingual Support**
Rakuten's SAE probes support **both English and Japanese** PII detection. Genesis should:
- Test on multilingual datasets if targeting international markets
- Consider adding Spanish, French, German for GDPR compliance

**Recommendation:** Generate multilingual PII test dataset (100 examples × 5 languages).

#### 3. **ADP Conversion Tools**
The paper mentions converting "13 existing agent datasets" into ADP format. Genesis should:
- Check if ADP repo includes conversion scripts for common formats (JSONL, Parquet, HF datasets)
- Reuse existing converters rather than writing from scratch

**Recommendation:** Explore `agent-data-protocol` GitHub for pre-built converters.

#### 4. **Rogue Client-Server Architecture**
Rogue supports **multiple interfaces**: TUI (Terminal UI), Web UI, CLI. Genesis should:
- Use CLI for CI/CD automation
- Use Web UI for manual debugging/exploration
- Consider TUI for local development

**Recommendation:** Deploy all 3 interfaces for different use cases.

#### 5. **shadcn/ui AI-Ready Architecture**
The "Open Code" approach is explicitly designed for **LLM integration**. Genesis should:
- Use Claude/GPT-4 to generate new dashboard components from natural language
- Example: "Create a card showing top 5 slowest agents with latency chart"

**Recommendation:** Add LLM-powered component generation to dashboard roadmap.

#### 6. **Socratic-Zero Closed-Loop Learning**
The 3-agent system is **fully autonomous** after initial 100 seeds. Genesis should:
- Run Socratic-Zero continuously in background (like SE-Darwin evolution)
- Generate 1,000 new examples per week, auto-add to CaseBank
- Monitor for quality drift, trigger re-seeding if needed

**Recommendation:** Deploy as background service, not one-time batch job.

#### 7. **Missing: Real-Time Evaluation**
None of the 7 systems include **real-time evaluation during inference**. Consider:
- **LangSmith** (LangChain): Real-time trace evaluation with user feedback
- **Langfuse** (open-source): Self-hosted alternative to LangSmith
- **Weights & Biases** (W&B): Production ML monitoring with A/B testing

**Recommendation:** Research real-time evaluation tools for Phase 8.

---

## RISKS & MITIGATIONS

### High Priority
1. **DeepResearch API Costs**: Serper, Jina, Dashscope APIs may be expensive at scale
   - **Mitigation**: Set daily quotas, monitor spend, use IterResearch Heavy mode only for batch jobs

2. **SAE Probes Custom Implementation**: Goodfire library not public yet
   - **Mitigation**: Implement custom SAE based on Rakuten methodology, validate on test dataset

3. **Orra Information Gap**: Insufficient technical details for evaluation
   - **Mitigation**: Oracle leads deep research Week 1, decision to skip if no resources found

### Medium Priority
4. **ADP Format Migration**: Risk of data loss during CaseBank conversion
   - **Mitigation**: Backup casebank.jsonl before migration, implement backward compatibility

5. **Rogue Test Scenario Quality**: LLM-generated tests may miss edge cases
   - **Mitigation**: Hudson manual review of 10% random sample, iterative refinement

6. **shadcn/ui Dashboard Maintenance**: Custom components require ongoing updates
   - **Mitigation**: Follow shadcn/ui upgrade guides, test after component updates

---

## REFERENCES

### Academic Papers
- Agent Data Protocol (ADP): arXiv:2510.24702
- Socratic-Zero: arXiv:2509.24726

### GitHub Repositories
- DeepResearch: https://github.com/Alibaba-NLP/DeepResearch
- Agent Data Protocol: https://github.com/agent-data-protocol/adp
- Rogue: https://github.com/qualifire-dev/rogue
- Socratic-Zero: https://github.com/Frostlinx/Socratic-Zero

### Industry Reports
- SAE PII Probes: https://www.goodfire.ai/research/rakuten-sae-probes-for-pii-detection
- shadcn/ui: https://ui.shadcn.com/docs
- TheUnwindAI (Orra reference): https://www.theunwindai.com/

### Prior Genesis Phases
- Phase 1-3: Orchestration (HTDAG, HALO, AOP) - `ORCHESTRATION_DESIGN.md`
- Phase 4: Pre-deployment - `PHASE4_DEPLOYMENT_COMPLETE_SUMMARY.md`
- Phase 5: SE-Darwin - `SE_DARWIN_FINAL_APPROVAL.md`
- Phase 6: Optimization - `PROJECT_STATUS.md` (October 25, 2025 update)
- Vertex AI: `docs/VERTEX_AI_SETUP.md` (October 30, 2025)

---

**Document Created:** October 30, 2025
**Next Review:** November 1, 2025 (Phase 7 kickoff)
**Owner:** Cora (Phase 7 Lead), Oracle (Orra Research), Forge (Testing Lead)
