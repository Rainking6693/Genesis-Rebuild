'use client'

import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

import { toNumber } from '@/lib/api'

interface CostMetric {
  agent: string
  cost: number
  requests: number
  avgCostPerRequest: number
}

type PrometheusResult = {
  metric?: Record<string, string>
  value?: [number | string, number | string]
}

const FALLBACK_METRICS: CostMetric[] = [
  { agent: 'qa_agent', cost: 12.45, requests: 1250, avgCostPerRequest: 0.010 },
  { agent: 'support_agent', cost: 18.9, requests: 2100, avgCostPerRequest: 0.009 },
  { agent: 'analyst_agent', cost: 8.34, requests: 890, avgCostPerRequest: 0.009 },
  { agent: 'content_agent', cost: 9.87, requests: 980, avgCostPerRequest: 0.010 },
  { agent: 'legal_agent', cost: 4.56, requests: 456, avgCostPerRequest: 0.010 },
]

const normaliseMetrics = (payload: unknown): CostMetric[] => {
  const results: PrometheusResult[] | undefined = Array.isArray((payload as any)?.data?.result)
    ? (payload as any).data.result
    : undefined

  if (!results?.length) {
    return []
  }

  return results.map((entry) => {
    const cost = toNumber(entry.value?.[1])
    const agent = entry.metric?.agent ?? entry.metric?.service ?? 'unknown-agent'
    const requests = Math.max(0, toNumber(entry.metric?.requests ?? entry.metric?.count, 0))
    const avg = requests > 0 ? cost / requests : 0

    return {
      agent,
      cost,
      requests,
      avgCostPerRequest: avg,
    }
  })
}

export function CostDashboard() {
  const [metrics, setMetrics] = useState<CostMetric[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const totalCost = useMemo(() => metrics.reduce((sum, metric) => sum + metric.cost, 0), [metrics])
  const hasMetrics = metrics.length > 0

  useEffect(() => {
    const controller = new AbortController()

    const loadMetrics = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch('/api/metrics/api/v1/query?query=model_cost_usd', {
          signal: controller.signal,
          cache: 'no-store',
        })

        if (!response.ok) {
          throw new Error(`Prometheus query failed with status ${response.status}`)
        }

        const data = await response.json()
        const normalised = normaliseMetrics(data)

        if (normalised.length) {
          normalised.sort((a, b) => b.cost - a.cost)
          setMetrics(normalised)
        } else {
          setMetrics(FALLBACK_METRICS)
          setError('No cost metrics returned – showing cached sample data.')
        }
      } catch (err) {
        console.error('Failed to fetch cost metrics:', err)
        setMetrics(FALLBACK_METRICS)
        setError('Unable to reach Prometheus – showing cached cost overview.')
      } finally {
        setLoading(false)
      }
    }

    loadMetrics()
    const interval = setInterval(loadMetrics, 5000)

    return () => {
      controller.abort()
      clearInterval(interval)
    }
  }, [])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Cost Dashboard</CardTitle>
          <CardDescription>Model usage costs and optimisation</CardDescription>
        </CardHeader>
        <CardContent>
          {error && <p className="mb-4 text-sm text-muted-foreground">{error}</p>}
          <div className="mb-4">
            <div className="text-2xl font-bold">${totalCost.toFixed(2)}</div>
            <div className="text-sm text-muted-foreground">Total Cost (Last 24h)</div>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={hasMetrics ? metrics : FALLBACK_METRICS}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="agent" />
              <YAxis />
              <Tooltip formatter={(value: number) => `$${Number(value).toFixed(4)}`} />
              <Legend />
              <Bar dataKey="cost" fill="#8884d8" name="Cost (USD)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cost by Agent</CardTitle>
        </CardHeader>
        <CardContent>
          {loading && !metrics.length ? (
            <div className="py-6 text-sm text-muted-foreground">Loading cost metrics...</div>
          ) : hasMetrics ? (
            <div className="space-y-4">
              {metrics.map((metric) => (
                <Card key={metric.agent}>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-4 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Agent</div>
                        <div className="font-medium">{metric.agent}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Cost</div>
                        <div className="font-medium">${metric.cost.toFixed(2)}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Requests</div>
                        <div className="font-medium">{metric.requests.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Avg Cost/Request</div>
                        <div className="font-medium">${metric.avgCostPerRequest.toFixed(4)}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="py-6 text-sm text-muted-foreground">No cost telemetry captured yet.</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
