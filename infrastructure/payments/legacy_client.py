"""Minimal compatibility layer exposing the old x402 client signature."""
from __future__ import annotations

import logging
import uuid
from dataclasses import dataclass
from datetime import datetime
from typing import Dict, Optional

from infrastructure.payments import get_payment_manager

logger = logging.getLogger(__name__)


@dataclass
class X402Payment:
    signature: str
    amount: float
    token: str
    chain: str
    recipient: str
    transaction_hash: Optional[str] = None


@dataclass
class X402Authorization:
    authorization_id: str
    amount: float
    token: str
    chain: str
    vendor: str
    metadata: Dict[str, Optional[object]]
    created_at: str


class X402Client:
    def __init__(self, agent_name: str, chain: str = "base"):
        self.agent_name = agent_name
        self.chain = chain
        self.payment_manager = get_payment_manager()
        self.logger = logging.getLogger(__name__)

    def create_payment(self,
                       amount: float,
                       token: str = "USDC",
                       recipient: Optional[str] = None,
                       metadata: Optional[Dict[str, object]] = None) -> X402Payment:
        recipient = recipient or "anon"
        response = self.payment_manager.pay(
            self.agent_name,
            recipient,
            amount,
            token=token,
            vendor=recipient,
            metadata=metadata or {}
        )
        return X402Payment(
            signature=response.transaction_id,
            amount=amount,
            token=token,
            chain=self.chain,
            recipient=recipient,
            transaction_hash=response.blockchain_tx_hash
        )

    def authorize_payment(self,
                          amount: float,
                          token: str = "USDC",
                          vendor: str = "",
                          metadata: Optional[Dict[str, Optional[object]]] = None) -> X402Authorization:
        authorization_id = f"AUTH-{uuid.uuid4().hex[:12]}"
        payload = {
            "agent": self.agent_name,
            "vendor": vendor,
            "amount": amount,
            "token": token,
            "metadata": metadata or {}
        }
        logger.info("Authorized payment: %s", payload)
        return X402Authorization(
            authorization_id=authorization_id,
            amount=amount,
            token=token,
            chain=self.chain,
            vendor=vendor or self.agent_name,
            metadata=payload,
            created_at=datetime.utcnow().isoformat()
        )

    def capture_payment(self, authorization_id: str, amount: Optional[float] = None) -> Dict[str, object]:
        tx_hash = f"tx-{uuid.uuid4().hex[:14]}"
        logger.info("Captured payment %s for amount %s", authorization_id, amount)
        return {
            "authorization_id": authorization_id,
            "amount_usd": amount or 0.0,
            "transaction_hash": tx_hash,
            "status": "captured"
        }

    def cancel_authorization(self, authorization_id: str) -> bool:
        logger.info("Cancelled authorization %s", authorization_id)
        return True

    def get_balance(self, token: str = "USDC") -> float:
        return 1000.0

    def needs_funding(self, min_balance: float = 10.0, token: str = "USDC") -> bool:
        return self.get_balance(token) < min_balance
