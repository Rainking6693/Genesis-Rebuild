from pathlib import Path

import sys
from pathlib import Path

sys.path.append(str(Path(__file__).parent.parent / "scripts"))

from evaluate_realx_bench import load_realx_tasks, evaluate


def test_load_realx_tasks(tmp_path):
    path = tmp_path / "realx_bench.json"
    path.write_text('{"tasks": [{"id": "t1"}, {"id": "t2"}]}')
    tasks = load_realx_tasks(path)
    assert len(tasks) == 2


def test_evaluate_metrics():
    total, hits = evaluate([{"id": "a"}] * 100, success_rate=0.8)
    assert total == 100
    assert hits == 80
