'use client'

import { useEffect, useState } from 'react'

interface SystemHealth {
  status: string
  timestamp: string
  active_agents: number
  task_queue_depth: number
  uptime_seconds: number
  cpu_usage_percent: number
  memory_usage_percent: number
}

export default function OverviewDashboard() {
  const [health, setHealth] = useState<SystemHealth | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/health')
        const data = await response.json()
        setHealth(data)
        setLoading(false)
      } catch (error) {
        console.error('Failed to fetch health:', error)
        setLoading(false)
      }
    }

    fetchHealth()
    const interval = setInterval(fetchHealth, 5000) // Poll every 5 seconds

    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return <div className="flex items-center justify-center h-full">Loading...</div>
  }

  const uptimeHours = health ? (health.uptime_seconds / 3600).toFixed(1) : '0'

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">System Overview</h2>
        <p className="text-muted-foreground">Real-time Genesis system health</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Status Card */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">System Status</p>
              <p className="text-2xl font-bold text-green-600 mt-2">
                {health?.status || 'Unknown'}
              </p>
            </div>
            <div className="text-4xl">💚</div>
          </div>
        </div>

        {/* Active Agents Card */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Agents</p>
              <p className="text-2xl font-bold mt-2">{health?.active_agents || 0}</p>
            </div>
            <div className="text-4xl">🤖</div>
          </div>
        </div>

        {/* Task Queue Card */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Task Queue</p>
              <p className="text-2xl font-bold mt-2">{health?.task_queue_depth || 0}</p>
            </div>
            <div className="text-4xl">📋</div>
          </div>
        </div>

        {/* Uptime Card */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Uptime</p>
              <p className="text-2xl font-bold mt-2">{uptimeHours}h</p>
            </div>
            <div className="text-4xl">⏱️</div>
          </div>
        </div>
      </div>

      {/* Resource Usage */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">CPU Usage</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Current</span>
              <span className="font-medium">{health?.cpu_usage_percent.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all"
                style={{ width: `${health?.cpu_usage_percent || 0}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Memory Usage</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Current</span>
              <span className="font-medium">{health?.memory_usage_percent.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all"
                style={{ width: `${health?.memory_usage_percent || 0}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
