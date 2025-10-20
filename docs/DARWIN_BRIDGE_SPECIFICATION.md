# Darwin Orchestration Bridge - Implementation Specification

**For:** River (Darwin memory engineering specialist)
**From:** Cora (orchestration design)
**Date:** October 19, 2025
**Status:** Orchestration layer complete, awaiting bridge implementation

---

## 🎯 WHAT I'VE COMPLETED (CORA)

**Orchestration Integration (4 hours):**
- ✅ Added 4 HALO routing rules for Darwin (priority 15-20)
- ✅ Registered darwin_agent capability in HALO registry
- ✅ Updated GenesisOrchestrator with `improve_agent()` method
- ✅ Created comprehensive orchestration flow documentation
- ✅ Feature flag support integrated (`darwin_integration_enabled`)

**Files Modified:**
1. `infrastructure/halo_router.py` (~30 lines added)
2. `genesis_orchestrator.py` (~120 lines added)
3. `docs/DARWIN_ORCHESTRATION_FLOW.md` (new file, ~600 lines)
4. `docs/DARWIN_BRIDGE_SPECIFICATION.md` (this file)

---

## 🔧 WHAT YOU NEED TO BUILD (RIVER)

### Required File: `infrastructure/darwin_orchestration_bridge.py`

**Purpose:** Connect Genesis orchestration (HTDAG/HALO/AOP) to SE-Darwin evolution system

**Estimated Effort:** 3-4 hours (~300-400 lines)

---

## 📦 REQUIRED INTERFACE

### 1. Core Classes

