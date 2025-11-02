# Genesis Agent Dashboard

Professional monitoring UI for all Phase 1-6 systems using Next.js, TypeScript, Tailwind CSS, and shadcn/ui.

## Features

- **6 Core Views:**
  - Agent Overview (15 agents status)
  - OTEL Traces Viewer
  - HALO Router Analytics
  - CaseBank Performance
  - Cost Dashboard
  - Error Logs Viewer

- **Real-time Updates:** <5s refresh interval
- **Data Integration:** Prometheus metrics, OTEL traces, CaseBank statistics

## Getting Started

```bash
cd public_demo/dashboard
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Configuration

Environment variables:
- `NEXT_PUBLIC_GENESIS_DASHBOARD_API` (default `/dashboard-api`) – base path for the FastAPI backend
- `DASHBOARD_API_ORIGIN` – target origin for Next.js rewrites (default `http://localhost:8080`)
- `PROMETHEUS_ORIGIN` – Prometheus endpoint (default `http://localhost:9090`)
- `OTEL_ORIGIN` – OTEL collector endpoint (default `http://localhost:4318`)
- `LOG_AGGREGATOR_ORIGIN` – optional log aggregation service (default `http://localhost:8081`)

The dashboard connects to:
- Prometheus (model cost metrics)
- OTEL traces
- CaseBank statistics via the FastAPI backend

## Deployment

```bash
npm run build
npm start
```

## Documentation

Screenshots and validation documentation in `docs/validation/dashboard/`

