# PythonAnywhere Deployment Guide for Genesis Rebuild

**API Token:** `d96e5e35ee2070fd3d41f83ddb856859a7f4ea7d`

## Quick Start

### Step 1: Access PythonAnywhere

1. Go to https://www.pythonanywhere.com
2. Log in with your account
3. Navigate to the **Web** tab

### Step 2: Create New Web App

1. Click **"Add a new web app"**
2. Choose domain: `yourusername.pythonanywhere.com`
3. Select **Python 3.12**
4. Choose **Manual configuration**
5. Click **Next** → **Finish**

### Step 3: Upload Code

**Option A: Using Git (Recommended)**
```bash
# In PythonAnywhere Bash console
cd ~
git clone <your-repo-url> genesis-rebuild
cd genesis-rebuild
```

**Option B: Using Files Tab**
1. Go to **Files** tab
2. Navigate to `/home/yourusername/`
3. Upload project files (or use zip upload)

### Step 4: Set Up Virtual Environment

```bash
cd ~/genesis-rebuild
python3.12 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements_app.txt
pip install -r requirements_infrastructure.txt
pip install -r genesis-dashboard/backend/requirements.txt
pip install fastapi uvicorn[standard] python-dotenv
```

### Step 5: Configure WSGI File

1. Go to **Web** tab
2. Click **WSGI configuration file** link
3. Replace content with:

```python
# Genesis Rebuild WSGI Configuration
import sys
import os

# Add project to path
project_home = '/home/yourusername/genesis-rebuild'
if project_home not in sys.path:
    sys.path.insert(0, project_home)

# Add venv to path
venv_path = '/home/yourusername/genesis-rebuild/venv/lib/python3.12/site-packages'
if venv_path not in sys.path:
    sys.path.insert(0, venv_path)

# Set environment variables
os.environ.setdefault('GENESIS_ENV', 'production')
os.environ.setdefault('ENVIRONMENT', 'production')
os.environ.setdefault('PYTHONPATH', project_home)

# Import application
try:
    # Try dashboard backend first
    from genesis_dashboard.backend.api import app as application
except ImportError:
    try:
        # Fallback to A2A service
        from a2a_service import app as application
    except ImportError:
        # Last resort: simple health check
        from fastapi import FastAPI
        application = FastAPI()
        
        @application.get("/")
        def health():
            return {"status": "ok", "service": "genesis-rebuild"}

if __name__ == "__main__":
    application.run()
```

**Important:** Replace `yourusername` with your actual PythonAnywhere username!

### Step 6: Set Environment Variables

1. Go to **Web** tab
2. Scroll to **Environment variables** section
3. Add these variables:

```
GENESIS_ENV=production
ENVIRONMENT=production
A2A_API_KEY=your-secure-api-key-here
GENESIS_API_KEY=your-secure-api-key-here
DEBUG=false
PYTHONPATH=/home/yourusername/genesis-rebuild
```

### Step 7: Configure Static Files (for Dashboard)

1. Go to **Web** tab
2. Scroll to **Static files** section
3. Add mapping:
   - **URL:** `/static`
   - **Directory:** `/home/yourusername/genesis-rebuild/genesis-dashboard/src`

### Step 8: Reload Web App

1. Click **Reload** button in Web tab
2. Wait for reload to complete
3. Visit your site: `https://yourusername.pythonanywhere.com`

## Dashboard Setup

### Backend API Endpoints

The dashboard backend will be available at:
- Health: `https://yourusername.pythonanywhere.com/api/health`
- Agents: `https://yourusername.pythonanywhere.com/api/agents`
- HALO Routes: `https://yourusername.pythonanywhere.com/api/halo/routes`
- CaseBank: `https://yourusername.pythonanywhere.com/api/casebank`
- Traces: `https://yourusername.pythonanywhere.com/api/traces`
- Approvals: `https://yourusername.pythonanywhere.com/api/approvals`

### Frontend (Optional - Can be deployed separately)

For the Next.js frontend, you have two options:

**Option 1: Deploy to Vercel/Netlify**
- Build the frontend: `cd genesis-dashboard && npm run build`
- Deploy to Vercel or Netlify
- Point API URL to your PythonAnywhere backend

**Option 2: Serve Static Files from PythonAnywhere**
- Build frontend: `cd genesis-dashboard && npm run build`
- Copy `out/` directory to PythonAnywhere
- Configure static file mapping

## Troubleshooting

### Common Issues

1. **Import Errors**
   - Check PYTHONPATH is set correctly
   - Verify virtual environment is activated
   - Check all dependencies are installed

2. **Module Not Found**
   - Ensure project is in sys.path
   - Check venv site-packages is in sys.path
   - Verify all requirements are installed

3. **500 Internal Server Error**
   - Check error logs in Web tab → Error log
   - Verify WSGI file syntax
   - Check environment variables are set

4. **Dashboard Not Loading**
   - Verify backend API is responding
   - Check CORS settings in api.py
   - Verify static files are configured

## Monitoring

### Check Logs

1. Go to **Web** tab
2. Click **Error log** to see application errors
3. Click **Server log** to see server messages

### Health Check

Visit: `https://yourusername.pythonanywhere.com/api/health`

Should return:
```json
{
  "status": "healthy",
  "timestamp": "...",
  "version": "1.0.0"
}
```

## Security Notes

1. **API Keys**: Generate secure random keys for production
2. **CORS**: Configure allowed origins in api.py
3. **HTTPS**: PythonAnywhere provides HTTPS by default
4. **Rate Limiting**: Consider adding rate limiting for production

## Next Steps

1. Set up scheduled tasks (if needed) in **Tasks** tab
2. Configure custom domain (if needed) in **Web** tab
3. Set up database (if needed) in **Databases** tab
4. Monitor usage in **Account** tab

---

**Status:** Ready for deployment
**Last Updated:** December 2024


