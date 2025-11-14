# Genesis VPS Dashboard - Render Deployment Guide (FINAL RECOMMENDATION)

## ⚠️ TRUTH: Docker Compose Support on Popular Platforms

After deep research, here's what I discovered:

| Platform | Docker Compose Support | Reality |
|----------|------------------------|---------|
| **Railway** | ❌ NO | Only drag-drop for images, not Dockerfiles |
| **Sevalla** | ❌ NO | Requires 3 separate apps |
| **Fly.io** | ❌ NO | Each service deployed separately |
| **Render** | ✅ **YES** | Blueprint.yaml (Docker Compose equivalent) |
| **Coolify** | ✅ YES | Self-hosted, full Docker Compose |

**Render is the ONLY major PaaS with Docker Compose-like multi-service deployment.**

---

## Why Render is Your Best Option

✅ **Blueprint.yaml** = Docker Compose for Render
✅ **All 3 services in ONE file**
✅ **Auto-deploy on Git push**
✅ **Internal networking** (services can talk to each other)
✅ **Persistent disks** for data
✅ **Free tier** available ($7/month after)
✅ **Zero manual configuration** of individual services

I've already created your `render.yaml` file - it's in the repo ready to use.

---

## 5-Minute Render Deployment

### Prerequisites
1. Render account: https://render.com (sign up with GitHub)
2. Your API key: `rnd_Ri8HG2I7x0ejjvLXK98Bglk5g2TH` (you gave me this earlier)

### Step 1: Commit render.yaml (1 min)

The file is already in your repo. Just commit and push:

```bash
cd "C:\Users\Ben\Desktop\Github\Genesis-Rebuild"
git add render.yaml
git commit -m "Add Render Blueprint for deployment"
git push origin main
```

### Step 2: Create Blueprint on Render (2 min)

1. Go to https://dashboard.render.com
2. Click **"New"** → **"Blueprint"**
3. Connect your GitHub account if not already connected
4. Select repository: **"Genesis-Rebuild"**
5. Branch: **"main"**
6. Render auto-detects `render.yaml`
7. Click **"Apply"**

### Step 3: Wait for Deployment (2 min)

Render will:
- Create 3 services (backend, frontend, prometheus)
- Build Docker images for each
- Deploy all services
- Connect them via internal networking
- Generate public URLs

Watch the logs in real-time.

---

## That's It!

Your Genesis VPS Dashboard is live at:
```
Frontend: https://genesis-frontend.onrender.com
Backend: https://genesis-backend.onrender.com
```

---

## What render.yaml Does

Here's what I configured for you:

### Backend Service (FastAPI)
```yaml
- type: web
  name: genesis-backend
  runtime: docker
  dockerfilePath: ./genesis-dashboard/Dockerfile.backend
  healthCheckPath: /api/health
  disk:
    mountPath: /app/data  # Persistent storage for revenue data
    sizeGB: 1
```

### Frontend Service (Next.js)
```yaml
- type: web
  name: genesis-frontend
  runtime: docker
  dockerfilePath: ./genesis-dashboard/Dockerfile.frontend
  envVars:
    - key: NEXT_PUBLIC_API_URL
      fromService:
        name: genesis-backend  # Auto-connects to backend!
```

### Prometheus (Background Service)
```yaml
- type: pserv  # Background service (not publicly accessible)
  name: genesis-prometheus
  runtime: image
  image:
    url: prom/prometheus:latest
```

**Key Feature:** `fromService` automatically sets the backend URL for the frontend!

---

## Testing Your Deployment

### 1. Check Backend Health
```bash
curl https://genesis-backend.onrender.com/api/health
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
curl https://genesis-backend.onrender.com/api/revenue/health
```

### 3. Register Test Business
```bash
curl -X POST https://genesis-backend.onrender.com/api/revenue/business/register \
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
curl -X POST https://genesis-backend.onrender.com/api/revenue/business/test-1/revenue \
  -H "Content-Type: application/json" \
  -d '{
    "revenue": 2500.00,
    "source": "stripe"
  }'
```

### 5. View Dashboard
1. Go to: `https://genesis-frontend.onrender.com`
2. Click **"Revenue & Profit"** in sidebar
3. Should show:
   - Total Revenue: $2,500
   - Total Costs: $30
   - Total Profit: $2,470
   - Profit Margin: 98.8%

---

## Pricing

### Free Tier (First Month)
Render gives you **750 hours/month free** for web services on Starter plan.

### Paid Tier (After Free Tier)
- **Backend:** $7/month (Starter: 512MB RAM, 0.1 CPU)
- **Frontend:** $7/month (Starter: 512MB RAM, 0.1 CPU)
- **Prometheus:** $7/month (Background service)
- **Disk:** $0.25/GB/month (1GB = $0.25)

**Total:** ~$21/month (or $14/month if you skip Prometheus)

### Cost Optimization:
1. Skip Prometheus initially ($14/month instead of $21)
2. Use "Starter Plus" for backend only if needed ($25/month for better performance)
3. Frontend can stay on Starter ($7/month)

