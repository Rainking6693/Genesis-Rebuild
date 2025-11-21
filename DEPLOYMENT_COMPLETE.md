# PythonAnywhere Deployment Status

## ✅ Automated Setup Complete

**Username:** rainking6693
**Domain:** rainking6693.pythonanywhere.com
**Branch:** deploy-clean
**Deployment Date:** 2025-11-20T21:13:36.250796

## 🔑 Generated API Keys

```
A2A_API_KEY=fDTBq7cJX_jt3Ugg... (saved in deploy_on_pythonanywhere.sh)
GENESIS_API_KEY=Rc2bxEoGBR0ZRaFB... (saved in deploy_on_pythonanywhere.sh)
```

## 📋 Deployment Steps

### Option A: Automated (Recommended)

1. **Log into PythonAnywhere**: https://www.pythonanywhere.com
2. **Open Bash Console** (from Dashboard or Consoles tab)
3. **Run the deployment script**:
   ```bash
   # Copy deploy_on_pythonanywhere.sh to PythonAnywhere (via Files or curl)
   bash deploy_on_pythonanywhere.sh
   ```
4. **Configure WSGI** (Web tab):
   - Click "WSGI configuration file"
   - Replace entire content with wsgi_deploy.py
   - Save
5. **Configure Web App** (Web tab):
   - Source directory: /home/rainking6693/genesis-rebuild
   - Virtualenv: /home/rainking6693/genesis-rebuild/venv
   - Python: 3.12
6. **Reload**: Click "Reload" button

### Option B: Manual Steps

If automated script doesn't work, follow these manual steps:

#### 1. Clone Repository
```bash
cd ~
git clone -b deploy-clean https://github.com/Rainking6693/Genesis-Rebuild.git genesis-rebuild
cd genesis-rebuild
```

#### 2. Create Virtual Environment
```bash
python3.12 -m venv venv
source venv/bin/activate
```

#### 3. Install Dependencies
```bash
pip install --upgrade pip
pip install -r requirements_app.txt
pip install -r requirements_infrastructure.txt
pip install -r genesis-dashboard/backend/requirements.txt
pip install fastapi uvicorn[standard] python-dotenv httpx
```

#### 4. Create .env File
```bash
cat > .env << 'EOF'
GENESIS_ENV=production
ENVIRONMENT=production
DEBUG=false
A2A_API_KEY=fDTBq7cJX_jt3UggjCe9D2mu5hTWGDuYdWr8AEF9Wss
GENESIS_API_KEY=Rc2bxEoGBR0ZRaFBGmyK8x0RHPAoghrMnDodzSZU7hc
PYTHONPATH=/home/rainking6693/genesis-rebuild
EOF
```

#### 5. Create Web App (Web tab)
- Click "Add a new web app"
- Choose rainking6693.pythonanywhere.com
- Select Python 3.12
- Choose "Manual configuration"

#### 6. Configure WSGI (Web tab)
- Click "WSGI configuration file"
- Copy contents from wsgi_deploy.py
- Save

#### 7. Set Directories (Web tab)
- Source directory: /home/rainking6693/genesis-rebuild
- Working directory: /home/rainking6693/genesis-rebuild
- Virtualenv: /home/rainking6693/genesis-rebuild/venv

#### 8. Reload
- Click "Reload" button

## 🔗 Endpoints

After deployment:
- **Health**: https://rainking6693.pythonanywhere.com/api/health
- **Agents**: https://rainking6693.pythonanywhere.com/api/agents
- **Dashboard**: https://rainking6693.pythonanywhere.com/
- **A2A Service**: https://rainking6693.pythonanywhere.com/a2a/

## ✅ Verification

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

## 📁 Files Generated

1. **wsgi_deploy.py** - WSGI configuration for PythonAnywhere
2. **deploy_on_pythonanywhere.sh** - Automated deployment script
3. **DEPLOYMENT_COMPLETE.md** - This instructions file

## 🆘 Troubleshooting

### 500 Internal Server Error
- Check Error log in Web tab
- Verify WSGI file has correct username (rainking6693)
- Ensure virtualenv is created and activated
- Check all dependencies are installed

### Import Errors
- Verify PYTHONPATH in .env and WSGI file
- Check venv is in correct location
- Run: `source ~/genesis-rebuild/venv/bin/activate && python -c "import fastapi"`

### Dashboard Not Loading
- Check backend API: https://rainking6693.pythonanywhere.com/api/health
- Verify CORS settings if frontend deployed separately
- Check error logs for import failures

## 📝 Next Steps

1. ✅ Upload deploy_on_pythonanywhere.sh to PythonAnywhere
2. ✅ Run the deployment script in Bash console
3. ✅ Configure WSGI file (copy wsgi_deploy.py)
4. ✅ Set directories and virtualenv
5. ✅ Reload web app
6. ✅ Test /api/health endpoint
7. 🔄 Deploy frontend (optional - Vercel/Netlify pointing to rainking6693.pythonanywhere.com/api/)

## 🔒 Security Notes

- API keys are securely generated
- Change keys if repository is public
- Configure CORS for production domains
- HTTPS is automatic on PythonAnywhere
- Review error logs regularly

---

**Status:** Ready for PythonAnywhere deployment
**Branch:** deploy-clean
**Generated:** 2025-11-20 21:13:36

