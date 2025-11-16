"""
Comprehensive tests for INTEGRATION_PLAN.md sections 4-6:
- Section 4: Binary RAR Hallucination Control
- Section 5: Continuous Auditor Agent
- Section 6: Reasoning Codebooks
"""

import json
import os
import tempfile
from pathlib import Path
from unittest.mock import MagicMock, Mock, patch

import pytest

# Section 4: Binary RAR Hallucination Control
from infrastructure.dreamgym.bm25_retriever import BM25Retriever
from infrastructure.dreamgym.binary_rar import (
    BinaryRarRetriever,
    BinaryRarVerifier,
    VerificationResult,
)
from infrastructure.hallucination_monitor import HallucinationMonitor

# Section 5: Continuous Auditor Agent
from infrastructure.audit_llm import AuditLLMAgent, AuditOutcome, AuditRequirement

# Section 6: Reasoning Codebooks
from infrastructure.codebook_manager import CodebookEntry, CodebookManager


# ============================================================================
# Section 4: Binary RAR Hallucination Control Tests
# ============================================================================


class TestBM25Retriever:
    """Test BM25-based document retrieval."""

    def test_initialization(self):
        """Test BM25Retriever initializes correctly."""
        docs = ["customer email template", "billing invoice", "support ticket"]
        retriever = BM25Retriever(documents=docs)
        assert len(retriever.documents) == 3
        assert retriever.avgdl > 0

    def test_empty_documents(self):
        """Test BM25Retriever with empty documents."""
        retriever = BM25Retriever(documents=[])
        assert len(retriever.documents) == 0
        results = retriever.retrieve("test", top_k=3)
        assert results == []

    def test_retrieve_relevant_documents(self):
        """Test retrieving relevant documents."""
        docs = [
            "customer email template for support",
            "billing invoice system",
            "user authentication module",
        ]
        retriever = BM25Retriever(documents=docs)
        results = retriever.retrieve("customer email", top_k=2)
        assert len(results) > 0
        assert "customer email template for support" in results

    def test_retrieve_top_k(self):
        """Test top_k parameter limits results."""
        docs = ["doc1 test", "doc2 test", "doc3 test", "doc4 test"]
        retriever = BM25Retriever(documents=docs)
        results = retriever.retrieve("test", top_k=2)
        assert len(results) == 2

    def test_case_insensitive_retrieval(self):
        """Test case-insensitive retrieval."""
        docs = ["Customer Email Template"]
        retriever = BM25Retriever(documents=docs)
        results = retriever.retrieve("CUSTOMER", top_k=1)
        assert len(results) == 1


class TestBinaryRarRetriever:
    """Test simple keyword-based retrieval."""

    def test_initialization(self):
        """Test BinaryRarRetriever initializes correctly."""
        index = ["doc1", "doc2"]
        retriever = BinaryRarRetriever(index=index)
        assert retriever.index == index

    def test_default_empty_index(self):
        """Test default empty index."""
        retriever = BinaryRarRetriever()
        assert retriever.index == []
        assert retriever.retrieve("test") == []

    def test_retrieve_matching_documents(self):
        """Test retrieving documents with matching words."""
        index = ["customer email template", "billing invoice", "support ticket"]
        retriever = BinaryRarRetriever(index=index)
        results = retriever.retrieve("customer email")
        assert "customer email template" in results

    def test_word_intersection(self):
        """Test word-based intersection matching."""
        index = ["user authentication system", "billing module", "email service"]
        retriever = BinaryRarRetriever(index=index)
        results = retriever.retrieve("user login")
        assert "user authentication system" in results

    def test_no_matches(self):
        """Test when no documents match."""
        index = ["doc1", "doc2"]
        retriever = BinaryRarRetriever(index=index)
        results = retriever.retrieve("nonexistent")
        assert results == []


