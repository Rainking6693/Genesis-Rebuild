#!/usr/bin/env python3
"""
Intelligent Scenario Expansion Script
Expands all benchmark scenario files to 18 scenarios using template-based variation
"""
import json
import copy
from pathlib import Path
from typing import List, Dict, Any

# Variation templates per agent type
VARIATIONS = {
    "analyst": [
        {"data_type": "product_performance", "time_period": "weekly", "metrics": ["usage", "adoption", "feedback"]},
        {"data_type": "campaign_roi", "time_period": "quarterly", "metrics": ["spend", "roi", "attribution"]},
        {"data_type": "pricing_analysis", "time_period": "monthly", "metrics": ["price_elasticity", "revenue", "demand"]},
        {"data_type": "competitive_analysis", "time_period": "quarterly", "metrics": ["market_share", "features", "pricing"]},
        {"data_type": "customer_lifetime_value", "time_period": "yearly", "metrics": ["ltv", "cac", "payback_period"]},
        {"data_type": "geographic_performance", "time_period": "monthly", "metrics": ["regional_sales", "growth", "penetration"]},
        {"data_type": "product_mix", "time_period": "quarterly", "metrics": ["mix", "cross_sell", "upsell"]},
        {"data_type": "support_metrics", "time_period": "monthly", "metrics": ["tickets", "satisfaction", "resolution_time"]},
    ],
    "onboarding": [
        {"product_type": "Enterprise SaaS", "features": ["sso_setup", "admin_training", "data_migration"]},
        {"product_type": "Mobile App", "features": ["permissions", "push_notifications", "profile_setup"]},
        {"product_type": "API Platform", "features": ["api_keys", "documentation", "first_request"]},
        {"product_type": "E-commerce", "features": ["account_creation", "first_purchase", "wishlist"]},
        {"product_type": "Developer Tools", "features": ["installation", "config", "hello_world"]},
        {"product_type": "Analytics Platform", "features": ["tracking_setup", "dashboard", "first_report"]},
        {"product_type": "CRM System", "features": ["data_import", "team_setup", "workflow"]},
        {"product_type": "Project Management", "features": ["workspace", "first_project", "collaboration"]},
    ],
    "spec": [
        {"feature": "Multi-factor authentication", "constraints": ["security_compliance", "user_experience"]},
        {"feature": "Real-time collaboration", "constraints": ["concurrency", "conflict_resolution"]},
        {"feature": "File upload system", "constraints": ["virus_scanning", "size_limits", "format_validation"]},
        {"feature": "Search functionality", "constraints": ["relevance", "performance", "multilingual"]},
        {"feature": "Notification system", "constraints": ["delivery_guarantee", "rate_limiting", "preferences"]},
        {"feature": "API rate limiting", "constraints": ["fairness", "burst_handling", "tier_based"]},
        {"feature": "Audit logging", "constraints": ["immutability", "compliance", "retention"]},
        {"feature": "Data export/import", "constraints": ["format_support", "validation", "error_handling"]},
    ],
}


def create_variation(base_scenario: Dict[str, Any], variation: Dict[str, Any], new_id: str) -> Dict[str, Any]:
    """Create a variation of a base scenario"""
    new_scenario = copy.deepcopy(base_scenario)
    new_scenario["id"] = new_id

    # Update inputs with variation
    for key, value in variation.items():
        new_scenario["inputs"][key] = value

    # Update description to reflect variation
    if "data_type" in variation:
        new_scenario["description"] = f"{variation['data_type'].replace('_', ' ').title()} analysis"
    elif "product_type" in variation:
        new_scenario["description"] = f"{variation['product_type']} onboarding"
    elif "feature" in variation:
        new_scenario["description"] = f"{variation['feature']} requirements specification"

    return new_scenario


def expand_scenarios(file_path: Path, target_count: int = 18):
    """Expand scenarios in a file to target count"""
    with open(file_path, 'r') as f:
        scenarios = json.load(f)

    current_count = len(scenarios)
    if current_count >= target_count:
        print(f"✓ {file_path.name}: Already has {current_count} scenarios")
        return

    needed = target_count - current_count
    agent_type = file_path.stem.replace('_scenarios', '')

    print(f"→ {file_path.name}: Expanding {current_count} → {target_count} (+{needed})")

    # Use agent-specific variations if available, otherwise generic
    variations = VARIATIONS.get(agent_type, [])

    # Create variations based on existing scenarios
    added = 0
    base_idx = 0

    while added < needed:
        base_scenario = scenarios[base_idx % current_count]

        # Use specific variation if available
        if added < len(variations):
            variation = variations[added]
        else:
            # Generic variation: adjust complexity, urgency, scale
            variation_types = [
                {"complexity": "high", "urgency": "critical"},
                {"complexity": "low", "urgency": "low"},
                {"data_size": "extra_large"},
                {"time_period": "realtime"},
            ]
            variation = variation_types[added % len(variation_types)]

        new_id = f"{agent_type}_{current_count + added + 1}"
        new_scenario = create_variation(base_scenario, variation, new_id)

        scenarios.append(new_scenario)
        added += 1
        base_idx += 1

    # Write back
    with open(file_path, 'w') as f:
        json.dump(scenarios, f, indent=2)

    print(f"✓ {file_path.name}: Expanded to {len(scenarios)} scenarios")


def main():
    test_cases_dir = Path(__file__).parent / "test_cases"

    # Files that need expansion (excluding marketing, builder, qa which are already 18)
    files_to_expand = [
        "analyst_scenarios.json",
        "billing_scenarios.json",
        "content_scenarios.json",
        "deploy_scenarios.json",
        "email_scenarios.json",
        "legal_scenarios.json",
        "maintenance_scenarios.json",
        "onboarding_scenarios.json",
        "security_scenarios.json",
        "seo_scenarios.json",
        "spec_scenarios.json",
        "support_scenarios.json",
    ]

    print("=== BENCHMARK SCENARIO EXPANSION ===\n")

    for filename in files_to_expand:
        file_path = test_cases_dir / filename
        if file_path.exists():
            try:
                expand_scenarios(file_path)
            except Exception as e:
                print(f"✗ {filename}: Error - {e}")
        else:
            print(f"✗ {filename}: File not found")

    print("\n=== VALIDATION ===\n")

    # Validate all files
    all_files = sorted(test_cases_dir.glob("*_scenarios.json"))
    for file_path in all_files:
        try:
            with open(file_path, 'r') as f:
                data = json.load(f)
            count = len(data)
            status = "✓" if count == 18 else "✗"
            print(f"{status} {file_path.name}: {count}/18 scenarios")
        except Exception as e:
            print(f"✗ {file_path.name}: Invalid JSON - {e}")

    print("\n=== COMPLETE ===")


if __name__ == "__main__":
    main()
