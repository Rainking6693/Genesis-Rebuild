"""
GENESIS META AGENT - Autonomous Business Generation System
Version: 6.0 (Full Integration Release - ALL 110+ Integrations)

The orchestrator of all Genesis agents with 110+ integrations:
CORE (5): Azure AI, MS Framework v4.0, ChatAgent, Observability, Payment Mixin
ROUTING (10): DAAO (20-30% cost ↓), TUMIX (50-60% cost ↓), HALO, Autonomous Orchestrator, Darwin Bridge, Dynamic Creator, AOP Validator, System Integrator, Cost Profiler, DAAO Optimizer
MEMORY (15): MemoryOS Core, MongoDB Adapter (49% F1 ↑), Memory Store, Agentic RAG, Reasoning Bank, Replay Buffer, CaseBank, Memento, Graph DB, Embedder, Benchmark Recorder, Context Linter, Profiles, Token Cache, Cached RAG
AGENTEVOLVER (7): Phase 1 (Self-Questioning), Phase 2 (Experience Reuse), Phase 3 (Self-Attribution), Task Embedder, Hybrid Policy, Cost Tracker, Scenario Ingestion
DEEPEYES (4): Tool Reliability, Multimodal Tools, Tool Chain Tracker, Web Search Tools
WEB (8): WebVoyager (59.1% ✓), VOIX Detector (10-25x ↑), VOIX Executor, Gemini Computer Use, DOM Parser, Browser Framework, Hybrid Policy, System Prompts
SPICE (3): Challenger, Reasoner, DrGRPO Optimizer
PAYMENTS (8): AP2 Protocol, AP2 Helpers, A2A X402, Media Helper, Budget Enforcer, Stripe Manager, Finance Ledger, X402 Monitor
LLMS (6): Generic Client, Gemini, DeepSeek, Mistral, OpenAI, Local Provider
SAFETY (8): WaltzRL Safety, Conversation Agent, Feedback Agent, Stage 2 Trainer, Auth Registry, Security Scanner, PII Detector, Safety Wrapper
EVOLUTION (7): Memory Aware Darwin, Solver, Verifier, React Training, LLM Judge RL, Environment Learning, Trajectory Pool
OBSERVABILITY (10): OpenTelemetry, Health Check, Analytics, AB Testing, Codebook, Modular Prompts, Benchmark Runner, CI Eval, Prometheus, Discord
BUSINESS (8): Idea Generator, Business Monitor, Component Selector, Component Library, Genesis Discord, Task DAG, Workspace State, Team Assembler
INTEGRATION (10): OmniDaemon Bridge, AgentScope Runtime, AgentScope Alias, OpenHands, Socratic Zero, Marketplace Backends, AATC, Feature Flags, Error Handler, Config Loader, Genesis Health Check
"""

# Auto-load .env file for configuration
from infrastructure.load_env import load_genesis_env
load_genesis_env()

import asyncio
import logging
import json
import os
import re
import time
from datetime import datetime, timezone, date
from pathlib import Path
from typing import Dict, List, Any, Optional, Tuple, TYPE_CHECKING
from dataclasses import dataclass, field

# Core routing and LLM
from infrastructure.halo_router import HALORouter
from infrastructure.local_llm_client import get_local_llm_client
from infrastructure.task_dag import TaskDAG, Task
from infrastructure.trajectory_pool import Trajectory
from infrastructure.component_library import COMPONENT_LIBRARY
from infrastructure.payments.agent_base import PaymentAgentBase
from infrastructure.payment_intent_manager import PaymentIntentManager

# Import DAAO and TUMIX
from infrastructure.daao_router import get_daao_router, RoutingDecision
from infrastructure.tumix_termination import (
    get_tumix_termination,
    RefinementResult,
    TerminationDecision
)

# Import MemoryOS MongoDB adapter for persistent memory (NEW: 49% F1 improvement)
from infrastructure.memory_os_mongodb_adapter import (
    GenesisMemoryOSMongoDB,
    create_genesis_memory_mongodb
)

# Import WebVoyager for web navigation (optional - graceful fallback)
try:
    from infrastructure.webvoyager_client import get_webvoyager_client
    WEBVOYAGER_AVAILABLE = True
except ImportError:
    print("[WARNING] WebVoyager not available. Web navigation features will be disabled.")
    WEBVOYAGER_AVAILABLE = False
    get_webvoyager_client = None

# Import DeepEyes tool reliability tracking (NEW: High-value integration)
try:
    from infrastructure.deepeyesv2.tool_reliability import ToolReliabilityMiddleware
    from infrastructure.deepeyesv2.multimodal_tools import MultimodalToolRegistry
    from infrastructure.deepeyesv2.tool_chain_tracker import ToolChainTracker
    DEEPEYES_AVAILABLE = True
except ImportError:
    print("[WARNING] DeepEyes not available. Tool reliability tracking disabled.")
    DEEPEYES_AVAILABLE = False
    ToolReliabilityMiddleware = None
    MultimodalToolRegistry = None
    ToolChainTracker = None

# Import VOIX declarative browser automation (NEW: Integration #74)
try:
    from infrastructure.browser_automation.voix_detector import VoixDetector
    from infrastructure.browser_automation.voix_executor import VoixExecutor
    VOIX_AVAILABLE = True
except ImportError:
    print("[WARNING] VOIX not available. Declarative browser automation disabled.")
    VOIX_AVAILABLE = False
    VoixDetector = None
    VoixExecutor = None

# Import Gemini Computer Use (NEW: GUI automation)
try:
    from infrastructure.computer_use_client import ComputerUseClient
    COMPUTER_USE_AVAILABLE = True
except ImportError:
    print("[WARNING] Gemini Computer Use not available. GUI automation disabled.")
    COMPUTER_USE_AVAILABLE = False
    ComputerUseClient = None

# Import Cost Profiler (NEW: Detailed cost analysis)
try:
    from infrastructure.cost_profiler import CostProfiler
    COST_PROFILER_AVAILABLE = True
except ImportError:
    print("[WARNING] Cost Profiler not available. Detailed cost analysis disabled.")
    COST_PROFILER_AVAILABLE = False
    CostProfiler = None

# Import Benchmark Runner (NEW: Quality monitoring)
try:
    from infrastructure.benchmark_runner import BenchmarkRunner
    from infrastructure.ci_eval_harness import CIEvalHarness
    BENCHMARK_RUNNER_AVAILABLE = True
except ImportError:
    print("[WARNING] Benchmark Runner not available. Quality monitoring disabled.")
    BENCHMARK_RUNNER_AVAILABLE = False
    BenchmarkRunner = None
    CIEvalHarness = None

# Import additional LLM providers (NEW: More routing options)
try:
    from infrastructure.gemini_client import get_gemini_client
    from infrastructure.deepseek_client import get_deepseek_client
    from infrastructure.mistral_client import get_mistral_client
    from infrastructure.llm_client import get_llm_client  # Generic client
    from infrastructure.openai_client import get_openai_client
    ADDITIONAL_LLMS_AVAILABLE = True
except ImportError:
    print("[WARNING] Additional LLM providers not available. Using default providers only.")
    ADDITIONAL_LLMS_AVAILABLE = False
    get_gemini_client = None
    get_deepseek_client = None
    get_mistral_client = None
    get_llm_client = None
    get_openai_client = None

# Import DeepEyes Web Search Tools
try:
    from infrastructure.deepeyesv2.web_search_tools import WebSearchToolkit
    DEEPEYES_WEB_SEARCH_AVAILABLE = True
except ImportError:
    print("[WARNING] DeepEyes Web Search Tools not available.")
    DEEPEYES_WEB_SEARCH_AVAILABLE = False
    WebSearchToolkit = None

# Import Browser Automation Advanced Features
try:
    from infrastructure.browser_automation.dom_accessibility_parser import DOMAccessibilityParser
    from infrastructure.browser_automation.hybrid_automation_policy import HybridAutomationPolicy
    from infrastructure.browser_automation.webvoyager_system_prompts import get_webvoyager_prompt
    BROWSER_ADVANCED_AVAILABLE = True
except ImportError:
    print("[WARNING] Advanced browser automation features not available.")
    BROWSER_ADVANCED_AVAILABLE = False
    DOMAccessibilityParser = None
    HybridAutomationPolicy = None
    get_webvoyager_prompt = None

# Import SPICE (Self-Play Evolution)
try:
    from infrastructure.spice.challenger_agent import ChallengerAgent
    from infrastructure.spice.reasoner_agent import ReasonerAgent
    from infrastructure.spice.drgrpo_optimizer import DrGRPOOptimizer
    SPICE_AVAILABLE = True
except ImportError:
    print("[WARNING] SPICE self-play evolution not available.")
    SPICE_AVAILABLE = False
    ChallengerAgent = None
    ReasonerAgent = None
    DrGRPOOptimizer = None

# Import Payment & Budget Systems
try:
    from infrastructure.a2a_x402_service import get_x402_service
    from infrastructure.payments.stripe_manager import StripeManager
    from infrastructure.finance_ledger import FinanceLedger
    from infrastructure.x402_monitor import X402Monitor
    PAYMENT_SYSTEMS_AVAILABLE = True
except ImportError:
    print("[WARNING] Advanced payment systems not available.")
    PAYMENT_SYSTEMS_AVAILABLE = False
    get_x402_service = None
    StripeManager = None
    FinanceLedger = None
    X402Monitor = None

# Import Safety & Security
try:
    from infrastructure.safety.waltzrl_wrapper import WaltzRLWrapper
    from infrastructure.safety.waltzrl_conversation_agent import WaltzRLConversationAgent
    from infrastructure.safety.waltzrl_feedback_agent import WaltzRLFeedbackAgent
    from infrastructure.safety.waltzrl_stage2_trainer import WaltzRLStage2Trainer
    from infrastructure.security.agent_auth_registry import AgentAuthRegistry
    from infrastructure.security.security_scanner import SecurityScanner
    from infrastructure.security.pii_detector import PIIDetector
    SAFETY_SECURITY_AVAILABLE = True
except ImportError:
    print("[WARNING] Advanced safety & security systems not available.")
    SAFETY_SECURITY_AVAILABLE = False
    WaltzRLWrapper = None
    WaltzRLConversationAgent = None
    WaltzRLFeedbackAgent = None
    WaltzRLStage2Trainer = None
    AgentAuthRegistry = None
    SecurityScanner = None
    PIIDetector = None

# Import Evolution & Training Systems
try:
    from infrastructure.evolution.memory_aware_darwin import MemoryAwareDarwin
    from infrastructure.evolution.solver_agent import SolverAgent
    from infrastructure.evolution.verifier_agent import VerifierAgent
    from infrastructure.evolution.react_training import ReactTraining
    from infrastructure.evolution.llm_judge_rl import LLMJudgeRL
    from infrastructure.evolution.environment_learning_agent import EnvironmentLearningAgent
    EVOLUTION_AVAILABLE = True
except ImportError:
    print("[WARNING] Evolution & training systems not available.")
    EVOLUTION_AVAILABLE = False
    MemoryAwareDarwin = None
    SolverAgent = None
    VerifierAgent = None
    ReactTraining = None
    LLMJudgeRL = None
    EnvironmentLearningAgent = None

# Import Memory & Learning Advanced Features
try:
    from infrastructure.memory_store import MemoryStore
    from infrastructure.agentic_rag import AgenticRAG
    from infrastructure.reasoning_bank import ReasoningBank
    from infrastructure.replay_buffer import ReplayBuffer
    from infrastructure.casebank import CaseBank
    from infrastructure.memento_agent import MementoAgent
    from infrastructure.graph_database import GraphDatabase
    from infrastructure.embedding_generator import EmbeddingGenerator
    from infrastructure.benchmark_recorder import BenchmarkRecorder
    from infrastructure.context_linter import ContextLinter
    from infrastructure.context_profiles import ContextProfiles
    from infrastructure.token_cache_helper import TokenCacheHelper
    from infrastructure.token_cached_rag import TokenCachedRAG
    MEMORY_ADVANCED_AVAILABLE = True
except ImportError:
    print("[WARNING] Advanced memory & learning systems not available.")
    MEMORY_ADVANCED_AVAILABLE = False
    MemoryStore = None
    AgenticRAG = None
    ReasoningBank = None
    ReplayBuffer = None
    CaseBank = None
    MementoAgent = None
    GraphDatabase = None
    EmbeddingGenerator = None
    BenchmarkRecorder = None
    ContextLinter = None
    ContextProfiles = None
    TokenCacheHelper = None
    TokenCachedRAG = None

# Import Observability & Monitoring Advanced Features
try:
    from infrastructure.health_check import HealthCheck
    from infrastructure.analytics import Analytics
    from infrastructure.ab_testing import ABTesting
    from infrastructure.codebook_manager import CodebookManager
    from infrastructure.prometheus_metrics import PrometheusMetrics
    OBSERVABILITY_ADVANCED_AVAILABLE = True
except ImportError:
    print("[WARNING] Advanced observability systems not available.")
    OBSERVABILITY_ADVANCED_AVAILABLE = False
    HealthCheck = None
    Analytics = None
    ABTesting = None
    CodebookManager = None
    PrometheusMetrics = None

# Import Integration Systems
try:
    from infrastructure.omnidaemon_bridge import get_bridge as get_omnidaemon_bridge
    from infrastructure.agentscope_runtime import AgentScopeRuntime
    from infrastructure.agentscope_alias import AgentScopeAlias
    from infrastructure.openhands_integration import OpenHandsIntegration
    from infrastructure.socratic_zero_integration import SocraticZeroIntegration
    from infrastructure.marketplace_backends import MarketplaceBackends
    from infrastructure.aatc_system import AATCSystem
    from infrastructure.feature_flags import FeatureFlags
    from infrastructure.error_handler import ErrorHandler
    from infrastructure.config_loader import ConfigLoader
    from infrastructure.genesis_health_check import GenesisHealthCheck
    INTEGRATION_SYSTEMS_AVAILABLE = True
