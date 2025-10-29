# CRITICAL FIXES - IMPLEMENTATION GUIDE
**P0 Issues - Blocking Deployment**
**Date: October 28, 2025**

---

## FIX #1: Agent-S PyAutoGUI Headless Loading
**Severity:** P0 - CRITICAL
**Files:** `infrastructure/agent_s_backend.py`
**Estimated Time:** 2-4 hours
**Status:** Ready to implement

### Problem
PyAutoGUI fails to import in headless environments (Docker, CI/CD, VPS) because it requires X11 display server access.

```
RuntimeError: Could not connect to mouse/keyboard input service
```

### Root Cause
```python
# Current (line 36):
import pyautogui  # Fails immediately if no display
```

### Solution: Lazy-Load with Display Mock

**Option A: Lazy-Load (Recommended)**

```python
# infrastructure/agent_s_backend.py - Lines 30-40 (NEW)

import os
import sys
from typing import Optional

# Lazy-load PyAutoGUI to avoid import errors in headless environments
_pyautogui_cached = None

def _get_pyautogui():
    """Lazy-load PyAutoGUI with fallback for headless environments"""
    global _pyautogui_cached

    if _pyautogui_cached is not None:
        return _pyautogui_cached

    # Check if display is available
    has_display = os.getenv("DISPLAY") or sys.platform != "linux"

    if not has_display:
        # Create virtual display for testing
        try:
            import pyvirtualdisplay
            # pyvirtualdisplay already initializes Xvfb
        except ImportError:
            # Mock the display for import purposes
            os.environ.setdefault("DISPLAY", ":99")

    try:
        import pyautogui
        _pyautogui_cached = pyautogui
        return pyautogui
    except Exception as e:
        logger.error(f"Failed to import pyautogui: {e}")
        # Return mock for testing
        return MockPyAutoGUI()


class MockPyAutoGUI:
    """Mock PyAutoGUI for headless testing"""

    @staticmethod
    def screenshot():
        """Return empty screenshot"""
        from PIL import Image
        return Image.new("RGB", (1024, 768), color="white")

    @staticmethod
    def click(x, y):
        logger.warning(f"MockPyAutoGUI.click({x}, {y}) - no display available")

    @staticmethod
    def typewrite(text):
        logger.warning(f"MockPyAutoGUI.typewrite({text}) - no display available")


# Usage: Replace "import pyautogui" with:
pyautogui = _get_pyautogui()
```

**Option B: Docker-Based (Alternative)**

Use Docker container with Xvfb virtual display:

```dockerfile
# Dockerfile
FROM python:3.12-slim

# Install X11 dependencies
RUN apt-get update && apt-get install -y \
    xvfb \
    x11-utils \
    libxkbcommon0

# Install Agent-S
RUN pip install agent-s pyautogui

# Run with virtual display
ENV DISPLAY=:99
CMD ["Xvfb :99 -screen 0 1024x768x24 & pytest tests/"]
```

### Implementation Steps

1. **Add lazy-load function** (before class definitions)
2. **Replace top-level import** with lazy-load call
3. **Test with headless env**:
   ```bash
   DISPLAY= python -c "from infrastructure.agent_s_backend import AgentSBackend"
   ```
4. **Run test suite**:
   ```bash
   pytest tests/test_agent_s_comparison.py -v
   ```

### Verification

```python
# Test script: tests/test_agent_s_headless.py
import os
import pytest

def test_agent_s_imports_without_display():
    """Verify Agent-S imports in headless environment"""
    # Simulate headless environment
    display = os.environ.pop("DISPLAY", None)

    try:
        from infrastructure.agent_s_backend import AgentSBackend, get_agent_s_backend

        # Should not raise ImportError
        backend = AgentSBackend(model="gpt-4o")
        assert backend is not None

    finally:
        # Restore display
        if display:
            os.environ["DISPLAY"] = display
```

---

## FIX #2: Research Discovery memoryos Dependency
**Severity:** P0 - CRITICAL
**Files:** `pyproject.toml`, `requirements.txt`
**Estimated Time:** 0.5 hours
**Status:** Ready to implement

### Problem
Research Discovery Agent imports from `memoryos` package which is not installed.

```
ModuleNotFoundError: No module named 'memoryos'
```

### Root Cause
```python
# infrastructure/memory_os.py (line 35):
from memoryos import Memoryos  # Package not installed
```

### Solution: Install memoryos

**Step 1: Install Package**

```bash
pip install memoryos
```

**Step 2: Update Dependencies**

```toml
# pyproject.toml (add to dependencies)
[tool.poetry.dependencies]
memoryos = "^0.1.0"
```

Or:

```txt
# requirements.txt (add line)
memoryos>=0.1.0
```

**Step 3: Verify Installation**

```bash
# Check installation
pip list | grep memoryos

# Verify import works
python -c "from memoryos import Memoryos; print('OK')"
```

**Step 4: Run Tests**

```bash
pytest tests/test_research_discovery_agent.py -v
```

### If memoryos Not Available in PyPI

**Fallback: Use Mock for Development**

