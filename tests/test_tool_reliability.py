import asyncio

from infrastructure.deepeyes.tool_reliability import RLModelStub, ToolReliabilityMiddleware


class DummyMonitor:
    def __init__(self):
        self.events = []

    def record_tool_event(self, tool_name, success, attempt, metadata=None):
        self.events.append({
            "tool": tool_name,
            "success": success,
            "attempt": attempt,
            "metadata": metadata or {}
        })


async def always_success(tool_name, context):
    await asyncio.sleep(0.01)
    return {"status": "success", "payload": context}


async def always_fail(tool_name, context):
    await asyncio.sleep(0.01)
    return {"status": "failed", "error": "fallback fail"}


def test_tool_reliability_succeeds_without_fallback():
    monitor = DummyMonitor()
    rl = RLModelStub(success_rate=1.0)
    middleware = ToolReliabilityMiddleware(rl_model=rl, sft_executor=always_success, monitor=monitor)
    result = asyncio.run(middleware.invoke("test_tool", {"foo": "bar"}))
    assert result["status"] == "success"
    assert len(monitor.events) == 1
    assert monitor.events[0]["success"] is True


def test_tool_reliability_fallback_after_retries():
    monitor = DummyMonitor()
    rl = RLModelStub(success_rate=0.0)
    middleware = ToolReliabilityMiddleware(rl_model=rl, sft_executor=always_success, monitor=monitor, max_retries=2)
    result = asyncio.run(middleware.invoke("test_tool", {"foo": "bar"}))
    assert result["status"] == "success"
    assert len(monitor.events) == 3  # 2 RL attempts + 1 fallback
    assert monitor.events[-1]["attempt"] == 3
