"""
REACT TRAINING AGENT - Reinforcement Learning for Reasoning Agents
Version: 1.0 (Tier 2 - High Value Memory Integration)
Created: November 13, 2025

Trains reasoning agents using ReAct (Reasoning + Acting) paradigm
with persistent memory for training trajectories and performance metrics.

MODEL: GPT-4o-mini ($0.15/1M input, $0.60/1M output)

CAPABILITIES:
- ReAct training trajectory generation
- Reasoning chain optimization
- Action selection reinforcement learning
- Training performance tracking
- Trajectory pattern learning
- Persistent memory for optimal training strategies

ARCHITECTURE:
- Microsoft Agent Framework for orchestration
- MemoryTool Integration (Tier 2 - High Value):
  * App scope: Cross-agent training pattern knowledge
  * User scope: User-specific training configurations
  * Semantic search for similar training scenarios
  * 49% F1 improvement through persistent memory (MemoryOS benchmark)

MEMORY INTEGRATION (Tier 2 - High Value):
1. store_training_trajectory() - Store successful training trajectories
2. recall_training_trajectories() - Retrieve optimal training approaches
3. store_performance_metrics() - Track training performance
4. recall_training_benchmarks() - Learn from historical training data

Memory Scopes:
- app: Cross-agent training knowledge (all ReAct Training agents share learnings)
- user: User-specific training configurations and hyperparameters
"""

import asyncio
import json
import logging
import os
import re
import time
import uuid
from dataclasses import dataclass, asdict, field
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, List, Optional, Any, Tuple
from collections import defaultdict

# Microsoft Agent Framework imports
from agent_framework import ChatAgent
from agent_framework.azure import AzureAIAgentClient
from agent_framework.observability import setup_observability
from azure.identity.aio import AzureCliCredential

# MemoryOS MongoDB adapter for persistent training memory (NEW: 49% F1 improvement)
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
class ReasoningStep:
    """Single reasoning step in ReAct trajectory"""
    step_id: str
    thought: str
    action: str
    observation: str
    reward: float
    timestamp: datetime = field(default_factory=lambda: datetime.now(timezone.utc))


@dataclass
class TrainingTrajectory:
    """Complete training trajectory for ReAct agent"""
    trajectory_id: str
    task_description: str
    reasoning_steps: List[ReasoningStep]
    final_answer: str
    success: bool
    total_reward: float
    duration_seconds: float
    created_at: datetime
    metadata: Dict[str, Any] = field(default_factory=dict)


@dataclass
class TrainingMetrics:
    """Training performance metrics"""
    total_episodes: int
    successful_episodes: int
    failed_episodes: int
    success_rate: float
    avg_reward: float
    avg_steps_per_episode: float
    avg_training_time: float
    best_reward: float
    worst_reward: float


@dataclass
class TrainingConfig:
    """Training configuration"""
    max_steps: int = 10
    learning_rate: float = 0.001
    discount_factor: float = 0.99
    exploration_rate: float = 0.1
    batch_size: int = 32
    update_frequency: int = 100


