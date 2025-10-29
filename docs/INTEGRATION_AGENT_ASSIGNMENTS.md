# INTEGRATION AGENT ASSIGNMENTS
**Date:** October 27, 2025
**Status:** Agent task delegation for 11 new system integrations

---

## EXECUTIVE SUMMARY

Assigning specialized Genesis agents to install and integrate 11 cutting-edge systems (9 core + 2 bonus) based on their expertise areas. Using Context7 MCP for up-to-date documentation and Claude Haiku 4.5 where quality permits for cost optimization.

**Total Systems:** 11 (9 core + 2 bonus)
**Estimated Timeline:** 2-3 weeks
**Expected ROI at Scale:** $160-220k/year

---

## ORCHESTRATION SYSTEMS (Layer 1 Enhancement)

### System 1: Swarms Framework ✅ COMPLETED
**Status:** Already installed (swarms-8.5.4)
**Agent:** N/A (completed during initial installation)
**Purpose:** Benchmark HierarchicalSwarm vs Genesis HTDAG/HALO
**Next Step:** Performance comparison tests

---

## MULTIMODAL SYSTEMS (Layer 2 Enhancement)

### System 2: Qwen3-VL (Multimodal Reasoning Upgrade)
**Agent:** **Thon** (Python specialist)
**Reasoning:**
- Python-heavy integration (transformers library)
- Replaces DeepSeek-OCR in 5 agents (QA, Support, Legal, Analyst, Marketing)
- Model loading and inference optimization expertise required

**Tasks for Thon:**
1. ✅ Verify transformers>=4.57.0 installed (COMPLETE)
2. Load Qwen3-VL-8B-Instruct from Hugging Face
3. Create `infrastructure/qwen3_vl_service.py` (similar to DeepSeek-OCR pattern)
4. Benchmark token usage vs DeepSeek-OCR (target: <71% reduction)
5. Integrate into 5 agents (reuse existing integration pattern)
6. Run E2E tests with real screenshots

**Context7 Usage:**
- `/Qwen/Qwen3-VL` - Model documentation and inference examples
- `/huggingface/transformers` - API reference for vision-language models

**Claude Model:** Haiku 4.5 for file edits, Sonnet 4 for inference optimization

**Deliverables:**
- `infrastructure/qwen3_vl_service.py` (~800 lines)
- Updated 5 agent files
- Performance comparison report (Qwen3-VL vs DeepSeek-OCR)

**Timeline:** 3-4 days

---

## EVOLUTION SYSTEMS (Layer 2 Self-Improvement)

### System 3: AgentFlow (Flow-GRPO RL Training)
**Agent:** **Oracle** (Cooperative discovery, experiment design)
**Reasoning:**
- Research-oriented system (Stanford AgentFlow)
- Requires hypothesis testing for HTDAG planner training
- RL training pipeline design (Flow-GRPO algorithm)

**Tasks for Oracle:**
1. Clone https://github.com/lupantech/AgentFlow
2. Install dependencies (pip install -e .)
3. Design experiment: Train Genesis HTDAG with Flow-GRPO
4. Create baseline metrics (current HTDAG performance)
5. Run RL training loop (reward: task decomposition quality)
6. Propose training hyperparameters (learning rate, batch size, etc.)

**Context7 Usage:**
- AgentFlow paper documentation if available
- `/openai/gym` for RL environment setup

**Claude Model:** Sonnet 4 (research-heavy reasoning required)

**Deliverables:**
- AgentFlow integration at `/home/genesis/genesis-rebuild/integrations/evolution/AgentFlow/`
- Experiment design document
- HTDAG RL training pipeline (`infrastructure/htdag_rl_trainer.py`)

**Timeline:** 5-7 days

---

### System 4: ReasoningBank (Test-Time Learning)
**Agent:** **River** (Multi-agent memory engineering specialist)
**Reasoning:**
- Memory system replacement (static TrajectoryPool → evolving ReasoningBank)
- 5-stage pipeline: Retrieve→Act→Judge→Extract→Consolidate
- Overlaps with River's expertise in memory architectures

**Tasks for River:**
1. Clone https://github.com/budprat/ReasoningBank
2. Install requirements
3. Study 5-stage pipeline architecture
4. Design migration from current TrajectoryPool to ReasoningBank
5. Implement Retrieve/Judge/Extract/Consolidate modules
6. Integrate with SE-Darwin (replaces static memory)

