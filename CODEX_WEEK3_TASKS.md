# CODEX WEEK 3 TASKS - Graph-based Planning & Agent Lightning Integration

**Owner:** Codex
**Timeline:** Week 3 (November 4-8, 2025)
**Goal:** Implement GAP planning and Agent Lightning RL for Genesis optimization

---

## TASK 1: Graph-based Agent Planning (GAP) Implementation ⭐ HIGHEST PRIORITY

### Objective
Implement DAG-based parallel execution to reduce turns and tokens by 30-50%.

### Research Reference
- **Paper:** https://arxiv.org/pdf/2510.25320
- **What it does:** Turns requests into dependency graphs (DAG) for parallel tool execution
- **Impact:** Reduces latency by running independent tasks concurrently

### Implementation Steps

**1. Create GAP Planner** (`infrastructure/orchestration/gap_planner.py`):

```python
from typing import List, Dict, Set, Tuple
from dataclasses import dataclass
import asyncio

@dataclass
class Task:
    id: str
    description: str
    dependencies: Set[str]
    result: any = None
    status: str = "pending"  # pending, running, complete, failed

class GAPPlanner:
    """Graph-based Agent Planning - DAG execution engine"""
    
    def parse_plan(self, plan_text: str) -> List[Task]:
        """
        Parse <plan> block into Task objects.
        
        Format:
        <plan>
        Task 1: Fetch user data | Dependencies: none
        Task 2: Calculate metrics | Dependencies: none
        Task 3: Generate report | Dependencies: Task 1, Task 2
        </plan>
        """
        # Extract plan block
        # Parse each line: "Task X: ... | Dependencies: ..."
        # Return list of Task objects
        pass
    
    def build_dag(self, tasks: List[Task]) -> Dict[int, List[Task]]:
        """
        Convert tasks to DAG levels via topological sort.
        
        Returns:
        {
            0: [Task1, Task2],  # Level 0: no dependencies
            1: [Task3],         # Level 1: depends on level 0
        }
        """
        pass
    
    async def execute_level(self, level: List[Task], context: Dict) -> Dict[str, any]:
        """
        Execute all tasks in a level concurrently.
        
        Returns observation dict:
        {
            "Task 1": {...result...},
            "Task 2": {...result...}
        }
        """
        # Use asyncio.gather() for parallel execution
        pass
    
    async def execute_plan(self, plan_text: str) -> str:
        """
        Full GAP execution: parse → DAG → parallel levels → final answer.
        
        Returns:
        <observation>
        {"Task 1": ..., "Task 2": ...}
        </observation>
        <answer>Final synthesis</answer>
        """
        pass
```

**2. Create Planning Prompt Template** (`infrastructure/prompts/gap_planning.txt`):

```
You are a strategic planner. Break down the user's request into a dependency graph.

USER REQUEST: {user_query}

Your task:
1. Think briefly about the approach (<think> tag)
2. Create a dependency plan (<plan> tag)
3. Each task should be atomic and parallelizable where possible

Format:
<think>
Brief reasoning about approach...
</think>

<plan>
Task 1: [description] | Dependencies: none
Task 2: [description] | Dependencies: none
Task 3: [description] | Dependencies: Task 1, Task 2
</plan>

Rules:
- Keep <think> under 100 words
- Each task = one tool call or analysis
- Mark "none" for no dependencies
- List dependencies by task ID (comma-separated)
```

**3. Integrate with HTDAG** (`infrastructure/orchestration/htdag.py`):

```python
from infrastructure.orchestration.gap_planner import GAPPlanner

class HTDAGDecomposer:
    def __init__(self):
        self.gap_planner = GAPPlanner()  # Add GAP planner
    
    async def decompose_with_gap(self, task: Task) -> List[Subtask]:
        """
        Use GAP for complex tasks requiring parallel execution.
        
        Decision logic:
        - Simple task (1-2 steps): Traditional decomposition
        - Complex task (3+ steps): GAP parallel planning
        """
        if self._is_complex(task):
            return await self.gap_planner.execute_plan(task.description)
        else:
            return self._traditional_decompose(task)
```

**4. Write Tests** (`tests/orchestration/test_gap_planner.py`):

```python
def test_parse_plan():
    """Test parsing <plan> block into tasks"""
    pass

def test_build_dag():
    """Test DAG level generation (topological sort)"""
    pass

def test_parallel_execution():
    """Test concurrent task execution within level"""
    pass

def test_end_to_end():
    """Test full GAP flow: parse → DAG → execute → synthesize"""
    pass
```

### Success Criteria
- ✅ Parses <plan> blocks correctly
- ✅ Builds valid DAG (topological sort)
- ✅ Executes independent tasks in parallel
- ✅ 30-50% reduction in total execution time for multi-step tasks
- ✅ All tests passing (20+ tests)

