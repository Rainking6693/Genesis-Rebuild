---
title: Darwin Orchestration Flow
category: Architecture
dg-publish: true
publish: true
tags: []
source: docs/DARWIN_ORCHESTRATION_FLOW.md
exported: '2025-10-24T22:05:26.899300'
---

# Darwin Orchestration Flow

**Integration Date:** October 19, 2025
**Status:** Orchestration layer complete, awaiting Darwin bridge implementation
**Feature Flag:** `darwin_integration_enabled`

---

## 🎯 OVERVIEW

This document describes how SE-Darwin (self-improving agents) integrates with the Genesis orchestration pipeline (HTDAG → HALO → AOP).

**What This Enables:**
- Users can request agent improvements via natural language
- System automatically evolves agent code to fix bugs or improve performance
- Benchmark validation ensures improvements are real
- 150% improvement potential proven by research (20% → 50% on SWE-bench)

---

## 📊 USER REQUEST → AGENT IMPROVEMENT FLOW

### Full Pipeline (End-to-End)

```
User: "Improve marketing agent performance"
    ↓
[GenesisOrchestrator.improve_agent()]
    ↓
[DarwinOrchestrationBridge.evolve_agent()]
    ↓
┌─────────────────────────────────────────────────┐
│ HTDAG: Decompose Evolution Task                │
├─────────────────────────────────────────────────┤
│ Input: "Improve marketing_agent"                │
│ Output (DAG):                                   │
│   ├─ Task 1: Analyze performance metrics        │
│   ├─ Task 2: Generate code improvements         │
│   ├─ Task 3: Validate in sandbox                │
│   └─ Task 4: Deploy if improvement proven       │
└─────────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────────┐
│ HALO: Route Tasks to Darwin Agent              │
├─────────────────────────────────────────────────┤
│ Routing Rules Applied:                          │
│   • evolution_general (priority 20)             │
│   • evolution_agent_improvement (priority 20)   │
│   • evolution_bug_fix (priority 15)             │
│   • evolution_performance (priority 15)         │
│                                                 │
│ Result: All tasks → darwin_agent                │
└─────────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────────┐
│ AOP: Validate Plan                             │
├─────────────────────────────────────────────────┤
│ 1. Solvability: Darwin can handle evolution? ✅ │
│    - darwin_agent supports "improve_agent"      │
│    - Has "self_improvement" skill               │
│                                                 │
│ 2. Completeness: All tasks assigned? ✅          │
│    - All 4 tasks routed to darwin_agent         │
│                                                 │
│ 3. Non-redundancy: No duplicate work? ✅         │
│    - Each task distinct (analyze/improve/test)  │
└─────────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────────┐
│ Darwin Agent: Execute Evolution Cycle           │
├─────────────────────────────────────────────────┤
│ 1. SELECT: Choose parent agent code             │
│    - Loads marketing_agent.py source            │
│                                                 │
│ 2. DIAGNOSE: Analyze failures                   │
│    - Reads Replay Buffer for task failures      │
│    - Identifies patterns (e.g., low CTR)        │
│                                                 │
│ 3. IMPROVE: Generate modifications              │
│    - Uses GPT-4o/Claude to write better code    │
│    - Applies SE operators (revise/recombine)    │
│                                                 │
│ 4. VALIDATE: Test in Docker sandbox             │
│    - Runs benchmark: create_marketing_campaign  │
│    - Measures: CTR, conversion, engagement      │
│                                                 │
│ 5. ACCEPT: Deploy if metrics improve            │
│    - Old: 15% CTR → New: 18% CTR (20% better)   │
│    - Deploy marketing_agent v2.0                │
└─────────────────────────────────────────────────┘
    ↓
[Result] Marketing Agent v2.0 (20% better performance)
```

---

## 🔧 INTEGRATION COMPONENTS

### 1. HALO Routing Rules (Added to `halo_router.py`)

```python
# Darwin Evolution Rules (Priority: 15-20)
RoutingRule(
    rule_id="evolution_general",
    condition={"task_type": "evolution"},
    target_agent="darwin_agent",
    priority=20,
    explanation="General evolution tasks route to Darwin for self-improvement"
),

RoutingRule(
    rule_id="evolution_agent_improvement",
    condition={"task_type": "improve_agent"},
    target_agent="darwin_agent",
    priority=20,
    explanation="Agent improvement requests route to Darwin"
),

RoutingRule(
    rule_id="evolution_bug_fix",
    condition={"task_type": "fix_bug", "target": "agent_code"},
    target_agent="darwin_agent",
    priority=15,
    explanation="Agent bug fixes route to Darwin for code evolution"
),

RoutingRule(
    rule_id="evolution_performance",
    condition={"task_type": "optimize", "target": "agent_performance"},
    target_agent="darwin_agent",
    priority=15,
    explanation="Agent performance optimization routes to Darwin"
),
```

