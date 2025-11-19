#!/usr/bin/env python3
"""
COMPREHENSIVE AGENT INTEGRATION AUDIT
Audit all 25 Genesis agents for 110/110 integration coverage

Usage:
    python scripts/audit_all_agents_110_integrations.py

Output:
    - HUDSON_AUDIT_110_INTEGRATIONS_NOV19_2025.md (comprehensive report)
    - Console output with progress and summary
"""

import os
import re
import sys
import importlib
import inspect
from pathlib import Path
from typing import Dict, List, Any, Optional, Tuple
from dataclasses import dataclass, field
from datetime import datetime

# Add project root to path
PROJECT_ROOT = Path(__file__).parent.parent
sys.path.insert(0, str(PROJECT_ROOT))


@dataclass
class IntegrationStatus:
    """Status of a single integration"""
    name: str
    category: str
    imported: bool = False
    initialized: bool = False
    active: bool = False
    attribute_name: Optional[str] = None
    error: Optional[str] = None


@dataclass
class AgentAuditResult:
    """Audit result for a single agent"""
    agent_name: str
    file_path: str
    version: str = "Unknown"
    integrations_imported: int = 0
    integrations_initialized: int = 0
    integrations_active: int = 0
    coverage_percent: float = 0.0
    status: str = "UNKNOWN"
    missing_integrations: List[str] = field(default_factory=list)
    errors: List[str] = field(default_factory=list)
    integration_details: List[IntegrationStatus] = field(default_factory=list)


