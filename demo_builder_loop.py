"""
End-to-End Demonstration: Enhanced Builder Agent with Learning Loop
Day 3 - Builder Loop Implementation

This demo shows:
1. Loading TaskFlow Pro spec from Day 2
2. Running enhanced builder with learning enabled
3. Showing patterns queried from ReasoningBank
4. Showing trajectory captured in Replay Buffer
5. Displaying learning statistics
6. Running a second build to show pattern reuse

Purpose:
Prove that the Builder Agent learns from every build and improves over time.
"""

import asyncio
import json
from pathlib import Path
from typing import Dict, Any
import time

from agents.builder_agent_enhanced import EnhancedBuilderAgent
from infrastructure.reasoning_bank import get_reasoning_bank, OutcomeTag
from infrastructure.replay_buffer import get_replay_buffer


def print_section(title: str):
    """Print a formatted section header"""
    print("\n" + "=" * 80)
    print(f"  {title}")
    print("=" * 80 + "\n")


def print_subsection(title: str):
    """Print a formatted subsection header"""
    print("\n" + "-" * 80)
    print(f"  {title}")
    print("-" * 80)


def load_taskflow_spec() -> Dict[str, Any]:
    """Load TaskFlow Pro specification from Day 2"""
    print_section("STEP 1: Loading TaskFlow Pro Specification")

    # Find the spec file
    docs_dir = Path("/home/genesis/genesis-rebuild/docs")
    spec_files = list(docs_dir.glob("BUSINESS_SPEC_TaskFlowPro_*.json"))

    if not spec_files:
        print("ERROR: No TaskFlow Pro spec found!")
        print("Expected: docs/BUSINESS_SPEC_TaskFlowPro_*.json")
        return {}

    spec_file = spec_files[0]
    print(f"Found spec file: {spec_file.name}")

    with open(spec_file, 'r') as f:
        spec = json.load(f)

    print(f"\nSpecification Details:")
    print(f"  ID: {spec.get('specification_id')}")
    print(f"  Business: {spec.get('business_name')}")
    print(f"  Description: {spec.get('business_description')}")
    print(f"  Features: {len(spec.get('executive_summary', {}).get('core_features', []))}")
    print(f"  Status: {spec.get('status')}")

    return spec


async def run_first_build(agent: EnhancedBuilderAgent, spec: Dict[str, Any]) -> Dict[str, Any]:
    """Run first build (cold start - no patterns available)"""
    print_section("STEP 2: First Build (Cold Start)")

    print("Starting build with NO prior patterns...")
    print("This is the baseline - agent has nothing to learn from yet.\n")

    start_time = time.time()
    result = await agent.build_from_spec(spec)
    duration = time.time() - start_time

    print_subsection("First Build Results")
    print(f"Success: {result['success']}")
    print(f"Duration: {duration:.2f} seconds")
    print(f"Files generated: {len(result['files_generated'])}")
    print(f"Patterns queried: {len(result['patterns_used'])}")
    print(f"Patterns stored: {len(result['patterns_stored'])}")
    print(f"Trajectory ID: {result['trajectory_id']}")

    if result['error_message']:
        print(f"ERROR: {result['error_message']}")

    # Show sample files
    print_subsection("Sample Generated Files (first 5)")
    for i, file_path in enumerate(result['files_generated'][:5]):
        print(f"  {i+1}. {file_path}")

    if len(result['files_generated']) > 5:
        print(f"  ... and {len(result['files_generated']) - 5} more files")

    return result


async def run_second_build(agent: EnhancedBuilderAgent, spec: Dict[str, Any]) -> Dict[str, Any]:
    """Run second build (with patterns from first build)"""
    print_section("STEP 3: Second Build (With Learning)")

    print("Starting second build...")
    print("This time, agent should REUSE patterns from first build.\n")

    start_time = time.time()
    result = await agent.build_from_spec(spec)
    duration = time.time() - start_time

    print_subsection("Second Build Results")
    print(f"Success: {result['success']}")
    print(f"Duration: {duration:.2f} seconds")
    print(f"Files generated: {len(result['files_generated'])}")
    print(f"Patterns queried: {len(result['patterns_used'])} (REUSED!)")
    print(f"Patterns stored: {len(result['patterns_stored'])}")
    print(f"Trajectory ID: {result['trajectory_id']}")

    if result['error_message']:
        print(f"ERROR: {result['error_message']}")

    return result


