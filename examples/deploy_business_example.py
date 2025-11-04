"""
Business Execution Engine - Example Usage

This script demonstrates how to use the Business Execution Engine
to deploy a complete business to Vercel.

Prerequisites:
- Vercel account with API token
- GitHub account with personal access token
- Set environment variables in .env file

Usage:
    python examples/deploy_business_example.py
"""

import asyncio
import os
import sys
from pathlib import Path

# Add project root to path
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

from infrastructure.execution import (
    BusinessExecutor,
    BusinessExecutionConfig,
    DeploymentValidator
)


async def example_basic_deployment():
    """Example: Basic business deployment."""
    print("=" * 60)
    print("EXAMPLE 1: Basic Business Deployment")
    print("=" * 60)

    # Configuration
    config = BusinessExecutionConfig(
        vercel_token=os.getenv("VERCEL_TOKEN", "test_token"),
        vercel_team_id=os.getenv("VERCEL_TEAM_ID"),
        github_token=os.getenv("GITHUB_TOKEN", "test_token"),
        mongodb_uri=os.getenv("MONGODB_URI", "mongodb://localhost:27017"),
        github_org=os.getenv("GITHUB_ORG"),
    )

    # Create executor
    executor = BusinessExecutor(config)

    # Business plan (from Genesis Meta-Agent)
    business_plan = {
        "name": "AI Writing Assistant",
        "description": "AI-powered writing tool for content creators",
        "type": "saas_tool",
        "tech_stack": ["Next.js", "OpenAI", "Stripe"],
        "mvp_features": [
            "Text input and editing",
            "AI-powered suggestions",
            "Export to PDF",
            "Subscription billing"
        ]
    }

    print("\nBusiness Plan:")
    print(f"  Name: {business_plan['name']}")
    print(f"  Description: {business_plan['description']}")
    print(f"  Type: {business_plan['type']}")
    print(f"  Tech Stack: {', '.join(business_plan['tech_stack'])}")
    print(f"  Features: {len(business_plan['mvp_features'])}")

    # Execute deployment (would be real with valid credentials)
    print("\n[INFO] This is a demonstration. Set VERCEL_TOKEN and GITHUB_TOKEN for real deployment.")
    print("[INFO] Deployment would proceed as follows:")
    print("  1. Generate Next.js 14 app code")
    print("  2. Create GitHub repository")
    print("  3. Push code to GitHub")
    print("  4. Create Vercel project")
    print("  5. Deploy to Vercel")
    print("  6. Validate deployment")

    # Show what would be generated
    code_files = executor._generate_minimal_nextjs_app(business_plan)
    print(f"\n[INFO] Generated {len(code_files)} code files:")
    for filename in sorted(code_files.keys()):
        size = len(code_files[filename])
        print(f"  - {filename} ({size} bytes)")

    print("\n[SUCCESS] Deployment simulation complete!")


async def example_validation_only():
    """Example: Validate existing deployment."""
    print("\n" + "=" * 60)
    print("EXAMPLE 2: Deployment Validation")
    print("=" * 60)

    validator = DeploymentValidator(timeout=10.0)

    # Validate a live website (example.com)
    deployment_url = "https://vercel.com"  # Using Vercel's own site as example

    print(f"\nValidating deployment: {deployment_url}")
    print("Running checks...")

    try:
        report = await validator.validate_full_deployment(
            deployment_url=deployment_url,
            business_type="general",
            max_response_time=3.0
        )

        print(f"\n[RESULTS] Validation Report:")
        print(f"  URL: {report.deployment_url}")
        print(f"  Success: {report.success}")
        print(f"  Passed Checks: {report.passed_checks}/{report.total_checks}")
        print(f"  Pass Rate: {report.pass_rate:.1f}%")

        print(f"\n[DETAILS] Individual Checks:")
        for result in report.results:
            status = "✓" if result.passed else "✗"
            print(f"  {status} {result.check}: {result.details}")

        if report.success:
            print(f"\n[SUCCESS] All validation checks passed!")
        else:
            print(f"\n[WARNING] Some validation checks failed")

    except Exception as e:
        print(f"\n[ERROR] Validation failed: {e}")


async def example_custom_code():
    """Example: Deploy with custom code."""
    print("\n" + "=" * 60)
    print("EXAMPLE 3: Deployment with Custom Code")
    print("=" * 60)

    config = BusinessExecutionConfig(
        vercel_token=os.getenv("VERCEL_TOKEN", "test_token"),
        vercel_team_id=os.getenv("VERCEL_TEAM_ID"),
        github_token=os.getenv("GITHUB_TOKEN", "test_token"),
        mongodb_uri=os.getenv("MONGODB_URI", "mongodb://localhost:27017"),
    )

    executor = BusinessExecutor(config)

    # Custom code files (minimal example)
    custom_code = {
        "package.json": """{
  "name": "custom-app",
  "version": "1.0.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "14.0.0",
    "react": "^18",
    "react-dom": "^18"
  }
}""",
        "src/app/page.tsx": """export default function Home() {
  return (
    <main>
      <h1>Custom Next.js App</h1>
      <p>Built with Genesis Business Execution Engine</p>
    </main>
  )
}""",
        "src/app/layout.tsx": """export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}""",
    }

    business_plan = {
        "name": "Custom Business App",
        "description": "A custom Next.js application",
        "type": "custom",
        "tech_stack": ["Next.js"],
        "mvp_features": ["Custom UI"]
    }

    print("\nCustom Code Files:")
    for filename in custom_code.keys():
        print(f"  - {filename}")

    print("\n[INFO] This is a demonstration. Set credentials for real deployment.")
    print("[INFO] Deployment would use provided custom code instead of generated code.")


async def main():
    """Run all examples."""
    print("\n" + "=" * 60)
    print("Business Execution Engine - Usage Examples")
    print("=" * 60)

    # Check for credentials
    has_vercel = bool(os.getenv("VERCEL_TOKEN"))
    has_github = bool(os.getenv("GITHUB_TOKEN"))

    print(f"\nCredentials Status:")
    print(f"  Vercel Token: {'✓ Set' if has_vercel else '✗ Not set'}")
    print(f"  GitHub Token: {'✓ Set' if has_github else '✗ Not set'}")

    if not has_vercel or not has_github:
        print(f"\n[NOTE] Set VERCEL_TOKEN and GITHUB_TOKEN in .env for real deployments")
        print(f"[NOTE] Examples will run in demonstration mode")

    # Run examples
    await example_basic_deployment()
    await example_validation_only()
    await example_custom_code()

    print("\n" + "=" * 60)
    print("All examples complete!")
    print("=" * 60)


if __name__ == "__main__":
    asyncio.run(main())
