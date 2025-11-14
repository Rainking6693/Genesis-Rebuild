# Genesis VPS Dashboard - Railway Deployment Guide (RECOMMENDED)

## Why Railway?

After researching Sevalla extensively, I discovered **Sevalla does NOT support Docker Compose**. This means your `docker-compose.yml` file won't work there.

**Railway is the better choice because:**
- ✅ **Full Docker Compose support** out of the box
- ✅ **Auto-detects** your `docker-compose.yml`
- ✅ **Zero configuration** changes needed
- ✅ **All 3 services** (frontend + backend + Prometheus) deploy together
- ✅ **Free $5/month** starter credit
- ✅ **Simple pricing:** $0.000231/GB-hour RAM, $0.000463/vCPU-hour
- ✅ **Estimated cost:** $5-10/month for your setup

---

## 10-Minute Railway Deployment

### Step 1: Sign Up (2 min)

1. Go to https://railway.app
2. Click **"Start a New Project"**
3. Sign in with GitHub
4. Authorize Railway to access your repos

### Step 2: Create Project from Repo (3 min)

1. Click **"Deploy from GitHub repo"**
2. Search for **"Genesis-Rebuild"**
3. Select the repository
4. Railway will scan and detect `docker-compose.yml`
5. Click **"Deploy Now"**

### Step 3: Configure Environment Variables (3 min)

Railway will create 3 services automatically:
- `backend` (FastAPI)
- `frontend` (Next.js)
- `prometheus`

For each service, add the environment variables:

#### Backend Service
1. Click **backend** service
2. Go to **Variables** tab
3. Add:
```bash
ENVIRONMENT=production
LANGWATCH_API_KEY=sk-lw-ASNB2GzuOH5L8bIHWC6c1dEHuGk4XIoH4BM6ZxIn6cGTSz9x
PROMETHEUS_URL=http://prometheus:9090
DATABASE_PATH=/app/data
PORT=8000
```

#### Frontend Service
1. Click **frontend** service
2. Add:
```bash
NEXT_PUBLIC_API_URL=https://${{backend.RAILWAY_PUBLIC_DOMAIN}}
ENVIRONMENT=production
PORT=3000
```

**Note:** Railway automatically resolves `${{backend.RAILWAY_PUBLIC_DOMAIN}}` to the backend's URL!

#### Prometheus Service
1. Click **prometheus** service
2. No environment variables needed (uses prometheus.yml from repo)

### Step 4: Generate Domains (1 min)

1. Click **backend** service → **Settings** tab
2. Click **"Generate Domain"** under "Public Networking"
3. Copy the URL (e.g., `genesis-backend-production.up.railway.app`)

4. Click **frontend** service → **Settings**
5. Click **"Generate Domain"**
6. This is your **public dashboard URL**!

### Step 5: Deploy (1 min)

1. Railway automatically triggers deployment when you add env vars
2. Watch the logs in each service
3. Wait for all 3 services to show **"Active"** status
4. Total build time: ~3-5 minutes

---

## That's It!

Your Genesis VPS Dashboard is now live at:
```
https://genesis-frontend-production.up.railway.app
```

---

## Testing Your Deployment

### 1. Check Backend
```bash
curl https://YOUR-BACKEND-URL.up.railway.app/api/health
```

Expected:
```json
{
  "status": "healthy",
  "timestamp": "2025-11-14T...",
  "active_agents": 15
}
```

### 2. Check Revenue API
```bash
curl https://YOUR-BACKEND-URL.up.railway.app/api/revenue/health
```

### 3. Register Test Business
```bash
curl -X POST https://YOUR-BACKEND-URL.up.railway.app/api/revenue/business/register \
  -H "Content-Type: application/json" \
  -d '{
    "business_id": "test-1",
    "name": "Test SaaS Platform",
    "type": "saas",
    "quality_score": 92.0,
    "estimated_costs": 30.00
  }'
```

