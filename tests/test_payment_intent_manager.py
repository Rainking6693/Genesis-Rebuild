import pytest

from infrastructure.payment_intent_manager import PaymentIntentManager


def test_intent_denied_when_budget_low():
    manager = PaymentIntentManager()
    metadata = {"budget_usd": 1.0, "budget_strategy": "balanced"}
    intent = manager.evaluate("test_agent", "component-A", 1.5, metadata=metadata)
    assert not intent.approved
    assert "exceeds budget cap" in intent.reason


def test_intent_approved_with_growth_buffer():
    manager = PaymentIntentManager()
    metadata = {"budget_usd": 1.0, "budget_strategy": "growth"}
    intent = manager.evaluate("test_agent", "component-B", 1.05, metadata=metadata)
    assert intent.approved


def test_intent_defaults_to_client_budget():
    manager = PaymentIntentManager()
    intent = manager.evaluate("test_agent", "component-C", 0.1)
    assert intent.budget_usd == manager._client.budget
    assert intent.approved
