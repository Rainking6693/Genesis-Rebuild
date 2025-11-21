#!/usr/bin/env python3
"""
Fix .env and test deployment
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

def send_command(cmd):
    response = api_call('POST', f'/user/{USERNAME}/consoles/{PYTHON_CONSOLE_ID}/send_input/', json={
        'input': cmd + '\n'
    })
    time.sleep(1)

print("="*70)
print("FIXING AND TESTING")
print("="*70)

# Create .env file properly
print("\nCreating .env file...")
env_content = """GENESIS_ENV=production
ENVIRONMENT=production
DEBUG=false
A2A_API_KEY=fDTBq7cJX_jt3UggjCe9D2mu5hTWGDuYdWr8AEF9Wss
GENESIS_API_KEY=Rc2bxEoGBR0ZRaFBGmyK8x0RHPAoghrMnDodzSZU7hc
PYTHONPATH=/home/rainking632/genesis-rebuild
"""

# Upload via API instead
response = api_call('POST', f'/user/{USERNAME}/files/path/home/{USERNAME}/genesis-rebuild/.env',
                   files={'content': env_content.encode('utf-8')})
if response and response.status_code in [200, 201]:
    print("✓ .env file uploaded via API")

# Check what directories exist
print("\nChecking project structure...")
send_command("import os")
send_command("os.chdir('/home/rainking632/genesis-rebuild')")
send_command("print('Files:', os.listdir('.'))")
send_command("print('Agents:', os.listdir('agents') if os.path.exists('agents') else 'NO AGENTS DIR')")
send_command("print('Infrastructure:', os.listdir('infrastructure')[:10] if os.path.exists('infrastructure') else 'NO INFRA DIR')")

time.sleep(5)

# Get output
response = api_call('GET', f'/user/{USERNAME}/consoles/{PYTHON_CONSOLE_ID}/get_latest_output/')
if response and response.status_code == 200:
    output = response.json().get('output', '')
    print("\n--- Console Output ---")
    print(output[-2000:])
    print("--- End ---\n")

# Check webapp error log
print("Getting webapp error log...")
domain = f"{USERNAME}.pythonanywhere.com"
response = api_call('GET', f'/user/{USERNAME}/webapps/{domain}/error_log/')
if response and response.status_code == 200:
    error_log = response.json().get('content', '')
    print("\n--- ERROR LOG (last 2000 chars) ---")
    print(error_log[-2000:] if error_log else "No errors")
    print("--- End ---\n")

# Reload
print("Reloading webapp...")
api_call('POST', f'/user/{USERNAME}/webapps/{domain}/reload/')
time.sleep(5)

# Test
print("\nTesting...")
try:
    test_response = requests.get(f'https://{domain}/api/health', timeout=10)
    print(f"Status: {test_response.status_code}")
    if test_response.status_code == 200:
        print("✓✓✓ IT WORKS! ✓✓✓")
        print(test_response.text)
    else:
        print(test_response.text[:500])
except Exception as e:
    print(f"Error: {e}")

print("\n" + "="*70)
