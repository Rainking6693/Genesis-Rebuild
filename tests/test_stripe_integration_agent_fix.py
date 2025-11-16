#!/usr/bin/env python3
"""
Test for StripeIntegrationAgent API fix.

Verifies that the agent now has the setup_payment_integration() method.
"""

import pytest
import sys
from pathlib import Path

# Add project root to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from agents.stripe_integration_agent import (
    StripeIntegrationAgent,
    PaymentConfig,
    PaymentResult
)


def test_stripe_setup_payment_integration():
    """Test that setup_payment_integration method exists and works."""
    agent = StripeIntegrationAgent(business_id="test", enable_memory=False)

    # This is how the test calls it - should now work
    result = agent.setup_payment_integration(
        business_id="test_business",
        payment_type="subscription",
        currency="usd"
    )

    assert isinstance(result, PaymentResult)
    assert result.success is True
    assert result.payment_id is not None
    assert result.status == "active"
    assert result.metadata["business_id"] == "test_business"
    assert result.metadata["payment_type"] == "subscription"
    assert result.metadata["currency"] == "usd"
    print(f"✓ setup_payment_integration works: {result.payment_id}")


def test_stripe_setup_different_payment_types():
    """Test various payment types."""
    agent = StripeIntegrationAgent(business_id="test", enable_memory=False)

    payment_types = ["one_time", "subscription", "usage_based"]

    for ptype in payment_types:
        result = agent.setup_payment_integration(
            business_id=f"test_{ptype}",
            payment_type=ptype,
            currency="usd"
        )

        assert result.success is True
        assert result.metadata["payment_type"] == ptype
        print(f"✓ Payment type '{ptype}' works: {result.payment_id}")


def test_stripe_setup_different_currencies():
    """Test various currencies."""
    agent = StripeIntegrationAgent(business_id="test", enable_memory=False)

    currencies = ["usd", "eur", "gbp", "jpy"]

    for currency in currencies:
        result = agent.setup_payment_integration(
            business_id="test_business",
            payment_type="one_time",
            currency=currency
        )

        assert result.success is True
        assert result.metadata["currency"] == currency
        print(f"✓ Currency '{currency}' works: {result.payment_id}")


def test_stripe_has_required_methods():
    """Test that agent has all required methods."""
    agent = StripeIntegrationAgent(business_id="test", enable_memory=False)

    # Check that both methods exist
    assert hasattr(agent, "setup_payment_integration")
    assert callable(agent.setup_payment_integration)

    assert hasattr(agent, "process_payment")
    assert callable(agent.process_payment)

    assert hasattr(agent, "store_payment_pattern")
    assert callable(agent.store_payment_pattern)

    assert hasattr(agent, "recall_patterns")
    assert callable(agent.recall_patterns)

    print("✓ All required methods exist")


def test_stripe_statistics():
    """Test that statistics are tracked correctly."""
    agent = StripeIntegrationAgent(business_id="test", enable_memory=False)

    # Setup a few integrations
    for i in range(3):
        agent.setup_payment_integration(
            business_id=f"test_{i}",
            payment_type="subscription",
            currency="usd"
        )

    stats = agent.get_statistics()
    assert stats["payments_successful"] == 3
    assert stats["success_rate"] == 1.0
    print(f"✓ Statistics tracking works: {stats}")


if __name__ == "__main__":
    print("=" * 80)
    print("TESTING StripeIntegrationAgent API FIX")
    print("=" * 80)

    test_stripe_setup_payment_integration()
    test_stripe_setup_different_payment_types()
    test_stripe_setup_different_currencies()
    test_stripe_has_required_methods()
    test_stripe_statistics()

    print("\n" + "=" * 80)
    print("✅ ALL TESTS PASSED - StripeIntegrationAgent API fixed!")
    print("=" * 80)
