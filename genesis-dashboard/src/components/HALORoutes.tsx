'use client'

import { useEffect, useState } from 'react'

interface HALORoute {
  request_id: string
  timestamp: string
  selected_agent: string
  reasoning: string
  confidence: number
  duration_ms: number
}

export default function HALORoutes() {
  const [routes, setRoutes] = useState<HALORoute[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/halo/routes')
        const data = await response.json()
        setRoutes(data)
        setLoading(false)
      } catch (error) {
        console.error('Failed to fetch routes:', error)
        setLoading(false)
      }
    }

    fetchRoutes()
    const interval = setInterval(fetchRoutes, 5000)

    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return <div className="flex items-center justify-center h-full">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">HALO Routes</h2>
        <p className="text-muted-foreground">Active routing decisions with explainability</p>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Request ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Selected Agent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Reasoning
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Confidence
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Duration
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {routes.map((route) => (
                <tr key={route.request_id} className="hover:bg-accent">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {route.request_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                    {new Date(route.timestamp).toLocaleTimeString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className="px-2 py-1 bg-primary/10 text-primary rounded-md">
                      {route.selected_agent}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground max-w-md">
                    {route.reasoning}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-secondary rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${route.confidence * 100}%` }}
                        />
                      </div>
                      <span className="font-medium">{(route.confidence * 100).toFixed(0)}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                    {route.duration_ms.toFixed(1)}ms
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
