"""
ExperienceTransfer: Cross-agent experience sharing for AgentEvolver.

This module enables agents to:
- Share successful experiences with other agents
- Retrieve similar experiences from other agents
- Build collective intelligence across the agent network
- Learn from each other's successes and failures

The experience buffer is organized by agent type, allowing
semantic similarity searches and efficient retrieval of relevant experiences.
"""

import asyncio
from typing import Dict, List, Optional, Any
from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum
import hashlib
import json


class ExperienceType(Enum):
    """Category of experience"""
    SUCCESS = "success"
    FAILURE = "failure"
    OPTIMIZATION = "optimization"
    EDGE_CASE = "edge_case"


@dataclass
class Experience:
    """Represents a single agent experience"""
    agent_type: str
    task_description: str
    approach: str
    result: str
    success: bool
    experience_type: ExperienceType
    confidence: float = 1.0
    timestamp: datetime = field(default_factory=datetime.now)
    metadata: Dict[str, Any] = field(default_factory=dict)

    def get_hash(self) -> str:
        """Generate hash for deduplication"""
        content = f"{self.agent_type}:{self.task_description}:{self.approach}:{self.result}"
        return hashlib.sha256(content.encode()).hexdigest()[:16]

    def to_dict(self) -> Dict[str, Any]:
        """Convert experience to dictionary"""
        return {
            "agent_type": self.agent_type,
            "task_description": self.task_description,
            "approach": self.approach,
            "result": self.result,
            "success": self.success,
            "experience_type": self.experience_type.value,
            "confidence": self.confidence,
            "timestamp": self.timestamp.isoformat(),
            "metadata": self.metadata,
            "hash": self.get_hash()
        }

    @staticmethod
    def from_dict(data: Dict[str, Any]) -> "Experience":
        """Create Experience from dictionary"""
        return Experience(
            agent_type=data["agent_type"],
            task_description=data["task_description"],
            approach=data["approach"],
            result=data["result"],
            success=data["success"],
            experience_type=ExperienceType(data["experience_type"]),
            confidence=data.get("confidence", 1.0),
            timestamp=datetime.fromisoformat(data["timestamp"]),
            metadata=data.get("metadata", {})
        )


class ExperienceBuffer:
    """
    Manages experiences for a single agent type.

    Supports efficient retrieval and deduplication.
    """

    def __init__(self, agent_type: str, max_size: int = 1000):
        """
        Initialize ExperienceBuffer.

        Args:
            agent_type: Type of agent (e.g., "code_review", "qa")
            max_size: Maximum experiences to store
        """
        self.agent_type = agent_type
        self.max_size = max_size
        self.experiences: List[Experience] = []
        self.hashes: set = set()

    def add(self, experience: Experience) -> bool:
        """
        Add experience if not duplicate.

        Args:
            experience: Experience to add

        Returns:
            True if added, False if duplicate
        """
        exp_hash = experience.get_hash()

        if exp_hash in self.hashes:
            return False

        self.experiences.append(experience)
        self.hashes.add(exp_hash)

        # Trim if exceeding max size (keep newest)
        if len(self.experiences) > self.max_size:
            old_exp = self.experiences.pop(0)
            self.hashes.discard(old_exp.get_hash())

        return True

    def get_all(self) -> List[Experience]:
        """Get all experiences"""
        return self.experiences.copy()

    def get_by_type(self, exp_type: ExperienceType) -> List[Experience]:
        """Get experiences of specific type"""
        return [e for e in self.experiences if e.experience_type == exp_type]

    def get_successes(self, limit: Optional[int] = None) -> List[Experience]:
        """Get successful experiences, optionally limited"""
        successes = [e for e in self.experiences if e.success]
        if limit:
            return successes[-limit:]  # Return most recent
        return successes

    def similarity_score(self, task1: str, task2: str) -> float:
        """
        Simple similarity score between tasks (0.0 to 1.0).

        Args:
            task1: First task description
            task2: Second task description

        Returns:
            Similarity score
        """
        # Convert to sets of words
        words1 = set(task1.lower().split())
        words2 = set(task2.lower().split())

        if not words1 or not words2:
            return 0.0

        # Jaccard similarity
        intersection = len(words1 & words2)
        union = len(words1 | words2)
        return intersection / union if union > 0 else 0.0

    def find_similar(
        self,
        task_description: str,
        limit: int = 10,
        min_similarity: float = 0.3
    ) -> List[Experience]:
        """
        Find experiences similar to given task.

        Args:
            task_description: Task to find similar experiences for
            limit: Maximum results
            min_similarity: Minimum similarity threshold

        Returns:
            List of similar experiences, sorted by similarity
        """
        scored = [
            (exp, self.similarity_score(task_description, exp.task_description))
            for exp in self.experiences
        ]

        # Filter and sort
        filtered = [(exp, score) for exp, score in scored if score >= min_similarity]
        sorted_exps = sorted(filtered, key=lambda x: x[1], reverse=True)

        return [exp for exp, _ in sorted_exps[:limit]]

    def get_stats(self) -> Dict[str, Any]:
        """Get buffer statistics"""
        successes = len([e for e in self.experiences if e.success])
        return {
            "agent_type": self.agent_type,
            "total_experiences": len(self.experiences),
            "successful": successes,
            "failed": len(self.experiences) - successes,
            "success_rate": successes / len(self.experiences) if self.experiences else 0.0,
            "buffer_size": len(self.experiences),
            "max_size": self.max_size
        }


