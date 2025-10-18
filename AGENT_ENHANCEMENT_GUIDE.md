# Agent Enhancement Guide: DAAO + TUMIX Integration

**Purpose:** Apply DAAO routing and TUMIX early termination to all Genesis agents
**Status:** 1/19 agents complete (Analyst Agent v4.0)
**Expected Impact:** 40-50% cost reduction per agent

---

## 📊 Enhancement Status

| Agent | Priority | DAAO | TUMIX | Status |
|-------|----------|------|-------|--------|
| **analyst_agent.py** | HIGH | ✅ | ✅ | ✅ COMPLETE |
| **qa_agent.py** | HIGH | ⏳ | ⏳ | 🔄 TODO |
| **content_agent.py** | HIGH | ❌ | ⏳ | 🔄 TODO |
| **marketing_agent.py** | MED | ❌ | ⏳ | 🔄 TODO |
| **spec_agent.py** | MED | ⏳ | ⏳ | 🔄 TODO |
| **darwin_agent.py** | MED | ❌ | ⏳ | 🔄 TODO |
| **builder_agent.py** | MED | ⏳ | ❌ | 🔄 TODO |
| All others (12) | LOW | ⏳ | ❌ | 🔄 TODO |

**Legend:**
- ✅ = Needs both DAAO + TUMIX
- ⏳ = Needs TUMIX only (iterative refinement)
- ❌ = May not benefit significantly

---

## 🚀 Quick Enhancement Template

### Step 1: Update Imports (Top of File)

```python
# Add after existing imports:
import logging
from infrastructure.daao_router import get_daao_router, RoutingDecision
from infrastructure.tumix_termination import (
    get_tumix_termination,
    RefinementResult,
    TerminationDecision
)

logger = logging.getLogger(__name__)
```

### Step 2: Enhance __init__ Method

```python
def __init__(self, business_id: str = "default"):
    self.business_id = business_id
    self.agent = None

    # Add DAAO router for cost optimization
    self.router = get_daao_router()

    # Add TUMIX for iterative refinement termination
    self.termination = get_tumix_termination(
        min_rounds=2,  # Adjust based on agent type
        max_rounds=4,  # Adjust based on agent type
        improvement_threshold=0.05  # 5% threshold
    )

    # Track refinement sessions for metrics
    self.refinement_history = []

    logger.info(f"{self.__class__.__name__} initialized with DAAO + TUMIX")
```

### Step 3: Add Helper Methods (End of Class)

```python
def route_task(self, task_description: str, priority: float = 0.5) -> RoutingDecision:
    """
    Route task to appropriate model using DAAO

    Args:
        task_description: Description of the task
        priority: Task priority (0.0-1.0)

    Returns:
        RoutingDecision with model selection and cost estimate
    """
    task = {
        'id': f'{self.__class__.__name__}-{datetime.now().strftime("%Y%m%d%H%M%S")}',
        'description': task_description,
        'priority': priority,
        'required_tools': []  # Add specific tools if needed
    }

    decision = self.router.route_task(task, budget_conscious=True)

    logger.info(
        f"Task routed: {decision.reasoning}",
        extra={
            'agent': self.__class__.__name__,
            'model': decision.model,
            'difficulty': decision.difficulty.value,
            'estimated_cost': decision.estimated_cost
        }
    )

    return decision

def get_cost_metrics(self) -> dict:
    """Get cumulative cost savings from DAAO and TUMIX"""
    if not self.refinement_history:
        return {
            'tumix_sessions': 0,
            'tumix_savings_percent': 0.0,
            'message': 'No refinement sessions recorded yet'
        }

    tumix_savings = self.termination.estimate_cost_savings(
        self.refinement_history,
        cost_per_round=0.001
    )

    return {
        'agent': self.__class__.__name__,
        'tumix_sessions': tumix_savings['sessions'],
        'tumix_baseline_rounds': tumix_savings['baseline_rounds'],
        'tumix_actual_rounds': tumix_savings['tumix_rounds'],
        'tumix_savings_percent': tumix_savings['savings_percent'],
        'tumix_total_saved': tumix_savings['savings'],
        'daao_info': 'DAAO routing automatically applied to all tasks'
    }
```

### Step 4 (Optional): Add Iterative Refinement Method

**For agents with iterative workflows (QA, Content, Marketing, Spec, Darwin):**

