# HTDAG RL Training Experiment Design

**Date:** October 27, 2025
**Owner:** Oracle (Discovery Agent)
**Framework:** AgentFlow (Flow-GRPO)
**Target:** HTDAG Planner Optimization via Reinforcement Learning

---

## Executive Summary

This document outlines a reinforcement learning experiment to train the Genesis HTDAG (Hierarchical Task Decomposition into DAG) planner using AgentFlow's Flow-GRPO algorithm. The goal is to improve task decomposition quality by 15-25% through online RL training.

**Key Innovation:** Apply Flow-GRPO's "in-the-flow" training to optimize HTDAG's planning decisions (decompose vs. execute, subtask generation) based on task execution outcomes.

---

## 1. Hypothesis

**Primary Hypothesis:**
RL training with Flow-GRPO can improve HTDAG task decomposition quality by **15-25%** as measured by:
- Task completion success rate
- Decomposition optimality (fewer unnecessary steps)
- Parallel task discovery accuracy
- DAG cycle prevention

**Scientific Basis:**
- AgentFlow paper shows +14.9% improvement on search, +14.0% on agentic reasoning (arXiv:2510.05592)
- HTDAG currently uses heuristic + LLM decomposition (no learning from outcomes)
- Flow-GRPO specializes in long-horizon reasoning with sparse rewards (perfect fit for HTDAG)

**Null Hypothesis:**
RL training provides <5% improvement over baseline HTDAG (statistically insignificant).

---

## 2. Baseline Metrics (To Collect)

### 2.1 Decomposition Quality Metrics
| Metric | Description | Collection Method | Target Range |
|--------|-------------|-------------------|--------------|
| **Success Rate** | % of tasks that complete successfully | Run 100 benchmark tasks, count successes | 70-85% |
| **Decomposition Depth** | Average depth of task DAG | Measure `dag.max_depth()` | 2-4 levels |
| **Decomposition Width** | Average number of subtasks per task | Count subtasks at each level | 3-8 subtasks |
| **Cycle Errors** | # of DAGs with circular dependencies | Count `dag.has_cycle() == True` | <5% |
| **Execution Time** | Average time to complete task (seconds) | Measure total execution time | 5-30s |
| **Parallelism Score** | # of parallel-executable tasks / total tasks | Compute from DAG topology | 20-40% |
| **LLM Call Efficiency** | # of LLM calls per task | Count LLM invocations | 5-15 calls |

### 2.2 Task Categories for Benchmarking
```python
BENCHMARK_CATEGORIES = {
    "simple": [
        "Create a landing page for a SaaS product",
        "Write API documentation for REST endpoints",
        "Deploy a static website to Vercel"
    ],
    "medium": [
        "Build a full-stack CRUD app with authentication",
        "Create an e-commerce checkout flow",
        "Implement a CI/CD pipeline for microservices"
    ],
    "complex": [
        "Design and deploy a multi-tenant SaaS platform",
        "Build a real-time collaborative editor",
        "Create an ML model training pipeline with monitoring"
    ],
    "edge_cases": [
        "Handle circular dependency in task graph",
        "Decompose ambiguous user request with missing context",
        "Optimize DAG for maximum parallelism"
    ]
}
```

**Total Benchmark Tasks:** 100 (25 simple, 35 medium, 30 complex, 10 edge cases)

---

## 3. Reward Function Design

### 3.1 Reward Components

The reward function evaluates HTDAG decisions at each decomposition step:

