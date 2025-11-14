# Genesis VPS Dashboard - Sevalla Deployment Guide (CORRECTED)

## ⚠️ IMPORTANT: Sevalla Does NOT Support Docker Compose

After deep research into Sevalla's platform, I discovered that **Sevalla does NOT support Docker Compose deployments directly**.

Instead, Sevalla requires you to deploy **each service as a separate application** and connect them using **internal networking**.

---

## How Sevalla Works

### Deployment Methods Supported:
1. ✅ **Git Repository** (Nixpacks auto-detection)
2. ✅ **Git Repository + Dockerfile** (single Dockerfile per app)
3. ✅ **Docker Image** (pre-built images from registry)
4. ❌ **Docker Compose** (NOT SUPPORTED)

### Multi-Service Architecture:
- Each service (frontend, backend, database) = **Separate Sevalla application**
- Applications connect via **Internal Networking** (fast, free bandwidth)
- Internal connections only work **within the same region**

---

## Correct Deployment Strategy for Genesis Dashboard

You need to create **3 separate Sevalla applications**:

1. **Frontend Application** (Next.js)
2. **Backend Application** (FastAPI)
3. **Prometheus** (Optional - for monitoring)

Then connect them using Sevalla's internal networking.

---

## Step-by-Step: Deploy Genesis Dashboard to Sevalla

### Application 1: Backend (FastAPI)

#### 1. Create Backend Application
1. Go to https://sevalla.com/dashboard
2. Click "Add Application"
3. Select **"Public GIT repository"**
4. Configure:
   - **Repository:** `https://github.com/Rainking6693/Genesis-Rebuild`
   - **Branch:** `main`
   - **Name:** `genesis-backend`
   - **Region:** Choose closest to you (e.g., `us-west1`)

#### 2. Configure Build Settings
1. After creation, go to **Settings → Build**
2. Change **Build method** to **"Dockerfile"**
3. Set:
   - **Dockerfile path:** `genesis-dashboard/Dockerfile.backend`
   - **Context:** `.` (repository root)
4. Click **"Update settings"**

#### 3. Add Environment Variables
Go to **Settings → Environment Variables** and add:

```bash
ENVIRONMENT=production
LANGWATCH_API_KEY=sk-lw-ASNB2GzuOH5L8bIHWC6c1dEHuGk4XIoH4BM6ZxIn6cGTSz9x
PROMETHEUS_URL=http://genesis-prometheus:9090
DATABASE_PATH=/app/data
```

#### 4. Add Persistent Storage (for revenue data)
1. Go to **Storage → Add persistent storage**
2. Set:
   - **Mount path:** `/app/data`
   - **Size:** 1 GB (minimum)
3. This ensures revenue tracking data persists across deployments

#### 5. Configure Process
1. Go to **Processes**
2. Ensure **Web Process** is enabled
3. **Start command:** (Leave empty - Dockerfile handles this)
4. **Port:** Will auto-detect (should be 8000)

#### 6. Deploy
1. Click **"Deploy"** button
2. Wait for build to complete (~3-5 minutes)
3. Note the **internal hostname** (e.g., `genesis-backend.internal`)

---

### Application 2: Frontend (Next.js)

#### 1. Create Frontend Application
1. Click "Add Application"
2. Select **"Public GIT repository"**
3. Configure:
   - **Repository:** `https://github.com/Rainking6693/Genesis-Rebuild`
   - **Branch:** `main`
   - **Name:** `genesis-frontend`
   - **Region:** **SAME as backend** (e.g., `us-west1`)

#### 2. Configure Build Settings
1. Go to **Settings → Build**
2. Change to **"Dockerfile"**
3. Set:
   - **Dockerfile path:** `genesis-dashboard/Dockerfile.frontend`
   - **Context:** `.`

#### 3. Add Environment Variables
```bash
NEXT_PUBLIC_API_URL=https://genesis-backend-YOUR_APP_ID.sevalla.app
ENVIRONMENT=production
```

**IMPORTANT:** Replace `YOUR_APP_ID` with your actual backend app URL from Sevalla

