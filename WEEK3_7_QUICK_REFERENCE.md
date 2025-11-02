# Week 3-7 Implementation: GAP + Agent Lightning Quick Reference

**Full Analysis:** `/docs/research/GAP_AND_LIGHTNING_ANALYSIS.md` (69 KB, 1,802 lines)
**Executive Summary:** `/docs/research/GAP_LIGHTNING_EXECUTIVE_SUMMARY.md`

---

## Week 3: GAP Implementation (Codex + Cursor)

### What to Build
1. **HTDAG dependency analysis** - Identify task dependencies
2. **Topological sort** - Group tasks into parallel execution levels
3. **Batch router** - Execute independent tasks concurrently
4. **GAP prompts** - XML graph format with 6 function types

### Files to Create/Modify
```
Modified:
- /infrastructure/orchestration/htdag.py (+200 lines)
- /infrastructure/orchestration/halo.py (+100 lines)

New:
- /infrastructure/orchestration/gap_executor.py (~250 lines)
- /prompts/gap_orchestration_template.txt
- /tests/orchestration/test_gap_integration.py (150 tests)
```

### Success Metrics
- [ ] 32% latency reduction (168s vs 248s on multi-hop tasks)
- [ ] 25% token reduction (416 vs 554 tokens/response)
- [ ] 22% fewer tool invocations (1.78 vs 2.27 per task)
- [ ] 150/150 tests passing (100%)

### Feature Flag
```python
# /infrastructure/feature_flags.py
GAP_ENABLED = os.getenv("GAP_ENABLED", "false").lower() == "true"
```

**Rollout:** 0% → 10% → 50% → 100% over 7 days

---

## Week 4-5: Trace Collection (Thon + Cora)

### What to Build
1. **Trace logger** - OTEL → Agent Lightning format converter
2. **Trace validator** - Schema enforcement (JSON Schema)
3. **Reward functions** - 15 agent-specific reward designs
4. **Collection pipeline** - Automated trace recording

### Files to Create
```
New:
- /infrastructure/trace_logger.py (~300 lines)
- /infrastructure/trace_validator.py (~150 lines)
- /infrastructure/rl/reward_functions.py (~500 lines, 15 functions)
- /scripts/export_traces_to_lightning.py (~200 lines)
- /tests/trace/test_trace_logging.py (40 tests)
- /tests/rl/test_reward_functions.py (60 tests)
```

### Data Requirements
- **Target:** 2000 complete traces
- **Distribution:** 100+ traces per agent (15 agents)
- **Quality:** 50/50 success/failure split
- **Format:** JSON (Agent Lightning schema)

### Reward Function Template
```python
def reward_{agent_name}(prediction, ground_truth, metadata):
    """
    Multi-factor reward normalized to [0, 1].

    Components:
    - Correctness: 50-60% (task-specific metric)
    - Format: 20% (well-formed output)
    - Efficiency: 10-15% (latency penalty)
    - Safety: 10-15% (PII, hallucination checks)
    """
    r_correctness = compute_task_metric(prediction, ground_truth)
    r_format = 1.0 if is_well_formed(prediction) else 0.0
    r_efficiency = max(0, 1.0 - metadata["latency"] / threshold)
    r_safety = compute_safety_score(prediction)

    return (0.6 * r_correctness + 0.2 * r_format +
            0.1 * r_efficiency + 0.1 * r_safety)
```

---

## Week 6-7: RL Training + Deployment (Zenith + Forge)

### Week 6: Setup + Pilot Training

**Day 1-3: Installation**
```bash
# Install Agent Lightning
pip install agent-lightning

# Verify installation
agent-lightning --version

# Configure vLLM/SGLang backend
export AGENT_LIGHTNING_BACKEND=vllm
export VLLM_ENDPOINT=http://localhost:8000
```

**Day 4-7: Pilot Training (3 Agents)**
```bash
# Train QA Agent
agent-lightning train \
    --trace_dir /data/agent_lightning_traces/qa_agent \
    --task_type rag \
    --base_model llama-3.2-3b-instruct \
    --output_dir /models/agent_lightning/qa_agent \
    --learning_rate 1e-5 \
    --num_iterations 1500 \
    --batch_size 32

# Repeat for Analyst Agent, Support Agent
```

**Expected Results:**
- Steady reward improvement from iteration 200+
- Convergence by iteration 1200-1500
- ~10-15% performance boost over baseline

### Week 7: Full Training + Deployment

**Day 1-4: Train Remaining 12 Agents**
```bash
# Batch training script
for agent in analyst content legal marketing sales design builder deploy monitor security finance hr seo; do
    agent-lightning train \
        --trace_dir /data/agent_lightning_traces/${agent}_agent \
        --task_type auto \
        --base_model llama-3.2-3b-instruct \
        --output_dir /models/agent_lightning/${agent}_agent \
        --learning_rate 1e-5 \
        --num_iterations 1500 \
        --batch_size 32
done
```

**Day 5-7: E2E Validation + Rollout**
```bash
# Run full benchmark suite
pytest tests/rogue/scenarios/ -v --agents=all --use-rl-policies

# Expected: 270/270 passing, +15% avg performance

# Deploy to staging
./scripts/deploy_rl_policies_staging.sh

# Gradual production rollout
./scripts/rollout_rl_policies.sh --schedule=7day
```

---

## Quick Commands

