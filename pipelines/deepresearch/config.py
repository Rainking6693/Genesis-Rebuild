from __future__ import annotations

import os
from dataclasses import dataclass, field
from pathlib import Path
from typing import Dict, List, Optional


@dataclass
class DeepResearchConfig:
    """Configuration for the DeepResearch data pipeline."""

    output_dir: Path = Path("data/deepresearch")
    prompts_dir: Path = Path("prompts/deepresearch")
    dataset_name: str = "genesis_deepresearch"
    target_example_count: int = 20_000
    agents: List[str] = field(
        default_factory=lambda: [
            "qa_agent",
            "support_agent",
            "legal_agent",
            "analyst_agent",
            "marketing_agent",
            "deploy_agent",
            "security_agent",
            "builder_agent",
            "content_agent",
            "seo_agent",
            "email_agent",
            "billing_agent",
            "maintenance_agent",
            "onboarding_agent",
            "spec_agent",
        ]
    )

    serper_api_key: Optional[str] = field(
        default_factory=lambda: os.getenv("SERPER_API_KEY")
    )
    jina_api_key: Optional[str] = field(
        default_factory=lambda: os.getenv("JINA_API_KEY")
    )
    dashscope_api_key: Optional[str] = field(
        default_factory=lambda: os.getenv("DASHSCOPE_API_KEY")
    )
    openai_api_key: Optional[str] = field(
        default_factory=lambda: os.getenv("OPENAI_API_KEY")
    )
    deepresearch_api_base: Optional[str] = field(
        default_factory=lambda: os.getenv("DEEPRESEARCH_API_BASE")
    )
    deepresearch_model: str = field(
        default_factory=lambda: os.getenv(
            "DEEPRESEARCH_MODEL", "openrouter/alibaba/tongyi-deepresearch-30b"
        )
    )
    request_timeout: int = int(os.getenv("DEEPRESEARCH_TIMEOUT", "120"))

    extra_metadata: Dict[str, str] = field(default_factory=dict)

    def ensure_directories(self) -> None:
        self.output_dir.mkdir(parents=True, exist_ok=True)
        self.prompts_dir.mkdir(parents=True, exist_ok=True)

    @property
    def has_external_provider(self) -> bool:
        return bool(self.deepresearch_api_base and self.openai_api_key)
