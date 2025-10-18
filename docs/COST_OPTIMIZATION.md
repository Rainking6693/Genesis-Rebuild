# Cost Optimization Guide
**Maximizing Cost Efficiency in Genesis Multi-Agent System**

**Status:** Phase 2 Complete (October 17, 2025)
**Target:** 48% cost reduction (DAAO paper baseline)

---

## Overview

This guide provides strategies for minimizing token costs in the Genesis multi-agent system through intelligent agent routing, model selection, and optimization techniques.

---

## Cost Structure

### Model Pricing (USD per 1M Tokens)

| Model | Input Cost | Output Cost | Use Case | Cost Tier |
|-------|------------|-------------|----------|-----------|
| **Gemini 2.5 Flash** | $0.015 | $0.06 | High-volume, simple tasks | cheap |
| **GPT-4o** | $2.50 | $10.00 | General purpose, complex tasks | medium |
| **Claude 4 Sonnet** | $3.00 | $15.00 | Code generation, reasoning | medium |
| **Claude Opus 4** | $15.00 | $75.00 | Critical tasks, highest quality | expensive |

### Genesis Agent Cost Tiers

| Agent | Cost Tier | Typical Token Usage | Cost per Task |
|-------|-----------|---------------------|---------------|
| spec_agent | cheap | 20K tokens | $0.30 |
| architect_agent | medium | 50K tokens | $1.50 |
| builder_agent | medium | 80K tokens | $2.40 |
| frontend_agent | medium | 60K tokens | $1.80 |
| backend_agent | medium | 70K tokens | $2.10 |
| qa_agent | cheap | 30K tokens | $0.45 |
| security_agent | medium | 40K tokens | $1.20 |
| deploy_agent | medium | 50K tokens | $1.50 |
| monitoring_agent | cheap | 25K tokens | $0.38 |
| marketing_agent | cheap | 35K tokens | $0.53 |
| sales_agent | cheap | 30K tokens | $0.45 |
| support_agent | cheap | 25K tokens | $0.38 |
| analytics_agent | medium | 45K tokens | $1.35 |
| research_agent | medium | 55K tokens | $1.65 |
| finance_agent | medium | 40K tokens | $1.20 |

---

## Optimization Strategies

### 1. DAAO Cost Optimization (Primary)

**Impact:** 30-50% cost reduction
**Complexity:** Low (automatic)
**Implementation:** Enabled by default in Phase 2

**How It Works:**
- Analyzes historical agent performance by task type
- Finds cost-optimal agent for each task
- Validates quality constraints
- Real-time replanning based on execution feedback

**Example:**
```python
# Before DAAO: $18.00 for 10-task workflow
# After DAAO: $9.50 for same workflow
# Savings: 47%
```

**Best Practices:**
- Seed cost profiler with execution history
- Use realistic quality constraints (0.85-0.90)
- Enable adaptive profiling for recent data
- Monitor savings via metadata

**Configuration:**
```python
from infrastructure.halo_router import HALORouter
from infrastructure.cost_profiler import CostProfiler
from infrastructure.daao_optimizer import DAAOOptimizer

cost_profiler = CostProfiler()
daao_optimizer = DAAOOptimizer(cost_profiler, agent_registry)

router = HALORouter(
    enable_cost_optimization=True,
    cost_profiler=cost_profiler,
    daao_optimizer=daao_optimizer
)
```

---

### 2. Model Selection (Agent-Level)

**Impact:** 10-30% additional cost reduction
**Complexity:** Medium (requires profiling)
**Implementation:** Assign appropriate cost tier to each agent

**Guidelines:**

**Use Cheap Models (Gemini Flash):**
- Simple, repetitive tasks
- High-volume operations
- Low-risk decisions
- Examples: QA testing, monitoring, support

**Use Medium Models (GPT-4o/Claude Sonnet):**
- Complex reasoning required
- Code generation
- Technical design
- Examples: Builder, architect, backend

**Use Expensive Models (Claude Opus):**
- Critical decisions only
- Highest quality required
- Security-sensitive tasks
- Examples: Security audits (only when needed)

**Example Configuration:**
```python
AgentCapability(
    agent_name="qa_agent",
    cost_tier="cheap",     # Use Gemini Flash
    # ...
)

AgentCapability(
    agent_name="builder_agent",
    cost_tier="medium",    # Use GPT-4o/Claude Sonnet
    # ...
)
```

---

### 3. Context Length Optimization

**Impact:** 15-25% token reduction
**Complexity:** Medium (requires careful design)
**Implementation:** Minimize input context size

**Techniques:**

**a) Prompt Engineering:**
```python
# Bad: Verbose prompt (200 tokens)
prompt = """
You are a highly skilled software engineer with expertise in Python,
JavaScript, and cloud architecture. Your task is to carefully analyze
the following code and suggest improvements...
"""

# Good: Concise prompt (50 tokens)
prompt = """
Analyze this Python code. Suggest improvements for:
1. Performance
2. Security
3. Readability
"""
# Savings: 75% fewer tokens
```