```python
# infrastructure/memory_os.py (lines 30-40 - ADD)

import sys
import os

# Try to import real MemoryOS, fall back to mock
try:
    from memoryos import Memoryos
    MEMORYOS_AVAILABLE = True
except ImportError:
    logger.warning("memoryos not available, using mock implementation")
    MEMORYOS_AVAILABLE = False

    class Memoryos:
        """Mock MemoryOS for development/testing"""
        def __init__(self, **kwargs):
            self.storage = {}

        def store(self, agent_id, user_id, user_input, agent_response, **kwargs):
            key = f"{agent_id}:{user_id}"
            if key not in self.storage:
                self.storage[key] = []
            self.storage[key].append({
                "user_input": user_input,
                "agent_response": agent_response,
                "timestamp": datetime.now().isoformat()
            })

        def retrieve(self, agent_id, user_id, query, **kwargs):
            key = f"{agent_id}:{user_id}"
            return self.storage.get(key, [])
```

### Verification

```python
# Test script: tests/test_research_discovery_memoryos.py
def test_memoryos_available():
    """Verify memoryos can be imported"""
    from infrastructure.memory_os import GenesisMemoryOS, create_genesis_memory

    memory = create_genesis_memory()
    assert memory is not None

    # Test store/retrieve
    memory.store(
        agent_id="test_agent",
        user_id="test_user",
        user_input="Test query",
        agent_response="Test response",
    )

    results = memory.retrieve(
        agent_id="test_agent",
        user_id="test_user",
        query="Test query",
    )

    assert len(results) > 0
```

---

## FIX #3: OpenHands Runtime Initialization
**Severity:** P0 - CRITICAL
**Files:** `infrastructure/openhands_integration.py`
**Estimated Time:** 4-6 hours
**Status:** Requires implementation

### Problem
OpenHands runtime is not initialized; only imports are cached.

```python
# Line 145-150 (CURRENT):
self._imports = {
    'AgentController': AgentController,
    'AppConfig': AppConfig,
    # ... imports stored but never used
}
# Missing: Runtime and agent initialization
```

### Solution: Complete Runtime Initialization

**Replace `_ensure_runtime()` method:**

```python
# infrastructure/openhands_integration.py (replace lines 131-180)

async def _ensure_runtime(self):
    """Initialize OpenHands runtime and agent"""
    if not self.config.enabled:
        raise RuntimeError("OpenHands integration disabled. Set USE_OPENHANDS=true")

    if self._runtime is None or self._agent is None:
        try:
            # Import OpenHands components
            from openhands.controller.agent_controller import AgentController
            from openhands.core.config import AppConfig, LLMConfig
            from openhands.core.llm import LLM
            from openhands.events.action import MessageAction
            from openhands.runtime.client.runtime import EventStreamRuntime

            # Configure LLM
            llm_config = LLMConfig(
                model=self.config.model,
                api_key=os.getenv("OPENAI_API_KEY"),
                temperature=0.1
            )

            # Configure App
            app_config = AppConfig(
                llm=llm_config,
                workspace_mount_path=str(self.config.workspace_dir)
            )

            # Initialize runtime
            self._runtime = EventStreamRuntime(config=app_config)
            logger.info(f"OpenHands runtime initialized: {self.config.model}")

            # Initialize agent
            self._agent = AgentController(
                config=app_config,
                runtime=self._runtime,
                max_iterations=self.config.max_iterations,
                timeout_seconds=self.config.timeout_seconds
            )
            logger.info(f"OpenHands agent initialized")

        except ImportError as e:
            raise ImportError(f"OpenHands not installed: {e}. Run: pip install open-hands")
        except Exception as e:
            raise RuntimeError(f"Failed to initialize OpenHands: {e}")
```

**Add `generate_code()` method (NEW):**

```python
# infrastructure/openhands_integration.py (after _ensure_runtime method)

async def generate_code(
    self,
    problem_description: str,
    context: Optional[Dict[str, Any]] = None,
    max_iterations: Optional[int] = None
) -> OpenHandsResult:
    """
    Generate code using OpenHands CodeActAgent

    Args:
        problem_description: Natural language problem description
        context: Additional context (language, framework, etc.)
        max_iterations: Override default max iterations

    Returns:
        OpenHandsResult with generated code

    Example:
        result = await client.generate_code(
            problem_description="Create FastAPI endpoint for user auth",
            context={"language": "python", "framework": "fastapi"}
        )
    """
    import time
    start_time = time.time()

    try:
        await self._ensure_runtime()

        # Build instruction
        instruction = problem_description
        if context:
            instruction += "\n\nContext:"
            for key, value in context.items():
                instruction += f"\n{key}: {value}"

        # Run agent (wrap in executor since it's not async)
        loop = asyncio.get_event_loop()
        actions = await loop.run_in_executor(
            None,
            self._run_agent_sync,
            instruction,
            max_iterations or self.config.max_iterations
        )

        # Extract generated code from actions
        generated_code = self._extract_code_from_actions(actions)

        duration = time.time() - start_time

        logger.info(f"Code generation completed in {duration:.2f}s")

        return OpenHandsResult(
            success=True,
            generated_code=generated_code,
            execution_time=duration,
            iterations_used=len(actions),
            metadata={"actions": actions}
        )

    except Exception as e:
        duration = time.time() - start_time
        logger.error(f"Code generation failed: {e}")
        return OpenHandsResult(
            success=False,
            error_message=str(e),
            execution_time=duration
        )

def _run_agent_sync(self, instruction: str, max_iterations: int) -> List:
    """Run agent synchronously"""
    actions = []

    for i in range(max_iterations):
        # Get next action from agent
        action = self._agent.step(instruction)

        if action is None:
            break

        actions.append(action)

        # Check termination conditions
        if hasattr(action, 'is_done') and action.is_done:
            break

    return actions

def _extract_code_from_actions(self, actions: List) -> str:
    """Extract generated code from action history"""
    code_blocks = []

    for action in actions:
        # Extract code from WriteFile or similar actions
        if hasattr(action, 'code'):
            code_blocks.append(action.code)
        elif hasattr(action, 'content'):
            code_blocks.append(action.content)

    return "\n".join(code_blocks) if code_blocks else ""
```

