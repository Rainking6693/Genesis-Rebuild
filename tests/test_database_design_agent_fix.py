#!/usr/bin/env python3
"""
Test for DatabaseDesignAgent API fix.

Verifies that the agent now accepts both:
1. Simple API: design_schema(business_type="ecommerce", requirements=["users"])
2. Advanced API: design_schema(config=SchemaConfig(...))
"""

import pytest
import sys
from pathlib import Path

# Add project root to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from agents.database_design_agent import (
    DatabaseDesignAgent,
    SchemaConfig,
    SchemaResult
)


def test_database_design_simple_api():
    """Test that the simple API works as expected by the test."""
    agent = DatabaseDesignAgent(business_id="test", enable_memory=False)

    # This is how the test calls it - should now work
    result = agent.design_schema(
        business_type="ecommerce",
        requirements=["users", "data"]
    )

    assert isinstance(result, SchemaResult)
    assert result.success is True
    assert result.schema_name == "ecommerce_db"
    assert len(result.ddl_statements) > 0
    assert result.optimization_score > 0
    print(f"✓ Simple API works: {result.schema_name} with {len(result.ddl_statements)} DDL statements")


def test_database_design_advanced_api():
    """Test that the advanced API still works."""
    agent = DatabaseDesignAgent(business_id="test", enable_memory=False)

    # Advanced API with SchemaConfig
    config = SchemaConfig(
        schema_name="advanced_test_db",
        database_type="postgresql",
        tables=[
            {
                "name": "users",
                "columns": [
                    {"name": "id", "type": "INTEGER", "primary_key": True},
                    {"name": "email", "type": "VARCHAR(255)", "not_null": True}
                ]
            }
        ]
    )

    result = agent.design_schema(config=config)

    assert isinstance(result, SchemaResult)
    assert result.success is True
    assert result.schema_name == "advanced_test_db"
    print(f"✓ Advanced API works: {result.schema_name}")


def test_database_design_default_requirements():
    """Test that requirements default to ['users', 'data'] if not provided."""
    agent = DatabaseDesignAgent(business_id="test", enable_memory=False)

    result = agent.design_schema(business_type="saas")

    assert isinstance(result, SchemaResult)
    assert result.success is True
    # Should have created both users and data tables
    assert len(result.ddl_statements) >= 2
    print(f"✓ Default requirements work: {len(result.ddl_statements)} tables created")


def test_database_design_different_business_types():
    """Test various business types."""
    agent = DatabaseDesignAgent(business_id="test", enable_memory=False)

    business_types = ["ecommerce", "saas", "fintech", "marketplace", "gaming"]

    for btype in business_types:
        result = agent.design_schema(
            business_type=btype,
            requirements=["users", "data"]
        )

        assert result.success is True
        assert btype in result.schema_name
        print(f"✓ Business type '{btype}' works: {result.schema_name}")


def test_database_design_error_handling():
    """Test that missing business_type raises appropriate error."""
    agent = DatabaseDesignAgent(business_id="test", enable_memory=False)

    with pytest.raises(ValueError, match="Either business_type or config must be provided"):
        agent.design_schema()  # No params


if __name__ == "__main__":
    print("=" * 80)
    print("TESTING DatabaseDesignAgent API FIX")
    print("=" * 80)

    test_database_design_simple_api()
    test_database_design_advanced_api()
    test_database_design_default_requirements()
    test_database_design_different_business_types()
    test_database_design_error_handling()

    print("\n" + "=" * 80)
    print("✅ ALL TESTS PASSED - DatabaseDesignAgent API fixed!")
    print("=" * 80)
