"""
Reusable test doubles for Power Sampling + HTDAG suites.

The real Power Sampling integration expects the LLM to return a fairly rich
JSON payload containing task metadata (owners, priority, dependencies, metrics,
etc.).  A bare-bones mock that only emits ``task_id`` fields makes the tests
under-specify behaviour and causes downstream assertions (quality scoring,
dependency validation, metadata handling) to short-circuit.

``RichPowerSamplingLLM`` implements the ``LLMClient`` interface so tests can
exercise the normal planner flow without patching internal methods.  The class
produces deterministic output for both baseline and power-sampling paths while
still mimicking the richer structure that production JSON responses contain.
"""

from __future__ import annotations

import json
import random
from typing import Any, Dict, List, Optional

from infrastructure.llm_client import LLMClient


class RichPowerSamplingLLM(LLMClient):
    """Deterministic test double for HTDAG + Power Sampling interactions."""

    def __init__(self, seed: int = 42) -> None:
        self._rng = random.Random(seed)
        self._power_types = [
            ("research", "research_guild"),
            ("design", "design_guild"),
            ("implement", "implementation_squad"),
            ("test", "qa_guild"),
            ("deploy", "devops_guild"),
            ("monitor", "sre_team"),
            ("security", "security_team"),
        ]

    # ------------------------------------------------------------------ #
    # LLMClient required interface
    # ------------------------------------------------------------------ #
    async def generate_structured_output(
        self,
        system_prompt: str,
        user_prompt: str,
        response_schema: Dict[str, Any],
        temperature: float = 0.0
    ) -> Dict[str, Any]:
        """Baseline HTDAG generation path (deterministic)."""
        return {"tasks": self._build_baseline_tasks(user_prompt)}

    async def generate_text(
        self,
        system_prompt: str,
        user_prompt: str,
        temperature: float = 0.7,
        max_tokens: int = 4096,
        context_profile: Optional[Any] = None,
        auto_select_profile: bool = True
    ) -> str:
        """Power-sampling path: return JSON with rich task metadata."""
        payload = {
            "tasks": self._build_power_tasks(user_prompt),
            "metadata": {
                "prompt_hash": hash(user_prompt) & 0xFFFFFFFF,
                "quality_hypothesis": "power_sampling_richer_structure",
                "confidence": 0.82,
            },
        }

        # Preserve deterministic ordering unless the caller explicitly dials
        # up temperature for shuffle-based randomness.
        if temperature > 0.9:
            self._rng.shuffle(payload["tasks"])

        return json.dumps(payload)

    async def tokenize(
        self,
        text: str,
        return_ids: bool = True
    ) -> List[int]:
        """Approximate tokenisation with deterministic pseudo IDs."""
        token_count = max(6, len(text) // 7)
        tokens = list(range(token_count))
        return tokens if return_ids else [f"tok_{tid}" for tid in tokens]

    async def generate_from_token_ids(
        self,
        prompt_token_ids: List[int],
        max_tokens: int = 1024,
        temperature: float = 0.7
    ) -> Dict[str, Any]:
        """Return echo-style completions for completeness."""
        limited = prompt_token_ids[:max_tokens]
        text = " ".join(f"token_{tid}" for tid in limited)
        return {"text": text, "token_ids": limited, "usage": {}}

    # ------------------------------------------------------------------ #
    # Helpers
    # ------------------------------------------------------------------ #
    def _normalize_prompt(self, prompt: str) -> str:
        cleaned = " ".join(prompt.split())
        return cleaned if cleaned else "project"

    def _build_baseline_tasks(self, user_prompt: str) -> List[Dict[str, Any]]:
        """Simpler three-task outline used for the baseline path."""
        base = self._normalize_prompt(user_prompt)

        signature = hash(base) % 3

        scaffolding = [
            {
                "task_id": "baseline_0",
                "long_description": True,
                "dependencies": [],
                "task_type": "generic",
            },
            {
                "task_id": "baseline_1",
                "long_description": signature == 2,
                "dependencies": ["baseline_0"],
                "task_type": "generic",
            },
            {
                "task_id": "baseline_2",
                "long_description": False,
                "dependencies": ["baseline_1"],
                "task_type": "generic" if signature != 2 else "review",
            },
        ]

        if signature == 1:
            scaffolding.append(
                {
                    "task_id": "baseline_3",
                    "long_description": False,
                    "dependencies": ["baseline_2"],
                    "task_type": "generic",
                }
            )

        tasks: List[Dict[str, Any]] = []
        for idx, spec in enumerate(scaffolding):
            if spec["long_description"]:
                desc = (
                    f"Kickoff alignment for {base[:28]} with stakeholders. "
                    "Document scope boundaries, primary outcomes, success criteria, "
                    "and unresolved questions for follow-up."
                )
            else:
                short_stub = ["Draft", "QA", "Ops", "Sync"][idx % 4]
                desc = short_stub[:8]

            tasks.append(
                {
                    "task_id": spec["task_id"],
                    "task_type": spec["task_type"],
                    "description": desc,
                    "priority": "medium",
                    "owner": "orchestration_team",
                    "dependencies": spec["dependencies"],
                    "estimated_hours": 4 + idx,
                    "acceptance_criteria": ["Risks noted"] if idx == 0 else [],
                    "success_metrics": [{"metric": "completion", "target": 0.5}],
                    "deliverables": [],
                }
            )

        return tasks

    def _build_power_tasks(self, user_prompt: str) -> List[Dict[str, Any]]:
        """Richer power-sampling tasks with detailed metadata."""
        base = self._normalize_prompt(user_prompt)
        tasks: List[Dict[str, Any]] = []

        for idx in range(5):
            task_type, owner = self._power_types[idx % len(self._power_types)]
            dependencies = [] if idx == 0 else [f"power_{idx-1}"]
            priority = "high" if idx < 2 else "medium"

            tasks.append(
                self._make_task(
                    task_id=f"power_{idx}",
                    task_type=task_type,
                    base=base,
                    iteration=idx,
                    priority=priority,
                    owner=owner,
                    dependencies=dependencies,
                )
            )

        return tasks

    def _make_task(
        self,
        task_id: str,
        task_type: str,
        base: str,
        iteration: int,
        priority: str,
        owner: str,
        dependencies: List[str],
    ) -> Dict[str, Any]:
        """Create a task dictionary with reusable enriched metadata."""
        detail_sections = [
            "Note compliance approvals and stakeholder sign-off.",
            "List dependency owners and integration checkpoints.",
            "Define observability hooks and rollback triggers.",
        ]

        detail_note = detail_sections[iteration % len(detail_sections)]

        summary = (
            f"{task_type.title()} phase {iteration + 1} for {base}. "
            "Detail key requirements, major risks, validation checkpoints, "
            "deployment planning, and observability strategy. "
            f"{detail_note}"
        )

        acceptance_criteria = [
            "Stakeholder approval recorded",
            "Quantitative success metrics defined",
            "Risks and mitigations captured",
        ]

        success_metrics = [
            {"metric": "quality_score", "target": 0.85},
            {"metric": "latency_ms", "target": 3500},
        ]

        deliverables = [
            {"name": f"{task_type}_brief_{iteration+1}.md", "type": "doc"},
            {"name": f"{task_type}_review_{iteration+1}.json", "type": "report"},
        ]

        return {
            "task_id": task_id,
            "task_type": task_type,
            "description": summary,
            "priority": priority,
            "owner": owner,
            "dependencies": dependencies,
            "estimated_hours": 8 + iteration * 2,
            "acceptance_criteria": acceptance_criteria,
            "success_metrics": success_metrics,
            "deliverables": deliverables,
            "notes": detail_note,
        }