# ALL 110 INTEGRATIONS ORGANIZED BY CATEGORY
ALL_INTEGRATIONS = {
    "Core Agent Framework (5)": [
        ("Azure AI Agent Framework", "azure", "AzureAIAgentClient"),
        ("Microsoft Agent Framework v4.0", "agent_framework", "ChatAgent"),
        ("Agent Framework ChatAgent", "agent_framework", "ChatAgent"),
        ("Agent Framework Observability", "observability", "setup_observability"),
        ("Agent Payment Mixin", "payment_mixin", "AgentPaymentMixin"),
    ],
    "Cost Optimization & Routing (10)": [
        ("DAAO Router", "daao_router", "get_daao_router"),
        ("DAAO Optimizer", "daao_optimizer", "DAAOOptimizer"),
        ("TUMIX Termination", "tumix_termination", "get_tumix_termination"),
        ("HALO Router", "halo_router", "HALORouter"),
        ("Autonomous Orchestrator", "autonomous_orchestrator", "AutonomousOrchestrator"),
        ("Darwin Orchestration Bridge", "darwin_orchestration_bridge", "DarwinOrchestrationBridge"),
        ("Dynamic Agent Creator", "dynamic_agent_creator", "DynamicAgentCreator"),
        ("AOP Validator", "aop_validator", "AOPValidator"),
        ("Full System Integrator", "full_system_integrator", "FullSystemIntegrator"),
        ("Cost Profiler", "cost_profiler", "CostProfiler"),
    ],
    "Memory & Learning (15)": [
        ("MemoryOS Core", "memory_os", "MemoryOS"),
        ("MemoryOS MongoDB Adapter", "memory_os_mongodb_adapter", "GenesisMemoryOSMongoDB"),
        ("Memory Store", "memory_store", "MemoryStore"),
        ("Agentic RAG", "agentic_rag", "AgenticRAG"),
        ("Reasoning Bank", "reasoning_bank", "ReasoningBank"),
        ("Replay Buffer", "replay_buffer", "ReplayBuffer"),
        ("CaseBank", "casebank", "CaseBank"),
        ("Memento Agent", "memento_agent", "MementoAgent"),
        ("Graph Database", "graph_database", "GraphDatabase"),
        ("Embedding Generator", "embedding_generator", "EmbeddingGenerator"),
        ("Benchmark Recorder", "benchmark_recorder", "BenchmarkRecorder"),
        ("Context Linter", "context_linter", "ContextLinter"),
        ("Context Profiles", "context_profiles", "ContextProfile"),
        ("Token Cache Helper", "token_cache_helper", "TokenCacheHelper"),
        ("Token Cached RAG", "token_cached_rag", "TokenCachedRAG"),
    ],
    "AgentEvolver (7)": [
        ("AgentEvolver Phase 1 - Self-Questioning", "agentevolver", "SelfQuestioningEngine"),
        ("AgentEvolver Phase 2 - Experience Reuse", "agentevolver", "ExperienceBuffer"),
        ("AgentEvolver Phase 3 - Self-Attribution", "agentevolver", "ContributionTracker"),
        ("Task Embedder", "agentevolver", "TaskEmbedder"),
        ("Hybrid Policy", "agentevolver", "HybridPolicy"),
        ("Cost Tracker", "agentevolver", "CostTracker"),
        ("Scenario Ingestion Pipeline", "agentevolver", "IngestionPipeline"),
    ],
    "DeepEyes (4)": [
        ("DeepEyes Tool Reliability", "deepeyes", "ToolReliabilityMiddleware"),
        ("DeepEyes Multimodal Tools", "deepeyes", "MultimodalToolRegistry"),
        ("DeepEyes Tool Chain Tracker", "deepeyes", "ToolChainTracker"),
        ("DeepEyes Web Search Tools", "deepeyes", "WebSearchToolkit"),
    ],
    "Web & Browser Automation (8)": [
        ("WebVoyager Client", "webvoyager_client", "get_webvoyager_client"),
        ("VOIX Detector", "browser_automation", "VoixDetector"),
        ("VOIX Executor", "browser_automation", "VoixExecutor"),
        ("Computer Use Client (Gemini)", "computer_use_client", "ComputerUseClient"),
        ("DOM Accessibility Parser", "browser_automation", "DOMAccessibilityParser"),
        ("Browser Automation Framework", "browser_automation", "BrowserAutomation"),
        ("Hybrid Automation Policy", "browser_automation", "HybridAutomationPolicy"),
        ("WebVoyager System Prompts", "browser_automation", "get_webvoyager_prompt"),
    ],
    "SPICE (Self-Play Evolution) (3)": [
        ("SPICE Challenger Agent", "spice", "ChallengerAgent"),
        ("SPICE Reasoner Agent", "spice", "ReasonerAgent"),
        ("SPICE DrGRPO Optimizer", "spice", "DrGRPOOptimizer"),
    ],
    "Payment & Budget (8)": [
        ("AP2 Protocol", "ap2_protocol", "get_ap2_client"),
        ("AP2 Helpers", "ap2_helpers", "record_ap2_event"),
        ("A2A X402 Service", "a2a_x402_service", "get_x402_service"),
        ("Media Payment Helper", "media_helper", "MediaPaymentHelper"),
        ("Budget Enforcer", "budget_enforcer", "BudgetEnforcer"),
        ("Stripe Manager", "stripe_manager", "StripeManager"),
        ("Finance Ledger", "finance_ledger", "FinanceLedger"),
        ("X402 Monitor", "x402_monitor", "X402Monitor"),
    ],
    "LLM Providers (6)": [
        ("LLM Client (Generic)", "llm_client", "get_llm_client"),
        ("Gemini Client", "gemini_client", "get_gemini_client"),
        ("DeepSeek Client", "deepseek_client", "get_deepseek_client"),
        ("Mistral Client", "mistral_client", "get_mistral_client"),
        ("OpenAI Client", "openai_client", "get_openai_client"),
        ("Local LLM Provider", "local_llm_client", "get_local_llm_client"),
    ],
    "Safety & Security (8)": [
        ("WaltzRL Safety", "waltzrl_wrapper", "WaltzRLWrapper"),
        ("WaltzRL Conversation Agent", "waltzrl_conversation_agent", "WaltzRLConversationAgent"),
        ("WaltzRL Feedback Agent", "waltzrl_feedback_agent", "WaltzRLFeedbackAgent"),
        ("WaltzRL Stage 2 Trainer", "waltzrl_stage2_trainer", "WaltzRLStage2Trainer"),
        ("Agent Auth Registry", "agent_auth_registry", "AgentAuthRegistry"),
        ("Security Scanner", "security_scanner", "SecurityScanner"),
        ("PII Detector", "pii_detector", "PIIDetector"),
        ("Safety Wrapper", "safety_wrapper", "SafetyWrapper"),
    ],
    "Evolution & Training (7)": [
        ("Memory Aware Darwin", "memory_aware_darwin", "MemoryAwareDarwin"),
        ("Solver Agent", "solver_agent", "SolverAgent"),
        ("Verifier Agent", "verifier_agent", "VerifierAgent"),
        ("React Training", "react_training", "ReactTraining"),
        ("LLM Judge RL", "llm_judge_rl", "LLMJudgeRL"),
        ("Environment Learning Agent", "environment_learning_agent", "EnvironmentLearningAgent"),
        ("Trajectory Pool", "trajectory_pool", "Trajectory"),
    ],
    "Observability & Monitoring (10)": [
        ("Observability (OpenTelemetry)", "observability", "setup_observability"),
        ("Health Check", "health_check", "HealthCheck"),
        ("Analytics", "analytics", "Analytics"),
        ("AB Testing", "ab_testing", "ABTesting"),
        ("Codebook Manager", "codebook_manager", "CodebookManager"),
        ("Modular Prompts", "prompts", "ModularPromptAssembler"),
        ("Benchmark Runner", "benchmark_runner", "BenchmarkRunner"),
        ("CI Eval Harness", "ci_eval_harness", "CIEvalHarness"),
        ("Prometheus Metrics", "prometheus_metrics", "PrometheusMetrics"),
        ("Discord Integration", "genesis_discord", "get_discord_client"),
    ],
    "Business & Workflow (8)": [
        ("Business Idea Generator", "business_idea_generator", "BusinessIdeaGenerator"),
        ("Business Monitor", "business_monitor", "get_monitor"),
        ("Component Selector", "component_selector", "ComponentSelector"),
        ("Component Library", "component_library", "COMPONENT_LIBRARY"),
        ("Genesis Discord", "genesis_discord", "GenesisDiscord"),
        ("Task DAG", "task_dag", "TaskDAG"),
        ("Workspace State Manager", "workspace_state_manager", "WorkspaceStateManager"),
        ("Team Assembler", "team_assembler", "TeamAssembler"),
    ],
    "Integration Systems (10)": [
        ("OmniDaemon Bridge", "omnidaemon_bridge", "get_bridge"),
        ("AgentScope Runtime", "agentscope_runtime", "AgentScopeRuntime"),
        ("AgentScope Alias", "agentscope_alias", "AgentScopeAlias"),
        ("OpenHands Integration", "openhands_integration", "OpenHandsIntegration"),
        ("Socratic Zero Integration", "socratic_zero_integration", "SocraticZeroIntegration"),
        ("Marketplace Backends", "marketplace_backends", "MarketplaceBackends"),
        ("AATC System", "aatc_system", "AATCSystem"),
        ("Feature Flags", "feature_flags", "FeatureFlags"),
        ("Error Handler", "error_handler", "ErrorHandler"),
        ("Config Loader", "config_loader", "ConfigLoader"),
        ("Genesis Health Check", "genesis_health_check", "GenesisHealthCheck"),
    ],
}

