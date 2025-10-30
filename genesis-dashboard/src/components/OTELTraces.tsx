'use client'

import { useEffect, useState } from 'react'

interface OTELTrace {
  trace_id: string
  span_name: string
  duration_ms: number
  status: string
  timestamp: string
  parent_span_id: string | null
}

export default function OTELTraces() {
  const [traces, setTraces] = useState<OTELTrace[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTraces = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/traces')
        const data = await response.json()
        setTraces(data)
        setLoading(false)
      } catch (error) {
        console.error('Failed to fetch traces:', error)
        setLoading(false)
      }
    }

    fetchTraces()
    const interval = setInterval(fetchTraces, 5000)

    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return <div className="flex items-center justify-center h-full">Loading...</div>
  }

  const avgDuration = traces.length > 0
    ? traces.reduce((sum, t) => sum + t.duration_ms, 0) / traces.length
    : 0

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">OTEL Traces</h2>
        <p className="text-muted-foreground">Distributed tracing visualization</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-lg p-6">
          <p className="text-sm font-medium text-muted-foreground">Total Traces</p>
          <p className="text-3xl font-bold mt-2">{traces.length}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-6">
          <p className="text-sm font-medium text-muted-foreground">Avg Duration</p>
          <p className="text-3xl font-bold mt-2">{avgDuration.toFixed(1)}ms</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Trace ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Span Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Timestamp
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {traces.map((trace, idx) => (
                <tr key={`${trace.trace_id}-${idx}`} className="hover:bg-accent">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono">
                    {trace.trace_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={trace.parent_span_id ? 'ml-4' : ''}>
                      {trace.span_name}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                    {trace.duration_ms.toFixed(1)}ms
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`px-2 py-1 rounded-md font-medium ${
                        trace.status === 'ok'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {trace.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                    {new Date(trace.timestamp).toLocaleTimeString()}
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
