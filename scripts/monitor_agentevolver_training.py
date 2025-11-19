#!/usr/bin/env python3
"""
AgentEvolver Curiosity Training Monitor
========================================

Monitor AgentEvolver curiosity training in production.
Tracks task generation, experience reuse, and cost savings.
"""

import json
import time
from pathlib import Path
from datetime import datetime
from infrastructure.agentevolver import SelfQuestioningEngine, HybridPolicy, CostTracker


def monitor_training():
    """Monitor AgentEvolver training in production."""
    print("=" * 80)
    print("AGENTEVOLVER CURIOSITY TRAINING MONITOR")
    print("=" * 80)
    print(f"Start Time: {datetime.now().isoformat()}")
    print()

    # Initialize components
    engine = SelfQuestioningEngine()
    policy = HybridPolicy()
    cost_tracker = CostTracker()

    # Get statistics
    engine_stats = engine.get_statistics() if hasattr(engine, 'get_statistics') else {}
    policy_stats = policy.get_statistics() if hasattr(policy, 'get_statistics') else {}
    cost_stats = cost_tracker.get_statistics() if hasattr(cost_tracker, 'get_statistics') else {}

    print("📊 SelfQuestioningEngine Statistics:")
    print(f"  Total Tasks Generated: {engine_stats.get('total_tasks', 0)}")
    print(f"  Avg Difficulty: {engine_stats.get('avg_difficulty', 0.0):.2f}")
    print(f"  Avg Grounding: {engine_stats.get('avg_grounding', 0.0):.2f}")
    print()

    print("🎯 HybridPolicy Statistics:")
    print(f"  Exploit Ratio: {policy_stats.get('exploit_ratio', 0.85):.2f}")
    print(f"  Total Decisions: {policy_stats.get('total_decisions', 0)}")
    print(f"  Exploit Count: {policy_stats.get('exploit_count', 0)}")
    print(f"  Explore Count: {policy_stats.get('explore_count', 0)}")
    print()

    print("💰 Cost Tracking:")
    print(f"  Total Calls: {cost_stats.get('total_calls', 0)}")
    print(f"  Total Cost: ${cost_stats.get('total_cost', 0.0):.2f}")
    print(f"  Cost per Call: ${cost_stats.get('cost_per_call', 0.015):.3f}")
    print()

    # Check for training data
    training_data_path = Path("data/agentevolver")
    if training_data_path.exists():
        curiosity_ideas = list(training_data_path.glob("curiosity_ideas.jsonl"))
        coverage_files = list(training_data_path.glob("coverage.json"))
        print(f"📁 Training Data Files:")
        print(f"  Curiosity Ideas: {len(curiosity_ideas)} file(s)")
        print(f"  Coverage Files: {len(coverage_files)} file(s)")
    else:
        print("⚠️  No training data directory found")

    print()
    print("=" * 80)
    print("✅ Monitoring complete")


if __name__ == "__main__":
    monitor_training()