# 25 Essential Agents to Audit
ESSENTIAL_AGENTS = [
    ("agents/analyst_agent.py", "AnalystAgent"),
    ("agents/billing_agent.py", "BillingAgent"),
    ("agents/business_generation_agent.py", "BusinessGenerationAgent"),
    ("agents/builder_agent.py", "BuilderAgent"),
    ("agents/code_review_agent.py", "CodeReviewAgent"),
    ("agents/database_design_agent.py", "DatabaseDesignAgent"),
    ("agents/documentation_agent.py", "DocumentationAgent"),
    ("agents/email_agent.py", "EmailAgent"),
    ("agents/marketing_agent.py", "MarketingAgent"),
    ("agents/qa_agent.py", "QAAgent"),
    ("agents/research_discovery_agent.py", "ResearchDiscoveryAgent"),
    ("agents/se_darwin_agent.py", "SEDarwinAgent"),
    ("agents/seo_agent.py", "SEOAgent"),
    ("agents/stripe_integration_agent.py", "StripeIntegrationAgent"),
    ("agents/support_agent.py", "SupportAgent"),
    ("agents/commerce_agent.py", "CommerceAgent"),
    ("agents/domain_agent.py", "DomainAgent"),
    ("infrastructure/genesis_meta_agent.py", "GenesisMetaAgent"),  # Priority #1
    ("agents/finance_agent.py", "FinanceAgent"),
    ("agents/security_agent.py", "SecurityAgent"),
    ("agents/monitoring_agent.py", "MonitoringAgent"),
    ("agents/sales_agent.py", "SalesAgent"),
    ("agents/analytics_agent.py", "AnalyticsAgent"),
    ("agents/pricing_agent.py", "PricingAgent"),
    ("agents/deploy_agent.py", "DeployAgent"),
]