**Context7 Usage:**
- `/mongodb/docs` for persistent memory storage
- `/redis/docs` for caching layer

**Claude Model:** Haiku 4.5 for code migration, Sonnet 4 for architecture design

**Deliverables:**
- ReasoningBank at `/home/genesis/genesis-rebuild/integrations/evolution/ReasoningBank/`
- `infrastructure/reasoning_bank_v2.py` (evolved version)
- Migration guide (TrajectoryPool → ReasoningBank)

**Timeline:** 6-8 days

---

### System 5: RLT - Reinforcement-Learned Teachers
**Agent:** **Vanguard** (MLOps orchestration, GenAI pipelines)
**Reasoning:**
- Training pipeline for WaltzRL feedback agents
- Cost optimization (90% reduction: $100k → $10k)
- Requires MLOps expertise (tuning, distillation, monitoring)

**Tasks for Vanguard:**
1. Clone https://github.com/SakanaAI/RLT
2. Install requirements
3. Design RLT training pipeline for WaltzRL feedback agents
4. Set up cost monitoring (target: <$10k vs $100k baseline)
5. Implement teacher model training loop
6. Integrate with WaltzRL conversation/feedback agents

**Context7 Usage:**
- Sakana AI RLT documentation if available
- `/pytorch/pytorch` for model training

**Claude Model:** Haiku 4.5 for pipeline code, Sonnet 4 for training optimization

**Deliverables:**
- RLT at `/home/genesis/genesis-rebuild/integrations/evolution/RLT/`
- `infrastructure/waltzrl_rlt_trainer.py`
- Cost comparison report (RLT vs baseline training)

**Timeline:** 5-7 days

---

### System 6: Enterprise Deep Research (Salesforce)
**Agent:** **Cora** (AI agent orchestration, multi-agent design)
**Reasoning:**
- Multi-agent system (Master Planner + 4 search agents)
- Analyst Agent enhancement (deep research, competitive intelligence)
- Orchestration pattern matches Cora's expertise

**Tasks for Cora:**
1. Clone https://github.com/SalesforceAIResearch/enterprise-deep-research
2. Install requirements
3. Study Master Planner + 4-agent architecture
4. Design integration into Analyst Agent
5. Implement deep research workflow
6. Test competitive intelligence use case

**Context7 Usage:**
- Salesforce EDR documentation if available
- `/anthropic/claude` for agent prompt design

**Claude Model:** Sonnet 4 (orchestration design requires advanced reasoning)

**Deliverables:**
- EDR at `/home/genesis/genesis-rebuild/integrations/evolution/enterprise-deep-research/`
- Enhanced `agents/analyst_agent.py` with deep research capability
- Use case examples (market research, competitor analysis)

**Timeline:** 4-6 days

---

### System 7: TOON (Token-Oriented Object Notation)
**Agent:** **Hudson** (Code review, optimization specialist)
**Reasoning:**
- Protocol-level change (A2A service modification)
- Token reduction optimization (30-60% savings = $20-30k/year)
- Requires careful code review to avoid breaking A2A compatibility

**Tasks for Hudson:**
1. Clone https://github.com/johannschopplich/toon
2. Study TOON format spec (vs JSON)
3. Design A2A protocol migration (JSON → TOON)
4. Implement TOON serialization in `infrastructure/a2a_service.py`
5. Add backward compatibility (support both JSON and TOON)
6. Benchmark token reduction (target: 30-60%)

**Context7 Usage:**
- TOON format specification
- A2A protocol documentation

**Claude Model:** Haiku 4.5 for parser implementation, Sonnet 4 for protocol design

**Deliverables:**
- TOON at `/home/genesis/genesis-rebuild/integrations/tools/toon/`
- Updated `infrastructure/a2a_service.py` with TOON support
- Token reduction benchmark report

**Timeline:** 3-4 days

---

## MEMORY SYSTEMS (Layer 6 Implementation)

### System 8: MemoryOS (Memory Operating System)
**Agent:** **River** (Multi-agent memory engineering specialist)
**Reasoning:**
- Primary Layer 6 memory system (replaces OpenMemory + MemAgent plan)
- +49% F1 improvement validated (EMNLP 2025 Oral)
- River's core expertise area

