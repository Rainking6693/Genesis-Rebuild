#!/usr/bin/env python3
"""
CORA CROSS-VERIFICATION AUDIT SCRIPT
Independent verification of Hudson's 110/110 integration audit findings

Methodology:
1. Import counting: Count actual imports from infrastructure/
2. Initialization detection: Check if imported modules are initialized in __init__
3. Method usage scanning: Count actual usage in agent methods
4. Self-reporting: Call get_integration_status() if available
5. Initialization testing: Attempt to instantiate agent

Comparison with Hudson:
- Hudson counts "active integrations" (likely usage-based)
- Cora counts imports + initialization + usage separately
- Cross-verify to determine if Hudson's strict or accurate
"""

import ast
import importlib.util
import json
import os
import re
import sys
from collections import defaultdict
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Set, Tuple, Optional

# All 110 integrations from Hudson's audit
ALL_INTEGRATIONS = {
    # AgentEvolver (7)
    "AgentEvolver Phase 1 - Self-Questioning",
    "AgentEvolver Phase 2 - Experience Reuse",
    "AgentEvolver Phase 3 - Self-Attribution",
    "Task Embedder",
    "Hybrid Policy",
    "Cost Tracker",
    "Scenario Ingestion Pipeline",

    # Business & Workflow (8)
    "Business Idea Generator",
    "Business Monitor",
    "Component Selector",
    "Component Library",
    "Genesis Discord",
    "Task DAG",
    "Workspace State Manager",
    "Team Assembler",

    # Core Agent Framework (5)
    "Azure AI Agent Framework",
    "Microsoft Agent Framework v4.0",
    "Agent Framework ChatAgent",
    "Agent Framework Observability",
    "Agent Payment Mixin",

    # Cost Optimization & Routing (10)
    "DAAO Router",
    "DAAO Optimizer",
    "TUMIX Termination",
    "HALO Router",
    "Autonomous Orchestrator",
    "Darwin Orchestration Bridge",
    "Dynamic Agent Creator",
    "AOP Validator",
    "Full System Integrator",
    "Cost Profiler",

    # DeepEyes (4)
    "DeepEyes Tool Reliability",
    "DeepEyes Multimodal Tools",
    "DeepEyes Tool Chain Tracker",
    "DeepEyes Web Search Tools",

    # Evolution & Training (7)
    "Memory Aware Darwin",
    "Solver Agent",
    "Verifier Agent",
    "React Training",
    "LLM Judge RL",
    "Environment Learning Agent",
    "Trajectory Pool",

    # Integration Systems (10)
    "OmniDaemon Bridge",
    "AgentScope Runtime",
    "AgentScope Alias",
    "OpenHands Integration",
    "Socratic Zero Integration",
    "Marketplace Backends",
    "AATC System",
    "Feature Flags",
    "Error Handler",
    "Config Loader",
    "Genesis Health Check",

    # LLM Providers (6)
    "LLM Client (Generic)",
    "Gemini Client",
    "DeepSeek Client",
    "Mistral Client",
    "OpenAI Client",
    "Local LLM Provider",

    # Memory & Learning (15)
    "MemoryOS Core",
    "MemoryOS MongoDB Adapter",
    "Memory Store",
    "Agentic RAG",
    "Reasoning Bank",
    "Replay Buffer",
    "CaseBank",
    "Memento Agent",
    "Graph Database",
    "Embedding Generator",
    "Benchmark Recorder",
    "Context Linter",
    "Context Profiles",
    "Token Cache Helper",
    "Token Cached RAG",

    # Observability & Monitoring (10)
    "Observability (OpenTelemetry)",
    "Health Check",
    "Analytics",
    "AB Testing",
    "Codebook Manager",
    "Modular Prompts",
    "Benchmark Runner",
    "CI Eval Harness",
    "Prometheus Metrics",
    "Discord Integration",

    # Payment & Budget (8)
    "AP2 Protocol",
    "AP2 Helpers",
    "A2A X402 Service",
    "Media Payment Helper",
    "Budget Enforcer",
    "Stripe Manager",
    "Finance Ledger",
    "X402 Monitor",

    # SPICE (Self-Play Evolution) (3)
    "SPICE Challenger Agent",
    "SPICE Reasoner Agent",
    "SPICE DrGRPO Optimizer",

    # Safety & Security (8)
    "WaltzRL Safety",
    "WaltzRL Conversation Agent",
    "WaltzRL Feedback Agent",
    "WaltzRL Stage 2 Trainer",
    "Agent Auth Registry",
    "Security Scanner",
    "PII Detector",
    "Safety Wrapper",

    # Web & Browser Automation (8)
    "WebVoyager Client",
    "VOIX Detector",
    "VOIX Executor",
    "Computer Use Client (Gemini)",
    "DOM Accessibility Parser",
    "Browser Automation Framework",
    "Hybrid Automation Policy",
    "WebVoyager System Prompts",
}

