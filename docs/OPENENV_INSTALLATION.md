# OpenEnv Installation Guide

**Version:** 1.0
**Date:** October 25, 2025
**Author:** Alex (E2E Testing Specialist)
**Issue:** #10 - Install Playwright and Supabase SDKs for OpenEnv health counting

## Overview

OpenEnv is the External-Tool Agent Wrapper that enables Genesis agents to interact with external tools like web browsers (Playwright) and databases (Supabase) through a self-play learning interface. This guide covers installation and setup for OpenEnv dependencies.

## Dependencies

OpenEnv requires two main SDKs:

1. **Playwright** (>=1.40.0) - Browser automation for web testing
2. **Supabase** (>=2.0.0) - Database operations and real-time subscriptions

## Installation Methods

### Method 1: Using pyproject.toml (Recommended)

OpenEnv dependencies are defined as optional extras in `pyproject.toml`:

```bash
# Install OpenEnv dependencies
pip install -e ".[openenv]"

# Install Playwright browsers
playwright install chromium
```

### Method 2: Manual Installation

If you need to install dependencies manually:

```bash
# Install Playwright SDK
pip install "playwright>=1.40.0"

# Install Supabase SDK
pip install "supabase>=2.0.0"

# Install Playwright browsers (required for browser automation)
playwright install chromium
```

### Method 3: CI/CD Environment

For GitHub Actions workflows, dependencies are installed automatically:

```yaml
- name: Install dependencies
  run: |
    python -m pip install --upgrade pip
    pip install -r requirements_infrastructure.txt
    pip install -r requirements_app.txt
    pip install playwright supabase
    playwright install chromium
```

## Browser Setup

Playwright requires browser binaries to be installed separately:

```bash
# Install Chromium (default, recommended)
playwright install chromium

# Or install all browsers
playwright install

# Or install specific browsers
playwright install firefox webkit
```

**Browser locations:**
- Linux: `~/.cache/ms-playwright/`
- macOS: `~/Library/Caches/ms-playwright/`
- Windows: `%USERPROFILE%\AppData\Local\ms-playwright\`

## Headless Mode

By default, OpenEnv runs browsers in headless mode (no GUI) for CI/CD compatibility:

```python
from infrastructure.openenv_wrapper import PlaywrightEnv

# Headless mode (default)
env = PlaywrightEnv(goal="Navigate to example.com", headless=True)

# With GUI (for debugging)
env = PlaywrightEnv(goal="Navigate to example.com", headless=False)
```

## Verification

Verify installation by running OpenEnv tests:

```bash
# Run all OpenEnv tests
pytest tests/test_openenv.py tests/test_openenv_e2e.py -v

# Run specific test groups
pytest tests/test_openenv.py -k "Playwright" -v
pytest tests/test_openenv.py -k "Supabase" -v
```

**Expected results:**
- 30 unit tests (test_openenv.py)
- 12 E2E tests (test_openenv_e2e.py)
- Total: 42 tests

## Test Status (October 25, 2025)

After installation:
- ✅ **38/42 tests passing (90.5%)**
- ❌ 4 tests failing:
  - 1 assertion mismatch (reward calculation)
  - 3 missing `agent_framework` module dependencies

## Configuration

### Environment Variables

OpenEnv tests can be configured via environment variables:

```bash
# Playwright configuration
export PLAYWRIGHT_BROWSERS_PATH=~/.cache/ms-playwright
export PLAYWRIGHT_HEADLESS=true

# Supabase configuration (for real integration tests)
export SUPABASE_URL=https://your-project.supabase.co
export SUPABASE_KEY=your-anon-key
```

### Test Markers

OpenEnv tests use pytest markers for selective execution:

```bash
# Skip slow tests
pytest -m "not slow"

# Run only slow tests
pytest -m "slow"

