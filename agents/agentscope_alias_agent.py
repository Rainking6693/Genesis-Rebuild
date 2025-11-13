"""
AGENTSCOPE ALIAS AGENT - Tier 3 Specialized Agent
Version: 1.0 (Tier 3 - Specialized Memory Integration)
Last Updated: November 13, 2025

Agent for managing AgentScope aliases and configurations with persistent memory.

MODEL: Gemini 2.5 Flash (372 tokens/sec, $0.03/1M tokens)

CAPABILITIES:
- Alias configuration management
- Pattern learning from successful alias setups
- User-specific alias preferences
- Cross-agent alias knowledge sharing

MEMORY INTEGRATION (Tier 3 - Specialized):
1. store_alias() - Store alias configuration for pattern learning
2. recall_aliases() - Retrieve similar alias configurations
3. configure_alias() - Create/update alias with learned patterns
4. recall_user_aliases() - Get user-specific alias preferences

Memory Scopes:
- app: Cross-agent alias configuration knowledge (shared patterns)
- user: User-specific alias preferences and custom configurations
"""

import asyncio
import json
import logging
import os
import uuid
from dataclasses import dataclass, asdict
from datetime import datetime, timezone
from typing import Dict, List, Optional, Any

# MemoryOS MongoDB adapter for persistent alias memory
from infrastructure.memory_os_mongodb_adapter import (
    GenesisMemoryOSMongoDB,
    create_genesis_memory_mongodb
)

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@dataclass
class AliasConfig:
    """Configuration for AgentScope alias"""
    alias_name: str
    agent_type: str
    configuration: Dict[str, Any]
    description: Optional[str] = None
    user_id: Optional[str] = None
    created_at: Optional[str] = None

    def __post_init__(self):
        if self.created_at is None:
            self.created_at = datetime.now(timezone.utc).isoformat()


@dataclass
class AliasResult:
    """Result of alias operation"""
    success: bool
    alias_name: Optional[str] = None
    configuration: Optional[Dict[str, Any]] = None
    error: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None

    def __post_init__(self):
        if self.metadata is None:
            self.metadata = {}


