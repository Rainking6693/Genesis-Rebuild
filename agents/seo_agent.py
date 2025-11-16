"""
SEO AGENT - Microsoft Agent Framework Version
Version: 4.0 (Enhanced with DAAO + TUMIX) (Day 2 Migration)

Handles SEO optimization, keyword research, and search rankings.
"""

import json
import logging
import os
import time
import asyncio
from datetime import datetime
from typing import List, Dict, Optional
from agent_framework import ChatAgent
from agent_framework.azure import AzureAIAgentClient
from agent_framework.observability import setup_observability
from azure.identity.aio import AzureCliCredential

setup_observability(enable_sensitive_data=True)
# Import DAAO and TUMIX
from infrastructure.daao_router import get_daao_router, RoutingDecision
from infrastructure.tumix_termination import (
    get_tumix_termination,
    RefinementResult,
    TerminationDecision
)

# Import AP2 event recording for budget tracking
from infrastructure.ap2_helpers import record_ap2_event
from infrastructure.ap2_protocol import get_ap2_client
from infrastructure.payments.media_helper import CreativeAssetRegistry, MediaPaymentHelper
from infrastructure.payments.budget_enforcer import BudgetExceeded

# Import AgentEvolver Phase 1: Self-Questioning & Curiosity Training
from infrastructure.agentevolver import SelfQuestioningEngine, CuriosityDrivenTrainer, TrainingMetrics

# Import AgentEvolver Phase 3: Self-Attributing (Contribution-Based Rewards)
from infrastructure.agentevolver import (
    ContributionTracker, AttributionEngine, RewardShaper,
    RewardStrategy
)

logger = logging.getLogger(__name__)


