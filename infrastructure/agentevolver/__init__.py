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

from infrastructure.agentevolver.embedder import TaskEmbedder
from infrastructure.agentevolver.experience_buffer import (
    ExperienceBuffer,
    ExperienceMetadata
)
from infrastructure.agentevolver.self_questioning import (
    SelfQuestioningEngine,
    GeneratedTask,
)
from infrastructure.agentevolver.curiosity_trainer import (
    CuriosityDrivenTrainer,
    TrainingMetrics,
)
from infrastructure.agentevolver.hybrid_policy import HybridPolicy, PolicyDecision
from infrastructure.agentevolver.cost_tracker import CostTracker
from infrastructure.agentevolver.experience_transfer import (
    ExperienceTransfer,
    Experience,
    ExperienceType,
    ExperienceBuffer as ExperienceBufferNew
)
from infrastructure.agentevolver.agent_mixin import (
    ExperienceReuseMixin,
    ExperienceReuseMixinAsync
)
from infrastructure.agentevolver.self_attributing import (
    ContributionTracker,
    RewardShaper,
    AttributionEngine,
    AgentContribution,
    AttributionReport,
    RewardStrategy,
    create_attribution_engine,
)

__all__ = [
    # Phase 1: Self-Questioning & Curiosity-Driven Training
    "SelfQuestioningEngine",
    "GeneratedTask",
    "CuriosityDrivenTrainer",
    "TrainingMetrics",
    # Core embedder
    "TaskEmbedder",
    # Phase 2: Experience Reuse
    "ExperienceBuffer",
    "ExperienceMetadata",
    "HybridPolicy",
    "PolicyDecision",
    "CostTracker",
    "ExperienceTransfer",
    "Experience",
    "ExperienceType",
    "ExperienceReuseMixin",
    "ExperienceReuseMixinAsync",
    # Phase 3: Self-Attributing Rewards
    "ContributionTracker",
    "RewardShaper",
    "AttributionEngine",
    "AgentContribution",
    "AttributionReport",
    "RewardStrategy",
    "create_attribution_engine",
]