class TestBinaryRarVerifier:
    """Test verification using retrieval."""

    def test_initialization(self):
        """Test verifier initialization."""
        retriever = BinaryRarRetriever(index=["doc1"])
        verifier = BinaryRarVerifier(retriever, threshold=0.6)
        assert verifier.threshold == 0.6
        assert verifier.retriever == retriever

    def test_verification_passes(self):
        """Test successful verification."""
        retriever = BinaryRarRetriever(index=["customer email template"])
        verifier = BinaryRarVerifier(retriever, threshold=0.3)
        result = verifier.verify(
            "customer email", "Here is your customer email template"
        )
        assert result.passed
        assert result.score > 0
        assert len(result.evidence) > 0

    def test_verification_fails_no_retrieval(self):
        """Test verification fails with no retrieval results."""
        retriever = BinaryRarRetriever(index=[])
        verifier = BinaryRarVerifier(retriever, threshold=0.6)
        result = verifier.verify("test", "test candidate")
        assert not result.passed
        assert result.score == 0.0
        assert result.error == "no retrieval candidates"

    def test_verification_fails_below_threshold(self):
        """Test verification fails below threshold."""
        retriever = BinaryRarRetriever(index=["doc1", "doc2", "doc3"])
        verifier = BinaryRarVerifier(retriever, threshold=0.9)
        result = verifier.verify("something unrelated", "doc1 content")
        # No matching retrieval, so score should be 0
        assert not result.passed
        assert result.score < 0.9

    def test_evidence_collection(self):
        """Test evidence is collected correctly."""
        retriever = BinaryRarRetriever(index=["email template", "billing template"])
        verifier = BinaryRarVerifier(retriever, threshold=0.3)
        result = verifier.verify("template email", "email template and billing template content")
        assert len(result.evidence) > 0
        assert any("template" in ev for ev in result.evidence)


class TestHallucinationMonitor:
    """Test hallucination rate monitoring."""

    def test_initialization(self):
        """Test monitor initializes correctly."""
        with tempfile.TemporaryDirectory() as tmpdir:
            monitor = HallucinationMonitor(log_dir=Path(tmpdir))
            assert monitor.stats["checked"] == 0
            assert monitor.stats["failed"] == 0

    def test_record_passing(self):
        """Test recording passing verifications."""
        with tempfile.TemporaryDirectory() as tmpdir:
            monitor = HallucinationMonitor(log_dir=Path(tmpdir))
            monitor.record(True)
            monitor.record(True)
            assert monitor.stats["checked"] == 2
            assert monitor.stats["failed"] == 0
            assert monitor.rate() == 0.0

    def test_record_failing(self):
        """Test recording failing verifications."""
        with tempfile.TemporaryDirectory() as tmpdir:
            monitor = HallucinationMonitor(log_dir=Path(tmpdir))
            monitor.record(False)
            monitor.record(False)
            assert monitor.stats["checked"] == 2
            assert monitor.stats["failed"] == 2
            assert monitor.rate() == 1.0

    def test_mixed_results(self):
        """Test mixed passing and failing results."""
        with tempfile.TemporaryDirectory() as tmpdir:
            monitor = HallucinationMonitor(log_dir=Path(tmpdir))
            monitor.record(True)
            monitor.record(False)
            monitor.record(True)
            assert monitor.stats["checked"] == 3
            assert monitor.stats["failed"] == 1
            assert abs(monitor.rate() - 0.333) < 0.01

    def test_metrics_file_written(self):
        """Test metrics are written to JSON file."""
        with tempfile.TemporaryDirectory() as tmpdir:
            monitor = HallucinationMonitor(log_dir=Path(tmpdir))
            monitor.record(True)
            monitor.record(False)
            metrics_file = Path(tmpdir) / "metrics.json"
            assert metrics_file.exists()
            with open(metrics_file) as f:
                data = json.load(f)
                assert data["checked"] == 2
                assert data["failed"] == 1
                assert "hallucination_rate" in data


# ============================================================================
# Section 5: Continuous Auditor Agent Tests
# ============================================================================


class TestAuditRequirement:
    """Test audit requirement data structure."""

    def test_creation(self):
        """Test creating audit requirement."""
        req = AuditRequirement(
            name="Test Requirement",
            keywords=["test", "verify"],
            min_count=2,
            description="Test description",
        )
        assert req.name == "Test Requirement"
        assert req.keywords == ["test", "verify"]
        assert req.min_count == 2


