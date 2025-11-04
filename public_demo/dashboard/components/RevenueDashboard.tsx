'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  CreditCard, 
  RefreshCw,
  AlertCircle,
  Calendar,
  PieChart,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'

// ============================================================================
// TYPES
// ============================================================================

interface RevenueMetrics {
  total_revenue: number
  total_revenue_ytd: number
  mrr: number // Monthly Recurring Revenue
  arr: number // Annual Recurring Revenue
  revenue_growth_rate: number // % change from previous period
  active_businesses: number
  revenue_generating_businesses: number
  avg_revenue_per_business: number
  last_updated: string
}

interface BusinessRevenue {
  business_id: string
  business_name: string
  business_type: string
  revenue_total: number
  revenue_current_month: number
  projected_mrr: number
  confidence_score: number
  payment_count: number
  last_payment_date: string | null
  status: 'active' | 'paused' | 'churned'
}

interface RevenueTrend {
  date: string
  revenue: number
  payment_count: number
  new_businesses: number
}

interface PaymentMethodBreakdown {
  method: string
  count: number
  total_amount: number
  percentage: number
}

interface RefundStats {
  total_refunds: number
  refund_amount: number
  refund_rate: number // % of total transactions
  avg_refund_amount: number
}

interface AnalyticsData {
  roi_by_business: Array<{
    business_id: string
    business_name: string
    revenue: number
    cost: number
    roi: number
    roi_percentage: number
  }>
  churn_analysis: {
    churned_count: number
    churn_rate: number
    at_risk_count: number
    retention_rate: number
  }
  revenue_forecast: Array<{
    date: string
    predicted_revenue: number
    confidence_interval_low: number
    confidence_interval_high: number
  }>
}

// ============================================================================
// MOCK DATA (Fallback when Prometheus/MongoDB unavailable)
// ============================================================================

const MOCK_METRICS: RevenueMetrics = {
  total_revenue: 245678.90,
  total_revenue_ytd: 2156789.45,
  mrr: 78456.30,
  arr: 941475.60,
  revenue_growth_rate: 23.4,
  active_businesses: 47,
  revenue_generating_businesses: 42,
  avg_revenue_per_business: 5225.08,
  last_updated: new Date().toISOString()
}

const MOCK_BUSINESS_REVENUE: BusinessRevenue[] = [
  {
    business_id: 'biz_001',
    business_name: 'AI Writing Assistant',
    business_type: 'SaaS',
    revenue_total: 45678.90,
    revenue_current_month: 8456.30,
    projected_mrr: 9200.00,
    confidence_score: 0.89,
    payment_count: 234,
    last_payment_date: '2025-11-04T10:23:45Z',
    status: 'active'
  },
  {
    business_id: 'biz_002',
    business_name: 'Crypto News Hub',
    business_type: 'Content',
    revenue_total: 23456.78,
    revenue_current_month: 4123.45,
    projected_mrr: 4500.00,
    confidence_score: 0.76,
    payment_count: 156,
    last_payment_date: '2025-11-03T15:42:11Z',
    status: 'active'
  },
  {
    business_id: 'biz_003',
    business_name: 'Prompt Template Store',
    business_type: 'Digital Products',
    revenue_total: 18923.45,
    revenue_current_month: 3234.56,
    projected_mrr: 3100.00,
    confidence_score: 0.82,
    payment_count: 89,
    last_payment_date: '2025-11-04T09:15:32Z',
    status: 'active'
  },
  {
    business_id: 'biz_004',
    business_name: 'Code Review Bot',
    business_type: 'SaaS',
    revenue_total: 34567.89,
    revenue_current_month: 6789.12,
    projected_mrr: 7200.00,
    confidence_score: 0.91,
    payment_count: 178,
    last_payment_date: '2025-11-04T11:05:22Z',
    status: 'active'
  },
  {
    business_id: 'biz_005',
    business_name: 'API Documentation Generator',
    business_type: 'SaaS',
    revenue_total: 12345.67,
    revenue_current_month: 2345.67,
    projected_mrr: 2500.00,
    confidence_score: 0.73,
    payment_count: 67,
    last_payment_date: '2025-11-02T14:33:21Z',
    status: 'active'
  }
]

const MOCK_TRENDS: RevenueTrend[] = Array.from({ length: 30 }, (_, i) => {
  const date = new Date()
  date.setDate(date.getDate() - (29 - i))
  return {
    date: date.toISOString().split('T')[0],
    revenue: 5000 + Math.random() * 3000 + (i * 150),
    payment_count: 30 + Math.floor(Math.random() * 20),
    new_businesses: Math.floor(Math.random() * 3)
  }
})

