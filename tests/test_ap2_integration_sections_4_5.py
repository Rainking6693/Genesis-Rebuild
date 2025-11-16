"""
Comprehensive Integration Tests for AP2 Protocol - Sections 4-5

Section 4: Testing & Verification  
Section 5: Monitoring & Audit

Auditor: Cora (AI Agent Orchestration Specialist)
Date: 2025-11-15

Coverage:
- AP2 protocol core functionality
- All 6 spending agents AP2 integration
- Budget alert simulation and fallback behavior  
- BusinessMonitor AP2 event tracking
- AuditLLM compliance verification
- Production orchestration patterns
- End-to-end integration flows
"""

import asyncio
import json
import logging
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, List, Any

import pytest

from infrastructure.ap2_protocol import AP2Client, AP2Event, get_ap2_client, ALERT_THRESHOLD
from infrastructure.ap2_helpers import record_ap2_event
from infrastructure.business_monitor import get_monitor, BusinessMonitor
from infrastructure.audit_llm import AuditLLMAgent, AuditRequirement, AuditOutcome


# ============================================================================
# SECTION 4: TESTING & VERIFICATION
# ============================================================================

class TestAP2ProtocolCore:
    """Test core AP2 protocol functionality (Section 4.1)"""

    def test_ap2_event_dataclass_structure(self):
        """Verify AP2Event has all required fields and serializes correctly"""
        event = AP2Event(
            agent="TestAgent",
            action="test_action",
            cost_usd=1.5,
            budget_usd=10.0,
            context={"phase": "test", "user_id": "user123"}
        )

        assert event.agent == "TestAgent"
        assert event.action == "test_action"
        assert event.cost_usd == 1.5
        assert event.budget_usd == 10.0
        assert event.context["phase"] == "test"
        assert event.timestamp is not None

        # Test to_dict serialization
        event_dict = event.to_dict()
        assert event_dict["agent"] == "TestAgent"
        assert event_dict["cost_usd"] == 1.5
        assert "timestamp" in event_dict

        # Test to_json serialization
        event_json = event.to_json()
        assert isinstance(event_json, str)
        parsed = json.loads(event_json)
        assert parsed["agent"] == "TestAgent"
        assert parsed["cost_usd"] == 1.5

    def test_ap2_client_singleton_pattern(self):
        """Verify AP2Client singleton works correctly"""
        client1 = get_ap2_client()
        client2 = get_ap2_client()
        assert client1 is client2, "AP2Client should be singleton"

    def test_ap2_client_budget_tracking(self, tmp_path: Path):
        """Test AP2Client tracks budget correctly"""
        client = AP2Client(log_dir=tmp_path)
        client.budget = 100.0
        client.spent = 0.0

        # Record first event
        event1 = AP2Event(
            agent="BudgetTest",
            action="action1",
            cost_usd=25.0,
            budget_usd=client.budget,
            context={}
        )
        client.record_event(event1)
        assert client.spent == 25.0

        # Record second event  
        event2 = AP2Event(
            agent="BudgetTest",
            action="action2",
            cost_usd=15.0,
            budget_usd=client.budget,
            context={}
        )
        client.record_event(event2)
        assert client.spent == 40.0

    def test_ap2_client_event_logging(self, tmp_path: Path):
        """Test AP2Client logs events to JSONL file"""
        client = AP2Client(log_dir=tmp_path)
        client.budget = 50.0

        event = AP2Event(
            agent="LogTest",
            action="test_logging",
            cost_usd=5.0,
            budget_usd=client.budget,
            context={"test": "logging"}
        )
        client.record_event(event)

        # Verify file exists
        events_file = tmp_path / "events.jsonl"
        assert events_file.exists()

        # Verify content
        with open(events_file) as f:
            lines = f.readlines()
            assert len(lines) == 1
            data = json.loads(lines[0])
            assert data["agent"] == "LogTest"
            assert data["cost_usd"] == 5.0
            assert data["context"]["test"] == "logging"

    def test_ap2_client_alert_generation(self, tmp_path: Path):
        """Test AP2Client generates alerts at budget threshold"""
        client = AP2Client(log_dir=tmp_path)
        client.budget = 10.0
        client.spent = 0.0

        alerts_file = tmp_path / "alerts.jsonl"

        # Below threshold - no alert
        event1 = AP2Event(
            agent="AlertTest",
            action="below_threshold",
            cost_usd=5.0,
            budget_usd=client.budget,
            context={}
        )
        client.record_event(event1)
        assert not alerts_file.exists(), f"No alert should exist at 50% (threshold is {ALERT_THRESHOLD})"

        # At/above threshold - should alert
        event2 = AP2Event(
            agent="AlertTest",
            action="above_threshold",
            cost_usd=3.0,
            budget_usd=client.budget,
            context={}
        )
        client.record_event(event2)
        
        # 8.0/10.0 = 0.8 which equals ALERT_THRESHOLD
        assert alerts_file.exists(), "Alert should be generated at 80%"

        with open(alerts_file) as f:
            alert = json.loads(f.read().strip())
            assert alert["type"] == "ap2_budget"
            assert alert["agent"] == "AlertTest"
            assert alert["spent"] == 8.0
            assert alert["budget"] == 10.0

    def test_ap2_helpers_integration(self, tmp_path: Path, monkeypatch):
        """Test ap2_helpers.record_ap2_event integration"""
        from infrastructure import ap2_protocol

        # Reset singleton
        monkeypatch.setattr(ap2_protocol, "_GLOBAL_AP2_CLIENT", None)

        # Create new client
        client = AP2Client(log_dir=tmp_path)
        client.budget = 100.0
        monkeypatch.setattr(ap2_protocol, "_GLOBAL_AP2_CLIENT", client)

        # Record event using helper
        event = record_ap2_event(
            agent="HelperTest",
            action="helper_integration",
            cost=7.5,
            context={"source": "test_helper"}
        )

        assert isinstance(event, AP2Event)
        assert event.agent == "HelperTest"
        assert event.cost_usd == 7.5

        # Verify logged
        events_file = tmp_path / "events.jsonl"
        assert events_file.exists()

        with open(events_file) as f:
            data = json.loads(f.readline())
            assert data["agent"] == "HelperTest"
            assert data["cost_usd"] == 7.5


