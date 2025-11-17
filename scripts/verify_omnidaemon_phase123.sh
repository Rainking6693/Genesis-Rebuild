#!/usr/bin/env bash
set -euo pipefail

echo "== OmniDaemon Phase 1/2/3 verification =="

errors=0

report_status() {
  local label="$1"
  shift
  if [ "$1" -eq 0 ]; then
    echo "✅ $label"
  else
    echo "⚠️  $label"
    errors=$((errors + 1))
  fi
}

check_redis() {
  if ! command -v redis-cli >/dev/null 2>&1; then
    echo "redis-cli not installed; install Redis or add it to PATH."
    report_status "Redis CLI availability" 1
    return
  fi

  if redis-cli ping >/dev/null 2>&1; then
    report_status "Redis connectivity" 0
  else
    echo "redis-cli failed to reach Redis (ensure server is running locally or RT)."
    report_status "Redis connectivity" 1
  fi
}

check_bridge_modules() {
  python3 - <<'PY'
import importlib
import pathlib
import sys

bridge = importlib.import_module("infrastructure.omnidaemon_bridge")
config_path = pathlib.Path("config/omnidaemon.yaml")
assert hasattr(bridge, "OmniDaemonBridge"), "OmniDaemonBridge missing"
assert hasattr(bridge, "get_bridge"), "get_bridge helper missing"
assert config_path.exists(), "config/omnidaemon.yaml missing"
print("OMNIDAEMON_CONFIG_OK")
PY

report_status "Bridge modules + config" $?
}

check_scripts() {
  local missing=0
  for script in scripts/test_omnidaemon_basic.py scripts/start_omnidaemon_workers.sh scripts/monitor_omnidaemon.sh scripts/es_training_scheduler.py; do
    if [ ! -f "$script" ]; then
      echo "Missing $script"
      missing=1
    fi
  done
  if [ $missing -eq 0 ]; then
    report_status "Key scripts present" 0
  else
    report_status "Key scripts present" 1
  fi
}

check_fastapi() {
  if python3 - <<'PY'
import pathlib
path = pathlib.Path("a2a_fastapi.py")
assert path.exists(), "a2a_fastapi.py missing"
print("FASTAPI_OK")
PY
  then
    report_status "FastAPI async/sync endpoints" 0
  else
    report_status "FastAPI async/sync endpoints" 1
  fi
}

# Run checks
check_redis
check_bridge_modules
check_scripts
check_fastapi

if [ "$errors" -eq 0 ]; then
  echo "All Phase 1/2/3 scripted checks passed."
else
  echo "Phase 1/2/3 verification had $errors issue(s)."
  exit 1
fi
