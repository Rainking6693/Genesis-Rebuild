# Genesis Integration Hierarchy

> Snapshot of all 65 active integrations, grouped by the layer they belong to and expanded to show the core subsystems each one pulls in. The structure mirrors what the full-system integrator boots (`infrastructure/full_system_integrator.py`).

## Layer 1 – Orchestration

HALO Router (Integration 2/65)
├────────────────────────────────────────────
│  Routing Core
│  ├─ Task intent classification
│  ├─ Agent capability scoring
│  ├─ Tool arbitration pipeline
│  │   ├─ ToolRM Scoring (Quality & reflection)
│  │   └─ FlowMesh Routing (Interactive vs batch queues)
│  ├─ Memory×Router Coupling (Context injection)
│  ├─ WaltzRL Safety Wrapper (Stage 1+2 policy shields)
│  └─ DAAO Router (Difficulty-aware escalation)
│
│  Knowledge & Policy Overlays
│  ├─ Policy Cards Registry (`.policy_cards/`)
│  ├─ Capability Maps (agent/tool matrix)
│  ├─ AgentScope Alias Registry (role remapping)
│  └─ CaseBank Recall (past routing outcomes)
│
│  External LLM Connectors
│  ├─ Vertex AI fine-tuned models
│  ├─ Anthropic Claude (fallback)
│  └─ Gemini Flash (primary fallback)

HTDAG Planner (Integration 1/65)
├────────────────────────────────────────────
│  Planning Pipeline
│  ├─ TaskDAG Graph Engine
│  ├─ Hierarchical heuristics + HTN templates
│  ├─ FlowMesh Request Tagger (load shaping)
│  ├─ CPU Offload Controller (judge/planning workers)
│  ├─ AgentGit Version Store (plan snapshots)
│  └─ Self-Correction Loop (state-based repair)
│
│  Safety & Compliance Hooks
│  ├─ WaltzRL pattern filters
│  ├─ Security & prompt sanitizers
│  └─ Rate-limit circuit breaker hooks

AOP Validator (Integration 5/65)
├────────────────────────────────────────────
│  Validation Phases
│  ├─ Solvability Analysis (agent/resource graph)
│  ├─ Completeness Scan (task coverage)
│  ├─ Redundancy Detection (duplicate work)
│  └─ Quality Scoring (LLM Judge RL integration)
│
│  Feedback Channels
│  ├─ Dynamic Improvement Reward (DIR) insights
│  └─ Heuristic fallbacks when LLM parsing fails

DAAO Router (Integration 6/65)
├────────────────────────────────────────────
│  Difficulty Sensing
│  ├─ Task complexity tagging
│  ├─ Cost/latency estimators
│  └─ Mode switching (interactive vs batch)
│
│  Safety Envelope
│  ├─ WaltzRL Stage 1 checks
│  └─ Circuit breaker guardrails

Genesis Orchestrator V2 (Integration 7/65)
├────────────────────────────────────────────
│  Coordination Surface
│  ├─ Inclusive Fitness Swarm bootstrap
│  ├─ Multi-Agent Evolve toggles
│  ├─ SE-Darwin coupling hooks
│  └─ Modular prompts loader
│
│  Monitoring
│  ├─ Business Monitor feed
│  └─ OTEL/Grafana metric emitters

Policy Cards (Integration 3/65)
├────────────────────────────────────────────
│  Card Types
│  ├─ Cost guardrails
│  ├─ Safety prohibitions
│  └─ Industry compliance modifiers
│
│  HALO Touchpoints
│  ├─ Per-agent capability masking
│  └─ Prompt augmentation directives

Capability Maps (Integration 4/65)
├────────────────────────────────────────────
│  Agent Skill Graph
│  ├─ Core capability vectors
│  ├─ Tool affordance matrix
│  └─ Performance-weighted routing hints

## Layer 2 – Evolution & Learning

