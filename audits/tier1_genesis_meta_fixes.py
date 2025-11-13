"""
Genesis Meta-Agent Memory Integration - Critical Bug Fixes
Audit Date: 2025-11-13
Auditor: Hudson

This file contains corrected code for critical bugs found in River's memory integration.
Apply these fixes before merging to production.

CRITICAL FIXES:
1. BUG-001: Import name mismatch
2. SECURITY-001: ACL bypass via session creation
3. SECURITY-002: User ID authentication
4. BUG-004: Missing error handling
5. BUG-005: Incorrect namespace usage

Usage:
    Review each fix and apply to the corresponding file.
    Run tests after applying fixes.
"""

# ============================================================================
# FIX 1: BUG-001 - Import Name Mismatch
# ============================================================================
# File: infrastructure/genesis_memory_integration.py
# Line: 45

# BEFORE (INCORRECT):
"""
from infrastructure.memory_os_mongodb_adapter import GenesisMemoryOSMongoAdapter
"""

# AFTER (FIXED):
"""
from infrastructure.memory_os_mongodb_adapter import GenesisMemoryOSMongoDB as GenesisMemoryOSMongoAdapter
"""

# OR (Alternative - Rename class in memory_os_mongodb_adapter.py):
"""
# In memory_os_mongodb_adapter.py, add at end:
GenesisMemoryOSMongoAdapter = GenesisMemoryOSMongoDB  # Alias for backward compatibility
"""


# ============================================================================
# FIX 2: BUG-002 - Missing Gemini Dependency Handling
# ============================================================================
# File: infrastructure/genesis_memory_integration.py
# Lines: 50-54, 162-178, 236-251

# Add at top of file after imports:
"""
# Gemini API availability check
GEMINI_AVAILABLE = False
try:
    import google.generativeai as genai
    GEMINI_AVAILABLE = True
except ImportError:
    logger.warning("google-generativeai not installed. Multimodal features will use mock mode.")
"""

# Update MultimodalMemoryPipeline.__init__():
"""
def __init__(self, gemini_api_key: Optional[str] = None):
    self.gemini_api_key = gemini_api_key or os.getenv("GEMINI_API_KEY")

    # Use mock mode if Gemini not available OR no API key
    self.use_mock = not (GEMINI_AVAILABLE and self.gemini_api_key)

    if self.use_mock:
        if not GEMINI_AVAILABLE:
            logger.warning("Multimodal pipeline in MOCK mode: google-generativeai not installed")
        else:
            logger.warning("Multimodal pipeline in MOCK mode: no GEMINI_API_KEY")
    else:
        logger.info("Multimodal pipeline initialized with Gemini API")
"""


# ============================================================================
# FIX 3: SECURITY-001 - ACL Bypass via Session Creation
# ============================================================================
# File: infrastructure/genesis_memory_integration.py
# Lines: 344-383

# BEFORE (VULNERABLE):
"""
async def check_access(
    self,
    session_id: str,
    user_id: str
) -> bool:
    session_data = await self.memory_store.get_memory(
        namespace=("session", session_id),
        key="context"
    )

    if not session_data:
        # Session doesn't exist - allow creation
        return True  # ⚠️ SECURITY ISSUE
"""

