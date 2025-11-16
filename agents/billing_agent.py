"""
BILLING AGENT - Microsoft Agent Framework Version
Version: 4.0 (Enhanced with DAAO + TUMIX) (Day 2 Migration)

Handles payment processing, invoicing, and revenue management.
"""

import asyncio
import json
import logging
import os
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

# Import AP2
from infrastructure.ap2_helpers import record_ap2_event
from infrastructure.ap2_protocol import get_ap2_client
from infrastructure.genesis_discord import get_discord_client

logger = logging.getLogger(__name__)


class BillingAgent:
    """Payment processing and revenue management agent"""

    def __init__(self, business_id: str = "default"):
        self.business_id = business_id
        self.agent = None
        self._discord = None

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

        # AP2 integration: Cost tracking and budget management
        self.ap2_cost = 1.5  # $1.5 per operation
        self.ap2_budget = 50.0  # $50 threshold per user requirement

        logger.info(f"{{agent_name}} v4.0 initialized with DAAO + TUMIX for business: {{business_id}}")

    def _get_discord(self):
        if self._discord is None:
            self._discord = get_discord_client()
        return self._discord

    def _notify_discord(self, coro):
        try:
            loop = asyncio.get_running_loop()
        except RuntimeError:
            asyncio.run(coro)
        else:
            loop.create_task(coro)

    async def initialize(self):
        cred = AzureCliCredential()
        client = AzureAIAgentClient(async_credential=cred)
        self.agent = ChatAgent(
            chat_client=client,
        instructions="You are a billing and payment specialist. Process payments, generate invoices, manage subscriptions, handle refunds, and track revenue. Integrate with payment providers (Stripe, the agent payment ledger). Ensure PCI-DSS compliance, prevent fraud, and maintain accurate financial records. Support programmable, permissionless micropayments on Sei Network blockchain.",
            name="billing-agent",
            tools=[self.process_payment, self.generate_invoice, self.manage_subscription, self.issue_refund, self.generate_revenue_report]
        )
        print(f"💰 Billing Agent initialized for business: {self.business_id}\n")

    def _emit_ap2_event(self, action: str, context: Dict[str, str], cost: Optional[float] = None):
        """Emit AP2 event with budget tracking and $50 threshold monitoring"""
        client = get_ap2_client()
        actual_cost = cost or self.ap2_cost

        # Check if spending would exceed $50 threshold
        if client.spent + actual_cost > self.ap2_budget:
            logger.warning(
                f"[BillingAgent] AP2 spending would exceed ${self.ap2_budget} threshold. "
                f"Current: ${client.spent:.2f}, Requested: ${actual_cost:.2f}. "
                f"USER APPROVAL REQUIRED before proceeding."
            )

        record_ap2_event(
            agent="BillingAgent",
            action=action,
            cost=actual_cost,
            context=context
        )

    def process_payment(self, customer_id: str, amount: float, payment_method: str, currency: str) -> str:
        """Process a payment transaction"""
        discord = self._get_discord()
        business_id = self.business_id or "billing"
        self._notify_discord(
            discord.agent_started(business_id, "BillingAgent", f"Processing payment for {customer_id}")
        )
        result = {
            "transaction_id": f"TXN-{datetime.now().strftime('%Y%m%d%H%M%S')}",
            "customer_id": customer_id,
            "amount": amount,
            "currency": currency,
            "payment_method": payment_method,
            "status": "success",
            "payment_provider": "stripe" if amount >= 1.0 else "payments",
            "transaction_fee": amount * 0.029 + 0.30 if amount >= 1.0 else amount * 0.001,
            "net_amount": amount - (amount * 0.029 + 0.30 if amount >= 1.0 else amount * 0.001),
            "processed_at": datetime.now().isoformat()
        }

        # Emit AP2 event
        self._emit_ap2_event(
            action="process_payment",
            context={
                "customer_id": customer_id,
                "amount": str(amount),
                "currency": currency,
                "payment_method": payment_method
            }
        )

        self._notify_discord(
            discord.payment_received(self.business_id or "Business", amount, customer_id)
        )
        self._notify_discord(
            discord.agent_completed(business_id, "BillingAgent", f"Txn {result['transaction_id']} success")
        )
        return json.dumps(result, indent=2)

    def generate_invoice(self, customer_id: str, line_items: List[Dict[str, float]], due_date: str) -> str:
        """Generate an invoice for a customer"""
        discord = self._get_discord()
        business_id = self.business_id or "billing"
        self._notify_discord(
            discord.agent_started(business_id, "BillingAgent", f"Generating invoice for {customer_id}")
        )
        subtotal = sum([item.get('amount', 0.0) for item in line_items])
        tax = subtotal * 0.08
        total = subtotal + tax

        result = {
            "invoice_id": f"INV-{datetime.now().strftime('%Y%m%d%H%M%S')}",
            "customer_id": customer_id,
            "line_items": line_items,
            "subtotal": subtotal,
            "tax": tax,
            "total": total,
            "currency": "USD",
            "due_date": due_date,
            "status": "sent",
            "payment_terms": "Net 30",
            "generated_at": datetime.now().isoformat()
        }

        # Emit AP2 event
        self._emit_ap2_event(
            action="generate_invoice",
            context={
                "customer_id": customer_id,
                "line_items_count": str(len(line_items)),
                "total": str(total),
                "due_date": due_date
            }
        )

        self._notify_discord(
            discord.agent_completed(
                business_id,
                "BillingAgent",
                f"Invoice {result['invoice_id']} total ${total:.2f}",
            )
        )
        return json.dumps(result, indent=2)

    def manage_subscription(self, customer_id: str, plan_id: str, action: str) -> str:
        """Manage customer subscription (create, update, cancel)"""
        discord = self._get_discord()
        business_id = self.business_id or "billing"
        self._notify_discord(
            discord.agent_started(
                business_id,
                "BillingAgent",
                f"{action.title()} subscription for {customer_id}",
            )
        )
        result = {
            "subscription_id": f"SUB-{datetime.now().strftime('%Y%m%d%H%M%S')}",
            "customer_id": customer_id,
            "plan_id": plan_id,
            "action": action,
            "status": "active" if action == "create" else "cancelled" if action == "cancel" else "updated",
            "billing_cycle": "monthly",
            "next_billing_date": datetime.now().isoformat(),
            "amount": 99.00 if plan_id == "premium" else 49.00 if plan_id == "standard" else 0.00,
            "currency": "USD",
            "payment_method": "card_ending_4242",
            "updated_at": datetime.now().isoformat()
        }

        # Emit AP2 event
        self._emit_ap2_event(
            action="manage_subscription",
            context={
                "customer_id": customer_id,
                "plan_id": plan_id,
                "operation": action,
                "amount": str(result["amount"])
            }
        )

        self._notify_discord(
            discord.agent_completed(
                business_id,
                "BillingAgent",
                f"{action.title()} subscription -> {result['status']}",
            )
        )
        return json.dumps(result, indent=2)

    def issue_refund(self, transaction_id: str, amount: float, reason: str) -> str:
        """Issue a refund for a transaction"""
        discord = self._get_discord()
        business_id = self.business_id or "billing"
        self._notify_discord(
            discord.agent_started(business_id, "BillingAgent", f"Issuing refund for {transaction_id}")
        )
        result = {
            "refund_id": f"REF-{datetime.now().strftime('%Y%m%d%H%M%S')}",
            "transaction_id": transaction_id,
            "amount": amount,
            "reason": reason,
            "status": "processed",
            "refund_method": "original_payment_method",
            "processing_time_days": 5,
            "issued_at": datetime.now().isoformat()
        }

        # Emit AP2 event
        self._emit_ap2_event(
            action="issue_refund",
            context={
                "transaction_id": transaction_id,
                "amount": str(amount),
                "reason": reason
            }
        )

        self._notify_discord(
            discord.agent_completed(
                business_id,
                "BillingAgent",
                f"Refund {result['refund_id']} processed",
            )
        )
        return json.dumps(result, indent=2)

    def generate_revenue_report(self, start_date: str, end_date: str, breakdown_by: str) -> str:
        """Generate revenue report for a date range"""
        discord = self._get_discord()
        business_id = self.business_id or "billing"
        self._notify_discord(
            discord.agent_started(
                business_id,
                "BillingAgent",
                f"Revenue report {start_date}→{end_date}",
            )
        )
        result = {
            "report_id": f"REV-REPORT-{datetime.now().strftime('%Y%m%d%H%M%S')}",
            "period": {"start": start_date, "end": end_date},
            "breakdown_by": breakdown_by,
            "total_revenue": 245678.90,
            "total_transactions": 1567,
            "average_transaction_value": 156.73,
            "revenue_by_source": {
                "subscriptions": 189543.20,
                "one_time_payments": 45678.90,
                "agent_micropayments": 10456.80
            },
            "revenue_by_plan": {
                "premium": 145678.90,
                "standard": 78456.30,
                "free": 0.00
            },
            "refunds_issued": 3456.78,
            "net_revenue": 242222.12,
            "mrr": 78456.30,
            "arr": 941475.60,
            "churn_rate": 2.3,
            "generated_at": datetime.now().isoformat()
        }

        # Emit AP2 event
        self._emit_ap2_event(
            action="generate_revenue_report",
            context={
                "start_date": start_date,
                "end_date": end_date,
                "breakdown_by": breakdown_by,
                "total_revenue": str(result["total_revenue"])
            }
        )

        self._notify_discord(
            discord.daily_report(
                {
                    "businesses_built": result["total_transactions"],
                    "success_rate": 100.0,
                    "avg_quality_score": 0,
                    "total_revenue": result["total_revenue"],
                    "active_businesses": 0,
                }
            )
        )
        self._notify_discord(
            discord.agent_completed(
                business_id,
                "BillingAgent",
                f"Revenue report {result['report_id']} ready",
            )
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
            'id': f'billing-{{datetime.now().strftime("%Y%m%d%H%M%S")}}',
            'description': task_description,
            'priority': priority,
            'required_tools': []
        }

        decision = self.router.route_task(task, budget_conscious=True)

        logger.info(
            f"Task routed: {decision.reasoning}",
            extra={
                'agent': 'BillingAgent',
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
                'agent': 'BillingAgent',
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
            'agent': 'BillingAgent',
            'tumix_sessions': tumix_savings['sessions'],
            'tumix_baseline_rounds': tumix_savings['baseline_rounds'],
            'tumix_actual_rounds': tumix_savings['tumix_rounds'],
            'tumix_savings_percent': tumix_savings['savings_percent'],
            'tumix_total_saved': tumix_savings['savings'],
            'daao_info': 'DAAO routing automatically applied to all tasks'
        }



async def get_billing_agent(business_id: str = "default") -> BillingAgent:
    agent = BillingAgent(business_id=business_id)
    await agent.initialize()
    return agent
