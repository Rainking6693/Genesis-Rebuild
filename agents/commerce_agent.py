"""Commerce agent orchestrating vendor spend with the new payment manager."""
import asyncio

from infrastructure.payments import get_payment_manager


class CommerceAgent:
    def __init__(self):
        self.cost_map = {
            "register_domain": 0.75,
            "setup_payment_gateway": 1.25,
            "authorize_payment": 0.45,
            "capture_payment": 0.4,
        }
        self.payment_manager = get_payment_manager()

    def get_cost(self, resource: str, default: float) -> float:
        return self.cost_map.get(resource, default)

    async def register_domain(self, domain: str) -> dict:
        response = await asyncio.to_thread(
            self.payment_manager.pay,
            "commerce_agent",
            "https://domain-api.genesis.com/register",
            self.get_cost("register_domain", 0.75),
            metadata={"domain": domain}
        )
        return {"transaction_id": response.transaction_id, "status": response.status, "domain": domain}

    async def setup_payment_gateway(self, gateway: str) -> dict:
        response = await asyncio.to_thread(
            self.payment_manager.pay,
            "commerce_agent",
            "https://payment-gateway.genesis.com/setup",
            self.get_cost("setup_payment_gateway", 1.25),
            metadata={"gateway": gateway}
        )
        return {"transaction_id": response.transaction_id, "status": response.status, "gateway": gateway}

    async def authorize_payment(self, vendor: str, amount: float, resource: str = "commerce_purchase") -> dict:
        return await asyncio.to_thread(
            self.payment_manager.authorize,
            "commerce_agent",
            vendor,
            amount
        )

    async def capture_payment(self, authorization_id: str, amount: float) -> dict:
        return await asyncio.to_thread(
            self.payment_manager.capture,
            authorization_id,
            amount
        )

    async def staged_purchase(self, vendor: str, amount: float) -> dict:
        authorization = await self.authorize_payment(vendor, amount)
        auth_id = authorization.get("authorization_id") or authorization.get("id") or "unknown"
        capture = await self.capture_payment(auth_id, amount)
        return {"authorization": authorization, "capture": capture}
