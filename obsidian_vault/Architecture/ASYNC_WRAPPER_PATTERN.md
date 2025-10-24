---
title: ASYNC WRAPPER PATTERN - MANDATORY FOR ALL C/C++ LIBRARIES
category: Architecture
dg-publish: true
publish: true
tags: []
source: docs/ASYNC_WRAPPER_PATTERN.md
exported: '2025-10-24T22:05:26.929480'
---

# ASYNC WRAPPER PATTERN - MANDATORY FOR ALL C/C++ LIBRARIES

**Status:** MANDATORY PATTERN (October 24, 2025)
**Applies To:** ALL agents working with async code
**Enforcement:** MUST be referenced in every task involving async operations

---

## THE PROBLEM (Root Cause Analysis)

**Phase 5.2 (Visual Compression):**
- PIL (Pillow) and Tesseract are C++ libraries
- Called directly in `async def` functions
- Result: **Blocking I/O** - event loop blocked, 10x slowdown

**Phase 5.3 Day 1 (Vector DB):**
- FAISS is a C++ library
- Called directly in `async def` functions
- Result: **EXACT SAME MISTAKE** - blocking I/O pattern repeated

**Root Cause:** C/C++ libraries are **synchronous blocking** and MUST be wrapped in `asyncio.to_thread()` when used in async Python code.

---

## THE SOLUTION: Reusable Async Wrapper Pattern

### Pattern 1: Simple Sync Operation Wrapper

```python
import asyncio
from typing import TypeVar, Callable, Any

T = TypeVar('T')

async def run_sync_in_thread(func: Callable[..., T], *args: Any, **kwargs: Any) -> T:
    """
    Execute a synchronous blocking function in a thread pool.

    Use this for ANY C/C++ library operation (PIL, FAISS, NumPy, etc.)

    Example:
        # Before (BLOCKING):
        result = some_cpp_library.operation(data)

        # After (NON-BLOCKING):
        result = await run_sync_in_thread(some_cpp_library.operation, data)

    Args:
        func: The synchronous function to execute
        *args: Positional arguments to pass to func
        **kwargs: Keyword arguments to pass to func

    Returns:
        The result of the function execution
    """
    return await asyncio.to_thread(func, *args, **kwargs)
```

### Pattern 2: Async Context Manager Wrapper

```python
from contextlib import asynccontextmanager
from typing import AsyncIterator, Any

@asynccontextmanager
async def async_file_operation(file_path: str, mode: str = 'r') -> AsyncIterator[Any]:
    """
    Wrap blocking file I/O operations in async context.

    Use this for file operations (open, write, read, save, load)

    Example:
        # Before (BLOCKING):
        with open('file.txt', 'w') as f:
            f.write(data)

        # After (NON-BLOCKING):
        async with async_file_operation('file.txt', 'w') as f:
            await f.write(data)

    Better Alternative: Use aiofiles library
        import aiofiles
        async with aiofiles.open('file.txt', 'w') as f:
            await f.write(data)
    """
    # Implementation using asyncio.to_thread
    pass
```

### Pattern 3: Class-Based Async Wrapper

```python
class AsyncCPPLibraryWrapper:
    """
    Wrapper class for C++ libraries with async-safe operations.

    Use this pattern for complex libraries (FAISS, NumPy, etc.)
    """

    def __init__(self, sync_library):
        """
        Args:
            sync_library: The synchronous C++ library instance
        """
        self._sync_lib = sync_library
        self._lock = asyncio.Lock()  # For thread-safe operations

    async def safe_operation(self, *args, **kwargs):
        """
        Execute library operation in thread pool with lock protection.

        Example:
            wrapper = AsyncCPPLibraryWrapper(faiss.IndexFlatL2(dim))
            await wrapper.safe_operation('add', embeddings)
        """
        async with self._lock:
            method = getattr(self._sync_lib, args[0])
            return await asyncio.to_thread(method, *args[1:], **kwargs)
```

---

## MANDATORY USAGE RULES

### Rule 1: ALWAYS Wrap C/C++ Library Calls