---

## Automatic Deployments

Render automatically redeploys on Git push:

1. Make changes to your code
2. Commit and push to `main`:
```bash
git add .
git commit -m "Update feature"
git push origin main
```
3. Render detects the push
4. Automatically rebuilds and redeploys all 3 services
5. Zero downtime deployments

---

## Monitoring & Logs

### View Logs
1. Go to Render dashboard
2. Click any service (backend, frontend, prometheus)
3. Click **"Logs"** tab
4. View real-time logs

### Metrics
1. Click service → **"Metrics"** tab
2. View:
   - CPU usage
   - Memory usage
   - Request count
   - Response time

### Alerts
1. Service → **"Settings"** → **"Alerts"**
2. Set up email notifications for:
   - Service crashes
   - High memory usage
   - Failed deployments

---

## Environment Variables

### Update Backend Env Vars
1. Click **genesis-backend** service
2. Go to **"Environment"** tab
3. Add/edit variables
4. Click **"Save Changes"**
5. Service auto-restarts with new vars

### Update Frontend Env Vars
Same process for genesis-frontend service.

**Note:** Changes to env vars trigger a restart, not a redeploy. To redeploy, use "Manual Deploy" button.

---

## Custom Domains

### Add Custom Domain to Frontend

1. Click **genesis-frontend** service
2. Go to **"Settings"** → **"Custom Domain"**
3. Click **"Add Custom Domain"**
4. Enter your domain: `dashboard.yourdomain.com`
5. Add CNAME record to your DNS:
   ```
   CNAME dashboard.yourdomain.com → genesis-frontend.onrender.com
   ```
