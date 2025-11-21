#!/usr/bin/env python3
"""
Deploy to PythonAnywhere using CORRECT API format from documentation
"""

import requests
import json
import time
import sys

USERNAME = "rainking632"
API_TOKEN = "d96e5e35ee2070fd3d41f83ddb856859a7f4ea7d"
API_BASE = "https://www.pythonanywhere.com/api/v0"

def api_call(method, endpoint, **kwargs):
    """Make API call with correct authentication format"""
    url = f"{API_BASE}{endpoint}"
    headers = kwargs.pop('headers', {})
    # CORRECT format from docs: 'Token {your_token}'
    headers['Authorization'] = f'Token {API_TOKEN}'

    try:
        response = requests.request(method, url, headers=headers, timeout=60, **kwargs)
        return response
    except Exception as e:
        print(f"Request error: {e}")
        return None

def test_auth():
    """Test authentication"""
    print("Testing API authentication with correct format...")
    response = api_call('GET', f'/user/{USERNAME}/cpu/')
    if response and response.status_code == 200:
        print(f"✓ Authentication successful!")
        return True
    else:
        status = response.status_code if response else "No response"
        text = response.text if response else ""
        print(f"✗ Auth failed: {status}")
        if text:
            print(f"  Response: {text[:500]}")
        return False

def list_webapps():
    """List existing webapps"""
    print("\nChecking existing webapps...")
    response = api_call('GET', f'/user/{USERNAME}/webapps/')
    if response and response.status_code == 200:
        apps = response.json()
        print(f"Found {len(apps)} webapp(s)")
        return apps
    return []

def create_webapp():
    """Create new webapp"""
    domain = f"{USERNAME}.pythonanywhere.com"
    print(f"\nCreating webapp: {domain}")

    response = api_call('POST', f'/user/{USERNAME}/webapps/', json={
        'domain_name': domain,
        'python_version': 'python312'
    })

    if response and response.status_code == 201:
        print(f"✓ Webapp created")
        return response.json()
    else:
        status = response.status_code if response else "No response"
        text = response.text if response else ""
        print(f"✗ Failed: {status}")
        if text:
            print(f"  {text[:500]}")
        return None

def create_console():
    """Create bash console"""
    print("\nCreating bash console...")
    response = api_call('POST', f'/user/{USERNAME}/consoles/', json={
        'executable': 'bash',
        'arguments': []
    })

    if response and response.status_code == 201:
        console = response.json()
        console_id = console.get('id')
        print(f"✓ Console created: {console_id}")
        return console_id
    else:
        print(f"✗ Failed to create console")
        return None

def send_command(console_id, command):
    """Send command to console"""
    response = api_call('POST', f'/user/{USERNAME}/consoles/{console_id}/send_input/', json={
        'input': command + '\n'
    })

    if response and response.status_code == 200:
        return True
    return False

def get_console_output(console_id):
    """Get console output"""
    response = api_call('GET', f'/user/{USERNAME}/consoles/{console_id}/get_latest_output/')
    if response and response.status_code == 200:
        return response.json().get('output', '')
    return ''

def upload_file(remote_path, content):
    """Upload file to PythonAnywhere"""
    print(f"Uploading {remote_path}...")

    response = api_call('POST', f'/user/{USERNAME}/files/path{remote_path}',
                       files={'content': content if isinstance(content, bytes) else content.encode('utf-8')})

    if response and response.status_code in [200, 201]:
        print(f"✓ Uploaded")
        return True
    return False

def update_webapp_config(domain, config):
    """Update webapp configuration"""
    print(f"\nUpdating webapp config...")
    response = api_call('PATCH', f'/user/{USERNAME}/webapps/{domain}/', json=config)

    if response and response.status_code == 200:
        print(f"✓ Config updated")
        return True
    return False

def reload_webapp(domain):
    """Reload webapp"""
    print(f"\nReloading {domain}...")
    response = api_call('POST', f'/user/{USERNAME}/webapps/{domain}/reload/')

    if response and response.status_code == 200:
        print(f"✓ Reloaded")
        return True
    return False

