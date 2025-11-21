"""
Genesis Dashboard Backend - Simple FastAPI App
Fallback if genesis_dashboard.backend.api is not available
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from typing import Dict, Any, List
import os

app = FastAPI(
    title="Genesis Rebuild Dashboard",
    version="1.0.0",
    description="Genesis Agent Dashboard API"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {
        "service": "genesis-rebuild",
        "status": "running",
        "version": "1.0.0",
        "timestamp": datetime.utcnow().isoformat(),
        "message": "Genesis Rebuild Dashboard API"
    }

@app.get("/api/health")
async def health():
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "version": "1.0.0",
        "agents_active": 0,
        "tasks_queued": 0,
        "environment": os.getenv("ENVIRONMENT", "production")
    }

@app.get("/api/agents")
async def agents():
    return {
        "agents": [],
        "total": 0,
        "active": 0,
        "status": "operational"
    }

@app.get("/api/status")
async def status():
    return {
        "status": "operational",
        "uptime": "0s",
        "environment": os.getenv("ENVIRONMENT", "production"),
        "genesis_env": os.getenv("GENESIS_ENV", "production")
    }

# Additional endpoints for compatibility
@app.get("/api/halo/routes")
async def halo_routes():
    return {
        "routes": [],
        "total": 0
    }

@app.get("/api/casebank")
async def casebank():
    return {
        "entries": [],
        "total": 0
    }

@app.get("/api/traces")
async def traces():
    return {
        "traces": [],
        "total": 0
    }

@app.get("/api/approvals")
async def approvals():
    return {
        "approvals": [],
        "pending": 0
    }

@app.get("/api/revenue/metrics")
async def revenue_metrics():
    return {
        "revenue": 0,
        "businesses": 0,
        "period": "all_time"
    }

@app.get("/api/revenue/analytics")
async def revenue_analytics():
    return {
        "analytics": {},
        "period": "all_time"
    }


