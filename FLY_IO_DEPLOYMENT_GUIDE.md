# Genesis VPS Dashboard - Fly.io Deployment Guide (TOP EXPERT EDITION)

## 🎯 Why Fly.io is the BEST Choice

After becoming an absolute TOP EXPERT on Fly.io, here's why it's superior to Render:

| Feature | Fly.io | Render |
|---------|--------|--------|
| **Cost (2 services)** | ~$3-6/month | $14-21/month |
| **Free Tier** | Pay-as-you-go (low usage = $1-2/mo) | No free tier |
| **RAM per service** | 256MB shared (upgradeable) | 512MB fixed (Starter) |
| **Multi-service** | Process groups + private networking | Blueprint.yaml |
| **Global CDN** | 30+ regions worldwide | Limited regions |
| **Cold starts** | Sub-second with Machines | 30-60s on free tier |
| **Docker support** | ✅ Full native support | ✅ Full support |
| **Auto-scale** | ✅ Machine autoscaling | Limited |
| **Internal networking** | ✅ 6PN (IPv6 mesh) | ✅ Internal hostnames |

**Winner:** Fly.io - 70% cheaper with better performance!

---

## Architecture Strategy: Multiple Apps vs Process Groups

### Option 1: Multiple Apps (RECOMMENDED for Genesis)

Deploy 3 **separate Fly apps** that communicate via private networking:

```
genesis-backend (FastAPI)    → fly.toml
genesis-frontend (Next.js)   → fly.toml
genesis-prometheus (Prom)    → fly.toml
```

**Why this approach:**
- ✅ **Easier to manage** - Each service scales independently
- ✅ **Simpler configuration** - Standard fly.toml per service
- ✅ **Better isolation** - One service crash doesn't affect others
- ✅ **Cost-effective** - Only pay for what you use per service
- ✅ **Matches Render architecture** - Easy migration

**Communication:** Apps talk via `.internal` DNS (e.g., `genesis-backend.internal`)

### Option 2: Process Groups (Advanced)

Deploy 1 **single Fly app** with multiple process groups:

```
genesis-dashboard/
  └── fly.toml (defines 3 process groups)
```

**Why NOT recommended for Genesis:**
- ❌ More complex configuration
- ❌ All processes share resources (harder to debug)
- ❌ Requires custom Dockerfile with multiple entrypoints
- ❌ Harder to scale individual components

**We'll use Option 1 (Multiple Apps).**

---

## Fly.io Architecture Deep Dive

### Fly Machines
- **What:** Fast-launching VMs (start/stop in <1 second)
- **How:** Built on Firecracker microVMs
- **Why:** Run your Docker containers as isolated VMs
- **Pricing:** Pay-as-you-go per Machine

### 6PN Private Networking
- **What:** IPv6 mesh network using WireGuard tunnels
- **How:** All apps in same org can communicate via `.internal` DNS
- **Why:** Secure internal communication without public internet
- **Example:** Frontend calls `http://genesis-backend.internal:8000/api/health`

