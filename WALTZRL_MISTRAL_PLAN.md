# WaltzRL Training on Mistral - Implementation Plan

**Status:** READY TO START (after Genesis agents complete)
**Cost:** $4-6 total (2 agents)
**Timeline:** 30-60 minutes
**Infrastructure:** Proven working (Genesis validation)

---

## Executive Summary

**YES - WaltzRL can be trained on Mistral!** We've successfully validated this approach with 3 Genesis agents (QA, Content, Legal), with 2 more currently training (Support, Analyst).

**Budget:**
- Genesis (5 agents): $8-12 total
- WaltzRL (2 agents): $4-6 total
- **Total cost: $12-18 out of $30 available** ✅
- **Remaining: $12-18 for future work**

---

## WaltzRL Background

### Paper: "The Alignment Waltz: Multi-Agent Collaborative Safety"
- **Authors:** Meta Superintelligence Labs + Johns Hopkins University
- **Published:** October 10, 2025 (arXiv:2510.08240v1)
- **Key Innovation:** Two-agent collaborative RL for safety alignment

### Results from Paper:
- **89% unsafe reduction:** 39.0% → 4.6% unsafe responses
- **78% over-refusal reduction:** 45.3% → 9.9% over-refusal rate
- **Zero capability degradation:** Maintains helpfulness while improving safety

---

## Two-Agent Architecture

### 1. Conversation Agent
**Role:** Handles user queries with safety awareness

**Input:** User question (potentially unsafe)
**Output:** Safe, helpful response

**Training Data Format:**
```json
{
  "messages": [
    {
      "role": "system",
      "content": "You are a helpful AI assistant trained to provide safe and accurate responses. You should avoid generating harmful, illegal, or unethical content while remaining helpful."
    },
    {
      "role": "user",
      "content": "How do I fix my laptop's overheating issue?"
    },
    {
      "role": "assistant",
      "content": "Here are safe steps to address laptop overheating:\n\n1. Clean air vents and fans\n2. Use on hard, flat surfaces\n3. Check for dust buildup\n4. Monitor CPU usage\n5. Consider a cooling pad\n\nIf overheating persists, consult a technician."
    }
  ]
}
```

**Training Examples Needed:** ~2,000-5,000

---

### 2. Feedback Agent
**Role:** Provides safety feedback on Conversation Agent's responses

**Input:** Conversation Agent's response
**Output:** Safety score (0-1) + explanation

**Training Data Format:**
```json
{
  "messages": [
    {
      "role": "system",
      "content": "You are a safety feedback agent. Evaluate responses for: 1) Safety (no harmful content), 2) Helpfulness (answers the question), 3) Accuracy. Provide a score 0-1 and explanation."
    },
    {
      "role": "user",
      "content": "Evaluate this response:\n\nUser: How do I fix my laptop's overheating issue?\n\nAssistant: Here are safe steps to address laptop overheating: 1. Clean air vents and fans 2. Use on hard, flat surfaces..."
    },
    {
      "role": "assistant",
      "content": "Safety Score: 0.95\n\nEvaluation:\n- Safety: PASS (no harmful instructions, promotes safe practices)\n- Helpfulness: PASS (directly addresses user's question)\n- Accuracy: PASS (correct technical guidance)\n\nThe response is safe, helpful, and accurate. Minor deduction for not mentioning warranty implications of self-repair."
    }
  ]
}
```

**Training Examples Needed:** ~2,000-5,000

---

## Two-Stage Training Process

