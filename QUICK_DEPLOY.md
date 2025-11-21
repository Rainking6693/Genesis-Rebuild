# 🚀 Genesis PythonAnywhere - Quick Deploy Guide

## ✅ All Files Ready

Three deployment files have been generated and are ready to use:

1. **deploy_on_pythonanywhere.sh** (3.0K) - Automated deployment script
2. **wsgi_deploy.py** (2.5K) - WSGI configuration
3. **DEPLOYMENT_COMPLETE.md** (4.5K) - Complete instructions

## 🎯 Quick Deployment (3 Steps)

### Step 1: Upload Deployment Script

**Option A: Using PythonAnywhere Files Tab**
1. Log into https://www.pythonanywhere.com
2. Go to **Files** tab
3. Navigate to `/home/rainking6693/`
4. Upload `deploy_on_pythonanywhere.sh` from your local machine

**Option B: Using curl/wget in Bash Console**
```bash
# If you have the file hosted somewhere
cd ~
curl -O [URL_to_deploy_on_pythonanywhere.sh]
chmod +x deploy_on_pythonanywhere.sh
```

### Step 2: Run Deployment Script

In PythonAnywhere **Bash Console**:
```bash
cd ~
bash deploy_on_pythonanywhere.sh
```

This will:
- ✅ Clone deploy-clean branch from GitHub
- ✅ Create Python 3.12 virtual environment
- ✅ Install all dependencies
- ✅ Create .env file with API keys
- ✅ Verify installation

### Step 3: Configure Web App

#### 3a. Create Web App (if not exists)
1. Go to **Web** tab
2. Click **"Add a new web app"**
3. Choose **rainking6693.pythonanywhere.com**
4. Select **Python 3.12**
5. Choose **"Manual configuration"**

#### 3b. Configure WSGI File
1. In **Web** tab, click **"WSGI configuration file"** link
2. **Delete all existing content**
3. Copy entire contents from `wsgi_deploy.py`
4. **Save**

#### 3c. Set Directories
In **Web** tab, configure:
- **Source code**: `/home/rainking6693/genesis-rebuild`
- **Working directory**: `/home/rainking6693/genesis-rebuild`
- **Virtualenv**: `/home/rainking6693/genesis-rebuild/venv`

#### 3d. Reload
Click green **"Reload rainking6693.pythonanywhere.com"** button

## ✅ Verify Deployment

Test your deployment:
```bash
curl https://rainking6693.pythonanywhere.com/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "service": "genesis-rebuild",
  "version": "1.0.0",
  "branch": "deploy-clean"
}
```

## 📊 Your Endpoints

After successful deployment:

| Endpoint | URL |
|----------|-----|
| **Health Check** | https://rainking6693.pythonanywhere.com/api/health |
| **Agents List** | https://rainking6693.pythonanywhere.com/api/agents |
| **Dashboard** | https://rainking6693.pythonanywhere.com/ |
| **A2A Service** | https://rainking6693.pythonanywhere.com/a2a/ |
| **HALO Routes** | https://rainking6693.pythonanywhere.com/api/halo/routes |
| **CaseBank** | https://rainking6693.pythonanywhere.com/api/casebank |

## 🔑 Your API Keys

Generated and embedded in `deploy_on_pythonanywhere.sh`:
- **A2A_API_KEY**: fDTBq7cJX_jt3UggjCe9D2mu5hTWGDuYdWr8AEF9Wss
- **GENESIS_API_KEY**: Rc2bxEoGBR0ZRaFBGmyK8x0RHPAoghrMnDodzSZU7hc

*These keys are automatically configured in the .env file by the deployment script*

## 🆘 Troubleshooting

### Script Fails
- Ensure you're in PythonAnywhere **Bash console** (not local terminal)
- Check internet access: `ping github.com`
- Verify Python version: `python3.12 --version`

### Import Errors
- Verify virtualenv is activated: `source ~/genesis-rebuild/venv/bin/activate`
- Check dependencies: `pip list | grep fastapi`
- Test import: `python3 -c "import fastapi; print('OK')"`

### 500 Internal Server Error
- Check **Error log** in Web tab
- Verify WSGI file username is correct (rainking6693)
- Ensure virtualenv path is correct
- Check PYTHONPATH in .env

### WSGI Configuration Issues
- Ensure you copied **entire** wsgi_deploy.py content
- Verify no syntax errors in WSGI file
- Check that username "rainking6693" is correct throughout

## 📁 File Locations on PythonAnywhere

After deployment:
```
/home/rainking6693/
└── genesis-rebuild/              # Project root (from deploy-clean branch)
    ├── venv/                      # Virtual environment
    ├── .env                       # Environment variables (with API keys)
    ├── agents/                    # Agent implementations
    ├── infrastructure/            # Infrastructure modules
    ├── genesis-dashboard/         # Dashboard backend
    │   └── backend/
    │       └── api.py            # Main FastAPI application
    ├── a2a_service.py            # A2A service (fallback)
    └── requirements*.txt         # Dependencies
```

## 🎯 What Gets Deployed

From the **deploy-clean** branch:
- ✅ All 25 Genesis agents with integrations
- ✅ 110+ infrastructure modules
- ✅ Dashboard backend API
- ✅ A2A service
- ✅ OmniDaemon runtime
- ✅ VOIX integration
- ✅ AgentEvolver & DeepEyes
- ✅ All payment systems (AP2, X402)
- ✅ Security & monitoring tools

## 📝 Environment Variables

Set automatically by deployment script in `.env`:

```bash
GENESIS_ENV=production
ENVIRONMENT=production
DEBUG=false
PYTHONPATH=/home/rainking6693/genesis-rebuild
A2A_API_KEY=fDTBq7cJX_jt3UggjCe9D2mu5hTWGDuYdWr8AEF9Wss
GENESIS_API_KEY=Rc2bxEoGBR0ZRaFBGmyK8x0RHPAoghrMnDodzSZU7hc
```

Optional (add manually if needed):
```bash
ANTHROPIC_API_KEY=your_key_here
OPENAI_API_KEY=your_key_here
DEEPSEEK_API_KEY=your_key_here
GOOGLE_API_KEY=your_key_here
MISTRAL_API_KEY=your_key_here
```

## 🔒 Security Checklist

- ✅ API keys are securely generated (32-byte URL-safe tokens)
- ✅ HTTPS enabled automatically by PythonAnywhere
- ✅ Debug mode disabled in production
- ✅ Environment variables isolated per web app
- ⚠️ Remember to add LLM API keys if using AI features
- ⚠️ Consider rotating API keys if repo becomes public

## 📚 Full Documentation

For complete details, see:
- **DEPLOYMENT_COMPLETE.md** - Comprehensive deployment guide
- **PYTHONANYWHERE_COMPLETE_DEPLOYMENT.md** - Original deployment instructions
- **PYTHONANYWHERE_SETUP_COMPLETE.md** - Quick reference

## ⏱️ Estimated Time

- **Script upload**: 1 minute
- **Script execution**: 5-8 minutes (depends on network)
- **Web configuration**: 2-3 minutes
- **Total**: ~10 minutes

---

**Generated:** 2025-11-20
**Branch:** deploy-clean
**Status:** ✅ Ready to deploy
