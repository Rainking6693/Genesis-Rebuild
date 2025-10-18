# Replay Buffer Integration Guide
## How to Connect Replay Buffer to Genesis Agents

This guide shows how to integrate the Replay Buffer into the agent execution loop for automatic trajectory capture.

---

## Pattern 1: Manual Trajectory Recording

Use this when you want full control over what gets recorded.

```python
from datetime import datetime, timezone
from infrastructure.replay_buffer import (
    get_replay_buffer,
    Trajectory,
    ActionStep,
    OutcomeTag
)

# Get singleton buffer
buffer = get_replay_buffer()

# Initialize trajectory tracking
trajectory_id = f"task_{datetime.now().timestamp()}"
agent_id = "builder_agent"
task_description = "Build authentication module"
initial_state = {"requirements": "JWT auth", "deadline": "2 days"}
steps = []
start_time = datetime.now(timezone.utc)

# Execute task steps
step1 = ActionStep(
    timestamp=datetime.now(timezone.utc).isoformat(),
    tool_name="read_spec",
    tool_args={"file": "specs/auth.md"},
    tool_result="Spec loaded: JWT with refresh tokens",
    agent_reasoning="First, I need to understand the requirements"
)
steps.append(step1)

step2 = ActionStep(
    timestamp=datetime.now(timezone.utc).isoformat(),
    tool_name="generate_code",
    tool_args={"spec": "JWT auth", "language": "Python"},
    tool_result="Generated auth.py with 150 lines",
    agent_reasoning="Based on spec, generate JWT authentication code"
)
steps.append(step2)

step3 = ActionStep(
    timestamp=datetime.now(timezone.utc).isoformat(),
    tool_name="run_tests",
    tool_args={"file": "tests/test_auth.py"},
    tool_result="All 15 tests passed",
    agent_reasoning="Verify implementation meets requirements"
)
steps.append(step3)

# Determine outcome and reward
end_time = datetime.now(timezone.utc)
duration = (end_time - start_time).total_seconds()
outcome = OutcomeTag.SUCCESS  # or FAILURE if tests failed
reward = 1.0 if outcome == OutcomeTag.SUCCESS else 0.0

# Store complete trajectory
trajectory = Trajectory(
    trajectory_id=trajectory_id,
    agent_id=agent_id,
    task_description=task_description,
    initial_state=initial_state,
    steps=tuple(steps),
    final_outcome=outcome.value,
    reward=reward,
    metadata={"tests_passed": 15, "lines_of_code": 150},
    created_at=start_time.isoformat(),
    duration_seconds=duration
)

buffer.store_trajectory(trajectory)
```

---

## Pattern 2: Decorator-Based Auto-Capture

Use this to automatically capture tool calls as ActionSteps.

```python
from functools import wraps
from datetime import datetime, timezone
from infrastructure.replay_buffer import ActionStep

# Global trajectory state (use thread-local for production)
current_trajectory_steps = []

def capture_tool_call(tool_name: str):
    """Decorator to auto-capture tool execution as ActionStep"""
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            # Capture reasoning (first arg is usually reasoning/context)
            reasoning = args[0] if args else "No reasoning provided"
            tool_args = kwargs.copy()

            # Execute tool
            result = func(*args, **kwargs)

            # Create ActionStep
            step = ActionStep(
                timestamp=datetime.now(timezone.utc).isoformat(),
                tool_name=tool_name,
                tool_args=tool_args,
                tool_result=str(result)[:500],  # Truncate long results
                agent_reasoning=reasoning
            )

            # Append to current trajectory
            current_trajectory_steps.append(step)

            return result
        return wrapper
    return decorator

# Example usage
@capture_tool_call("read_file")
def read_file(reasoning: str, file_path: str):
    """Read file with auto-capture"""
    with open(file_path, 'r') as f:
        return f.read()

@capture_tool_call("run_command")
def run_command(reasoning: str, command: str):
    """Run command with auto-capture"""
    import subprocess
    result = subprocess.run(command, shell=True, capture_output=True)
    return result.stdout.decode()

# Agent execution
current_trajectory_steps = []  # Reset for new task

content = read_file("Need to read the spec file", "specs/auth.md")
output = run_command("Run tests to verify", "pytest tests/")

# At end of task, store trajectory
from infrastructure.replay_buffer import get_replay_buffer, Trajectory, OutcomeTag

buffer = get_replay_buffer()
trajectory = Trajectory(
    trajectory_id="auto_captured_001",
    agent_id="builder_agent",
    task_description="Auto-captured task",
    initial_state={},
    steps=tuple(current_trajectory_steps),
    final_outcome=OutcomeTag.SUCCESS.value,
    reward=1.0,
    metadata={},
    created_at=datetime.now(timezone.utc).isoformat(),
    duration_seconds=10.0
)
buffer.store_trajectory(trajectory)
```