```python
async def refine_with_termination(
    self,
    task_type: str,
    initial_output: dict,
    quality_evaluator=None
) -> dict:
    """
    Perform iterative refinement with TUMIX early termination

    Args:
        task_type: Type of task being refined
        initial_output: Initial output to refine
        quality_evaluator: Function to evaluate quality (0.0-1.0)

    Returns:
        Best result with refinement history
    """
    results = []

    # Default quality evaluator
    if quality_evaluator is None:
        def default_evaluator(output):
            # Simple heuristic - customize per agent
            return 0.7  # Placeholder
        quality_evaluator = default_evaluator

    logger.info(f"Starting iterative refinement: {task_type}")

    for round_num in range(1, self.termination.max_rounds + 1):
        # Perform refinement (implement agent-specific logic)
        if round_num == 1:
            output = initial_output
        else:
            output = self._refine(results[-1].output, round_num)

        # Evaluate quality
        quality_score = quality_evaluator(output)

        # Record result
        result = RefinementResult(
            round_number=round_num,
            output=output,
            quality_score=quality_score,
            metadata={'task_type': task_type}
        )
        results.append(result)

        # Check termination
        decision = self.termination.should_stop(results, verbose=True)

        if decision.should_stop:
            logger.info(
                f"Refinement stopped at round {round_num}: {decision.reasoning}",
                extra={'reason': decision.reason.value}
            )
            break

    # Store session
    self.refinement_history.append(results)

    # Return best result
    best_result = max(results, key=lambda r: r.quality_score)

    return {
        'output': best_result.output,
        'quality_score': best_result.quality_score,
        'rounds_performed': len(results),
        'termination_reason': decision.reason.value if decision.should_stop else 'completed_all_rounds'
    }

def _refine(self, previous_output: dict, round_num: int) -> dict:
    """Refine output based on previous round (implement per agent)"""
    # Agent-specific refinement logic
    return previous_output
```

---

## 🎯 Agent-Specific Configuration

### High Priority Agents (DAAO + TUMIX)

#### **1. QA Agent**
- **Min rounds:** 2 (at least 2 test passes)
- **Max rounds:** 4 (testing has diminishing returns)
- **Threshold:** 0.03 (3% - tests improve incrementally)
- **Priority:** High (0.7-0.9 for integration tests)

#### **2. Content Agent**
- **Min rounds:** 2 (draft + first revision)
- **Max rounds:** 5 (content benefits from more refinement)
- **Threshold:** 0.05 (5% - standard)
- **Priority:** Medium (0.4-0.6 for most content)

#### **3. Spec Agent**
- **Min rounds:** 2 (initial spec + review)
- **Max rounds:** 4 (specifications need clarity)
- **Threshold:** 0.05 (5% - standard)
- **Priority:** High (0.7-0.8 for complex specs)

### Medium Priority Agents (TUMIX primarily)

#### **4. Marketing Agent**
- **Min rounds:** 2 (campaign draft + revision)
- **Max rounds:** 3 (marketing copy plateaus quickly)
- **Threshold:** 0.07 (7% - higher threshold)

#### **5. Darwin Agent**
- **Min rounds:** 3 (needs more evolution cycles)
- **Max rounds:** 10 (code evolution benefits from more iterations)
- **Threshold:** 0.02 (2% - sensitive to small improvements)

---

## 📝 Example: Analyst Agent (Reference Implementation)

See `/home/genesis/genesis-rebuild/agents/analyst_agent.py` for complete example.

**Key features:**
- ✅ DAAO routing for simple vs complex analysis
- ✅ TUMIX early termination for iterative analysis
- ✅ `route_analysis_task()` method
- ✅ `analyze_with_refinement()` method with quality evaluation
- ✅ `get_cost_metrics()` for tracking savings
- ✅ Full logging and observability

**Expected results:**
- 40-60% cost reduction on varied tasks (DAAO)
- 50-60% cost reduction on iterative analysis (TUMIX)
- Combined: 70-80% total cost reduction potential

---

## ✅ Verification Checklist

After enhancing an agent:

- [ ] Imports added (logging, daao_router, tumix_termination)
- [ ] `__init__` updated with router + termination + history
- [ ] `route_task()` method added
- [ ] `get_cost_metrics()` method added
- [ ] (Optional) `refine_with_termination()` method for iterative agents
- [ ] Version number updated in docstring (e.g., v4.0)
- [ ] Enhancement noted in docstring
- [ ] Logged initialization with DAAO + TUMIX message

---

## 🚀 Batch Enhancement Script

For rapid enhancement of remaining agents, use this pattern:

```bash
# Enhance multiple agents in parallel
for agent in qa_agent.py content_agent.py marketing_agent.py; do
    echo "Enhancing $agent..."
    # Apply template to agent file
done
```

---

## 📊 Expected Impact by Agent Type

| Agent Type | DAAO Savings | TUMIX Savings | Combined |
|------------|--------------|---------------|----------|
| **Analyst** | 40-50% | 50-60% | 70-80% |
| **QA** | 30-40% | 40-50% | 60-70% |
| **Content** | 20-30% | 50-60% | 60-70% |
| **Marketing** | 20-30% | 40-50% | 55-65% |
| **Spec** | 30-40% | 40-50% | 60-70% |
| **Darwin** | 10-20% | 60-70% | 65-75% |
| **Builder** | 40-50% | 10-20% | 50-60% |
| **Others** | 20-40% | 0-20% | 30-50% |

**Overall System:** Expected 50-70% cost reduction across all agent operations.

---

## 🎯 Next Steps

1. **Immediate:** Continue SE-Agent integration (Day 6-10)
2. **Parallel:** Apply this template to remaining 18 agents
3. **Testing:** Add integration tests for enhanced agents
4. **Monitoring:** Track actual cost savings in production

---

**Document Status:** Ready for parallel enhancement work
**Created:** October 16, 2025
**Reference Implementation:** analyst_agent.py (v4.0)
**Template Location:** This document