const MOCK_PAYMENT_METHODS: PaymentMethodBreakdown[] = [
  { method: 'Stripe Card', count: 567, total_amount: 145678.90, percentage: 59.3 },
  { method: 'Stripe Subscription', count: 234, total_amount: 78456.30, percentage: 31.9 },
  { method: 'One-time Payment', count: 123, total_amount: 21543.70, percentage: 8.8 }
]

const MOCK_REFUNDS: RefundStats = {
  total_refunds: 23,
  refund_amount: 3456.78,
  refund_rate: 2.3,
  avg_refund_amount: 150.29
}

const MOCK_ANALYTICS: AnalyticsData = {
  roi_by_business: MOCK_BUSINESS_REVENUE.map(b => ({
    business_id: b.business_id,
    business_name: b.business_name,
    revenue: b.revenue_total,
    cost: b.revenue_total * 0.3, // Assume 30% cost
    roi: b.revenue_total * 0.7,
    roi_percentage: 233.3
  })),
  churn_analysis: {
    churned_count: 5,
    churn_rate: 9.6,
    at_risk_count: 8,
    retention_rate: 90.4
  },
  revenue_forecast: Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() + i + 1)
    const base = 8000 + (i * 300)
    return {
      date: date.toISOString().split('T')[0],
      predicted_revenue: base,
      confidence_interval_low: base * 0.85,
      confidence_interval_high: base * 1.15
    }
  })
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}

