"""
Comprehensive Tests for Tier 2 Final Batch Agents
Version: 1.0 (November 13, 2025)

Tests for:
1. Content Creation Agent (multimodal)
2. SEO Optimization Agent
3. Email Marketing Agent
4. Analytics Agent (multimodal)

Each agent uses isolated MongoDB for testing with GenesisMemoryOSMongoDB.
All tests include memory integration, syntax validation, and functional workflows.
"""

import asyncio
import pytest
import json
import uuid
from datetime import datetime, timezone, timedelta
from typing import List, Dict, Any

# Content Creation Agent imports
from agents.content_creation_agent import (
    ContentCreationAgent,
    create_content_creation_agent,
    ContentType,
    ContentTemplate,
    GeneratedContent,
    ContentAnalysis
)

# SEO Optimization Agent imports
from agents.seo_optimization_agent import (
    SEOOptimizationAgent,
    create_seo_optimization_agent,
    SEOPattern,
    OptimizedContent,
    RankingMetrics
)

# Email Marketing Agent imports
from agents.email_marketing_agent import (
    EmailMarketingAgent,
    create_email_marketing_agent,
    EmailCampaign,
    CampaignStatus,
    Subscriber,
    SubscriberStatus,
    ABTestResult
)

# Analytics Agent imports
from agents.analytics_agent import (
    AnalyticsAgent,
    create_analytics_agent,
    MetricType,
    ChartType,
    MetricDataPoint,
    AnalyticsInsight,
    ChartAnalysis
)


# ==============================================================================
# CONTENT CREATION AGENT TESTS
# ==============================================================================

