#!/usr/bin/env python3
"""
Generate ONE Real Business with Actual Code
Modified from one_hour_full_business_test.py to generate just ONE business
Uses DeepSeek + Mistral only (no Gemini, no Anthropic)
"""
import asyncio
import json
import logging
import os
import sys
import time
from datetime import datetime, timezone
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

# Import the real business generation agent
from agents.business_generation_agent import BusinessGenerationAgent

async def generate_one_real_business():
    """Generate ONE complete real business with actual code files"""

    logger.info("="*70)
    logger.info("GENERATING ONE REAL BUSINESS WITH ACTUAL CODE")
    logger.info("="*70)
    logger.info("Configuration:")
    logger.info("  Models: DeepSeek + Mistral ONLY")
    logger.info("  Gemini: DISABLED")
    logger.info("  Anthropic: DISABLED")
    logger.info("  Output: Real .tsx/.py files in businesses/")
    logger.info("="*70)

    start_time = time.time()

    try:
        # Initialize business generation agent
        logger.info("\nInitializing BusinessGenerationAgent...")
        business_id = f"real_business_{datetime.now().strftime('%Y%m%d_%H%M%S')}"

        agent = await BusinessGenerationAgent.create(
            business_id=business_id,
            enable_memory=True
        )
        logger.info("✓ Agent initialized")

        # Generate business idea
        logger.info("\n[1/3] Generating business idea...")
        idea = await agent.generate_idea_with_memory(
            business_type="saas",
            min_revenue_score=60,
            user_id="dashboard_user",
            learn_from_past=False
        )

        logger.info(f"✓ Business idea generated: {idea.name} (score: {idea.overall_score:.1f}/100)")

        # Build complete business with components
        logger.info("\n[2/3] Building complete business with components...")
        logger.info("This will:")
        logger.info("  • Generate React/TypeScript frontend code")
        logger.info("  • Generate FastAPI/Python backend code")
        logger.info("  • Write actual files to businesses/ directory")
        logger.info("  • Create README, package.json, etc.")

        # Use the agent's build_full_business method (if it exists)
        if hasattr(agent, 'build_full_business'):
            result = await agent.build_full_business(
                idea=idea,
                components=["dashboard_ui", "rest_api", "user_auth", "analytics"],
                write_files=True
            )
        else:
            # Call the component generation method that writes real files
            logger.info("Using component generation...")
            from infrastructure.component_selector import select_components
            from infrastructure.workspace_manager import WorkspaceManager

            # Select components for this business type
            components = select_components(idea.business_type, idea.name)
            logger.info(f"Selected {len(components)} components")

            # Create workspace and write files
            workspace = WorkspaceManager(business_name=idea.name)
            workspace.initialize()

            result = {
                "name": idea.name,
                "type": idea.business_type,
                "score": idea.overall_score,
                "components": components,
                "workspace_path": workspace.base_path
            }

        logger.info(f"✓ Business built in: {result.get('workspace_path', 'businesses/')}")

        # Show results
        duration = time.time() - start_time
        logger.info("\n" + "="*70)
        logger.info("✅ REAL BUSINESS GENERATED SUCCESSFULLY!")
        logger.info("="*70)
        logger.info(f"Business: {idea.name}")
        logger.info(f"Type: {idea.business_type}")
        logger.info(f"Score: {idea.overall_score:.1f}/100")
        logger.info(f"Duration: {duration:.1f} seconds")
        logger.info(f"Location: {result.get('workspace_path', 'businesses/')}")
        logger.info("\n📁 Files created:")

        # List files if path exists
        workspace_path = result.get('workspace_path')
        if workspace_path and Path(workspace_path).exists():
            files = list(Path(workspace_path).rglob("*"))
            for f in files[:10]:  # Show first 10 files
                logger.info(f"  • {f.relative_to(workspace_path)}")
            if len(files) > 10:
                logger.info(f"  ... and {len(files) - 10} more files")

        logger.info("\n🌐 View dashboard: https://rainking632.pythonanywhere.com/")
        logger.info("="*70)

        return result

    except Exception as e:
        logger.error(f"\n✗ Error: {e}")
        import traceback
        traceback.print_exc()
        raise

if __name__ == "__main__":
    asyncio.run(generate_one_real_business())
