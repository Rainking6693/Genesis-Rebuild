"""
Integration Tests for Curiosity-Driven Trainer (Phase 1)

Tests the self-questioning training loop with:
1. TrainingSession metadata and quality tracking
2. CuriosityDrivenTrainer task execution with novelty weighting
3. TrainingOrchestrator multi-agent orchestration
4. AP2 budget enforcement and early stopping
5. Experience storage for high-quality results

Author: Nova (Vertex AI Agent Specialist)
Date: November 15, 2025
"""

import asyncio
import pytest
import json
from datetime import datetime
from unittest.mock import AsyncMock, MagicMock, patch

from infrastructure.agentevolver.curiosity_trainer import (
    TrainingSession,
    TrainingMetrics,
    CuriosityDrivenTrainer,
    TrainingOrchestrator,
    TaskStatus
)


# ==================== TRAINING SESSION TESTS ====================

class TestTrainingSession:
    """Test TrainingSession dataclass with metadata tracking"""

    def test_training_session_initialization(self):
        """TrainingSession initializes with correct metadata"""
        session = TrainingSession(
            session_id="TRAIN-001",
            agent_type="marketing",
            start_time=datetime.now()
        )

        assert session.session_id == "TRAIN-001"
        assert session.agent_type == "marketing"
        assert session.status == "in_progress"
        assert session.tasks_completed == 0
        assert session.experiences_stored == 0

    def test_training_session_quality_tracking(self):
        """TrainingSession tracks quality scores and computes success rate"""
        session = TrainingSession(
            session_id="TRAIN-002",
            agent_type="content",
            start_time=datetime.now()
        )

        # Add quality scores (75+ = high quality)
        session.add_quality_score(80.0)
        session.add_quality_score(72.0)
        session.add_quality_score(85.0)

        assert len(session.quality_scores) == 3
        assert session.success_rate == pytest.approx(2.0 / 3.0)  # 2 out of 3 >= 75
        assert session.improvement_delta == pytest.approx((80+72+85)/3 - 50.0)

    def test_training_session_completion(self):
        """TrainingSession marks complete with end_time"""
        session = TrainingSession(
            session_id="TRAIN-003",
            agent_type="seo",
            start_time=datetime.now()
        )

        session.mark_complete()

        assert session.status == "completed"
        assert session.end_time is not None
        assert session.duration_seconds >= 0

    def test_training_session_serialization(self):
        """TrainingSession converts to dict for storage/logging"""
        session = TrainingSession(
            session_id="TRAIN-004",
            agent_type="deploy",
            start_time=datetime.now(),
            tasks_completed=5,
            experiences_stored=2
        )
        session.add_quality_score(85.0)
        session.mark_complete()

        session_dict = session.to_dict()

        assert session_dict["session_id"] == "TRAIN-004"
        assert session_dict["agent_type"] == "deploy"
        assert session_dict["status"] == "completed"
        assert session_dict["tasks_completed"] == 5
        assert session_dict["experiences_stored"] == 2


# ==================== CURIOSITY DRIVEN TRAINER TESTS ====================