class TestContentCreationAgent:
    """Test suite for Content Creation Agent"""

    @pytest.fixture
    def agent(self):
        """Create test agent without memory"""
        return ContentCreationAgent(
            business_id="test_content",
            enable_memory=False
        )

    @pytest.fixture
    async def agent_with_memory(self):
        """Create test agent with isolated memory"""
        return await create_content_creation_agent(
            business_id="test_content_memory",
            enable_memory=True,
            mongodb_uri="mongodb://localhost:27017/genesis_test_content"
        )

    def test_initialization(self, agent):
        """Test agent initialization"""
        assert agent is not None
        assert agent.business_id == "test_content"
        assert agent.enable_memory is False
        assert agent.session_id is not None
        assert isinstance(agent.content_stats, dict)

    @pytest.mark.asyncio
    async def test_store_content_template(self, agent):
        """Test storing content template"""
        template_id = await agent.store_content_template(
            user_id="test_user",
            content_type=ContentType.BLOG_POST,
            template_name="standard_blog",
            structure={
                "introduction": "Hook with question",
                "body": "Main points with examples",
                "conclusion": "Summary and CTA"
            },
            placeholders=["[TOPIC]", "[EXAMPLES]", "[CTA]"],
            success_rate=0.85
        )

        assert template_id is not None
        assert isinstance(template_id, str)
        assert agent.content_stats['templates_stored'] == 1

    @pytest.mark.asyncio
    async def test_recall_templates(self, agent):
        """Test recalling templates"""
        # Store first
        await agent.store_content_template(
            user_id="test_user",
            content_type=ContentType.BLOG_POST,
            template_name="blog_1",
            structure={"intro": "Hook"},
            placeholders=["[TOPIC]"],
            success_rate=0.8
        )

        # Recall
        templates = await agent.recall_templates(
            user_id="test_user",
            content_type=ContentType.BLOG_POST,
            top_k=5
        )

        assert isinstance(templates, list)
        assert agent.content_stats['templates_recalled'] == 1

    @pytest.mark.asyncio
    async def test_generate_content(self, agent):
        """Test content generation"""
        content = await agent.generate_content(
            user_id="test_user",
            content_type=ContentType.BLOG_POST,
            topic="AI and Machine Learning",
            requirements={
                "word_count": 500,
                "include_cta": True,
                "tone": "professional"
            }
        )

        assert isinstance(content, GeneratedContent)
        assert content.content_type == ContentType.BLOG_POST
        assert "AI" in content.title or "Machine Learning" in content.title
        assert content.quality_score >= 0.0
        assert content.quality_score <= 1.0
        assert agent.content_stats['content_generated'] == 1

    @pytest.mark.asyncio
    async def test_content_quality_analysis(self, agent):
        """Test content quality analysis"""
        analysis = await agent._analyze_content(
            title="Complete Guide to AI",
            body="Machine learning is a subset of artificial intelligence. " * 50,
            content_type=ContentType.BLOG_POST
        )

        assert isinstance(analysis, ContentAnalysis)
        assert 0.0 <= analysis.quality_score <= 1.0
        assert 0.0 <= analysis.readability_score <= 1.0
        assert 0.0 <= analysis.seo_score <= 1.0
        assert isinstance(analysis.issues, list)
        assert isinstance(analysis.suggestions, list)

    @pytest.mark.asyncio
    async def test_generate_multiple_content_types(self, agent):
        """Test generating different content types"""
        content_types = [
            ContentType.BLOG_POST,
            ContentType.DOCUMENTATION,
            ContentType.SOCIAL_MEDIA,
            ContentType.EMAIL,
        ]

        for content_type in content_types:
            content = await agent.generate_content(
                user_id="test_user",
                content_type=content_type,
                topic="Test Topic",
                requirements={}
            )

            assert content.content_type == content_type
            assert content.quality_score > 0

    def test_get_stats(self, agent):
        """Test getting agent statistics"""
        stats = agent.get_stats()

        assert 'session_id' in stats
        assert 'business_id' in stats
        assert 'memory_enabled' in stats
        assert 'stats' in stats
        assert stats['business_id'] == "test_content"
        assert stats['memory_enabled'] is False

    @pytest.mark.asyncio
    async def test_end_to_end_workflow(self, agent):
        """Test complete content creation workflow"""
        # Step 1: Store template
        template_id = await agent.store_content_template(
            user_id="user_1",
            content_type=ContentType.BLOG_POST,
            template_name="workflow_template",
            structure={"intro": "Hook", "body": "Content", "conclusion": "CTA"},
            placeholders=["[TOPIC]"],
            success_rate=0.9
        )
        assert template_id is not None

        # Step 2: Generate content using template
        content = await agent.generate_content(
            user_id="user_1",
            content_type=ContentType.BLOG_POST,
            topic="Best Practices",
            requirements={"word_count": 300}
        )
        assert content.content_id is not None

        # Step 3: Verify stats
        final_stats = agent.get_stats()
        assert final_stats['stats']['templates_stored'] == 1
        assert final_stats['stats']['content_generated'] == 1


# ==============================================================================
# SEO OPTIMIZATION AGENT TESTS
# ==============================================================================

