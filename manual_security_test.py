#!/usr/bin/env python3
"""
Manual Security Testing Script for Hudson's Audit
Tests credential redaction in real scenarios
"""

import sys
import json
from infrastructure.security_utils import redact_credentials

def test_credential_redaction():
    """Test various credential formats"""

    print("=" * 80)
    print("MANUAL SECURITY TESTING - CREDENTIAL REDACTION")
    print("=" * 80)
    print()

    tests = [
        # Test 1: Dictionary with API key
        {
            "name": "Dictionary with API key and password",
            "input": {"api_key": "sk-1234567890", "password": "secret123"},
            "type": "dict"
        },
        # Test 2: Error message with unquoted credentials
        {
            "name": "Error message with unquoted credentials",
            "input": "Error: api_key=sk-abc123 and token=xyz789 failed",
            "expected_redacted": ["sk-abc123", "xyz789"]
        },
        # Test 3: Special characters in credentials
        {
            "name": "API key with special characters",
            "input": "api_key=sk-abc/def+ghi authentication failed",
            "note": "Special chars like /+ should NOT be matched (only alphanumeric, -, _)"
        },
        # Test 4: Multiple credentials in one error
        {
            "name": "Multiple credentials in single error",
            "input": "Failed: api_key=sk-proj-123abc password=mypass token=bearer-xyz",
            "expected_redacted": ["sk-proj-123abc", "mypass", "bearer-xyz"]
        },
        # Test 5: Uppercase vs lowercase
        {
            "name": "Uppercase API_KEY vs lowercase api_key",
            "input": "Config: API_KEY=sk-upper123 and api_key=sk-lower456",
            "note": "Case-insensitive redaction"
        },
        # Test 6: Quoted credentials
        {
            "name": "Quoted credentials (JSON style)",
            "input": 'Error: api_key="sk-quoted123" failed validation',
            "expected_redacted": ["sk-quoted123"]
        },
        # Test 7: OpenAI keys
        {
            "name": "OpenAI API keys (sk-... pattern)",
            "input": "Using key sk-1234567890abcdefghij and sk-proj-0987654321abcdefghij",
            "expected_redacted": ["sk-1234567890abcdefghij", "sk-proj-0987654321abcdefghij"]
        },
        # Test 8: Mixed formats
        {
            "name": "Mixed quoted and unquoted in same string",
            "input": 'Request with api_key="sk-quoted999" failed, retry with password=unquoted888',
            "expected_redacted": ["sk-quoted999", "unquoted888"]
        },
        # Test 9: Database URLs
        {
            "name": "Database connection strings",
            "input": "postgres://user:password123@localhost:5432/db",
            "expected_contains": "[REDACTED]"
        },
        # Test 10: AWS keys
        {
            "name": "AWS access keys",
            "input": "AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE secret access failed",
            "expected_redacted": ["AKIAIOSFODNN7EXAMPLE"]
        }
    ]

    results = {
        "passed": 0,
        "failed": 0,
        "warnings": 0
    }

    for i, test in enumerate(tests, 1):
        print(f"Test {i}: {test['name']}")
        print("-" * 80)

        if test.get("type") == "dict":
            # Dictionary test - show before/after
            print(f"Input (dict):  {json.dumps(test['input'], indent=2)}")
            print(f"Note: For dicts, use A2AConnector's SENSITIVE_KEYS logic")
            print(f"Expected: api_key and password should be [REDACTED]")
            results["warnings"] += 1
        else:
            # String test
            input_str = test['input']
            redacted = redact_credentials(input_str)

            print(f"Input:    {input_str}")
            print(f"Redacted: {redacted}")

            # Check if expected values are redacted
            if "expected_redacted" in test:
                all_redacted = True
                for secret in test["expected_redacted"]:
                    if secret in redacted:
                        print(f"  ❌ FAIL: '{secret}' still present in output!")
                        all_redacted = False
                        results["failed"] += 1

                if all_redacted and "[REDACTED]" in redacted:
                    print(f"  ✅ PASS: All credentials redacted")
                    results["passed"] += 1
                elif all_redacted:
                    print(f"  ⚠️  WARNING: Credentials removed but no [REDACTED] marker")
                    results["warnings"] += 1

            # Check if expected content is present
            if "expected_contains" in test:
                if test["expected_contains"] in redacted:
                    print(f"  ✅ PASS: Contains '{test['expected_contains']}'")
                    results["passed"] += 1
                else:
                    print(f"  ❌ FAIL: Missing '{test['expected_contains']}'")
                    results["failed"] += 1

            # Show notes
            if "note" in test:
                print(f"  ℹ️  Note: {test['note']}")

        print()

    print("=" * 80)
    print("SUMMARY")
    print("=" * 80)
    print(f"✅ Passed:   {results['passed']}")
    print(f"❌ Failed:   {results['failed']}")
    print(f"⚠️  Warnings: {results['warnings']}")
    print()

    if results["failed"] > 0:
        print("❌ SECURITY AUDIT FAILED - Credential leakage detected!")
        return False
    else:
        print("✅ SECURITY AUDIT PASSED - All credentials properly redacted")
        return True


