# Genesis Dashboard - Setup Complete! 🎉

## Files Created

✅ `infrastructure/event_emitter.py` - Event emission system
✅ `dashboard/api.py` - FastAPI backend
✅ `dashboard/static/index.html` - Beautiful frontend

## Next Steps

### 1. Install Dependencies
```bash
pip install fastapi uvicorn requests
```

### 2. Start Dashboard API
```bash
cd dashboard
python3 api.py &
```

Expected: Server runs on http://localhost:8000

### 3. Add Event Emitter to Genesis Meta Agent

Add this import to `infrastructure/genesis_meta_agent.py` (around line 30):
```python
from infrastructure.event_emitter import GenesisEventEmitter
```

Add this to `__init__` method (around line 580, after router initialization):
```python
# Dashboard Integration
self.event_emitter = GenesisEventEmitter(
    api_url=os.getenv("DASHBOARD_API_URL", "http://localhost:8000")
)
logger.info("✅ Dashboard event emitter initialized")
```

### 4. Add Event Emissions

Throughout Genesis Meta Agent, add emissions at key points:

**Example - Business started:**
```python
# After: logger.info(f"Starting business generation: {spec.name}")
self.event_emitter.emit(
    event_type="business_generation_started",
    business_name=spec.name,
    agent_name="Genesis",
    message=f"🎯 Starting {spec.name}",
    data={"type": spec.business_type}
)
```

**Example - Deployment complete:**
```python
# After successful deployment
self.event_emitter.emit(
    event_type="deployment_complete",
    business_name=spec.name,
    agent_name="Deploy Agent",
    message=f"✅ {spec.name} deployed!",
    data={
        "url": deployment_url,
        "github": github_url
    }
)
```

### 5. Test It!

```bash
# Send a test event
python3 -c "
from infrastructure.event_emitter import GenesisEventEmitter
emitter = GenesisEventEmitter()
emitter.emit('test', {}, message='🧪 Dashboard test!')
"

# Check it arrived
curl http://localhost:8000/events/recent
```

### 6. Open Dashboard

Visit: http://localhost:8000

You should see your test event!

## Key Event Types to Emit

1. `business_generation_started` - When business generation begins
2. `agent_started` - When any agent starts work
3. `agent_completed` - When agent finishes
4. `deployment_started` - Deployment begins
5. `deployment_complete` - Deployment succeeds
6. `deployment_failed` - Deployment fails
7. `error` - Any error occurs
8. `cost_tracked` - Cost incurred

## For Full Integration

See the complete list of 20 strategic emission points in the instructions provided.
Each should follow this pattern:

```python
self.event_emitter.emit(
    event_type="event_name",
    business_name=current_business,
    agent_name="Agent Name",
    message="Human readable message",
    data={"any": "extra", "data": "here"}
)
```

## Production Deployment (Optional)

To serve on speechhub.app:
1. Set up Nginx reverse proxy to port 8000
2. Configure DNS A record to your VPS IP
3. Get SSL certificate with Certbot
4. Done!

---

**Dashboard is ready to track your Genesis empire! 🚀**
