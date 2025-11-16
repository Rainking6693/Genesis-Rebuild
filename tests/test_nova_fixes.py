#!/usr/bin/env python3
"""
Cora's Comprehensive Test Suite - Nova's API Fixes (Agents 10-14)

Tests all of Nova's claimed fixes for agents 10-14 according to AUDIT_PROTOCOL_V2.

Test Coverage:
- Agent 10: SupportAgent - Verify already correct claim
- Agent 11: AnalyticsAgent - Test async + parameter fixes
- Agent 12: QAAgent - Test parameter name fixes
- Agent 13: CodeReviewAgent - Test constructor + method name + async
- Agent 14: DocumentationAgent - Test business_id + async + parameters
"""

import pytest
import asyncio
from datetime import datetime, timezone


# ============================================================================
# Agent 10: SupportAgent - Verify "Already Correct" Claim
# ============================================================================

class TestAgent10_SupportAgent:
    """Test Nova's claim: Agent 10 is already correct (NO CHANGES NEEDED)"""

    def test_support_agent_create_ticket_sync(self):
        """
        VERIFICATION: SupportAgent.create_ticket() should be synchronous

        Nova's claim: create_ticket() is sync and accepts (user_id, issue_description, priority)
        Expected: Method exists, is sync, accepts correct parameters
        """
        from agents.support_agent import SupportAgent

        # Create agent
        agent = SupportAgent(business_id="test_biz", enable_memory=False)

        # Verify method exists and is callable
        assert hasattr(agent, 'create_ticket')
        assert callable(agent.create_ticket)

        # Call method (should not require await)
        result = agent.create_ticket(
            user_id="test_user",
            issue_description="Test issue",
            priority="low"
        )

        # Verify result
        assert result is not None
        assert "TICKET-" in result or "ticket_id" in result.lower()

        print("✅ Agent 10 (SupportAgent): create_ticket() is synchronous and correct")


# ============================================================================
# Agent 11: AnalyticsAgent - Test Async + Parameter Fixes
# ============================================================================

class TestAgent11_AnalyticsAgent:
    """Test Nova's fixes: Added await, fixed parameters"""

    @pytest.mark.asyncio
    async def test_analytics_agent_generate_report_async(self):
        """
        VERIFICATION: AnalyticsAgent.generate_report() should be async

        Nova's fixes:
        - Added await
        - Fixed parameters: user_id, report_name, metric_data, period_start, period_end
        - Added datetime import
        """
        from agents.analytics_agent import AnalyticsAgent
        from datetime import datetime, timezone

        # Create agent
        agent = AnalyticsAgent(business_id="test_biz", enable_memory=False)

        # Verify method exists
        assert hasattr(agent, 'generate_report')

        # Test async call with correct parameters
        result = await agent.generate_report(
            user_id="test_user",
            report_name="Test Report",
            metric_data={"revenue": [100, 150, 200, 250]},
            period_start=datetime.fromisoformat("2025-11-01T00:00:00+00:00"),
            period_end=datetime.fromisoformat("2025-11-14T00:00:00+00:00")
        )

        # Verify result
        assert result is not None
        assert hasattr(result, 'report_id') or isinstance(result, dict)

        print("✅ Agent 11 (AnalyticsAgent): generate_report() is async with correct parameters")

    @pytest.mark.asyncio
    async def test_analytics_agent_parameter_types(self):
        """
        VERIFICATION: Parameter types should match API signature

        Expected types:
        - user_id: str
        - report_name: str
        - metric_data: Dict[str, Any]
        - period_start: datetime
        - period_end: datetime
        """
        from agents.analytics_agent import AnalyticsAgent
        import inspect

        # Get method signature
        sig = inspect.signature(AnalyticsAgent.generate_report)
        params = sig.parameters

        # Verify parameters exist
        assert 'user_id' in params
        assert 'report_name' in params
        assert 'metric_data' in params
        assert 'period_start' in params
        assert 'period_end' in params

        print("✅ Agent 11 (AnalyticsAgent): All required parameters present in signature")


# ============================================================================
# Agent 12: QAAgent - Test Parameter Name Fixes
# ============================================================================

