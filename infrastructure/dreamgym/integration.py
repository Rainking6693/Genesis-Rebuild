from __future__ import annotations

import os
from typing import Any, Dict, List, Optional, TYPE_CHECKING

from infrastructure.codebook_manager import CodebookManager
from infrastructure.hallucination_monitor import HallucinationMonitor
from infrastructure.dreamgym.binary_rar import BinaryRarRetriever, BinaryRarVerifier
from infrastructure.dreamgym.bm25_retriever import BM25Retriever
from infrastructure.dreamgym.curriculum import DreamGymCurriculumGenerator
from infrastructure.dreamgym.experience_model import DreamGymExperience, DreamGymExperienceModel
from infrastructure.dreamgym.hybrid_buffer import HybridReplayBuffer

if TYPE_CHECKING:
    from infrastructure.trajectory_pool import Trajectory


class DreamGymTrainer:
    """
    Coordinates DreamGym components for SE-Darwin evolution.
    """

    def __init__(self, agent_name: str) -> None:
        self.agent_name = agent_name
        self.model = DreamGymExperienceModel()
        self.curriculum = DreamGymCurriculumGenerator()
        self.buffer = HybridReplayBuffer()
        doc_lines = os.getenv("BINARY_RAR_DOCS", "")
        index = [line.strip() for line in doc_lines.split("|") if line.strip()]
        use_bm25 = os.getenv("BINARY_RAR_USE_BM25", "true").lower() == "true"
        retriever_cls = BM25Retriever if use_bm25 else BinaryRarRetriever
        self.binary_rar = BinaryRarVerifier(retriever_cls(index=index))
        self.codebook = CodebookManager()
        self.hallucination_monitor = HallucinationMonitor()

    def record_real_trajectory(self, trajectory: "Trajectory") -> None:
        experience = self._real_to_experience(trajectory)
        self.buffer.add(experience, source="real")
        self.curriculum.record_outcome(
            experience.task_signature,
            experience.reward,
            experience.novelty_score,
        )

    def _real_to_experience(self, trajectory: "Trajectory") -> DreamGymExperience:
        task_signature = trajectory.operator_applied or "baseline"
        verification = self.binary_rar.verify(
            prompt=trajectory.problem_diagnosis or "",
            candidate=trajectory.agent_response or "",
        )
        self.hallucination_monitor.record(verification.passed)

        reward = 0.0 if not verification.passed else max(0.0, min(1.0, trajectory.success_score))
        metadata = {
            "generation": trajectory.generation,
            "agent": trajectory.agent_name,
            "status": trajectory.status,
            "rar_passed": verification.passed,
            "rar_score": round(verification.score, 3),
            "rar_evidence": verification.evidence,
        }
        novelty = 0.6 if trajectory.reasoning_pattern else 0.7
        metadata = {
            "generation": trajectory.generation,
            "agent": trajectory.agent_name,
            "status": trajectory.status,
            "rar_passed": verification.passed,
            "rar_score": round(verification.score, 3),
            "rar_evidence": verification.evidence,
        }
        if trajectory.agent_response:
            self.codebook.store_snippet(
                agent_id=trajectory.agent_name,
                snippet=trajectory.agent_response,
                tags=[trajectory.operator_applied or "baseline"],
            )
        return DreamGymExperience(
            task_signature=task_signature,
            difficulty="real",
            synthetic=False,
            observation=trajectory.problem_diagnosis or "N/A",
            action=trajectory.code_changes or "",
            reward=reward,
            novelty_score=novelty,
            generated_at=trajectory.created_at,
            metadata=metadata,
        )

    def generate_synthetic_batch(self, task_signature: str, batch_size: int = 16) -> List[Dict[str, Any]]:
        stage = self.curriculum.next_stage(task_signature)
        experiences: List[Dict[str, Any]] = []
        for _ in range(batch_size):
            exp = self.model.generate_episode(task_signature, stage)
            self.buffer.add(exp, "synthetic")
            self.curriculum.record_outcome(task_signature, exp.reward, exp.novelty_score)
            experiences.append(exp.to_dict())
        return experiences

    def prepare_evolution_batch(
        self,
        task_signature: str,
        batch_size: int = 32,
        synthetic_ratio: float = 0.5,
    ) -> List[Dict[str, Any]]:
        samples = self.buffer.sample(batch_size, synthetic_ratio)
        deficit = batch_size - len(samples)
        if deficit > 0:
            samples.extend(self.generate_synthetic_batch(task_signature, deficit))

        enriched = []
        snippets = self.codebook.retrieve_snippets(task_signature, limit=2)
        for sample in samples:
            item = sample if isinstance(sample, dict) else sample.to_dict()
            item["codebook_snippets"] = [s.snippet for s in snippets]
            enriched.append(item)
        return enriched

    def stats(self) -> Dict[str, Any]:
        buffer_stats = self.buffer.stats()
        return {
            "agent": self.agent_name,
            "buffer_real": buffer_stats["real"],
            "buffer_synthetic": buffer_stats["synthetic"],
        }
