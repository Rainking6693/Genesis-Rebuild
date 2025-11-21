#!/usr/bin/env python3
"""
Trigger the deployment task to run now
"""

import requests
import time

USERNAME = "rainking632"
API_TOKEN = "d96e5e35ee2070fd3d41f83ddb856859a7f4ea7d"
API_BASE = "https://www.pythonanywhere.com/api/v0"
TASK_ID = 1277710

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
print("TRIGGERING DEPLOYMENT TASK")
print("="*70)

# Check task
print(f"\nChecking task {TASK_ID}...")
response = api_call('GET', f'/user/{USERNAME}/schedule/{TASK_ID}/')
if response and response.status_code == 200:
    task = response.json()
    print(f"✓ Task found: {task.get('command')}")
    print(f"  Enabled: {task.get('enabled')}")
else:
    print("✗ Task not found")

# Alternative: Use always_on task endpoint
print("\nTrying to execute via always-on task...")
response = api_call('POST', f'/user/{USERNAME}/always_on/', json={
    'command': f'bash /home/{USERNAME}/auto_deploy.sh',
    'enabled': True,
    'description': 'Genesis deployment execution'
})

if response:
    print(f"Status: {response.status_code}")
    if response.status_code in [200, 201]:
        print("✓ Execution task created")
    else:
        print(f"Response: {response.text[:500]}")

# Try to get list of consoles to see if we can find an existing one
print("\nChecking for existing consoles...")
response = api_call('GET', f'/user/{USERNAME}/consoles/')
if response and response.status_code == 200:
    consoles = response.json()
    print(f"Found {len(consoles)} console(s)")

    if consoles:
        # Use existing console
        console_id = consoles[0]['id']
        print(f"Using console {console_id}")

        # Send deployment command
        print("Sending deployment command to console...")
        response = api_call('POST', f'/user/{USERNAME}/consoles/{console_id}/send_input/', json={
            'input': f'bash /home/{USERNAME}/auto_deploy.sh\n'
        })

        if response and response.status_code == 200:
            print("✓ Command sent!")
            print("\nWaiting 60 seconds for execution...")
            time.sleep(60)

            # Get output
            response = api_call('GET', f'/user/{USERNAME}/consoles/{console_id}/get_latest_output/')
            if response and response.status_code == 200:
                output = response.json().get('output', '')
                print("\n--- Console Output ---")
                print(output[-2000:] if output else "No output yet")
                print("--- End ---")

print("\n" + "="*70)
print("DEPLOYMENT STATUS")
print("="*70)
print("\nThe deployment script has been uploaded to:")
print(f"  /home/{USERNAME}/auto_deploy.sh")
print("\nIt will run automatically via scheduled task, OR:")
print(f"1. Go to: https://www.pythonanywhere.com/user/{USERNAME}/consoles/")
print("2. Open any Bash console")
print(f"3. Run: bash /home/{USERNAME}/auto_deploy.sh")
print("\nThen:")
print("4. Go to Web tab")
print("5. Click 'Reload rainking632.pythonanywhere.com'")
print("6. Test: curl https://rainking632.pythonanywhere.com/api/health")
print("="*70)
