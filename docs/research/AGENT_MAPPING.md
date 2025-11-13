# Agent Task Mapping - Memory + Vision Integration

**Date:** November 13, 2025
**Agent Count:** 25 Genesis agents
**Implementation:** 1-day coordinated deployment
**Priority:** Session Backbone → Memory → Vision

---

## Agent Classification

### Tier 1: CRITICAL (Session Backbone Required) - 8 Agents
**Priority:** Implement FIRST (Hour 12-13)
**Reason:** High user interaction, session continuity critical

### Tier 2: HIGH VALUE (Memory + Multimodal) - 10 Agents
**Priority:** Implement SECOND (Hour 13-14)
**Reason:** Benefit significantly from memory, some need multimodal

### Tier 3: SPECIALIZED (Vision + Memory) - 7 Agents
**Priority:** Implement THIRD (Hour 14)
**Reason:** Specialized workflows, benefit from specific features

---

## TIER 1: CRITICAL AGENTS (Session Backbone Required)

### 1. HALO Router Agent
**Role:** Multi-agent task routing and coordination
**Memory Needs:** HIGH
**Vision Needs:** LOW
**Multimodal:** NO

**Integration Tasks:**
- ✅ Wrap with ADKSessionAdapter
- ✅ Store routing decisions in Memori (scope: app)
- ✅ Query: "past routing for similar tasks"
- ✅ Learn from successful/failed routing patterns

**Implementation:**
```python
class HALORouter:
    def __init__(self):
        self.memory = MemoryTool()
        self.sessions = ManagedSessionService()

    def route_task(self, task: Task, session_id: str, user_id: str):
        # Recall similar past routing decisions
        past_routings = self.memory.retrieve_memory(
            query=f"routing for {task.description}",
            scope="app",
            filters={"task_type": task.type}
        )

        # Use successful patterns
        if past_routings:
            successful = [r for r in past_routings if r.content.get("success")]
            if successful:
                return successful[0].content["agent_id"]

        # Route and store decision
        agent_id = self._route_logic(task)
        self.memory.store_memory(
            content={
                "task": task.description,
                "agent_id": agent_id,
                "success": None  # Will be updated later
            },
            scope="app",
            provenance={"agent_id": "halo", "freshness": "current"}
        )

        return agent_id
```

---

### 2. QA Agent
**Role:** Debug and quality assurance for other agents
**Memory Needs:** CRITICAL
**Vision Needs:** MEDIUM (for UI testing)
**Multimodal:** NO

**Integration Tasks:**
- ✅ Wrap with LangGraphSessionAdapter
- ✅ Store bug patterns + solutions in Memori (scope: app)
- ✅ Query: "similar bugs by error message"
- ✅ Knowledge graph: bug → solution → agent relationships

**Implementation:**
```python
class QAAgent:
    def __init__(self):
        self.memory = MemoryTool()

    def debug_agent(self, agent_id: str, error: str):
        # Recall similar bugs from KG
        similar_bugs = self.memory.retrieve_memory(
            query=f"error: {error}",
            scope="app",
            filters={"agent_id": agent_id}
        )

        # Try proven solutions first
        for bug in similar_bugs:
            if bug.content.get("resolved"):
                solution = bug.content["solution"]
                # Try applying solution
                pass

        # Store new bug + solution
        self.memory.store_memory(
            content={
                "agent_id": agent_id,
                "error": error,
                "solution": solution,
                "resolved": True
            },
            scope="app",
            provenance={"agent_id": "qa"}
        )
```

---

### 3. SE-Darwin Agent
**Role:** Self-evolution and agent optimization
**Memory Needs:** CRITICAL
**Vision Needs:** LOW
**Multimodal:** NO

**Integration Tasks:**
- ✅ Store evolution history in Memori (scope: app)
- ✅ Query: "successful mutations for agent X"
- ✅ Knowledge graph: agent → mutation → fitness improvement
- ✅ Session-based evolution tracking