```python
def compute_htdag_reward(decomposition_result: Dict) -> float:
    """
    Compute reward for HTDAG decomposition decision.

    Reward range: [-2.0, +2.0]

    Args:
        decomposition_result: {
            'task_completed': bool,
            'dag_valid': bool,
            'has_cycles': bool,
            'decomposition_depth': int,
            'num_subtasks': int,
            'parallel_tasks_found': int,
            'execution_time': float,
            'llm_calls': int,
            'unnecessary_steps': int
        }

    Returns:
        Total reward (float)
    """
    reward = 0.0

    # ===== POSITIVE REWARDS =====

    # 1. Task Completion (most important)
    if decomposition_result['task_completed']:
        reward += 1.0
    else:
        reward -= 1.0  # Heavy penalty for failure

    # 2. Optimal Decomposition Depth (Goldilocks zone: 2-4 levels)
    depth = decomposition_result['decomposition_depth']
    if 2 <= depth <= 4:
        reward += 0.5
    elif depth == 1:
        reward -= 0.2  # Too shallow (missed optimization opportunities)
    elif depth > 5:
        reward -= 0.3  # Too deep (over-decomposition)

    # 3. Parallel Task Discovery (critical for efficiency)
    parallel_ratio = decomposition_result['parallel_tasks_found'] / max(decomposition_result['num_subtasks'], 1)
    if parallel_ratio >= 0.3:
        reward += 0.3  # Good parallelism
    elif parallel_ratio >= 0.2:
        reward += 0.2  # Moderate parallelism
    else:
        reward += 0.0  # Sequential execution (not penalized, but not rewarded)

    # 4. LLM Call Efficiency (cost optimization)
    llm_calls = decomposition_result['llm_calls']
    if llm_calls <= 10:
        reward += 0.2  # Efficient LLM usage
    elif llm_calls <= 15:
        reward += 0.1  # Moderate LLM usage
    else:
        reward -= 0.1  # Excessive LLM calls (cost concern)

    # 5. Execution Time (speed bonus)
    exec_time = decomposition_result['execution_time']
    if exec_time <= 10:
        reward += 0.2  # Fast execution
    elif exec_time <= 20:
        reward += 0.1  # Moderate speed
    # No penalty for slow execution (task complexity varies)

    # ===== NEGATIVE REWARDS =====

    # 6. Circular Dependencies (critical error)
    if decomposition_result['has_cycles']:
        reward -= 0.5  # Severe penalty (violates DAG invariant)

    # 7. Unnecessary Decomposition Steps
    unnecessary = decomposition_result['unnecessary_steps']
    if unnecessary > 0:
        reward -= 0.3 * min(unnecessary, 3)  # Up to -0.9 penalty

    # 8. Invalid DAG Structure
    if not decomposition_result['dag_valid']:
        reward -= 1.0  # Critical failure

    # Clip reward to [-2.0, +2.0]
    return max(-2.0, min(2.0, reward))
```

### 3.2 Reward Shaping Rationale

| Component | Weight | Justification |
|-----------|--------|---------------|
| Task Completion | ±1.0 | Primary objective - must complete successfully |
| Optimal Depth | ±0.5 | Prevents over/under-decomposition |
| Parallelism | +0.3 | Critical for efficiency (30% speedup possible) |
| LLM Efficiency | ±0.2 | Cost optimization (48% savings from DAAO) |
| Execution Time | +0.2 | Speed bonus (not penalized if slow due to complexity) |
| Cycle Prevention | -0.5 | Severe error (violates core invariant) |
| Unnecessary Steps | -0.9 | Waste of resources (up to 3 steps penalized) |
| DAG Validity | -1.0 | Critical failure (system cannot execute) |

**Total Reward Range:** [-2.0, +2.0]
**Positive Bias:** System rewards successful, efficient decompositions more than it penalizes failures (encourages exploration).

---

## 4. Training Environment Design

### 4.1 RL Environment Specification