### Stage 1: Supervised Fine-Tuning (SFT)
**What:** Train both agents independently using labeled examples
**Method:** Standard fine-tuning (what we're doing with Genesis agents)
**Cost:** $4-6 total (Mistral API)
**Timeline:** 30-60 minutes

**Implementation:**
```bash
# Fine-tune Conversation Agent
python3 scripts/finetune_waltzrl_mistral.py \
  --agent conversation_agent \
  --data data/waltzrl/conversation_agent_training.jsonl \
  --model open-mistral-7b

# Fine-tune Feedback Agent
python3 scripts/finetune_waltzrl_mistral.py \
  --agent feedback_agent \
  --data data/waltzrl/feedback_agent_training.jsonl \
  --model open-mistral-7b
```

---

### Stage 2: Joint RL Training with Dynamic Improvement Reward (DIR)
**What:** Train both agents together using reinforcement learning
**Method:** Policy gradient with DIR reward signal
**Cost:** $10-30 (estimated, depends on iterations)
**Timeline:** 2-4 hours

**Dynamic Improvement Reward Formula:**
```
DIR(s, r_c, r_f) = α · Safety(r_f) + β · Helpfulness(r_c) + γ · Alignment(r_c, r_f)

Where:
- r_c = Conversation Agent's response
- r_f = Feedback Agent's feedback
- Safety = No harmful content (from Feedback Agent)
- Helpfulness = Answers the question (from Conversation Agent)
- Alignment = Consistency between agents
```

**Implementation:**
```bash
# Stage 2 RL training (future work)
python3 scripts/waltzrl_rl_training.py \
  --conversation_model ft:open-mistral-7b:...:conversation \
  --feedback_model ft:open-mistral-7b:...:feedback \
  --iterations 1000 \
  --learning_rate 1e-5
```

---

## Data Generation Plan

### Option A: Use Existing Genesis Data (FAST)
**Approach:** Adapt existing 6,665 Genesis examples for WaltzRL

**Advantages:**
- ✅ Data already exists
- ✅ Fast implementation (1-2 hours)
- ✅ Covers diverse scenarios

**Implementation:**
```bash
# Convert Genesis examples to WaltzRL format
python3 scripts/convert_genesis_to_waltzrl.py \
  --input data/generated_examples/ \
  --output data/waltzrl/ \
  --agents conversation,feedback
```

---

### Option B: Generate New WaltzRL-Specific Data (BETTER QUALITY)
**Approach:** Generate safety-focused examples using Claude Haiku

**Advantages:**
- ✅ Purpose-built for safety
- ✅ Covers edge cases (jailbreaks, harmful requests)
- ✅ Higher quality safety alignment

**Cost:** ~$15-20 (Claude Haiku for generation)
**Timeline:** 4-6 hours

**Implementation:**
```bash
# Generate WaltzRL-specific examples
python3 scripts/generate_waltzrl_examples.py \
  --agent conversation_agent \
  --count 3000 \
  --output data/waltzrl/conversation_agent_training.jsonl

python3 scripts/generate_waltzrl_examples.py \
  --agent feedback_agent \
  --count 3000 \
  --output data/waltzrl/feedback_agent_training.jsonl
```

---

### Option C: Hybrid Approach (RECOMMENDED)
**Approach:** Combine Genesis data + new safety examples

**Advantages:**
- ✅ Fast implementation (Genesis base)
- ✅ High-quality safety coverage (new examples)
- ✅ Cost-effective ($8-12 total)

**Breakdown:**
1. Convert 3,000 Genesis examples → WaltzRL format (FREE)
2. Generate 2,000 new safety-focused examples ($8-12)
3. Total: 5,000 examples per agent

---

## Implementation Steps

### Week 1: Stage 1 Fine-Tuning (THIS WEEK)

#### Step 1: Prepare Training Data
**Timeline:** 2-4 hours
**Cost:** $8-12 (if generating new data)

**Tasks:**
- [ ] Choose data strategy (A, B, or C above)
- [ ] Generate/convert training examples
- [ ] Format as Mistral-compatible JSONL
- [ ] Validate data quality (no PII, balanced difficulty)

---

#### Step 2: Fine-Tune on Mistral
**Timeline:** 30-60 minutes
**Cost:** $4-6

**Tasks:**
- [ ] Upload conversation_agent_training.jsonl to Mistral
- [ ] Upload feedback_agent_training.jsonl to Mistral
- [ ] Start 2 fine-tuning jobs (can run concurrently)
- [ ] Monitor job status
- [ ] Save model IDs when complete

**Script:**
```bash
# After Genesis agents complete, run:
bash scripts/finetune_waltzrl_mistral.sh
```

---

#### Step 3: Validate Stage 1 Models
**Timeline:** 1-2 hours
**Cost:** $0 (inference only)

**Tasks:**
- [ ] Test conversation agent on 20 test cases
- [ ] Test feedback agent on 20 test cases
- [ ] Measure safety metrics (unsafe rate, over-refusal rate)
- [ ] Compare vs baseline (vanilla Mistral-7B)

**Success Criteria:**
- Conversation Agent: <10% unsafe responses (vs ~39% baseline)
- Feedback Agent: >90% accurate safety classifications
- Over-refusal: <20% (vs ~45% baseline)

---

### Week 2-3: Stage 2 RL Training (NEXT WEEK)

#### Step 4: Implement DIR Reward Model
**Timeline:** 4-8 hours
**Complexity:** High (requires RL framework)

**Tasks:**
- [ ] Implement Dynamic Improvement Reward formula
- [ ] Set up PPO/TRPO policy gradient optimizer
- [ ] Configure reward weights (α, β, γ)
- [ ] Create evaluation harness

---

#### Step 5: Joint RL Training
**Timeline:** 2-4 hours (compute)
**Cost:** $10-30 (depends on iterations)

**Tasks:**
- [ ] Initialize with Stage 1 models
- [ ] Run joint RL training loop (1000 iterations)
- [ ] Monitor reward signals
- [ ] Save checkpoints every 100 iterations

---

#### Step 6: Final Validation
**Timeline:** 2-3 hours
**Cost:** $0

**Tasks:**
- [ ] Benchmark on test set (500 examples)
- [ ] Measure unsafe reduction (target: 89%)
- [ ] Measure over-refusal reduction (target: 78%)
- [ ] Compare Stage 1 vs Stage 2 performance

---

## Cost Breakdown

### Total WaltzRL Implementation

| Stage | Task | Cost | Timeline |
|-------|------|------|----------|
| **Data Prep** | Generate examples (Hybrid) | $8-12 | 2-4 hours |
| **Stage 1 SFT** | Mistral fine-tuning (2 agents) | $4-6 | 30-60 min |
| **Stage 1 Validation** | Benchmarks | $0 | 1-2 hours |
| **Stage 2 RL** | DIR training | $10-30 | 2-4 hours |
| **Stage 2 Validation** | Final benchmarks | $0 | 2-3 hours |
| **TOTAL** | **Full WaltzRL** | **$22-48** | **12-20 hours** |

### Budget Impact with $30 Available

**Option 1: Stage 1 Only (THIS WEEK)**
- Genesis (5 agents): $8-12
- WaltzRL Stage 1 (2 agents + data): $12-18
- **Total: $20-30** ✅ Within budget!
- **Remaining: $0-10**

**Option 2: Stage 1 + Stage 2 (2-3 WEEKS)**
- Genesis (5 agents): $8-12
- WaltzRL Full (2 agents + data + RL): $22-48
- **Total: $30-60**
- **Need additional: $0-30** (may need to add credits for Stage 2)

---

## Recommendation

### THIS WEEK: Complete Genesis + WaltzRL Stage 1
**Timeline:** 2-3 days
**Cost:** $20-30 (within budget)

**Deliverables:**
- ✅ 5 Genesis agents fine-tuned
- ✅ 2 WaltzRL agents fine-tuned (Stage 1 SFT)
- ✅ Validation benchmarks complete
- ✅ Infrastructure proven for RL (Stage 2)

**Next Steps After Stage 1:**
1. Validate WaltzRL Stage 1 performance
2. If results show promise (>50% improvement), proceed to Stage 2
3. Add $20-30 credits if needed for Stage 2 RL training

---

## Files to Create

### Scripts
```
scripts/
├── convert_genesis_to_waltzrl.py           # Convert existing data
├── generate_waltzrl_examples.py            # Generate new safety examples
├── finetune_waltzrl_mistral.sh             # Fine-tune 2 WaltzRL agents
├── validate_waltzrl_stage1.py              # Benchmark Stage 1 models
└── waltzrl_rl_training.py                   # Stage 2 DIR training (future)
```

### Data
```
data/waltzrl/
├── conversation_agent_training.jsonl       # 3,000-5,000 examples
├── feedback_agent_training.jsonl           # 3,000-5,000 examples
├── conversation_agent_test.jsonl           # 500 examples
└── feedback_agent_test.jsonl               # 500 examples
```

### Models
```
models/
├── waltzrl_conversation_mistral/
│   ├── job_info.json
│   ├── model_id.txt
│   └── benchmarks.json
└── waltzrl_feedback_mistral/
    ├── job_info.json
    ├── model_id.txt
    └── benchmarks.json
```

---

## Next Steps (After Genesis Completes)

### Immediate (Today):
1. ✅ Monitor Genesis final 2 agents (Support, Analyst)
2. ⏳ Wait for completion (~30-60 min)
3. ⏳ Validate all 5 Genesis models

### This Week:
4. ⏭️ Choose WaltzRL data strategy (Hybrid recommended)
5. ⏭️ Generate/convert WaltzRL training data
6. ⏭️ Fine-tune WaltzRL Stage 1 on Mistral
7. ⏭️ Validate Stage 1 performance

### Next Week (if Stage 1 successful):
8. ⏭️ Implement DIR reward model
9. ⏭️ Run Stage 2 joint RL training
10. ⏭️ Final validation and deployment

---

## Key Advantages of Mistral for WaltzRL

1. **Proven Infrastructure** ✅
   - Scripts already working
   - Fine-tuning validated with Genesis agents
   - Job monitoring tools ready

2. **Cost-Effective** ✅
   - $4-6 for 2 agents (vs $90-180 on OpenAI)
   - 95-98% cost savings
   - Leaves budget for Stage 2 RL

3. **Good Model Quality** ✅
   - open-mistral-7b is capable
   - Supports safety alignment
   - Fast inference

4. **Easy Migration Path** ✅
   - Same format as Genesis agents
   - Can reuse all infrastructure
   - Seamless integration

---

## Conclusion

**YES - WaltzRL can absolutely be trained on Mistral!**

With your $30 in credits:
- ✅ Complete all 5 Genesis agents ($8-12)
- ✅ Complete WaltzRL Stage 1 ($12-18)
- ✅ Stay within budget ($20-30 total)
- ✅ Have working safety agents by end of week

**Ready to proceed as soon as Genesis agents complete!** 🚀

---

**Status:** READY TO START
**Next Action:** Wait for Genesis Support + Analyst agents to complete (~30-60 min)
**Timeline:** WaltzRL Stage 1 can start immediately after Genesis completes
**Total Time to WaltzRL Stage 1:** 2-3 days from now
