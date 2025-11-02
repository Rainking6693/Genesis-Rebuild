"""
A2A FastAPI Service - Production-Ready Agent-to-Agent Communication

Integrates with Genesis orchestration layer (HTDAG/HALO/AOP/DAAO) and exposes
all 15 agents via A2A protocol for external agent-to-agent communication.

Key Features:
- A2A protocol compliant (Google/IBM standard)
- 15 specialized agents with 56+ tools
- Lazy agent loading (< 5s startup)
- API key authentication
- OTEL observability
- Circuit breaker resilience
- Rate limiting per agent
- TOON protocol support (97% token reduction)

Architecture:
  External Agent (A2A Client)
       ↓
  [A2A FastAPI] ← THIS SERVICE
       ↓
  [A2A Connector] → [HTDAG/HALO/AOP/DAAO]
       ↓
  [Genesis Agents] (15 agents × tools)
       ↓
  [Results]

Author: Claude Code (Lead)
Date: 2025-10-31
Version: 2.0.0 - Full integration with orchestration layer
"""

import asyncio
import os
import logging
from typing import Any, Dict, List, Optional
from datetime import datetime

# Load environment variables
from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, HTTPException, Security, Depends, Request, status
from fastapi.security import APIKeyHeader
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field, ValidationError
from opentelemetry import trace

# Import Genesis infrastructure
from infrastructure.a2a_connector import (
    A2AConnector,
    A2ATaskRequest,
    A2ATaskResponse,
    A2AError
)
from infrastructure.agent_auth_registry import AgentAuthRegistry, SecurityError
from infrastructure.toon_encoder import toon_or_json, decode_from_toon
from infrastructure.observability import MetricSnapshot, CorrelationContext
from infrastructure.feature_flags import is_feature_enabled
from infrastructure import a2a_logger

# Setup observability
from agent_framework.observability import setup_observability
setup_observability(enable_sensitive_data=True)

