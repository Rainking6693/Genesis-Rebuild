'use client'

import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { fetchDashboardJson, toNumber } from '@/lib/api'

type BusinessStatus = 'building' | 'deployed' | 'earning' | 'failed' | 'paused'

interface BusinessSummary {
  id: string
  name: string
  status: BusinessStatus
  revenueMonthly: number
  revenueChangePct: number
  costsMonthly: number
  uptimePercent: number
  errorRatePercent: number
  traffic: number
  activeUsers: number
  team: string[]
  lastDeployedAt: string
  createdAt: string
  healthScore: number
}

interface BusinessesOverviewProps {
  selectedBusinessId?: string | null
  onSelectBusiness?: (business: BusinessSummary) => void
}

type ApiBusinessSummary = Record<string, any>

const REFRESH_INTERVAL_MS = 8000

const STATUS_META: Record<
  BusinessStatus,
  { label: string; description: string; badgeClass: string; bgClass: string }
> = {
  building: {
    label: 'Building',
    description: 'Automations still setting up the product',
    badgeClass: 'bg-blue-500/10 text-blue-500',
    bgClass: 'bg-blue-500/5',
  },
  deployed: {
    label: 'Deployed',
    description: 'Live but not yet monetising',
    badgeClass: 'bg-purple-500/10 text-purple-500',
    bgClass: 'bg-purple-500/5',
  },
  earning: {
    label: 'Earning',
    description: 'Actively generating revenue',
    badgeClass: 'bg-emerald-500/10 text-emerald-500',
    bgClass: 'bg-emerald-500/5',
  },
  failed: {
    label: 'Failed',
    description: 'Requires intervention',
    badgeClass: 'bg-red-500/10 text-red-500',
    bgClass: 'bg-red-500/5',
  },
  paused: {
    label: 'Paused',
    description: 'On hold awaiting human approval',
    badgeClass: 'bg-amber-500/10 text-amber-500',
    bgClass: 'bg-amber-500/5',
  },
}

const FALLBACK_BUSINESSES: BusinessSummary[] = [
  {
    id: 'saas-writer',
    name: 'DraftEdge SaaS',
    status: 'earning',
    revenueMonthly: 12850,
    revenueChangePct: 18.3,
    costsMonthly: 4320,
    uptimePercent: 99.4,
    errorRatePercent: 0.4,
    traffic: 48500,
    activeUsers: 3200,
    team: ['builder_agent', 'marketing_agent', 'support_agent'],
    lastDeployedAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 18).toISOString(),
    healthScore: 92,
  },
  {
    id: 'market-insights',
    name: 'MarketPulse Intelligence',
    status: 'deployed',
    revenueMonthly: 3250,
    revenueChangePct: 6.5,
    costsMonthly: 1890,
    uptimePercent: 98.2,
    errorRatePercent: 1.3,
    traffic: 16500,
    activeUsers: 830,
    team: ['analyst_agent', 'frontend_agent', 'qa_agent'],
    lastDeployedAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 9).toISOString(),
    healthScore: 84,
  },
  {
    id: 'ecommerce-dropship',
    name: 'Nebula Commerce',
    status: 'building',
    revenueMonthly: 0,
    revenueChangePct: 0,
    costsMonthly: 540,
    uptimePercent: 97.1,
    errorRatePercent: 2.1,
    traffic: 5200,
    activeUsers: 180,
    team: ['builder_agent', 'devops_agent', 'security_agent'],
    lastDeployedAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    healthScore: 71,
  },
  {
    id: 'content-network',
    name: 'Aurora Knowledge Hub',
    status: 'earning',
    revenueMonthly: 8420,
    revenueChangePct: 11.9,
    costsMonthly: 2930,
    uptimePercent: 99.1,
    errorRatePercent: 0.7,
    traffic: 90500,
    activeUsers: 5200,
    team: ['content_agent', 'seo_agent', 'support_agent'],
    lastDeployedAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 31).toISOString(),
    healthScore: 90,
  },
  {
    id: 'consulting-bot',
    name: 'LedgerLite Advisory',
    status: 'failed',
    revenueMonthly: 0,
    revenueChangePct: -100,
    costsMonthly: 780,
    uptimePercent: 88.4,
    errorRatePercent: 12.5,
    traffic: 1100,
    activeUsers: 54,
    team: ['finance_agent', 'qa_agent'],
    lastDeployedAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(),
    healthScore: 42,
  },
]

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value)