#### 4. Deploy
1. Click **"Deploy"**
2. Wait for build to complete
3. This will be your **public-facing URL**

---

### Application 3: Prometheus (Optional - Monitoring)

#### 1. Create Prometheus Application
1. Click "Add Application"
2. Select **"Docker image"**
3. Configure:
   - **Docker Image:** `prom/prometheus:latest`
   - **Name:** `genesis-prometheus`
   - **Region:** **SAME as backend/frontend**

#### 2. Add Configuration File
Since Sevalla doesn't support volume mounts from Git for Docker images, you have two options:

**Option A: Build Custom Prometheus Image**
1. Create a new repo with your `prometheus.yml`
2. Create a Dockerfile:
```dockerfile
FROM prom/prometheus:latest
COPY prometheus.yml /etc/prometheus/prometheus.yml
```
3. Deploy from Git repo instead

**Option B: Use ConfigMap-like Approach**
Use environment variables to configure Prometheus targets

---

### Step 4: Connect Applications (Internal Networking)

#### Connect Backend to Prometheus
1. Go to **Backend app → Networking**
2. Click **"Add connection"** in "Connected services"
3. Select **"genesis-prometheus"**
4. This creates internal connection (free, fast)

#### Connect Frontend to Backend
1. Go to **Frontend app → Networking**
2. Click **"Add connection"**
3. Select **"genesis-backend"**
4. Update `NEXT_PUBLIC_API_URL` if needed

---

## Complete Architecture

```
User Browser
    ↓
Frontend (Next.js) - https://genesis-frontend.sevalla.app
    ↓ (Internal Network)
Backend (FastAPI) - Internal hostname + Public URL
    ↓ (Internal Network)
Prometheus (Optional) - Internal hostname only
```

---

## Pricing Estimate

**Smallest Setup:**
- **Backend:** $5/month (S1 pod: 0.25 CPU / 0.5 GB RAM)
- **Frontend:** $5/month (S1 pod: 0.25 CPU / 0.5 GB RAM)
- **Storage:** $0.10/month (1 GB persistent storage)
- **Prometheus:** $5/month (optional)

**Total:** ~$10-15/month (with $50 free credit = 3+ months free)

**Recommended Setup:**
- **Backend:** $15/month (S3 pod: 0.5 CPU / 1 GB RAM)
- **Frontend:** $10/month (S2 pod: 0.5 CPU / 0.5 GB RAM)
- **Storage:** $0.10/month

**Total:** ~$25/month

---

## Testing Your Deployment

### 1. Check Backend Health
```bash
curl https://genesis-backend-YOUR_APP_ID.sevalla.app/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2025-11-14T...",
  "active_agents": 15
}
```

### 2. Check Revenue API
```bash
curl https://genesis-backend-YOUR_APP_ID.sevalla.app/api/revenue/health
```

Expected:
```json
{
  "status": "healthy",
  "message": "Revenue tracker is operational",
  "data_file": "exists"
}
```

### 3. Test Revenue Tracking
```bash
# Register business
curl -X POST https://genesis-backend-YOUR_APP_ID.sevalla.app/api/revenue/business/register \
  -H "Content-Type: application/json" \
  -d '{
    "business_id": "test-1",
    "name": "Test SaaS",
    "type": "saas",
    "quality_score": 90.0,
    "estimated_costs": 25.00
  }'

# Add revenue
curl -X POST https://genesis-backend-YOUR_APP_ID.sevalla.app/api/revenue/business/test-1/revenue \
  -H "Content-Type: application/json" \
  -d '{
    "revenue": 1500.00,
    "source": "stripe"
  }'

# View metrics
curl https://genesis-backend-YOUR_APP_ID.sevalla.app/api/revenue/metrics
```

### 4. View Dashboard
1. Navigate to: `https://genesis-frontend-YOUR_APP_ID.sevalla.app`
2. Click **"Revenue & Profit"** in sidebar
3. Should show:
   - Total Revenue: $1,500
   - Total Costs: $25
   - Total Profit: $1,475
   - Per-business breakdown

---

## Automated Deployments with GitHub Actions

