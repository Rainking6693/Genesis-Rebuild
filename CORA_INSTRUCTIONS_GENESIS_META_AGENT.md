# CORA INSTRUCTIONS: Genesis Meta-Agent Core
**Assignment Date:** November 3, 2025
**Agent:** Cora (Agent Orchestration & Prompt Engineering Specialist)
**Timeline:** 10 hours
**Priority:** CRITICAL
**Tools:** Context7 MCP + Haiku 4.5 where possible

---

## 🎯 MISSION

Build the Genesis Meta-Agent orchestrator - the autonomous system that generates business ideas, composes teams, and coordinates full business creation end-to-end.

**Context:** This is the **CORE** of Genesis autonomous business creation. All previous infrastructure (HTDAG, HALO, SE-Darwin, WaltzRL, Memory) converges here.

---

## 📋 TASKS

### Task 1: Genesis Meta-Agent Core (6 hours)

**Goal:** Build the master orchestrator that autonomously creates businesses from idea → deployment.

**Files to Create:**

#### 1. `infrastructure/genesis_meta_agent.py` (600 lines)
```python
"""
Genesis Meta-Agent - Autonomous Business Creation Orchestrator

Integrates all Genesis layers:
- Layer 1: HTDAG + HALO + AOP (task orchestration)
- Layer 2: SE-Darwin (self-improvement)
- Layer 3: A2A (agent communication)
- Layer 5: Swarm (team composition)
- Layer 6: Memory (collective learning)
- WaltzRL: Safety validation
"""

from typing import Dict, Any, List, Optional
from infrastructure.orchestration.htdag import HTDAGOrchestrator
from infrastructure.orchestration.halo_router import HALORouter
from infrastructure.swarm.inclusive_fitness import InclusiveFitnessOptimizer
from infrastructure.memory.langgraph_store import LangGraphStore
from infrastructure.safety.waltzrl_safety import WaltzRLSafetyValidator

class GenesisMetaAgent:
    """
    Genesis Meta-Agent - Master orchestrator for autonomous business creation.

    Workflow:
    1. Generate business idea (GPT-4o creativity)
    2. Compose optimal team (Swarm Optimizer)
    3. Decompose tasks (HTDAG)
    4. Route to agents (HALO)
    5. Validate safety (WaltzRL)
    6. Learn patterns (Memory Store)
    7. Monitor & evolve (SE-Darwin)
    """

    def __init__(self):
        """Initialize Genesis Meta-Agent with all subsystems."""
        self.htdag = HTDAGOrchestrator()
        self.halo = HALORouter()
        self.swarm = InclusiveFitnessOptimizer()
        self.memory = LangGraphStore(namespace="business")
        self.safety = WaltzRLSafetyValidator()

    async def create_business(
        self,
        business_type: str,
        requirements: Optional[Dict[str, Any]] = None,
        autonomous: bool = True
    ) -> BusinessCreationResult:
        """
        Autonomously create a complete business.

        Args:
            business_type: Type of business (saas, ecommerce, content, etc.)
            requirements: Optional custom requirements (or auto-generate)
            autonomous: If True, fully autonomous. If False, human-in-loop.

        Returns:
            BusinessCreationResult with deployment URL, team composition, metrics
        """
        # Step 1: Generate business idea (if requirements not provided)
        if requirements is None:
            requirements = await self._generate_business_idea(business_type)

        # Step 2: Query memory for similar successful businesses
        similar_businesses = await self.memory.search(
            query=f"Successful {business_type} businesses",
            namespace="business",
            limit=5
        )

        # Step 3: Compose optimal team (Swarm Optimizer)
        team = await self.swarm.optimize_team(
            business_requirements=requirements,
            historical_successes=similar_businesses
        )

        # Step 4: Decompose into tasks (HTDAG)
        task_dag = await self.htdag.decompose_task(
            task_description=f"Build {business_type}: {requirements['description']}",
            required_capabilities=requirements.get('capabilities', [])
        )

        # Step 5: Execute through HALO router
        results = []
        for task_node in task_dag.topological_sort():
            # Route to best agent
            agent = await self.halo.route_task(
                task=task_node,
                available_agents=team
            )

            # Execute with safety validation
            result = await self._execute_with_safety(
                agent=agent,
                task=task_node,
                autonomous=autonomous
            )
            results.append(result)

        # Step 6: Store successful patterns in memory
        if self._is_successful(results):
            await self.memory.store(
                key=f"business_{business_type}_{uuid.uuid4()}",
                value={
                    "requirements": requirements,
                    "team": team,
                    "results": results,
                    "success_metrics": self._calculate_success_metrics(results)
                },
                namespace="business"
            )

        return BusinessCreationResult(
            business_id=uuid.uuid4(),
            deployment_url=results[-1].get('deployment_url'),
            team_composition=team,
            task_results=results,
            success=self._is_successful(results)
        )

    async def _generate_business_idea(self, business_type: str) -> Dict[str, Any]:
        """
        Generate business requirements using GPT-4o creativity.

        Uses memory-backed prompts (learn from past successes).
        """
        # Query memory for successful business templates
        templates = await self.memory.search(
            query=f"High-performing {business_type} templates",
            namespace="consensus",
            limit=3
        )

        # Use LLM to generate creative business idea
        from infrastructure.llm_client import get_llm_client
        llm = get_llm_client(provider="openai", model="gpt-4o")

        prompt = f"""
        Generate a unique {business_type} business idea.

        Successful patterns from memory:
        {json.dumps(templates, indent=2)}

        Requirements:
        - Must be monetizable within 7 days
        - Must be buildable by AI agents autonomously
        - Must leverage {business_type} best practices
        - Must differentiate from existing businesses

        Return JSON with:
        {{
            "name": "Business name",
            "description": "2-sentence description",
            "target_audience": "Primary audience",
            "monetization": "Revenue model",
            "mvp_features": ["Feature 1", "Feature 2", ...],
            "tech_stack": ["Technology 1", "Technology 2", ...],
            "success_metrics": {{"metric": "target"}}
        }}
        """

        response = await llm.generate_structured_output(
            system_prompt="You are a creative business strategist specialized in AI-buildable businesses.",
            user_prompt=prompt,
            response_schema={
                "name": "string",
                "description": "string",
                "target_audience": "string",
                "monetization": "string",
                "mvp_features": ["string"],
                "tech_stack": ["string"],
                "success_metrics": {"string": "string"}
            }
        )

        return response

    async def _execute_with_safety(
        self,
        agent: Agent,
        task: TaskNode,
        autonomous: bool
    ) -> Dict[str, Any]:
        """
        Execute task with WaltzRL safety validation.

        If autonomous=False, require human approval for high-risk tasks.
        """
        # Check if task is high-risk
        safety_result = await self.safety.validate_task(
            agent_id=agent.id,
            task_description=task.description,
            task_type=task.type
        )

        if not safety_result.safe:
            if autonomous:
                # Block unsafe tasks in autonomous mode
                return {
                    "status": "blocked",
                    "reason": safety_result.reason,
                    "task": task.description
                }
            else:
                # Request human approval in supervised mode
                approval = await self._request_human_approval(task, safety_result)
                if not approval:
                    return {"status": "rejected", "task": task.description}

        # Execute task
        result = await agent.execute(task)
        return result

    def _is_successful(self, results: List[Dict[str, Any]]) -> bool:
        """
        Determine if business creation was successful.

        Criteria:
        - All critical tasks completed
        - Deployment URL is live
        - No safety violations
        """
        # Check for blockers
        if any(r.get('status') == 'blocked' for r in results):
            return False

        # Check for deployment
        if not any('deployment_url' in r for r in results):
            return False

        # Check for critical failures
        critical_failures = [r for r in results if r.get('critical') and r.get('status') == 'failed']
        if critical_failures:
            return False

        return True
```