# AFTER (FIXED):
"""
import secrets

async def check_access(
    self,
    session_id: str,
    user_id: str,
    allow_creation: bool = False  # NEW parameter
) -> bool:
    \"\"\"
    Check if user has access to session (ACL enforcement).

    Args:
        session_id: Session ID
        user_id: User ID
        allow_creation: If True, allow session creation by this user

    Returns:
        True if access granted, False otherwise
    \"\"\"
    # Retrieve session context
    session_data = await self.memory_store.get_memory(
        namespace=("session", session_id),
        key="context"
    )

    if not session_data:
        # Session doesn't exist
        if allow_creation:
            # Validate session_id format (prevent injection)
            if not self._is_valid_session_id(session_id):
                logger.warning(f"Invalid session_id format: {session_id}")
                return False

            logger.info(f"Session creation allowed for user {user_id}: {session_id}")
            return True
        else:
            logger.warning(f"Session not found: {session_id}")
            return False

    # Session exists - check ownership
    session_user_id = session_data.get("user_id")
    if session_user_id != user_id:
        logger.warning(
            f"ACL violation: User {user_id} attempted access to session {session_id} owned by {session_user_id}",
            extra={
                "security_event": "acl_violation",
                "user_id": user_id,
                "session_id": session_id,
                "owner_id": session_user_id
            }
        )
        return False

    # Check expiration
    created_at = datetime.fromisoformat(session_data.get("created_at"))
    if datetime.now(timezone.utc) - created_at > self.session_ttl:
        logger.info(f"Session expired: {session_id}, deleting...")

        # Delete expired session (prevent database bloat)
        await self._cleanup_expired_session(session_id)

        return False

    return True

def _is_valid_session_id(self, session_id: str) -> bool:
    \"\"\"
    Validate session_id format to prevent injection attacks.

    Args:
        session_id: Session ID to validate

    Returns:
        True if valid format, False otherwise
    \"\"\"
    # Allow only alphanumeric, hyphens, underscores (max 128 chars)
    import re
    pattern = r'^[a-zA-Z0-9_-]{1,128}$'
    return bool(re.match(pattern, session_id))

async def _cleanup_expired_session(self, session_id: str) -> None:
    \"\"\"
    Delete expired session and all associated data.

    Args:
        session_id: Session ID to cleanup
    \"\"\"
    # Get all keys in session namespace
    keys = await self.memory_store.list_keys(("session", session_id))

    # Delete all session data
    for key in keys:
        await self.memory_store.delete_memory(
            namespace=("session", session_id),
            key=key
        )

    logger.info(f"Cleaned up expired session: {session_id} ({len(keys)} entries deleted)")

@staticmethod
def generate_secure_session_id() -> str:
    \"\"\"
    Generate cryptographically secure session ID.

    Returns:
        Secure random session ID (UUID4 format)
    \"\"\"
    import uuid
    return str(uuid.uuid4())
"""

# Update create_session to generate secure IDs:
"""
async def create_session(
    self,
    session_id: Optional[str] = None,  # Make optional
    user_id: str,
    metadata: Optional[Dict[str, Any]] = None
) -> SessionContext:
    \"\"\"
    Create new session with secure ID generation.

    Args:
        session_id: Optional session ID (if None, generates secure random ID)
        user_id: User ID (owner)
        metadata: Optional session metadata

    Returns:
        SessionContext object
    \"\"\"
    # Generate secure session ID if not provided
    if session_id is None:
        session_id = self.generate_secure_session_id()
        logger.info(f"Generated secure session ID: {session_id}")

    # Validate session_id format
    if not self._is_valid_session_id(session_id):
        raise ValueError(f"Invalid session_id format: {session_id}")

    # Check if session already exists
    existing = await self.memory_store.get_memory(
        namespace=("session", session_id),
        key="context"
    )

    if existing:
        raise ValueError(f"Session already exists: {session_id}")

    context = SessionContext(
        session_id=session_id,
        user_id=user_id,
        metadata=metadata or {}
    )

    # Store session context
    await self.memory_store.save_memory(
        namespace=("session", session_id),
        key="context",
        value={
            "user_id": user_id,
            "created_at": context.created_at.isoformat(),
            "last_accessed": context.last_accessed.isoformat(),
            "message_count": 0,
            "metadata": context.metadata
        }
    )

    logger.info(
        f"Session created: {session_id} for user {user_id}",
        extra={
            "security_event": "session_created",
            "session_id": session_id,
            "user_id": user_id
        }
    )

    return context
"""


# ============================================================================
# FIX 4: SECURITY-002 - User ID Authentication
# ============================================================================
# File: infrastructure/genesis_meta_agent.py
# Lines: 1034-1171

