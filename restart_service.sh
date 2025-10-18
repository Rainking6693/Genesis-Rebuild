#!/bin/bash

# Restart Genesis A2A Service
# Run with: bash restart_service.sh

echo "Restarting Genesis A2A Service..."
sudo systemctl restart genesis-a2a.service

echo "Waiting 3 seconds for service to start..."
sleep 3

echo ""
echo "Service Status:"
sudo systemctl status genesis-a2a.service --no-pager | head -20

echo ""
echo "Checking if service is responding..."
curl -s http://127.0.0.1:8080/a2a/version | jq .

echo ""
echo "Service restart complete."
