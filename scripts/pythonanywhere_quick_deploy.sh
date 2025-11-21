#!/bin/bash
# Quick deployment script for PythonAnywhere
# This creates a deployment package you can upload

set -e

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DEPLOY_DIR="$PROJECT_ROOT/pythonanywhere_deploy"

echo "Creating PythonAnywhere deployment package..."

# Create deployment directory
rm -rf "$DEPLOY_DIR"
mkdir -p "$DEPLOY_DIR"

# Copy essential files
echo "Copying files..."
cp -r agents "$DEPLOY_DIR/"
cp -r infrastructure "$DEPLOY_DIR/"
cp -r genesis-dashboard "$DEPLOY_DIR/"
cp -r config "$DEPLOY_DIR/"
cp -r scripts "$DEPLOY_DIR/"

# Copy requirements
cp requirements_app.txt "$DEPLOY_DIR/" 2>/dev/null || true
cp requirements_infrastructure.txt "$DEPLOY_DIR/" 2>/dev/null || true

# Copy WSGI and setup files
cp wsgi.py "$DEPLOY_DIR/"
cp PYTHONANYWHERE_DEPLOYMENT.md "$DEPLOY_DIR/"
cp scripts/setup_pythonanywhere.sh "$DEPLOY_DIR/"

# Create .env template
cat > "$DEPLOY_DIR/.env.template" << 'EOF'
# Genesis Environment Configuration
GENESIS_ENV=production
ENVIRONMENT=production
DEBUG=false

# API Keys (Generate secure keys!)
A2A_API_KEY=your-secure-api-key-here
GENESIS_API_KEY=your-secure-api-key-here
EOF

# Create README
cat > "$DEPLOY_DIR/README.md" << 'EOF'
# Genesis Rebuild - PythonAnywhere Deployment Package

## Quick Setup

1. Upload this entire directory to PythonAnywhere: `/home/yourusername/genesis-rebuild`

2. Run setup script in PythonAnywhere Bash console:
   ```bash
   cd ~/genesis-rebuild
   bash setup_pythonanywhere.sh
   ```

3. Configure WSGI file in PythonAnywhere Web tab (see PYTHONANYWHERE_DEPLOYMENT.md)

4. Set environment variables in Web tab

5. Reload web app

See PYTHONANYWHERE_DEPLOYMENT.md for detailed instructions.
EOF

# Create zip file
cd "$PROJECT_ROOT"
zip -r pythonanywhere_deploy.zip pythonanywhere_deploy/ -x "*.pyc" -x "__pycache__/*" -x "*.git/*" -x "node_modules/*" 2>/dev/null || {
    echo "Note: zip command not available, but deployment directory is ready"
}

echo ""
echo "✓ Deployment package created: $DEPLOY_DIR"
echo "✓ Upload this directory to PythonAnywhere"
echo ""