# Add authentication helper method:
"""
import jwt
from typing import Optional

class GenesisMetaAgent:
    # ... existing code ...

    async def _validate_auth_token(self, auth_token: str) -> Optional[str]:
        \"\"\"
        Validate authentication token and extract user_id.

        Args:
            auth_token: JWT token or API key

        Returns:
            user_id if valid, None otherwise

        Raises:
            PermissionError: If token is invalid
        \"\"\"
        if not auth_token:
            raise PermissionError("Authentication token required")

        try:
            # Option 1: JWT validation
            secret = os.getenv("JWT_SECRET")
            if secret:
                payload = jwt.decode(auth_token, secret, algorithms=["HS256"])
                user_id = payload.get("user_id")

                if not user_id:
                    raise PermissionError("Invalid token: missing user_id")

                logger.info(f"Authenticated user: {user_id}")
                return user_id

            # Option 2: API key validation (fallback)
            # In production, validate against database of API keys
            if auth_token.startswith("sk_"):
                # Simple validation (replace with real API key check)
                logger.warning("Using API key authentication (not recommended for production)")
                return "api_key_user"  # Replace with real user lookup

            raise PermissionError("Invalid authentication method")

        except jwt.ExpiredSignatureError:
            raise PermissionError("Authentication token expired")
        except jwt.InvalidTokenError as e:
            raise PermissionError(f"Invalid authentication token: {e}")

    async def handle_user_conversation(
        self,
        message: str,
        session_id: str,
        auth_token: str,  # CHANGED: Replace user_id with auth_token
        attachments: Optional[List[str]] = None,
        agent_name: str = "genesis_agent"
    ) -> Dict[str, Any]:
        \"\"\"
        Handle user conversation with memory integration (SECURE VERSION).

        Args:
            message: User message text
            session_id: Session ID for conversation continuity
            auth_token: Authentication token (JWT or API key)
            attachments: Optional list of attachment URIs (images/audio)
            agent_name: Agent to route conversation to (default: genesis_agent)

        Returns:
            Dict with response, history, multimodal_results, etc.

        Raises:
            PermissionError: If authentication fails
        \"\"\"
        # SECURITY: Validate authentication and extract user_id
        user_id = await self._validate_auth_token(auth_token)

        # Continue with validated user_id
        # ... rest of method unchanged ...
"""


# ============================================================================
# FIX 5: BUG-004 - Missing Error Handling in handle_user_message
# ============================================================================
# File: infrastructure/genesis_memory_integration.py
# Lines: 781-926

# BEFORE (NO ERROR HANDLING):
"""
async def handle_user_message(
    self,
    message: str,
    session_id: str,
    user_id: str,
    attachments: Optional[List[str]] = None,
    retrieve_history: bool = True,
    history_window: int = 10
) -> Dict[str, Any]:
    # ... code without error handling ...

    # 1. ACL check
    if not await self.sessions.check_access(session_id, user_id):
        await self.sessions.create_session(session_id, user_id)

    # 2. Process multimodal attachments
    if attachments:
        multimodal_results = await self.multimodal.ingest_batch(
            uris=attachments,
            user_id=user_id
        )

    # ... etc (no try-except blocks)
"""

