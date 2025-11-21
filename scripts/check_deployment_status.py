#!/usr/bin/env python3
"""
Check if deployment actually completed
"""

import requests
import time

USERNAME = "rainking632"
API_TOKEN = "d96e5e35ee2070fd3d41f83ddb856859a7f4ea7d"
API_BASE = "https://www.pythonanywhere.com/api/v0"
PYTHON_CONSOLE_ID = 43534121

def api_call(method, endpoint, **kwargs):
    url = f"{API_BASE}{endpoint}"
    headers = kwargs.pop('headers', {})
    headers['Authorization'] = f'Token {API_TOKEN}'
    try:
        response = requests.request(method, url, headers=headers, timeout=60, **kwargs)
        return response
    except Exception as e:
        return None

print("="*70)
print("CHECKING DEPLOYMENT STATUS")
print("="*70)

# Check if genesis-rebuild directory exists
print("\nChecking if project directory exists...")
response = api_call('GET', f'/user/{USERNAME}/files/path/home/{USERNAME}/genesis-rebuild/')
if response:
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        print("✓ /home/rainking632/genesis-rebuild EXISTS!")
    else:
        print("✗ Directory doesn't exist yet")

# Check if venv exists
print("\nChecking if venv exists...")
response = api_call('GET', f'/user/{USERNAME}/files/path/home/{USERNAME}/genesis-rebuild/venv/')
if response and response.status_code == 200:
    print("✓ Virtual environment EXISTS!")
else:
    print("✗ Virtual environment doesn't exist")

# Check .env file
print("\nChecking .env file...")
response = api_call('GET', f'/user/{USERNAME}/files/path/home/{USERNAME}/genesis-rebuild/.env')
if response and response.status_code == 200:
    print("✓ .env file EXISTS!")
else:
    print("✗ .env file doesn't exist")

# Get more console output
print("\nGetting full console output...")
response = api_call('GET', f'/user/{USERNAME}/consoles/{PYTHON_CONSOLE_ID}/get_latest_output/')
if response and response.status_code == 200:
    output = response.json().get('output', '')
    # Look for deployment markers
    if 'DEPLOYMENT COMPLETE' in output or 'Cloning into' in output:
        print("✓ Deployment appears to have run!")
    if 'error' in output.lower() or 'failed' in output.lower():
        print("⚠ Errors detected in output")

    print("\n--- Last 5000 chars of console ---")
    print(output[-5000:])
    print("--- End ---")

# Test webapp
domain = f"{USERNAME}.pythonanywhere.com"
print(f"\nTesting {domain}...")
try:
    test_response = requests.get(f'https://{domain}/api/health', timeout=10)
    print(f"Status: {test_response.status_code}")
    if test_response.status_code == 200:
        print("✓✓✓ WEBAPP IS WORKING! ✓✓✓")
        print(f"Response: {test_response.text}")
    elif test_response.status_code == 500:
        print("✗ 500 error - likely project not cloned yet")
except Exception as e:
    print(f"Connection error: {e}")

print("\n" + "="*70)
