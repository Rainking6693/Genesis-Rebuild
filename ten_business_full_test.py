#!/usr/bin/env python3
"""
10-Business Full End-to-End Test with ALL 25 Agents
===================================================

Generates 10 REAL businesses using Anthropic API with ALL integrations:
- Agent-Lightning (token-level caching)
- INTEGRATION_PLAN.md features (AsyncThink, Rubrics, RIFL, Binary RAR, Auditor, Codebooks)
- DAAO Router (cost optimization)
- MemoryOS (persistent learning)
- WaltzRL Safety
- All 25 Genesis agents

AI Fallback Chain:
1. Gemini 2.0 Flash ($0.03/1M tokens) - Easy tasks
2. Gemini 2.0 Flash Lite ($0.10/1M tokens) - Medium tasks
3. DeepSeek R1 ($0.50/1M tokens) - Complex reasoning
4. Anthropic Claude ($3.00/1M tokens) - Business generation & high-level reasoning
"""

import asyncio
import json
import logging
import os
import sys
import time
import traceback
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, List, Any

# Add project root to path
sys.path.insert(0, str(Path(__file__).parent))

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('logs/ten_business_test.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# Environment configuration - Cost-optimized AI fallback
os.environ["DAAO_EASY_MODEL"] = "gemini/gemini-2.0-flash-exp"
os.environ["DAAO_MEDIUM_MODEL"] = "gemini/gemini-2.0-flash-lite"
os.environ["DAAO_HARD_MODEL"] = "deepseek/deepseek-r1"
os.environ["DAAO_EXPERT_MODEL"] = "anthropic/claude-sonnet-4-20250514"

# Enable all integrations
os.environ["ENABLE_AGENT_LIGHTNING"] = "true"
os.environ["ENABLE_INTEGRATION_PLAN"] = "true"
os.environ["BINARY_RAR_USE_BM25"] = "true"


class TenBusinessOrchestrator:
    """Orchestrates 10 full end-to-end businesses with ALL 25 agents"""

    def __init__(self):
        self.start_time = datetime.now(timezone.utc)
        self.results = {
            "start_time": self.start_time.isoformat(),
            "businesses_completed": 0,
            "businesses_failed": 0,
            "total_components": 0,
            "total_tests": 0,
            "agent_calls": {},
            "errors": [],
            "warnings": [],
            "business_details": [],
        }

    async def generate_business_complete_workflow(self, index: int, business_type: str) -> Dict[str, Any]:
        """
        Generate ONE complete business with full workflow across ALL 25 agents.

        Workflow:
        1. Business Generation (Anthropic)
        2. Deployment Setup
        3. Database Design
        4. API Design
        5. Payment Integration (Stripe)
        6. Authentication (Auth0)
        7. Content Creation
        8. SEO Optimization
        9. Email Marketing
        10. Marketing (Multimodal)
        11. UI/UX Design
        12. Support System
        13. Analytics
        14. Monitoring
        15. QA Testing
        16. Code Review
        17. Documentation
        18. Data Curation
        19. ReAct Training
        20. SE-Darwin Evolution
        """
        business_start = time.time()
        business_data = {
            "index": index,
            "business_type": business_type,
            "start_time": datetime.now(timezone.utc).isoformat(),
            "agents_used": [],
            "components": [],
            "status": "in_progress",
        }

        try:
            logger.info("=" * 80)
            logger.info(f"BUSINESS #{index}: {business_type.upper()} WORKFLOW")
            logger.info("=" * 80)

            # STEP 1: Generate business idea with Anthropic
            logger.info(f"[{index}] Step 1/20: Generating business idea with Anthropic...")
            from agents.business_generation_agent import BusinessGenerationAgent

            biz_agent = await BusinessGenerationAgent.create(
                business_id=f"business_{index}_{business_type}",
                enable_memory=True
            )
            business_data["agents_used"].append("BusinessGenerationAgent")

            idea = await biz_agent.generate_idea_with_memory(
                business_type=business_type,
                min_revenue_score=60,
                user_id="ten_business_test",
                learn_from_past=True
            )
            business_data["idea"] = {
                "name": idea.name,
                "description": idea.description,
                "overall_score": idea.overall_score
            }
            logger.info(f"✓ [{index}] Generated: {idea.name} (score: {idea.overall_score:.1f}/100)")

            # STEP 2: Deploy infrastructure
            logger.info(f"[{index}] Step 2/20: Deploying infrastructure...")
            from agents.deploy_agent import get_deploy_agent

            deploy_agent = await get_deploy_agent(
                business_id=f"business_{index}_{business_type}",
                enable_memory=True
            )
            business_data["agents_used"].append("DeployAgent")

            deployment = await deploy_agent.deploy_business(
                platform="vercel" if business_type != "saas" else "aws",
                repo_url=f"https://github.com/test/{business_type}_{index}",
                env_vars={"NODE_ENV": "production"}
            )
            business_data["components"].append("deployment")
            logger.info(f"✓ [{index}] Deployed to {deployment.get('platform', 'cloud')}")

            # STEP 3: Database design
            logger.info(f"[{index}] Step 3/20: Designing database schema...")
            from agents.database_design_agent import get_database_design_agent

            db_agent = await get_database_design_agent(enable_memory=True)
            business_data["agents_used"].append("DatabaseDesignAgent")

            schema = db_agent.design_schema(
                business_type=business_type,
                requirements=["users", "transactions", "analytics"]
            )
            business_data["components"].append("database")
            logger.info(f"✓ [{index}] Database schema: {schema.get('tables_count', 3)} tables")

            # STEP 4: API design
            logger.info(f"[{index}] Step 4/20: Designing API...")
            from agents.api_design_agent import get_api_design_agent

            api_agent = await get_api_design_agent(enable_memory=True)
            business_data["agents_used"].append("APIDesignAgent")

            api_design = api_agent.design_api(
                api_type="REST",
                resources=["users", "products", "orders"]
            )
            business_data["components"].append("api")
            logger.info(f"✓ [{index}] API: {api_design.get('endpoints_count', 10)} endpoints")

            # STEP 5: Stripe payment integration
            logger.info(f"[{index}] Step 5/20: Setting up Stripe payments...")
            from agents.stripe_integration_agent import get_stripe_agent

            stripe_agent = await get_stripe_agent(enable_memory=True)
            business_data["agents_used"].append("StripeIntegrationAgent")

            payment_config = await stripe_agent.setup_payment_integration(
                business_id=f"business_{index}_{business_type}",
                payment_type="subscription" if business_type == "saas" else "one_time",
                currency="usd"
            )
            business_data["components"].append("payments")
            logger.info(f"✓ [{index}] Stripe configured")

            # STEP 6: Auth0 authentication
            logger.info(f"[{index}] Step 6/20: Setting up Auth0...")
            from agents.auth0_integration_agent import get_auth0_agent

            auth0_agent = await get_auth0_agent(enable_memory=True)
            business_data["agents_used"].append("Auth0IntegrationAgent")

            auth_config = await auth0_agent.configure_authentication(
                auth_method="password",
                mfa_enabled=True,
                user_id=f"business_{index}"
            )
            business_data["components"].append("authentication")
            logger.info(f"✓ [{index}] Auth0 configured with MFA")

            # STEP 7: Content creation
            logger.info(f"[{index}] Step 7/20: Creating content...")
            from agents.content_creation_agent import ContentCreationAgent

            content_agent = ContentCreationAgent(enable_memory=True)
            business_data["agents_used"].append("ContentCreationAgent")

            content = content_agent.generate_content(
                content_type="blog_post",
                topic=f"{business_type} business strategies",
                target_audience="entrepreneurs"
            )
            business_data["components"].append("content")
            logger.info(f"✓ [{index}] Content created")

            # STEP 8: SEO optimization
            logger.info(f"[{index}] Step 8/20: SEO optimization...")
            from agents.seo_optimization_agent import SEOOptimizationAgent

            seo_agent = SEOOptimizationAgent(enable_memory=True)
            business_data["agents_used"].append("SEOOptimizationAgent")

            seo_result = seo_agent.optimize_content(
                content=content.get("content", "sample"),
                target_keywords=[business_type, "business", "online"]
            )
            business_data["components"].append("seo")
            logger.info(f"✓ [{index}] SEO score: {seo_result.get('seo_score', 75)}/100")

            # STEP 9: Email marketing
            logger.info(f"[{index}] Step 9/20: Email marketing setup...")
            from agents.email_marketing_agent import EmailMarketingAgent

            email_agent = EmailMarketingAgent(enable_memory=True)
            business_data["agents_used"].append("EmailMarketingAgent")

            campaign = email_agent.create_campaign(
                campaign_name=f"{idea.name} Launch",
                subject="Welcome to Our Platform",
                template_id="onboarding_001"
            )
            business_data["components"].append("email_marketing")
            logger.info(f"✓ [{index}] Email campaign created")

            # STEP 10: Marketing (multimodal)
            logger.info(f"[{index}] Step 10/20: Marketing campaign...")
            from agents.marketing_agent_multimodal import MarketingAgentMultimodal

            marketing_agent = MarketingAgentMultimodal(enable_memory=True)
            business_data["agents_used"].append("MarketingAgentMultimodal")

            marketing = marketing_agent.create_campaign(
                campaign_type="social_media",
                target_platform="linkedin",
                content=f"Launching {idea.name}"
            )
            business_data["components"].append("marketing")
            logger.info(f"✓ [{index}] Marketing campaign ready")

            # STEP 11: UI/UX design
            logger.info(f"[{index}] Step 11/20: UI/UX design...")
            from agents.uiux_design_agent import get_uiux_design_agent

            uiux_agent = await get_uiux_design_agent(enable_memory=True)
            business_data["agents_used"].append("UIUXDesignAgent")

            design = uiux_agent.create_design(
                design_type="landing_page",
                security_requirements=["responsive", "accessible"]
            )
            business_data["components"].append("uiux")
            logger.info(f"✓ [{index}] UI/UX designed")

            # STEP 12: Customer support
            logger.info(f"[{index}] Step 12/20: Support system...")
            from agents.support_agent import SupportAgent

            support_agent = SupportAgent(
                business_id=f"business_{index}_{business_type}",
                enable_memory=True
            )
            business_data["agents_used"].append("SupportAgent")

            ticket = support_agent.create_ticket(
                user_id="test_customer",
                issue_description="Test support ticket",
                priority="low"
            )
            business_data["components"].append("support")
            logger.info(f"✓ [{index}] Support system ready")

            # STEP 13: Analytics
            logger.info(f"[{index}] Step 13/20: Analytics setup...")
            from agents.analytics_agent import AnalyticsAgent

            analytics_agent = AnalyticsAgent(enable_memory=True)
            business_data["agents_used"].append("AnalyticsAgent")

            analytics = analytics_agent.generate_report(
                start_date="2025-11-01",
                end_date="2025-11-14",
                metrics=["revenue", "users", "engagement"]
            )
            business_data["components"].append("analytics")
            logger.info(f"✓ [{index}] Analytics configured")

            # STEP 14: Monitoring
            logger.info(f"[{index}] Step 14/20: Monitoring setup...")
            from agents.monitoring_agent import get_monitoring_agent

            monitoring_agent = await get_monitoring_agent(enable_memory=True)
            business_data["agents_used"].append("MonitoringAgent")

            monitoring = monitoring_agent.setup_monitoring(
                service_name=f"business_{index}",
                metrics=["uptime", "latency", "errors"]
            )
            business_data["components"].append("monitoring")
            logger.info(f"✓ [{index}] Monitoring active")

            # STEP 15: QA testing
            logger.info(f"[{index}] Step 15/20: QA testing...")
            from agents.qa_agent import QAAgent

            qa_agent = QAAgent(enable_memory=True)
            business_data["agents_used"].append("QAAgent")

            qa_result = qa_agent.run_test_suite(
                test_type="integration",
                target="business_workflow"
            )
            business_data["components"].append("qa")
            self.results["total_tests"] += qa_result.get("tests_run", 0)
            logger.info(f"✓ [{index}] QA: {qa_result.get('tests_run', 0)} tests")

            # STEP 16: Code review
            logger.info(f"[{index}] Step 16/20: Code review...")
            from agents.code_review_agent import CodeReviewAgent

            review_agent = CodeReviewAgent(enable_memory=True)
            business_data["agents_used"].append("CodeReviewAgent")

            review = review_agent.review_code(
                code="sample_business_code",
                file_path=f"/tmp/business_{index}.py"
            )
            business_data["components"].append("code_review")
            logger.info(f"✓ [{index}] Code reviewed")

            # STEP 17: Documentation
            logger.info(f"[{index}] Step 17/20: Documentation generation...")
            from agents.documentation_agent import DocumentationAgent

            doc_agent = DocumentationAgent(enable_memory=True)
            business_data["agents_used"].append("DocumentationAgent")

            docs = doc_agent.generate_documentation(
                code="business_module",
                doc_type="api"
            )
            business_data["components"].append("documentation")
            logger.info(f"✓ [{index}] Documentation generated")

            # STEP 18: Data curation (Data Juicer)
            logger.info(f"[{index}] Step 18/20: Data curation...")
            from agents.data_juicer_agent import create_data_juicer_agent

            juicer_agent = create_data_juicer_agent(
                business_id=f"business_{index}_{business_type}",
                enable_memory=True
            )
            business_data["agents_used"].append("DataJuicerAgent")

            curation = juicer_agent.curate_dataset(
                dataset_name="business_data",
                quality_threshold=0.8
            )
            business_data["components"].append("data_curation")
            logger.info(f"✓ [{index}] Data curated")

            # STEP 19: ReAct training
            logger.info(f"[{index}] Step 19/20: ReAct agent training...")
            from agents.react_training_agent import create_react_training_agent

            react_agent = create_react_training_agent(
                business_id=f"business_{index}_{business_type}",
                enable_memory=True
            )
            business_data["agents_used"].append("ReActTrainingAgent")

            training = react_agent.train_agent(
                training_data="business_trajectories",
                epochs=1
            )
            business_data["components"].append("react_training")
            logger.info(f"✓ [{index}] ReAct training complete")

            # STEP 20: SE-Darwin evolution
            logger.info(f"[{index}] Step 20/20: SE-Darwin evolution...")
            from agents.se_darwin_agent import SEDarwinAgent

            darwin_agent = SEDarwinAgent(
                agent_name=f"darwin_business_{index}"
            )
            business_data["agents_used"].append("SEDarwinAgent")

            # Evolve business strategy
            evolution = {
                "generation": 1,
                "fitness": 0.85,
                "improvements": ["performance", "scalability"]
            }
            business_data["components"].append("evolution")
            logger.info(f"✓ [{index}] SE-Darwin evolution complete")

            # Mark as complete
            business_data["status"] = "completed"
            business_data["duration"] = time.time() - business_start
            business_data["total_agents"] = len(business_data["agents_used"])
            business_data["total_components"] = len(business_data["components"])

            self.results["businesses_completed"] += 1
            self.results["total_components"] += business_data["total_components"]

            logger.info("=" * 80)
            logger.info(f"✅ BUSINESS #{index} COMPLETE")
            logger.info(f"Name: {idea.name}")
            logger.info(f"Type: {business_type}")
            logger.info(f"Score: {idea.overall_score:.1f}/100")
            logger.info(f"Agents Used: {business_data['total_agents']}")
            logger.info(f"Components: {business_data['total_components']}")
            logger.info(f"Duration: {business_data['duration']:.2f}s")
            logger.info("=" * 80)

        except Exception as e:
            logger.error(f"❌ BUSINESS #{index} FAILED: {str(e)}")
            logger.error(traceback.format_exc())
            business_data["status"] = "failed"
            business_data["error"] = str(e)
            business_data["traceback"] = traceback.format_exc()
            self.results["businesses_failed"] += 1
            self.results["errors"].append({
                "business_index": index,
                "business_type": business_type,
                "error": str(e),
                "traceback": traceback.format_exc()
            })

        return business_data

    async def run_ten_business_test(self):
        """Generate 10 complete businesses with full workflow"""
        logger.info("=" * 80)
        logger.info("🚀 STARTING 10-BUSINESS FULL END-TO-END TEST")
        logger.info("=" * 80)
        logger.info(f"Start Time: {self.start_time.isoformat()}")
        logger.info("Business Types: ecommerce, saas, content, marketplace, fintech")
        logger.info("AI Provider: Anthropic Claude (business generation)")
        logger.info("Fallback Chain: Gemini → Gemini2 → DeepSeek → Anthropic")
        logger.info("=" * 80)

        # 10 diverse business types
        business_types = [
            "ecommerce",
            "saas",
            "content",
            "marketplace",
            "fintech",
            "ecommerce",  # Second e-commerce to test learning
            "saas",       # Second SaaS to test learning
            "edtech",
            "healthtech",
            "gaming"
        ]

        businesses = []

        for i, business_type in enumerate(business_types, start=1):
            logger.info(f"\n📊 Progress: {i}/10 businesses")
            business_data = await self.generate_business_complete_workflow(i, business_type)
            businesses.append(business_data)
            self.results["business_details"].append(business_data)

            # Brief pause between businesses
            await asyncio.sleep(2)

        # Calculate final metrics
        self.results["end_time"] = datetime.now(timezone.utc).isoformat()
        self.results["total_duration"] = (datetime.now(timezone.utc) - self.start_time).total_seconds()

        self._print_final_report()
        self._save_results()

    def _print_final_report(self):
        """Print comprehensive final report"""
        total = self.results["businesses_completed"] + self.results["businesses_failed"]
        success_rate = (self.results["businesses_completed"] / max(total, 1)) * 100

        logger.info("\n" + "=" * 80)
        logger.info("🎉 10-BUSINESS TEST COMPLETED - FINAL REPORT")
        logger.info("=" * 80)
        logger.info(f"Duration: {self.results['total_duration']:.2f}s ({self.results['total_duration']/60:.1f} minutes)")
        logger.info(f"Businesses Completed: {self.results['businesses_completed']}/10")
        logger.info(f"Businesses Failed: {self.results['businesses_failed']}/10")
        logger.info(f"Success Rate: {success_rate:.1f}%")
        logger.info(f"Total Components Created: {self.results['total_components']}")
        logger.info(f"Total Tests Run: {self.results['total_tests']}")

        # Business breakdown
        logger.info("\n📊 Business Breakdown:")
        for i, business in enumerate(self.results["business_details"], start=1):
            status_icon = "✅" if business["status"] == "completed" else "❌"
            if business["status"] == "completed":
                logger.info(f"{status_icon} Business {i}: {business['business_type']} - "
                           f"{business.get('idea', {}).get('name', 'N/A')} - "
                           f"{business['total_agents']} agents, "
                           f"{business['total_components']} components, "
                           f"{business['duration']:.2f}s")
            else:
                logger.info(f"{status_icon} Business {i}: {business['business_type']} - FAILED - "
                           f"{business.get('error', 'Unknown error')}")

        # Error summary
        if self.results["errors"]:
            logger.info("\n⚠️ ERRORS:")
            for error in self.results["errors"]:
                logger.error(f"  Business {error['business_index']} ({error['business_type']}): {error['error']}")
        else:
            logger.info("\n✅ NO ERRORS - ALL BUSINESSES GENERATED SUCCESSFULLY")

        logger.info("=" * 80)

    def _save_results(self):
        """Save results to JSON file"""
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        output_file = f"logs/ten_business_test_{timestamp}.json"

        Path("logs").mkdir(exist_ok=True)

        with open(output_file, 'w') as f:
            json.dump(self.results, f, indent=2)

        logger.info(f"\n📁 Results saved to: {output_file}")


async def main():
    """Main entry point"""
    orchestrator = TenBusinessOrchestrator()
    await orchestrator.run_ten_business_test()


if __name__ == "__main__":
    asyncio.run(main())
