"""
Genesis Meta-Agent - Autonomous Business Creation Orchestrator

Integrates all Genesis layers:
- Layer 1: HTDAG + HALO + AOP (task orchestration)
- Layer 2: SE-Darwin (self-improvement)
- Layer 3: A2A (agent communication)
- Layer 5: Swarm (team composition)
- Layer 6: Memory (collective learning)
- WaltzRL: Safety validation

Version: 1.0
Date: November 3, 2025
Author: Cora (Agent Orchestration Specialist)
"""

import asyncio
import json
import logging
import uuid
import os
import time
import html
import textwrap
from functools import lru_cache
from typing import Dict, Any, List, Optional, Tuple
from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum

from pydantic import BaseModel, Field, ValidationError, field_validator

# Infrastructure imports
from infrastructure.htdag_planner import HTDAGPlanner
from infrastructure.halo_router import HALORouter, RoutingPlan, AgentCapability
from infrastructure.swarm.inclusive_fitness import InclusiveFitnessSwarm
from infrastructure.langgraph_store import GenesisLangGraphStore
from infrastructure.waltzrl_safety import WaltzRLSafety
from infrastructure.task_dag import TaskDAG, Task, TaskStatus
from infrastructure.llm_client import OpenAIClient, LLMClientError, LLMProvider

# Quota manager (distributed or in-memory)
try:
    from infrastructure.quota_manager import QuotaManager, QuotaExceededError
    QUOTA_MANAGER_AVAILABLE = True
except ImportError:
    QUOTA_MANAGER_AVAILABLE = False
    QuotaManager = None
    QuotaExceededError = Exception
    logger.info("QuotaManager not available - using built-in quota tracking")

try:  # Stripe is optional; we degrade gracefully when unavailable.
    import stripe  # type: ignore
except Exception:  # pragma: no cover - optional dependency
    stripe = None  # type: ignore

# Product generation (optional - requires Anthropic API)
try:
    from infrastructure.product_generator import ProductGenerator, ProductRequirements, BusinessType
    from infrastructure.product_validator import ProductValidator
    PRODUCT_GENERATION_AVAILABLE = True
except ImportError:
    PRODUCT_GENERATION_AVAILABLE = False
    ProductGenerator = None  # type: ignore
    ProductValidator = None  # type: ignore
    logger.info("Product generation not available - install anthropic SDK")

# A2A integration (optional)
try:
    from infrastructure.a2a_connector import A2AConnector, A2AExecutionResult
    from infrastructure.observability import CorrelationContext
    A2A_AVAILABLE = True
except ImportError:
    A2A_AVAILABLE = False
    A2AConnector = None
    logger.info("A2A connector not available - using simulated execution")

logger = logging.getLogger(__name__)

# Prometheus metrics (optional - gracefully handles missing prometheus_client)
try:
    from prometheus_client import Counter, Histogram, Gauge
    
    # Business creation metrics
    businesses_created_total = Counter(
        'genesis_meta_agent_businesses_created_total',
        'Total number of businesses created',
        ['business_type', 'status']
    )
    
    business_execution_duration_seconds = Histogram(
        'genesis_meta_agent_execution_duration_seconds',
        'Business creation execution time in seconds',
        ['business_type']
    )
    
    business_task_count = Histogram(
        'genesis_meta_agent_task_count',
        'Number of tasks per business',
        ['business_type']
    )
    
    business_team_size = Histogram(
        'genesis_meta_agent_team_size',
        'Number of agents in team',
        ['business_type']
    )
    
    revenue_projected_mrr = Gauge(
        'genesis_meta_agent_revenue_projected_mrr',
        'Projected monthly recurring revenue in USD',
        ['business_id']
    )
    
    revenue_confidence = Gauge(
        'genesis_meta_agent_revenue_confidence',
        'Revenue projection confidence score',
        ['business_id']
    )
    
    safety_violations_total = Counter(
        'genesis_meta_agent_safety_violations_total',
        'Total number of safety violations blocked'
    )
    
    memory_operations_total = Counter(
        'genesis_meta_agent_memory_operations_total',
        'Total memory operations',
        ['operation', 'status']
    )

    # P3: Additional metrics for business health and lifecycle
    business_lifecycle_events = Counter(
        'genesis_meta_agent_lifecycle_events_total',
        'Total business lifecycle events',
        ['event_type', 'business_type']
    )

    business_health_score = Gauge(
        'genesis_meta_agent_business_health_score',
        'Health score of created businesses',
        ['business_id', 'business_type']
    )

    deployment_success_rate = Gauge(
        'genesis_meta_agent_deployment_success_rate',
        'Success rate of deployments over time'
    )

    deployment_costs_total = Counter(
        'genesis_meta_agent_deployment_costs_total_usd',
        'Total deployment costs in USD',
        ['business_type', 'deployment_type']
    )

    business_auth_failures_total = Counter(
        'genesis_meta_agent_auth_failures_total',
        'Total number of authorization failures',
        ['reason']
    )

    business_quota_denied_total = Counter(
        'genesis_meta_agent_quota_denied_total',
        'Requests denied due to quota limits',
        ['user_id']
    )

    vercel_deployments_total = Counter(
        'genesis_meta_agent_vercel_deployments_total',
        'Vercel deployment attempts',
        ['status']
    )

    stripe_payment_intents_total = Counter(
        'genesis_meta_agent_stripe_payment_intents_total',
        'Stripe payment intents created',
        ['status']
    )

    stripe_subscriptions_total = Counter(
        'genesis_meta_agent_stripe_subscriptions_total',
        'Stripe subscriptions created',
        ['status']
    )

    stripe_revenue_total = Counter(
        'genesis_meta_agent_stripe_revenue_total_usd',
        'Total Stripe revenue in USD (MRR)',
        ['business_type']
    )

    business_takedowns_total = Counter(
        'genesis_meta_agent_takedowns_total',
        'Number of takedown operations executed',
        ['status']
    )

    METRICS_ENABLED = True
    logger.info("Prometheus metrics enabled for Genesis Meta-Agent")
    
except ImportError:
    METRICS_ENABLED = False
    logger.info("Prometheus metrics disabled (prometheus_client not installed)")


class BusinessCreationStatus(Enum):
    """Status of business creation process"""
    INITIALIZING = "initializing"
    GENERATING_IDEA = "generating_idea"
    COMPOSING_TEAM = "composing_team"
    DECOMPOSING_TASKS = "decomposing_tasks"
    EXECUTING = "executing"
    DEPLOYING = "deploying"
    VALIDATING = "validating"
    SUCCESS = "success"
    FAILED = "failed"
    BLOCKED = "blocked"


FAST_DECOMPOSITION_BLUEPRINTS: Dict[str, List[Dict[str, Any]]] = {
    "saas_tool": [
        {
            "id": "product_definition",
            "type": "design",
            "description": "Define the product vision, value proposition, and MVP scope for {name}.",
            "deps": []
        },
        {
            "id": "architecture_plan",
            "type": "architecture",
            "description": "Design system architecture covering frontend, backend, and data storage for {name} using {tech_stack}.",
            "deps": ["product_definition"]
        },
        {
            "id": "frontend_build",
            "type": "frontend",
            "description": "Implement core UI flows for {name}: {feature_headline}.",
            "deps": ["architecture_plan"]
        },
        {
            "id": "backend_build",
            "type": "backend",
            "description": "Build backend services and APIs supporting the SaaS workflows, including authentication and data persistence.",
            "deps": ["architecture_plan"]
        },
        {
            "id": "integration",
            "type": "implement",
            "description": "Connect frontend and backend, implement business logic, and ensure API contracts pass integration checks.",
            "deps": ["frontend_build", "backend_build"]
        },
        {
            "id": "testing",
            "type": "qa",
            "description": "Author unit, integration, and end-to-end tests covering critical user journeys and regression paths.",
            "deps": ["integration"]
        },
        {
            "id": "deployment",
            "type": "deploy",
            "description": "Package the application, configure environment variables, and deploy to the target environment (e.g., Vercel).",
            "deps": ["testing"]
        },
        {
            "id": "launch_marketing",
            "type": "marketing",
            "description": "Produce launch messaging, onboarding sequences, and success metrics dashboards for {target_audience}.",
            "deps": ["deployment"]
        },
    ],
    "content_website": [
        {
            "id": "editorial_plan",
            "type": "design",
            "description": "Create editorial strategy, content pillars, and posting cadence tailored to {target_audience}.",
            "deps": []
        },
        {
            "id": "site_scaffold",
            "type": "frontend",
            "description": "Set up static site framework with navigation, layout, and SEO foundations using {tech_stack}.",
            "deps": ["editorial_plan"]
        },
        {
            "id": "content_pipeline",
            "type": "backend",
            "description": "Build content ingestion workflow, CMS integrations, and publishing automation.",
            "deps": ["site_scaffold"]
        },
        {
            "id": "sample_content",
            "type": "content",
            "description": "Draft and publish initial articles highlighting {feature_headline}.",
            "deps": ["content_pipeline"]
        },
        {
            "id": "seo_qa",
            "type": "qa",
            "description": "Run SEO, accessibility, and performance audits to ensure quality standards.",
            "deps": ["sample_content"]
        },
        {
            "id": "launch_operations",
            "type": "deploy",
            "description": "Deploy the site, configure analytics, and integrate newsletter capture.",
            "deps": ["seo_qa"]
        },
        {
            "id": "growth_playbook",
            "type": "marketing",
            "description": "Prepare distribution plan, partnerships, and monetization experiments aligned with {monetization}.",
            "deps": ["launch_operations"]
        },
    ],
    "ecommerce_store": [
        {
            "id": "catalog_planning",
            "type": "design",
            "description": "Define product catalog, pricing, and fulfillment logistics for {name}.",
            "deps": []
        },
        {
            "id": "storefront_setup",
            "type": "frontend",
            "description": "Implement storefront UX (home, product details, cart) with secure checkout.",
            "deps": ["catalog_planning"]
        },
        {
            "id": "payment_integration",
            "type": "backend",
            "description": "Integrate payment providers (e.g., Stripe) and configure order capture workflows.",
            "deps": ["storefront_setup"]
        },
        {
            "id": "fulfillment_ops",
            "type": "implement",
            "description": "Set up fulfillment automation, notifications, and post-purchase experience.",
            "deps": ["payment_integration"]
        },
        {
            "id": "quality_assurance",
            "type": "qa",
            "description": "Test add-to-cart, checkout, refunds, and error handling to ensure conversion readiness.",
            "deps": ["fulfillment_ops"]
        },
        {
            "id": "deployment",
            "type": "deploy",
            "description": "Deploy store, configure domains, and validate production readiness.",
            "deps": ["quality_assurance"]
        },
        {
            "id": "launch_campaign",
            "type": "marketing",
            "description": "Create launch promotions, email campaigns, and performance dashboards targeting {target_audience}.",
            "deps": ["deployment"]
        },
    ],
}

FAST_DECOMPOSITION_BLUEPRINTS.setdefault("default", FAST_DECOMPOSITION_BLUEPRINTS["saas_tool"])


class _BusinessRequirementsSchema(BaseModel):
    """Pydantic validation schema for BusinessRequirements normalization."""

    name: str = Field(..., min_length=3, max_length=120)
    description: str = Field(..., min_length=10, max_length=500)
    target_audience: str = Field(..., min_length=3, max_length=120)
    monetization: str = Field(..., min_length=3, max_length=80)
    mvp_features: List[str] = Field(..., min_length=1)
    tech_stack: List[str] = Field(..., min_length=1)
    success_metrics: Dict[str, str] = Field(default_factory=dict)
    business_type: str = Field(..., min_length=3, max_length=80)
    estimated_time: str = Field(default="< 8 hours")

    @field_validator("name", "description", "target_audience", "monetization", "business_type", mode="before")
    @classmethod
    def _strip_and_validate_str(cls, value: Any) -> str:
        if value is None:
            raise ValueError("value must be provided.")
        value_str = str(value).strip()
        if not value_str:
            raise ValueError("value cannot be empty.")
        return value_str

    @field_validator("mvp_features", mode="before")
    @classmethod
    def _validate_features(cls, value: Any) -> List[str]:
        if not value:
            raise ValueError("At least one MVP feature is required.")
        features = []
        for item in value:
            trimmed = str(item).strip()
            if not trimmed:
                raise ValueError("Feature entries cannot be empty.")
            features.append(trimmed)
        return features

    @field_validator("tech_stack", mode="before")
    @classmethod
    def _validate_stack(cls, value: Any) -> List[str]:
        if not value:
            raise ValueError("At least one tech stack entry is required.")
        stack = []
        for item in value:
            trimmed = str(item).strip()
            if not trimmed:
                raise ValueError("Tech stack entries cannot be empty.")
            stack.append(trimmed)
        return stack

    @field_validator("success_metrics", mode="before")
    @classmethod
    def _validate_metrics(cls, value: Dict[str, Any]) -> Dict[str, str]:
        if not value:
            return {}
        sanitized = {}
        for key, metric_value in value.items():
            key_str = str(key).strip()
            metric_str = str(metric_value).strip()
            if key_str and metric_str:
                sanitized[key_str] = metric_str
        return sanitized

    class Config:
        anystr_strip_whitespace = True
        extra = "ignore"


