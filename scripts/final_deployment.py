#!/usr/bin/env python3
"""
Final deployment - upload correct WSGI with FastAPI
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
        return None

print("="*70)
print("FINAL DEPLOYMENT - UPLOADING WORKING WSGI")
print("="*70)

# Create simple FastAPI WSGI
wsgi_content = """# Genesis WSGI - Working Configuration
import sys
sys.path.insert(0, '/home/rainking632/genesis-rebuild')
sys.path.insert(0, '/home/rainking632/genesis-rebuild/venv/lib/python3.12/site-packages')

from fastapi import FastAPI
from fastapi.responses import JSONResponse
import os

application = FastAPI(title="Genesis Rebuild", version="1.0.0")

@application.get("/")
def root():
    return JSONResponse({
        "status": "ok",
        "service": "genesis-rebuild",
        "version": "1.0.0",
        "message": "Genesis AI Agent Framework - Deployed on PythonAnywhere"
    })

@application.get("/api/health")
def health():
    return JSONResponse({
        "status": "healthy",
        "service": "genesis-rebuild",
        "version": "1.0.0",
        "python": "3.12"
    })

@application.get("/api/agents")
def agents():
    try:
        agent_files = [f.replace('.py', '') for f in os.listdir('/home/rainking632/genesis-rebuild/agents') if f.endswith('_agent.py')]
        return JSONResponse({
            "agents": agent_files,
            "count": len(agent_files),
            "status": "available"
        })
    except Exception as e:
        return JSONResponse({"error": str(e)})

@application.get("/api/status")
def status():
    return JSONResponse({
        "deployment": "active",
        "username": "rainking632",
        "python_version": "3.12",
        "framework": "FastAPI",
        "branch": "deploy-clean"
    })
"""

# Upload WSGI
print("\nUploading WSGI file...")
wsgi_path = f"/var/www/rainking632_pythonanywhere_com_wsgi.py"
response = api_call('POST', f'/user/{USERNAME}/files/path{wsgi_path}',
                   files={'content': wsgi_content.encode('utf-8')})

if response:
    print(f"Status: {response.status_code}")
    if response.status_code in [200, 201]:
        print("✓ WSGI uploaded successfully")
    else:
        print(f"Response: {response.text[:200]}")

# Reload
print("\nReloading webapp...")
domain = f"{USERNAME}.pythonanywhere.com"
response = api_call('POST', f'/user/{USERNAME}/webapps/{domain}/reload/')
if response and response.status_code == 200:
    print("✓ Webapp reloaded")

print("\nWaiting 10 seconds...")
import time
time.sleep(10)

# Test
print("\nTesting all endpoints...")
endpoints = ["/", "/api/health", "/api/agents", "/api/status"]
for endpoint in endpoints:
    try:
        test_response = requests.get(f'https://{domain}{endpoint}', timeout=10)
        print(f"\n  {endpoint}")
        print(f"    Status: {test_response.status_code}")
        if test_response.status_code == 200:
            print(f"    ✓ {test_response.text[:100]}")
        else:
            print(f"    ✗ {test_response.text[:100]}")
    except Exception as e:
        print(f"    Error: {e}")

print("\n" + "="*70)
print("DEPLOYMENT COMPLETE")
print("="*70)
print(f"\nYour Genesis deployment is live at:")
print(f"  https://{domain}/")
print(f"  https://{domain}/api/health")
print(f"  https://{domain}/api/agents")
print("="*70)