def test_edge_cases():
    """Test edge cases that might bypass redaction"""

    print("=" * 80)
    print("EDGE CASE TESTING")
    print("=" * 80)
    print()

    edge_cases = [
        {
            "name": "Credential with equals sign in value",
            "input": "api_key=sk-abc=def=ghi",
            "note": "Regex should stop at first alphanumeric boundary"
        },
        {
            "name": "Credential at end of string",
            "input": "Authentication failed with token=bearer123",
            "expected_redacted": ["bearer123"]
        },
        {
            "name": "Credential at start of string",
            "input": "password=secret123 authentication failed",
            "expected_redacted": ["secret123"]
        },
        {
            "name": "Multiple spaces around equals",
            "input": "api_key  =  sk-spaced123",
            "expected_redacted": ["sk-spaced123"]
        },
        {
            "name": "Tab character separator",
            "input": "api_key\t=\tsk-tabbed123",
            "expected_redacted": ["sk-tabbed123"]
        },
        {
            "name": "No value after equals",
            "input": "api_key= failed",
            "note": "Should not crash, just skip"
        }
    ]

    issues = []

    for i, test in enumerate(edge_cases, 1):
        print(f"Edge Case {i}: {test['name']}")
        input_str = test['input']

        try:
            redacted = redact_credentials(input_str)
            print(f"  Input:    {repr(input_str)}")
            print(f"  Redacted: {repr(redacted)}")

            if "expected_redacted" in test:
                for secret in test["expected_redacted"]:
                    if secret in redacted:
                        print(f"  ❌ FAIL: '{secret}' leaked!")
                        issues.append(test['name'])
                    else:
                        print(f"  ✅ PASS: '{secret}' redacted")
            else:
                print(f"  ℹ️  {test.get('note', 'No assertion')}")

        except Exception as e:
            print(f"  ❌ ERROR: {e}")
            issues.append(f"{test['name']} (exception)")

        print()

    if issues:
        print(f"❌ Edge case failures: {', '.join(issues)}")
        return False
    else:
        print("✅ All edge cases handled correctly")
        return True


if __name__ == "__main__":
    print()
    basic_pass = test_credential_redaction()
    print()
    edge_pass = test_edge_cases()
    print()

    if basic_pass and edge_pass:
        print("=" * 80)
        print("🎉 ALL MANUAL TESTS PASSED - PRODUCTION READY")
        print("=" * 80)
        sys.exit(0)
    else:
        print("=" * 80)
        print("🚨 MANUAL TESTS FAILED - SECURITY ISSUES REMAIN")
        print("=" * 80)
        sys.exit(1)
