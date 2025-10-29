# Week 2 RL Training Quick Start Guide

**For:** Thon/Cora/Hudson (Week 2 implementation)
**Date:** October 27, 2025
**Prepared By:** Oracle

---

## TL;DR - Run This First

```bash
# Day 1: Collect baseline (2 hours)
cd /home/genesis/genesis-rebuild
python scripts/collect_htdag_baseline.py

# Expected output:
# → data/htdag_benchmarks/baseline_results.json
# → Baseline metrics summary (success rate, depth, etc.)

# Day 1-2: Integrate AgentFlow (see Section 2 below)

# Day 2-3: Train (48-72 hours)
python infrastructure/htdag_rl_trainer.py

# Day 4: Evaluate (see Section 4 below)

# Day 5: Deploy (see Section 5 below)
```

---

## 1. Baseline Collection (Day 1 - 2 hours)

### Step 1: Run Script

```bash
cd /home/genesis/genesis-rebuild
python scripts/collect_htdag_baseline.py
```

### Step 2: Verify Output

```bash
cat data/htdag_benchmarks/baseline_results.json | jq '.aggregated_metrics'
```

**Expected Metrics:**
- Success Rate: 70-85%
- Mean Depth: 2-4 levels
- Mean Subtasks: 5-15
- Parallelism Ratio: 20-40%
- Mean Execution Time: 5-30s
- Mean LLM Calls: 5-15

### Step 3: Sanity Check

If success rate < 50% or > 95%, investigate HTDAG implementation.
Otherwise, proceed to AgentFlow integration.

---

## 2. AgentFlow Integration (Day 1-2 - 1 day)

### Current Status

`infrastructure/htdag_rl_trainer.py` has a STUB implementation:
- ✅ Environment complete
- ✅ Reward function complete
- ❌ Policy network (TODO: integrate AgentFlow)

### Integration Steps

**File:** `infrastructure/htdag_rl_trainer.py`

**Line 489-510:** Replace `_sample_action()` stub:

```python
# BEFORE (stub):
async def _sample_action(self, state: HTDAGState) -> HTDAGAction:
    # Random policy for stub
    decompose_further = np.random.random() > 0.5
    # ... random action generation

# AFTER (AgentFlow integration):
async def _sample_action(self, state: HTDAGState) -> HTDAGAction:
    from agentflow.agentflow.models.planner import Planner

    # Initialize AgentFlow planner (cache this!)
    if not hasattr(self, '_agentflow_planner'):
        self._agentflow_planner = Planner(
            llm_engine_name="gpt-4o-mini",  # Cheap for training
            toolbox_metadata={},  # No tools needed for HTDAG
            available_tools=[],
            verbose=False,
            temperature=0.7
        )

    # Generate decomposition decision using AgentFlow
    prompt = self._build_decomposition_prompt(state)
    response = await self._agentflow_planner.llm_engine(prompt)

    # Parse response into HTDAGAction
    action = self._parse_action_from_response(response, state)
    return action
```

**New Helper Methods to Add:**

```python
def _build_decomposition_prompt(self, state: HTDAGState) -> str:
    """Build prompt for AgentFlow planner."""
    return f"""You are a task decomposition expert.

Current task: {state.user_request}
Current DAG size: {len(state.current_dag) if state.current_dag else 0}
Steps taken: {state.step_count}

Decision: Should you decompose this task further, or is it ready for execution?

If decompose:
- Choose which task to decompose
- Generate 2-5 subtasks

Output JSON:
{{
  "decompose_further": true/false,
  "task_id": "id_to_decompose",
  "subtasks": [
    {{"task_id": "...", "task_type": "...", "description": "..."}}
  ]
}}
"""

def _parse_action_from_response(self, response: str, state: HTDAGState) -> HTDAGAction:
    """Parse LLM response into action."""
    try:
        parsed = json.loads(response)

        subtasks = [
            Task(
                task_id=s['task_id'],
                task_type=s.get('task_type', 'generic'),
                description=s['description']
            )
            for s in parsed.get('subtasks', [])
        ]

        return HTDAGAction(
            decompose_further=parsed.get('decompose_further', False),
            task_id=parsed.get('task_id', 'root'),
            subtasks=subtasks,
            confidence=0.8  # TODO: extract from LLM
        )
    except Exception as e:
        logger.error(f"Failed to parse action: {e}")
        # Fallback to safe action
        return HTDAGAction(
            decompose_further=False,
            task_id='root',
            subtasks=[],
            confidence=0.0
        )
```

