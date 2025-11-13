"""
Comprehensive Tests for Multimodal Agents
==========================================

Tests for:
1. GeminiComputerUseAgent - Vision API, screenshot processing, action learning
2. MarketingAgentMultimodal - AligNet QA, visual auditing, campaign memory

Version: 1.0
Created: November 13, 2025
"""

import pytest
import asyncio
import tempfile
from pathlib import Path
from datetime import datetime
from PIL import Image
import sys

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from agents.gemini_computer_use_agent import (
    GeminiComputerUseAgent,
    MultimodalMemoryPipeline,
    ScreenUnderstanding,
    create_computer_use_agent
)

from agents.marketing_agent_multimodal import (
    MarketingAgentMultimodal,
    AligNetQAEngine,
    MultimodalMarketingMemoryPipeline,
    VisualContent,
    MarketingCampaign,
    CampaignPattern,
    create_marketing_agent_multimodal
)


# ============================================================================
# Fixtures for Test Images
# ============================================================================

@pytest.fixture
def sample_screenshot():
    """Create a sample screenshot for testing"""
    with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as f:
        img = Image.new("RGB", (800, 600), color=(73, 109, 137))
        img.save(f.name)
        yield f.name
    Path(f.name).unlink()


@pytest.fixture
def sample_marketing_image():
    """Create a sample marketing image"""
    with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as f:
        img = Image.new("RGB", (1200, 600), color=(255, 107, 107))
        img.save(f.name)
        yield f.name
    Path(f.name).unlink()


@pytest.fixture
def multiple_marketing_images():
    """Create multiple marketing images for consistency testing"""
    images = []
    colors = [(255, 107, 107), (76, 205, 196), (69, 183, 209)]

    for color in colors:
        with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as f:
            img = Image.new("RGB", (1200, 600), color=color)
            img.save(f.name)
            images.append(f.name)

    yield images

    for img_path in images:
        Path(img_path).unlink()


# ============================================================================
# Tests for GeminiComputerUseAgent
# ============================================================================