**Implementation:**
```python
class SEDarwinAgent:
    def __init__(self):
        self.memory = MemoryTool()

    def evolve_agent(self, agent_id: str):
        # Recall past evolution attempts
        past_evolutions = self.memory.retrieve_memory(
            query=f"evolution of {agent_id}",
            scope="app",
            filters={"agent_id": agent_id, "fitness_improvement": ">0"}
        )

        # Extract successful mutation patterns
        successful_mutations = [
            e.content["mutation"] for e in past_evolutions
            if e.content["fitness_improvement"] > 0.1
        ]

        # Apply similar mutations
        # Store new evolution attempt
        self.memory.store_memory(
            content={
                "agent_id": agent_id,
                "mutation": mutation,
                "fitness_before": fitness_before,
                "fitness_after": fitness_after,
                "fitness_improvement": fitness_after - fitness_before
            },
            scope="app",
            provenance={"agent_id": "se_darwin"}
        )
```

---

### 4. AOP Orchestrator Agent
**Role:** Agent Orchestration Principles coordination
**Memory Needs:** HIGH
**Vision Needs:** LOW
**Multimodal:** NO

**Integration Tasks:**
- ✅ Store workflow patterns in Memori (scope: app)
- ✅ Query: "successful workflows for task type X"
- ✅ Session tracking for multi-step orchestration
- ✅ Compaction trigger on workflow completion

**Implementation:**
```python
class AOPOrchestrator:
    def __init__(self):
        self.memory = MemoryTool()
        self.compaction = CompactionService()

    def orchestrate_workflow(self, task: Task, session_id: str):
        # Recall successful workflow patterns
        past_workflows = self.memory.retrieve_memory(
            query=f"workflow for {task.type}",
            scope="app"
        )

        # Execute workflow steps
        # ...

        # Store workflow result
        self.memory.store_memory(
            content={
                "task_type": task.type,
                "workflow_steps": steps,
                "success": success,
                "duration": duration
            },
            scope="app"
        )

        # Trigger compaction on completion
        self.compaction.compact_session(session_id)
```

---

### 5. Genesis Meta-Agent (Conversation)
**Role:** Primary user interaction and task delegation
**Memory Needs:** CRITICAL
**Vision Needs:** LOW
**Multimodal:** YES (user uploads)

**Integration Tasks:**
- ✅ Wrap with ADKSessionAdapter
- ✅ Store user conversations in Memori (scope: user)
- ✅ Multimodal pipeline for user uploads
- ✅ Per-user ACL enforcement
- ✅ Session persistence across restarts

**Implementation:**
```python
class GenesisMetaAgent:
    def __init__(self):
        self.memory = MemoryTool()
        self.multimodal = MultimodalMemoryPipeline()
        self.sessions = ManagedSessionService()

    def handle_user_message(
        self,
        message: str,
        session_id: str,
        user_id: str,
        attachments: List[str] = None
    ):
        # ACL check
        self.sessions.acl.check_access(session_id, user_id)

        # Process multimodal attachments
        if attachments:
            for uri in attachments:
                if uri.endswith(('.jpg', '.png')):
                    self.multimodal.ingest_image(uri, user_id, scope="user")
                elif uri.endswith(('.mp3', '.wav')):
                    self.multimodal.ingest_audio(uri, user_id, scope="user")

        # Retrieve user conversation history
        history = self.memory.retrieve_memory(
            query="recent conversations",
            scope="user",
            filters={"user_id": user_id}
        )

        # Process message with history context
        response = self._process(message, history)

        # Store in session
        self.sessions.append(session_id, {
            "role": "user",
            "content": message
        }, user_id)
        self.sessions.append(session_id, {
            "role": "assistant",
            "content": response
        }, user_id)

        return response
```

---

### 6. Business Generation Agent
**Role:** Autonomous business creation
**Memory Needs:** HIGH
**Vision Needs:** MEDIUM (for design assets)
**Multimodal:** YES (logos, images)

**Integration Tasks:**
- ✅ Store business templates in Memori (scope: app)
- ✅ Query: "successful businesses in niche X"
- ✅ Multimodal for logo/image generation
- ✅ Session tracking for multi-step business creation

**Implementation:**
```python
class BusinessGenerationAgent:
    def __init__(self):
        self.memory = MemoryTool()
        self.multimodal = MultimodalMemoryPipeline()

    def generate_business(self, niche: str, session_id: str):
        # Recall successful business templates
        templates = self.memory.retrieve_memory(
            query=f"successful business template {niche}",
            scope="app"
        )

        # Generate business
        # ...

        # Store generated assets (logo, images)
        if logo_uri:
            self.multimodal.ingest_image(logo_uri, user_id="system", scope="app")

        # Store business template for future use
        self.memory.store_memory(
            content={
                "niche": niche,
                "template": template,
                "success_metrics": metrics
            },
            scope="app"
        )
```

