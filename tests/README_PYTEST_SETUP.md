# Genesis Test Suite - Quick Setup Guide

**Last Updated:** October 25, 2025

## Quick Start (3 Commands)

```bash
# 1. Create virtual environment
python3 -m venv venv && source venv/bin/activate

# 2. Install all dependencies
pip install -e ".[test]" && pip install -r requirements_infrastructure.txt

# 3. Run tests
pytest tests/ -v
```

---

## Environment Setup Details

### Required Python Version
- **Python 3.12+** (tested on 3.12.3)

### Virtual Environment
```bash
# Create
python3 -m venv venv

# Activate (Linux/Mac)
source venv/bin/activate

# Activate (Windows)
venv\Scripts\activate

# Deactivate (any OS)
deactivate
```

### Install Dependencies
```bash
# Core test dependencies
pip install -e ".[test]"

# Infrastructure dependencies
pip install -r requirements_infrastructure.txt

# Manual install if needed
pip install numpy faiss-cpu sentence-transformers \
            opentelemetry-api opentelemetry-sdk opentelemetry-instrumentation
```

---

## Running Tests

### Basic Commands

```bash
# All tests
pytest tests/ -v

# Specific file
pytest tests/test_error_handling.py -v

# Specific test
pytest tests/test_error_handling.py::test_circuit_breaker_closed_state -v

# Multiple files
pytest tests/test_memory_store_semantic_search.py tests/test_error_handling.py -v
```

### With Coverage

```bash
# HTML report
pytest tests/ --cov=. --cov-report=html
# Open: htmlcov/index.html

# Terminal report
pytest tests/ --cov=. --cov-report=term-missing

# Enforce minimum coverage
pytest tests/ --cov=. --cov-fail-under=95
```

### Filter by Markers

```bash
# Critical tests only
pytest tests/ -m critical -v

# Skip slow tests
pytest tests/ -m "not slow" -v

# Integration tests only
pytest tests/ -m integration -v

# Performance benchmarks
pytest tests/ -m performance --benchmark-only
```

### Parallel Execution

```bash
# Auto-detect CPU count
pytest tests/ -n auto

# Specific worker count
pytest tests/ -n 4
```

---

## Configuration Files

### pytest.ini
Location: `/home/genesis/genesis-rebuild/pytest.ini`

Key settings:
```ini
[pytest]
asyncio_mode = auto              # Automatic async test detection
testpaths = tests                # Test directory
addopts = -v --tb=short         # Verbose with short tracebacks
reruns = 0                       # No automatic retries (opt-in only)
```

**IMPORTANT:** Plugin disablers (`-p no:asyncio`, `-p no:rerunfailures`) have been **removed** as of October 25, 2025. All plugins now load normally.

### pyproject.toml
Location: `/home/genesis/genesis-rebuild/pyproject.toml`

Defines:
- Project dependencies
- Optional dependency groups (`[test]`, `[dev]`, `[docs]`)
- Tool configurations (black, isort, ruff, mypy)

---

## Test Markers Reference

| Marker | Description | Usage |
|--------|-------------|-------|
| `critical` | Must pass before deployment | `-m critical` |
| `smoke` | Quick smoke tests | `-m smoke` |
| `slow` | Tests >10 seconds | `-m "not slow"` |
| `infrastructure` | Infrastructure layer tests | `-m infrastructure` |
| `orchestration` | HTDAG/HALO/AOP tests | `-m orchestration` |
| `integration` | Multi-component tests | `-m integration` |
| `e2e` | End-to-end tests | `-m e2e` |
| `performance` | Performance benchmarks | `-m performance` |
| `flaky` | May fail due to timing | Auto-retry enabled |
| `asyncio` | Async tests | Auto-detected |

### Example Combinations
```bash
# Critical infrastructure tests
pytest -m "critical and infrastructure" -v

# Non-slow integration tests
pytest -m "integration and not slow" -v

# Layer 1 orchestration only
pytest -m "layer1 and orchestration" -v
```

---

## Retry Logic for Flaky Tests

### Using pytest-rerunfailures
```python
import pytest

@pytest.mark.flaky(reruns=3, reruns_delay=2)
async def test_network_dependent_operation():
    """Retry up to 3 times with 2s delay between attempts"""
    result = await fetch_from_api()
    assert result.status_code == 200
```

### Using Custom Decorator (from conftest.py)
```python
from tests.conftest import retry_with_exponential_backoff

@retry_with_exponential_backoff(max_attempts=3, base_delay=1.0)
async def test_resource_contention():
    """Retry with exponential backoff: 1s, 2s, 4s"""
    result = await compute_intensive_operation()
    assert result.duration < 1.0
```

---

## Common Issues & Solutions

### Issue: "asyncio marker not found"
```
ERROR: 'asyncio' not found in `markers` configuration option
```

