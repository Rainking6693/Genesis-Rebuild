# DAY 4 - Tool & Intent Migration Plan

**Date:** October 15, 2025
**Status:** Planning Phase
**Objective:** Migrate legacy tools to Microsoft Agent Framework with enhanced capabilities

---

## OVERVIEW

Day 4 focuses on migrating proven tools from the legacy system (~/genesis-agent-system) to the new Microsoft Agent Framework architecture while adding reflection, failure tracking, and diverse agent pool validation.

**Legacy System Analysis:**
- 16 agents in `/agents/` directory
- 13 infrastructure modules in `/infrastructure/` directory
- Intent Abstraction Layer (Layer 7) - 97% cost reduction system
- Computer Use implementation (Gemini-based browser automation)

---

## DELIVERABLES

###

 1. Intent Abstraction Layer Migration
**Source:** `/home/genesis/genesis-agent-system/infrastructure/intent_abstraction.py` (448 lines)

**Current Capabilities:**
- Extracts structured intent from natural language (no LLM needed)
- 97% cost reduction vs full LLM reasoning
- 10x speed increase
- Routes to deterministic functions

**Components:**
- `IntentExtractor` - Keyword-based intent extraction
- `DeterministicRouter` - Routes intents to functions
- `IntentAbstractionLayer` - Main interface

**Migration Tasks:**
1. Wrap as Agent Framework tool
2. Integrate with ReasoningBank for intent pattern learning
3. Add trajectory recording to Replay Buffer
4. Update for Microsoft Agent Framework message format

**Target:** `infrastructure/intent_layer.py` (new file)

---

### 2. Reflection Harness
**Purpose:** Enable agents to review their own work before finalizing

**Current Implementation:** Builder Agent has basic reflection (lines 91-98)
```python
quality_score = self._review_code_quality(code_files)
if quality_score < 70:
    code_files = self._generate_code(spec)  # Regenerate
```

**Enhanced Implementation:**
- Reflection agent reviews outputs from other agents
- Stores reflection results in ReasoningBank
- Records failed reflections with rationale
- Triggers regeneration automatically

**Components to Build:**
1. `ReflectionAgent` - Dedicated reflection specialist
2. `ReflectionHarness` - Wraps any agent with reflection capability
3. Integration with Replay Buffer for tracking reflection outcomes

**Target:** `agents/reflection_agent.py` + `infrastructure/reflection_harness.py`

---

### 3. Failure Rationale Tracking
**Purpose:** Learn from failures by recording WHY things failed

**Current Gap:** Replay Buffer records outcomes (SUCCESS/FAILURE) but not detailed failure rationales

**Enhancement:**
- Add `failure_rationale` field to Trajectory dataclass
- Store in ReasoningBank as anti-patterns
- Query anti-patterns before taking actions (avoid known failures)

**Example:**
```python
trajectory = Trajectory(
    ...,
    final_outcome="FAILURE",
    failure_rationale="Supabase authentication failed due to missing environment variables",
    metadata={"error_type": "configuration", "fix_applied": "Added .env.example template"}
)
```

**Integration Points:**
- Replay Buffer: Store rationale
- ReasoningBank: Query anti-patterns
- Builder Agent: Check anti-patterns before building

**Target:** Enhanced `infrastructure/replay_buffer.py` + new queries in `infrastructure/reasoning_bank.py`

---

### 4. Legacy Tool Migration
**16 Agents to Migrate:**

| Agent | Purpose | Lines | Migration Priority |
|-------|---------|-------|-------------------|
| builder_agent.py | Code generation (Claude Sonnet 4) | 16595 | HIGH - Already enhanced in Day 3 |
| deploy_agent.py | Deployment to Vercel/hosting | 8315 | HIGH - Critical for production |
| analyst_agent.py | Business analysis/metrics | 5120 | MEDIUM |
| marketing_agent.py | Marketing strategy | 14541 | MEDIUM |
| content_agent.py | Content generation | 10622 | MEDIUM |
| legal_agent.py | Legal documents/compliance | 14326 | MEDIUM |
| security_agent.py | Security audits | 9712 | HIGH - Production safety |
| qa_agent.py | Quality assurance testing | 5605 | HIGH - Already using Alex |
| seo_agent.py | SEO optimization | 9268 | LOW |
| support_agent.py | Customer support | 4489 | LOW |
| email_agent.py | Email campaigns | 5214 | LOW |
| billing_agent.py | Payment/billing | 10254 | MEDIUM |
| maintenance_agent.py | System maintenance | 5332 | MEDIUM |
| onboarding_agent.py | User onboarding | 3978 | LOW |
| spec_agent.py | Specification generation | 2870 | HIGH - Critical for builder |
| legal_agent.py | Legal compliance | 14326 | LOW (unless regulated industry) |

