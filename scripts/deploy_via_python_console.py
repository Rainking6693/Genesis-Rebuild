#!/usr/bin/env python3
"""
Execute deployment using the existing Python console
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
        print(f"Error: {e}")
        return None

print("="*70)
print("DEPLOYING VIA PYTHON CONSOLE")
print("="*70)

# Use Python's subprocess to run the bash script
python_commands = [
    "import subprocess",
    "import os",
    "os.chdir('/home/rainking632')",
    "result = subprocess.run(['bash', 'auto_deploy.sh'], capture_output=True, text=True)",
    "print('=== DEPLOYMENT OUTPUT ===')",
    "print(result.stdout)",
    "print(result.stderr)",
    "print('=== DEPLOYMENT COMPLETE ===')",
]

print(f"\nSending commands to Python console {PYTHON_CONSOLE_ID}...\n")

for i, cmd in enumerate(python_commands, 1):
    print(f"[{i}/{len(python_commands)}] {cmd[:60]}...")
    response = api_call('POST', f'/user/{USERNAME}/consoles/{PYTHON_CONSOLE_ID}/send_input/', json={
        'input': cmd + '\n'
    })
    if response and response.status_code == 200:
        print("  ✓ Sent")
    else:
        print(f"  ✗ Failed: {response.status_code if response else 'No response'}")
    time.sleep(2)

print("\nWaiting 120 seconds for deployment to complete...")
time.sleep(120)

# Get output
print("\nFetching console output...")
response = api_call('GET', f'/user/{USERNAME}/consoles/{PYTHON_CONSOLE_ID}/get_latest_output/')
if response and response.status_code == 200:
    output = response.json().get('output', '')
    print("\n" + "="*70)
    print("CONSOLE OUTPUT")
    print("="*70)
    print(output[-4000:] if output else "No output")
    print("="*70)

# Reload webapp
print("\nReloading webapp...")
domain = f"{USERNAME}.pythonanywhere.com"
response = api_call('POST', f'/user/{USERNAME}/webapps/{domain}/reload/')
if response and response.status_code == 200:
    print("✓ Webapp reloaded")

print("\nWaiting 5 seconds then testing...")
time.sleep(5)

# Test deployment
print("\nTesting deployment...")
try:
    test_response = requests.get(f'https://{domain}/api/health', timeout=10)
    print(f"Status: {test_response.status_code}")
    if test_response.status_code == 200:
        print("✓✓✓ DEPLOYMENT SUCCESSFUL! ✓✓✓")
        print(f"Response: {test_response.text}")
    else:
        print(f"Response: {test_response.text[:500]}")
except Exception as e:
    print(f"Error: {e}")

print("\n" + "="*70)
print("DEPLOYMENT COMPLETE")
print("="*70)
print(f"\nYour endpoints:")
print(f"  https://{domain}/")
print(f"  https://{domain}/api/health")
print(f"  https://{domain}/api/agents")
print("="*70)
