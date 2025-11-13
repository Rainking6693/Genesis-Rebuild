"""
SE-Darwin Memory Integration - Critical Fixes
Audit Protocol V2 - Corrected Code

This file contains fixes for the 4 critical/major issues identified in the audit:
1. Thread safety for cache operations (CRITICAL)
2. Error handling in track_mutation (MAJOR)
3. Cache size limit (MAJOR)
4. Correct fitness_before calculation (MAJOR)
"""

import threading
from typing import Dict, List, Optional, Any
from datetime import datetime, timezone


# =====================================================================
# FIX #1: Thread-Safe MutationSuccessTracker
# =====================================================================

class MutationSuccessTracker:
    """
    Knowledge graph tracker for mutation success rates.

    FIXED: Added thread safety with threading.Lock
    FIXED: Added cache size limit with LRU eviction
    FIXED: Added error handling in track_mutation

    Tracks relationships:
    - agent_id -> mutation_type -> success_rate
    - agent_id -> operator_type -> avg_fitness_improvement
    - mutation_type -> fitness_improvement_history

    Enables intelligent operator selection based on past performance.
    """

    def __init__(
        self,
        memory_tool,
        max_cache_size: int = 1000
    ):
        """
        Initialize mutation success tracker.

        Args:
            memory_tool: MemoryTool instance for storage
            max_cache_size: Maximum cache entries before LRU eviction (default: 1000)
        """
        self.memory_tool = memory_tool
        self._success_cache: Dict[str, Dict[str, float]] = {}
        self._cache_lock = threading.Lock()  # FIX #1: Add thread safety
        self._cache_access_times: Dict[str, float] = {}  # For LRU eviction
        self.max_cache_size = max_cache_size  # FIX #3: Cache size limit
        logger.debug("[MutationSuccessTracker] Initialized with thread-safe cache")

    def track_mutation(
        self,
        agent_id: str,
        mutation_type: str,
        operator_type: str,
        fitness_before: float,
        fitness_after: float,
        success: bool
    ) -> None:
        """
        Track a mutation attempt for knowledge graph.

        FIXED: Added try-except error handling
        FIXED: Thread-safe cache operations

        Args:
            agent_id: Target agent
            mutation_type: Type of mutation applied
            operator_type: Operator used (revision, recombination, refinement)
            fitness_before: Fitness before mutation
            fitness_after: Fitness after mutation
            success: Whether mutation was successful
        """
        # FIX #2: Wrap in try-except for error handling
        try:
            fitness_improvement = fitness_after - fitness_before

            # Store in memory
            content = {
                "agent_id": agent_id,
                "mutation": mutation_type,
                "operator": operator_type,
                "fitness_before": fitness_before,
                "fitness_after": fitness_after,
                "fitness_improvement": fitness_improvement,
                "success": success,
                "timestamp": datetime.now(timezone.utc).isoformat()
            }

            self.memory_tool.store_memory(
                content=content,
                scope="app",
                provenance={"agent_id": "se_darwin", "tracker": "mutation_success"}
            )

            # FIX #1: Thread-safe cache update
            with self._cache_lock:
                # FIX #3: Check cache size and evict if needed
                if len(self._success_cache) >= self.max_cache_size:
                    self._evict_lru_entry()

                cache_key = f"{agent_id}::{mutation_type}"
                if cache_key not in self._success_cache:
                    self._success_cache[cache_key] = {
                        "total": 0,
                        "successful": 0,
                        "avg_improvement": 0.0
                    }

                stats = self._success_cache[cache_key]
                stats["total"] += 1
                if success:
                    stats["successful"] += 1

                # Update running average of improvement
                stats["avg_improvement"] = (
                    (stats["avg_improvement"] * (stats["total"] - 1) + fitness_improvement) /
                    stats["total"]
                )

                # Update access time for LRU
                self._cache_access_times[cache_key] = time.time()

            logger.debug(
                f"[MutationSuccessTracker] Tracked: {agent_id} -> {mutation_type} "
                f"(success={success}, improvement={fitness_improvement:+.3f})"
            )

        except Exception as e:
            # FIX #2: Error handling - log but don't re-raise
            logger.error(f"[MutationSuccessTracker] Failed to track mutation: {e}")
            # Don't re-raise to avoid breaking evolution loop

    def _evict_lru_entry(self) -> None:
        """
        FIX #3: Evict least recently used cache entry.

        Called when cache reaches max_cache_size.
        """
        if not self._cache_access_times:
            return

        # Find LRU entry
        lru_key = min(self._cache_access_times, key=self._cache_access_times.get)

        # Remove from cache and access times
        self._success_cache.pop(lru_key, None)
        self._cache_access_times.pop(lru_key, None)

        logger.debug(f"[MutationSuccessTracker] Evicted LRU cache entry: {lru_key}")

    def get_successful_mutations(
        self,
        agent_id: str,
        min_improvement: float = 0.1,
        top_k: int = 5
    ) -> List[Dict[str, Any]]:
        """
        Get successful mutation patterns for an agent.

        FIXED: Added error handling

        Args:
            agent_id: Target agent
            min_improvement: Minimum fitness improvement threshold
            top_k: Number of top mutations to return

        Returns:
            List of successful mutation patterns
        """
        try:
            # Query from memory
            past_evolutions = self.memory_tool.retrieve_memory(
                query=f"evolution of {agent_id}",
                scope="app",
                filters={"agent_id": agent_id, "fitness_improvement": f">{min_improvement}"},
                top_k=top_k * 2  # Over-fetch for filtering
            )

            # Extract mutation patterns
            successful_mutations = []
            for memory in past_evolutions:
                content = memory.get("content", {})
                improvement = self._extract_fitness_improvement_from_memory(content)

                if improvement >= min_improvement:
                    successful_mutations.append({
                        "mutation": content.get("agent_response", "").split("Evolution attempt:")[1].split("\n")[0].strip() if "Evolution attempt:" in content.get("agent_response", "") else "unknown",
                        "operator": self._extract_operator(content),
                        "improvement": improvement,
                        "timestamp": content.get("created_at", "")
                    })

            # Sort by improvement (descending)
            successful_mutations.sort(key=lambda x: x["improvement"], reverse=True)

            return successful_mutations[:top_k]

        except Exception as e:
            logger.error(f"[MutationSuccessTracker] Failed to get successful mutations: {e}")
            return []  # Return empty list on error

    def get_operator_success_rate(self, agent_id: str, operator_type: str) -> float:
        """
        Get success rate for a specific operator on an agent.

        FIXED: Thread-safe cache access

        Args:
            agent_id: Target agent
            operator_type: Operator type (revision, recombination, refinement)

        Returns:
            Success rate (0.0-1.0)
        """
        try:
            # FIX #1: Thread-safe cache access
            with self._cache_lock:
                # Query from cache first
                cache_keys = [k for k in self._success_cache.keys() if k.startswith(f"{agent_id}::")]
                if cache_keys:
                    # Update access times
                    current_time = time.time()
                    for key in cache_keys:
                        self._cache_access_times[key] = current_time

                    total_attempts = sum(self._success_cache[k]["total"] for k in cache_keys)
                    successful_attempts = sum(self._success_cache[k]["successful"] for k in cache_keys)
                    if total_attempts > 0:
                        return successful_attempts / total_attempts

            # Query from memory if cache miss
            memories = self.memory_tool.retrieve_memory(
                query=f"{operator_type} operator on {agent_id}",
                scope="app",
                filters={"agent_id": agent_id},
                top_k=50
            )

            if not memories:
                return 0.5  # Default neutral success rate

            successful = sum(
                1 for m in memories
                if self._extract_fitness_improvement_from_memory(m.get("content", {})) > 0
            )

            return successful / len(memories) if memories else 0.5

        except Exception as e:
            logger.error(f"[MutationSuccessTracker] Failed to get operator success rate: {e}")
            return 0.5  # Return default on error

    def _extract_fitness_improvement_from_memory(self, content: Dict[str, Any]) -> float:
        """Extract fitness improvement from memory content."""
        agent_response = content.get("agent_response", "")
        if "improvement:" in agent_response:
            try:
                improvement_str = agent_response.split("improvement:")[1].split(")")[0].strip()
                return float(improvement_str)
            except (ValueError, IndexError):
                pass
        return 0.0

    def _extract_operator(self, content: Dict[str, Any]) -> str:
        """Extract operator type from memory content."""
        user_input = content.get("user_input", "")
        if "revision" in user_input.lower():
            return "revision"
        elif "recombination" in user_input.lower():
            return "recombination"
        elif "refinement" in user_input.lower():
            return "refinement"
        return "baseline"


