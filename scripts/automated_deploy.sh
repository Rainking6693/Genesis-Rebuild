#!/bin/bash
# Automated PythonAnywhere Deployment Script
# This script prepares everything for deployment

set -e

echo "=========================================="
echo "Genesis Rebuild - Automated Deployment"
echo "=========================================="
echo ""

# Configuration
REPO_URL="https://github.com/Rainking6693/Genesis-Rebuild.git"
BRANCH="deploy-clean"
PROJECT_NAME="genesis-rebuild"

echo "This script will prepare deployment files."
echo "For actual deployment, you'll need to:"
echo "1. Log into PythonAnywhere web interface"
echo "2. Run the commands shown below in a Bash console"
echo "3. Configure the web app via the Web tab"
echo ""
echo "Press Enter to continue or Ctrl+C to cancel..."
read

# Create deployment script for PythonAnywhere
cat > deploy_on_pythonanywhere.sh << 'DEPLOY_SCRIPT'
#!/bin/bash
# Run this script in PythonAnywhere Bash console

set -e

echo "=========================================="
echo "Genesis Rebuild - PythonAnywhere Setup"
echo "=========================================="

# Get username
USERNAME=$(whoami)
PROJECT_DIR="/home/$USERNAME/genesis-rebuild"

echo "Username: $USERNAME"
echo "Project Directory: $PROJECT_DIR"
echo ""

# Step 1: Clone or update repository
echo "[1/6] Cloning/updating repository..."
cd ~
if [ -d "$PROJECT_NAME" ]; then
    echo "Repository exists, updating..."
    cd $PROJECT_NAME
    git fetch origin
    git checkout $BRANCH
    git pull origin $BRANCH
else
    echo "Cloning repository..."
    git clone -b $BRANCH $REPO_URL $PROJECT_NAME
    cd $PROJECT_NAME
fi
echo "✓ Repository ready"

# Step 2: Create virtual environment
echo ""
echo "[2/6] Creating virtual environment..."
if [ ! -d "venv" ]; then
    python3.12 -m venv venv
    echo "✓ Virtual environment created"
else
    echo "✓ Virtual environment already exists"
fi

# Step 3: Install dependencies
echo ""
echo "[3/6] Installing dependencies..."
source venv/bin/activate
pip install --upgrade pip --quiet

# Install from requirements files
if [ -f "requirements.txt" ]; then
    pip install -r requirements.txt --quiet
fi

# Essential packages for FastAPI
pip install fastapi uvicorn[standard] python-dotenv httpx --quiet

echo "✓ Dependencies installed"

# Step 4: Create .env file
echo ""
echo "[4/6] Creating .env file..."
if [ ! -f ".env" ]; then
    cat > .env << EOF
# Genesis Environment Configuration
GENESIS_ENV=production
ENVIRONMENT=production
DEBUG=false
PYTHONPATH=$PROJECT_DIR

# API Keys (auto-generated)
A2A_API_KEY=$(python3 -c "import secrets; print(secrets.token_urlsafe(32))")
GENESIS_API_KEY=$(python3 -c "import secrets; print(secrets.token_urlsafe(32))")
EOF
    echo "✓ .env file created with secure API keys"
else
    echo "✓ .env file already exists"
fi

# Step 5: Create WSGI file
echo ""
echo "[5/6] Creating WSGI file..."
cat > wsgi.py << EOF
# Genesis Rebuild WSGI Configuration
import sys
import os

# Add project to path
project_home = '$PROJECT_DIR'
if project_home not in sys.path:
    sys.path.insert(0, project_home)

# Add venv to path
venv_path = '$PROJECT_DIR/venv/lib/python3.12/site-packages'
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
    # Try dashboard backend first
    from genesis_dashboard.backend.api import app as application
    print("✓ Loaded Genesis Dashboard API")
except ImportError as e:
    print(f"⚠ Dashboard import failed: {e}")
    try:
        # Try a2a_fastapi
        from a2a_fastapi import app as application
        print("✓ Loaded A2A FastAPI")
    except ImportError as e2:
        print(f"⚠ A2A FastAPI import failed: {e2}")
        try:
            # Try a2a_service
            from a2a_service import app as application
            print("✓ Loaded A2A Service")
        except ImportError as e3:
            # Last resort: simple health check
            from fastapi import FastAPI
            application = FastAPI(title="Genesis Rebuild", version="1.0.0")
            
            @application.get("/")
            def health():
                return {"status": "ok", "service": "genesis-rebuild"}
            
            @application.get("/api/health")
            def api_health():
                return {"status": "healthy", "service": "genesis-rebuild"}
            
            print("⚠ Using fallback health check app")
EOF
echo "✓ WSGI file created: wsgi.py"

# Step 6: Display next steps
echo ""
echo "[6/6] Setup complete!"
echo ""
echo "=========================================="
echo "Next Steps (in PythonAnywhere Web tab):"
echo "=========================================="
echo ""
echo "1. Go to Web tab"
echo "2. Click 'Add a new web app' (or edit existing)"
echo "3. Domain: $USERNAME.pythonanywhere.com"
echo "4. Python: 3.12"
echo "5. Configuration: Manual configuration"
echo ""
echo "6. Set these in Web tab:"
echo "   - Source code: $PROJECT_DIR"
echo "   - Working directory: $PROJECT_DIR"
echo "   - Virtualenv: $PROJECT_DIR/venv"
echo ""
echo "7. Click 'WSGI configuration file' link"
echo "8. Delete all content"
echo "9. Copy entire contents of wsgi.py"
echo "10. Paste into WSGI file and save"
echo ""
echo "11. In Web tab → Environment variables, add:"
echo "    GENESIS_ENV=production"
echo "    ENVIRONMENT=production"
echo "    DEBUG=false"
echo "    PYTHONPATH=$PROJECT_DIR"
echo ""
echo "12. Click 'Reload' button"
echo ""
echo "13. Test: curl https://$USERNAME.pythonanywhere.com/api/health"
echo ""
echo "=========================================="
echo "Deployment URL:"
echo "https://$USERNAME.pythonanywhere.com/"
echo "=========================================="
DEPLOY_SCRIPT

chmod +x deploy_on_pythonanywhere.sh

echo "✓ Created deploy_on_pythonanywhere.sh"
echo ""
echo "=========================================="
echo "Deployment Package Ready!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Log into PythonAnywhere"
echo "2. Open a Bash console"
echo "3. Upload deploy_on_pythonanywhere.sh or copy its contents"
echo "4. Run: bash deploy_on_pythonanywhere.sh"
echo "5. Follow the instructions it displays"
echo ""
echo "Or follow the manual steps in:"
echo "  - PYTHONANYWHERE_DEPLOY_INSTRUCTIONS.md"
echo "  - PYTHONANYWHERE_DEPLOYMENT_COMPLETE.md"
echo ""


