"""Legacy middleware that wraps payment-aware HTTP calls."""
from __future__ import annotations

import logging
from typing import Any

import requests
from infrastructure.payments import get_payment_manager

logger = logging.getLogger(__name__)


class PaymentMiddleware:
    """Compatibility layer that proxies HTTP calls through PaymentManager."""

    def __init__(self, agent_name: str, chain: str = "base"):
        self.agent_name = agent_name
        self.chain = chain
        self.payment_manager = get_payment_manager()

    def get(self, url: str, **kwargs: Any) -> requests.Response:
        return self._request_with_payment("GET", url, **kwargs)

    def post(self, url: str, **kwargs: Any) -> requests.Response:
        return self._request_with_payment("POST", url, **kwargs)

    def _request_with_payment(self, method: str, url: str, **kwargs: Any) -> requests.Response:
        response = requests.request(method, url, **kwargs)
        if response.status_code == 402:
            logger.info("Intercepted 402 and paying via new manager for %s", url)
            amount = float(response.headers.get("X-PAYMENT-AMOUNT", 0.0))
            token = response.headers.get("X-PAYMENT-TOKEN", "USDC")
            vendor = response.headers.get("X-PAYMENT-VENDOR", self.agent_name)
            metadata = {"url": url}
            payment = self.payment_manager.pay(
                self.agent_name,
                url,
                amount,
                token=token,
                vendor=vendor,
                metadata=metadata,
            )
            headers = kwargs.setdefault("headers", {})
            headers["X-PAYMENT"] = payment.transaction_id
            return requests.request(method, url, headers=headers, **{k: v for k, v in kwargs.items() if k != "headers"})
        return response
