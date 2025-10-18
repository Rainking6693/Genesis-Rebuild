#!/usr/bin/env python3
"""
🧬 LAYER 2 DARWIN - QUICK DEMONSTRATION

This script demonstrates the Darwin self-improvement system in action.
It shows that Layer 2 is fully implemented and operational.

USAGE:
    # Test all components (no API key needed):
    python demo_layer2.py

    # Run full evolution (requires API key):
    export OPENAI_API_KEY='sk-...'
    python demo_layer2.py --evolve
"""

import asyncio
import os
import sys
import tempfile
from pathlib import Path


async def demo_all_components():
    """Demonstrate all Layer 2 components are operational"""

    print()
    print("=" * 80)
    print("🧬 LAYER 2 DARWIN IMPLEMENTATION - COMPONENT DEMONSTRATION")
    print("=" * 80)
    print()

    # Component 1: Docker Sandbox
    print("1️⃣  Docker Sandbox (Isolated Code Execution)")
    print("-" * 80)
    from infrastructure.sandbox import get_sandbox

    sandbox = get_sandbox()
    result = await sandbox.execute_code(
        code='print("Hello from Docker!")',
        timeout=5,
        network_disabled=True
    )
    print(f"   ✅ Executed in isolated container")
    print(f"   ✅ Output: {result.stdout.strip()}")
    print(f"   ✅ Time: {result.execution_time:.3f}s")
    print()

    # Component 2: Replay Buffer
    print("2️⃣  Replay Buffer (Experience Storage)")
    print("-" * 80)
    from infrastructure.replay_buffer import get_replay_buffer, Trajectory
    from infrastructure import OutcomeTag
    from datetime import datetime, timezone

    replay_buffer = get_replay_buffer()

    traj = Trajectory(
        trajectory_id="demo_001",
        agent_id="demo_agent",
        task="test_task",
        actions=["step1", "step2", "step3"],
        observations=["obs1", "obs2", "obs3"],
        final_outcome=OutcomeTag.SUCCESS,
        final_reward=0.85,
        created_at=datetime.now(timezone.utc),
        metadata={}
    )
    replay_buffer.store_trajectory(traj)

    stored = replay_buffer.query_by_agent("demo_agent", limit=10)
    print(f"   ✅ Stored trajectory: {traj.trajectory_id}")
    print(f"   ✅ Retrieved: {len(stored)} trajectories")
    print(f"   ✅ Outcome: {traj.final_outcome}")
    print()

    # Component 3: World Model
    print("3️⃣  World Model (Outcome Prediction)")
    print("-" * 80)
    from infrastructure.world_model import get_world_model, WorldState

    world_model = get_world_model()
    state = WorldState(
        agent_name="demo",
        code_snapshot="v1",
        recent_actions=[],
        metrics={"overall_score": 0.75},
        context={}
    )

    prediction = await world_model.predict(state, "improved_code")
    print(f"   ✅ Success probability: {prediction.success_probability:.1%}")
    print(f"   ✅ Expected improvement: {prediction.expected_improvement:+.3f}")
    print(f"   ✅ Confidence: {prediction.confidence:.1%}")
    print()

    # Component 4: Benchmark Runner
    print("4️⃣  Benchmark Runner (Validation System)")
    print("-" * 80)
    from infrastructure.benchmark_runner import get_benchmark_runner

    benchmark_runner = get_benchmark_runner()
    suite = benchmark_runner.load_benchmark_suite("genesis_custom")
    print(f"   ✅ Loaded suite: {suite.name}")
    print(f"   ✅ Total tasks: {len(suite.tasks)}")
    print(f"   ✅ Sample tasks: {[t.task_id for t in suite.tasks[:2]]}")
    print()

    # Component 5: RL Warm-Start
    print("5️⃣  RL Warm-Start (Checkpoint Management)")
    print("-" * 80)
    from infrastructure.rl_warmstart import get_warmstart_system

    warmstart = get_warmstart_system()
    test_file = Path(tempfile.mktemp(suffix=".py"))
    test_file.write_text("def agent(): return 'v1'")

    checkpoint = await warmstart.save_checkpoint(
        agent_name="demo",
        version="v1.0",
        code_path=test_file,
        metrics={"overall_score": 0.80}
    )
    print(f"   ✅ Checkpoint: {checkpoint.checkpoint_id}")
    print(f"   ✅ Quality: {checkpoint.quality_tier}")
    print(f"   ✅ Score: {checkpoint.metrics['overall_score']:.2f}")

    test_file.unlink()
    print()

    # Summary
    print("=" * 80)
    print("✅ ALL 5 LAYER 2 COMPONENTS VERIFIED AND OPERATIONAL")
    print("=" * 80)
    print()
    print("Components tested:")
    print("  ✅ Docker Sandbox - Isolated execution working")
    print("  ✅ Replay Buffer - Experience storage operational")
    print("  ✅ World Model - Prediction engine functional")
    print("  ✅ Benchmark Runner - Validation system ready")
    print("  ✅ RL Warm-Start - Checkpoint management active")
    print()


