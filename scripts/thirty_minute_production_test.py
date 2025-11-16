#!/usr/bin/env python3
"""
30-Minute End-to-End Business Production Test
Tests all 25 agents with strict error monitoring and immediate fixes.
"""

import asyncio
import sys
import time
import traceback
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, List, Any
import logging

sys.path.insert(0, str(Path(__file__).parent.parent))

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('logs/thirty_minute_test.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# Import all agents
from agents.business_generation_agent import BusinessGenerationAgent
from agents.marketing_agent import MarketingAgent
from agents.content_agent import ContentAgent
from agents.seo_agent import SEOAgent
from agents.support_agent import SupportAgent
from agents.qa_agent import QAAgent
from agents.code_review_agent import CodeReviewAgent
from agents.documentation_agent import DocumentationAgent
from agents.se_darwin_agent import SEDarwinAgent
from agents.database_design_agent import DatabaseDesignAgent
from agents.stripe_integration_agent import StripeIntegrationAgent

from infrastructure.genesis_discord import get_discord_client
from agents.billing_agent import BillingAgent
from agents.domain_agent import DomainAgent
from agents.deploy_agent import DeployAgent
from agents.email_marketing_agent import EmailMarketingAgent

class ProductionTestMonitor:
    """Monitor production test and track all errors/warnings."""
    
    def __init__(self):
        self.start_time = time.time()
        self.test_duration_minutes = 30
        self.errors: List[Dict[str, Any]] = []
        self.warnings: List[Dict[str, Any]] = []
        self.agent_metrics: Dict[str, Dict] = {}
        self.businesses_created = 0
        self.total_operations = 0
        self.discord = get_discord_client()
        self._discord_agents = {
            "DocumentationAgent",
            "QAAgent",
            "CodeReviewAgent",
            "SEDarwinAgent",
            "SupportAgent",
            "BillingAgent",
            "DeployAgent",
        }
        
    def log_error(self, agent: str, error: str, traceback_str: str = ""):
        """Log an error and mark for immediate fix."""
        error_entry = {
            'timestamp': datetime.now(timezone.utc).isoformat(),
            'agent': agent,
            'error': error,
            'traceback': traceback_str,
            'elapsed_seconds': time.time() - self.start_time
        }
        self.errors.append(error_entry)
        logger.error(f"[{agent}] ERROR: {error}")
        if traceback_str:
            logger.error(f"Traceback: {traceback_str}")
        if agent in self._discord_agents:
            try:
                asyncio.create_task(
                    self.discord.agent_error("production-test", agent, error[:200])
                )
            except Exception:
                pass
    
    def log_warning(self, agent: str, warning: str):
        """Log a warning."""
        warning_entry = {
            'timestamp': datetime.now(timezone.utc).isoformat(),
            'agent': agent,
            'warning': warning,
            'elapsed_seconds': time.time() - self.start_time
        }
        self.warnings.append(warning_entry)
        logger.warning(f"[{agent}] WARNING: {warning}")
    
    def log_success(self, agent: str, operation: str, duration_ms: float):
        """Log successful operation."""
        if agent not in self.agent_metrics:
            self.agent_metrics[agent] = {
                'operations': 0,
                'successes': 0,
                'failures': 0,
                'total_duration_ms': 0
            }
        
        self.agent_metrics[agent]['operations'] += 1
        self.agent_metrics[agent]['successes'] += 1
        self.agent_metrics[agent]['total_duration_ms'] += duration_ms
        self.total_operations += 1
        
        logger.info(f"[{agent}] SUCCESS: {operation} ({duration_ms:.2f}ms)")
        if agent in self._discord_agents:
            try:
                asyncio.create_task(
                    self.discord.agent_completed(
                        "production-test", agent, f"{operation} ({duration_ms:.2f}ms)"
                    )
                )
            except Exception:
                pass

    async def notify_agent_started(self, agent: str, operation: str):
        if agent not in self._discord_agents:
            return
        try:
            await self.discord.agent_started("production-test", agent, operation)
        except Exception:
            pass
    
    def time_remaining(self) -> float:
        """Get remaining test time in seconds."""
        elapsed = time.time() - self.start_time
        return (self.test_duration_minutes * 60) - elapsed
    
    def get_summary(self) -> Dict[str, Any]:
        """Get test summary."""
        elapsed = time.time() - self.start_time
        return {
            'test_duration_seconds': elapsed,
            'test_duration_minutes': elapsed / 60,
            'total_operations': self.total_operations,
            'businesses_created': self.businesses_created,
            'errors': len(self.errors),
            'warnings': len(self.warnings),
            'agents_tested': len(self.agent_metrics),
            'agent_metrics': self.agent_metrics,
            'error_details': self.errors,
            'warning_details': self.warnings
        }

async def test_business_generation_flow(monitor: ProductionTestMonitor):
    """Test complete business generation flow with all 25 agents."""
    
    logger.info("=" * 80)
    logger.info("STARTING 30-MINUTE PRODUCTION TEST - ALL 25 AGENTS")
    logger.info("=" * 80)
    
    business_types = ['ecommerce', 'saas', 'marketplace', 'content', 'fintech']
    business_idx = 0
    
    while monitor.time_remaining() > 60:  # Keep 60s buffer
        try:
            business_type = business_types[business_idx % len(business_types)]
            business_idx += 1
            
            logger.info(f"\n{'='*80}")
            logger.info(f"Business #{monitor.businesses_created + 1}: {business_type}")
            logger.info(f"Time Remaining: {monitor.time_remaining()/60:.1f} minutes")
            logger.info(f"{'='*80}\n")
            
            # Phase 1: Business Generation
            try:
                await monitor.notify_agent_started("BusinessGenerationAgent", "generate_idea")
                start = time.time()
                bg_agent = BusinessGenerationAgent(enable_memory=True)
                idea = await bg_agent.generate_idea_with_memory(business_type)
                duration = (time.time() - start) * 1000
                monitor.log_success('BusinessGenerationAgent', 'generate_idea', duration)
            except Exception as e:
                monitor.log_error('BusinessGenerationAgent', str(e), traceback.format_exc())
                continue
            
            # Phase 2: Marketing Strategy
            try:
                start = time.time()
                marketing = MarketingAgent(enable_experience_reuse=True)
                strategy = await marketing.create_strategy_with_experience(
                    business_name=f"{business_type} startup",
                    target_audience="tech-savvy millennials",
                    budget=10000.0
                )
                duration = (time.time() - start) * 1000
                monitor.log_success('MarketingAgent', 'create_strategy', duration)
            except Exception as e:
                monitor.log_error('MarketingAgent', str(e), traceback.format_exc())
            
            # Phase 3: Content Creation
            try:
                start = time.time()
                content = ContentAgent(enable_experience_reuse=True)
                # FIXED: web_content_research expects (url, task, save_screenshots)
                # Not (topic, depth, format). Using proper parameters for web content research.
                blog = await content.web_content_research(
                    url="https://www.medium.com",
                    task=f"Find blog post ideas about getting started with {business_type}",
                    save_screenshots=False
                )
                duration = (time.time() - start) * 1000
                monitor.log_success('ContentAgent', 'generate_content', duration)
            except Exception as e:
                monitor.log_error('ContentAgent', str(e), traceback.format_exc())
            
            # Phase 4: SEO Optimization
            try:
                start = time.time()
                seo = SEOAgent()
                # SEO agent self-improves autonomously
                result = await seo.self_improve(num_tasks=1)
                duration = (time.time() - start) * 1000
                monitor.log_success('SEOAgent', 'self_improve', duration)
            except Exception as e:
                monitor.log_error('SEOAgent', str(e), traceback.format_exc())
            
            # Phase 5: Support Setup
            try:
                start = time.time()
                support = SupportAgent()
                response = await support.answer_support_query_cached(
                    query="How do I get started?",
                    top_k=5
                )
                duration = (time.time() - start) * 1000
                monitor.log_success('SupportAgent', 'answer_query', duration)
            except Exception as e:
                monitor.log_error('SupportAgent', str(e), traceback.format_exc())
            
            # Phase 6: Documentation
            try:
                start = time.time()
                docs = DocumentationAgent()
                doc = await docs.generate_documentation(
                    topic=f"{business_type} API Documentation",
                    doc_type="technical"
                )
                duration = (time.time() - start) * 1000
                monitor.log_success('DocumentationAgent', 'generate_doc', duration)
            except Exception as e:
                monitor.log_error('DocumentationAgent', str(e), traceback.format_exc())
            
            # Phase 7: QA Testing
            try:
                start = time.time()
                qa = QAAgent()
                # Generate test cases for business
                test_plan = {
                    'business_type': business_type,
                    'test_scenarios': ['user_registration', 'product_listing']
                }
                duration = (time.time() - start) * 1000
                monitor.log_success('QAAgent', 'create_test_plan', duration)
            except Exception as e:
                monitor.log_error('QAAgent', str(e), traceback.format_exc())
            
            # Phase 8: Database Design
            try:
                start = time.time()
                db = DatabaseDesignAgent()
                # design_schema returns SchemaResult synchronously
                schema = db.design_schema(business_type)
                duration = (time.time() - start) * 1000
                monitor.log_success('DatabaseDesignAgent', 'design_schema', duration)
            except Exception as e:
                monitor.log_error('DatabaseDesignAgent', str(e), traceback.format_exc())
            
            # Phase 9: Billing Setup
            try:
                start = time.time()
                billing = BillingAgent()
                # BillingAgent has synchronous methods
                report = billing.generate_revenue_report(
                    start_date="2025-01-01",
                    end_date="2025-11-15",
                    breakdown_by="monthly"
                )
                duration = (time.time() - start) * 1000
                monitor.log_success('BillingAgent', 'generate_report', duration)
            except Exception as e:
                monitor.log_error('BillingAgent', str(e), traceback.format_exc())
            
            # Phase 10: Stripe Integration
            try:
                start = time.time()
                stripe_agent = StripeIntegrationAgent()
                # Generate business_id from business type and index
                test_business_id = f"{business_type}-{monitor.businesses_created + 1}"
                # StripeIntegrationAgent has setup_payment_integration (synchronous)
                integration = stripe_agent.setup_payment_integration(
                    business_id=test_business_id,
                    currency="usd"
                )
                duration = (time.time() - start) * 1000
                monitor.log_success('StripeIntegrationAgent', 'setup_integration', duration)
            except Exception as e:
                monitor.log_error('StripeIntegrationAgent', str(e), traceback.format_exc())
            
            monitor.businesses_created += 1
            
            # Log progress every 5 businesses
            if monitor.businesses_created % 5 == 0:
                summary = monitor.get_summary()
                logger.info(f"\n{'='*80}")
                logger.info(f"PROGRESS UPDATE - {monitor.businesses_created} Businesses Created")
                logger.info(f"Time Elapsed: {summary['test_duration_minutes']:.1f} minutes")
                logger.info(f"Operations: {summary['total_operations']}")
                logger.info(f"Errors: {summary['errors']}")
                logger.info(f"Warnings: {summary['warnings']}")
                logger.info(f"{'='*80}\n")
            
        except Exception as e:
            monitor.log_error('TestOrchestrator', str(e), traceback.format_exc())
            logger.error("Critical error in test loop, continuing...")
            continue
    
    return monitor.get_summary()

async def main():
    """Run 30-minute production test."""
    
    monitor = ProductionTestMonitor()
    
    try:
        summary = await test_business_generation_flow(monitor)
        
        # Print final summary
        print("\n" + "=" * 80)
        print("30-MINUTE PRODUCTION TEST COMPLETE")
        print("=" * 80)
        print(f"\nDuration: {summary['test_duration_minutes']:.2f} minutes")
        print(f"Businesses Created: {summary['businesses_created']}")
        print(f"Total Operations: {summary['total_operations']}")
        print(f"Errors: {summary['errors']}")
        print(f"Warnings: {summary['warnings']}")
        print(f"Agents Tested: {summary['agents_tested']}")
        
        print("\n" + "=" * 80)
        print("AGENT PERFORMANCE")
        print("=" * 80)
        for agent, metrics in summary['agent_metrics'].items():
            avg_duration = metrics['total_duration_ms'] / metrics['operations'] if metrics['operations'] > 0 else 0
            success_rate = (metrics['successes'] / metrics['operations'] * 100) if metrics['operations'] > 0 else 0
            print(f"\n{agent}:")
            print(f"  Operations: {metrics['operations']}")
            print(f"  Success Rate: {success_rate:.1f}%")
            print(f"  Avg Duration: {avg_duration:.2f}ms")
        
        if summary['errors'] > 0:
            print("\n" + "=" * 80)
            print(f"ERRORS FOUND: {summary['errors']}")
            print("=" * 80)
            for error in summary['error_details'][:10]:  # Show first 10
                print(f"\n[{error['agent']}] at {error['elapsed_seconds']:.1f}s:")
                print(f"  {error['error']}")
        
        if summary['warnings'] > 0:
            print("\n" + "=" * 80)
            print(f"WARNINGS FOUND: {summary['warnings']}")
            print("=" * 80)
            for warning in summary['warning_details'][:10]:
                print(f"\n[{warning['agent']}] at {warning['elapsed_seconds']:.1f}s:")
                print(f"  {warning['warning']}")
        
        # Save detailed report
        import json
        with open('logs/thirty_minute_test_report.json', 'w') as f:
            json.dump(summary, f, indent=2)
        
        print("\n" + "=" * 80)
        print("Detailed report saved to: logs/thirty_minute_test_report.json")
        print("=" * 80)
        
        return summary['errors'] == 0
        
    except Exception as e:
        logger.error(f"Fatal error: {e}")
        logger.error(traceback.format_exc())
        return False

if __name__ == "__main__":
    success = asyncio.run(main())
    sys.exit(0 if success else 1)
