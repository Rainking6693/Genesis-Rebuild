import io
import sys

import sys
from pathlib import Path

sys.path.append(str(Path(__file__).parent.parent / "scripts"))

from run_tool_ab_test import main


def test_ab_simulation_outputs():
    buf = io.StringIO()
    old_stdout = sys.stdout
    sys.stdout = buf
    try:
        main()
    finally:
        sys.stdout = old_stdout
    output = buf.getvalue()
    assert "Control (Old Tool)" in output
    assert "Treatment (DeepEyesV2)" in output
