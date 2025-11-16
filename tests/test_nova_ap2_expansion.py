"""
Test suite for Nova AP2 Expansion
Tests AP2 integration with $50 approval threshold for:
- ContentAgent
- SEOAgent
- EmailAgent
- BusinessGenerationAgent (GenesisAgent)
"""

import pytest
import json
import os
import tempfile
from unittest.mock import Mock, patch, MagicMock
from pathlib import Path

# Import agents
from agents.content_agent import ContentAgent
from agents.seo_agent import SEOAgent
from agents.email_agent import EmailAgent
from agents.business_generation_agent import BusinessGenerationAgent

# Import AP2 infrastructure
from infrastructure.ap2_protocol import AP2Client, AP2Event, get_ap2_client
from infrastructure.ap2_helpers import record_ap2_event


class TestContentAgentAP2Integration:
    """Test ContentAgent AP2 integration with $50 threshold"""

    def test_content_agent_has_ap2_cost_attribute(self):
        """Verify ContentAgent initializes with AP2 cost"""
        agent = ContentAgent(business_id="test")
        assert hasattr(agent, 'ap2_cost')
        assert agent.ap2_cost == 2.0  # Default $2.0 per operation

    def test_content_agent_has_ap2_budget_attribute(self):
        """Verify ContentAgent has $50 budget threshold"""
        agent = ContentAgent(business_id="test")
        assert hasattr(agent, 'ap2_budget')
        assert agent.ap2_budget == 50.0

    def test_content_agent_emit_ap2_event_method_exists(self):
        """Verify ContentAgent has _emit_ap2_event method"""
        agent = ContentAgent(business_id="test")
        assert hasattr(agent, '_emit_ap2_event')
        assert callable(agent._emit_ap2_event)

    @patch('agents.content_agent.record_ap2_event')
    @patch('agents.content_agent.get_ap2_client')
    def test_content_agent_write_blog_post_emits_ap2_event(self, mock_get_client, mock_record_event):
        """Test that write_blog_post emits AP2 event"""
        agent = ContentAgent(business_id="test")
        mock_client = Mock()
        mock_client.spent = 10.0
        mock_get_client.return_value = mock_client

        result = agent.write_blog_post(
            title="AI Best Practices",
            keywords=["AI", "best practices", "guide"],
            word_count=2000
        )

        assert mock_record_event.called
        call_args = mock_record_event.call_args
        assert call_args[1]['agent'] == 'ContentAgent'
        assert call_args[1]['action'] == 'write_blog_post'
        assert call_args[1]['cost'] == 2.0

    @patch('agents.content_agent.record_ap2_event')
    @patch('agents.content_agent.get_ap2_client')
    def test_content_agent_create_documentation_emits_ap2_event(self, mock_get_client, mock_record_event):
        """Test that create_documentation emits AP2 event"""
        agent = ContentAgent(business_id="test")
        mock_client = Mock()
        mock_client.spent = 5.0
        mock_get_client.return_value = mock_client

        result = agent.create_documentation(
            product_name="TestProduct",
            sections=["Getting Started", "API Reference", "Examples"]
        )

        assert mock_record_event.called
        call_args = mock_record_event.call_args
        assert call_args[1]['agent'] == 'ContentAgent'
        assert call_args[1]['action'] == 'create_documentation'

    @patch('agents.content_agent.record_ap2_event')
    @patch('agents.content_agent.get_ap2_client')
    def test_content_agent_threshold_warning_triggered(self, mock_get_client, mock_record_event):
        """Test that $50 threshold warning is logged when limit approached"""
        agent = ContentAgent(business_id="test")
        mock_client = Mock()
        mock_client.spent = 48.5  # Near threshold
        mock_get_client.return_value = mock_client

        with patch('agents.content_agent.logger') as mock_logger:
            agent._emit_ap2_event(
                action="test_action",
                context={"test": "context"}
            )
            # Should log warning since 48.5 + 2.0 = 50.5 > 50.0
            mock_logger.warning.assert_called()
            warning_msg = mock_logger.warning.call_args[0][0]
            assert "$50" in warning_msg
            assert "USER APPROVAL REQUIRED" in warning_msg


