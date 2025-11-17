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


@pytest.mark.asyncio
async def test_register_builder_agent(monkeypatch):
    sdk_instance = DummySDK()
    monkeypatch.setattr(omnidaemon_bridge, "OmniDaemonSDK", lambda **kwargs: sdk_instance)
    monkeypatch.setattr(omnidaemon_bridge, "AgentConfig", DummyAgentConfig)
    bridge = omnidaemon_bridge.OmniDaemonBridge()
    await bridge.register_builder_agent()
    assert "genesis.build" in sdk_instance.registered


@pytest.mark.asyncio
async def test_register_core_agents(monkeypatch):
    sdk_instance = DummySDK()
    monkeypatch.setattr(omnidaemon_bridge, "OmniDaemonSDK", lambda **kwargs: sdk_instance)
    monkeypatch.setattr(omnidaemon_bridge, "AgentConfig", DummyAgentConfig)
    bridge = omnidaemon_bridge.OmniDaemonBridge()
    await bridge.register_core_development_agents()
    for topic in ["genesis.spec", "genesis.architect", "genesis.frontend", "genesis.backend", "genesis.security", "genesis.monitoring"]:
        assert topic in sdk_instance.registered


@pytest.mark.asyncio
async def test_register_business_marketing_agents(monkeypatch):
    sdk_instance = DummySDK()
    monkeypatch.setattr(omnidaemon_bridge, "OmniDaemonSDK", lambda **kwargs: sdk_instance)
    monkeypatch.setattr(omnidaemon_bridge, "AgentConfig", DummyAgentConfig)
    bridge = omnidaemon_bridge.OmniDaemonBridge()
    await bridge.register_business_marketing_agents()
    for topic in ["genesis.seo", "genesis.content", "genesis.marketing", "genesis.sales", "genesis.support"]:
        assert topic in sdk_instance.registered


@pytest.mark.asyncio
async def test_register_finance_special_agents(monkeypatch):
    sdk_instance = DummySDK()
    monkeypatch.setattr(omnidaemon_bridge, "OmniDaemonSDK", lambda **kwargs: sdk_instance)
    monkeypatch.setattr(omnidaemon_bridge, "AgentConfig", DummyAgentConfig)
    bridge = omnidaemon_bridge.OmniDaemonBridge()
    await bridge.register_finance_special_agents()
    for topic in ["genesis.finance", "genesis.pricing", "genesis.analytics", "genesis.email", "genesis.commerce", "genesis.darwin"]:
        assert topic in sdk_instance.registered


@pytest.mark.asyncio
async def test_register_meta_agent(monkeypatch):
    sdk_instance = DummySDK()
    monkeypatch.setattr(omnidaemon_bridge, "OmniDaemonSDK", lambda **kwargs: sdk_instance)
    monkeypatch.setattr(omnidaemon_bridge, "AgentConfig", DummyAgentConfig)
    bridge = omnidaemon_bridge.OmniDaemonBridge()
    await bridge.register_meta_agent()
    assert "genesis.meta.orchestrate" in sdk_instance.registered
