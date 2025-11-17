"""Run the OmniDaemon monitoring listeners that power Business Monitor metrics."""

from __future__ import annotations

import asyncio

from infrastructure.omnidaemon_bridge import OmniDaemonBridge


async def main() -> None:
    bridge = OmniDaemonBridge()
    await bridge.register_monitoring_agents()
    print("OmniDaemon monitoring listeners registered")
    await asyncio.Event().wait()


if __name__ == "__main__":
    asyncio.run(main())