Trajectory Pool (Integration 8/65)
├────────────────────────────────────────────
│  Storage Backends
│  ├─ LangGraph Store (memory persistence)
│  ├─ CaseBank appenders
│  └─ Vector embeddings (TEI client)
│
│  Sampling & Replay
│  ├─ Co-evolution sampling
│  ├─ Forgetting / compression (DeepSeek OCR)
│  └─ Score-weighted replay

Revision Operator (Integration 9/65)
├────────────────────────────────────────────
│  Code editing strategies
│  ├─ AST patcher (CodeQualityValidator)
│  ├─ Safety rewrite pass (WaltzRL feedback)
│  └─ Memory-aware prompting

Recombination Operator (Integration 10/65)
├────────────────────────────────────────────
│  Crossover Engines
│  ├─ Multi-trajectory merge
│  └─ Feature grafting via LangGraph store

Refinement Operator (Integration 11/65)
├────────────────────────────────────────────
│  Verification Stack
│  ├─ LLM Judge RL (tool calls enabled)
│  ├─ Static analyzer (CodeQualityValidator)
│  └─ Unit test harness (pytest hook)

SICA Complexity Detector (Integration 12/65)
├────────────────────────────────────────────
│  Signal Inputs
│  ├─ Task topology stats (HTDAG)
│  ├─ Policy flags (TUMIX early stopping)
│  └─ Cost/latency telemetry

SPICE Challenger Agent (Integration 13/65)
├────────────────────────────────────────────
│  Scenario Generation
│  ├─ Corpus-grounded prompt crafting
│  └─ Adversarial task injection

SPICE Reasoner Agent (Integration 14/65)
├────────────────────────────────────────────
│  Multi-trajectory synthesis
│  ├─ Tool a/b comparisons
│  └─ Weighted reward blending

SPICE DrGRPO Optimizer (Integration 15/65)
├────────────────────────────────────────────
│  Variance-Reduced RL loop
│  ├─ DIR reward shaping
│  └─ Collaborative gradient updates

Socratic-Zero (Integration 16/65)
├────────────────────────────────────────────
│  Research Loop
│  ├─ OpenEnv tool calls (Playwright, Supabase)
│  ├─ DeepResearch pipeline (web insights via Tongyi DeepResearch 30B)
│  └─ ADP dataset ingestion

ADP Pipeline (Integration 17/65)
├────────────────────────────────────────────
│  Data Operations
│  ├─ Scenario templating
│  └─ LangGraph ingestion connectors

SE-Darwin Agent (Integration 18/65)
├────────────────────────────────────────────
│  Agents
│  ├─ Solver Agent (builder focus)
│  ├─ Verifier Agent (LLM + static checks)
│  ├─ Memory-aware Darwin loop
│  └─ CodeQualityValidator (AST metrics)

## Layer 3 – Communication

A2A Protocol (Integration 19/65)
├────────────────────────────────────────────
│  Messaging Fabric
│  ├─ Async gateway (aiohttp server)
│  ├─ Rogue test harness integration
│  ├─ TEI vector retrieval
│  └─ WaltzRL feedback channel

OpenEnv (Integration 20/65)
├────────────────────────────────────────────
│  Tool Registry
│  ├─ Playwright Browser Env
│  ├─ Supabase Env
│  └─ Custom adapters via EnvRegistry

## Layer 5 – Swarm

Inclusive Fitness Swarm (Integration 21/65)
├────────────────────────────────────────────
│  Team Composition
│  ├─ Capability matching (AgentScope Alias)
│  ├─ Trajectory fitness scoring
│  └─ Cost-aware pruning

PSO Optimizer (Integration 22/65)
├────────────────────────────────────────────
│  Particle Swarm Operators
│  ├─ Diversity seeding from CaseBank
│  └─ Memory-guided velocity updates

## Layer 6 – Memory

CaseBank (Integration 23/65)
├────────────────────────────────────────────
│  Case Management
│  ├─ JSONL storage
│  ├─ SE-Darwin replay exports
│  └─ WaltzRL feedback ingestion