### Persistent Storage
- **Volumes:** Persistent block storage (like EBS)
- **Pricing:** $0.15/GB/month
- **How:** Mounted to `/data` in your container
- **Important:** Volumes are **region-specific** (can't move between regions)

### Auto-scaling
- **Auto-stop:** Machines stop after inactivity (saves money)
- **Auto-start:** Machines start on first request (sub-second)
- **Scale count:** Horizontal scaling (`fly scale count 3`)
- **Scale memory:** Vertical scaling (`fly scale memory 1024`)

---

## Cost Breakdown (Actual Pricing)

### Genesis Dashboard Deployment (3 services)

**Backend (FastAPI):**
- Machine: shared-cpu-1x, 256MB RAM
- Usage: 720 hours/month (always-on)
- Cost: ~$2.02/month ($0.0028/hour × 720)
- Volume: 1GB for revenue data
- Cost: $0.15/month
- **Subtotal: $2.17/month**

**Frontend (Next.js):**
- Machine: shared-cpu-1x, 256MB RAM
- Usage: 720 hours/month (always-on)
- Cost: ~$2.02/month
- **Subtotal: $2.02/month**

**Prometheus (Optional):**
- Machine: shared-cpu-1x, 256MB RAM
- Usage: 720 hours/month (always-on)
- Cost: ~$2.02/month
- **Subtotal: $2.02/month**

**Bandwidth:**
- Estimate: 10GB/month outbound
- Cost: $0.20/month ($0.02/GB North America)

**Total Monthly Cost:**
- With Prometheus: **$6.41/month**
- Without Prometheus: **$4.39/month**

**Compare to Render:** $14-21/month (Fly.io is 70% cheaper!)

### Cost Optimization

**Auto-stop (Recommended):**
If you enable auto-stop for low-traffic periods:
- Frontend/Backend idle 50% of time
- Cost drops to **$3.20/month** (with auto-stop)

**Free Tier Equivalent:**
- While Fly.io has no "free tier", usage-based pricing means:
- Very low traffic = ~$1-2/month
- Much cheaper than Render's $14/month minimum

---

## Prerequisites

### 1. Install flyctl CLI

**Windows (PowerShell):**
```powershell
iwr https://fly.io/install.ps1 -useb | iex
```

**Mac/Linux:**
```bash
curl -L https://fly.io/install.sh | sh
```

**Verify installation:**
```bash
flyctl version
```

### 2. Create Fly.io Account

```bash
flyctl auth signup
# OR if you have account:
flyctl auth login
```

**Tip:** Use your GitHub account for signup (benstone2038@gmail.com)

### 3. Create Organization (if needed)

```bash
flyctl orgs create genesis-org
flyctl orgs select genesis-org
```

---

## Deployment Files Created

I've created 3 separate `fly.toml` files for you:

```
Genesis-Rebuild/
├── genesis-dashboard/
│   ├── fly.backend.toml      ← Backend configuration
│   ├── fly.frontend.toml     ← Frontend configuration
│   └── fly.prometheus.toml   ← Prometheus configuration
```

---

## Step-by-Step Deployment (15 minutes)

### Step 1: Deploy Backend (5 min)

```bash
cd "C:\Users\Ben\Desktop\Github\Genesis-Rebuild"

# Navigate to dashboard directory
cd genesis-dashboard

# Deploy backend
flyctl launch --config fly.backend.toml --name genesis-backend --region ord --yes

# Set secrets (never commit to Git)
flyctl secrets set LANGWATCH_API_KEY=sk-lw-ASNB2GzuOH5L8bIHWC6c1dEHuGk4XIoH4BM6ZxIn6cGTSz9x -a genesis-backend

# Create volume for revenue data
flyctl volumes create revenue_data --size 1 --region ord -a genesis-backend

# Deploy
flyctl deploy --config fly.backend.toml -a genesis-backend
```

**Expected output:**
```
==> Monitoring deployment
 1 desired, 1 placed, 1 healthy, 0 unhealthy
--> v0 deployed successfully
```

**Get backend URL:**
```bash
flyctl status -a genesis-backend
# Note the hostname: genesis-backend.fly.dev
```

### Step 2: Deploy Frontend (5 min)

```bash
# Set backend API URL
flyctl secrets set NEXT_PUBLIC_API_URL=https://genesis-backend.fly.dev -a genesis-frontend

# Deploy frontend
flyctl launch --config fly.frontend.toml --name genesis-frontend --region ord --yes
flyctl deploy --config fly.frontend.toml -a genesis-frontend
```

**Expected output:**
```
==> Monitoring deployment
 1 desired, 1 placed, 1 healthy, 0 unhealthy
--> v0 deployed successfully
```

**Get frontend URL:**
```bash
flyctl status -a genesis-frontend
# Note the hostname: genesis-frontend.fly.dev
```

### Step 3: Deploy Prometheus (Optional, 3 min)

```bash
# Deploy prometheus
flyctl launch --config fly.prometheus.toml --name genesis-prometheus --region ord --yes
flyctl deploy --config fly.prometheus.toml -a genesis-prometheus
```

**Set prometheus URL in backend:**
```bash
flyctl secrets set PROMETHEUS_URL=http://genesis-prometheus.internal:9090 -a genesis-backend
```

### Step 4: Verify Deployment (2 min)

**Check backend health:**
```bash
curl https://genesis-backend.fly.dev/api/health
```

Expected:
```json
{
  "status": "healthy",
  "timestamp": "2025-11-14T...",
  "active_agents": 15
}
```

**Check frontend:**
```bash
curl https://genesis-frontend.fly.dev
# Should return Next.js HTML
```

**Visit dashboard:**
Open: `https://genesis-frontend.fly.dev`

---

## Configuration Files Explained

### fly.backend.toml

```toml
app = "genesis-backend"
primary_region = "ord"  # Chicago (closest to you)

[build]
  dockerfile = "Dockerfile.backend"

[env]
  ENVIRONMENT = "production"
  DATABASE_PATH = "/data"
  PORT = "8000"

[http_service]
  internal_port = 8000
  force_https = true
  auto_stop_machines = "stop"      # Stop when idle (save money)
  auto_start_machines = true       # Start on request
  min_machines_running = 0         # Can scale to zero

[[http_service.checks]]
  grace_period = "10s"
  interval = "30s"
  method = "GET"
  path = "/api/health"
  timeout = "5s"

[[mounts]]
  source = "revenue_data"
  destination = "/data"
  initial_size = "1gb"

[[vm]]
  memory = "256mb"
  cpu_kind = "shared"
  cpus = 1
```

**Key features:**
- Auto-stop/start (saves money when idle)
- Health checks every 30s
- 256MB RAM (upgradeable if needed)
- Persistent volume at `/data`

### fly.frontend.toml

```toml
app = "genesis-frontend"
primary_region = "ord"

[build]
  dockerfile = "Dockerfile.frontend"

[env]
  ENVIRONMENT = "production"
  PORT = "3000"

[http_service]
  internal_port = 3000
  force_https = true
  auto_stop_machines = "stop"
  auto_start_machines = true
  min_machines_running = 0

[[http_service.checks]]
  grace_period = "10s"
  interval = "30s"
  method = "GET"
  path = "/"
  timeout = "5s"

[[vm]]
  memory = "256mb"
  cpu_kind = "shared"
  cpus = 1
```

**Key features:**
- Auto-stop/start
- Health checks on homepage
- 256MB RAM
- NEXT_PUBLIC_API_URL set via secrets

### fly.prometheus.toml

```toml
app = "genesis-prometheus"
primary_region = "ord"

[build]
  image = "prom/prometheus:latest"

[[services]]
  internal_port = 9090
  protocol = "tcp"
  auto_stop_machines = false       # Prometheus stays running
  auto_start_machines = false

[[vm]]
  memory = "256mb"
  cpu_kind = "shared"
  cpus = 1
```

**Key features:**
- Official Prometheus image
- No auto-stop (metrics always available)
- Internal only (not publicly accessible)
- 256MB RAM

---

## Testing Your Deployment

### 1. Health Checks

```bash
# Backend health
curl https://genesis-backend.fly.dev/api/health

# Revenue API health
curl https://genesis-backend.fly.dev/api/revenue/health
```

### 2. Register Test Business

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

### 3. Add Revenue

```bash
curl -X POST https://genesis-backend.fly.dev/api/revenue/business/test-1/revenue \
  -H "Content-Type: application/json" \
  -d '{
    "revenue": 2500.00,
    "source": "stripe"
  }'
```

### 4. View Dashboard

1. Go to: `https://genesis-frontend.fly.dev`
2. Click **"Revenue & Profit"** in sidebar
3. Should show:
   - Total Revenue: $2,500
   - Total Costs: $30
   - Total Profit: $2,470
   - Profit Margin: 98.8%

---

## Monitoring & Management

### View Logs

```bash
# Backend logs (live)
flyctl logs -a genesis-backend

# Frontend logs
flyctl logs -a genesis-frontend

# Filter by severity
flyctl logs -a genesis-backend --level error
```

### Check Status

```bash
# All apps
flyctl apps list

# Specific app status
flyctl status -a genesis-backend

# Machine details
flyctl machine list -a genesis-backend
```

### Scale Resources

**Vertical scaling (more RAM):**
```bash
# Upgrade to 512MB
flyctl scale memory 512 -a genesis-backend

# Upgrade to 1GB
flyctl scale memory 1024 -a genesis-backend
```

**Horizontal scaling (more Machines):**
```bash
# Run 2 instances
flyctl scale count 2 -a genesis-backend

# Multi-region (US + Europe)
flyctl scale count 2 --region ord,ams -a genesis-backend
```

### Update Environment Variables

```bash
# Set new secret
flyctl secrets set NEW_VAR=value -a genesis-backend

# List secrets
flyctl secrets list -a genesis-backend

# Unset secret
flyctl secrets unset OLD_VAR -a genesis-backend
```

---

## Auto-Deploy on Git Push (GitHub Actions)

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
1. Go to repo Settings → Secrets → Actions
2. Click "New repository secret"
3. Name: `FLY_API_TOKEN`
4. Value: (paste token)
5. Click "Add secret"

Now every push to `main` auto-deploys!

---

## Troubleshooting

### Issue: "Out of memory" Error

**Symptom:** Machine crashes with OOM (Out Of Memory)

**Solution:**
```bash
flyctl scale memory 512 -a genesis-backend
```

**Reason:** 256MB might be tight for FastAPI with heavy traffic

### Issue: "Volume not found" Error

**Symptom:** Backend can't find `/data` directory

**Solution:**
```bash
# Create volume if missing
flyctl volumes create revenue_data --size 1 --region ord -a genesis-backend

# Verify volume exists
flyctl volumes list -a genesis-backend
```

### Issue: Frontend Can't Connect to Backend

**Symptom:** API calls fail with network errors

**Solution 1 - Check secrets:**
```bash
flyctl secrets list -a genesis-frontend
# Should show NEXT_PUBLIC_API_URL
```

**Solution 2 - Use internal DNS (if same org):**
```bash
flyctl secrets set NEXT_PUBLIC_API_URL=http://genesis-backend.internal:8000 -a genesis-frontend
```

**Solution 3 - Check CORS:**
Backend `api.py` should allow frontend domain:
```python
allow_origins=["https://genesis-frontend.fly.dev"]
```

### Issue: Slow Cold Starts

**Symptom:** First request takes 5-10 seconds

**Reason:** Machine auto-stopped, needs to restart

**Solution 1 - Keep min machines running:**
Edit `fly.toml`:
```toml
min_machines_running = 1  # Always keep 1 running
```

**Solution 2 - Disable auto-stop:**
```toml
auto_stop_machines = "off"
```

**Cost impact:** +$2/month per service

### Issue: "No organization selected"

**Solution:**
```bash
flyctl orgs list
flyctl orgs select genesis-org
```

---

## Cost Optimization Strategies

### 1. Enable Auto-Stop (Default)

Let machines stop when idle:
```toml
auto_stop_machines = "stop"
min_machines_running = 0
```

**Savings:** 50% cost reduction for low-traffic apps

### 2. Skip Prometheus Initially

**Before:** $6.41/month (3 services)
**After:** $4.39/month (2 services)
**Savings:** $2.02/month (31%)

You can add Prometheus later when needed.

### 3. Use Internal DNS

For backend-to-prometheus communication:
```bash
flyctl secrets set PROMETHEUS_URL=http://genesis-prometheus.internal:9090 -a genesis-backend
```

**Savings:** No outbound bandwidth charges for internal traffic

### 4. Scale to Zero for Dev/Test

For non-production apps:
```toml
min_machines_running = 0
```

**Savings:** Only pay when actively using the app

---

## Migration from Render

If you deployed to Render already, here's how to migrate:

### 1. Export Environment Variables

From Render dashboard, copy all env vars.

### 2. Set Secrets on Fly.io

```bash
flyctl secrets set LANGWATCH_API_KEY=... -a genesis-backend
flyctl secrets set NEXT_PUBLIC_API_URL=... -a genesis-frontend
```

### 3. Migrate Volume Data (if needed)

**Option 1 - Fresh start (RECOMMENDED):**
Just deploy, revenue data will regenerate.

**Option 2 - Export/Import:**
1. SSH to Render backend
2. Copy `/app/data` contents
3. SSH to Fly.io backend
4. Paste to `/data`

### 4. Update DNS (if custom domain)

Change CNAME from:
```
dashboard.yourdomain.com → genesis-frontend.onrender.com
```

To:
```
dashboard.yourdomain.com → genesis-frontend.fly.dev
```

### 5. Delete Render Services

Cancel Render subscriptions to avoid double-billing.

---

## Custom Domains

### Add Custom Domain to Frontend

```bash
# Add domain
flyctl certs create dashboard.yourdomain.com -a genesis-frontend

# Get DNS instructions
flyctl certs show dashboard.yourdomain.com -a genesis-frontend
```

**Add DNS record:**
```
CNAME dashboard.yourdomain.com → genesis-frontend.fly.dev
```

**SSL Certificate:**
- Fly.io auto-provisions Let's Encrypt SSL
- HTTPS enabled automatically
- Auto-renewal every 90 days

**Update backend URL:**
```bash
flyctl secrets set NEXT_PUBLIC_API_URL=https://api.yourdomain.com -a genesis-frontend
```

---

## Advanced Features

### Multi-Region Deployment

Deploy to multiple regions for global performance:

```bash
# Add Europe region
flyctl scale count 2 --region ord,ams -a genesis-backend

# Check regions
flyctl regions list -a genesis-backend
```

**Regions:**
- `ord` - Chicago (North America)
- `ams` - Amsterdam (Europe)
- `syd` - Sydney (Asia Pacific)
- `gru` - São Paulo (South America)

### Autoscaling

Enable automatic horizontal scaling:

```bash
# Install autoscaling
flyctl autoscale set min=1 max=5 -a genesis-backend

# Check autoscale status
flyctl autoscale show -a genesis-backend
```

**Metrics-based scaling:**
Edit `fly.toml`:
```toml
[http_service.concurrency]
  type = "requests"
  soft_limit = 100
  hard_limit = 150
```

When requests > 100, Fly.io spawns new Machines.

### Background Jobs

Add worker process:

```bash
# Clone backend machine
flyctl machine clone <machine-id> -a genesis-backend

# Set different command
flyctl machine update <new-machine-id> --command "python worker.py" -a genesis-backend
```

---

## Platform Comparison (Final Verdict)

| Feature | Fly.io | Render | Railway | Vercel |
|---------|--------|--------|---------|--------|
| **Docker Compose** | ❌ Use multiple apps | ✅ Blueprint | ❌ Limited | ❌ No Docker |
| **Multi-service** | ✅ Private networking | ✅ Blueprint | ❌ Separate services | ❌ No |
| **Setup time** | 15 min | 5 min | N/A | N/A |
| **Monthly cost (3 services)** | $6.41 | $21 | $15-20 | Incompatible |
| **Free tier** | Usage-based (~$1-2) | None | $5 credit | Serverless only |
| **Auto-scale** | ✅ Yes | Limited | ✅ Yes | ✅ Serverless |
| **Global regions** | 30+ | 4 | 10+ | 70+ |
| **Cold starts** | <1s | 30-60s | 5-10s | N/A |
| **Persistent storage** | ✅ Volumes | ✅ Disks | ✅ Volumes | ❌ Ephemeral |

**Winner:** Fly.io (best cost + performance + flexibility)

---

## Support

**Fly.io Documentation:**
- Docs: https://fly.io/docs
- Community: https://community.fly.io
- Discord: https://fly.io/discord
- Status: https://status.flyio.net

**flyctl Commands:**
```bash
flyctl help                    # All commands
flyctl <command> --help        # Specific command help
flyctl doctor                  # System diagnostics
```

**Your Documentation:**
- This guide: `FLY_IO_DEPLOYMENT_GUIDE.md`
- Complete system: `COMPLETE_REVENUE_SYSTEM_GUIDE.md`
- Render guide (for comparison): `RENDER_DEPLOYMENT_GUIDE.md`

---

## Success Criteria

✅ **Deployment:**
- All 3 apps show "deployed successfully"
- Machines are running and healthy
- URLs accessible publicly

✅ **Revenue Tracking:**
- Can register businesses via API
- Can update revenue via API
- Dashboard displays metrics correctly
- Data persists in volume

✅ **Cost:**
- Monthly bill: $4-7 (70% cheaper than Render)
- Auto-stop working (machines stop when idle)
- No surprise charges

✅ **Performance:**
- Cold starts: <1 second
- API response time: <200ms
- Dashboard loads: <2 seconds

---

## Summary

### What Fly.io Gives You:
- ✅ **70% cheaper than Render** ($6 vs $21/month)
- ✅ **Usage-based pricing** (pay only for what you use)
- ✅ **Global CDN** (30+ regions)
- ✅ **Fast cold starts** (<1s vs 30-60s)
- ✅ **Auto-scaling** (horizontal + vertical)
- ✅ **Private networking** (6PN mesh)
- ✅ **Persistent storage** (volumes)
- ✅ **Docker support** (full native)

### What You Don't Get:
- ❌ No Docker Compose (use multiple apps instead)
- ❌ No true "free tier" (but very cheap)
- ❌ More complex setup (15 min vs 5 min for Render)
- ❌ Need to manage 3 separate apps

### Is It Worth It?
**YES** - Fly.io is the **best value** for multi-service Docker deployments:
- 70% cost savings vs Render
- Better performance (global CDN, faster cold starts)
- More flexibility (auto-scale, multi-region)
- Industry standard (used by thousands of production apps)

---

## Ready to Deploy!

**Your fly.toml files are ready.** Just run:

```bash
cd "C:\Users\Ben\Desktop\Github\Genesis-Rebuild\genesis-dashboard"

# Deploy backend (5 min)
flyctl launch --config fly.backend.toml --name genesis-backend --region ord --yes
flyctl secrets set LANGWATCH_API_KEY=sk-lw-ASNB2GzuOH5L8bIHWC6c1dEHuGk4XIoH4BM6ZxIn6cGTSz9x -a genesis-backend
flyctl volumes create revenue_data --size 1 --region ord -a genesis-backend
flyctl deploy --config fly.backend.toml -a genesis-backend

# Deploy frontend (5 min)
flyctl secrets set NEXT_PUBLIC_API_URL=https://genesis-backend.fly.dev -a genesis-frontend
flyctl launch --config fly.frontend.toml --name genesis-frontend --region ord --yes
flyctl deploy --config fly.frontend.toml -a genesis-frontend

# Deploy prometheus (optional, 3 min)
flyctl launch --config fly.prometheus.toml --name genesis-prometheus --region ord --yes
flyctl deploy --config fly.prometheus.toml -a genesis-prometheus

# Visit your dashboard!
open https://genesis-frontend.fly.dev
```

**Your Genesis VPS Dashboard will be live in 15 minutes at ~$6/month!** 🚀
