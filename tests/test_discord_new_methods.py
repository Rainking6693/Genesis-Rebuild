"""Tests for newly implemented Discord notification methods."""

import asyncio
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
async def test_agent_lifecycle_started(monkeypatch):
    """Test agent_lifecycle() for started status."""
    monkeypatch.setenv("DISCORD_WEBHOOK_DASHBOARD", "https://example.com/dashboard")
    session = _FakeSession()
    discord = GenesisDiscord(session=session)

    await discord.agent_lifecycle(
        agent_name="QAAgent",
        status="started",
        operation="test_run",
    )

    assert len(session.requests) == 1
    payload = session.requests[0]["json"]
    embed = payload["embeds"][0]
    assert "QAAgent" in embed["title"]
    assert embed["title"].startswith("🚀")
    assert "test_run" in embed["description"]


@pytest.mark.asyncio
async def test_agent_lifecycle_completed(monkeypatch):
    """Test agent_lifecycle() for completed status."""
    monkeypatch.setenv("DISCORD_WEBHOOK_DASHBOARD", "https://example.com/dashboard")
    session = _FakeSession()
    discord = GenesisDiscord(session=session)

    await discord.agent_lifecycle(
        agent_name="DocumentationAgent",
        status="completed",
        operation="doc_generation",
        duration_ms=1234.56,
    )

    assert len(session.requests) == 1
    payload = session.requests[0]["json"]
    embed = payload["embeds"][0]
    assert "DocumentationAgent" in embed["title"]
    assert embed["title"].startswith("✅")
    assert "1235ms" in embed["description"]  # Duration should be present (rounded to .0f)


@pytest.mark.asyncio
async def test_agent_lifecycle_error(monkeypatch):
    """Test agent_lifecycle() for error status."""
    monkeypatch.setenv("DISCORD_WEBHOOK_DASHBOARD", "https://example.com/dashboard")
    session = _FakeSession()
    discord = GenesisDiscord(session=session)

    await discord.agent_lifecycle(
        agent_name="CodeReviewAgent",
        status="error",
        operation="code_analysis",
        error="Memory limit exceeded",
    )

    assert len(session.requests) == 1
    payload = session.requests[0]["json"]
    embed = payload["embeds"][0]
    assert "CodeReviewAgent" in embed["title"]
    assert embed["title"].startswith("❌")
    assert "Memory limit exceeded" in embed["description"]


@pytest.mark.asyncio
async def test_agent_lifecycle_case_insensitive(monkeypatch):
    """Test agent_lifecycle() handles status case-insensitively."""
    monkeypatch.setenv("DISCORD_WEBHOOK_DASHBOARD", "https://example.com/dashboard")
    session = _FakeSession()
    discord = GenesisDiscord(session=session)

    await discord.agent_lifecycle(
        agent_name="TestAgent",
        status="STARTED",  # Uppercase
        operation="test",
    )

    assert len(session.requests) == 1
    payload = session.requests[0]["json"]
    embed = payload["embeds"][0]
    assert "🚀" in embed["title"]


@pytest.mark.asyncio
async def test_deployment_complete(monkeypatch):
    """Test deployment_complete() sends correct notification."""
    monkeypatch.setenv("DISCORD_WEBHOOK_DEPLOYMENTS", "https://example.com/deployments")
    session = _FakeSession()
    discord = GenesisDiscord(session=session)

    await discord.deployment_complete({
        "name": "CarbonCalc",
        "url": "https://carboncalc.example.com",
        "quality_score": 95,
        "build_time": "45.2s",
    })

    assert len(session.requests) == 1
    payload = session.requests[0]["json"]
    embed = payload["embeds"][0]
    assert "CarbonCalc" in embed["title"]
    assert "🚀" in embed["title"]
    assert "carboncalc.example.com" in embed["description"]
    assert "95" in embed["description"]
    assert "45.2s" in embed["description"]


