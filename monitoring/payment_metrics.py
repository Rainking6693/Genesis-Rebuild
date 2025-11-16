"""Prometheus metrics for payment transactions."""

from prometheus_client import Counter, Gauge
from typing import Dict, Optional

PAYMENTS_COUNTER = Counter(
    "payments_total",
    "Number of payments processed",
    ["agent", "vendor", "chain", "status"],
)

PAYMENT_SPEND_COUNTER = Counter(
    "payment_spend_usd",
    "USD spent via payments",
    ["agent", "vendor"],
)

WALLET_BALANCE = Gauge(
    "payment_wallet_balance",
    "Current wallet balances",
    ["agent"],
)

VENDOR_FAILURE_STREAK = Gauge(
    "payment_vendor_failure_streak",
    "Consecutive payment failures for a given vendor",
    ["vendor"],
)

STALE_PAYMENTS = Gauge(
    "payment_stale_authorizations",
    "Stale payment authorizations pending capture",
)


def record_payment_metrics(
    agent: str,
    vendor: Optional[str],
    chain: Optional[str],
    status: str,
    amount: float,
) -> None:
    vendor = vendor or "unknown"
    chain = chain or "base"
    PAYMENTS_COUNTER.labels(agent=agent, vendor=vendor, chain=chain, status=status).inc()
    PAYMENT_SPEND_COUNTER.labels(agent=agent, vendor=vendor).inc(amount)


def record_wallet_balance(agent: str, balance: float) -> None:
    WALLET_BALANCE.labels(agent=agent).set(balance)


def set_failure_streak(vendor: str, count: float) -> None:
    VENDOR_FAILURE_STREAK.labels(vendor=vendor).set(count)


def set_stale_payments(count: float) -> None:
    STALE_PAYMENTS.set(count)
