"""
Real-time data source for the Genesis dashboard.

Rather than returning seeded demo values, this module reads directly from the
business generation event log and infrastructure logs to derive accurate
statistics for the dashboard.
"""
from __future__ import annotations

import json
import os
from collections import defaultdict
from dataclasses import dataclass
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, Iterable, List, Optional

WORKSPACE_ROOT = Path(os.getenv("GENESIS_WORKSPACE_ROOT", Path(__file__).resolve().parents[1]))
EVENTS_LOG = WORKSPACE_ROOT / "logs/business_generation/events.jsonl"
INFRA_LOG = WORKSPACE_ROOT / "logs/infrastructure.log"

# Default values used when a metric cannot be computed yet
DEFAULT_REVENUE_PER_BUSINESS = 0.0
DEFAULT_COST_PER_COMPONENT = 0.0


@dataclass
class ComponentRecord:
    business_id: str
    component: str
    agent: Optional[str]
    started_at: datetime


def _load_events(hours: float) -> List[Dict[str, object]]:
    """Return events within the provided time window (hours)."""
    if not EVENTS_LOG.exists():
        return []

    cutoff = datetime.utcnow() - timedelta(hours=hours)
    events: List[Dict[str, object]] = []

    with EVENTS_LOG.open("r", encoding="utf-8") as handle:
        for line in handle:
            line = line.strip()
            if not line:
                continue
            try:
                payload = json.loads(line)
            except json.JSONDecodeError:
                continue

            timestamp_str = payload.get("timestamp")
            if not timestamp_str:
                continue
            try:
                timestamp = datetime.fromisoformat(timestamp_str)
            except ValueError:
                continue

            if timestamp < cutoff:
                continue

            payload["timestamp"] = timestamp
            events.append(payload)

    return events


def _load_recent_infra_logs(lines: int = 200) -> List[str]:
    if not INFRA_LOG.exists():
        return []

    try:
        log_lines = INFRA_LOG.read_text(encoding="utf-8").splitlines()
    except OSError:
        return []

    if lines <= 0 or len(log_lines) <= lines:
        return log_lines
    return log_lines[-lines:]


