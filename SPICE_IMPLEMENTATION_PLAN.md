# SPICE + Pipelex + MicroAdapt: Rapid Implementation Plan
**Target:** Week 1 (Nov 4-8) for SPICE + Pipelex, Week 2 (Nov 11-15) for MicroAdapt
**Expected Impact:** +9-11% evolution accuracy, 50% time savings, real-time adaptation

---

## 🎯 Executive Decision Required

### Budget Approval
- **SPICE DrGRPO Training:** $200-250 (Lambda Labs H200 GPU, 8-10 hours)
  - **Alternative:** Use Mistral API fine-tuning (Stage 1 model, similar cost)
  - **Decision:** [ ] Approved / [ ] Use Mistral API instead

### Agent Assignments
- **Primary:** Thon (RL/swarm expert) + Cora (agent architect)
- **Supporting:** Cursor (Pipelex setup), Zenith (SPICE curriculum), Forge (validation)
- **Decision:** [ ] Approved

---

## 📅 Week 1 Integration (Nov 4-8)

### Monday Nov 4: Pipelex Setup (Cursor, 4 hours)
**Goal:** Install Pipelex, validate, free Cora for Swarm work

**Morning (8 AM - 12 PM):**
```bash
# 1. Install Pipelex
pip install pipelex

# 2. Test examples
cd /tmp
git clone https://github.com/Pipelex/pipelex-examples
cd pipelex-examples
pipelex run workflows/cv_job_matching.plx

# 3. Test AI generation
pipelex build pipe "Create a simple content generation workflow"

# 4. Test Genesis integration
cd /home/genesis/genesis-rebuild
pipelex run workflows/test_genesis_workflow.plx
```

**Deliverables:**
- [ ] Pipelex installed and validated
- [ ] `docs/PIPELEX_QUICK_START.md` (150 lines)
- [ ] `workflows/templates/ecommerce_business.plx` (50 lines)
- [ ] `workflows/templates/content_platform_business.plx` (50 lines)

**Success Criteria:** Pipelex operational, 2 business templates working

---

### Tuesday Nov 5: SPICE Phase 1 (Thon + Cora, 8 hours parallel)

#### Thon: Core SPICE Components (8 hours)
**Morning (8 AM - 12 PM):**
```bash
# Create infrastructure/spice/ directory
mkdir -p infrastructure/spice
mkdir -p tests/spice

# File 1: infrastructure/spice/challenger_agent.py (300 lines)
# - Corpus-grounded task generation
# - Difficulty curriculum (0.0-1.0)
# - Genesis benchmark integration

# File 2: infrastructure/spice/reasoner_agent.py (250 lines)
# - Ungrounded solution generation
# - SE-Darwin operator integration
# - Multi-trajectory solving
```

**Afternoon (1 PM - 5 PM):**
```bash
# File 3: infrastructure/spice/drgrpo_optimizer.py (400 lines)
# - Variance reward computation
# - Joint Challenger/Reasoner training loop
# - Gradient policy optimization

# File 4: tests/spice/test_self_play.py (200 lines)
# - 20 tests: task generation, solution diversity, variance rewards

# File 5: tests/spice/test_drgrpo.py (150 lines)
# - 15 tests: reward calculation, optimization convergence
```

**Success Criteria:** 35/35 SPICE tests passing, self-play loop operational

#### Cora: SPICE Architecture Design (8 hours)
**Morning (8 AM - 12 PM):**
```bash
# Design SE-Darwin integration
# Document integration points
# Create test scenarios for SPICE × Darwin

# File: docs/specs/SPICE_DARWIN_INTEGRATION.md (1,000 lines)
# - Integration architecture
# - API contracts
# - Data flow diagrams
# - Performance expectations
```

**Afternoon (1 PM - 5 PM):**
```bash
# Create integration test suite
# File: tests/integration/test_spice_darwin.py (150 lines)
# - 10 integration tests
# - Benchmark scenarios (QA Agent)
# - Performance validation (+9-11% target)

# File: tests/benchmarks/spice_darwin_benchmark.json (500 lines)
# - 30 benchmark scenarios
# - Baseline vs. SPICE comparison
```

**Success Criteria:** Integration design complete, 10 test specs ready

---