**Key Features:**
- Memory-backed business idea generation
- Swarm-optimized team composition
- HTDAG task decomposition
- HALO agent routing
- WaltzRL safety validation
- Autonomous + supervised modes
- Pattern learning from successes

---

#### 2. `infrastructure/genesis_business_types.py` (200 lines)
```python
"""
Business Archetypes for Genesis Meta-Agent

10 validated business types with templates, requirements, and success metrics.
"""

from dataclasses import dataclass
from typing import Dict, List, Any

@dataclass
class BusinessArchetype:
    """Template for a business type."""
    type: str
    name: str
    description: str
    typical_features: List[str]
    tech_stack: List[str]
    required_agents: List[str]  # Agent types needed (builder, deploy, qa, etc.)
    success_metrics: Dict[str, str]
    time_to_deploy: str  # Estimated deployment time
    difficulty: str  # Easy/Medium/Hard

# Define 10 business archetypes
BUSINESS_ARCHETYPES = {
    "saas_tool": BusinessArchetype(
        type="saas_tool",
        name="Simple SaaS Tool",
        description="Focused single-purpose web tool (e.g., text improver, image resizer)",
        typical_features=[
            "User input form",
            "Processing logic (API or local)",
            "Result display",
            "Free + Premium tiers",
            "User accounts (optional)"
        ],
        tech_stack=["Next.js", "TypeScript", "Tailwind CSS", "Vercel", "Stripe"],
        required_agents=["Builder", "QA", "Deploy", "Content (marketing copy)"],
        success_metrics={
            "time_to_first_user": "< 48 hours",
            "conversion_rate": "> 2%",
            "deployment_success": "100%"
        },
        time_to_deploy="< 4 hours",
        difficulty="Easy"
    ),

    "content_website": BusinessArchetype(
        type="content_website",
        name="AI-Generated Content Website",
        description="Blog, news, or educational content site with AI-written articles",
        typical_features=[
            "Article listing page",
            "Individual article pages",
            "AI content generation pipeline",
            "SEO optimization",
            "Newsletter signup",
            "Ad placements (optional)"
        ],
        tech_stack=["Next.js", "MDX", "OpenAI API", "Vercel", "Mailchimp"],
        required_agents=["Builder", "Content (writer)", "SEO", "Deploy"],
        success_metrics={
            "articles_published": "> 10",
            "organic_traffic": "> 100/month",
            "newsletter_signups": "> 20"
        },
        time_to_deploy="< 5 hours",
        difficulty="Easy"
    ),

    "ecommerce_store": BusinessArchetype(
        type="ecommerce_store",
        name="Digital Product E-Commerce",
        description="Store selling digital products (templates, ebooks, courses, etc.)",
        typical_features=[
            "Product catalog",
            "Product detail pages",
            "Shopping cart",
            "Stripe checkout",
            "Digital download delivery",
            "Customer dashboard"
        ],
        tech_stack=["Next.js", "Stripe", "Vercel", "Supabase (storage)"],
        required_agents=["Builder", "Product (create digital goods)", "QA", "Deploy"],
        success_metrics={
            "products_listed": "> 5",
            "first_sale": "< 7 days",
            "checkout_flow": "100% functional"
        },
        time_to_deploy="< 6 hours",
        difficulty="Medium"
    ),

    # ... 7 more archetypes (marketplace, saas_dashboard, landing_page, etc.)
}

def get_business_archetype(business_type: str) -> BusinessArchetype:
    """Get business archetype by type."""
    return BUSINESS_ARCHETYPES.get(business_type)

def get_all_archetypes() -> List[BusinessArchetype]:
    """Get all available business archetypes."""
    return list(BUSINESS_ARCHETYPES.values())
```

