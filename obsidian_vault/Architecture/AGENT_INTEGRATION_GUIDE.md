---
title: 'Agent Integration Guide: Outcome Trajectory Logging'
category: Architecture
dg-publish: true
publish: true
tags: []
source: docs/AGENT_INTEGRATION_GUIDE.md
exported: '2025-10-24T22:05:26.933884'
---

# Agent Integration Guide: Outcome Trajectory Logging

**Phase 6 Day 1 Enhancement**
**For:** All 15 Production Agents
**Date:** October 24, 2025

---

## Quick Start (5 Minutes)

### 1. Import the Logger

```python
from agents.se_darwin_agent import get_outcome_logger
from infrastructure.memory_store import GenesisMemoryStore
```

### 2. Initialize in Agent Constructor

```python
class MyAgent:
    def __init__(self, memory_store: GenesisMemoryStore):
        self.memory_store = memory_store
        self.outcome_logger = get_outcome_logger(
            memory_store=memory_store,
            enable_auto_extraction=True  # Auto-learn from successes
        )
```

### 3. Log Outcomes After Task Execution

```python
async def execute_task(self, task_description: str) -> Dict[str, Any]:
    """Execute task and log outcome for learning"""
    start_time = time.time()
    execution_path = []

    try:
        # Step 1: Analyze task
        execution_path.append("analyze_task")
        analysis = await self._analyze_task(task_description)

        # Step 2: Generate solution
        execution_path.append("generate_solution")
        solution = await self._generate_solution(analysis)

        # Step 3: Validate result
        execution_path.append("validate_result")
        validation = await self._validate(solution)

        # Build result
        result = {
            "status": "success",
            "solution": solution,
            "validation": validation
        }

        # Log successful outcome
        await self.outcome_logger.log_outcome(
            task=task_description,
            result=result,
            success=True,
            execution_path=execution_path,
            agent_name=self.__class__.__name__,
            execution_time=time.time() - start_time
        )

        return result

    except Exception as e:
        # Log failed outcome
        await self.outcome_logger.log_outcome(
            task=task_description,
            result={"status": "error"},
            success=False,
            execution_path=execution_path,
            agent_name=self.__class__.__name__,
            error_message=str(e),
            execution_time=time.time() - start_time
        )
        raise
```

---

## Complete Example: Builder Agent

```python
import time
from typing import Dict, Any, List
from agents.se_darwin_agent import get_outcome_logger
from infrastructure.memory_store import GenesisMemoryStore


class BuilderAgent:
    """
    Builder Agent with Outcome Trajectory Logging
    """

    def __init__(self, memory_store: GenesisMemoryStore):
        self.memory_store = memory_store
        self.outcome_logger = get_outcome_logger(
            memory_store=memory_store,
            enable_auto_extraction=True
        )

    async def build_feature(
        self,
        feature_spec: str,
        context: Dict[str, Any] = None
    ) -> Dict[str, Any]:
        """
        Build feature from specification.

        Args:
            feature_spec: Feature specification
            context: Optional build context

        Returns:
            Build result dict
        """
        start_time = time.time()
        execution_path = []
        context = context or {}

        try:
            # Step 1: Parse specification
            execution_path.append("parse_specification")
            parsed_spec = await self._parse_spec(feature_spec)

            # Step 2: Design architecture
            execution_path.append("design_architecture")
            architecture = await self._design_architecture(parsed_spec)

            # Step 3: Generate code
            execution_path.append("generate_code")
            code = await self._generate_code(architecture)

            # Step 4: Write tests
            execution_path.append("write_tests")
            tests = await self._write_tests(code)

            # Step 5: Run tests
            execution_path.append("run_tests")
            test_results = await self._run_tests(tests)

            # Build success result
            result = {
                "status": "success",
                "feature": feature_spec,
                "architecture": architecture,
                "code_files": len(code),
                "tests_written": len(tests),
                "tests_passed": test_results["passed"],
                "tests_failed": test_results["failed"],
                "coverage": test_results["coverage"]
            }

            # Log successful outcome (auto-extracts plan)
            await self.outcome_logger.log_outcome(
                task=f"Build feature: {feature_spec}",
                result=result,
                success=True,
                execution_path=execution_path,
                agent_name="builder",
                execution_time=time.time() - start_time,
                context={
                    "framework": context.get("framework", "FastAPI"),
                    "language": context.get("language", "Python"),
                    "complexity": len(execution_path)
                }
            )

            return result

        except Exception as e:
            # Log failed outcome
            await self.outcome_logger.log_outcome(
                task=f"Build feature: {feature_spec}",
                result={
                    "status": "error",
                    "stage": execution_path[-1] if execution_path else "initialization"
                },
                success=False,
                execution_path=execution_path,
                agent_name="builder",
                error_message=str(e),
                execution_time=time.time() - start_time,
                context=context
            )
            raise

    # Placeholder methods (implement with your agent logic)
    async def _parse_spec(self, spec: str) -> Dict:
        return {"requirements": [spec]}

    async def _design_architecture(self, spec: Dict) -> Dict:
        return {"modules": ["api", "models", "tests"]}

    async def _generate_code(self, arch: Dict) -> List[str]:
        return ["main.py", "models.py", "tests.py"]

    async def _write_tests(self, code: List[str]) -> List[str]:
        return ["test_main.py", "test_models.py"]

    async def _run_tests(self, tests: List[str]) -> Dict:
        return {"passed": 12, "failed": 0, "coverage": 0.95}
```