def count_total_integrations() -> int:
    """Count total number of integrations across all categories"""
    return sum(len(integrations) for integrations in ALL_INTEGRATIONS.values())


def audit_agent_file(file_path: Path) -> Tuple[List[IntegrationStatus], List[str]]:
    """
    Audit a single agent file for integrations.

    Returns:
        Tuple of (integration_statuses, errors)
    """
    errors = []
    integration_statuses = []

    try:
        # Read file content
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # Check each integration
        for category, integrations in ALL_INTEGRATIONS.items():
            for integration_name, module_hint, class_hint in integrations:
                status = IntegrationStatus(
                    name=integration_name,
                    category=category
                )

                # Check if imported (look for module or class in imports)
                import_patterns = [
                    rf'from.*{re.escape(module_hint)}.*import',
                    rf'import.*{re.escape(module_hint)}',
                    rf'from.*import.*{re.escape(class_hint)}',
                ]

                for pattern in import_patterns:
                    if re.search(pattern, content, re.IGNORECASE):
                        status.imported = True
                        break

                # Check if initialized (look for attribute assignment in __init__)
                init_patterns = [
                    rf'self\..*=.*{re.escape(class_hint)}',
                    rf'self\..*{re.escape(module_hint)}',
                ]

                for pattern in init_patterns:
                    if re.search(pattern, content, re.IGNORECASE):
                        status.initialized = True
                        # Extract attribute name
                        match = re.search(rf'self\.([\w_]+)\s*=.*{re.escape(class_hint)}', content)
                        if match:
                            status.attribute_name = match.group(1)
                        break

                # Check if active (used in methods or get_integration_status)
                if status.attribute_name:
                    usage_pattern = rf'self\.{re.escape(status.attribute_name)}\.'
                    if re.search(usage_pattern, content):
                        status.active = True

                integration_statuses.append(status)

    except Exception as e:
        errors.append(f"Error reading file: {str(e)}")

    return integration_statuses, errors


def analyze_agent(agent_file: str, agent_class: str) -> AgentAuditResult:
    """Analyze a single agent for integration coverage"""
    file_path = PROJECT_ROOT / agent_file

    print(f"  Auditing: {agent_file}...")

    result = AgentAuditResult(
        agent_name=agent_class,
        file_path=agent_file
    )

    if not file_path.exists():
        result.errors.append(f"File not found: {file_path}")
        result.status = "FILE NOT FOUND"
        return result

    # Audit the file
    integration_statuses, errors = audit_agent_file(file_path)
    result.integration_details = integration_statuses
    result.errors = errors

    # Calculate metrics
    result.integrations_imported = sum(1 for s in integration_statuses if s.imported)
    result.integrations_initialized = sum(1 for s in integration_statuses if s.initialized)
    result.integrations_active = sum(1 for s in integration_statuses if s.active)

    total = count_total_integrations()
    result.coverage_percent = (result.integrations_active / total) * 100

    # Determine status
    if result.integrations_active == total:
        result.status = "PASS (110/110)"
    elif result.integrations_active >= 90:
        result.status = f"PASS ({result.integrations_active}/110)"
    elif result.integrations_active >= 50:
        result.status = f"FAIL ({result.integrations_active}/110)"
    else:
        result.status = f"CRITICAL FAIL ({result.integrations_active}/110)"

    # Identify missing integrations
    result.missing_integrations = [
        s.name for s in integration_statuses if not s.active
    ]

    # Try to extract version from file
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            version_match = re.search(r'Version:\s*(\S+)', content)
            if version_match:
                result.version = version_match.group(1)
    except:
        pass

    return result


