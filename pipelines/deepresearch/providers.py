from __future__ import annotations

import json
import logging
from dataclasses import dataclass
from typing import Iterable, List, Sequence

import requests

from .config import DeepResearchConfig

logger = logging.getLogger(__name__)


@dataclass
class ResearchPrompt:
    agent: str
    topic: str
    instructions: str


@dataclass
class ResearchExample:
    agent: str
    topic: str
    query: str
    findings: List[str]
    reasoning_trace: List[str]
    citations: List[str]


class ResearchProvider:
    def generate_examples(
        self,
        prompt: ResearchPrompt,
        batch_size: int,
    ) -> Sequence[ResearchExample]:
        raise NotImplementedError


class MockResearchProvider(ResearchProvider):
    def generate_examples(
        self,
        prompt: ResearchPrompt,
        batch_size: int,
    ) -> Sequence[ResearchExample]:
        examples: List[ResearchExample] = []
        for idx in range(batch_size):
            examples.append(
                ResearchExample(
                    agent=prompt.agent,
                    topic=prompt.topic,
                    query=f"{prompt.instructions} (iteration {idx + 1})",
                    findings=[f"Finding {i + 1} for {prompt.topic}" for i in range(3)],
                    reasoning_trace=[
                        f"Step {step + 1}: reasoning about {prompt.topic}"
                        for step in range(2)
                    ],
                    citations=[
                        f"https://example.com/{prompt.topic.replace(' ', '_')}/{idx + 1}"
                    ],
                )
            )
        return examples


class DeepResearchClient(ResearchProvider):
    """HTTP client that calls an OpenAI Responses-compatible endpoint."""

    def __init__(self, config: DeepResearchConfig) -> None:
        if not config.deepresearch_api_base:
            raise ValueError("DEEPRESEARCH_API_BASE must be set for the real client")
        if not config.openai_api_key:
            raise ValueError("OPENAI_API_KEY must be set for the real client")

        self.config = config
        self.session = requests.Session()
        self.session.headers.update(
            {
                "Authorization": f"Bearer {config.openai_api_key}",
                "Content-Type": "application/json",
            }
        )

    def _call_model(self, prompt: ResearchPrompt) -> ResearchExample | None:
        payload = {
            "model": self.config.deepresearch_model,
            "input": [
                {
                    "role": "system",
                    "content": [
                        {
                            "type": "input_text",
                            "text": (
                                "You are Tongyi DeepResearch. Respond with JSON containing keys: "
                                "findings (list of strings), reasoning (list of strings), citations (list of URLs)."
                            ),
                        }
                    ],
                },
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "input_text",
                            "text": (
                                f"Agent: {prompt.agent}\n"
                                f"Topic: {prompt.topic}\n"
                                f"Instructions: {prompt.instructions}\n"
                                "Provide a structured research summary."
                            ),
                        }
                    ],
                },
            ],
            "temperature": 0.4,
            "max_output_tokens": 2048,
        }

        url = f"{self.config.deepresearch_api_base.rstrip('/')}/responses"

        try:
            response = self.session.post(
                url,
                json=payload,
                timeout=self.config.request_timeout,
            )
            response.raise_for_status()
            data = response.json()
        except requests.HTTPError as exc:
            text = exc.response.text if exc.response is not None else ""
            logger.warning("DeepResearch API HTTP error: %s %s", exc, text)
            return None
        except requests.RequestException as exc:
            logger.warning("DeepResearch API request failed: %s", exc)
            return None

        content_text = _extract_text_from_responses(data)
        if not content_text:
            logger.warning("DeepResearch API returned empty content for %s", prompt.topic)
            return None

        try:
            parsed = json.loads(content_text)
            findings = parsed.get("findings", [])
            reasoning = parsed.get("reasoning", parsed.get("reasoning_trace", []))
            citations = parsed.get("citations", [])
        except json.JSONDecodeError:
            findings = [content_text]
            reasoning = ["See findings"]
            citations = []

        return ResearchExample(
            agent=prompt.agent,
            topic=prompt.topic,
            query=prompt.instructions,
            findings=findings or [content_text],
            reasoning_trace=reasoning or ["See findings"],
            citations=citations,
        )

    def generate_examples(
        self,
        prompt: ResearchPrompt,
        batch_size: int,
    ) -> Sequence[ResearchExample]:
        examples: List[ResearchExample] = []
        for _ in range(batch_size):
            example = self._call_model(prompt)
            if example is None:
                break
            examples.append(example)
        if not examples:
            logger.warning("Falling back to mock provider for prompt %s", prompt.topic)
            return MockResearchProvider().generate_examples(prompt, batch_size)
        return examples


def batched(iterable: Iterable[ResearchPrompt], batch_size: int) -> Iterable[List[ResearchPrompt]]:
    batch: List[ResearchPrompt] = []
    for item in iterable:
        batch.append(item)
        if len(batch) == batch_size:
            yield batch
            batch = []
    if batch:
        yield batch


def _extract_text_from_responses(data: dict) -> str:
    output = data.get("output", [])
    texts: List[str] = []
    for block in output:
        for part in block.get("content", []):
            if part.get("type") == "output_text":
                texts.append(part.get("text", ""))
    return "\n".join(t for t in texts if t)
