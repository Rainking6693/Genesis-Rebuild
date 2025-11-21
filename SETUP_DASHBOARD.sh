#!/bin/bash
# Genesis Dashboard Complete Setup Script
# Run this to set up the full dashboard system

echo "🚀 Setting up Genesis Dashboard..."

# Create dashboard frontend HTML
cat > dashboard/static/index.html << 'HTMLEOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Genesis Mission Control</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #0a0e1a; color: #e0e0e0; font-family: 'SF Mono', monospace; line-height: 1.6; }
        .container { max-width: 1400px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; padding: 30px; margin-bottom: 30px; box-shadow: 0 10px 40px rgba(102, 126, 234, 0.3); }
        .header h1 { font-size: 2.5em; font-weight: 700; margin-bottom: 15px; }
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-top: 20px; }
        .stat-card { background: rgba(255, 255, 255, 0.1); border-radius: 8px; padding: 15px; border: 1px solid rgba(255, 255, 255, 0.2); }
        .stat-card .label { font-size: 0.9em; opacity: 0.8; margin-bottom: 5px; }
        .stat-card .value { font-size: 2em; font-weight: 700; }
        .section { background: #1a1e2e; border-radius: 12px; padding: 25px; margin-bottom: 25px; border: 1px solid #2a2e3e; }
        .section-title { font-size: 1.5em; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 2px solid #667eea; }
        .event-feed { max-height: 600px; overflow-y: auto; }
        .event { background: #252936; border-left: 4px solid #00ff00; padding: 15px; margin-bottom: 10px; border-radius: 6px; transition: all 0.3s ease; }
        .event:hover { background: #2a2f3e; transform: translateX(5px); }
        .event.error { border-left-color: #ff4444; }
        .event .timestamp { color: #888; font-size: 0.85em; margin-bottom: 5px; }
        .event .agent-name { color: #667eea; font-weight: 600; margin-right: 10px; }
        .agents-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 15px; }
        .agent-card { background: #252936; border-radius: 8px; padding: 15px; border: 2px solid #2a2e3e; transition: all 0.3s ease; }
        .agent-card.active { border-color: #00ff00; box-shadow: 0 0 20px rgba(0, 255, 0, 0.2); }
        .agent-card .name { font-weight: 600; margin-bottom: 8px; }
        .agent-card .status { font-size: 0.85em; padding: 4px 8px; border-radius: 4px; display: inline-block; }
        .agent-card .status.active { background: rgba(0, 255, 0, 0.2); color: #00ff00; }
        .agent-card .status.idle { background: rgba(136, 136, 136, 0.2); color: #888; }
        .businesses-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
        .business-card { background: #252936; border-radius: 8px; padding: 20px; border: 2px solid #2a2e3e; }
        .business-card.live { border-color: #00ff00; }
        .business-card.building { border-color: #ffaa00; }
        .business-card .name { font-size: 1.3em; font-weight: 600; margin-bottom: 10px; }
        .business-card .status-badge { padding: 4px 12px; border-radius: 4px; font-size: 0.85em; display: inline-block; margin-bottom: 15px; }
        .business-card .status-badge.live { background: rgba(0, 255, 0, 0.2); color: #00ff00; }
        .business-card .status-badge.building { background: rgba(255, 170, 0, 0.2); color: #ffaa00; }
        .business-card .link { display: block; color: #667eea; text-decoration: none; margin: 5px 0; }
        .loading { text-align: center; padding: 40px; color: #888; }
        ::-webkit-scrollbar { width: 10px; }
        ::-webkit-scrollbar-track { background: #1a1e2e; }
        ::-webkit-scrollbar-thumb { background: #667eea; border-radius: 5px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 GENESIS MISSION CONTROL</h1>
            <div class="stats-grid">
                <div class="stat-card"><div class="label">Active Businesses</div><div class="value" id="stat-active">0</div></div>
                <div class="stat-card"><div class="label">Total Revenue</div><div class="value" id="stat-revenue">$0</div></div>
                <div class="stat-card"><div class="label">Total Costs</div><div class="value" id="stat-costs">$0</div></div>
                <div class="stat-card"><div class="label">Net Profit</div><div class="value" id="stat-profit">$0</div></div>
                <div class="stat-card"><div class="label">Events (24h)</div><div class="value" id="stat-events">0</div></div>
            </div>
        </div>
        <div class="section">
            <h2 class="section-title">🤖 Agent Status</h2>
            <div id="agents-container" class="agents-grid"><div class="loading">Loading agents...</div></div>
        </div>
        <div class="section">
            <h2 class="section-title">🏢 Business Portfolio</h2>
            <div id="businesses-container" class="businesses-grid"><div class="loading">Loading businesses...</div></div>
        </div>
        <div class="section">
            <h2 class="section-title">📡 Live Event Feed</h2>
            <div id="event-feed" class="event-feed"><div class="loading">Waiting for events...</div></div>
        </div>
    </div>
    <script>
        const API_URL = window.location.origin;
        function formatTime(isoString) { const date = new Date(isoString); return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }); }
        function timeAgo(isoString) { const date = new Date(isoString); const seconds = Math.floor((new Date() - date) / 1000); if (seconds < 60) return `${seconds}s ago`; if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`; if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`; return `${Math.floor(seconds / 86400)}d ago`; }
        async function updateStats() { try { const response = await fetch(`${API_URL}/stats`); const data = await response.json(); document.getElementById('stat-active').textContent = data.businesses.live; document.getElementById('stat-revenue').textContent = `${data.revenue.toFixed(2)}`; document.getElementById('stat-costs').textContent = `${data.costs.toFixed(2)}`; document.getElementById('stat-profit').textContent = `${data.profit.toFixed(2)}`; document.getElementById('stat-events').textContent = data.events_24h; } catch (error) { console.error('Failed to update stats:', error); } }
        async function updateAgents() { try { const response = await fetch(`${API_URL}/agents/status`); const agents = await response.json(); const container = document.getElementById('agents-container'); if (agents.length === 0) { container.innerHTML = '<div class="loading">No agent activity yet</div>'; return; } container.innerHTML = agents.map(agent => `<div class="agent-card ${agent.status}"><div class="name">${agent.name}</div><div class="status ${agent.status}">${agent.status}</div><div class="last-active">${timeAgo(agent.last_active)}</div></div>`).join(''); } catch (error) { console.error('Failed to update agents:', error); } }
        async function updateBusinesses() { try { const response = await fetch(`${API_URL}/businesses`); const businesses = await response.json(); const container = document.getElementById('businesses-container'); if (businesses.length === 0) { container.innerHTML = '<div class="loading">No businesses created yet</div>'; return; } container.innerHTML = businesses.map(biz => `<div class="business-card ${biz.status}"><div class="name">${biz.name}</div><div class="status-badge ${biz.status}">${biz.status.toUpperCase()}</div>${biz.deployment_url ? `<a href="${biz.deployment_url}" target="_blank" class="link">🌐 View Live Site</a>` : ''}${biz.github_url ? `<a href="${biz.github_url}" target="_blank" class="link">📦 GitHub Repo</a>` : ''}<div style="margin-top: 10px; font-size: 0.85em; color: #888;">Created: ${timeAgo(biz.created_at)}</div></div>`).join(''); } catch (error) { console.error('Failed to update businesses:', error); } }
        async function updateEvents() { try { const response = await fetch(`${API_URL}/events/recent?limit=50`); const events = await response.json(); const container = document.getElementById('event-feed'); if (events.length === 0) { container.innerHTML = '<div class="loading">Waiting for events...</div>'; return; } container.innerHTML = events.map(event => { let className = 'event'; if (event.type.includes('error') || event.type.includes('failed')) className += ' error'; return `<div class="${className}"><div class="timestamp">${formatTime(event.timestamp)}</div>${event.agent_name ? `<span class="agent-name">${event.agent_name}:</span>` : ''}<span class="message">${event.message || event.type}</span></div>`; }).join(''); } catch (error) { console.error('Failed to update events:', error); } }
        function updateAll() { updateStats(); updateAgents(); updateBusinesses(); updateEvents(); }
        updateAll(); setInterval(updateAll, 5000);
    </script>
</body>
</html>
HTMLEOF

echo "✅ Dashboard frontend created"

# Create simple integration instructions
cat > DASHBOARD_SETUP_COMPLETE.md << 'MDEOF'
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
MDEOF

echo "✅ Setup instructions created"
echo ""
echo "========================================"
echo "🎉 Genesis Dashboard Setup Complete!"
echo "========================================"
echo ""
echo "Next steps:"
echo "1. pip install fastapi uvicorn requests"
echo "2. cd dashboard && python3 api.py &"
echo "3. Open http://localhost:8000"
echo "4. See DASHBOARD_SETUP_COMPLETE.md for integration"
echo ""
echo "Dashboard files created:"
echo "  ✅ infrastructure/event_emitter.py"
echo "  ✅ dashboard/api.py"
echo "  ✅ dashboard/static/index.html"
echo "  ✅ DASHBOARD_SETUP_COMPLETE.md"
echo ""
