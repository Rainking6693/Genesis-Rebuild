"""
SUPPORT AGENT - Microsoft Agent Framework Version
Version: 4.0 (Enhanced with DAAO + TUMIX) (Day 2 Migration)

Handles customer support, ticket management, and user assistance.
"""

import json
import logging
from datetime import datetime
from typing import List, Dict
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

# Import OCR capability
from infrastructure.ocr.ocr_agent_tool import support_agent_ticket_image_processor

logger = logging.getLogger(__name__)


class SupportAgent:
    """Customer support and ticket management agent"""

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

        logger.info(f"{{agent_name}} v4.0 initialized with DAAO + TUMIX for business: {{business_id}}")

    async def initialize(self):
        cred = AzureCliCredential()
        client = AzureAIAgentClient(async_credential=cred)
        self.agent = ChatAgent(
            chat_client=client,
            instructions="You are a customer support specialist with OCR image reading capabilities. Handle support tickets, answer user questions, troubleshoot issues, and escalate complex problems. You can process customer screenshots and error images using OCR. Maintain empathetic, professional communication. Track ticket resolution metrics and identify common issues for documentation. Aim for 84% autonomous resolution rate.",
            name="support-agent",
            tools=[self.create_ticket, self.respond_to_ticket, self.escalate_ticket, self.search_knowledge_base, self.generate_support_report, self.process_ticket_image]
        )
        print(f"💬 Support Agent initialized for business: {self.business_id}\n")

    def create_ticket(self, user_id: str, issue_description: str, priority: str) -> str:
        """Create a new support ticket"""
        result = {
            "ticket_id": f"TICKET-{datetime.now().strftime('%Y%m%d%H%M%S')}",
            "user_id": user_id,
            "issue_description": issue_description,
            "priority": priority,
            "status": "open",
            "assigned_to": "auto-triage",
            "created_at": datetime.now().isoformat(),
            "sla_deadline": datetime.now().isoformat()
        }
        return json.dumps(result, indent=2)

    def respond_to_ticket(self, ticket_id: str, response: str, resolution_type: str) -> str:
        """Respond to a support ticket with a solution"""
        result = {
            "ticket_id": ticket_id,
            "response": response,
            "resolution_type": resolution_type,
            "status": "resolved" if resolution_type == "resolved" else "pending",
            "response_time_minutes": 15,
            "customer_satisfaction_score": None,
            "responded_at": datetime.now().isoformat()
        }
        return json.dumps(result, indent=2)

    def escalate_ticket(self, ticket_id: str, escalation_reason: str, escalation_team: str) -> str:
        """Escalate a ticket to a specialized team"""
        result = {
            "ticket_id": ticket_id,
            "escalation_reason": escalation_reason,
            "escalated_to": escalation_team,
            "original_priority": "medium",
            "new_priority": "high",
            "escalation_notes": "Requires specialized technical knowledge",
            "escalated_at": datetime.now().isoformat()
        }
        return json.dumps(result, indent=2)

    def search_knowledge_base(self, query: str, category: str) -> str:
        """Search the knowledge base for relevant articles"""
        result = {
            "query": query,
            "category": category,
            "results": [
                {"article_id": "KB-001", "title": "Common Login Issues", "relevance_score": 0.92},
                {"article_id": "KB-015", "title": "Password Reset Guide", "relevance_score": 0.87},
                {"article_id": "KB-042", "title": "Account Security Best Practices", "relevance_score": 0.76}
            ],
            "total_results": 3,
            "searched_at": datetime.now().isoformat()
        }
        return json.dumps(result, indent=2)

    def generate_support_report(self, start_date: str, end_date: str) -> str:
        """Generate a support metrics report for a date range"""
        result = {
            "report_id": f"REPORT-{datetime.now().strftime('%Y%m%d%H%M%S')}",
            "period": {"start": start_date, "end": end_date},
            "metrics": {
                "total_tickets": 487,
                "resolved_tickets": 409,
                "autonomous_resolution_rate": 0.84,
                "average_response_time_minutes": 12,
                "customer_satisfaction_score": 4.6,
                "common_issues": ["login", "billing", "feature_requests"]
            },
            "generated_at": datetime.now().isoformat()
        }
        return json.dumps(result, indent=2)

    def process_ticket_image(self, image_path: str) -> str:
        """Process customer support ticket images using OCR (NEW: Vision capability)"""
        result = support_agent_ticket_image_processor(image_path)
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
            'id': f'support-{{datetime.now().strftime("%Y%m%d%H%M%S")}}',
            'description': task_description,
            'priority': priority,
            'required_tools': []
        }

        decision = self.router.route_task(task, budget_conscious=True)

        logger.info(
            f"Task routed: {decision.reasoning}",
            extra={
                'agent': 'SupportAgent',
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
                'agent': 'SupportAgent',
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
            'agent': 'SupportAgent',
            'tumix_sessions': tumix_savings['sessions'],
            'tumix_baseline_rounds': tumix_savings['baseline_rounds'],
            'tumix_actual_rounds': tumix_savings['tumix_rounds'],
            'tumix_savings_percent': tumix_savings['savings_percent'],
            'tumix_total_saved': tumix_savings['savings'],
            'daao_info': 'DAAO routing automatically applied to all tasks'
        }



async def get_support_agent(business_id: str = "default") -> SupportAgent:
    agent = SupportAgent(business_id=business_id)
    await agent.initialize()
    return agent
