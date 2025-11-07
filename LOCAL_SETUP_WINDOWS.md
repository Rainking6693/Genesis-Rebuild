# Running Genesis-Rebuild Locally on Windows

## Prerequisites

### 1. Install Python 3.10+
Download from: https://www.python.org/downloads/
- During installation, CHECK "Add Python to PATH"
- Verify installation:
```powershell
python --version  # Should show 3.10 or higher
```

### 2. Install Git (if not already installed)
Download from: https://git-scm.com/download/win

### 3. Install MongoDB (Optional - for MemoryOS)
**Option A: MongoDB Community Edition (Local)**
- Download: https://www.mongodb.com/try/download/community
- Install with default settings
- MongoDB runs on `mongodb://localhost:27017`

**Option B: MongoDB Atlas (Cloud Free Tier)**
- Sign up: https://www.mongodb.com/cloud/atlas/register
- Create free cluster
- Get connection string

**Option C: Skip MongoDB**
- Genesis will run without it (some memory features disabled)

### 4. Get API Keys
You'll need at least ONE of these:
- **Anthropic Claude**: https://console.anthropic.com/ (Recommended)
- **OpenAI GPT**: https://platform.openai.com/api-keys
- **Google Vertex AI**: https://console.cloud.google.com/

## Installation Steps

### Step 1: Navigate to Your Project
```powershell
cd "C:\Users\Ben\OneDrive\Documents\GitHub\Genesis clean Deploy"
```

### Step 2: Create Virtual Environment
```powershell
# Create virtual environment
python -m venv venv

# Activate it
.\venv\Scripts\Activate.ps1

# If you get execution policy error, run:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
# Then try activating again
```

### Step 3: Install Dependencies
```powershell
# Upgrade pip first
python -m pip install --upgrade pip

# Install requirements
pip install -r requirements.txt

# If specific packages fail, install core ones:
pip install anthropic openai google-cloud-aiplatform
pip install pydantic pydantic-settings
pip install aiohttp requests
pip install python-dotenv
pip install pymongo  # If using MongoDB
```

### Step 4: Configure Environment Variables

Create a `.env` file in the project root:
```powershell
# Create .env file
New-Item -Path .env -ItemType File -Force

# Open in notepad
notepad .env
```

Add this content to `.env`:
```bash
# API Keys (add at least one)
ANTHROPIC_API_KEY=sk-ant-your-key-here
OPENAI_API_KEY=sk-your-key-here
# GEMINI_API_KEY=your-key-here  # Optional

# MongoDB (optional - comment out if not using)
# MONGODB_URI=mongodb://localhost:27017/

# Feature Flags
FEATURE_FLAGS_CONFIG=config/feature_flags.json

# Cloud Mode (disable local LLM)
FORCE_CLOUD_LLM=true

# Logging
LOG_LEVEL=INFO
```

### Step 5: Run Genesis!

**Option A: Run Full Autonomous System**
```powershell
python scripts/autonomous_fully_integrated.py
```

**Option B: Run Individual Agents (Testing)**
```powershell
# Test business idea generation
python -c "import asyncio; from infrastructure.business_idea_generator import BusinessIdeaGenerator; asyncio.run(BusinessIdeaGenerator().generate_idea())"

# Test builder agent
python scripts/test_builder_agent.py  # If this script exists
```

**Option C: Interactive Python REPL**
```powershell
python
```
Then in Python:
```python
import asyncio
from infrastructure.business_idea_generator import BusinessIdeaGenerator

# Generate a business idea
async def test():
    gen = BusinessIdeaGenerator()
    idea = await gen.generate_idea(min_revenue_score=60.0)
    print(f"Generated: {idea.name}")
    print(f"Score: {idea.overall_score}")
    return idea

# Run it
idea = asyncio.run(test())
```

## Common Issues & Fixes

### Issue 1: "python not recognized"
**Fix**: Add Python to PATH manually
1. Search "Environment Variables" in Windows
2. Edit "Path" variable
3. Add: `C:\Users\Ben\AppData\Local\Programs\Python\Python310`

### Issue 2: "pip install fails with SSL error"
**Fix**:
```powershell
pip install --trusted-host pypi.org --trusted-host files.pythonhosted.org <package>
```

### Issue 3: "ModuleNotFoundError: No module named X"
**Fix**: Make sure virtual environment is activated
```powershell
# Check if (venv) appears in your prompt
# If not, activate:
.\venv\Scripts\Activate.ps1
```

### Issue 4: "API key not found"
**Fix**: Make sure `.env` file is in the project root
```powershell
# Check if .env exists
Test-Path .env

# Show contents (without revealing keys)
Get-Content .env
```

### Issue 5: MongoDB Connection Failed
**Fix**: Either install MongoDB locally OR use MongoDB Atlas (cloud)
- Comment out `MONGODB_URI` in `.env` to disable MongoDB features

### Issue 6: "Playwright not installed"
**Fix**: Install Playwright browsers
```powershell
python -m playwright install
```

## Performance Tips

### Windows Defender Exclusion (Speeds up Python)
1. Open Windows Security
2. Virus & threat protection → Manage settings
3. Add exclusion → Folder
4. Add: `C:\Users\Ben\OneDrive\Documents\GitHub\Genesis clean Deploy\venv`

### Use Windows Terminal (Better than PowerShell)
Download from Microsoft Store: "Windows Terminal"
- Better colors, tabs, Unicode support

## Testing Your Setup

Run this quick test script:
```powershell
# Save as test_setup.py
python -c "
import sys
print(f'Python: {sys.version}')

try:
    import anthropic
    print('✅ Anthropic installed')
except:
    print('❌ Anthropic missing')

try:
    import openai
    print('✅ OpenAI installed')
except:
    print('❌ OpenAI missing')

try:
    from dotenv import load_dotenv
    load_dotenv()
    import os
    if os.getenv('ANTHROPIC_API_KEY'):
        print('✅ ANTHROPIC_API_KEY found')
    else:
        print('❌ ANTHROPIC_API_KEY not set')
except Exception as e:
    print(f'❌ Error loading .env: {e}')
"
```

## What to Expect

When you run Genesis locally:
- ✅ All agents run with cloud APIs (no local LLM needed)
- ✅ Generated businesses saved to local filesystem
- ✅ Logs appear in console
- ✅ Much faster than Railway (your local machine is powerful!)
- ❌ No GPU needed (we disabled local LLM)
- ⚠️ API costs apply (Anthropic charges per token)

## Cost Estimation (Local Development)

**Running locally with cloud APIs:**
- Anthropic Claude Sonnet: ~$3 per 1M tokens
- Typical test run: 50K-200K tokens
- **Cost per test**: $0.15 - $0.60

**Much cheaper than Railway deployment fees!**

## Next Steps

After successful local run:
1. Review generated businesses in output directory
2. Check logs for any errors
3. Tweak `.env` settings as needed
4. When ready, deploy to DigitalOcean for 24/7 operation

## Getting Help

If you run into issues:
1. Check the error message carefully
2. Verify `.env` file has correct API keys
3. Make sure virtual environment is activated
4. Check Python version: `python --version`

Happy coding! 🚀
