"""
MemoryTool for AOP Orchestrator
================================

High-level memory interface for the Genesis AOP Orchestrator, providing:
- Workflow pattern storage and retrieval
- Task success rate tracking
- Session-based memory management
- Automatic pattern learning from execution history

Integrates with:
- MemoriClient: Low-level SQL memory storage
- CompactionService: Session memory compression
- MemoryRouter: Cross-namespace queries

Usage:
    memory = MemoryTool()

    # Store workflow execution
    await memory.store_workflow(
        task_type="code_generation",
        workflow_steps=["decompose", "route", "validate", "execute"],
        success=True,
        duration=45.2,
        session_id="session_123"
    )

    # Query successful patterns
    patterns = await memory.retrieve_workflow_patterns(
        task_type="code_generation",
        min_success_rate=0.8
    )

    # Get success metrics
    metrics = await memory.get_task_success_metrics("code_generation")

Version: 1.0
Created: November 13, 2025
"""

from __future__ import annotations

import logging
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
from dataclasses import dataclass

from infrastructure.memory.memori_client import MemoriClient
from infrastructure.memory.compaction_service import CompactionService, get_compaction_service

logger = logging.getLogger(__name__)


@dataclass
class WorkflowPattern:
    """Learned workflow pattern"""
    task_type: str
    workflow_steps: List[str]
    success_rate: float
    avg_duration: float
    sample_count: int
    last_updated: datetime


@dataclass
class TaskMetrics:
    """Success metrics for a task type"""
    task_type: str
    total_executions: int
    successful_executions: int
    failed_executions: int
    success_rate: float
    avg_duration: float
    avg_cost: float


