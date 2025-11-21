#!/usr/bin/env python3
"""
Deploy a simple test WSGI to see what's available
"""
import requests

USERNAME = "rainking632"
API_TOKEN = "d96e5e35ee2070fd3d41f83ddb856859a7f4ea7d"

print("Deploying test WSGI...")

# Simple test WSGI
wsgi_content = """# Test WSGI
import sys
import os
import json

def application(environ, start_response):
    path = environ.get('PATH_INFO', '/')

    if path == '/api/test':
        # Test what's available
        status = '200 OK'
        headers = [('Content-Type', 'application/json')]

        test_results = {
            "python_version": sys.version,
            "sys_path": sys.path[:5],
            "venv_exists": os.path.exists('/home/rainking632/genesis-rebuild/venv'),
            "dashboard_exists": os.path.exists('/home/rainking632/genesis-rebuild/dashboard'),
            "app_py_exists": os.path.exists('/home/rainking632/genesis-rebuild/dashboard/app.py')
        }

        # Try to import Flask
        try:
            import flask
            test_results["flask_installed"] = True
            test_results["flask_version"] = flask.__version__
        except ImportError as e:
            test_results["flask_installed"] = False
            test_results["flask_error"] = str(e)

        response = json.dumps(test_results, indent=2)
        start_response(status, headers)
        return [response.encode('utf-8')]

    # Default response
    status = '200 OK'
    headers = [('Content-Type', 'text/html')]
    response = '<h1>Test WSGI Working</h1><p>Visit /api/test for diagnostics</p>'
    start_response(status, headers)
    return [response.encode('utf-8')]
"""

response = requests.post(
    f'https://www.pythonanywhere.com/api/v0/user/{USERNAME}/files/path/var/www/rainking632_pythonanywhere_com_wsgi.py',
    headers={'Authorization': f'Token {API_TOKEN}'},
    files={'content': wsgi_content.encode('utf-8')}
)

print(f"WSGI upload: {response.status_code}")

# Reload
response = requests.post(
    f'https://www.pythonanywhere.com/api/v0/user/{USERNAME}/webapps/{USERNAME}.pythonanywhere.com/reload/',
    headers={'Authorization': f'Token {API_TOKEN}'}
)

print(f"Reload: {response.status_code}")

import time
time.sleep(5)

# Test
print("\nTesting...")
response = requests.get(f'https://{USERNAME}.pythonanywhere.com/api/test')
print(f"Test endpoint: {response.status_code}")
if response.status_code == 200:
    print(response.text)