# Skip E2E tests
pytest tests/test_openenv.py
```

## Troubleshooting

### Issue: ModuleNotFoundError: playwright

**Solution:**
```bash
pip install playwright
playwright install chromium
```

### Issue: ModuleNotFoundError: supabase

**Solution:**
```bash
pip install supabase
```

### Issue: Browser not found

**Solution:**
```bash
# Reinstall browser binaries
playwright install chromium --force
```

### Issue: Permission denied (Linux)

**Solution:**
```bash
# Install browser dependencies
sudo apt-get install -y \
  libgstreamer-plugins-base1.0-0 \
  libgstreamer1.0-0 \
  libenchant-2-2 \
  libsecret-1-0 \
  libhyphen0 \
  libgdk-pixbuf2.0-0 \
  libegl1 \
  libnotify4 \
  libxslt1.1 \
  libevent-2.1-7 \
  libgles2 \
  libvpx7 \
  libxcomposite1 \
  libatk1.0-0 \
  libatk-bridge2.0-0 \
  libepoxy0 \
  libgtk-3-0 \
  libharfbuzz-icu0
```

### Issue: Tests still skipped

**Cause:** pytest.importorskip() skips tests if modules aren't installed.

**Solution:** Ensure both Playwright and Supabase are installed in the active Python environment.

## Integration with Genesis Agents

OpenEnv is integrated with the following agents:

1. **QA Agent** - `test_web_feature()` for automated web testing
2. **Builder Agent** - `deploy_to_cloud()` for deployment automation
3. **Support Agent** - `reproduce_customer_issue()` for bug reproduction

Each agent has an `env_agent` attribute for OpenEnv operations:

```python
from agents.qa_agent import QAAgent

qa_agent = QAAgent(business_id="test")
result = await qa_agent.test_web_feature(
    feature_url="https://example.com/login",
    test_goal="Login with credentials"
)
```

## Performance Considerations

### Browser Performance

- Chromium binary: ~174 MB download
- Memory usage: ~150-300 MB per browser instance
- Startup time: 2-5 seconds per browser launch

### Optimization Tips

1. **Reuse browser instances:** Don't create new browsers for every test
2. **Use headless mode:** 30-50% faster than headed mode
3. **Disable images:** Set `--disable-images` for faster page loads
4. **Parallel execution:** Run multiple browsers concurrently with asyncio

## CI/CD Integration

OpenEnv is integrated into Genesis CI/CD pipeline:

- **Unit Tests Job:** Installs Playwright/Supabase dependencies
- **Integration Tests Job:** Installs Playwright/Supabase dependencies
- **Coverage Job:** Installs Playwright/Supabase dependencies

**Workflow files updated:**
- `.github/workflows/test-suite.yml`

## Health Metrics

OpenEnv tests now count toward system health metrics:

- **Before:** Tests skipped, not counted
- **After:** 42 tests counted (38 passing, 4 failing)

**Impact on overall metrics:**
- Previous: 227/229 tests (99.1%)
- With OpenEnv: 265/271 tests (97.8%)

## Next Steps

1. **Fix failing tests:**
   - Update reward assertion in `test_playwright_real_browser_navigation`
   - Install `agent_framework` module for agent integration tests

2. **Optional enhancements:**
   - Add Firefox/WebKit support
   - Add Supabase real-time subscriptions
   - Add screenshot comparison tests
   - Add performance benchmarks

## Related Documentation

- [OpenEnv Wrapper Source](/infrastructure/openenv_wrapper.py)
- [Environment Learning Agent](/infrastructure/env_learning_agent.py)
- [Testing Standards](/TESTING_STANDARDS_UPDATE_SUMMARY.md)
- [Issue #10](https://github.com/genesis-rebuild/issues/10)

## Support

For issues or questions:
- Check [Troubleshooting](#troubleshooting) section
- Review test output: `pytest -v --tb=short`
- Open GitHub issue with full error traceback

---

**Last Updated:** October 25, 2025
**Status:** ✅ Installation Complete, 38/42 tests passing
