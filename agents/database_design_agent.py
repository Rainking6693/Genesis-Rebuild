"""
DATABASE DESIGN AGENT - Tier 3 Specialized Agent
Version: 1.0 (Tier 3 - Specialized Memory Integration)
Last Updated: November 13, 2025

Agent for database schema design with persistent memory learning.

MODEL: Gemini 2.5 Flash (372 tokens/sec, $0.03/1M tokens)

CAPABILITIES:
- Database schema design and optimization
- Pattern learning from successful schemas
- User-specific database configurations
- Cross-agent schema knowledge sharing

MEMORY INTEGRATION (Tier 3 - Specialized):
1. store_schema_pattern() - Store schema design patterns
2. recall_patterns() - Retrieve similar schema designs
3. design_schema() - Create schema with learned patterns
4. recall_user_schemas() - Get user database preferences

Memory Scopes:
- app: Cross-agent schema design knowledge (shared patterns)
- user: User-specific database configurations and preferences
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
class SchemaConfig:
    """Configuration for database schema"""
    schema_name: str
    database_type: str  # postgresql, mysql, mongodb, etc.
    tables: List[Dict[str, Any]]
    relationships: Optional[List[Dict[str, Any]]] = None
    indexes: Optional[List[Dict[str, Any]]] = None
    metadata: Optional[Dict[str, Any]] = None

    def __post_init__(self):
        if self.relationships is None:
            self.relationships = []
        if self.indexes is None:
            self.indexes = []
        if self.metadata is None:
            self.metadata = {}


@dataclass
class SchemaResult:
    """Result of schema design operation"""
    success: bool
    schema_name: Optional[str] = None
    ddl_statements: Optional[List[str]] = None
    optimization_score: Optional[float] = None
    error: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None

    def __post_init__(self):
        if self.metadata is None:
            self.metadata = {}


class MemoryTool:
    """MemoryTool wrapper for Database Design Agent schema pattern memory."""

    def __init__(self, backend: GenesisMemoryOSMongoDB, agent_id: str = "database_design_agent"):
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
            logger.error(f"[DB Design MemoryTool] Failed to store memory: {e}")
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
            logger.error(f"[DB Design MemoryTool] Failed to retrieve memory: {e}")
            return []

    def _build_user_id(self, scope: str, user_id: Optional[str] = None) -> str:
        if scope == "app":
            return "db_design_global"
        elif scope == "user" and user_id:
            return f"db_design_{user_id}"
        else:
            return "db_design_default"

    def _build_user_input(self, content: Dict[str, Any]) -> str:
        schema_name = content.get('schema_name', 'unknown')
        database_type = content.get('database_type', 'unknown')
        return f"Design {database_type} schema: {schema_name}"

    def _build_agent_response(self, content: Dict[str, Any]) -> str:
        if "result" in content:
            success = content.get('success', False)
            return f"Schema design {'COMPLETED' if success else 'FAILED'}"
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


class DatabaseDesignAgent:
    """Database Design Agent - Designs schemas with memory learning."""

    def __init__(
        self,
        business_id: str = "default",
        enable_memory: bool = True
    ):
        self.business_id = business_id
        self.agent_id = f"database_design_agent_{business_id}"

        self.enable_memory = enable_memory
        self.memory: Optional[GenesisMemoryOSMongoDB] = None
        self.memory_tool: Optional[MemoryTool] = None
        if enable_memory:
            self._init_memory()

        self.schemas_designed = 0
        self.schemas_successful = 0

        logger.info(f"🗄️ Database Design Agent initialized for business: {business_id}")
        logger.info(f"   Memory: {'Enabled' if self.enable_memory else 'Disabled'}")

    def _init_memory(self):
        try:
            mongodb_uri = os.getenv("MONGODB_URI", "mongodb://localhost:27017/")
            self.memory = create_genesis_memory_mongodb(
                mongodb_uri=mongodb_uri,
                database_name="genesis_memory_db_design",
                short_term_capacity=10,
                mid_term_capacity=200,
                long_term_knowledge_capacity=50
            )

            self.memory_tool = MemoryTool(backend=self.memory, agent_id="database_design_agent")

            logger.info("[DBDesignAgent] MemoryOS MongoDB initialized with MemoryTool integration")
        except Exception as e:
            logger.warning(f"[DBDesignAgent] Failed to initialize MemoryOS: {e}. Memory features disabled.")
            self.memory = None
            self.memory_tool = None
            self.enable_memory = False

    async def store_schema_pattern(
        self,
        schema_name: str,
        database_type: str,
        config: Dict[str, Any],
        result: Dict[str, Any],
        success: bool,
        user_id: Optional[str] = None
    ) -> bool:
        """Store schema design pattern for learning."""
        if not self.memory_tool:
            return False

        try:
            content = {
                "schema_name": schema_name,
                "database_type": database_type,
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
                logger.info(f"[DBDesignAgent] Stored schema pattern: {schema_name}")

            return stored

        except Exception as e:
            logger.error(f"[DBDesignAgent] Failed to store schema pattern: {e}")
            return False

    async def recall_patterns(
        self,
        database_type: str,
        top_k: int = 5
    ) -> List[Dict[str, Any]]:
        """Recall successful schema patterns."""
        if not self.memory_tool:
            return []

        try:
            query = f"successful {database_type} schema design"

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
                        "schema_name": raw_content.get('schema_name'),
                        "database_type": raw_content.get('database_type'),
                        "config": raw_content.get('config', {})
                    })

            logger.info(f"[DBDesignAgent] Recalled {len(patterns)} schema patterns")
            return patterns

        except Exception as e:
            logger.error(f"[DBDesignAgent] Failed to recall patterns: {e}")
            return []

    async def design_schema(
        self,
        config: SchemaConfig,
        user_id: Optional[str] = None
    ) -> SchemaResult:
        """Design database schema with learned patterns."""
        self.schemas_designed += 1

        try:
            logger.info(f"🗄️ Designing {config.database_type} schema: {config.schema_name}...")

            # Recall successful patterns
            if self.enable_memory:
                patterns = await self.recall_patterns(database_type=config.database_type, top_k=3)
                if patterns:
                    logger.info(f"✓ Using learned patterns from {len(patterns)} successful schemas")

            # Generate DDL statements
            ddl_statements = self._generate_ddl(config)
            optimization_score = self._calculate_optimization_score(config)

            # Store successful pattern
            if self.enable_memory:
                await self.store_schema_pattern(
                    schema_name=config.schema_name,
                    database_type=config.database_type,
                    config=asdict(config),
                    result={"ddl_count": len(ddl_statements), "score": optimization_score},
                    success=True,
                    user_id=user_id
                )

            self.schemas_successful += 1

            logger.info(f"✅ Schema designed: {config.schema_name} (score: {optimization_score:.2f})")

            return SchemaResult(
                success=True,
                schema_name=config.schema_name,
                ddl_statements=ddl_statements,
                optimization_score=optimization_score,
                metadata={
                    "database_type": config.database_type,
                    "table_count": len(config.tables),
                    "timestamp": datetime.now(timezone.utc).isoformat()
                }
            )

        except Exception as e:
            error_msg = str(e)
            logger.error(f"Schema design failed: {error_msg}")

            # Store failed pattern
            if self.enable_memory:
                await self.store_schema_pattern(
                    schema_name=config.schema_name,
                    database_type=config.database_type,
                    config=asdict(config),
                    result={"error": error_msg},
                    success=False,
                    user_id=user_id
                )

            return SchemaResult(
                success=False,
                error=error_msg
            )

    def _generate_ddl(self, config: SchemaConfig) -> List[str]:
        """Generate DDL statements for schema."""
        ddl = []

        for table in config.tables:
            table_name = table.get('name', 'unknown')
            columns = table.get('columns', [])

            if config.database_type in ['postgresql', 'mysql']:
                # SQL DDL
                col_defs = []
                for col in columns:
                    col_def = f"{col['name']} {col['type']}"
                    if col.get('primary_key'):
                        col_def += " PRIMARY KEY"
                    if col.get('not_null'):
                        col_def += " NOT NULL"
                    col_defs.append(col_def)

                ddl.append(f"CREATE TABLE {table_name} (\n  {',\n  '.join(col_defs)}\n);")

            elif config.database_type == 'mongodb':
                # MongoDB schema (validation)
                schema = {
                    "validator": {
                        "$jsonSchema": {
                            "bsonType": "object",
                            "required": [col['name'] for col in columns if col.get('required')],
                            "properties": {
                                col['name']: {"bsonType": col.get('type', 'string')}
                                for col in columns
                            }
                        }
                    }
                }
                ddl.append(f"db.createCollection('{table_name}', {json.dumps(schema, indent=2)})")

        return ddl

    def _calculate_optimization_score(self, config: SchemaConfig) -> float:
        """Calculate schema optimization score."""
        score = 0.0

        # Base score
        score += 50.0

        # Bonus for indexes
        score += min(len(config.indexes) * 5, 20)

        # Bonus for relationships
        score += min(len(config.relationships) * 3, 15)

        # Bonus for normalized design (multiple tables)
        if len(config.tables) > 1:
            score += 15

        return min(score, 100.0)

    async def recall_user_schemas(
        self,
        user_id: str
    ) -> List[Dict[str, Any]]:
        """Recall user-specific schema configurations."""
        if not self.memory_tool:
            return []

        try:
            query = f"user database schemas"

            memories = self.memory_tool.retrieve_memory(
                query=query,
                scope="user",
                filters={"user_id": user_id},
                top_k=10
            )

            schemas = []
            for memory in memories:
                content = memory.get('content', {})
                raw_content = content.get('raw_content', content)

                if isinstance(raw_content, dict):
                    schemas.append({
                        "schema_name": raw_content.get('schema_name'),
                        "database_type": raw_content.get('database_type'),
                        "config": raw_content.get('config', {})
                    })

            logger.info(f"[DBDesignAgent] Recalled {len(schemas)} user schemas for {user_id}")
            return schemas

        except Exception as e:
            logger.error(f"[DBDesignAgent] Failed to recall user schemas: {e}")
            return []

    def get_statistics(self) -> Dict[str, Any]:
        """Get schema design statistics."""
        if self.schemas_designed > 0:
            success_rate = self.schemas_successful / self.schemas_designed
        else:
            success_rate = 0.0

        return {
            "agent_id": self.agent_id,
            "schemas_designed": self.schemas_designed,
            "schemas_successful": self.schemas_successful,
            "success_rate": success_rate,
            "memory_enabled": self.enable_memory
        }


async def get_database_design_agent(
    business_id: str = "default",
    enable_memory: bool = True
) -> DatabaseDesignAgent:
    """Factory function to create Database Design Agent."""
    agent = DatabaseDesignAgent(
        business_id=business_id,
        enable_memory=enable_memory
    )
    return agent
