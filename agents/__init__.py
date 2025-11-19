"""
Genesis Agents - Microsoft Agent Framework Version
Day 2 Migration: All 15 agents converted to Microsoft Agent Framework

Agent List (Tier 1 - Critical):
1. Marketing Agent - Growth and marketing campaigns
2. Builder Agent - Code generation and development
3. Content Agent - Blog posts and documentation
4. Deploy Agent - Deployment and infrastructure
5. Support Agent - Customer support automation
6. QA Agent - Quality assurance and testing
7. SEO Agent - Search engine optimization
8. Email Agent - Email campaigns and automation
9. Legal Agent - Legal documents and compliance
10. Security Agent - Security audits and monitoring
11. Billing Agent - Payment processing and subscriptions
12. Analyst Agent - Analytics and insights
13. Maintenance Agent - System health and monitoring
14. Onboarding Agent - User activation and onboarding
15. Spec Agent - Requirements and specifications
16. Business Generation Agent - Autonomous business creation

Tier 2 - High Value Memory Integration:
17. Data Juicer Agent - Trajectory data curation
18. ReAct Training Agent - Reinforcement learning for reasoning agents
19. AgentScope Runtime Agent - Runtime performance & configuration management
20. LLM Judge RL Agent - Reinforcement learning with LLM-as-Judge evaluation
21. Content Creation Agent - Multimodal content generation (NEW)
22. SEO Optimization Agent - SEO pattern optimization (NEW)
23. Email Marketing Agent - Campaign templates and A/B testing (NEW)
24. Analytics Agent - Multimodal analytics and dashboards (NEW)
"""

from .marketing_agent import MarketingAgent, get_marketing_agent
from .builder_agent import BuilderAgent, get_builder_agent
from .content_agent import ContentAgent, get_content_agent
from .deploy_agent import DeployAgent, get_deploy_agent
from .support_agent import SupportAgent, get_support_agent
from .qa_agent import QAAgent, get_qa_agent
from .seo_agent import SEOAgent, get_seo_agent
from .email_agent import EmailAgent, get_email_agent
from .legal_agent import LegalAgent, get_legal_agent
from .security_agent import EnhancedSecurityAgent as SecurityAgent, get_security_agent
from .billing_agent import BillingAgent, get_billing_agent
from .analyst_agent import AnalystAgent, get_analyst_agent
from .maintenance_agent import MaintenanceAgent, get_maintenance_agent
from .onboarding_agent import OnboardingAgent, get_onboarding_agent
from .spec_agent import SpecAgent, get_spec_agent
from .business_generation_agent import BusinessGenerationAgent, get_business_generation_agent
from .data_juicer_agent import DataJuicerAgent, create_data_juicer_agent
from .react_training_agent import ReActTrainingAgent, create_react_training_agent
from .agentscope_runtime_agent import AgentScopeRuntimeAgent, create_runtime_agent
from .llm_judge_rl_agent import LLMJudgeRLAgent, create_judge_rl_agent

# Import agents 9-17 with factory functions
from .marketing_agent import MarketingAgent, get_marketing_agent  # Agent 9
from .qa_agent import QAAgent, get_qa_agent  # Agent 10
from .research_discovery_agent import ResearchDiscoveryAgent, get_research_discovery_agent  # Agent 11
from .se_darwin_agent import SEDarwinAgent, get_se_darwin_agent  # Agent 12
from .seo_agent import SEOAgent, get_seo_agent  # Agent 13
from .stripe_integration_agent import StripeIntegrationAgent, get_stripe_integration_agent  # Agent 14
from .support_agent import SupportAgent, get_support_agent  # Agent 15
from .commerce_agent import CommerceAgent, get_commerce_agent  # Agent 16
from .domain_agent import DomainAgent, get_domain_agent  # Agent 17

# Tier 2 - Final Batch (NEW)
try:
    from .content_creation_agent import ContentCreationAgent, create_content_creation_agent
except ImportError:
    ContentCreationAgent = None
    create_content_creation_agent = None

try:
    from .seo_optimization_agent import SEOOptimizationAgent, create_seo_optimization_agent
except ImportError:
    SEOOptimizationAgent = None
    create_seo_optimization_agent = None

try:
    from .email_marketing_agent import EmailMarketingAgent, create_email_marketing_agent
except ImportError:
    EmailMarketingAgent = None
    create_email_marketing_agent = None

try:
    from .analytics_agent import AnalyticsAgent, create_analytics_agent
except ImportError:
    AnalyticsAgent = None
    create_analytics_agent = None

__all__ = [
    # Agent Classes (Tier 1)
    "MarketingAgent",
    "BuilderAgent",
    "ContentAgent",
    "DeployAgent",
    "SupportAgent",
    "QAAgent",
    "SEOAgent",
    "EmailAgent",
    "LegalAgent",
    "SecurityAgent",
    "BillingAgent",
    "AnalystAgent",
    "MaintenanceAgent",
    "OnboardingAgent",
    "SpecAgent",
    "BusinessGenerationAgent",
    # Agents 9-17
    "ResearchDiscoveryAgent",
    "SEDarwinAgent",
    "StripeIntegrationAgent",
    "CommerceAgent",
    "DomainAgent",
    # Tier 2
    "DataJuicerAgent",
    "ReActTrainingAgent",
    "AgentScopeRuntimeAgent",
    "LLMJudgeRLAgent",
    "ContentCreationAgent",
    "SEOOptimizationAgent",
    "EmailMarketingAgent",
    "AnalyticsAgent",
    # Factory Functions
    "get_marketing_agent",
    "get_builder_agent",
    "get_content_agent",
    "get_deploy_agent",
    "get_support_agent",
    "get_qa_agent",
    "get_seo_agent",
    "get_email_agent",
    "get_legal_agent",
    "get_security_agent",
    "get_billing_agent",
    "get_analyst_agent",
    "get_maintenance_agent",
    "get_onboarding_agent",
    "get_spec_agent",
    "get_business_generation_agent",
    "get_research_discovery_agent",
    "get_se_darwin_agent",
    "get_seo_agent",
    "get_stripe_integration_agent",
    "get_support_agent",
    "get_commerce_agent",
    "get_domain_agent",
    "create_data_juicer_agent",
    "create_react_training_agent",
    "create_runtime_agent",
    "create_judge_rl_agent",
    "create_content_creation_agent",
    "create_seo_optimization_agent",
    "create_email_marketing_agent",
    "create_analytics_agent",
]
