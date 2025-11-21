#!/usr/bin/env python3
"""
Install Flask in PythonAnywhere virtualenv by uploading and running a script
"""
import requests
import time

USERNAME = "rainking632"
API_TOKEN = "d96e5e35ee2070fd3d41f83ddb856859a7f4ea7d"

print("="*70)
print("INSTALLING FLASK IN PYTHONANYWHERE")
print("="*70)

# Create an installation script
install_script = """#!/usr/bin/env python3
import subprocess
import sys

venv_pip = '/home/rainking632/genesis-rebuild/venv/bin/pip'

print("Installing Flask...")
result = subprocess.run([venv_pip, 'install', 'Flask==3.0.0', 'Werkzeug==3.0.1'],
                       capture_output=True, text=True)
print(result.stdout)
if result.returncode == 0:
    print("✓ Flask installed successfully!")
else:
    print("✗ Installation failed:", result.stderr)
    sys.exit(1)

# Verify
result = subprocess.run([venv_pip, 'list'], capture_output=True, text=True)
if 'Flask' in result.stdout:
    print("✓ Flask verified in virtualenv")
else:
    print("✗ Flask not found after installation")
"""

# Upload the installation script
print("\n📤 Uploading installation script...")
response = requests.post(
    f'https://www.pythonanywhere.com/api/v0/user/{USERNAME}/files/path/home/{USERNAME}/install_flask.py',
    headers={'Authorization': f'Token {API_TOKEN}'},
    files={'content': install_script.encode('utf-8')}
)

if response.status_code in [200, 201]:
    print("✓ Installation script uploaded")
else:
    print(f"✗ Upload failed: {response.status_code}")
    exit(1)

# Now create a WSGI that runs this script once
print("\n🔧 Creating self-installing WSGI...")
self_installing_wsgi = """# Self-installing WSGI for Flask
import sys
import os
import subprocess
import json

INSTALL_MARKER = '/home/rainking632/flask_installed.txt'

def install_flask():
    '''Install Flask if not already installed'''
    if os.path.exists(INSTALL_MARKER):
        return True, "Already installed"

    venv_pip = '/home/rainking632/genesis-rebuild/venv/bin/pip'

    try:
        result = subprocess.run(
            [venv_pip, 'install', 'Flask==3.0.0', 'Werkzeug==3.0.1'],
            capture_output=True,
            text=True,
            timeout=60
        )

        if result.returncode == 0:
            # Mark as installed
            with open(INSTALL_MARKER, 'w') as f:
                f.write('installed')
            return True, result.stdout
        else:
            return False, result.stderr
    except Exception as e:
        return False, str(e)

def application(environ, start_response):
    path = environ.get('PATH_INFO', '/')

    # Check if Flask is installed, if not, install it
    try:
        import flask
        flask_available = True
    except ImportError:
        flask_available = False

    if not flask_available:
        # Try to install
        success, message = install_flask()

        status = '200 OK' if success else '500 Internal Server Error'
        headers = [('Content-Type', 'application/json')]
        response = json.dumps({
            "status": "installing" if success else "error",
            "message": "Flask is being installed. Please reload in 30 seconds." if success else f"Installation failed: {message}",
            "flask_available": False
        })
        start_response(status, headers)
        return [response.encode('utf-8')]

    # Flask is available, load the dashboard
    sys.path.insert(0, '/home/rainking632/genesis-rebuild/dashboard')
    sys.path.insert(0, '/home/rainking632/genesis-rebuild')
    sys.path.insert(0, '/home/rainking632/genesis-rebuild/venv/lib/python3.12/site-packages')

    os.chdir('/home/rainking632/genesis-rebuild/dashboard')

    try:
        from app import app as flask_app
        return flask_app(environ, start_response)
    except Exception as e:
        status = '500 Internal Server Error'
        headers = [('Content-Type', 'application/json')]
        response = json.dumps({"error": f"Flask app error: {str(e)}"})
        start_response(status, headers)
        return [response.encode('utf-8')]
"""

response = requests.post(
    f'https://www.pythonanywhere.com/api/v0/user/{USERNAME}/files/path/var/www/rainking632_pythonanywhere_com_wsgi.py',
    headers={'Authorization': f'Token {API_TOKEN}'},
    files={'content': self_installing_wsgi.encode('utf-8')}
)

if response.status_code in [200, 201]:
    print("✓ Self-installing WSGI deployed")
else:
    print(f"✗ WSGI deployment failed: {response.status_code}")

# Reload webapp
print("\n🔄 Reloading webapp...")
response = requests.post(
    f'https://www.pythonanywhere.com/api/v0/user/{USERNAME}/webapps/{USERNAME}.pythonanywhere.com/reload/',
    headers={'Authorization': f'Token {API_TOKEN}'}
)

if response.status_code == 200:
    print("✓ Webapp reloaded")

print("\n⏳ Waiting for Flask installation (30 seconds)...")
time.sleep(30)

# Test
print("\n🧪 Testing installation...")
response = requests.get(f'https://{USERNAME}.pythonanywhere.com/api/health')
print(f"Status: {response.status_code}")

if response.status_code == 200:
    try:
        data = response.json()
        if data.get('status') == 'installing':
            print("⏳ Flask is still installing, please wait...")
            print("🔄 Reloading again...")
            requests.post(
                f'https://www.pythonanywhere.com/api/v0/user/{USERNAME}/webapps/{USERNAME}.pythonanywhere.com/reload/',
                headers={'Authorization': f'Token {API_TOKEN}'}
            )
            time.sleep(10)
            response = requests.get(f'https://{USERNAME}.pythonanywhere.com/api/health')
            if response.status_code == 200:
                print(f"✓ Success! {response.json()}")
        else:
            print(f"✓ Dashboard is live! {data}")
    except:
        print(f"Response: {response.text[:200]}")
else:
    print(f"Response: {response.text[:200]}")

print("\n" + "="*70)
print("INSTALLATION PROCESS STARTED")
print("="*70)
print("\nIf Flask installation is still in progress, wait 1-2 minutes")
print("then visit: https://rainking632.pythonanywhere.com/")
print("="*70)
