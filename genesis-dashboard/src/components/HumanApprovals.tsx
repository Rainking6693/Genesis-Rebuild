'use client'

import { useEffect, useState } from 'react'

interface HumanApproval {
  approval_id: string
  task_description: string
  risk_level: string
  requested_by: string
  requested_at: string
  status: string
}

export default function HumanApprovals() {
  const [approvals, setApprovals] = useState<HumanApproval[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchApprovals = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/approvals')
        const data = await response.json()
        setApprovals(data)
        setLoading(false)
      } catch (error) {
        console.error('Failed to fetch approvals:', error)
        setLoading(false)
      }
    }

    fetchApprovals()
    const interval = setInterval(fetchApprovals, 5000)

    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return <div className="flex items-center justify-center h-full">Loading...</div>
  }

  const pendingCount = approvals.filter(a => a.status === 'pending').length

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Human Approvals</h2>
        <p className="text-muted-foreground">Pending high-risk operations queue</p>
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <p className="text-sm font-medium text-muted-foreground">Pending Approvals</p>
        <p className="text-3xl font-bold mt-2">{pendingCount}</p>
      </div>

      <div className="space-y-4">
        {approvals.map((approval) => (
          <div
            key={approval.approval_id}
            className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold">{approval.task_description}</h3>
                  <span
                    className={`px-2 py-1 text-xs rounded-md font-medium ${
                      approval.risk_level === 'high'
                        ? 'bg-red-100 text-red-800'
                        : approval.risk_level === 'medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {approval.risk_level} risk
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>Requested by: <strong>{approval.requested_by}</strong></span>
                  <span>•</span>
                  <span>{new Date(approval.requested_at).toLocaleString()}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                  Approve
                </button>
                <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
                  Reject
                </button>
              </div>
            </div>
          </div>
        ))}
        {approvals.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No pending approvals
          </div>
        )}
      </div>
    </div>
  )
}
