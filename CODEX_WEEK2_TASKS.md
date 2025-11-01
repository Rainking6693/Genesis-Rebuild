# CODEX WEEK 2 TASKS - Launch Preparation

**Owner:** Codex
**Timeline:** Next week (Week 2)
**Goal:** Prepare Genesis for production launch

---

## TASK 1: Benchmark All 5 Fine-Tuned Models ⭐ HIGHEST PRIORITY

### Objective
Validate that all 5 fine-tuned Mistral models meet quality standards (target: ≥8% improvement vs baseline).

### Models to Benchmark
```
1. qa_agent:       ft:open-mistral-7b:5010731d:20251031:ecc3829c
2. content_agent:  ft:open-mistral-7b:5010731d:20251031:547960f9
3. legal_agent:    ft:open-mistral-7b:5010731d:20251031:eb2da6b7
4. support_agent:  ft:open-mistral-7b:5010731d:20251031:f997bebc
5. analyst_agent:  ft:open-mistral-7b:5010731d:20251031:9ae05c7c
```

### Steps
1. **Create benchmark script** (`scripts/benchmark_finetuned.py`):
   - Load 50+ test scenarios per agent from existing benchmarks
   - Test each fine-tuned model against baseline (open-mistral-7b)
   - Metrics to track:
     - Accuracy (correctness of response)
     - Task adherence (stays on topic)
     - Safety score (no harmful content)
     - Response time (latency)
     - Cost per request

2. **Run benchmarks for all 5 agents**:
   ```bash
   export MISTRAL_API_KEY="8AhWXk5aqhlqLhPeXtgeftOzJsRWE4PQ"

   for agent in qa_agent content_agent legal_agent support_agent analyst_agent; do
     python3 scripts/benchmark_finetuned.py \
       --agent $agent \
       --model models/${agent}_mistral/model_id.txt \
       --scenarios tests/rogue/scenarios/${agent}_scenarios_template.yaml \
       --output reports/benchmarks/${agent}_results.json
   done
   ```

3. **Generate comparison report** (`reports/finetuning_quality_report.md`):
   - Table comparing baseline vs fine-tuned for each agent
   - Overall improvement percentage
   - Recommendation: Deploy to A/B testing if ≥8% improvement
   - Flag any regressions or quality issues

### Success Criteria
- ✅ All 5 agents benchmarked
- ✅ Report shows ≥8% improvement across metrics
- ✅ No critical regressions (safety, accuracy)
- ✅ Cost per request within budget (<$0.01/request)

### Deliverables
- `scripts/benchmark_finetuned.py` (200-300 lines)
- `reports/benchmarks/*.json` (5 files, one per agent)
- `reports/finetuning_quality_report.md` (comprehensive comparison)

---

## TASK 2: Data Quality Audit & Cleanup

### Objective
Fix identified data quality issues before WaltzRL training.

### Issues from Previous Audit (reports/training_quality_audit.md)
1. **PII leakage:** 2,723 emails, 145 phone numbers in training data
2. **Difficulty imbalance:** 57-59% easy examples, 0-1% hard examples (target: 30% easy, 25% hard)
3. **Duplicate groups:** 22,094 groups (intentional cross-agent learning, but verify no true duplicates)

### Steps
1. **PII Scrubbing Script** (`scripts/scrub_pii.py`):
   ```python
   # Regex patterns for emails, phones, SSNs, credit cards
   # Replace with placeholders: [EMAIL], [PHONE], [SSN], [CARD]
   # Process all files in data/generated_examples/*.jsonl
   # Save cleaned versions to data/generated_examples_cleaned/
   ```

2. **Difficulty Rebalancing** (`scripts/rebalance_difficulty.py`):
   ```python
   # Target distribution: 30% easy, 45% medium, 25% hard
   # Generate 2,000+ new hard examples using GPT-4o
   # Merge with existing data
   # Save to data/generated_examples_rebalanced/
   ```

3. **Re-audit Quality**:
   ```bash
   python3 scripts/audit_training_quality.py \
     --input data/generated_examples_rebalanced \
     --output reports/training_quality_audit_v2.md
   ```

### Success Criteria
- ✅ 0 PII instances in cleaned data
- ✅ Difficulty distribution: 25-35% easy, 40-50% medium, 20-30% hard
- ✅ Re-audit shows all quality metrics green

### Deliverables
- `scripts/scrub_pii.py` (100-150 lines)
- `scripts/rebalance_difficulty.py` (200-250 lines)
- `data/generated_examples_cleaned/*.jsonl` (5 files)
- `data/generated_examples_rebalanced/*.jsonl` (5 files)
- `reports/training_quality_audit_v2.md`

---

## TASK 3: WaltzRL Data Preparation

