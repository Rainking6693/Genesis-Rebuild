#!/usr/bin/env python3
"""
Integration Test Suite for All Agent APIs

Tests basic initialization and key methods for all 21 agents.
Ensures API consistency and catches signature mismatches early.
"""

import pytest
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))


class TestAgentInitialization:
    """Test that all agents can be initialized correctly."""

    def test_business_generation_agent_init(self):
        """Test BusinessGenerationAgent initialization."""
        from agents.business_generation_agent import BusinessGenerationAgent
        agent = BusinessGenerationAgent(business_id="test", enable_memory=False)
        assert agent.business_id == "test"
        assert hasattr(agent, 'generate_idea_with_memory')

    def test_deploy_agent_init(self):
        """Test DeployAgent initialization."""
        from agents.deploy_agent import DeployAgent
        agent = DeployAgent(business_id="test", enable_memory=False)
        assert agent.business_id == "test"
        assert hasattr(agent, 'deploy_to_vercel')
        assert hasattr(agent, 'prepare_deployment_files')
        assert hasattr(agent, 'get_statistics')

    def test_database_design_agent_init(self):
        """Test DatabaseDesignAgent initialization."""
        from agents.database_design_agent import DatabaseDesignAgent
        agent = DatabaseDesignAgent(business_id="test", enable_memory=False)
        assert agent.business_id == "test"
        assert hasattr(agent, 'design_schema')
        assert hasattr(agent, 'get_statistics')

    def test_api_design_agent_init(self):
        """Test APIDesignAgent initialization."""
        from agents.api_design_agent import APIDesignAgent
        agent = APIDesignAgent(business_id="test", enable_memory=False)
        assert agent.business_id == "test"
        assert hasattr(agent, 'design_api')
        assert hasattr(agent, 'get_statistics')

    def test_stripe_integration_agent_init(self):
        """Test StripeIntegrationAgent initialization."""
        from agents.stripe_integration_agent import StripeIntegrationAgent
        agent = StripeIntegrationAgent(business_id="test", enable_memory=False)
        assert agent.business_id == "test"
        assert hasattr(agent, 'setup_payment_integration')
        assert hasattr(agent, 'process_payment')
        assert hasattr(agent, 'get_statistics')

    def test_auth0_integration_agent_init(self):
        """Test Auth0IntegrationAgent initialization."""
        from agents.auth0_integration_agent import Auth0IntegrationAgent
        agent = Auth0IntegrationAgent(business_id="test", enable_memory=False)
        assert agent.business_id == "test"
        assert hasattr(agent, 'get_statistics')

    def test_content_creation_agent_init(self):
        """Test ContentCreationAgent initialization."""
        from agents.content_creation_agent import ContentCreationAgent
        agent = ContentCreationAgent(business_id="test", enable_memory=False)
        assert agent.business_id == "test"
        assert hasattr(agent, 'generate_content')

    def test_seo_optimization_agent_init(self):
        """Test SEOOptimizationAgent initialization."""
        from agents.seo_optimization_agent import SEOOptimizationAgent
        agent = SEOOptimizationAgent(business_id="test", enable_memory=False)
        assert agent.business_id == "test"
        assert hasattr(agent, 'optimize_content')

    def test_email_marketing_agent_init(self):
        """Test EmailMarketingAgent initialization."""
        from agents.email_marketing_agent import EmailMarketingAgent
        agent = EmailMarketingAgent(business_id="test", enable_memory=False)
        assert agent.business_id == "test"
        assert hasattr(agent, 'create_campaign')

    def test_marketing_agent_multimodal_init(self):
        """Test MarketingAgentMultimodal initialization."""
        from agents.marketing_agent_multimodal import MarketingAgentMultimodal
        agent = MarketingAgentMultimodal(enable_memory=False)
        assert hasattr(agent, 'create_campaign')

    def test_uiux_design_agent_init(self):
        """Test UIUXDesignAgent initialization."""
        from agents.uiux_design_agent import UIUXDesignAgent
        agent = UIUXDesignAgent(business_id="test", enable_memory=False)
        assert agent.business_id == "test"
        assert hasattr(agent, 'get_statistics')

    def test_support_agent_init(self):
        """Test SupportAgent initialization."""
        from agents.support_agent import SupportAgent
        agent = SupportAgent(business_id="test", enable_memory=False)
        assert agent.business_id == "test"
        assert hasattr(agent, 'create_ticket')
        assert hasattr(agent, 'escalate_ticket')
        assert hasattr(agent, 'search_knowledge_base')

    def test_analytics_agent_init(self):
        """Test AnalyticsAgent initialization."""
        from agents.analytics_agent import AnalyticsAgent
        agent = AnalyticsAgent(business_id="test", enable_memory=False)
        assert agent.business_id == "test"
        assert hasattr(agent, 'generate_report')

    def test_monitoring_agent_init(self):
        """Test MonitoringAgent initialization."""
        from agents.monitoring_agent import MonitoringAgent
        agent = MonitoringAgent(business_id="test", enable_memory=False)
        assert agent.business_id == "test"
        assert hasattr(agent, 'get_statistics')

    def test_qa_agent_init(self):
        """Test QAAgent initialization."""
        from agents.qa_agent import QAAgent
        agent = QAAgent(business_id="test", enable_memory=False)
        assert agent.business_id == "test"
        assert hasattr(agent, 'create_test_plan')
        assert hasattr(agent, 'run_test_suite')
        assert hasattr(agent, 'report_bug')

    def test_code_review_agent_init(self):
        """Test CodeReviewAgent initialization."""
        from agents.code_review_agent import CodeReviewAgent
        agent = CodeReviewAgent(enable_token_caching=False)
        assert hasattr(agent, 'review_code')

    def test_documentation_agent_init(self):
        """Test DocumentationAgent initialization."""
        from agents.documentation_agent import DocumentationAgent
        agent = DocumentationAgent(business_id="test", enable_memory=False)
        assert agent.business_id == "test"
        assert hasattr(agent, 'generate_documentation')

    def test_data_juicer_agent_init(self):
        """Test DataJuicerAgent initialization."""
        from agents.data_juicer_agent import create_data_juicer_agent
        agent = create_data_juicer_agent(business_id="test", enable_memory=False)
        assert agent.business_id == "test"
        assert hasattr(agent, 'curate_dataset')

    def test_react_training_agent_init(self):
        """Test ReActTrainingAgent initialization."""
        from agents.react_training_agent import create_react_training_agent
        agent = create_react_training_agent(business_id="test", enable_memory=False)
        assert agent.business_id == "test"
        assert hasattr(agent, 'train_agent')

    def test_se_darwin_agent_init(self):
        """Test SEDarwinAgent initialization."""
        from agents.se_darwin_agent import SEDarwinAgent
        agent = SEDarwinAgent(agent_name="test_darwin")
        assert agent.agent_name == "test_darwin"

    def test_gemini_computer_use_agent_init(self):
        """Test GeminiComputerUseAgent initialization."""
        from agents.gemini_computer_use_agent import GeminiComputerUseAgent
        agent = GeminiComputerUseAgent(enable_memory=False)
        assert hasattr(agent, 'execute_computer_task')


