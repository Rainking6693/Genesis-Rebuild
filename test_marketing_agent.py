"""Test the migrated Marketing Agent"""
import asyncio
import json
from agents.marketing_agent import get_marketing_agent


async def test_marketing_agent():
    """Test all marketing agent tools"""
    print("\n" + "="*60)
    print("TESTING MARKETING AGENT (Microsoft Agent Framework)")
    print("="*60 + "\n")

    # Initialize agent
    agent = await get_marketing_agent(business_id="test-business")

    # Test 1: Create Strategy
    print("\n📊 Test 1: Create Marketing Strategy")
    print("-" * 40)
    strategy = agent.create_strategy(
        business_name="TaskMaster Pro",
        target_audience="Busy professionals and small teams",
        budget=5000.0
    )
    strategy_data = json.loads(strategy)
    print(f"✅ Created strategy with {len(strategy_data['channels'])} channels")
    print(f"   Budget: ${strategy_data['budget']}/month")
    print(f"   Top channel: {strategy_data['channels'][0]['name']}")

    # Test 2: Generate Social Content
    print("\n📱 Test 2: Generate Social Content")
    print("-" * 40)
    social = agent.generate_social_content(
        business_name="TaskMaster Pro",
        value_proposition="Simplify your workflow",
        days=7
    )
    social_data = json.loads(social)
    print(f"✅ Generated {social_data['total_posts']} social posts")
    print(f"   Platforms: {social_data['posts'][0]['platforms']}")

    # Test 3: Write Blog Post
    print("\n📝 Test 3: Write Blog Post Outline")
    print("-" * 40)
    blog = agent.write_blog_post(
        topic="Boost Productivity with Task Management",
        keywords=["productivity", "task management", "workflow"],
        word_count=1500
    )
    blog_data = json.loads(blog)
    print(f"✅ Created blog outline: {blog_data['structure']['title']}")
    print(f"   Sections: {len(blog_data['structure']['sections'])}")
    print(f"   SEO Score: {blog_data['seo_score']}")

    # Test 4: Create Email Sequence
    print("\n✉️  Test 4: Create Email Sequence")
    print("-" * 40)
    emails = agent.create_email_sequence(
        sequence_type="onboarding",
        business_name="TaskMaster Pro",
        num_emails=5
    )
    email_data = json.loads(emails)
    print(f"✅ Created {email_data['total_emails']}-email {email_data['sequence_type']} sequence")

    # Test 5: Build Launch Plan
    print("\n🚀 Test 5: Build Launch Plan")
    print("-" * 40)
    launch = agent.build_launch_plan(
        business_name="TaskMaster Pro",
        launch_date="2025-11-01"
    )
    launch_data = json.loads(launch)
    print(f"✅ Created launch plan with {len(launch_data['phases'])} phases")
    print(f"   Launch date: {launch_data['launch_date']}")
    print(f"   Target day 1 signups: {launch_data['success_metrics']['day_1_signups']}")

    print("\n" + "="*60)
    print("ALL MARKETING AGENT TESTS PASSED ✅")
    print("="*60 + "\n")


if __name__ == "__main__":
    asyncio.run(test_marketing_agent())