### Wednesday Nov 6: Pipelex × Genesis + SPICE Phase 2

#### Morning (Cora, 4-5 hours): Pipelex Integration
```bash
# File 1: infrastructure/orchestration/pipelex_adapter.py (200 lines)
# - Adapter between Genesis HTDAG and Pipelex workflows
# - Async execution wrapper
# - OTEL observability integration

# File 2: tests/integration/test_pipelex_genesis.py (100 lines)
# - 10 integration tests

# File 3: Update workflows/ directory
# - 3 business templates (.plx files)
# - Genesis Meta-Agent calls Pipelex for business workflows
```

**Success Criteria:** Genesis can spawn businesses using `.plx` workflows

#### Afternoon (Cora, 4 hours): SPICE × SE-Darwin Integration
```bash
# Modify: agents/se_darwin_agent.py (50 lines added)
# - Add SPICE self-play to trajectory generation
# - Variance reward for trajectory selection

# Run: tests/integration/test_spice_darwin.py (10 tests)
# Benchmark: QA Agent with SPICE (expect +9-11% improvement)
```

**Success Criteria:** 10/10 integration tests pass, +9%+ accuracy validated

---

### Thursday Nov 7: SPICE Phase 3 + Production Prep

#### Morning (Zenith + Thon, 4 hours): SPICE × Zenith + Swarm
```bash
# Zenith: SPICE curriculum for prompt evolution
# Modify: agents/zenith_prompt_optimizer.py (30 lines added)
# - SPICE Challenger for grounded prompt tasks

# Thon: SPICE adversarial team challenges
# Modify: infrastructure/swarm/inclusive_fitness.py (50 lines added)
# - Adversarial team robustness testing

# File: tests/integration/test_spice_zenith_swarm.py (80 lines)
# - 8 integration tests
```

**Success Criteria:** Curriculum generates 7K+ synthetic traces, teams pass adversarial challenges

#### Afternoon (All agents, 4 hours): Deployment Infrastructure
**Continue with original Week 3 roadmap Thursday tasks**

---

### Friday Nov 8: Revenue Generation + SPICE Validation

#### Morning (Forge, 4 hours): SPICE E2E Validation
```bash
# E2E test: QA Agent evolution with SPICE
# - Baseline: 8.15/10 (current SE-Darwin)
# - Target: 8.88-9.05/10 (+9-11% improvement)

# E2E test: Business creation with Pipelex workflows
# - E-commerce business with .plx workflow
# - Content platform with .plx workflow

# File: reports/SPICE_PRODUCTION_VALIDATION.md (3,000 words)
# - Performance results
# - Comparison to baseline
# - Production readiness assessment
```

**Success Criteria:** +9-11% improvement validated, Pipelex workflows deployed

#### Afternoon (All agents): Revenue Generation
**Continue with original Week 3 roadmap Friday tasks**

---

## 📅 Week 2 Integration (Nov 11-15): MicroAdapt

### Monday-Tuesday Nov 11-12: MicroAdapt Core (Thon, 2 days)

#### Day 1 (Monday): Drift Detection
```bash
# File 1: infrastructure/microadapt/drift_detector.py (200 lines)
# - CUSUM algorithm for concept drift
# - Statistical significance testing

# File 2: tests/microadapt/test_drift_detection.py (100 lines)
# - 10 tests with synthetic time-series data
```

#### Day 2 (Tuesday): Adaptation Engine
```bash
# File 3: infrastructure/microadapt/adaptation_engine.py (250 lines)
# - Adaptation strategy generation
# - Bottleneck analysis

# File 4: tests/microadapt/test_adaptation.py (100 lines)
# - 10 tests for adaptation strategies
```

**Success Criteria:** 20/20 tests passing, drift detection + adaptation operational

---

### Wednesday Nov 13: MicroAdapt × Swarm (Thon, 1 day)
```bash
# File: infrastructure/swarm/microadapt_swarm.py (300 lines)
# - Real-time team monitoring
# - Concept drift detection for business metrics
# - Automatic team adaptation (add/remove/reconfigure agents)

# File: tests/integration/test_microadapt_swarm.py (150 lines)
# - 15 integration tests
# - Simulate business evolution scenarios (launch → growth → scale)
```

**Success Criteria:** 15/15 tests pass, team adapts automatically to business changes