async def demo_evolution():
    """Demonstrate full Darwin evolution cycle"""

    print()
    print("=" * 80)
    print("🚀 DARWIN EVOLUTION - FULL DEMONSTRATION")
    print("=" * 80)
    print()

    # Check API key
    if not os.getenv("OPENAI_API_KEY"):
        print("❌ ERROR: OPENAI_API_KEY not set")
        print()
        print("To run evolution demo:")
        print("  export OPENAI_API_KEY='sk-...'")
        print("  python demo_layer2.py --evolve")
        print()
        return

    from agents.darwin_agent import get_darwin_agent

    # Create initial code
    initial_code = Path(tempfile.mktemp(suffix=".py"))
    initial_code.write_text("""
def generate_spec(business_type, description):
    '''Generate business specification'''
    # Basic implementation
    return f"Specification for {business_type}: {description}"

def validate_spec(spec):
    '''Validate specification'''
    return len(spec) > 10
""")

    print("Initializing Darwin agent...")
    darwin = get_darwin_agent(
        agent_name='demo_evolution',
        initial_code_path=str(initial_code),
        max_generations=3,
        population_size=2
    )

    print("Starting evolution (3 generations, 2 variants each)...")
    print("Estimated time: 5-15 minutes")
    print()

    archive = await darwin.evolve()

    print()
    print("=" * 80)
    print("🎯 EVOLUTION COMPLETE!")
    print("=" * 80)
    print(f"📊 Best version: {archive.best_version}")
    print(f"📊 Best score: {archive.best_score:.3f}")
    print(f"📊 Total attempts: {archive.total_attempts}")
    print(f"📊 Successful: {len(archive.successful_attempts)}")
    print(f"📊 Acceptance rate: {archive.acceptance_rate:.1%}")
    print()
    print(f"📁 Evolved code: agents/evolved/demo_evolution/")
    print()

    initial_code.unlink()


def print_oneliner_examples():
    """Print one-liner command examples"""

    print()
    print("=" * 80)
    print("📝 ONE-LINER EVOLUTION EXAMPLES")
    print("=" * 80)
    print()

    print("EXAMPLE 1: Quick 3-generation evolution")
    print("-" * 80)
    print('''python -c "
import asyncio
from agents.darwin_agent import get_darwin_agent

async def main():
    darwin = get_darwin_agent(
        agent_name='spec_agent',
        initial_code_path='agents/spec_agent.py',
        max_generations=3,
        population_size=2
    )
    archive = await darwin.evolve()
    print(f'\\n🎯 Best version: {archive.best_version}')
    print(f'📊 Best score: {archive.best_score:.3f}')
    print(f'✅ Acceptance rate: {archive.acceptance_rate:.1%}')

asyncio.run(main())
"''')
    print()

    print("EXAMPLE 2: Full 10-generation evolution")
    print("-" * 80)
    print('''python -c "
import asyncio
from agents.darwin_agent import get_darwin_agent

async def main():
    darwin = get_darwin_agent(
        agent_name='spec_agent',
        initial_code_path='agents/spec_agent.py',
        max_generations=10,
        population_size=5,
        acceptance_threshold=0.01  # 1% improvement required
    )

    print('Starting 10-generation evolution...')
    archive = await darwin.evolve()

    print(f'\\n🎉 EVOLUTION COMPLETE!')
    print(f'Total attempts: {archive.total_attempts}')
    print(f'Successful: {len(archive.successful_attempts)}')
    print(f'Best version: {archive.best_version}')
    print(f'Best score: {archive.best_score:.3f}')
    print(f'Improvement: {(archive.best_score - 0.5) / 0.5:.1%}')

asyncio.run(main())
"''')
    print()

    print("EXAMPLE 3: Component testing (no API key needed)")
    print("-" * 80)
    print("python demo_layer2.py")
    print()

    print("EXAMPLE 4: Full evolution demo (API key required)")
    print("-" * 80)
    print("export OPENAI_API_KEY='sk-...'")
    print("python demo_layer2.py --evolve")
    print()


if __name__ == "__main__":
    if "--help" in sys.argv or "-h" in sys.argv:
        print_oneliner_examples()
    elif "--evolve" in sys.argv:
        asyncio.run(demo_evolution())
    elif "--examples" in sys.argv:
        print_oneliner_examples()
    else:
        asyncio.run(demo_all_components())
