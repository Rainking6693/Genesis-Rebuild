#!/usr/bin/env python3
"""
Test script to validate A2A agent card endpoints

This script tests the per-agent card endpoints required by the Rogue validation framework.
It verifies that:
1. All agent cards return valid A2A AgentCard objects
2. All required fields are present
3. Cards conform to A2A protocol specification
4. Endpoint handles errors gracefully

Run with:
    python test_a2a_agent_cards.py
"""

import asyncio
import sys
from pathlib import Path

# Add project root to path
sys.path.insert(0, str(Path(__file__).parent))

from fastapi.testclient import TestClient
from a2a_service import app, AgentCard, AGENT_CARDS

def test_agent_card_definitions():
    """Test that all agent cards are properly defined"""
    print("\n" + "="*80)
    print("TEST 1: Agent Card Definitions")
    print("="*80)

    errors = []
    for agent_name, card in AGENT_CARDS.items():
        try:
            # Verify it's an AgentCard instance
            assert isinstance(card, AgentCard), f"Not an AgentCard: {type(card)}"

            # Verify all required fields are present and non-empty
            assert card.name and isinstance(card.name, str), "name must be non-empty string"
            assert card.version and isinstance(card.version, str), "version must be non-empty string"
            assert card.description and isinstance(card.description, str), "description must be non-empty string"
            assert isinstance(card.capabilities, list), "capabilities must be a list"
            assert isinstance(card.skills, list), "skills must be a list"
            assert isinstance(card.defaultInputModes, list), "defaultInputModes must be a list"
            assert isinstance(card.defaultOutputModes, list), "defaultOutputModes must be a list"

            # Verify lists are not empty
            assert len(card.capabilities) > 0, "capabilities list cannot be empty"
            assert len(card.skills) > 0, "skills list cannot be empty"
            assert len(card.defaultInputModes) > 0, "defaultInputModes list cannot be empty"
            assert len(card.defaultOutputModes) > 0, "defaultOutputModes list cannot be empty"

            print(f"  ✅ {agent_name:25} - {card.name}")

        except AssertionError as e:
            error_msg = f"  ❌ {agent_name:25} - {str(e)}"
            print(error_msg)
            errors.append((agent_name, str(e)))

    if errors:
        print(f"\n❌ {len(errors)} card definition errors found:")
        for agent_name, error in errors:
            print(f"  - {agent_name}: {error}")
        return False

    print(f"\n✅ All {len(AGENT_CARDS)} agent cards are valid and A2A-compliant!")
    return True


def test_endpoint_accessibility():
    """Test that the endpoint is accessible and returns valid responses"""
    print("\n" + "="*80)
    print("TEST 2: Endpoint Accessibility")
    print("="*80)

    client = TestClient(app)
    errors = []

    for agent_name in AGENT_CARDS.keys():
        try:
            # Make request to endpoint
            response = client.get(f"/a2a/agents/{agent_name}/card")

            # Verify response status
            if response.status_code != 200:
                error_msg = f"Got status {response.status_code}: {response.text}"
                print(f"  ❌ {agent_name:25} - {error_msg}")
                errors.append((agent_name, error_msg))
                continue

            # Parse response
            data = response.json()

            # Validate response schema
            card = AgentCard(**data)

            # Verify it matches the expected card
            expected_card = AGENT_CARDS[agent_name]
            assert card.name == expected_card.name, f"Name mismatch: {card.name} vs {expected_card.name}"
            assert card.version == expected_card.version, f"Version mismatch: {card.version} vs {expected_card.version}"

            print(f"  ✅ {agent_name:25} - Status {response.status_code}")

        except Exception as e:
            error_msg = str(e)
            print(f"  ❌ {agent_name:25} - {error_msg}")
            errors.append((agent_name, error_msg))

    if errors:
        print(f"\n❌ {len(errors)} endpoint errors found:")
        for agent_name, error in errors:
            print(f"  - {agent_name}: {error}")
        return False

    print(f"\n✅ All {len(AGENT_CARDS)} agent endpoints are accessible and return valid A2A cards!")
    return True