class TestAgent12_QAAgent:
    """Test Nova's fixes: Fixed parameter names (test_suite_name, environment)"""

    def test_qa_agent_run_test_suite_params(self):
        """
        VERIFICATION: QAAgent.run_test_suite() should accept (test_suite_name, environment)

        Nova's fixes:
        - Changed test_type → test_suite_name
        - Changed target → environment
        """
        from agents.qa_agent import QAAgent
        import inspect

        # Create agent
        agent = QAAgent(business_id="test_biz", enable_memory=False)

        # Verify method exists
        assert hasattr(agent, 'run_test_suite')

        # Get method signature
        sig = inspect.signature(agent.run_test_suite)
        params = sig.parameters

        # Verify correct parameter names
        assert 'test_suite_name' in params, "Parameter 'test_suite_name' must exist"
        assert 'environment' in params, "Parameter 'environment' must exist"

        # Verify old parameter names DO NOT exist
        assert 'test_type' not in params, "Old parameter 'test_type' should not exist"
        assert 'target' not in params, "Old parameter 'target' should not exist"

        print("✅ Agent 12 (QAAgent): run_test_suite() has correct parameter names")

    def test_qa_agent_run_test_suite_execution(self):
        """
        VERIFICATION: Method should execute successfully with correct parameters
        """
        from agents.qa_agent import QAAgent

        # Create agent
        agent = QAAgent(business_id="test_biz", enable_memory=False)

        # Call method with correct parameters
        result = agent.run_test_suite(
            test_suite_name="integration_tests",
            environment="staging"
        )

        # Verify result
        assert result is not None
        assert "test" in result.lower() or "RUN-" in result

        print("✅ Agent 12 (QAAgent): run_test_suite() executes successfully")


# ============================================================================
# Agent 13: CodeReviewAgent - Test Constructor + Method + Async
# ============================================================================

class TestAgent13_CodeReviewAgent:
    """Test Nova's fixes: Constructor param, method name, async, review_type"""

    def test_code_review_agent_constructor(self):
        """
        VERIFICATION: CodeReviewAgent should accept enable_token_caching (not enable_memory)

        Nova's fix:
        - Changed enable_memory=True → enable_token_caching=True
        """
        from agents.code_review_agent import CodeReviewAgent
        import inspect

        # Get constructor signature
        sig = inspect.signature(CodeReviewAgent.__init__)
        params = sig.parameters

        # Verify correct parameter name
        assert 'enable_token_caching' in params, "Constructor must accept 'enable_token_caching'"

        # Verify agent can be created
        agent = CodeReviewAgent(enable_token_caching=True)
        assert agent is not None
        assert agent.enable_token_caching == True

        print("✅ Agent 13 (CodeReviewAgent): Constructor accepts enable_token_caching")

    @pytest.mark.asyncio
    async def test_code_review_agent_method_name(self):
        """
        VERIFICATION: Method should be review_code_cached() (not review_code())

        Nova's fix:
        - Changed review_code() → review_code_cached()
        """
        from agents.code_review_agent import CodeReviewAgent

        # Create agent
        agent = CodeReviewAgent(enable_token_caching=False)  # Disable caching for test

        # Verify correct method exists
        assert hasattr(agent, 'review_code_cached'), "Method 'review_code_cached' must exist"

        # Verify method is async
        import inspect
        assert inspect.iscoroutinefunction(agent.review_code_cached), "Method must be async"

        print("✅ Agent 13 (CodeReviewAgent): Method is review_code_cached() and is async")

    @pytest.mark.asyncio
    async def test_code_review_agent_parameters(self):
        """
        VERIFICATION: review_code_cached() should accept (code, file_path, review_type)

        Nova's fix:
        - Added review_type parameter
        - Verified code and file_path parameters
        """
        from agents.code_review_agent import CodeReviewAgent
        import inspect

        # Get method signature
        sig = inspect.signature(CodeReviewAgent.review_code_cached)
        params = sig.parameters

        # Verify required parameters
        assert 'code' in params, "Parameter 'code' must exist"
        assert 'file_path' in params, "Parameter 'file_path' must exist"
        assert 'review_type' in params, "Parameter 'review_type' must exist"

        # Test execution
        agent = CodeReviewAgent(enable_token_caching=False)
        result = await agent.review_code_cached(
            code="def add(a, b): return a + b",
            file_path="math.py",
            review_type="comprehensive"
        )

        assert result is not None
        assert isinstance(result, dict)

        print("✅ Agent 13 (CodeReviewAgent): review_code_cached() accepts all required parameters")


# ============================================================================
# Agent 14: DocumentationAgent - Test business_id + Async + Parameters
# ============================================================================

