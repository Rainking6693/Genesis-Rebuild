# Local LLM Health Monitoring

**P1-3 Fix: Automated health checks and service recovery**

## Overview

This health monitoring system ensures Local LLM servers (Llama 3.2 Vision, Qwen2.5-VL) are always running and automatically restarts them if they fail.

## Components

### 1. Health Check Script
**Location**: `/home/genesis/genesis-rebuild/scripts/check_llm_health.sh`

**Features**:
- Checks Llama 3.2 Vision server (port 8001)
- Checks Qwen2.5-VL server (ports 8002/8003)
- 3 retry attempts with 2-second delays
- Automatic service restart on failure
- Detailed logging to `/var/log/llm_health_check.log`

**Manual Usage**:
```bash
# Run health check manually
/home/genesis/genesis-rebuild/scripts/check_llm_health.sh

# Check logs
tail -f /var/log/llm_health_check.log
```

### 2. Systemd Service
**Location**: `/home/genesis/genesis-rebuild/systemd/llm-health-check.service`

**Purpose**: Runs the health check script as a systemd service

### 3. Systemd Timer
**Location**: `/home/genesis/genesis-rebuild/systemd/llm-health-check.timer`

**Schedule**: Every 5 minutes (configurable)

## Installation

### Option 1: Systemd Timer (Recommended)

```bash
# Copy systemd files to system directory
sudo cp systemd/llm-health-check.service /etc/systemd/system/
sudo cp systemd/llm-health-check.timer /etc/systemd/system/

# Reload systemd daemon
sudo systemctl daemon-reload

# Enable and start the timer
sudo systemctl enable llm-health-check.timer
sudo systemctl start llm-health-check.timer

# Check timer status
sudo systemctl status llm-health-check.timer

# View recent health checks
sudo journalctl -u llm-health-check.service -n 50
```

### Option 2: Cron Job (Alternative)

```bash
# Add to crontab (runs every 5 minutes)
crontab -e

# Add this line:
*/5 * * * * /home/genesis/genesis-rebuild/scripts/check_llm_health.sh || true
```

## Configuration

### Adjust Check Frequency

**Systemd Timer** (edit `llm-health-check.timer`):
```ini
[Timer]
# Run every 10 minutes instead of 5
OnUnitActiveSec=10min
```

**Cron**:
```bash
# Every 10 minutes
*/10 * * * * /home/genesis/genesis-rebuild/scripts/check_llm_health.sh

# Every 2 minutes
*/2 * * * * /home/genesis/genesis-rebuild/scripts/check_llm_health.sh
```

### Adjust Timeout

Edit `scripts/check_llm_health.sh`:
```bash
# Change timeout (seconds)
TIMEOUT=10

# Change max retries
MAX_RETRIES=5
```

### Change Ports

Edit `scripts/check_llm_health.sh`:
```bash
# Update port numbers
LLAMA_PORT=8001
QWEN_PORT_PRIMARY=8002
QWEN_PORT_FALLBACK=8003
```

## Monitoring

### View Real-Time Logs

**Systemd**:
```bash
# Follow health check logs
sudo journalctl -u llm-health-check.service -f

# View last 100 entries
sudo journalctl -u llm-health-check.service -n 100

# View logs from last hour
sudo journalctl -u llm-health-check.service --since "1 hour ago"
```

**Log File**:
```bash
# Follow log file
tail -f /var/log/llm_health_check.log

# View last 50 lines
tail -n 50 /var/log/llm_health_check.log
```

### Check Timer Status

```bash
# View timer details
sudo systemctl status llm-health-check.timer

# List all timers
systemctl list-timers

# Show next execution time
systemctl list-timers --all | grep llm-health
```

### Test Health Check

```bash
# Run manually (immediate)
sudo systemctl start llm-health-check.service

# Check exit status
echo $?  # 0 = success, 1 = failure

# View output
sudo journalctl -u llm-health-check.service -n 20
```

## Troubleshooting

### Health Check Fails

**Check if services are running**:
```bash
sudo systemctl status llama-vision-server
sudo systemctl status qwen3-vl-server
```

**Check ports manually**:
```bash
# Check if ports are listening
nc -zv 127.0.0.1 8001
nc -zv 127.0.0.1 8002
nc -zv 127.0.0.1 8003

# Check with curl
curl -v http://127.0.0.1:8001/health
curl -v http://127.0.0.1:8002/health
```

### Service Restart Fails

**Check systemd logs**:
```bash
sudo journalctl -xe

# Check specific service logs
sudo journalctl -u llama-vision-server -n 50
sudo journalctl -u qwen3-vl-server -n 50
```

**Restart manually**:
```bash
sudo systemctl restart llama-vision-server
sudo systemctl restart qwen3-vl-server
```

### Timer Not Running

**Check timer status**:
```bash
sudo systemctl status llm-health-check.timer

# If inactive, enable and start
sudo systemctl enable llm-health-check.timer
sudo systemctl start llm-health-check.timer
```

**Reload systemd**:
```bash
sudo systemctl daemon-reload
```

## Alert Integration (Optional)

### Email Alerts

Add to `scripts/check_llm_health.sh`:
```bash
# Send email on failure
send_alert() {
    echo "LLM Health Check Failed: $1" | mail -s "LLM Health Alert" admin@example.com
}

# Call in main function
if [ $llama_ok -ne 0 ] || [ $qwen_ok -ne 0 ]; then
    send_alert "Llama: $llama_ok, Qwen: $qwen_ok"
fi
```

### Slack/Discord Webhooks

```bash
# Send Slack notification
send_slack() {
    curl -X POST -H 'Content-type: application/json' \
        --data "{\"text\":\"LLM Health Check Failed: $1\"}" \
        https://hooks.slack.com/services/YOUR/WEBHOOK/URL
}
```

### Prometheus Alertmanager

See P1-4 Prometheus Metrics documentation for integration with Alertmanager.

## Performance Impact

- **CPU**: Negligible (<0.1% during check)
- **Memory**: ~2MB per check
- **Network**: ~1KB per health check request
- **Disk**: Log file grows ~10KB/day (rotated by logrotate)

## Security

### Permissions

```bash
# Script should be readable by health check user
chmod 755 /home/genesis/genesis-rebuild/scripts/check_llm_health.sh

# Log file should be writable
sudo mkdir -p /var/log
sudo touch /var/log/llm_health_check.log
sudo chown genesis:genesis /var/log/llm_health_check.log
```

### Systemd Service Hardening

The service includes:
- `NoNewPrivileges=true` - Prevents privilege escalation
- `PrivateTmp=true` - Isolated /tmp
- `ProtectSystem=strict` - Read-only system directories
- `ProtectHome=read-only` - Read-only home directories
- `ReadWritePaths=/var/log` - Only logs are writable

## Related Documentation

- Hudson's Audit: `PHASE_4_LOCAL_LLM_AUDIT_HUDSON.md` (P1 issues)
- Local LLM Client: `infrastructure/local_llm_client.py`
- Hybrid LLM Client: `infrastructure/hybrid_llm_client.py` (P1-1 fix)
- Prometheus Metrics: `docs/LOCAL_LLM_PROMETHEUS_METRICS.md` (P1-4, coming soon)

## Status

✅ **P1-3 COMPLETE** (November 3, 2025)
- Health check script created
- Systemd service and timer configured
- Documentation complete
- Ready for deployment
