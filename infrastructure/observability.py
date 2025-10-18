"""
OpenTelemetry Observability for Genesis Orchestration

Provides production-grade observability with:
- Distributed tracing across HTDAG, HALO, AOP layers
- Structured metrics collection (latency, success rates, costs)
- Correlation IDs for end-to-end request tracking
- Context propagation for parent-child span relationships
- Human-readable console output + machine-readable JSON logs

Integration:
- HTDAG: Decomposition time, task counts, dynamic updates
- HALO: Routing decisions, agent selections, load balancing
- AOP: Validation scores, failure reasons, quality metrics

Based on Microsoft Agent Framework observability patterns + OTEL best practices
"""

import json
import logging
import time
import uuid
from contextlib import contextmanager
from dataclasses import dataclass, field, asdict
from datetime import datetime, timezone
from enum import Enum
from typing import Any, Dict, List, Optional, Callable
from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider, Span
from opentelemetry.sdk.trace.export import ConsoleSpanExporter, BatchSpanProcessor
from opentelemetry.trace import Status, StatusCode
from infrastructure.security_utils import redact_credentials

# Initialize tracer
trace.set_tracer_provider(TracerProvider())
tracer = trace.get_tracer(__name__)

# Add console exporter for development visibility
console_exporter = ConsoleSpanExporter()
trace.get_tracer_provider().add_span_processor(
    BatchSpanProcessor(console_exporter)
)

logger = logging.getLogger(__name__)


class SpanType(Enum):
    """Span type classification for filtering"""
    ORCHESTRATION = "orchestration"  # Top-level orchestration flow
    HTDAG = "htdag"                   # Task decomposition
    HALO = "halo"                     # Agent routing
    AOP = "aop"                       # Validation
    EXECUTION = "execution"           # Agent execution


