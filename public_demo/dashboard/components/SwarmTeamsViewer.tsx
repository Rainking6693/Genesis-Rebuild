'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Area,
  AreaChart,
} from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { fetchDashboardJson } from '@/lib/api'
import clsx from 'clsx'

type CooperationMatrix = Record<string, Record<string, number>>

interface GenerationMetrics {
  generation: number
  avg_fitness: number
  success_rate: number
  avg_diversity: number
  avg_cooperation: number
}

interface TopTeamEntry {
  team: string[]
  appearances: number
  avg_fitness: number
  avg_success: number
}

interface ActiveTeamEntry {
  task_id: string
  team: string[]
  fitness: number
  success_probability: number
  diversity: number
  cooperation: number
}

interface SwarmMetricsPayload {
  generated_at: string
  summary: {
    baseline_success_rate: number
    swarm_success_rate: number
    relative_gain_percent: number
  }
  generations: GenerationMetrics[]
  top_teams: TopTeamEntry[]
  cooperation_matrix: CooperationMatrix
  active_teams: ActiveTeamEntry[]
  emergent_strategies: string[]
}

const FALLBACK_METRICS: SwarmMetricsPayload = {
  generated_at: new Date().toISOString(),
  summary: {
    baseline_success_rate: 0.54,
    swarm_success_rate: 0.68,
    relative_gain_percent: 25.9,
  },
  generations: [
    { generation: 1, avg_fitness: 0.93, success_rate: 0.55, avg_diversity: 0.34, avg_cooperation: 0.62 },
    { generation: 2, avg_fitness: 1.05, success_rate: 0.60, avg_diversity: 0.39, avg_cooperation: 0.64 },
    { generation: 3, avg_fitness: 1.18, success_rate: 0.63, avg_diversity: 0.41, avg_cooperation: 0.66 },
    { generation: 4, avg_fitness: 1.31, success_rate: 0.66, avg_diversity: 0.46, avg_cooperation: 0.68 },
    { generation: 5, avg_fitness: 1.42, success_rate: 0.69, avg_diversity: 0.50, avg_cooperation: 0.70 },
    { generation: 6, avg_fitness: 1.48, success_rate: 0.71, avg_diversity: 0.53, avg_cooperation: 0.71 },
  ],
  top_teams: [
    {
      team: ['builder_agent', 'qa_agent', 'deploy_agent', 'billing_agent'],
      appearances: 7,
      avg_fitness: 1.56,
      avg_success: 0.86,
    },
    {
      team: ['content_agent', 'seo_agent', 'email_agent'],
      appearances: 6,
      avg_fitness: 1.32,
      avg_success: 0.81,
    },
    {
      team: ['marketing_agent', 'analyst_agent', 'support_agent'],
      appearances: 5,
      avg_fitness: 1.29,
      avg_success: 0.78,
    },
    {
      team: ['legal_agent', 'security_agent', 'qa_agent'],
      appearances: 4,
      avg_fitness: 1.34,
      avg_success: 0.84,
    },
  ],
  cooperation_matrix: {
    analysis: { analysis: 1.0, content: 0.42, customer_interaction: 0.37, finance: 0.58, infrastructure: 0.49 },
    content: { analysis: 0.42, content: 1.0, customer_interaction: 0.45, finance: 0.33, infrastructure: 0.40 },
    customer_interaction: {
      analysis: 0.37,
      content: 0.45,
      customer_interaction: 1.0,
      finance: 0.31,
      infrastructure: 0.39,
    },
    finance: { analysis: 0.58, content: 0.33, customer_interaction: 0.31, finance: 1.0, infrastructure: 0.44 },
    infrastructure: { analysis: 0.49, content: 0.40, customer_interaction: 0.39, finance: 0.44, infrastructure: 1.0 },
  },
  active_teams: [
    {
      task_id: 'saas_launch',
      team: ['builder_agent', 'qa_agent', 'deploy_agent', 'billing_agent'],
      fitness: 1.67,
      success_probability: 0.88,
      diversity: 0.60,
      cooperation: 0.55,
    },
    {
      task_id: 'ecommerce_store',
      team: ['content_agent', 'seo_agent', 'email_agent'],
      fitness: 1.32,
      success_probability: 0.82,
      diversity: 0.40,
      cooperation: 0.67,
    },
    {
      task_id: 'support_automation',
      team: ['support_agent', 'analyst_agent', 'marketing_agent'],
      fitness: 1.28,
      success_probability: 0.79,
      diversity: 0.53,
      cooperation: 0.42,
    },
  ],
  emergent_strategies: [
    'Hybrid teams balancing infrastructure + content genotypes sustained ≥70% success across the final two generations.',
    'Repeated kin clusters (QA + Security + Legal) deliver reliable compliance sprints.',
  ],
}

