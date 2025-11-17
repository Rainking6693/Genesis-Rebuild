#!/usr/bin/env bash
set -euo pipefail

while true; do
  clear
  echo "=== OmniDaemon Monitoring ==="
  echo ""
  omnidaemon health || true
  echo ""
  omnidaemon bus stats || true
  echo ""
  echo "=== Agent Metrics ==="
  omnidaemon metrics --topic genesis.idea.generate || true
  omnidaemon metrics --topic genesis.build || true
  omnidaemon metrics --topic genesis.deploy || true
  sleep 5
done
