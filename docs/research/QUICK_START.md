# Quick Start Guide - Memory + Vision Integration

**Goal:** Deploy unified memory + vision system for 25 Genesis agents in 1 day

---

## Your Architecture (Integrated)

✅ **Session Backbone** - Redis/Spanner + ACLs + TTL + ordering
✅ **Hybrid Memory** - SQL + pgvector + Knowledge Graph  
✅ **Memory-as-a-Tool** - Agent-driven retrieval pattern
✅ **Background Compaction** - Automated summarization with triggers
✅ **Multimodal Pipeline** - Audio/image → Gemini → text + URI storage
✅ **AligNet Vision QA** - Marketing hero image validation with uncertainty

---

## 18-Hour Sprint Breakdown

| Time | Team | Task |
|------|------|------|
| **0-2** | Infrastructure | Session backbone (Redis/Spanner + ACLs) |
| **2-4** | Memory | Hybrid storage (pgvector + KG) + Memory-as-a-Tool |
| **4-6** | Integration | ADK/LangGraph adapters + A2A FastAPI |
| **6-8** | Backend | Compaction service with triggers |
| **8-10** | ML | Multimodal pipeline (Gemini Vision/Audio) |
| **10-12** | Vision | AligNet QA for marketing images |
| **12-14** | All Teams | **Agent Integration (25 agents)** |
| **14-16** | QA | Testing + monitoring + security validation |
| **16-18** | DevOps | Documentation + deployment + monitoring |

---

## Agent Tiers (25 Total)

### Tier 1: CRITICAL - 8 agents (Hour 12-13)
1. HALO Router
2. QA Agent  
3. SE-Darwin
4. AOP Orchestrator
5. Genesis Meta-Agent (+ multimodal)
6. Business Generation (+ multimodal)
7. Deployment
8. Customer Support (+ multimodal)

### Tier 2: HIGH VALUE - 10 agents (Hour 13-14)
9. Data Juicer
10. ReAct Training
11. AgentScope Runtime
12. LLM Judge RL
13. Gemini Computer Use (+ multimodal + vision)
14. **Marketing (+ multimodal + AligNet QA)**
15. Content Creation (+ multimodal)
16. SEO Optimization
17. Email Marketing
18. Analytics (+ multimodal)

### Tier 3: SPECIALIZED - 7 agents (Hour 14)
19. AgentScope Alias
20. Stripe Integration
21. Auth0 Integration
22. Database Design
23. API Design
24. **UI/UX Design (+ multimodal + AligNet QA)**
25. Monitoring

---

## Key Integration Per Agent

```python
# EVERY agent needs:
class AnyAgent:
    def __init__(self):
        self.memory = MemoryTool()  # NEW
        
    def handle_task(self, task):
        # Recall past experiences
        past = self.memory.retrieve_memory(
            query=f"task like {task}",
            scope="app"  # or "user" or "session"
        )
        
        # Use learnings
        result = self._do_task(task, past)
        
        # Store for future
        self.memory.store_memory(
            content={"task": task, "result": result},
            scope="app",
            provenance={"agent_id": "my_agent"}
        )
```

---

## Quick Reference: Memory Scopes

| Scope | Use Case | Example |
|-------|----------|---------|
| **user** | Per-user data | Customer preferences, conversation history |
| **session** | Current conversation | Active task context, temporary state |
| **app** | Global knowledge | Routing patterns, bug solutions, templates |

---

## Quick Reference: Tools to Implement

### Session Backbone
```python
class ManagedSessionService:
    def append(session_id, message, user_id) # ACL + TTL + ordering
```

### Memory-as-a-Tool
```python
@tool_spec
def retrieve_memory(query: str, scope: str, filters: Dict) -> List[Memory]

@tool_spec  
def store_memory(content: Dict, scope: str, provenance: Dict) -> str
```

### Multimodal Pipeline
```python
class MultimodalMemoryPipeline:
    def ingest_image(image_uri, user_id, scope)  # Gemini Vision → text
    def ingest_audio(audio_uri, user_id, scope)  # Gemini Audio → text
```

### AligNet Vision QA
```python
class AligNetMarketingQA:
    def audit_hero_image(image_path) -> {
        approved, similarity, uncertainty, escalated
    }
```

---

## Success Metrics (End of Day)

✅ 25/25 agents integrated  
✅ < 50ms session append latency  
✅ < 100ms memory search latency  
✅ 0 ACL violations  
✅ Compaction jobs running  
✅ Multimodal working (1 audio + 1 image)  
✅ AligNet QA tested (10 images)  
✅ 100% tests passing

---

## Expected Impact (Month 1)

📈 30% reduction in redundant work  
📈 20% reduction in API costs  
📈 Automated marketing image QA  
📈 Persistent user conversations  
📈 Agents learning from experience

---

## ROI

**Investment:** $20k (108 engineer-hours + infrastructure)  
**Monthly Return:** $6,500-14,000 (savings)  
**Payback:** 2-3 months  
**1-Year ROI:** 290-740%

---

## Documents

1. **EXECUTIVE_SUMMARY.md** - High-level overview (read this first)
2. **INTEGRATED_RESEARCH_PLAN.md** - Full technical plan  
3. **AGENT_MAPPING.md** - Agent-by-agent integration tasks
4. **QUICK_START.md** - This document (quick reference)

---

## Go/No-Go Decision

✅ **GO if:**
- 6 teams available (9-15 engineers)
- Redis/Spanner can be provisioned today
- 18-hour coordinated sprint feasible
- Feature flags ready for gradual rollout

❌ **NO-GO if:**
- Teams unavailable
- Infrastructure blocked
- Need more testing/planning time

**Recommendation:** ✅ **GO** - High ROI, clear plan, manageable risk
