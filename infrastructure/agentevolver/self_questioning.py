"""
Self-Questioning Task Generator for AgentEvolver Phase 1

Autonomous task generation driven by curiosity. The agent generates its own training
tasks instead of relying on predefined datasets, as described in AgentEvolver paper
(arXiv:2511.10395).

Key Components:
- CuriosityScorer: Score task novelty (0-100) via semantic distance from experiences
- TaskGenerator: Generate task variations using curiosity-driven exploration
- SelfQuestioningEngine: Orchestrate task generation with statistics tracking

Performance Targets:
- Task generation latency: <200ms per task
- Novelty scoring: <50ms per query
- Support for business-domain tasks (marketing, SEO, content, deployment)

Author: Thon (Python Expert)
Date: November 15, 2025
"""

import asyncio
import logging
import time
import hashlib
import random
from dataclasses import dataclass, field, asdict
from datetime import datetime, timezone
from typing import List, Optional, Dict, Any, Tuple
import numpy as np
from enum import Enum

from infrastructure.agentevolver.embedder import TaskEmbedder
from infrastructure.agentevolver.experience_buffer import ExperienceBuffer

logger = logging.getLogger(__name__)


class TaskDifficulty(Enum):
    """Task difficulty levels."""
    EASY = "easy"
    MEDIUM = "medium"
    HARD = "hard"
    EXPERT = "expert"


class TaskDomain(Enum):
    """Business domain categories for task generation."""
    MARKETING = "marketing"
    SEO = "seo"
    CONTENT = "content"
    DEPLOYMENT = "deployment"
    GENERAL = "general"


