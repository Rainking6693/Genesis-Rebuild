"""
Genesis Dashboard Backend API
Provides endpoints for Prometheus metrics, OTEL traces, and CaseBank data
"""

import asyncio
import json
import logging
import os
import secrets
import time
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional

from fastapi import Depends, FastAPI, HTTPException, Header, Request, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, ValidationError
import httpx

# Genesis memory infrastructure
import sys
sys.path.insert(0, str(Path(__file__).resolve().parents[2]))
from scripts.analyze_memory_patterns import MemoryAnalytics
from infrastructure.langgraph_store import get_store

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Genesis Dashboard API", version="1.0.0")

ENVIRONMENT = os.getenv("ENVIRONMENT", "development").lower()
if ENVIRONMENT == "production":
    allowed_origins = [
        os.getenv("DASHBOARD_PRIMARY_ORIGIN", "https://dashboard.genesis.local"),
    ]
    allow_credentials = False
    allow_methods = ["GET", "POST"]
    allow_headers = ["Content-Type", "Authorization"]
elif ENVIRONMENT == "staging":
    allowed_origins = [
        os.getenv("DASHBOARD_STAGING_ORIGIN", "https://staging-dashboard.genesis.local"),
    ]
    allow_credentials = False
    allow_methods = ["GET", "POST"]
    allow_headers = ["Content-Type", "Authorization"]
else:
    allowed_origins = ["http://localhost:3000", "http://127.0.0.1:3000"]
    allow_credentials = True
    allow_methods = ["*"]
    allow_headers = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=allow_credentials,
    allow_methods=allow_methods,
    allow_headers=allow_headers,
)


@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers.setdefault(
        "Content-Security-Policy",
        "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self';",
    )
    response.headers.setdefault("Strict-Transport-Security", "max-age=63072000; includeSubDomains")
    response.headers.setdefault("X-Content-Type-Options", "nosniff")
    response.headers.setdefault("X-Frame-Options", "DENY")
    return response

# Configuration
PROMETHEUS_URL = "http://localhost:9090"
CASEBANK_PATH = Path("/home/genesis/genesis-rebuild/data/memory/casebank.jsonl")
REPO_ROOT = Path(__file__).resolve().parents[2]
SWARM_METRICS_PATH = REPO_ROOT / "public_demo/dashboard/public/swarm_metrics.json"

SWARM_METRICS_API_TOKEN = os.getenv("SWARM_METRICS_API_TOKEN")
SWARM_METRICS_RATE_LIMIT = int(os.getenv("SWARM_METRICS_RATE_LIMIT", "10"))
SWARM_METRICS_RATE_WINDOW = int(os.getenv("SWARM_METRICS_RATE_WINDOW", "60"))
_swarm_metrics_requests: Dict[str, List[float]] = defaultdict(list)


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


class SwarmMetrics(BaseModel):
    generated_at: str
    summary: Dict[str, float]
    generations: List[Dict[str, Any]]
    top_teams: List[Dict[str, Any]]
    cooperation_matrix: Dict[str, Dict[str, float]]
    active_teams: List[Dict[str, Any]]
    emergent_strategies: List[str]


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


def read_swarm_metrics() -> Dict[str, Any]:
    """Load swarm performance metrics produced by the analytics pipeline."""
    if not SWARM_METRICS_PATH.exists():
        raise FileNotFoundError("Swarm metrics are not available")

    try:
        with SWARM_METRICS_PATH.open("r", encoding="utf-8") as handle:
            return json.load(handle)
    except json.JSONDecodeError as exc:
        raise ValueError("Swarm metrics file is malformed") from exc


def _enforce_swarm_metrics_rate_limit(client_ip: str) -> None:
    now = time.time()
    window = SWARM_METRICS_RATE_WINDOW
    timestamps = _swarm_metrics_requests[client_ip]
    _swarm_metrics_requests[client_ip] = [ts for ts in timestamps if now - ts < window]

    if len(_swarm_metrics_requests[client_ip]) >= SWARM_METRICS_RATE_LIMIT:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Rate limit exceeded for swarm metrics endpoint",
        )

    _swarm_metrics_requests[client_ip].append(now)


async def verify_swarm_metrics_access(
    request: Request,
    authorization: str = Header(None)
) -> None:
    if not SWARM_METRICS_API_TOKEN:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Swarm metrics token not configured",
        )

    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid Authorization header",
        )

    token = authorization[7:]
    if not secrets.compare_digest(token, SWARM_METRICS_API_TOKEN):
        logger.warning("Unauthorized attempt to access swarm metrics endpoint")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid API token",
        )

    client_ip = request.client.host if request.client else "unknown"
    _enforce_swarm_metrics_rate_limit(client_ip)


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


