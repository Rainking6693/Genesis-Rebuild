# WaltzRL Safety Integration - Implementation Design
**Date:** October 22, 2025
**Status:** Design Phase
**Priority:** TIER 1 (Post-OCR, Pre-Memory)

---

## 📋 EXECUTIVE SUMMARY

**WaltzRL** (The Alignment Waltz) is a collaborative multi-agent safety framework that uses two agents:
1. **Conversation Agent** - Generates responses to user queries
2. **Feedback Agent** - Provides safety/helpfulness suggestions to improve responses

**Key Innovation:** Dynamic Improvement Reward (DIR) that incentivizes the feedback agent to provide useful suggestions, resulting in:
- **89% unsafe response reduction** (39.0% → 4.6% on WildJailbreak)
- **78% over-refusal reduction** (45.3% → 9.9% on OR-Bench)
- **Zero capability degradation** (unlike binary blocking systems like Llama Guard)

---

## 🎯 INTEGRATION GOALS

### Primary Objectives:
1. **Safety:** Reduce unsafe agent responses by 80%+
2. **Helpfulness:** Reduce over-refusal by 70%+ (agents should help when safe)
3. **Transparency:** Explainable safety decisions (feedback visible in logs)
4. **Performance:** <200ms overhead per request
5. **Zero Regression:** No degradation of existing agent capabilities

### Integration Points:
- **Layer 1 (HALO Router):** Wrap agent responses with WaltzRL safety check
- **Layer 2 (SE-Darwin):** Add safety benchmarks to evolution loop
- **All 15 Agents:** Universal safety wrapper (same interface)

---

## 🏗️ ARCHITECTURE DESIGN

### System Components:

```
User Query
    ↓
HALO Router (selects agent)
    ↓
Agent Generates Response
    ↓
WaltzRL Safety Wrapper ← [NEW]
    ├── Conversation Agent (original response)
    ├── Feedback Agent (safety analysis)
    ├── Dynamic Improvement Reward (DIR)
    └── Final Response (improved if needed)
    ↓
Return to User
```

### Component 1: WaltzRL Feedback Agent
```python
class WaltzRLFeedbackAgent:
    """
    Analyzes agent responses for safety and helpfulness.
    Provides constructive feedback for improvement.
    """

    def analyze_response(
        self,
        query: str,
        response: str,
        agent_type: str
    ) -> FeedbackResult:
        """
        Analyze response for safety issues and over-refusals.

        Returns:
            FeedbackResult with:
            - safety_score: 0.0-1.0 (1.0 = completely safe)
            - helpfulness_score: 0.0-1.0 (1.0 = maximally helpful)
            - issues_found: List of safety concerns
            - suggestions: Concrete improvement recommendations
            - should_block: bool (only for critical safety issues)
        """
```

**Safety Categories Checked:**
1. **Harmful content:** Violence, hate speech, illegal activities
2. **Privacy violations:** PII leakage, credentials exposure
3. **Malicious instructions:** Phishing, social engineering, DoS
4. **Over-refusal:** Unnecessarily declining safe requests
5. **Capability degradation:** Response quality below baseline

### Component 2: WaltzRL Conversation Agent
```python
class WaltzRLConversationAgent:
    """
    Wrapper around existing agents that incorporates feedback.
    Improves responses based on safety suggestions.
    """

    def generate_safe_response(
        self,
        query: str,
        original_response: str,
        feedback: FeedbackResult
    ) -> SafeResponse:
        """
        Generate improved response incorporating feedback.

        Returns:
            SafeResponse with:
            - response: Improved text
            - safety_score: 0.0-1.0
            - changes_made: List of improvements applied
            - feedback_incorporated: bool
        """
```