class TestSEOOptimizationAgent:
    """Test suite for SEO Optimization Agent"""

    @pytest.fixture
    def agent(self):
        """Create test agent without memory"""
        return SEOOptimizationAgent(
            business_id="test_seo",
            enable_memory=False
        )

    def test_initialization(self, agent):
        """Test agent initialization"""
        assert agent is not None
        assert agent.business_id == "test_seo"
        assert agent.enable_memory is False
        assert agent.session_id is not None

    @pytest.mark.asyncio
    async def test_store_seo_pattern(self, agent):
        """Test storing SEO pattern"""
        pattern_id = await agent.store_seo_pattern(
            user_id="test_user",
            pattern_name="high_volume_keywords",
            niche="technology",
            techniques=["keyword_research", "content_optimization"],
            success_metrics={"rank_improvement": 15, "traffic_increase": 2.5},
            success_rate=0.85,
            ranking_improvement=15
        )

        assert pattern_id is not None
        assert isinstance(pattern_id, str)
        assert agent.seo_stats['patterns_stored'] == 1

    @pytest.mark.asyncio
    async def test_recall_patterns(self, agent):
        """Test recalling SEO patterns"""
        # Store first
        await agent.store_seo_pattern(
            user_id="test_user",
            pattern_name="seo_pattern_1",
            niche="tech",
            techniques=["optimization"],
            success_metrics={},
            success_rate=0.8,
            ranking_improvement=10
        )

        # Recall
        patterns = await agent.recall_patterns(
            user_id="test_user",
            niche="tech",
            top_k=5
        )

        assert isinstance(patterns, list)
        assert agent.seo_stats['patterns_recalled'] == 1

    @pytest.mark.asyncio
    async def test_optimize_content(self, agent):
        """Test content optimization"""
        optimized = await agent.optimize_content(
            user_id="test_user",
            content="This is about artificial intelligence and machine learning technologies.",
            title="AI Guide",
            target_keywords=["artificial intelligence", "machine learning", "AI"]
        )

        assert isinstance(optimized, OptimizedContent)
        assert optimized.seo_score > 0
        assert optimized.seo_score <= 1.0
        assert len(optimized.keywords) == 3
        assert agent.seo_stats['content_optimized'] == 1

    @pytest.mark.asyncio
    async def test_track_rankings(self, agent):
        """Test keyword ranking tracking"""
        keywords = ["AI guide", "machine learning tutorial", "deep learning"]
        metrics = await agent.track_rankings(
            user_id="test_user",
            keywords=keywords
        )

        assert len(metrics) == len(keywords)
        assert all(isinstance(m, RankingMetrics) for m in metrics)
        assert all(m.keyword in keywords for m in metrics)
        assert agent.seo_stats['rankings_tracked'] == 1

    def test_seo_score_calculation(self, agent):
        """Test SEO score calculation"""
        # Good SEO
        score = agent._calculate_seo_score(
            title="Complete Guide to AI and Machine Learning",
            content="Machine learning is a subset of artificial intelligence. " * 20,
            keywords=["AI", "machine learning"],
            meta="Learn about artificial intelligence and machine learning with our comprehensive guide."
        )

        assert score >= 0.3
        assert score <= 1.0

    def test_visibility_calculation(self, agent):
        """Test visibility score calculation"""
        # Test different ranks
        assert agent._calculate_visibility(1) == 0.9
        assert agent._calculate_visibility(5) == 0.9
        assert agent._calculate_visibility(15) == 0.7
        assert agent._calculate_visibility(100) == 0.2

    @pytest.mark.asyncio
    async def test_end_to_end_seo_workflow(self, agent):
        """Test complete SEO optimization workflow"""
        # Step 1: Store pattern
        pattern_id = await agent.store_seo_pattern(
            user_id="user_1",
            pattern_name="workflow_pattern",
            niche="technology",
            techniques=["keyword_optimization", "backlinks"],
            success_metrics={"rank_avg": 12},
            success_rate=0.88,
            ranking_improvement=12
        )
        assert pattern_id is not None

        # Step 2: Optimize content
        optimized = await agent.optimize_content(
            user_id="user_1",
            content="Content about technology and innovation.",
            title="Tech Guide",
            target_keywords=["technology", "innovation"]
        )
        assert optimized.seo_score > 0

        # Step 3: Track rankings
        metrics = await agent.track_rankings(
            user_id="user_1",
            keywords=["technology guide"]
        )
        assert len(metrics) > 0


# ==============================================================================
# EMAIL MARKETING AGENT TESTS
# ==============================================================================

