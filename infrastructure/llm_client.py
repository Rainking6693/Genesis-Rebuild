"""
LLM Client Abstraction Layer
Provides unified interface for multiple LLM providers (GPT-4o, Claude Sonnet 4, Gemini Flash)
"""
import json
import os
import logging
from abc import ABC, abstractmethod
from typing import Dict, Any, Optional, List
from enum import Enum

logger = logging.getLogger(__name__)


class LLMProvider(Enum):
    """Supported LLM providers"""
    GPT4O = "gpt-4o"
    CLAUDE_SONNET_4 = "claude-sonnet-4-20250514"
    GEMINI_FLASH = "gemini-2.0-flash-exp"


class LLMClient(ABC):
    """Abstract base class for LLM providers"""

    @abstractmethod
    async def generate_structured_output(
        self,
        system_prompt: str,
        user_prompt: str,
        response_schema: Dict[str, Any],
        temperature: float = 0.0
    ) -> Dict[str, Any]:
        """
        Generate structured JSON output from LLM

        Args:
            system_prompt: System-level instructions
            user_prompt: User request/query
            response_schema: Expected JSON schema for response
            temperature: Sampling temperature (0.0 = deterministic, 1.0 = creative)

        Returns:
            Dictionary matching response_schema

        Raises:
            LLMClientError: If API call fails or response is invalid
        """
        pass

    @abstractmethod
    async def generate_text(
        self,
        system_prompt: str,
        user_prompt: str,
        temperature: float = 0.7,
        max_tokens: int = 4096
    ) -> str:
        """
        Generate unstructured text output

        Args:
            system_prompt: System-level instructions
            user_prompt: User request/query
            temperature: Sampling temperature
            max_tokens: Maximum response length

        Returns:
            Generated text string
        """
        pass


class LLMClientError(Exception):
    """Base exception for LLM client errors"""
    pass


class OpenAIClient(LLMClient):
    """
    GPT-4o client for task decomposition and orchestration

    Optimized for:
    - Strategic decision making
    - Hierarchical task decomposition
    - Structured output generation (JSON mode)

    Cost: $3/1M tokens
    """

    def __init__(self, api_key: Optional[str] = None, model: str = "gpt-4o"):
        """
        Initialize OpenAI client

        Args:
            api_key: OpenAI API key (defaults to OPENAI_API_KEY env var)
            model: Model name (default: gpt-4o)
        """
        try:
            import openai
            self.openai = openai
        except ImportError:
            raise LLMClientError(
                "OpenAI package not installed. Run: pip install openai"
            )

        self.api_key = api_key or os.getenv("OPENAI_API_KEY")
        if not self.api_key:
            raise LLMClientError(
                "OPENAI_API_KEY not set. Either pass api_key parameter or set environment variable."
            )

        self.client = openai.AsyncOpenAI(api_key=self.api_key)
        self.model = model

        logger.info(f"OpenAI client initialized with model: {model}")

    async def generate_structured_output(
        self,
        system_prompt: str,
        user_prompt: str,
        response_schema: Dict[str, Any],
        temperature: float = 0.0
    ) -> Dict[str, Any]:
        """
        Generate structured JSON output using GPT-4o JSON mode

        Uses OpenAI's JSON mode for guaranteed valid JSON responses
        """
        try:
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                response_format={"type": "json_object"},
                temperature=temperature,
                timeout=60.0  # 60 second timeout
            )

            content = response.choices[0].message.content
            if not content:
                raise LLMClientError("Empty response from OpenAI API")

            result = json.loads(content)

            logger.debug(f"OpenAI response: {len(content)} chars, {response.usage.total_tokens} tokens")

            return result

        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse OpenAI JSON response: {e}")
            raise LLMClientError(f"Invalid JSON from OpenAI: {e}")
        except Exception as e:
            logger.error(f"OpenAI API error: {e}")
            raise LLMClientError(f"OpenAI API call failed: {e}")

    async def generate_text(
        self,
        system_prompt: str,
        user_prompt: str,
        temperature: float = 0.7,
        max_tokens: int = 4096
    ) -> str:
        """Generate unstructured text output"""
        try:
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=temperature,
                max_tokens=max_tokens,
                timeout=60.0
            )

            content = response.choices[0].message.content
            if not content:
                raise LLMClientError("Empty response from OpenAI API")

            logger.debug(f"OpenAI text response: {len(content)} chars")

            return content

        except Exception as e:
            logger.error(f"OpenAI text generation error: {e}")
            raise LLMClientError(f"OpenAI text generation failed: {e}")