class MemoryTool:
    """
    High-level memory tool for AOP orchestrator.

    Provides convenient methods for:
    - Storing workflow executions
    - Retrieving successful patterns
    - Tracking task success rates
    - Managing session memories
    """

    def __init__(
        self,
        client: Optional[MemoriClient] = None,
        compaction: Optional[CompactionService] = None,
        namespace: str = "orchestrator"
    ):
        """
        Initialize memory tool.

        Args:
            client: Optional MemoriClient instance
            compaction: Optional CompactionService instance
            namespace: Memory namespace for orchestrator data
        """
        self.client = client or MemoriClient()
        self.compaction = compaction or get_compaction_service(self.client)
        self.namespace = namespace
        logger.info(f"MemoryTool initialized (namespace={namespace})")

    async def store_workflow(
        self,
        task_type: str,
        workflow_steps: List[Any],
        success: bool,
        duration: float,
        session_id: str,
        cost: Optional[float] = None,
        metadata: Optional[Dict[str, Any]] = None
    ) -> None:
        """
        Store a workflow execution in memory.

        Args:
            task_type: Type of task (e.g., "code_generation", "data_analysis")
            workflow_steps: List of steps executed in the workflow
            success: Whether the workflow completed successfully
            duration: Duration in seconds
            session_id: Session identifier for grouping related workflows
            cost: Optional cost in USD
            metadata: Optional additional metadata
        """
        workflow_data = {
            "task_type": task_type,
            "workflow_steps": workflow_steps,
            "success": success,
            "duration": duration,
            "cost": cost,
            "executed_at": datetime.now(timezone.utc).isoformat()
        }

        # Merge additional metadata
        if metadata:
            workflow_data.update(metadata)

        # Generate unique key
        timestamp = datetime.now(timezone.utc).strftime("%Y%m%d_%H%M%S_%f")
        key = f"workflow_{task_type}_{timestamp}"

        # Store in session-scoped memory
        await self.client.aput(
            namespace=self.namespace,
            subject=session_id,
            key=key,
            value=workflow_data,
            metadata={
                "type": "workflow_execution",
                "task_type": task_type,
                "success": success,
                "session_id": session_id
            }
        )

        logger.debug(
            f"Stored workflow: {task_type} (success={success}, "
            f"duration={duration:.2f}s, session={session_id})"
        )

    async def retrieve_workflow_patterns(
        self,
        task_type: str,
        min_success_rate: float = 0.7,
        scope: str = "app"
    ) -> List[WorkflowPattern]:
        """
        Retrieve successful workflow patterns for a task type.

        Queries both:
        1. Live session memories (recent executions)
        2. Compacted patterns (historical learnings)

        Args:
            task_type: Type of task to query
            min_success_rate: Minimum success rate threshold (0.0-1.0)
            scope: Memory scope ("app" for global, "session" for current)

        Returns:
            List of workflow patterns sorted by success rate
        """
        patterns = []

        # Query compacted patterns (from previous sessions)
        compacted_patterns = await self._query_compacted_patterns(
            task_type,
            min_success_rate
        )
        patterns.extend(compacted_patterns)

        # Query recent executions (not yet compacted)
        recent_patterns = await self._query_recent_patterns(
            task_type,
            min_success_rate
        )
        patterns.extend(recent_patterns)

        # Sort by success rate (highest first)
        patterns.sort(key=lambda p: p.success_rate, reverse=True)

        logger.info(
            f"Retrieved {len(patterns)} workflow patterns for {task_type} "
            f"(min_success_rate={min_success_rate})"
        )

        return patterns

    async def get_task_success_metrics(self, task_type: str) -> TaskMetrics:
        """
        Get success metrics for a specific task type.

        Args:
            task_type: Type of task

        Returns:
            TaskMetrics with aggregated statistics
        """
        # Query all executions for this task type
        executions = await self.client.asearch(
            namespace=self.namespace,
            filters={"metadata.task_type": task_type},
            limit=1000
        )

        total = len(executions)
        successful = sum(1 for e in executions if e.value.get("success", False))
        failed = total - successful

        success_rate = successful / total if total > 0 else 0.0

        # Calculate averages
        durations = [e.value.get("duration", 0) for e in executions if e.value.get("success")]
        avg_duration = sum(durations) / len(durations) if durations else 0.0

        costs = [e.value.get("cost", 0) for e in executions if e.value.get("cost") is not None]
        avg_cost = sum(costs) / len(costs) if costs else 0.0

        metrics = TaskMetrics(
            task_type=task_type,
            total_executions=total,
            successful_executions=successful,
            failed_executions=failed,
            success_rate=success_rate,
            avg_duration=avg_duration,
            avg_cost=avg_cost
        )

        logger.debug(
            f"Task metrics for {task_type}: "
            f"{successful}/{total} successful ({success_rate:.1%})"
        )

        return metrics

    async def compact_session(self, session_id: str) -> None:
        """
        Trigger compaction for a completed session.

        Extracts workflow patterns and compresses session memories.

        Args:
            session_id: Session identifier to compact
        """
        logger.info(f"Triggering compaction for session {session_id}")

        metrics = await self.compaction.compact_session(
            session_id=session_id,
            namespace=self.namespace,
            extract_patterns=True
        )

        logger.info(
            f"Session compaction complete: {session_id} "
            f"(compression={metrics.compression_ratio:.1%}, "
            f"patterns={metrics.num_patterns_extracted})"
        )

    async def get_best_workflow_for_task(
        self,
        task_type: str,
        optimization_target: str = "success_rate"
    ) -> Optional[WorkflowPattern]:
        """
        Get the best-performing workflow pattern for a task type.

        Args:
            task_type: Type of task
            optimization_target: What to optimize for:
                - "success_rate": Highest success rate
                - "duration": Fastest execution
                - "cost": Lowest cost

        Returns:
            Best workflow pattern or None if no patterns found
        """
        patterns = await self.retrieve_workflow_patterns(task_type, min_success_rate=0.0)

        if not patterns:
            return None

        # Sort by optimization target
        if optimization_target == "success_rate":
            patterns.sort(key=lambda p: p.success_rate, reverse=True)
        elif optimization_target == "duration":
            patterns.sort(key=lambda p: p.avg_duration)
        elif optimization_target == "cost":
            # Cost not tracked in pattern, use success_rate as fallback
            patterns.sort(key=lambda p: p.success_rate, reverse=True)
        else:
            logger.warning(f"Unknown optimization target: {optimization_target}")
            patterns.sort(key=lambda p: p.success_rate, reverse=True)

        best = patterns[0]
        logger.info(
            f"Best workflow for {task_type} ({optimization_target}): "
            f"success_rate={best.success_rate:.1%}, "
            f"steps={len(best.workflow_steps)}"
        )

        return best

    # Private helper methods

    async def _query_compacted_patterns(
        self,
        task_type: str,
        min_success_rate: float
    ) -> List[WorkflowPattern]:
        """Query patterns from compacted sessions"""
        patterns = []

        # Search for session pattern memories
        memories = await self.client.asearch(
            namespace=self.namespace,
            filters={"metadata.type": "workflow_patterns"},
            limit=100
        )

        for memory in memories:
            stored_patterns = memory.value.get("patterns", [])

            for pattern_data in stored_patterns:
                if pattern_data["task_type"] != task_type:
                    continue

                if pattern_data["success_rate"] < min_success_rate:
                    continue

                pattern = WorkflowPattern(
                    task_type=pattern_data["task_type"],
                    workflow_steps=pattern_data["common_steps"],
                    success_rate=pattern_data["success_rate"],
                    avg_duration=pattern_data["avg_duration"],
                    sample_count=pattern_data["sample_count"],
                    last_updated=datetime.fromisoformat(pattern_data["extracted_at"])
                )
                patterns.append(pattern)

        return patterns

    async def _query_recent_patterns(
        self,
        task_type: str,
        min_success_rate: float
    ) -> List[WorkflowPattern]:
        """Query patterns from recent (non-compacted) executions"""
        # Get recent successful executions
        executions = await self.client.asearch(
            namespace=self.namespace,
            filters={
                "metadata.task_type": task_type,
                "metadata.success": True
            },
            limit=100
        )

        if not executions:
            return []

        # Aggregate into a pattern
        total_executions = len(executions)
        successful = sum(1 for e in executions if e.value.get("success", False))
        success_rate = successful / total_executions if total_executions > 0 else 0.0

        if success_rate < min_success_rate:
            return []

        # Extract common steps
        all_steps = []
        durations = []

        for execution in executions:
            steps = execution.value.get("workflow_steps", [])
            all_steps.extend(steps)
            durations.append(execution.value.get("duration", 0))

        # Count step frequency
        step_counts = {}
        for step in all_steps:
            step_key = step if isinstance(step, str) else str(step)
            step_counts[step_key] = step_counts.get(step_key, 0) + 1

        # Get most common steps
        common_steps = [
            step for step, count in step_counts.items()
            if count >= total_executions * 0.5  # Appear in >50% of workflows
        ]

        avg_duration = sum(durations) / len(durations) if durations else 0.0

        pattern = WorkflowPattern(
            task_type=task_type,
            workflow_steps=common_steps,
            success_rate=success_rate,
            avg_duration=avg_duration,
            sample_count=total_executions,
            last_updated=datetime.now(timezone.utc)
        )

        return [pattern]


# Singleton instance
_memory_tool: Optional[MemoryTool] = None


def get_memory_tool(
    client: Optional[MemoriClient] = None,
    namespace: str = "orchestrator"
) -> MemoryTool:
    """
    Get or create singleton MemoryTool instance.

    Args:
        client: Optional MemoriClient instance
        namespace: Memory namespace

    Returns:
        Singleton memory tool
    """
    global _memory_tool

    if _memory_tool is None:
        _memory_tool = MemoryTool(client=client, namespace=namespace)

    return _memory_tool


__all__ = [
    "MemoryTool",
    "WorkflowPattern",
    "TaskMetrics",
    "get_memory_tool"
]