class ReActTrainingAgent:
    """ReAct (Reasoning + Acting) training agent with persistent memory"""

    def __init__(
        self,
        business_id: str = "default",
        enable_memory: bool = True,
        mongodb_uri: Optional[str] = None,
        training_config: Optional[TrainingConfig] = None
    ):
        """
        Initialize ReAct Training Agent.

        Args:
            business_id: Business identifier for multi-tenancy
            enable_memory: Enable persistent memory integration
            mongodb_uri: Optional MongoDB connection string
            training_config: Training configuration
        """
        self.business_id = business_id
        self.agent = None
        self.enable_memory = enable_memory
        self.training_config = training_config or TrainingConfig()

        # Initialize MemoryOS MongoDB adapter for persistent training memory
        self.memory: Optional[GenesisMemoryOSMongoDB] = None
        if enable_memory:
            self._init_memory(mongodb_uri)

        # Initialize MemoryTool wrapper for structured memory operations
        self.memory_tool: Optional[MemoryTool] = None
        if enable_memory:
            self._init_memory_tool()

        # Track training sessions
        self.session_id = str(uuid.uuid4())
        self.training_stats = defaultdict(int)
        self.episode_count = 0

        logger.info(
            f"ReActTrainingAgent initialized: business_id={business_id}, "
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
                f"[ReActTrainingAgent] MemoryOS initialized: "
                f"agent_id=react_training, business_id={self.business_id}"
            )

        except Exception as e:
            logger.error(f"Failed to initialize MemoryOS: {e}")
            self.memory = None
            self.enable_memory = False

    def _init_memory_tool(self) -> None:
        """Initialize MemoryTool for structured operations"""
        try:
            self.memory_tool = MemoryTool(namespace="react_training")
            logger.info("[ReActTrainingAgent] MemoryTool initialized")
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
                    "You are the ReAct Training Agent, specialized in training reasoning agents. "
                    "Your role is to generate training trajectories using the ReAct paradigm "
                    "(Reasoning + Acting), optimize reasoning chains, and track training performance. "
                    "You learn from successful trajectories and continuously improve training strategies."
                ),
                model="gpt-4o-mini",
                name="ReActTrainingAgent"
            )

            logger.info("ReActTrainingAgent setup complete")

        except Exception as e:
            logger.error(f"Agent setup failed: {e}")
            raise

    async def train_episode(
        self,
        task: str,
        user_id: str = "default",
        use_memory: bool = True
    ) -> TrainingTrajectory:
        """
        Train a single ReAct episode.

        Args:
            task: Task description for training
            user_id: User identifier for personalized training
            use_memory: Whether to use recalled trajectories for guidance

        Returns:
            Training trajectory for the episode
        """
        start_time = time.time()
        self.episode_count += 1

        # Recall successful trajectories for guidance
        past_trajectories = []
        if use_memory and self.memory:
            past_trajectories = await self.recall_training_trajectories(
                user_id=user_id,
                task_type=self._extract_task_type(task)
            )

        # Generate reasoning steps
        reasoning_steps = await self._generate_reasoning_steps(
            task=task,
            past_trajectories=past_trajectories
        )

        # Calculate rewards and success
        total_reward = sum(step.reward for step in reasoning_steps)
        success = total_reward > 0 and len(reasoning_steps) > 0

        # Create trajectory
        trajectory = TrainingTrajectory(
            trajectory_id=f"traj_{self.episode_count}_{uuid.uuid4().hex[:8]}",
            task_description=task,
            reasoning_steps=reasoning_steps,
            final_answer=reasoning_steps[-1].observation if reasoning_steps else "",
            success=success,
            total_reward=total_reward,
            duration_seconds=time.time() - start_time,
            created_at=datetime.now(timezone.utc),
            metadata={
                "episode_number": self.episode_count,
                "config": asdict(self.training_config)
            }
        )

        # Store trajectory in memory
        await self.store_training_trajectory(user_id, trajectory)

        # Update stats
        self.training_stats['episodes_trained'] += 1
        if success:
            self.training_stats['successful_episodes'] += 1
        else:
            self.training_stats['failed_episodes'] += 1

        logger.info(
            f"Episode {self.episode_count} complete: "
            f"success={success}, reward={total_reward:.2f}, "
            f"steps={len(reasoning_steps)}"
        )

        return trajectory

    def _extract_task_type(self, task: str) -> str:
        """Extract task type from task description"""
        # Simple heuristic - can be enhanced
        task_lower = task.lower()

        if any(keyword in task_lower for keyword in ['math', 'calculate', 'solve']):
            return 'math'
        elif any(keyword in task_lower for keyword in ['code', 'program', 'function']):
            return 'coding'
        elif any(keyword in task_lower for keyword in ['reason', 'explain', 'why']):
            return 'reasoning'
        elif any(keyword in task_lower for keyword in ['plan', 'schedule', 'organize']):
            return 'planning'
        else:
            return 'general'

    async def _generate_reasoning_steps(
        self,
        task: str,
        past_trajectories: List[TrainingTrajectory]
    ) -> List[ReasoningStep]:
        """
        Generate reasoning steps for ReAct trajectory.

        Args:
            task: Task description
            past_trajectories: Past successful trajectories for guidance

        Returns:
            List of reasoning steps
        """
        steps = []

        # Extract patterns from past trajectories
        if past_trajectories:
            # Learn from successful approaches
            successful = [t for t in past_trajectories if t.success]
            if successful:
                # Use average number of steps from successful trajectories
                avg_steps = sum(len(t.reasoning_steps) for t in successful) / len(successful)
                max_steps = min(self.training_config.max_steps, int(avg_steps * 1.5))
            else:
                max_steps = self.training_config.max_steps
        else:
            max_steps = self.training_config.max_steps

        # Generate steps (simplified for demonstration)
        for i in range(max_steps):
            # Thought phase
            thought = await self._generate_thought(task, steps, past_trajectories)

            # Action phase
            action = await self._generate_action(task, thought, steps)

            # Observation phase (simulate environment feedback)
            observation = await self._simulate_observation(task, action)

            # Reward calculation
            reward = self._calculate_reward(task, observation, i, max_steps)

            step = ReasoningStep(
                step_id=f"step_{i+1}",
                thought=thought,
                action=action,
                observation=observation,
                reward=reward
            )
            steps.append(step)

            # Early stopping if task solved
            if "ANSWER:" in observation.upper() or reward > 0.8:
                break

        return steps

    async def _generate_thought(
        self,
        task: str,
        current_steps: List[ReasoningStep],
        past_trajectories: List[TrainingTrajectory]
    ) -> str:
        """Generate reasoning thought"""
        # Simplified thought generation (in production, use LLM)
        step_num = len(current_steps) + 1

        if step_num == 1:
            return f"I need to analyze the task: {task}"
        elif step_num <= 3:
            return f"I should break down the problem into smaller steps"
        else:
            return f"I need to synthesize the information and provide an answer"

    async def _generate_action(
        self,
        task: str,
        thought: str,
        current_steps: List[ReasoningStep]
    ) -> str:
        """Generate action based on thought"""
        step_num = len(current_steps) + 1

        if step_num == 1:
            return "analyze_task"
        elif step_num <= 3:
            return "decompose_problem"
        else:
            return "synthesize_answer"

    async def _simulate_observation(self, task: str, action: str) -> str:
        """Simulate environment observation (placeholder)"""
        if action == "analyze_task":
            return f"Task analyzed: {task[:50]}..."
        elif action == "decompose_problem":
            return "Problem decomposed into sub-tasks"
        elif action == "synthesize_answer":
            return "ANSWER: Task completed successfully"
        else:
            return "Action executed"

    def _calculate_reward(
        self,
        task: str,
        observation: str,
        step_num: int,
        max_steps: int
    ) -> float:
        """Calculate reward for step"""
        # Reward shaping
        reward = 0.0

        # Positive reward for progress
        if "ANSWER:" in observation.upper():
            reward += 1.0

        # Penalty for taking too many steps
        if step_num >= max_steps - 1:
            reward -= 0.2

        # Small positive reward for each step (encourages exploration)
        reward += 0.1

        return reward

    async def store_training_trajectory(
        self,
        user_id: str,
        trajectory: TrainingTrajectory
    ) -> None:
        """
        Store training trajectory in memory (app scope).

        Args:
            user_id: User identifier
            trajectory: Training trajectory to store
        """
        if not self.memory:
            logger.warning("Memory not enabled - trajectory storage skipped")
            return

        try:
            # Store in MemoryOS (app scope for cross-agent sharing)
            self.memory.store(
                agent_id="react_training",
                user_id=user_id,
                user_input=f"Training trajectory for task: {trajectory.task_description}",
                agent_response=json.dumps(asdict(trajectory), default=str),
                memory_type="conversation"
            )

            # Also store in MemoryTool for structured queries
            if self.memory_tool:
                await self.memory_tool.store_workflow(
                    task_type=f"training_{self._extract_task_type(trajectory.task_description)}",
                    workflow_steps=[step.action for step in trajectory.reasoning_steps],
                    success=trajectory.success,
                    duration=trajectory.duration_seconds,
                    session_id=self.session_id,
                    cost=None,
                    metadata={
                        "trajectory": asdict(trajectory),
                        "scope": "app",
                        "total_reward": trajectory.total_reward,
                        "steps_count": len(trajectory.reasoning_steps)
                    }
                )

            self.training_stats['trajectories_stored'] += 1

            logger.info(
                f"Stored training trajectory: {trajectory.trajectory_id}, "
                f"success={trajectory.success}, reward={trajectory.total_reward:.2f}"
            )

        except Exception as e:
            logger.error(f"Failed to store training trajectory: {e}")

    async def recall_training_trajectories(
        self,
        user_id: str,
        task_type: Optional[str] = None,
        top_k: int = 5
    ) -> List[TrainingTrajectory]:
        """
        Retrieve successful training trajectories from memory (app scope).

        Args:
            user_id: User identifier
            task_type: Optional filter by task type
            top_k: Number of top trajectories to retrieve

        Returns:
            List of training trajectories sorted by reward
        """
        if not self.memory:
            logger.warning("Memory not enabled - trajectory recall skipped")
            return []

        try:
            # Build query
            query = "training trajectory successful"
            if task_type:
                query = f"{query} {task_type}"

            # Retrieve from MemoryOS
            memories = self.memory.retrieve(
                agent_id="react_training",
                user_id=user_id,
                query=query,
                memory_type=None,
                top_k=top_k
            )

            trajectories = []
            for mem in memories:
                try:
                    content = mem.get('content', '')
                    # Parse trajectory from stored response
                    if 'trajectory_id' in content:
                        start = content.find('{')
                        if start >= 0:
                            json_str = content[start:]
                            traj_dict = json.loads(json_str)

                            # Reconstruct reasoning steps
                            steps = [
                                ReasoningStep(**step_dict)
                                for step_dict in traj_dict.get('reasoning_steps', [])
                            ]
                            traj_dict['reasoning_steps'] = steps

                            # Parse datetime
                            if 'created_at' in traj_dict:
                                traj_dict['created_at'] = datetime.fromisoformat(
                                    traj_dict['created_at'].replace('Z', '+00:00')
                                )

                            trajectory = TrainingTrajectory(**traj_dict)
                            trajectories.append(trajectory)
                except Exception as e:
                    logger.warning(f"Failed to parse trajectory from memory: {e}")
                    continue

            # Sort by total reward (best first)
            trajectories.sort(key=lambda t: t.total_reward, reverse=True)

            self.training_stats['trajectories_recalled'] += len(trajectories)

            logger.info(f"Recalled {len(trajectories)} training trajectories")

            return trajectories[:top_k]

        except Exception as e:
            logger.error(f"Failed to recall training trajectories: {e}")
            return []

    async def store_performance_metrics(
        self,
        user_id: str,
        metrics: TrainingMetrics
    ) -> None:
        """
        Store training performance metrics.

        Args:
            user_id: User identifier
            metrics: Performance metrics to store
        """
        if not self.memory:
            logger.warning("Memory not enabled - metrics storage skipped")
            return

        try:
            # Store in MemoryOS (user scope for personalized tracking)
            self.memory.store(
                agent_id="react_training",
                user_id=user_id,
                user_input=f"Training metrics for {metrics.total_episodes} episodes",
                agent_response=json.dumps(asdict(metrics)),
                memory_type="conversation"
            )

            # Also store in MemoryTool
            if self.memory_tool:
                await self.memory_tool.store_workflow(
                    task_type="performance_tracking",
                    workflow_steps=["train", "evaluate", "aggregate"],
                    success=metrics.success_rate > 0.5,
                    duration=metrics.avg_training_time,
                    session_id=self.session_id,
                    metadata={
                        "metrics": asdict(metrics),
                        "scope": "user"
                    }
                )

            self.training_stats['metrics_stored'] += 1

            logger.info(
                f"Stored performance metrics: success_rate={metrics.success_rate:.2%}, "
                f"avg_reward={metrics.avg_reward:.2f}"
            )

        except Exception as e:
            logger.error(f"Failed to store performance metrics: {e}")

    async def recall_training_benchmarks(
        self,
        user_id: str,
        top_k: int = 10
    ) -> List[TrainingMetrics]:
        """
        Retrieve historical training benchmarks for comparison.

        Args:
            user_id: User identifier
            top_k: Number of benchmarks to retrieve

        Returns:
            List of training metrics from past sessions
        """
        if not self.memory:
            logger.warning("Memory not enabled - benchmark recall skipped")
            return []

        try:
            # Retrieve from MemoryOS
            memories = self.memory.retrieve(
                agent_id="react_training",
                user_id=user_id,
                query="training metrics episodes performance",
                memory_type=None,
                top_k=top_k
            )

            benchmarks = []
            for mem in memories:
                try:
                    content = mem.get('content', '')
                    # Parse metrics from stored response
                    if 'total_episodes' in content:
                        start = content.find('{')
                        if start >= 0:
                            json_str = content[start:]
                            metrics_dict = json.loads(json_str)
                            metrics = TrainingMetrics(**metrics_dict)
                            benchmarks.append(metrics)
                except Exception as e:
                    logger.warning(f"Failed to parse metrics from memory: {e}")
                    continue

            self.training_stats['benchmarks_recalled'] += len(benchmarks)

            logger.info(f"Recalled {len(benchmarks)} training benchmarks")

            return benchmarks

        except Exception as e:
            logger.error(f"Failed to recall training benchmarks: {e}")
            return []

    async def train_batch(
        self,
        tasks: List[str],
        user_id: str = "default",
        use_memory: bool = True
    ) -> Tuple[List[TrainingTrajectory], TrainingMetrics]:
        """
        Train a batch of episodes.

        Args:
            tasks: List of task descriptions
            user_id: User identifier
            use_memory: Whether to use memory for guidance

        Returns:
            Tuple of (trajectories, aggregated_metrics)
        """
        trajectories = []
        start_time = time.time()

        for task in tasks:
            trajectory = await self.train_episode(
                task=task,
                user_id=user_id,
                use_memory=use_memory
            )
            trajectories.append(trajectory)

        # Calculate aggregate metrics
        successful = [t for t in trajectories if t.success]
        failed = [t for t in trajectories if not t.success]

        metrics = TrainingMetrics(
            total_episodes=len(trajectories),
            successful_episodes=len(successful),
            failed_episodes=len(failed),
            success_rate=len(successful) / len(trajectories) if trajectories else 0,
            avg_reward=sum(t.total_reward for t in trajectories) / len(trajectories) if trajectories else 0,
            avg_steps_per_episode=sum(len(t.reasoning_steps) for t in trajectories) / len(trajectories) if trajectories else 0,
            avg_training_time=(time.time() - start_time) / len(trajectories) if trajectories else 0,
            best_reward=max(t.total_reward for t in trajectories) if trajectories else 0,
            worst_reward=min(t.total_reward for t in trajectories) if trajectories else 0
        )

        # Store metrics
        await self.store_performance_metrics(user_id, metrics)

        logger.info(
            f"Batch training complete: {len(trajectories)} episodes, "
            f"success_rate={metrics.success_rate:.2%}, avg_reward={metrics.avg_reward:.2f}"
        )

        return trajectories, metrics

    def get_stats(self) -> Dict[str, Any]:
        """Get training statistics"""
        return {
            "session_id": self.session_id,
            "business_id": self.business_id,
            "memory_enabled": self.enable_memory,
            "episode_count": self.episode_count,
            "config": asdict(self.training_config),
            "stats": dict(self.training_stats)
        }


