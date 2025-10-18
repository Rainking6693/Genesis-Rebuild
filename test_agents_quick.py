"""
Quick Test - Verify all 15 agents can initialize successfully
"""

import asyncio
from agents import (
    get_marketing_agent, get_builder_agent, get_content_agent,
    get_deploy_agent, get_support_agent, get_qa_agent,
    get_seo_agent, get_email_agent, get_legal_agent,
    get_security_agent, get_billing_agent, get_analyst_agent,
    get_maintenance_agent, get_onboarding_agent, get_spec_agent
)


async def test_agent_initialization():
    """Test that all 15 agents can be initialized"""
    print("\n" + "="*80)
    print("GENESIS AGENT SYSTEM - QUICK INITIALIZATION TEST")
    print("="*80 + "\n")

    agents_to_test = [
        ("Marketing", get_marketing_agent, "📢"),
        ("Builder", get_builder_agent, "🔨"),
        ("Content", get_content_agent, "📝"),
        ("Deploy", get_deploy_agent, "🚀"),
        ("Support", get_support_agent, "💬"),
        ("QA", get_qa_agent, "✅"),
        ("SEO", get_seo_agent, "🔍"),
        ("Email", get_email_agent, "✉️"),
        ("Legal", get_legal_agent, "⚖️"),
        ("Security", get_security_agent, "🔒"),
        ("Billing", get_billing_agent, "💰"),
        ("Analyst", get_analyst_agent, "📊"),
        ("Maintenance", get_maintenance_agent, "🔧"),
        ("Onboarding", get_onboarding_agent, "👋"),
        ("Spec", get_spec_agent, "📋"),
    ]

    results = []

    for i, (name, get_agent, emoji) in enumerate(agents_to_test, 1):
        print(f"{emoji} Test {i}/15: {name} Agent")
        try:
            agent = await get_agent("test-business")
            print(f"   ✅ Initialized successfully")
            # Check that agent has tools
            if hasattr(agent, 'agent') and agent.agent is not None:
                print(f"   ✅ Chat agent configured")
            results.append((name, "PASS", None))
        except Exception as e:
            print(f"   ❌ Failed: {str(e)}")
            results.append((name, "FAIL", str(e)))
        print()

    # Summary
    print("="*80)
    print("TEST SUMMARY")
    print("="*80)

    passed = sum(1 for _, status, _ in results if status == "PASS")
    failed = sum(1 for _, status, _ in results if status == "FAIL")

    for name, status, error in results:
        emoji = "✅" if status == "PASS" else "❌"
        print(f"{emoji} {name} Agent: {status}")
        if error:
            print(f"   Error: {error}")

    print("\n" + "-"*80)
    print(f"Total: {len(results)} agents tested")
    print(f"Passed: {passed} ({int(passed/len(results)*100)}%)")
    print(f"Failed: {failed}")

    if failed == 0:
        print("\n🎉 ALL 15 AGENTS INITIALIZED SUCCESSFULLY!")
        print("✅ Migration Complete - All agents ready for A2A integration")
    else:
        print(f"\n⚠️  {failed} agent(s) failed to initialize")

    print("="*80 + "\n")

    return failed == 0


if __name__ == "__main__":
    success = asyncio.run(test_agent_initialization())
    exit(0 if success else 1)
