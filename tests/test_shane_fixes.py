"""
Test Suite for Shane's API Fixes - Agents 5-9
==============================================

Tests Shane's fixes for agents 5-9 in ten_business_simple_test.py
According to AUDIT_PROTOCOL_V2

Auditor: Hudson
Subject: Shane's API fixes
Date: 2025-11-14
"""

import asyncio
import pytest
from datetime import datetime, timezone


class TestAgent5_APIDesignAgent:
    """Test Agent 5: APIDesignAgent fixes"""

    @pytest.mark.asyncio
    async def test_api_design_agent_signature(self):
        """Verify APIDesignAgent method signature matches Shane's fix"""
        from agents.api_design_agent import get_api_design_agent, APIConfig

        # Create agent
        agent = await get_api_design_agent(enable_memory=True)
        assert agent is not None, "Agent creation failed"

        # Create APIConfig as Shane did
        api_config = APIConfig(
            api_name="BusinessAPI",
            api_type="REST",
            endpoints=[
                {"path": "/users", "method": "GET"},
                {"path": "/items", "method": "GET"}
            ]
        )

        # Call design_api with config parameter
        result = await agent.design_api(config=api_config)

        # Verify result
        assert result is not None, "design_api returned None"
        assert hasattr(result, 'success'), "Result missing 'success' attribute"
        print(f"✓ Agent 5: APIDesignAgent - PASS")

    @pytest.mark.asyncio
    async def test_api_config_structure(self):
        """Verify APIConfig dataclass structure"""
        from agents.api_design_agent import APIConfig

        config = APIConfig(
            api_name="TestAPI",
            api_type="REST",
            endpoints=[{"path": "/test", "method": "GET"}]
        )

        assert config.api_name == "TestAPI"
        assert config.api_type == "REST"
        assert len(config.endpoints) == 1
        print(f"✓ Agent 5: APIConfig structure - PASS")


class TestAgent6_ContentCreationAgent:
    """Test Agent 6: ContentCreationAgent fixes"""

    @pytest.mark.asyncio
    async def test_content_creation_agent_signature(self):
        """Verify ContentCreationAgent method signature matches Shane's fix"""
        from agents.content_creation_agent import ContentCreationAgent, ContentType

        # Create agent
        agent = ContentCreationAgent(enable_memory=True)
        assert agent is not None, "Agent creation failed"

        # Call generate_content with all required parameters
        content = await agent.generate_content(
            user_id="test_user",
            content_type=ContentType.BLOG_POST,
            topic="Test Guide",
            requirements={"target_audience": "users", "word_count": 500}
        )

        # Verify result
        assert content is not None, "generate_content returned None"
        assert hasattr(content, 'title'), "Content missing 'title' attribute"
        assert hasattr(content, 'body'), "Content missing 'body' attribute"
        print(f"✓ Agent 6: ContentCreationAgent - PASS")

    @pytest.mark.asyncio
    async def test_content_type_enum(self):
        """Verify ContentType enum exists and has BLOG_POST"""
        from agents.content_creation_agent import ContentType

        assert hasattr(ContentType, 'BLOG_POST'), "ContentType missing BLOG_POST"
        assert ContentType.BLOG_POST.value == "blog_post"
        print(f"✓ Agent 6: ContentType enum - PASS")


class TestAgent7_SEOOptimizationAgent:
    """Test Agent 7: SEOOptimizationAgent fixes"""

    @pytest.mark.asyncio
    async def test_seo_optimization_agent_signature(self):
        """Verify SEOOptimizationAgent method signature matches Shane's fix"""
        from agents.seo_optimization_agent import SEOOptimizationAgent

        # Create agent
        agent = SEOOptimizationAgent(enable_memory=True)
        assert agent is not None, "Agent creation failed"

        # Call optimize_content with all required parameters
        seo = await agent.optimize_content(
            user_id="test_user",
            content="Sample content about testing",
            title="Testing Guide",
            target_keywords=["testing"]
        )

        # Verify result
        assert seo is not None, "optimize_content returned None"
        assert hasattr(seo, 'seo_score'), "Result missing 'seo_score' attribute"
        print(f"✓ Agent 7: SEOOptimizationAgent - PASS")

    @pytest.mark.asyncio
    async def test_seo_all_required_params(self):
        """Verify all 4 required parameters work correctly"""
        from agents.seo_optimization_agent import SEOOptimizationAgent

        agent = SEOOptimizationAgent(enable_memory=True)

        # Test with all parameters
        result = await agent.optimize_content(
            user_id="test_user",
            content="Test content",
            title="Test Title",
            target_keywords=["test", "keyword"]
        )

        assert result is not None
        assert result.seo_score >= 0.0 and result.seo_score <= 1.0
        print(f"✓ Agent 7: All required params - PASS")