def generate_markdown_report(results: List[AgentAuditResult]) -> str:
    """Generate comprehensive markdown audit report"""
    total_integrations = count_total_integrations()

    report = []
    report.append("# GENESIS AGENT INTEGRATION AUDIT - 110/110 COVERAGE")
    report.append(f"\n**Audit Date**: {datetime.now().strftime('%B %d, %Y %H:%M:%S')}")
    report.append(f"**Total Integrations**: {total_integrations}")
    report.append(f"**Agents Audited**: {len(results)}")
    report.append("\n---\n")

    # Executive Summary
    report.append("## EXECUTIVE SUMMARY\n")

    agents_110 = sum(1 for r in results if r.integrations_active == total_integrations)
    agents_90_109 = sum(1 for r in results if 90 <= r.integrations_active < total_integrations)
    agents_50_89 = sum(1 for r in results if 50 <= r.integrations_active < 90)
    agents_below_50 = sum(1 for r in results if r.integrations_active < 50)

    avg_coverage = sum(r.integrations_active for r in results) / len(results) if results else 0
    avg_percent = (avg_coverage / total_integrations) * 100

    report.append(f"- **Total Agents Audited**: {len(results)}/25")
    report.append(f"- **Agents at 110/110**: {agents_110}")
    report.append(f"- **Agents at 90-109/110**: {agents_90_109}")
    report.append(f"- **Agents at 50-89/110**: {agents_50_89}")
    report.append(f"- **Agents at < 50/110**: {agents_below_50} (CRITICAL)")
    report.append(f"- **Average Coverage**: {avg_coverage:.1f}/110 ({avg_percent:.1f}%)")
    report.append("")

    # Top Issues
    report.append("### Top Missing Integrations\n")
    missing_count = {}
    for result in results:
        for missing in result.missing_integrations:
            missing_count[missing] = missing_count.get(missing, 0) + 1

    top_missing = sorted(missing_count.items(), key=lambda x: x[1], reverse=True)[:10]
    for i, (integration, count) in enumerate(top_missing, 1):
        report.append(f"{i}. **{integration}**: Missing in {count}/{len(results)} agents")
    report.append("")

    # Detailed Results
    report.append("\n---\n")
    report.append("## DETAILED AGENT AUDIT RESULTS\n")

    # Sort by coverage (lowest first for priority fixing)
    results_sorted = sorted(results, key=lambda r: r.integrations_active)

    for result in results_sorted:
        report.append(f"### Agent: {result.agent_name}\n")
        report.append(f"**File**: `{result.file_path}`")
        report.append(f"**Version**: {result.version}")
        report.append(f"**Status**: {result.status}")
        report.append("")
        report.append(f"- Integrations Imported: {result.integrations_imported}/{total_integrations}")
        report.append(f"- Integrations Initialized: {result.integrations_initialized}/{total_integrations}")
        report.append(f"- Integrations Active: **{result.integrations_active}/{total_integrations}**")
        report.append(f"- Coverage: **{result.coverage_percent:.1f}%**")
        report.append("")

        if result.errors:
            report.append("**Errors Found**:")
            for error in result.errors:
                report.append(f"- {error}")
            report.append("")

        # Group missing by category
        missing_by_category = {}
        for status in result.integration_details:
            if not status.active:
                if status.category not in missing_by_category:
                    missing_by_category[status.category] = []
                missing_by_category[status.category].append(status.name)

        if missing_by_category:
            report.append("**Missing Integrations by Category**:")
            for category, missing in sorted(missing_by_category.items()):
                report.append(f"\n*{category}*:")
                for integration in missing:
                    report.append(f"- {integration}")
            report.append("")

        report.append("\n---\n")

    # Priority Actions
    report.append("## PRIORITY ACTIONS\n")
    report.append("### Immediate Fixes Needed (CRITICAL)\n")
    critical_agents = [r for r in results if r.integrations_active < 50]
    if critical_agents:
        for agent in critical_agents:
            report.append(f"- **{agent.agent_name}**: {agent.integrations_active}/110 ({agent.coverage_percent:.1f}%)")
            report.append(f"  - File: `{agent.file_path}`")
            report.append(f"  - Missing: {len(agent.missing_integrations)} integrations")
    else:
        report.append("- None")

    report.append("\n### Medium Priority Fixes\n")
    medium_agents = [r for r in results if 50 <= r.integrations_active < 90]
    if medium_agents:
        for agent in medium_agents:
            report.append(f"- **{agent.agent_name}**: {agent.integrations_active}/110 ({agent.coverage_percent:.1f}%)")
    else:
        report.append("- None")

    report.append("\n### Low Priority Improvements\n")
    low_agents = [r for r in results if 90 <= r.integrations_active < total_integrations]
    if low_agents:
        for agent in low_agents:
            report.append(f"- **{agent.agent_name}**: {agent.integrations_active}/110 ({agent.coverage_percent:.1f}%)")
    else:
        report.append("- None")

    # Financial Impact
    report.append("\n---\n")
    report.append("## FINANCIAL IMPACT\n")
    report.append("\nEstimated cost savings if all integrations were at 110/110:\n")
    report.append("- **DAAO Router**: 20-30% cost reduction on routing")
    report.append("- **TUMIX Termination**: 50-60% cost savings on refinement")
    report.append("- **MemoryOS MongoDB**: 49% F1 improvement (better quality)")
    report.append("- **WebVoyager**: 59.1% success rate (fewer retries)")
    report.append("- **VOIX**: 10-25x faster automation (less execution time)")
    report.append("- **Token Caching**: 60-70% latency reduction (faster responses)")
    report.append("")
    missing_integrations_total = sum(len(r.missing_integrations) for r in results)
    report.append(f"**Potential Monthly Savings**: $1,000-$5,000 per agent")
    report.append(f"**Total Missing Integrations**: {missing_integrations_total}")
    report.append(f"**Estimated Lost Savings**: ${missing_integrations_total * 10}/month")

    return "\n".join(report)


