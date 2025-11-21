# Genesis Dashboard - Quick Start Guide 🚀

## What You Have

✅ **Event Emitter** - `infrastructure/event_emitter.py`
✅ **Dashboard API** - `dashboard/api.py` (FastAPI backend)
✅ **Dashboard UI** - `dashboard/static/index.html` (Beautiful frontend)
✅ **Setup Complete** - Ready to run!

---

## Installation (1 minute)

```bash
# Install dependencies
pip install fastapi uvicorn

# Start dashboard API
cd dashboard
python3 api.py
```

Expected output:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
```

Open http://localhost:8000 in your browser - you'll see the Genesis Mission Control dashboard!

---

## Simple Test (30 seconds)

Send a test event:

```bash
python3 -c "
from infrastructure.event_emitter import GenesisEventEmitter
emitter = GenesisEventEmitter()
emitter.emit('test', {}, message='🧪 Dashboard works!')
"
```

Refresh your dashboard - you'll see your test event appear!

---

## Integration with Genesis Meta Agent

The original instructions provided 20 strategic emission points throughout Genesis. Here's the simplified version for your coder on VPS:

### Step 1: Add Import

In `infrastructure/genesis_meta_agent.py`, add after line ~30:

```python
from infrastructure.event_emitter import GenesisEventEmitter
```

### Step 2: Initialize in `__init__`

In the `__init__` method (around line 580), add after router initialization:

```python
# Dashboard Integration
self.event_emitter = GenesisEventEmitter(
    api_url=os.getenv("DASHBOARD_API_URL", "http://localhost:8000")
)
logger.info("✅ Dashboard event emitter initialized")
```

### Step 3: Add Events (Example Pattern)

Wherever you want to track events in Genesis, add:

```python
self.event_emitter.emit(
    event_type="event_name",           # e.g., "business_started", "deployment_complete"
    business_name=spec.name,            # Current business name
    agent_name="Agent Name",            # e.g., "Deploy Agent", "Builder Agent"
    message="Human readable message",   # What the user sees
    data={"any": "extra_data"}         # Optional extra info
)
```

###  Key Emission Points (Top 10)

Add these emissions to track the most important events:

**1. Business Generation Started**
```python
# When: Starting business generation
self.event_emitter.emit(
    event_type="business_generation_started",
    business_name=spec.name,
    agent_name="Genesis",
    message=f"🎯 Starting {spec.name}",
    data={"type": spec.business_type}
)
```

**2. Component Build Started**
```python
# When: Building each component
self.event_emitter.emit(
    event_type="build_progress",
    business_name=spec.name,
    agent_name="Builder Agent",
    message=f"Building {component_name}",
    data={"component": component_name}
)
```

**3. GitHub Repo Created**
```python
# When: GitHub repository created
self.event_emitter.emit(
    event_type="github_created",
    business_name=spec.name,
    agent_name="Deploy Agent",
    message="✅ GitHub repository created",
    data={"github_url": github_url}
)
```

**4. Deployment Started**
```python
# When: Deployment begins
self.event_emitter.emit(
    event_type="deployment_started",
    business_name=spec.name,
    agent_name="Deploy Agent",
    message="🚀 Deploying to production...",
    data={}
)
```

**5. Deployment Complete (SUCCESS!)**
```python
# When: Deployment succeeds
self.event_emitter.emit(
    event_type="deployment_complete",
    business_name=spec.name,
    agent_name="Genesis",
    message=f"✅ {spec.name} is LIVE!",
    data={
        "url": deployment_url,
        "github": github_url
    }
)
```

**6. Deployment Failed**
```python
# When: Deployment fails
self.event_emitter.emit(
    event_type="deployment_failed",
    business_name=spec.name,
    agent_name="Deploy Agent",
    message=f"❌ Deployment failed: {error}",
    data={"error": str(error)}
)
```

**7. Agent Started**
```python
# When: Any agent starts work
self.event_emitter.emit(
    event_type="agent_started",
    business_name=spec.name,
    agent_name="SpecAgent",  # or BuilderAgent, DeployAgent, etc.
    message=f"📋 {agent_name} started",
    data={}
)
```

**8. Agent Completed**
```python
# When: Agent finishes
self.event_emitter.emit(
    event_type="agent_completed",
    business_name=spec.name,
    agent_name="SpecAgent",
    message=f"✅ {agent_name} completed",
    data={"files_generated": file_count}
)
```

**9. Error Occurred**
```python
# When: Any error happens
self.event_emitter.emit(
    event_type="error",
    business_name=spec.name,
    agent_name=current_agent,
    message=f"❌ Error: {str(error)[:100]}",
    data={"error": str(error)}
)
```

**10. Business Complete**
```python
# When: Entire business generation finishes
self.event_emitter.emit(
    event_type="business_complete",
    business_name=result.business_name,
    agent_name="Genesis",
    message=f"🎉 {result.business_name} complete!",
    data={
        "success": result.success,
        "components": result.components_generated,
        "time": result.generation_time_seconds
    }
)
```

---

## Dashboard Features

### Real-Time Event Feed
- See every event as it happens
- Color-coded by type (success = green, error = red)
- Timestamp for each event

### Agent Status
- Shows all 25 agents
- Active/Idle status
- Last activity time

### Business Portfolio
- All generated businesses
- Status: Live, Building, Failed
- Links to GitHub and live sites

### Live Stats
- Active businesses count
- Total revenue/costs/profit
- Events in last 24 hours

---

## For Production (VPS Deployment)

Your VPS coder can follow the detailed instructions you provided to:

1. Set up Nginx reverse proxy
2. Point speechhub.app domain to VPS IP
3. Get SSL certificate with Certbot
4. Access dashboard at https://speechhub.app

---

## Files Locations

```
genesis-rebuild/
├── infrastructure/
│   └── event_emitter.py          # Event emission system
├── dashboard/
│   ├── api.py                     # FastAPI backend
│   ├── static/
│   │   └── index.html            # Beautiful dashboard UI
│   └── genesis_events.db          # SQLite database (auto-created)
└── DASHBOARD_SETUP_COMPLETE.md   # Full integration docs
```

---

## Next Steps

1. **Install & Run** (already done above)
2. **Send test event** (already done above)
3. **Integrate with Genesis** (add emission points from Step 3)
4. **Deploy to VPS** (optional - follow original instructions)

---

**Dashboard is ready! 🎉**
Start Genesis and watch your empire grow in real-time at http://localhost:8000