### 4. Add Revenue
```bash
curl -X POST https://YOUR-BACKEND-URL.up.railway.app/api/revenue/business/test-1/revenue \
  -H "Content-Type: application/json" \
  -d '{
    "revenue": 2500.00,
    "source": "stripe"
  }'
```

### 5. View Dashboard
1. Go to: `https://YOUR-FRONTEND-URL.up.railway.app`
2. Click **"Revenue & Profit"** in sidebar
3. Should show:
   - Total Revenue: $2,500
   - Total Costs: $30
   - Total Profit: $2,470
   - Success Rate: 100%

---

## Pricing Breakdown

Railway uses **usage-based pricing**:

**Example Monthly Cost:**
- **Backend:** 512MB RAM, 0.5 vCPU = ~$3.50/month
- **Frontend:** 512MB RAM, 0.5 vCPU = ~$3.50/month
- **Prometheus:** 256MB RAM, 0.25 vCPU = ~$1.50/month
- **Egress Bandwidth:** $0.10/GB (first 100GB free)

**Total:** ~$8-10/month

**First month:** FREE (Railway gives you $5 credit)

---

## Automatic Deployments (Already Enabled!)

Railway automatically redeploys when you push to GitHub:

1. Make changes to your code
2. Commit and push to `main` branch:
```bash
git add .
git commit -m "Update feature"
git push origin main
```
3. Railway detects the push and redeploys automatically
4. Watch the deployment in Railway dashboard

---

## Managing Your Deployment

### View Logs
1. Go to Railway dashboard
2. Click any service
3. Click **"Deployments"** tab
4. Click latest deployment
5. View real-time logs

### Restart a Service
1. Click service
2. Click **"Settings"** tab
3. Click **"Restart"** button

### Scale Resources
1. Click service
2. Click **"Settings"** tab
3. Under "Resources", adjust:
   - Memory limit (256MB - 32GB)
   - CPU limit (0.25 - 8 vCPU)
   - Replicas (1-20 instances)

### Add Custom Domain
1. Click **frontend** service
2. Go to **"Settings"** → "Networking"
3. Click **"Add Domain"**
4. Enter your domain (e.g., `dashboard.yourdomain.com`)
5. Add the provided CNAME record to your DNS
6. Railway auto-provisions SSL certificate

---

## Monitoring

### Railway Built-In Metrics
1. Click any service
2. Click **"Metrics"** tab
3. View:
   - CPU usage
   - Memory usage
   - Network traffic
   - Request count
   - Response time

### Prometheus Metrics
1. Access Prometheus: `http://prometheus:9090` (internal only)
2. View from backend logs or add TCP proxy for external access

### Application Logs
1. Click **backend** service
2. Click **"Deployments"** → Latest
3. View application logs in real-time

---

## Data Persistence

Railway automatically handles persistent storage:

**Backend Data Volume:**
- Path: `/app/data`
- Revenue tracking database persists across deploys
- Automatically backed up

**To view storage:**
1. Click **backend** service
2. Click **"Data"** tab
3. See volume usage

---

## Troubleshooting

### Services Not Starting
**Issue:** Service shows "Crashed" status
**Solution:**
1. Check logs for errors
2. Verify environment variables are set correctly
3. Ensure Dockerfile builds successfully locally

### Frontend Can't Connect to Backend
**Issue:** API calls fail with CORS errors
**Solution:**
1. Verify `NEXT_PUBLIC_API_URL` is set correctly
2. Check backend CORS configuration in `api.py`
3. Ensure backend service has public domain generated

### Out of Memory
**Issue:** Service crashes with OOM error
**Solution:**
1. Increase memory limit in Settings
2. Optimize application code
3. Consider upgrading Railway plan

### Slow Build Times
**Issue:** Deployment takes >10 minutes
**Solution:**
1. Railway caches Docker layers automatically
2. First build is slow, subsequent builds are faster
3. Optimize Dockerfiles (use multi-stage builds)

---

## Cost Optimization Tips

### 1. Hibernate Unused Services
- Pause Prometheus if not actively monitoring
- Railway bills per-second, so stopping saves money

