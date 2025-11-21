#!/usr/bin/env python3
"""
Simple Single Business Generation - DeepSeek + Mistral Only
No OmniDaemon overhead - direct agent invocation
"""
import asyncio
import json
import logging
import os
import sys
import traceback
from datetime import datetime, timezone
from pathlib import Path

# Configure cheap models BEFORE any imports
os.environ["DAAO_EASY_MODEL"] = "deepseek/deepseek-chat"
os.environ["DAAO_MEDIUM_MODEL"] = "deepseek/deepseek-chat"
os.environ["DAAO_HARD_MODEL"] = "deepseek/deepseek-reasoner"
os.environ["DAAO_EXPERT_MODEL"] = "mistral/mistral-large-latest"

# API keys
os.environ["DEEPSEEK_API_KEY"] = "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"
os.environ["MISTRAL_API_KEY"] = "8AhWXk5aqhlqLhPeXtgeftOzJsRWE4PQ"

# Disable expensive models
os.environ["DISABLE_GEMINI"] = "true"
os.environ["DISABLE_ANTHROPIC"] = "true"

# Add project root to path
sys.path.insert(0, str(Path(__file__).parent))

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# Import ONLY the agents we need (not the entire Meta Agent)
from agents.business_generation_agent import BusinessGenerationAgent

async def generate_simple_business():
    """Generate one business idea quickly"""
    logger.info("="*70)
    logger.info("SIMPLE BUSINESS GENERATION")
    logger.info("="*70)
    logger.info("Configuration:")
    logger.info("  AI Models: DeepSeek + Mistral ONLY")
    logger.info("  Gemini: DISABLED")
    logger.info("  Anthropic: DISABLED")
    logger.info("  Cost: ~$0.10-0.50 (very cheap!)")
    logger.info("="*70)

    try:
        # Step 1: Generate business idea
        logger.info("\nStep 1: Initializing Business Generation Agent...")
        biz_agent = await BusinessGenerationAgent.create(
            business_id=f"business_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
            enable_memory=True
        )
        logger.info("✓ Agent initialized")

        logger.info("\nStep 2: Generating business idea with DeepSeek...")
        idea = await biz_agent.generate_idea_with_memory(
            business_type="saas",
            min_revenue_score=60,
            user_id="dashboard_user",
            learn_from_past=False
        )

        logger.info("\n" + "="*70)
        logger.info("✅ BUSINESS IDEA GENERATED!")
        logger.info("="*70)
        logger.info(f"Name: {idea.name}")
        logger.info(f"Type: {idea.business_type}")
        logger.info(f"Score: {idea.overall_score:.1f}/100")
        logger.info(f"Description: {getattr(idea, 'description', 'N/A')}")

        # Save to file
        output_file = f"businesses/{idea.name.replace(' ', '_')}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        os.makedirs("businesses", exist_ok=True)

        result = {
            "name": idea.name,
            "type": idea.business_type,
            "score": idea.overall_score,
            "description": getattr(idea, 'description', 'N/A'),
            "generated_at": datetime.now(timezone.utc).isoformat()
        }

        with open(output_file, 'w') as f:
            json.dump(result, f, indent=2)

        logger.info(f"\n💾 Saved to: {output_file}")
        logger.info("\n🌐 View dashboard: https://rainking632.pythonanywhere.com/")
        logger.info("   (Refresh to see updated metrics)")
        logger.info("="*70)

        logger.info("\n📝 NOTE: This generated the IDEA only.")
        logger.info("To build the full business (frontend, backend, deploy):")
        logger.info("  1. Use the generated idea as input to Meta Agent")
        logger.info("  2. Or run: python3 one_hour_full_business_test.py")
        logger.info("     (but that runs for a full hour)")

        return result

    except Exception as e:
        logger.error(f"\n✗ Error: {e}")
        traceback.print_exc()
        raise

if __name__ == "__main__":
    asyncio.run(generate_simple_business())