---

### 7. Deployment Agent
**Role:** Deploy businesses to production
**Memory Needs:** MEDIUM
**Vision Needs:** LOW
**Multimodal:** NO

**Integration Tasks:**
- ✅ Store deployment patterns in Memori (scope: app)
- ✅ Query: "deployment config for platform X"
- ✅ Knowledge graph: business → deployment → platform

**Implementation:**
```python
class DeploymentAgent:
    def __init__(self):
        self.memory = MemoryTool()

    def deploy_business(self, business_id: str, platform: str):
        # Recall deployment patterns
        patterns = self.memory.retrieve_memory(
            query=f"deployment to {platform}",
            scope="app",
            filters={"platform": platform, "success": True}
        )

        # Use proven deployment config
        if patterns:
            config = patterns[0].content["config"]
        else:
            config = self._generate_config(platform)

        # Deploy and store result
        success = self._deploy(business_id, platform, config)
        self.memory.store_memory(
            content={
                "business_id": business_id,
                "platform": platform,
                "config": config,
                "success": success
            },
            scope="app"
        )
```

---

### 8. Customer Support Bot Agent
**Role:** Handle customer inquiries for businesses
**Memory Needs:** CRITICAL
**Vision Needs:** LOW
**Multimodal:** YES (customer uploads)

**Integration Tasks:**
- ✅ Wrap with LangGraphSessionAdapter
- ✅ Store customer interactions in Memori (scope: user)
- ✅ Per-customer ACL enforcement
- ✅ Multimodal for customer attachments
- ✅ Session continuity across conversations

**Implementation:**
```python
class CustomerSupportBotAgent:
    def __init__(self):
        self.memory = MemoryTool()
        self.multimodal = MultimodalMemoryPipeline()
        self.sessions = ManagedSessionService()

    def handle_customer(self, message: str, customer_id: str, session_id: str):
        # Retrieve customer history
        history = self.memory.retrieve_memory(
            query="customer interactions",
            scope="user",
            filters={"user_id": customer_id}
        )

        # Personalized response based on history
        response = self._generate_response(message, history)

        # Store interaction
        self.sessions.append(session_id, {
            "role": "customer",
            "content": message
        }, customer_id)
```

---

## TIER 2: HIGH VALUE AGENTS (Memory + Multimodal)

### 9. Data Juicer Agent
**Role:** Trajectory data curation
**Memory Needs:** HIGH
**Vision Needs:** LOW
**Multimodal:** NO

**Integration Tasks:**
- ✅ Store curation patterns in Memori (scope: app)
- ✅ Query: "quality filters for task type X"
- ✅ Learn optimal curation strategies over time

---

### 10. ReAct Training Agent
**Role:** Reinforcement learning for reasoning agents
**Memory Needs:** HIGH
**Vision Needs:** LOW
**Multimodal:** NO

**Integration Tasks:**
- ✅ Store training trajectories in Memori (scope: app)
- ✅ Query: "successful training examples for task X"
- ✅ Knowledge graph: training_run → hyperparameters → performance

---

### 11. AgentScope Runtime Agent
**Role:** Sandboxed agent execution
**Memory Needs:** MEDIUM
**Vision Needs:** MEDIUM (GUI sandbox)
**Multimodal:** NO

**Integration Tasks:**
- ✅ Store sandbox configs in Memori (scope: app)
- ✅ Query: "safe sandbox settings for agent X"
- ✅ Session tracking for multi-step sandbox execution

---

### 12. LLM Judge RL Agent
**Role:** Reward model for agent evaluation
**Memory Needs:** HIGH
**Vision Needs:** LOW
**Multimodal:** NO

**Integration Tasks:**
- ✅ Store judgment patterns in Memori (scope: app)
- ✅ Query: "evaluation criteria for task type X"
- ✅ Learn from human feedback over time

---

### 13. Gemini Computer Use Agent
**Role:** Browser automation and UI interaction
**Memory Needs:** MEDIUM
**Vision Needs:** HIGH (screenshots)
**Multimodal:** YES (screenshots)