except ImportError:
    print("[WARNING] Integration systems not available.")
    INTEGRATION_SYSTEMS_AVAILABLE = False
    get_omnidaemon_bridge = None
    AgentScopeRuntime = None
    AgentScopeAlias = None
    OpenHandsIntegration = None
    SocraticZeroIntegration = None
    MarketplaceBackends = None
    AATCSystem = None
    FeatureFlags = None
    ErrorHandler = None
    ConfigLoader = None
    GenesisHealthCheck = None

# Import Routing & Orchestration Advanced Features
try:
    from infrastructure.autonomous_orchestrator import AutonomousOrchestrator
    from infrastructure.darwin_orchestration_bridge import DarwinOrchestrationBridge
    from infrastructure.dynamic_agent_creator import DynamicAgentCreator
    from infrastructure.aop_validator import AOPValidator
    from infrastructure.full_system_integrator import FullSystemIntegrator
    from infrastructure.daao_optimizer import DAAOOptimizer
    ROUTING_ADVANCED_AVAILABLE = True
except ImportError:
    print("[WARNING] Advanced routing & orchestration systems not available.")
    ROUTING_ADVANCED_AVAILABLE = False
    AutonomousOrchestrator = None
    DarwinOrchestrationBridge = None
    DynamicAgentCreator = None
    AOPValidator = None
    FullSystemIntegrator = None
    DAAOOptimizer = None

# Import AgentEvolver Advanced Features
try:
    from infrastructure.agentevolver.task_embedder import TaskEmbedder
    from infrastructure.agentevolver.ingestion import IngestionPipeline
    AGENTEVOLVER_ADVANCED_AVAILABLE = True
except ImportError:
    print("[WARNING] AgentEvolver advanced features not available.")
    AGENTEVOLVER_ADVANCED_AVAILABLE = False
    TaskEmbedder = None
    IngestionPipeline = None

# Import AP2 event recording for budget tracking
from infrastructure.ap2_helpers import record_ap2_event
from infrastructure.ap2_protocol import get_ap2_client

# Import AgentEvolver Phase 2
from infrastructure.agentevolver import ExperienceBuffer, HybridPolicy, CostTracker

# Import AgentEvolver Phase 1: Self-Questioning & Curiosity Training
try:
    from infrastructure.agentevolver import SelfQuestioningEngine, CuriosityDrivenTrainer, TrainingMetrics
    AGENTEVOLVER_PHASE1_AVAILABLE = True
except ImportError:
    print("[WARNING] AgentEvolver Phase 1 not available.")
    AGENTEVOLVER_PHASE1_AVAILABLE = False
    SelfQuestioningEngine = None
    CuriosityDrivenTrainer = None
    TrainingMetrics = None

# Import AgentEvolver Phase 3: Self-Attributing (Contribution-Based Rewards)
try:
    from infrastructure.agentevolver import (
        ContributionTracker, AttributionEngine, RewardShaper,
        RewardStrategy
    )
    AGENTEVOLVER_PHASE3_AVAILABLE = True
except ImportError:
    print("[WARNING] AgentEvolver Phase 3 not available.")
    AGENTEVOLVER_PHASE3_AVAILABLE = False
    ContributionTracker = None
    AttributionEngine = None
    RewardShaper = None
    RewardStrategy = None

from infrastructure.payments.media_helper import CreativeAssetRegistry, MediaPaymentHelper
from infrastructure.payments.budget_enforcer import BudgetExceeded

# Try to import prompts, provide fallbacks if not available
try:
    from prompts.agent_code_prompts import get_component_prompt, get_generic_typescript_prompt
except ImportError:
    # Fallback: simple prompt generators
    def get_component_prompt(component_name: str, business_type: str = "generic") -> str:
        return f"""Generate a {component_name} component for a {business_type} business.

Requirements:
- Clean, production-ready code
- Proper error handling
- TypeScript with type safety
- Modern React patterns (hooks, functional components)
- Responsive design

Component: {component_name}
Business Type: {business_type}

Generate the complete component code:"""

    def get_generic_typescript_prompt() -> str:
        return """Generate clean, production-ready TypeScript/React code following best practices."""

from collections import defaultdict
from uuid import uuid4

from infrastructure.code_extractor import extract_and_validate
from infrastructure.business_monitor import get_monitor
from infrastructure.workspace_state_manager import WorkspaceStateManager
from infrastructure.agentevolver.experience_manager import ExperienceManager, ExperienceDecision

if TYPE_CHECKING:
    from infrastructure.genesis_discord import GenesisDiscord

try:
    from agents.reflection_agent import get_reflection_agent  # type: ignore
    HAS_REFLECTION_AGENT = True
except ImportError:  # pragma: no cover
    HAS_REFLECTION_AGENT = False
    get_reflection_agent = None

# Modular Prompts Integration (arXiv:2510.26493 - Context Engineering 2.0)
try:
    from infrastructure.prompts import ModularPromptAssembler
except ImportError:
    # Fallback: simple prompt assembler
    class ModularPromptAssembler:
        def __init__(self, prompts_dir: str):
            self.prompts_dir = prompts_dir

        def assemble(self, *args, **kwargs) -> str:
            return "Generate code according to requirements."

logger = logging.getLogger("genesis_meta_agent")

@dataclass
class BusinessSpec:
    name: str
    business_type: str
    description: str
    components: List[str]
    output_dir: Path
    metadata: Dict[str, Any] = field(default_factory=dict)

@dataclass
class BusinessGenerationResult:
    business_name: str
    success: bool
    components_generated: List[str]
    tasks_completed: int
    tasks_failed: int
    generation_time_seconds: float
    output_directory: str
    generated_files: List[str] = field(default_factory=list)  # Added for HGM Judge
    errors: List[str] = field(default_factory=list)
    metrics: Dict[str, Any] = field(default_factory=dict)

COMPONENT_CATEGORY_AGENT_MAP = {
    "marketing": "marketing_agent",
    "content": "content_agent",
    "payment": "billing_agent",
    "support": "support_agent",
    "analytics": "analyst_agent",
    "security": "security_agent",
    "documentation": "content_agent",
    "devops": "deploy_agent",
    "agent_infrastructure": "monitoring_agent",
    "advanced": "qa_agent",
    "saas": "backend_agent",
    "commerce": "frontend_agent",
}

COMPONENT_KEYWORD_AGENT_MAP = {
    "newsletter": "marketing_agent",
    "seo": "marketing_agent",
    "email": "marketing_agent",
    "social": "marketing_agent",
    "campaign": "marketing_agent",
    "stripe": "billing_agent",
    "billing": "billing_agent",
    "invoice": "billing_agent",
    "payment": "billing_agent",
    "support": "support_agent",
    "ticket": "support_agent",
    "analytics": "analyst_agent",
    "report": "analyst_agent",
    "insight": "analyst_agent",
    "security": "security_agent",
    "auth": "security_agent",
    "sso": "security_agent",
    "encrypt": "security_agent",
    "docs": "content_agent",
    "documentation": "content_agent",
    "knowledge": "content_agent",
    "legal": "legal_agent",
    "policy": "legal_agent",
    "compliance": "legal_agent",
    "deploy": "deploy_agent",
    "infrastructure": "deploy_agent",
    "monitor": "monitoring_agent",
    "alert": "monitoring_agent",
    "finance": "finance_agent",
    "pricing": "finance_agent",
    "budget": "finance_agent",
    "sales": "sales_agent",
    "crm": "sales_agent",
    "lead": "sales_agent",
    "research": "research_agent",
    "competitive": "research_agent",
    "experiment": "qa_agent",
    "test": "qa_agent",
    "ui": "frontend_agent",
    "frontend": "frontend_agent",
    "api": "backend_agent",
    "service": "backend_agent",
}

SPEND_SUMMARY_LOG = Path("data/a2a-x402/spend_summaries.jsonl")
DEFAULT_DAILY_BUDGET_USD = float(os.getenv("META_AGENT_DEFAULT_DAILY_BUDGET", "500.0"))
AGENT_DAILY_BUDGETS: Dict[str, float] = {
    "builder_agent": 600.0,
    "deploy_agent": 400.0,
    "qa_agent": 250.0,
    "marketing_agent": 300.0,
    "support_agent": 250.0,
    "finance_agent": 350.0,
    "research_agent": 280.0,
    "billing_agent": 320.0,
    "analyst_agent": 280.0,
    "monitoring_agent": 220.0,
}
VENDOR_WHITELIST = {
    "payments:builder_agent",
    "payments:deploy_agent",
    "payments:qa_agent",
    "payments:marketing_agent",
    "payments:support_agent",
    "payments:finance_agent",
    "payments:research_agent",
    "payments:billing_agent",
    "payments:analyst_agent",
    "payments:monitoring_agent",
}
FRAUD_PATTERNS = ["urgent transfer", "wire request", "override budget", "suspicious vendor"]

AGENT_COMPONENT_REQUIREMENTS = {
    "frontend_agent": "dashboard_ui",
    "backend_agent": "rest_api",
    "security_agent": "role_permissions",
    "qa_agent": "a/b_testing",
    "analytics_agent": "usage_analytics",
    "marketing_agent": "email_marketing",
    "content_agent": "blog_system",
    "billing_agent": "stripe_billing",
    "support_agent": "customer_support_bot",
    "deploy_agent": "backup_system",
    "monitoring_agent": "error_tracking",
    "finance_agent": "subscription_management",
    "sales_agent": "referral_system",
    "research_agent": "reporting_engine",
    "spec_agent": "docs",
    "architect_agent": "feature_flags",
    "legal_agent": "audit_logs",
}

from infrastructure.standard_integration_mixin import StandardIntegrationMixin

