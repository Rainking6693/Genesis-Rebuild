# Enhanced Genesis Dashboard with Live Activity Feed on All Pages
from __future__ import annotations

import streamlit as st
import pandas as pd
from datetime import datetime
from typing import List
import sys

# Import the comprehensive dashboard data helpers
sys.path.insert(0, '/home/genesis/genesis-rebuild/scripts')
from genesis_data_source import parse_log_metrics, get_generated_businesses, get_real_metrics as _get_real_metrics


# ==================== LIVE ACTIVITY COMPONENT ====================
def _format_event_line(event: dict) -> str:
    event_type = event.get("event_type", "").replace("_", " ").title()
    data = event.get("data", {})
    business = data.get("business_id", "-")
    component = data.get("component")
    agent = data.get("agent")

    parts: List[str] = [event_type, f"business={business}"]
    if component:
        parts.append(f"component={component}")
    if agent:
        parts.append(f"agent={agent}")
    if event_type == "Business Completed":
        parts.append(f"success={data.get('success', False)}")
        duration = data.get("duration")
        if duration is not None:
            parts.append(f"duration={duration:.1f}s")
    return " | ".join(parts)


def render_live_activity_feed(title="📋 Live Activity Feed", max_items: int = 15) -> None:
    """Render live activity feed sourced from business generation events."""
    st.markdown(f"### {title}")

    metrics = parse_log_metrics()
    events = metrics.get("events", [])

    if not events:
        st.caption("No events recorded yet. Start the autonomous loop to populate activity.")
        return

    st.markdown("*Auto-updates on page refresh*")

    for event in list(events)[-max_items:][::-1]:
        timestamp = event.get("timestamp")
        if isinstance(timestamp, datetime):
            time_str = timestamp.strftime("%Y-%m-%d %H:%M:%S")
        else:
            time_str = str(timestamp)

        message = _format_event_line(event)
        event_type = event.get("event_type", "").lower()
        if "failed" in event_type or event_type == "business_failed":
            st.error(f"🔴 `{time_str}` - {message}")
        elif event_type == "business_completed":
            st.success(f"🟢 `{time_str}` - {message}")
        elif event_type == "component_completed":
            st.info(f"🔵 `{time_str}` - {message}")
        else:
            st.warning(f"🟡 `{time_str}` - {message}")


# ==================== REAL DATA METRICS ====================
def get_real_metrics(time_window: str = "24h"):
    return _get_real_metrics(time_window=time_window)


__all__ = ['render_live_activity_feed', 'get_real_metrics']

