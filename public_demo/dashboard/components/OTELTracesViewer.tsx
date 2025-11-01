'use client'

import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { fetchDashboardJson } from '@/lib/api'

interface Trace {
  traceId: string
  spanId: string
  operation: string
  agent: string
  startTime: string
  duration: number
  status: 'success' | 'error'
}

interface OtlpSpan {
  traceId?: string
  spanId?: string
  name?: string
  startTimeUnixNano?: string
  endTimeUnixNano?: string
  status?: { code?: number }
  attributes?: { key?: string; value?: { stringValue?: string } }[]
}

const toFinite = (value: unknown, fallback = 0) => {
  const num = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(num) ? num : fallback
}

const FALLBACK_TRACES: Trace[] = [
  { traceId: 'abc123', spanId: 'span-1', operation: 'genesis.execute', agent: 'qa_agent', startTime: '2025-11-01T15:00:00Z', duration: 234, status: 'success' },
  { traceId: 'def456', spanId: 'span-2', operation: 'halo.route', agent: 'support_agent', startTime: '2025-11-01T15:01:00Z', duration: 189, status: 'success' },
  { traceId: 'ghi789', spanId: 'span-3', operation: 'gap.execute_plan', agent: 'analyst_agent', startTime: '2025-11-01T15:02:00Z', duration: 456, status: 'success' },
]

const nanoToMs = (start?: string, end?: string): number | null => {
  if (!start || !end) return null
  const startMs = Number(start) / 1_000_000
  const endMs = Number(end) / 1_000_000
  if (!Number.isFinite(startMs) || !Number.isFinite(endMs)) return null
  return Math.max(0, endMs - startMs)
}

const extractAttribute = (attributes: OtlpSpan['attributes'], key: string): string | undefined => {
  return attributes?.find((attr) => attr.key === key)?.value?.stringValue
}

const normaliseTraces = (payload: unknown): Trace[] => {
  if (Array.isArray(payload)) {
    return (payload as any[]).map((trace) => ({
      traceId: trace.trace_id ?? trace.traceId ?? 'unknown-trace',
      spanId: trace.span_id ?? trace.spanId ?? 'unknown-span',
      operation: trace.span_name ?? trace.operation ?? trace.name ?? 'unknown-operation',
      agent: trace.agent ?? trace.service ?? 'unknown-agent',
      startTime: trace.timestamp ?? trace.startTime ?? new Date().toISOString(),
      duration: Number.isFinite(trace.duration_ms) ? Number(trace.duration_ms) : toFinite(trace.duration, 0),
      status: (trace.status === 'error' || trace.status === 'failed') ? 'error' : 'success',
    }))
  }

  const otlp = (payload as any)?.resourceSpans
  if (Array.isArray(otlp) && otlp.length > 0) {
    const traces: Trace[] = []

    otlp.forEach((resource: any) => {
      const serviceName = extractAttribute(resource?.resource?.attributes, 'service.name')
      const scopeSpans = resource?.scopeSpans ?? resource?.instrumentationLibrarySpans

      scopeSpans?.forEach((scope: any) => {
        scope?.spans?.forEach((span: OtlpSpan) => {
          const duration = nanoToMs(span.startTimeUnixNano, span.endTimeUnixNano)
          traces.push({
            traceId: span.traceId ?? 'unknown-trace',
            spanId: span.spanId ?? 'unknown-span',
            operation: span.name ?? 'unknown-operation',
            agent: extractAttribute(span.attributes, 'genesis.agent') ?? serviceName ?? 'unknown-agent',
            startTime: span.startTimeUnixNano
              ? new Date(Number(span.startTimeUnixNano) / 1_000_000).toISOString()
              : new Date().toISOString(),
            duration: duration ?? 0,
            status: span.status?.code === 2 ? 'error' : 'success',
          })
        })
      })
    })

    return traces
  }

  return []
}

export function OTELTracesViewer() {
  const [traces, setTraces] = useState<Trace[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const hasTraces = useMemo(() => traces.length > 0, [traces])

  useEffect(() => {
    const controller = new AbortController()

    const loadTraces = async () => {
      setLoading(true)
      setError(null)

      try {
        const data = await fetchDashboardJson('/traces', controller.signal)
        const normalised = normaliseTraces(data)

        if (normalised.length) {
          setTraces(normalised)
        } else {
          setTraces(FALLBACK_TRACES)
          setError('No trace data received – showing recent sample data.')
        }
      } catch (err) {
        console.error('Failed to fetch traces:', err)
        setTraces(FALLBACK_TRACES)
        setError('Unable to contact OTEL endpoint – showing cached sample traces.')
      } finally {
        setLoading(false)
      }
    }

    loadTraces()
    const interval = setInterval(loadTraces, 5000)

    return () => {
      controller.abort()
      clearInterval(interval)
    }
  }, [])

  if (loading) {
    return <div className="text-center py-8">Loading traces...</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>OTEL Traces Viewer</CardTitle>
        <CardDescription>Distributed tracing across HTDAG, HALO, AOP layers</CardDescription>
      </CardHeader>
      <CardContent>
        {error && <p className="mb-4 text-sm text-muted-foreground">{error}</p>}
        {hasTraces ? (
          <div className="space-y-4">
            {traces.map((trace) => (
              <Card key={`${trace.traceId}-${trace.spanId}`}>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Trace ID:</span>
                      <div className="font-mono text-xs break-all">{trace.traceId}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Operation:</span>
                      <div className="font-medium">{trace.operation}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Agent:</span>
                      <div className="font-medium">{trace.agent}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Duration:</span>
                      <div className="font-medium">{Math.round(trace.duration)}ms</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="py-6 text-sm text-muted-foreground">No trace data available.</div>
        )}
      </CardContent>
    </Card>
  )
}
