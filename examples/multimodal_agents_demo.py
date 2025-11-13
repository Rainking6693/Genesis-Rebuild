"""
Multimodal Agents Integration Demo
===================================

Demonstrates:
1. GeminiComputerUseAgent - Vision-powered desktop automation
2. MarketingAgentMultimodal - AligNet-enabled visual QA

Features:
- Parallel agent initialization
- Vision API integration
- AligNet visual similarity analysis
- Memory-enabled pattern learning
- Comprehensive workflow examples

Run with: python examples/multimodal_agents_demo.py
"""

import asyncio
import logging
from datetime import datetime
from pathlib import Path
from typing import Dict, Any

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


async def demo_computer_use_agent():
    """Demonstrate Gemini Computer Use Agent capabilities"""
    logger.info("=" * 80)
    logger.info("GEMINI COMPUTER USE AGENT DEMO")
    logger.info("=" * 80)

    from agents.gemini_computer_use_agent import create_computer_use_agent

    # Create agent with memory enabled
    agent = await create_computer_use_agent(enable_memory=True)
    logger.info("Computer Use Agent initialized")

    # Simulate workflow
    logger.info("\n[WORKFLOW] Simulating desktop automation workflow...\n")

    # 1. Process a screenshot
    logger.info("Step 1: Processing screenshot for UI understanding")
    try:
        # Create mock screenshot path (in real scenario, this would be an actual screenshot)
        mock_screenshot = "/tmp/mock_screenshot.png"
        understanding = await agent.process_screenshot(
            mock_screenshot,
            context_prompt="Analyze this screenshot for interactive elements"
        )
        logger.info(f"  - Screenshot analyzed: {len(understanding.detected_elements)} elements detected")
        logger.info(f"  - Confidence: {understanding.confidence:.2f}")
    except Exception as e:
        logger.warning(f"  - Screenshot processing demo (expected in test env): {e}")

    # 2. Understand UI elements
    logger.info("\nStep 2: Understanding UI elements")
    try:
        ui_info = await agent.understand_ui_elements(mock_screenshot)
        logger.info(f"  - Clickable regions: {len(ui_info['clickable_regions'])}")
        logger.info(f"  - UI elements: {ui_info['element_count']}")
    except Exception as e:
        logger.warning(f"  - UI analysis (expected in test env)")

    # 3. Store action patterns
    logger.info("\nStep 3: Storing action patterns in memory")
    patterns_stored = 0
    for i in range(3):
        action_type = ["click", "type", "scroll"][i]
        await agent.store_action_pattern(
            action_name=f"action_{i}",
            screenshot_path=mock_screenshot,
            element_description=f"Element {i}",
            action_type=action_type,
            success=True,
            scope="app"
        )
        patterns_stored += 1
    logger.info(f"  - Stored {patterns_stored} action patterns")

    # 4. Recall successful actions
    logger.info("\nStep 4: Recalling successful action patterns")
    recalled_patterns = await agent.recall_successful_actions(
        action_type="click",
        min_success_rate=0.7,
        scope="app"
    )
    logger.info(f"  - Recalled {len(recalled_patterns)} successful click patterns")

    # 5. Get interaction suggestions
    logger.info("\nStep 5: Getting AI suggestions for automation")
    try:
        suggestions = await agent.get_interaction_suggestions(
            mock_screenshot,
            task_description="Fill in login credentials and submit"
        )
        logger.info(f"  - Task: {suggestions['task']}")
        logger.info(f"  - Suggested elements: {len(suggestions['suggested_elements'])}")
    except Exception as e:
        logger.warning(f"  - Suggestions (expected in test env)")

    # 6. Display agent statistics
    logger.info("\nStep 6: Agent Statistics")
    stats = agent.get_agent_stats()
    logger.info(f"  - Actions Executed: {stats['actions_executed']}")
    logger.info(f"  - Patterns Learned: {stats['patterns_learned']}")
    logger.info(f"  - Memory Enabled: {stats['memory_enabled']}")
    logger.info(f"  - Memory Pipeline Stats: {stats['memory_pipeline_stats']}")

    logger.info("\nComputer Use Agent demo completed successfully!")
    return agent


