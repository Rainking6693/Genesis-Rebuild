"""
DATA JUICER AGENT - Trajectory Data Curation
Version: 1.0 (Tier 2 - High Value Memory Integration)
Created: November 13, 2025

Curates and optimizes trajectory data for training AI agents,
with persistent memory for curation patterns and data quality metrics.

MODEL: GPT-4o-mini ($0.15/1M input, $0.60/1M output)

CAPABILITIES:
- Trajectory data quality assessment
- Automated data curation and filtering
- Pattern-based data optimization
- Quality metric tracking
- Curation pattern learning
- Persistent memory for optimal curation strategies

ARCHITECTURE:
- Microsoft Agent Framework for orchestration
- MemoryTool Integration (Tier 2 - High Value):
  * App scope: Cross-agent curation pattern knowledge
  * User scope: User-specific data quality preferences
  * Semantic search for similar curation scenarios
  * 49% F1 improvement through persistent memory (MemoryOS benchmark)

MEMORY INTEGRATION (Tier 2 - High Value):
1. store_curation_pattern() - Store successful curation strategies
2. recall_curation_patterns() - Retrieve optimal curation approaches
3. store_quality_metrics() - Track data quality improvements
4. recall_quality_benchmarks() - Learn from historical quality data

Memory Scopes:
- app: Cross-agent curation knowledge (all Data Juicer agents share learnings)
- user: User-specific data quality preferences and thresholds
"""

import asyncio
import json
import logging
import os
import re
import time
import uuid
from dataclasses import dataclass, asdict
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, List, Optional, Any, Tuple
from collections import defaultdict

# Microsoft Agent Framework imports
from agent_framework import ChatAgent
from agent_framework.azure import AzureAIAgentClient
from agent_framework.observability import setup_observability
from azure.identity.aio import AzureCliCredential

# MemoryOS MongoDB adapter for persistent curation memory (NEW: 49% F1 improvement)
from infrastructure.memory_os_mongodb_adapter import (
    GenesisMemoryOSMongoDB,
    create_genesis_memory_mongodb
)

# MemoryTool for structured memory operations
from infrastructure.memory.orchestrator_memory_tool import MemoryTool

# Setup observability
setup_observability(enable_sensitive_data=True)

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@dataclass
class TrajectoryData:
    """Trajectory data structure for curation"""
    trajectory_id: str
    data: Dict[str, Any]
    quality_score: float
    metadata: Dict[str, Any]
    created_at: datetime
    curated: bool = False
    curation_notes: Optional[str] = None


@dataclass
class CurationPattern:
    """Curation pattern learned from experience"""
    pattern_id: str
    pattern_name: str
    criteria: Dict[str, Any]
    success_rate: float
    avg_quality_improvement: float
    usage_count: int
    created_at: datetime
    last_used: datetime


@dataclass
class QualityMetrics:
    """Data quality metrics"""
    total_trajectories: int
    curated_trajectories: int
    avg_quality_before: float
    avg_quality_after: float
    quality_improvement: float
    curation_time_seconds: float


