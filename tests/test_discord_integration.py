import asyncio
import os
from typing import Any, Dict, List

import pytest

from infrastructure.genesis_discord import GenesisDiscord


class _FakeResponse:
    def __init__(self, status: int = 204, body: str = ""):
        self.status = status
        self._body = body

    async def __aenter__(self):
        return self

    async def __aexit__(self, exc_type, exc, tb):
        return False

    async def text(self):
        return self._body


class _FakeSession:
    def __init__(self, status: int = 204):
        self.requests: List[Dict[str, Any]] = []
        self._status = status
        self.closed = False

    def post(self, url: str, json: Dict[str, Any], **_: Any):
        self.requests.append({"url": url, "json": json})
        return _FakeResponse(status=self._status)

    async def close(self):
        self.closed = True


@pytest.mark.asyncio
async def test_genesis_started_builds_embed(monkeypatch):
    monkeypatch.setenv("DISCORD_WEBHOOK_DASHBOARD", "https://example.com/dashboard")
    session = _FakeSession()
    discord = GenesisDiscord(session=session)

    await discord.genesis_started()

    assert len(session.requests) == 1
    payload = session.requests[0]["json"]
    assert payload["embeds"][0]["title"].startswith("🚀")


@pytest.mark.asyncio
async def test_agent_error_targets_error_channel(monkeypatch):
    monkeypatch.setenv("DISCORD_WEBHOOK_ERRORS", "https://example.com/errors")
    monkeypatch.setenv("DISCORD_WEBHOOK_ALERTS", "https://example.com/alerts")
    session = _FakeSession()
    discord = GenesisDiscord(session=session, notification_level=1)

    await discord.agent_error("biz_001", "Builder Agent", "Failure")

    assert len(session.requests) == 2
    urls = {req["url"] for req in session.requests}
    assert "https://example.com/errors" in urls
    assert "https://example.com/alerts" in urls


@pytest.mark.asyncio
async def test_skip_when_webhook_missing(monkeypatch):
    for key in (
        "DISCORD_WEBHOOK_DASHBOARD",
        "DISCORD_WEBHOOK_ERRORS",
        "DISCORD_WEBHOOK_ALERTS",
        "DISCORD_WEBHOOK_METRICS",
        "DISCORD_WEBHOOK_REVENUE",
    ):
        monkeypatch.delenv(key, raising=False)

    session = _FakeSession()
    discord = GenesisDiscord(session=session)

    await discord.daily_report({"businesses_built": 1, "success_rate": 100, "avg_quality_score": 95, "total_revenue": 10.0, "active_businesses": 1})

    assert session.requests == []


@pytest.mark.asyncio
async def test_genesis_shutdown_notifies_dashboard(monkeypatch):
    monkeypatch.setenv("DISCORD_WEBHOOK_DASHBOARD", "https://example.com/dashboard")
    session = _FakeSession()
    discord = GenesisDiscord(session=session)

    await discord.genesis_shutdown()

    assert len(session.requests) == 1
    payload = session.requests[0]["json"]
    assert payload["embeds"][0]["title"].startswith("⛔")