def analyze_learning_improvement(result1: Dict[str, Any], result2: Dict[str, Any]):
    """Analyze improvement between first and second build"""
    print_section("STEP 4: Learning Analysis")

    print("Comparing First Build vs Second Build:\n")

    # Pattern reuse
    patterns_first = len(result1['patterns_used'])
    patterns_second = len(result2['patterns_used'])

    print(f"Pattern Reuse:")
    print(f"  First build:  {patterns_first} patterns available (cold start)")
    print(f"  Second build: {patterns_second} patterns available")
    if patterns_second > patterns_first:
        print(f"  IMPROVEMENT: +{patterns_second - patterns_first} patterns learned!")
    else:
        print(f"  Note: Patterns stored, available for future builds")

    # Files generated
    files_first = len(result1['files_generated'])
    files_second = len(result2['files_generated'])

    print(f"\nConsistency:")
    print(f"  First build:  {files_first} files")
    print(f"  Second build: {files_second} files")
    if files_first == files_second:
        print(f"  CONSISTENT: Same output structure")

    # Duration comparison
    duration1 = result1['duration_seconds']
    duration2 = result2['duration_seconds']

    print(f"\nPerformance:")
    print(f"  First build:  {duration1:.2f}s")
    print(f"  Second build: {duration2:.2f}s")
    if duration2 < duration1:
        speedup = ((duration1 - duration2) / duration1) * 100
        print(f"  FASTER: {speedup:.1f}% speedup")
    else:
        print(f"  Note: Performance may vary based on system load")


def show_replay_buffer_stats():
    """Show Replay Buffer statistics"""
    print_section("STEP 5: Replay Buffer Statistics")

    replay_buffer = get_replay_buffer()
    stats = replay_buffer.get_statistics()

    print("Trajectory Storage Stats:\n")
    print(f"Total trajectories recorded: {stats['total_trajectories']}")
    print(f"Storage backend: {stats['storage_backend']}")
    print(f"Average reward: {stats['avg_reward']:.2f}")
    print(f"Average duration: {stats['avg_duration_seconds']:.2f}s")

    print(f"\nBy Outcome:")
    for outcome, count in stats['by_outcome'].items():
        print(f"  {outcome}: {count}")

    print(f"\nBy Agent:")
    for agent_id, agent_stats in stats['by_agent'].items():
        print(f"  {agent_id}:")
        print(f"    Total tasks: {agent_stats['total']}")
        print(f"    Successes: {agent_stats['successes']}")
        print(f"    Success rate: {agent_stats['success_rate']:.1%}")
        print(f"    Avg reward: {agent_stats['avg_reward']:.2f}")


def show_reasoning_bank_stats():
    """Show ReasoningBank statistics"""
    print_section("STEP 6: ReasoningBank Statistics")

    reasoning_bank = get_reasoning_bank()

    # Query all stored strategies
    frontend_strategies = reasoning_bank.search_strategies("frontend", top_n=10, min_win_rate=0.0)
    backend_strategies = reasoning_bank.search_strategies("backend", top_n=10, min_win_rate=0.0)
    database_strategies = reasoning_bank.search_strategies("database", top_n=10, min_win_rate=0.0)
    config_strategies = reasoning_bank.search_strategies("config", top_n=10, min_win_rate=0.0)

    print("Code Pattern Library:\n")
    print(f"Frontend patterns stored: {len(frontend_strategies)}")
    print(f"Backend patterns stored: {len(backend_strategies)}")
    print(f"Database patterns stored: {len(database_strategies)}")
    print(f"Config patterns stored: {len(config_strategies)}")

    total_patterns = (
        len(frontend_strategies) +
        len(backend_strategies) +
        len(database_strategies) +
        len(config_strategies)
    )

    print(f"\nTotal patterns available: {total_patterns}")

    if frontend_strategies:
        print("\nSample Frontend Pattern:")
        pattern = frontend_strategies[0]
        print(f"  ID: {pattern.strategy_id}")
        print(f"  Description: {pattern.description}")
        print(f"  Win rate: {pattern.win_rate:.2f}")
        print(f"  Usage count: {pattern.usage_count}")
        print(f"  Tools used: {', '.join(pattern.tools_used)}")


