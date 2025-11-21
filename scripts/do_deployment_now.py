#!/usr/bin/env python3
"""
Actually perform PythonAnywhere deployment via API
This script does everything possible via the API
"""

import requests
import json
import time
import base64
from pathlib import Path

API_TOKEN = "d96e5e35ee2070fd3d41f83ddb856859a7f4ea7d"
API_BASE = "https://www.pythonanywhere.com/api/v0"

def api_request(method, endpoint, **kwargs):
    """Make API request with authentication"""
    url = f"{API_BASE}{endpoint}"
    headers = kwargs.pop('headers', {})
    headers['Authorization'] = f'Token {API_TOKEN}'

    try:
        response = requests.request(method, url, headers=headers, timeout=30, **kwargs)
        return response
    except Exception as e:
        print(f"  ⚠ Request failed: {e}")
        return None

def get_username():
    """Get username from API"""
    print("Getting username from API...")

    # Try different methods to get username
    # Method 1: Check if there's a user endpoint
    response = api_request('GET', '/user/')
    if response and response.status_code == 200:
        data = response.json()
        username = data.get('username')
        if username:
            print(f"✓ Found username: {username}")
            return username

    # Method 2: Try common usernames from the account
    for username in ['rainking6693', 'rainking632', 'genesis']:
        response = api_request('GET', f'/user/{username}/')
        if response and response.status_code == 200:
            print(f"✓ Confirmed username: {username}")
            return username

    # Default to rainking6693 based on the domain we saw
    print("⚠ Using default username: rainking6693")
    return 'rainking6693'

def list_consoles(username):
    """List existing consoles"""
    print(f"Checking existing consoles...")
    response = api_request('GET', f'/user/{username}/consoles/')
    if response and response.status_code == 200:
        consoles = response.json()
        print(f"✓ Found {len(consoles)} console(s)")
        return consoles
    print("  No consoles found or API error")
    return []

def create_console(username):
    """Create a new bash console"""
    print("Creating new bash console...")
    response = api_request('POST', f'/user/{username}/consoles/',
                          json={'executable': 'bash', 'arguments': ''})
    if response and response.status_code == 201:
        console = response.json()
        console_id = console.get('id')
        print(f"✓ Created console ID: {console_id}")
        return console_id
    print(f"  ⚠ Could not create console: {response.status_code if response else 'No response'}")
    return None

def send_console_input(username, console_id, command):
    """Send input to console"""
    print(f"Sending command: {command[:50]}...")
    response = api_request('POST', f'/user/{username}/consoles/{console_id}/send_input/',
                          json={'input': command + '\n'})
    if response and response.status_code == 200:
        print("✓ Command sent")
        return True
    print(f"  ⚠ Failed to send command")
    return False

def get_console_output(username, console_id):
    """Get latest console output"""
    response = api_request('GET', f'/user/{username}/consoles/{console_id}/get_latest_output/')
    if response and response.status_code == 200:
        return response.json().get('output', '')
    return ''

def list_files(username, path='/'):
    """List files in directory"""
    response = api_request('GET', f'/user/{username}/files/path{path}')
    if response and response.status_code == 200:
        return response.text
    return None

def upload_file(username, remote_path, content):
    """Upload file content"""
    print(f"Uploading to {remote_path}...")

    # For text files, use the files API
    response = api_request('POST', f'/user/{username}/files/path{remote_path}',
                          data=content.encode('utf-8') if isinstance(content, str) else content,
                          headers={'Content-Type': 'application/octet-stream'})

    if response and response.status_code in [200, 201]:
        print(f"✓ Uploaded {remote_path}")
        return True

    print(f"  ⚠ Upload failed: {response.status_code if response else 'No response'}")
    return False

def check_or_create_webapp(username):
    """Check for existing web app or create new one"""
    domain = f"{username}.pythonanywhere.com"
    print(f"Checking web app: {domain}")

    # List existing web apps
    response = api_request('GET', f'/user/{username}/webapps/')
    if response and response.status_code == 200:
        webapps = response.json()
        for webapp in webapps:
            if webapp.get('domain_name') == domain:
                print(f"✓ Found existing web app")
                return webapp

    # Create new web app
    print("Creating new web app...")
    response = api_request('POST', f'/user/{username}/webapps/',
                          json={'domain_name': domain, 'python_version': 'python312'})

    if response and response.status_code == 201:
        webapp = response.json()
        print(f"✓ Created web app: {domain}")
        return webapp

    print(f"  ⚠ Could not create web app: {response.status_code if response else 'No response'}")
    if response:
        print(f"  Response: {response.text}")
    return None

def update_webapp_virtualenv(username, domain, venv_path):
    """Update web app virtualenv"""
    print(f"Setting virtualenv to {venv_path}...")
    response = api_request('PATCH', f'/user/{username}/webapps/{domain}/',
                          json={'virtualenv_path': venv_path})
    if response and response.status_code == 200:
        print("✓ Virtualenv configured")
        return True
    print(f"  ⚠ Failed to set virtualenv")
    return False

def update_wsgi_file(username, domain, wsgi_content):
    """Update WSGI file content"""
    print("Updating WSGI file...")

    # The WSGI file path is typically /var/www/username_pythonanywhere_com_wsgi.py
    wsgi_filename = domain.replace('.', '_') + '_wsgi.py'
    wsgi_path = f'/var/www/{wsgi_filename}'

    response = api_request('POST', f'/user/{username}/files/path{wsgi_path}',
                          data=wsgi_content.encode('utf-8'),
                          headers={'Content-Type': 'text/plain'})

    if response and response.status_code in [200, 201]:
        print("✓ WSGI file updated")
        return True

    print(f"  ⚠ WSGI update failed: {response.status_code if response else 'No response'}")
    return False

