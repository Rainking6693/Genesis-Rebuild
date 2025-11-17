#!/usr/bin/env bash
set -euo pipefail

# Start a group of OmniDaemon workers for production/hybrid deployments.
WORKER_COUNT=${1:-5}
CONFIG_FILE="config/omnidaemon.yaml"

if [[ ! -f "$CONFIG_FILE" ]]; then
  echo "Configuration file $CONFIG_FILE not found."
  exit 1
fi

echo "Starting $WORKER_COUNT OmniDaemon workers..."
for i in $(seq 1 "$WORKER_COUNT"); do
  log_file="logs/omnidaemon_worker_${i}.log"
  omnidaemon runner start \
    --config "$CONFIG_FILE" \
    --worker-id "worker_$i" \
    --log-file "$log_file" \
    &>/dev/null &
  echo "  Worker worker_$i -> log=$log_file"
done

echo "All workers started."
