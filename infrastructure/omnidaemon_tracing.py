"""OpenTelemetry helpers for OmniDaemon callbacks."""

from __future__ import annotations

import asyncio
import functools
from typing import Any, Awaitable, Callable, Dict

try:
    from opentelemetry import trace
    from opentelemetry.trace import StatusCode

    _TRACER = trace.get_tracer(__name__)
except ImportError:  # pragma: no cover
    _TRACER = None

Callback = Callable[[Dict[str, Any]], Awaitable[Dict[str, Any]]]


def trace_callback(topic: str, callback: Callback) -> Callback:
    """Wrap OmniDaemon callbacks with OTEL spans."""

    if _TRACER is None:
        return callback

    if not asyncio.iscoroutinefunction(callback):
        return callback

    @functools.wraps(callback)
    async def wrapper(message: Dict[str, Any]) -> Dict[str, Any]:
        with _TRACER.start_as_current_span(f"omnidaemon.{topic.replace('.', '_')}") as span:
            span.set_attribute("omnidaemon.topic", topic)
            content = message.get("content") or {}
            span.set_attribute("omnidaemon.business_id", content.get("business_id", "unknown"))
            span.set_attribute("omnidaemon.agent", content.get("agent", "unknown"))
            try:
                result = await callback(message)
                span.set_attribute("omnidaemon.status", "success")
                return result
            except Exception as exc:  # pragma: no cover
                span.set_status(StatusCode.ERROR)
                span.record_exception(exc)
                raise

    return wrapper
