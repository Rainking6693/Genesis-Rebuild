#!/usr/bin/env python3
"""
PythonAnywhere deployment using Basic Auth
"""

import requests
from requests.auth import HTTPBasicAuth
import json
import time

# PythonAnywhere uses username:token for Basic Auth
USERNAME = "rainking6693"  # Your PythonAnywhere username
API_TOKEN = "d96e5e35ee2070fd3d41f83ddb856859a7f4ea7d"
API_BASE = "https://www.pythonanywhere.com/api/v0"

def test_api():
    """Test different API authentication methods"""
    print("Testing API authentication methods...\n")

    # Method 1: Token in header
    print("Method 1: Token in Authorization header")
    try:
        response = requests.get(
            f"{API_BASE}/user/{USERNAME}/cpu/",
            headers={"Authorization": f"Token {API_TOKEN}"},
            timeout=10
        )
        print(f"  Status: {response.status_code}")
        if response.status_code == 200:
            print(f"  ✓ Success! Response: {response.json()}")
            return "token_header"
    except Exception as e:
        print(f"  ✗ Failed: {e}")

    # Method 2: Basic Auth with username:token
    print("\nMethod 2: Basic Auth (username:token)")
    try:
        response = requests.get(
            f"{API_BASE}/user/{USERNAME}/cpu/",
            auth=HTTPBasicAuth(USERNAME, API_TOKEN),
            timeout=10
        )
        print(f"  Status: {response.status_code}")
        if response.status_code == 200:
            print(f"  ✓ Success! Response: {response.json()}")
            return "basic_auth"
    except Exception as e:
        print(f"  ✗ Failed: {e}")

    # Method 3: Try getting consoles list
    print("\nMethod 3: Check consoles endpoint")
    try:
        response = requests.get(
            f"{API_BASE}/user/{USERNAME}/consoles/",
            auth=HTTPBasicAuth(USERNAME, API_TOKEN),
            timeout=10
        )
        print(f"  Status: {response.status_code}")
        if response.status_code == 200:
            print(f"  ✓ Success! Consoles: {response.json()}")
            return "basic_auth"
        elif response.status_code == 404:
            print(f"  Endpoint not found")
        elif response.status_code == 401:
            print(f"  Authentication failed - check username/token")
        else:
            print(f"  Response: {response.text[:200]}")
    except Exception as e:
        print(f"  ✗ Failed: {e}")

    # Method 4: Try webapps endpoint
    print("\nMethod 4: Check webapps endpoint")
    try:
        response = requests.get(
            f"{API_BASE}/user/{USERNAME}/webapps/",
            auth=HTTPBasicAuth(USERNAME, API_TOKEN),
            timeout=10
        )
        print(f"  Status: {response.status_code}")
        if response.status_code == 200:
            webapps = response.json()
            print(f"  ✓ Success! Found {len(webapps)} webapp(s)")
            for app in webapps:
                print(f"    - {app.get('domain_name')}")
            return "basic_auth"
        else:
            print(f"  Response: {response.text[:200]}")
    except Exception as e:
        print(f"  ✗ Failed: {e}")

    print("\n⚠ All authentication methods failed")
    return None

def create_scheduled_task(username, command):
    """Create a scheduled task to run deployment"""
    print(f"\nCreating scheduled task...")
    try:
        response = requests.post(
            f"{API_BASE}/user/{username}/schedule/",
            auth=HTTPBasicAuth(username, API_TOKEN),
            json={
                "command": command,
                "enabled": True,
                "interval": "daily",
                "hour": 0,
                "minute": 0
            },
            timeout=10
        )
        print(f"  Status: {response.status_code}")
        if response.status_code in [200, 201]:
            print(f"  ✓ Task created")
            return response.json()
        else:
            print(f"  Response: {response.text[:200]}")
    except Exception as e:
        print(f"  ✗ Failed: {e}")
    return None

def get_web_app_details(username):
    """Get details of existing web apps"""
    print(f"\nGetting web app details...")
    try:
        response = requests.get(
            f"{API_BASE}/user/{username}/webapps/",
            auth=HTTPBasicAuth(username, API_TOKEN),
            timeout=10
        )
        if response.status_code == 200:
            webapps = response.json()
            print(f"✓ Found {len(webapps)} web app(s)")
            for app in webapps:
                print(f"\nWeb App: {app.get('domain_name')}")
                print(f"  Python version: {app.get('python_version')}")
                print(f"  Source directory: {app.get('source_directory')}")
                print(f"  Virtualenv: {app.get('virtualenv_path')}")
            return webapps
        else:
            print(f"  Status: {response.status_code}")
            print(f"  Response: {response.text[:200]}")
    except Exception as e:
        print(f"  ✗ Failed: {e}")
    return []

def main():
    """Main function"""
    print("="*70)
    print("PYTHONANYWHERE API DIAGNOSTICS & DEPLOYMENT")
    print("="*70)
    print(f"Username: {USERNAME}")
    print(f"API Base: {API_BASE}")
    print("="*70)

    # Test API
    auth_method = test_api()

    if not auth_method:
        print("\n" + "="*70)
        print("⚠ API ACCESS FAILED")
        print("="*70)
        print("\nPossible reasons:")
        print("1. API token is invalid or expired")
        print("2. Username 'rainking6693' is incorrect")
        print("3. API access is not enabled for this account")
        print("4. Network connectivity issues")
        print("\nTo proceed with deployment:")
        print("\n1. Log into https://www.pythonanywhere.com")
        print("2. Go to Account → API Token")
        print("3. Verify your API token matches:")
        print(f"   {API_TOKEN}")
        print("4. Verify your username is: rainking6693")
        print("\n5. Then run deployment manually:")
        print("   - Open Bash console")
        print("   - Run: bash deploy_on_pythonanywhere.sh")
        print("   - Configure web app in Web tab")
        return

    print(f"\n✓ API authentication successful using {auth_method}")

    # Get web app details
    webapps = get_web_app_details(USERNAME)

    if webapps:
        print("\n" + "="*70)
        print("✓ WEB APP EXISTS")
        print("="*70)
        print("\nNext steps to complete deployment:")
        print("\n1. Open Bash console on PythonAnywhere")
        print("2. Run these commands:")
        print("   cd ~")
        print("   git clone -b deploy-clean https://github.com/Rainking6693/Genesis-Rebuild.git genesis-rebuild")
        print("   cd genesis-rebuild")
        print("   python3.12 -m venv venv")
        print("   source venv/bin/activate")
        print("   pip install -r requirements_app.txt")
        print("   pip install fastapi uvicorn[standard] python-dotenv httpx")
        print("\n3. In Web tab, update:")
        print("   - Virtualenv: /home/rainking6693/genesis-rebuild/venv")
        print("   - Copy WSGI file from wsgi_deploy.py")
        print("   - Click Reload")
    else:
        print("\n" + "="*70)
        print("⚠ NO WEB APP FOUND")
        print("="*70)
        print("\nCreate web app first:")
        print("1. Go to Web tab in PythonAnywhere")
        print("2. Click 'Add a new web app'")
        print("3. Choose Python 3.12 → Manual configuration")
        print("4. Then run the deployment commands above")

    print("\n" + "="*70)

if __name__ == "__main__":
    main()
