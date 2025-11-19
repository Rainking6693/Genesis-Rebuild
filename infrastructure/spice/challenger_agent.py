"""
SPICE Challenger Agent - Corpus-Grounded Task Generation
==========================================================

Paper: arXiv:2510.24684 - Self-Play In Corpus Environments (SPICE)

The Challenger agent generates tasks from a grounded corpus (Genesis benchmarks)
with difficulty curriculum and grounding validation to prevent hallucination.
"""

from dataclasses import dataclass
from typing import Dict, List, Optional
import random
import json
from pathlib import Path


@dataclass
class CorpusTask:
    """A task generated from the corpus."""
    task_id: str
    description: str
    difficulty: float  # 0.0-1.0
    grounding_score: float  # 0.0-1.0
    corpus_source: str
    parameters: Dict[str, any]


class ChallengerAgent:
    """
    SPICE Challenger Agent for corpus-grounded task generation.

    Features:
    - Corpus-grounded task generation (Genesis benchmarks)
    - Difficulty curriculum (0.0-1.0)
    - Grounding validation (threshold=0.7, rejects hallucinations)
    """

    def __init__(
        self,
        corpus_path: Path = Path("data/genesis_benchmarks"),
        difficulty_curriculum: bool = True,
        grounding_threshold: float = 0.7,
    ):
        self.corpus_path = corpus_path
        self.difficulty_curriculum = difficulty_curriculum
        self.grounding_threshold = grounding_threshold
        self.task_history: List[CorpusTask] = []
        self.current_difficulty = 0.3  # Start easy

    def generate_task(self, agent_type: Optional[str] = None) -> CorpusTask:
        """
        Generate a corpus-grounded task with difficulty curriculum.

        Args:
            agent_type: Optional agent type to target (e.g., "marketing", "qa")

        Returns:
            CorpusTask with validated grounding
        """
        # Sample from corpus
        task_desc = self._sample_from_corpus(agent_type)

        # Calculate difficulty based on curriculum
        difficulty = self._calculate_difficulty()

        # Validate grounding (prevent hallucination)
        grounding_score = self._validate_grounding(task_desc)

        if grounding_score < self.grounding_threshold:
            # Reject hallucinated tasks
            return self.generate_task(agent_type)  # Retry

        task = CorpusTask(
            task_id=f"task_{len(self.task_history)}",
            description=task_desc,
            difficulty=difficulty,
            grounding_score=grounding_score,
            corpus_source="genesis_benchmarks",
            parameters={}
        )

        self.task_history.append(task)
        return task

    def _sample_from_corpus(self, agent_type: Optional[str]) -> str:
        """Sample a task description from the Genesis corpus."""
        # Genesis benchmark examples
        corpus_examples = [
            "Generate a complete business plan for a SaaS product",
            "Create a marketing strategy for an e-commerce platform",
            "Design a database schema for a fintech application",
            "Write comprehensive test coverage for a REST API",
            "Deploy a scalable web application to production",
            "Optimize SEO for a content management system",
            "Build a payment integration with Stripe",
            "Create email marketing campaigns with A/B testing",
        ]

        # Filter by agent type if specified
        if agent_type:
            corpus_examples = [
                ex for ex in corpus_examples
                if agent_type.lower() in ex.lower()
            ]

        return random.choice(corpus_examples) if corpus_examples else corpus_examples[0]

    def _calculate_difficulty(self) -> float:
        """Calculate task difficulty with curriculum."""
        if not self.difficulty_curriculum:
            return random.uniform(0.0, 1.0)

        # Gradual difficulty increase
        difficulty = min(1.0, self.current_difficulty + random.uniform(0.0, 0.1))

        # Update curriculum
        if len(self.task_history) > 0 and len(self.task_history) % 10 == 0:
            self.current_difficulty = min(1.0, self.current_difficulty + 0.05)

        return difficulty

    def _validate_grounding(self, task_desc: str) -> float:
        """
        Validate grounding score to prevent hallucination.

        Returns:
            Grounding score (0.0-1.0)
        """
        # Simple validation: Check if task contains known Genesis components
        known_components = [
            "business", "marketing", "database", "test", "deploy",
            "seo", "payment", "stripe", "email", "api", "saas"
        ]

        matches = sum(1 for comp in known_components if comp in task_desc.lower())
        grounding_score = min(1.0, matches / 3.0)  # Normalize

        return grounding_score

    def get_statistics(self) -> Dict[str, any]:
        """Get Challenger statistics."""
        if not self.task_history:
            return {
                "total_tasks": 0,
                "avg_difficulty": 0.0,
                "avg_grounding": 0.0,
                "current_difficulty": self.current_difficulty,
            }

        return {
            "total_tasks": len(self.task_history),
            "avg_difficulty": sum(t.difficulty for t in self.task_history) / len(self.task_history),
            "avg_grounding": sum(t.grounding_score for t in self.task_history) / len(self.task_history),
            "current_difficulty": self.current_difficulty,
            "rejected_tasks": 0,  # TODO: Track rejections
        }
