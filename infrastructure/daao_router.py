"""
DAAO (Difficulty-Aware Agentic Orchestration) Router
Based on: arXiv 2509.11079 (September 2025)

Key Innovation: Route tasks to appropriate model based on difficulty
- Easy tasks → Gemini Flash ($0.03/1M tokens)
- Hard tasks → GPT-4o ($3/1M tokens)

Expected Impact: 64% cost at +11% accuracy (36% cost reduction)
"""

import logging
import re
from dataclasses import dataclass
from enum import Enum
from typing import Dict, List, Optional

# Setup logging
logger = logging.getLogger(__name__)


class TaskDifficulty(Enum):
    """Task difficulty levels"""
    TRIVIAL = "trivial"  # <0.2: Very simple tasks
    EASY = "easy"        # 0.2-0.4: Simple tasks
    MEDIUM = "medium"    # 0.4-0.6: Moderate tasks
    HARD = "hard"        # 0.6-0.8: Complex tasks
    EXPERT = "expert"    # >0.8: Very complex tasks


class ModelTier(Enum):
    """Model cost tiers"""
    ULTRA_CHEAP = "gemini-2.5-flash"      # $0.03/1M tokens
    CHEAP = "gemini-2.0-flash-lite"       # $0.10/1M tokens
    STANDARD = "claude-3.7-sonnet"        # $1.50/1M tokens
    PREMIUM = "gpt-4o"                    # $3.00/1M tokens
    ULTRA_PREMIUM = "claude-4-sonnet"     # $5.00/1M tokens


@dataclass
class TaskMetrics:
    """Metrics for difficulty estimation"""
    description_length: int
    num_steps: int
    num_tools_required: int
    priority: float
    complexity_keywords: int
    technical_depth: int


@dataclass
class RoutingDecision:
    """Routing decision with reasoning"""
    model: str
    difficulty: TaskDifficulty
    estimated_cost: float
    confidence: float
    reasoning: str


