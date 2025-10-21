"""
Genesis A2A Service - Full Integration
All 15 agents with 56 tools exposed via A2A protocol
"""

import ast
import operator
import os
from datetime import datetime, timezone
from typing import Any, Dict, List

# Load environment variables from .env file (MUST be first)
from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, HTTPException, Security, Depends
from fastapi.security import APIKeyHeader
from pydantic import BaseModel
from azure.identity.aio import AzureCliCredential
from agent_framework import ChatAgent
from agent_framework.azure import AzureAIAgentClient
from agent_framework.observability import setup_observability

# Import all agents
from agents import (
    MarketingAgent, BuilderAgent, ContentAgent, DeployAgent, SupportAgent,
    QAAgent, SEOAgent, EmailAgent, LegalAgent, SecurityAgent,
    BillingAgent, AnalystAgent, MaintenanceAgent, OnboardingAgent, SpecAgent
)

# Import Intent Abstraction tools (97% cost reduction layer)
from infrastructure.intent_tool import extract_intent, validate_intent

# Import structured logging
from infrastructure import a2a_logger

setup_observability(enable_sensitive_data=True)

app = FastAPI(
    title="Genesis A2A Service - Full",
    description="Complete multi-agent system with 15 specialized agents and 56 tools",
    version="2.0.0"
)

# Security: API Key authentication
api_key_header = APIKeyHeader(name="X-API-Key", auto_error=False)

def get_api_key() -> str:
    """Get API key from environment variable"""
    api_key = os.getenv("A2A_API_KEY", os.getenv("GENESIS_API_KEY"))
    if not api_key:
        # Generate secure random key if not set (for development)
        import secrets
        api_key = secrets.token_urlsafe(32)
        a2a_logger.warning(f"No A2A_API_KEY found in environment - using generated key: {api_key[:8]}...")
    return api_key

GENESIS_API_KEY = get_api_key()

async def verify_api_key(api_key: str = Security(api_key_header)):
    """Verify API key from request header"""
    genesis_env = os.getenv("GENESIS_ENV", "development")

    # In development, allow without key (but log warning)
    if genesis_env != "production" and api_key is None:
        a2a_logger.warning("API request without key in development mode - allowed but not recommended")
        return True

    # In production, require valid key
    if api_key is None:
        a2a_logger.error("API request without key in production mode - rejected")
        raise HTTPException(
            status_code=401,
            detail="Missing API key. Include X-API-Key header."
        )

    if api_key != GENESIS_API_KEY:
        a2a_logger.error(f"Invalid API key attempt: {api_key[:8]}...")
        raise HTTPException(
            status_code=403,
            detail="Invalid API key"
        )

    return True

# Request/Response models
class InvokeRequest(BaseModel):
    tool: str
    arguments: Dict[str, Any]

class InvokeResponse(BaseModel):
    result: Any

# Global agent instances
agents = {}