### Deliverables
- `infrastructure/orchestration/gap_planner.py` (300-400 lines)
- `infrastructure/prompts/gap_planning.txt`
- Updated `infrastructure/orchestration/htdag.py` (+50 lines)
- `tests/orchestration/test_gap_planner.py` (20+ tests)
- `docs/GAP_IMPLEMENTATION.md` (usage guide)

---

## TASK 2: Agent Lightning RL Integration (Research Phase)

### Objective
Set up Agent Lightning framework for multi-turn agent improvement via RL.

### Research Reference
- **Paper:** https://arxiv.org/pdf/2508.03680
- **Repo:** https://github.com/microsoft/agent-lightning
- **What it does:** RL framework with hierarchical credit assignment for agent optimization
- **Impact:** Improves multi-turn performance on SQL/RAG/Math QA tasks

### Implementation Steps

**1. Install & Setup:**

```bash
# Create agent-lightning environment
python3 -m venv venv-lightning
source venv-lightning/bin/activate
pip install agent-lightning

# Or add to main requirements.txt
echo "agent-lightning>=0.1.0" >> requirements.txt
```

**2. Define Reward Function** (`infrastructure/evolution/lightning_rewards.py`):

```python
from agent_lightning.rewards import RewardFunction

class GenesisRewardFunction(RewardFunction):
    """
    Custom rewards for Genesis agents:
    - +1.0: Correct output
    - +0.1: Fewer turns (bonus)
    - +0.05: Low latency (< 2s per turn)
    - -0.2: Tool errors
    - -0.5: Failed task
    """
    
    def compute(self, trajectory):
        """
        Trajectory format:
        {
            "turns": [...],
            "final_output": "...",
            "correct": True/False,
            "latency_ms": 1234,
            "tool_errors": 0
        }
        """
        reward = 0.0
        
        # Correctness (primary signal)
        if trajectory["correct"]:
            reward += 1.0
        else:
            reward -= 0.5
        
        # Efficiency bonuses
        turns = len(trajectory["turns"])
        if turns <= 3:
            reward += 0.1  # Prefer fewer turns
        
        if trajectory["latency_ms"] < 2000:
            reward += 0.05  # Prefer fast responses
        
        # Penalties
        reward -= 0.2 * trajectory["tool_errors"]
        
        return reward
```

**3. Trace Collection** (`infrastructure/evolution/trace_collector.py`):

```python
from agent_lightning.store import LightningStore

class TraceCollector:
    """
    Collect per-turn trajectories from Genesis agents.
    
    Trace format:
    {
        "agent": "qa_agent",
        "turns": [
            {
                "observation": "User asked: How to fix import error?",
                "action": "search_docs",
                "tool_output": {...},
                "reward": 0.1
            }
        ],
        "final_result": "...",
        "correct": True,
        "done": True
    }
    """
    
    def __init__(self):
        self.store = LightningStore(path="data/lightning_traces")
    
    def log_trajectory(self, agent_name, turns, final_result, correct):
        """Log a complete agent trajectory"""
        trace = {
            "agent": agent_name,
            "turns": turns,
            "final_result": final_result,
            "correct": correct,
            "done": True
        }
        self.store.add(trace)
    
    def get_traces(self, agent_name=None, limit=1000):
        """Retrieve traces for training"""
        return self.store.query(agent=agent_name, limit=limit)
```

**4. Trainer Configuration** (`configs/lightning_trainer.yaml`):

```yaml
trainer:
  type: "ppo"  # Proximal Policy Optimization
  learning_rate: 0.0001
  batch_size: 32
  epochs: 10
  
trace_store:
  path: "data/lightning_traces"
  format: "jsonl"
  
rewards:
  function: "GenesisRewardFunction"
  normalize: true
  discount_factor: 0.99
  
training:
  max_steps: 10000
  checkpoint_every: 1000
  eval_every: 500
  early_stopping: true
  
agents_to_optimize:
  - "analyst_agent"  # Start with highest-value agent
  - "support_agent"
```

**5. Research Script** (`scripts/research_agent_lightning.py`):

```python
#!/usr/bin/env python3
"""
Research Agent Lightning Integration

This script:
1. Analyzes the agent-lightning repo structure
2. Tests basic trace collection
3. Runs a small training experiment (100 traces)
4. Documents integration points for Genesis
"""

import agent_lightning as al

def explore_api():
    """Explore agent-lightning API"""
    print("Agent Lightning version:", al.__version__)
    print("Available modules:", dir(al))
    
    # Test trace store
    store = al.LightningStore(path="data/test_traces")
    print("Store created:", store)
    
    # Test reward function
    reward_fn = al.rewards.SparseReward()
    print("Reward function:", reward_fn)

def run_mini_experiment():
    """Run minimal training experiment"""
    # Generate 100 synthetic traces
    # Train for 1000 steps
    # Evaluate improvement
    # Document findings
    pass

if __name__ == "__main__":
    explore_api()
    run_mini_experiment()
```

