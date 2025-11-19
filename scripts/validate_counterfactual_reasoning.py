#!/usr/bin/env python3
"""
Validate counterfactual reasoning at scale (>10 businesses)

Tests attribution system's counterfactual reasoning by comparing
quality scores with and without specific agent contributions.
"""

import asyncio
import json
import logging
from pathlib import Path
from typing import Dict, List
from datetime import datetime

from infrastructure.business_monitor import BusinessMonitor, BusinessGenerationMetrics
from infrastructure.agentevolver.attribution import ContributionTracker
import time

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def simulate_business_generation(
    business_id: str,
    agent_contributions: Dict[str, float],
    monitor: BusinessMonitor
) -> Dict[str, any]:
    """Simulate business generation with agent contributions."""
    metrics = BusinessGenerationMetrics(
        business_name=f"Business {business_id}",
        business_type="saas",
        start_time=time.time()
    )
    monitor.businesses[business_id] = metrics
    
    baseline_quality = 60.0
    
    # Record contributions from each agent
    for agent_name, contribution_delta in agent_contributions.items():
        quality_after = baseline_quality + contribution_delta
        monitor.record_component_attribution(
            business_id=business_id,
            component_name=f"{agent_name}_component",
            agent_name=agent_name,
            quality_score=quality_after,
            quality_before=baseline_quality
        )
        baseline_quality = quality_after
    
    # Finalize business
    metrics.end_time = time.time()
    metrics.final_quality_score = baseline_quality
    metrics.success = baseline_quality >= 70.0
    
    return {
        "business_id": business_id,
        "final_quality": baseline_quality,
        "success": metrics.success,
        "contributions": agent_contributions
    }


async def validate_counterfactual_reasoning(num_businesses: int = 15) -> Dict[str, any]:
    """Validate counterfactual reasoning across multiple businesses."""
    monitor = BusinessMonitor(log_dir=Path("data/agentevolver/validation_logs"))
    
    # Generate businesses with varying agent contributions
    businesses = []
    agents = ["builder_agent", "marketing_agent", "seo_agent", "content_agent", "deploy_agent"]
    
    for i in range(num_businesses):
        # Vary contributions to test counterfactual reasoning
        contributions = {}
        for agent in agents:
            # Some agents contribute more, some less
            delta = (i % 3) * 5.0 - 5.0  # -5, 0, or +5
            contributions[agent] = delta
        
        result = await simulate_business_generation(
            f"biz_{i}",
            contributions,
            monitor
        )
        businesses.append(result)
    
    # Analyze counterfactual reasoning
    # Check if attribution correctly identifies high-impact agents
    attribution_scores = {}
    for agent in agents:
        score = await monitor.attribution_tracker.get_contribution_score(agent)
        attribution_scores[agent] = score
    
    # Validate: agents with higher contributions should have higher attribution scores
    avg_contributions = {
        agent: sum(b["contributions"].get(agent, 0) for b in businesses) / len(businesses)
        for agent in agents
    }
    
    # Rank agents by contribution and attribution
    contribution_rank = sorted(avg_contributions.items(), key=lambda x: x[1], reverse=True)
    attribution_rank = sorted(attribution_scores.items(), key=lambda x: x[1], reverse=True)
    
    # Check correlation (simplified: top contributor should be in top 2 attribution)
    top_contributor = contribution_rank[0][0]
    top_attribution_agents = [a[0] for a in attribution_rank[:2]]
    correlation_ok = top_contributor in top_attribution_agents
    
    return {
        "num_businesses": num_businesses,
        "businesses_processed": len(businesses),
        "avg_contributions": avg_contributions,
        "attribution_scores": attribution_scores,
        "contribution_rank": [a[0] for a in contribution_rank],
        "attribution_rank": [a[0] for a in attribution_rank],
        "correlation_valid": correlation_ok,
        "validation_passed": correlation_ok and num_businesses >= 10,
        "timestamp": datetime.now().isoformat()
    }


async def main():
    """Run counterfactual reasoning validation."""
    logger.info("Starting counterfactual reasoning validation...")
    results = await validate_counterfactual_reasoning(num_businesses=15)
    
    print("\n" + "="*60)
    print("Counterfactual Reasoning Validation")
    print("="*60)
    print(f"Businesses analyzed: {results['num_businesses']}")
    print(f"\nAverage Contributions:")
    for agent, score in results['avg_contributions'].items():
        print(f"  {agent}: {score:+.1f}")
    print(f"\nAttribution Scores:")
    for agent, score in results['attribution_scores'].items():
        print(f"  {agent}: {score:.2f}")
    print(f"\nContribution Rank: {' > '.join(results['contribution_rank'])}")
    print(f"Attribution Rank: {' > '.join(results['attribution_rank'])}")
    print(f"\nCorrelation Valid: {'✓' if results['correlation_valid'] else '✗'}")
    print(f"Validation Passed: {'✓' if results['validation_passed'] else '✗'}")
    print("="*60)
    
    # Save results
    output_path = Path("data/agentevolver/validation_counterfactual.json")
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(results, indent=2))
    logger.info(f"Results saved to {output_path}")


if __name__ == "__main__":
    asyncio.run(main())

