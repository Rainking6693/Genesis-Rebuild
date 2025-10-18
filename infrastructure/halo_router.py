"""
HALORouter: Hierarchical Agent Logic Orchestration
Based on HALO (arXiv:2505.13516)

Key Features:
- Logic-based declarative routing rules
- Explainable agent selection (traceable decisions)
- Capability-based matching
- Integration with TaskDAG for dependency-aware routing
- Support for Genesis 15-agent ensemble
- Agent authentication (VULN-002 fix)
- DAAO cost optimization (Phase 2 integration)
"""
import logging
from typing import Dict, List, Optional, Any, Tuple, Union
from dataclasses import dataclass, field
from infrastructure.task_dag import TaskDAG, Task, TaskStatus
from infrastructure.agent_auth_registry import AgentAuthRegistry, SecurityError

logger = logging.getLogger(__name__)


@dataclass
class RoutingRule:
    """
    Declarative routing rule: IF condition THEN agent

    Example:
        RoutingRule(
            rule_id="deploy_to_cloud",
            condition={"task_type": "deploy", "platform": "cloud"},
            target_agent="deploy_agent",
            priority=10,
            explanation="Cloud deployment tasks route to Deploy Agent"
        )
    """
    rule_id: str
    condition: Dict[str, Any]  # Matching criteria
    target_agent: str
    priority: int = 0  # Higher priority = checked first
    explanation: str = ""  # Human-readable reasoning


@dataclass
class AgentCapability:
    """
    Agent capability profile for matching

    Defines what an agent can do, its cost tier, and historical success rate.
    Used for capability-based matching when no declarative rule matches.
    """
    agent_name: str
    supported_task_types: List[str]
    skills: List[str]
    cost_tier: str  # "cheap" (Flash), "medium" (GPT-4o), "expensive" (Claude)
    success_rate: float = 0.0  # Historical success rate (0.0-1.0)
    max_concurrent_tasks: int = 10  # Load balancing


@dataclass
class RoutingPlan:
    """
    Complete routing plan for a DAG

    Contains:
    - assignments: task_id -> agent_name mapping
    - explanations: task_id -> reasoning for selection
    - unassigned_tasks: tasks with no matching agent
    - metadata: Optional optimization metadata (DAAO Phase 2)
    """
    assignments: Dict[str, str] = field(default_factory=dict)  # task_id -> agent_name
    explanations: Dict[str, str] = field(default_factory=dict)  # task_id -> explanation
    unassigned_tasks: List[str] = field(default_factory=list)
    metadata: Dict[str, Any] = field(default_factory=dict)  # DAAO optimization metadata

    def is_complete(self) -> bool:
        """Check if all tasks are assigned"""
        return len(self.unassigned_tasks) == 0

    def get_agent_workload(self) -> Dict[str, int]:
        """Get task count per agent"""
        workload = {}
        for agent in self.assignments.values():
            workload[agent] = workload.get(agent, 0) + 1
        return workload


