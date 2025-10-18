import asyncio
import json
import os
from datetime import datetime, timezone
from typing import Any

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from azure.identity.aio import AzureCliCredential
from agent_framework import ChatAgent
from agent_framework.clients import AzureAIAgentClient
from agent_framework.observability import setup_observability

# Setup observability
setup_observability(enable_sensitive_data=True)

# Get Azure config from environment
project_endpoint = os.getenv("AZURE_AI_PROJECT_ENDPOINT")
model_deployment = os.getenv("AZURE_AI_MODEL_DEPLOYMENT_NAME")

if not project_endpoint or not model_deployment:
    raise RuntimeError("Missing AZURE_AI_PROJECT_ENDPOINT or AZURE_AI_MODEL_DEPLOYMENT_NAME")

# Tool definitions
def echo(text: str) -> str:
    """Echo back the input text."""
    return f"Echo: {text}"

def time_now() -> str:
    """Get current UTC time in ISO8601 format."""
    return datetime.now(timezone.utc).isoformat()

def math_eval(expression: str) -> str:
    """Safely evaluate basic math expressions (+ - * / and parentheses only)."""
    import ast
    import operator
    
    # Allowed operators
    ops = {
        ast.Add: operator.add,
        ast.Sub: operator.sub,
        ast.Mult: operator.mul,
        ast.Div: operator.truediv,
        ast.USub: operator.neg,
    }
    
    def eval_node(node):
        if isinstance(node, ast.Num):
            return node.n
        elif isinstance(node, ast.BinOp):
            return ops[type(node.op)](eval_node(node.left), eval_node(node.right))
        elif isinstance(node, ast.UnaryOp):
            return ops[type(node.op)](eval_node(node.operand))
        else:
            raise ValueError(f"Unsupported operation: {type(node).__name__}")
    
    try:
        tree = ast.parse(expression, mode='eval')
        result = eval_node(tree.body)
        return str(result)
    except Exception as e:
        return f"Error: {str(e)}"

# A2A Card
A2A_CARD = {
    "name": "genesis-orchestrator",
    "version": "0.1.0",
    "description": "Genesis orchestrator agent with echo, time, and math tools",
    "project_endpoint": project_endpoint,
    "model_deployment": model_deployment,
    "observability": {
        "enable_sensitive_data": True
    },
    "tools": [
        {
            "name": "echo",
            "description": "Echo back the input text",
            "input_schema": {
                "type": "object",
                "properties": {
                    "text": {"type": "string", "description": "Text to echo"}
                },
                "required": ["text"]
            }
        },
        {
            "name": "time_now",
            "description": "Get current UTC time in ISO8601 format",
            "input_schema": {
                "type": "object",
                "properties": {}
            }
        },
        {
            "name": "math_eval",
            "description": "Safely evaluate basic math expressions",
            "input_schema": {
                "type": "object",
                "properties": {
                    "expression": {"type": "string", "description": "Math expression to evaluate"}
                },
                "required": ["expression"]
            }
        }
    ]
}

# FastAPI app
app = FastAPI()

class InvokeRequest(BaseModel):
    message: str

@app.get("/a2a/version")
async def version():
    return {
        "name": A2A_CARD["name"],
        "version": A2A_CARD["version"],
        "tools": [t["name"] for t in A2A_CARD["tools"]]
    }

@app.get("/a2a/card")
async def card():
    return A2A_CARD

@app.post("/a2a/invoke")
async def invoke(request: InvokeRequest):
    try:
        async with AzureCliCredential() as cred:
            chat_client = AzureAIAgentClient(async_credential=cred)
            async with ChatAgent(
                chat_client=chat_client,
                instructions="You are Genesis orchestrator. Use the available tools to respond to user requests. For ECHO messages, use echo tool. For TIME requests, use time_now tool. For MATH requests, use math_eval tool.",
                name="genesis-orchestrator",
                tools=[echo, time_now, math_eval],
            ) as agent:
                result = await agent.run(request.message)
                return {"response": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8080)