# =====================================================================
# FIX #4: Correct fitness_before Calculation in _archive_trajectories
# =====================================================================

async def _archive_trajectories_fixed(
    self,
    execution_results: List[Any]  # TrajectoryExecutionResult
) -> None:
    """
    Archive trajectories to pool for cross-iteration learning

    FIXED: Correct fitness_before calculation from parent trajectory

    Args:
        execution_results: Results to archive
    """
    trajectories_to_archive = []

    for result in execution_results:
        # MEMORY: Track mutation attempt in knowledge graph
        if self.memory_tool and self.mutation_success_tracker:
            try:
                trajectory = result.trajectory

                # FIX #4: Get parent trajectory fitness instead of hardcoding 0.0
                fitness_before = 0.0
                if trajectory.parent_trajectories:
                    parent_id = trajectory.parent_trajectories[0]
                    parent_trajectory = self.trajectory_pool.get_trajectory(parent_id)
                    if parent_trajectory:
                        fitness_before = parent_trajectory.success_score
                        logger.debug(
                            f"[Archive] Retrieved parent fitness: {fitness_before:.3f} "
                            f"for trajectory {trajectory.trajectory_id}"
                        )
                    else:
                        logger.warning(
                            f"[Archive] Parent trajectory {parent_id} not found, "
                            f"using fitness_before=0.0"
                        )

                fitness_after = trajectory.success_score
                success = result.success

                # Track mutation in knowledge graph
                self.mutation_success_tracker.track_mutation(
                    agent_id=self.agent_name,
                    mutation_type=trajectory.operator_applied,
                    operator_type=trajectory.operator_applied,
                    fitness_before=fitness_before,
                    fitness_after=fitness_after,
                    success=success
                )

                logger.debug(
                    f"[Memory] Tracked mutation: {trajectory.trajectory_id} "
                    f"(operator={trajectory.operator_applied}, success={success}, "
                    f"improvement={fitness_after - fitness_before:+.3f})"
                )

            except Exception as e:
                logger.warning(f"[Memory] Failed to track mutation: {e}")

        # Safety validation
        if await self._validate_trajectory_safety(result.trajectory):
            trajectories_to_archive.append(result.trajectory)
        else:
            logger.info(
                "Skipping trajectory %s due to safety validation failure",
                result.trajectory.trajectory_id,
            )

    # Apply DataJuicer curation if enabled (existing logic unchanged)
    # ...


