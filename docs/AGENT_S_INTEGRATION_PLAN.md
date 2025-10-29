# Agent-S Integration Plan

**Date:** October 27, 2025
**Status:** Planning Phase
**Owner:** Research Agent
**Approved by:** Pending Hudson/Cora review

---

## Executive Summary

This document outlines the integration plan for **Agent-S** (state-of-the-art GUI agent framework) into Genesis infrastructure. Agent-S achieves 83.6% success rate on OSWorld and 70.5% on WindowsAgentArena, representing a significant improvement over baseline Gemini Computer Use (~50-60% success rate).

**Key Benefits:**
- 83.6% OSWorld success rate (SOTA GUI agent performance)
- Experience-augmented hierarchical planning
- Multi-modal GUI parsing (set-of-marks + accessibility tree + screenshot)
- Self-reflection mechanism for error recovery
- Production-ready framework with active maintenance

---

## 1. Current State Analysis

### Existing Implementation

Genesis currently has a **mock implementation** of Gemini Computer Use in `agents/deploy_agent.py`:

```python
class GeminiComputerUseClient:
    """
    Simplified client for Gemini Computer Use API

    In production, this would use the official Gemini Computer Use SDK.
    For now, this is a mock implementation that demonstrates the pattern.
    """
```

**Current Capabilities:**
- Mock browser automation (navigate, screenshot, wait)
- Simulated autonomous task execution
- Action history tracking
- Used by: Deploy Agent (Vercel/Netlify deployments)

**Limitations:**
- No real GUI automation capabilities
- ~50-60% estimated success rate with real Gemini Computer Use
- No experience learning from past tasks
- No hierarchical planning
- No self-reflection/error recovery

---

## 2. Agent-S Architecture Overview

### Core Components (from Context7 research)

1. **Experience-Augmented Hierarchical Planning**
   - Breaks complex tasks into manageable subtasks
   - Learns from past successful/failed executions
   - Stores procedural memory for task patterns

2. **Multi-Modal GUI Parsing**
   - **Set-of-Marks (SoM):** Visual element identification
   - **Accessibility Tree:** Structured UI hierarchy
   - **Screenshot:** Visual context understanding
   - Combines all three for robust element detection

3. **Action Execution Layer**
   - PyAutoGUI-based action execution
   - Click, type, scroll, screenshot primitives
   - Platform-agnostic (Linux/macOS/Windows)

4. **Self-Reflection Mechanism**
   - Evaluates action outcomes
   - Detects failures early
   - Adapts strategy based on feedback

### Agent-S S1 vs S2

**S1 (GraphSearchAgent):** Currently installed
- Single-agent architecture
- Graph search-based planning
- 83.6% OSWorld success rate

**S2 (AgentS2):** Compositional generalist-specialist framework
- Multi-agent composition
- Specialist agents for specific tasks
- Not yet available in pip (arXiv:2504.00906)

**Recommendation:** Start with S1 (available now), migrate to S2 when released.

---

## 3. Integration Strategy

### Option A: Full Replacement (NOT RECOMMENDED)

**Approach:** Replace `GeminiComputerUseClient` entirely with Agent-S

**Pros:**
- Cleaner architecture
- 83.6% success rate immediately
- No dual maintenance burden

**Cons:**
- Breaking change for existing code
- Requires rewriting all integrations
- Loses Gemini-specific optimizations
- High risk for production

**Decision:** ❌ Rejected due to breaking changes

---

### Option B: Hybrid Backend (RECOMMENDED)

**Approach:** Add Agent-S as alternative backend with feature flag

**Architecture:**
```python
class ComputerUseClient:
    """Unified GUI automation client with pluggable backends"""

    def __init__(self, backend: str = "gemini"):
        if backend == "gemini":
            self.backend = GeminiComputerUse()
        elif backend == "agent_s":
            self.backend = AgentSBackend()
        else:
            raise ValueError(f"Unknown backend: {backend}")
```

**Pros:**
- Backward compatibility
- A/B testing capability
- Gradual rollout
- Fallback to Gemini if Agent-S fails
- Easy benchmarking

**Cons:**
- More code to maintain
- Two implementations to test

**Decision:** ✅ Selected (best balance of risk/reward)

---

## 4. Implementation Plan

### Phase 1: Core Infrastructure (Week 1, Days 1-2)

