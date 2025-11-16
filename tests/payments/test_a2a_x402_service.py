"""Unit tests for A2A-x402 payment service and related components."""
import json
import os
from pathlib import Path
from unittest.mock import MagicMock, patch

import pytest

from infrastructure.payments.a2a_x402_service import A2AX402Service, A2APaymentResponse
from infrastructure.payments.budget_tracker import BudgetTracker
from infrastructure.payments.payment_ledger import PaymentLedger, PaymentRecord
from infrastructure.payments.retry_handler import RetryHandler


# ============================================================================
# A2AX402Service Tests
# ============================================================================

class TestA2AX402Service:
    """Tests for A2AX402Service payment client."""

    def test_initialization(self):
        """Test A2AX402Service initialization with defaults."""
        service = A2AX402Service(
            base_url="https://test.example.com",
            api_key="test_key",
            wallet_address="0xtest"
        )
        assert service.base_url == "https://test.example.com"
        assert service.api_key == "test_key"
        assert service.wallet_address == "0xtest"

    def test_initialization_from_env(self):
        """Test initialization with environment variables."""
        with patch.dict(os.environ, {
            "X402_FACILITATOR_URL": "https://env.example.com",
            "A2A_API_KEY": "env_key",
            "X402_WALLET_ADDRESS": "0xenv"
        }):
            service = A2AX402Service()
            assert service.base_url == "https://env.example.com"
            assert service.api_key == "env_key"
            assert service.wallet_address == "0xenv"

    def test_build_payload(self):
        """Test payment payload construction."""
        service = A2AX402Service(wallet_address="0xtest")
        payload = service._build_payload(1.5, "USDC", "openai", {"trace_id": "123"})

        assert payload["amount_usdc"] == 1.5
        assert payload["token"] == "USDC"
        assert payload["vendor"] == "openai"
        assert payload["wallet"] == "0xtest"
        assert payload["metadata"]["trace_id"] == "123"

    def test_successful_payment_flow(self):
        """Test successful payment completion."""
        with patch("infrastructure.payments.a2a_x402_service.httpx.Client") as mock_client:
            mock_response = MagicMock()
            mock_response.status_code = 200
            mock_response.json.return_value = {
                "transaction_id": "tx_123",
                "amount_usdc": 1.5,
                "token": "USDC",
                "vendor": "openai",
                "status": "completed",
                "blockchain_tx_hash": "0xblockhash",
                "message": "Payment completed"
            }
            mock_client.return_value.post.return_value = mock_response

            service = A2AX402Service(wallet_address="0xtest")
            service.client = mock_client.return_value

            result = service.pay_for_service(1.5, "USDC", "openai", {"trace_id": "123"})

            assert isinstance(result, A2APaymentResponse)
            assert result.transaction_id == "tx_123"
            assert result.amount == 1.5
            assert result.status == "completed"
            assert result.blockchain_tx_hash == "0xblockhash"

    def test_payment_required_handling(self):
        """Test handling of payment-required responses."""
        with patch("infrastructure.payments.a2a_x402_service.httpx.Client") as mock_client:
            mock_response = MagicMock()
            mock_response.status_code = 402
            mock_response.json.return_value = {
                "error": "Payment required",
                "amount_required": 1.5
            }
            mock_response.raise_for_status.side_effect = Exception("402 Payment Required")
            mock_client.return_value.post.return_value = mock_response

            service = A2AX402Service(wallet_address="0xtest")
            service.client = mock_client.return_value

            with pytest.raises(Exception):
                service.pay_for_service(1.5, "USDC", "openai")

    def test_health_check_success(self):
        """Test health check when service is available."""
        with patch("infrastructure.payments.a2a_x402_service.httpx.Client") as mock_client:
            mock_response = MagicMock()
            mock_response.status_code = 200
            mock_client.return_value.get.return_value = mock_response

            service = A2AX402Service()
            service.client = mock_client.return_value

            assert service.health_check() is True

    def test_health_check_failure(self):
        """Test health check when service is down."""
        import httpx
        with patch("infrastructure.payments.a2a_x402_service.httpx.Client") as mock_client:
            mock_client.return_value.get.side_effect = httpx.HTTPError("Connection failed")

            service = A2AX402Service()
            service.client = mock_client.return_value

            assert service.health_check() is False