class ExperienceTransfer:
    """
    Central hub for cross-agent experience sharing.

    Manages experience buffers for all agent types and enables
    efficient retrieval and sharing of experiences.
    """

    def __init__(self):
        """Initialize ExperienceTransfer hub"""
        self.buffers: Dict[str, ExperienceBuffer] = {}
        self.lock = asyncio.Lock()

    async def register_agent_type(self, agent_type: str, max_size: int = 1000) -> None:
        """
        Register a new agent type.

        Args:
            agent_type: Type of agent to register
            max_size: Maximum experiences to store
        """
        async with self.lock:
            if agent_type not in self.buffers:
                self.buffers[agent_type] = ExperienceBuffer(agent_type, max_size)

    async def share_experience(
        self,
        agent_type: str,
        task_description: str,
        approach: str,
        result: str,
        success: bool,
        exp_type: ExperienceType = ExperienceType.SUCCESS,
        confidence: float = 1.0,
        metadata: Optional[Dict[str, Any]] = None
    ) -> bool:
        """
        Share an experience from an agent.

        Args:
            agent_type: Type of agent sharing experience
            task_description: Description of the task
            approach: Approach/method used
            result: Result of the approach
            success: Whether the outcome was successful
            exp_type: Type of experience
            confidence: Confidence score (0.0-1.0)
            metadata: Additional metadata

        Returns:
            True if experience was added, False if duplicate
        """
        # Ensure agent type is registered
        await self.register_agent_type(agent_type)

        experience = Experience(
            agent_type=agent_type,
            task_description=task_description,
            approach=approach,
            result=result,
            success=success,
            experience_type=exp_type,
            confidence=confidence,
            metadata=metadata or {}
        )

        async with self.lock:
            buffer = self.buffers[agent_type]
            return buffer.add(experience)

    async def get_agent_experiences(
        self,
        agent_type: str,
        limit: int = 10
    ) -> List[Experience]:
        """
        Get recent experiences from specific agent type.

        Args:
            agent_type: Type of agent
            limit: Maximum experiences

        Returns:
            List of experiences
        """
        await self.register_agent_type(agent_type)

        async with self.lock:
            buffer = self.buffers[agent_type]
            all_exps = buffer.get_all()
            return all_exps[-limit:] if all_exps else []

    async def get_successful_experiences(
        self,
        agent_type: str,
        limit: int = 10
    ) -> List[Experience]:
        """
        Get successful experiences from specific agent type.

        Args:
            agent_type: Type of agent
            limit: Maximum experiences

        Returns:
            List of successful experiences
        """
        await self.register_agent_type(agent_type)

        async with self.lock:
            buffer = self.buffers[agent_type]
            return buffer.get_successes(limit)

    async def find_similar_experiences(
        self,
        agent_type: str,
        task_description: str,
        limit: int = 10,
        min_similarity: float = 0.3
    ) -> List[Experience]:
        """
        Find experiences similar to a given task.

        Args:
            agent_type: Type of agent
            task_description: Task description
            limit: Maximum results
            min_similarity: Minimum similarity threshold

        Returns:
            List of similar experiences
        """
        await self.register_agent_type(agent_type)

        async with self.lock:
            buffer = self.buffers[agent_type]
            return buffer.find_similar(task_description, limit, min_similarity)

    async def get_all_agent_types(self) -> List[str]:
        """Get list of all registered agent types"""
        async with self.lock:
            return list(self.buffers.keys())

    async def get_hub_stats(self) -> Dict[str, Any]:
        """
        Get statistics for the entire hub.

        Returns:
            Dictionary with stats for all agent types
        """
        async with self.lock:
            stats = {
                "total_agents": len(self.buffers),
                "agents": {}
            }
            for agent_type, buffer in self.buffers.items():
                stats["agents"][agent_type] = buffer.get_stats()
            return stats

    async def clear_agent_experiences(self, agent_type: str) -> None:
        """Clear all experiences for an agent type"""
        async with self.lock:
            if agent_type in self.buffers:
                self.buffers[agent_type] = ExperienceBuffer(agent_type)

    async def export_experiences(self, agent_type: str) -> List[Dict[str, Any]]:
        """
        Export all experiences from an agent type.

        Args:
            agent_type: Type of agent

        Returns:
            List of experience dictionaries
        """
        await self.register_agent_type(agent_type)

        async with self.lock:
            buffer = self.buffers[agent_type]
            return [exp.to_dict() for exp in buffer.get_all()]

    async def import_experiences(
        self,
        agent_type: str,
        experiences: List[Dict[str, Any]]
    ) -> int:
        """
        Import experiences for an agent type.

        Args:
            agent_type: Type of agent
            experiences: List of experience dictionaries

        Returns:
            Number of experiences successfully imported
        """
        await self.register_agent_type(agent_type)

        count = 0
        async with self.lock:
            buffer = self.buffers[agent_type]
            for exp_dict in experiences:
                exp = Experience.from_dict(exp_dict)
                if buffer.add(exp):
                    count += 1

        return count