class TestGeminiComputerUseAgent:
    """Test suite for Gemini Computer Use Agent"""

    @pytest.mark.asyncio
    async def test_agent_initialization(self):
        """Test agent initialization with memory enabled"""
        agent = await create_computer_use_agent(enable_memory=True)
        assert agent is not None
        assert agent.enable_memory is True
        assert agent.memory_pipeline is not None
        assert agent.actions_executed == 0
        assert agent.patterns_learned == 0

    @pytest.mark.asyncio
    async def test_agent_initialization_memory_disabled(self):
        """Test agent initialization with memory disabled"""
        agent = await create_computer_use_agent(enable_memory=False)
        assert agent.enable_memory is False

    @pytest.mark.asyncio
    async def test_process_screenshot_with_file(self, sample_screenshot):
        """Test screenshot processing with valid file"""
        agent = await create_computer_use_agent(enable_memory=True)
        understanding = await agent.process_screenshot(
            sample_screenshot,
            context_prompt="Analyze this screenshot"
        )

        assert understanding is not None
        assert understanding.screenshot_path == sample_screenshot
        assert isinstance(understanding.detected_elements, list)
        assert isinstance(understanding.clickable_regions, list)
        assert 0 <= understanding.confidence <= 1

    @pytest.mark.asyncio
    async def test_process_screenshot_missing_file(self):
        """Test screenshot processing with missing file"""
        agent = await create_computer_use_agent(enable_memory=True)
        understanding = await agent.process_screenshot(
            "/nonexistent/screenshot.png"
        )

        # Should return mock understanding instead of failing
        assert understanding is not None
        assert understanding.confidence > 0

    @pytest.mark.asyncio
    async def test_store_action_pattern(self, sample_screenshot):
        """Test storing action patterns in memory"""
        agent = await create_computer_use_agent(enable_memory=True)

        await agent.store_action_pattern(
            action_name="click_button",
            screenshot_path=sample_screenshot,
            element_description="Submit button",
            action_type="click",
            success=True,
            scope="app"
        )

        stats = agent.get_agent_stats()
        assert stats["patterns_learned"] == 1

    @pytest.mark.asyncio
    async def test_recall_successful_actions(self, sample_screenshot):
        """Test recalling successful action patterns"""
        agent = await create_computer_use_agent(enable_memory=True)

        # Store multiple patterns
        for i in range(3):
            await agent.store_action_pattern(
                action_name=f"action_{i}",
                screenshot_path=sample_screenshot,
                element_description=f"Element {i}",
                action_type="click",
                success=i < 2,  # First 2 succeed
                scope="app"
            )

        # Recall successful patterns
        patterns = await agent.recall_successful_actions(
            action_type="click",
            min_success_rate=0.7,
            scope="app"
        )

        assert len(patterns) >= 1
        assert all(p["action_type"] == "click" for p in patterns)

    @pytest.mark.asyncio
    async def test_understand_ui_elements(self, sample_screenshot):
        """Test UI element understanding"""
        agent = await create_computer_use_agent(enable_memory=True)
        ui_info = await agent.understand_ui_elements(sample_screenshot)

        assert "screenshot_path" in ui_info
        assert "clickable_regions" in ui_info
        assert "text_content" in ui_info
        assert "layout_structure" in ui_info
        assert ui_info["element_count"] >= 0

    @pytest.mark.asyncio
    async def test_get_interaction_suggestions(self, sample_screenshot):
        """Test getting interaction suggestions"""
        agent = await create_computer_use_agent(enable_memory=True)
        suggestions = await agent.get_interaction_suggestions(
            sample_screenshot,
            task_description="Fill in the login form"
        )

        assert "task" in suggestions
        assert suggestions["task"] == "Fill in the login form"
        assert "ui_description" in suggestions
        assert "suggested_elements" in suggestions
        assert suggestions["memory_enabled"] is True

    @pytest.mark.asyncio
    async def test_execute_action(self, sample_screenshot):
        """Test executing and learning from actions"""
        agent = await create_computer_use_agent(enable_memory=True)

        result = await agent.execute_action(
            action_type="click",
            target_element={"type": "button", "description": "Submit"},
            screenshot_path=sample_screenshot,
            success=True
        )

        assert result["success"] is True
        assert result["pattern_learned"] is True
        stats = agent.get_agent_stats()
        assert stats["actions_executed"] == 1
        assert stats["patterns_learned"] == 1

    @pytest.mark.asyncio
    async def test_multimodal_memory_pipeline(self):
        """Test multimodal memory pipeline"""
        pipeline = MultimodalMemoryPipeline()

        # Store patterns in app namespace
        await pipeline.store_action_pattern(
            action_name="type_text",
            screenshot_hash="abc123",
            element_description="Input field",
            action_type="type",
            success=True,
            scope="app"
        )

        # Recall patterns
        patterns = await pipeline.recall_successful_actions(
            action_type="type",
            min_success_rate=0.5,
            scope="app"
        )

        assert len(patterns) == 1
        assert patterns[0].action_name == "type_text"

    @pytest.mark.asyncio
    async def test_memory_disabled_no_storage(self, sample_screenshot):
        """Test that patterns are not stored when memory is disabled"""
        agent = await create_computer_use_agent(enable_memory=False)

        await agent.store_action_pattern(
            action_name="click",
            screenshot_path=sample_screenshot,
            element_description="Button",
            action_type="click",
            success=True
        )

        patterns = await agent.recall_successful_actions(
            action_type="click"
        )

        assert len(patterns) == 0

    @pytest.mark.asyncio
    async def test_agent_stats(self, sample_screenshot):
        """Test agent statistics reporting"""
        agent = await create_computer_use_agent(enable_memory=True)

        await agent.execute_action(
            action_type="click",
            target_element={"type": "button"},
            screenshot_path=sample_screenshot,
            success=True
        )

        stats = agent.get_agent_stats()
        assert stats["agent_name"] == "GeminiComputerUseAgent"
        assert stats["actions_executed"] == 1
        assert stats["patterns_learned"] == 1
        assert stats["memory_enabled"] is True
        assert stats["memory_pipeline_stats"] is not None


# ============================================================================
# Tests for MarketingAgentMultimodal
# ============================================================================

