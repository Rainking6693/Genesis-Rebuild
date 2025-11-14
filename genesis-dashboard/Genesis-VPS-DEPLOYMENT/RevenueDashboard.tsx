/**
 * Genesis Revenue Dashboard Component
 *
 * Add this file to: genesis-dashboard/src/components/RevenueDashboard.tsx
 *
 * Then add to Sidebar.tsx navigation:
 * { icon: DollarSign, label: 'Revenue & Profit', component: 'revenue' }
 */

'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Building2,
  Percent,
  Award,
  AlertCircle
} from 'lucide-react'

interface SystemMetrics {
  total_revenue: number
  total_costs: number
  total_profit: number
  profit_margin: number
  active_businesses: int
  total_businesses: number
  success_rate: number
  avg_quality_score: number
  businesses: BusinessMetrics[]
  last_updated: string
}

interface BusinessMetrics {
  business_id: string
  name: string
  type: string
  created_at: string
  status: string
  revenue_monthly: number
  costs_monthly: number
  profit_monthly: number
  quality_score: number
  deployment_url?: string
  last_revenue_update?: string
}

export default function RevenueDashboard() {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/revenue/metrics`
        )

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        setMetrics(data)
        setError(null)
      } catch (error) {
        console.error('Failed to fetch revenue metrics:', error)
        setError('Failed to load revenue data')
      } finally {
        setLoading(false)
      }
    }

    fetchMetrics()
    // Refresh every 30 seconds
    const interval = setInterval(fetchMetrics, 30000)

    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading revenue data...</p>
        </div>
      </div>
    )
  }

  if (error || !metrics) {
    return (
      <div className="flex items-center justify-center p-8">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              Error Loading Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{error || 'Failed to load revenue data'}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount)
  }

  const formatPercent = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Revenue & Profit Dashboard</h2>
          <p className="text-muted-foreground">
            Real-time financial metrics for Genesis-generated businesses
          </p>
        </div>
        <div className="text-right text-sm text-muted-foreground">
          Last updated: {new Date(metrics.last_updated).toLocaleString()}
        </div>
      </div>

      {/* System-Wide Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Monthly Revenue */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(metrics.total_revenue)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              From {metrics.active_businesses} active business{metrics.active_businesses !== 1 ? 'es' : ''}
            </p>
          </CardContent>
        </Card>

        {/* Monthly Profit */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Profit</CardTitle>
            {metrics.total_profit >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${
              metrics.total_profit >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {formatCurrency(metrics.total_profit)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {formatPercent(metrics.profit_margin)} margin
            </p>
          </CardContent>
        </Card>

        {/* Active Businesses */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Businesses</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.active_businesses}</div>
            <p className="text-xs text-muted-foreground mt-1">
              of {metrics.total_businesses} total businesses
            </p>
          </CardContent>
        </Card>

        {/* Success Rate */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPercent(metrics.success_rate)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Profitable businesses
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Cost Breakdown */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Financial Overview</CardTitle>
            <CardDescription>Monthly revenue, costs, and profit breakdown</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Total Revenue</span>
              <span className="text-sm font-bold">{formatCurrency(metrics.total_revenue)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Total Costs</span>
              <span className="text-sm text-red-600">-{formatCurrency(metrics.total_costs)}</span>
            </div>
            <div className="border-t pt-4">
              <div className="flex items-center justify-between">
                <span className="text-base font-bold">Net Profit</span>
                <span className={`text-base font-bold ${
                  metrics.total_profit >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {formatCurrency(metrics.total_profit)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Quality Metrics
            </CardTitle>
            <CardDescription>Average quality score and performance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Avg Quality Score</span>
              <span className="text-sm font-bold">{metrics.avg_quality_score.toFixed(1)}/100</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Success Rate</span>
              <span className="text-sm font-bold">{formatPercent(metrics.success_rate)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Active Rate</span>
              <span className="text-sm font-bold">
                {formatPercent((metrics.active_businesses / metrics.total_businesses) * 100)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Per-Business Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Business Breakdown</CardTitle>
          <CardDescription>
            Revenue and profit by individual business
          </CardDescription>
        </CardHeader>
        <CardContent>
          {metrics.businesses.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No active businesses found
            </div>
          ) : (
            <div className="space-y-4">
              {metrics.businesses.map((business) => (
                <div
                  key={business.business_id}
                  className="flex items-center justify-between border-b pb-4 last:border-b-0"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{business.name}</p>
                      <span className="text-xs px-2 py-1 rounded-full bg-secondary">
                        {business.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Quality: {business.quality_score.toFixed(0)}/100</span>
                      <span>•</span>
                      <span>Created: {new Date(business.created_at).toLocaleDateString()}</span>
                      {business.deployment_url && (
                        <>
                          <span>•</span>
                          <a
                            href={business.deployment_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            View Live
                          </a>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="font-medium">{formatCurrency(business.revenue_monthly)}</p>
                    <p className={`text-sm ${
                      business.profit_monthly >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {business.profit_monthly >= 0 ? '+' : ''}{formatCurrency(business.profit_monthly)} profit
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatCurrency(business.costs_monthly)} costs
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
