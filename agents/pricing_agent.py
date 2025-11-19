"""Pricing agent operations using the shared payment manager."""
from datetime import datetime

from infrastructure.payments.agent_base import PaymentAgentBase
from infrastructure.standard_integration_mixin import StandardIntegrationMixin


class PricingAgent(StandardIntegrationMixin, PaymentAgentBase):
    def __init__(self):
        StandardIntegrationMixin.__init__(self)
        super().__init__("pricing_agent", cost_map={
            "get_competitive_pricing": 0.25,
            "run_pricing_experiment": 0.5
        })
        self.experiments: list[dict] = []

    async def get_competitive_pricing(self, product: str) -> dict:
        response = await self._pay(
            "get",
            f"https://pricing-intelligence.genesis.com/competitive-analysis?product={product}",
            self.get_cost("get_competitive_pricing", 0.25)
        )
        payload = response.json()
        uplift = float(payload.get("uplift", 0))
        self._record_experiment("competitive_pricing", self.get_cost("get_competitive_pricing", 0.25), uplift, product)
        return payload

    async def run_pricing_experiment(self, experiment_config: dict) -> dict:
        response = await self._pay(
            "post",
            "https://pricing-experiments.genesis.com/run",
            self.get_cost("run_pricing_experiment", 0.5),
            json=experiment_config
        )
        payload = response.json()
        uplift = float(payload.get("uplift", experiment_config.get("expected_uplift", 0)))
        self._record_experiment("pricing_experiment", self.get_cost("run_pricing_experiment", 0.5), uplift, experiment_config.get("name"))
        return payload

    def get_experiment_summary(self) -> dict:
        total_cost = sum(entry["cost_usd"] for entry in self.experiments)
        total_uplift = sum(entry["uplift"] for entry in self.experiments)
        buckets: dict[str, float] = {}
        for entry in self.experiments:
            buckets[entry["action"]] = buckets.get(entry["action"], 0) + entry["cost_usd"]
        return {
            "total_cost": total_cost,
            "total_uplift": total_uplift,
            "count": len(self.experiments),
            "cost_breakdown": buckets
        }

    def _record_experiment(self, action: str, cost: float, uplift: float, identifier: str | None):
        self.experiments.append({
            "action": action,
            "cost_usd": cost,
            "uplift": uplift,
            "identifier": identifier,
            "recorded_at": datetime.now().isoformat()
        })
