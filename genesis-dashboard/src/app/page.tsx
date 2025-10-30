'use client'

import { useState } from 'react'
import OverviewDashboard from '@/components/OverviewDashboard'
import AgentStatusGrid from '@/components/AgentStatusGrid'
import HALORoutes from '@/components/HALORoutes'
import CaseBankMemory from '@/components/CaseBankMemory'
import OTELTraces from '@/components/OTELTraces'
import HumanApprovals from '@/components/HumanApprovals'
import Sidebar from '@/components/Sidebar'

export default function Home() {
  const [activeView, setActiveView] = useState<string>('overview')

  const renderView = () => {
    switch (activeView) {
      case 'overview':
        return <OverviewDashboard />
      case 'agents':
        return <AgentStatusGrid />
      case 'halo':
        return <HALORoutes />
      case 'memory':
        return <CaseBankMemory />
      case 'traces':
        return <OTELTraces />
      case 'approvals':
        return <HumanApprovals />
      default:
        return <OverviewDashboard />
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <main className="flex-1 overflow-auto p-6">
        {renderView()}
      </main>
    </div>
  )
}
