#!/usr/bin/env python3
"""
PythonAnywhere deployment with CORRECT username: rainking632
"""

import requests
from requests.auth import HTTPBasicAuth
import json
import time

USERNAME = "rainking632"  # CORRECT username
API_TOKEN = "d96e5e35ee2070fd3d41f83ddb856859a7f4ea7d"
API_BASE = "https://www.pythonanywhere.com/api/v0"

def test_api_auth():
    """Test API with correct username"""
    print(f"Testing API with username: {USERNAME}")
    print(f"API Token: {API_TOKEN[:20]}...")
    print()

    # Test with Basic Auth (username:token)
    try:
        response = requests.get(
            f"{API_BASE}/user/{USERNAME}/cpu/",
            auth=HTTPBasicAuth(USERNAME, API_TOKEN),
            timeout=10
        )
        print(f"CPU endpoint status: {response.status_code}")
        if response.status_code == 200:
            print(f"✓ API authentication successful!")
            print(f"  Response: {response.json()}")
            return True
        else:
            print(f"  Response: {response.text[:200]}")
    except Exception as e:
        print(f"  Error: {e}")

    # Test webapps endpoint
    try:
        response = requests.get(
            f"{API_BASE}/user/{USERNAME}/webapps/",
            auth=HTTPBasicAuth(USERNAME, API_TOKEN),
            timeout=10
        )
        print(f"\nWebapps endpoint status: {response.status_code}")
        if response.status_code == 200:
            webapps = response.json()
            print(f"✓ Found {len(webapps)} web app(s)")
            for app in webapps:
                print(f"  - {app.get('domain_name')}")
            return True
        else:
            print(f"  Response: {response.text[:200]}")
    except Exception as e:
        print(f"  Error: {e}")

    # Test consoles endpoint
    try:
        response = requests.get(
            f"{API_BASE}/user/{USERNAME}/consoles/",
            auth=HTTPBasicAuth(USERNAME, API_TOKEN),
            timeout=10
        )
        print(f"\nConsoles endpoint status: {response.status_code}")
        if response.status_code == 200:
            consoles = response.json()
            print(f"✓ Found {len(consoles)} console(s)")
            return True
        else:
            print(f"  Response: {response.text[:200]}")
    except Exception as e:
        print(f"  Error: {e}")

    return False

def get_or_create_webapp():
    """Get existing or create new web app"""
    domain = f"{USERNAME}.pythonanywhere.com"
    print(f"\n{'='*70}")
    print(f"Checking web app: {domain}")
    print('='*70)

    # Check existing
    try:
        response = requests.get(
            f"{API_BASE}/user/{USERNAME}/webapps/",
            auth=HTTPBasicAuth(USERNAME, API_TOKEN),
            timeout=10
        )

        if response.status_code == 200:
            webapps = response.json()
            for app in webapps:
                if app.get('domain_name') == domain:
                    print(f"✓ Found existing web app: {domain}")
                    print(f"  Python version: {app.get('python_version')}")
                    print(f"  Source: {app.get('source_directory')}")
                    print(f"  Virtualenv: {app.get('virtualenv_path')}")
                    return app

        print(f"No existing app found, creating new one...")

        # Create new
        response = requests.post(
            f"{API_BASE}/user/{USERNAME}/webapps/",
            auth=HTTPBasicAuth(USERNAME, API_TOKEN),
            json={
                'domain_name': domain,
                'python_version': 'python312'
            },
            timeout=30
        )

        if response.status_code == 201:
            app = response.json()
            print(f"✓ Created web app: {domain}")
            return app
        else:
            print(f"⚠ Could not create: {response.status_code}")
            print(f"  Response: {response.text}")
            return None

    except Exception as e:
        print(f"⚠ Error: {e}")
        return None

