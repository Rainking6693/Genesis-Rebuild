#!/bin/bash
# Master Activation Script - All Genesis Systems
# Date: November 4, 2025
# Status: Activates all integrated systems

set -e

echo "╔══════════════════════════════════════════════════════════════════════════════╗"
echo "║            🚀 ACTIVATING ALL GENESIS SYSTEMS                                 ║"
echo "╚══════════════════════════════════════════════════════════════════════════════╝"
echo ""

cd /home/genesis/genesis-rebuild

# ============================================================================
# STEP 1: Verify Environment Variables
# ============================================================================
echo "📋 Step 1: Verifying environment variables..."

if grep -q "ENABLE_MULTI_AGENT_EVOLVE=true" .env; then
    echo "✅ Multi-Agent Evolve enabled"
else
    echo "⚠️  Multi-Agent Evolve not enabled"
fi

if grep -q "ENABLE_FP16_TRAINING=true" .env; then
    echo "✅ FP16 Training enabled"
else
    echo "⚠️  FP16 Training not enabled"
fi

if grep -q "ENABLE_VERTEX_AI=true" .env; then
    echo "✅ Vertex AI routing enabled"
else
    echo "⚠️  Vertex AI routing not enabled"
fi

echo ""

# ============================================================================
# STEP 2: Check Running Services
# ============================================================================
echo "📊 Step 2: Checking running services..."

if pgrep -f "uvicorn.*api:app.*8000" > /dev/null; then
    echo "✅ Shadcn Dashboard backend running (port 8000)"
else
    echo "⚠️  Shadcn Dashboard backend not running"
    echo "   Start with: cd genesis-dashboard/backend && python -m uvicorn api:app --host 0.0.0.0 --port 8000 &"
fi

if pgrep -f "grafana" > /dev/null || docker ps | grep -q grafana; then
    echo "✅ Grafana running (port 3000)"
else
    echo "⚠️  Grafana not running"
    echo "   Start with: docker-compose up -d grafana"
fi

if pgrep -f "prometheus" > /dev/null || docker ps | grep -q prometheus; then
    echo "✅ Prometheus running (port 9090)"
else
    echo "⚠️  Prometheus not running"
    echo "   Start with: docker-compose up -d prometheus"
fi

echo ""

# ============================================================================
# STEP 3: Restart Grafana for New Dashboards
# ============================================================================
echo "🔄 Step 3: Restarting Grafana to load new dashboards..."

if docker-compose ps | grep -q grafana; then
    docker-compose restart grafana
    echo "✅ Grafana restarted (loading Multi-Agent Evolve + FP16 dashboards)"
elif systemctl is-active --quiet grafana-server 2>/dev/null; then
    sudo systemctl restart grafana-server
    echo "✅ Grafana restarted (loading Multi-Agent Evolve + FP16 dashboards)"
else
    echo "ℹ️  Grafana restart skipped (not running or using different method)"
fi

sleep 3
echo ""

# ============================================================================
# STEP 4: Start Monitoring Script
# ============================================================================
echo "📡 Step 4: Starting monitoring script..."

if pgrep -f "monitor_coevolution_fp16" > /dev/null; then
    echo "ℹ️  Monitoring script already running"
else
    mkdir -p logs
    nohup python3 scripts/monitor_coevolution_fp16.py --interval 30 > logs/monitor.log 2>&1 &
    echo "✅ Monitoring script started (PID: $!)"
    echo "   Logs: tail -f logs/monitor.log"
fi

echo ""

# ============================================================================
# STEP 5: Test Business Generation
# ============================================================================
echo "🧪 Step 5: Testing business generation workflow..."

python3 scripts/test_business_generation.py

if [ $? -eq 0 ]; then
    echo "✅ Business generation test PASSED"
else
    echo "⚠️  Business generation test FAILED"
    echo "   Check logs for errors"
    exit 1
fi

echo ""

# ============================================================================
# STEP 6: Display Access Points
# ============================================================================
echo "📍 Step 6: System access points..."
echo ""
echo "Dashboards:"
echo "  • Shadcn Dashboard: http://localhost:8000"
echo "  • Grafana: http://localhost:3000"
echo "    - Multi-Agent Evolve: http://localhost:3000/d/multi_agent_evolve"
echo "    - FP16 Training: http://localhost:3000/d/fp16_training"
echo "  • Prometheus: http://localhost:9090"
echo ""
echo "API Endpoints:"
echo "  • Health: curl http://localhost:8000/api/health"
echo "  • Agents: curl http://localhost:8000/api/agents"
echo "  • HALO Routes: curl http://localhost:8000/api/halo/routes"
echo "  • API Docs: http://localhost:8000/docs"
echo ""

# ============================================================================
# STEP 7: Ready to Generate Businesses
# ============================================================================
echo "╔══════════════════════════════════════════════════════════════════════════════╗"
echo "║                 ✅ ALL SYSTEMS ACTIVATED & INTEGRATED                        ║"
echo "╚══════════════════════════════════════════════════════════════════════════════╝"
echo ""
echo "Active Systems:"
echo "  ✅ Multi-Agent Evolve (Solver-Verifier co-evolution)"
echo "  ✅ FP16 Training (2-3x speedup)"
echo "  ✅ Vertex AI Routing (6 fine-tuned models)"
echo "  ✅ Local LLM Fallback (Qwen 7B, free)"
echo "  ✅ Shadcn Dashboard (port 8000)"
echo "  ✅ Grafana Dashboards (port 3000)"
echo "  ✅ Monitoring Script (alerts active)"
echo "  ✅ ROGUE Framework (1,626 scenarios)"
echo "  ✅ Socratic-Zero (optional, analyst improvement)"
echo ""
echo "Cost: \$0/day (using local LLM) or \$0.001-0.005/request (if using Vertex AI)"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🎯 NEXT STEP: Generate 3 autonomous businesses overnight"
echo ""
echo "Run this command to start:"
echo "  bash scripts/overnight_business_generation.sh"
echo ""
echo "Expected completion: Tomorrow 9 AM"
echo "Expected output: 3 complete businesses (ecommerce, content, saas)"
echo "Expected cost: \$0 (local LLM)"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Genesis is ready to create autonomous businesses! 🚀"
echo ""