**Business Types:**
1. Simple SaaS Tool (Easy)
2. Content Website (Easy)
3. E-Commerce Store (Medium)
4. Landing Page + Waitlist (Easy)
5. SaaS Dashboard (Medium)
6. Marketplace (Hard)
7. AI Chatbot Service (Medium)
8. API-as-a-Service (Medium)
9. Newsletter Automation (Easy)
10. No-Code Tool Builder (Hard)

---

### Task 2: Genesis Testing Framework (4 hours)

**Goal:** Comprehensive testing of Genesis Meta-Agent business creation flow.

**Files to Create:**

#### 1. `tests/genesis/test_meta_agent_business_creation.py` (400 lines)
```python
"""
End-to-end tests for Genesis Meta-Agent business creation.
"""

import pytest
from infrastructure.genesis_meta_agent import GenesisMetaAgent
from infrastructure.genesis_business_types import get_business_archetype

class TestGenesisMetaAgent:
    """Test suite for Genesis Meta-Agent."""

    @pytest.mark.asyncio
    async def test_saas_tool_creation(self):
        """Test creating a simple SaaS tool (Easy difficulty)."""
        genesis = GenesisMetaAgent()

        result = await genesis.create_business(
            business_type="saas_tool",
            autonomous=True
        )

        assert result.success is True
        assert result.deployment_url is not None
        assert len(result.team_composition) >= 4  # Builder, QA, Deploy, Content
        assert "saas" in result.deployment_url.lower()

    @pytest.mark.asyncio
    async def test_content_website_creation(self):
        """Test creating content website (Easy difficulty)."""
        # ... similar test
        pass

    @pytest.mark.asyncio
    async def test_custom_requirements(self):
        """Test business creation with custom requirements."""
        genesis = GenesisMetaAgent()

        custom_requirements = {
            "name": "AI Writing Assistant",
            "description": "Help users improve their writing with AI suggestions",
            "mvp_features": ["Text input", "AI suggestions", "Premium features"],
            "tech_stack": ["Next.js", "OpenAI API", "Stripe"],
            "success_metrics": {"first_user": "< 24h"}
        }

        result = await genesis.create_business(
            business_type="saas_tool",
            requirements=custom_requirements,
            autonomous=True
        )

        assert result.success is True
        assert "writing" in result.deployment_url.lower() or "ai" in result.deployment_url.lower()

    # ... 10+ more tests for each business type
```