class TestAgent14_DocumentationAgent:
    """Test Nova's fixes: Added business_id, async, fixed parameters"""

    def test_documentation_agent_constructor(self):
        """
        VERIFICATION: DocumentationAgent should accept business_id in constructor

        Nova's fix:
        - Added business_id parameter to constructor
        """
        from agents.documentation_agent import DocumentationAgent
        import inspect

        # Get constructor signature
        sig = inspect.signature(DocumentationAgent.__init__)
        params = sig.parameters

        # Verify business_id parameter exists
        assert 'business_id' in params, "Constructor must accept 'business_id'"

        # Test creation with business_id
        agent = DocumentationAgent(business_id="test_biz", enable_memory=False)
        assert agent is not None
        assert agent.business_id == "test_biz"

        print("✅ Agent 14 (DocumentationAgent): Constructor accepts business_id")

    @pytest.mark.asyncio
    async def test_documentation_agent_async(self):
        """
        VERIFICATION: generate_documentation() should be async

        Nova's fix:
        - Added await keyword
        """
        from agents.documentation_agent import DocumentationAgent
        import inspect

        # Create agent
        agent = DocumentationAgent(business_id="test_biz", enable_memory=False)

        # Verify method is async
        assert inspect.iscoroutinefunction(agent.generate_documentation), "Method must be async"

        print("✅ Agent 14 (DocumentationAgent): generate_documentation() is async")

    @pytest.mark.asyncio
    async def test_documentation_agent_parameters(self):
        """
        VERIFICATION: generate_documentation() should accept (topic, doc_type, source_code, specifications)

        Nova's fixes:
        - Changed code → source_code
        - Added topic parameter (required)
        - Added specifications parameter
        """
        from agents.documentation_agent import DocumentationAgent
        import inspect

        # Get method signature
        sig = inspect.signature(DocumentationAgent.generate_documentation)
        params = sig.parameters

        # Verify correct parameters
        assert 'topic' in params, "Parameter 'topic' must exist"
        assert 'doc_type' in params, "Parameter 'doc_type' must exist"
        assert 'source_code' in params, "Parameter 'source_code' must exist"
        assert 'specifications' in params, "Parameter 'specifications' must exist"

        # Verify old parameter name does NOT exist
        assert 'code' not in params, "Old parameter 'code' should not exist"

        print("✅ Agent 14 (DocumentationAgent): generate_documentation() has correct parameters")

    @pytest.mark.asyncio
    async def test_documentation_agent_execution(self):
        """
        VERIFICATION: Method should execute successfully with all parameters
        """
        from agents.documentation_agent import DocumentationAgent

        # Create agent
        agent = DocumentationAgent(business_id="test_biz", enable_memory=False)

        # Test execution with all parameters
        result = await agent.generate_documentation(
            topic="Business API",
            doc_type="api",
            source_code="def get_data(): pass",
            specifications="REST API spec"
        )

        # Verify result
        assert result is not None
        assert isinstance(result, dict)

        print("✅ Agent 14 (DocumentationAgent): generate_documentation() executes successfully")


# ============================================================================
# Integration Test - All Agents Together
# ============================================================================

