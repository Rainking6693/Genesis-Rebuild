#!/usr/bin/env python3
"""
Fix WSGI to properly load Flask with virtualenv
"""
import requests

USERNAME = "rainking632"
API_TOKEN = "d96e5e35ee2070fd3d41f83ddb856859a7f4ea7d"

print("Fixing WSGI configuration for Flask...")

# Updated WSGI that properly activates virtualenv
wsgi_content = """# Genesis Real-Time Dashboard WSGI - Fixed
import sys
import os

# Activate virtualenv
VENV_PATH = '/home/rainking632/genesis-rebuild/venv'
activate_this = os.path.join(VENV_PATH, 'bin/activate_this.py')
if os.path.exists(activate_this):
    with open(activate_this) as f:
        exec(f.read(), {'__file__': activate_this})

# Add paths
sys.path.insert(0, '/home/rainking632/genesis-rebuild/dashboard')
sys.path.insert(0, '/home/rainking632/genesis-rebuild')
sys.path.insert(0, os.path.join(VENV_PATH, 'lib/python3.12/site-packages'))

# Change to dashboard directory
os.chdir('/home/rainking632/genesis-rebuild/dashboard')

try:
    from app import app as application
    print("Flask app loaded successfully", file=sys.stderr)
except ImportError as e:
    print(f"Import error: {e}", file=sys.stderr)
    # Fallback to simple WSGI
    import json
    def application(environ, start_response):
        status = '500 Internal Server Error'
        response = json.dumps({"error": f"Flask import failed: {str(e)}"})
        headers = [('Content-Type', 'application/json')]
        start_response(status, headers)
        return [response.encode('utf-8')]
"""

response = requests.post(
    f'https://www.pythonanywhere.com/api/v0/user/{USERNAME}/files/path/var/www/rainking632_pythonanywhere_com_wsgi.py',
    headers={'Authorization': f'Token {API_TOKEN}'},
    files={'content': wsgi_content.encode('utf-8')}
)

print(f"WSGI update: {response.status_code}")

# Reload webapp
print("Reloading webapp...")
response = requests.post(
    f'https://www.pythonanywhere.com/api/v0/user/{USERNAME}/webapps/{USERNAME}.pythonanywhere.com/reload/',
    headers={'Authorization': f'Token {API_TOKEN}'}
)

print(f"Reload: {response.status_code}")

import time
time.sleep(5)

# Test
print("\nTesting...")
response = requests.get(f'https://{USERNAME}.pythonanywhere.com/api/health')
print(f"API health: {response.status_code}")
if response.status_code == 200:
    print(f"✓ Success! Response: {response.json()}")
else:
    print(f"✗ Error: {response.text[:200]}")