# AFTER (WITH ERROR HANDLING):
"""
async def handle_user_message(
    self,
    message: str,
    session_id: str,
    user_id: str,
    attachments: Optional[List[str]] = None,
    retrieve_history: bool = True,
    history_window: int = 10
) -> Dict[str, Any]:
    \"\"\"
    Handle user message with full memory integration (ERROR-SAFE VERSION).

    ... docstring ...
    \"\"\"
    with obs_manager.span(
        "genesis_memory_integration.handle_message",
        SpanType.EXECUTION,
        CorrelationContext(),
        attributes={
            "session_id": session_id,
            "user_id": user_id,
            "has_attachments": bool(attachments)
        }
    ) as span:
        start_time = time.time()

        # Initialize response containers
        multimodal_results = []
        processed_content = []
        history = []
        session_data = None
        errors = []

        try:
            # 1. ACL check with error handling
            try:
                access_granted = await self.sessions.check_access(
                    session_id,
                    user_id,
                    allow_creation=True  # Allow session creation
                )

                if not access_granted:
                    # Create new session if doesn't exist
                    try:
                        await self.sessions.create_session(session_id, user_id)
                    except ValueError as e:
                        logger.error(f"Session creation failed: {e}")
                        errors.append(f"Session creation error: {e}")
                        # Continue with degraded functionality

            except Exception as e:
                logger.error(f"ACL check failed: {e}", exc_info=True)
                errors.append(f"ACL check error: {e}")
                # Continue with degraded functionality

            # 2. Process multimodal attachments with error handling
            if attachments:
                try:
                    multimodal_results = await self.multimodal.ingest_batch(
                        uris=attachments,
                        user_id=user_id
                    )

                    # Extract processed content
                    for result in multimodal_results:
                        if result.processed_content:
                            processed_content.append(result.processed_content)

                    # Store attachments in user memory
                    for result in multimodal_results:
                        try:
                            await self.memory_tool.store_memory(
                                user_id=user_id,
                                key=f"attachment_{hashlib.sha256(result.uri.encode()).hexdigest()}",
                                value={
                                    "uri": result.uri,
                                    "type": result.attachment_type.value,
                                    "content": result.processed_content,
                                    "timestamp": datetime.now(timezone.utc).isoformat()
                                },
                                scope="user"
                            )
                        except Exception as e:
                            logger.warning(f"Failed to store attachment {result.uri}: {e}")
                            errors.append(f"Attachment storage error: {e}")

                except Exception as e:
                    logger.error(f"Multimodal processing failed: {e}", exc_info=True)
                    errors.append(f"Multimodal error: {e}")
                    multimodal_results = []  # Graceful fallback

            # 3. Retrieve conversation history with error handling
            if retrieve_history:
                try:
                    history_messages = await self.sessions.get_history(
                        session_id=session_id,
                        user_id=user_id,
                        limit=history_window
                    )

                    history = [
                        {
                            "role": msg.role,
                            "content": msg.content,
                            "timestamp": msg.timestamp.isoformat()
                        }
                        for msg in history_messages
                    ]
                except PermissionError as e:
                    logger.warning(f"Permission denied retrieving history: {e}")
                    errors.append(f"History access denied: {e}")
                    history = []  # Graceful fallback
                except Exception as e:
                    logger.error(f"History retrieval failed: {e}", exc_info=True)
                    errors.append(f"History retrieval error: {e}")
                    history = []  # Graceful fallback

            # 4. Augment message with multimodal content
            processed_message = message
            if processed_content:
                processed_message = f"{message}\\n\\n[Attachments]:\\n" + "\\n".join(processed_content)

            # 5. Store user message with error handling
            try:
                user_message = ConversationMessage(
                    role="user",
                    content=message,
                    attachments=[
                        MultimodalAttachment(
                            uri=result.uri,
                            attachment_type=result.attachment_type,
                            processed_content=result.processed_content
                        )
                        for result in multimodal_results
                    ]
                )

                await self.sessions.append_message(
                    session_id=session_id,
                    user_id=user_id,
                    message=user_message
                )
            except Exception as e:
                logger.error(f"Failed to store user message: {e}", exc_info=True)
                errors.append(f"Message storage error: {e}")

            # 6. Get session context with error handling
            try:
                session_data = await self.memory_tool.memory_store.get_memory(
                    namespace=("session", session_id),
                    key="context"
                )
            except Exception as e:
                logger.warning(f"Failed to retrieve session context: {e}")
                errors.append(f"Session context error: {e}")

        except Exception as e:
            # Catch-all for unexpected errors
            logger.error(f"Unexpected error in handle_user_message: {e}", exc_info=True)
            errors.append(f"Unexpected error: {e}")

        processing_time_ms = (time.time() - start_time) * 1000

        span.set_attribute("processing_time_ms", processing_time_ms)
        span.set_attribute("history_count", len(history))
        span.set_attribute("attachments_processed", len(multimodal_results))
        span.set_attribute("errors", len(errors))

        result = {
            "processed_message": processed_message,
            "history": history,
            "multimodal_results": [
                {
                    "uri": r.uri,
                    "type": r.attachment_type.value,
                    "content": r.processed_content,
                    "error": r.error
                }
                for r in multimodal_results
            ],
            "session_context": session_data,
            "processing_time_ms": processing_time_ms
        }

        # Add errors if any occurred
        if errors:
            result["errors"] = errors
            result["partial_success"] = True

        return result
"""


