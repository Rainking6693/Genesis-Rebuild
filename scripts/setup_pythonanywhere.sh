#!/bin/bash
# Setup script for PythonAnywhere deployment
# Run this in PythonAnywhere Bash console

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

# Step 1: Create virtual environment
echo "[1/5] Creating virtual environment..."
cd ~
if [ ! -d "genesis-rebuild" ]; then
    echo "⚠ Project directory not found. Please upload code first."
    exit 1
fi

cd genesis-rebuild

if [ ! -d "venv" ]; then
    python3.12 -m venv venv
    echo "✓ Virtual environment created"
else
    echo "✓ Virtual environment already exists"
fi

# Step 2: Activate and install dependencies
echo ""
echo "[2/5] Installing dependencies..."
source venv/bin/activate
pip install --upgrade pip --quiet

# Install requirements
if [ -f "requirements_app.txt" ]; then
    pip install -r requirements_app.txt --quiet
fi

if [ -f "requirements_infrastructure.txt" ]; then
    pip install -r requirements_infrastructure.txt --quiet
fi

if [ -f "genesis-dashboard/backend/requirements.txt" ]; then
    pip install -r genesis-dashboard/backend/requirements.txt --quiet
fi

# Essential packages
pip install fastapi uvicorn[standard] python-dotenv httpx --quiet

echo "✓ Dependencies installed"

# Step 3: Create .env file
echo ""
echo "[3/5] Creating .env file..."
if [ ! -f ".env" ]; then
    cat > .env << EOF
# Genesis Environment Configuration
GENESIS_ENV=production
ENVIRONMENT=production
DEBUG=false
PYTHONPATH=$PROJECT_DIR

# API Keys (CHANGE THESE!)
A2A_API_KEY=$(python3 -c "import secrets; print(secrets.token_urlsafe(32))")
GENESIS_API_KEY=$(python3 -c "import secrets; print(secrets.token_urlsafe(32))")
EOF
    echo "✓ .env file created with secure API keys"
else
    echo "✓ .env file already exists"
fi

# Step 4: Create WSGI file
echo ""
echo "[4/5] Creating WSGI file..."
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
from dotenv import load_dotenv
load_dotenv('$PROJECT_DIR/.env')

# Import application
try:
    # Try dashboard backend first
    from genesis_dashboard.backend.api import app as application
    print("✓ Loaded Genesis Dashboard API")
except ImportError as e:
    try:
        # Fallback to A2A service
        from a2a_service import app as application
        print("✓ Loaded A2A Service")
    except ImportError as e2:
        # Last resort: simple health check
        from fastapi import FastAPI
        application = FastAPI()
        
        @application.get("/")
        def health():
            return {"status": "ok", "service": "genesis-rebuild", "error": str(e2)}
        
        print("⚠ Using fallback health check app")

if __name__ == "__main__":
    application.run()
EOF
echo "✓ WSGI file created: wsgi.py"

# Step 5: Create startup script
echo ""
echo "[5/5] Creating startup script..."
cat > start_dashboard.sh << 'EOF'
#!/bin/bash
# Start Genesis Dashboard (for testing in console)
cd ~/genesis-rebuild
source venv/bin/activate
cd genesis-dashboard/backend
python api.py
EOF
chmod +x start_dashboard.sh
echo "✓ Startup script created"

echo ""
echo "=========================================="
echo "Setup Complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Go to Web tab in PythonAnywhere"
echo "2. Edit WSGI configuration file"
echo "3. Copy contents of wsgi.py to WSGI file"
echo "4. Set environment variables in Web tab:"
echo "   - GENESIS_ENV=production"
echo "   - ENVIRONMENT=production"
echo "   - A2A_API_KEY=(from .env file)"
echo "   - GENESIS_API_KEY=(from .env file)"
echo "5. Click 'Reload' button"
echo ""
echo "Your API will be available at:"
echo "https://$USERNAME.pythonanywhere.com/api/health"
echo ""


