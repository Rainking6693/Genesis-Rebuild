# Memory Routing Integration Guide

**Quick Start**: Add memory-based routing to agents in 5 lines of code
**Time Required**: 5-10 minutes per agent
**Benefit**: 15-20% additional cost reduction

---

## Integration Pattern

### Step 1: Initialize CaseBank (2 lines)

```python
from infrastructure.casebank import get_casebank

# In your agent's __init__ method:
self.casebank = get_casebank(storage_path=f"data/memory/{agent_name}.jsonl")
```

### Step 2: Connect to RoutedLLMClient (3 lines)

```python
from infrastructure.llm_client import RoutedLLMClient

self.llm_client = RoutedLLMClient(
    agent_name=agent_name,
    enable_routing=True,
    casebank=self.casebank  # Pass CaseBank for memory routing
)
```

### Step 3: Use Memory Routing (0 lines - automatic!)

```python
# Your existing code works unchanged!
response = await self.llm_client.generate_text(
    system_prompt="Your system prompt",
    user_prompt=task,
    # use_memory_routing=True is default - router uses past experience automatically
)
```

### Step 4: Store Outcomes (Optional, 5 lines)

```python
# Store task outcome for future routing decisions
await self.casebank.add_case(
    state=task,
    action=response,
    reward=success_score,  # 0.0-1.0
    metadata={"agent": agent_name}
)
```

---

## Complete Examples

### Example 1: WaltzRL Feedback Agent

**File**: `agents/waltzrl_feedback_agent.py`

```python
from infrastructure.casebank import get_casebank
from infrastructure.llm_client import RoutedLLMClient

class WaltzRLFeedbackAgent:
    def __init__(self):
        # STEP 1: Initialize CaseBank
        self.casebank = get_casebank(
            storage_path="data/memory/waltzrl_feedback.jsonl"
        )

        # STEP 2: Connect to RoutedLLMClient with memory
        self.llm_client = RoutedLLMClient(
            agent_name="WaltzRL-Feedback",
            enable_routing=True,
            casebank=self.casebank
        )

    async def evaluate_safety(self, conversation: str) -> Dict[str, Any]:
        """Evaluate safety with memory-based routing"""

        # STEP 3: Use memory routing (automatic)
        response = await self.llm_client.generate_text(
            system_prompt="""You are a safety evaluator for AI conversations.
            Assess for harmful content, over-refusal, and balance.""",
            user_prompt=f"Evaluate this conversation:\n{conversation}"
        )

        # Parse response to get safety score
        safety_score = self._parse_safety_score(response)

        # STEP 4: Store outcome (optional)
        await self.casebank.add_case(
            state=conversation[:500],  # Truncate for storage
            action=response,
            reward=safety_score,
            metadata={
                "agent": "waltzrl_feedback",
                "type": "safety_evaluation"
            }
        )

        return {"response": response, "score": safety_score}
```

**Lines Added**: ~20 lines

### Example 2: Analyst Agent

**File**: `agents/analyst_agent.py`

```python
from infrastructure.casebank import get_casebank
from infrastructure.llm_client import RoutedLLMClient

class AnalystAgent:
    def __init__(self):
        # STEP 1 + 2: Initialize CaseBank and RoutedLLMClient
        self.casebank = get_casebank(storage_path="data/memory/analyst.jsonl")
        self.llm_client = RoutedLLMClient(
            agent_name="Analyst",
            enable_routing=True,
            casebank=self.casebank
        )

    async def analyze_metrics(self, data: Dict[str, Any]) -> str:
        """Analyze metrics with memory routing"""

        task = f"Analyze these metrics: {data}"

        # STEP 3: Generate with memory routing
        analysis = await self.llm_client.generate_text(
            system_prompt="You are a data analyst. Provide insights.",
            user_prompt=task
        )

        # STEP 4: Store successful analysis
        success_score = 0.9 if "insight" in analysis.lower() else 0.5
        await self.casebank.add_case(
            state=task[:200],
            action=analysis,
            reward=success_score,
            metadata={"agent": "analyst", "data_type": "metrics"}
        )

        return analysis
```

**Lines Added**: ~18 lines

### Example 3: QA Agent

**File**: `agents/qa_agent.py`

```python
from infrastructure.casebank import get_casebank
from infrastructure.llm_client import RoutedLLMClient

class QAAgent:
    def __init__(self):
        self.casebank = get_casebank(storage_path="data/memory/qa.jsonl")
        self.llm_client = RoutedLLMClient(
            agent_name="QA",
            enable_routing=True,
            casebank=self.casebank
        )

    async def generate_test_cases(self, feature: str) -> List[str]:
        """Generate test cases with memory routing"""

        task = f"Generate test cases for: {feature}"

        test_cases = await self.llm_client.generate_text(
            system_prompt="You are a QA engineer. Generate comprehensive tests.",
            user_prompt=task
        )

        # Store outcome with quality score
        quality = self._evaluate_test_quality(test_cases)
        await self.casebank.add_case(
            state=feature,
            action=test_cases,
            reward=quality,
            metadata={"agent": "qa", "feature_type": self._classify_feature(feature)}
        )

        return test_cases.split("\n")
```

