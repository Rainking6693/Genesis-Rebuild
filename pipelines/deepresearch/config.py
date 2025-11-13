"""
DeepResearch configuration helpers.

This module was missing from the repo; reconstructing the minimal config
needed by scripts/validate_deepresearch_api_keys.py so we can integrate
Tongyi DeepResearch 30B.
"""

from dataclasses import dataclass
from typing import Optional
import os


@dataclass
class DeepResearchConfig:
    """Configuration for DeepResearch pipelines."""

    serper_api_key: Optional[str] = os.getenv("SERPER_API_KEY")
    jina_api_key: Optional[str] = os.getenv("JINA_API_KEY")
    dashscope_api_key: Optional[str] = os.getenv("DASHSCOPE_API_KEY")
    openrouter_api_key: Optional[str] = os.getenv("OPENROUTER_API_KEY")
    openai_api_key: Optional[str] = os.getenv("OPENAI_API_KEY")
    deepresearch_api_base: Optional[str] = os.getenv("DEEPRESEARCH_API_BASE")
    deepresearch_model: Optional[str] = os.getenv("DEEPRESEARCH_MODEL")

    @property
    def has_external_provider(self) -> bool:
        """Basic readiness check."""
        return bool(self.deepresearch_api_base and self.deepresearch_model)

    @property
    def uses_openrouter(self) -> bool:
        base = (self.deepresearch_api_base or "").lower()
        return "openrouter" in base

    @property
    def requires_dashscope(self) -> bool:
        """DashScope is only required when talking directly to Alibaba endpoints."""
        if self.uses_openrouter:
            return False
        model = (self.deepresearch_model or "").lower()
        return "dashscope" in model or "tongyi" in model


__all__ = ["DeepResearchConfig"]

