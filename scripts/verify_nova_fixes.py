#!/usr/bin/env python3
"""
Quick Verification Script - Nova's API Fixes (Agents 10-14)

This script demonstrates that all 5 agents work correctly with Nova's fixes.
Can be run independently to verify the fixes.
"""

import asyncio
from datetime import datetime, timezone

from infrastructure.load_env import load_genesis_env
from infrastructure.genesis_discord import get_discord_client, close_discord_client


async def main():
    load_genesis_env()
    discord = get_discord_client()
    code_review_business_id = "nova_code_review"
    try:
        print("\n" + "="*80)
        print(" "*20 + "Verifying Nova's API Fixes (Agents 10-14)" + " "*20)
        print("="*80 + "\n")

        # Agent 10: SupportAgent (sync) - Already correct
        print("Agent 10: SupportAgent (already correct)")
        print("-" * 80)
        from agents.support_agent import SupportAgent

        support_agent = SupportAgent(business_id="verification", enable_memory=False)
        ticket = support_agent.create_ticket(
            user_id="test_user",
            issue_description="Verification test",
            priority="low"
        )
        print(f"✅ Created ticket: {ticket[:50]}...\n")

        # Agent 11: AnalyticsAgent (async) - Fixed parameters
        print("Agent 11: AnalyticsAgent (fixed async + parameters)")
        print("-" * 80)
        from agents.analytics_agent import AnalyticsAgent

        analytics_agent = AnalyticsAgent(business_id="verification", enable_memory=False)
        report = await analytics_agent.generate_report(
            user_id="test_user",
            report_name="Verification Report",
            metric_data={"revenue": [100, 150, 200, 250]},
            period_start=datetime.fromisoformat("2025-11-01T00:00:00+00:00"),
            period_end=datetime.fromisoformat("2025-11-14T00:00:00+00:00")
        )
        print(f"✅ Generated report: {report.report_id if hasattr(report, 'report_id') else 'success'}\n")

        # Agent 12: QAAgent (sync) - Fixed parameter names
        print("Agent 12: QAAgent (fixed parameter names)")
        print("-" * 80)
        from agents.qa_agent import QAAgent

        qa_agent = QAAgent(business_id="verification", enable_memory=False)
        qa_result = qa_agent.run_test_suite(
            test_suite_name="verification_tests",
            environment="staging"
        )
        print(f"✅ Ran test suite: {qa_result[:50]}...\n")

        # Agent 13: CodeReviewAgent (async) - Fixed constructor + method + async
        print("Agent 13: CodeReviewAgent (fixed constructor + method + async)")
        print("-" * 80)
        from agents.code_review_agent import CodeReviewAgent

        review_agent = CodeReviewAgent(enable_token_caching=False)
        try:
            await discord.agent_started(
                code_review_business_id,
                "CodeReviewAgent",
                "Nova API fix review",
            )
            review = await review_agent.review_code_cached(
                code="def verify(): return True",
                file_path="verify.py",
                review_type="comprehensive"
            )
            print(f"✅ Reviewed code: {review['issue_count']} issues found\n")
            await discord.agent_completed(
                code_review_business_id,
                "CodeReviewAgent",
                f"Issues found: {review['issue_count']}",
            )
        except Exception as exc:  # pragma: no cover
            await discord.agent_error(
                code_review_business_id,
                "CodeReviewAgent",
                str(exc)
            )
            raise

        # Agent 14: DocumentationAgent (async) - Fixed business_id + async + parameters
        print("Agent 14: DocumentationAgent (fixed business_id + async + parameters)")
        print("-" * 80)
        from agents.documentation_agent import DocumentationAgent

        doc_agent = DocumentationAgent(business_id="verification", enable_memory=False)
        docs = await doc_agent.generate_documentation(
            topic="Verification API",
            doc_type="api",
            source_code="def verify(): pass",
            specifications="Verification API spec"
        )
        print(f"✅ Generated docs: {docs.get('doc_id', 'success')}\n")

        print("="*80)
        print(" "*20 + "✅ ALL AGENTS VERIFIED SUCCESSFULLY" + " "*20)
        print("="*80)
        print("\nNova's fixes are working correctly!")
        print("All agents executed without errors.\n")
    finally:
        await close_discord_client()


if __name__ == "__main__":
    asyncio.run(main())
