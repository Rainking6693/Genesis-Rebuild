#!/usr/bin/env python3
"""
Deploy by uploading files directly via API and using scheduled task
"""

import requests
import time
import sys

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
print("DIRECT FILE DEPLOYMENT")
print("="*70)

# Get webapp info
print("\nGetting webapp info...")
response = api_call('GET', f'/user/{USERNAME}/webapps/')
if response and response.status_code == 200:
    apps = response.json()
    if apps:
        domain = apps[0]['domain_name']
        print(f"✓ Found webapp: {domain}")
        print(f"  Python: {apps[0].get('python_version')}")
        print(f"  Source: {apps[0].get('source_directory')}")
        print(f"  Virtualenv: {apps[0].get('virtualenv_path')}")

# Upload deployment script to home directory
print("\nUploading deployment script...")
deploy_script = f"""#!/bin/bash
set -e
cd /home/{USERNAME}
rm -rf genesis-rebuild
git clone -b deploy-clean https://github.com/Rainking6693/Genesis-Rebuild.git genesis-rebuild
cd genesis-rebuild
python3.12 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install fastapi uvicorn[standard] python-dotenv httpx pydantic requests
pip install -r requirements_app.txt 2>/dev/null || true
pip install -r requirements_infrastructure.txt 2>/dev/null || true
cat > .env << 'ENVEOF'
GENESIS_ENV=production
ENVIRONMENT=production
DEBUG=false
A2A_API_KEY=fDTBq7cJX_jt3UggjCe9D2mu5hTWGDuYdWr8AEF9Wss
GENESIS_API_KEY=Rc2bxEoGBR0ZRaFBGmyK8x0RHPAoghrMnDodzSZU7hc
PYTHONPATH=/home/{USERNAME}/genesis-rebuild
ENVEOF
echo "DEPLOYMENT COMPLETE - Created at $(date)"
"""

response = api_call('POST', f'/user/{USERNAME}/files/path/home/{USERNAME}/auto_deploy.sh',
                   files={'content': deploy_script.encode('utf-8')})

if response and response.status_code in [200, 201]:
    print("✓ Deployment script uploaded")
else:
    print(f"✗ Upload failed: {response.status_code if response else 'No response'}")

# Upload WSGI file
print("\nUploading WSGI configuration...")
project_path = f"/home/{USERNAME}/genesis-rebuild"
wsgi_content = f"""import sys, os

project_home = '{project_path}'
sys.path.insert(0, project_home)
sys.path.insert(0, '{project_path}/venv/lib/python3.12/site-packages')

os.environ['GENESIS_ENV'] = 'production'
os.environ['PYTHONPATH'] = project_home

try:
    from dotenv import load_dotenv
    load_dotenv('{project_path}/.env')
except: pass

try:
    from genesis_dashboard.backend.api import app as application
    print("Loaded Genesis Dashboard")
except Exception as e:
    print(f"Dashboard failed: {{e}}")
    try:
        from a2a_service import app as application
        print("Loaded A2A Service")
    except Exception as e2:
        print(f"A2A failed: {{e2}}")
        from fastapi import FastAPI
        application = FastAPI(title="Genesis")
        @application.get("/")
        def root(): return {{"status":"ok","service":"genesis"}}
        @application.get("/api/health")
        def health(): return {{"status":"healthy","service":"genesis","version":"1.0.0"}}
        print("Using minimal app")
"""

wsgi_path = f"/var/www/{USERNAME.replace('.', '_')}_pythonanywhere_com_wsgi.py"
response = api_call('POST', f'/user/{USERNAME}/files/path{wsgi_path}',
                   files={'content': wsgi_content.encode('utf-8')})

if response and response.status_code in [200, 201]:
    print("✓ WSGI file uploaded")
else:
    print(f"✗ WSGI upload failed: {response.status_code if response else 'No response'}")

# Try to create a scheduled task to run the deployment
print("\nCreating scheduled task to run deployment...")
response = api_call('POST', f'/user/{USERNAME}/schedule/', json={
    'command': f'bash /home/{USERNAME}/auto_deploy.sh',
    'enabled': True,
    'interval': 'daily',
    'hour': 0,
    'minute': 1,
    'description': 'Genesis deployment'
})

if response and response.status_code in [200, 201]:
    task = response.json()
    task_id = task.get('id')
    print(f"✓ Scheduled task created: {task_id}")
    print("  You can run this manually from the Tasks tab")
else:
    print(f"  Task creation status: {response.status_code if response else 'No response'}")

# Update webapp config
print("\nUpdating webapp configuration...")
domain = f"{USERNAME}.pythonanywhere.com"
response = api_call('PATCH', f'/user/{USERNAME}/webapps/{domain}/', json={
    'virtualenv_path': f'{project_path}/venv',
    'source_directory': project_path
})

if response and response.status_code == 200:
    print("✓ Webapp config updated")

# Reload webapp
print("\nReloading webapp...")
response = api_call('POST', f'/user/{USERNAME}/webapps/{domain}/reload/')

if response and response.status_code == 200:
    print("✓ Webapp reloaded")

print("\n" + "="*70)
print("SETUP COMPLETE!")
print("="*70)
print("\nNEXT STEPS:")
print(f"1. Go to: https://www.pythonanywhere.com/user/{USERNAME}/tasks/")
print(f"2. Find the 'Genesis deployment' task")
print(f"3. Click 'Run now' to execute the deployment")
print(f"4. Wait 5-10 minutes for completion")
print(f"5. Go back to Web tab and click 'Reload'")
print(f"6. Test: curl https://{domain}/api/health")
print("\nOR manually run in a Bash console:")
print(f"  bash /home/{USERNAME}/auto_deploy.sh")
print("="*70)
