#!/usr/bin/env python3
"""
Test nested dictionary redaction edge case
"""

from infrastructure.security_utils import redact_credentials

# Test deeply nested dictionaries
arguments = {
    "config": {
        "database": {
            "password": "deep_secret",
            "api_key": "nested_key_123"
        },
        "auth": {
            "token": "auth_token_456"
        }
    },
    "normal": "data"
}

# Simulate what A2AConnector does
SENSITIVE_KEYS = {'api_key', 'apikey', 'password', 'passwd', 'pwd', 'token',
                 'auth_token', 'access_token', 'secret', 'bearer'}

def redact_dict(d):
    """Simulate A2AConnector's redaction logic"""
    result = {}
    for key, value in d.items():
        if key.lower() in SENSITIVE_KEYS:
            result[key] = "[REDACTED]"
        elif isinstance(value, str):
            result[key] = redact_credentials(value)
        elif isinstance(value, dict):
            result[key] = {
                k: "[REDACTED]" if k.lower() in SENSITIVE_KEYS
                   else (redact_credentials(str(v)) if isinstance(v, str) else v)
                for k, v in value.items()
            }
        else:
            result[key] = value
    return result

print("Input arguments:")
print(arguments)
print()

print("Redacted output:")
redacted = redact_dict(arguments)
print(redacted)
print()

# Check for issues
issues = []
if "deep_secret" in str(redacted):
    issues.append("❌ FAIL: 'deep_secret' leaked in nested dict!")
if "nested_key_123" in str(redacted):
    issues.append("❌ FAIL: 'nested_key_123' leaked in nested dict!")
if "auth_token_456" in str(redacted):
    issues.append("❌ FAIL: 'auth_token_456' leaked in nested dict!")

if issues:
    print("\n".join(issues))
    print()
    print("🚨 CRITICAL BUG: Current code only handles 1 level of nesting!")
    print("   Nested dict redaction should be RECURSIVE, not flat!")
else:
    print("✅ All deeply nested credentials redacted")