---

## Integration Checklist

### For Each Agent:

- [ ] **Import logger factory:** `from agents.se_darwin_agent import get_outcome_logger`
- [ ] **Initialize in constructor:** `self.outcome_logger = get_outcome_logger(memory_store)`
- [ ] **Track execution path:** Append step names to list during execution
- [ ] **Log success outcomes:** Call `log_outcome()` with `success=True`
- [ ] **Log failure outcomes:** Call `log_outcome()` with `success=False` and error
- [ ] **Include execution time:** Track `time.time()` before and after
- [ ] **Add meaningful context:** Include relevant metadata in `context` dict

### Optional Enhancements:

- [ ] **Manual plan extraction:** Call `logger.extract_plan()` for custom analysis
- [ ] **Statistics monitoring:** Call `logger.get_statistics()` for metrics
- [ ] **Disable auto-extraction:** Set `enable_auto_extraction=False` if needed
- [ ] **Custom success criteria:** Adjust what counts as "success" for your agent

---

## Execution Path Best Practices

### Good Execution Paths ✅

```python
# Clear, descriptive steps
execution_path = [
    "validate_input",
    "fetch_data",
    "process_data",
    "generate_report",
    "save_results"
]

# Domain-specific steps
execution_path = [
    "parse_user_query",
    "search_knowledge_base",
    "rank_results",
    "format_response"
]
```

### Bad Execution Paths ❌

```python
# Too vague
execution_path = ["step1", "step2", "step3"]

# Too granular
execution_path = [
    "open_file",
    "read_line_1",
    "read_line_2",
    "parse_json",
    "validate_field_1",
    "validate_field_2"
    # ... (100 steps)
]

# Inconsistent naming
execution_path = ["GetData", "process-data", "Save_Results"]
```

### Recommended Granularity

- **3-7 steps:** Most tasks
- **1-2 steps:** Simple tasks (direct implementation)
- **8-15 steps:** Complex tasks (multi-phase workflows)
- **>15 steps:** Consider breaking into subtasks

---

## Result Format Best Practices

### Good Results ✅

```python
# Structured with status
result = {
    "status": "success",
    "items_processed": 42,
    "duration_seconds": 3.2,
    "quality_score": 0.95
}

# Domain-specific metrics
result = {
    "status": "success",
    "tests_passed": 12,
    "tests_failed": 0,
    "coverage": 0.95,
    "warnings": []
}
```

### Bad Results ❌

```python
# Just a boolean
result = True

# No structure
result = "Task completed successfully"

# Missing status indicator
result = {
    "items": 42,
    "duration": 3.2
}  # How do we know if it succeeded?
```

### Recommended Fields

**Required:**
- `status`: "success", "error", "partial_success"

**Recommended:**
- Quantitative metrics (counts, scores, durations)
- Quality indicators (coverage, accuracy, confidence)
- Resource usage (tokens, API calls, memory)

**Optional:**
- Warnings, notices, recommendations
- Intermediate results, artifacts created
- Next steps, follow-up tasks

---

## Performance Considerations

### Async Logging (Non-Blocking)

```python
# ✅ GOOD: Async, doesn't block
await self.outcome_logger.log_outcome(...)

# ❌ BAD: Sync, blocks execution
# (not supported - logger is async-only)
```

### Batch Logging (Future Enhancement)

```python
# Future: Batch multiple outcomes for efficiency
# Not yet implemented, but planned for Phase 7

outcomes = []
for task in tasks:
    outcome = await execute_task(task)
    outcomes.append(outcome)

# Log in batch (reduces Memory Store round-trips)
await logger.log_outcomes_batch(outcomes)
```

### Memory Store Overhead

- **Outcome storage:** ~50ms per outcome (async, non-blocking)
- **Plan extraction:** ~1ms (rule-based, synchronous)
- **Total overhead:** ~51ms per successful task
- **Impact:** Negligible for tasks >1s, minimal for tasks >100ms

---

## Monitoring & Debugging

### Check Logger Statistics

```python
stats = self.outcome_logger.get_statistics()
print(f"Outcomes logged: {stats['outcomes_logged']}")
print(f"Plans extracted: {stats['plans_extracted']}")
print(f"Training examples stored: {stats['training_examples_stored']}")
```

### Query Logged Outcomes

```python
# Search for outcomes by agent
outcomes = await memory_store.search_memories(
    namespace=("outcomes", "builder"),
    query="authentication",
    limit=10
)

for outcome in outcomes:
    print(f"Task: {outcome['task_description']}")
    print(f"Success: {outcome['success']}")
    print(f"Path: {' → '.join(outcome['execution_path'])}")
```

