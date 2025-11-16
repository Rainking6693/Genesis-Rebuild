"""
Comprehensive test suite for AP2 Integration Plan Sections 1-3.

Sections covered:
1. Core AP2 Protocol Implementation (AP2_INTEGRATION_PLAN.md Section 2)
2. Agent Integration (AP2_INTEGRATION_PLAN.md Section 3)
3. Business Monitor Integration (AP2_INTEGRATION_PLAN.md Section 5)

This test suite validates:
- AP2 protocol schema and helpers
- Event logging and budget tracking
- Alert generation at thresholds
- Agent integration (all 6 spending agents)
- BusinessMonitor.record_ap2_event integration
- Compliance reporting
- Sevalla integration
"""

import json
import os
import tempfile
from pathlib import Path
from typing import Dict
from unittest.mock import MagicMock, patch

import pytest

# Section 1: Core AP2 Protocol
from infrastructure.ap2_protocol import (
    AP2Client,
    AP2Event,
    get_ap2_client,
    DEFAULT_BUDGET,
    ALERT_THRESHOLD,
)
from infrastructure.ap2_helpers import record_ap2_event

# Section 2: Business Monitor Integration
from infrastructure.business_monitor import get_monitor, BusinessMonitor


# ============================================================================
# Section 1: Core AP2 Protocol Implementation Tests
# ============================================================================

class TestAP2CoreProtocol:
    """Test suite for AP2 protocol core implementation."""

    def test_ap2_event_creation(self):
        """Test AP2Event dataclass creation and serialization."""
        event = AP2Event(
            agent="TestAgent",
            action="test_action",
            cost_usd=1.5,
            budget_usd=10.0,
            context={"env": "test", "phase": "unit"}
        )

        assert event.agent == "TestAgent"
        assert event.action == "test_action"
        assert event.cost_usd == 1.5
        assert event.budget_usd == 10.0
        assert event.context["env"] == "test"
        assert event.timestamp  # Should be auto-generated

    def test_ap2_event_to_dict(self):
        """Test AP2Event.to_dict() serialization."""
        event = AP2Event(
            agent="TestAgent",
            action="test_action",
            cost_usd=2.0,
            budget_usd=5.0,
            context={"key": "value"}
        )

        data = event.to_dict()
        assert isinstance(data, dict)
        assert data["agent"] == "TestAgent"
        assert data["cost_usd"] == 2.0
        assert "timestamp" in data

    def test_ap2_event_to_json(self):
        """Test AP2Event.to_json() JSON serialization."""
        event = AP2Event(
            agent="TestAgent",
            action="test_action",
            cost_usd=1.0,
            budget_usd=10.0,
            context={}
        )

        json_str = event.to_json()
        parsed = json.loads(json_str)
        assert parsed["agent"] == "TestAgent"
        assert parsed["cost_usd"] == 1.0

    def test_ap2_client_initialization(self, tmp_path):
        """Test AP2Client initializes with correct defaults."""
        client = AP2Client(log_dir=tmp_path)

        assert client.log_dir == tmp_path
        assert client.log_dir.exists()
        assert client.budget == DEFAULT_BUDGET
        assert client.spent == 0.0

    def test_ap2_client_records_event(self, tmp_path):
        """Test AP2Client.record_event() logs events to file."""
        client = AP2Client(log_dir=tmp_path)
        event = AP2Event(
            agent="RecordTestAgent",
            action="record_test",
            cost_usd=0.5,
            budget_usd=10.0,
            context={"test": "record"}
        )

        client.record_event(event)

        # Verify spent is updated
        assert client.spent == 0.5

        # Verify event logged to file
        events_file = tmp_path / "events.jsonl"
        assert events_file.exists()

        with events_file.open() as f:
            logged_event = json.loads(f.read())
            assert logged_event["agent"] == "RecordTestAgent"
            assert logged_event["cost_usd"] == 0.5

    def test_ap2_client_accumulates_spend(self, tmp_path):
        """Test AP2Client accumulates spend across multiple events."""
        client = AP2Client(log_dir=tmp_path)

        client.record_event(AP2Event(
            agent="A", action="a1", cost_usd=1.0, budget_usd=10.0, context={}
        ))
        client.record_event(AP2Event(
            agent="A", action="a2", cost_usd=2.5, budget_usd=10.0, context={}
        ))
        client.record_event(AP2Event(
            agent="A", action="a3", cost_usd=0.5, budget_usd=10.0, context={}
        ))

        assert client.spent == 4.0

    def test_ap2_client_alert_threshold(self, tmp_path):
        """Test AP2Client triggers alerts when spending exceeds threshold."""
        client = AP2Client(log_dir=tmp_path)
        client.budget = 10.0

        # Spend 80% of budget to trigger alert
        threshold_cost = client.budget * ALERT_THRESHOLD
        event = AP2Event(
            agent="AlertTestAgent",
            action="big_spend",
            cost_usd=threshold_cost,
            budget_usd=client.budget,
            context={"reason": "threshold_test"}
        )

        client.record_event(event)

        # Verify alert was created
        alerts_file = tmp_path / "alerts.jsonl"
        assert alerts_file.exists()

        with alerts_file.open() as f:
            alert = json.loads(f.read())
            assert alert["type"] == "ap2_budget"
            assert alert["agent"] == "AlertTestAgent"
            assert alert["spent"] == threshold_cost
            assert alert["budget"] == 10.0

    def test_ap2_client_wrap_method(self, tmp_path):
        """Test AP2Client.wrap() creates AP2Event with context."""
        client = AP2Client(log_dir=tmp_path)

        event = client.wrap(
            agent="WrapTestAgent",
            action="wrap_test",
            cost=1.5,
            context={"budget": "20.0", "env": "test"}
        )

        assert isinstance(event, AP2Event)
        assert event.agent == "WrapTestAgent"
        assert event.action == "wrap_test"
        assert event.cost_usd == 1.5
        assert event.budget_usd == 20.0  # Should use context budget

    def test_ap2_client_wrap_default_budget(self, tmp_path):
        """Test AP2Client.wrap() uses default budget when not in context."""
        client = AP2Client(log_dir=tmp_path)
        client.budget = 15.0

        event = client.wrap(
            agent="Agent",
            action="action",
            cost=1.0,
            context={}
        )

        assert event.budget_usd == 15.0

    def test_get_ap2_client_singleton(self):
        """Test get_ap2_client() returns singleton instance."""
        client1 = get_ap2_client()
        client2 = get_ap2_client()

        assert client1 is client2