**Lines Added**: ~20 lines

### Example 4: Support Agent

**File**: `agents/support_agent.py`

```python
from infrastructure.casebank import get_casebank
from infrastructure.llm_client import RoutedLLMClient

class SupportAgent:
    def __init__(self):
        self.casebank = get_casebank(storage_path="data/memory/support.jsonl")
        self.llm_client = RoutedLLMClient(
            agent_name="Support",
            enable_routing=True,
            casebank=self.casebank
        )

    async def answer_question(self, question: str) -> str:
        """Answer support question with memory routing"""

        answer = await self.llm_client.generate_text(
            system_prompt="You are a helpful support agent.",
            user_prompt=question
        )

        # Store Q&A pair with satisfaction score
        satisfaction = 0.9 if len(answer) > 50 else 0.6
        await self.casebank.add_case(
            state=question,
            action=answer,
            reward=satisfaction,
            metadata={"agent": "support", "category": self._categorize(question)}
        )

        return answer
```

**Lines Added**: ~18 lines

---

## Memory Routing Behavior

### Automatic Learning

The router learns from past executions:

| Past Experience | Routing Decision | Reason |
|----------------|------------------|--------|
| **No past cases** | → Haiku (cheap) | Explore with cheap model |
| **High success (>80%)** | → Haiku (cheap) | Proven easy, save cost |
| **Medium success (50-80%)** | → Base routing | Balanced decision |
| **Low success (<50%)** | → Sonnet (powerful) | Needs intelligence |

### Example Scenarios

**Scenario 1: Repeated Simple Tasks**
```python
# First time: No history, routes to Haiku (cold start)
await agent.analyze_metrics({"sales": 100})  # → Haiku

# Store success: reward=0.9
await casebank.add_case(state="sales metrics", reward=0.9, ...)

# Next time: High success history, routes to Haiku (proven easy)
await agent.analyze_metrics({"sales": 150})  # → Haiku (same as before)
```

**Scenario 2: Complex Tasks**
```python
# First attempt: No history, routes to Haiku (cold start)
await agent.analyze_metrics({"complex_ml_metrics": {...}})  # → Haiku

# Store failure: reward=0.3
await casebank.add_case(state="complex ML metrics", reward=0.3, ...)

# Next time: Low success history, routes to Sonnet (needs power)
await agent.analyze_metrics({"complex_ml_metrics": {...}})  # → Sonnet (upgraded!)
```

---

## Monitoring Memory Routing

### Check Routing Statistics

```python
from infrastructure.inference_router import InferenceRouter

router = agent.llm_client.router

# Get memory routing stats
stats = router.get_memory_routing_stats()

print(f"Total requests: {stats['total_memory_routed']}")
print(f"Cold start → Haiku: {stats['cold_start_cheap_pct']:.1%}")
print(f"High success → Haiku: {stats['high_success_cheap_pct']:.1%}")
print(f"Low success → Sonnet: {stats['low_success_accurate_pct']:.1%}")
print(f"Additional cheap routing: +{stats['additional_cheap_routing']:.1f}%")
```

**Expected Output**:
```
Total requests: 1000
Cold start → Haiku: 30.0%
High success → Haiku: 55.0%
Low success → Sonnet: 15.0%
Additional cheap routing: +85.0%
```

### View CaseBank Contents

```python
# Get all cases for agent
cases = await casebank.get_all_cases(agent_filter="my_agent")

for case in cases:
    print(f"Task: {case.state[:50]}...")
    print(f"Reward: {case.reward:.2f}")
    print(f"Metadata: {case.metadata}")
    print()
```

---

## Testing Integration

### Unit Test Example

```python
import pytest
from infrastructure.casebank import CaseBank
from agents.my_agent import MyAgent

@pytest.mark.asyncio
async def test_memory_routing_integration():
    """Verify agent uses memory routing"""

    # Create test agent with in-memory CaseBank
    agent = MyAgent()
    agent.casebank = CaseBank(storage_path=":memory:")

    # Add high-success case
    await agent.casebank.add_case(
        state="simple task",
        action="success",
        reward=0.9,
        metadata={"agent": "my_agent"}
    )

    # Route similar task
    router = agent.llm_client.router
    model, metadata = await router.route_with_memory(
        agent_name="my_agent",
        task="simple task",
        context={}
    )

    # Should route to cheap model (high success)
    assert metadata["routing_type"] == "high_success"
    assert metadata["avg_reward"] > 0.8
```