async def demo_marketing_agent():
    """Demonstrate Marketing Agent with AligNet QA capabilities"""
    logger.info("\n" + "=" * 80)
    logger.info("MARKETING AGENT WITH ALIGNET QA DEMO")
    logger.info("=" * 80)

    from agents.marketing_agent_multimodal import (
        create_marketing_agent_multimodal,
        MarketingCampaign,
        VisualContent
    )

    # Create agent with memory enabled
    agent = await create_marketing_agent_multimodal(enable_memory=True)
    logger.info("Marketing Agent initialized with AligNet QA")

    # Simulate workflow
    logger.info("\n[WORKFLOW] Simulating marketing campaign workflow with visual QA...\n")

    # 1. Process marketing images
    logger.info("Step 1: Processing marketing images")
    mock_image = "/tmp/mock_hero_image.png"
    try:
        visual_content = await agent.process_marketing_image(
            mock_image,
            content_type="hero",
            brand_guidelines={"primary_color": "#0066cc", "style": "modern"}
        )
        logger.info(f"  - Image processed: {visual_content.content_type}")
        logger.info(f"  - Brand alignment: {visual_content.brand_alignment:.2f}")
        logger.info(f"  - Detected elements: {len(visual_content.detected_elements)}")
        logger.info(f"  - Color palette: {visual_content.color_palette}")
    except Exception as e:
        logger.warning(f"  - Image processing (expected in test env)")

    # 2. Audit visual content with AligNet
    logger.info("\nStep 2: Auditing visual content with AligNet")
    try:
        audit_report = await agent.audit_visual_content(
            [mock_image],
            brand_guidelines={"primary_color": "#0066cc"}
        )
        logger.info(f"  - Audit ID: {audit_report['audit_id']}")
        logger.info(f"  - Images audited: {audit_report['images_audited']}")
        alignet_result = audit_report['alignet_analysis']
        logger.info(f"  - Brand compliance: {alignet_result['overall_compliance']:.2f}")
        logger.info(f"  - Uncertainty score: {alignet_result['uncertainty_score']:.2f}")
        logger.info(f"  - Escalation needed: {audit_report['escalation_needed']}")
        if audit_report['escalation_needed']:
            logger.info(f"  - Reason: {audit_report['escalation_reason']}")
    except Exception as e:
        logger.warning(f"  - Audit (expected in test env)")

    # 3. Create and store campaign patterns
    logger.info("\nStep 3: Creating and storing marketing campaigns")
    campaigns_created = 0
    campaign_types = ["hero_image", "social_media", "email"]

    for i, camp_type in enumerate(campaign_types):
        try:
            visual_content = VisualContent(
                image_path=f"{mock_image}_{i}",
                content_type=camp_type,
                brand_alignment=0.8 + (i * 0.05),
                visual_description=f"{camp_type} content",
                detected_elements=["button", "text", "image"],
                color_palette=["#0066cc", "#ffffff"],
                confidence=0.85
            )

            campaign = MarketingCampaign(
                campaign_id=f"camp_{i}",
                campaign_name=f"Campaign {i}",
                campaign_type=camp_type,
                brand_guidelines={"style": "modern"},
                visual_assets=[visual_content],
                brand_patterns=["modern", "minimalist"],
                user_preferences={"color": "blue"},
                created_at=datetime.now()
            )

            await agent.store_campaign(
                campaign,
                success=True,
                performance_metrics={"ctr": 0.08, "conversion": 0.03},
                scope="app"
            )
            campaigns_created += 1
        except Exception as e:
            logger.warning(f"  - Campaign creation (expected in test env)")

    logger.info(f"  - Campaigns created: {campaigns_created}")

    # 4. Recall successful campaigns
    logger.info("\nStep 4: Recalling successful campaign patterns")
    for camp_type in campaign_types:
        try:
            recalled = await agent.recall_campaigns(
                campaign_type=camp_type,
                min_success_rate=0.5,
                scope="app"
            )
            logger.info(f"  - {camp_type}: {len(recalled)} successful patterns")
        except Exception as e:
            logger.warning(f"  - Recall (expected in test env)")

    # 5. Display agent statistics
    logger.info("\nStep 5: Agent Statistics")
    stats = agent.get_agent_stats()
    logger.info(f"  - Campaigns Created: {stats['campaigns_created']}")
    logger.info(f"  - Audits Performed: {stats['audits_performed']}")
    logger.info(f"  - Memory Enabled: {stats['memory_enabled']}")
    logger.info(f"  - QA Engine Cache: {stats['qa_engine_cache_size']} analyses cached")
    logger.info(f"  - Memory Pipeline Stats: {stats['memory_pipeline_stats']}")

    logger.info("\nMarketing Agent demo completed successfully!")
    return agent