### Component 3: Dynamic Improvement Reward (DIR)
```python
class DynamicImprovementReward:
    """
    Calculates reward for feedback agent based on:
    1. How much the conversation agent improved
    2. Whether safety issues were resolved
    3. Whether helpfulness increased
    """

    def calculate_dir(
        self,
        original_response: str,
        improved_response: str,
        feedback: FeedbackResult,
        user_satisfied: Optional[bool] = None
    ) -> float:
        """
        Calculate Dynamic Improvement Reward.

        Formula (simplified):
        DIR = safety_improvement * 0.5 +
              helpfulness_improvement * 0.3 +
              user_satisfaction * 0.2

        Returns:
            Float between -1.0 and 1.0
            - Positive: Feedback was helpful
            - Negative: Feedback degraded response
        """
```

### Component 4: Safety Wrapper (Integration Layer)
```python
class WaltzRLSafetyWrapper:
    """
    Universal safety wrapper for all Genesis agents.
    Transparently adds WaltzRL safety checking.
    """

    def wrap_agent_response(
        self,
        agent_name: str,
        query: str,
        response: str,
        agent_metadata: Dict
    ) -> WrappedResponse:
        """
        Wrap agent response with WaltzRL safety layer.

        Process:
        1. Feedback agent analyzes original response
        2. If issues found, conversation agent improves it
        3. Calculate DIR to reinforce good feedback
        4. Log safety metrics to OTEL
        5. Return final safe response
        """
```

---

## 📊 TWO-STAGE TRAINING PROCESS

### Stage 1: Feedback Agent Training (Week 1)
**Goal:** Train feedback agent to identify safety issues accurately

**Training Data Required:**
- ✅ 100+ safe responses (from existing Genesis agents)
- ✅ 100+ unsafe responses (from public safety benchmarks)
- ✅ 50+ over-refusal examples (agents declining safe requests)

**Training Method:**
- Supervised fine-tuning on labeled examples
- Classification: safe/unsafe/over-refusal/degraded
- Output: Concrete improvement suggestions (not just labels)

**Validation:**
- 90%+ accuracy on holdout safety dataset
- <200ms inference time
- Suggestions actionable (>80% lead to improvements)

### Stage 2: Joint DIR Training (Week 2)
**Goal:** Train conversation agent to incorporate feedback effectively

**Training Process:**
1. Conversation agent generates response
2. Feedback agent provides suggestions
3. Conversation agent revises response
4. Calculate DIR (reward feedback agent)
5. Update both agents via reinforcement learning

**Reward Structure:**
- +1.0: Resolved safety issue without degrading helpfulness
- +0.5: Improved helpfulness without introducing safety issues
- 0.0: No change (neutral feedback)
- -0.5: Suggestion degraded response quality
- -1.0: Suggestion introduced new safety issues

**Optimization:**
- Use PPO (Proximal Policy Optimization) for stability
- Run 1000+ iterations on Genesis benchmark scenarios
- Monitor for capability degradation

---

## 🔌 INTEGRATION WITH GENESIS LAYERS

### Integration 1: HALO Router Wrapper
**File:** `infrastructure/orchestration/halo_router.py`

**Modification:**
```python
# After agent response
response = await agent.run(query)

# Add WaltzRL safety check [NEW]
if WALTZRL_ENABLED:
    safety_wrapper = WaltzRLSafetyWrapper()
    wrapped_response = safety_wrapper.wrap_agent_response(
        agent_name=agent.name,
        query=query,
        response=response,
        agent_metadata=agent_metadata
    )

    # Log safety metrics to OTEL
    otel_tracer.add_event(
        "waltzrl_safety_check",
        attributes={
            "safety_score": wrapped_response.safety_score,
            "changes_made": len(wrapped_response.changes_made),
            "blocked": wrapped_response.blocked
        }
    )

    response = wrapped_response.response
```

### Integration 2: SE-Darwin Safety Benchmarks
**File:** `agents/se_darwin_agent.py`

**Modification:**
```python
# Add safety benchmarks to evolution loop
safety_benchmarks = [
    "Safety: Reject harmful content requests",
    "Safety: Protect PII and credentials",
    "Safety: Decline malicious instructions",
    "Helpfulness: Accept safe coding requests",
    "Helpfulness: Provide legitimate security advice"
]

# Evaluate evolved agents on safety
for benchmark in safety_benchmarks:
    result = evaluate_agent_on_benchmark(evolved_agent, benchmark)
    if result.safety_score < 0.9:
        reject_evolution("Safety regression detected")
```