class TestMarketingAgentMultimodal:
    """Test suite for Marketing Agent Multimodal"""

    @pytest.mark.asyncio
    async def test_agent_initialization(self):
        """Test marketing agent initialization"""
        agent = await create_marketing_agent_multimodal(enable_memory=True)
        assert agent is not None
        assert agent.enable_memory is True
        assert agent.memory_pipeline is not None
        assert agent.qa_engine is not None
        assert agent.campaigns_created == 0
        assert agent.audits_performed == 0

    @pytest.mark.asyncio
    async def test_process_marketing_image(self, sample_marketing_image):
        """Test marketing image processing"""
        agent = await create_marketing_agent_multimodal(enable_memory=True)

        visual_content = await agent.process_marketing_image(
            sample_marketing_image,
            content_type="hero",
            brand_guidelines={"color_scheme": "blue"}
        )

        assert visual_content is not None
        assert visual_content.image_path == sample_marketing_image
        assert visual_content.content_type == "hero"
        assert isinstance(visual_content.detected_elements, list)
        assert isinstance(visual_content.color_palette, list)
        assert 0 <= visual_content.brand_alignment <= 1
        assert 0 <= visual_content.confidence <= 1

    @pytest.mark.asyncio
    async def test_audit_visual_content(self, multiple_marketing_images):
        """Test visual content auditing with AligNet"""
        agent = await create_marketing_agent_multimodal(enable_memory=True)

        audit_report = await agent.audit_visual_content(
            multiple_marketing_images,
            brand_guidelines={"style": "modern", "primary_color": "#0066cc"}
        )

        assert "audit_id" in audit_report
        assert "timestamp" in audit_report
        assert "images_audited" in audit_report
        assert audit_report["images_audited"] == len(multiple_marketing_images)
        assert "alignet_analysis" in audit_report
        assert "escalation_needed" in audit_report
        assert isinstance(audit_report["escalation_needed"], bool)

        stats = agent.get_agent_stats()
        assert stats["audits_performed"] == 1

    @pytest.mark.asyncio
    async def test_store_and_recall_campaign(self, sample_marketing_image):
        """Test storing and recalling campaign patterns"""
        agent = await create_marketing_agent_multimodal(enable_memory=True)

        # Create visual content
        visual_content = await agent.process_marketing_image(
            sample_marketing_image,
            content_type="hero"
        )

        # Create campaign
        campaign = MarketingCampaign(
            campaign_id="camp_001",
            campaign_name="Spring Campaign",
            campaign_type="hero_image",
            brand_guidelines={"primary_color": "#FF6B6B"},
            visual_assets=[visual_content],
            brand_patterns=["modern", "minimal"],
            user_preferences={"style": "bold"},
            created_at=datetime.now()
        )

        # Store campaign
        await agent.store_campaign(
            campaign,
            success=True,
            performance_metrics={"ctr": 0.08, "conversion": 0.03},
            scope="app"
        )

        stats = agent.get_agent_stats()
        assert stats["campaigns_created"] == 1

        # Recall campaigns
        recalled = await agent.recall_campaigns(
            campaign_type="hero_image",
            min_success_rate=0.5,
            scope="app"
        )

        assert len(recalled) >= 1
        assert recalled[0]["campaign_name"] == "Spring Campaign"

    @pytest.mark.asyncio
    async def test_alignet_visual_similarity(self, multiple_marketing_images):
        """Test AligNet visual similarity analysis"""
        qa_engine = AligNetQAEngine(uncertainty_threshold=0.6)

        analysis = await qa_engine.analyze_visual_similarity(
            multiple_marketing_images,
            context="brand_alignment"
        )

        assert analysis is not None
        assert analysis.image_path == multiple_marketing_images[0]
        assert isinstance(analysis.similarity_scores, dict)
        assert 0 <= analysis.uncertainty_score <= 1
        assert 0 <= analysis.brand_compliance <= 1
        assert isinstance(analysis.recommendations, list)
        assert isinstance(analysis.requires_human_review, bool)

    @pytest.mark.asyncio
    async def test_alignet_odd_one_out_detection(self, multiple_marketing_images):
        """Test AligNet odd-one-out detection"""
        qa_engine = AligNetQAEngine()

        analysis = await qa_engine.analyze_visual_similarity(
            multiple_marketing_images,
            context="consistency"
        )

        # Analysis should provide odd-one-out if detected
        # (May be None if all images are similar)
        assert analysis.odd_one_out is None or isinstance(analysis.odd_one_out, str)

    @pytest.mark.asyncio
    async def test_alignet_uncertainty_scoring(self, multiple_marketing_images):
        """Test AligNet uncertainty scoring"""
        qa_engine = AligNetQAEngine(uncertainty_threshold=0.5)

        analysis = await qa_engine.analyze_visual_similarity(
            multiple_marketing_images,
            context="brand_audit"
        )

        # High uncertainty or low compliance should trigger review
        if analysis.uncertainty_score > qa_engine.uncertainty_threshold:
            assert analysis.requires_human_review is True

    @pytest.mark.asyncio
    async def test_marketing_memory_pipeline(self, sample_marketing_image):
        """Test marketing memory pipeline"""
        pipeline = MultimodalMarketingMemoryPipeline()

        visual_content = VisualContent(
            image_path=sample_marketing_image,
            content_type="hero",
            brand_alignment=0.85,
            visual_description="Hero image",
            detected_elements=["image", "text"],
            color_palette=["#FF6B6B"],
            confidence=0.9
        )

        campaign = MarketingCampaign(
            campaign_id="camp_test",
            campaign_name="Test Campaign",
            campaign_type="hero_image",
            brand_guidelines={},
            visual_assets=[visual_content],
            brand_patterns=["modern"],
            user_preferences={},
            created_at=datetime.now()
        )

        # Store campaign
        await pipeline.store_campaign(
            campaign,
            success=True,
            performance_metrics={"engagement": 0.7}
        )

        # Recall campaigns
        recalled = await pipeline.recall_campaigns(
            campaign_type="hero_image",
            min_success_rate=0.5
        )

        assert len(recalled) >= 1

    @pytest.mark.asyncio
    async def test_memory_disabled_marketing(self, sample_marketing_image):
        """Test that campaigns are not stored when memory is disabled"""
        agent = await create_marketing_agent_multimodal(enable_memory=False)

        visual_content = await agent.process_marketing_image(
            sample_marketing_image,
            content_type="hero"
        )

        campaign = MarketingCampaign(
            campaign_id="camp_001",
            campaign_name="Test",
            campaign_type="hero_image",
            brand_guidelines={},
            visual_assets=[visual_content],
            brand_patterns=[],
            user_preferences={},
            created_at=datetime.now()
        )

        await agent.store_campaign(campaign, success=True)

        recalled = await agent.recall_campaigns(
            campaign_type="hero_image"
        )

        assert len(recalled) == 0

    @pytest.mark.asyncio
    async def test_agent_stats(self, sample_marketing_image):
        """Test marketing agent statistics"""
        agent = await create_marketing_agent_multimodal(enable_memory=True)

        await agent.process_marketing_image(sample_marketing_image)
        audit_report = await agent.audit_visual_content([sample_marketing_image])

        stats = agent.get_agent_stats()
        assert stats["agent_name"] == "MarketingAgentMultimodal"
        assert stats["audits_performed"] == 1
        assert stats["memory_enabled"] is True
        assert stats["memory_pipeline_stats"] is not None