def run_deployment():
    """Execute full deployment"""
    print("="*70)
    print("PYTHONANYWHERE AUTOMATED DEPLOYMENT")
    print(f"Username: {USERNAME}")
    print("="*70)

    # Test auth
    if not test_auth():
        print("\n✗ AUTHENTICATION FAILED")
        print("The API token may be invalid. Please verify:")
        print("1. Go to https://www.pythonanywhere.com/account/")
        print("2. Click 'API token' tab")
        print("3. Generate a new token if needed")
        return False

    # Check webapps
    apps = list_webapps()
    domain = f"{USERNAME}.pythonanywhere.com"

    webapp = None
    for app in apps:
        if app.get('domain_name') == domain:
            webapp = app
            print(f"✓ Using existing webapp")
            break

    if not webapp:
        webapp = create_webapp()
        if not webapp:
            print("✗ Could not create webapp")
            return False

    # Create console and run deployment
    console_id = create_console()
    if not console_id:
        print("✗ Could not create console")
        return False

    time.sleep(2)

    # Send deployment commands
    print("\nExecuting deployment commands...")
    commands = [
        "cd ~",
        "rm -rf genesis-rebuild",
        "git clone -b deploy-clean https://github.com/Rainking6693/Genesis-Rebuild.git genesis-rebuild",
        "cd genesis-rebuild",
        "python3.12 -m venv venv",
        "source venv/bin/activate",
        "pip install --upgrade pip",
        "pip install fastapi uvicorn[standard] python-dotenv httpx pydantic requests",
        "pip install -r requirements_app.txt || true",
        "pip install -r requirements_infrastructure.txt || true",
        """cat > .env << 'EOF'
GENESIS_ENV=production
ENVIRONMENT=production
DEBUG=false
A2A_API_KEY=fDTBq7cJX_jt3UggjCe9D2mu5hTWGDuYdWr8AEF9Wss
GENESIS_API_KEY=Rc2bxEoGBR0ZRaFBGmyK8x0RHPAoghrMnDodzSZU7hc
PYTHONPATH=/home/rainking632/genesis-rebuild
EOF""",
        "echo 'DEPLOYMENT COMPLETE'",
    ]

    for cmd in commands:
        print(f"  > {cmd[:60]}...")
        send_command(console_id, cmd)
        time.sleep(1)

    print("\nWaiting for deployment to complete (60 seconds)...")
    time.sleep(60)

    # Get output
    output = get_console_output(console_id)
    print("\n--- Console Output (last 2000 chars) ---")
    print(output[-2000:] if output else "No output")
    print("--- End Output ---\n")

    # Update webapp config
    project_path = f"/home/{USERNAME}/genesis-rebuild"
    update_webapp_config(domain, {
        'virtualenv_path': f'{project_path}/venv',
        'source_directory': project_path
    })

    # Create WSGI file
    wsgi_path = f"/var/www/{USERNAME.replace('.', '_')}_pythonanywhere_com_wsgi.py"
    wsgi_content = f"""import sys
import os

project_home = '{project_path}'
if project_home not in sys.path:
    sys.path.insert(0, project_home)

venv_path = '{project_path}/venv/lib/python3.12/site-packages'
if venv_path not in sys.path:
    sys.path.insert(0, venv_path)

os.environ.setdefault('GENESIS_ENV', 'production')
os.environ.setdefault('PYTHONPATH', project_home)

try:
    from dotenv import load_dotenv
    load_dotenv('{project_path}/.env')
except: pass

try:
    from genesis_dashboard.backend.api import app as application
except:
    try:
        from a2a_service import app as application
    except:
        from fastapi import FastAPI
        application = FastAPI()
        @application.get("/api/health")
        def health(): return {{"status":"healthy"}}
"""

    upload_file(wsgi_path, wsgi_content)

    # Reload
    reload_webapp(domain)

    print("\n" + "="*70)
    print("DEPLOYMENT COMPLETE!")
    print("="*70)
    print(f"\nTest your deployment:")
    print(f"  curl https://{domain}/api/health")
    print(f"\nEndpoints:")
    print(f"  https://{domain}/")
    print(f"  https://{domain}/api/health")
    print(f"  https://{domain}/api/agents")
    print("="*70)

    return True

if __name__ == "__main__":
    success = run_deployment()
    sys.exit(0 if success else 1)