**Solution:** Ensure pytest-asyncio is installed:
```bash
pip install pytest-asyncio
```

Check `pytest.ini` doesn't have `-p no:asyncio` directive.

---

### Issue: Import errors (numpy, faiss, etc.)
```
ModuleNotFoundError: No module named 'numpy'
```

**Solution:** Install infrastructure requirements:
```bash
pip install -r requirements_infrastructure.txt
```

---

### Issue: MongoDB/Redis warnings
```
WARNING: MongoDB not available - using in-memory storage
```

**Solution:** This is **expected behavior**. Tests use in-memory fallbacks for isolation. To use real databases:

```bash
# Start MongoDB
docker run -d -p 27017:27017 mongo:latest

# Start Redis
docker run -d -p 6379:6379 redis:latest

# Export connection strings
export MONGODB_URI="mongodb://localhost:27017/genesis"
export REDIS_URL="redis://localhost:6379"
```

---

### Issue: Tests timing out
```
FAILED - Timeout >300.0s
```

**Solution:** Increase timeout in pytest.ini or per-test:
```python
@pytest.mark.timeout(600)  # 10 minutes
async def test_long_running_operation():
    pass
```

---

### Issue: OpenTelemetry logging errors
```
ValueError: I/O operation on closed file
```

**Solution:** This is a **benign cleanup warning**. Tests pass successfully. To suppress:
```bash
pytest tests/ --disable-warnings
```

---

## Test Suite Statistics

**As of October 25, 2025:**

| Metric | Value |
|--------|-------|
| Total Tests | 1,044 |
| Passing | 1,026 (98.28%) |
| Failing | 18 (1.72%) |
| Memory Store Tests | 10 (9 passed, 1 skipped) |
| Hybrid RAG Tests | 54 (100% passed) |
| Error Handling Tests | 28 (100% passed) |
| Agent Integration Tests | 10 (100% passed) |

**Recently Fixed (Oct 25):**
- ✅ test_memory_store_semantic_search.py (10 tests)
- ✅ test_hybrid_rag_retriever.py (54 tests)
- ✅ test_agent_integration_hybrid_rag.py (10 tests)
- ✅ test_error_handling.py (28 tests)

---

## Performance Guidelines

### Target Metrics
- **Unit tests:** <100ms each
- **Integration tests:** <5s each
- **E2E tests:** <30s each
- **Full suite:** <10 minutes

### Optimization Tips
1. Use `pytest-xdist` for parallel execution: `-n auto`
2. Skip slow tests in development: `-m "not slow"`
3. Run specific test files instead of full suite
4. Use `--lf` (last failed) to rerun only failures

---

## CI/CD Integration

Tests run automatically in GitHub Actions (`.github/workflows/ci.yml`).

### CI Test Matrix
- **Code Quality:** Linting, formatting, type checking
- **Security Scan:** Bandit, Safety, Trufflehog
- **Unit Tests:** 4 categories (infrastructure, orchestration, agents, integration)
- **Smoke Tests:** Critical path validation
- **Integration Tests:** E2E scenarios
- **Coverage Analysis:** 95%+ threshold enforced

### Deployment Gate
Tests must meet **95%+ pass rate** before staging/production deployment.

---

## Advanced Usage

### Debug Mode
```bash
# Verbose with local variables in tracebacks
pytest tests/ -vv --showlocals

# Drop into debugger on failure
pytest tests/ --pdb

# Only show failures
pytest tests/ --tb=short -q
```

### Generate Test Reports
```bash
# JUnit XML (for CI)
pytest tests/ --junit-xml=test-results.xml

# HTML report
pytest tests/ --html=report.html --self-contained-html
```

### Profile Test Performance
```bash
# Show slowest 10 tests
pytest tests/ --durations=10

# Benchmark mode
pytest tests/ -m performance --benchmark-only
```

---

## Getting Help

1. **Check documentation:** `/docs/PYTEST_RERUNFAILURES_FIX_REPORT.md`
2. **Pytest docs:** https://docs.pytest.org/
3. **Genesis project status:** `PROJECT_STATUS.md`
4. **Agent assignments:** `AGENT_PROJECT_MAPPING.md`

---

## Recent Updates

**October 25, 2025:**
- ✅ Fixed pytest-rerunfailures plugin conflicts
- ✅ Removed `-p no:asyncio` and `-p no:rerunfailures` from pytest.ini
- ✅ 92 additional tests now passing (memory store, hybrid RAG, error handling)
- ✅ Virtual environment properly configured with all dependencies

**October 19, 2025:**
- ✅ Phase 4 deployment infrastructure complete
- ✅ Feature flags + monitoring setup (42/42 tests passing)
- ✅ Staging validation complete (31/31 tests)

---

**For Questions:** Contact Thon (Python Expert) or review `CLAUDE.md` for agent assignments.