class TestCriticalAPIs:
    """Test the critical APIs that were causing failures."""

    def test_database_design_agent_simple_api(self):
        """Test DatabaseDesignAgent simple API (the one that was failing)."""
        from agents.database_design_agent import DatabaseDesignAgent
        agent = DatabaseDesignAgent(business_id="test", enable_memory=False)

        # This is how the test calls it
        result = agent.design_schema(
            business_type="ecommerce",
            requirements=["users", "data"]
        )

        assert result.success is True
        assert result.schema_name == "ecommerce_db"

    def test_stripe_setup_payment_integration_api(self):
        """Test StripeIntegrationAgent setup_payment_integration (was missing)."""
        from agents.stripe_integration_agent import StripeIntegrationAgent
        agent = StripeIntegrationAgent(business_id="test", enable_memory=False)

        # This is how the test calls it
        result = agent.setup_payment_integration(
            business_id="test_business",
            payment_type="subscription",
            currency="usd"
        )

        assert result.success is True
        assert result.status == "active"


class TestStatisticsMethods:
    """Test that all agents have statistics methods."""

    def test_agents_have_statistics_methods(self):
        """Verify all agents have a statistics method."""
        from agents.database_design_agent import DatabaseDesignAgent
        from agents.stripe_integration_agent import StripeIntegrationAgent
        from agents.deploy_agent import DeployAgent

        agents = [
            DatabaseDesignAgent(business_id="test", enable_memory=False),
            StripeIntegrationAgent(business_id="test", enable_memory=False),
            DeployAgent(business_id="test", enable_memory=False),
        ]

        for agent in agents:
            # Should have one of these methods
            has_stats = (
                hasattr(agent, 'get_statistics') or
                hasattr(agent, 'get_stats') or
                hasattr(agent, 'get_cache_stats') or
                hasattr(agent, 'get_agent_stats')
            )
            assert has_stats, f"{agent.__class__.__name__} missing statistics method"


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
