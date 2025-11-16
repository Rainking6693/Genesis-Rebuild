from datetime import datetime, timedelta, timezone

from scripts.x402_stale_payments import detect_stale_authorizations


def test_detect_stale_authorizations():
    now = datetime.now(timezone.utc)
    transactions = [
        {"timestamp": (now - timedelta(minutes=20)).isoformat(), "transaction_hash": "", "status": "pending"},
        {"timestamp": (now - timedelta(minutes=5)).isoformat(), "transaction_hash": "tx123", "status": "captured"},
    ]
    stale = detect_stale_authorizations(transactions, stale_seconds=600)
    assert stale == 1
