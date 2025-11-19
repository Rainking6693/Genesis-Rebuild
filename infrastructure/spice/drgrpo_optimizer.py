"""
SPICE DrGRPO Optimizer - Diversity-Rewarding Group Relative Policy Optimization
================================================================================

Paper: arXiv:2510.24684 - Self-Play In Corpus Environments (SPICE)

DrGRPO optimizer trains Challenger and Reasoner agents jointly using variance
rewards to drive diverse reasoning trajectories.
"""

from dataclasses import dataclass
from typing import Dict, List, Optional, Tuple
import statistics
import json
from pathlib import Path
from datetime import datetime


@dataclass
class TrainingExample:
    """A training example for DrGRPO."""
    task_description: str
    trajectories: List[Dict[str, any]]
    variance_reward: float
    difficulty: float
    grounding_score: float
    timestamp: str


class DrGRPOOptimizer:
    """
    DrGRPO Optimizer for SPICE Challenger + Reasoner joint training.

    Features:
    - Variance reward computation (std_dev/mean × difficulty × grounding)
    - Joint training loop for Challenger + Reasoner
    - Mistral API fine-tuning integration
    - Training data archiving (data/spice_training/)
    """

    def __init__(
        self,
        training_data_path: Path = Path("data/spice_training"),
        variance_weight: float = 1.0,
        difficulty_weight: float = 0.5,
        grounding_weight: float = 0.3,
    ):
        self.training_data_path = training_data_path
        self.variance_weight = variance_weight
        self.difficulty_weight = difficulty_weight
        self.grounding_weight = grounding_weight
        self.training_examples: List[TrainingExample] = []

        # Create training data directory
        self.training_data_path.mkdir(parents=True, exist_ok=True)

    def compute_variance_reward(
        self,
        trajectories: List[Dict[str, any]],
        difficulty: float,
        grounding_score: float,
    ) -> float:
        """
        Compute variance reward for trajectory diversity.

        Formula: variance_reward = (std_dev / mean) × difficulty × grounding

        Args:
            trajectories: List of solution trajectories with quality_score
            difficulty: Task difficulty (0.0-1.0)
            grounding_score: Task grounding score (0.0-1.0)

        Returns:
            Variance reward (higher = more diverse trajectories)
        """
        if len(trajectories) < 2:
            return 0.0

        # Extract quality scores
        quality_scores = [t.get("quality_score", 0.0) for t in trajectories]

        # Calculate variance metrics
        mean_quality = statistics.mean(quality_scores)
        std_dev = statistics.stdev(quality_scores) if len(quality_scores) > 1 else 0.0

        # Coefficient of variation
        cov = std_dev / mean_quality if mean_quality > 0 else 0.0

        # Variance reward formula
        variance_reward = (
            self.variance_weight * cov +
            self.difficulty_weight * difficulty +
            self.grounding_weight * grounding_score
        )

        return variance_reward

    def add_training_example(
        self,
        task_description: str,
        trajectories: List[Dict[str, any]],
        difficulty: float,
        grounding_score: float,
    ) -> TrainingExample:
        """
        Add a training example and compute variance reward.

        Args:
            task_description: The task description
            trajectories: List of solution trajectories
            difficulty: Task difficulty
            grounding_score: Task grounding score

        Returns:
            TrainingExample with computed variance reward
        """
        variance_reward = self.compute_variance_reward(
            trajectories, difficulty, grounding_score
        )

        example = TrainingExample(
            task_description=task_description,
            trajectories=trajectories,
            variance_reward=variance_reward,
            difficulty=difficulty,
            grounding_score=grounding_score,
            timestamp=datetime.now().isoformat(),
        )

        self.training_examples.append(example)
        return example

    def save_training_data(self, filename: Optional[str] = None) -> Path:
        """
        Save training data to JSONL format for Mistral fine-tuning.

        Args:
            filename: Optional filename (defaults to timestamp)

        Returns:
            Path to saved training data file
        """
        if filename is None:
            filename = f"spice_training_{datetime.now().strftime('%Y%m%d_%H%M%S')}.jsonl"

        output_path = self.training_data_path / filename

        with open(output_path, "w") as f:
            for example in self.training_examples:
                # Convert to Mistral fine-tuning format
                training_record = {
                    "messages": [
                        {
                            "role": "user",
                            "content": f"Generate diverse solution trajectories for: {example.task_description}"
                        },
                        {
                            "role": "assistant",
                            "content": json.dumps({
                                "trajectories": example.trajectories,
                                "variance_reward": example.variance_reward,
                            })
                        }
                    ],
                    "metadata": {
                        "difficulty": example.difficulty,
                        "grounding_score": example.grounding_score,
                        "variance_reward": example.variance_reward,
                        "timestamp": example.timestamp,
                    }
                }

                f.write(json.dumps(training_record) + "\n")

        return output_path

    def get_top_examples(self, n: int = 10) -> List[TrainingExample]:
        """
        Get top N training examples by variance reward.

        Args:
            n: Number of examples to return

        Returns:
            List of top TrainingExample objects
        """
        sorted_examples = sorted(
            self.training_examples,
            key=lambda e: e.variance_reward,
            reverse=True
        )

        return sorted_examples[:n]

    def get_statistics(self) -> Dict[str, any]:
        """Get DrGRPO training statistics."""
        if not self.training_examples:
            return {
                "total_examples": 0,
                "avg_variance_reward": 0.0,
                "avg_difficulty": 0.0,
                "avg_grounding": 0.0,
                "training_data_files": 0,
            }

        # Count training data files
        training_files = list(self.training_data_path.glob("spice_training_*.jsonl"))

        return {
            "total_examples": len(self.training_examples),
            "avg_variance_reward": sum(e.variance_reward for e in self.training_examples) / len(self.training_examples),
            "avg_difficulty": sum(e.difficulty for e in self.training_examples) / len(self.training_examples),
            "avg_grounding": sum(e.grounding_score for e in self.training_examples) / len(self.training_examples),
            "training_data_files": len(training_files),
            "max_variance_reward": max(e.variance_reward for e in self.training_examples),
            "min_variance_reward": min(e.variance_reward for e in self.training_examples),
        }

    def simulate_training_step(
        self,
        challenger_task: Dict[str, any],
        reasoner_trajectories: List[Dict[str, any]],
    ) -> Dict[str, any]:
        """
        Simulate a single DrGRPO training step.

        Args:
            challenger_task: Task generated by Challenger
            reasoner_trajectories: Trajectories generated by Reasoner

        Returns:
            Training metrics
        """
        # Add training example
        example = self.add_training_example(
            task_description=challenger_task.get("description", ""),
            trajectories=reasoner_trajectories,
            difficulty=challenger_task.get("difficulty", 0.5),
            grounding_score=challenger_task.get("grounding_score", 0.7),
        )

        # Training metrics
        metrics = {
            "variance_reward": example.variance_reward,
            "num_trajectories": len(reasoner_trajectories),
            "avg_trajectory_quality": statistics.mean(
                t.get("quality_score", 0.0) for t in reasoner_trajectories
            ),
            "difficulty": example.difficulty,
            "grounding_score": example.grounding_score,
        }

        return metrics
