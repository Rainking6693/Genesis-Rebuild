"""
Tiktoken-based tokenizer for realistic token ID generation in TokenCachedRAG.

FIX P1-4: Replaces simple hash-based mock tokenizer with actual tiktoken
for production-grade tokenization. Uses GPT-4 tokenizer (cl100k_base) for
accurate token counts and realistic caching behavior.

Author: Cora (QA Auditor)
Date: November 14, 2025
Status: P1-4 Fix - Production Readiness
"""

import asyncio
import logging
from typing import Any, Dict, List

try:
    import tiktoken
    TIKTOKEN_AVAILABLE = True
except ImportError:
    TIKTOKEN_AVAILABLE = False
    logging.warning("tiktoken not installed, falling back to simple tokenizer")

from infrastructure.logging_config import get_logger

logger = get_logger(__name__)


class TiktokenTokenizer:
    """
    Tiktoken-based tokenizer for realistic token generation.

    FIX P1-4: Uses tiktoken (GPT-4 cl100k_base encoding) for production-grade
    tokenization instead of simple hash-based mock. Provides:
    - Accurate token counts matching OpenAI models
    - Consistent tokenization for cache key generation
    - Realistic testing of token caching performance
    - Async interface compatible with TokenCachedRAG

    Fallback: If tiktoken is not available, uses improved word-splitting
    tokenizer with more realistic token counts.
    """

    def __init__(self, encoding_name: str = "cl100k_base"):
        """
        Initialize tiktoken tokenizer.

        Args:
            encoding_name: Tiktoken encoding name (default: cl100k_base for GPT-4)
        """
        self.encoding_name = encoding_name

        if TIKTOKEN_AVAILABLE:
            try:
                self.encoding = tiktoken.get_encoding(encoding_name)
                self.use_tiktoken = True
                logger.info(f"[TiktokenTokenizer] Initialized with encoding: {encoding_name}")
            except Exception as e:
                logger.warning(f"[TiktokenTokenizer] Failed to load tiktoken encoding: {e}, using fallback")
                self.use_tiktoken = False
        else:
            self.use_tiktoken = False
            logger.info("[TiktokenTokenizer] Using fallback tokenizer (tiktoken not available)")

    async def tokenize(self, text: str, return_ids: bool = True) -> List[int]:
        """
        Tokenize text into token IDs.

        FIX P1-4: Uses tiktoken for production-grade tokenization.

        Args:
            text: Text to tokenize
            return_ids: Whether to return token IDs (always True for compatibility)

        Returns:
            List of token IDs
        """
        if not text:
            return []

        if self.use_tiktoken:
            # Use tiktoken for accurate tokenization
            token_ids = self.encoding.encode(text)
            return token_ids
        else:
            # Fallback: improved word-splitting tokenizer
            # More realistic than simple hash: accounts for punctuation, subwords
            return self._fallback_tokenize(text)

    def _fallback_tokenize(self, text: str) -> List[int]:
        """
        Fallback tokenizer when tiktoken is not available.

        Uses word-splitting with punctuation handling to generate
        more realistic token counts (closer to actual LLM tokenization).

        Args:
            text: Text to tokenize

        Returns:
            List of token IDs (simulated)
        """
        # Split on whitespace and punctuation (approximate subword tokenization)
        import re
        # Split on word boundaries, keeping punctuation separate
        tokens = re.findall(r'\w+|[^\w\s]', text)

        # Generate stable IDs based on token content
        token_ids = []
        for token in tokens:
            # Use hash modulo to generate consistent IDs
            token_id = abs(hash(token)) % 100000  # Realistic vocab size
            token_ids.append(token_id)

        return token_ids

    async def generate_from_token_ids(
        self,
        prompt_token_ids: List[int],
        max_tokens: int = 1024,
        temperature: float = 0.7
    ) -> Dict[str, Any]:
        """
        Mock generation from token IDs (for testing).
        FIX P1-4: Vary output based on prompt to differentiate different test types

        Args:
            prompt_token_ids: List of token IDs
            max_tokens: Maximum tokens to generate
            temperature: Sampling temperature

        Returns:
            Dict with generated text
        """
        # For testing purposes, generate a mock response that varies by prompt
        # Use hash of token IDs to create deterministic but different outputs
        prompt_hash = hash(tuple(prompt_token_ids[:min(10, len(prompt_token_ids))]))
        variation = abs(prompt_hash) % 1000

        generated_text = f"Generated response from {len(prompt_token_ids)} prompt tokens"

        # Add variation to differentiate different prompts
        generated_text += f" (variation {variation}, temp={temperature:.2f})"

        return {"text": generated_text}

    def decode(self, token_ids: List[int]) -> str:
        """
        Decode token IDs back to text (for debugging).

        Args:
            token_ids: List of token IDs

        Returns:
            Decoded text
        """
        if self.use_tiktoken:
            return self.encoding.decode(token_ids)
        else:
            # Fallback: return placeholder
            return f"<{len(token_ids)} tokens>"

    def count_tokens(self, text: str) -> int:
        """
        Count tokens in text without generating full token list.

        Args:
            text: Text to count tokens for

        Returns:
            Number of tokens
        """
        if self.use_tiktoken:
            return len(self.encoding.encode(text))
        else:
            # Fallback: approximate count
            import re
            tokens = re.findall(r'\w+|[^\w\s]', text)
            return len(tokens)


def create_tiktoken_tokenizer(encoding_name: str = "cl100k_base") -> TiktokenTokenizer:
    """
    Factory function to create tiktoken tokenizer.

    Args:
        encoding_name: Tiktoken encoding name (default: cl100k_base for GPT-4)

    Returns:
        TiktokenTokenizer instance
    """
    return TiktokenTokenizer(encoding_name=encoding_name)


# Export public API
__all__ = ["TiktokenTokenizer", "create_tiktoken_tokenizer", "TIKTOKEN_AVAILABLE"]
