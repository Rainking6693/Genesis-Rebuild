# Multi-Agent Evolve: Quick Start Implementation Guide

**Status:** Phase 1 Research Complete - Ready for Phase 2-6 Implementation
**Date:** November 3, 2025
**Target Completion:** 15 hours (1 day with parallel work)

---

## TL;DR: What We're Building

A competitive two-agent system where:
- **Solver Agent** generates solution trajectories
- **Verifier Agent** validates and provides feedback
- Both improve together (no external benchmarks needed)
- Expected +11% accuracy improvement over SE-Darwin

---

## Research Documents

### Read These First (in order)
1. **docs/research/PHASE1_RESEARCH_SUMMARY.md** (410 lines) ← START HERE
   - Executive summary of findings
   - Key insights from arXiv:2510.23595
   - Timeline and next steps

2. **docs/research/MULTI_AGENT_EVOLVE_ARCHITECTURE.md** (638 lines)
   - Complete technical specification
   - Component descriptions with pseudocode
   - Data structures and type definitions
   - Integration points

### Referenced Documents
- `FINAL_STRETCH_RESEARCH_ANALYSIS.md` - Where we found the paper
- `ORCHESTRATION_PATTERNS_RESEARCH.md` - Cora's research on LangGraph
- `AGENT_PROJECT_MAPPING.md` - Hudson (you) assigned to this task
- `PROJECT_STATUS.md` - Overall project context

---

## Implementation Checklist

### Phase 2: Solver Agent (Hudson, 4 hours)
```
Subtasks:
  [ ] Create infrastructure/evolution/__init__.py
  [ ] Create infrastructure/evolution/solver_agent.py (400 lines)
      [ ] SolverAgent class
      [ ] Trajectory generation (uses SE-Darwin operators)
      [ ] Feedback incorporation
      [ ] Reward model adaptation
      [ ] Diversity maintenance
  [ ] Type hints 100% complete
  [ ] Docstrings on all methods
  [ ] 12 unit tests passing
```

**Files to Reuse:**
- `infrastructure/trajectory_pool.py` (existing TrajectoryPool)
- `infrastructure/se_operators.py` (Revision, Recombination, Refinement operators)
- `agents/se_darwin_agent.py` (BenchmarkScenarioLoader, CodeQualityValidator)

**API Contract (must match this exactly):**
```python
class SolverAgent:
    def __init__(self, trajectory_pool: TrajectoryPool, se_operators: Dict):
        """Initialize with reusable infrastructure"""
        pass

    def generate_trajectories(self, task: Dict, n_trajectories: int) -> List[SolverTrajectory]:
        """Generate N diverse solution trajectories"""
        pass

    def incorporate_feedback(self, feedback: List[SolverFeedback]) -> None:
        """Learn from Verifier's evaluations"""
        pass

    def get_confidence(self, trajectory: SolverTrajectory) -> float:
        """How much solver believes in this solution (0-1)"""
        pass
```

---

### Phase 3: Verifier Agent (Hudson, 4 hours)
```
Subtasks:
  [ ] Create infrastructure/evolution/verifier_agent.py (350 lines)
      [ ] VerifierAgent class
      [ ] Multi-criteria evaluation (4 scoring dimensions)
      [ ] Correctness scorer
      [ ] Quality scorer
      [ ] Generalization scorer
      [ ] Robustness scorer
      [ ] Shortcut detector
      [ ] Edge case tester
  [ ] Type hints 100% complete
  [ ] Docstrings on all methods
  [ ] 12 unit tests passing
```

