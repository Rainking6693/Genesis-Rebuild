# Genesis VPS Dashboard - Deployment & Revenue Tracking Complete

## Status: READY TO DEPLOY

All files have been added to the Genesis-Rebuild repo and pushed to GitHub `main` branch.

---

## What Was Added

### Deployment Files (7 files)
1. `genesis-dashboard/Dockerfile.backend` - FastAPI containerization
2. `genesis-dashboard/Dockerfile.frontend` - Next.js containerization
3. `genesis-dashboard/docker-compose.yml` - Multi-container orchestration
4. `genesis-dashboard/prometheus.yml` - Prometheus metrics config
5. `.github/workflows/deploy-genesis-dashboard.yml` - GitHub Actions CI/CD
6. `genesis-dashboard/backend/revenue_tracker.py` - Revenue tracking API
7. `genesis-dashboard/src/components/RevenueDashboard.tsx` - Revenue UI component

### Code Changes (3 files)
1. `genesis-dashboard/backend/api.py` - Added revenue tracker router
2. `genesis-dashboard/src/app/page.tsx` - Added RevenueDashboard component
3. `genesis-dashboard/src/components/Sidebar.tsx` - Added "Revenue & Profit" menu item

---

## Features

### Automated Deployment
- Docker Compose orchestration (Frontend + Backend + Prometheus)
- GitHub Actions CI/CD pipeline
- Automatic deployment to Sevalla on push to `main`
- Health checks and auto-restart

### Revenue Tracking
- **System-wide metrics:**
  - Total monthly revenue
  - Total monthly costs
  - Total monthly profit
  - Profit margin percentage
  - Active businesses count
  - Success rate (% profitable)

- **Per-business metrics:**
  - Individual revenue
  - Individual costs
  - Individual profit
  - Quality score
  - Status (active/paused/shutdown)

- **Real-time updates:**
  - Dashboard refreshes every 30 seconds
  - JSON database persistence
  - RESTful API endpoints

---

## Next Steps (10 Minutes Setup)

### Step 1: Configure Sevalla (5 min)

1. Go to https://sevalla.com and create a new application
2. Select "Docker Compose" deployment
3. Connect to your GitHub repo: `Rainking6693/Genesis-Rebuild`
4. Set branch to `main`
5. Set Docker Compose path: `genesis-dashboard/docker-compose.yml`

**Environment Variables to Add:**
```bash
ENVIRONMENT=production
PROMETHEUS_URL=http://prometheus:9090
LANGWATCH_API_KEY=sk-lw-ASNB2GzuOH5L8bIHWC6c1dEHuGk4XIoH4BM6ZxIn6cGTSz9x
NEXT_PUBLIC_API_URL=https://your-app-name.sevalla.app
```

6. Deploy the application
7. Note the app ID from the Sevalla dashboard URL (e.g., `app_abc123xyz`)

### Step 2: Add GitHub Secrets (2 min)

1. Go to https://github.com/Rainking6693/Genesis-Rebuild/settings/secrets/actions
2. Click "New repository secret"
3. Add these secrets:

| Name | Value |
|------|-------|
| `SEVALLA_API_KEY` | `8e3ba0103501704e7350cf9c7cc34b863b3f363bd1568f5390de16fa7ba98dbc` |
| `SEVALLA_DASHBOARD_APP_ID` | Your app ID from Step 1 |

### Step 3: Test Deployment (3 min)

1. Push any change to `main` branch to trigger deployment:
```bash
cd "C:\Users\Ben\Desktop\Github\Genesis-Rebuild"
git commit --allow-empty -m "Trigger deployment"
git push origin main
```

2. Watch GitHub Actions: https://github.com/Rainking6693/Genesis-Rebuild/actions

3. Once deployed, visit your Sevalla app URL

4. Click "Revenue & Profit" in the sidebar

---

## API Endpoints

Your Genesis Dashboard API will have these revenue endpoints:

```bash
# Get system-wide metrics
GET /api/revenue/metrics

# Register a new business
POST /api/revenue/business/register
{
  "business_id": "biz-001",
  "name": "My SaaS App",
  "type": "saas",
  "quality_score": 85.0,
  "estimated_costs": 25.00
}

# Update business revenue
POST /api/revenue/business/{business_id}/revenue
{
  "revenue": 1500.00,
  "source": "stripe"
}

# Update business status
POST /api/revenue/business/{business_id}/status
{
  "status": "active"
}

# Get single business metrics
GET /api/revenue/business/{business_id}

# Health check
GET /api/revenue/health
```

---

## Testing the System

### 1. Register Test Business
```bash
curl -X POST https://your-app.sevalla.app/api/revenue/business/register \
  -H "Content-Type: application/json" \
  -d '{
    "business_id": "test-saas-1",
    "name": "Test SaaS Platform",
    "type": "saas",
    "quality_score": 92.0,
    "estimated_costs": 30.00
  }'
```

**Expected Response:**
```json
{
  "business_id": "test-saas-1",
  "name": "Test SaaS Platform",
  "revenue_monthly": 0.0,
  "costs_monthly": 30.0,
  "profit_monthly": -30.0,
  "quality_score": 92.0,
  "status": "active",
  "created_at": "2025-11-14T12:00:00Z"
}
```

