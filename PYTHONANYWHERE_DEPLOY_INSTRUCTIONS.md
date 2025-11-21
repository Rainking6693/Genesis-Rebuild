# PythonAnywhere Deployment Instructions

## Step 1: Clone Repository
In PythonAnywhere Bash console:
```bash
cd ~
git clone -b deploy-clean https://github.com/Rainking6693/Genesis-Rebuild.git genesis-rebuild
cd genesis-rebuild
```

## Step 2: Run Setup Script
```bash
bash scripts/setup_pythonanywhere.sh
```

## Step 3: Create Web App
1. Go to **Web** tab in PythonAnywhere
2. Click **"Add a new web app"**
3. Domain: `genesis.pythonanywhere.com`
4. Python: **3.12**
5. Configuration: **Manual configuration**
6. Click **Next** → **Finish**

## Step 4: Configure Web App
In **Web** tab:
- **Source code directory**: `/home/genesis/genesis-rebuild`
- **Working directory**: `/home/genesis/genesis-rebuild`
- **Virtualenv**: `/home/genesis/genesis-rebuild/venv`

## Step 5: Configure WSGI File
1. Click **"WSGI configuration file"** link
2. **Delete all content**
3. Copy contents of `wsgi_deploy.py` (or `wsgi.py` from project root)
4. **⚠️ IMPORTANT:** Replace `yourusername` with `genesis` if present
5. Paste into WSGI file
6. Save

## Step 6: Set Environment Variables
In **Web** tab → **Environment variables**, add:
```
GENESIS_ENV=production
ENVIRONMENT=production
DEBUG=false
PYTHONPATH=/home/genesis/genesis-rebuild
```

To get API keys (if needed):
```bash
cd ~/genesis-rebuild
cat .env | grep API_KEY
```

## Step 7: Reload Web App
1. Click **"Reload"** button
2. Wait for green checkmark
3. Check **Error log** for any issues

## Step 8: Verify Deployment
```bash
curl https://genesis.pythonanywhere.com/api/health
```

Expected response:
```json
{"status": "healthy", "service": "genesis-rebuild"}
```

## Dashboard URLs
- Health: https://genesis.pythonanywhere.com/api/health
- Root: https://genesis.pythonanywhere.com/
- Agents: https://genesis.pythonanywhere.com/api/agents
