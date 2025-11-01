'use client'

import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { fetchDashboardJson, toNumber } from '@/lib/api'

interface CaseBankMetric {
  caseType: string
  totalCases: number
  successRate: number
  avgTime: number
  lastUpdated: string
}

type CaseBankEntry = {
  case_id?: string
  state?: string
  action?: string
  reward?: number
  agent?: string
  timestamp?: string
  metadata?: {
    agent?: string
    iterations?: number
    timestamp?: string
  }
}

const FALLBACK_METRICS: CaseBankMetric[] = [
  { caseType: 'Test Cases', totalCases: 15420, successRate: 96.5, avgTime: 2.3, lastUpdated: '2025-11-01T15:00:00Z' },
  { caseType: 'Support Cases', totalCases: 8765, successRate: 94.2, avgTime: 3.1, lastUpdated: '2025-11-01T15:00:00Z' },
  { caseType: 'Analytics Cases', totalCases: 5432, successRate: 97.8, avgTime: 4.2, lastUpdated: '2025-11-01T15:00:00Z' },
]

const normaliseEntries = (payload: unknown): CaseBankEntry[] => {
  if (Array.isArray(payload)) {
    return payload as CaseBankEntry[]
  }

  if (payload && typeof payload === 'object' && Array.isArray((payload as any).entries)) {
    return (payload as any).entries as CaseBankEntry[]
  }

  return []
}

const summariseMetrics = (entries: CaseBankEntry[]): CaseBankMetric[] => {
  if (!entries.length) {
    return []
  }

  const perAgent = new Map<string, { count: number; successes: number; iterations: number; lastUpdated: string }>()

  entries.forEach((entry) => {
    const agent = entry.agent ?? entry.metadata?.agent ?? 'unknown-agent'
    const bucket = perAgent.get(agent) ?? { count: 0, successes: 0, iterations: 0, lastUpdated: entry.timestamp ?? entry.metadata?.timestamp ?? new Date().toISOString() }

    bucket.count += 1
    if (toNumber(entry.reward) > 0) {
      bucket.successes += 1
    }
    bucket.iterations += toNumber(entry.metadata?.iterations)
    bucket.lastUpdated = entry.timestamp ?? entry.metadata?.timestamp ?? bucket.lastUpdated

    perAgent.set(agent, bucket)
  })

  return Array.from(perAgent.entries()).map(([agent, data]) => ({
    caseType: agent,
    totalCases: data.count,
    successRate: data.count ? Number(((data.successes / data.count) * 100).toFixed(1)) : 0,
    avgTime: data.count ? Number((data.iterations / data.count).toFixed(2)) : 0,
    lastUpdated: data.lastUpdated,
  }))
}

export function CaseBankPerformance() {
  const [metrics, setMetrics] = useState<CaseBankMetric[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const hasMetrics = useMemo(() => metrics.length > 0, [metrics])

  useEffect(() => {
    const controller = new AbortController()

    const loadMetrics = async () => {
      setLoading(true)
      setError(null)

      try {
        const data = await fetchDashboardJson('/casebank', controller.signal)
        const entries = normaliseEntries(data)

        if (entries.length) {
          setMetrics(summariseMetrics(entries))
        } else {
          setMetrics(FALLBACK_METRICS)
          setError('No CaseBank entries available – showing cached sample data.')
        }
      } catch (err) {
        console.error('Failed to fetch CaseBank metrics:', err)
        setMetrics(FALLBACK_METRICS)
        setError('Unable to reach CaseBank API – showing cached sample statistics.')
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

  if (loading && !metrics.length) {
    return <div className="text-center py-8">Loading CaseBank performance...</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>CaseBank Performance</CardTitle>
        <CardDescription>CaseBank statistics and performance metrics</CardDescription>
      </CardHeader>
      <CardContent>
        {error && <p className="mb-4 text-sm text-muted-foreground">{error}</p>}
        {hasMetrics ? (
          <div className="space-y-4">
            {metrics.map((metric) => (
              <Card key={metric.caseType}>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Case Type</div>
                      <div className="font-medium">{metric.caseType}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Total Cases</div>
                      <div className="font-medium">{metric.totalCases.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Success Rate</div>
                      <div className="font-medium">{metric.successRate}%</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Avg Iterations</div>
                      <div className="font-medium">{metric.avgTime}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="py-6 text-sm text-muted-foreground">No CaseBank activity captured yet.</div>
        )}
      </CardContent>
    </Card>
  )
}