class DAAORouter:
    """
    Difficulty-Aware Agentic Orchestration Router

    Routes tasks to cost-appropriate models based on difficulty estimation.
    Based on research: arXiv 2509.11079

    Expected Results:
    - 64% of baseline cost
    - +11.21% accuracy improvement
    - Optimal model selection per task
    """

    # Difficulty estimation parameters
    MAX_DESCRIPTION_LENGTH = 1000
    MAX_STEPS_CONSIDERED = 10
    MAX_TOOLS_CONSIDERED = 5
    MAX_COMPLEXITY_KEYWORDS = 5
    MAX_TECHNICAL_KEYWORDS = 5

    # Difficulty weights (must sum to 1.0)
    WEIGHT_LENGTH = 0.15
    WEIGHT_STEPS = 0.20
    WEIGHT_TOOLS = 0.20
    WEIGHT_COMPLEXITY = 0.20
    WEIGHT_TECHNICAL = 0.15
    WEIGHT_PRIORITY = 0.10

    # Difficulty thresholds
    THRESHOLD_TRIVIAL = 0.2
    THRESHOLD_EASY = 0.4
    THRESHOLD_MEDIUM = 0.6
    THRESHOLD_HARD = 0.8

    def __init__(self):
        # Model pricing (per 1M tokens)
        self.model_costs = {
            ModelTier.ULTRA_CHEAP: 0.03,
            ModelTier.CHEAP: 0.10,
            ModelTier.STANDARD: 1.50,
            ModelTier.PREMIUM: 3.00,
            ModelTier.ULTRA_PREMIUM: 5.00,
        }

        # Complexity indicators (all lowercase for matching)
        self.complexity_keywords = [
            'architecture', 'system', 'design', 'optimize', 'algorithm',
            'concurrent', 'distributed', 'scalable', 'performance',
            'security', 'integration', 'refactor', 'debug', 'analyze'
        ]

        self.technical_keywords = [
            'database', 'api', 'framework', 'deployment', 'infrastructure',
            'authentication', 'authorization', 'encryption', 'protocol',
            'microservice', 'containerize', 'orchestrate', 'pipeline'
        ]

    def estimate_difficulty(self, task: Dict) -> float:
        """
        Estimate task difficulty using multiple heuristics

        Args:
            task: Task dictionary with description, priority, etc.

        Returns:
            float: Difficulty score (0.0 = trivial, 1.0 = expert)

        Raises:
            TypeError: If task is not a dictionary
        """
        # Input validation
        if not isinstance(task, dict):
            raise TypeError(f"Task must be a dictionary, got {type(task)}")

        # Extract and validate fields
        description = task.get('description', '') or ''
        if not isinstance(description, str):
            description = str(description)

        priority = task.get('priority', 0.5) or 0.5
        if not isinstance(priority, (int, float)):
            priority = 0.5
        priority = max(0.0, min(1.0, float(priority)))  # Clamp to 0-1

        required_tools = task.get('required_tools', []) or []
        if not isinstance(required_tools, list):
            required_tools = []

        steps = task.get('num_steps', 0) or 0
        if not isinstance(steps, (int, float)):
            steps = 0
        steps = max(0, int(steps))

        # Metric 1: Description length (longer = more complex)
        length_score = min(len(description) / self.MAX_DESCRIPTION_LENGTH, 1.0)

        # Metric 2: Number of steps (if provided)
        steps_score = min(steps / self.MAX_STEPS_CONSIDERED, 1.0)

        # Metric 3: Number of tools required
        tools_score = min(len(required_tools) / self.MAX_TOOLS_CONSIDERED, 1.0)

        # Metric 4: Complexity keywords
        complexity_count = sum(
            1 for keyword in self.complexity_keywords
            if keyword in description.lower()
        )
        complexity_score = min(complexity_count / self.MAX_COMPLEXITY_KEYWORDS, 1.0)

        # Metric 5: Technical keywords
        technical_count = sum(
            1 for keyword in self.technical_keywords
            if keyword in description.lower()
        )
        technical_score = min(technical_count / self.MAX_TECHNICAL_KEYWORDS, 1.0)

        # Metric 6: Priority (higher priority = potentially more complex)
        priority_score = priority

        # Weighted combination (weights defined as class constants)
        difficulty = (
            self.WEIGHT_LENGTH * length_score +
            self.WEIGHT_STEPS * steps_score +
            self.WEIGHT_TOOLS * tools_score +
            self.WEIGHT_COMPLEXITY * complexity_score +
            self.WEIGHT_TECHNICAL * technical_score +
            self.WEIGHT_PRIORITY * priority_score
        )

        return min(difficulty, 1.0)

    def select_model(self, difficulty: float, budget_conscious: bool = True) -> ModelTier:
        """
        Select appropriate model tier based on difficulty

        Args:
            difficulty: Difficulty score (0.0-1.0)
            budget_conscious: If True, prefer cheaper models when possible

        Returns:
            ModelTier: Selected model tier
        """
        if budget_conscious:
            # Conservative routing (maximize cost savings)
            if difficulty < self.THRESHOLD_TRIVIAL:
                return ModelTier.ULTRA_CHEAP  # Gemini Flash for trivial
            elif difficulty < self.THRESHOLD_EASY:
                return ModelTier.CHEAP  # Gemini Flash Lite for easy
            elif difficulty < self.THRESHOLD_MEDIUM:
                return ModelTier.STANDARD  # Claude 3.7 Sonnet for medium
            elif difficulty < self.THRESHOLD_HARD:
                return ModelTier.PREMIUM  # GPT-4o for hard
            else:
                return ModelTier.ULTRA_PREMIUM  # Claude 4 for expert
        else:
            # Quality-focused routing (maximize accuracy)
            if difficulty < 0.3:
                return ModelTier.CHEAP
            elif difficulty < 0.5:
                return ModelTier.STANDARD
            elif difficulty < 0.7:
                return ModelTier.PREMIUM
            else:
                return ModelTier.ULTRA_PREMIUM

    def _estimate_tokens(self, task: Dict) -> int:
        """
        Estimate token count for a task

        Args:
            task: Task dictionary

        Returns:
            Estimated token count
        """
        base = 500  # Base tokens for system prompts

        # Estimate description tokens (~1.3 tokens per word)
        description = task.get('description', '') or ''
        if isinstance(description, str):
            desc_tokens = len(description.split()) * 1.3
        else:
            desc_tokens = 0

        # Additional tokens for steps and tools
        steps = task.get('num_steps', 0) or 0
        if isinstance(steps, (int, float)):
            steps = max(0, int(steps))
        else:
            steps = 0

        tools = task.get('required_tools', []) or []
        if isinstance(tools, list):
            tool_count = len(tools)
        else:
            tool_count = 0

        return int(base + desc_tokens + (steps * 200) + (tool_count * 300))

    def _calculate_confidence(self, difficulty_score: float) -> float:
        """
        Calculate routing confidence based on difficulty score

        Higher confidence at extremes (clear trivial/expert tasks)
        Lower confidence near thresholds (boundary cases)

        Args:
            difficulty_score: Difficulty score (0.0-1.0)

        Returns:
            Confidence score (0.0-1.0)
        """
        # Distance from nearest threshold (closer to threshold = less confident)
        thresholds = [
            self.THRESHOLD_TRIVIAL,
            self.THRESHOLD_EASY,
            self.THRESHOLD_MEDIUM,
            self.THRESHOLD_HARD
        ]
        min_threshold_distance = min(abs(difficulty_score - t) for t in thresholds)

        # Scale distance to confidence (max distance is 0.2, so scale by 5)
        confidence = min(min_threshold_distance * 5.0, 1.0)

        return confidence

    def route_task(
        self,
        task: Dict,
        budget_conscious: bool = True
    ) -> RoutingDecision:
        """
        Route task to appropriate model

        Args:
            task: Task dictionary with description, priority, etc.
            budget_conscious: Prefer cost savings over max quality

        Returns:
            RoutingDecision with model, difficulty, cost estimate, reasoning
        """
        # Estimate difficulty
        difficulty_score = self.estimate_difficulty(task)

        # Categorize difficulty
        if difficulty_score < self.THRESHOLD_TRIVIAL:
            difficulty = TaskDifficulty.TRIVIAL
        elif difficulty_score < self.THRESHOLD_EASY:
            difficulty = TaskDifficulty.EASY
        elif difficulty_score < self.THRESHOLD_MEDIUM:
            difficulty = TaskDifficulty.MEDIUM
        elif difficulty_score < self.THRESHOLD_HARD:
            difficulty = TaskDifficulty.HARD
        else:
            difficulty = TaskDifficulty.EXPERT

        # Select model
        model_tier = self.select_model(difficulty_score, budget_conscious)

        # Estimate tokens dynamically based on task size
        estimated_tokens = self._estimate_tokens(task)
        estimated_cost = (self.model_costs[model_tier] / 1_000_000) * estimated_tokens

        # Calculate confidence (fixed formula - higher at extremes)
        confidence = self._calculate_confidence(difficulty_score)

        # Generate reasoning
        reasoning = self._generate_reasoning(
            task, difficulty_score, model_tier, budget_conscious
        )

        # Log routing decision
        logger.info(
            f"Routed task to {model_tier.value}",
            extra={
                'task_id': task.get('id', 'unknown'),
                'difficulty': difficulty_score,
                'difficulty_category': difficulty.value,
                'confidence': confidence,
                'estimated_cost': estimated_cost,
                'estimated_tokens': estimated_tokens,
                'budget_conscious': budget_conscious,
                'model': model_tier.value
            }
        )

        return RoutingDecision(
            model=model_tier.value,
            difficulty=difficulty,
            estimated_cost=estimated_cost,
            confidence=confidence,
            reasoning=reasoning
        )

    def _generate_reasoning(
        self,
        task: Dict,
        difficulty: float,
        model: ModelTier,
        budget_conscious: bool
    ) -> str:
        """Generate human-readable routing reasoning"""
        description = (task.get('description', '') or '')[:100]  # Handle None

        reasons = []

        # Difficulty assessment
        if difficulty < 0.3:
            reasons.append(f"Task is simple (difficulty: {difficulty:.2f})")
        elif difficulty < 0.6:
            reasons.append(f"Task is moderate (difficulty: {difficulty:.2f})")
        else:
            reasons.append(f"Task is complex (difficulty: {difficulty:.2f})")

        # Model selection
        if budget_conscious:
            reasons.append(f"Cost-optimized routing to {model.value}")
        else:
            reasons.append(f"Quality-focused routing to {model.value}")

        # Cost impact
        cost = self.model_costs[model]
        if cost < 0.5:
            reasons.append("Low cost model selected")
        elif cost < 2.0:
            reasons.append("Medium cost model selected")
        else:
            reasons.append("High cost model selected for quality")

        return " | ".join(reasons)

    def estimate_cost_savings(
        self,
        tasks: List[Dict],
        baseline_model: ModelTier = ModelTier.PREMIUM
    ) -> Dict[str, float]:
        """
        Estimate cost savings from DAAO routing vs. always using baseline model

        Args:
            tasks: List of tasks to route
            baseline_model: Model that would be used without DAAO

        Returns:
            Dictionary with cost metrics
        """
        # Handle empty task list
        if not tasks:
            return {
                'daao_cost': 0.0,
                'baseline_cost': 0.0,
                'savings': 0.0,
                'savings_percent': 0.0,
                'num_tasks': 0
            }

        baseline_cost_per_task = self.model_costs[baseline_model] / 1000

        daao_total_cost = 0.0
        baseline_total_cost = 0.0

        for task in tasks:
            decision = self.route_task(task)
            daao_total_cost += decision.estimated_cost
            baseline_total_cost += baseline_cost_per_task

        savings = baseline_total_cost - daao_total_cost
        savings_percent = (savings / baseline_total_cost) * 100 if baseline_total_cost > 0 else 0

        logger.info(
            f"Cost savings analysis complete",
            extra={
                'num_tasks': len(tasks),
                'daao_cost': daao_total_cost,
                'baseline_cost': baseline_total_cost,
                'savings': savings,
                'savings_percent': savings_percent,
                'baseline_model': baseline_model.value
            }
        )

        return {
            'daao_cost': daao_total_cost,
            'baseline_cost': baseline_total_cost,
            'savings': savings,
            'savings_percent': savings_percent,
            'num_tasks': len(tasks)
        }


