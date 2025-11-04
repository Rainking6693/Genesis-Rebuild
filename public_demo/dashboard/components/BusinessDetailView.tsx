'use client'

import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { fetchDashboardJson, toNumber } from '@/lib/api'
import type { BusinessSummary, BusinessStatus } from '@/components/BusinessesOverview'

type ActivityCategory = 'deployment' | 'incident' | 'marketing' | 'product' | 'finance'

interface BusinessDetail extends BusinessSummary {
  description: string
  website?: string
  totalRevenueAllTime: number
  totalCostsAllTime: number
  profitMargin: number
  revenueHistory: TrendPoint[]
  trafficHistory: TrendPoint[]
  agentActivity: Array<{
    timestamp: string
    agent: string
    summary: string
    category: ActivityCategory
  }>
  teamMembers: Array<{
    name: string
    role: string
    status: 'active' | 'on-call' | 'standby'
    timezone?: string
  }>
  integrations: string[]
  riskiestAlerts: string[]
  notes?: string
}

interface TrendPoint {
  timestamp: string
  revenue: number
  cost: number
  visitors: number
}

interface BusinessDetailViewProps {
  businessId?: string | null
  businessName?: string | null
}

type ApiBusinessDetail = Record<string, any>

const FALLBACK_SUMMARIES = Object.freeze([
  {
    id: 'saas-writer',
    name: 'DraftEdge SaaS',
    status: 'earning' as BusinessStatus,
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
    status: 'deployed' as BusinessStatus,
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
    status: 'building' as BusinessStatus,
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
    status: 'earning' as BusinessStatus,
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
    status: 'failed' as BusinessStatus,
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
])

const FALLBACK_DETAILS: Record<string, BusinessDetail> = {
  'saas-writer': {
    ...FALLBACK_SUMMARY('saas-writer'),
    description: 'AI-assisted meeting minutes generator targeting mid-market customer success teams.',
    website: 'https://draftedge.example.com',
    totalRevenueAllTime: 64200,
    totalCostsAllTime: 21800,
    profitMargin: 66,
    revenueHistory: generateTrend(30, 480, 620, 320, 410),
    trafficHistory: generateTrend(30, 1400, 4800, 800, 2300),
    agentActivity: [
      {
        timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
        agent: 'builder_agent',
        summary: 'Rolled out new AI summarisation prompt after A/B experiment showed +8% retention.',
        category: 'product',
      },
      {
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
        agent: 'marketing_agent',
        summary: 'Launched targeted LinkedIn campaign for customer success leads (CPC $2.41).',
        category: 'marketing',
      },
      {
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
        agent: 'support_agent',
        summary: 'Resolved spike in PDF export failures within 9 minutes (postmortem published).',
        category: 'incident',
      },
    ],
    teamMembers: [
      { name: 'builder_agent', role: 'Product/Engineering', status: 'active', timezone: 'UTC+0' },
      { name: 'marketing_agent', role: 'Growth', status: 'active', timezone: 'UTC-4' },
      { name: 'support_agent', role: 'Customer Success', status: 'on-call', timezone: 'UTC+5' },
    ],
    integrations: ['Stripe', 'Notion Sync', 'Slack Bot', 'Segment'],
    riskiestAlerts: ['Increase rate-limit guardrails for PDF export', 'Plan load testing pre Black Friday'],
    notes: 'Next milestone: launch AI-generated executive summaries with configurable compliance filters.',
  },
  'market-insights': {
    ...FALLBACK_SUMMARY('market-insights'),
    description: 'Daily AI-generated market intelligence brief for venture analysts.',
    website: 'https://marketpulse.example.com',
    totalRevenueAllTime: 18900,
    totalCostsAllTime: 8400,
    profitMargin: 55,
    revenueHistory: generateTrend(30, 120, 340, 95, 180),
    trafficHistory: generateTrend(30, 380, 1100, 240, 620),
    agentActivity: [
      {
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
        agent: 'analyst_agent',
        summary: 'Curated 12 trending startup funding rounds with automated commentary.',
        category: 'product',
      },
      {
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 9).toISOString(),
        agent: 'frontend_agent',
        summary: 'Improved report layout for mobile consumption (+14% mobile session duration).',
        category: 'product',
      },
    ],
    teamMembers: [
      { name: 'analyst_agent', role: 'Research', status: 'active' },
      { name: 'frontend_agent', role: 'UX/UI', status: 'active' },
      { name: 'qa_agent', role: 'Quality Assurance', status: 'standby' },
    ],
    integrations: ['SerpAPI', 'OpenFIGI', 'Anthropic Claude 3.5'],
    riskiestAlerts: ['Need compliance review on EU market coverage'],
  },
  'ecommerce-dropship': {
    ...FALLBACK_SUMMARY('ecommerce-dropship'),
    description: 'Automated dropshipping storefront for minimalist desk accessories.',
    website: 'https://nebulacommerce.example.com',
    totalRevenueAllTime: 620,
    totalCostsAllTime: 980,
    profitMargin: -58,
    revenueHistory: generateTrend(30, 10, 120, 25, 160),
    trafficHistory: generateTrend(30, 80, 760, 45, 420),
    agentActivity: [
      {
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        agent: 'builder_agent',
        summary: 'Fixing checkout flow regression introduced by currency localisation patch.',
        category: 'incident',
      },
      {
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 14).toISOString(),
        agent: 'security_agent',
        summary: 'Hardened Stripe webhook verification after anomaly detection alert.',
        category: 'finance',
      },
    ],
    teamMembers: [
      { name: 'builder_agent', role: 'Storefront Engineering', status: 'active' },
      { name: 'devops_agent', role: 'Infrastructure', status: 'standby' },
      { name: 'security_agent', role: 'Security', status: 'active' },
    ],
    integrations: ['Shopify API', 'Stripe', 'Shippo'],
    riskiestAlerts: ['Velocity of failed payments above baseline', 'Consider pausing ad spend until conversion stabilises'],
  },
  'content-network': {
    ...FALLBACK_SUMMARY('content-network'),
    description: 'Knowledge hub for data professionals with monetised premium tutorials.',
    website: 'https://aurorahub.example.com',
    totalRevenueAllTime: 98400,
    totalCostsAllTime: 32650,
    profitMargin: 67,
    revenueHistory: generateTrend(30, 820, 990, 310, 380),
    trafficHistory: generateTrend(30, 2100, 10800, 1600, 7800),
    agentActivity: [
      {
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
        agent: 'content_agent',
        summary: 'Published 5-part tutorial on probabilistic forecasting – 1.6k subscribers engaged.',
        category: 'marketing',
      },
      {
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 7).toISOString(),
        agent: 'seo_agent',
        summary: 'Optimised internal linking, boosting click-through by 11%.',
        category: 'marketing',
      },
    ],
    teamMembers: [
      { name: 'content_agent', role: 'Editorial', status: 'active' },
      { name: 'seo_agent', role: 'Traffic', status: 'active' },
      { name: 'support_agent', role: 'Subscriber Success', status: 'active' },
    ],
    integrations: ['Mailgun', 'Stripe', 'Google Analytics', 'Supabase'],
    riskiestAlerts: ['Plan premium-only webinar to retain annual subscribers'],
  },
  'consulting-bot': {
    ...FALLBACK_SUMMARY('consulting-bot'),
    description: 'Financial advisory bot for SMB bookkeeping – currently paused pending compliance review.',
    website: undefined,
    totalRevenueAllTime: 1200,
    totalCostsAllTime: 2100,
    profitMargin: -43,
    revenueHistory: generateTrend(30, 20, 150, 55, 210),
    trafficHistory: generateTrend(30, 25, 240, 15, 80),
    agentActivity: [
      {
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
        agent: 'qa_agent',
        summary: 'Discovered inaccurate tax advice responses – flagged for manual review.',
        category: 'incident',
      },
      {
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 60).toISOString(),
        agent: 'finance_agent',
        summary: 'Paused automated campaigns pending compliance clearance.',
        category: 'finance',
      },
    ],
    teamMembers: [
      { name: 'finance_agent', role: 'Domain Expert', status: 'paused' },
      { name: 'qa_agent', role: 'Quality Assurance', status: 'active' },
    ],
    integrations: ['Plaid Sandbox', 'QuickBooks API'],
    riskiestAlerts: ['Legal review pending – do not resume operations without approval'],
  },
}

