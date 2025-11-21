#!/usr/bin/env python3
"""
Deploy visual dashboard to PythonAnywhere
"""

import requests

USERNAME = "rainking632"
API_TOKEN = "d96e5e35ee2070fd3d41f83ddb856859a7f4ea7d"

print("="*70)
print("DEPLOYING VISUAL DASHBOARD")
print("="*70)

# Read dashboard HTML
with open('/home/genesis/genesis-rebuild/dashboard.html', 'r') as f:
    dashboard_html = f.read()

# Upload dashboard
print("\nUploading dashboard...")
response = requests.post(
    f'https://www.pythonanywhere.com/api/v0/user/{USERNAME}/files/path/home/{USERNAME}/genesis-rebuild/dashboard.html',
    headers={'Authorization': f'Token {API_TOKEN}'},
    files={'content': dashboard_html.encode('utf-8')}
)

if response.status_code in [200, 201]:
    print("✓ Dashboard uploaded")

# Update WSGI to serve dashboard at root
wsgi_content = """# Genesis WSGI with Dashboard
import sys
import json
import os

sys.path.insert(0, '/home/rainking632/genesis-rebuild')

def application(environ, start_response):
    path = environ.get('PATH_INFO', '/')

    # Serve dashboard at root
    if path == '/':
        with open('/home/rainking632/genesis-rebuild/dashboard.html', 'r') as f:
            content = f.read()
        status = '200 OK'
        headers = [('Content-Type', 'text/html')]
        start_response(status, headers)
        return [content.encode('utf-8')]

    # API endpoints
    headers = [('Content-Type', 'application/json')]

    if path == '/api/health':
        status = '200 OK'
        response = json.dumps({
            "status": "healthy",
            "service": "genesis-rebuild",
            "version": "1.0.0",
            "message": "Genesis with Dashboard"
        })
    elif path == '/api/agents':
        try:
            agent_files = [f.replace('.py', '') for f in os.listdir('/home/rainking632/genesis-rebuild/agents') if f.endswith('_agent.py')]
            status = '200 OK'
            response = json.dumps({
                "agents": agent_files,
                "count": len(agent_files)
            })
        except Exception as e:
            status = '500 Internal Server Error'
            response = json.dumps({"error": str(e)})
    elif path == '/api/status':
        status = '200 OK'
        response = json.dumps({
            "deployment": "active",
            "username": "rainking632",
            "python": "3.12",
            "dashboard": "enabled"
        })
    else:
        status = '404 Not Found'
        response = json.dumps({"error": "Not found"})

    start_response(status, headers)
    return [response.encode('utf-8')]
"""

print("\nUpdating WSGI to serve dashboard...")
response = requests.post(
    f'https://www.pythonanywhere.com/api/v0/user/{USERNAME}/files/path/var/www/rainking632_pythonanywhere_com_wsgi.py',
    headers={'Authorization': f'Token {API_TOKEN}'},
    files={'content': wsgi_content.encode('utf-8')}
)

if response.status_code in [200, 201]:
    print("✓ WSGI updated")

# Reload webapp
print("\nReloading webapp...")
response = requests.post(
    f'https://www.pythonanywhere.com/api/v0/user/{USERNAME}/webapps/{USERNAME}.pythonanywhere.com/reload/',
    headers={'Authorization': f'Token {API_TOKEN}'}
)

if response.status_code == 200:
    print("✓ Webapp reloaded")

import time
time.sleep(5)

# Test
print("\nTesting dashboard...")
response = requests.get(f'https://{USERNAME}.pythonanywhere.com/')
if response.status_code == 200 and 'Genesis Control Dashboard' in response.text:
    print("✓✓✓ DASHBOARD IS LIVE!")
    print("\n" + "="*70)
    print("SUCCESS!")
    print("="*70)
    print(f"\n🎉 Your visual dashboard is now live at:")
    print(f"\n   https://{USERNAME}.pythonanywhere.com/")
    print(f"\nOpen this URL in your browser to see your real-time dashboard!")
    print("="*70)
else:
    print("⚠ Dashboard may not be fully loaded yet, give it a moment")
