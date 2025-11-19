#!/usr/bin/env python3
"""
Start OmniDaemon runtime - keeps all agents registered and listening for events
"""
import asyncio
import logging
import os
import signal
import sys
from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Import the bridge which registers all agents
from infrastructure.omnidaemon_bridge import OmniDaemonBridge

shutdown_event = asyncio.Event()

def signal_handler(signum, frame):
    logger.info(f"Received signal {signum}, shutting down...")
    shutdown_event.set()

async def main():
    """Initialize OmniDaemon bridge and keep it running"""
    logger.info("🚀 Starting OmniDaemon runtime...")
    
    # Register signal handlers
    signal.signal(signal.SIGINT, signal_handler)
    signal.signal(signal.SIGTERM, signal_handler)
    
    # Initialize bridge (this registers all agents)
    try:
        bridge = OmniDaemonBridge()
        await bridge.register_all_agents()
        logger.info(f"✅ Registered {len(bridge.registered)} agents with OmniDaemon")
        logger.info(f"   Topics: {', '.join(bridge.registered)}")
    except Exception as e:
        logger.error(f"❌ Failed to initialize OmniDaemon bridge: {e}")
        sys.exit(1)
    
    logger.info("🎯 OmniDaemon runtime is now listening for events...")
    logger.info("   Press Ctrl+C to shutdown")
    
    # Keep running until shutdown signal
    try:
        await shutdown_event.wait()
    except KeyboardInterrupt:
        logger.info("Keyboard interrupt received")
    
    logger.info("👋 Shutting down OmniDaemon runtime")

if __name__ == "__main__":
    asyncio.run(main())