def create_console_and_run_commands():
    """Create console and execute deployment commands"""
    print(f"\n{'='*70}")
    print("Creating bash console to run deployment...")
    print('='*70)

    try:
        # Create console
        response = requests.post(
            f"{API_BASE}/user/{USERNAME}/consoles/",
            auth=HTTPBasicAuth(USERNAME, API_TOKEN),
            json={'executable': 'bash'},
            timeout=30
        )

        if response.status_code == 201:
            console = response.json()
            console_id = console.get('id')
            print(f"✓ Created console: {console_id}")

            # Send deployment commands
            deployment_script = f"""
cd ~
if [ -d "genesis-rebuild" ]; then
    cd genesis-rebuild && git fetch && git checkout deploy-clean && git pull
else
    git clone -b deploy-clean https://github.com/Rainking6693/Genesis-Rebuild.git genesis-rebuild && cd genesis-rebuild
fi
python3.12 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install fastapi uvicorn[standard] python-dotenv httpx pydantic requests
pip install -r requirements_app.txt 2>/dev/null || true
pip install -r requirements_infrastructure.txt 2>/dev/null || true
cat > .env << 'EOF'
GENESIS_ENV=production
ENVIRONMENT=production
DEBUG=false
A2A_API_KEY=fDTBq7cJX_jt3UggjCe9D2mu5hTWGDuYdWr8AEF9Wss
GENESIS_API_KEY=Rc2bxEoGBR0ZRaFBGmyK8x0RHPAoghrMnDodzSZU7hc
PYTHONPATH=/home/{USERNAME}/genesis-rebuild
EOF
echo "Deployment complete!"
"""

            # Send input to console
            response = requests.post(
                f"{API_BASE}/user/{USERNAME}/consoles/{console_id}/send_input/",
                auth=HTTPBasicAuth(USERNAME, API_TOKEN),
                json={'input': deployment_script},
                timeout=30
            )

            if response.status_code == 200:
                print("✓ Commands sent to console")
                print("\nWaiting 30 seconds for execution...")
                time.sleep(30)

                # Get output
                response = requests.get(
                    f"{API_BASE}/user/{USERNAME}/consoles/{console_id}/get_latest_output/",
                    auth=HTTPBasicAuth(USERNAME, API_TOKEN),
                    timeout=10
                )

                if response.status_code == 200:
                    output = response.json().get('output', '')
                    print("\n--- Console Output ---")
                    print(output[-2000:])  # Last 2000 chars
                    print("--- End Output ---\n")

                return True

        else:
            print(f"⚠ Could not create console: {response.status_code}")
            print(f"  Response: {response.text}")

    except Exception as e:
        print(f"⚠ Error: {e}")

    return False

def configure_webapp(webapp):
    """Configure web app settings"""
    if not webapp:
        return False

    domain = webapp.get('domain_name')
    print(f"\n{'='*70}")
    print(f"Configuring web app: {domain}")
    print('='*70)

    project_path = f"/home/{USERNAME}/genesis-rebuild"
    venv_path = f"{project_path}/venv"

    try:
        # Update virtualenv
        response = requests.patch(
            f"{API_BASE}/user/{USERNAME}/webapps/{domain}/",
            auth=HTTPBasicAuth(USERNAME, API_TOKEN),
            json={'virtualenv_path': venv_path},
            timeout=10
        )

        if response.status_code == 200:
            print(f"✓ Set virtualenv: {venv_path}")
        else:
            print(f"⚠ Virtualenv update failed: {response.status_code}")

        # Note: WSGI file update needs to be done via files API or manually
        print("\n⚠ WSGI file must be updated manually:")
        print(f"  1. Go to Web tab")
        print(f"  2. Click 'WSGI configuration file'")
        print(f"  3. Replace with contents from wsgi_deploy.py")

        return True

    except Exception as e:
        print(f"⚠ Error: {e}")
        return False

def reload_webapp(webapp):
    """Reload web app"""
    if not webapp:
        return False

    domain = webapp.get('domain_name')
    print(f"\n{'='*70}")
    print(f"Reloading web app: {domain}")
    print('='*70)

    try:
        response = requests.post(
            f"{API_BASE}/user/{USERNAME}/webapps/{domain}/reload/",
            auth=HTTPBasicAuth(USERNAME, API_TOKEN),
            timeout=30
        )

        if response.status_code == 200:
            print(f"✓ Web app reloaded successfully!")
            return True
        else:
            print(f"⚠ Reload failed: {response.status_code}")
            print(f"  Response: {response.text}")

    except Exception as e:
        print(f"⚠ Error: {e}")

    return False

def main():
    """Main deployment"""
    print("="*70)
    print("PYTHONANYWHERE AUTOMATED DEPLOYMENT")
    print(f"Username: {USERNAME}")
    print("="*70)
    print()

    # Test API
    if not test_api_auth():
        print("\n⚠ API authentication failed")
        print("Continuing with manual deployment instructions...")
    else:
        print("\n✓ API authentication successful!")

        # Get/create webapp
        webapp = get_or_create_webapp()

        # Run deployment via console
        if create_console_and_run_commands():
            print("✓ Deployment commands executed")

        # Configure webapp
        if webapp:
            configure_webapp(webapp)
            reload_webapp(webapp)

    # Print final instructions
    print("\n" + "="*70)
    print("DEPLOYMENT STATUS")
    print("="*70)
    print(f"Username: {USERNAME}")
    print(f"Domain: https://{USERNAME}.pythonanywhere.com")
    print(f"Project: /home/{USERNAME}/genesis-rebuild")
    print()
    print("Test your deployment:")
    print(f"  curl https://{USERNAME}.pythonanywhere.com/api/health")
    print()
    print("Your endpoints:")
    print(f"  https://{USERNAME}.pythonanywhere.com/api/health")
    print(f"  https://{USERNAME}.pythonanywhere.com/api/agents")
    print(f"  https://{USERNAME}.pythonanywhere.com/a2a/")
    print("="*70)

if __name__ == "__main__":
    main()
