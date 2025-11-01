'use client'

import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { fetchDashboardJson, toNumber } from '@/lib/api'

type HaloRoute = {
  request_id?: string
  timestamp?: string
  selected_agent?: string
  reasoning?: string
  confidence?: number
  duration_ms?: number
}

interface RoutingMetric {
  agent: string
  routingCount: number
  avgLatency: number
  successRate: number
}

interface TimeSeriesPoint {
  time: string
  count: number
}

const FALLBACK_METRICS: RoutingMetric[] = [
  { agent: 'qa_agent', routingCount: 1250, avgLatency: 45, successRate: 98.5 },
  { agent: 'support_agent', routingCount: 2100, avgLatency: 38, successRate: 97.2 },
  { agent: 'analyst_agent', routingCount: 890, avgLatency: 52, successRate: 98.9 },
]

const FALLBACK_SERIES: TimeSeriesPoint[] = Array.from({ length: 24 }, (_, i) => ({
  time: `${i}:00`,
  count: 80,
}))

const groupRoutes = (routes: HaloRoute[]): { metrics: RoutingMetric[]; series: TimeSeriesPoint[] } => {
  const perAgent = new Map<string, { count: number; duration: number; confidence: number }>()
  const perBucket = new Map<string, number>()

  routes.forEach((route) => {
    const agent = route.selected_agent ?? 'unknown-agent'
    const duration = toNumber(route.duration_ms)
    const confidence = toNumber(route.confidence, 0)

    const agentBucket = perAgent.get(agent) ?? { count: 0, duration: 0, confidence: 0 }
    agentBucket.count += 1
    agentBucket.duration += duration
    agentBucket.confidence += confidence
    perAgent.set(agent, agentBucket)

    const timestamp = route.timestamp ? new Date(route.timestamp) : new Date()
    if (!Number.isNaN(timestamp.getTime())) {
      const bucketKey = `${timestamp.getHours().toString().padStart(2, '0')}:${timestamp
        .getMinutes()
        .toString()
        .padStart(2, '0')}`
      perBucket.set(bucketKey, (perBucket.get(bucketKey) ?? 0) + 1)
    }
  })

  const metrics: RoutingMetric[] = Array.from(perAgent.entries()).map(([agent, { count, duration, confidence }]) => ({
    agent,
    routingCount: count,
    avgLatency: count ? duration / count : 0,
    successRate: count ? Math.min(100, Math.max(0, (confidence / count) * 100)) : 0,
  }))

  const series: TimeSeriesPoint[] = Array.from(perBucket.entries())
    .sort(([a], [b]) => (a > b ? 1 : -1))
    .map(([time, count]) => ({ time, count }))

  return { metrics, series }
}

const normaliseRoutes = (payload: unknown): HaloRoute[] => {
  if (Array.isArray(payload)) {
    return payload as HaloRoute[]
  }

  if (payload && typeof payload === 'object' && Array.isArray((payload as any).routes)) {
    return (payload as any).routes as HaloRoute[]
  }

  return []
}

export function HALORouterAnalytics() {
  const [metrics, setMetrics] = useState<RoutingMetric[]>([])
  const [timeSeries, setTimeSeries] = useState<TimeSeriesPoint[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const hasMetrics = useMemo(() => metrics.length > 0, [metrics])

  useEffect(() => {
    const controller = new AbortController()

    const loadMetrics = async () => {
      setLoading(true)
      setError(null)

      try {
        const data = await fetchDashboardJson('/halo/routes', controller.signal)
        const routes = normaliseRoutes(data)

        if (routes.length) {
          const { metrics: aggregated, series } = groupRoutes(routes)
          setMetrics(aggregated)
          setTimeSeries(series)
        } else {
          setMetrics(FALLBACK_METRICS)
          setTimeSeries(FALLBACK_SERIES)
          setError('No HALO routing events available – showing cached sample data.')
        }
      } catch (err) {
        console.error('Failed to fetch HALO metrics:', err)
        setMetrics(FALLBACK_METRICS)
        setTimeSeries(FALLBACK_SERIES)
        setError('Unable to reach HALO API – showing cached sample analytics.')
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
          <CardTitle>HALO Router Analytics</CardTitle>
          <CardDescription>Routing decisions and agent selection metrics</CardDescription>
        </CardHeader>
        <CardContent>
          {error && <p className="mb-4 text-sm text-muted-foreground">{error}</p>}
          {loading && !metrics.length ? (
            <div className="py-6 text-sm text-muted-foreground">Loading routing analytics...</div>
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
                        <div className="text-sm text-muted-foreground">Routing Count</div>
                        <div className="font-medium">{metric.routingCount.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Avg Latency</div>
                        <div className="font-medium">{metric.avgLatency.toFixed(1)}ms</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Avg Confidence</div>
                        <div className="font-medium">{metric.successRate.toFixed(1)}%</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="py-6 text-sm text-muted-foreground">No routing activity captured yet.</div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Routing Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timeSeries.length ? timeSeries : FALLBACK_SERIES}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
