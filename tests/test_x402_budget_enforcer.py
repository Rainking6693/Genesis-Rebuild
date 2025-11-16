import pytest

from infrastructure.payments.budget_enforcer import BudgetEnforcer, BudgetExceeded


def test_can_spend_under_limit():
    enforcer = BudgetEnforcer()
    assert enforcer.can_spend("builder_agent", 0.5)


def test_record_spend_updates_usage():
    enforcer = BudgetEnforcer()
    enforcer.record_spend("builder_agent", 1.5, "test", "meta")
    usage = enforcer.get_usage("builder_agent")
    assert usage["daily"] >= 1.5


def test_cannot_spend_over_per_transaction():
    enforcer = BudgetEnforcer()
    with pytest.raises(BudgetExceeded):
        enforcer.record_spend("builder_agent", 20.0, "test", "meta")