@app.on_event("startup")
async def startup_event():
    """Initialize all 15 agents"""
    global agents

    # Verify production environment is loaded
    genesis_env = os.getenv("GENESIS_ENV", "development")
    environment = os.getenv("ENVIRONMENT", "development")
    debug = os.getenv("DEBUG", "true").lower() == "true"

    a2a_logger.info(f"Genesis A2A Service starting up - Environment: {genesis_env}")
    print("\n" + "="*80)
    print("GENESIS A2A SERVICE - INITIALIZING ALL AGENTS")
    print(f"ENVIRONMENT: {genesis_env} (ENVIRONMENT={environment}, DEBUG={debug})")

    if genesis_env == "production":
        print("✅ RUNNING IN PRODUCTION MODE")
        a2a_logger.info("Production mode confirmed - security hardening enabled")
    else:
        print(f"⚠️  WARNING: Running in {genesis_env.upper()} mode")
        a2a_logger.warning(f"Non-production mode detected: {genesis_env}")

    print("="*80 + "\n")

    # Initialize all agents
    agents["marketing"] = MarketingAgent("default")
    await agents["marketing"].initialize()

    agents["builder"] = BuilderAgent("default")
    await agents["builder"].initialize()

    agents["content"] = ContentAgent("default")
    await agents["content"].initialize()

    agents["deploy"] = DeployAgent("default")
    await agents["deploy"].initialize()

    agents["support"] = SupportAgent("default")
    await agents["support"].initialize()

    agents["qa"] = QAAgent("default")
    await agents["qa"].initialize()

    agents["seo"] = SEOAgent("default")
    await agents["seo"].initialize()

    agents["email"] = EmailAgent("default")
    await agents["email"].initialize()

    agents["legal"] = LegalAgent("default")
    await agents["legal"].initialize()

    agents["security"] = SecurityAgent("default")
    await agents["security"].initialize()

    agents["billing"] = BillingAgent("default")
    await agents["billing"].initialize()

    agents["analyst"] = AnalystAgent("default")
    await agents["analyst"].initialize()

    agents["maintenance"] = MaintenanceAgent("default")
    await agents["maintenance"].initialize()

    agents["onboarding"] = OnboardingAgent("default")
    await agents["onboarding"].initialize()

    agents["spec"] = SpecAgent("default")
    await agents["spec"].initialize()

    a2a_logger.info(f"All {len(agents)} agents initialized successfully")
    print("\n" + "="*80)
    print(f"✅ ALL {len(agents)} AGENTS INITIALIZED - READY FOR A2A COMMUNICATION")
    print("="*80 + "\n")

