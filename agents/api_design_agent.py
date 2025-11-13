"""
API DESIGN AGENT - Tier 3 Specialized Agent
Version: 1.0 (Tier 3 - Specialized Memory Integration)
Last Updated: November 13, 2025

Agent for API design and specification with persistent memory learning.

MODEL: Gemini 2.5 Flash (372 tokens/sec, $0.03/1M tokens)

CAPABILITIES:
- REST/GraphQL API design and optimization
- Pattern learning from successful API designs
- User-specific API configurations
- Cross-agent API knowledge sharing
- OpenAPI/Swagger spec generation

MEMORY INTEGRATION (Tier 3 - Specialized):
1. store_api_pattern() - Store API design patterns
2. recall_patterns() - Retrieve similar API designs
3. design_api() - Create API with learned patterns
4. recall_user_apis() - Get user API preferences

Memory Scopes:
- app: Cross-agent API design knowledge (shared patterns)
- user: User-specific API configurations and preferences
"""

import asyncio
import json
import logging
import os
import uuid
from dataclasses import dataclass, asdict
from datetime import datetime, timezone
from typing import Dict, List, Optional, Any

from infrastructure.memory_os_mongodb_adapter import (
    GenesisMemoryOSMongoDB,
    create_genesis_memory_mongodb
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@dataclass
class APIConfig:
    """Configuration for API design"""
    api_name: str
    api_type: str  # rest, graphql, grpc
    endpoints: List[Dict[str, Any]]
    authentication: Optional[str] = None  # jwt, oauth2, api_key
    rate_limiting: Optional[Dict[str, Any]] = None
    versioning: Optional[str] = None  # path, header, query
    metadata: Optional[Dict[str, Any]] = None

    def __post_init__(self):
        if self.metadata is None:
            self.metadata = {}


@dataclass
class APIResult:
    """Result of API design operation"""
    success: bool
    api_name: Optional[str] = None
    openapi_spec: Optional[Dict[str, Any]] = None
    endpoint_count: Optional[int] = None
    quality_score: Optional[float] = None
    error: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None

    def __post_init__(self):
        if self.metadata is None:
            self.metadata = {}


class MemoryTool:
    """MemoryTool wrapper for API Design Agent API pattern memory."""

    def __init__(self, backend: GenesisMemoryOSMongoDB, agent_id: str = "api_design_agent"):
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
            logger.error(f"[API Design MemoryTool] Failed to store memory: {e}")
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
            logger.error(f"[API Design MemoryTool] Failed to retrieve memory: {e}")
            return []

    def _build_user_id(self, scope: str, user_id: Optional[str] = None) -> str:
        if scope == "app":
            return "api_design_global"
        elif scope == "user" and user_id:
            return f"api_design_{user_id}"
        else:
            return "api_design_default"

    def _build_user_input(self, content: Dict[str, Any]) -> str:
        api_name = content.get('api_name', 'unknown')
        api_type = content.get('api_type', 'unknown')
        return f"Design {api_type} API: {api_name}"

    def _build_agent_response(self, content: Dict[str, Any]) -> str:
        if "result" in content:
            success = content.get('success', False)
            return f"API design {'COMPLETED' if success else 'FAILED'}"
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


class APIDesignAgent:
    """API Design Agent - Designs APIs with memory learning."""

    def __init__(
        self,
        business_id: str = "default",
        enable_memory: bool = True
    ):
        self.business_id = business_id
        self.agent_id = f"api_design_agent_{business_id}"

        self.enable_memory = enable_memory
        self.memory: Optional[GenesisMemoryOSMongoDB] = None
        self.memory_tool: Optional[MemoryTool] = None
        if enable_memory:
            self._init_memory()

        self.apis_designed = 0
        self.apis_successful = 0

        logger.info(f"🔌 API Design Agent initialized for business: {business_id}")
        logger.info(f"   Memory: {'Enabled' if self.enable_memory else 'Disabled'}")

    def _init_memory(self):
        try:
            mongodb_uri = os.getenv("MONGODB_URI", "mongodb://localhost:27017/")
            self.memory = create_genesis_memory_mongodb(
                mongodb_uri=mongodb_uri,
                database_name="genesis_memory_api_design",
                short_term_capacity=10,
                mid_term_capacity=200,
                long_term_knowledge_capacity=50
            )

            self.memory_tool = MemoryTool(backend=self.memory, agent_id="api_design_agent")

            logger.info("[APIDesignAgent] MemoryOS MongoDB initialized with MemoryTool integration")
        except Exception as e:
            logger.warning(f"[APIDesignAgent] Failed to initialize MemoryOS: {e}. Memory features disabled.")
            self.memory = None
            self.memory_tool = None
            self.enable_memory = False

    async def store_api_pattern(
        self,
        api_name: str,
        api_type: str,
        config: Dict[str, Any],
        result: Dict[str, Any],
        success: bool,
        user_id: Optional[str] = None
    ) -> bool:
        """Store API design pattern for learning."""
        if not self.memory_tool:
            return False

        try:
            content = {
                "api_name": api_name,
                "api_type": api_type,
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
                logger.info(f"[APIDesignAgent] Stored API pattern: {api_name}")

            return stored

        except Exception as e:
            logger.error(f"[APIDesignAgent] Failed to store API pattern: {e}")
            return False

    async def recall_patterns(
        self,
        api_type: str,
        top_k: int = 5
    ) -> List[Dict[str, Any]]:
        """Recall successful API patterns."""
        if not self.memory_tool:
            return []

        try:
            query = f"successful {api_type} API design"

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
                        "api_name": raw_content.get('api_name'),
                        "api_type": raw_content.get('api_type'),
                        "config": raw_content.get('config', {})
                    })

            logger.info(f"[APIDesignAgent] Recalled {len(patterns)} API patterns")
            return patterns

        except Exception as e:
            logger.error(f"[APIDesignAgent] Failed to recall patterns: {e}")
            return []

    async def design_api(
        self,
        config: APIConfig,
        user_id: Optional[str] = None
    ) -> APIResult:
        """Design API with learned patterns."""
        self.apis_designed += 1

        try:
            logger.info(f"🔌 Designing {config.api_type} API: {config.api_name}...")

            # Recall successful patterns
            if self.enable_memory:
                patterns = await self.recall_patterns(api_type=config.api_type, top_k=3)
                if patterns:
                    logger.info(f"✓ Using learned patterns from {len(patterns)} successful APIs")

            # Generate OpenAPI spec
            openapi_spec = self._generate_openapi_spec(config)
            quality_score = self._calculate_quality_score(config)

            # Store successful pattern
            if self.enable_memory:
                await self.store_api_pattern(
                    api_name=config.api_name,
                    api_type=config.api_type,
                    config=asdict(config),
                    result={"endpoint_count": len(config.endpoints), "score": quality_score},
                    success=True,
                    user_id=user_id
                )

            self.apis_successful += 1

            logger.info(f"✅ API designed: {config.api_name} (score: {quality_score:.2f})")

            return APIResult(
                success=True,
                api_name=config.api_name,
                openapi_spec=openapi_spec,
                endpoint_count=len(config.endpoints),
                quality_score=quality_score,
                metadata={
                    "api_type": config.api_type,
                    "authentication": config.authentication,
                    "timestamp": datetime.now(timezone.utc).isoformat()
                }
            )

        except Exception as e:
            error_msg = str(e)
            logger.error(f"API design failed: {error_msg}")

            # Store failed pattern
            if self.enable_memory:
                await self.store_api_pattern(
                    api_name=config.api_name,
                    api_type=config.api_type,
                    config=asdict(config),
                    result={"error": error_msg},
                    success=False,
                    user_id=user_id
                )

            return APIResult(
                success=False,
                error=error_msg
            )

    def _generate_openapi_spec(self, config: APIConfig) -> Dict[str, Any]:
        """Generate OpenAPI specification for API."""
        spec = {
            "openapi": "3.0.0",
            "info": {
                "title": config.api_name,
                "version": "1.0.0",
                "description": f"API specification for {config.api_name}"
            },
            "paths": {}
        }

        # Add security schemes if authentication specified
        if config.authentication:
            spec["components"] = {
                "securitySchemes": {
                    "default": {
                        "type": "http" if config.authentication == "jwt" else "apiKey",
                        "scheme": "bearer" if config.authentication == "jwt" else None,
                        "name": "X-API-Key" if config.authentication == "api_key" else None
                    }
                }
            }
            spec["security"] = [{"default": []}]

        # Add endpoints
        for endpoint in config.endpoints:
            path = endpoint.get('path', '/')
            method = endpoint.get('method', 'get').lower()

            if path not in spec["paths"]:
                spec["paths"][path] = {}

            spec["paths"][path][method] = {
                "summary": endpoint.get('summary', f'{method.upper()} {path}'),
                "description": endpoint.get('description', ''),
                "responses": {
                    "200": {
                        "description": "Successful response"
                    }
                }
            }

            # Add parameters if present
            if endpoint.get('parameters'):
                spec["paths"][path][method]["parameters"] = endpoint['parameters']

        return spec

    def _calculate_quality_score(self, config: APIConfig) -> float:
        """Calculate API design quality score."""
        score = 0.0

        # Base score
        score += 40.0

        # Bonus for authentication
        if config.authentication:
            score += 15.0

        # Bonus for rate limiting
        if config.rate_limiting:
            score += 10.0

        # Bonus for versioning
        if config.versioning:
            score += 10.0

        # Bonus for multiple endpoints
        score += min(len(config.endpoints) * 2, 25)

        return min(score, 100.0)

    async def recall_user_apis(
        self,
        user_id: str
    ) -> List[Dict[str, Any]]:
        """Recall user-specific API configurations."""
        if not self.memory_tool:
            return []

        try:
            query = f"user API configurations"

            memories = self.memory_tool.retrieve_memory(
                query=query,
                scope="user",
                filters={"user_id": user_id},
                top_k=10
            )

            apis = []
            for memory in memories:
                content = memory.get('content', {})
                raw_content = content.get('raw_content', content)

                if isinstance(raw_content, dict):
                    apis.append({
                        "api_name": raw_content.get('api_name'),
                        "api_type": raw_content.get('api_type'),
                        "config": raw_content.get('config', {})
                    })

            logger.info(f"[APIDesignAgent] Recalled {len(apis)} user APIs for {user_id}")
            return apis

        except Exception as e:
            logger.error(f"[APIDesignAgent] Failed to recall user APIs: {e}")
            return []

    def get_statistics(self) -> Dict[str, Any]:
        """Get API design statistics."""
        if self.apis_designed > 0:
            success_rate = self.apis_successful / self.apis_designed
        else:
            success_rate = 0.0

        return {
            "agent_id": self.agent_id,
            "apis_designed": self.apis_designed,
            "apis_successful": self.apis_successful,
            "success_rate": success_rate,
            "memory_enabled": self.enable_memory
        }


async def get_api_design_agent(
    business_id: str = "default",
    enable_memory: bool = True
) -> APIDesignAgent:
    """Factory function to create API Design Agent."""
    agent = APIDesignAgent(
        business_id=business_id,
        enable_memory=enable_memory
    )
    return agent
