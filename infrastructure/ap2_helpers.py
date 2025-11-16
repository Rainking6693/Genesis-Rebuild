from __future__ import annotations

from typing import Dict

from infrastructure.ap2_protocol import AP2Event, get_ap2_client
from infrastructure.business_monitor import get_monitor


def record_ap2_event(agent: str, action: str, cost: float, context: Dict[str, str]) -> AP2Event:
    client = get_ap2_client()
    event = client.wrap(agent=agent, action=action, cost=cost, context=context)
    client.record_event(event)
    get_monitor().record_ap2_event(event.to_dict())
    return event
