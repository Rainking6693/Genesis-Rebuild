'use client'

import { useEffect, useState } from 'react'

interface AgentStatus {
  name: string
  status: string
  last_task: string
  last_task_time: string
  tasks_completed: number
  success_rate: number
}

export default function AgentStatusGrid() {
  const [agents, setAgents] = useState<AgentStatus[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/agents')
        const data = await response.json()
        setAgents(data)
        setLoading(false)
      } catch (error) {
        console.error('Failed to fetch agents:', error)
        setLoading(false)
      }
    }

    fetchAgents()
    const interval = setInterval(fetchAgents, 5000)

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'busy':
        return 'bg-yellow-500'
      case 'idle':
        return 'bg-green-500'
      case 'error':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-full">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Agent Status Grid</h2>
        <p className="text-muted-foreground">Real-time status of all 15 Genesis agents</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.map((agent) => (
          <div
            key={agent.name}
            className="bg-card border border-border rounded-lg p-4 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-lg">{agent.name}</h3>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${getStatusColor(agent.status)}`} />
                <span className="text-sm text-muted-foreground">{agent.status}</span>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div>
                <p className="text-muted-foreground">Last Task:</p>
                <p className="font-medium truncate">{agent.last_task}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border">
                <div>
                  <p className="text-muted-foreground">Completed</p>
                  <p className="text-xl font-bold">{agent.tasks_completed}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Success Rate</p>
                  <p className="text-xl font-bold">{(agent.success_rate * 100).toFixed(1)}%</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
