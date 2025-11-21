# 🎯 How To Access Your Genesis Deployment

## 🌐 Your Live URLs

**Base URL:** https://rainking632.pythonanywhere.com

---

## 📋 Available Endpoints

### 1. **Homepage / Health Check**
```
https://rainking632.pythonanywhere.com/
```
**What it shows:** Basic status and welcome message

**How to view:**
- Open in browser: https://rainking632.pythonanywhere.com/
- Or via command line: `curl https://rainking632.pythonanywhere.com/`

**Response:**
```json
{
  "status": "healthy",
  "service": "genesis-rebuild",
  "version": "1.0.0",
  "message": "Genesis deployed successfully!"
}
```

---

### 2. **API Health Check**
```
https://rainking632.pythonanywhere.com/api/health
```
**What it shows:** Detailed health status

**How to view:**
- Browser: https://rainking632.pythonanywhere.com/api/health
- Command line: `curl https://rainking632.pythonanywhere.com/api/health`

**Response:**
```json
{
  "status": "healthy",
  "service": "genesis-rebuild",
  "version": "1.0.0",
  "message": "Genesis deployed successfully!"
}
```

---

### 3. **List All Agents** ⭐ MOST USEFUL
```
https://rainking632.pythonanywhere.com/api/agents
```
**What it shows:** Complete list of all 50+ deployed agents

**How to view:**
- Browser: https://rainking632.pythonanywhere.com/api/agents
- Command line: `curl https://rainking632.pythonanywhere.com/api/agents`
- Or formatted: `curl https://rainking632.pythonanywhere.com/api/agents | python3 -m json.tool`

**Response:**
```json
{
  "agents": [
    "reflection_agent",
    "llm_judge_rl_agent",
    "email_marketing_agent",
    "legal_agent",
    "domain_agent",
    "seo_agent",
    "builder_agent",
    "email_agent",
    "pricing_agent",
    "support_agent",
    "finance_agent",
    "frontend_agent",
    "qa_agent",
    "marketing_agent",
    "content_agent",
    "deploy_agent",
    "research_discovery_agent",
    "billing_agent",
    "analyst_agent",
    "analytics_agent",
    "security_agent",
    "business_generation_agent",
    "stripe_integration_agent",
    "... and 30+ more"
  ],
  "count": 50
}
```

---

### 4. **Deployment Status**
```
https://rainking632.pythonanywhere.com/api/status
```
**What it shows:** Current deployment information

**How to view:**
- Browser: https://rainking632.pythonanywhere.com/api/status
- Command line: `curl https://rainking632.pythonanywhere.com/api/status`

**Response:**
```json
{
  "deployment": "active",
  "username": "rainking632",
  "python": "3.12"
}
```

---

## 🖥️ Viewing in Your Browser

### Simple Method:
1. Open any browser (Chrome, Firefox, Safari, Edge)
2. Go to any of these URLs:
   - https://rainking632.pythonanywhere.com/api/health
   - https://rainking632.pythonanywhere.com/api/agents
   - https://rainking632.pythonanywhere.com/api/status

The JSON will display directly in your browser.

### Better Viewing (with JSON formatter):

**Option A: Browser Extension**
- Chrome: Install "JSON Formatter" extension
- Firefox: Built-in JSON viewer (just open the URL)

**Option B: Online JSON Viewer**
1. Copy the URL: `https://rainking632.pythonanywhere.com/api/agents`
2. Go to: https://jsonviewer.stack.hu/
3. Click "Fetch URL" and paste your URL

---

## 💻 Viewing via Command Line

### Basic curl:
```bash
curl https://rainking632.pythonanywhere.com/api/agents
```

### Formatted JSON (easier to read):
```bash
curl https://rainking632.pythonanywhere.com/api/agents | python3 -m json.tool
```

### Save to file:
```bash
curl https://rainking632.pythonanywhere.com/api/agents > agents_list.json
```

### View specific fields (using jq):
```bash
# Count agents
curl https://rainking632.pythonanywhere.com/api/agents | jq '.count'

# List just agent names
curl https://rainking632.pythonanywhere.com/api/agents | jq '.agents[]'
```

---

## 🔍 What Each Agent Does

Your deployment includes these agent types:

### **Business & Operations:**
- `business_generation_agent` - Creates new business ideas
- `finance_agent` - Financial management
- `billing_agent` - Billing and invoicing
- `pricing_agent` - Pricing strategies

### **Development:**
- `builder_agent` - Code generation
- `frontend_agent` - Frontend development
- `backend_agent` - Backend development
- `api_design_agent` - API design
- `database_design_agent` - Database architecture

