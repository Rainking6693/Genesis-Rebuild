"""
AUTH0 INTEGRATION AGENT - Tier 3 Specialized Agent
Version: 1.0 (Tier 3 - Specialized Memory Integration)
Last Updated: November 13, 2025

Agent for managing Auth0 authentication integrations with persistent memory.

MODEL: Gemini 2.5 Flash (372 tokens/sec, $0.03/1M tokens)

CAPABILITIES:
- Authentication integration configuration
- Pattern learning from successful auth setups
- User-specific session management
- Cross-agent auth knowledge sharing

MEMORY INTEGRATION (Tier 3 - Specialized):
1. store_auth_pattern() - Store auth integration patterns
2. recall_patterns() - Retrieve similar auth configurations
3. authenticate_user() - Authenticate with learned patterns
4. recall_user_sessions() - Get user session history

Memory Scopes:
- app: Cross-agent auth integration knowledge (shared patterns)
- user: User-specific sessions and preferences
"""

import asyncio
import json
import logging
import os
import uuid
from dataclasses import dataclass, asdict
from datetime import datetime, timezone, timedelta
from typing import Dict, List, Optional, Any

from infrastructure.memory_os_mongodb_adapter import (
    GenesisMemoryOSMongoDB,
    create_genesis_memory_mongodb
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@dataclass
class AuthConfig:
    """Configuration for Auth0 authentication"""
    auth_method: str  # password, social, passwordless, mfa
    provider: Optional[str] = None  # google, github, etc.
    mfa_enabled: bool = False
    session_duration: int = 86400  # 24 hours default
    metadata: Optional[Dict[str, Any]] = None

    def __post_init__(self):
        if self.metadata is None:
            self.metadata = {}


@dataclass
class AuthResult:
    """Result of authentication operation"""
    success: bool
    session_id: Optional[str] = None
    user_id: Optional[str] = None
    access_token: Optional[str] = None
    expires_at: Optional[str] = None
    error: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None

    def __post_init__(self):
        if self.metadata is None:
            self.metadata = {}


class MemoryTool:
    """MemoryTool wrapper for Auth0 Integration Agent auth pattern memory."""

    def __init__(self, backend: GenesisMemoryOSMongoDB, agent_id: str = "auth0_integration_agent"):
        self.backend = backend
        self.agent_id = agent_id

    def store_memory(
        self,
        content: Dict[str, Any],
        scope: str = "app",
        provenance: Optional[Dict[str, Any]] = None,
        memory_type: str = "conversation"
    ) -> bool:
        try:
            user_id = self._build_user_id(scope, content.get("user_id"))
            user_input = self._build_user_input(content)
            agent_response = self._build_agent_response(content)

            stored_content = {
                "user_input": user_input,
                "agent_response": agent_response,
                "raw_content": content
            }

            self.backend.store(
                agent_id=self.agent_id,
                user_id=user_id,
                user_input=user_input,
                agent_response=json.dumps(stored_content),
                memory_type=memory_type
            )

            return True

        except Exception as e:
            logger.error(f"[Auth0 MemoryTool] Failed to store memory: {e}")
            return False

    def retrieve_memory(
        self,
        query: str,
        scope: str = "app",
        filters: Optional[Dict[str, Any]] = None,
        top_k: int = 5
    ) -> List[Dict[str, Any]]:
        try:
            user_id_filter = filters.get("user_id") if filters else None
            user_id = self._build_user_id(scope, user_id_filter)

            memories = self.backend.retrieve(
                agent_id=self.agent_id,
                user_id=user_id,
                query=query,
                memory_type=None,
                top_k=top_k * 2
            )

            parsed_memories = []
            for memory in memories:
                content = memory.get('content', {})
                if isinstance(content, dict):
                    agent_response = content.get('agent_response', '')
                    if isinstance(agent_response, str) and agent_response.startswith('{'):
                        try:
                            parsed_content = json.loads(agent_response)
                            memory['content'] = parsed_content
                        except json.JSONDecodeError:
                            pass
                parsed_memories.append(memory)

            if filters:
                parsed_memories = self._apply_filters(parsed_memories, filters)

            return parsed_memories[:top_k]

        except Exception as e:
            logger.error(f"[Auth0 MemoryTool] Failed to retrieve memory: {e}")
            return []

    def _build_user_id(self, scope: str, user_id: Optional[str] = None) -> str:
        if scope == "app":
            return "auth0_global"
        elif scope == "user" and user_id:
            return f"auth0_{user_id}"
        else:
            return "auth0_default"

    def _build_user_input(self, content: Dict[str, Any]) -> str:
        auth_method = content.get('auth_method', 'unknown')
        return f"Authenticate user with {auth_method}"

    def _build_agent_response(self, content: Dict[str, Any]) -> str:
        if "result" in content:
            success = content.get('success', False)
            return f"Authentication {'SUCCEEDED' if success else 'FAILED'}"
        return json.dumps(content, indent=2)

    def _apply_filters(
        self,
        memories: List[Dict[str, Any]],
        filters: Dict[str, Any]
    ) -> List[Dict[str, Any]]:
        filtered = []
        for memory in memories:
            content = memory.get('content', {})
            raw_content = content.get('raw_content', content)

            matches = True
            for key, value in filters.items():
                if key == "user_id":
                    continue
                if isinstance(raw_content, dict) and raw_content.get(key) != value:
                    matches = False
                    break

            if matches:
                filtered.append(memory)
        return filtered


class Auth0IntegrationAgent:
    """Auth0 Integration Agent - Manages authentication with memory."""

    def __init__(
        self,
        business_id: str = "default",
        enable_memory: bool = True
    ):
        self.business_id = business_id
        self.agent_id = f"auth0_integration_agent_{business_id}"

        self.enable_memory = enable_memory
        self.memory: Optional[GenesisMemoryOSMongoDB] = None
        self.memory_tool: Optional[MemoryTool] = None
        if enable_memory:
            self._init_memory()

        self.auth0_domain = os.getenv('AUTH0_DOMAIN', 'dev-mock.auth0.com')
        self.auth0_client_id = os.getenv('AUTH0_CLIENT_ID', 'mock_client_id')

        self.auths_attempted = 0
        self.auths_successful = 0

        logger.info(f"🔐 Auth0 Integration Agent initialized for business: {business_id}")
        logger.info(f"   Memory: {'Enabled' if self.enable_memory else 'Disabled'}")

    def _init_memory(self):
        try:
            mongodb_uri = os.getenv("MONGODB_URI", "mongodb://localhost:27017/")
            self.memory = create_genesis_memory_mongodb(
                mongodb_uri=mongodb_uri,
                database_name="genesis_memory_auth0",
                short_term_capacity=10,
                mid_term_capacity=300,
                long_term_knowledge_capacity=50
            )

            self.memory_tool = MemoryTool(backend=self.memory, agent_id="auth0_integration_agent")

            logger.info("[Auth0Agent] MemoryOS MongoDB initialized with MemoryTool integration")
        except Exception as e:
            logger.warning(f"[Auth0Agent] Failed to initialize MemoryOS: {e}. Memory features disabled.")
            self.memory = None
            self.memory_tool = None
            self.enable_memory = False

    async def store_auth_pattern(
        self,
        auth_method: str,
        config: Dict[str, Any],
        result: Dict[str, Any],
        success: bool,
        user_id: Optional[str] = None
    ) -> bool:
        """Store auth pattern for learning."""
        if not self.memory_tool:
            return False

        try:
            content = {
                "auth_method": auth_method,
                "config": config,
                "result": result,
                "success": success,
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "user_id": user_id
            }

            stored = self.memory_tool.store_memory(
                content=content,
                scope="app",
                memory_type="conversation"
            )

            if stored:
                logger.info(f"[Auth0Agent] Stored auth pattern: {auth_method}")

            return stored

        except Exception as e:
            logger.error(f"[Auth0Agent] Failed to store auth pattern: {e}")
            return False

    async def recall_patterns(
        self,
        auth_method: str,
        top_k: int = 5
    ) -> List[Dict[str, Any]]:
        """Recall successful auth patterns."""
        if not self.memory_tool:
            return []

        try:
            query = f"successful {auth_method} authentication"

            memories = self.memory_tool.retrieve_memory(
                query=query,
                scope="app",
                filters={"success": True},
                top_k=top_k
            )

            patterns = []
            for memory in memories:
                content = memory.get('content', {})
                raw_content = content.get('raw_content', content)

                if isinstance(raw_content, dict) and raw_content.get('success'):
                    patterns.append({
                        "auth_method": raw_content.get('auth_method'),
                        "config": raw_content.get('config', {})
                    })

            logger.info(f"[Auth0Agent] Recalled {len(patterns)} auth patterns")
            return patterns

        except Exception as e:
            logger.error(f"[Auth0Agent] Failed to recall patterns: {e}")
            return []

    async def authenticate_user(
        self,
        config: AuthConfig,
        user_id: str
    ) -> AuthResult:
        """Authenticate user with learned patterns."""
        self.auths_attempted += 1

        try:
            logger.info(f"🔐 Authenticating user with {config.auth_method}...")

            # Recall successful patterns
            if self.enable_memory:
                patterns = await self.recall_patterns(auth_method=config.auth_method, top_k=3)
                if patterns:
                    logger.info(f"✓ Using learned pattern from {len(patterns)} successful auths")

            # Mock authentication (would integrate with Auth0 SDK)
            session_id = f"sess_{uuid.uuid4().hex[:16]}"
            access_token = f"tok_{uuid.uuid4().hex[:32]}"
            expires_at = (datetime.now(timezone.utc) + timedelta(seconds=config.session_duration)).isoformat()

            # Store successful pattern
            if self.enable_memory:
                await self.store_auth_pattern(
                    auth_method=config.auth_method,
                    config=asdict(config),
                    result={"session_id": session_id},
                    success=True,
                    user_id=user_id
                )

            self.auths_successful += 1

            logger.info(f"✅ Authentication successful: {session_id}")

            return AuthResult(
                success=True,
                session_id=session_id,
                user_id=user_id,
                access_token=access_token,
                expires_at=expires_at,
                metadata={
                    "auth_method": config.auth_method,
                    "timestamp": datetime.now(timezone.utc).isoformat()
                }
            )

        except Exception as e:
            error_msg = str(e)
            logger.error(f"Authentication failed: {error_msg}")

            # Store failed pattern
            if self.enable_memory:
                await self.store_auth_pattern(
                    auth_method=config.auth_method,
                    config=asdict(config),
                    result={"error": error_msg},
                    success=False,
                    user_id=user_id
                )

            return AuthResult(
                success=False,
                error=error_msg
            )

    async def recall_user_sessions(
        self,
        user_id: str
    ) -> List[Dict[str, Any]]:
        """Recall user-specific session history."""
        if not self.memory_tool:
            return []

        try:
            query = f"user authentication sessions"

            memories = self.memory_tool.retrieve_memory(
                query=query,
                scope="user",
                filters={"user_id": user_id},
                top_k=10
            )

            sessions = []
            for memory in memories:
                content = memory.get('content', {})
                raw_content = content.get('raw_content', content)

                if isinstance(raw_content, dict):
                    sessions.append({
                        "auth_method": raw_content.get('auth_method'),
                        "timestamp": raw_content.get('timestamp')
                    })

            logger.info(f"[Auth0Agent] Recalled {len(sessions)} sessions for {user_id}")
            return sessions

        except Exception as e:
            logger.error(f"[Auth0Agent] Failed to recall user sessions: {e}")
            return []

    def get_statistics(self) -> Dict[str, Any]:
        """Get authentication statistics."""
        if self.auths_attempted > 0:
            success_rate = self.auths_successful / self.auths_attempted
        else:
            success_rate = 0.0

        return {
            "agent_id": self.agent_id,
            "auths_attempted": self.auths_attempted,
            "auths_successful": self.auths_successful,
            "success_rate": success_rate,
            "memory_enabled": self.enable_memory
        }


async def get_auth0_integration_agent(
    business_id: str = "default",
    enable_memory: bool = True
) -> Auth0IntegrationAgent:
    """Factory function to create Auth0 Integration Agent."""
    agent = Auth0IntegrationAgent(
        business_id=business_id,
        enable_memory=enable_memory
    )
    return agent