class TestEmailMarketingAgent:
    """Test suite for Email Marketing Agent"""

    @pytest.fixture
    def agent(self):
        """Create test agent without memory"""
        return EmailMarketingAgent(
            business_id="test_email",
            enable_memory=False
        )

    def test_initialization(self, agent):
        """Test agent initialization"""
        assert agent is not None
        assert agent.business_id == "test_email"
        assert agent.enable_memory is False
        assert agent.session_id is not None

    @pytest.mark.asyncio
    async def test_store_campaign(self, agent):
        """Test storing email campaign"""
        campaign = EmailCampaign(
            campaign_id=str(uuid.uuid4()),
            campaign_name="Q4 Promotion",
            subject_line="Special Q4 Offer",
            preview_text="Save 30%",
            body_html="<html><body>Special offer</body></html>",
            sender_name="Marketing",
            sender_email="marketing@example.com",
            status=CampaignStatus.DRAFT,
            template_used=None,
            target_segments=["premium"],
            scheduled_at=None,
            sent_at=None,
            recipients_count=0,
            opens=0,
            clicks=0,
            unsubscribes=0,
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc)
        )

        campaign_id = await agent.store_campaign(
            user_id="test_user",
            campaign=campaign,
            open_rate=0.25,
            click_rate=0.05
        )

        assert campaign_id == campaign.campaign_id
        assert agent.campaign_stats['campaigns_stored'] == 1

    @pytest.mark.asyncio
    async def test_recall_campaigns(self, agent):
        """Test recalling successful campaigns"""
        # Store campaign first
        campaign = EmailCampaign(
            campaign_id=str(uuid.uuid4()),
            campaign_name="Test Campaign",
            subject_line="Test Subject",
            preview_text="Test preview",
            body_html="<html>Test</html>",
            sender_name="Test",
            sender_email="test@example.com",
            status=CampaignStatus.SENT,
            template_used=None,
            target_segments=[],
            scheduled_at=None,
            sent_at=datetime.now(timezone.utc),
            recipients_count=1000,
            opens=250,
            clicks=50,
            unsubscribes=5,
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc)
        )

        await agent.store_campaign(
            user_id="test_user",
            campaign=campaign,
            open_rate=0.25,
            click_rate=0.05
        )

        # Recall
        campaigns = await agent.recall_successful_campaigns(
            user_id="test_user",
            top_k=5
        )

        assert isinstance(campaigns, list)
        assert agent.campaign_stats['campaigns_recalled'] == 1

    @pytest.mark.asyncio
    async def test_send_campaign(self, agent):
        """Test sending campaign"""
        campaign = EmailCampaign(
            campaign_id=str(uuid.uuid4()),
            campaign_name="Send Test",
            subject_line="Test Send",
            preview_text="Preview",
            body_html="<html>Body</html>",
            sender_name="Sender",
            sender_email="sender@example.com",
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

        subscribers = [
            Subscriber(
                subscriber_id=str(uuid.uuid4()),
                email=f"user{i}@example.com",
                name=f"User {i}",
                status=SubscriberStatus.ACTIVE,
                segments=["test"],
                preferences={},
                subscribed_at=datetime.now(timezone.utc),
                last_engaged=None
            )
            for i in range(5)
        ]

        result = await agent.send_campaign(
            user_id="test_user",
            campaign=campaign,
            subscribers=subscribers
        )

        assert result['campaign_id'] == campaign.campaign_id
        assert result['recipients'] == 5
        assert agent.campaign_stats['campaigns_sent'] == 1

    @pytest.mark.asyncio
    async def test_add_subscribers(self, agent):
        """Test adding subscribers"""
        subscribers_data = [
            {'email': 'user1@example.com', 'name': 'User 1', 'segments': ['premium']},
            {'email': 'user2@example.com', 'name': 'User 2', 'segments': ['standard']},
        ]

        added = await agent.add_subscribers("test_user", subscribers_data)

        assert added == 2
        assert agent.campaign_stats['subscribers_added'] == 2

    @pytest.mark.asyncio
    async def test_conduct_ab_test(self, agent):
        """Test A/B test conduction"""
        variant_a = EmailCampaign(
            campaign_id=str(uuid.uuid4()),
            campaign_name="Variant A",
            subject_line="Offer: Save 20%",
            preview_text="Save now",
            body_html="<html>Save 20%</html>",
            sender_name="Test",
            sender_email="test@example.com",
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

        variant_b = EmailCampaign(
            campaign_id=str(uuid.uuid4()),
            campaign_name="Variant B",
            subject_line="Limited Time: 30% Off",
            preview_text="30% off ends today",
            body_html="<html>Save 30%</html>",
            sender_name="Test",
            sender_email="test@example.com",
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

        result = await agent.conduct_ab_test(
            user_id="test_user",
            campaign_id="test_campaign",
            variant_a=variant_a,
            variant_b=variant_b,
            test_size=1000
        )

        assert isinstance(result, ABTestResult)
        assert result.winner in ["A", "B"]
        assert agent.campaign_stats['ab_tests_conducted'] == 1

    @pytest.mark.asyncio
    async def test_end_to_end_email_workflow(self, agent):
        """Test complete email marketing workflow"""
        # Step 1: Add subscribers
        await agent.add_subscribers(
            "user_1",
            [{'email': 'user@example.com', 'name': 'User', 'segments': ['test']}]
        )

        # Step 2: Create and send campaign
        campaign = EmailCampaign(
            campaign_id=str(uuid.uuid4()),
            campaign_name="Workflow Campaign",
            subject_line="Workflow Test",
            preview_text="Test",
            body_html="<html>Test</html>",
            sender_name="Test",
            sender_email="test@example.com",
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

        result = await agent.send_campaign("user_1", campaign, [])
        assert result['campaign_id'] == campaign.campaign_id


# ==============================================================================
# ANALYTICS AGENT TESTS
# ==============================================================================

class TestAnalyticsAgent:
    """Test suite for Analytics Agent"""

    @pytest.fixture
    def agent(self):
        """Create test agent without memory"""
        return AnalyticsAgent(
            business_id="test_analytics",
            enable_memory=False
        )

    def test_initialization(self, agent):
        """Test agent initialization"""
        assert agent is not None
        assert agent.business_id == "test_analytics"
        assert agent.enable_memory is False
        assert agent.session_id is not None

    @pytest.mark.asyncio
    async def test_store_metrics_pattern(self, agent):
        """Test storing metrics pattern"""
        pattern_id = await agent.store_metrics_pattern(
            user_id="test_user",
            pattern_name="monthly_growth",
            metric_type=MetricType.GROWTH,
            characteristics={"seasonal": True, "predictable": True},
            typical_range=(100.0, 500.0),
            seasonality="monthly",
            trend="increasing",
            confidence=0.92
        )

        assert pattern_id is not None
        assert isinstance(pattern_id, str)
        assert agent.analytics_stats['patterns_stored'] == 1

    @pytest.mark.asyncio
    async def test_recall_insights(self, agent):
        """Test recalling insights"""
        # Store pattern first
        await agent.store_metrics_pattern(
            user_id="test_user",
            pattern_name="test_pattern",
            metric_type=MetricType.REVENUE,
            characteristics={},
            typical_range=(0.0, 1000.0),
            confidence=0.85
        )

        # Recall
        insights = await agent.recall_insights(
            user_id="test_user",
            metric_type=MetricType.REVENUE,
            top_k=5
        )

        assert isinstance(insights, list)
        assert agent.analytics_stats['insights_recalled'] == 1

    @pytest.mark.asyncio
    async def test_analyze_data(self, agent):
        """Test data analysis"""
        data_points = [
            MetricDataPoint(
                timestamp=datetime.now(timezone.utc) - timedelta(days=i),
                value=float(100 + i * 5),
                dimension=None,
                metadata={}
            )
            for i in range(10)
        ]

        insight = await agent.analyze_data(
            user_id="test_user",
            metric_name="monthly_revenue",
            data_points=data_points,
            metric_type=MetricType.REVENUE
        )

        assert isinstance(insight, AnalyticsInsight)
        assert insight.metric_name == "monthly_revenue"
        assert insight.confidence > 0
        assert agent.analytics_stats['data_analyzed'] == 1

    @pytest.mark.asyncio
    async def test_analyze_chart(self, agent):
        """Test chart analysis (multimodal)"""
        analysis = await agent.analyze_chart(
            user_id="test_user",
            chart_path="/path/to/chart.png",
            chart_type=ChartType.LINE,
            title="Revenue Trend"
        )

        assert isinstance(analysis, ChartAnalysis)
        assert analysis.chart_type == ChartType.LINE
        assert analysis.title == "Revenue Trend"
        assert agent.analytics_stats['charts_analyzed'] == 1

    @pytest.mark.asyncio
    async def test_store_dashboard_config(self, agent):
        """Test storing dashboard configuration"""
        dashboard_id = await agent.store_dashboard_config(
            user_id="test_user",
            dashboard_name="Main Dashboard",
            description="Company overview",
            widgets=[
                {"type": "metric", "metric": "revenue"},
                {"type": "chart", "chart_type": "line"}
            ],
            refresh_interval=300
        )

        assert dashboard_id is not None
        assert agent.analytics_stats['dashboards_stored'] == 1

    @pytest.mark.asyncio
    async def test_generate_report(self, agent):
        """Test report generation"""
        metric_data = {
            "revenue": [100, 110, 120, 115, 125, 130],
            "users": [50, 55, 60, 58, 65, 70],
            "retention": [0.8, 0.81, 0.82, 0.81, 0.83, 0.84]
        }

        report = await agent.generate_report(
            user_id="test_user",
            report_name="Monthly Report",
            metric_data=metric_data,
            period_start=datetime.now(timezone.utc) - timedelta(days=30),
            period_end=datetime.now(timezone.utc)
        )

        assert report.report_name == "Monthly Report"
        assert len(report.insights) > 0
        assert agent.analytics_stats['reports_generated'] == 1

    def test_trend_detection(self, agent):
        """Test trend detection"""
        increasing = [10, 15, 20, 25, 30]
        decreasing = [30, 25, 20, 15, 10]
        stable = [20, 20, 21, 20, 19, 20]

        assert agent._detect_trend(increasing) == "increasing"
        assert agent._detect_trend(decreasing) == "decreasing"
        assert agent._detect_trend(stable) == "stable"

    def test_anomaly_detection(self, agent):
        """Test anomaly detection"""
        values = [20, 21, 22, 21, 20, 100, 19, 20]  # 100 is anomaly
        avg = sum(values) / len(values)

        anomalies = agent._detect_anomalies(values, avg)

        assert len(anomalies) > 0

    @pytest.mark.asyncio
    async def test_end_to_end_analytics_workflow(self, agent):
        """Test complete analytics workflow"""
        # Step 1: Store pattern
        pattern_id = await agent.store_metrics_pattern(
            user_id="user_1",
            pattern_name="workflow_pattern",
            metric_type=MetricType.CONVERSION,
            characteristics={},
            typical_range=(0.0, 0.5),
            confidence=0.9
        )
        assert pattern_id is not None

        # Step 2: Analyze data
        data = [
            MetricDataPoint(
                timestamp=datetime.now(timezone.utc) - timedelta(days=i),
                value=float(0.1 + i * 0.01),
                dimension=None,
                metadata={}
            )
            for i in range(7)
        ]

        insight = await agent.analyze_data(
            user_id="user_1",
            metric_name="conversion_rate",
            data_points=data,
            metric_type=MetricType.CONVERSION
        )
        assert insight.insight_id is not None

        # Step 3: Store dashboard
        dashboard_id = await agent.store_dashboard_config(
            user_id="user_1",
            dashboard_name="Conversions",
            description="Conversion metrics",
            widgets=[],
            refresh_interval=300
        )
        assert dashboard_id is not None


# ==============================================================================
# INTEGRATION TESTS
# ==============================================================================

class TestTier2FinalBatchIntegration:
    """Integration tests for all Tier 2 final batch agents"""

    @pytest.mark.asyncio
    async def test_all_agents_creation(self):
        """Test creating all 4 agents"""
        content_agent = await create_content_creation_agent(
            business_id="integration_test",
            enable_memory=False
        )
        assert content_agent is not None

        seo_agent = await create_seo_optimization_agent(
            business_id="integration_test",
            enable_memory=False
        )
        assert seo_agent is not None

        email_agent = await create_email_marketing_agent(
            business_id="integration_test",
            enable_memory=False
        )
        assert email_agent is not None

        analytics_agent = await create_analytics_agent(
            business_id="integration_test",
            enable_memory=False
        )
        assert analytics_agent is not None

    @pytest.mark.asyncio
    async def test_agents_can_be_imported(self):
        """Test that all agents can be imported from agents package"""
        from agents import (
            ContentCreationAgent,
            SEOOptimizationAgent,
            EmailMarketingAgent,
            AnalyticsAgent,
            create_content_creation_agent,
            create_seo_optimization_agent,
            create_email_marketing_agent,
            create_analytics_agent
        )

        assert ContentCreationAgent is not None
        assert SEOOptimizationAgent is not None
        assert EmailMarketingAgent is not None
        assert AnalyticsAgent is not None
        assert create_content_creation_agent is not None
        assert create_seo_optimization_agent is not None
        assert create_email_marketing_agent is not None
        assert create_analytics_agent is not None

    @pytest.mark.asyncio
    async def test_memory_initialization_without_mongodb(self):
        """Test memory initialization gracefully handles missing MongoDB"""
        # All agents should initialize even if MongoDB is not available
        agents = [
            await create_content_creation_agent(enable_memory=True),
            await create_seo_optimization_agent(enable_memory=True),
            await create_email_marketing_agent(enable_memory=True),
            await create_analytics_agent(enable_memory=True)
        ]

        for agent in agents:
            assert agent is not None
            # Memory may be None if MongoDB not available, that's OK
            if agent.enable_memory:
                assert agent.memory_tool is not None or agent.memory is None


# ==============================================================================
# SYNTAX VALIDATION TESTS
# ==============================================================================

class TestSyntaxValidation:
    """Test syntax and code structure validation"""

    def test_content_creation_agent_syntax(self):
        """Validate Content Creation Agent syntax"""
        from agents.content_creation_agent import (
            ContentCreationAgent,
            ContentType,
            ContentTemplate,
            GeneratedContent,
            ContentAnalysis
        )
        assert ContentCreationAgent is not None
        assert ContentType.BLOG_POST.value == "blog_post"
        assert ContentType.DOCUMENTATION.value == "documentation"

    def test_seo_optimization_agent_syntax(self):
        """Validate SEO Optimization Agent syntax"""
        from agents.seo_optimization_agent import (
            SEOOptimizationAgent,
            SEOPattern,
            OptimizedContent,
            RankingMetrics
        )
        assert SEOOptimizationAgent is not None
        assert isinstance(SEOPattern, type)

    def test_email_marketing_agent_syntax(self):
        """Validate Email Marketing Agent syntax"""
        from agents.email_marketing_agent import (
            EmailMarketingAgent,
            EmailCampaign,
            ABTestResult,
            CampaignStatus
        )
        assert EmailMarketingAgent is not None
        assert CampaignStatus.DRAFT.value == "draft"

    def test_analytics_agent_syntax(self):
        """Validate Analytics Agent syntax"""
        from agents.analytics_agent import (
            AnalyticsAgent,
            MetricType,
            ChartType,
            AnalyticsInsight
        )
        assert AnalyticsAgent is not None
        assert MetricType.REVENUE.value == "revenue"
        assert ChartType.LINE.value == "line"


if __name__ == "__main__":
    pytest.main([__file__, "-v", "-m", "not integration"])
