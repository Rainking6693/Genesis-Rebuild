"""HTTP client for the Google A2A-x402 facilitator."""
from __future__ import annotations

import json
import logging
import os
from dataclasses import dataclass
from typing import Dict, Optional

import httpx

logger = logging.getLogger(__name__)


@dataclass
class A2APaymentResponse:
    transaction_id: str
    amount: float
    token: str
    vendor: str
    status: str
    blockchain_tx_hash: str
    message: str
    metadata: Dict[str, object]


class A2AX402Service:
    """Client that talks to Google’s A2A-x402 facilitator via HTTP."""

    def __init__(
        self,
        base_url: Optional[str] = None,
        api_key: Optional[str] = None,
        wallet_address: Optional[str] = None,
    ):
        self.base_url = (base_url or os.getenv("X402_FACILITATOR_URL") or "https://x402-facilitator.coinbase.com").rstrip("/")  # use Coinbase default when unspecified
        self.api_key = api_key or os.getenv("A2A_API_KEY")
        self.wallet_address = wallet_address or os.getenv("X402_WALLET_ADDRESS")
        headers = {"Content-Type": "application/json"}
        if self.api_key:
            headers["Authorization"] = f"Bearer {self.api_key}"
        self.client = httpx.Client(base_url=self.base_url, headers=headers, timeout=15.0)
        logger.info("Initialized A2A-x402 HTTP service at %s", self.base_url)

    def _build_payload(self, amount: float, token: str, vendor: str, metadata: Optional[Dict[str, object]]) -> Dict[str, object]:
        payload = {
            "amount_usdc": round(amount, 6),
            "token": token,
            "vendor": vendor,
            "wallet": self.wallet_address,
            "metadata": metadata or {},
        }
        return payload

    def pay_for_service(self, amount: float, token: str, vendor: str, metadata: Optional[Dict[str, object]] = None) -> A2APaymentResponse:
        payload = self._build_payload(amount, token, vendor, metadata)
        response = self.client.post("/v1/x402/payments", json=payload)
        response.raise_for_status()
        data = response.json()
        return A2APaymentResponse(
            transaction_id=data.get("transaction_id", payload["metadata"].get("trace_id", "")),
            amount=float(data.get("amount_usdc", amount)),
            token=data.get("token", token),
            vendor=data.get("vendor", vendor),
            status=data.get("status", "completed"),
            blockchain_tx_hash=data.get("blockchain_tx_hash", data.get("txHash", "")),
            message=data.get("message", "Payment completed"),
            metadata=data.get("metadata", metadata or {}),
        )

    def health_check(self) -> bool:
        try:
            res = self.client.get("/v1/health")
            return res.status_code == 200
        except httpx.HTTPError as exc:
            logger.warning("A2A-x402 health check failed: %s", exc)
            return False
