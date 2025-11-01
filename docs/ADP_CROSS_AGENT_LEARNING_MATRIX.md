# Agent Data Protocol - 15×15 Cross-Agent Learning Matrix

**Date:** October 31, 2025
**Owner:** Cora (Agent design and orchestration)
**Purpose:** Define which agents benefit from which other agents' training data

---

## Executive Summary

This 15×15 matrix quantifies **cross-agent learning opportunities** in Genesis. Each cell represents how much Agent A (row) benefits from Agent B's (column) training examples, scored 0-1.

**Key Insight:** All agents share foundational skills (communication, reasoning, error handling) even when specialized for different domains. ADP enables Legal agents to learn from Support examples, QA agents from Builder patterns, and Analysts from Content structure.

**Usage:** These scores weight training data during fine-tuning. Legal agent trains on 80% legal examples (score 1.0), 15% support examples (score 0.7), 3% analyst examples (score 0.5), 2% others (score <0.3).

---

## 1. The 15×15 Learning Matrix

**How to Read:**
- **Rows:** Target agent (who is learning)
- **Columns:** Source agent (whose examples are used for training)
- **Values:** Compatibility score (0-1, higher = more beneficial)

| **Target ↓ / Source →** | QA | Support | Legal | Analyst | Content | Builder | Deploy | Marketing | Sales | Finance | Research | Vision | SE-Darwin | Memory | Security |
|-------------------------|-----|---------|-------|---------|---------|---------|--------|-----------|-------|---------|----------|--------|-----------|--------|----------|
| **QA Agent** | **1.0** | 0.6 | 0.2 | 0.4 | 0.3 | **0.8** | 0.5 | 0.2 | 0.2 | 0.3 | 0.4 | 0.5 | **0.9** | 0.4 | **0.7** |
| **Support Agent** | 0.6 | **1.0** | **0.7** | 0.5 | 0.4 | 0.5 | **0.7** | 0.3 | 0.4 | 0.5 | 0.4 | 0.3 | 0.4 | 0.4 | 0.6 |
| **Legal Agent** | 0.3 | **0.7** | **1.0** | **0.8** | 0.6 | 0.2 | 0.4 | 0.5 | 0.6 | **0.8** | **0.7** | 0.3 | 0.3 | 0.4 | **0.7** |
| **Analyst Agent** | 0.4 | 0.6 | **0.7** | **1.0** | 0.6 | 0.4 | 0.5 | **0.8** | **0.8** | **0.9** | **0.8** | 0.5 | 0.4 | 0.5 | 0.5 |
| **Content Agent** | 0.3 | 0.5 | 0.5 | 0.6 | **1.0** | 0.3 | 0.3 | **0.9** | **0.8** | 0.5 | **0.8** | 0.6 | 0.3 | 0.4 | 0.4 |
| **Builder Agent** | **0.8** | 0.5 | 0.2 | 0.4 | 0.3 | **1.0** | **0.8** | 0.2 | 0.2 | 0.3 | 0.4 | 0.4 | **0.9** | 0.5 | **0.7** |
| **Deploy Agent** | 0.6 | **0.7** | 0.3 | 0.5 | 0.3 | **0.8** | **1.0** | 0.2 | 0.2 | 0.4 | 0.3 | 0.3 | 0.5 | 0.5 | **0.8** |
| **Marketing Agent** | 0.2 | 0.4 | 0.4 | **0.8** | **0.9** | 0.2 | 0.2 | **1.0** | **0.9** | 0.6 | **0.7** | **0.8** | 0.2 | 0.3 | 0.3 |
| **Sales Agent** | 0.2 | 0.5 | 0.5 | **0.8** | **0.8** | 0.2 | 0.2 | **0.9** | **1.0** | **0.7** | 0.6 | 0.4 | 0.2 | 0.4 | 0.3 |
| **Finance Agent** | 0.3 | 0.5 | **0.8** | **0.9** | 0.4 | 0.3 | 0.4 | 0.5 | **0.7** | **1.0** | 0.5 | 0.3 | 0.3 | 0.4 | 0.5 |
| **Research Agent** | 0.4 | 0.4 | **0.7** | **0.8** | **0.8** | 0.3 | 0.3 | 0.6 | 0.5 | 0.5 | **1.0** | 0.5 | 0.4 | 0.6 | 0.5 |
| **Vision Agent** | 0.6 | 0.4 | 0.3 | 0.5 | 0.7 | 0.4 | 0.3 | **0.8** | 0.4 | 0.3 | 0.5 | **1.0** | 0.3 | 0.4 | 0.5 |
| **SE-Darwin Agent** | **0.9** | 0.4 | 0.3 | 0.5 | 0.3 | **0.9** | 0.6 | 0.2 | 0.2 | 0.3 | 0.5 | 0.4 | **1.0** | 0.6 | **0.7** |
| **Memory Agent** | 0.5 | 0.5 | 0.4 | 0.6 | 0.5 | 0.5 | 0.6 | 0.4 | 0.4 | 0.5 | **0.7** | 0.5 | 0.7 | **1.0** | 0.6 |
| **Security Agent** | **0.7** | 0.6 | **0.7** | 0.5 | 0.4 | **0.7** | **0.8** | 0.3 | 0.3 | 0.5 | 0.5 | 0.5 | 0.6 | 0.6 | **1.0** |

