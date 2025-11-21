#!/usr/bin/env python3
"""
Minimal deployment - clean up and deploy only essential files
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
    """Send command to console"""
    print(f"  > {cmd[:80]}...")
    response = api_call('POST', f'/user/{USERNAME}/consoles/{PYTHON_CONSOLE_ID}/send_input/', json={
        'input': cmd + '\n'
    })
    time.sleep(2)
    return response and response.status_code == 200

print("="*70)
print("MINIMAL DEPLOYMENT - FIXING DISK QUOTA ISSUE")
print("="*70)

commands = [
    # Clean up
    "import subprocess, os",
    "subprocess.run(['rm', '-rf', '/home/rainking632/genesis-rebuild'], check=False)",

    # Clone with sparse checkout - only essential files
    "os.chdir('/home/rainking632')",
    "subprocess.run(['git', 'clone', '--filter=blob:none', '--sparse', '-b', 'deploy-clean', 'https://github.com/Rainking6693/Genesis-Rebuild.git', 'genesis-rebuild'])",
    "os.chdir('genesis-rebuild')",

    # Only checkout essential directories
    "subprocess.run(['git', 'sparse-checkout', 'set', 'agents', 'infrastructure', 'genesis-dashboard/backend', 'requirements_app.txt', 'requirements_infrastructure.txt'])",

    # Create venv
    "subprocess.run(['python3.12', '-m', 'venv', 'venv'])",

    # Install minimal dependencies
    "subprocess.run(['/home/rainking632/genesis-rebuild/venv/bin/pip', 'install', '--upgrade', 'pip'])",
    "subprocess.run(['/home/rainking632/genesis-rebuild/venv/bin/pip', 'install', 'fastapi', 'uvicorn[standard]', 'python-dotenv', 'httpx', 'pydantic'])",

    # Create .env
    """with open('.env', 'w') as f: f.write('''GENESIS_ENV=production
ENVIRONMENT=production
DEBUG=false
A2A_API_KEY=fDTBq7cJX_jt3UggjCe9D2mu5hTWGDuYdWr8AEF9Wss
GENESIS_API_KEY=Rc2bxEoGBR0ZRaFBGmyK8x0RHPAoghrMnDodzSZU7hc
PYTHONPATH=/home/rainking632/genesis-rebuild
''')""",

    "print('===DEPLOYMENT COMPLETE===')",
]

print("\nExecuting minimal deployment commands...\n")
for i, cmd in enumerate(commands, 1):
    print(f"[{i}/{len(commands)}]")
    send_command(cmd)

print("\nWaiting 90 seconds for completion...")
time.sleep(90)

# Get output
print("\nFetching output...")
response = api_call('GET', f'/user/{USERNAME}/consoles/{PYTHON_CONSOLE_ID}/get_latest_output/')
if response and response.status_code == 200:
    output = response.json().get('output', '')
    print("\n--- Output (last 3000 chars) ---")
    print(output[-3000:])
    print("--- End ---\n")

# Reload webapp
domain = f"{USERNAME}.pythonanywhere.com"
print("Reloading webapp...")
api_call('POST', f'/user/{USERNAME}/webapps/{domain}/reload/')

print("\nWaiting 5 seconds...")
time.sleep(5)

# Test
print("\nTesting...")
try:
    test_response = requests.get(f'https://{domain}/api/health', timeout=10)
    print(f"Status: {test_response.status_code}")
    if test_response.status_code == 200:
        print("✓✓✓ SUCCESS! ✓✓✓")
        print(test_response.text)
    else:
        print(test_response.text[:500])
except Exception as e:
    print(f"Error: {e}")

print("\n" + "="*70)