class TestCuriosityDrivenTrainer:
    """Test single-agent trainer with novelty weighting"""

    @pytest.fixture
    def mock_agent_executor(self):
        """Mock async agent executor"""
        async def executor(task_description):
            return {
                "result": "test_output",
                "quality": 85.0,
                "confidence": 0.95
            }
        return executor

    @pytest.fixture
    def mock_experience_buffer(self):
        """Mock experience buffer"""
        buffer = MagicMock()
        buffer.store_experience = AsyncMock()
        return buffer

    @pytest.fixture
    def trainer(self, mock_agent_executor, mock_experience_buffer):
        """Create trainer instance"""
        return CuriosityDrivenTrainer(
            agent_type="marketing",
            agent_executor=mock_agent_executor,
            experience_buffer=mock_experience_buffer,
            quality_threshold=75.0,
            early_stop_patience=3
        )

    def test_trainer_initialization(self, trainer):
        """CuriosityDrivenTrainer initializes with correct settings"""
        assert trainer.agent_type == "marketing"
        assert trainer.quality_threshold == 75.0
        assert trainer.early_stop_patience == 3
        assert trainer.session_count == 0
        assert trainer.best_quality_seen == 0.0

    @pytest.mark.asyncio
    async def test_training_epoch_without_engine(self, trainer):
        """train_epoch executes without SelfQuestioningEngine (empty task list)"""
        metrics, session = await trainer.train_epoch(
            num_tasks=5,
            agent_type="marketing",
            ap2_budget_remaining=50.0,
            cost_per_task=0.5,
            self_questioning_engine=None
        )

        assert metrics.session_id == session.session_id
        assert metrics.agent_type == "marketing"
        assert metrics.tasks_executed == 0  # No engine, no tasks

    @pytest.mark.asyncio
    async def test_budget_enforcement(self, trainer):
        """train_epoch respects AP2 budget limits"""
        # Create mock tasks
        mock_tasks = []
        for i in range(10):
            task = MagicMock()
            task.task_id = f"TASK-{i}"
            task.description = f"Test task {i}"
            task.novelty_score = 50.0 + i * 5
            task.feasibility_score = 75.0
            task.expected_quality_metric = "quality_score"
            mock_tasks.append(task)

        # Mock engine
        mock_engine = AsyncMock()
        mock_engine.generate_tasks = AsyncMock(return_value=mock_tasks)

        # Limited budget: 25 tasks * 0.5 cost each = $12.50 max
        metrics, session = await trainer.train_epoch(
            num_tasks=25,
            agent_type="marketing",
            ap2_budget_remaining=6.0,  # Can only afford 12 tasks
            cost_per_task=0.5,
            self_questioning_engine=mock_engine
        )

        # Should stop when budget exceeded
        assert metrics.total_cost_incurred <= 6.0
        # Number of executed tasks should not exceed budget
        expected_max = int(6.0 / 0.5)
        assert metrics.tasks_executed <= expected_max + 1

    @pytest.mark.asyncio
    async def test_quality_threshold_enforcement(self, mock_experience_buffer):
        """train_epoch stores only high-quality experiences based on threshold"""
        # Create tasks with varying quality
        mock_tasks = []
        for i in range(3):
            task = MagicMock()
            task.task_id = f"TASK-{i}"
            task.description = f"Test task {i}"
            task.novelty_score = 50.0
            task.feasibility_score = 75.0
            task.expected_quality_metric = "quality_score"
            mock_tasks.append(task)

        # Mock engine
        mock_engine = AsyncMock()
        mock_engine.generate_tasks = AsyncMock(return_value=mock_tasks)

        # Create executor with outputs that will pass different thresholds
        call_count = [0]

        async def controlled_executor(desc):
            # Return full marketing output to get higher quality scores
            if call_count[0] == 0:
                # Should score high (all required fields)
                call_count[0] += 1
                return {
                    "channels": ["email", "social", "ads"],
                    "budget": 5000,
                    "timeline": "30 days",
                    "metrics": ["engagement"],
                    "quality_score": "high"
                }
            elif call_count[0] == 1:
                # Should score low (missing fields)
                call_count[0] += 1
                return {"result": "minimal output"}
            else:
                # Should score medium
                call_count[0] += 1
                return {
                    "channels": ["email", "social"],
                    "budget": 3000,
                    "quality_score": "medium"
                }

        trainer = CuriosityDrivenTrainer(
            agent_type="marketing",
            agent_executor=controlled_executor,
            experience_buffer=mock_experience_buffer,
            quality_threshold=50.0  # Lower threshold to test storage logic
        )

        metrics, session = await trainer.train_epoch(
            num_tasks=3,
            agent_type="marketing",
            ap2_budget_remaining=50.0,
            cost_per_task=0.5,
            self_questioning_engine=mock_engine
        )

        # Should have executed all 3 tasks
        assert metrics.tasks_executed == 3
        # Should have stored at least 1 high-quality experience (first one)
        assert metrics.high_quality_experiences_stored >= 1
        assert mock_experience_buffer.store_experience.call_count >= 1

    def test_output_quality_evaluation_marketing(self, trainer):
        """Evaluator scores marketing output correctly"""
        output = {
            "channels": ["email", "social", "ads"],
            "budget": 5000,
            "timeline": "30 days",
            "metrics": ["engagement", "conversions"]
        }

        task = MagicMock()
        task.expected_quality_metric = "quality_score"

        score = trainer._evaluate_output_quality(output, task)

        # Should award bonuses for all required keys + channels bonus
        assert score >= 90.0  # 50 base + 50 bonus

    def test_output_quality_evaluation_seo(self):
        """Evaluator scores SEO output correctly"""
        trainer = CuriosityDrivenTrainer(
            agent_type="seo",
            agent_executor=AsyncMock(),
            quality_threshold=75.0
        )

        output = {
            "keywords": ["python", "async", "training", "ml", "agents"],
            "recommendations": ["improve site speed", "add meta tags"],
            "seo_score_before": 45,
            "seo_score_after": 60
        }

        task = MagicMock()
        task.expected_quality_metric = "seo_score"

        score = trainer._evaluate_output_quality(output, task)

        # Should award bonuses for keywords, recommendations, and improvement
        assert score >= 90.0

    def test_session_history(self, trainer):
        """get_session_history returns correct metadata"""
        history = trainer.get_session_history()

        assert history["agent_type"] == "marketing"
        assert history["total_sessions"] == 0
        assert history["quality_threshold"] == 75.0
        assert history["buffer_enabled"] is True