def test_endpoint_error_handling():
    """Test that the endpoint handles errors gracefully"""
    print("\n" + "="*80)
    print("TEST 3: Error Handling")
    print("="*80)

    client = TestClient(app)
    errors = []

    test_cases = [
        ("invalid_agent", 404, "Unknown agent should return 404"),
        ("UNKNOWN_AGENT", 404, "Case-insensitive lookup should return 404"),
        ("", 404, "Empty agent name should return 404"),
    ]

    for agent_name, expected_status, description in test_cases:
        try:
            response = client.get(f"/a2a/agents/{agent_name}/card")

            if response.status_code == expected_status:
                print(f"  ✅ {description:50} - Status {response.status_code}")
            else:
                error_msg = f"Expected {expected_status}, got {response.status_code}"
                print(f"  ❌ {description:50} - {error_msg}")
                errors.append((agent_name or "[empty]", error_msg))

        except Exception as e:
            error_msg = str(e)
            print(f"  ❌ {description:50} - {error_msg}")
            errors.append((agent_name or "[empty]", error_msg))

    if errors:
        print(f"\n❌ {len(errors)} error handling tests failed")
        return False

    print(f"\n✅ Error handling works correctly!")
    return True


def test_unified_card_backward_compatibility():
    """Test that the original unified /a2a/card endpoint still works"""
    print("\n" + "="*80)
    print("TEST 4: Unified Card Backward Compatibility")
    print("="*80)

    client = TestClient(app)

    try:
        response = client.get("/a2a/card")

        if response.status_code != 200:
            print(f"  ❌ Unified endpoint returned status {response.status_code}")
            return False

        data = response.json()

        # Verify structure
        assert "name" in data, "Missing 'name' field"
        assert "version" in data, "Missing 'version' field"
        assert "tools" in data, "Missing 'tools' field"
        assert isinstance(data["tools"], list), "tools field must be a list"

        print(f"  ✅ Unified endpoint is accessible")
        print(f"     - Version: {data['version']}")
        print(f"     - Agents: {data.get('description', 'N/A')[:50]}...")
        print(f"     - Total tools: {len(data['tools'])}")

        return True

    except Exception as e:
        print(f"  ❌ Unified endpoint test failed: {str(e)}")
        return False


def test_a2a_compliance():
    """Test A2A protocol compliance"""
    print("\n" + "="*80)
    print("TEST 5: A2A Protocol Compliance")
    print("="*80)

    required_fields = {
        "name": str,
        "version": str,
        "description": str,
        "capabilities": list,
        "skills": list,
        "defaultInputModes": list,
        "defaultOutputModes": list,
    }

    all_compliant = True
    for agent_name, card in AGENT_CARDS.items():
        compliant = True
        for field_name, field_type in required_fields.items():
            if not hasattr(card, field_name):
                print(f"  ❌ {agent_name:25} - Missing field: {field_name}")
                compliant = False
                all_compliant = False
            elif not isinstance(getattr(card, field_name), field_type):
                actual_type = type(getattr(card, field_name)).__name__
                print(f"  ❌ {agent_name:25} - {field_name} is {actual_type}, expected {field_type.__name__}")
                compliant = False
                all_compliant = False

        if compliant:
            print(f"  ✅ {agent_name:25} - Fully A2A compliant")

    if all_compliant:
        print(f"\n✅ All agents are fully A2A-compliant!")
        return True
    else:
        print(f"\n❌ Some agents are not fully A2A-compliant")
        return False


def main():
    """Run all tests"""
    print("\n")
    print("█" * 80)
    print("Genesis A2A Agent Card Endpoint Tests")
    print("█" * 80)

    results = []

    # Run all tests
    results.append(("Agent Card Definitions", test_agent_card_definitions()))
    results.append(("Endpoint Accessibility", test_endpoint_accessibility()))
    results.append(("Error Handling", test_endpoint_error_handling()))
    results.append(("Unified Card Backward Compatibility", test_unified_card_backward_compatibility()))
    results.append(("A2A Protocol Compliance", test_a2a_compliance()))

    # Summary
    print("\n" + "="*80)
    print("TEST SUMMARY")
    print("="*80)

    passed = sum(1 for _, result in results if result)
    total = len(results)

    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"  {status} - {test_name}")

    print(f"\nTotal: {passed}/{total} tests passed")

    if passed == total:
        print("\n🎉 All tests passed! Ready for Rogue validation.")
        return 0
    else:
        print(f"\n⚠️  {total - passed} test(s) failed. Please review and fix.")
        return 1


if __name__ == "__main__":
    sys.exit(main())
