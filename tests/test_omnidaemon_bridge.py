import asyncio

import pytest

from infrastructure import omnidaemon_bridge


class DummyAgentConfig:
    def __init__(self, topic, callback, **kwargs):
        self.topic = topic
        self.callback = callback


class DummySDK:
    def __init__(self, event_bus=None):
        self.event_bus = event_bus
        self.registered = []

    async def register_agent(self, config):
        self.registered.append(config.topic)


@pytest.mark.asyncio
async def test_register_business_idea(monkeypatch):
    sdk_instance = DummySDK()
    monkeypatch.setattr(omnidaemon_bridge, "OmniDaemonSDK", lambda **kwargs: sdk_instance)
    monkeypatch.setattr(omnidaemon_bridge, "AgentConfig", DummyAgentConfig)
    bridge = omnidaemon_bridge.OmniDaemonBridge()
    await bridge.register_business_idea_generator()
    assert "genesis.idea.generate" in sdk_instance.registered
