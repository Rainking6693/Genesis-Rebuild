from pathlib import Path

from infrastructure.tool_reliability.rl_refinement import refine_policy


def test_rl_refinement_saves_stats(tmp_path):
    import asyncio

    data = tmp_path / "dataset.json"
    data.write_text("[]")
    output = tmp_path / "stats.json"
    stats = asyncio.run(refine_policy(data, output, iterations=10))
    assert stats["iterations"] == 10
    assert output.exists()