class TestAuditLLMAgent:
    """Test continuous auditor agent."""

    def test_initialization(self):
        """Test agent initialization."""
        with tempfile.TemporaryDirectory() as tmpdir:
            log_path = Path(tmpdir) / "test.log"
            agent = AuditLLMAgent(log_path=log_path)
            assert agent.log_path == log_path
            assert len(agent.requirements) > 0

    def test_load_recent_logs(self):
        """Test loading recent log lines."""
        with tempfile.TemporaryDirectory() as tmpdir:
            log_path = Path(tmpdir) / "test.log"
            with open(log_path, "w") as f:
                f.write("Line 1\n")
                f.write("Line 2\n")
                f.write("Line 3\n")
            agent = AuditLLMAgent(log_path=log_path, stream_recent=10)
            lines = agent.load_recent()
            # Filter out empty strings
            non_empty_lines = [line for line in lines if line.strip()]
            assert len(non_empty_lines) == 3
            assert "Line 1" in lines

    def test_evaluate_requirements(self):
        """Test evaluating audit requirements."""
        with tempfile.TemporaryDirectory() as tmpdir:
            log_path = Path(tmpdir) / "test.log"
            with open(log_path, "w") as f:
                f.write("QA TEST passed\n")
                f.write("Support ticket logged\n")
                f.write("Compliance check done\n")
            agent = AuditLLMAgent(log_path=log_path)
            outcomes = agent.evaluate()
            assert len(outcomes) > 0
            # Check that QA test requirement is satisfied
            qa_outcome = next(o for o in outcomes if "QA" in o.requirement)
            assert qa_outcome.satisfied

    def test_requirement_not_satisfied(self):
        """Test when requirement is not met."""
        with tempfile.TemporaryDirectory() as tmpdir:
            log_path = Path(tmpdir) / "test.log"
            with open(log_path, "w") as f:
                f.write("Some unrelated log\n")
            agent = AuditLLMAgent(log_path=log_path)
            outcomes = agent.evaluate()
            # Most requirements should be unsatisfied
            unsatisfied = [o for o in outcomes if not o.satisfied]
            assert len(unsatisfied) > 0

    def test_policy_loading(self):
        """Test loading policies from file."""
        with tempfile.TemporaryDirectory() as tmpdir:
            policy_path = Path(tmpdir) / "policies.json"
            policies = [
                {
                    "agent": "TestAgent",
                    "keywords": ["test"],
                    "description": "Test policy",
                }
            ]
            with open(policy_path, "w") as f:
                json.dump(policies, f)
            agent = AuditLLMAgent(policy_path=policy_path)
            assert len(agent.policy_definitions) == 1

    def test_policy_score(self):
        """Test policy scoring."""
        with tempfile.TemporaryDirectory() as tmpdir:
            log_path = Path(tmpdir) / "test.log"
            policy_path = Path(tmpdir) / "policies.json"
            with open(log_path, "w") as f:
                f.write("pytest test executed\n")
            policies = [
                {"agent": "QA Agent", "keywords": ["pytest"], "description": "QA test"}
            ]
            with open(policy_path, "w") as f:
                json.dump(policies, f)
            agent = AuditLLMAgent(log_path=log_path, policy_path=policy_path)
            outcomes = agent.policy_score()
            assert len(outcomes) == 1
            assert outcomes[0].satisfied

    @pytest.mark.asyncio
    async def test_async_audit(self):
        """Test async audit method."""
        with tempfile.TemporaryDirectory() as tmpdir:
            log_path = Path(tmpdir) / "test.log"
            with open(log_path, "w") as f:
                f.write("QA TEST\n")
            agent = AuditLLMAgent(log_path=log_path)
            outcomes = await agent.audit_async()
            assert len(outcomes) > 0


# ============================================================================
# Section 6: Reasoning Codebooks Tests
# ============================================================================


