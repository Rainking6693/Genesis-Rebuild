"""Run prometheus client exporter for payment metrics."""

from __future__ import annotations

import logging
import os
import time

from prometheus_client import start_http_server
from monitoring.payment_metrics import (
    PAYMENTS_COUNTER,
    PAYMENT_SPEND_COUNTER,
    WALLET_BALANCE,
    VENDOR_FAILURE_STREAK,
    STALE_PAYMENTS,
)

logger = logging.getLogger(__name__)

DEFAULT_PORT = int(os.getenv("PAYMENTS_PROMETHEUS_PORT", "9100"))


def run_exporter(port: int = DEFAULT_PORT) -> None:
    """Start the Prometheus HTTP exporter and keep it running."""
    logger.info("Starting payments Prometheus exporter on :%d", port)
    start_http_server(port)
    while True:
        time.sleep(30)


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    run_exporter()