def main():
    """Main audit execution"""
    print("=" * 80)
    print("GENESIS AGENT INTEGRATION AUDIT - 110/110 COVERAGE")
    print("=" * 80)
    print(f"\nTotal Integrations to Check: {count_total_integrations()}")
    print(f"Total Agents to Audit: {len(ESSENTIAL_AGENTS)}\n")

    results = []

    for i, (agent_file, agent_class) in enumerate(ESSENTIAL_AGENTS, 1):
        print(f"[{i}/{len(ESSENTIAL_AGENTS)}] {agent_class}...")
        result = analyze_agent(agent_file, agent_class)
        results.append(result)
        print(f"  ✓ Coverage: {result.integrations_active}/110 ({result.coverage_percent:.1f}%)")

    print("\n" + "=" * 80)
    print("GENERATING COMPREHENSIVE REPORT...")
    print("=" * 80 + "\n")

    # Generate markdown report
    report = generate_markdown_report(results)

    # Write to file
    output_file = PROJECT_ROOT / "HUDSON_AUDIT_110_INTEGRATIONS_NOV19_2025.md"
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(report)

    print(f"✅ Audit complete! Report saved to: {output_file}\n")

    # Print summary
    total = count_total_integrations()
    avg_coverage = sum(r.integrations_active for r in results) / len(results)
    print(f"Average Coverage: {avg_coverage:.1f}/110 ({(avg_coverage/total)*100:.1f}%)")
    print(f"Agents at 110/110: {sum(1 for r in results if r.integrations_active == total)}")
    print(f"Agents < 50/110: {sum(1 for r in results if r.integrations_active < 50)} (CRITICAL)")
    print("")
    print("See full report for details and recommendations.")


if __name__ == "__main__":
    main()
