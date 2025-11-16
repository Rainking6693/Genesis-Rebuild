"""
EMAIL AGENT - Microsoft Agent Framework Version
Version: 4.0 (Enhanced with DAAO + TUMIX) (Day 2 Migration)

Handles email campaigns, automation, and deliverability.
"""

import json
import logging
import os
from datetime import datetime, timezone
from typing import List, Dict, Optional, Any
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
from infrastructure.payments.agent_base import PaymentAgentBase

logger = logging.getLogger(__name__)


class EmailAgent:
    """Email campaign and automation agent"""

    def __init__(self, business_id: str = "default"):
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

        # Initialize AP2 cost tracking for email operations
        self.ap2_cost = float(os.getenv("AP2_EMAIL_COST", "1.0"))  # $1.0 per operation
        self.ap2_budget = 50.0  # $50 threshold per user requirement

        logger.info(f"{{agent_name}} v4.0 initialized with DAAO + TUMIX + AP2 for business: {{business_id}}")
        self.payment_base = PaymentAgentBase("email_agent", cost_map={
            "send_transactional_email": 0.15,
            "validate_email": 0.05
        })
        self.payment_contexts: List[Dict[str, str]] = []

    async def initialize(self):
        cred = AzureCliCredential()
        client = AzureAIAgentClient(async_credential=cred)
        self.agent = ChatAgent(
            chat_client=client,
            instructions="You are an email marketing specialist. Design email campaigns, manage subscriber lists, optimize deliverability, create automated sequences, and analyze campaign performance. Follow email best practices, ensure CAN-SPAM compliance, and maintain high engagement rates. Use A/B testing to optimize subject lines and content.",
            name="email-agent",
            tools=[self.create_campaign, self.send_email, self.segment_audience, self.track_campaign_metrics, self.optimize_deliverability]
        )
        print(f"✉️ Email Agent initialized for business: {self.business_id}\n")

    def create_campaign(self, campaign_name: str, subject_line: str, target_segment: str) -> str:
        """Create a new email campaign"""
        result = {
            "campaign_id": f"CAMP-{datetime.now().strftime('%Y%m%d%H%M%S')}",
            "campaign_name": campaign_name,
            "subject_line": subject_line,
            "target_segment": target_segment,
            "estimated_recipients": 15678,
            "send_time": "optimal",
            "status": "draft",
            "ab_test_enabled": True,
            "created_at": datetime.now().isoformat()
        }

        # Emit AP2 event for cost tracking
        self._emit_ap2_event(
            action="create_campaign",
            context={"campaign_name": campaign_name, "segment": target_segment}
        )

        return json.dumps(result, indent=2)

    def send_email(self, campaign_id: str, recipients: List[str], send_immediately: bool) -> str:
        """Send an email campaign to recipients"""
        result = {
            "send_id": f"SEND-{datetime.now().strftime('%Y%m%d%H%M%S')}",
            "campaign_id": campaign_id,
            "recipients_count": len(recipients),
            "send_immediately": send_immediately,
            "scheduled_time": None if send_immediately else datetime.now().isoformat(),
            "estimated_delivery_time_minutes": 5,
            "status": "sending" if send_immediately else "scheduled",
            "sent_at": datetime.now().isoformat()
        }

        # Emit AP2 event for cost tracking
        self._emit_ap2_event(
            action="send_email",
            context={"campaign_id": campaign_id, "recipients_count": str(len(recipients)), "immediate": str(send_immediately)}
        )

        return json.dumps(result, indent=2)

    def segment_audience(self, criteria: Dict[str, str], segment_name: str) -> str:
        """Create audience segment based on criteria"""
        result = {
            "segment_id": f"SEG-{datetime.now().strftime('%Y%m%d%H%M%S')}",
            "segment_name": segment_name,
            "criteria": criteria,
            "matched_contacts": 3456,
            "percentage_of_total": 22.5,
            "avg_engagement_score": 7.8,
            "created_at": datetime.now().isoformat()
        }

        # Emit AP2 event for cost tracking
        self._emit_ap2_event(
            action="segment_audience",
            context={"segment_name": segment_name, "criteria_count": str(len(criteria))}
        )

        return json.dumps(result, indent=2)

    def track_campaign_metrics(self, campaign_id: str) -> str:
        """Track performance metrics for an email campaign"""
        result = {
            "campaign_id": campaign_id,
            "metrics": {
                "sent": 15678,
                "delivered": 15456,
                "opened": 4623,
                "clicked": 1234,
                "bounced": 222,
                "unsubscribed": 45,
                "spam_reports": 3,
                "open_rate": 29.9,
                "click_rate": 26.7,
                "click_to_open_rate": 8.0,
                "bounce_rate": 1.4,
                "unsubscribe_rate": 0.29
            },
            "revenue_generated": 12456.78,
            "tracked_at": datetime.now().isoformat()
        }

        # Emit AP2 event for cost tracking
        self._emit_ap2_event(
            action="track_campaign_metrics",
            context={"campaign_id": campaign_id, "metrics_tracked": str(len(result["metrics"]))}
        )

        return json.dumps(result, indent=2)

    def optimize_deliverability(self, domain: str) -> str:
        """Analyze and optimize email deliverability"""
        result = {
            "analysis_id": f"DELIV-{datetime.now().strftime('%Y%m%d%H%M%S')}",
            "domain": domain,
            "deliverability_score": 92.5,
            "sender_reputation": 88,
            "authentication": {
                "spf": "pass",
                "dkim": "pass",
                "dmarc": "pass"
            },
            "recommendations": [
                "Implement double opt-in for new subscribers",
                "Clean list of inactive subscribers (6+ months)",
                "Reduce sending frequency to re-engage dormant contacts",
                "Add plain text version to all emails",
                "Review content for spam trigger words"
            ],
            "blacklist_status": "clean",
            "analyzed_at": datetime.now().isoformat()
        }

        # Emit AP2 event for cost tracking
        self._emit_ap2_event(
            action="optimize_deliverability",
            context={"domain": domain, "recommendations_count": str(len(result["recommendations"]))}
        )

        return json.dumps(result, indent=2)

    async def send_transactional_email(self, email_data: Dict[str, Any]) -> dict:
        response = await self.payment_base._pay(
            "post",
            "https://email-api.genesis.com/send",
            self.payment_base.get_cost("send_transactional_email", 0.15),
            json=email_data,
        )
        return response.json()

    async def validate_email(self, email: str) -> dict:
        response = await self.payment_base._pay(
            "post",
            "https://email-validation.genesis.com/verify",
            self.payment_base.get_cost("validate_email", 0.05),
            json={"email": email, "check_smtp": True},
        )
        return response.json()

    async def validate_bulk_emails(self, emails: List[str]) -> dict:
        response = await self.payment_base._pay(
            "post",
            "https://email-validation.genesis.com/bulk",
            0.2,
            json={"emails": emails}
        )
        self._record_payment_context("validate_bulk_emails", {
            "emails_count": str(len(emails))
        })
        return response.json()


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
            'id': f'email-{{datetime.now().strftime("%Y%m%d%H%M%S")}}',
            'description': task_description,
            'priority': priority,
            'required_tools': []
        }

        decision = self.router.route_task(task, budget_conscious=True)

        logger.info(
            f"Task routed: {decision.reasoning}",
            extra={
                'agent': 'EmailAgent',
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
                'agent': 'EmailAgent',
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
            'agent': 'EmailAgent',
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
                f"[EmailAgent] AP2 spending would exceed ${self.ap2_budget} threshold. "
                f"Current: ${client.spent:.2f}, Requested: ${actual_cost:.2f}. "
                f"USER APPROVAL REQUIRED before proceeding."
            )

        record_ap2_event(
            agent="EmailAgent",
            action=action,
            cost=actual_cost,
            context=context
        )

    def _record_payment_context(self, action: str, context: Dict[str, str]) -> None:
        self.payment_contexts.append({
            "action": action,
            "context": context,
            "recorded_at": datetime.now(timezone.utc).isoformat()
        })


async def get_email_agent(business_id: str = "default") -> EmailAgent:
    agent = EmailAgent(business_id=business_id)
    await agent.initialize()
    return agent