---

## Pattern 3: Context Manager for Tasks

Use this for clean scoped trajectory recording.

```python
from contextlib import contextmanager
from datetime import datetime, timezone
from infrastructure.replay_buffer import (
    get_replay_buffer,
    Trajectory,
    ActionStep,
    OutcomeTag
)

@contextmanager
def record_trajectory(agent_id: str, task_description: str):
    """Context manager for automatic trajectory recording"""
    trajectory_id = f"{agent_id}_{datetime.now().timestamp()}"
    steps = []
    start_time = datetime.now(timezone.utc)
    initial_state = {}
    outcome = OutcomeTag.UNKNOWN
    reward = 0.0

    # Provide step recorder to context
    def add_step(tool_name: str, tool_args: dict, tool_result: any, reasoning: str):
        step = ActionStep(
            timestamp=datetime.now(timezone.utc).isoformat(),
            tool_name=tool_name,
            tool_args=tool_args,
            tool_result=str(tool_result)[:500],
            agent_reasoning=reasoning
        )
        steps.append(step)

    class TrajectoryRecorder:
        def __init__(self):
            self.add_step = add_step
            self.set_outcome = lambda o: nonlocal_setter('outcome', o)
            self.set_reward = lambda r: nonlocal_setter('reward', r)
            self.set_initial_state = lambda s: nonlocal_setter('initial_state', s)

        def __enter__(self):
            return self

        def __exit__(self, exc_type, exc_val, exc_tb):
            pass

    def nonlocal_setter(var_name, value):
        nonlocal outcome, reward, initial_state
        if var_name == 'outcome':
            outcome = value
        elif var_name == 'reward':
            reward = value
        elif var_name == 'initial_state':
            initial_state = value

    recorder = TrajectoryRecorder()

    try:
        yield recorder
    except Exception as e:
        # Task failed
        outcome = OutcomeTag.FAILURE
        reward = 0.0
        raise
    finally:
        # Store trajectory regardless of success/failure
        end_time = datetime.now(timezone.utc)
        duration = (end_time - start_time).total_seconds()

        trajectory = Trajectory(
            trajectory_id=trajectory_id,
            agent_id=agent_id,
            task_description=task_description,
            initial_state=initial_state,
            steps=tuple(steps),
            final_outcome=outcome.value,
            reward=reward,
            metadata={},
            created_at=start_time.isoformat(),
            duration_seconds=duration
        )

        buffer = get_replay_buffer()
        buffer.store_trajectory(trajectory)

# Usage
with record_trajectory("builder_agent", "Build auth module") as recorder:
    recorder.set_initial_state({"requirements": "JWT"})

    # Execute steps
    recorder.add_step(
        tool_name="read_spec",
        tool_args={"file": "specs/auth.md"},
        tool_result="Spec loaded",
        reasoning="First, read the requirements"
    )

    recorder.add_step(
        tool_name="generate_code",
        tool_args={"language": "Python"},
        tool_result="Code generated",
        reasoning="Generate based on spec"
    )

    # Mark success
    recorder.set_outcome(OutcomeTag.SUCCESS)
    recorder.set_reward(1.0)

# Trajectory automatically stored on exit
```

---

## Pattern 4: Integration with Microsoft Agent Framework

Use this with the Genesis orchestrator agents.