@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup agents"""
    global agents
    agents.clear()

@app.get("/a2a/version")
async def get_version():
    """Return service version and status"""
    return {
        "name": "genesis-a2a-full",
        "version": "2.0.0",
        "framework": "Microsoft Agent Framework",
        "agents_loaded": len(agents),
        "status": "operational"
    }

@app.get("/a2a/agents")
async def list_agents():
    """List all available agents"""
    return {
        "total_agents": len(agents),
        "agents": list(agents.keys())
    }

@app.get("/a2a/card")
async def get_card():
    """Return complete agent card with all tools"""

    tools = []

    # Infrastructure tools (Intent Abstraction Layer - 97% cost reduction)
    tools.extend([
        {"agent": "infrastructure", "name": "extract_intent", "description": "Extract structured intent from natural language (97% cost reduction)"},
        {"agent": "infrastructure", "name": "validate_intent", "description": "Validate intent and provide agent routing recommendations"},
    ])

    # Marketing Agent tools
    tools.extend([
        {"agent": "marketing", "name": "create_strategy", "description": "Create marketing strategy"},
        {"agent": "marketing", "name": "generate_social_content", "description": "Generate social media content"},
        {"agent": "marketing", "name": "write_blog_post", "description": "Write blog post outline"},
        {"agent": "marketing", "name": "create_email_sequence", "description": "Create email drip campaign"},
        {"agent": "marketing", "name": "build_launch_plan", "description": "Create product launch plan"},
    ])

    # Builder Agent tools
    tools.extend([
        {"agent": "builder", "name": "generate_frontend", "description": "Generate React/Next.js frontend"},
        {"agent": "builder", "name": "generate_backend", "description": "Generate API routes"},
        {"agent": "builder", "name": "generate_database", "description": "Generate database schemas"},
        {"agent": "builder", "name": "generate_config", "description": "Generate config files"},
        {"agent": "builder", "name": "review_code", "description": "Review code quality"},
    ])

    # Content Agent tools
    tools.extend([
        {"agent": "content", "name": "write_blog_post", "description": "Write blog post"},
        {"agent": "content", "name": "create_documentation", "description": "Create documentation"},
        {"agent": "content", "name": "generate_faq", "description": "Generate FAQ"},
    ])

    # Add simplified entries for remaining agents (they all have similar patterns)
    for agent_name in ["deploy", "support", "qa", "seo", "email", "legal", "security", "billing", "analyst", "maintenance", "onboarding", "spec"]:
        tools.append({
            "agent": agent_name,
            "name": f"{agent_name}_tools",
            "description": f"Various tools for {agent_name} agent"
        })

    return {
        "name": "genesis-a2a-full",
        "version": "2.0.0",
        "description": "Complete Genesis multi-agent system with A2A communication",
        "protocol": "A2A",
        "total_tools": len(tools),
        "tools": tools
    }

@app.post("/a2a/invoke")
async def invoke_tool(request: InvokeRequest, authenticated: bool = Depends(verify_api_key)) -> InvokeResponse:
    """Invoke a tool from any agent or infrastructure layer - REQUIRES AUTHENTICATION"""

    # Check for infrastructure tools first (Intent Abstraction Layer)
    infrastructure_tools = {
        "extract_intent": extract_intent,
        "validate_intent": validate_intent,
    }

    if request.tool in infrastructure_tools:
        try:
            a2a_logger.info(f"Executing infrastructure tool: {request.tool}", extra={"tool_name": request.tool})
            result = infrastructure_tools[request.tool](**request.arguments)
            a2a_logger.info(f"Infrastructure tool completed: {request.tool}", extra={"tool_name": request.tool})
            return InvokeResponse(result=result)
        except Exception as e:
            a2a_logger.error(f"Infrastructure tool failed: {request.tool}", extra={"tool_name": request.tool}, exc_info=True)
            raise HTTPException(status_code=400, detail=f"Tool execution failed: {str(e)}")

    # Parse tool name (format: "agent_name.tool_name" or just "tool_name")
    if "." in request.tool:
        agent_name, tool_name = request.tool.split(".", 1)
    else:
        # Try to find the tool in any agent
        agent_name, tool_name = find_tool(request.tool)

    # Get the agent
    if agent_name not in agents:
        raise HTTPException(status_code=404, detail=f"Agent {agent_name} not found")

    agent = agents[agent_name]

    # Get the tool method
    if not hasattr(agent, tool_name):
        raise HTTPException(status_code=404, detail=f"Tool {tool_name} not found in agent {agent_name}")

    tool_method = getattr(agent, tool_name)

    # Invoke the tool
    try:
        a2a_logger.info(f"Executing agent tool: {agent_name}.{tool_name}", extra={"agent_id": agent_name, "tool_name": tool_name})
        result = tool_method(**request.arguments)
        a2a_logger.info(f"Agent tool completed: {agent_name}.{tool_name}", extra={"agent_id": agent_name, "tool_name": tool_name})
        return InvokeResponse(result=result)
    except Exception as e:
        a2a_logger.error(f"Agent tool failed: {agent_name}.{tool_name}", extra={"agent_id": agent_name, "tool_name": tool_name}, exc_info=True)
        raise HTTPException(status_code=400, detail=f"Tool execution failed: {str(e)}")

def find_tool(tool_name: str) -> tuple:
    """Find which agent has a specific tool"""
    for agent_name, agent in agents.items():
        if hasattr(agent, tool_name):
            return (agent_name, tool_name)
    raise HTTPException(status_code=404, detail=f"Tool {tool_name} not found in any agent")

# Convenience endpoint for marketing tools
@app.post("/a2a/marketing/strategy")
async def marketing_strategy(business_name: str, target_audience: str, budget: float, authenticated: bool = Depends(verify_api_key)):
    """Create marketing strategy - REQUIRES AUTHENTICATION"""
    result = agents["marketing"].create_strategy(business_name, target_audience, budget)
    return {"result": result}

# Convenience endpoint for builder tools
@app.post("/a2a/builder/frontend")
async def builder_frontend(app_name: str, features: List[str], pages: List[str], authenticated: bool = Depends(verify_api_key)):
    """Generate frontend code - REQUIRES AUTHENTICATION"""
    result = agents["builder"].generate_frontend(app_name, features, pages)
    return {"result": result}

# Health check
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "agents_loaded": len(agents),
        "timestamp": datetime.now(timezone.utc).isoformat()
    }
