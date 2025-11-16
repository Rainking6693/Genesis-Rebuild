from scripts.x402_monitor_alerts import detect_failure_streaks


def make_event(action: str, vendor: str) -> dict:
    return {
        "action": action,
        "context": {"vendor": vendor},
        "agent": vendor,
    }


def test_detect_failure_streaks():
    events = [
        make_event("payment_success", "vendorA"),
        make_event("payment_error", "vendorA"),
        make_event("payment_error", "vendorA"),
        make_event("payment_error", "vendorA"),
        make_event("payment_error", "vendorA"),
        make_event("payment_error", "vendorA"),
    ]
    results = detect_failure_streaks(events, threshold=3)
    assert results["vendora"] >= 3