class TestAP2Helpers:
    """Test suite for AP2 helpers module."""

    def test_record_ap2_event_integration(self, tmp_path):
        """Test record_ap2_event() integrates AP2Client and BusinessMonitor."""
        # Create a temporary AP2 client
        from infrastructure.ap2_protocol import _GLOBAL_AP2_CLIENT, AP2Client
        import infrastructure.ap2_protocol

        # Reset global client
        infrastructure.ap2_protocol._GLOBAL_AP2_CLIENT = AP2Client(log_dir=tmp_path)

        event = record_ap2_event(
            agent="HelperTestAgent",
            action="helper_test",
            cost=0.5,
            context={"env": "test"}
        )

        assert isinstance(event, AP2Event)
        assert event.agent == "HelperTestAgent"
        assert event.cost_usd == 0.5

        # Verify event was logged
        events_file = tmp_path / "events.jsonl"
        assert events_file.exists()

    def test_record_ap2_event_calls_business_monitor(self, tmp_path, monkeypatch):
        """Test record_ap2_event() calls BusinessMonitor.record_ap2_event()."""
        from infrastructure.ap2_protocol import AP2Client
        import infrastructure.ap2_protocol

        # Setup
        infrastructure.ap2_protocol._GLOBAL_AP2_CLIENT = AP2Client(log_dir=tmp_path)

        # Mock BusinessMonitor
        mock_monitor = MagicMock()
        monkeypatch.setattr("infrastructure.ap2_helpers.get_monitor", lambda: mock_monitor)

        event = record_ap2_event(
            agent="MonitorTestAgent",
            action="monitor_test",
            cost=1.0,
            context={}
        )

        # Verify BusinessMonitor was called
        mock_monitor.record_ap2_event.assert_called_once()
        call_args = mock_monitor.record_ap2_event.call_args[0][0]
        assert call_args["agent"] == "MonitorTestAgent"


