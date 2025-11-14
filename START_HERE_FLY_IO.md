# Genesis VPS Dashboard - Fly.io Quick Start

## 🚀 Deploy in 15 Minutes for $6/Month

After researching 5 platforms (Sevalla, Railway, Render, Vercel, Fly.io), **Fly.io is the clear winner:**

- ✅ **70% cheaper** than Render ($6 vs $21/month)
- ✅ **Global CDN** - 30+ regions
- ✅ **<1s cold starts** (vs 30-60s on Render)
- ✅ **Auto-scaling** - Scales to zero when idle
- ✅ **Full Docker support** - Native deployment

---

## Prerequisites (5 minutes)

### 1. Install flyctl

**Windows (PowerShell):**
```powershell
iwr https://fly.io/install.ps1 -useb | iex
```

**Mac:**
```bash
curl -L https://fly.io/install.sh | sh
```

**Verify:**
```bash
flyctl version
```

### 2. Create Account

```bash
flyctl auth signup
```

Use your GitHub account (benstone2038@gmail.com).

---

## Deploy (10 minutes)

### Step 1: Navigate to Project

```bash
cd "C:\Users\Ben\Desktop\Github\Genesis-Rebuild\genesis-dashboard"
```

### Step 2: Deploy Backend (3 min)

```bash
# Create app
flyctl launch --config fly.backend.toml --name genesis-backend --region ord --yes

# Set API key secret
flyctl secrets set LANGWATCH_API_KEY=sk-lw-ASNB2GzuOH5L8bIHWC6c1dEHuGk4XIoH4BM6ZxIn6cGTSz9x -a genesis-backend

# Create volume for revenue data
flyctl volumes create revenue_data --size 1 --region ord -a genesis-backend

# Deploy
flyctl deploy --config fly.backend.toml -a genesis-backend
```

**Wait for:** `"v0 deployed successfully"`

### Step 3: Deploy Frontend (3 min)

```bash
# Set backend URL
flyctl secrets set NEXT_PUBLIC_API_URL=https://genesis-backend.fly.dev -a genesis-frontend

# Create and deploy app
flyctl launch --config fly.frontend.toml --name genesis-frontend --region ord --yes
flyctl deploy --config fly.frontend.toml -a genesis-frontend
```

**Wait for:** `"v0 deployed successfully"`

### Step 4: Deploy Prometheus (Optional, 2 min)

```bash
# Create and deploy app
flyctl launch --config fly.prometheus.toml --name genesis-prometheus --region ord --yes
flyctl deploy --config fly.prometheus.toml -a genesis-prometheus

# Connect to backend
flyctl secrets set PROMETHEUS_URL=http://genesis-prometheus.internal:9090 -a genesis-backend
```

### Step 5: Test (2 min)

**Check backend health:**
```bash
curl https://genesis-backend.fly.dev/api/health
```

**Visit dashboard:**
```bash
# Windows
start https://genesis-frontend.fly.dev

# Mac
open https://genesis-frontend.fly.dev
```

**Click "Revenue & Profit"** in sidebar!

---

## That's It!

Your Genesis VPS Dashboard is live at:
- **Frontend:** https://genesis-frontend.fly.dev
- **Backend:** https://genesis-backend.fly.dev
- **Cost:** $6/month (70% cheaper than Render)

---

## Test Revenue Tracking

### Register Test Business

```bash
curl -X POST https://genesis-backend.fly.dev/api/revenue/business/register \
  -H "Content-Type: application/json" \
  -d '{
    "business_id": "test-1",
    "name": "Test SaaS Platform",
    "type": "saas",
    "quality_score": 92.0,
    "estimated_costs": 30.00
  }'
```

### Add Revenue

```bash
curl -X POST https://genesis-backend.fly.dev/api/revenue/business/test-1/revenue \
  -H "Content-Type: application/json" \
  -d '{
    "revenue": 2500.00,
    "source": "stripe"
  }'
```

### View Dashboard

Go to: https://genesis-frontend.fly.dev
- Click **"Revenue & Profit"**
- Should show: $2,500 revenue, $30 costs, $2,470 profit