def _bucket_events(events: Iterable[Dict[str, object]], bucket_minutes: int = 60) -> Dict[str, int]:
    buckets: Dict[str, int] = defaultdict(int)
    for event in events:
        if event.get("event_type") != "component_completed":
            continue
        timestamp = event.get("timestamp")
        if not isinstance(timestamp, datetime):
            continue
        rounded = timestamp.replace(minute=0, second=0, microsecond=0)
        if bucket_minutes != 60:
            minute = (timestamp.minute // bucket_minutes) * bucket_minutes
            rounded = timestamp.replace(minute=minute, second=0, microsecond=0)
        buckets[rounded.isoformat() + "Z"] += 1
    return dict(sorted(buckets.items()))


def _agent_success(events: Iterable[Dict[str, object]]) -> Dict[str, Dict[str, float]]:
    active: Dict[tuple, ComponentRecord] = {}
    stats: Dict[str, Dict[str, float]] = defaultdict(
        lambda: {"completed": 0.0, "failed": 0.0, "total_duration": 0.0}
    )

    for event in events:
        event_type = event.get("event_type")
        data = event.get("data", {})
        business_id = data.get("business_id")
        component = data.get("component")
        agent = data.get("agent")

        if not business_id or not component:
            continue

        key = (business_id, component)

        if event_type == "component_started":
            started_at = event["timestamp"] if isinstance(event.get("timestamp"), datetime) else datetime.utcnow()
            active[key] = ComponentRecord(
                business_id=business_id,
                component=component,
                agent=agent,
                started_at=started_at,
            )
        elif event_type == "component_completed":
            record = active.pop(key, None)
            agent_id = agent or (record.agent if record else None)
            if agent_id:
                stats[agent_id]["completed"] += 1
                if record and isinstance(event.get("timestamp"), datetime):
                    duration = (event["timestamp"] - record.started_at).total_seconds()
                    stats[agent_id]["total_duration"] += max(duration, 0.0)
        elif event_type == "component_failed":  # optional future event type
            record = active.pop(key, None)
            agent_id = agent or (record.agent if record else None)
            if agent_id:
                stats[agent_id]["failed"] += 1

    return stats


def parse_log_metrics(time_window: str = "24h") -> Dict[str, object]:
    """Compute metrics for the requested Prometheus-style query window."""
    hours = _time_range_to_hours(time_window)
    events = _load_events(hours)

    businesses_started: Dict[str, datetime] = {}
    businesses_completed: Dict[str, Dict[str, object]] = {}
    components_completed = 0

    for event in events:
        event_type = event.get("event_type")
        data = event.get("data", {})
        business_id = data.get("business_id")
        if event_type == "business_started" and business_id:
            businesses_started[business_id] = event["timestamp"]
        elif event_type == "business_completed" and business_id:
            businesses_completed[business_id] = {
                "success": data.get("success", False),
                "duration": data.get("duration"),
            }
        elif event_type == "component_completed":
            components_completed += 1

    total_businesses = len(businesses_started)
    successful_businesses = sum(1 for entry in businesses_completed.values() if entry.get("success"))
    success_rate = (
        successful_businesses / total_businesses if total_businesses > 0 else 0.0
    )

    agent_stats = _agent_success(events)

    return {
        "events": events,
        "businesses_started": businesses_started,
        "businesses_completed": businesses_completed,
        "components_completed": components_completed,
        "success_rate": success_rate,
        "agent_stats": agent_stats,
        "tasks_time_series": _bucket_events(events),
        "infra_logs": _load_recent_infra_logs(),
        "errors": [line for line in _load_recent_infra_logs() if "ERROR" in line],
    }


def get_generated_businesses(limit: Optional[int] = None) -> List[Dict[str, object]]:
    businesses: List[Dict[str, object]] = []
    businesses_dir = WORKSPACE_ROOT / "businesses"
    if not businesses_dir.exists():
        return businesses

    for path in sorted(businesses_dir.glob("*"), key=lambda p: p.stat().st_mtime, reverse=True):
        if not path.is_dir():
            continue
        entry = {
            "name": path.name,
            "path": str(path),
            "created": datetime.fromtimestamp(path.stat().st_mtime),
        }
        businesses.append(entry)
        if limit and len(businesses) >= limit:
            break
    return businesses


def query_prom(query: str, default: float = 0.0, time_window: str = "24h") -> float:
    metrics = parse_log_metrics(time_window)
    businesses_completed = metrics["businesses_completed"]
    components_completed = metrics["components_completed"]

    if "genesis_revenue_total" in query:
        return len(businesses_completed) * DEFAULT_REVENUE_PER_BUSINESS
    if "genesis_operating_cost_total" in query:
        return components_completed * DEFAULT_COST_PER_COMPONENT
    if "genesis_active_businesses" in query:
        return len(metrics["businesses_started"]) - len(businesses_completed)
    if "genesis_tasks_total" in query and "completed" in query:
        return float(components_completed)
    if "genesis_task_success_rate" in query:
        return metrics["success_rate"]
    if "genesis_human_interventions_total" in query:
        return float(len(metrics["errors"]))
    if "genesis_agent_success_rate" in query:
        agent_name = _extract_label_value(query, "agent_name")
        agent_stats = metrics["agent_stats"].get(
            agent_name or "", {"completed": 0.0, "failed": 0.0, "total_duration": 0.0}
        )
        total = agent_stats["completed"] + agent_stats["failed"]
        if total == 0:
            return default or 0.0
        return agent_stats["completed"] / total
    if "process_start_time_seconds" in query:
        # Approximate uptime as current time minus earliest business start
        if metrics["businesses_started"]:
            earliest = min(metrics["businesses_started"].values())
            return earliest.timestamp()
        return datetime.utcnow().timestamp()

    return default


def get_real_metrics(time_window: str = "24h") -> Dict[str, object]:
    metrics = parse_log_metrics(time_window)
    businesses = get_generated_businesses()

    last_event = None
    if metrics["events"]:
        last_event = max(metrics["events"], key=lambda e: e["timestamp"])

    return {
        "time_window": time_window,
        "business_count": len(metrics["businesses_completed"]),
        "active_businesses": len(metrics["businesses_started"]) - len(metrics["businesses_completed"]),
        "components_completed": metrics["components_completed"],
        "success_rate": metrics["success_rate"],
        "agent_stats": metrics["agent_stats"],
        "tasks_time_series": metrics["tasks_time_series"],
        "businesses": businesses,
        "last_event": last_event,
        "infra_errors": metrics["errors"],
    }


def _time_range_to_hours(time_window: str) -> float:
    time_window = time_window.lower().strip()
    if time_window.endswith("m"):
        return float(time_window[:-1]) / 60.0
    if time_window.endswith("h"):
        return float(time_window[:-1])
    if time_window.endswith("d"):
        return float(time_window[:-1]) * 24
    if time_window.endswith("w"):
        return float(time_window[:-1]) * 24 * 7
    # default 24 hours
    return 24.0


def _extract_label_value(query: str, label: str) -> Optional[str]:
    if label not in query or "{" not in query:
        return None
    try:
        label_section = query.split("{", 1)[1].split("}", 1)[0]
        for part in label_section.split(","):
            key, _, value = part.partition("=")
            if key.strip() == label:
                return value.strip('"')
    except Exception:
        return None
    return None