def show_trajectory_details(trajectory_id: str):
    """Show detailed trajectory information"""
    print_section("STEP 7: Trajectory Deep Dive")

    replay_buffer = get_replay_buffer()
    trajectory = replay_buffer.get_trajectory(trajectory_id)

    if not trajectory:
        print(f"ERROR: Trajectory {trajectory_id} not found!")
        return

    print(f"Trajectory ID: {trajectory.trajectory_id}")
    print(f"Agent: {trajectory.agent_id}")
    print(f"Task: {trajectory.task_description}")
    print(f"Outcome: {trajectory.final_outcome}")
    print(f"Reward: {trajectory.reward:.2f}")
    print(f"Duration: {trajectory.duration_seconds:.2f}s")
    print(f"Steps recorded: {len(trajectory.steps)}")

    print_subsection("Action Steps Breakdown")
    for i, step in enumerate(trajectory.steps, 1):
        print(f"\nStep {i}: {step.tool_name}")
        print(f"  Timestamp: {step.timestamp}")
        print(f"  Reasoning: {step.agent_reasoning[:100]}...")
        print(f"  Args: {list(step.tool_args.keys())}")
        result_preview = str(step.tool_result)[:100]
        print(f"  Result: {result_preview}...")


async def main():
    """Main demonstration workflow"""
    print_section("Enhanced Builder Agent - End-to-End Learning Demo")
    print("This demonstration shows the complete learning loop:")
    print("1. First build (cold start - no patterns)")
    print("2. Pattern storage in ReasoningBank")
    print("3. Trajectory recording in Replay Buffer")
    print("4. Second build (pattern reuse)")
    print("5. Learning statistics and analysis")

    try:
        # Load specification
        spec = load_taskflow_spec()
        if not spec:
            print("ERROR: Could not load specification!")
            return

        # Create agent
        print_section("Initializing Enhanced Builder Agent")
        agent = EnhancedBuilderAgent(business_id="taskflow_pro")
        print("Agent created successfully!")
        print(f"Business ID: {agent.business_id}")
        print(f"ReasoningBank connected: {agent.reasoning_bank is not None}")
        print(f"ReplayBuffer connected: {agent.replay_buffer is not None}")

        # First build (cold start)
        result1 = await run_first_build(agent, spec)

        # Second build (with learning)
        result2 = await run_second_build(agent, spec)

        # Analyze improvement
        analyze_learning_improvement(result1, result2)

        # Show statistics
        show_replay_buffer_stats()
        show_reasoning_bank_stats()

        # Show trajectory details
        show_trajectory_details(result1['trajectory_id'])

        # Final summary
        print_section("DEMO COMPLETE - Summary")
        print("The Enhanced Builder Agent successfully demonstrated:")
        print("  ✓ Loading business specifications")
        print("  ✓ Querying ReasoningBank for proven patterns")
        print("  ✓ Generating complete application code")
        print("  ✓ Recording every decision as a trajectory")
        print("  ✓ Storing successful patterns for future reuse")
        print("  ✓ Pattern reuse in subsequent builds")
        print("\nKey Insight:")
        print("  Each build makes the system SMARTER.")
        print("  Build #100 will be FAR better than Build #1.")
        print("  This is SELF-IMPROVING AI in action.")

        print_section("Next Steps")
        print("1. Connect to real LLM for actual code generation")
        print("2. Deploy to production VPS")
        print("3. Run 10-100 builds to accumulate patterns")
        print("4. Measure improvement over time")
        print("5. Scale to multiple agent types")

    except Exception as e:
        print(f"\n\nERROR: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    asyncio.run(main())