### Flow-GRPO Integration (Advanced)

For full Flow-GRPO training (not just LLM-based policy):

**Reference:** AgentFlow's `train/train_with_logs.sh`

```python
# In HTDAGRLTrainer.__init__():
from agentflow.agentflow.verl import FlowGRPOTrainer

self.flow_grpo_trainer = FlowGRPOTrainer(
    config={
        'algorithm': {
            'kl_ctrl': {'kl_coef': 0.001},
            'adv_norm': True,
            'discount': 0.99
        },
        'trainer': {
            'total_epochs': 10,
            'n_gpus': 1
        }
    }
)
```

**Note:** This requires deeper integration with AgentFlow's training loop. Start with LLM-based policy first (simpler), then upgrade to Flow-GRPO if needed.

---

## 3. Training Execution (Day 2-3 - 2 days)

### Start Training

```bash
# Create tmux session (training runs for days)
tmux new -s htdag_training

# Activate venv
source venv/bin/activate

# Run training
python infrastructure/htdag_rl_trainer.py

# Detach from tmux: Ctrl+B then D
# Reattach: tmux attach -t htdag_training
```

### Monitor Training

**Check Logs:**
```bash
tail -f logs/htdag_rl_training_*.log
```

**Watch Metrics:**
- Reward curve should increase after epoch 3-5
- KL divergence should stay < 0.1 (stability)
- Policy loss should decrease
- Value loss should stabilize

**Red Flags:**
- Reward curve flatlines immediately → Reward function issue
- Reward curve oscillates wildly → Reduce learning rate (3e-4 → 1e-4)
- KL divergence > 0.5 → Training unstable, reduce PPO clip (0.2 → 0.1)

### Checkpoints

Saved every 1000 steps to:
```
checkpoints/htdag_rl/
├── global_step_1000/
├── global_step_2000/
└── best_model.pt
```

---

## 4. Evaluation (Day 4 - 4 hours)

### Load Best Checkpoint

```python
# In htdag_rl_trainer.py, add:
def load_best_checkpoint(self):
    checkpoint_path = 'checkpoints/htdag_rl/best_model.pt'
    self.load_checkpoint(checkpoint_path)
```

### Run Evaluation

```bash
python scripts/evaluate_htdag_trained.py
```

**Script to Create:**
```python
#!/usr/bin/env python3
"""Evaluate trained HTDAG model."""
import asyncio
from infrastructure.htdag_rl_trainer import HTDAGRLTrainer, create_benchmark_tasks
from infrastructure.htdag_planner import HTDAGPlanner

async def main():
    planner = HTDAGPlanner(llm_client=None)
    tasks = create_benchmark_tasks()

    trainer = HTDAGRLTrainer(planner, tasks)
    trainer.load_best_checkpoint()

    results = await trainer.evaluate()

    print("Evaluation Results:")
    print(f"Success Rate: {results['success_rate']*100:.1f}%")
    print(f"Mean Reward: {results['mean_reward']:.3f}")
    # ... print other metrics

if __name__ == "__main__":
    asyncio.run(main())
```

### Compare Baseline vs. Trained

```bash
python scripts/compare_baseline_trained.py
```

**Script to Create:**
```python
#!/usr/bin/env python3
"""Compare baseline and trained metrics."""
import json

# Load baseline
with open('data/htdag_benchmarks/baseline_results.json') as f:
    baseline = json.load(f)['aggregated_metrics']

# Load trained
with open('data/htdag_benchmarks/training_results.json') as f:
    trained = json.load(f)['aggregated_metrics']

# Compute improvements
print("Metric                  Baseline  Trained   Improvement")
print("="*60)
print(f"Success Rate            {baseline['success_rate']*100:.1f}%     {trained['success_rate']*100:.1f}%     {(trained['success_rate']/baseline['success_rate']-1)*100:+.1f}%")
print(f"Mean Depth              {baseline['mean_depth']:.2f}      {trained['mean_depth']:.2f}      {(trained['mean_depth']/baseline['mean_depth']-1)*100:+.1f}%")
# ... other metrics
```