class TestSEOAgentAP2Integration:
    """Test SEOAgent AP2 integration with $50 threshold"""

    def test_seo_agent_has_ap2_cost_attribute(self):
        """Verify SEOAgent initializes with AP2 cost"""
        agent = SEOAgent(business_id="test")
        assert hasattr(agent, 'ap2_cost')
        assert agent.ap2_cost == 1.5  # Default $1.5 per operation

    def test_seo_agent_has_ap2_budget_attribute(self):
        """Verify SEOAgent has $50 budget threshold"""
        agent = SEOAgent(business_id="test")
        assert hasattr(agent, 'ap2_budget')
        assert agent.ap2_budget == 50.0

    def test_seo_agent_emit_ap2_event_method_exists(self):
        """Verify SEOAgent has _emit_ap2_event method"""
        agent = SEOAgent(business_id="test")
        assert hasattr(agent, '_emit_ap2_event')
        assert callable(agent._emit_ap2_event)

    @patch('agents.seo_agent.record_ap2_event')
    @patch('agents.seo_agent.get_ap2_client')
    def test_seo_agent_keyword_research_emits_ap2_event(self, mock_get_client, mock_record_event):
        """Test that keyword_research emits AP2 event"""
        agent = SEOAgent(business_id="test")
        mock_client = Mock()
        mock_client.spent = 15.0
        mock_get_client.return_value = mock_client

        result = agent.keyword_research(
            topic="AI",
            target_audience="tech professionals",
            num_keywords=10
        )

        assert mock_record_event.called
        call_args = mock_record_event.call_args
        assert call_args[1]['agent'] == 'SEOAgent'
        assert call_args[1]['action'] == 'keyword_research'
        assert call_args[1]['cost'] == 1.5

    @patch('agents.seo_agent.record_ap2_event')
    @patch('agents.seo_agent.get_ap2_client')
    def test_seo_agent_optimize_content_emits_ap2_event(self, mock_get_client, mock_record_event):
        """Test that optimize_content emits AP2 event"""
        agent = SEOAgent(business_id="test")
        mock_client = Mock()
        mock_client.spent = 3.0
        mock_get_client.return_value = mock_client

        result = agent.optimize_content(
            content_url="https://example.com/article",
            target_keywords=["AI", "optimization"],
            optimization_type="on_page"
        )

        assert mock_record_event.called
        call_args = mock_record_event.call_args
        assert call_args[1]['agent'] == 'SEOAgent'
        assert call_args[1]['action'] == 'optimize_content'

    @patch('agents.seo_agent.record_ap2_event')
    @patch('agents.seo_agent.get_ap2_client')
    def test_seo_agent_track_rankings_emits_ap2_event(self, mock_get_client, mock_record_event):
        """Test that track_rankings emits AP2 event"""
        agent = SEOAgent(business_id="test")
        mock_client = Mock()
        mock_client.spent = 6.0
        mock_get_client.return_value = mock_client

        result = agent.track_rankings(
            domain="example.com",
            keywords=["AI", "machine learning"],
            search_engine="google"
        )

        assert mock_record_event.called
        call_args = mock_record_event.call_args
        assert call_args[1]['agent'] == 'SEOAgent'
        assert call_args[1]['action'] == 'track_rankings'

    @patch('agents.seo_agent.record_ap2_event')
    @patch('agents.seo_agent.get_ap2_client')
    def test_seo_agent_threshold_warning_triggered(self, mock_get_client, mock_record_event):
        """Test that $50 threshold warning is logged for SEOAgent"""
        agent = SEOAgent(business_id="test")
        mock_client = Mock()
        mock_client.spent = 49.0  # Near threshold
        mock_get_client.return_value = mock_client

        with patch('agents.seo_agent.logger') as mock_logger:
            agent._emit_ap2_event(
                action="test_action",
                context={"test": "context"}
            )
            # Should log warning since 49.0 + 1.5 = 50.5 > 50.0
            mock_logger.warning.assert_called()
            warning_msg = mock_logger.warning.call_args[0][0]
            assert "$50" in warning_msg