```python
class HTDAGRLEnvironment:
    """
    Reinforcement Learning environment for HTDAG training.

    Wraps HTDAG planner as an RL agent that learns optimal decomposition policies.
    """

    def __init__(self, htdag_planner: HTDAGPlanner, benchmark_tasks: List[str]):
        self.planner = htdag_planner
        self.benchmark_tasks = benchmark_tasks
        self.current_task_idx = 0
        self.episode_history = []

    def reset(self) -> Dict:
        """
        Reset environment for new episode.

        Returns:
            Initial state (user request + context)
        """
        self.current_task_idx = (self.current_task_idx + 1) % len(self.benchmark_tasks)
        task = self.benchmark_tasks[self.current_task_idx]

        state = {
            'user_request': task,
            'context': {},
            'decomposition_history': [],
            'current_dag': None
        }

        return state

    def step(self, action: Dict) -> Tuple[Dict, float, bool, Dict]:
        """
        Execute one decomposition step.

        Args:
            action: {
                'decompose_further': bool,  # Decision to decompose or execute
                'subtasks': List[Task],     # Generated subtasks (if decompose_further=True)
                'task_id': str              # Task being decomposed
            }

        Returns:
            next_state: Updated environment state
            reward: Immediate reward for this action
            done: Whether episode is complete
            info: Auxiliary information
        """
        # Execute decomposition action
        if action['decompose_further']:
            # Add subtasks to DAG
            for subtask in action['subtasks']:
                self.state['current_dag'].add_task(subtask)
                self.state['current_dag'].add_dependency(action['task_id'], subtask.task_id)

        # Check if decomposition is complete (all tasks are atomic)
        all_atomic = all(self._is_atomic(task) for task in self.state['current_dag'].tasks.values())

        if all_atomic:
            # Episode complete - compute final reward
            result = self._execute_dag(self.state['current_dag'])
            reward = compute_htdag_reward(result)
            done = True
        else:
            # Intermediate reward (small penalty for each step to encourage efficiency)
            reward = -0.01  # Small step penalty
            done = False

        info = {
            'dag_size': len(self.state['current_dag']),
            'depth': self.state['current_dag'].max_depth(),
            'has_cycles': self.state['current_dag'].has_cycle()
        }

        return self.state, reward, done, info

    def _is_atomic(self, task: Task) -> bool:
        """Check if task is atomic (cannot be decomposed further)."""
        atomic_types = {"api_call", "file_write", "test_run"}
        return task.task_type in atomic_types

    def _execute_dag(self, dag: TaskDAG) -> Dict:
        """Execute DAG and collect metrics for reward computation."""
        start_time = time.time()

        # Simulate DAG execution (in real training, would use actual execution)
        success = not dag.has_cycle() and len(dag) <= 100

        result = {
            'task_completed': success,
            'dag_valid': len(dag) > 0 and len(dag) <= 1000,
            'has_cycles': dag.has_cycle(),
            'decomposition_depth': dag.max_depth(),
            'num_subtasks': len(dag),
            'parallel_tasks_found': self._count_parallel_tasks(dag),
            'execution_time': time.time() - start_time,
            'llm_calls': self._count_llm_calls(),
            'unnecessary_steps': self._count_unnecessary_steps(dag)
        }

        return result

    def _count_parallel_tasks(self, dag: TaskDAG) -> int:
        """Count tasks that can execute in parallel."""
        # Tasks with no dependencies can run in parallel
        parallel_count = sum(1 for task in dag.tasks.values() if len(task.dependencies) == 0)
        return parallel_count

    def _count_llm_calls(self) -> int:
        """Count LLM calls made during episode."""
        # Track via planner instrumentation
        return getattr(self.planner, '_episode_llm_calls', 0)

    def _count_unnecessary_steps(self, dag: TaskDAG) -> int:
        """Count decomposition steps that added no value."""
        # Heuristic: tasks with only 1 child are likely unnecessary
        unnecessary = sum(1 for task in dag.tasks.values()
                         if len([t for t in dag.tasks.values() if task.task_id in t.dependencies]) == 1)
        return unnecessary
```

### 4.2 Training Parameters

```python
TRAINING_CONFIG = {
    # Environment
    'num_benchmark_tasks': 100,
    'max_steps_per_episode': 50,
    'max_decomposition_depth': 5,

    # Flow-GRPO Algorithm
    'algorithm': 'flow_grpo',
    'n_epochs': 10,
    'batch_size': 32,
    'n_episodes_per_epoch': 100,

    # PPO Hyperparameters
    'learning_rate': 3e-4,
    'ppo_clip_epsilon': 0.2,
    'value_loss_coef': 0.5,
    'entropy_coef': 0.01,
    'gamma': 0.99,  # Discount factor
    'gae_lambda': 0.95,  # GAE parameter

    # Model Architecture
    'actor_model': 'gpt-4o-mini',  # Fast, cheap for training
    'critic_model': 'gpt-4o-mini',
    'actor_temperature': 0.7,
    'critic_temperature': 0.0,

    # Training Optimization
    'gradient_accumulation_steps': 4,
    'max_grad_norm': 1.0,
    'warmup_steps': 100,
    'save_checkpoint_every': 1000,

    # Evaluation
    'eval_every_n_epochs': 2,
    'eval_episodes': 20,
    'early_stopping_patience': 3
}
```