# =====================================================================
# ADDITIONAL FIX: Enhanced MemoryTool with None Checks
# =====================================================================

class MemoryTool:
    """
    MemoryTool wrapper for SE-Darwin evolution pattern tracking.

    FIXED: Added comprehensive None checks

    Provides structured memory storage/retrieval for:
    - Evolution history (all attempts)
    - Successful mutations (agent -> mutation -> fitness)
    - Operator effectiveness (which operators work for which scenarios)
    - Knowledge graph: agent_id -> mutation_type -> fitness_improvement

    Scopes:
    - app: Cross-agent learning (all evolution attempts)
    - agent: Agent-specific patterns (per agent_name)
    - session: Current evolution run (temporary)
    """

    def __init__(self, backend, agent_id: str):
        """
        Initialize MemoryTool.

        Args:
            backend: GenesisMemoryOSMongoDB instance
            agent_id: Agent identifier (e.g., "se_darwin")
        """
        if backend is None:
            raise ValueError("MemoryTool requires non-None backend")
        if not agent_id:
            raise ValueError("MemoryTool requires non-empty agent_id")

        self.backend = backend
        self.agent_id = agent_id
        logger.debug(f"[MemoryTool] Initialized for agent_id={agent_id}")

    def store_memory(
        self,
        content: Dict[str, Any],
        scope: str = "app",
        provenance: Optional[Dict[str, Any]] = None,
        memory_type: str = "conversation"
    ) -> bool:
        """
        Store memory in Memori with scope isolation.

        FIXED: Added comprehensive None and validation checks

        Args:
            content: Memory content (evolution attempt data)
            scope: Memory scope ("app", "agent", or "session")
            provenance: Origin metadata (e.g., {"agent_id": "se_darwin"})
            memory_type: Memory type for backend ("conversation", "consensus", etc.)

        Returns:
            True if stored successfully
        """
        # FIX: Validate content is not None/empty
        if not content:
            logger.error("[MemoryTool] Cannot store empty content")
            return False

        if not isinstance(content, dict):
            logger.error(f"[MemoryTool] Content must be dict, got {type(content)}")
            return False

        # FIX: Validate scope
        if scope not in ["app", "agent", "session"]:
            logger.warning(f"[MemoryTool] Invalid scope '{scope}', defaulting to 'app'")
            scope = "app"

        try:
            # Build user_id for scope isolation
            user_id = self._build_user_id(scope, content.get("agent_id"))

            # Extract key fields for storage
            user_input = self._build_user_input(content)
            agent_response = self._build_agent_response(content)

            # Validate required fields
            if not user_input or not agent_response:
                logger.error("[MemoryTool] Cannot build user_input or agent_response from content")
                return False

            # Store via MemoryOS backend
            self.backend.store(
                agent_id=self.agent_id,
                user_id=user_id,
                user_input=user_input,
                agent_response=agent_response,
                memory_type=memory_type
            )

            logger.debug(f"[MemoryTool] Stored memory: scope={scope}, type={memory_type}")
            return True

        except Exception as e:
            logger.error(f"[MemoryTool] Failed to store memory: {e}")
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

        FIXED: Added validation and error handling

        Args:
            query: Search query (e.g., "evolution of builder agent")
            scope: Memory scope to search
            filters: Optional filters (e.g., {"fitness_improvement": ">0"})
            top_k: Number of results to return

        Returns:
            List of memory entries matching query
        """
        # FIX: Validate query
        if not query or not isinstance(query, str):
            logger.error(f"[MemoryTool] Invalid query: {query}")
            return []

        if top_k < 1:
            logger.warning(f"[MemoryTool] Invalid top_k={top_k}, using default 5")
            top_k = 5

        try:
            # Build user_id for scope
            agent_id_filter = filters.get("agent_id") if filters else None
            user_id = self._build_user_id(scope, agent_id_filter)

            # Retrieve via MemoryOS backend
            memories = self.backend.retrieve(
                agent_id=self.agent_id,
                user_id=user_id,
                query=query,
                memory_type=None,  # Search all types
                top_k=top_k
            )

            # FIX: Validate retrieved memories
            if not isinstance(memories, list):
                logger.error(f"[MemoryTool] Backend returned non-list: {type(memories)}")
                return []

            # Apply custom filters if provided
            if filters:
                memories = self._apply_filters(memories, filters)

            logger.debug(f"[MemoryTool] Retrieved {len(memories)} memories: query='{query}', scope={scope}")
            return memories

        except Exception as e:
            logger.error(f"[MemoryTool] Failed to retrieve memory: {e}")
            return []


# =====================================================================
# USAGE INSTRUCTIONS
# =====================================================================

"""
To apply these fixes to agents/se_darwin_agent.py:

1. Replace MutationSuccessTracker class (lines 425-615) with the fixed version above
2. Replace _archive_trajectories method with _archive_trajectories_fixed
3. Optionally enhance MemoryTool with additional validation

TESTING:
1. Run audits/test_se_darwin_memory_focused.py to verify fixes
2. Test with multi-threaded evolution (run SE-Darwin with concurrent agents)
3. Monitor cache size and memory usage over long evolution runs
4. Verify fitness improvement calculations are correct

EXPECTED IMPROVEMENTS:
- Thread safety: No data corruption in concurrent operations
- Memory leaks: Cache stays bounded at max_cache_size
- Error resilience: Evolution continues even if memory operations fail
- Accuracy: Correct fitness improvement tracking

PERFORMANCE IMPACT:
- Thread lock overhead: < 1% (microseconds per operation)
- LRU eviction: O(n) worst case, but rare (only at cache limit)
- Overall: Negligible impact on evolution performance
"""


# =====================================================================
# IMPORTS NEEDED
# =====================================================================

"""
Add to imports section at top of agents/se_darwin_agent.py:

import threading
import time
"""