```python
from enum import Enum
from dataclasses import dataclass
from typing import Dict, Any, Optional
import logging

logger = logging.getLogger(__name__)


class EvolutionTaskType(Enum):
    """Types of evolution tasks Darwin can handle"""
    IMPROVE_AGENT = "improve_agent"
    FIX_BUG = "fix_bug"
    OPTIMIZE_PERFORMANCE = "optimize_performance"


@dataclass
class EvolutionResult:
    """
    Result of an evolution cycle

    This is what GenesisOrchestrator expects to receive
    """
    success: bool
    agent_name: str
    metrics_before: Dict[str, float]
    metrics_after: Dict[str, float]
    improvement_delta: float  # Percentage improvement (e.g., 0.20 = 20%)
    new_version: str  # e.g., "marketing_agent_v2.0"
    error_message: Optional[str] = None
    evolution_metadata: Optional[Dict[str, Any]] = None


class DarwinOrchestrationBridge:
    """
    Bridge between Genesis orchestration and SE-Darwin

    Responsibilities:
    - Receive evolution tasks from orchestrator
    - Translate to Darwin agent execution
    - Manage Replay Buffer / ReasoningBank integration
    - Return evolution results
    """

    def __init__(
        self,
        htdag_planner,  # HTDAGPlanner instance
        halo_router,    # HALORouter instance
        aop_validator   # AOPValidator instance
    ):
        """
        Initialize Darwin bridge with orchestration components

        Args:
            htdag_planner: For task decomposition
            halo_router: For agent routing
            aop_validator: For plan validation
        """
        self.htdag = htdag_planner
        self.halo = halo_router
        self.aop = aop_validator

        # Initialize Darwin agent (your existing code)
        from agents.darwin_agent import DarwinAgent
        self.darwin_agent = DarwinAgent()

        # Initialize Replay Buffer (your existing code)
        # TODO: Import and initialize your Replay Buffer / ReasoningBank

        logger.info("DarwinOrchestrationBridge initialized")

    async def evolve_agent(
        self,
        agent_name: str,
        evolution_type: EvolutionTaskType,
        context: Dict[str, Any]
    ) -> EvolutionResult:
        """
        Execute evolution cycle for an agent

        This is the main entry point called by GenesisOrchestrator.improve_agent()

        Args:
            agent_name: Name of agent to evolve (e.g., "marketing_agent")
            evolution_type: Type of evolution (IMPROVE_AGENT, FIX_BUG, OPTIMIZE_PERFORMANCE)
            context: Additional context:
                - success_rate: Current success rate (0.0-1.0)
                - target: Target metric
                - errors: List of errors to fix
                - metrics: Current performance metrics

        Returns:
            EvolutionResult with before/after metrics and improvement delta

        Algorithm:
            1. Load agent code from agents/{agent_name}.py
            2. Query Replay Buffer for failures
            3. Use Darwin agent to generate improvements
            4. Validate in sandbox
            5. If improvement proven, deploy new version
            6. Return metrics

        Example:
            result = await bridge.evolve_agent(
                agent_name="marketing_agent",
                evolution_type=EvolutionTaskType.IMPROVE_AGENT,
                context={"success_rate": 0.65, "target": 0.80}
            )
        """
        logger.info(f"Starting evolution for {agent_name} (type: {evolution_type.value})")

        try:
            # Step 1: Load agent code
            agent_code = self._load_agent_code(agent_name)

            # Step 2: Query Replay Buffer for relevant failures
            failures = self._get_agent_failures(agent_name, context)

            # Step 3: Measure current performance (baseline)
            metrics_before = await self._benchmark_agent(agent_name)

            # Step 4: Generate improvements using Darwin
            improved_code = await self._generate_improvements(
                agent_name=agent_name,
                current_code=agent_code,
                failures=failures,
                evolution_type=evolution_type,
                context=context
            )

            # Step 5: Validate in sandbox
            validation_result = await self._validate_in_sandbox(
                agent_name=agent_name,
                new_code=improved_code
            )

            if not validation_result["success"]:
                return EvolutionResult(
                    success=False,
                    agent_name=agent_name,
                    metrics_before=metrics_before,
                    metrics_after={},
                    improvement_delta=0.0,
                    new_version="",
                    error_message=f"Sandbox validation failed: {validation_result['error']}"
                )

            # Step 6: Benchmark improved agent
            metrics_after = await self._benchmark_agent(agent_name, code=improved_code)

            # Step 7: Calculate improvement
            improvement = self._calculate_improvement(metrics_before, metrics_after)

            # Step 8: Deploy if improvement >= threshold (e.g., 5%)
            if improvement >= 0.05:  # 5% minimum improvement
                new_version = self._deploy_improved_agent(
                    agent_name=agent_name,
                    improved_code=improved_code
                )

                logger.info(
                    f"Evolution successful: {agent_name} improved by {improvement*100:.1f}% "
                    f"(deployed as {new_version})"
                )

                return EvolutionResult(
                    success=True,
                    agent_name=agent_name,
                    metrics_before=metrics_before,
                    metrics_after=metrics_after,
                    improvement_delta=improvement,
                    new_version=new_version
                )
            else:
                logger.info(
                    f"Evolution rejected: {agent_name} improvement {improvement*100:.1f}% "
                    f"below threshold (5%)"
                )

                return EvolutionResult(
                    success=False,
                    agent_name=agent_name,
                    metrics_before=metrics_before,
                    metrics_after=metrics_after,
                    improvement_delta=improvement,
                    new_version="",
                    error_message=f"Improvement {improvement*100:.1f}% below 5% threshold"
                )

        except Exception as e:
            logger.error(f"Evolution failed for {agent_name}: {e}", exc_info=True)
            return EvolutionResult(
                success=False,
                agent_name=agent_name,
                metrics_before={},
                metrics_after={},
                improvement_delta=0.0,
                new_version="",
                error_message=str(e)
            )

    # Helper methods (implement these using your existing Darwin code)

    def _load_agent_code(self, agent_name: str) -> str:
        """Load agent source code from agents/{agent_name}.py"""
        # TODO: Implement using your agent loading logic
        pass

    def _get_agent_failures(self, agent_name: str, context: Dict) -> list:
        """Query Replay Buffer for agent failures"""
        # TODO: Integrate with your Replay Buffer / ReasoningBank
        pass

    async def _benchmark_agent(self, agent_name: str, code: Optional[str] = None) -> Dict[str, float]:
        """Run benchmark to measure agent performance"""
        # TODO: Use your existing benchmark system
        pass

    async def _generate_improvements(
        self,
        agent_name: str,
        current_code: str,
        failures: list,
        evolution_type: EvolutionTaskType,
        context: Dict
    ) -> str:
        """Use Darwin agent to generate improved code"""
        # TODO: Call your Darwin agent's improve() method
        pass

    async def _validate_in_sandbox(self, agent_name: str, new_code: str) -> Dict:
        """Validate improved code in Docker sandbox"""
        # TODO: Use your sandbox validation
        pass

    def _calculate_improvement(
        self,
        metrics_before: Dict[str, float],
        metrics_after: Dict[str, float]
    ) -> float:
        """Calculate percentage improvement between metrics"""
        # TODO: Implement metric comparison logic
        # Example: Compare primary metric (success_rate, accuracy, etc.)
        pass

    def _deploy_improved_agent(self, agent_name: str, improved_code: str) -> str:
        """Deploy improved agent and return version identifier"""
        # TODO: Write improved code to agents/{agent_name}.py
        # TODO: Increment version (e.g., v1.0 → v2.0)
        pass
```

