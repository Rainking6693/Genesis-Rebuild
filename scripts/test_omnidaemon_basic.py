#!/usr/bin/env python3
"""
Test OmniDaemon basic pub/sub functionality
Phase 1 - Test Basic Pub/Sub
"""

import asyncio
import os
import sys
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

try:
    from omnidaemon import OmniDaemonSDK, AgentConfig
    from omnidaemon.event_bus import RedisStreamEventBus
    from omnidaemon.storage import RedisStore
    from omnidaemon.schemas import EventEnvelope, PayloadBase
except ImportError as e:
    print(f"❌ Import error: {e}")
    sys.exit(1)

try:
    import redis
except ImportError:
    print("❌ Redis package not installed. Run: pip install redis")
    sys.exit(1)


async def test_callback(message: dict):
    """Test callback handler"""
    print(f"✅ Received message: {message}")
    return {"status": "success", "echo": message.get("content")}


async def main():
    print("🚀 Testing OmniDaemon basic pub/sub...")
    print("-" * 50)

    redis_url = os.getenv("REDIS_URL", "redis://localhost:6379")

    # Verify Redis is available
    try:
        redis_client = redis.from_url(redis_url)
        redis_client.ping()
        print("✅ Redis connection successful")
    except Exception as e:
        print(f"❌ Redis connection failed: {e}")
        return

    # Initialize event bus and store
    try:
        event_bus = RedisStreamEventBus(redis_url=redis_url)
        store = RedisStore(redis_url=redis_url)
        print("✅ Redis EventBus and Store initialized")
    except Exception as e:
        print(f"❌ Failed to initialize Redis components: {e}")
        return

    # Initialize OmniDaemon SDK
    try:
        sdk = OmniDaemonSDK(event_bus=event_bus, store=store)
        print("✅ OmniDaemon SDK initialized")
    except Exception as e:
        print(f"❌ OmniDaemon SDK initialization failed: {e}")
        return

    # Register test agent
    try:
        await sdk.register_agent(
            AgentConfig(
                topic="genesis.test",
                callback=test_callback,
                max_retries=1,
                timeout_seconds=30,
            )
        )
        print("✅ Test agent registered on topic: genesis.test")
    except Exception as e:
        print(f"❌ Agent registration failed: {e}")
        return

    # Publish test message
    try:
        import json
        payload_content = json.dumps({"message": "Hello OmniDaemon!"})
        envelope = EventEnvelope(
            topic="genesis.test",
            payload=PayloadBase(content=payload_content),
        )
        task_id = await sdk.publish_task(envelope)
        print(f"✅ Published task: {task_id}")
    except Exception as e:
        print(f"❌ Failed to publish task: {e}")
        import traceback
        traceback.print_exc()
        return

    # Wait for processing
    print("⏳ Waiting for processing...")
    await asyncio.sleep(2)

    # Get result
    try:
        result = await sdk.get_result(task_id)
        if result:
            print(f"✅ Task result: {result}")
        else:
            print(f"⚠️  Task still processing (result not ready yet)")
    except Exception as e:
        print(f"⚠️  Could not retrieve task result: {e}")

    # Monitor Redis Streams
    print("\n📊 Redis Streams Status:")
    try:
        redis_client = redis.from_url(redis_url)
        # List all stream keys
        stream_keys = redis_client.keys("*")
        if stream_keys:
            print(f"✅ Active Redis keys found: {len(stream_keys)} keys")
            for key in stream_keys[:5]:  # Show first 5
                key_str = key if isinstance(key, str) else key.decode()
                print(f"   - {key_str}")
        else:
            print("⚠️  No streams found")
    except Exception as e:
        print(f"⚠️  Could not inspect streams: {e}")

    print("\n" + "=" * 50)
    print("✅ OmniDaemon basic pub/sub test completed!")
    print("=" * 50)


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n⚠️  Test interrupted by user")
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        import traceback
        traceback.print_exc()