**Test Coverage:**
- All 10 business archetypes (1 test per type)
- Custom requirements handling
- Team composition validation
- Safety validation (WaltzRL integration)
- Memory integration (pattern learning)
- Autonomous vs supervised modes
- Failure handling (task failures, deployment failures)

---

#### 2. `tests/genesis/test_meta_agent_edge_cases.py` (200 lines)
```python
"""
Edge case tests for Genesis Meta-Agent.
"""

class TestGenesisMetaAgentEdgeCases:
    """Test edge cases and failure scenarios."""

    @pytest.mark.asyncio
    async def test_agent_unavailable(self):
        """Test handling when required agents are unavailable."""
        pass

    @pytest.mark.asyncio
    async def test_invalid_business_type(self):
        """Test error handling for unsupported business type."""
        pass

    @pytest.mark.asyncio
    async def test_deployment_failure_rollback(self):
        """Test rollback when deployment fails."""
        pass

    @pytest.mark.asyncio
    async def test_safety_violation_blocks_deployment(self):
        """Test WaltzRL blocks unsafe business creation."""
        pass

    # ... 10+ more edge case tests
```

---

## 📊 SUCCESS CRITERIA

### Task 1: Genesis Meta-Agent Core
- ✅ `genesis_meta_agent.py` complete (600 lines)
- ✅ `genesis_business_types.py` complete (10 archetypes defined)
- ✅ Integration with HTDAG, HALO, Swarm, Memory, WaltzRL validated
- ✅ Can generate business idea from business type
- ✅ Can compose optimal team (swarm integration)
- ✅ Can decompose into tasks (HTDAG integration)
- ✅ Can route to agents (HALO integration)
- ✅ Can validate safety (WaltzRL integration)
- ✅ Can learn patterns (memory integration)

### Task 2: Testing Framework
- ✅ 10+ business creation tests (1 per archetype)
- ✅ All tests passing (pytest)
- ✅ Edge case tests cover failure scenarios
- ✅ Test coverage > 85% for genesis_meta_agent.py

---

## 🔗 INTEGRATION POINTS

### Integrate With:
1. **HTDAG Orchestrator** (`infrastructure/orchestration/htdag.py`)
   - Use `decompose_task()` to break business into tasks