**API Contract (must match this exactly):**
```python
class VerifierAgent:
    def __init__(self, config: VerifierConfig, edge_case_tests: List[str]):
        """Initialize with evaluation criteria and edge cases"""
        pass

    def evaluate_trajectories(self, trajectories: List[SolverTrajectory]) -> List[VerifierEvaluation]:
        """Score all trajectories (returns ranked list)"""
        pass

    def generate_feedback(self, trajectory: SolverTrajectory, score: float) -> SolverFeedback:
        """Create feedback for Solver to learn from"""
        pass

    def detect_shortcuts(self, trajectory: SolverTrajectory) -> List[str]:
        """Find suspicious patterns in solution"""
        pass

    def is_robust(self, trajectory: SolverTrajectory) -> bool:
        """Does it pass edge case tests?"""
        pass
```

---

### Phase 4: Co-Evolution Loop (Hudson, 3 hours)
```
Subtasks:
  [ ] Create infrastructure/evolution/co_evolution_loop.py (300 lines)
      [ ] CoEvolutionOrchestrator class
      [ ] run_co_evolution() method (main loop)
      [ ] _execute_iteration() helper
      [ ] _check_convergence() helper
      [ ] _update_reward_models() helper
      [ ] Metrics collection and logging
  [ ] Type hints 100% complete
  [ ] Docstrings on all methods
  [ ] 8 unit tests passing
  [ ] OTEL observability integrated
```

**API Contract (must match this exactly):**
```python
class CoEvolutionOrchestrator:
    def __init__(self, solver: SolverAgent, verifier: VerifierAgent, config: ConvergenceCriteria):
        """Initialize with both agents and convergence config"""
        pass

    async def run_co_evolution(self, task: Dict, max_iterations: int = 10) -> Tuple[str, float]:
        """Run competition loop until convergence (returns best_solution, best_score)"""
        pass

    def _check_convergence(self, history: List[Dict]) -> bool:
        """Stop if plateau, confidence reached, or max iterations"""
        pass
```

---

### Phase 5: SE-Darwin Integration (Cora, 2 hours)
```
Subtasks:
  [ ] Modify agents/se_darwin_agent.py
      [ ] Add use_multi_agent_evolve parameter
      [ ] Add flag-based routing in evolve_solution()
      [ ] Route to co-evolution when flag=True
      [ ] Keep old path when flag=False (backward compatibility)
  [ ] Update initialization to support both paths
  [ ] Test backward compatibility
  [ ] 3 integration tests passing
```

**Code Change (approximately):**
```python
# In SEDarwinAgent.evolve_solution()
if self.use_multi_agent_evolve:
    # New path: Co-evolution
    orchestrator = CoEvolutionOrchestrator(solver, verifier, config)
    best_solution, score = await orchestrator.run_co_evolution(task)
else:
    # Old path: Single-agent SE-Darwin (existing code)
    best_solution = await self._evolve_solution_impl(task)
```

---

### Phase 6: Testing & Benchmarking (Cora, 2 hours)
```
Subtasks:
  [ ] Create tests/integration/test_multi_agent_evolve.py (200 lines)
      [ ] Test Solver Agent (6 tests)
      [ ] Test Verifier Agent (6 tests)
      [ ] Test Co-Evolution Loop (6 tests)
      [ ] Test SE-Darwin Integration (3 tests)
      [ ] Test HALO Router Compatibility (2 tests)
      [ ] Total: 23 tests, >85% coverage

  [ ] Create tests/benchmarks/test_multi_agent_evolve_perf.py (150 lines)
      [ ] Convergence speed benchmark
      [ ] Accuracy improvement measurement
      [ ] Comparison vs SE-Darwin baseline
      [ ] Performance regression testing
      [ ] Cost analysis (iterations needed)
      [ ] Total: 5 benchmarks

  [ ] Run pytest and verify 28/28 tests passing
  [ ] Generate benchmark report
  [ ] Compare results vs targets (9.0+ quality, <3 iterations)
```

---

## Critical Integration Points

### 1. SE-Darwin Reuse
```
Infrastructure to reuse:
- TrajectoryPool (from infrastructure/trajectory_pool.py)
- SE Operators: RevisionOperator, RecombinationOperator, RefinementOperator
- BenchmarkScenarioLoader (from agents/se_darwin_agent.py)
- CodeQualityValidator (from agents/se_darwin_agent.py)
- TrajectoryStatus, Trajectory types
```

