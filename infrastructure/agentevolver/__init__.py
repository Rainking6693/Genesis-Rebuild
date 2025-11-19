"""
AgentEvolver Phase 1-3 - Agent Evolution, Experience Reuse & Self-Attributing

Core implementation for autonomous task generation, agent experience reuse, and
contribution-based reward differentiation.

Phase 1 Modules:
- self_questioning: Autonomous task generation with curiosity-driven novelty scoring
- embedder: Task embedding generation via OpenAI text-embedding-3-small

Phase 2 Modules:
- experience_buffer: Stores and retrieves high-quality agent experiences
- hybrid_policy: Exploit/explore decision making with bandit algorithms
- experience_transfer: Cross-agent experience sharing and transfer

Phase 3 Modules:
- self_attributing: Contribution tracking, reward shaping, and Shapley-based attribution

Features:
- Curiosity-driven task generation (CuriosityScorer, TaskGenerator)
- Semantic similarity search for finding relevant past experiences
- Quality filtering (top 10% trajectories only)
- Fast retrieval (<100ms) via vector search
- Cost reduction through experience reuse (target: 50%)
- Contribution-based reward differentiation with multiple shaping strategies
- Multi-agent Shapley value approximation for fair attribution
- <50ms attribution computation supporting 10+ concurrent agents

Author: Thon (Python Expert)
Date: November 15, 2025
"""

from infrastructure.agentevolver.self_questioning import SelfQuestioningEngine
from infrastructure.agentevolver.experience_manager import ExperienceManager
from infrastructure.agentevolver.experience_buffer import (
    ExperienceBuffer,
    ExperienceMetadata,
)
from infrastructure.agentevolver.embedder import TaskEmbedder
from infrastructure.agentevolver.hybrid_policy import HybridPolicy
from infrastructure.agentevolver.cost_tracker import CostTracker
from infrastructure.agentevolver.curiosity_trainer import CuriosityDrivenTrainer, TrainingMetrics
from infrastructure.agentevolver.self_attributing import (
    ContributionTracker,
    AttributionEngine,
    RewardShaper,
    RewardStrategy,
)
from infrastructure.agentevolver.ingestion import ScenarioIngestionPipeline

__all__ = [
    "SelfQuestioningEngine",
    "ExperienceManager",
    "ExperienceBuffer",
    "ExperienceMetadata",
    "TaskEmbedder",
    "HybridPolicy",
    "CostTracker",
    "CuriosityDrivenTrainer",
    "TrainingMetrics",
    "ContributionTracker",
    "AttributionEngine",
    "RewardShaper",
    "RewardStrategy",
    "ScenarioIngestionPipeline",
]