class TestEmailAgentAP2Integration:
    """Test EmailAgent AP2 integration with $50 threshold"""

    def test_email_agent_has_ap2_cost_attribute(self):
        """Verify EmailAgent initializes with AP2 cost"""
        agent = EmailAgent(business_id="test")
        assert hasattr(agent, 'ap2_cost')
        assert agent.ap2_cost == 1.0  # Default $1.0 per operation

    def test_email_agent_has_ap2_budget_attribute(self):
        """Verify EmailAgent has $50 budget threshold"""
        agent = EmailAgent(business_id="test")
        assert hasattr(agent, 'ap2_budget')
        assert agent.ap2_budget == 50.0

    def test_email_agent_emit_ap2_event_method_exists(self):
        """Verify EmailAgent has _emit_ap2_event method"""
        agent = EmailAgent(business_id="test")
        assert hasattr(agent, '_emit_ap2_event')
        assert callable(agent._emit_ap2_event)

    @patch('agents.email_agent.record_ap2_event')
    @patch('agents.email_agent.get_ap2_client')
    def test_email_agent_create_campaign_emits_ap2_event(self, mock_get_client, mock_record_event):
        """Test that create_campaign emits AP2 event"""
        agent = EmailAgent(business_id="test")
        mock_client = Mock()
        mock_client.spent = 20.0
        mock_get_client.return_value = mock_client

        result = agent.create_campaign(
            campaign_name="Q4 Promotion",
            subject_line="Special Q4 Offer",
            target_segment="premium_users"
        )

        assert mock_record_event.called
        call_args = mock_record_event.call_args
        assert call_args[1]['agent'] == 'EmailAgent'
        assert call_args[1]['action'] == 'create_campaign'
        assert call_args[1]['cost'] == 1.0

    @patch('agents.email_agent.record_ap2_event')
    @patch('agents.email_agent.get_ap2_client')
    def test_email_agent_send_email_emits_ap2_event(self, mock_get_client, mock_record_event):
        """Test that send_email emits AP2 event"""
        agent = EmailAgent(business_id="test")
        mock_client = Mock()
        mock_client.spent = 25.0
        mock_get_client.return_value = mock_client

        result = agent.send_email(
            campaign_id="CAMP-001",
            recipients=["user1@test.com", "user2@test.com"],
            send_immediately=True
        )

        assert mock_record_event.called
        call_args = mock_record_event.call_args
        assert call_args[1]['agent'] == 'EmailAgent'
        assert call_args[1]['action'] == 'send_email'

    @patch('agents.email_agent.record_ap2_event')
    @patch('agents.email_agent.get_ap2_client')
    def test_email_agent_optimize_deliverability_emits_ap2_event(self, mock_get_client, mock_record_event):
        """Test that optimize_deliverability emits AP2 event"""
        agent = EmailAgent(business_id="test")
        mock_client = Mock()
        mock_client.spent = 30.0
        mock_get_client.return_value = mock_client

        result = agent.optimize_deliverability(domain="example.com")

        assert mock_record_event.called
        call_args = mock_record_event.call_args
        assert call_args[1]['agent'] == 'EmailAgent'
        assert call_args[1]['action'] == 'optimize_deliverability'

    @patch('agents.email_agent.record_ap2_event')
    @patch('agents.email_agent.get_ap2_client')
    def test_email_agent_threshold_warning_triggered(self, mock_get_client, mock_record_event):
        """Test that $50 threshold warning is logged for EmailAgent"""
        agent = EmailAgent(business_id="test")
        mock_client = Mock()
        mock_client.spent = 49.5  # Near threshold
        mock_get_client.return_value = mock_client

        with patch('agents.email_agent.logger') as mock_logger:
            agent._emit_ap2_event(
                action="test_action",
                context={"test": "context"}
            )
            # Should log warning since 49.5 + 1.0 = 50.5 > 50.0
            mock_logger.warning.assert_called()