**Deliverables:**
1. Create `infrastructure/agent_s_backend.py` (~400 lines)
   - AgentSBackend class wrapping GraphSearchAgent
   - Methods: execute_task, click, type_text, screenshot
   - Error handling and logging integration

2. Modify `infrastructure/computer_use_client.py` (new file, ~200 lines)
   - Unified ComputerUseClient with backend selection
   - Feature flag: `COMPUTER_USE_BACKEND` (default: "gemini")
   - Backward compatibility wrapper

3. Environment configuration
   - Add `COMPUTER_USE_BACKEND=agent_s` to .env.example
   - Document API key requirements (OpenAI, Anthropic, etc.)

**Success Criteria:**
- Agent-S backend instantiates successfully
- Basic click/type/screenshot operations work
- No regressions in existing Gemini code

---

### Phase 2: Integration Testing (Week 1, Days 3-4)

**Deliverables:**
1. Create `tests/test_agent_s_backend.py` (~300 lines)
   - Unit tests for AgentSBackend methods
   - Mock PyAutoGUI operations
   - Error handling validation

2. Create `tests/test_agent_s_comparison.py` (~200 lines)
   - Benchmark comparison: Agent-S vs Gemini
   - Test scenarios: browser navigation, form filling, deployment
   - Success rate measurement

3. Integration with Deploy Agent
   - Modify `agents/deploy_agent.py` to use ComputerUseClient
   - Add backend selection via environment variable
   - Test Vercel/Netlify deployment workflows

**Success Criteria:**
- All unit tests pass (100% coverage)
- Agent-S outperforms Gemini on benchmark tasks
- Deploy Agent works with both backends

---

### Phase 3: Production Rollout (Week 2, Days 1-3)

**Rollout Strategy:**
```
Day 1: 10% traffic (Agent-S), 90% (Gemini) - Monitor errors
Day 2: 50% traffic (Agent-S), 50% (Gemini) - Compare metrics
Day 3: 100% traffic (Agent-S) - Full cutover
```

**Monitoring:**
- Success rate by backend (target: Agent-S ≥ 80%)
- Error rate (target: Agent-S < Gemini)
- Latency (target: Agent-S < 2x Gemini)
- Cost per task (track API usage)

**Rollback Plan:**
- If success rate drops below 70%, revert to 100% Gemini
- If errors spike >10%, revert immediately
- Feature flag allows instant rollback: `COMPUTER_USE_BACKEND=gemini`

**Success Criteria:**
- Agent-S success rate ≥ 80% in production
- Zero P0 incidents
- Cost per task < 2x Gemini baseline

---

### Phase 4: Optimization (Week 2, Days 4-7)

**Optimizations:**
1. **Experience Learning**
   - Integrate Agent-S knowledge base (procedural memory)
   - Store successful deployment patterns
   - Reuse patterns for similar tasks

2. **Hierarchical Planning**
   - Enable multi-level task decomposition
   - Optimize subtask routing
   - Reduce redundant actions

3. **Cost Optimization**
   - Use cheaper models for grounding (Haiku vs Sonnet)
   - Cache knowledge base in Redis
   - Batch similar operations

4. **Multi-Agent Expansion**
   - Extend to QA Agent (automated testing)
   - Extend to Support Agent (customer portal navigation)
   - Extend to Marketing Agent (social media automation)

**Success Criteria:**
- 20-30% cost reduction via experience learning
- 15-25% latency reduction via hierarchical planning
- 3+ agents using Agent-S backend

---

## 5. Technical Architecture

### File Structure
```
genesis-rebuild/
├── infrastructure/
│   ├── agent_s_backend.py          # NEW: Agent-S wrapper (~400 lines)
│   ├── computer_use_client.py      # NEW: Unified client (~200 lines)
│   └── ocr/                         # Existing OCR integration
├── agents/
│   ├── deploy_agent.py              # MODIFIED: Use ComputerUseClient
│   ├── qa_agent.py                  # FUTURE: Add Agent-S support
│   └── support_agent.py             # FUTURE: Add Agent-S support
├── tests/
│   ├── test_agent_s_backend.py     # NEW: Backend unit tests
│   └── test_agent_s_comparison.py  # NEW: Benchmark comparison
├── docs/
│   ├── AGENT_S_INTEGRATION_PLAN.md # THIS FILE
│   └── AGENT_S_INTEGRATION_COMPLETE.md  # FUTURE: Completion report
└── .env.example
    └── COMPUTER_USE_BACKEND=gemini  # NEW: Feature flag
```

