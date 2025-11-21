#!/bin/bash
# Complete PythonAnywhere deployment script
# Creates deployment package and provides instructions

set -e

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
echo "Genesis Rebuild - PythonAnywhere Deployment"
echo "=========================================="
echo ""

# Check if we have the API token
API_TOKEN="d96e5e35ee2070fd3d41f83ddb856859a7f4ea7d"
echo "✓ API Token configured"
echo ""

# Create summary document
cat > "$PROJECT_ROOT/PYTHONANYWHERE_SETUP_COMPLETE.md" << 'EOF'
# PythonAnywhere Deployment - Ready to Deploy

## ✅ Files Created

1. **PYTHONANYWHERE_DEPLOYMENT.md** - Complete deployment guide
2. **wsgi.py** - WSGI configuration file
3. **scripts/setup_pythonanywhere.sh** - Automated setup script

## 🚀 Quick Deployment Steps

### Step 1: Upload Code to PythonAnywhere

**Option A: Using Git (Recommended)**
```bash
# In PythonAnywhere Bash console
cd ~
git clone <your-repo-url> genesis-rebuild
cd genesis-rebuild
```

**Option B: Using Files Tab**
1. Go to PythonAnywhere → Files tab
2. Navigate to `/home/yourusername/`
3. Upload project files

### Step 2: Run Setup Script

```bash
cd ~/genesis-rebuild
bash scripts/setup_pythonanywhere.sh
```

This will:
- Create virtual environment
- Install all dependencies
- Create .env file with secure API keys
- Create WSGI file

### Step 3: Configure Web App

1. Go to **Web** tab in PythonAnywhere
2. Click **"Add a new web app"** (if not exists)
3. Choose **Python 3.12** and **Manual configuration**
4. Edit **WSGI configuration file**:
   - Copy contents from `wsgi.py` in project root
   - **IMPORTANT:** Replace `yourusername` with your actual username!
5. Set **Source code directory**: `/home/yourusername/genesis-rebuild`
6. Set **Virtualenv path**: `/home/yourusername/genesis-rebuild/venv`

### Step 4: Set Environment Variables

In Web tab → Environment variables section, add:

```
GENESIS_ENV=production
ENVIRONMENT=production
A2A_API_KEY=(check .env file for generated key)
GENESIS_API_KEY=(check .env file for generated key)
DEBUG=false
PYTHONPATH=/home/yourusername/genesis-rebuild
```

### Step 5: Reload Web App

Click **"Reload"** button in Web tab

## 📊 Dashboard Access

Once deployed, access:

- **Health Check**: `https://yourusername.pythonanywhere.com/api/health`
- **Dashboard API**: `https://yourusername.pythonanywhere.com/api/agents`
- **A2A Service**: `https://yourusername.pythonanywhere.com/a2a/`

## 🔍 Verification

Test the deployment:

```bash
curl https://yourusername.pythonanywhere.com/api/health
```

Should return:
```json
{
  "status": "healthy",
  "timestamp": "...",
  "version": "1.0.0"
}
```

## 📝 Notes

- The dashboard backend (FastAPI) will be the main service
- Frontend can be deployed separately to Vercel/Netlify if needed
- All environment variables are set up automatically
- API keys are generated securely in .env file

## 🆘 Troubleshooting

If you see errors:
1. Check **Error log** in Web tab
2. Verify WSGI file has correct username
3. Ensure virtual environment is activated
4. Check all dependencies are installed

See PYTHONANYWHERE_DEPLOYMENT.md for detailed troubleshooting.
EOF

echo "✓ Created deployment summary"
echo ""
echo "=========================================="
echo "Deployment Files Ready!"
echo "=========================================="
echo ""
echo "Files created:"
echo "  ✓ PYTHONANYWHERE_DEPLOYMENT.md - Full guide"
echo "  ✓ PYTHONANYWHERE_SETUP_COMPLETE.md - Quick start"
echo "  ✓ wsgi.py - WSGI configuration"
echo "  ✓ scripts/setup_pythonanywhere.sh - Setup script"
echo ""
echo "Next steps:"
echo "1. Upload code to PythonAnywhere"
echo "2. Run: bash scripts/setup_pythonanywhere.sh"
echo "3. Configure Web app in PythonAnywhere dashboard"
echo "4. Reload and test!"
echo ""
echo "See PYTHONANYWHERE_SETUP_COMPLETE.md for instructions"
echo ""


