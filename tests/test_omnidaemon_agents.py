import asyncio
from types import SimpleNamespace

import pytest

from infrastructure import omnidaemon_callbacks as callbacks


class DummyA2AService:
    def __init__(self, **kwargs):
        pass

    def pay_for_service(self, amount, token, vendor, metadata=None):
        return SimpleNamespace(
            transaction_id="stub-tx",
            amount=amount,
            token=token,
            vendor=vendor,
            status="completed",
            blockchain_tx_hash="stubbedhash",
            message="stub pay",
            metadata=metadata or {},
        )


class DummyMetaAgent:
    def __init__(self):
        self.generated = []

    async def generate_business(self, spec):
        spec.metadata.setdefault("business_id", "omni-meta-123")
        self.generated.append(spec.name)
        return SimpleNamespace(success=True, metrics={"cost_usd": 0.0})


@pytest.fixture(autouse=True)
def stub_payment_service(monkeypatch):
    from infrastructure.payments import a2a_x402_service

    from infrastructure.payments import manager as payment_manager_module
    from infrastructure.payments.manager import get_payment_manager

    monkeypatch.setattr(a2a_x402_service, "A2AX402Service", DummyA2AService)
    monkeypatch.setattr(payment_manager_module, "A2AX402Service", DummyA2AService)
    monkeypatch.setattr(callbacks, "GenesisMetaAgent", DummyMetaAgent)
    get_payment_manager.cache_clear()
    yield


@pytest.mark.asyncio
async def test_builder_callback(monkeypatch):
    result = await callbacks.builder_callback({"content": {"components": ["dashboard"]}})
    assert result["status"] == "success"
    assert "components" in result


@pytest.mark.asyncio
async def test_builder_callback_with_retry(monkeypatch):
    call_count = {"n": 0}

    class FlakyService(DummyA2AService):
        def pay_for_service(self, amount, token, vendor, metadata=None):
            call_count["n"] += 1
            if call_count["n"] < 2:
                raise ConnectionError("simulated downtime")
            return super().pay_for_service(amount, token, vendor, metadata)

    from infrastructure.payments import a2a_x402_service
    from infrastructure.payments import manager as payment_manager_module
    from infrastructure.payments.manager import get_payment_manager

    monkeypatch.setattr(a2a_x402_service, "A2AX402Service", FlakyService)
    monkeypatch.setattr(payment_manager_module, "A2AX402Service", FlakyService)
    get_payment_manager.cache_clear()
    result = await callbacks.builder_callback({"content": {"components": ["dashboard-retry"]}})
    assert result["status"] == "success"
    assert call_count["n"] >= 2


@pytest.mark.asyncio
async def test_deploy_callback():
    payload = {"content": {"platform": "vercel"}}
    result = await callbacks.deploy_callback(payload)
    assert result["status"] == "deployed"
    assert result["platform"] == "vercel"
    assert "transaction_id" in result


@pytest.mark.asyncio
async def test_qa_callback():
    tests = ["unit", "integration"]
    result = await callbacks.qa_callback({"content": {"tests": tests}})
    assert result["status"] == "tests_executed"
    assert result["tests"] == tests


@pytest.mark.asyncio
async def test_research_callback(monkeypatch):
    class DummyIdea:
        def __init__(self):
            self.quality_score = 88.0

        def to_dict(self):
            return {"idea": "test", "score": self.quality_score}

    async def dummy_generate_idea(*args, **kwargs):
        await asyncio.sleep(0)
        return DummyIdea()

    from agents.business_generation_agent import BusinessIdeaGenerator

    monkeypatch.setattr(BusinessIdeaGenerator, "generate_idea", dummy_generate_idea)
    result = await callbacks.research_callback({"content": {"business_type": "saas"}})
    assert result["status"] == "researched"
    assert "content" in result


@pytest.mark.asyncio
async def test_business_marketing_callback():
    topic = "genesis.marketing"
    payload = {"content": {"campaign": "launch"}}
    result = await callbacks.business_marketing_callback(topic, payload)
    assert result["status"] == "handled"
    assert result["topic"] == topic


@pytest.mark.asyncio
async def test_finance_special_callback():
    topic = "genesis.finance"
    payload = {"content": {"query": "budget"}}
    result = await callbacks.finance_special_callback(topic, payload)
    assert result["status"] == "finance-handled"


@pytest.mark.asyncio
async def test_core_agent_callback():
    topic = "genesis.backend"
    payload = {"content": {"component": "api"}}
    result = await callbacks.core_agent_callback(topic, payload)
    assert result["status"] == "processed"
    assert result["topic"] == topic


@pytest.mark.asyncio
async def test_meta_agent_callback(monkeypatch):
    payload = {
        "content": {
            "spec": {
                "name": "meta-test",
                "description": "meta",
                "components": ["dashboard"],
                "business_type": "saas",
            }
        }
    }
    result = await callbacks.meta_agent_callback(payload)
    assert result["status"] == "success"
    assert result["business_id"] == "omni-meta-123"