**Migration Strategy:**
- **Phase 1 (Day 4):** Migrate HIGH priority agents (builder, deploy, security, spec, qa)
- **Phase 2 (Day 5):** Migrate MEDIUM priority agents (analyst, marketing, content, billing, maintenance)
- **Phase 3 (Day 6+):** Migrate LOW priority agents (seo, support, email, onboarding, legal)

---

### 5. TUMIX-Inspired Diverse Agent Pool Validation
**Background:** TUMIX paper proved diverse agents (15 different types) outperform single best agent

**Current Agent Pool:**
- Cora (Architecture auditor)
- Hudson (Code reviewer)
- Alex (E2E + Deployment tester)
- Thon (Python specialist)
- Builder (Code generator)

**Target:** 15 diverse specialized agents

**Validation Criteria:**
1. Each agent has distinct reasoning approach
2. Tool augmentation (Code Interpreter, Search, Computer Use)
3. Different LLM models where appropriate
4. Measurable performance improvement vs single agent

**Agents to Add (reaching 15 total):**
1. ✅ Cora (Architecture - GPT-4o)
2. ✅ Hudson (Code Review - Claude Sonnet 4)
3. ✅ Alex (Testing - Claude Sonnet 4)
4. ✅ Thon (Python - Claude Sonnet 4)
5. ✅ Builder (Code Gen - Claude Sonnet 4)
6. **Spec Agent** (Requirements - GPT-4o)
7. **Deploy Agent** (Deployment - Gemini Flash for speed)
8. **Security Agent** (Security audits - Claude Sonnet 4)
9. **Analyst Agent** (Metrics/data - GPT-4o with Code Interpreter)
10. **Marketing Agent** (Strategy - Claude Sonnet 4)
11. **Reflection Agent** (Self-review - GPT-4o)
12. **Integration Agent** (API/webhooks - Gemini Flash)
13. **Database Agent** (Schema design - Claude Sonnet 4)
14. **Frontend Agent** (UI/UX specialist - Claude Sonnet 4)
15. **Backend Agent** (API specialist - Claude Sonnet 4)

**Diversity Dimensions:**
- Model variety: GPT-4o (5), Claude Sonnet 4 (8), Gemini Flash (2)
- Tool augmentation: Code Interpreter, Search, Computer Use
- Reasoning style: Architecture, code quality, testing, security, metrics

---

## IMPLEMENTATION PLAN

### Step 1: Intent Abstraction Layer (4 hours)
1. Create `infrastructure/intent_layer.py`
2. Port IntentExtractor, DeterministicRouter, IntentAbstractionLayer
3. Wrap as Agent Framework tool
4. Add ReasoningBank integration for intent pattern learning
5. Add Replay Buffer trajectory recording
6. Write unit tests (15-20 tests)

### Step 2: Reflection Harness (3 hours)
1. Create `agents/reflection_agent.py`
2. Create `infrastructure/reflection_harness.py`
3. Implement ReflectionAgent with quality scoring
4. Implement ReflectionHarness decorator/wrapper
5. Integrate with ReasoningBank
6. Write unit tests (10-15 tests)

### Step 3: Failure Rationale Tracking (2 hours)
1. Add `failure_rationale` field to Trajectory dataclass
2. Update Replay Buffer to store rationales
3. Add anti-pattern queries to ReasoningBank
4. Update Builder Agent to check anti-patterns
5. Write unit tests (5-10 tests)

### Step 4: High-Priority Agent Migration (8 hours)
1. **Spec Agent** (1.5 hours)
   - Port from legacy
   - Add ReasoningBank integration
   - Add reflection capability
   - Write tests

2. **Deploy Agent** (2 hours)
   - Port Vercel deployment logic
   - Add trajectory recording
   - Add failure rationale tracking
   - Write tests

3. **Security Agent** (2 hours)
   - Port security audit logic
   - Integrate with Hudson for code review
   - Add vulnerability tracking
   - Write tests

