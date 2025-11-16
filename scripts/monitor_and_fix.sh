#!/bin/bash
# Real-time monitor for 30-minute test - detects and reports errors

LOG_FILE="logs/thirty_minute_test_live.log"
ERROR_LOG="logs/errors_detected.log"

echo "=== 30-MINUTE PRODUCTION TEST MONITOR ==="
echo "Monitoring: $LOG_FILE"
echo "Started: $(date)"
echo ""

# Monitor for 30 minutes
timeout 1800 tail -f $LOG_FILE 2>/dev/null | while IFS= read -r line; do
    # Detect errors
    if echo "$line" | grep -q "ERROR"; then
        echo "[$(date '+%H:%M:%S')] ❌ ERROR DETECTED: $line" | tee -a $ERROR_LOG
    fi
    
    # Detect warnings
    if echo "$line" | grep -q "WARNING"; then
        echo "[$(date '+%H:%M:%S')] ⚠️  WARNING: $line" | tee -a $ERROR_LOG
    fi
    
    # Show progress
    if echo "$line" | grep -q "Business #"; then
        echo "[$(date '+%H:%M:%S')] ✓ $line"
    fi
    
    # Show successes
    if echo "$line" | grep -q "SUCCESS"; then
        agent=$(echo "$line" | grep -oP '\[\K[^\]]+' | head -1)
        echo "[$(date '+%H:%M:%S')] ✓ $agent completed"
    fi
done

echo ""
echo "=== MONITORING COMPLETE ==="
echo "Errors logged to: $ERROR_LOG"