class DataJuicerAgent:
    """Trajectory data curation agent with persistent memory"""

    def __init__(
        self,
        business_id: str = "default",
        enable_memory: bool = True,
        mongodb_uri: Optional[str] = None
    ):
        """
        Initialize Data Juicer Agent.

        Args:
            business_id: Business identifier for multi-tenancy
            enable_memory: Enable persistent memory integration
            mongodb_uri: Optional MongoDB connection string
        """
        self.business_id = business_id
        self.agent = None
        self.enable_memory = enable_memory

        # Initialize MemoryOS MongoDB adapter for persistent curation memory
        self.memory: Optional[GenesisMemoryOSMongoDB] = None
        if enable_memory:
            self._init_memory(mongodb_uri)

        # Initialize MemoryTool wrapper for structured memory operations
        self.memory_tool: Optional[MemoryTool] = None
        if enable_memory:
            self._init_memory_tool()

        # Track curation sessions
        self.session_id = str(uuid.uuid4())
        self.curation_stats = defaultdict(int)

        logger.info(
            f"DataJuicerAgent initialized: business_id={business_id}, "
            f"memory_enabled={enable_memory}, session_id={self.session_id}"
        )

    def _init_memory(self, mongodb_uri: Optional[str] = None) -> None:
        """Initialize MemoryOS MongoDB adapter"""
        try:
            uri = mongodb_uri or os.getenv(
                "MONGODB_URI",
                "mongodb://localhost:27017/"
            )

            self.memory = create_genesis_memory_mongodb(
                mongodb_uri=uri,
                database_name="genesis_memory",
                short_term_capacity=10,
                mid_term_capacity=2000,
                long_term_knowledge_capacity=100
            )

            logger.info(
                f"[DataJuicerAgent] MemoryOS initialized: "
                f"agent_id=data_juicer, business_id={self.business_id}"
            )

        except Exception as e:
            logger.error(f"Failed to initialize MemoryOS: {e}")
            self.memory = None
            self.enable_memory = False

    def _init_memory_tool(self) -> None:
        """Initialize MemoryTool for structured operations"""
        try:
            self.memory_tool = MemoryTool(namespace="data_juicer")
            logger.info("[DataJuicerAgent] MemoryTool initialized")
        except Exception as e:
            logger.error(f"Failed to initialize MemoryTool: {e}")
            self.memory_tool = None

    async def setup(self) -> None:
        """Setup agent with Microsoft Agent Framework"""
        try:
            # Initialize Azure AI client
            credential = AzureCliCredential()
            project_endpoint = os.getenv("AZURE_AI_PROJECT_ENDPOINT")

            if not project_endpoint:
                raise ValueError("AZURE_AI_PROJECT_ENDPOINT not set")

            client = await AzureAIAgentClient.from_azure_openai_config(
                project_endpoint=project_endpoint,
                credential=credential,
                deployment_name="gpt-4o-mini"
            )

            # Create chat agent
            self.agent = await client.create_agent(
                instructions=(
                    "You are the Data Juicer Agent, specialized in trajectory data curation. "
                    "Your role is to assess data quality, filter trajectories, and apply "
                    "learned curation patterns to optimize training data. "
                    "You learn from past successes and continuously improve curation strategies."
                ),
                model="gpt-4o-mini",
                name="DataJuicerAgent"
            )

            logger.info("DataJuicerAgent setup complete")

        except Exception as e:
            logger.error(f"Agent setup failed: {e}")
            raise

    async def curate_trajectories(
        self,
        trajectories: List[Dict[str, Any]],
        user_id: str = "default",
        min_quality_threshold: float = 0.5
    ) -> Tuple[List[Dict[str, Any]], QualityMetrics]:
        """
        Curate trajectory data using learned patterns.

        Args:
            trajectories: List of trajectory data to curate
            user_id: User identifier for personalized curation
            min_quality_threshold: Minimum quality score to retain

        Returns:
            Tuple of (curated_trajectories, quality_metrics)
        """
        start_time = time.time()

        # Recall successful curation patterns
        curation_patterns = await self.recall_curation_patterns(user_id)

        # Apply curation
        curated = []
        quality_before = []
        quality_after = []

        for traj in trajectories:
            # Assess initial quality
            quality = self._assess_quality(traj)
            quality_before.append(quality)

            # Apply learned patterns
            if curation_patterns:
                traj, quality = await self._apply_curation_patterns(
                    traj,
                    curation_patterns
                )

            # Filter by threshold
            if quality >= min_quality_threshold:
                curated.append(traj)
                quality_after.append(quality)

        # Calculate metrics
        metrics = QualityMetrics(
            total_trajectories=len(trajectories),
            curated_trajectories=len(curated),
            avg_quality_before=sum(quality_before) / len(quality_before) if quality_before else 0,
            avg_quality_after=sum(quality_after) / len(quality_after) if quality_after else 0,
            quality_improvement=(
                (sum(quality_after) / len(quality_after) - sum(quality_before) / len(quality_before))
                if quality_after and quality_before else 0
            ),
            curation_time_seconds=time.time() - start_time
        )

        # Store quality metrics
        await self.store_quality_metrics(user_id, metrics)

        logger.info(
            f"Curation complete: {len(curated)}/{len(trajectories)} trajectories retained, "
            f"quality improvement: {metrics.quality_improvement:.2%}"
        )

        return curated, metrics

    def _assess_quality(self, trajectory: Dict[str, Any]) -> float:
        """
        Assess trajectory quality score.

        Args:
            trajectory: Trajectory data to assess

        Returns:
            Quality score between 0.0 and 1.0
        """
        # Basic quality heuristics (can be enhanced with learned patterns)
        quality_factors = []

        # Factor 1: Completeness (has all required fields)
        required_fields = ['states', 'actions', 'rewards']
        completeness = sum(
            1 for field in required_fields if field in trajectory
        ) / len(required_fields)
        quality_factors.append(completeness)

        # Factor 2: Data validity (no null values in critical fields)
        validity = 1.0
        for field in required_fields:
            if field in trajectory and trajectory[field] is None:
                validity *= 0.5
        quality_factors.append(validity)

        # Factor 3: Length (reasonable trajectory length)
        if 'states' in trajectory:
            length = len(trajectory['states']) if isinstance(trajectory['states'], list) else 1
            length_score = min(1.0, length / 10)  # Optimal around 10 steps
            quality_factors.append(length_score)

        # Average quality score
        return sum(quality_factors) / len(quality_factors) if quality_factors else 0.0

    async def _apply_curation_patterns(
        self,
        trajectory: Dict[str, Any],
        patterns: List[CurationPattern]
    ) -> Tuple[Dict[str, Any], float]:
        """
        Apply learned curation patterns to trajectory.

        Args:
            trajectory: Trajectory to curate
            patterns: List of curation patterns to apply

        Returns:
            Tuple of (curated_trajectory, quality_score)
        """
        # Sort patterns by success rate
        sorted_patterns = sorted(patterns, key=lambda p: p.success_rate, reverse=True)

        curated_trajectory = trajectory.copy()

        # Apply top patterns
        for pattern in sorted_patterns[:3]:  # Apply top 3 patterns
            try:
                criteria = pattern.criteria

                # Apply pattern-specific transformations
                if 'filter_null_rewards' in criteria and criteria['filter_null_rewards']:
                    if 'rewards' in curated_trajectory:
                        rewards = curated_trajectory['rewards']
                        if isinstance(rewards, list):
                            curated_trajectory['rewards'] = [r for r in rewards if r is not None]

                if 'normalize_states' in criteria and criteria['normalize_states']:
                    # Normalize state values (placeholder - implement as needed)
                    pass

                if 'min_trajectory_length' in criteria:
                    min_length = criteria['min_trajectory_length']
                    if 'states' in curated_trajectory:
                        states = curated_trajectory['states']
                        if isinstance(states, list) and len(states) < min_length:
                            # Skip short trajectories
                            return curated_trajectory, 0.0

            except Exception as e:
                logger.warning(f"Failed to apply pattern {pattern.pattern_name}: {e}")
                continue

        # Reassess quality
        quality = self._assess_quality(curated_trajectory)

        return curated_trajectory, quality

    async def store_curation_pattern(
        self,
        user_id: str,
        pattern_name: str,
        criteria: Dict[str, Any],
        success_rate: float,
        quality_improvement: float
    ) -> None:
        """
        Store successful curation pattern in memory (app scope).

        Args:
            user_id: User identifier
            pattern_name: Name of the curation pattern
            criteria: Curation criteria/rules
            success_rate: Success rate of the pattern (0.0 to 1.0)
            quality_improvement: Average quality improvement achieved
        """
        if not self.memory:
            logger.warning("Memory not enabled - pattern storage skipped")
            return

        try:
            pattern = CurationPattern(
                pattern_id=str(uuid.uuid4()),
                pattern_name=pattern_name,
                criteria=criteria,
                success_rate=success_rate,
                avg_quality_improvement=quality_improvement,
                usage_count=1,
                created_at=datetime.now(timezone.utc),
                last_used=datetime.now(timezone.utc)
            )

            # Store in MemoryOS (app scope for cross-agent sharing)
            self.memory.store(
                agent_id="data_juicer",
                user_id=user_id,
                user_input=f"Curation pattern: {pattern_name}",
                agent_response=json.dumps(asdict(pattern)),
                memory_type="conversation"
            )

            # Also store in MemoryTool for structured queries
            if self.memory_tool:
                await self.memory_tool.store_workflow(
                    task_type=f"curation_pattern_{pattern_name}",
                    workflow_steps=list(criteria.keys()),
                    success=True,
                    duration=0.0,
                    session_id=self.session_id,
                    metadata={
                        "pattern": asdict(pattern),
                        "scope": "app"
                    }
                )

            self.curation_stats['patterns_stored'] += 1

            logger.info(
                f"Stored curation pattern: {pattern_name}, "
                f"success_rate={success_rate:.2%}, quality_improvement={quality_improvement:.2%}"
            )

        except Exception as e:
            logger.error(f"Failed to store curation pattern: {e}")

    async def recall_curation_patterns(
        self,
        user_id: str,
        top_k: int = 5
    ) -> List[CurationPattern]:
        """
        Retrieve successful curation patterns from memory (app scope).

        Args:
            user_id: User identifier
            top_k: Number of top patterns to retrieve

        Returns:
            List of curation patterns sorted by success rate
        """
        if not self.memory:
            logger.warning("Memory not enabled - pattern recall skipped")
            return []

        try:
            # Retrieve from MemoryOS
            memories = self.memory.retrieve(
                agent_id="data_juicer",
                user_id=user_id,
                query="curation pattern successful",
                memory_type=None,
                top_k=top_k
            )

            patterns = []
            for mem in memories:
                try:
                    content = mem.get('content', '')
                    # Parse pattern from stored response
                    if 'pattern_name' in content:
                        # Extract JSON from content
                        start = content.find('{')
                        if start >= 0:
                            json_str = content[start:]
                            pattern_dict = json.loads(json_str)
                            pattern = CurationPattern(**pattern_dict)
                            patterns.append(pattern)
                except Exception as e:
                    logger.warning(f"Failed to parse pattern from memory: {e}")
                    continue

            # Sort by success rate
            patterns.sort(key=lambda p: p.success_rate, reverse=True)

            self.curation_stats['patterns_recalled'] += len(patterns)

            logger.info(f"Recalled {len(patterns)} curation patterns")

            return patterns[:top_k]

        except Exception as e:
            logger.error(f"Failed to recall curation patterns: {e}")
            return []

    async def store_quality_metrics(
        self,
        user_id: str,
        metrics: QualityMetrics
    ) -> None:
        """
        Store quality metrics for tracking improvements.

        Args:
            user_id: User identifier
            metrics: Quality metrics to store
        """
        if not self.memory:
            logger.warning("Memory not enabled - metrics storage skipped")
            return

        try:
            # Store in MemoryOS (user scope for personalized tracking)
            self.memory.store(
                agent_id="data_juicer",
                user_id=user_id,
                user_input=f"Quality metrics for {metrics.total_trajectories} trajectories",
                agent_response=json.dumps(asdict(metrics)),
                memory_type="conversation"
            )

            # Also store in MemoryTool
            if self.memory_tool:
                await self.memory_tool.store_workflow(
                    task_type="quality_assessment",
                    workflow_steps=["assess", "filter", "curate"],
                    success=metrics.quality_improvement > 0,
                    duration=metrics.curation_time_seconds,
                    session_id=self.session_id,
                    metadata={
                        "metrics": asdict(metrics),
                        "scope": "user"
                    }
                )

            self.curation_stats['metrics_stored'] += 1

            logger.info(
                f"Stored quality metrics: improvement={metrics.quality_improvement:.2%}, "
                f"curated={metrics.curated_trajectories}/{metrics.total_trajectories}"
            )

        except Exception as e:
            logger.error(f"Failed to store quality metrics: {e}")

    async def recall_quality_benchmarks(
        self,
        user_id: str,
        top_k: int = 10
    ) -> List[QualityMetrics]:
        """
        Retrieve historical quality benchmarks for comparison.

        Args:
            user_id: User identifier
            top_k: Number of benchmarks to retrieve

        Returns:
            List of quality metrics from past curation sessions
        """
        if not self.memory:
            logger.warning("Memory not enabled - benchmark recall skipped")
            return []

        try:
            # Retrieve from MemoryOS
            memories = self.memory.retrieve(
                agent_id="data_juicer",
                user_id=user_id,
                query="quality metrics trajectories",
                memory_type=None,
                top_k=top_k
            )

            benchmarks = []
            for mem in memories:
                try:
                    content = mem.get('content', '')
                    # Parse metrics from stored response
                    if 'total_trajectories' in content:
                        start = content.find('{')
                        if start >= 0:
                            json_str = content[start:]
                            metrics_dict = json.loads(json_str)
                            metrics = QualityMetrics(**metrics_dict)
                            benchmarks.append(metrics)
                except Exception as e:
                    logger.warning(f"Failed to parse metrics from memory: {e}")
                    continue

            self.curation_stats['benchmarks_recalled'] += len(benchmarks)

            logger.info(f"Recalled {len(benchmarks)} quality benchmarks")

            return benchmarks

        except Exception as e:
            logger.error(f"Failed to recall quality benchmarks: {e}")
            return []

    def get_stats(self) -> Dict[str, Any]:
        """Get curation statistics"""
        return {
            "session_id": self.session_id,
            "business_id": self.business_id,
            "memory_enabled": self.enable_memory,
            "stats": dict(self.curation_stats)
        }