The workflow file we created (`.github/workflows/deploy-genesis-dashboard.yml`) won't work with Sevalla's multi-app architecture.

### Alternative: Use Sevalla's Auto-Deploy Feature

1. Go to each app → **Settings → Git**
2. Enable **"Auto-deploy on push"**
3. Select branch: `main`
4. Now pushing to GitHub will auto-deploy both apps

### Or: Use Deploy Hooks

1. Go to each app → **Settings → Deploy Hooks**
2. Enable and copy the webhook URL
3. Add to GitHub repo webhooks
4. Configure to trigger on `push` events

---

## Advantages of This Approach

✅ **Independent Scaling:** Scale frontend and backend separately
✅ **Cost Optimization:** Only pay for what each service needs
✅ **Zero-Downtime Deploys:** Update backend without affecting frontend
✅ **Free Internal Traffic:** Backend ↔ Prometheus communication is free
✅ **Regional Optimization:** Deploy in same region for low latency

---

## Disadvantages vs Docker Compose

❌ **More Setup:** Need to create 2-3 separate apps
❌ **No Single Config:** Can't define everything in one file
❌ **Manual Networking:** Have to manually connect services
❌ **Environment Variable Duplication:** Need to set vars in multiple places

---

## Alternative: Use Railway or Render

If you want Docker Compose support, consider:

### Railway
- ✅ **Full Docker Compose support**
- ✅ **Auto-detects docker-compose.yml**
- ✅ **Single deployment for all services**
- ✅ **Free $5/month starter plan**
- **Cons:** More expensive at scale

### Render
- ✅ **Multi-service deployments**
- ✅ **Blueprint.yaml** for infra-as-code
- ✅ **Free tier available**
- **Cons:** Slower cold starts

---

## Recommended Path Forward

**Option 1: Stay with Sevalla (Multi-App)**
- Follow this guide
- Deploy backend + frontend separately
- Connect with internal networking
- **Best for:** Long-term, production use
- **Time:** 30-40 minutes setup

**Option 2: Switch to Railway (Docker Compose)**
- Use existing `docker-compose.yml`
- One-click deployment
- **Best for:** Quick setup, testing
- **Time:** 10 minutes setup

**Option 3: Simplify to Single Dockerfile**
- Combine frontend + backend into one Dockerfile
- Deploy as single Sevalla app
- **Best for:** Monolith approach
- **Time:** 20 minutes (requires code changes)

---

## What I Recommend

**For production:** Use **Railway** with Docker Compose
- Your `docker-compose.yml` is already perfect
- Zero configuration changes needed
- All services work together out of the box
- $5-10/month is reasonable for this use case

**For Sevalla:** Only if you need their specific features (global CDN, Cloudflare integration, etc.)
- Requires splitting into 3 separate apps
- More complex but more flexible
- Better for scaling individual services

---

## Next Steps

**If choosing Railway:**
1. Go to https://railway.app
2. "New Project" → "Deploy from GitHub"
3. Select `Genesis-Rebuild` repo
4. Railway auto-detects `docker-compose.yml`
5. Add environment variables
6. Deploy (5 minutes)

**If staying with Sevalla:**
1. Follow "Step-by-Step" section above
2. Create 3 separate applications
3. Connect with internal networking
4. Test endpoints
5. Configure custom domain (optional)

---

## Questions?

**Q: Can I use Sevalla API to automate this?**
A: Yes! Sevalla has a full API. You could script creating all 3 apps and connecting them.

**Q: What about the GitHub Actions workflow?**
A: It won't work as-is. Use Sevalla's auto-deploy or deploy hooks instead.

**Q: Can I deploy Prometheus from Docker Hub directly?**
A: Yes, but you'll need to configure it via environment variables or build a custom image with your config.

**Q: Is internal networking really free?**
A: Yes! Bandwidth between apps in the same region is completely free.

**Q: What happens to my revenue data during redeployments?**
A: It persists in the `/app/data` volume you configured. Always use persistent storage for databases/data.

---

**Ready to deploy? Choose your platform and let me know!**

I recommend **Railway** for simplicity, or **Sevalla multi-app** if you need their specific features.
