"""
AgentEvolver Self-Questioning Engine
===================================

Encapsulates curiosity-driven task generation, novelty scoring, and coverage
tracking for the AgentEvolver integration.
"""

from __future__ import annotations

import json
import math
import random
import re
from collections import Counter, defaultdict
from dataclasses import dataclass, asdict
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, List, Optional, Sequence, Tuple

BUSINESS_TYPES = [
    "saas",
    "ecommerce",
    "content",
    "marketplace",
    "fintech",
    "healthcare",
    "education",
    "logistics",
    "agriculture",
    "energy",
    "travel",
    "entertainment",
    "security",
    "platform",
    "robotics",
    "tools",
]

DOMAIN_CATEGORIES = [
    "agriculture",
    "fintech",
    "healthcare",
    "education",
    "logistics",
    "energy",
    "security",
    "travel",
    "sustainability",
    "media",
    "developer",
    "retail",
    "enterprise",
    "gaming",
    "creator",
    "robotics",
]

QUESTION_TEMPLATES = [
    "What if we built a {business_type} solution for {domain} professionals?",
    "Imagine a {domain} platform powered by a {business_type} stack—what would it do?",
    "How could we reframe {domain} problems through a {business_type} experience?",
    "Design a {business_type} that gives {domain} teams superpowers.",
    "What would a {domain} focused {business_type} innovation look like?",
]

COMPLEXITY_TIERS = ["low", "medium", "high"]
COMPLEXITY_BUDGET = {
    "low": 40,
    "medium": 30,
}


@dataclass
class CuriosityEntry:
    name: str
    description: str
    business_type: str
    domains: List[str]
    score: float
    generated_at: str