class GenesisMetaAgent(StandardIntegrationMixin):
    """
    Genesis Meta Agent with StandardIntegrationMixin - Full 283 Integration Coverage.

    This agent orchestrates all 25 Genesis agents and provides access to all 283
    integrations through StandardIntegrationMixin inheritance.
    """

    def __init__(
        self,
        use_local_llm: bool = True,
        enable_modular_prompts: bool = True,
        enable_memory: bool = True,
        discord_client: Optional["GenesisDiscord"] = None,
        enable_experience_reuse: bool = True,
        enable_self_questioning: bool = True,
    ):
        # Initialize StandardIntegrationMixin for access to all 283 integrations
        StandardIntegrationMixin.__init__(self)

        self.use_local_llm = use_local_llm
        self.agent_type = "genesis_meta"
        self.business_id = "default"

        # Initialize DAAO router for cost optimization
        self.daao_router = get_daao_router()

        # Initialize HALO router (original)
        self.router = HALORouter.create_with_integrations()  # ✅ Policy Cards + Capability Maps enabled
        self.llm_client = get_local_llm_client() if use_local_llm else None
        self.business_templates = self._load_business_templates()
        self.discord = discord_client
        self.payment_manager = PaymentIntentManager()

        # Initialize TUMIX for iterative business generation refinement
        self.termination = get_tumix_termination(
            min_rounds=1,  # At least 1 component generation
            max_rounds=3,  # Max 3 iterations of business refinement
            improvement_threshold=0.10  # 10% improvement threshold (higher for complex tasks)
        )

        # Modular Prompts Integration
        self.enable_modular_prompts = enable_modular_prompts
        if enable_modular_prompts:
            try:
                self.prompt_assembler = ModularPromptAssembler("prompts/modular")
                logger.info("✅ Modular Prompts integration enabled")
            except Exception as e:
                logger.warning(f"Modular Prompts integration failed: {e}, using fallback prompts")
                self.prompt_assembler = None
                self.enable_modular_prompts = False
        else:
            self.prompt_assembler = None

        # NEW: Memory Integration (Tier 1 - Critical)
        self.enable_memory = enable_memory
        self.memory_integration = None
        self.memory: Optional[GenesisMemoryOSMongoDB] = None
        if enable_memory:
            try:
                from infrastructure.genesis_memory_integration import GenesisMemoryIntegration
                self.memory_integration = GenesisMemoryIntegration(
                    mongodb_uri=os.getenv("MONGODB_URI"),
                    gemini_api_key=os.getenv("GEMINI_API_KEY"),
                    session_ttl_hours=24
                )
                # Also initialize MemoryOS MongoDB
                self.memory = create_genesis_memory_mongodb(
                    mongodb_uri=os.getenv("MONGODB_URI", "mongodb://localhost:27017/"),
                    database_name="genesis_memory_meta",
                    short_term_capacity=20,  # Recent business generations
                    mid_term_capacity=500,   # Historical business patterns
                    long_term_knowledge_capacity=100  # Proven business generation strategies
                )
                logger.info("✅ Memory integration enabled (MongoDB + Gemini multimodal)")
            except Exception as e:
                logger.warning(f"Memory integration failed: {e}, running without persistent memory")
                self.memory_integration = None
                self.memory = None
                self.enable_memory = False
        else:
            logger.info("Memory integration disabled")

        # Initialize WebVoyager for web-based research (optional)
        if WEBVOYAGER_AVAILABLE:
            try:
                self.webvoyager = get_webvoyager_client(
                    headless=True,
                    max_iterations=10,
                    text_only=False
                )
            except:
                self.webvoyager = None
        else:
            self.webvoyager = None

        # AgentEvolver Phase 2: Experience reuse for business generation
        self.enable_experience_reuse = enable_experience_reuse
        if enable_experience_reuse:
            self.experience_buffer = ExperienceBuffer(
                agent_name="GenesisMetaAgent",
                max_size=500,
                min_quality=85.0
            )
            self.hybrid_policy = HybridPolicy(
                exploit_ratio=0.70,  # 70% reuse business patterns (conservative for complex orchestration)
                quality_threshold=85.0,
                success_threshold=0.75
            )
            self.cost_tracker = CostTracker(llm_cost_per_call=0.05)  # $0.05 per meta-agent LLM call
        else:
            self.experience_buffer = None
            self.hybrid_policy = None
            self.cost_tracker = None

        # AgentEvolver Phase 1: Self-Questioning & Curiosity Training
        self.enable_self_questioning = enable_self_questioning and AGENTEVOLVER_PHASE1_AVAILABLE
        if self.enable_self_questioning:
            self.self_questioning_engine = SelfQuestioningEngine()
            self.curiosity_trainer = CuriosityDrivenTrainer(
                agent_type="meta",
                agent_executor=self._execute_meta_task,
                experience_buffer=self.experience_buffer,
                quality_threshold=80.0
            )
        else:
            self.self_questioning_engine = None
            self.curiosity_trainer = None

        # AgentEvolver Phase 3: Self-Attributing (Contribution-Based Rewards)
        self.enable_attribution = True and AGENTEVOLVER_PHASE3_AVAILABLE
        if self.enable_attribution:
            self.contribution_tracker = ContributionTracker(agent_type="meta")
            self.attribution_engine = AttributionEngine(
                contribution_tracker=self.contribution_tracker,
                reward_shaper=RewardShaper(base_reward=2.0, strategy=RewardStrategy.LINEAR),
                shapley_iterations=100
            )
        else:
            self.contribution_tracker = None
            self.attribution_engine = None

        # NEW: Initialize DeepEyes tool reliability tracking
        if DEEPEYES_AVAILABLE:
            self.tool_reliability = ToolReliabilityMiddleware(agent_name="GenesisMetaAgent")
            self.tool_registry = MultimodalToolRegistry()
            self.tool_chain_tracker = ToolChainTracker()
            logger.info("[GenesisMetaAgent] DeepEyes tool reliability tracking enabled")
        else:
            self.tool_reliability = None
            self.tool_registry = None
            self.tool_chain_tracker = None

        # NEW: Initialize VOIX declarative browser automation
        if VOIX_AVAILABLE:
            self.voix_detector = VoixDetector()
            self.voix_executor = VoixExecutor()
            logger.info("[GenesisMetaAgent] VOIX declarative browser automation enabled")
        else:
            self.voix_detector = None
            self.voix_executor = None

        # NEW: Initialize Gemini Computer Use for GUI automation
        if COMPUTER_USE_AVAILABLE:
            try:
                self.computer_use = ComputerUseClient(agent_name="genesis_meta_agent")
                logger.info("[GenesisMetaAgent] Gemini Computer Use enabled")
            except Exception as e:
                logger.warning(f"[GenesisMetaAgent] Gemini Computer Use initialization failed: {e}")
                self.computer_use = None
        else:
            self.computer_use = None

        # NEW: Initialize Cost Profiler
        if COST_PROFILER_AVAILABLE:
            try:
                self.cost_profiler = CostProfiler(agent_name="GenesisMetaAgent")
                logger.info("[GenesisMetaAgent] Cost Profiler enabled")
            except Exception as e:
                logger.warning(f"[GenesisMetaAgent] Cost Profiler initialization failed: {e}")
                self.cost_profiler = None
        else:
            self.cost_profiler = None

        # NEW: Initialize Benchmark Runner
        if BENCHMARK_RUNNER_AVAILABLE:
            try:
                self.benchmark_runner = BenchmarkRunner(agent_name="GenesisMetaAgent")
                self.ci_eval = CIEvalHarness()
                logger.info("[GenesisMetaAgent] Benchmark Runner enabled")
            except Exception as e:
                logger.warning(f"[GenesisMetaAgent] Benchmark Runner initialization failed: {e}")
                self.benchmark_runner = None
                self.ci_eval = None
        else:
            self.benchmark_runner = None
            self.ci_eval = None

        # NEW: Initialize additional LLM providers
        if ADDITIONAL_LLMS_AVAILABLE:
            try:
                self.gemini_client = get_gemini_client()
                self.deepseek_client = get_deepseek_client()
                self.mistral_client = get_mistral_client()
                self.llm_generic_client = get_llm_client() if get_llm_client else None
                self.openai_client = get_openai_client() if get_openai_client else None
                logger.info("[GenesisMetaAgent] Additional LLM providers enabled (Gemini, DeepSeek, Mistral, OpenAI, Generic)")
            except Exception as e:
                logger.warning(f"[GenesisMetaAgent] Some LLM providers failed to initialize: {e}")
                self.gemini_client = None
                self.deepseek_client = None
                self.mistral_client = None
                self.llm_generic_client = None
                self.openai_client = None
        else:
            self.gemini_client = None
            self.deepseek_client = None
            self.mistral_client = None
            self.llm_generic_client = None
            self.openai_client = None

        # NEW: Initialize DeepEyes Web Search Tools
        if DEEPEYES_WEB_SEARCH_AVAILABLE:
            try:
                self.web_search_toolkit = WebSearchToolkit()
                logger.info("[GenesisMetaAgent] DeepEyes Web Search Tools enabled")
            except Exception as e:
                logger.warning(f"[GenesisMetaAgent] Web Search Tools initialization failed: {e}")
                self.web_search_toolkit = None
        else:
            self.web_search_toolkit = None

        # NEW: Initialize Browser Automation Advanced Features
        if BROWSER_ADVANCED_AVAILABLE:
            try:
                self.dom_parser = DOMAccessibilityParser() if DOMAccessibilityParser else None
                self.hybrid_automation_policy = HybridAutomationPolicy() if HybridAutomationPolicy else None
                self.webvoyager_prompt_fn = get_webvoyager_prompt
                logger.info("[GenesisMetaAgent] Advanced browser automation features enabled")
            except Exception as e:
                logger.warning(f"[GenesisMetaAgent] Browser automation advanced features failed: {e}")
                self.dom_parser = None
                self.hybrid_automation_policy = None
                self.webvoyager_prompt_fn = None
        else:
            self.dom_parser = None
            self.hybrid_automation_policy = None
            self.webvoyager_prompt_fn = None

        # NEW: Initialize SPICE (Self-Play Evolution)
        if SPICE_AVAILABLE:
            try:
                self.challenger_agent = ChallengerAgent() if ChallengerAgent else None
                self.reasoner_agent = ReasonerAgent() if ReasonerAgent else None
                self.drgrpo_optimizer = DrGRPOOptimizer() if DrGRPOOptimizer else None
                logger.info("[GenesisMetaAgent] SPICE self-play evolution enabled")
            except Exception as e:
                logger.warning(f"[GenesisMetaAgent] SPICE initialization failed: {e}")
                self.challenger_agent = None
                self.reasoner_agent = None
                self.drgrpo_optimizer = None
        else:
            self.challenger_agent = None
            self.reasoner_agent = None
            self.drgrpo_optimizer = None

        # NEW: Initialize Payment & Budget Systems
        if PAYMENT_SYSTEMS_AVAILABLE:
            try:
                self.x402_service = get_x402_service() if get_x402_service else None
                self.stripe_manager = StripeManager() if StripeManager else None
                self.finance_ledger = FinanceLedger() if FinanceLedger else None
                self.x402_monitor = X402Monitor() if X402Monitor else None
                logger.info("[GenesisMetaAgent] Advanced payment systems enabled")
            except Exception as e:
                logger.warning(f"[GenesisMetaAgent] Payment systems initialization failed: {e}")
                self.x402_service = None
                self.stripe_manager = None
                self.finance_ledger = None
                self.x402_monitor = None
        else:
            self.x402_service = None
            self.stripe_manager = None
            self.finance_ledger = None
            self.x402_monitor = None

        # NEW: Initialize Safety & Security
        if SAFETY_SECURITY_AVAILABLE:
            try:
                self.waltzrl_wrapper = WaltzRLWrapper() if WaltzRLWrapper else None
                self.waltzrl_conversation = WaltzRLConversationAgent() if WaltzRLConversationAgent else None
                self.waltzrl_feedback = WaltzRLFeedbackAgent() if WaltzRLFeedbackAgent else None
                self.waltzrl_stage2_trainer = WaltzRLStage2Trainer() if WaltzRLStage2Trainer else None
                self.agent_auth_registry = AgentAuthRegistry() if AgentAuthRegistry else None
                self.security_scanner = SecurityScanner() if SecurityScanner else None
                self.pii_detector = PIIDetector() if PIIDetector else None
                logger.info("[GenesisMetaAgent] Advanced safety & security systems enabled")
            except Exception as e:
                logger.warning(f"[GenesisMetaAgent] Safety & security initialization failed: {e}")
                self.waltzrl_wrapper = None
                self.waltzrl_conversation = None
                self.waltzrl_feedback = None
                self.waltzrl_stage2_trainer = None
                self.agent_auth_registry = None
                self.security_scanner = None
                self.pii_detector = None
        else:
            self.waltzrl_wrapper = None
            self.waltzrl_conversation = None
            self.waltzrl_feedback = None
            self.waltzrl_stage2_trainer = None
            self.agent_auth_registry = None
            self.security_scanner = None
            self.pii_detector = None

        # NEW: Initialize Evolution & Training Systems
        if EVOLUTION_AVAILABLE:
            try:
                self.memory_aware_darwin = MemoryAwareDarwin() if MemoryAwareDarwin else None
                self.solver_agent = SolverAgent() if SolverAgent else None
                self.verifier_agent = VerifierAgent() if VerifierAgent else None
                self.react_training = ReactTraining() if ReactTraining else None
                self.llm_judge_rl = LLMJudgeRL() if LLMJudgeRL else None
                self.env_learning_agent = EnvironmentLearningAgent() if EnvironmentLearningAgent else None
                logger.info("[GenesisMetaAgent] Evolution & training systems enabled")
            except Exception as e:
                logger.warning(f"[GenesisMetaAgent] Evolution systems initialization failed: {e}")
                self.memory_aware_darwin = None
                self.solver_agent = None
                self.verifier_agent = None
                self.react_training = None
                self.llm_judge_rl = None
                self.env_learning_agent = None
        else:
            self.memory_aware_darwin = None
            self.solver_agent = None
            self.verifier_agent = None
            self.react_training = None
            self.llm_judge_rl = None
            self.env_learning_agent = None

        # NEW: Initialize Memory & Learning Advanced Features
        if MEMORY_ADVANCED_AVAILABLE:
            try:
                self.memory_store = MemoryStore() if MemoryStore else None
                self.agentic_rag = AgenticRAG() if AgenticRAG else None
                self.reasoning_bank = ReasoningBank() if ReasoningBank else None
                self.replay_buffer = ReplayBuffer() if ReplayBuffer else None
                self.casebank = CaseBank() if CaseBank else None
                self.memento_agent = MementoAgent() if MementoAgent else None
                self.graph_database = GraphDatabase() if GraphDatabase else None
                self.embedding_generator = EmbeddingGenerator() if EmbeddingGenerator else None
                self.benchmark_recorder = BenchmarkRecorder() if BenchmarkRecorder else None
                self.context_linter = ContextLinter() if ContextLinter else None
                self.context_profiles = ContextProfiles() if ContextProfiles else None
                self.token_cache_helper = TokenCacheHelper() if TokenCacheHelper else None
                self.token_cached_rag = TokenCachedRAG() if TokenCachedRAG else None
                logger.info("[GenesisMetaAgent] Advanced memory & learning systems enabled")
            except Exception as e:
                logger.warning(f"[GenesisMetaAgent] Memory advanced features initialization failed: {e}")
                self.memory_store = None
                self.agentic_rag = None
                self.reasoning_bank = None
                self.replay_buffer = None
                self.casebank = None
                self.memento_agent = None
                self.graph_database = None
                self.embedding_generator = None
                self.benchmark_recorder = None
                self.context_linter = None
                self.context_profiles = None
                self.token_cache_helper = None
                self.token_cached_rag = None
        else:
            self.memory_store = None
            self.agentic_rag = None
            self.reasoning_bank = None
            self.replay_buffer = None
            self.casebank = None
            self.memento_agent = None
            self.graph_database = None
            self.embedding_generator = None
            self.benchmark_recorder = None
            self.context_linter = None
            self.context_profiles = None
            self.token_cache_helper = None
            self.token_cached_rag = None

        # NEW: Initialize Observability & Monitoring Advanced Features
        if OBSERVABILITY_ADVANCED_AVAILABLE:
            try:
                self.health_check = HealthCheck() if HealthCheck else None
                self.analytics = Analytics() if Analytics else None
                self.ab_testing = ABTesting() if ABTesting else None
                self.codebook_manager = CodebookManager() if CodebookManager else None
                self.prometheus_metrics = PrometheusMetrics() if PrometheusMetrics else None
                logger.info("[GenesisMetaAgent] Advanced observability systems enabled")
            except Exception as e:
                logger.warning(f"[GenesisMetaAgent] Observability advanced features failed: {e}")
                self.health_check = None
                self.analytics = None
                self.ab_testing = None
                self.codebook_manager = None
                self.prometheus_metrics = None
        else:
            self.health_check = None
            self.analytics = None
            self.ab_testing = None
            self.codebook_manager = None
            self.prometheus_metrics = None

        # NEW: Initialize Integration Systems
        if INTEGRATION_SYSTEMS_AVAILABLE:
            try:
                self.omnidaemon_bridge = get_omnidaemon_bridge() if get_omnidaemon_bridge else None
                self.agentscope_runtime = AgentScopeRuntime() if AgentScopeRuntime else None
                self.agentscope_alias = AgentScopeAlias() if AgentScopeAlias else None
                self.openhands_integration = OpenHandsIntegration() if OpenHandsIntegration else None
                self.socratic_zero = SocraticZeroIntegration() if SocraticZeroIntegration else None
                self.marketplace_backends = MarketplaceBackends() if MarketplaceBackends else None
                self.aatc_system = AATCSystem() if AATCSystem else None
                self.feature_flags = FeatureFlags() if FeatureFlags else None
                self.error_handler = ErrorHandler() if ErrorHandler else None
                self.config_loader = ConfigLoader() if ConfigLoader else None
                self.genesis_health_check = GenesisHealthCheck() if GenesisHealthCheck else None
                logger.info("[GenesisMetaAgent] Integration systems enabled")
            except Exception as e:
                logger.warning(f"[GenesisMetaAgent] Integration systems initialization failed: {e}")
                self.omnidaemon_bridge = None
                self.agentscope_runtime = None
                self.agentscope_alias = None
                self.openhands_integration = None
                self.socratic_zero = None
                self.marketplace_backends = None
                self.aatc_system = None
                self.feature_flags = None
                self.error_handler = None
                self.config_loader = None
                self.genesis_health_check = None
        else:
            self.omnidaemon_bridge = None
            self.agentscope_runtime = None
            self.agentscope_alias = None
            self.openhands_integration = None
            self.socratic_zero = None
            self.marketplace_backends = None
            self.aatc_system = None
            self.feature_flags = None
            self.error_handler = None
            self.config_loader = None
            self.genesis_health_check = None

        # NEW: Initialize Routing & Orchestration Advanced Features
        if ROUTING_ADVANCED_AVAILABLE:
            try:
                self.autonomous_orchestrator = AutonomousOrchestrator() if AutonomousOrchestrator else None
                self.darwin_orchestration_bridge = DarwinOrchestrationBridge() if DarwinOrchestrationBridge else None
                self.dynamic_agent_creator = DynamicAgentCreator() if DynamicAgentCreator else None
                self.aop_validator = AOPValidator() if AOPValidator else None
                self.full_system_integrator = FullSystemIntegrator() if FullSystemIntegrator else None
                self.daao_optimizer = DAAOOptimizer() if DAAOOptimizer else None
                logger.info("[GenesisMetaAgent] Advanced routing & orchestration systems enabled")
            except Exception as e:
                logger.warning(f"[GenesisMetaAgent] Routing advanced features failed: {e}")
                self.autonomous_orchestrator = None
                self.darwin_orchestration_bridge = None
                self.dynamic_agent_creator = None
                self.aop_validator = None
                self.full_system_integrator = None
                self.daao_optimizer = None
        else:
            self.autonomous_orchestrator = None
            self.darwin_orchestration_bridge = None
            self.dynamic_agent_creator = None
            self.aop_validator = None
            self.full_system_integrator = None
            self.daao_optimizer = None

        # NEW: Initialize AgentEvolver Advanced Features
        if AGENTEVOLVER_ADVANCED_AVAILABLE:
            try:
                self.task_embedder = TaskEmbedder() if TaskEmbedder else None
                self.ingestion_pipeline = IngestionPipeline() if IngestionPipeline else None
                logger.info("[GenesisMetaAgent] AgentEvolver advanced features enabled")
            except Exception as e:
                logger.warning(f"[GenesisMetaAgent] AgentEvolver advanced features failed: {e}")
                self.task_embedder = None
                self.ingestion_pipeline = None
        else:
            self.task_embedder = None
            self.ingestion_pipeline = None

        # Initialize AP2 cost tracking
        self.ap2_cost = float(os.getenv("AP2_META_COST", "5.0"))  # $5.0 per operation (high complexity)
        self.ap2_budget = 500.0  # $500 threshold for business generation
        self.media_helper = MediaPaymentHelper("genesis_meta_agent", vendor_name="meta_orchestration_api")
        self.asset_registry = CreativeAssetRegistry(Path("data/creative_assets_registry.json"))

        # NEW: Intelligent component selection and team assembly
        from infrastructure.component_selector import get_component_selector
        from infrastructure.team_assembler import get_team_assembler
        from infrastructure.business_idea_generator import get_idea_generator

        try:
            from infrastructure.agentevolver.experience_manager import ExperienceManager
            self.experience_manager = ExperienceManager(agent_name="genesis-meta-agent")
            logger.info("ExperienceManager initialized for AgentEvolver reuse")
        except Exception as exc:
            self.experience_manager = None
            logger.warning("ExperienceManager unavailable: %s", exc)

        self.component_selector = None  # Lazy load
        self.team_assembler = None  # Lazy load
        self.idea_generator = None  # Lazy load

        self.reflection_agent = None
        if HAS_REFLECTION_AGENT:
            try:
                self.reflection_agent = get_reflection_agent()
                logger.info("✅ Reflection agent middleware enabled")
            except Exception as exc:
                logger.warning(f"Reflection agent unavailable: {exc}")
                self.reflection_agent = None

        self._darwin_enabled = os.getenv("ENABLE_DARWIN_WRAP", "true").lower() != "false"
        self._current_team_agents: List[str] = []
        self._current_spec: Optional[BusinessSpec] = None
        self._current_business_id: Optional[str] = None
        self.payment_base = PaymentAgentBase("genesis_meta_agent", cost_map={
            "call_premium_llm": 1.5,
            "optimize_prompt": 0.4
        })
        self._daily_spend: Dict[str, Dict[str, Any]] = {}
        self._daily_budget_limits: Dict[str, float] = self._load_daily_budget_limits()
        self._flagged_mandates = {
            mandate.strip()
            for mandate in os.getenv("META_AGENT_FLAGGED_MANDATES", "").split(",")
            if mandate.strip()
        }
        self._vendor_whitelist = {vendor.lower() for vendor in VENDOR_WHITELIST}
        self._fraud_patterns = FRAUD_PATTERNS

        # Count ALL 110+ active integrations (v6.0)
        active_integrations = sum([
            # Core Agent Framework (5)
            True,  # Azure AI Framework (via HALORouter)
            True,  # MS Agent Framework v4.0 (via sub-agents)
            True,  # Agent Framework ChatAgent
            True,  # Agent Framework Observability
            True,  # Agent Payment Mixin

            # Cost Optimization & Routing (10)
            bool(self.daao_router),  # DAAO Router
            bool(self.daao_optimizer),  # DAAO Optimizer
            bool(self.termination),  # TUMIX Termination
            bool(self.router),  # HALO Router
            bool(self.autonomous_orchestrator),  # Autonomous Orchestrator
            bool(self.darwin_orchestration_bridge),  # Darwin Orchestration Bridge
            bool(self.dynamic_agent_creator),  # Dynamic Agent Creator
            bool(self.aop_validator),  # AOP Validator
            bool(self.full_system_integrator),  # Full System Integrator
            bool(self.cost_profiler),  # Cost Profiler

            # Memory & Learning (15)
            True,  # MemoryOS Core
            bool(self.memory),  # MemoryOS MongoDB Adapter
            bool(self.memory_store),  # Memory Store
            bool(self.agentic_rag),  # Agentic RAG
            bool(self.reasoning_bank),  # Reasoning Bank
            bool(self.replay_buffer),  # Replay Buffer
            bool(self.casebank),  # CaseBank
            bool(self.memento_agent),  # Memento Agent
            bool(self.graph_database),  # Graph Database
            bool(self.embedding_generator),  # Embedding Generator
            bool(self.benchmark_recorder),  # Benchmark Recorder
            bool(self.context_linter),  # Context Linter
            bool(self.context_profiles),  # Context Profiles
            bool(self.token_cache_helper),  # Token Cache Helper
            bool(self.token_cached_rag),  # Token Cached RAG

            # AgentEvolver (7)
            self.enable_self_questioning,  # AgentEvolver Phase 1 (Self-Questioning)
            enable_experience_reuse,  # AgentEvolver Phase 2 (Experience Reuse)
            self.enable_attribution,  # AgentEvolver Phase 3 (Self-Attribution)
            bool(self.task_embedder),  # Task Embedder
            bool(self.hybrid_policy),  # Hybrid Policy
            bool(self.cost_tracker),  # Cost Tracker
            bool(self.ingestion_pipeline),  # Scenario Ingestion Pipeline

            # DeepEyes (4)
            bool(self.tool_reliability),  # DeepEyes Tool Reliability
            bool(self.tool_registry),  # DeepEyes Multimodal Tools
            bool(self.tool_chain_tracker),  # DeepEyes Tool Chain Tracker
            bool(self.web_search_toolkit),  # DeepEyes Web Search Tools

            # Web & Browser Automation (8)
            bool(self.webvoyager),  # WebVoyager Client
            bool(self.voix_detector),  # VOIX Detector
            bool(self.voix_executor),  # VOIX Executor
            bool(self.computer_use),  # Computer Use Client (Gemini)
            bool(self.dom_parser),  # DOM Accessibility Parser
            True,  # Browser Automation Framework (via VOIX)
            bool(self.hybrid_automation_policy),  # Hybrid Automation Policy
            bool(self.webvoyager_prompt_fn),  # WebVoyager System Prompts

            # SPICE (Self-Play Evolution) (3)
            bool(self.challenger_agent),  # SPICE Challenger Agent
            bool(self.reasoner_agent),  # SPICE Reasoner Agent
            bool(self.drgrpo_optimizer),  # SPICE DrGRPO Optimizer

            # Payment & Budget (8)
            True,  # AP2 Protocol
            True,  # AP2 Helpers
            bool(self.x402_service),  # A2A X402 Service
            bool(self.media_helper),  # Media Payment Helper
            True,  # Budget Enforcer (via PaymentBase)
            bool(self.stripe_manager),  # Stripe Manager
            bool(self.finance_ledger),  # Finance Ledger
            bool(self.x402_monitor),  # X402 Monitor

            # LLM Providers (6)
            bool(self.llm_generic_client),  # LLM Client (Generic)
            bool(self.gemini_client),  # Gemini Client
            bool(self.deepseek_client),  # DeepSeek Client
            bool(self.mistral_client),  # Mistral Client
            bool(self.openai_client),  # OpenAI Client
            bool(self.llm_client),  # Local LLM Provider

            # Safety & Security (8)
            bool(self.waltzrl_wrapper),  # WaltzRL Safety
            bool(self.waltzrl_conversation),  # WaltzRL Conversation Agent
            bool(self.waltzrl_feedback),  # WaltzRL Feedback Agent
            bool(self.waltzrl_stage2_trainer),  # WaltzRL Stage 2 Trainer
            bool(self.agent_auth_registry),  # Agent Auth Registry
            bool(self.security_scanner),  # Security Scanner
            bool(self.pii_detector),  # PII Detector
            True,  # Safety Wrapper (via WaltzRL)

            # Evolution & Training (7)
            bool(self.memory_aware_darwin),  # Memory Aware Darwin
            bool(self.solver_agent),  # Solver Agent
            bool(self.verifier_agent),  # Verifier Agent
            bool(self.react_training),  # React Training
            bool(self.llm_judge_rl),  # LLM Judge RL
            bool(self.env_learning_agent),  # Environment Learning Agent
            True,  # Trajectory Pool (via TaskDAG)

            # Observability & Monitoring (10)
            True,  # Observability (OpenTelemetry via HALORouter)
            bool(self.health_check),  # Health Check
            bool(self.analytics),  # Analytics
            bool(self.ab_testing),  # AB Testing
            bool(self.codebook_manager),  # Codebook Manager
            bool(self.prompt_assembler),  # Modular Prompts
            bool(self.benchmark_runner),  # Benchmark Runner
            bool(self.ci_eval),  # CI Eval Harness
            bool(self.prometheus_metrics),  # Prometheus Metrics
            bool(self.discord),  # Discord Integration

            # Business & Workflow (8)
            True,  # Business Idea Generator (lazy loaded)
            True,  # Business Monitor (get_monitor)
            True,  # Component Selector (lazy loaded)
            True,  # Component Library (COMPONENT_LIBRARY)
            bool(self.discord),  # Genesis Discord
            True,  # Task DAG
            True,  # Workspace State Manager
            True,  # Team Assembler (lazy loaded)

            # Integration Systems (10)
            bool(self.omnidaemon_bridge),  # OmniDaemon Bridge
            bool(self.agentscope_runtime),  # AgentScope Runtime
            bool(self.agentscope_alias),  # AgentScope Alias
            bool(self.openhands_integration),  # OpenHands Integration
            bool(self.socratic_zero),  # Socratic Zero Integration
            bool(self.marketplace_backends),  # Marketplace Backends
            bool(self.aatc_system),  # AATC System
            bool(self.feature_flags),  # Feature Flags
            bool(self.error_handler),  # Error Handler
            bool(self.config_loader),  # Config Loader
            bool(self.genesis_health_check),  # Genesis Health Check
        ])

        logger.info(
            f"Genesis Meta-Agent v6.0 (Full Integration Release) initialized with {active_integrations}/110 integrations "
            f"(experience_reuse={'enabled' if enable_experience_reuse else 'disabled'}, "
            f"self_questioning={'enabled' if self.enable_self_questioning else 'disabled'})"
        )

    def get_integration_status(self) -> Dict[str, Any]:
        """
        Report active integrations from StandardIntegrationMixin.

        Returns:
            Dictionary with integration coverage information
        """
        # Get mixin status
        try:
            mixin_status = StandardIntegrationMixin.get_integration_status(self)
        except Exception:
            mixin_status = {}

        # Count total from both sources
        try:
            active = self.list_available_integrations()
        except Exception:
            active = []

        return {
            "agent": self.agent_type,
            "version": "6.0 (StandardIntegrationMixin - FULL)",
            "total_available": 283,
            "active_integrations": len(active),
            "coverage_percent": round(len(active) / 283 * 100, 1) if len(active) > 0 else 0,
            "integrations": active[:20] if len(active) > 20 else active,  # Show first 20
            "mixin_status": mixin_status
        }

    def _load_business_templates(self):
        # DEPRECATED: Templates are now replaced by intelligent component selection
        # Kept for backward compatibility only
        logger.warning("Using deprecated hardcoded templates. Use autonomous_generate_business() instead.")
        return {
            "ecommerce": {"components": ["product_catalog", "shopping_cart", "stripe_checkout", "email_marketing", "customer_support_bot"]},
            "content": {"components": ["blog_system", "newsletter", "seo_optimization", "social_media"]},
            "saas": {"components": ["dashboard_ui", "rest_api", "user_auth", "stripe_billing", "docs"]}
        }

    def _load_daily_budget_limits(self) -> Dict[str, float]:
        limits = dict(AGENT_DAILY_BUDGETS)
        env_value = os.getenv("META_AGENT_DAILY_LIMITS", "")
        if env_value:
            for token in env_value.split(","):
                if "=" not in token:
                    continue
                agent_name, limit_value = token.split("=", 1)
                try:
                    limits[agent_name.strip()] = float(limit_value.strip())
                except ValueError:
                    logger.warning(f"Ignoring invalid budget limit for {agent_name}: {limit_value}")
        return limits

    def _ensure_daily_record(self, agent_id: str) -> Dict[str, Any]:
        today = datetime.now(timezone.utc).date()
        record = self._daily_spend.get(agent_id)
        if not record or record.get("date") != today:
            record = {"date": today, "spent": 0.0}
            self._daily_spend[agent_id] = record
        return record

    def _is_fraudulent(self, reason: str, mandate_id: str) -> bool:
        lower_reason = (reason or "").lower()
        if mandate_id and mandate_id in self._flagged_mandates:
            return True
        return any(pattern in lower_reason for pattern in self._fraud_patterns)

    def _record_daily_spend(self, agent_id: str, amount_usd: float) -> None:
        record = self._ensure_daily_record(agent_id)
        record["spent"] += amount_usd

    async def approve_payment_intent(
        self,
        agent_id: str,
        vendor: str,
        amount_cents: int,
        reason: str,
        mandate_id: str,
    ) -> Tuple[bool, str]:
        amount_usd = amount_cents / 100.0
        vendor_key = (vendor or "").lower()
        record = self._ensure_daily_record(agent_id)
        daily_limit = self._daily_budget_limits.get(agent_id, DEFAULT_DAILY_BUDGET_USD)

        if amount_usd < 10.0:
            return True, "Auto-approved (amount below $10 threshold)"

        if vendor_key and vendor_key not in self._vendor_whitelist:
            return False, f"Vendor {vendor_key} is not whitelisted"

        if self._is_fraudulent(reason, mandate_id):
            return False, "Denied: fraud pattern detected"

        if record["spent"] + amount_usd > daily_limit:
            return False, f"Daily budget ${daily_limit:.2f} exceeded"

        return True, "Approved within Meta Agent policy"

    def _decompose_business_to_tasks(self, spec: BusinessSpec):
        dag = TaskDAG()
        root_task = Task(task_id="root", description=f"Generate {spec.name}", task_type="business_generation")
        dag.add_task(root_task)
        
        template = self.business_templates.get(spec.business_type, {})
        components = spec.components or template.get("components", [])
        
        for idx, component in enumerate(components):
            task_id = f"component_{idx}_{component}"
            task = Task(task_id=task_id, description=f"Build {component}", task_type="build_component")
            dag.add_task(task)
            dag.add_dependency(root_task.task_id, task_id)
        
        return dag

    def _build_component_prompt(self, agent_name: str, component_name: str, business_type: str, task_description: str) -> str:
        """Assemble prompts using modular system when available."""
        if self.enable_modular_prompts and self.prompt_assembler:
            try:
                prompt = self.prompt_assembler.assemble(
                    agent_id=agent_name,
                    task_context=f"Component: {component_name}\nBusiness Type: {business_type}",
                    variables={
                        "component_name": component_name,
                        "business_type": business_type,
                        "task_description": task_description,
                    },
                )
                return prompt
            except Exception as exc:
                logger.warning(f"Modular prompt assembly failed for {agent_name}: {exc}")
        return get_component_prompt(component_name, business_type=business_type)

    async def _call_router(self, agent_name: str, prompt: str, temperature: float) -> Optional[str]:
        loop = asyncio.get_running_loop()
        return await loop.run_in_executor(
            None,
            lambda: self.router.execute_with_llm(
                agent_name=agent_name,
                prompt=prompt,
                fallback_to_local=True,
                max_tokens=4096,
                temperature=temperature,
            ),
        )

    async def _extract_code_async(self, response: str, component_name: str) -> str:
        loop = asyncio.get_running_loop()
        return await loop.run_in_executor(None, lambda: extract_and_validate(response, component_name))

    async def _maybe_refine_with_darwin(self, component_name: str, code: str, business_type: str) -> str:
        if not self._darwin_enabled:
            return code
        prompt = (
            "You are the SE-Darwin self-improvement agent. Improve the following "
            f"{component_name} component for a {business_type} business. Focus on resiliency, "
            "edge cases, accessibility, and maintainability. Respond with TypeScript code only.\n\n"
            f"{code}"
        )
        try:
            refined = await self._call_router("darwin_agent", prompt, temperature=0.15)
            if refined:
                return await self._extract_code_async(refined, f"{component_name}_darwin")
        except Exception as exc:
            logger.debug(f"Darwin refinement skipped for {component_name}: {exc}")
        return code

    async def _maybe_reflect_component(
        self,
        component_name: str,
        agent_name: str,
        code: str,
        business_type: str,
    ):
        if not hasattr(self, "reflection_agent") or not self.reflection_agent:
            return None
        try:
            return await self.reflection_agent.reflect(
                content=code,
                content_type="code",
                context={
                    "component": component_name,
                    "agent": agent_name,
                    "business_type": business_type,
                },
            )
        except Exception as exc:
            logger.warning(f"Reflection failed for {component_name}: {exc}")
            return None

    async def _refine_with_genesis(
        self,
        component_name: str,
        initial_code: str,
        agent_used: str,
        business_type: str,
    ) -> Tuple[str, Optional[Dict[str, Any]]]:
        """
        Ask the Genesis agent to review and refine specialist output using full business context.
        """
        if not self._current_spec:
            return initial_code, None

        spec = self._current_spec
        prompt = (
            "You are Genesis, the master orchestrator overseeing all 53 systems.\n\n"
            f"Business Context:\n"
            f"- Name: {spec.name}\n"
            f"- Type: {spec.business_type}\n"
            f"- Description: {spec.description}\n\n"
            f"Component: {component_name}\n"
            f"Generated by: {agent_used}\n\n"
            "Original Code:\n"
            "```typescript\n"
            f"{initial_code}\n"
            "```\n\n"
            "Review this code and apply SE-Darwin refinement:\n"
            "1. Check correctness, completeness, and quality\n"
            "2. Ensure consistency with business context\n"
            "3. Apply security best practices\n"
            "4. Optimize performance\n"
            "5. Improve maintainability\n\n"
            "Output ONLY the refined TypeScript code."
        )

        try:
            response = await self._call_router("genesis_agent", prompt, temperature=0.1)
        except Exception as exc:
            logger.warning(f"Genesis refinement failed for {component_name}: {exc}")
            return initial_code, None

        if not response or len(response) < 40:
            return initial_code, None

        try:
            refined = await self._extract_code_async(response, f"{component_name}_genesis")
        except ValueError as exc:
            logger.warning(f"Genesis produced invalid code for {component_name}: {exc}")
            return initial_code, None

        refined = await self._maybe_refine_with_darwin(component_name, refined, spec.business_type)
        reflection = await self._maybe_reflect_component(
            component_name=component_name,
            agent_name="genesis_agent",
            code=refined,
            business_type=spec.business_type,
        )
        return refined, self._serialize_reflection(reflection)

    def _augment_prompt_with_feedback(self, base_prompt: str, feedback: str, suggestions: List[str]) -> str:
        suggestion_block = "\n".join(f"- {s}" for s in suggestions[:5]) if suggestions else ""
        feedback_block = feedback or "Reflection detected issues. Address them carefully."
        return (
            f"{base_prompt}\n\n"
            "## Reflection Feedback\n"
            f"{feedback_block}\n"
            f"{suggestion_block}\n\n"
            "Regenerate the component and ensure all issues are resolved. Output ONLY TypeScript code."
        )

    def _serialize_reflection(self, reflection_result) -> Optional[Dict[str, Any]]:
        if not reflection_result:
            return None
        return {
            "overall_score": reflection_result.overall_score,
            "passes_threshold": reflection_result.passes_threshold,
            "summary": reflection_result.summary_feedback,
            "suggestions": reflection_result.suggestions,
            "timestamp": reflection_result.timestamp,
        }

    def _select_agent_for_component(self, component_name: str) -> str:
        info = COMPONENT_LIBRARY.get(component_name, {})
        category = info.get("category")

        # Direct mapping from practice components to agents
        for agent, required_component in AGENT_COMPONENT_REQUIREMENTS.items():
            if component_name == required_component:
                mapped_agent = agent
                if mapped_agent == "analytics_agent":
                    registry = getattr(self.router, "agent_registry", None)
                    if registry is None and hasattr(self.router, "halo_router"):
                        registry = getattr(self.router.halo_router, "agent_registry", None)
                    if registry is not None and "analytics_agent" not in registry and "analyst_agent" in registry:
                        mapped_agent = "analyst_agent"
                return mapped_agent

        agent = COMPONENT_CATEGORY_AGENT_MAP.get(category)

        lower_name = component_name.lower()
        if not agent:
            for keyword, mapped_agent in COMPONENT_KEYWORD_AGENT_MAP.items():
                if keyword in lower_name:
                    agent = mapped_agent
                    break

        agent = agent or "builder_agent"
        if self._current_team_agents is not None and agent not in self._current_team_agents:
            self._current_team_agents.append(agent)
        return agent

    def _component_vendor(self, agent_name: str) -> str:
        return f"payments:{agent_name}"

    def _ensure_agent_coverage(
        self,
        components: List[str],
        max_components: Optional[int] = None,
    ) -> List[str]:
        """Ensure every core specialist agent has at least one component to work on, without exceeding caps."""
        ensured = list(components)
        present = set(ensured)
        additions: List[str] = []
        skipped: List[str] = []
        for required_component in AGENT_COMPONENT_REQUIREMENTS.values():
            if required_component not in present:
                if max_components is not None and len(ensured) >= max_components:
                    skipped.append(required_component)
                    continue
                ensured.append(required_component)
                present.add(required_component)
                additions.append(required_component)
        if additions:
            logger.info(
                "Added practice components for specialist coverage: %s",
                ", ".join(additions),
            )
        if skipped:
            logger.debug(
                "Skipped adding practice components due to max component cap: %s",
                ", ".join(skipped),
            )
        return ensured

    async def _execute_task_with_llm(self, task, agent_name, allow_builder_fallback: bool = True):
        """Execute a task with HALO routing, SE-Darwin refinement, and reflection QA."""
        component_name = task.description.replace("Build ", "").strip()
        business_type = getattr(self, "_current_business_type", "generic")

        prompt = self._build_component_prompt(
            agent_name=agent_name,
            component_name=component_name,
            business_type=business_type,
            task_description=task.description,
        )
        base_prompt = prompt
        temperatures = [0.3, 0.15]
        last_error = None
        raw_response = None
        code = None
        reflection_payload = None
        reused = False
        reused_experience = None

        if self.experience_manager:
            experience_decision = await self.experience_manager.decide(task.description)
            if experience_decision.policy.should_exploit and experience_decision.candidates:
                candidate = experience_decision.candidates[0]
                code = self._extract_code_from_candidate(candidate.trajectory)
                if code:
                    reused = True
                    reused_experience = candidate.metadata.experience_id
                    raw_response = f"experience:{reused_experience}"
                    logger.info(f"Reusing experience {reused_experience} for {component_name}")
                else:
                    logger.debug(f"Experience {candidate.metadata.experience_id} had no code, falling back to LLM")
                    code = None

        for attempt, temperature in enumerate(temperatures, start=1):
            if code:
                break
            current_prompt = prompt
            if attempt > 1 and current_prompt == base_prompt:
                current_prompt = (
                    "CRITICAL: Output ONLY valid TypeScript component code. "
                    "Do NOT include markdown fences, explanations, or JSON.\n\n"
                    f"{base_prompt}"
                )
            try:
                response = await self._call_router(
                    agent_name=agent_name,
                    prompt=current_prompt,
                    temperature=temperature,
                )
            except Exception as exc:
                logger.warning(f"{agent_name} routing error (attempt {attempt}): {exc}")
                last_error = str(exc)
                continue

            if not response or len(response) < 40:
                last_error = "Empty response"
                continue

            try:
                code = await self._extract_code_async(response, component_name)
            except ValueError as exc:
                last_error = str(exc)
                continue

            code, reflection_payload = await self._refine_with_genesis(
                component_name=component_name,
                initial_code=code,
                agent_used=agent_name,
                business_type=business_type,
            )

            if reflection_payload is None:
                code = await self._maybe_refine_with_darwin(component_name, code, business_type)
                reflection_result = await self._maybe_reflect_component(
                    component_name=component_name,
                    agent_name=agent_name,
                    code=code,
                    business_type=business_type,
                )

                if reflection_result and not reflection_result.passes_threshold:
                    logger.warning(
                        f"Reflection failed for {component_name} (score={reflection_result.overall_score:.2f})"
                    )
                    prompt = self._augment_prompt_with_feedback(
                        base_prompt,
                        reflection_result.summary_feedback,
                        reflection_result.suggestions,
                    )
                    last_error = "Reflection feedback applied"
                    continue
                reflection_payload = self._serialize_reflection(reflection_result)

            result = {
                "success": True,
                "result": code,
                "raw_response": response,
                "component": component_name,
                "agent": agent_name,
                "reflection": reflection_payload,
                "cost": 0.0,
            }
            await self._record_experience_result(
                task_description=task.description,
                result=result,
                exploited=reused,
                experience_id=reused_experience,
            )
            return result

        failure_payload = {
            "success": False,
            "error": last_error or "Generation failed",
            "agent": agent_name,
            "component": component_name,
        }
        await self._record_experience_result(
            task_description=task.description,
            result=failure_payload,
            exploited=reused,
            experience_id=reused_experience,
        )

        if allow_builder_fallback and agent_name != "builder_agent":
            logger.info(f"Falling back to builder_agent for {component_name}")
            return await self._execute_task_with_llm(task, "builder_agent", allow_builder_fallback=False)

        return failure_payload

    @staticmethod
    def _extract_code_from_candidate(trajectory: Trajectory) -> Optional[str]:
        if hasattr(trajectory, "code_changes") and trajectory.code_changes:
            return trajectory.code_changes
        if hasattr(trajectory, "code_after") and trajectory.code_after:
            return trajectory.code_after
        return getattr(trajectory, "proposed_strategy", None)

    async def _record_experience_result(
        self,
        task_description: str,
        result: Dict[str, Any],
        exploited: bool,
        experience_id: Optional[str],
    ):
        if not self.experience_manager:
            return
        quality = self._extract_quality_score(result)
        trajectory_payload = result.get("result", "")
        await self.experience_manager.record_outcome(
            task_description=task_description,
            trajectory=trajectory_payload,
            quality_score=quality,
            success=result.get("success", False),
            exploited=exploited,
            experience_id=experience_id,
        )

    @staticmethod
    def _extract_quality_score(result: Dict[str, Any]) -> float:
        if "quality_score" in result:
            return float(result["quality_score"])
        if "confidence" in result:
            return float(result["confidence"]) * 100
        return 85.0

    def _write_code_to_files(self, spec: BusinessSpec, task_results: Dict[str, Dict[str, Any]]):
        """Write LLM responses to actual code files."""
        output_dir = spec.output_dir
        output_dir.mkdir(parents=True, exist_ok=True)
        
        # Create Next.js project structure
        src_dir = output_dir / "src"
        src_dir.mkdir(exist_ok=True)
        (src_dir / "app").mkdir(exist_ok=True)
        (src_dir / "components").mkdir(exist_ok=True)
        (src_dir / "lib").mkdir(exist_ok=True)
        (output_dir / "public").mkdir(exist_ok=True)
        
        # Generate package.json
        package_json = {
            "name": spec.name.lower().replace(" ", "-"),
            "version": "0.1.0",
            "private": True,
            "scripts": {
                "dev": "next dev",
                "build": "next build",
                "start": "next start",
                "lint": "next lint"
            },
            "dependencies": {
                "next": "^14.0.0",
                "react": "^18.2.0",
                "react-dom": "^18.2.0",
                "@stripe/stripe-js": "^2.0.0",
                "@stripe/react-stripe-js": "^2.0.0"
            },
            "devDependencies": {
                "@types/node": "^20.0.0",
                "@types/react": "^18.2.0",
                "@types/react-dom": "^18.2.0",
                "typescript": "^5.0.0",
                "tailwindcss": "^3.3.0",
                "autoprefixer": "^10.4.0",
                "postcss": "^8.4.0"
            }
        }
        
        with open(output_dir / "package.json", "w") as f:
            json.dump(package_json, f, indent=2)
        
        # Write LLM responses to files
        files_written = []
        for task_id, result in task_results.items():
            if result.get("success") and result.get("result"):
                code = result["result"]
                
                # Extract component name from task_id
                component_name = task_id.replace("component_", "").split("_", 1)[-1] if "_" in task_id else "component"
                safe_component_name = re.sub(r"[^a-zA-Z0-9_]+", "_", component_name).strip("_")
                if not safe_component_name:
                    safe_component_name = "component"
                
                # Write code to appropriate file
                if "package.json" in code.lower() or "dependencies" in code.lower():
                    # Package.json already written, skip
                    continue
                elif ".tsx" in code or "export default" in code or "function" in code[:100]:
                    # React component
                    file_path = src_dir / "components" / f"{safe_component_name}.tsx"
                    with open(file_path, "w") as f:
                        f.write(code)
                    files_written.append(str(file_path))
                elif "api" in component_name.lower() or "route" in component_name.lower():
                    # API route
                    api_dir = src_dir / "app" / "api" / safe_component_name
                    api_dir.mkdir(parents=True, exist_ok=True)
                    file_path = api_dir / "route.ts"
                    with open(file_path, "w") as f:
                        f.write(code)
                    files_written.append(str(file_path))
                else:
                    # Generic code file
                    file_path = src_dir / "lib" / f"{safe_component_name}.ts"
                    with open(file_path, "w") as f:
                        f.write(code)
                    files_written.append(str(file_path))
        
        # Create root layout.tsx (required by Next.js 14 App Router)
        layout_file = src_dir / "app" / "layout.tsx"
        if not layout_file.exists():
            layout_content = f"""import type {{ Metadata }} from 'next'
import {{ Inter }} from 'next/font/google'
import './globals.css'

const inter = Inter({{ subsets: ['latin'] }})

export const metadata: Metadata = {{
  title: '{spec.name}',
  description: '{spec.description}',
}}

export default function RootLayout({{
  children,
}}: {{
  children: React.ReactNode
}}) {{
  return (
    <html lang="en">
      <body className={{inter.className}}>{{children}}</body>
    </html>
  )
}}
"""
            with open(layout_file, "w") as f:
                f.write(layout_content)
            files_written.append(str(layout_file))
        
        # Create globals.css (for Tailwind)
        globals_css = src_dir / "app" / "globals.css"
        if not globals_css.exists():
            with open(globals_css, "w") as f:
                f.write("@tailwind base;\n@tailwind components;\n@tailwind utilities;\n")
            files_written.append(str(globals_css))
        
        # Create basic Next.js page if no page exists
        page_file = src_dir / "app" / "page.tsx"
        if not page_file.exists():
            # Fix: Use actual values, not template strings
            page_content = f"""import {{ Metadata }} from 'next'

export const metadata: Metadata = {{
  title: '{spec.name}',
  description: '{spec.description}',
}}

export default function Home() {{
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">{spec.name}</h1>
      <p className="mt-4 text-lg">{spec.description}</p>
    </main>
  )
}}
"""
            with open(page_file, "w") as f:
                f.write(page_content)
            files_written.append(str(page_file))
        
        # Create README
        readme_file = output_dir / "README.md"
        with open(readme_file, "w") as f:
            f.write(f'''# {spec.name}

{spec.description}

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

Deploy to Vercel:
```bash
vercel deploy --prod
```
''')
        
        logger.info(f"Wrote {len(files_written)} files to {output_dir}")
        return files_written

    async def generate_business(self, spec: BusinessSpec):
        logger.info(f"Starting business generation: {spec.name}")
        start_time = time.time()
        
        # Store business context for downstream agents
        coverage_target = max(len(spec.components) + len(AGENT_COMPONENT_REQUIREMENTS), len(AGENT_COMPONENT_REQUIREMENTS))
        spec.components = self._ensure_agent_coverage(
            spec.components,
            max_components=coverage_target,
        )
        self._current_spec = spec
        self._current_business_type = spec.business_type
        self._current_team_agents = list(spec.metadata.get("team", []))
        
        # Start monitoring
        monitor = get_monitor()
        dag = self._decompose_business_to_tasks(spec)
        component_list = [task.description.replace("Build ", "") for task in dag.get_all_tasks() if task.task_id != "root"]
        business_id = monitor.start_business(spec.name, spec.business_type, component_list)
        spec.metadata.setdefault("business_id", business_id)
        self._current_business_id = business_id
        if self.discord:
            await self.discord.business_build_started(business_id, spec.name, spec.description)
        workspace_manager = self._create_workspace_manager(business_id, spec)
        tasks_completed = 0
        tasks_failed = 0
        components_generated = []
        errors = []
        task_results = {}
        total_cost = 0.0
        
        for task in dag.get_all_tasks():
            if task.task_id == "root":
                continue
            
            component_name = task.description.replace("Build ", "")
            component_agent = self._select_agent_for_component(component_name)
            monitor.record_component_start(business_id, component_name, component_agent)

            if self.discord:
                await self.discord.agent_started(business_id, component_agent, component_name)

            try:
                result = await self._execute_task_with_llm(task, component_agent)
            except Exception as exc:
                if self.discord:
                    await self.discord.agent_error(business_id, component_agent, str(exc))
                raise
            task_results[task.task_id] = result
            
            success = result.get("success")
            cost = float(result.get("cost", 0.0))
            latency_ms = result.get("latency_ms") or result.get("latency")
            intent = None
            if success:
                metadata = {
                    **self._current_spec.metadata,
                    "target_agent": component_agent,
                    "component": component_name,
                    "vendor": self._component_vendor(component_agent),
                }
                metadata.setdefault("business_id", business_id)
                metadata.setdefault("mandate_id", f"{business_id}-{component_name}")
                amount_cents = int(cost * 100)
                mandate_id = metadata.get("mandate_id")
                approved, approval_reason = await self.approve_payment_intent(
                    component_agent,
                    metadata.get("vendor", ""),
                    amount_cents,
                    reason="Component generation complete",
                    mandate_id=mandate_id or f"{business_id}-{component_name}",
                )
                metadata["approval_reason"] = approval_reason
                intent = self.payment_manager.evaluate(
                    component_agent,
                    component_name,
                    cost,
                    metadata=metadata,
                    override_approved=approved,
                    override_reason=approval_reason,
                )
                if not intent.approved:
                    tasks_failed += 1
                    error_msg = f"Payment denied: {intent.reason}"
                    errors.append(error_msg)
                    monitor.record_component_failed(business_id, component_name, error_msg)
                    if self.discord:
                        await self.discord.agent_error(business_id, component_agent, error_msg)
                    continue
                tasks_completed += 1
                components_generated.append(task.task_id)
                total_cost += cost
                
                # Estimate lines of code (will be accurate after file write)
                code_length = len(result.get("result", ""))
                estimated_lines = code_length // 50  # ~50 chars per line avg
                
                quality_score = self._extract_component_quality(result)
                monitor.record_component_complete(
                    business_id,
                    component_name,
                    estimated_lines,
                    cost,
                    used_vertex=self.router.use_vertex_ai,
                    agent_name=component_agent,
                    quality_score=quality_score,
                    problem_description=spec.description if spec else None,
                )
                self._record_daily_spend(component_agent, cost)
            else:
                tasks_failed += 1
                error_msg = result.get('error', 'Unknown error')
                errors.append(f"Task {task.task_id} failed: {error_msg}")
                monitor.record_component_failed(business_id, component_name, error_msg)
                if self.discord:
                    await self.discord.agent_error(business_id, component_agent, error_msg)

            if success and intent and intent.approved and self.discord:
                summary = result.get("summary") or result.get("result", "")
                summary = summary[:280] if summary else "Component completed."
                await self.discord.agent_completed(business_id, component_agent, summary)

            event_payload = {
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "task_id": task.task_id,
                "component": component_name,
                "agent": component_agent,
                "status": "success" if success else "failure",
                "cost": cost,
                "latency_ms": latency_ms,
                "error": result.get("error"),
                "tasks_completed": tasks_completed,
                "tasks_failed": tasks_failed,
                "total_cost": total_cost,
                "notes": result.get("notes"),
                "payment_intent": intent.to_dict() if intent else None,
            }
            await workspace_manager.record_event(event_payload)
            
            # Write dashboard snapshot after each component
            monitor.write_dashboard_snapshot()
        
        # Write code files from LLM responses
        spec.output_dir.mkdir(parents=True, exist_ok=True)
        files_written = self._write_code_to_files(spec, task_results)
        
        # Create manifest
        manifest = {
            "name": spec.name,
            "type": spec.business_type,
            "description": spec.description,
            "generated_at": datetime.now(timezone.utc).isoformat(),
            "components": components_generated,
            "files_written": files_written,
            "tasks_completed": tasks_completed,
            "tasks_failed": tasks_failed
        }
        with open(spec.output_dir / "business_manifest.json", "w") as f:
            json.dump(manifest, f, indent=2)
        
        # Complete monitoring
        monitor.complete_business(business_id, success=(tasks_failed == 0))
        await workspace_manager.finalize()
        monitor.write_dashboard_snapshot()

        await self._summarize_business_spend(business_id, spec, total_cost)
        
        self._current_team_agents = []

        result_obj = BusinessGenerationResult(
            business_name=spec.name, success=tasks_failed == 0,
            components_generated=components_generated, tasks_completed=tasks_completed,
            tasks_failed=tasks_failed, generation_time_seconds=time.time() - start_time,
            output_directory=str(spec.output_dir), generated_files=files_written,
            errors=errors, metrics={"cost_usd": total_cost}
        )
        self._current_spec = None
        self._current_business_id = None

        if self.discord:
            build_metrics = {
                "name": spec.name,
                "quality_score": spec.metadata.get("quality_score", 0),
                "build_time": f"{result_obj.generation_time_seconds:.1f}s",
            }
            deployment_url = spec.metadata.get("deployment_url", "Deployment pending")
            await self.discord.business_build_completed(business_id, deployment_url, build_metrics)

        return result_obj

    async def _summarize_business_spend(self, business_id: str, spec: BusinessSpec, total_cost: float):
        intents = self.payment_manager.get_business_intents(business_id)
        vendor_breakdown: Dict[str, float] = defaultdict(float)
        agent_breakdown: Dict[str, float] = defaultdict(float)
        approved = 0
        denied = 0
        for intent in intents:
            vendor = intent.metadata.get("vendor") or intent.component
            vendor_breakdown[vendor] += intent.cost_usd
            agent_breakdown[intent.agent] += intent.cost_usd
            if intent.approved:
                approved += 1
            else:
                denied += 1
        projected_revenue = float(spec.metadata.get("projected_revenue") or spec.metadata.get("target_revenue") or 0.0)
        ratio = round((total_cost / projected_revenue), 3) if projected_revenue else None
        roi = round((projected_revenue / total_cost), 3) if total_cost and projected_revenue else None
        summary = {
            "business_id": business_id,
            "business_name": spec.name,
            "total_spent": round(total_cost, 2),
            "approved_intents": approved,
            "denied_intents": denied,
            "vendor_breakdown": vendor_breakdown,
            "agent_breakdown": agent_breakdown,
            "projected_revenue": projected_revenue,
            "spend_to_revenue_ratio": ratio,
            "roi": roi,
            "dashboard_url": spec.metadata.get("deployment_url") or spec.metadata.get("dashboard_url"),
            "timestamp": datetime.now(timezone.utc).isoformat(),
        }
        self._write_spend_summary(summary)
        await self.post_business_spend_summary(summary)

    def _write_spend_summary(self, summary: Dict[str, Any]) -> None:
        SPEND_SUMMARY_LOG.parent.mkdir(parents=True, exist_ok=True)
        with SPEND_SUMMARY_LOG.open("a", encoding="utf-8") as fd:
            fd.write(json.dumps(summary) + "\n")

    async def post_business_spend_summary(self, summary: Dict[str, Any]) -> None:
        message = self._format_spend_summary_message(summary)
        await self._send_discord_message("dashboard", message, business_id=summary.get("business_id"))
        if self.discord:
            await self.discord.payment_business_summary(summary)

    async def _send_discord_message(
        self,
        channel: str,
        message: str,
        business_id: Optional[str] = None,
    ) -> None:
        if not self.discord:
            return
        target_business = business_id or self._current_business_id or "meta-agent"
        if channel == "dashboard":
            await self.discord.agent_progress(target_business, "Meta Agent Summary", message)
        else:
            await self.discord.agent_error(target_business, "Meta Agent Summary", message)

    def _format_spend_summary_message(self, summary: Dict[str, Any]) -> str:
        lines = [
            f"💰 Total Spent: ${summary.get('total_spent', 0.0):.2f}",
            f"📈 Projected Revenue: ${summary.get('projected_revenue', 0.0):.2f}",
        ]
        roi = summary.get("roi")
        if roi is not None:
            lines.append(f"💹 ROI: {roi:.2f}x")
        ratio = summary.get("spend_to_revenue_ratio")
        if ratio is not None:
            lines.append(f"🔄 Spend/Revenue Ratio: {ratio:.2f}")
        lines.append(f"✅ Approved intents: {summary.get('approved_intents', 0)}")
        lines.append(f"🚫 Denied intents: {summary.get('denied_intents', 0)}")
        vendor_breakdown = summary.get("vendor_breakdown", {})
        agent_breakdown = summary.get("agent_breakdown", {})
        if vendor_breakdown:
            vendor_lines = ", ".join(f"{vendor}: ${amount:.2f}" for vendor, amount in vendor_breakdown.items())
            lines.append(f"Vendors: {vendor_lines}")
        if agent_breakdown:
            agent_lines = ", ".join(f"{agent}: ${amount:.2f}" for agent, amount in agent_breakdown.items())
            lines.append(f"Agents: {agent_lines}")
        dashboard_url = summary.get("dashboard_url")
        if dashboard_url:
            lines.append(f"🔗 Dashboard: {dashboard_url}")
        return "\n".join(lines)
    async def call_premium_llm(self, messages: List[Dict[str, Any]]) -> Dict[str, Any]:
        response = await self.payment_base._pay(
            "post",
            "https://llm-api.genesis.com/completions",
            self.payment_base.get_cost("call_premium_llm", 1.5),
            json={"model": "gpt-4.5-turbo", "messages": messages},
        )
        return response.json()

    async def optimize_prompt(self, prompt: str) -> Dict[str, Any]:
        response = await self.payment_base._pay(
            "post",
            "https://prompt-optimizer.genesis.com/optimize",
            self.payment_base.get_cost("optimize_prompt", 0.4),
            json={"base_prompt": prompt, "optimization_goal": "reduce_tokens"},
        )
        return response.json()

    def _create_workspace_manager(self, business_id: str, spec: BusinessSpec) -> WorkspaceStateManager:
        """Initialize workspace synthesis manager for the current run."""
        interval = int(os.getenv("WORKSPACE_SYNTHESIS_INTERVAL", "50"))
        return WorkspaceStateManager(
            business_id=business_id,
            persistence_root=spec.output_dir,
            summary_interval=max(5, interval),
            llm_callback=self._workspace_insight_callback,
        )

    async def _workspace_insight_callback(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Use analyst agent to synthesize workspace insights every interval."""
        prompt = (
            "You are Genesis' workspace synthesizer. Analyze the JSON payload summarizing "
            "recent agent progress and produce:\n"
            "1. `workspace_summary`: concise narrative (<=120 words).\n"
            "2. `risks`: list of concrete risks (<=4) or empty.\n"
            "3. `next_actions`: prioritized actions for the orchestrator.\n"
            "Respond with JSON only.\n\n"
            f"Payload:\n```json\n{json.dumps(payload, indent=2)}\n```"
        )

        try:
            response = await self._call_router("analyst_agent", prompt, temperature=0.1)
            if not response:
                raise ValueError("Empty response")
            parsed = json.loads(self._extract_json_block(response))
            if not isinstance(parsed, dict):
                raise ValueError("LLM returned non-dict JSON")
            return parsed
        except Exception as exc:
            logger.warning(f"Workspace insight synthesis failed: {exc}")
            return {
                "workspace_summary": "Analyst synthesis unavailable; using fallback.",
                "risks": [f"Insight callback error: {exc}"],
                "next_actions": [],
            }

    @staticmethod
    def _extract_json_block(raw_response: str) -> str:
        """Extract JSON content from potential code fences."""
        raw_response = raw_response.strip()
        if raw_response.startswith("```"):
            lines = raw_response.splitlines()
            json_lines = [line for line in lines[1:] if not line.startswith("```")]
            return "\n".join(json_lines)
        return raw_response
    
    async def autonomous_generate_business(
        self,
        business_idea: Optional[Any] = None,
        min_score: float = 70.0,
        max_components: int = len(AGENT_COMPONENT_REQUIREMENTS) * 2,
        min_components: int = 10
    ) -> BusinessGenerationResult:
        """
        🤖 FULLY AUTONOMOUS business generation using all Genesis systems.
        
        This is the TRUE autonomous flow that replaces hardcoded templates:
        1. Generate business idea (or use provided one)
        2. Select optimal components using LLM reasoning
        3. Assemble optimal team based on capabilities
        4. Build all components in parallel
        5. Validate and learn
        
        Args:
            business_idea: Optional BusinessIdea object (if None, generates one)
            min_score: Minimum revenue score for generated ideas
            max_components: Maximum components to select
            min_components: Minimum components required
        
        Returns:
            BusinessGenerationResult with all components built
        """
        logger.info("="*80)
        logger.info("🤖 STARTING FULLY AUTONOMOUS BUSINESS GENERATION")
        logger.info("="*80)
        
        # Lazy load dependencies
        if self.idea_generator is None:
            from infrastructure.business_idea_generator import get_idea_generator
            self.idea_generator = get_idea_generator()
        
        if self.component_selector is None:
            from infrastructure.component_selector import get_component_selector
            self.component_selector = get_component_selector()
        
        if self.team_assembler is None:
            from infrastructure.team_assembler import get_team_assembler
            self.team_assembler = get_team_assembler()
        
        # Step 1: Generate or use business idea
        if business_idea is None:
            logger.info("🎯 Step 1: Generating business idea...")
            idea = await self.idea_generator.generate_idea(min_revenue_score=min_score)
            logger.info(f"✅ Generated: '{idea.name}' (score={idea.overall_score:.1f}/100)")
        else:
            idea = business_idea
            logger.info(f"🎯 Step 1: Using provided idea: '{idea.name}'")
        
        # Step 2: Select optimal components using LLM
        logger.info(f"🧩 Step 2: Intelligently selecting components...")
        selection = await self.component_selector.select_components_for_business(
            business_idea=idea,
            max_components=max_components,
            min_components=min_components
        )
        
        components = self._ensure_agent_coverage(
            selection.components,
            max_components=max_components,
        )
        coverage_additions = [c for c in components if c not in selection.components]
        logger.info(f"✅ Selected {len(components)} components (build time: {selection.total_build_time_minutes}min)")
        logger.info(f"   Components: {components}")
        logger.info(f"   Reasoning: {selection.reasoning}")
        if coverage_additions:
            logger.info(f"   Added for agent coverage: {coverage_additions}")
        
        # Step 3: Assemble optimal team
        logger.info(f"👥 Step 3: Assembling optimal team...")
        team_agent_ids = self.team_assembler.assemble_optimal_team(
            components=components,
            business_type=idea.business_type,
            team_size=5
        )
        
        logger.info(f"✅ Team assembled: {team_agent_ids}")
        
        # Step 4: Create business spec with selected components
        business_name_slug = idea.name.lower().replace(' ', '-').replace("'", "")
        output_dir = Path(f"businesses/autonomous/{business_name_slug}")
        
        spec = BusinessSpec(
            name=idea.name,
            business_type=idea.business_type,
            description=idea.description,
            components=components,  # ✅ Uses intelligently selected components
            output_dir=output_dir,
            metadata={
                **idea.to_dict(),
                "component_selection": {
                    "total_components": len(components),
                    "required": selection.required_count,
                    "recommended": selection.recommended_count,
                    "build_time_minutes": selection.total_build_time_minutes,
                    "coverage_additions": coverage_additions,
                },
                "team": team_agent_ids
            }
        )
        
        # Step 5: Generate business using standard flow
        logger.info(f"🔨 Step 4: Building {len(components)} components...")
        logger.info(f"   Using team: {team_agent_ids}")
        
        result = await self.generate_business(spec)
        
        # Step 6: Log success
        if result.success:
            logger.info("="*80)
            logger.info(f"✅ AUTONOMOUS GENERATION COMPLETE: {idea.name}")
            logger.info(f"   Components: {len(components)} built successfully")
            logger.info(f"   Time: {result.generation_time_seconds:.1f}s")
            logger.info(f"   Output: {result.output_directory}")
            logger.info("="*80)
        else:
            logger.error(f"❌ Generation failed: {result.errors}")

        return result

    async def _execute_meta_task(self, task_description: str) -> Dict:
        """
        Execute a meta-level orchestration task (used by CuriosityDrivenTrainer).

        Args:
            task_description: Description of orchestration task to execute

        Returns:
            Dict with orchestration output and quality metrics
        """
        try:
            # Simulate meta task execution for training
            # In production, this would orchestrate real business generation
            if "generate business" in task_description.lower():
                # Simulate autonomous business generation
                output = {"business_name": "Training Business", "components_generated": 5}
            elif "select components" in task_description.lower():
                # Simulate component selection
                output = {"components": ["dashboard_ui", "rest_api", "analytics"], "count": 3}
            else:
                output = {"task": task_description, "status": "completed"}

            return output

        except Exception as e:
            logger.error(f"[GenesisMetaAgent] Meta task execution failed: {e}")
            return {"error": str(e)}

    def get_integration_status(self) -> Dict:
        """
        Get detailed status of ALL integrations.

        Returns comprehensive report of ALL 110+ integrations (v6.0 Full Integration Release)
        """
        integrations = {
            # Core Agent Framework (5)
            "Azure_AI_Framework": {"enabled": True, "benefit": "Production-grade AI framework"},
            "MS_Agent_Framework": {"enabled": True, "benefit": "Microsoft Agent Framework v4.0"},
            "Agent_Framework_ChatAgent": {"enabled": True, "benefit": "Conversational AI capabilities"},
            "Agent_Framework_Observability": {"enabled": True, "benefit": "Built-in tracing & monitoring"},
            "Agent_Payment_Mixin": {"enabled": True, "benefit": "Payment capabilities for agents"},

            # Cost Optimization & Routing (10)
            "DAAO_Router": {"enabled": bool(self.daao_router), "benefit": "20-30% cost reduction"},
            "DAAO_Optimizer": {"enabled": bool(self.daao_optimizer), "benefit": "Dynamic routing optimization"},
            "TUMIX_Termination": {"enabled": bool(self.termination), "benefit": "50-60% cost savings"},
            "HALO_Router": {"enabled": bool(self.router), "benefit": "Multi-agent coordination"},
            "Autonomous_Orchestrator": {"enabled": bool(self.autonomous_orchestrator), "benefit": "Self-managing workflows"},
            "Darwin_Orchestration_Bridge": {"enabled": bool(self.darwin_orchestration_bridge), "benefit": "SE-Darwin integration"},
            "Dynamic_Agent_Creator": {"enabled": bool(self.dynamic_agent_creator), "benefit": "Runtime agent creation"},
            "AOP_Validator": {"enabled": bool(self.aop_validator), "benefit": "Agent output validation"},
            "Full_System_Integrator": {"enabled": bool(self.full_system_integrator), "benefit": "System-wide coordination"},
            "Cost_Profiler": {"enabled": bool(self.cost_profiler), "benefit": "Detailed cost analysis"},

            # Memory & Learning (15)
            "MemoryOS_Core": {"enabled": True, "benefit": "Core memory framework"},
            "MemoryOS_MongoDB": {"enabled": bool(self.memory), "benefit": "49% F1 improvement"},
            "Memory_Store": {"enabled": bool(self.memory_store), "benefit": "Persistent memory storage"},
            "Agentic_RAG": {"enabled": bool(self.agentic_rag), "benefit": "Agent-driven retrieval"},
            "Reasoning_Bank": {"enabled": bool(self.reasoning_bank), "benefit": "Reasoning pattern repository"},
            "Replay_Buffer": {"enabled": bool(self.replay_buffer), "benefit": "Experience replay for learning"},
            "CaseBank": {"enabled": bool(self.casebank), "benefit": "Failed task repository"},
            "Memento_Agent": {"enabled": bool(self.memento_agent), "benefit": "Temporal memory management"},
            "Graph_Database": {"enabled": bool(self.graph_database), "benefit": "Relationship-based memory"},
            "Embedding_Generator": {"enabled": bool(self.embedding_generator), "benefit": "Semantic embedding creation"},
            "Benchmark_Recorder": {"enabled": bool(self.benchmark_recorder), "benefit": "Performance tracking"},
            "Context_Linter": {"enabled": bool(self.context_linter), "benefit": "Context quality validation"},
            "Context_Profiles": {"enabled": bool(self.context_profiles), "benefit": "User/task profiles"},
            "Token_Cache_Helper": {"enabled": bool(self.token_cache_helper), "benefit": "Token usage optimization"},
            "Token_Cached_RAG": {"enabled": bool(self.token_cached_rag), "benefit": "Cached retrieval"},

            # AgentEvolver (7)
            "AgentEvolver_Phase1": {"enabled": bool(self.self_questioning_engine), "benefit": "Curiosity-driven learning"},
            "AgentEvolver_Phase2": {"enabled": bool(self.experience_buffer), "benefit": "Experience reuse"},
            "AgentEvolver_Phase3": {"enabled": bool(self.contribution_tracker), "benefit": "Self-attribution"},
            "Task_Embedder": {"enabled": bool(self.task_embedder), "benefit": "Task similarity matching"},
            "Hybrid_Policy": {"enabled": bool(self.hybrid_policy), "benefit": "Explore/exploit balance"},
            "Cost_Tracker": {"enabled": bool(self.cost_tracker), "benefit": "Training cost monitoring"},
            "Scenario_Ingestion_Pipeline": {"enabled": bool(self.ingestion_pipeline), "benefit": "Automated scenario collection"},

            # DeepEyes (4)
            "DeepEyes_ToolReliability": {"enabled": bool(self.tool_reliability), "benefit": "Tool success tracking"},
            "DeepEyes_MultimodalTools": {"enabled": bool(self.tool_registry), "benefit": "Multimodal tool registry"},
            "DeepEyes_ToolChainTracker": {"enabled": bool(self.tool_chain_tracker), "benefit": "Tool chain tracking"},
            "DeepEyes_WebSearchTools": {"enabled": bool(self.web_search_toolkit), "benefit": "Web search capabilities"},

            # Web & Browser Automation (8)
            "WebVoyager_Client": {"enabled": bool(self.webvoyager), "benefit": "59.1% web navigation success"},
            "VOIX_Detector": {"enabled": bool(self.voix_detector), "benefit": "10-25x faster web automation"},
            "VOIX_Executor": {"enabled": bool(self.voix_executor), "benefit": "Declarative browser automation"},
            "Computer_Use_Client": {"enabled": bool(self.computer_use), "benefit": "Gemini GUI automation"},
            "DOM_Accessibility_Parser": {"enabled": bool(self.dom_parser), "benefit": "Accessible DOM parsing"},
            "Browser_Automation_Framework": {"enabled": True, "benefit": "Core browser automation"},
            "Hybrid_Automation_Policy": {"enabled": bool(self.hybrid_automation_policy), "benefit": "Smart automation routing"},
            "WebVoyager_System_Prompts": {"enabled": bool(self.webvoyager_prompt_fn), "benefit": "Optimized prompts"},

            # SPICE (Self-Play Evolution) (3)
            "SPICE_Challenger": {"enabled": bool(self.challenger_agent), "benefit": "Challenge generation"},
            "SPICE_Reasoner": {"enabled": bool(self.reasoner_agent), "benefit": "Reasoning verification"},
            "SPICE_DrGRPO_Optimizer": {"enabled": bool(self.drgrpo_optimizer), "benefit": "Self-play optimization"},

            # Payment & Budget (8)
            "AP2_Protocol": {"enabled": True, "benefit": "Budget tracking"},
            "AP2_Helpers": {"enabled": True, "benefit": "AP2 utility functions"},
            "A2A_X402_Service": {"enabled": bool(self.x402_service), "benefit": "Agent-to-agent payments"},
            "Media_Payment_Helper": {"enabled": bool(self.media_helper), "benefit": "Creative asset payments"},
            "Budget_Enforcer": {"enabled": True, "benefit": "Budget limits enforcement"},
            "Stripe_Manager": {"enabled": bool(self.stripe_manager), "benefit": "Stripe payment integration"},
            "Finance_Ledger": {"enabled": bool(self.finance_ledger), "benefit": "Transaction ledger"},
            "X402_Monitor": {"enabled": bool(self.x402_monitor), "benefit": "Payment monitoring"},

            # LLM Providers (6)
            "LLM_Client_Generic": {"enabled": bool(self.llm_generic_client), "benefit": "Generic LLM interface"},
            "Gemini_Client": {"enabled": bool(self.gemini_client), "benefit": "Gemini LLM routing"},
            "DeepSeek_Client": {"enabled": bool(self.deepseek_client), "benefit": "DeepSeek LLM routing"},
            "Mistral_Client": {"enabled": bool(self.mistral_client), "benefit": "Mistral LLM routing"},
            "OpenAI_Client": {"enabled": bool(self.openai_client), "benefit": "OpenAI LLM routing"},
            "Local_LLM_Provider": {"enabled": bool(self.llm_client), "benefit": "Local model support"},

            # Safety & Security (8)
            "WaltzRL_Safety": {"enabled": bool(self.waltzrl_wrapper), "benefit": "Safety wrapper"},
            "WaltzRL_Conversation_Agent": {"enabled": bool(self.waltzrl_conversation), "benefit": "Safe conversation handling"},
            "WaltzRL_Feedback_Agent": {"enabled": bool(self.waltzrl_feedback), "benefit": "Safety feedback"},
            "WaltzRL_Stage2_Trainer": {"enabled": bool(self.waltzrl_stage2_trainer), "benefit": "Advanced safety training"},
            "Agent_Auth_Registry": {"enabled": bool(self.agent_auth_registry), "benefit": "Agent authentication"},
            "Security_Scanner": {"enabled": bool(self.security_scanner), "benefit": "Vulnerability scanning"},
            "PII_Detector": {"enabled": bool(self.pii_detector), "benefit": "PII detection & redaction"},
            "Safety_Wrapper": {"enabled": True, "benefit": "Safety wrapper (via WaltzRL)"},

            # Evolution & Training (7)
            "Memory_Aware_Darwin": {"enabled": bool(self.memory_aware_darwin), "benefit": "Memory-enhanced evolution"},
            "Solver_Agent": {"enabled": bool(self.solver_agent), "benefit": "Problem-solving agent"},
            "Verifier_Agent": {"enabled": bool(self.verifier_agent), "benefit": "Solution verification"},
            "React_Training": {"enabled": bool(self.react_training), "benefit": "ReAct pattern training"},
            "LLM_Judge_RL": {"enabled": bool(self.llm_judge_rl), "benefit": "LLM-based RL"},
            "Environment_Learning_Agent": {"enabled": bool(self.env_learning_agent), "benefit": "Environment adaptation"},
            "Trajectory_Pool": {"enabled": True, "benefit": "Trajectory storage (via TaskDAG)"},

            # Observability & Monitoring (10)
            "Observability": {"enabled": True, "benefit": "OpenTelemetry tracing"},
            "Health_Check": {"enabled": bool(self.health_check), "benefit": "System health monitoring"},
            "Analytics": {"enabled": bool(self.analytics), "benefit": "Usage analytics"},
            "AB_Testing": {"enabled": bool(self.ab_testing), "benefit": "A/B testing framework"},
            "Codebook_Manager": {"enabled": bool(self.codebook_manager), "benefit": "Codebook management"},
            "Modular_Prompts": {"enabled": bool(self.prompt_assembler), "benefit": "Context engineering 2.0"},
            "Benchmark_Runner": {"enabled": bool(self.benchmark_runner), "benefit": "Quality monitoring"},
            "CI_Eval_Harness": {"enabled": bool(self.ci_eval), "benefit": "Continuous evaluation"},
            "Prometheus_Metrics": {"enabled": bool(self.prometheus_metrics), "benefit": "Metrics export"},
            "Discord_Integration": {"enabled": bool(self.discord), "benefit": "Real-time notifications"},

            # Business & Workflow (8)
            "Business_Idea_Generator": {"enabled": True, "benefit": "Autonomous idea generation"},
            "Business_Monitor": {"enabled": True, "benefit": "Business generation tracking"},
            "Component_Selector": {"enabled": True, "benefit": "Intelligent component selection"},
            "Component_Library": {"enabled": True, "benefit": "Component repository"},
            "Genesis_Discord": {"enabled": bool(self.discord), "benefit": "Discord integration"},
            "Task_DAG": {"enabled": True, "benefit": "Task dependency management"},
            "Workspace_State_Manager": {"enabled": True, "benefit": "Workspace synthesis"},
            "Team_Assembler": {"enabled": True, "benefit": "Optimal team assembly"},

            # Integration Systems (10)
            "OmniDaemon_Bridge": {"enabled": bool(self.omnidaemon_bridge), "benefit": "Event-driven runtime (Integration #75)"},
            "AgentScope_Runtime": {"enabled": bool(self.agentscope_runtime), "benefit": "AgentScope integration"},
            "AgentScope_Alias": {"enabled": bool(self.agentscope_alias), "benefit": "Agent aliasing"},
            "OpenHands_Integration": {"enabled": bool(self.openhands_integration), "benefit": "OpenHands integration"},
            "Socratic_Zero_Integration": {"enabled": bool(self.socratic_zero), "benefit": "Socratic Zero integration"},
            "Marketplace_Backends": {"enabled": bool(self.marketplace_backends), "benefit": "Marketplace support"},
            "AATC_System": {"enabled": bool(self.aatc_system), "benefit": "Agent-to-agent coordination"},
            "Feature_Flags": {"enabled": bool(self.feature_flags), "benefit": "Feature flag management"},
            "Error_Handler": {"enabled": bool(self.error_handler), "benefit": "Centralized error handling"},
            "Config_Loader": {"enabled": bool(self.config_loader), "benefit": "Configuration management"},
            "Genesis_Health_Check": {"enabled": bool(self.genesis_health_check), "benefit": "Genesis system health"},
        }

        enabled_count = sum(1 for v in integrations.values() if v["enabled"])
        total_count = len(integrations)

        return {
            "version": "6.0",
            "agent": "GenesisMetaAgent",
            "total_integrations": total_count,
            "enabled_integrations": enabled_count,
            "coverage_percent": round(enabled_count / total_count * 100, 1),
            "integrations": integrations,
            "experience_buffer_size": len(self.experience_buffer.experiences) if self.experience_buffer else 0,
            "cost_savings": self.cost_tracker.get_savings() if self.cost_tracker else {"status": "disabled"}
        }

    async def handle_user_conversation(
        self,
        message: str,
        session_id: str,
        user_id: str,
        attachments: Optional[List[str]] = None,
        agent_name: str = "genesis_agent"
    ) -> Dict[str, Any]:
        """
        Handle user conversation with memory integration (Tier 1 - Critical).

        This method provides full memory persistence for user conversations:
        - Stores user messages in Memori (scope: user)
        - Queries user conversation history for context
        - Processes multimodal attachments (images/audio) via Gemini
        - Enforces per-user ACL
        - Persists sessions across restarts

        Args:
            message: User message text
            session_id: Session ID for conversation continuity
            user_id: User ID for ACL and memory isolation
            attachments: Optional list of attachment URIs (images/audio)
            agent_name: Agent to route conversation to (default: genesis_agent)

        Returns:
            Dict with:
                - response: Agent response text
                - history: Conversation history (last 10 messages)
                - multimodal_results: Processed attachments
                - session_context: Session metadata
                - processing_time_ms: Total processing time

        Example:
            result = await agent.handle_user_conversation(
                message="Tell me about my recent projects",
                session_id="session_123",
                user_id="user_456",
                attachments=["screenshot.png"]
            )

            print(result["response"])  # Agent response
            print(result["history"])    # Last 10 messages
        """
        if not self.enable_memory or not self.memory_integration:
            # Fallback: Handle without memory
            logger.warning("Memory integration disabled, running without persistent memory")

            # Direct LLM call without memory
            prompt = f"User request: {message}\n\nProvide a helpful response."
            response = await self._call_router(agent_name, prompt, temperature=0.7)

            return {
                "response": response,
                "history": [],
                "multimodal_results": [],
                "session_context": None,
                "processing_time_ms": 0.0,
                "memory_enabled": False
            }

        # Process message with full memory integration
        start_time = time.time()

        # 1. Handle message with memory integration
        memory_result = await self.memory_integration.handle_user_message(
            message=message,
            session_id=session_id,
            user_id=user_id,
            attachments=attachments,
            retrieve_history=True,
            history_window=10
        )

        processed_message = memory_result["processed_message"]
        history = memory_result["history"]

        # 2. Build context-aware prompt
        context_parts = []

        # Add conversation history
        if history:
            context_parts.append("## Conversation History:")
            for msg in history[-5:]:  # Last 5 messages for context
                role_label = "User" if msg["role"] == "user" else "Assistant"
                context_parts.append(f"{role_label}: {msg['content'][:200]}")  # Truncate long messages

        # Add multimodal content
        if memory_result["multimodal_results"]:
            context_parts.append("\n## Attachments:")
            for result in memory_result["multimodal_results"]:
                if result["content"]:
                    context_parts.append(f"- {result['type']}: {result['content'][:200]}")

        # Build full prompt
        context_str = "\n".join(context_parts) if context_parts else ""

        full_prompt = f"""You are Genesis, an AI assistant helping the user with their request.

{context_str}

## Current Request:
{processed_message}

Provide a helpful, contextual response based on the conversation history and any attachments."""

        # 3. Generate response via HALO router
        response = await self._call_router(
            agent_name=agent_name,
            prompt=full_prompt,
            temperature=0.7
        )

        if not response:
            response = "I apologize, but I'm unable to generate a response right now. Please try again."

        # 4. Store assistant response
        await self.memory_integration.store_assistant_response(
            response=response,
            session_id=session_id,
            user_id=user_id,
            metadata={
                "agent_name": agent_name,
                "has_attachments": bool(attachments),
                "history_count": len(history)
            }
        )

        processing_time_ms = (time.time() - start_time) * 1000

        return {
            "response": response,
            "history": history,
            "multimodal_results": memory_result["multimodal_results"],
            "session_context": memory_result["session_context"],
            "processing_time_ms": processing_time_ms,
            "memory_enabled": True
        }
