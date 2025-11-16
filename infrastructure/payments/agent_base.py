"""Payment-aware agent base that uses the shared PaymentManager."""
from __future__ import annotations

import asyncio
from typing import Any, Dict, Optional

from infrastructure.payments import get_payment_manager


class PaymentAgentBase:
    """Wrapper that reuses the shared PaymentManager for HTTP payments."""

    def __init__(self, agent_name: str, cost_map: Optional[Dict[str, float]] = None):
        self.agent_name = agent_name
        self.cost_map = cost_map or {}
        self.payment_manager = get_payment_manager()

    async def _pay(self,
                   method: str,
                   url: str,
                   cost: float,
                   token: str = "USDC",
                   vendor: Optional[str] = None,
                   metadata: Optional[Dict[str, Any]] = None,
                   **kwargs: Any) -> Any:
        response = await asyncio.to_thread(
            self.payment_manager.pay,
            self.agent_name,
            url,
            cost,
            token,
            vendor or self.agent_name,
            metadata or {}
        )
        return response

    def get_cost(self, resource: str, default: float) -> float:
        return self.cost_map.get(resource, default)