class TestAP2SevallaIntegration:
    """Test suite for Sevalla alert integration."""

    def test_sevalla_config_loading(self, monkeypatch):
        """Test Sevalla configuration is loaded from environment."""
        from infrastructure.ap2_protocol import _get_sevalla_config

        monkeypatch.setenv("AP2_SEVALLA_ALERT_URL", "https://sevalla.test/v1/alerts")
        monkeypatch.setenv("AP2_SEVALLA_API_KEY", "test-key-123")
        monkeypatch.setenv("AP2_SEVALLA_APP_ID", "test-app-id")

        config = _get_sevalla_config()

        assert config["url"] == "https://sevalla.test/v1/alerts"
        assert config["api_key"] == "test-key-123"
        assert config["app_id"] == "test-app-id"

    def test_sevalla_fallback_to_generic_env_vars(self, monkeypatch):
        """Test Sevalla config falls back to generic SEVALLA_* env vars."""
        from infrastructure.ap2_protocol import _get_sevalla_config

        monkeypatch.setenv("SEVALLA_ALERT_URL", "https://generic.sevalla.test")
        monkeypatch.setenv("SEVALLA_API_KEY", "generic-key")

        config = _get_sevalla_config()

        assert config["url"] == "https://generic.sevalla.test"
        assert config["api_key"] == "generic-key"

    def test_sevalla_payload_construction(self, monkeypatch):
        """Test Sevalla alert payload is constructed correctly."""
        from infrastructure.ap2_protocol import _build_sevalla_payload

        alert = {
            "agent": "PayloadTestAgent",
            "action": "test_action",
            "spent": 8.5,
            "budget": 10.0,
            "timestamp": "2025-01-01T00:00:00Z",
            "context": {"env": "test"}
        }

        config = {
            "url": "https://test.com",
            "api_key": "key",
            "app_id": "app-123"
        }

        payload = _build_sevalla_payload(alert, config)

        assert payload["title"] == "AP2 budget alert · PayloadTestAgent"
        assert "PayloadTestAgent" in payload["description"]
        assert "test_action" in payload["description"]
        assert payload["metadata"]["agent"] == "PayloadTestAgent"
        assert payload["metadata"]["cost_usd"] == 8.5
        assert payload["metadata"]["budget_usd"] == 10.0
        assert payload["metadata"]["app_id"] == "app-123"
        assert payload["metadata"]["ratio"] == 0.85  # 8.5 / 10.0

    def test_sevalla_alert_sends_request(self, tmp_path, monkeypatch):
        """Test _send_sevalla_alert() makes HTTP request when configured."""
        from infrastructure.ap2_protocol import _send_sevalla_alert

        posted_requests = []

        def fake_post(url, json, headers, timeout):
            posted_requests.append({
                "url": url,
                "json": json,
                "headers": headers,
                "timeout": timeout
            })

            class FakeResponse:
                def raise_for_status(self):
                    pass

            return FakeResponse()

        monkeypatch.setenv("AP2_SEVALLA_ALERT_URL", "https://alert.test/v1/event")
        monkeypatch.setenv("AP2_SEVALLA_API_KEY", "test-api-key")
        monkeypatch.setattr("infrastructure.ap2_protocol.requests.post", fake_post)

        alert = {
            "agent": "HTTPTestAgent",
            "action": "http_test",
            "spent": 9.0,
            "budget": 10.0,
            "timestamp": "2025-01-01T00:00:00Z",
            "context": {}
        }

        _send_sevalla_alert(alert)

        assert len(posted_requests) == 1
        req = posted_requests[0]
        assert req["url"] == "https://alert.test/v1/event"
        assert req["headers"]["Authorization"] == "Bearer test-api-key"
        assert req["json"]["metadata"]["agent"] == "HTTPTestAgent"

    def test_sevalla_alert_skipped_when_not_configured(self, tmp_path, monkeypatch):
        """Test _send_sevalla_alert() is skipped when URL/key not configured."""
        from infrastructure.ap2_protocol import _send_sevalla_alert

        posted_requests = []

        def fake_post(url, json, headers, timeout):
            posted_requests.append(True)
            raise AssertionError("Should not be called")

        # Ensure no Sevalla config
        monkeypatch.delenv("AP2_SEVALLA_ALERT_URL", raising=False)
        monkeypatch.delenv("SEVALLA_ALERT_URL", raising=False)
        monkeypatch.setattr("infrastructure.ap2_protocol.requests.post", fake_post)

        alert = {"agent": "A", "action": "a", "spent": 1, "budget": 10}

        # Should not raise or post
        _send_sevalla_alert(alert)
        assert len(posted_requests) == 0


