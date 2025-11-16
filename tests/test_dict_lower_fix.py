#!/usr/bin/env python3
"""
Test for dict.lower() error fix in business idea generator.

Verifies that the scorer can handle non-string values without crashing.
"""

import pytest
import sys
from pathlib import Path

# Add project root to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from infrastructure.business_idea_generator import RevenuePotentialScorer


def test_score_features_with_strings():
    """Test normal operation with string features."""
    scorer = RevenuePotentialScorer()

    features = [
        "AI-powered recommendations",
        "Payment integration",
        "API access",
        "Analytics dashboard"
    ]

    score = scorer._score_features(features)
    assert score > 0
    assert score <= 100
    print(f"✓ String features score: {score}")


def test_score_features_with_dict():
    """Test that dict values are handled gracefully."""
    scorer = RevenuePotentialScorer()

    # This can happen if LLM returns malformed data
    features = [
        "AI-powered recommendations",
        {"feature": "payment"},  # Dict instead of string!
        "API access",
        "Analytics dashboard"
    ]

    # Should not crash
    score = scorer._score_features(features)
    assert score > 0
    assert score <= 100
    print(f"✓ Mixed dict/string features handled: {score}")


def test_score_features_with_all_dicts():
    """Test that all dicts are handled."""
    scorer = RevenuePotentialScorer()

    features = [
        {"feature": "ai"},
        {"feature": "payment"},
        {"feature": "api"}
    ]

    # Should not crash, but won't get bonus points
    score = scorer._score_features(features)
    assert score > 0
    assert score <= 100
    print(f"✓ All dict features handled: {score}")


def test_score_tech_stack_with_strings():
    """Test normal operation with string tech."""
    scorer = RevenuePotentialScorer()

    tech_stack = ["Next.js", "TypeScript", "Vercel", "Stripe"]

    score = scorer._score_tech_stack(tech_stack)
    assert score > 0
    assert score <= 100
    print(f"✓ String tech stack score: {score}")


def test_score_tech_stack_with_dict():
    """Test that dict values in tech stack are handled gracefully."""
    scorer = RevenuePotentialScorer()

    # This can happen if LLM returns malformed data
    tech_stack = [
        "Next.js",
        {"tech": "TypeScript"},  # Dict instead of string!
        "Vercel"
    ]

    # Should not crash
    score = scorer._score_tech_stack(tech_stack)
    assert score > 0
    assert score <= 100
    print(f"✓ Mixed dict/string tech stack handled: {score}")


def test_score_monetization_with_string():
    """Test normal operation with string model."""
    scorer = RevenuePotentialScorer()

    score = scorer._score_monetization("subscription")
    assert score == 95  # Best score for subscription
    print(f"✓ String monetization score: {score}")


def test_score_monetization_with_dict():
    """Test that dict monetization model is handled."""
    scorer = RevenuePotentialScorer()

    # This can happen if LLM returns malformed data
    score = scorer._score_monetization({"model": "subscription"})
    assert score == 50  # Default score for invalid type
    print(f"✓ Dict monetization handled: {score}")


def test_score_monetization_with_none():
    """Test that None monetization model is handled."""
    scorer = RevenuePotentialScorer()

    score = scorer._score_monetization(None)
    assert score == 50  # Default score
    print(f"✓ None monetization handled: {score}")


def test_full_scoring_with_malformed_data():
    """Test full scoring with realistic malformed LLM response."""
    scorer = RevenuePotentialScorer()

    # Simulate malformed LLM response
    idea_data = {
        "name": "Test Business",
        "business_type": "saas",
        "description": "Test description",
        "target_audience": "Test audience",
        "monetization_model": {"model": "subscription", "price": "$10/mo"},  # Dict!
        "mvp_features": [
            "Feature 1",
            {"feature": "ai-powered"},  # Dict!
            "Feature 3"
        ],
        "tech_stack": [
            "Next.js",
            {"tech": "TypeScript"},  # Dict!
            "Vercel"
        ]
    }

    market_data = {
        "competition_level": "medium",
        "market_size": "large"
    }

    # Should not crash
    score = scorer.score_idea(idea_data, market_data)
    assert score > 0
    assert score <= 100
    print(f"✓ Full scoring with malformed data: {score}")


if __name__ == "__main__":
    print("=" * 80)
    print("TESTING dict.lower() ERROR FIX")
    print("=" * 80)

    test_score_features_with_strings()
    test_score_features_with_dict()
    test_score_features_with_all_dicts()
    test_score_tech_stack_with_strings()
    test_score_tech_stack_with_dict()
    test_score_monetization_with_string()
    test_score_monetization_with_dict()
    test_score_monetization_with_none()
    test_full_scoring_with_malformed_data()

    print("\n" + "=" * 80)
    print("✅ ALL TESTS PASSED - dict.lower() error fixed!")
    print("=" * 80)