### GAP Testing
```bash
# Unit tests
pytest tests/orchestration/test_gap_integration.py -v

# Performance validation
pytest tests/orchestration/test_gap_performance.py -v

# Enable in staging
export GAP_ENABLED=true
```

### Trace Collection
```bash
# Start collection
python scripts/collect_traces.py --agents=all --num_traces=2000

# Validate traces
python scripts/validate_traces.py --trace_dir /data/agent_lightning_traces

# Export to Lightning format
python scripts/export_traces_to_lightning.py \
    --input_dir /data/traces/otel \
    --output_dir /data/agent_lightning_traces
```

### RL Training
```bash
# Monitor training
tensorboard --logdir /logs/agent_lightning_training

# Resume from checkpoint
agent-lightning train \
    --checkpoint /models/agent_lightning/qa_agent/checkpoint-1000 \
    --num_iterations 2000

# Validate policy
python scripts/validate_rl_policy.py \
    --policy_path /models/agent_lightning/qa_agent \
    --benchmark_scenarios tests/rogue/scenarios/qa_agent_scenarios.yaml
```

---

## Integration Code Samples

### GAP Graph Execution
```python
# /infrastructure/orchestration/gap_executor.py
async def execute_gap_graph(graph: DAG) -> Dict[str, Any]:
    """Execute GAP graph with parallel task execution."""
    levels = topological_sort(graph)
    results = {}

    for level in levels:
        # Execute all tasks in this level concurrently
        level_results = await asyncio.gather(*[
            execute_task(task, results)  # Pass prior results
            for task in level
        ])

        # Update results dictionary
        for task, result in zip(level, level_results):
            results[task.id] = result

    return results
```

### Trace Logging
```python
# /infrastructure/trace_logger.py
class AgentTraceLogger:
    def log_llm_call(self, prompt: str, response: str, metadata: dict):
        """Log an LLM call as a span."""
        span = {
            "span_id": str(uuid4()),
            "span_type": "llm_call",
            "start_time": datetime.utcnow().isoformat(),
            "end_time": datetime.utcnow().isoformat(),
            "input": {"prompt": prompt},
            "output": {"response": response},
            "metadata": metadata
        }
        self.current_trace["spans"].append(span)
```

### RL Policy Loading
```python
# /infrastructure/rl/policy_loader.py
def load_rl_policy(agent_name: str) -> LLM:
    """Load RL-trained policy for an agent."""
    policy_path = f"/models/agent_lightning/{agent_name}_agent"

    if os.path.exists(policy_path):
        return load_model(policy_path)  # vLLM/SGLang
    else:
        # Fallback to baseline
        return load_base_model("llama-3.2-3b-instruct")
```

---

## Troubleshooting

### GAP Issues
**Problem:** Graph construction fails
**Solution:** Check prompt template format, ensure LLM understands XML syntax

**Problem:** Parallel execution slower than sequential
**Solution:** Check task granularity (too fine-grained = overhead), verify asyncio.gather() usage

**Problem:** Circular dependency detected
**Solution:** HTDAG already has cycle detection - review dependency analysis logic

### Trace Collection Issues
**Problem:** Traces missing spans
**Solution:** Ensure all LLM calls wrapped with trace_logger.log_llm_call()

**Problem:** Reward signals incorrect
**Solution:** Validate reward functions on known good/bad trajectories

**Problem:** Schema validation failures
**Solution:** Check JSON format, ensure all required fields present

### RL Training Issues
**Problem:** Training doesn't converge
**Solution:** Reduce learning rate (1e-5 → 5e-6), increase batch size (32 → 64)

**Problem:** Out of memory (OOM) on GPU
**Solution:** Reduce batch size (32 → 16), use gradient accumulation, or upgrade GPU

**Problem:** Policies regress quality
**Solution:** Check reward function design (may be rewarding wrong behavior), validate on benchmarks

---

## Budget Summary

| Item                     | Cost    | When     |
|--------------------------|---------|----------|
| GAP development          | $500    | Week 3   |
| Trace collection         | $1,050  | Week 4-5 |
| RL training              | $1,060  | Week 6-7 |
| GPU rental (A100, 120hr) | $60     | Week 6-7 |
| **Total**                | **$2,670** | **5 weeks** |

**Expected Savings (1 business):** $475/month
**Break-even:** 6 months (1 business), 1 month (1000 businesses)
**Annual ROI (1000 businesses):** $5.7M/year

---

## Sign-Off Checklist

### Week 3 (GAP)
- [ ] 150/150 tests passing
- [ ] 30%+ latency reduction validated
- [ ] Zero production incidents
- [ ] Feature flag + A/B testing operational
- [ ] Hudson approval: 9.0/10+

### Week 5 (Traces)
- [ ] 2000 traces collected
- [ ] 100% schema compliance
- [ ] 15 reward functions designed + tested
- [ ] Cora approval: 9.0/10+

### Week 7 (RL)
- [ ] 15 policies trained successfully
- [ ] 270/270 benchmark scenarios passing
- [ ] +15% avg performance improvement
- [ ] Alex (E2E) + Forge approval: 9.0/10+

---

**For detailed technical specifications, see:**
- `/docs/research/GAP_AND_LIGHTNING_ANALYSIS.md` (full 69 KB analysis)
- `/docs/research/GAP_LIGHTNING_EXECUTIVE_SUMMARY.md` (quick summary)