**Tasks for River:**
1. Clone https://github.com/BAI-LAB/MemoryOS
2. Install requirements from memoryos-pypi/
3. Design integration replacing current memory stack
4. Implement unified memory OS across all 15 agents
5. Benchmark F1 improvement (target: +49%)
6. Migration plan from current ReasoningBank to MemoryOS

**Context7 Usage:**
- MemoryOS paper documentation if available
- `/mongodb/docs` for backend storage

**Claude Model:** Sonnet 4 (complex memory architecture requires advanced reasoning)

**Deliverables:**
- MemoryOS at `/home/genesis/genesis-rebuild/integrations/memory/MemoryOS/`
- `infrastructure/memory_os.py` (unified memory system)
- F1 improvement benchmark report
- Migration guide (current system → MemoryOS)

**Timeline:** 7-10 days (high complexity)

---

### System 9: Nanochat (Low-Cost Agent Finetuning)
**Agent:** **Vanguard** (MLOps, model tuning pipelines)
**Reasoning:**
- Budget finetuning platform (<$100/agent vs thousands)
- Requires GPU orchestration (8XH100 or CPU for dev)
- MLOps expertise for training pipeline management

**Tasks for Vanguard:**
1. Clone https://github.com/karpathy/nanochat
2. Test CPU dev mode first: `bash dev/runcpu.sh`
3. Design budget finetuning pipeline for specialist agents
4. Estimate GPU cost (8XH100 ~$100 for 4 hours)
5. Create finetuning workflow (data prep → train → eval → deploy)
6. Document cost comparison (Nanochat vs cloud fine-tuning)

**Context7 Usage:**
- Karpathy's LLM101n course materials
- `/pytorch/pytorch` for training

**Claude Model:** Haiku 4.5 for pipeline code, Sonnet 4 for training strategy

**Deliverables:**
- Nanochat at `/home/genesis/genesis-rebuild/integrations/memory/nanochat/`
- `infrastructure/nanochat_finetuner.py`
- Cost comparison report (Nanochat vs OpenAI/Anthropic finetuning)

**Timeline:** 4-5 days

---

## BONUS TOOLS (Layer 6 Alternatives)

### Tool 1: G-Memory (Hierarchical Multi-Agent Memory)
**Agent:** **River** (Multi-agent memory specialist)
**Reasoning:**
- Alternative to MemoryOS (3-tier graph: insight→query→interaction)
- Backup option if MemoryOS integration challenges arise
- River already assigned to MemoryOS (can evaluate both)

**Tasks for River:**
1. Create conda env: `conda create -n GMemory python=3.12`
2. Clone https://github.com/bingreeky/GMemory
3. Install requirements
4. Compare architecture: G-Memory vs MemoryOS
5. Recommend which to use (or hybrid approach)
6. Document trade-offs (complexity, performance, maintainability)

**Context7 Usage:**
- G-Memory paper documentation if available

**Claude Model:** Haiku 4.5 (evaluation task)

**Deliverables:**
- G-Memory at `/home/genesis/genesis-rebuild/integrations/memory/GMemory/`
- Comparison report: G-Memory vs MemoryOS
- Recommendation (which system to use for Layer 6)

**Timeline:** 2-3 days

---

### Tool 2: A-MEM (Zettelkasten Agentic Memory)
**Agent:** **River** (Multi-agent memory specialist)
**Reasoning:**
- Dynamic memory structuring (atomic notes + semantic linking)
- NeurIPS 2025 research code
- River evaluates alongside MemoryOS and G-Memory

**Tasks for River:**
1. Clone https://github.com/agiresearch/A-mem
2. Install requirements
3. Study Zettelkasten approach (atomic notes, semantic links)
4. Compare with MemoryOS and G-Memory
5. Prototype integration if promising
6. Document when to use A-MEM vs MemoryOS

**Context7 Usage:**
- A-MEM paper documentation if available

**Claude Model:** Haiku 4.5 (research code evaluation)

**Deliverables:**
- A-MEM at `/home/genesis/genesis-rebuild/integrations/memory/A-mem/`
- Comparison report: A-MEM vs MemoryOS vs G-Memory
- Use case recommendations

**Timeline:** 2-3 days

---

## AGENT ASSIGNMENT SUMMARY

