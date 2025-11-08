"""
Genesis Health Check Service
============================

Provides a cloud-native health endpoint for the autonomous Genesis stack.

Checks performed:
- Environment credentials (Gemini, Claude, Vertex, OpenAI)
- Recent autonomous activity from business generation logs
- Prometheus /metrics readiness (if configured)
- Pending pipeline backlog (businesses started but unfinished)
"""

from __future__ import annotations

import json
import logging
import os
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, List, Optional, Tuple
from urllib import request, error as urlerror

from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse

try:
    from infrastructure.load_env import load_genesis_env  # type: ignore
except Exception:  # pragma: no cover - defensive import guard
    load_genesis_env = None  # type: ignore

logger = logging.getLogger(__name__)


class HealthCheckService:
    """Service for checking overall Genesis system health."""

    REQUIRED_ENV_VARS: Tuple[str, ...] = (
        "GEMINI_API_KEY",
        "ANTHROPIC_API_KEY",
        "OPENAI_API_KEY",
        "GOOGLE_APPLICATION_CREDENTIALS_JSON",
    )

    def __init__(
        self,
        events_path: Optional[Path] = None,
        prometheus_endpoint: Optional[str] = None,
        recent_activity_window_minutes: int = 10,
    ) -> None:
        self.events_path = events_path or Path(
            "/home/genesis/genesis-rebuild/logs/business_generation/events.jsonl"
        )
        self.prometheus_endpoint = (
            prometheus_endpoint
            or os.getenv("PROMETHEUS_ENDPOINT")
            or os.getenv("PROMETHEUS_BASE_URL")
        )
        if self.prometheus_endpoint and not self.prometheus_endpoint.endswith("/" ):
            self.prometheus_endpoint = f"{self.prometheus_endpoint.rstrip('/')}/"
        self.recent_activity_window = timedelta(minutes=recent_activity_window_minutes)

        if load_genesis_env is not None:
            try:
                load_genesis_env()
            except Exception as exc:  # pragma: no cover - log and continue
                logger.warning("Failed to eagerly load Genesis environment: %s", exc)

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------
    def check_all(self) -> Dict[str, object]:
        """Run all checks and return structured payload."""
        env_status = self._check_environment()
        activity_status = self._check_recent_activity()
        prometheus_status = self._check_prometheus()
        backlog_status = self._check_backlog()

        checks = {
            "environment": env_status,
            "recent_activity": activity_status,
            "prometheus": prometheus_status,
            "backlog": backlog_status,
        }

        status_priority = {"ok": 0, "warn": 1, "error": 2}
        worst_status = max(checks.values(), key=lambda c: status_priority[c["status"]])
        overall = worst_status["status"]

        return {
            "status": overall,
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "checks": checks,
        }

    # ------------------------------------------------------------------
    # Individual checks
    # ------------------------------------------------------------------
    def _check_environment(self) -> Dict[str, object]:
        missing: List[str] = []
        for key in self.REQUIRED_ENV_VARS:
            value = os.getenv(key)
            if not value:
                missing.append(key)
        status = "ok" if not missing else "warn"
        return {
            "status": status,
            "missing": missing,
        }

    def _check_recent_activity(self) -> Dict[str, object]:
        events = self._load_events()
        if not events:
            return {
                "status": "warn",
                "message": "No events recorded yet",
                "latest_event": None,
                "businesses_completed_24h": 0,
                "components_completed_24h": 0,
            }

        latest_event_time = max(event["timestamp"] for event in events)
        now = datetime.utcnow()
        time_since_last = now - latest_event_time
        status = "ok" if time_since_last <= self.recent_activity_window else "warn"

        completed_businesses = sum(
            1
            for event in events
            if event["event_type"] == "business_completed" and event.get("data", {}).get("success")
        )
        component_completions = sum(
            1 for event in events if event["event_type"] == "component_completed"
        )

        return {
            "status": status,
            "latest_event": latest_event_time.isoformat() + "Z",
            "minutes_since_last_event": round(time_since_last.total_seconds() / 60, 2),
            "businesses_completed_24h": completed_businesses,
            "components_completed_24h": component_completions,
        }

    def _check_prometheus(self) -> Dict[str, object]:
        if not self.prometheus_endpoint:
            return {
                "status": "warn",
                "message": "PROMETHEUS_ENDPOINT not configured",
            }

        url = f"{self.prometheus_endpoint}-/ready"
        try:
            with request.urlopen(url, timeout=3) as resp:
                healthy = resp.status == 200
        except urlerror.URLError as exc:  # pragma: no cover - network failures
            logger.warning("Prometheus readiness probe failed: %s", exc)
            return {
                "status": "warn",
                "message": f"Prometheus probe failed: {exc}"[:200],
            }

        return {
            "status": "ok" if healthy else "warn",
            "message": "Prometheus ready" if healthy else "Prometheus not ready",
        }

    def _check_backlog(self) -> Dict[str, object]:
        events = self._load_events()
        active: Dict[str, datetime] = {}
        completed: set[str] = set()

        for event in events:
            data = event.get("data", {})
            business_id = data.get("business_id")
            if not business_id:
                continue

            if event["event_type"] == "business_started":
                active[business_id] = event["timestamp"]
            elif event["event_type"] == "business_completed":
                completed.add(business_id)
                active.pop(business_id, None)

        oldest_active_minutes: Optional[float] = None
        if active:
            oldest_start = min(active.values())
            oldest_active_minutes = round(
                (datetime.utcnow() - oldest_start).total_seconds() / 60, 2
            )

        status = "ok" if not active else "warn"
        return {
            "status": status,
            "active_businesses": len(active),
            "oldest_active_minutes": oldest_active_minutes,
            "completed_24h": len(completed),
        }

    # ------------------------------------------------------------------
    # Helpers
    # ------------------------------------------------------------------
    def _load_events(self) -> List[Dict[str, object]]:
        if not self.events_path.exists():
            return []

        events: List[Dict[str, object]] = []
        cutoff = datetime.utcnow() - timedelta(hours=24)

        try:
            with self.events_path.open("r") as handle:
                for line in handle:
                    line = line.strip()
                    if not line:
                        continue
                    try:
                        payload = json.loads(line)
                        timestamp_str = payload.get("timestamp")
                        if not timestamp_str:
                            continue
                        timestamp = datetime.fromisoformat(timestamp_str)
                        if timestamp < cutoff:
                            continue
                        payload["timestamp"] = timestamp
                        events.append(payload)
                    except json.JSONDecodeError:
                        logger.debug("Skipping malformed event line: %s", line[:128])
        except OSError as exc:  # pragma: no cover - file read errors
            logger.warning("Unable to read events log: %s", exc)

        return events


# FastAPI application ---------------------------------------------------
app = FastAPI(title="Genesis Health Check")
health_service: Optional[HealthCheckService] = None


@app.on_event("startup")
async def startup_event() -> None:
    global health_service
    health_service = HealthCheckService()
    logger.info("Genesis health check service initialized")


@app.get("/health")
async def health_check() -> JSONResponse:
    if not health_service:
        raise HTTPException(status_code=503, detail="Health service unavailable")

    result = health_service.check_all()
    status_code = 200 if result["status"] == "ok" else 503
    return JSONResponse(content=result, status_code=status_code)


@app.get("/ready")
async def readiness_check() -> JSONResponse:
    if not health_service:
        raise HTTPException(status_code=503, detail="Health service unavailable")

    result = health_service.check_all()
    status_code = 200 if result["status"] == "ok" else 503
    return JSONResponse(content=result, status_code=status_code)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("HEALTH_PORT", "8080")))