@app.get("/api/swarm/metrics", response_model=SwarmMetrics)
async def get_swarm_metrics(
    _: None = Depends(verify_swarm_metrics_access)
):
    """Expose swarm optimisation metrics for the dashboard."""
    try:
        raw = read_swarm_metrics()
        return SwarmMetrics.parse_obj(raw)
    except FileNotFoundError as exc:
        logger.warning(str(exc))
        raise HTTPException(
            status_code=404,
            detail="Swarm metrics are not currently available",
        )
    except ValidationError as exc:
        logger.error(f"Invalid swarm metrics payload: {exc}")
        raise HTTPException(status_code=500, detail="Swarm metrics file is invalid.")
    except Exception as exc:  # pragma: no cover - defensive
        logger.error(f"Failed to load swarm metrics: {exc}")
        raise HTTPException(status_code=500, detail=str(exc))


async def verify_memory_analytics_access(
    request: Request,
    authorization: str = Header(None)
) -> None:
    """Verify API token for memory analytics endpoint (P1 security fix)."""
    # Development mode: allow access without token
    if ENVIRONMENT == "development":
        return

    api_token = os.getenv("MEMORY_ANALYTICS_API_TOKEN")

    if not api_token:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Memory analytics authentication not configured",
        )

    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid Authorization header",
        )

    token = authorization[7:]
    if not secrets.compare_digest(token, api_token):
        logger.warning("Unauthorized attempt to access memory analytics endpoint")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid API token",
        )


@app.get("/api/memory/analytics")
async def get_memory_analytics(
    _: None = Depends(verify_memory_analytics_access)
):
    """
    Get comprehensive memory analytics data for dashboard visualization.

    Returns knowledge graph nodes/edges, metrics, top patterns, and community clusters.

    Via Context7 MCP: NetworkX community detection + React Flow graph visualization
    Research sources documented in scripts/analyze_memory_patterns.py

    Security: Requires Bearer token authentication (development mode bypassed)

    Returns:
        Dict with:
        - nodes: List of memory nodes (agents, businesses, patterns, consensus)
        - edges: List of relationships (learning, usage, evolution)
        - metrics: Storage, retrieval frequency, cost savings, TTL predictions
        - topPatterns: Most-retrieved patterns with effectiveness scores
        - communities: Graph clusters from Louvain algorithm
    """
    try:
        logger.info("Fetching memory analytics data...")

        # Initialize memory store and analytics
        store = get_store()
        analytics = MemoryAnalytics(store)

        # Build knowledge graph
        graph = await analytics.build_knowledge_graph()

        # Transform NetworkX graph to React Flow format
        nodes = []
        for node_id, node_data in graph.nodes(data=True):
            nodes.append({
                "id": node_id,
                "type": node_data.get("type", "unknown"),
                "label": node_id.replace("_", " ").title(),
                "data": {
                    "namespace": node_data.get("namespace", []),
                    "createdAt": datetime.now(timezone.utc).isoformat(),
                    "usageCount": node_data.get("entry_count", 0),
                    "score": 0.8,  # Default score
                }
            })

        edges = []
        for source, target, edge_data in graph.edges(data=True):
            edges.append({
                "id": f"{source}_{target}",
                "source": source,
                "target": target,
                "label": edge_data.get("relationship", "related"),
                "weight": 1.0,
                "type": edge_data.get("relationship", "usage"),
            })

        # Get analytics metrics
        top_patterns = await analytics.get_most_retrieved_patterns(20)
        communities = analytics.detect_communities(graph)
        cost_savings = await analytics.calculate_cost_savings()
        ttl_predictions = await analytics.predict_ttl_status()

        # Get namespace summary for storage metrics
        summary = await analytics.router.get_namespace_summary()
        storage_by_namespace = dict(summary["by_type"])

        # Build retrieval frequency map
        retrieval_frequency = {
            f"{p.namespace[-1]}_{p.key}": p.retrieval_count
            for p in top_patterns[:10]
        }

        # Format response
        response = {
            "nodes": nodes,
            "edges": edges,
            "metrics": {
                "storageByNamespace": storage_by_namespace,
                "retrievalFrequency": retrieval_frequency,
                "costSavings": cost_savings,
                "ttlPredictions": ttl_predictions,
            },
            "topPatterns": [
                {
                    "key": p.key,
                    "namespace": p.namespace,
                    "retrievalCount": p.retrieval_count,
                    "lastUsed": p.last_used.isoformat() if p.last_used else None,
                }
                for p in top_patterns
            ],
            "communities": [
                {
                    "id": c.id,
                    "members": c.members,
                    "cohesion": c.cohesion,
                }
                for c in communities
            ],
        }

        logger.info(
            f"Memory analytics: {len(nodes)} nodes, {len(edges)} edges, "
            f"{len(communities)} communities"
        )
        return response

    except Exception as e:
        logger.error(f"Failed to get memory analytics: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8080)
