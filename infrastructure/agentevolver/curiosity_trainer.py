"""
Curiosity-Driven Trainer - Phase 1 Self-Questioning Training Loop
Part of AgentEvolver: Autonomous agent self-improvement via task generation and execution

Core Components:
1. TrainingSession: Metadata and metrics for individual training sessions
2. CuriosityDrivenTrainer: Single-agent training executor with novelty-weighted task selection
3. TrainingOrchestrator: Multi-agent coordinator with parallel training and experience pooling

Architecture:
- Generates tasks via SelfQuestioningEngine
- Executes tasks with novelty-weighted prioritization
- Evaluates output quality with domain-specific metrics
- Stores high-quality experiences (>90) in ExperienceBuffer
- Tracks AP2 costs with early stopping if budget exhausted
- Orchestrates parallel training across 4+ agent types at 100+ tasks/minute

Author: Nova (Vertex AI Agent Specialist)
Date: November 15, 2025
"""

import logging
import asyncio
import time
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Callable, Any, Tuple
from dataclasses import dataclass, asdict, field
from enum import Enum
import json

from infrastructure.ap2_protocol import get_ap2_client

logger = logging.getLogger(__name__)


class TaskStatus(Enum):
    """Status of a training task"""
    PENDING = "pending"
    EXECUTING = "executing"
    COMPLETED = "completed"
    FAILED = "failed"
    SKIPPED = "skipped"


@dataclass
class TrainingMetrics:
    """Metrics from a training session"""
    session_id: str
    agent_type: str
    tasks_executed: int
    tasks_succeeded: int
    success_rate: float
    avg_quality_score: float
    total_cost_incurred: float
    cost_per_task: float
    improvement_delta: float  # Improvement vs baseline
    high_quality_experiences_stored: int
    timestamp: str
    duration_seconds: float = 0.0
    tasks_skipped: int = 0
    novelty_weighted_score: float = 0.0

    def to_dict(self) -> Dict:
        return asdict(self)

    def __str__(self) -> str:
        return (
            f"TrainingMetrics(session={self.session_id}, "
            f"agent={self.agent_type}, executed={self.tasks_executed}, "
            f"success_rate={self.success_rate:.2%}, "
            f"avg_quality={self.avg_quality_score:.1f}, "
            f"cost=${self.total_cost_incurred:.2f}, "
            f"duration={self.duration_seconds:.1f}s)"
        )