### Dependencies
```python
# Already installed
gui-agents==0.1.3
pyautogui==0.9.54
opencv-contrib-python==4.10.0.84

# Required API keys (add to .env)
OPENAI_API_KEY=<your_key>          # For GPT-4o
ANTHROPIC_API_KEY=<your_key>       # For Claude (optional)
COMPUTER_USE_BACKEND=gemini        # Default: gemini, Options: agent_s
```

---

## 6. Integration with Existing Systems

### Layer 1: Orchestration (HTDAG + HALO)

**Integration Point:** HALO router task decomposition

Agent-S hierarchical planning complements HTDAG:
- HTDAG: High-level task decomposition (business logic)
- Agent-S: Low-level GUI task decomposition (browser automation)

**Recommendation:** Use Agent-S for GUI-specific tasks routed by HALO.

### Layer 2: Self-Improvement (SE-Darwin)

**Integration Point:** Trajectory pool and operators

Agent-S procedural memory can feed SE-Darwin:
- Store successful GUI patterns in TrajectoryPool
- Use SE operators to refine GUI automation strategies
- Benchmark improvements on OSWorld tasks

**Recommendation:** Future integration (Phase 5, post-production).

### Layer 3: A2A Communication

**Integration Point:** Agent discovery and task delegation

Agent-S can be exposed as A2A-compatible agent:
- Task type: "GUI_AUTOMATION"
- Capabilities: browser, forms, navigation, screenshots
- Async execution for long-running tasks

**Recommendation:** Phase 4 enhancement.

---

## 7. Risk Analysis

### High Risk
1. **Breaking Existing Deployments**
   - **Mitigation:** Hybrid backend with feature flag
   - **Rollback:** Instant via environment variable

2. **API Cost Explosion**
   - **Mitigation:** Monitor cost per task, set budget alerts
   - **Rollback:** Revert to Gemini if cost >2x baseline

### Medium Risk
3. **Agent-S Failures in Production**
   - **Mitigation:** Extensive testing, gradual rollout (10% → 50% → 100%)
   - **Rollback:** Feature flag revert

4. **Platform Compatibility Issues**
   - **Mitigation:** Test on Linux (primary), macOS, Windows
   - **Rollback:** Platform-specific backend selection

### Low Risk
5. **Performance Degradation**
   - **Mitigation:** Benchmark latency in staging
   - **Rollback:** Cache optimizations, model downgrade

---

## 8. Success Metrics

### Primary Metrics
- **Success Rate:** Agent-S ≥ 80% (vs Gemini ~50-60%)
- **Error Rate:** Agent-S < Gemini error rate
- **Latency:** Agent-S < 2x Gemini latency

### Secondary Metrics
- **Cost per Task:** Track API usage (OpenAI GPT-4o)
- **Task Completion Time:** End-to-end deployment duration
- **User Satisfaction:** Deploy Agent NPS score

### Long-Term Metrics
- **Experience Learning:** Repeat task success rate improvement
- **Multi-Agent Adoption:** Number of agents using Agent-S backend
- **Cost Reduction:** Savings from experience learning (target: 20-30%)

---

## 9. Timeline

### Week 1 (Oct 28 - Nov 3, 2025)
- **Day 1-2:** Implement core infrastructure (agent_s_backend.py, computer_use_client.py)
- **Day 3-4:** Integration testing (unit tests, benchmark comparison)
- **Day 5:** Staging deployment and validation
- **Day 6-7:** Buffer for issues

### Week 2 (Nov 4 - Nov 10, 2025)
- **Day 1:** Production rollout (10% traffic)
- **Day 2:** Expand to 50% traffic
- **Day 3:** Full cutover (100% traffic)
- **Day 4-7:** Optimization (experience learning, cost reduction)

### Week 3+ (Nov 11+, 2025)
- Multi-agent expansion (QA, Support, Marketing agents)
- Layer 2 integration (SE-Darwin trajectory learning)
- A2A communication enablement

---

## 10. Open Questions

1. **API Keys:** Which models to prioritize?
   - **Recommendation:** Start with OpenAI GPT-4o (most tested in Agent-S)
   - **Future:** Add Anthropic Claude for diversity

2. **Knowledge Base:** How to initialize procedural memory?
   - **Recommendation:** Download Agent-S default knowledge base (linux platform)
   - **Future:** Build Genesis-specific deployment patterns