### 2. Update Revenue
```bash
curl -X POST https://your-app.sevalla.app/api/revenue/business/test-saas-1/revenue \
  -H "Content-Type: application/json" \
  -d '{
    "revenue": 2500.00,
    "source": "stripe"
  }'
```

**Expected Response:**
```json
{
  "business_id": "test-saas-1",
  "revenue_monthly": 2500.0,
  "profit_monthly": 2470.0,
  "status": "active"
}
```

### 3. View Dashboard
1. Navigate to: https://your-app.sevalla.app
2. Click "Revenue & Profit" in sidebar
3. You should see:
   - **Total Revenue:** $2,500.00
   - **Total Costs:** $30.00
   - **Total Profit:** $2,470.00
   - **Profit Margin:** 98.8%
   - **Active Businesses:** 1
   - **Success Rate:** 100%

4. Per-business table should show:
   - Test SaaS Platform
   - Revenue: $2,500.00
   - Costs: $30.00
   - Profit: $2,470.00
   - Quality: 92/100

---

## System Architecture

```
GitHub Push → main branch
    ↓
GitHub Actions Workflow
    ↓
Build Docker Images
    ↓
Push to GitHub Container Registry
    ↓
Trigger Sevalla Deployment
    ↓
Pull Images & Deploy
    ↓
Services Running:
    - Frontend (Next.js) - Port 3000
    - Backend (FastAPI) - Port 8000
    - Prometheus - Port 9090
    ↓
Load Balancer → Public URL
```

---

## File Locations

**Deployment Files:**
- Dockerfiles: `genesis-dashboard/`
- Docker Compose: `genesis-dashboard/docker-compose.yml`
- Prometheus Config: `genesis-dashboard/prometheus.yml`
- GitHub Workflow: `.github/workflows/deploy-genesis-dashboard.yml`

**Backend Files:**
- Revenue API: `genesis-dashboard/backend/revenue_tracker.py`
- Main API: `genesis-dashboard/backend/api.py` (updated)

**Frontend Files:**
- Revenue Component: `genesis-dashboard/src/components/RevenueDashboard.tsx`
- Main Page: `genesis-dashboard/src/app/page.tsx` (updated)
- Sidebar: `genesis-dashboard/src/components/Sidebar.tsx` (updated)

---

## Troubleshooting

### Deployment Fails
1. Check GitHub Actions logs: https://github.com/Rainking6693/Genesis-Rebuild/actions
2. Verify GitHub secrets are set correctly
3. Check Sevalla deployment logs in dashboard

### Revenue Data Not Showing
1. Check backend is running: `curl https://your-app.sevalla.app/api/revenue/health`
2. Register a test business (see Testing section above)
3. Check browser console for API errors

### Frontend Can't Connect to Backend
1. Verify `NEXT_PUBLIC_API_URL` environment variable is set
2. Check CORS configuration in `backend/api.py`
3. Verify backend service is healthy in Sevalla dashboard

### Database Not Persisting
1. Check Docker volume is mounted: `revenue_data:/app/data`
2. Verify `revenue_tracker.py` has write permissions
3. Check Sevalla logs for file system errors

---

## What's Next

Your Genesis VPS Dashboard now has:
- ✅ Automated Docker deployment
- ✅ CI/CD pipeline via GitHub Actions
- ✅ Revenue tracking API
- ✅ Beautiful revenue dashboard UI
- ✅ Real-time metrics updates
- ✅ System-wide and per-business analytics

**To deploy:**
1. Follow "Next Steps" above (10 minutes)
2. Test with curl commands
3. View dashboard in browser

**For Langflow Dashboard revenue tracking:**
- See `C:\Users\Ben\Desktop\Github\langflow-dashboard\COMPLETE_REVENUE_SYSTEM_GUIDE.md`
- Estimated time: 15 minutes

---

## Success Criteria

✅ **Deployment:**
- Genesis Dashboard accessible at Sevalla URL
- Frontend loads without errors
- Backend API responds to health check
- Prometheus collecting metrics

✅ **Revenue Tracking:**
- Can register new businesses via API
- Can update revenue via API
- Dashboard displays metrics correctly
- Per-business table shows data
- System metrics calculate correctly

✅ **Automation:**
- GitHub push triggers deployment
- Docker images build successfully
- Services restart automatically on failure

---

## Support

**If you encounter issues:**
1. Check this guide's Troubleshooting section
2. Review GitHub Actions logs
3. Check Sevalla deployment logs
4. Verify environment variables are set correctly

**Documentation:**
- Full guide: `C:\Users\Ben\Desktop\Github\langflow-dashboard\QUICK_START_BOTH_SYSTEMS.md`
- Technical details: `C:\Users\Ben\Desktop\Github\langflow-dashboard\COMPLETE_REVENUE_SYSTEM_GUIDE.md`
- This guide: `REVENUE_DEPLOYMENT_COMPLETE.md`

---

**Ready to deploy? Start with "Next Steps" above!** 🚀