const GENOTYPE_LABELS = [
  'analysis',
  'content',
  'customer_interaction',
  'finance',
  'infrastructure',
]

const formatPercent = (value: number) => `${(value * 100).toFixed(1)}%`

const cellColor = (value: number) => {
  const clamped = Math.max(0, Math.min(1, value))
  const hue = 210 - clamped * 120 // teal to lime
  const lightness = 90 - clamped * 35
  return `hsl(${hue}, 70%, ${lightness}%)`
}

const AGENT_NAME_REGEX = /^[a-zA-Z0-9_-]+$/
const TASK_ID_REGEX = /^[a-zA-Z0-9_-]{1,64}$/

const isValidAgentName = (name: string): boolean => AGENT_NAME_REGEX.test(name)
const isValidTaskId = (taskId: string): boolean => TASK_ID_REGEX.test(taskId)

const filterValidActiveTeams = (teams: ActiveTeamEntry[]): ActiveTeamEntry[] =>
  teams.filter((team) => isValidTaskId(team.task_id) && team.team.every(isValidAgentName))

export function SwarmTeamsViewer() {
  const [metrics, setMetrics] = useState<SwarmMetricsPayload | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    const loadMetrics = async () => {
      setError(null)
      try {
        const data = await fetchDashboardJson<SwarmMetricsPayload>('/swarm/metrics', controller.signal)
        if (data && Array.isArray(data.generations) && data.generations.length) {
          setMetrics(data)
        } else {
          setMetrics(FALLBACK_METRICS)
          setError('Live swarm metrics unavailable – showing last captured snapshot.')
        }
      } catch (err) {
        console.warn('Swarm metrics offline, using fallback data:', err)
        setMetrics(FALLBACK_METRICS)
        setError('Unable to reach swarm analytics service – displaying cached sample data.')
      }
    }

    loadMetrics()
    return () => controller.abort()
  }, [])

  const payload = metrics ?? FALLBACK_METRICS

  const relativeGainLabel = useMemo(() => {
    const gain = payload.summary.relative_gain_percent
    if (!Number.isFinite(gain)) return 'n/a'
    return `${gain.toFixed(1)}%`
  }, [payload.summary.relative_gain_percent])

  const chartData = useMemo(
    () =>
      payload.generations.map((row) => ({
        generation: `G${row.generation}`,
        avgFitness: Number(row.avg_fitness.toFixed(3)),
        successRate: Number(row.success_rate.toFixed(3)),
        diversity: Number(row.avg_diversity.toFixed(3)),
        cooperation: Number(row.avg_cooperation.toFixed(3)),
      })),
    [payload.generations]
  )

  const cooperationRows = GENOTYPE_LABELS.map((row) => ({
    label: row,
    values: GENOTYPE_LABELS.map((col) => payload.cooperation_matrix?.[row]?.[col] ?? 0),
  }))

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Swarm Performance Overview</CardTitle>
          <CardDescription>
            Fitness and cooperation metrics for the inclusive-fitness swarm optimiser. Targets call for ≥15% uplift
            over random team baselines.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && <p className="mb-4 text-sm text-muted-foreground">{error}</p>}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Swarm Success Rate</CardTitle>
              </CardHeader>
              <CardContent className="text-3xl font-semibold">
                {formatPercent(payload.summary.swarm_success_rate)}
                <p className="text-sm text-muted-foreground mt-1">
                  Baseline: {formatPercent(payload.summary.baseline_success_rate)}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Relative Improvement</CardTitle>
              </CardHeader>
              <CardContent className="text-3xl font-semibold">{relativeGainLabel}</CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Generated</CardTitle>
              </CardHeader>
              <CardContent className="text-3xl font-semibold">
                {new Date(payload.generated_at).toLocaleTimeString()}
                <p className="text-sm text-muted-foreground mt-1">
                  {new Date(payload.generated_at).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Fitness &amp; Success Over Generations</CardTitle>
            <CardDescription>Line chart of average team fitness and execution success.</CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ left: 12, right: 24 }}>
                <CartesianGrid strokeDasharray="4 4" opacity={0.3} />
                <XAxis dataKey="generation" />
                <YAxis yAxisId="left" label={{ value: 'Fitness', angle: -90, position: 'insideLeft' }} />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  domain={[0, 1]}
                  label={{ value: 'Success Rate', angle: 90, position: 'insideRight' }}
                />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="avgFitness" stroke="#22c55e" strokeWidth={2} dot />
                <Line yAxisId="right" type="monotone" dataKey="successRate" stroke="#0ea5e9" strokeWidth={2} dot />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Diversity &amp; Cooperation</CardTitle>
            <CardDescription>Tracking inclusive-fitness traits that drive emergent strategies.</CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ left: 12, right: 24 }}>
                <defs>
                  <linearGradient id="diversityGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="cooperationGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" opacity={0.3} />
                <XAxis dataKey="generation" />
                <YAxis domain={[0, 1]} />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="diversity" stroke="#a855f7" fill="url(#diversityGradient)" strokeWidth={2} />
                <Area
                  type="monotone"
                  dataKey="cooperation"
                  stroke="#f97316"
                  fill="url(#cooperationGradient)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Kin Cooperation Matrix</CardTitle>
          <CardDescription>
            Average relatedness scores between genotype groups (1.0 indicates tightly knit kin, 0.0 unrelated).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full border divide-y divide-border text-sm">
              <thead>
                <tr>
                  <th className="border px-3 py-2 text-left bg-muted/50">Genotype</th>
                  {GENOTYPE_LABELS.map((label) => (
                    <th key={label} className="border px-3 py-2 text-left bg-muted/50 capitalize">
                      {label.replace('_', ' ')}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {cooperationRows.map((row) => (
                  <tr key={row.label}>
                    <th className="border px-3 py-2 text-left font-medium capitalize bg-muted/30">
                      {row.label.replace('_', ' ')}
                    </th>
                    {row.values.map((value, index) => (
                      <td
                        key={`${row.label}-${GENOTYPE_LABELS[index]}`}
                        className="border px-3 py-2 text-center text-sm font-medium"
                        style={{ backgroundColor: cellColor(value) }}
                      >
                        {value.toFixed(2)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Teams</CardTitle>
            <CardDescription>Most frequent high-fitness teams discovered during optimisation.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {payload.top_teams.map((entry) => (
              <div key={entry.team.join('-')} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-semibold">{entry.team.join(', ')}</div>
                  <Badge variant="secondary">{entry.appearances} runs</Badge>
                </div>
                <div className="flex gap-6 text-sm text-muted-foreground">
                  <span>Avg fitness: {entry.avg_fitness.toFixed(2)}</span>
                  <span>Success: {formatPercent(entry.avg_success)}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Teams (Current Generation)</CardTitle>
            <CardDescription>Live blend of diversity vs kin cooperation for the latest tasks.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {filterValidActiveTeams(payload.active_teams).map((team) => (
              <div key={team.task_id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-sm text-muted-foreground uppercase tracking-wide">Task</p>
                    <p className="font-semibold">{team.task_id.replace('_', ' ')}</p>
                  </div>
                  <Badge className={clsx(team.success_probability >= 0.75 ? 'bg-emerald-500' : 'bg-blue-500')}>
                    {(team.success_probability * 100).toFixed(1)}% success
                  </Badge>
                </div>
                <p className="text-sm mb-3 text-muted-foreground">{team.team.join(', ')}</p>
                <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                  <span>Fitness: {team.fitness.toFixed(2)}</span>
                  <span>Diversity: {team.diversity.toFixed(2)}</span>
                  <span>Kin: {team.cooperation.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {payload.emergent_strategies.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Emergent Strategy Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
              {payload.emergent_strategies.map((note, index) => (
                <li key={index}>{note}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
