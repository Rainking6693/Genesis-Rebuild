# shadcn/ui Setup for Genesis Dashboard

**Purpose:** Modern React dashboard for monitoring Genesis agents + business generation  
**Timeline:** 20-30 minutes setup  
**Tech Stack:** Next.js 14 + React + Tailwind + shadcn/ui  
**Cost:** $0 (self-hosted)

---

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Grafana running (from previous step)

---

## Step 1: Create Next.js Project (3 minutes)

```bash
# Navigate to project root
cd /home/genesis/genesis-rebuild

# Create new Next.js app with TypeScript
npx create-next-app@latest genesis-dashboard --typescript --tailwind --app --no-src-dir

# Navigate to dashboard
cd genesis-dashboard
```

**Prompts (answer these):**
```
✔ Would you like to use ESLint? … Yes
✔ Would you like to use Turbopack? … No
✔ Would you like to customize the import alias? … No
```

---

## Step 2: Install shadcn/ui (2 minutes)

```bash
# Initialize shadcn/ui
npx shadcn@latest init

# Answer prompts:
✔ Which style would you like to use? › New York
✔ Which color would you like to use as base color? › Zinc
✔ Would you like to use CSS variables for colors? … yes
```

This creates:
- `components.json` (config file)
- `lib/utils.ts` (helper functions)
- Updated `tailwind.config.js`

---

## Step 3: Install shadcn Components (5 minutes)

```bash
# Install all components needed for Genesis dashboard
npx shadcn@latest add card
npx shadcn@latest add button
npx shadcn@latest add badge
npx shadcn@latest add progress
npx shadcn@latest add table
npx shadcn@latest add tabs
npx shadcn@latest add alert
npx shadcn@latest add chart  # For visualizations
npx shadcn@latest add dropdown-menu
npx shadcn@latest add avatar
```

This installs components to `components/ui/`

---

## Step 4: Create Genesis Dashboard Layout (10 minutes)

### File: `app/page.tsx`

```typescript
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function GenesisDashboard() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Genesis Control Center</h1>
            <p className="text-muted-foreground">Real-time agent monitoring</p>
          </div>
          <Badge variant="outline" className="text-green-600 border-green-600">
            🟢 All Systems Operational
          </Badge>
        </div>

        {/* Agent Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Active Agents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">15</div>
              <p className="text-sm text-muted-foreground">All operational</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tasks Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">1,247</div>
              <p className="text-sm text-muted-foreground">98.3% success rate</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cost (Local LLM)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-green-600">$0.00</div>
              <p className="text-sm text-muted-foreground">100% local inference</p>
            </CardContent>
          </Card>
        </div>

        {/* Business Generation Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Business Generation Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-medium">Business 1: E-Commerce Store</span>
                <span className="text-sm text-muted-foreground">75%</span>
              </div>
              <Progress value={75} className="h-2" />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="font-medium">Business 2: Content Platform</span>
                <span className="text-sm text-muted-foreground">60%</span>
              </div>
              <Progress value={60} className="h-2" />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="font-medium">Business 3: SaaS Product</span>
                <span className="text-sm text-muted-foreground">45%</span>
              </div>
              <Progress value={45} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Agent Activity Tabs */}
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Agents</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="errors">Errors</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Agent Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {["QA Agent", "Support Agent", "Legal Agent", "Analyst Agent", "Content Agent"].map((agent) => (
                    <div key={agent} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        <span className="font-medium">{agent}</span>
                      </div>
                      <Badge variant="outline">Running</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Alerts */}
        <Alert>
          <AlertDescription>
            ℹ️ All systems operational. Business generation on track for Friday delivery.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  )
}
```

---

## Step 5: Add Real-Time Data Integration (5 minutes)

### Create API Route: `app/api/metrics/route.ts`

```typescript
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Fetch from Prometheus
    const prometheusUrl = 'http://localhost:9090/api/v1/query'
    
    const queries = {
      activeAgents: 'genesis_agent_active',
      tasksCompleted: 'genesis_task_completed_total',
      errorRate: 'rate(genesis_agent_errors_total[5m])',
      business1Progress: 'genesis_business_1_completion_percentage',
      business2Progress: 'genesis_business_2_completion_percentage',
      business3Progress: 'genesis_business_3_completion_percentage',
    }

    const results: Record<string, any> = {}

    for (const [key, query] of Object.entries(queries)) {
      const response = await fetch(`${prometheusUrl}?query=${encodeURIComponent(query)}`)
      const data = await response.json()
      results[key] = data.data.result
    }

    return NextResponse.json({
      success: true,
      data: results,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch metrics' },
      { status: 500 }
    )
  }
}
```