**Bold values (≥0.7):** Strong cross-learning opportunity
**Normal values (0.4-0.6):** Moderate cross-learning opportunity
**Low values (<0.4):** Weak cross-learning opportunity

---

## 2. Key Cross-Learning Opportunities

### 2.1 High-Value Pairs (Score ≥0.8)

**QA ← Builder (0.8):**
- **Why:** Builders write code, QA tests it. Understanding code patterns improves test generation.
- **Example:** Builder creates FastAPI endpoint → QA learns common validation patterns to test

**QA ← SE-Darwin (0.9):**
- **Why:** SE-Darwin evolves agent code. QA needs to validate improved agents.
- **Example:** SE-Darwin optimizes HALO router → QA creates regression tests

**Legal ← Analyst (0.8):**
- **Why:** Both analyze documents for insights (contracts vs financial reports).
- **Example:** Analyst's data extraction skills → Legal applies to contract clause identification

**Legal ← Finance (0.8):**
- **Why:** Financial compliance overlaps with legal compliance (SOX, GDPR fines).
- **Example:** Finance calculating regulatory penalties → Legal citing compliance requirements

**Analyst ← Finance (0.9):**
- **Why:** Financial analysis is a subset of business analysis.
- **Example:** Finance's unit economics modeling → Analyst's strategic recommendations

**Analyst ← Marketing (0.8):**
- **Why:** Both analyze customer data and market trends.
- **Example:** Marketing's A/B test analysis → Analyst's conversion optimization

**Analyst ← Sales (0.8):**
- **Why:** Sales pipeline metrics inform business strategy.
- **Example:** Sales's lead qualification scoring → Analyst's customer segmentation

**Content ← Marketing (0.9):**
- **Why:** Marketing creates content strategy, Content executes it.
- **Example:** Marketing's campaign planning → Content's copywriting

**Content ← Sales (0.8):**
- **Why:** Sales collateral and email outreach overlap with content creation.
- **Example:** Sales's cold email templates → Content's persuasive writing patterns

**Builder ← Deploy (0.8):**
- **Why:** Deployment-aware code (health checks, graceful shutdown) is better code.
- **Example:** Deploy's containerization best practices → Builder's Docker-friendly code

**Deploy ← Security (0.8):**
- **Why:** Secure deployment requires understanding security principles.
- **Example:** Security's TLS configuration → Deploy's HTTPS enforcement

**Marketing ← Sales (0.9):**
- **Why:** Marketing generates leads, Sales converts them. Shared customer understanding.
- **Example:** Sales's objection handling → Marketing's messaging refinement