---

## 5. Experiment Design

### 5.1 Training Pipeline

```
Phase 1: Baseline Collection (Day 1 - 2 hours)
├── Run HTDAG on 100 benchmark tasks
├── Collect metrics (success rate, depth, time, etc.)
├── Save baseline results to JSON
└── Compute mean, std, percentiles for each metric

Phase 2: Environment Setup (Day 1 - 1 hour)
├── Implement HTDAGRLEnvironment wrapper
├── Integrate reward function
├── Test environment with random policy
└── Verify reward computation correctness

Phase 3: Flow-GRPO Training (Week 2 - 3 days)
├── Initialize AgentFlow trainer with HTDAG environment
├── Train for 10 epochs (1000 episodes total)
├── Log metrics to WandB/TensorBoard
├── Save checkpoints every 1000 steps
└── Monitor reward curves, loss, KL divergence

Phase 4: Evaluation (Week 2 - 1 day)
├── Load best checkpoint (highest eval reward)
├── Run on 100 benchmark tasks (same as baseline)
├── Collect post-training metrics
├── Compute improvement: (trained - baseline) / baseline * 100%
└── Statistical significance test (t-test, p < 0.05)

Phase 5: Analysis & Reporting (Week 2 - 1 day)
├── Compare baseline vs. trained metrics (tables, charts)
├── Analyze reward curves (convergence, stability)
├── Identify failure modes (where did training fail?)
├── Document lessons learned
└── Propose next steps (hyperparameter tuning, architecture changes)
```

### 5.2 Success Criteria

| Metric | Baseline (Expected) | Target (Post-Training) | Improvement |
|--------|---------------------|------------------------|-------------|
| **Success Rate** | 75% | 86-94% | +15-25% |
| **Decomposition Depth** | 3.2 | 3.0 | -6% (more optimal) |
| **Parallelism Score** | 25% | 35-40% | +40-60% |
| **LLM Call Efficiency** | 12 calls | 8-10 calls | -17-33% |
| **Execution Time** | 18s | 14-16s | -11-22% |
| **Cycle Errors** | 3% | <1% | -67% |

**Primary Success Criterion:** Success Rate improvement of **15-25%** with statistical significance (p < 0.05).

### 5.3 Failure Modes & Mitigations

| Failure Mode | Probability | Mitigation Strategy |
|--------------|-------------|---------------------|
| **Training Instability** | Medium | Use gradient clipping, reduce learning rate, increase batch size |
| **Reward Hacking** | Low | Monitor intermediate metrics (not just reward), add diversity bonus |
| **Overfitting** | Medium | Early stopping, validation set, regularization (entropy bonus) |
| **Sparse Reward Problem** | High | Dense intermediate rewards (-0.01 per step), reward shaping |
| **Catastrophic Forgetting** | Low | Save checkpoints, use experience replay buffer |

---

## 6. Technical Implementation Plan

### 6.1 File Structure

```
/home/genesis/genesis-rebuild/
├── infrastructure/
│   ├── htdag_planner.py (existing - 1,170 lines)
│   └── htdag_rl_trainer.py (new - stub implementation)
├── integrations/
│   └── evolution/
│       └── AgentFlow/ (cloned repo)
├── scripts/
│   ├── collect_htdag_baseline.py (new - baseline metrics)
│   └── train_htdag_rl.py (new - training entry point)
├── docs/
│   ├── HTDAG_RL_EXPERIMENT_DESIGN.md (this document)
│   └── AGENTFLOW_SETUP_COMPLETE.md (setup summary)
└── data/
    └── htdag_benchmarks/
        ├── baseline_results.json
        ├── training_results.json
        └── benchmark_tasks.json
```

