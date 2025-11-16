import json

import pytest

from infrastructure.payments.budget_enforcer import BudgetExceeded
from infrastructure.payments.media_helper import (
    CreativeAssetRegistry,
    MediaPurchaseResult,
    MediaPaymentHelper,
)


def test_registry_tracks_and_persists(tmp_path):
    """CreativeAssetRegistry should track assets and avoid duplicates."""
    registry_path = tmp_path / "registry.json"
    registry = CreativeAssetRegistry(path=registry_path)

    assert registry.register("asset-1", {"vendor": "mediaX"})
    assert registry.exists("asset-1")
    assert not registry.register("asset-1", {"vendor": "mediaX"})

    loaded = json.loads(registry_path.read_text())
    assert "asset-1" in loaded
    assert loaded["asset-1"]["vendor"] == "mediaX"


def test_purchase_records_payment(monkeypatch):
    """X402PayPerCallHelper should emit BusinessMonitor logs."""
    captured = []

    class DummyMonitor:
        def log_payment(
            self,
            agent_name,
            payment_type,
            amount_usd,
            transaction_hash,
            resource,
            metadata=None,
            mandate_id=None,
        ):
            captured.append(
                {
                    "agent": agent_name,
                    "type": payment_type,
                    "amount": amount_usd,
                    "resource": resource,
                    "metadata": metadata or {},
                }
            )

    monkeypatch.setattr(
        "infrastructure.payments.media_helper.get_monitor",
        lambda: DummyMonitor(),
    )

    helper = MediaPaymentHelper("marketing_agent", vendor_name="test_vendor")
    result = helper.purchase("campaign_assets", 0.75)

    assert isinstance(result, MediaPurchaseResult)
    assert result.amount_usd == 0.75
    assert captured
    entry = captured[0]
    assert entry["agent"] == "marketing_agent"
    assert entry["resource"] == "campaign_assets"
    assert entry["type"] == "media"


def test_purchase_raises_when_budget_blocked():
    helper = MediaPaymentHelper("marketing_agent", vendor_name="test_vendor")
    helper.budget.can_spend = lambda agent, amount: False

    with pytest.raises(BudgetExceeded):
        helper.purchase("expensive_asset", 5.0)
