# Genesis VPS Dashboard Automated Deployment + Revenue Tracking

## 📦 Complete System - Ready to Deploy!

This folder contains everything you need to deploy the Genesis VPS Dashboard with full revenue/profit tracking to Sevalla.

---

## 🎯 What This Includes

### Deployment Files
- ✅ `Dockerfile.backend` - FastAPI backend container
- ✅ `Dockerfile.frontend` - Next.js frontend container
- ✅ `docker-compose.yml` - Multi-container orchestration
- ✅ `prometheus.yml` - Prometheus metrics configuration
- ✅ `.github_workflows_deploy-genesis-dashboard.yml` - CI/CD pipeline

### Revenue Tracking System
- ✅ `revenue_tracker.py` - FastAPI revenue tracking API
- ✅ `RevenueDashboard.tsx` - React revenue dashboard component

### Documentation
- ✅ `README.md` - This file
- ✅ `../COMPLETE_REVENUE_SYSTEM_GUIDE.md` - Full implementation guide
- ✅ `../QUICK_START_BOTH_SYSTEMS.md` - 30-minute quick start

---

## ⚡ Quick Start (30 Minutes)

### Step 1: Copy Files to Genesis-Rebuild Repo

```bash
# Navigate to your Genesis-Rebuild repo
cd /path/to/Genesis-Rebuild

# Copy deployment files
cp GENESIS_VPS_DEPLOYMENT/Dockerfile.backend genesis-dashboard/
cp GENESIS_VPS_DEPLOYMENT/Dockerfile.frontend genesis-dashboard/
cp GENESIS_VPS_DEPLOYMENT/docker-compose.yml genesis-dashboard/
cp GENESIS_VPS_DEPLOYMENT/prometheus.yml genesis-dashboard/

# Copy revenue tracker
cp GENESIS_VPS_DEPLOYMENT/revenue_tracker.py genesis-dashboard/backend/

# Copy revenue dashboard UI
cp GENESIS_VPS_DEPLOYMENT/RevenueDashboard.tsx genesis-dashboard/src/components/

# Copy GitHub Actions workflow
mkdir -p .github/workflows
cp GENESIS_VPS_DEPLOYMENT/.github_workflows_deploy-genesis-dashboard.yml \
   .github/workflows/deploy-genesis-dashboard.yml
```

### Step 2: Update Backend

**File:** `genesis-dashboard/backend/api.py`

Add at the end:
```python
from .revenue_tracker import router as revenue_router
app.include_router(revenue_router)
```

### Step 3: Update Frontend

**File:** `genesis-dashboard/src/components/Sidebar.tsx`

```typescript
// Add import
import { DollarSign } from 'lucide-react'
import RevenueDashboard from './RevenueDashboard'

// Add to navigation array
{ icon: DollarSign, label: 'Revenue & Profit', component: 'revenue' }

// Add to render switch
case 'revenue':
  return <RevenueDashboard />
```

### Step 4: Configure Sevalla

1. **Create Application:**
   - Name: `Genesis VPS Dashboard`
   - Build Method: Docker Compose
   - Repository: `https://github.com/Rainking6693/Genesis-Rebuild`
   - Branch: `deploy-clean`
   - Docker Compose Path: `genesis-dashboard/docker-compose.yml`

2. **Add Environment Variables:**
   ```bash
   PROMETHEUS_URL=http://prometheus:9090
   GENESIS_BASE_PATH=/app
   CORS_ORIGINS=https://*.sevalla.app
   NEXT_PUBLIC_API_URL=https://your-app.sevalla.app
   LANGWATCH_API_KEY=sk-lw-ASNB2GzuOH5L8bIHWC6c1dEHuGk4XIoH4BM6ZxIn6cGTSz9x
   ```

3. **Get App ID** from Sevalla dashboard URL

### Step 5: Add GitHub Secrets

Go to: `https://github.com/Rainking6693/Genesis-Rebuild/settings/secrets/actions`

```
SEVALLA_API_KEY: 8e3ba0103501704e7350cf9c7cc34b863b3f363bd1568f5390de16fa7ba98dbc
SEVALLA_DASHBOARD_APP_ID: [from Step 4]
```

### Step 6: Deploy!

```bash
git add .
git commit -m "Add Genesis Dashboard deployment + revenue tracking"
git push origin deploy-clean
```

Watch deployment:
- GitHub: https://github.com/Rainking6693/Genesis-Rebuild/actions
- Sevalla: https://app.sevalla.com

---

## 📊 Features

### Automated Deployment
- ✅ Push to GitHub = Automatic deployment
- ✅ Multi-container orchestration (Frontend + Backend + Prometheus)
- ✅ Health checks and auto-restart
- ✅ Zero-downtime deployments

### Revenue Tracking
- ✅ System-wide monthly revenue
- ✅ Monthly profit calculation
- ✅ Active business count
- ✅ Success rate (profitable businesses %)
- ✅ Per-business breakdown
- ✅ Quality score tracking
- ✅ Real-time updates (30s refresh)

### Monitoring
- ✅ Prometheus metrics collection
- ✅ LangWatch observability
- ✅ Health check endpoints
- ✅ API documentation (Swagger)

---

## 🔌 API Endpoints

### Revenue Tracking

**Get System Metrics:**
```bash
GET /api/revenue/metrics

Response:
{
  "total_revenue": 1500.00,
  "total_costs": 150.00,
  "total_profit": 1350.00,
  "profit_margin": 90.0,
  "active_businesses": 10,
  "success_rate": 80.0,
  "businesses": [...]
}
```

**Register Business:**
```bash
POST /api/revenue/business/register
{
  "business_id": "genesis-saas-1",
  "name": "My SaaS Business",
  "type": "saas",
  "quality_score": 85.5,
  "deployment_url": "https://my-saas.com",
  "estimated_costs": 15.00
}
```