---

### Thursday Nov 14: MicroAdapt × SE-Darwin (Cora, 1 day)
```bash
# Modify: agents/se_darwin_agent.py (50 lines added)
# - MicroAdapt curriculum for trajectory evolution
# - Adaptive difficulty adjustment

# File: infrastructure/microadapt/curriculum_engine.py (200 lines)
# - Curriculum adaptation logic
# - Performance monitoring

# File: tests/integration/test_microadapt_darwin.py (100 lines)
# - 10 integration tests
```

**Success Criteria:** 10/10 tests pass, curriculum adapts to agent performance

---

### Friday Nov 15: MicroAdapt E2E Validation (Forge, 1 day)
```bash
# E2E test: Business evolution scenario (3 phases: launch → growth → scale)
# E2E test: Agent evolution with adaptive curriculum
# Performance benchmarks (drift detection latency, adaptation overhead)

# File: docs/MICROADAPT_INTEGRATION_GUIDE.md (300 lines)
# - Usage guide
# - Configuration
# - Troubleshooting

# File: reports/MICROADAPT_PRODUCTION_VALIDATION.md (3,000 words)
# - E2E test results
# - Performance benchmarks
# - Production readiness assessment
```

**Success Criteria:** E2E tests pass, <50ms drift detection latency

---

## 📊 Success Metrics

### Week 1 Targets (SPICE + Pipelex)
- [ ] **SPICE Tests:** 35/35 unit tests + 10/10 integration tests passing
- [ ] **Pipelex Tests:** 10/10 integration tests passing
- [ ] **Evolution Improvement:** +9-11% QA Agent accuracy (8.15 → 8.88-9.05)
- [ ] **Time Savings:** Genesis Meta-Agent 10h → 4-5h (50% reduction)
- [ ] **Production:** Working websites generating revenue autonomously

### Week 2 Targets (MicroAdapt)
- [ ] **MicroAdapt Tests:** 20/20 unit tests + 25/25 integration tests + 2/2 E2E tests passing
- [ ] **Drift Detection:** <50ms latency (non-blocking)
- [ ] **Team Adaptation:** <1 minute to adapt team composition
- [ ] **Curriculum:** SE-Darwin converges 20-30% faster with adaptive difficulty

---

## 🚀 Quick Start Commands

### Prerequisites
```bash
# Ensure in Genesis environment
cd /home/genesis/genesis-rebuild
source venv/bin/activate

# Verify API keys
echo $ANTHROPIC_API_KEY  # Already configured
echo $MISTRAL_API_KEY    # Already configured (8AhWXk5aqhlqLhPeXtgeftOzJsRWE4PQ)
echo $OPENAI_API_KEY     # Need to configure for DrGRPO
```

### Monday Morning (Cursor)
```bash
# Install Pipelex
pip install pipelex

# Run Pipelex examples
git clone https://github.com/Pipelex/pipelex-examples /tmp/pipelex-examples
cd /tmp/pipelex-examples
pipelex run workflows/cv_job_matching.plx

# Test AI generation
pipelex build pipe "Generate a product catalog for an e-commerce store"
```

### Tuesday Morning (Thon)
```bash
# Create SPICE infrastructure
mkdir -p infrastructure/spice tests/spice

# Start with challenger_agent.py
code infrastructure/spice/challenger_agent.py

# Use Context7 MCP for SPICE paper reference
# Use Haiku 4.5 for rapid prototyping
```

### Tuesday Morning (Cora)
```bash
# Design SPICE integration
mkdir -p docs/specs

# Start with integration design
code docs/specs/SPICE_DARWIN_INTEGRATION.md

# Use Context7 MCP for SE-Agent paper reference
```

---

## 📝 Agent Task Assignments

### Week 1 (SPICE + Pipelex)
| Agent | Monday | Tuesday | Wednesday | Thursday | Friday |
|-------|--------|---------|-----------|----------|--------|
| **Cursor** | Pipelex setup (4h) | - | - | - | - |
| **Thon** | - | SPICE core (8h) | - | SPICE×Swarm (4h) | - |
| **Cora** | - | SPICE design (8h) | Pipelex int (4h) + SPICE×Darwin (4h) | - | - |
| **Zenith** | - | - | - | SPICE×Zenith (4h) | - |
| **Forge** | - | - | - | - | SPICE E2E (4h) |

