---
title: API Keys Quick Reference - Genesis Rebuild
category: Reports
dg-publish: true
publish: true
tags: []
source: API_KEYS_QUICK_REFERENCE.md
exported: '2025-10-24T22:05:26.827367'
---

# API Keys Quick Reference - Genesis Rebuild

This guide shows you all the API keys you'll need for the complete Genesis build and where to get them.

---

## 🚀 Quick Setup (2 minutes)

**Option 1: Interactive Setup (Recommended)**
```bash
./scripts/setup_env.sh
```

**Option 2: Manual Setup**
```bash
cp .env.example .env
# Edit .env and add your API keys
nano .env  # or vim, code, etc.
```

---

## 🔑 Required API Keys (Must Have)

### 1. **Anthropic API Key** ✅ REQUIRED

**What it's for:**
- Code generation (Claude Sonnet 4.5 - 72.7% SWE-bench accuracy)
- Safety evaluation (WaltzRL testing)
- Complex reasoning tasks

**Where to get it:**
1. Go to: https://console.anthropic.com/
2. Sign in or create account
3. Settings → API Keys → Create Key
4. Copy the key (starts with `sk-ant-api03-`)

**Cost:** $3/1M tokens ($15 per million input, $75 per million output)

**Add to .env:**
```bash
ANTHROPIC_API_KEY=sk-ant-api03-YOUR-KEY-HERE
```

---

### 2. **OpenAI API Key** ✅ REQUIRED

**What it's for:**
- Orchestration (GPT-4o)
- Strategic decision making
- Task decomposition (HTDAG)

**Where to get it:**
1. Go to: https://platform.openai.com/
2. Sign in or create account
3. API Keys → Create new secret key
4. Copy the key (starts with `sk-`)

**Cost:** $3/1M tokens ($2.50 per million input, $10 per million output)

**Add to .env:**
```bash
OPENAI_API_KEY=sk-YOUR-KEY-HERE
```

---

## 💡 Recommended API Keys (Cost Optimization)

### 3. **Google Gemini API Key** ⭐ RECOMMENDED

**What it's for:**
- High-throughput cheap tasks (100x cheaper than GPT-4o)
- OCR vision model (Text-as-Pixels compression)
- VideoGen backend (optional)

**Where to get it:**
1. Go to: https://aistudio.google.com/apikey
2. Sign in with Google account
3. Create API key
4. Copy the key

**Cost:** $0.03/1M tokens (cheapest option)

**Add to .env:**
```bash
GEMINI_API_KEY=YOUR-KEY-HERE
```

---

## 🔧 Optional API Keys (Advanced Features)

### 4. **Google Cloud Project ID** (Optional)

**What it's for:**
- VideoGen backend (VISTA multimodal)
- Advanced Vertex AI features

**Where to get it:**
1. Go to: https://console.cloud.google.com/
2. Select or create project
3. Copy Project ID from dashboard

**Add to .env:**
```bash
GOOGLE_CLOUD_PROJECT_ID=your-project-id-here
```

---

### 5. **DeepSeek API Key** (Optional)

**What it's for:**
- Open-source LLM fallback (DeepSeek R1)
- Ultra-low-cost alternative (47x cheaper than GPT-4o)

**Where to get it:**
1. Go to: https://platform.deepseek.com/
2. Sign up
3. API Keys → Create key

**Cost:** $0.14/1M tokens

**Add to .env:**
```bash
DEEPSEEK_API_KEY=your-key-here
```

---

### 6. **Azure OpenAI** (Optional - Alternative to OpenAI)

**What it's for:**
- Enterprise deployments
- Geographic compliance requirements
- Same models as OpenAI (GPT-4o, etc.)

**Where to get it:**
1. Go to: https://portal.azure.com/
2. Create Azure OpenAI resource
3. Keys and Endpoint → Copy key and endpoint

**Add to .env:**
```bash
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_OPENAI_API_KEY=your-azure-key-here
AZURE_OPENAI_DEPLOYMENT=gpt-4o
```

---

## 💾 Database Configuration (Local - No API Keys)

### MongoDB (Layer 6 Memory)
```bash
# Install MongoDB (if not already installed)
sudo apt-get install -y mongodb

# Start MongoDB
sudo systemctl start mongodb

# Add to .env (default works for local)
MONGODB_URI=mongodb://localhost:27017/genesis
```

### Redis (Caching)
```bash
# Install Redis (if not already installed)
sudo apt-get install -y redis-server

# Start Redis
sudo systemctl start redis-server

# Add to .env (default works for local)
REDIS_URL=redis://localhost:6379/0
```

**OR use Docker Compose:**
```bash
docker-compose up -d mongodb redis
```

---

## 📊 Cost Comparison

