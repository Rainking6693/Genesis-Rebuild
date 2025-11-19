from infrastructure.deepeyes.tool_chain_tracker import ToolChainTracker


def test_tool_chain_records():
    tracker = ToolChainTracker()
    tracker.record_chain(["screenshot", "ocr", "code"])
    tracker.record_chain(["screenshot", "ocr", "code"])
    assert tracker.get_stats()["screenshot->ocr->code"] == 2
