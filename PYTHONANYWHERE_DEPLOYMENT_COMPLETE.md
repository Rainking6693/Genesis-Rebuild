# ✅ PythonAnywhere Deployment - COMPLETE SETUP

**API Token:** `d96e5e35ee2070fd3d41f83ddb856859a7f4ea7d`  
**Status:** All files ready - Manual deployment required

## 📦 Deployment Package Ready

All necessary files have been created and are ready for deployment:

### ✅ Files Created

1. **`PYTHONANYWHERE_COMPLETE_DEPLOYMENT.md`** (5.1K)
   - Complete step-by-step deployment guide
   - Troubleshooting section
   - Verification checklist

2. **`wsgi_pythonanywhere.py`** (2.0K)
   - WSGI configuration file
   - Ready to copy to PythonAnywhere
   - Includes fallback options

3. **`scripts/setup_pythonanywhere.sh`** (4.3K)
   - Automated setup script
   - Creates venv, installs dependencies
   - Generates secure API keys
   - Creates .env file

4. **`DEPLOYMENT_READY.md`** (Quick reference)
   - 5-step quick start guide
   - Essential information only

5. **`PYTHONANYWHERE_SETUP_COMPLETE.md`** (2.6K)
   - Quick start instructions
   - Access URLs
   - Verification steps

## 🚀 Deployment Steps

### Step 1: Upload Code to PythonAnywhere

**In PythonAnywhere Bash Console:**
```bash
cd ~
git clone https://github.com/Rainking6693/Genesis-Rebuild.git genesis-rebuild
cd genesis-rebuild
```

### Step 2: Run Setup Script

```bash
bash scripts/setup_pythonanywhere.sh
```

This will:
- ✅ Create Python 3.12 virtual environment
- ✅ Install all dependencies
- ✅ Generate secure API keys
- ✅ Create .env file
- ✅ Create WSGI file

### Step 3: Create Web App

1. Go to **Web** tab in PythonAnywhere
2. Click **"Add a new web app"**
3. Domain: `yourusername.pythonanywhere.com`
4. Python: **3.12**
5. Configuration: **Manual configuration**
6. Click **Next** → **Finish**

### Step 4: Configure Web App Settings

In **Web** tab, set:
- **Source code directory**: `/home/yourusername/genesis-rebuild`
- **Working directory**: `/home/yourusername/genesis-rebuild`
- **Virtualenv**: `/home/yourusername/genesis-rebuild/venv`

### Step 5: Configure WSGI File

1. Click **"WSGI configuration file"** link
2. **Delete all content**
3. Open `wsgi_pythonanywhere.py` from your project
4. Copy entire contents
5. **⚠️ IMPORTANT:** Replace `yourusername` with your actual PythonAnywhere username!
6. Paste into WSGI file
7. Save

### Step 6: Set Environment Variables

In **Web** tab → **Environment variables**, add:

```
GENESIS_ENV=production
ENVIRONMENT=production
A2A_API_KEY=(get from .env file after running setup script)
GENESIS_API_KEY=(get from .env file after running setup script)
DEBUG=false
PYTHONPATH=/home/yourusername/genesis-rebuild
```

To get API keys:
```bash
cd ~/genesis-rebuild
cat .env | grep API_KEY
```

### Step 7: Reload Web App

1. Click **"Reload"** button
2. Wait for green checkmark
3. Check **Error log** for any issues

## 📊 Dashboard Access

Once deployed, your dashboard will be available at:

- **Health Check**: `https://yourusername.pythonanywhere.com/api/health`
- **Agent Status**: `https://yourusername.pythonanywhere.com/api/agents`
- **HALO Routes**: `https://yourusername.pythonanywhere.com/api/halo/routes`
- **CaseBank Memory**: `https://yourusername.pythonanywhere.com/api/casebank`
- **OTEL Traces**: `https://yourusername.pythonanywhere.com/api/traces`
- **Approvals**: `https://yourusername.pythonanywhere.com/api/approvals`
- **Revenue Metrics**: `https://yourusername.pythonanywhere.com/api/revenue/metrics`
- **Revenue Analytics**: `https://yourusername.pythonanywhere.com/api/revenue/analytics`

## ✅ Verification

Test your deployment:
```bash
curl https://yourusername.pythonanywhere.com/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2024-12-20T...",
  "version": "1.0.0",
  "agents_active": 0,
  "tasks_queued": 0
}
```

## 🔍 What the Dashboard Shows

The Genesis Dashboard provides real-time monitoring of:

1. **System Health** - Overall system status
2. **Agent Status** - All 15+ Genesis agents with metrics
3. **HALO Routes** - Routing decisions and explainability
4. **CaseBank Memory** - Memory entries and success rates
5. **OTEL Traces** - Distributed tracing for performance
6. **Human Approvals** - Pending high-risk operations
7. **Revenue Metrics** - Business generation metrics
8. **Revenue Analytics** - ROI, churn, forecasts

## 🆘 Troubleshooting

### Common Issues

1. **500 Error**
   - Check Error log in Web tab
   - Verify WSGI file has correct username
   - Ensure all dependencies installed

2. **Import Errors**
   - Check virtualenv is set correctly
   - Verify PYTHONPATH environment variable
   - Run: `source venv/bin/activate && python -c "import fastapi"`

3. **Module Not Found**
   - Re-run setup script
   - Check requirements are installed
   - Verify sys.path in WSGI file

## 📝 Next Steps

1. ✅ Upload code (Step 1)
2. ✅ Run setup script (Step 2)
3. ✅ Create web app (Step 3)
4. ✅ Configure WSGI (Step 5)
5. ✅ Set environment variables (Step 6)
6. ✅ Reload and test (Step 7)

## 🎯 Summary

**Status:** ✅ All deployment files ready  
**Action Required:** Manual deployment via PythonAnywhere web interface  
**Time Estimate:** 10-15 minutes  
**Difficulty:** Easy (follow step-by-step guide)

---

**Ready to deploy!** Follow `PYTHONANYWHERE_COMPLETE_DEPLOYMENT.md` for detailed instructions.