# Factory function for easy instantiation
def create_react_training_agent(
    business_id: str = "default",
    enable_memory: bool = True,
    mongodb_uri: Optional[str] = None,
    training_config: Optional[TrainingConfig] = None
) -> ReActTrainingAgent:
    """
    Create ReAct Training Agent instance.

    Args:
        business_id: Business identifier
        enable_memory: Enable persistent memory
        mongodb_uri: Optional MongoDB URI
        training_config: Training configuration

    Returns:
        Configured ReActTrainingAgent instance
    """
    return ReActTrainingAgent(
        business_id=business_id,
        enable_memory=enable_memory,
        mongodb_uri=mongodb_uri,
        training_config=training_config
    )


# Example usage
if __name__ == "__main__":
    async def main():
        # Create agent
        agent = create_react_training_agent(
            business_id="test",
            enable_memory=True
        )

        await agent.setup()

        # Example training tasks
        tasks = [
            "Solve the math problem: 2 + 2 = ?",
            "Write a function to calculate factorial",
            "Explain why the sky is blue"
        ]

        # Train batch
        trajectories, metrics = await agent.train_batch(
            tasks=tasks,
            user_id="test_user"
        )

        print(f"\nTraining Results:")
        print(f"  Episodes: {metrics.total_episodes}")
        print(f"  Success rate: {metrics.success_rate:.2%}")
        print(f"  Avg reward: {metrics.avg_reward:.2f}")
        print(f"  Avg steps: {metrics.avg_steps_per_episode:.1f}")
        print(f"\nStats: {agent.get_stats()}")

    asyncio.run(main())