### Objective
Prepare training data for WaltzRL 2-agent system (Conversation Agent + Feedback Agent).

### Research Reference
- Paper: https://arxiv.org/abs/2510.08240v1
- Implementation plan: `WALTZRL_MISTRAL_PLAN.md`

### Steps
1. **Create Conversation Agent dataset** (`data/waltzrl/conversation_agent_training.jsonl`):
   - Format: Standard user/assistant messages
   - 1,000-2,000 examples covering:
     - Safe queries with helpful responses
     - Borderline queries with nuanced safe responses
     - Unsafe queries with refusal + explanation
   - Source: Adapt from existing Genesis examples + generate new with GPT-4o

2. **Create Feedback Agent dataset** (`data/waltzrl/feedback_agent_training.jsonl`):
   - Format: Takes (user_query, assistant_response) as input, provides safety feedback
   - 1,000-2,000 examples with feedback labels:
     - "SAFE" + explanation
     - "BORDERLINE" + suggestions for improvement
     - "UNSAFE" + specific issues identified
   - Source: Generate using GPT-4o to critique Conversation Agent responses

3. **Validation script** (`scripts/validate_waltzrl_data.py`):
   ```python
   # Check format compliance (messages array structure)
   # Verify safety label distribution (target: 60% SAFE, 30% BORDERLINE, 10% UNSAFE)
   # Ensure no PII leakage
   # Generate validation report
   ```

### Success Criteria
- ✅ 1,000-2,000 examples per agent (2,000-4,000 total)
- ✅ Format validated (Mistral API compatible)
- ✅ Safety label distribution balanced
- ✅ No PII in training data

### Deliverables
- `data/waltzrl/conversation_agent_training.jsonl` (1,000-2,000 examples)
- `data/waltzrl/feedback_agent_training.jsonl` (1,000-2,000 examples)
- `scripts/validate_waltzrl_data.py` (100-150 lines)
- `reports/waltzrl_data_validation.md`

---

## TASK 4: Cost Monitoring Dashboard

### Objective
Track API costs in real-time to prevent budget overruns.

### Steps
1. **Create cost tracking script** (`scripts/track_costs.py`):
   ```python
   # Query Mistral API for usage statistics
   # Track costs per agent, per day, cumulative
   # Store in SQLite database (data/cost_tracking.db)
   # Generate daily cost report
   ```

2. **Set up alerts**:
   - Warning: $5 spent in a day
   - Critical: $15 total spent (50% of $30 budget)
   - Emergency: $25 total spent (83% of $30 budget)

3. **Create cost dashboard** (`reports/cost_dashboard.md`):
   - Auto-generated daily
   - Shows breakdown: Genesis (5 agents) vs WaltzRL (2 agents)
   - Forecast: estimated total cost based on current usage
   - Budget status: remaining credits

### Success Criteria
- ✅ Real-time cost tracking operational
- ✅ Alerts trigger at defined thresholds
- ✅ Dashboard updates daily

### Deliverables
- `scripts/track_costs.py` (150-200 lines)
- `data/cost_tracking.db` (SQLite database)
- `reports/cost_dashboard.md` (auto-generated)

---

## ESTIMATED TIMELINE

**Day 1 (Monday):**
- TASK 1: Benchmark all 5 models (4-6 hours)
- TASK 4: Cost monitoring setup (2-3 hours)

**Day 2 (Tuesday):**
- TASK 2: PII scrubbing + difficulty rebalancing (4-6 hours)

**Day 3 (Wednesday):**
- TASK 3: WaltzRL data preparation (4-6 hours)

**Day 4 (Thursday):**
- Review all deliverables
- Generate final launch readiness report

**Day 5 (Friday):**
- Deploy to staging if benchmarks validate
- Prepare for production launch (Week 3)

---

## SUCCESS METRICS

- ✅ All 5 Genesis models validated (≥8% improvement)
- ✅ Data quality issues resolved (0 PII, balanced difficulty)
- ✅ WaltzRL training data ready (2,000-4,000 examples)
- ✅ Cost tracking operational (within $30 budget)
- ✅ Launch readiness report complete

---

**PRIORITY ORDER:**
1. TASK 1 (Benchmarking) - HIGHEST PRIORITY - Blocks deployment decision
2. TASK 4 (Cost Monitoring) - CRITICAL - Prevents budget overruns
3. TASK 3 (WaltzRL Data) - HIGH - Enables next phase
4. TASK 2 (Data Cleanup) - MEDIUM - Quality improvement

**BLOCKERS:**
- None identified. All tasks can proceed in parallel.

**DEPENDENCIES:**
- WaltzRL fine-tuning (Week 3) depends on TASK 3 completion.
- Production deployment (Week 3) depends on TASK 1 validation.