function FALLBACK_SUMMARY(id: string): BusinessSummary {
  const summary = FALLBACK_SUMMARIES.find((business) => business.id === id)
  if (!summary) throw new Error(`Unknown fallback summary: ${id}`)
  return summary
}

function generateTrend(
  points: number,
  minRevenue: number,
  maxRevenue: number,
  minVisitors: number,
  maxVisitors: number,
): TrendPoint[] {
  const trend: TrendPoint[] = []
  for (let index = points - 1; index >= 0; index--) {
    const baseDate = new Date(Date.now() - index * 24 * 60 * 60 * 1000)
    const dailyRevenue = randomInRange(minRevenue, maxRevenue)
    const dailyCost = dailyRevenue * randomInRange(0.3, 0.55)
    trend.push({
      timestamp: baseDate.toISOString(),
      revenue: Math.round(dailyRevenue),
      cost: Math.round(dailyCost),
      visitors: Math.round(randomInRange(minVisitors, maxVisitors)),
    })
  }
  return trend
}

function randomInRange(min: number, max: number) {
  return Math.random() * (max - min) + min
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value)

const formatPercent = (value: number, fractionDigits = 1) =>
  `${value >= 0 ? '+' : ''}${value.toFixed(fractionDigits)}%`

const mapBusinessDetail = (payload: ApiBusinessDetail, fallbackId: string): BusinessDetail => {
  const fallback = FALLBACK_DETAILS[fallbackId]
  const summary = mapSummary(payload, fallback)
  const history = Array.isArray(payload.revenue_history)
    ? (payload.revenue_history as any[]).map((point) => ({
        timestamp: String(point.timestamp ?? new Date().toISOString()),
        revenue: Math.round(toNumber(point.revenue ?? point.mrr ?? 0)),
        cost: Math.round(toNumber(point.cost ?? point.expenses ?? 0)),
        visitors: Math.round(toNumber(point.visitors ?? point.sessions ?? 0)),
      }))
    : fallback.revenueHistory

  const activity = Array.isArray(payload.activity_log)
    ? (payload.activity_log as any[]).map((item) => ({
        timestamp: String(item.timestamp ?? new Date().toISOString()),
        agent: String(item.agent ?? 'unknown_agent'),
        summary: String(item.summary ?? item.description ?? 'No activity summary provided'),
        category: (['deployment', 'incident', 'marketing', 'product', 'finance'] as ActivityCategory[]).includes(
          item.category,
        )
          ? (item.category as ActivityCategory)
          : 'product',
      }))
    : fallback.agentActivity

  const teamMembers = Array.isArray(payload.team_members)
    ? (payload.team_members as any[]).map((member) => ({
        name: String(member.name ?? member.agent ?? 'agent'),
        role: String(member.role ?? 'Contributor'),
        status: ['active', 'on-call', 'standby'].includes(member.status) ? member.status : 'active',
        timezone: member.timezone ? String(member.timezone) : undefined,
      }))
    : fallback.teamMembers

  return {
    ...summary,
    description: String(payload.description ?? fallback.description),
    website: payload.website ?? payload.url ?? fallback.website,
    totalRevenueAllTime: toNumber(payload.total_revenue ?? payload.total_revenue_all_time ?? fallback.totalRevenueAllTime),
    totalCostsAllTime: toNumber(payload.total_costs ?? payload.total_costs_all_time ?? fallback.totalCostsAllTime),
    profitMargin: toNumber(payload.profit_margin ?? fallback.profitMargin),
    revenueHistory: history,
    trafficHistory: Array.isArray(payload.traffic_history) ? payload.traffic_history : fallback.trafficHistory,
    agentActivity: activity,
    teamMembers,
    integrations: Array.isArray(payload.integrations) ? payload.integrations.map(String) : fallback.integrations,
    riskiestAlerts: Array.isArray(payload.riskiest_alerts)
      ? payload.riskiest_alerts.map(String)
      : fallback.riskiestAlerts,
    notes: payload.notes ?? fallback.notes,
  }
}

