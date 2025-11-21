#!/bin/bash
# Monitor MCP Security - Run monitoring and export metrics

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
LOG_FILE="${LOG_FILE:-$PROJECT_ROOT/autonomous_run.log}"
METRICS_PORT="${METRICS_PORT:-9090}"

echo "MCP Security Monitoring"
echo "======================"
echo "Log file: $LOG_FILE"
echo "Metrics port: $METRICS_PORT"
echo ""

# Run monitoring report
echo "Generating security report..."
python3 "$PROJECT_ROOT/infrastructure/monitoring/mcp_metrics.py" > "$PROJECT_ROOT/mcp_security_report.json" 2>&1 || {
    echo "Warning: Could not generate report (log file may not exist yet)"
}

# If Prometheus is available, export metrics
if command -v prometheus &> /dev/null; then
    echo "Prometheus metrics available"
    echo "Access metrics at: http://localhost:$METRICS_PORT/metrics"
else
    echo "Prometheus not installed - metrics export disabled"
fi

echo ""
echo "Monitoring complete. Report saved to: mcp_security_report.json"

