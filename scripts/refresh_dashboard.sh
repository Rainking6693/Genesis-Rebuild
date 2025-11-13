#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

if [[ -f "$ROOT_DIR/.env" ]]; then
  # shellcheck disable=SC2046,SC1090
  set -a
  source "$ROOT_DIR/.env"
  set +a
fi

source "$ROOT_DIR/venv/bin/activate"

./venv/bin/python scripts/export_dashboard_metrics.py

PYTHONANYWHERE_USERNAME="${PYTHONANYWHERE_USERNAME:-rainking632}"
if [[ -z "${PYTHONANYWHERE_TOKEN:-}" ]]; then
  echo "PYTHONANYWHERE_TOKEN is not set; cannot deploy dashboard." >&2
  exit 1
fi

./venv/bin/python scripts/deploy_pythonanywhere_dashboard.py \
  --username "$PYTHONANYWHERE_USERNAME" \
  --domain "${PYTHONANYWHERE_DOMAIN:-${PYTHONANYWHERE_USERNAME}.pythonanywhere.com}" \
  --remote-dir "${PYTHONANYWHERE_REMOTE_DIR:-/home/${PYTHONANYWHERE_USERNAME}/genesis_dashboard}"
