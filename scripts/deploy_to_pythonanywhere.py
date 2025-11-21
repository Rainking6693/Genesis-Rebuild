#!/usr/bin/env python3
"""
Deploy Genesis Rebuild to PythonAnywhere using API
Username: rainking632
"""

import requests
from requests.auth import HTTPBasicAuth
import json
import time

API_TOKEN = "d96e5e35ee2070fd3d41f83ddb856859a7f4ea7d"
API_BASE = "https://www.pythonanywhere.com/api/v0"
USERNAME = "rainking632"

def create_bash_console():
    """Create a new Bash console"""
    print("Creating Bash console...")
    try:
        response = requests.post(
            f"{API_BASE}/user/{USERNAME}/consoles/",
            auth=HTTPBasicAuth(USERNAME, API_TOKEN),
            json={"executable": "bash"},
            timeout=30
        )
        if response.status_code in [200, 201]:
            console = response.json()
            console_id = console.get("id")
            print(f"✓ Bash console created: {console_id}")
            return console_id
        else:
            print(f"⚠ Could not create console: {response.status_code}")
            print(f"  Response: {response.text[:200]}")
            return None
    except Exception as e:
        print(f"⚠ Error creating console: {e}")
        return None

def get_webapps():
    """Get existing web apps"""
    print("Checking for existing web apps...")
    try:
        response = requests.get(
            f"{API_BASE}/user/{USERNAME}/webapps/",
            auth=HTTPBasicAuth(USERNAME, API_TOKEN),
            timeout=10
        )
        if response.status_code == 200:
            webapps = response.json()
            print(f"✓ Found {len(webapps)} web app(s)")
            return webapps
        else:
            print(f"⚠ Could not get web apps: {response.status_code}")
            return []
    except Exception as e:
        print(f"⚠ Error getting web apps: {e}")
        return []

def create_wsgi_content():
    """Create WSGI file content"""
    project_path = f"/home/{USERNAME}/genesis-rebuild"
    return f'''# Genesis Rebuild WSGI Configuration
import sys
import os

project_home = '{project_path}'
if project_home not in sys.path:
    sys.path.insert(0, project_home)

venv_path = '{project_path}/venv/lib/python3.12/site-packages'
if venv_path not in sys.path:
    sys.path.insert(0, venv_path)

os.environ.setdefault('GENESIS_ENV', 'production')
os.environ.setdefault('ENVIRONMENT', 'production')
os.environ.setdefault('PYTHONPATH', project_home)

try:
    from dotenv import load_dotenv
    env_path = os.path.join(project_home, '.env')
    if os.path.exists(env_path):
        load_dotenv(env_path)
        print("✓ Loaded .env file")
except ImportError:
    print("⚠ python-dotenv not available")

try:
    from genesis_dashboard.backend.api import app as application
    print("✓ Loaded Genesis Dashboard API")
except ImportError as e:
    print(f"⚠ Dashboard import failed: {{e}}")
    try:
        from a2a_fastapi import app as application
        print("✓ Loaded A2A FastAPI")
    except ImportError as e2:
        print(f"⚠ A2A FastAPI import failed: {{e2}}")
        try:
            from dashboard_app import app as application
            print("✓ Loaded Dashboard App (fallback)")
        except ImportError as e3:
            print(f"⚠ Dashboard app import failed: {{e3}}")
            try:
                from a2a_service import app as application
                print("✓ Loaded A2A Service")
            except ImportError as e4:
                from fastapi import FastAPI
                application = FastAPI(title="Genesis Rebuild", version="1.0.0")
                
                @application.get("/")
                def health():
                    return {{"status": "ok", "service": "genesis-rebuild"}}
                
                @application.get("/api/health")
                def api_health():
                    return {{"status": "healthy", "service": "genesis-rebuild"}}
                
                print("⚠ Using minimal fallback health check app")
'''

def update_wsgi_file(webapp_id):
    """Update WSGI file"""
    print(f"Updating WSGI file for web app {webapp_id}...")
    wsgi_content = create_wsgi_content()
    
    try:
        response = requests.post(
            f"{API_BASE}/user/{USERNAME}/webapps/{webapp_id}/wsgi_file/",
            auth=HTTPBasicAuth(USERNAME, API_TOKEN),
            json={"content": wsgi_content},
            timeout=30
        )
        if response.status_code in [200, 201]:
            print("✓ WSGI file updated")
            return True
        else:
            print(f"⚠ Could not update WSGI: {response.status_code}")
            print(f"  Response: {response.text[:200]}")
            return False
    except Exception as e:
        print(f"⚠ Error updating WSGI: {e}")
        return False

def reload_webapp(webapp_id):
    """Reload web app"""
    print(f"Reloading web app {webapp_id}...")
    try:
        response = requests.post(
            f"{API_BASE}/user/{USERNAME}/webapps/{webapp_id}/reload/",
            auth=HTTPBasicAuth(USERNAME, API_TOKEN),
            timeout=30
        )
        if response.status_code in [200, 201]:
            print("✓ Web app reloaded")
            time.sleep(3)
            return True
        else:
            print(f"⚠ Could not reload: {response.status_code}")
            return False
    except Exception as e:
        print(f"⚠ Error reloading: {e}")
        return False

def main():
    print("=" * 70)
    print("Genesis Rebuild - PythonAnywhere Deployment")
    print(f"Username: {USERNAME}")
    print("=" * 70)
    print()
    
    # Get web apps
    webapps = get_webapps()
    if not webapps:
        print("⚠ No web apps found. Please create one in the Web tab first.")
        return
    
    webapp = webapps[0]
    webapp_id = webapp.get("id")
    domain = webapp.get("domain_name", f"{USERNAME}.pythonanywhere.com")
    print(f"✓ Using web app: {domain} (ID: {webapp_id})")
    print()
    
    print("⚠ IMPORTANT: Before proceeding, you need to:")
    print("1. Clone the repository in a Bash console:")
    print(f"   cd ~")
    print(f"   git clone -b deploy-clean https://github.com/Rainking6693/Genesis-Rebuild.git genesis-rebuild")
    print(f"   cd genesis-rebuild")
    print(f"   bash deploy_on_pythonanywhere.sh")
    print()
    print("2. Then run this script again to update WSGI and reload")
    print()
    
    # Update WSGI file
    if update_wsgi_file(webapp_id):
        # Reload
        reload_webapp(webapp_id)
        
        print("\n" + "=" * 70)
        print("Deployment Configuration Complete!")
        print("=" * 70)
        print(f"\n🌐 Dashboard URL: https://{domain}/")
        print(f"🔍 Health Check: https://{domain}/api/health")
        print("\n⚠ Remember to clone the repo and run setup script first!")
    else:
        print("\n⚠ WSGI update failed. Update manually in Web tab.")

if __name__ == "__main__":
    main()