class MemoryTool:
    """
    MemoryTool wrapper for AgentScope Alias Agent configuration memory.

    Provides structured memory storage/retrieval for:
    - Alias configurations and successful patterns (cross-agent learning)
    - User-specific alias preferences and custom setups
    - AgentScope configuration best practices

    Scopes:
    - app: Cross-agent alias knowledge (all agents share learnings)
    - user: User-specific alias preferences and configurations
    """

    def __init__(self, backend: GenesisMemoryOSMongoDB, agent_id: str = "agentscope_alias_agent"):
        """
        Initialize MemoryTool for AgentScope Alias Agent.

        Args:
            backend: GenesisMemoryOSMongoDB instance
            agent_id: Agent identifier (default: "agentscope_alias_agent")
        """
        self.backend = backend
        self.agent_id = agent_id
        logger.debug(f"[Alias MemoryTool] Initialized for agent_id={agent_id}")

    def store_memory(
        self,
        content: Dict[str, Any],
        scope: str = "app",
        provenance: Optional[Dict[str, Any]] = None,
        memory_type: str = "conversation"
    ) -> bool:
        """
        Store memory in MemoryOS with scope isolation.

        Args:
            content: Memory content (alias config, pattern, etc.)
            scope: Memory scope ("app" for cross-agent, "user" for user-specific)
            provenance: Origin metadata
            memory_type: Memory type for backend

        Returns:
            True if stored successfully
        """
        try:
            # Build user_id for scope isolation
            user_id = self._build_user_id(scope, content.get("user_id"))

            # Extract key fields for storage
            user_input = self._build_user_input(content)
            agent_response = self._build_agent_response(content)

            # Preserve original content
            stored_content = {
                "user_input": user_input,
                "agent_response": agent_response,
                "raw_content": content
            }

            # Store via MemoryOS backend
            self.backend.store(
                agent_id=self.agent_id,
                user_id=user_id,
                user_input=user_input,
                agent_response=json.dumps(stored_content),
                memory_type=memory_type
            )

            logger.debug(f"[Alias MemoryTool] Stored memory: scope={scope}, type={memory_type}")
            return True

        except Exception as e:
            logger.error(f"[Alias MemoryTool] Failed to store memory: {e}")
            return False

    def retrieve_memory(
        self,
        query: str,
        scope: str = "app",
        filters: Optional[Dict[str, Any]] = None,
        top_k: int = 5
    ) -> List[Dict[str, Any]]:
        """
        Retrieve memories matching query.

        Args:
            query: Search query
            scope: Memory scope to search
            filters: Optional filters
            top_k: Number of results to return

        Returns:
            List of memory entries matching query
        """
        try:
            # Build user_id for scope
            user_id_filter = filters.get("user_id") if filters else None
            user_id = self._build_user_id(scope, user_id_filter)

            # Retrieve via MemoryOS backend
            memories = self.backend.retrieve(
                agent_id=self.agent_id,
                user_id=user_id,
                query=query,
                memory_type=None,
                top_k=top_k * 2
            )

            # Parse stored JSON content
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

            # Apply custom filters
            if filters:
                parsed_memories = self._apply_filters(parsed_memories, filters)

            # Limit to top_k
            parsed_memories = parsed_memories[:top_k]

            logger.debug(f"[Alias MemoryTool] Retrieved {len(parsed_memories)} memories")
            return parsed_memories

        except Exception as e:
            logger.error(f"[Alias MemoryTool] Failed to retrieve memory: {e}")
            return []

    def _build_user_id(self, scope: str, user_id: Optional[str] = None) -> str:
        """Build user_id for scope isolation."""
        if scope == "app":
            return "alias_global"
        elif scope == "user" and user_id:
            return f"alias_{user_id}"
        else:
            return "alias_default"

    def _build_user_input(self, content: Dict[str, Any]) -> str:
        """Build user_input from content."""
        alias_name = content.get('alias_name', 'unknown')
        agent_type = content.get('agent_type', 'unknown')

        if "configuration" in content:
            return f"Configure alias '{alias_name}' for {agent_type}"
        else:
            return f"Alias operation: {alias_name}"

    def _build_agent_response(self, content: Dict[str, Any]) -> str:
        """Build agent_response from content."""
        if "result" in content:
            result = content['result']
            success = content.get('success', False)
            return f"Alias {'CONFIGURED' if success else 'FAILED'}: {result}"
        elif "configuration" in content:
            config = content['configuration']
            return f"Alias Configuration:\n{json.dumps(config, indent=2)}"
        else:
            return json.dumps(content, indent=2)

    def _apply_filters(
        self,
        memories: List[Dict[str, Any]],
        filters: Dict[str, Any]
    ) -> List[Dict[str, Any]]:
        """Apply custom filters to memory results."""
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
                elif not isinstance(raw_content, dict) and content.get(key) != value:
                    matches = False
                    break

            if matches:
                filtered.append(memory)
        return filtered


