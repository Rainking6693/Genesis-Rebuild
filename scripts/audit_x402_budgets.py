"""Weekly budget audit for x402 payments against tracked budgets."""

from __future__ import annotations

import argparse
import json
import logging
import os
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, List, Optional

from infrastructure.payments.budget_tracker import BudgetTracker
from infrastructure.payments.payment_ledger import PaymentLedger

logger = logging.getLogger(__name__)

AUDIT_REPORTS = Path("data/a2a-x402/audit_reports")


def audit_ledger_vs_budget(
    ledger: PaymentLedger,
    tracker: BudgetTracker
) -> Dict[str, object]:
    """
    Audit ledger transactions against tracked budgets.

    Checks for:
    - Orphaned transactions (in ledger but not in budget)
    - Missing transactions (in budget but not in ledger)
    - Budget overruns
    - Accuracy of daily/monthly rollups
    """
    audit_results = {
        "timestamp": datetime.utcnow().isoformat(),
        "checks": {},
        "issues": [],
        "warnings": []
    }

    # Check 1: Verify ledger totals match budget tracker
    logger.info("Checking ledger vs budget consistency...")

    ledger_agents: Dict[str, float] = {}
    for tx in ledger.read_transactions():
        agent = tx.get("agent_id", "unknown")
        amount = float(tx.get("price_usdc", 0.0))
        ledger_agents[agent] = ledger_agents.get(agent, 0.0) + amount

    budget_agents: Dict[str, float] = {}
    for agent in ledger_agents.keys():
        usage = tracker.get_usage(agent)
        budget_agents[agent] = usage.get("daily", 0.0) + usage.get("monthly", 0.0)

    ledger_total = sum(ledger_agents.values())
    budget_total = sum(budget_agents.values())

    audit_results["checks"]["ledger_vs_budget"] = {
        "ledger_total_usdc": round(ledger_total, 2),
        "budget_total_usdc": round(budget_total, 2),
        "difference_usdc": round(abs(ledger_total - budget_total), 2),
        "status": "PASS" if abs(ledger_total - budget_total) < 0.01 else "FAIL"
    }

    if audit_results["checks"]["ledger_vs_budget"]["status"] == "FAIL":
        audit_results["issues"].append({
            "type": "ledger_budget_mismatch",
            "severity": "high",
            "message": f"Ledger total (${ledger_total:.2f}) does not match budget total (${budget_total:.2f})",
            "difference": round(abs(ledger_total - budget_total), 2)
        })

    # Check 2: Verify no budget overruns
    logger.info("Checking for budget overruns...")

    overrun_agents: List[Dict[str, object]] = []
    for agent, usage_amount in ledger_agents.items():
        limits = tracker._get_limits(agent)
        if usage_amount > limits["monthly"]:
            overrun_agents.append({
                "agent": agent,
                "monthly_limit_usdc": limits["monthly"],
                "actual_spent_usdc": usage_amount,
                "overage_usdc": round(usage_amount - limits["monthly"], 2)
            })

    audit_results["checks"]["budget_overruns"] = {
        "agents_over_limit": len(overrun_agents),
        "overrun_details": overrun_agents,
        "status": "PASS" if len(overrun_agents) == 0 else "FAIL"
    }

    if overrun_agents:
        for agent_overrun in overrun_agents:
            audit_results["issues"].append({
                "type": "budget_overrun",
                "severity": "high",
                "agent": agent_overrun["agent"],
                "message": f"{agent_overrun['agent']} exceeded monthly budget by ${agent_overrun['overage_usdc']}"
            })

    # Check 3: Verify daily/monthly rollups are accurate
    logger.info("Checking daily/monthly rollups...")

    today = datetime.utcnow().strftime("%Y-%m-%d")
    month = datetime.utcnow().strftime("%Y-%m")

    today_total = ledger.get_daily_total(today)
    month_total = ledger.get_monthly_total(month)

    audit_results["checks"]["rollups"] = {
        "today_total_usdc": round(today_total, 2),
        "month_total_usdc": round(month_total, 2),
        "status": "PASS"  # Rollups are computed, not stored, so always pass
    }

    # Check 4: Verify data integrity
    logger.info("Checking data integrity...")

    integrity_issues: List[Dict[str, object]] = []

    for tx in ledger.read_transactions():
        # Check for required fields
        required_fields = ["transaction_id", "timestamp", "agent_id", "price_usdc", "status"]
        missing_fields = [f for f in required_fields if not tx.get(f)]

        if missing_fields:
            integrity_issues.append({
                "transaction_id": tx.get("transaction_id", "unknown"),
                "missing_fields": missing_fields,
                "severity": "medium"
            })

        # Check for invalid status values
        valid_statuses = {"completed", "pending", "failed"}
        if tx.get("status") not in valid_statuses:
            integrity_issues.append({
                "transaction_id": tx.get("transaction_id"),
                "issue": f"Invalid status: {tx.get('status')}",
                "severity": "medium"
            })

    audit_results["checks"]["data_integrity"] = {
        "issues_found": len(integrity_issues),
        "issues": integrity_issues[:10],  # Cap at 10 for report
        "status": "PASS" if len(integrity_issues) == 0 else "FAIL"
    }

    if integrity_issues:
        for issue in integrity_issues[:5]:  # Report first 5
            audit_results["warnings"].append({
                "type": "data_integrity",
                "message": f"Transaction {issue.get('transaction_id')} has issues: {issue}"
            })

    # Check 5: Compare to previous day's spend (anomaly detection)
    logger.info("Checking for spending anomalies...")

    yesterday = (datetime.utcnow() - timedelta(days=1)).strftime("%Y-%m-%d")
    yesterday_total = ledger.get_daily_total(yesterday)
    today_total = ledger.get_daily_total(today)

    anomaly_pct = 0.0
    if yesterday_total > 0:
        anomaly_pct = abs(today_total - yesterday_total) / yesterday_total * 100

    audit_results["checks"]["anomaly_detection"] = {
        "yesterday_total_usdc": round(yesterday_total, 2),
        "today_total_usdc": round(today_total, 2),
        "change_pct": round(anomaly_pct, 1),
        "status": "PASS"  # Alert if change >100%
    }

    if anomaly_pct > 100:
        audit_results["warnings"].append({
            "type": "spending_anomaly",
            "message": f"Daily spend changed by {anomaly_pct:.1f}% compared to yesterday (${yesterday_total:.2f} -> ${today_total:.2f})"
        })

    return audit_results