3. **Multi-Platform Support:** Test on all platforms?
   - **Recommendation:** Linux primary (production VPS), macOS/Windows secondary

4. **S2 Migration:** When to upgrade to AgentS2?
   - **Recommendation:** Wait for pip release, then evaluate (Q1 2026?)

---

## 11. Next Steps

### Immediate Actions (This Week)
1. ✅ Research complete (Context7 MCP documentation retrieved)
2. ✅ Agent-S installed (gui-agents==0.1.3)
3. ⏳ Integration plan documented (this document)
4. ⏭️ Implement agent_s_backend.py (Week 1, Day 1)
5. ⏭️ Create benchmark comparison tests (Week 1, Day 3)

### Approval Required
- [ ] Hudson: Code review and security approval
- [ ] Cora: Testing strategy and coverage approval
- [ ] Alex: Integration testing and E2E validation
- [ ] Forge: Production deployment approval

### Documentation Required
- [ ] API key setup guide (add to API_KEYS_QUICK_REFERENCE.md)
- [ ] Usage examples for each agent type
- [ ] Troubleshooting guide for common issues
- [ ] Completion report (docs/AGENT_S_INTEGRATION_COMPLETE.md)

---

## 12. References

### Research Papers
- **Agent-S:** https://arxiv.org/abs/2410.16465 (Oct 22, 2025)
- **Agent-S2:** https://arxiv.org/abs/2504.00906 (Compositional framework, not yet in pip)

### GitHub Repositories
- **Agent-S:** https://github.com/simular-ai/Agent-S
- **Genesis:** https://github.com/[your-org]/genesis-rebuild

### Documentation
- **Context7 MCP Research:** Completed Oct 27, 2025
- **Agent-S README:** Retrieved from Context7
- **Genesis CLAUDE.md:** Project instructions and standards

---

## Appendix A: Agent-S Code Examples

### Basic Usage (from Context7)
```python
import pyautogui
import io
from gui_agents.core.AgentS import GraphSearchAgent
from gui_agents.aci.LinuxOSACI import LinuxACI, UIElement

# Initialize grounding agent
grounding_agent = LinuxACI()

# Configure engine
engine_params = {
    "engine_type": "openai",
    "model": "gpt-4o",
}

# Create Agent-S instance
agent = GraphSearchAgent(
    engine_params,
    grounding_agent,
    platform="ubuntu",
    action_space="pyautogui",
    observation_type="mixed",
    search_engine="Perplexica"  # Optional web search
)

# Execute task
screenshot = pyautogui.screenshot()
buffered = io.BytesIO()
screenshot.save(buffered, format="PNG")
screenshot_bytes = buffered.getvalue()

acc_tree = UIElement.systemWideElement()

obs = {
    "screenshot": screenshot_bytes,
    "accessibility_tree": acc_tree,
}

instruction = "Close VS Code"
info, action = agent.predict(instruction=instruction, observation=obs)

exec(action[0])
```

### Genesis Integration Example
```python
# infrastructure/agent_s_backend.py
from gui_agents.core.AgentS import GraphSearchAgent
from gui_agents.aci.LinuxOSACI import LinuxACI, UIElement
import pyautogui
import io
from typing import Dict, Any

class AgentSBackend:
    def __init__(self, model: str = "gpt-4o"):
        self.grounding_agent = LinuxACI()
        engine_params = {
            "engine_type": "openai",
            "model": model,
        }
        self.agent = GraphSearchAgent(
            engine_params,
            self.grounding_agent,
            platform="ubuntu",
            action_space="pyautogui",
            observation_type="mixed",
        )

    async def execute_task(self, task: str) -> Dict[str, Any]:
        # Get screenshot
        screenshot = pyautogui.screenshot()
        buffered = io.BytesIO()
        screenshot.save(buffered, format="PNG")
        screenshot_bytes = buffered.getvalue()

        # Get accessibility tree
        acc_tree = UIElement.systemWideElement()

        obs = {
            "screenshot": screenshot_bytes,
            "accessibility_tree": acc_tree,
        }

        # Execute with Agent-S
        info, action = self.agent.predict(
            instruction=task,
            observation=obs
        )

        # Execute action
        exec(action[0])

        return {
            'success': True,
            'info': info,
            'action': action
        }
```

---

**End of Integration Plan**
