#!/usr/bin/env python3
"""
PythonAnywhere API Deployment Script
Attempts to automate deployment using PythonAnywhere API
"""

import requests
from requests.auth import HTTPBasicAuth
import json
import time

API_TOKEN = "d96e5e35ee2070fd3d41f83ddb856859a7f4ea7d"
API_BASE = "https://www.pythonanywhere.com/api/v0"

def test_api_connection():
    """Test API connection and get username"""
    print("Testing PythonAnywhere API connection...")
    
    # Try to get user info
    # Note: PythonAnywhere API uses username:token for Basic Auth
    # We need to know the username first
    
    # Common endpoint to test
    try:
        # Try with 'genesis' as username (common default)
        response = requests.get(
            f"{API_BASE}/user/genesis/",
            auth=HTTPBasicAuth("genesis", API_TOKEN),
            timeout=10
        )
        
        if response.status_code == 200:
            print(f"✓ API connection successful")
            data = response.json()
            username = data.get("username", "genesis")
            print(f"✓ Username: {username}")
            return username
        elif response.status_code == 401:
            print("⚠ Authentication failed - check API token")
            return None
        else:
            print(f"⚠ API returned {response.status_code}")
            print(f"  Response: {response.text[:200]}")
            return None
    except Exception as e:
        print(f"⚠ API connection failed: {e}")
        return None

def get_webapps(username):
    """Get list of web apps"""
    try:
        response = requests.get(
            f"{API_BASE}/user/{username}/webapps/",
            auth=HTTPBasicAuth(username, API_TOKEN),
            timeout=10
        )
        
        if response.status_code == 200:
            return response.json()
        else:
            print(f"⚠ Could not get web apps: {response.status_code}")
            return []
    except Exception as e:
        print(f"⚠ Error getting web apps: {e}")
        return []

def create_webapp(username, domain):
    """Create a new web app"""
    print(f"Creating web app: {domain}...")
    
    try:
        response = requests.post(
            f"{API_BASE}/user/{username}/webapps/",
            auth=HTTPBasicAuth(username, API_TOKEN),
            json={
                "domain_name": domain,
                "python_version": "3.12"
            },
            timeout=30
        )
        
        if response.status_code in [200, 201]:
            webapp = response.json()
            print(f"✓ Web app created: {webapp.get('id')}")
            return webapp
        else:
            print(f"⚠ Could not create web app: {response.status_code}")
            print(f"  Response: {response.text[:200]}")
            return None
    except Exception as e:
        print(f"⚠ Error creating web app: {e}")
        return None

def update_wsgi_file(username, webapp_id, wsgi_content):
    """Update WSGI configuration file"""
    print(f"Updating WSGI file for web app {webapp_id}...")
    
    try:
        # PythonAnywhere API endpoint for WSGI file
        response = requests.post(
            f"{API_BASE}/user/{username}/webapps/{webapp_id}/wsgi_file/",
            auth=HTTPBasicAuth(username, API_TOKEN),
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

def reload_webapp(username, webapp_id):
    """Reload web application"""
    print(f"Reloading web app {webapp_id}...")
    
    try:
        response = requests.post(
            f"{API_BASE}/user/{username}/webapps/{webapp_id}/reload/",
            auth=HTTPBasicAuth(username, API_TOKEN),
            timeout=30
        )
        
        if response.status_code in [200, 201]:
            print("✓ Web app reloaded")
            return True
        else:
            print(f"⚠ Could not reload: {response.status_code}")
            print(f"  Response: {response.text[:200]}")
            return False
    except Exception as e:
        print(f"⚠ Error reloading: {e}")
        return False

def main():
    """Main deployment function"""
    print("=" * 70)
    print("PythonAnywhere API Deployment")
    print("=" * 70)
    print()
    
    # Test API connection
    username = test_api_connection()
    if not username:
        print("\n⚠ Could not connect to PythonAnywhere API")
        print("⚠ You'll need to deploy manually via web interface")
        print("\nSee PYTHONANYWHERE_DEPLOY_INSTRUCTIONS.md for manual steps")
        return
    
    print(f"\n✓ Connected as: {username}")
    
    # Get existing web apps
    webapps = get_webapps(username)
    domain = f"{username}.pythonanywhere.com"
    
    if webapps:
        print(f"\n✓ Found {len(webapps)} existing web app(s)")
        webapp = webapps[0]
        webapp_id = webapp.get("id")
        print(f"  Using web app: {webapp.get('domain_name')} (ID: {webapp_id})")
    else:
        # Create new web app
        print(f"\nNo existing web apps found")
        webapp = create_webapp(username, domain)
        if not webapp:
            print("\n⚠ Could not create web app via API")
            print("⚠ Create it manually in the Web tab")
            return
        webapp_id = webapp.get("id")
    
    # Create WSGI content
    project_path = f"/home/{username}/genesis-rebuild"
    wsgi_content = f'''# Genesis Rebuild WSGI Configuration
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
except ImportError:
    pass

try:
    from genesis_dashboard.backend.api import app as application
except ImportError:
    try:
        from a2a_fastapi import app as application
    except ImportError:
        try:
            from a2a_service import app as application
        except ImportError:
            from fastapi import FastAPI
            application = FastAPI(title="Genesis Rebuild", version="1.0.0")
            
            @application.get("/")
            def health():
                return {{"status": "ok", "service": "genesis-rebuild"}}
            
            @application.get("/api/health")
            def api_health():
                return {{"status": "healthy", "service": "genesis-rebuild"}}
'''
    
    # Update WSGI file
    if update_wsgi_file(username, webapp_id, wsgi_content):
        # Reload web app
        time.sleep(2)
        reload_webapp(username, webapp_id)
        
        print("\n" + "=" * 70)
        print("Deployment Complete!")
        print("=" * 70)
        print(f"\n🌐 Dashboard URL: https://{domain}/")
        print(f"🔍 Health Check: https://{domain}/api/health")
        print("\n⚠ Note: You still need to:")
        print("  1. Clone the repository in Bash console")
        print("  2. Run setup script to create venv and install dependencies")
        print("  3. Set environment variables in Web tab")
    else:
        print("\n⚠ WSGI update failed")
        print("⚠ Update WSGI file manually in Web tab")

if __name__ == "__main__":
    main()