TEI Embeddings (Integration 24/65)
├────────────────────────────────────────────
│  Embedding Service
│  ├─ HTTP client (configurable endpoint)
│  ├─ Vector cache (LangGraph)
│  └─ Batch embedding hooks

Memento Agent (Integration 25/65)
├────────────────────────────────────────────
│  Retrieval Loop
│  ├─ Temporal gating
│  ├─ Similarity thresholding
│  └─ TEI + CaseBank hybrid scoring

ReasoningBank (Integration 26/65)
├────────────────────────────────────────────
│  Storage
│  ├─ MongoDB backend (with fallback)
│  └─ Compression + dedupe filters

Memory×Router Coupling (Integration 27/65)
├────────────────────────────────────────────
│  HALO Augmentation
│  ├─ Query rewriting with memories
│  └─ Post-route memory writes

LangGraph Store (Integration 28/65)
├────────────────────────────────────────────
│  Persistence
│  ├─ Compression (DeepSeek OCR)
│  ├─ Forgetting windows
│  └─ Graph traversal for Hybrid RAG

## Safety

WaltzRL (Integration 29/65)
├────────────────────────────────────────────
│  Stage 1 (Rule-Based)
│  ├─ 20+ regex policy patterns
│  ├─ Blocking decision logic
│  └─ DIR reward model seeding
│
│  Stage 2 (DIR Training)
│  ├─ Trained Feedback Agent
│  ├─ Trained Conversation Agent (joint DIR)
│  ├─ Collaborative training loop
│  └─ Safety alignment via RLHF

TRiSM Framework (Integration 30/65)
├────────────────────────────────────────────
│  Policy Governance
│  ├─ Traceability ledger
│  └─ Compliance audit hooks

Circuit Breaker (Integration 31/65)
├────────────────────────────────────────────
│  Runtime Guards
│  ├─ Error counting windows
│  ├─ Graceful degradation triggers
│  └─ Auto-retry timers

## AI / LLM Providers

Vertex AI (Integration 32/65)
├────────────────────────────────────────────
│  Model Registry
│  ├─ Fine-tuned agents (6 models)
│  ├─ Cost tracker
│  └─ Latency tracker

SGLang Router (Integration 33/65)
├────────────────────────────────────────────
│  Local Serving
│  ├─ Model manager (Qwen 2.5 etc.)
│  └─ KV cache optimizer

vLLM (Integration 34/65)
├────────────────────────────────────────────
│  Token Cache Engine
│  ├─ Speculative decoding support
│  └─ Async generation API

Local LLMs (Qwen, Llama3) (Integration 35/65)
├────────────────────────────────────────────
│  Compatibility Stubs
│  ├─ Disabled Railway-safe client
│  └─ Fallback warnings

## Training Pipelines

DeepResearch (Integration 36/65)
├────────────────────────────────────────────
│  Research Workflow
│  ├─ Web summarization
│  ├─ Evidence packaging
│  └─ SE-Darwin data feeds

Unsloth (Integration 37/65)
├────────────────────────────────────────────
│  Fine-tune Acceleration
│  ├─ 4-bit quant support
│  ├─ Flash attention hooks
│  └─ Pipeline registry

FP16 Training (Integration 38/65)
├────────────────────────────────────────────
│  Mixed Precision
│  ├─ Trainer configs (retained stubs)
│  └─ Rollback guides

## Advanced Feature Set

Computer Use (Integration 39/65)
├────────────────────────────────────────────
│  Backends
│  ├─ Gemini UI Agent (default)
│  ├─ WebVoyager Backend (Integration 40/65)
│  └─ Agent-S Backend (Integration 41/65)
│
│  Control Loop
│  ├─ Screen diffing
│  └─ Action planning

Pipelex Workflows (Integration 42/65)
├────────────────────────────────────────────
│  Template Library
│  ├─ CRUD templates
│  └─ Deployment recipes

HGM Tree Search (Integration 43/65)
├────────────────────────────────────────────
│  Judges
│  ├─ Gemini-first judge
│  ├─ Claude fallback
│  └─ Heuristic scoring fallback

