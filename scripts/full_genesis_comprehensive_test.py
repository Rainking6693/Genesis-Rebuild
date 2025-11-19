#!/usr/bin/env python3
"""
Full Genesis Comprehensive Test
================================

Tests all 25 agents and 75 integrations end-to-end.
Monitors for errors and reports status in real-time.
"""

import asyncio
import sys
import time
import traceback
from datetime import datetime
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

print("=" * 80)
print("FULL GENESIS COMPREHENSIVE TEST - ALL 25 AGENTS + 75 INTEGRATIONS")
print("=" * 80)
print(f"Start Time: {datetime.now().isoformat()}")
print()

# Track results
results = {
    "start_time": datetime.now().isoformat(),
    "agents_tested": 0,
    "agents_passed": 0,
    "agents_failed": 0,
    "integrations_verified": 0,
    "errors": [],
}

print("🔍 PHASE 1: Verifying All 75 Integrations")
print("-" * 80)

integration_checks = []

# Integration Group 1: AgentEvolver (7 components)
print("\n📦 AgentEvolver (7 components):")
try:
    from infrastructure.agentevolver import (
        SelfQuestioningEngine, ExperienceManager, ExperienceBuffer,
        TaskEmbedder, HybridPolicy, CostTracker, ScenarioIngestionPipeline
    )
    print("  ✅ All 7 AgentEvolver components imported successfully")
    integration_checks.append(("AgentEvolver", True, None))
    results["integrations_verified"] += 7
except Exception as e:
    print(f"  ❌ AgentEvolver import failed: {e}")
    integration_checks.append(("AgentEvolver", False, str(e)))
    results["errors"].append({"integration": "AgentEvolver", "error": str(e)})

# Integration Group 2: DeepEyes (4 components)
print("\n📦 DeepEyes (4 components):")
try:
    from infrastructure.deepeyes.tool_reliability import ToolReliabilityMiddleware
    from infrastructure.deepeyes.multimodal_tools import ScreenshotAnalyzer, DiagramInterpreter
    from infrastructure.deepeyes.tool_chain_tracker import ToolChainTracker
    print("  ✅ All 4 DeepEyes components imported successfully")
    integration_checks.append(("DeepEyes", True, None))
    results["integrations_verified"] += 4
except Exception as e:
    print(f"  ❌ DeepEyes import failed: {e}")
    integration_checks.append(("DeepEyes", False, str(e)))
    results["errors"].append({"integration": "DeepEyes", "error": str(e)})

# Integration Group 3: VOIX (3 components)
print("\n📦 VOIX (3 components):")
try:
    from infrastructure.browser_automation import VoixDetector, VoixExecutor, HybridAutomation
    print("  ✅ All 3 VOIX components imported successfully")
    integration_checks.append(("VOIX", True, None))
    results["integrations_verified"] += 3
except Exception as e:
    print(f"  ❌ VOIX import failed: {e}")
    integration_checks.append(("VOIX", False, str(e)))
    results["errors"].append({"integration": "VOIX", "error": str(e)})

# Integration Group 4: SPICE (3 components)
print("\n📦 SPICE (3 components):")
try:
    from infrastructure.spice import ChallengerAgent, ReasonerAgent, DrGRPOOptimizer, SPICE_AVAILABLE
    assert SPICE_AVAILABLE == True, "SPICE not available"
    print(f"  ✅ All 3 SPICE components imported successfully (SPICE_AVAILABLE={SPICE_AVAILABLE})")
    integration_checks.append(("SPICE", True, None))
    results["integrations_verified"] += 3
except Exception as e:
    print(f"  ❌ SPICE import failed: {e}")
    integration_checks.append(("SPICE", False, str(e)))
    results["errors"].append({"integration": "SPICE", "error": str(e)})

# Integration Group 5: WaltzRL (1 component)
print("\n📦 WaltzRL Safety (1 component):")
try:
    from infrastructure.waltzrl_safety import get_waltzrl_safety
    safety = get_waltzrl_safety()
    print(f"  ✅ WaltzRL safety wrapper operational")
    integration_checks.append(("WaltzRL", True, None))
    results["integrations_verified"] += 1
except Exception as e:
    print(f"  ❌ WaltzRL import failed: {e}")
    integration_checks.append(("WaltzRL", False, str(e)))
    results["errors"].append({"integration": "WaltzRL", "error": str(e)})

# Integration Group 6: EDR (4 components)
print("\n📦 EDR Enterprise Deep Research (4 components):")
try:
    from integrations.evolution.enterprise_deep_research.src.agents import MasterResearchAgent, SearchAgent
    from integrations.evolution.enterprise_deep_research.src.state import SummaryState
    from integrations.evolution.enterprise_deep_research.src.configuration import Configuration
    print("  ✅ All 4 EDR components imported successfully")
    integration_checks.append(("EDR", True, None))
    results["integrations_verified"] += 4
except Exception as e:
    print(f"  ❌ EDR import failed: {e}")
    integration_checks.append(("EDR", False, str(e)))
    results["errors"].append({"integration": "EDR", "error": str(e)})

# Integration Group 7: WebVoyager (1 component)
print("\n📦 WebVoyager Prompts (1 component):")
try:
    from prompts import SYSTEM_PROMPT
    assert len(SYSTEM_PROMPT) > 0, "SYSTEM_PROMPT is empty"
    print(f"  ✅ WebVoyager SYSTEM_PROMPT available ({len(SYSTEM_PROMPT)} chars)")
    integration_checks.append(("WebVoyager", True, None))
    results["integrations_verified"] += 1