| System | Agent | Reasoning | Timeline | Claude Model |
|--------|-------|-----------|----------|--------------|
| Swarms Framework | ✅ Complete | Already installed | - | - |
| Qwen3-VL | **Thon** | Python/transformers expert | 3-4 days | Haiku 4.5 + Sonnet 4 |
| AgentFlow | **Oracle** | RL experiment design | 5-7 days | Sonnet 4 |
| ReasoningBank | **River** | Memory engineering | 6-8 days | Haiku 4.5 + Sonnet 4 |
| RLT | **Vanguard** | MLOps pipelines | 5-7 days | Haiku 4.5 + Sonnet 4 |
| Enterprise Deep Research | **Cora** | Multi-agent orchestration | 4-6 days | Sonnet 4 |
| TOON | **Hudson** | Code review/optimization | 3-4 days | Haiku 4.5 + Sonnet 4 |
| MemoryOS | **River** | Memory OS (primary) | 7-10 days | Sonnet 4 |
| Nanochat | **Vanguard** | Finetuning pipelines | 4-5 days | Haiku 4.5 + Sonnet 4 |
| G-Memory | **River** | Memory alternative eval | 2-3 days | Haiku 4.5 |
| A-MEM | **River** | Memory alternative eval | 2-3 days | Haiku 4.5 |

**Total Agents Used:** 6 (Thon, Oracle, River, Vanguard, Cora, Hudson)

---

## CONTEXT7 MCP USAGE STRATEGY

**High Priority (Use Context7 for latest docs):**
1. Qwen3-VL model API (`/Qwen/Qwen3-VL`)
2. Transformers library (`/huggingface/transformers`)
3. MongoDB integration (`/mongodb/docs`)
4. Redis caching (`/redis/docs`)
5. PyTorch training (`/pytorch/pytorch`)

**Medium Priority:**
- AgentFlow documentation (if available)
- ReasoningBank API reference
- Salesforce EDR documentation
- MemoryOS API docs

**Low Priority (fallback to GitHub README):**
- TOON format spec (small project)
- RLT documentation (research code)
- G-Memory/A-MEM (research code)

---

## HAIKU 4.5 vs SONNET 4 USAGE GUIDELINES

### Use **Haiku 4.5** for:
- File edits (code migrations, simple integrations)
- Benchmark running and reporting
- Documentation writing
- Test creation
- Parser implementations (TOON)
- Cost analysis and comparisons

### Use **Sonnet 4** for:
- Architecture design (multi-agent systems)
- RL training pipeline design
- Complex orchestration patterns
- Memory system integration (Layer 6)
- Research code evaluation
- Performance optimization strategy

**Cost Optimization:**
- Haiku 4.5: $0.25/1M input, $1.25/1M output
- Sonnet 4: $3/1M input, $15/1M output
- Target: 60-70% of work on Haiku, 30-40% on Sonnet
- Estimated savings: $200-400 during integration phase

---

## EXECUTION TIMELINE

### Week 1 (Days 1-7):
**Parallel Track 1 (Quick Wins):**
- Thon: Qwen3-VL integration (Days 1-4)
- Hudson: TOON protocol upgrade (Days 1-4)

**Parallel Track 2 (Research Setup):**
- Oracle: AgentFlow setup and experiment design (Days 1-7)
- Vanguard: RLT setup and pipeline design (Days 1-7)

**Parallel Track 3 (Memory Eval):**
- River: MemoryOS setup (Days 1-3)
- River: G-Memory + A-MEM evaluation (Days 4-7)

### Week 2 (Days 8-14):
**Parallel Track 1 (Completion):**
- Thon: Complete Qwen3-VL tests and benchmarks (Days 8-10)
- Hudson: Complete TOON integration and testing (Days 8-10)

**Parallel Track 2 (Deep Work):**
- Oracle: AgentFlow RL training experiments (Days 8-14)
- Vanguard: RLT training pipeline implementation (Days 8-14)
- Cora: Enterprise Deep Research integration (Days 8-14)

**Parallel Track 3 (Memory Implementation):**
- River: ReasoningBank integration (Days 8-14)
- River: MemoryOS core implementation (Days 8-14)

### Week 3 (Days 15-21):
**Integration & Testing:**
- All agents: E2E integration testing
- Vanguard: Nanochat finetuning pipeline (Days 15-20)
- River: Complete MemoryOS migration (Days 15-21)