# ============================================================================
# Section 2: Agent Integration Tests
# ============================================================================

class TestAgentAP2Integration:
    """Test suite for AP2 integration across all spending agents."""

    def test_support_agent_has_ap2_integration(self):
        """Test Support Agent imports and uses AP2 helpers."""
        from agents.support_agent import SupportAgent

        # Verify agent has AP2 cost tracking
        agent = SupportAgent()
        assert hasattr(agent, 'ap2_cost')
        assert hasattr(agent, '_emit_ap2_event')

    def test_business_generation_agent_has_ap2_integration(self):
        """Test Business Generation Agent imports and uses AP2 helpers."""
        from agents.business_generation_agent import BusinessGenerationAgent

        agent = BusinessGenerationAgent()
        assert hasattr(agent, 'ap2_cost')
        assert hasattr(agent, '_record_ap2_event')

    def test_documentation_agent_has_ap2_integration(self):
        """Test Documentation Agent imports and uses AP2 helpers."""
        from agents.documentation_agent import DocumentationAgent

        agent = DocumentationAgent()
        assert hasattr(agent, '_emit_ap2_event')

    def test_qa_agent_has_ap2_integration(self):
        """Test QA Agent imports and uses AP2 helpers."""
        from agents.qa_agent import QAAgent

        agent = QAAgent()
        assert hasattr(agent, 'ap2_cost')
        assert hasattr(agent, '_record_ap2_event')

    def test_code_review_agent_has_ap2_integration(self):
        """Test Code Review Agent imports and uses AP2 helpers."""
        from agents.code_review_agent import CodeReviewAgent

        agent = CodeReviewAgent()
        assert hasattr(agent, 'ap2_cost')
        assert hasattr(agent, '_record_ap2_event')

    def test_se_darwin_agent_has_ap2_integration(self):
        """Test SE-Darwin Agent imports and uses AP2 helpers."""
        from agents.se_darwin_agent import SEDarwinAgent

        agent = SEDarwinAgent(agent_name="test_agent")
        assert hasattr(agent, 'ap2_cost')
        assert hasattr(agent, '_record_ap2_event')

    def test_all_agents_import_ap2_helpers(self):
        """Test all spending agents successfully import ap2_helpers."""
        agents_to_check = [
            "agents.support_agent",
            "agents.business_generation_agent",
            "agents.documentation_agent",
            "agents.qa_agent",
            "agents.code_review_agent",
            "agents.se_darwin_agent"
        ]

        for agent_module in agents_to_check:
            # Import should succeed
            module = __import__(agent_module, fromlist=[""])

            # Should have imported record_ap2_event
            import inspect
            source = inspect.getsource(module)
            assert "record_ap2_event" in source or "ap2_helpers" in source


# ============================================================================
# Section 3: Business Monitor Integration Tests
# ============================================================================