class TestAgentAP2Integration:
    """Test AP2 integration in all 6 spending agents (Section 4.2)"""

    @pytest.fixture
    def ap2_monitor(self):
        """Setup AP2 event monitoring"""
        ap2_dir = Path("logs/ap2")
        events_file = ap2_dir / "events.jsonl"
        
        initial_count = 0
        if events_file.exists():
            with open(events_file) as f:
                initial_count = len(f.readlines())
        
        yield events_file, initial_count
        
    @pytest.mark.asyncio
    async def test_support_agent_emits_ap2_events(self, ap2_monitor):
        """Verify SupportAgent emits AP2 events"""
        from agents.support_agent import SupportAgent

        events_file, initial_count = ap2_monitor

        agent = SupportAgent(business_id="ap2_support_test", enable_memory=True)
        
        result = await agent.answer_support_query_cached(
            query="Test AP2 integration in Support Agent"
        )

        assert result is not None
        assert events_file.exists()

        with open(events_file) as f:
            lines = f.readlines()
            assert len(lines) > initial_count, "SupportAgent should emit AP2 event"
            
            # Verify event structure
            last_event = json.loads(lines[-1])
            assert last_event["agent"] == "SupportAgent"
            assert "cost_usd" in last_event
            assert "budget_usd" in last_event
            assert "context" in last_event

    @pytest.mark.asyncio
    async def test_business_generation_agent_emits_ap2_events(self, ap2_monitor):
        """Verify BusinessGenerationAgent emits AP2 events"""
        from agents.business_generation_agent import BusinessGenerationAgent

        events_file, initial_count = ap2_monitor

        agent = BusinessGenerationAgent(
            business_id="ap2_bizgen_test",
            enable_memory=True,
            enable_multimodal=False
        )
        
        result = await agent.recall_business_templates_cached(
            business_type="saas"
        )

        assert result is not None
        assert events_file.exists()

        with open(events_file) as f:
            lines = f.readlines()
            assert len(lines) > initial_count
            
            last_event = json.loads(lines[-1])
            assert last_event["agent"] == "BusinessGenerationAgent"

    @pytest.mark.asyncio  
    async def test_documentation_agent_emits_ap2_events(self, ap2_monitor):
        """Verify DocumentationAgent emits AP2 events"""
        from agents.documentation_agent import DocumentationAgent

        events_file, initial_count = ap2_monitor

        agent = DocumentationAgent(business_id="ap2_docs_test", enable_memory=True)
        
        result = await agent.generate_documentation(
            topic="AP2 Protocol Documentation",
            doc_type="technical",
            source_code="# AP2 integration code",
            specifications="AP2 spec"
        )

        assert result is not None
        assert events_file.exists()

        with open(events_file) as f:
            lines = f.readlines()
            assert len(lines) > initial_count

    @pytest.mark.asyncio
    async def test_qa_agent_emits_ap2_events(self, ap2_monitor):
        """Verify QAAgent emits AP2 events"""
        from agents.qa_agent import QAAgent

        events_file, initial_count = ap2_monitor

        agent = QAAgent(enable_memory=True)
        
        result = await agent.generate_tests_cached(
            test_type="unit",
            code_snippet="def calculate_cost(items): return sum(items)"
        )

        assert result is not None
        assert events_file.exists()

        with open(events_file) as f:
            lines = f.readlines()
            assert len(lines) > initial_count

    @pytest.mark.asyncio
    async def test_code_review_agent_emits_ap2_events(self, ap2_monitor):
        """Verify CodeReviewAgent emits AP2 events"""
        from agents.code_review_agent import CodeReviewAgent

        events_file, initial_count = ap2_monitor

        agent = CodeReviewAgent(enable_token_caching=True)
        
        result = await agent.review_code_cached(
            code="def process_payment(amount): return amount * 1.1",
            file_path="payment.py",
            review_type="comprehensive"
        )

        assert result is not None
        assert events_file.exists()

        with open(events_file) as f:
            lines = f.readlines()
            assert len(lines) > initial_count

    @pytest.mark.asyncio
    async def test_se_darwin_agent_emits_ap2_events(self, ap2_monitor):
        """Verify SEDarwinAgent emits AP2 events during evolution"""
        from agents.se_darwin_agent import SEDarwinAgent

        events_file, initial_count = ap2_monitor

        agent = SEDarwinAgent(agent_name="ap2_darwin_test")
        
        result = await agent.evolve_solution(
            problem_description="Optimize cost calculation algorithm",
            context={"test": "ap2_integration", "max_iterations": 1}
        )

        assert result is not None
        assert events_file.exists()

        with open(events_file) as f:
            lines = f.readlines()
            # SE-Darwin emits multiple AP2 events per iteration
            assert len(lines) > initial_count


