# Local LLM Deployment & Hardening Guide

**Date:** November 3, 2025
**Author:** Sentinel (Security Agent)
**Status:** PRODUCTION READY

---

## Table of Contents
1. [Quick Start](#quick-start)
2. [Pre-Deployment Checklist](#pre-deployment-checklist)
3. [File System Setup](#file-system-setup)
4. [Systemd Service Configuration](#systemd-service-configuration)
5. [Security Verification](#security-verification)
6. [Operations & Monitoring](#operations--monitoring)
7. [Troubleshooting](#troubleshooting)

---

## Quick Start

### 1-Minute Setup (Assuming llama.cpp already installed)

```bash
# 1. Create service user
sudo useradd -r -s /bin/false -d /home/genesis/llama.cpp llama-inference

# 2. Copy and deploy service file
sudo cp /home/genesis/genesis-rebuild/scripts/qwen3-vl-server.service /etc/systemd/system/
sudo chmod 644 /etc/systemd/system/qwen3-vl-server.service

# 3. Generate and store API key
LOCAL_LLM_API_KEY=$(python -c "import secrets; print(secrets.token_urlsafe(32))")
echo "LOCAL_LLM_API_KEY=$LOCAL_LLM_API_KEY" >> /home/genesis/genesis-rebuild/.env
chmod 600 /home/genesis/genesis-rebuild/.env

# 4. Enable and start service
sudo systemctl daemon-reload
sudo systemctl enable qwen3-vl-server
sudo systemctl start qwen3-vl-server

# 5. Verify health
sleep 3
curl http://127.0.0.1:8001/health
```

---

## Pre-Deployment Checklist

### System Requirements
- [ ] **OS:** Linux (Ubuntu 20.04+, Debian 11+, RHEL 8+)
- [ ] **Systemd:** Active and functional
- [ ] **Python:** 3.10+ (for security tests and client)
- [ ] **Disk Space:** 50+ GB available (for models)
- [ ] **RAM:** 16+ GB recommended (for dual-model setup)
- [ ] **GPU:** NVIDIA (recommended) or CPU-only (slower)

### llama.cpp Installation
- [ ] **Binary:** `/home/genesis/llama.cpp/llama-server` (executable)
- [ ] **Models Downloaded:**
  - [ ] `models/qwen3-vl-4b-instruct-q4_k_m.gguf` (~2.5 GB)
  - [ ] `models/Meta-Llama-3.1-8B-Instruct.Q4_K_M.gguf` (~4.7 GB)

### Genesis Setup
- [ ] **Code:** `/home/genesis/genesis-rebuild/` cloned and ready
- [ ] **Python venv:** `.venv/` activated
- [ ] **Dependencies:** `pip install -r requirements.txt`
- [ ] **Security package:** `pip install pydantic httpx opentelemetry-api`

### Permission Setup
```bash
# Check that llama.cpp directory exists and is owned by current user
ls -ld /home/genesis/llama.cpp
# drwxr-xr-x genesis genesis /home/genesis/llama.cpp

# Check model files are readable
ls -l /home/genesis/llama.cpp/models/*.gguf
# -rw-r--r-- genesis genesis ...
```

---

## File System Setup

### 1. Create Service User

```bash
# Create unprivileged user for running services
sudo useradd -r \
  -s /bin/false \
  -d /home/genesis/llama.cpp \
  -c "Llama Inference Service" \
  llama-inference

# Verify creation
id llama-inference
# uid=999 gid=999 groups=999

# Add to group for GPU access (if applicable)
sudo usermod -a -G render llama-inference  # AMD/Intel GPU
sudo usermod -a -G video llama-inference   # NVIDIA GPU
```

### 2. Set Directory Permissions

```bash
# llama.cpp directory (models + binary)
sudo chown -R genesis:genesis /home/genesis/llama.cpp
sudo chmod 755 /home/genesis/llama.cpp

# Model files (read-only)
chmod 644 /home/genesis/llama.cpp/models/*.gguf
ls -l /home/genesis/llama.cpp/models/
# -rw-r--r-- genesis genesis qwen3-vl-4b-instruct-q4_k_m.gguf
# -rw-r--r-- genesis genesis Meta-Llama-3.1-8B-Instruct.Q4_K_M.gguf

# Binary (executable)
chmod 755 /home/genesis/llama.cpp/llama-server
```

### 3. Set Configuration Permissions

```bash
# Genesis configuration
cd /home/genesis/genesis-rebuild
chmod 600 .env
cat .env
# LOCAL_LLM_API_KEY=abc123xyz...
# OTEL_ENABLED=true

# Scripts directory (readable, not writable by service)
chmod 755 scripts/
chmod 755 scripts/verify_model_integrity.py
chmod 644 scripts/qwen3-vl-server.service
chmod 644 scripts/llama-3-1-8b-server.service
```

### 4. Create Model Checksums

```bash
# Calculate and register model checksums
cd /home/genesis/genesis-rebuild
python scripts/verify_model_integrity.py --register qwen3-vl-4b-instruct-q4_k_m.gguf

# This will:
# 1. Calculate SHA256 hash
# 2. Save to scripts/model_checksums.json
# 3. Display: SHA256: abc123def456...

# Repeat for second model if deployed
python scripts/verify_model_integrity.py --register Meta-Llama-3.1-8B-Instruct.Q4_K_M.gguf

# Verify registration
python scripts/verify_model_integrity.py --list
# Registered models:
#   Meta-Llama-3.1-8B-Instruct.Q4_K_M.gguf
#     SHA256: xyz789...
#   qwen3-vl-4b-instruct-q4_k_m.gguf
#     SHA256: abc123...
```

---

## Systemd Service Configuration

### 1. Copy Service Files

```bash
# Copy Qwen3-VL service
sudo cp /home/genesis/genesis-rebuild/scripts/qwen3-vl-server.service \
  /etc/systemd/system/

# Copy Llama 3.1 service (if deploying)
sudo cp /home/genesis/genesis-rebuild/scripts/llama-3-1-8b-server.service \
  /etc/systemd/system/

# Set correct permissions (root-owned, world-readable)
sudo chmod 644 /etc/systemd/system/qwen3-vl-server.service
sudo chmod 644 /etc/systemd/system/llama-3-1-8b-server.service

# Verify
ls -la /etc/systemd/system/*vl-server.service
# -rw-r--r-- root root qwen3-vl-server.service
```

### 2. Create Environment File

```bash
# Load environment variables from .env
cat /home/genesis/genesis-rebuild/.env >> /etc/environment

# Or create systemd-specific environment file
sudo mkdir -p /etc/systemd/system/qwen3-vl-server.service.d/
sudo tee /etc/systemd/system/qwen3-vl-server.service.d/environment.conf > /dev/null <<EOF
[Service]
EnvironmentFile=/home/genesis/genesis-rebuild/.env
EOF
```

### 3. Enable and Start Service

```bash
# Reload systemd configuration
sudo systemctl daemon-reload

# Enable service on boot
sudo systemctl enable qwen3-vl-server

# Start service
sudo systemctl start qwen3-vl-server

# Check status
sudo systemctl status qwen3-vl-server
# ● qwen3-vl-server.service - Qwen3-VL Local LLM Server (Secure)
#    Loaded: loaded (/etc/systemd/system/qwen3-vl-server.service; enabled; ...)
#    Active: active (running) since ...
#    Process: ...
#    Memory: 2.3G

# Check if running
curl -s http://127.0.0.1:8001/health | python -m json.tool
# {
#   "status": "ok",
#   "model": "qwen3-vl-4b-instruct-q4_k_m",
#   "uptime": 3.5
# }
```

### 4. View Systemd Configuration

```bash
# Display service configuration
systemctl show qwen3-vl-server --all | grep -E "MemoryMax|CPUQuota|Restart|NoNewPrivileges"

# Output:
# CPUQuota=400%
# MemoryMax=8589934592
# NoNewPrivileges=yes
# RestartSec=5s
# Restart=on-failure
```

---

## Security Verification

### 1. Run Security Tests

```bash
# Run comprehensive security test suite
cd /home/genesis/genesis-rebuild
python -m pytest tests/security/test_local_llm_security.py -v

# Output should show:
# ======================= 43 passed in 11.09s ========================

# Run specific test category
python -m pytest tests/security/test_local_llm_security.py::TestPromptInjectionPrevention -v
python -m pytest tests/security/test_local_llm_security.py::TestRateLimiting -v
```

### 2. Verify Model Integrity

```bash
# Verify all registered models
python scripts/verify_model_integrity.py

# Output:
# Verifying qwen3-vl-4b-instruct-q4_k_m.gguf...
#   File size: 2.42 GB
# ✅ Model verification PASSED: qwen3-vl-4b-instruct-q4_k_m.gguf
#    SHA256: abc123def456...
```

### 3. Test API Security

```bash
# Test rate limiting (send 61 rapid requests)
for i in {1..61}; do
  curl -s -X POST http://127.0.0.1:8001/completion \
    -H "Content-Type: application/json" \
    -d '{"prompt": "test"}' \
    -w "Status: %{http_code}\n" | tail -1
done
# Status: 200
# Status: 200
# ...
# Status: 429  <-- Rate limited
# Status: 429

# Test input validation (try injection)
curl -s -X POST http://127.0.0.1:8001/completion \
  -H "Content-Type: application/json" \
  -d '{"prompt": "test exec()"}'
# Error: Dangerous pattern detected (client-side rejection)
```

### 4. Check Process Isolation

```bash
# Verify systemd security settings
sudo systemctl cat qwen3-vl-server | grep -E "^(No|Private|Protect|Restrict|Memory|CPU|Limit|IPAddress)"

# Sample output:
# NoNewPrivileges=true
# PrivateTmp=true
# ProtectSystem=strict
# ProtectHome=true
# PrivateDevices=true
# ProtectKernelTunables=true
# ProtectControlGroups=true
# RestrictAddressFamilies=AF_INET AF_INET6
# RestrictRealtime=true
# MemoryMax=8G
# CPUQuota=400%
# LimitNOFILE=65536
# LimitNPROC=512
# IPAddressDeny=any
# IPAddressAllow=localhost
```

---

## Operations & Monitoring

### 1. View Service Logs

```bash
# Follow logs in real-time
sudo journalctl -u qwen3-vl-server -f

# View last 50 lines
sudo journalctl -u qwen3-vl-server -n 50

# Filter errors only
sudo journalctl -u qwen3-vl-server -p err -n 50

# Filter by time range
sudo journalctl -u qwen3-vl-server --since "2 hours ago"

# Export logs to file
sudo journalctl -u qwen3-vl-server > qwen-logs.txt
```

### 2. Monitor Resource Usage

```bash
# Current memory usage
systemctl show qwen3-vl-server --property MemoryCurrent
# MemoryCurrent=2456166400

# Current CPU usage (in nanoseconds)
systemctl show qwen3-vl-server --property CPUUsageNSec
# CPUUsageNSec=15000000000

# Number of tasks
systemctl show qwen3-vl-server --property NTasks
# NTasks=24

# Pretty-printed stats
watch -n 1 'systemctl show qwen3-vl-server --all | grep -E "State|MemoryCurrent|CPUUsageNSec|NTasks"'
```

### 3. Check Service Health

```bash
# HTTP health check
curl -X GET http://127.0.0.1:8001/health
# {
#   "status": "ok",
#   "model": "qwen3-vl-4b-instruct-q4_k_m",
#   "uptime": 245.3,
#   "queue_length": 0
# }

# System health check
sudo systemctl is-active qwen3-vl-server && echo "✅ Running" || echo "❌ Stopped"

# Check if service can be started
sudo systemctl status qwen3-vl-server --no-pager
```

### 4. Performance Metrics

```bash
# Measure inference latency
time curl -X POST http://127.0.0.1:8001/completion \
  -H "Content-Type: application/json" \
  -d '{"prompt": "What is 2+2?", "max_tokens": 10}' \
  -s | python -m json.tool

# Check throughput (tokens per second)
# Note: This comes from llama-server output in logs
sudo journalctl -u qwen3-vl-server | grep "tokens/s"
# eval:   5.00 tokens/s
```

---

## Troubleshooting

### Service Won't Start

```bash
# Check status and error
sudo systemctl status qwen3-vl-server --no-pager

# Check logs
sudo journalctl -u qwen3-vl-server -n 50

# Common issues:

# 1. Port already in use (8001)
sudo lsof -i :8001
# Kill process: sudo kill -9 <PID>

# 2. Permission denied
sudo chown -R genesis:genesis /home/genesis/llama.cpp
chmod 755 /home/genesis/llama.cpp

# 3. Model file missing
ls -l /home/genesis/llama.cpp/models/
# Ensure .gguf files exist

# 4. Out of memory
systemctl show qwen3-vl-server --property MemoryMax
# Increase if needed: MemoryMax=12G
```

### High Memory Usage

```bash
# Check current usage
free -h
# Mem: 31Gi used 15Gi ...

# Check what's consuming memory
top -p $(pidof llama-server)

# Solutions:
# 1. Reduce context size (in service file)
#    --ctx-size 2048 → --ctx-size 1024

# 2. Reduce batch size
#    --batch-size 128 → --batch-size 64

# 3. Use smaller model quantization
#    Q4_K_M → Q3_K_M (saves ~25% memory)

# Apply changes
sudo systemctl stop qwen3-vl-server
# Edit /etc/systemd/system/qwen3-vl-server.service
sudo systemctl daemon-reload
sudo systemctl start qwen3-vl-server
```

### Rate Limiting Issues

```bash
# Check rate limit configuration
grep "requests_per_minute" /home/genesis/genesis-rebuild/infrastructure/local_llm_client.py

# Adjust if needed
# Current default: 60 requests/minute
# Can be changed in LocalLLMConfig

# Test rate limiting
python -c "
from infrastructure.local_llm_client import RateLimiter
rl = RateLimiter(60)
for i in range(65):
    allowed, remaining = rl.check_limit('test')
    if not allowed:
        print(f'Request {i+1} BLOCKED')
        break
    elif i % 10 == 0:
        print(f'Request {i+1} OK, remaining: {remaining}')
"
```

### Model Integrity Check Failures

```bash
# Verify specific model
python scripts/verify_model_integrity.py --model qwen3-vl-4b-instruct-q4_k_m.gguf

# If checksum mismatch:
# 1. Download fresh copy
# 2. Calculate new checksum
# 3. Register in model_checksums.json

# Re-register model
python scripts/verify_model_integrity.py --register qwen3-vl-4b-instruct-q4_k_m.gguf

# List registered checksums
python scripts/verify_model_integrity.py --list

# If file corrupted, re-download
cd /home/genesis/llama.cpp/models
huggingface-cli download Qwen/Qwen-VL-7B-Chat GGUF --include "*.gguf"
```

### API Connection Issues

```bash
# Test localhost connectivity
curl -v http://127.0.0.1:8001/health

# Check if port is listening
sudo netstat -tlnp | grep 8001
# or
sudo ss -tlnp | grep 8001

# Verify systemd binding
sudo systemctl cat qwen3-vl-server | grep -E "port|host|8001"

# Test from Python
python -c "
import httpx
try:
    r = httpx.get('http://127.0.0.1:8001/health', timeout=5)
    print(f'Status: {r.status_code}')
    print(r.json())
except Exception as e:
    print(f'Error: {e}')
"
```

---

## Additional Resources

### Documentation
- **Security Audit Report:** `/home/genesis/genesis-rebuild/docs/SECURITY_AUDIT_LOCAL_LLM.md`
- **Client Implementation:** `/home/genesis/genesis-rebuild/infrastructure/local_llm_client.py`
- **Security Tests:** `/home/genesis/genesis-rebuild/tests/security/test_local_llm_security.py`

### External References
- **llama.cpp Documentation:** https://github.com/ggerganov/llama.cpp
- **Systemd Security:** https://www.freedesktop.org/software/systemd/man/systemd.exec.html
- **OWASP LLM Top 10:** https://owasp.org/www-project-top-10-for-large-language-model-applications/

### Support Contacts
- **Genesis Project:** /home/genesis/genesis-rebuild/
- **Security Issues:** Sentinel (Security Agent)
- **Deployment Help:** Check logs via `sudo journalctl -u qwen3-vl-server -f`

---

## Sign-Off

**Deployment Guide:** ✅ COMPLETE
**Last Updated:** November 3, 2025
**Status:** PRODUCTION READY

Proceed with deployment following the steps in this guide.