# ============================================================================
# Integration Tests
# ============================================================================

class TestMultiagentIntegration:
    """Integration tests for both agents working together"""

    @pytest.mark.asyncio
    async def test_parallel_agent_initialization(self):
        """Test initializing both agents in parallel"""
        computer_agent = await create_computer_use_agent(enable_memory=True)
        marketing_agent = await create_marketing_agent_multimodal(enable_memory=True)

        assert computer_agent is not None
        assert marketing_agent is not None
        assert computer_agent.enable_memory is True
        assert marketing_agent.enable_memory is True

    @pytest.mark.asyncio
    async def test_concurrent_operations(self, sample_screenshot, sample_marketing_image):
        """Test concurrent operations on both agents"""
        computer_agent = await create_computer_use_agent(enable_memory=True)
        marketing_agent = await create_marketing_agent_multimodal(enable_memory=True)

        # Run operations concurrently
        results = await asyncio.gather(
            computer_agent.process_screenshot(sample_screenshot),
            marketing_agent.process_marketing_image(sample_marketing_image)
        )

        assert len(results) == 2
        assert results[0] is not None  # Screenshot understanding
        assert results[1] is not None  # Visual content

    @pytest.mark.asyncio
    async def test_memory_isolation(self, sample_screenshot, sample_marketing_image):
        """Test that agent memories are properly isolated"""
        agent1 = await create_computer_use_agent(enable_memory=True)
        agent2 = await create_computer_use_agent(enable_memory=True)

        # Store pattern in agent1
        await agent1.store_action_pattern(
            action_name="unique_action_agent1",
            screenshot_path=sample_screenshot,
            element_description="Element",
            action_type="click",
            success=True
        )

        # Agent2 should not have this pattern
        patterns_agent2 = await agent2.recall_successful_actions(
            action_type="click"
        )

        # Agent2 has its own memory pipeline
        assert len(patterns_agent2) == 0


# ============================================================================
# Run Tests
# ============================================================================

if __name__ == "__main__":
    pytest.main([__file__, "-v", "-s"])
