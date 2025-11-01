'use client'

import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { fetchDashboardJson } from '@/lib/api'

interface ErrorLog {
  id: string
  timestamp: string
  agent: string
  level: 'error' | 'warning' | 'critical'
  message: string
  traceId?: string
}

type RawLog = {
  id?: string
  timestamp?: string
  agent?: string
  level?: string
  message?: string
  trace_id?: string
  traceId?: string
}

const FALLBACK_ERRORS: ErrorLog[] = [
  { id: '1', timestamp: '2025-11-01T15:00:00Z', agent: 'qa_agent', level: 'error', message: 'Timeout after 30s', traceId: 'abc123' },
  { id: '2', timestamp: '2025-11-01T15:01:00Z', agent: 'support_agent', level: 'warning', message: 'High latency detected', traceId: 'def456' },
  { id: '3', timestamp: '2025-11-01T15:02:00Z', agent: 'analyst_agent', level: 'critical', message: 'Model unavailable, using fallback' },
]

const mapLevel = (value?: string): ErrorLog['level'] => {
  const level = value?.toLowerCase()
  if (level === 'critical') return 'critical'
  if (level === 'warning') return 'warning'
  return 'error'
}

const normaliseLogs = (payload: unknown): ErrorLog[] => {
  if (Array.isArray(payload)) {
    return payload.map((log: RawLog, index) => ({
      id: log.id ?? `log-${index}`,
      timestamp: log.timestamp ?? new Date().toISOString(),
      agent: log.agent ?? 'unknown-agent',
      level: mapLevel(log.level),
      message: log.message ?? 'No log message provided.',
      traceId: log.traceId ?? log.trace_id,
    }))
  }

  if (payload && typeof payload === 'object' && Array.isArray((payload as any).logs)) {
    return normaliseLogs((payload as any).logs)
  }

  return []
}

const getLevelVariant = (level: ErrorLog['level']) => {
  switch (level) {
    case 'critical':
      return 'destructive'
    case 'error':
      return 'destructive'
    case 'warning':
      return 'secondary'
    default:
      return 'default'
  }
}

export function ErrorLogsViewer() {
  const [errors, setErrors] = useState<ErrorLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const hasErrors = useMemo(() => errors.length > 0, [errors])

  useEffect(() => {
    const controller = new AbortController()

    const loadErrors = async () => {
      setLoading(true)
      setError(null)

      try {
        const data = await fetchDashboardJson('/logs/errors', controller.signal)
        const normalised = normaliseLogs(data)

        if (normalised.length) {
          setErrors(normalised)
        } else {
          setErrors([])
          setError('No recent errors reported.')
        }
      } catch (err) {
        console.error('Failed to fetch error logs:', err)
        setErrors(FALLBACK_ERRORS)
        setError('Unable to reach logs API – showing cached error samples.')
      } finally {
        setLoading(false)
      }
    }

    loadErrors()
    const interval = setInterval(loadErrors, 5000)

    return () => {
      controller.abort()
      clearInterval(interval)
    }
  }, [])

  if (loading && !errors.length) {
    return <div className="text-center py-8">Loading error logs...</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Error Logs Viewer</CardTitle>
        <CardDescription>Real-time error and warning logs from all agents</CardDescription>
      </CardHeader>
      <CardContent>
        {error && <p className="mb-4 text-sm text-muted-foreground">{error}</p>}
        {hasErrors ? (
          <div className="space-y-4">
            {errors.map((errorLog) => (
              <Card key={errorLog.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant={getLevelVariant(errorLog.level)}>{errorLog.level}</Badge>
                        <span className="font-medium">{errorLog.agent}</span>
                        <span className="text-sm text-muted-foreground">{errorLog.timestamp}</span>
                      </div>
                      <div className="text-sm">{errorLog.message}</div>
                      {errorLog.traceId && (
                        <div className="text-xs text-muted-foreground font-mono break-all">
                          Trace: {errorLog.traceId}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="py-6 text-sm text-muted-foreground">No errors reported in the last interval.</div>
        )}
      </CardContent>
    </Card>
  )
}