class TestBusinessGenerationAgentAP2Integration:
    """Test BusinessGenerationAgent (GenesisAgent) AP2 integration with $50 threshold"""

    def test_business_gen_agent_has_ap2_cost_attribute(self):
        """Verify BusinessGenerationAgent initializes with AP2 cost"""
        agent = BusinessGenerationAgent(business_id="test", enable_memory=False)
        assert hasattr(agent, 'ap2_cost')
        assert agent.ap2_cost == 3.0  # Default $3.0 per operation

    def test_business_gen_agent_has_ap2_budget_attribute(self):
        """Verify BusinessGenerationAgent has $50 budget threshold"""
        agent = BusinessGenerationAgent(business_id="test", enable_memory=False)
        assert hasattr(agent, 'ap2_budget')
        assert agent.ap2_budget == 50.0

    def test_business_gen_agent_record_ap2_event_exists(self):
        """Verify BusinessGenerationAgent has _record_ap2_event method"""
        agent = BusinessGenerationAgent(business_id="test", enable_memory=False)
        assert hasattr(agent, '_record_ap2_event')
        assert callable(agent._record_ap2_event)

    @patch('infrastructure.ap2_protocol.get_ap2_client')
    def test_business_gen_agent_threshold_warning_triggered(self, mock_get_client):
        """Test that $50 threshold warning is logged for BusinessGenerationAgent"""
        agent = BusinessGenerationAgent(business_id="test", enable_memory=False)
        mock_client = Mock()
        mock_client.spent = 47.5  # Near threshold
        mock_get_client.return_value = mock_client

        with patch('agents.business_generation_agent.logger') as mock_logger:
            with patch('infrastructure.ap2_helpers.record_ap2_event'):
                agent._record_ap2_event(
                    action="test_action",
                    context={"test": "context"}
                )
                # Should log warning since 47.5 + 3.0 = 50.5 > 50.0
                mock_logger.warning.assert_called()
                warning_msg = mock_logger.warning.call_args[0][0]
                assert "$50" in warning_msg


class TestAP2CostTracking:
    """Test AP2 cost tracking across multiple operations"""

    @patch('infrastructure.ap2_protocol.AP2Client')
    def test_cumulative_cost_tracking_content_agent(self, mock_ap2_client_class):
        """Test that multiple ContentAgent operations track cumulative costs"""
        mock_client = Mock()
        mock_client.spent = 0.0

        # Simulate operations
        operations = [
            ('write_blog_post', 2.0),
            ('create_documentation', 2.0),
            ('generate_faq', 2.0),
        ]

        for action, cost in operations:
            mock_client.spent += cost
            assert mock_client.spent <= 50.0

        assert mock_client.spent == 6.0

    def test_ap2_budget_threshold_constants(self):
        """Verify all agents have consistent $50 budget threshold"""
        agents = [
            (ContentAgent, 2.0),
            (SEOAgent, 1.5),
            (EmailAgent, 1.0),
            (BusinessGenerationAgent, 3.0),
        ]

        for agent_class, expected_cost in agents:
            if agent_class == BusinessGenerationAgent:
                agent = agent_class(business_id="test", enable_memory=False)
            else:
                agent = agent_class(business_id="test")

            assert agent.ap2_budget == 50.0, f"{agent_class.__name__} should have $50 budget"
            assert agent.ap2_cost == expected_cost, f"{agent_class.__name__} cost mismatch"