# ==================== TRAINING ORCHESTRATOR TESTS ====================

class TestTrainingOrchestrator:
    """Test multi-agent orchestration with budget management"""

    @pytest.fixture
    def orchestrator(self):
        """Create orchestrator instance"""
        return TrainingOrchestrator(
            max_concurrent_sessions=4,
            total_ap2_budget=200.0,
            max_budget_per_session=50.0,
            cost_per_task=0.5
        )

    def test_orchestrator_initialization(self, orchestrator):
        """TrainingOrchestrator initializes with correct budget"""
        assert orchestrator.total_ap2_budget == 200.0
        assert orchestrator.max_budget_per_session == 50.0
        assert orchestrator.spent_budget == 0.0
        assert len(orchestrator.trainers) == 0

    def test_trainer_registration(self, orchestrator):
        """Orchestrator registers trainers for different agent types"""
        trainer_marketing = CuriosityDrivenTrainer(
            agent_type="marketing",
            agent_executor=AsyncMock()
        )
        trainer_seo = CuriosityDrivenTrainer(
            agent_type="seo",
            agent_executor=AsyncMock()
        )

        orchestrator.register_trainer("marketing", trainer_marketing)
        orchestrator.register_trainer("seo", trainer_seo)

        assert len(orchestrator.trainers) == 2
        assert "marketing" in orchestrator.trainers
        assert "seo" in orchestrator.trainers

    @pytest.mark.asyncio
    async def test_training_round_aggregation(self, orchestrator):
        """Orchestrator aggregates metrics across agents"""
        # Register trainers
        trainer_marketing = CuriosityDrivenTrainer(
            agent_type="marketing",
            agent_executor=AsyncMock()
        )
        trainer_content = CuriosityDrivenTrainer(
            agent_type="content",
            agent_executor=AsyncMock()
        )

        orchestrator.register_trainer("marketing", trainer_marketing)
        orchestrator.register_trainer("content", trainer_content)

        # Update spent budget to reflect aggregation test
        orchestrator.spent_budget = 25.0

        # Mock train_epoch results
        metrics_marketing = TrainingMetrics(
            session_id="TRAIN-M-001",
            agent_type="marketing",
            tasks_executed=25,
            tasks_succeeded=20,
            success_rate=0.8,
            avg_quality_score=82.0,
            total_cost_incurred=12.5,
            cost_per_task=0.625,
            improvement_delta=32.0,
            high_quality_experiences_stored=15,
            timestamp=datetime.now().isoformat()
        )

        metrics_content = TrainingMetrics(
            session_id="TRAIN-C-001",
            agent_type="content",
            tasks_executed=25,
            tasks_succeeded=22,
            success_rate=0.88,
            avg_quality_score=80.0,
            total_cost_incurred=12.5,
            cost_per_task=0.568,
            improvement_delta=30.0,
            high_quality_experiences_stored=17,
            timestamp=datetime.now().isoformat()
        )

        session_marketing = TrainingSession(
            session_id="TRAIN-M-001",
            agent_type="marketing",
            start_time=datetime.now()
        )
        session_content = TrainingSession(
            session_id="TRAIN-C-001",
            agent_type="content",
            start_time=datetime.now()
        )

        results = {
            "marketing": (metrics_marketing, session_marketing),
            "content": (metrics_content, session_content)
        }

        aggregated = orchestrator._aggregate_metrics(results)

        assert aggregated["agents_trained"] == 2
        assert aggregated["total_tasks_executed"] == 50
        assert aggregated["total_cost"] == 25.0
        assert aggregated["total_experiences_stored"] == 32
        assert aggregated["overall_avg_quality"] == pytest.approx(81.0)

    def test_orchestrator_status(self, orchestrator):
        """Orchestrator returns current status and resources"""
        trainer = CuriosityDrivenTrainer(
            agent_type="marketing",
            agent_executor=AsyncMock()
        )
        orchestrator.register_trainer("marketing", trainer)

        status = orchestrator.get_orchestrator_status()

        assert status["trainers_registered"] == 1
        assert status["total_budget"] == 200.0
        assert status["spent_budget"] == 0.0
        assert status["remaining_budget"] == 200.0
        assert "marketing" in status["trainer_types"]