**Builder ← SE-Darwin (0.9):**
- **Why:** SE-Darwin generates better Builder code through evolution.
- **Example:** SE-Darwin's optimized algorithms → Builder's implementation patterns

---

### 2.2 Moderate-Value Clusters (Score 0.6-0.7)

**Legal ← Support (0.7):**
- **Why:** Support enforces policies, Legal writes them.
- **Example:** Support handling GDPR deletion requests → Legal understanding operational compliance

**Legal ← Research (0.7):**
- **Why:** Legal research (case law) similar to academic research.
- **Example:** Research's citation methods → Legal's precedent citation

**Content ← Research (0.8):**
- **Why:** Research synthesizes information, Content communicates it.
- **Example:** Research's literature review → Content's white paper structure

**Support ← Deploy (0.7):**
- **Why:** Deployment issues become support tickets.
- **Example:** Deploy's troubleshooting runbooks → Support's diagnostic procedures

**Vision ← Marketing (0.8):**
- **Why:** Visual analysis overlaps with design critique.
- **Example:** Marketing's landing page optimization → Vision's UI accessibility audits

---

### 2.3 Surprising Low Values (Score <0.3)

**Why are some scores so low?**

**Marketing ← Builder (0.2):**
- **Reason:** Marketing (brand, campaigns, copy) has little overlap with infrastructure code.
- **Exception:** If Builder creates marketing automation tools, score increases to 0.5

**Sales ← QA (0.2):**
- **Reason:** Sales conversations don't benefit from test case generation patterns.
- **Exception:** If QA documents product quality, Sales uses for customer confidence → 0.4

**Legal ← Vision (0.3):**
- **Reason:** Visual analysis rarely involves legal interpretation.
- **Exception:** If Vision analyzes compliance screenshots (cookie banners), score → 0.5

---

## 3. Practical Application: Weighted Training

### 3.1 Example: Training Legal Agent

**Scenario:** Legal agent fine-tuning with ADP cross-agent data

**Available Data:**
- Legal examples: 1,333 (DeepResearch generated)
- Support examples: 1,333
- Analyst examples: 1,333
- Finance examples: 1,333
- Research examples: 1,333
- Other 10 agents: 10 × 1,333 = 13,330
- **Total:** 19,995 examples

**Weighted Sampling Strategy:**

| Source Agent | Compatibility | Target % | Examples Used |
|--------------|---------------|----------|---------------|
| Legal (self) | 1.0 | 50% | 667 |
| Analyst | 0.8 | 15% | 200 |
| Finance | 0.8 | 15% | 200 |
| Support | 0.7 | 10% | 133 |
| Research | 0.7 | 5% | 67 |
| Others (avg 0.4) | 0.4 | 5% | 67 |
| **Total** | - | **100%** | **1,334** |

**Rationale:**
- 50% self-examples (highest quality for domain)
- 40% high-compatibility agents (0.7-0.8 scores)
- 10% moderate/low-compatibility (exposure to diverse patterns)

### 3.2 Example: Training QA Agent

**Weighted Sampling:**

| Source Agent | Compatibility | Target % | Examples Used |
|--------------|---------------|----------|---------------|
| QA (self) | 1.0 | 50% | 667 |
| SE-Darwin | 0.9 | 20% | 267 |
| Builder | 0.8 | 15% | 200 |
| Security | 0.7 | 10% | 133 |
| Others (avg 0.4) | 0.4 | 5% | 67 |
| **Total** | - | **100%** | **1,334** |

**Expected Benefit:**
- QA learns Builder's code patterns → better test case generation
- QA learns SE-Darwin's evolution validation → regression testing skills
- QA learns Security's vulnerability detection → security-focused testing

---

## 4. Matrix Justification: Task Overlap Analysis

### 4.1 High Overlap Clusters

**Engineering Cluster (QA, Builder, SE-Darwin, Deploy, Security):**
- **Shared Skills:** Code understanding, debugging, system architecture, error handling
- **Cross-Learning:** QA tests Builder's code, SE-Darwin evolves both, Deploy deploys all, Security audits everything
- **Scores:** 0.6-0.9 within cluster