class TestAgent8_EmailMarketingAgent:
    """Test Agent 8: EmailMarketingAgent fixes"""

    @pytest.mark.asyncio
    async def test_email_marketing_agent_signature(self):
        """Verify EmailMarketingAgent method signature matches Shane's fix"""
        from agents.email_marketing_agent import EmailMarketingAgent, EmailCampaign, CampaignStatus

        # Create agent
        agent = EmailMarketingAgent(enable_memory=True)
        assert agent is not None, "Agent creation failed"

        # Create EmailCampaign as Shane did
        email_campaign = EmailCampaign(
            campaign_id="test_campaign_1",
            campaign_name="Test Launch",
            subject_line="Welcome to our service",
            preview_text="Discover our amazing offer",
            body_html="<html><body>Welcome!</body></html>",
            sender_name="Marketing Team",
            sender_email="marketing@example.com",
            status=CampaignStatus.DRAFT,
            template_used=None,
            target_segments=["new_users"],
            scheduled_at=None,
            sent_at=None,
            recipients_count=0,
            opens=0,
            clicks=0,
            unsubscribes=0,
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc)
        )

        # Call store_campaign (not create_campaign!)
        result = await agent.store_campaign(
            user_id="test_user",
            campaign=email_campaign,
            open_rate=0.25,
            click_rate=0.05
        )

        # Verify result
        assert result is not None, "store_campaign returned None"
        assert result == "test_campaign_1", f"Expected campaign_id, got {result}"
        print(f"✓ Agent 8: EmailMarketingAgent - PASS")

    @pytest.mark.asyncio
    async def test_email_campaign_dataclass(self):
        """Verify EmailCampaign dataclass structure"""
        from agents.email_marketing_agent import EmailCampaign, CampaignStatus

        campaign = EmailCampaign(
            campaign_id="test_123",
            campaign_name="Test",
            subject_line="Test Subject",
            preview_text="Preview",
            body_html="<html></html>",
            sender_name="Test",
            sender_email="test@test.com",
            status=CampaignStatus.DRAFT,
            template_used=None,
            target_segments=[],
            scheduled_at=None,
            sent_at=None,
            recipients_count=0,
            opens=0,
            clicks=0,
            unsubscribes=0,
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc)
        )

        assert campaign.campaign_id == "test_123"
        assert campaign.status == CampaignStatus.DRAFT
        print(f"✓ Agent 8: EmailCampaign structure - PASS")


class TestAgent9_MarketingAgentMultimodal:
    """Test Agent 9: MarketingAgentMultimodal fixes"""

    @pytest.mark.asyncio
    async def test_marketing_agent_multimodal_signature(self):
        """Verify MarketingAgentMultimodal method signature matches Shane's fix"""
        from agents.marketing_agent_multimodal import MarketingAgentMultimodal, MarketingCampaign, VisualContent

        # Create agent
        agent = MarketingAgentMultimodal(enable_memory=True)
        assert agent is not None, "Agent creation failed"

        # Create VisualContent
        visual_content = VisualContent(
            image_path="/tmp/hero.jpg",
            content_type="hero",
            brand_alignment=0.8,
            visual_description="Hero image for campaign",
            detected_elements=["hero_image", "text_overlay"],
            color_palette=["#FF6B6B", "#4ECDC4"],
            confidence=0.85
        )

        # Create MarketingCampaign
        marketing_campaign = MarketingCampaign(
            campaign_id="marketing_1",
            campaign_name="Test Social Campaign",
            campaign_type="social_media",
            brand_guidelines={"platform": "linkedin"},
            visual_assets=[visual_content],
            brand_patterns=["professional", "modern"],
            user_preferences={"target_audience": "professionals"},
            created_at=datetime.now(timezone.utc)
        )

        # Call store_campaign (not create_campaign!)
        await agent.store_campaign(
            campaign=marketing_campaign,
            success=True,
            performance_metrics={"engagement_rate": 0.15, "click_rate": 0.05},
            scope="app"
        )

        # Verify by checking stats
        stats = agent.get_agent_stats()
        assert stats is not None
        assert stats['campaigns_created'] == 1, f"Expected 1 campaign, got {stats['campaigns_created']}"
        print(f"✓ Agent 9: MarketingAgentMultimodal - PASS")

    @pytest.mark.asyncio
    async def test_marketing_campaign_dataclass(self):
        """Verify MarketingCampaign and VisualContent structure"""
        from agents.marketing_agent_multimodal import MarketingCampaign, VisualContent

        visual = VisualContent(
            image_path="/test.jpg",
            content_type="test",
            brand_alignment=0.9,
            visual_description="Test",
            detected_elements=["element1"],
            color_palette=["#000000"],
            confidence=0.95
        )

        campaign = MarketingCampaign(
            campaign_id="test_123",
            campaign_name="Test",
            campaign_type="social_media",
            brand_guidelines={},
            visual_assets=[visual],
            brand_patterns=[],
            user_preferences={},
            created_at=datetime.now(timezone.utc)
        )

        assert campaign.campaign_id == "test_123"
        assert len(campaign.visual_assets) == 1
        print(f"✓ Agent 9: MarketingCampaign structure - PASS")


