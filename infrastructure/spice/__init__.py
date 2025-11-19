"""
SPICE Infrastructure - Self-Play In Corpus Environments
=======================================================

SPICE (Self-Play In Corpus Environments) implementation for Genesis.
Paper: arXiv:2510.24684

Components:
- ChallengerAgent: Corpus-grounded task generation with difficulty curriculum
- ReasonerAgent: Multi-trajectory solving with SE-Darwin operators
- DrGRPOOptimizer: Diversity-rewarding group relative policy optimization

Features:
- Self-play RL for trajectory bootstrapping
- +9-11% evolution accuracy (Layer 2 Darwin boost)
- Corpus-grounded task generation (no hallucination)
- Variance rewards drive diverse reasoning

For full implementation details, see:
docs/research/SPICE_PIPELEX_MICROADAPT_INTEGRATION.md
"""

from infrastructure.spice.challenger_agent import ChallengerAgent, CorpusTask
from infrastructure.spice.reasoner_agent import ReasonerAgent, SolutionTrajectory, TrajectoryType
from infrastructure.spice.drgrpo_optimizer import DrGRPOOptimizer, TrainingExample

# SPICE is now fully available
SPICE_AVAILABLE = True

__all__ = [
    "ChallengerAgent",
    "CorpusTask",
    "ReasonerAgent",
    "SolutionTrajectory",
    "TrajectoryType",
    "DrGRPOOptimizer",
    "TrainingExample",
    "SPICE_AVAILABLE",
]


def get_spice_enabled():
    """Check if SPICE infrastructure is available"""
    return SPICE_AVAILABLE