**Libraries that MUST be wrapped:**
- ✅ PIL/Pillow (Image operations)
- ✅ Tesseract (OCR)
- ✅ FAISS (Vector search)
- ✅ NumPy (Heavy computations)
- ✅ OpenCV (Image processing)
- ✅ scikit-learn (ML operations)
- ✅ pandas (Large dataframe operations)
- ✅ Any library with C/C++ backend

**Check if library needs wrapping:**
```python
# If library is NOT pure Python, wrap it
import inspect
import library

# Check if C extension
if hasattr(library, '__file__') and library.__file__.endswith('.so'):
    # MUST wrap in asyncio.to_thread()
    pass
```

### Rule 2: File I/O ALWAYS Uses aiofiles

```python
# ❌ WRONG (Blocking):
async def save_data(file_path: str, data: str):
    with open(file_path, 'w') as f:
        f.write(data)

# ✅ CORRECT (Non-blocking):
import aiofiles

async def save_data(file_path: str, data: str):
    async with aiofiles.open(file_path, 'w') as f:
        await f.write(data)
```

### Rule 3: Add Concurrency Tests

**EVERY async module MUST have a concurrency test:**

```python
import asyncio
import pytest
import time

@pytest.mark.asyncio
async def test_operations_are_nonblocking():
    """
    Verify operations don't block event loop under concurrent load.

    This test prevents regression of blocking I/O bugs.
    """
    # Run 100 operations concurrently
    start_time = time.time()

    tasks = [
        your_async_function(data)
        for _ in range(100)
    ]
    results = await asyncio.gather(*tasks)

    elapsed = time.time() - start_time

    # If blocking, would take 100 * operation_time
    # If non-blocking, should take ~operation_time
    # Allow 10x margin (should be 100x if blocking)
    assert elapsed < 10.0, f"Operations blocked event loop: {elapsed}s"
    assert len(results) == 100
```

---

## IMPLEMENTATION EXAMPLES

### Example 1: FAISS Vector Database

```python
# ❌ WRONG (Phase 5.3 Day 1 mistake):
class FAISSVectorDatabase:
    async def add(self, embedding: np.ndarray):
        self.index.add(embedding)  # BLOCKS EVENT LOOP

    async def search(self, query: np.ndarray, top_k: int):
        distances, indices = self.index.search(query, top_k)  # BLOCKS
        return indices

# ✅ CORRECT (Fixed version):
class FAISSVectorDatabase:
    async def add(self, embedding: np.ndarray):
        # Wrap in thread pool
        await asyncio.to_thread(self.index.add, embedding)

    async def search(self, query: np.ndarray, top_k: int):
        # Wrap in thread pool
        distances, indices = await asyncio.to_thread(
            self.index.search, query, top_k
        )
        return indices

    async def save(self, file_path: str):
        # File I/O also needs wrapping
        await asyncio.to_thread(faiss.write_index, self.index, file_path)
```

### Example 2: PIL Image Processing

```python
# ❌ WRONG (Phase 5.2 mistake):
async def compress_to_image(text: str) -> bytes:
    img = Image.new('RGB', (800, 600), 'white')  # BLOCKS
    draw = ImageDraw.Draw(img)  # BLOCKS
    draw.text((10, 10), text, fill='black')  # BLOCKS
    buffer = io.BytesIO()
    img.save(buffer, 'PNG')  # BLOCKS
    return buffer.getvalue()

# ✅ CORRECT (Fixed version):
async def compress_to_image(text: str) -> bytes:
    def _blocking_image_creation():
        img = Image.new('RGB', (800, 600), 'white')
        draw = ImageDraw.Draw(img)
        draw.text((10, 10), text, fill='black')
        buffer = io.BytesIO()
        img.save(buffer, 'PNG')
        return buffer.getvalue()

    # Execute all PIL operations in thread pool
    return await asyncio.to_thread(_blocking_image_creation)
```

### Example 3: NumPy Heavy Computation

```python
# ❌ WRONG:
async def calculate_embeddings(data: np.ndarray) -> np.ndarray:
    # Heavy matrix operations block event loop
    normalized = data / np.linalg.norm(data, axis=1, keepdims=True)
    return normalized

# ✅ CORRECT:
async def calculate_embeddings(data: np.ndarray) -> np.ndarray:
    def _heavy_computation():
        return data / np.linalg.norm(data, axis=1, keepdims=True)

    return await asyncio.to_thread(_heavy_computation)
```