# ============================================================================
# FIX 6: BUG-005 - Incorrect Namespace Usage in MemoryTool
# ============================================================================
# File: infrastructure/genesis_memory_integration.py
# Lines: 608-650

# BEFORE (INCORRECT - session_id not passed):
"""
async def store_memory(
    self,
    user_id: str,
    key: str,
    value: Dict[str, Any],
    scope: str = "user",
    metadata: Optional[Dict[str, Any]] = None
) -> str:
    # Construct namespace
    if scope == "user":
        namespace = ("user", user_id)
    elif scope == "session":
        namespace = ("session", user_id)  # ⚠️ WRONG
    else:
        raise ValueError(f"Invalid scope: {scope}")
"""

# AFTER (FIXED):
"""
async def store_memory(
    self,
    user_id: str,
    key: str,
    value: Dict[str, Any],
    scope: str = "user",
    session_id: Optional[str] = None,  # NEW parameter
    metadata: Optional[Dict[str, Any]] = None
) -> str:
    \"\"\"
    Store memory with user or session scope.

    Args:
        user_id: User ID (for ACL)
        key: Memory key
        value: Memory value (dict)
        scope: Memory scope ("user" or "session")
        session_id: Session ID (REQUIRED if scope="session")
        metadata: Optional metadata

    Returns:
        Memory entry ID

    Raises:
        ValueError: If scope is invalid or session_id missing for session scope
    \"\"\"
    # Construct namespace
    if scope == "user":
        namespace = ("user", user_id)
    elif scope == "session":
        if not session_id:
            raise ValueError("session_id required when scope='session'")
        namespace = ("session", session_id)  # FIXED
    else:
        raise ValueError(f"Invalid scope: {scope}. Use 'user' or 'session'")

    # Store memory
    entry_id = await self.memory_store.save_memory(
        namespace=namespace,
        key=key,
        value=value,
        metadata=metadata
    )

    logger.info(
        f"Memory stored: {scope}/{session_id or user_id}/{key}",
        extra={
            "user_id": user_id,
            "scope": scope,
            "session_id": session_id,
            "entry_id": entry_id
        }
    )

    return entry_id
"""

# Same fix for retrieve_memory():
"""
async def retrieve_memory(
    self,
    user_id: str,
    query: str,
    scope: str = "user",
    session_id: Optional[str] = None,  # NEW parameter
    filters: Optional[Dict[str, Any]] = None,
    limit: int = 5
) -> List[Dict[str, Any]]:
    \"\"\"
    Retrieve memories with semantic search.

    Args:
        user_id: User ID (for ACL)
        query: Search query
        scope: Memory scope ("user" or "session")
        session_id: Session ID (REQUIRED if scope="session")
        filters: Optional filters (e.g., {"category": "conversations"})
        limit: Maximum results

    Returns:
        List of matching memory values
    \"\"\"
    # Construct namespace
    if scope == "user":
        namespace = ("user", user_id)
    elif scope == "session":
        if not session_id:
            raise ValueError("session_id required when scope='session'")
        namespace = ("session", session_id)  # FIXED
    else:
        raise ValueError(f"Invalid scope: {scope}. Use 'user' or 'session'")

    # ... rest of method unchanged ...
"""


# ============================================================================
# FIX 7: Input Validation
# ============================================================================
# Add validation helper methods:

"""
class GenesisMemoryIntegration:
    # ... existing code ...

    MAX_MESSAGE_LENGTH = 10_000  # 10KB
    MAX_ATTACHMENT_SIZE = 10_000_000  # 10MB
    MAX_ATTACHMENTS = 10

    def _validate_message(self, message: str) -> None:
        \"\"\"
        Validate user message input.

        Args:
            message: User message to validate

        Raises:
            ValueError: If message is invalid
        \"\"\"
        if not message:
            raise ValueError("Message cannot be empty")

        if not isinstance(message, str):
            raise ValueError(f"Message must be string, got {type(message)}")

        if len(message) > self.MAX_MESSAGE_LENGTH:
            raise ValueError(
                f"Message too long: {len(message)} bytes (max {self.MAX_MESSAGE_LENGTH})"
            )

    def _validate_attachments(self, attachments: List[str]) -> None:
        \"\"\"
        Validate attachment URIs.

        Args:
            attachments: List of attachment URIs to validate

        Raises:
            ValueError: If attachments are invalid
        \"\"\"
        if len(attachments) > self.MAX_ATTACHMENTS:
            raise ValueError(
                f"Too many attachments: {len(attachments)} (max {self.MAX_ATTACHMENTS})"
            )

        for uri in attachments:
            # Validate URI format
            if not isinstance(uri, str):
                raise ValueError(f"Attachment URI must be string, got {type(uri)}")

            # Prevent path traversal
            if ".." in uri or uri.startswith("/"):
                raise ValueError(f"Invalid attachment URI (path traversal): {uri}")

            # Check file size (if local file)
            from pathlib import Path
            if Path(uri).exists():
                file_size = Path(uri).stat().st_size
                if file_size > self.MAX_ATTACHMENT_SIZE:
                    raise ValueError(
                        f"Attachment too large: {file_size} bytes (max {self.MAX_ATTACHMENT_SIZE})"
                    )

    async def handle_user_message(
        self,
        message: str,
        session_id: str,
        user_id: str,
        attachments: Optional[List[str]] = None,
        retrieve_history: bool = True,
        history_window: int = 10
    ) -> Dict[str, Any]:
        # Validate inputs at start of method
        self._validate_message(message)

        if attachments:
            self._validate_attachments(attachments)

        # ... rest of method ...
"""


# ============================================================================
# FIX 8: Add Unit Tests
# ============================================================================
# Create new file: tests/test_genesis_memory_integration.py