### Success Criteria
- ✅ Agent Lightning installed and tested
- ✅ Reward function defined for Genesis use cases
- ✅ Trace collection working (log 100+ sample traces)
- ✅ Small training experiment completes successfully
- ✅ Integration plan documented

### Deliverables
- `infrastructure/evolution/lightning_rewards.py` (100-150 lines)
- `infrastructure/evolution/trace_collector.py` (150-200 lines)
- `configs/lightning_trainer.yaml`
- `scripts/research_agent_lightning.py` (200-250 lines)
- `docs/AGENT_LIGHTNING_RESEARCH.md` (comprehensive findings)

---

## TASK 3: Benchmark Data Cleanup (Deferred from Week 2)

### Objective
Clean up training data issues identified in quality audit.

### Issues to Fix
1. **PII Scrubbing:** 2,723 emails, 145 phone numbers
2. **Difficulty Rebalancing:** 58% easy → 30% easy, 0% hard → 25% hard

### Steps

**1. PII Scrubbing Script** (`scripts/scrub_pii.py`):

```python
#!/usr/bin/env python3
"""
Scrub PII from training data.

Replaces:
- Emails: user@example.com → [EMAIL]
- Phones: (555) 123-4567 → [PHONE]
- SSNs: 123-45-6789 → [SSN]
- Credit cards: 1234-5678-9012-3456 → [CARD]
"""

import re
import json
from pathlib import Path

PII_PATTERNS = {
    "email": r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b',
    "phone": r'\b(?:\+?1[-.]?)?\(?\d{3}\)?[-.]?\d{3}[-.]?\d{4}\b',
    "ssn": r'\b\d{3}-\d{2}-\d{4}\b',
    "card": r'\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b'
}

def scrub_text(text: str) -> str:
    """Replace PII patterns with placeholders"""
    for pii_type, pattern in PII_PATTERNS.items():
        text = re.sub(pattern, f"[{pii_type.upper()}]", text)
    return text

def scrub_file(input_file: Path, output_file: Path):
    """Scrub PII from a JSONL file"""
    with open(input_file) as fin, open(output_file, 'w') as fout:
        for line in fin:
            example = json.loads(line)
            
            # Scrub all message content
            for msg in example.get("messages", []):
                msg["content"] = scrub_text(msg["content"])
            
            fout.write(json.dumps(example) + "\n")

# Process all files
for agent in ["qa", "content", "legal", "support", "analyst"]:
    scrub_file(
        f"data/generated_examples/{agent}_agent_examples.jsonl",
        f"data/generated_examples_cleaned/{agent}_agent_examples.jsonl"
    )
```

**2. Difficulty Rebalancing** (see CODEX_WEEK2_TASKS.md for full spec):
- Generate 2,000 hard examples using GPT-4o
- Target: 30% easy, 45% medium, 25% hard

### Success Criteria
- ✅ 0 PII instances in cleaned data
- ✅ Difficulty distribution balanced
- ✅ Re-audit shows all quality metrics green

### Deliverables
- `scripts/scrub_pii.py` (100-150 lines)
- `scripts/rebalance_difficulty.py` (200-250 lines)
- `data/generated_examples_cleaned/*.jsonl` (5 files)
- `reports/training_quality_audit_v2.md`

---

## ESTIMATED TIMELINE

**Day 1-2 (Monday-Tuesday):**
- TASK 1: GAP Planner implementation (6-8 hours)
- TASK 1: HTDAG integration (2-3 hours)

**Day 3-4 (Wednesday-Thursday):**
- TASK 1: Testing and documentation (3-4 hours)
- TASK 2: Agent Lightning research and setup (4-6 hours)

**Day 5 (Friday):**
- TASK 3: PII scrubbing + difficulty rebalancing (4-6 hours)
- Final testing and documentation

---

## SUCCESS METRICS

- ✅ GAP reduces execution time by 30-50% for multi-step tasks
- ✅ Agent Lightning installed and basic experiment complete
- ✅ Training data cleaned (0 PII, balanced difficulty)
- ✅ All tests passing (40+ new tests)
- ✅ Documentation complete (3 guides)

---

**PRIORITY ORDER:**
1. TASK 1 (GAP Planning) - HIGHEST PRIORITY - Immediate performance gains
2. TASK 2 (Agent Lightning) - HIGH - Research phase for future optimization
3. TASK 3 (Data Cleanup) - MEDIUM - Quality improvement

**DEPENDENCIES:**
- TASK 1 builds on Layer 1 (HTDAG) from Phase 1-3
- TASK 2 can run in parallel with TASK 1
- TASK 3 is independent, can be done anytime Week 3

---

**START DATE:** Monday, November 4, 2025
**TARGET COMPLETION:** Friday, November 8, 2025
