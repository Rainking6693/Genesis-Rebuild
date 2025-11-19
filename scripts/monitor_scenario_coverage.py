#!/usr/bin/env python3
"""Report AgentEvolver scenario coverage so dashboards can monitor novelty/diversity."""

import json
from infrastructure.agentevolver.self_questioning import SelfQuestioningEngine


def main():
    engine = SelfQuestioningEngine()
    summary = engine.coverage_summary()
    pct_types, pct_domains = engine.coverage_percent()
    savings = engine.estimated_manual_curation_savings()
    report = {
        "business_types": summary["business_types"],
        "domains": summary["domains"],
        "complexities": summary["complexities"],
        "coverage_percent": {"business_types": pct_types, "domains": pct_domains},
        "coverage_target_met": engine.coverage_target_met(),
        "total_ideas": savings["total_ideas"],
        "manual_hours": round(savings["manual_hours"], 2),
        "autonomous_hours": round(savings["autonomous_hours"], 2),
        "estimated_hours_saved": round(savings["hours_saved"], 2),
    }
    print(json.dumps(report, indent=2))


if __name__ == "__main__":
    main()