```python
from agent_framework import ChatAgent
from infrastructure.replay_buffer import (
    get_replay_buffer,
    Trajectory,
    ActionStep,
    OutcomeTag
)
from datetime import datetime, timezone

class TrajectoryCapturingAgent(ChatAgent):
    """Agent wrapper that captures all tool calls to Replay Buffer"""

    def __init__(self, *args, agent_id: str, **kwargs):
        super().__init__(*args, **kwargs)
        self.agent_id = agent_id
        self.buffer = get_replay_buffer()
        self.current_trajectory_steps = []
        self.current_task_start = None

    async def run(self, user_message: str):
        """Override run to capture trajectory"""
        # Start new trajectory
        trajectory_id = f"{self.agent_id}_{datetime.now().timestamp()}"
        self.current_trajectory_steps = []
        self.current_task_start = datetime.now(timezone.utc)

        try:
            # Execute agent
            response = await super().run(user_message)

            # Determine outcome from response
            outcome = OutcomeTag.SUCCESS  # Could parse from response
            reward = 1.0

            # Store trajectory
            self._store_trajectory(
                trajectory_id=trajectory_id,
                task_description=user_message,
                outcome=outcome,
                reward=reward
            )

            return response

        except Exception as e:
            # Failed execution
            self._store_trajectory(
                trajectory_id=trajectory_id,
                task_description=user_message,
                outcome=OutcomeTag.FAILURE,
                reward=0.0
            )
            raise

    def _capture_tool_call(self, tool_name: str, tool_args: dict, tool_result: any, reasoning: str):
        """Capture individual tool call"""
        step = ActionStep(
            timestamp=datetime.now(timezone.utc).isoformat(),
            tool_name=tool_name,
            tool_args=tool_args,
            tool_result=str(tool_result)[:500],
            agent_reasoning=reasoning
        )
        self.current_trajectory_steps.append(step)

    def _store_trajectory(self, trajectory_id: str, task_description: str, outcome: OutcomeTag, reward: float):
        """Store complete trajectory"""
        end_time = datetime.now(timezone.utc)
        duration = (end_time - self.current_task_start).total_seconds()

        trajectory = Trajectory(
            trajectory_id=trajectory_id,
            agent_id=self.agent_id,
            task_description=task_description,
            initial_state={},
            steps=tuple(self.current_trajectory_steps),
            final_outcome=outcome.value,
            reward=reward,
            metadata={},
            created_at=self.current_task_start.isoformat(),
            duration_seconds=duration
        )

        self.buffer.store_trajectory(trajectory)

# Usage with Genesis orchestrator
agent = TrajectoryCapturingAgent(
    chat_client=chat_client,
    instructions="You are a builder agent",
    name="BuilderAgent",
    agent_id="builder_agent_001",
    tools=[read_spec, generate_code, run_tests]
)

# All tool calls automatically captured
await agent.run("Build authentication module with JWT")
```

---

## Pattern 5: Learning from Replay Buffer

Use this to sample trajectories for agent improvement.

```python
from infrastructure.replay_buffer import get_replay_buffer, OutcomeTag

buffer = get_replay_buffer()

# Example 1: Get best practices for a task type
best_deploys = buffer.get_successful_trajectories(
    task_type="deploy",
    top_n=5
)

print("Best deployment strategies:")
for traj in best_deploys:
    print(f"\n{traj.trajectory_id} (reward={traj.reward:.2f}):")
    for i, step in enumerate(traj.steps, 1):
        print(f"  {i}. {step.tool_name}: {step.agent_reasoning}")

# Example 2: Learn from failures (contrastive learning)
failed_deploys = buffer.get_failed_trajectories(
    task_type="deploy",
    top_n=5
)

print("\nDeployment failures to avoid:")
for traj in failed_deploys:
    print(f"\n{traj.trajectory_id}:")
    # Find where it went wrong
    for step in traj.steps:
        if "error" in step.tool_result.lower():
            print(f"  Failed at: {step.tool_name}")
            print(f"  Reason: {step.tool_result}")

# Example 3: Sample for training
training_batch = buffer.sample_trajectories(n=32)

# Create training prompt with contrastive examples
successful = [t for t in training_batch if t.final_outcome == OutcomeTag.SUCCESS.value]
failed = [t for t in training_batch if t.final_outcome == OutcomeTag.FAILURE.value]

prompt = f"""
You are learning from {len(successful)} successful examples and {len(failed)} failed examples.

SUCCESSFUL PATTERNS:
"""

for traj in successful[:3]:  # Top 3
    prompt += f"\nTask: {traj.task_description}\n"
    prompt += f"Approach:\n"
    for step in traj.steps:
        prompt += f"- {step.tool_name}: {step.agent_reasoning}\n"

prompt += f"\n\nFAILURES TO AVOID:\n"

for traj in failed[:3]:
    prompt += f"\nTask: {traj.task_description}\n"
    prompt += f"What went wrong:\n"
    for step in traj.steps:
        prompt += f"- {step.tool_name}: {step.agent_reasoning}\n"

prompt += "\n\nNow, apply these lessons to the new task."

# Use this prompt to improve agent performance
```

