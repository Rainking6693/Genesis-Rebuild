#!/usr/bin/env python3
"""
Quick Business Generation - Start Genesis and populate dashboard with real data
"""
import asyncio
import logging
from datetime import datetime

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(message)s')
logger = logging.getLogger(__name__)

async def generate_quick_business():
    """Generate a single business to populate dashboard"""
    logger.info("="*70)
    logger.info("GENESIS QUICK START - GENERATING BUSINESS")
    logger.info("="*70)

    try:
        # Import business generation agent
        from agents.business_generation_agent import BusinessGenerationAgent

        logger.info("\n📊 Step 1: Initializing Business Generation Agent...")
        biz_agent = await BusinessGenerationAgent.create(
            business_id=f"quick_test_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
            enable_memory=True
        )

        logger.info("✓ Agent initialized\n")

        logger.info("💡 Step 2: Generating business idea...")
        idea = await biz_agent.generate_idea_with_memory(
            business_type="saas",  # SaaS business
            min_revenue_score=50,
            user_id="dashboard_user",
            learn_from_past=False  # First run
        )

        logger.info(f"\n✓ Business Generated:")
        logger.info(f"  Name: {idea.name}")
        logger.info(f"  Type: {idea.business_type}")
        logger.info(f"  Score: {idea.overall_score:.1f}/100")
        logger.info(f"  Description: {getattr(idea, 'description', 'N/A')}")

        logger.info("\n" + "="*70)
        logger.info("✅ SUCCESS! Business generated")
        logger.info("="*70)
        logger.info("\n📊 Your dashboard will now show:")
        logger.info("  • 1 Active Business")
        logger.info("  • LLM costs from API calls")
        logger.info("  • Agent activity logs")
        logger.info("\n🌐 View at: https://rainking632.pythonanywhere.com/")
        logger.info("   (Refresh the page to see updated metrics)")
        logger.info("="*70)

        return idea

    except Exception as e:
        logger.error(f"\n✗ Error: {e}")
        import traceback
        traceback.print_exc()
        raise

if __name__ == "__main__":
    asyncio.run(generate_quick_business())