**Update Revenue:**
```bash
POST /api/revenue/business/{business_id}/revenue
{
  "revenue": 299.00,
  "source": "stripe"  // or "manual", "analytics"
}
```

**Update Status:**
```bash
POST /api/revenue/business/{business_id}/status?status=active
# status: active, paused, shutdown
```

**Health Check:**
```bash
GET /api/revenue/health
```

---

## 🧪 Testing

### 1. Register Test Business

```bash
curl -X POST https://your-app.sevalla.app/api/revenue/business/register \
  -H "Content-Type: application/json" \
  -d '{
    "business_id": "test-1",
    "name": "Test SaaS",
    "type": "saas",
    "quality_score": 90.0,
    "estimated_costs": 20.00
  }'
```

### 2. Update Revenue

```bash
curl -X POST https://your-app.sevalla.app/api/revenue/business/test-1/revenue \
  -H "Content-Type: application/json" \
  -d '{"revenue": 500.00, "source": "manual"}'
```

### 3. View Dashboard

```
https://your-app.sevalla.app
→ Click "Revenue & Profit" in sidebar
→ Should show: $500 revenue, $20 costs, $480 profit
```

---

## 🔄 Deployment Flow

```
Push to GitHub (deploy-clean branch)
    ↓
GitHub Actions Triggered
    ↓
Build Backend Docker Image (FastAPI)
    ↓
Build Frontend Docker Image (Next.js)
    ↓
Push Images to GitHub Container Registry
    ↓
Trigger Sevalla Deployment via API
    ↓
Sevalla Pulls Images + Starts Containers
    ↓
Health Checks Pass
    ↓
✅ Live at https://your-app.sevalla.app
```

**Deployment Time:** 3-5 minutes

---

## 📈 Metrics You Get

### System-Wide
- **Monthly Revenue:** Total revenue from all active businesses
- **Monthly Costs:** Total operating costs
- **Monthly Profit:** Revenue - Costs
- **Profit Margin:** (Profit / Revenue) × 100
- **Active Businesses:** Count of active businesses
- **Total Businesses:** All businesses (active + paused + shutdown)
- **Success Rate:** % of businesses with profit > 0
- **Avg Quality Score:** Average quality across all businesses

### Per-Business
- **Revenue Monthly:** Monthly revenue for this business
- **Costs Monthly:** Monthly operating costs
- **Profit Monthly:** Revenue - Costs
- **Quality Score:** 0-100 quality rating
- **Status:** active, paused, shutdown
- **Deployment URL:** Live business URL
- **Created At:** When business was registered
- **Last Updated:** Last revenue update timestamp

---

## 💰 Stripe Integration (Optional)

See `../COMPLETE_REVENUE_SYSTEM_GUIDE.md` Part 3 for full Stripe integration.

**Quick setup:**
1. Get Stripe API key from https://dashboard.stripe.com/apikeys
2. Add to GitHub secrets: `STRIPE_API_KEY`
3. Add to Sevalla environment: `STRIPE_API_KEY=sk_live_...`
4. Copy `stripe_integration.py` from guide
5. Enable daily automated sync via GitHub Actions

**Benefits:**
- Automatic revenue syncing from Stripe
- No manual data entry
- Real payment data
- Daily updates

---

## 📚 Additional Documentation

- **`COMPLETE_REVENUE_SYSTEM_GUIDE.md`** - Full implementation guide with all code
- **`QUICK_START_BOTH_SYSTEMS.md`** - 30-minute setup for both dashboards
- **`GENESIS_VPS_DASHBOARD_ANALYSIS.md`** - Technical analysis and architecture

---

## 🐛 Troubleshooting

### Deployment Fails

**Check:**
1. GitHub secrets are set correctly
2. Sevalla App ID is correct
3. Environment variables configured in Sevalla
4. Docker Compose file is in correct location

**View logs:**
- GitHub Actions: Check workflow run logs
- Sevalla: Deployments → Latest → Build logs

### Revenue API 404

**Check:**
1. `revenue_tracker.py` in `backend/` folder
2. Backend API includes router: `app.include_router(revenue_router)`
3. Container restarted after code changes

**Test:**
```bash
curl https://your-app.sevalla.app/api/revenue/health
# Should return: {"status": "healthy", ...}
```

### Dashboard Shows No Data

**Check:**
1. Businesses registered via API
2. Revenue updated via API
3. Database file exists: `/app/data/revenue/revenue_tracking.json`

**Manual verification:**
```bash
# In Sevalla terminal (if available)
cat /app/data/revenue/revenue_tracking.json
```

---

## 🚀 Production Checklist

- [ ] All files copied to Genesis-Rebuild repo
- [ ] Backend includes revenue_tracker router
- [ ] Frontend Sidebar includes RevenueDashboard
- [ ] Sevalla application created
- [ ] Environment variables configured
- [ ] GitHub secrets added
- [ ] Code pushed to deploy-clean branch
- [ ] GitHub Actions workflow succeeded
- [ ] Sevalla deployment completed
- [ ] Frontend accessible at URL
- [ ] Revenue page shows in sidebar
- [ ] API endpoints respond correctly
- [ ] Test business registered successfully
- [ ] Revenue updates work
- [ ] Dashboard displays metrics correctly
- [ ] Stripe integration configured (optional)
- [ ] Automated sync enabled (optional)

---

## 📞 Support

For issues or questions:
1. Check `COMPLETE_REVENUE_SYSTEM_GUIDE.md`
2. Review `QUICK_START_BOTH_SYSTEMS.md`
3. Check GitHub Actions logs
4. Check Sevalla deployment logs

---

**Everything is ready! Just follow the Quick Start steps above to deploy.** 🎉