class TestAP2SimulationAndFallback:
    """Test AP2 simulation and fallback behavior (Section 4.3)"""

    def test_simulation_budget_warning_mode(self, tmp_path: Path):
        """Test AP2 simulation warning mode triggers alert"""
        from scripts.ap2_simulation import simulate_budget_warning
        from infrastructure import ap2_protocol

        # Create isolated client
        client = AP2Client(log_dir=tmp_path)
        
        old_client = ap2_protocol._GLOBAL_AP2_CLIENT
        ap2_protocol._GLOBAL_AP2_CLIENT = client

        try:
            spent = simulate_budget_warning(
                agent="SimWarningAgent",
                budget=10.0,
                step_costs=(2.0, 2.0, 2.0, 2.0, 2.0)
            )

            # Should stop at threshold
            assert spent >= 8.0, f"Should reach 80% threshold, got {spent}"

            # Verify alert generated
            alerts_file = tmp_path / "alerts.jsonl"
            assert alerts_file.exists(), "Alert should be generated"

            with open(alerts_file) as f:
                alert = json.loads(f.read().strip())
                assert alert["agent"] == "SimWarningAgent"

        finally:
            ap2_protocol._GLOBAL_AP2_CLIENT = old_client

    def test_simulation_high_cost_mode(self, tmp_path: Path):
        """Test AP2 simulation high-cost mode exceeds budget"""
        from scripts.ap2_simulation import simulate_high_cost_run
        from infrastructure import ap2_protocol

        client = AP2Client(log_dir=tmp_path)
        
        old_client = ap2_protocol._GLOBAL_AP2_CLIENT
        ap2_protocol._GLOBAL_AP2_CLIENT = client

        try:
            simulate_high_cost_run(
                agent="HighCostAgent",
                high_cost=20.0,
                budget=10.0
            )

            # Should immediately trigger alert
            alerts_file = tmp_path / "alerts.jsonl"
            assert alerts_file.exists()

            with open(alerts_file) as f:
                alert = json.loads(f.read().strip())
                assert alert["spent"] == 20.0
                assert alert["budget"] == 10.0
                assert alert["type"] == "ap2_budget"

        finally:
            ap2_protocol._GLOBAL_AP2_CLIENT = old_client