# Factory function for easy instantiation
def create_data_juicer_agent(
    business_id: str = "default",
    enable_memory: bool = True,
    mongodb_uri: Optional[str] = None
) -> DataJuicerAgent:
    """
    Create Data Juicer Agent instance.

    Args:
        business_id: Business identifier
        enable_memory: Enable persistent memory
        mongodb_uri: Optional MongoDB URI

    Returns:
        Configured DataJuicerAgent instance
    """
    return DataJuicerAgent(
        business_id=business_id,
        enable_memory=enable_memory,
        mongodb_uri=mongodb_uri
    )


# Example usage
if __name__ == "__main__":
    async def main():
        # Create agent
        agent = create_data_juicer_agent(
            business_id="test",
            enable_memory=True
        )

        await agent.setup()

        # Example trajectories
        trajectories = [
            {
                'trajectory_id': 'traj_1',
                'states': [1, 2, 3, 4, 5],
                'actions': ['a', 'b', 'c', 'd'],
                'rewards': [0.1, 0.2, 0.3, 0.4]
            },
            {
                'trajectory_id': 'traj_2',
                'states': [1, 2],
                'actions': ['a'],
                'rewards': None  # Poor quality
            }
        ]

        # Curate trajectories
        curated, metrics = await agent.curate_trajectories(
            trajectories=trajectories,
            user_id="test_user"
        )

        print(f"\nCuration Results:")
        print(f"  Curated: {len(curated)}/{len(trajectories)}")
        print(f"  Quality improvement: {metrics.quality_improvement:.2%}")
        print(f"\nStats: {agent.get_stats()}")

    asyncio.run(main())
