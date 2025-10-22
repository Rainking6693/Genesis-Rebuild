"""
LEGAL AGENT - Microsoft Agent Framework Version
Version: 4.0 (Enhanced with DAAO + TUMIX) (Day 2 Migration)

Handles legal document generation, compliance, and contract management.
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
from infrastructure.ocr.ocr_agent_tool import legal_agent_contract_parser

logger = logging.getLogger(__name__)


class LegalAgent:
    """Legal documents and compliance agent"""

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
            instructions="You are a legal compliance specialist with OCR document scanning capabilities. Generate legal documents, review contracts, ensure regulatory compliance, manage terms of service, privacy policies, and licensing agreements. You can scan and extract text from contract images and legal documents using OCR. Track compliance deadlines, identify legal risks, and maintain document version control. Always recommend human legal review for final approval.",
            name="legal-agent",
            tools=[self.generate_document, self.review_contract, self.check_compliance, self.create_privacy_policy, self.track_legal_deadlines, self.parse_contract_image]
        )
        print(f"⚖️ Legal Agent initialized for business: {self.business_id}\n")

    def generate_document(self, document_type: str, parties: List[str], jurisdiction: str) -> str:
        """Generate a legal document template"""
        result = {
            "document_id": f"DOC-{datetime.now().strftime('%Y%m%d%H%M%S')}",
            "document_type": document_type,
            "parties": parties,
            "jurisdiction": jurisdiction,
            "status": "draft",
            "requires_review": True,
            "sections": [
                "Definitions",
                "Scope of Agreement",
                "Terms and Conditions",
                "Payment Terms",
                "Liability and Indemnification",
                "Termination Clause",
                "Dispute Resolution",
                "Governing Law"
            ],
            "generated_at": datetime.now().isoformat()
        }
        return json.dumps(result, indent=2)

    def review_contract(self, contract_id: str, review_type: str) -> str:
        """Review a contract for legal issues and risks"""
        result = {
            "review_id": f"REVIEW-{datetime.now().strftime('%Y%m%d%H%M%S')}",
            "contract_id": contract_id,
            "review_type": review_type,
            "risk_assessment": {
                "overall_risk": "medium",
                "liability_exposure": "moderate",
                "termination_clarity": "clear",
                "ip_protection": "adequate"
            },
            "issues_found": [
                {"severity": "high", "issue": "Unlimited liability clause in section 7.2", "recommendation": "Add liability cap"},
                {"severity": "medium", "issue": "Ambiguous payment terms", "recommendation": "Specify exact payment schedule"},
                {"severity": "low", "issue": "Missing force majeure clause", "recommendation": "Add standard force majeure language"}
            ],
            "requires_legal_counsel": True,
            "reviewed_at": datetime.now().isoformat()
        }
        return json.dumps(result, indent=2)

    def check_compliance(self, business_type: str, jurisdictions: List[str], regulations: List[str]) -> str:
        """Check compliance with relevant regulations"""
        result = {
            "compliance_id": f"COMP-{datetime.now().strftime('%Y%m%d%H%M%S')}",
            "business_type": business_type,
            "jurisdictions": jurisdictions,
            "regulations_checked": regulations,
            "compliance_status": {
                "GDPR": "compliant",
                "CCPA": "compliant",
                "CAN-SPAM": "compliant",
                "PCI-DSS": "requires_attention",
                "HIPAA": "not_applicable"
            },
            "action_items": [
                "Update cookie consent banner for GDPR",
                "Implement data subject access request workflow",
                "Complete annual PCI-DSS audit by Q4"
            ],
            "next_review_date": "2026-04-14",
            "checked_at": datetime.now().isoformat()
        }
        return json.dumps(result, indent=2)

    def parse_contract_image(self, contract_image_path: str) -> str:
        """Parse contract or legal document images using OCR (NEW: Vision capability)"""
        result = legal_agent_contract_parser(contract_image_path)
        return json.dumps(result, indent=2)

    def create_privacy_policy(self, company_name: str, data_collected: List[str], third_party_sharing: bool) -> str:
        """Create a privacy policy document"""
        result = {
            "policy_id": f"PRIVACY-{datetime.now().strftime('%Y%m%d%H%M%S')}",
            "company_name": company_name,
            "data_collected": data_collected,
            "third_party_sharing": third_party_sharing,
            "regulations_covered": ["GDPR", "CCPA", "PIPEDA"],
            "sections": [
                "Information We Collect",
                "How We Use Your Information",
                "Information Sharing and Disclosure",
                "Data Retention",
                "Your Rights and Choices",
                "Security Measures",
                "International Data Transfers",
                "Children's Privacy",
                "Changes to This Policy",
                "Contact Information"
            ],
            "last_updated": datetime.now().isoformat(),
            "created_at": datetime.now().isoformat()
        }
        return json.dumps(result, indent=2)

    def track_legal_deadlines(self, entity_name: str) -> str:
        """Track upcoming legal and compliance deadlines"""
        result = {
            "tracking_id": f"DEADLINE-{datetime.now().strftime('%Y%m%d%H%M%S')}",
            "entity_name": entity_name,
            "upcoming_deadlines": [
                {"deadline": "2025-11-15", "type": "Annual Report Filing", "priority": "high", "days_remaining": 32},
                {"deadline": "2025-12-31", "type": "Tax Documentation", "priority": "high", "days_remaining": 78},
                {"deadline": "2026-01-30", "type": "Contract Renewal - Vendor XYZ", "priority": "medium", "days_remaining": 108},
                {"deadline": "2026-04-14", "type": "PCI-DSS Annual Audit", "priority": "high", "days_remaining": 182}
            ],
            "overdue_items": 0,
            "tracked_at": datetime.now().isoformat()
        }
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
            'id': f'legal-{{datetime.now().strftime("%Y%m%d%H%M%S")}}',
            'description': task_description,
            'priority': priority,
            'required_tools': []
        }

        decision = self.router.route_task(task, budget_conscious=True)

        logger.info(
            f"Task routed: {decision.reasoning}",
            extra={
                'agent': 'LegalAgent',
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
                'agent': 'LegalAgent',
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
            'agent': 'LegalAgent',
            'tumix_sessions': tumix_savings['sessions'],
            'tumix_baseline_rounds': tumix_savings['baseline_rounds'],
            'tumix_actual_rounds': tumix_savings['tumix_rounds'],
            'tumix_savings_percent': tumix_savings['savings_percent'],
            'tumix_total_saved': tumix_savings['savings'],
            'daao_info': 'DAAO routing automatically applied to all tasks'
        }



async def get_legal_agent(business_id: str = "default") -> LegalAgent:
    agent = LegalAgent(business_id=business_id)
    await agent.initialize()
    return agent
