import asyncio
from types import SimpleNamespace

import pytest

from infrastructure import omnidaemon_callbacks as callbacks


class DummyA2AService:
    def __init__(self, **kwargs):
        pass

    def pay_for_service(self, amount, token, vendor, metadata=None):
        return SimpleNamespace(
            transaction_id="flow-tx",
            amount=amount,
            token=token,
            vendor=vendor,
            status="completed",
            blockchain_tx_hash="flowhash",
            message="flow pay",
            metadata=metadata or {},
        )


class DummyMetaAgent:
    async def generate_business(self, spec):
        # Mark business_id so callers can assert
        spec.metadata.setdefault("business_id", "flow-456")
        spec.metadata.setdefault("dashboard_url", "https://dashboard.example.com/flow")
        return SimpleNamespace(success=True, metrics={"cost_usd": 0.0, "components": len(spec.components)})


@pytest.fixture(autouse=True)
def patch_payment_and_meta(monkeypatch):
    from infrastructure.payments import a2a_x402_service

    monkeypatch.setattr(a2a_x402_service, "A2AX402Service", DummyA2AService)
    monkeypatch.setattr(callbacks, "GenesisMetaAgent", lambda **kwargs: DummyMetaAgent())
    yield


@pytest.mark.asyncio
async def test_meta_agent_full_flow():
    request = {
        "content": {
            "spec": {
                "name": "full-flow",
                "description": "Integration test",
                "components": ["api", "ui", "billing"],
                "business_type": "saas",
                "metadata": {"quality_score": 92},
            }
        }
    }

    result = await callbacks.meta_agent_callback(request)
    assert result["status"] == "success"
    assert result["business_id"] == "flow-456"
    metrics = result["metrics"]
    assert metrics["cost_usd"] == 0.0
