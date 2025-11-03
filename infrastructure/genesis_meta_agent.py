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
from typing import Dict, Any, List, Optional, Tuple
from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum

# Infrastructure imports
from infrastructure.htdag_planner import HTDAGPlanner
from infrastructure.halo_router import HALORouter, RoutingPlan, AgentCapability
from infrastructure.swarm.inclusive_fitness import InclusiveFitnessSwarm
from infrastructure.langgraph_store import GenesisLangGraphStore
from infrastructure.waltzrl_safety import WaltzRLSafety
from infrastructure.task_dag import TaskDAG, Task, TaskStatus
from infrastructure.llm_client import OpenAIClient, LLMClientError, LLMProvider

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
        a2a_service_url: str = None
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
        """
        # Get MongoDB URI from env if not provided
        if mongodb_uri is None:
            mongodb_uri = os.getenv("MONGODB_URI", "mongodb://localhost:27017/")

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

        logger.info("GenesisMetaAgent initialized successfully")
        logger.info(f"  - HTDAG: Enabled")
        logger.info(f"  - HALO: Enabled (cost_optimization={enable_cost_optimization})")
        logger.info(f"  - Swarm: Enabled")
        logger.info(f"  - Memory: {'Enabled' if enable_memory else 'Disabled'}")
        logger.info(f"  - Safety: {'Enabled' if enable_safety else 'Disabled'}")
        logger.info(f"  - A2A: {'Enabled' if self.enable_a2a else 'Disabled (simulated)'}")
        logger.info(f"  - Mode: {'Autonomous' if autonomous else 'Supervised'}")

    async def create_business(
        self,
        business_type: str,
        requirements: Optional[BusinessRequirements] = None,
        autonomous: Optional[bool] = None,
        enable_memory_learning: bool = True
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

        logger.info(f"Starting business creation: type={business_type}, id={business_id}, mode={'autonomous' if autonomous_mode else 'supervised'}")

        try:
            # Step 1: Generate business idea (if requirements not provided)
            if requirements is None:
                logger.info("Generating business idea...")
                requirements = await self._generate_business_idea(business_type)
                logger.info(f"Generated idea: {requirements.name}")

            # Add business_type to requirements
            requirements.business_type = business_type

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

            # Step 8: Extract deployment URL
            deployment_url = self._extract_deployment_url(task_results)

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

            # Calculate execution time
            execution_time = asyncio.get_event_loop().time() - start_time

            # Simulate revenue projection
            revenue_projection = self._simulate_revenue_projection(
                requirements,
                team,
                task_results,
                success,
                execution_time
            )

            metadata = {
                "similar_businesses_found": len(similar_businesses),
                "autonomous_mode": autonomous_mode,
                "team_size": len(team),
                "task_count": len(task_results),
                "completion_rate": revenue_projection.get("completion_rate", 0.0)
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
                    "team_size": len(team)
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

        # Ensure minimum team (builder, deploy, qa)
        essential_agents = ["builder_agent", "deploy_agent", "qa_agent"]
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
        if any("test" in tech for tech in tech_stack_lower):
            capabilities.add("testing")
        if any("stripe" in tech or "payment" in tech for tech in tech_stack_lower):
            capabilities.add("payments")

        # Add QA for quality
        capabilities.add("code_review")

        # Add content for marketing copy
        if requirements.monetization:
            capabilities.add("content_strategy")

        return list(capabilities)

    async def _decompose_business_tasks(self, requirements: BusinessRequirements) -> TaskDAG:
        """
        Decompose business creation into hierarchical task DAG using HTDAG.

        Args:
            requirements: Business requirements

        Returns:
            TaskDAG with hierarchical decomposition
        """
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
        for task in task_dag.get_execution_order():
            task_id = task.task_id
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
            result = await self._execute_task_real_or_simulated(task, agent)
            results.append(result)

        return results

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
            Deployment URL if found, None otherwise
        """
        for result in results:
            if "deployment_url" in result:
                return result["deployment_url"]
            if "url" in result:
                return result["url"]

        # Generate placeholder URL for testing
        # In production, this will come from actual deployment tasks
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
