"""
Vertex AI Client for Genesis Tuned Models
Provides simple interface to call tuned Gemini models by role.
"""

import os
from typing import Dict
from dotenv import load_dotenv

# Load .env once at process start
load_dotenv()

from vertexai import init as vertexai_init
from vertexai.generative_models import GenerativeModel

PROJECT_ID = os.getenv("VERTEX_PROJECT_ID")
LOCATION = os.getenv("VERTEX_LOCATION", "us-central1")

if not PROJECT_ID:
    raise RuntimeError("VERTEX_PROJECT_ID is not set in .env")

# Initialize Vertex AI
vertexai_init(project=PROJECT_ID, location=LOCATION)

# Map roles to tuned model resource names from env
ROLE_TO_MODEL: Dict[str, str] = {
    "qa":       os.getenv("GENESIS_QA_MODEL"),
    "support":  os.getenv("GENESIS_SUPPORT_MODEL"),
    "analyst":  os.getenv("GENESIS_ANALYST_MODEL"),
    "legal":    os.getenv("GENESIS_LEGAL_MODEL"),
    "content":  os.getenv("GENESIS_CONTENT_MODEL"),
    "security": os.getenv("GENESIS_SECURITY_MODEL"),
}

BASE_MODEL = "gemini-2.0-flash-001"  # fallback if a tuned model is missing

def _resolve_model_name(role: str) -> str:
    """Resolve role to model resource name, with fallback to base model."""
    role = (role or "").strip().lower()
    tuned = ROLE_TO_MODEL.get(role)
    return tuned if tuned else BASE_MODEL

def ask_agent(role: str, user_prompt: str) -> str:
    """
    Calls the tuned model for the given role (qa/support/analyst/legal/content/security).
    Falls back to the base model if the env var is missing.
    Returns plain text.

    Args:
        role: Agent role (qa, support, analyst, legal, content, security)
        user_prompt: The user's question or request

    Returns:
        str: The model's text response
    """
    model_name = _resolve_model_name(role)
    model = GenerativeModel(model_name)
    resp = model.generate_content(user_prompt)
    return getattr(resp, "text", "") or ""
