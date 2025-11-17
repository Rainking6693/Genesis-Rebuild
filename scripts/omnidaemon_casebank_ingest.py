"""Move OmniDaemon DLQ/failed tasks into CaseBank for future recalls."""

from __future__ import annotations

import asyncio
import json
import logging

from infrastructure.casebank import CaseBank

try:
    from omnidaemon import OmniDaemonSDK
except ImportError:  # pragma: no cover
    OmniDaemonSDK = None

logger = logging.getLogger(__name__)


async def run_casebank_ingest() -> None:
    if OmniDaemonSDK is None:
        logger.warning("OmniDaemonSDK unavailable; casebank ingest skipped")
        return

    sdk = OmniDaemonSDK()
    casebank = CaseBank()
    try:
        dlq = await sdk.get_dlq("genesis.build")
    except AttributeError:
        logger.warning("OmniDaemonSDK missing get_dlq(); skipping ingestion")
        return

    for task in dlq:
        payload = getattr(task, "payload", {}) or {}
        state = json.dumps(payload)
        action = payload.get("component") or getattr(task, "agent_id", "unknown")
        reward = 0.05
        metadata = {
            "agent": getattr(task, "agent_id", "unknown"),
            "error": getattr(task, "error", "failure"),
            "retry_history": getattr(task, "retry_history", []),
        }
        await casebank.add_case(state=state, action=action, reward=reward, metadata=metadata)
        logger.info("Stored case for DLQ task %s", metadata["agent"])


if __name__ == "__main__":
    asyncio.run(run_casebank_ingest())