---

## DETECTION & TESTING

### How to Detect Blocking I/O

**Method 1: Event Loop Warning (Python 3.12+)**
```python
import asyncio
asyncio.set_event_loop_policy(asyncio.DefaultEventLoopPolicy())
# Python will warn about blocking calls in async functions
```

**Method 2: Concurrency Test (Proven effective)**
```python
async def test_concurrent_operations():
    """Test 100 operations complete in reasonable time"""
    start = time.time()
    await asyncio.gather(*[operation() for _ in range(100)])
    elapsed = time.time() - start

    # If blocking: 100 * 0.5s = 50s
    # If non-blocking: ~0.5s
    assert elapsed < 5.0, "Blocking I/O detected!"
```

**Method 3: Profiling**
```python
import cProfile
import asyncio

async def main():
    # Your async operations
    pass

cProfile.run('asyncio.run(main())')
# Look for long-running synchronous calls
```

---

## CODE REVIEW CHECKLIST

**Before approving ANY async code, verify:**

- [ ] All C/C++ library calls wrapped in `asyncio.to_thread()`
- [ ] All file I/O uses `aiofiles` or `asyncio.to_thread()`
- [ ] Concurrency test exists and validates non-blocking behavior
- [ ] No `time.sleep()` calls (use `asyncio.sleep()` instead)
- [ ] No synchronous HTTP requests (use `aiohttp` or `httpx`)
- [ ] No blocking database queries (use async drivers)

---

## TASK REQUIREMENT TEMPLATE

**For ALL tasks involving async operations, include this section:**

```markdown
## ASYNC WRAPPER PATTERN (MANDATORY)

**READ FIRST:** `/home/genesis/genesis-rebuild/docs/ASYNC_WRAPPER_PATTERN.md`

**Requirements:**
1. ALL C/C++ library operations MUST be wrapped in `asyncio.to_thread()`
2. ALL file I/O MUST use `aiofiles`
3. MUST include concurrency test validating non-blocking behavior
4. MUST pass 100 concurrent operations in <5s

**Validation:**
- Run: `pytest tests/test_<module>.py::test_concurrent_nonblocking -v`
- Expected: <5s for 100 operations (proves non-blocking)
- If >30s: Blocking I/O present, FAIL

**Libraries that MUST be wrapped:**
- FAISS, PIL, Tesseract, NumPy, OpenCV, scikit-learn, pandas
- Check: `import inspect; inspect.getfile(library).endswith('.so')`
```

---

## FREQUENTLY ASKED QUESTIONS

**Q: How do I know if a library is C/C++?**
A: Check if import path ends with `.so` (Linux) or `.pyd` (Windows), or use `inspect.getfile()`. Common indicators: High performance, NumPy integration, "compiled" in docs.

**Q: What's the performance overhead of `asyncio.to_thread()`?**
A: ~0.1-1ms per call. Negligible compared to blocking the entire event loop.

**Q: Can I use threading.Thread directly?**
A: No! Use `asyncio.to_thread()` for proper async integration and event loop safety.

**Q: What about CPU-intensive pure Python code?**
A: Wrap in `asyncio.to_thread()` if >100ms execution time. Python GIL still applies, but prevents event loop blocking.

**Q: Should I wrap ALL NumPy operations?**
A: Only heavy operations (>10ms). Simple array access is fast enough. Profile to decide.

---

## ENFORCEMENT

**All agents (especially Thon) MUST:**
1. Reference this document in every async task
2. Include concurrency tests in every async module
3. Have Hudson verify async wrapper usage in code reviews
4. Update this document with new patterns as discovered

**Violation Consequences:**
- Code review will be REJECTED
- P0 blocker status assigned
- Must fix before proceeding to next task

---

**Version:** 1.0
**Last Updated:** October 24, 2025
**Owned By:** All Genesis Agents
**Enforced By:** Hudson (Code Review), Alex (E2E Testing)

---

## REFERENCES

- Python asyncio documentation: https://docs.python.org/3/library/asyncio.html
- aiofiles library: https://github.com/Tinche/aiofiles
- FAISS async patterns: (context7 MCP lookup)
- PIL/Pillow async patterns: (context7 MCP lookup)
