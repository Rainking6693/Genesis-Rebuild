#!/usr/bin/env python3
"""
Generate ONE Complete Business - Full orchestration with all agents
Uses OmniDaemon + Genesis Meta Agent to build everything

Configuration: DeepSeek + Mistral ONLY (no Gemini, no Anthropic)
- Avoids Gemini quota limits (429 errors)
- Avoids Anthropic costs
- Uses cheap/free models for entire pipeline
"""
import asyncio
import logging
import json
import os
from datetime import datetime
from infrastructure.omnidaemon_bridge import get_bridge

# Configure to use ONLY DeepSeek and Mistral (cheap/free models)
os.environ["DAAO_EASY_MODEL"] = "deepseek/deepseek-chat"  # $0.14/1M tokens (very cheap)
os.environ["DAAO_MEDIUM_MODEL"] = "deepseek/deepseek-chat"  # Same for consistency
os.environ["DAAO_HARD_MODEL"] = "deepseek/deepseek-reasoner"  # $0.55/1M tokens (DeepSeek R1)
os.environ["DAAO_EXPERT_MODEL"] = "mistral/mistral-large-latest"  # $2/1M tokens (still 50% cheaper than Claude)

# Set API keys from example (these should work for testing)
os.environ["DEEPSEEK_API_KEY"] = "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"
os.environ["MISTRAL_API_KEY"] = "8AhWXk5aqhlqLhPeXtgeftOzJsRWE4PQ"

# Disable Gemini and Anthropic to avoid quota/cost issues
os.environ["DISABLE_GEMINI"] = "true"
os.environ["DISABLE_ANTHROPIC"] = "true"

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(message)s')
logger = logging.getLogger(__name__)

async def generate_complete_business():
    """Generate a single COMPLETE business with all components built"""
    logger.info("="*70)
    logger.info("GENESIS FULL BUSINESS GENERATION")
    logger.info("="*70)
    logger.info("Configuration:")
    logger.info("  🤖 AI Models: DeepSeek + Mistral ONLY")
    logger.info("  ❌ Gemini: DISABLED (avoiding quota limits)")
    logger.info("  ❌ Anthropic: DISABLED (avoiding costs)")
    logger.info("  💰 Cost: ~$0.50-2.00 for full business (cheap!)")
    logger.info("")
    logger.info("This will:")
    logger.info("  1. Generate business idea")
    logger.info("  2. Build frontend (React/Vue)")
    logger.info("  3. Build backend API (FastAPI/Express)")
    logger.info("  4. Add authentication & database")
    logger.info("  5. Generate tests & documentation")
    logger.info("  6. Deploy to production")
    logger.info("="*70)

    try:
        # Get OmniDaemon bridge
        bridge = get_bridge()

        logger.info("\n📡 Step 1: Publishing task to OmniDaemon...")

        # Publish to Meta Agent orchestration topic
        task_id = await bridge.publish_event(
            "genesis.meta.orchestrate",
            {
                "spec": {
                    "name": f"auto_business_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
                    "business_type": "saas",
                    "components": [
                        "dashboard_ui",      # Frontend
                        "rest_api",          # Backend
                        "database",          # PostgreSQL/MongoDB
                        "auth",              # Authentication
                        "analytics",         # Analytics
                        "deployment"         # Deploy to production
                    ],
                    "description": "Full-stack SaaS application with dashboard, API, and deployment",
                    "target_market": "SMBs",
                    "min_revenue_score": 60
                }
            }
        )

        logger.info(f"✓ Task published: {task_id}")
        logger.info(f"\n⏳ Waiting for Meta Agent to orchestrate all agents...")
        logger.info("This may take 5-15 minutes depending on complexity...")

        # Poll for result (Meta Agent has 1 hour timeout)
        max_polls = 360  # 30 minutes max (5 second intervals)
        poll_count = 0

        while poll_count < max_polls:
            result = await bridge.get_task_result(task_id)

            if result is not None:
                logger.info("\n" + "="*70)
                logger.info("✅ BUSINESS GENERATION COMPLETE!")
                logger.info("="*70)

                # Pretty print result
                logger.info("\n📊 Result:")
                logger.info(json.dumps(result, indent=2))

                # Save to file
                output_file = f"businesses/{result.get('name', 'business')}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
                with open(output_file, 'w') as f:
                    json.dump(result, f, indent=2)

                logger.info(f"\n💾 Saved to: {output_file}")
                logger.info("\n🌐 View dashboard: https://rainking632.pythonanywhere.com/")
                logger.info("   (Refresh to see updated metrics)")

                return result

            # Show progress every 10 polls (50 seconds)
            if poll_count % 10 == 0:
                elapsed = poll_count * 5 / 60
                logger.info(f"⏳ Still processing... ({elapsed:.1f} minutes elapsed)")

            await asyncio.sleep(5)
            poll_count += 1

        logger.warning("\n⚠️ Timeout: Task is still processing after 30 minutes")
        logger.info(f"Task ID: {task_id}")
        logger.info("You can check the OmniDaemon logs for progress:")
        logger.info("  tail -f logs/omnidaemon.log")

    except Exception as e:
        logger.error(f"\n✗ Error: {e}")
        import traceback
        traceback.print_exc()
        raise

if __name__ == "__main__":
    asyncio.run(generate_complete_business())