### 2. Darwin Agent Capability (Added to `halo_router.py`)

```python
"darwin_agent": AgentCapability(
    agent_name="darwin_agent",
    supported_task_types=["evolution", "improve_agent", "fix_bug", "optimize"],
    skills=["self_improvement", "code_generation", "benchmark_validation",
            "agent_evolution", "meta_programming"],
    cost_tier="expensive",  # Uses GPT-4o/Claude for meta-programming
    success_rate=0.0,       # Will learn over time
    max_concurrent_tasks=3  # Evolution is resource-intensive
),
```

### 3. Orchestrator Method (Added to `genesis_orchestrator.py`)

```python
async def improve_agent(
    self,
    agent_name: str,
    evolution_type: str = "improve_agent",
    context: Optional[Dict] = None
) -> Dict:
    """
    Improve an agent using Darwin evolution

    Args:
        agent_name: Name of agent (e.g., "marketing_agent")
        evolution_type: "improve_agent", "fix_bug", "optimize_performance"
        context: {"success_rate": 0.65, "target": 0.80, ...}

    Returns:
        Evolution result with improvement metrics
    """
```

---

## 🚀 USAGE EXAMPLES

### Example 1: General Agent Improvement

```python
orchestrator = GenesisOrchestrator()

result = await orchestrator.improve_agent(
    agent_name="marketing_agent",
    evolution_type="improve_agent",
    context={
        "success_rate": 0.65,
        "target": 0.80
    }
)

# Result:
# {
#   "success": True,
#   "agent_name": "marketing_agent",
#   "metrics_before": {"ctr": 0.15, "conversion": 0.05},
#   "metrics_after": {"ctr": 0.18, "conversion": 0.06},
#   "improvement": 0.20,  # 20% improvement
#   "new_version": "marketing_agent_v2.0"
# }
```

### Example 2: Bug Fix

```python
result = await orchestrator.improve_agent(
    agent_name="builder_agent",
    evolution_type="fix_bug",
    context={
        "errors": [
            "TypeError: unsupported operand type(s) for +: 'int' and 'str'",
            "AttributeError: 'NoneType' object has no attribute 'build'"
        ]
    }
)
```

### Example 3: Performance Optimization

```python
result = await orchestrator.improve_agent(
    agent_name="backend_agent",
    evolution_type="optimize_performance",
    context={
        "current_latency": 450,  # ms
        "target_latency": 200,   # ms
        "bottleneck": "database_query"
    }
)
```

---

## 🔄 INTEGRATION WITH ORCHESTRATION PIPELINE

### How It Works with HTDAG

**User Request:** "Improve marketing agent"

**HTDAG Decomposition:**
```python
dag = await htdag.decompose_task("Improve marketing agent")

# DAG Output:
# Task "improve_marketing" (type: improve_agent)
#   ├─ Task "analyze_metrics" (type: evolution)
#   ├─ Task "generate_improvements" (type: evolution)
#   ├─ Task "validate_changes" (type: evolution)
#   └─ Task "deploy_new_version" (type: evolution)
```

### How It Works with HALO

**Routing Logic:**
```python
routing_plan = await halo.route_tasks(dag)

# HALO Decision:
# - Sees task_type="improve_agent"
# - Matches rule "evolution_agent_improvement" (priority 20)
# - Routes all subtasks to darwin_agent
# - Validates darwin_agent supports "improve_agent" ✅
```

### How It Works with AOP

**Validation:**
```python
validation = await aop.validate_routing_plan(routing_plan, dag)

# AOP Checks:
# 1. Solvability: darwin_agent can handle evolution? ✅
# 2. Completeness: All tasks assigned? ✅
# 3. Non-redundancy: No duplicate work? ✅
# 4. Quality Score: 0.85 (high confidence)
```

---

## 📦 DARWIN BRIDGE INTERFACE

### Expected Interface (To Be Implemented by River)