**Validation:**
- Hudson: Code review all integrations (Days 19-21)
- Alex: E2E tests with real scenarios (Days 19-21)
- Forge: Performance benchmarking (Days 19-21)

---

## RISK MITIGATION

### Risk 1: Research Code Instability
**Systems Affected:** AgentFlow, RLT, G-Memory, A-MEM
**Mitigation:**
- Oracle/Vanguard/River create abstraction layers
- Don't tightly couple to research code
- Fork repos for stability

### Risk 2: GPU Availability (Nanochat)
**System Affected:** Nanochat
**Mitigation:**
- Start with CPU dev mode (`bash dev/runcpu.sh`)
- Document cloud GPU options (Hyperstack, Lambda Labs)
- Delay production finetuning until budget allocated

### Risk 3: Memory System Migration Complexity
**Systems Affected:** ReasoningBank, MemoryOS
**Mitigation:**
- River creates migration scripts (gradual transition)
- Run both systems in parallel during migration
- Extensive testing before deprecating old system

### Risk 4: Context7 MCP Availability
**Fallback Plan:**
- Use GitHub README and paper PDFs for documentation
- WebFetch for API documentation
- All systems have public documentation

---

## SUCCESS METRICS

### Technical Metrics:
- ✅ All 11 systems installed and functional
- ✅ Integration tests passing (>95%)
- ✅ Performance benchmarks meet targets:
  - Qwen3-VL: <71% token reduction
  - TOON: 30-60% token reduction in A2A
  - MemoryOS: +49% F1 improvement
  - RLT: <$10k training cost (vs $100k baseline)

### Cost Metrics:
- Combined savings: $160-220k/year at scale (1000 agents)
- Integration cost: <$2k (mostly Sonnet 4 usage)
- ROI: 80-110X return on integration investment

### Timeline Metrics:
- Week 1: 4 systems operational (Qwen3-VL, TOON, AgentFlow setup, RLT setup)
- Week 2: 8 systems operational (+ EDR, ReasoningBank, G-Memory eval, A-MEM eval)
- Week 3: All 11 systems complete with E2E tests

---

## AGENT TASK DELEGATION (IMPLEMENTATION)

### Immediate Actions:

1. **Create Task Tool Calls for Each Agent:**
```python
# Thon: Qwen3-VL integration
Task(subagent="Thon", prompt="Install and integrate Qwen3-VL-8B-Instruct...")

# Oracle: AgentFlow RL training
Task(subagent="Oracle", prompt="Set up AgentFlow and design HTDAG RL experiments...")

# River: Memory systems (MemoryOS + alternatives)
Task(subagent="River", prompt="Install MemoryOS, G-Memory, A-MEM and evaluate...")

# Vanguard: RLT + Nanochat MLOps
Task(subagent="Vanguard", prompt="Set up RLT and Nanochat training pipelines...")

# Cora: Enterprise Deep Research orchestration
Task(subagent="Cora", prompt="Integrate Salesforce EDR into Analyst Agent...")

# Hudson: TOON protocol optimization
Task(subagent="Hudson", prompt="Integrate TOON into A2A service for token reduction...")
```

2. **Monitor Progress:**
- Each agent updates `INTEGRATION_AGENT_ASSIGNMENTS.md` with status
- Daily standup summaries in PROJECT_STATUS.md
- Blockers escalated to orchestration layer

3. **Coordinate Integration:**
- Week 2: Hudson reviews all code
- Week 3: Alex runs E2E tests
- Week 3: Forge benchmarks performance

---

## CONCLUSION

**Agent Assignments:**
- ✅ 6 specialized agents assigned to 11 systems
- ✅ Context7 MCP prioritized for up-to-date docs
- ✅ Haiku 4.5 used for 60-70% of work (cost optimization)
- ✅ Parallel execution across 3 tracks (Week 1-3 timeline)

**Expected Outcomes:**
- 11 cutting-edge systems integrated
- $160-220k/year cost savings at scale
- Layer 2 (Evolution), Layer 6 (Memory), Layer 1 (Orchestration) significantly enhanced

**Next Action:** Delegate tasks to agents via Task tool calls with detailed prompts and context.

---

**Document Status:** ✅ COMPLETE
**Last Updated:** October 27, 2025
**Next Review:** Week 1 standup (Day 7)
