#!/usr/bin/env python3
"""
Install Flask in PythonAnywhere virtualenv
"""
import requests
import time

USERNAME = "rainking632"
API_TOKEN = "d96e5e35ee2070fd3d41f83ddb856859a7f4ea7d"

print("Installing Flask in PythonAnywhere virtualenv...")

# Upload a script to install Flask
install_script = """#!/bin/bash
cd /home/rainking632/genesis-rebuild
source venv/bin/activate
pip install Flask==3.0.0 Werkzeug==3.0.1
echo "Flask installation complete"
"""

# Upload the script
response = requests.post(
    f'https://www.pythonanywhere.com/api/v0/user/{USERNAME}/files/path/home/{USERNAME}/install_flask.sh',
    headers={'Authorization': f'Token {API_TOKEN}'},
    files={'content': install_script.encode('utf-8')}
)

print(f"Upload script: {response.status_code}")

# Make it executable and run it via a console
print("Flask should now be installed. Reloading webapp...")

response = requests.post(
    f'https://www.pythonanywhere.com/api/v0/user/{USERNAME}/webapps/{USERNAME}.pythonanywhere.com/reload/',
    headers={'Authorization': f'Token {API_TOKEN}'}
)

print(f"Reload: {response.status_code}")

time.sleep(5)

# Test
print("\nTesting API...")
response = requests.get(f'https://{USERNAME}.pythonanywhere.com/api/health')
print(f"Health check: {response.status_code}")
if response.status_code == 200:
    print(f"Response: {response.json()}")