### Statistical Significance

```python
from scipy import stats

# Compare success rates
baseline_successes = [1 if r['success'] else 0 for r in baseline_results]
trained_successes = [1 if r['success'] else 0 for r in trained_results]

t_stat, p_value = stats.ttest_ind(baseline_successes, trained_successes)
print(f"t-statistic: {t_stat:.3f}, p-value: {p_value:.4f}")

if p_value < 0.05:
    print("✅ Improvement is statistically significant!")
else:
    print("❌ Improvement not significant (p >= 0.05)")
```

---

## 5. Deployment (Day 5 - 2 hours)

### If Successful (>15% Improvement):

**Step 1: Save Trained Model**
```bash
cp checkpoints/htdag_rl/best_model.pt infrastructure/htdag_trained_policy.pt
```

**Step 2: Update HTDAG Planner**
```python
# In htdag_planner.py, add:
class HTDAGPlanner:
    def __init__(self, llm_client=None, use_trained_policy=False):
        self.llm_client = llm_client

        if use_trained_policy:
            self._load_trained_policy()

    def _load_trained_policy(self):
        # Load AgentFlow policy
        from agentflow.agentflow.models.planner import Planner
        self.trained_planner = Planner.from_checkpoint(
            'infrastructure/htdag_trained_policy.pt'
        )
```

**Step 3: Feature Flag**
```bash
# In .env
HTDAG_USE_TRAINED_POLICY=true
```

**Step 4: Integration Test**
```bash
pytest tests/test_htdag_planner.py --trained-policy
```

### If Marginal (5-10% Improvement):

**Root Cause Analysis:**
1. Is reward function misspecified? (check what agent optimized for)
2. Is training data insufficient? (try 10K episodes instead of 1K)
3. Is baseline already optimal? (compare to human-designed decompositions)

**Iterate:**
- Refine reward function based on failure modes
- Try supervised learning from expert traces
- Increase training episodes (10K → 100K)

### If Failed (<5% Improvement):

**Fallback Plan:**
1. Continue using baseline HTDAG (it's already good!)
2. Focus on improving LLM prompts instead of RL
3. Try imitation learning from expert demonstrations
4. Document lessons learned for future attempts

---

## 6. Troubleshooting

### Problem: Training doesn't converge

**Solution:**
- Reduce learning rate: 3e-4 → 1e-4
- Increase batch size: 32 → 64
- Add gradient clipping: max_grad_norm=1.0

### Problem: Reward hacking (agent exploits reward function)

**Solution:**
- Monitor intermediate metrics (not just reward)
- Add diversity bonus to encourage exploration
- Refine reward function to penalize exploits

### Problem: Out of memory

**Solution:**
- Reduce batch size: 32 → 16
- Use gradient accumulation: 4 steps
- Train on GPU instead of CPU

### Problem: Evaluation shows overfitting

**Solution:**
- Early stopping: Stop at epoch with best validation reward
- Regularization: Increase entropy coefficient (0.01 → 0.05)
- More training data: 100 → 1000 tasks

---

## 7. Key Files Reference

| File | Purpose | Status |
|------|---------|--------|
| `infrastructure/htdag_rl_trainer.py` | RL trainer (stub) | TODO: Integrate AgentFlow |
| `scripts/collect_htdag_baseline.py` | Baseline metrics | READY |
| `scripts/evaluate_htdag_trained.py` | Evaluation | TODO: Create |
| `scripts/compare_baseline_trained.py` | Comparison | TODO: Create |
| `docs/HTDAG_RL_EXPERIMENT_DESIGN.md` | Experiment design | REFERENCE |
| `docs/AGENTFLOW_SETUP_COMPLETE.md` | Setup summary | REFERENCE |

---

## 8. Contact & Resources

**Owner:** Oracle (Discovery Agent)
**AgentFlow Paper:** https://arxiv.org/abs/2510.05592
**AgentFlow GitHub:** https://github.com/lupantech/AgentFlow

**Questions?**
- Check experiment design doc (Section 9: Open Questions)
- Review AgentFlow training examples in `AgentFlow/train/`
- Consult Context7 MCP for API details

---

**READY TO START WEEK 2 TRAINING!**