const formatPercent = (value: number, fractionDigits = 1) =>
  `${value >= 0 ? '+' : ''}${value.toFixed(fractionDigits)}%`

const formatNumber = (value: number) => new Intl.NumberFormat('en-US').format(value)

const mapStatus = (value?: unknown): BusinessStatus => {
  const normalised = typeof value === 'string' ? value.toLowerCase() : ''
  switch (normalised) {
    case 'earning':
    case 'live':
    case 'profitable':
      return 'earning'
    case 'deployed':
    case 'live_no_revenue':
      return 'deployed'
    case 'failed':
    case 'error':
      return 'failed'
    case 'paused':
    case 'on_hold':
      return 'paused'
    default:
      return 'building'
  }
}

const mapBusinesses = (payload: unknown): BusinessSummary[] => {
  if (!Array.isArray(payload)) return []

  return (payload as ApiBusinessSummary[]).map((item, index) => {
    const id = String(item.id ?? item.business_id ?? `business-${index}`)
    return {
      id,
      name: item.name ?? item.display_name ?? id,
      status: mapStatus(item.status),
      revenueMonthly: toNumber(item.revenue_monthly ?? item.revenue ?? 0),
      revenueChangePct: toNumber(item.revenue_change_pct ?? item.mrr_growth_pct ?? 0),
      costsMonthly: Math.max(0, toNumber(item.costs ?? item.operational_costs ?? 0)),
      uptimePercent: Math.min(100, Math.max(0, toNumber(item.uptime ?? item.uptime_percent ?? 0))),
      errorRatePercent: Math.max(0, toNumber(item.error_rate ?? item.error_rate_percent ?? 0)),
      traffic: Math.max(0, Math.round(toNumber(item.traffic ?? item.visits ?? 0))),
      activeUsers: Math.max(0, Math.round(toNumber(item.active_users ?? item.subscribers ?? 0))),
      team: Array.isArray(item.team)
        ? (item.team as unknown[]).map((member, i) => String(member ?? `agent_${i}`))
        : [],
      lastDeployedAt: (item.last_deployed_at ?? item.last_release_at ?? new Date().toISOString()) as string,
      createdAt: (item.created_at ?? new Date().toISOString()) as string,
      healthScore: Math.min(100, Math.max(0, toNumber(item.health_score ?? 75))),
    }
  })
}

const aggregateMetrics = (businesses: BusinessSummary[]) => {
  const totalRevenue = businesses.reduce((sum, business) => sum + business.revenueMonthly, 0)
  const totalCosts = businesses.reduce((sum, business) => sum + business.costsMonthly, 0)
  const liveBusinesses = businesses.filter((business) => business.status === 'earning' || business.status === 'deployed')
  const aggregateUptime =
    liveBusinesses.reduce((sum, business) => sum + business.uptimePercent, 0) / Math.max(liveBusinesses.length, 1)

  const monthlyGrowth =
    businesses.reduce((sum, business) => sum + business.revenueMonthly * (business.revenueChangePct / 100), 0) /
    Math.max(totalRevenue || 1, 1)

  return {
    totalRevenue,
    totalCosts,
    aggregateUptime,
    monthlyGrowth: monthlyGrowth * 100,
  }
}

const statusOrder: BusinessStatus[] = ['earning', 'deployed', 'building', 'paused', 'failed']

