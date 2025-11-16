"""Retry utilities for payments operations."""
from __future__ import annotations

import random
import time
from typing import Callable, Iterable, Optional


class RetryHandler:
    """Simple exponential backoff retry handler."""

    def __init__(self,
                 max_attempts: int = 5,
                 base_delay: float = 1.0,
                 max_delay: float = 60.0,
                 exponent: float = 2.0,
                 jitter: bool = True):
        self.max_attempts = max_attempts
        self.base_delay = base_delay
        self.max_delay = max_delay
        self.exponent = exponent
        self.jitter = jitter
        self.retryable = {TimeoutError, ConnectionError}

    def should_retry(self, exc: Exception) -> bool:
        return isinstance(exc, tuple(self.retryable))

    def calculate_delay(self, attempt: int) -> float:
        delay = min(self.max_delay, self.base_delay * (self.exponent ** (attempt - 1)))
        if self.jitter:
            delay = delay * random.uniform(0.8, 1.2)
        return max(0.1, delay)

    def retry_with_backoff(self, func: Callable, *args, **kwargs):
        last_exc: Optional[Exception] = None
        for attempt in range(1, self.max_attempts + 1):
            try:
                return func(*args, **kwargs)
            except Exception as exc:
                last_exc = exc
                if not self.should_retry(exc) or attempt >= self.max_attempts:
                    raise
                delay = self.calculate_delay(attempt)
                time.sleep(delay)
        if last_exc:
            raise last_exc