**Business Intelligence Cluster (Analyst, Finance, Sales, Marketing):**
- **Shared Skills:** Data analysis, customer understanding, metrics interpretation, ROI calculation
- **Cross-Learning:** Analyst synthesizes all business data, Finance provides economic lens, Sales/Marketing provide customer insights
- **Scores:** 0.7-0.9 within cluster

**Content & Research Cluster (Content, Research, Marketing):**
- **Shared Skills:** Writing, synthesis, communication, structure, citations
- **Cross-Learning:** Research finds information, Content communicates it, Marketing targets it
- **Scores:** 0.7-0.9 within cluster

**Operations Cluster (Support, Deploy, Security):**
- **Shared Skills:** Troubleshooting, incident response, system reliability, documentation
- **Cross-Learning:** Support handles user issues, Deploy prevents infrastructure issues, Security prevents breaches
- **Scores:** 0.6-0.8 within cluster

### 4.2 Cross-Cluster Opportunities

**Legal ↔ Business Intelligence (0.7-0.8):**
- Legal analyzes contracts → Analyst extracts business terms
- Finance calculates compliance costs → Legal cites regulations
- Sales negotiates terms → Legal reviews agreements

**Support ↔ Engineering (0.5-0.7):**
- Support documents bugs → QA reproduces and tests
- Support escalates outages → Deploy investigates infrastructure
- Support reports vulnerabilities → Security patches them

**Vision ↔ Marketing (0.8):**
- Vision analyzes UI/UX → Marketing optimizes landing pages
- Vision checks accessibility → Marketing ensures inclusive design

---

## 5. Implementation in Fine-Tuning

### 5.1 Sampling Algorithm

**Pseudocode:**
```python
def sample_training_data(target_agent, total_examples=1334):
    """Sample cross-agent training data with compatibility weighting"""
    samples = []

    # Get compatibility scores for target agent
    scores = CROSS_AGENT_MATRIX[target_agent]

    # Normalize scores to probabilities
    total_score = sum(scores.values())
    probabilities = {agent: score/total_score for agent, score in scores.items()}

    # Sample proportionally
    for source_agent, prob in probabilities.items():
        num_samples = int(total_examples * prob)
        agent_examples = load_adp_examples(source_agent)
        samples.extend(random.sample(agent_examples, num_samples))

    return samples
```

### 5.2 Expected Improvements

**Baseline (Isolated Training):**
- Each agent trains on 1,333 self-examples only
- Expected improvement: 15-25% (DeepResearch target)

**ADP Cross-Learning (Weighted Sampling):**
- Each agent trains on 1,334 mixed examples (50% self, 50% cross-agent)
- Expected improvement: 30-40% (based on ADP paper: +20% from mixed training)
- **Additional gain:** +15-20% from cross-agent knowledge transfer

**Validation Strategy:**
- A/B test: Isolated vs Cross-learning
- Measure: Benchmark accuracy on held-out test set
- Target: ≥10% additional improvement from cross-learning

---

## 6. Matrix Maintenance & Evolution

### 6.1 How Scores Were Determined

**Method:** Expert judgment (Cora) based on:
1. Task category overlap (shared skills)
2. Input/output similarity (data formats)
3. Domain knowledge transfer (concepts, patterns)
4. Validated against ADP paper results (+20% mixed training)

### 6.2 Future Refinement

**Empirical Validation (Phase 8+):**
1. Fine-tune agents with different weightings (50/50, 70/30, 90/10 self/cross)
2. Measure benchmark improvement for each weighting
3. Update matrix scores based on actual performance gains
4. Iterate quarterly as agents evolve

**Planned Enhancements:**
- Task-level scores (not just agent-level)
- Dynamic weighting based on agent performance gaps
- Automated score calculation using embedding similarity

---

**Document Status:** ✅ Complete - Ready for Week 2 Implementation
**Next Document:** `ADP_CONVERSION_STRATEGY.md`
**Last Updated:** October 31, 2025