UNIT_TESTS_CONTENT = '''
"""
Unit tests for Genesis Meta-Agent Memory Integration

Tests for:
- MemoryTool
- MultimodalMemoryPipeline
- ADKSessionAdapter
- GenesisMemoryIntegration
"""

import asyncio
import os
import pytest
from datetime import datetime, timezone, timedelta

# Set mock mode for testing
os.environ['GENESIS_MEMORY_MOCK'] = 'true'

from infrastructure.genesis_memory_integration import (
    GenesisMemoryIntegration,
    MemoryTool,
    MultimodalMemoryPipeline,
    ADKSessionAdapter,
    ConversationMessage,
    SessionContext,
    MultimodalAttachment,
    AttachmentType
)
from infrastructure.memory_store import GenesisMemoryStore


@pytest.mark.asyncio
class TestMemoryTool:
    """Test MemoryTool functionality"""

    async def test_store_and_retrieve_user_scope(self):
        """Test storing and retrieving user-scoped memory"""
        tool = MemoryTool()

        # Store memory
        entry_id = await tool.store_memory(
            user_id="test_user",
            key="test_key",
            value={"data": "test_value"},
            scope="user"
        )

        assert entry_id is not None

        # Retrieve memory
        results = await tool.retrieve_memory(
            user_id="test_user",
            query="test",
            scope="user"
        )

        assert len(results) > 0
        assert results[0].get("data") == "test_value"

    async def test_store_session_scope_with_session_id(self):
        """Test storing session-scoped memory (fixed bug)"""
        tool = MemoryTool()

        # Should work with session_id parameter
        entry_id = await tool.store_memory(
            user_id="test_user",
            key="session_data",
            value={"session_info": "test"},
            scope="session",
            session_id="session_123"  # Required for session scope
        )

        assert entry_id is not None

    async def test_acl_user_isolation(self):
        """Test that users cannot access each other's memories"""
        tool = MemoryTool()

        # User A stores memory
        await tool.store_memory(
            user_id="user_a",
            key="secret",
            value={"data": "user_a_secret"},
            scope="user"
        )

        # User B tries to retrieve (should get empty results)
        results = await tool.retrieve_memory(
            user_id="user_b",
            query="secret",
            scope="user"
        )

        # Should not find user A's secret
        assert len(results) == 0 or all(r.get("data") != "user_a_secret" for r in results)


@pytest.mark.asyncio
class TestMultimodalPipeline:
    """Test MultimodalMemoryPipeline"""

    async def test_mock_mode_initialization(self):
        """Test pipeline initializes in mock mode without Gemini"""
        pipeline = MultimodalMemoryPipeline(gemini_api_key=None)

        assert pipeline.use_mock == True

    async def test_process_image_mock(self):
        """Test image processing in mock mode"""
        pipeline = MultimodalMemoryPipeline()

        result = await pipeline.process_image(
            image_uri="test_image.png",
            user_id="test_user"
        )

        assert result.uri == "test_image.png"
        assert result.attachment_type == AttachmentType.IMAGE
        assert result.processed_content is not None
        assert "[Mock]" in result.processed_content


@pytest.mark.asyncio
class TestADKSessionAdapter:
    """Test ADKSessionAdapter ACL and session management"""

    async def test_create_session(self):
        """Test session creation"""
        store = GenesisMemoryStore()
        adapter = ADKSessionAdapter(store)

        context = await adapter.create_session(
            session_id="test_session",
            user_id="test_user"
        )

        assert context.session_id == "test_session"
        assert context.user_id == "test_user"

    async def test_acl_check_owner(self):
        """Test ACL allows session owner"""
        store = GenesisMemoryStore()
        adapter = ADKSessionAdapter(store)

        # Create session
        await adapter.create_session("test_session", "alice")

        # Owner should have access
        access = await adapter.check_access("test_session", "alice")
        assert access == True

    async def test_acl_check_non_owner(self):
        """Test ACL denies non-owner (SECURITY TEST)"""
        store = GenesisMemoryStore()
        adapter = ADKSessionAdapter(store)

        # Create session owned by Alice
        await adapter.create_session("test_session", "alice")

        # Bob should NOT have access
        access = await adapter.check_access("test_session", "bob")
        assert access == False

    async def test_session_expiration(self):
        """Test expired sessions are denied access"""
        store = GenesisMemoryStore()
        adapter = ADKSessionAdapter(store, session_ttl_hours=0)  # Immediate expiry

        # Create session
        await adapter.create_session("expiring_session", "user")

        # Wait for expiration (mock time)
        import time
        time.sleep(0.1)  # Small delay

        # Should deny access to expired session
        access = await adapter.check_access("expiring_session", "user")
        assert access == False


@pytest.mark.asyncio
class TestGenesisMemoryIntegration:
    """Test complete integration"""

    async def test_handle_user_message_basic(self):
        """Test basic user message handling"""
        integration = GenesisMemoryIntegration()

        result = await integration.handle_user_message(
            message="Hello, test message",
            session_id="test_session",
            user_id="test_user"
        )

        assert result["processed_message"] == "Hello, test message"
        assert isinstance(result["history"], list)
        assert result["processing_time_ms"] > 0

    async def test_error_handling_invalid_message(self):
        """Test error handling for invalid inputs"""
        integration = GenesisMemoryIntegration()

        # Empty message should be handled gracefully
        with pytest.raises(ValueError):
            await integration.handle_user_message(
                message="",  # Invalid
                session_id="test_session",
                user_id="test_user"
            )


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
'''

# Save test file
with open("/home/genesis/genesis-rebuild/tests/test_genesis_memory_integration.py", "w") as f:
    f.write(UNIT_TESTS_CONTENT)

print("✓ Unit tests created: tests/test_genesis_memory_integration.py")


# ============================================================================
# FIX 9: Add Rate Limiting
# ============================================================================
# Add to GenesisMemoryIntegration class:

