#!/bin/bash
# Quick deployment script for PythonAnywhere
# Run this in a Bash console on PythonAnywhere

set -e

echo "=========================================="
echo "Genesis Rebuild - Quick Deployment"
echo "=========================================="
echo ""

USERNAME=$(whoami)
PROJECT_DIR="/home/$USERNAME/genesis-rebuild"

echo "Username: $USERNAME"
echo "Project Directory: $PROJECT_DIR"
echo ""

# Step 1: Clone repository
echo "[1/4] Cloning repository..."
cd ~
if [ -d "genesis-rebuild" ]; then
    echo "Repository exists, updating..."
    cd genesis-rebuild
    git fetch origin
    git checkout deploy-clean
    git pull origin deploy-clean
else
    echo "Cloning repository..."
    git clone -b deploy-clean https://github.com/Rainking6693/Genesis-Rebuild.git genesis-rebuild
    cd genesis-rebuild
fi
echo "✓ Repository ready"

# Step 2: Create virtual environment
echo ""
echo "[2/4] Creating virtual environment..."
if [ ! -d "venv" ]; then
    python3.12 -m venv venv
    echo "✓ Virtual environment created"
else
    echo "✓ Virtual environment already exists"
fi

# Step 3: Install dependencies
echo ""
echo "[3/4] Installing dependencies..."
source venv/bin/activate
pip install --upgrade pip --quiet

# Install essential packages
pip install fastapi uvicorn[standard] python-dotenv httpx --quiet

# Install from requirements if available
if [ -f "requirements.txt" ]; then
    pip install -r requirements.txt --quiet 2>/dev/null || echo "⚠ Some requirements failed, continuing..."
fi

echo "✓ Dependencies installed"

# Step 4: Create .env file
echo ""
echo "[4/4] Creating .env file..."
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

echo ""
echo "=========================================="
echo "Setup Complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Go to Web tab: https://www.pythonanywhere.com/user/$USERNAME/webapps/"
echo "2. Set Source code: $PROJECT_DIR"
echo "3. Set Working directory: $PROJECT_DIR"
echo "4. Set Virtualenv: $PROJECT_DIR/venv"
echo "5. Click 'Reload' button"
echo ""
echo "Then test: curl https://$USERNAME.pythonanywhere.com/api/health"
echo ""