### 2. Optimize Resource Limits
- Don't over-allocate memory/CPU
- Start small (256MB/0.25 vCPU) and scale up if needed

### 3. Use Railway's Free Tier
- $5/month free credit
- 500 execution hours included
- 100GB bandwidth included

### 4. Monitor Usage
1. Go to Railway dashboard
2. Click **"Usage"** in sidebar
3. See current month's costs
4. Set up usage alerts

---

## Advanced Features

### Environment Pipelines (Dev/Staging/Prod)

Railway supports multiple environments:

1. Click project name
2. Click **"Settings"** → "Environments"
3. Create **"staging"** environment
4. Deploy different branches:
   - Production: `main` branch
   - Staging: `develop` branch

### Database Integration

Add PostgreSQL/MySQL/Redis:

1. Click **"New"** → "Database"
2. Select database type
3. Railway auto-connects to your services
4. Environment variables auto-populate

### Webhooks & Notifications

1. Project **"Settings"** → "Webhooks"
2. Add webhook URL
3. Get notified on:
   - Deployment success/failure
   - Service crashes
   - Resource limit warnings

---

## Comparison: Railway vs Sevalla

| Feature | Railway | Sevalla |
|---------|---------|---------|
| Docker Compose | ✅ Native | ❌ Not supported |
| Setup Time | 10 minutes | 30-40 minutes |
| Multi-service | Single project | 3 separate apps |
| Pricing | Usage-based | Usage-based |
| Free Credit | $5/month | $50 one-time |
| Auto-deploy | ✅ Yes | ✅ Yes |
| Custom Domains | ✅ Free SSL | ✅ Free SSL |
| Monitoring | Built-in | Third-party |
| Database | 1-click add | Separate app |

**Winner:** Railway (for Docker Compose projects)

---

## Security Best Practices

### 1. Environment Variables
- ✅ Never commit `.env` files to Git
- ✅ Use Railway's environment variable management
- ✅ Rotate API keys regularly

### 2. Network Security
- ✅ Backend has public domain (for API access)
- ✅ Prometheus stays internal (no public access)
- ✅ Railway provides DDoS protection

### 3. Data Security
- ✅ All traffic is HTTPS by default
- ✅ Data volumes are encrypted at rest
- ✅ Railway is SOC 2 Type II certified

---

## Next Steps

### Your Dashboard is Live!

1. **Test the Revenue API** (see Testing section above)
2. **Add Real Business Data** via API or integrate with your Genesis system
3. **Set Up Custom Domain** (optional)
4. **Monitor Usage** in Railway dashboard
5. **Configure Alerts** for deployment failures

### Optional Enhancements

1. **Add Stripe Integration**
   - Follow `COMPLETE_REVENUE_SYSTEM_GUIDE.md` Part 3
   - Auto-sync revenue from Stripe

2. **Set Up Monitoring Alerts**
   - Use Prometheus AlertManager
   - Get notified on system issues

3. **Add Database**
   - PostgreSQL for structured data
   - Redis for caching
   - Railway 1-click integration

---

## Success Criteria

✅ **Deployment:**
- All 3 services show "Active" status in Railway
- Frontend accessible at public URL
- Backend API responds to health checks
- Prometheus collecting metrics

✅ **Revenue Tracking:**
- Can register businesses via API
- Can update revenue via API
- Dashboard displays metrics correctly
- Data persists across redeploys

✅ **Automation:**
- GitHub pushes trigger auto-deploy
- No manual steps required
- Zero-downtime deployments

---

## Support

**Railway Documentation:**
- Docs: https://docs.railway.app
- Discord: https://discord.gg/railway
- Status: https://status.railway.app

**Your Documentation:**
- Complete Guide: `COMPLETE_REVENUE_SYSTEM_GUIDE.md`
- Testing: See "Testing Your Deployment" section above
- Troubleshooting: See "Troubleshooting" section above

---

**Ready to deploy? It only takes 10 minutes!** 🚀

Go to https://railway.app and follow the steps above!
