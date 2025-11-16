"""Blockchain reconciliation for x402 transactions against Base network."""

from __future__ import annotations

import argparse
import json
import logging
import os
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional

logger = logging.getLogger(__name__)

TRANSACTIONS_LOG = Path("data/a2a-x402/transactions/transactions.jsonl")
RECONCILIATION_REPORT = Path("data/a2a-x402/reconciliation_reports")


def load_transactions() -> List[Dict[str, object]]:
    """Load all transactions from ledger."""
    transactions: List[Dict[str, object]] = []
    if not TRANSACTIONS_LOG.exists():
        logger.warning("Transactions log not found: %s", TRANSACTIONS_LOG)
        return transactions

    with TRANSACTIONS_LOG.open() as fd:
        for line in fd:
            try:
                entry = json.loads(line.strip())
                transactions.append(entry)
            except json.JSONDecodeError as e:
                logger.warning("Failed to parse transaction line: %s", e)
                continue

    logger.info("Loaded %d transactions from ledger", len(transactions))
    return transactions


def verify_blockchain_tx(tx_hash: str) -> Dict[str, object]:
    """
    Verify a transaction on Base blockchain.

    In production, this would query a Base RPC node.
    For now, returns a simulated response structure.
    """
    # TODO: Implement real Base RPC query
    # Example implementation:
    # web3 = Web3(Web3.HTTPProvider('https://base.llamarpc.com'))
    # receipt = web3.eth.get_transaction_receipt(tx_hash)

    # For testing/demo purposes, mark as unverified
    return {
        "tx_hash": tx_hash,
        "status": "unverified",
        "message": "Blockchain verification not yet implemented - would query Base RPC endpoint"
    }


def reconcile_transaction(
    local_tx: Dict[str, object],
    blockchain_info: Dict[str, object]
) -> Optional[Dict[str, object]]:
    """
    Reconcile a local transaction against blockchain data.

    Returns a discrepancy record if found, None if reconciled.
    """
    discrepancy = None
    tx_hash = local_tx.get("blockchain_tx_hash", "")

    if not tx_hash:
        discrepancy = {
            "transaction_id": local_tx.get("transaction_id"),
            "type": "missing_blockchain_hash",
            "local_tx": local_tx,
            "severity": "medium"
        }
    elif blockchain_info.get("status") == "unverified":
        # Can't verify yet - note this
        logger.debug(
            "Transaction %s unable to verify on blockchain (status: %s)",
            tx_hash,
            blockchain_info.get("message")
        )

    # Check for amount discrepancies (>5%)
    local_amount = float(local_tx.get("price_usdc", 0.0))
    blockchain_amount = float(blockchain_info.get("amount", local_amount))

    if local_amount > 0 and blockchain_amount > 0:
        diff_pct = abs(blockchain_amount - local_amount) / local_amount * 100
        if diff_pct > 5.0:
            discrepancy = {
                "transaction_id": local_tx.get("transaction_id"),
                "type": "amount_mismatch",
                "local_amount_usdc": local_amount,
                "blockchain_amount": blockchain_amount,
                "difference_pct": diff_pct,
                "severity": "high"
            }

    return discrepancy


def generate_reconciliation_report(
    transactions: List[Dict[str, object]],
    discrepancies: List[Dict[str, object]]
) -> Dict[str, object]:
    """Generate a detailed reconciliation report."""
    total_transactions = len(transactions)
    total_amount = sum(float(tx.get("price_usdc", 0.0)) for tx in transactions)
    high_severity = sum(1 for d in discrepancies if d.get("severity") == "high")
    medium_severity = sum(1 for d in discrepancies if d.get("severity") == "medium")

    report = {
        "timestamp": datetime.utcnow().isoformat(),
        "summary": {
            "total_transactions": total_transactions,
            "total_amount_usdc": round(total_amount, 2),
            "discrepancies_found": len(discrepancies),
            "high_severity_count": high_severity,
            "medium_severity_count": medium_severity,
            "reconciliation_status": "PASS" if len(discrepancies) == 0 else "FAIL"
        },
        "discrepancies": discrepancies,
        "recommendations": []
    }

    # Add recommendations
    if high_severity > 0:
        report["recommendations"].append(
            "URGENT: Review high-severity discrepancies and investigate blockchain transactions"
        )
    if medium_severity > 0:
        report["recommendations"].append(
            "Review medium-severity discrepancies for missing blockchain hashes"
        )
    if total_amount > 500:
        report["recommendations"].append(
            f"Large total spend detected (${total_amount:.2f}). Verify budget allocations."
        )

    return report


def save_report(report: Dict[str, object]) -> Path:
    """Save reconciliation report to file."""
    RECONCILIATION_REPORT.mkdir(parents=True, exist_ok=True)

    timestamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
    report_path = RECONCILIATION_REPORT / f"reconciliation_{timestamp}.json"

    with report_path.open("w") as fd:
        json.dump(report, fd, indent=2)

    logger.info("Reconciliation report saved to %s", report_path)
    return report_path


async def send_discord_alert(report: Dict[str, object]):
    """Send reconciliation results to Discord."""
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
        status = summary.get("reconciliation_status", "UNKNOWN")

        message = (
            f"**x402 Reconciliation Report**\n"
            f"Status: {status}\n"
            f"Transactions: {summary.get('total_transactions', 0)}\n"
            f"Total Spend: ${summary.get('total_amount_usdc', 0):.2f}\n"
            f"Discrepancies: {summary.get('discrepancies_found', 0)}\n"
        )

        if status == "FAIL":
            message += f"\n**High Severity:** {summary.get('high_severity_count', 0)}\n"
            message += f"**Medium Severity:** {summary.get('medium_severity_count', 0)}\n"

        # Note: Actual Discord integration would happen here
        logger.info("Would send to Discord: %s", message)
    finally:
        await close_discord_client()


def main():
    """Run ledger reconciliation."""
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    )

    parser = argparse.ArgumentParser(description="Reconcile x402 ledger against blockchain.")
    parser.add_argument("--dry-run", action="store_true", help="Do not save report.")
    parser.add_argument("--no-discord", action="store_true", help="Do not send Discord alert.")
    args = parser.parse_args()

    logger.info("Starting x402 blockchain reconciliation")

    # Load transactions
    transactions = load_transactions()
    if not transactions:
        logger.warning("No transactions to reconcile")
        return

    # Reconcile each transaction
    discrepancies: List[Dict[str, object]] = []
    for tx in transactions:
        tx_hash = tx.get("blockchain_tx_hash", "")
        blockchain_info = verify_blockchain_tx(tx_hash)

        discrepancy = reconcile_transaction(tx, blockchain_info)
        if discrepancy:
            discrepancies.append(discrepancy)

    # Generate report
    report = generate_reconciliation_report(transactions, discrepancies)
    logger.info("Reconciliation summary: %s", report.get("summary"))

    # Save report
    if not args.dry_run:
        save_report(report)

    # Send alert
    if not args.no_discord and not args.dry_run:
        import asyncio
        asyncio.run(send_discord_alert(report))

    # Return exit code based on status
    status = report.get("summary", {}).get("reconciliation_status", "UNKNOWN")
    if status == "PASS":
        logger.info("Reconciliation PASSED")
        return 0
    else:
        logger.error("Reconciliation FAILED - see report for details")
        return 1


if __name__ == "__main__":
    import sys
    exit_code = main()
    sys.exit(exit_code)