### Week 2 (MicroAdapt)
| Agent | Monday | Tuesday | Wednesday | Thursday | Friday |
|-------|--------|---------|-----------|----------|--------|
| **Thon** | Drift detect (8h) | Adaptation (8h) | MicroAdapt×Swarm (8h) | - | - |
| **Cora** | - | - | - | MicroAdapt×Darwin (8h) | - |
| **Forge** | - | - | - | - | MicroAdapt E2E (8h) |

---

## 🎯 Critical Path

```
Week 1:
Monday:    Pipelex setup (Cursor) → frees Cora for Swarm
Tuesday:   SPICE core (Thon) || SPICE design (Cora)
Wednesday: Pipelex integration (Cora) → Genesis Meta-Agent accelerated
           SPICE×Darwin integration (Cora) → +9-11% evolution
Thursday:  SPICE×Zenith+Swarm (Zenith+Thon) → curriculum + adversarial
Friday:    SPICE validation (Forge) + Revenue generation (All)

Week 2:
Mon-Tue:   MicroAdapt core (Thon)
Wednesday: MicroAdapt×Swarm (Thon)
Thursday:  MicroAdapt×Darwin (Cora)
Friday:    MicroAdapt E2E (Forge)
```

**Critical Path:** Pipelex → SPICE → MicroAdapt (sequential dependencies)
**Parallelizable:** Pipelex setup || Swarm work (Monday), SPICE core || SPICE design (Tuesday)

---

## 🚨 Risk Mitigation

| Risk | Probability | Mitigation |
|------|-------------|------------|
| SPICE GPU unavailable | MEDIUM | Use Mistral API fine-tuning instead ($200-250 similar cost) |
| DrGRPO complexity too high | MEDIUM | Start with simpler variance reward (no gradient optimization) |
| Pipelex learning curve | LOW | Use AI-assisted generation + examples from GitHub |
| Week 1 timeline slippage | HIGH | Pipelex frees 5-6 hours for buffer |
| MicroAdapt false positives | MEDIUM | Tune statistical thresholds (A/B test with historical data) |

---

## 📦 Deliverables Summary

### Week 1: SPICE + Pipelex
- **Code:** 2,280 lines (SPICE) + 350 lines (Pipelex) = 2,630 lines
- **Tests:** 45 tests (SPICE) + 10 tests (Pipelex) = 55 tests
- **Docs:** 3,000 words (SPICE validation) + 500 words (Pipelex quick start) = 3,500 words
- **Business Templates:** 3 × .plx workflows (e-commerce, content, SaaS)

### Week 2: MicroAdapt
- **Code:** 950 lines
- **Tests:** 45 tests
- **Docs:** 3,300 words

### Total (2 weeks)
- **Code:** 3,580 lines
- **Tests:** 100 tests (target: 100% pass rate)
- **Docs:** 6,800 words
- **Impact:** +9-11% evolution, 50% time savings, real-time adaptation

---

## ✅ Next Actions

### Immediate (User Decision Required)
1. [ ] **Approve budget:** $200-250 for SPICE DrGRPO training (or confirm Mistral API usage)
2. [ ] **Confirm agent assignments:** Thon + Cora primary, Cursor + Zenith + Forge supporting
3. [ ] **Set OPENAI_API_KEY:** For DrGRPO training (if not using Mistral API)

### Monday Morning (Cursor, 8 AM)
1. [ ] Install Pipelex: `pip install pipelex`
2. [ ] Test examples: Clone pipelex-examples, run CV-job matching workflow
3. [ ] Create Genesis templates: 3 × .plx business workflows
4. [ ] Document: `docs/PIPELEX_QUICK_START.md`

### Tuesday Morning (Thon + Cora, 8 AM)
1. [ ] **Thon:** Start `infrastructure/spice/challenger_agent.py`
2. [ ] **Cora:** Start `docs/specs/SPICE_DARWIN_INTEGRATION.md`
3. [ ] Use Context7 MCP for SPICE paper reference (arXiv:2510.24684)
4. [ ] Use Haiku 4.5 for cost optimization

---

**END OF IMPLEMENTATION PLAN**

**Let's ship this! 🚀**