Agent-as-Judge (Integration 44/65)
├────────────────────────────────────────────
│  Scoring Dimensions
│  ├─ Coherence/novelty weights
│  └─ Tool-augmented feedback

Tensor Logic (Integration 45/65)
├────────────────────────────────────────────
│  Structured reasoning kernels

SLICE Context Linter (Integration 46/65)
├────────────────────────────────────────────
│  Context Hygiene
│  ├─ Deduplication
│  ├─ Long-context optimization
│  └─ Risk tagging

DeepSeek-OCR (Integration 47/65)
├────────────────────────────────────────────
│  Memory Compression
│  ├─ Visual OCR summarizer
│  └─ Token savings analytics

Modular Prompts (Integration 48/65)
├────────────────────────────────────────────
│  Prompt Packs
│  ├─ Layered prompt assembly
│  └─ Feature-flag gating

TUMIX (Integration 49/65)
├────────────────────────────────────────────
│  Early Stopping Rules
│  ├─ Task understanding heuristics
│  └─ Cost savings profiles

Multi-Agent Evolve (Integration 50/65)
├────────────────────────────────────────────
│  Co-evolution Dynamics
│  ├─ Solver/verifier pairings
│  └─ Shared memory updates

AgentGit (Integration 51/65)
├────────────────────────────────────────────
│  HTDAG Plan Versioning
│  ├─ Git-backed history
│  └─ Diff inspection helpers

MDP Document Ingester (Integration 52/65)
├────────────────────────────────────────────
│  RAG Feeders
│  ├─ Multi-format parsers
│  ├─ MongoDB chunk store
│  └─ Hybrid RAG hooks

MAPE-K Loop (Integration 53/65)
├────────────────────────────────────────────
│  Continuous Improvement
│  ├─ Monitor/Analyze stages
│  └─ Plan/Execute w/ knowledge updates

ToolRM Scoring (Integration 54/65)
├────────────────────────────────────────────
│  Tool Analytics
│  ├─ Trace logger
│  ├─ Quality scorer
│  └─ Reflection prompts

FlowMesh Routing (Integration 55/65)
├────────────────────────────────────────────
│  Queue Manager
│  ├─ Interactive lane
│  └─ Batch lane

CPU Offload (Integration 56/65)
├────────────────────────────────────────────
│  Worker Pools
│  ├─ CPU process manager
│  └─ GPU-only client bridge

AgentScope Alias (Integration 57/65)
├────────────────────────────────────────────
│  Role Registry
│  ├─ Microsoft Framework compatibility
│  └─ Capability overlays

Data Juicer Agent (Integration 58/65)
├────────────────────────────────────────────
│  Data Curation
│  ├─ 200+ operator library
│  └─ Quality filtering w/ CaseBank

ReAct Training (Integration 59/65)
├────────────────────────────────────────────
│  Trinity RFT Integration
│  ├─ Reasoning finetunes
│  └─ DIR-aligned reward shaping

AgentScope Runtime (Integration 60/65)
├────────────────────────────────────────────
│  Sandbox Manager
│  ├─ Security policies
│  └─ Deployment channels

LLM Judge RL (Integration 61/65)
├────────────────────────────────────────────
│  Tool-enabled judging
│  ├─ AOP Reward Integration
│  └─ Anthropic GPT-4o backend

## Monitoring

Business Monitor (Integration 62/65)
├────────────────────────────────────────────
│  Metrics
│  ├─ Component execution stats
│  ├─ Cost tracking
│  └─ Log ingestion (business_generation)

OTEL Tracing (Integration 63/65)
├────────────────────────────────────────────
│  Distributed Tracing
│  ├─ Span exporters
│  └─ Trace sampling controls

Prometheus (Integration 64/65)
├────────────────────────────────────────────
│  Metrics Collection
│  ├─ Exporter endpoints
│  └─ Alert rules (dashboard feed)

Grafana (Integration 65/65)
├────────────────────────────────────────────
│  Dashboards
│  ├─ Genesis operations
│  ├─ Agent performance
│  └─ Safety & cost observability