### **Quality & Testing:**
- `qa_agent` - Quality assurance
- `code_review_agent` - Code reviews
- `security_agent` - Security audits

### **Marketing & Content:**
- `marketing_agent` - Marketing campaigns
- `seo_agent` - SEO optimization
- `content_agent` - Content creation
- `email_marketing_agent` - Email campaigns

### **Customer Support:**
- `support_agent` - Customer support
- `onboarding_agent` - User onboarding

### **Deployment & Operations:**
- `deploy_agent` - Application deployment
- `monitoring_agent` - System monitoring
- `maintenance_agent` - Maintenance tasks

### **Research & Analysis:**
- `research_discovery_agent` - Research
- `analyst_agent` - Data analysis
- `analytics_agent` - Analytics

### **Integration:**
- `stripe_integration_agent` - Stripe payments
- `auth0_integration_agent` - Authentication
- `domain_agent` - Domain management

---

## 📊 Accessing PythonAnywhere Dashboard

To manage your deployment:

1. **Go to:** https://www.pythonanywhere.com
2. **Log in** with:
   - Username: `rainking632`
   - Password: (your password)

3. **Navigate to tabs:**
   - **Web** tab: See your webapp configuration
   - **Files** tab: Browse deployed files
   - **Consoles** tab: Open Python/Bash consoles
   - **Tasks** tab: See scheduled tasks

---

## 🛠️ Files on PythonAnywhere

Your files are located at:
```
/home/rainking632/genesis-rebuild/
  ├── agents/           (50+ agent files)
  ├── infrastructure/   (infrastructure modules)
  ├── venv/            (Python virtualenv)
  ├── .env             (environment config)
  └── tests/           (test files)
```

**To browse files:**
1. Go to PythonAnywhere
2. Click "Files" tab
3. Navigate to `/home/rainking632/genesis-rebuild/`

---

## 🧪 Testing Your Deployment

### Quick Test Script:
```bash
#!/bin/bash
echo "Testing Genesis API..."
echo ""
echo "1. Health Check:"
curl -s https://rainking632.pythonanywhere.com/api/health | python3 -m json.tool
echo ""
echo "2. Agent Count:"
curl -s https://rainking632.pythonanywhere.com/api/agents | python3 -m json.tool | grep count
echo ""
echo "3. Status:"
curl -s https://rainking632.pythonanywhere.com/api/status | python3 -m json.tool
```

Save as `test_genesis.sh`, run with: `bash test_genesis.sh`

---

## 📱 Using the API from Other Applications

### Python:
```python
import requests

# Get all agents
response = requests.get('https://rainking632.pythonanywhere.com/api/agents')
agents = response.json()
print(f"Total agents: {agents['count']}")
print("Agent list:", agents['agents'])
```

### JavaScript:
```javascript
// Fetch agents
fetch('https://rainking632.pythonanywhere.com/api/agents')
  .then(response => response.json())
  .then(data => {
    console.log(`Total agents: ${data.count}`);
    console.log('Agents:', data.agents);
  });
```

### cURL in other scripts:
```bash
AGENTS=$(curl -s https://rainking632.pythonanywhere.com/api/agents)
echo $AGENTS
```

---

## 🔐 Security Note

Currently, the API is **public** (no authentication required). If you want to add authentication:

1. Edit the WSGI file in PythonAnywhere
2. Add API key checking
3. Or configure password protection in Web tab

---

## ⚙️ Next Steps

### To add more endpoints:
1. Go to PythonAnywhere → Files
2. Edit `/var/www/rainking632_pythonanywhere_com_wsgi.py`
3. Add new routes following the existing pattern
4. Reload webapp in Web tab

### To update agents:
1. Go to Files → `/home/rainking632/genesis-rebuild/agents/`
2. Edit agent files
3. Reload webapp

---

## 🆘 Troubleshooting

### API not responding:
```bash
# Check if site is up
curl -I https://rainking632.pythonanywhere.com/api/health

# Should see: HTTP/2 200
```

### Want to see error logs:
1. Go to PythonAnywhere → Web tab
2. Click "Error log" link
3. View recent errors

### Need to reload:
1. Go to Web tab
2. Click green "Reload rainking632.pythonanywhere.com" button

---

## 📞 Quick Reference

| What you want to see | URL |
|----------------------|-----|
| Is it working? | https://rainking632.pythonanywhere.com/api/health |
| List all agents | https://rainking632.pythonanywhere.com/api/agents |
| Deployment info | https://rainking632.pythonanywhere.com/api/status |
| Manage deployment | https://www.pythonanywhere.com (Web tab) |
| View files | https://www.pythonanywhere.com (Files tab) |

---

**Your Genesis deployment is live and accessible!** 🚀
