# Environment Variables Guide - Local vs Production

## 🎯 Quick Answer: What to Keep for Local Windows Development

**KEEP these (Essential):**
```bash
# AI APIs (at least one required)
ANTHROPIC_API_KEY=your_key
OPENAI_API_KEY=your_key
GEMINI_API_KEY=your_key

# Core settings
FORCE_CLOUD_LLM=true
LOG_LEVEL=INFO
FEATURE_FLAGS_CONFIG=config/feature_flags.json

# Database (optional)
MONGODB_URI=mongodb://localhost:27017/
```

**REMOVE these (Production-only):**
```bash
# ❌ Stripe live keys
# ❌ Monitoring passwords (Grafana, Prometheus)
# ❌ Deployment tokens (Vercel, GitHub)
# ❌ Marketing tools (Mixpanel, Mailgun, Twitter)
# ❌ Sentry production DSN
# ❌ Production service credentials
```

---

## 📊 Full Breakdown: Keep vs Remove

### ✅ KEEP for Local Development

| Variable | Why? |
|----------|------|
| `ANTHROPIC_API_KEY` | **REQUIRED** - Primary AI model |
| `OPENAI_API_KEY` | Recommended - Fallback model |
| `GEMINI_API_KEY` | Optional - Alternative model |
| `DEEPSEEK_API_KEY` | Optional - Cheap alternative |
| `MISTRAL_API_KEY` | Optional - Alternative model |
| `FORCE_CLOUD_LLM=true` | **REQUIRED** - Disables local LLM (no GPU needed) |
| `LOG_LEVEL=INFO` | Helpful for debugging |
| `MONGODB_URI=mongodb://localhost:27017/` | Optional - Only if using MongoDB locally |
| `FEATURE_FLAGS_CONFIG=config/feature_flags.json` | **REQUIRED** - System configuration |
| `DAAO_ENABLED=true` | Enables cost optimization |
| `ORCHESTRATION_ENABLED=true` | Core feature |

### ❌ REMOVE for Local Development

#### 🔒 Security Risk (Production Credentials)
| Variable | Why Remove? |
|----------|-------------|
| `STRIPE_SECRET_KEY=sk_live_...` | **DANGER** - Live payment processing key! Never expose locally |
| `STRIPE_PUBLISHABLE_KEY=pk_live_...` | **DANGER** - Live Stripe public key |
| `GRAFANA_ADMIN_PASSWORD` | Production monitoring password - security risk |
| `PROMETHEUS_PASSWORD` | Production monitoring password |
| `ALERTMANAGER_PASSWORD` | Production monitoring password |
| `A2A_API_KEY` | Production authentication token |

#### 📡 Not Needed Locally
| Variable | Why Remove? |
|----------|-------------|
| `VERCEL_TOKEN` | Only needed for Vercel deployments |
| `VERCEL_TEAM_ID` | Only needed for Vercel deployments |
| `GITHUB_TOKEN` | Only needed for automated GitHub operations |
| `MIXPANEL_TOKEN` | Analytics - not needed for local dev |
| `SENTRY_DSN` | Error tracking - not needed for local dev |
| `MAILGUN_API_KEY` | Email sending - not needed for local dev |
| `TWITTER_BEARER_TOKEN` | Social media - not needed for local dev |
| `OTEL_EXPORTER_OTLP_ENDPOINT` | Observability - adds overhead locally |
| `METRICS_PORT=9090` | Monitoring - not needed locally |
| `HEALTH_CHECK_ENABLED` | Production health checks - not needed |

#### 🔬 Advanced/Production Features
| Variable | Why Remove? |
|----------|-------------|
| `ENABLE_VERTEX_AI=true` | Requires Google Cloud setup (complex for local) |
| `GOOGLE_APPLICATION_CREDENTIALS` | Vertex AI service account - complex setup |
| `GENESIS_QA_MODEL=projects/...` | Vertex AI fine-tuned models - production only |
| `GENESIS_SUPPORT_MODEL=projects/...` | Vertex AI fine-tuned models - production only |
| `AZURE_AI_PROJECT_ENDPOINT` | Azure AI - production only |
| `ENABLE_WALTZRL=true` | Safety benchmarks - adds complexity |
| `ENABLE_FP16_TRAINING=true` | GPU training - not applicable on Windows CPU |
| `ENABLE_MULTI_AGENT_EVOLVE=true` | Advanced co-evolution - adds complexity |
| `PIPELEX_INFERENCE_API_KEY` | Production inference service |

