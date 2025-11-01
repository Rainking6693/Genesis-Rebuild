'use client'

import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { fetchDashboardJson, toNumber } from '@/lib/api'

interface AgentStatus {
  name: string
  status: 'online' | 'offline' | 'degraded'
  requests: number
  successRate: number
  avgLatency?: number | null
  model?: string
}

type RawAgentStatus = {
  name?: string
  status?: string
  tasks_completed?: number
  success_rate?: number
  model?: string
  current_model?: string
  avg_latency_ms?: number
  latency_ms?: number
}

type PromResult = {
  metric?: Record<string, string>
  value?: [number | string, string | number]
}

const REFRESH_INTERVAL_MS = 5000

const FALLBACK_AGENTS: AgentStatus[] = [
  { name: 'qa_agent', status: 'online', requests: 1250, successRate: 98.5, avgLatency: 234, model: 'mistral-7b-tuned' },
  { name: 'content_agent', status: 'online', requests: 980, successRate: 97.2, avgLatency: 189, model: 'mistral-7b-tuned' },
  { name: 'legal_agent', status: 'online', requests: 456, successRate: 99.1, avgLatency: 312, model: 'mistral-7b-tuned' },
  { name: 'support_agent', status: 'online', requests: 2100, successRate: 96.8, avgLatency: 167, model: 'mistral-7b-tuned' },
  { name: 'analyst_agent', status: 'online', requests: 890, successRate: 98.9, avgLatency: 278, model: 'mistral-7b-tuned' },
  { name: 'design_agent', status: 'online', requests: 567, successRate: 97.5, avgLatency: 245, model: 'mistral-7b-baseline' },
  { name: 'code_agent', status: 'online', requests: 1500, successRate: 98.2, avgLatency: 198, model: 'mistral-7b-baseline' },
  { name: 'marketing_agent', status: 'online', requests: 1120, successRate: 96.5, avgLatency: 223, model: 'mistral-7b-baseline' },
  { name: 'sales_agent', status: 'online', requests: 834, successRate: 97.8, avgLatency: 256, model: 'mistral-7b-baseline' },
  { name: 'security_agent', status: 'online', requests: 623, successRate: 99.5, avgLatency: 189, model: 'mistral-7b-baseline' },
  { name: 'devops_agent', status: 'online', requests: 445, successRate: 98.7, avgLatency: 267, model: 'mistral-7b-baseline' },
  { name: 'research_agent', status: 'online', requests: 789, successRate: 97.3, avgLatency: 301, model: 'mistral-7b-baseline' },
  { name: 'data_agent', status: 'online', requests: 567, successRate: 98.1, avgLatency: 234, model: 'mistral-7b-baseline' },
  { name: 'qa_lead_agent', status: 'degraded', requests: 234, successRate: 95.2, avgLatency: 412, model: 'mistral-7b-baseline' },
  { name: 'admin_agent', status: 'online', requests: 123, successRate: 99.8, avgLatency: 156, model: 'mistral-7b-baseline' },
]

const normaliseSuccessRate = (value: unknown): number => {
  const numeric = toNumber(value)
  if (!Number.isFinite(numeric) || numeric <= 0) return 0
  const percent = numeric <= 1 ? numeric * 100 : numeric
  return Number(percent.toFixed(1))
}

const mapStatus = (value?: string): AgentStatus['status'] => {
  const normalised = value?.toLowerCase()
  if (normalised === 'error' || normalised === 'offline') return 'offline'
  if (normalised === 'busy' || normalised === 'degraded') return 'degraded'
  return 'online'
}

const fromAgentResponse = (payload: unknown): AgentStatus[] => {
  if (Array.isArray(payload)) {
    return (payload as RawAgentStatus[]).map((agent) => ({
      name: agent.name ?? 'unknown_agent',
      status: mapStatus(agent.status),
      requests: Math.max(0, Math.round(toNumber(agent.tasks_completed))),
      successRate: normaliseSuccessRate(agent.success_rate),
      avgLatency: agent.avg_latency_ms ?? agent.latency_ms ?? null,
      model: agent.model ?? agent.current_model ?? 'unknown-model',
    }))
  }

  const promResults: PromResult[] | undefined = Array.isArray((payload as any)?.data?.result)
    ? (payload as any).data.result
    : undefined

  if (promResults?.length) {
    return promResults.map((item) => {
      const agentName = item.metric?.agent ?? item.metric?.name ?? 'unknown_agent'
      const rawRequests = toNumber(item.metric?.requests ?? item.value?.[1])
      const rawSuccess = item.metric?.success_rate ?? item.metric?.value ?? item.value?.[1]

      return {
        name: agentName,
        status: mapStatus(item.metric?.status),
        requests: Math.max(0, Math.round(rawRequests)),
        successRate: normaliseSuccessRate(rawSuccess),
        avgLatency: item.metric?.avg_latency_ms ? toNumber(item.metric.avg_latency_ms) : null,
        model: item.metric?.model ?? 'unknown-model',
      }
    })
  }

  return []
}

export function AgentOverview() {
  const [agents, setAgents] = useState<AgentStatus[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const hasData = useMemo(() => agents.length > 0, [agents])

  useEffect(() => {
    const controller = new AbortController()

    const loadAgents = async () => {
      setLoading(true)
      setError(null)

      try {
        const data = await fetchDashboardJson('/agents', controller.signal)
        const normalised = fromAgentResponse(data)

        if (normalised.length) {
          setAgents(normalised)
        } else {
          setAgents(FALLBACK_AGENTS)
          setError('No live agent metrics available – showing snapshot data.')
        }
      } catch (err) {
        console.error('Failed to fetch agent status:', err)
        setAgents(FALLBACK_AGENTS)
        setError('Unable to reach the metrics API – showing cached sample data.')
      } finally {
        setLoading(false)
      }
    }

    loadAgents()
    const interval = setInterval(loadAgents, REFRESH_INTERVAL_MS)

    return () => {
      controller.abort()
      clearInterval(interval)
    }
  }, [])

  if (loading) {
    return <div className="text-center py-8">Loading agent status...</div>
  }

  const getStatusColor = (status: AgentStatus['status']) => {
    switch (status) {
      case 'online':
        return 'bg-green-500'
      case 'degraded':
        return 'bg-yellow-500'
      case 'offline':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <div>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Agent Overview (15 Agents)</CardTitle>
          <CardDescription>Real-time status of all Genesis agents</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <p className="mb-4 text-sm text-muted-foreground">{error}</p>
          )}
          {hasData ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {agents.map((agent) => (
                <Card key={agent.name}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{agent.name}</CardTitle>
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(agent.status)}`} />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Status:</span>
                      <Badge variant={agent.status === 'online' ? 'default' : 'destructive'}>
                        {agent.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Requests:</span>
                      <span className="font-medium">{agent.requests.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Success Rate:</span>
                      <span className="font-medium">{agent.successRate.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Avg Latency:</span>
                      <span className="font-medium">
                        {typeof agent.avgLatency === 'number' ? `${Math.round(agent.avgLatency)}ms` : '—'}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Model:</span>
                      <span className="font-medium text-xs">{agent.model ?? '—'}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="py-6 text-sm text-muted-foreground">No agent metrics available yet.</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