---

## Pattern 6: Real-Time Monitoring

Use this to track agent performance in production.

```python
from infrastructure.replay_buffer import get_replay_buffer
import time

buffer = get_replay_buffer()

# Monitor statistics in real-time
while True:
    stats = buffer.get_statistics()

    print("\n" + "="*50)
    print("AGENT PERFORMANCE DASHBOARD")
    print("="*50)

    print(f"\nTotal trajectories: {stats['total_trajectories']}")
    print(f"Average reward: {stats['avg_reward']:.2f}")
    print(f"Average duration: {stats['avg_duration_seconds']:.1f}s")

    print(f"\nOutcomes:")
    for outcome, count in stats['by_outcome'].items():
        percentage = (count / stats['total_trajectories'] * 100) if stats['total_trajectories'] > 0 else 0
        print(f"  {outcome}: {count} ({percentage:.1f}%)")

    print(f"\nAgent Performance:")
    for agent_id, agent_stats in stats['by_agent'].items():
        print(f"  {agent_id}:")
        print(f"    Success rate: {agent_stats['success_rate']:.1%}")
        print(f"    Avg reward: {agent_stats['avg_reward']:.2f}")
        print(f"    Total tasks: {agent_stats['total']}")

    time.sleep(10)  # Update every 10 seconds
```

---

## Integration Checklist

- [ ] Choose integration pattern (manual, decorator, context manager, or framework wrapper)
- [ ] Add trajectory capture to agent execution loop
- [ ] Determine outcome criteria (how to decide SUCCESS vs FAILURE)
- [ ] Set reward function (0.0 to 1.0 based on task performance)
- [ ] Configure MongoDB/Redis (or use in-memory for development)
- [ ] Add monitoring dashboard for agent performance
- [ ] Set up pruning schedule (remove old trajectories)
- [ ] Connect to ReasoningBank for strategy distillation

---

## Best Practices

1. **Capture Reasoning:** Always include why the agent chose each action (enables learning)
2. **Consistent Outcomes:** Use same OutcomeTag criteria across all agents
3. **Meaningful Rewards:** Reward should reflect actual task success (not just completion)
4. **Prune Regularly:** Old trajectories consume storage (prune monthly)
5. **Monitor Performance:** Track success rate per agent to identify issues
6. **Contrastive Learning:** Always sample both successes and failures for training
7. **Random Sampling:** Use random sampling (not just recent) to avoid recency bias

---

## Next Steps

After integrating Replay Buffer:

1. **Connect to Darwin Gödel Machine:** Use trajectories for code self-improvement
2. **Add Reflection Module:** Agents analyze their own failures
3. **Distill to ReasoningBank:** Convert trajectories to reusable strategies
4. **Fine-Tune Prompts:** Use successful trajectories to improve agent prompts
5. **Deploy Monitoring:** Real-time dashboard for agent performance

---

## Questions?

See:
- `/home/genesis/genesis-rebuild/docs/replay_buffer_implementation_summary.md` (architecture)
- `/home/genesis/genesis-rebuild/demo_replay_buffer.py` (working examples)
- `/home/genesis/genesis-rebuild/test_replay_buffer.py` (test cases)