### Retrieve Training Examples

```python
# Search for training examples
training = await memory_store.search_memories(
    namespace=("training", "builder"),
    query="build FastAPI endpoint",
    limit=5
)

for example in training:
    plan = example['plan']
    print(f"Strategy: {plan['strategy_description']}")
    print(f"Confidence: {plan['confidence']}")
    print(f"Success factors: {plan['success_factors']}")
```

---

## Common Issues & Solutions

### Issue 1: Memory Store Not Initialized

**Symptom:**
```
WARNING: No memory store configured, training example not persisted
```

**Solution:**
```python
# Ensure memory store passed to logger
memory_store = GenesisMemoryStore()
logger = get_outcome_logger(memory_store=memory_store)
```

### Issue 2: Execution Path Empty

**Symptom:**
```
Plan extracted with minimal confidence (0.5 instead of 0.8)
```

**Solution:**
```python
# Track execution path during execution
execution_path = []
execution_path.append("step_1")  # Before each major step
# ...
await logger.log_outcome(..., execution_path=execution_path)
```

### Issue 3: Auto-Extraction Not Working

**Symptom:**
```
Outcomes logged but no training examples stored
```

**Check:**
1. Is `enable_auto_extraction=True`? (default)
2. Is outcome marked as `success=True`? (only extracts from successes)
3. Is memory store configured?

### Issue 4: Performance Slow

**Symptom:**
```
Outcome logging takes >500ms per call
```

**Possible Causes:**
- Memory Store network latency (use local MongoDB)
- Large result dicts (truncate to <1KB)
- Synchronous logging (should be async)

**Solution:**
```python
# Ensure async/await pattern
await logger.log_outcome(...)  # Not logger.log_outcome(...) without await
```

---

## Testing Your Integration

### Unit Test Template

```python
import pytest
from unittest.mock import AsyncMock
from agents.my_agent import MyAgent
from infrastructure.memory_store import InMemoryBackend, GenesisMemoryStore


@pytest.mark.asyncio
async def test_outcome_logging():
    """Test that agent logs outcomes correctly"""
    # Setup
    backend = InMemoryBackend()
    memory_store = GenesisMemoryStore(backend=backend)
    agent = MyAgent(memory_store=memory_store)

    # Execute task
    result = await agent.execute_task("Test task")

    # Verify outcome logged
    outcomes = await memory_store.search_memories(
        namespace=("outcomes", "MyAgent"),
        query="Test task"
    )

    assert len(outcomes) == 1
    assert outcomes[0]["success"] is True
    assert outcomes[0]["agent_name"] == "MyAgent"
    assert len(outcomes[0]["execution_path"]) > 0


@pytest.mark.asyncio
async def test_failure_logging():
    """Test that agent logs failures correctly"""
    backend = InMemoryBackend()
    memory_store = GenesisMemoryStore(backend=backend)
    agent = MyAgent(memory_store=memory_store)

    # Execute failing task
    with pytest.raises(Exception):
        await agent.execute_task("Task that will fail")

    # Verify failure logged
    outcomes = await memory_store.search_memories(
        namespace=("outcomes", "MyAgent"),
        query="fail"
    )

    assert len(outcomes) == 1
    assert outcomes[0]["success"] is False
    assert outcomes[0]["error_message"] is not None
```

---

## Agent-Specific Examples

### QA Agent

```python
execution_path = [
    "analyze_requirements",
    "generate_test_cases",
    "execute_tests",
    "collect_coverage",
    "generate_report"
]

result = {
    "status": "success",
    "tests_total": 50,
    "tests_passed": 48,
    "tests_failed": 2,
    "coverage": 0.92,
    "critical_failures": []
}
```

### Marketing Agent

```python
execution_path = [
    "analyze_target_audience",
    "generate_campaign_ideas",
    "create_content",
    "schedule_posts",
    "monitor_engagement"
]

result = {
    "status": "success",
    "posts_scheduled": 7,
    "platforms": ["twitter", "linkedin"],
    "estimated_reach": 5000,
    "confidence": 0.85
}
```

### Support Agent

```python
execution_path = [
    "classify_ticket",
    "search_knowledge_base",
    "generate_response",
    "validate_answer",
    "send_response"
]

result = {
    "status": "success",
    "ticket_id": "TICK-1234",
    "response_time_seconds": 12.3,
    "knowledge_base_hits": 3,
    "confidence": 0.90,
    "escalation_needed": False
}
```

---

## Next Steps

1. **Integrate your agent** using the template above
2. **Test locally** with unit tests
3. **Deploy to staging** and monitor outcome logs
4. **Review extracted plans** in Memory Store
5. **Report issues** to Alex (Testing & Self-Improvement Team)

---

**Questions?** Contact Alex or see `/docs/PHASE_6_DAY1_OL_PLAN_DESIGN.md`

**Timeline:**
- Day 1 (Oct 24): Infrastructure complete ✅
- Day 2 (Oct 25): Agent integrations begin
- Day 3 (Oct 26): All agents integrated + LLM extraction