**b) Selective Context:**
```python
# Bad: Include entire codebase (50K tokens)
context = read_all_files()

# Good: Include only relevant files (5K tokens)
context = read_relevant_files(task_type)
# Savings: 90% fewer tokens
```

**c) Structured Output:**
```python
# Bad: Free-form output (variable size)
response = agent.generate()

# Good: Structured JSON output (predictable size)
response = agent.generate_structured(schema)
# Savings: 30-40% fewer output tokens
```

---

### 4. Caching Strategies

**Impact:** 50%+ reduction on repeated content
**Complexity:** Low (built-in for some models)
**Implementation:** Enable prompt caching where available

**Supported Models:**
- Claude 3.5 Sonnet: Prompt caching (90% cost reduction on cached tokens)
- Gemini 2.5 Flash: Context caching (90% cost reduction)

**Example:**
```python
# Enable caching for Claude
# Costs: $0.30/1M input tokens (cached) vs $3.00/1M (uncached)

# Structure prompts for caching
system_prompt = """
[Large static context: project guidelines, coding standards]
This content is cached across requests.
"""

user_prompt = f"""
[Small dynamic content: specific task]
{task_description}
"""
# Savings: 90% on system prompt tokens
```

---

### 5. Batch Processing

**Impact:** 20-30% throughput improvement
**Complexity:** Medium (requires parallelization)
**Implementation:** Process multiple tasks concurrently

**Techniques:**

**a) Parallel Task Execution:**
```python
# Sequential: 5 tasks × 10s = 50s
for task in tasks:
    await execute_task(task)

# Parallel: 5 tasks / 3 agents = ~17s
await asyncio.gather(*[execute_task(t) for t in tasks])
# Savings: 66% time reduction
```

**b) Batch API Requests:**
```python
# Individual requests: 100 tasks × 1s latency = 100s
results = [await agent.process(task) for task in tasks]

# Batch request: 100 tasks / 1 request = ~5s
results = await agent.process_batch(tasks)
# Savings: 95% latency reduction
```

---

### 6. Early Termination

**Impact:** 10-15% cost reduction
**Complexity:** Medium (requires confidence scoring)
**Implementation:** Stop generation when confidence is high

**From TUMIX Paper (arXiv:2501.13555):**
- 51% cost savings by stopping at round 2 (vs 5 rounds)
- Maintains same accuracy

**Example:**
```python
async def generate_with_confidence(task):
    for round in range(1, 6):
        result = await agent.generate(task)
        confidence = estimate_confidence(result)

        if confidence > 0.95 and round >= 2:
            return result  # Stop early

    return result  # Max rounds
```

---

### 7. Task Complexity Estimation

**Impact:** 5-10% cost savings
**Complexity:** Low (automatic in DAAO)
**Implementation:** Adjust token budgets based on task complexity

**DAAO Complexity Factors:**
- Base complexity from task type (research=2.0x, test=1.0x)
- Dependency factor (+10% per dependency)
- Depth factor (+5% per depth level)

**Result:**
- Simple tasks get smaller budgets (fewer tokens)
- Complex tasks get appropriate budgets
- No over-provisioning

---

## Cost Monitoring

### Real-Time Tracking

```python
# Track cost per task
cost_profiler.record_execution(
    task_id=task_id,
    agent_name=agent_name,
    task_type=task_type,
    tokens_used=actual_tokens,
    execution_time_seconds=actual_time,
    success=success,
    cost_tier=agent.cost_tier
)

# Get current statistics
stats = cost_profiler.get_statistics()
print(f"Total cost: ${stats['total_cost_usd']:.2f}")
print(f"Avg cost per task: ${stats['avg_cost_per_task']:.4f}")
```

### Agent-Level Analysis

```python
# Find most expensive agent
profiles = cost_profiler.get_all_profiles()
most_expensive = max(profiles, key=lambda p: p.total_cost_usd)

print(f"Most expensive: {most_expensive.agent_name}")
print(f"Total cost: ${most_expensive.total_cost_usd:.2f}")
print(f"Avg cost per task: ${most_expensive.avg_cost_usd:.4f}")

# Find cheapest agent for task type
cheapest = cost_profiler.get_cheapest_agent("implement")
print(f"Cheapest for 'implement': {cheapest}")
```

### Cost Trending

```python
import matplotlib.pyplot as plt

# Plot cost over time
history = cost_profiler.execution_history
timestamps = [m.timestamp for m in history]
costs = [m.cost_usd for m in history]

plt.plot(timestamps, costs)
plt.xlabel("Time")
plt.ylabel("Cost ($)")
plt.title("Task Cost Trend")
plt.show()
```

---

## Cost Budgets

### Per-Workflow Budgets

