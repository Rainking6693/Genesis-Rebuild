"""
Shared fixtures for agent lightning tests.
"""

from typing import Any, Dict, List

import pytest

from infrastructure.ap2_protocol import AP2Client


@pytest.fixture
def ap2_event_spy(monkeypatch: pytest.MonkeyPatch) -> List[Dict[str, Any]]:
    """Spy on AP2 client events while keeping original logging intact."""
    recorded: List[Dict[str, Any]] = []
    original = AP2Client.record_event

    def spy(self, event):
        recorded.append(event.to_dict())
        return original(self, event)

    monkeypatch.setattr(AP2Client, "record_event", spy)
    return recorded
