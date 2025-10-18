"""
Genesis A2A Service - Full Integration
All 15 agents with 56 tools exposed via A2A protocol
"""

import ast
import operator
from datetime import datetime, timezone
from typing import Any, Dict, List

from fastapi import FastAPI, HTTPException
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

setup_observability(enable_sensitive_data=True)

app = FastAPI(
    title="Genesis A2A Service - Full",
    description="Complete multi-agent system with 15 specialized agents and 56 tools",
    version="2.0.0"
)

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

    print("\n" + "="*80)
    print("GENESIS A2A SERVICE - INITIALIZING ALL AGENTS")
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
async def invoke_tool(request: InvokeRequest) -> InvokeResponse:
    """Invoke a tool from any agent"""

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
        result = tool_method(**request.arguments)
        return InvokeResponse(result=result)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Tool execution failed: {str(e)}")

def find_tool(tool_name: str) -> tuple:
    """Find which agent has a specific tool"""
    for agent_name, agent in agents.items():
        if hasattr(agent, tool_name):
            return (agent_name, tool_name)
    raise HTTPException(status_code=404, detail=f"Tool {tool_name} not found in any agent")

# Convenience endpoint for marketing tools
@app.post("/a2a/marketing/strategy")
async def marketing_strategy(business_name: str, target_audience: str, budget: float):
    """Create marketing strategy"""
    result = agents["marketing"].create_strategy(business_name, target_audience, budget)
    return {"result": result}

# Convenience endpoint for builder tools
@app.post("/a2a/builder/frontend")
async def builder_frontend(app_name: str, features: List[str], pages: List[str]):
    """Generate frontend code"""
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
