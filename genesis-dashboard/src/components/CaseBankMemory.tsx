'use client'

import { useEffect, useState } from 'react'

interface CaseBankEntry {
  case_id: string
  state: string
  action: string
  reward: number
  agent: string
  timestamp: string
}

export default function CaseBankMemory() {
  const [cases, setCases] = useState<CaseBankEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/casebank')
        const data = await response.json()
        setCases(data)
        setLoading(false)
      } catch (error) {
        console.error('Failed to fetch cases:', error)
        setLoading(false)
      }
    }

    fetchCases()
    const interval = setInterval(fetchCases, 5000)

    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return <div className="flex items-center justify-center h-full">Loading...</div>
  }

  const avgReward = cases.length > 0
    ? cases.reduce((sum, c) => sum + c.reward, 0) / cases.length
    : 0

  const successRate = cases.length > 0
    ? (cases.filter(c => c.reward >= 0.7).length / cases.length) * 100
    : 0

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">CaseBank Memory</h2>
        <p className="text-muted-foreground">Recent cases and success rate trends</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-lg p-6">
          <p className="text-sm font-medium text-muted-foreground">Total Cases</p>
          <p className="text-3xl font-bold mt-2">{cases.length}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-6">
          <p className="text-sm font-medium text-muted-foreground">Average Reward</p>
          <p className="text-3xl font-bold mt-2">{avgReward.toFixed(2)}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-6">
          <p className="text-sm font-medium text-muted-foreground">Success Rate</p>
          <p className="text-3xl font-bold mt-2">{successRate.toFixed(1)}%</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Case ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Agent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  State
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Action
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Reward
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {cases.slice(0, 20).map((case_) => (
                <tr key={case_.case_id} className="hover:bg-accent">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono">
                    {case_.case_id.substring(0, 12)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className="px-2 py-1 bg-primary/10 text-primary rounded-md">
                      {case_.agent}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground max-w-xs truncate">
                    {case_.state}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground max-w-xs truncate">
                    {case_.action}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`px-2 py-1 rounded-md font-medium ${
                        case_.reward >= 0.7
                          ? 'bg-green-100 text-green-800'
                          : case_.reward >= 0.5
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {case_.reward.toFixed(2)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