const mapSummary = (payload: ApiBusinessDetail, fallback: BusinessSummary): BusinessSummary => ({
  id: String(payload.id ?? fallback.id),
  name: String(payload.name ?? fallback.name),
  status: mapStatus(payload.status ?? fallback.status),
  revenueMonthly: toNumber(payload.revenue_monthly ?? fallback.revenueMonthly),
  revenueChangePct: toNumber(payload.revenue_change_pct ?? fallback.revenueChangePct),
  costsMonthly: toNumber(payload.costs_monthly ?? fallback.costsMonthly),
  uptimePercent: toNumber(payload.uptime_percent ?? fallback.uptimePercent),
  errorRatePercent: toNumber(payload.error_rate_percent ?? fallback.errorRatePercent),
  traffic: Math.round(toNumber(payload.traffic ?? fallback.traffic)),
  activeUsers: Math.round(toNumber(payload.active_users ?? fallback.activeUsers)),
  team: Array.isArray(payload.team) ? payload.team.map(String) : fallback.team,
  lastDeployedAt: String(payload.last_deployed_at ?? fallback.lastDeployedAt),
  createdAt: String(payload.created_at ?? fallback.createdAt),
  healthScore: toNumber(payload.health_score ?? fallback.healthScore),
})

const mapStatus = (value: unknown): BusinessStatus => {
  const normalised = typeof value === 'string' ? value.toLowerCase() : ''
  if (['earning', 'live', 'revenue'].includes(normalised)) return 'earning'
  if (['failed', 'error'].includes(normalised)) return 'failed'
  if (['paused', 'on_hold'].includes(normalised)) return 'paused'
  if (['deployed', 'launched'].includes(normalised)) return 'deployed'
  return 'building'
}

