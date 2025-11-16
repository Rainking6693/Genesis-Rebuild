from scripts.x402_daily_ledger_sync import reconcile


def test_reconcile_detects_discrepancies():
    transactions = {"resourceA": 10.0, "resourceB": 5.0}
    ledger_totals = {"resourceA": 9.5, "resourceB": 5.0}
    diffs = reconcile(transactions, ledger_totals)
    assert "resourceA" in diffs
    assert abs(diffs["resourceA"] - 0.5) < 1e-6
    assert "resourceB" not in diffs
