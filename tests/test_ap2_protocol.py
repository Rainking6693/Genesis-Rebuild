"""
Tests for the AP2 protocol client.
Verifies event logging, alert generation, and singleton semantics.
"""

import json
from pathlib import Path

import pytest

from infrastructure.ap2_protocol import AP2Client, AP2Event, get_ap2_client


def test_ap2_client_records_events(tmp_path: Path):
    client = AP2Client(log_dir=tmp_path)
    client.budget = 10.0
    event = AP2Event(
        agent="test-agent",
        action="run-check",
        cost_usd=2.5,
        budget_usd=client.budget,
        context={"phase": "unit-test"},
    )
    client.record_event(event)

    events_path = tmp_path / "events.jsonl"
    assert events_path.exists()
    lines = events_path.read_text().strip().splitlines()
    assert len(lines) == 1
    data = json.loads(lines[0])
    assert data["agent"] == "test-agent"
    assert data["action"] == "run-check"
    assert data["cost_usd"] == 2.5
    assert pytest.approx(client.spent, rel=1e-3) == 2.5

    alerts_path = tmp_path / "alerts.jsonl"
    assert not alerts_path.exists()


def test_ap2_client_alerts_on_budget_threshold(tmp_path: Path):
    client = AP2Client(log_dir=tmp_path)
    client.budget = 1.0
    event = AP2Event(
        agent="test-alert",
        action="over-budget",
        cost_usd=1.0,
        budget_usd=client.budget,
        context={"reason": "stress"},
    )
    client.record_event(event)

    alert_path = tmp_path / "alerts.jsonl"
    assert alert_path.exists()
    alert = json.loads(alert_path.read_text().strip())
    assert alert["agent"] == "test-alert"
    assert alert["action"] == "over-budget"
    assert alert["type"] == "ap2_budget"

    singleton_a = get_ap2_client()
    singleton_b = get_ap2_client()
    assert singleton_a is singleton_b


def test_ap2_client_posts_sevalla(monkeypatch, tmp_path: Path):
    posted = []

    def fake_post(url, json, headers, timeout):
        posted.append({
            "url": url,
            "json": json,
            "headers": headers,
            "timeout": timeout
        })

        class FakeResponse:
            def raise_for_status(self_non):
                return None

        return FakeResponse()

    monkeypatch.setenv("AP2_SEVALLA_ALERT_URL", "https://alerts.sevalla.test/v1/event")
    monkeypatch.setenv("AP2_SEVALLA_API_KEY", "sevalla-test-token")
    monkeypatch.setenv("AP2_SEVALLA_APP_ID", "test-app")
    monkeypatch.setattr("infrastructure.ap2_protocol.requests.post", fake_post)

    client = AP2Client(log_dir=tmp_path)
    client.budget = 1.0
    client.record_event(AP2Event(
        agent="sevalla-agent",
        action="over-budget",
        cost_usd=1.0,
        budget_usd=client.budget,
        context={"phase": "alert"},
    ))

    assert posted, "Sevalla alert should be triggered"
    payload = posted[0]["json"]
    assert payload["metadata"]["agent"] == "sevalla-agent"
    assert payload["metadata"]["action"] == "over-budget"
    assert payload["metadata"]["app_id"] == "test-app"
