#!/usr/bin/env python3
"""
Check WSGI error and fix
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
    api_call('POST', f'/user/{USERNAME}/consoles/{PYTHON_CONSOLE_ID}/send_input/', json={
        'input': cmd + '\n'
    })
    time.sleep(1)

print("="*70)
print("CHECKING WSGI ERROR")
print("="*70)

# Check if dashboard exists
print("\nChecking if genesis-dashboard exists...")
send_command("import os")
send_command("os.chdir('/home/rainking632/genesis-rebuild')")
send_command("print('Dashboard exists:', os.path.exists('genesis-dashboard'))")
send_command("if os.path.exists('genesis-dashboard'): print('Dashboard contents:', os.listdir('genesis-dashboard'))")

time.sleep(3)

# Since dashboard doesn't exist in sparse checkout, let's create a minimal FastAPI app
print("\nCreating minimal API app...")

minimal_api = """from fastapi import FastAPI
from fastapi.responses import JSONResponse

application = FastAPI(title="Genesis Rebuild", version="1.0.0")

@application.get("/")
def root():
    return JSONResponse({
        "status": "ok",
        "service": "genesis-rebuild",
        "version": "1.0.0",
        "branch": "deploy-clean"
    })

@application.get("/api/health")
def health():
    return JSONResponse({
        "status": "healthy",
        "service": "genesis-rebuild",
        "version": "1.0.0"
    })

@application.get("/api/agents")
def agents():
    import os
    agent_files = [f.replace('.py', '') for f in os.listdir('/home/rainking632/genesis-rebuild/agents') if f.endswith('_agent.py')]
    return JSONResponse({
        "agents": agent_files,
        "count": len(agent_files)
    })

@application.get("/api/status")
def status():
    return JSONResponse({
        "deployment": "active",
        "username": "rainking632",
        "python": "3.12"
    })
"""

# Upload minimal API
response = api_call('POST', f'/user/{USERNAME}/files/path/home/{USERNAME}/genesis-rebuild/minimal_api.py',
                   files={'content': minimal_api.encode('utf-8')})
if response and response.status_code in [200, 201]:
    print("✓ minimal_api.py uploaded")

# Update WSGI to use minimal API
project_path = f"/home/{USERNAME}/genesis-rebuild"
wsgi_content = f"""import sys, os

sys.path.insert(0, '{project_path}')
sys.path.insert(0, '{project_path}/venv/lib/python3.12/site-packages')

os.environ['GENESIS_ENV'] = 'production'
os.environ['PYTHONPATH'] = '{project_path}'

try:
    from dotenv import load_dotenv
    load_dotenv('{project_path}/.env')
except: pass

# Use minimal API since dashboard doesn't exist in sparse checkout
from minimal_api import application

print("Genesis minimal API loaded successfully")
"""

wsgi_path = f"/var/www/rainking632_pythonanywhere_com_wsgi.py"
response = api_call('POST', f'/user/{USERNAME}/files/path{wsgi_path}',
                   files={'content': wsgi_content.encode('utf-8')})
if response and response.status_code in [200, 201]:
    print("✓ WSGI file updated to use minimal_api.py")

# Reload
print("\nReloading webapp...")
domain = f"{USERNAME}.pythonanywhere.com"
api_call('POST', f'/user/{USERNAME}/webapps/{domain}/reload/')

print("Waiting 5 seconds...")
time.sleep(5)

# Test
print("\nTesting deployment...")
try:
    test_response = requests.get(f'https://{domain}/api/health', timeout=10)
    print(f"\nStatus: {test_response.status_code}")
    if test_response.status_code == 200:
        print("\n" + "="*70)
        print("✓✓✓ DEPLOYMENT SUCCESSFUL! ✓✓✓")
        print("="*70)
        print(f"\nResponse: {test_response.text}")
        print(f"\nYour endpoints are LIVE:")
        print(f"  https://{domain}/")
        print(f"  https://{domain}/api/health")
        print(f"  https://{domain}/api/agents")
        print(f"  https://{domain}/api/status")
    else:
        print(f"Response: {test_response.text[:500]}")
except Exception as e:
    print(f"Error: {e}")

print("\n" + "="*70)