class TestNovaFixes_Integration:
    """Integration test to verify all agents work together"""

    @pytest.mark.asyncio
    async def test_all_agents_in_sequence(self):
        """
        INTEGRATION TEST: Run all 5 agents in sequence to verify orchestration

        This simulates the ten_business_simple_test.py workflow
        """
        from agents.support_agent import SupportAgent
        from agents.analytics_agent import AnalyticsAgent
        from agents.qa_agent import QAAgent
        from agents.code_review_agent import CodeReviewAgent
        from agents.documentation_agent import DocumentationAgent
        from datetime import datetime, timezone

        print("\n" + "="*80)
        print("INTEGRATION TEST: All 5 agents in sequence")
        print("="*80)

        # Agent 10: SupportAgent (sync)
        print("\n[1/5] Testing SupportAgent...")
        support_agent = SupportAgent(business_id="integration_test", enable_memory=False)
        ticket = support_agent.create_ticket(
            user_id="test_user",
            issue_description="Integration test issue",
            priority="low"
        )
        assert ticket is not None
        print("✅ SupportAgent: create_ticket() passed")

        # Agent 11: AnalyticsAgent (async)
        print("\n[2/5] Testing AnalyticsAgent...")
        analytics_agent = AnalyticsAgent(business_id="integration_test", enable_memory=False)
        analytics_report = await analytics_agent.generate_report(
            user_id="test_user",
            report_name="Integration Test Report",
            metric_data={"revenue": [100, 150, 200]},
            period_start=datetime.fromisoformat("2025-11-01T00:00:00+00:00"),
            period_end=datetime.fromisoformat("2025-11-14T00:00:00+00:00")
        )
        assert analytics_report is not None
        print("✅ AnalyticsAgent: generate_report() passed")

        # Agent 12: QAAgent (sync)
        print("\n[3/5] Testing QAAgent...")
        qa_agent = QAAgent(business_id="integration_test", enable_memory=False)
        qa_result = qa_agent.run_test_suite(
            test_suite_name="integration_tests",
            environment="staging"
        )
        assert qa_result is not None
        print("✅ QAAgent: run_test_suite() passed")

        # Agent 13: CodeReviewAgent (async)
        print("\n[4/5] Testing CodeReviewAgent...")
        review_agent = CodeReviewAgent(enable_token_caching=False)
        review_result = await review_agent.review_code_cached(
            code="def test(): pass",
            file_path="test.py",
            review_type="comprehensive"
        )
        assert review_result is not None
        print("✅ CodeReviewAgent: review_code_cached() passed")

        # Agent 14: DocumentationAgent (async)
        print("\n[5/5] Testing DocumentationAgent...")
        doc_agent = DocumentationAgent(business_id="integration_test", enable_memory=False)
        docs = await doc_agent.generate_documentation(
            topic="Integration Test API",
            doc_type="api",
            source_code="def api(): pass",
            specifications="Test spec"
        )
        assert docs is not None
        print("✅ DocumentationAgent: generate_documentation() passed")

        print("\n" + "="*80)
        print("✅ INTEGRATION TEST PASSED: All 5 agents work correctly")
        print("="*80)


# ============================================================================
# Orchestration Tests - Async Pattern Verification
# ============================================================================

class TestOrchestrationPatterns:
    """Test orchestration-specific patterns"""

    @pytest.mark.asyncio
    async def test_async_agents_consistency(self):
        """
        ORCHESTRATION: Verify async agents follow consistent patterns

        Agents 11, 13, 14 should be async
        Agents 10, 12 should be sync
        """
        from agents.analytics_agent import AnalyticsAgent
        from agents.code_review_agent import CodeReviewAgent
        from agents.documentation_agent import DocumentationAgent
        from agents.support_agent import SupportAgent
        from agents.qa_agent import QAAgent
        import inspect

        # Async agents
        assert inspect.iscoroutinefunction(AnalyticsAgent.generate_report)
        assert inspect.iscoroutinefunction(CodeReviewAgent.review_code_cached)
        assert inspect.iscoroutinefunction(DocumentationAgent.generate_documentation)

        # Sync agents
        assert not inspect.iscoroutinefunction(SupportAgent.create_ticket)
        assert not inspect.iscoroutinefunction(QAAgent.run_test_suite)

        print("✅ ORCHESTRATION: Async patterns are consistent across agents")

    def test_memory_integration_consistency(self):
        """
        ORCHESTRATION: Verify enable_memory is used consistently

        Agents 10, 11, 12, 14 use enable_memory
        Agent 13 uses enable_token_caching (specialized)
        """
        from agents.support_agent import SupportAgent
        from agents.analytics_agent import AnalyticsAgent
        from agents.qa_agent import QAAgent
        from agents.code_review_agent import CodeReviewAgent
        from agents.documentation_agent import DocumentationAgent
        import inspect

        # Check constructor signatures
        support_sig = inspect.signature(SupportAgent.__init__)
        analytics_sig = inspect.signature(AnalyticsAgent.__init__)
        qa_sig = inspect.signature(QAAgent.__init__)
        review_sig = inspect.signature(CodeReviewAgent.__init__)
        doc_sig = inspect.signature(DocumentationAgent.__init__)

        # Verify memory parameters
        assert 'enable_memory' in support_sig.parameters
        assert 'enable_memory' in analytics_sig.parameters
        assert 'enable_memory' in qa_sig.parameters
        assert 'enable_token_caching' in review_sig.parameters  # Specialized
        assert 'enable_memory' in doc_sig.parameters

        print("✅ ORCHESTRATION: Memory integration patterns are consistent")


if __name__ == "__main__":
    # Run tests with pytest
    pytest.main([__file__, "-v", "-s"])
