# Genesis Dashboard

Real-time monitoring dashboard for the Genesis AI system. Built with Next.js, TypeScript, Tailwind CSS, and FastAPI.

## Features

### 6 Core Monitoring Views

1. **Overview Dashboard** - System health, active agents, task queue depth, resource usage
2. **Agent Status Grid** - Real-time status of all 15 Genesis agents with completion metrics
3. **HALO Routes** - Active routing decisions with explainability and confidence scores
4. **CaseBank Memory** - Recent memory entries with success rate trends
5. **OTEL Traces** - Distributed tracing visualization for performance monitoring
6. **Human Approvals** - Pending high-risk operations requiring manual approval

### Real-time Updates

- 5-second polling for live data
- Automatic refresh across all views
- No page reload required

### Data Sources

- **Prometheus**: http://localhost:9090 (system metrics)
- **CaseBank**: data/memory/casebank.jsonl (memory store)
- **OTEL Traces**: infrastructure/observability.py (trace export)

## Architecture

```
genesis-dashboard/
├── src/
│   ├── app/              # Next.js app directory
│   │   ├── layout.tsx    # Root layout
│   │   ├── page.tsx      # Main dashboard page
│   │   └── globals.css   # Global styles
│   └── components/       # React components
│       ├── Sidebar.tsx
│       ├── OverviewDashboard.tsx
│       ├── AgentStatusGrid.tsx
│       ├── HALORoutes.tsx
│       ├── CaseBankMemory.tsx
│       ├── OTELTraces.tsx
│       └── HumanApprovals.tsx
├── backend/
│   ├── api.py            # FastAPI backend
│   └── requirements.txt  # Python dependencies
├── start-backend.sh      # Backend startup script
└── start-frontend.sh     # Frontend startup script
```

## Installation

### Prerequisites

- Node.js 18+ and npm
- Python 3.12+
- Running Genesis system (for live data)

### Frontend Setup

```bash
cd genesis-dashboard
npm install
```

### Backend Setup

```bash
cd genesis-dashboard/backend
pip install -r requirements.txt
```

## Running the Dashboard

### Option 1: Manual Start (Two Terminals)

**Terminal 1 - Backend:**
```bash
cd genesis-dashboard
./start-backend.sh
# Backend API runs on http://localhost:8000
```

**Terminal 2 - Frontend:**
```bash
cd genesis-dashboard
./start-frontend.sh
# Frontend runs on http://localhost:3000
```

### Option 2: Background Processes

```bash
cd genesis-dashboard
./start-backend.sh &
./start-frontend.sh
```

### Access the Dashboard

Open your browser to: **http://localhost:3000**

## API Endpoints

The backend provides the following REST API endpoints:

- `GET /api/health` - System health metrics
- `GET /api/agents` - Status of all 15 agents
- `GET /api/halo/routes` - Recent HALO routing decisions
- `GET /api/casebank` - CaseBank memory entries
- `GET /api/traces` - OTEL distributed traces
- `GET /api/approvals` - Pending human approvals

## Data Integration

### Prometheus Metrics

The dashboard queries Prometheus for:
- `process_uptime_seconds` - System uptime
- `process_cpu_seconds_total` - CPU usage
- `process_resident_memory_bytes` - Memory usage
- `genesis_agent_tasks_total{agent="..."}` - Agent task counts
- `genesis_agent_success_rate{agent="..."}` - Agent success rates

### CaseBank JSONL

Reads from: `/home/genesis/genesis-rebuild/data/memory/casebank.jsonl`

Format:
```json
{
  "case_id": "abc123",
  "state": "Build authentication system",
  "action": "Best trajectory: ...",
  "reward": 0.9,
  "metadata": {
    "agent": "builder_agent",
    "timestamp": "2025-10-25T13:57:04.035081+00:00"
  }
}
```

### OTEL Traces

Integration point: `infrastructure/observability.py`

The dashboard expects trace data with:
- `trace_id` - Unique trace identifier
- `span_name` - Operation name (e.g., "htdag.decompose_task")
- `duration_ms` - Execution time in milliseconds
- `status` - "ok" or "error"
- `parent_span_id` - For nested spans

## Development

### Adding New Views

1. Create component in `src/components/YourView.tsx`
2. Add API endpoint in `backend/api.py`
3. Register in `src/app/page.tsx` switch statement
4. Add to sidebar in `src/components/Sidebar.tsx`

### Customizing Refresh Rate

Edit the `setInterval` duration in each component (default: 5000ms):

```typescript
const interval = setInterval(fetchData, 5000) // Change 5000 to desired ms
```

### Styling

Uses Tailwind CSS with shadcn/ui design system. Color variables defined in `src/app/globals.css`.

## Troubleshooting

### Backend Won't Start

- Ensure port 8000 is available: `lsof -i :8000`
- Check Python dependencies: `pip list | grep fastapi`
- Verify CaseBank file exists: `ls /home/genesis/genesis-rebuild/data/memory/casebank.jsonl`

### Frontend Won't Start

- Ensure port 3000 is available: `lsof -i :3000`
- Check npm dependencies: `npm list`
- Clear Next.js cache: `rm -rf .next`

### No Data Showing

- Verify backend is running: `curl http://localhost:8000/api/health`
- Check Prometheus connectivity: `curl http://localhost:9090/api/v1/query?query=up`
- Inspect browser console for CORS errors (F12 → Console)

### CORS Errors

The backend is configured to allow CORS from `http://localhost:3000`. If running on a different port, update `backend/api.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:YOUR_PORT"],  # Update this
    ...
)
```

## Production Deployment

### Build Frontend

```bash
npm run build
npm run start  # Runs optimized production build
```

### Run Backend with Gunicorn

```bash
pip install gunicorn
gunicorn backend.api:app --workers 4 --bind 0.0.0.0:8000
```

### Environment Variables

Create `.env` file:

```env
PROMETHEUS_URL=http://localhost:9090
CASEBANK_PATH=/path/to/casebank.jsonl
```

## Performance

- Frontend bundle: ~500KB gzipped
- Backend memory: ~50MB
- API response time: <100ms average
- Real-time polling overhead: <1% CPU

## Testing

### Manual Testing Checklist

- [ ] All 6 views load without errors
- [ ] Data refreshes every 5 seconds
- [ ] Agent status colors update correctly
- [ ] Tables display all columns
- [ ] Responsive design works on mobile/tablet
- [ ] API endpoints return valid JSON
- [ ] No console errors in browser (F12)

### API Testing

```bash
# Test health endpoint
curl http://localhost:8000/api/health

# Test agents endpoint
curl http://localhost:8000/api/agents

# Test casebank endpoint
curl http://localhost:8000/api/casebank
```

## License

Internal Genesis system monitoring tool. Not for public distribution.

## Support

For issues or questions, contact:
- Alex (E2E Testing Lead)
- Hudson (Code Review)
- Cora (Architecture Review)