class AgentScopeAliasAgent:
    """
    AgentScope Alias Agent - Manages alias configurations with memory integration.

    Features:
    1. Alias configuration management (create, update, delete)
    2. Pattern learning from successful alias setups (cross-agent)
    3. User-specific alias preferences (user scope)
    4. Best practice recommendations
    """

    def __init__(
        self,
        business_id: str = "default",
        enable_memory: bool = True
    ):
        self.business_id = business_id
        self.agent_id = f"agentscope_alias_agent_{business_id}"

        # MemoryTool integration (Tier 3 - Specialized)
        self.enable_memory = enable_memory
        self.memory: Optional[GenesisMemoryOSMongoDB] = None
        self.memory_tool: Optional[MemoryTool] = None
        if enable_memory:
            self._init_memory()

        # Statistics
        self.aliases_configured = 0
        self.aliases_successful = 0

        logger.info(f"🔧 AgentScope Alias Agent initialized for business: {business_id}")
        logger.info(f"   Memory: {'Enabled' if self.enable_memory else 'Disabled'}")

    def _init_memory(self):
        """Initialize MemoryOS MongoDB backend and MemoryTool."""
        try:
            mongodb_uri = os.getenv("MONGODB_URI", "mongodb://localhost:27017/")
            self.memory = create_genesis_memory_mongodb(
                mongodb_uri=mongodb_uri,
                database_name="genesis_memory_alias",
                short_term_capacity=10,
                mid_term_capacity=200,
                long_term_knowledge_capacity=50
            )

            self.memory_tool = MemoryTool(backend=self.memory, agent_id="agentscope_alias_agent")

            logger.info("[AliasAgent] MemoryOS MongoDB initialized with MemoryTool integration")
        except Exception as e:
            logger.warning(f"[AliasAgent] Failed to initialize MemoryOS: {e}. Memory features disabled.")
            self.memory = None
            self.memory_tool = None
            self.enable_memory = False

    # ==================== MEMORY TOOL METHODS ====================

    async def store_alias(
        self,
        alias_name: str,
        agent_type: str,
        configuration: Dict[str, Any],
        success: bool,
        user_id: Optional[str] = None
    ) -> bool:
        """
        Store alias configuration for pattern learning (MemoryTool integration).

        Args:
            alias_name: Name of the alias
            agent_type: Type of agent
            configuration: Alias configuration
            success: Whether configuration was successful
            user_id: Optional user ID

        Returns:
            True if stored successfully
        """
        if not self.memory_tool:
            logger.debug("[AliasAgent] MemoryTool not available, skipping storage")
            return False

        try:
            content = {
                "alias_name": alias_name,
                "agent_type": agent_type,
                "configuration": configuration,
                "success": success,
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "user_id": user_id
            }

            stored = self.memory_tool.store_memory(
                content=content,
                scope="app",  # Cross-agent alias knowledge
                memory_type="conversation"
            )

            if stored:
                logger.info(f"[AliasAgent] Stored alias config: {alias_name} ({'SUCCESS' if success else 'FAILED'})")

            return stored

        except Exception as e:
            logger.error(f"[AliasAgent] Failed to store alias: {e}")
            return False

    async def recall_aliases(
        self,
        agent_type: str,
        top_k: int = 5
    ) -> List[Dict[str, Any]]:
        """
        Recall similar alias configurations from memory (MemoryTool integration).

        Args:
            agent_type: Type of agent to search for
            top_k: Number of results to return

        Returns:
            List of alias configuration patterns
        """
        if not self.memory_tool:
            logger.debug("[AliasAgent] MemoryTool not available, returning empty")
            return []

        try:
            query = f"alias configuration for {agent_type}"

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
                        "alias_name": raw_content.get('alias_name'),
                        "agent_type": raw_content.get('agent_type'),
                        "configuration": raw_content.get('configuration', {})
                    })

            logger.info(f"[AliasAgent] Recalled {len(patterns)} alias patterns for {agent_type}")
            return patterns

        except Exception as e:
            logger.error(f"[AliasAgent] Failed to recall aliases: {e}")
            return []

    async def configure_alias(
        self,
        alias_name: str,
        agent_type: str,
        configuration: Optional[Dict[str, Any]] = None,
        user_id: Optional[str] = None
    ) -> AliasResult:
        """
        Configure alias with learned patterns.

        Args:
            alias_name: Name of the alias
            agent_type: Type of agent
            configuration: Optional explicit configuration
            user_id: Optional user ID

        Returns:
            AliasResult with configuration details
        """
        self.aliases_configured += 1

        try:
            # Recall successful patterns if no explicit config
            if not configuration:
                logger.info(f"📚 Recalling successful alias patterns for {agent_type}...")
                patterns = await self.recall_aliases(agent_type=agent_type, top_k=3)

                if patterns:
                    # Use most successful pattern
                    configuration = patterns[0].get('configuration', {})
                    logger.info(f"✓ Using learned pattern from {patterns[0].get('alias_name')}")
                else:
                    # Default configuration
                    configuration = self._get_default_config(agent_type)

            # Create alias configuration
            alias_config = AliasConfig(
                alias_name=alias_name,
                agent_type=agent_type,
                configuration=configuration,
                user_id=user_id
            )

            # Store successful configuration
            if self.enable_memory:
                await self.store_alias(
                    alias_name=alias_name,
                    agent_type=agent_type,
                    configuration=configuration,
                    success=True,
                    user_id=user_id
                )

            self.aliases_successful += 1

            logger.info(f"✅ Configured alias: {alias_name} ({agent_type})")

            return AliasResult(
                success=True,
                alias_name=alias_name,
                configuration=configuration,
                metadata={
                    "agent_type": agent_type,
                    "user_id": user_id,
                    "timestamp": datetime.now(timezone.utc).isoformat()
                }
            )

        except Exception as e:
            error_msg = str(e)
            logger.error(f"Failed to configure alias: {error_msg}")

            # Store failed configuration
            if self.enable_memory:
                await self.store_alias(
                    alias_name=alias_name,
                    agent_type=agent_type,
                    configuration=configuration or {},
                    success=False,
                    user_id=user_id
                )

            return AliasResult(
                success=False,
                error=error_msg
            )

    async def recall_user_aliases(
        self,
        user_id: str,
        agent_type: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """
        Recall user-specific alias preferences (MemoryTool integration).

        Args:
            user_id: User ID
            agent_type: Optional agent type filter

        Returns:
            List of user's alias configurations
        """
        if not self.memory_tool:
            logger.debug("[AliasAgent] MemoryTool not available, returning empty")
            return []

        try:
            query = f"user alias preferences {agent_type if agent_type else ''}"

            memories = self.memory_tool.retrieve_memory(
                query=query,
                scope="user",
                filters={"user_id": user_id},
                top_k=10
            )

            user_aliases = []
            for memory in memories:
                content = memory.get('content', {})
                raw_content = content.get('raw_content', content)

                if isinstance(raw_content, dict):
                    user_aliases.append({
                        "alias_name": raw_content.get('alias_name'),
                        "agent_type": raw_content.get('agent_type'),
                        "configuration": raw_content.get('configuration', {})
                    })

            logger.info(f"[AliasAgent] Recalled {len(user_aliases)} user aliases for {user_id}")
            return user_aliases

        except Exception as e:
            logger.error(f"[AliasAgent] Failed to recall user aliases: {e}")
            return []

    # ==================== END MEMORY TOOL METHODS ====================

    def _get_default_config(self, agent_type: str) -> Dict[str, Any]:
        """Get default configuration for agent type."""
        defaults = {
            "qa": {
                "model": "gemini-2.5-flash",
                "temperature": 0.7,
                "max_tokens": 2048
            },
            "deploy": {
                "model": "gemini-2.5-flash",
                "auto_deploy": True,
                "platform": "vercel"
            },
            "support": {
                "model": "gemini-2.5-flash",
                "response_style": "friendly",
                "include_history": True
            }
        }

        return defaults.get(agent_type, {
            "model": "gemini-2.5-flash",
            "temperature": 0.7
        })

    def get_statistics(self) -> Dict[str, Any]:
        """Get alias configuration statistics."""
        if self.aliases_configured > 0:
            success_rate = self.aliases_successful / self.aliases_configured
        else:
            success_rate = 0.0

        return {
            "agent_id": self.agent_id,
            "aliases_configured": self.aliases_configured,
            "aliases_successful": self.aliases_successful,
            "success_rate": success_rate,
            "memory_enabled": self.enable_memory
        }


async def get_agentscope_alias_agent(
    business_id: str = "default",
    enable_memory: bool = True
) -> AgentScopeAliasAgent:
    """
    Factory function to create AgentScope Alias Agent.

    Args:
        business_id: Unique business identifier
        enable_memory: Enable MemoryTool integration

    Returns:
        Initialized AgentScopeAliasAgent instance
    """
    agent = AgentScopeAliasAgent(
        business_id=business_id,
        enable_memory=enable_memory
    )
    return agent
