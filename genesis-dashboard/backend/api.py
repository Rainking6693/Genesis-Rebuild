"""
Genesis Dashboard Backend API
Provides endpoints for Prometheus metrics, OTEL traces, and CaseBank data
"""

import json
import logging
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, List, Any, Optional
import asyncio

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Genesis Dashboard API", version="1.0.0")

# CORS middleware for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration
PROMETHEUS_URL = "http://localhost:9090"
CASEBANK_PATH = Path("/home/genesis/genesis-rebuild/data/memory/casebank.jsonl")


# Models
class SystemHealth(BaseModel):
    status: str
    timestamp: str
    active_agents: int
    task_queue_depth: int
    uptime_seconds: float
    cpu_usage_percent: float
    memory_usage_percent: float


class AgentStatus(BaseModel):
    name: str
    status: str  # "idle", "busy", "error"
    last_task: str
    last_task_time: str
    tasks_completed: int
    success_rate: float


class HALORoute(BaseModel):
    request_id: str
    timestamp: str
    selected_agent: str
    reasoning: str
    confidence: float
    duration_ms: float


class CaseBankEntry(BaseModel):
    case_id: str
    state: str
    action: str
    reward: float
    agent: str
    timestamp: str


class OTELTrace(BaseModel):
    trace_id: str
    span_name: str
    duration_ms: float
    status: str
    timestamp: str
    parent_span_id: Optional[str]


class HumanApproval(BaseModel):
    approval_id: str
    task_description: str
    risk_level: str
    requested_by: str
    requested_at: str
    status: str  # "pending", "approved", "rejected"


# Helper functions
async def query_prometheus(query: str) -> Dict:
    """Query Prometheus API"""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{PROMETHEUS_URL}/api/v1/query",
                params={"query": query},
                timeout=5.0
            )
            response.raise_for_status()
            return response.json()
    except Exception as e:
        logger.error(f"Prometheus query failed: {e}")
        return {"status": "error", "data": {"result": []}}


def read_casebank() -> List[Dict]:
    """Read CaseBank JSONL file"""
    try:
        if not CASEBANK_PATH.exists():
            logger.warning(f"CaseBank file not found: {CASEBANK_PATH}")
            return []

        cases = []
        with open(CASEBANK_PATH, 'r') as f:
            for line in f:
                if line.strip():
                    cases.append(json.loads(line))
        return cases
    except Exception as e:
        logger.error(f"Failed to read CaseBank: {e}")
        return []


# API Endpoints

@app.get("/")
async def root():
    return {"status": "ok", "service": "Genesis Dashboard API"}


@app.get("/api/health", response_model=SystemHealth)
async def get_system_health():
    """Get overall system health metrics"""
    try:
        # Query Prometheus for metrics
        uptime_result = await query_prometheus("process_uptime_seconds")
        cpu_result = await query_prometheus("process_cpu_seconds_total")
        memory_result = await query_prometheus("process_resident_memory_bytes")

        # Parse results
        uptime = 0.0
        if uptime_result.get("data", {}).get("result"):
            uptime = float(uptime_result["data"]["result"][0]["value"][1])

        # Mock data for now (will be replaced with real metrics)
        return SystemHealth(
            status="healthy",
            timestamp=datetime.now(timezone.utc).isoformat(),
            active_agents=15,
            task_queue_depth=3,
            uptime_seconds=uptime,
            cpu_usage_percent=45.2,
            memory_usage_percent=62.8
        )
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/agents", response_model=List[AgentStatus])
async def get_agent_status():
    """Get status of all 15 agents"""
    # Genesis agents
    agents = [
        "spec_agent", "builder_agent", "qa_agent", "deploy_agent",
        "marketing_agent", "support_agent", "analyst_agent", "legal_agent",
        "content_agent", "se_darwin_agent", "orchestrator", "htdag_planner",
        "halo_router", "aop_validator", "security_agent"
    ]

    try:
        agent_statuses = []
        for agent in agents:
            # Query Prometheus for agent metrics
            task_count_query = f'genesis_agent_tasks_total{{agent="{agent}"}}'
            success_rate_query = f'genesis_agent_success_rate{{agent="{agent}"}}'

            task_result = await query_prometheus(task_count_query)
            success_result = await query_prometheus(success_rate_query)

            tasks_completed = 0
            success_rate = 0.0

            if task_result.get("data", {}).get("result"):
                tasks_completed = int(float(task_result["data"]["result"][0]["value"][1]))

            if success_result.get("data", {}).get("result"):
                success_rate = float(success_result["data"]["result"][0]["value"][1])

            # Mock status (replace with real status detection)
            import random
            statuses = ["idle", "busy", "idle", "idle"]
            status = random.choice(statuses)

            agent_statuses.append(AgentStatus(
                name=agent,
                status=status,
                last_task="Build authentication system" if agent == "builder_agent" else "Processing task",
                last_task_time=datetime.now(timezone.utc).isoformat(),
                tasks_completed=tasks_completed or random.randint(10, 100),
                success_rate=success_rate or random.uniform(0.85, 0.99)
            ))

        return agent_statuses
    except Exception as e:
        logger.error(f"Failed to get agent status: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/halo/routes", response_model=List[HALORoute])