class AnthropicClient(LLMClient):
    """
    Claude Sonnet 4 client for code generation and complex reasoning

    Optimized for:
    - Code generation (72.7% SWE-bench accuracy)
    - Complex multi-step reasoning
    - Long-context tasks

    Cost: $3/1M tokens
    """

    def __init__(self, api_key: Optional[str] = None, model: str = "claude-sonnet-4-20250514"):
        """
        Initialize Anthropic client

        Args:
            api_key: Anthropic API key (defaults to ANTHROPIC_API_KEY env var)
            model: Model name (default: claude-sonnet-4-20250514)
        """
        try:
            import anthropic
            self.anthropic = anthropic
        except ImportError:
            raise LLMClientError(
                "Anthropic package not installed. Run: pip install anthropic"
            )

        self.api_key = api_key or os.getenv("ANTHROPIC_API_KEY")
        if not self.api_key:
            raise LLMClientError(
                "ANTHROPIC_API_KEY not set. Either pass api_key parameter or set environment variable."
            )

        self.client = anthropic.AsyncAnthropic(api_key=self.api_key)
        self.model = model

        logger.info(f"Anthropic client initialized with model: {model}")

    async def generate_structured_output(
        self,
        system_prompt: str,
        user_prompt: str,
        response_schema: Dict[str, Any],
        temperature: float = 0.0
    ) -> Dict[str, Any]:
        """
        Generate structured JSON output using Claude

        Note: Claude doesn't have native JSON mode, so we include schema in prompt
        and parse the response carefully.
        """
        try:
            # Add schema to prompt for guidance
            schema_prompt = (
                f"{user_prompt}\n\n"
                f"IMPORTANT: Respond with valid JSON only (no markdown, no explanations).\n"
                f"Expected schema:\n{json.dumps(response_schema, indent=2)}"
            )

            response = await self.client.messages.create(
                model=self.model,
                max_tokens=4096,
                temperature=temperature,
                system=system_prompt,
                messages=[{"role": "user", "content": schema_prompt}],
                timeout=60.0
            )

            content = response.content[0].text
            if not content:
                raise LLMClientError("Empty response from Anthropic API")

            # Claude sometimes wraps JSON in markdown code blocks
            content = content.strip()
            if content.startswith("```json"):
                content = content[7:]  # Remove ```json
            if content.startswith("```"):
                content = content[3:]  # Remove ```
            if content.endswith("```"):
                content = content[:-3]  # Remove trailing ```
            content = content.strip()

            result = json.loads(content)

            logger.debug(f"Anthropic response: {len(content)} chars")

            return result

        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse Anthropic JSON response: {e}")
            logger.error(f"Raw response: {content[:500]}")
            raise LLMClientError(f"Invalid JSON from Anthropic: {e}")
        except Exception as e:
            logger.error(f"Anthropic API error: {e}")
            raise LLMClientError(f"Anthropic API call failed: {e}")

    async def generate_text(
        self,
        system_prompt: str,
        user_prompt: str,
        temperature: float = 0.7,
        max_tokens: int = 4096
    ) -> str:
        """Generate unstructured text output"""
        try:
            response = await self.client.messages.create(
                model=self.model,
                max_tokens=max_tokens,
                temperature=temperature,
                system=system_prompt,
                messages=[{"role": "user", "content": user_prompt}],
                timeout=60.0
            )

            content = response.content[0].text
            if not content:
                raise LLMClientError("Empty response from Anthropic API")

            logger.debug(f"Anthropic text response: {len(content)} chars")

            return content

        except Exception as e:
            logger.error(f"Anthropic text generation error: {e}")
            raise LLMClientError(f"Anthropic text generation failed: {e}")