**Integration Tasks:**
- ✅ Store UI interaction patterns in Memori (scope: app)
- ✅ Multimodal pipeline for screenshots
- ✅ Query: "successful UI automation for site X"
- ✅ Vision enhancement for better screenshot understanding

**CRITICAL: AligNet Integration**
```python
class GeminiComputerUseAgent:
    def __init__(self):
        self.memory = MemoryTool()
        self.multimodal = MultimodalMemoryPipeline()
        self.alignet = None  # Optional: Add if needed

    def interact_with_ui(self, screenshot_path: str, action: str):
        # Ingest screenshot
        self.multimodal.ingest_image(screenshot_path, user_id="system", scope="app")

        # Recall similar UI interactions
        similar = self.memory.retrieve_memory(
            query=f"UI interaction: {action}",
            scope="app"
        )

        # Perform action
        # Store result
```

---

### 14. Marketing Agent
**Role:** Create marketing materials
**Memory Needs:** MEDIUM
**Vision Needs:** HIGH (hero images, ads)
**Multimodal:** YES (image generation)

**Integration Tasks:**
- ✅ Store marketing templates in Memori (scope: app)
- ✅ Multimodal pipeline for generated images
- ✅ **AligNet QA for hero image validation**
- ✅ Query: "successful marketing copy for niche X"

**CRITICAL: AligNet Integration**
```python
class MarketingAgent:
    def __init__(self):
        self.memory = MemoryTool()
        self.alignet_qa = AligNetMarketingQA()

    def create_hero_image(self, brand: str, message: str):
        # Generate image
        image_path = self._generate_image(brand, message)

        # AligNet QA validation
        audit_result = self.alignet_qa.audit_hero_image(image_path)

        if audit_result["escalated"]:
            # High uncertainty - manual review
            return self._request_human_approval(image_path, audit_result)

        if audit_result["approved"]:
            # Store approved image as template
            self.memory.store_memory(
                content={
                    "brand": brand,
                    "image_uri": image_path,
                    "similarity_score": audit_result["similarity"],
                    "approved": True
                },
                scope="app"
            )

        return image_path, audit_result
```

---

### 15. Content Creation Agent
**Role:** Blog posts, articles, social media
**Memory Needs:** HIGH
**Vision Needs:** MEDIUM (featured images)
**Multimodal:** YES (images)

**Integration Tasks:**
- ✅ Store content templates in Memori (scope: app)
- ✅ Multimodal pipeline for featured images
- ✅ Query: "successful content for topic X"
- ✅ Learn from engagement metrics over time

---

### 16. SEO Optimization Agent
**Role:** Search engine optimization
**Memory Needs:** HIGH
**Vision Needs:** LOW
**Multimodal:** NO

**Integration Tasks:**
- ✅ Store SEO strategies in Memori (scope: app)
- ✅ Query: "successful keywords for niche X"
- ✅ Knowledge graph: keyword → ranking → traffic

---

### 17. Email Marketing Agent
**Role:** Email campaigns and newsletters
**Memory Needs:** HIGH
**Vision Needs:** LOW
**Multimodal:** NO

**Integration Tasks:**
- ✅ Store email templates in Memori (scope: app)
- ✅ Per-customer ACL for personalization
- ✅ Query: "successful email campaigns for segment X"

---

### 18. Analytics Agent
**Role:** Business metrics and insights
**Memory Needs:** MEDIUM
**Vision Needs:** MEDIUM (charts/graphs)
**Multimodal:** YES (visualizations)

**Integration Tasks:**
- ✅ Store analytics reports in Memori (scope: app)
- ✅ Multimodal pipeline for chart images
- ✅ Query: "key metrics for business type X"

---

## TIER 3: SPECIALIZED AGENTS (Vision + Memory)

### 19. AgentScope Alias Agent
**Role:** Agent identity and role mapping
**Memory Needs:** MEDIUM
**Vision Needs:** LOW
**Multimodal:** NO

**Integration Tasks:**
- ✅ Store agent mappings in Memori (scope: app)
- ✅ Query: "agent capabilities for task X"

---

### 20. Stripe Integration Agent
**Role:** Payment processing
**Memory Needs:** MEDIUM
**Vision Needs:** LOW
**Multimodal:** NO