| Provider | Model | Cost (per 1M tokens) | Use Case |
|----------|-------|---------------------|----------|
| **Google Gemini** | Gemini 2.0 Flash | $0.03 | High-throughput, cheap tasks ⭐ |
| **DeepSeek** | DeepSeek R1 | $0.14 | Open-source fallback |
| **OpenAI** | GPT-4o | $3.00 | Orchestration, strategic decisions |
| **Anthropic** | Claude Sonnet 4.5 | $3.00 | Code generation, reasoning |

**Cost optimization strategy:**
1. Use Gemini Flash for 80% of tasks (simple queries, data processing)
2. Use GPT-4o for orchestration (10% of tasks)
3. Use Claude Sonnet for code generation (10% of tasks)
4. Enable caching to reduce redundant calls

**Expected monthly cost:**
- Dev/Testing: $5-20/month
- Small production (10-50 agents): $50-100/month
- Large production (1000+ agents): $500-1000/month

With Phase 6 optimizations: **93.75% cost reduction** ($500 → $31.25/month)

---

## 🔒 Security Best Practices

### ✅ DO:
- Store keys in `.env` file (already in `.gitignore`)
- Use different keys for dev/staging/prod
- Rotate keys regularly (every 90 days)
- Use environment-specific key restrictions when available
- Add keys to `.bashrc` for persistence:
  ```bash
  echo 'export ANTHROPIC_API_KEY="sk-ant-api03-..."' >> ~/.bashrc
  source ~/.bashrc
  ```

### ❌ DON'T:
- Commit `.env` to git
- Share keys in chat/email
- Use production keys in development
- Hard-code keys in source files
- Store keys in plain text outside `.env`

---

## 🧪 Testing Your Setup

### 1. Check if API keys are loaded:
```bash
python -c "
import os
from dotenv import load_dotenv
load_dotenv()

keys = ['ANTHROPIC_API_KEY', 'OPENAI_API_KEY', 'GEMINI_API_KEY']
for key in keys:
    value = os.getenv(key)
    if value and value != f'your_{key.lower()}_here':
        print(f'✅ {key}: {value[:20]}...')
    else:
        print(f'❌ {key}: Not set')
"
```

### 2. Run WaltzRL safety tests (requires ANTHROPIC_API_KEY):
```bash
./scripts/run_waltzrl_real_llm_tests.sh
```

### 3. Run full test suite:
```bash
pytest tests/ -v
```

---

## 🆘 Troubleshooting

### Problem: "ANTHROPIC_API_KEY not set"

**Solution 1: Set for current session**
```bash
export ANTHROPIC_API_KEY='sk-ant-api03-YOUR-KEY-HERE'
```

**Solution 2: Add to .bashrc (permanent)**
```bash
echo 'export ANTHROPIC_API_KEY="sk-ant-api03-YOUR-KEY-HERE"' >> ~/.bashrc
source ~/.bashrc
```

**Solution 3: Use .env file**
```bash
# Make sure .env exists and has the key
cat .env | grep ANTHROPIC_API_KEY

# If using python-dotenv, load it in your script:
from dotenv import load_dotenv
load_dotenv()
```

---

### Problem: "Invalid API key"

**Check:**
1. Key is correct (no extra spaces, complete key)
2. Key is active (not revoked)
3. Account has credits (for OpenAI)
4. Key has correct permissions

**Regenerate key:**
- Anthropic: https://console.anthropic.com/settings/keys
- OpenAI: https://platform.openai.com/api-keys
- Google: https://aistudio.google.com/apikey

---

### Problem: Scripts can't find .env

**Solution: Load .env explicitly**
```bash
# Python scripts
from dotenv import load_dotenv
load_dotenv()

# Bash scripts
source .env  # or: set -a; source .env; set +a
```

---

## 📚 Additional Resources

**Genesis Documentation:**
- `.env.example` - Full configuration template with all options
- `CLAUDE.md` - Project overview and architecture
- `PROJECT_STATUS.md` - Current phase and progress

**API Documentation:**
- Anthropic: https://docs.anthropic.com/
- OpenAI: https://platform.openai.com/docs/
- Google Gemini: https://ai.google.dev/gemini-api/docs
- DeepSeek: https://platform.deepseek.com/docs

**Cost Calculators:**
- OpenAI: https://platform.openai.com/tokenizer
- Anthropic: https://console.anthropic.com/settings/cost

---

## 🎯 Summary Checklist

- [ ] ANTHROPIC_API_KEY set (required)
- [ ] OPENAI_API_KEY set (required)
- [ ] GEMINI_API_KEY set (recommended for cost optimization)
- [ ] MongoDB running (for Layer 6 features)
- [ ] Redis running (for caching)
- [ ] .env file created from .env.example
- [ ] API keys added to ~/.bashrc (optional, for persistence)
- [ ] Tested with: `./scripts/run_waltzrl_real_llm_tests.sh`

---

**Need help?** Check `WALTZRL_TESTING_INSTRUCTIONS.md` or run `./scripts/setup_env.sh` for interactive setup.
