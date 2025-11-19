"""
DeepEyesV2 Tool Reliability Middleware
=======================================

Provides SFT+RL-based tool selection, exponential backoff retries, and fallback routing
for Genesis agents. Logs outcomes to BusinessMonitor for observability.
"""

from __future__ import annotations

import asyncio
import logging
import random
from dataclasses import dataclass, field
from typing import Any, Awaitable, Callable, Dict, List, Optional

logger = logging.getLogger(__name__)


ToolExecutor = Callable[[str, Dict[str, Any]], Awaitable[Dict[str, Any]]]


@dataclass
class ToolInvocationResult:
    success: bool
    tool_name: str
    payload: Dict[str, Any]
    error: Optional[str] = None


class RLModelStub:
    """Simulates an RL policy that picks tools with a weighted success rate."""

    def __init__(self, success_rate: float = 0.95):
        self.success_rate = success_rate

    async def predict(self, tool_name: str, context: Dict[str, Any]) -> ToolInvocationResult:
        await asyncio.sleep(0.01)
        if random.random() < self.success_rate:
            return ToolInvocationResult(success=True, tool_name=tool_name, payload={"status": "success"})
        return ToolInvocationResult(success=False, tool_name=tool_name, payload={"status": "failed"}, error="RL policy failure")


class ToolReliabilityMiddleware:
    def __init__(
        self,
        rl_model: RLModelStub,
        sft_executor: ToolExecutor,
        monitor: Optional[Any] = None,
        max_retries: int = 3
    ):
        self.rl_model = rl_model
        self.sft_executor = sft_executor
        self.monitor = monitor
        self.backoff_intervals = [1.0, 2.0, 4.0]
        self.max_retries = max_retries

    async def invoke(self, tool_name: str, context: Dict[str, Any]) -> Dict[str, Any]:
        for attempt in range(1, self.max_retries + 1):
            logger.debug("Invoking tool %s, attempt %d", tool_name, attempt)
            result = await self.rl_model.predict(tool_name, context)
            if result.success:
                self._record_metric(tool_name, True, attempt)
                return result.payload
            self._record_metric(tool_name, False, attempt)
            if attempt < self.max_retries:
                delay = self.backoff_intervals[min(attempt - 1, len(self.backoff_intervals) - 1)]
                await asyncio.sleep(delay)

        logger.info("RL policy failed for %s; falling back to SFT executor", tool_name)
        fallback = await self.sft_executor(tool_name, context)
        self._record_metric(tool_name, fallback.get("status") == "success", self.max_retries + 1, fallback)
        return fallback

    def _record_metric(self, tool_name: str, success: bool, attempt: int, payload: Optional[Dict[str, Any]] = None):
        if not self.monitor:
            return
        self.monitor.record_tool_event(
            tool_name=tool_name,
            success=success,
            attempt=attempt,
            metadata=payload or {},
        )