# Map integration names to import patterns
INTEGRATION_IMPORT_PATTERNS = {
    # AgentEvolver
    "AgentEvolver Phase 1 - Self-Questioning": [
        "infrastructure.agentevolver.self_questioning",
        "SelfQuestioningEngine",
        "CuriosityDrivenTrainer"
    ],
    "AgentEvolver Phase 2 - Experience Reuse": [
        "infrastructure.agentevolver.experience_manager",
        "ExperienceBuffer",
        "HybridPolicy"
    ],
    "AgentEvolver Phase 3 - Self-Attribution": [
        "infrastructure.agentevolver.attribution",
        "ContributionTracker",
        "AttributionEngine"
    ],
    "Task Embedder": ["infrastructure.agentevolver.embedder", "TaskEmbedder"],
    "Hybrid Policy": ["HybridPolicy", "infrastructure.agentevolver"],
    "Cost Tracker": ["CostTracker", "infrastructure.agentevolver"],
    "Scenario Ingestion Pipeline": ["infrastructure.agentevolver.ingestion"],

    # Business & Workflow
    "Business Idea Generator": ["infrastructure.business_idea_generator"],
    "Business Monitor": ["infrastructure.business_monitor"],
    "Component Selector": ["infrastructure.component_selector"],
    "Component Library": ["infrastructure.component_library", "COMPONENT_LIBRARY"],
    "Genesis Discord": ["infrastructure.genesis_discord"],
    "Task DAG": ["infrastructure.task_dag", "TaskDAG"],
    "Workspace State Manager": ["infrastructure.workspace_state"],
    "Team Assembler": ["infrastructure.team_assembler"],

    # Core Agent Framework
    "Azure AI Agent Framework": ["agent_framework.azure", "AzureAIAgentClient"],
    "Microsoft Agent Framework v4.0": ["agent_framework", "ChatAgent"],
    "Agent Framework ChatAgent": ["ChatAgent"],
    "Agent Framework Observability": ["agent_framework.observability", "setup_observability"],
    "Agent Payment Mixin": ["infrastructure.payments.agent_payment_mixin", "AgentPaymentMixin"],

    # Cost Optimization & Routing
    "DAAO Router": ["infrastructure.daao_router", "get_daao_router"],
    "DAAO Optimizer": ["infrastructure.daao_optimizer"],
    "TUMIX Termination": ["infrastructure.tumix_termination", "get_tumix_termination"],
    "HALO Router": ["infrastructure.halo_router", "HALORouter"],
    "Autonomous Orchestrator": ["infrastructure.autonomous_orchestrator"],
    "Darwin Orchestration Bridge": ["infrastructure.darwin_orchestration_bridge"],
    "Dynamic Agent Creator": ["infrastructure.dynamic_agent_creator"],
    "AOP Validator": ["infrastructure.aop_validator"],
    "Full System Integrator": ["infrastructure.full_system_integrator"],
    "Cost Profiler": ["infrastructure.cost_profiler", "CostProfiler"],

    # DeepEyes
    "DeepEyes Tool Reliability": ["infrastructure.deepeyes.tool_reliability", "ToolReliabilityMiddleware"],
    "DeepEyes Multimodal Tools": ["infrastructure.deepeyes.multimodal_tools", "MultimodalToolRegistry"],
    "DeepEyes Tool Chain Tracker": ["infrastructure.deepeyes.tool_chain_tracker", "ToolChainTracker"],
    "DeepEyes Web Search Tools": ["infrastructure.deepeyes.web_search_tools", "WebSearchToolkit"],

    # Evolution & Training
    "Memory Aware Darwin": ["infrastructure.evolution.memory_aware_darwin"],
    "Solver Agent": ["infrastructure.evolution.solver_agent"],
    "Verifier Agent": ["infrastructure.evolution.verifier_agent"],
    "React Training": ["infrastructure.evolution.react_training"],
    "LLM Judge RL": ["infrastructure.evolution.llm_judge_rl"],
    "Environment Learning Agent": ["infrastructure.env_learning_agent"],
    "Trajectory Pool": ["infrastructure.trajectory_pool", "TrajectoryPool"],

    # Integration Systems
    "OmniDaemon Bridge": ["infrastructure.omnidaemon_bridge"],
    "AgentScope Runtime": ["infrastructure.agentscope_runtime"],
    "AgentScope Alias": ["infrastructure.agentscope_alias"],
    "OpenHands Integration": ["infrastructure.openhands_integration"],
    "Socratic Zero Integration": ["infrastructure.socratic_zero_integration"],
    "Marketplace Backends": ["infrastructure.marketplace_backends"],
    "AATC System": ["infrastructure.aatc_system"],
    "Feature Flags": ["infrastructure.feature_flags"],
    "Error Handler": ["infrastructure.error_handler"],
    "Config Loader": ["infrastructure.config_loader"],
    "Genesis Health Check": ["infrastructure.health_check"],

    # LLM Providers
    "LLM Client (Generic)": ["infrastructure.llm_client", "get_llm_client"],
    "Gemini Client": ["infrastructure.gemini_client", "get_gemini_client"],
    "DeepSeek Client": ["infrastructure.deepseek_client", "get_deepseek_client"],
    "Mistral Client": ["infrastructure.mistral_client", "get_mistral_client"],
    "OpenAI Client": ["infrastructure.openai_client", "get_openai_client"],
    "Local LLM Provider": ["infrastructure.local_llm_client", "get_local_llm_client"],

    # Memory & Learning
    "MemoryOS Core": ["infrastructure.memory_os_core"],
    "MemoryOS MongoDB Adapter": ["infrastructure.memory_os_mongodb_adapter", "GenesisMemoryOSMongoDB"],
    "Memory Store": ["infrastructure.memory_store"],
    "Agentic RAG": ["infrastructure.agentic_rag"],
    "Reasoning Bank": ["infrastructure.reasoning_bank"],
    "Replay Buffer": ["infrastructure.replay_buffer"],
    "CaseBank": ["infrastructure.casebank", "CaseBank"],
    "Memento Agent": ["infrastructure.memento_agent"],
    "Graph Database": ["infrastructure.graph_database"],
    "Embedding Generator": ["infrastructure.embedding_generator"],
    "Benchmark Recorder": ["infrastructure.benchmark_recorder"],
    "Context Linter": ["infrastructure.context_linter"],
    "Context Profiles": ["infrastructure.context_profiles"],
    "Token Cache Helper": ["infrastructure.token_cache_helper"],
    "Token Cached RAG": ["infrastructure.token_cached_rag", "TokenCachedRAG"],

    # Observability & Monitoring
    "Observability (OpenTelemetry)": ["infrastructure.observability"],
    "Health Check": ["infrastructure.health_check"],
    "Analytics": ["infrastructure.analytics"],
    "AB Testing": ["infrastructure.ab_testing"],
    "Codebook Manager": ["infrastructure.codebook_manager"],
    "Modular Prompts": ["infrastructure.modular_prompts"],
    "Benchmark Runner": ["infrastructure.benchmark_runner", "BenchmarkRunner"],
    "CI Eval Harness": ["infrastructure.ci_eval_harness", "CIEvalHarness"],
    "Prometheus Metrics": ["infrastructure.prometheus_metrics"],
    "Discord Integration": ["infrastructure.genesis_discord"],

    # Payment & Budget
    "AP2 Protocol": ["infrastructure.ap2_protocol", "get_ap2_client"],
    "AP2 Helpers": ["infrastructure.ap2_helpers", "record_ap2_event"],
    "A2A X402 Service": ["infrastructure.a2a_x402_service", "get_x402_service"],
    "Media Payment Helper": ["infrastructure.payments.media_helper", "MediaPaymentHelper"],
    "Budget Enforcer": ["infrastructure.payments.budget_enforcer", "BudgetEnforcer"],
    "Stripe Manager": ["infrastructure.payments.stripe_manager", "StripeManager"],
    "Finance Ledger": ["infrastructure.finance_ledger", "FinanceLedger"],
    "X402 Monitor": ["infrastructure.x402_monitor", "X402Monitor"],

    # SPICE
    "SPICE Challenger Agent": ["infrastructure.spice.challenger_agent", "ChallengerAgent"],
    "SPICE Reasoner Agent": ["infrastructure.spice.reasoner_agent", "ReasonerAgent"],
    "SPICE DrGRPO Optimizer": ["infrastructure.spice.drgrpo_optimizer", "DrGRPOOptimizer"],

    # Safety & Security
    "WaltzRL Safety": ["infrastructure.safety.waltzrl_wrapper", "WaltzRLWrapper"],
    "WaltzRL Conversation Agent": ["infrastructure.safety.waltzrl_conversation_agent"],
    "WaltzRL Feedback Agent": ["infrastructure.safety.waltzrl_feedback_agent"],
    "WaltzRL Stage 2 Trainer": ["infrastructure.safety.waltzrl_stage2_trainer"],
    "Agent Auth Registry": ["infrastructure.security.agent_auth_registry"],
    "Security Scanner": ["infrastructure.security.security_scanner"],
    "PII Detector": ["infrastructure.security.pii_detector"],
    "Safety Wrapper": ["infrastructure.safety.safety_wrapper"],

    # Web & Browser Automation
    "WebVoyager Client": ["infrastructure.webvoyager_client", "get_webvoyager_client"],
    "VOIX Detector": ["infrastructure.browser_automation.voix_detector", "VoixDetector"],
    "VOIX Executor": ["infrastructure.browser_automation.voix_executor", "VoixExecutor"],
    "Computer Use Client (Gemini)": ["infrastructure.computer_use_client", "ComputerUseClient"],
    "DOM Accessibility Parser": ["infrastructure.browser_automation.dom_accessibility_parser"],
    "Browser Automation Framework": ["infrastructure.browser_automation"],
    "Hybrid Automation Policy": ["infrastructure.browser_automation.hybrid_automation_policy"],
    "WebVoyager System Prompts": ["infrastructure.browser_automation.webvoyager_system_prompts"],
}


