#!/usr/bin/env python3
"""
Deploy AutoBusiness_Pro to Railway
Uses DeployAgent with VOIX integration
"""
import asyncio
import json
import logging
import os
import sys
from pathlib import Path

# Configure BEFORE imports
os.environ["DAAO_EASY_MODEL"] = "deepseek/deepseek-chat"
os.environ["DAAO_MEDIUM_MODEL"] = "deepseek/deepseek-chat"
os.environ["DAAO_HARD_MODEL"] = "deepseek/deepseek-reasoner"
os.environ["DAAO_EXPERT_MODEL"] = "mistral/mistral-large-latest"

os.environ["DISABLE_GEMINI"] = "false"  # Need Gemini Computer Use for deployment
os.environ["DISABLE_ANTHROPIC"] = "true"

sys.path.insert(0, str(Path(__file__).parent))

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

from agents.deploy_agent import get_deploy_agent, DeploymentConfig

async def main():
    logger.info("="*70)
    logger.info("DEPLOYING AUTOBUSINESS_PRO TO RAILWAY")
    logger.info("="*70)

    # Load business manifest
    business_dir = Path("businesses/AutoBusiness_Pro")
    manifest_path = business_dir / "business_manifest.json"

    with open(manifest_path) as f:
        manifest = json.load(f)

    logger.info(f"Business: {manifest['name']}")
    logger.info(f"Type: {manifest['type']}")
    logger.info(f"Components: {len(manifest['components'])}")
    logger.info(f"Files: {len(manifest['files_written'])}")

    # Load all code files
    code_files = {}
    for file_path in manifest['files_written']:
        full_path = Path(file_path)
        if full_path.exists():
            with open(full_path) as f:
                code_files[str(full_path.relative_to(business_dir))] = f.read()

    logger.info(f"Loaded {len(code_files)} code files")

    # Create DeployAgent using factory function
    deploy_agent = await get_deploy_agent(
        business_id="autobusiness_pro_deploy",
        enable_memory=True,
        use_learning=True,
        use_reflection=True
    )

    # Deploy to Railway
    logger.info("\n🚀 Deploying to Railway...")

    try:
        # Step 1: Prepare deployment files
        logger.info("📦 Step 1/3: Preparing deployment files...")
        prep_result = json.loads(deploy_agent.prepare_deployment_files(
            business_name="autobusiness-pro",
            code_files=code_files,
            framework="nextjs"
        ))

        if not prep_result['success']:
            raise Exception(f"File preparation failed: {prep_result.get('error')}")

        deploy_dir = prep_result['deploy_dir']
        logger.info(f"✓ Files prepared in {deploy_dir}")

        # Step 2: Push to GitHub
        logger.info("📤 Step 2/3: Pushing to GitHub...")
        github_result = json.loads(deploy_agent.push_to_github(
            deploy_dir=deploy_dir,
            repo_name="autobusiness-pro"
        ))

        if not github_result['success']:
            raise Exception(f"GitHub push failed: {github_result.get('error')}")

        github_url = github_result['github_url']
        logger.info(f"✓ Pushed to GitHub: {github_url}")

        # Step 3: Deploy to Railway via VOIX
        logger.info("🚂 Step 3/3: Deploying to Railway via VOIX...")
        railway_result = json.loads(await deploy_agent.deploy_to_railway_voix(
            repo_name="autobusiness-pro",
            github_url=github_url,
            environment="production"
        ))

        if not railway_result['success']:
            logger.warning(f"⚠️  Railway VOIX deployment failed, trying Vercel as fallback...")

            # Fallback to Vercel (fully supported)
            config = DeploymentConfig(
                repo_name="autobusiness-pro",
                github_url=github_url,
                platform="vercel",
                environment="production",
                framework="nextjs"
            )

            business_data = {
                'code_files': code_files,
                'manifest': manifest
            }

            result = await deploy_agent.full_deployment_workflow(
                config=config,
                business_data=business_data,
                user_id="dashboard_user"
            )
        else:
            # Railway deployment succeeded
            from dataclasses import dataclass
            from agents.deploy_agent import DeploymentResult

            result = DeploymentResult(
                success=True,
                platform="railway",
                deployment_url=railway_result['deployment_url'],
                github_url=github_url,
                status="deployed",
                deployed_at=railway_result.get('deployed_at'),
                error=None,
                rollback_id=None
            )

        logger.info("\n" + "="*70)
        logger.info("DEPLOYMENT RESULT")
        logger.info("="*70)
        logger.info(f"Success: {result.success}")
        logger.info(f"Platform: {result.platform}")
        logger.info(f"URL: {result.deployment_url}")
        logger.info(f"GitHub: {result.github_url}")
        logger.info(f"Status: {result.status}")

        if result.error:
            logger.error(f"Error: {result.error}")

        # Save deployment info to manifest
        manifest['deployment'] = {
            'platform': result.platform,
            'url': result.deployment_url,
            'github_url': result.github_url,
            'status': result.status,
            'deployed_at': result.deployed_at
        }

        with open(manifest_path, 'w') as f:
            json.dump(manifest, f, indent=2)

        logger.info(f"\n✅ Deployment info saved to {manifest_path}")

    except Exception as e:
        logger.error(f"❌ Deployment failed: {e}")
        import traceback
        traceback.print_exc()
        return False

    return True

if __name__ == "__main__":
    success = asyncio.run(main())
    sys.exit(0 if success else 1)
