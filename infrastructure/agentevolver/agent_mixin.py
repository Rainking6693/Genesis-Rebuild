"""
ExperienceReuseMixin: Easy integration of experience reuse into any agent.

This mixin provides a simple interface for agents to:
- Automatically check for relevant experiences
- Make intelligent exploit/explore decisions
- Reuse successful approaches when available
- Share their experiences with other agents
- Build collective intelligence over time

Simply inherit from ExperienceReuseMixin and set experience_transfer
to enable experience reuse for any agent method.
"""

import asyncio
from typing import Callable, Any, Optional, Dict, Tuple
from .hybrid_policy import HybridPolicy, PolicyDecision
from .experience_transfer import ExperienceTransfer, ExperienceType


class ExperienceReuseMixin:
    """
    Mixin to add experience reuse capabilities to any agent.

    Usage:
        class MyAgent(ExperienceReuseMixin, BaseAgent):
            def __init__(self, ...):
                super().__init__(...)
                self.agent_type = "my_agent"
                self.experience_transfer = None  # Set externally

    Then wrap any method:
        result, decision = await self.with_experience_reuse(
            task_description="Fix bug in parser",
            generate_fn=self.my_method
        )
    """

    def __init__(self, *args, **kwargs):
        """Initialize the mixin with hybrid policy and buffers"""
        super().__init__(*args, **kwargs)
        self.agent_type: Optional[str] = None
        self.experience_transfer: Optional[ExperienceTransfer] = None
        self.hybrid_policy: HybridPolicy = HybridPolicy(exploit_ratio=0.8)

    def set_experience_transfer(self, transfer: ExperienceTransfer) -> None:
        """
        Set the experience transfer hub.

        Args:
            transfer: ExperienceTransfer instance
        """
        self.experience_transfer = transfer

    def set_policy(self, policy: HybridPolicy) -> None:
        """
        Set custom hybrid policy.

        Args:
            policy: HybridPolicy instance
        """
        self.hybrid_policy = policy

    async def with_experience_reuse(
        self,
        task_description: str,
        generate_fn: Callable[..., Any],
        experience_limit: int = 10,
        min_similarity: float = 0.3,
        adapt_experience: Optional[Callable[[Dict], Any]] = None
    ) -> Tuple[Any, PolicyDecision]:
        """
        Execute a task with intelligent experience reuse.

        This method:
        1. Searches for relevant past experiences
        2. Makes exploit/explore decision
        3. Either reuses or generates new result
        4. Records outcome for future learning

        Args:
            task_description: Description of the task
            generate_fn: Async function to generate new result
            experience_limit: Max experiences to retrieve
            min_similarity: Minimum similarity score (0.0-1.0)
            adapt_experience: Optional function to adapt experience to current context

        Returns:
            Tuple of (result, PolicyDecision)

        Raises:
            RuntimeError: If experience_transfer not set and reuse attempted
            RuntimeError: If agent_type not set
        """
        if not self.agent_type:
            raise RuntimeError("agent_type must be set before using experience reuse")

        # Get relevant experiences
        experiences = []
        best_quality = None
        if self.experience_transfer:
            experiences = await self.experience_transfer.find_similar_experiences(
                self.agent_type,
                task_description,
                limit=experience_limit,
                min_similarity=min_similarity
            )
            if experiences:
                # Use confidence as quality proxy (scale 0-1 to 0-100)
                best_quality = experiences[0].confidence * 100.0

        # Make policy decision
        has_experience = len(experiences) > 0
        policy_decision = self.hybrid_policy.make_decision(
            has_experience=has_experience,
            best_experience_quality=best_quality
        )

        # Execute based on decision
        if policy_decision.should_exploit and experiences:
            # Reuse top experience
            try:
                if adapt_experience:
                    result = adapt_experience(experiences[0].to_dict())
                else:
                    result = experiences[0].result
            except Exception as e:
                # Fallback to generate if adaptation fails
                result = await generate_fn()
        else:
            # Generate new result
            result = await generate_fn()

        return result, policy_decision

    async def record_task_outcome(
        self,
        task_description: str,
        approach: str,
        result: str,
        success: bool,
        experience_type: ExperienceType = ExperienceType.SUCCESS,
        confidence: float = 1.0,
        metadata: Optional[Dict[str, Any]] = None
    ) -> None:
        """
        Record the outcome of a task execution.

        Args:
            task_description: Description of what was done
            approach: Approach/method used
            result: Result obtained
            success: Whether the outcome was successful
            experience_type: Category of experience
            confidence: Confidence in the result (0.0-1.0)
            metadata: Additional metadata to store
        """
        if not self.agent_type:
            raise RuntimeError("agent_type must be set before recording outcomes")

        if self.experience_transfer:
            await self.experience_transfer.share_experience(
                agent_type=self.agent_type,
                task_description=task_description,
                approach=approach,
                result=result,
                success=success,
                exp_type=experience_type,
                confidence=confidence,
                metadata=metadata
            )

    async def record_policy_outcome(self, exploited: bool, success: bool) -> None:
        """
        Record the outcome of a policy decision.

        Args:
            exploited: Whether exploitation path was taken
            success: Whether the outcome was successful
        """
        self.hybrid_policy.record_outcome(exploited, success)

    async def learn_from_experience(
        self,
        task_description: str,
        generate_fn: Callable[..., Any],
        experience_limit: int = 10
    ) -> Tuple[Any, PolicyDecision, bool]:
        """
        Execute task with experience reuse AND record outcome.

        This is the full learning loop: exploit/explore, execute, record.

        Args:
            task_description: Task description
            generate_fn: Async function to generate result
            experience_limit: Max experiences to retrieve

        Returns:
            Tuple of (result, PolicyDecision, success)
        """
        try:
            result, decision = await self.with_experience_reuse(
                task_description=task_description,
                generate_fn=generate_fn,
                experience_limit=experience_limit
            )

            # Determine success (can be overridden in subclasses)
            success = result is not None and result != ""

            # Record outcome
            await self.record_policy_outcome(decision.should_exploit, success)

            return result, decision, success

        except Exception as e:
            # Record failure
            await self.record_policy_outcome(False, False)
            raise

    def get_policy_stats(self) -> Dict[str, Any]:
        """Get policy statistics"""
        return self.hybrid_policy.get_stats()

    def get_policy_summary(self) -> str:
        """Get human-readable policy summary"""
        stats = self.get_policy_stats()
        return (
            f"HybridPolicy Summary:\n"
            f"  Total Decisions: {stats['total_decisions']}\n"
            f"  Exploit Count: {stats['exploit_count']}\n"
            f"  Exploit Rate: {stats['exploit_rate']:.1f}%\n"
            f"  Exploit Success Rate: {stats['exploit_success_rate']:.2%}\n"
            f"  Explore Success Rate: {stats['explore_success_rate']:.2%}"
        )

    async def get_agent_experiences(self, limit: int = 10) -> list:
        """
        Get all recent experiences for this agent type.

        Args:
            limit: Maximum experiences

        Returns:
            List of experiences
        """
        if not self.agent_type or not self.experience_transfer:
            return []

        return await self.experience_transfer.get_agent_experiences(
            self.agent_type,
            limit
        )

    async def get_successful_experiences(self, limit: int = 10) -> list:
        """
        Get successful experiences for this agent type.

        Args:
            limit: Maximum experiences

        Returns:
            List of successful experiences
        """
        if not self.agent_type or not self.experience_transfer:
            return []

        return await self.experience_transfer.get_successful_experiences(
            self.agent_type,
            limit
        )

    async def share_experience_manually(
        self,
        task_description: str,
        approach: str,
        result: str,
        success: bool,
        metadata: Optional[Dict[str, Any]] = None
    ) -> bool:
        """
        Manually share an experience with other agents.

        Args:
            task_description: Task description
            approach: Approach used
            result: Result obtained
            success: Success indicator
            metadata: Additional metadata

        Returns:
            True if experience was shared, False if duplicate
        """
        if not self.agent_type or not self.experience_transfer:
            return False

        return await self.experience_transfer.share_experience(
            agent_type=self.agent_type,
            task_description=task_description,
            approach=approach,
            result=result,
            success=success,
            metadata=metadata
        )

    async def get_cross_agent_insights(
        self,
        other_agent_type: str,
        limit: int = 5
    ) -> Dict[str, Any]:
        """
        Get insights from another agent type's experiences.

        Useful for learning from other agents' successes.

        Args:
            other_agent_type: Type of agent to learn from
            limit: Maximum experiences to retrieve

        Returns:
            Dictionary with insights and experiences
        """
        if not self.experience_transfer:
            return {}

        experiences = await self.experience_transfer.get_successful_experiences(
            other_agent_type,
            limit
        )

        return {
            "agent_type": other_agent_type,
            "count": len(experiences),
            "experiences": [exp.to_dict() for exp in experiences]
        }

    def reset_policy_stats(self) -> None:
        """Reset policy statistics"""
        self.hybrid_policy.reset_stats()