### ⚠️ MODIFY for Local Development

| Variable | Production Value | Local Value | Why? |
|----------|------------------|-------------|------|
| `GENESIS_ENV` | `production` | `development` | Indicates dev mode |
| `ENVIRONMENT` | `production` | `development` | Same as above |
| `DEBUG` | `false` | `false` or `true` | Enable verbose logging if needed |
| `LOG_SENSITIVE_DATA` | `false` | `false` | **Keep false** - security |
| `DEV_MODE` | `false` | `true` | Enables dev features |
| `OTEL_ENABLED` | `true` | `false` | Disable telemetry overhead |
| `METRICS_ENABLED` | `true` | `false` | Disable metrics overhead |
| `HEALTH_CHECK_ENABLED` | `true` | `false` | Not needed locally |
| `ENABLE_WALTZRL` | `true` | `false` | Simplify local setup |
| `ENABLE_VERTEX_AI` | `true` | `false` | Requires Cloud setup |

---

## 🚀 Recommended .env for Local Windows Development

Create a file named `.env` in your project root with this content:

```bash
# ============================================
# LOCAL DEVELOPMENT - MINIMAL CONFIGURATION
# ============================================

# Environment
GENESIS_ENV=development
DEBUG=false
LOG_LEVEL=INFO

# AI Keys (REQUIRED - use your actual keys)
ANTHROPIC_API_KEY=sk-ant-your-key-here
OPENAI_API_KEY=sk-your-key-here
GEMINI_API_KEY=your-key-here

# Core Features
FORCE_CLOUD_LLM=true
FEATURE_FLAGS_CONFIG=config/feature_flags.json
DAAO_ENABLED=true

# Database (Optional - comment out if not using)
# MONGODB_URI=mongodb://localhost:27017/

# Disable Production Features
ENABLE_VERTEX_AI=false
ENABLE_WALTZRL=false
OTEL_ENABLED=false
METRICS_ENABLED=false
```

---

## 💡 Best Practices

### 1. **Never Commit .env Files**
Add to `.gitignore`:
```
.env
.env.local
.env.production
*.env
```

### 2. **Use Different .env Files**
- `.env.local` - Local development (your Windows machine)
- `.env.production` - Production server (VPS/Railway/DigitalOcean)
- `.env.example` - Template with placeholder values (safe to commit)

### 3. **Rotate Production Credentials**
Since you've shared your production .env here, you should **rotate these immediately**:
- ❌ Stripe live keys
- ❌ All passwords (Grafana, Prometheus, Alertmanager)
- ❌ GitHub token
- ❌ Vercel token
- ❌ A2A API key
- ❌ Any API keys shown in plaintext

**These are now exposed and should be regenerated!**

### 4. **Use Test Credentials Locally**
- Use Stripe **test keys** (start with `sk_test_`) instead of live keys locally
- Use development API keys when available
- Never use production database locally

---

## 🔐 Security Checklist

Before running locally:
- [ ] Removed all production Stripe keys from local .env
- [ ] Removed all monitoring passwords
- [ ] Using your own API keys (not shared production keys)
- [ ] Added .env to .gitignore
- [ ] Never commit .env files to GitHub
- [ ] Plan to rotate exposed production credentials

---

## 🎯 Summary

**For local Windows development, you need:**
1. ✅ AI API keys (Anthropic, OpenAI, Gemini)
2. ✅ `FORCE_CLOUD_LLM=true`
3. ✅ Basic feature flags
4. ✅ Optional: MongoDB URI if using database
5. ❌ Nothing else from production .env

**Total lines needed: ~10-15 instead of 150+**

This keeps your local setup:
- ✅ Simple and fast
- ✅ Secure (no production credentials)
- ✅ Easy to understand
- ✅ Safe to share (with API keys redacted)