async def demo_parallel_operations():
    """Demonstrate parallel operations of both agents"""
    logger.info("\n" + "=" * 80)
    logger.info("PARALLEL MULTIMODAL AGENTS DEMO")
    logger.info("=" * 80)
    logger.info("\nInitializing both agents in parallel...")

    from agents.gemini_computer_use_agent import create_computer_use_agent
    from agents.marketing_agent_multimodal import create_marketing_agent_multimodal

    # Initialize both agents in parallel
    start_time = datetime.now()

    computer_agent, marketing_agent = await asyncio.gather(
        create_computer_use_agent(enable_memory=True),
        create_marketing_agent_multimodal(enable_memory=True)
    )

    init_time = (datetime.now() - start_time).total_seconds()
    logger.info(f"Both agents initialized in {init_time:.2f} seconds")

    # Run concurrent operations
    logger.info("\nRunning concurrent operations on both agents...")

    mock_screenshot = "/tmp/screenshot.png"
    mock_image = "/tmp/marketing.png"

    start_time = datetime.now()

    results = await asyncio.gather(
        computer_agent.understand_ui_elements(mock_screenshot),
        marketing_agent.process_marketing_image(mock_image, content_type="hero"),
        return_exceptions=True
    )

    exec_time = (datetime.now() - start_time).total_seconds()

    logger.info(f"Concurrent operations completed in {exec_time:.2f} seconds")
    logger.info(f"  - Computer agent result: {type(results[0]).__name__}")
    logger.info(f"  - Marketing agent result: {type(results[1]).__name__}")

    logger.info("\nParallel agents demo completed successfully!")


async def demo_alignet_qe_workflow():
    """Detailed AligNet QA workflow demonstration"""
    logger.info("\n" + "=" * 80)
    logger.info("ALIGNET QA WORKFLOW DEMO")
    logger.info("=" * 80)
    logger.info("\nDemonstrating AligNet visual similarity and uncertainty scoring...\n")

    from agents.marketing_agent_multimodal import AligNetQAEngine

    qa_engine = AligNetQAEngine(uncertainty_threshold=0.6)
    logger.info(f"AligNet QA Engine initialized (uncertainty_threshold: 0.6)")

    # Simulate multiple images for analysis
    images = [
        "/tmp/hero_v1.png",
        "/tmp/hero_v2.png",
        "/tmp/hero_v3.png"
    ]

    logger.info(f"\nAnalyzing {len(images)} images for visual similarity...")

    try:
        analysis = await qa_engine.analyze_visual_similarity(
            images,
            context="brand_alignment"
        )

        logger.info(f"\nAligNet Analysis Results:")
        logger.info(f"  - Primary image: {Path(analysis.image_path).name}")
        logger.info(f"  - Similarity scores: {len(analysis.similarity_scores)} pairs analyzed")
        logger.info(f"  - Odd-one-out: {analysis.odd_one_out or 'None'}")
        logger.info(f"  - Uncertainty score: {analysis.uncertainty_score:.3f}")
        logger.info(f"  - Brand compliance: {analysis.brand_compliance:.2f}")
        logger.info(f"  - Requires human review: {analysis.requires_human_review}")

        logger.info(f"\nRecommendations:")
        for i, rec in enumerate(analysis.recommendations, 1):
            logger.info(f"  {i}. {rec}")

    except Exception as e:
        logger.warning(f"AligNet analysis (expected in test env): {e}")

    logger.info("\nAligNet QA workflow demo completed successfully!")


async def main():
    """Run all demos"""
    logger.info("\n" + "=" * 80)
    logger.info("MULTIMODAL AGENTS COMPREHENSIVE INTEGRATION DEMO")
    logger.info("=" * 80)
    logger.info(f"Started at: {datetime.now().isoformat()}")

    try:
        # Run Computer Use Agent demo
        computer_agent = await demo_computer_use_agent()

        # Run Marketing Agent demo
        marketing_agent = await demo_marketing_agent()

        # Run parallel operations demo
        await demo_parallel_operations()

        # Run AligNet QA workflow demo
        await demo_alignet_qe_workflow()

        # Final summary
        logger.info("\n" + "=" * 80)
        logger.info("DEMO SUMMARY")
        logger.info("=" * 80)

        logger.info("\nAgent Implementations:")
        logger.info("  1. GeminiComputerUseAgent")
        logger.info("     - Vision API for screenshot understanding")
        logger.info("     - Action pattern memory (app/user namespaces)")
        logger.info("     - Multimodal memory pipeline")
        logger.info("     - Supports: process_screenshot, store_action_pattern, recall_actions")

        logger.info("\n  2. MarketingAgentMultimodal")
        logger.info("     - Vision API for image analysis")
        logger.info("     - AligNet QA for visual similarity")
        logger.info("     - Campaign pattern memory")
        logger.info("     - Uncertainty scoring & human escalation")
        logger.info("     - Supports: process_marketing_image, audit_visual_content, store_campaign")

        logger.info("\nKey Features:")
        logger.info("  - enable_memory=True for persistent state")
        logger.info("  - Multimodal memory pipelines with app/user scopes")
        logger.info("  - AligNet odd-one-out detection")
        logger.info("  - Concurrent parallel operations")
        logger.info("  - Comprehensive statistics and reporting")

        logger.info(f"\nCompleted at: {datetime.now().isoformat()}")
        logger.info("=" * 80)

    except Exception as e:
        logger.error(f"Demo failed: {e}", exc_info=True)
        raise


if __name__ == "__main__":
    asyncio.run(main())