@dataclass
class Task:
    """Structured task representation."""

    task_id: str
    description: str
    domain: TaskDomain
    difficulty: TaskDifficulty
    expected_approach: str
    curiosity_score: float  # 0-100 novelty score
    novelty_rationale: str
    embedding: Optional[np.ndarray] = None
    created_at: str = field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for serialization."""
        return {
            "task_id": self.task_id,
            "description": self.description,
            "domain": self.domain.value,
            "difficulty": self.difficulty.value,
            "expected_approach": self.expected_approach,
            "curiosity_score": self.curiosity_score,
            "novelty_rationale": self.novelty_rationale,
            "created_at": self.created_at,
        }


# Legacy compatibility class
@dataclass
class GeneratedTask:
    """Represents an autonomously generated training task (legacy)."""
    task_id: str
    task_type: str
    description: str
    novelty_score: float
    feasibility_score: float
    strategic_value: float
    overall_priority: float
    domain: str
    required_tools: List[str]
    expected_quality_metric: str
    generated_at: str

    def to_dict(self) -> Dict:
        return asdict(self)


class CuriosityScorer:
    """
    Score task novelty based on semantic distance from existing experiences.

    Higher scores indicate more novel/interesting tasks for agent exploration.
    Uses embeddings to compute semantic similarity to existing experiences.
    """

    def __init__(
        self,
        embedder: Optional[TaskEmbedder] = None,
        experience_buffer: Optional[ExperienceBuffer] = None
    ):
        """
        Initialize curiosity scorer.

        Args:
            embedder: TaskEmbedder instance for generating task embeddings
            experience_buffer: ExperienceBuffer with stored experiences (optional)
        """
        self.embedder = embedder or TaskEmbedder(use_local=True)
        self.experience_buffer = experience_buffer
        self.scoring_stats = {
            "total_queries": 0,
            "avg_novelty": 0.0,
            "min_novelty": 100.0,
            "max_novelty": 0.0,
            "avg_latency_ms": 0.0,
        }

    async def score_novelty(
        self,
        task_description: str,
        task_embedding: Optional[np.ndarray] = None,
        top_k: int = 5
    ) -> Tuple[float, str]:
        """
        Score task novelty (0-100) based on semantic distance from experiences.

        Novelty = 100 when task is maximally different from existing experiences.
        Novelty = 0 when task is identical to existing experience.

        Args:
            task_description: Task description to score
            task_embedding: Pre-computed task embedding (optional)
            top_k: Number of closest experiences to consider

        Returns:
            Tuple of (novelty_score: 0-100, rationale: str)
        """
        start_time = time.time()
        self.scoring_stats["total_queries"] += 1

        # Embed task if not provided
        if task_embedding is None:
            try:
                task_embedding = await self.embedder.embed(task_description)
            except Exception as e:
                logger.error(f"Failed to embed task for novelty scoring: {e}")
                return 50.0, "Embedding failed, default medium novelty"

        # No buffer: return high novelty for exploration
        if self.experience_buffer is None or len(self.experience_buffer.experiences) == 0:
            elapsed_ms = (time.time() - start_time) * 1000
            self._update_stats(100.0, elapsed_ms)
            return 100.0, "No experiences in buffer, maximum novelty for exploration"

        # Compute similarities to stored experiences
        try:
            similarities = self.experience_buffer._compute_similarities(task_embedding)

            if similarities.size == 0:
                elapsed_ms = (time.time() - start_time) * 1000
                self._update_stats(100.0, elapsed_ms)
                return 100.0, "No experience embeddings, maximum novelty"

            # Get max similarity to closest experience
            max_similarity = float(np.max(similarities))

            # Ensure similarity is within valid bounds [-1, 1]
            max_similarity = np.clip(max_similarity, -1.0, 1.0)

            # Convert similarity ([-1, 1]) to novelty (0, 100)
            novelty = np.clip((1.0 - max_similarity) * 100.0, 0.0, 100.0)

            # Get closest experience info for rationale
            closest_idx = int(np.argmax(similarities))
            closest_exp_id = self.experience_buffer.experience_ids[closest_idx]
            closest_exp = self.experience_buffer.experiences[closest_exp_id]

            rationale = (
                f"Similarity to closest experience: {max_similarity:.2f}. "
                f"Closest: '{closest_exp.task_description[:50]}...'"
            )

        except Exception as e:
            logger.error(f"Failed to compute similarities: {e}")
            return 50.0, f"Similarity computation failed: {e}"

        elapsed_ms = (time.time() - start_time) * 1000
        self._update_stats(novelty, elapsed_ms)

        if elapsed_ms > 50:
            logger.warning(f"Novelty scoring took {elapsed_ms:.1f}ms (target: <50ms)")

        return novelty, rationale

    def _update_stats(self, novelty: float, latency_ms: float) -> None:
        """Update internal statistics."""
        stats = self.scoring_stats
        stats["min_novelty"] = min(stats["min_novelty"], novelty)
        stats["max_novelty"] = max(stats["max_novelty"], novelty)

        n = stats["total_queries"]
        if n > 0:
            stats["avg_novelty"] = (
                (stats["avg_novelty"] * (n - 1) + novelty) / n
            )
            stats["avg_latency_ms"] = (
                (stats["avg_latency_ms"] * (n - 1) + latency_ms) / n
            )

    def get_stats(self) -> Dict[str, Any]:
        """Get curiosity scoring statistics."""
        return self.scoring_stats.copy()


class TaskGenerator:
    """
    Generate new task variations from successful experiences.

    Uses curiosity scores to prioritize novel exploration directions.
    Generates business-domain tasks (marketing, SEO, content, deployment).
    """

    DOMAIN_TEMPLATES = {
        TaskDomain.MARKETING: [
            "Create a marketing campaign strategy for {product} targeting {audience}",
            "Analyze marketing effectiveness for {product} in {market}",
            "Generate customer engagement strategy for {product}",
            "Develop pricing strategy for {product}",
            "Design A/B testing framework for {product}",
        ],
        TaskDomain.SEO: [
            "Optimize SEO for {target_keyword} in {industry}",
            "Analyze competitor SEO strategy for {competitor}",
            "Create content strategy for keyword: {target_keyword}",
            "Develop backlink strategy for {domain}",
            "Audit technical SEO for {domain}",
        ],
        TaskDomain.CONTENT: [
            "Write engaging content about {topic} for {audience}",
            "Create content calendar for {brand} across {platforms}",
            "Develop thought leadership piece on {topic}",
            "Generate social media content for {product}",
            "Create case study for {customer} using {solution}",
        ],
        TaskDomain.DEPLOYMENT: [
            "Design deployment pipeline for {service} using {platform}",
            "Optimize infrastructure scaling for {application}",
            "Create disaster recovery plan for {system}",
            "Develop monitoring strategy for {service}",
            "Design blue-green deployment for {application}",
        ],
        TaskDomain.GENERAL: [
            "Analyze {topic} and identify key insights",
            "Create implementation plan for {initiative}",
            "Develop strategy for {objective}",
            "Design solution for {problem}",
            "Evaluate {option1} vs {option2} for {use_case}",
        ],
    }

    def __init__(
        self,
        embedder: Optional[TaskEmbedder] = None,
        curiosity_scorer: Optional[CuriosityScorer] = None
    ):
        """Initialize task generator."""
        self.embedder = embedder or TaskEmbedder(use_local=True)
        self.curiosity_scorer = curiosity_scorer or CuriosityScorer(embedder=self.embedder)
        self.generation_counter = 0

    async def generate_task(
        self,
        domain: TaskDomain = TaskDomain.GENERAL,
        difficulty: TaskDifficulty = TaskDifficulty.MEDIUM,
        context_variables: Optional[Dict[str, str]] = None
    ) -> Task:
        """Generate a single task with novelty scoring."""
        self.generation_counter += 1

        # Get template for domain
        templates = self.DOMAIN_TEMPLATES.get(domain, self.DOMAIN_TEMPLATES[TaskDomain.GENERAL])
        template = random.choice(templates)

        # Fill template with context variables
        context = context_variables or self._get_default_context(domain, difficulty)
        try:
            description = template.format(**context)
        except KeyError as e:
            logger.warning(f"Template variable missing: {e}, using template as-is")
            description = template

        # Embed task description
        try:
            embedding = await self.embedder.embed(description)
        except Exception as e:
            logger.error(f"Failed to embed generated task: {e}")
            embedding = None

        # Score novelty
        curiosity_score, rationale = await self.curiosity_scorer.score_novelty(
            description,
            task_embedding=embedding
        )

        # Determine expected approach based on difficulty
        expected_approach = self._get_expected_approach(domain, difficulty, description)

        # Create task
        task_id = f"task_{self.generation_counter}_{int(time.time() * 1000)}"
        task = Task(
            task_id=task_id,
            description=description,
            domain=domain,
            difficulty=difficulty,
            expected_approach=expected_approach,
            curiosity_score=curiosity_score,
            novelty_rationale=rationale,
            embedding=embedding
        )

        logger.info(
            f"Generated {task.domain.value} task (id: {task_id}, "
            f"novelty: {curiosity_score:.1f}, difficulty: {difficulty.value})"
        )

        return task

    def _get_default_context(self, domain: TaskDomain, difficulty: TaskDifficulty) -> Dict[str, str]:
        """Get default context variables for template filling."""
        defaults = {
            TaskDomain.MARKETING: {
                "product": "SaaS platform",
                "audience": "enterprise customers",
                "market": "North America",
                "competitor": "leading competitor",
                "brand": "brand X",
                "platforms": "social media",
            },
            TaskDomain.SEO: {
                "target_keyword": "AI-powered automation",
                "industry": "enterprise software",
                "competitor": "industry leader",
                "domain": "example.com",
            },
            TaskDomain.CONTENT: {
                "topic": "machine learning trends",
                "audience": "technical professionals",
                "brand": "tech brand",
                "product": "SaaS solution",
                "customer": "Fortune 500 company",
                "solution": "enterprise platform",
            },
            TaskDomain.DEPLOYMENT: {
                "service": "microservice",
                "platform": "Kubernetes",
                "application": "web application",
                "system": "distributed system",
            },
            TaskDomain.GENERAL: {
                "topic": "business strategy",
                "initiative": "digital transformation",
                "objective": "market expansion",
                "problem": "operational efficiency",
                "option1": "Solution A",
                "option2": "Solution B",
                "use_case": "enterprise adoption",
            }
        }
        return defaults.get(domain, defaults[TaskDomain.GENERAL])

    def _get_expected_approach(
        self,
        domain: TaskDomain,
        difficulty: TaskDifficulty,
        description: str
    ) -> str:
        """Generate expected approach hint based on domain and difficulty."""
        approaches = {
            TaskDomain.MARKETING: "Use data-driven analysis, competitor research, and customer personas",
            TaskDomain.SEO: "Conduct keyword research, analyze SERP competitors, audit technical factors",
            TaskDomain.CONTENT: "Develop content pillars, create outlines, ensure audience alignment",
            TaskDomain.DEPLOYMENT: "Design architecture, define rollout strategy, establish monitoring",
            TaskDomain.GENERAL: "Break down problem, identify key factors, propose solutions",
        }
        base = approaches.get(domain, approaches[TaskDomain.GENERAL])

        difficulty_hints = {
            TaskDifficulty.EASY: "Focus on foundational concepts",
            TaskDifficulty.MEDIUM: "Balance simplicity with comprehensive analysis",
            TaskDifficulty.HARD: "Consider edge cases and advanced optimizations",
            TaskDifficulty.EXPERT: "Synthesize multiple domains and advanced techniques",
        }

        hint = difficulty_hints.get(difficulty, "")
        return f"{base}. {hint}" if hint else base


class SelfQuestioningEngine:
    """
    Main orchestrator for autonomous task generation.

    Combines curiosity scoring and task generation to create a stream of
    increasingly novel tasks. Tracks generation statistics and integrates
    with ExperienceBuffer for learning.
    """

    def __init__(
        self,
        agent_name: str = None,
        agent_type: str = None,
        embedder: Optional[TaskEmbedder] = None,
        experience_buffer: Optional[ExperienceBuffer] = None,
        max_task_difficulty: float = 1.0
    ):
        """
        Initialize Self-Questioning Engine.

        Args:
            agent_name: Name of agent using this engine (Phase 2 style)
            agent_type: Type of agent for legacy compatibility
            embedder: TaskEmbedder instance
            experience_buffer: ExperienceBuffer for semantic search
            max_task_difficulty: Max difficulty (0-1) to generate
        """
        # Support both naming conventions
        self.agent_name = agent_name or agent_type or "default_agent"
        self.agent_type = agent_type or agent_name or "default"
        self.max_task_difficulty = max_task_difficulty

        self.embedder = embedder or TaskEmbedder(use_local=True)
        self.experience_buffer = experience_buffer

        # Initialize components
        self.curiosity_scorer = CuriosityScorer(
            embedder=self.embedder,
            experience_buffer=self.experience_buffer
        )
        self.task_generator = TaskGenerator(
            embedder=self.embedder,
            curiosity_scorer=self.curiosity_scorer
        )

        # Statistics tracking
        self.generation_stats = {
            "total_tasks_generated": 0,
            "avg_novelty": 0.0,
            "domain_distribution": {},
            "difficulty_distribution": {},
            "generation_start_time": datetime.now(timezone.utc).isoformat(),
            "total_generation_time_ms": 0.0,
            "avg_latency_per_task_ms": 0.0,
        }

        # Legacy: exploration frontier
        self.task_history: List[GeneratedTask] = []
        self.exploration_frontier: Dict[str, float] = self._init_exploration_frontier()

        logger.info(
            f"[SelfQuestioningEngine] Initialized for {self.agent_name} agent "
            f"(max_difficulty={max_task_difficulty})"
        )

    def _init_exploration_frontier(self) -> Dict[str, float]:
        """Initialize domain coverage tracking (legacy)."""
        return {
            'saas': 60.0,
            'ecommerce': 45.0,
            'fintech': 30.0,
            'healthcare': 20.0,
            'education': 25.0,
            'marketplace': 40.0,
            'social': 50.0,
            'ai_tools': 35.0,
            'productivity': 55.0,
            'entertainment': 15.0
        }

    async def generate_autonomous_tasks(
        self,
        num_tasks: int,
        focus_domain: Optional[str] = None,
        difficulty_distribution: Optional[Dict[str, float]] = None
    ) -> List[Task]:
        """
        Generate autonomous tasks driven by curiosity.

        Main orchestration method that generates tasks with novelty-based
        prioritization. Tracks statistics for Phase 2 integration.

        Args:
            num_tasks: Number of tasks to generate
            focus_domain: Optional domain to focus on (None for mixed)
            difficulty_distribution: Dict mapping difficulty names to probabilities

        Returns:
            List of generated Task objects sorted by curiosity score (descending)
        """
        if num_tasks <= 0:
            raise ValueError("num_tasks must be positive")

        start_time = time.time()

        # Parse focus domain
        domain = None
        if focus_domain:
            try:
                domain = TaskDomain[focus_domain.upper()]
            except KeyError:
                logger.warning(f"Unknown domain: {focus_domain}, using GENERAL")
                domain = TaskDomain.GENERAL

        # Default difficulty distribution (uniform)
        if difficulty_distribution is None:
            difficulties = list(TaskDifficulty)
            difficulty_distribution = {d.value: 1.0 / len(difficulties) for d in difficulties}

        # Generate tasks
        tasks = []
        for i in range(num_tasks):
            if domain:
                selected_domain = domain
            else:
                selected_domain = random.choice(list(TaskDomain))

            difficulty_name = random.choices(
                list(difficulty_distribution.keys()),
                weights=list(difficulty_distribution.values())
            )[0]
            selected_difficulty = TaskDifficulty[difficulty_name.upper()]

            try:
                task = await self.task_generator.generate_task(
                    domain=selected_domain,
                    difficulty=selected_difficulty
                )
                tasks.append(task)
                self._update_generation_stats(task)
            except Exception as e:
                logger.error(f"Failed to generate task {i}: {e}")
                continue

        elapsed_ms = (time.time() - start_time) * 1000
        self.generation_stats["total_generation_time_ms"] += elapsed_ms

        if elapsed_ms > (num_tasks * 200):
            logger.warning(
                f"Task generation took {elapsed_ms:.1f}ms for {num_tasks} tasks "
                f"(avg: {elapsed_ms/num_tasks:.1f}ms/task, target: <200ms)"
            )
        else:
            logger.info(
                f"Generated {num_tasks} tasks in {elapsed_ms:.1f}ms "
                f"(avg: {elapsed_ms/num_tasks:.1f}ms/task)"
            )

        # Sort by novelty (descending)
        tasks.sort(key=lambda t: t.curiosity_score, reverse=True)

        return tasks

    async def generate_tasks(self, num_tasks: int = 10) -> List[GeneratedTask]:
        """
        Generate N novel, feasible tasks (legacy interface).

        Args:
            num_tasks: Number of tasks to generate

        Returns:
            List of ranked GeneratedTask objects
        """
        tasks = []
        for i in range(num_tasks):
            domain = self._select_underexplored_domain()
            task_type = self.agent_type

            novelty_score = self._score_novelty(domain, task_type)
            feasibility_score = self._score_feasibility(task_type)
            strategic_value = self._score_strategic_value(domain, task_type)

            overall_priority = (
                novelty_score * 0.4 +
                feasibility_score * 0.4 +
                strategic_value * 0.2
            )

            task_desc = self._render_task_from_template(domain, i)

            task = GeneratedTask(
                task_id=f"SELF-Q-{datetime.now().strftime('%Y%m%d%H%M%S')}-{i}",
                task_type=task_type,
                description=task_desc,
                novelty_score=novelty_score,
                feasibility_score=feasibility_score,
                strategic_value=strategic_value,
                overall_priority=overall_priority,
                domain=domain,
                required_tools=self._get_required_tools(task_type),
                expected_quality_metric=self._get_quality_metric(task_type),
                generated_at=datetime.now().isoformat()
            )
            tasks.append(task)

        tasks.sort(key=lambda t: t.overall_priority, reverse=True)
        self.task_history.extend(tasks)

        logger.info(
            f"[SelfQuestioningEngine] Generated {len(tasks)} tasks for {self.agent_type} agent. "
            f"Top priority: {tasks[0].task_type} (score={tasks[0].overall_priority:.1f})"
        )

        return tasks

    def _select_underexplored_domain(self) -> str:
        """Select domain with lowest exploration coverage (legacy)."""
        return min(self.exploration_frontier, key=self.exploration_frontier.get)

    def _render_task_from_template(self, domain: str, task_index: int) -> str:
        """Render task description from template (legacy)."""
        templates = {
            'marketing': [
                "Create growth strategy for {domain} targeting {audience} with ${budget} budget",
                "Generate viral content series for {domain} product launch",
                "Design referral program for {domain} with {audience}",
            ],
            'content': [
                "Write {content_type} about {topic} for {domain} {audience}",
                "Create {num_pieces} content pieces for {domain} {content_strategy}",
            ],
            'seo': [
                "Research and rank {num_keywords} keywords for {domain} {topic}",
                "Optimize {num_pages} pages in {domain} for top 100 rankings",
            ]
        }

        agent_templates = templates.get(self.agent_type, [])
        if not agent_templates:
            return f"Execute {self.agent_type} task for {domain}"

        template = agent_templates[task_index % len(agent_templates)]

        vars_map = {
            'domain': domain.capitalize(),
            'audience': self._get_audience_for_domain(domain),
            'budget': self._get_budget_for_domain(domain),
            'topic': self._get_trending_topic(domain),
        }

        for key, value in vars_map.items():
            template = template.replace('{' + key + '}', str(value))

        return template

    def _score_novelty(self, domain: str, task_type: str) -> float:
        """Score task novelty (legacy)."""
        domain_coverage = self.exploration_frontier.get(domain, 50.0)
        novelty = 100.0 - domain_coverage
        return min(novelty, self.max_task_difficulty * 100.0)

    def _score_feasibility(self, task_type: str) -> float:
        """Score task feasibility (legacy)."""
        base_feasibility = 85.0
        return base_feasibility + (5.0 * (hash(task_type) % 3) - 5.0)

    def _score_strategic_value(self, domain: str, task_type: str) -> float:
        """Score strategic value (legacy)."""
        domain_coverage = self.exploration_frontier.get(domain, 50.0)
        strategic = 100.0 - domain_coverage
        return min(strategic, 100.0)

    def _get_required_tools(self, task_type: str) -> List[str]:
        """Get required tools (legacy)."""
        tool_map = {
            'marketing': ['strategy_writer', 'content_generator', 'trend_analyzer'],
            'content': ['blog_writer', 'outline_creator', 'seo_optimizer'],
            'seo': ['keyword_research', 'rank_tracker', 'backlink_analyzer']
        }
        return tool_map.get(task_type, [])

    def _get_quality_metric(self, task_type: str) -> str:
        """Get quality metric (legacy)."""
        metric_map = {
            'marketing': 'strategy_quality_score (0-100)',
            'content': 'content_quality_score (0-100)',
            'seo': 'seo_score_improvement (0-100)'
        }
        return metric_map.get(task_type, 'task_completion_quality')

    def _get_audience_for_domain(self, domain: str) -> str:
        """Get target audience (legacy)."""
        audience_map = {
            'saas': 'startup founders',
            'ecommerce': 'small business owners',
            'fintech': 'millennial investors',
            'healthcare': 'healthcare providers',
            'education': 'students',
        }
        return audience_map.get(domain, 'target users')

    def _get_budget_for_domain(self, domain: str) -> str:
        """Get budget (legacy)."""
        budgets = {
            'saas': '2000',
            'ecommerce': '1500',
            'fintech': '3000',
            'healthcare': '2500',
            'education': '1000',
        }
        return budgets.get(domain, '2000')

    def _get_trending_topic(self, domain: str) -> str:
        """Get trending topic (legacy)."""
        topics = {
            'saas': 'AI automation',
            'ecommerce': 'personalization',
            'fintech': 'crypto integration',
            'healthcare': 'telemedicine',
        }
        return topics.get(domain, 'latest trends')

    def _update_generation_stats(self, task: Task) -> None:
        """Update generation statistics with new task."""
        stats = self.generation_stats
        n = stats["total_tasks_generated"]

        stats["avg_novelty"] = (
            (stats["avg_novelty"] * n + task.curiosity_score) / (n + 1)
        )

        domain_key = task.domain.value
        if domain_key not in stats["domain_distribution"]:
            stats["domain_distribution"][domain_key] = 0
        stats["domain_distribution"][domain_key] += 1

        diff_key = task.difficulty.value
        if diff_key not in stats["difficulty_distribution"]:
            stats["difficulty_distribution"][diff_key] = 0
        stats["difficulty_distribution"][diff_key] += 1

        stats["total_tasks_generated"] += 1

        total_time = stats["total_generation_time_ms"]
        total_tasks = stats["total_tasks_generated"]
        stats["avg_latency_per_task_ms"] = total_time / total_tasks if total_tasks > 0 else 0.0

    def get_generation_stats(self) -> Dict[str, Any]:
        """Get comprehensive generation statistics."""
        return {
            **self.generation_stats,
            "curiosity_scorer_stats": self.curiosity_scorer.get_stats(),
        }

    def get_statistics(self) -> Dict:
        """Get engine statistics (legacy)."""
        return {
            'agent_type': self.agent_type,
            'total_tasks_generated': len(self.task_history),
            'exploration_frontier': self.exploration_frontier,
            'avg_novelty_score': (
                sum(t.novelty_score for t in self.task_history) / len(self.task_history)
                if self.task_history else 0.0
            ),
        }

    async def integrate_experience(
        self,
        task: Task,
        success: bool,
        quality_score: float
    ) -> None:
        """Integrate task execution result into experience buffer."""
        if self.experience_buffer is None:
            logger.debug("No experience buffer, skipping integration")
            return

        try:
            if success and quality_score >= self.experience_buffer.min_quality:
                await self.experience_buffer.store_experience(
                    trajectory={"task_id": task.task_id, "description": task.description},
                    quality_score=quality_score,
                    task_description=task.description
                )
                logger.info(
                    f"Stored execution of {task.task_id} "
                    f"(success={success}, quality={quality_score:.1f})"
                )
        except Exception as e:
            logger.error(f"Failed to integrate experience: {e}")

    def update_exploration_frontier(self, domain: str, coverage_increase: float):
        """Update exploration frontier after task execution (legacy)."""
        current = self.exploration_frontier.get(domain, 50.0)
        self.exploration_frontier[domain] = min(100.0, current + coverage_increase)
        logger.info(
            f"[SelfQuestioningEngine] Updated {domain} coverage: "
            f"{current:.1f} -> {self.exploration_frontier[domain]:.1f}"
        )

    def reset_stats(self) -> None:
        """Reset all generation statistics."""
        self.generation_stats = {
            "total_tasks_generated": 0,
            "avg_novelty": 0.0,
            "domain_distribution": {},
            "difficulty_distribution": {},
            "generation_start_time": datetime.now(timezone.utc).isoformat(),
            "total_generation_time_ms": 0.0,
            "avg_latency_per_task_ms": 0.0,
        }
        logger.info("Reset generation statistics")