### Integration 3: Feature Flag
**File:** `infrastructure/feature_flags.py`

**New Flags:**
```python
WALTZRL_ENABLED = get_env_bool("WALTZRL_ENABLED", default=False)
WALTZRL_FEEDBACK_ONLY = get_env_bool("WALTZRL_FEEDBACK_ONLY", default=True)  # Log but don't block
WALTZRL_BLOCK_UNSAFE = get_env_bool("WALTZRL_BLOCK_UNSAFE", default=False)  # Hard block on critical issues
WALTZRL_MIN_SAFETY_SCORE = get_env_float("WALTZRL_MIN_SAFETY_SCORE", default=0.7)
```

---

## 📈 EXPECTED METRICS

### Safety Metrics (Week 2 Validation):
- **Unsafe Response Rate:** <5% (target: 89% reduction from ~40% baseline)
- **Over-Refusal Rate:** <10% (target: 78% reduction from ~45% baseline)
- **False Positive Rate:** <2% (safe responses wrongly flagged)
- **Capability Preservation:** >95% (no degradation on Genesis benchmarks)

### Performance Metrics:
- **Feedback Agent Inference:** <100ms
- **Conversation Agent Revision:** <150ms
- **Total Overhead:** <200ms (within SLO: P95 <200ms)
- **Throughput Impact:** <5% reduction

### Quality Metrics:
- **Feedback Usefulness:** >80% (suggestions lead to improvements)
- **DIR Correlation:** >0.7 (DIR predicts user satisfaction)
- **User Satisfaction:** No decrease (measured via existing metrics)

---

## 🛠️ IMPLEMENTATION PLAN

### Week 1: Foundation (Days 1-7)
**Owner:** Cora/Zenith (design), Thon (Python implementation)

**Tasks:**
1. ✅ Design document (this file)
2. ⏳ Create `infrastructure/safety/waltzrl_feedback_agent.py` (~500 lines)
3. ⏳ Create `infrastructure/safety/waltzrl_conversation_agent.py` (~400 lines)
4. ⏳ Create `infrastructure/safety/waltzrl_wrapper.py` (~300 lines)
5. ⏳ Create `infrastructure/safety/dir_calculator.py` (~200 lines)
6. ⏳ Add WaltzRL feature flags
7. ⏳ Write 50+ unit tests

**Deliverables:**
- 4 new Python modules (~1,400 lines)
- 50+ unit tests (100% coverage)
- Feature flags integrated

### Week 2: Training & Integration (Days 8-14)
**Owner:** Thon (training), Hudson (code review), Alex (testing)

**Tasks:**
1. ⏳ Collect training data (200+ examples from Genesis benchmarks)
2. ⏳ Train feedback agent (Stage 1)
3. ⏳ Train conversation agent (Stage 2 - joint DIR)
4. ⏳ Integrate wrapper with HALO router
5. ⏳ Add safety benchmarks to SE-Darwin
6. ⏳ E2E testing (Alex)
7. ⏳ Performance validation (Forge)

**Deliverables:**
- Trained feedback agent model
- Trained conversation agent model
- HALO router integration complete
- 100+ E2E tests passing
- Performance <200ms overhead validated

---

## 🧪 TESTING STRATEGY

### Unit Tests (50+ tests):
- Feedback agent classification accuracy
- Conversation agent improvement generation
- DIR calculation correctness
- Safety wrapper integration
- Feature flag behavior

### Integration Tests (30+ tests):
- HALO router + WaltzRL wrapper
- SE-Darwin + safety benchmarks
- OTEL metrics logging
- Feature flag toggling

### E2E Tests (20+ scenarios):
- Safe request → helpful response (no changes)
- Unsafe request → blocked or revised response
- Over-refusal → improved helpful response
- Edge cases (empty query, malformed response)

