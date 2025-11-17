"""Async callbacks for OmniDaemon priority agents."""
from __future__ import annotations

import asyncio
import logging
from pathlib import Path
from typing import Dict, Any
from uuid import uuid4

from agents.business_generation_agent import BusinessIdeaGenerator
from infrastructure.payments import get_payment_manager
from infrastructure.payments.agent_payment_mixin import AgentPaymentMixin

try:
    from infrastructure.genesis_meta_agent import GenesisMetaAgent, BusinessSpec
except ImportError:
    GenesisMetaAgent = None
    BusinessSpec = None

logger = logging.getLogger(__name__)


async def builder_callback(message: Dict[str, Any]) -> Dict[str, Any]:
    import json
    # Extract actual content from the message - it's a JSON string in OmniDaemon
    content_str = message.get("content", "{}")
    try:
        payload = json.loads(content_str) if isinstance(content_str, str) else content_str
    except (json.JSONDecodeError, TypeError):
        payload = {}

    components = payload.get("components", ["dashboard"])
    agent = AgentPaymentMixin("builder_agent")
    await asyncio.sleep(0.1)
    await agent.pay_for_api_call(
        url="https://genesis.builder/execute",
        cost_estimate_usdc=1.25,
        metadata={"components": components},
    )
    return {"status": "success", "components": components}


async def deploy_callback(message: Dict[str, Any]) -> Dict[str, Any]:
    import json
    # Extract actual content from the message - it's a JSON string in OmniDaemon
    content_str = message.get("content", "{}")
    try:
        payload = json.loads(content_str) if isinstance(content_str, str) else content_str
    except (json.JSONDecodeError, TypeError):
        payload = {}

    platform = payload.get("platform", "vercel")
    payment = get_payment_manager().pay(
        "deploy_agent",
        f"https://deploy.{platform}.genesis/deploy",
        0.85,
        metadata={"platform": platform},
    )
    return {"status": "deployed", "platform": platform, "transaction_id": payment.transaction_id}


async def qa_callback(message: Dict[str, Any]) -> Dict[str, Any]:
    import json
    # Extract actual content from the message - it's a JSON string in OmniDaemon
    content_str = message.get("content", "{}")
    try:
        payload = json.loads(content_str) if isinstance(content_str, str) else content_str
    except (json.JSONDecodeError, TypeError):
        payload = {}

    agent = AgentPaymentMixin("qa_agent")
    tests = payload.get("tests", [])
    await agent.pay_for_api_call(
        url="https://qa-suite.genesis/run",
        cost_estimate_usdc=0.4,
        metadata={"tests": tests},
    )
    await asyncio.sleep(0.05)
    return {"status": "tests_executed", "tests": tests}


async def research_callback(message: Dict[str, Any]) -> Dict[str, Any]:
    import json
    # Extract actual content from the message - it's a JSON string in OmniDaemon
    content_str = message.get("content", "{}")
    try:
        payload = json.loads(content_str) if isinstance(content_str, str) else content_str
    except (json.JSONDecodeError, TypeError):
        payload = {}

    agent = BusinessIdeaGenerator()
    idea = await agent.generate_idea(
        business_type=payload.get("business_type", "saas"),
        min_score=payload.get("min_score", 60.0),
    )
    return {"status": "researched", "content": idea.to_dict()}


async def business_marketing_callback(topic: str, message: Dict[str, Any]) -> Dict[str, Any]:
    import json
    # Extract actual content from the message - it's a JSON string in OmniDaemon
    content_str = message.get("content", "{}")
    try:
        payload = json.loads(content_str) if isinstance(content_str, str) else content_str
    except (json.JSONDecodeError, TypeError):
        payload = {}

    await asyncio.sleep(0.05)
    return {"status": "handled", "topic": topic, "payload": payload}


async def finance_special_callback(topic: str, message: Dict[str, Any]) -> Dict[str, Any]:
    import json
    # Extract actual content from the message - it's a JSON string in OmniDaemon
    content_str = message.get("content", "{}")
    try:
        payload = json.loads(content_str) if isinstance(content_str, str) else content_str
    except (json.JSONDecodeError, TypeError):
        payload = {}

    await asyncio.sleep(0.05)
    return {"status": "finance-handled", "topic": topic, "payload": payload}


async def core_agent_callback(topic: str, message: Dict[str, Any]) -> Dict[str, Any]:
    import json
    # Extract actual content from the message - it's a JSON string in OmniDaemon
    content_str = message.get("content", "{}")
    try:
        payload = json.loads(content_str) if isinstance(content_str, str) else content_str
    except (json.JSONDecodeError, TypeError):
        payload = {}

    await asyncio.sleep(0.05)
    return {"status": "processed", "topic": topic, "payload": payload}


async def meta_agent_callback(message: Dict[str, Any]) -> Dict[str, Any]:
    import json
    if GenesisMetaAgent is None or BusinessSpec is None:
        logger.warning("GenesisMetaAgent unavailable, skipping meta callback")
        return {"status": "skipped", "reason": "GenesisMetaAgent unavailable"}

    # Extract actual content from the message - it's a JSON string in OmniDaemon
    content_str = message.get("content", "{}")
    try:
        payload = json.loads(content_str) if isinstance(content_str, str) else content_str
    except (json.JSONDecodeError, TypeError):
        payload = {}

    spec_payload = payload.get("spec", {})
    name = spec_payload.get("name") or f"omni-{uuid4().hex[:6]}"
    output_dir = Path(spec_payload.get("output_dir", "businesses"))
    if not output_dir.is_absolute():
        output_dir = Path("businesses") / output_dir

    components = spec_payload.get("components") or ["dashboard_ui", "rest_api"]
    spec = BusinessSpec(
        name=name,
        business_type=spec_payload.get("business_type", "saas"),
        description=spec_payload.get("description", "OmniDaemon orchestrated business"),
        components=list(components),
        output_dir=output_dir,
        metadata=spec_payload.get("metadata", {}),
    )

    agent = GenesisMetaAgent()
    result = await agent.generate_business(spec)
    return {
        "status": "success" if result.success else "failed",
        "business_id": spec.metadata.get("business_id"),
        "metrics": result.metrics,
    }
