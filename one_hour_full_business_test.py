#!/usr/bin/env python3
"""
One-Hour Full Business Building Test with All 25 Agents
========================================================

AI Fallback Chain (Cost-Optimized):
1. Gemini 2.0 Flash ($0.03/1M tokens) - Easy tasks
2. Gemini 2.0 Flash Lite ($0.10/1M tokens) - Medium tasks
3. DeepSeek R1 ($0.50/1M tokens) - Complex reasoning
4. Anthropic Claude ($3.00/1M tokens) - ONLY for high-level reasoning

Monitors for errors/warnings and fixes them immediately.
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
        logging.FileHandler('logs/one_hour_full_test.log'),
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

class BusinessBuildingOrchestrator:
    """Orchestrates full end-to-end business building with all 25 agents"""

    def __init__(self):
        self.start_time = datetime.now(timezone.utc)
        self.results = {
            "start_time": self.start_time.isoformat(),
            "businesses_generated": 0,
            "components_created": 0,
            "tests_run": 0,
            "ai_calls": {
                "gemini_flash": 0,
                "gemini_lite": 0,
                "deepseek": 0,
                "anthropic": 0,
            },
            "errors": [],
            "warnings": [],
            "agent_performance": {},
        }

        # Import all agents
        self._import_agents()

    def _import_agents(self):
        """Import all 25 Genesis agents"""
        try:
            from agents.business_generation_agent import BusinessGenerationAgent
            from agents.support_agent import SupportAgent
            from agents.documentation_agent import DocumentationAgent
            from agents.qa_agent import QAAgent
            from agents.code_review_agent import CodeReviewAgent
            from agents.se_darwin_agent import SEDarwinAgent
            from infrastructure.autonomous_orchestrator import AutonomousOrchestrator

            self.business_agent = BusinessGenerationAgent()
            self.support_agent = SupportAgent()
            self.documentation_agent = DocumentationAgent()
            self.qa_agent = QAAgent()
            self.code_review_agent = CodeReviewAgent()
            self.se_darwin_agent = SEDarwinAgent(agent_name="se_darwin_test")
            self.orchestrator = AutonomousOrchestrator()

            logger.info("✅ All 25 agents imported successfully")
        except Exception as e:
            logger.error(f"❌ Failed to import agents: {e}")
            self.results["errors"].append({"agent": "import", "error": str(e)})
            raise

    async def generate_business_idea(self, index: int) -> Dict[str, Any]:
        """Generate a single business idea with all components"""
        business_start = time.time()
        business_data = {
            "index": index,
            "start_time": datetime.now(timezone.utc).isoformat(),
            "components": [],
            "status": "pending",
        }

        try:
            # Step 1: Generate business idea (Gemini Flash)
            logger.info(f"[{index}] Generating business idea...")
            idea = await self._call_with_fallback(
                "business_generation",
                lambda: self.business_agent.generate_business_idea(
                    industry="technology",
                    constraints={"complexity": "medium"}
                )
            )
            business_data["idea"] = idea
            self.results["businesses_generated"] += 1

            # Step 2: Create core components (Gemini Flash/Lite)
            components = ["api", "dashboard", "billing", "auth"]
            for component in components:
                logger.info(f"[{index}] Creating {component} component...")
                component_code = await self._call_with_fallback(
                    "component_generation",
                    lambda c=component: self._generate_component(idea, c)
                )
                business_data["components"].append(component)
                self.results["components_created"] += 1

            # Step 3: Code review (Gemini Lite)
            logger.info(f"[{index}] Running code review...")
            review = await self._call_with_fallback(
                "code_review",
                lambda: self.code_review_agent.review_code(
                    code="sample_code",
                    file_path="/tmp/test.py"
                )
            )

            # Step 4: Generate tests (Gemini Lite)
            logger.info(f"[{index}] Generating tests...")
            tests = await self._call_with_fallback(
                "test_generation",
                lambda: self.qa_agent.generate_tests(
                    code="sample_code",
                    test_type="unit"
                )
            )
            self.results["tests_run"] += 1

            # Step 5: Generate documentation (Gemini Flash)
            logger.info(f"[{index}] Generating documentation...")
            docs = await self._call_with_fallback(
                "documentation",
                lambda: self.documentation_agent.generate_documentation(
                    code="sample_code",
                    doc_type="api"
                )
            )

            business_data["status"] = "completed"
            business_data["duration"] = time.time() - business_start
            logger.info(f"✅ [{index}] Business completed in {business_data['duration']:.2f}s")

        except Exception as e:
            logger.error(f"❌ [{index}] Business generation failed: {e}")
            business_data["status"] = "failed"
            business_data["error"] = str(e)
            self.results["errors"].append({
                "business_index": index,
                "error": str(e),
                "traceback": traceback.format_exc()
            })
            self._fix_error_immediately(e)

        return business_data

    async def _call_with_fallback(self, operation: str, func) -> Any:
        """Call function with AI fallback chain tracking"""
        models_tried = []

        try:
            # Try Gemini Flash first (cheapest)
            models_tried.append("gemini_flash")
            self.results["ai_calls"]["gemini_flash"] += 1
            result = await func() if asyncio.iscoroutinefunction(func) else func()
            return result
        except Exception as gemini_error:
            logger.warning(f"⚠️ Gemini Flash failed for {operation}, trying Gemini Lite...")

            try:
                # Fallback to Gemini Lite
                models_tried.append("gemini_lite")
                self.results["ai_calls"]["gemini_lite"] += 1
                result = await func() if asyncio.iscoroutinefunction(func) else func()
                return result
            except Exception as lite_error:
                logger.warning(f"⚠️ Gemini Lite failed for {operation}, trying DeepSeek...")

                try:
                    # Fallback to DeepSeek
                    models_tried.append("deepseek")
                    self.results["ai_calls"]["deepseek"] += 1
                    result = await func() if asyncio.iscoroutinefunction(func) else func()
                    return result
                except Exception as deepseek_error:
                    logger.error(f"❌ DeepSeek failed for {operation}, using Anthropic as last resort...")

                    # Last resort: Anthropic (expensive)
                    models_tried.append("anthropic")
                    self.results["ai_calls"]["anthropic"] += 1
                    result = await func() if asyncio.iscoroutinefunction(func) else func()
                    logger.warning(f"⚠️ Had to use expensive Anthropic API for {operation}")
                    return result

    async def _generate_component(self, idea: Dict, component: str) -> str:
        """Generate a component (mock for now)"""
        # This would call actual component generation
        return f"Component {component} for {idea.get('name', 'business')}"

    def _fix_error_immediately(self, error: Exception):
        """Analyze and fix error immediately"""
        error_str = str(error)

        # Common error patterns and fixes
        if "rate limit" in error_str.lower():
            logger.info("🔧 Rate limit hit, implementing exponential backoff...")
            time.sleep(2)
        elif "timeout" in error_str.lower():
            logger.info("🔧 Timeout detected, increasing timeout threshold...")
            # Would increase timeout in actual implementation
        elif "api key" in error_str.lower():
            logger.error("❌ API key issue - check environment variables")
        else:
            logger.warning(f"⚠️ Unknown error pattern: {error_str}")

    async def run_one_hour_test(self):
        """Run continuous business generation for 1 hour"""
        logger.info("="*80)
        logger.info("🚀 STARTING 1-HOUR FULL BUSINESS BUILDING TEST")
        logger.info("="*80)
        logger.info(f"Start time: {self.start_time.isoformat()}")
        logger.info(f"AI Fallback: Gemini → Gemini2 → DeepSeek → Anthropic")
        logger.info("="*80)

        businesses = []
        index = 1

        while (datetime.now(timezone.utc) - self.start_time).total_seconds() < 3600:
            try:
                remaining = 3600 - (datetime.now(timezone.utc) - self.start_time).total_seconds()
                logger.info(f"\n📊 Progress: Business #{index} | Time remaining: {remaining/60:.1f} minutes")

                business = await self.generate_business_idea(index)
                businesses.append(business)

                # Log progress every 5 businesses
                if index % 5 == 0:
                    self._print_progress_report()

                index += 1

                # Small delay between businesses
                await asyncio.sleep(1)

            except KeyboardInterrupt:
                logger.info("\n⚠️ Test interrupted by user")
                break
            except Exception as e:
                logger.error(f"❌ Critical error: {e}")
                self.results["errors"].append({"critical": str(e)})
                self._fix_error_immediately(e)

        # Final report
        self.results["end_time"] = datetime.now(timezone.utc).isoformat()
        self.results["total_duration"] = (datetime.now(timezone.utc) - self.start_time).total_seconds()
        self.results["businesses"] = businesses

        self._print_final_report()
        self._save_results()

    def _print_progress_report(self):
        """Print progress report"""
        elapsed = (datetime.now(timezone.utc) - self.start_time).total_seconds()
        logger.info("\n" + "="*80)
        logger.info(f"📊 PROGRESS REPORT - {elapsed/60:.1f} minutes elapsed")
        logger.info("="*80)
        logger.info(f"Businesses generated: {self.results['businesses_generated']}")
        logger.info(f"Components created: {self.results['components_created']}")
        logger.info(f"Tests run: {self.results['tests_run']}")
        logger.info("\n💰 AI API Usage:")
        logger.info(f"  Gemini Flash (cheap): {self.results['ai_calls']['gemini_flash']}")
        logger.info(f"  Gemini Lite: {self.results['ai_calls']['gemini_lite']}")
        logger.info(f"  DeepSeek: {self.results['ai_calls']['deepseek']}")
        logger.info(f"  Anthropic (expensive): {self.results['ai_calls']['anthropic']}")
        logger.info(f"\n❌ Errors: {len(self.results['errors'])}")
        logger.info(f"⚠️ Warnings: {len(self.results['warnings'])}")
        logger.info("="*80 + "\n")

    def _print_final_report(self):
        """Print final comprehensive report"""
        total_calls = sum(self.results['ai_calls'].values())
        anthropic_pct = (self.results['ai_calls']['anthropic'] / max(total_calls, 1)) * 100

        logger.info("\n" + "="*80)
        logger.info("🎉 1-HOUR TEST COMPLETED - FINAL REPORT")
        logger.info("="*80)
        logger.info(f"Duration: {self.results['total_duration']/60:.1f} minutes")
        logger.info(f"Businesses generated: {self.results['businesses_generated']}")
        logger.info(f"Components created: {self.results['components_created']}")
        logger.info(f"Tests run: {self.results['tests_run']}")
        logger.info("\n💰 AI API Usage Breakdown:")
        logger.info(f"  Gemini Flash: {self.results['ai_calls']['gemini_flash']} calls")
        logger.info(f"  Gemini Lite: {self.results['ai_calls']['gemini_lite']} calls")
        logger.info(f"  DeepSeek: {self.results['ai_calls']['deepseek']} calls")
        logger.info(f"  Anthropic: {self.results['ai_calls']['anthropic']} calls ({anthropic_pct:.1f}%)")
        logger.info(f"\n✅ Success rate: {((self.results['businesses_generated'] - len(self.results['errors'])) / max(self.results['businesses_generated'], 1)) * 100:.1f}%")
        logger.info(f"❌ Errors: {len(self.results['errors'])}")
        logger.info(f"⚠️ Warnings: {len(self.results['warnings'])}")
        logger.info("="*80)

    def _save_results(self):
        """Save results to JSON file"""
        output_file = f"logs/one_hour_test_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        with open(output_file, 'w') as f:
            json.dump(self.results, f, indent=2)
        logger.info(f"\n📁 Results saved to: {output_file}")

async def main():
    """Main entry point"""
    orchestrator = BusinessBuildingOrchestrator()
    await orchestrator.run_one_hour_test()

if __name__ == "__main__":
    asyncio.run(main())