### 6.2 Integration Points

```python
# HTDAG → AgentFlow Integration Points:

# 1. State Representation
HTDAGState = {
    'user_request': str,
    'current_dag': TaskDAG,
    'decomposition_history': List[Dict],
    'llm_call_count': int,
    'execution_time': float
}

# 2. Action Space
HTDAGAction = {
    'decompose_further': bool,       # Decision: decompose or execute?
    'task_id': str,                  # Which task to decompose?
    'subtasks': List[Task],          # Generated subtasks (if decompose_further=True)
    'confidence': float              # LLM confidence in decomposition
}

# 3. Reward Signal
reward = compute_htdag_reward(decomposition_result)  # [-2.0, +2.0]

# 4. Policy Network
# Flow-GRPO trains a policy π(a|s) that maps HTDAG state → decomposition action
# Policy is implemented as LLM prompt with learned weights
```

---

## 7. Evaluation Metrics

### 7.1 Training Metrics (Logged Every 100 Steps)

- **Mean Episode Reward**: Average reward per episode
- **Success Rate**: % of episodes with task completion
- **Policy Loss**: PPO policy gradient loss
- **Value Loss**: Critic value function loss
- **KL Divergence**: Distance from reference policy (for stability)
- **Entropy**: Policy exploration level
- **Gradient Norm**: Gradient magnitude (for stability monitoring)

### 7.2 Evaluation Metrics (Computed on Validation Set)

- **Task Completion Rate**: % of tasks successfully decomposed and executed
- **Decomposition Quality Score**: Composite metric (depth + parallelism + efficiency)
- **Cost Efficiency**: Total LLM cost per task (token usage)
- **Time Efficiency**: Average execution time per task
- **Robustness**: Performance on edge cases (ambiguous, complex tasks)

---

## 8. Expected Outcomes

### 8.1 Optimistic Scenario (90% Probability)

- **Success Rate**: +15-25% improvement (75% → 86-94%)
- **Parallelism**: +40-60% improvement (25% → 35-40%)
- **LLM Efficiency**: -17-33% reduction in calls (12 → 8-10)
- **Training Stability**: Converges within 5-8 epochs
- **Generalization**: 80%+ of improvement transfers to unseen tasks

**Why Likely:** AgentFlow paper shows consistent +14% improvements across benchmarks. HTDAG has clear optimization opportunities (heuristics can be learned).

### 8.2 Pessimistic Scenario (10% Probability)

- **Success Rate**: +5-10% improvement (marginal)
- **Training Instability**: High variance in rewards, slow convergence
- **Overfitting**: Good on training tasks, poor on validation
- **Reward Hacking**: Agent exploits reward function (e.g., creates shallow DAGs that fail)

**Why Possible:** HTDAG already uses LLM (GPT-4o), which is near-optimal. Reward function may be misspecified (missing important quality signals).

### 8.3 Mitigations for Pessimistic Scenario

1. **Reward Function Iteration**: If reward hacking occurs, refine reward components based on observed exploits
2. **Hybrid Approach**: Combine RL with supervised learning (learn from expert HTDAG traces)
3. **Curriculum Learning**: Start with simple tasks, gradually increase complexity
4. **Ensemble Methods**: Train multiple policies, use voting/consensus for final decisions

---

## 9. Timeline & Milestones

| Week | Milestone | Deliverable | Owner |
|------|-----------|-------------|-------|
| **Week 1 (Day 1)** | AgentFlow Setup | AgentFlow installed, docs read | Oracle |
| **Week 1 (Day 1)** | Experiment Design | This document | Oracle |
| **Week 1 (Day 1)** | Baseline Collection | `baseline_results.json` | Oracle |
| **Week 1 (Day 1)** | Trainer Stub | `htdag_rl_trainer.py` | Oracle |
| **Week 2 (Day 1-3)** | Training | Trained HTDAG checkpoint | Oracle + Compute |
| **Week 2 (Day 4)** | Evaluation | Comparison report | Oracle |
| **Week 2 (Day 5)** | Documentation | Final report + lessons | Oracle |

