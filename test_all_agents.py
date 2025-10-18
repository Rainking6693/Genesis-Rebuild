"""
Comprehensive Test Suite for All 15 Genesis Agents
Tests each agent's tools to ensure migration was successful
"""

import asyncio
import json
from agents import (
    get_marketing_agent, get_builder_agent, get_content_agent,
    get_deploy_agent, get_support_agent, get_qa_agent,
    get_seo_agent, get_email_agent, get_legal_agent,
    get_security_agent, get_billing_agent, get_analyst_agent,
    get_maintenance_agent, get_onboarding_agent, get_spec_agent
)


async def test_all_agents():
    """Test all 15 agents"""
    print("\n" + "="*80)
    print("GENESIS AGENT SYSTEM - COMPREHENSIVE TEST SUITE")
    print("Testing all 15 migrated agents")
    print("="*80 + "\n")

    test_results = []

    # Test 1: Marketing Agent
    print("📢 Test 1/15: Marketing Agent")
    print("-" * 60)
    try:
        agent = await get_marketing_agent("test-business")
        result = agent.create_strategy("TestApp", "Developers", 5000.0)
        data = json.loads(result)
        assert "channels" in data
        print(f"✅ PASS - Marketing Agent ({len(data['channels'])} channels created)")
        test_results.append(("Marketing", "PASS"))
    except Exception as e:
        print(f"❌ FAIL - Marketing Agent: {str(e)}")
        test_results.append(("Marketing", "FAIL"))

    # Test 2: Builder Agent
    print("\n🔨 Test 2/15: Builder Agent")
    print("-" * 60)
    try:
        agent = await get_builder_agent("test-business")
        result = agent.generate_frontend("TestApp", ["Dashboard", "Settings"], ["Home", "About"])
        data = json.loads(result)
        assert "files" in data
        print(f"✅ PASS - Builder Agent ({data['file_count']} files generated)")
        test_results.append(("Builder", "PASS"))
    except Exception as e:
        print(f"❌ FAIL - Builder Agent: {str(e)}")
        test_results.append(("Builder", "FAIL"))

    # Test 3: Content Agent
    print("\n📝 Test 3/15: Content Agent")
    print("-" * 60)
    try:
        agent = await get_content_agent("test-business")
        result = agent.write_blog_post("Getting Started", ["tutorial", "guide"], 1000)
        data = json.loads(result)
        assert "sections" in data
        print(f"✅ PASS - Content Agent (blog post outline created)")
        test_results.append(("Content", "PASS"))
    except Exception as e:
        print(f"❌ FAIL - Content Agent: {str(e)}")
        test_results.append(("Content", "FAIL"))

    # Test 4: Deploy Agent
    print("\n🚀 Test 4/15: Deploy Agent")
    print("-" * 60)
    try:
        agent = await get_deploy_agent("test-business")
        result = agent.create_deployment_plan("production", "vercel")
        data = json.loads(result)
        assert "steps" in data
        print(f"✅ PASS - Deploy Agent ({len(data['steps'])} deployment steps)")
        test_results.append(("Deploy", "PASS"))
    except Exception as e:
        print(f"❌ FAIL - Deploy Agent: {str(e)}")
        test_results.append(("Deploy", "FAIL"))

    # Test 5: Support Agent
    print("\n💬 Test 5/15: Support Agent")
    print("-" * 60)
    try:
        agent = await get_support_agent("test-business")
        result = agent.create_ticket("How do I reset my password?", "high")
        data = json.loads(result)
        assert "ticket_id" in data
        print(f"✅ PASS - Support Agent (ticket {data['ticket_id']} created)")
        test_results.append(("Support", "PASS"))
    except Exception as e:
        print(f"❌ FAIL - Support Agent: {str(e)}")
        test_results.append(("Support", "FAIL"))

    # Test 6: QA Agent
    print("\n✅ Test 6/15: QA Agent")
    print("-" * 60)
    try:
        agent = await get_qa_agent("test-business")
        result = agent.create_test_plan("User Login", ["unit", "integration"])
        data = json.loads(result)
        assert "test_cases" in data
        print(f"✅ PASS - QA Agent ({len(data['test_cases'])} test cases)")
        test_results.append(("QA", "PASS"))
    except Exception as e:
        print(f"❌ FAIL - QA Agent: {str(e)}")
        test_results.append(("QA", "FAIL"))

    # Test 7: SEO Agent
    print("\n🔍 Test 7/15: SEO Agent")
    print("-" * 60)
    try:
        agent = await get_seo_agent("test-business")
        result = agent.keyword_research("project management", "en")
        data = json.loads(result)
        assert "keywords" in data
        print(f"✅ PASS - SEO Agent ({len(data['keywords'])} keywords found)")
        test_results.append(("SEO", "PASS"))
    except Exception as e:
        print(f"❌ FAIL - SEO Agent: {str(e)}")
        test_results.append(("SEO", "FAIL"))

    # Test 8: Email Agent
    print("\n✉️  Test 8/15: Email Agent")
    print("-" * 60)
    try:
        agent = await get_email_agent("test-business")
        result = agent.create_campaign("Product Launch", ["segment_1"], "Subject Line")
        data = json.loads(result)
        assert "campaign_id" in data
        print(f"✅ PASS - Email Agent (campaign {data['campaign_id']} created)")
        test_results.append(("Email", "PASS"))
    except Exception as e:
        print(f"❌ FAIL - Email Agent: {str(e)}")
        test_results.append(("Email", "FAIL"))

    # Test 9: Legal Agent
    print("\n⚖️  Test 9/15: Legal Agent")
    print("-" * 60)
    try:
        agent = await get_legal_agent("test-business")
        result = agent.generate_document("terms_of_service", "TestApp", "US")
        data = json.loads(result)
        assert "document" in data
        print(f"✅ PASS - Legal Agent ({data['document']['type']} generated)")
        test_results.append(("Legal", "PASS"))
    except Exception as e:
        print(f"❌ FAIL - Legal Agent: {str(e)}")
        test_results.append(("Legal", "FAIL"))

    # Test 10: Security Agent
    print("\n🔒 Test 10/15: Security Agent")
    print("-" * 60)
    try:
        agent = await get_security_agent("test-business")
        result = agent.run_security_scan("https://example.com")
        data = json.loads(result)
        assert "scan_id" in data
        print(f"✅ PASS - Security Agent (scan {data['scan_id']} completed)")
        test_results.append(("Security", "PASS"))
    except Exception as e:
        print(f"❌ FAIL - Security Agent: {str(e)}")
        test_results.append(("Security", "FAIL"))

    # Test 11: Billing Agent
    print("\n💰 Test 11/15: Billing Agent")
    print("-" * 60)
    try:
        agent = await get_billing_agent("test-business")
        result = agent.create_subscription_plan("Pro Plan", 29.99, ["feature1", "feature2"])
        data = json.loads(result)
        assert "plan_id" in data
        print(f"✅ PASS - Billing Agent (plan {data['plan_id']} created)")
        test_results.append(("Billing", "PASS"))
    except Exception as e:
        print(f"❌ FAIL - Billing Agent: {str(e)}")
        test_results.append(("Billing", "FAIL"))

    # Test 12: Analyst Agent
    print("\n📊 Test 12/15: Analyst Agent")
    print("-" * 60)
    try:
        agent = await get_analyst_agent("test-business")
        result = agent.generate_report("monthly", ["signups", "revenue", "churn"])
        data = json.loads(result)
        assert "report_id" in data
        print(f"✅ PASS - Analyst Agent (report {data['report_id']} generated)")
        test_results.append(("Analyst", "PASS"))
    except Exception as e:
        print(f"❌ FAIL - Analyst Agent: {str(e)}")
        test_results.append(("Analyst", "FAIL"))

    # Test 13: Maintenance Agent
    print("\n🔧 Test 13/15: Maintenance Agent")
    print("-" * 60)
    try:
        agent = await get_maintenance_agent("test-business")
        result = agent.run_health_check(["database", "api", "cache"])
        data = json.loads(result)
        assert "health_status" in data
        print(f"✅ PASS - Maintenance Agent (status: {data['health_status']})")
        test_results.append(("Maintenance", "PASS"))
    except Exception as e:
        print(f"❌ FAIL - Maintenance Agent: {str(e)}")
        test_results.append(("Maintenance", "FAIL"))

    # Test 14: Onboarding Agent
    print("\n👋 Test 14/15: Onboarding Agent")
    print("-" * 60)
    try:
        agent = await get_onboarding_agent("test-business")
        result = agent.create_onboarding_flow("new_user", ["welcome", "tutorial", "first_task"])
        data = json.loads(result)
        assert "flow_id" in data
        print(f"✅ PASS - Onboarding Agent (flow {data['flow_id']} created)")
        test_results.append(("Onboarding", "PASS"))
    except Exception as e:
        print(f"❌ FAIL - Onboarding Agent: {str(e)}")
        test_results.append(("Onboarding", "FAIL"))

    # Test 15: Spec Agent
    print("\n📋 Test 15/15: Spec Agent")
    print("-" * 60)
    try:
        agent = await get_spec_agent("test-business")
        result = agent.create_user_story("user login", "As a user, I want to log in", "high")
        data = json.loads(result)
        assert "story_id" in data
        print(f"✅ PASS - Spec Agent (story {data['story_id']} created)")
        test_results.append(("Spec", "PASS"))
    except Exception as e:
        print(f"❌ FAIL - Spec Agent: {str(e)}")
        test_results.append(("Spec", "FAIL"))

    # Summary
    print("\n" + "="*80)
    print("TEST SUMMARY")
    print("="*80)

    passed = sum(1 for _, status in test_results if status == "PASS")
    failed = sum(1 for _, status in test_results if status == "FAIL")

    for agent_name, status in test_results:
        emoji = "✅" if status == "PASS" else "❌"
        print(f"{emoji} {agent_name} Agent: {status}")

    print("\n" + "-"*80)
    print(f"Total: {len(test_results)} agents tested")
    print(f"Passed: {passed} ({int(passed/len(test_results)*100)}%)")
    print(f"Failed: {failed}")

    if failed == 0:
        print("\n🎉 ALL AGENTS PASSED! Migration complete and successful!")
    else:
        print(f"\n⚠️  {failed} agent(s) need attention")

    print("="*80 + "\n")


if __name__ == "__main__":
    asyncio.run(test_all_agents())
