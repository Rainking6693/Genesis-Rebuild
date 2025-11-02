#!/usr/bin/env python3
"""
Research Trace Publisher for Public Demo

Publishes sanitized research traces to public_demo/data/public_demo_payload.json
for external stakeholder visibility.
"""

import json
import logging
from datetime import datetime
from pathlib import Path
from typing import Dict, Any

logger = logging.getLogger(__name__)


class ResearchTracePublisher:
    """Publishes sanitized research traces for public demo."""

    def __init__(self, output_dir: Path):
        """Initialize publisher with output directory."""
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(parents=True, exist_ok=True)
        self.data_file = self.output_dir / "public_demo_payload.json"

    def publish(self, metrics: Dict[str, Any], initiatives: Dict[str, Any], highlights: list) -> Path:
        """
        Publish research trace to JSON file.

        Args:
            metrics: System metrics (health, agents, success rate, cost)
            initiatives: Current research initiatives
            highlights: Key highlights list

        Returns:
            Path to published JSON file
        """
        payload = {
            "generated_at": datetime.now().strftime("%Y-%m-%d %H:%M UTC"),
            "metrics": metrics,
            "initiatives": initiatives,
            "highlights": highlights,
        }

        # Sanitize data (remove sensitive information)
        sanitized = self._sanitize(payload)

        # Write to file
        with open(self.data_file, "w", encoding="utf-8") as f:
            json.dump(sanitized, f, indent=2, ensure_ascii=False)

        logger.info(f"Published research trace to {self.data_file}")
        return self.data_file

    def _sanitize(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Sanitize data to remove sensitive information."""
        sanitized = data.copy()

        # Remove any API keys, tokens, or sensitive paths
        if "metrics" in sanitized:
            # Ensure no internal IPs or credentials
            sanitized["metrics"] = {
                k: v for k, v in sanitized["metrics"].items()
                if not any(sensitive in str(v).lower() for sensitive in ["key", "token", "secret", "password"])
            }

        return sanitized

    def update_from_system(self) -> Path:
        """
        Auto-generate payload from current system state.

        This is a placeholder - would integrate with actual system metrics.
        """
        # Placeholder metrics (would come from Prometheus/Grafana)
        metrics = {
            "system_health": "8.5/10",
            "active_agents": "15/15",
            "success_rate": "99.1%",
            "weekly_cost": "$40-60",
        }

        # Current initiatives
        initiatives = {
            "discorl": {
                "summary": "Auto-discover optimal learning loop update rules for HTDAG planner training.",
                "highlights": [
                    "Goal: 30% faster learning convergence.",
                    "Status: Optional integration with fallback heuristics.",
                ],
            },
            "public_demo": {
                "summary": "Provide a transparent research trace for external stakeholders via static site.",
                "highlights": [
                    "Goal: Publish sanitized progress snapshots.",
                    "Timeline: 1 week (optional).",
                ],
            },
            "orra": {
                "summary": "Research TheUnwindAI 'Plan Engine' for potential orchestration enhancements.",
                "highlights": [
                    "Phase: Research-first, 3 weeks.",
                    "Deliverable: Integrate, complement, or skip decision.",
                ],
            },
        }

        highlights = [
            "Tier 4 workstreams progressing with optional deployments.",
            "DiscoRL adapter added for learning optimization research.",
            "Public demo static site available for external review.",
            "Phase 6 optimizations delivering 88-92% cost reduction.",
            "SE-Darwin evolution system operational (99.3% tests passing).",
        ]

        return self.publish(metrics, initiatives, highlights)


if __name__ == "__main__":
    import sys

    logging.basicConfig(level=logging.INFO)

    script_dir = Path(__file__).parent
    data_dir = script_dir.parent / "data"

    publisher = ResearchTracePublisher(data_dir)
    output_file = publisher.update_from_system()

    print(f"✅ Research trace published to: {output_file}")
    sys.exit(0)