class TestBusinessMonitorAP2Integration:
    """Test suite for BusinessMonitor.record_ap2_event() integration."""

    def test_business_monitor_has_record_ap2_event(self):
        """Test BusinessMonitor has record_ap2_event method."""
        monitor = get_monitor()
        assert hasattr(monitor, 'record_ap2_event')
        assert callable(monitor.record_ap2_event)

    def test_business_monitor_records_ap2_event(self, tmp_path):
        """Test BusinessMonitor.record_ap2_event() logs events."""
        monitor = BusinessMonitor(log_dir=tmp_path)

        event = {
            "agent": "MonitorAgent",
            "action": "monitor_action",
            "cost_usd": 1.5,
            "budget_usd": 10.0,
            "context": {"env": "test"},
            "timestamp": "2025-01-01T00:00:00Z"
        }

        monitor.record_ap2_event(event)

        # Verify event logged
        events_file = tmp_path / "events.jsonl"
        assert events_file.exists()

    def test_business_monitor_creates_ap2_metrics(self, tmp_path):
        """Test BusinessMonitor.record_ap2_event() creates ap2_metrics.json."""
        monitor = BusinessMonitor(log_dir=tmp_path)

        event = {
            "agent": "MetricsAgent",
            "action": "metrics_action",
            "cost_usd": 2.0,
            "budget_usd": 15.0,
            "context": {"phase": "metrics"},
            "timestamp": "2025-01-01T00:00:00Z"
        }

        monitor.record_ap2_event(event)

        # Verify ap2_metrics.json created
        ap2_metrics = Path("logs/ap2/ap2_metrics.json")
        assert ap2_metrics.exists()

        # Verify content
        with ap2_metrics.open() as f:
            lines = f.readlines()
            last_line = json.loads(lines[-1])
            assert last_line["agent"] == "MetricsAgent"
            assert last_line["cost_usd"] == 2.0

    def test_business_monitor_creates_compliance_report(self, tmp_path):
        """Test BusinessMonitor.record_ap2_event() creates compliance report."""
        monitor = BusinessMonitor(log_dir=tmp_path)

        event = {
            "agent": "ComplianceAgent",
            "action": "compliance_action",
            "cost_usd": 8.0,
            "budget_usd": 10.0,
            "context": {"compliance": "test"},
            "timestamp": "2025-01-01T00:00:00Z"
        }

        monitor.record_ap2_event(event)

        # Verify compliance report created
        compliance_path = Path("reports/ap2_compliance.jsonl")
        assert compliance_path.exists()

        # Verify content
        with compliance_path.open() as f:
            lines = f.readlines()
            last_line = json.loads(lines[-1])
            assert last_line["agent"] == "ComplianceAgent"
            assert last_line["cost_usd"] == 8.0
            assert last_line["usage_ratio"] == 0.8  # 8.0 / 10.0

    def test_business_monitor_handles_missing_budget(self, tmp_path):
        """Test BusinessMonitor.record_ap2_event() handles missing budget gracefully."""
        monitor = BusinessMonitor(log_dir=tmp_path)

        event = {
            "agent": "NoBudgetAgent",
            "action": "no_budget",
            "cost_usd": 5.0,
            "context": {}
        }

        # Should not raise
        monitor.record_ap2_event(event)

        # Verify compliance report has None for ratio
        compliance_path = Path("reports/ap2_compliance.jsonl")
        with compliance_path.open() as f:
            lines = f.readlines()
            last_line = json.loads(lines[-1])
            assert last_line["usage_ratio"] is None

    def test_business_monitor_handles_zero_budget(self, tmp_path):
        """Test BusinessMonitor.record_ap2_event() handles zero budget."""
        monitor = BusinessMonitor(log_dir=tmp_path)

        event = {
            "agent": "ZeroBudgetAgent",
            "action": "zero_budget",
            "cost_usd": 5.0,
            "budget_usd": 0.0,
            "context": {}
        }

        monitor.record_ap2_event(event)

        # Verify ratio is None (can't divide by zero)
        compliance_path = Path("reports/ap2_compliance.jsonl")
        with compliance_path.open() as f:
            lines = f.readlines()
            last_line = json.loads(lines[-1])
            assert last_line["usage_ratio"] is None