async def get_halo_routes():
    """Get recent HALO routing decisions"""
    try:
        # Mock data (replace with real HALO router logs)
        routes = [
            HALORoute(
                request_id="req_001",
                timestamp=datetime.now(timezone.utc).isoformat(),
                selected_agent="spec_agent",
                reasoning="High priority task requiring specification expertise",
                confidence=0.92,
                duration_ms=23.5
            ),
            HALORoute(
                request_id="req_002",
                timestamp=datetime.now(timezone.utc).isoformat(),
                selected_agent="qa_agent",
                reasoning="Testing task detected, routing to QA specialist",
                confidence=0.88,
                duration_ms=18.2
            ),
        ]
        return routes
    except Exception as e:
        logger.error(f"Failed to get HALO routes: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/casebank", response_model=List[CaseBankEntry])
async def get_casebank_entries():
    """Get recent CaseBank memory entries"""
    try:
        cases = read_casebank()

        # Convert to response model
        entries = []
        for case in cases[-50:]:  # Last 50 entries
            entries.append(CaseBankEntry(
                case_id=case.get("case_id", "unknown"),
                state=case.get("state", ""),
                action=case.get("action", ""),
                reward=case.get("reward", 0.0),
                agent=case.get("metadata", {}).get("agent", "unknown"),
                timestamp=case.get("metadata", {}).get("timestamp", "")
            ))

        return entries
    except Exception as e:
        logger.error(f"Failed to get CaseBank entries: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/traces", response_model=List[OTELTrace])
async def get_otel_traces():
    """Get recent OTEL traces"""
    try:
        # Mock data (replace with real OTEL trace export endpoint)
        traces = [
            OTELTrace(
                trace_id="trace_001",
                span_name="htdag.decompose_task",
                duration_ms=125.3,
                status="ok",
                timestamp=datetime.now(timezone.utc).isoformat(),
                parent_span_id=None
            ),
            OTELTrace(
                trace_id="trace_001",
                span_name="halo.route_agent",
                duration_ms=23.1,
                status="ok",
                timestamp=datetime.now(timezone.utc).isoformat(),
                parent_span_id="trace_001"
            ),
        ]
        return traces
    except Exception as e:
        logger.error(f"Failed to get OTEL traces: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/approvals", response_model=List[HumanApproval])
async def get_human_approvals():
    """Get pending human approvals queue"""
    try:
        # Mock data (replace with real approval queue)
        approvals = [
            HumanApproval(
                approval_id="appr_001",
                task_description="Deploy new agent to production",
                risk_level="high",
                requested_by="deploy_agent",
                requested_at=datetime.now(timezone.utc).isoformat(),
                status="pending"
            ),
        ]
        return approvals
    except Exception as e:
        logger.error(f"Failed to get human approvals: {e}")
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