---

## Common Issues

### "Out of memory" Error

```bash
flyctl scale memory 512 -a genesis-backend
```

### Frontend Can't Connect to Backend

```bash
# Check secret is set
flyctl secrets list -a genesis-frontend

# Should show: NEXT_PUBLIC_API_URL
```

### Volume Not Found

```bash
# Verify volume exists
flyctl volumes list -a genesis-backend

# Create if missing
flyctl volumes create revenue_data --size 1 --region ord -a genesis-backend
```

---

## Useful Commands

### View Logs

```bash
# Real-time logs
flyctl logs -a genesis-backend

# Specific app
flyctl logs -a genesis-frontend
```

### Check Status

```bash
# All apps
flyctl apps list

# Specific app
flyctl status -a genesis-backend
```

### Scale Resources

```bash
# More RAM
flyctl scale memory 512 -a genesis-backend

# More instances
flyctl scale count 2 -a genesis-backend
```

---

## Auto-Deploy on Git Push

### Create `.github/workflows/fly-deploy.yml`

```yaml
name: Deploy to Fly.io

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: superfly/flyctl-actions/setup-flyctl@master
      - run: flyctl deploy --config genesis-dashboard/fly.backend.toml -a genesis-backend
        env:
          FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: superfly/flyctl-actions/setup-flyctl@master
      - run: flyctl deploy --config genesis-dashboard/fly.frontend.toml -a genesis-frontend
        env:
          FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}
```

### Get API Token

```bash
flyctl auth token
```

Add to GitHub:
- Settings → Secrets → Actions → New secret
- Name: `FLY_API_TOKEN`
- Value: (paste token)

Now every push to `main` auto-deploys!

---

## Cost Breakdown

**Genesis Dashboard (3 services):**
- Backend: $2.02/month
- Frontend: $2.02/month
- Prometheus: $2.02/month
- Volume (1GB): $0.15/month
- Bandwidth: $0.20/month
- **Total: $6.41/month**

**With auto-stop (50% idle time):**
- **Total: ~$3.20/month**

**Compare to Render:** $21/month (Fly.io is 70% cheaper!)

---

## Documentation

**Complete guides:**
- This quick start: `START_HERE_FLY_IO.md` ⭐ YOU ARE HERE
- Full Fly.io guide: `FLY_IO_DEPLOYMENT_GUIDE.md` (expert-level)
- Platform comparison: `PLATFORM_COMPARISON_FINAL.md` (5 platforms)
- Render alternative: `RENDER_DEPLOYMENT_GUIDE.md`

**Fly.io docs:**
- Official docs: https://fly.io/docs
- Community: https://community.fly.io

---

## Next Steps

### Optional Enhancements

**1. Add custom domain:**
```bash
flyctl certs create dashboard.yourdomain.com -a genesis-frontend
```

**2. Multi-region deployment:**
```bash
flyctl scale count 2 --region ord,ams -a genesis-backend
```

**3. Enable autoscaling:**
```bash
flyctl autoscale set min=1 max=5 -a genesis-backend
```

**4. Upgrade RAM if needed:**
```bash
flyctl scale memory 512 -a genesis-backend
```

---

## Summary

✅ **Deployed in 15 minutes**
✅ **Cost: $6/month** (70% cheaper than Render)
✅ **Global CDN** (30+ regions)
✅ **Auto-scaling** (saves money when idle)
✅ **Live URLs:**
   - https://genesis-frontend.fly.dev
   - https://genesis-backend.fly.dev

**Your Genesis VPS Dashboard is now live!** 🚀

---

## Support

**Questions?**
- Full guide: `FLY_IO_DEPLOYMENT_GUIDE.md`
- Platform comparison: `PLATFORM_COMPARISON_FINAL.md`
- Fly.io docs: https://fly.io/docs
- Fly.io community: https://community.fly.io

**Issues?**
- Check logs: `flyctl logs -a genesis-backend`
- Check status: `flyctl status -a genesis-backend`
- Restart app: `flyctl machine restart <machine-id> -a genesis-backend`