# ============================================================================
# Integration & End-to-End Tests
# ============================================================================

class TestAP2EndToEndIntegration:
    """End-to-end integration tests for AP2 protocol."""

    def test_full_ap2_flow_with_alert(self, tmp_path):
        """Test complete AP2 flow: event → logging → alert → monitor."""
        from infrastructure.ap2_protocol import AP2Client
        import infrastructure.ap2_protocol

        # Setup with budget of 10.0
        client = AP2Client(log_dir=tmp_path)
        client.budget = 10.0
        infrastructure.ap2_protocol._GLOBAL_AP2_CLIENT = client
        monitor = BusinessMonitor(log_dir=tmp_path)

        # Simulate high-cost event that triggers alert (9.0 is 90% of 10.0 budget)
        event = record_ap2_event(
            agent="E2EAgent",
            action="high_cost_operation",
            cost=9.0,
            context={"budget": "10.0", "env": "production"}
        )

        # Verify event properties
        assert event.agent == "E2EAgent"
        assert event.cost_usd == 9.0

        # Verify events.jsonl
        events_file = tmp_path / "events.jsonl"
        assert events_file.exists()

        # Verify alert was triggered (>= 80% threshold)
        alerts_file = tmp_path / "alerts.jsonl"
        assert alerts_file.exists()

        # Verify ap2_metrics.json
        metrics_file = Path("logs/ap2/ap2_metrics.json")
        assert metrics_file.exists()

        # Verify compliance report
        compliance_file = Path("reports/ap2_compliance.jsonl")
        assert compliance_file.exists()

    def test_multiple_agents_ap2_events(self, tmp_path):
        """Test multiple agents can emit AP2 events independently."""
        from infrastructure.ap2_protocol import AP2Client
        import infrastructure.ap2_protocol

        infrastructure.ap2_protocol._GLOBAL_AP2_CLIENT = AP2Client(log_dir=tmp_path)

        agents = [
            "SupportAgent",
            "BusinessGenerationAgent",
            "DocumentationAgent",
            "QAAgent",
            "CodeReviewAgent",
            "SEDarwinAgent"
        ]

        for agent in agents:
            record_ap2_event(
                agent=agent,
                action="test_operation",
                cost=0.5,
                context={"test": "multi_agent"}
            )

        # Verify all events logged
        events_file = tmp_path / "events.jsonl"
        with events_file.open() as f:
            events = [json.loads(line) for line in f]

        assert len(events) == 6
        logged_agents = [e["agent"] for e in events]
        assert set(logged_agents) == set(agents)

    def test_ap2_simulation_script_integration(self, tmp_path):
        """Test ap2_simulation.py script integration."""
        from scripts.ap2_simulation import simulate_budget_warning
        from infrastructure.ap2_protocol import AP2Client
        import infrastructure.ap2_protocol

        infrastructure.ap2_protocol._GLOBAL_AP2_CLIENT = AP2Client(log_dir=tmp_path)

        spent = simulate_budget_warning(
            agent="SimAgent",
            budget=5.0,
            step_costs=[0.5, 1.0, 1.5, 2.0]  # Total 5.0, will trigger at 4.0 (80%)
        )

        # Verify spending accumulated
        assert spent >= 4.0

        # Verify alert was triggered
        alerts_file = tmp_path / "alerts.jsonl"
        assert alerts_file.exists()


# ============================================================================
# Edge Cases & Error Handling Tests
# ============================================================================

