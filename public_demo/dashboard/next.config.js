/** @type {import('next').NextConfig} */
const DASHBOARD_API_ORIGIN = process.env.DASHBOARD_API_ORIGIN || 'http://localhost:8080'
const PROMETHEUS_ORIGIN = process.env.PROMETHEUS_ORIGIN || 'http://localhost:9090'
const OTEL_ORIGIN = process.env.OTEL_ORIGIN || 'http://localhost:4318'
const LOGS_ORIGIN = process.env.LOG_AGGREGATOR_ORIGIN || 'http://localhost:8081'

const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/dashboard-api/:path*',
        destination: `${DASHBOARD_API_ORIGIN}/api/:path*`,
      },
      {
        source: '/api/metrics/:path*',
        destination: `${PROMETHEUS_ORIGIN}/:path*`,
      },
      {
        source: '/api/traces/:path*',
        destination: `${OTEL_ORIGIN}/:path*`,
      },
      {
        source: '/api/logs/:path*',
        destination: `${LOGS_ORIGIN}/:path*`,
      },
    ]
  },
}

module.exports = nextConfig