@dataclass
class CorrelationContext:
    """
    Correlation context for end-to-end request tracking

    Propagated across all orchestration layers to trace requests from
    user input → HTDAG → HALO → AOP → execution
    """
    correlation_id: str = field(default_factory=lambda: str(uuid.uuid4()))
    user_request: str = ""
    timestamp: str = field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    parent_span_id: Optional[str] = None

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for span attributes"""
        return asdict(self)


@dataclass
class MetricSnapshot:
    """
    Point-in-time metric snapshot for dashboards

    Captures key performance indicators for monitoring and alerting
    """
    metric_name: str
    value: float
    unit: str
    timestamp: str = field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    labels: Dict[str, str] = field(default_factory=dict)

    def to_json(self) -> str:
        """Serialize to JSON for logging"""
        return json.dumps(asdict(self), indent=None)


class ObservabilityManager:
    """
    Central observability manager for Genesis orchestration

    Provides span creation, metric collection, and correlation tracking
    """

    def __init__(self):
        self.tracer = tracer
        self.active_spans: Dict[str, Span] = {}
        self.metrics: List[MetricSnapshot] = []

    def create_correlation_context(self, user_request: str) -> CorrelationContext:
        """
        Create new correlation context for request

        Args:
            user_request: User's input request

        Returns:
            CorrelationContext with unique ID
        """
        ctx = CorrelationContext(user_request=user_request)
        # Redact credentials before logging
        safe_request = redact_credentials(user_request)
        logger.info(
            f"Created correlation context: {ctx.correlation_id}",
            extra={"correlation_id": ctx.correlation_id, "user_request": safe_request}
        )
        return ctx

    @contextmanager
    def span(
        self,
        name: str,
        span_type: SpanType,
        context: Optional[CorrelationContext] = None,
        attributes: Optional[Dict[str, Any]] = None
    ):
        """
        Create traced span with context propagation

        Args:
            name: Span name (e.g., "htdag.decompose_task")
            span_type: SpanType classification
            context: Correlation context for tracking
            attributes: Additional span attributes

        Yields:
            Span object for adding events/attributes

        Example:
            ```python
            with obs_manager.span("htdag.decompose", SpanType.HTDAG, context) as span:
                span.set_attribute("task_count", len(tasks))
                result = decompose_task(request)
                span.set_attribute("subtask_count", len(result))
            ```
        """
        span_attrs = {
            "span.type": span_type.value,
        }

        # Add correlation context
        if context:
            span_attrs.update(context.to_dict())

        # Add custom attributes
        if attributes:
            span_attrs.update(attributes)

        # Create span
        with self.tracer.start_as_current_span(name, attributes=span_attrs) as span:
            span_id = format(span.get_span_context().span_id, '016x')

            # Store active span
            self.active_spans[span_id] = span

            # Log span start
            logger.debug(
                f"Span started: {name}",
                extra={
                    "span_id": span_id,
                    "span_type": span_type.value,
                    "correlation_id": context.correlation_id if context else None
                }
            )

            try:
                yield span
                span.set_status(Status(StatusCode.OK))
            except Exception as e:
                # Mark span as error
                span.set_status(Status(StatusCode.ERROR, str(e)))
                span.record_exception(e)
                logger.error(
                    f"Span failed: {name}",
                    exc_info=True,
                    extra={
                        "span_id": span_id,
                        "error": str(e),
                        "correlation_id": context.correlation_id if context else None
                    }
                )
                raise
            finally:
                # Clean up
                self.active_spans.pop(span_id, None)
                logger.debug(
                    f"Span completed: {name}",
                    extra={"span_id": span_id}
                )

    def record_metric(
        self,
        metric_name: str,
        value: float,
        unit: str,
        labels: Optional[Dict[str, str]] = None
    ):
        """
        Record metric snapshot

        Args:
            metric_name: Metric identifier (e.g., "htdag.decomposition.duration")
            value: Metric value
            unit: Unit of measurement (e.g., "seconds", "count", "ratio")
            labels: Optional labels for filtering (e.g., {"agent": "spec_agent"})
        """
        snapshot = MetricSnapshot(
            metric_name=metric_name,
            value=value,
            unit=unit,
            labels=labels or {}
        )

        self.metrics.append(snapshot)

        # Log metric for structured logging
        logger.info(
            f"Metric recorded: {metric_name}={value}{unit}",
            extra={
                "metric_name": metric_name,
                "metric_value": value,
                "metric_unit": unit,
                "metric_labels": labels
            }
        )

    @contextmanager
    def timed_operation(
        self,
        operation_name: str,
        span_type: SpanType,
        context: Optional[CorrelationContext] = None
    ):
        """
        Measure operation duration with automatic metric recording

        Args:
            operation_name: Operation identifier (e.g., "htdag_decomposition")
            span_type: SpanType for span creation
            context: Correlation context

        Yields:
            Span object

        Example:
            ```python
            with obs_manager.timed_operation("htdag_decompose", SpanType.HTDAG, ctx):
                result = planner.decompose_task(request)
            # Automatically records "htdag_decompose.duration" metric
            ```
        """
        start_time = time.perf_counter()

        with self.span(operation_name, span_type, context) as span:
            try:
                yield span
            finally:
                # Record duration metric
                duration = time.perf_counter() - start_time
                self.record_metric(
                    metric_name=f"{operation_name}.duration",
                    value=duration,
                    unit="seconds",
                    labels={"operation": operation_name}
                )

                # Add duration to span
                span.set_attribute("duration_seconds", duration)

    def get_metrics_summary(self) -> Dict[str, Any]:
        """
        Get summary statistics of recorded metrics

        Returns:
            Dictionary with metric statistics
        """
        if not self.metrics:
            return {"total_metrics": 0}

        # Group by metric name
        by_name: Dict[str, List[float]] = {}
        for metric in self.metrics:
            by_name.setdefault(metric.metric_name, []).append(metric.value)

        # Calculate stats
        summary = {
            "total_metrics": len(self.metrics),
            "unique_metrics": len(by_name),
            "by_metric": {}
        }

        for name, values in by_name.items():
            summary["by_metric"][name] = {
                "count": len(values),
                "min": min(values),
                "max": max(values),
                "avg": sum(values) / len(values),
                "sum": sum(values)
            }

        return summary


# Global observability manager instance
_obs_manager: Optional[ObservabilityManager] = None


def get_observability_manager() -> ObservabilityManager:
    """
    Get global observability manager singleton

    Returns:
        ObservabilityManager instance
    """
    global _obs_manager
    if _obs_manager is None:
        _obs_manager = ObservabilityManager()
    return _obs_manager


# Convenience decorators for common patterns

def traced_operation(operation_name: str, span_type: SpanType):
    """
    Decorator to automatically trace function execution

    Args:
        operation_name: Operation identifier
        span_type: SpanType classification

    Example:
        ```python
        @traced_operation("htdag_decompose", SpanType.HTDAG)
        async def decompose_task(self, request: str, context: CorrelationContext):
            # Function automatically traced
            pass
        ```
    """
    def decorator(func: Callable):
        async def async_wrapper(*args, **kwargs):
            obs_manager = get_observability_manager()

            # Extract context if provided
            context = kwargs.get('context') or (args[1] if len(args) > 1 and isinstance(args[1], CorrelationContext) else None)

            with obs_manager.span(operation_name, span_type, context):
                return await func(*args, **kwargs)

        def sync_wrapper(*args, **kwargs):
            obs_manager = get_observability_manager()

            # Extract context if provided
            context = kwargs.get('context') or (args[1] if len(args) > 1 and isinstance(args[1], CorrelationContext) else None)

            with obs_manager.span(operation_name, span_type, context):
                return func(*args, **kwargs)

        # Return appropriate wrapper
        import inspect
        if inspect.iscoroutinefunction(func):
            return async_wrapper
        else:
            return sync_wrapper

    return decorator


def log_structured(message: str, **kwargs):
    """
    Log structured message with automatic JSON formatting

    Args:
        message: Log message
        **kwargs: Additional structured fields

    Example:
        ```python
        log_structured(
            "Task decomposed successfully",
            task_count=5,
            correlation_id=ctx.correlation_id,
            agent="htdag_planner"
        )
        ```
    """
    logger.info(message, extra=kwargs)


# Export public API
__all__ = [
    "ObservabilityManager",
    "CorrelationContext",
    "MetricSnapshot",
    "SpanType",
    "get_observability_manager",
    "traced_operation",
    "log_structured"
]