### Benchmark Validation:
- **WildJailbreak:** Target <5% unsafe (from 39%)
- **OR-Bench:** Target <10% over-refusal (from 45.3%)
- **Genesis Benchmarks:** No regression (270 scenarios)

---

## 🚀 DEPLOYMENT PLAN

### Phase 1: Feedback-Only Mode (Day 8-10)
- Enable `WALTZRL_FEEDBACK_ONLY=true`
- Log all safety issues, don't block
- Collect baseline metrics
- Validate no performance impact

### Phase 2: Soft Launch (Day 11-12)
- Enable `WALTZRL_ENABLED=true`
- Improve responses, don't block
- Monitor DIR scores
- Collect user feedback

### Phase 3: Hard Safety (Day 13-14)
- Enable `WALTZRL_BLOCK_UNSAFE=true` (only critical issues)
- Block <1% of requests (high-confidence unsafe)
- Monitor false positives
- Tune safety threshold

### Phase 4: Production (Week 3+)
- Full rollout to all agents
- Continuous monitoring
- Weekly model retraining with new data
- Monthly benchmark re-validation

---

## 💰 COST ANALYSIS

### Training Costs (One-Time):
- **Feedback Agent Training:** ~$10 (1K examples, GPT-4o fine-tuning)
- **Conversation Agent Training:** ~$50 (10K iterations, PPO with DIR)
- **Validation Benchmarks:** ~$5 (5K test examples)
- **Total One-Time:** ~$65

### Inference Costs (Ongoing):
- **Feedback Agent:** $0.0003/request (100ms, Claude Haiku)
- **Conversation Agent Revision:** $0.0005/request (10% revision rate)
- **Monthly (10K requests):** ~$8/month
- **Impact:** +16% cost increase (acceptable for safety)

### ROI:
- **Safety Incidents Avoided:** Priceless (1 major incident = $10K+ in damages)
- **User Trust:** Increased retention, positive brand impact
- **Compliance:** Meets AI safety regulations (EU AI Act, etc.)

---

## 📚 TECHNICAL REFERENCES

### Papers:
1. **WaltzRL (arXiv:2510.08240v1)** - Primary implementation reference
2. **RLHF (Ouyang et al., 2022)** - Reinforcement learning foundation
3. **Constitutional AI (Anthropic, 2022)** - Safety alignment approach

### Existing Genesis Code:
- `infrastructure/orchestration/halo_router.py` - Integration point
- `agents/se_darwin_agent.py` - Safety benchmark integration
- `infrastructure/feature_flags.py` - Feature flag system
- `infrastructure/observability/otel_config.py` - Metrics logging

### External Tools:
- **LangChain:** Safety evaluators (may use for baseline comparison)
- **Microsoft Responsible AI:** Prompt shields (complementary, not replacement)
- **Anthropic Claude:** Haiku for fast feedback inference

---

## ⚠️ RISKS & MITIGATIONS

### Risk 1: Over-Blocking (False Positives)
**Impact:** Users frustrated by declined safe requests
**Mitigation:**
- Start with feedback-only mode (no blocking)
- Tune safety threshold based on false positive rate
- Allow user appeals ("This was safe, why blocked?")

### Risk 2: Under-Blocking (False Negatives)
**Impact:** Unsafe content gets through
**Mitigation:**
- Conservative safety threshold initially
- Continuous monitoring of safety incidents
- Weekly model retraining on new unsafe examples