### 2. Type Definitions Location
```
Put in separate files for clarity:
- infrastructure/evolution/types.py (or in __init__.py)
  - SolverTrajectory
  - SolverFeedback
  - VerifierEvaluation
  - VerifierConfig
  - CoEvolutionState
  - ConvergenceCriteria
```

### 3. OTEL Metrics to Instrument
```
Add to each component:
- solver.trajectories_generated (count)
- verifier.evaluations_completed (count)
- co_evolution.convergence_speed (iterations)
- co_evolution.improvement_rate (score delta)
- solver.feedback_adoption_rate (percentage)
- verifier.false_positive_rate (percentage)

Use infrastructure/observability/otel_setup.py existing patterns
```

---

## Testing Strategy

### Unit Tests (20 tests)
```
Phase 2 (Solver):
- test_trajectory_generation_creates_diverse_solutions
- test_feedback_incorporation_updates_rewards
- test_diversity_maintenance_prevents_convergence
- test_confidence_scoring
- test_reward_model_adaptation
- test_operator_selection_based_feedback

Phase 3 (Verifier):
- test_correctness_scoring
- test_quality_scoring
- test_generalization_scoring
- test_robustness_scoring
- test_shortcut_detection_catches_hardcoding
- test_shortcut_detection_catches_special_cases
- test_edge_case_testing
- test_ranking_accuracy

Phase 4 (Co-Evolution):
- test_convergence_detection_on_plateau
- test_convergence_detection_on_confidence
- test_iteration_execution_flow
- test_metrics_collection
- test_error_handling_fallback
- test_max_iterations_limit
```

### Integration Tests (5 tests)
```
- test_multi_agent_evolve_with_se_darwin_routing
- test_backward_compatibility_flag_false
- test_halo_router_compatibility
- test_trajectory_pool_knowledge_sharing
- test_end_to_end_task_solving
```

### Performance Tests (5 tests)
```
- test_convergence_speed_improvement
- test_quality_improvement_vs_baseline
- test_iteration_reduction
- test_false_negative_reduction
- test_cost_reduction
```

---

## Performance Targets

### Must Hit These
```
Quality Improvement: 8.15 → 9.0+ (must improve by 11%)
Convergence Speed: 4.2 → 3.0 iterations (must improve by 30%)
False Negatives: 12% → 5% (must reduce by 50%)
Test Coverage: >85% (minimum)
Type Hint Coverage: 100% (all parameters + returns)
```

### Nice to Have
```
Convergence Speed: 4.2 → 2.4 iterations (paper claims 43% improvement)
False Negatives: 12% → 3% (paper claims 75% improvement)
Test Coverage: >90% (exceeds minimum)
OTEL observability: All metrics tracked and dashboarded
```

---

## Known Dependencies

### Existing Imports You'll Use
```python
# From genesis infrastructure
from infrastructure.trajectory_pool import TrajectoryPool, Trajectory, TrajectoryStatus
from infrastructure.se_operators import RevisionOperator, RecombinationOperator, RefinementOperator
from infrastructure.benchmark_runner import BenchmarkRunner, BenchmarkResult
from infrastructure.security_utils import sanitize_agent_name, redact_credentials

# From genesis agents
from agents.se_darwin_agent import BenchmarkScenarioLoader, CodeQualityValidator

# Standard library
import asyncio
from dataclasses import dataclass
from typing import Dict, List, Tuple, Optional
from enum import Enum
```

### DO NOT Introduce New Dependencies
```
No new pip packages!
No external APIs!
No proprietary libraries!

Stay within existing infrastructure only.
Reuse is the name of the game.
```

---

## Debugging Checklist