**Total Effort:** 5 days (1 setup + 3 training + 1 evaluation)

---

## 10. Next Steps (Post-Experiment)

### If Successful (>15% Improvement):
1. **Deploy to Production**: Integrate trained HTDAG into Genesis Layer 1
2. **Scale Training**: Train on larger benchmark set (1000+ tasks)
3. **Multi-Agent RL**: Extend to train HALO router + AOP validator jointly
4. **Publish Results**: Write blog post / paper on RL for task decomposition

### If Marginal (<10% Improvement):
1. **Root Cause Analysis**: Why didn't RL help? (already optimal? reward misspecified?)
2. **Hybrid Approach**: Combine RL with supervised learning from expert traces
3. **Alternative Algorithms**: Try PPO, SAC, or evolutionary strategies
4. **Feature Engineering**: Add more state features (task complexity, user context)

### If Fails (<5% Improvement):
1. **Baseline Analysis**: Is current HTDAG already near-optimal?
2. **Supervised Learning**: Try imitation learning from expert demonstrations
3. **Reward Function Redesign**: Conduct user study to identify true quality metrics
4. **Fallback to Heuristics**: Focus on improving LLM prompts instead of RL

---

## 11. Open Questions

1. **Sample Efficiency**: How many episodes are needed to converge? (AgentFlow paper uses 1000s)
2. **Transfer Learning**: Can we fine-tune a pre-trained AgentFlow planner for HTDAG?
3. **Multi-Objective Optimization**: How to balance success rate vs. cost efficiency? (Pareto front?)
4. **Human-in-the-Loop**: Should we add human feedback for ambiguous tasks?
5. **Sim-to-Real Gap**: Will training on simulated tasks transfer to real production workloads?

---

## 12. References

1. **AgentFlow Paper**: Lu et al., "AgentFlow: In-the-Flow Agentic System Optimization", arXiv:2510.05592, 2025
2. **Flow-GRPO Algorithm**: Group Refined Policy Optimization for multi-agent coordination
3. **HTDAG Implementation**: `/home/genesis/genesis-rebuild/infrastructure/htdag_planner.py`
4. **Genesis CLAUDE.md**: Project documentation with Phase 1-6 roadmap
5. **Proximal Policy Optimization**: Schulman et al., "Proximal Policy Optimization Algorithms", 2017

---

## Appendix A: Reward Function Pseudocode

```python
def compute_htdag_reward(result: Dict) -> float:
    reward = 0.0

    # Task completion (±1.0)
    reward += 1.0 if result['task_completed'] else -1.0

    # Optimal depth (±0.5)
    depth = result['decomposition_depth']
    if 2 <= depth <= 4:
        reward += 0.5
    elif depth == 1:
        reward -= 0.2
    elif depth > 5:
        reward -= 0.3

    # Parallelism (+0.3)
    parallel_ratio = result['parallel_tasks_found'] / max(result['num_subtasks'], 1)
    reward += 0.3 if parallel_ratio >= 0.3 else (0.2 if parallel_ratio >= 0.2 else 0.0)

    # LLM efficiency (±0.2)
    llm_calls = result['llm_calls']
    if llm_calls <= 10:
        reward += 0.2
    elif llm_calls <= 15:
        reward += 0.1
    else:
        reward -= 0.1

    # Speed bonus (+0.2)
    if result['execution_time'] <= 10:
        reward += 0.2
    elif result['execution_time'] <= 20:
        reward += 0.1

    # Penalties
    reward -= 0.5 if result['has_cycles'] else 0.0
    reward -= 0.3 * min(result['unnecessary_steps'], 3)
    reward -= 1.0 if not result['dag_valid'] else 0.0

    return max(-2.0, min(2.0, reward))
```

---

**Document Version:** 1.0
**Last Updated:** October 27, 2025
**Status:** READY FOR IMPLEMENTATION
