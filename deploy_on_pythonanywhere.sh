#!/bin/bash
# PythonAnywhere Deployment Script - Run this in PythonAnywhere Bash console
# Generated for user: rainking6693

set -e

echo "=========================================="
echo "Genesis Rebuild - PythonAnywhere Deploy"
echo "Branch: deploy-clean"
echo "=========================================="

# Step 1: Clone repository from deploy-clean branch
echo ""
echo "[1/5] Cloning repository..."
cd ~
if [ -d "genesis-rebuild" ]; then
    echo "Directory exists, pulling latest changes..."
    cd genesis-rebuild
    git fetch origin
    git checkout deploy-clean
    git pull origin deploy-clean
else
    echo "Cloning from GitHub..."
    git clone -b deploy-clean https://github.com/Rainking6693/Genesis-Rebuild.git genesis-rebuild
    cd genesis-rebuild
fi

echo "✓ Code synchronized from deploy-clean branch"

# Step 2: Create virtual environment
echo ""
echo "[2/5] Creating virtual environment..."
if [ ! -d "venv" ]; then
    python3.12 -m venv venv
    echo "✓ Virtual environment created"
else
    echo "✓ Virtual environment already exists"
fi

# Step 3: Install dependencies
echo ""
echo "[3/5] Installing dependencies..."
source venv/bin/activate
pip install --upgrade pip

# Install from all requirements files
for req_file in requirements_app.txt requirements_infrastructure.txt genesis-dashboard/backend/requirements.txt; do
    if [ -f "$req_file" ]; then
        echo "Installing from $req_file..."
        pip install -r "$req_file"
    fi
done

# Ensure essential packages
pip install fastapi uvicorn[standard] python-dotenv httpx pydantic

echo "✓ Dependencies installed"

# Step 4: Create .env file
echo ""
echo "[4/5] Creating .env file..."
cat > .env << 'ENVFILE'
# Genesis Environment Configuration
GENESIS_ENV=production
ENVIRONMENT=production
DEBUG=false
PYTHONPATH=/home/rainking6693/genesis-rebuild

# API Keys (Generated)
A2A_API_KEY=fDTBq7cJX_jt3UggjCe9D2mu5hTWGDuYdWr8AEF9Wss
GENESIS_API_KEY=Rc2bxEoGBR0ZRaFBGmyK8x0RHPAoghrMnDodzSZU7hc

# Optional: Add additional keys as needed
# ANTHROPIC_API_KEY=your_key_here
# OPENAI_API_KEY=your_key_here
ENVFILE

echo "✓ .env file created with API keys"

# Step 5: Verify installation
echo ""
echo "[5/5] Verifying installation..."
python3 -c "import fastapi; import uvicorn; print('✓ FastAPI installed')"
python3 -c "import sys; print('✓ Python version:', sys.version)"

echo ""
echo "=========================================="
echo "Deployment Complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Go to Web tab in PythonAnywhere"
echo "2. Click 'Add a new web app' (if not exists)"
echo "3. Choose Python 3.12 → Manual configuration"
echo "4. Edit WSGI configuration file"
echo "5. Copy contents from wsgi_deploy.py"
echo "6. Set Source directory: /home/rainking6693/genesis-rebuild"
echo "7. Set Virtualenv: /home/rainking6693/genesis-rebuild/venv"
echo "8. Click 'Reload' button"
echo ""
echo "Your API will be available at:"
echo "https://rainking6693.pythonanywhere.com/api/health"
echo ""