class SelfQuestioningEngine:
    """Curiosity driver for AgentEvolver-style idea generation."""

    def __init__(
        self,
        store_path: Path = Path("data/agentevolver/curiosity_ideas.jsonl"),
        coverage_path: Path = Path("data/agentevolver/coverage.json"),
    ):
        self.store_path = store_path
        self.coverage_path = coverage_path
        self.coverage = {
            "business_types": Counter(),
            "domains": Counter(),
            "complexities": Counter(),
        }
        self.generated_count = 0
        self._load()

    def _load(self) -> None:
        self.store_path.parent.mkdir(parents=True, exist_ok=True)
        if self.store_path.exists():
            with open(self.store_path, "r") as handle:
                for line in handle:
                    if not line.strip():
                        continue
                    data = json.loads(line)
                    self.coverage["business_types"][data.get("business_type", "")] += 1
                    for domain in data.get("domains", []):
                        self.coverage["domains"][domain] += 1

        if self.coverage_path.exists():
            try:
                with open(self.coverage_path, "r") as handle:
                    saved = json.load(handle)
                    self.coverage["business_types"].update(saved.get("business_types", {}))
                    self.coverage["domains"].update(saved.get("domains", {}))
                    self.coverage["complexities"].update(saved.get("complexities", {}))
            except Exception:
                pass

    def _save_coverage(self) -> None:
        self.coverage_path.parent.mkdir(parents=True, exist_ok=True)
        with open(self.coverage_path, "w") as handle:
            json.dump(
                {
                    "business_types": dict(self.coverage["business_types"]),
                    "domains": dict(self.coverage["domains"]),
                    "complexities": dict(self.coverage["complexities"]),
                },
                handle,
                indent=2,
            )

    def register_idea(
        self,
        name: str,
        description: str,
        business_type: str,
        domains: Sequence[str],
        score: float,
    ) -> CuriosityEntry:
        entry = CuriosityEntry(
            name=name,
            description=description,
            business_type=business_type,
            domains=list(domains),
            score=score,
            generated_at=datetime.now(timezone.utc).isoformat(),
        )
        with open(self.store_path, "a") as handle:
            handle.write(json.dumps(asdict(entry)) + "\n")

        self.coverage["business_types"][business_type] += 1
        for domain in domains:
            self.coverage["domains"][domain] += 1
        self._save_coverage()
        return entry

    def coverage_summary(self) -> Dict[str, Dict[str, int]]:
        return {
            "business_types": dict(self.coverage["business_types"]),
            "domains": dict(self.coverage["domains"]),
            "complexities": dict(self.coverage["complexities"]),
        }

    def score_novelty(self, text: str, reference: Optional[str] = None) -> float:
        words = set(re.findall(r"\w+", text.lower()))
        if not words:
            return 0.0
        base_text = reference or ""
        base_words = set(re.findall(r"\w+", base_text.lower()))
        overlap = len(words & base_words)
        novelty = 100 * (1 - (overlap / max(len(words), 1)))
        return round(max(0.0, min(100.0, novelty)), 2)

    def extract_domains(self, idea: "BusinessIdea") -> List[str]:
        text = " ".join(
            filter(None, [idea.target_audience, idea.description, idea.monetization_model])
        ).lower()
        matches = [domain for domain in DOMAIN_CATEGORIES if domain in text]
        return sorted(set(matches or ["general"]))

    def select_next_domain(self) -> str:
        if not self.coverage["domains"]:
            return random.choice(DOMAIN_CATEGORIES)
        least_common = min(self.coverage["domains"].items(), key=lambda kv: kv[1])[0]
        least_list = [domain for domain, count in self.coverage["domains"].items() if count == self.coverage["domains"][least_common]]
        return random.choice(least_list)

    def select_business_type(self) -> str:
        least_common = min(
            (bt for bt in BUSINESS_TYPES),
            key=lambda bt: self.coverage["business_types"].get(bt, 0),
        )
        return least_common

    def generate_question(
        self,
        business_type: Optional[str] = None,
        complexity_target: Optional[str] = None,
    ) -> Tuple[str, str, str]:
        business_type = business_type or self.select_business_type()
        domain = self.select_next_domain()
        template = random.choice(QUESTION_TEMPLATES)
        complexity_target = complexity_target or self.desired_complexity_level()
        question = (
            template.format(business_type=business_type, domain=domain)
            + f" Keep this initiative at a {complexity_target} complexity level."
        )
        return question, business_type, domain

    def coverage_percent(self) -> Tuple[float, float]:
        covered_types = len(
            [bt for bt in BUSINESS_TYPES if self.coverage["business_types"].get(bt, 0) > 0]
        )
        pct_types = round(100 * covered_types / max(len(BUSINESS_TYPES), 1), 2)
        covered_domains = len(
            [dom for dom in DOMAIN_CATEGORIES if self.coverage["domains"].get(dom, 0) > 0]
        )
        pct_domains = round(100 * covered_domains / max(len(DOMAIN_CATEGORIES), 1), 2)
        return pct_types, pct_domains

    def coverage_target_met(self, target: float = 0.95) -> bool:
        pct_types, pct_domains = self.coverage_percent()
        return pct_types >= target * 100 and pct_domains >= target * 100

    def desired_complexity_level(self) -> str:
        for level in COMPLEXITY_TIERS:
            if self.coverage["complexities"].get(level, 0) < COMPLEXITY_BUDGET.get(level, math.inf):
                return level
        return COMPLEXITY_TIERS[-1]

    def complexity_label_for_score(self, score: float) -> str:
        if score < 40:
            return "low"
        if score < 70:
            return "medium"
        return "high"

    def register_complexity_level(self, level: str) -> None:
        if level not in COMPLEXITY_TIERS:
            level = COMPLEXITY_TIERS[-1]
        self.coverage["complexities"][level] += 1
        self.generated_count += 1
        self._save_coverage()

    def is_complexity_allowed(self, level: str) -> bool:
        allowed_index = COMPLEXITY_TIERS.index(self.desired_complexity_level())
        level_index = COMPLEXITY_TIERS.index(level if level in COMPLEXITY_TIERS else COMPLEXITY_TIERS[-1])
        return level_index <= allowed_index

    def estimated_manual_curation_savings(
        self,
        manual_minutes_per_idea: float = 15.0,
        autonomous_minutes_per_idea: float = 3.0,
    ) -> Dict[str, float]:
        total_ideas = max(sum(self.coverage["business_types"].values()), self.generated_count)
        manual_time = total_ideas * manual_minutes_per_idea
        autonomous_time = total_ideas * autonomous_minutes_per_idea
        savings_minutes = max(0.0, manual_time - autonomous_time)
        return {
            "total_ideas": total_ideas,
            "manual_hours": manual_time / 60,
            "autonomous_hours": autonomous_time / 60,
            "hours_saved": savings_minutes / 60,
        }

    def coverage_summary(self) -> Dict[str, Any]:
        """Return raw coverage counts for dashboards or alerts."""
        return {
            "business_types": dict(self.coverage["business_types"]),
            "domains": dict(self.coverage["domains"]),
        }
