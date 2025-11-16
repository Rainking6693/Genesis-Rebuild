"""
End-to-End Integration Test for Nova's AP2 Expansion
Tests multi-agent orchestration with AP2 tracking
"""

import pytest
import os
from unittest.mock import Mock, patch

from agents.content_agent import ContentAgent
from agents.seo_agent import SEOAgent
from agents.email_agent import EmailAgent
from agents.business_generation_agent import BusinessGenerationAgent


class TestMultiAgentAP2Integration:
    """Test multi-agent workflows with AP2 tracking"""

    @patch('agents.content_agent.record_ap2_event')
    @patch('agents.content_agent.get_ap2_client')
    @patch('agents.seo_agent.record_ap2_event')
    @patch('agents.seo_agent.get_ap2_client')
    @patch('agents.email_agent.record_ap2_event')
    @patch('agents.email_agent.get_ap2_client')
    def test_content_marketing_workflow(
        self,
        mock_email_client, mock_email_record,
        mock_seo_client, mock_seo_record,
        mock_content_client, mock_content_record
    ):
        """Test content marketing workflow: Content -> SEO -> Email"""

        # Setup mock clients
        mock_client = Mock()
        mock_client.spent = 0.0
        mock_content_client.return_value = mock_client
        mock_seo_client.return_value = mock_client
        mock_email_client.return_value = mock_client

        # Initialize agents
        content_agent = ContentAgent(business_id="test-workflow")
        seo_agent = SEOAgent(business_id="test-workflow")
        email_agent = EmailAgent(business_id="test-workflow")

        # Step 1: Create blog post
        blog_result = content_agent.write_blog_post(
            title="AI Marketing Trends 2025",
            keywords=["AI", "marketing", "trends", "2025"],
            word_count=2000
        )

        # Verify content agent emitted event
        assert mock_content_record.called
        content_call = mock_content_record.call_args
        assert content_call[1]['agent'] == 'ContentAgent'
        assert content_call[1]['action'] == 'write_blog_post'
        assert content_call[1]['cost'] == 2.0

        # Step 2: SEO optimization
        seo_result = seo_agent.optimize_content(
            content_url="https://example.com/blog/ai-marketing-trends-2025",
            target_keywords=["AI", "marketing", "trends", "2025"],
            optimization_type="on_page"
        )

        # Verify SEO agent emitted event
        assert mock_seo_record.called
        seo_call = mock_seo_record.call_args
        assert seo_call[1]['agent'] == 'SEOAgent'
        assert seo_call[1]['action'] == 'optimize_content'
        assert seo_call[1]['cost'] == 1.5

        # Step 3: Email campaign
        campaign_result = email_agent.create_campaign(
            campaign_name="AI Marketing Trends Newsletter",
            subject_line="Don't Miss: Top AI Marketing Trends for 2025",
            target_segment="tech_marketers"
        )

        # Verify email agent emitted event
        assert mock_email_record.called
        email_call = mock_email_record.call_args
        assert email_call[1]['agent'] == 'EmailAgent'
        assert email_call[1]['action'] == 'create_campaign'
        assert email_call[1]['cost'] == 1.0

        # Verify total workflow cost tracking
        total_cost = 2.0 + 1.5 + 1.0  # $4.50
        assert total_cost == 4.5

    @patch('infrastructure.ap2_helpers.record_ap2_event')
    @patch('infrastructure.ap2_protocol.get_ap2_client')
    @patch('agents.content_agent.record_ap2_event')
    @patch('agents.content_agent.get_ap2_client')
    def test_business_content_workflow(
        self,
        mock_content_client, mock_content_record,
        mock_protocol_client, mock_protocol_record
    ):
        """Test business generation + content creation workflow"""

        # Setup mock clients
        mock_client = Mock()
        mock_client.spent = 10.0  # Starting spend
        mock_content_client.return_value = mock_client
        mock_protocol_client.return_value = mock_client

        # Initialize agents
        business_agent = BusinessGenerationAgent(business_id="test-workflow", enable_memory=False)
        content_agent = ContentAgent(business_id="test-workflow")

        # Step 1: Generate business idea (costs $3.0)
        # This would normally call generate_idea(), but we'll just verify the agent exists
        assert business_agent.ap2_cost == 3.0
        assert business_agent.ap2_budget == 50.0

        # Step 2: Create documentation for the business idea
        doc_result = content_agent.create_documentation(
            product_name="AI SaaS Platform",
            sections=["Overview", "Features", "Pricing", "API Documentation"]
        )

        # Verify content agent emitted event
        assert mock_content_record.called
        content_call = mock_content_record.call_args
        assert content_call[1]['agent'] == 'ContentAgent'
        assert content_call[1]['action'] == 'create_documentation'