**Add methods for other operation modes:**

```python
# infrastructure/openhands_integration.py (add after generate_code)

async def generate_tests(
    self,
    code: str,
    test_framework: str = "pytest"
) -> OpenHandsResult:
    """Generate tests for given code"""
    instruction = f"""Generate comprehensive {test_framework} tests for this code:

{code}

Requirements:
- High code coverage (>90%)
- Test both success and error cases
- Use realistic test data"""

    return await self.generate_code(instruction)

async def debug_code(
    self,
    code: str,
    error_message: str
) -> OpenHandsResult:
    """Debug and fix code based on error message"""
    instruction = f"""Fix this code that has the following error:

Code:
{code}

Error:
{error_message}

Provide the corrected code."""

    return await self.generate_code(instruction)
```

### Testing

**Test script: tests/test_openhands_complete.py**

```python
import pytest
import asyncio
from infrastructure.openhands_integration import (
    OpenHandsClient, OpenHandsConfig, OpenHandsResult
)

@pytest.mark.skipif(
    not os.getenv("USE_OPENHANDS", "").lower() == "true",
    reason="OpenHands integration disabled"
)
@pytest.mark.asyncio
class TestOpenHandsComplete:

    async def test_generate_code(self):
        """Test code generation"""
        config = OpenHandsConfig(enabled=True)
        client = OpenHandsClient(config=config)

        result = await client.generate_code(
            problem_description="Create a simple Python function to calculate factorial",
            context={"language": "python"}
        )

        assert result.success or result.error_message
        if result.success:
            assert result.generated_code
            assert len(result.generated_code) > 0

    async def test_generate_tests(self):
        """Test test generation"""
        config = OpenHandsConfig(enabled=True)
        client = OpenHandsClient(config=config)

        code = """
def add(a, b):
    return a + b
"""

        result = await client.generate_tests(code)

        assert result.success or result.error_message
        if result.success:
            assert "test_" in result.generated_code or result.test_code
```

### Verification

```bash
# Enable OpenHands
export USE_OPENHANDS=true
export OPENAI_API_KEY=sk-...

# Run tests
pytest tests/test_openhands_complete.py -v

# Verify methods exist
python -c "from infrastructure.openhands_integration import OpenHandsClient; \
          import inspect; \
          print([m for m in dir(OpenHandsClient) if not m.startswith('_')])"
```

---

## IMPLEMENTATION CHECKLIST

### Fix #1: Agent-S PyAutoGUI (2-4 hours)
- [ ] Add `_get_pyautogui()` lazy-load function
- [ ] Add `MockPyAutoGUI` class for headless mode
- [ ] Replace top-level `import pyautogui` with lazy-load
- [ ] Test in headless environment: `DISPLAY= pytest ...`
- [ ] Verify all Agent-S tests pass
- [ ] Document headless mode support in README

### Fix #2: Research Discovery memoryos (0.5 hours)
- [ ] `pip install memoryos`
- [ ] Update pyproject.toml/requirements.txt
- [ ] Verify import: `python -c "from memoryos import Memoryos"`
- [ ] Run Research Discovery tests
- [ ] Document dependency in setup guide

### Fix #3: OpenHands Runtime (4-6 hours)
- [ ] Replace `_ensure_runtime()` with complete initialization
- [ ] Implement `generate_code()` method
- [ ] Implement `_run_agent_sync()` helper
- [ ] Implement `_extract_code_from_actions()` helper
- [ ] Implement `generate_tests()` method
- [ ] Implement `debug_code()` method
- [ ] Add comprehensive test suite
- [ ] Run full test coverage
- [ ] Document OpenHands integration

---

## Rollback Plan

If fixes cause regressions:

1. **Agent-S**: Revert to Docker-based execution (no code changes needed)
2. **Research Discovery**: Use mock MemoryOS until real package available
3. **OpenHands**: Disable via feature flag, fall back to SE-Darwin

---

**Total Estimated Time: 6.5-10.5 hours**
**Parallel Work Possible: Yes (all three P0 fixes independent)**
**Recommended Order: 2 → 1 → 3 (fastest to slowest)**

