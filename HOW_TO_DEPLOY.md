# 🚀 HOW TO DEPLOY GENESIS TO PYTHONANYWHERE

## ✅ I've Done Everything I Can - Here's What YOU Need To Do

Since I cannot directly access your PythonAnywhere account (API authentication failed), I've created a **complete one-command deployment script** that you can run yourself.

---

## 📋 SUPER SIMPLE 2-STEP PROCESS

### **STEP 1: Run Deployment Script in PythonAnywhere Bash Console**

1. **Log into PythonAnywhere**: https://www.pythonanywhere.com

2. **Open a Bash Console**:
   - Click "Consoles" in the top menu
   - Click "Bash" to open a new console

3. **Copy and paste this ONE command**:

```bash
curl -sSL https://raw.githubusercontent.com/Rainking6693/Genesis-Rebuild/deploy-clean/COPY_PASTE_DEPLOYMENT.sh | bash
```

**OR** if that doesn't work, manually copy the script:

```bash
# Download the script
cd ~
wget https://raw.githubusercontent.com/Rainking6693/Genesis-Rebuild/deploy-clean/COPY_PASTE_DEPLOYMENT.sh

# Make it executable
chmod +x COPY_PASTE_DEPLOYMENT.sh

# Run it
./COPY_PASTE_DEPLOYMENT.sh
```

**OR** if GitHub isn't accessible, I can show you the script content to copy-paste directly.

This script will:
- ✅ Clone deploy-clean branch from GitHub
- ✅ Create Python 3.12 virtual environment
- ✅ Install all dependencies
- ✅ Create .env file with API keys
- ✅ Generate WSGI configuration file

**Time: 3-5 minutes**

---

### **STEP 2: Configure Web App (Click, Copy, Paste)**

After the script finishes, it will show you instructions. Here's what to do:

1. **Go to Web Tab**: https://www.pythonanywhere.com/user/rainking6693/webapps/

2. **If you don't have a web app:**
   - Click **"Add a new web app"**
   - Choose **rainking6693.pythonanywhere.com**
   - Select **Python 3.12**
   - Choose **"Manual configuration"**

3. **Configure Settings** (in Web tab):
   - **Source code**: `/home/rainking6693/genesis-rebuild`
   - **Working directory**: `/home/rainking6693/genesis-rebuild`
   - **Virtualenv**: `/home/rainking6693/genesis-rebuild/venv`

4. **Update WSGI File**:
   - Click **"WSGI configuration file"** link (near the top)
   - **DELETE all existing content**
   - In the Bash console, run: `cat ~/wsgi_file_for_pythonanywhere.py`
   - **Copy the entire output**
   - **Paste it** into the WSGI configuration file
   - **Save**

5. **Reload**:
   - Click the green **"Reload rainking6693.pythonanywhere.com"** button

**Time: 2-3 minutes**

---

## ✅ Test Your Deployment

In the Bash console or your local terminal, run:

```bash
curl https://rainking6693.pythonanywhere.com/api/health
```

**Expected Response:**
```json
{
  "status": "healthy",
  "service": "genesis-rebuild",
  "version": "1.0.0",
  "branch": "deploy-clean"
}
```

---

## 🔗 Your Endpoints

After successful deployment:

| Endpoint | URL |
|----------|-----|
| **Health Check** | https://rainking6693.pythonanywhere.com/api/health |
| **Agents List** | https://rainking6693.pythonanywhere.com/api/agents |
| **Dashboard** | https://rainking6693.pythonanywhere.com/ |
| **HALO Routes** | https://rainking6693.pythonanywhere.com/api/halo/routes |
| **CaseBank** | https://rainking6693.pythonanywhere.com/api/casebank |
| **A2A Service** | https://rainking6693.pythonanywhere.com/a2a/ |

---

## 🆘 Troubleshooting

### Script Fails with "command not found"
- Make sure you're in a PythonAnywhere **Bash console** (not local terminal)
- Try the manual download method with `wget`

### Import Errors After Reload
- Check Error log in Web tab
- Verify virtualenv path is correct: `/home/rainking6693/genesis-rebuild/venv`
- Ensure WSGI file was completely replaced (not appended)

### 500 Internal Server Error
- Check Error log in Web tab for details
- Verify username in WSGI file matches your actual username
- Try running in Bash: `cd ~/genesis-rebuild && source venv/bin/activate && python -c "import fastapi; print('OK')"`

### "Authentication required" or Login Errors
- Your Genesis API keys are already configured in .env
- For LLM API access (OpenAI, Anthropic, etc.), add keys to .env file:
  ```bash
  cd ~/genesis-rebuild
  nano .env  # Add your API keys
  ```

---

## 📁 What Gets Deployed

From the **deploy-clean** branch:
- ✅ All 25 Genesis agents
- ✅ 110+ infrastructure integrations
- ✅ Dashboard backend (FastAPI)
- ✅ A2A service
- ✅ OmniDaemon runtime
- ✅ VOIX integration
- ✅ AgentEvolver & DeepEyes
- ✅ Payment systems
- ✅ Security & monitoring

---

## 🔑 Pre-Configured API Keys

These are already set in your .env file:

```
A2A_API_KEY=fDTBq7cJX_jt3UggjCe9D2mu5hTWGDuYdWr8AEF9Wss
GENESIS_API_KEY=Rc2bxEoGBR0ZRaFBGmyK8x0RHPAoghrMnDodzSZU7hc
```

---

## ⏱️ Total Time: ~10 Minutes

- Script execution: 3-5 minutes
- Web configuration: 2-3 minutes
- Testing: 1 minute

---

## 📞 If You Still Need Help

If the script doesn't work or you get stuck:

1. **Check the error message** - the script shows detailed output
2. **Look at Error log** in Web tab - shows Python errors
3. **Verify your username** - the script auto-detects it, but ensure it's "rainking6693"
4. **Try manual steps** - see DEPLOYMENT_COMPLETE.md for full manual process

---

## 🎯 Quick Summary

1. Open PythonAnywhere Bash console
2. Run the deployment script (one command)
3. Go to Web tab
4. Update WSGI file (copy-paste)
5. Click Reload
6. Test /api/health endpoint
7. Done! ✅

**That's it! The script does all the heavy lifting.**

---

**Status**: ✅ Script ready to run
**Your Action**: Log into PythonAnywhere and run the script
**My Limitation**: I cannot log into your account or click buttons for you
**Solution**: Simple copy-paste deployment script that does everything