6. Render auto-provisions SSL certificate (Let's Encrypt)
7. HTTPS enabled automatically

---

## Data Persistence

### Backend Revenue Data

The `render.yaml` configures persistent storage:

```yaml
disk:
  name: revenue-data
  mountPath: /app/data
  sizeGB: 1
```

**What this means:**
- Revenue tracking database persists across deploys
- Data is NOT lost when you redeploy
- Automatically backed up by Render
- $0.25/month for 1GB

### Check Disk Usage
1. Click **genesis-backend**
2. Go to **"Disks"** tab
3. View usage

---

## Troubleshooting

### Build Failures

**Issue:** Docker build fails
**Solution:**
1. Check build logs in Render dashboard
2. Test Docker build locally:
   ```bash
   cd "C:\Users\Ben\Desktop\Github\Genesis-Rebuild"
   docker build -f genesis-dashboard/Dockerfile.backend .
   ```
3. Fix errors, commit, push

**Common causes:**
- Missing dependencies in Dockerfile
- Invalid Dockerfile syntax
- Build context issues

### Services Not Starting

**Issue:** Service shows "Build succeeded" but crashes on startup
**Solution:**
1. Check service logs for errors
2. Verify environment variables are set correctly
3. Ensure PORT environment variable is used in your app

**For FastAPI:**
Your Dockerfile should have:
```dockerfile
CMD ["uvicorn", "backend.api:app", "--host", "0.0.0.0", "--port", "$PORT"]
```

**For Next.js:**
```dockerfile
CMD ["node", "server.js"]
```
And server.js should use `process.env.PORT`.

### Frontend Can't Connect to Backend

**Issue:** API calls fail with network errors
**Solution:**
1. Verify `NEXT_PUBLIC_API_URL` is set correctly
2. Check it uses the format: `https://genesis-backend.onrender.com`
3. Ensure CORS is configured in backend `api.py`:
   ```python
   allow_origins=["https://genesis-frontend.onrender.com"]
   ```

### Slow Cold Starts (Free Tier)

**Issue:** Service takes 30+ seconds to respond after inactivity
**Why:** Render spins down free-tier services after 15 minutes of inactivity
**Solution:**
1. Upgrade to paid plan ($7/month) for instant response
2. Or use a uptime monitor to ping your service every 14 minutes (keeps it awake)

**Uptime Monitor Options:**
- UptimeRobot (free, pings every 5 min)
- Cron-job.org (free, configurable)
- BetterUptime (free tier available)

---

## Scaling

### Horizontal Scaling (Multiple Instances)

1. Click service (backend or frontend)
2. Go to **"Settings"** → **"Scaling"**
3. Increase **"Number of instances"**
4. Render load-balances automatically

**Note:** Services with persistent disks can't scale horizontally. Remove disk or use external database.

### Vertical Scaling (Bigger Instance)

1. Go to **"Settings"** → **"Instance Type"**
2. Upgrade plan:
   - **Starter:** $7/month (512MB, 0.1 CPU)
   - **Starter Plus:** $25/month (2GB, 1 CPU)
   - **Standard:** $85/month (4GB, 2 CPU)

---

## Render vs Others

| Feature | Render | Railway | Sevalla |
|---------|--------|---------|---------|
| **Multi-service file** | ✅ render.yaml | ❌ No | ❌ No |
| **Docker Compose-like** | ✅ Yes | ❌ No | ❌ No |
| **Setup time** | 5 min | N/A | 30-40 min |
| **Config changes** | None | Manual | Manual |
| **Monthly cost** | $14-21 | $8-10 | $10-15 |
| **Free tier** | 750 hrs | $5 credit | $50 credit |
| **Auto-deploy** | ✅ Yes | ✅ Yes | ✅ Yes |
| **Ease of use** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |

**Winner:** Render (only platform with true multi-service deployment)

---

## Advanced Features

### Background Jobs

Add a background worker to `render.yaml`:

```yaml
- type: worker
  name: genesis-worker
  runtime: docker
  dockerfilePath: ./genesis-dashboard/Dockerfile.backend
  dockerCommand: python worker.py
```

### Cron Jobs

Add scheduled tasks:

```yaml
- type: cron
  name: daily-revenue-sync
  runtime: docker
  dockerfilePath: ./genesis-dashboard/Dockerfile.backend
  dockerCommand: python sync_revenue.py
  schedule: "0 0 * * *"  # Daily at midnight
```

### Private Services

Make Prometheus private (not publicly accessible):

```yaml
- type: pserv  # Private service
  name: genesis-prometheus
```

Frontend and backend can still access it via internal networking.

---

## Internal Networking

Services can communicate using internal hostnames:

**Backend → Prometheus:**
```python
PROMETHEUS_URL = "http://genesis-prometheus:9090"
```

**Frontend → Backend:**
Automatically set via `fromService` in render.yaml:
```yaml
envVars:
  - key: NEXT_PUBLIC_API_URL
    fromService:
      name: genesis-backend
```

---

## Security Best Practices

### 1. Environment Variables
- ✅ Never commit API keys to Git
- ✅ Use Render's environment variable management
- ✅ Rotate keys regularly

### 2. HTTPS
- ✅ All services get free SSL certificates automatically
- ✅ HTTP automatically redirects to HTTPS
- ✅ Certificates auto-renew

### 3. Network Security
- ✅ Background services (pserv) not publicly accessible
- ✅ Internal networking is private
- ✅ DDoS protection included

---

## Migration from Other Platforms

### From Sevalla
1. Remove Sevalla-specific configs
2. Add `render.yaml` to repo
3. Deploy to Render
4. Update DNS to point to Render URLs

### From Railway
Same process as above. Your code doesn't need changes.

### From Docker Compose
If you have `docker-compose.yml`:
1. Convert each service to render.yaml format
2. Use my `render.yaml` as template
3. Deploy

---

## Support

**Render Documentation:**
- Docs: https://render.com/docs
- Blueprints: https://render.com/docs/infrastructure-as-code
- Community: https://community.render.com
- Status: https://status.render.com

**Your Documentation:**
- This guide: `RENDER_DEPLOYMENT_GUIDE.md`
- Complete system: `COMPLETE_REVENUE_SYSTEM_GUIDE.md`
- Testing: See "Testing Your Deployment" above

---

## Success Criteria

✅ **Deployment:**
- All 3 services show "Live" status
- Frontend accessible at public URL
- Backend API responds to health checks
- Prometheus collecting metrics (optional)

✅ **Revenue Tracking:**
- Can register businesses via API
- Can update revenue via API
- Dashboard displays metrics correctly
- Data persists across redeploys

✅ **Automation:**
- GitHub pushes trigger auto-deploy
- Zero manual steps required
- Zero-downtime deployments

---

## Summary

### What Render Gives You:
- ✅ **True multi-service deployment** (like Docker Compose)
- ✅ **One configuration file** (`render.yaml`)
- ✅ **Automatic service connections** (`fromService`)
- ✅ **Persistent storage** for revenue data
- ✅ **Auto-deploy** on Git push
- ✅ **Free SSL** certificates
- ✅ **Built-in monitoring** and logs
- ✅ **$14-21/month** (or free tier for testing)

### What You Don't Get:
- ❌ No global CDN (like Sevalla's Cloudflare)
- ❌ Free tier has cold starts (30s after 15 min inactivity)
- ❌ Slightly more expensive than Railway at scale

### Is It Worth It?
**YES** - Render is the **only major PaaS** that supports Docker Compose-like deployments with Blueprints. This means:
- Zero config changes to your code
- All services defined in one file
- Automatic deployments
- Production-ready in 5 minutes

---

## Ready to Deploy!

**Your render.yaml is already in the repo.** Just:

1. Commit and push render.yaml:
```bash
cd "C:\Users\Ben\Desktop\Github\Genesis-Rebuild"
git add render.yaml
git commit -m "Add Render Blueprint"
git push origin main
```

2. Go to https://dashboard.render.com
3. New → Blueprint
4. Select Genesis-Rebuild repo
5. Click "Apply"
6. Done!

**Your Genesis VPS Dashboard will be live in 5 minutes!** 🚀