### If Solver stops improving
- [ ] Check reward model is updating correctly
- [ ] Verify feedback is being incorporated
- [ ] Check diversity is being maintained
- [ ] Ensure operator selection is adaptive

### If Verifier is fooled (shortcuts pass)
- [ ] Verify shortcut detection patterns are comprehensive
- [ ] Check edge case tests are covering all scenarios
- [ ] Ensure multi-criteria scoring is weighted correctly
- [ ] Add more adversarial test cases

### If convergence is too slow
- [ ] Reduce max_iterations (earlier termination)
- [ ] Lower score_plateau_threshold (more lenient plateau detection)
- [ ] Increase number of Solver trajectories
- [ ] Add early stopping criteria

### If integration with SE-Darwin breaks
- [ ] Verify backward compatibility flag is working
- [ ] Check TrajectoryPool interface matches
- [ ] Ensure Operator types are compatible
- [ ] Test fallback path works

---

## Code Organization Principles

### Keep It Simple
```
Each class: Single responsibility
Each method: One main job
No nested callbacks
No magic numbers (use config)
Explicit > implicit
```

### Logging Strategy
```
DEBUG: Detailed iteration info
INFO: Start/stop/convergence
WARNING: Unusual patterns
ERROR: Failures with fallback

Use get_logger from infrastructure
Add correlation IDs for tracing
```

### Type Hints
```
ALL methods must have:
- Parameter types
- Return type annotation
- Optional[...] for nullable
- Union[...] for multiple types

Use Python 3.12 syntax:
from typing import TypedDict (not typing_extensions)
```

---

## Coordination with Cora

### Handoff Points
1. **After Phase 2 (Solver):** Review API contract, discuss reward model design
2. **After Phase 3 (Verifier):** Review evaluation criteria, discuss edge cases
3. **After Phase 4 (Co-Evolution):** Review orchestration logic, discuss metrics
4. **Phase 5 (Integration):** Cora starts, Hudson available for questions
5. **Phase 6 (Testing):** Parallel work - Hudson reviews tests as written

### Communication Cadence
- Before: Confirm timeline (Hudson 8-11 hours, Cora 4 hours)
- Hourly: Brief check-in during implementation
- End of day: Final verification before commit

---

## Success Criteria: Phase 1 Complete!

✅ Research complete
✅ Paper identified (arXiv:2510.23595)
✅ Architecture designed
✅ Integration planned
✅ Timeline created
✅ Next steps documented

### Phase 2-6 Ready: YES

**Start time:** Whenever you're ready (now recommended)
**Expected finish:** 15 hours later
**Target date:** November 4, 2025

---

## Quick Reference: Paper Facts

**Paper:** arXiv:2510.23595 - "Multi-Agent Evolve: LLM Self-Improve through Co-evolution"

**Key Metrics:**
- Quality: 8.15 → 9.05 (+11%)
- Speed: 4.2 → 2.4 iterations (-43%)
- Robustness: 12% → 3% false negatives (-75%)

**Key Insight:**
"Competitive pressure between agents naturally leads to better solutions than external evaluation, because each agent learns both to solve and to recognize solutions."

**Innovation:**
Instead of Solver generates → External benchmark scores → Improve
Use: Solver generates → Verifier evaluates + provides feedback → Solver learns → Repeat

---

## Links to Reference Docs

- Full Architecture: `/home/genesis/genesis-rebuild/docs/research/MULTI_AGENT_EVOLVE_ARCHITECTURE.md`
- Research Summary: `/home/genesis/genesis-rebuild/docs/research/PHASE1_RESEARCH_SUMMARY.md`
- SE-Darwin Code: `/home/genesis/genesis-rebuild/agents/se_darwin_agent.py`
- TrajectoryPool: `/home/genesis/genesis-rebuild/infrastructure/trajectory_pool.py`
- SE Operators: `/home/genesis/genesis-rebuild/infrastructure/se_operators.py`

---

**You're ready to implement. Good luck!**