# Factory function
def get_daao_router() -> DAAORouter:
    """
    Factory function to create DAAO router instance

    Returns:
        DAAORouter: Configured router ready for task routing

    Example:
        >>> router = get_daao_router()
        >>> decision = router.route_task({'description': 'Fix bug', 'priority': 0.5})
        >>> print(f"Route to: {decision.model}")
    """
    return DAAORouter()


# Example usage
if __name__ == "__main__":
    router = get_daao_router()

    # Test tasks
    test_tasks = [
        {
            'description': 'Fix typo in README.md',
            'priority': 0.1,
            'required_tools': []
        },
        {
            'description': 'Design and implement a scalable microservices architecture with authentication, database integration, and deployment pipeline',
            'priority': 0.9,
            'required_tools': ['docker', 'kubernetes', 'database', 'auth', 'ci/cd']
        },
        {
            'description': 'Write a function to calculate factorial',
            'priority': 0.3,
            'required_tools': []
        },
        {
            'description': 'Optimize database queries and implement caching for performance',
            'priority': 0.7,
            'required_tools': ['database', 'redis', 'profiler']
        }
    ]

    print("=" * 80)
    print("DAAO ROUTING DEMONSTRATION")
    print("=" * 80)

    for i, task in enumerate(test_tasks, 1):
        decision = router.route_task(task)
        print(f"\nTask {i}: {task['description'][:60]}...")
        print(f"  Difficulty: {decision.difficulty.value}")
        print(f"  Model: {decision.model}")
        print(f"  Est. Cost: ${decision.estimated_cost:.6f}")
        print(f"  Confidence: {decision.confidence:.2f}")
        print(f"  Reasoning: {decision.reasoning}")

    # Cost savings estimate
    print("\n" + "=" * 80)
    print("COST SAVINGS ESTIMATE")
    print("=" * 80)

    savings = router.estimate_cost_savings(test_tasks)
    print(f"Tasks: {savings['num_tasks']}")
    print(f"Baseline Cost (GPT-4o for all): ${savings['baseline_cost']:.6f}")
    print(f"DAAO Cost (optimized): ${savings['daao_cost']:.6f}")
    print(f"Savings: ${savings['savings']:.6f} ({savings['savings_percent']:.1f}%)")
    print(f"\nExpected from paper: 36% cost reduction")
    print(f"Actual in demo: {savings['savings_percent']:.1f}% cost reduction")