class HALORouter:
    """
    Logic-based hierarchical agent routing

    Implements HALO paper's three-level architecture:
    1. High-Level Planning: Analyzes DAG structure
    2. Mid-Level Role Design: Selects agents via logic rules
    3. Low-Level Inference: Prepares for execution

    Routing Algorithm:
    1. Apply declarative rules (priority order)
    2. Fall back to capability-based matching
    3. Consider agent workload for load balancing
    4. Log explainable reasoning for every decision
    """

    def __init__(
        self,
        agent_registry: Optional[Dict[str, AgentCapability]] = None,
        auth_registry: Optional[AgentAuthRegistry] = None,
        enable_cost_optimization: bool = False,
        cost_profiler = None,
        daao_optimizer = None
    ):
        """
        Initialize HALORouter

        Args:
            agent_registry: Optional custom agent registry (defaults to Genesis 15-agent ensemble)
            auth_registry: Optional authentication registry (VULN-002 fix)
            enable_cost_optimization: Enable DAAO cost optimization (Phase 2 feature)
            cost_profiler: Optional CostProfiler instance
            daao_optimizer: Optional DAAOOptimizer instance
        """
        self.agent_registry = agent_registry or self._get_genesis_15_agents()
        self.routing_rules = self._initialize_routing_rules()
        self.agent_workload: Dict[str, int] = {agent: 0 for agent in self.agent_registry.keys()}

        # VULN-002 FIX: Agent authentication
        self.auth_registry = auth_registry or AgentAuthRegistry()

        # DAAO Phase 2: Cost optimization
        self.enable_cost_optimization = enable_cost_optimization
        self.cost_profiler = cost_profiler
        self.daao_optimizer = daao_optimizer

        # OPTIMIZATION 1: Cache sorted rules (avoid re-sorting on every task)
        self._sorted_rules_cache = sorted(self.routing_rules, key=lambda r: r.priority, reverse=True)

        # OPTIMIZATION 2: Build task_type -> rules index for O(1) lookups
        # Sort rules by priority first
        self._task_type_index: Dict[str, List[RoutingRule]] = {}
        for rule in self._sorted_rules_cache:
            task_type = rule.condition.get("task_type")
            if task_type:
                if task_type not in self._task_type_index:
                    self._task_type_index[task_type] = []
                self._task_type_index[task_type].append(rule)

        # OPTIMIZATION 3: Build task_type -> agents index for capability matching
        self._capability_index: Dict[str, List[tuple]] = {}
        for agent_name, agent_cap in self.agent_registry.items():
            for task_type in agent_cap.supported_task_types:
                if task_type not in self._capability_index:
                    self._capability_index[task_type] = []
                self._capability_index[task_type].append((agent_name, agent_cap))

        self.logger = logger
        self.logger.info(
            f"Initialized HALORouter with {len(self.agent_registry)} agents "
            f"(cost_optimization={'enabled' if enable_cost_optimization else 'disabled'})"
        )

    def _get_genesis_15_agents(self) -> Dict[str, AgentCapability]:
        """
        Get Genesis 15-agent registry

        Based on CLAUDE.md architecture:
        - Spec/Architect agents: Planning & design
        - Builder agents: Implementation
        - QA/Test agents: Validation
        - Deploy agents: Infrastructure
        - Marketing agents: Go-to-market
        - Support agents: Customer service
        - Analytics agents: Monitoring
        - Security agents: Vulnerability scanning
        """
        return {
            # Design & Planning (cheap, fast)
            "spec_agent": AgentCapability(
                agent_name="spec_agent",
                supported_task_types=["design", "requirements", "architecture", "planning"],
                skills=["specification", "planning", "requirements_analysis"],
                cost_tier="cheap",
                success_rate=0.85
            ),
            "architect_agent": AgentCapability(
                agent_name="architect_agent",
                supported_task_types=["architecture", "system_design", "technical_spec"],
                skills=["system_design", "architecture", "scalability"],
                cost_tier="medium",
                success_rate=0.88
            ),

            # Implementation (medium cost, Claude for code)
            "builder_agent": AgentCapability(
                agent_name="builder_agent",
                supported_task_types=["implement", "code", "build", "develop", "generic", "api_call", "file_write"],
                skills=["coding", "debugging", "refactoring"],
                cost_tier="medium",
                success_rate=0.82
            ),
            "frontend_agent": AgentCapability(
                agent_name="frontend_agent",
                supported_task_types=["frontend", "ui", "design_implementation"],
                skills=["react", "vue", "css", "javascript"],
                cost_tier="medium",
                success_rate=0.80
            ),
            "backend_agent": AgentCapability(
                agent_name="backend_agent",
                supported_task_types=["backend", "api", "database"],
                skills=["python", "node", "sql", "api_design"],
                cost_tier="medium",
                success_rate=0.83
            ),

            # Testing & QA (cheap, high volume)
            "qa_agent": AgentCapability(
                agent_name="qa_agent",
                supported_task_types=["test", "validation", "qa", "quality_assurance", "test_run"],
                skills=["testing", "test_automation", "quality_assurance"],
                cost_tier="cheap",
                success_rate=0.87
            ),
            "security_agent": AgentCapability(
                agent_name="security_agent",
                supported_task_types=["security", "vulnerability_scan", "penetration_test"],
                skills=["security", "vulnerability_analysis", "compliance"],
                cost_tier="medium",
                success_rate=0.90
            ),

            # Infrastructure & Deployment (medium cost)
            "deploy_agent": AgentCapability(
                agent_name="deploy_agent",
                supported_task_types=["deploy", "infrastructure", "devops"],
                skills=["devops", "cloud", "kubernetes", "ci_cd"],
                cost_tier="medium",
                success_rate=0.84
            ),
            "monitoring_agent": AgentCapability(
                agent_name="monitoring_agent",
                supported_task_types=["monitor", "observability", "metrics"],
                skills=["monitoring", "alerting", "performance_analysis"],
                cost_tier="cheap",
                success_rate=0.86
            ),

            # Go-to-Market (cheap, content generation)
            "marketing_agent": AgentCapability(
                agent_name="marketing_agent",
                supported_task_types=["marketing", "promotion", "content"],
                skills=["marketing", "advertising", "content_creation"],
                cost_tier="cheap",
                success_rate=0.78
            ),
            "sales_agent": AgentCapability(
                agent_name="sales_agent",
                supported_task_types=["sales", "outreach", "lead_generation"],
                skills=["sales", "outreach", "prospecting"],
                cost_tier="cheap",
                success_rate=0.75
            ),

            # Customer Success (cheap, conversational)
            "support_agent": AgentCapability(
                agent_name="support_agent",
                supported_task_types=["support", "customer_service", "help"],
                skills=["customer_support", "troubleshooting", "documentation"],
                cost_tier="cheap",
                success_rate=0.82
            ),

            # Analytics & Optimization (medium cost, data analysis)
            "analytics_agent": AgentCapability(
                agent_name="analytics_agent",
                supported_task_types=["analytics", "reporting", "data_analysis"],
                skills=["data_analysis", "reporting", "visualization"],
                cost_tier="medium",
                success_rate=0.85
            ),

            # Research & Discovery (medium cost, deep reasoning)
            "research_agent": AgentCapability(
                agent_name="research_agent",
                supported_task_types=["research", "discovery", "investigation"],
                skills=["research", "analysis", "competitive_intelligence"],
                cost_tier="medium",
                success_rate=0.81
            ),

            # Financial Operations (medium cost, precision required)
            "finance_agent": AgentCapability(
                agent_name="finance_agent",
                supported_task_types=["finance", "accounting", "budgeting"],
                skills=["finance", "accounting", "budgeting", "pricing"],
                cost_tier="medium",
                success_rate=0.88
            ),
        }

    def _initialize_routing_rules(self) -> List[RoutingRule]:
        """
        Define declarative routing rules

        Rules are checked in priority order (highest first).
        Rules match on task_type and optional metadata fields.

        Example rule logic:
        - IF task_type="deploy" AND platform="cloud" THEN deploy_agent
        - IF task_type="implement" AND language="python" THEN backend_agent
        """
        return [
            # Design & Planning Rules
            RoutingRule(
                rule_id="rule_design",
                condition={"task_type": "design"},
                target_agent="spec_agent",
                priority=10,
                explanation="Design tasks route to Spec Agent (requirements, architecture)"
            ),
            RoutingRule(
                rule_id="rule_architecture",
                condition={"task_type": "architecture"},
                target_agent="architect_agent",
                priority=10,
                explanation="Architecture tasks route to Architect Agent (system design)"
            ),
            RoutingRule(
                rule_id="rule_requirements",
                condition={"task_type": "requirements"},
                target_agent="spec_agent",
                priority=10,
                explanation="Requirements gathering routes to Spec Agent"
            ),

            # Implementation Rules
            RoutingRule(
                rule_id="rule_implement",
                condition={"task_type": "implement"},
                target_agent="builder_agent",
                priority=10,
                explanation="Implementation tasks route to Builder Agent (coding)"
            ),
            RoutingRule(
                rule_id="rule_frontend",
                condition={"task_type": "frontend"},
                target_agent="frontend_agent",
                priority=15,
                explanation="Frontend tasks route to Frontend Agent (UI/UX)"
            ),
            RoutingRule(
                rule_id="rule_backend",
                condition={"task_type": "backend"},
                target_agent="backend_agent",
                priority=15,
                explanation="Backend tasks route to Backend Agent (API/DB)"
            ),
            RoutingRule(
                rule_id="rule_code",
                condition={"task_type": "code"},
                target_agent="builder_agent",
                priority=10,
                explanation="Generic code tasks route to Builder Agent"
            ),

            # Testing Rules
            RoutingRule(
                rule_id="rule_test",
                condition={"task_type": "test"},
                target_agent="qa_agent",
                priority=10,
                explanation="Testing tasks route to QA Agent (validation)"
            ),
            RoutingRule(
                rule_id="rule_security",
                condition={"task_type": "security"},
                target_agent="security_agent",
                priority=10,
                explanation="Security tasks route to Security Agent (vulnerability scanning)"
            ),

            # Infrastructure Rules
            RoutingRule(
                rule_id="rule_deploy",
                condition={"task_type": "deploy"},
                target_agent="deploy_agent",
                priority=10,
                explanation="Deployment tasks route to Deploy Agent (infrastructure)"
            ),
            RoutingRule(
                rule_id="rule_infrastructure",
                condition={"task_type": "infrastructure"},
                target_agent="deploy_agent",
                priority=10,
                explanation="Infrastructure tasks route to Deploy Agent (DevOps)"
            ),
            RoutingRule(
                rule_id="rule_monitoring",
                condition={"task_type": "monitor"},
                target_agent="monitoring_agent",
                priority=10,
                explanation="Monitoring tasks route to Monitoring Agent (observability)"
            ),

            # Marketing Rules
            RoutingRule(
                rule_id="rule_marketing",
                condition={"task_type": "marketing"},
                target_agent="marketing_agent",
                priority=10,
                explanation="Marketing tasks route to Marketing Agent (promotion)"
            ),
            RoutingRule(
                rule_id="rule_sales",
                condition={"task_type": "sales"},
                target_agent="sales_agent",
                priority=10,
                explanation="Sales tasks route to Sales Agent (lead generation)"
            ),

            # Support Rules
            RoutingRule(
                rule_id="rule_support",
                condition={"task_type": "support"},
                target_agent="support_agent",
                priority=10,
                explanation="Support tasks route to Support Agent (customer service)"
            ),

            # Analytics Rules
            RoutingRule(
                rule_id="rule_analytics",
                condition={"task_type": "analytics"},
                target_agent="analytics_agent",
                priority=10,
                explanation="Analytics tasks route to Analytics Agent (reporting)"
            ),

            # Research Rules
            RoutingRule(
                rule_id="rule_research",
                condition={"task_type": "research"},
                target_agent="research_agent",
                priority=10,
                explanation="Research tasks route to Research Agent (discovery)"
            ),

            # Finance Rules
            RoutingRule(
                rule_id="rule_finance",
                condition={"task_type": "finance"},
                target_agent="finance_agent",
                priority=10,
                explanation="Finance tasks route to Finance Agent (accounting)"
            ),

            # Atomic Task Types
            RoutingRule(
                rule_id="rule_api_call",
                condition={"task_type": "api_call"},
                target_agent="builder_agent",
                priority=15,
                explanation="API call tasks route to Builder Agent (execution)"
            ),
            RoutingRule(
                rule_id="rule_file_write",
                condition={"task_type": "file_write"},
                target_agent="builder_agent",
                priority=15,
                explanation="File write tasks route to Builder Agent (file operations)"
            ),
            RoutingRule(
                rule_id="rule_test_run",
                condition={"task_type": "test_run"},
                target_agent="qa_agent",
                priority=15,
                explanation="Test execution routes to QA Agent (testing)"
            ),

            # Generic/Fallback Rules
            RoutingRule(
                rule_id="rule_generic",
                condition={"task_type": "generic"},
                target_agent="builder_agent",
                priority=5,
                explanation="Generic tasks route to Builder Agent as default handler"
            ),
        ]

    async def route_tasks(
        self,
        dag_or_tasks: Union[TaskDAG, List[Task]],
        available_agents: Optional[List[str]] = None,
        agent_tokens: Optional[Dict[str, str]] = None,
        optimization_constraints = None
    ) -> RoutingPlan:
        """
        Route all tasks in DAG to optimal agents

        Algorithm (with DAAO Phase 2 integration):
        1. TYPE CONVERSION: Accept TaskDAG or List[Task] for API flexibility
        2. VERIFY agent identities (VULN-002 fix)
        3. For each task in DAG (topological order - respects dependencies)
        4. Apply routing rules (priority order)
        5. If no rule matches, use capability matching
        6. Consider agent workload for load balancing
        7. [PHASE 2] Apply DAAO cost optimization (if enabled)
        8. If no agent found, mark as unassigned
        9. Log explanation for each decision (EXPLAINABILITY)

        Args:
            dag_or_tasks: Either a TaskDAG object or a list of Task objects
            available_agents: Optional list of available agent names (defaults to all)
            agent_tokens: Optional dict of agent_name -> auth_token (VULN-002 fix)
            optimization_constraints: Optional DAAO optimization constraints (Phase 2)

        Returns:
            RoutingPlan with assignments, explanations, and unassigned tasks

        Raises:
            SecurityError: If agent authentication fails
            TypeError: If dag_or_tasks is neither TaskDAG nor List[Task]
        """
        # TYPE CONVERSION: Normalize input to TaskDAG
        if isinstance(dag_or_tasks, TaskDAG):
            dag = dag_or_tasks
        elif isinstance(dag_or_tasks, list):
            # Convert List[Task] to TaskDAG
            dag = TaskDAG()
            for task in dag_or_tasks:
                if not isinstance(task, Task):
                    raise TypeError(f"Expected Task object, got {type(task)}")
                dag.add_task(task)
        else:
            raise TypeError(
                f"Expected TaskDAG or List[Task], got {type(dag_or_tasks).__name__}. "
                f"Usage: route_tasks(dag) or route_tasks([task1, task2]) or route_tasks(dag.get_all_tasks())"
            )

        self.logger.info(f"Routing {len(dag)} tasks from DAG")

        available_agents = available_agents or list(self.agent_registry.keys())

        # VULN-002 FIX: Verify all agents are authenticated
        if agent_tokens:
            self._verify_agents(available_agents, agent_tokens)

        routing_plan = RoutingPlan()

        # Reset workload tracking
        self.agent_workload = {agent: 0 for agent in self.agent_registry.keys()}

        # Process tasks in topological order (respects dependencies)
        try:
            task_order = dag.topological_sort()
        except (ValueError, Exception) as e:
            # Catch both ValueError from our DAG and NetworkXUnfeasible from networkx
            self.logger.error(f"DAG has cycles or invalid structure: {e}")
            return routing_plan

        for task_id in task_order:
            task = dag.tasks[task_id]

            # Skip if already completed
            if task.status == TaskStatus.COMPLETED:
                self.logger.debug(f"Skipping completed task {task_id}")
                continue

            # Try routing logic
            agent, explanation = self._apply_routing_logic(task, available_agents)

            if agent:
                routing_plan.assignments[task_id] = agent
                routing_plan.explanations[task_id] = explanation
                self.agent_workload[agent] += 1

                # Update task assignment
                dag.tasks[task_id].agent_assigned = agent

                self.logger.info(f"Routed {task_id} → {agent}: {explanation}")
            else:
                routing_plan.unassigned_tasks.append(task_id)
                self.logger.warning(f"No agent found for {task_id} (type={task.task_type})")

        # PHASE 2: Apply DAAO cost optimization (if enabled)
        if self.enable_cost_optimization and self.daao_optimizer and routing_plan.assignments:
            try:
                self.logger.info("Applying DAAO cost optimization...")
                optimized_plan = await self.daao_optimizer.optimize_routing_plan(
                    initial_plan=routing_plan.assignments,
                    dag=dag,
                    constraints=optimization_constraints
                )

                # Update routing plan with optimized assignments
                original_assignments = routing_plan.assignments.copy()
                routing_plan.assignments = optimized_plan.assignments

                # Update explanations for changed assignments
                changes = 0
                for task_id, optimized_agent in optimized_plan.assignments.items():
                    original_agent = original_assignments.get(task_id)
                    if original_agent != optimized_agent:
                        changes += 1
                        routing_plan.explanations[task_id] = (
                            f"DAAO optimized: {original_agent} → {optimized_agent} "
                            f"(cost saving: ${optimized_plan.cost_savings:.4f})"
                        )

                # Add optimization metadata to routing plan
                routing_plan.metadata["daao_optimized"] = True
                routing_plan.metadata["cost_savings"] = optimized_plan.cost_savings
                routing_plan.metadata["estimated_cost"] = optimized_plan.estimated_cost
                routing_plan.metadata["changes_made"] = changes

                self.logger.info(
                    f"DAAO optimization complete: {changes} assignments changed, "
                    f"saved ${optimized_plan.cost_savings:.4f} "
                    f"({optimized_plan.optimization_details.get('savings_pct', 0):.1f}%)"
                )

            except Exception as e:
                self.logger.error(f"DAAO optimization failed: {e}, using baseline routing")

        # Log final routing statistics
        self._log_routing_stats(routing_plan)

        return routing_plan

    def _apply_routing_logic(
        self,
        task: Task,
        available_agents: List[str]
    ) -> Tuple[Optional[str], str]:
        """
        Apply routing rules to select agent

        Priority order:
        1. Declarative rules (highest priority first)
        2. Capability-based matching
        3. Load balancing consideration

        Returns:
            (agent_name, explanation) or (None, "reason")

        OPTIMIZATIONS:
        - Use pre-cached sorted rules (avoid re-sorting)
        - Use task_type index for O(1) rule lookup
        - Use capability index for O(1) agent lookup
        - Early exit on first match
        """

        # OPTIMIZATION 4: Use task_type index for fast rule lookup (O(1) instead of O(n))
        task_type = task.task_type
        candidate_rules = self._task_type_index.get(task_type, [])

        # Step 1: Try declarative rules using index (much faster)
        for rule in candidate_rules:
            if self._rule_matches_fast(rule, task):
                if rule.target_agent in available_agents:
                    # Check if agent is overloaded
                    agent_cap = self.agent_registry[rule.target_agent]
                    if self.agent_workload[rule.target_agent] < agent_cap.max_concurrent_tasks:
                        return rule.target_agent, f"Rule {rule.rule_id}: {rule.explanation}"
                    # else: continue to next rule or fallback

        # Step 2: Capability-based matching using index (O(1) instead of O(n))
        candidate_agents_from_index = self._capability_index.get(task_type, [])

        # Filter by availability and workload
        candidate_agents = [
            (agent_name, agent_cap)
            for agent_name, agent_cap in candidate_agents_from_index
            if agent_name in available_agents
            and self.agent_workload[agent_name] < agent_cap.max_concurrent_tasks
        ]

        if candidate_agents:
            # Select best candidate (highest success rate, then lowest workload)
            best_agent = max(
                candidate_agents,
                key=lambda x: (x[1].success_rate, -self.agent_workload[x[0]])
            )
            agent_name, agent_cap = best_agent
            return (
                agent_name,
                f"Capability match: {agent_name} supports {task.task_type} "
                f"(success_rate={agent_cap.success_rate:.2f}, workload={self.agent_workload[agent_name]})"
            )

        # Step 3: No match found
        return None, f"No matching agent for task_type={task.task_type}"

    def _rule_matches(self, rule: RoutingRule, task: Task) -> bool:
        """
        Check if routing rule matches task

        A rule matches if ALL conditions are satisfied:
        - condition["task_type"] matches task.task_type
        - All other condition keys match task.metadata values
        """
        for key, value in rule.condition.items():
            if key == "task_type":
                if task.task_type != value:
                    return False
            elif key in task.metadata:
                if task.metadata[key] != value:
                    return False
            else:
                # Condition key not found in task metadata
                return False
        return True

    def _rule_matches_fast(self, rule: RoutingRule, task: Task) -> bool:
        """
        OPTIMIZATION 5: Fast rule matching with early exit

        Optimized version of _rule_matches with:
        - Early exit on first mismatch
        - Reduced function call overhead
        - task_type already checked via index
        """
        # Since we're using task_type index, we know task_type matches
        # Only need to check metadata conditions
        for key, value in rule.condition.items():
            if key == "task_type":
                continue  # Already matched via index
            elif key in task.metadata:
                if task.metadata[key] != value:
                    return False
            else:
                return False
        return True

    def _log_routing_stats(self, routing_plan: RoutingPlan) -> None:
        """Log routing statistics"""
        total_tasks = len(routing_plan.assignments) + len(routing_plan.unassigned_tasks)
        assigned_pct = (len(routing_plan.assignments) / total_tasks * 100) if total_tasks > 0 else 0

        self.logger.info(f"Routing complete: {len(routing_plan.assignments)}/{total_tasks} tasks assigned ({assigned_pct:.1f}%)")

        if routing_plan.unassigned_tasks:
            self.logger.warning(f"Unassigned tasks: {routing_plan.unassigned_tasks}")

        workload = routing_plan.get_agent_workload()
        if workload:
            self.logger.info(f"Agent workload: {workload}")

    async def create_specialized_agent(
        self,
        task: Task,
        agent_creator=None
    ) -> Optional[str]:
        """
        Dynamically create agent if no existing agent matches (AATC Phase 2)

        This implements HALO's "dynamic agent creation" capability using AATC.

        Algorithm:
        1. Use DynamicAgentCreator to generate new agent with custom tools
        2. Register agent in HALORouter's agent_registry
        3. Return agent name for routing

        Args:
            task: Task that needs specialized agent
            agent_creator: DynamicAgentCreator instance (optional)

        Returns:
            Agent name if created successfully, None otherwise
        """
        if agent_creator is None:
            self.logger.info(f"Dynamic agent creation requested for {task.task_id} (no creator provided)")
            return None

        try:
            # Step 1: Create dynamic agent with AATC
            dynamic_agent = await agent_creator.create_agent_for_task(
                task_description=task.description,
                context={"task_type": task.task_type, "metadata": task.metadata}
            )

            # Step 2: Convert to AgentCapability and register
            agent_capability = agent_creator.convert_to_agent_capability(dynamic_agent)
            self.agent_registry[dynamic_agent.agent_id] = agent_capability

            # Initialize workload tracking
            self.agent_workload[dynamic_agent.agent_id] = 0

            self.logger.info(
                f"Created and registered dynamic agent '{dynamic_agent.name}' "
                f"({dynamic_agent.agent_id}) for task {task.task_id}"
            )

            # Step 3: Return agent name for routing
            return dynamic_agent.agent_id

        except Exception as e:
            self.logger.error(f"Failed to create dynamic agent for {task.task_id}: {e}")
            return None

    def add_routing_rule(self, rule: RoutingRule) -> None:
        """
        Add custom routing rule

        Allows runtime addition of new routing rules.
        Useful for domain-specific routing logic.

        OPTIMIZATION: Updates caches when adding new rules
        """
        self.routing_rules.append(rule)

        # Update sorted cache (re-sort to maintain priority order)
        self._sorted_rules_cache = sorted(self.routing_rules, key=lambda r: r.priority, reverse=True)

        # Update task_type index (rebuild to maintain priority order)
        task_type = rule.condition.get("task_type")
        if task_type:
            # Rebuild index for this task_type to maintain sort order
            self._task_type_index[task_type] = [
                r for r in self._sorted_rules_cache
                if r.condition.get("task_type") == task_type
            ]

        self.logger.info(f"Added routing rule: {rule.rule_id} (priority={rule.priority})")

    def get_agent_workload(self) -> Dict[str, int]:
        """
        Get current task count per agent (for load balancing)

        Returns:
            Dict mapping agent_name to current task count
        """
        return dict(self.agent_workload)

    def update_agent_capability(
        self,
        agent_name: str,
        success_rate: Optional[float] = None,
        cost_tier: Optional[str] = None
    ) -> None:
        """
        Update agent capability profile (for learning/adaptation)

        Allows runtime updates to agent profiles based on:
        - Historical success rates
        - Cost optimizations
        - Performance monitoring
        """
        if agent_name not in self.agent_registry:
            self.logger.warning(f"Agent {agent_name} not in registry")
            return

        agent_cap = self.agent_registry[agent_name]

        if success_rate is not None:
            old_rate = agent_cap.success_rate
            agent_cap.success_rate = success_rate
            self.logger.info(f"Updated {agent_name} success_rate: {old_rate:.2f} → {success_rate:.2f}")

        if cost_tier is not None:
            old_tier = agent_cap.cost_tier
            agent_cap.cost_tier = cost_tier
            self.logger.info(f"Updated {agent_name} cost_tier: {old_tier} → {cost_tier}")

    def get_routing_explanation(self, task_id: str, routing_plan: RoutingPlan) -> str:
        """
        Get human-readable explanation for routing decision

        Provides full explainability for debugging and auditing.
        """
        if task_id in routing_plan.assignments:
            agent = routing_plan.assignments[task_id]
            explanation = routing_plan.explanations[task_id]
            return f"Task '{task_id}' was routed to '{agent}': {explanation}"
        elif task_id in routing_plan.unassigned_tasks:
            return f"Task '{task_id}' could not be assigned (no matching agent)"
        else:
            return f"Task '{task_id}' not found in routing plan"

    # VULN-002 FIX: Agent authentication methods

    def register_agent(
        self,
        agent_name: str,
        metadata: Optional[Dict[str, str]] = None
    ) -> tuple[str, str]:
        """
        Register agent with cryptographic authentication

        Args:
            agent_name: Agent name to register
            metadata: Optional metadata (version, capabilities, etc.)

        Returns:
            (agent_id, auth_token) - Store auth_token securely

        Raises:
            ValueError: If agent already registered
        """
        return self.auth_registry.register_agent(agent_name, metadata)

    def _verify_agents(
        self,
        agent_names: List[str],
        agent_tokens: Dict[str, str]
    ) -> None:
        """
        Verify all agents are authenticated

        Args:
            agent_names: List of agent names to verify
            agent_tokens: Dict of agent_name -> auth_token

        Raises:
            SecurityError: If any agent fails verification
        """
        for agent_name in agent_names:
            # Check if agent is in registry
            if agent_name not in self.agent_registry:
                raise SecurityError(f"Unknown agent: '{agent_name}'")

            # Get token
            if agent_name not in agent_tokens:
                raise SecurityError(f"No authentication token provided for agent: '{agent_name}'")

            auth_token = agent_tokens[agent_name]

            # Verify
            if not self.auth_registry.verify_agent(agent_name, auth_token):
                raise SecurityError(f"Agent authentication failed: '{agent_name}'")

        self.logger.info(f"All {len(agent_names)} agents verified successfully")

    def is_agent_registered(self, agent_name: str) -> bool:
        """Check if agent is registered with authentication"""
        return self.auth_registry.is_registered(agent_name)

    def revoke_agent(self, agent_name: str) -> bool:
        """Revoke agent authentication"""
        return self.auth_registry.revoke_agent(agent_name)