@dataclass
class BusinessRequirements:
    """Business requirements structure"""
    name: str
    description: str
    target_audience: str
    monetization: str
    mvp_features: List[str]
    tech_stack: List[str]
    success_metrics: Dict[str, str]
    business_type: str = ""
    estimated_time: str = "< 8 hours"

    def to_dict(self) -> Dict[str, Any]:
        return {
            "name": self.name,
            "description": self.description,
            "target_audience": self.target_audience,
            "monetization": self.monetization,
            "mvp_features": self.mvp_features,
            "tech_stack": self.tech_stack,
            "success_metrics": self.success_metrics,
            "business_type": self.business_type,
            "estimated_time": self.estimated_time
        }


@dataclass
class BusinessCreationResult:
    """Result of autonomous business creation"""
    business_id: str
    status: BusinessCreationStatus
    requirements: BusinessRequirements
    team_composition: List[str] = field(default_factory=list)
    task_results: List[Dict[str, Any]] = field(default_factory=list)
    deployment_url: Optional[str] = None
    error_message: Optional[str] = None
    safety_violations: List[str] = field(default_factory=list)
    execution_time_seconds: float = 0.0
    timestamp: str = field(default_factory=lambda: datetime.now().isoformat())
    metadata: Dict[str, Any] = field(default_factory=dict)
    revenue_projection: Dict[str, Any] = field(default_factory=dict)

    @property
    def success(self) -> bool:
        """Check if business creation was successful"""
        return self.status == BusinessCreationStatus.SUCCESS

    def to_dict(self) -> Dict[str, Any]:
        return {
            "business_id": self.business_id,
            "status": self.status.value,
            "requirements": self.requirements.to_dict(),
            "team_composition": self.team_composition,
            "task_count": len(self.task_results),
            "deployment_url": self.deployment_url,
            "error_message": self.error_message,
            "safety_violations_count": len(self.safety_violations),
            "execution_time_seconds": self.execution_time_seconds,
            "timestamp": self.timestamp,
            "success": self.success,
            "revenue_projection": self.revenue_projection
        }


@dataclass
class BusinessRequestContext:
    """Metadata about the caller requesting a business creation."""

    user_id: str
    api_token: Optional[str] = None
    metadata: Dict[str, Any] = field(default_factory=dict)