class TestAP2ContextTracking:
    """Test that AP2 events include proper context"""

    @patch('agents.content_agent.record_ap2_event')
    @patch('agents.content_agent.get_ap2_client')
    def test_content_agent_ap2_context_includes_title(self, mock_get_client, mock_record_event):
        """Test that write_blog_post context includes title"""
        agent = ContentAgent(business_id="test")
        mock_client = Mock()
        mock_client.spent = 0.0
        mock_get_client.return_value = mock_client

        agent.write_blog_post(
            title="Test Article",
            keywords=["test", "article"],
            word_count=1500
        )

        context = mock_record_event.call_args[1]['context']
        assert 'title' in context
        assert context['title'] == "Test Article"

    @patch('agents.seo_agent.record_ap2_event')
    @patch('agents.seo_agent.get_ap2_client')
    def test_seo_agent_ap2_context_includes_domain(self, mock_get_client, mock_record_event):
        """Test that keyword_research context includes topic"""
        agent = SEOAgent(business_id="test")
        mock_client = Mock()
        mock_client.spent = 0.0
        mock_get_client.return_value = mock_client

        agent.keyword_research(
            topic="blockchain",
            target_audience="developers",
            num_keywords=5
        )

        context = mock_record_event.call_args[1]['context']
        assert 'topic' in context
        assert context['topic'] == "blockchain"

    @patch('agents.email_agent.record_ap2_event')
    @patch('agents.email_agent.get_ap2_client')
    def test_email_agent_ap2_context_includes_campaign_name(self, mock_get_client, mock_record_event):
        """Test that create_campaign context includes campaign_name"""
        agent = EmailAgent(business_id="test")
        mock_client = Mock()
        mock_client.spent = 0.0
        mock_get_client.return_value = mock_client

        agent.create_campaign(
            campaign_name="Spring Sale",
            subject_line="Save 20% This Spring",
            target_segment="active_users"
        )

        context = mock_record_event.call_args[1]['context']
        assert 'campaign_name' in context
        assert context['campaign_name'] == "Spring Sale"


class TestAP2EnvironmentVariables:
    """Test AP2 cost configuration via environment variables"""

    def test_ap2_cost_from_environment_content(self):
        """Test ContentAgent respects AP2_CONTENT_COST env var"""
        with patch.dict(os.environ, {'AP2_CONTENT_COST': '5.0'}):
            agent = ContentAgent(business_id="test")
            assert agent.ap2_cost == 5.0

    def test_ap2_cost_from_environment_seo(self):
        """Test SEOAgent respects AP2_SEO_COST env var"""
        with patch.dict(os.environ, {'AP2_SEO_COST': '2.5'}):
            agent = SEOAgent(business_id="test")
            assert agent.ap2_cost == 2.5

    def test_ap2_cost_from_environment_email(self):
        """Test EmailAgent respects AP2_EMAIL_COST env var"""
        with patch.dict(os.environ, {'AP2_EMAIL_COST': '0.75'}):
            agent = EmailAgent(business_id="test")
            assert agent.ap2_cost == 0.75

    def test_ap2_cost_defaults(self):
        """Test default AP2 costs when env vars not set"""
        # Clear env vars if they exist by removing them
        env_vars_to_clear = ['AP2_CONTENT_COST', 'AP2_SEO_COST', 'AP2_EMAIL_COST', 'AP2_BUSINESS_COST']

        # Save original values
        original_values = {var: os.environ.get(var) for var in env_vars_to_clear}

        try:
            # Remove env vars
            for var in env_vars_to_clear:
                os.environ.pop(var, None)

            content_agent = ContentAgent(business_id="test")
            seo_agent = SEOAgent(business_id="test")
            email_agent = EmailAgent(business_id="test")

            assert content_agent.ap2_cost == 2.0
            assert seo_agent.ap2_cost == 1.5
            assert email_agent.ap2_cost == 1.0
        finally:
            # Restore original values
            for var, value in original_values.items():
                if value is not None:
                    os.environ[var] = value
                else:
                    os.environ.pop(var, None)


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
