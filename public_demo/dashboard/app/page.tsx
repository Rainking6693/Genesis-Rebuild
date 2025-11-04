'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { OTELTracesViewer } from '@/components/OTELTracesViewer'
import { HALORouterAnalytics } from '@/components/HALORouterAnalytics'
import { CaseBankPerformance } from '@/components/CaseBankPerformance'
import { CostDashboard } from '@/components/CostDashboard'
import { ErrorLogsViewer } from '@/components/ErrorLogsViewer'
import { SwarmTeamsViewer } from '@/components/SwarmTeamsViewer'
import { MemoryKnowledgeGraph } from '@/components/MemoryKnowledgeGraph'
import { AgentOverview } from '@/components/AgentOverview'
import { BusinessesOverview } from '@/components/BusinessesOverview'
import { BusinessDetailView } from '@/components/BusinessDetailView'
import type { BusinessSummary } from '@/components/BusinessesOverview'

export default function Dashboard() {
  const [refreshKey] = useState(0)
  const [selectedBusiness, setSelectedBusiness] = useState<BusinessSummary | null>(null)

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">Genesis Agent Dashboard</h1>
          <p className="text-sm text-muted-foreground">Real-time monitoring for all Phase 1-6 systems</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-9">
            <TabsTrigger value="overview">Agent Overview</TabsTrigger>
            <TabsTrigger value="traces">OTEL Traces</TabsTrigger>
            <TabsTrigger value="halo">HALO Router</TabsTrigger>
            <TabsTrigger value="casebank">CaseBank</TabsTrigger>
            <TabsTrigger value="cost">Cost Dashboard</TabsTrigger>
            <TabsTrigger value="errors">Error Logs</TabsTrigger>
            <TabsTrigger value="swarm">Swarm Teams</TabsTrigger>
            <TabsTrigger value="memory">Memory Graph</TabsTrigger>
            <TabsTrigger value="businesses">Businesses</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <AgentOverview key={refreshKey} />
          </TabsContent>

          <TabsContent value="traces" className="mt-6">
            <OTELTracesViewer key={refreshKey} />
          </TabsContent>

          <TabsContent value="halo" className="mt-6">
            <HALORouterAnalytics key={refreshKey} />
          </TabsContent>

          <TabsContent value="casebank" className="mt-6">
            <CaseBankPerformance key={refreshKey} />
          </TabsContent>

          <TabsContent value="cost" className="mt-6">
            <CostDashboard key={refreshKey} />
          </TabsContent>

          <TabsContent value="errors" className="mt-6">
            <ErrorLogsViewer key={refreshKey} />
          </TabsContent>

          <TabsContent value="swarm" className="mt-6">
            <SwarmTeamsViewer key={refreshKey} />
          </TabsContent>

          <TabsContent value="memory" className="mt-6">
            <MemoryKnowledgeGraph key={refreshKey} />
          </TabsContent>

          <TabsContent value="businesses" className="mt-6">
            <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
              <BusinessesOverview
                key={refreshKey}
                selectedBusinessId={selectedBusiness?.id}
                onSelectBusiness={(business) => setSelectedBusiness(business)}
              />
              <BusinessDetailView businessId={selectedBusiness?.id} businessName={selectedBusiness?.name} />
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
