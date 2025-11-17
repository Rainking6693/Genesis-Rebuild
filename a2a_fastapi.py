"""FastAPI compatibility layer that keeps the synchronous A2A API while wiring OmniDaemon."""

from __future__ import annotations

import asyncio
from typing import Any, Dict, Optional

from fastapi import FastAPI
from pydantic import BaseModel

from infrastructure.omnidaemon_bridge import get_bridge


class A2ATaskRequest(BaseModel):
    topic: str
    payload: Dict[str, Any]
    webhook: Optional[str] = None


app = FastAPI(title="Genesis OmniDaemon Proxy")
_bridge = None


@app.on_event("startup")
async def _startup_bridge() -> None:
    global _bridge
    _bridge = get_bridge()


@app.post("/invoke")
async def invoke_sync(request: A2ATaskRequest) -> Dict[str, Any]:
    """Legacy synchronous endpoint that waits for the OmniDaemon result."""
    task_id = await _bridge.publish_event(request.topic, request.payload)
    for _ in range(20):
        result = await _bridge.get_task_result(task_id)
        if result is not None:
            return {"status": "completed", "result": result}
        await asyncio.sleep(0.5)
    return {"status": "processing", "task_id": task_id}


@app.post("/invoke/async")
async def invoke_async(request: A2ATaskRequest) -> Dict[str, Any]:
    """Return task_id immediately; caller polls for results."""
    task_id = await _bridge.publish_event(request.topic, request.payload)
    return {
        "task_id": task_id,
        "status": "queued",
        "poll_url": f"/task/{task_id}",
    }


@app.get("/task/{task_id}")
async def get_task_status(task_id: str) -> Dict[str, Any]:
    result = await _bridge.get_task_result(task_id)
    if result is None:
        return {"status": "processing"}
    return {"status": "completed", "result": result}
