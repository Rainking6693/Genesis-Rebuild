#!/usr/bin/env python3
"""
Cora's Negative Testing Suite
Tests edge cases and attempts to break Alex's fixes.
"""

import pytest
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

from agents.database_design_agent import DatabaseDesignAgent, SchemaConfig
from agents.stripe_integration_agent import StripeIntegrationAgent
from infrastructure.business_idea_generator import RevenuePotentialScorer


class TestDatabaseDesignAgentEdgeCases:
    """Try to break DatabaseDesignAgent fix."""

    def test_empty_requirements(self):
        """Test with empty requirements list."""
        agent = DatabaseDesignAgent(business_id="test", enable_memory=False)
        result = agent.design_schema(
            business_type="saas",
            requirements=[]
        )
        # Should use defaults
        assert result.success is True

    def test_very_long_business_type(self):
        """Test with extremely long business type."""
        agent = DatabaseDesignAgent(business_id="test", enable_memory=False)
        long_type = "a" * 1000
        result = agent.design_schema(
            business_type=long_type,
            requirements=["users"]
        )
        # Should handle gracefully
        assert result.success is True

    def test_special_characters_in_requirements(self):
        """Test with SQL injection-style requirements."""
        agent = DatabaseDesignAgent(business_id="test", enable_memory=False)
        result = agent.design_schema(
            business_type="saas",
            requirements=["users'; DROP TABLE--", "data"]
        )
        # Should sanitize or handle
        assert result.success is True

    def test_conflicting_parameters(self):
        """Test providing both config and simple params."""
        agent = DatabaseDesignAgent(business_id="test", enable_memory=False)
        config = SchemaConfig(
            schema_name="test_db",
            database_type="postgresql",
            tables=[{"name": "test", "columns": [{"name": "id", "type": "INTEGER"}]}]
        )
        # Config should take precedence
        result = agent.design_schema(
            business_type="ecommerce",
            config=config
        )
        assert result.success is True
        assert result.schema_name == "test_db"  # Config wins


class TestStripeIntegrationAgentEdgeCases:
    """Try to break StripeIntegrationAgent fix."""

    def test_empty_business_id(self):
        """Test with empty business ID."""
        agent = StripeIntegrationAgent(business_id="test", enable_memory=False)
        result = agent.setup_payment_integration(
            business_id="",
            payment_type="subscription"
        )
        # Should handle empty string
        assert result.success is True

    def test_invalid_payment_type(self):
        """Test with invalid payment type."""
        agent = StripeIntegrationAgent(business_id="test", enable_memory=False)
        result = agent.setup_payment_integration(
            business_id="test",
            payment_type="INVALID_TYPE_9999"
        )
        # Should still create integration
        assert result.success is True

    def test_invalid_currency(self):
        """Test with invalid currency code."""
        agent = StripeIntegrationAgent(business_id="test", enable_memory=False)
        result = agent.setup_payment_integration(
            business_id="test",
            payment_type="one_time",
            currency="INVALID"
        )
        # Should handle invalid currency
        assert result.success is True

    def test_rapid_successive_calls(self):
        """Test rapid successive integration setups."""
        agent = StripeIntegrationAgent(business_id="test", enable_memory=False)
        results = []
        for i in range(100):
            result = agent.setup_payment_integration(
                business_id=f"test_{i}",
                payment_type="subscription"
            )
            results.append(result)

        # All should succeed
        assert all(r.success for r in results)
        # Statistics should be accurate
        stats = agent.get_statistics()
        assert stats["payments_processed"] == 100


class TestDictLowerFixEdgeCases:
    """Try to break dict.lower() fix."""

    def test_nested_dicts(self):
        """Test with deeply nested dict structures."""
        scorer = RevenuePotentialScorer()
        features = [
            "Feature 1",
            {"nested": {"deep": {"value": "ai"}}},
            "Feature 2"
        ]
        # Should handle nested dicts gracefully
        score = scorer._score_features(features)
        assert 0 < score <= 100

    def test_mixed_types(self):
        """Test with various unexpected types."""
        scorer = RevenuePotentialScorer()
        features = [
            "Feature 1",
            123,  # Integer
            None,  # None
            [],  # Empty list
            {"feature": "ai"},  # Dict
            True,  # Boolean
            "Feature 2"
        ]
        # Should handle all types gracefully
        score = scorer._score_features(features)
        assert 0 < score <= 100

    def test_unicode_features(self):
        """Test with Unicode characters."""
        scorer = RevenuePotentialScorer()
        features = [
            "AI-powered 🤖",
            "Payment 💳",
            "Analytics 📊"
        ]
        # Should handle Unicode
        score = scorer._score_features(features)
        assert 0 < score <= 100

    def test_empty_lists(self):
        """Test with empty feature/tech lists."""
        scorer = RevenuePotentialScorer()
        idea = {
            "name": "Test",
            "business_type": "saas",
            "monetization_model": "subscription",
            "mvp_features": [],
            "tech_stack": []
        }
        market_data = {"competition_level": "medium"}

        score = scorer.score_idea(idea, market_data)
        # Should return reasonable score even with empty lists
        assert 0 < score <= 100

    def test_all_invalid_types(self):
        """Test with all invalid types."""
        scorer = RevenuePotentialScorer()
        idea = {
            "name": "Test",
            "business_type": "saas",
            "monetization_model": {"model": "subscription"},  # Dict
            "mvp_features": [123, None, {"feature": "test"}],  # All invalid
            "tech_stack": [True, False, []],  # All invalid
        }
        market_data = {"competition_level": "medium"}

        # Should not crash
        score = scorer.score_idea(idea, market_data)
        assert 0 < score <= 100


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