# Initialize FastAPI app
app = FastAPI(
    title="Genesis A2A Service",
    description="Agent-to-Agent communication service for Genesis multi-agent system",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict to specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Tracing
tracer = trace.get_tracer(__name__)
logger = logging.getLogger(__name__)

# Security: API Key authentication
api_key_header = APIKeyHeader(name="X-API-Key", auto_error=False)

def get_api_key() -> str:
    """Get API key from environment variable"""
    api_key = os.getenv("A2A_API_KEY", os.getenv("GENESIS_API_KEY"))
    if not api_key:
        import secrets
        api_key = secrets.token_urlsafe(32)
        logger.warning(f"No A2A_API_KEY found - using generated key: {api_key[:8]}...")
    return api_key

GENESIS_API_KEY = get_api_key()

async def verify_api_key(api_key: str = Security(api_key_header)):
    """Verify API key from request header"""
    genesis_env = os.getenv("GENESIS_ENV", "development")

    # In development, allow without key (but log warning)
    if genesis_env != "production" and api_key is None:
        logger.warning("API request without key in development mode")
        return True

    # In production, require valid key
    if api_key is None:
        raise HTTPException(
            status_code=401,
            detail="Missing API key. Include X-API-Key header."
        )

    if api_key != GENESIS_API_KEY:
        raise HTTPException(status_code=403, detail="Invalid API key")

    return True

# Pydantic models for A2A protocol
class A2AInvokeRequest(BaseModel):
    """A2A protocol invoke request"""
    agent: str = Field(..., description="Target agent name (e.g., 'qa_agent', 'builder_agent')")
    tool: Optional[str] = Field(None, description="Specific tool to invoke (optional)")
    task: str = Field(..., description="Natural language task description")
    arguments: Optional[Dict[str, Any]] = Field(default_factory=dict, description="Tool arguments")
    context: Optional[Dict[str, Any]] = Field(default_factory=dict, description="Additional context")
    use_toon: bool = Field(False, description="Use TOON encoding for response (97% token reduction)")

class A2AInvokeResponse(BaseModel):
    """A2A protocol invoke response"""
    result: Any = Field(..., description="Task execution result")
    agent: str = Field(..., description="Agent that handled the task")
    tool: Optional[str] = Field(None, description="Tool that was invoked")
    status: str = Field(..., description="Status: success, error, partial")
    execution_time_ms: float = Field(..., description="Execution time in milliseconds")
    metadata: Dict[str, Any] = Field(default_factory=dict, description="Additional metadata")

class A2AAgentCard(BaseModel):
    """A2A protocol agent card"""
    name: str
    version: str
    description: str
    capabilities: List[str]
    tools: List[Dict[str, Any]]
    endpoint: str

class A2AHealthResponse(BaseModel):
    """Health check response"""
    status: str
    version: str
    agents_available: int
    uptime_seconds: float
    feature_flags: Dict[str, bool]

# Global A2A connector (lazy-loaded)
_a2a_connector: Optional[A2AConnector] = None
_startup_time = datetime.now()

def get_a2a_connector() -> A2AConnector:
    """Get or create A2A connector (lazy initialization)"""
    global _a2a_connector
    if _a2a_connector is None:
        a2a_service_url = os.getenv("A2A_SERVICE_URL", "http://localhost:8001")
        _a2a_connector = A2AConnector(
            a2a_service_url=a2a_service_url,
            circuit_breaker_enabled=True,
            rate_limit_enabled=True
        )
        logger.info(f"Initialized A2A connector to {a2a_service_url}")
    return _a2a_connector

# Available Genesis agents
AVAILABLE_AGENTS = [
    "spec_agent", "architect_agent", "builder_agent", "frontend_agent", "backend_agent",
    "qa_agent", "security_agent", "deploy_agent", "monitoring_agent", "maintenance_agent",
    "marketing_agent", "sales_agent", "support_agent", "analytics_agent", "finance_agent"
]

@app.on_event("startup")
async def startup_event():
    """Initialize service on startup"""
    logger.info("Genesis A2A FastAPI service starting...")

    # Warm up A2A connector (creates client but doesn't load agents)
    connector = get_a2a_connector()

    # Log feature flags
    flags = {
        "a2a_integration": is_feature_enabled("a2a_integration"),
        "toon_encoding": is_feature_enabled("toon_encoding"),
        "circuit_breaker": is_feature_enabled("circuit_breaker"),
        "intent_abstraction": is_feature_enabled("intent_abstraction")
    }
    logger.info(f"Feature flags: {flags}")

    logger.info("Genesis A2A FastAPI service ready!")

@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown"""
    logger.info("Genesis A2A FastAPI service shutting down...")
    global _a2a_connector
    if _a2a_connector:
        await _a2a_connector.close()
        _a2a_connector = None

@app.get("/health", response_model=A2AHealthResponse)
async def health_check():
    """Health check endpoint"""
    uptime = (datetime.now() - _startup_time).total_seconds()

    return A2AHealthResponse(
        status="healthy",
        version="2.0.0",
        agents_available=len(AVAILABLE_AGENTS),
        uptime_seconds=uptime,
        feature_flags={
            "a2a_integration": is_feature_enabled("a2a_integration"),
            "toon_encoding": is_feature_enabled("toon_encoding"),
            "circuit_breaker": is_feature_enabled("circuit_breaker"),
            "intent_abstraction": is_feature_enabled("intent_abstraction")
        }
    )

@app.get("/agents", dependencies=[Depends(verify_api_key)])
async def list_agents():
    """List all available agents"""
    return {
        "agents": AVAILABLE_AGENTS,
        "count": len(AVAILABLE_AGENTS),
        "endpoint_pattern": "/invoke/{agent}"
    }

@app.get("/agents/{agent_name}", dependencies=[Depends(verify_api_key)])
async def get_agent_card(agent_name: str):
    """Get agent card for specific agent (A2A discovery)"""
    if agent_name not in AVAILABLE_AGENTS:
        raise HTTPException(status_code=404, detail=f"Agent '{agent_name}' not found")

    # TODO: Implement full agent card retrieval from A2A connector
    return {
        "name": agent_name,
        "version": "2.0.0",
        "description": f"Genesis {agent_name} specialized agent",
        "capabilities": ["task_execution", "tool_invocation", "orchestration"],
        "endpoint": f"/invoke/{agent_name}"
    }

@app.post("/invoke",
         response_model=A2AInvokeResponse,
         dependencies=[Depends(verify_api_key)])
async def invoke_task(request: A2AInvokeRequest):
    """
    Invoke a task on a Genesis agent via A2A protocol

    This is the main A2A endpoint that:
    1. Validates the agent exists
    2. Routes to A2A connector
    3. Executes via HTDAG/HALO/AOP/DAAO orchestration
    4. Returns results in A2A format
    """
    with tracer.start_as_current_span("a2a_invoke") as span:
        span.set_attribute("agent", request.agent)
        span.set_attribute("tool", request.tool or "auto")
        span.set_attribute("use_toon", request.use_toon)

        start_time = datetime.now()

        try:
            # Validate agent
            if request.agent not in AVAILABLE_AGENTS:
                raise HTTPException(
                    status_code=404,
                    detail=f"Agent '{request.agent}' not found. Available: {', '.join(AVAILABLE_AGENTS)}"
                )

            # Get A2A connector
            connector = get_a2a_connector()

            # Create A2A task request
            a2a_request = A2ATaskRequest(
                agent=request.agent,
                tool=request.tool,
                task=request.task,
                arguments=request.arguments,
                context=request.context
            )

            # Execute task via A2A connector
            # This routes through HTDAG decomposition → HALO routing → AOP validation → Agent execution
            a2a_response = await connector.execute_task(a2a_request)

            # Calculate execution time
            execution_time = (datetime.now() - start_time).total_seconds() * 1000

            # Apply TOON encoding if requested
            result = a2a_response.result
            if request.use_toon and is_feature_enabled("toon_encoding"):
                result = toon_or_json(result)

            # Build response
            response = A2AInvokeResponse(
                result=result,
                agent=request.agent,
                tool=a2a_response.tool_used,
                status="success",
                execution_time_ms=execution_time,
                metadata={
                    "orchestration_used": a2a_response.metadata.get("orchestration_used", False),
                    "cost_optimized": a2a_response.metadata.get("cost_optimized", False),
                    "toon_encoded": request.use_toon
                }
            )

            span.set_attribute("status", "success")
            span.set_attribute("execution_time_ms", execution_time)

            logger.info(f"A2A task completed: agent={request.agent}, time={execution_time:.2f}ms")

            return response

        except A2AError as e:
            # A2A-specific errors
            span.set_attribute("status", "error")
            span.set_attribute("error_type", type(e).__name__)
            logger.error(f"A2A error: {e}")

            raise HTTPException(
                status_code=500,
                detail=f"A2A execution error: {str(e)}"
            )

        except SecurityError as e:
            # Security errors
            span.set_attribute("status", "security_error")
            logger.error(f"Security error: {e}")

            raise HTTPException(
                status_code=403,
                detail=f"Security error: {str(e)}"
            )

        except Exception as e:
            # Generic errors
            span.set_attribute("status", "error")
            span.set_attribute("error_type", type(e).__name__)
            logger.error(f"Unexpected error: {e}", exc_info=True)

            raise HTTPException(
                status_code=500,
                detail=f"Internal server error: {str(e)}"
            )

@app.post("/invoke/{agent_name}",
         response_model=A2AInvokeResponse,
         dependencies=[Depends(verify_api_key)])
async def invoke_agent_task(agent_name: str, request: Dict[str, Any]):
    """
    Invoke a task on a specific agent (convenience endpoint)

    Same as /invoke but with agent in URL path
    """
    # Convert to standard invoke request
    invoke_request = A2AInvokeRequest(
        agent=agent_name,
        tool=request.get("tool"),
        task=request.get("task", ""),
        arguments=request.get("arguments", {}),
        context=request.get("context", {}),
        use_toon=request.get("use_toon", False)
    )

    return await invoke_task(invoke_request)

@app.exception_handler(ValidationError)
async def validation_exception_handler(request: Request, exc: ValidationError):
    """Handle Pydantic validation errors"""
    return JSONResponse(
        status_code=422,
        content={
            "detail": "Request validation error",
            "errors": exc.errors()
        }
    )

@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    """Handle HTTP exceptions"""
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail}
    )

# Development/testing endpoints (only in non-production)
if os.getenv("GENESIS_ENV", "development") != "production":

    @app.get("/debug/connector-status")
    async def debug_connector_status(authenticated: bool = Depends(verify_api_key)):
        """Debug endpoint to check A2A connector status"""
        connector = get_a2a_connector()
        return {
            "initialized": _a2a_connector is not None,
            "service_url": connector.a2a_service_url if _a2a_connector else None,
            "circuit_breaker_enabled": connector.circuit_breaker_enabled if _a2a_connector else None,
            "uptime_seconds": (datetime.now() - _startup_time).total_seconds()
        }

    @app.post("/debug/test-invoke")
    async def debug_test_invoke(authenticated: bool = Depends(verify_api_key)):
        """Debug endpoint to test basic invoke"""
        test_request = A2AInvokeRequest(
            agent="qa_agent",
            task="Echo test: Hello from A2A FastAPI",
            arguments={},
            context={}
        )
        return await invoke_task(test_request)

if __name__ == "__main__":
    import uvicorn

    port = int(os.getenv("A2A_PORT", "8000"))
    host = os.getenv("A2A_HOST", "0.0.0.0")

    logger.info(f"Starting Genesis A2A FastAPI on {host}:{port}")
    logger.info(f"Docs available at: http://{host}:{port}/docs")

    uvicorn.run(
        "a2a_fastapi:app",
        host=host,
        port=port,
        reload=os.getenv("GENESIS_ENV", "development") != "production",
        log_level="info"
    )