export function BusinessesOverview({ selectedBusinessId, onSelectBusiness }: BusinessesOverviewProps) {
  const [businesses, setBusinesses] = useState<BusinessSummary[]>(FALLBACK_BUSINESSES)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<BusinessStatus | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortKey, setSortKey] = useState<'revenue' | 'uptime' | 'traffic'>('revenue')

  useEffect(() => {
    const controller = new AbortController()

    const loadBusinesses = async () => {
      try {
        setLoading(true)
        setError(null)

        const data = await fetchDashboardJson('/businesses/overview', controller.signal)
        const normalised = mapBusinesses(data)

        if (normalised.length) {
          setBusinesses(normalised)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load businesses')
        // Fall back to static data
        setBusinesses(FALLBACK_BUSINESSES)
      } finally {
        setLoading(false)
      }
    }

    loadBusinesses()

    const interval = setInterval(() => {
      loadBusinesses()
    }, REFRESH_INTERVAL_MS)

    return () => {
      controller.abort()
      clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    if (!selectedBusinessId && businesses.length && onSelectBusiness) {
      onSelectBusiness(businesses[0])
    }
  }, [businesses, selectedBusinessId, onSelectBusiness])

  const statusCounts = useMemo(() => {
    return businesses.reduce<Record<BusinessStatus, number>>(
      (acc, business) => {
        acc[business.status] += 1
        return acc
      },
      { building: 0, deployed: 0, earning: 0, failed: 0, paused: 0 },
    )
  }, [businesses])

  const filteredBusinesses = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    const base = statusFilter === 'all' ? businesses : businesses.filter((business) => business.status === statusFilter)

    const filtered = query
      ? base.filter(
          (business) =>
            business.name.toLowerCase().includes(query) ||
            business.team.some((member) => member.toLowerCase().includes(query)),
        )
      : base

    return filtered
      .slice()
      .sort((a, b) => {
        if (sortKey === 'uptime') return b.uptimePercent - a.uptimePercent
        if (sortKey === 'traffic') return b.traffic - a.traffic
        return b.revenueMonthly - a.revenueMonthly
      })
      .sort((a, b) => statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status))
  }, [businesses, searchQuery, sortKey, statusFilter])

  const aggregates = useMemo(() => aggregateMetrics(businesses), [businesses])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Business Portfolio Overview</CardTitle>
          <CardDescription>
            Real-time snapshot across {businesses.length} autonomous businesses (
            {statusCounts.earning + statusCounts.deployed} live / {statusCounts.building} building)
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <SummaryMetric label="Monthly Recurring Revenue" value={formatCurrency(aggregates.totalRevenue)} />
          <SummaryMetric
            label="Operational Costs"
            value={formatCurrency(aggregates.totalCosts)}
            tone="muted"
            sublabel="Includes hosting + API usage"
          />
          <SummaryMetric
            label="Live Business Uptime"
            value={formatPercent(aggregates.aggregateUptime)}
            sublabel="Weighted across live sites"
          />
          <SummaryMetric
            label="Revenue Momentum"
            value={formatPercent(aggregates.monthlyGrowth)}
            tone={aggregates.monthlyGrowth >= 0 ? 'positive' : 'negative'}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <CardTitle>Businesses</CardTitle>
              <CardDescription>Click a business to inspect cost vs revenue performance and team activity</CardDescription>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex rounded-md border">
                <input
                  type="search"
                  placeholder="Search businesses or team members"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  className="w-full bg-transparent px-3 py-2 text-sm outline-none sm:w-64"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {(['all', ...statusOrder] as const).map((status) => {
                  const count = status === 'all' ? businesses.length : statusCounts[status]
                  const meta = status === 'all' ? null : STATUS_META[status]
                  return (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setStatusFilter(status)}
                      className={`flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium transition ${
                        statusFilter === status ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:border-primary/40'
                      }`}
                    >
                      {status === 'all' ? 'All' : meta?.label}
                      <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-foreground/70">
                        {count}
                      </span>
                    </button>
                  )
                })}
              </div>
              <div className="flex gap-2">
                <SortButton active={sortKey === 'revenue'} onClick={() => setSortKey('revenue')} label="Revenue" />
                <SortButton active={sortKey === 'uptime'} onClick={() => setSortKey('uptime')} label="Uptime" />
                <SortButton active={sortKey === 'traffic'} onClick={() => setSortKey('traffic')} label="Traffic" />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <p className="text-sm text-destructive">
              Failed to load live data ({error}). Showing most recent snapshot.
            </p>
          )}

          {loading && (
            <div className="rounded-md border border-dashed p-6 text-sm text-muted-foreground">
              Refreshing business telemetry…
            </div>
          )}

          <div className="grid gap-4">
            {filteredBusinesses.map((business) => {
              const meta = STATUS_META[business.status]
              const isSelected = selectedBusinessId === business.id
              const profit = business.revenueMonthly - business.costsMonthly
              const profitMargin = business.revenueMonthly
                ? (profit / Math.max(business.revenueMonthly, 1)) * 100
                : 0

              return (
                <button
                  key={business.id}
                  type="button"
                  onClick={() => onSelectBusiness?.(business)}
                  className={`w-full rounded-md border bg-card p-4 text-left shadow-sm transition hover:border-primary/40 hover:shadow-md ${
                    isSelected ? 'border-primary shadow-lg ring-2 ring-primary/30' : 'border-border'
                  }`}
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-lg font-semibold">{business.name}</h3>
                        <Badge className={meta.badgeClass}>{meta.label}</Badge>
                        <span className="text-xs text-muted-foreground">
                          Last deployed {new Date(business.lastDeployedAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="max-w-2xl text-sm text-muted-foreground">{meta.description}</p>
                      <div className="flex flex-wrap gap-2 text-xs">
                        {business.team.map((member) => (
                          <span
                            key={`${business.id}-${member}`}
                            className="rounded-full bg-muted px-2 py-1 font-medium text-muted-foreground"
                          >
                            {member}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="grid gap-3 text-sm md:grid-cols-3">
                      <MetricBlock
                        label="MRR"
                        primary={formatCurrency(business.revenueMonthly)}
                        secondary={`MoM ${formatPercent(business.revenueChangePct)}`}
                        tone={business.revenueChangePct >= 0 ? 'positive' : 'negative'}
                      />
                      <MetricBlock
                        label="Profit Margin"
                        primary={formatPercent(profitMargin)}
                        secondary={`Costs ${formatCurrency(business.costsMonthly)}`}
                        tone={profit >= 0 ? 'positive' : 'negative'}
                      />
                      <MetricBlock
                        label="Health"
                        primary={`${business.healthScore.toFixed(0)}/100`}
                        secondary={`Uptime ${formatPercent(business.uptimePercent)}`}
                      />
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 text-xs text-muted-foreground sm:grid-cols-3">
                    <HealthBar
                      label="Uptime"
                      value={business.uptimePercent}
                      description="Rolling 30-day availability"
                    />
                    <HealthBar
                      label="Error rate"
                      value={100 - Math.min(100, business.errorRatePercent)}
                      description={`Error rate ${formatPercent(business.errorRatePercent)}`}
                      inverted
                    />
                    <div className="rounded-md border bg-muted/40 px-3 py-2">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span>Traffic · Users</span>
                        <span>{formatNumber(business.traffic)}</span>
                      </div>
                      <p className="mt-1 text-[10px] text-muted-foreground">{business.activeUsers} active users</p>
                    </div>
                  </div>
                </button>
              )
            })}

            {!filteredBusinesses.length && (
              <div className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
                No businesses match the current filters.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

interface SummaryMetricProps {
  label: string
  value: string
  sublabel?: string
  tone?: 'default' | 'muted' | 'positive' | 'negative'
}

const SummaryMetric = ({ label, value, sublabel, tone = 'default' }: SummaryMetricProps) => {
  const toneClass =
    tone === 'positive'
      ? 'text-emerald-500'
      : tone === 'negative'
        ? 'text-red-500'
        : tone === 'muted'
          ? 'text-muted-foreground'
          : 'text-foreground'
  return (
    <div className="flex flex-col gap-1 rounded-md border bg-muted/40 p-3">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <span className={`text-xl font-semibold ${toneClass}`}>{value}</span>
      {sublabel && <span className="text-xs text-muted-foreground">{sublabel}</span>}
    </div>
  )
}

interface MetricBlockProps {
  label: string
  primary: string
  secondary?: string
  tone?: 'default' | 'positive' | 'negative'
}

const MetricBlock = ({ label, primary, secondary, tone = 'default' }: MetricBlockProps) => {
  const toneClass = tone === 'positive' ? 'text-emerald-500' : tone === 'negative' ? 'text-red-500' : 'text-foreground'
  return (
    <div className="rounded-md border bg-muted/30 px-3 py-2">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={`text-sm font-semibold ${toneClass}`}>{primary}</p>
      {secondary && <p className="text-[11px] text-muted-foreground">{secondary}</p>}
    </div>
  )
}

interface HealthBarProps {
  label: string
  value: number
  description?: string
  inverted?: boolean
}

const HealthBar = ({ label, value, description, inverted = false }: HealthBarProps) => {
  const clamped = Math.max(0, Math.min(100, value))
  const percentage = inverted ? 100 - clamped : clamped
  return (
    <div className="flex flex-col gap-1 rounded-md border bg-muted/40 p-3">
      <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
        <span>{label}</span>
        <span>{Math.round(clamped)}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={`h-2 rounded-full transition-all ${inverted ? 'bg-red-500/80' : 'bg-emerald-500/80'}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {description && <p className="text-[10px] text-muted-foreground">{description}</p>}
    </div>
  )
}

interface SortButtonProps {
  label: string
  active: boolean
  onClick: () => void
}

const SortButton = ({ label, active, onClick }: SortButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
      active ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:border-primary/40'
    }`}
  >
    Sort by {label}
  </button>
)

export type { BusinessSummary, BusinessStatus }
