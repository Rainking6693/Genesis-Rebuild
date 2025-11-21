#!/usr/bin/env python3
"""
Check what console options are actually available
"""

import requests

USERNAME = "rainking632"
API_TOKEN = "d96e5e35ee2070fd3d41f83ddb856859a7f4ea7d"
API_BASE = "https://www.pythonanywhere.com/api/v0"

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

print("Checking available consoles...")
response = api_call('GET', f'/user/{USERNAME}/consoles/')
if response and response.status_code == 200:
    consoles = response.json()
    print(f"\nYou have {len(consoles)} existing console(s):")
    for console in consoles:
        print(f"  ID: {console.get('id')}")
        print(f"  Executable: {console.get('executable')}")
        print(f"  Name: {console.get('name')}")
        print()

print("\nChecking console types available for creation...")
# Try different console types
for console_type in ['bash', 'python3.12', 'python', 'ipython']:
    print(f"\nTrying to create '{console_type}' console...")
    response = api_call('POST', f'/user/{USERNAME}/consoles/', json={
        'executable': console_type
    })
    if response:
        print(f"  Status: {response.status_code}")
        if response.status_code == 201:
            console = response.json()
            print(f"  ✓ Created console ID: {console.get('id')}")
            print(f"  Executable: {console.get('executable')}")

            # Now send the deployment command
            console_id = console.get('id')
            print(f"\n  Sending deployment command to console {console_id}...")
            cmd_response = api_call('POST', f'/user/{USERNAME}/consoles/{console_id}/send_input/', json={
                'input': 'bash /home/rainking632/auto_deploy.sh\n'
            })
            if cmd_response and cmd_response.status_code == 200:
                print("  ✓ Deployment command sent!")
                print("\n  Waiting 90 seconds for execution...")
                import time
                time.sleep(90)

                # Get output
                out_response = api_call('GET', f'/user/{USERNAME}/consoles/{console_id}/get_latest_output/')
                if out_response and out_response.status_code == 200:
                    output = out_response.json().get('output', '')
                    print("\n  --- Console Output ---")
                    print(output[-3000:] if output else "No output")
                    print("  --- End ---")
            break
        else:
            print(f"  Response: {response.text[:200]}")