@pytest.mark.asyncio
async def test_deployment_complete_missing_quality_score(monkeypatch):
    """Test deployment_complete() handles missing quality_score gracefully."""
    monkeypatch.setenv("DISCORD_WEBHOOK_DEPLOYMENTS", "https://example.com/deployments")
    session = _FakeSession()
    discord = GenesisDiscord(session=session)

    await discord.deployment_complete({
        "name": "TestApp",
        "url": "https://example.com",
        "build_time": "30s",
    })

    assert len(session.requests) == 1
    payload = session.requests[0]["json"]
    embed = payload["embeds"][0]
    assert "TestApp" in embed["title"]
    # Quality score should show as n/a or be omitted
    assert "n/a" not in embed["description"] or "Quality" not in embed["description"]


@pytest.mark.asyncio
async def test_billing_event_with_revenue(monkeypatch):
    """Test billing_event() with revenue metrics."""
    monkeypatch.setenv("DISCORD_WEBHOOK_REVENUE", "https://example.com/revenue")
    session = _FakeSession()
    discord = GenesisDiscord(session=session)

    await discord.billing_event({
        "action": "Monthly revenue report generated",
        "total_revenue": 245678.90,
        "transaction_count": 1567,
        "avg_transaction_value": 156.73,
        "mrr": 78456.30,
    })

    assert len(session.requests) == 1
    payload = session.requests[0]["json"]
    embed = payload["embeds"][0]
    assert "💰" in embed["title"]
    assert "Billing Event" in embed["title"]
    assert "fields" in embed
    assert len(embed["fields"]) >= 3

    # Check that revenue values are formatted correctly
    field_names = {f["name"] for f in embed["fields"]}
    assert "Total Revenue" in field_names
    assert "Transactions" in field_names
    field_values = {f["name"]: f["value"] for f in embed["fields"]}
    assert "$245,678.90" in field_values["Total Revenue"]
    assert "1567" in field_values["Transactions"]


@pytest.mark.asyncio
async def test_billing_event_minimal(monkeypatch):
    """Test billing_event() with minimal data."""
    monkeypatch.setenv("DISCORD_WEBHOOK_REVENUE", "https://example.com/revenue")
    session = _FakeSession()
    discord = GenesisDiscord(session=session)

    await discord.billing_event({
        "action": "Payment processed",
    })

    assert len(session.requests) == 1
    payload = session.requests[0]["json"]
    embed = payload["embeds"][0]
    assert "Payment processed" in embed["description"]
    # No fields should be present when no metrics provided
    assert "fields" not in embed or embed.get("fields") is None


@pytest.mark.asyncio
async def test_billing_event_formats_currency(monkeypatch):
    """Test billing_event() correctly formats currency values."""
    monkeypatch.setenv("DISCORD_WEBHOOK_REVENUE", "https://example.com/revenue")
    session = _FakeSession()
    discord = GenesisDiscord(session=session)

    await discord.billing_event({
        "action": "Daily report",
        "total_revenue": 1234.5,
        "avg_transaction_value": 56.78,
    })

    assert len(session.requests) == 1
    payload = session.requests[0]["json"]
    embed = payload["embeds"][0]
    field_values = {f["name"]: f["value"] for f in embed["fields"]}

    # Should be formatted with commas and 2 decimal places
    assert "$1,234.50" in field_values["Total Revenue"]
    assert "$56.78" in field_values["Avg Transaction"]


@pytest.mark.asyncio
async def test_skip_new_methods_when_webhook_missing(monkeypatch):
    """Test new methods don't send when webhook is missing."""
    # Remove all webhooks
    for key in (
        "DISCORD_WEBHOOK_DASHBOARD",
        "DISCORD_WEBHOOK_DEPLOYMENTS",
        "DISCORD_WEBHOOK_REVENUE",
    ):
        monkeypatch.delenv(key, raising=False)

    session = _FakeSession()
    discord = GenesisDiscord(session=session)

    # These should not result in requests when webhooks are missing
    await discord.agent_lifecycle("TestAgent", "started", "test")
    await discord.deployment_complete({"name": "Test"})
    await discord.billing_event({"action": "test"})

    # No requests should have been made
    assert len(session.requests) == 0