function formatPercentage(value: number): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return 'Never'
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`
  if (diffMins < 10080) return `${Math.floor(diffMins / 1440)}d ago`
  return date.toLocaleDateString()
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function RevenueDashboard() {
  const [metrics, setMetrics] = useState<RevenueMetrics>(MOCK_METRICS)
  const [businesses, setBusinesses] = useState<BusinessRevenue[]>(MOCK_BUSINESS_REVENUE)
  const [trends, setTrends] = useState<RevenueTrend[]>(MOCK_TRENDS)
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodBreakdown[]>(MOCK_PAYMENT_METHODS)
  const [refunds, setRefunds] = useState<RefundStats>(MOCK_REFUNDS)
  const [analytics, setAnalytics] = useState<AnalyticsData>(MOCK_ANALYTICS)
  const [loading, setLoading] = useState(false)
  const [useFallback, setUseFallback] = useState(true)
  const [sortBy, setSortBy] = useState<'revenue' | 'growth' | 'confidence'>('revenue')

  // Fetch real data from Prometheus/MongoDB
  const fetchRevenueData = async () => {
    setLoading(true)
    try {
      // Try to fetch from backend API (if available)
      const response = await fetch('/api/revenue/metrics', {
        signal: AbortSignal.timeout(5000)
      })
      
      if (response.ok) {
        const data = await response.json()
        setMetrics(data.metrics)
        setBusinesses(data.businesses)
        setTrends(data.trends)
        setPaymentMethods(data.payment_methods)
        setRefunds(data.refunds)
        setUseFallback(false)
      } else {
        throw new Error('API unavailable')
      }
    } catch (error) {
      console.warn('Revenue API unavailable, using mock data:', error)
      setUseFallback(true)
      // Mock data already set in state initialization
    } finally {
      setLoading(false)
    }
  }

  // Fetch analytics from Python script
  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/revenue/analytics', {
        signal: AbortSignal.timeout(5000)
      })
      
      if (response.ok) {
        const data = await response.json()
        setAnalytics(data)
      }
    } catch (error) {
      console.warn('Analytics API unavailable, using mock data:', error)
    }
  }

  useEffect(() => {
    fetchRevenueData()
    fetchAnalytics()
    
    // Refresh every 60 seconds
    const interval = setInterval(() => {
      fetchRevenueData()
      fetchAnalytics()
    }, 60000)
    
    return () => clearInterval(interval)
  }, [])

  // Sort businesses
  const sortedBusinesses = [...businesses].sort((a, b) => {
    switch (sortBy) {
      case 'revenue':
        return b.revenue_current_month - a.revenue_current_month
      case 'growth':
        return (b.projected_mrr - b.revenue_current_month) - (a.projected_mrr - a.revenue_current_month)
      case 'confidence':
        return b.confidence_score - a.confidence_score
      default:
        return 0
    }
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Revenue Dashboard</h2>
          <p className="text-muted-foreground">
            Real-time financial analytics across all autonomous businesses
          </p>
        </div>
        <div className="flex items-center gap-2">
          {useFallback && (
            <Badge variant="outline" className="gap-1">
              <AlertCircle className="h-3 w-3" />
              Mock Data
            </Badge>
          )}
          <button
            onClick={() => {
              fetchRevenueData()
              fetchAnalytics()
            }}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-primary border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Revenue */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(metrics.total_revenue)}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              {metrics.revenue_growth_rate >= 0 ? (
                <TrendingUp className="h-3 w-3 text-green-500" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500" />
              )}
              <span className={metrics.revenue_growth_rate >= 0 ? 'text-green-500' : 'text-red-500'}>
                {formatPercentage(metrics.revenue_growth_rate)}
              </span>
              <span>from last month</span>
            </p>
          </CardContent>
        </Card>

        {/* MRR */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">MRR</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(metrics.mrr)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              ARR: {formatCurrency(metrics.arr)}
            </p>
          </CardContent>
        </Card>

        {/* Active Businesses */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Businesses</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.revenue_generating_businesses}</div>
            <p className="text-xs text-muted-foreground mt-1">
              of {metrics.active_businesses} total businesses
            </p>
          </CardContent>
        </Card>

        {/* Avg Revenue per Business */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Revenue/Business</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(metrics.avg_revenue_per_business)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              per active business
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="businesses" className="space-y-4">
        <TabsList>
          <TabsTrigger value="businesses">Business Breakdown</TabsTrigger>
          <TabsTrigger value="trends">Revenue Trends</TabsTrigger>
          <TabsTrigger value="payments">Payment Methods</TabsTrigger>
          <TabsTrigger value="analytics">Analytics & Forecasting</TabsTrigger>
        </TabsList>

        {/* Business Breakdown Tab */}
        <TabsContent value="businesses" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Revenue by Business</CardTitle>
                  <CardDescription>Top performing autonomous businesses</CardDescription>
                </div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-2 text-sm border border-input bg-background rounded-md"
                >
                  <option value="revenue">Sort by Revenue</option>
                  <option value="growth">Sort by Growth</option>
                  <option value="confidence">Sort by Confidence</option>
                </select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {sortedBusinesses.map((business) => (
                  <div
                    key={business.business_id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{business.business_name}</h4>
                        <Badge variant="outline" className="text-xs">
                          {business.business_type}
                        </Badge>
                        <Badge 
                          variant={business.status === 'active' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {business.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span>{business.payment_count} payments</span>
                        <span>Last: {formatDate(business.last_payment_date)}</span>
                        <span>Confidence: {(business.confidence_score * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">
                        {formatCurrency(business.revenue_current_month)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Projected: {formatCurrency(business.projected_mrr)}/mo
                      </div>
                      <div className="flex items-center justify-end gap-1 mt-1">
                        {business.projected_mrr > business.revenue_current_month ? (
                          <>
                            <ArrowUpRight className="h-3 w-3 text-green-500" />
                            <span className="text-xs text-green-500">
                              {formatPercentage(((business.projected_mrr - business.revenue_current_month) / business.revenue_current_month) * 100)}
                            </span>
                          </>
                        ) : (
                          <>
                            <ArrowDownRight className="h-3 w-3 text-red-500" />
                            <span className="text-xs text-red-500">
                              {formatPercentage(((business.projected_mrr - business.revenue_current_month) / business.revenue_current_month) * 100)}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Revenue Trends Tab */}
        <TabsContent value="trends" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Daily Revenue Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Daily Revenue (Last 30 Days)</CardTitle>
                <CardDescription>Revenue and payment trends over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-end justify-between gap-1">
                  {trends.slice(-30).map((trend, idx) => {
                    const maxRevenue = Math.max(...trends.map(t => t.revenue))
                    const height = (trend.revenue / maxRevenue) * 100
                    return (
                      <div
                        key={idx}
                        className="flex-1 bg-primary/20 hover:bg-primary/40 rounded-t transition-colors relative group"
                        style={{ height: `${height}%`, minHeight: '4px' }}
                        title={`${trend.date}\n${formatCurrency(trend.revenue)}\n${trend.payment_count} payments`}
                      >
                        <div className="absolute bottom-full mb-2 hidden group-hover:block bg-popover text-popover-foreground text-xs p-2 rounded shadow-lg whitespace-nowrap left-1/2 -translate-x-1/2 z-10">
                          <div className="font-semibold">{trend.date}</div>
                          <div>{formatCurrency(trend.revenue)}</div>
                          <div>{trend.payment_count} payments</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
                <div className="mt-4 text-center text-sm text-muted-foreground">
                  Hover over bars for details
                </div>
              </CardContent>
            </Card>

            {/* New Businesses Trend */}
            <Card>
              <CardHeader>
                <CardTitle>New Businesses Created</CardTitle>
                <CardDescription>Business creation velocity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-end justify-between gap-1">
                  {trends.slice(-30).map((trend, idx) => {
                    const maxNew = Math.max(...trends.map(t => t.new_businesses), 1)
                    const height = (trend.new_businesses / maxNew) * 100
                    return (
                      <div
                        key={idx}
                        className="flex-1 bg-green-500/20 hover:bg-green-500/40 rounded-t transition-colors relative group"
                        style={{ height: `${Math.max(height, 5)}%` }}
                        title={`${trend.date}\n${trend.new_businesses} new businesses`}
                      >
                        <div className="absolute bottom-full mb-2 hidden group-hover:block bg-popover text-popover-foreground text-xs p-2 rounded shadow-lg whitespace-nowrap left-1/2 -translate-x-1/2 z-10">
                          <div className="font-semibold">{trend.date}</div>
                          <div>{trend.new_businesses} new businesses</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
                <div className="mt-4 text-center text-sm text-muted-foreground">
                  Total new businesses: {trends.reduce((sum, t) => sum + t.new_businesses, 0)}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Payment Methods Tab */}
        <TabsContent value="payments" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Payment Method Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Method Distribution</CardTitle>
                <CardDescription>Revenue breakdown by payment type</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {paymentMethods.map((method) => (
                  <div key={method.method} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{method.method}</span>
                      </div>
                      <span className="text-muted-foreground">{method.percentage.toFixed(1)}%</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{method.count} transactions</span>
                      <span className="font-semibold text-foreground">{formatCurrency(method.total_amount)}</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${method.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Refund Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>Refund Statistics</CardTitle>
                <CardDescription>Refund rates and amounts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="text-sm text-muted-foreground">Total Refunds</div>
                      <div className="text-2xl font-bold">{refunds.total_refunds}</div>
                    </div>
                    <div className={`text-lg font-semibold ${refunds.refund_rate < 5 ? 'text-green-500' : 'text-yellow-500'}`}>
                      {refunds.refund_rate.toFixed(1)}%
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="text-sm text-muted-foreground">Refund Amount</div>
                      <div className="text-2xl font-bold">{formatCurrency(refunds.refund_amount)}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="text-sm text-muted-foreground">Avg Refund</div>
                      <div className="text-2xl font-bold">{formatCurrency(refunds.avg_refund_amount)}</div>
                    </div>
                  </div>
                </div>

                {refunds.refund_rate < 5 && (
                  <div className="flex items-start gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <TrendingUp className="h-4 w-4 text-green-500 mt-0.5" />
                    <div className="text-sm">
                      <div className="font-medium text-green-500">Healthy refund rate</div>
                      <div className="text-muted-foreground">Below 5% industry benchmark</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Analytics & Forecasting Tab */}
        <TabsContent value="analytics" className="space-y-4">
          {/* ROI by Business */}
          <Card>
            <CardHeader>
              <CardTitle>ROI by Business</CardTitle>
              <CardDescription>Return on investment for each autonomous business</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analytics.roi_by_business.slice(0, 10).map((item) => (
                  <div key={item.business_id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="font-semibold">{item.business_name}</div>
                      <div className="text-sm text-muted-foreground">
                        Revenue: {formatCurrency(item.revenue)} • Cost: {formatCurrency(item.cost)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-green-500">
                        {item.roi_percentage.toFixed(0)}%
                      </div>
                      <div className="text-sm text-muted-foreground">
                        ROI: {formatCurrency(item.roi)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Churn Analysis */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Churn Analysis</CardTitle>
                <CardDescription>Business retention metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="text-sm font-medium">Retention Rate</span>
                    <span className="text-xl font-bold text-green-500">
                      {analytics.churn_analysis.retention_rate.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="text-sm font-medium">Churn Rate</span>
                    <span className="text-xl font-bold text-red-500">
                      {analytics.churn_analysis.churn_rate.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="text-sm font-medium">Churned Businesses</span>
                    <span className="text-xl font-bold">{analytics.churn_analysis.churned_count}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="text-sm font-medium">At Risk</span>
                    <span className="text-xl font-bold text-yellow-500">
                      {analytics.churn_analysis.at_risk_count}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Revenue Forecast */}
            <Card>
              <CardHeader>
                <CardTitle>7-Day Revenue Forecast</CardTitle>
                <CardDescription>Predicted revenue with confidence intervals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {analytics.revenue_forecast.map((forecast) => (
                    <div key={forecast.date} className="flex items-center justify-between p-2 hover:bg-accent/50 rounded transition-colors">
                      <span className="text-sm font-medium">{forecast.date}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {formatCurrency(forecast.confidence_interval_low)}
                        </span>
                        <span className="text-sm font-bold">
                          {formatCurrency(forecast.predicted_revenue)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatCurrency(forecast.confidence_interval_high)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-muted/50 rounded-lg text-sm text-muted-foreground">
                  <strong>Note:</strong> Forecasts are based on historical trends and ML predictions. 
                  Actual results may vary based on business performance.
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

