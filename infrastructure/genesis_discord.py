"""
Discord integration helper for Genesis agents.

Implements the notification surface described in Discord_integrationPlan.md
with rich embeds, emoji/color semantics, and channel-specific routing.
"""

from __future__ import annotations

import asyncio
import logging
import os
from datetime import datetime, timezone
from typing import Any, Dict, Optional, List

import aiohttp

logger = logging.getLogger(__name__)

COLOR_INFO = 0x3498DB
COLOR_PROGRESS = 0xF39C12
COLOR_SUCCESS = 0x2ECC71
COLOR_ERROR = 0xE74C3C
COLOR_ANALYTICS = 0x9B59B6
COLOR_DEPLOY = 0x2ECC71
COLOR_PAYMENT = 0x38BDF8
COLOR_DEFAULT = 0x95A5A6


class GenesisDiscord:
    """Webhook-oriented Discord notification client."""

    def __init__(
        self,
        session: Optional[aiohttp.ClientSession] = None,
        notification_level: Optional[int] = None,
    ):
        self.webhook_dashboard = os.getenv("DISCORD_WEBHOOK_DASHBOARD")
        self.webhook_commands = os.getenv("DISCORD_WEBHOOK_COMMANDS")
        self.webhook_alerts = os.getenv("DISCORD_WEBHOOK_ALERTS")
        self.webhook_deployments = os.getenv("DISCORD_WEBHOOK_DEPLOYMENTS")
        self.webhook_metrics = os.getenv("DISCORD_WEBHOOK_METRICS")
        self.webhook_payments = os.getenv("DISCORD_WEBHOOK_PAYMENTS")
        self.webhook_revenue = os.getenv("DISCORD_WEBHOOK_REVENUE")
        self.webhook_errors = os.getenv("DISCORD_WEBHOOK_ERRORS")

        self._session: Optional[aiohttp.ClientSession] = session
        self._owns_session = session is None
        self._notification_level = notification_level or int(os.getenv("DISCORD_NOTIFICATION_LEVEL", "3"))

    async def __aenter__(self) -> "GenesisDiscord":
        await self._ensure_session()
        return self

    async def __aexit__(self, exc_type, exc, tb) -> None:
        await self.close()

    async def close(self) -> None:
        """Close the client session if we created it."""
        if self._session and self._owns_session:
            await self._session.close()
            self._session = None

    async def genesis_started(self) -> None:
        embed = self._build_embed(
            title="🚀 Genesis Agent System Started",
            description="All Genesis agents initialized and ready.",
            color=COLOR_INFO,
            footer="Genesis Meta Agent",
        )
        await self._send_webhook(self.webhook_dashboard, embed, level=2)

    async def genesis_shutdown(self) -> None:
        embed = self._build_embed(
            title="⛔ Genesis Agent System Shutdown",
            description="System going offline.",
            color=COLOR_ERROR,
        )
        await self._send_webhook(self.webhook_dashboard, embed, level=2)

    async def business_build_started(self, business_id: str, business_name: str, idea: str) -> None:
        # DISABLED: Level 3 verbose notification - too high volume for production
        # embed = self._build_embed(
        #     title=f"🏗️ Build Started: {business_name}",
        #     description=f"**Business ID:** {business_id}\n**Idea:** {idea}",
        #     color=COLOR_PROGRESS,
        #     footer="Genesis Meta Agent",
        # )
        # await self._send_webhook(self.webhook_dashboard, embed, level=3)
        pass

    async def business_build_completed(self, business_id: str, url: str, metrics: Dict[str, Any]) -> None:
        quality = metrics.get("quality_score", "n/a")
        build_time = metrics.get("build_time", "n/a")
        name = metrics.get("name", business_id)
        embed = self._build_embed(
            title=f"✅ Build Complete: {name}",
            description=f"**Live URL:** {url}\n**Quality Score:** {quality}\n**Build Time:** {build_time}",
            color=COLOR_SUCCESS,
        )
        await self._send_webhook(self.webhook_dashboard, embed, level=3)
        await self._send_webhook(self.webhook_deployments, embed, level=2)

    async def agent_started(self, business_id: str, agent_name: str, task: str) -> None:
        # DISABLED: Level 3 verbose notification - too high volume for production
        # embed = self._build_embed(
        #     title=f"🤖 {agent_name} Started",
        #     description=f"**Task:** {task}",
        #     color=COLOR_INFO,
        #     footer=f"Business: {business_id}",
        # )
        # await self._send_webhook(self.webhook_dashboard, embed, level=3)
        pass

    async def agent_progress(self, business_id: str, agent_name: str, message: str) -> None:
        # DISABLED: Level 3 verbose notification - too high volume for production
        # embed = self._build_embed(
        #     title=f"📝 {agent_name} Progress",
        #     description=message,
        #     color=COLOR_PROGRESS,
        #     footer=f"Business: {business_id}",
        # )
        # await self._send_webhook(self.webhook_dashboard, embed, level=3)
        pass

    async def agent_completed(self, business_id: str, agent_name: str, result: str) -> None:
        # DISABLED: Level 3 verbose notification - too high volume for production
        # embed = self._build_embed(
        #     title=f"✅ {agent_name} Complete",
        #     description=f"**Result:** {result}",
        #     color=COLOR_SUCCESS,
        #     footer=f"Business: {business_id}",
        # )
        # await self._send_webhook(self.webhook_dashboard, embed, level=3)
        pass

    async def agent_error(self, business_id: str, agent_name: str, error_message: str) -> None:
        embed = self._build_embed(
            title=f"❌ {agent_name} Error",
            description=f"**Business:** {business_id}\n**Error:** {error_message}",
            color=COLOR_ERROR,
        )
        await self._send_webhook(self.webhook_errors, embed, level=1)
        await self._send_webhook(self.webhook_alerts, embed, level=1)

    async def deployment_success(self, business_name: str, url: str, build_metrics: Dict[str, Any]) -> None:
        embed = self._build_embed(
            title=f"🌐 {business_name} Deployed",
            description=(
                f"**Live at:** {url}\n"
                f"**Build time:** {build_metrics.get('build_time', 'n/a')}\n"
                f"**Quality score:** {build_metrics.get('quality_score', 'n/a')}"
            ),
            color=COLOR_DEPLOY,
            footer="Deploy Agent",
        )
        await self._send_webhook(self.webhook_deployments, embed, level=2)

    async def deployment_failed(self, business_name: str, error: str) -> None:
        embed = self._build_embed(
            title=f"❌ {business_name} Deployment Failed",
            description=f"**Error:** {error}",
            color=COLOR_ERROR,
        )
        await self._send_webhook(self.webhook_errors, embed, level=1)
        await self._send_webhook(self.webhook_alerts, embed, level=1)

    async def payment_received(self, business_name: str, amount: float, customer_email: str) -> None:
        embed = self._build_embed(
            title=f"💰 Payment Received: ${amount:.2f}",
            description=f"**Business:** {business_name}\n**Customer:** {customer_email}",
            color=COLOR_SUCCESS,
            footer="Stripe Integration",
        )
        await self._send_webhook(self.webhook_revenue, embed, level=2)

    async def payment_business_summary(self, summary: Dict[str, Any]) -> None:
        vendor_lines = "\n".join(
            f"{vendor}: ${amount:.2f}"
            for vendor, amount in summary.get("vendor_breakdown", {}).items()
        ) or "No vendor data"
        agent_lines = "\n".join(
            f"{agent}: ${amount:.2f}"
            for agent, amount in summary.get("agent_breakdown", {}).items()
        ) or "No agent data"
        description = (
            f"**Business:** {summary.get('business_name')} ({summary.get('business_id')})\n"
            f"**Total Spent:** ${summary.get('total_spent', 0.0):.2f}\n"
            f"**Projected Revenue:** ${summary.get('projected_revenue', 0):.2f}\n"
            f"**Spend/Revenue Ratio:** {summary.get('spend_to_revenue_ratio', 'n/a')}\n"
            f"**Approved Intents:** {summary.get('approved_intents', 0)}\n"
            f"**Denied Intents:** {summary.get('denied_intents', 0)}"
        )
        fields = [
            {"name": "Vendor Breakdown", "value": vendor_lines, "inline": False},
            {"name": "Agent Breakdown", "value": agent_lines, "inline": False},
        ]
        embed = self._build_embed(
            title="💳 Payments Spend Summary",
            description=description,
            color=COLOR_ANALYTICS,
            fields=fields,
            footer="Genesis Meta Agent",
        )
        await self._send_webhook(self.webhook_dashboard, embed, level=2)

    async def payment_made(
        self,
        agent_name: str,
        amount: float,
        resource: str,
        transaction_hash: Optional[str] = None,
    ) -> None:
        description = (
            f"**Agent:** {agent_name}\n"
            f"**Amount:** ${amount:.4f}\n"
            f"**Resource:** {resource}\n"
        )
        if transaction_hash:
            short_tx = transaction_hash[:12]
            description += f"**Tx:** `{short_tx}...`\n"
        embed = self._build_embed(
            title=f"💳 Payment: {agent_name}",
            description=description,
            color=COLOR_PAYMENT,
            footer="Payments Ledger",
        )
        await self._send_webhook(self.webhook_payments or self.webhook_metrics, embed, level=2)

    async def payment_budget_warning(self, agent_name: str, percent_used: float) -> None:
        embed = self._build_embed(
            title=f"⚠️ Budget Warning: {agent_name}",
            description=(
                f"**Agent:** {agent_name}\n"
                f"**Budget Used:** {percent_used:.0f}%\n"
                f"**Action:** Review spending or refill wallet"
            ),
            color=COLOR_PROGRESS,
            footer="Budget Guard",
        )
        await self._send_webhook(self.webhook_alerts, embed, level=2)

    async def wallet_low_balance(self, agent_name: str, balance: float) -> None:
        embed = self._build_embed(
            title=f"🪙 Low Wallet Balance: {agent_name}",
            description=(
                f"**Balance:** ${balance:.2f} USDC\n"
                f"**Action:** Request a refill from treasury"
            ),
            color=COLOR_ERROR,
            footer="Wallet Monitor",
        )
        await self._send_webhook(self.webhook_alerts, embed, level=1)

    async def stale_payment_alert(self, pending_count: int) -> None:
        embed = self._build_embed(
            title="⏱️ Stale Payments",
            description=(
                f"**Pending authorizations:** {pending_count}\n"
                "Review the pending authorizations and capture or cancel them."
            ),
            color=COLOR_ERROR,
            footer="Ledger Monitor",
        )
        await self._send_webhook(self.webhook_alerts, embed, level=1)

    async def daily_report(self, statistics: Dict[str, Any]) -> None:
        embed = self._build_embed(
            title="📊 Daily Report",
            description=self._format_report_body(statistics),
            color=COLOR_ANALYTICS,
        )
        await self._send_webhook(self.webhook_metrics, embed, level=2)

    async def weekly_summary(self, statistics: Dict[str, Any]) -> None:
        embed = self._build_embed(
            title="📈 Weekly Summary",
            description=self._format_report_body(statistics),
            color=COLOR_ANALYTICS,
        )
        await self._send_webhook(self.webhook_metrics, embed, level=2)

    async def smoke_test(
        self,
        note: str = "Sanitized smoke test message",
        channels: Optional[List[str]] = None,
    ) -> Dict[str, bool]:
        """Send a short sanitized message to every configured webhook."""
        results: Dict[str, bool] = {}
        requested = {channel.lower() for channel in channels} if channels else None
        for channel, webhook in self._channel_map().items():
            if requested and channel not in requested:
                continue
            if not webhook:
                results[channel] = False
                continue
            embed = self._build_embed(
                title=f"🧪 Smoke Test · {channel}",
                description=note,
                color=COLOR_INFO,
                footer="Genesis Smoke Tester",
            )
            results[channel] = await self._send_webhook(webhook, embed, level=1)
        return results

    async def agent_lifecycle(
        self,
        agent_name: str,
        status: str,
        operation: str = "unknown",
        duration_ms: float = 0.0,
        error: Optional[str] = None,
    ) -> None:
        """Unified method for agent lifecycle notifications (started/completed/error).

        Args:
            agent_name: Name of the agent (e.g., "QAAgent", "DocumentationAgent")
            status: One of "started", "completed", "error"
            operation: Description of operation being performed
            duration_ms: Duration in milliseconds (for completed status)
            error: Error message (for error status)
        """
        status_lower = status.lower()

        if status_lower == "started":
            title = f"🚀 {agent_name} Started"
            color = COLOR_PROGRESS
            description = f"**Operation:** {operation}"
        elif status_lower == "completed":
            title = f"✅ {agent_name} Completed"
            color = COLOR_SUCCESS
            description = f"**Operation:** {operation}\n**Duration:** {duration_ms:.0f}ms"
        elif status_lower == "error":
            title = f"❌ {agent_name} Error"
            color = COLOR_ERROR
            description = f"**Operation:** {operation}\n**Error:** {error or 'Unknown'}"
        else:
            logger.warning("Unknown agent lifecycle status: %s", status)
            return

        embed = self._build_embed(
            title=title,
            description=description,
            color=color,
            footer=f"Agent: {agent_name}",
        )
        await self._send_webhook(self.webhook_dashboard, embed, level=2)

    async def deployment_complete(
        self,
        metadata: Dict[str, Any],
    ) -> None:
        """Notify deployment completion. Mirrors deployment_success() for consistency with documentation.

        Args:
            metadata: Dict containing:
                - name: Business name
                - url: Live URL
                - quality_score: Quality score (optional)
                - build_time: Build duration (optional)
        """
        name = metadata.get("name", "Unknown")
        url = metadata.get("url", "")
        quality_score = metadata.get("quality_score", "n/a")
        build_time = metadata.get("build_time", "n/a")

        description = f"**Live at:** {url}\n"
        if quality_score != "n/a":
            description += f"**Quality Score:** {quality_score}/100\n"
        description += f"**Build Time:** {build_time}"

        embed = self._build_embed(
            title=f"🚀 {name} Deployed",
            description=description,
            color=COLOR_DEPLOY,
            footer="Deploy Agent",
        )
        await self._send_webhook(self.webhook_deployments, embed, level=2)

    async def billing_event(
        self,
        metadata: Dict[str, Any],
    ) -> None:
        """Notify billing/revenue events with detailed financial metrics.

        Args:
            metadata: Dict containing financial event data:
                - action: Description of billing action
                - total_revenue: Total revenue (optional)
                - transaction_count: Number of transactions (optional)
                - avg_transaction_value: Average transaction value (optional)
        """
        action = metadata.get("action", "Transaction processed")

        fields: List[Dict[str, Any]] = []

        if "total_revenue" in metadata:
            fields.append({
                "name": "Total Revenue",
                "value": f"${metadata['total_revenue']:,.2f}",
                "inline": True,
            })

        if "transaction_count" in metadata:
            fields.append({
                "name": "Transactions",
                "value": str(metadata["transaction_count"]),
                "inline": True,
            })

        if "avg_transaction_value" in metadata:
            fields.append({
                "name": "Avg Transaction",
                "value": f"${metadata['avg_transaction_value']:.2f}",
                "inline": True,
            })

        if "mrr" in metadata:
            fields.append({
                "name": "Monthly Recurring",
                "value": f"${metadata['mrr']:,.2f}",
                "inline": True,
            })

        embed = self._build_embed(
            title="💰 Billing Event",
            description=action,
            color=0xF39C12,
            footer="Billing Agent",
            fields=fields if fields else None,
        )
        await self._send_webhook(self.webhook_revenue, embed, level=2)

    # ------------------------------------------------------------------ #
    # Internal helpers
    # ------------------------------------------------------------------ #

    async def _ensure_session(self) -> aiohttp.ClientSession:
        if self._session is None:
            timeout = aiohttp.ClientTimeout(total=10)
            self._session = aiohttp.ClientSession(timeout=timeout)
            self._owns_session = True
        return self._session

    def _build_embed(
        self,
        title: str,
        description: str,
        color: int,
        footer: Optional[str] = None,
        fields: Optional[List[Dict[str, Any]]] = None,
    ) -> Dict[str, Any]:
        embed: Dict[str, Any] = {
            "title": title,
            "description": description,
            "color": color,
            "timestamp": self._timestamp(),
        }
        if footer:
            embed["footer"] = {"text": footer}
        if fields:
            embed["fields"] = fields
        return embed

    async def _send_webhook(self, webhook_url: Optional[str], embed: Dict[str, Any], level: int = 3) -> bool:
        if not webhook_url:
            logger.debug("Discord webhook missing for %s", embed.get("title"))
            return False
        if not self._should_notify(level):
            return False

        payload = {"embeds": [embed]}
        session = await self._ensure_session()
        try:
            async with session.post(webhook_url, json=payload) as response:
                if response.status >= 400:
                    text = await response.text()
                    logger.warning(
                        "Discord webhook failed (%s): %s - %s",
                        webhook_url,
                        response.status,
                        text,
                    )
                    return False
        except asyncio.CancelledError:
            raise
        except aiohttp.ClientError as exc:
            logger.warning("Discord webhook error: %s", exc)
            return False
        return True

    def _should_notify(self, level: int) -> bool:
        return level <= self._notification_level

    @staticmethod
    def _timestamp() -> str:
        return datetime.now(timezone.utc).isoformat()

    @staticmethod
    def _format_report_body(statistics: Dict[str, Any]) -> str:
        return (
            f"**Businesses Built:** {statistics.get('businesses_built', 0)}\n"
            f"**Success Rate:** {statistics.get('success_rate', 0)}%\n"
            f"**Avg Quality Score:** {statistics.get('avg_quality_score', 'n/a')}/100\n"
            f"**Total Revenue:** ${statistics.get('total_revenue', 0):.2f}\n"
            f"**Payment Spend:** ${statistics.get('payment_spend_usd', 0):.2f}\n"
            f"**Active Businesses:** {statistics.get('active_businesses', 0)}"
        )

    def _channel_map(self) -> Dict[str, Optional[str]]:
        return {
            "dashboard": self.webhook_dashboard,
            "commands": self.webhook_commands,
            "alerts": self.webhook_alerts,
            "deployments": self.webhook_deployments,
            "metrics": self.webhook_metrics,
            "payments": self.webhook_payments,
            "revenue": self.webhook_revenue,
            "errors": self.webhook_errors,
        }


def get_discord_client() -> GenesisDiscord:
    """Factory used by orchestrators for lazy initialization."""
    global _GLOBAL_DISCORD_CLIENT
    if _GLOBAL_DISCORD_CLIENT is None:
        _GLOBAL_DISCORD_CLIENT = GenesisDiscord()
    return _GLOBAL_DISCORD_CLIENT


async def close_discord_client() -> None:
    global _GLOBAL_DISCORD_CLIENT
    if _GLOBAL_DISCORD_CLIENT is not None:
        await _GLOBAL_DISCORD_CLIENT.close()
        _GLOBAL_DISCORD_CLIENT = None


_GLOBAL_DISCORD_CLIENT: Optional[GenesisDiscord] = None