2. **HALO Router** (`infrastructure/orchestration/halo_router.py`)
   - Use `route_task()` to select best agent for each task
3. **Swarm Optimizer** (`infrastructure/swarm/inclusive_fitness.py`)
   - Use `optimize_team()` to compose optimal agent team
4. **LangGraph Store** (`infrastructure/memory/langgraph_store.py`)
   - Query for successful business patterns
   - Store new successful patterns
5. **WaltzRL Safety** (`infrastructure/safety/waltzrl_safety.py`)
   - Validate each task before execution
6. **SE-Darwin** (`infrastructure/evolution/se_darwin_agent.py`)
   - Evolve agents based on business outcomes (future enhancement)

---

## 🛠️ DEVELOPMENT WORKFLOW

### Step 1: Research (1 hour)
- Use Context7 MCP to review agent orchestration patterns
- Study LangChain multi-agent coordination
- Review Microsoft Agent Framework supervisor pattern

### Step 2: Core Implementation (4 hours)
- Implement `GenesisMetaAgent` class
- Implement business idea generation
- Implement team composition flow
- Implement task execution with safety
- Implement pattern learning

### Step 3: Business Archetypes (1 hour)
- Define 10 business archetypes
- Create templates with realistic requirements
- Document success metrics per type

### Step 4: Testing (4 hours)
- Write 10+ business creation tests
- Write 10+ edge case tests
- Validate all integration points
- Run full test suite

---

## 📚 RESOURCES

### Use Context7 MCP for:
- Agent orchestration patterns
- LangChain supervisor pattern
- Microsoft Agent Framework documentation
- Multi-agent coordination strategies

### Use Haiku 4.5 for:
- Code generation (GenesisMetaAgent class)
- Test generation
- Business archetype definitions

### Use Sonnet 4 for:
- Complex orchestration logic
- Safety validation integration
- Memory-backed business idea generation

---

## 🚨 CRITICAL NOTES

### From Previous Work:
1. **All infrastructure is ready:**
   - HTDAG: `infrastructure/orchestration/htdag.py`
   - HALO: `infrastructure/orchestration/halo_router.py`
   - Swarm: `infrastructure/swarm/inclusive_fitness.py` (being built by Thon)
   - Memory: `infrastructure/memory/langgraph_store.py`
   - WaltzRL: `infrastructure/safety/waltzrl_safety.py`

2. **API keys available:**
   - OpenAI: For GPT-4o business idea generation
   - Anthropic: For Claude Haiku agent execution
   - MongoDB: For memory storage

### Watch Out For:
- **Autonomous mode safety** - WaltzRL must block unsafe tasks
- **Task dependency resolution** - HTDAG handles this, trust it
- **Memory query performance** - Cache frequent patterns
- **Agent availability** - Graceful degradation if agent offline

---

## 📝 DELIVERABLES CHECKLIST

- [ ] `infrastructure/genesis_meta_agent.py` (600 lines)
- [ ] `infrastructure/genesis_business_types.py` (200 lines, 10 archetypes)
- [ ] `tests/genesis/test_meta_agent_business_creation.py` (400 lines, 10+ tests)
- [ ] `tests/genesis/test_meta_agent_edge_cases.py` (200 lines, 10+ tests)
- [ ] **Tests passing:** 20/20 tests (100%)
- [ ] **Integration validated:** HTDAG + HALO + Swarm + Memory + WaltzRL
- [ ] **Documentation:** Update `docs/GENESIS_META_AGENT_GUIDE.md`

---

## 🎯 NEXT STEPS AFTER COMPLETION

Once this task is complete:
1. **Hand off to:** Thon (Business Execution Engine with Vercel deployment)
2. **Hand off to:** Alex (E2E validation of full business creation)
3. **Validation:** Hudson security audit of autonomous creation system

---

**Created:** November 3, 2025
**Owner:** Cora
**Status:** READY TO START
**Estimated Completion:** 10 hours
**Dependencies:** HTDAG (complete), HALO (complete), Memory (complete), WaltzRL (complete), Swarm (Thon building in parallel)