# ============================================================================
# PaymentLedger Tests
# ============================================================================

class TestPaymentLedger:
    """Tests for PaymentLedger transaction logging."""

    @pytest.fixture
    def ledger(self, tmp_path):
        """Create temporary ledger for tests."""
        ledger = PaymentLedger(root=tmp_path)
        yield ledger

    def test_transaction_logging(self, ledger):
        """Test logging transactions to ledger."""
        record = PaymentRecord(
            transaction_id="tx_1",
            timestamp="2024-01-15T10:00:00Z",
            agent_id="builder_agent",
            service_url="https://api.openai.com",
            price_usdc=1.5,
            status="completed",
            blockchain_tx_hash="0xhash1",
            facilitator_receipt={"receipt": "data"},
            vendor="openai"
        )

        ledger.log_transaction(record)

        transactions = list(ledger.read_transactions())
        assert len(transactions) == 1
        assert transactions[0]["transaction_id"] == "tx_1"
        assert transactions[0]["price_usdc"] == 1.5

    def test_transaction_retrieval(self, ledger):
        """Test retrieving specific transaction."""
        record1 = PaymentRecord(
            transaction_id="tx_1",
            timestamp="2024-01-15T10:00:00Z",
            agent_id="builder_agent",
            service_url="https://api.openai.com",
            price_usdc=1.5,
            status="completed",
            blockchain_tx_hash="0xhash1",
            facilitator_receipt={},
            vendor="openai"
        )
        record2 = PaymentRecord(
            transaction_id="tx_2",
            timestamp="2024-01-15T10:05:00Z",
            agent_id="research_agent",
            service_url="https://api.research.com",
            price_usdc=2.0,
            status="completed",
            blockchain_tx_hash="0xhash2",
            facilitator_receipt={},
            vendor="research"
        )

        ledger.log_transaction(record1)
        ledger.log_transaction(record2)

        tx = ledger.get_transaction("tx_2")
        assert tx is not None
        assert tx["transaction_id"] == "tx_2"
        assert tx["agent_id"] == "research_agent"

    def test_agent_transaction_retrieval(self, ledger):
        """Test retrieving all transactions for an agent."""
        for i in range(3):
            record = PaymentRecord(
                transaction_id=f"tx_{i}",
                timestamp="2024-01-15T10:00:00Z",
                agent_id="builder_agent",
                service_url="https://api.openai.com",
                price_usdc=float(i + 1),
                status="completed",
                blockchain_tx_hash=f"0xhash{i}",
                facilitator_receipt={},
                vendor="openai"
            )
            ledger.log_transaction(record)

        transactions = ledger.get_agent_transactions("builder_agent")
        assert len(transactions) == 3
        assert all(tx["agent_id"] == "builder_agent" for tx in transactions)

    def test_daily_totals(self, ledger):
        """Test calculating daily spend totals."""
        # Same day transactions
        for i in range(3):
            record = PaymentRecord(
                transaction_id=f"tx_{i}",
                timestamp="2024-01-15T10:00:00Z",
                agent_id="builder_agent",
                service_url="https://api.openai.com",
                price_usdc=1.0,
                status="completed",
                blockchain_tx_hash=f"0xhash{i}",
                facilitator_receipt={},
                vendor="openai"
            )
            ledger.log_transaction(record)

        # Different day
        record = PaymentRecord(
            transaction_id="tx_other",
            timestamp="2024-01-16T10:00:00Z",
            agent_id="builder_agent",
            service_url="https://api.openai.com",
            price_usdc=5.0,
            status="completed",
            blockchain_tx_hash="0xhash_other",
            facilitator_receipt={},
            vendor="openai"
        )
        ledger.log_transaction(record)

        daily_total = ledger.get_daily_total("2024-01-15")
        assert daily_total == 3.0

    def test_monthly_totals(self, ledger):
        """Test calculating monthly spend totals."""
        # Same month transactions
        for i in range(3):
            record = PaymentRecord(
                transaction_id=f"tx_{i}",
                timestamp=f"2024-01-{10+i}T10:00:00Z",
                agent_id="builder_agent",
                service_url="https://api.openai.com",
                price_usdc=2.0,
                status="completed",
                blockchain_tx_hash=f"0xhash{i}",
                facilitator_receipt={},
                vendor="openai"
            )
            ledger.log_transaction(record)

        # Different month
        record = PaymentRecord(
            transaction_id="tx_other",
            timestamp="2024-02-15T10:00:00Z",
            agent_id="builder_agent",
            service_url="https://api.openai.com",
            price_usdc=10.0,
            status="completed",
            blockchain_tx_hash="0xhash_other",
            facilitator_receipt={},
            vendor="openai"
        )
        ledger.log_transaction(record)

        monthly_total = ledger.get_monthly_total("2024-01")
        assert monthly_total == 6.0

    def test_reconciliation(self, ledger):
        """Test blockchain reconciliation detection."""
        # Valid transactions
        valid = PaymentRecord(
            transaction_id="tx_valid",
            timestamp="2024-01-15T10:00:00Z",
            agent_id="builder_agent",
            service_url="https://api.openai.com",
            price_usdc=1.5,
            status="completed",
            blockchain_tx_hash="0xhash1",
            facilitator_receipt={},
            vendor="openai"
        )
        ledger.log_transaction(valid)

        # Invalid status
        invalid = PaymentRecord(
            transaction_id="tx_invalid",
            timestamp="2024-01-15T10:00:00Z",
            agent_id="builder_agent",
            service_url="https://api.openai.com",
            price_usdc=2.0,
            status="unknown",
            blockchain_tx_hash="0xhash2",
            facilitator_receipt={},
            vendor="openai"
        )
        ledger.log_transaction(invalid)

        discrepancies = ledger.reconcile_blockchain()
        assert len(discrepancies) == 1
        assert discrepancies[0]["transaction_id"] == "tx_invalid"


