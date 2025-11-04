#!/bin/bash
# Quick Start Script: Set Up Grafana + shadcn Monitoring
# Run this Thursday morning to set up both monitoring dashboards

set -e

echo "════════════════════════════════════════════════════════════"
echo "  Genesis Monitoring Quick Start"
echo "════════════════════════════════════════════════════════════"
echo ""

# Part 1: Grafana Setup (30 minutes)
echo "▶ Step 1/8: Installing Grafana..."
docker run -d \
  --name=grafana \
  -p 3000:3000 \
  -v ~/grafana/data:/var/lib/grafana \
  -e "GF_SECURITY_ADMIN_PASSWORD=admin" \
  grafana/grafana:latest

sleep 5
echo "✅ Grafana running at http://localhost:3000"
echo ""

# Part 2: Prometheus Check
echo "▶ Step 2/8: Checking Prometheus..."
if curl -s http://localhost:9090/-/healthy > /dev/null; then
  echo "✅ Prometheus is running"
else
  echo "⚠️  Prometheus not running. Start with: docker start prometheus"
fi
echo ""

# Part 3: Grafana Data Source (manual step)
echo "▶ Step 3/8: Configure Grafana Data Source (MANUAL)"
echo "   1. Open: http://localhost:3000"
echo "   2. Login: admin / admin"
echo "   3. Navigate: Configuration → Data Sources → Add"
echo "   4. Select: Prometheus"
echo "   5. URL: http://localhost:9090"
echo "   6. Click: Save & Test"
echo "   Press Enter when done..."
read

# Part 4: Genesis Dashboard JSON
echo "▶ Step 4/8: Creating Grafana dashboard JSON..."
cat > ~/genesis_dashboard.json << 'DASHBOARD'
{
  "dashboard": {
    "title": "Genesis Agent Monitoring",
    "panels": [
      {"id": 1, "title": "Active Agents", "type": "stat"},
      {"id": 2, "title": "Task Success Rate", "type": "gauge"},
      {"id": 3, "title": "LLM Inference Latency", "type": "graph"},
      {"id": 4, "title": "Business Generation Progress", "type": "table"}
    ]
  }
}
DASHBOARD
echo "✅ Dashboard JSON created: ~/genesis_dashboard.json"
echo ""

# Part 5: Import Dashboard (manual step)
echo "▶ Step 5/8: Import Dashboard to Grafana (MANUAL)"
echo "   1. Navigate: Dashboards → Import"
echo "   2. Upload: ~/genesis_dashboard.json"
echo "   3. Select data source: Genesis Prometheus"
echo "   4. Click: Import"
echo "   Press Enter when done..."
read

# Part 6: shadcn UI Setup
echo "▶ Step 6/8: Setting up shadcn UI dashboard..."
cd /home/genesis/genesis-rebuild

if [ ! -d "genesis-dashboard" ]; then
  echo "   Creating Next.js project..."
  npx create-next-app@latest genesis-dashboard \
    --typescript --tailwind --app --no-src-dir \
    --eslint --no-turbopack
  
  cd genesis-dashboard
  
  echo "   Installing shadcn/ui..."
  npx shadcn@latest init -y
  
  echo "   Installing components..."
  npx shadcn@latest add card button badge progress table tabs alert
  
  echo "✅ shadcn UI installed"
else
  echo "✅ genesis-dashboard already exists"
  cd genesis-dashboard
fi
echo ""

# Part 7: Start Development Server
echo "▶ Step 7/8: Starting shadcn dashboard..."
npm run dev &
DASHBOARD_PID=$!
sleep 5
echo "✅ Dashboard running at http://localhost:3000"
echo ""

# Part 8: Summary
echo "▶ Step 8/8: Setup Complete!"
echo ""
echo "════════════════════════════════════════════════════════════"
echo "  MONITORING DASHBOARDS READY"
echo "════════════════════════════════════════════════════════════"
echo ""
echo "Grafana:"
echo "  URL: http://localhost:3000"
echo "  Login: admin / admin"
echo "  Features: Real-time metrics, alerts, business progress"
echo ""
echo "shadcn UI:"
echo "  URL: http://localhost:3001 (if port 3000 used by Grafana)"
echo "  Features: Modern dashboard, agent status, cost tracking"
echo ""
echo "Next Steps:"
echo "  1. Configure business generation prompts"
echo "  2. Test business generation workflow"
echo "  3. Start overnight generation (3 businesses)"
echo ""
echo "════════════════════════════════════════════════════════════"