class TestIntegrationShanesFixes:
    """Integration test simulating the actual test file flow"""

    @pytest.mark.asyncio
    async def test_all_agents_sequentially(self):
        """Test all 5 agents in sequence as they appear in the test file"""

        # Agent 5: APIDesignAgent
        from agents.api_design_agent import get_api_design_agent, APIConfig
        api_agent = await get_api_design_agent(enable_memory=True)
        api_config = APIConfig(
            api_name="BusinessAPI",
            api_type="REST",
            endpoints=[
                {"path": "/users", "method": "GET"},
                {"path": "/items", "method": "GET"}
            ]
        )
        api_result = await api_agent.design_api(config=api_config)
        assert api_result is not None
        print("✓ Integration: Agent 5 - PASS")

        # Agent 6: ContentCreationAgent
        from agents.content_creation_agent import ContentCreationAgent, ContentType
        content_agent = ContentCreationAgent(enable_memory=True)
        content = await content_agent.generate_content(
            user_id="test_user",
            content_type=ContentType.BLOG_POST,
            topic="Integration Test Guide",
            requirements={"target_audience": "users", "word_count": 500}
        )
        assert content is not None
        assert hasattr(content, 'body')
        assert hasattr(content, 'title')
        print("✓ Integration: Agent 6 - PASS")

        # Agent 7: SEOOptimizationAgent
        from agents.seo_optimization_agent import SEOOptimizationAgent
        seo_agent = SEOOptimizationAgent(enable_memory=True)
        seo = await seo_agent.optimize_content(
            user_id="test_user",
            content=content.body if hasattr(content, 'body') else "Sample content about testing",
            title=content.title if hasattr(content, 'title') else "Testing Guide",
            target_keywords=["testing"]
        )
        assert seo is not None
        print("✓ Integration: Agent 7 - PASS")

        # Agent 8: EmailMarketingAgent
        from agents.email_marketing_agent import EmailMarketingAgent, EmailCampaign, CampaignStatus
        email_agent = EmailMarketingAgent(enable_memory=True)
        email_campaign = EmailCampaign(
            campaign_id="integration_campaign",
            campaign_name="Integration Test Launch",
            subject_line="Welcome to our service",
            preview_text="Discover our amazing offer",
            body_html="<html><body>Welcome!</body></html>",
            sender_name="Marketing Team",
            sender_email="marketing@example.com",
            status=CampaignStatus.DRAFT,
            template_used=None,
            target_segments=["new_users"],
            scheduled_at=None,
            sent_at=None,
            recipients_count=0,
            opens=0,
            clicks=0,
            unsubscribes=0,
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc)
        )
        campaign_result = await email_agent.store_campaign(
            user_id="test_user",
            campaign=email_campaign,
            open_rate=0.25,
            click_rate=0.05
        )
        assert campaign_result is not None
        print("✓ Integration: Agent 8 - PASS")

        # Agent 9: MarketingAgentMultimodal
        from agents.marketing_agent_multimodal import MarketingAgentMultimodal, MarketingCampaign, VisualContent
        marketing_agent = MarketingAgentMultimodal(enable_memory=True)
        visual_content = VisualContent(
            image_path="/tmp/hero.jpg",
            content_type="hero",
            brand_alignment=0.8,
            visual_description="Hero image for campaign",
            detected_elements=["hero_image", "text_overlay"],
            color_palette=["#FF6B6B", "#4ECDC4"],
            confidence=0.85
        )
        marketing_campaign = MarketingCampaign(
            campaign_id="integration_marketing",
            campaign_name="Integration Social Campaign",
            campaign_type="social_media",
            brand_guidelines={"platform": "linkedin"},
            visual_assets=[visual_content],
            brand_patterns=["professional", "modern"],
            user_preferences={"target_audience": "professionals"},
            created_at=datetime.now(timezone.utc)
        )
        await marketing_agent.store_campaign(
            campaign=marketing_campaign,
            success=True,
            performance_metrics={"engagement_rate": 0.15, "click_rate": 0.05},
            scope="app"
        )
        stats = marketing_agent.get_agent_stats()
        assert stats['campaigns_created'] >= 1
        print("✓ Integration: Agent 9 - PASS")

        print("\n" + "=" * 60)
        print("✓ ALL 5 AGENTS INTEGRATION TEST - PASS")
        print("=" * 60)


if __name__ == "__main__":
    # Run tests
    pytest.main([__file__, "-v", "-s"])