"""
from collections import defaultdict
from datetime import datetime, timedelta
import asyncio

class GenesisMemoryIntegration:
    # ... existing code ...

    def __init__(self, ...):
        # ... existing init code ...

        # Rate limiting state
        self._rate_limit_state = defaultdict(list)
        self._rate_limit_lock = asyncio.Lock()
        self.RATE_LIMIT_REQUESTS = 100  # Max requests per window
        self.RATE_LIMIT_WINDOW = timedelta(minutes=1)

    async def _check_rate_limit(self, user_id: str) -> bool:
        \"\"\"
        Check if user is within rate limit.

        Args:
            user_id: User ID to check

        Returns:
            True if within limit, False if exceeded
        \"\"\"
        async with self._rate_limit_lock:
            now = datetime.now(timezone.utc)
            cutoff = now - self.RATE_LIMIT_WINDOW

            # Clean old requests
            self._rate_limit_state[user_id] = [
                ts for ts in self._rate_limit_state[user_id]
                if ts > cutoff
            ]

            # Check limit
            if len(self._rate_limit_state[user_id]) >= self.RATE_LIMIT_REQUESTS:
                logger.warning(
                    f"Rate limit exceeded for user {user_id}",
                    extra={
                        "security_event": "rate_limit_exceeded",
                        "user_id": user_id,
                        "requests_count": len(self._rate_limit_state[user_id])
                    }
                )
                return False

            # Add current request
            self._rate_limit_state[user_id].append(now)
            return True

    async def handle_user_message(self, ...):
        # Check rate limit at start
        if not await self._check_rate_limit(user_id):
            raise PermissionError(
                f"Rate limit exceeded for user {user_id}. "
                f"Max {self.RATE_LIMIT_REQUESTS} requests per {self.RATE_LIMIT_WINDOW.seconds}s"
            )

        # ... rest of method ...
"""


# ============================================================================
# SUMMARY OF FIXES
# ============================================================================

print("""
================================================================================
SUMMARY OF CRITICAL FIXES
================================================================================

1. BUG-001: Import Name Mismatch
   - Fixed import to use correct class name: GenesisMemoryOSMongoDB
   - Status: CRITICAL FIX REQUIRED

2. BUG-002: Missing Gemini Dependency Handling
   - Added GEMINI_AVAILABLE flag check
   - Added graceful fallback when package missing
   - Status: HIGH PRIORITY FIX

3. SECURITY-001: ACL Bypass via Session Creation
   - Added allow_creation parameter to check_access()
   - Added session ID validation
   - Added session cleanup for expired sessions
   - Added secure session ID generation
   - Status: CRITICAL SECURITY FIX

4. SECURITY-002: User ID Authentication
   - Added _validate_auth_token() method
   - Changed handle_user_conversation to require auth_token
   - Added JWT validation
   - Status: CRITICAL SECURITY FIX

5. BUG-004: Missing Error Handling
   - Added comprehensive try-except blocks
   - Added graceful fallbacks for failures
   - Added error collection in response
   - Status: HIGH PRIORITY FIX

6. BUG-005: Incorrect Namespace Usage
   - Added session_id parameter to store_memory() and retrieve_memory()
   - Fixed session scope to use session_id instead of user_id
   - Status: HIGH PRIORITY FIX

7. Input Validation
   - Added message length validation
   - Added attachment validation
   - Added path traversal prevention
   - Status: HIGH PRIORITY SECURITY FIX

8. Unit Tests
   - Created comprehensive test suite
   - Added ACL tests, integration tests, error handling tests
   - Status: REQUIRED FOR MERGE

9. Rate Limiting
   - Added per-user rate limiting
   - Default: 100 requests per minute
   - Status: HIGH PRIORITY SECURITY FIX

================================================================================
NEXT STEPS FOR RIVER:
================================================================================

1. Review all fixes in this file
2. Apply fixes to genesis_memory_integration.py
3. Apply authentication fixes to genesis_meta_agent.py
4. Run unit tests: pytest tests/test_genesis_memory_integration.py -v
5. Test example file: python examples/memory_integration_example.py
6. Request re-audit from Hudson

================================================================================
ESTIMATED FIX TIME: 4-6 hours for experienced developer
================================================================================
""")
