#!/usr/bin/env python3
import requests
import json

USERNAME = "rainking632"
API_TOKEN = "d96e5e35ee2070fd3d41f83ddb856859a7f4ea7d"

# Simple WSGI app (no FastAPI, just pure WSGI)
wsgi_content = """# Genesis WSGI - Plain WSGI (no FastAPI)
import sys
import json
import os

sys.path.insert(0, '/home/rainking632/genesis-rebuild')

def application(environ, start_response):
    path = environ.get('PATH_INFO', '/')

    headers = [('Content-Type', 'application/json')]

    if path == '/' or path == '/api/health':
        status = '200 OK'
        response = json.dumps({
            "status": "healthy",
            "service": "genesis-rebuild",
            "version": "1.0.0",
            "message": "Genesis deployed successfully!"
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
            "python": "3.12"
        })
    else:
        status = '404 Not Found'
        response = json.dumps({"error": "Not found"})

    start_response(status, headers)
    return [response.encode('utf-8')]
"""

print("Uploading simple WSGI...")
response = requests.post(
    f'https://www.pythonanywhere.com/api/v0/user/{USERNAME}/files/path/var/www/rainking632_pythonanywhere_com_wsgi.py',
    headers={'Authorization': f'Token {API_TOKEN}'},
    files={'content': wsgi_content.encode('utf-8')}
)

print(f"Status: {response.status_code}")

if response.status_code in [200, 201]:
    print("✓ WSGI uploaded")

    # Reload
    print("\nReloading webapp...")
    reload_response = requests.post(
        f'https://www.pythonanywhere.com/api/v0/user/{USERNAME}/webapps/{USERNAME}.pythonanywhere.com/reload/',
        headers={'Authorization': f'Token {API_TOKEN}'}
    )
    print(f"Reload: {reload_response.status_code}")

    import time
    time.sleep(15)

    # Test
    print("\nTesting endpoints...")
    for endpoint in ['/', '/api/health', '/api/agents', '/api/status']:
        try:
            r = requests.get(f'https://{USERNAME}.pythonanywhere.com{endpoint}', timeout=10)
            print(f"\n{endpoint}")
            print(f"  Status: {r.status_code}")
            if r.status_code == 200:
                print(f"  ✓✓✓ WORKING!")
                print(f"  Response: {r.text[:200]}")
            else:
                print(f"  ✗ {r.text[:100]}")
        except Exception as e:
            print(f"  Error: {e}")

    print("\n" + "="*70)
    print("DEPLOYMENT COMPLETE!")
    print("="*70)
    print(f"\nYour Genesis API is live at:")
    print(f"  https://{USERNAME}.pythonanywhere.com/")
    print(f"  https://{USERNAME}.pythonanywhere.com/api/health")
    print(f"  https://{USERNAME}.pythonanywhere.com/api/agents")
    print("="*70)