4. **Analyst Agent** (1.5 hours)
   - Port metrics/analysis logic
   - Add Code Interpreter tool
   - Add visualization generation
   - Write tests

5. **Marketing Agent** (1 hour)
   - Port marketing strategy logic
   - Add content generation integration
   - Write tests

### Step 5: TUMIX Agent Pool Validation (3 hours)
1. Document all 15 agents
2. Measure diversity scores
3. Run comparative benchmarks (1 agent vs 15 agents)
4. Validate performance improvement
5. Create agent pool documentation

### Step 6: Integration Testing (2 hours)
1. Test intent layer with all agents
2. Test reflection harness with builder agent
3. Test failure rationale tracking end-to-end
4. Validate agent pool collaboration

### Step 7: Audits (4 hours)
1. Cora architecture audit (1 hour)
2. Hudson code review (1 hour)
3. Alex E2E testing (1 hour)
4. Alex deployment testing (1 hour)

**Total Estimated Time:** 26 hours (~3 days with breaks)

---

## SUCCESS CRITERIA

### Intent Abstraction Layer
- [ ] Extracts intents from natural language with 90%+ accuracy
- [ ] Routes to correct functions 95%+ of time
- [ ] Achieves 90%+ cost reduction vs full LLM
- [ ] 15+ unit tests passing
- [ ] Integrated with ReasoningBank

### Reflection Harness
- [ ] Agents can review their own outputs
- [ ] Automatic regeneration when quality < 70
- [ ] Reflection results stored in ReasoningBank
- [ ] 10+ unit tests passing

### Failure Rationale Tracking
- [ ] All failures have detailed rationales
- [ ] Anti-patterns queryable from ReasoningBank
- [ ] Builder checks anti-patterns before building
- [ ] 5+ unit tests passing

### Agent Migration
- [ ] 5 high-priority agents migrated
- [ ] All agents use Microsoft Agent Framework
- [ ] All agents record trajectories
- [ ] All agents integrated with ReasoningBank
- [ ] 50+ unit tests passing (10 per agent)

### TUMIX Validation
- [ ] 15 diverse agents documented
- [ ] Measurable performance improvement vs single agent
- [ ] Tool augmentation verified (Code Interpreter, Search, Computer Use)
- [ ] Agent pool collaboration tested

### Audits
- [ ] Cora: 90+ architecture score
- [ ] Hudson: 90+ code quality score
- [ ] Alex E2E: 95+ test pass rate
- [ ] Alex Deployment: All deployment tests pass

---

## RISKS & MITIGATION

### Risk 1: Legacy Code Compatibility
**Issue:** Legacy agents use Anthropic SDK directly, new system uses Agent Framework
**Mitigation:** Create adapter layer that wraps legacy agent logic in Agent Framework tools

### Risk 2: Intent Extraction Accuracy
**Issue:** Keyword-based extraction may miss edge cases
**Mitigation:** Add LLM fallback for low-confidence intents (already in design)

### Risk 3: Reflection Performance Overhead
**Issue:** Double inference (generate + reflect) increases cost/latency
**Mitigation:** Only reflect on high-stakes outputs (code generation, deployments, security audits)

### Risk 4: Agent Pool Coordination
**Issue:** 15 agents need to work together without conflicts
**Mitigation:** Use message bus for coordination, ReasoningBank for shared context

---

## DEPENDENCIES

**From Day 3 (All Complete ✅):**
- ReasoningBank (Layer 6) - Pattern storage/retrieval
- Replay Buffer - Trajectory recording
- Enhanced Builder Agent - Learning loop

**External:**
- Legacy system at ~/genesis-agent-system
- Anthropic API key (Claude Sonnet 4)
- Google Gemini API key (Computer Use, Gemini Flash)
- OpenAI API key (GPT-4o)

---

## NEXT STEPS

**Immediate:**
1. Begin Step 1: Intent Abstraction Layer migration
2. Use Thon agent for Python implementation
3. Create unit tests as we go

**After Day 4:**
- Day 5: Complete medium-priority agent migration
- Day 6: Complete low-priority agent migration
- Day 7: Darwin Gödel Machine integration (self-improvement)

---

**Document Status:** DRAFT
**Last Updated:** October 15, 2025
**Next Review:** After Day 4 completion