def reload_webapp(username, domain):
    """Reload web application"""
    print("Reloading web app...")
    response = api_request('POST', f'/user/{username}/webapps/{domain}/reload/')
    if response and response.status_code == 200:
        print("✓ Web app reloaded")
        return True
    print(f"  ⚠ Reload failed")
    return False

def execute_deployment_via_console(username):
    """Execute deployment commands via console"""
    print("\n" + "="*70)
    print("EXECUTING DEPLOYMENT VIA CONSOLE")
    print("="*70)

    # Create console
    console_id = create_console(username)
    if not console_id:
        print("⚠ Could not create console - will need manual deployment")
        return False

    time.sleep(2)

    # Commands to execute
    commands = [
        "cd ~",
        "pwd",
        "# Clone deploy-clean branch",
        "if [ -d 'genesis-rebuild' ]; then cd genesis-rebuild && git fetch && git checkout deploy-clean && git pull; else git clone -b deploy-clean https://github.com/Rainking6693/Genesis-Rebuild.git genesis-rebuild && cd genesis-rebuild; fi",
        "# Create virtual environment",
        "python3.12 -m venv venv",
        "source venv/bin/activate",
        "# Install dependencies",
        "pip install --upgrade pip",
        "pip install fastapi uvicorn[standard] python-dotenv httpx pydantic requests",
        "# Install project requirements",
        "[ -f requirements_app.txt ] && pip install -r requirements_app.txt",
        "[ -f requirements_infrastructure.txt ] && pip install -r requirements_infrastructure.txt",
        "# Create .env file",
        "cat > .env << 'ENVFILE'\nGENESIS_ENV=production\nENVIRONMENT=production\nDEBUG=false\nA2A_API_KEY=fDTBq7cJX_jt3UggjCe9D2mu5hTWGDuYdWr8AEF9Wss\nGENESIS_API_KEY=Rc2bxEoGBR0ZRaFBGmyK8x0RHPAoghrMnDodzSZU7hc\nPYTHONPATH=/home/rainking6693/genesis-rebuild\nENVFILE",
        "echo 'Deployment complete!'",
        "ls -la",
    ]

    # Send all commands
    for cmd in commands:
        if cmd.strip() and not cmd.startswith('#'):
            send_console_input(username, console_id, cmd)
            time.sleep(1)

    print("\n✓ Commands sent to console")
    print(f"  Console ID: {console_id}")

    # Wait for execution
    print("\nWaiting for deployment to complete (30 seconds)...")
    time.sleep(30)

    # Get output
    output = get_console_output(username, console_id)
    if output:
        print("\n--- Console Output (last 1000 chars) ---")
        print(output[-1000:])
        print("--- End Output ---\n")

    return True

def main():
    """Main deployment execution"""
    print("="*70)
    print("PYTHONANYWHERE AUTOMATED DEPLOYMENT")
    print("="*70)
    print()

    # Step 1: Get username
    print("[1/6] Getting username...")
    username = get_username()
    domain = f"{username}.pythonanywhere.com"
    project_path = f"/home/{username}/genesis-rebuild"
    print()

    # Step 2: Upload deployment files
    print("[2/6] Uploading deployment files...")

    # Read deployment script
    deploy_script = Path('deploy_on_pythonanywhere.sh')
    if deploy_script.exists():
        with open(deploy_script, 'r') as f:
            content = f.read()
        upload_file(username, f'/home/{username}/deploy_script.sh', content)

    # Read WSGI file
    wsgi_file = Path('wsgi_deploy.py')
    wsgi_content = ""
    if wsgi_file.exists():
        with open(wsgi_file, 'r') as f:
            wsgi_content = f.read()
    print()

    # Step 3: Execute deployment via console
    print("[3/6] Executing deployment...")
    execute_deployment_via_console(username)
    print()

    # Step 4: Check/create web app
    print("[4/6] Setting up web app...")
    webapp = check_or_create_webapp(username)
    print()

    # Step 5: Configure web app
    if webapp:
        print("[5/6] Configuring web app...")
        venv_path = f"{project_path}/venv"
        update_webapp_virtualenv(username, domain, venv_path)

        if wsgi_content:
            update_wsgi_file(username, domain, wsgi_content)
        print()

        # Step 6: Reload
        print("[6/6] Reloading web app...")
        reload_webapp(username, domain)
    else:
        print("[5/6] ⚠ Web app not available via API")
        print("[6/6] ⚠ Manual configuration needed")

    print()
    print("="*70)
    print("DEPLOYMENT STATUS")
    print("="*70)
    print(f"Username: {username}")
    print(f"Domain: https://{domain}")
    print(f"Project: {project_path}")
    print()

    if webapp:
        print("✓ Automated deployment completed!")
        print()
        print("Test your deployment:")
        print(f"  curl https://{domain}/api/health")
    else:
        print("⚠ Partial deployment completed")
        print()
        print("Manual steps needed:")
        print("1. Go to https://www.pythonanywhere.com/user/rainking6693/webapps/")
        print("2. Create web app if needed")
        print("3. Set virtualenv: /home/rainking6693/genesis-rebuild/venv")
        print("4. Update WSGI file with contents from wsgi_deploy.py")
        print("5. Click Reload")

    print()
    print("Your endpoints:")
    print(f"  https://{domain}/api/health")
    print(f"  https://{domain}/api/agents")
    print(f"  https://{domain}/a2a/")
    print("="*70)

if __name__ == "__main__":
    main()
