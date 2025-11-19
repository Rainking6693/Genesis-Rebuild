from infrastructure.deepeyes.multimodal_tools import ScreenshotAnalyzer, DiagramInterpreter


def test_screenshot_analysis():
    analyzer = ScreenshotAnalyzer()
    result = analyzer.analyze("screenshots/test.png")
    assert result.summary.startswith("Detected")
    assert len(result.elements) == 3


def test_diagram_interpreter():
    interpreter = DiagramInterpreter()
    summary = interpreter.interpret(["A", "B"], [{"from": "A", "to": "B"}])
    assert "summary" in summary
    assert "highlights" in summary