# ==================== TRAINING METRICS TESTS ====================

class TestTrainingMetrics:
    """Test metrics dataclass and reporting"""

    def test_metrics_initialization(self):
        """TrainingMetrics initializes with all required fields"""
        metrics = TrainingMetrics(
            session_id="TRAIN-001",
            agent_type="marketing",
            tasks_executed=25,
            tasks_succeeded=20,
            success_rate=0.8,
            avg_quality_score=82.5,
            total_cost_incurred=12.5,
            cost_per_task=0.625,
            improvement_delta=32.5,
            high_quality_experiences_stored=15,
            timestamp=datetime.now().isoformat(),
            duration_seconds=120.0,
            novelty_weighted_score=65.0
        )

        assert metrics.session_id == "TRAIN-001"
        assert metrics.success_rate == 0.8
        assert metrics.avg_quality_score == 82.5
        assert metrics.novelty_weighted_score == 65.0

    def test_metrics_string_representation(self):
        """TrainingMetrics provides readable string representation"""
        metrics = TrainingMetrics(
            session_id="TRAIN-001",
            agent_type="seo",
            tasks_executed=10,
            tasks_succeeded=9,
            success_rate=0.9,
            avg_quality_score=85.0,
            total_cost_incurred=5.0,
            cost_per_task=0.556,
            improvement_delta=35.0,
            high_quality_experiences_stored=8,
            timestamp=datetime.now().isoformat(),
            duration_seconds=60.0
        )

        str_repr = str(metrics)

        assert "TRAIN-001" in str_repr
        assert "seo" in str_repr
        assert "executed=10" in str_repr
        assert "success_rate=90.00%" in str_repr


# ==================== TASK STATUS TESTS ====================

class TestTaskStatus:
    """Test task status enum"""

    def test_task_status_enum_values(self):
        """TaskStatus enum has expected values"""
        assert TaskStatus.PENDING.value == "pending"
        assert TaskStatus.EXECUTING.value == "executing"
        assert TaskStatus.COMPLETED.value == "completed"
        assert TaskStatus.FAILED.value == "failed"
        assert TaskStatus.SKIPPED.value == "skipped"


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