---

## 🔌 INTEGRATION POINTS

### From Orchestrator to Bridge

**Call signature (already implemented by Cora):**

```python
# In GenesisOrchestrator.improve_agent():
from infrastructure.darwin_orchestration_bridge import DarwinOrchestrationBridge, EvolutionTaskType

result = await self.darwin_bridge.evolve_agent(
    agent_name="marketing_agent",
    evolution_type=EvolutionTaskType.IMPROVE_AGENT,
    context={"success_rate": 0.65, "target": 0.80}
)

# Expected result format:
# {
#   "success": True,
#   "agent_name": "marketing_agent",
#   "metrics_before": {"ctr": 0.15, "conversion": 0.05},
#   "metrics_after": {"ctr": 0.18, "conversion": 0.06},
#   "improvement": 0.20,  # 20% improvement
#   "new_version": "marketing_agent_v2.0"
# }
```

### From Bridge to Darwin Agent

**Use your existing Darwin agent:**

```python
# Example integration (adapt to your actual API):
from agents.darwin_agent import DarwinAgent

darwin = DarwinAgent()

# Generate improved code
improved_code = await darwin.improve(
    agent_code=current_code,
    failures=replay_buffer.get_failures(agent_name),
    target_metric="success_rate",
    target_value=0.80
)

# Validate in sandbox
validation = await darwin.validate_in_sandbox(improved_code)

# Benchmark
metrics = await darwin.benchmark(agent_name, improved_code)
```

---

## 📋 TESTING REQUIREMENTS

### Unit Tests (Create: `tests/test_darwin_orchestration_bridge.py`)

```python
import pytest
from infrastructure.darwin_orchestration_bridge import (
    DarwinOrchestrationBridge,
    EvolutionTaskType,
    EvolutionResult
)

@pytest.mark.asyncio
async def test_evolve_agent_success():
    """Test successful agent evolution"""
    bridge = DarwinOrchestrationBridge(htdag, halo, aop)

    result = await bridge.evolve_agent(
        agent_name="test_agent",
        evolution_type=EvolutionTaskType.IMPROVE_AGENT,
        context={"success_rate": 0.6, "target": 0.8}
    )

    assert result.success is True
    assert result.improvement_delta > 0.05  # At least 5% improvement
    assert result.new_version.startswith("test_agent_v")

@pytest.mark.asyncio
async def test_evolve_agent_below_threshold():
    """Test evolution rejected due to low improvement"""
    # Implementation here

@pytest.mark.asyncio
async def test_evolve_agent_sandbox_failure():
    """Test evolution fails sandbox validation"""
    # Implementation here

# Add 5-10 more tests covering edge cases
```

### Integration Tests (Create: `tests/test_darwin_full_pipeline.py`)

```python
@pytest.mark.asyncio
async def test_full_orchestration_to_darwin():
    """Test full pipeline: User request → HTDAG → HALO → Darwin → Result"""
    orchestrator = GenesisOrchestrator()

    # Enable Darwin integration
    os.environ['DARWIN_INTEGRATION_ENABLED'] = 'true'

    # Execute improvement
    result = await orchestrator.improve_agent(
        agent_name="marketing_agent",
        evolution_type="improve_agent",
        context={"success_rate": 0.65, "target": 0.80}
    )

    # Validate full pipeline
    assert result["success"] is True
    assert result["improvement"] > 0.05
    assert "new_version" in result
```

---

## ✅ ACCEPTANCE CRITERIA