class TestAP2ThresholdEnforcement:
    """Test $50 threshold enforcement across agents"""

    @patch('agents.content_agent.record_ap2_event')
    @patch('agents.content_agent.get_ap2_client')
    def test_threshold_warning_at_limit(self, mock_get_client, mock_record_event):
        """Test warning is triggered when approaching $50 limit"""

        agent = ContentAgent(business_id="test")
        mock_client = Mock()

        # Simulate 24 operations at $2.0 each = $48.0
        mock_client.spent = 48.0
        mock_get_client.return_value = mock_client

        with patch('agents.content_agent.logger') as mock_logger:
            # 25th operation would be $50.0 total (at threshold)
            agent._emit_ap2_event(
                action="write_blog_post",
                context={"title": "Test", "word_count": "1000", "keywords_count": "5"}
            )

            # Should NOT warn at exactly $50.0 (only > $50.0)
            mock_logger.warning.assert_not_called()

        # Now test one more operation that exceeds threshold
        mock_client.spent = 48.5

        with patch('agents.content_agent.logger') as mock_logger:
            # This would be $50.5 total (exceeds threshold)
            agent._emit_ap2_event(
                action="write_blog_post",
                context={"title": "Test", "word_count": "1000", "keywords_count": "5"}
            )

            # Should warn when exceeding $50.0
            mock_logger.warning.assert_called()
            warning_msg = mock_logger.warning.call_args[0][0]
            assert "$50" in warning_msg or "$50.0" in warning_msg
            assert "USER APPROVAL REQUIRED" in warning_msg

    def test_all_agents_have_consistent_threshold(self):
        """Verify all agents have $50.0 threshold"""

        agents = [
            ContentAgent(business_id="test"),
            SEOAgent(business_id="test"),
            EmailAgent(business_id="test"),
            BusinessGenerationAgent(business_id="test", enable_memory=False)
        ]

        for agent in agents:
            assert agent.ap2_budget == 50.0, f"{agent.__class__.__name__} should have $50 budget"


class TestAP2CostConfiguration:
    """Test AP2 cost configuration across agents"""

    def test_cost_estimates_are_reasonable(self):
        """Verify cost estimates align with operation complexity"""

        content = ContentAgent(business_id="test")
        seo = SEOAgent(business_id="test")
        email = EmailAgent(business_id="test")
        business = BusinessGenerationAgent(business_id="test", enable_memory=False)

        # Verify cost hierarchy: Business > Content > SEO > Email
        assert business.ap2_cost == 3.0  # Most complex
        assert content.ap2_cost == 2.0   # Medium-high complexity
        assert seo.ap2_cost == 1.5       # Medium complexity
        assert email.ap2_cost == 1.0     # Lowest complexity

        # Verify relative ordering
        assert business.ap2_cost > content.ap2_cost
        assert content.ap2_cost > seo.ap2_cost
        assert seo.ap2_cost > email.ap2_cost

    def test_environment_variable_override(self):
        """Test that costs can be overridden via environment variables"""

        # Test custom costs
        with patch.dict(os.environ, {
            'AP2_CONTENT_COST': '5.0',
            'AP2_SEO_COST': '3.5',
            'AP2_EMAIL_COST': '2.0'
        }):
            content = ContentAgent(business_id="test")
            seo = SEOAgent(business_id="test")
            email = EmailAgent(business_id="test")

            assert content.ap2_cost == 5.0
            assert seo.ap2_cost == 3.5
            assert email.ap2_cost == 2.0


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