class MockLLMClient(LLMClient):
    """
    Mock LLM client for testing without API calls

    Returns predefined responses for deterministic testing
    """

    def __init__(self, mock_responses: Optional[Dict[str, Any]] = None):
        """
        Initialize mock client

        Args:
            mock_responses: Dictionary of prompt patterns -> responses
        """
        self.mock_responses = mock_responses or {}
        self.call_count = 0
        self.last_prompts = []

        logger.info("Mock LLM client initialized")

    async def generate_structured_output(
        self,
        system_prompt: str,
        user_prompt: str,
        response_schema: Dict[str, Any],
        temperature: float = 0.0
    ) -> Dict[str, Any]:
        """Return mock structured response"""
        self.call_count += 1
        self.last_prompts.append((system_prompt, user_prompt))

        # Check for pattern match
        for pattern, response in self.mock_responses.items():
            if pattern.lower() in user_prompt.lower():
                logger.debug(f"Mock response matched pattern: {pattern}")
                return response

        # Default mock response for task decomposition
        return {
            "tasks": [
                {
                    "task_id": "mock_task_1",
                    "task_type": "design",
                    "description": "Mock task 1",
                    "dependencies": [],
                    "estimated_duration": 1.0
                },
                {
                    "task_id": "mock_task_2",
                    "task_type": "implement",
                    "description": "Mock task 2",
                    "dependencies": ["mock_task_1"],
                    "estimated_duration": 2.0
                }
            ]
        }

    async def generate_text(
        self,
        system_prompt: str,
        user_prompt: str,
        temperature: float = 0.7,
        max_tokens: int = 4096
    ) -> str:
        """Return mock text response"""
        self.call_count += 1
        self.last_prompts.append((system_prompt, user_prompt))

        return "Mock LLM response text"


class LLMFactory:
    """
    Factory for creating LLM clients

    Usage:
        client = LLMFactory.create(LLMProvider.GPT4O)
        response = await client.generate_structured_output(...)
    """

    @staticmethod
    def create(
        provider: LLMProvider,
        api_key: Optional[str] = None,
        **kwargs
    ) -> LLMClient:
        """
        Create LLM client for specified provider

        Args:
            provider: LLM provider enum
            api_key: Optional API key (defaults to env var)
            **kwargs: Additional provider-specific arguments

        Returns:
            Initialized LLM client

        Raises:
            ValueError: If provider not supported
            LLMClientError: If client initialization fails
        """
        if provider == LLMProvider.GPT4O:
            return OpenAIClient(api_key=api_key, **kwargs)
        elif provider == LLMProvider.CLAUDE_SONNET_4:
            return AnthropicClient(api_key=api_key, **kwargs)
        elif provider == LLMProvider.GEMINI_FLASH:
            raise LLMClientError(
                "Gemini Flash provider not yet implemented. "
                "Use GPT4O or CLAUDE_SONNET_4."
            )
        else:
            raise ValueError(f"Unsupported LLM provider: {provider}")

    @staticmethod
    def create_mock(mock_responses: Optional[Dict[str, Any]] = None) -> MockLLMClient:
        """
        Create mock LLM client for testing

        Args:
            mock_responses: Dictionary of prompt patterns -> responses

        Returns:
            Mock LLM client
        """
        return MockLLMClient(mock_responses=mock_responses)


# Cost tracking utilities
class CostTracker:
    """
    Track LLM API costs across providers

    Cost estimates (per 1M tokens):
    - GPT-4o: $3
    - Claude Sonnet 4: $3
    - Gemini Flash: $0.03
    """

    COST_PER_MILLION_TOKENS = {
        LLMProvider.GPT4O: 3.0,
        LLMProvider.CLAUDE_SONNET_4: 3.0,
        LLMProvider.GEMINI_FLASH: 0.03
    }

    def __init__(self):
        self.total_tokens = 0
        self.total_cost = 0.0
        self.provider_usage = {}

    def track_usage(
        self,
        provider: LLMProvider,
        tokens: int
    ) -> float:
        """
        Track token usage and calculate cost

        Args:
            provider: LLM provider used
            tokens: Number of tokens consumed

        Returns:
            Cost in USD for this call
        """
        cost_per_token = self.COST_PER_MILLION_TOKENS[provider] / 1_000_000
        call_cost = tokens * cost_per_token

        self.total_tokens += tokens
        self.total_cost += call_cost

        if provider not in self.provider_usage:
            self.provider_usage[provider] = {"tokens": 0, "cost": 0.0}

        self.provider_usage[provider]["tokens"] += tokens
        self.provider_usage[provider]["cost"] += call_cost

        return call_cost

    def get_summary(self) -> Dict[str, Any]:
        """Get usage summary"""
        return {
            "total_tokens": self.total_tokens,
            "total_cost_usd": round(self.total_cost, 4),
            "by_provider": {
                provider.value: {
                    "tokens": usage["tokens"],
                    "cost_usd": round(usage["cost"], 4)
                }
                for provider, usage in self.provider_usage.items()
            }
        }
