"""
FastAPI Routes for Genesis Tuned Agents
Exposes /agents/ask endpoint for calling tuned Gemini models by role.
"""

from fastapi import APIRouter
from pydantic import BaseModel
from infrastructure.vertex_client import ask_agent

router = APIRouter()

class AskBody(BaseModel):
    """Request body for agent ask endpoint."""
    role: str
    prompt: str

@router.post("/agents/ask")
def ask(body: AskBody):
    """
    Call a tuned Genesis agent by role.

    Args:
        body: Request containing role (qa/support/analyst/legal/content/security)
              and prompt (user question)

    Returns:
        JSON with role and answer from the tuned model
    """
    answer = ask_agent(body.role, body.prompt)
    return {"role": body.role, "answer": answer}