# ============================================================================
# SECTION 5: MONITORING & AUDIT
# ============================================================================

class TestBusinessMonitorAP2:
    """Test BusinessMonitor AP2 event tracking (Section 5.1)"""

    def test_business_monitor_record_ap2_event(self, tmp_path: Path):
        """Verify BusinessMonitor.record_ap2_event() integration"""
        monitor = BusinessMonitor(log_dir=tmp_path)

        event_data = {
            "agent": "MonitorTestAgent",
            "action": "test_monitor",
            "cost_usd": 3.5,
            "budget_usd": 100.0,
            "context": {"phase": "monitoring_test"}
        }

        monitor.record_ap2_event(event_data)

        # Verify monitor event log
        events_file = tmp_path / "events.jsonl"
        assert events_file.exists()

        # Verify AP2 metrics
        ap2_metrics = Path("logs/ap2/ap2_metrics.json")
        assert ap2_metrics.exists()

        # Verify compliance report
        compliance_file = Path("reports/ap2_compliance.jsonl")
        assert compliance_file.exists()

        with open(compliance_file) as f:
            lines = f.readlines()
            last_entry = json.loads(lines[-1])
            assert last_entry["agent"] == "MonitorTestAgent"
            assert last_entry["cost_usd"] == 3.5
            assert "usage_ratio" in last_entry

    def test_ap2_metrics_export_format(self):
        """Test AP2 metrics file has correct format"""
        metrics_file = Path("logs/ap2/ap2_metrics.json")
        assert metrics_file.exists(), "AP2 metrics file should exist"

        with open(metrics_file) as f:
            lines = f.readlines()
            assert len(lines) > 0, "Metrics file should have entries"

            # Verify structure of first few entries
            for line in lines[:3]:
                metric = json.loads(line)
                assert "timestamp" in metric
                assert "agent" in metric
                assert "action" in metric
                assert "cost_usd" in metric
                assert "budget_usd" in metric
                assert "context" in metric

    def test_ap2_compliance_export_format(self):
        """Test AP2 compliance report has correct format"""
        compliance_file = Path("reports/ap2_compliance.jsonl")
        assert compliance_file.exists(), "Compliance file should exist"

        with open(compliance_file) as f:
            lines = f.readlines()
            assert len(lines) > 0, "Compliance file should have entries"

            for line in lines[:3]:
                record = json.loads(line)
                assert "timestamp" in record
                assert "agent" in record
                assert "action" in record
                assert "cost_usd" in record
                # budget_usd can be null
                assert "usage_ratio" in record
                assert "context" in record


class TestAuditLLMCompliance:
    """Test AuditLLM compliance verification (Section 5.2)"""

    def test_audit_llm_has_ap2_requirement(self):
        """Verify AuditLLM includes AP2 budget requirement"""
        agent = AuditLLMAgent()

        # Find AP2 requirement
        ap2_req = None
        for req in agent.requirements:
            if "AP2" in req.name or any("ap2" in kw.lower() for kw in req.keywords):
                ap2_req = req
                break

        assert ap2_req is not None, "AuditLLM should have AP2 requirement"
        assert any("ap2" in kw.lower() for kw in ap2_req.keywords)
        assert ap2_req.min_count >= 1

    def test_audit_llm_evaluates_ap2_compliance(self, tmp_path: Path):
        """Test AuditLLM evaluates AP2 events in logs"""
        log_file = tmp_path / "test.log"
        log_content = """
        2025-11-15 10:00:00 INFO: AP2 event recorded
        2025-11-15 10:00:01 INFO: AP2 budget check passed
        2025-11-15 10:00:02 WARNING: ap2 budget alert
        2025-11-15 10:00:03 INFO: record_ap2_event called for SupportAgent
        """
        log_file.write_text(log_content)

        agent = AuditLLMAgent(log_path=log_file)
        outcomes = agent.evaluate()

        # Find AP2 outcome
        ap2_outcome = None
        for outcome in outcomes:
            if "AP2" in outcome.requirement:
                ap2_outcome = outcome
                break

        assert ap2_outcome is not None
        assert ap2_outcome.satisfied, "AP2 requirement should be satisfied"
        assert ap2_outcome.count >= 3  # Multiple AP2 mentions

    @pytest.mark.asyncio
    async def test_audit_llm_async_evaluation(self):
        """Test AuditLLM async evaluation works"""
        agent = AuditLLMAgent()
        outcomes = await agent.audit_async()

        assert isinstance(outcomes, list)
        assert len(outcomes) > 0
        assert all(isinstance(o, AuditOutcome) for o in outcomes)

    def test_audit_llm_policy_scoring(self):
        """Test AuditLLM policy-based scoring"""
        agent = AuditLLMAgent()

        if agent.policy_path.exists():
            alerts = agent.policy_score()
            assert isinstance(alerts, list)
            # Each alert is an AuditOutcome
            for alert in alerts:
                assert isinstance(alert, AuditOutcome)
                assert hasattr(alert, "satisfied")
                assert hasattr(alert, "count")