**Integration Tasks:**
- ✅ Store payment patterns in Memori (scope: app)
- ✅ Per-customer ACL for payment history
- ✅ Query: "successful payment flows for product X"

---

### 21. Auth0 Integration Agent
**Role:** Authentication and authorization
**Memory Needs:** MEDIUM
**Vision Needs:** LOW
**Multimodal:** NO

**Integration Tasks:**
- ✅ Store auth patterns in Memori (scope: app)
- ✅ Per-user ACL enforcement
- ✅ Query: "auth config for integration X"

---

### 22. Database Design Agent
**Role:** Schema design and optimization
**Memory Needs:** HIGH
**Vision Needs:** LOW
**Multimodal:** NO

**Integration Tasks:**
- ✅ Store schema patterns in Memori (scope: app)
- ✅ Query: "optimal schema for data model X"
- ✅ Knowledge graph: schema → query_patterns → performance

---

### 23. API Design Agent
**Role:** RESTful API design
**Memory Needs:** HIGH
**Vision Needs:** LOW
**Multimodal:** NO

**Integration Tasks:**
- ✅ Store API patterns in Memori (scope: app)
- ✅ Query: "API design for use case X"
- ✅ Learn from API usage metrics

---

### 24. UI/UX Design Agent
**Role:** User interface design
**Memory Needs:** MEDIUM
**Vision Needs:** HIGH (mockups, screenshots)
**Multimodal:** YES (design assets)

**Integration Tasks:**
- ✅ Store UI patterns in Memori (scope: app)
- ✅ Multimodal pipeline for mockups
- ✅ **AligNet for design QA (odd-one-out validation)**
- ✅ Query: "successful UI patterns for flow X"

**AligNet Integration:**
```python
class UIUXDesignAgent:
    def __init__(self):
        self.memory = MemoryTool()
        self.alignet = AligNetMarketingQA()  # Reuse for UI QA

    def validate_design(self, mockup_path: str):
        # AligNet validation against brand guidelines
        audit_result = self.alignet.audit_hero_image(mockup_path)

        if audit_result["escalated"]:
            # High uncertainty - designer review
            pass

        return audit_result
```

---

### 25. Monitoring & Observability Agent
**Role:** System health and metrics
**Memory Needs:** MEDIUM
**Vision Needs:** LOW
**Multimodal:** NO

**Integration Tasks:**
- ✅ Store alert patterns in Memori (scope: app)
- ✅ Query: "similar incidents and resolutions"
- ✅ Knowledge graph: alert → root_cause → resolution

---

## Implementation Priority Matrix

| Agent Tier | Count | Session | Memory | Multimodal | Vision | Time |
|------------|-------|---------|--------|------------|--------|------|
| **Tier 1 (Critical)** | 8 | ✅ Required | ✅ Critical | 3 agents | 2 agents | Hour 12-13 |
| **Tier 2 (High Value)** | 10 | ✅ Required | ✅ High | 5 agents | 4 agents | Hour 13-14 |
| **Tier 3 (Specialized)** | 7 | ⚠️ Optional | ✅ Medium | 1 agent | 2 agents | Hour 14 |

---

## Integration Checklist (Per Agent)

### For ALL 25 Agents:
- [ ] Add `self.memory = MemoryTool()` to `__init__`
- [ ] Identify key decisions/learnings to store
- [ ] Add `memory.store_memory()` calls after decisions
- [ ] Add `memory.retrieve_memory()` calls before decisions
- [ ] Define memory scope (user/session/app)
- [ ] Add provenance metadata (agent_id, timestamp)

### For Session-Critical Agents (Tier 1):
- [ ] Wrap with ADKSessionAdapter OR LangGraphSessionAdapter
- [ ] Add session_id and user_id parameters
- [ ] Implement ACL checks
- [ ] Test session persistence across restarts

### For Multimodal Agents (13 total):
- [ ] Add `self.multimodal = MultimodalMemoryPipeline()` to `__init__`
- [ ] Call `multimodal.ingest_image()` for images
- [ ] Call `multimodal.ingest_audio()` for audio
- [ ] Store source URIs in memory

### For Vision Agents (8 total):
- [ ] Add vision model (AligNet or base SigLIP)
- [ ] Implement uncertainty-based escalation
- [ ] Integrate with QA agent for manual review
- [ ] Store visual features in memory

---

## Memory Scope Guidelines