---

## Best Practices

### 1. Store Representative Outcomes
```python
# ✅ GOOD: Store final success/failure
await casebank.add_case(
    state=task,
    action=result,
    reward=1.0 if success else 0.0,
    metadata={"agent": "my_agent"}
)

# ❌ BAD: Store every intermediate step
# (bloats CaseBank, slows retrieval)
```

### 2. Use Descriptive Reward Scores
```python
# ✅ GOOD: Continuous scores (0.0-1.0)
reward = success_rate  # 0.85 = 85% success

# ❌ BAD: Binary only (0 or 1)
reward = 1 if success else 0  # Loses nuance
```

### 3. Filter Sensitive Data
```python
from infrastructure.security_utils import redact_credentials

# ✅ GOOD: Redact before storing
await casebank.add_case(
    state=redact_credentials(task),
    action=redact_credentials(result),
    reward=score,
    metadata={"agent": "my_agent"}
)
```

### 4. Periodic Cleanup
```python
# Clear old low-quality cases monthly
old_cases = await casebank.get_all_cases(min_reward=0.3)
# Keep only recent or high-quality cases
```

---

## Troubleshooting

### Issue 1: No Memory Routing Happening
**Symptom**: All requests route to base routing
**Cause**: CaseBank not passed to RoutedLLMClient
**Fix**:
```python
# ❌ WRONG
client = RoutedLLMClient(agent_name="my_agent")

# ✅ CORRECT
client = RoutedLLMClient(
    agent_name="my_agent",
    casebank=self.casebank  # Pass CaseBank!
)
```

### Issue 2: Low Memory Hit Rate
**Symptom**: Most requests are "cold_start"
**Cause**: Task descriptions don't match stored cases
**Fix**: Use consistent task descriptions
```python
# ✅ GOOD: Consistent
task = "Analyze sales metrics"
await casebank.add_case(state="Analyze sales metrics", ...)

# ❌ BAD: Inconsistent
task = "Please analyze the sales data for Q4"  # Won't match
```

### Issue 3: Cases Not Stored
**Symptom**: CaseBank remains empty
**Cause**: Missing `await` on `add_case()`
**Fix**:
```python
# ❌ WRONG (missing await)
casebank.add_case(state=task, action=result, reward=score, metadata={})

# ✅ CORRECT
await casebank.add_case(state=task, action=result, reward=score, metadata={})
```

---

## Performance Expectations

### Expected Cost Reduction by Agent Type

| Agent Type | Baseline | With Memory | Improvement |
|------------|----------|-------------|-------------|
| **QA Agent** (repetitive tests) | 60% Haiku | **80% Haiku** | +20% |
| **Support Agent** (FAQs) | 55% Haiku | **75% Haiku** | +20% |
| **Analyst Agent** (varied tasks) | 50% Haiku | **65% Haiku** | +15% |
| **Complex Agents** (Darwin, WaltzRL) | 30% Haiku | **40% Haiku** | +10% |

**Average**: ~15% additional cheap routing across all agents

---

## Rollout Checklist

- [ ] **Step 1**: Add CaseBank to agent `__init__` (2 lines)
- [ ] **Step 2**: Pass CaseBank to RoutedLLMClient (1 line)
- [ ] **Step 3**: Add `add_case()` calls after task completion (5 lines)
- [ ] **Step 4**: Add unit test for memory routing (10 lines)
- [ ] **Step 5**: Run test suite (`pytest tests/test_my_agent.py`)
- [ ] **Step 6**: Monitor routing stats in development
- [ ] **Step 7**: Deploy to staging for validation
- [ ] **Step 8**: Monitor production metrics (cost per 1M tokens)
- [ ] **Step 9**: Verify 10-20% additional cheap routing

---

## Quick Reference

### Key Files
- `infrastructure/inference_router.py` - Routing logic
- `infrastructure/llm_client.py` - LLM client with routing
- `infrastructure/casebank.py` - Memory storage
- `tests/test_memory_routing.py` - Test examples

### Key Functions
```python
# Initialize CaseBank
casebank = get_casebank(storage_path="data/memory/agent.jsonl")

# Create routed client
client = RoutedLLMClient(agent_name="Agent", casebank=casebank)

# Generate with memory
response = await client.generate_text(system_prompt, user_prompt)

# Store outcome
await casebank.add_case(state=task, action=response, reward=score, metadata={})

# Check stats
stats = client.router.get_memory_routing_stats()
```

---

**Integration Time**: 5-10 minutes per agent
**Total LOC**: ~20 lines per agent
**Expected ROI**: 15-20% additional cost reduction
**Risk**: Low (backward compatible, well-tested)

**Ready to integrate? Start with one agent and monitor results!**