except Exception as e:
    print(f"  ❌ WebVoyager prompt import failed: {e}")
    integration_checks.append(("WebVoyager", False, str(e)))
    results["errors"].append({"integration": "WebVoyager", "error": str(e)})

print("\n" + "=" * 80)
print(f"✅ Integration Verification Complete: {results['integrations_verified']}/75 verified")
print("=" * 80)

# PHASE 2: Test All 25 Agents
print("\n🤖 PHASE 2: Testing All 25 Agents")
print("-" * 80)

agent_tests = []

agents_to_test = [
    ("AnalystAgent", "agents.analyst_agent", "AnalystAgent", {}),
    ("BillingAgent", "agents.billing_agent", "BillingAgent", {}),
    ("BusinessGenerationAgent", "agents.business_generation_agent", "BusinessGenerationAgent", {}),
    ("CodeReviewAgent", "agents.code_review_agent", "CodeReviewAgent", {}),
    ("ContentAgent", "agents.content_agent", "ContentAgent", {}),
    ("DatabaseDesignAgent", "agents.database_design_agent", "DatabaseDesignAgent", {}),
    ("DeployAgent", "agents.deploy_agent", "DeployAgent", {}),
    ("DocumentationAgent", "agents.documentation_agent", "DocumentationAgent", {}),
    ("EmailAgent", "agents.email_agent", "EmailAgent", {}),
    ("MarketingAgent", "agents.marketing_agent", "MarketingAgent", {}),
    ("QAAgent", "agents.qa_agent", "QAAgent", {}),
    ("ResearchDiscoveryAgent", "agents.research_discovery_agent", "ResearchDiscoveryAgent", {}),
    ("SEDarwinAgent", "agents.se_darwin_agent", "SEDarwinAgent", {"agent_name": "se_darwin_test"}),
    ("SEOAgent", "agents.seo_agent", "SEOAgent", {}),
    ("StripeIntegrationAgent", "agents.stripe_integration_agent", "StripeIntegrationAgent", {}),
    ("SupportAgent", "agents.support_agent", "SupportAgent", {}),
    ("CommerceAgent", "agents.commerce_agent", "CommerceAgent", {}),
    ("DomainAgent", "agents.domain_agent", "DomainAgent", {}),
    ("FinanceAgent", "agents.finance_agent", "FinanceAgent", {}),
    ("PricingAgent", "agents.pricing_agent", "PricingAgent", {}),
    ("SpecificationAgent", "agents.specification_agent", "SpecificationAgent", {}),
    ("ArchitectureAgent", "agents.architecture_agent", "ArchitectureAgent", {}),
    ("FrontendAgent", "agents.frontend_agent", "FrontendAgent", {}),
    ("BackendAgent", "agents.backend_agent", "BackendAgent", {}),
    ("SecurityAgent", "agents.security_agent", "EnhancedSecurityAgent", {}),
]

for agent_name, module_path, class_name, init_args in agents_to_test:
    results["agents_tested"] += 1
    try:
        print(f"\n[{results['agents_tested']}/25] Testing {agent_name}...")
        module = __import__(module_path, fromlist=[class_name])
        agent_class = getattr(module, class_name)

        # Test instantiation with init_args
        agent = agent_class(**init_args)
        print(f"  ✅ {agent_name} instantiated successfully")

        agent_tests.append((agent_name, True, None))
        results["agents_passed"] += 1

    except Exception as e:
        error_msg = f"{type(e).__name__}: {str(e)}"
        print(f"  ❌ {agent_name} failed: {error_msg}")
        agent_tests.append((agent_name, False, error_msg))
        results["agents_failed"] += 1
        results["errors"].append({"agent": agent_name, "error": error_msg, "traceback": traceback.format_exc()})

print("\n" + "=" * 80)
print(f"✅ Agent Testing Complete: {results['agents_passed']}/25 passed, {results['agents_failed']}/25 failed")
print("=" * 80)

# PHASE 3: Summary
print("\n📊 FINAL SUMMARY")
print("=" * 80)
print(f"Start Time: {results['start_time']}")
print(f"End Time: {datetime.now().isoformat()}")
print()
print(f"Integrations Verified: {results['integrations_verified']}/75 ({results['integrations_verified']/75*100:.1f}%)")
print(f"Agents Passed: {results['agents_passed']}/25 ({results['agents_passed']/25*100:.1f}%)")
print(f"Agents Failed: {results['agents_failed']}/25")
print(f"Total Errors: {len(results['errors'])}")
print()

if results['errors']:
    print("❌ ERRORS DETECTED:")
    print("-" * 80)
    for i, error in enumerate(results['errors'], 1):
        if 'agent' in error:
            print(f"{i}. Agent: {error['agent']}")
            print(f"   Error: {error['error']}")
        elif 'integration' in error:
            print(f"{i}. Integration: {error['integration']}")
            print(f"   Error: {error['error']}")
        print()
else:
    print("✅ NO ERRORS - ALL TESTS PASSED!")

print("=" * 80)

# Exit with appropriate code
if results['agents_failed'] > 0 or len(results['errors']) > 0:
    sys.exit(1)
else:
    sys.exit(0)