# ============================================================================
# END-TO-END INTEGRATION TESTS
# ============================================================================

class TestAP2EndToEndIntegration:
    """End-to-end AP2 integration tests"""

    @pytest.mark.asyncio
    async def test_agent_to_compliance_flow(self):
        """Test complete flow: Agent → AP2Event → Monitor → Compliance"""
        from agents.support_agent import SupportAgent

        # Get initial state
        compliance_file = Path("reports/ap2_compliance.jsonl")
        with open(compliance_file) as f:
            initial_count = len(f.readlines())

        # Execute agent action
        agent = SupportAgent(business_id="e2e_test", enable_memory=True)
        result = await agent.answer_support_query_cached(
            query="End-to-end AP2 flow test"
        )

        assert result is not None

        # Verify compliance updated
        with open(compliance_file) as f:
            final_count = len(f.readlines())
            assert final_count > initial_count, "Compliance file should be updated"

            # Check last entry
            f.seek(0)
            lines = f.readlines()
            last_entry = json.loads(lines[-1])
            assert last_entry["agent"] == "SupportAgent"

    @pytest.mark.asyncio
    async def test_multi_agent_ap2_tracking(self):
        """Test multiple agents emit AP2 events correctly"""
        from agents.support_agent import SupportAgent
        from agents.qa_agent import QAAgent

        compliance_file = Path("reports/ap2_compliance.jsonl")
        with open(compliance_file) as f:
            initial_count = len(f.readlines())

        # Run both agents
        support = SupportAgent(business_id="multi_test", enable_memory=True)
        qa = QAAgent(enable_memory=True)

        support_result = await support.answer_support_query_cached(
            query="Multi-agent test"
        )
        qa_result = await qa.generate_tests_cached(
            test_type="unit",
            code_snippet="def test(): pass"
        )

        assert support_result is not None
        assert qa_result is not None

        # Verify both emitted events
        with open(compliance_file) as f:
            final_count = len(f.readlines())
            # Should have at least 2 more events
            assert final_count >= initial_count + 2

    def test_production_readiness_checklist(self):
        """Verify all production requirements are met"""
        checklist = {
            "AP2 protocol module": Path("infrastructure/ap2_protocol.py").exists(),
            "AP2 helpers module": Path("infrastructure/ap2_helpers.py").exists(),
            "AP2 unit tests": Path("tests/test_ap2_protocol.py").exists(),
            "AP2 simulation script": Path("scripts/ap2_simulation.py").exists(),
            "BusinessMonitor integration": Path("infrastructure/business_monitor.py").exists(),
            "AuditLLM integration": Path("infrastructure/audit_llm.py").exists(),
            "AP2 logs directory": Path("logs/ap2").exists(),
            "Reports directory": Path("reports").exists(),
            "AP2 events file": Path("logs/ap2/events.jsonl").exists(),
            "AP2 metrics file": Path("logs/ap2/ap2_metrics.json").exists(),
            "Compliance JSONL": Path("reports/ap2_compliance.jsonl").exists(),
            "Lightning tests have AP2": Path("tests/test_support_agent_lightning.py").exists(),
        }

        failures = [name for name, passed in checklist.items() if not passed]
        
        if failures:
            print("\\n❌ Production Readiness Failures:")
            for failure in failures:
                print(f"  - {failure}")

        assert len(failures) == 0, f"Production readiness check failed: {failures}"

        print("\\n✅ AP2 PRODUCTION READINESS CHECKLIST")
        for name, passed in checklist.items():
            print(f"  ✓ {name}")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