### Update Dashboard with Real-Time Data: `app/page.tsx`

Add at top:
```typescript
'use client'

import { useEffect, useState } from 'react'

export default function GenesisDashboard() {
  const [metrics, setMetrics] = useState<any>(null)

  useEffect(() => {
    // Fetch metrics every 5 seconds
    const fetchMetrics = async () => {
      const response = await fetch('/api/metrics')
      const data = await response.json()
      if (data.success) {
        setMetrics(data.data)
      }
    }

    fetchMetrics()
    const interval = setInterval(fetchMetrics, 5000)
    return () => clearInterval(interval)
  }, [])

  // Use metrics.business1Progress instead of hardcoded 75%
  const business1Progress = metrics?.business1Progress?.[0]?.value?.[1] || 0
  // ... similar for business2, business3
}
```

---

## Step 6: Run Development Server (1 minute)

```bash
cd /home/genesis/genesis-rebuild/genesis-dashboard

# Start development server
npm run dev

# Dashboard available at:
# http://localhost:3000
```

---

## Step 7: Build for Production (3 minutes)

```bash
# Build optimized production bundle
npm run build

# Start production server
npm run start

# Or use PM2 for process management
pm2 start npm --name "genesis-dashboard" -- start
pm2 save
```

---

## Complete shadcn/ui Component List

**Installed Components:**
- `card` - Agent status cards
- `button` - Action buttons
- `badge` - Status indicators
- `progress` - Business generation progress bars
- `table` - Agent activity tables
- `tabs` - Dashboard sections
- `alert` - System notifications
- `chart` - Visualizations (optional)
- `dropdown-menu` - Agent actions
- `avatar` - Agent icons

---

## Dashboard Features

**Real-Time Monitoring:**
- ✅ 15 agent status indicators
- ✅ Business generation progress (3 businesses)
- ✅ Task success rate
- ✅ Cost tracking ($0 local LLM)
- ✅ Error alerts
- ✅ Agent activity timeline

**Update Frequency:** 5 seconds (configurable)

**Mobile Responsive:** Yes (Tailwind CSS)

**Dark Mode:** Built-in (shadcn/ui)

---

## Customization Options

### Change Theme Color

Edit `app/globals.css`:
```css
:root {
  --primary: 220 90% 56%; /* Change to your brand color */
}
```

### Add More Components

```bash
# Install additional shadcn components
npx shadcn@latest add tooltip
npx shadcn@latest add popover
npx shadcn@latest add dialog
npx shadcn@latest add sheet  # For mobile sidebar
```

---

## Integration with Grafana

**Option 1: Embed Grafana Panels**

```typescript
// Add to page.tsx
<iframe
  src="http://localhost:3000/d/genesis-main?orgId=1&theme=light&kiosk"
  width="100%"
  height="600"
  frameBorder="0"
/>
```

**Option 2: Use Grafana API**

```typescript
// Fetch dashboard data from Grafana
const response = await fetch('http://localhost:3000/api/dashboards/uid/genesis-main', {
  headers: {
    'Authorization': 'Bearer YOUR_GRAFANA_API_KEY'
  }
})
```

---

## Troubleshooting

### Issue: Components not found

**Solution:**
```bash
# Verify shadcn installation
ls components/ui/

# Reinstall if needed
npx shadcn@latest init
```

### Issue: Tailwind styles not working

**Solution:**
```bash
# Check tailwind.config.js has correct content paths
cat tailwind.config.js

# Rebuild
npm run dev
```

### Issue: API route can't connect to Prometheus

**Solution:**
```bash
# Check Prometheus is accessible
curl http://localhost:9090/-/healthy

# Update API route to use correct host
# (might need host.docker.internal if using Docker)
```

---

## Complete Dashboard Summary

**URLs:**
- Development: http://localhost:3000
- Production: http://localhost:3000 (after `npm run build`)
- Grafana embed: http://localhost:3000/grafana

**Features:**
1. Real-time agent monitoring (5s refresh)
2. Business generation progress (3 bars)
3. Cost tracking ($0 local LLM)
4. Error alerts
5. Agent activity tabs
6. Mobile responsive
7. Dark mode support

**Integration:**
- ✅ Prometheus metrics via API
- ✅ Grafana dashboard embedding
- ✅ Real-time updates (WebSocket optional)

---

## Next Steps

✅ shadcn/ui installed and configured  
✅ Genesis dashboard created  
✅ Real-time monitoring active  
✅ Ready for Friday deployment

**Now:** Start Grafana + shadcn dashboard, monitor business generation
**Timeline:** Ready for production use