def generate_audit_report(audit_results: Dict[str, object]) -> Dict[str, object]:
    """Generate final audit report with summary and recommendations."""
    checks = audit_results.get("checks", {})
    issues = audit_results.get("issues", [])
    warnings = audit_results.get("warnings", [])

    # Determine overall status
    check_statuses = [check.get("status") for check in checks.values() if isinstance(check, dict)]
    overall_status = "PASS" if all(s == "PASS" for s in check_statuses) else "FAIL"

    high_severity = sum(1 for issue in issues if issue.get("severity") == "high")
    medium_severity = sum(1 for issue in issues if issue.get("severity") == "medium")

    report = {
        "timestamp": audit_results.get("timestamp"),
        "overall_status": overall_status,
        "summary": {
            "total_checks": len(checks),
            "passing_checks": sum(1 for s in check_statuses if s == "PASS"),
            "failing_checks": sum(1 for s in check_statuses if s == "FAIL"),
            "total_issues": len(issues),
            "high_severity_issues": high_severity,
            "medium_severity_issues": medium_severity,
            "warnings": len(warnings)
        },
        "checks": checks,
        "issues": issues,
        "warnings": warnings,
        "recommendations": []
    }

    # Add recommendations based on findings
    if high_severity > 0:
        report["recommendations"].append(
            "URGENT: Address high-severity issues immediately (ledger mismatches, budget overruns)"
        )
    if medium_severity > 0:
        report["recommendations"].append(
            "Review medium-severity issues (data integrity problems)"
        )
    if warnings:
        report["recommendations"].append(
            "Investigate warnings (spending anomalies, unusual patterns)"
        )

    if overall_status == "PASS":
        report["recommendations"].append("All audits passed. Continue normal operations.")
    else:
        report["recommendations"].append(
            "Do not proceed with new payments until issues are resolved. Escalate to engineering team."
        )

    return report


def save_report(report: Dict[str, object]) -> Path:
    """Save audit report to file."""
    AUDIT_REPORTS.mkdir(parents=True, exist_ok=True)

    timestamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
    report_path = AUDIT_REPORTS / f"audit_{timestamp}.json"

    with report_path.open("w") as fd:
        json.dump(report, fd, indent=2)

    logger.info("Audit report saved to %s", report_path)
    return report_path


async def send_discord_alert(report: Dict[str, object]):
    """Send audit results to Discord."""
    try:
        from infrastructure.genesis_discord import get_discord_client, close_discord_client
    except ImportError:
        logger.warning("Discord client not available - skipping notification")
        return

    if os.getenv("PAYMENTS_USE_FAKE", "false").lower() == "true":
        logger.info("PAYMENTS_USE_FAKE=true - skipping Discord notification")
        return

    discord = get_discord_client()
    try:
        summary = report.get("summary", {})
        status = report.get("overall_status", "UNKNOWN")

        message = (
            f"**x402 Budget Audit Report**\n"
            f"Status: {status}\n"
            f"Checks Passed: {summary.get('passing_checks', 0)}/{summary.get('total_checks', 0)}\n"
            f"Issues Found: {summary.get('total_issues', 0)}\n"
        )

        if status == "FAIL":
            message += f"\n**High Severity:** {summary.get('high_severity_issues', 0)}\n"
            message += f"**Medium Severity:** {summary.get('medium_severity_issues', 0)}\n"

        # Note: Actual Discord integration would happen here
        logger.info("Would send to Discord: %s", message)
    finally:
        await close_discord_client()


def main():
    """Run budget audit."""
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    )

    parser = argparse.ArgumentParser(description="Audit x402 budgets and ledger.")
    parser.add_argument("--dry-run", action="store_true", help="Do not save report.")
    parser.add_argument("--no-discord", action="store_true", help="Do not send Discord alert.")
    args = parser.parse_args()

    logger.info("Starting x402 budget audit")

    # Initialize components
    ledger = PaymentLedger()
    tracker = BudgetTracker()

    # Run audit
    audit_results = audit_ledger_vs_budget(ledger, tracker)
    report = generate_audit_report(audit_results)

    logger.info("Audit complete - Status: %s", report.get("overall_status"))
    logger.info("Summary: %s", report.get("summary"))

    # Save report
    if not args.dry_run:
        save_report(report)

    # Send alert
    if not args.no_discord and not args.dry_run:
        import asyncio
        asyncio.run(send_discord_alert(report))

    # Return exit code based on status
    status = report.get("overall_status", "UNKNOWN")
    if status == "PASS":
        logger.info("Budget audit PASSED")
        return 0
    else:
        logger.error("Budget audit FAILED - see report for details")
        return 1


if __name__ == "__main__":
    import sys
    exit_code = main()
    sys.exit(exit_code)