class TestCodebookManager:
    """Test codebook management."""

    @patch("infrastructure.codebook_manager.MemoriClient")
    def test_initialization(self, mock_client):
        """Test codebook manager initialization."""
        manager = CodebookManager(namespace="test")
        assert manager.namespace == "test"

    @patch("infrastructure.codebook_manager.MemoriClient")
    def test_make_key(self, mock_client):
        """Test key generation."""
        manager = CodebookManager()
        key = manager._make_key("agent1", "snippet content")
        assert key.startswith("codebook::agent1::")
        assert len(key) > 30  # Has hash

    @patch("infrastructure.codebook_manager.MemoriClient")
    def test_store_snippet(self, mock_client):
        """Test storing reasoning snippet."""
        mock_record = Mock()
        mock_record.created_at.isoformat.return_value = "2025-11-14T00:00:00Z"
        mock_client_instance = mock_client.return_value
        mock_client_instance.upsert_memory.return_value = mock_record

        manager = CodebookManager()
        entry = manager.store_snippet("agent1", "test snippet", tags=["tag1"])

        assert entry.agent_id == "agent1"
        assert entry.snippet == "test snippet"
        assert entry.tags == ["tag1"]
        assert mock_client_instance.upsert_memory.called

    @patch("infrastructure.codebook_manager.MemoriClient")
    def test_store_snippet_no_tags(self, mock_client):
        """Test storing snippet without tags."""
        mock_record = Mock()
        mock_record.created_at.isoformat.return_value = "2025-11-14T00:00:00Z"
        mock_client_instance = mock_client.return_value
        mock_client_instance.upsert_memory.return_value = mock_record

        manager = CodebookManager()
        entry = manager.store_snippet("agent1", "test snippet")

        assert entry.tags == []

    @patch("infrastructure.codebook_manager.MemoriClient")
    def test_retrieve_snippets(self, mock_client):
        """Test retrieving snippets."""
        mock_record = Mock()
        mock_record.key = "test_key"
        mock_record.value = {"snippet": "test snippet", "tags": ["tag1"]}
        mock_record.created_at.isoformat.return_value = "2025-11-14T00:00:00Z"

        mock_client_instance = mock_client.return_value
        mock_client_instance.list_memory.return_value = [mock_record]

        manager = CodebookManager()
        snippets = manager.retrieve_snippets("agent1")

        assert len(snippets) == 1
        assert snippets[0].snippet == "test snippet"
        assert snippets[0].tags == ["tag1"]

    @patch("infrastructure.codebook_manager.MemoriClient")
    def test_retrieve_with_tag_filter(self, mock_client):
        """Test retrieving snippets with tag filtering."""
        mock_record1 = Mock()
        mock_record1.key = "key1"
        mock_record1.value = {"snippet": "snippet1", "tags": ["tag1"]}
        mock_record1.created_at.isoformat.return_value = "2025-11-14T00:00:00Z"

        mock_record2 = Mock()
        mock_record2.key = "key2"
        mock_record2.value = {"snippet": "snippet2", "tags": ["tag2"]}
        mock_record2.created_at.isoformat.return_value = "2025-11-14T00:00:00Z"

        mock_client_instance = mock_client.return_value
        mock_client_instance.list_memory.return_value = [mock_record1, mock_record2]

        manager = CodebookManager()
        snippets = manager.retrieve_snippets("agent1", tags=["tag1"])

        assert len(snippets) == 1
        assert snippets[0].snippet == "snippet1"

    @patch("infrastructure.codebook_manager.MemoriClient")
    def test_retrieve_limit(self, mock_client):
        """Test limit parameter."""
        mock_records = []
        for i in range(5):
            mock_record = Mock()
            mock_record.key = f"key{i}"
            mock_record.value = {"snippet": f"snippet{i}", "tags": []}
            mock_record.created_at.isoformat.return_value = "2025-11-14T00:00:00Z"
            mock_records.append(mock_record)

        mock_client_instance = mock_client.return_value
        mock_client_instance.list_memory.return_value = mock_records

        manager = CodebookManager()
        snippets = manager.retrieve_snippets("agent1", limit=3)

        assert len(snippets) == 3


# ============================================================================
# Integration Tests
# ============================================================================


class TestDreamGymIntegration:
    """Test DreamGym integration with Binary RAR."""

    @patch("infrastructure.codebook_manager.MemoriClient")
    def test_bm25_toggle(self, mock_client):
        """Test BM25 vs BinaryRar retriever toggle."""
        from infrastructure.dreamgym.integration import DreamGymTrainer

        # Test BM25 mode
        os.environ["BINARY_RAR_USE_BM25"] = "true"
        os.environ["BINARY_RAR_DOCS"] = "doc1|doc2"
        trainer = DreamGymTrainer("test_agent")
        assert type(trainer.binary_rar.retriever).__name__ == "BM25Retriever"

        # Test non-BM25 mode
        os.environ["BINARY_RAR_USE_BM25"] = "false"
        trainer2 = DreamGymTrainer("test_agent2")
        assert type(trainer2.binary_rar.retriever).__name__ == "BinaryRarRetriever"


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