| Scope | Usage | Agents | Example |
|-------|-------|--------|---------|
| **user** | Per-user data | Genesis Meta, Customer Support, Email Marketing | Customer conversation history, preferences |
| **session** | Current conversation | All Tier 1 agents | Active task context, temporary state |
| **app** | Global knowledge | HALO, SE-Darwin, QA, all specialized agents | Routing patterns, bug solutions, templates |

---

## Knowledge Graph Schema

```cypher
// Entities
(Agent)-[:HANDLES]->(Task)
(Task)-[:ROUTED_BY]->(Agent)
(Bug)-[:SOLVED_BY]->(Solution)
(Solution)-[:APPLIED_TO]->(Agent)
(Business)-[:DEPLOYED_TO]->(Platform)
(User)-[:HAS]->(Session)
(Session)-[:CONTAINS]->(Memory)
(Memory)-[:SCOPED_TO]->(User|Session|App)

// Queries
// Example 1: Find successful routing patterns
MATCH (a:Agent)-[:HANDLES]->(t:Task {type: "marketing"})
WHERE t.success = true
RETURN a, count(t) as success_count
ORDER BY success_count DESC

// Example 2: Find similar bugs
MATCH (b1:Bug {error_message: $error})-[:SIMILAR_TO]->(b2:Bug)
      -[:SOLVED_BY]->(s:Solution)
RETURN s
ORDER BY b2.resolved_count DESC

// Example 3: Find user's past trips
MATCH (u:User {id: $user_id})-[:HAS]->(s:Session)
      -[:CONTAINS]->(m:Memory)-[:MENTIONS]->(c:City {name: $city})
RETURN m
ORDER BY m.timestamp DESC
```

---

## Testing Plan (Hour 14-16)

### Integration Tests (Per Agent)
```python
def test_agent_memory_integration(agent_name: str):
    """Test agent uses MemoryTool correctly."""
    agent = get_agent(agent_name)

    # Test store
    agent.handle_task(test_task)
    memories = agent.memory.retrieve_memory(
        query="test task",
        scope="app"
    )
    assert len(memories) > 0

    # Test retrieve
    result = agent.handle_task(similar_task)
    assert "used past experience" in result.metadata

def test_session_persistence(agent_name: str):
    """Test session survives restart."""
    agent = get_agent(agent_name)
    session_id = "test_session"

    # Add messages
    agent.handle("message 1", session_id, user_id)

    # Simulate restart
    del agent
    agent = get_agent(agent_name)

    # Check history preserved
    history = agent.sessions.get_history(session_id, user_id)
    assert len(history) > 0
```

---

## Monitoring Dashboards

### Memory System Dashboard
```yaml
panels:
  - title: "Memory Operations/sec"
    query: rate(memory_operations_total[5m])

  - title: "Memory Latency (p95)"
    query: histogram_quantile(0.95, memory_latency_seconds)

  - title: "Storage Usage by Scope"
    query: sum(memory_storage_bytes) by (scope)

  - title: "ACL Violations"
    query: increase(memory_acl_violations_total[1h])
```

### Session Backbone Dashboard
```yaml
panels:
  - title: "Active Sessions"
    query: session_active_count

  - title: "Session Append Latency"
    query: histogram_quantile(0.95, session_append_latency_seconds)

  - title: "Compaction Jobs/hour"
    query: rate(session_compactions_total[1h])
```

---

## Success Criteria (End of Day 1)

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| **Agents Integrated** | 25/25 | ___ | ⏳ |
| **Memory Stores** | 100+ | ___ | ⏳ |
| **Memory Retrieves** | 500+ | ___ | ⏳ |
| **Session Appends** | 1000+ | ___ | ⏳ |
| **Multimodal Ingests** | 10+ | ___ | ⏳ |
| **AligNet QA Tests** | 10+ | ___ | ⏳ |
| **ACL Violations** | 0 | ___ | ⏳ |
| **Compaction Jobs** | Running | ___ | ⏳ |
| **All Tests Passing** | 100% | ___ | ⏳ |

---

**Status:** 📋 Agent mapping complete, ready for 1-day deployment
**Next Step:** Begin Hour 12 - Agent integration sprint
**Coordination:** Hourly standups, real-time Slack updates
**Rollback Plan:** Feature flags per agent, old system parallel