# ============================================================================
# BudgetTracker Tests
# ============================================================================

class TestBudgetTracker:
    """Tests for BudgetTracker budget enforcement."""

    @pytest.fixture
    def tracker(self, tmp_path, monkeypatch):
        """Create tracker with temp state file."""
        monkeypatch.setattr(BudgetTracker, "BUDGET_DIR", tmp_path)
        monkeypatch.setattr(BudgetTracker, "STATE_FILE", tmp_path / "state.json")
        return BudgetTracker()

    def test_budget_checking(self, tracker):
        """Test checking if agent can spend."""
        assert tracker.can_spend("builder_agent", 10.0) is True
        assert tracker.can_spend("builder_agent", 50.0) is False  # Exceeds default daily limit

    def test_spend_recording(self, tracker):
        """Test recording agent spend."""
        assert tracker.can_spend("builder_agent", 5.0) is True
        tracker.record_spend("builder_agent", 5.0)

        state = tracker._state.get("builder_agent", {})
        assert state.get("daily_spent", 0.0) == 5.0

    def test_spend_cannot_exceed_daily_limit(self, tracker):
        """Test that spend cannot exceed daily limit."""
        # Default daily limit is 100, per-transaction limit is 10
        assert tracker.can_spend("builder_agent", 10.0) is True
        for _ in range(10):
            tracker.record_spend("builder_agent", 10.0)

        # Next 10 USDC transaction should exceed limit
        assert tracker.can_spend("builder_agent", 10.0) is False

    def test_spend_cannot_exceed_per_transaction_limit(self, tracker):
        """Test that single transaction cannot exceed limit."""
        # Default per-transaction limit is 10
        assert tracker.can_spend("builder_agent", 10.0) is True
        assert tracker.can_spend("builder_agent", 11.0) is False

    def test_get_usage_tracking(self, tracker):
        """Test usage tracking and limits reporting."""
        tracker.record_spend("builder_agent", 10.0)
        usage = tracker.get_usage("builder_agent")

        assert usage["daily"] == 10.0
        assert usage["daily_limit"] == 100.0
        assert usage["monthly_limit"] == 1000.0