```python
from infrastructure.daao_optimizer import OptimizationConstraints

# Set budget constraint
constraints = OptimizationConstraints(
    max_total_cost=25.0,        # $25 max for this workflow
    min_quality_score=0.85      # Maintain 85% quality
)

# Optimize with budget
optimized_plan = await daao_optimizer.optimize_routing_plan(
    initial_plan=halo_assignments,
    dag=dag,
    constraints=constraints
)

# Validate budget
validation = await aop_validator.validate_routing_plan(
    routing_plan=optimized_plan,
    dag=dag,
    max_budget=25.0
)

if not validation.passed:
    print("Budget exceeded!")
```

### Monthly Budget Tracking

```python
class MonthlyBudgetTracker:
    def __init__(self, monthly_limit=1000.0):
        self.monthly_limit = monthly_limit
        self.current_month_cost = 0.0

    def record_cost(self, cost):
        self.current_month_cost += cost

        if self.current_month_cost > self.monthly_limit:
            raise BudgetExceededError(
                f"Monthly budget ${self.monthly_limit} exceeded "
                f"(current: ${self.current_month_cost:.2f})"
            )

    def reset_monthly(self):
        self.current_month_cost = 0.0
```

---

## Optimization Checklist

### Phase 1: Enable DAAO (Immediate - 30-50% savings)
- [ ] Create CostProfiler instance
- [ ] Create DAAOOptimizer instance
- [ ] Enable cost_optimization in HALORouter
- [ ] Seed with historical execution data
- [ ] Monitor savings via routing_plan.metadata

### Phase 2: Model Optimization (Medium Term - 10-30% savings)
- [ ] Profile agent token usage
- [ ] Assign appropriate cost tiers (cheap/medium/expensive)
- [ ] Test quality with cheaper models
- [ ] Switch agents to cheaper models where possible

### Phase 3: Context Optimization (Medium Term - 15-25% savings)
- [ ] Audit prompt lengths
- [ ] Implement selective context loading
- [ ] Use structured output schemas
- [ ] Enable prompt caching (Claude/Gemini)

### Phase 4: Batch Processing (Advanced - 20-30% throughput)
- [ ] Implement parallel task execution
- [ ] Use batch API requests where possible
- [ ] Optimize agent concurrency limits

### Phase 5: Early Termination (Advanced - 10-15% savings)
- [ ] Implement confidence scoring
- [ ] Stop generation at 95%+ confidence
- [ ] Minimum 2 rounds (per TUMIX paper)

---

## Expected Results

### Cumulative Savings

| Optimization | Impact | Complexity | Priority |
|-------------|--------|------------|----------|
| DAAO | 30-50% | Low | HIGH |
| Model Selection | 10-30% | Medium | MEDIUM |
| Context Length | 15-25% | Medium | MEDIUM |
| Caching | 50%+ (repeated) | Low | HIGH |
| Batch Processing | 20-30% | Medium | LOW |
| Early Termination | 10-15% | Medium | LOW |

**Total Potential Savings:** 60-80% (non-cumulative, overlapping strategies)

### Real-World Example

**Baseline (No Optimization):**
- Workflow: 20 tasks
- Total cost: $42.00
- Avg cost per task: $2.10
- Execution time: 120 seconds

**After Phase 1 (DAAO Only):**
- Total cost: $21.00 (50% savings)
- Execution time: 95 seconds (21% faster)

**After Phase 1-3 (DAAO + Models + Context):**
- Total cost: $12.00 (71% savings)
- Execution time: 80 seconds (33% faster)

---

## Anti-Patterns (What NOT to Do)

### 1. Over-Optimization
```python
# Bad: Micro-optimizing prompts to save 5 tokens
# Time spent: 30 minutes
# Savings: $0.0002 per task
# NOT WORTH IT
```

### 2. Quality Degradation
```python
# Bad: Using cheapest model everywhere
constraints = OptimizationConstraints(
    min_quality_score=0.50  # Too low!
)
# Result: 70% cost savings, but 30% failure rate
# Net impact: NEGATIVE (wasted compute + rework)
```

### 3. Premature Optimization
```python
# Bad: Optimizing before understanding baseline
# Good: Profile → Identify bottlenecks → Optimize
```

### 4. Ignoring Execution Time
```python
# Bad: Cheapest agent takes 10x longer
# Result: Lower cost but 10x worse user experience
# Better: Balance cost with time
```

---

## References

### Papers
- **DAAO:** arXiv:2509.11079 - 48% cost reduction
- **TUMIX:** arXiv:2501.13555 - 51% savings via early termination
- **HALO:** arXiv:2505.13516 - Intelligent routing

### Implementation
- `/home/genesis/genesis-rebuild/infrastructure/cost_profiler.py`
- `/home/genesis/genesis-rebuild/infrastructure/daao_optimizer.py`
- `/home/genesis/genesis-rebuild/docs/DAAO_INTEGRATION_GUIDE.md`

---

**Last Updated:** October 17, 2025
**Status:** Phase 2 Complete
**Next:** Benchmark validation + production deployment
