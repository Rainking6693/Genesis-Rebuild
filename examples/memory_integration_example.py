"""
Example Usage: Genesis Meta-Agent Memory Integration

Demonstrates how to use the complete memory integration with:
- User conversation persistence
- Multimodal attachment processing (images/audio)
- Session management with ACL
- Cross-session memory retrieval

Prerequisites:
- MongoDB running (or use in-memory fallback)
- GEMINI_API_KEY set for multimodal processing (optional)
- Genesis environment loaded

Run:
    python examples/memory_integration_example.py
"""

import asyncio
import logging
import sys
from pathlib import Path

# Add infrastructure to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from infrastructure.genesis_meta_agent import GenesisMetaAgent
from infrastructure.logging_config import setup_logging

# Setup logging
setup_logging()
logger = logging.getLogger(__name__)


async def example_basic_conversation():
    """Example 1: Basic conversation with memory persistence"""
    print("\n" + "="*80)
    print("EXAMPLE 1: Basic Conversation with Memory")
    print("="*80)

    # Initialize agent with memory
    agent = GenesisMetaAgent(
        use_local_llm=False,
        enable_memory=True
    )

    # User conversation
    session_id = "example_session_001"
    user_id = "user_123"

    # Message 1
    print("\n[User]: Tell me about TypeScript best practices")
    result1 = await agent.handle_user_conversation(
        message="Tell me about TypeScript best practices",
        session_id=session_id,
        user_id=user_id
    )
    print(f"[Assistant]: {result1['response'][:200]}...")
    print(f"[Memory]: Enabled={result1['memory_enabled']}, History={len(result1['history'])} messages")

    # Message 2 (with context from Message 1)
    print("\n[User]: Can you give me an example?")
    result2 = await agent.handle_user_conversation(
        message="Can you give me an example?",
        session_id=session_id,
        user_id=user_id
    )
    print(f"[Assistant]: {result2['response'][:200]}...")
    print(f"[Memory]: History={len(result2['history'])} messages (includes previous message)")

    print("\nConversation stored in MongoDB - restart-safe!")


async def example_multimodal_conversation():
    """Example 2: Conversation with image attachment"""
    print("\n" + "="*80)
    print("EXAMPLE 2: Multimodal Conversation (Image Attachment)")
    print("="*80)

    agent = GenesisMetaAgent(enable_memory=True)

    session_id = "example_session_002"
    user_id = "user_456"

    # Create a test image (placeholder)
    print("\n[User]: Can you analyze this screenshot? [screenshot.png]")
    result = await agent.handle_user_conversation(
        message="Can you analyze this screenshot?",
        session_id=session_id,
        user_id=user_id,
        attachments=["examples/test_image.png"]  # Must exist or will use mock
    )

    print(f"[Assistant]: {result['response'][:200]}...")

    # Check multimodal processing
    if result['multimodal_results']:
        for mm_result in result['multimodal_results']:
            print(f"[Multimodal]: Processed {mm_result['type']} - {mm_result['uri']}")
            if mm_result['content']:
                print(f"  Content: {mm_result['content'][:100]}...")
    else:
        print("[Multimodal]: Running in mock mode (no GEMINI_API_KEY)")


async def example_cross_session_memory():
    """Example 3: Memory retrieval across sessions"""
    print("\n" + "="*80)
    print("EXAMPLE 3: Cross-Session Memory Retrieval")
    print("="*80)

    agent = GenesisMetaAgent(enable_memory=True)

    user_id = "user_789"

    # Session 1: Store information
    session_1 = "session_A"
    print("\n[Session A - User]: I'm working on a React project with TypeScript")
    await agent.handle_user_conversation(
        message="I'm working on a React project with TypeScript",
        session_id=session_1,
        user_id=user_id
    )

    # Session 2: Retrieve information (different session, same user)
    session_2 = "session_B"
    print("\n[Session B - User]: What project am I working on?")
    result = await agent.handle_user_conversation(
        message="What project am I working on?",
        session_id=session_2,
        user_id=user_id
    )

    print(f"[Assistant]: {result['response'][:200]}...")
    print("\nMemory retrieved across sessions!")


async def example_acl_enforcement():
    """Example 4: ACL enforcement (user isolation)"""
    print("\n" + "="*80)
    print("EXAMPLE 4: ACL Enforcement (User Isolation)")
    print("="*80)

    agent = GenesisMetaAgent(enable_memory=True)

    session_id = "shared_session"

    # User 1 stores data
    user_1 = "user_alice"
    print(f"\n[User {user_1}]: My secret is 12345")
    await agent.handle_user_conversation(
        message="My secret is 12345",
        session_id=session_id,
        user_id=user_1
    )

    # User 2 tries to access (should fail)
    user_2 = "user_bob"
    print(f"\n[User {user_2}]: What's the secret?")
    try:
        result = await agent.handle_user_conversation(
            message="What's the secret?",
            session_id=session_id,
            user_id=user_2
        )
        print(f"[Assistant]: {result['response'][:200]}...")
        print("[ACL]: Session isolated - User 2 cannot access User 1's messages")
    except PermissionError as e:
        print(f"[ACL]: Access denied - {e}")


async def example_memory_without_integration():
    """Example 5: Fallback mode (memory disabled)"""
    print("\n" + "="*80)
    print("EXAMPLE 5: Fallback Mode (Memory Disabled)")
    print("="*80)

    # Initialize without memory
    agent = GenesisMetaAgent(
        use_local_llm=False,
        enable_memory=False
    )

    print("\n[User]: Tell me a joke")
    result = await agent.handle_user_conversation(
        message="Tell me a joke",
        session_id="fallback_session",
        user_id="user_fallback"
    )

    print(f"[Assistant]: {result['response'][:200]}...")
    print(f"[Memory]: Enabled={result['memory_enabled']} (fallback mode)")


async def main():
    """Run all examples"""
    print("\n" + "="*80)
    print("GENESIS MEMORY INTEGRATION - EXAMPLES")
    print("="*80)

    try:
        # Run examples
        await example_basic_conversation()
        await example_multimodal_conversation()
        await example_cross_session_memory()
        await example_acl_enforcement()
        await example_memory_without_integration()

        print("\n" + "="*80)
        print("ALL EXAMPLES COMPLETED")
        print("="*80)

    except Exception as e:
        logger.error(f"Example failed: {e}", exc_info=True)
        raise


if __name__ == "__main__":
    asyncio.run(main())
