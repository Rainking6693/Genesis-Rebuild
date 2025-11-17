"""Prometheus metrics for the OmniDaemon pipeline."""

from __future__ import annotations

from typing import Dict

try:
    from prometheus_client import Counter, Gauge
    _HAS_PROMETHEUS = True
except ImportError:  # pragma: no cover
    Counter = None
    Gauge = None
    _HAS_PROMETHEUS = False

from infrastructure.business_monitor import get_monitor

if _HAS_PROMETHEUS:
    TASKS_RECEIVED = Counter(
        "omnidaemon_tasks_received_total",
        "Total number of OmniDaemon component start events",
    )
    TASKS_COMPLETED = Counter(
        "omnidaemon_tasks_completed_total",
        "Total number of successful OmniDaemon component completions",
    )
    TASKS_FAILED = Counter(
        "omnidaemon_tasks_failed_total",
        "Total number of failed OmniDaemon component executions",
    )
    ACTIVE_BUSINESSES = Gauge(
        "business_monitor_active_businesses",
        "Current number of businesses being generated",
    )
else:  # pragma: no cover
    TASKS_RECEIVED = TASKS_COMPLETED = TASKS_FAILED = ACTIVE_BUSINESSES = None


def record_event(topic: str, payload: Dict[str, object]) -> None:
    """Increment Prometheus counters for monitoring events."""
    if not _HAS_PROMETHEUS:
        return

    if "component_started" in topic:
        TASKS_RECEIVED.inc()
    if "component_completed" in topic:
        TASKS_COMPLETED.inc()
    if "component_failed" in topic:
        TASKS_FAILED.inc()
    _sync_active_businesses()


def sync_monitor_metrics() -> None:
    """Refresh business_count gauges from the monitor."""
    _sync_active_businesses()


def _sync_active_businesses() -> None:
    if not _HAS_PROMETHEUS:
        return
    monitor = get_monitor()
    stats = monitor.get_global_stats()
    ACTIVE_BUSINESSES.set(stats.get("in_progress", 0))
