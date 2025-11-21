#!/usr/bin/env python3
"""
Deploy Genesis Business Dashboard to PythonAnywhere
"""
import requests
import os
import json

USERNAME = "rainking632"
API_TOKEN = "d96e5e35ee2070fd3d41f83ddb856859a7f4ea7d"

print("="*70)
print("DEPLOYING GENESIS BUSINESS DASHBOARD")
print("="*70)

# Read dashboard files
dashboard_static_dir = '/home/genesis/genesis-rebuild/monitoring/dashboard_static'

print("\n📁 Reading dashboard files...")
with open(f'{dashboard_static_dir}/index.html', 'r') as f:
    index_html = f.read()
with open(f'{dashboard_static_dir}/style.css', 'r') as f:
    style_css = f.read()
with open(f'{dashboard_static_dir}/dashboard.js', 'r') as f:
    dashboard_js = f.read()
with open(f'{dashboard_static_dir}/dashboard-data.json', 'r') as f:
    dashboard_data = f.read()

print("✓ Dashboard files loaded")

# Create WSGI application that serves the dashboard
wsgi_content = """# Genesis Business Dashboard WSGI
import sys
import json
import os
from datetime import datetime

sys.path.insert(0, '/home/rainking632/genesis-rebuild')

def application(environ, start_response):
    path = environ.get('PATH_INFO', '/')

    # Serve dashboard at root
    if path == '/':
        with open('/home/rainking632/genesis-rebuild/monitoring/dashboard_static/index.html', 'r') as f:
            content = f.read()
        status = '200 OK'
        headers = [('Content-Type', 'text/html; charset=utf-8')]
        start_response(status, headers)
        return [content.encode('utf-8')]

    # Serve CSS
    elif path == '/style.css':
        with open('/home/rainking632/genesis-rebuild/monitoring/dashboard_static/style.css', 'r') as f:
            content = f.read()
        status = '200 OK'
        headers = [('Content-Type', 'text/css; charset=utf-8')]
        start_response(status, headers)
        return [content.encode('utf-8')]

    # Serve JS
    elif path == '/dashboard.js':
        with open('/home/rainking632/genesis-rebuild/monitoring/dashboard_static/dashboard.js', 'r') as f:
            content = f.read()
        status = '200 OK'
        headers = [('Content-Type', 'application/javascript; charset=utf-8')]
        start_response(status, headers)
        return [content.encode('utf-8')]

    # Serve dashboard data JSON
    elif path == '/dashboard-data.json' or path.startswith('/dashboard-data.json?'):
        try:
            with open('/home/rainking632/genesis-rebuild/monitoring/dashboard_static/dashboard-data.json', 'r') as f:
                content = f.read()
            status = '200 OK'
            headers = [
                ('Content-Type', 'application/json; charset=utf-8'),
                ('Cache-Control', 'no-cache, no-store, must-revalidate')
            ]
            start_response(status, headers)
            return [content.encode('utf-8')]
        except Exception as e:
            status = '500 Internal Server Error'
            headers = [('Content-Type', 'application/json')]
            response = json.dumps({"error": str(e)})
            start_response(status, headers)
            return [response.encode('utf-8')]

    # API endpoints for backwards compatibility
    elif path == '/api/health':
        status = '200 OK'
        headers = [('Content-Type', 'application/json')]
        response = json.dumps({
            "status": "healthy",
            "service": "genesis-dashboard",
            "version": "1.0.0"
        })
        start_response(status, headers)
        return [response.encode('utf-8')]

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
        headers = [('Content-Type', 'application/json')]
        start_response(status, headers)
        return [response.encode('utf-8')]

    elif path == '/api/status':
        status = '200 OK'
        headers = [('Content-Type', 'application/json')]
        response = json.dumps({
            "deployment": "active",
            "dashboard": "genesis-business-dashboard",
            "username": "rainking632",
            "python": "3.12"
        })
        start_response(status, headers)
        return [response.encode('utf-8')]

    # 404 for everything else
    else:
        status = '404 Not Found'
        headers = [('Content-Type', 'application/json')]
        response = json.dumps({"error": "Not found", "path": path})
        start_response(status, headers)
        return [response.encode('utf-8')]
"""

# Upload files to PythonAnywhere
print("\n📤 Uploading files to PythonAnywhere...")

# Upload dashboard static files
files_to_upload = [
    ('monitoring/dashboard_static/index.html', index_html),
    ('monitoring/dashboard_static/style.css', style_css),
    ('monitoring/dashboard_static/dashboard.js', dashboard_js),
    ('monitoring/dashboard_static/dashboard-data.json', dashboard_data),
]

for file_path, content in files_to_upload:
    url = f'https://www.pythonanywhere.com/api/v0/user/{USERNAME}/files/path/home/{USERNAME}/genesis-rebuild/{file_path}'
    response = requests.post(
        url,
        headers={'Authorization': f'Token {API_TOKEN}'},
        files={'content': content.encode('utf-8')}
    )
    if response.status_code in [200, 201]:
        print(f"  ✓ {file_path}")
    else:
        print(f"  ✗ {file_path}: {response.status_code}")

# Upload WSGI file
print("\n🔧 Updating WSGI configuration...")
response = requests.post(
    f'https://www.pythonanywhere.com/api/v0/user/{USERNAME}/files/path/var/www/rainking632_pythonanywhere_com_wsgi.py',
    headers={'Authorization': f'Token {API_TOKEN}'},
    files={'content': wsgi_content.encode('utf-8')}
)

if response.status_code in [200, 201]:
    print("✓ WSGI updated")
else:
    print(f"✗ WSGI update failed: {response.status_code}")

# Reload webapp
print("\n🔄 Reloading webapp...")
response = requests.post(
    f'https://www.pythonanywhere.com/api/v0/user/{USERNAME}/webapps/{USERNAME}.pythonanywhere.com/reload/',
    headers={'Authorization': f'Token {API_TOKEN}'}
)

if response.status_code == 200:
    print("✓ Webapp reloaded")

import time
time.sleep(5)

# Test dashboard
print("\n🧪 Testing dashboard...")
response = requests.get(f'https://{USERNAME}.pythonanywhere.com/')
if response.status_code == 200 and 'Genesis Business Dashboard' in response.text:
    print("✓ Dashboard HTML loaded")
else:
    print(f"✗ Dashboard test: {response.status_code}")

# Test dashboard data
response = requests.get(f'https://{USERNAME}.pythonanywhere.com/dashboard-data.json')
if response.status_code == 200:
    data = response.json()
    print(f"✓ Dashboard data loaded (generated: {data.get('generated_at', 'N/A')})")
else:
    print(f"✗ Dashboard data test: {response.status_code}")

print("\n" + "="*70)
print("✅ GENESIS BUSINESS DASHBOARD DEPLOYED!")
print("="*70)
print(f"\n🎉 Your Genesis Business Dashboard is live at:")
print(f"\n   🌐 https://{USERNAME}.pythonanywhere.com/")
print(f"\nFeatures:")
print("   • Executive Overview (revenue, costs, profit)")
print("   • Agent Performance (15+ agents)")
print("   • Orchestration Metrics (HTDAG, HALO, AOP)")
print("   • Evolution & Learning (SE-Darwin, ATLAS)")
print("   • Safety & Governance")
print("   • Cost Optimization")
print("\n" + "="*70)