@dataclass
class TrainingSession:
    """
    Tracks metadata and metrics for a complete training session.

    Stores session state for resumption, monitoring, and analysis.
    """
    session_id: str
    agent_type: str
    start_time: datetime
    end_time: Optional[datetime] = None
    tasks_completed: int = 0
    tasks_total: int = 0
    avg_novelty_score: float = 0.0
    quality_scores: List[float] = field(default_factory=list)
    improvement_delta: float = 0.0
    cost_delta: float = 0.0
    cost_savings: float = 0.0
    experiences_stored: int = 0
    status: str = "in_progress"
    error_log: List[str] = field(default_factory=list)
    metadata: Dict[str, Any] = field(default_factory=dict)

    @property
    def duration_seconds(self) -> float:
        """Calculate session duration in seconds"""
        end = self.end_time or datetime.now()
        return (end - self.start_time).total_seconds()

    @property
    def success_rate(self) -> float:
        """Calculate success rate from quality scores"""
        if not self.quality_scores:
            return 0.0
        high_quality = sum(1 for q in self.quality_scores if q >= 75.0)
        return high_quality / len(self.quality_scores) if self.quality_scores else 0.0

    def add_quality_score(self, score: float) -> None:
        """Track quality score for this session"""
        self.quality_scores.append(score)
        if self.quality_scores:
            self.improvement_delta = (sum(self.quality_scores) / len(self.quality_scores)) - 50.0

    def mark_complete(self) -> None:
        """Mark session as complete"""
        self.end_time = datetime.now()
        self.status = "completed"

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for logging/storage"""
        return {
            "session_id": self.session_id,
            "agent_type": self.agent_type,
            "start_time": self.start_time.isoformat(),
            "end_time": self.end_time.isoformat() if self.end_time else None,
            "duration_seconds": self.duration_seconds,
            "tasks_completed": self.tasks_completed,
            "tasks_total": self.tasks_total,
            "avg_novelty_score": self.avg_novelty_score,
            "success_rate": self.success_rate,
            "improvement_delta": self.improvement_delta,
            "cost_delta": self.cost_delta,
            "cost_savings": self.cost_savings,
            "experiences_stored": self.experiences_stored,
            "status": self.status,
            "metadata": self.metadata,
        }


class CuriosityDrivenTrainer:
    """
    Executes self-generated tasks with novelty-weighted prioritization.

    Workflow:
    1. Receive ranked tasks from SelfQuestioningEngine (sorted by novelty)
    2. Execute tasks prioritizing high-novelty, high-feasibility items
    3. Evaluate output quality with domain-specific scoring
    4. Store high-quality results (>90) in ExperienceBuffer
    5. Track AP2 costs; early stop if budget exhausted
    6. Return comprehensive metrics including novelty-weighted improvements

    Performance target: 25 tasks/minute per trainer (100+ total across 4 agents)
    """

    def __init__(
        self,
        agent_type: str,
        agent_executor: Callable,
        experience_buffer: Optional[Any] = None,
        quality_threshold: float = 75.0,
        max_tasks_per_session: int = 50,
        early_stop_patience: int = 5
    ):
        """
        Initialize Curiosity Trainer

        Args:
            agent_type: Type of agent ('marketing', 'content', 'seo', 'deploy')
            agent_executor: Async callable(task_description) -> result dict
            experience_buffer: ExperienceBuffer instance for storing results
            quality_threshold: Minimum quality score (0-100) to store in buffer
            max_tasks_per_session: Max tasks to execute per session
            early_stop_patience: Stop after N tasks with no quality improvement
        """
        self.agent_type = agent_type
        self.agent_executor = agent_executor
        self.experience_buffer = experience_buffer
        self.quality_threshold = quality_threshold
        self.max_tasks_per_session = max_tasks_per_session
        self.early_stop_patience = early_stop_patience
        self.session_count = 0
        self.best_quality_seen = 0.0

        logger.info(
            f"[CuriosityDrivenTrainer] Initialized for {agent_type} agent "
            f"(quality_threshold={quality_threshold}, early_stop_patience={early_stop_patience})"
        )

    async def train_epoch(
        self,
        num_tasks: int,
        agent_type: str,
        ap2_budget_remaining: float = 50.0,
        cost_per_task: float = 0.5,
        self_questioning_engine: Optional[Any] = None
    ) -> Tuple[TrainingMetrics, TrainingSession]:
        """
        Execute a complete training epoch with novelty-weighted task selection.

        Args:
            num_tasks: Target number of tasks to execute
            agent_type: Type of agent being trained
            ap2_budget_remaining: Remaining AP2 budget in dollars
            cost_per_task: AP2 cost per task execution
            self_questioning_engine: SelfQuestioningEngine instance for task generation

        Returns:
            Tuple of (TrainingMetrics, TrainingSession) for monitoring and logging
        """
        self.session_count += 1
        session_id = f"TRAIN-{datetime.now().strftime('%Y%m%d%H%M%S')}-{self.session_count}"
        session = TrainingSession(
            session_id=session_id,
            agent_type=agent_type,
            start_time=datetime.now(),
            tasks_total=num_tasks
        )

        # Generate tasks from SelfQuestioningEngine
        tasks = []
        if self_questioning_engine:
            try:
                tasks = await self_questioning_engine.generate_tasks(num_tasks)
                logger.info(f"[CuriosityDrivenTrainer] Generated {len(tasks)} tasks")
            except Exception as e:
                logger.error(f"[CuriosityDrivenTrainer] Task generation error: {e}")
                session.error_log.append(str(e))

        # Execute training with early stopping
        executed = 0
        succeeded = 0
        quality_scores = []
        total_cost = 0.0
        stored_count = 0
        no_improvement_count = 0
        start_time = time.time()

        logger.info(
            f"[CuriosityDrivenTrainer] Starting epoch {session_id} "
            f"with {len(tasks)} tasks (budget=${ap2_budget_remaining:.2f})"
        )

        for task in tasks:
            # Early stopping: no improvement for N tasks
            if no_improvement_count >= self.early_stop_patience:
                logger.warning(
                    f"[CuriosityDrivenTrainer] Early stopping after {no_improvement_count} "
                    f"tasks without improvement. Executed {executed}/{len(tasks)} tasks."
                )
                session.tasks_completed = executed
                break

            # Budget enforcement
            if total_cost + cost_per_task > ap2_budget_remaining:
                logger.warning(
                    f"[CuriosityDrivenTrainer] Budget limit reached. "
                    f"Executed {executed}/{len(tasks)} tasks. "
                    f"Spent ${total_cost:.2f}/{ap2_budget_remaining:.2f}"
                )
                session.tasks_completed = executed
                break

            # Execute task
            try:
                result = await self._execute_task(task)
                executed += 1
                session.tasks_completed = executed

                if result['success']:
                    succeeded += 1
                    quality_score = result.get('quality_score', 50.0)
                    quality_scores.append(quality_score)
                    session.add_quality_score(quality_score)

                    # Track improvement vs baseline
                    if quality_score > self.best_quality_seen:
                        self.best_quality_seen = quality_score
                        no_improvement_count = 0
                    else:
                        no_improvement_count += 1

                    # Get novelty score (works with both legacy GeneratedTask and modern Task objects)
                    novelty = getattr(task, 'novelty_score', getattr(task, 'curiosity_score', 0.0))
                    logger.info(
                        f"[CuriosityDrivenTrainer] Task {task.task_id} executed. "
                        f"Quality: {quality_score:.1f}/100, "
                        f"Novelty: {novelty:.1f}/100"
                    )

                    # Store high-quality experiences
                    if quality_score >= self.quality_threshold and self.experience_buffer:
                        try:
                            await self.experience_buffer.store_experience(
                                trajectory=result.get('output', {}),
                                quality_score=quality_score,
                                task_description=task.description
                            )
                            stored_count += 1
                            session.experiences_stored = stored_count
                            # Get novelty score (compatible with both Task types)
                            novelty_stored = getattr(task, 'novelty_score', getattr(task, 'curiosity_score', 0.0))
                            logger.info(
                                f"[CuriosityDrivenTrainer] Stored experience from {task.task_id} "
                                f"(quality={quality_score:.1f}, novelty={novelty_stored:.1f})"
                            )
                        except Exception as e:
                            logger.error(f"[CuriosityDrivenTrainer] Failed to store experience: {e}")
                else:
                    logger.warning(
                        f"[CuriosityDrivenTrainer] Task {task.task_id} failed: "
                        f"{result.get('error', 'Unknown error')}"
                    )
                    session.error_log.append(result.get('error', 'Unknown error'))
                    no_improvement_count += 1

                total_cost += cost_per_task

            except Exception as e:
                logger.error(f"[CuriosityDrivenTrainer] Task execution error: {e}")
                session.error_log.append(str(e))
                executed += 1
                no_improvement_count += 1

        # Calculate metrics
        duration = time.time() - start_time
        success_rate = succeeded / executed if executed > 0 else 0.0
        avg_quality = sum(quality_scores) / len(quality_scores) if quality_scores else 0.0
        cost_per_successful = total_cost / succeeded if succeeded > 0 else total_cost
        improvement_delta = avg_quality - 50.0
        # Calculate avg novelty (compatible with both Task types: novelty_score or curiosity_score)
        if executed > 0:
            novelties = [getattr(t, 'novelty_score', getattr(t, 'curiosity_score', 0.0)) for t in tasks[:executed]]
            avg_novelty = sum(novelties) / len(novelties) if novelties else 0.0
        else:
            avg_novelty = 0.0
        session.avg_novelty_score = avg_novelty
        session.cost_delta = total_cost

        metrics = TrainingMetrics(
            session_id=session_id,
            agent_type=agent_type,
            tasks_executed=executed,
            tasks_succeeded=succeeded,
            success_rate=success_rate,
            avg_quality_score=avg_quality,
            total_cost_incurred=total_cost,
            cost_per_task=cost_per_successful,
            improvement_delta=improvement_delta,
            high_quality_experiences_stored=stored_count,
            timestamp=datetime.now().isoformat(),
            duration_seconds=duration,
            novelty_weighted_score=avg_novelty
        )

        session.mark_complete()

        logger.info(
            f"[CuriosityDrivenTrainer] Epoch {session_id} complete. "
            f"Success: {succeeded}/{executed}, "
            f"Avg Quality: {avg_quality:.1f}, "
            f"Avg Novelty: {avg_novelty:.1f}, "
            f"Cost: ${total_cost:.2f}, "
            f"Experiences Stored: {stored_count}, "
            f"Duration: {duration:.1f}s"
        )

        # Emit AP2 event for cost tracking and compliance
        try:
            ap2_client = get_ap2_client()
            ap2_event = ap2_client.wrap(
                agent=agent_type,
                action=f"train_epoch_{session_id}",
                cost=total_cost,
                context={
                    "session_id": session_id,
                    "tasks_executed": str(executed),
                    "success_rate": f"{success_rate:.2%}",
                    "avg_quality": f"{avg_quality:.1f}",
                    "budget": str(ap2_budget_remaining)
                }
            )
            ap2_client.record_event(ap2_event)
            logger.info(f"[CuriosityDrivenTrainer] AP2 event emitted: {session_id}")
        except Exception as e:
            logger.error(f"[CuriosityDrivenTrainer] Failed to emit AP2 event: {e}")

        return metrics, session

    async def _execute_task(self, task: Any) -> Dict[str, Any]:
        """
        Execute a single task using agent executor

        Args:
            task: GeneratedTask object

        Returns:
            Dict with execution result and quality score
        """
        try:
            output = await self.agent_executor(task.description)
            quality_score = self._evaluate_output_quality(output, task)

            return {
                'success': True,
                'task_id': task.task_id,
                'output': output,
                'quality_score': quality_score
            }

        except Exception as e:
            logger.error(f"[CuriosityDrivenTrainer] Task execution failed: {e}")
            return {
                'success': False,
                'task_id': task.task_id,
                'error': str(e),
                'quality_score': 0.0
            }

    def _evaluate_output_quality(self, output: Any, task: Any) -> float:
        """
        Evaluate quality of task output (domain-specific scoring).

        Args:
            output: Output from agent executor
            task: Original GeneratedTask

        Returns:
            Quality score (0-100)
        """
        score = 50.0

        if not output:
            return 0.0

        # Convert to dict if string
        if isinstance(output, str):
            try:
                output = json.loads(output)
            except:
                output = {'result': output}

        # Agent-specific evaluation
        if self.agent_type == 'marketing':
            score += self._evaluate_marketing_output(output)
        elif self.agent_type == 'content':
            score += self._evaluate_content_output(output)
        elif self.agent_type == 'seo':
            score += self._evaluate_seo_output(output)
        elif self.agent_type == 'deploy':
            score += self._evaluate_deploy_output(output)

        # Bonus for matching expected metric
        if hasattr(task, 'expected_quality_metric') and task.expected_quality_metric:
            if isinstance(output, dict):
                for key in output.keys():
                    if 'quality' in key.lower() or 'score' in key.lower():
                        score += 5.0
                        break

        return min(100.0, max(0.0, score))

    def _evaluate_marketing_output(self, output: Dict) -> float:
        """Evaluate marketing strategy output quality"""
        try:
            bonus = 0.0
            required_keys = ['channels', 'budget', 'timeline', 'metrics']
            for key in required_keys:
                if key in output:
                    bonus += 10.0
            if isinstance(output.get('channels'), list) and len(output['channels']) >= 3:
                bonus += 10.0
            return min(50.0, bonus)
        except Exception:
            # Fallback if evaluation fails
            return 0.0

    def _evaluate_content_output(self, output: Dict) -> float:
        """Evaluate content creation output quality"""
        try:
            bonus = 0.0
            required_keys = ['title', 'sections', 'word_count']
            for key in required_keys:
                if key in output:
                    bonus += 15.0
            if isinstance(output.get('sections'), list) and len(output['sections']) >= 3:
                bonus += 5.0
            return min(50.0, bonus)
        except Exception:
            # Fallback if evaluation fails
            return 0.0

    def _evaluate_seo_output(self, output: Dict) -> float:
        """Evaluate SEO optimization output quality"""
        try:
            bonus = 0.0
            if 'keywords' in output and isinstance(output.get('keywords'), list):
                bonus += 15.0
                if len(output['keywords']) >= 5:
                    bonus += 10.0
            if 'recommendations' in output and isinstance(output.get('recommendations'), list):
                bonus += 15.0
            if 'seo_score_before' in output and 'seo_score_after' in output:
                try:
                    before = float(output['seo_score_before'])
                    after = float(output['seo_score_after'])
                    improvement = after - before
                    if improvement > 10:
                        bonus += 10.0
                except (TypeError, ValueError):
                    # Scores are not numeric, skip bonus
                    pass
            return min(50.0, bonus)
        except Exception:
            # Fallback if evaluation fails
            return 0.0

    def _evaluate_deploy_output(self, output: Dict) -> float:
        """Evaluate deployment output quality"""
        try:
            bonus = 0.0
            required_keys = ['deployment_plan', 'rollback_strategy', 'health_checks']
            for key in required_keys:
                if key in output:
                    bonus += 15.0
            if 'estimated_downtime' in output:
                bonus += 5.0
            return min(50.0, bonus)
        except Exception:
            # Fallback if evaluation fails
            return 0.0

    def get_session_history(self) -> Dict:
        """Get training session history and statistics"""
        return {
            'agent_type': self.agent_type,
            'total_sessions': self.session_count,
            'quality_threshold': self.quality_threshold,
            'buffer_enabled': self.experience_buffer is not None,
            'best_quality_seen': self.best_quality_seen
        }


class TrainingOrchestrator:
    """
    Multi-agent training coordinator orchestrating parallel training sessions.

    Features:
    - Parallel training across multiple agent types (marketing, seo, content, deploy)
    - Shared experience pool via ExperienceTransfer
    - Resource budgeting with AP2 cost tracking
    - Adaptive load balancing based on agent performance
    - Metrics aggregation across all agents
    - Target: 100+ tasks/minute across 4 agent types

    Architecture:
    - Maintains trainer instances for each agent type
    - Distributes AP2 budget proportionally
    - Coordinates experience sharing between trainers
    - Monitors and reports on collective progress
    """

    def __init__(
        self,
        max_concurrent_sessions: int = 4,
        total_ap2_budget: float = 200.0,
        max_budget_per_session: float = 50.0,
        cost_per_task: float = 0.5
    ):
        """
        Initialize Training Orchestrator

        Args:
            max_concurrent_sessions: Max parallel training sessions
            total_ap2_budget: Total AP2 budget for all sessions in dollars
            max_budget_per_session: Max budget per individual session
            cost_per_task: AP2 cost per task execution
        """
        self.max_concurrent_sessions = max_concurrent_sessions
        self.total_ap2_budget = total_ap2_budget
        self.max_budget_per_session = max_budget_per_session
        self.cost_per_task = cost_per_task
        self.trainers: Dict[str, CuriosityDrivenTrainer] = {}
        self.sessions: List[TrainingSession] = []
        self.spent_budget = 0.0
        self.start_time = datetime.now()

        logger.info(
            f"[TrainingOrchestrator] Initialized with "
            f"max_concurrent={max_concurrent_sessions}, "
            f"total_budget=${total_ap2_budget:.2f}, "
            f"max_per_session=${max_budget_per_session:.2f}"
        )

    def register_trainer(
        self,
        agent_type: str,
        trainer: CuriosityDrivenTrainer
    ) -> None:
        """Register a trainer for an agent type"""
        self.trainers[agent_type] = trainer
        logger.info(f"[TrainingOrchestrator] Registered trainer for {agent_type}")

    async def run_training_round(
        self,
        agent_types: List[str],
        tasks_per_agent: int = 25,
        self_questioning_engines: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Execute parallel training across multiple agents.

        Args:
            agent_types: List of agent types to train
            tasks_per_agent: Target tasks per agent
            self_questioning_engines: Dict mapping agent_type -> SelfQuestioningEngine

        Returns:
            Aggregated results and metrics across all agents
        """
        if not self_questioning_engines:
            self_questioning_engines = {}

        logger.info(
            f"[TrainingOrchestrator] Starting training round with "
            f"{len(agent_types)} agents, {tasks_per_agent} tasks each"
        )

        # Calculate budget per session
        budget_per_session = min(
            self.max_budget_per_session,
            self.total_ap2_budget / len(agent_types)
        )

        # Create training tasks
        training_tasks = []
        for agent_type in agent_types:
            if agent_type not in self.trainers:
                logger.warning(f"[TrainingOrchestrator] No trainer for {agent_type}")
                continue

            trainer = self.trainers[agent_type]
            engine = self_questioning_engines.get(agent_type)

            task = asyncio.create_task(
                trainer.train_epoch(
                    num_tasks=tasks_per_agent,
                    agent_type=agent_type,
                    ap2_budget_remaining=budget_per_session,
                    cost_per_task=self.cost_per_task,
                    self_questioning_engine=engine
                )
            )
            training_tasks.append((agent_type, task))

        # Execute concurrently with semaphore for rate limiting
        semaphore = asyncio.Semaphore(self.max_concurrent_sessions)
        results = {}

        async def run_with_semaphore(agent_type, task):
            async with semaphore:
                try:
                    metrics, session = await task
                    self.sessions.append(session)
                    self.spent_budget += metrics.total_cost_incurred
                    return agent_type, (metrics, session)
                except Exception as e:
                    logger.error(f"[TrainingOrchestrator] Error training {agent_type}: {e}")
                    return agent_type, None

        # Wait for all tasks with timeout
        round_tasks = [run_with_semaphore(at, t) for at, t in training_tasks]
        try:
            completed = await asyncio.wait_for(
                asyncio.gather(*round_tasks),
                timeout=300.0  # 5 minute timeout per round
            )
            for agent_type, result in completed:
                if result:
                    results[agent_type] = result
        except asyncio.TimeoutError:
            logger.error("[TrainingOrchestrator] Training round timed out")

        # Aggregate metrics
        aggregated = self._aggregate_metrics(results)

        logger.info(
            f"[TrainingOrchestrator] Training round complete. "
            f"Agents trained: {len(results)}, "
            f"Total cost: ${self.spent_budget:.2f}, "
            f"Avg quality across all: {aggregated['overall_avg_quality']:.1f}"
        )

        return aggregated

    def _aggregate_metrics(self, results: Dict[str, Tuple]) -> Dict[str, Any]:
        """Aggregate metrics across all agent trainers"""
        if not results:
            return {
                'agents_trained': 0,
                'total_tasks_executed': 0,
                'overall_success_rate': 0.0,
                'overall_avg_quality': 0.0,
                'total_cost': self.spent_budget,
                'budget_remaining': self.total_ap2_budget - self.spent_budget,
                'total_experiences_stored': 0,
                'training_duration': (datetime.now() - self.start_time).total_seconds(),
                'by_agent': {}
            }

        total_tasks = 0
        total_succeeded = 0
        total_quality = 0.0
        total_experiences = 0
        by_agent = {}

        for agent_type, (metrics, session) in results.items():
            total_tasks += metrics.tasks_executed
            total_succeeded += metrics.tasks_succeeded
            total_quality += metrics.avg_quality_score
            total_experiences += metrics.high_quality_experiences_stored

            by_agent[agent_type] = {
                'metrics': metrics.to_dict(),
                'session': session.to_dict()
            }

        num_agents = len(results)
        overall_success = total_succeeded / total_tasks if total_tasks > 0 else 0.0
        overall_quality = total_quality / num_agents if num_agents > 0 else 0.0

        return {
            'agents_trained': num_agents,
            'total_tasks_executed': total_tasks,
            'overall_success_rate': overall_success,
            'overall_avg_quality': overall_quality,
            'total_cost': self.spent_budget,
            'budget_remaining': self.total_ap2_budget - self.spent_budget,
            'total_experiences_stored': total_experiences,
            'training_duration': (datetime.now() - self.start_time).total_seconds(),
            'tasks_per_minute': total_tasks / ((datetime.now() - self.start_time).total_seconds() / 60) if (datetime.now() - self.start_time).total_seconds() > 0 else 0,
            'by_agent': by_agent
        }

    def get_orchestrator_status(self) -> Dict[str, Any]:
        """Get current orchestrator status and resource usage"""
        return {
            'trainers_registered': len(self.trainers),
            'total_sessions_run': len(self.sessions),
            'total_budget': self.total_ap2_budget,
            'spent_budget': round(self.spent_budget, 2),
            'remaining_budget': round(self.total_ap2_budget - self.spent_budget, 2),
            'uptime_seconds': (datetime.now() - self.start_time).total_seconds(),
            'trainer_types': list(self.trainers.keys())
        }