class TestAP2EdgeCases:
    """Test edge cases and error handling in AP2 protocol."""

    def test_ap2_event_with_empty_context(self, tmp_path):
        """Test AP2Event handles empty context dictionary."""
        client = AP2Client(log_dir=tmp_path)
        event = AP2Event(
            agent="EmptyContextAgent",
            action="test",
            cost_usd=1.0,
            budget_usd=10.0,
            context={}
        )

        client.record_event(event)
        assert client.spent == 1.0

    def test_ap2_client_with_zero_cost(self, tmp_path):
        """Test AP2Client handles zero-cost events."""
        client = AP2Client(log_dir=tmp_path)
        event = AP2Event(
            agent="ZeroCostAgent",
            action="free_operation",
            cost_usd=0.0,
            budget_usd=10.0,
            context={}
        )

        client.record_event(event)
        assert client.spent == 0.0

        # Should not trigger alert
        alerts_file = tmp_path / "alerts.jsonl"
        assert not alerts_file.exists()

    def test_ap2_client_with_negative_cost_raises_no_error(self, tmp_path):
        """Test AP2Client handles negative costs (refunds/credits)."""
        client = AP2Client(log_dir=tmp_path)
        event = AP2Event(
            agent="RefundAgent",
            action="refund",
            cost_usd=-1.0,
            budget_usd=10.0,
            context={"type": "credit"}
        )

        # Should not raise
        client.record_event(event)
        assert client.spent == -1.0

    def test_ap2_client_log_dir_creation(self):
        """Test AP2Client creates log directory if it doesn't exist."""
        with tempfile.TemporaryDirectory() as tmpdir:
            new_dir = Path(tmpdir) / "new_ap2_logs"
            assert not new_dir.exists()

            client = AP2Client(log_dir=new_dir)
            assert new_dir.exists()

    def test_business_monitor_handles_malformed_ap2_event(self, tmp_path):
        """Test BusinessMonitor.record_ap2_event() handles malformed events."""
        monitor = BusinessMonitor(log_dir=tmp_path)

        # Missing required fields
        malformed_event = {
            "agent": "MalformedAgent"
            # Missing action, cost_usd, etc.
        }

        # Should not raise
        monitor.record_ap2_event(malformed_event)


# ============================================================================
# Performance & Concurrency Tests
# ============================================================================

class TestAP2Performance:
    """Test performance and concurrency aspects of AP2 protocol."""

    def test_ap2_event_serialization_performance(self):
        """Test AP2Event serialization is fast."""
        import time

        event = AP2Event(
            agent="PerfAgent",
            action="perf_test",
            cost_usd=1.0,
            budget_usd=10.0,
            context={"key": "value"}
        )

        start = time.time()
        for _ in range(1000):
            event.to_json()
        duration = time.time() - start

        # Should serialize 1000 events in < 0.1 seconds
        assert duration < 0.1

    def test_ap2_client_concurrent_events(self, tmp_path):
        """Test AP2Client handles concurrent event recording."""
        import concurrent.futures

        client = AP2Client(log_dir=tmp_path)

        def record_event(i):
            event = AP2Event(
                agent="ConcurrentAgent",
                action=f"action_{i}",
                cost_usd=0.1,
                budget_usd=100.0,
                context={"index": str(i)}
            )
            client.record_event(event)

        # Record 100 events concurrently
        with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
            executor.map(record_event, range(100))

        # Verify all events logged
        events_file = tmp_path / "events.jsonl"
        with events_file.open() as f:
            events = [json.loads(line) for line in f]

        assert len(events) == 100


# ============================================================================
# Test Configuration & Fixtures
# ============================================================================

@pytest.fixture(autouse=True)
def reset_global_state():
    """Reset global AP2 client and monitor between tests."""
    import infrastructure.ap2_protocol
    import infrastructure.business_monitor

    # Store original state
    original_client = infrastructure.ap2_protocol._GLOBAL_AP2_CLIENT
    original_monitor = infrastructure.business_monitor._monitor

    # Reset
    infrastructure.ap2_protocol._GLOBAL_AP2_CLIENT = None
    infrastructure.business_monitor._monitor = None

    yield

    # Restore
    infrastructure.ap2_protocol._GLOBAL_AP2_CLIENT = original_client
    infrastructure.business_monitor._monitor = original_monitor


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
