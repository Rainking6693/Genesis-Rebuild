"""
LangGraph Store API Integration with MongoDB Backend

This module implements the LangGraph Store abstraction for Genesis multi-agent system,
providing persistent memory storage across agent sessions, businesses, and evolution cycles.

Features:
- Async MongoDB backend for production use
- Namespace-based organization (agent, business, evolution, consensus)
- Full CRUD operations (put, get, delete, search)
- Cross-session memory persistence
- <100ms target latency for put/get operations

Usage:
    store = GenesisLangGraphStore()
    await store.put(("agent", "qa_agent"), "preferences", {"threshold": 0.95})
    data = await store.get(("agent", "qa_agent"), "preferences")
"""

import asyncio
from typing import Optional, Dict, List, Any, Tuple
from datetime import datetime
import logging
from motor.motor_asyncio import AsyncIOMotorClient
from langgraph.store.base import BaseStore

logger = logging.getLogger(__name__)


class GenesisLangGraphStore(BaseStore):
    """
    LangGraph Store implementation backed by MongoDB.

    Provides persistent memory storage for Genesis agents with namespace-based organization.
    Compatible with LangGraph's BaseStore interface for seamless integration.

    Namespace Types:
        - ("agent", agent_name): Agent-specific configurations and learned patterns
        - ("business", business_id): Business-specific context and history
        - ("evolution", generation_id): SE-Darwin evolution logs and trajectories
        - ("consensus", procedure_id): Verified team procedures and best practices

    Attributes:
        client: AsyncIOMotorClient for MongoDB connection
        db: Database handle for genesis_memory
        _connection_pool_size: Max concurrent connections (default: 100)
    """

    def __init__(
        self,
        mongodb_uri: str = "mongodb://localhost:27017/",
        database_name: str = "genesis_memory",
        connection_pool_size: int = 100,
        timeout_ms: int = 5000
    ):
        """
        Initialize LangGraph Store with MongoDB backend.

        Args:
            mongodb_uri: MongoDB connection string
            database_name: Database name for memory storage
            connection_pool_size: Max concurrent connections
            timeout_ms: Operation timeout in milliseconds
        """
        self.client = AsyncIOMotorClient(
            mongodb_uri,
            maxPoolSize=connection_pool_size,
            serverSelectionTimeoutMS=timeout_ms
        )
        self.db = self.client[database_name]
        self._timeout_ms = timeout_ms
        logger.info(f"Initialized GenesisLangGraphStore with database: {database_name}")

    async def put(
        self,
        namespace: Tuple[str, ...],
        key: str,
        value: Dict[str, Any],
        metadata: Optional[Dict[str, Any]] = None
    ) -> None:
        """
        Store data in the specified namespace.

        Example:
            await store.put(("agent", "qa_agent"), "preferences", {"threshold": 0.95})

        Args:
            namespace: Tuple identifying the namespace (e.g., ("agent", "qa_agent"))
            key: Unique key within the namespace
            value: Data to store (must be JSON-serializable dict)
            metadata: Optional metadata for the entry

        Raises:
            ValueError: If namespace or key is empty
            TimeoutError: If operation exceeds timeout
        """
        if not namespace or not key:
            raise ValueError("Namespace and key must be non-empty")

        collection = self._get_collection(namespace)

        document = {
            "key": key,
            "namespace": list(namespace),
            "value": value,
            "metadata": metadata or {},
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }

        try:
            await asyncio.wait_for(
                collection.update_one(
                    {"key": key},
                    {"$set": document},
                    upsert=True
                ),
                timeout=self._timeout_ms / 1000
            )
            logger.debug(f"Stored {namespace}:{key}")
        except asyncio.TimeoutError:
            logger.error(f"Timeout storing {namespace}:{key}")
            raise TimeoutError(f"Put operation exceeded {self._timeout_ms}ms")

    async def get(
        self,
        namespace: Tuple[str, ...],
        key: str
    ) -> Optional[Dict[str, Any]]:
        """
        Retrieve data from the specified namespace.

        Example:
            data = await store.get(("agent", "qa_agent"), "preferences")

        Args:
            namespace: Tuple identifying the namespace
            key: Unique key within the namespace

        Returns:
            Stored value dict, or None if not found

        Raises:
            TimeoutError: If operation exceeds timeout
        """
        collection = self._get_collection(namespace)

        try:
            doc = await asyncio.wait_for(
                collection.find_one({"key": key}),
                timeout=self._timeout_ms / 1000
            )

            if doc:
                logger.debug(f"Retrieved {namespace}:{key}")
                return doc.get("value")
            else:
                logger.debug(f"Key not found: {namespace}:{key}")
                return None
        except asyncio.TimeoutError:
            logger.error(f"Timeout retrieving {namespace}:{key}")
            raise TimeoutError(f"Get operation exceeded {self._timeout_ms}ms")

    async def delete(
        self,
        namespace: Tuple[str, ...],
        key: str
    ) -> bool:
        """
        Delete data from the specified namespace.

        Example:
            deleted = await store.delete(("agent", "qa_agent"), "old_config")

        Args:
            namespace: Tuple identifying the namespace
            key: Unique key within the namespace

        Returns:
            True if deleted, False if key didn't exist

        Raises:
            TimeoutError: If operation exceeds timeout
        """
        collection = self._get_collection(namespace)

        try:
            result = await asyncio.wait_for(
                collection.delete_one({"key": key}),
                timeout=self._timeout_ms / 1000
            )

            deleted = result.deleted_count > 0
            if deleted:
                logger.debug(f"Deleted {namespace}:{key}")
            else:
                logger.debug(f"Key not found for deletion: {namespace}:{key}")
            return deleted
        except asyncio.TimeoutError:
            logger.error(f"Timeout deleting {namespace}:{key}")
            raise TimeoutError(f"Delete operation exceeded {self._timeout_ms}ms")

    async def search(
        self,
        namespace: Tuple[str, ...],
        query: Optional[Dict[str, Any]] = None,
        limit: int = 100
    ) -> List[Dict[str, Any]]:
        """
        Search for entries within the specified namespace.

        Example:
            # Find all preferences for qa_agent
            results = await store.search(("agent", "qa_agent"))

            # Find specific entries
            results = await store.search(
                ("agent", "qa_agent"),
                query={"value.threshold": {"$gt": 0.9}}
            )

        Args:
            namespace: Tuple identifying the namespace
            query: MongoDB query dict (optional, searches all if None)
            limit: Maximum number of results to return

        Returns:
            List of matching documents

        Raises:
            TimeoutError: If operation exceeds timeout
        """
        collection = self._get_collection(namespace)

        # Build query
        search_query = query or {}

        try:
            cursor = collection.find(search_query).limit(limit)
            results = await asyncio.wait_for(
                cursor.to_list(length=limit),
                timeout=self._timeout_ms / 1000
            )

            logger.debug(f"Search in {namespace} returned {len(results)} results")
            return [
                {
                    "key": doc["key"],
                    "value": doc["value"],
                    "metadata": doc.get("metadata", {}),
                    "created_at": doc.get("created_at"),
                    "updated_at": doc.get("updated_at")
                }
                for doc in results
            ]
        except asyncio.TimeoutError:
            logger.error(f"Timeout searching {namespace}")
            raise TimeoutError(f"Search operation exceeded {self._timeout_ms}ms")

    async def list_namespaces(
        self,
        prefix: Optional[Tuple[str, ...]] = None
    ) -> List[Tuple[str, ...]]:
        """
        List all namespaces, optionally filtered by prefix.

        Example:
            # List all agent namespaces
            agent_namespaces = await store.list_namespaces(("agent",))

        Args:
            prefix: Namespace prefix to filter by (optional)

        Returns:
            List of namespace tuples
        """
        collection_names = await self.db.list_collection_names()

        namespaces = []
        for coll_name in collection_names:
            if coll_name.startswith("system."):
                continue

            # Convert collection name back to namespace tuple
            namespace = tuple(coll_name.split("_"))

            # Filter by prefix if provided
            if prefix is None or namespace[:len(prefix)] == prefix:
                namespaces.append(namespace)

        return namespaces

    async def clear_namespace(
        self,
        namespace: Tuple[str, ...]
    ) -> int:
        """
        Delete all entries in a namespace.

        Example:
            deleted_count = await store.clear_namespace(("agent", "old_agent"))

        Args:
            namespace: Tuple identifying the namespace

        Returns:
            Number of entries deleted
        """
        collection = self._get_collection(namespace)

        try:
            result = await asyncio.wait_for(
                collection.delete_many({}),
                timeout=self._timeout_ms / 1000
            )

            count = result.deleted_count
            logger.info(f"Cleared {count} entries from {namespace}")
            return count
        except asyncio.TimeoutError:
            logger.error(f"Timeout clearing {namespace}")
            raise TimeoutError(f"Clear operation exceeded {self._timeout_ms}ms")

    def _get_collection(self, namespace: Tuple[str, ...]) -> Any:
        """
        Get MongoDB collection for the specified namespace.

        Collections are named by joining namespace components with underscores.
        Example: ("agent", "qa_agent") -> "agent_qa_agent"

        Args:
            namespace: Tuple identifying the namespace

        Returns:
            MongoDB collection handle
        """
        collection_name = "_".join(str(component) for component in namespace)
        return self.db[collection_name]

    async def close(self) -> None:
        """
        Close the MongoDB connection.

        Should be called during application shutdown.
        """
        self.client.close()
        logger.info("Closed GenesisLangGraphStore connection")

    async def health_check(self) -> Dict[str, Any]:
        """
        Check MongoDB connection health.

        Returns:
            Dict with health status information
        """
        try:
            await asyncio.wait_for(
                self.client.admin.command('ping'),
                timeout=2.0
            )

            stats = await self.db.command("dbStats")

            return {
                "status": "healthy",
                "database": self.db.name,
                "collections": await self.db.list_collection_names(),
                "size_mb": stats.get("dataSize", 0) / (1024 * 1024),
                "connected": True
            }
        except Exception as e:
            logger.error(f"Health check failed: {e}")
            return {
                "status": "unhealthy",
                "error": str(e),
                "connected": False
            }


# Singleton instance for global access
_store_instance: Optional[GenesisLangGraphStore] = None


def get_store(
    mongodb_uri: str = "mongodb://localhost:27017/",
    **kwargs
) -> GenesisLangGraphStore:
    """
    Get or create singleton GenesisLangGraphStore instance.

    Args:
        mongodb_uri: MongoDB connection string
        **kwargs: Additional arguments passed to GenesisLangGraphStore

    Returns:
        Singleton store instance
    """
    global _store_instance

    if _store_instance is None:
        _store_instance = GenesisLangGraphStore(mongodb_uri, **kwargs)

    return _store_instance