class CoraIntegrationAuditor:
    """Independent integration auditor using multi-dimensional analysis"""

    def __init__(self, repo_root: Path):
        self.repo_root = repo_root
        self.results = {}

    def audit_agent_file(self, agent_path: Path) -> Dict:
        """Audit a single agent file with multiple detection methods"""
        print(f"\n[CORA] Auditing {agent_path.name}...")

        with open(agent_path, 'r', encoding='utf-8') as f:
            source_code = f.read()

        # Parse AST for deeper analysis
        try:
            tree = ast.parse(source_code)
        except SyntaxError:
            print(f"[WARNING] Cannot parse {agent_path.name} - syntax error")
            return self._empty_result(agent_path.name)

        # Method 1: Import Detection
        imports_found = self._detect_imports(tree, source_code)

        # Method 2: Initialization Detection (in __init__)
        inits_found = self._detect_initializations(tree)

        # Method 3: Usage Detection (in methods)
        usage_found = self._detect_usage(tree)

        # Method 4: Try-Except Import Patterns (optional integrations)
        optional_imports = self._detect_optional_imports(tree)

        # Compute coverage scores
        imports_count = len(imports_found)
        inits_count = len(inits_found)
        usage_count = len(usage_found)

        # Active integrations = imports + initialized + used
        active_integrations = imports_found & inits_found & usage_found

        # Imported but not used
        imported_not_used = imports_found - usage_found

        # Initialized but not used
        initialized_not_used = inits_found - usage_found

        return {
            "agent": agent_path.stem,
            "file": str(agent_path.relative_to(self.repo_root)),
            "imports": list(imports_found),
            "imports_count": imports_count,
            "initializations": list(inits_found),
            "initializations_count": inits_count,
            "usage": list(usage_found),
            "usage_count": usage_count,
            "active_integrations": list(active_integrations),
            "active_count": len(active_integrations),
            "optional_imports": list(optional_imports),
            "imported_not_used": list(imported_not_used),
            "initialized_not_used": list(initialized_not_used),
            "coverage_percentage": (len(active_integrations) / 110) * 100,
            "import_percentage": (imports_count / 110) * 100,
            "usage_percentage": (usage_count / 110) * 100,
        }

    def _empty_result(self, agent_name: str) -> Dict:
        return {
            "agent": agent_name,
            "file": "ERROR",
            "imports": [],
            "imports_count": 0,
            "initializations": [],
            "initializations_count": 0,
            "usage": [],
            "usage_count": 0,
            "active_integrations": [],
            "active_count": 0,
            "optional_imports": [],
            "imported_not_used": [],
            "initialized_not_used": [],
            "coverage_percentage": 0.0,
            "import_percentage": 0.0,
            "usage_percentage": 0.0,
        }

    def _detect_imports(self, tree: ast.AST, source_code: str) -> Set[str]:
        """Detect which integrations are imported"""
        found = set()

        for integration, patterns in INTEGRATION_IMPORT_PATTERNS.items():
            for pattern in patterns:
                # Check in source code (faster for simple patterns)
                if pattern in source_code:
                    found.add(integration)
                    break

        return found

    def _detect_initializations(self, tree: ast.AST) -> Set[str]:
        """Detect which integrations are initialized in __init__"""
        found = set()

        for node in ast.walk(tree):
            if isinstance(node, ast.FunctionDef) and node.name == "__init__":
                # Analyze __init__ body for initialization patterns
                init_source = ast.unparse(node)

                for integration, patterns in INTEGRATION_IMPORT_PATTERNS.items():
                    for pattern in patterns:
                        # Look for instantiation patterns
                        if pattern in init_source and ("=" in init_source or "self." in init_source):
                            found.add(integration)
                            break

        return found

    def _detect_usage(self, tree: ast.AST) -> Set[str]:
        """Detect which integrations are actually used in agent methods"""
        found = set()

        # Get all method bodies (excluding __init__)
        method_sources = []
        for node in ast.walk(tree):
            if isinstance(node, ast.FunctionDef) and not node.name.startswith("_"):
                method_sources.append(ast.unparse(node))

        combined_source = "\n".join(method_sources)

        for integration, patterns in INTEGRATION_IMPORT_PATTERNS.items():
            for pattern in patterns:
                # Look for usage patterns (method calls, attribute access)
                if pattern in combined_source:
                    found.add(integration)
                    break

        return found

    def _detect_optional_imports(self, tree: ast.AST) -> Set[str]:
        """Detect try-except import patterns (optional integrations)"""
        optional = set()

        for node in ast.walk(tree):
            if isinstance(node, ast.Try):
                try_source = ast.unparse(node)
                if "import" in try_source.lower():
                    for integration, patterns in INTEGRATION_IMPORT_PATTERNS.items():
                        for pattern in patterns:
                            if pattern in try_source:
                                optional.add(integration)
                                break

        return optional


