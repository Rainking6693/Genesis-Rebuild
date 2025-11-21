#!/usr/bin/env python3
import requests

USERNAME = "rainking632"
API_TOKEN = "d96e5e35ee2070fd3d41f83ddb856859a7f4ea7d"

wsgi_content = """# Genesis WSGI - FIXED with ASGI adapter
import sys
sys.path.insert(0, '/home/rainking632/genesis-rebuild')
sys.path.insert(0, '/home/rainking632/genesis-rebuild/venv/lib/python3.12/site-packages')

from fastapi import FastAPI
from fastapi.responses import JSONResponse
import os

app = FastAPI(title="Genesis Rebuild", version="1.0.0")

@app.get("/")
def root():
    return JSONResponse({"status": "ok", "service": "genesis-rebuild", "version": "1.0.0"})

@app.get("/api/health")
def health():
    return JSONResponse({"status": "healthy", "service": "genesis-rebuild", "version": "1.0.0"})

@app.get("/api/agents")
def agents():
    try:
        agent_files = [f.replace('.py', '') for f in os.listdir('/home/rainking632/genesis-rebuild/agents') if f.endswith('_agent.py')]
        return JSONResponse({"agents": agent_files, "count": len(agent_files)})
    except Exception as e:
        return JSONResponse({"error": str(e)})

# Wrap ASGI app in WSGI adapter
from asgiref.wsgi import WsgiToAsgi
application = WsgiToAsgi(app)
"""

# Upload
response = requests.post(
    f'https://www.pythonanywhere.com/api/v0/user/{USERNAME}/files/path/var/www/rainking632_pythonanywhere_com_wsgi.py',
    headers={'Authorization': f'Token {API_TOKEN}'},
    files={'content': wsgi_content.encode('utf-8')}
)

print(f"Upload: {response.status_code}")
if response.status_code in [200, 201]:
    print("✓ WSGI uploaded")

# Install asgiref
print("\nInstalling asgiref...")
import time
PYTHON_CONSOLE_ID = 43534121

def send_cmd(cmd):
    requests.post(
        f'https://www.pythonanywhere.com/api/v0/user/{USERNAME}/consoles/{PYTHON_CONSOLE_ID}/send_input/',
        headers={'Authorization': f'Token {API_TOKEN}'},
        json={'input': cmd + '\n'}
    )
    time.sleep(1)

send_cmd("import subprocess")
send_cmd("subprocess.run(['/home/rainking632/genesis-rebuild/venv/bin/pip', 'install', 'asgiref'])")
time.sleep(10)

# Reload
print("Reloading...")
requests.post(
    f'https://www.pythonanywhere.com/api/v0/user/{USERNAME}/webapps/{USERNAME}.pythonanywhere.com/reload/',
    headers={'Authorization': f'Token {API_TOKEN}'}
)

time.sleep(10)

# Test
print("\nTesting...")
for endpoint in ['/api/health', '/api/agents']:
    r = requests.get(f'https://{USERNAME}.pythonanywhere.com{endpoint}')
    print(f"{endpoint}: {r.status_code}")
    if r.status_code == 200:
        print(f"  ✓✓✓ {r.text[:100]}")