export function BusinessDetailView({ businessId, businessName }: BusinessDetailViewProps) {
  const [detail, setDetail] = useState<BusinessDetail | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!businessId) {
      setDetail(null)
      return
    }

    const controller = new AbortController()
    const fallback = FALLBACK_DETAILS[businessId] ?? FALLBACK_DETAILS['saas-writer']

    const loadDetail = async () => {
      try {
        setLoading(true)
        setError(null)

        const payload = await fetchDashboardJson<ApiBusinessDetail>(`/businesses/${businessId}`, controller.signal)
        setDetail(mapBusinessDetail(payload, fallback.id))
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to fetch business detail')
        setDetail(fallback)
      } finally {
        setLoading(false)
      }
    }

    loadDetail()

    return () => controller.abort()
  }, [businessId])

  const displayDetail = useMemo(() => {
    if (detail) return detail
    if (businessId && FALLBACK_DETAILS[businessId]) return FALLBACK_DETAILS[businessId]
    return null
  }, [businessId, detail])

  if (!businessId) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Business detail</CardTitle>
          <CardDescription>Select a business to inspect detailed telemetry, costs, and agent activity.</CardDescription>
        </CardHeader>
        <CardContent className="flex h-72 items-center justify-center text-sm text-muted-foreground">
          Choose a business from the list to the left to load cost, revenue, and operational history.
        </CardContent>
      </Card>
    )
  }

  if (loading && !displayDetail) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>{businessName ?? 'Business detail'}</CardTitle>
          <CardDescription>Loading latest metrics…</CardDescription>
        </CardHeader>
        <CardContent className="flex h-72 items-center justify-center text-sm text-muted-foreground">
          Fetching live telemetry data…
        </CardContent>
      </Card>
    )
  }

  if (!displayDetail) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>{businessName ?? 'Business detail'}</CardTitle>
          <CardDescription>No telemetry available yet.</CardDescription>
        </CardHeader>
        <CardContent className="flex h-72 items-center justify-center text-sm text-destructive">
          {error ?? 'Unable to locate business details'}
        </CardContent>
      </Card>
    )
  }

  const profit = displayDetail.revenueMonthly - displayDetail.costsMonthly

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="space-y-3">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <CardTitle>{displayDetail.name}</CardTitle>
              <Badge>{displayDetail.status.toUpperCase()}</Badge>
            </div>
            <CardDescription>{displayDetail.description}</CardDescription>
          </div>
          <div className="grid gap-3 text-sm md:grid-cols-2">
            <div>
              <span className="font-medium text-foreground">Monthly revenue</span>
              <p className="text-lg font-semibold">{formatCurrency(displayDetail.revenueMonthly)}</p>
              <p className="text-xs text-muted-foreground">
                Change {formatPercent(displayDetail.revenueChangePct)} (vs last 30 days)
              </p>
            </div>
            <div>
              <span className="font-medium text-foreground">Costs</span>
              <p className="text-lg font-semibold">{formatCurrency(displayDetail.costsMonthly)}</p>
              <p className="text-xs text-muted-foreground">
                Profit margin {formatPercent(displayDetail.profitMargin)}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span>Created {new Date(displayDetail.createdAt).toLocaleDateString()}</span>
            <span>Last deployed {new Date(displayDetail.lastDeployedAt).toLocaleString()}</span>
            {displayDetail.website && (
              <a
                href={displayDetail.website}
                target="_blank"
                rel="noreferrer"
                className="text-primary underline underline-offset-2"
              >
                Visit production site
              </a>
            )}
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 text-sm">
          <div className="grid gap-3 sm:grid-cols-2">
            <MetricTile
              label="All-time revenue"
              value={formatCurrency(displayDetail.totalRevenueAllTime)}
              helper="Cumulative across all deployments"
            />
            <MetricTile
              label="All-time operational costs"
              value={formatCurrency(displayDetail.totalCostsAllTime)}
              helper="Includes compute, APIs, marketing"
            />
            <MetricTile
              label="Active subscribers"
              value={displayDetail.activeUsers.toLocaleString()}
              helper="Active users in the last 30 days"
            />
            <MetricTile
              label="Traffic (30d)"
              value={displayDetail.traffic.toLocaleString()}
              helper="Unique visits aggregated across channels"
            />
          </div>
          {displayDetail.notes && (
            <div className="rounded-md border bg-muted/40 p-3 text-xs text-muted-foreground">
              <span className="font-medium text-foreground">Latest note:</span> {displayDetail.notes}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Financial performance</CardTitle>
          <CardDescription>Revenue vs cost trend with projected profit runway.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <SparklineGroup trend={displayDetail.revenueHistory} />
          <div className="rounded-md border bg-muted/40 p-3 text-xs text-muted-foreground">
            Current monthly profit {formatCurrency(profit)} · Health score {displayDetail.healthScore.toFixed(0)} ·
            Uptime {displayDetail.uptimePercent.toFixed(1)}% · Error rate {displayDetail.errorRatePercent.toFixed(2)}%
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Team roster</CardTitle>
          <CardDescription>Active agents and their current focus areas.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {displayDetail.teamMembers.map((member) => (
            <div key={member.name} className="flex items-start justify-between gap-3 rounded-md border bg-muted/40 p-3">
              <div>
                <p className="font-medium text-foreground">{member.name}</p>
                <p className="text-xs text-muted-foreground">{member.role}</p>
                {member.timezone && <p className="text-[10px] text-muted-foreground">Timezone {member.timezone}</p>}
              </div>
              <Badge variant="outline" className="text-xs uppercase">
                {member.status}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Agent activity timeline</CardTitle>
          <CardDescription>Recent events contributing to performance.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {displayDetail.agentActivity.map((event) => (
            <div key={`${event.timestamp}-${event.agent}`} className="flex gap-3 rounded-md border bg-muted/30 p-3">
              <div className="flex w-24 flex-col text-xs text-muted-foreground">
                <span>{new Date(event.timestamp).toLocaleDateString()}</span>
                <span>{new Date(event.timestamp).toLocaleTimeString()}</span>
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold text-foreground">{event.agent}</span>
                  <Badge variant="outline" className="text-[10px] uppercase">
                    {event.category}
                  </Badge>
                </div>
                <p className="text-sm text-foreground">{event.summary}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Integrations & risks</CardTitle>
          <CardDescription>External systems and current watch items.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div>
            <p className="text-xs font-medium uppercase text-muted-foreground">Integrations</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {displayDetail.integrations.map((integration) => (
                <Badge key={integration} variant="secondary" className="text-xs">
                  {integration}
                </Badge>
              ))}
            </div>
          </div>
          {displayDetail.riskiestAlerts.length > 0 && (
            <div>
              <p className="text-xs font-medium uppercase text-muted-foreground">Risks & alerts</p>
              <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                {displayDetail.riskiestAlerts.map((alert) => (
                  <li key={alert} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-amber-500" />
                    <span>{alert}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

interface MetricTileProps {
  label: string
  value: string
  helper?: string
}

const MetricTile = ({ label, value, helper }: MetricTileProps) => (
  <div className="rounded-md border bg-muted/40 p-3">
    <p className="text-xs font-medium text-muted-foreground">{label}</p>
    <p className="text-lg font-semibold text-foreground">{value}</p>
    {helper && <p className="text-[10px] text-muted-foreground">{helper}</p>}
  </div>
)

interface SparklineGroupProps {
  trend: TrendPoint[]
}

const SparklineGroup = ({ trend }: SparklineGroupProps) => {
  const revenueSeries = trend.map((point) => point.revenue)
  const costSeries = trend.map((point) => point.cost)
  const visitorsSeries = trend.map((point) => point.visitors)

  return (
    <div className="space-y-4">
      <TrendSparkline title="Revenue (30d)" series={revenueSeries} tone="positive" />
      <TrendSparkline title="Costs (30d)" series={costSeries} tone="muted" />
      <TrendSparkline title="Visitors (30d)" series={visitorsSeries} tone="positive" />
    </div>
  )
}

interface TrendSparklineProps {
  title: string
  series: number[]
  tone?: 'positive' | 'muted'
}

const TrendSparkline = ({ title, series, tone = 'positive' }: TrendSparklineProps) => {
  const path = buildSparkPath(series, 160, 48)
  const gradientId = `${title.replace(/\s+/g, '-')}-gradient`
  const color = tone === 'positive' ? '#10b981' : '#6366f1'

  return (
    <div className="rounded-md border bg-muted/30 p-3">
      <p className="text-xs font-medium text-muted-foreground">{title}</p>
      <svg viewBox="0 0 160 48" className="mt-2 h-16 w-full">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.4} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <path d={path} fill={`url(#${gradientId})`} stroke={color} strokeWidth={2} strokeLinecap="round" />
      </svg>
      <p className="mt-1 text-[10px] text-muted-foreground">High · {Math.max(...series).toLocaleString()}</p>
    </div>
  )
}

const buildSparkPath = (series: number[], width: number, height: number): string => {
  if (!series.length) return ''
  const max = Math.max(...series)
  const min = Math.min(...series)
  const range = max - min || 1
  const step = width / (series.length - 1)

  const points = series.map((value, index) => {
    const x = index * step
    const y = height - ((value - min) / range) * height
    return { x, y }
  })

  const line = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x.toFixed(2)},${point.y.toFixed(2)}`)
  const area = `${line.join(' ')} L ${width},${height} L 0,${height} Z`
  return area
}