**Bridge Complete When:**
- [ ] `DarwinOrchestrationBridge` class implemented (~300 lines)
- [ ] `evolve_agent()` method works end-to-end
- [ ] Replay Buffer / ReasoningBank integration complete
- [ ] Sandbox validation integrated
- [ ] Benchmark validation working
- [ ] 10+ unit tests passing (≥90% coverage)
- [ ] 3+ integration tests passing
- [ ] Can improve marketing_agent successfully
- [ ] Orchestrator integration validated

---

## 🔍 CODE REVIEW CHECKLIST

**When you submit for review, Cora will check:**

- [ ] **Follows orchestration patterns:** Uses HTDAG → HALO → AOP flow
- [ ] **Async/await correct:** All I/O operations async
- [ ] **Error handling comprehensive:** Try/except with detailed logging
- [ ] **OTEL tracing integrated:** Uses correlation IDs from orchestrator
- [ ] **Feature flags respected:** Checks `darwin_integration_enabled`
- [ ] **Docstrings complete:** All methods documented
- [ ] **Type hints:** All parameters and returns typed
- [ ] **Security:** Sandbox isolation maintained
- [ ] **Performance:** Evolution cycle <10 minutes
- [ ] **Tests:** ≥90% coverage, all passing

---

## 🤝 COLLABORATION WORKFLOW

### Step 1: River Builds Bridge (3-4 hours)

**Tasks:**
1. Create `infrastructure/darwin_orchestration_bridge.py`
2. Implement `DarwinOrchestrationBridge` class
3. Integrate with existing Darwin agent
4. Connect to Replay Buffer / ReasoningBank
5. Add unit tests

### Step 2: Cora Reviews (1 hour)

**Review focus:**
- Orchestration pattern adherence
- HTDAG/HALO/AOP integration correctness
- Error handling completeness
- Performance considerations

### Step 3: Integration Testing (2 hours)

**Joint testing:**
- Run full pipeline end-to-end
- Test with marketing_agent
- Validate benchmark improvements
- Test error scenarios

### Step 4: Documentation Update (30 minutes)

**Update:**
- PROJECT_STATUS.md (Layer 2: INTEGRATED)
- CLAUDE.md (Darwin integration live)
- DARWIN_ORCHESTRATION_FLOW.md (mark complete)

---

## 📞 QUESTIONS FOR RIVER

**Before you start, clarify:**

1. **Replay Buffer API:** What's the interface to query agent failures?
   - Do we have `replay_buffer.get_failures(agent_name)?`
   - What data structure do failures return?

2. **Darwin Agent API:** What's the method to generate improvements?
   - Is it `darwin_agent.improve(code, failures)?`
   - Does it return raw code or need additional parsing?

3. **Sandbox API:** How do we run sandbox validation?
   - Synchronous or async?
   - What format does validation result return?

4. **Benchmark API:** How do we measure agent performance?
   - Do we have `benchmark.run(agent_name)?`
   - What metrics does it return (dict structure)?

**Ping Cora if you need clarification on orchestration integration!**

---

## 🎯 SUCCESS LOOKS LIKE

**End State:**

```python
# User runs this:
orchestrator = GenesisOrchestrator()

result = await orchestrator.improve_agent(
    agent_name="marketing_agent",
    evolution_type="improve_agent",
    context={"success_rate": 0.65, "target": 0.80}
)

# Output:
# {
#   "success": True,
#   "agent_name": "marketing_agent",
#   "metrics_before": {"ctr": 0.15, "conversion": 0.05},
#   "metrics_after": {"ctr": 0.18, "conversion": 0.06},
#   "improvement": 0.20,  # 20% improvement!
#   "new_version": "marketing_agent_v2.0"
# }

# Result: marketing_agent.py is now 20% better at creating campaigns ✅
```

---

## 📚 REFERENCE FILES

**For Implementation:**
- Your existing: `agents/darwin_agent.py`
- Your existing: Replay Buffer / ReasoningBank
- Your existing: Sandbox validation
- Your existing: Benchmark system

**For Integration:**
- Cora's work: `infrastructure/halo_router.py` (lines 300-307, 488-516)
- Cora's work: `genesis_orchestrator.py` (lines 74-89, 325-414)
- Cora's docs: `docs/DARWIN_ORCHESTRATION_FLOW.md`

---

**Document Version:** 1.0
**Created:** October 19, 2025 by Cora
**For:** River
**Status:** Ready for implementation

**Questions? Ping Cora in the project chat! 🚀**
