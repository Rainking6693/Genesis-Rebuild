from __future__ import annotations

import json
import logging
from datetime import datetime
from pathlib import Path
from typing import Iterable, List, Sequence

from .config import DeepResearchConfig
from .providers import (
    DeepResearchClient,
    MockResearchProvider,
    ResearchExample,
    ResearchPrompt,
    ResearchProvider,
)

logger = logging.getLogger(__name__)


class DeepResearchPipeline:
    """Coordinate prompt loading, generation, and dataset export."""

    def __init__(
        self,
        config: DeepResearchConfig,
        provider: ResearchProvider | None = None,
    ) -> None:
        self.config = config
        if provider is not None:
            self.provider = provider
        elif config.has_external_provider:
            self.provider = DeepResearchClient(config)
        else:
            self.provider = MockResearchProvider()

    def load_prompts(self) -> List[ResearchPrompt]:
        prompts: List[ResearchPrompt] = []
        if not self.config.prompts_dir.exists():
            return prompts
        for path in self.config.prompts_dir.glob("*.json"):
            agent = path.stem
            with path.open("r", encoding="utf-8") as handle:
                data = json.load(handle)
            for entry in data:
                prompts.append(
                    ResearchPrompt(
                        agent=agent,
                        topic=entry["topic"],
                        instructions=entry["instructions"],
                    )
                )
        return prompts

    def generate_dataset(
        self,
        prompts: Iterable[ResearchPrompt],
        batch_size: int = 10,
        max_examples: int | None = None,
    ) -> Sequence[ResearchExample]:
        prompt_list = list(prompts)
        if not prompt_list:
            return []

        limit = max_examples or self.config.target_example_count
        examples: List[ResearchExample] = []
        idx = 0

        while len(examples) < limit:
            prompt = prompt_list[idx % len(prompt_list)]
            batch = self.provider.generate_examples(prompt, batch_size=batch_size)

            if not batch:
                logger.warning(
                    "Provider returned no data for prompt '%s'; stopping generation.",
                    prompt.topic,
                )
                break

            examples.extend(batch)
            idx += 1

        return examples[:limit]

    def write_dataset(self, examples: Sequence[ResearchExample]) -> Path:
        timestamp = datetime.utcnow().strftime("%Y%m%dT%H%M%SZ")
        output_dir = self.config.output_dir / timestamp
        output_dir.mkdir(parents=True, exist_ok=True)
        output_path = output_dir / f"{self.config.dataset_name}.jsonl"

        with output_path.open("w", encoding="utf-8") as handle:
            for example in examples:
                record = {
                    "agent": example.agent,
                    "topic": example.topic,
                    "query": example.query,
                    "findings": example.findings,
                    "reasoning_trace": example.reasoning_trace,
                    "citations": example.citations,
                    "metadata": self.config.extra_metadata,
                }
                handle.write(json.dumps(record))
                handle.write("\n")

        logger.info("DeepResearch dataset written to %s", output_path)
        return output_path

    def run(self, batch_size: int = 10, max_examples: int | None = None) -> Path:
        self.config.ensure_directories()
        prompts = self.load_prompts()
        if not prompts:
            prompts = self._default_prompts()
        limit = max_examples or self.config.target_example_count
        examples = self.generate_dataset(
            prompts,
            batch_size=batch_size,
            max_examples=limit,
        )
        return self.write_dataset(examples)

    def _default_prompts(self) -> List[ResearchPrompt]:
        prompts: List[ResearchPrompt] = []
        for agent in self.config.agents:
            prompts.append(
                ResearchPrompt(
                    agent=agent,
                    topic=f"{agent} industry trends",
                    instructions=(
                        f"Research top 3 insights for {agent} focusing on 2025 market shifts."
                    ),
                )
            )
        return prompts