```python
class DarwinOrchestrationBridge:
    """
    Bridge between Genesis orchestration and SE-Darwin
    """

    def __init__(
        self,
        htdag_planner: HTDAGPlanner,
        halo_router: HALORouter,
        aop_validator: AOPValidator
    ):
        pass

    async def evolve_agent(
        self,
        agent_name: str,
        evolution_type: EvolutionTaskType,
        context: Dict[str, Any]
    ) -> EvolutionResult:
        """
        Execute evolution cycle for an agent

        Returns:
            EvolutionResult with metrics_before, metrics_after, improvement_delta
        """
        pass
```

### Data Flow

```
GenesisOrchestrator.improve_agent()
    ↓ (calls)
DarwinOrchestrationBridge.evolve_agent()
    ↓ (uses)
HTDAG (task decomposition)
    ↓
HALO (routing to darwin_agent)
    ↓
AOP (validation)
    ↓
Darwin Agent (actual evolution)
    ↓ (returns)
EvolutionResult → GenesisOrchestrator → User
```

---

## 🎯 FEATURE FLAG CONTROL

### Configuration

```json
{
  "darwin_integration_enabled": {
    "enabled": false,
    "rollout_percentage": 0,
    "description": "Enable SE-Darwin self-improvement integration"
  }
}
```

### Rollout Strategy

**Phase 1: Internal Testing (0%)**
- Darwin bridge implementation complete
- Integration tests passing (≥90%)
- Manual testing with 2-3 agents

**Phase 2: Limited Rollout (10%)**
- Enable for marketing_agent only
- Monitor improvement metrics
- Validate no regressions

**Phase 3: Expanded Rollout (50%)**
- Enable for 5 agents (marketing, builder, backend, qa, support)
- Collect performance data
- Fine-tune evolution parameters

**Phase 4: Full Rollout (100%)**
- Enable for all 15+ agents
- Continuous self-improvement active
- Autonomous evolution loops running

---

## ✅ SUCCESS CRITERIA

**Integration Complete When:**
- ✅ HALO routing rules added (4 rules)
- ✅ Darwin agent capability registered
- ✅ GenesisOrchestrator.improve_agent() method added
- ⏳ DarwinOrchestrationBridge implemented (River)
- ⏳ Integration tests passing (≥90%)
- ⏳ End-to-end evolution cycle works
- ⏳ Benchmark validation successful
- ⏳ Feature flag control verified

**Performance Validation:**
- Evolution cycle completes in <10 minutes
- Benchmark improvements ≥5% (minimum threshold)
- Sandbox isolation maintained (no escapes)
- No regressions in existing agent performance

---

## 🔍 TROUBLESHOOTING

### "Darwin integration not enabled"

**Cause:** Feature flag disabled
**Fix:** Set `darwin_integration_enabled=true` in config/feature_flags.json

### "Darwin bridge not available"

**Cause:** `infrastructure/darwin_orchestration_bridge.py` not found
**Fix:** Wait for River to implement bridge module

### "No matching agent for task_type=evolution"

**Cause:** Darwin agent not in HALO registry
**Fix:** Verify darwin_agent capability registered (done ✅)

### "AOP validation failed: Solvability"

**Cause:** Darwin agent doesn't support task type
**Fix:** Check supported_task_types includes ["evolution", "improve_agent", ...]

---

## 📚 RELATED DOCUMENTATION

- **SE-Darwin Core:** `docs/SE_DARWIN_INTEGRATION_PLAN.md`
- **Orchestration Design:** `docs/ORCHESTRATION_DESIGN.md`
- **HTDAG Planner:** `infrastructure/htdag_planner.py`
- **HALO Router:** `infrastructure/halo_router.py`
- **AOP Validator:** `infrastructure/aop_validator.py`
- **Darwin Agent:** `agents/darwin_agent.py`

---

## 🤝 COLLABORATION WITH RIVER

**Cora's Responsibilities (COMPLETE):**
- ✅ Add HALO routing rules for Darwin
- ✅ Register Darwin agent capability
- ✅ Update GenesisOrchestrator with improve_agent()
- ✅ Document orchestration flow

**River's Responsibilities (IN PROGRESS):**
- ⏳ Implement DarwinOrchestrationBridge class
- ⏳ Connect to Replay Buffer / ReasoningBank
- ⏳ Handle evolution task execution
- ⏳ Return EvolutionResult to orchestrator

**Integration Point:**
```python
# Cora's code calls River's bridge:
result = await self.darwin_bridge.evolve_agent(
    agent_name=agent_name,
    evolution_type=EvolutionTaskType(evolution_type),
    context=context
)
```

---

**Document Version:** 1.0
**Last Updated:** October 19, 2025
**Next Review:** After Darwin bridge implementation complete
