#!/usr/bin/env python3
"""
Phase 5: Measure Baseline Exploration Costs

Tracks:
- LLM tokens per business generation attempt
- Failure rate: % of attempts that fail or score <70
- Calculate cost: Failed attempts × average LLM cost
"""

import json
import logging
from pathlib import Path
from datetime import datetime
from typing import Dict, List
from collections import defaultdict

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Average LLM cost per 1K tokens (varies by model)
COST_PER_1K_TOKENS = 0.002  # $0.002 per 1K tokens (example)


def analyze_business_logs(log_dir: Path) -> Dict[str, any]:
    """Analyze business generation logs to extract cost metrics."""
    attempts = []
    failures = []
    
    # Scan for business generation logs
    for log_file in log_dir.glob("*.json"):
        try:
            data = json.loads(log_file.read_text())
            if "business_id" in data and "tokens_used" in data:
                attempts.append({
                    "business_id": data["business_id"],
                    "tokens": data.get("tokens_used", 0),
                    "quality_score": data.get("quality_score", 0),
                    "success": data.get("success", False)
                })
                
                if not data.get("success", False) or data.get("quality_score", 0) < 70:
                    failures.append(data["business_id"])
        except Exception as e:
            logger.debug(f"Skipping log file {log_file}: {e}")
    
    if not attempts:
        # Return default structure if no logs found
        return {
            "total_attempts": 0,
            "avg_tokens_per_attempt": 0,
            "failure_rate": 0,
            "total_tokens": 0,
            "total_cost": 0,
            "failed_attempts": 0,
            "failed_cost": 0
        }
    
    total_tokens = sum(a["tokens"] for a in attempts)
    avg_tokens = total_tokens / len(attempts) if attempts else 0
    failure_rate = len(failures) / len(attempts) * 100 if attempts else 0
    total_cost = (total_tokens / 1000) * COST_PER_1K_TOKENS
    failed_cost = (sum(a["tokens"] for a in attempts if a["business_id"] in failures) / 1000) * COST_PER_1K_TOKENS
    
    return {
        "total_attempts": len(attempts),
        "avg_tokens_per_attempt": avg_tokens,
        "failure_rate": failure_rate,
        "total_tokens": total_tokens,
        "total_cost": total_cost,
        "failed_attempts": len(failures),
        "failed_cost": failed_cost,
        "timestamp": datetime.now().isoformat()
    }


def main():
    """Measure baseline exploration costs."""
    log_dir = Path("data/business_logs")
    if not log_dir.exists():
        log_dir = Path("data/agentevolver")  # Fallback
    
    logger.info("Analyzing baseline exploration costs...")
    metrics = analyze_business_logs(log_dir)
    
    print("\n" + "="*60)
    print("Baseline Exploration Cost Analysis")
    print("="*60)
    print(f"Total Attempts: {metrics['total_attempts']}")
    print(f"Average Tokens per Attempt: {metrics['avg_tokens_per_attempt']:,.0f}")
    print(f"Failure Rate: {metrics['failure_rate']:.1f}%")
    print(f"Failed Attempts: {metrics['failed_attempts']}")
    print(f"\nCost Analysis:")
    print(f"  Total Tokens: {metrics['total_tokens']:,.0f}")
    print(f"  Total Cost: ${metrics['total_cost']:.2f}")
    print(f"  Failed Attempts Cost: ${metrics['failed_cost']:.2f}")
    print(f"  Cost per Failed Attempt: ${metrics['failed_cost'] / max(metrics['failed_attempts'], 1):.2f}")
    print("="*60)
    
    # Save results
    output_path = Path("data/agentevolver/baseline_costs.json")
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(metrics, indent=2))
    logger.info(f"Results saved to {output_path}")


if __name__ == "__main__":
    main()