### Risk 3: Performance Degradation
**Impact:** Responses too slow (<200ms SLO)
**Mitigation:**
- Use fast models (Claude Haiku for feedback)
- Async processing (don't block on revision)
- Cache common safety patterns

### Risk 4: Capability Regression
**Impact:** Agents become less helpful
**Mitigation:**
- Monitor Genesis benchmarks continuously
- Separate safety score from helpfulness score
- Reject WaltzRL updates that degrade performance

---

## ✅ SUCCESS CRITERIA

### Week 1 (Foundation):
- [ ] All 4 modules implemented (~1,400 lines)
- [ ] 50+ unit tests passing (100% coverage)
- [ ] Code review approval (Hudson 8.5/10+)
- [ ] No blocking issues identified

### Week 2 (Training & Integration):
- [ ] Feedback agent 90%+ accuracy on safety dataset
- [ ] Conversation agent 80%+ improvement rate
- [ ] E2E tests 100% passing (100/100)
- [ ] Performance <200ms overhead validated
- [ ] Zero regressions on Genesis benchmarks

### Week 3 (Production):
- [ ] Unsafe response rate <5% (from ~40% baseline)
- [ ] Over-refusal rate <10% (from ~45% baseline)
- [ ] User satisfaction maintained or improved
- [ ] Zero critical safety incidents
- [ ] Production deployment complete

---

## ⚠️ KNOWN LIMITATIONS (P1-6 FIX)

### Stage 1 (Rule-Based Implementation) Limitations

#### Over-Refusal Correction (Limited Capability)
**Status:** Rule-based Stage 1 implementation has limited over-refusal correction capability.

**What Works:**
- **Detection:** Identifies over-refusal patterns ("I cannot", "I'm unable to")
- **Analysis:** Flags safe requests that were unnecessarily declined
- **Scoring:** Penalizes helpfulness score for over-refusals

**What Doesn't Work (Yet):**
- **Generation:** Cannot generate new helpful responses (requires LLM)
- **Context Understanding:** Cannot determine if refusal was appropriate based on nuanced query intent
- **Natural Language Improvement:** Limited to pattern replacement, not true content generation

**Why:**
Rule-based Stage 1 can only modify/remove text using regex patterns, not generate new content. Over-refusal correction requires:
1. Understanding query intent (safe vs unsafe)
2. Generating appropriate helpful responses
3. Natural language refinement (beyond pattern matching)

**Current Implementation:**
- Replaces refusal language with helpful alternatives (regex substitution)
- Example: "I cannot" → "I can help you with that. Here's how"
- Limitation: Only works for simple pattern-based replacements

**Solution:**
Stage 2 (LLM-based) will add:
- **GPT-4o/Claude** for response generation
- **Context-aware helpfulness assessment** (understands query safety)
- **Natural language improvement** (not just pattern replacement)
- **Iterative refinement** with feedback loop

**Expected Impact:**
- **Stage 1 (Current):** 0-20% over-refusal reduction (detection only, limited pattern replacement)
- **Stage 2 (LLM-based):** 78% over-refusal reduction (generation + refinement, per WaltzRL paper)

**Timeline:**
- Stage 1: **Deployed** (October 22, 2025) - Rule-based detection + limited correction
- Stage 2: **Week 2 post-deployment** (Oct 29-Nov 4) - LLM-based generation + full correction

**Testing Expectations:**
- **Over-refusal unit tests:** Expected to pass 0-1/3 tests (Stage 1 limitation)
- **Over-refusal E2E tests:** Expected to pass 1-2/3 tests (pattern matching only)
- **Production target:** 78% reduction after Stage 2 LLM integration

**Workaround (Stage 1):**
- System logs over-refusal issues for monitoring
- Helpfulness score reflects over-refusal penalty
- Human review flagged for declined safe requests
- Stage 2 deployment prioritized for full correction

---

## 🔄 NEXT STEPS

### Immediate (Next 24 Hours):
1. **User Approval** - Get confirmation to proceed with WaltzRL
2. **Create Modules** - Start with `waltzrl_feedback_agent.py`
3. **Training Data** - Extract 200+ examples from Genesis benchmarks
4. **Feature Flags** - Add WaltzRL flags to `feature_flags.py`

### This Week:
1. Complete all 4 WaltzRL modules
2. Write 50+ unit tests
3. Begin Stage 1 training (feedback agent)

### Next Week:
1. Stage 2 training (joint DIR)
2. HALO router integration
3. E2E testing with Alex
4. Performance validation with Forge

---

**Status:** ✅ Design Complete - Ready for Implementation
**Timeline:** 2 weeks to production (October 22 - November 5, 2025)
**Confidence:** 9/10 (proven research, clear architecture, minimal risk)