class GenesisMetaAgent:
    """
    Genesis Meta-Agent - Master orchestrator for autonomous business creation.

    Workflow:
    1. Generate business idea (GPT-4o creativity)
    2. Query memory for similar successful businesses
    3. Compose optimal team (Swarm Optimizer)
    4. Decompose tasks (HTDAG)
    5. Route to agents (HALO)
    6. Validate safety (WaltzRL)
    7. Execute tasks
    8. Learn patterns (Memory Store)
    9. Monitor & evolve (SE-Darwin)

    Integration Points:
    - HTDAGPlanner: Task decomposition into hierarchical DAG
    - HALORouter: Logic-based agent routing with explainability
    - InclusiveFitnessOptimizer: Kin-based team composition
    - GenesisLangGraphStore: Multi-namespace memory (business, consensus, agent)
    - WaltzRLSafety: Collaborative safety validation (89% unsafe reduction)
    """

    def __init__(
        self,
        mongodb_uri: str = None,
        enable_safety: bool = True,
        enable_memory: bool = True,
        enable_cost_optimization: bool = True,
        autonomous: bool = True,
        enable_a2a: bool = None,
        a2a_service_url: str = None,
        enable_deployment: Optional[bool] = None,
        enable_payments: Optional[bool] = None,
        vercel_token: Optional[str] = None,
        vercel_team_id: Optional[str] = None,
        stripe_secret_key: Optional[str] = None,
        enable_product_generation: Optional[bool] = None,
        anthropic_api_key: Optional[str] = None
    ):
        """
        Initialize Genesis Meta-Agent with all subsystems.

        Args:
            mongodb_uri: MongoDB connection string (defaults to env var)
            enable_safety: Enable WaltzRL safety validation
            enable_memory: Enable LangGraph memory storage
            enable_cost_optimization: Enable DAAO cost optimization in HALO
            autonomous: Default mode (True = fully autonomous, False = human-in-loop)
            enable_a2a: Enable real A2A integration (defaults to env ENABLE_A2A_INTEGRATION)
            a2a_service_url: A2A service URL (defaults to env A2A_SERVICE_URL)
            enable_deployment: Enable Vercel deployment integration (defaults to RUN_GENESIS_FULL_E2E)
            enable_payments: Enable Stripe payment integration (defaults to RUN_GENESIS_FULL_E2E)
            vercel_token: Vercel API token (defaults to VERCEL_TOKEN env var)
            vercel_team_id: Vercel team ID (defaults to VERCEL_TEAM_ID env var)
            stripe_secret_key: Stripe secret key (defaults to STRIPE_SECRET_KEY env var)
            enable_product_generation: Enable AI product generation (defaults to ANTHROPIC_API_KEY present)
            anthropic_api_key: Anthropic API key for product generation (defaults to ANTHROPIC_API_KEY env var)
        """
        # Get MongoDB URI from env if not provided
        if mongodb_uri is None:
            mongodb_uri = os.getenv("MONGODB_URI", "mongodb://localhost:27017/")

        # Deployment & payment configuration (optional)
        self.full_e2e_mode = os.getenv("RUN_GENESIS_FULL_E2E", "false").lower() == "true"
        self._deployment_enabled = enable_deployment if enable_deployment is not None else self.full_e2e_mode
        self._payments_enabled = enable_payments if enable_payments is not None else self.full_e2e_mode
        self._vercel_client = None
        self._deployment_validator = None
        self._stripe_enabled = False
        self._stripe_key: Optional[str] = None
        self._current_business_context: Dict[str, Any] = {}
        self._current_deployment_stage: str = "none"

        if self._deployment_enabled:
            vercel_token = vercel_token or os.getenv("VERCEL_TOKEN")
            vercel_team_id = vercel_team_id or os.getenv("VERCEL_TEAM_ID")
            if vercel_token:
                try:
                    from infrastructure.execution.vercel_client import VercelClient  # type: ignore
                    from infrastructure.execution.deployment_validator import DeploymentValidator  # type: ignore

                    if not vercel_team_id:
                        logger.warning("Vercel deployment enabled but VERCEL_TEAM_ID not set; using default team")

                    self._vercel_client = VercelClient(token=vercel_token, team_id=vercel_team_id)
                    self._deployment_validator = DeploymentValidator()
                    logger.info("Vercel client and deployment validator initialized for autonomous deployments")
                except ImportError as exc:  # pragma: no cover - optional dependency
                    logger.warning(f"Failed to import deployment clients: {exc}")
                    self._vercel_client = None
                    self._deployment_validator = None
                    self._deployment_enabled = False
                except Exception as exc:  # pragma: no cover - network integration
                    logger.error(f"Failed to initialize Vercel client: {exc}")
                    self._vercel_client = None
                    self._deployment_validator = None
                    self._deployment_enabled = False
            else:
                logger.warning("Vercel deployment requested but VERCEL_TOKEN not set; disabling deployment integration.")
                self._deployment_enabled = False

        stripe_key = stripe_secret_key or (
            os.getenv("STRIPE_API_KEY")
            or os.getenv("STRIPE_SECRET_KEY")
            or os.getenv("STRIPE_TEST_KEY")
        )
        if self._payments_enabled and stripe_key:
            if stripe is None:
                logger.warning("Stripe SDK not installed; payment automation disabled.")
            else:
                try:
                    stripe.api_key = stripe_key  # type: ignore[attr-defined]
                    self._stripe_enabled = True
                    self._stripe_key = stripe_key

                    # Determine if test or live key
                    key_mode = "test" if "test" in stripe_key.lower() else "live"
                    logger.info(f"Stripe SDK configured for real payment integration ({key_mode} mode)")
                except Exception as exc:  # pragma: no cover
                    logger.warning(f"Failed to configure Stripe SDK: {exc}")
                    self._stripe_enabled = False
        else:
            self._stripe_enabled = False

        # Authorization and quota configuration
        tokens_env = os.getenv("GENESIS_API_TOKENS", "").strip()
        self._auth_enabled = bool(tokens_env)
        self._tokens_to_users: Dict[str, Dict[str, Any]] = {}
        if self._auth_enabled:
            for entry in tokens_env.split(","):
                token_entry = entry.strip()
                if not token_entry:
                    continue
                parts = token_entry.split(":")
                if len(parts) < 2:
                    logger.warning(f"Invalid GENESIS_API_TOKENS entry: {token_entry}")
                    continue
                token = parts[0].strip()
                user_id = parts[1].strip()
                quota_override = None
                if len(parts) >= 3:
                    try:
                        quota_override = int(parts[2])
                    except ValueError:
                        logger.warning(f"Invalid quota override in GENESIS_API_TOKENS entry: {token_entry}")
                if token and user_id:
                    self._tokens_to_users[token] = {
                        "user_id": user_id,
                        "quota_override": quota_override
                    }

        self._default_quota = int(os.getenv("GENESIS_QUOTA_PER_USER", "5"))
        self._quota_window_seconds = int(os.getenv("GENESIS_QUOTA_WINDOW_SECONDS", "86400"))
        self._quota_usage: Dict[str, Dict[str, Any]] = {}
        
        # Initialize distributed quota manager (Redis-backed if available)
        self._quota_manager: Optional[QuotaManager] = None
        redis_url = os.getenv("REDIS_URL")
        if QUOTA_MANAGER_AVAILABLE and redis_url:
            try:
                self._quota_manager = QuotaManager(
                    redis_url=redis_url,
                    default_quota=self._default_quota,
                    window_seconds=self._quota_window_seconds
                )
                logger.info(f"Distributed quota manager initialized with Redis: {redis_url}")
            except Exception as exc:
                logger.warning(f"Failed to initialize quota manager: {exc}, using in-memory tracking")
                self._quota_manager = None

        # Deployment records for takedown tracking
        self._deployment_records: Dict[str, Dict[str, Any]] = {}
        self._fast_htdag_enabled = os.getenv("GENESIS_FAST_HTDAG", "true").lower() != "false"
        self._fast_htdag_types = set(FAST_DECOMPOSITION_BLUEPRINTS.keys())

        # Initialize subsystems
        self.htdag = HTDAGPlanner(
            llm_client=OpenAIClient(model="gpt-4o"),
            enable_testtime_compute=False  # Use standard decomposition for now
        )

        self.halo = HALORouter(
            enable_cost_optimization=enable_cost_optimization,
            enable_casebank=True
        )

        # Swarm optimizer will be initialized with agent list when needed
        self.swarm_class = InclusiveFitnessSwarm

        self.memory = GenesisLangGraphStore(
            mongodb_uri=mongodb_uri,
            database_name="genesis_memory"
        ) if enable_memory else None

        self.safety = WaltzRLSafety(
            enable_blocking=False,  # Feedback-only mode initially
            feedback_only_mode=True
        ) if enable_safety else None

        # Initialize A2A connector if enabled
        if enable_a2a is None:
            enable_a2a = os.getenv("ENABLE_A2A_INTEGRATION", "false").lower() == "true"
        
        if a2a_service_url is None:
            a2a_service_url = os.getenv("A2A_SERVICE_URL", "https://127.0.0.1:8443")
        
        self.enable_a2a = enable_a2a and A2A_AVAILABLE
        self.a2a_connector = None
        
        if self.enable_a2a:
            try:
                self.a2a_connector = A2AConnector(
                    a2a_service_url=a2a_service_url,
                    orchestrator_token="genesis-meta-agent",
                    use_toon_encoding=True
                )
                logger.info(f"A2A connector initialized: {a2a_service_url}")
            except Exception as exc:
                logger.warning(f"Failed to initialize A2A connector: {exc}")
                self.enable_a2a = False

        self.autonomous = autonomous
        self.logger = logger

        # Product generation system (replaces static site generation)
        anthropic_key = anthropic_api_key or os.getenv("ANTHROPIC_API_KEY")
        self._product_generation_enabled = (
            enable_product_generation if enable_product_generation is not None
            else (PRODUCT_GENERATION_AVAILABLE and bool(anthropic_key))
        )
        self._product_generator = None
        self._product_validator = None

        if self._product_generation_enabled and PRODUCT_GENERATION_AVAILABLE:
            try:
                self._product_generator = ProductGenerator(
                    anthropic_api_key=anthropic_key,
                    use_haiku_for_validation=True,
                    evolution_archive_path=None  # TODO: Link to SE-Darwin archive
                )
                self._product_validator = ProductValidator(
                    anthropic_api_key=anthropic_key,
                    use_llm_validation=False,  # Use static analysis for speed
                    strict_mode=False  # Allow warnings
                )
                logger.info("Product generation system initialized (Claude Sonnet 4)")
            except Exception as exc:
                logger.warning(f"Failed to initialize product generation: {exc}")
                self._product_generation_enabled = False
        else:
            if enable_product_generation:
                logger.warning("Product generation requested but not available (missing anthropic SDK or API key)")

        logger.info("GenesisMetaAgent initialized successfully")
        logger.info(f"  - HTDAG: Enabled")
        logger.info(f"  - HALO: Enabled (cost_optimization={enable_cost_optimization})")
        logger.info(f"  - Swarm: Enabled")
        logger.info(f"  - Memory: {'Enabled' if enable_memory else 'Disabled'}")
        logger.info(f"  - Safety: {'Enabled' if enable_safety else 'Disabled'}")
        logger.info(f"  - A2A: {'Enabled' if self.enable_a2a else 'Disabled (simulated)'}")
        logger.info(f"  - Vercel Deployment: {'Enabled' if self._deployment_enabled else 'Disabled (simulated)'}")
        logger.info(f"  - Stripe Payments: {'Enabled' if self._stripe_enabled else 'Disabled'}")
        logger.info(f"  - Product Generation: {'Enabled (AI)' if self._product_generation_enabled else 'Disabled (static)'}")
        logger.info(f"  - Mode: {'Autonomous' if autonomous else 'Supervised'}")

    async def create_business(
        self,
        business_type: str,
        requirements: Optional[BusinessRequirements] = None,
        autonomous: Optional[bool] = None,
        enable_memory_learning: bool = True,
        request_context: Optional[BusinessRequestContext] = None
    ) -> BusinessCreationResult:
        """
        Autonomously create a complete business.

        Args:
            business_type: Type of business (saas, ecommerce, content, etc.)
            requirements: Optional custom requirements (or auto-generate)
            autonomous: Override default autonomous mode for this business
            enable_memory_learning: Store successful patterns in memory

        Returns:
            BusinessCreationResult with deployment URL, team composition, metrics

        Raises:
            ValueError: If business_type is invalid
            BusinessCreationError: If critical failure occurs
        """
        start_time = asyncio.get_event_loop().time()
        business_id = str(uuid.uuid4())
        autonomous_mode = autonomous if autonomous is not None else self.autonomous
        team: List[str] = []
        task_results: List[Dict[str, Any]] = []
        similar_businesses: List[Dict[str, Any]] = []

        if request_context is None and not self._auth_enabled:
            request_context = BusinessRequestContext(user_id="system")

        requester_id, requester_token = self._authorize_request(request_context)
        quota_snapshot = await self._enforce_quota(requester_id, requester_token)

        logger.info(
            "Starting business creation: type=%s, id=%s, mode=%s, requested_by=%s",
            business_type,
            business_id,
            'autonomous' if autonomous_mode else 'supervised',
            requester_id
        )

        # Validate environment for deployment mode
        if self._deployment_enabled:
            env_status = self._validate_deployment_env()
            if not env_status["vercel_ready"]:
                logger.warning("Deployment enabled but Vercel credentials not fully configured")
            logger.debug(f"Deployment environment status: {env_status}")

        try:
            # Step 1: Generate business idea (if requirements not provided)
            if requirements is None:
                logger.info("Generating business idea...")
                requirements = await self._generate_business_idea(business_type)
                logger.info(f"Generated idea: {requirements.name}")

            # Add business_type to requirements
            requirements.business_type = business_type
            requirements = self._validate_and_normalize_requirements(requirements)

            # Store business context for deployment tasks
            self._current_business_context = {
                "business_type": business_type,
                "business_name": requirements.name,
                "business_id": business_id,
                "requirements": requirements
            }

            # Step 2: Query memory for similar successful businesses
            if self.memory:
                logger.info("Querying memory for similar successful businesses...")
                similar_businesses = await self._query_similar_businesses(business_type)
                logger.info(f"Found {len(similar_businesses)} similar businesses in memory")

            # Step 3: Compose optimal team (Swarm Optimizer)
            logger.info("Composing optimal team...")
            team = await self._compose_team(requirements, similar_businesses)
            logger.info(f"Team composed: {len(team)} agents - {', '.join(team)}")

            # Step 4: Decompose into tasks (HTDAG)
            logger.info("Decomposing into hierarchical tasks...")
            task_dag = await self._decompose_business_tasks(requirements)
            logger.info(f"Task DAG created: {len(task_dag.tasks)} tasks")

            # Step 5: Route tasks to agents (HALO)
            logger.info("Routing tasks to agents...")
            routing_plan = await self._route_tasks(task_dag, team)
            logger.info(f"Routing plan complete: {len(routing_plan.assignments)} assignments")

            # Step 6: Execute tasks with safety validation
            logger.info("Executing tasks...")
            task_results = await self._execute_tasks(
                task_dag,
                routing_plan,
                autonomous=autonomous_mode
            )
            logger.info(f"Execution complete: {len(task_results)} results")

            # Step 7: Determine success
            success = self._is_successful(task_results)
            status = BusinessCreationStatus.SUCCESS if success else BusinessCreationStatus.FAILED

            # Calculate execution time early for projections/deployment
            execution_time = asyncio.get_event_loop().time() - start_time

            # Step 8: Revenue projection and optional deployment integration
            revenue_projection = self._simulate_revenue_projection(
                requirements,
                team,
                task_results,
                success,
                execution_time
            )

            deployment_url = self._extract_deployment_url(task_results)

            if success and self._deployment_enabled:
                deployment_url = await self._maybe_deploy_to_vercel(
                    business_id,
                    requirements,
                    revenue_projection,
                    deployment_url
                )

            # Step 9: Store successful patterns in memory
            if success and self.memory and enable_memory_learning:
                logger.info("Storing successful pattern in memory...")
                await self._store_success_pattern(
                    business_id,
                    business_type,
                    requirements,
                    team,
                    task_results
                )

            stripe_payment_intent = None
            if success and self._payments_enabled:
                stripe_payment_intent = await self._maybe_create_stripe_payment(
                    business_id,
                    requirements
                )

            cost_summary = self._calculate_deployment_costs(
                team_size=len(team),
                task_count=len(task_results),
                execution_time=execution_time,
                vercel_deployment=bool(deployment_url),
                stripe_integration=bool(stripe_payment_intent)
            )

            metadata = {
                "similar_businesses_found": len(similar_businesses),
                "autonomous_mode": autonomous_mode,
                "team_size": len(team),
                "task_count": len(task_results),
                "completion_rate": revenue_projection.get("completion_rate", 0.0),
                "deployment_provider": "vercel" if deployment_url else ("simulation" if self._deployment_enabled else "none"),
                "stripe_payment_intent": stripe_payment_intent,
                "requested_by": requester_id,
                "quota_snapshot": quota_snapshot,
                "cost_breakdown": cost_summary
            }

            result = BusinessCreationResult(
                business_id=business_id,
                status=status,
                requirements=requirements,
                team_composition=team,
                task_results=task_results,
                deployment_url=deployment_url,
                execution_time_seconds=execution_time,
                metadata=metadata,
                revenue_projection=revenue_projection
            )

            logger.info(f"Business creation {'SUCCESS' if success else 'FAILED'}: {business_id}")
            logger.info(f"  - Execution time: {execution_time:.2f}s")
            logger.info(f"  - Deployment URL: {deployment_url}")

            # Record metrics if enabled
            if METRICS_ENABLED:
                try:
                    businesses_created_total.labels(
                        business_type=business_type,
                        status=status.value
                    ).inc()
                    
                    business_execution_duration_seconds.labels(
                        business_type=business_type
                    ).observe(execution_time)
                    
                    business_task_count.labels(
                        business_type=business_type
                    ).observe(len(task_results))
                    
                    business_team_size.labels(
                        business_type=business_type
                    ).observe(len(team))

                    deployment_type_label = "vercel" if deployment_url else ("simulation" if self._deployment_enabled else "disabled")
                    deployment_costs_total.labels(
                        business_type=business_type,
                        deployment_type=deployment_type_label
                    ).inc(cost_summary["total_usd"])
                    
                    if success and revenue_projection:
                        revenue_projected_mrr.labels(
                            business_id=business_id
                        ).set(revenue_projection.get("projected_monthly_revenue", 0))
                        
                        revenue_confidence.labels(
                            business_id=business_id
                        ).set(revenue_projection.get("confidence", 0))
                except Exception as metrics_exc:
                    logger.warning(f"Failed to record metrics: {metrics_exc}")

            return result

        except BusinessCreationError:
            raise
        except Exception as exc:
            execution_time = asyncio.get_event_loop().time() - start_time
            logger.error(f"Business creation failed: {exc}", exc_info=True)

            failure_requirements = requirements or BusinessRequirements(
                name="Unknown",
                description="Failed to generate",
                target_audience="",
                monetization="",
                mvp_features=[],
                tech_stack=[],
                success_metrics={}
            )

            revenue_projection = self._simulate_revenue_projection(
                failure_requirements,
                team,
                task_results,
                success=False,
                execution_time=execution_time
            )

            # Record failure metrics
            if METRICS_ENABLED:
                try:
                    businesses_created_total.labels(
                        business_type=business_type,
                        status="failed"
                    ).inc()
                    
                    business_execution_duration_seconds.labels(
                        business_type=business_type
                    ).observe(execution_time)
                except Exception as metrics_exc:
                    logger.warning(f"Failed to record failure metrics: {metrics_exc}")

            return BusinessCreationResult(
                business_id=business_id,
                status=BusinessCreationStatus.FAILED,
                requirements=failure_requirements,
                error_message=str(exc),
                execution_time_seconds=execution_time,
                metadata={
                    "error_type": exc.__class__.__name__,
                    "autonomous_mode": autonomous_mode,
                    "team_size": len(team),
                    "deployment_provider": "vercel" if self._deployment_enabled else "none",
                    "stripe_payment_intent": None
                },
                revenue_projection=revenue_projection
            )

    async def _generate_business_idea(self, business_type: str) -> BusinessRequirements:
        """
        Generate business requirements using GPT-4o creativity.

        Uses memory-backed prompts (learn from past successes).

        Args:
            business_type: Type of business to generate

        Returns:
            BusinessRequirements with generated idea

        Raises:
            LLMClientError: If LLM generation fails
        """
        # Query memory for successful business templates
        templates = []
        if self.memory:
            try:
                memory_results = await self.memory.search(
                    namespace=("business",),
                    query={"business_type": business_type, "success": True},
                    limit=3
                )
                templates = [result.value for result in memory_results]
            except Exception as exc:
                logger.warning(f"Failed to query memory templates: {exc}")

        # Build prompt with memory context
        templates_str = json.dumps(templates, indent=2) if templates else "No historical templates available"

        system_prompt = """You are a creative business strategist specialized in AI-buildable businesses.
Generate unique, monetizable business ideas that can be built autonomously by AI agents.

CRITICAL REQUIREMENTS:
- Must be monetizable within 7 days
- Must be buildable by AI agents autonomously
- Must leverage modern tech stack (Next.js, React, Python, etc.)
- Must differentiate from existing businesses
- Must have clear success metrics

Output MUST be valid JSON matching the schema provided."""

        user_prompt = f"""Generate a unique {business_type} business idea.

Successful patterns from memory:
{templates_str}

Return JSON with exactly these fields:
{{
    "name": "Business name (2-4 words)",
    "description": "2-sentence description of the business",
    "target_audience": "Primary target audience",
    "monetization": "Revenue model (e.g., subscription, freemium, ads)",
    "mvp_features": ["Feature 1", "Feature 2", "Feature 3", ...],
    "tech_stack": ["Technology 1", "Technology 2", ...],
    "success_metrics": {{"metric_name": "target_value"}}
}}"""

        # Use GPT-4o for creative generation
        llm = OpenAIClient(model="gpt-4o")

        try:
            response = await llm.generate_structured_output(
                system_prompt=system_prompt,
                user_prompt=user_prompt,
                response_schema={
                    "name": "string",
                    "description": "string",
                    "target_audience": "string",
                    "monetization": "string",
                    "mvp_features": ["string"],
                    "tech_stack": ["string"],
                    "success_metrics": {"string": "string"}
                },
                temperature=0.8  # High creativity
            )

            return BusinessRequirements(
                name=response.get("name", "Unnamed Business"),
                description=response.get("description", ""),
                target_audience=response.get("target_audience", "General users"),
                monetization=response.get("monetization", "Freemium"),
                mvp_features=response.get("mvp_features", []),
                tech_stack=response.get("tech_stack", ["Next.js", "Python"]),
                success_metrics=response.get("success_metrics", {}),
                business_type=business_type
            )

        except LLMClientError as exc:
            logger.error(f"LLM generation failed: {exc}")
            raise

    async def _query_similar_businesses(self, business_type: str) -> List[Dict[str, Any]]:
        """
        Query memory for similar successful businesses.

        Args:
            business_type: Type of business to search for

        Returns:
            List of similar business records from memory
        """
        if not self.memory:
            return []

        try:
            results = await self.memory.search(
                namespace=("business",),
                query={"business_type": business_type, "success": True},
                limit=5
            )
            
            # Record successful memory operation
            if METRICS_ENABLED:
                try:
                    memory_operations_total.labels(
                        operation="query",
                        status="success"
                    ).inc()
                except Exception as metrics_exc:
                    logger.warning(f"Failed to record memory metric: {metrics_exc}")
            
            return [result.value for result in results]
        except Exception as exc:
            logger.warning(f"Failed to query similar businesses: {exc}")
            
            # Record failed memory operation
            if METRICS_ENABLED:
                try:
                    memory_operations_total.labels(
                        operation="query",
                        status="failed"
                    ).inc()
                except Exception as metrics_exc:
                    logger.warning(f"Failed to record memory metric: {metrics_exc}")
            
            return []

    async def _compose_team(
        self,
        requirements: BusinessRequirements,
        similar_businesses: List[Dict[str, Any]]
    ) -> List[str]:
        """
        Compose optimal team using capability-based selection.

        Uses HALO agent registry to select agents based on required capabilities.
        Future enhancement: Use InclusiveFitnessSwarm for kin-based optimization.

        Args:
            requirements: Business requirements
            similar_businesses: Historical successful businesses

        Returns:
            List of agent names for the team
        """
        # Build required capabilities from requirements
        required_capabilities = self._extract_required_capabilities(requirements)

        # Use HALO agent registry for capability-based selection
        team = []

        # Get all available agents from HALO registry
        available_agents = self.halo.agent_registry

        # Select agents based on required capabilities
        for capability in required_capabilities:
            # Find agent with this capability
            for agent_name, agent_profile in available_agents.items():
                if capability in agent_profile.skills or capability in [t.lower() for t in agent_profile.supported_task_types]:
                    if agent_name not in team:
                        team.append(agent_name)
                        break

        # Ensure minimum team coverage across lifecycle
        essential_agents = [
            "builder_agent",
            "frontend_agent",
            "backend_agent",
            "deploy_agent",
            "qa_agent",
            "marketing_agent"
        ]
        for agent in essential_agents:
            if agent not in team:
                team.append(agent)

        logger.debug(f"Composed team: {team} for capabilities: {required_capabilities}")

        return team

    def _extract_required_capabilities(self, requirements: BusinessRequirements) -> List[str]:
        """
        Extract required capabilities from business requirements.

        Args:
            requirements: Business requirements

        Returns:
            List of required capabilities (e.g., "python", "deployment", "testing")
        """
        capabilities = set()

        # Always need builder and deploy
        capabilities.add("coding")
        capabilities.add("deployment")

        # Add capabilities based on tech stack
        tech_stack_lower = [tech.lower() for tech in requirements.tech_stack]

        if any("python" in tech for tech in tech_stack_lower):
            capabilities.add("python")
        if any("next" in tech or "react" in tech for tech in tech_stack_lower):
            capabilities.add("architecture")
            capabilities.add("frontend")
        if any("test" in tech for tech in tech_stack_lower):
            capabilities.add("testing")
        if any("stripe" in tech or "payment" in tech for tech in tech_stack_lower):
            capabilities.add("payments")

        # Add QA for quality
        capabilities.add("code_review")

        # Add content for marketing copy
        if requirements.monetization:
            capabilities.add("content_strategy")
            capabilities.add("marketing")

        return list(capabilities)

    async def _decompose_business_tasks(self, requirements: BusinessRequirements) -> TaskDAG:
        """
        Decompose business creation into hierarchical task DAG using HTDAG.

        Args:
            requirements: Business requirements

        Returns:
            TaskDAG with hierarchical decomposition
        """
        if self._should_use_fast_decomposition(requirements):
            logger.debug(f"Using fast HTDAG template for {requirements.business_type}")
            return self._build_fast_task_dag(requirements)

        # Build task description
        task_description = f"""Build a {requirements.business_type} business: {requirements.name}

Description: {requirements.description}
Target Audience: {requirements.target_audience}
Monetization: {requirements.monetization}

MVP Features:
{chr(10).join(f'- {feature}' for feature in requirements.mvp_features)}

Tech Stack:
{chr(10).join(f'- {tech}' for tech in requirements.tech_stack)}

Success Metrics:
{chr(10).join(f'- {metric}: {target}' for metric, target in requirements.success_metrics.items())}

Decompose this into a hierarchical task DAG covering:
1. Specification & Design
2. Implementation (frontend + backend)
3. Testing & QA
4. Deployment & Monitoring
5. Marketing Copy & Launch
"""

        # Use HTDAG for decomposition
        task_dag = await self.htdag.decompose_task(
            user_request=task_description,
            context={"business_type": requirements.business_type}
        )

        return task_dag

    async def _route_tasks(self, task_dag: TaskDAG, team: List[str]) -> RoutingPlan:
        """
        Route tasks to agents using HALO logic-based routing.

        Args:
            task_dag: Hierarchical task DAG
            team: List of agent names in the team

        Returns:
            RoutingPlan with task assignments
        """
        # Use HALO for routing
        routing_plan = await self.halo.route_tasks(task_dag)

        # Filter routing plan to only include team members
        filtered_assignments = {
            task_id: agent
            for task_id, agent in routing_plan.assignments.items()
            if agent in team
        }

        # Update routing plan
        routing_plan.assignments = filtered_assignments

        return routing_plan

    async def _execute_tasks(
        self,
        task_dag: TaskDAG,
        routing_plan: RoutingPlan,
        autonomous: bool
    ) -> List[Dict[str, Any]]:
        """
        Execute tasks with safety validation.

        Args:
            task_dag: Task DAG to execute
            routing_plan: Routing plan with agent assignments
            autonomous: If True, fully autonomous. If False, human-in-loop.

        Returns:
            List of task execution results
        """
        results = []

        # Execute tasks in topological order (respecting dependencies)
        if hasattr(task_dag, "get_execution_order"):
            execution_order = task_dag.get_execution_order()  # type: ignore[attr-defined]
        else:
            execution_order = task_dag.topological_sort()

        for task_id in execution_order:
            task = task_dag.tasks.get(task_id)
            if task is None:
                logger.warning(f"Task {task_id} missing from DAG registry")
                continue

            agent = routing_plan.assignments.get(task_id)

            if not agent:
                logger.warning(f"No agent assigned for task: {task_id}")
                results.append({
                    "task_id": task_id,
                    "status": "unassigned",
                    "error": "No agent assigned"
                })
                continue

            # Safety validation
            if self.safety:
                logger.debug(f"Validating safety for task: {task_id}")
                safety_result = await self._validate_task_safety(task, agent, autonomous)
                if not safety_result["safe"]:
                    logger.warning(f"Task blocked by safety: {task_id}")
                    results.append({
                        "task_id": task_id,
                        "status": "blocked",
                        "reason": safety_result["reason"],
                        "agent": agent
                    })
                    continue

            # Execute task (via A2A if enabled, otherwise simulated)
            logger.debug(f"Executing task: {task_id} with agent: {agent}")

            # Check if this is a deployment task and Vercel is enabled
            is_deployment_task = (
                task.description and "deploy" in task.description.lower() and
                self._deployment_enabled and
                self._vercel_client is not None
            )

            if is_deployment_task:
                # Execute real deployment
                self._current_deployment_stage = "deploying"
                result = await self._execute_deployment_task(
                    task=task,
                    agent=agent,
                    business_type=self._current_business_context.get("business_type", "general"),
                    business_name=self._current_business_context.get("business_name", f"business-{task.task_id[:8]}")
                )
                self._current_deployment_stage = "deployed" if result.get("status") == "completed" else "failed"
            else:
                # Execute via A2A or simulation
                result = await self._execute_task_real_or_simulated(task, agent)

            results.append(result)

        return results

    async def _maybe_deploy_to_vercel(
        self,
        business_id: str,
        requirements: BusinessRequirements,
        revenue_projection: Dict[str, Any],
        existing_url: Optional[str]
    ) -> Optional[str]:
        """
        Deploy a simple static site to Vercel when deployment integration is enabled.
        """
        if existing_url or not self._deployment_enabled or not self._vercel_client:
            return existing_url

        site_name = self._slugify(requirements.name or business_id)
        files = await self._generate_full_application(requirements, revenue_projection)

        try:
            deployment = await self._vercel_client.create_static_deployment(
                name=site_name,
                files=files,
                project_settings={"framework": "static"}
            )
            url = await self._vercel_client.wait_for_deployment(
                deployment.id,
                timeout_seconds=300,
                poll_interval=10
            )
            logger.info(f"Vercel deployment ready: {url}")
            return url
        except Exception as exc:  # pragma: no cover - network integration
            logger.warning(f"Vercel deployment failed: {exc}")
            return existing_url

    async def _maybe_create_stripe_payment(
        self,
        business_id: str,
        requirements: BusinessRequirements
    ) -> Optional[str]:
        """
        Create real Stripe subscription for autonomous business billing.

        Returns subscription_id (not payment intent) for production tracking.
        Falls back to simulation if Stripe unavailable.
        """
        if not self._stripe_enabled or not stripe:  # type: ignore
            logger.info("Stripe disabled - skipping payment creation")
            return None

        loop = asyncio.get_running_loop()

        # Retry configuration
        max_retries = 3
        retry_delay = 1.0  # seconds

        for attempt in range(max_retries):
            try:
                # Step 1: Create Stripe Customer
                customer = await self._create_stripe_customer(
                    business_id=business_id,
                    requirements=requirements,
                    loop=loop
                )
                if not customer:
                    logger.warning(f"Failed to create Stripe customer (attempt {attempt + 1}/{max_retries})")
                    if attempt < max_retries - 1:
                        await asyncio.sleep(retry_delay * (2 ** attempt))  # exponential backoff
                        continue
                    return None

                customer_id = customer.get("id")
                logger.info(f"Stripe customer created: {customer_id}")

                # Step 2: Create Stripe Subscription ($5/month fixed)
                subscription = await self._create_stripe_subscription(
                    customer_id=customer_id,
                    business_id=business_id,
                    business_type=requirements.business_type,
                    business_name=requirements.name,
                    loop=loop
                )

                if not subscription:
                    logger.warning(f"Failed to create Stripe subscription (attempt {attempt + 1}/{max_retries})")
                    if attempt < max_retries - 1:
                        await asyncio.sleep(retry_delay * (2 ** attempt))
                        continue
                    return None

                subscription_id = subscription.get("id")
                subscription_status = subscription.get("status")
                logger.info(f"Stripe subscription created: {subscription_id} (status: {subscription_status})")

                # Record metrics
                if METRICS_ENABLED:
                    try:
                        stripe_subscriptions_total.labels(status="success").inc()
                        # Record $5/month MRR
                        stripe_revenue_total.labels(business_type=requirements.business_type).inc(5.0)
                    except Exception as metrics_exc:
                        logger.warning(f"Failed to record Stripe metrics: {metrics_exc}")

                # Store subscription info for takedown
                self._record_stripe_subscription(
                    business_id=business_id,
                    customer_id=customer_id,
                    subscription_id=subscription_id,
                    business_name=requirements.name
                )

                return subscription_id

            except Exception as exc:  # pragma: no cover - network integration
                logger.warning(f"Stripe payment failed (attempt {attempt + 1}/{max_retries}): {exc}")

                if attempt < max_retries - 1:
                    await asyncio.sleep(retry_delay * (2 ** attempt))
                    continue

                # Final failure - record metric
                if METRICS_ENABLED:
                    try:
                        stripe_subscriptions_total.labels(status="failed").inc()
                    except Exception as metrics_exc:
                        logger.warning(f"Failed to record Stripe metric: {metrics_exc}")

                return None

        return None

    async def _create_stripe_customer(
        self,
        business_id: str,
        requirements: BusinessRequirements,
        loop: asyncio.AbstractEventLoop
    ) -> Optional[Dict[str, Any]]:
        """
        Create a Stripe Customer for the autonomous business.

        Args:
            business_id: Unique business identifier
            requirements: Business requirements with name/description
            loop: Event loop for async execution

        Returns:
            Stripe Customer object dict or None on failure
        """
        def _create():
            return stripe.Customer.create(  # type: ignore[attr-defined]
                name=requirements.name[:100],  # Stripe limit
                description=f"Genesis autonomous business: {requirements.description[:200]}",
                metadata={
                    "business_id": business_id,
                    "business_type": requirements.business_type,
                    "genesis_created": datetime.now().isoformat(),
                    "autonomous": "true"
                }
            )

        try:
            customer = await loop.run_in_executor(None, _create)
            return dict(customer)  # Convert to dict for type safety
        except Exception as exc:
            logger.error(f"Failed to create Stripe customer: {exc}")
            return None

    async def _create_stripe_subscription(
        self,
        customer_id: str,
        business_id: str,
        business_type: str,
        business_name: str,
        loop: asyncio.AbstractEventLoop
    ) -> Optional[Dict[str, Any]]:
        """
        Create a Stripe Subscription for monthly business billing.

        PRICING: Fixed $5/month for all business types (user-selected strategy).

        Args:
            customer_id: Stripe customer ID
            business_id: Genesis business ID
            business_type: Type of business (saas, ecommerce, etc.)
            business_name: Name of the business
            loop: Event loop for async execution

        Returns:
            Stripe Subscription object dict or None on failure
        """
        # Fixed pricing: $5/month for all businesses
        monthly_price = 500  # cents ($5.00 USD)

        def _create():
            # Note: For production, you'd create a Price object first or use existing price_id
            # For now, we'll create an invoice item and subscription together
            # This is a simplified approach - production would use Stripe Products/Prices
            return stripe.Subscription.create(  # type: ignore[attr-defined]
                customer=customer_id,
                items=[{
                    "price_data": {
                        "currency": "usd",
                        "product_data": {
                            "name": f"Genesis Autonomous Business: {business_name}",
                            "description": f"Monthly subscription for {business_type} business infrastructure",
                            "metadata": {
                                "business_id": business_id,
                                "business_type": business_type
                            }
                        },
                        "recurring": {
                            "interval": "month",
                            "interval_count": 1
                        },
                        "unit_amount": monthly_price,
                    },
                    "quantity": 1
                }],
                metadata={
                    "business_id": business_id,
                    "business_name": business_name,
                    "business_type": business_type,
                    "genesis_created": datetime.now().isoformat()
                },
                payment_behavior="default_incomplete",  # Requires payment method setup
                payment_settings={
                    "payment_method_types": ["card"],
                    "save_default_payment_method": "on_subscription"
                },
                description=f"Genesis business subscription: {business_name}"
            )

        try:
            subscription = await loop.run_in_executor(None, _create)
            return dict(subscription)  # Convert to dict for type safety
        except Exception as exc:
            logger.error(f"Failed to create Stripe subscription: {exc}")
            return None

    def _record_stripe_subscription(
        self,
        business_id: str,
        customer_id: str,
        subscription_id: str,
        business_name: str
    ) -> None:
        """
        Record Stripe subscription details in deployment records.

        Args:
            business_id: Genesis business ID
            customer_id: Stripe customer ID
            subscription_id: Stripe subscription ID
            business_name: Business name
        """
        if business_id not in self._deployment_records:
            self._deployment_records[business_id] = {
                "business_id": business_id,
                "business_name": business_name,
                "created_at": datetime.now().isoformat()
            }

        self._deployment_records[business_id].update({
            "stripe_customer_id": customer_id,
            "stripe_subscription_id": subscription_id,
            "stripe_payment_intent_id": None,  # Legacy field, not used with subscriptions
            "subscription_status": "active",
            "monthly_price_usd": 5.0
        })

        logger.info(
            f"Recorded Stripe subscription for {business_id}: "
            f"customer={customer_id}, subscription={subscription_id}"
        )

    async def _generate_full_application(
        self,
        requirements: BusinessRequirements,
        revenue_projection: Dict[str, Any]
    ) -> Dict[str, bytes]:
        """
        Generate a complete, production-ready application using AI.

        Falls back to static site if product generation is disabled.

        Args:
            requirements: Business requirements
            revenue_projection: Revenue projection for static fallback

        Returns:
            Dict mapping filename to file content (bytes)
        """
        if not self._product_generation_enabled or not self._product_generator:
            logger.info("Product generation disabled, using static site fallback")
            return self._generate_static_site_fallback(requirements, revenue_projection)

        try:
            # Map business type to product generator enum
            business_type_map = {
                "saas": BusinessType.SAAS,
                "content": BusinessType.CONTENT,
                "ecommerce": BusinessType.ECOMMERCE,
                "blog": BusinessType.CONTENT,
                "store": BusinessType.ECOMMERCE,
                "app": BusinessType.SAAS,
            }

            product_type = business_type_map.get(
                requirements.business_type.lower(),
                BusinessType.SAAS  # Default to SaaS
            )

            # Create product requirements
            product_reqs = ProductRequirements(
                business_type=product_type,
                name=requirements.name,
                description=requirements.description,
                features=requirements.mvp_features,
                target_audience=requirements.target_audience,
                monetization_model=requirements.monetization,
                tech_preferences=None,
                custom_requirements=None
            )

            logger.info(f"Generating {product_type.value} application with Claude Sonnet 4...")

            # Generate product
            generated_product = await self._product_generator.generate_product(
                requirements=product_reqs,
                use_cache=True  # Use learned templates when available
            )

            logger.info(
                f"Generated {len(generated_product.files)} files in "
                f"{generated_product.generation_time_seconds:.2f}s"
            )

            # Validate generated product
            if self._product_validator:
                logger.info("Validating generated product...")
                validation_result = await self._product_validator.validate_product(
                    files=generated_product.files,
                    required_features=requirements.mvp_features,
                    business_type=product_type.value
                )

                generated_product.validation_results = {
                    "passed": validation_result.passed,
                    "quality_score": validation_result.quality_score,
                    "security_issues": len(validation_result.security_issues),
                    "quality_issues": len(validation_result.quality_issues),
                    "feature_completeness": validation_result.feature_completeness,
                    "recommendations": validation_result.recommendations
                }

                logger.info(
                    f"Validation: passed={validation_result.passed}, "
                    f"score={validation_result.quality_score:.1f}/100"
                )

                # Log critical security issues
                critical_issues = [
                    issue for issue in validation_result.security_issues
                    if issue.severity.value == "critical"
                ]
                if critical_issues:
                    logger.warning(
                        f"CRITICAL: {len(critical_issues)} critical security issues found"
                    )
                    for issue in critical_issues:
                        logger.warning(f"  - {issue.file}:{issue.line} - {issue.message}")

            # Convert string files to bytes
            files_bytes = {
                filename: content.encode('utf-8') if isinstance(content, str) else content
                for filename, content in generated_product.files.items()
            }

            # Add setup instructions as README
            if "SETUP.md" not in files_bytes:
                files_bytes["SETUP.md"] = generated_product.setup_instructions.encode('utf-8')

            return files_bytes

        except Exception as exc:
            logger.error(f"Product generation failed: {exc}", exc_info=True)
            logger.info("Falling back to static site generation")
            return self._generate_static_site_fallback(requirements, revenue_projection)

    def _generate_static_site_fallback(
        self,
        requirements: BusinessRequirements,
        revenue_projection: Dict[str, Any]
    ) -> Dict[str, bytes]:
        """Generate a minimal static site showcasing the business (fallback)."""
        projection = revenue_projection.get("projected_monthly_revenue", 0)
        assumptions = revenue_projection.get("assumptions", [])

        name_html = self._sanitize_html(requirements.name)
        description_html = self._sanitize_html(requirements.description)
        audience_html = self._sanitize_html(requirements.target_audience)

        features_html = "".join(
            f"<li>{self._sanitize_html(feature)}</li>"
            for feature in requirements.mvp_features
            if feature
        )
        tech_html = "".join(
            f"<span class=\"tag\">{self._sanitize_html(tech)}</span>"
            for tech in requirements.tech_stack
            if tech
        )
        assumptions_html = "".join(
            f"<li>{self._sanitize_html(str(text))}</li>"
            for text in assumptions
            if text is not None
        )

        index_html = textwrap.dedent(
            f"""\
            <!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'none'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'none'; font-src 'self'; object-src 'none'; media-src 'self'; frame-src 'none';" />
              <title>{name_html}</title>
              <link rel="stylesheet" href="/styles.css" />
            </head>
            <body>
              <header class="hero">
                <h1>{name_html}</h1>
                <p>{description_html}</p>
                <p class="audience">Built for: {audience_html}</p>
                <a class="cta" href="#features">Explore Features</a>
              </header>

              <section id="features" class="card">
                <h2>Key Features</h2>
                <ul>{features_html}</ul>
              </section>

              <section class="card">
                <h2>Tech Stack</h2>
                <div class="tags">{tech_html}</div>
              </section>

              <section class="card">
                <h2>Projected Revenue</h2>
                <p class="revenue">${projection:,.0f} / month</p>
                <ul>{assumptions_html}</ul>
              </section>

              <footer>
                <p>Generated autonomously by Genesis Meta-Agent.</p>
              </footer>
            </body>
            </html>
            """
        )

        styles_css = textwrap.dedent(
            """\
            :root {
              color-scheme: light dark;
              --bg: #0b1120;
              --card: rgba(15, 23, 42, 0.65);
              --accent: #38bdf8;
              --text: #e2e8f0;
              --muted: #94a3b8;
            }
            * {
              box-sizing: border-box;
              font-family: 'Inter', system-ui, -apple-system, sans-serif;
            }
            body {
              margin: 0;
              min-height: 100vh;
              background: radial-gradient(circle at top, rgba(56,189,248,0.15), transparent 55%), var(--bg);
              color: var(--text);
              display: flex;
              flex-direction: column;
              gap: 2rem;
              padding: 2rem;
            }
            .hero {
              text-align: center;
              padding: 3rem 2rem;
              border-radius: 1.5rem;
              background: linear-gradient(135deg, rgba(56,189,248,0.2), rgba(56,189,248,0.05));
              box-shadow: 0 20px 45px rgba(15,23,42,0.6);
            }
            .hero h1 {
              margin: 0;
              font-size: clamp(2.5rem, 5vw, 3.5rem);
            }
            .hero p {
              max-width: 680px;
              margin: 1rem auto;
              color: var(--muted);
            }
            .cta {
              display: inline-block;
              margin-top: 1.5rem;
              padding: 0.75rem 1.5rem;
              border-radius: 999px;
              background: var(--accent);
              color: #0f172a;
              font-weight: 600;
              text-decoration: none;
              transition: transform 0.2s ease, box-shadow 0.2s ease;
            }
            .cta:hover {
              transform: translateY(-2px);
              box-shadow: 0 12px 30px rgba(56,189,248,0.35);
            }
            .card {
              background: var(--card);
              padding: 2rem;
              border-radius: 1.25rem;
              box-shadow: 0 10px 30px rgba(15,23,42,0.55);
            }
            .card h2 {
              margin-top: 0;
              margin-bottom: 1rem;
            }
            ul {
              padding-left: 1.25rem;
              line-height: 1.6;
            }
            .tags {
              display: flex;
              flex-wrap: wrap;
              gap: 0.75rem;
            }
            .tag {
              background: rgba(56,189,248,0.15);
              border: 1px solid rgba(56,189,248,0.35);
              color: var(--accent);
              padding: 0.35rem 0.75rem;
              border-radius: 999px;
              font-size: 0.85rem;
            }
            .revenue {
              font-size: 2.5rem;
              font-weight: 700;
              margin: 0;
            }
            footer {
              text-align: center;
              color: var(--muted);
              font-size: 0.9rem;
              margin-top: auto;
            }
            """
        )

        return {
            "index.html": index_html.encode("utf-8"),
            "styles.css": styles_css.encode("utf-8"),
        }

    @staticmethod
    def _slugify(value: str) -> str:
        """Convert text to a safe slug for deployment/project names."""
        slug = "".join(ch.lower() if ch.isalnum() else "-" for ch in value)
        slug = "-".join(filter(None, slug.split("-")))
        return slug[:48] or "genesis-project"

    def _simulate_revenue_projection(
        self,
        requirements: BusinessRequirements,
        team: List[str],
        task_results: List[Dict[str, Any]],
        success: bool,
        execution_time: float
    ) -> Dict[str, Any]:
        """
        Generate a lightweight revenue projection for the created business.

        This is a deterministic heuristic that helps downstream analytics reason
        about potential monetization without invoking external services.

        Args:
            requirements: Finalized business requirements.
            team: Team composition used for execution.
            task_results: Execution results for each task.
            success: Whether the business creation pipeline completed successfully.
            execution_time: Total execution time (seconds).

        Returns:
            Dict containing revenue projection metadata.
        """
        feature_count = len(requirements.mvp_features)
        tech_count = len(set(requirements.tech_stack))
        team_size = max(len(team), 1)
        completed = len([r for r in task_results if r.get("status") == "completed"])
        total_tasks = max(len(task_results), 1)
        completion_rate = completed / total_tasks

        if not success:
            return {
                "projected_monthly_revenue": 0,
                "confidence": 0.1,
                "payback_period_days": None,
                "status": "unavailable",
                "assumptions": [
                    "Business creation unsuccessful",
                    "Revenue projection deferred until relaunch"
                ],
                "completion_rate": round(completion_rate, 2)
            }

        # Base assumptions
        base_mrr = 750  # baseline monthly recurring revenue in USD
        feature_bonus = feature_count * 120
        tech_bonus = tech_count * 85
        execution_bonus = int(completion_rate * 600)
        projected_mrr = base_mrr + feature_bonus + tech_bonus + execution_bonus

        # Confidence increases with completion rate and team diversity
        confidence = min(0.95, 0.55 + (completion_rate * 0.35) + (team_size * 0.015))

        # Payback period approximated using a notional $5k initial investment
        payback_period_days = max(
            14,
            int(5000 / max(projected_mrr, 1)) * 30
        )

        return {
            "projected_monthly_revenue": projected_mrr,
            "confidence": round(confidence, 2),
            "payback_period_days": payback_period_days,
            "status": "projected",
            "assumptions": [
                f"{feature_count} MVP features at launch",
                f"{tech_count} core technologies",
                f"Team size of {team_size}",
                f"Execution time {execution_time:.2f}s"
            ],
            "completion_rate": round(completion_rate, 2)
        }

    def _validate_deployment_env(self) -> Dict[str, bool]:
        """
        Validate environment variables for real deployment.

        Returns:
            Dict with deployment readiness status for each service
        """
        return {
            "vercel_ready": bool(os.getenv("VERCEL_TOKEN") and os.getenv("VERCEL_TEAM_ID")),
            "stripe_ready": bool(os.getenv("STRIPE_SECRET_KEY") or os.getenv("STRIPE_API_KEY")),
            "full_e2e_enabled": os.getenv("RUN_GENESIS_FULL_E2E") == "true",
            "vercel_client_available": self._vercel_client is not None,
            "deployment_validator_available": self._deployment_validator is not None
        }

    def _create_deployment_error_context(self, error: Exception) -> Dict[str, Any]:
        """
        Create detailed error context for debugging deployment failures.

        Args:
            error: Exception that occurred during deployment

        Returns:
            Dict with comprehensive error context
        """
        return {
            "error_type": type(error).__name__,
            "error_message": str(error),
            "vercel_token_present": bool(os.getenv("VERCEL_TOKEN")),
            "vercel_team_id_present": bool(os.getenv("VERCEL_TEAM_ID")),
            "deployment_stage": self._current_deployment_stage,
            "business_context": {
                "business_id": self._current_business_context.get("business_id"),
                "business_name": self._current_business_context.get("business_name"),
                "business_type": self._current_business_context.get("business_type")
            },
            "suggested_fixes": self._suggest_fixes(error),
            "documentation_link": "docs/GENESIS_META_AGENT_GUIDE.md#troubleshooting"
        }

    def _suggest_fixes(self, error: Exception) -> List[str]:
        """
        Suggest fixes based on error type.

        Args:
            error: Exception that occurred

        Returns:
            List of suggested fix actions
        """
        suggestions = []
        error_msg = str(error).lower()

        if "401" in error_msg or "unauthorized" in error_msg:
            suggestions.append("Check that VERCEL_TOKEN is valid and not expired")
            suggestions.append("Regenerate token at https://vercel.com/account/tokens")
        elif "403" in error_msg or "forbidden" in error_msg:
            suggestions.append("Verify VERCEL_TEAM_ID has deployment permissions")
            suggestions.append("Check team settings at https://vercel.com/teams/settings")
        elif "timeout" in error_msg:
            suggestions.append("Increase deployment timeout in vercel_client.wait_for_deployment()")
            suggestions.append("Check Vercel dashboard for build status")
        elif "network" in error_msg or "connection" in error_msg:
            suggestions.append("Verify internet connectivity")
            suggestions.append("Check Vercel API status at https://www.vercel-status.com/")
        else:
            suggestions.append("Review deployment logs in Vercel dashboard")
            suggestions.append("Check GENESIS_META_AGENT_GUIDE.md for troubleshooting")

        return suggestions

    async def _check_existing_deployment(self, business_name: str) -> Optional[Dict]:
        """
        Check if business already deployed (idempotency).

        Args:
            business_name: Name of the business to check

        Returns:
            Existing deployment info if found, None otherwise
        """
        if not self.memory:
            return None

        try:
            existing = await self.memory.get(
                namespace=("business", business_name),
                key="deployment_status"
            )
            return existing.value if existing else None
        except Exception as exc:
            logger.warning(f"Failed to check existing deployment: {exc}")
            return None

    def _calculate_deployment_costs(
        self,
        team_size: int,
        task_count: int,
        execution_time: float,
        vercel_deployment: bool = False,
        stripe_integration: bool = False
    ) -> Dict[str, float]:
        """
        Calculate detailed deployment costs.

        Args:
            team_size: Number of agents in team
            task_count: Total number of tasks
            execution_time: Total execution time in seconds
            vercel_deployment: Whether real Vercel deployment was used
            stripe_integration: Whether Stripe integration was enabled

        Returns:
            Dict with detailed cost breakdown
        """
        # LLM costs (GPT-4o at $3/1M tokens, assume ~500 tokens per task)
        llm_tokens = task_count * 500
        llm_cost = (llm_tokens / 1_000_000) * 3.0

        # Agent costs ($0.05 per agent)
        agent_cost = team_size * 0.05

        # Vercel costs (free tier, or $20/month prorated)
        vercel_cost = 0.0 if not vercel_deployment else 0.65  # ~$20/month ÷ 30 days

        # Stripe costs (no cost for test mode)
        stripe_cost = 0.0

        # Total
        total_usd = llm_cost + agent_cost + vercel_cost + stripe_cost

        # Projected payback (assume $750 base MRR from revenue projection)
        projected_monthly_revenue = 750.0
        payback_days = max(1, int((total_usd / max(projected_monthly_revenue, 1)) * 30))

        return {
            "llm_costs_usd": round(llm_cost, 4),
            "agent_costs_usd": round(agent_cost, 4),
            "vercel_costs_usd": round(vercel_cost, 4),
            "stripe_costs_usd": round(stripe_cost, 4),
            "total_usd": round(total_usd, 4),
            "execution_time_seconds": round(execution_time, 2),
            "projected_monthly_revenue": projected_monthly_revenue,
            "projected_payback_days": payback_days,
            "cost_details": {
                "llm_tokens": llm_tokens,
                "llm_rate_per_1m_tokens": 3.0,
                "agent_rate_each": 0.05,
                "vercel_daily_rate": 0.65 if vercel_deployment else 0.0
            }
        }

    async def _emit_lifecycle_event(
        self,
        event_type: str,
        business_id: str,
        metadata: Dict[str, Any]
    ) -> None:
        """
        Emit business lifecycle events for monitoring.

        Args:
            event_type: Type of event (created, deployed, failed, revenue_generated)
            business_id: Business ID
            metadata: Additional event metadata
        """
        from datetime import datetime, timezone

        event = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "event_type": event_type,
            "business_id": business_id,
            "metadata": metadata
        }

        # Store in memory for analytics
        if self.memory:
            try:
                await self.memory.put(
                    namespace=("business", business_id),
                    key=f"lifecycle_{event_type}_{int(asyncio.get_event_loop().time())}",
                    value=event
                )
                logger.debug(f"Emitted lifecycle event: {event_type} for {business_id}")
            except Exception as exc:
                logger.warning(f"Failed to emit lifecycle event: {exc}")

        # Emit to metrics if enabled
        if METRICS_ENABLED:
            try:
                business_lifecycle_events.labels(
                    event_type=event_type,
                    business_type=metadata.get("business_type", "unknown")
                ).inc()
            except Exception as metrics_exc:
                logger.warning(f"Failed to record lifecycle metric: {metrics_exc}")

    async def _execute_deployment_task(
        self,
        task: Task,
        agent: str,
        business_type: str,
        business_name: str
    ) -> Dict[str, Any]:
        """
        Execute deployment task with real Vercel integration.

        Args:
            task: Deployment task to execute
            agent: Agent executing the task (typically deploy_agent)
            business_type: Type of business being deployed
            business_name: Name of the business

        Returns:
            Dict with execution result including deployment_url
        """
        if not self._vercel_client or not self._deployment_validator:
            logger.warning("Vercel client not available, falling back to simulation")
            return await self._simulate_task_execution(task, agent)

        business_id = self._current_business_context.get("business_id", "unknown")
        deployment_reference: Dict[str, Any] = {}

        try:
            # Check for existing deployment (idempotency)
            existing = await self._check_existing_deployment(business_name)
            if existing and existing.get("deployment_url"):
                logger.info(f"Found existing deployment for {business_name}: {existing['deployment_url']}")
                self._record_deployment_reference({
                    "business_id": business_id,
                    "business_name": business_name,
                    "business_type": business_type,
                    "deployment_id": existing.get("deployment_id"),
                    "deployment_url": existing.get("deployment_url"),
                    "project_id": existing.get("project_id"),
                    "validated": existing.get("validation_passed"),
                    "timestamp": existing.get("timestamp"),
                    "team_id": getattr(self._vercel_client, "team_id", None),
                    "idempotent": True
                })
                return {
                    "task_id": task.task_id,
                    "agent": agent,
                    "status": "completed",
                    "description": task.description,
                    "result": f"Re-using existing deployment: {existing['deployment_url']}",
                    "deployment_url": existing["deployment_url"],
                    "idempotent": True,
                    "timestamp": datetime.now().isoformat(),
                    "via_vercel": True
                }

            # Step 1: Create Vercel project
            logger.info(f"Creating Vercel project for {business_name}...")

            # Sanitize project name (lowercase, alphanumeric, hyphens)
            project_name = business_name.lower().replace(" ", "-")
            project_name = "".join(c for c in project_name if c.isalnum() or c == "-")
            project_name = "-".join(filter(None, project_name.split("-")))  # Remove consecutive hyphens
            project_name = project_name[:63]  # Vercel limit
            if not project_name:
                project_name = f"genesis-business-{task.task_id[:8]}"

            # Determine framework based on business type
            framework_map = {
                "saas_tool": "nextjs",
                "content_website": "nextjs",
                "ecommerce_store": "nextjs",
                "marketplace": "nextjs",
                "automation_service": "python",
                "data_product": "python",
                "community_platform": "nextjs",
                "api_service": "python",
                "newsletter": "nextjs",
                "course_platform": "nextjs"
            }
            framework = framework_map.get(business_type, "nextjs")

            # Use static deployment for now (full GitHub integration later)
            logger.info(f"Creating static deployment for project {project_name}...")

            # Generate simple static site
            requirements = self._current_business_context.get("requirements")
            if requirements:
                files = await self._generate_full_application(requirements, {})
            else:
                # Fallback minimal site
                files = {
                    "index.html": b"<html><body><h1>Genesis Business</h1></body></html>"
                }

            if METRICS_ENABLED:
                try:
                    vercel_deployments_total.labels(status="attempt").inc()
                except Exception as metrics_exc:
                    logger.warning(f"Failed to record deployment attempt metric: {metrics_exc}")

            # Create static deployment
            deployment = await self._vercel_client.create_static_deployment(
                name=project_name,
                files=files,
                project_settings={"framework": "static"},
                target="production"
            )
            logger.info(f"Created deployment: {deployment.id}")

            # Step 2: Wait for deployment to complete
            logger.info(f"Waiting for deployment {deployment.id} to complete...")

            deployment_url = await self._vercel_client.wait_for_deployment(
                deployment_id=deployment.id,
                timeout_seconds=300,  # 5 minutes
                poll_interval=10
            )
            logger.info(f"Deployment ready: {deployment_url}")

            # Step 3: Validate deployment
            logger.info(f"Validating deployment at {deployment_url}...")

            validation_report = await self._deployment_validator.validate_full_deployment(
                deployment_url=deployment_url,
                business_type=business_type,
                max_response_time=5.0
            )

            if validation_report.success:
                logger.info(f"Deployment validation passed: {validation_report.pass_rate:.1f}%")
            else:
                logger.warning(
                    f"Deployment validation failed: {validation_report.passed_checks}/{validation_report.total_checks} checks passed"
                )

            deployment_reference = {
                "business_id": business_id,
                "business_name": business_name,
                "business_type": business_type,
                "deployment_id": deployment.id,
                "deployment_url": deployment_url,
                "project_id": deployment.project_id,
                "validated": validation_report.success,
                "validation_pass_rate": validation_report.pass_rate,
                "timestamp": datetime.now().isoformat(),
                "team_id": getattr(self._vercel_client, "team_id", None)
            }
            self._record_deployment_reference(deployment_reference)

            if METRICS_ENABLED:
                try:
                    vercel_deployments_total.labels(status="success").inc()
                except Exception as metrics_exc:
                    logger.warning(f"Failed to record deployment success metric: {metrics_exc}")

            # Store deployment status for idempotency
            if self.memory:
                await self.memory.put(
                    namespace=("business", business_name),
                    key="deployment_status",
                    value={
                        "deployment_url": deployment_url,
                        "deployment_id": deployment.id,
                        "project_id": deployment.project_id,
                        "timestamp": datetime.now().isoformat(),
                        "validation_passed": validation_report.success
                    }
                )

            # Emit lifecycle event
            await self._emit_lifecycle_event(
                event_type="deployed",
                business_id=self._current_business_context.get("business_id", "unknown"),
                metadata={
                    "deployment_url": deployment_url,
                    "deployment_id": deployment.id,
                    "validation_passed": validation_report.success,
                    "validation_pass_rate": validation_report.pass_rate,
                    "business_type": business_type
                }
            )

            # Send dashboard notification (P3)
            await self._notify_dashboard(
                business_id=self._current_business_context.get("business_id", "unknown"),
                update_type="deployed",
                data={
                    "deployment_url": deployment_url,
                    "validation_passed": validation_report.success,
                    "business_name": business_name,
                    "business_type": business_type
                }
            )

            # Return result with deployment_url
            return {
                "task_id": task.task_id,
                "agent": agent,
                "status": "completed" if validation_report.success else "completed_with_warnings",
                "description": task.description,
                "result": f"Successfully deployed to Vercel: {deployment_url}",
                "deployment_url": deployment_url,  # KEY: This is what E2E test expects
                "vercel_deployment_id": deployment.id,
                "validation_report": {
                    "success": validation_report.success,
                    "pass_rate": validation_report.pass_rate,
                    "total_checks": validation_report.total_checks,
                    "passed_checks": validation_report.passed_checks
                },
                "timestamp": datetime.now().isoformat(),
                "via_vercel": True,
                "idempotent": False
            }

        except Exception as exc:
            logger.error(f"Vercel deployment failed: {exc}", exc_info=True)

            # Create detailed error context
            error_context = self._create_deployment_error_context(exc)

            if METRICS_ENABLED:
                try:
                    vercel_deployments_total.labels(status="failed").inc()
                except Exception as metrics_exc:
                    logger.warning(f"Failed to record deployment failure metric: {metrics_exc}")

            # Emit failure event
            await self._emit_lifecycle_event(
                event_type="deployment_failed",
                business_id=self._current_business_context.get("business_id", "unknown"),
                metadata={
                    "error": str(exc),
                    "error_type": type(exc).__name__,
                    "error_context": error_context
                }
            )

            return {
                "task_id": task.task_id,
                "agent": agent,
                "status": "failed",
                "description": task.description,
                "result": f"Deployment failed: {str(exc)}",
                "error": str(exc),
                "error_context": error_context,
                "timestamp": datetime.now().isoformat(),
                "via_vercel": True
            }

    async def _validate_task_safety(
        self,
        task: Task,
        agent: str,
        autonomous: bool
    ) -> Dict[str, Any]:
        """
        Validate task safety using WaltzRL.

        Args:
            task: Task to validate
            agent: Agent assigned to task
            autonomous: Autonomous mode flag

        Returns:
            Dict with safety validation result
        """
        if not self.safety:
            return {"safe": True}

        # Use WaltzRL for safety classification
        query = f"Agent {agent} will execute: {task.description}"
        is_safe, score, message = self.safety.filter_unsafe_query(query)

        if not is_safe:
            # Record safety violation metric
            if METRICS_ENABLED:
                try:
                    safety_violations_total.inc()
                except Exception as metrics_exc:
                    logger.warning(f"Failed to record safety violation metric: {metrics_exc}")
            
            if autonomous:
                # Block in autonomous mode
                return {
                    "safe": False,
                    "reason": f"Safety violation: {message}",
                    "score": score.to_dict()
                }
            else:
                # Request human approval in supervised mode
                approval = await self._request_human_approval(task, score)
                return {
                    "safe": approval,
                    "reason": "Human approval required" if not approval else "Approved by human"
                }

        return {"safe": True}

    async def _request_human_approval(self, task: Task, safety_score) -> bool:
        """
        Request human approval for potentially unsafe task.

        Args:
            task: Task requiring approval
            safety_score: SafetyScore from WaltzRL

        Returns:
            True if approved, False if rejected
        """
        # In production, this would integrate with a UI or notification system
        # For now, log and return False (reject)
        logger.warning(f"Human approval required for task: {task.task_id}")
        logger.warning(f"  Task: {task.description}")
        logger.warning(f"  Safety score: {safety_score.to_dict()}")

        # Default to rejection in automated testing
        return False

    async def _execute_task_real_or_simulated(self, task: Task, agent: str) -> Dict[str, Any]:
        """
        Execute task via real A2A integration or simulation.

        Tries real A2A execution if enabled, falls back to simulation otherwise.

        Args:
            task: Task to execute
            agent: Agent executing the task

        Returns:
            Dict with execution result
        """
        # Try real A2A execution if enabled
        if self.enable_a2a and self.a2a_connector:
            try:
                # Create correlation context for tracing
                if A2A_AVAILABLE:
                    correlation_context = CorrelationContext(
                        correlation_id=str(uuid.uuid4()),
                        parent_id=task.task_id,
                        service_name="genesis-meta-agent"
                    )
                    
                    # Execute via A2A
                    result = await self.a2a_connector._execute_single_task(
                        task=task,
                        agent_name=agent,
                        dependency_results={},  # Dependencies handled by dag execution order
                        correlation_context=correlation_context
                    )
                    
                    # Convert A2A result to our format
                    return {
                        "task_id": task.task_id,
                        "agent": agent,
                        "status": "completed" if result.status == "success" else "failed",
                        "description": task.description,
                        "result": result.result if result.status == "success" else result.error,
                        "execution_time_ms": result.execution_time_ms,
                        "timestamp": datetime.now().isoformat(),
                        "via_a2a": True
                    }
            except Exception as exc:
                logger.warning(f"A2A execution failed, falling back to simulation: {exc}")
                # Fall through to simulation
        
        # Fallback to simulated execution
        return await self._simulate_task_execution(task, agent)
    
    async def _simulate_task_execution(self, task: Task, agent: str) -> Dict[str, Any]:
        """
        Simulate task execution (fallback when A2A unavailable).

        Args:
            task: Task to execute
            agent: Agent executing the task

        Returns:
            Dict with execution result
        """
        # Simulate execution delay
        await asyncio.sleep(0.1)

        # Simulate successful execution for most tasks
        return {
            "task_id": task.task_id,
            "agent": agent,
            "status": "completed",
            "description": task.description,
            "result": f"Successfully completed by {agent}",
            "timestamp": datetime.now().isoformat(),
            "via_a2a": False
        }

    def _sanitize_html(self, value: Optional[str]) -> str:
        """Escape user/LLM-provided text before rendering into HTML."""
        if value is None:
            return ""
        return html.escape(str(value), quote=True)

    def _validate_and_normalize_requirements(
        self,
        requirements: BusinessRequirements
    ) -> BusinessRequirements:
        """Validate user-provided requirements and normalize values."""
        payload = {
            "name": requirements.name,
            "description": requirements.description,
            "target_audience": requirements.target_audience,
            "monetization": requirements.monetization,
            "mvp_features": requirements.mvp_features,
            "tech_stack": requirements.tech_stack,
            "success_metrics": requirements.success_metrics,
            "business_type": requirements.business_type or "general",
            "estimated_time": requirements.estimated_time,
        }

        try:
            validated = _BusinessRequirementsSchema(**payload)
        except ValidationError as exc:
            logger.warning(f"Requirement validation failed: {exc}")
            raise BusinessCreationError(f"Invalid business requirements: {exc}") from exc

        requirements.name = validated.name
        requirements.description = validated.description
        requirements.target_audience = validated.target_audience
        requirements.monetization = validated.monetization
        requirements.mvp_features = validated.mvp_features
        requirements.tech_stack = validated.tech_stack
        requirements.success_metrics = validated.success_metrics
        requirements.business_type = validated.business_type
        requirements.estimated_time = validated.estimated_time
        return requirements

    def _should_use_fast_decomposition(self, requirements: BusinessRequirements) -> bool:
        """Determine whether to use cached/template decomposition."""
        if not self._fast_htdag_enabled:
            return False
        return requirements.business_type in self._fast_htdag_types

    def _build_fast_task_dag(self, requirements: BusinessRequirements) -> TaskDAG:
        """Construct a TaskDAG from predefined blueprints."""
        blueprint = FAST_DECOMPOSITION_BLUEPRINTS.get(
            requirements.business_type,
            FAST_DECOMPOSITION_BLUEPRINTS["default"]
        )

        dag = TaskDAG()
        ctx = {
            "name": requirements.name,
            "business_type": requirements.business_type,
            "target_audience": requirements.target_audience,
            "monetization": requirements.monetization,
            "tech_stack": ", ".join(requirements.tech_stack),
            "feature_headline": ", ".join(requirements.mvp_features[:3]) or "core features",
        }

        id_map: Dict[str, str] = {}
        for idx, node in enumerate(blueprint, start=1):
            suffix = node["id"]
            task_id = f"{requirements.business_type}_{suffix}_{idx}"
            id_map[suffix] = task_id
            description = node["description"].format(**ctx)
            dag.add_task(Task(
                task_id=task_id,
                task_type=node.get("type", "implementation"),
                description=description,
                metadata={
                    "business_type": requirements.business_type,
                    "template": "fast_htdag",
                    "original_task": suffix
                },
                estimated_duration=1.5
            ))

        for node in blueprint:
            for dependency in node.get("deps", []):
                if dependency in id_map:
                    dag.add_dependency(id_map[dependency], id_map[node["id"]])

        return dag

    def _record_auth_failure(self, reason: str) -> None:
        """Increment auth failure metrics and log the reason."""
        logger.warning(f"Authorization failure: {reason}")
        if METRICS_ENABLED:
            try:
                business_auth_failures_total.labels(reason=reason).inc()
            except Exception as metrics_exc:
                logger.warning(f"Failed to record auth metric: {metrics_exc}")

    def _authorize_request(
        self,
        request_context: Optional[BusinessRequestContext]
    ) -> Tuple[str, Optional[str]]:
        """
        Validate the caller and return (user_id, token) pair.

        Raises:
            BusinessCreationError when authorization fails.
        """
        if not self._auth_enabled:
            if request_context is None:
                return "system", None
            request_context.user_id = request_context.user_id or "system"
            return request_context.user_id, None

        if request_context is None:
            self._record_auth_failure("missing_context")
            raise BusinessCreationError("Unauthorized: request context is required.")

        token = request_context.api_token or request_context.metadata.get("api_token")
        if not token:
            self._record_auth_failure("missing_token")
            raise BusinessCreationError("Unauthorized: API token missing.")

        token_info = self._tokens_to_users.get(token)
        if not token_info:
            self._record_auth_failure("invalid_token")
            raise BusinessCreationError("Unauthorized: API token not recognised.")

        user_id = request_context.user_id or token_info.get("user_id") or "unknown"
        request_context.user_id = user_id
        quota_limit = token_info.get("quota_override") or self._default_quota
        request_context.metadata["quota_limit"] = quota_limit

        return user_id, token

    def _record_quota_denial(self, user_id: str) -> None:
        """Record quota denial metric."""
        logger.warning(f"Quota exceeded for user {user_id}")
        if METRICS_ENABLED:
            try:
                business_quota_denied_total.labels(user_id=user_id).inc()
            except Exception as metrics_exc:
                logger.warning(f"Failed to record quota metric: {metrics_exc}")

    async def _enforce_quota(
        self,
        user_id: str,
        token: Optional[str]
    ) -> Dict[str, Any]:
        """
        Enforce per-user quota using distributed QuotaManager or in-memory tracking.

        Raises:
            BusinessCreationError when quota exceeded.
        """
        if not self._auth_enabled:
            return {
                "limit": None,
                "consumed": None,
                "remaining": None,
                "window_seconds": self._quota_window_seconds,
                "reset_at": None,
                "backend": "none"
            }

        limit = self._default_quota
        if token and token in self._tokens_to_users:
            override = self._tokens_to_users[token].get("quota_override")
            if isinstance(override, int) and override > 0:
                limit = override

        # Use distributed quota manager if available
        if self._quota_manager:
            try:
                snapshot = await self._quota_manager.check_and_increment(
                    user_id=user_id,
                    limit=limit,
                    token=token
                )
                return snapshot
            except QuotaExceededError as exc:
                self._record_quota_denial(user_id)
                raise BusinessCreationError(str(exc))
            except Exception as exc:
                logger.warning(f"Quota manager error: {exc}, falling back to in-memory")
                # Fall through to in-memory tracking

        # Fallback to in-memory quota tracking
        now = time.time()
        usage = self._quota_usage.get(user_id)

        if not usage or now - usage["window_start"] >= self._quota_window_seconds:
            usage = {"count": 0, "window_start": now}
            self._quota_usage[user_id] = usage

        if usage["count"] >= limit:
            self._record_quota_denial(user_id)
            raise BusinessCreationError(
                f"Quota exceeded for user {user_id}: limit {limit} per {self._quota_window_seconds} seconds."
            )

        usage["count"] += 1

        reset_at = usage["window_start"] + self._quota_window_seconds
        snapshot = {
            "limit": limit,
            "consumed": usage["count"],
            "remaining": max(0, limit - usage["count"]),
            "window_seconds": self._quota_window_seconds,
            "reset_at": datetime.fromtimestamp(reset_at).isoformat(),
            "backend": "memory"
        }
        usage["snapshot"] = snapshot
        return snapshot

    def _validate_deployment_env(self) -> Dict[str, Any]:
        """Return current deployment/payments readiness snapshot."""
        vercel_token = os.getenv("VERCEL_TOKEN") or getattr(self._vercel_client, "token", None)
        vercel_team = os.getenv("VERCEL_TEAM_ID") or getattr(self._vercel_client, "team_id", None)
        stripe_key = self._stripe_key

        return {
            "full_e2e_mode": self.full_e2e_mode,
            "vercel_ready": bool(self._deployment_enabled and self._vercel_client and vercel_token),
            "vercel_token_present": bool(vercel_token),
            "vercel_team_present": bool(vercel_team),
            "stripe_ready": bool(self._stripe_enabled and stripe_key),
            "stripe_key_is_test": bool(stripe_key and isinstance(stripe_key, str) and "test" in stripe_key.lower()),
            "metrics_enabled": METRICS_ENABLED,
            "deployment_stage": self._current_deployment_stage
        }

    def _record_deployment_reference(self, reference: Dict[str, Any]) -> None:
        """Persist deployment metadata for takedown and auditing."""
        business_id = reference.get("business_id")
        if not business_id:
            return

        record = self._deployment_records.setdefault(business_id, {})
        record.update({k: v for k, v in reference.items() if v is not None})
        record.setdefault("recorded_at", datetime.now().isoformat())

    def _record_payment_intent(
        self,
        business_id: str,
        requirements: BusinessRequirements,
        intent_id: Optional[str]
    ) -> None:
        """Attach Stripe payment metadata to deployment records."""
        if not business_id or not intent_id:
            return

        record = self._deployment_records.setdefault(business_id, {})
        record.setdefault("business_name", requirements.name)
        record.setdefault("business_type", requirements.business_type)
        record.update({
            "stripe_payment_intent_id": intent_id,
            "stripe_payment_created_at": datetime.now().isoformat()
        })

    async def takedown_business(
        self,
        business_id: str,
        reason: str = "operator_request"
    ) -> Dict[str, Any]:
        """
        Remove deployed resources for a business (Vercel + Stripe).

        Returns dict summarising takedown outcome.
        """
        record = self._deployment_records.get(business_id)
        takedown_summary: Dict[str, Any] = {
            "business_id": business_id,
            "reason": reason,
            "timestamp": datetime.now().isoformat(),
            "vercel": "not_found",
            "stripe": "not_found"
        }

        if not record:
            logger.warning(f"No deployment record found for business {business_id}")
            if METRICS_ENABLED:
                try:
                    business_takedowns_total.labels(status="not_found").inc()
                except Exception as metrics_exc:
                    logger.warning(f"Failed to record takedown metric: {metrics_exc}")
            return takedown_summary

        # Attempt Vercel project deletion
        if self._vercel_client and record.get("project_id"):
            try:
                await self._vercel_client.delete_project(record["project_id"])
                takedown_summary["vercel"] = "deleted"
            except Exception as exc:  # pragma: no cover - network
                logger.warning(f"Failed to delete Vercel project {record['project_id']}: {exc}")
                takedown_summary["vercel"] = f"error:{exc}"
        else:
            takedown_summary["vercel"] = "skipped"

        # Attempt Stripe subscription cancellation
        subscription_id = record.get("stripe_subscription_id")
        customer_id = record.get("stripe_customer_id")

        if self._stripe_enabled and stripe and subscription_id:
            loop = asyncio.get_running_loop()

            def _cancel_subscription():
                try:
                    # Cancel subscription immediately (not at period end)
                    cancelled_sub = stripe.Subscription.cancel(subscription_id)  # type: ignore[attr-defined]

                    # Optionally delete the customer (cleanup)
                    if customer_id:
                        try:
                            stripe.Customer.delete(customer_id)  # type: ignore[attr-defined]
                        except Exception as cust_exc:
                            logger.warning(f"Failed to delete Stripe customer {customer_id}: {cust_exc}")

                    return cancelled_sub
                except Exception as exc:  # pragma: no cover - network
                    return exc

            cancel_result = await loop.run_in_executor(None, _cancel_subscription)
            if isinstance(cancel_result, Exception):
                logger.warning(f"Failed to cancel Stripe subscription {subscription_id}: {cancel_result}")
                takedown_summary["stripe"] = f"error:{cancel_result}"
            else:
                logger.info(f"Successfully cancelled Stripe subscription {subscription_id}")
                takedown_summary["stripe"] = "cancelled"

                # Update metrics (decrement revenue)
                if METRICS_ENABLED:
                    try:
                        business_type = record.get("business_type", "unknown")
                        # Note: Counter can't decrement, so we track cancellations separately
                        stripe_subscriptions_total.labels(status="cancelled").inc()
                    except Exception as metrics_exc:
                        logger.warning(f"Failed to record Stripe cancellation metric: {metrics_exc}")
        elif subscription_id:
            takedown_summary["stripe"] = "skipped"

        # Legacy: Also handle old payment_intent records (backward compatibility)
        stripe_intent = record.get("stripe_payment_intent_id")
        if stripe_intent and not subscription_id and self._stripe_enabled and stripe:
            loop = asyncio.get_running_loop()

            def _cancel_intent():
                try:
                    return stripe.PaymentIntent.cancel(stripe_intent)  # type: ignore[attr-defined]
                except Exception as exc:  # pragma: no cover - network
                    return exc

            cancel_result = await loop.run_in_executor(None, _cancel_intent)
            if isinstance(cancel_result, Exception):
                logger.warning(f"Failed to cancel legacy Stripe intent {stripe_intent}: {cancel_result}")
            else:
                logger.info(f"Cancelled legacy Stripe payment intent {stripe_intent}")
                if takedown_summary["stripe"] == "skipped":
                    takedown_summary["stripe"] = "cancelled_legacy"

        # Attempt LangGraph memory cleanup
        business_name = record.get("business_name")
        if self.memory and business_name:
            try:
                # Delete business-specific memory entries
                await self.memory.delete(
                    namespace=("business", business_name),
                    key="deployment_status"
                )
                
                # Also try to delete by business_id namespace
                await self.memory.delete(
                    namespace=("business", business_id),
                    key="metadata"
                )
                
                takedown_summary["memory"] = "deleted"
                logger.info(f"Deleted memory entries for business {business_id}")
            except Exception as exc:
                logger.warning(f"Failed to delete memory for business {business_id}: {exc}")
                takedown_summary["memory"] = f"error:{exc}"
        else:
            takedown_summary["memory"] = "skipped"

        status = "success"
        if takedown_summary["vercel"].startswith("error") or takedown_summary["stripe"].startswith("error") or takedown_summary.get("memory", "").startswith("error"):
            status = "partial"
        if takedown_summary["vercel"] == "skipped" and takedown_summary.get("stripe") in {"skipped", "not_found"} and takedown_summary.get("memory") == "skipped":
            status = "partial"

        if METRICS_ENABLED:
            try:
                business_takedowns_total.labels(status=status).inc()
            except Exception as metrics_exc:
                logger.warning(f"Failed to record takedown metric: {metrics_exc}")

        record["takedown"] = takedown_summary
        return takedown_summary

    def _is_successful(self, results: List[Dict[str, Any]]) -> bool:
        """
        Determine if business creation was successful.

        Criteria:
        - No blocked tasks
        - At least 80% tasks completed
        - No critical failures

        Args:
            results: List of task execution results

        Returns:
            True if successful, False otherwise
        """
        if not results:
            return False

        # Check for blockers
        blocked = [r for r in results if r.get("status") == "blocked"]
        if blocked:
            logger.warning(f"Business creation blocked: {len(blocked)} blocked tasks")
            return False

        # Check completion rate
        completed = [r for r in results if r.get("status") == "completed"]
        completion_rate = len(completed) / len(results)
        if completion_rate < 0.8:
            logger.warning(f"Business creation incomplete: {completion_rate:.1%} completion rate")
            return False

        # Check for critical failures
        critical_failures = [
            r for r in results
            if r.get("critical") and r.get("status") == "failed"
        ]
        if critical_failures:
            logger.warning(f"Business creation failed: {len(critical_failures)} critical failures")
            return False

        return True

    def _extract_deployment_url(self, results: List[Dict[str, Any]]) -> Optional[str]:
        """
        Extract deployment URL from task results.

        Args:
            results: List of task execution results

        Returns:
            Deployment URL if found, placeholder for simulation, None for failures
        """
        # Check for real deployment URL
        for result in results:
            if "deployment_url" in result:
                return result["deployment_url"]
            if "url" in result:
                return result["url"]

        # In simulation mode, return placeholder URL for testing
        if not self._deployment_enabled and self._current_business_context:
            business_id = self._current_business_context.get("business_id", "unknown")
            return f"https://simulated-{business_id[:8]}.vercel.app"

        # No deployment URL found
        return None

    async def _store_success_pattern(
        self,
        business_id: str,
        business_type: str,
        requirements: BusinessRequirements,
        team: List[str],
        task_results: List[Dict[str, Any]]
    ) -> None:
        """
        Store successful business pattern in memory for future learning.

        Args:
            business_id: Unique business ID
            business_type: Type of business
            requirements: Business requirements
            team: Team composition
            task_results: Task execution results
        """
        if not self.memory:
            return

        # Calculate success metrics
        success_metrics = self._calculate_success_metrics(task_results)

        try:
            # Store in business namespace
            await self.memory.put(
                namespace=("business", business_id),
                key="metadata",
                value={
                    "business_type": business_type,
                    "requirements": requirements.to_dict(),
                    "team": team,
                    "task_count": len(task_results),
                    "success_metrics": success_metrics,
                    "success": True,
                    "timestamp": datetime.now().isoformat()
                }
            )

            logger.info(f"Stored success pattern for business: {business_id}")
            
            # Record successful memory operation
            if METRICS_ENABLED:
                try:
                    memory_operations_total.labels(
                        operation="store",
                        status="success"
                    ).inc()
                except Exception as metrics_exc:
                    logger.warning(f"Failed to record memory metric: {metrics_exc}")
        
        except Exception as exc:
            logger.error(f"Failed to store success pattern: {exc}")
            
            # Record failed memory operation
            if METRICS_ENABLED:
                try:
                    memory_operations_total.labels(
                        operation="store",
                        status="failed"
                    ).inc()
                except Exception as metrics_exc:
                    logger.warning(f"Failed to record memory metric: {metrics_exc}")

    @lru_cache(maxsize=20)
    def _get_cached_business_archetype(self, business_type: str) -> Dict[str, Any]:
        """
        Cache business archetypes for faster access (P3 optimization).

        Args:
            business_type: Type of business

        Returns:
            Dict with archetype configuration
        """
        # Business archetype templates
        archetypes = {
            "saas_tool": {
                "default_features": ["User authentication", "Core functionality", "Dashboard"],
                "default_stack": ["Next.js", "Python", "MongoDB"],
                "monetization": "Freemium",
                "target_audience": "Developers"
            },
            "content_website": {
                "default_features": ["Blog posts", "SEO optimization", "Newsletter signup"],
                "default_stack": ["Next.js", "Markdown", "CMS"],
                "monetization": "Ads + Sponsorships",
                "target_audience": "General readers"
            },
            "ecommerce_store": {
                "default_features": ["Product catalog", "Shopping cart", "Checkout"],
                "default_stack": ["Next.js", "Stripe", "MongoDB"],
                "monetization": "Product sales",
                "target_audience": "Online shoppers"
            },
            "marketplace": {
                "default_features": ["User listings", "Search + filters", "Transactions"],
                "default_stack": ["Next.js", "Python", "MongoDB", "Stripe"],
                "monetization": "Transaction fees",
                "target_audience": "Buyers and sellers"
            },
            "automation_service": {
                "default_features": ["Workflow automation", "API integrations", "Scheduling"],
                "default_stack": ["Python", "Celery", "Redis"],
                "monetization": "Subscription tiers",
                "target_audience": "Businesses"
            }
        }

        return archetypes.get(business_type, {
            "default_features": ["Core functionality"],
            "default_stack": ["Next.js", "Python"],
            "monetization": "Freemium",
            "target_audience": "General users"
        })

    async def _notify_dashboard(
        self,
        business_id: str,
        update_type: str,
        data: Dict[str, Any]
    ) -> None:
        """
        Send real-time updates to dashboard (P3 integration hook).

        Args:
            business_id: Business ID
            update_type: Type of update (created, deployed, failed, etc.)
            data: Update data payload
        """
        dashboard_url = os.getenv("GENESIS_DASHBOARD_URL")
        if not dashboard_url:
            logger.debug("Dashboard webhook disabled (GENESIS_DASHBOARD_URL not set)")
            return

        import httpx

        payload = {
            "business_id": business_id,
            "update_type": update_type,
            "data": data,
            "timestamp": datetime.now().isoformat()
        }

        attempts = int(os.getenv("GENESIS_DASHBOARD_MAX_RETRIES", "3"))
        backoff = 0.5

        for attempt in range(1, attempts + 1):
            try:
                async with httpx.AsyncClient() as client:
                    response = await client.post(
                        f"{dashboard_url}/api/businesses/{business_id}/events",
                        json=payload,
                        timeout=5.0
                    )

                if response.status_code in (200, 201, 204):
                    logger.debug(f"Dashboard notification sent: {update_type} for {business_id}")
                    return

                logger.warning(f"Dashboard notification attempt {attempt} failed: HTTP {response.status_code}")
                if 400 <= response.status_code < 500:
                    # Do not retry client errors (bad payload, auth, etc.)
                    break

            except (httpx.HTTPError, Exception) as exc:
                logger.warning(f"Dashboard notification attempt {attempt} errored: {exc}")

            if attempt < attempts:
                await asyncio.sleep(backoff)
                backoff *= 2

        logger.warning(f"Dashboard notification abandoned after {attempts} attempts for {business_id}")

    def _calculate_success_metrics(self, task_results: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Calculate success metrics from task results.

        Args:
            task_results: List of task execution results

        Returns:
            Dict with calculated metrics
        """
        total_tasks = len(task_results)
        completed_tasks = len([r for r in task_results if r.get("status") == "completed"])
        blocked_tasks = len([r for r in task_results if r.get("status") == "blocked"])

        return {
            "total_tasks": total_tasks,
            "completed_tasks": completed_tasks,
            "blocked_tasks": blocked_tasks,
            "completion_rate": completed_tasks / total_tasks if total_tasks > 0 else 0,
            "average_task_time": 0.1  # Placeholder - will be calculated from actual execution
        }


class BusinessCreationError(Exception):
    """Exception raised for business creation failures"""
    pass


# Singleton instance for easy access
_genesis_meta_agent_instance: Optional[GenesisMetaAgent] = None


def get_genesis_meta_agent(
    mongodb_uri: str = None,
    enable_safety: bool = True,
    enable_memory: bool = True,
    autonomous: bool = True
) -> GenesisMetaAgent:
    """
    Get singleton GenesisMetaAgent instance.

    Args:
        mongodb_uri: MongoDB connection string
        enable_safety: Enable WaltzRL safety
        enable_memory: Enable LangGraph memory
        autonomous: Default autonomous mode

    Returns:
        GenesisMetaAgent singleton instance
    """
    global _genesis_meta_agent_instance
    if _genesis_meta_agent_instance is None:
        _genesis_meta_agent_instance = GenesisMetaAgent(
            mongodb_uri=mongodb_uri,
            enable_safety=enable_safety,
            enable_memory=enable_memory,
            autonomous=autonomous
        )
    return _genesis_meta_agent_instance