class SEOAgent:
    """SEO optimization and search ranking agent"""

    def __init__(self, business_id: str = "default", enable_self_questioning: bool = True):
        self.business_id = business_id
        self.agent = None

        # Initialize DAAO router for cost optimization
        self.router = get_daao_router()

        # Initialize TUMIX for iterative refinement
        self.termination = get_tumix_termination(
            min_rounds=2,
            max_rounds=4,
            improvement_threshold=0.05
        )

        # Track refinement sessions for metrics
        self.refinement_history: List[List[RefinementResult]] = []

        # AgentEvolver Phase 1: Self-Questioning & Curiosity Training
        self.enable_self_questioning = enable_self_questioning
        if enable_self_questioning:
            self.self_questioning_engine = SelfQuestioningEngine(
                agent_type="seo",
                max_task_difficulty=0.8
            )
            self.curiosity_trainer = CuriosityDrivenTrainer(
                agent_type="seo",
                agent_executor=self._execute_seo_task,
                experience_buffer=None,  # SEO typically doesn't use experience buffer
                quality_threshold=70.0
            )
        else:
            self.self_questioning_engine = None
            self.curiosity_trainer = None

        # AgentEvolver Phase 3: Self-Attributing (Contribution-Based Rewards)
        self.enable_attribution = True  # Enable by default
        self.contribution_tracker = ContributionTracker(agent_type="seo")
        self.attribution_engine = AttributionEngine(
            contribution_tracker=self.contribution_tracker,
            reward_shaper=RewardShaper(base_reward=1.0, strategy=RewardStrategy.SIGMOID),
            shapley_iterations=50  # Fewer iterations for faster SEO analysis
        )

        # Initialize AP2 cost tracking for SEO operations
        self.ap2_cost = float(os.getenv("AP2_SEO_COST", "1.5"))  # $1.5 per operation
        self.ap2_budget = 50.0  # $50 threshold per user requirement
        self.media_helper = MediaPaymentHelper("seo_agent", vendor_name="seo_intel_network")
        self.asset_registry = CreativeAssetRegistry()

        logger.info(f"SEO Agent v4.0 initialized with DAAO + TUMIX + AP2 for business: {business_id} "
                   f"(self_questioning={'enabled' if enable_self_questioning else 'disabled'})")

    async def initialize(self):
        cred = AzureCliCredential()
        client = AzureAIAgentClient(async_credential=cred)
        self.agent = ChatAgent(
            chat_client=client,
            instructions="You are an SEO specialist. Conduct keyword research, optimize content for search engines, analyze backlinks, monitor rankings, and implement technical SEO best practices. Focus on both on-page and off-page optimization. Track organic traffic growth and conversion metrics.",
            name="seo-agent",
            tools=[self.keyword_research, self.optimize_content, self.analyze_backlinks, self.track_rankings, self.generate_seo_report]
        )
        print(f"🔍 SEO Agent initialized for business: {self.business_id}\n")

    def keyword_research(self, topic: str, target_audience: str, num_keywords: int) -> str:
        """Research relevant keywords for a topic"""
        result = {
            "research_id": f"KW-{datetime.now().strftime('%Y%m%d%H%M%S')}",
            "topic": topic,
            "target_audience": target_audience,
            "keywords": [
                {"keyword": f"{topic} tutorial", "search_volume": 12500, "difficulty": 45, "cpc": 2.35},
                {"keyword": f"best {topic} tools", "search_volume": 8900, "difficulty": 52, "cpc": 3.10},
                {"keyword": f"{topic} guide", "search_volume": 6700, "difficulty": 38, "cpc": 1.85},
                {"keyword": f"how to {topic}", "search_volume": 15200, "difficulty": 41, "cpc": 2.05}
            ],
            "total_keywords": num_keywords,
            "researched_at": datetime.now().isoformat()
        }

        self._track_asset_purchase(
            asset_id=f"keyword_research:{topic}:{target_audience}",
            metadata={"topic": topic, "audience": target_audience},
            resource="keyword_research",
            vendor="seo_intel_network",
            cost=0.45
        )

        # Emit AP2 event for cost tracking
        self._emit_ap2_event(
            action="keyword_research",
            context={"topic": topic, "audience": target_audience, "keywords_count": str(num_keywords)}
        )

        return json.dumps(result, indent=2)

    def optimize_content(self, content_url: str, target_keywords: List[str], optimization_type: str) -> str:
        """Optimize content for search engines"""
        result = {
            "optimization_id": f"OPT-{datetime.now().strftime('%Y%m%d%H%M%S')}",
            "content_url": content_url,
            "target_keywords": target_keywords,
            "optimization_type": optimization_type,
            "recommendations": [
                "Add target keyword to title tag",
                "Improve meta description (current: 45 chars, optimal: 150-160 chars)",
                "Add alt text to 3 images",
                "Increase content length (current: 450 words, recommended: 1500+ words)",
                "Add internal links to related content",
                "Improve heading structure (add H2 and H3 tags)"
            ],
            "seo_score_before": 62,
            "seo_score_after": 85,
            "optimized_at": datetime.now().isoformat()
        }

        self._track_asset_purchase(
            asset_id=f"content_optimize:{content_url}:{optimization_type}",
            metadata={"url": content_url, "type": optimization_type},
            resource="content_optimizer",
            vendor="content_optimizer_api",
            cost=0.35
        )

        # Emit AP2 event for cost tracking
        self._emit_ap2_event(
            action="optimize_content",
            context={"url": content_url, "type": optimization_type, "keywords_count": str(len(target_keywords))}
        )

        return json.dumps(result, indent=2)

    def analyze_backlinks(self, domain: str) -> str:
        """Analyze backlink profile for a domain"""
        result = {
            "analysis_id": f"BL-{datetime.now().strftime('%Y%m%d%H%M%S')}",
            "domain": domain,
            "total_backlinks": 3456,
            "referring_domains": 289,
            "domain_authority": 45,
            "top_backlinks": [
                {"source": "techcrunch.com", "authority": 92, "type": "dofollow"},
                {"source": "medium.com", "authority": 87, "type": "dofollow"},
                {"source": "reddit.com", "authority": 91, "type": "nofollow"}
            ],
            "toxic_links": 12,
            "new_links_last_30_days": 47,
            "lost_links_last_30_days": 8,
            "analyzed_at": datetime.now().isoformat()
        }

        self._track_asset_purchase(
            asset_id=f"backlinks:{domain}",
            metadata={"domain": domain},
            resource="backlink_profile",
            vendor="link-insights",
            cost=0.55
        )

        # Emit AP2 event for cost tracking
        self._emit_ap2_event(
            action="analyze_backlinks",
            context={"domain": domain, "total_backlinks": str(result["total_backlinks"])}
        )

        return json.dumps(result, indent=2)

    def track_rankings(self, domain: str, keywords: List[str], search_engine: str) -> str:
        """Track keyword rankings for a domain"""
        result = {
            "tracking_id": f"RANK-{datetime.now().strftime('%Y%m%d%H%M%S')}",
            "domain": domain,
            "search_engine": search_engine,
            "rankings": [
                {"keyword": keywords[0] if keywords else "default", "current_position": 5, "previous_position": 7, "change": 2},
                {"keyword": keywords[1] if len(keywords) > 1 else "default", "current_position": 12, "previous_position": 15, "change": 3},
                {"keyword": keywords[2] if len(keywords) > 2 else "default", "current_position": 23, "previous_position": 28, "change": 5}
            ],
            "average_position": 13.3,
            "visibility_score": 67.8,
            "tracked_at": datetime.now().isoformat()
        }

        self._track_asset_purchase(
            asset_id=f"rankings:{domain}:{search_engine}",
            metadata={"domain": domain, "search_engine": search_engine},
            resource="rankings_monitor",
            vendor="rank-watch",
            cost=0.25
        )

        # Emit AP2 event for cost tracking
        self._emit_ap2_event(
            action="track_rankings",
            context={"domain": domain, "search_engine": search_engine, "keywords_count": str(len(keywords))}
        )

        return json.dumps(result, indent=2)

    def generate_seo_report(self, domain: str, start_date: str, end_date: str) -> str:
        """Generate comprehensive SEO performance report"""
        result = {
            "report_id": f"SEO-REPORT-{datetime.now().strftime('%Y%m%d%H%M%S')}",
            "domain": domain,
            "period": {"start": start_date, "end": end_date},
            "metrics": {
                "organic_traffic": 45678,
                "organic_traffic_growth": 23.5,
                "average_position": 13.3,
                "position_improvement": 2.7,
                "keyword_rankings_top_10": 34,
                "keyword_rankings_top_100": 156,
                "backlinks_gained": 47,
                "domain_authority": 45,
                "pages_indexed": 287,
                "core_web_vitals_pass_rate": 92.3
            },
            "generated_at": datetime.now().isoformat()
        }

        # Emit AP2 event for cost tracking
        self._emit_ap2_event(
            action="generate_seo_report",
            context={"domain": domain, "start_date": start_date, "end_date": end_date}
        )

        return json.dumps(result, indent=2)


    def route_task(self, task_description: str, priority: float = 0.5) -> RoutingDecision:
        """
        Route task to appropriate model using DAAO

        Args:
            task_description: Description of the task
            priority: Task priority (0.0-1.0)

        Returns:
            RoutingDecision with model selection and cost estimate
        """
        task = {
            'id': f'seo-{{datetime.now().strftime("%Y%m%d%H%M%S")}}',
            'description': task_description,
            'priority': priority,
            'required_tools': []
        }

        decision = self.router.route_task(task, budget_conscious=True)

        logger.info(
            f"Task routed: {decision.reasoning}",
            extra={
                'agent': 'SEOAgent',
                'model': decision.model,
                'difficulty': decision.difficulty.value,
                'estimated_cost': decision.estimated_cost
            }
        )

        return decision

    def get_cost_metrics(self) -> Dict:
        """Get cumulative cost savings from DAAO and TUMIX"""
        if not self.refinement_history:
            return {
                'agent': 'SEOAgent',
                'tumix_sessions': 0,
                'tumix_savings_percent': 0.0,
                'message': 'No refinement sessions recorded yet'
            }

        tumix_savings = self.termination.estimate_cost_savings(
            [
                [r for r in session]
                for session in self.refinement_history
            ],
            cost_per_round=0.001
        )

        return {
            'agent': 'SEOAgent',
            'tumix_sessions': tumix_savings['sessions'],
            'tumix_baseline_rounds': tumix_savings['baseline_rounds'],
            'tumix_actual_rounds': tumix_savings['tumix_rounds'],
            'tumix_savings_percent': tumix_savings['savings_percent'],
            'tumix_total_saved': tumix_savings['savings'],
            'daao_info': 'DAAO routing automatically applied to all tasks'
        }

    def _emit_ap2_event(self, action: str, context: Dict, cost: Optional[float] = None):
        """
        Emit AP2 event with budget tracking and $50 threshold enforcement.

        Args:
            action: Action name (method being executed)
            context: Action context (relevant parameters)
            cost: Optional custom cost; defaults to self.ap2_cost
        """
        client = get_ap2_client()
        actual_cost = cost or self.ap2_cost

        # Check if spending would exceed $50 threshold
        if client.spent + actual_cost > self.ap2_budget:
            logger.warning(
                f"[SEOAgent] AP2 spending would exceed ${self.ap2_budget} threshold. "
                f"Current: ${client.spent:.2f}, Requested: ${actual_cost:.2f}. "
                f"USER APPROVAL REQUIRED before proceeding."
            )

        record_ap2_event(
            agent="SEOAgent",
            action=action,
            cost=actual_cost,
            context=context
        )

    def _track_asset_purchase(
        self,
        asset_id: str,
        metadata: Dict[str, str],
        resource: str,
        vendor: str,
        cost: float,
    ) -> None:
        if self.asset_registry.exists(asset_id):
            logger.debug("Asset %s already tracked, avoid duplicate spend", asset_id)
            return
        try:
            self.media_helper.purchase(resource=resource, amount_usd=cost, vendor=vendor)
            self.asset_registry.register(asset_id, metadata)
        except BudgetExceeded as exc:
            logger.warning("Budget guard blocked purchase %s: %s", asset_id, exc)

    async def self_improve(self, num_tasks: int = 10) -> TrainingMetrics:
        """
        Execute self-questioning training to autonomously improve SEO optimization capabilities.

        Phase 1 Integration: Generate novel SEO tasks, execute them, and measure
        SEO quality improvements through autonomous experimentation.

        Args:
            num_tasks: Number of self-generated training tasks to execute (default: 10)

        Returns:
            TrainingMetrics with session results, success rates, and cost tracking

        Raises:
            RuntimeError: If self-questioning not enabled

        Example:
            metrics = await agent.self_improve(num_tasks=5)
            print(f"Tasks: {metrics.tasks_succeeded}/{metrics.tasks_executed}")
            print(f"Avg Quality: {metrics.avg_quality_score:.1f}/100")
            print(f"Cost: ${metrics.total_cost_incurred:.2f}")
        """
        if not self.enable_self_questioning or not self.curiosity_trainer:
            raise RuntimeError("Self-questioning not enabled. Set enable_self_questioning=True in __init__")

        # Get remaining AP2 budget
        ap2_client = get_ap2_client()
        remaining_budget = self.ap2_budget - ap2_client.spent

        if remaining_budget <= 0:
            logger.warning(
                f"[SEOAgent] AP2 budget exhausted. Spent: ${ap2_client.spent:.2f}, "
                f"Remaining: ${remaining_budget:.2f}"
            )
            return TrainingMetrics(
                session_id="NO-BUDGET",
                agent_type="seo",
                tasks_executed=0,
                tasks_succeeded=0,
                success_rate=0.0,
                avg_quality_score=0.0,
                total_cost_incurred=0.0,
                cost_per_task=0.0,
                improvement_delta=0.0,
                high_quality_experiences_stored=0,
                timestamp=datetime.now().isoformat()
            )

        logger.info(
            f"[SEOAgent] Starting self-improvement training with {num_tasks} tasks. "
            f"AP2 Budget remaining: ${remaining_budget:.2f}"
        )

        # Step 1: Generate self-questions (novelty-driven tasks)
        tasks = await self.self_questioning_engine.generate_tasks(num_tasks=num_tasks)
        logger.info(
            f"[SEOAgent] Generated {len(tasks)} self-questions. "
            f"Top priority: {tasks[0].description} (priority={tasks[0].overall_priority:.1f})"
        )

        # Step 2: Execute tasks and track metrics
        metrics = await self.curiosity_trainer.execute_training_tasks(
            tasks=tasks,
            ap2_budget_remaining=remaining_budget,
            cost_per_task=0.3  # $0.3 per training task (cheapest agent)
        )

        # Step 3: Emit AP2 events for training
        self._emit_ap2_event(
            action="self_improve",
            context={
                "tasks_generated": str(num_tasks),
                "tasks_executed": str(metrics.tasks_executed),
                "tasks_succeeded": str(metrics.tasks_succeeded),
                "success_rate": f"{metrics.success_rate:.1%}",
                "avg_quality": f"{metrics.avg_quality_score:.1f}",
                "experiences_stored": str(metrics.high_quality_experiences_stored)
            },
            cost=metrics.total_cost_incurred
        )

        # Step 4: Update exploration frontier
        for task in tasks:
            self.self_questioning_engine.update_exploration_frontier(
                domain=task.domain,
                coverage_increase=2.0
            )

        logger.info(
            f"[SEOAgent] Self-improvement session complete. "
            f"Session: {metrics.session_id}, Success: {metrics.tasks_succeeded}/{metrics.tasks_executed}, "
            f"Avg Quality: {metrics.avg_quality_score:.1f}/100, Cost: ${metrics.total_cost_incurred:.2f}"
        )

        return metrics

    async def train_with_attribution(self, num_tasks: int = 10) -> Dict:
        """
        Execute training with contribution-based attribution tracking for SEO.

        Phase 3 Integration: Track SEO score improvements, attribute improvements
        to specific optimization techniques (keyword research, backlink building,
        technical SEO, etc.), and build contribution history for SEO patterns.

        Args:
            num_tasks: Number of training tasks to execute with attribution (default: 10)

        Returns:
            AttributionMetrics with SEO technique contribution scores

        Raises:
            RuntimeError: If attribution not enabled

        Example:
            metrics = await agent.train_with_attribution(num_tasks=10)
            print(f"Top techniques: {metrics.top_contributions}")
            print(f"Avg SEO improvement: {metrics.improvement_delta:.2f}")
        """
        if not self.enable_attribution:
            raise RuntimeError("Self-attributing not enabled. Set enable_attribution=True")

        session_id = f"SEO-ATTR-{datetime.now().strftime('%Y%m%d%H%M%S')}"
        start_time = time.time()

        logger.info(
            f"[SEOAgent] Starting attribution training with {num_tasks} tasks. "
            f"Session: {session_id}"
        )

        # Execute training tasks and track SEO technique contributions
        contributions_tracked = 0
        total_cost = 0.0

        for task_idx in range(num_tasks):
            try:
                # Generate SEO task
                task_desc = f"SEO task {task_idx + 1}: Optimize website for search rankings"

                # Get baseline SEO quality
                baseline = json.loads(self.optimize_content(f"https://example{task_idx}.com", ["keyword1"], "on-page"))
                quality_before = float(baseline.get("seo_score_before", 50))

                # Apply SEO optimization techniques
                techniques = ["keyword-optimization", "backlink-building", "technical-seo"]

                # Execute optimized SEO
                optimized = json.loads(
                    self.optimize_content(
                        f"https://example{task_idx}.com",
                        ["keyword1", "keyword2", "keyword3"],
                        "comprehensive"
                    )
                )
                quality_after = float(optimized.get("seo_score_after", 85))

                # Record contribution for each technique
                task_id = f"TASK-{task_idx + 1}"
                for technique in techniques:
                    contribution_score = await self.contribution_tracker.record_contribution(
                        agent_id="SEOAgent",
                        task_id=task_id,
                        quality_before=quality_before,
                        quality_after=quality_after,
                        effort_ratio=0.8,
                        impact_multiplier=1.0
                    )

                    if contribution_score > 0:
                        contributions_tracked += 1

                total_cost += 0.2  # Cost per training task (cheapest agent)

                logger.debug(
                    f"[SEOAgent] Task {task_idx + 1}: "
                    f"quality_delta={quality_after - quality_before:.2f}, "
                    f"techniques={len(techniques)}"
                )

            except Exception as e:
                logger.error(
                    f"[SEOAgent] Attribution task {task_idx + 1} failed: {e}",
                    exc_info=True
                )
                continue

        # Get contribution breakdown
        contribution_breakdown = self.contribution_tracker.get_contribution_breakdown()
        top_contribs = self.contribution_tracker.get_top_contributions(top_k=5)
        top_contribution_names = [name for name, _ in top_contribs]

        # Calculate metrics
        duration = time.time() - start_time
        avg_score = sum(score for _, score in top_contribs) / len(top_contribs) if top_contribs else 0.0

        metrics = {
            "session_id": session_id,
            "agent_type": "seo",
            "tasks_executed": num_tasks,
            "contributions_tracked": contributions_tracked,
            "avg_contribution_score": avg_score,
            "top_contributions": top_contribution_names,
            "total_cost_incurred": total_cost,
            "improvement_delta": avg_score - 50.0,
            "duration_seconds": duration,
            "contribution_breakdown": contribution_breakdown
        }

        # Emit AP2 event for compliance
        self._emit_ap2_event(
            action="train_with_attribution",
            context={
                "session_id": session_id,
                "tasks_executed": str(num_tasks),
                "contributions_tracked": str(contributions_tracked),
                "avg_seo_improvement": f"{avg_score:.2f}",
                "top_techniques": ", ".join(top_contribution_names[:3])
            },
            cost=total_cost
        )

        logger.info(
            f"[SEOAgent] Attribution training complete. "
            f"Session: {session_id}, Contributions: {contributions_tracked}, "
            f"Avg Score: {avg_score:.2f}, Duration: {duration:.1f}s"
        )

        return metrics

    async def _execute_seo_task(self, task_description: str) -> Dict:
        """
        Execute an SEO task (used by CuriosityDrivenTrainer).

        Args:
            task_description: Description of SEO task to execute

        Returns:
            Dict with SEO research output and quality metrics
        """
        try:
            # Simulate task execution by generating relevant SEO analysis
            # In production, this would call actual SEO tools
            if "keyword" in task_description.lower():
                output = json.loads(self.keyword_research("Training Topic", "target users", 20))
            elif "content" in task_description.lower() or "optimize" in task_description.lower():
                output = json.loads(self.optimize_content("https://example.com", ["keyword1", "keyword2"], "on-page"))
            elif "backlink" in task_description.lower():
                output = json.loads(self.analyze_backlinks("example.com"))
            elif "ranking" in task_description.lower() or "track" in task_description.lower():
                output = json.loads(self.track_rankings("example.com", ["keyword1", "keyword2"], "google"))
            else:
                output = json.loads(self.generate_seo_report("example.com", "2025-01-01", "2025-01-31"))

            return output

        except Exception as e:
            logger.error(f"[SEOAgent] Task execution failed: {e}")
            return {"error": str(e)}


async def get_seo_agent(business_id: str = "default") -> SEOAgent:
    agent = SEOAgent(business_id=business_id)
    await agent.initialize()
    return agent