# ============================================================================
# RetryHandler Tests
# ============================================================================

class TestRetryHandler:
    """Tests for RetryHandler exponential backoff."""

    def test_exponential_backoff_calculation(self):
        """Test exponential backoff delay calculation."""
        handler = RetryHandler(base_delay=1.0, exponent=2.0, jitter=False)

        assert handler.calculate_delay(1) == 1.0
        assert handler.calculate_delay(2) == 2.0
        assert handler.calculate_delay(3) == 4.0
        assert handler.calculate_delay(4) == 8.0

    def test_max_delay_enforcement(self):
        """Test max delay is enforced."""
        handler = RetryHandler(base_delay=1.0, max_delay=10.0, exponent=2.0, jitter=False)

        # Should cap at max_delay
        assert handler.calculate_delay(5) == 10.0

    def test_retryable_error_detection(self):
        """Test identifying retryable errors."""
        handler = RetryHandler()

        assert handler.should_retry(TimeoutError("timeout")) is True
        assert handler.should_retry(ConnectionError("conn")) is True
        assert handler.should_retry(ValueError("value")) is False

    def test_non_retryable_error_detection(self):
        """Test non-retryable errors are not retried."""
        handler = RetryHandler()

        assert handler.should_retry(ValueError("invalid")) is False
        assert handler.should_retry(KeyError("key")) is False

    def test_max_attempts_enforcement(self):
        """Test max attempts limit is enforced."""
        handler = RetryHandler(max_attempts=3)

        call_count = 0
        def failing_func():
            nonlocal call_count
            call_count += 1
            raise TimeoutError("timeout")

        with pytest.raises(TimeoutError):
            handler.retry_with_backoff(failing_func)

        assert call_count == 3

    def test_circuit_breaker_triggering(self):
        """Test circuit breaker activation after failures."""
        handler = RetryHandler(max_attempts=3)

        call_count = 0
        def failing_func():
            nonlocal call_count
            call_count += 1
            raise ConnectionError("connection failed")

        # First circuit: exhausts retries
        with pytest.raises(ConnectionError):
            handler.retry_with_backoff(failing_func)

        first_count = call_count
        assert first_count == 3

    def test_successful_retry(self):
        """Test successful retry after failure."""
        handler = RetryHandler(max_attempts=3, base_delay=0.01, jitter=False)

        call_count = 0
        def sometimes_failing():
            nonlocal call_count
            call_count += 1
            if call_count < 2:
                raise TimeoutError("retry me")
            return "success"

        result = handler.retry_with_backoff(sometimes_failing)
        assert result == "success"
        assert call_count == 2


# ============================================================================
# Integration Tests
# ============================================================================

class TestA2AX402ServiceIntegration:
    """Integration tests combining multiple components."""

    def test_payment_flow_with_ledger_and_budget(self, tmp_path, monkeypatch):
        """Test complete payment flow with budget tracking and ledger."""
        ledger = PaymentLedger(root=tmp_path)
        monkeypatch.setattr(BudgetTracker, "BUDGET_DIR", tmp_path)
        monkeypatch.setattr(BudgetTracker, "STATE_FILE", tmp_path / "state.json")
        tracker = BudgetTracker()

        # Check budget
        assert tracker.can_spend("builder_agent", 5.0) is True

        # Log payment
        record = PaymentRecord(
            transaction_id="tx_123",
            timestamp="2024-01-15T10:00:00Z",
            agent_id="builder_agent",
            service_url="https://api.openai.com",
            price_usdc=5.0,
            status="completed",
            blockchain_tx_hash="0xhash",
            facilitator_receipt={"receipt": "data"},
            vendor="openai"
        )
        ledger.log_transaction(record)

        # Record spend
        tracker.record_spend("builder_agent", 5.0)

        # Verify
        assert ledger.get_transaction("tx_123") is not None
        assert tracker._state["builder_agent"]["daily_spent"] == 5.0


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
