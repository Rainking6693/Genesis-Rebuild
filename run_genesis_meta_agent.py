#!/usr/bin/env python3
"""
Run Genesis Meta Agent to Generate ONE Complete Business
Uses DeepSeek + Mistral only (no Gemini, no Anthropic)
"""
import asyncio
import logging
import os
import sys
from pathlib import Path

# Configure BEFORE imports
os.environ["DAAO_EASY_MODEL"] = "deepseek/deepseek-chat"
os.environ["DAAO_MEDIUM_MODEL"] = "deepseek/deepseek-chat"
os.environ["DAAO_HARD_MODEL"] = "deepseek/deepseek-reasoner"
os.environ["DAAO_EXPERT_MODEL"] = "mistral/mistral-large-latest"

os.environ["DEEPSEEK_API_KEY"] = "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"
os.environ["MISTRAL_API_KEY"] = "8AhWXk5aqhlqLhPeXtgeftOzJsRWE4PQ"

os.environ["DISABLE_GEMINI"] = "true"
os.environ["DISABLE_ANTHROPIC"] = "true"

sys.path.insert(0, str(Path(__file__).parent))

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[logging.StreamHandler()]
)
logger = logging.getLogger(__name__)

from infrastructure.genesis_meta_agent import GenesisMetaAgent, BusinessSpec

async def main():
    """Generate one complete business using Genesis Meta Agent"""

    logger.info("="*70)
    logger.info("GENESIS META AGENT - FULL BUSINESS GENERATION")
    logger.info("="*70)
    logger.info("Configuration:")
    logger.info("  Models: DeepSeek + Mistral ONLY")
    logger.info("  Gemini: DISABLED")
    logger.info("  Anthropic: DISABLED")
    logger.info("  Agent: Genesis Meta Agent (orchestrates all 25 agents)")
    logger.info("="*70)

    try:
        # Create Genesis Meta Agent
        logger.info("\nInitializing Genesis Meta Agent...")
        meta_agent = GenesisMetaAgent(
            use_local_llm=True,
            enable_memory=True
        )
        logger.info("✓ Meta Agent initialized with StandardIntegrationMixin (283 integrations)")

        # Create business spec
        logger.info("\nCreating business specification...")
        business_name = "AutoBusiness_Pro"
        output_dir = Path(f"businesses/{business_name}")

        spec = BusinessSpec(
            name=business_name,
            business_type="saas",
            description="AI-powered business automation platform for SMBs",
            components=[
                "dashboard_ui",      # Frontend - React/TypeScript
                "rest_api",          # Backend - FastAPI
                "user_auth",         # Authentication
                "analytics",         # Analytics dashboard
                "billing"            # Stripe integration
            ],
            output_dir=output_dir,
            metadata={
                "target_market": "SMBs",
                "revenue_model": "subscription",
                "min_revenue_score": 60
            }
        )
        logger.info(f"✓ Spec created: {spec.name} ({spec.business_type})")
        logger.info(f"  Components: {', '.join(spec.components)}")

        # Generate business - THIS CALLS THE FULL ORCHESTRATION
        logger.info("\n🚀 Starting business generation...")
        logger.info("This will:")
        logger.info("  1. Decompose into tasks")
        logger.info("  2. Select specialized agents for each component")
        logger.info("  3. Generate actual code files (.tsx, .py, etc.)")
        logger.info("  4. Write to businesses/ directory")
        logger.info("  5. Monitor progress and costs")
        logger.info("")

        result = await meta_agent.generate_business(spec)

        logger.info("\n" + "="*70)
        logger.info("✅ BUSINESS GENERATED SUCCESSFULLY!")
        logger.info("="*70)
        logger.info(f"Business: {spec.name}")
        logger.info(f"Location: businesses/{spec.metadata.get('business_id')}/")
        logger.info(f"Components: {len(spec.components)} generated")
        logger.info("\n🌐 View dashboard: https://rainking632.pythonanywhere.com/")
        logger.info("="*70)

        return result

    except Exception as e:
        logger.error(f"\n✗ Error: {e}")
        import traceback
        traceback.print_exc()
        raise

if __name__ == "__main__":
    asyncio.run(main())