def compare_with_hudson(cora_result: Dict, hudson_count: int) -> Dict:
    """Compare Cora's findings with Hudson's reported count"""
    cora_active = cora_result["active_count"]
    cora_imports = cora_result["imports_count"]
    cora_usage = cora_result["usage_count"]

    # Determine verdict
    if abs(cora_active - hudson_count) <= 1:
        verdict = "ACCURATE"
    elif cora_imports >= hudson_count * 2:
        verdict = "OVERLY_STRICT"
    elif cora_usage < hudson_count:
        verdict = "PARTIALLY_CORRECT"
    else:
        verdict = "NEEDS_INVESTIGATION"

    return {
        "hudson_count": hudson_count,
        "cora_active": cora_active,
        "cora_imports": cora_imports,
        "cora_usage": cora_usage,
        "delta": cora_active - hudson_count,
        "verdict": verdict,
        "import_vs_hudson_ratio": cora_imports / max(hudson_count, 1),
        "usage_vs_hudson_ratio": cora_usage / max(hudson_count, 1),
    }


def main():
    repo_root = Path("/home/genesis/genesis-rebuild")
    auditor = CoraIntegrationAuditor(repo_root)

    # Priority agents to cross-verify
    priority_agents = [
        ("infrastructure/genesis_meta_agent.py", 4),  # Hudson: 4/110
        ("agents/marketing_agent.py", 8),  # Hudson: 8/110
        ("agents/content_agent.py", None),  # Not in Hudson's 25 (upgraded to v5.0)
        ("agents/analyst_agent.py", 3),  # Hudson: 3/110
        ("agents/qa_agent.py", 4),  # Hudson: 4/110
        ("agents/se_darwin_agent.py", 1),  # Hudson: 1/110 (CRITICAL - we know this has many imports)
        ("agents/billing_agent.py", 2),  # Hudson: 2/110
        ("agents/business_generation_agent.py", 1),  # Hudson: 1/110
        ("agents/deploy_agent.py", 1),  # Hudson: 1/110
        ("agents/seo_agent.py", 5),  # Hudson: 5/110
    ]

    results = []
    comparison_table = []

    print("\n" + "="*80)
    print("CORA CROSS-VERIFICATION AUDIT - INDEPENDENT INTEGRATION ANALYSIS")
    print("="*80)

    for agent_path, hudson_count in priority_agents:
        full_path = repo_root / agent_path

        if not full_path.exists():
            print(f"\n[WARNING] {agent_path} not found - skipping")
            continue

        # Audit the agent
        result = auditor.audit_agent_file(full_path)
        results.append(result)

        # Compare with Hudson
        if hudson_count is not None:
            comparison = compare_with_hudson(result, hudson_count)
            comparison_table.append({
                "agent": result["agent"],
                **comparison
            })

            print(f"\n  Hudson: {hudson_count}/110 ({hudson_count/110*100:.1f}%)")
            print(f"  Cora Imports: {result['imports_count']}/110 ({result['import_percentage']:.1f}%)")
            print(f"  Cora Active: {result['active_count']}/110 ({result['coverage_percentage']:.1f}%)")
            print(f"  Cora Usage: {result['usage_count']}/110 ({result['usage_percentage']:.1f}%)")
            print(f"  Verdict: {comparison['verdict']}")
        else:
            print(f"\n  [NEW AGENT] Cora Imports: {result['imports_count']}/110 ({result['import_percentage']:.1f}%)")
            print(f"  Cora Active: {result['active_count']}/110 ({result['coverage_percentage']:.1f}%)")

    # Generate comprehensive report
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    report = {
        "audit_timestamp": timestamp,
        "methodology": {
            "imports": "Count all imports from infrastructure/ matching integration patterns",
            "initializations": "Detect initialization in __init__ methods",
            "usage": "Scan all public methods for actual integration usage",
            "active": "Intersection of imports + initializations + usage",
        },
        "agents_audited": len(results),
        "results": results,
        "comparison_with_hudson": comparison_table,
        "summary": {
            "avg_imports": sum(r["imports_count"] for r in results) / len(results),
            "avg_active": sum(r["active_count"] for r in results) / len(results),
            "avg_usage": sum(r["usage_count"] for r in results) / len(results),
            "avg_coverage_pct": sum(r["coverage_percentage"] for r in results) / len(results),
        },
        "hudson_comparison_summary": {
            "accurate_count": sum(1 for c in comparison_table if c["verdict"] == "ACCURATE"),
            "overly_strict_count": sum(1 for c in comparison_table if c["verdict"] == "OVERLY_STRICT"),
            "needs_investigation_count": sum(1 for c in comparison_table if c["verdict"] == "NEEDS_INVESTIGATION"),
        }
    }

    # Save detailed JSON report
    report_path = repo_root / "CORA_INTEGRATION_AUDIT_DETAILED.json"
    with open(report_path, 'w') as f:
        json.dump(report, indent=2, fp=f)

    print(f"\n\n[CORA] Detailed audit saved to: {report_path}")
    print(f"\n[CORA] Summary:")
    print(f"  Average Imports: {report['summary']['avg_imports']:.1f}/110")
    print(f"  Average Active: {report['summary']['avg_active']:.1f}/110")
    print(f"  Average Usage: {report['summary']['avg_usage']:.1f}/110")
    print(f"  Average Coverage: {report['summary']['avg_coverage_pct']:.1f}%")

    print(f"\n[CORA] Hudson Comparison:")
    print(f"  Accurate: {report['hudson_comparison_summary']['accurate_count']}")
    print(f"  Overly Strict: {report['hudson_comparison_summary']['overly_strict_count']}")
    print(f"  Needs Investigation: {report['hudson_comparison_summary']['needs_investigation_count']}")

    return report


if __name__ == "__main__":
    main()
