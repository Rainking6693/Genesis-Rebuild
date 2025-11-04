# Manual Systemd Service Installation

The automated deployment requires sudo access. Please run these commands manually:

## Installation Steps (5 minutes)

```bash
# 1. Copy service file to systemd directory
sudo cp /home/genesis/genesis-rebuild/infrastructure/llama-3-1-8b-server.service /etc/systemd/system/

# 2. Reload systemd daemon
sudo systemctl daemon-reload

# 3. Enable service (auto-start on boot)
sudo systemctl enable llama-3-1-8b-server

# 4. Start service
sudo systemctl start llama-3-1-8b-server

# 5. Check status
sudo systemctl status llama-3-1-8b-server

# 6. View logs
sudo journalctl -u llama-3-1-8b-server -f
```

## Verification

```bash
# Test health endpoint
curl http://127.0.0.1:8002/health

# Test completion endpoint
curl -X POST http://127.0.0.1:8002/v1/completions \
  -H "Content-Type: application/json" \
  -d '{"prompt":"What is 2+2?","max_tokens":50}'
```

## Expected Result

Service should be:
- **Status:** active (running)
- **Memory:** ~8-9GB
- **Port:** 8002 (localhost only)
- **Auto-restart:** enabled

## Troubleshooting

If service fails:
```bash
# Check logs for errors
sudo journalctl -u llama-3-1-8b-server -xe

# Common fixes:
# - Model path: Ensure /home/genesis/llama-3-1-8b-instruct-q4_k_m.gguf exists
# - Port conflict: Check if port 8002 in use: lsof -i :8002
# - Permissions: Ensure genesis user owns the model file
```

## Current Workaround

The server is currently running in the background via nohup:
```bash
# Check if running
ps aux | grep local_inference_server

# View logs
tail -f /tmp/llm_server.log

# Stop if needed
pkill -f local_inference_server
```

Once systemd service is installed, it will auto-restart on crash and start on boot.