class ExperienceReuseMixinAsync:
    """
    Async variant of ExperienceReuseMixin for fully async agents.

    Identical to ExperienceReuseMixin but without the
    expectation of inheriting from a synchronous base class.
    """

    def __init__(self):
        """Initialize the async mixin"""
        self.agent_type: Optional[str] = None
        self.experience_transfer: Optional[ExperienceTransfer] = None
        self.hybrid_policy: HybridPolicy = HybridPolicy(exploit_ratio=0.8)

    def set_experience_transfer(self, transfer: ExperienceTransfer) -> None:
        """Set the experience transfer hub"""
        self.experience_transfer = transfer

    def set_policy(self, policy: HybridPolicy) -> None:
        """Set custom hybrid policy"""
        self.hybrid_policy = policy

    async def with_experience_reuse(
        self,
        task_description: str,
        generate_fn: Callable[..., Any],
        experience_limit: int = 10,
        min_similarity: float = 0.3,
        adapt_experience: Optional[Callable[[Dict], Any]] = None
    ) -> Tuple[Any, PolicyDecision]:
        """Execute task with intelligent experience reuse"""
        if not self.agent_type:
            raise RuntimeError("agent_type must be set before using experience reuse")

        experiences = []
        best_quality = None
        if self.experience_transfer:
            experiences = await self.experience_transfer.find_similar_experiences(
                self.agent_type,
                task_description,
                limit=experience_limit,
                min_similarity=min_similarity
            )
            if experiences:
                # Use actual confidence from best experience (scale 0-1 to 0-100)
                best_quality = experiences[0].confidence * 100.0

        has_experience = len(experiences) > 0
        policy_decision = self.hybrid_policy.make_decision(
            has_experience=has_experience,
            best_experience_quality=best_quality
        )

        if policy_decision.should_exploit and experiences:
            try:
                if adapt_experience:
                    result = adapt_experience(experiences[0].to_dict())
                else:
                    result = experiences[0].result
            except Exception:
                result = await generate_fn()
        else:
            result = await generate_fn()

        return result, policy_decision

    async def record_task_outcome(
        self,
        task_description: str,
        approach: str,
        result: str,
        success: bool,
        experience_type: ExperienceType = ExperienceType.SUCCESS,
        confidence: float = 1.0,
        metadata: Optional[Dict[str, Any]] = None
    ) -> None:
        """Record task outcome"""
        if not self.agent_type:
            raise RuntimeError("agent_type must be set before recording outcomes")

        if self.experience_transfer:
            await self.experience_transfer.share_experience(
                agent_type=self.agent_type,
                task_description=task_description,
                approach=approach,
                result=result,
                success=success,
                exp_type=experience_type,
                confidence=confidence,
                metadata=metadata
            )

    async def record_policy_outcome(self, exploited: bool, success: bool) -> None:
        """Record policy outcome"""
        self.hybrid_policy.record_outcome(exploited, success)

    async def learn_from_experience(
        self,
        task_description: str,
        generate_fn: Callable[..., Any],
        experience_limit: int = 10
    ) -> Tuple[Any, PolicyDecision, bool]:
        """Execute task with full learning loop"""
        try:
            result, decision = await self.with_experience_reuse(
                task_description=task_description,
                generate_fn=generate_fn,
                experience_limit=experience_limit
            )

            success = result is not None and result != ""
            await self.record_policy_outcome(decision.should_exploit, success)

            return result, decision, success

        except Exception:
            await self.record_policy_outcome(False, False)
            raise

    def get_policy_stats(self) -> Dict[str, Any]:
        """Get policy statistics"""
        return self.hybrid_policy.get_stats()

    def get_policy_summary(self) -> str:
        """Get human-readable policy summary"""
        stats = self.get_policy_stats()
        return (
            f"HybridPolicy Summary:\n"
            f"  Total Decisions: {stats['total_decisions']}\n"
            f"  Exploit Count: {stats['exploit_count']}\n"
            f"  Exploit Rate: {stats['exploit_rate']:.1f}%\n"
            f"  Exploit Success Rate: {stats['exploit_success_rate']:.2%}\n"
            f"  Explore Success Rate: {stats['explore_success_rate']:.2%}"
        )

    async def get_agent_experiences(self, limit: int = 10) -> list:
        """Get agent experiences"""
        if not self.agent_type or not self.experience_transfer:
            return []

        return await self.experience_transfer.get_agent_experiences(
            self.agent_type,
            limit
        )

    async def get_successful_experiences(self, limit: int = 10) -> list:
        """Get successful experiences"""
        if not self.agent_type or not self.experience_transfer:
            return []

        return await self.experience_transfer.get_successful_experiences(
            self.agent_type,
            limit
        )

    def reset_policy_stats(self) -> None:
        """Reset policy statistics"""
        self.hybrid_policy.reset_stats()
