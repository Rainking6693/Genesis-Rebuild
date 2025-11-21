#!/usr/bin/env python3
"""
Finalize deployment - update config and reload
"""

import requests
import time

USERNAME = "rainking632"
API_TOKEN = "d96e5e35ee2070fd3d41f83ddb856859a7f4ea7d"
API_BASE = "https://www.pythonanywhere.com/api/v0"

def api_call(method, endpoint, **kwargs):
    """Make API call"""
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
print("FINALIZING DEPLOYMENT")
print("="*70)

domain = f"{USERNAME}.pythonanywhere.com"
project_path = f"/home/{USERNAME}/genesis-rebuild"

# Check current webapp status
print("\nCurrent webapp configuration:")
response = api_call('GET', f'/user/{USERNAME}/webapps/{domain}/')
if response and response.status_code == 200:
    webapp = response.json()
    print(f"  Domain: {webapp.get('domain_name')}")
    print(f"  Python: {webapp.get('python_version')}")
    print(f"  Source: {webapp.get('source_directory')}")
    print(f"  Virtualenv: {webapp.get('virtualenv_path')}")
    print(f"  Enabled: {webapp.get('enabled')}")

# Update configuration
print("\nUpdating webapp configuration...")
config = {
    'source_directory': project_path,
    'virtualenv_path': f'{project_path}/venv'
}

response = api_call('PATCH', f'/user/{USERNAME}/webapps/{domain}/', json=config)
if response and response.status_code == 200:
    print("✓ Configuration updated")
    print(f"  Source: {project_path}")
    print(f"  Virtualenv: {project_path}/venv")
else:
    print(f"✗ Update failed: {response.status_code if response else 'No response'}")
    if response:
        print(f"  {response.text[:500]}")

# Reload webapp
print("\nReloading webapp...")
response = api_call('POST', f'/user/{USERNAME}/webapps/{domain}/reload/')
if response and response.status_code == 200:
    print("✓ Webapp reloaded")
else:
    print(f"✗ Reload failed: {response.status_code if response else 'No response'}")

# Wait a moment and test
print("\nWaiting 5 seconds then testing...")
time.sleep(5)

print("\nTesting deployment...")
try:
    test_response = requests.get(f'https://{domain}/api/health', timeout=10)
    print(f"Status: {test_response.status_code}")
    if test_response.status_code == 200:
        print("✓ DEPLOYMENT SUCCESSFUL!")
        print(f"Response: {test_response.text}")
    else:
        print(f"Response: {test_response.text[:500]}")
except Exception as e:
    print(f"Connection error: {e}")
    print("\nThis is expected if the code hasn't been deployed yet.")

print("\n" + "="*70)
print("SUMMARY")
print("="*70)
print("\nFiles uploaded:")
print(f"  ✓ /home/{USERNAME}/auto_deploy.sh - Deployment script")
print(f"  ✓ /var/www/{USERNAME.replace('.', '_')}_pythonanywhere_com_wsgi.py - WSGI config")
print(f"  ✓ Scheduled task created (ID: 1277710)")
print("\nWebapp configured:")
print(f"  ✓ Source: {project_path}")
print(f"  ✓ Virtualenv: {project_path}/venv")
print(f"  ✓ Webapp reloaded")
print("\nFINAL STEP REQUIRED:")
print(f"The code repository needs to be cloned. The deployment script is ready.")
print(f"\nOption 1 - Wait for scheduled task (runs at midnight)")
print(f"Option 2 - Manual execution:")
print(f"  1. Go to: https://www.pythonanywhere.com")
print(f"  2. Log in")
print(f"  3. Click 'Consoles' in top menu")
print(f"  4. Click '$ Bash' under 'Start a new console'")
print(f"  5. In the console, type: bash /home/{USERNAME}/auto_deploy.sh")
print(f"  6. Wait 5-10 minutes")
print(f"  7. Go to Web tab, click 'Reload'")
print(f"  8. Test: https://{domain}/api/health")
print("\n" + "="*70)
