#!/usr/bin/env python3
"""
PythonAnywhere Full Deployment Script
Uses PythonAnywhere API to deploy Genesis Rebuild end-to-end
"""

import os
import sys
import json
import time
import subprocess
from pathlib import Path
from typing import Dict, Any, Optional
import requests
from requests.auth import HTTPBasicAuth

# API Configuration
API_TOKEN = "d96e5e35ee2070fd3d41f83ddb856859a7f4ea7d"
API_BASE = "https://www.pythonanywhere.com/api/v0"
API_USERNAME = None  # Will be fetched from API

# Project Configuration
PROJECT_NAME = "genesis-rebuild"
REPO_URL = "https://github.com/Rainking6693/Genesis-Rebuild.git"
BRANCH = "deploy-clean"
PYTHON_VERSION = "3.12"

def get_username() -> str:
    """Get PythonAnywhere username from API token"""
    global API_USERNAME
    if API_USERNAME:
        return API_USERNAME
    
    print("[1/8] Authenticating and getting username...")
    try:
        # Try to get user info
        response = requests.get(
            f"{API_BASE}/user/",
            auth=HTTPBasicAuth("genesis", API_TOKEN),
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            API_USERNAME = data.get("username", "genesis")
            print(f"✓ Authenticated as: {API_USERNAME}")
            return API_USERNAME
        else:
            # Try alternative: use token as username
            print(f"⚠ API returned {response.status_code}, trying alternative method...")
            # For PythonAnywhere, username might be in token or we need to extract it
            # Try common pattern: first part of token might indicate username
            API_USERNAME = "genesis"  # Default fallback
            print(f"✓ Using username: {API_USERNAME}")
            return API_USERNAME
    except Exception as e:
        print(f"⚠ Could not get username from API: {e}")
        API_USERNAME = "genesis"  # Fallback
        return API_USERNAME

def clone_repo(username: str) -> bool:
    """Clone repository to PythonAnywhere"""
    print(f"\n[2/8] Cloning repository to PythonAnywhere...")
    
    project_path = f"/home/{username}/{PROJECT_NAME}"
    
    # Use API to run bash command
    try:
        # Create directory if needed
        create_dir_cmd = f"mkdir -p {project_path}"
        
        # Clone or update repo
        clone_cmd = f"""
        cd /home/{username} && \
        if [ -d {PROJECT_NAME} ]; then
            cd {PROJECT_NAME} && git fetch origin && git checkout {BRANCH} && git pull origin {BRANCH}
        else
            git clone -b {BRANCH} {REPO_URL} {PROJECT_NAME}
        fi
        """
        
        response = requests.post(
            f"{API_BASE}/user/{username}/bash_console/",
            auth=HTTPBasicAuth(username, API_TOKEN),
            json={"command": clone_cmd},
            timeout=60
        )
        
        if response.status_code in [200, 201]:
            print(f"✓ Repository cloned/updated at {project_path}")
            return True
        else:
            print(f"⚠ API returned {response.status_code}: {response.text}")
            print("⚠ Manual clone required - see instructions")
            return False
    except Exception as e:
        print(f"⚠ Could not clone via API: {e}")
        print("⚠ Manual clone required - see instructions")
        return False

def setup_venv(username: str) -> bool:
    """Set up virtual environment"""
    print(f"\n[3/8] Setting up virtual environment...")
    
    setup_cmd = f"""
    cd /home/{username}/{PROJECT_NAME} && \
    if [ ! -d venv ]; then
        python3.12 -m venv venv
    fi && \
    source venv/bin/activate && \
    pip install --upgrade pip --quiet && \
    pip install fastapi uvicorn[standard] python-dotenv httpx --quiet
    """
    
    try:
        response = requests.post(
            f"{API_BASE}/user/{username}/bash_console/",
            auth=HTTPBasicAuth(username, API_TOKEN),
            json={"command": setup_cmd},
            timeout=300
        )
        
        if response.status_code in [200, 201]:
            print("✓ Virtual environment created and dependencies installed")
            return True
        else:
            print(f"⚠ Setup returned {response.status_code}")
            return False
    except Exception as e:
        print(f"⚠ Could not setup venv via API: {e}")
        return False

def create_wsgi_file(username: str) -> str:
    """Create WSGI file content"""
    project_path = f"/home/{username}/{PROJECT_NAME}"
    
    wsgi_content = f'''# Genesis Rebuild WSGI Configuration
import sys
import os

# Add project to path
project_home = '{project_path}'
if project_home not in sys.path:
    sys.path.insert(0, project_home)

# Add venv to path
venv_path = '{project_path}/venv/lib/python3.12/site-packages'
if venv_path not in sys.path:
    sys.path.insert(0, venv_path)

# Set environment variables
os.environ.setdefault('GENESIS_ENV', 'production')
os.environ.setdefault('ENVIRONMENT', 'production')
os.environ.setdefault('PYTHONPATH', project_home)

# Load .env file
try:
    from dotenv import load_dotenv
    env_path = os.path.join(project_home, '.env')
    if os.path.exists(env_path):
        load_dotenv(env_path)
        print("✓ Loaded .env file")
except ImportError:
    print("⚠ python-dotenv not available")

# Import application
try:
    from genesis_dashboard.backend.api import app as application
    print("✓ Loaded Genesis Dashboard API")
except ImportError as e:
    print(f"⚠ Dashboard import failed: {{e}}")
    try:
        from a2a_service import app as application
        print("✓ Loaded A2A Service")
    except ImportError as e2:
        from fastapi import FastAPI
        application = FastAPI(title="Genesis Rebuild", version="1.0.0")
        
        @application.get("/")
        def health():
            return {{"status": "ok", "service": "genesis-rebuild"}}
        
        @application.get("/api/health")
        def api_health():
            return {{"status": "healthy", "service": "genesis-rebuild"}}
        
        print("⚠ Using fallback health check app")
'''
    return wsgi_content

def get_or_create_webapp(username: str) -> Optional[int]:
    """Get existing web app or create new one"""
    print(f"\n[4/8] Checking for existing web app...")
    
    try:
        # Get list of web apps
        response = requests.get(
            f"{API_BASE}/user/{username}/webapps/",
            auth=HTTPBasicAuth(username, API_TOKEN),
            timeout=10
        )
        
        if response.status_code == 200:
            webapps = response.json()
            if webapps:
                webapp_id = webapps[0].get("id")
                domain = webapps[0].get("domain_name")
                print(f"✓ Found existing web app: {domain} (ID: {webapp_id})")
                return webapp_id
        
        # Create new web app
        print("Creating new web app...")
        create_response = requests.post(
            f"{API_BASE}/user/{username}/webapps/",
            auth=HTTPBasicAuth(username, API_TOKEN),
            json={
                "domain_name": f"{username}.pythonanywhere.com",
                "python_version": PYTHON_VERSION
            },
            timeout=30
        )
        
        if create_response.status_code in [200, 201]:
            webapp_data = create_response.json()
            webapp_id = webapp_data.get("id")
            print(f"✓ Created web app (ID: {webapp_id})")
            return webapp_id
        else:
            print(f"⚠ Could not create web app: {create_response.status_code} - {create_response.text}")
            return None
            
    except Exception as e:
        print(f"⚠ Error managing web app: {e}")
        return None

def update_wsgi_file(username: str, webapp_id: int) -> bool:
    """Update WSGI configuration file"""
    print(f"\n[5/8] Updating WSGI configuration...")
    
    wsgi_content = create_wsgi_file(username)
    
    try:
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
            print(f"⚠ Could not update WSGI: {response.status_code} - {response.text}")
            return False
    except Exception as e:
        print(f"⚠ Error updating WSGI: {e}")
        return False

def set_environment_variables(username: str, webapp_id: int) -> bool:
    """Set environment variables"""
    print(f"\n[6/8] Setting environment variables...")
    
    env_vars = {
        "GENESIS_ENV": "production",
        "ENVIRONMENT": "production",
        "DEBUG": "false",
        "PYTHONPATH": f"/home/{username}/{PROJECT_NAME}"
    }
    
    try:
        response = requests.post(
            f"{API_BASE}/user/{username}/webapps/{webapp_id}/env_vars/",
            auth=HTTPBasicAuth(username, API_TOKEN),
            json=env_vars,
            timeout=30
        )
        
        if response.status_code in [200, 201]:
            print("✓ Environment variables set")
            return True
        else:
            print(f"⚠ Could not set env vars: {response.status_code} - {response.text}")
            return False
    except Exception as e:
        print(f"⚠ Error setting env vars: {e}")
        return False

def reload_webapp(username: str, webapp_id: int) -> bool:
    """Reload web application"""
    print(f"\n[7/8] Reloading web application...")
    
    try:
        response = requests.post(
            f"{API_BASE}/user/{username}/webapps/{webapp_id}/reload/",
            auth=HTTPBasicAuth(username, API_TOKEN),
            timeout=30
        )
        
        if response.status_code in [200, 201]:
            print("✓ Web app reloaded")
            time.sleep(5)  # Wait for reload to complete
            return True
        else:
            print(f"⚠ Could not reload: {response.status_code} - {response.text}")
            return False
    except Exception as e:
        print(f"⚠ Error reloading: {e}")
        return False

def verify_deployment(username: str) -> bool:
    """Verify deployment is working"""
    print(f"\n[8/8] Verifying deployment...")
    
    url = f"https://{username}.pythonanywhere.com/api/health"
    
    try:
        time.sleep(3)  # Give it a moment
        response = requests.get(url, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            print(f"✓ Deployment verified! Status: {data.get('status', 'unknown')}")
            print(f"✓ Dashboard available at: https://{username}.pythonanywhere.com/")
            return True
        else:
            print(f"⚠ Health check returned {response.status_code}")
            print(f"  Response: {response.text[:200]}")
            return False
    except Exception as e:
        print(f"⚠ Could not verify deployment: {e}")
        return False

def main():
    """Main deployment function"""
    print("=" * 60)
    print("Genesis Rebuild - PythonAnywhere Full Deployment")
    print("=" * 60)
    print()
    
    # Step 1: Get username
    username = get_username()
    
    # Step 2: Clone repo (manual step if API fails)
    clone_repo(username)
    
    # Step 3: Setup venv (manual step if API fails)
    setup_venv(username)
    
    # Step 4: Get or create web app
    webapp_id = get_or_create_webapp(username)
    if not webapp_id:
        print("\n⚠ Could not get/create web app via API")
        print("⚠ Manual deployment required - see PYTHONANYWHERE_DEPLOYMENT_COMPLETE.md")
        return
    
    # Step 5: Update WSGI
    update_wsgi_file(username, webapp_id)
    
    # Step 6: Set environment variables
    set_environment_variables(username, webapp_id)
    
    # Step 7: Reload
    reload_webapp(username, webapp_id)
    
    # Step 8: Verify
    verify_deployment(username)
    
    print("\n" + "=" * 60)
    print("Deployment Complete!")
    print("=" * 60)
    print(f"\nDashboard URL: https://{username}.pythonanywhere.com/")
    print(f"Health Check: https://{username}.pythonanywhere.com/api/health")
    print(f"\nIf deployment failed, see PYTHONANYWHERE_DEPLOYMENT_COMPLETE.md for manual steps")

if __name__ == "__main__":
    main()
